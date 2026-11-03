/**
 * The run sheet's side of the run desk: reading a source with its release,
 * writing a confirmed selection as a `RunSpec`, opening it, and re-running a
 * run's failed and blocked rows. Imported only on the desk path, so a Sheet
 * print never loads the manual's modules.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  currentMarks,
  rowVerdict,
} from "../../../tools/manual/src/api/verdicts.ts";
import {
  deskAccess,
  deskRequest,
  MISSING_SERVICE_TOKEN,
} from "./printed-run-message.mjs";
import { READY_STEPS, readReleaseAt } from "./release-units.mjs";
import { atSource, digest, isSourcePath } from "./run-sheet-records.mjs";
import { readCandidates } from "./select-cases.mjs";

export { rowsOf, runSpecOf } from "./run-spec.mjs";
export { deskAccess, MISSING_SERVICE_TOKEN };

/** Where the desk's pages are, for the links a run prints. */
export const deskBase = (env = process.env) => deskAccess(env).base;

/** The cases, the release and each suite's text at one commit: the run's
 *  whole source, read from Git rather than the working tree. */
export function deskSourceAt(root, ref) {
  return atSource(root, ref, ["openspec/specs", "docs/prds"], (dir) => {
    const candidates = readCandidates(dir).filter((one) =>
      isSourcePath(one.read.rel),
    );
    const texts = new Map();
    for (const one of candidates)
      if (!texts.has(one.read.rel))
        texts.set(one.read.rel, readFileSync(one.read.path, "utf8"));
    return {
      candidates,
      texts,
      release: { ...readReleaseAt(dir), readySteps: READY_STEPS },
    };
  });
}

export function specFile(out, fingerprint) {
  return (
    out ??
    join(tmpdir(), "run-desk", `run-spec-${fingerprint.slice(0, 12)}.json`)
  );
}

export function writeSpec(spec, file) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`);
  return file;
}

/** What to say when the desk cannot be reached without the token: the
 *  written spec still opens from the desk's own page. */
export function withoutToken(file, env = process.env) {
  return `${MISSING_SERVICE_TOKEN} (a known Blocker). Open ${file} from ${deskBase(env)}/runs with "Open a run" instead.`;
}

export const openRun = (spec, { access = deskAccess(), fetcher } = {}) =>
  deskRequest(access, "/runs", { method: "POST", body: spec, fetcher });

/** The desk's own re-run: a new open run of the failed and blocked rows. */
export const rerunRun = (id, name, { access = deskAccess(), fetcher } = {}) =>
  deskRequest(access, `/runs/${encodeURIComponent(id)}/rerun`, {
    method: "POST",
    body: { name },
    fetcher,
  });

export const readRun = (id, { access = deskAccess(), fetcher } = {}) =>
  deskRequest(access, `/runs/${encodeURIComponent(id)}`, { fetcher });

export const readRecord = (id, { access = deskAccess(), fetcher } = {}) =>
  deskRequest(access, `/runs/${encodeURIComponent(id)}/record`, { fetcher });

export const RERUN_DEFAULT = ["fail", "blocked"];

const VERDICT_WORD = { failed: "fail", fail: "fail", blocked: "blocked" };

/** `--only failed,blocked` as verdicts; anything else is refused. */
export function onlyOf(value) {
  if (!value) return RERUN_DEFAULT;
  const words = String(value)
    .split(",")
    .map((one) => one.trim().toLowerCase())
    .filter(Boolean);
  for (const one of words)
    if (!VERDICT_WORD[one])
      throw new Error(`--only takes failed and blocked, not ${one}`);
  return [...new Set(words.map((one) => VERDICT_WORD[one]))];
}

/**
 * A run's rows whose verdict (One Verdict per Row) is one of `only`, as a new
 * run's spec: the cases frozen as the run holds them, a per-row case keeping
 * only the data rows to walk again. Its fingerprint covers what it walks.
 */
export function rerunSpecOf(view, { only = RERUN_DEFAULT, name = null } = {}) {
  const byRow = new Map();
  for (const mark of view.marks ?? []) {
    if (!byRow.has(mark.row)) byRow.set(mark.row, []);
    byRow.get(mark.row).push(mark);
  }
  const caseOf = new Map(view.spec.cases.map((one) => [one.id, one]));
  const rows = view.rows.filter((row) => {
    const inPlay = caseOf.get(row.case)?.surfaces;
    const { verdict } = rowVerdict(
      currentMarks(byRow.get(row.key) ?? []),
      inPlay,
    );
    return only.includes(verdict);
  });
  const picked = new Map();
  for (const row of rows) {
    if (!picked.has(row.case)) picked.set(row.case, new Set());
    if (row.index > 0) picked.get(row.case).add(row.index);
  }
  const cases = view.spec.cases
    .filter((one) => picked.has(one.id))
    .map((one) =>
      one.data && picked.get(one.id).size > 0
        ? {
            ...one,
            data: {
              header: one.data.header,
              rows: one.data.rows.filter((_, at) =>
                picked.get(one.id).has(at + 1),
              ),
            },
          }
        : one,
    );
  const kept = new Set(cases.map((one) => one.id));
  const walks = (view.spec.walks ?? [])
    .map((walk) => ({
      ...walk,
      route: walk.route.map((step) => ({
        ...step,
        cases: step.cases.filter((id) => kept.has(id)),
      })),
    }))
    .filter((walk) => walk.route.some((step) => step.cases.length > 0));
  const { fingerprint: _old, ...rest } = view.spec;
  const content = {
    ...rest,
    name: name ?? `${view.spec.name} re-run`,
    selection: `${only.join(" and ")} rows of run ${view.run.id}`,
    cases,
    walks,
    rerunOf: view.run.id,
  };
  return {
    spec: { ...content, fingerprint: digest(content) },
    rows: rows.map((row) => row.key),
  };
}
