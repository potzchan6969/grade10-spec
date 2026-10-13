#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import {
  candidatesAt,
  git,
  mergedRecord,
  recordBranch,
  recordPath,
  refreshMain,
  selectionSnapshot,
  validateRecord,
} from "./lib/run-sheet-records.mjs";
import { inReadingOrder, selectCases } from "./lib/select-cases.mjs";
import { ROOT } from "./lib/suites.mjs";

const USAGE = `Usage: pnpm tcs:run-record --record <downloaded run-record.json> [--replace | --cancel]

Creates one local commit on a dedicated run branch. It never pushes.
--replace explicitly replaces that branch's only unmerged print commit.
--cancel removes that commit after a --reopen receipt; it never changes another branch.
Download a fresh artifact from the print/finalize/reopen workflow before using it.`;

export function runBranch(record) {
  return recordBranch(record);
}

export function assertDedicatedCommit(root, branch, path) {
  if (git(root, ["branch", "--show-current"]) !== branch)
    throw new Error(`Use dedicated branch ${branch}`);
  const base = git(root, ["merge-base", "origin/main", "HEAD"]);
  const commits = git(root, ["rev-list", `${base}..HEAD`])
    .split("\n")
    .filter(Boolean);
  if (commits.length > 1)
    throw new Error(
      "Run branch contains more than one commit; do not rewrite it",
    );
  if (commits.length === 1) {
    const paths = git(root, [
      "diff-tree",
      "--no-commit-id",
      "--name-only",
      "-r",
      "HEAD",
    ]).split("\n");
    if (paths.length !== 1 || paths[0] !== path)
      throw new Error(
        "Run branch contains unrelated changes; do not rewrite it",
      );
  }
  return commits.length;
}

export function commitRun(
  root,
  record,
  { replace = false, cancel = false } = {},
) {
  validateRecord(record);
  if (git(root, ["status", "--porcelain"]))
    throw new Error("Use a clean checkout; preserve unrelated changes first");
  const main = refreshMain(root);
  if (mergedRecord(root, record.spreadsheetId, record.runId))
    throw new Error(
      `Run ${record.runId} is merged; it cannot be replaced or cancelled`,
    );
  if (cancel && record.state !== "trial")
    throw new Error("--cancel needs a reopened trial receipt");
  if (!cancel && record.state !== "finalized")
    throw new Error("Trial prints do not create commits; finalize first");
  const path = recordPath(record.spreadsheetId, record.runId);
  const branch = runBranch(record);
  const exists = git(root, ["branch", "--list", branch]);
  if (!exists && cancel)
    throw new Error("There is no local print commit to cancel");
  if (!exists) git(root, ["switch", "-c", branch, "origin/main"]);
  else if (git(root, ["branch", "--show-current"]) !== branch)
    git(root, ["switch", branch]);
  const count = assertDedicatedCommit(root, branch, path);
  const file = join(root, path);
  if (cancel) {
    if (count === 0) return { branch, changed: false };
    git(root, ["reset", "--soft", "HEAD^"]);
    git(root, ["reset", "HEAD", "--", path]);
    if (existsSync(file)) unlinkSync(file);
    return { branch, changed: true, cancelled: true };
  }
  const bytes = `${JSON.stringify(record, null, 2)}\n`;
  if (existsSync(file) && readFileSync(file, "utf8") === bytes)
    return { branch, changed: false, commit: git(root, ["rev-parse", "HEAD"]) };
  if (count && !replace)
    throw new Error(
      "Run already has a print commit; use --replace after reopening and refinalizing",
    );
  // Recheck accepted TCs at the source captured when the human finalized.
  // Later changes do not invalidate an already finalized snapshot.
  const source = candidatesAt(root, record.sourceCommit);
  const result = selectCases(source, {
    ids: record.snapshot.selected.map((one) => one.id),
    includeDraft: record.snapshot.options.includeDraft,
    includeAutomated: record.snapshot.options.includeAutomated,
  });
  if (result.missing.length || result.refused.length)
    throw new Error(
      "Record selection cannot be recreated at its pinned source",
    );
  const snapshot = selectionSnapshot(inReadingOrder(result.picked), {
    ...record.snapshot.options,
    name: record.snapshot.name,
    env: record.snapshot.env,
    selection: record.snapshot.selection,
    excluded: record.snapshot.excluded,
  });
  if (snapshot.fingerprint !== record.snapshot.fingerprint)
    throw new Error("Record does not match its pinned TCs");
  // Only the dedicated, inspected print commit is rebased or amended.
  if (count) git(root, ["rebase", "origin/main"]);
  else if (git(root, ["rev-parse", "HEAD"]) !== main)
    git(root, ["merge", "--ff-only", "origin/main"]);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, bytes);
  git(root, ["add", "--", path]);
  execFileSync(
    "git",
    [
      "commit",
      ...(count ? ["--amend"] : []),
      "-m",
      `chore(tcs): record printed run ${record.runId}`,
    ],
    { cwd: root, stdio: "inherit" },
  );
  return { branch, changed: true, commit: git(root, ["rev-parse", "HEAD"]) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const { flags } = parseArgs(process.argv.slice(2), {
      keys: ["record"],
      booleans: ["replace", "cancel"],
      usage: USAGE,
    });
    if (!flags.record || (flags.replace && flags.cancel))
      throw new Error(USAGE);
    const record = JSON.parse(readFileSync(flags.record, "utf8"));
    const result = commitRun(ROOT, record, {
      replace: flags.replace,
      cancel: flags.cancel,
    });
    console.log(JSON.stringify(result, null, 2));
    console.log(
      "Local only. Publish finalized records through a PR; replacement uses --force-with-lease on this branch only.",
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
