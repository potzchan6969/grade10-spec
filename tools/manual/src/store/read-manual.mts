import { join } from "node:path";
import YAML from "yaml";
import type {
  ManualConfig,
  PageEntry,
  SuiteEntry,
  Taxonomy,
} from "../api/types.ts";
import { GrammarError, type PageAst, parsePage } from "../content/grammar.ts";
import { readText, readTextIfExists, walkAll, walkFiles } from "./disk.mts";
import type { GitIndex } from "./git.mts";
import { MANUAL_CONFIG, manualConfigPath, type Roots } from "./roots.mts";

/** The manual is this app's own content, so a malformed page fails the build
 * rather than becoming a contained error entry. Paths are content-relative:
 * `docs/prds/products/<product>/<capability>.md`.
 *
 * The parse is kept beside the entries. Every page is parsed here to prove it
 * is one, and the freshness read needs the same tree to say what a linked
 * section holds — so it is handed over rather than thrown away and read again
 * from the source it was just parsed from. The snapshot ships the entries; the
 * trees stay in the build. */
export function readManualPages(
  roots: Roots,
  git: GitIndex,
): { pages: PageEntry[]; asts: Map<string, PageAst> } {
  const root = roots.content;
  const asts = new Map<string, PageAst>();
  // A `*-tcs.md` under the manual is a suite of test cases, not a page: the
  // Grade10 store keeps its cases beside its PRD (tcs-rules r7).
  const pages = walkFiles(root, join(root, roots.manual), ".md")
    .filter((path) => !path.endsWith("-tcs.md"))
    .map((path) => {
      const source = readText(join(root, path));
      try {
        asts.set(path, parsePage(source));
      } catch (cause) {
        const where = cause instanceof GrammarError ? `:${cause.line}` : "";
        const message = cause instanceof Error ? cause.message : String(cause);
        throw new Error(`${path}${where}: ${message}`, { cause });
      }
      const entry: PageEntry = { path, source };
      const lastCommit = git.commitOf(path);
      if (lastCommit) entry.lastCommit = lastCommit;
      return entry;
    });
  return { pages, asts };
}

/** The `*-tcs.md` suites the pages leave out, so a page can show the cases
 * that trace it. */
export function readManualSuites(roots: Roots): SuiteEntry[] {
  const root = roots.content;
  return walkFiles(root, join(root, roots.manual), ".md")
    .filter((path) => path.endsWith("-tcs.md"))
    .map((path) => ({ path, source: readText(join(root, path)) }));
}

/** `assets/<name>` — the path an `::image` block writes, not the store path,
 * so the editor can validate a src against this list without rewriting it. */
export function readManualAssets(roots: Roots): string[] {
  const root = roots.content;
  return walkAll(root, join(root, roots.manual, "assets")).map((path) =>
    path.slice(roots.manual.length + 1),
  );
}

export function readManualConfig(roots: Roots): ManualConfig {
  const named = manualConfigPath(roots.manual);
  const file = join(roots.content, roots.manual, MANUAL_CONFIG);
  const text = readTextIfExists(file);
  if (text === undefined) throw new Error(`${named} is missing`);

  let parsed: unknown;
  try {
    parsed = YAML.parse(text) ?? {};
  } catch (cause) {
    throw new Error(`${named} is not valid YAML: ${describe(cause)}`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${named} must be a mapping`);
  }
  const fields = parsed as Record<string, unknown>;

  try {
    const config: ManualConfig = {
      storybookBase: requireString(fields, "storybookBase"),
      groups: readGroups(fields.groups),
      platform: readTopicGroups(fields.platform),
      guides: readIds(fields.guides, "guides"),
    };
    requireUnique(config.groups.flatMap((group) => group.products));
    requireUnique(config.platform.flatMap((group) => group.topics));
    return config;
  } catch (cause) {
    throw new Error(`${named} ${describe(cause)}`, { cause });
  }
}

function requireUnique(ids: string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`lists \`${id}\` twice`);
    }
    seen.add(id);
  }
}

/** Both forms are accepted: an ordered mapping of title → products, and the
 * artifact's own array of `{ title, products }`. */
function readGroups(raw: unknown): ManualConfig["groups"] {
  return readTitled(raw, "groups", "products").map(({ title, ids }) => ({
    title,
    products: ids,
  }));
}

/** The same two forms, plus the bare list of ids an older store wrote — one
 * group, named, because a nav section with no heading is worse than a plain
 * one. */
function readTopicGroups(raw: unknown): ManualConfig["platform"] {
  if (Array.isArray(raw) && raw.every((entry) => typeof entry === "string")) {
    return raw.length === 0 ? [] : [{ title: "Cross-cutting", topics: raw }];
  }
  return readTitled(raw, "platform", "topics").map(({ title, ids }) => ({
    title,
    topics: ids,
  }));
}

function readTitled(
  raw: unknown,
  field: string,
  member: string,
): { title: string; ids: string[] }[] {
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) {
    return raw.map((entry, index) => {
      if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
        throw new Error(`\`${field}\` entry ${index + 1} must be a mapping`);
      }
      const group = entry as Record<string, unknown>;
      return {
        title: requireString(group, "title"),
        ids: readIds(group[member], member),
      };
    });
  }
  if (typeof raw !== "object") {
    throw new Error(`\`${field}\` must be a mapping or a list`);
  }
  return Object.entries(raw as Record<string, unknown>).map(([title, ids]) => ({
    title,
    ids: readIds(ids, title),
  }));
}

function readIds(raw: unknown, field: string): string[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.some((id) => typeof id !== "string")) {
    throw new Error(`\`${field}\` must be a list of ids`);
  }
  return raw as string[];
}

function requireString(fields: Record<string, unknown>, key: string): string {
  const value = fields[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`needs \`${key}\``);
  }
  return value;
}

/** What the pages say exists: a product is a directory under `products/`,
 * one or two levels down, that holds pages of its own; a topic is a page
 * under `platform/`, named by its path there. */
export type PageShape = { products: string[]; topics: string[] };

export function readPageShape(roots: Roots): PageShape {
  const base = join(roots.content, roots.manual);
  const products = new Set<string>();
  const topics: string[] = [];
  for (const path of walkFiles(roots.content, base, ".md")) {
    const rest = path.slice(roots.manual.length + 1);
    if (rest.startsWith("products/")) {
      const dir = rest.slice("products/".length).split("/").slice(0, -1);
      if (dir.length >= 1 && dir.length <= 2) products.add(dir.join("/"));
    } else if (rest.startsWith("platform/")) {
      topics.push(rest.slice("platform/".length, -".md".length));
    }
  }
  return { products: [...products].sort(), topics: topics.sort() };
}

/** The pages decide what exists, `manual.yaml` decides the order. */
export function deriveTaxonomy(roots: Roots, config: ManualConfig): Taxonomy {
  const shape = readPageShape(roots);
  return {
    products: order(
      config.groups.flatMap((group) => group.products),
      shape.products,
    ),
    topics: order(
      config.platform.flatMap((group) => group.topics),
      shape.topics,
    ),
  };
}

function order(first: string[], rest: string[]): string[] {
  const seen = new Set(first);
  return [...first, ...rest.filter((id) => !seen.has(id))];
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
