import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useState } from "react";

/**
 * Whether the move being confirmed is reversible, and whether it collects a
 * reason. The consumer names the act in `copy`; this only says how the dialog
 * behaves — a reason field for one of them, a destructive button for two.
 */
type UserModerationTone = "reversible" | "destructive";

type UserModerationDialogCopy = {
  title: string;
  description: string;
  confirm: string;
  cancel: string;
  /** Labels the reason field. Present only when a reason is collected. */
  reason?: string;
};

type UserModerationDialogProps = {
  copy: UserModerationDialogCopy;
  /** Which account, as the operator should recognise it. */
  subject: string;
  tone: UserModerationTone;
  /** Collects a reason and hands it to `onConfirm`. */
  collectsReason?: boolean;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  /** The reason, or an empty string when none was collected. */
  onConfirm: (reason: string) => void;
};

/**
 * One confirmation, for every move an operator makes on an account.
 *
 * It is one component rather than three because the difference between them
 * is words and a tone, and three near-identical dialogs would drift the first
 * time one of them gained a field.
 */
function UserModerationDialog({
  copy,
  subject,
  tone,
  collectsReason,
  pending,
  error,
  onCancel,
  onConfirm,
}: UserModerationDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent data-slot="user-moderation-dialog">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <Text size="sm" truncate>
          {subject}
        </Text>
        {collectsReason ? (
          <TextInput
            label={copy.reason}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        ) : null}
        {error ? (
          <Text size="sm" tone="error">
            {error}
          </Text>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {copy.cancel}
          </Button>
          <Button
            variant={tone === "destructive" ? "destructive" : "default"}
            loading={pending}
            onClick={() => onConfirm(reason)}
          >
            {copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type {
  UserModerationDialogCopy,
  UserModerationDialogProps,
  UserModerationTone,
};
export { UserModerationDialog };
