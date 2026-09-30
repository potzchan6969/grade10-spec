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
    if (closesAtMs == null) {
      const timer = window.setInterval(() => {
        setSeconds((value) => Math.max(0, value - 1));
      }, 1000);
      return () => window.clearInterval(timer);
    }
    // Ticks as the whole seconds left turn, so every screen counting down
    // to the same instant changes its digit together.
    let timer: number | undefined;
    const tick = () => {
      setSeconds(remainingSecondsUntil(closesAtMs));
      const rest = (((closesAtMs - Date.now()) % 1000) + 1000) % 1000;
      timer = window.setTimeout(tick, rest === 0 ? 1000 : rest);
    };
    tick();
    return () => window.clearTimeout(timer);
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
