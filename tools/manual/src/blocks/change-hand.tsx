import {
  Avatar,
  AvatarFallback,
} from "@grade10/design-system/components/display/avatar";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { ROLE_LABEL } from "../api/stage-view";
import type { ChangeEntry, Role } from "../api/types";

/**
 * Whose turn it is, wherever a hand is shown: the handle the change names for
 * that role, or the role itself where it names nobody.
 *
 * One component, because the card, the hands table and the Your turn card all
 * answer the same question and a reader compares them. A role nobody has
 * taken is said out loud rather than left blank: an empty cell reads as a
 * change nobody has to move, and the whole point of the board is that
 * somebody does.
 */
export function Hand({
  handle,
  role,
}: {
  handle: string | undefined;
  role: Role;
}) {
  if (handle === undefined || handle === "") return <OpenHand role={role} />;

  return (
    <span className="inline-flex items-center gap-1.5">
      <HandFace handle={handle} />
      <Text as="span" size="xs" tone="secondary">
        {ROLE_LABEL[role]}
      </Text>
    </span>
  );
}

/** One handle as a person: the avatar falls back to two letters, because the
 * store knows a handle and a Slack member and never a photograph. */
export function HandFace({ handle }: { handle: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Avatar size="xs">
        <AvatarFallback>{initialsOf(handle)}</AvatarFallback>
      </Avatar>
      <Text as="span" className="font-mono" size="xs">
        {`@${handle.replace(/^@/, "")}`}
      </Text>
    </span>
  );
}

/** A role the change names nobody for, where the role is not already the
 * row's own label. */
export function OpenHand({ role }: { role: Role }) {
  return (
    <Badge
      size="sm"
      title={`No ${ROLE_LABEL[role]} is named on this change`}
      variant="outline"
    >
      <span>{ROLE_LABEL[role]}</span>
      <span className="opacity-70">open</span>
    </Badge>
  );
}

/** A role nobody has taken, on a row that names the role itself. */
export function Open() {
  return (
    <Badge size="sm" title="Nobody is named for this role" variant="outline">
      open
    </Badge>
  );
}

/** Every hand of one stage, named or open. */
export function Hands({
  change,
  roles,
}: {
  change: ChangeEntry;
  roles: Role[];
}) {
  if (roles.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {roles.map((role) => (
        <li key={role}>
          <Hand handle={change.hands?.[role]} role={role} />
        </li>
      ))}
    </ul>
  );
}

function initialsOf(handle: string): string {
  return handle.replace(/^@/, "").slice(0, 2).toUpperCase();
}
