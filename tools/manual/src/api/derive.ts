import type {
  Block,
  BodyItem,
  CalloutBlock,
  FigmaBlock,
  StoryBlock,
} from "../content/grammar";
import { type PageAst, parsePage } from "../content/grammar";
import type { PageIcon } from "../content/icons";
import {
  dirOf,
  humanize,
  ownerOfSpec,
  pagePath,
  routeForPagePath,
} from "./paths";
import type { HistoryRef, PageEntry, Snapshot } from "./types";

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
  /** The glyph beside the title, from the page's own frontmatter. */
  icon?: PageIcon;
  /** Capability entries only — who the page serves, from its frontmatter. */
  audience?: "operator";
};

export type NavProduct = NavItem & { capabilities: NavItem[] };

export type NavGroup = { title: string; products: NavProduct[] };

/**
 * A group holding exactly one product whose own title repeats the group's —
 * the group already says what a product branch would, so nesting one under
 * it doubles a row for nothing. The nav renders this group's product flat,
 * with no branch of its own to expand.
 */
export function soleProduct(group: NavGroup): NavProduct | null {
  const [only, second] = group.products;
  return only && !second && only.title === group.title ? only : null;
}

export type NavTopicGroup = { title: string; topics: NavItem[] };

export type ManualIndex = {
  snapshot: Snapshot;
  /** `snapshot.manualDir`, at hand wherever a page path is built. */
  manualDir: string;
  pages: ParsedPage[];
  pageByPath: Map<string, ParsedPage>;
  pageByRoute: Map<string, ParsedPage>;
  /** Spec id → the route of the page that documents it. */
  routeBySpec: Map<string, string>;
  /** Spec id → the title of the page that documents it. */
  titleBySpec: Map<string, string>;
  groups: NavGroup[];
  topicGroups: NavTopicGroup[];
  /** Every topic of every group, in nav order — what search and the platform
   * pages ask for. */
  topics: NavItem[];
  guides: NavItem[];
  /** The store's references, in path order; each `to` is `/references/<slug>`. */
  references: NavItem[];
  referenceByRoute: Map<string, NavItem>;
};

const cache = new WeakMap<Snapshot, ManualIndex>();

export function buildIndex(snapshot: Snapshot): ManualIndex {
  const cached = cache.get(snapshot);
  if (cached) return cached;
  const index = deriveIndex(snapshot);
  cache.set(snapshot, index);
  return index;
}

function parse(manualDir: string, entry: PageEntry): ParsedPage {
  const route = routeForPagePath(manualDir, entry.path);
  try {
    return {
      path: entry.path,
      entry,
      ast: parsePage(entry.source),
      error: null,
      route,
    };
  } catch (cause) {
    return {
      path: entry.path,
      entry,
      ast: null,
      error: cause instanceof Error ? cause.message : String(cause),
      route,
    };
  }
}

function deriveIndex(snapshot: Snapshot): ManualIndex {
  const manualDir = snapshot.manualDir;
  const pages = snapshot.pages.map((entry) => parse(manualDir, entry));
  const pageByPath = new Map(pages.map((page) => [page.path, page]));
  const pageByRoute = new Map(
    pages.flatMap((page) => (page.route ? [[page.route, page] as const] : [])),
  );
  const routeBySpec = new Map<string, string>();
  const titleBySpec = new Map<string, string>();
  for (const page of pages) {
    const spec = page.ast?.frontmatter.spec;
    if (spec && page.route && !routeBySpec.has(spec)) {
      routeBySpec.set(spec, page.route);
      titleBySpec.set(spec, page.ast?.frontmatter.title ?? spec);
    }
  }

  const index: ManualIndex = {
    snapshot,
    manualDir,
    pages,
    pageByPath,
    pageByRoute,
    routeBySpec,
    titleBySpec,
    groups: [],
    topicGroups: [],
    topics: [],
    guides: [],
    references: [],
    referenceByRoute: new Map(),
  };

  index.groups = deriveGroups(index);
  index.topicGroups = deriveTopicGroups(index);
  index.topics = index.topicGroups.flatMap((group) => group.topics);
  index.guides = deriveGuides(index);
  index.references = snapshot.references.map((one, order) => ({
    id: one.slug,
    title: one.title,
    to: routeForReference(one.slug),
    order,
  }));
  index.referenceByRoute = new Map(
    index.references.map((item) => [item.to, item]),
  );
  return index;
}

