import { join } from "node:path";
import YAML from "yaml";
import type { ManualConfig, PageEntry, Taxonomy } from "../api/types.ts";
import { GrammarError, parsePage } from "../content/grammar.ts";
import { readText, readTextIfExists, walkAll, walkFiles } from "./disk.mts";
import type { GitIndex } from "./git.mts";
import type { SpecShape } from "./read-specs.mts";

/** `manual/` is this app's own content, so a malformed page fails the build
 * rather than becoming a contained error entry. */
export function readManualPages(root: string, git: GitIndex): PageEntry[] {
  return walkFiles(root, join(root, "manual"), ".md").map((path) => {
    const source = readText(join(root, path));
    try {
      parsePage(source);
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
}

/** `assets/<name>` — the path an `::image` block writes, not the store path,
 * so the editor can validate a src against this list without rewriting it. */
export function readManualAssets(root: string): string[] {
  return walkAll(root, join(root, "manual", "assets")).map((path) =>
    path.slice("manual/".length),
  );
}

export function readManualConfig(root: string): ManualConfig {
  const file = join(root, "manual", "manual.yaml");
  const text = readTextIfExists(file);
  if (text === undefined) throw new Error(`manual/manual.yaml is missing`);

  let parsed: unknown;
  try {
    parsed = YAML.parse(text) ?? {};
  } catch (cause) {
    throw new Error(`manual/manual.yaml is not valid YAML: ${describe(cause)}`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("manual/manual.yaml must be a mapping");
  }
  const fields = parsed as Record<string, unknown>;

  const config: ManualConfig = {
    storybookBase: requireString(fields, "storybookBase"),
    groups: readGroups(fields.groups),
    platform: readIds(fields.platform, "platform"),
    guides: readIds(fields.guides, "guides"),
  };

  const seen = new Set<string>();
  for (const group of config.groups) {
    for (const product of group.products) {
      if (seen.has(product)) {
        throw new Error(`manual/manual.yaml lists \`${product}\` twice`);
      }
      seen.add(product);
    }
  }
  return config;
}

/** Both forms are accepted: an ordered mapping of title → products, and the
 * artifact's own array of `{ title, products }`. */
function readGroups(raw: unknown): ManualConfig["groups"] {
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) {
    return raw.map((entry, index) => {
      if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
        throw new Error(
          `manual/manual.yaml group ${index + 1} must be a mapping`,
        );
      }
      const group = entry as Record<string, unknown>;
      return {
        title: requireString(group, "title"),
        products: readIds(group.products, "products"),
      };
    });
  }
  if (typeof raw !== "object") {
    throw new Error("manual/manual.yaml `groups` must be a mapping or a list");
  }
  return Object.entries(raw as Record<string, unknown>).map(
    ([title, products]) => ({ title, products: readIds(products, title) }),
  );
}

function readIds(raw: unknown, field: string): string[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.some((id) => typeof id !== "string")) {
    throw new Error(`manual/manual.yaml \`${field}\` must be a list of ids`);
  }
  return raw as string[];
}

function requireString(fields: Record<string, unknown>, key: string): string {
  const value = fields[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`manual/manual.yaml needs \`${key}\``);
  }
  return value;
}

/** Disk decides what exists, `manual.yaml` decides the order and may add a
 * product that has no specs yet. */
export function deriveTaxonomy(
  shape: SpecShape,
  config: ManualConfig,
): Taxonomy {
  const listed = config.groups.flatMap((group) => group.products);
  return {
    products: order(listed, shape.products),
    topics: order(config.platform, shape.topics),
  };
}

function order(first: string[], rest: string[]): string[] {
  const seen = new Set(first);
  return [...first, ...rest.filter((id) => !seen.has(id))];
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
