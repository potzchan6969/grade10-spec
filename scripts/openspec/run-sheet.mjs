#!/usr/bin/env node
/**
 * Copy a selection of test cases into a new tab of the run spreadsheet, for a
 * manual pass.
 *
 *   pnpm run tcs:run-sheet -- --suites regression --name regression --dry-run
 *   pnpm run tcs:run-sheet -- --cases-file /tmp/pick.txt --name auction-signin
 *
 * Trial runs can be reprinted after confirmation. Finalized runs are pinned
 * snapshots; merged print commits permanently prohibit overwriting them.
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
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { cliArgs } from "./lib/args.mjs";
import {
  BODY_FOREGROUND,
  COLUMN_WIDTHS,
  COLUMNS,
  capabilityBackground,
  colLetter,
  DRAFT_BACKGROUND,
  envOf,
  FILTER_START,
  FONT,
  FONT_SIZE,
  HEADER_BACKGROUND,
  HEADER_FOREGROUND,
  journeyBackground,
  locateRun,
  MARKING_START,
  quoteTab,
  RESULT_COLORS,
  RESULTS,
  SUMMARY_BANDS,
  SUMMARY_COLUMNS,
  SUMMARY_LEAD_COLUMNS,
  SUMMARY_SHA_COL,
  SUMMARY_TAB,
  SURFACE_END,
  SURFACES,
  summaryRows,
  tabOrderRequests,
  tabTitle,
} from "./lib/run-sheet-layout.mjs";
import {
  assertRunTab,
  candidatesAt,
  cellRows,
  invalidatePublishedRun,
  mergedRecord,
  parseRecordRows,
  RECORD_HEADERS,
  RECORD_TAB,
  recordCells,
  refreshMain,
  selectionSnapshot,
  transition,
  validateRecord,
} from "./lib/run-sheet-records.mjs";
import {
  automatedGateOf,
  buildGrid,
  displayCaseId,
  inReadingOrder,
  selectCases,
} from "./lib/select-cases.mjs";
import { prop, ROOT } from "./lib/suites.mjs";

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const dim = (s) => c("2", s);
const red = (s) => c("31", s);

const API = "https://sheets.googleapis.com/v4/spreadsheets";

function help() {
  console.log(`Usage: node scripts/openspec/run-sheet.mjs --name <run> [selection] [flags]

Selection - one of these, and the first two resolve to the third:

  --suites <list>     Cases whose **Suites** holds any of these (smoke, regression, …)
  --priority <list>   Cases at these priorities
  --level <list>      feature, domain, product, platform
  --scope <substr>    Only suites whose path contains this
  --changed-since <sha>  Cases owned by suites affected since this commit
  --cases <ids>       A comma-separated list of case ids
  --cases-file <path> The same list, one id per line (\`#\` comments allowed)

Flags:
  --name <run>        Run name; the tab becomes <id>-<slug of name>   (required)
  --selection <text>  What was asked for, recorded on the Summary row
  --env <name>        Tester target: staging-1, staging-2, uat, preview or prod
  --include-draft     Also take \`draft\` cases (stone-grey in the tab)
  --exclude-automated Leave out cases an automated test already covers
  --sandbox           Print target: Sandbox Sheet; default is PROD Sheet
  --overwrite <id>    Rewrite that run's tab and its Summary block (same id)
  --finalize <id>     Confirm latest TCs and export a finalized production record
  --reopen <id>       Explicitly cancel finalization before reprinting
  --copy-run <id>     Use a merged run's ids for a new run against latest TCs
  --confirmed <hash>  Fingerprint a human confirmed (required to print/finalize)
  --exclusions-file <path> JSON array of {id, reason} for intentional exclusions
  --record-output <path> Write the temporary run receipt here (CI uploads an artifact)
  --sha <sha>         Source revision for dry-run; production writes use latest main
  --source-ref <ref>  Sandbox-only source revision for preview and printing
  --sheet <id>        Spreadsheet id; defaults to TCS_SHEET_ID (or sandbox)
  --dry-run           Print what would be written and touch no network
  --help              Print this help and exit
`);
}

function parseArgs(argv) {
  const args = {
    name: null,
    selection: null,
    env: null,
    suites: null,
    priority: null,
    level: null,
    scope: null,
    changedSince: null,
    cases: null,
    includeDraft: false,
    includeAutomated: true,
    sandbox: false,
    overwrite: null,
    sha: null,
    sourceRef: null,
    sheet: null,
    dryRun: false,
    finalize: null,
    reopen: null,
    copyRun: null,
    confirmed: null,
    exclusionsFile: null,
    recordOutput: null,
  };
  const takes = {
    "--name": "name",
    "--selection": "selection",
    "--env": "env",
    "--suites": "suites",
    "--priority": "priority",
    "--level": "level",
    "--scope": "scope",
    "--changed-since": "changedSince",
    "--sha": "sha",
    "--source-ref": "sourceRef",
    "--sheet": "sheet",
    "--overwrite": "overwrite",
    "--finalize": "finalize",
    "--reopen": "reopen",
    "--copy-run": "copyRun",
    "--confirmed": "confirmed",
    "--exclusions-file": "exclusionsFile",
    "--record-output": "recordOutput",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      help();
      process.exit(0);
    } else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--include-draft") args.includeDraft = true;
    else if (a === "--include-automated") args.includeAutomated = true;
    else if (a === "--exclude-automated") args.includeAutomated = false;
    else if (a === "--sandbox") args.sandbox = true;
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

function resolveSpreadsheet(args) {
  if (args.sheet) return args.sheet;
  if (args.sandbox) {
    const id = process.env.TCS_SHEET_SANDBOX_ID ?? null;
    if (!id)
      die(
        "no TCS_SHEET_SANDBOX_ID",
        "Set the repository variable, or pass --sheet <id>. It is the part of the sheet's URL between /d/ and /edit.",
      );
    return id;
  }
  const id = process.env.TCS_SHEET_ID ?? null;
  if (!id)
    die(
      "no spreadsheet id",
      "Set TCS_SHEET_ID, or pass --sheet <id>. It is the part of the sheet's URL between /d/ and /edit.",
    );
  return id;
}

function printRegister(titles, summaryValues) {
  const tabs = titles.length
    ? titles.map((t) => `  ${t}`).join("\n")
    : "  (none)";
  const ids = (summaryValues ?? [])
    .slice(1)
    .map((row) => row?.[0])
    .filter(
      (one) => String(one ?? "").trim() !== "" && Number.isFinite(Number(one)),
    );
  const runs = ids.length ? ids.map((id) => `  ${id}`).join("\n") : "  (none)";
  return `Tabs:\n${tabs}\nSummary Run IDs:\n${runs}`;
}

function headSha(ref = "HEAD") {
  try {
    return execFileSync(
      "git",
      ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`],
      {
        cwd: ROOT,
        encoding: "utf8",
      },
    ).trim();
  } catch {
    return "unknown";
  }
}

function changedPathsSince(sha, target = "HEAD") {
  try {
    return execFileSync("git", ["diff", "--name-only", sha, target], {
      cwd: ROOT,
      encoding: "utf8",
    })
      .split("\n")
      .map((one) => one.trim())
      .filter(Boolean);
  } catch {
    die(
      `cannot compare changes since \`${sha}\``,
      "Use a commit that exists in this checkout, or pass --cases-file with explicit ids.",
    );
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
      "Check TCS_SHEET_ID or TCS_SHEET_SANDBOX_ID — it is the id in the sheet's URL, between /d/ and /edit.",
    );
  die(`Sheets API ${res.status}: ${text.slice(0, 400)}`);
}

const batchUpdate = (token, id, requests) =>
  call(token, `/${id}:batchUpdate`, { method: "POST", body: { requests } });

const values = (token, id, range) =>
  call(
    token,
    `/${id}/values/${encodeURIComponent(range)}?valueRenderOption=UNFORMATTED_VALUE`,
  );

const putValues = (token, id, range, rows, raw = true) =>
  call(
    token,
    `/${id}/values/${encodeURIComponent(range)}?valueInputOption=${raw ? "RAW" : "USER_ENTERED"}`,
    { method: "PUT", body: { values: rows } },
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

  const head = await values(
    token,
    id,
    `${quoteTab(SUMMARY_TAB)}!A1:${colLetter(SUMMARY_COLUMNS.length - 1)}1`,
  );
  const current = head.values?.[0] ?? [];
  if (current.join("\t") !== SUMMARY_COLUMNS.join("\t")) {
    if (found && (current[0] ?? "") !== SUMMARY_COLUMNS[0])
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

  await batchUpdate(token, id, [
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: HEADER_BACKGROUND,
            textFormat: {
              fontFamily: FONT,
              fontSize: FONT_SIZE,
              bold: true,
              foregroundColor: HEADER_FOREGROUND,
            },
          },
        },
        fields:
          "userEnteredFormat(backgroundColor,textFormat(fontFamily,fontSize,bold,foregroundColor))",
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

async function writeRunTab(token, spreadsheetId, tab, rows, lines) {
  const made = await batchUpdate(token, spreadsheetId, [
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
  await putValues(token, spreadsheetId, `${quoteTab(tab)}!A1`, [
    COLUMNS,
    ...rows,
  ]);
  await batchUpdate(token, spreadsheetId, dressing(sheetId, lines));
  return sheetId;
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
            textFormat: { bold: true, foregroundColor: HEADER_FOREGROUND },
            backgroundColor: HEADER_BACKGROUND,
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields:
          "userEnteredFormat(textFormat,backgroundColor,verticalAlignment,wrapStrategy)",
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

  // A draft case, banded stone grey. Contiguous runs only, so a tab of drafts
  // costs one request rather than one per row.
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
            backgroundColor: journeyBackground(line.capabilityId),
            textFormat: { bold: true, foregroundColor: BODY_FOREGROUND },
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

  // Outer fold: every journey and case under the capability file they came
  // from. Inner groups have to exist first or Sheets refuses the nest.
  for (const [i, line] of lines.entries()) {
    if (line.kind !== "capability") continue;
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
            backgroundColor: capabilityBackground(line.capabilityId),
            textFormat: { bold: true, foregroundColor: HEADER_FOREGROUND },
            wrapStrategy: "OVERFLOW_CELL",
            verticalAlignment: "MIDDLE",
          },
        },
        fields:
          "userEnteredFormat(backgroundColor,textFormat,wrapStrategy,verticalAlignment)",
      },
    });
    let end = i + 1;
    while (end < lines.length && lines[end].kind !== "capability") end += 1;
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

/** `'Summary'!A6:P9` → the 0-based row the block starts at. */

