/**
 * A group's `Tests` cell, read and held to what the group's tasks cite: the
 * landing's `--tests` (`plan-land.mjs`) is written through here, so the cell
 * is parsed once and each refusal is a list the landing names.
 *
 * Pure: the landing passes what a path resolves to, so the boundaries are
 * tested without a git checkout.
 *
 * `openspec/specs/shared/planning/agent-rounds/spec.md`:
 * `shared-planning-agent-rounds-SC-58`, `shared-planning-agent-rounds-SC-97`,
 * `shared-planning-agent-rounds-SC-98`.
 */
import { citesId, SCENARIO_ID } from "./cites.mjs";

/** `<id>: <rest>`, the id in backticks or bare. */
const ENTRY = new RegExp(`^\\s*\`?(${SCENARIO_ID.source})\`?\\s*:\\s*(.*)$`);

/** A path: a slash and no space, backticks aside. */
const PATH = /^[\w.@-]+(?:\/[\w.@-]+)+$/;

/**
 * The cell's entries, one per `;`: the scenario id it credits — undefined for
 * an entry that names none, such as a walk by hand — the paths it names, and
 * every other word between its `,` and `:` separators.
 */
export function parseTestsCell(cell) {
  const entries = [];
  for (const entry of String(cell ?? "").split(";")) {
    if (entry.trim() === "") continue;
    const match = ENTRY.exec(entry);
    const tokens = (match ? match[2] : entry)
      .split(/[,:]/)
      .map((one) => one.trim().replace(/^`|`$/g, ""))
      .filter(Boolean);
    entries.push({
      id: match?.[1],
      paths: tokens.filter((one) => PATH.test(one)),
      words: tokens.filter((one) => !PATH.test(one)),
    });
  }
  return entries;
}

/**
 * What the landing refuses the cell for, each a list:
 * - **missing** — a cited id no entry credits
 * - **absent** — a path, in any entry, `isFile` says is no file
 * - **uncited** — `{ id, path }` for a file whose `textOf` carries no such id
 *
 * An entry credits the id it opens with and no other, so a path that happens
 * to carry an id credits nothing.
 */
export function checkTestsCell({ entries, cited, isFile, textOf }) {
  const missing = cited.filter((id) => !entries.some((one) => one.id === id));
  const absent = [...new Set(entries.flatMap((one) => one.paths))].filter(
    (path) => !isFile(path),
  );
  const uncited = entries.flatMap(({ id, paths }) =>
    id === undefined
      ? []
      : paths
          .filter((path) => isFile(path) && !citesId(textOf(path), id))
          .map((path) => ({ id, path })),
  );
  return { missing, absent, uncited };
}
