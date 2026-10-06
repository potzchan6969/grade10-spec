import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import YAML from "yaml";
import { RULES } from "../../../tools/manual/check/context.mjs";
import { parsePage } from "../../../tools/manual/src/content/grammar.ts";
import { sectionTextOf } from "../../../tools/manual/src/content/sections.ts";
import {
  leadingTitle,
  outline,
  sectionSpan,
  trimBlank,
} from "../../../tools/manual/src/store/markdown.mts";
import {
  deltaKindOf,
  deltaRequirementSections,
  deltaSections,
  proposalSectionLinks,
  renamedPairs,
} from "../../../tools/manual/src/store/read-changes.mts";
import {
  acceptedSnapshots,
  describeReuse,
  reusedInChange,
} from "../../../tools/manual/src/store/reused-ids.mts";
import { parseTraceGraph } from "../../test-traceability/trace.mjs";
import { git, textAt } from "../store-main.mjs";
import { foldGroups, holding, labelOf, splitGroups } from "./feature-set.mjs";
import { foldChecks, purposeOf } from "./fold-checks.mjs";
import { deriveStatus, parseSuite, statusCounts } from "./suites.mjs";

const TRACE_MARKER_LINE =
  /^[ \t]*<!--\s*trace:(?:scenario|case)\b[^\n]*-->[ \t]*\n?/gm;

/** Trace markers are stamped onto durable specs by migrations after a
 * snapshot was taken; a drift check compares wording, so it ignores them. */
const withoutTraceMarkers = (text) =>
  (text ?? "").replace(TRACE_MARKER_LINE, "");

const TRACE_MARKER = /<!-- trace:scenario id=(\S+)/g;
const MARKED_SCENARIO =
  /<!-- trace:scenario id=(\S+)[^\n]*\n#### Scenario: (\S+)/g;
const HASH = (value) => createHash("sha256").update(value).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const CONTRACT_NAMES = new Set([
  "proposal.md",
  "decisions.md",
  "ui-design.md",
  "tech-design.md",
  "user-journeys.md",
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
  "spec.md",
  "tasks.md",
]);
const COMPANIONS = new Set([
  "user-journeys.md",
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
]);

/** The suites and journeys that publish with one capability's delta: the
 * companions beside it, then the domain suite one level up and the product
 * suite two levels up, where the change carries them beside its specs. Each
 * names the directory under `specs/` its durable copy lands in. */
function companionsOf(deltaDir, capability) {
  const found = [...COMPANIONS].map((name) => ({
    name,
    source: join(deltaDir, name),
    dir: capability,
  }));
  const domain = dirname(capability);
  const product = dirname(domain);
  if (domain !== ".")
    found.push({
      name: "domain-tcs.md",
      source: join(dirname(deltaDir), "domain-tcs.md"),
      dir: domain,
    });
  if (product !== ".")
    found.push({
      name: "product-tcs.md",
      source: join(dirname(dirname(deltaDir)), "product-tcs.md"),
      dir: product,
    });
  return found.filter((one) => existsSync(one.source));
}

function walkFiles(root, dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(root, file, found);
    else if (CONTRACT_NAMES.has(entry.name))
      found.push(relative(root, file).replaceAll("\\", "/"));
  }
  return found;
}

/** The page sections the proposal's `## References` link, each read as the
 * manual reads it, or why it cannot be: a flow's step headings stay inside a
 * section, and a `detail` or an `example` - the page's `Product decisions`
 * among them - is the page's own, so a change never inherits the questions
 * another left there. */
function linkedSections(root, changeId) {
  const rel = `openspec/changes/${changeId}`;
  const proposal = join(root, rel, "proposal.md");
  if (!existsSync(proposal)) return [];
  return proposalSectionLinks(readFileSync(proposal, "utf8"), rel).map(
    ({ page, slug }) => {
      const path = `${page}#${slug}`;
      if (!existsSync(join(root, page)))
        return { path, error: `${page} does not exist` };
      let ast;
      try {
        ast = parsePage(readFileSync(join(root, page), "utf8"));
      } catch (error) {
        return { path, error: `${page}: ${error.message}` };
      }
      const content = sectionTextOf({ ast }, slug);
      return content === undefined
        ? { path, error: `${page} has no section matching #${slug}` }
        : { path, content };
    },
  );
}

function changeContractPaths(root, changeId) {
  return walkFiles(root, join(root, "openspec", "changes", changeId))
    .filter(
      (path) => !path.endsWith("/tasks.md") && !path.endsWith("/rounds.md"),
    )
    .sort();
}

