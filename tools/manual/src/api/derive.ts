import type {
  Block,
  BodyItem,
  CalloutBlock,
  FigmaBlock,
  StoryBlock,
} from "../content/grammar";
import { type PageAst, parsePage } from "../content/grammar";
import { resolveRef } from "../content/refs";
import {
  dirOf,
  humanize,
  ownerOfSpec,
  pagePath,
  routeForPagePath,
  slugify,
} from "./paths";
import { findRequirement } from "./requirements";
import type {
  ChangeEntry,
  ChangeLane,
  ChangeSuite,
  DeltaKind,
  DeltaRequirement,
  HistoryRef,
  ItemError,
  Journey,
  PageEntry,
  Snapshot,
  SpecEntry,
  TestCase,
  TestSuiteStatus,
} from "./types";

/** A page as the app reads it: parsed, or contained with the parse error. */
export type ParsedPage = {
  path: string;
  entry: PageEntry;
  ast: PageAst | null;
  error: string | null;
  route: string | null;
};

/** Derived from the store, never stored: what shape a capability is in. */
export type CapabilityStatus = "changing" | "incubating" | "planned" | "stable";

export type NavItem = {
  id: string;
  title: string;
  summary?: string;
  to: string;
  order: number;
  /** Capability entries only — a guide has no spec to be changing. */
  status?: CapabilityStatus;
  /** Capability entries only — who the page serves, from its frontmatter. */
  audience?: "operator";
};

export type NavProduct = NavItem & {
  capabilities: NavItem[];
  /** Capabilities that exist only as a delta — no durable spec, no page. */
  incubating: Incubating[];
  changeCount: number;
};

export type NavGroup = { title: string; products: NavProduct[] };

export type NavTopicGroup = { title: string; topics: NavItem[] };

