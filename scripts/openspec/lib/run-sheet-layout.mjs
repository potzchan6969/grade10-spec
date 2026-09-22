/**
 * The shape of a run tab and of the Summary tab, defined here rather than in a
 * `_template` tab inside the spreadsheet.
 *
 * A template tab is faster to copy and impossible to review: once somebody
 * edits it, every later run inherits the edit and nobody can see when it
 * happened. Building each tab from this file costs a few more API calls and
 * makes the layout a reviewed change like everything else.
 *
 * Three bands, ordered by how often a tester's eye lands on them. The case the
 * tester reads comes first, the cells they fill in come straight after it, and
 * the properties that exist only to be filtered on sit past both. A tester who
 * never scrolls right can still read a case and mark it.
 */

/** What the tester reads. Locked: a copy of the markdown. */
export const READING_COLUMNS = [
  "Case ID",
  "Title",
  "Pre-conditions",
  "Test data",
  "Steps",
  "Expected results",
];

/** What the tester fills in. Open. Four surfaces, because one case can pass in
 *  a browser and fail on a phone, and an automated run answers neither. */
export const MARKING_COLUMNS = [
  "Web",
  "Mobile",
  "Auto web",
  "Auto mobile",
  "Notes",
];

/** Filter axes. Locked, and out of the reading path: nobody reads these, they
 *  narrow a filter view by them. */
export const FILTER_COLUMNS = [
  "Product",
  "Domain",
  "Capability",
  "Level",
  "Layer",
  "Severity",
  "Priority",
];

export const COLUMNS = [
  ...READING_COLUMNS,
  ...MARKING_COLUMNS,
  ...FILTER_COLUMNS,
];

/** The four surfaces, in column order. */
export const SURFACES = ["Web", "Mobile", "Auto web", "Auto mobile"];

/**
 * What a result cell may say. The Summary counts these exact words.
 *
 * `n/a` and `skipped` are not the same answer and the Summary would lie if they
 * were: `skipped` is a case somebody chose not to walk this time, `n/a` is a
 * case this surface cannot answer at all - an automation column on a case no
 * automated test covers. A pass rate that counted `n/a` against itself would
 * fall every time QA wrote a case automation has not reached.
 */
export const RESULTS = ["to_do", "pass", "fail", "blocked", "skipped", "n/a"];

/** 0-based indices into `COLUMNS`. */
export const MARKING_START = READING_COLUMNS.length;
export const FILTER_START = MARKING_START + MARKING_COLUMNS.length;
export const SURFACE_END = MARKING_START + SURFACES.length;
export const NOTES_COL = SURFACE_END;

/** Pixels. Explicit, because `autoResizeDimensions` sizes a column to its
 *  longest cell, and a `Steps` cell is a paragraph: the tab came out wider than
 *  a screen with the result columns pushed off the edge of it. */
export const COLUMN_WIDTHS = {
  "Case ID": 240,
  Title: 300,
  "Pre-conditions": 230,
  "Test data": 190,
  Steps: 360,
  "Expected results": 320,
  Web: 90,
  Mobile: 90,
  "Auto web": 90,
  "Auto mobile": 100,
  Notes: 240,
  Product: 110,
  Domain: 110,
  Capability: 150,
  Level: 80,
  Layer: 80,
  Severity: 90,
  Priority: 80,
};

/** One font for the whole spreadsheet. */
export const FONT = "Calibri";
export const FONT_SIZE = 11;

/** A result's band. Read by the conditional formats, so the colour follows the
 *  value a tester types rather than the value the writer put there. */
export const RESULT_COLORS = {
  to_do: { red: 0.95, green: 0.95, blue: 0.95 },
  pass: { red: 0.85, green: 0.93, blue: 0.83 },
  fail: { red: 0.96, green: 0.8, blue: 0.79 },
  blocked: { red: 0.99, green: 0.9, blue: 0.79 },
  skipped: { red: 0.85, green: 0.89, blue: 0.96 },
  "n/a": { red: 0.99, green: 0.99, blue: 0.99 },
};

/** A journey's banner row, spanning the table above the cases that walk it. */
export const JOURNEY_BACKGROUND = { red: 0.85, green: 0.88, blue: 0.92 };

