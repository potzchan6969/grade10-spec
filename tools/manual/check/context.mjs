/*
 * What every rule reads, and the one channel they all write to.
 *
 * A rule module owns its family of findings and nothing else; the shape of a
 * finding, the order the report puts them in, and the readers' output they all
 * share live here so the families never have to agree among themselves.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { storyIndex } from "../../../scripts/storybook/story-index.mjs";
import { readText } from "../src/store/disk.mts";

/** Report order, and which findings end the build. */
export const RULES = [
  { key: "canonical", level: "fail", title: "Pages parse and are canonical" },
  { key: "reference", level: "fail", title: "References resolve" },
  { key: "detail", level: "fail", title: "Detail blocks whose titles collide" },
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
  {
    key: "page",
    level: "fail",
    title: "Products, topics and guides need a page",
  },
  { key: "config", level: "fail", title: "manual.yaml names what exists" },
  {
    key: "story",
    level: "fail",
    title: "Story ids in the workbench Storybook index",
  },
  { key: "dense", level: "warn", title: "Pages denser than the style allows" },
  {
    key: "copy",
    level: "fail",
    title: "Copy cited by a message key the catalogs do not hold as written",
  },
  {
    key: "prose",
    level: "warn",
    title: "Marks inside a sentence, read as words",
  },
  {
    key: "rule",
    level: "warn",
    title: "Rules written as a paragraph, not a list item",
  },
  {
    key: "ref",
    level: "warn",
    title: "Prose references naming nothing, or two things",
  },
  {
    key: "ledger",
    level: "warn",
    title: "Ledgers written as a table, outside an example",
  },
  { key: "figma", level: "warn", title: "Figma links" },
  { key: "icon", level: "warn", title: "Domains with no icon in the rail" },
];

const LEVEL = new Map(RULES.map((rule) => [rule.key, rule.level]));

/** The config's content-relative path, for the report's path column. */
export const manualYaml = (roots) => `${roots.manual}/manual.yaml`;

/** Where a capability's pages sit. The 🚧 rules read only these — a guide
 * writes the mark to explain it. */
export const productPages = (roots) => `${roots.manual}/products/`;

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

export function createContext(roots, report, { pages, stories }) {
  return {
    roots,
    // What `resolveRef` reads, built once for all pages.
    titles: capabilityTitles(pages),
    stories,
    storyIds: new Set(),
    add: report.add,
  };
}

/** Story ids come from the stories' own source, as the workbench would index
 * them (`scripts/storybook/story-index.mjs`), so a card is checked with nothing
 * built. Where the source holds no story or cannot be read - no TypeScript to
 * parse it with - a built index stands in: the build is gitignored, never fetched over the
 * network, and an index half-written by an interrupted build is one more store
 * file the readers could not parse — never the end of the whole run. */
export function readStoryIndex(root, add) {
  const dir = join(root, "apps", "preview");
  if (!existsSync(dir)) return null;
  try {
    const ids = new Set(Object.keys(storyIndex({ root }).entries));
    if (ids.size) return { file: "the stories' source", ids };
  } catch {
    // No TypeScript where the store is mounted: read a build instead.
  }
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

/** Every capability a page documents, against that page's title. */
export function capabilityTitles(pages) {
  const titles = new Map();
  for (const { ast } of pages) {
    const spec = ast?.frontmatter.spec;
    if (spec && !titles.has(spec)) titles.set(spec, ast.frontmatter.title);
  }
  return titles;
}