/**
 * A run's four Summary rows as one block: one band, identity merged down the
 * first five columns and SHA down the last, and the three surfaces grouped
 * under the first row. Collapsed they still name the run; expanded they show
 * each surface's counts. There is no filter view - this tab is a register.
 */
function summaryDressing(sheetId, startRow, rows, runId) {
  const end = startRow + rows;
  const block = {
    sheetId,
    startRowIndex: startRow,
    endRowIndex: end,
    startColumnIndex: 0,
    endColumnIndex: SUMMARY_COLUMNS.length,
  };
  const rate = SUMMARY_COLUMNS.indexOf("Pass rate");
  return [
    {
      repeatCell: {
        range: block,
        cell: {
          userEnteredFormat: {
            backgroundColor: SUMMARY_BANDS[runId % SUMMARY_BANDS.length],
            textFormat: { bold: false, fontFamily: FONT, fontSize: FONT_SIZE },
            verticalAlignment: "MIDDLE",
          },
        },
        fields:
          "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)",
      },
    },
    ...[
      [0, 1],
      [SUMMARY_COLUMNS.indexOf("Total"), SUMMARY_COLUMNS.indexOf("Total") + 1],
      [SUMMARY_COLUMNS.indexOf("To do"), SUMMARY_COLUMNS.indexOf("N/A") + 1],
    ].map(([startColumnIndex, endColumnIndex]) => ({
      repeatCell: {
        range: { ...block, startColumnIndex, endColumnIndex },
        cell: {
          userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "0" } },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    })),
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: startRow,
          endRowIndex: end,
          startColumnIndex: rate,
          endColumnIndex: rate + 1,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: { type: "PERCENT", pattern: "0.0%" },
          },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    {
      mergeCells: {
        range: {
          sheetId,
          startRowIndex: startRow,
          endRowIndex: end,
          startColumnIndex: 0,
          endColumnIndex: SUMMARY_LEAD_COLUMNS.length,
        },
        mergeType: "MERGE_COLUMNS",
      },
    },
    {
      mergeCells: {
        range: {
          sheetId,
          startRowIndex: startRow,
          endRowIndex: end,
          startColumnIndex: SUMMARY_SHA_COL,
          endColumnIndex: SUMMARY_SHA_COL + 1,
        },
        mergeType: "MERGE_COLUMNS",
      },
    },
    {
      addDimensionGroup: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex: startRow + 1,
          endIndex: end,
        },
      },
    },
  ];
}

