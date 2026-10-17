import type {
  AvatarProject,
  AvatarState,
  PartDef,
  Point,
  StateId,
  Transition,
} from "@pulse-live/schema";
import { PART_IDS, PART_POINT_COUNTS, STATE_IDS } from "@pulse-live/schema";
import type { CharacterConfig } from "./lib/pose";
import { buildPart, resolvePose } from "./lib/pose";

export const DEFAULT_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const STATE_TIMING: Record<
  StateId,
  { loop: AvatarState["loop"]; duration: number; morph: number }
> = {
  idle: { loop: "breathe", duration: 4200, morph: 420 },
  listening: { loop: "pulse", duration: 2600, morph: 380 },
  thinking: { loop: "dots", duration: 2400, morph: 400 },
  speaking: { loop: "pulse", duration: 1400, morph: 300 },
  happy: { loop: "breathe", duration: 3000, morph: 380 },
  sad: { loop: "breathe", duration: 4800, morph: 460 },
  confused: { loop: "none", duration: 0, morph: 380 },
  surprised: { loop: "none", duration: 0, morph: 280 },
  sleepy: { loop: "breathe", duration: 6000, morph: 520 },
  excited: { loop: "pulse", duration: 1200, morph: 320 },
  angry: { loop: "pulse", duration: 1600, morph: 360 },
  curious: { loop: "none", duration: 0, morph: 380 },
  error: { loop: "none", duration: 0, morph: 300 },
  loading: { loop: "arc", duration: 1800, morph: 400 },
};

const PART_DEFS: PartDef[] = [
  { id: "body", role: "body", pointCount: PART_POINT_COUNTS.body, z: 0 },
  { id: "eyeL", role: "hole", pointCount: PART_POINT_COUNTS.eyeL, z: 1 },
  { id: "eyeR", role: "hole", pointCount: PART_POINT_COUNTS.eyeR, z: 1 },
  { id: "browL", role: "hole", pointCount: PART_POINT_COUNTS.browL, z: 2 },
  { id: "browR", role: "hole", pointCount: PART_POINT_COUNTS.browR, z: 2 },
  { id: "mouth", role: "hole", pointCount: PART_POINT_COUNTS.mouth, z: 1 },
];

export function buildStates(character: CharacterConfig): AvatarState[] {
  return STATE_IDS.map((stateId) => {
    const pose = resolvePose(character, character.poses[stateId]);
    const parts: AvatarState["parts"] = {};

    for (const partId of PART_IDS) {
      parts[partId] = { points: quantize(buildPart(partId, pose)) };
    }

    const timing = STATE_TIMING[stateId];

    return {
      id: stateId,
      parts,
      loop: timing.loop,
      duration: timing.duration,
      morph: timing.morph,
    };
  });
}

function quantize(points: Point[]): Point[] {
  return points.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
}

export function buildTransitions(): Transition[] {
  const wildcards: Transition[] = STATE_IDS.map((stateId) => ({
    from: "*",
    to: stateId,
    duration: 380,
    easing: DEFAULT_EASING,
  }));

  const overrides: Transition[] = [
    { from: "thinking", to: "speaking", duration: 300, easing: DEFAULT_EASING },
    { from: "speaking", to: "idle", duration: 380, easing: DEFAULT_EASING },
    { from: "surprised", to: "happy", duration: 320, easing: DEFAULT_EASING },
    { from: "error", to: "idle", duration: 520, easing: DEFAULT_EASING },
  ];

  return [...wildcards, ...overrides];
}

export function buildProject(character: CharacterConfig): AvatarProject {
  return {
    schemaVersion: 1,
    id: character.id,
    name: character.name,
    viewBox: [0, 0, 100, 100],
    renderMode: "cutout",
    parts: PART_DEFS.map((part) => ({ ...part })),
    states: buildStates(character),
    transitions: buildTransitions(),
    defaults: { duration: 380, easing: DEFAULT_EASING },
    blink: {
      parts: ["eyeL", "eyeR"],
      interval: [2800, 6200],
      duration: 120,
      amount: 0.08,
    },
    intensity: { mouth: "mouth", scaleY: 1.6 },
  };
}
