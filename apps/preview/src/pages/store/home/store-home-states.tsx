import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";

const TILE_KEYS = [
  "tile-a",
  "tile-b",
  "tile-c",
  "tile-d",
  "tile-e",
  "tile-f",
  "tile-g",
];

/** A section read in flight: skeleton tiles, announced as loading. */
function LoadingTiles({
  className,
  count,
  label,
}: {
  className: string;
  count: number;
  label: string;
}) {
  return (
    <div aria-busy="true" className={className} role="status">
      <span className="sr-only">{label}</span>
      {TILE_KEYS.slice(0, count).map((key) => (
        <Skeleton className="aspect-square w-full rounded-2xl" key={key} />
      ))}
    </div>
  );
}

/** A section read that failed: what happened, and a way to read it again. */
function ReadFailed({
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

export { LoadingTiles, ReadFailed };
