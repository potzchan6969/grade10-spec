#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  prepareAcceptance,
  runPnpm,
  validateFoldedSuites,
} from "./lib/acceptance.mjs";

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const args = process.argv.slice(2);
const rootAt = args.indexOf("--root");
const root = rootAt < 0 ? HERE : args[rootAt + 1];
if (rootAt >= 0) args.splice(rootAt, 2);
const changeId = args[0];
if (!changeId || args.length !== 1) {
  console.error(
    "usage: pnpm run accept:preflight <change-id> [--root <store>]",
  );
  process.exit(2);
}
try {
  const prepared = prepareAcceptance(root, changeId);
  const validation = runPnpm(["run", "validate:changes", changeId], root);
  if (validation.status !== 0)
    throw new Error(
      `validate:changes refused acceptance:\n${validation.stdout ?? ""}${validation.stderr ?? ""}`,
    );
  validateFoldedSuites(prepared, runPnpm);
  console.log(`${changeId} is ready to fold and accept.`);
  console.log(`Fingerprint: ${prepared.fingerprint}`);
  console.log(`Baseline: ${prepared.baselineFingerprint}`);
  console.log(`Durable files to write: ${prepared.outputs.size}`);
  for (const path of prepared.outputs.keys()) console.log(`  ${path}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
