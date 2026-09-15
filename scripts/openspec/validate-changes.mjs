#!/usr/bin/env node
/*
 * CHECK: every in-flight change against the OpenSpec CLI, one at a time.
 *
 *   node scripts/openspec/validate-changes.mjs [--strict]
 *
 * `openspec validate --changes` refuses a change with no delta, which is the
 * right answer for a change somebody stopped writing and the wrong one for a
 * change that has said what it is waiting for. A change whose `.openspec.yaml`
 * declares `awaiting: specs:` is waiting on an input its author named, so it
 * is skipped here and validated the moment it writes a delta — everything it
 * can be held to, it already is.
 *
 * Per change rather than in bulk because the CLI reports the set as one
 * verdict, and a set holding one waiting change cannot be told from a set
 * holding one broken one.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import YAML from "yaml";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/**
 * What the change says it is waiting on before it can write a requirement, or
 * nothing when it owes one now. A change that has started its deltas is past
 * the wait whatever the line still says — the `awaiting` rule in
 * `check:manual` is what asks the author to delete it.
 */
export function waitingOnSpecs(dir) {
  const manifest = join(dir, ".openspec.yaml");
  if (!existsSync(manifest)) return undefined;
  let fields;
  try {
    fields = YAML.parse(readFileSync(manifest, "utf8")) ?? {};
  } catch {
    // A manifest the readers refuse is `check:manual`'s `store` rule to
    // report; here it excuses nothing.
    return undefined;
  }
  const why = fields?.awaiting?.specs;
  if (typeof why !== "string" || why.trim() === "") return undefined;
  return existsSync(join(dir, "specs")) ? undefined : why.trim();
}

/**
 * How to run the CLI: the installed binary where there is one — CI installs it
 * globally — and otherwise the pinned `openspec` script from `package.json`,
 * so a developer runs the version CI does without installing anything. The
 * version lives in one place; `openspec-version.test.mjs` holds it to the
 * workflow.
 */
function cli(root) {
  if (spawnSync("openspec", ["--version"], { encoding: "utf8" }).status === 0) {
    return ["openspec"];
  }
  const pinned = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
    .scripts?.openspec;
  const parts = (pinned ?? "").split(" ").filter(Boolean);
  if (parts.length === 0) {
    throw new Error("no `openspec` binary, and package.json pins no CLI");
  }
  return parts;
}

function main(root, strict) {
  const changesDir = join(root, "openspec", "changes");
  const [command, ...lead] = cli(root);
  const ids = readdirSync(changesDir, { withFileTypes: true })
    .filter((one) => one.isDirectory() && one.name !== "archive")
    .map((one) => one.name)
    .sort();

  const failed = [];
  const waiting = [];
  for (const id of ids) {
    const why = waitingOnSpecs(join(changesDir, id));
    if (why !== undefined) {
      waiting.push(`${id} — ${why}`);
      continue;
    }
    const run = spawnSync(
      command,
      [...lead, "validate", id, ...(strict ? ["--strict"] : [])],
      { cwd: root, encoding: "utf8" },
    );
    if (run.status !== 0) {
      failed.push(`${id}\n${(run.stdout ?? "") + (run.stderr ?? "")}`);
    }
  }

  for (const one of waiting) console.log(`waiting on an input: ${one}`);
  console.log(
    `${ids.length - waiting.length} of ${ids.length} changes validated, ${waiting.length} waiting`,
  );
  if (failed.length > 0) {
    console.error(`\n${failed.join("\n")}`);
    console.error(`${failed.length} change(s) failed validation`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(ROOT, process.argv.includes("--strict"));
}
