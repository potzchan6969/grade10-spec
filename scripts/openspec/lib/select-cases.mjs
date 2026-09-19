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

import { CASE_COLUMNS } from "./run-sheet-layout.mjs";
import { prop, readAllSuites } from "./suites.mjs";

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
 * push instead (`docs/governance/specs-to-test-cases.md`, "The run sheet
 * keeps what only staging proves").
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
    const automation = prop(one.tc, "Automation status").toLowerCase();
    if (!includeAutomated && automation === "automated") {
      refused.push({
        id: one.tc.id,
        reason: "automation",
        why: "automation status is `automated`",
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

/** A case as its row, in `CASE_COLUMNS` order. The marking columns stay empty:
 *  they are the tester's. */
export function caseRow({ read, tc }) {
  const { product, domain, capability } = splitCapability(read.capabilityId);
  const steps = tc.stepTexts.map((one, i) => `${i + 1}. ${one}`);
  if (tc.perRow) steps.unshift("Runs once per row of Test data.");
  const cells = {
    "Case ID": tc.id,
    Level: read.level,
    Product: product,
    Domain: domain,
    Capability: capability,
    Journey: tc.journey?.raw ?? "",
    "Journey title": tc.journey?.title ?? "",
    Title: tc.title,
    Severity: prop(tc, "Severity"),
    Priority: prop(tc, "Priority"),
    Suites: prop(tc, "Suites"),
    Type: prop(tc, "Type"),
    Behaviour: prop(tc, "Behaviour"),
    Layer: prop(tc, "Layer"),
    "Automation status": prop(tc, "Automation status"),
    "Pre-conditions": tc.preconditions,
    "Test data": tc.testData.map((r) => `${r.field}: ${r.value}`).join("\n"),
    Steps: steps.join("\n"),
    "Expected results": tc.expectedTexts.join("\n"),
    Source: read.rel,
  };
  return CASE_COLUMNS.map((name) => cells[name] ?? "");
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
