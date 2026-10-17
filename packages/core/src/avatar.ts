import type { AvatarProject } from "./types";
import { clamp } from "./easing";
import { Blinker } from "./blink";
import { centroid, scaleY, translate } from "./morph";
import { Renderer } from "./renderer";
import { StateMachine } from "./state-machine";

export interface AvatarOptions {
  project: AvatarProject;
  state?: string;
  pointerTracking?: boolean;
  reducedMotion?: "auto" | "always" | "never";
  idle?: boolean;
  blink?: boolean;
}

export interface StateChange {
  from: string;
  to: string;
}

export interface Driver {
  attach(avatar: Avatar): void;
  detach(): void;
}

export interface Frame {
  stateId: string;
  time: number;
  delta: number;
  reduced: boolean;
  viewBox: AvatarProject["viewBox"];
  svg: SVGSVGElement;
}

type StateChangeHandler = (change: StateChange) => void;
type FrameHandler = (frame: Frame) => void;

export class Avatar {
  readonly element: SVGSVGElement;
  readonly project: AvatarProject;

  private readonly host: HTMLElement;
  private readonly document: Document;
  private readonly window: Window & typeof globalThis;
  private readonly machine: StateMachine;
  private readonly renderer: Renderer;
  private readonly blinker: Blinker;
  private readonly reducedMode: AvatarOptions["reducedMotion"];
  private readonly idleEnabled: boolean;
  private readonly blinkEnabled: boolean;
  private readonly bodyId: string | undefined;
  private readonly blinkIds: Set<string>;
  private readonly gazeIds: Set<string>;
  private readonly mouthId: string;
  private readonly handlers = new Set<StateChangeHandler>();
  private readonly frameHandlers = new Set<FrameHandler>();
  private readonly drivers = new Set<Driver>();

  private intensity = 0;
  private intensityTarget = 0;
  private gazeX = 0;
  private gazeY = 0;
  private gazeTargetX = 0;
  private gazeTargetY = 0;
  private reduced = false;
  private hidden = false;
  private visible = true;
  private paused = false;
  private destroyed = false;
  private frameId = 0;
  private last = 0;
  private clock = 0;
  private motionQuery: MediaQueryList | null = null;
  private observer: IntersectionObserver | null = null;

  constructor(host: HTMLElement, options: AvatarOptions) {
    this.host = host;
    this.project = options.project;
    this.document = host.ownerDocument;
    this.window = (this.document.defaultView ?? window) as Window & typeof globalThis;
    this.reducedMode = options.reducedMotion ?? "auto";
    this.idleEnabled = options.idle ?? true;
    this.blinkEnabled = options.blink ?? true;

    this.machine = new StateMachine(options.project, options.state);
    this.blinker = new Blinker(options.project.blink);
    this.renderer = new Renderer(host, options.project, this.document);

    this.bodyId = options.project.parts.find((part) => part.role === "body")?.id;
    this.blinkIds = new Set(options.project.blink.parts);
    this.gazeIds = new Set(
      options.project.parts
        .filter((part) => part.role !== "body" && /^(eye|brow)/i.test(part.id))
        .map((part) => part.id),
    );
    this.mouthId = options.project.intensity.mouth;

    this.reduced = this.resolveReduced();
    this.watchMotion();

    if (options.pointerTracking) {
      host.addEventListener("pointermove", this.onPointer);
      host.addEventListener("pointerleave", this.onPointerLeave);
    }

    this.document.addEventListener("visibilitychange", this.onVisibility);

    if (typeof this.window.IntersectionObserver === "function") {
      this.observer = new this.window.IntersectionObserver((entries) => {
        this.visible = entries.some((entry) => entry.isIntersecting);
      });
      this.observer.observe(host);
    }

    this.element = this.renderer.svg;
    this.start();
  }

  get stateId(): string {
    return this.machine.stateId;
  }

  setState(id: string, duration?: number): boolean {
    if (this.destroyed) return false;

    const from = this.machine.stateId;
    const base = duration ?? this.durationBetween(from, id);
    const final = this.reduced ? Math.min(base, 120) : base;

    if (!this.machine.setState(id, final)) return false;

    this.emit({ from, to: id });
    return true;
  }

  setIntensity(value: number): void {
    if (this.destroyed) return;

    this.intensityTarget = clamp(value);
  }

  setGaze(x: number, y: number): void {
    if (this.destroyed) return;

    this.gazeTargetX = clamp(x, -1, 1);
    this.gazeTargetY = clamp(y, -1, 1);
  }

  blink(): void {
    if (this.destroyed || this.reduced) return;

    this.blinker.trigger();
  }

  use(driver: Driver): this {
    driver.attach(this);
    this.drivers.add(driver);
    return this;
  }

