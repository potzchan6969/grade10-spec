#!/usr/bin/env node
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { acceptChange } from "./lib/acceptance.mjs";
import { cliArgs } from "./lib/args.mjs";

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const args = cliArgs();
const value = (name) => {
  const index = args.indexOf(name);
  if (index < 0) return null;
  const found = args[index + 1] ?? null;
  args.splice(index, 2);
  return found;
};
const root = value("--root") ?? HERE;
const reviewedBy = value("--reviewed-by");
const expectedBaseline = value("--baseline");
const supersedes = value("--supersedes");
const changeId = args[0];
if (!changeId || args.length !== 1 || !reviewedBy || !expectedBaseline) {
  console.error(
    "usage: pnpm run spec:accept <change-id> --reviewed-by <name> --baseline <preflight-baseline> [--supersedes <fingerprint>] [--root <store>]",
  );
  process.exit(2);
}
try {
  const acceptance = acceptChange(root, changeId, {
    reviewedBy,
    expectedBaseline,
    supersedes,
  });
  console.log(`Accepted ${changeId}.`);
  console.log(`Fingerprint: ${acceptance.fingerprint}`);
  console.log(`Review: ${acceptance.reviewedBy} at ${acceptance.acceptedAt}`);
  console.log(
    `Immutable record: openspec/changes/${changeId}/acceptance/${acceptance.fingerprint}.json`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
