#!/usr/bin/env node
/*
 * CHECK: every in-flight change against the OpenSpec CLI.
 *
 *   node scripts/openspec/validate-changes.mjs [--strict]
 *
 * The CLI refuses a change with no delta, which is the right answer for a
 * change somebody stopped writing and the wrong one for a change that has
 * said what it is waiting for. That one error is dropped for a change whose
 * `.openspec.yaml` declares `awaiting: specs:` and has written no delta yet.
 * Every other error it reports still counts, on that change and on the rest.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import YAML from "yaml";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** The one error a declared wait excuses. The CLI gives an issue no code and
 * no rule name, so its opening sentence is the only handle; a test holds the
 * pinned CLI to it. */
const NO_DELTA = "Change must have at least one delta.";

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

/** The pinned CLI, and only the pinned one: a binary that happens to be on
 * PATH is whatever version its owner installed, which is the divergence
 * `openspec-version.test.mjs` exists to prevent. */
export function cli(root) {
  const pinned = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
    .scripts?.openspec;
  const parts = (pinned ?? "").split(" ").filter(Boolean);
  if (parts.length === 0)
    throw new Error("package.json pins no `openspec` CLI");
  return parts;
}

/** The CLI's JSON, out of a stream that also carries the package manager's
 * own lines. One object is printed, so it runs from the first brace to the
 * last; anything else is a run that cannot be read and must not pass. */
function report(stdout) {
  const open = stdout.indexOf("{");
  const close = stdout.lastIndexOf("}");
  if (open === -1 || close < open) throw new Error("the CLI printed no JSON");
  return JSON.parse(stdout.slice(open, close + 1));
}

export function main(root, strict) {
  const changes = join(root, "openspec", "changes");
  const [command, ...lead] = cli(root);
  const run = spawnSync(
    command,
    [
      ...lead,
      "validate",
      "--changes",
      "--json",
      ...(strict ? ["--strict"] : []),
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (run.error) throw new Error(`could not run the CLI: ${run.error.message}`);

  const waiting = [];
  const failed = [];
  for (const item of report(run.stdout ?? "").items ?? []) {
    const why = waitingOnSpecs(join(changes, item.id));
    const left = (item.issues ?? []).filter(
      (issue) =>
        issue.level !== "INFO" &&
        !(why !== undefined && issue.message.startsWith(NO_DELTA)),
    );
    if (why !== undefined) waiting.push(`${item.id} — ${why}`);
    if (left.length > 0) {
      failed.push(
        `${item.id}\n${left.map((one) => `  ${one.level} ${one.path}: ${one.message}`).join("\n")}`,
      );
    }
  }

  for (const one of waiting) console.log(`waiting on an input: ${one}`);
  if (failed.length > 0) {
    console.error(`\n${failed.join("\n")}\n${failed.length} change(s) failed`);
    process.exitCode = 1;
    return;
  }
  console.log(`every change validated, ${waiting.length} waiting on an input`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(ROOT, process.argv.includes("--strict"));
}
