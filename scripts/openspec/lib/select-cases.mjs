/**
 * Turn a selection into the rows a run tab carries.
 *
 * Every path ends in an explicit list of case ids: a filter resolves to one,
 * and an agent reading specs and journeys resolves to one too. A run whose
 * contents cannot be restated is a run nobody can repeat, so the list - never
 * the reasoning that produced it - is what reaches the sheet.
 *
 * Reads the store through `lib/suites.mjs`, so a case's steps in the sheet are
 * the steps the validator judged.
 */

import { COLUMNS } from "./run-sheet-layout.mjs";
import { isAutomated, prop, readAllSuites } from "./suites.mjs";

/** `grade10-site/store/home` → product, domain, capability. A domain suite
 *  sits one level up and names no capability. */
function splitCapability(id) {
  const parts = id.split("/");
  return {
    product: parts[0] ?? "",
    domain: parts[1] ?? "",
    capability: parts.slice(2).join("/"),
  };
}

const list = (value) =>
  String(value ?? "")
    .split(",")
    .map((one) => one.trim().toLowerCase())
    .filter(Boolean);

/** Everything the store holds, as one flat list of candidates. */
export function readCandidates(root, scope = null) {
  const out = [];
  for (const read of readAllSuites(root, scope)) {
    for (const tc of read.cases) out.push({ read, tc });
  }
  return out;
}

/**
 * Which candidates a selection names.
 *
 * `ids` is the deterministic path and wins outright. The filters are a
 * convenience that resolves to the same thing, and both obey the status gate:
 * `actual` only unless `includeDraft`, and never `deprecated` - a deprecated
 * case is one the spec stopped stating, and walking it proves nothing.
 *
 * A case whose Automation status is `automated` is left out of this function
 * unless `includeAutomated` is set. The writer turns that flag on by default
 * (`--exclude-automated` turns it off): Auto web and Auto mobile are columns
 * a tester marks, and an automated case is the one those columns can answer.
 */
export function selectCases(candidates, options = {}) {
  const {
    ids = null,
    suites = null,
    priority = null,
    level = null,
    includeDraft = false,
    includeAutomated = false,
  } = options;

  const allowed = new Set(includeDraft ? ["actual", "draft"] : ["actual"]);
  const wanted =
    ids === null ? null : ids.map((one) => one.trim()).filter(Boolean);

  const byId = new Map();
  for (const one of candidates)
    if (!byId.has(one.tc.id)) byId.set(one.tc.id, one);

  const picked = [];
  const refused = [];
  const missing = [];

  const gate = (one) => {
    const status = prop(one.tc, "Status").toLowerCase();
    if (!allowed.has(status)) {
      refused.push({
        id: one.tc.id,
        reason: "status",
        why: `status is \`${status || "unset"}\``,
      });
      return false;
    }
    if (!includeAutomated && isAutomated(one.tc)) {
      refused.push({
        id: one.tc.id,
        reason: "automation",
        why: "automation status is `automated`",
        // What the case's own `**Decided by:**` line names, so the run can
        // print the file a tester would otherwise have to take on trust.
        decidedBy: (one.tc.decidedBy ?? []).map(({ path }) => path),
      });
      return false;
    }
    return true;
  };

  if (wanted) {
    for (const id of wanted) {
      const one = byId.get(id);
      if (!one) {
        missing.push(id);
        continue;
      }
      if (gate(one)) picked.push(one);
    }
    return { picked, refused, missing };
  }

  const wantSuites = suites ? list(suites) : null;
  const wantPriority = priority ? list(priority) : null;
  const wantLevel = level ? list(level) : null;

  for (const one of candidates) {
    if (wantLevel && !wantLevel.includes(one.read.level)) continue;
    if (
      wantPriority &&
      !wantPriority.includes(prop(one.tc, "Priority").toLowerCase())
    )
      continue;
    if (wantSuites) {
      const has = list(prop(one.tc, "Suites"));
      if (!wantSuites.some((s) => has.includes(s))) continue;
    }
    if (gate(one)) picked.push(one);
  }
  return { picked, refused, missing };
}

/**
 * What the automation gate did to this selection, and the one line a run
 * prints about it: how many automated cases it left out, or how many it took
 * with `--include-automated`.
 *
 * Said as zero rather than left unsaid, because the line is what proves the
 * gate ran (`shared-planning-agent-rounds-SC-61`). Pure, so the three counts
 * that matter — none, one and many — are asserted without a spreadsheet.
 *
 * `leftOut` re-reads `selectCases`' own refusals rather than running the gate
 * again; `included` reads the picked list, which only carries an automated
 * case where the flag let one through.
 *
 * `leftOutLines` names each one under the count (Q72 of
 * `run-a-round-on-every-artifact`): the case, then what its `**Decided by:**`
 * line names. A count alone points at no file, so a tester wondering why a
 * journey they walk has a hole in it has nothing to open; a case carrying no
 * line says so in the same shape, which is how a hole in the store shows up
 * in a run's own printout.
 */
