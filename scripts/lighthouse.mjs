import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const chromePath =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = Number(process.env.PORT ?? 4322);
const outDir = resolve("lighthouse");
const report = resolve(outDir, "landing.report.json");

const targets = [
  { name: "landing-id", url: `http://127.0.0.1:${port}/`, form: "mobile" },
  { name: "landing-id-desktop", url: `http://127.0.0.1:${port}/`, form: "desktop" },
  { name: "landing-en", url: `http://127.0.0.1:${port}/en/`, form: "mobile" },
];

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => resolvePromise({ code, output }));
  });
}

await mkdir(outDir, { recursive: true });

const server = spawn("node", ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

await new Promise((resolvePromise, reject) => {
  const timer = setTimeout(() => reject(new Error("server tidak siap")), 15000);
  server.stdout.on("data", (chunk) => {
    if (String(chunk).includes("serve")) {
      clearTimeout(timer);
      resolvePromise();
    }
  });
  server.on("error", reject);
});

const results = [];

for (const target of targets) {
  const jsonPath = resolve(outDir, `${target.name}.report.json`);
  await rm(jsonPath, { force: true });

  const args = [
    resolve("node_modules/lighthouse/cli/index.js"),
    target.url,
    "--quiet",
    "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${jsonPath}`,
    target.form === "desktop" ? "--preset=desktop" : "--form-factor=mobile",
  ];

  if (chromePath) args.push(`--chrome-path=${chromePath}`);

  const { code, output } = await run(process.execPath, args);

  if (code !== 0) {
    results.push({ name: target.name, error: output.slice(-400) });
    continue;
  }

  const data = JSON.parse(await readFile(jsonPath, "utf8"));
  const scores = Object.fromEntries(
    Object.entries(data.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
  );

  results.push({ name: target.name, scores, url: target.url });
}

server.kill();

const summary = { chromePath, results };
await writeFile(report, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

let failed = false;

for (const result of results) {
  if (result.error) {
    console.log(`FAIL ${result.name}: ${result.error}`);
    failed = true;
    continue;
  }

  const { performance, accessibility, "best-practices": best, seo } = result.scores;
  const perfBudget = result.name.includes("desktop") ? 90 : 90;
  const pass = performance >= perfBudget && accessibility >= 95 && best >= 90 && seo >= 90;
  console.log(
    `${pass ? "PASS" : "FAIL"} ${result.name}: performance ${performance}, accessibility ${accessibility}, best-practices ${best}, seo ${seo}`,
  );
  if (!pass) failed = true;
}

if (failed) process.exitCode = 1;
