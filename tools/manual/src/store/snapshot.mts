import { join } from "node:path";
import type {
  Archive,
  CheckWarning,
  MainState,
  Snapshot,
  SpecEntry,
} from "../api/types.ts";
import { DESIGN_SYNC_REPORT, readDesignSync } from "./design-sync.mts";
import { newestMtime } from "./disk.mts";
import { type GitIndex, readGitIndex, readMainStates } from "./git.mts";
import {
  readArchivedChanges,
  readChanges,
  readIssuedIds,
} from "./read-changes.mts";
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
  const store = composeStore(root, git, await checkWarnings(root, git));
  await markMainStates(root, store);
  return store;
}

/** Where each change stands against the store's main — async because it asks
 * git, so the sync compose stays usable and a caller without a clone (tests,
 * the preview server) simply carries no state. */
async function markMainStates(root: string, store: Store): Promise<void> {
  const changes = store.snapshot.changes;
  const states: Map<string, MainState> = await readMainStates(
    root,
    changes.map((change) => change.id),
  );
  for (const change of changes) {
    const state = states.get(change.id);
    if (state) change.mainState = state;
  }
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
  const specs = readSpecs(root, git);
  markIssuedIds(root, specs);

  return {
    snapshot: {
      generatedAt,
      storeHead: git.head,
      config,
      taxonomy: deriveTaxonomy(shape, config),
      pages: readManualPages(root, git),
      specs,
      changes: readChanges(root, git),
      assets: readManualAssets(root),
      history: git.history,
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

/** What each capability has issued, counting the deltas nobody has folded yet.
 * A capability page states the ceiling so the next author clears it instead of
 * reusing an id the durable file cannot see. */
function markIssuedIds(root: string, specs: SpecEntry[]): void {
  const issued = readIssuedIds(root, durableIds(specs));
  for (const spec of specs) {
    const marks = issued.get(spec.id.split("/").pop() ?? spec.id);
    if (marks) spec.issuedThrough = marks;
  }
}

function* durableIds(specs: SpecEntry[]): Generator<string> {
  for (const spec of specs) {
    for (const requirement of spec.requirements) {
      for (const scenario of requirement.scenarios) {
        if (scenario.id) yield scenario.id;
      }
    }
    for (const journey of spec.journeys ?? []) yield journey.id;
    for (const one of spec.testCases ?? []) yield one.id;
  }
}

/** Cheap enough to run on every poll; it changes whenever a file the store
 * reads is written or committed — the design-sync report included, so dev
 * re-reads it the moment the nightly lands. */
export function storeStamp(root: string, head: string): string {
  const watched = [...TRACKED, DESIGN_SYNC_REPORT.split("/")[0]];
  const newest = watched.map((dir) => newestMtime(join(root, dir)));
  return `${head}:${Math.max(...newest)}`;
}
