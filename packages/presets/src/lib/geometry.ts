import type { Point } from "@pulse-live/schema";

export function polygonFromRadial(
  count: number,
  radiusAt: (theta: number) => number,
  cx = 50,
  cy = 50,
): Point[] {
  const points: Point[] = [];
  for (let index = 0; index < count; index += 1) {
    const theta = (index / count) * Math.PI * 2;
    const radius = radiusAt(theta);
    points.push([cx + Math.cos(theta) * radius, cy + Math.sin(theta) * radius]);
  }
  return points;
}

export function ellipsePoints(rx: number, ry: number, count: number): Point[] {
  const points: Point[] = [];
  for (let index = 0; index < count; index += 1) {
    const theta = (index / count) * Math.PI * 2;
    points.push([Math.cos(theta) * rx, Math.sin(theta) * ry]);
  }
  return points;
}

export function lensPoints(
  count: number,
  width: number,
  topY: (u: number) => number,
  bottomY: (u: number) => number,
): Point[] {
  const topCount = Math.ceil(count / 2);
  const bottomCount = count - topCount;
  const points: Point[] = [];

  for (let index = 0; index < topCount; index += 1) {
    const u = topCount === 1 ? 0 : -1 + (2 * index) / (topCount - 1);
    points.push([(u * width) / 2, topY(u)]);
  }

  for (let index = 0; index < bottomCount; index += 1) {
    const u = bottomCount === 1 ? 0 : 1 - (2 * index) / (bottomCount - 1);
    points.push([(u * width) / 2, bottomY(u)]);
  }

  return points;
}

export function resampleClosed(points: Point[], count: number): Point[] {
  if (points.length < 3) {
    throw new Error("Kontur butuh minimal 3 titik.");
  }

  const segments: number[] = [];
  let total = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index]!;
    const next = points[(index + 1) % points.length]!;
    const length = Math.hypot(next[0] - current[0], next[1] - current[1]);
    segments.push(length);
    total += length;
  }

  if (total === 0) {
    throw new Error("Kontur tidak punya panjang.");
  }

  const step = total / count;
  const result: Point[] = [];
  let segmentIndex = 0;
  let segmentStart = 0;

  for (let index = 0; index < count; index += 1) {
    const target = index * step;

    while (segmentIndex < points.length - 1 && segmentStart + segments[segmentIndex]! < target) {
      segmentStart += segments[segmentIndex]!;
      segmentIndex += 1;
    }

    const length = segments[segmentIndex]!;
    const t = length === 0 ? 0 : (target - segmentStart) / length;
    const current = points[segmentIndex]!;
    const next = points[(segmentIndex + 1) % points.length]!;

    result.push([current[0] + (next[0] - current[0]) * t, current[1] + (next[1] - current[1]) * t]);
  }

  return result;
}

export function signedArea(points: Point[]): number {
  let area = 0;

  for (let index = 0; index < points.length; index += 1) {
    const [x1, y1] = points[index]!;
    const [x2, y2] = points[(index + 1) % points.length]!;
    area += x1 * y2 - x2 * y1;
  }

  return area / 2;
}

export function ensureWinding(points: Point[], clockwise: boolean): Point[] {
  const isClockwise = signedArea(points) > 0;

  if (isClockwise === clockwise) {
    return points;
  }

  return [points[0]!, ...points.slice(1).reverse()];
}

export interface TransformOptions {
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  originX?: number;
  originY?: number;
}

export function transformPoints(points: Point[], options: TransformOptions = {}): Point[] {
  const { x = 0, y = 0, scaleX = 1, scaleY = 1, rotate = 0, originX = 0, originY = 0 } = options;
  const radians = (rotate * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return points.map(([px, py]) => {
    const dx = (px - originX) * scaleX;
    const dy = (py - originY) * scaleY;
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    return [originX + rx + x, originY + ry + y] as Point;
  });
}
