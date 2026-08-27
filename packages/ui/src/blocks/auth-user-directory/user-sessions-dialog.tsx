import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";

import type { UserSessionRow } from "./types";

type UserSessionsDialogCopy = {
  title: string;
  description: string;
  headings: { session: string; started: string };
  loading: string;
  empty: string;
  revoke: string;
  revokeAll: string;
  close: string;
};

type UserSessionsDialogProps = {
  copy: UserSessionsDialogCopy;
  /** Which account, as the operator should recognise it. */
  subject: string;
  sessions: readonly UserSessionRow[];
  loading: boolean;
  /** A revocation is in flight; every button that starts one waits. */
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onRevoke: (sessionId: string) => void;
  onRevokeAll: () => void;
};

/**
 * Where an account is signed in, and how to end it.
 *
 * A session is named by an identifier and nothing else: the secret that
 * authenticates one is never shown, so it is never a prop.
 */
function UserSessionsDialog({
  copy,
  subject,
  sessions,
  loading,
  pending,
  error,
  onCancel,
  onRevoke,
  onRevokeAll,
}: UserSessionsDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent data-slot="user-sessions-dialog">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <Text size="sm" truncate>
          {subject}
        </Text>
        {error ? (
          <Text size="sm" tone="error">
            {error}
          </Text>
        ) : null}
        {loading ? (
          <Text tone="secondary">{copy.loading}</Text>
        ) : sessions.length === 0 ? (
          <Text tone="secondary">{copy.empty}</Text>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[copy.headings.session, copy.headings.started, ""].map(
                    (heading, column) => (
                      <th
                        key={heading || `actions-${column}`}
                        className="px-3 py-2 font-medium"
                      >
                        <Text size="sm" tone="secondary">
                          {heading}
                        </Text>
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-border">
                    <td className="px-3 py-2">
                      <Text size="sm">{session.id}</Text>
                    </td>
                    <td className="px-3 py-2">
                      <Text size="sm" tone="secondary">
                        {session.started}
                      </Text>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        loading={pending}
                        onClick={() => onRevoke(session.id)}
                      >
                        {copy.revoke}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {copy.close}
          </Button>
          <Button
            variant="destructive"
            loading={pending}
            disabled={sessions.length === 0}
            onClick={onRevokeAll}
          >
            {copy.revokeAll}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { UserSessionsDialogCopy, UserSessionsDialogProps };
export { UserSessionsDialog };
