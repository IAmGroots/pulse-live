import { describe, expect, it } from "vitest";
import type { PartDef, Transition } from "./index";
import { parseProject, safeParseProject } from "./index";

function circlePoints(count: number, radius = 10): [number, number][] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
  });
}

function fixture() {
  const parts: PartDef[] = [{ id: "body", role: "body", pointCount: 8, z: 0 }];
  const transitions: Transition[] = [];

  return {
    schemaVersion: 1 as const,
    id: "test",
    name: "Test",
    viewBox: [0, 0, 100, 100] as [number, number, number, number],
    renderMode: "cutout" as const,
    parts,
    states: [
      {
        id: "idle",
        parts: { body: { points: circlePoints(8) } },
        duration: 1000,
        morph: 300,
      },
    ],
    transitions,
    defaults: { duration: 300, easing: "easeInOut" },
    blink: { parts: [], interval: [2000, 4000] as [number, number], duration: 120, amount: 0.08 },
    intensity: { mouth: "body", scaleY: 1 },
  };
}

describe("avatarProjectSchema", () => {
  it("menerima project minimal yang valid", () => {
    expect(safeParseProject(fixture()).success).toBe(true);
  });

  it("menolak jumlah titik yang tidak sesuai", () => {
    const project = fixture();
    project.states[0]!.parts.body.points = circlePoints(7);
    const result = safeParseProject(project);
    expect(result.success).toBe(false);
  });

  it("menolak titik di luar viewBox", () => {
    const project = fixture();
    project.states[0]!.parts.body.points[0] = [140, 50];
    const result = safeParseProject(project);
    expect(result.success).toBe(false);
  });

  it("menolak state tanpa part yang didefinisikan", () => {
    const project = fixture();
    project.parts.push({ id: "mouth", role: "hole", pointCount: 8, z: 1 });
    const result = safeParseProject(project);
    expect(result.success).toBe(false);
  });

  it("menolak transisi ke state yang tidak ada", () => {
    const project = fixture();
    project.transitions.push({ from: "idle", to: "thinking", duration: 300, easing: "easeInOut" });
    const result = safeParseProject(project);
    expect(result.success).toBe(false);
  });

  it("mengembalikan project yang sudah diparse", () => {
    const project = parseProject(fixture());
    expect(project.states[0]!.id).toBe("idle");
  });
});