function navItem(page: ParsedPage, fallbackId: string): NavItem {
  return {
    id: fallbackId,
    title: page.ast?.frontmatter.title ?? humanize(fallbackId),
    summary: page.ast?.frontmatter.summary,
    icon: page.ast?.frontmatter.icon,
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
  const dir = pagePath(index.manualDir, "products", id);
  const landing = index.pageByPath.get(`${dir}/index.md`);
  const capabilities = childPages(index, dir).map((page) => {
    const item = navItem(page, page.path.slice(dir.length + 1, -3));
    const audience = page.ast?.frontmatter.audience;
    if (audience) item.audience = audience;
    return item;
  });

  return {
    id,
    title: landing?.ast?.frontmatter.title ?? humanize(id),
    summary: landing?.ast?.frontmatter.summary,
    icon: landing?.ast?.frontmatter.icon,
    to: `/p/${id}`,
    order: landing?.ast?.frontmatter.order ?? Number.MAX_SAFE_INTEGER,
    capabilities,
  };
}

/** The group that collects operator-facing pages, wherever their specs live. */
export const ADMIN_GROUP = "Admin";

function deriveGroups(index: ManualIndex): NavGroup[] {
  const listed = new Set<string>();
  const groups = index.snapshot.config.groups.map((group) => {
    for (const id of group.products) listed.add(id);
    // A product listed under Admin is wholly operator-facing and keeps every
    // capability; everywhere else the operator pages move to Admin instead.
    const whole = group.title === ADMIN_GROUP;
    return {
      title: group.title,
      products: group.products.map((id) => {
        const product = productNav(index, id);
        return whole ? product : withoutOperators(product);
      }),
    };
  });

  appendOperatorBranches(index, groups);

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

function withoutOperators(product: NavProduct): NavProduct {
  return {
    ...product,
    capabilities: product.capabilities.filter(
      (one) => one.audience !== "operator",
    ),
  };
}

/**
 * Every `audience: operator` page, regrouped by the product it operates, under
 * the one Admin group. The store's taxonomy stays put — the rail is the only
 * thing that regroups — and a missing Admin group in manual.yaml is created
 * rather than letting an operator page fall out of the rail entirely.
 */
function appendOperatorBranches(index: ManualIndex, groups: NavGroup[]) {
  const admin = groups.find((group) => group.title === ADMIN_GROUP);
  const homed = new Set(admin?.products.map((one) => one.id) ?? []);

  const branches: NavProduct[] = [];
  for (const id of index.snapshot.taxonomy.products) {
    if (homed.has(id)) continue;
    const product = productNav(index, id);
    const operators = product.capabilities.filter(
      (one) => one.audience === "operator",
    );
    if (operators.length === 0) continue;
    branches.push({ ...product, capabilities: operators });
  }
  if (branches.length === 0) return;

  if (admin) admin.products.push(...branches);
  else groups.push({ title: ADMIN_GROUP, products: branches });
}

function deriveTopicGroups(index: ManualIndex): NavTopicGroup[] {
  const onDisk = childPages(index, pagePath(index.manualDir, "platform"));
  const byId = new Map(
    onDisk.map((page) => [page.path.slice(0, -3).split("/").pop() ?? "", page]),
  );

  const groups: NavTopicGroup[] = [];
  for (const group of index.snapshot.config.platform) {
    const topics: NavItem[] = [];
    for (const id of group.topics) {
      // A topic is listed by its spec id — `shared/money-amounts` — while its
      // page is a flat file named for the topic alone, because the layer above
      // it holds nothing else the manual writes a page for.
      const slug = id.split("/").pop() ?? id;
      const page = byId.get(slug);
      topics.push(
        page
          ? navItem(page, id)
          : {
              id,
              title: humanize(id),
              to: `/platform/${id}`,
              order: Number.MAX_SAFE_INTEGER,
            },
      );
      byId.delete(slug);
    }
    groups.push({ title: group.title, topics });
  }

  // A topic on disk that manual.yaml never lists is a real gap; show it rather
  // than dropping it silently.
  if (byId.size > 0) {
    groups.push({
      title: "Not in manual.yaml",
      topics: [...byId].map(([id, page]) => navItem(page, id)),
    });
  }
  return groups;
}

function deriveGuides(index: ManualIndex): NavItem[] {
  const onDisk = childPages(index, pagePath(index.manualDir, "guides"));
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

export const REFERENCES_ROUTE = "/references";

export function routeForReference(slug: string): string {
  return `${REFERENCES_ROUTE}/${slug}`;
}

/** The title a product wears everywhere: its landing page's, or its id read out. */
export function productTitle(index: ManualIndex, id: string): string {
  const landing = index.pageByPath.get(
    pagePath(index.manualDir, "products", id, "index.md"),
  );
  return landing?.ast?.frontmatter.title ?? humanize(id);
}

/**
 * What a `/p/...` route names. `/p/a/b` is the product `a/b` where the store
 * groups its products by the application shipping them, and the capability `b`
 * of the product `a` where it does not; the taxonomy and the landing pages held
 * decide, longest product first. A route naming nothing the store holds is
 * read the flat way, so the page it would render says what is missing.
 */
export function splitProductRoute(
  index: ManualIndex,
  parts: string[],
): { product: string; capability?: string } | null {
  if (parts.length === 0 || parts.length > 3) return null;
  for (let n = Math.min(parts.length, 2); n >= 1; n -= 1) {
    const rest = parts.slice(n);
    if (rest.length > 1) continue;
    const product = parts.slice(0, n).join("/");
    const known =
      index.snapshot.taxonomy.products.includes(product) ||
      index.pageByPath.has(
        pagePath(index.manualDir, "products", product, "index.md"),
      );
    if (known) return { product, capability: rest[0] };
  }
  return parts.length <= 2 ? { product: parts[0], capability: parts[1] } : null;
}

/** What a commit touched, as a chip: a stable key, what to call it, and where
 * it leads when it still leads anywhere. */
export type FeedRef = {
  key: string;
  label: string;
  to?: string;
  kind: HistoryRef["kind"];
};

/**
 * A history ref against today's store. A page deleted since, or a file no
 * reader claims, keeps its label and loses its link, because the commit
 * happened whatever became of what it touched.
 */
export function feedRef(index: ManualIndex, ref: HistoryRef): FeedRef {
  return {
    key: `${ref.kind}:${ref.path}`,
    kind: ref.kind,
    ...linked(index, ref),
  };
}

function linked(
  index: ManualIndex,
  ref: HistoryRef,
): { label: string; to?: string } {
  if (ref.kind === "page") {
    const page = index.pageByPath.get(ref.path);
    if (!page) return { label: ref.path };
    return {
      label: page.ast?.frontmatter.title ?? ref.path,
      ...(page.route ? { to: page.route } : {}),
    };
  }
  return { label: ref.path };
}

/** A callout owning no signature of its own — the ones the build signs. */
const unsignedWarning = (block: Block | BodyItem): block is CalloutBlock =>
  block.type === "callout" &&
  block.kind === "warning" &&
  (block.author === undefined || block.date === undefined);

const signatureCache = new WeakMap<
  ParsedPage,
  WeakMap<CalloutBlock, { author: string; date: string }>
>();

/**
 * The derived signature for an unsigned warning callout: who last changed it
 * and when, read from git at build time. The build lists signatures in
 * document order for exactly the unsigned callouts, so zipping this parse's
 * walk against that list pairs each block with its own. Undefined where git
 * has not answered — an uncommitted callout, or a store without a repository.
 */
export function warningSignature(
  page: ParsedPage,
  block: CalloutBlock,
): { author: string; date: string } | undefined {
  let signed = signatureCache.get(page);
  if (!signed) {
    signed = new WeakMap();
    const signatures = page.entry.warningSignatures ?? [];
    const unsigned = (page.ast?.blocks ?? []).filter(unsignedWarning);
    unsigned.forEach((one, at) => {
      const signature = signatures[at];
      if (signature) signed?.set(one, signature);
    });
    signatureCache.set(page, signed);
  }
  return signed.get(block);
}

/** Every block a page holds, container bodies included. */
function* everyBlock(
  blocks: (Block | BodyItem)[],
): Generator<Block | BodyItem> {
  for (const block of blocks) {
    yield block;
    if ("body" in block) yield* everyBlock(block.body);
  }
}

export type DesignCard = FigmaBlock | StoryBlock;

/** One page's visuals, in the order it shows them. */
export type DesignShelf = {
  page: ParsedPage;
  route: string;
  title: string;
  cards: DesignCard[];
};

/**
 * Every figma frame and story in the manual, by the page that shows it. Nav is
 * group → product → capability and nothing groups by design file, so answering
 * "which pages show my designs" meant opening every page by hand.
 */
export function designShelves(index: ManualIndex): DesignShelf[] {
  const shelves: DesignShelf[] = [];
  for (const page of index.pages) {
    if (!page.ast || !page.route) continue;
    const cards = [...everyBlock(page.ast.blocks)].filter(
      (block): block is DesignCard =>
        block.type === "figma" || block.type === "story",
    );
    if (cards.length === 0) continue;
    shelves.push({
      page,
      route: page.route,
      title: page.ast.frontmatter.title,
      cards,
    });
  }
  return shelves.sort((a, b) => a.title.localeCompare(b.title));
}

/** Route to a spec's page, falling back to the route its id implies. */
export function routeForSpec(index: ManualIndex, specId: string): string {
  const known = index.routeBySpec.get(specId);
  if (known) return known;
  const owner = ownerOfSpec(specId, index.snapshot.taxonomy);
  // A topic owns itself, and has no product route to sit under.
  return owner === specId
    ? `/platform/${specId}`
    : `/p/${owner}/${specId.slice(owner.length + 1)}`;
}
