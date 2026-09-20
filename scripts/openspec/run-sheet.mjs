#!/usr/bin/env node
/**
 * Copy a selection of test cases into a new tab of the run spreadsheet, for a
 * manual pass.
 *
 *   pnpm run tcs:run-sheet -- --suites regression --name regression --dry-run
 *   pnpm run tcs:run-sheet -- --cases-file /tmp/pick.txt --name auction-signin
 *
 * A run tab is a snapshot, not a mirror: it is written once, pinned to a
 * commit, and never resynced. So a case that later changes, or is deprecated,
 * leaves the tab alone - the tab says what was tested, and the markdown under
 * git says what the case is now.
 *
 * Nothing reads a marked tab back into the store. A run's results live in the
 * sheet, and the Summary tab counts them with live formulas.
 *
 * Authentication is somebody else's job: this script wants an OAuth access
 * token in `GOOGLE_ACCESS_TOKEN`. In CI, `google-github-actions/auth` mints one
 * from the repository's own OIDC identity. Locally:
 *
 *   export GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token \
 *     --impersonate-service-account=<sa>@<project>.iam.gserviceaccount.com \
 *     --scopes=https://www.googleapis.com/auth/spreadsheets)
 *
 * There is no service-account key anywhere in either path, so there is nothing
 * to rotate and nothing to leak.
 *
 * Zero dependencies: Node built-ins only, matching the other scripts here.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  COLUMN_WIDTHS,
  COLUMNS,
  colLetter,
  DRAFT_BACKGROUND,
  FILTER_START,
  FONT,
  FONT_SIZE,
  JOURNEY_BACKGROUND,
  MARKING_START,
  quoteTab,
  RESULT_COLORS,
  RESULTS,
  SUMMARY_BANDS,
  SUMMARY_COLUMNS,
  SUMMARY_TAB,
  SURFACE_END,
  SURFACES,
} from "./lib/run-sheet-layout.mjs";
import {
  automatedGateOf,
  buildGrid,
  inReadingOrder,
  readCandidates,
  selectCases,
} from "./lib/select-cases.mjs";
import { prop, ROOT } from "./lib/suites.mjs";

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const red = (s) => c("31", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

const API = "https://sheets.googleapis.com/v4/spreadsheets";

function help() {
  console.log(`Usage: node scripts/openspec/run-sheet.mjs --name <run> [selection] [flags]

Selection - one of these, and the first two resolve to the third:

  --suites <list>     Cases whose **Suites** holds any of these (smoke, regression, …)
  --priority <list>   Cases at these priorities
  --level <list>      feature, domain, product, platform
  --scope <substr>    Only suites whose path contains this
  --cases <ids>       A comma-separated list of case ids
  --cases-file <path> The same list, one id per line (\`#\` comments allowed)

Flags:
  --name <run>        Run name; the tab becomes <id>-<slug of name>   (required)
  --selection <text>  What was asked for, recorded on the Summary row
  --include-draft     Also take \`draft\` cases (grey-banded in the tab)
  --include-automated Also take cases an automated test already covers
  --sha <sha>         Commit to record; defaults to the current HEAD
  --sheet <id>        Spreadsheet id; defaults to TCS_SHEET_ID
  --dry-run           Print what would be written and touch no network
  --help              Print this help and exit
`);
}

function parseArgs(argv) {
  const args = {
    name: null,
    selection: null,
    suites: null,
    priority: null,
    level: null,
    scope: null,
    cases: null,
    includeDraft: false,
    includeAutomated: false,
    sha: null,
    sheet: process.env.TCS_SHEET_ID ?? null,
    dryRun: false,
  };
  const takes = {
    "--name": "name",
    "--selection": "selection",
    "--suites": "suites",
    "--priority": "priority",
    "--level": "level",
    "--scope": "scope",
    "--sha": "sha",
    "--sheet": "sheet",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      help();
      process.exit(0);
    } else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--include-draft") args.includeDraft = true;
    else if (a === "--include-automated") args.includeAutomated = true;
    else if (a === "--cases") args.cases = (argv[++i] ?? "").split(",");
    else if (a === "--cases-file") args.cases = readIdFile(argv[++i]);
    else if (a in takes) args[takes[a]] = argv[++i] ?? null;
    else if (a.startsWith("--") && a.includes("=")) {
      const [flag, value] = [
        a.slice(0, a.indexOf("=")),
        a.slice(a.indexOf("=") + 1),
      ];
      if (flag === "--cases") args.cases = value.split(",");
      else if (flag === "--cases-file") args.cases = readIdFile(value);
      else if (flag in takes) args[takes[flag]] = value;
      else die(`unknown flag ${flag}`);
    } else die(`unknown argument ${a}`);
  }
  return args;
}

function readIdFile(path) {
  if (!path) die("--cases-file needs a path");
  return readFileSync(path, "utf8")
    .split("\n")
    .map((one) => one.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

function die(message, hint = null) {
  console.error(`\n${red("✗")} ${message}`);
  if (hint) console.error(`\n${dim(hint)}`);
  console.error("");
  process.exit(1);
}

function headSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown";
  }
}

/** `Auction & sign-in features` → `auction-sign-in-features`. */
function slug(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

// --- the Sheets API --------------------------------------------------------

async function call(token, path, { method = "GET", body = null } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (res.ok) return res.json();
  const text = await res.text();
  if (res.status === 401)
    die(
      "Google refused the access token (401).",
      "The token has expired, or it was minted without the spreadsheets scope.\n" +
        "Mint a fresh one:\n  export GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token \\\n" +
        "    --impersonate-service-account=<sa> \\\n" +
        "    --scopes=https://www.googleapis.com/auth/spreadsheets)",
    );
  if (res.status === 403)
    die(
      "Google refused the request (403).",
      "The identity behind the token is not an editor of this spreadsheet.\n" +
        "Open the sheet, Share, and add the service account's email as Editor.",
    );
  if (res.status === 404)
    die(
      "No such spreadsheet (404).",
      "Check TCS_SHEET_ID — it is the id in the sheet's URL, between /d/ and /edit.",
    );
  die(`Sheets API ${res.status}: ${text.slice(0, 400)}`);
}

const batchUpdate = (token, id, requests) =>
  call(token, `/${id}:batchUpdate`, { method: "POST", body: { requests } });

const values = (token, id, range) =>
  call(token, `/${id}/values/${encodeURIComponent(range)}`);

const putValues = (token, id, range, rows, raw = true) =>
  call(
    token,
    `/${id}/values/${encodeURIComponent(range)}?valueInputOption=${raw ? "RAW" : "USER_ENTERED"}`,
    { method: "PUT", body: { values: rows } },
  );

const appendValues = (token, id, range, rows) =>
  call(
    token,
    `/${id}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: { values: rows } },
  );

/**
 * The Summary tab, with its header.
 *
 * The header is checked rather than written once at creation. A Summary tab
 * created before this ran, or one whose first row somebody cleared, used to
 * take appended rows under nothing: the counts were right and unreadable, and
 * `Run ID` came back as a number in column A with no name on it.
 */
async function ensureSummary(token, id, sheets) {
  const found = sheets.find((s) => s.properties.title === SUMMARY_TAB);
  const sheetId = found
    ? found.properties.sheetId
    : (
        await batchUpdate(token, id, [
          { addSheet: { properties: { title: SUMMARY_TAB, index: 0 } } },
        ])
      ).replies[0].addSheet.properties.sheetId;

  const head = await values(token, id, `${quoteTab(SUMMARY_TAB)}!A1:A1`);
  if ((head.values?.[0]?.[0] ?? "") !== SUMMARY_COLUMNS[0]) {
    if (found)
      await batchUpdate(token, id, [
        {
          insertDimension: {
            range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
          },
        },
      ]);
    await putValues(token, id, `${quoteTab(SUMMARY_TAB)}!A1`, [
      SUMMARY_COLUMNS,
    ]);
  }

  const rate = SUMMARY_COLUMNS.indexOf("Pass rate");
  await batchUpdate(token, id, [
    {
      repeatCell: {
        range: { sheetId },
        cell: {
          userEnteredFormat: {
            textFormat: { fontFamily: FONT, fontSize: FONT_SIZE },
          },
        },
        fields: "userEnteredFormat.textFormat(fontFamily,fontSize)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: { userEnteredFormat: { textFormat: { bold: true } } },
        fields: "userEnteredFormat.textFormat.bold",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: rate },
        cell: {
          userEnteredFormat: {
            numberFormat: { type: "PERCENT", pattern: "0.0%" },
          },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
        fields: "gridProperties.frozenRowCount",
      },
    },
  ]);
  return sheetId;
}

/** The next run id: one past the highest the Summary tab already records. */
async function nextRunId(token, id) {
  const read = await values(token, id, `${quoteTab(SUMMARY_TAB)}!A2:A`);
  const ids = (read.values ?? [])
    .map((row) => Number(row[0]))
    .filter((n) => Number.isFinite(n));
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

/** Runs of contiguous rows sharing a key, as `[start, end)` 0-based indices. */
function runsOf(items, keyOf) {
  const out = [];
  let start = 0;
  for (let i = 1; i <= items.length; i += 1) {
    if (i === items.length || keyOf(items[i]) !== keyOf(items[start])) {
      out.push({ key: keyOf(items[start]), start, end: i });
      start = i;
    }
  }
  return out;
}

/** Everything that dresses a freshly written tab: the frozen identity columns,
 *  the font, the widths, the dropdowns and their colours, the journey banners,
 *  the draft bands, the grouping, the filter view, and the two locks. */
function dressing(sheetId, lines) {
  const height = lines.length + 1;
  const table = {
    sheetId,
    startRowIndex: 0,
    endRowIndex: height,
    startColumnIndex: 0,
    endColumnIndex: COLUMNS.length,
  };
  const surfaces = {
    sheetId,
    startRowIndex: 1,
    endRowIndex: height,
    startColumnIndex: MARKING_START,
    endColumnIndex: SURFACE_END,
  };

  const requests = [
    {
      repeatCell: {
        range: { sheetId },
        cell: {
          userEnteredFormat: {
            textFormat: { fontFamily: FONT, fontSize: FONT_SIZE },
          },
        },
        fields: "userEnteredFormat.textFormat(fontFamily,fontSize)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: height },
        cell: {
          userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "TOP" },
        },
        fields: "userEnteredFormat(wrapStrategy,verticalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true },
            backgroundColor: { red: 0.2, green: 0.25, blue: 0.3 },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields:
          "userEnteredFormat(textFormat,backgroundColor,verticalAlignment,wrapStrategy)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 } },
          },
        },
        fields: "userEnteredFormat.textFormat.foregroundColor",
      },
    },
    // Two frozen columns, so the case a tester is marking stays named however
    // far right they have scrolled.
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: { frozenRowCount: 1, frozenColumnCount: 2 },
        },
        fields: "gridProperties(frozenRowCount,frozenColumnCount)",
      },
    },
    // Centred, so a column of one-word results reads as a column.
    {
      repeatCell: {
        range: surfaces,
        cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
        fields: "userEnteredFormat.horizontalAlignment",
      },
    },
  ];

  for (const [i, name] of COLUMNS.entries()) {
    const width = COLUMN_WIDTHS[name];
    if (!width) continue;
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: "COLUMNS",
          startIndex: i,
          endIndex: i + 1,
        },
        properties: { pixelSize: width },
        fields: "pixelSize",
      },
    });
  }

  // A colour per result, as a rule rather than a fill: the writer puts `to_do`
  // in every cell, and the band has to follow what the tester types over it.
  for (const [value, background] of Object.entries(RESULT_COLORS)) {
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [surfaces],
          booleanRule: {
            condition: {
              type: "TEXT_EQ",
              values: [{ userEnteredValue: value }],
            },
            format: { backgroundColor: background },
          },
        },
        index: 0,
      },
    });
  }

  // The dropdown goes on the case rows only. A journey banner has nothing to
  // mark, and a dropdown arrow on it would invite somebody to try.
  for (const run of runsOf(lines, (line) => line.kind)) {
    if (run.key !== "case") continue;
    requests.push({
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: run.start + 1,
          endRowIndex: run.end + 1,
          startColumnIndex: MARKING_START,
          endColumnIndex: SURFACE_END,
        },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: RESULTS.map((v) => ({ userEnteredValue: v })),
          },
          showCustomUi: true,
          strict: true,
        },
      },
    });
  }

  // A draft case, banded amber. Contiguous runs only, so a tab of drafts costs
  // one request rather than one per row.
  for (const run of runsOf(lines, (line) =>
    line.kind === "case" && prop(line.one.tc, "Status") === "draft"
      ? "draft"
      : "",
  )) {
    if (run.key !== "draft") continue;
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: run.start + 1,
          endRowIndex: run.end + 1,
          startColumnIndex: 0,
          endColumnIndex: COLUMNS.length,
        },
        cell: { userEnteredFormat: { backgroundColor: DRAFT_BACKGROUND } },
        fields: "userEnteredFormat.backgroundColor",
      },
    });
  }

  // Each journey banner, and a collapsible group over the cases beneath it.
  // `OVERFLOW_CELL` lets the title run across the empty cells to its right
  // rather than wrapping inside a 240-pixel `Case ID` column; merging it would
  // read the same and refuse to sort inside a filter view.
  for (const [i, line] of lines.entries()) {
    if (line.kind !== "journey") continue;
    const row = i + 1;
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: row,
          endRowIndex: row + 1,
          startColumnIndex: 0,
          endColumnIndex: COLUMNS.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: JOURNEY_BACKGROUND,
            textFormat: { bold: true },
            wrapStrategy: "OVERFLOW_CELL",
            verticalAlignment: "MIDDLE",
          },
        },
        fields:
          "userEnteredFormat(backgroundColor,textFormat,wrapStrategy,verticalAlignment)",
      },
    });
    let end = i + 1;
    while (end < lines.length && lines[end].kind === "case") end += 1;
    if (end > i + 1)
      requests.push({
        addDimensionGroup: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: row + 1,
            endIndex: end + 1,
          },
        },
      });
  }

  // A filter view, not the basic filter. Sorting a basic filter rewrites the
  // rows underneath it, which would lift every case out from under its journey
  // banner and leave the tab unreadable with no undo the next tester can see.
  // A filter view's sort is the view's alone.
  requests.push({
    addFilterView: { filter: { title: "Walk", range: table } },
  });

  // The case is a copy of the markdown, and the markdown is the source of
  // truth. Two ranges, because the marking band sits between them. Creating a
  // protection without an editor list leaves its creator - this token's
  // identity - as the only editor, so a tester is refused at the cell rather
  // than discovering later that their edit changed nothing.
  for (const [start, end, what] of [
    [0, MARKING_START, "The case as the markdown states it"],
    [FILTER_START, COLUMNS.length, "The case's classification"],
  ]) {
    requests.push({
      addProtectedRange: {
        protectedRange: {
          range: {
            sheetId,
            startRowIndex: 0,
            startColumnIndex: start,
            endColumnIndex: end,
          },
          description: `${what}. Change the case in openspec/, not here.`,
          warningOnly: false,
        },
      },
    });
  }

  return requests;
}

/**
 * A run's four Summary rows, one per surface.
 *
 * Counts are formulas, so a tester marking the tab moves them without a second
 * sync, and `IFERROR` says so plainly when somebody renames or deletes the tab
 * the row points at.
 *
 * `Cases` counts the surface's own column rather than `Case ID`, because a
 * journey banner has a `Case ID` cell and no result cell: counting the results
 * counts cases and skips the banners for free.
 *
 * `Pass rate` divides by the applicable cells - everything but `n/a` - so a run
 * over cases automation has not reached is not reported as half failing.
 *
 * `Automated left out` repeats down the four rows like the provenance does:
 * it is the run's count, not a surface's.
 */
function summaryRows({
  runId,
  tab,
  date,
  name,
  selection,
  sha,
  drafts,
  automatedLeftOut,
}) {
  const t = quoteTab(tab);
  return SURFACES.map((surface, i) => {
    const col = colLetter(MARKING_START + i);
    const range = `${t}!${col}2:${col}`;
    const count = (what) =>
      `=IFERROR(COUNTIF(${range},"${what}"),"tab deleted")`;
    return [
      runId,
      tab,
      date,
      name,
      selection,
      sha,
      surface,
      `=IFERROR(COUNTA(${range}),"tab deleted")`,
      drafts,
      count("to_do"),
      count("pass"),
      count("fail"),
      count("blocked"),
      count("skipped"),
      count("n/a"),
      `=IFERROR(COUNTIF(${range},"pass")/(COUNTA(${range})-COUNTIF(${range},"n/a")),"")`,
      automatedLeftOut,
    ];
  });
}

/** `'Summary'!A6:P9` → the 0-based row the block starts at. */
function startRowOf(updatedRange) {
  const match = /![A-Z]+(\d+)/.exec(String(updatedRange ?? ""));
  return match ? Number(match[1]) - 1 : null;
}

/** A band over a run's four rows, alternating by run id, so the Summary reads
 *  as a list of runs rather than a wall of near-identical rows. */
function summaryBand(sheetId, startRow, rows, runId) {
  return {
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: startRow,
        endRowIndex: startRow + rows,
        startColumnIndex: 0,
        endColumnIndex: SUMMARY_COLUMNS.length,
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: SUMMARY_BANDS[runId % SUMMARY_BANDS.length],
        },
      },
      fields: "userEnteredFormat.backgroundColor",
    },
  };
}

// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
if (!args.name) {
  help();
  die("--name is required: it names the run and the tab.");
}
const hasFilter = Boolean(args.suites || args.priority || args.level);
if (!args.cases && !hasFilter)
  die(
    "no selection",
    "Give --cases or --cases-file with the exact ids, or a filter such as\n" +
      "--suites regression. --scope alone narrows the files read; it selects nothing.",
  );

const candidates = readCandidates(ROOT, args.scope);
const {
  picked: unordered,
  refused,
  missing,
} = selectCases(candidates, {
  ids: args.cases,
  suites: args.suites,
  priority: args.priority,
  level: args.level,
  includeDraft: args.includeDraft,
  includeAutomated: args.includeAutomated,
});
const picked = inReadingOrder(unordered);

if (missing.length > 0)
  die(
    missing.length === 1
      ? "1 case id names no case in the store"
      : `${missing.length} case ids name no case in the store`,
    missing.map((id) => `  ${id}`).join("\n") +
      "\n\nA run tab may only hold cases the store states. Fix the list, or widen --scope.",
  );

const drafts = picked.filter(
  (one) => prop(one.tc, "Status") === "draft",
).length;
// Left out by default, taken with the flag - said either way, and said as
// zero rather than left unsaid, so a run's own printout is what proves the
// gate ran (`shared-planning-agent-rounds-SC-61`). The count and the line are
// `automatedGateOf`'s, beside the gate whose refusals they read.
const { leftOut: automatedLeftOut, line: automatedLine } = automatedGateOf({
  picked,
  refused,
  includeAutomated: args.includeAutomated,
});

console.log(
  `${bold("Run sheet")}  ${dim(`${picked.length} case${picked.length === 1 ? "" : "s"}${drafts ? `, ${drafts} draft` : ""}`)}\n`,
);
console.log(dim(automatedLine));
if (picked.length === 0) {
  // Split by reason, so a selection refused for its status alone never hints
  // at the wrong flag: the two gates are read one at a time, and each names
  // its own way past it.
  const byStatus = refused.filter((one) => one.reason === "status").length;
  const parts = [];
  if (byStatus > 0) parts.push(`${byStatus} refused by the status gate`);
  if (automatedLeftOut > 0) parts.push(`${automatedLeftOut} already automated`);
  console.log(
    yellow("Nothing selected."),
    dim(
      `\n  ${candidates.length} cases read${args.scope ? ` under "${args.scope}"` : ""}` +
        (parts.length > 0 ? `; ${parts.join(", ")}.` : ".") +
        (byStatus > 0 && !args.includeDraft
          ? "\n  Most of the store is still `draft`; pass --include-draft to walk drafts."
          : "") +
        (automatedLeftOut > 0 && !args.includeAutomated
          ? "\n  Every match is already automated; pass --include-automated to walk them anyway."
          : ""),
    ),
  );
  process.exit(0);
}

const byFile = runsOf(picked, (one) => one.read.rel);
for (const run of byFile) {
  console.log(`  ${bold(run.key)}`);
  for (const one of picked.slice(run.start, run.end)) {
    const status = prop(one.tc, "Status");
    console.log(
      `    ${cyan(one.tc.id.padEnd(48))}${status === "draft" ? yellow("draft  ") : dim("actual ")}${one.tc.title}`,
    );
  }
}

const sha = args.sha ?? headSha();
const date = new Date().toISOString().slice(0, 10);
const { rows, lines } = buildGrid(picked);
const journeys = lines.filter((line) => line.kind === "journey").length;

if (args.dryRun) {
  console.log(
    `\n${green("✓")} dry run — nothing written.  ${dim(`${journeys} journey banner${journeys === 1 ? "" : "s"}, ${rows.length} rows, would record commit ${sha.slice(0, 12)}`)}`,
  );
  process.exit(0);
}

if (!args.sheet)
  die(
    "no spreadsheet id",
    "Set TCS_SHEET_ID, or pass --sheet <id>. It is the part of the sheet's URL between /d/ and /edit.",
  );
const token = process.env.GOOGLE_ACCESS_TOKEN;
if (!token)
  die(
    "no GOOGLE_ACCESS_TOKEN",
    "In CI, `google-github-actions/auth` sets it. Locally:\n" +
      "  export GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token \\\n" +
      "    --impersonate-service-account=<sa>@<project>.iam.gserviceaccount.com \\\n" +
      "    --scopes=https://www.googleapis.com/auth/spreadsheets)",
  );

const meta = await call(token, `/${args.sheet}?fields=sheets.properties`);
const sheets = meta.sheets ?? [];
const summarySheetId = await ensureSummary(token, args.sheet, sheets);
const runId = await nextRunId(token, args.sheet);
const taken = new Set(sheets.map((s) => s.properties.title));
let tab = `${runId}-${slug(args.name)}`;
for (let n = 2; taken.has(tab); n += 1)
  tab = `${runId}-${slug(args.name)}-${n}`;

const made = await batchUpdate(token, args.sheet, [
  {
    addSheet: {
      properties: {
        title: tab,
        gridProperties: {
          rowCount: rows.length + 1,
          columnCount: COLUMNS.length,
        },
      },
    },
  },
]);
const sheetId = made.replies[0].addSheet.properties.sheetId;

await putValues(token, args.sheet, `${quoteTab(tab)}!A1`, [COLUMNS, ...rows]);
await batchUpdate(token, args.sheet, dressing(sheetId, lines));

const appended = await appendValues(
  token,
  args.sheet,
  `${quoteTab(SUMMARY_TAB)}!A1`,
  summaryRows({
    runId,
    tab,
    date,
    name: args.name,
    selection: args.selection ?? "",
    sha,
    drafts,
    automatedLeftOut,
  }),
);
const blockStart = startRowOf(appended.updates?.updatedRange);
if (blockStart !== null)
  await batchUpdate(token, args.sheet, [
    summaryBand(summarySheetId, blockStart, SURFACES.length, runId),
  ]);

const cases = lines.filter((line) => line.kind === "case").length;
console.log(
  `\n${green("✓")} wrote ${bold(tab)}  ${dim(`${cases} cases under ${journeys} journey banner${journeys === 1 ? "" : "s"}, commit ${sha.slice(0, 12)}`)}`,
);
console.log(
  `  ${dim(`https://docs.google.com/spreadsheets/d/${args.sheet}/edit#gid=${sheetId}`)}`,
);
console.log(
  `\n${dim(`Mark ${SURFACES.join(", ")}, Notes and Tester. Every case starts at to_do; an automation column reading n/a is a case no automated test covers.`)}`,
);
console.log(
  `${dim("The case and its classification are locked. Sort inside the Walk filter view, not the sheet.")}`,
);
console.log(
  `${dim("Do not rename or delete the tab — the Summary rows point at it by name.")}\n`,
);
