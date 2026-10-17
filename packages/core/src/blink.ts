import type { AvatarProject } from "./types";

export class Blinker {
  private readonly options: AvatarProject["blink"];
  private clock = 0;
  private next = 0;
  private progress = 0;
  private active = false;

  constructor(options: AvatarProject["blink"]) {
    this.options = options;
    this.schedule();
  }

  update(delta: number): number {
    this.clock += delta;

    if (!this.active && this.clock >= this.next) {
      this.active = true;
      this.progress = 0;
    }

    if (!this.active) return 0;

    this.progress += delta / Math.max(1, this.options.duration);

    if (this.progress >= 1) {
      this.active = false;
      this.progress = 0;
      this.schedule();
      return 0;
    }

    return Math.sin(Math.PI * this.progress);
  }

  trigger(): void {
    if (this.active) return;

    this.active = true;
    this.progress = 0;
  }

  private schedule(): void {
    const [min, max] = this.options.interval;
    this.clock = 0;
    this.next = min + Math.random() * Math.max(0, max - min);
  }
}