  on(event: "stateChange", handler: StateChangeHandler): () => void {
    if (event !== "stateChange") return () => undefined;

    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onFrame(handler: FrameHandler): () => void {
    this.frameHandlers.add(handler);
    return () => {
      this.frameHandlers.delete(handler);
    };
  }

  pause(): void {
    if (this.paused) return;

    this.paused = true;
    this.stop();
  }

  resume(): void {
    if (!this.paused) return;

    this.paused = false;
    this.start();
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    this.stop();
    this.host.removeEventListener("pointermove", this.onPointer);
    this.host.removeEventListener("pointerleave", this.onPointerLeave);
    this.document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    this.motionQuery?.removeEventListener("change", this.onMotion);
    this.handlers.clear();
    this.frameHandlers.clear();

    for (const driver of this.drivers) driver.detach();
    this.drivers.clear();
    this.renderer.destroy();
  }

  private start(): void {
    if (this.frameId) return;

    this.last = 0;
    this.frameId = this.window.requestAnimationFrame(this.frame);
  }

  private stop(): void {
    if (!this.frameId) return;

    this.window.cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  private frame = (now: number): void => {
    this.frameId = this.window.requestAnimationFrame(this.frame);

    if (this.hidden || !this.visible) {
      this.last = now;
      return;
    }

    const delta = this.last ? Math.min(50, now - this.last) : 16;
    this.last = now;
    this.step(delta);
  };

  private step(delta: number): void {
    this.clock += delta;

    const pose = this.machine.tick(delta);
    const smoothing = 1 - Math.exp(-delta / 90);
    this.intensity += (this.intensityTarget - this.intensity) * smoothing;
    this.gazeX += (this.gazeTargetX - this.gazeX) * smoothing;
    this.gazeY += (this.gazeTargetY - this.gazeY) * smoothing;

    const closure = this.reduced ? 0 : this.blinker.update(delta);
    const eyeScale = 1 - closure * (1 - this.project.blink.amount);
    const mouthScale = 1 + this.intensity * (this.project.intensity.scaleY - 1);
    const offset = this.project.viewBox[2] * 0.06;
    const gazeX = this.gazeX * offset;
    const gazeY = this.gazeY * offset;
    const wobble = !this.reduced && this.idleEnabled ? 0.06 : 0;

    for (const part of this.project.parts) {
      const points = pose[part.id];
      if (!points) continue;

      if (this.gazeIds.has(part.id)) translate(points, gazeX, gazeY);

      if (this.blinkIds.has(part.id)) {
        scaleY(points, eyeScale, centroid(points)[1]);
      }

      if (part.id === this.mouthId && mouthScale !== 1) {
        scaleY(points, mouthScale, centroid(points)[1]);
      }

      if (part.id === this.bodyId && wobble > 0) {
        for (let index = 0; index < points.length; index += 1) {
          points[index]![1] += Math.sin(this.clock * 0.0013 + index * 0.7) * wobble;
        }
      }
    }

    this.renderer.render(pose, this.breathing());

    if (this.frameHandlers.size > 0) {
      const frame: Frame = {
        stateId: this.machine.stateId,
        time: this.clock,
        delta,
        reduced: this.reduced,
        viewBox: this.project.viewBox,
        svg: this.renderer.svg,
      };

      for (const handler of this.frameHandlers) handler(frame);
    }
  }

  private breathing(): number {
    if (this.reduced || !this.idleEnabled) return 1;

    const loop = this.machine.state.loop ?? "none";
    let scale = 1;

    if (loop === "breathe") {
      scale += 0.012 * Math.sin(this.clock / 700);
    } else if (loop === "pulse") {
      scale += 0.02 * Math.sin(this.clock / 320);
    }

    if (this.intensity > 0.01) {
      scale += 0.015 * this.intensity * Math.sin(this.clock / 160);
    }

    return scale;
  }

  private durationBetween(from: string, to: string): number {
    const transition =
      this.project.transitions.find((item) => item.from === from && item.to === to) ??
      this.project.transitions.find((item) => item.from === "*" && item.to === to);

    return transition?.duration ?? this.project.defaults.duration;
  }

  private emit(change: StateChange): void {
    for (const handler of this.handlers) handler(change);
  }

  private resolveReduced(): boolean {
    if (this.reducedMode === "always") return true;
    if (this.reducedMode === "never") return false;

    return this.window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }

  private watchMotion(): void {
    if (this.reducedMode !== "auto" || typeof this.window.matchMedia !== "function") return;

    this.motionQuery = this.window.matchMedia("(prefers-reduced-motion: reduce)");
    this.motionQuery.addEventListener("change", this.onMotion);
  }

  private onMotion = (event: MediaQueryListEvent): void => {
    this.reduced = event.matches;
  };

  private onVisibility = (): void => {
    this.hidden = this.document.hidden;
  };

  private onPointer = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;

    const rect = this.host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    this.setGaze(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    );
  };

  private onPointerLeave = (): void => {
    this.setGaze(0, 0);
  };
}

export function create(host: HTMLElement, options: AvatarOptions): Avatar {
  return new Avatar(host, options);
}
