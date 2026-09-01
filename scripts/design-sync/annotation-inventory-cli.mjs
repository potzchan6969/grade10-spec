#!/usr/bin/env node

import { resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  defaultBaselinePath,
  readJson,
  requiredScope,
  resolveRepoPath,
} from "./annotation-cli.mjs";
import { buildInventory } from "./annotation-inventory.mjs";

function blockedResult(reason) {
  return {
    schemaVersion: 1,
    scope: null,
    files: [],
    blockers: [{ kind: "invalid-input", reason }],
  };
}

export async function runCli({ argv = process.argv.slice(2) } = {}) {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      baseline: { type: "string", default: defaultBaselinePath },
      json: { type: "boolean", default: false },
      scope: { type: "string" },
    },
    strict: true,
  });
  let output;
  try {
    const scope = requiredScope(values.scope);
    const baseline = await readJson(
      resolveRepoPath(values.baseline),
      "annotation baseline",
    );
    output = buildInventory({ baseline, scope });
  } catch (error) {
    output = blockedResult(
      error instanceof Error ? error.message : String(error),
    );
  }
  if (values.json) console.log(JSON.stringify(output, null, 2));
  else
    console.log(
      output.blockers?.length
        ? `✗ Annotation inventory blocked: ${output.blockers[0].reason}`
        : `✓ Annotation inventory ready for ${output.scope}.`,
    );
  return output.blockers?.length ? 2 : 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolvePath(process.argv[1])).href
) {
  runCli()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(
        `✗ ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exitCode = 2;
    });
}
