import { createHash } from "node:crypto";

/**
 * The content id of what is before an artifact: what a `reviewed:` line holds,
 * and what the next read compares against.
 *
 * One hasher, read here and written by the round, so the reader and the writer
 * can never disagree about whether anything moved. Each text has its
 * whitespace collapsed and trimmed and nothing else touched — a link target
 * and a scenario id are text, and normalising them the way `stale.mjs` does
 * would hash two different upstreams alike. The texts are joined by a NUL, so
 * no two of them can run together into one, and eight hexadecimal characters
 * is short enough to read in a record and long enough that no two upstreams
 * in this store collide.
 *
 * Store-side rather than in `src/api`: `node:crypto` has no synchronous
 * browser answer, and `src/api` is the app's half of this package. The store
 * hashes and the app compares — `behindOf` is a pure comparison over what this
 * returns, so nothing in the browser needs a hasher at all.
 */
export function contentIdOf(texts: string[]): string {
  const joined = texts
    .map((text) => text.replace(/\s+/g, " ").trim())
    .join("\0");
  return createHash("sha256").update(joined).digest("hex").slice(0, 8);
}
