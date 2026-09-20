/**
 * What a test reaches for that the Worker never has: the store's own team map,
 * read off the disk so the relay's reading of it cannot drift from the
 * store's.
 *
 * Declared here rather than by adding node's types to this package. `src`
 * runs in a Worker, where there is no `node:*` at all, and the bundle check
 * holds it to that; a test runs under vitest, which is node — but only for
 * one function and the url it reads from.
 */
declare module "node:fs" {
  export function readFileSync(path: string | URL, encoding: "utf8"): string;
}

interface ImportMeta {
  /** This module's own url, which a path to the store is read against. */
  readonly url: string;
}
