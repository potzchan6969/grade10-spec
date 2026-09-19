import type { RoundRow, TaskGroup } from "./types";

/**
 * `rounds.md`, read for what it alone can say: which draft a round was
 * reading when it raised a `Q<n>`, and which ticked group still carries no
 * row.
 *
 * `decisions.md`'s own row never names the artifact under challenge — every
 * open question it carries reads `artifact: "decisions"`, the file the row
 * lives in. The round's own line is the record of what it actually read, so
 * the change page's artifact rows pair a question's id back to it from here
 * rather than from the question itself.
 */

/** Every `Q<n>` an Asked cell names, in the order written, deduplicated: `"Q1,
 * Q2"` and `` `Q1`, `Q2` `` (backticked, the way a citation elsewhere in the
 * store wears it) both read the same, and a cell that raised nothing (`-`)
 * reads as none. */
export function askedIdsOf(cell: string): string[] {
  return [...new Set(cell.match(/Q\d+/g) ?? [])];
}

/** Which artifact or task group each open `Q<n>` was raised against, from
 * every round's own Asked column. A later round's line wins where an id
 * somehow appears more than once, since it is the more recent reading. */
export function artifactOfAskedQuestions(
  rounds: RoundRow[],
): Map<string, string> {
  const found = new Map<string, string>();
  for (const round of rounds) {
    for (const id of askedIdsOf(round.asked)) found.set(id, round.artifact);
  }
  return found;
}

/** A row's `Artifact` cell as this compares it against a task group's own
 * number: an artifact id as written, and a group's number however the row
 * spelled it — `3`, `3.` or `group 3` — the same normalisation
 * `tools/manual/check/rounds.mjs`'s own `groupOf` applies. */
function groupCellOf(cell: string): string {
  return String(cell ?? "")
    .trim()
    .replace(/^group\s+/i, "")
    .replace(/\.$/, "");
}

/** A ticked task group no round row names — the Rounds row's own "shown as
 * having none" (`shared-planning-agent-rounds-SC-51`). An unclaimed,
 * untouched group is not this: nothing has landed for it yet, so there is
 * nothing its round could be missing. */
export function roundlessGroupsOf(
  rounds: RoundRow[],
  taskGroups: TaskGroup[],
): TaskGroup[] {
  const named = new Set(rounds.map((row) => groupCellOf(row.artifact)));
  return taskGroups.filter(
    (group) => group.done > 0 && !named.has(groupCellOf(group.num)),
  );
}
