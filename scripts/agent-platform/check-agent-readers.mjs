#!/usr/bin/env node
/**
 * Every reader the planning schema's rounds may dispatch resolves to a file
 * under `.claude/agents/`.
 *
 * Read through `scripts/openspec/lib/perspectives.mjs`'s `planningSchema()` —
 * the store's one reader of the schema, itself built on
 * `tools/manual/src/store/read-schema.mts` — rather than a second, grep-based
 * parse of the YAML that a multi-line `perspectives:` block or a YAML anchor
 * would silently miss. Prints one line per distinct reader, and fails where
 * the schema declares none: an empty round dispatches nobody, which is a
 * schema with a hole in it rather than something to skip past quietly.
 *
 * `--root` reads a store other than this one, which is how the tests reach
 * either refusal: this store's own schema takes neither.
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "../openspec/lib/args.mjs";
import { planningSchema, SCHEMA } from "../openspec/lib/perspectives.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const { flags } = parseArgs(process.argv.slice(2), {
  keys: ["root"],
  usage:
    "usage: node scripts/agent-platform/check-agent-readers.mjs [--root <dir>]",
});
const root = flags.root ?? resolve(here, "..", "..");

const schema = planningSchema(root);
const agents = new Set(
  [
    ...schema.artifacts.flatMap(({ perspectives }) => perspectives),
    ...schema.apply,
  ].map(({ agent }) => agent),
);

if (agents.size === 0) {
  console.error(
    `[FAIL] the ${SCHEMA} schema declares no perspectives — every round would dispatch nobody`,
  );
  process.exit(1);
}

let failures = 0;
for (const agent of [...agents].sort()) {
  if (existsSync(join(root, agent))) {
    console.log(`[PASS] the schema's reader ${agent} resolves`);
  } else {
    console.error(
      `[FAIL] the schema names the reader ${agent}, which resolves to nothing`,
    );
    failures += 1;
  }
}

process.exit(failures > 0 ? 1 : 0);
