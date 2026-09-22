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
 * A case whose Automation status is `automated` is left out too, unless
 * `includeAutomated` says otherwise: a run sheet is where a case a script
 * cannot cover leaves the store, and an automated case is proved on every
 * push instead (`docs/governance/specs-to-test-cases.md`, "The Run Sheet").
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
 * A case as its row, in `COLUMNS` order.
 *
 * The four surface cells arrive filled in, not empty. `to_do` is what makes the
 * Summary's progress honest: an empty cell is indistinguishable from a tab
 * nobody opened, where a column of `to_do` counts down as a tester works. The
 * automation columns of a case no automated test covers get `n/a` instead -
 * there is nothing there to do, and the case's `Automation status` is the only
 * record of that, so the prefill is where it reaches the sheet.
 *
 * Nothing carries the automation status as its own column any more. The pair of
 * `n/a`s says it, and a column saying it again would be a second place for it
 * to be wrong.
 */
export function caseRow({ read, tc }) {
  const { product, domain, capability } = splitCapability(read.capabilityId);
  const steps = tc.stepTexts.map((one, i) => `${i + 1}. ${one}`);
  if (tc.perRow) steps.unshift("Runs once per row of Test data.");
  const automated = prop(tc, "Automation status").toLowerCase() === "automated";
  const cells = {
    "Case ID": tc.id,
    Title: tc.title,
    "Pre-conditions": tc.preconditions,
    "Test data": tc.testData.map((r) => `${r.field}: ${r.value}`).join("\n"),
    Steps: steps.join("\n"),
    "Expected results": tc.expectedTexts.join("\n"),
    Web: "to_do",
    Mobile: "to_do",
    "Auto web": automated ? "to_do" : "n/a",
    "Auto mobile": automated ? "to_do" : "n/a",
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

/** A journey's banner row: its id and title in the first cell, the rest empty
 *  so the text overflows across them. */
export function journeyRow(journey) {
  const label = [journey?.raw, journey?.title].filter(Boolean).join(" — ");
  return [label, ...Array(COLUMNS.length - 1).fill("")];
}

/**
 * The grid a run tab is written from: a banner row per journey, then the cases
 * that walk it.
 *
 * The journey is a row rather than a repeated column because it repeats. A
 * `Journey title` column spent 200 pixels of the reading path restating the
 * same sentence on every row of a group, and the group already has a shape.
 *
 * `lines` runs parallel to `rows` and is what the formatting reads: a request
 * that bands a draft case or groups a journey needs to know which row is which,
 * and recovering that from the strings afterwards would be guesswork.
 */
export function buildGrid(picked) {
  const rows = [];
  const lines = [];
  let last = null;
  for (const one of picked) {
    const key = one.tc.journey?.raw ?? "";
    if (key !== last) {
      rows.push(journeyRow(one.tc.journey));
      lines.push({ kind: "journey", key });
      last = key;
    }
    rows.push(caseRow(one));
    lines.push({ kind: "case", one });
  }
  return { rows, lines };
}

/** Picked cases in reading order: by source file, then by journey, then by the
 *  case number. A tester walks a journey at a time, and the run tab is grouped
 *  by journey, so the order is the grouping. */
export function inReadingOrder(picked) {
  return [...picked].sort(
    (a, b) =>
      a.read.rel.localeCompare(b.read.rel) ||
      (a.tc.journeyNum ?? 0) - (b.tc.journeyNum ?? 0) ||
      (a.tc.tcNum ?? 0) - (b.tc.tcNum ?? 0) ||
      a.tc.id.localeCompare(b.tc.id),
  );
}