// ---------------------------------------------------------------------------

const args = parseArgs(cliArgs());
args.env = envOf(args.env);
if (!args.env) die("--env is staging-1, staging-2, uat, preview or prod");
const actionCount = [
  args.overwrite,
  args.finalize,
  args.reopen,
  args.copyRun,
].filter(Boolean).length;
if (actionCount > 1)
  die("Use one of --overwrite, --finalize, --reopen or --copy-run");
if (args.dryRun && (args.finalize || args.reopen))
  die(
    "--finalize and --reopen need the live run registry; use --dry-run for selections",
  );
if (args.sandbox && (args.finalize || args.reopen || args.copyRun))
  die("Run finalization and copy receipts are production-sheet operations");
if (!args.name && !args.finalize && !args.reopen) die("--name is required");
if (args.sourceRef && !args.sandbox)
  die("--source-ref is only for sandbox runs");
if (args.sourceRef && args.sha) die("Use --source-ref or --sha, not both");
if (args.sha && !args.dryRun)
  die("--sha is only for dry-run; real runs use latest main");
if (args.cases && args.changedSince)
  die("--changed-since cannot be combined with explicit cases");
if (
  args.copyRun &&
  (args.cases ||
    args.changedSince ||
    args.suites ||
    args.priority ||
    args.level ||
    args.scope)
)
  die(
    "--copy-run supplies the selection; do not combine it with selection filters",
  );

