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
import {
  type GitIndex,
  readMainStates,
  readRootsGitIndex,
  git as runGit,
} from "./git.mts";
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
import type { Roots } from "./roots.mts";
import { signWarningCallouts } from "./signatures.mts";
import { checkWarnings } from "./warnings.mts";

/** Both artifacts share one history walk — the only expensive part of a read. */
export type Store = { snapshot: Snapshot; archive: Archive };

export async function readStore(roots: Roots): Promise<Store> {
  const index = await readRootsGitIndex(roots);
  const store = composeStore(roots, index, await checkWarnings(roots, index));
  await signWarningCallouts(roots, store.snapshot.pages);
  await markMainStates(roots.store, store);
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
  roots: Roots,
  git: GitIndex,
  warnings: CheckWarning[] = [],
): Store {
  const generatedAt = new Date().toISOString();
  const config = readManualConfig(roots.content);
  const shape = discoverSpecs(roots.store);
  const designSync = readDesignSync(roots.store);
  const specs = readSpecs(roots.store, git);
  markIssuedIds(roots.store, specs);

  return {
    snapshot: {
      generatedAt,
      storeHead: git.head,
      config,
      taxonomy: deriveTaxonomy(shape, config, roots.own),
      pages: readManualPages(roots.content, git),
      specs,
      changes: readChanges(roots.store, git),
      assets: readManualAssets(roots.content),
      history: git.history,
      warnings,
      ...(designSync ? { designSync } : {}),
    },
    archive: {
      generatedAt,
      storeHead: git.head,
      changes: readArchivedChanges(roots.store, git),
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

/** Every head a poll must notice moving: the store's, and the content
 * repository's when the manual lives in its own. */
export async function readHeads(roots: Roots): Promise<string> {
  const head = (await runGit(roots.store, ["rev-parse", "HEAD"])).trim();
  if (roots.own) return head;
  const content = (await runGit(roots.content, ["rev-parse", "HEAD"])).trim();
  return `${head}+${content}`;
}

/** Cheap enough to run on every poll; it changes whenever a file the store
 * reads is written or committed — the design-sync report included, so dev
 * re-reads it the moment the nightly lands. */
export function storeStamp(roots: Roots, heads: string): string {
  const watched = [
    join(roots.store, "openspec"),
    join(roots.store, DESIGN_SYNC_REPORT.split("/")[0]),
    join(roots.content, "manual"),
  ];
  const newest = watched.map((dir) => newestMtime(dir));
  return `${heads}:${Math.max(...newest)}`;
}
