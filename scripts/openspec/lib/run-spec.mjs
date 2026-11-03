/**
 * A confirmed selection as the run desk opens it: a `RunSpec`
 * (tools/manual/src/api/desk.ts), every case frozen as its suite says it at
 * the source commit, so a later edit to a suite never changes a run.
 *
 * Built from the same picked cases and fingerprint as the Sheet print, so a
 * dry run confirms one thing whichever way the run is walked.
 */

import { basename } from "node:path";
import { caseParts, readSuite } from "../../../tools/manual/src/api/suites.ts";
import {
  columnKey,
  runTablesOf,
  splitCapability,
  surfacePrefill,
} from "./select-cases.mjs";
import { isStoreSuite, STORE_PRD } from "./store-suites.mjs";
import { parseWalks, prop } from "./suites.mjs";

const SURFACE_OF = {
  Web: "web",
  Mobile: "mobile",
  "Auto web": "autoWeb",
  "Auto mobile": "autoMobile",
};

const tracesOf = (tc) =>
  prop(tc, "Trace")
    .split(",")
    .map((one) => one.trim())
    .filter(Boolean);

/** The store page and `##` section a store case is grouped under: its first
 *  trace, read against the page's own headings. */
function placeOf(trace, release) {
  const [page, rest = ""] = trace.split("#");
  const section = rest.split("/")[0];
  const path = `${STORE_PRD}/${page}.md`;
  const heading = (release?.sections.get(path) ?? []).find(
    (one) => one.trace === section,
  );
  return {
    page: path,
    ...(section ? { section: heading?.anchor ?? section } : {}),
    ...(heading ? { sectionTitle: heading.title } : {}),
  };
}

/** Given, steps and expectations as the manual reads them, where they agree
 *  with what the validator counted; the validator's own parse where not,
 *  since that is the case the suite's checks judged. */
function partsOf(tc, body) {
  const read = body === undefined ? null : caseParts(body);
  const agrees =
    read &&
    read.steps.length === tc.stepTexts.length &&
    read.expect.length === tc.expectedTexts.length;
  const given = tc.preconditions ? [tc.preconditions] : [];
  if (agrees) {
    const expect = read.expect.map((one) => {
      const named = /^Step (\d+):\s*(.*)$/.exec(one.text);
      return one.step === undefined && named
        ? { step: Number(named[1]), text: named[2] }
        : one;
    });
    return {
      ...(read.lead ? { lead: read.lead } : {}),
      given: read.given.length > 0 ? read.given : given,
      steps: read.steps,
      expect,
      ...(read.other.length > 0 ? { other: read.other } : {}),
    };
  }
  return {
    given,
    steps: tc.stepTexts,
    expect: tc.expectedTexts.map((text) => ({ text })),
  };
}

/** A per-row case's run tables as one table: the headers in the order first
 *  met, each row under them. A `Field | Value` table is shared setup. */
function dataOf(tc) {
  if (!tc.perRow) return null;
  const tables = runTablesOf(tc);
  if (tables.length === 0) return null;
  const header = [];
  for (const table of tables)
    for (const one of table.headers)
      if (!header.includes(one)) header.push(one);
  const rows = tables.flatMap((table) =>
    table.rows.map((row) =>
      header.map((name) => row[table.headers.indexOf(name)] ?? ""),
    ),
  );
  return { header, rows };
}

export function runCaseOf({ read, tc }, { body, release, phase } = {}) {
  const store = isStoreSuite(read.rel);
  const traces = tracesOf(tc);
  const { product, domain, capability } = splitCapability(read.capabilityId);
  const surfaces = Object.entries(surfacePrefill(tc))
    .filter(([, value]) => value === "to_do")
    .map(([name]) => SURFACE_OF[name]);
  const data = dataOf(tc);
  const story = tc.journey?.storyLines ?? [];
  const optional = (key, value) => (value ? { [key]: value } : {});
  return {
    id: tc.id,
    ...(tc.markerId ? { marker: tc.markerId, rev: tc.markerRev } : {}),
    title: tc.title,
    suite: read.rel,
    ...optional("level", read.level),
    ...optional("product", product),
    ...optional("domain", domain),
    ...optional("capability", capability),
    ...optional("severity", prop(tc, "Severity")),
    ...optional("priority", prop(tc, "Priority")),
    ...optional("status", prop(tc, "Status")),
    traces,
    ...(store && traces[0] ? placeOf(traces[0], release) : {}),
    ...optional("phase", phase),
    ...partsOf(tc, body),
    ...(data ? { data } : {}),
    surfaces,
    ...(!store && tc.journey
      ? {
          journey: [`${tc.journey.raw}: ${tc.journey.title}`, ...story].join(
            "\n",
          ),
        }
      : {}),
  };
}

