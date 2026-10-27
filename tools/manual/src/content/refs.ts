/** `[[…]]` inline references in prose. `[[capability-id]]` links the page
 * whose `spec:` names that capability; anything else — an item id, a
 * `spec#item` form — resolves to nothing, and says to link the capability.
 * The grammar never sees these — prose stays verbatim text — so resolution is
 * a render- and check-time concern with one home, here. */

export const REF_PATTERN = /\[\[([^[\]]+)\]\]/g;

export type ResolvedRef =
  | { ok: true; spec: string; title: string }
  | { ok: false; reason: string };

/** `titles` is every capability a page documents, against that page's title. */
export function resolveRef(
  raw: string,
  titles: ReadonlyMap<string, string>,
): ResolvedRef {
  const text = raw.trim();
  if (text === "") return { ok: false, reason: "empty reference" };

  const title = titles.get(text);
  if (title !== undefined) return { ok: true, spec: text, title };

  if (text.includes("#"))
    return { ok: false, reason: "a reference names a capability, not an item" };

  return { ok: false, reason: `no page documents \`${text}\`` };
}
