import { existsSync } from "node:fs";
import { join } from "node:path";
import type {
  Journey,
  Requirement,
  Scenario,
  SpecEntry,
  TestCase,
  TestCaseStatus,
  TestSuiteStatus,
} from "../api/types.ts";
import {
  featureSuitePath,
  readText,
  readTextIfExists,
  StoreFileError,
  storePath,
  subdirectories,
  toItemError,
} from "./disk.mts";
import type { GitIndex } from "./git.mts";
import { findSection, outline, type Section } from "./markdown.mts";

/** Disk shape is the taxonomy. A directory holding `spec.md` is a capability;
 * one holding only capability directories is the product they belong to. A
 * directory that mixes the two is a layer rather than a product — `shared`
 * groups `auth/*` and `ui/*` while carrying the platform-wide formats bare,
 * because those belong to no group smaller than everything — so its bare
 * capabilities are topics and its grouping children are read as products.
 * That reads `openspec/specs/<product>/<domain>/<capability>` and the shallower
 * `openspec/specs/<layer>/<topic>` off the same walk. */
export type SpecShape = {
  products: string[];
  topics: string[];
  /** Spec id → the store-relative directory holding its `spec.md`. */
  dirs: Map<string, string>;
};

const REQUIREMENT = "Requirement:";
const SCENARIO_ID = /[a-z0-9][a-z0-9-]*-SC-\d+/g;
const SCENARIO_HEADING =
  /^Scenario:\s*(?:([a-z0-9][a-z0-9-]*-SC-\d+)\s+-\s+)?(.+)$/;
const JOURNEY_HEADING = /^([a-z0-9][a-z0-9-]*-US-\d+):\s*(.+)$/;
/** A case id is journey-scoped, `<capability>-US<n>-TC<m>-<v>`
 * (`docs/governance/specs-to-test-cases.md`, Naming). Older suites still
 * carry the hyphenated `-US-<n>-TC-<m>` and the flat `<capability>-TC-<n>`,
 * and both stay readable: an issued id is permanent, so a suite is never
 * renumbered to a newer shape. */
const CASE_HEADING =
  /^([a-z0-9][a-z0-9-]*?-(?:US-?\d+-)?TC-?\d+(?:-\d+)?):\s*(.+)$/;
/** The anchor a scenario serves, on its own line under the heading and above
 * `**GIVEN**` / `**WHEN**`. Machine-read up to the first dash; the prose after
 * it is for a human. The anchor is a journey id, or a `## Feature set` root group
 * name matched verbatim where nobody walks the capability. It sits above the
 * GIVEN/WHEN/THEN lines deliberately, so editing its prose never reads as a
 * behaviour change. */
const SERVES = /^\s*(?:[-*]\s+)?\*\*Serves:\*\*\s*(.+?)\s*$/m;
/** A `## Feature set` root group: a top-level bullet, its children indented
 * under it. The group name is the anchor; leaves carry no ids and are free to
 * be reworded. */
const FEATURE_GROUP = /^[-*]\s+(?:\*\*)?(.+?)(?:\*\*)?\s*$/;
/** The one line a journeys file holds in place of journeys when no end user
 * reaches the capability on its own (`openspec/config.yaml`,
 * `rules.user-journeys`): a policy, a package contract, a convention. */
const WALKED_BY_NOBODY = /^\*\*Walked by:\*\*\s+nobody\b/m;
const TRACE = /^\s*(?:[-*]\s+)?\*\*Trace:\*\*(.*)$/m;
/** What a `**Trace:**` names: the journey the case walks, in the spec's
 * canonical `-US-<n>` form. A scenario id is the older shape, and still
 * resolves — the suite beside a spec that predates journeys traces those. */
const TRACE_ID = /[a-z0-9][a-z0-9-]*-(?:US|SC)-\d+/g;
/** The file's own status sits at column 0 under the title; a case's is a
 * bullet in its properties list. */
const SUITE_STATUS = /^\*\*Status:\*\*\s*(.+?)\s*$/m;
const CASE_STATUS = /^\s*(?:[-*]\s+)?\*\*Status:\*\*\s*(.+?)\s*$/m;
/** Derived from the cases, never chosen: every case `draft` is
 * `pending-review`, a first verdict makes it `in-review`, and no `draft`
 * left makes it `approved`. */