const ITEM = /^(?:[-*+]|\d+\.)\s+(.*)$/;
const TICKED = /`([^`]+)`/g;
const CASE_ID = /^[\w.-]+[.-]TC-?\w+$/i;

/** The rows a case opens on the desk: one, or one per row of its data. */
export const rowsOf = (one) => Math.max(1, one.data?.rows.length ?? 0);

/** `**Shared test data:**` tables anywhere in a suite: placeholder to the
 *  words the suite gives it. */
export function placeholdersOf(text) {
  const out = {};
  const lines = text.split("\n");
  for (let at = 0; at < lines.length; at += 1) {
    if (!/^(\*\*)?Shared test data:(\*\*)?\s*$/.test(lines[at])) continue;
    for (let row = at + 1; row < lines.length; row += 1) {
      const line = lines[row].trim();
      if (line === "" && row === at + 1) continue;
      if (!line.startsWith("|")) {
        if (line !== "") break;
        continue;
      }
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((one) => one.trim());
      const name = cells[0] ? columnKey(cells[0]) : "";
      if (!name || /^-+$/.test(name.replace(/:/g, "")) || name === "Field")
        continue;
      out[`<${name}>`] = cells.slice(1).join(" | ");
    }
  }
  return out;
}

/**
 * A suite's walks as the desk walks them: the starting state once, then each
 * route step with what it should show and the cases it proves. `ids` are the
 * run's cases; a walk none of them is on is not the run's.
 */
export function walksOf(text, suite, ids) {
  const lines = text.split("\n");
  const known = new Map([...ids].map((id) => [id.toLowerCase(), id]));
  const casesOn = (line, refs) => {
    const found = [];
    for (const match of line.matchAll(TICKED)) {
      const id = known.get(match[1].toLowerCase());
      if (id && !found.includes(id)) found.push(id);
    }
    for (const ref of refs) {
      const id = ref.caseId ? known.get(ref.caseId) : undefined;
      if (id && !found.includes(id)) found.push(id);
    }
    return found;
  };
  const walks = [];
  for (const walk of parseWalks(text)) {
    const [label, ...named] = walk.title.split(":");
    const start = [];
    const route = [];
    let part = null;
    for (let at = walk.line; at < lines.length; at += 1) {
      const line = lines[at];
      if (/^##\s/.test(line)) break;
      if (/^###\s+Route\b/i.test(line)) {
        part = "route";
        continue;
      }
      if (/^(\*\*)?Starting state:/.test(line)) {
        part = "start";
        continue;
      }
      if (/^(\*\*|###|[A-Z][\w ]*:\s*$)/.test(line)) {
        part = null;
        continue;
      }
      const item = ITEM.exec(line.trim());
      if (!item || part === null) continue;
      if (part === "start") start.push(item[1].trim());
      else if (/^\d+\./.test(line)) route.push({ step: item[1], expect: [] });
      else if (route.length > 0) {
        const refs = walk.refs.filter((ref) => ref.line === at + 1);
        const last = route.at(-1);
        last.expect.push({ text: item[1], cases: casesOn(item[1], refs) });
      }
    }
    const steps = route.map(({ step, expect }) => ({
      step,
      expect: expect
        .map(({ text }) =>
          text
            .replace(TICKED, (whole, inner) =>
              CASE_ID.test(inner) ? "" : whole,
            )
            .replace(/\s+/g, " ")
            .trim(),
        )
        .join("\n"),
      cases: [...new Set(expect.flatMap((one) => one.cases))],
    }));
    if (!steps.some((one) => one.cases.length > 0)) continue;
    walks.push({
      id: `${basename(suite)}#${label
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`,
      title: named.length > 0 ? named.join(":").trim() : label.trim(),
      suite,
      start,
      route: steps,
    });
  }
  return walks;
}

/**
 * The `RunSpec` for picked cases already in reading order. `texts` holds each
 * suite's source by store-relative path; `release` names the store pages'
 * sections. Placeholders with different words in two suites keep both.
 */
export function runSpecOf(
  picked,
  { snapshot, texts, release, source, phase = null },
) {
  const bySuite = new Map();
  for (const one of picked) {
    if (!bySuite.has(one.read.rel)) bySuite.set(one.read.rel, []);
    bySuite.get(one.read.rel).push(one.tc.id);
  }
  const bodies = new Map();
  const walks = [];
  const placeholders = {};
  for (const [suite, ids] of bySuite) {
    const text = texts.get(suite);
    if (text === undefined) throw new Error(`No source for ${suite}`);
    for (const one of readSuite({ path: suite, source: text }))
      bodies.set(one.id, one.body);
    walks.push(...walksOf(text, suite, new Set(ids)));
    for (const [key, words] of Object.entries(placeholdersOf(text))) {
      const held = placeholders[key];
      placeholders[key] =
        held === undefined || held === words ? words : `${held}; ${words}`;
    }
  }
  if (!/^[0-9a-f]{40}$/.test(source ?? ""))
    throw new Error("A run names the full commit its cases were read at");
  return {
    name: snapshot.name,
    env: snapshot.env,
    ...(phase ? { phase } : {}),
    selection: snapshot.selection,
    source,
    fingerprint: snapshot.fingerprint,
    cases: picked.map((one) =>
      runCaseOf(one, { body: bodies.get(one.tc.id), release, phase }),
    ),
    walks,
    placeholders,
    exclusions: snapshot.excluded,
  };
}
