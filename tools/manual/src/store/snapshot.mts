import { join } from "node:path";
import type {
  CheckWarning,
  ReferenceDocument,
  Snapshot,
} from "../api/types.ts";
import { DESIGN_SYNC_REPORT, readDesignSync } from "./design-sync.mts";
import { newestMtime } from "./disk.mts";
import { type GitIndex, readRootsGitIndex, git as runGit } from "./git.mts";
import {
  deriveTaxonomy,
  readManualAssets,
  readManualConfig,
  readManualPages,
  readManualSuites,
} from "./read-manual.mts";
import { readReferences, readReferencesReadme } from "./read-references.mts";
import type { Roots } from "./roots.mts";
import { signWarningCallouts } from "./signatures.mts";
import { checkWarnings } from "./warnings.mts";

export type Store = {
  snapshot: Snapshot;
  references: ReferenceDocument[];
};

export async function readStore(roots: Roots): Promise<Store> {
  const index = await readRootsGitIndex(roots);
  const store = composeStore(roots, index, await checkWarnings(roots, index));
  await signWarningCallouts(roots, store.snapshot.pages);
  return store;
}

export function composeStore(
  roots: Roots,
  git: GitIndex,
  warnings: CheckWarning[] = [],
): Store {
  const config = readManualConfig(roots);
  const designSync = readDesignSync(roots.store);
  const references = readReferences(roots.store, git);
  const referencesReadme = readReferencesReadme(roots.store);
  const { pages } = readManualPages(roots, git);

  return {
    snapshot: {
      generatedAt: new Date().toISOString(),
      storeHead: git.head,
      config,
      taxonomy: deriveTaxonomy(roots, config),
      manualDir: roots.manual,
      pages,
      suites: readManualSuites(roots),
      assets: readManualAssets(roots),
      references: references.map(({ text: _text, ...entry }) => entry),
      ...(referencesReadme === undefined ? {} : { referencesReadme }),
      history: git.history,
      warnings,
      ...(designSync ? { designSync } : {}),
    },
    references,
  };
}

/** Every head a poll must notice moving: the store's, and the content
 * repository's when the manual lives in its own. */
export async function readHeads(roots: Roots): Promise<string> {
  const store = (await runGit(roots.store, ["rev-parse", "HEAD"])).trim();
  if (roots.own) return store;
  const content = (await runGit(roots.content, ["rev-parse", "HEAD"])).trim();
  return `${store}+${content}`;
}

/** Every directory an artifact is read from. The stamp measures these and the
 * dev server watches these, from one list, so a file that changes what the
 * manual says can never be one the two disagree about. */
export function storeDirs(roots: Roots): string[] {
  return [
    join(roots.store, DESIGN_SYNC_REPORT.split("/")[0]),
    join(roots.store, "docs", "references"),
    join(roots.content, roots.manual),
  ];
}

/** Cheap enough to run on every poll; it changes whenever a file the store
 * reads is written or committed — the design-sync report included, so dev
 * re-reads it the moment the nightly lands. */
export function storeStamp(roots: Roots, heads: string): string {
  const newest = storeDirs(roots).map((dir) => newestMtime(dir));
  return `${heads}:${Math.max(...newest)}`;
}
