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
 * Nothing else owes a row. A read that changed nothing ran no perspective and
 * writes its `reviewed:` line alone, which is why this reads landed artifacts
 * and ticked groups and never the record's own keys.
 *
 * Date-fenced, for the reason `decided` is: a change opened before the rule
 * landed was planned when nobody could have written the row, and a register of
 * changes that could not have complied is a check people learn to read past.
 */

import { ROUND_COLUMNS } from "../src/store/read-rounds.mts";
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

    const named = new Set(rows.map((row) => groupOf(row.artifact)));
    const written = new Set(change.written);

    for (const { id, generates } of schemaArtifacts(
      ctx.roots.store,
      change.schema,
    ) ?? []) {
      if (!written.has(id)) continue;
      if (named.has(id) || named.has(fileOf(generates))) continue;
      ctx.add(
        "round",
        file,
        `\`${id}\` is written and no row names it — a landed artifact carries the round that read it`,
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

/** A row's `Artifact` cell as this compares it: an artifact id as written, and
 * a task group however the row spelled its number — `3`, `3.` or `group 3`. */
const groupOf = (cell) =>
  String(cell)
    .trim()
    .replace(/^group\s+/i, "")
    .replace(/\.$/, "");

/** The file name an artifact generates, so a row naming `ui-design.md` answers
 * for `ui-design`. */
const fileOf = (generates) => generates.slice(generates.lastIndexOf("/") + 1);