/** A light band on a draft case, so a tester can see they are walking a case no
 *  reviewer has approved. Static, not a rule: a run tab is a snapshot, and a
 *  row's status cannot change inside it. */
export const DRAFT_BACKGROUND = { red: 1, green: 0.96, blue: 0.87 };

export const SUMMARY_TAB = "Summary";

/**
 * Four rows per run, one per surface.
 *
 * One row per run would need `Pass` to mean something across four columns that
 * answer different questions, and the aggregate hides the case the run is
 * about: web green, mobile red reads as half a pass either way. The Summary is
 * a register, not a filterable table: the run's identity sits once on the
 * first row, the three surfaces below it are grouped under that row, and
 * `Commit SHA` lives at the far right of the same first row.
 */
export const SUMMARY_LEAD_COLUMNS = [
  "Run ID",
  "Tab",
  "Date created",
  "Run name",
  "Selection",
];

export const SUMMARY_COLUMNS = [
  ...SUMMARY_LEAD_COLUMNS,
  "Surface",
  "Cases",
  "Draft",
  "To do",
  "Pass",
  "Fail",
  "Blocked",
  "Skipped",
  "N/A",
  "Pass rate",
  "Automated left out",
  "Commit SHA",
];

export const SUMMARY_SHA_COL = SUMMARY_COLUMNS.indexOf("Commit SHA");

/** Alternating bands on the Summary, one per run rather than one per row, so a
 *  run's four surfaces read as one block. */
export const SUMMARY_BANDS = [
  { red: 1, green: 1, blue: 1 },
  { red: 0.95, green: 0.96, blue: 0.98 },
];

/** `test cases` needs quoting in A1 notation and `it's` needs its apostrophe
 *  doubled. Every range this script builds goes through here. */
export function quoteTab(tab) {
  return `'${String(tab).replace(/'/g, "''")}'`;
}

/** 0-based column index to an A1 letter: 0 → A, 26 → AA. */
export function colLetter(index) {
  let n = index;
  let out = "";
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}

export function tabTitle(runId, nameSlug) {
  return `${runId}-${nameSlug}`;
}

/**
 * Find run `runId` in the Summary grid (row 0 is the header) and check the
 * tab it names is among `titles`.
 *
 * Disagreement is returned, not repaired: a missing tab, a duplicate Run ID,
 * or an empty Tab cell means a human moved something, and guessing is how a
 * marked tab dies.
 */
export function locateRun(summaryValues, titles, runId) {
  const wanted = Number(runId);
  if (!Number.isFinite(wanted) || wanted < 1)
    return {
      ok: false,
      why: `Run ID must be a positive number, got \`${runId}\``,
      titles,
    };

  const hits = [];
  for (let i = 1; i < summaryValues.length; i += 1) {
    if (Number(summaryValues[i]?.[0]) === wanted) hits.push(i);
  }
  if (hits.length === 0)
    return { ok: false, why: `Summary has no run ${wanted}`, titles };
  if (hits.length > 1)
    return {
      ok: false,
      why: `Summary has ${hits.length} identity rows with Run ID ${wanted}`,
      titles,
    };

  const startRow = hits[0];
  const tab = String(summaryValues[startRow]?.[1] ?? "").trim();
  if (!tab)
    return {
      ok: false,
      why: `run ${wanted} has no Tab in Summary`,
      titles,
    };
  if (!titles.includes(tab))
    return {
      ok: false,
      why: `Summary names \`${tab}\` for run ${wanted}; no tab has that title`,
      tab,
      titles,
    };
  return { ok: true, startRow, tab };
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
 * Identity (`Run ID` through `Selection`) and `Commit SHA` sit on the first
 * row only. The three surfaces below it are empty in those columns so a merge
 * can span them, and so the register is read as runs rather than as a table
 * somebody would filter.
 */
export function summaryRows({
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
    const first = i === 0;
    return [
      first ? runId : "",
      first ? tab : "",
      first ? date : "",
      first ? name : "",
      first ? selection : "",
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
      first ? sha : "",
    ];
  });
}
