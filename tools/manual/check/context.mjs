/*
 * What every rule reads, and the one channel they all write to.
 *
 * A rule module owns its family of findings and nothing else; the shape of a
 * finding, the order the report puts them in, and the readers' output they all
 * share live here so the families never have to agree among themselves.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readText } from "../src/store/disk.mts";

/** Report order, and which findings end the build. */
export const RULES = [
  { key: "canonical", level: "fail", title: "Pages parse and are canonical" },
  { key: "reference", level: "fail", title: "References resolve" },
  {
    key: "detail",
    level: "fail",
    title: "Detail blocks whose titles collide",
  },
  {
    key: "example",
    level: "fail",
    title: "Example ledgers whose balances do not add up",
  },
  {
    key: "case",
    level: "fail",
    title: "Flow cases a reader could not pick between",
  },
  { key: "unreferenced", level: "fail", title: "Durable specs no page shows" },
  {
    key: "page",
    level: "fail",
    title: "Products, topics and guides need a page",
  },
  { key: "config", level: "fail", title: "manual.yaml names what exists" },
  {
    key: "store",
    level: "fail",
    title: "Store files the readers could not parse",
  },
  {
    key: "trace",
    level: "fail",
    title: "Test cases tracing a scenario the spec does not issue",
  },
  {
    key: "authority",
    level: "fail",
    title: "Approved suites holding a draft case",
  },
  {
    key: "accepted",
    level: "fail",
    title: "Journeys accepted by a scenario the spec does not issue",
  },
  {
    key: "walked",
    level: "fail",
    title: "Capabilities that never say who walks them",
  },
  {
    key: "grouping",
    level: "fail",
    title: "Durable specs holding a heading the archive would fold",
  },
  {
    key: "map",
    level: "fail",
    title: "Durable specs the fold left without their map",
  },
  {
    key: "heading",
    level: "fail",
    title: "Deltas holding a heading the archive cannot fold",
  },
  {
    key: "delta",
    level: "fail",
    title: "Delta headings no durable requirement answers to",
  },
  {
    key: "overlap",
    level: "fail",
    title: "Requirements two in-flight changes both fold",
  },
  { key: "issued", level: "fail", title: "Permanent ids issued twice" },
  {
    key: "fuse",
    level: "fail",
    title: "Page selectors an in-flight change would break",
  },
  { key: "depends", level: "fail", title: "Dependencies naming no change" },
  {
    key: "story",
    level: "fail",
    title: "Story ids in the workbench Storybook index",
  },
  {
    key: "stale",
    level: "warn",
    title: "Pages older than the specs they embed",
  },
  {
    key: "skeleton",
    level: "warn",
    title: "Capability pages missing their acceptance shelf",
  },
  {
    key: "ref",
    level: "warn",
    title: "Prose references naming nothing, or two things",
  },
  { key: "figma", level: "warn", title: "Figma links" },
  {
    key: "suite",
    level: "warn",
    title: "Specs whose test cases no page shows",
  },
  {
    key: "coverage",
    level: "warn",
    title: "Scenarios no test case traces",
  },
  {
    key: "role",
    level: "warn",
    title: "Journeys walked by the system, not an actor",
  },
  {
    key: "unwritten",
    level: "warn",
    title: "Delta-introduced capabilities no page documents",
  },
  { key: "icon", level: "warn", title: "Domains with no icon in the rail" },
];

const LEVEL = new Map(RULES.map((rule) => [rule.key, rule.level]));

/** The config's content-relative path, for the report's path column. */
export const manualYaml = (roots) => `${roots.manual}/manual.yaml`;

/** The sink, opened before the readers run so a reader that refuses a file can
 * report it. */
export function createReport() {
  const findings = [];
  const notes = [];
  const add = (rule, path, reason) => {
    findings.push({ rule, level: LEVEL.get(rule), path, reason });
  };
  return { findings, notes, add };
}

export function createContext(roots, report, { specs, changes, stories }) {
  return {
    roots,
    specs,
    // The slice of a snapshot `resolveRef` reads, built once for all pages.
    snapshot: { specs: [...specs.values()] },
    changing: new Set(changes.flatMap((one) => one.deltas.map((d) => d.spec))),
    stories,
    referenced: new Set(),
    cased: new Set(),
    storyIds: new Set(),
    add: report.add,
  };
}

/** The workbench Storybook build is gitignored, so story ids are checkable
 * only where someone has built it. Never fetched over the network, and an
 * index half-written by an interrupted build is one more store file the
 * readers could not parse — never the end of the whole run. */
export function readStoryIndex(root, add) {
  const dir = join(root, "apps", "preview");
  if (!existsSync(dir)) return null;
  const built = readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && entry.name.startsWith("storybook-static"),
    )
    .map((entry) => entry.name)
    .sort();
  for (const name of built) {
    const file = join(dir, name, "index.json");
    if (!existsSync(file)) continue;
    const path = `apps/preview/${name}/index.json`;
    try {
      const entries = JSON.parse(readText(file)).entries ?? {};
      return { file: path, ids: new Set(Object.keys(entries)) };
    } catch (cause) {
      add(
        "store",
        path,
        `the Storybook index is unreadable: ${message(cause)}`,
      );
      return null;
    }
  }
  return null;
}

/** Every permanent scenario id a spec issues — what a scenario trace and a
 * journey's accepted-by all have to land in. */
export const scenarioIds = (spec) =>
  new Set(
    spec.requirements
      .flatMap((one) => one.scenarios)
      .map((one) => one.id)
      .filter((id) => id !== undefined),
  );

export function* everyBlock(blocks) {
  for (const block of blocks) {
    yield block;
    if (Array.isArray(block.body)) yield* everyBlock(block.body);
  }
}

export const message = (cause) =>
  cause instanceof Error ? cause.message : String(cause);

export const plural = (count, word) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;
