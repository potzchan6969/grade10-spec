/**
 * The gate a commit on `main` passes before it is pushed there:
 * `validate:changes`, `check:manual` and `tcs:validate`, run in this process
 * against a tree holding that commit. `plan:land` runs it on the commit it
 * cuts, and the application's `pnpm plan done` and `undone` run it on the
 * plan they record, so a record pushed straight to `main` faces the same
 * gate as a landing.
 *
 * Returns the first refusal as one line, or null when the tree passes. The
 * reports print as they run. `PLAN_NO_FETCH` is held at 1 while it runs:
 * whoever cut the commit has just read `main`.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatReport,
  runChecks,
} from "../../../tools/manual/check/check-manual.mjs";
import { main as validateChanges } from "../validate-changes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

export async function gate(tree, change) {
  const noFetch = process.env.PLAN_NO_FETCH;
  process.env.PLAN_NO_FETCH = "1";
  try {
    return (
      runValidateChanges(tree, change) ??
      (await runCheckManual(tree)) ??
      runTcsValidate(tree, change)
    );
  } finally {
    if (noFetch === undefined) delete process.env.PLAN_NO_FETCH;
    else process.env.PLAN_NO_FETCH = noFetch;
  }
}

/** `validate:changes --strict <change>`: `main` sets `process.exitCode`
 * rather than throwing on a validation failure, so that is what is read
 * back, and reset either way - the caller's exit code is its own to set. */
function runValidateChanges(tree, change) {
  const before = process.exitCode;
  process.exitCode = undefined;
  try {
    validateChanges(tree, true, change);
    return process.exitCode ? "the gate refuses: validate:changes" : null;
  } catch (cause) {
    return `the gate refuses: validate:changes\n${cause.message}`;
  } finally {
    process.exitCode = before;
  }
}

/** `check:manual`: `runChecks` is pure over the root it is given, so this
 * reads the tree that lands rather than the checkout it was cut from. */
async function runCheckManual(tree) {
  let result;
  try {
    result = await runChecks(tree);
  } catch (cause) {
    return `the gate refuses: check:manual\n${cause.message}`;
  }
  const { text, failures } = formatReport(tree, result);
  console.log(text);
  return failures > 0 ? "the gate refuses: check:manual" : null;
}

/** `tcs:validate`, scoped to the change so the gate judges what the change
 * itself owes rather than every suite the store holds. The script reads the
 * store its own file sits in and calls `process.exit` itself, so the tree's
 * own copy runs where the tree carries one, and this store's where it does
 * not. */
function runTcsValidate(tree, change) {
  const own = join(tree, "scripts", "openspec", "validate-test-cases.mjs");
  const file = existsSync(own)
    ? own
    : join(HERE, "..", "validate-test-cases.mjs");
  const ran = spawnSync(
    process.execPath,
    [file, `openspec/changes/${change}`],
    {
      cwd: tree,
      stdio: "inherit",
    },
  );
  return ran.status === 0 ? null : "the gate refuses: tcs:validate";
}
