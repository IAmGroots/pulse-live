import { describe, expect, it } from "vitest";
import { buildPath } from "./path";
import type { Point } from "./types";

const square: Point[] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];

describe("buildPath", () => {
  it("membangun path tertutup dengan satu kurva per titik", () => {
    const path = buildPath(square);
    expect(path.startsWith("M")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
    expect(path.match(/C/g)).toHaveLength(square.length);
  });

  it("mengembalikan string kosong untuk kontur terlalu pendek", () => {
    expect(
      buildPath([
        [0, 0],
        [1, 1],
      ]),
    ).toBe("");
  });

  it("membulatkan koordinat ke dua desimal", () => {
    const path = buildPath([
      [0.123456, 0],
      [10.98765, 0],
      [10, 10],
    ]);
    expect(path).not.toContain("0.123456");
    expect(path).toContain("10.99");
  });
});
