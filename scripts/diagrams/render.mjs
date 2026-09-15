#!/usr/bin/env node
/**
 * Renders every diagram source under `docs/prds/diagrams/` into the SVG the
 * manual serves from `docs/prds/assets/diagrams/`. `--check` writes nothing
 * and fails on a stale, missing, or orphaned SVG.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deliver, TYPES } from "./archify.mjs";
import { compile } from "./compile.mjs";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../..");
const SOURCES = join(ROOT, "docs/prds/diagrams");
const OUTPUT = join(ROOT, "docs/prds/assets/diagrams");

const check = process.argv.includes("--check");
const problems = [];
const sources = existsSync(SOURCES)
  ? readdirSync(SOURCES)
      .filter((file) => file.endsWith(".json"))
      .sort()
  : [];

const rendered = new Set();
let written = 0;
for (const file of sources) {
  const match = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.([a-z]+)\.json$/.exec(file);
  if (!match || !TYPES.includes(match[2])) {
    problems.push(`${file}: name it <slug>.<${TYPES.join("|")}>.json`);
    continue;
  }
  const [, name, type] = match;
  const target = join(OUTPUT, `${name}.svg`);
  rendered.add(basename(target));
  try {
    const svg = compile(deliver(type, join(SOURCES, file)), name, type);
    const current = existsSync(target) ? readFileSync(target, "utf8") : null;
    if (current === svg) continue;
    if (check) {
      problems.push(
        `${name}.svg is ${current === null ? "missing" : "stale"}: run pnpm diagrams`,
      );
      continue;
    }
    mkdirSync(OUTPUT, { recursive: true });
    writeFileSync(target, svg);
    written += 1;
    console.log(`rendered ${name}.svg`);
  } catch (cause) {
    problems.push(cause instanceof Error ? cause.message : String(cause));
  }
}

if (existsSync(OUTPUT)) {
  for (const file of readdirSync(OUTPUT)) {
    if (file.endsWith(".svg") && !rendered.has(file)) {
      problems.push(`${file} has no source under docs/prds/diagrams/`);
    }
  }
}

for (const problem of problems) console.error(problem);
console.log(
  `${sources.length} diagrams, ${written} written, ${problems.length} problems`,
);
process.exit(problems.length > 0 ? 1 : 0);
