import type { AvatarProject } from "@pulse-live/core";
import { parseProject } from "@pulse-live/schema";
import blipJson from "@pulse-live/presets/blip.json";

export const blip: AvatarProject = parseProject(blipJson);

export type PresetName = "blip" | "mochi";

export const PRESET_LABELS: Record<PresetName, string> = {
  blip: "Blip",
  mochi: "Mochi",
};

export async function loadPreset(name: PresetName): Promise<AvatarProject> {
  if (name === "blip") return blip;

  const module = await import("@pulse-live/presets/mochi.json");
  return parseProject(module.default);
}
