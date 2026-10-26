import type { Snapshot, SpecEntry } from "../api/types.js";

/** `[[…]]` inline references in prose. `[[spec-id]]` links the capability's
 * page; an item id (a scenario, a journey, a test case) is never cited on a
 * page, so it resolves to nothing and says which capability to link instead.
 * The grammar never sees these — prose stays verbatim text — so resolution is
 * a render- and check-time concern with one home, here. */

export const REF_PATTERN = /\[\[([^[\]]+)\]\]/g;

export type ResolvedRef =
  | { ok: true; spec: string; title: string }
  | { ok: false; reason: string };

function itemIds(spec: SpecEntry): Set<string> {
  const ids = new Set<string>();
  for (const requirement of spec.requirements)
    for (const scenario of requirement.scenarios)
      if (scenario.id) ids.add(scenario.id);
  for (const journey of spec.journeys ?? []) ids.add(journey.id);
  for (const testCase of spec.testCases ?? []) ids.add(testCase.id);
  return ids;
}

export function resolveRef(raw: string, snapshot: Snapshot): ResolvedRef {
  const text = raw.trim();
  if (text === "") return { ok: false, reason: "empty reference" };

  const spec = snapshot.specs.find((entry) => entry.id === text);
  if (spec) return { ok: true, spec: spec.id, title: spec.title };

  if (text.includes("#"))
    return { ok: false, reason: "a reference names a capability, not an item" };

  const owners = snapshot.specs.filter((entry) => itemIds(entry).has(text));
  if (owners.length > 0) {
    const names = owners.map((entry) => `\`${entry.id}\``).join(" and ");
    return {
      ok: false,
      reason: `\`${text}\` is an item of ${names}; link its capability as \`[[<capability>]]\``,
    };
  }

  return { ok: false, reason: `nothing named \`${text}\`` };
}
