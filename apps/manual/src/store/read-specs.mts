import { existsSync } from "node:fs";
import { join } from "node:path";
import type {
  Journey,
  Requirement,
  Scenario,
  SpecEntry,
  TestCase,
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

const SCENARIO_ID = /[a-z0-9][a-z0-9-]*-SC-\d+/g;
const SCENARIO_HEADING =
  /^Scenario:\s*(?:([a-z0-9][a-z0-9-]*-SC-\d+)\s+-\s+)?(.+)$/;
const JOURNEY_HEADING = /^([a-z0-9][a-z0-9-]*-US-\d+):\s*(.+)$/;
const CASE_HEADING = /^([a-z0-9][a-z0-9-]*-TC-\d+):\s*(.+)$/;
const ACCEPTED_BY = /^\*\*Accepted by:\*\*\s*$/m;
const TRACE = /^\s*(?:[-*]\s+)?\*\*Trace:\*\*(.*)$/m;

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
        entry.testCases = readTestCases(cases);
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
  if (!section.heading.startsWith("Requirement:")) {
    throw new StoreFileError(
      section.line,
      "a requirement heading is `### Requirement: <name>`",
    );
  }
  return {
    name: section.heading.slice("Requirement:".length).trim(),
    text: section.body,
    scenarios: section.children.map(readScenario),
  };
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

/** `docs/governance/specs-to-test-cases.md`: journeys are `##` sections,
 * cases are `###` sections under them, each closing with `**Trace:**`. */
export function readTestCases(text: string): TestCase[] {
  const cases: TestCase[] = [];
  const visit = (sections: Section[]): void => {
    for (const section of sections) {
      const match = CASE_HEADING.exec(section.heading);
      if (match) {
        cases.push({ id: match[1], title: match[2], traces: traces(section) });
        continue;
      }
      visit(section.children);
    }
  };
  visit(outline(text));
  return cases;
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
