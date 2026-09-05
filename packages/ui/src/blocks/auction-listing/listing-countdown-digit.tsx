import { useLayoutEffect, useRef, useState } from "react";
import "./listing-countdown-digit.css";

type CountdownPart = {
  value: number;
  unit: string;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function RollingDigit({
  digit,
  animate = true,
}: {
  digit: string;
  animate?: boolean;
}) {
  const previous = useRef(digit);
  const [outgoing, setOutgoing] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (previous.current === digit) return;
    if (!animate || prefersReducedMotion()) {
      previous.current = digit;
      setOutgoing(null);
      return;
    }
    setOutgoing(previous.current);
    previous.current = digit;
  }, [animate, digit]);

  if (outgoing === null) {
    return (
      <span className="countdown-digit-slot">
        <span className="countdown-digit-cell">{digit}</span>
      </span>
    );
  }

  return (
    <span className="countdown-digit-slot">
      <span
        className="countdown-digit-reel is-rolling"
        onAnimationEnd={() => setOutgoing(null)}
      >
        <span className="countdown-digit-cell">{outgoing}</span>
        <span className="countdown-digit-cell">{digit}</span>
      </span>
    </span>
  );
}

function RollingNumber({ value }: { value: number }) {
  const digits = String(value)
    .split("")
    .map((digit, index, all) => ({ digit, place: all.length - index }));

  return (
    <span className="countdown-number">
      {digits.map(({ digit, place }) => (
        <RollingDigit digit={digit} key={place} />
      ))}
    </span>
  );
}

function RollingCountdown({
  parts,
  accessibleText,
}: {
  parts: CountdownPart[];
  accessibleText: string;
}) {
  return (
    <span className="countdown-display">
      <span className="sr-only">{accessibleText}</span>
      <span aria-hidden="true" className="countdown-segments">
        {parts.map((part) => (
          <span className="countdown-segment" key={part.unit}>
            <RollingNumber value={part.value} />
            <span className="countdown-unit">{part.unit}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

function countdownParts(
  seconds: number,
  format: "short" | "long",
): CountdownPart[] {
  const DAY_SECONDS = 24 * 60 * 60;
  const HOUR_SECONDS = 60 * 60;

  if (format === "long") {
    const days = Math.floor(seconds / DAY_SECONDS);
    const hours = Math.floor((seconds % DAY_SECONDS) / HOUR_SECONDS);
    const minutes = Math.floor((seconds % HOUR_SECONDS) / 60);
    const secs = seconds % 60;
    return [
      { value: days, unit: "d" },
      { value: hours, unit: "h" },
      { value: minutes, unit: "m" },
      { value: secs, unit: "s" },
    ];
  }

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return [
    { value: minutes, unit: "m" },
    { value: secs, unit: "s" },
  ];
}

/** Compact elapsed span for a closed lot — stays on one line in the bid card. */
function elapsedDurationParts(seconds: number): CountdownPart[] {
  const DAY_SECONDS = 24 * 60 * 60;
  const HOUR_SECONDS = 60 * 60;
  const safe = Math.max(0, Math.floor(seconds));
  const days = Math.floor(safe / DAY_SECONDS);
  const hours = Math.floor((safe % DAY_SECONDS) / HOUR_SECONDS);
  const minutes = Math.floor((safe % HOUR_SECONDS) / 60);
  const secs = safe % 60;

  if (days >= 1) {
    return [
      { value: days, unit: "d" },
      { value: hours, unit: "h" },
    ];
  }
  if (hours >= 1) {
    return [
      { value: hours, unit: "h" },
      { value: minutes, unit: "m" },
    ];
  }
  return [
    { value: minutes, unit: "m" },
    { value: secs, unit: "s" },
  ];
}

function formatAccessibleText(parts: CountdownPart[]): string {
  return parts.map((part) => `${part.value}${part.unit}`).join(" ");
}

export {
  countdownParts,
  elapsedDurationParts,
  formatAccessibleText,
  RollingCountdown,
  RollingDigit,
};