export function automatedGateOf({ picked, refused, includeAutomated = false }) {
  const left = refused.filter((one) => one.reason === "automation");
  const leftOut = left.length;
  const included = includeAutomated
    ? picked.filter((one) => isAutomated(one.tc)).length
    : 0;
  const many = includeAutomated ? included : leftOut;
  return {
    leftOut,
    included,
    leftOutLines: left.map(
      (one) =>
        `  ${one.id} - ${
          one.decidedBy?.length > 0
            ? one.decidedBy.join(", ")
            : "decided by no named test"
        }`,
    ),
    line: `${many} automated case${many === 1 ? "" : "s"} ${
      includeAutomated ? "included" : "left out"
    }`,
  };
}

/**
 * Prefill for the four surfaces.
 *
 * **Testability** says which side can answer. **Automation status** only
 * opens Auto when a person can also walk the case.
 *
 * - `manual` only: Web and Mobile `to_do`, Auto `n/a`.
 * - `automation` only: Web and Mobile `n/a`, Auto `to_do` even when no
 *   script has landed yet.
 * - `automation, manual`: Web and Mobile `to_do`; Auto `to_do` if status is
 *   `automated`, else `n/a`.
 */
export function surfacePrefill(tc) {
  const parts = prop(tc, "Testability")
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(Boolean);
  const byScript = parts.includes("automation");
  const byHand = parts.includes("manual");
  const automated = isAutomated(tc);

  if (byScript && !byHand) {
    return {
      Web: "n/a",
      Mobile: "n/a",
      "Auto web": "to_do",
      "Auto mobile": "to_do",
    };
  }
  if (byHand && !byScript) {
    return {
      Web: "to_do",
      Mobile: "to_do",
      "Auto web": "n/a",
      "Auto mobile": "n/a",
    };
  }
  return {
    Web: "to_do",
    Mobile: "to_do",
    "Auto web": automated ? "to_do" : "n/a",
    "Auto mobile": automated ? "to_do" : "n/a",
  };
}

/** A header's name, backticks and one surrounding pair of angle brackets
 *  removed. `Closed lot` stays `Closed lot`, so it does not fill `<closed lot>`. */
