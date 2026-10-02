import { useMemo } from "react";
import { useRemainingSeconds } from "./listing-clock";
import {
  countdownParts,
  formatAccessibleText,
  RollingCountdown,
} from "./listing-countdown-digit";

type ListingCountdownDisplayProps = {
  /** Shown as given when `closesAtMs` is null; it does not tick. */
  initialSeconds: number;
  /** When set, remaining time is read from the clock against this instant, rounded up. */
  closesAtMs?: number | null;
  format?: "short" | "long";
};

function ListingCountdownDisplay({
  initialSeconds,
  closesAtMs,
  format = "short",
}: ListingCountdownDisplayProps) {
  const seconds = useRemainingSeconds(closesAtMs ?? null) ?? initialSeconds;

  const parts = useMemo(
    () => countdownParts(seconds, format),
    [seconds, format],
  );
  const accessibleText = useMemo(() => formatAccessibleText(parts), [parts]);

  return <RollingCountdown accessibleText={accessibleText} parts={parts} />;
}

export type { ListingCountdownDisplayProps };
export { ListingCountdownDisplay };