export type ManualIndex = {
  snapshot: Snapshot;
  /** `snapshot.manualDir`, at hand wherever a page path is built. */
  manualDir: string;
  pages: ParsedPage[];
  pageByPath: Map<string, ParsedPage>;
  pageByRoute: Map<string, ParsedPage>;
  specById: Map<string, SpecEntry>;
  changeById: Map<string, ChangeEntry>;
  changesBySpec: Map<string, ChangeEntry[]>;
  changesByOwner: Map<string, ChangeEntry[]>;
  /** Spec id → the proposals whose `## References` name it, directly or
   * through an id it issued. A proposal has no delta, so this is the only way
   * a capability learns one is about it. */
  proposalsBySpec: Map<string, ChangeEntry[]>;
  /** Spec id → the route of the page that documents it. */
  routeBySpec: Map<string, string>;
  groups: NavGroup[];
  topicGroups: NavTopicGroup[];
  /** Every topic of every group, in nav order — what search and the platform
   * pages ask for. */
  topics: NavItem[];
  guides: NavItem[];
  /** The store's references, in path order; each `to` is `/references/<slug>`. */
  references: NavItem[];
  referenceByRoute: Map<string, NavItem>;
  /** Delta-only capabilities whose product has no branch to sit under. */
  incubating: Incubating[];
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
  const specById = new Map(snapshot.specs.map((spec) => [spec.id, spec]));
  const changeById = new Map(
    snapshot.changes.map((change) => [change.id, change]),
  );

  const changesBySpec = new Map<string, ChangeEntry[]>();
  const changesByOwner = new Map<string, ChangeEntry[]>();
  for (const change of snapshot.changes) {
    for (const delta of change.deltas) {
      push(changesBySpec, delta.spec, change);
      push(changesByOwner, ownerOfSpec(delta.spec, snapshot.taxonomy), change);
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
    manualDir,
    pages,
    pageByPath,
    pageByRoute,
    specById,
    changeById,
    changesBySpec,
    changesByOwner,
    proposalsBySpec: deriveProposalsBySpec(snapshot),
    routeBySpec,
    groups: [],
    topicGroups: [],
    topics: [],
    guides: [],
    references: [],
    referenceByRoute: new Map(),
    incubating: [],
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
  index.incubating = incubatingFor(
    index,
    undefined,
    new Set(
      index.groups.flatMap((group) => group.products.map((one) => one.id)),
    ),
  );
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
  const dir = pagePath(index.manualDir, "products", id);
  const landing = index.pageByPath.get(`${dir}/index.md`);
  const capabilities = childPages(index, dir).map((page) => {
    const item: NavItem = {
      ...navItem(page, page.path.slice(dir.length + 1, -3)),
      status: capabilityStatus(index, page.ast?.frontmatter.spec),
    };
    const audience = page.ast?.frontmatter.audience;
    if (audience) item.audience = audience;
    return item;
  });

  return {
    id,
    title: landing?.ast?.frontmatter.title ?? humanize(id),
    summary: landing?.ast?.frontmatter.summary,
    to: `/p/${id}`,
    order: landing?.ast?.frontmatter.order ?? Number.MAX_SAFE_INTEGER,
    capabilities,
    incubating: incubatingFor(index, id),
    changeCount: index.changesByOwner.get(id)?.length ?? 0,
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
 * rather than letting an operator page fall out of the rail entirely. The
 * derived branch carries neither incubating entries nor a change count; the
 * product's own branch already wears both.
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
    branches.push({
      ...product,
      capabilities: operators,
      incubating: [],
      changeCount: 0,
    });
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

/** One in-flight change touching a requirement row, and how it touches it. */
export type RequirementChange = { change: ChangeEntry; kind: DeltaKind };

/**
 * The in-flight changes whose delta names this requirement, newest movement
 * first. A rename is recorded under its FROM name — the row that exists until
 * the change archives — so the badge lands on the row being read today.
 */
export function changesForRequirement(
  index: ManualIndex,
  specId: string,
  requirementName: string,
): RequirementChange[] {
  const touching: RequirementChange[] = [];
  for (const change of changesForSpec(index, specId)) {
    const touched = deltaRequirement(change, specId, requirementName);
    if (touched) touching.push({ change, kind: touched.kind });
  }
  return touching.sort((a, b) => byLastMoved(a.change, b.change));
}

function deltaRequirement(
  change: ChangeEntry,
  specId: string,
  requirementName: string,
): DeltaRequirement | undefined {
  for (const delta of change.deltas) {
    if (delta.spec !== specId) continue;
    // A snapshot built before the reader named requirements carries none.
    const touched = findRequirement(delta.requirements ?? [], requirementName);
    if (touched) return touched;
  }
  return undefined;
}

/**
 * A capability's status. A durable spec is stable or changing; a spec that
 * lives only as a delta is incubating — being written right now. Everything
 * else is planned: the page describes an intended shape that neither the
 * durable store nor any change carries yet.
 */
export function capabilityStatus(
  index: ManualIndex,
  specId: string | undefined,
): CapabilityStatus {
  if (specId && index.specById.has(specId)) {
    return changesForSpec(index, specId).length > 0 ? "changing" : "stable";
  }
  if (specId && changesForSpec(index, specId).length > 0) return "incubating";
  return "planned";
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

/** Only a product's own children are capabilities; guides and topics are not.
 * A product directory sits one or two levels under `products/`, depending on
 * whether the store groups its products by the application shipping them. */
export function isProductDir(manualDir: string, dir: string): boolean {
  const prefix = pagePath(manualDir, "products");
  if (!dir.startsWith(`${prefix}/`)) return false;
  const rest = dir.slice(prefix.length + 1);
  return rest !== "" && rest.split("/").length <= 2;
}

/**
 * Where a change stands, read off the artifacts it has written and nothing
 * else. Deltas are what separates an idea from a specification; tasks are what
 * separates a specification from work. A change that has finished its tasks is
 * `complete` and waiting on the archive, not still in progress.
 */
export function laneOf(change: ChangeEntry): ChangeLane {
  if (change.deltas.length === 0) return "proposed";
  if (change.taskGroups.length === 0) return "specified";
  const { done, total } = taskTotals(change);
  return total > 0 && done === total ? "complete" : "in-progress";
}

/**
 * A change that is still only a reason: no delta, so it flips no capability
 * status, badges no row and bumps no product's count — it collects on the
 * In Flight board's own lane instead of standing among the work in flight. A
 * change that has written its deltas and no task list is `specified`, not
 * this: the finished state of a planning change is a specification, and filing
 * it as an unplanned thought hides the queue somebody has to promote.
 */
export function isProposal(change: ChangeEntry): boolean {
  return laneOf(change) === "proposed";
}

/** How a `depends_on:` id resolved: still in flight and holding this change
 * up, archived and therefore satisfied, or naming nothing at all. */
export type DependencyState = "blocking" | "satisfied" | "missing";

export type Dependency = {
  id: string;
  state: DependencyState;
  /** The change the id resolved to, when it resolved to one. */
  change?: ChangeEntry;
};

/**
 * A change's dependencies against the two sets a change can live in. The
 * archive is a separate artifact, so a caller that has not loaded it gets
 * `missing` for a shipped dependency — pass it whenever the answer matters.
 */
export function dependenciesOf(
  change: ChangeEntry,
  index: ManualIndex,
  archived: ChangeEntry[] = [],
): Dependency[] {
  const shipped = new Map(archived.map((one) => [one.id, one]));
  return (change.dependsOn ?? []).map((id) => {
    const inFlight = index.changeById.get(id);
    if (inFlight) return { id, state: "blocking", change: inFlight };
    const done = shipped.get(id);
    return done
      ? { id, state: "satisfied", change: done }
      : { id, state: "missing" };
  });
}

/** Proposals a capability page should show: they cite it, and they carry no
 * delta yet, so nothing else on the page would mention them. */
export function proposalsForSpec(
  index: ManualIndex,
  specId: string,
): ChangeEntry[] {
  return index.proposalsBySpec.get(specId) ?? [];
}

function deriveProposalsBySpec(snapshot: Snapshot): Map<string, ChangeEntry[]> {
  const proposals = snapshot.changes.filter(isProposal);
  const found = new Map<string, ChangeEntry[]>();
  if (proposals.length === 0) return found;

  const specsByCitedId = new Map<string, string[]>();
  const name = (id: string, specId: string) => {
    push(specsByCitedId, id, specId);
  };
  for (const spec of snapshot.specs) {
    name(spec.id, spec.id);
    for (const requirement of spec.requirements) {
      name(requirement.name, spec.id);
      for (const scenario of requirement.scenarios) {
        if (scenario.id) name(scenario.id, spec.id);
      }
    }
    for (const journey of spec.journeys ?? []) name(journey.id, spec.id);
    for (const one of spec.testCases ?? []) name(one.id, spec.id);
  }

  for (const proposal of proposals) {
    const about = new Set(
      (proposal.cites ?? []).flatMap((id) => specsByCitedId.get(id) ?? []),
    );
    for (const specId of about) push(found, specId, proposal);
  }
  return found;
}

/** A cited id as somewhere to click. `to` is absent when the id names nothing
 * the snapshot holds — a proposal may cite a capability that does not exist
 * yet, and saying so is better than dropping the line. */
export type CiteTarget = { id: string; label: string; to?: string };

/**
 * Where a proposal's `## References` id points. The `[[ref]]` resolver answers
 * for spec ids and permanent ids; a requirement heading is the third thing a
 * propose dialog writes, and it resolves by name against the row it came from.
 */
export function citeTarget(index: ManualIndex, id: string): CiteTarget {
  const resolved = resolveRef(id, index.snapshot);
  if (resolved.ok) {
    const { target } = resolved;
    const route = routeForSpec(index, target.spec);
    return {
      id,
      label: target.title,
      to: target.kind === "spec" ? route : `${route}#${target.id}`,
    };
  }

  for (const spec of index.snapshot.specs) {
    const requirement = findRequirement(spec.requirements, id);
    if (!requirement) continue;
    return {
      id,
      label: requirement.name,
      to: `${routeForSpec(index, spec.id)}#req-${slugify(requirement.name)}`,
    };
  }
  return { id, label: id };
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
 * A history ref against today's store. A page deleted since, a change already
 * archived, a file no reader claims — each keeps its label and loses its link,
 * because the commit happened whatever became of what it touched.
 */
export function feedRef(index: ManualIndex, ref: HistoryRef): FeedRef {
  const key = "id" in ref ? `${ref.kind}:${ref.id}` : `${ref.kind}:${ref.path}`;
  return { key, kind: ref.kind, ...linked(index, ref) };
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
  if (ref.kind === "spec") {
    const route = index.routeBySpec.get(ref.id);
    const page = route ? index.pageByRoute.get(route) : undefined;
    return {
      label: page?.ast?.frontmatter.title ?? ref.id,
      ...(route ? { to: route } : {}),
    };
  }
  // A change that is no longer in flight has archived: it has no card left to
  // anchor to, so the board itself is all there is to point at.
  if (ref.kind === "change") {
    const change = index.changeById.get(ref.id);
    return change
      ? { label: change.title, to: `/in-flight/${ref.id}` }
      : { label: ref.id, to: "/in-flight" };
  }
  if (ref.kind === "archived") return { label: ref.id, to: "/in-flight" };
  return { label: ref.path };
}

/** One capability's acceptance, as a reviewer has to see it to pick the next
 * job: what the suite claims, what it covers, and what it never mentions. */
export type QaRow = {
  spec: SpecEntry;
  route: string;
  /** The row's own shelf on that page — a case where there is a suite, the
   * first journey otherwise. */
  anchor?: string;
  journeys: number;
  suiteStatus?: TestSuiteStatus;
  cases: { draft: number; actual: number; deprecated: number; total: number };
  /** Scenarios a case traces, over the scenarios a case is owed — the
   * deliberately uncovered ones subtracted from both. */
  covered: number;
  countable: number;
  untraced: string[];
  outOfSuite: string[];
  error?: ItemError;
};

/** Every capability that has claimed acceptance of any kind. A spec with
 * neither journeys nor a suite has nothing to review yet, and listing it would
 * bury the ones that do. */
export function qaRows(index: ManualIndex): QaRow[] {
  const rows: QaRow[] = [];
  for (const spec of index.snapshot.specs) {
    const journeys = spec.journeys ?? [];
    const cases = spec.testCases ?? [];
    if (journeys.length === 0 && cases.length === 0 && !spec.testCasesError) {
      continue;
    }

    const traced = tracedBy(cases, journeys);
    const exempt = new Set(spec.outOfSuite ?? []);
    const issued = spec.requirements.flatMap((requirement) =>
      requirement.scenarios.flatMap((scenario) =>
        scenario.id ? [scenario.id] : [],
      ),
    );
    const countable = issued.filter((id) => !exempt.has(id));

    rows.push({
      spec,
      route: routeForSpec(index, spec.id),
      anchor: cases[0]?.id ?? journeys[0]?.id,
      journeys: journeys.length,
      ...(spec.testCasesStatus ? { suiteStatus: spec.testCasesStatus } : {}),
      cases: {
        draft: cases.filter((one) => one.status === "draft").length,
        actual: cases.filter((one) => one.status === "actual").length,
        deprecated: cases.filter((one) => one.status === "deprecated").length,
        total: cases.length,
      },
      covered: countable.filter((id) => traced.has(id)).length,
      countable: countable.length,
      untraced: countable.filter((id) => !traced.has(id)),
      outOfSuite: [...exempt],
      ...(spec.testCasesError ? { error: spec.testCasesError } : {}),
    });
  }
  return rows.sort(byReviewFirst);
}

/** The scenarios living cases trace. A case traces the journey it walks, and
 * reaches every scenario that journey's `Accepted by` lists; an older case
 * names a scenario outright, and reaches that one. A `deprecated` case is
 * history, not coverage — counting its traces is how a scenario reads as
 * covered after it loses its last case. */
export function tracedBy(
  cases: TestCase[],
  journeys: Journey[] = [],
): Set<string> {
  const accepted = new Map(journeys.map((one) => [one.id, one.acceptedBy]));
  return new Set(
    cases
      .filter((one) => one.status !== "deprecated")
      .flatMap((one) => one.traces)
      .flatMap((trace) => accepted.get(trace) ?? [trace]),
  );
}

/** A suite riding an in-flight change, beside the change that carries it — the
 * work `/qa`'s capability rows cannot see, because the capability may not
 * exist durably yet. Drafts first: they are what a reviewer is here for. */
export type ChangeSuiteRow = { change: ChangeEntry; suite: ChangeSuite };

export function changeSuiteRows(index: ManualIndex): ChangeSuiteRow[] {
  const rows: ChangeSuiteRow[] = [];
  for (const change of index.snapshot.changes) {
    for (const suite of change.suites ?? []) rows.push({ change, suite });
  }
  return rows.sort(
    (a, b) =>
      Number(Boolean(b.suite.error)) - Number(Boolean(a.suite.error)) ||
      b.suite.cases.draft - a.suite.cases.draft ||
      a.change.id.localeCompare(b.change.id) ||
      a.suite.spec.localeCompare(b.suite.spec),
  );
}

/** A suite nobody can read comes first — nothing else about it is knowable.
 * Then the drafts somebody has to stand behind, then the holes. */
function byReviewFirst(a: QaRow, b: QaRow): number {
  return (
    Number(Boolean(b.error)) - Number(Boolean(a.error)) ||
    b.cases.draft - a.cases.draft ||
    b.untraced.length - a.untraced.length ||
    a.spec.id.localeCompare(b.spec.id)
  );
}

/** A capability that exists only as a delta: no durable spec, no page, and no
 * way into it but the change that is writing it. */
export type Incubating = { specId: string; title: string; change: ChangeEntry };

export function incubatingFor(
  index: ManualIndex,
  product: string | undefined,
  homed: Set<string> = new Set(),
): Incubating[] {
  const found: Incubating[] = [];
  for (const [specId, changes] of index.changesBySpec) {
    if (index.specById.has(specId)) continue;
    if (index.routeBySpec.has(specId)) continue;
    const owner = ownerOfSpec(specId, index.snapshot.taxonomy);
    // Named product, or — with no product named — the leftovers no product
    // branch is going to show, which are the easiest ones to lose.
    if (product === undefined ? homed.has(owner) : owner !== product) continue;
    const change = [...changes].sort(byLastMoved)[0];
    if (!change) continue;
    found.push({
      specId,
      title: humanize(specId.split("/").at(-1) ?? specId),
      change,
    });
  }
  return found.sort((a, b) => a.title.localeCompare(b.title));
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

/** The day a change shipped: its archive directory's date prefix, with the
 * last commit behind it for a directory nobody dated. */
export function shippedDate(change: ChangeEntry): string | undefined {
  return change.shippedOn ?? change.lastMoved ?? (change.created || undefined);
}

/** Newest shipped first, for the archive. Not `byLastMoved`: the timeline
 * shows the shipped day, and an order read off anything else puts a change
 * under a heading that disagrees with its own date. */
export function byShipped(a: ChangeEntry, b: ChangeEntry): number {
  const left = Date.parse(shippedDate(a) ?? "");
  const right = Date.parse(shippedDate(b) ?? "");
  return (
    (Number.isNaN(right) ? 0 : right) - (Number.isNaN(left) ? 0 : left) ||
    a.id.localeCompare(b.id)
  );
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