function canonicalPlanningContent(path, text) {
  if (path.endsWith("/tasks.md"))
    return text
      .replace(/^([ \t]*-[ \t]*)\[[ xX]\]/gm, "$1[ ]")
      .replace(/[ \t]+\(owner:\s*[^)]+\)/gi, "")
      .replace(/[ \t]+\*\*Owner:\*\*\s*[^\n]+/gi, "");
  if (!/(?:feature|domain|product|platform)-tcs\.md$/.test(path)) return text;
  return text
    .split("\n")
    .filter(
      (line) =>
        !/^\*\*Status:\*\*/.test(line) &&
        !/^\*\*Drafts styled:\*\*/.test(line) &&
        !/^\s*\* \*\*Status:\*\*/.test(line) &&
        !/^\s*\* \*\*Automation status:\*\*/.test(line),
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function durableFor(root, capability, filename) {
  return join(root, "openspec", "specs", capability, filename);
}

function requirementBlocks(text) {
  const requirements = sectionByName(deltaSections(text), "Requirements");
  return new Map(
    (requirements?.children ?? [])
      .filter((section) => /^Requirement:\s*/i.test(section.heading))
      .map((section) => [
        section.heading.replace(/^Requirement:\s*/i, "").trim(),
        section,
      ]),
  );
}

function renderRequirement(
  section,
  name = section.heading.replace(/^Requirement:\s*/i, ""),
) {
  const body = section.raw;
  return `### Requirement: ${name}${body ? `\n\n${body}` : ""}`;
}

function renderSection(section) {
  return `${"#".repeat(section.level)} ${section.heading}${section.raw ? `\n\n${section.raw}` : ""}`;
}

function sectionByName(sections, name) {
  return sections.find((section) => section.heading === name);
}

function claimsFeatureSet(sections) {
  return ["Feature set", "REMOVED Feature set"].some((name) =>
    sectionByName(sections, name),
  );
}

function usId(heading) {
  return /([a-z0-9][a-z0-9-]*-US-\d+[a-z]?)/i.exec(heading)?.[1] ?? null;
}

function journeyIds(text) {
  const section = sectionByName(deltaSections(text ?? ""), "User journeys");
  return new Set((section?.children ?? []).map((one) => usId(one.heading)));
}

const WALKED_BY = /^\*\*Walked by:\*\*.*(?:\n(?!#).+)*/m;

/** A delta's Walked by line, reason and all, stands where the journeys would,
 * and may retire the last of them in the same delta; `pnpm check:manual`
 * refuses a file holding both, so a journey the delta adds or leaves standing
 * beside it is refused. */
function refuseBesideWalkedBy(added, standing, capability) {
  for (const [ids, which] of [
    [added, "the journeys this delta adds:"],
    [standing, "the durable journeys"],
  ])
    if (ids.length > 0)
      throw new Error(
        `${capability}: a Walked by line cannot stand beside ${which} ${ids.join(", ")}`,
      );
}

/** A restated, modified or removed journey names one the accepted baseline
 * holds; one it does not hold would be added, or silently dropped under a
 * Walked by line. */
function refuseUnheldJourneys(fromDelta, held, capability) {
  for (const [name, verb] of [
    ["Context user journeys", "restated"],
    ["MODIFIED User journeys", "modified"],
    ["REMOVED User journeys", "removed"],
  ])
    for (const journey of sectionByName(fromDelta, name)?.children ?? []) {
      const id = usId(journey.heading);
      if (!id || !held.has(id))
        throw new Error(
          `${capability}: ${verb} journey ${id ?? journey.heading} is not in the accepted baseline`,
        );
    }
}

function mergeJourneys(
  currentText,
  deltaText,
  changeId,
  capability,
  priorText,
) {
  const fromDelta = deltaSections(deltaText);
  const ownIds = journeyIds(priorText);
  refuseUnheldJourneys(
    fromDelta,
    new Set([...journeyIds(currentText), ...ownIds]),
    capability,
  );
  const walkedBy = WALKED_BY.exec(deltaText)?.[0];
  const current = currentText ?? deltaText;
  const currentSections = deltaSections(current);
  const currentJourneySection = sectionByName(currentSections, "User journeys");
  const live = new Map(
    (currentJourneySection?.children ?? [])
      .filter((section) => usId(section.heading))
      .map((section) => [usId(section.heading), section]),
  );
  const retired = new Set(readRetiredIds(currentSections));
  const durableIds = new Set(currentText ? live.keys() : []);
  const deltaHeld = [
    "User journeys",
    "Context user journeys",
    "ADDED User journeys",
    "MODIFIED User journeys",
  ]
    .map((name) => sectionByName(fromDelta, name))
    .filter(Boolean);
  const deltaIds = new Set();
  const added = [];
  for (const section of deltaHeld) {
    for (const journey of section.children) {
      const id = usId(journey.heading);
      if (!id) continue;
      if (deltaIds.has(id))
        throw new Error(
          `${capability}: journey ${id} appears more than once in its delta`,
        );
      deltaIds.add(id);
      if (section.heading !== "Context user journeys") added.push(id);
      if (
        section.heading === "ADDED User journeys" &&
        durableIds.has(id) &&
        !ownIds.has(id)
      )
        throw new Error(
          `${capability}: added journey ${id} already exists in the durable journeys; renumber it`,
        );
      live.set(id, journey);
      retired.delete(id);
    }
  }
  const removed = sectionByName(fromDelta, "REMOVED User journeys");
  for (const journey of removed?.children ?? []) {
    const id = usId(journey.heading);
    live.delete(id);
    retired.add(id);
  }
  if (walkedBy) refuseBesideWalkedBy(added, [...live.keys()], capability);
  const rendered = [];
  const title = leadingTitle(outline(current));
  if (title) rendered.push(`# ${title}`);
  rendered.push("## User journeys");
  if (walkedBy) rendered.push(walkedBy);
  for (const journey of live.values()) rendered.push(renderSection(journey));
  if (retired.size > 0) {
    rendered.push("## Retired");
    const oldRetired = sectionByName(currentSections, "Retired");
    const priorLines =
      oldRetired?.raw.split("\n").filter((line) => line.trim() !== "") ?? [];
    const known = new Set(
      priorLines
        .map((line) => /([a-z0-9][a-z0-9-]*-US-\d+[a-z]?)/i.exec(line)?.[1])
        .filter(Boolean),
    );
    for (const id of retired)
      if (!known.has(id))
        priorLines.push(`- \`${id}\` - Retired by ${changeId}.`);
    rendered.push(priorLines.join("\n"));
  }
  return `${rendered.join("\n\n")}\n`;
}

function readRetiredIds(sections) {
  const retired = sectionByName(sections, "Retired");
  return [...(retired?.raw.match(/[a-z0-9][a-z0-9-]*-US-\d+[a-z]?/gi) ?? [])];
}

function mergeFeatureSet(currentSpec, deltaText, capability, priorText) {
  const delta = deltaSections(deltaText);
  const deltaFeature = sectionByName(delta, "Feature set");
  const removedRaw = sectionByName(delta, "REMOVED Feature set")?.raw ?? "";
  const removing = splitGroups(removedRaw).size > 0;
  if (!deltaFeature && !removing) return currentSpec;
  const currentFeature = sectionByName(
    deltaSections(currentSpec),
    "Feature set",
  );
  if (!currentFeature && removing)
    throw new Error(
      `${capability}: cannot remove a Feature set group without a durable Feature set`,
    );
  if (!currentFeature) {
    return `${currentSpec.replace(/\n*$/, "\n\n")}## Feature set${deltaFeature.raw ? `\n\n${deltaFeature.raw}` : ""}\n`;
  }
  if (priorText) {
    const baseGroups = splitGroups(currentFeature.raw);
    const deltaGroups = splitGroups(deltaFeature?.raw ?? "");
    const removedGroups = splitGroups(removedRaw);
    const priorFeature = sectionByName(deltaSections(priorText), "Feature set");
    const priorGroups = splitGroups(priorFeature?.raw ?? "");
    const shape = (items) =>
      withoutTraceMarkers((items ?? []).flat().join("\n"));
    const itemShape = (items, label) =>
      shape((items ?? []).filter((one) => labelOf(one) === label));
    const touched = new Map();
    const touch = (group, label) =>
      touched.set(group, (touched.get(group) ?? new Set()).add(label));
    for (const [group, items] of deltaGroups) {
      const current = baseGroups.get(group) ?? [];
      for (const item of items) {
        const label = labelOf(item);
        const same = (one) => shape([one]) === shape([item]);
        const restated = label
          ? holding(current, label).length === 1 &&
            same(current[holding(current, label)[0]])
          : current.some(same);
        if (!restated) touch(group, label);
      }
    }
    for (const [group, items] of removedGroups) {
      if (items.length === 0) touch(group, null);
      for (const item of items) touch(group, labelOf(item));
    }
    for (const [group, labels] of touched) {
      const drifted = labels.has(null)
        ? shape(baseGroups.get(group)) !== shape(priorGroups.get(group))
        : [...labels].some(
            (label) =>
              itemShape(baseGroups.get(group), label) !==
              itemShape(priorGroups.get(group), label),
          );
      if (drifted)
        throw new Error(
          `${capability}: accepted Feature set group "${group.replace(/^-\s+/, "")}" changed since this amendment began; rebase the delta before acceptance`,
        );
    }
  }
  if (!removing && splitGroups(deltaFeature.raw).size === 0) {
    if (deltaFeature.raw.trim() === currentFeature.raw.trim())
      return currentSpec;
    throw new Error(
      `${capability}: cannot safely merge this Feature set; use its bullet-group form or rebase a complete compatible result`,
    );
  }
  const groups = foldGroups(
    currentFeature.raw,
    deltaFeature?.raw ?? "",
    removedRaw,
    capability,
  );
  const body = [...groups]
    .map(([group, items]) => [group, ...items.flat()].join("\n"))
    .join("\n");
  const rendered = `## Feature set\n\n${body}\n`;
  const span = sectionSpan(currentSpec, "Feature set");
  if (!span) return `${currentSpec.replace(/\n*$/, "\n\n")}${rendered}`;
  const lines = currentSpec.split("\n");
  lines.splice(
    span.from - 1,
    span.until - (span.from - 1),
    ...rendered.split("\n"),
  );
  return `${lines.join("\n").replace(/\n*$/, "\n")} `.trimEnd();
}

function mergePurpose(
  currentSpec,
  deltaPurpose,
  capability,
  priorText,
  baseText,
) {
  if (!deltaPurpose) return currentSpec;
  const currentPurpose = sectionByName(deltaSections(currentSpec), "Purpose");
  if (
    !priorText &&
    typeof baseText === "string" &&
    purposeOf(baseText) !== currentPurpose?.raw
  )
    throw new Error(
      `${capability}: accepted Purpose changed since this delta's Purpose was written; fold the durable Purpose's changes into this delta's Purpose and commit it`,
    );
  if (priorText) {
    const priorPurpose = sectionByName(deltaSections(priorText), "Purpose");
    if (currentPurpose?.raw !== priorPurpose?.raw) {
      throw new Error(
        `${capability}: accepted Purpose changed since this amendment began; rebase the delta before acceptance`,
      );
    }
  }
  const rendered = `## Purpose${deltaPurpose.raw ? `\n\n${deltaPurpose.raw}` : ""}`;
  const span = sectionSpan(currentSpec, "Purpose");
  if (!span) return `${currentSpec.replace(/\n*$/, "\n\n")}${rendered}`;
  const lines = currentSpec.split("\n");
  lines.splice(
    span.from - 1,
    span.until - (span.from - 1),
    ...rendered.split("\n"),
  );
  return `${lines
    .join("\n")
    .replace(/([^\n])\n(##\s)/g, "$1\n\n$2")
    .replace(/\n*$/, "\n")}`;
}

function validatedRenamedPairs(section, capability) {
  const froms = [
    ...section.raw.matchAll(
      /^\s*-?\s*FROM:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/gim,
    ),
  ].map((match) => match[1]);
  const tos = [
    ...section.raw.matchAll(
      /^\s*-?\s*TO:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/gim,
    ),
  ].map((match) => match[1]);
  const pairs = renamedPairs(section.raw);
  if (
    froms.length === 0 ||
    tos.length === 0 ||
    pairs.length !== froms.length ||
    pairs.length !== tos.length
  ) {
    throw new Error(
      `${capability}: every RENAMED Requirements entry needs one complete FROM/TO pair`,
    );
  }
  if (
    new Set(froms).size !== froms.length ||
    new Set(tos).size !== tos.length ||
    pairs.some(({ from, to }) => from === to)
  ) {
    throw new Error(
      `${capability}: RENAMED Requirements entries must have unique, distinct FROM and TO names`,
    );
  }
  const replacements = new Set(
    deltaRequirementSections(section).map((one) => one.name),
  );
  for (const { to } of pairs) {
    if (!replacements.has(to))
      throw new Error(
        `${capability}: rename target ${to} needs its complete Requirement block`,
      );
  }
  return pairs;
}

const SUITE_LISTS = ["Raised", "Settled", "Out of suite"];
const SUITE_SECTIONS = new Set([
  "Background",
  "Reconciliation",
  ...SUITE_LISTS,
]);
const JOURNEY_GROUP = /^(.+?-US-?(\d+)([a-z]?))\b/i;

function paragraphs(text) {
  return (text ?? "")
    .split(/\n[ \t]*\n/)
    .map((one) => one.trim())
    .filter(Boolean);
}

function appendMissing(currentText, deltaText) {
  const kept = paragraphs(currentText);
  for (const one of paragraphs(deltaText))
    if (!kept.includes(one)) kept.push(one);
  return kept.join("\n\n");
}

/** A Raised, Settled or Out of suite item that stands for an empty list:
 * `None`, bulleted or italic or bare, closing there or going on with `yet`,
 * `for`, a stop, a semicolon or a dash. */
const PLACEHOLDER = /^(?:[-*]\s+)?\*?None(?:$|[.;:]| yet\b| for\b| [—-] )/;

function listItems(text) {
  const items = [];
  let fresh = true;
  for (const line of (text ?? "").split("\n")) {
    if (line.trim() === "") fresh = true;
    else if (fresh || /^[-*] /.test(line) || PLACEHOLDER.test(line)) {
      items.push(line);
      fresh = false;
    } else items[items.length - 1] += `\n${line}`;
  }
  return items;
}

function mergeList(currentText, deltaText) {
  const items = [
    ...new Set([...listItems(currentText), ...listItems(deltaText)]),
  ];
  const real = items.filter((item) => !PLACEHOLDER.test(item));
  const kept = real.length ? real : items.slice(0, 1);
  const isItem = (item) => /^[-*] /.test(item);
  if (kept.length === 0) return "";
  return kept.reduce(
    (text, item, i) =>
      `${text}${isItem(item) && isItem(kept[i - 1]) ? "\n" : "\n\n"}${item}`,
  );
}

function splitManual(raw) {
  const lines = (raw ?? "").split("\n");
  const start = lines.findIndex((line) => line.trim() === "### Manual");
  if (start < 0) return { runs: trimBlank(lines), manual: [] };
  const after = lines.findIndex(
    (line, i) => i > start && /^#{1,3} /.test(line),
  );
  const end = after < 0 ? lines.length : after;
  return {
    runs: trimBlank([...lines.slice(0, start), ...lines.slice(end)]),
    manual: lines.slice(start + 1, end),
  };
}

const RUN_LINE = /^(\*\*Run\b|Run:)/;

/** A run is its `Run` paragraph and what follows until the next one; text
 *  before the first is a run with no heading. A delta run whose heading the
 *  durable suite already holds, or the delta's own headless run, is that run
 *  grown since its last fold and replaces it; any other run is added. */
function mergeRuns(currentRuns, deltaRuns) {
  if (!deltaRuns || currentRuns.includes(deltaRuns)) return currentRuns;
  const runsOf = (text) =>
    paragraphs(text).reduce((runs, one) => {
      if (runs.length === 0 || RUN_LINE.test(one)) runs.push([one]);
      else runs.at(-1).push(one);
      return runs;
    }, []);
  const keyOf = (run) => (RUN_LINE.test(run[0]) ? run[0] : "");
  const merged = runsOf(currentRuns);
  for (const run of runsOf(deltaRuns)) {
    const at = merged.findIndex((one) => keyOf(one) === keyOf(run));
    if (at < 0) merged.push(run);
    else merged[at] = run;
  }
  return merged.map((run) => run.join("\n\n")).join("\n\n");
}

function mergeReconciliation(currentRaw, deltaRaw) {
  const current = splitManual(currentRaw);
  const delta = splitManual(deltaRaw);
  const runs = mergeRuns(current.runs, delta.runs);
  const tables = [current.manual, delta.manual].map((lines) =>
    lines.filter((line) => line.startsWith("|")),
  );
  const header = (tables[0].length ? tables[0] : tables[1]).slice(0, 2);
  const rows = new Map();
  for (const row of [...tables[0].slice(2), ...tables[1].slice(2)]) {
    rows.set(/^\|([^|]*)\|/.exec(row)[1].replaceAll("`", "").trim(), row);
  }
  const prose = appendMissing(
    ...[current.manual, delta.manual].map((lines) =>
      lines.filter((line) => !line.startsWith("|")).join("\n"),
    ),
  );
  const table = [...header, ...rows.values()].join("\n");
  const manual = [prose, table].filter(Boolean).join("\n\n");
  return [runs, manual && `### Manual\n\n${manual}`]
    .filter(Boolean)
    .join("\n\n");
}

function suiteHeader(currentHeader, deltaHeader) {
  const label = (line) => /^\*\*([^*]+):\*\*/.exec(line)?.[1];
  const dated = (line) => /\d{4}-\d{2}-\d{2}/.exec(line)?.[0] ?? "";
  const lines = currentHeader.split("\n");
  for (const line of deltaHeader.split("\n").filter(label)) {
    const at = lines.findIndex((one) => label(one) === label(line));
    if (at < 0) lines.push(line);
    else if (!(dated(line) && dated(line) < dated(lines[at]))) lines[at] = line;
  }
  return lines.join("\n");
}

/** The header a fold leaves: a file that was approved and now holds a draft
 *  lapses its `**Reviewed:**` line on the fold's date, so it reads `reopened`. */
function withDerivedStatus(text, foldedOn) {
  const suite = parseSuite(text);
  const cases = suite.journeys.flatMap((journey) => journey.cases);
  const counts = statusCounts(cases);
  const lapses =
    suite.reviewed &&
    !suite.reviewedLapsed &&
    deriveStatus(counts, cases.length) !== "approved";
  const status = deriveStatus(
    counts,
    cases.length,
    Boolean(suite.reviewedLapsed) || lapses,
  );
  const reviewed = lapses
    ? text.replace(/^(\*\*Reviewed:\*\* .*?)[ \t]*$/m, `$1, lapsed ${foldedOn}`)
    : text;
  return reviewed.replace(/^\*\*Status:\*\* .*$/m, `**Status:** ${status}`);
}

const CASE_HEADING = /(\S+-TC\d+)-(\d+)\b/i;

const CASE_MARKER = /\n*(<!-- trace:case [^\n]*-->)$/;

/** A journey's cases, each with the `trace:case` marker on the line above
 *  its heading. The outline files that marker at the end of whatever comes
 *  before the case, so it is handed to the case it belongs to and travels
 *  with it. */
function markedCases(group, capability) {
  const sections = group.children;
  for (const section of sections)
    if (!CASE_HEADING.test(section.heading))
      throw new Error(
        `${capability}: \`### ${section.heading}\` under \`## ${group.heading}\` is not a test case the fold can place; fold it by hand into the change's suite`,
      );
  const split = (text, more) => {
    const found = more && CASE_MARKER.exec(text);
    return found ? [text.slice(0, found.index), found[1]] : [text, null];
  };
  let [body, marker] = split(group.body, sections.length > 0);
  const cases = sections.map((section, index) => {
    const [raw, next] = split(section.raw, index < sections.length - 1);
    const one = { section: { ...section, raw }, marker };
    marker = next;
    return one;
  });
  return { body, cases };
}

/** A delta case replaces the durable case of the same `TC<m>`: the same
 *  revision restyled, or a higher one the change rewrote, whose marker moves
 *  to the new revision. An older revision means the change was written
 *  against a suite that has since moved on. */
function mergeCases(existing, incoming, capability) {
  const revisionOf = (one) => Number(CASE_HEADING.exec(one.section.heading)[2]);
  const cases = new Map(existing.map((one) => [caseNumber(one.section), one]));
  for (const one of incoming) {
    const number = caseNumber(one.section);
    const prior = cases.get(number);
    const rev = revisionOf(one);
    if (prior && rev < revisionOf(prior))
      throw new Error(
        `${capability}: ${number}-${rev} is an older revision than the durable suite's ${number}-${revisionOf(prior)}; write the change's case against it`,
      );
    const inherited =
      prior?.marker && rev > revisionOf(prior)
        ? prior.marker.replace(/ rev=\d+ /, ` rev=${rev} `)
        : prior?.marker;
    cases.set(number, { ...one, marker: one.marker ?? inherited ?? null });
  }
  return [...cases.values()];
}

function caseNumber(section) {
  return CASE_HEADING.exec(section.heading)[1];
}

/** Each `TC<m>` once in a suite, whatever its revision: the rule
 *  `tcs:validate` holds the store to. */
function refuseRepeatedCases(text, capability, where, remedy) {
  const seen = new Set();
  for (const [, number] of text.matchAll(/^###\s+(\S+-TC\d+)-\d+\b/gim)) {
    if (seen.has(number))
      throw new Error(
        `${capability}: test case ${number} appears more than once in ${where}; ${remedy}`,
      );
    seen.add(number);
  }
}

function mergeSuite(currentText, deltaText, capability, foldedOn) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(foldedOn ?? ""))
    throw new Error(`${capability}: a suite fold needs its date, YYYY-MM-DD`);
  if (currentText === null || currentText === undefined) return deltaText;
  const texts = [currentText, deltaText].map((text) =>
    text.replace(/\r\n/g, "\n"),
  );
  if (texts[0] === texts[1]) return texts[0];
  const docs = texts.map((text) => {
    const sections = deltaSections(text);
    const headerEnd = Math.min(
      ...sections.map((section) => section.line),
      text.split("\n").length + 1,
    );
    const header = text
      .split("\n")
      .slice(0, headerEnd - 1)
      .join("\n")
      .trimEnd();
    for (const section of sections)
      if (
        section.level === 2 &&
        !SUITE_SECTIONS.has(section.heading) &&
        !JOURNEY_GROUP.test(section.heading)
      )
        throw new Error(
          `${capability}: test-case suite section \`## ${section.heading}\` has no fold rule; fold it by hand into the change's suite`,
        );
    return { header, sections };
  });
  const [current, delta] = docs;
  const named = (doc, name) => sectionByName(doc.sections, name)?.raw;
  const groupsOf = (doc) =>
    doc.sections.filter(
      (section) => section.level === 2 && JOURNEY_GROUP.test(section.heading),
    );
  const groupId = (section) => JOURNEY_GROUP.exec(section.heading)[1];
  const ruled = /\n+---$/;
  refuseRepeatedCases(
    texts[0],
    capability,
    "the durable suite",
    "repair the durable suite first",
  );
  refuseRepeatedCases(
    texts[1],
    capability,
    "the change's suite",
    "give the new case the next unused TC number",
  );
  const currentGroups = new Map(
    groupsOf(current).map((section) => [groupId(section), section]),
  );
  for (const incoming of groupsOf(delta)) {
    const existing = currentGroups.get(groupId(incoming));
    const { body, cases: added } = markedCases(incoming, capability);
    const cases = mergeCases(
      existing ? markedCases(existing, capability).cases : [],
      added,
      capability,
    );
    const rendered = [`## ${incoming.heading}`, body.trim()].filter(Boolean);
    for (const { section, marker } of cases)
      rendered.push(
        `${marker ? `${marker}\n` : ""}${renderSection(section).replace(ruled, "")}`,
      );
    currentGroups.set(groupId(incoming), {
      heading: incoming.heading,
      render: rendered.join("\n\n"),
    });
  }
  if (currentGroups.size === 0) {
    // Unknown suite shapes are unsafe to replace. A conflict must be resolved
    // by preparing a complete suite before acceptance.
    throw new Error(
      `${capability}: cannot safely merge this test-case suite; include the complete resulting suite in the change`,
    );
  }
  const usOrder = (section) => {
    const [, , number, letter] = JOURNEY_GROUP.exec(section.heading);
    return Number(number) + (letter ? letter.charCodeAt(0) / 1000 : 0);
  };
  const groups = [...currentGroups.values()]
    .sort((a, b) => usOrder(a) - usOrder(b))
    .map((section) => section.render ?? renderSection(section));
  const separator = [current, delta].some((doc) =>
    groupsOf(doc).some((section) => ruled.test(section.raw)),
  )
    ? "\n\n---\n\n"
    : "\n\n";
  const parts = [suiteHeader(current.header, delta.header)];
  const background = appendMissing(
    named(current, "Background"),
    named(delta, "Background"),
  );
  if (background) parts.push(`## Background\n\n${background}`);
  const closing = ruled.test(groupsOf(current).at(-1)?.raw ?? "")
    ? "\n\n---"
    : "";
  parts.push(
    `${groups.map((one) => one.replace(ruled, "")).join(separator)}${closing}`,
  );
  for (const name of SUITE_LISTS.slice(0, 2)) {
    const merged = mergeList(named(current, name), named(delta, name));
    if (merged) parts.push(`## ${name}\n\n${merged}`);
  }
  const reconciliation = mergeReconciliation(
    named(current, "Reconciliation"),
    named(delta, "Reconciliation"),
  );
  if (reconciliation) parts.push(`## Reconciliation\n\n${reconciliation}`);
  const outOfSuite = mergeList(
    named(current, "Out of suite"),
    named(delta, "Out of suite"),
  );
  if (outOfSuite) parts.push(`## Out of suite\n\n${outOfSuite}`);
  const merged = withDerivedStatus(`${parts.join("\n\n")}\n`, foldedOn);
  refuseRepeatedCases(
    merged,
    capability,
    "the merged suite",
    "give the new case the next unused TC number",
  );
  return merged;
}

function foldOne(
  durablePath,
  deltaText,
  capability,
  priorText = null,
  baseText = null,
) {
  const durableExists = existsSync(durablePath);
  let durable = durableExists ? readFileSync(durablePath, "utf8") : "";
  const original = durable;
  const delta = deltaSections(deltaText);
  if (!durableExists) durable = `# ${capability} Specification\n`;
  const deltaPurpose = sectionByName(delta, "Purpose");
  const existingPurpose = sectionByName(deltaSections(durable), "Purpose");
  if (!existingPurpose && !deltaPurpose)
    throw new Error(
      `${capability}: new durable spec needs a Purpose section before acceptance`,
    );
  durable = mergePurpose(
    durable,
    deltaPurpose,
    capability,
    priorText,
    baseText,
  );
  if (claimsFeatureSet(delta))
    durable = mergeFeatureSet(durable, deltaText, capability, priorText);
  const requirements = new Map(requirementBlocks(durable));
  const priorRequirements =
    priorText === null ? new Map() : requirementBlocks(priorText);
  const sameRequirement = (left, right) =>
    withoutTraceMarkers(left?.raw) === withoutTraceMarkers(right?.raw);
  for (const section of delta) {
    const kind = deltaKindOf(section.heading);
    if (!kind) continue;
    if (kind === "renamed") {
      for (const { from, to } of validatedRenamedPairs(section, capability)) {
        const replacement = deltaRequirementSections(section).find(
          (one) => one.name === to,
        )?.block;
        if (!requirements.has(from) || !replacement)
          throw new Error(`${capability}: cannot fold rename ${from} to ${to}`);
        if (
          priorText !== null &&
          !sameRequirement(requirements.get(from), priorRequirements.get(from))
        )
          throw new Error(
            `${capability}: accepted requirement ${from} changed since this amendment began; resolve the conflict before acceptance`,
          );
        requirements.delete(from);
        requirements.set(to, replacement);
      }
      continue;
    }
    for (const { name, block } of deltaRequirementSections(section)) {
      if (kind === "added" && requirements.has(name)) {
        if (
          priorText === null ||
          !priorRequirements.has(name) ||
          !sameRequirement(requirements.get(name), priorRequirements.get(name))
        )
          throw new Error(
            `${capability}: added requirement already exists or changed since the accepted baseline: ${name}`,
          );
        // A changed already-accepted requirement is an amendment to the pinned
        // contract. Replacing its prior text is safe only while that requirement
        // itself has not advanced independently.
      }
      if (
        (kind === "modified" || kind === "removed") &&
        !requirements.has(name)
      )
        throw new Error(
          `${capability}: ${kind} requirement does not exist: ${name}`,
        );
      if (
        priorText !== null &&
        (kind === "modified" || kind === "removed") &&
        !sameRequirement(requirements.get(name), priorRequirements.get(name))
      )
        throw new Error(
          `${capability}: accepted requirement ${name} changed since this amendment began; resolve the conflict before acceptance`,
        );
      if (kind === "removed") requirements.delete(name);
      else requirements.set(name, block);
    }
  }
  const body = [...requirements]
    .map(([name, block]) => renderRequirement(block, name))
    .join("\n\n");
  const span = sectionSpan(durable, "Requirements");
  if (span) {
    const lines = durable.split("\n");
    lines.splice(
      span.from,
      span.until - span.from,
      ...(body ? ["", body] : []),
    );
    durable = lines.join("\n").replace(/\n*$/, "\n");
  } else {
    durable = `${durable.replace(/\n*$/, "\n\n")}## Requirements\n\n${body}\n`;
  }
  const kept = new Set(
    [...durable.matchAll(TRACE_MARKER)].map((match) => match[1]),
  );
  for (const [name, block] of requirementBlocks(original))
    for (const [, id, scenario] of block.raw.matchAll(MARKED_SCENARIO))
      if (
        !kept.has(id) &&
        new RegExp(
          `^#### Scenario: ${RegExp.escape(scenario)}(\\s|$)`,
          "m",
        ).test(durable)
      )
        throw new Error(
          `${capability}: the fold drops trace marker ${id} from scenario ${scenario} in requirement ${name}; carry it in the delta`,
        );
  return durable;
}

/** The durable spec as it stood when the delta's Purpose last changed ("" if
 * it did not exist yet), so a first acceptance cannot replace a Purpose
 * another change wrote since. A rebase rewrites that commit onto newer main,
 * so after a rebase the check cannot see drift from before it. */
function durableWhenPurposeWritten(root, deltaPath, durablePath) {
  const skip = (why) => {
    console.warn(`${deltaPath}: Purpose drift not checked - ${why}`);
    return null;
  };
  const log = git(root, ["log", "--format=%H", "--", deltaPath])
    ?.split("\n")
    .filter(Boolean);
  if (!log?.length) return skip("the delta has no git history");
  const current = purposeOf(readFileSync(join(root, deltaPath), "utf8"));
  let written = null;
  for (const commit of log) {
    const text = textAt(root, commit, deltaPath);
    if (text === null || purposeOf(text) !== current) break;
    written = commit;
  }
  if (!written) return skip("its Purpose has uncommitted edits");
  if (written === log.at(-1)) {
    const shallow = git(root, ["rev-parse", "--is-shallow-repository"]);
    const followed = git(root, [
      "log",
      "--follow",
      "--format=%H",
      "--",
      deltaPath,
    ]);
    if (shallow?.trim() === "true")
      console.warn(
        `${deltaPath}: Purpose drift checked only from ${written}, the shallow history's edge`,
      );
    else if (
      followed &&
      followed.split("\n").filter(Boolean).length > log.length
    )
      console.warn(
        `${deltaPath}: Purpose drift checked only from ${written}, where the delta was renamed`,
      );
  }
  return textAt(root, written, durablePath) ?? "";
}

function contractOutputs(root, changeId, foldedOn) {
  const dir = join(root, "openspec", "changes", changeId);
  const deltas = walkFiles(root, join(dir, "specs"))
    .filter((path) => path.endsWith("/spec.md"))
    .sort();
  const outputs = new Map();
  const prior = acceptedSnapshots(root, changeId, "durable-result");
  for (const path of deltas) {
    const relativeCapability = path
      .slice(`openspec/changes/${changeId}/specs/`.length)
      .replace(/\/spec\.md$/, "");
    const target = durableFor(root, relativeCapability, "spec.md");
    const targetRel = relative(root, target).replaceAll("\\", "/");
    const priorText = prior.get(targetRel) ?? null;
    const folded = foldOne(
      target,
      readFileSync(join(root, path), "utf8"),
      relativeCapability,
      priorText,
      priorText ? null : durableWhenPurposeWritten(root, path, targetRel),
    );
    outputs.set(targetRel, folded);
    const sourceDir = dirname(join(root, path));
    for (const { name, source, dir } of companionsOf(
      sourceDir,
      relativeCapability,
    )) {
      const targetPath = durableFor(root, dir, name);
      const targetKey = relative(root, targetPath).replaceAll("\\", "/");
      if (outputs.has(targetKey)) continue;
      const currentText = existsSync(targetPath)
        ? readFileSync(targetPath, "utf8")
        : null;
      const sourceText = readFileSync(source, "utf8");
      const merged =
        name === "user-journeys.md"
          ? mergeJourneys(
              currentText,
              sourceText,
              changeId,
              relativeCapability,
              prior.get(targetKey),
            )
          : mergeSuite(currentText, sourceText, dir, foldedOn);
      outputs.set(targetKey, merged);
    }
  }
  return outputs;
}

function targetPathOf(changeId, deltaSpecPath, filename = "spec.md") {
  const capability = deltaSpecPath
    .slice(`openspec/changes/${changeId}/specs/`.length)
    .replace(/\/spec\.md$/, "");
  return `openspec/specs/${capability}/${filename}`;
}

/**
 * The accepted change declares the small part of the durable contract its
 * implementation owns. A claim records this list beside the store commit it
 * starts from, so an unrelated capability advance cannot make an archive
 * ambiguous. `anchors: []` deliberately means the file as a whole: journeys,
 * suites, and UI design have no requirement-level identity to compare.
 */
export function contractTargets(root, changeId) {
  const changeDir = join(root, "openspec", "changes", changeId);
  const targets = [];
  const deltas = walkFiles(root, join(changeDir, "specs"))
    .filter((path) => path.endsWith("/spec.md"))
    .sort();
  for (const deltaPath of deltas) {
    const deltaText = readFileSync(join(root, deltaPath), "utf8");
    const sections = deltaSections(deltaText);
    const anchors = new Set();
    if (sectionByName(sections, "Purpose")) anchors.add("Purpose");
    if (claimsFeatureSet(sections)) anchors.add("Feature set");
    for (const section of sections) {
      const kind = deltaKindOf(section.heading);
      if (!kind) continue;
      if (kind === "renamed") {
        for (const { from, to } of validatedRenamedPairs(section, deltaPath)) {
          anchors.add(`Requirement: ${from}`);
          anchors.add(`Requirement: ${to}`);
        }
        continue;
      }
      for (const { name } of deltaRequirementSections(section))
        anchors.add(`Requirement: ${name}`);
    }
    targets.push({
      path: targetPathOf(changeId, deltaPath),
      anchors: [...anchors].sort(),
    });
    const capability = deltaPath
      .slice(`openspec/changes/${changeId}/specs/`.length)
      .replace(/\/spec\.md$/, "");
    for (const { name, dir } of companionsOf(
      dirname(join(root, deltaPath)),
      capability,
    )) {
      const path = `openspec/specs/${dir}/${name}`;
      if (targets.some((one) => one.path === path)) continue;
      targets.push({ path, anchors: [] });
    }
  }
  if (existsSync(join(changeDir, "ui-design.md"))) {
    targets.push({
      path: `openspec/changes/${changeId}/ui-design.md`,
      anchors: [],
    });
  }
  return targets.sort((left, right) => left.path.localeCompare(right.path));
}

function validTargets(targets, changeId = null) {
  if (!Array.isArray(targets)) return false;
  const paths = new Set();
  for (const target of targets) {
    if (
      !target ||
      typeof target.path !== "string" ||
      target.path === "" ||
      !Array.isArray(target.anchors)
    )
      return false;
    const allowed =
      target.path.startsWith("openspec/specs/") ||
      target.path === `openspec/changes/${changeId}/ui-design.md`;
    if (
      paths.has(target.path) ||
      !allowed ||
      target.anchors.some(
        (anchor) => typeof anchor !== "string" || anchor.trim() === "",
      ) ||
      new Set(target.anchors).size !== target.anchors.length
    )
      return false;
    paths.add(target.path);
  }
  return true;
}

function sectionNamed(text, name) {
  const found = [];
  const visit = (sections) =>
    sections.forEach((section) => {
      if (section.heading === name) found.push(section);
      visit(section.children);
    });
  visit(outline(text));
  if (found.length !== 1) return null;
  return renderSection(found[0]);
}

/** The selected target content at one store revision. `null` also represents
 * a removed selected heading, which makes a removal observable at archive. */
export function targetContent(text, target) {
  if (text === null) return null;
  if (target.anchors.length === 0) return String(text);
  return JSON.stringify(
    target.anchors.map((anchor) => ({
      anchor,
      content: sectionNamed(String(text), anchor),
    })),
  );
}

export function contractTargetDiffs(targets, baselineText, currentText) {
  const differences = [];
  for (const target of targets) {
    const before = baselineText(target.path);
    const after = currentText(target.path);
    if (target.anchors.length === 0) {
      if (targetContent(before, target) !== targetContent(after, target))
        differences.push({ path: target.path, anchors: [] });
      continue;
    }
    for (const anchor of target.anchors) {
      const scoped = { ...target, anchors: [anchor] };
      if (targetContent(before, scoped) !== targetContent(after, scoped))
        differences.push({ path: target.path, anchors: [anchor] });
    }
  }
  return differences;
}

export function acceptanceReadiness(
  root,
  changeId,
  sections = linkedSections(root, changeId),
) {
  const dir = join(root, "openspec", "changes", changeId);
  const errors = [];
  const required = [
    "proposal.md",
    "decisions.md",
    "tasks.md",
    ".openspec.yaml",
  ];
  for (const file of required)
    if (!existsSync(join(dir, file)))
      errors.push(
        `required artifact is missing: openspec/changes/${changeId}/${file}`,
      );
  const record = existsSync(join(dir, ".openspec.yaml"))
    ? readFileSync(join(dir, ".openspec.yaml"), "utf8")
    : "";
  let manifest = {};
  try {
    manifest = YAML.parse(record) ?? {};
    if (
      manifest.awaiting &&
      Object.values(manifest.awaiting).some(
        (value) =>
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0),
      )
    )
      errors.push("the change still has an awaiting artifact");
  } catch {
    errors.push(".openspec.yaml cannot be parsed");
  }
  if (
    !existsSync(join(dir, "tech-design.md")) &&
    !/^design_waived:\s*\S/m.test(record)
  )
    errors.push(
      "tech-design.md or an explicit design waiver is required before acceptance",
    );
  const specDir = join(dir, "specs");
  const deltas = walkFiles(root, specDir).filter((path) =>
    path.endsWith("/spec.md"),
  );
  if (deltas.length === 0 && manifest.skip_specs !== true)
    errors.push("there are no delta specs to accept");
  for (const { file, reuse } of reusedInChange(root, changeId))
    errors.push(`${file}: ${describeReuse(reuse)}`);
  for (const path of deltas) {
    const capabilityDir = dirname(join(root, path));
    for (const file of ["user-journeys.md", "feature-tcs.md"]) {
      if (!existsSync(join(capabilityDir, file)))
        errors.push(
          `${path.replace(/\/spec\.md$/, `/${file}`)} is required before acceptance`,
        );
    }
    const suitePath = join(capabilityDir, "feature-tcs.md");
    if (existsSync(suitePath)) {
      const suite = readFileSync(suitePath, "utf8");
      const reconciliation = sectionSpan(suite, "Reconciliation");
      const body = reconciliation
        ? suite
            .split("\n")
            .slice(reconciliation.from, reconciliation.until)
            .join("\n")
            .replace(/<!--[\s\S]*?-->/g, "")
            .trim()
        : "";
      const tableRows = body
        .split("\n")
        .filter(
          (line) =>
            /^\s*\|/.test(line) &&
            !/^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(line),
        );
      const incompleteTable =
        tableRows.length === 1 ||
        tableRows.slice(1).some((line) =>
          line
            .split("|")
            .slice(1, -1)
            .some((cell) => cell.trim() === ""),
        );
      if (
        !reconciliation ||
        body === "" ||
        incompleteTable ||
        /^\s*\|\s*<!--/m.test(
          suite
            .split("\n")
            .slice(reconciliation.from, reconciliation.until)
            .join("\n"),
        )
      )
        errors.push(
          `${relative(root, suitePath)} needs a completed ## Reconciliation with dispositions before acceptance`,
        );
    }
  }
  const sourcePaths = changeContractPaths(root, changeId);
  const scoped = sourcePaths.map((path) => [
    path,
    canonicalPlanningContent(path, readFileSync(join(root, path), "utf8")),
  ]);
  for (const { path, content, error } of sections)
    if (error) errors.push(error);
    else scoped.push([path, content]);
  const unresolved = (content) => {
    const visible = content
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "")
      .replace(/`[^`]*`/g, "");
    return /(?:\bTBC\b|❓)/iu.test(visible);
  };
  for (const [path, content] of scoped)
    if (unresolved(content))
      errors.push(`${path} still carries an unresolved TBC or ❓ decision`);
  const decisionsPath = join(dir, "decisions.md");
  if (existsSync(decisionsPath)) {
    const decisions = readFileSync(decisionsPath, "utf8");
    const raised = sectionSpan(decisions, "Raised");
    if (raised) {
      const body = decisions
        .split("\n")
        .slice(raised.from, raised.until)
        .join("\n");
      const rows = body
        .split("\n")
        .filter(
          (line) =>
            /^\s*\|/.test(line) && !/^\s*\|\s*(?:Capability|---)/.test(line),
        );
      if (
        rows.some(
          (line) =>
            /<!--|(?:\bTBC\b|❓)/iu.test(line) ||
            line
              .split("|")
              .slice(1, -1)
              .some((cell) => cell.trim() === ""),
        )
      )
        errors.push("decisions.md ## Raised still has an unanswered row");
    }
  }
  return errors;
}

function baselineOf(root, outputs) {
  return [...outputs.keys()].sort().map((path) => ({
    path,
    sha256: existsSync(join(root, path))
      ? HASH(readFileSync(join(root, path)))
      : null,
  }));
}

export function baselineFingerprint(baseline) {
  return HASH(json([...baseline].sort((a, b) => a.path.localeCompare(b.path))));
}

function fingerprintArtifacts(root, changeId, outputs, sections) {
  const sourcePaths = changeContractPaths(root, changeId);
  const snapshots = [];
  const artifacts = sourcePaths.map((path) => ({
    path,
    sha256: HASH(
      canonicalPlanningContent(path, readFileSync(join(root, path), "utf8")),
    ),
    role: "change-input",
  }));
  for (const path of sourcePaths)
    snapshots.push({
      path,
      role: "change-input",
      content: readFileSync(join(root, path), "utf8"),
    });
  for (const [path, content] of outputs) {
    artifacts.push({
      path,
      sha256: HASH(canonicalPlanningContent(path, content)),
      role: "durable-result",
    });
    snapshots.push({ path, role: "durable-result", content });
  }
  for (const { path, content } of sections) {
    artifacts.push({ path, sha256: HASH(content), role: "prd-source" });
    snapshots.push({ path, role: "prd-source", content });
  }
  return {
    artifacts: artifacts.sort(
      (a, b) => a.path.localeCompare(b.path) || a.role.localeCompare(b.role),
    ),
    snapshots: snapshots.sort(
      (a, b) => a.path.localeCompare(b.path) || a.role.localeCompare(b.role),
    ),
  };
}

export function prepareAcceptance(
  root,
  changeId,
  { foldedOn = new Date().toISOString().slice(0, 10) } = {},
) {
  const sections = linkedSections(root, changeId);
  const readiness = acceptanceReadiness(root, changeId, sections);
  if (readiness.length > 0)
    throw new Error(
      `Acceptance is blocked:\n${readiness.map((line) => `- ${line}`).join("\n")}`,
    );
  const outputs = contractOutputs(root, changeId, foldedOn);
  const { artifacts, snapshots } = fingerprintArtifacts(
    root,
    changeId,
    outputs,
    sections,
  );
  const targets = contractTargets(root, changeId);
  const identity = {
    version: 2,
    change: changeId,
    artifacts,
    contractTargets: targets,
  };
  return {
    root,
    changeId,
    outputs,
    baseline: baselineOf(root, outputs),
    baselineFingerprint: baselineFingerprint(baselineOf(root, outputs)),
    artifacts,
    snapshots,
    contractTargets: targets,
    fingerprint: HASH(json(identity)),
  };
}

/** A copy of the store that holds the fold, beside links to the rest of it,
 *  for the checks that read a whole store. The caller removes it. */
function foldedTree(prepared) {
  const tree = mkdtempSync(join(tmpdir(), "folded-store-"));
  for (const entry of readdirSync(prepared.root))
    if (entry === "openspec")
      cpSync(join(prepared.root, entry), join(tree, entry), {
        recursive: true,
      });
    else symlinkSync(join(prepared.root, entry), join(tree, entry));
  for (const [path, content] of prepared.outputs) {
    mkdirSync(dirname(join(tree, path)), { recursive: true });
    writeFileSync(join(tree, path), content);
  }
  return tree;
}

/** `pnpm run check:manual` prints a `FAIL  <rule title>` heading over each
 *  rule's rows; one failure per rule, named by its key. */
function manualFailures(output) {
  const found = [];
  let current = null;
  for (const line of output.split("\n")) {
    const head = /^FAIL {2}(.+)$/.exec(line);
    if (head) {
      current = {
        rule: `check:manual/${RULES.find((rule) => rule.title === head[1])?.key ?? head[1]}`,
        level: "fail",
        detail: [],
      };
      found.push(current);
    } else if (current && /^ {6}\S/.test(line))
      current.detail.push(line.trim());
    else current = null;
  }
  return found.map((one) => ({ ...one, detail: one.detail.join("\n") }));
}

/** Every check `spec:accept` holds a change to, run on the fold before
 *  anything is written, so `accept:preflight` and `spec:accept` refuse the
 *  same changes: `validate:changes`, the fold's own checks, `tcs:validate`
 *  on a copy of the store that holds the fold, the trace markers of the
 *  files the fold writes, and `check:manual` on that copy with the
 *  acceptance recorded - the store-wide rules (`overlap`, `issued`) that a
 *  change accepted beside another one breaks. Nothing stops at the first
 *  finding. Returns `{ failures, warnings }`, each `{ rule, detail }`.
 *  `command(args, cwd)` runs `pnpm` with `args`. */
export function acceptanceGate(prepared, command) {
  const failures = [];
  const warnings = [];
  const refuse = (rule, detail) => failures.push({ rule, detail });
  const run = (rule, args) => {
    const result = command(args, prepared.root);
    if (result.status === 0) return null;
    return `${result.stdout ?? ""}${result.stderr ?? ""}`.trim() || rule;
  };
  const changes = run("validate:changes", [
    "run",
    "validate:changes",
    prepared.changeId,
  ]);
  if (changes) refuse("validate:changes", changes);
  for (const finding of foldChecks(prepared))
    (finding.level === "warn" ? warnings : failures).push(finding);
  const tree = foldedTree(prepared);
  try {
    const suites = run("tcs:validate", [
      "run",
      "tcs:validate",
      "--root",
      tree,
      "--require-suites",
    ]);
    if (suites) refuse("tcs:validate", suites);
    const markers = parseTraceGraph({ storeRoot: tree }).issues.filter(
      (issue) =>
        issue.code === "marker-adjacency" &&
        prepared.outputs.has(relative(tree, issue.file)),
    );
    if (markers.length > 0)
      refuse(
        "trace-markers",
        markers
          .map(
            (issue) =>
              `${relative(tree, issue.file)}:${issue.line} [${issue.code}] ${issue.message}`,
          )
          .join("\n"),
      );
    try {
      const recorded = join(
        tree,
        "openspec",
        "changes",
        prepared.changeId,
        "acceptance.json",
      );
      writeAcceptance(tree, prepared, {
        reviewedBy: "accept:preflight",
        supersedes: existsSync(recorded)
          ? JSON.parse(readFileSync(recorded, "utf8")).fingerprint
          : null,
      });
    } catch (error) {
      refuse("acceptance", error.message);
    }
    const manual = command(["run", "check:manual", tree], prepared.root);
    if (manual.status !== 0) {
      const output = `${manual.stdout ?? ""}${manual.stderr ?? ""}`;
      const named = manualFailures(output);
      if (named.length > 0) failures.push(...named);
      else refuse("check:manual", output.trim() || "check:manual failed");
    }
  } finally {
    rmSync(tree, { recursive: true, force: true });
  }
  return { failures, warnings };
}

export function formatFindings(findings) {
  return findings
    .map((one) => `- [${one.rule}] ${one.detail.replaceAll("\n", "\n    ")}`)
    .join("\n");
}

export function runPnpm(args, cwd) {
  return spawnSync("pnpm", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: Infinity,
  });
}

function acceptedChangeDir(root, changeId) {
  const active = join(root, "openspec", "changes", changeId);
  if (existsSync(join(active, "acceptance.json"))) return active;
  const archive = join(root, "openspec", "changes", "archive");
  if (!existsSync(archive)) return active;
  const match = readdirSync(archive, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && entry.name.endsWith(`-${changeId}`),
    )
    .map((entry) => join(archive, entry.name))
    .find((path) => existsSync(join(path, "acceptance.json")));
  return match ?? active;
}

export function verifyAcceptance(
  root,
  changeId,
  { requireImplementation = false, readFile = null } = {},
) {
  const dir = acceptedChangeDir(root, changeId);
  const read = (path) => {
    if (readFile) return readFile(relative(root, path).replaceAll("\\", "/"));
    return existsSync(path) ? readFileSync(path) : null;
  };
  const currentPath = join(dir, "acceptance.json");
  const currentBytes = read(currentPath);
  if (currentBytes === null)
    return {
      ok: false,
      errors: [`${changeId} has no acceptance.json`],
      acceptance: null,
      fingerprint: null,
    };
  let acceptance;
  try {
    acceptance = JSON.parse(String(currentBytes));
  } catch {
    return {
      ok: false,
      errors: ["acceptance.json is not valid JSON"],
      acceptance: null,
      fingerprint: null,
    };
  }
  const errors = [];
  if (
    ![1, 2].includes(acceptance.version) ||
    acceptance.change !== changeId ||
    typeof acceptance.fingerprint !== "string"
  )
    errors.push("acceptance.json has an unsupported or mismatched identity");
  if (!/^[a-f0-9]{64}$/.test(acceptance.baseline ?? ""))
    errors.push("acceptance.json has an invalid review baseline");
  if (
    !Array.isArray(acceptance.artifacts) ||
    acceptance.artifacts.some(
      (artifact) =>
        typeof artifact.path !== "string" ||
        !/^[a-f0-9]{64}$/.test(artifact.sha256 ?? "") ||
        !["change-input", "durable-result", "prd-source"].includes(
          artifact.role,
        ),
    )
  )
    errors.push("acceptance artifact manifest is malformed");
  if (
    acceptance.version === 2 &&
    !validTargets(acceptance.contractTargets, changeId)
  )
    errors.push("acceptance.json has an invalid contract target list");
  const identity =
    acceptance.version === 2
      ? {
          version: 2,
          change: changeId,
          artifacts: acceptance.artifacts,
          contractTargets: acceptance.contractTargets,
        }
      : { version: 1, change: changeId, artifacts: acceptance.artifacts };
  const calculated = HASH(json(identity));
  if (calculated !== acceptance.fingerprint)
    errors.push("acceptance fingerprint does not match its artifact manifest");
  const historyPath = join(dir, "acceptance", `${acceptance.fingerprint}.json`);
  const historyBytes = read(historyPath);
  if (historyBytes === null)
    errors.push("immutable acceptance history record is missing");
  else if (String(historyBytes) !== String(currentBytes))
    errors.push("acceptance.json differs from its immutable history record");
  const snapshotPath = join(
    dir,
    "acceptance",
    `${acceptance.fingerprint}.snapshots.json`,
  );
  const snapshotBytes = read(snapshotPath);
  if (snapshotBytes === null)
    errors.push("immutable acceptance artifact snapshots are missing");
  else {
    try {
      const saved = JSON.parse(String(snapshotBytes));
      const byKey = new Map(
        (saved.files ?? []).map((entry) => [
          `${entry.path}\0${entry.role}`,
          entry,
        ]),
      );
      for (const artifact of acceptance.artifacts ?? []) {
        const snapshot = byKey.get(`${artifact.path}\0${artifact.role}`);
        if (
          !snapshot ||
          snapshot.sha256 !== artifact.sha256 ||
          HASH(
            canonicalPlanningContent(
              artifact.path,
              Buffer.from(snapshot.contentBase64, "base64").toString("utf8"),
            ),
          ) !== artifact.sha256
        )
          errors.push(
            `immutable snapshot is missing or invalid: ${artifact.path}`,
          );
      }
    } catch {
      errors.push("immutable acceptance artifact snapshots are not valid JSON");
    }
  }
  for (const artifact of acceptance.artifacts ?? []) {
    const absolute = resolve(root, artifact.path);
    if (absolute !== resolve(root) && !absolute.startsWith(`${resolve(root)}/`))
      errors.push(`accepted artifact path escapes the store: ${artifact.path}`);
  }
  // v2 snapshots are provenance, not a lock on active planning artifacts.
  // Archive compares the claimed durable-contract targets instead. Retain the
  // v1 check so changes already in flight keep their original verification.
  if (acceptance.version === 1)
    for (const artifact of acceptance.artifacts ?? []) {
      if (artifact.role !== "change-input") continue;
      let bytes = read(join(root, artifact.path));
      if (
        bytes === null &&
        dir.includes(`${join("openspec", "changes", "archive")}`)
      ) {
        const archivedPrefix = relative(root, dir).replaceAll("\\", "/");
        const suffix = artifact.path.replace(
          `openspec/changes/${changeId}/`,
          "",
        );
        bytes = read(join(root, archivedPrefix, suffix));
      }
      if (
        bytes === null ||
        HASH(canonicalPlanningContent(artifact.path, String(bytes))) !==
          artifact.sha256
      )
        errors.push(`accepted input changed: ${artifact.path}`);
    }
  let implementation = null;
  let implementationAcceptance = acceptance;
  if (requireImplementation) {
    const implementationPath = join(dir, "implementation.json");
    const implementationBytes = read(implementationPath);
    if (implementationBytes === null)
      errors.push("implementation.json is required before archive");
    else {
      try {
        implementation = JSON.parse(String(implementationBytes));
        const implementationFingerprint =
          implementation.version === 2
            ? implementation.acceptance?.fingerprint
            : implementation.fingerprint;
        if (
          ![1, 2].includes(implementation.version) ||
          typeof implementationFingerprint !== "string"
        )
          errors.push(
            "implementation.json does not attest an accepted fingerprint",
          );
        if (implementationFingerprint !== acceptance.fingerprint) {
          const historicalBytes = read(
            join(dir, "acceptance", `${implementationFingerprint}.json`),
          );
          try {
            implementationAcceptance = JSON.parse(String(historicalBytes));
            const historicalIdentity =
              implementationAcceptance.version === 2
                ? {
                    version: 2,
                    change: implementationAcceptance.change,
                    artifacts: implementationAcceptance.artifacts,
                    contractTargets: implementationAcceptance.contractTargets,
                  }
                : {
                    version: 1,
                    change: implementationAcceptance.change,
                    artifacts: implementationAcceptance.artifacts,
                  };
            const validHistorical =
              [1, 2].includes(implementationAcceptance.version) &&
              implementationAcceptance.change === changeId &&
              implementationAcceptance.fingerprint ===
                implementationFingerprint &&
              (implementationAcceptance.version === 1 ||
                validTargets(
                  implementationAcceptance.contractTargets,
                  changeId,
                )) &&
              HASH(json(historicalIdentity)) === implementationFingerprint;
            if (!validHistorical) {
              errors.push(
                "implementation.json names an invalid historical acceptance record",
              );
            }
          } catch {
            errors.push(
              "implementation.json does not attest an available current or historical acceptance",
            );
          }
        }
        if (implementation.version === 2) {
          const baseline = implementation.contractBaseline;
          const validBaseline =
            baseline &&
            typeof baseline.repository === "string" &&
            baseline.repository.trim() !== "" &&
            /^[0-9a-f]{40}$/i.test(baseline.commit ?? "") &&
            typeof baseline.capturedAt === "string" &&
            !Number.isNaN(Date.parse(baseline.capturedAt)) &&
            validTargets(baseline.targets, changeId) &&
            implementationAcceptance.version === 2 &&
            JSON.stringify(baseline.targets) ===
              JSON.stringify(implementationAcceptance.contractTargets);
          if (!validBaseline)
            errors.push(
              "implementation.json has no valid claimed contract baseline for the accepted target scope",
            );
        }
        if (
          !Array.isArray(implementation.repositories) ||
          implementation.repositories.length === 0
        )
          errors.push(
            "implementation.json must name at least one verified repository",
          );
        for (const repository of implementation.repositories ?? []) {
          const noRuntime =
            Array.isArray(repository.components) &&
            repository.components.length === 0;
          const validNoRuntime =
            !noRuntime ||
            (repository.scope === "no-runtime" &&
              typeof repository.reason === "string" &&
              repository.reason.trim() !== "");
          if (
            !repository.repository ||
            !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(repository.commit ?? "") ||
            !Array.isArray(repository.components) ||
            repository.components.some(
              (component) =>
                typeof component !== "string" || component.trim() === "",
            ) ||
            !validNoRuntime
          )
            errors.push(
              "each implementation repository needs a full commit and verified components; components: [] requires scope: no-runtime and a non-empty reason",
            );
        }
        for (const key of ["withdraws", "replaces"]) {
          if (
            implementation[key] !== undefined &&
            (!Array.isArray(implementation[key]) ||
              implementation[key].some(
                (id) => typeof id !== "string" || id.trim() === "",
              ))
          )
            errors.push(
              `implementation.json ${key} must be an array of change IDs`,
            );
        }
      } catch {
        errors.push("implementation.json is not valid JSON");
      }
    }
  }
  return {
    ok: errors.length === 0,
    errors,
    acceptance,
    implementation,
    implementationAcceptance,
    fingerprint: acceptance.fingerprint,
  };
}

export function writeAcceptance(
  root,
  prepared,
  { reviewedBy, supersedes = null },
) {
  if (!reviewedBy?.trim())
    throw new Error("--reviewed-by needs the reviewer’s name");
  const dir = join(root, "openspec", "changes", prepared.changeId);
  const current = join(dir, "acceptance.json");
  if (existsSync(current)) {
    const prior = JSON.parse(readFileSync(current, "utf8"));
    if (
      prior.fingerprint !== prepared.fingerprint &&
      supersedes !== prior.fingerprint
    ) {
      throw new Error(
        `acceptance changed; pass --supersedes ${prior.fingerprint} to preserve the prior contract explicitly`,
      );
    }
    if (prior.fingerprint === prepared.fingerprint)
      throw new Error("this exact contract is already accepted");
  } else if (supersedes)
    throw new Error("--supersedes was supplied but no prior acceptance exists");
  const now = new Date().toISOString();
  const acceptance = {
    version: 2,
    change: prepared.changeId,
    baseline: prepared.baselineFingerprint,
    fingerprint: prepared.fingerprint,
    reviewedBy: reviewedBy.trim(),
    acceptedAt: now,
    ...(supersedes ? { supersedes } : {}),
    artifacts: prepared.artifacts,
    contractTargets: prepared.contractTargets,
  };
  const history = join(dir, "acceptance", `${prepared.fingerprint}.json`);
  const snapshotsFile = join(
    dir,
    "acceptance",
    `${prepared.fingerprint}.snapshots.json`,
  );
  mkdirSync(dirname(history), { recursive: true });
  if (existsSync(history) || existsSync(snapshotsFile))
    throw new Error(
      `acceptance history already exists for ${prepared.fingerprint}`,
    );
  const snapshots = {
    fingerprint: prepared.fingerprint,
    files: prepared.snapshots.map((entry) => ({
      path: entry.path,
      role: entry.role,
      sha256: prepared.artifacts.find(
        (artifact) =>
          artifact.path === entry.path && artifact.role === entry.role,
      ).sha256,
      contentBase64: Buffer.from(entry.content, "utf8").toString("base64"),
    })),
  };
  writeFileSync(snapshotsFile, json(snapshots), { flag: "wx" });
  writeFileSync(history, json(acceptance), { flag: "wx" });
  writeFileSync(current, json(acceptance));
  return acceptance;
}

export function acceptChange(
  root,
  changeId,
  { reviewedBy, expectedBaseline, supersedes = null, runCommand = null } = {},
) {
  const prepared = prepareAcceptance(root, changeId);
  if (!expectedBaseline)
    throw new Error(
      "--baseline from accept:preflight is required to prevent folding against a changed durable contract",
    );
  if (prepared.baselineFingerprint !== expectedBaseline)
    throw new Error(
      `durable baseline changed since preflight (now ${prepared.baselineFingerprint}); run accept:preflight again and review the result`,
    );
  const backups = new Map();
  const changeDir = join(root, "openspec", "changes", changeId);
  const record = join(changeDir, "acceptance.json");
  const history = join(changeDir, "acceptance", `${prepared.fingerprint}.json`);
  const snapshots = join(
    changeDir,
    "acceptance",
    `${prepared.fingerprint}.snapshots.json`,
  );
  const preserve = (path) => {
    if (!backups.has(path))
      backups.set(path, existsSync(path) ? readFileSync(path) : null);
  };
  const command = (args) => (runCommand ?? runPnpm)(args, root);
  const validate = (args, label) => {
    const result = command(args);
    if (result.status !== 0)
      throw new Error(
        `${label} refused acceptance:\n${result.stdout ?? ""}${result.stderr ?? ""}`,
      );
  };
  try {
    const { failures } = acceptanceGate(prepared, (args) => command(args));
    if (failures.length > 0)
      throw new Error(`Acceptance refused:\n${formatFindings(failures)}`);
    for (const [path, content] of prepared.outputs) {
      const target = join(root, path);
      preserve(target);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    preserve(record);
    preserve(history);
    preserve(snapshots);
    const accepted = writeAcceptance(root, prepared, {
      reviewedBy,
      supersedes,
    });
    validate(["check:manual"], "check:manual after fold");
    validate(
      ["run", "validate:changes", changeId],
      "validate:changes after acceptance",
    );
    return accepted;
  } catch (error) {
    for (const [path, content] of [...backups].reverse()) {
      if (content === null) rmSync(path, { force: true });
      else writeFileSync(path, content);
    }
    throw error;
  }
}

export {
  contractOutputs,
  json as prettyJson,
  mergeFeatureSet,
  mergeSuite,
  requirementBlocks,
};
