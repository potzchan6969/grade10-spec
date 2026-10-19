#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import {
  printCommitMessage,
  printCommits,
  printedRunOf,
  printKey,
} from "./lib/printed-run-message.mjs";
import {
  candidatesAt,
  git,
  mergedRecord,
  recordBranch,
  refreshMain,
  selectionSnapshot,
  validateRecord,
} from "./lib/run-sheet-records.mjs";
import { inReadingOrder, selectCases } from "./lib/select-cases.mjs";
import { ROOT } from "./lib/suites.mjs";

const USAGE = `Usage: pnpm tcs:run-record --record <downloaded run-record.json> [--replace | --cancel]
Creates an empty print commit with the agreed message. Reuses the current feature branch.
On main, creates a dedicated run branch. It never pushes or writes repo JSON.
Replacement/cancellation only rewrites this run's empty HEAD commit; later work refuses.`;
export const runBranch = (record) => recordBranch(record);

function assertEmptyHead(root, commit) {
  if (git(root, ["rev-parse", "HEAD"]) !== commit)
    throw new Error(
      "The print commit is not HEAD; rebase explicitly before replacing it",
    );
  if (
    git(root, [
      "diff-tree",
      "--root",
      "--no-commit-id",
      "--name-only",
      "-r",
      commit,
    ])
  )
    throw new Error(
      "The print commit contains unrelated files; do not rewrite it",
    );
}

export function commitRun(
  root,
  record,
  { replace = false, cancel = false } = {},
) {
  validateRecord(record);
  if (git(root, ["status", "--porcelain"]))
    throw new Error("Use a clean checkout; preserve unrelated changes first");
  refreshMain(root);
  if (mergedRecord(root, record.spreadsheetId, record.runId))
    throw new Error(
      `Run ${record.runId} is merged; it cannot be replaced or cancelled`,
    );
  if (cancel && record.state !== "trial")
    throw new Error("--cancel needs a reopened trial receipt");
  if (!cancel && record.state !== "finalized")
    throw new Error("Trial prints do not create commits; finalize first");
  let branch = git(root, ["branch", "--show-current"]);
  if (!branch) throw new Error("Use a feature branch, not detached HEAD");
  if (branch === "main") {
    branch = runBranch(record);
    if (git(root, ["branch", "--list", branch])) git(root, ["switch", branch]);
    else if (cancel)
      throw new Error("There is no local print commit to cancel");
    else git(root, ["switch", "-c", branch, "origin/main"]);
  }
  const previous = printCommits(root, "origin/main..HEAD").filter(
    (one) => printKey(one.run) === `${record.spreadsheetId}:${record.runId}`,
  );
  if (previous.length > 1)
    throw new Error(
      "More than one print commit for this run; rebase explicitly",
    );
  if (cancel) {
    if (!previous.length) return { branch, changed: false };
    assertEmptyHead(root, previous[0].commit);
    git(root, ["reset", "--soft", "HEAD^"]);
    return { branch, changed: true, cancelled: true };
  }
  const message = printCommitMessage(record);
  if (previous.length && printCommitMessage(previous[0].run) === message)
    return { branch, changed: false, commit: previous[0].commit };
  if (previous.length && !replace)
    throw new Error(
      "Run already has a print commit; use --replace after reopening and refinalizing",
    );
  if (previous.length) assertEmptyHead(root, previous[0].commit);
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
  printedRunOf(record);
  execFileSync(
    "git",
    [
      "commit",
      "--allow-empty",
      ...(previous.length ? ["--amend"] : []),
      "-m",
      message,
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
    const result = commitRun(
      ROOT,
      JSON.parse(readFileSync(flags.record, "utf8")),
      flags,
    );
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
