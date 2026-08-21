import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { AsyncAction } from "./async";

type AsyncMessageProps = {
  message: ReactNode;
  action?: AsyncAction;
  slot: string;
  className?: string;
};

/**
 * The shared body of an `empty` or `error` condition. Internal — not part of
 * the package's export contract.
 *
 * Every string here arrives as a prop: the message, and the action's label.
 * Nothing in this file is translatable, because nothing in it is copy.
 */
function AsyncMessage({ message, action, slot, className }: AsyncMessageProps) {
  return (
    <VStack className={cn("gap-3", className)} data-slot={slot} hAlign="start">
      <p className="text-sm text-secondary-foreground">{message}</p>
      {action ? (
        <Button onClick={action.onAction} size="sm" variant="secondary">
          {action.label}
        </Button>
      ) : null}
    </VStack>
  );
}

export { AsyncMessage };