const SUITE_STATUSES = new Set(["pending-review", "in-review", "approved"]);
const CASE_STATUSES = new Set(["draft", "actual", "deprecated"]);
/** The scenarios a suite deliberately leaves uncovered: a labelled list at
 * column 0, inline after the label or as bullets beneath it. */
const OUT_OF_SUITE = /^\*\*Out of suite:\*\*(.*)$/;
const BULLET = /^\s*[-*]\s+/;

export function discoverSpecs(root: string): SpecShape {
  const shape: SpecShape = { products: [], topics: [], dirs: new Map() };
  collect(root, join(root, "openspec", "specs"), [], shape, true);
  shape.products.sort();
  shape.topics.sort();
  return shape;
}

/** Reads `dir`'s children, filing each capability under the product that owns
 * it. `layer` marks a directory that cannot itself be a product — the specs
 * root, and any directory that groups as well as specifies — whose bare
 * capabilities are topics instead. */
function collect(
  root: string,
  dir: string,
  trail: string[],
  shape: SpecShape,
  layer: boolean,
): void {
  const children = subdirectories(dir).map((name) => ({
    name,
    path: join(dir, name),
    capability: existsSync(join(dir, name, "spec.md")),
  }));
  const capabilities = children.filter((child) => child.capability);
  const groups = children.filter((child) => !child.capability);
  // A directory that only specifies is the product its capabilities belong to;
  // one that also groups is a layer, and so is the root.
  const product = !layer && groups.length === 0 && capabilities.length > 0;
  if (product) shape.products.push(trail.join("/"));

  for (const child of capabilities) {
    const id = [...trail, child.name].join("/");
    shape.dirs.set(id, storePath(root, child.path));
    if (!product) shape.topics.push(id);
  }
  for (const child of groups) {
    collect(root, child.path, [...trail, child.name], shape, false);
  }
}

export function readSpecs(root: string, git: GitIndex): SpecEntry[] {
  const shape = discoverSpecs(root);
  return [...shape.dirs.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([id, dir]) => readSpec(root, id, dir, git));
}

function readSpec(
  root: string,
  id: string,
  dir: string,
  git: GitIndex,
): SpecEntry {
  const specPath = `${dir}/spec.md`;
  const entry: SpecEntry = { id, title: id, purpose: "", requirements: [] };
  const lastCommit = git.commitOf(specPath);
  if (lastCommit) entry.lastCommit = lastCommit;

  try {
    fillSpec(entry, readText(join(root, specPath)));
  } catch (cause) {
    entry.error = toItemError(specPath, cause);
  }

  // The journeys are their own file beside the spec, so a capability nobody
  // walks — a policy, a package contract — says so there in place of the
  // stories, and a malformed file cannot blank the requirements the whole
  // store reads. A missing file is `pnpm check:manual`'s to name.
  const journeysPath = `${dir}/user-journeys.md`;
  const journeys = readTextIfExists(join(root, journeysPath));
  if (journeys !== undefined) {
    try {
      entry.journeys = readJourneys(journeys);
      if (walkedByNobody(journeys)) entry.unwalked = true;
    } catch (cause) {
      entry.journeysError = toItemError(journeysPath, cause);
    }
  }

  // The suite has its own channel: a suite nobody can parse is QA's file, and
  // hanging it on the spec would blank the engineering contract on every page
  // that embeds it — and blind every rule that reads requirements.
  const casesPath = featureSuitePath(root, dir);
  if (casesPath !== undefined) {
    try {
      const suite = readTestCases(readText(join(root, casesPath)));
      entry.testCases = suite.cases;
      entry.testCasesStatus = suite.status;
      if (suite.outOfSuite.length > 0) entry.outOfSuite = suite.outOfSuite;
    } catch (cause) {
      entry.testCasesError = toItemError(casesPath, cause);
    }
  }
  return entry;
}

/** Fills in place so a malformed tail still ships the head that parsed. */
function fillSpec(entry: SpecEntry, text: string): void {
  const roots = outline(text);
  const head = roots[0];
  if (head?.level !== 1) {
    throw new StoreFileError(1, "spec needs a `# ` title on its first heading");
  }
  entry.title = head.heading;

  const sections = head.children;
  const purpose = findSection(sections, "Purpose");
  if (!purpose) throw new StoreFileError(head.line, "spec has no `## Purpose`");
  entry.purpose = purpose.body;

  const featureSet = findSection(sections, "Feature set");
  if (featureSet) {
    entry.featureSet = featureSet.body;
    entry.featureGroups = featureGroups(featureSet.body);
  }

  const requirements = findSection(sections, "Requirements");
  if (!requirements) {
    throw new StoreFileError(head.line, "spec has no `## Requirements`");
  }
  entry.requirements = requirements.children.map(readRequirement);
  refuseRepeats(
    "scenario",
    issuedIn(
      requirements.children.flatMap((one) => one.children),
      SCENARIO_HEADING,
    ),
  );
}

