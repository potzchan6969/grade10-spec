import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxButton } from "@grade10/design-system/components/forms/checkbox-button";
import { Label } from "@grade10/design-system/components/forms/label";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { useState } from "react";

import type { UserRoleOption } from "./types";

type UserRolesDialogCopy = {
  title: string;
  description: string;
  confirm: string;
  cancel: string;
  /** Shown when the operator is about to drop their own way back in. */
  selfLockout: string;
};

type UserRolesDialogProps = {
  copy: UserRolesDialogCopy;
  /** Which account, as the operator should recognise it. */
  subject: string;
  /** Every role that can be granted, in the order they are offered. */
  options: readonly UserRoleOption[];
  /** Which of them the account holds now. */
  selected: readonly string[];
  /**
   * The role whose absence would lock the operator out of the console. Pass
   * it only when they are editing their own account; the dialog warns when
   * the selection drops it.
   */
  lockoutRole?: string;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  /**
   * The chosen roles, in the order `options` names them rather than the order
   * they were clicked, so one selection is always one list. An empty
   * selection is handed back empty — what a console does with that is its
   * decision, not this dialog's.
   */
  onConfirm: (roles: string[]) => void;
};

/**
 * Which roles an account holds.
 *
 * The vocabulary is a prop, not a constant: this package cannot import an
 * identity contract, and a console that grants a role this dialog had never
 * heard of is a console with a bug the type system should have caught at its
 * own edge.
 */
function UserRolesDialog({
  copy,
  subject,
  options,
  selected,
  lockoutRole,
  pending,
  error,
  onCancel,
  onConfirm,
}: UserRolesDialogProps) {
  const [chosen, setChosen] = useState<ReadonlySet<string>>(
    () => new Set(selected),
  );

  function toggle(role: string, checked: boolean) {
    const next = new Set(chosen);
    if (checked) next.add(role);
    else next.delete(role);
    setChosen(next);
  }

  const roles = options
    .map((option) => option.id)
    .filter((role) => chosen.has(role));
  const lockingOut = lockoutRole !== undefined && !chosen.has(lockoutRole);

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent data-slot="user-roles-dialog">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <Text size="sm" truncate>
          {subject}
        </Text>
        <VStack gap="sm">
          {options.map((option) => (
            <HStack gap="sm" align="flex-start" key={option.id}>
              <CheckboxButton
                id={`role-${option.id}`}
                checked={chosen.has(option.id)}
                onCheckedChange={(checked) =>
                  toggle(option.id, checked === true)
                }
              />
              <VStack gap="xs">
                <Label htmlFor={`role-${option.id}`}>{option.label}</Label>
                <Text size="sm" tone="secondary">
                  {option.permissions}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
        {lockingOut ? (
          <Text size="sm" tone="error">
            {copy.selfLockout}
          </Text>
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
          <Button loading={pending} onClick={() => onConfirm(roles)}>
            {copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { UserRolesDialogCopy, UserRolesDialogProps };
export { UserRolesDialog };
