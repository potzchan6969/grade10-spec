import { useEffect, useMemo, useState } from "react";
import {
  countdownParts,
  formatAccessibleText,
  RollingCountdown,
} from "./listing-countdown-digit";

type ListingCountdownDisplayProps = {
  initialSeconds: number;
  format?: "short" | "long";
};

function ListingCountdownDisplay({
  initialSeconds,
  format = "short",
}: ListingCountdownDisplayProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = useMemo(
    () => countdownParts(seconds, format),
    [seconds, format],
  );
  const accessibleText = useMemo(() => formatAccessibleText(parts), [parts]);

  return (
    <RollingCountdown accessibleText={accessibleText} parts={parts} />
  );
}

export type { ListingCountdownDisplayProps };
export { ListingCountdownDisplay };
