#!/usr/bin/env node
/*
 * CHECK: one in-flight change against the OpenSpec CLI, or every one.
 *
 *   node scripts/openspec/validate-changes.mjs [<change-id>] [--strict]
 *
 * The CLI refuses a change with no delta, which is the right answer for a
 * change somebody stopped writing and the wrong one for a change that has
 * said what it is waiting for. Those errors are dropped for a change whose
 * `.openspec.yaml` declares `awaiting: specs:` and whose deltas name no
 * requirement yet. Every other error it reports still counts, on that change
 * and on the rest.
 *
 * `spec.md` is written in two passes — the outline, then the requirements —
 * so the wait is read against the delta headings rather than against the
 * directory. Keying on the directory meant the outline ended the wait the
 * moment it was written, and the one state the workflow passes through on
 * every change failed the run its own author was told to make.
 *
 * A row a branch adds to a change's `rounds.md` is held to the readers the
 * schema issues for its artifact, as the landing holds the rows it writes: a
 * row written by hand passes through here and nowhere else. The branch's rows
 * are the ones the store's main does not carry; a checkout with no main to
 * compare against — a clone with no `origin`, or a fixture — says so and holds
 * no row, since every row would read as the branch's and old rows are not
 * backfilled.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import YAML from "yaml";
import {
  readRounds,
  roundArtifactOf,
} from "../../tools/manual/src/store/read-rounds.mts";
import { fixPassFloor, planningSchema, SCHEMA } from "./lib/perspectives.mjs";
import { readTextIfThere } from "./lib/read-text.mjs";
import { perspectivesRefusals, roundsPath } from "./lib/rounds.mjs";
import { storeMain, textAt } from "./store-main.mjs";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** The one error a declared wait excuses. The CLI gives an issue no code and
 * no rule name, so its opening sentence is the only handle; a test holds the
 * pinned CLI to it. */
const NO_DELTA = "Change must have at least one delta.";
/** The same wait, reported per file: the outline is a `spec.md` the CLI reads
 * and finds no delta section in. */
const NO_SECTIONS = "No delta sections found.";
const DELTA_HEADING =
  /^##\s+(?:ADDED|MODIFIED|REMOVED|RENAMED)\s+Requirements\s*$/m;

/**
 * What the change says it is waiting on before it can write a requirement, or
 * nothing when it owes one now. A change whose deltas all name requirements is
 * past the wait whatever the line still says — the `awaiting` rule in
 * `check:manual` is what asks the author to delete it.
 */
export function waitingOnSpecs(dir) {
  // A record that is there and cannot be opened stops the run naming it: read
  // as no wait, it would run the delta gate over a change its author excused.
  const text = readTextIfThere(join(dir, ".openspec.yaml"));
  if (text === undefined) return undefined;
  let fields;
  try {
    fields = YAML.parse(text) ?? {};
  } catch {
    // A manifest the readers refuse is `check:manual`'s `store` rule to
    // report; here it excuses nothing.
    return undefined;
  }
  const why = fields?.awaiting?.specs;
  if (typeof why !== "string" || why.trim() === "") return undefined;
  return outlineOnly(join(dir, "specs")) ? why.trim() : undefined;
}

/** Whether any delta under `specs/` still names no requirement — an absent
 * directory included. One capability's requirements do not answer for
 * another's, which is how `written` reads the same pass. */
function outlineOnly(specs) {
  if (!existsSync(specs)) return true;
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name));
      else if (entry.name === "spec.md") found.push(join(dir, entry.name));
    }
  };
  walk(specs);
  if (found.length === 0) return true;
  return found.some((file) => !DELTA_HEADING.test(readFileSync(file, "utf8")));
}

/**
 * What the rows a branch adds to one change's `rounds.md` are refused for: a
 * row is the branch's where `main` (`storeMain`'s answer) carries no row
 * reading the same. A row records no `--fix-pass`, so it is held only to the
 * floor every perspectives list shares (`fixPassFloor`) — none where the lists
 * share no `always` reader — to names the list of its artifact issues, and to
 * a `verifier` wherever more than one reader ran.
 */
export function addedRowRefusals(root, main, id) {
  const path = roundsPath(id);
  const now = readTextIfThere(join(root, path));
  if (now === undefined) return [];
  const key = (row) => JSON.stringify(row);
  const before = new Set(
    readRounds(textAt(root, main.commit, path) ?? "").map(key),
  );
  const named = schemaOf(join(root, "openspec", "changes", id));
  let schema;
  try {
    schema = planningSchema(root, named);
  } catch (cause) {
    return [`${path}: ${cause.message}`];
  }
  let floor = [];
  try {
    floor = fixPassFloor(schema);
  } catch {
    // No floor the lists share: a row owes no `always` reader here.
  }
  const refusals = [];
  for (const row of readRounds(now)) {
    const target = roundArtifactOf(row.artifact);
    // A row with no artifact is `check:manual`'s `round` rule to refuse.
    if (before.has(key(row)) || target === null) continue;
    let found;
    try {
      found = perspectivesRefusals({
        schema,
        named,
        target,
        cell: row.perspectives,
        floor,
      });
    } catch (cause) {
      found = [cause.message];
    }
    for (const one of found)
      refusals.push(`${path} round ${row.round}: ${one}`);
  }
  return refusals;
}

/** The schema a change's record names, or the store's own where it names
 * none or cannot be read — the `store` rule reports a record that cannot. */
function schemaOf(dir) {
  try {
    const fields = YAML.parse(
      readTextIfThere(join(dir, ".openspec.yaml")) ?? "",
    );
    return typeof fields?.schema === "string" ? fields.schema : SCHEMA;
  } catch {
    return SCHEMA;
  }
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

export function main(root, strict, only) {
  const changes = join(root, "openspec", "changes");
  // Named but absent, the CLI answers with the no-delta advice rather than
  // with the typo.
  if (only && !existsSync(join(changes, only)))
    throw new Error(`no change named \`${only}\``);
  const [command, ...lead] = cli(root);
  const run = spawnSync(
    command,
    [
      ...lead,
      "validate",
      ...(only ? [only, "--type", "change"] : ["--changes"]),
      "--json",
      ...(strict ? ["--strict"] : []),
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (run.error) throw new Error(`could not run the CLI: ${run.error.message}`);

  const items = report(run.stdout ?? "").items ?? [];
  const main = storeMain(root);
  if (!main)
    console.log(
      "rounds: no main to compare against, so no row is held to its readers here — plan:land holds each row it writes",
    );
  const waiting = [];
  const failed = [];
  for (const item of items) {
    const why = waitingOnSpecs(join(changes, item.id));
    const left = (item.issues ?? []).filter(
      (issue) =>
        issue.level !== "INFO" &&
        !(
          why !== undefined &&
          (issue.message.startsWith(NO_DELTA) ||
            issue.message.startsWith(NO_SECTIONS))
        ),
    );
    if (main)
      for (const message of addedRowRefusals(root, main, item.id))
        left.push({ level: "ERROR", path: "rounds.md", message });
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
  console.log(
    `${items.length} change(s) validated, ${waiting.length} waiting on an input`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  main(
    ROOT,
    args.includes("--strict"),
    args.find((one) => !one.startsWith("-")),
  );
}
