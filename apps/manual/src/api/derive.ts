import { type PageAst, parsePage } from "../content/grammar";
import {
  dirOf,
  humanize,
  MANUAL_ROOT,
  ownerOfSpec,
  routeForPagePath,
} from "./paths";
import type { ChangeEntry, PageEntry, Snapshot, SpecEntry } from "./types";

/** A page as the app reads it: parsed, or contained with the parse error. */
export type ParsedPage = {
  path: string;
  entry: PageEntry;
  ast: PageAst | null;
  error: string | null;
  route: string | null;
};

export type NavItem = {
  id: string;
  title: string;
  summary?: string;
  to: string;
  order: number;
};

export type NavProduct = NavItem & {
  capabilities: NavItem[];
  changeCount: number;
};

export type NavGroup = { title: string; products: NavProduct[] };

export type ManualIndex = {
  snapshot: Snapshot;
  pages: ParsedPage[];
  pageByPath: Map<string, ParsedPage>;
  pageByRoute: Map<string, ParsedPage>;
  specById: Map<string, SpecEntry>;
  changeById: Map<string, ChangeEntry>;
  changesBySpec: Map<string, ChangeEntry[]>;
  changesByOwner: Map<string, ChangeEntry[]>;
  /** Spec id → the route of the page that documents it. */
  routeBySpec: Map<string, string>;
  groups: NavGroup[];
  topics: NavItem[];
  guides: NavItem[];
};

const cache = new WeakMap<Snapshot, ManualIndex>();

export function buildIndex(snapshot: Snapshot): ManualIndex {
  const cached = cache.get(snapshot);
  if (cached) return cached;
  const index = deriveIndex(snapshot);
  cache.set(snapshot, index);
  return index;
}

function parse(entry: PageEntry): ParsedPage {
  try {
    return {
      path: entry.path,
      entry,
      ast: parsePage(entry.source),
      error: null,
      route: routeForPagePath(entry.path),
    };
  } catch (cause) {
    return {
      path: entry.path,
      entry,
      ast: null,
      error: cause instanceof Error ? cause.message : String(cause),
      route: routeForPagePath(entry.path),
    };
  }
}

function deriveIndex(snapshot: Snapshot): ManualIndex {
  const pages = snapshot.pages.map(parse);
  const pageByPath = new Map(pages.map((page) => [page.path, page]));
  const pageByRoute = new Map(
    pages.flatMap((page) => (page.route ? [[page.route, page] as const] : [])),
  );
  const specById = new Map(snapshot.specs.map((spec) => [spec.id, spec]));
  const changeById = new Map(
    snapshot.changes.map((change) => [change.id, change]),
  );

  const changesBySpec = new Map<string, ChangeEntry[]>();
  const changesByOwner = new Map<string, ChangeEntry[]>();
  for (const change of snapshot.changes) {
    for (const delta of change.deltas) {
      push(changesBySpec, delta.spec, change);
      push(changesByOwner, ownerOfSpec(delta.spec), change);
    }
  }
  for (const list of [...changesBySpec.values(), ...changesByOwner.values()]) {
    dedupe(list);
  }

  const routeBySpec = new Map<string, string>();
  for (const page of pages) {
    const spec = page.ast?.frontmatter.spec;
    if (spec && page.route && !routeBySpec.has(spec)) {
      routeBySpec.set(spec, page.route);
    }
  }

  const index: ManualIndex = {
    snapshot,
    pages,
    pageByPath,
    pageByRoute,
    specById,
    changeById,
    changesBySpec,
    changesByOwner,
    routeBySpec,
    groups: [],
    topics: [],
    guides: [],
  };

  index.groups = deriveGroups(index);
  index.topics = deriveTopics(index);
  index.guides = deriveGuides(index);
  return index;
}

function push<T>(map: Map<string, T[]>, key: string, value: T) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

function dedupe(list: ChangeEntry[]) {
  const seen = new Set<string>();
  let write = 0;
  for (const change of list) {
    if (seen.has(change.id)) continue;
    seen.add(change.id);
    list[write] = change;
    write += 1;
  }
  list.length = write;
}

function navItem(page: ParsedPage, fallbackId: string): NavItem {
  return {
    id: fallbackId,
    title: page.ast?.frontmatter.title ?? humanize(fallbackId),
    summary: page.ast?.frontmatter.summary,
    to: page.route ?? "/",
    order: page.ast?.frontmatter.order ?? Number.MAX_SAFE_INTEGER,
  };
}

function byOrderThenTitle(a: NavItem, b: NavItem): number {
  return a.order - b.order || a.title.localeCompare(b.title);
}

