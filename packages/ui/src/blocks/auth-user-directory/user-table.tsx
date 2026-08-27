import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";

import type { UserDirectoryRow } from "./types";

/** Every word the table says. Nothing here has a default: a console that
 * showed English because the package chose it would be a console nobody
 * could translate. */
type UserTableCopy = {
  headings: {
    id: string;
    email: string;
    name: string;
    roles: string;
    status: string;
    twoFactor: string;
    created: string;
  };
  /** Shown in the name column when a row carries none. */
  noName: string;
  status: { active: string; banned: string };
  twoFactor: { on: string; off: string };
  actions: {
    sessions: string;
    roles: string;
    ban: string;
    unban: string;
    delete: string;
  };
};

type UserTableProps = {
  copy: UserTableCopy;
  users: readonly UserDirectoryRow[];
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onSessions: (userId: string) => void;
  /** Omit it, and the roles action is not offered — which is how a console
   * hides what the operator's grants do not allow. */
  onEditRoles?: (userId: string) => void;
  /** Omit it, and the delete action is not offered. */
  onDelete?: (userId: string) => void;
};

/**
 * The identity directory as a table: who an account is, what it holds, and
 * every move offered on it.
 *
 * The design system publishes no table primitive, so the markup is plain and
 * semantic rather than a local rung invented alongside one.
 */
function UserTable({
  copy,
  users,
  onBan,
  onUnban,
  onSessions,
  onEditRoles,
  onDelete,
}: UserTableProps) {
  const headings = [
    copy.headings.id,
    copy.headings.email,
    copy.headings.name,
    copy.headings.roles,
    copy.headings.status,
    copy.headings.twoFactor,
    copy.headings.created,
    "",
  ];

  return (
    <div className="overflow-x-auto" data-slot="user-table">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {headings.map((heading, column) => (
              <th
                // The action column has no heading, so its text cannot name
                // it; nothing about the set changes at runtime.
                key={heading || `actions-${column}`}
                className="px-3 py-2 font-medium"
              >
                <Text size="sm" tone="secondary">
                  {heading}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border">
              <td className="px-3 py-2">
                <Text size="sm">{user.id}</Text>
              </td>
              <td className="px-3 py-2">
                <Text size="sm">{user.email}</Text>
              </td>
              <td className="px-3 py-2">
                <Text size="sm" tone="secondary">
                  {user.name || copy.noName}
                </Text>
              </td>
              <td className="px-3 py-2">
                <HStack gap="xs" wrap>
                  {user.roles.map((role) => (
                    <Badge key={role} size="sm">
                      {role}
                    </Badge>
                  ))}
                </HStack>
              </td>
              <td className="px-3 py-2">
                {user.banned ? (
                  <Badge size="sm" variant="error">
                    {copy.status.banned}
                  </Badge>
                ) : (
                  <Badge size="sm" variant="success">
                    {copy.status.active}
                  </Badge>
                )}
              </td>
              <td className="px-3 py-2">
                {user.twoFactorEnabled ? (
                  <Badge size="sm">{copy.twoFactor.on}</Badge>
                ) : (
                  <Badge size="sm" variant="outline">
                    {copy.twoFactor.off}
                  </Badge>
                )}
              </td>
              <td className="px-3 py-2">
                <Text size="sm" tone="secondary">
                  {user.created}
                </Text>
              </td>
              <td className="px-3 py-2 text-right">
                <HStack gap="sm" justify="flex-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSessions(user.id)}
                  >
                    {copy.actions.sessions}
                  </Button>
                  {onEditRoles ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditRoles(user.id)}
                    >
                      {copy.actions.roles}
                    </Button>
                  ) : null}
                  {user.banned ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUnban(user.id)}
                    >
                      {copy.actions.unban}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onBan(user.id)}
                    >
                      {copy.actions.ban}
                    </Button>
                  )}
                  {onDelete ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(user.id)}
                    >
                      {copy.actions.delete}
                    </Button>
                  ) : null}
                </HStack>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { UserTableCopy, UserTableProps };
export { UserTable };
