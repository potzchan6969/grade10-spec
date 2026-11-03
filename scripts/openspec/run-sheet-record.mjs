#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import {
  deskAccess,
  deskRequest,
  deskRunOf,
  printCommitMessage,
  printCommits,
  printedRunOf,
  printKey,
} from "./lib/printed-run-message.mjs";
import {
  candidatesAt,
  git,
  mergedDeskRecord,
  mergedRecord,
  recordBranch,
  refreshMain,
  selectionSnapshot,
  validateRecord,
} from "./lib/run-sheet-records.mjs";
import { inReadingOrder, selectCases } from "./lib/select-cases.mjs";
import { ROOT } from "./lib/suites.mjs";

const USAGE = `Usage: pnpm tcs:run-record --record <downloaded run-record.json> [--replace | --cancel]
       pnpm tcs:run-record --desk-record <downloaded desk record.json> [--replace | --cancel]
       pnpm tcs:run-record --desk-run <desk run id> [--replace | --cancel]
Creates an empty print commit with the agreed message. Reuses the current feature branch.
On main, creates a dedicated run branch. It never pushes or writes repo JSON.
Replacement/cancellation only rewrites this run's empty HEAD commit; later work refuses.
--desk-run reads the record with the Access service token (CF_ACCESS_CLIENT_ID, CF_ACCESS_CLIENT_SECRET).`;
export const runBranch = (record) => recordBranch(record);
export const deskRunBranch = (run) => `codex/print-run-desk-${run.desk}`;

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

/**
 * One empty print commit for one run, whichever place it was walked in:
 * reuse the feature branch (a run branch from main), keep one commit per run,
 * repeat as a no-op, and rewrite only this run's empty HEAD commit.
 */
function commitPrint(
  root,
  { run, branch: ownBranch, merged, finalized, cancelling, verify },
  { replace = false, cancel = false } = {},
) {
  if (git(root, ["status", "--porcelain"]))
    throw new Error("Use a clean checkout; preserve unrelated changes first");
  refreshMain(root);
  if (merged())
    throw new Error(
      `${label(run)} is merged; it cannot be replaced or cancelled`,
    );
  if (cancel && !cancelling)
    throw new Error("--cancel needs a reopened trial receipt");
  if (!cancel && !finalized)
    throw new Error("Trial prints do not create commits; finalize first");
  let branch = git(root, ["branch", "--show-current"]);
  if (!branch) throw new Error("Use a feature branch, not detached HEAD");
  if (branch === "main") {
    branch = ownBranch;
    if (git(root, ["branch", "--list", branch])) git(root, ["switch", branch]);
    else if (cancel)
      throw new Error("There is no local print commit to cancel");
    else git(root, ["switch", "-c", branch, "origin/main"]);
  }
  const previous = printCommits(root, "origin/main..HEAD").filter(
    (one) => printKey(one.run) === printKey(run),
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
  const message = printCommitMessage(run);
  if (previous.length && printCommitMessage(previous[0].run) === message)
    return { branch, changed: false, commit: previous[0].commit };
  if (previous.length && !replace)
    throw new Error(
      "Run already has a print commit; use --replace after reopening and refinalizing",
    );
  if (previous.length) assertEmptyHead(root, previous[0].commit);
  verify();
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

const label = (run) =>
  run.desk === undefined
    ? `Run ${Number(run.tab.split("-")[0])}`
    : `Desk run ${run.desk}`;

export function commitRun(root, record, options = {}) {
  validateRecord(record);
  return commitPrint(
    root,
    {
      run: printedRunOf(record),
      branch: runBranch(record),
      merged: () => mergedRecord(root, record.spreadsheetId, record.runId),
      finalized: record.state === "finalized",
      cancelling: record.state === "trial",
      verify: () => {
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
      },
    },
    options,
  );
}

/**
 * The print commit of a run walked on the desk, from its record
 * (`GET /api/desk/runs/:id/record`). It needs the run finalized or closed,
 * and every case it names at its source commit with the same revision.
 */
export function commitDeskRun(root, record, options = {}) {
  const run = deskRunOf(record);
  const state = record.run.state;
  return commitPrint(
    root,
    {
      run,
      branch: deskRunBranch(run),
      merged: () => mergedDeskRecord(root, run.desk),
      finalized: state === "finalized" || state === "closed",
      cancelling: state === "open",
      verify: () => {
        const held = new Map(
          candidatesAt(root, run.sourceCommit).map((one) => [one.tc.id, one]),
        );
        for (const one of run.cases) {
          const found = held.get(one.id);
          const marker =
            found?.tc.markerId?.match(/(?:^|\.)(TC-[\w-]+)$/)?.[1] ?? null;
          if (
            !found ||
            marker !== one.marker ||
            (marker ? found.tc.markerRev : null) !== one.rev
          )
            throw new Error(
              `${one.id} is not at ${one.marker ? `${one.marker}@${one.rev}` : "an unmarked revision"} in ${run.sourceCommit}; the record does not match its pinned cases`,
            );
        }
      },
    },
    options,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const { flags } = parseArgs(process.argv.slice(2), {
      keys: ["record", "desk-record", "desk-run"],
      booleans: ["replace", "cancel"],
      usage: USAGE,
    });
    const sources = [flags.record, flags["desk-record"], flags["desk-run"]];
    if (sources.filter(Boolean).length !== 1 || (flags.replace && flags.cancel))
      throw new Error(USAGE);
    const result = flags.record
      ? commitRun(ROOT, JSON.parse(readFileSync(flags.record, "utf8")), flags)
      : commitDeskRun(
          ROOT,
          flags["desk-record"]
            ? JSON.parse(readFileSync(flags["desk-record"], "utf8"))
            : await deskRequest(
                deskAccess(),
                `/runs/${encodeURIComponent(flags["desk-run"])}/record`,
              ),
          flags,
        );
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
