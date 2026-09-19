import { byLastMoved } from "./derive";
import { handOf, laterRolesOf } from "./stages";
import type { ChangeEntry, OpenQuestion, Role, SchemaArtifact } from "./types";

/**
 * What is on one handle, across every change in flight: the open questions
 * addressed to them, the changes whose current stage names them, and the
 * changes that name them for a stage still ahead — My turn's own reading, in
 * the order the page shows it.
 *
 * A change nothing names this handle for at all is left out of both lists
 * rather than read as "later" — `laterRolesOf` already answers that, and a
 * change already on the reader now never doubles into later too.
 */

export type MyTurnQuestion = { change: ChangeEntry; question: OpenQuestion };
export type MyTurnChange = { change: ChangeEntry; roles: Role[] };

export type MyTurn = {
  questions: MyTurnQuestion[];
  now: MyTurnChange[];
  later: MyTurnChange[];
};

export function myTurnOf(
  changes: ChangeEntry[],
  schemas: Record<string, SchemaArtifact[]>,
  handle: string,
): MyTurn {
  const held = handle.toLowerCase();
  const questions: MyTurnQuestion[] = [];
  const now: MyTurnChange[] = [];
  const later: MyTurnChange[] = [];

  for (const change of [...changes].sort(byLastMoved)) {
    for (const question of change.questions ?? []) {
      if (question.hand.toLowerCase() === held)
        questions.push({ change, question });
    }

    const artifacts = schemas[change.schema] ?? [];
    const onNow = handOf(change, change.stage, artifacts).filter(
      (role) => change.hands?.[role]?.toLowerCase() === held,
    );
    if (onNow.length > 0) {
      now.push({ change, roles: onNow });
      continue;
    }
    const onLater = laterRolesOf(change, change.stage, artifacts, held);
    if (onLater.length > 0) later.push({ change, roles: onLater });
  }

  return { questions, now, later };
}
