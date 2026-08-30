import { join } from "node:path";
import type { Archive, CheckWarning, Snapshot } from "../api/types.ts";
import { DESIGN_SYNC_REPORT, readDesignSync } from "./design-sync.mts";
import { newestMtime } from "./disk.mts";
import { type GitIndex, readGitIndex } from "./git.mts";
import { readArchivedChanges, readChanges } from "./read-changes.mts";
import {
  deriveTaxonomy,
  readManualAssets,
  readManualConfig,
  readManualPages,
} from "./read-manual.mts";
import { discoverSpecs, readSpecs } from "./read-specs.mts";
import { checkWarnings } from "./warnings.mts";

/** Both artifacts share one history walk — the only expensive part of a read. */
export type Store = { snapshot: Snapshot; archive: Archive };

const TRACKED = ["openspec", "manual"];

export async function readStore(root: string): Promise<Store> {
  const git = await readGitIndex(root, TRACKED);
  return composeStore(root, git, await checkWarnings(root, git));
}

export function composeStore(
  root: string,
  git: GitIndex,
  warnings: CheckWarning[] = [],
): Store {
  const generatedAt = new Date().toISOString();
  const config = readManualConfig(root);
  const shape = discoverSpecs(root);
  const designSync = readDesignSync(root);

  return {
    snapshot: {
      generatedAt,
      storeHead: git.head,
      config,
      taxonomy: deriveTaxonomy(shape, config),
      pages: readManualPages(root, git),
      specs: readSpecs(root, git),
      changes: readChanges(root, git),
      assets: readManualAssets(root),
      warnings,
      ...(designSync ? { designSync } : {}),
    },
    archive: {
      generatedAt,
      storeHead: git.head,
      changes: readArchivedChanges(root, git),
    },
  };
}

/** Cheap enough to run on every poll; it changes whenever a file the store
 * reads is written or committed — the design-sync report included, so dev
 * re-reads it the moment the nightly lands. */
export function storeStamp(root: string, head: string): string {
  const watched = [...TRACKED, DESIGN_SYNC_REPORT.split("/")[0]];
  const newest = watched.map((dir) => newestMtime(join(root, dir)));
  return `${head}:${Math.max(...newest)}`;
}
