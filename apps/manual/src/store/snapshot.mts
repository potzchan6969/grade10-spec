import { join } from "node:path";
import type { Archive, Snapshot } from "../api/types.ts";
import { newestMtime } from "./disk.mts";
import { type GitIndex, readGitIndex } from "./git.mts";
import { readArchivedChanges, readChanges } from "./read-changes.mts";
import {
  deriveTaxonomy,
  readManualConfig,
  readManualPages,
} from "./read-manual.mts";
import { discoverSpecs, readSpecs } from "./read-specs.mts";

/** Both artifacts share one history walk — the only expensive part of a read. */
export type Store = { snapshot: Snapshot; archive: Archive };

const TRACKED = ["openspec", "manual"];

export async function readStore(root: string): Promise<Store> {
  const git = await readGitIndex(root, TRACKED);
  return composeStore(root, git);
}

export function composeStore(root: string, git: GitIndex): Store {
  const generatedAt = new Date().toISOString();
  const config = readManualConfig(root);
  const shape = discoverSpecs(root);

  return {
    snapshot: {
      generatedAt,
      storeHead: git.head,
      config,
      taxonomy: deriveTaxonomy(shape, config),
      pages: readManualPages(root, git),
      specs: readSpecs(root, git),
      changes: readChanges(root, git),
    },
    archive: {
      generatedAt,
      storeHead: git.head,
      changes: readArchivedChanges(root, git),
    },
  };
}

/** Cheap enough to run on every poll; it changes whenever a file the store
 * reads is written or committed. */
export function storeStamp(root: string, head: string): string {
  const newest = TRACKED.map((dir) => newestMtime(join(root, dir)));
  return `${head}:${Math.max(...newest)}`;
}
