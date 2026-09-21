import { Text } from "@grade10/design-system/components/display/text";
import { ROLES, roleTitle } from "../api/stage-view";
import type { ChangeEntry } from "../api/types";
import { HandFace, Open } from "./change-hand";

/**
 * Who takes this change at each stage: one row per role, with its handle or
 * open.
 *
 * Every role is a row whether or not the change names it, because the reading
 * a product manager wants is which roles still need a hand — a table of only
 * the named ones answers the opposite question.
 */
export function HandsTable({ change }: { change: ChangeEntry }) {
  const hands = change.hands ?? {};

  return (
    <ul className="flex flex-col gap-1">
      {ROLES.map((role) => (
        <li className="flex flex-wrap items-center gap-x-2" key={role}>
          <Text as="span" className="min-w-36" size="xs" tone="secondary">
            {roleTitle(role)}
          </Text>
          {hands[role] ? <HandFace handle={hands[role]} /> : <Open />}
        </li>
      ))}
    </ul>
  );
}