/** Pages sitting directly inside a directory, `index.md` excluded. */
export function childPages(index: ManualIndex, dir: string): ParsedPage[] {
  return index.pages
    .filter(
      (page) => dirOf(page.path) === dir && !page.path.endsWith("/index.md"),
    )
    .sort(
      (a, b) =>
        (a.ast?.frontmatter.order ?? Number.MAX_SAFE_INTEGER) -
          (b.ast?.frontmatter.order ?? Number.MAX_SAFE_INTEGER) ||
        (a.ast?.frontmatter.title ?? a.path).localeCompare(
          b.ast?.frontmatter.title ?? b.path,
        ),
    );
}

function productNav(index: ManualIndex, id: string): NavProduct {
  const dir = `${MANUAL_ROOT}/products/${id}`;
  const landing = index.pageByPath.get(`${dir}/index.md`);
  const capabilities = childPages(index, dir).map((page) =>
    navItem(page, page.path.slice(dir.length + 1, -3)),
  );

  return {
    id,
    title: landing?.ast?.frontmatter.title ?? humanize(id),
    summary: landing?.ast?.frontmatter.summary,
    to: `/p/${id}`,
    order: landing?.ast?.frontmatter.order ?? Number.MAX_SAFE_INTEGER,
    capabilities,
    changeCount: index.changesByOwner.get(id)?.length ?? 0,
  };
}

function deriveGroups(index: ManualIndex): NavGroup[] {
  const listed = new Set<string>();
  const groups = index.snapshot.config.groups.map((group) => {
    for (const id of group.products) listed.add(id);
    return {
      title: group.title,
      products: group.products.map((id) => productNav(index, id)),
    };
  });

  // A product on disk that manual.yaml never lists is a real gap; show it
  // rather than dropping it silently.
  const unlisted = index.snapshot.taxonomy.products.filter(
    (id) => !listed.has(id),
  );
  if (unlisted.length > 0) {
    groups.push({
      title: "Not in manual.yaml",
      products: unlisted.map((id) => productNav(index, id)),
    });
  }
  return groups;
}

function deriveTopics(index: ManualIndex): NavItem[] {
  const configured = index.snapshot.config.platform;
  const onDisk = childPages(index, `${MANUAL_ROOT}/platform`);
  const byId = new Map(
    onDisk.map((page) => [page.path.slice(0, -3).split("/").pop() ?? "", page]),
  );

  const ordered: NavItem[] = [];
  for (const id of configured) {
    const page = byId.get(id);
    ordered.push(
      page
        ? navItem(page, id)
        : {
            id,
            title: humanize(id),
            to: `/platform/${id}`,
            order: Number.MAX_SAFE_INTEGER,
          },
    );
    byId.delete(id);
  }
  for (const [id, page] of byId) ordered.push(navItem(page, id));
  return ordered;
}

function deriveGuides(index: ManualIndex): NavItem[] {
  const onDisk = childPages(index, `${MANUAL_ROOT}/guides`);
  const byId = new Map(
    onDisk.map((page) => [page.path.slice(0, -3).split("/").pop() ?? "", page]),
  );

  const ordered: NavItem[] = [];
  for (const slug of index.snapshot.config.guides) {
    const page = byId.get(slug);
    if (!page) continue;
    ordered.push(navItem(page, slug));
    byId.delete(slug);
  }
  const rest = [...byId].map(([slug, page]) => navItem(page, slug));
  return [...ordered, ...rest.sort(byOrderThenTitle)];
}

/** The title a product wears everywhere: its landing page's, or its id read out. */
export function productTitle(index: ManualIndex, id: string): string {
  const landing = index.pageByPath.get(
    `${MANUAL_ROOT}/products/${id}/index.md`,
  );
  return landing?.ast?.frontmatter.title ?? humanize(id);
}

export function changesForSpec(
  index: ManualIndex,
  specId: string,
): ChangeEntry[] {
  return index.changesBySpec.get(specId) ?? [];
}

export function changesForOwner(
  index: ManualIndex,
  owner: string,
): ChangeEntry[] {
  return index.changesByOwner.get(owner) ?? [];
}

export function taskTotals(change: ChangeEntry): {
  done: number;
  total: number;
} {
  return change.taskGroups.reduce(
    (sum, group) => ({
      done: sum.done + group.done,
      total: sum.total + group.total,
    }),
    { done: 0, total: 0 },
  );
}

/** Newest movement first; a change that never moved sorts last. */
export function byLastMoved(a: ChangeEntry, b: ChangeEntry): number {
  const left = a.lastMoved ? Date.parse(a.lastMoved) : 0;
  const right = b.lastMoved ? Date.parse(b.lastMoved) : 0;
  return right - left || a.id.localeCompare(b.id);
}

/** Route to a spec's page, falling back to the route its id implies. */
export function routeForSpec(index: ManualIndex, specId: string): string {
  const known = index.routeBySpec.get(specId);
  if (known) return known;
  const parts = specId.split("/");
  return parts.length === 2
    ? `/p/${parts[0]}/${parts[1]}`
    : `/platform/${specId}`;
}
