import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Gavel } from "@phosphor-icons/react";
import type { AuctionOrderEmptyProps } from "./types";

function AuctionOrderEmpty({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: AuctionOrderEmptyProps) {
  return (
    <EmptyState
      actions={
        actionLabel && onAction ? (
          <Button onClick={onAction} size="md" variant="secondary">
            {actionLabel}
          </Button>
        ) : undefined
      }
      className={cn(className)}
      description={description}
      icon={<Gavel aria-hidden size={24} weight="regular" />}
      title={title}
    />
  );
}

export type { AuctionOrderEmptyProps };
export { AuctionOrderEmpty };
