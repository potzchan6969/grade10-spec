import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { COLUMNS, RECORDED_ENVIRONMENTS } from "./run-sheet-layout.mjs";
import {
  buildGrid,
  caseRows,
  inReadingOrder,
  readCandidates,
} from "./select-cases.mjs";

export const RECORD_TAB = "_Run records";
export const RECORD_HEADERS = ["Run ID", "Record"];
export const FORMAT_VERSION = 2;
export const digest = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function recordPath(spreadsheetId, runId) {
  if (!/^[\w-]+$/.test(spreadsheetId) || !/^[1-9]\d*$/.test(String(runId)))
    throw new Error("Invalid spreadsheet id or run id");
  return `docs/test-runs/${spreadsheetId}/run-${runId}.json`;
}

export function normalizeExclusions(excluded, picked) {
  if (!Array.isArray(excluded))
    throw new Error("Exclusions must be an array of {id, reason}");
  const selected = new Set(picked.map((one) => one.tc.id));
  const byId = new Map();
  for (const item of excluded) {
    if (
      typeof item.id !== "string" ||
      !item.id.trim() ||
      typeof item.reason !== "string" ||
      !item.reason.trim()
    )
      throw new Error(
        "Each intentional exclusion needs a case id and a reason",
      );
    if (selected.has(item.id))
      throw new Error(`${item.id} is both selected and excluded`);
    if (byId.has(item.id)) throw new Error(`${item.id} is excluded twice`);
    byId.set(item.id, { id: item.id, reason: item.reason.trim() });
  }
  return [...byId.values()].sort((a, b) =>
    a.id.localeCompare(b.id, "en", { numeric: true }),
  );
}

export function selectionSnapshot(
  picked,
  {
    name,
    env,
    selection = "",
    excluded = [],
    includeDraft = false,
    includeAutomated = true,
    scope = null,
    changedSince = null,
    suites = null,
    priority = null,
    level = null,
  } = {},
) {
  const ordered = inReadingOrder(picked);
  const unique = new Set();
  for (const one of ordered) {
    if (unique.has(one.tc.id))
      throw new Error(`Duplicate selected case ${one.tc.id}`);
    unique.add(one.tc.id);
  }
  const selected = ordered.map((one) => ({
    id: one.tc.id,
    markerId: one.tc.markerId ?? null,
    rev: one.tc.markerRev ?? null,
    path: one.read.rel,
    digest: digest({
      rows: caseRows(one),
      props: [...one.tc.props],
      journey: { raw: one.tc.journey?.raw, title: one.tc.journey?.title },
    }),
  }));
  const snapshot = {
    formatVersion: FORMAT_VERSION,
    name,
    env,
    selection,
    options: {
      includeDraft,
      includeAutomated,
      scope,
      changedSince,
      suites,
      priority,
      level,
    },
    selected,
    excluded: normalizeExclusions(excluded, ordered),
    gridDigest: digest({ columns: COLUMNS, rows: buildGrid(ordered).rows }),
  };
  return { ...snapshot, fingerprint: digest(snapshot) };
}

export function validateRecord(record) {
  if (record?.version !== 1 || !["trial", "finalized"].includes(record.state))
    throw new Error("Invalid run record version or state");
  const fields = new Set([
    "version",
    "state",
    "spreadsheetId",
    "runId",
    "sheetId",
    "tab",
    "sourceCommit",
    "snapshot",
    "copiedFrom",
    "finalizedAt",
    "confirmedFingerprint",
    "sandbox",
  ]);
  for (const key of Object.keys(record))
    if (!fields.has(key))
      throw new Error(
        `Unexpected run record field: ${key}; manifests carry no execution results`,
      );
  recordPath(record.spreadsheetId, record.runId);
  if (
    record.sandbox ||
    !Number.isInteger(record.runId) ||
    !Number.isInteger(record.sheetId) ||
    record.sheetId < 0 ||
    typeof record.tab !== "string" ||
    !record.tab ||
    !/^[0-9a-f]{40}$/.test(record.sourceCommit)
  )
    throw new Error(
      "Run record needs production sheet identity and a source commit",
    );
  const snapshot = record.snapshot;
  if (
    !snapshot ||
    snapshot.formatVersion !== FORMAT_VERSION ||
    !snapshot.name ||
    !RECORDED_ENVIRONMENTS.includes(snapshot.env) ||
    !Array.isArray(snapshot.selected) ||
    snapshot.selected.length === 0 ||
    !Array.isArray(snapshot.excluded) ||
    !snapshot.options
  )
    throw new Error("Run record has no valid selection snapshot");
  const { fingerprint, ...content } = snapshot;
  if (fingerprint !== digest(content))
    throw new Error("Run record fingerprint does not match its contents");
  const ids = new Set();
  for (const one of snapshot.selected) {
    if (
      !one.id ||
      ids.has(one.id) ||
      !one.path?.startsWith("openspec/specs/") ||
      !/^[0-9a-f]{64}$/.test(one.digest)
    )
      throw new Error("Invalid or duplicate selected case");
    ids.add(one.id);
  }
  normalizeExclusions(
    snapshot.excluded,
    snapshot.selected.map((tc) => ({ tc })),
  );
  if (
    record.state === "finalized" &&
    (!record.finalizedAt || record.confirmedFingerprint !== fingerprint)
  )
    throw new Error("Finalized run has no confirmed fingerprint");
  return record;
}

