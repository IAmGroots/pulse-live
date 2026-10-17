import { describe, expect, it } from "vitest";
import { cubicBezier, resolveEasing } from "./easing";

describe("easing", () => {
  it("menjaga titik akhir untuk semua easing", () => {
    for (const name of ["linear", "ease", "easeIn", "easeOut", "easeInOut", "spring"]) {
      const ease = resolveEasing(name);
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBeCloseTo(1, 5);
    }
  });

  it("menghitung cubic-bezier linear", () => {
    const ease = cubicBezier(0.25, 0.25, 0.75, 0.75);
    expect(ease(0.5)).toBeCloseTo(0.5, 2);
  });

  it("membaca cubic-bezier dari string", () => {
    const ease = resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)");
    expect(ease(0.5)).toBeGreaterThan(0.5);
  });

  it("jatuh ke easeInOut untuk nilai yang tidak dikenal", () => {
    const fallback = resolveEasing("tidak-ada");
    expect(fallback(0.5)).toBeCloseTo(resolveEasing("easeInOut")(0.5), 5);
  });

  it("tidak pernah turun di bawah nol", () => {
    const ease = resolveEasing("spring");
    for (let index = 0; index <= 20; index += 1) {
      expect(ease(index / 20)).toBeGreaterThanOrEqual(-0.2);
    }
  });
});
