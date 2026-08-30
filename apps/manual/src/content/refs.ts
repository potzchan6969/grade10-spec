import type { Snapshot, SpecEntry } from "../api/types.js";

/** `[[…]]` inline references in prose. A bare item id resolves inside the
 * page's own spec; anything that could mean two things must qualify as
 * `[[spec-id#item-id]]`. `[[spec-id]]` names the capability itself. The
 * grammar never sees these — prose stays verbatim text — so resolution is
 * a render- and check-time concern with one home, here. */

export const REF_PATTERN = /\[\[([^[\]]+)\]\]/g;

export type RefTarget =
  | { kind: "spec"; spec: string; title: string }
  | { kind: "item"; spec: string; id: string; title: string };

export type ResolvedRef =
  | { ok: true; target: RefTarget }
  | { ok: false; reason: string };

type ItemHit = { spec: string; title: string };

/** Every id an item ref can name: scenarios, user stories, test cases. */
function itemsOf(spec: SpecEntry): Map<string, string> {
  const items = new Map<string, string>();
  for (const requirement of spec.requirements)
    for (const scenario of requirement.scenarios)
      if (scenario.id) items.set(scenario.id, scenario.name);
  for (const journey of spec.journeys ?? [])
    items.set(journey.id, journey.title);
  for (const testCase of spec.testCases ?? [])
    items.set(testCase.id, testCase.title);
  return items;
}

export function resolveRef(
  raw: string,
  snapshot: Snapshot,
  pageSpec?: string,
): ResolvedRef {
  const text = raw.trim();
  if (text === "") return { ok: false, reason: "empty reference" };

  const hash = text.indexOf("#");
  if (hash !== -1) {
    const specId = text.slice(0, hash).trim();
    const itemId = text.slice(hash + 1).trim();
    const spec = snapshot.specs.find((entry) => entry.id === specId);
    if (!spec) return { ok: false, reason: `no spec \`${specId}\`` };
    const title = itemsOf(spec).get(itemId);
    if (title === undefined)
      return { ok: false, reason: `\`${specId}\` has no item \`${itemId}\`` };
    return {
      ok: true,
      target: { kind: "item", spec: specId, id: itemId, title },
    };
  }

  const spec = snapshot.specs.find((entry) => entry.id === text);
  if (spec)
    return {
      ok: true,
      target: { kind: "spec", spec: spec.id, title: spec.title },
    };

  const hits: ItemHit[] = [];
  for (const entry of snapshot.specs) {
    const title = itemsOf(entry).get(text);
    if (title !== undefined) hits.push({ spec: entry.id, title });
  }
  if (hits.length === 0)
    return { ok: false, reason: `nothing named \`${text}\`` };

  const inPage = pageSpec && hits.find((hit) => hit.spec === pageSpec);
  const hit = inPage || (hits.length === 1 ? hits[0] : undefined);
  if (!hit)
    return {
      ok: false,
      reason: `\`${text}\` lives in ${hits.map((h) => `\`${h.spec}\``).join(" and ")} — qualify it as \`[[<spec>#${text}]]\``,
    };
  return {
    ok: true,
    target: { kind: "item", spec: hit.spec, id: text, title: hit.title },
  };
}
