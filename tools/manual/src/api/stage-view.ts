import { DRAFTED, STAGES } from "./stages";
import type { BehindArtifact, ChangeEntry, Role, Stage } from "./types";
import { ROLES } from "./types";

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

/** The words for a stage live in `stages.ts`, which the notify script and the
 * digest read under plain node; every surface reads them from here, where the
 * rest of the wording is. */
export { STAGE_LABEL } from "./stages";

/** The six roles as the stage table names them. */
export const ROLE_LABEL: Record<Role, string> = {
  pm: "product manager",
  design: "designer",
  tech: "tech PIC",
  dev: "engineer",
  qa: "QA",
  release: "release hand",
};

/** The roles, in the order the `hands:` table lists them — `ROLES` in
 * `api/types.ts`, the one declaration every reader of the six imports. */
export { ROLES };

/** A role as a row's own label, where it opens a line rather than sitting in
 * one. `QA` is already a name and is left as it is written. */
export function roleTitle(role: Role): string {
  const label = ROLE_LABEL[role];
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Which of the eight a change is in, as a surface reads it. Every entry
 * carries its stage, computed where the schema is, so no surface derives a
 * second answer from a schema it does not have. */
export function stageShown(change: ChangeEntry): Stage {
  return change.stage;
}

/** Which step of the eight this stage is — the number the one-line stepper
 * reads out below `sm`, where eight steps do not fit. */
export function stageNumber(stage: Stage): number {
  return STAGES.indexOf(stage) + 1;
}

/** How many steps there are, so the one line does not restate it. */
export const STAGE_COUNT = STAGES.length;

/** One hand of a drafted stage: its move, and the command it pastes for the
 * change the read was asked about. */
export type DraftedMove = {
  role: Role;
  /** The hand's move, as the stage table writes it. */
  move: string;
  /** The command this hand pastes, the change's id written in. */
  command: string;
};

/** What the agent drafts at one stage and what its hands do about it, in the
 * words a surface shows. */
export type DraftedRead = {
  /** What the change's agent drafts, as the stage table writes it. */
  mark: string;
  /** One entry per hand the stage names, in the roles' own order. */
  moves: DraftedMove[];
};

/**
 * The agent mark and the hands' moves for one stage, or nothing where the
 * stage is drafted by nobody — On staging, Released and Archived are a
 * deploy, a cut and a fold.
 *
 * The one read of `DRAFTED` in the app: everything that renders the pair
 * reads it through here, so the day the table grows a hand is this function
 * and not six components. `id` writes the change into each command, and the
 * `<id>` the table holds is what a read with no change in hand returns.
 */
export function draftedOf(stage: Stage, id = "<id>"): DraftedRead | undefined {
  const drafted = DRAFTED[stage];
  if (!drafted) return undefined;
  return {
    mark: drafted.draft,
    moves: ROLES.flatMap((role) => {
      const held = drafted.moves[role];
      if (!held) return [];
      return [
        { role, move: held.move, command: held.command.replace(/<id>/g, id) },
      ];
    }),
  };
}

/** The hand's move as a lane heading and a stepper step carry it: the moves
 * themselves, one phrase per hand of the stage. */
export function moveShown(moves: DraftedMove[]): string {
  return moves.map((one) => one.move).join(" · ");
}

/** Who moves it, each hand named by its own label — the line beside the
 * command on the Your turn card and on a card's next action. */
export function movedBy(moves: DraftedMove[]): string {
  return moves.map((one) => `${roleTitle(one.role)}: ${one.move}`).join(" · ");
}

/**
 * What is behind one artifact, as its chip and its row name it.
 *
 * Two sentences, because the two readings answer different questions. Where
 * commit dates single items out, those items changed. Where the recorded
 * content id is what says the upstream moved, it cannot say which part of it
 * did, so the row names everything the artifact is read again against.
 */
export function behindLabelOf(behind: BehindArtifact): string {
  if (behind.changed) return `${behind.changed.join(", ")} changed`;
  return `read again against ${(behind.before ?? []).join(", ")}`;
}
