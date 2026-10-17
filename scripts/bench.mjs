import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildPath, lerpPose, poseOf } from "../packages/core/dist/index.js";

const project = JSON.parse(readFileSync(resolve("packages/presets/dist/blip.json"), "utf8"));

const states = project.states.map((state) => ({ id: state.id, pose: poseOf(state) }));
const frames = 600;
let index = 0;
let total = 0;

const start = process.hrtime.bigint();

for (let frame = 0; frame < frames; frame += 1) {
  const from = states[index % states.length];
  const to = states[(index + 1) % states.length];
  const t = (frame % 60) / 60;
  const pose = lerpPose(from.pose, to.pose, t);

  for (const part of project.parts) {
    buildPath(pose[part.id]);
  }

  if (frame % 60 === 59) index += 1;
}

total = Number(process.hrtime.bigint() - start) / 1e6;
const perFrame = total / frames;

console.log(`frames: ${frames}`);
console.log(`total: ${total.toFixed(1)} ms`);
console.log(`per frame: ${perFrame.toFixed(3)} ms`);
console.log(`budget 16.67 ms: ${perFrame < 16.67 ? "PASS" : "FAIL"}`);
console.log(`headroom: ${(16.67 / perFrame).toFixed(0)}x`);

if (perFrame >= 16.67) process.exitCode = 1;
