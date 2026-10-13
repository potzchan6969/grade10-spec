#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { parseArgs } from "./lib/args.mjs";
import {
  assertRunTab,
  git,
  parseRecordRows,
  RECORD_TAB,
  recordPath,
  validateRecord,
} from "./lib/run-sheet-records.mjs";

export function verifyRecord(record, live, sheets) {
  validateRecord(record);
  if (record.state !== "finalized")
    throw new Error("Only finalized records can merge");
  if (!live || !isDeepStrictEqual(record, live))
    throw new Error(
      `Run ${record.runId}: manifest is stale or finalization was cancelled; download a fresh finalized artifact`,
    );
  assertRunTab(record, sheets);
}

export async function checkRecords(
  root,
  { token, spreadsheetId, fetcher = fetch } = {},
) {
  if (!token || !spreadsheetId)
    throw new Error("GOOGLE_ACCESS_TOKEN and TCS_SHEET_ID are required");
  const paths = git(root, [
    "diff",
    "--name-only",
    "origin/main...HEAD",
    "--",
    "docs/test-runs",
  ])
    .split("\n")
    .filter((path) => path.endsWith(".json"));
  const get = async (suffix) => {
    const response = await fetcher(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${suffix}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok)
      throw new Error(
        `Cannot verify live run registry: HTTP ${response.status}`,
      );
    return response.json();
  };
  if (!paths.length) return 0;
  const meta = await get("?fields=sheets.properties");
  const read = await get(`/values/${encodeURIComponent(`'${RECORD_TAB}'`)}`);
  const registry = parseRecordRows(read.values ?? []);
  for (const path of paths) {
    if (git(root, ["ls-tree", "--name-only", "origin/main", "--", path]))
      throw new Error(`${path} is merged and immutable`);
    const record = validateRecord(
      JSON.parse(readFileSync(join(root, path), "utf8")),
    );
    if (
      record.spreadsheetId !== spreadsheetId ||
      path !== recordPath(record.spreadsheetId, record.runId)
    )
      throw new Error(
        `${path}: manifest identity does not match the production spreadsheet`,
      );
    verifyRecord(record, registry.get(record.runId)?.record, meta.sheets ?? []);
  }
  return paths.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const { flags } = parseArgs(process.argv.slice(2), {
      keys: ["root"],
      usage: "Usage: node verify-run-record.mjs --root <candidate checkout>",
    });
    if (!flags.root) throw new Error("--root is required");
    const count = await checkRecords(flags.root, {
      token: process.env.GOOGLE_ACCESS_TOKEN,
      spreadsheetId: process.env.TCS_SHEET_ID,
    });
    console.log(
      `Verified ${count} finalized run records against the live registry`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
