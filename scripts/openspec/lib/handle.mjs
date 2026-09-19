/**
 * A handle, spelled the one way every reader of it agrees on.
 *
 * Its own module, with no import of its own, because `team.mjs` — otherwise
 * the one place this lived — imports `node:fs` to read the map itself. A
 * browser bundles `api/handle.ts` and `editor/session.ts`, which cannot carry
 * that import in, so the pure part moves here and `team.mjs` re-exports it:
 * one definition, read by the store's rules, the browser's remembered handle,
 * and everything in between.
 */

/**
 * A handle as every reader in this store spells it: no leading `@`, no case.
 *
 * One spelling, here, because the map is keyed by it and the record's
 * `hands:`, `landed_by:`, `owner:` and owner tags are all matched against it —
 * two readers that trimmed differently would disagree about whether the store
 * knows a person.
 */
export const handleOf = (handle) =>
  String(handle).replace(/^@/, "").trim().toLowerCase();

/**
 * The shape a handle takes wherever `hands:`, `landed_by:` or an owner tag
 * writes one: one token, not a sentence, a list or a name with spaces. What
 * `handleOf` normalizes is checked against this before it is read as a
 * person rather than text that merely looks like one - the one pattern
 * `record.mjs`'s `hands`/`landed_by` rules and `read-changes.mts`'s owner
 * reading both held their own copy of.
 */
export const isHandle = (value) => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value);
