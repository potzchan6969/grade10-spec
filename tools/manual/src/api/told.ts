// Explicit extensions: the notify script loads this under plain node.

import { handOfArtifact } from "./stages.ts";
import type { BehindArtifact, Moved, Role, SchemaArtifact } from "./types.ts";

/** One person told what moved before their artifacts by one landing: their
 * handle, or the role whose channel is told where the change names nobody. */
export type Told = {
  hand?: string;
  roles: Role[];
  /** Each artifact of theirs the landing reached, with what moved before it
   * that the base reading did not already carry. */
  behind: BehindArtifact[];
};

/**
 * Who a landing tells what moved, one entry per person.
 *
 * A unit reaches a hand when it moved before one of their artifacts at the
 * head and not at the base — the same unit, standing the same way — so a
 * move already told is not told again, and a move that moved further is. The
 * base is empty where nothing was read before: Told now shows everything the
 * hands would be told.
 */
export function toldOf(
  base: BehindArtifact[],
  head: BehindArtifact[],
  artifacts: SchemaArtifact[],
  hands: Partial<Record<string, string>>,
): Told[] {
  const told = new Map<string, Told>();
  for (const behind of head) {
    const was = base.find((one) => one.artifact === behind.artifact);
    const fresh = behind.moved.filter(
      (one) => !was?.moved.some((old) => sameUnit(old, one)),
    );
    if (fresh.length === 0) continue;
    const role = handOfArtifact(behind.artifact, artifacts);
    if (!role) continue;
    const hand = hands[role];
    const key = hand ?? `role:${role}`;
    const entry = told.get(key) ?? {
      ...(hand ? { hand } : {}),
      roles: [],
      behind: [],
    };
    if (!entry.roles.includes(role)) entry.roles.push(role);
    entry.behind.push({ ...behind, moved: fresh });
    told.set(key, entry);
  }
  return [...told.values()];
}

function sameUnit(one: Moved, two: Moved): boolean {
  return (
    one.item === two.item && one.key === two.key && one.after === two.after
  );
}
