export { create, Avatar } from "./avatar";
export type { AvatarOptions, Driver, Frame, StateChange } from "./avatar";
export { cubicBezier, clamp, resolveEasing } from "./easing";
export type { Easing } from "./easing";
export { buildPath } from "./path";
export { centroid, clonePose, lerpPose, poseOf, scaleY, toPose, translate } from "./morph";
export type { Pose } from "./morph";
export { Blinker } from "./blink";
export { Renderer } from "./renderer";
export { StateMachine } from "./state-machine";
export type {
  AvatarProject,
  AvatarState,
  LoopKind,
  PartDef,
  PartPose,
  PartRole,
  Point,
  Transition,
} from "./types";
