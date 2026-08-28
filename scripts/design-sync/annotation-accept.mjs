#!/usr/bin/env node

import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  AcceptanceValidationError,
  acceptSnapshot,
  renderHuman,
} from "./annotation-reconciliation.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultBaselinePath = resolve(
  repoRoot,
  "scripts/design-sync/annotation-baseline.json",
);

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function writeJsonAtomically(path, value) {
  const temporaryPath = `${path}.tmp-${process.pid}`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, {
      flag: "wx",
    });
    await rename(temporaryPath, path);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

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

export async function runCli({ argv = process.argv.slice(2) } = {}) {
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
    const baselinePath = resolve(repoRoot, values.baseline);
    const [baseline, snapshot, decisions] = await Promise.all([
      readJson(baselinePath, "annotation baseline"),
      readJson(resolve(repoRoot, values.snapshot), "annotation snapshot"),
      readJson(resolve(repoRoot, values.decisions), "annotation decisions"),
    ]);
    output = acceptSnapshot({
      baseline,
      snapshot,
      ids: values.ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
      decisions,
    });
    await writeJsonAtomically(baselinePath, output.baseline);
    output = {
      status: output.status,
      observationDigest: output.observationDigest,
      acceptedIds: output.acceptedIds,
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
