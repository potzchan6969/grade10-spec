import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";

export const PRINT_ENVIRONMENTS = [
  "staging-1",
  "staging-2",
  "uat",
  "preview",
  "prod",
  "staging",
  "production",
];

export function assertPrintedRun(run) {
  if (
    !/^[1-9]\d*-\S+$/.test(run.tab ?? "") ||
    !/^[\w-]+$/.test(run.spreadsheetId ?? "") ||
    !Number.isInteger(run.sheetId) ||
    run.sheetId < 0 ||
    !PRINT_ENVIRONMENTS.includes(run.env) ||
    !/^[a-f0-9]{40}$/.test(run.sourceCommit ?? "") ||
    !Array.isArray(run.cases) ||
    !run.cases.length
  )
    throw new Error("Invalid printed run identity or environment");
  const ids = new Set();
  for (const one of run.cases) {
    if (
      !/^\S+$/.test(one.id ?? "") ||
      ids.has(one.id) ||
      (one.marker === null
        ? one.rev !== null
        : !/^TC-[\w-]+$/.test(one.marker ?? "") ||
          !Number.isInteger(one.rev) ||
          one.rev < 1)
    )
      throw new Error("Invalid or duplicate printed case or revision");
    ids.add(one.id);
  }
  return run;
}

export function printedRunOf(record) {
  return assertPrintedRun({
    tab: record.tab,
    spreadsheetId: record.spreadsheetId,
    sheetId: record.sheetId,
    env: record.snapshot.env,
    sourceCommit: record.sourceCommit,
    cases: record.snapshot.selected.map((one) => ({
      id: one.id,
      marker: one.markerId?.match(/(?:^|\.)(TC-[\w-]+)$/)?.[1] ?? null,
      rev: one.markerId ? one.rev : null,
    })),
  });
}

export function printCommitMessage(record) {
  const run = record.cases ? assertPrintedRun(record) : printedRunOf(record);
  return (
    `chore(auction): record ${run.tab.replace(/^\d+-/, "")} printed run\n\n` +
    `Run: ${run.tab}\nSheet: ${run.spreadsheetId}\nTab: ${run.sheetId}\nTest environment: ${run.env}\nSource: ${run.sourceCommit}\n\nPrinted cases:\n` +
    run.cases
      .map(
        (one) =>
          `- ${one.id} | ${one.marker ? `${one.marker}@${one.rev}` : "unmarked"}`,
      )
      .join("\n") +
    "\n"
  );
}

export function parsePrintCommit(message) {
  const text = message.replaceAll("\r\n", "\n").trimEnd();
  const start = text.search(/^Run: /m);
  if (start < 0) {
    if (/^Printed cases:$/m.test(text))
      throw new Error("Printed cases block has no Run header");
    return null;
  }
  if (!/^Printed cases:$/m.test(text)) {
    if (/^Sheet: /m.test(text)) throw new Error("Printed run has no case list");
    return null;
  }
  const match =
    /^Run: ([^\n]+)\nSheet: ([^\n]+)\nTab: (\d+)\nTest environment: ([^\n]+)\nSource: ([^\n]+)\n\nPrinted cases:\n([\s\S]+)$/.exec(
      text.slice(start),
    );
  if (!match) throw new Error("Invalid printed run commit format");
  const cases = match[6].split("\n").map((line) => {
    const row = /^- (\S+) \| (TC-[\w-]+)@([1-9]\d*)$/.exec(line);
    if (row) return { id: row[1], marker: row[2], rev: Number(row[3]) };
    const unmarked = /^- (\S+) \| unmarked$/.exec(line);
    if (unmarked) return { id: unmarked[1], marker: null, rev: null };
    throw new Error("Invalid printed case line");
  });
  return assertPrintedRun({
    tab: match[1],
    spreadsheetId: match[2],
    sheetId: Number(match[3]),
    env: match[4],
    sourceCommit: match[5],
    cases,
  });
}

export const printKey = (run) =>
  `${run.spreadsheetId}:${Number(run.tab.split("-")[0])}`;

export function printCommits(root, range) {
  const out = execFileSync(
    "git",
    [
      "log",
      "--format=%H%x00%B%x00",
      "--extended-regexp",
      "--grep=^Run: ",
      "--grep=^Printed cases:$",
      range,
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const fields = out.split("\0");
  const found = [];
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const run = parsePrintCommit(fields[i + 1]);
    if (run) found.push({ commit: fields[i].trim(), run });
  }
  return found;
}

export function verifyPrintedRun(run, live, sheets) {
  assertPrintedRun(run);
  if (
    live?.state !== "finalized" ||
    !live.finalizedAt ||
    live.confirmedFingerprint !== live.snapshot?.fingerprint
  )
    throw new Error(
      "Only finalized records can merge; finalization is missing or cancelled",
    );
  if (!isDeepStrictEqual(run, printedRunOf(live)))
    throw new Error(
      "Printed run commit is stale; download the current finalized receipt",
    );
  const sheet = sheets.find((one) => one.properties.sheetId === run.sheetId);
  if (!sheet || sheet.properties.title !== run.tab)
    throw new Error(
      `Run ${Number(run.tab.split("-")[0])}: expected tab '${run.tab}' (gid ${run.sheetId}); ${sheet ? `renamed to '${sheet.properties.title}'` : "tab missing"}. https://docs.google.com/spreadsheets/d/${run.spreadsheetId}/edit#gid=${run.sheetId}`,
    );
}

export async function checkPrintedRuns(
  root,
  { token, spreadsheetId, fetcher = fetch, base = "origin/main" } = {},
) {
  const pending = printCommits(root, `${base}..HEAD`);
  if (!pending.length) return 0;
  const merged = new Set(
    printCommits(root, base).map((one) => printKey(one.run)),
  );
  const seen = new Set();
  for (const { run } of pending) {
    const key = printKey(run);
    if (run.spreadsheetId !== spreadsheetId)
      throw new Error("Printed run does not match the production spreadsheet");
    if (merged.has(key))
      throw new Error("Printed run is already merged and immutable");
    if (seen.has(key))
      throw new Error("More than one print commit for the same run");
    seen.add(key);
  }
  if (!token || !spreadsheetId)
    throw new Error("GOOGLE_ACCESS_TOKEN and TCS_SHEET_ID are required");
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
  const meta = await get("?fields=sheets.properties");
  const read = await get(`/values/${encodeURIComponent("'_Run records'")}`);
  if (read.values?.[0]?.[0] !== "Run ID" || read.values?.[0]?.[1] !== "Record")
    throw new Error("Run registry header is missing or invalid");
  const records = new Map();
  for (const row of read.values.slice(1)) {
    if (!String(row[0] ?? "").trim()) continue;
    const record = JSON.parse(row.slice(1).join(""));
    if (Number(row[0]) !== record.runId || records.has(record.runId))
      throw new Error("Duplicate or mismatched run id in registry");
    records.set(record.runId, record);
  }
  for (const { run } of pending)
    verifyPrintedRun(
      run,
      records.get(Number(run.tab.split("-")[0])),
      meta.sheets ?? [],
    );
  return pending.length;
}
