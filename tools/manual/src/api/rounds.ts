// Explicit extensions: `read-changes.mts` loads this under the store's own
// nodenext resolution, which resolves no extensionless path.

import { roundArtifactOf } from "../store/read-rounds.mts";
import type { RoundRow, TaskGroup } from "./types.ts";

export { roundArtifactOf };

/**
 * `rounds.md`, read for what it alone can say: which round raised a `Q<n>`,
 * and which ticked group still carries no row.
 */

/** Every `Q<n>` an Asked cell names, in the order written, deduplicated: `"Q1,
 * Q2"` and `` `Q1`, `Q2` `` (backticked, the way a citation elsewhere in the
 * store wears it) both read the same, and a cell that raised nothing (`-`)
 * reads as none. */
export function askedIdsOf(cell: string): string[] {
  return [...new Set(cell.match(/Q\d+/g) ?? [])];
}

/** A ticked task group no round row names — the Rounds row's own "shown as
 * having none" (`shared-planning-agent-rounds-SC-51`). An unclaimed,
 * untouched group is not this: nothing has landed for it yet, so there is
 * nothing its round could be missing. */
export function roundlessGroupsOf(
  rounds: RoundRow[],
  taskGroups: TaskGroup[],
): TaskGroup[] {
  const named = new Set(rounds.map((row) => roundArtifactOf(row.artifact)));
  return taskGroups.filter(
    (group) => group.done > 0 && !named.has(roundArtifactOf(group.num)),
  );
}
