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

/** Disk shape is the taxonomy: a directory under `openspec/specs` holding
 * `spec.md` directly is a topic, a directory of capability directories is a
 * product. */
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
const CASE_HEADING = /^([a-z0-9][a-z0-9-]*-TC-\d+):\s*(.+)$/;
const ACCEPTED_BY = /^\*\*Accepted by:\*\*\s*$/m;
const TRACE = /^\s*(?:[-*]\s+)?\*\*Trace:\*\*(.*)$/m;
/** The file's own status sits at column 0 under the title; a case's is a
 * bullet in its properties list. */
const SUITE_STATUS = /^\*\*Status:\*\*\s*(.+?)\s*$/m;
const CASE_STATUS = /^\s*(?:[-*]\s+)?\*\*Status:\*\*\s*(.+?)\s*$/m;
const SUITE_STATUSES = new Set(["pending-review", "approved"]);
const CASE_STATUSES = new Set(["draft", "actual", "deprecated"]);

export function discoverSpecs(root: string): SpecShape {
  const specsDir = join(root, "openspec", "specs");
  const shape: SpecShape = { products: [], topics: [], dirs: new Map() };

  for (const name of subdirectories(specsDir)) {
    const dir = join(specsDir, name);
    if (existsSync(join(dir, "spec.md"))) {
      shape.topics.push(name);
      shape.dirs.set(name, storePath(root, dir));
      continue;
    }
    const capabilities = subdirectories(dir).filter((capability) =>
      existsSync(join(dir, capability, "spec.md")),
    );
    if (capabilities.length === 0) continue;
    shape.products.push(name);
    for (const capability of capabilities) {
      shape.dirs.set(
        `${name}/${capability}`,
        storePath(root, join(dir, capability)),
      );
    }
  }
  return shape;
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
    const casesPath = `${dir}/test-cases.md`;
    const cases = readTextIfExists(join(root, casesPath));
    if (cases !== undefined) {
      try {
        const suite = readTestCases(cases);
        entry.testCases = suite.cases;
        entry.testCasesStatus = suite.status;
      } catch (cause) {
        entry.error = toItemError(casesPath, cause);
      }
    }
  } catch (cause) {
    entry.error = toItemError(specPath, cause);
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

  const journeys = findSection(sections, "User journeys");
  if (journeys) entry.journeys = journeys.children.map(readJourney);

  const requirements = findSection(sections, "Requirements");
  if (!requirements) {
    throw new StoreFileError(head.line, "spec has no `## Requirements`");
  }
  entry.requirements = requirements.children.map(readRequirement);
}

function readJourney(section: Section): Journey {
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

function readRequirement(section: Section): Requirement {
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

/** `###` headings under `## Requirements` that name no requirement. Legal in a
 * delta, fatal in a durable spec: `openspec archive` folds one into the
 * requirement above it, and the fold writes a spec this reader refuses. */
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

export type TestSuite = { status: TestSuiteStatus; cases: TestCase[] };

/** `docs/governance/specs-to-test-cases.md`: journeys are `##` sections,
 * cases are `###` sections under them, each closing with `**Trace:**`. Status
 * is what keeps a generated draft from wearing a reviewed suite's authority,
 * so a file that states none is refused rather than defaulted. */
export function readTestCases(text: string): TestSuite {
  const roots = outline(text);
  const status = suiteStatus(roots);
  const cases: TestCase[] = [];
  const visit = (sections: Section[]): void => {
    for (const section of sections) {
      const match = CASE_HEADING.exec(section.heading);
      if (match) {
        cases.push({
          id: match[1],
          title: match[2],
          traces: traces(section),
          status: caseStatus(section),
        });
        continue;
      }
      visit(section.children);
    }
  };
  visit(roots);
  return { status, cases };
}

function suiteStatus(roots: Section[]): TestSuiteStatus {
  const head = roots[0];
  const line = head?.line ?? 1;
  const found =
    head?.level === 1 ? SUITE_STATUS.exec(head.body)?.[1] : undefined;
  if (found === undefined) {
    throw new StoreFileError(
      line,
      "a test-case file states `**Status:** pending-review` or `approved` under its title",
    );
  }
  if (!SUITE_STATUSES.has(found)) {
    throw new StoreFileError(
      line,
      `file \`**Status:** ${found}\` is neither \`pending-review\` nor \`approved\``,
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
  const ids = [...new Set(line[1].match(SCENARIO_ID) ?? [])];
  if (ids.length === 0) {
    throw new StoreFileError(
      section.line,
      `test case \`${section.heading}\` traces no scenario id`,
    );
  }
  return ids;
}
