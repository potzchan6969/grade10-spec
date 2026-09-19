import { handleOf } from "../../../../scripts/openspec/lib/handle.mjs";
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

/** The roles of these `hands` names for this one handle — one comparison,
 * read here for both what is on the reader now and what is coming, since
 * both are the same question asked of a different role list. */
function rolesHeldBy(
  hands: Record<string, string> | undefined,
  roles: Role[],
  handle: string,
): Role[] {
  const held = handleOf(handle);
  return roles.filter((role) => {
    const named = hands?.[role];
    return named !== undefined && handleOf(named) === held;
  });
}

export function myTurnOf(
  changes: ChangeEntry[],
  schemas: Record<string, SchemaArtifact[]>,
  handle: string,
): MyTurn {
  const held = handleOf(handle);
  const questions: MyTurnQuestion[] = [];
  const now: MyTurnChange[] = [];
  const later: MyTurnChange[] = [];

  for (const change of [...changes].sort(byLastMoved)) {
    for (const question of change.questions ?? []) {
      if (handleOf(question.hand) === held)
        questions.push({ change, question });
    }

    const artifacts = schemas[change.schema] ?? [];
    const onNow = rolesHeldBy(
      change.hands,
      handOf(change, change.stage, artifacts),
      handle,
    );
    if (onNow.length > 0) {
      now.push({ change, roles: onNow });
      continue;
    }
    const onLater = rolesHeldBy(
      change.hands,
      laterRolesOf(change, change.stage, artifacts),
      handle,
    );
    if (onLater.length > 0) later.push({ change, roles: onLater });
  }

  return { questions, now, later };
}
