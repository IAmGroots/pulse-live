import { describe, expect, it } from "vitest";
import { centroid, clonePose, lerpPose, scaleY, translate } from "./morph";
import type { Point } from "./types";

const points: Point[] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];

describe("morph", () => {
  it("mengembalikan titik awal dan akhir pada t 0 dan 1", () => {
    const from = { body: points };
    const to = { body: points.map(([x, y]) => [x + 10, y + 5] as Point) };

    expect(lerpPose(from, to, 0).body).toEqual(points);
    expect(lerpPose(from, to, 1).body).toEqual(to.body);
  });

  it("menginterpolasi titik tengah", () => {
    const from = { body: [[0, 0] as Point] };
    const to = { body: [[10, 20] as Point] };
    expect(lerpPose(from, to, 0.5).body).toEqual([[5, 10]]);
  });

  it("menyalin pose tanpa berbagi referensi titik", () => {
    const pose = { body: points };
    const clone = clonePose(pose);
    clone.body![0]![0] = 99;
    expect(pose.body[0]![0]).toBe(0);
  });

  it("menghitung pusat poligon", () => {
    expect(centroid(points)).toEqual([5, 5]);
  });

  it("menggeser titik secara in place", () => {
    const copy = clonePose({ body: points }).body!;
    translate(copy, 2, -3);
    expect(copy[0]).toEqual([2, -3]);
  });

  it("menskalakan sumbu Y di sekitar pusat", () => {
    const copy = clonePose({ body: points }).body!;
    scaleY(copy, 0.5, 5);
    expect(copy[0]).toEqual([0, 2.5]);
    expect(copy[2]).toEqual([10, 7.5]);
  });
});
