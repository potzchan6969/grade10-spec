import { laneOf } from "./derive";
import { DRAFTED, handOf, STAGES } from "./stages";
import type {
  BehindArtifact,
  ChangeEntry,
  ChangeLane,
  Role,
  Stage,
} from "./types";

/**
 * How a derived fact reads on a surface: the words for a stage and a role, the
 * agent's mark and the hand's move, and what one behind artifact names.
 *
 * One module because every surface says the same thing about the same fact —
 * the lane heading, the stepper, the Your turn card, the hands table, the
 * artifact row and the shelf — and because the shapes underneath it are still
 * moving: the drafted table grows a move per role, and a behind reading grows
 * a second list. A component that read either shape directly would have to be
 * found and edited again on the day it changes; every read of both is here.
 */

/** The eight stages as a reader meets them, in the ladder's own order. */
export const STAGE_LABEL: Record<Stage, string> = {
  proposed: "Proposed",
  designed: "Designed",
  specified: "Specified",
  planned: "Planned",
  building: "Building",
  "on-staging": "On staging",
  released: "Released",
  archived: "Archived",
};

/** The six roles as the stage table names them. */
export const ROLE_LABEL: Record<Role, string> = {
  pm: "product manager",
  design: "designer",
  tech: "tech PIC",
  dev: "engineer",
  qa: "QA",
  release: "release hand",
};

/** The roles, in the order the `hands:` table lists them. */
export const ROLES: Role[] = ["pm", "design", "tech", "dev", "qa", "release"];

/** A role as a row's own label, where it opens a line rather than sitting in
 * one. `QA` is already a name and is left as it is written. */
export function roleTitle(role: Role): string {
  const label = ROLE_LABEL[role];
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Which of the eight a change is in, as a surface reads it. Every entry a
 * store reader built carries its stage; one written by hand against the four
 * lanes is read through the projection, so no surface has to ask for a schema
 * it does not have. */
export function stageShown(change: ChangeEntry): Stage {
  if (change.stage) return change.stage;
  if (change.status === "archived") return "archived";
  return STAGE_OF_LANE[laneOf(change)];
}

const STAGE_OF_LANE: Record<ChangeLane, Stage> = {
  proposed: "proposed",
  specified: "specified",
  "in-progress": "building",
  complete: "on-staging",
};

/** Which step of the eight this stage is — the number the one-line stepper
 * reads out below `sm`, where eight steps do not fit. */
export function stageNumber(stage: Stage): number {
  return STAGES.indexOf(stage) + 1;
}

/** How many steps there are, so the one line does not restate it. */
export const STAGE_COUNT = STAGES.length;

/** The roles a stage names, with no change in hand: what an empty lane says
 * about who would take a change that arrived in it. A bare entry is the whole
 * input — `handOf` reads the record for the two halves of Proposed, and a
 * lane has no record to read. */
export function rolesAtStage(stage: Stage): Role[] {
  return handOf(BARE, stage);
}

const BARE: ChangeEntry = {
  id: "",
  dir: "",
  schema: "",
  status: "in-flight",
  owners: [],
  created: "",
  title: "",
  why: "",
  taskGroups: [],
  deltas: [],
  written: [],
};

/** What the agent drafts at one stage and what the hand does about it, in the
 * words a surface shows. */
export type DraftedRead = {
  /** What the change's agent drafts, as the stage table writes it. */
  mark: string;
  /** The hand's move beside it, one sentence however many hands take the
   * stage. Never split: the day Designed carries a move per role, the roles
   * are read from here and not from this sentence. */
  move: string;
  /** Who moves it, as the stage table names them. */
  note: string;
  /** The command that stage's hand pastes for one change. */
  commandFor(id: string, role?: Role): string;
};

/**
 * The agent mark and the hand's move for one stage, or nothing where the
 * stage is drafted by nobody — On staging, Released and Archived are a
 * deploy, a cut and a fold.
 *
 * The one read of `DRAFTED` in the app. The table's shape is the schema's
 * rule about which stages an agent drafts, and it is still growing a move and
 * a command per role; everything that renders the pair reads it through here,
 * so that day is one function and not six components.
 */
export function draftedOf(stage: Stage): DraftedRead | undefined {
  const drafted = DRAFTED[stage];
  if (!drafted) return undefined;
  return {
    mark: drafted.draft,
    move: drafted.move,
    note: drafted.note,
    commandFor: (id) => drafted.command.replace(/<id>/g, id),
  };
}

/** What changed before one behind artifact, as its chip names it: the page
 * sections and the artifacts it was drawn from, in reading order. */
export function behindLabelOf(behind: BehindArtifact): string {
  return behind.changed.join(", ");
}
