import type { PartId, Point, StateId } from "@pulse-live/schema";
import { PART_POINT_COUNTS } from "@pulse-live/schema";
import {
  ellipsePoints,
  ensureWinding,
  lensPoints,
  polygonFromRadial,
  resampleClosed,
  transformPoints,
} from "./geometry";

export interface BodyShape {
  radius: number;
  a2: number;
  a3: number;
  a4: number;
  phase2: number;
  phase3: number;
  squishY: number;
  tilt: number;
}

export interface EyeShape {
  open: number;
  width: number;
  height: number;
  spread: number;
  y: number;
  gazeX: number;
  gazeY: number;
}

export interface BrowShape {
  width: number;
  thickness: number;
  lift: number;
  tilt: number;
  y: number;
}

export interface MouthShape {
  width: number;
  curve: number;
  open: number;
  y: number;
}

export interface PoseOverrides {
  body?: Partial<BodyShape>;
  eye?: Partial<EyeShape>;
  brow?: Partial<BrowShape>;
  mouth?: Partial<MouthShape>;
  leftEye?: Partial<EyeShape>;
  rightEye?: Partial<EyeShape>;
  leftBrow?: Partial<BrowShape>;
  rightBrow?: Partial<BrowShape>;
}

export interface CharacterConfig {
  id: string;
  name: string;
  body: BodyShape;
  eye: EyeShape;
  brow: BrowShape;
  mouth: MouthShape;
  poses: Record<StateId, PoseOverrides>;
}

export interface ResolvedPose {
  body: BodyShape;
  leftEye: EyeShape;
  rightEye: EyeShape;
  leftBrow: BrowShape;
  rightBrow: BrowShape;
  mouth: MouthShape;
}

export function resolvePose(character: CharacterConfig, overrides: PoseOverrides): ResolvedPose {
  const body = { ...character.body, ...overrides.body };
  const eye = { ...character.eye, ...overrides.eye };
  const brow = { ...character.brow, ...overrides.brow };
  const mouth = { ...character.mouth, ...overrides.mouth };

  return {
    body,
    leftEye: { ...eye, ...overrides.leftEye },
    rightEye: { ...eye, ...overrides.rightEye },
    leftBrow: { ...brow, ...overrides.leftBrow },
    rightBrow: { ...brow, ...overrides.rightBrow },
    mouth,
  };
}

export function buildPart(part: PartId, pose: ResolvedPose): Point[] {
  switch (part) {
    case "body":
      return buildBody(pose.body);
    case "eyeL":
      return buildEye(pose.leftEye, -1);
    case "eyeR":
      return buildEye(pose.rightEye, 1);
    case "browL":
      return buildBrow(pose.leftBrow, -1);
    case "browR":
      return buildBrow(pose.rightBrow, 1);
    case "mouth":
      return buildMouth(pose.mouth);
    default:
      throw new Error(`Part "${String(part)}" tidak dikenal.`);
  }
}

function buildBody(shape: BodyShape): Point[] {
  const raw = polygonFromRadial(128, (theta) => {
    const wobble =
      shape.a2 * Math.cos(2 * theta + shape.phase2) +
      shape.a3 * Math.cos(3 * theta + shape.phase3) +
      shape.a4 * Math.cos(4 * theta);
    return shape.radius * (1 + wobble);
  });

  const shaped = transformPoints(raw, {
    scaleY: shape.squishY,
    rotate: shape.tilt,
    originX: 50,
    originY: 50,
  });

  return ensureWinding(resampleClosed(shaped, PART_POINT_COUNTS.body), false);
}

function buildEye(shape: EyeShape, side: -1 | 1): Point[] {
  const rx = Math.max(0.6, shape.width / 2);
  const ry = Math.max(0.3, (shape.height / 2) * Math.max(0.06, shape.open));
  const raw = ellipsePoints(rx, ry, PART_POINT_COUNTS.eyeL);
  const placed = transformPoints(raw, {
    x: 50 + side * shape.spread + shape.gazeX,
    y: shape.y + shape.gazeY,
  });

  return ensureWinding(resampleClosed(placed, PART_POINT_COUNTS.eyeL), false);
}

function buildBrow(shape: BrowShape, side: -1 | 1): Point[] {
  const thickness = Math.max(0.4, shape.thickness);
  const arch = 0.55;
  const raw = lensPoints(
    PART_POINT_COUNTS.browL,
    shape.width,
    (u) => -thickness / 2 - (1 - u * u) * arch,
    (u) => thickness / 2 - (1 - u * u) * arch,
  );
  const placed = transformPoints(raw, {
    x: 50 + side * shape.width * 0.82,
    y: shape.y - shape.lift,
    rotate: shape.tilt * side,
  });

  return ensureWinding(resampleClosed(placed, PART_POINT_COUNTS.browL), false);
}

function buildMouth(shape: MouthShape): Point[] {
  const thickness = Math.max(0.9, shape.width * 0.085);
  const depth = shape.width * 0.2;
  const raw = lensPoints(
    PART_POINT_COUNTS.mouth,
    shape.width,
    (u) => shape.curve * depth * (1 - u * u) - thickness - shape.open * 0.6 * (1 - u * u),
    (u) => shape.curve * depth * (1 - u * u) + thickness + shape.open * 1.4 * (1 - u * u),
  );
  const placed = transformPoints(raw, { x: 50, y: shape.y });

  return ensureWinding(resampleClosed(placed, PART_POINT_COUNTS.mouth), false);
}
