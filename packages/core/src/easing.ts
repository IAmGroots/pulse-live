export type Easing = (t: number) => number;

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): Easing {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const fx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const fy = (t: number) => ((ay * t + by) * t + cy) * t;

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let low = 0;
    let high = 1;
    let t = x;

    for (let index = 0; index < 14; index += 1) {
      t = (low + high) / 2;
      if (fx(t) < x) low = t;
      else high = t;
    }

    return fy(t);
  };
}

const SPRING_END = 1 - Math.exp(-6) * Math.cos(9);

const EASINGS: Record<string, Easing> = {
  linear: (t) => t,
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  easeIn: cubicBezier(0.42, 0, 1, 1),
  easeOut: cubicBezier(0, 0, 0.58, 1),
  easeInOut: cubicBezier(0.42, 0, 0.58, 1),
  easeOutCubic: (t) => 1 - (1 - t) ** 3,
  spring: (t) => (1 - Math.exp(-6 * t) * Math.cos(9 * t)) / SPRING_END,
};

export function resolveEasing(spec: string | undefined): Easing {
  if (!spec) return EASINGS.easeInOut!;

  if (spec.startsWith("cubic-bezier(") && spec.endsWith(")")) {
    const values = spec
      .slice(13, -1)
      .split(",")
      .map((value) => Number(value.trim()));

    if (values.length === 4 && values.every(Number.isFinite)) {
      return cubicBezier(values[0]!, values[1]!, values[2]!, values[3]!);
    }
  }

  return EASINGS[spec] ?? EASINGS.easeInOut!;
}

export function clamp(value: number, min = 0, max = 1): number {
  return value < min ? min : value > max ? max : value;
}
