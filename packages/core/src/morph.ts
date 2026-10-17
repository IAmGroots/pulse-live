import type { AvatarState, PartPose, Point } from "./types";

export type Pose = Record<string, Point[]>;

export function toPose(parts: Record<string, PartPose>): Pose {
  const pose: Pose = {};

  for (const id of Object.keys(parts)) {
    pose[id] = parts[id]!.points;
  }

  return pose;
}

export function poseOf(state: AvatarState): Pose {
  return toPose(state.parts);
}

export function clonePose(pose: Pose): Pose {
  const clone: Pose = {};

  for (const id of Object.keys(pose)) {
    clone[id] = pose[id]!.map(([x, y]) => [x, y] as Point);
  }

  return clone;
}

export function lerpPose(from: Pose, to: Pose, t: number): Pose {
  const pose: Pose = {};

  for (const id of Object.keys(from)) {
    const a = from[id]!;
    const b = to[id] ?? a;
    const points: Point[] = [];

    for (let index = 0; index < a.length; index += 1) {
      const start = a[index]!;
      const end = b[index] ?? start;
      points.push([start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t]);
    }

    pose[id] = points;
  }

  return pose;
}

export function centroid(points: Point[]): Point {
  let x = 0;
  let y = 0;

  for (const point of points) {
    x += point[0];
    y += point[1];
  }

  return [x / points.length, y / points.length];
}

export function translate(points: Point[], dx: number, dy: number): void {
  for (const point of points) {
    point[0] += dx;
    point[1] += dy;
  }
}

export function scaleY(points: Point[], factor: number, centerY: number): void {
  for (const point of points) {
    point[1] = centerY + (point[1] - centerY) * factor;
  }
}
