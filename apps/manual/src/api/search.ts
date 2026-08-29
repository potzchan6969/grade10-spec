import MiniSearch, { type SearchResult } from "minisearch";
import type { Block, BodyItem, PageAst } from "../content/grammar";
import { plainInline } from "../content/inline";
import { requirementAnchor, scenarioAnchor } from "./anchors";
import { type ManualIndex, routeForSpec } from "./derive";

export type SearchKind = "page" | "spec" | "change";

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
  change: "In flight",
};

const GROUP_ORDER: SearchKind[] = ["page", "spec", "change"];

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

function bodyText(items: (Block | BodyItem)[]): string {
  const parts: string[] = [];
  for (const item of items) {
    if (item.type === "prose") parts.push(plainText(item.markdown));
    else if (item.type === "callout") parts.push(bodyText(item.body));
    else if (item.type === "detail") {
      parts.push(item.title, bodyText(item.body));
    } else if (item.type === "flow") {
      parts.push(item.title, bodyText(item.body));
    }
  }
  return parts.join(" ");
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

  for (const change of index.snapshot.changes) {
    docs.push({
      id: `change:${change.id}`,
      kind: "change",
      title: plainInline(change.title),
      subtitle: `${change.id} · ${change.status}`,
      body: `${change.id} ${plainText(change.why)}`,
      to: `/planning#${change.id}`,
    });
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
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 4, subtitle: 2 },
    },
  });
  mini.addAll(buildDocs(index));
  return mini;
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