let sha = headSha(args.sourceRef ?? args.sha ?? "HEAD");
let candidates;
let token;
let sheets = [];
let titles = [];
let summaryValues = [];
let summarySheetId;
let registry = new Map();
let current = null;
let currentRow = null;
let copiedFrom = null;

async function readRegistry() {
  if (!sheets.some((one) => one.properties.title === RECORD_TAB))
    return new Map();
  const read = await values(token, args.sheet, quoteTab(RECORD_TAB));
  return parseRecordRows(read.values ?? []);
}

async function ensureRecordSheet(columns = 26) {
  const found = sheets.find((one) => one.properties.title === RECORD_TAB);
  if (!found) {
    const made = await batchUpdate(token, args.sheet, [
      {
        addSheet: {
          properties: {
            title: RECORD_TAB,
            hidden: true,
            gridProperties: { columnCount: columns },
          },
        },
      },
    ]);
    sheets.push({ properties: made.replies[0].addSheet.properties });
    await putValues(token, args.sheet, `${quoteTab(RECORD_TAB)}!A1`, [
      RECORD_HEADERS,
    ]);
    await batchUpdate(token, args.sheet, [
      {
        addProtectedRange: {
          protectedRange: {
            range: { sheetId: made.replies[0].addSheet.properties.sheetId },
            description: "Run provenance: edited by the writer",
            warningOnly: false,
          },
        },
      },
    ]);
  }
  if (found && (found.properties.gridProperties?.columnCount ?? 26) < columns) {
    await batchUpdate(token, args.sheet, [
      {
        updateSheetProperties: {
          properties: {
            sheetId: found.properties.sheetId,
            gridProperties: { columnCount: columns },
          },
          fields: "gridProperties.columnCount",
        },
      },
    ]);
  }
  return sheets.find((one) => one.properties.title === RECORD_TAB).properties
    .sheetId;
}

