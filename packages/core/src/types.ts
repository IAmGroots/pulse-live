export type Point = [number, number];

export type PartRole = "body" | "hole" | "ink" | "overlay";

export type LoopKind = "breathe" | "pulse" | "dots" | "arc" | "none";

export interface PartDef {
  id: string;
  role: PartRole;
  pointCount: number;
  z: number;
}

export interface PartPose {
  points: Point[];
  opacity?: number;
}

export interface AvatarState {
  id: string;
  parts: Record<string, PartPose>;
  loop?: LoopKind;
  duration: number;
  morph: number;
}

export interface Transition {
  from: string;
  to: string;
  duration: number;
  easing: string;
}

export interface AvatarProject {
  schemaVersion: 1;
  id: string;
  name: string;
  viewBox: [number, number, number, number];
  renderMode: "cutout" | "layered";
  parts: PartDef[];
  states: AvatarState[];
  transitions: Transition[];
  defaults: { duration: number; easing: string };
  blink: {
    parts: string[];
    interval: [number, number];
    duration: number;
    amount: number;
  };
  intensity: { mouth: string; scaleY: number };
}
