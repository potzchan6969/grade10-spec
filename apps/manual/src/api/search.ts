import MiniSearch, { type SearchResult } from "minisearch";
import type { Block, BodyItem, PageAst } from "../content/grammar";
import { plainInline } from "../content/inline";
import { requirementAnchor, scenarioAnchor } from "./anchors";
import { type ManualIndex, routeForSpec } from "./derive";

export type SearchKind = "page" | "spec" | "case" | "change";

export type SearchDoc = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  body: string;
  to: string;
};

export type SearchHit = SearchDoc & { score: number };
export type SearchGroup = {
  kind: SearchKind;
  label: string;
  hits: SearchHit[];
};

const GROUP_LABELS: Record<SearchKind, string> = {
  page: "Pages",
  spec: "Requirements & scenarios",
  case: "Test cases",
  change: "In flight",
};

const GROUP_ORDER: SearchKind[] = ["page", "spec", "case", "change"];

/** Markdown read as words: enough for an index, never re-rendered from here. */
function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A page as words. Embeds count: the title a designer wrote on a Figma frame
 * and the story id a card points at are the only names those visuals have, and
 * a page they sit on is the page somebody searching for them wants.
 */
function bodyText(items: (Block | BodyItem)[]): string {
  const parts: string[] = [];
  for (const item of items) {
    if (item.type === "prose") parts.push(plainText(item.markdown));
    else if (item.type === "callout") parts.push(bodyText(item.body));
    else if (item.type === "detail") {
      parts.push(item.title, bodyText(item.body));
    } else if (item.type === "flow") {
      parts.push(item.title, bodyText(item.body));
    } else if (item.type === "figma") {
      parts.push(item.title, item.set ?? "");
    } else if (item.type === "story") {
      parts.push(item.title ?? "", item.id, item.id.replace(/-/g, " "));
    } else if (item.type === "image") {
      parts.push(item.alt, item.caption ?? "");
    }
  }
  return parts.filter(Boolean).join(" ");
}

function pageText(ast: PageAst): string {
  return [ast.frontmatter.summary ?? "", bodyText(ast.blocks)].join(" ").trim();
}

export function buildDocs(index: ManualIndex): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const page of index.pages) {
    if (!page.route || !page.ast) continue;
    docs.push({
      id: `page:${page.path}`,
      kind: "page",
      title: page.ast.frontmatter.title,
      subtitle: page.ast.frontmatter.summary ?? page.path,
      body: pageText(page.ast),
      to: page.route,
    });
  }

  for (const spec of index.snapshot.specs) {
    const route = routeForSpec(index, spec.id);
    for (const requirement of spec.requirements) {
      const anchor = requirementAnchor(requirement);
      docs.push({
        id: `spec:${spec.id}#${anchor}`,
        kind: "spec",
        title: requirement.name,
        subtitle: `${spec.title} · requirement`,
        body: requirement.text,
        to: `${route}#${anchor}`,
      });
      for (const scenario of requirement.scenarios) {
        const scenarioId = scenarioAnchor(requirement, scenario);
        docs.push({
          id: `spec:${spec.id}#${scenarioId}`,
          kind: "spec",
          title: scenario.name,
          subtitle: `${spec.title} · ${requirement.name}`,
          body: scenario.text,
          to: `${route}#${scenarioId}`,
        });
      }
    }
  }

  for (const spec of index.snapshot.specs) {
    const route = routeForSpec(index, spec.id);
    for (const testCase of spec.testCases ?? []) {
      docs.push({
        id: `case:${spec.id}#${testCase.id}`,
        kind: "case",
        title: `${testCase.id} ${testCase.title}`,
        subtitle: `${spec.title} · ${testCase.status}`,
        body: `${testCase.id} ${testCase.traces.join(" ")}`,
        to: `${route}#${testCase.id}`,
      });
    }
  }

  // A delta is where the words a change is about actually live: 157 of the
  // in-flight requirements are ADDED, so nothing durable carries their text and
  // searching for what somebody is building would find the change by its title
  // or not at all.
  for (const change of index.snapshot.changes) {
    const title = plainInline(change.title);
    docs.push({
      id: `change:${change.id}`,
      kind: "change",
      title,
      subtitle: `${change.id} · ${change.status}`,
      body: [
        change.id,
        plainText(change.why),
        ...change.deltas.map((delta) => delta.spec),
      ].join(" "),
      to: `/planning#${change.id}`,
    });

    for (const delta of change.deltas) {
      for (const requirement of delta.requirements) {
        docs.push({
          id: `change:${change.id}#${delta.spec}#${requirement.kind}#${requirement.name}`,
          kind: "change",
          title: requirement.name,
          subtitle: `${title} · ${requirement.kind} ${delta.spec}`,
          body: plainText(requirement.text ?? ""),
          to: `/planning#${change.id}`,
        });
      }
    }
  }

  return docs;
}

const engines = new WeakMap<ManualIndex, MiniSearch<SearchDoc>>();

/** Built on first use, then kept against the snapshot it was built from. */
export function searchIndexFor(index: ManualIndex): MiniSearch<SearchDoc> {
  const cached = engines.get(index);
  if (cached) return cached;
  const engine = buildSearchIndex(index);
  engines.set(index, engine);
  return engine;
}

export function buildSearchIndex(index: ManualIndex): MiniSearch<SearchDoc> {
  const mini = new MiniSearch<SearchDoc>({
    fields: ["title", "subtitle", "body"],
    storeFields: ["kind", "title", "subtitle", "to"],
    searchOptions: {
      // Prefix and fuzzy belong to the word being typed, not to every word in
      // the query: `prefix: true` made a bare `a` match every token starting
      // with one, which is how a common word won a two-word search.
      prefix: (_term, position, terms) => position === terms.length - 1,
      fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
      boost: { title: 4, subtitle: 2 },
    },
  });
  mini.addAll(buildDocs(index));
  return mini;
}

/** What a query found, and whether it found what was actually asked for. */
export type SearchOutcome = {
  hits: SearchResult[];
  /** Nothing matched every word; these match some of them. */
  partial: boolean;
};

/**
 * A multi-word query means all of the words. OR-combining is why `gift card`
 * came back eighteen confident results about cards and none about gift cards:
 * one common word carried the whole query. So every word has to land — and
 * when none of them do together, the near misses are still shown, said out
 * loud as near misses rather than passed off as answers.
 */
export function runSearch(
  engine: MiniSearch<SearchDoc>,
  query: string,
): SearchOutcome {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { hits: engine.search(query), partial: false };
  const all = engine.search(query, { combineWith: "AND" });
  return all.length > 0
    ? { hits: all, partial: false }
    : { hits: engine.search(query), partial: true };
}

export function groupResults(
  results: SearchResult[],
  perGroup = 5,
): SearchGroup[] {
  const buckets = new Map<SearchKind, SearchHit[]>();
  for (const result of results) {
    const hit = result as unknown as SearchHit;
    const list = buckets.get(hit.kind) ?? [];
    if (list.length < perGroup) list.push(hit);
    buckets.set(hit.kind, list);
  }
  return GROUP_ORDER.filter((kind) => (buckets.get(kind)?.length ?? 0) > 0).map(
    (kind) => ({
      kind,
      label: GROUP_LABELS[kind],
      hits: buckets.get(kind) ?? [],
    }),
  );
}
