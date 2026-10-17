import type { AvatarProject, AvatarState, Transition } from "./types";
import type { Easing } from "./easing";
import { clamp, resolveEasing } from "./easing";
import type { Pose } from "./morph";
import { clonePose, lerpPose, poseOf } from "./morph";

export class StateMachine {
  private readonly states = new Map<string, AvatarState>();
  private readonly transitions = new Map<string, Transition>();
  private readonly project: AvatarProject;

  private current: AvatarState;
  private target: AvatarState;
  private from: Pose | null = null;
  private elapsed = 0;
  private duration = 0;
  private easing: Easing = resolveEasing("easeInOut");
  private clock = 0;

  constructor(project: AvatarProject, initial?: string) {
    this.project = project;

    for (const state of project.states) {
      this.states.set(state.id, state);
    }

    for (const transition of project.transitions) {
      this.transitions.set(`${transition.from}->${transition.to}`, transition);
    }

    const start = (initial && this.states.get(initial)) ?? project.states[0];

    if (!start) {
      throw new Error("Project tidak punya state.");
    }

    this.current = start;
    this.target = start;
  }

  get stateId(): string {
    return this.from ? this.target.id : this.current.id;
  }

  get state(): AvatarState {
    return this.from ? this.target : this.current;
  }

  get transitioning(): boolean {
    return this.from !== null;
  }

  get time(): number {
    return this.clock;
  }

  setState(id: string, duration?: number, easing?: string): boolean {
    const next = this.states.get(id);

    if (!next) return false;
    if (!this.from && next.id === this.current.id) return false;

    this.from = this.from ? this.sample() : clonePose(poseOf(this.current));
    this.target = next;

    const transition = this.transitionBetween(this.current.id, id);
    this.duration = duration ?? transition?.duration ?? this.project.defaults.duration;
    this.easing = resolveEasing(easing ?? transition?.easing ?? this.project.defaults.easing);
    this.elapsed = 0;

    return true;
  }

  tick(delta: number): Pose {
    this.clock += delta;

    if (!this.from) {
      return clonePose(poseOf(this.current));
    }

    this.elapsed += delta;

    const raw = this.duration <= 0 ? 1 : clamp(this.elapsed / this.duration);
    const pose = lerpPose(this.from, poseOf(this.target), this.easing(raw));

    if (raw >= 1) {
      this.current = this.target;
      this.from = null;
    }

    return pose;
  }

  private sample(): Pose {
    if (!this.from) return clonePose(poseOf(this.current));

    const raw = this.duration <= 0 ? 1 : clamp(this.elapsed / this.duration);

    return lerpPose(this.from, poseOf(this.target), this.easing(raw));
  }

  private transitionBetween(from: string, to: string): Transition | undefined {
    return this.transitions.get(`${from}->${to}`) ?? this.transitions.get(`*->${to}`);
  }
}
