import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const budgets = [
  { dir: "packages/presets/dist", pattern: /\.json$/, label: "preset JSON", limit: 12 * 1024 },
  { file: "packages/schema/dist/index.js", label: "schema", limit: 8 * 1024 },
  { file: "packages/core/dist/index.js", label: "core", limit: 10 * 1024 },
  { file: "packages/overlays/dist/index.js", label: "overlays", limit: 1.5 * 1024 },
];

let failed = false;

async function measure(file) {
  const content = await readFile(file);
  return { raw: content.byteLength, gzip: gzipSync(content, { level: 9 }).byteLength };
}

function report(label, name, raw, gzip, limit) {
  const pass = gzip <= limit;
  const status = pass ? "PASS" : "FAIL";
  console.log(
    `${status} ${label} ${name}: ${(gzip / 1024).toFixed(2)} KB gzip (${(raw / 1024).toFixed(2)} KB raw), budget ${(limit / 1024).toFixed(2)} KB`,
  );
  if (!pass) failed = true;
}

for (const budget of budgets) {
  if (budget.dir) {
    const dir = resolve(budget.dir);
    const entries = (await readdir(dir)).filter((name) => budget.pattern.test(name));
    if (entries.length === 0) {
      console.log(`FAIL ${budget.label}: tidak ada file di ${budget.dir}`);
      failed = true;
      continue;
    }
    for (const name of entries) {
      const { raw, gzip } = await measure(resolve(dir, name));
      report(budget.label, name, raw, gzip, budget.limit);
    }
    continue;
  }

  const file = resolve(budget.file);
  const exists = await stat(file).catch(() => null);
  if (!exists) {
    console.log(`FAIL ${budget.label}: ${budget.file} belum dibangun`);
    failed = true;
    continue;
  }
  const { raw, gzip } = await measure(file);
  report(budget.label, budget.file.split("/").pop(), raw, gzip, budget.limit);
}

if (failed) {
  process.exitCode = 1;
}