async function recordRequest(record, row = null) {
  const columns =
    sheets.find((one) => one.properties.title === RECORD_TAB)?.properties
      .gridProperties?.columnCount ?? 26;
  const cells = recordCells(record, { columns });
  const sheetId = await ensureRecordSheet(cells.length);
  const rows = cellRows([cells]);
  return row
    ? {
        updateCells: {
          start: { sheetId, rowIndex: row - 1, columnIndex: 0 },
          rows,
          fields: "userEnteredValue",
        },
      }
    : { appendCells: { sheetId, rows, fields: "userEnteredValue" } };
}

async function saveRecord(record, row = null) {
  await batchUpdate(token, args.sheet, [await recordRequest(record, row)]);
}

function exportRecord(record) {
  if (args.recordOutput) {
    mkdirSync(dirname(args.recordOutput), { recursive: true });
    writeFileSync(args.recordOutput, `${JSON.stringify(record, null, 2)}\n`);
    console.log(`Record: ${args.recordOutput}`);
  }
  console.log(`Run ID: ${record.runId} · ${record.state} · ${record.tab}`);
  console.log(`Fingerprint: ${record.snapshot.fingerprint}`);
  console.log(
    `https://docs.google.com/spreadsheets/d/${record.spreadsheetId}/edit#gid=${record.sheetId}`,
  );
}

