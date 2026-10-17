import type { Point } from "./types";

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildPath(points: Point[], closed = true): string {
  const count = points.length;
  if (count < 3) return "";

  const at = (index: number) => points[(index + count) % count]!;
  const first = points[0]!;
  const segments: string[] = [`M${round(first[0])} ${round(first[1])}`];
  const last = closed ? count : count - 1;

  for (let index = 0; index < last; index += 1) {
    const previous = at(index - 1);
    const start = at(index);
    const end = at(index + 1);
    const next = at(index + 2);

    const c1x = start[0] + (end[0] - previous[0]) / 6;
    const c1y = start[1] + (end[1] - previous[1]) / 6;
    const c2x = end[0] - (next[0] - start[0]) / 6;
    const c2y = end[1] - (next[1] - start[1]) / 6;

    segments.push(
      `C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(end[0])} ${round(end[1])}`,
    );
  }

  if (closed) segments.push("Z");

  return segments.join("");
}
