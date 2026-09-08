import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AuctionRecordEmptyProps } from "./types";

function AuctionRecordEmpty({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: AuctionRecordEmptyProps) {
  return (
    <VStack className={className} gap="sm" hAlign="center">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </VStack>
  );
}

export { AuctionRecordEmpty };
