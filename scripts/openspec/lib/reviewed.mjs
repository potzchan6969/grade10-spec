/**
 * The read record: what one artifact was last read again against.
 *
 * `plan-land.mjs --reviewed` is the only caller — a read that changed nothing
 * writes the line, commits it and pushes it in the landing's own transaction
 * (`Q42`), so nothing reaches `main` by an ad-hoc push.
 *
 * The id is the content id of what is before the artifact, which the store
 * computes: `contentIdOf` over the artifact's `upstream:` texts in the
 * schema's order, each with its whitespace collapsed, read here through
 * `entry.upstream[<artifact>].id`. Nothing here hashes anything, so the line
 * this writes and the freshness a surface shows cannot disagree.
 *
 * Three facts read the same everywhere but here, so this tells them apart
 * rather than reporting all three as one skip:
 *
 *   - drawn from nothing in this change — the proposal of a change that links
 *     no page section — has no id to write and no line to read it back
 *     against
 *   - waived — a waiver stands for the file, so nothing after it waits on it
 *   - not written yet — the schema still names what is before it, but the
 *     artifact itself is not on the branch to read again
 */
import { waivedOf } from "../../../tools/manual/src/api/waivers.ts";

/**
 * What one artifact's `reviewed:` line holds: `{ content, items }` — the
 * content id and the files it was read against — or `{ refusal }` where there
 * is no line to write, naming which of the three facts it is.
 */
export function readAgainst(entry, artifacts, id) {
  const read = entry.upstream?.[id];
  if (read !== undefined) return { content: read.id, items: read.items };
  if (waivedOf(artifacts, entry).has(id))
    return { refusal: `${id}: waived — nothing to read it against` };
  if (!entry.written?.includes(id))
    return { refusal: `${id}: not written yet — nothing to read it against` };
  return {
    refusal: `${id}: nothing before it in this change — no line to write`,
  };
}
