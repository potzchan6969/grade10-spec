import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Gavel } from "@phosphor-icons/react";
import type { AuctionRecordEmptyProps } from "./types";

function AuctionRecordEmpty({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: AuctionRecordEmptyProps) {
  return (
    <EmptyState
      actions={
        actionLabel && onAction ? (
          <Button size="md" variant="secondary" onClick={onAction}>
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

export { AuctionRecordEmpty };