export function recordCells(record, { columns = 26 } = {}) {
  const json = JSON.stringify(validateRecord(record));
  // Sheets limits one cell to 50,000 characters. Pad the write so a shorter
  // replacement cannot retain trailing chunks from the old record.
  const chunks = [];
  for (let at = 0; at < json.length; ) {
    let end = Math.min(at + 40000, json.length);
    const last = json.charCodeAt(end - 1);
    if (end < json.length && last >= 0xd800 && last <= 0xdbff) end--;
    chunks.push(json.slice(at, end));
    at = end;
  }
  return [
    record.runId,
    ...chunks,
    ...Array(Math.max(0, columns - chunks.length - 1)).fill(""),
  ];
}

export function parseRecordRows(rows) {
  if (
    !rows.length ||
    rows[0][0] !== RECORD_HEADERS[0] ||
    rows[0][1] !== RECORD_HEADERS[1]
  )
    throw new Error("Run registry header is missing or invalid");
  const records = new Map();
  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];
    if (!String(row[0] ?? "").trim()) continue;
    const record = validateRecord(JSON.parse(row.slice(1).join("")));
    if (Number(row[0]) !== record.runId || records.has(record.runId))
      throw new Error("Duplicate or mismatched run id in registry");
    records.set(record.runId, { record, row: index + 1 });
  }
  return records;
}

export function assertRunTab(record, sheets) {
  const found = sheets.find(
    (sheet) => sheet.properties.sheetId === record.sheetId,
  );
  const link = `https://docs.google.com/spreadsheets/d/${record.spreadsheetId}/edit#gid=${record.sheetId}`;
  if (!found || found.properties.title !== record.tab)
    throw new Error(
      `Run ${record.runId}: expected tab '${record.tab}' (gid ${record.sheetId}); ` +
        `${found ? `renamed to '${found.properties.title}'` : "tab missing"}. ${link}. Restore it in Sheets before retrying.`,
    );
}

export function transition(
  record,
  action,
  {
    merged = false,
    snapshot = null,
    confirmed = null,
    now = new Date().toISOString(),
  } = {},
) {
  if (merged)
    throw new Error(`Run ${record.runId} is merged; create a new run instead`);
  if (action === "reopen") {
    if (record.state !== "finalized")
      throw new Error("Only a finalized run can be reopened");
    const { finalizedAt, confirmedFingerprint, ...rest } = record;
    return { ...rest, state: "trial" };
  }
  if (action === "print") {
    if (record.state !== "trial")
      throw new Error("Cancel finalization with --reopen before reprinting");
    return snapshot?.fingerprint === record.snapshot.fingerprint
      ? "unchanged"
      : "rewrite";
  }
  if (action === "finalize") {
    if (!snapshot || snapshot.fingerprint !== record.snapshot.fingerprint)
      throw new Error(
        "Selected TCs or print content changed on latest main; reprint and confirm before finalizing",
      );
    if (confirmed !== snapshot.fingerprint)
      throw new Error(
        "Confirm the current printed fingerprint before finalizing",
      );
    if (record.state === "finalized") return record;
    return {
      ...record,
      state: "finalized",
      finalizedAt: now,
      confirmedFingerprint: confirmed,
    };
  }
  throw new Error(`Unknown run action ${action}`);
}

export function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

export function refreshMain(root) {
  git(root, ["fetch", "origin", "main"]);
  return git(root, ["rev-parse", "origin/main"]);
}

export function mergedRecord(root, spreadsheetId, runId, ref = "origin/main") {
  const path = recordPath(spreadsheetId, runId);
  const exists = git(root, ["ls-tree", "--name-only", ref, "--", path]);
  if (!exists) return null;
  return validateRecord(JSON.parse(git(root, ["show", `${ref}:${path}`])));
}

/** Read accepted suites from a Git snapshot, never from uncommitted files. */
export function candidatesAt(root, ref) {
  const scratch = mkdtempSync(join(tmpdir(), "run-sheet-source-"));
  try {
    const archive = execFileSync("git", ["archive", ref, "openspec/specs"], {
      cwd: root,
      maxBuffer: 64 * 1024 * 1024,
    });
    execFileSync("tar", ["-x", "-C", scratch], { input: archive });
    return readCandidates(scratch).filter((one) =>
      one.read.rel.startsWith("openspec/specs/"),
    );
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

export function recordBranch(record) {
  return `codex/print-run-${digest(record.spreadsheetId).slice(0, 12)}-${record.runId}`;
}

/** A cancelled published receipt must not retain an earlier green PR status. */
export function invalidatePublishedRun(
  root,
  record,
  {
    repository = process.env.GITHUB_REPOSITORY,
    postStatus = (sha) => {
      if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? ""))
        throw new Error(
          "GITHUB_REPOSITORY is required to invalidate a published run",
        );
      execFileSync(
        "gh",
        [
          "api",
          `repos/${repository}/statuses/${sha}`,
          "-f",
          "state=failure",
          "-f",
          "context=tcs/run-finalized",
          "-f",
          "description=Finalization cancelled; reprint and finalize before merging",
        ],
        { cwd: root, stdio: "pipe" },
      );
    },
  } = {},
) {
  const ref = git(root, [
    "ls-remote",
    "--heads",
    "origin",
    recordBranch(record),
  ]);
  if (!ref) return false;
  const sha = ref.split(/\s+/)[0];
  if (!/^[0-9a-f]{40}$/.test(sha))
    throw new Error("Published run branch has no valid commit");
  postStatus(sha);
  return true;
}

export function cellRows(rows, { formulaColumns = [] } = {}) {
  return rows.map((row) => ({
    values: row.map((value, column) => ({
      userEnteredValue:
        typeof value === "number"
          ? { numberValue: value }
          : typeof value === "boolean"
            ? { boolValue: value }
            : formulaColumns.includes(column) &&
                String(value ?? "").startsWith("=")
              ? { formulaValue: value }
              : { stringValue: String(value ?? "") },
    })),
  }));
}