try {
  if (!args.dryRun) {
    args.sheet = resolveSpreadsheet(args);
    if (
      args.sourceRef &&
      (!process.env.TCS_SHEET_SANDBOX_ID ||
        args.sheet !== process.env.TCS_SHEET_SANDBOX_ID ||
        args.sheet === process.env.TCS_SHEET_ID)
    )
      die(
        "--source-ref must write to the configured sandbox sheet, never production",
      );
    token = process.env.GOOGLE_ACCESS_TOKEN;
    if (!token)
      die(
        "no GOOGLE_ACCESS_TOKEN",
        "Dispatch run-sheet.yml; CI holds the credentials.",
      );
    sha = args.sourceRef ? headSha(args.sourceRef) : refreshMain(ROOT);
    candidates = candidatesAt(ROOT, sha);
    const meta = await call(token, `/${args.sheet}?fields=sheets.properties`);
    sheets = meta.sheets ?? [];
    titles = sheets.map((one) => one.properties.title);
    if (sheets.some((one) => one.properties.title === SUMMARY_TAB)) {
      const read = await values(
        token,
        args.sheet,
        `${quoteTab(SUMMARY_TAB)}!A1:${colLetter(SUMMARY_COLUMNS.length - 1)}`,
      );
      summaryValues = read.values ?? [];
    }
    if (!args.sandbox) registry = await readRegistry();
    const target = args.overwrite ?? args.finalize ?? args.reopen;
    if (target) {
      if (!args.sandbox && mergedRecord(ROOT, args.sheet, target))
        die(`Run ${target} is merged; create a new run instead`);
      if (!args.sandbox) {
        const entry = registry.get(Number(target));
        if (!entry)
          die(
            `Run ${target} predates the run registry; it cannot be overwritten or finalized. Create a new run.`,
          );
        current = entry.record;
        currentRow = entry.row;
        if (current.spreadsheetId !== args.sheet)
          die("Registry spreadsheet identity mismatch");
        assertRunTab(current, sheets);
      }
      const found = locateRun(summaryValues, titles, target);
      if (!found.ok) die(found.why, printRegister(titles, summaryValues));
      if (current && found.tab !== current.tab)
        die(
          "Summary and run registry disagree",
          printRegister(titles, summaryValues),
        );
    }
    if (args.finalize && current.state === "finalized") {
      exportRecord(current);
      console.log("Already finalized; no Sheet write and no new record.");
      process.exit(0);
    }
    if (args.reopen) {
      const next = transition(current, "reopen");
      invalidatePublishedRun(ROOT, current);
      refreshMain(ROOT);
      if (mergedRecord(ROOT, args.sheet, current.runId))
        die(
          `Run ${current.runId} merged during reopening; no Sheet changes made`,
        );
      await saveRecord(next, currentRow);
      exportRecord(next);
      console.log(
        "Finalization cancelled. Remove the old unmerged print commit before publishing a replacement.",
      );
      process.exit(0);
    }
  } else {
    candidates = candidatesAt(ROOT, sha);
  }
  if (args.copyRun) {
    args.sheet = resolveSpreadsheet(args);
    const source = mergedRecord(ROOT, args.sheet, args.copyRun);
    if (!source) die(`No merged print commit for run ${args.copyRun}`);
    args.cases = source.cases.map((one) => one.id);
    args.includeDraft = true;
    args.includeAutomated = true;
    copiedFrom = {
      spreadsheetId: source.spreadsheetId,
      runId: Number(args.copyRun),
    };
  }
  if (args.finalize) {
    Object.assign(args, {
      name: current.snapshot.name,
      env: current.snapshot.env,
      selection: current.snapshot.selection,
      ...current.snapshot.options,
      cases: current.snapshot.selected.map((one) => one.id),
    });
  }
  if (
    !args.cases &&
    !(
      args.suites ||
      args.priority ||
      args.level ||
      args.scope ||
      args.changedSince
    )
  )
    die(
      "No selection. Use explicit cases, property filters or --changed-since.",
    );
  const changedPaths =
    args.changedSince && !args.finalize
      ? changedPathsSince(args.changedSince, sha)
      : null;
  if (changedPaths?.length === 0)
    die(`No files changed since ${args.changedSince}`);
  const scoped = args.scope
    ? candidates.filter((one) => one.read.rel.includes(args.scope))
    : candidates;
  const {
    picked: unordered,
    refused,
    missing,
  } = selectCases(scoped, {
    ids: args.cases,
    suites: args.suites,
    priority: args.priority,
    level: args.level,
    includeDraft: args.includeDraft,
    includeAutomated: args.includeAutomated,
    changedPaths,
  });
  if (missing.length)
    die("Case ids missing from latest accepted suites", missing.join("\n"));
  if (args.cases && refused.length)
    die(
      "Explicit cases refused; revise and confirm the selection",
      refused.map((one) => `${one.id}: ${one.why}`).join("\n"),
    );
  const excluded = args.finalize
    ? current.snapshot.excluded
    : args.exclusionsFile
      ? JSON.parse(readFileSync(args.exclusionsFile, "utf8"))
      : (current?.snapshot.excluded ?? []);
  if (!Array.isArray(excluded))
    die("Exclusions must be an array of {id, reason}");
  const excludedIds = new Set(excluded.map((one) => one.id));
  const picked = inReadingOrder(
    args.cases
      ? unordered
      : unordered.filter((one) => !excludedIds.has(one.tc.id)),
  );
  if (!picked.length)
    die(
      "Nothing selected",
      "Drafts require --include-draft; deprecated cases cannot be printed.",
    );
  const candidateIds = new Set(candidates.map((one) => one.tc.id));
  const priorIds = new Set(
    current?.snapshot.selected.map((one) => one.id) ?? [],
  );
  for (const one of excluded)
    if (!args.finalize && !candidateIds.has(one.id) && !priorIds.has(one.id))
      die(`Excluded id names no case: ${one.id}`);
  if (current && !args.finalize && args.cases) {
    const kept = new Set(picked.map((one) => one.tc.id));
    const explained = new Set(excluded.map((one) => one.id));
    const eligible = new Set(
      selectCases(scoped, {
        ids: [...priorIds],
        includeDraft: args.includeDraft,
        includeAutomated: args.includeAutomated,
      }).picked.map((one) => one.tc.id),
    );
    for (const id of priorIds)
      if (!kept.has(id) && !explained.has(id) && eligible.has(id))
        die(`Intentional exclusion ${id} needs a reason in --exclusions-file`);
  }
  const snapshot = selectionSnapshot(picked, {
    ...args,
    selection:
      args.selection ??
      current?.snapshot.selection ??
      (args.changedSince ? `changed since ${args.changedSince}` : ""),
    excluded,
  });
  const { rows, lines } = buildGrid(picked);
  const automated = automatedGateOf({
    picked,
    refused,
    includeAutomated: args.includeAutomated,
  });
  console.log(
    `Run sheet: ${picked.length} selected cases, ${picked.filter((one) => prop(one.tc, "Status") === "draft").length} draft`,
  );
  console.log(automated.line);
  for (const line of automated.leftOutLines) console.log(line);
  for (const run of runsOf(picked, (one) => one.read.rel)) {
    console.log(run.key);
    for (const one of picked.slice(run.start, run.end))
      console.log(`  ${displayCaseId(one.tc)}: ${one.tc.title}`);
  }
  for (const one of snapshot.excluded)
    console.log(`Excluded: ${one.id} — ${one.reason}`);
  console.log(`Fingerprint: ${snapshot.fingerprint}`);
  console.log(`Source commit: ${sha}`);
  if (args.dryRun) {
    console.log(`Dry run: ${rows.length} rows; nothing written.`);
    process.exit(0);
  }
  if (args.finalize) {
    const finalized = transition(current, "finalize", {
      snapshot,
      confirmed: args.confirmed,
    });
    const next = { ...finalized, sourceCommit: sha };
    const located = locateRun(summaryValues, titles, args.finalize);
    const summaryId = sheets.find((one) => one.properties.title === SUMMARY_TAB)
      .properties.sheetId;
    await batchUpdate(token, args.sheet, [
      await recordRequest(next, currentRow),
      {
        updateCells: {
          start: {
            sheetId: summaryId,
            rowIndex: located.startRow,
            columnIndex: SUMMARY_SHA_COL,
          },
          rows: cellRows([[sha]]),
          fields: "userEnteredValue",
        },
      },
    ]);
    exportRecord(next);
    console.log(
      "Finalized. Download the artifact and run tcs:run-record to create its single commit.",
    );
    process.exit(0);
  }
  if (args.confirmed !== snapshot.fingerprint)
    die(
      "Selection fingerprint is not confirmed",
      "Dry-run latest main, show the list, then pass --confirmed <fingerprint> after the person's yes.",
    );
  const found = args.overwrite
    ? locateRun(summaryValues, titles, args.overwrite)
    : null;
  if (current) {
    const result = transition(current, "print", { snapshot });
    if (result === "unchanged") {
      console.log("Unchanged: no Sheet write and no commit.");
      exportRecord(current);
      process.exit(0);
    }
  }
  const runId = args.overwrite
    ? Number(args.overwrite)
    : Math.max(
        0,
        ...summaryValues
          .slice(1)
          .map((row) => Number(row[0]))
          .filter(Number.isFinite),
      ) + 1;
  if (!args.sandbox && mergedRecord(ROOT, args.sheet, runId))
    die(`Run ${runId} is already merged`);
  if (!args.sandbox && !args.overwrite && registry.has(runId))
    die(
      `Summary and run registry disagree: run ${runId} is already registered`,
      "Restore the Summary rows before printing; no run has been replaced.",
    );
  const tab = tabTitle(runId, slug(args.name));
  if (titles.includes(tab) && tab !== found?.tab)
    die(`Tab '${tab}' is occupied`, printRegister(titles, summaryValues));
  summarySheetId = await ensureSummary(token, args.sheet, sheets);
  const temporaryTab = found
    ? `_trial-${runId}-${snapshot.fingerprint.slice(0, 12)}`
    : tab;
  if (titles.includes(temporaryTab))
    die(
      `Temporary tab '${temporaryTab}' already exists`,
      printRegister(titles, summaryValues),
    );
  const sheetId = await writeRunTab(
    token,
    args.sheet,
    temporaryTab,
    rows,
    lines,
  );
  const payload = summaryRows({
    runId,
    tab,
    date: new Date().toISOString().slice(0, 10),
    name: args.name,
    selection: snapshot.selection,
    env: args.env,
    sha,
  });
  const record = args.sandbox
    ? null
    : validateRecord({
        version: 1,
        state: "trial",
        spreadsheetId: args.sheet,
        runId,
        sheetId,
        tab,
        sourceCommit: sha,
        snapshot,
        copiedFrom: copiedFrom ?? current?.copiedFrom ?? null,
      });
  const requests = [];
  if (found) {
    const old = sheets.find((one) => one.properties.title === found.tab);
    requests.push(
      { deleteSheet: { sheetId: old.properties.sheetId } },
      {
        updateSheetProperties: {
          properties: { sheetId, title: tab },
          fields: "title",
        },
      },
      {
        updateCells: {
          start: {
            sheetId: summarySheetId,
            rowIndex: found.startRow,
            columnIndex: 0,
          },
          rows: cellRows(payload, {
            formulaColumns: SUMMARY_COLUMNS.map((_, index) => index).slice(
              SUMMARY_COLUMNS.indexOf("Total"),
              SUMMARY_SHA_COL,
            ),
          }),
          fields: "userEnteredValue",
        },
      },
    );
  } else {
    const blockStart = Math.max(summaryValues.length, 1);
    requests.push(
      {
        appendCells: {
          sheetId: summarySheetId,
          rows: cellRows(payload, {
            formulaColumns: SUMMARY_COLUMNS.map((_, index) => index).slice(
              SUMMARY_COLUMNS.indexOf("Total"),
              SUMMARY_SHA_COL,
            ),
          }),
          fields: "userEnteredValue",
        },
      },
      ...summaryDressing(summarySheetId, blockStart, SURFACES.length, runId),
    );
  }
  if (record) requests.push(await recordRequest(record, currentRow));
  requests.push(
    ...tabOrderRequests(
      [
        ...sheets.filter((one) => one.properties.title !== found?.tab),
        { properties: { sheetId, title: tab } },
      ],
      summarySheetId,
    ),
  );
  // All updates validate together. A failed request leaves the old run intact.
  // https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate
  await batchUpdate(token, args.sheet, requests);
  if (record) exportRecord(record);
  else
    console.log(
      `Sandbox: https://docs.google.com/spreadsheets/d/${args.sheet}/edit#gid=${sheetId}`,
    );
  console.log(
    `Printed ${lines.filter((line) => line.kind === "case").length} rows. Trial only; no commit created.`,
  );
} catch (error) {
  die(error.message);
}
