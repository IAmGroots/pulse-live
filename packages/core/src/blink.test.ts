import { describe, expect, it } from "vitest";
import { Blinker } from "./blink";

const options = {
  parts: ["eyeL", "eyeR"],
  interval: [0, 0] as [number, number],
  duration: 100,
  amount: 0.08,
};

describe("Blinker", () => {
  it("menutup lalu membuka mata", () => {
    const blinker = new Blinker(options);

    expect(blinker.update(0)).toBe(0);
    expect(blinker.update(50)).toBeCloseTo(1, 5);
    expect(blinker.update(50)).toBe(0);
  });

  it("bisa dipicu manual", () => {
    const blinker = new Blinker({ ...options, interval: [10000, 10000] });

    blinker.trigger();
    expect(blinker.update(25)).toBeGreaterThan(0);
  });

  it("mengabaikan pemicu saat kedipan berjalan", () => {
    const blinker = new Blinker(options);
    blinker.trigger();
    const first = blinker.update(25);
    blinker.trigger();
    expect(blinker.update(25)).toBeGreaterThan(first);
  });
});