/** The permanent id each of these sections heads a block with, in file
 * order — the blocks that do not carry one are not issuing anything. */
function issuedIn(
  sections: Section[],
  heading: RegExp,
): { id: string; line: number }[] {
  return sections.flatMap((section) => {
    const id = heading.exec(section.heading)?.[1];
    return id === undefined ? [] : [{ id, line: section.line }];
  });
}

/** An id is issued once, ever. A file that issues one twice splits a
 * scenario, journey or case into two things wearing the same name — the ref
 * resolves to one and the anchor lands on the other — so it is refused
 * where it was written rather than rendered twice. */
function refuseRepeats(
  kind: string,
  issued: { id: string; line: number }[],
): void {
  const seen = new Map<string, number>();
  for (const one of issued) {
    const first = seen.get(one.id);
    if (first !== undefined) {
      throw new StoreFileError(
        one.line,
        `${kind} \`${one.id}\` is issued twice, at line ${first} and line ${one.line} — an id names one thing forever`,
      );
    }
    seen.set(one.id, one.line);
  }
}

export function readJourney(section: Section): Journey {
  const match = JOURNEY_HEADING.exec(section.heading);
  if (!match) {
    throw new StoreFileError(
      section.line,
      "a journey heading is `### <capability>-US-<n>: <title>`",
    );
  }
  return { id: match[1], title: match[2], text: section.body.trimEnd() };
}

/** The root group names of a `## Feature set`, in file order. Only column-0
 * bullets are groups; an indented bullet is a leaf, and a leaf is never an
 * anchor. */
export function featureGroups(body: string): string[] {
  const groups: string[] = [];
  for (const line of body.split("\n")) {
    if (/^\s/.test(line)) continue;
    const match = FEATURE_GROUP.exec(line);
    if (!match) continue;
    const name = match[1].replace(/:.*$/, "").trim();
    if (name) groups.push(name);
  }
  return [...new Set(groups)];
}

/** The anchors a scenario serves, in the order written. The prose after the
 * first dash is a human's and is dropped.
 *
 * More than one is allowed, comma-separated, because a scenario is a rule and a
 * rule can sit on several paths — a refusal reached from two journeys is one
 * rule, not two. A test case is the other shape: one case is one walk, so a
 * feature case still traces one anchor. The old `Accepted by` lists were
 * already many-to-many and 16 scenarios used it; a single anchor could not hold
 * them. */
export function servedAnchors(body: string): string[] {
  const match = SERVES.exec(body);
  if (!match) return [];
  return anchorsIn(match[1]);
}

/** The prose after the anchor's dash — what the walk was. The anchors before it
 * are machine-read; this half is written for a reader, and is read back only so
 * a check can refuse a line that repeats the anchor instead of saying anything
 * the anchor did not. */
export function servedProse(body: string): string | undefined {
  const match = SERVES.exec(body);
  if (!match) return undefined;
  const parts = match[1].split(/\s+[-\u2013\u2014]\s+/);
  if (parts.length < 2) return undefined;
  const prose = parts.slice(1).join(" - ").trim();
  return prose || undefined;
}

/** The anchors one `**Serves:**` or `**Trace:**` line names: everything before
 * the prose dash, read as code spans when it holds any and as one bare name
 * when it does not.
 *
 * Several anchors are written as code spans because a feature set group name
 * may hold a comma of its own - `Derived, never written` is one - and
 * splitting on commas would cut it in half. A lone anchor needs no span. */
