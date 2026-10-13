import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";

const CARD_KEYS = ["card-a", "card-b"];

/** The first order read in flight: two skeleton cards, announced as loading. */
function OrderHistoryLoadingCards({ label }: { label: string }) {
  return (
    <div aria-busy="true" className="flex w-full flex-col gap-4" role="status">
      <span className="sr-only">{label}</span>
      {CARD_KEYS.map((key) => (
        <Skeleton className="h-40 w-full rounded-2xl" key={key} />
      ))}
    </div>
  );
}

/** The order read failed: what happened, and a way to read it again. */
function OrderHistoryReadFailed({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry: () => void;
  retryLabel: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm text-secondary-foreground">{message}</p>
      <Button onClick={onRetry} type="button">
        {retryLabel}
      </Button>
    </div>
  );
}

export { OrderHistoryLoadingCards, OrderHistoryReadFailed };
