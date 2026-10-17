import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseProject } from "@pulse-live/schema";
import { blip } from "../src/characters/blip";
import { mochi } from "../src/characters/mochi";
import { buildProject } from "../src/generator";

const outputDir = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");

await mkdir(outputDir, { recursive: true });

for (const character of [blip, mochi]) {
  const project = parseProject(buildProject(character));
  const target = resolve(outputDir, `${character.id}.json`);
  await writeFile(target, `${JSON.stringify(project)}\n`, "utf8");
  console.log(
    `${character.id}: ${project.states.length} state, ${project.parts.length} part, ${target}`,
  );
}
