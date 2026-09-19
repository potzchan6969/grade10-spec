/*
 * RULE `round`: a change carries a row for the work it has already done.
 *
 * A round that found nothing and a round that never ran read the same
 * everywhere but here: `rounds.md` is where a landing says which readers it
 * dispatched, what stood and what it asked. So the two facts the store can
 * check are checked — an artifact on `main` with no row naming it, and a
 * ticked task group with no row naming its number — and a row that leaves a
 * column empty is refused the same way, because a row half written says as
 * little as no row at all.
 *
 * An artifact is landed once its `landed_by:` line is written — the record's
 * own account of the hand's word, never a file's mere presence on disk, which
 * a rebase or a hand-written draft can leave behind with no round at all.
 *
 * Nothing else owes a row. A read that changed nothing ran no perspective and
 * writes its `reviewed:` line alone, which is why this reads `landed_by:` and
 * ticked groups and never the rest of the record's keys.
 *
 * Date-fenced, for the reason `decided` is: a change opened before the rule
 * landed was planned when nobody could have written the row, and a register of
 * changes that could not have complied is a check people learn to read past.
 */

import { ROUND_COLUMNS, roundArtifactOf } from "../src/store/read-rounds.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";

/** The day after the `round` rule landed. A change opened on the day itself
 * was opened before the rule was, so the fence starts the morning after —
 * held here beside `DECISIONS_SINCE` in `record.mjs`, which fences the same
 * way. */
export const ROUND_RECORD_SINCE = "2026-09-20";

/** Each column against the field the reader holds it in, in the order the
 * requirement tables them. */
const COLUMNS = ROUND_COLUMNS.map((name) => [name, name.toLowerCase()]);

export function checkRounds(ctx, changes) {
  for (const change of changes) {
    if (change.status !== "in-flight") continue;
    if (!change.created || change.created < ROUND_RECORD_SINCE) continue;
    const file = `${change.dir}/rounds.md`;
    const rows = change.rounds ?? [];

    // A row that leaves a column empty is refused for that column and named
    // once: it still says which artifact it read, so reporting the artifact as
    // rowless as well would be two findings about one half-written line.
    for (const row of rows) {
      for (const [name, field] of COLUMNS) {
        const written = field === "round" ? row.round || "" : row[field];
        if (written !== "") continue;
        ctx.add(
          "round",
          file,
          `round ${row.round || "?"}${row.artifact ? ` (${row.artifact})` : ""} leaves \`${name}\` empty — write what the round ran, or \`-\` where it raised nothing`,
        );
      }
    }

    // One reading of the cell, the store's own: the landing writes a group's
    // bare digits and an artifact's id, so this compares the id it is given.
    const named = new Set(rows.map((row) => roundArtifactOf(row.artifact)));
    const landedBy = change.landedBy ?? {};

    for (const { id } of schemaArtifacts(ctx.roots.store, change.schema) ??
      []) {
      if (!(id in landedBy)) continue;
      if (named.has(id)) continue;
      ctx.add(
        "round",
        file,
        `\`${id}\` is landed and no row names it — a landed artifact carries the round that read it`,
      );
    }

    for (const group of change.taskGroups) {
      if (group.done === 0 || named.has(group.num)) continue;
      ctx.add(
        "round",
        file,
        `group ${group.num} is ticked and no row names it — a group lands its round's row before the tick`,
      );
    }
  }
}