function columnKey(header) {
  const bare = header.replace(/`/g, "").trim();
  const wrapped = bare.match(/^<([^<>]+)>$/);
  return wrapped ? wrapped[1] : bare;
}

function isSharedTable(table) {
  const keys = table.headers.map((header) => columnKey(header).toLowerCase());
  return keys[0] === "field" && keys[1] === "value";
}

/** Run tables are the ones that open a sheet row. A `Field | Value` table is
 *  shared setup and stays in the Test data cell. */
function runTablesOf(tc) {
  return (tc.tables ?? []).filter(
    (table) => !isSharedTable(table) && table.rows.length > 0,
  );
}

function sharedRowsOf(tc) {
  return (tc.tables ?? []).filter(isSharedTable).flatMap((table) => table.rows);
}

/** Replace a run-table `<name>` with `[cell]`. A name from `Field | Value`,
 *  and a name that matches no column, stay in angle brackets. The cell is
 *  copied as written, so a placeholder inside it is not filled again. */
function fillSlots(text, columns) {
  return text.replace(/<([^<>]+)>/g, (whole, name) =>
    columns.has(name) ? `[${columns.get(name)}]` : whole,
  );
}

function dataLines(shared, headers, row) {
  const lines = shared.map(
    (cells) => `${cells[0]}: ${cells.slice(1).join(" | ")}`,
  );
  headers.forEach((header, i) => {
    lines.push(`${header}: ${row[i] ?? ""}`);
  });
  return lines.join("\n");
}

/**
 * A case as its row, in `COLUMNS` order.
 *
 * The four surface cells arrive filled in, not empty. `to_do` is what makes the
 * Summary's progress honest: an empty cell is indistinguishable from a tab
 * nobody opened, where a column of `to_do` counts down as a tester works.
 * `n/a` is a surface that cannot answer: a person cannot walk an
 * automation-only case, and Auto cannot answer a manual-only case, or a mixed
 * case whose **Automation status** is still `manual`.
 *
 * `fill` is one value row of a per-row case. The case id and the prefill are
 * the same on every row that value row prints.
 */
export function caseRow({ read, tc }, fill = null) {
  const { product, domain, capability } = splitCapability(read.capabilityId);
  const columns = fill?.columns;
  const stepTexts = columns
    ? tc.stepTexts.map((one) => fillSlots(one, columns))
    : tc.stepTexts;
  const steps = stepTexts.map((one, i) => `${i + 1}. ${one}`);
  if (tc.perRow && !fill) steps.unshift("Runs once per row of Test data.");
  const expectedTexts = columns
    ? tc.expectedTexts.map((one) => fillSlots(one, columns))
    : tc.expectedTexts;
  const surfaces = surfacePrefill(tc);
  const cells = {
    "Case ID": tc.id,
    Title: tc.title,
    "Pre-conditions": columns
      ? fillSlots(tc.preconditions, columns)
      : tc.preconditions,
    "Test data": fill
      ? dataLines(fill.shared, fill.headers, fill.row)
      : tc.testData.map((r) => `${r.field}: ${r.value}`).join("\n"),
    Steps: steps.join("\n"),
    "Expected results": expectedTexts.join("\n"),
    ...surfaces,
    Product: product,
    Domain: domain,
    Capability: capability,
    Level: read.level,
    Layer: prop(tc, "Layer"),
    Severity: prop(tc, "Severity"),
    Priority: prop(tc, "Priority"),
  };
  return COLUMNS.map((name) => cells[name] ?? "");
}

/**
 * One sheet row, or one per body row of the run table when the case says
 * `Runs once per row of **Test data**.`. A case whose only table is
 * `Field | Value` stays one row.
 */
export function caseRows(one) {
  const runs = one.tc.perRow ? runTablesOf(one.tc) : [];
  if (runs.length === 0) return [caseRow(one)];
  const shared = sharedRowsOf(one.tc);
  const rows = [];
  for (const table of runs) {
    const keys = table.headers.map(columnKey);
    for (const row of table.rows) {
      const columns = new Map();
      keys.forEach((key, i) => {
        if (key && !columns.has(key)) columns.set(key, row[i] ?? "");
      });
      rows.push(caseRow(one, { columns, shared, headers: table.headers, row }));
    }
  }
  return rows;
}

/** A capability's banner row: the store path of the file, the rest empty so
 *  the text overflows across them. */
export function capabilityRow(capabilityId) {
  return [capabilityId, ...Array(COLUMNS.length - 1).fill("")];
}

/** A journey's banner row: its id and title in the first cell, the rest empty
 *  so the text overflows across them. */
export function journeyRow(journey) {
  const label = [journey?.raw, journey?.title].filter(Boolean).join(" — ");
  return [label, ...Array(COLUMNS.length - 1).fill("")];
}

/**
 * The grid a run tab is written from: a banner row per capability file, a
 * banner per journey, then the cases that walk it.
 *
 * The journey is a row rather than a repeated column because it repeats. A
 * `Journey title` column spent 200 pixels of the reading path restating the
 * same sentence on every row of a group, and the group already has a shape.
 * The capability row is the file the tester would open - `shared/auth/sign-in`
 * - and the journeys fold under it.
 *
 * `lines` runs parallel to `rows` and is what the formatting reads: a request
 * that bands a draft case or groups a journey needs to know which row is which,
 * and recovering that from the strings afterwards would be guesswork.
 */
export function buildGrid(picked) {
  const rows = [];
  const lines = [];
  let lastFile = null;
  let last = null;
  for (const one of picked) {
    const file = one.read.capabilityId ?? "";
    if (file !== lastFile) {
      rows.push(capabilityRow(file));
      lines.push({ kind: "capability", key: file, capabilityId: file });
      lastFile = file;
      last = null;
    }
    const key = one.tc.journey?.raw ?? "";
    if (key !== last) {
      rows.push(journeyRow(one.tc.journey));
      lines.push({ kind: "journey", key, capabilityId: file });
      last = key;
    }
    for (const row of caseRows(one)) {
      rows.push(row);
      lines.push({ kind: "case", one });
    }
  }
  return { rows, lines };
}

/** Walk bands, in the order a tester meets them. The store is its own band
 *  inside Grade10 site. A path outside these six follows them. */
const WALK_BANDS = [
  "shared",
  "grade10-site",
  "grade10-site/store",
  "grade10-admin",
  "zzz-site",
  "zzz-admin",
];

/** The band of a suite path. The longest matching prefix wins, so the store
 *  keeps its own band inside Grade10 site. */
export function walkBand(rel) {
  const path = String(rel)
    .replace(/^openspec\/changes\/[^/]+\/specs\//, "")
    .replace(/^openspec\/specs\//, "");
  let best = -1;
  WALK_BANDS.forEach((band, index) => {
    const hit = path === band || path.startsWith(`${band}/`);
    if (hit && (best === -1 || band.length > WALK_BANDS[best].length))
      best = index;
  });
  return best === -1 ? WALK_BANDS.length : best;
}

/** Picked cases in walk order: product band, then source path, then journey,
 *  then case number. A tester walks a journey at a time, and the run tab is
 *  grouped by journey, so the order is the grouping. */
export function inReadingOrder(picked) {
  return [...picked].sort(
    (a, b) =>
      walkBand(a.read.rel) - walkBand(b.read.rel) ||
      a.read.rel.localeCompare(b.read.rel) ||
      (a.tc.journeyNum ?? 0) - (b.tc.journeyNum ?? 0) ||
      (a.tc.tcNum ?? 0) - (b.tc.tcNum ?? 0) ||
      a.tc.id.localeCompare(b.tc.id),
  );
}
