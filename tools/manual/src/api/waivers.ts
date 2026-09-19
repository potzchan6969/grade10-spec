// Explicit extension: `check:manual` loads this under plain node, which
// resolves no extensionless path of its own.
import type { ChangeEntry, SchemaArtifact } from "./types.ts";

/**
 * The schema artifact ids a change's own record waives — beside what is
 * written, never counted as written, so nothing that counts files sees a
 * waiver as one and `written` keeps its meaning of a file that exists.
 *
 * `skip_specs` says a change alters no behaviour, so it owes no requirements —
 * and nothing that lives inside a capability directory either. There is no
 * capability, so there is nowhere for a journeys file or a suite to be
 * written, and asking for one put an impossible row on the product manager's
 * list for every tooling change in the store.
 *
 * `decisions_waived` says this change records no decisions: the interview
 * settled nothing it had to keep, or it was opened before `decisions.md`
 * existed and its scope is in the proposal. That is read here and not only by
 * `check:manual`, because unlike `deploy_waived` and `tasks_waived` — which
 * answer for a file's absence at archive — this one answers for whose turn it
 * is now. The row it would otherwise leave is the product manager's, and an
 * artifact their own record waives is not their turn. Without this, the only
 * thing that clears the row is the file, which pushes an author towards
 * writing a record of an interview nobody held.
 *
 * `ui_waived` stands for the UI design and `design_waived` for the tech
 * design, so a change that draws nothing is proven by both designs, by both
 * lines, or by one of each. Each is a line of text and never a flag: a waiver
 * with no reason is a silence, which the store's reader refuses.
 *
 * Its own module because three readers need it and no two of them can reach
 * each other: the worklists and the stage ladder derive from it, and
 * `check/record.mjs` refuses a wait on what it names — and the store's reader,
 * which parses the lines, is a Node module the app cannot import.
 */
export function waivedOf(
  artifacts: SchemaArtifact[],
  change: ChangeEntry,
): Set<string> {
  return new Set(waiverLineOf(artifacts, change).keys());
}

/**
 * The same reading, each artifact against the record key that waives it — so
 * a rule refusing a waiver can name the line its author would delete rather
 * than leaving them to find which of the four it was.
 */
export function waiverLineOf(
  artifacts: SchemaArtifact[],
  change: ChangeEntry,
): Map<string, string> {
  const waived = new Map<string, string>();
  for (const one of artifacts) {
    if (
      change.skipSpecs !== undefined &&
      (one.id === "specs" || one.generates.startsWith("specs/"))
    ) {
      waived.set(one.id, "skip_specs");
    }
    const waiver = WAIVERS[one.id];
    if (waiver && change[waiver.field]) waived.set(one.id, waiver.key);
  }
  return waived;
}

/** The line each waived artifact is waived by: the key as the record spells
 * it, and the field the reader put it on. */
const WAIVERS: Record<
  string,
  { key: string; field: "decisionsWaived" | "uiWaived" | "designWaived" }
> = {
  decisions: { key: "decisions_waived", field: "decisionsWaived" },
  "ui-design": { key: "ui_waived", field: "uiWaived" },
  "tech-design": { key: "design_waived", field: "designWaived" },
};
