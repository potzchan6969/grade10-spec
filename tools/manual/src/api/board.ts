import { byLastMoved } from "./derive";
import { type Overlay, overlaysOf } from "./overlays";
import { ROLES, rolesAtStage, stageShown } from "./stage-view";
import { handOf, openHands, STAGES } from "./stages";
import type { ChangeEntry, Role, SchemaArtifact, Stage } from "./types";

/**
 * The board, derived: one row per change with its stage and its overlays, the
 * eight lanes those rows fall into, and what the filters and the shelf keep.
 *
 * Read here rather than in the page because every part of it is an answer
 * about a change and not about a layout: which lane it is in, which chips it
 * wears, whether a filter keeps it, whether it has been idle long enough to
 * come off the lanes. The page arranges what this returns.
 */

/** Exactly the five, in the order the filter row shows them. */
export const BOARD_FILTERS = [
  "mine",
  "waiting",
  "idle",
  "behind",
  "blocked",
] as const;

export type BoardFilter = (typeof BOARD_FILTERS)[number];

export const FILTER_LABEL: Record<BoardFilter, string> = {
  mine: "Mine",
  waiting: "Waiting",
  idle: "Idle",
  behind: "Behind",
  blocked: "Blocked",
};

/** One change as the board reads it. */
export type BoardRow = {
  change: ChangeEntry;
  stage: Stage;
  overlays: Overlay[];
  /** Whose turn it is at that stage, read where the schema is — the lane
   * heading collects the open ones and the card names them. */
  turn: Role[];
  /** Idle long enough to come off the lanes and sit on the shelf. */
  shelved: boolean;
  /** Whole days since it last landed anything, where history dates it. */
  idleDays?: number;
};

export type BoardContext = {
  /** Now, as an instant — the caller's clock, so one render reads one time. */
  now: Date | number;
  /** The changes a release has carried: a dependency on one blocks nothing. */
  released: Set<string>;
  /** The schemas the snapshot holds, for the behind reading's order. */
  schemas: Record<string, SchemaArtifact[]>;
};

/** Every change in flight, with what sits beside its stage. An archived
 * change wears no overlay: nothing is waiting on it and nobody reads an
 * artifact of it again. */
export function boardRows(
  changes: ChangeEntry[],
  ctx: BoardContext,
): BoardRow[] {
  return [...changes].sort(byLastMoved).map((change) => {
    const stage = stageShown(change);
    const artifacts = ctx.schemas[change.schema] ?? [];
    const overlays =
      change.status === "archived"
        ? []
        : overlaysOf(change, {
            now: ctx.now,
            released: ctx.released,
            artifacts,
          });
    const idle = overlays.find((overlay) => overlay.kind === "idle");
    return {
      change,
      stage,
      turn: handOf(change, stage, artifacts),
      overlays,
      shelved: idle?.kind === "idle" && idle.shelved,
      ...(idle?.kind === "idle" ? { idleDays: idle.days } : {}),
    };
  });
}

/** One lane of the board. */
export type BoardLane = {
  stage: Stage;
  rows: BoardRow[];
  /** Open on arrival: a lane whose stage names a hand. */
  open: boolean;
  /** The roles nobody is named for — every lane's own, and the roles the
   * stage names where the lane is empty. */
  openHands: Role[];
};

export function boardLanes(rows: BoardRow[]): BoardLane[] {
  return STAGES.map((stage) => {
    const held = rows.filter((row) => row.stage === stage && !row.shelved);
    const open = new Set(
      held.flatMap((row) => openHands(row.change, row.turn)),
    );
    return {
      stage,
      rows: held,
      open: rolesAtStage(stage).length > 0,
      openHands:
        held.length === 0
          ? rolesAtStage(stage)
          : ROLES.filter((role) => open.has(role)),
    };
  });
}

/** The filter a URL asks for, or nothing where it asks for none — a value
 * nobody issued narrows nothing rather than emptying the board. */
export function filterOf(value: string | null): BoardFilter | undefined {
  return BOARD_FILTERS.find((filter) => filter === value);
}

/**
 * Whether one filter keeps a row.
 *
 * Mine is the one that needs something the board cannot derive: until a
 * handle is chosen it keeps everything, because a filter that emptied the
 * board while asking who you are would read as a board with nothing on it.
 */
export function narrowedBy(
  row: BoardRow,
  filter: BoardFilter | undefined,
  handle: string | undefined,
): boolean {
  if (filter === undefined) return true;
  if (filter === "mine") {
    if (handle === undefined) return true;
    return Object.values(row.change.hands ?? {}).some(
      (named) => named.toLowerCase() === handle.toLowerCase(),
    );
  }
  return row.overlays.some((overlay) => overlay.kind === filter);
}