function anchorsIn(line: string): string[] {
  const head = line.split(/\s+[-\u2013\u2014]\s+/)[0];
  const spans = [...head.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  const found = spans.length > 0 ? spans : [head.trim()];
  return [...new Set(found.filter(Boolean))];
}

/** The headings that hold journeys, in the order a file writes them. A durable
 * file carries `## User journeys`; a change's file carries the delta sections
 * instead, and `scripts/openspec/journey-vocabulary.test.mjs` pins the whole
 * set. Both shapes are read here: the delta sections are what the schema's
 * template hands every author, and a reader that knew only the durable heading
 * refused every change's file — which left `walked` with nothing to measure and
 * said so nowhere. */
const JOURNEY_SECTIONS = [
  "User journeys",
  "Context user journeys",
  "ADDED User journeys",
  "MODIFIED User journeys",
];
/** Read for the id check and never returned: a retired journey is not one the
 * capability still holds, and rendering it beside the live ones would say it
 * is. The tombstone it leaves is `archive:preflight`'s to check. */
const REMOVED_JOURNEYS = "REMOVED User journeys";

/**
 * A `user-journeys.md`, whole: the journey-bearing sections, each holding a
 * `###` journey apiece. A heading is required rather than assumed, so a file
 * that grew a section no reader knows says so instead of silently dropping it.
 */
export function readJourneys(text: string): Journey[] {
  const roots = outline(text);
  const held = JOURNEY_SECTIONS.map((heading) =>
    findSection(roots, heading),
  ).filter((section): section is Section => section !== undefined);
  const removed = findSection(roots, REMOVED_JOURNEYS);
  if (held.length === 0 && removed === undefined) {
    throw new StoreFileError(
      1,
      "a journeys file needs a `## User journeys` heading, or the `## ADDED User journeys` sections a change writes",
    );
  }
  // Across the sections, not within one: an id under both `## Context user
  // journeys` and `## MODIFIED User journeys` is a journey restated read-only
  // and edited at once, and the copy check would compare it against itself.
  const issued = [...held, ...(removed ? [removed] : [])].flatMap((section) =>
    issuedIn(section.children, JOURNEY_HEADING),
  );
  refuseRepeats(
    "story",
    issued.sort((a, b) => a.line - b.line),
  );
  return held.flatMap((section) => section.children.map(readJourney));
}

/** Whether a journeys file declares, in place of journeys, that no end user
 * reaches the capability on its own. The declaration stands where the journeys
 * would; a file holding both is a check finding. */
export function walkedByNobody(text: string): boolean {
  return WALKED_BY_NOBODY.test(text);
}

export function readRequirement(section: Section): Requirement {
  if (!section.heading.startsWith(REQUIREMENT)) {
    throw new StoreFileError(
      section.line,
      "a requirement heading is `### Requirement: <name>`",
    );
  }
  return {
    name: section.heading.slice(REQUIREMENT.length).trim(),
    text: section.body,
    scenarios: section.children.map(readScenario),
  };
}

/** `###` headings under `## Requirements` that name no requirement. Tolerated
 * in a delta and fatal in a durable spec: `openspec archive` folds one into the
 * requirement above it, and the fold writes a spec this reader refuses. Tolerated
 * is not allowed - a delta's heading is what lands folded, so the spec rules in
 * `openspec/config.yaml` forbid one on either side. */
export function groupHeadings(text: string): Section[] {
  return requirementSections(text).filter(
    (section) =>
      section.level === 3 && !section.heading.startsWith(REQUIREMENT),
  );
}

/** Requirement name → the block as written, for comparing one revision of a
 * spec against another. Reads without refusing: a historical blob is read to
 * be compared, never to be rendered. */
export function requirementBlocks(text: string): Map<string, string> {
  const blocks = new Map<string, string>();
  for (const section of requirementSections(text)) {
    if (!section.heading.startsWith(REQUIREMENT)) continue;
    blocks.set(section.heading.slice(REQUIREMENT.length).trim(), section.raw);
  }
  return blocks;
}

function requirementSections(text: string): Section[] {
  const sections = outline(text).flatMap((section) =>
    section.level === 1 ? section.children : [section],
  );
  return findSection(sections, "Requirements")?.children ?? [];
}

function readScenario(section: Section): Scenario {
  const match = SCENARIO_HEADING.exec(section.heading);
  if (!match) {
    throw new StoreFileError(
      section.line,
      "a scenario heading is `#### Scenario: [<capability>-SC-<n> - ]<name>`",
    );
  }
  const scenario: Scenario = { name: match[2], text: section.body };
  if (match[1]) scenario.id = match[1];
  const serves = servedAnchors(section.body);
  if (serves.length > 0) scenario.serves = serves;
  const prose = servedProse(section.body);
  if (prose) scenario.servesProse = prose;
  return scenario;
}

export type TestSuite = {
  status: TestSuiteStatus;
  cases: TestCase[];
  /** `**Out of suite:**` ids — scenarios the suite leaves uncovered on
   * purpose, so what remains untraced is always a real hole. */
  outOfSuite: string[];
};

/** `docs/governance/specs-to-test-cases.md`: journeys are `##` sections,
 * cases are `###` sections under them, each carrying a `**Trace:**` in its
 * classification list. Status is what keeps a generated draft from wearing
 * a reviewed suite's authority, so a file that states none is refused rather
 * than defaulted. */
export function readTestCases(text: string): TestSuite {
  const roots = outline(text);
  const status = suiteStatus(roots);
  const found: { section: Section; id: string; title: string }[] = [];
  const visit = (sections: Section[]): void => {
    for (const section of sections) {
      const match = CASE_HEADING.exec(section.heading);
      if (match) {
        found.push({ section, id: match[1], title: match[2] });
        continue;
      }
      visit(section.children);
    }
  };
  visit(roots);

  const cases = found.map(
    ({ section, id, title }): TestCase => ({
      id,
      title,
      traces: traces(section),
      status: caseStatus(section),
    }),
  );
  refuseRepeats(
    "test case",
    found.map(({ section, id }) => ({ id, line: section.line })),
  );

  return { status, cases, outOfSuite: outOfSuite(text) };
}

/** The `**Out of suite:**` list, read from the text rather than the outline:
 * it sits inside a section's body, and ends at the blank line after its last
 * entry. */
function outOfSuite(text: string): string[] {
  const ids = new Set<string>();
  let listing = false;
  let started = false;

  for (const line of text.split("\n")) {
    const out = OUT_OF_SUITE.exec(line);
    if (out) {
      const inline = out[1].match(SCENARIO_ID) ?? [];
      for (const id of inline) ids.add(id);
      listing = true;
      started = inline.length > 0;
      continue;
    }
    if (!listing) continue;
    if (line.trim() === "") {
      if (started) listing = false;
      continue;
    }
    if (!BULLET.test(line)) {
      listing = false;
      continue;
    }
    started = true;
    for (const id of line.match(SCENARIO_ID) ?? []) ids.add(id);
  }
  return [...ids];
}

function suiteStatus(roots: Section[]): TestSuiteStatus {
  const head = roots[0];
  const line = head?.line ?? 1;
  const found =
    head?.level === 1 ? SUITE_STATUS.exec(head.body)?.[1] : undefined;
  if (found === undefined) {
    throw new StoreFileError(
      line,
      "a test-case file states `**Status:** pending-review`, `in-review` or `approved` under its title",
    );
  }
  if (!SUITE_STATUSES.has(found)) {
    throw new StoreFileError(
      line,
      `file \`**Status:** ${found}\` is not \`pending-review\`, \`in-review\` or \`approved\``,
    );
  }
  return found as TestSuiteStatus;
}

function caseStatus(section: Section): TestCaseStatus {
  const found = CASE_STATUS.exec(section.raw)?.[1];
  if (found === undefined) {
    throw new StoreFileError(
      section.line,
      `test case \`${section.heading}\` has no \`**Status:**\``,
    );
  }
  if (!CASE_STATUSES.has(found)) {
    throw new StoreFileError(
      section.line,
      `test case \`${section.heading}\` is \`**Status:** ${found}\`, which is not draft, actual or deprecated`,
    );
  }
  return found as TestCaseStatus;
}

function traces(section: Section): string[] {
  const line = TRACE.exec(section.raw);
  if (!line) {
    throw new StoreFileError(
      section.line,
      `test case \`${section.heading}\` has no \`**Trace:**\``,
    );
  }
  const ids = [...new Set(line[1].match(TRACE_ID) ?? [])];
  if (ids.length > 0) return ids;
  // A case may walk a `## Feature set` root group instead of a journey - that is
  // where a capability nobody walks routes its anchors - and a group is named
  // verbatim rather than by id. Whether the name resolves is the `trace`
  // rule's question, asked against the spec beside the suite; the reader's
  // question is only whether the line names anything at all.
  const named = anchorsIn(line[1]);
  if (named.length === 0) {
    throw new StoreFileError(
      section.line,
      `test case \`${section.heading}\` traces nothing - name a journey, a scenario id, or a \`## Feature set\` group`,
    );
  }
  return named;
}
