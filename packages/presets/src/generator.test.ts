import { describe, expect, it } from "vitest";
import { STATE_IDS, parseProject } from "@pulse-live/schema";
import { blip, mochi } from "../src/index";
import { buildProject } from "../src/generator";

const characters = [blip, mochi];

describe.each(characters)("preset $name", (character) => {
  const project = parseProject(buildProject(character));

  it("punya 14 state dan 6 part", () => {
    expect(project.states).toHaveLength(STATE_IDS.length);
    expect(project.parts).toHaveLength(6);
    expect(project.states.map((state) => state.id)).toEqual([...STATE_IDS]);
  });

  it("memakai jumlah titik yang konsisten di setiap state", () => {
    for (const state of project.states) {
      for (const part of project.parts) {
        expect(state.parts[part.id]?.points).toHaveLength(part.pointCount);
      }
    }
  });

  it("menjaga semua titik di dalam viewBox dan tanpa nilai tidak terbatas", () => {
    const [minX, minY, width, height] = project.viewBox;

    for (const state of project.states) {
      for (const part of project.parts) {
        for (const [x, y] of state.parts[part.id]!.points) {
          expect(Number.isFinite(x)).toBe(true);
          expect(Number.isFinite(y)).toBe(true);
          expect(x).toBeGreaterThanOrEqual(minX);
          expect(x).toBeLessThanOrEqual(minX + width);
          expect(y).toBeGreaterThanOrEqual(minY);
          expect(y).toBeLessThanOrEqual(minY + height);
        }
      }
    }
  });

  it("tidak menghasilkan titik duplikat berurutan", () => {
    for (const state of project.states) {
      for (const part of project.parts) {
        const points = state.parts[part.id]!.points;

        for (let index = 0; index < points.length; index += 1) {
          const current = points[index]!;
          const next = points[(index + 1) % points.length]!;
          const distance = Math.hypot(next[0] - current[0], next[1] - current[1]);
          expect(distance).toBeGreaterThan(0.01);
        }
      }
    }
  });

  it("menyediakan transisi wildcard untuk setiap state", () => {
    const wildcardTargets = project.transitions
      .filter((transition) => transition.from === "*")
      .map((transition) => transition.to);

    expect(new Set(wildcardTargets)).toEqual(new Set(STATE_IDS));
  });

  it("menandai mata sebagai part yang berkedip", () => {
    expect(project.blink.parts).toEqual(["eyeL", "eyeR"]);
  });
});
