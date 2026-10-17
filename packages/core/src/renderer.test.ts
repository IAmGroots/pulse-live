// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { Renderer } from "./renderer";
import type { AvatarProject, Point } from "./types";

const square: Point[] = [
  [10, 10],
  [40, 10],
  [40, 40],
  [10, 40],
];

const hole: Point[] = [
  [20, 20],
  [30, 20],
  [30, 30],
  [20, 30],
];

const project: AvatarProject = {
  schemaVersion: 1,
  id: "test",
  name: "Test avatar",
  viewBox: [0, 0, 100, 100],
  renderMode: "cutout",
  parts: [
    { id: "body", role: "body", pointCount: 4, z: 0 },
    { id: "eyeL", role: "hole", pointCount: 4, z: 1 },
    { id: "browL", role: "ink", pointCount: 4, z: 2 },
  ],
  states: [],
  transitions: [],
  defaults: { duration: 100, easing: "linear" },
  blink: { parts: ["eyeL"], interval: [1000, 2000], duration: 100, amount: 0.08 },
  intensity: { mouth: "eyeL", scaleY: 1 },
};

const pose = { body: square, eyeL: hole, browL: hole };

describe("Renderer", () => {
  it("memasang svg dengan viewBox dan peran gambar", () => {
    const host = document.createElement("div");
    new Renderer(host, project, document);
    const svg = host.querySelector("svg");

    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 100 100");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.querySelector("title")?.textContent).toBe("Test avatar");
  });

  it("menggabungkan body dan lubang dalam satu path cutout", () => {
    const host = document.createElement("div");
    const renderer = new Renderer(host, project, document);

    renderer.render(pose, 1);
    const path = host.querySelector("path");

    expect(path?.getAttribute("fill-rule")).toBe("evenodd");
    expect(path?.getAttribute("d")?.match(/M/g)).toHaveLength(2);
  });

  it("memakai mask untuk mode layered", () => {
    const host = document.createElement("div");
    const renderer = new Renderer(host, { ...project, renderMode: "layered" }, document);

    renderer.render(pose, 1);

    expect(host.querySelector("mask")).toBeTruthy();
    expect(host.querySelector("path")?.getAttribute("mask")).toMatch(/^url\(#pulse-mask-/);
  });

  it("menerapkan skala pada grup", () => {
    const host = document.createElement("div");
    const renderer = new Renderer(host, project, document);

    renderer.render(pose, 1.02);
    const group = host.querySelector("g");

    expect(group?.style.transform).toBe("scale(1.0200)");
  });

  it("membersihkan svg saat destroy", () => {
    const host = document.createElement("div");
    const renderer = new Renderer(host, project, document);

    renderer.destroy();
    expect(host.querySelector("svg")).toBeNull();
  });
});
