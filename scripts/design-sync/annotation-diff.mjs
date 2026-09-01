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
import {
  exitCodeFor,
  renderHuman,
  scanSnapshot,
} from "./annotation-reconciliation.mjs";

function blockedResult(reason, kind = "invalid-input", scope = null) {
  return {
    schemaVersion: 2,
    scope,
    observationSchemaVersion: null,
    observationDigest: null,
    status: "blocked",
    scannedSources: [],
    skippedRoots: [],
    blockers: [{ kind, reason }],
    findings: [],
  };
}

export async function runCli({ argv = process.argv.slice(2) } = {}) {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      json: { type: "boolean", default: false },
      baseline: { type: "string", default: defaultBaselinePath },
      snapshot: { type: "string" },
      scope: { type: "string" },
    },
    strict: true,
  });
  let result;
  try {
    const scope = requiredScope(values.scope);
    if (!values.snapshot) throw new Error("--snapshot is required");
    const [baseline, snapshot] = await Promise.all([
      readJson(resolveRepoPath(values.baseline), "annotation baseline"),
      readJson(resolveRepoPath(values.snapshot), "annotation snapshot"),
    ]);
    result = scanSnapshot({ baseline, snapshot, scope });
  } catch (error) {
    result = blockedResult(
      error instanceof Error ? error.message : String(error),
      "invalid-input",
    );
  }
  if (values.json) console.log(JSON.stringify(result, null, 2));
  else console.log(renderHuman(result));
  return exitCodeFor(result);
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
