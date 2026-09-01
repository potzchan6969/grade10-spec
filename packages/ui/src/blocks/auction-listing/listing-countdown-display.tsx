import { useEffect, useMemo, useState } from "react";
import {
  countdownParts,
  formatAccessibleText,
  RollingCountdown,
} from "./listing-countdown-digit";

type ListingCountdownDisplayProps = {
  initialSeconds: number;
  /** When set, remaining time is derived from this instant on every tick. */
  closesAtMs?: number | null;
  format?: "short" | "long";
};

function remainingSecondsUntil(closesAtMs: number) {
  return Math.max(0, Math.floor((closesAtMs - Date.now()) / 1000));
}

function ListingCountdownDisplay({
  initialSeconds,
  closesAtMs,
  format = "short",
}: ListingCountdownDisplayProps) {
  const [seconds, setSeconds] = useState(() =>
    closesAtMs != null ? remainingSecondsUntil(closesAtMs) : initialSeconds,
  );

  useEffect(() => {
    setSeconds(
      closesAtMs != null ? remainingSecondsUntil(closesAtMs) : initialSeconds,
    );
  }, [closesAtMs, initialSeconds]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) =>
        closesAtMs != null ? remainingSecondsUntil(closesAtMs) : Math.max(0, value - 1),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [closesAtMs]);

  const parts = useMemo(
    () => countdownParts(seconds, format),
    [seconds, format],
  );
  const accessibleText = useMemo(() => formatAccessibleText(parts), [parts]);

  return <RollingCountdown accessibleText={accessibleText} parts={parts} />;
}

export type { ListingCountdownDisplayProps };
export { ListingCountdownDisplay };
