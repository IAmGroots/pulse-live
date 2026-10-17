import { describe, expect, it } from "vitest";
import { StateMachine } from "./state-machine";
import type { AvatarProject, Point } from "./types";

function square(offset: number): Point[] {
  return [
    [offset, offset],
    [offset + 10, offset],
    [offset + 10, offset + 10],
    [offset, offset + 10],
  ];
}

const project: AvatarProject = {
  schemaVersion: 1,
  id: "test",
  name: "Test",
  viewBox: [0, 0, 100, 100],
  renderMode: "cutout",
  parts: [{ id: "body", role: "body", pointCount: 4, z: 0 }],
  states: [
    {
      id: "idle",
      parts: { body: { points: square(0) } },
      duration: 1000,
      morph: 300,
    },
    {
      id: "happy",
      parts: { body: { points: square(20) } },
      duration: 1000,
      morph: 300,
    },
  ],
  transitions: [{ from: "*", to: "happy", duration: 100, easing: "linear" }],
  defaults: { duration: 100, easing: "linear" },
  blink: { parts: [], interval: [1000, 2000], duration: 100, amount: 0.08 },
  intensity: { mouth: "body", scaleY: 1 },
};

describe("StateMachine", () => {
  it("mulai dari state awal", () => {
    const machine = new StateMachine(project);
    expect(machine.stateId).toBe("idle");
    expect(machine.transitioning).toBe(false);
  });

  it("mengabaikan state yang tidak ada", () => {
    const machine = new StateMachine(project);
    expect(machine.setState("tidak-ada")).toBe(false);
  });

  it("mengabaikan state yang sama saat tidak bertransisi", () => {
    const machine = new StateMachine(project);
    expect(machine.setState("idle")).toBe(false);
  });

  it("bertransisi memakai durasi wildcard", () => {
    const machine = new StateMachine(project);
    expect(machine.setState("happy")).toBe(true);
    expect(machine.stateId).toBe("happy");
    expect(machine.transitioning).toBe(true);

    const middle = machine.tick(50);
    expect(middle.body![0]).toEqual([10, 10]);

    machine.tick(50);
    expect(machine.transitioning).toBe(false);
    expect(machine.stateId).toBe("happy");
  });

  it("melanjutkan dari posisi saat ini ketika diinterupsi", () => {
    const machine = new StateMachine(project);
    machine.setState("happy");
    machine.tick(50);

    expect(machine.setState("idle")).toBe(true);
    const first = machine.tick(0);
    expect(first.body![0]).toEqual([10, 10]);

    const middle = machine.tick(50);
    expect(middle.body![0]![0]).toBeGreaterThanOrEqual(5);
    expect(middle.body![0]![0]).toBeLessThan(10);
  });

  it("menyelesaikan transisi tanpa durasi", () => {
    const machine = new StateMachine(project);
    machine.setState("happy", 0);
    const pose = machine.tick(0);
    expect(pose.body![0]).toEqual([20, 20]);
    expect(machine.transitioning).toBe(false);
  });

  it("memakai easing dan durasi yang diminta", () => {
    const machine = new StateMachine(project);
    machine.setState("happy", 200, "easeIn");
    const quarter = machine.tick(100);
    expect(quarter.body![0]![0]).toBeGreaterThan(0);
    expect(quarter.body![0]![0]).toBeLessThan(10);
  });
});
