// Explicit extensions: the store's reader and the notify script load this
// under plain node, which resolves no extensionless path.

import { behindOf, handOfArtifact } from "./stages.ts";
import { daysBetween, TIME_ZONE } from "./time.ts";
import type {
  BehindArtifact,
  ChangeEntry,
  ChangeSuite,
  Role,
  SchemaArtifact,
} from "./types.ts";

/**
 * What sits beside a change's stage: the five overlays, their shapes, and the
 * day bounds the idle one is read by.
 *
 * Its own module beside `stages.ts`, because none of it is the ladder: every
 * overlay is read from a file on `main`, none of them moves the stage, and
 * the ladder never asks for one. Keeping them together had the stage's module
 * carrying a clock, a day bound and a suite verdict that nothing in the ladder
 * reads.
 */

/** The five overlays, in the order the table lists them. */
export const OVERLAYS = [
  "waiting",
  "blocked",
  "idle",
  "behind",
  "suite",
] as const;

export type OverlayKind = (typeof OVERLAYS)[number];

/** A verdict on the change's blind suite, as the overlay shows it. */
export type SuiteVerdict = "draft" | "approved";

/** A fact beside the stage. Never a stage of its own, and never one of these
 * five plus a sixth: the set is closed, so a reader meets one list of chips. */
export type Overlay =
  | {
      kind: "waiting";
      /** The artifact the wait is written against. */
      artifact: string;
      /** The line as its author wrote it. */
      text: string;
      /** The date the line opens with, where it carries one. */
      since?: string;
      role?: Role;
      hand?: string;
    }
  | { kind: "blocked"; change: string }
  | { kind: "idle"; days: number; shelved: boolean }
  | ({
      kind: "behind";
      role?: Role;
      hand?: string;
    } & BehindArtifact)
  | { kind: "suite"; verdict: SuiteVerdict };

export type OverlayContext = {
  /** Now, as an instant — the caller's clock, never this module's, so the
   * same entry read twice at one instant reads the same both times. */
  now: Date | number;
  /** The changes a release has carried: `depends_on:` naming one of these
   * blocks nothing. The caller holds the archive and the released set. */
  released: Set<string>;
  /** The schema's artifacts, for the behind reading's order. */
  artifacts: SchemaArtifact[];
};

/** The day bounds `Q21` recommends, open on the product manager. */
export const IDLE_FROM = 7;
export const SHELVED_FROM = 30;

/** A wait may open with the day it started, which is the only date the line
 * carries. */
const DATED = /^(\d{4}-\d{2}-\d{2})\b/;

/**
 * What sits beside a change's stage, in the table's order.
 *
 * Every one is read from a file on `main` and none of them moves the stage —
 * the ladder never sees this function, and this function never asks for the
 * stage.
 */
export function overlaysOf(
  change: ChangeEntry,
  ctx: OverlayContext,
): Overlay[] {
  const overlays: Overlay[] = [];
  for (const wait of change.awaiting ?? []) {
    const since = DATED.exec(wait.why)?.[1];
    overlays.push({
      kind: "waiting",
      artifact: wait.artifact,
      text: wait.why,
      ...(since ? { since } : {}),
      ...whose(change, wait.artifact, ctx.artifacts),
    });
  }
  for (const id of change.dependsOn ?? []) {
    if (!ctx.released.has(id)) overlays.push({ kind: "blocked", change: id });
  }
  const days = idleDaysOf(change, ctx.now);
  if (days !== undefined && days >= IDLE_FROM) {
    overlays.push({ kind: "idle", days, shelved: days >= SHELVED_FROM });
  }
  const [earliest] = behindOf(change, ctx.artifacts);
  if (earliest) {
    overlays.push({
      kind: "behind",
      ...earliest,
      ...whose(change, earliest.artifact, ctx.artifacts),
    });
  }
  const verdict = verdictOf(change.suites);
  if (verdict) overlays.push({ kind: "suite", verdict });
  return overlays;
}

/** The hand an artifact's overlay is shown against: the role the schema names
 * for it, and the handle the change names for that role. No handle where the
 * change names none — the overlay says the role is open, and a `hand` holding
 * the role's own name would read as somebody answering to it. */
function whose(
  change: ChangeEntry,
  artifact: string,
  artifacts: SchemaArtifact[],
): { role?: Role; hand?: string } {
  const role = handOfArtifact(artifact, artifacts);
  if (!role) return {};
  const hand = change.hands?.[role];
  return hand === undefined ? { role } : { role, hand };
}

/**
 * Whole calendar days since the change last landed something, on the day
 * count's own zone — one zone, the store's, because a day is a day here and
 * a caller that could pass another would be two boards disagreeing about
 * whether a change is idle.
 *
 * Undefined where no history dates the landing — no viewer, a store with no
 * repository, a depth-1 clone — which is not the same as 0: the chip is not
 * shown rather than claiming the change landed something today.
 */
export function idleDaysOf(
  change: ChangeEntry,
  now: Date | number,
): number | undefined {
  if (change.lastLanded === undefined) return undefined;
  return daysBetween(change.lastLanded, now, TIME_ZONE);
}

/** The suite's verdict: approved once no suite of the change is left to
 * review, a draft while one is. A change with no suite wears no chip — there
 * is nothing to say about a verdict nobody has been asked for. */
function verdictOf(
  suites: ChangeSuite[] | undefined,
): SuiteVerdict | undefined {
  if (!suites || suites.length === 0) return undefined;
  return suites.every((one) => one.status === "approved")
    ? "approved"
    : "draft";
}
