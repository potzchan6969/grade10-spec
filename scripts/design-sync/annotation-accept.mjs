#!/usr/bin/env node

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  defaultBaselinePath,
  readJson,
  repoRoot,
  resolveRepoPath,
} from "./annotation-cli.mjs";
import {
  AcceptanceValidationError,
  acceptSnapshot,
  renderHuman,
} from "./annotation-reconciliation.mjs";
import { applyAcceptanceTransaction } from "./annotation-store.mjs";

function blockedResult(error) {
  return {
    status: "blocked",
    blockers: [
      {
        kind:
          error instanceof AcceptanceValidationError
            ? "invalid-acceptance"
            : "invalid-input",
        reason: error instanceof Error ? error.message : String(error),
      },
    ],
  };
}

export async function runCli({
  argv = process.argv.slice(2),
  storeRoot = repoRoot,
} = {}) {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      baseline: { type: "string", default: defaultBaselinePath },
      decisions: { type: "string" },
      ids: { type: "string" },
      json: { type: "boolean", default: false },
      snapshot: { type: "string" },
    },
    strict: true,
  });
  let output;
  try {
    if (!values.snapshot) throw new Error("--snapshot is required");
    if (!values.ids) throw new Error("--ids is required");
    if (!values.decisions) throw new Error("--decisions is required");
    const baselinePath = resolve(storeRoot, values.baseline);
    const [baseline, snapshot, decisions] = await Promise.all([
      readJson(baselinePath, "annotation baseline"),
      readJson(resolveRepoPath(values.snapshot), "annotation snapshot"),
      readJson(resolveRepoPath(values.decisions), "annotation decisions"),
    ]);
    output = acceptSnapshot({
      baseline,
      snapshot,
      storeRoot,
      ids: values.ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
      decisions,
    });
    const transaction = applyAcceptanceTransaction({
      storeRoot,
      baselinePath,
      baseline: output.baseline,
      decisions,
    });
    output = {
      status: output.status,
      observationDigest: output.observationDigest,
      baselineDigest: decisions.baselineDigest,
      acceptedIds: output.acceptedIds,
      files: transaction.files,
      remaining: output.remaining,
    };
  } catch (error) {
    output = blockedResult(error);
  }
  if (values.json) console.log(JSON.stringify(output, null, 2));
  else
    console.log(
      output.status === "accepted"
        ? renderHuman(output.remaining)
        : `✗ ${output.blockers[0].reason}`,
    );
  return output.status === "accepted"
    ? output.remaining.status === "blocked"
      ? 2
      : 0
    : 2;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
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
