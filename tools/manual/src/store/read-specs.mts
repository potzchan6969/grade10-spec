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
const ACCEPTED_BY = /^\*\*Accepted by:\*\*\s*$/m;
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
  // walks — a policy, a package contract — simply has none, and a malformed
  // one cannot blank the requirements the whole store reads.
  const journeysPath = `${dir}/user-journeys.md`;
  const journeys = readTextIfExists(join(root, journeysPath));
  if (journeys !== undefined) {
    try {
      entry.journeys = readJourneys(journeys);
    } catch (cause) {
      entry.journeysError = toItemError(journeysPath, cause);
    }
  }

  // The suite has its own channel: a `test-cases.md` nobody can parse is QA's
  // file, and hanging it on the spec would blank the engineering contract on
  // every page that embeds it — and blind every rule that reads requirements.
  const casesPath = `${dir}/test-cases.md`;
  const cases = readTextIfExists(join(root, casesPath));
  if (cases !== undefined) {
    try {
      const suite = readTestCases(cases);
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
  if (featureSet) entry.featureSet = featureSet.body;

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
 * scenario, story or case into two things wearing the same name — the ref
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
  const split = ACCEPTED_BY.exec(section.body);
  const text = split ? section.body.slice(0, split.index) : section.body;
  const accepted = split ? section.body.slice(split.index) : "";
  return {
    id: match[1],
    title: match[2],
    text: text.trimEnd(),
    acceptedBy: [...new Set(accepted.match(SCENARIO_ID) ?? [])],
  };
}

/**
 * A `user-journeys.md`, whole: one `## User journeys` section holding a `###`
 * story apiece. The heading is required rather than assumed, so a file that
 * grew a second section says so instead of silently dropping it.
 */
export function readJourneys(text: string): Journey[] {
  const roots = outline(text);
  const section = findSection(roots, "User journeys");
  if (!section) {
    throw new StoreFileError(
      1,
      "a journeys file needs a `## User journeys` heading",
    );
  }
  refuseRepeats("story", issuedIn(section.children, JOURNEY_HEADING));
  return section.children.map(readJourney);
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
  if (ids.length === 0) {
    throw new StoreFileError(
      section.line,
      `test case \`${section.heading}\` traces no journey or scenario id`,
    );
  }
  return ids;
}
