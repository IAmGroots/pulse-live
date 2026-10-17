// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "./avatar";
import type { AvatarOptions } from "./avatar";
import type { AvatarProject, Point } from "./types";

function square(offset: number): Point[] {
  return [
    [10 + offset, 10],
    [40 + offset, 10],
    [40 + offset, 40],
    [10 + offset, 40],
  ];
}

const project: AvatarProject = {
  schemaVersion: 1,
  id: "test",
  name: "Test avatar",
  viewBox: [0, 0, 100, 100],
  renderMode: "cutout",
  parts: [
    { id: "body", role: "body", pointCount: 4, z: 0 },
    { id: "eyeL", role: "hole", pointCount: 4, z: 1 },
    { id: "eyeR", role: "hole", pointCount: 4, z: 1 },
    { id: "mouth", role: "hole", pointCount: 4, z: 1 },
  ],
  states: [
    {
      id: "idle",
      parts: {
        body: { points: square(0) },
        eyeL: { points: square(1) },
        eyeR: { points: square(2) },
        mouth: { points: square(3) },
      },
      loop: "none",
      duration: 1000,
      morph: 100,
    },
    {
      id: "happy",
      parts: {
        body: { points: square(10) },
        eyeL: { points: square(11) },
        eyeR: { points: square(12) },
        mouth: { points: square(13) },
      },
      loop: "none",
      duration: 1000,
      morph: 100,
    },
  ],
  transitions: [],
  defaults: { duration: 100, easing: "linear" },
  blink: { parts: ["eyeL", "eyeR"], interval: [10000, 10000], duration: 100, amount: 0.08 },
  intensity: { mouth: "mouth", scaleY: 2 },
};

function mount(overrides: Partial<AvatarOptions> = {}) {
  const host = document.createElement("div");
  document.body.append(host);

  let callback: FrameRequestCallback | null = null;
  const cancel = vi.fn();

  const raf = vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((next: FrameRequestCallback) => {
      callback = next;
      return 1;
    });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(cancel);

  const avatar = new Avatar(host, {
    project,
    state: "idle",
    reducedMotion: "never",
    ...overrides,
  });

  function advance(delta: number): void {
    const next = callback;
    callback = null;
    next?.(performance.now() + delta);
  }

  return { host, avatar, advance, cancel, raf };
}

describe("Avatar", () => {
  it("memasang svg ke host dan memakai state awal", () => {
    const { host, avatar } = mount();

    expect(host.querySelector("svg")).toBeTruthy();
    expect(avatar.stateId).toBe("idle");
  });

  it("mengirim event stateChange hanya untuk perubahan nyata", () => {
    const { avatar } = mount();
    const handler = vi.fn();

    avatar.on("stateChange", handler);
    expect(avatar.setState("idle")).toBe(false);
    expect(handler).not.toHaveBeenCalled();

    expect(avatar.setState("happy")).toBe(true);
    expect(handler).toHaveBeenCalledWith({ from: "idle", to: "happy" });
  });

  it("memperbarui path selama transisi", () => {
    const { host, avatar, advance } = mount();
    const path = host.querySelector("path")!;

    advance(0);
    const initial = path.getAttribute("d");
    avatar.setState("happy");
    advance(50);

    expect(path.getAttribute("d")).not.toBe(initial);
  });

  it("memperbesar mulut saat intensity naik", () => {
    const { host, avatar, advance } = mount();
    const path = host.querySelector("path")!;

    advance(0);
    const before = path.getAttribute("d");
    avatar.setIntensity(1);

    for (let index = 0; index < 40; index += 1) advance(16);

    expect(path.getAttribute("d")).not.toBe(before);
  });

  it("menghentikan dan melanjutkan frame loop", () => {
    const { avatar, advance, cancel } = mount();

    avatar.pause();
    expect(cancel).toHaveBeenCalled();

    const request = vi.spyOn(window, "requestAnimationFrame");
    avatar.resume();
    expect(request).toHaveBeenCalled();
    advance(16);
  });

  it("mematikan blink dan idle saat reduced motion", () => {
    const { host, avatar, advance } = mount({ reducedMotion: "always" });
    const path = host.querySelector("path")!;

    advance(0);
    const first = path.getAttribute("d");
    advance(16);
    expect(path.getAttribute("d")).toBe(first);

    avatar.blink();
    advance(16);
    expect(path.getAttribute("d")).toBe(first);
  });

  it("memakai durasi pendek saat reduced motion", () => {
    const { avatar, advance } = mount({ reducedMotion: "always" });
    const frames: number[] = [];

    avatar.onFrame((frame) => frames.push(frame.delta));
    avatar.setState("happy", 1000);
    advance(16);

    expect(frames).toHaveLength(1);
  });

  it("meneruskan frame ke handler onFrame", () => {
    const { avatar, advance } = mount();
    const handler = vi.fn();

    avatar.onFrame(handler);
    advance(16);

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ stateId: "idle", reduced: false }),
    );
  });

  it("membersihkan svg dan handler saat destroy", () => {
    const { host, avatar } = mount();
    const handler = vi.fn();

    avatar.on("stateChange", handler);
    avatar.destroy();

    expect(host.querySelector("svg")).toBeNull();
    expect(avatar.setState("happy")).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it("melepas driver saat destroy", () => {
    const { avatar } = mount();
    const detach = vi.fn();
    const attach = vi.fn();

    avatar.use({ attach, detach });
    expect(attach).toHaveBeenCalledWith(avatar);

    avatar.destroy();
    expect(detach).toHaveBeenCalled();
  });
});
