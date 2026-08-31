import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

const DIGIT_STAGGER_MS = 40;

function parseAmount(value: string): number | null {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Split `HK$42,700.00` into a static prefix and rolling amount segment. */
function splitFormattedAmount(value: string): {
  prefix: string;
  amount: string;
} {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)$/);
  if (!match) return { prefix: "", amount: value };
  return { prefix: match[1], amount: match[2] };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type RollAnimation = {
  direction: "up" | "down";
  run: number;
};

type RollingValueProps = {
  value: string;
  loading?: boolean;
  className?: string;
};

/**
 * Stepper-style slide on each amount character when a formatted value changes.
 * Currency or label prefixes stay static. First paint and post-loading reveal
 * stay static.
 */
function RollingValue({
  value,
  loading = false,
  className,
}: RollingValueProps) {
  const previousText = useRef<string | null>(null);
  const wasLoading = useRef(loading);
  const [animation, setAnimation] = useState<RollAnimation | null>(null);
  const { prefix, amount } = splitFormattedAmount(value);
  const amountChars = [...amount];
  const lastIndex = amountChars.length - 1;

  useLayoutEffect(() => {
    if (loading) {
      wasLoading.current = true;
      return;
    }

    if (wasLoading.current) {
      wasLoading.current = false;
      previousText.current = value;
      return;
    }

    const previous = previousText.current;
    previousText.current = value;

    if (previous === null || previous === value) return;

    const previousAmount = parseAmount(previous);
    const nextAmount = parseAmount(value);
    if (
      previousAmount === null ||
      nextAmount === null ||
      previousAmount === nextAmount
    ) {
      return;
    }

    if (prefersReducedMotion()) return;

    setAnimation((current) => ({
      direction: nextAmount > previousAmount ? "up" : "down",
      run: (current?.run ?? 0) + 1,
    }));
  }, [value, loading]);

  const slideClass =
    animation?.direction === "up"
      ? "animate-in fade-in slide-in-from-bottom-2 duration-150 motion-reduce:animate-none"
      : animation?.direction === "down"
        ? "animate-in fade-in slide-in-from-top-2 duration-150 motion-reduce:animate-none"
        : undefined;

  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {amountChars.map((ch, index) => (
          <span
            key={
              animation ? `${animation.run}-${index}` : `settled-${index}-${ch}`
            }
            className={cn("inline-block", slideClass)}
            style={
              animation
                ? { animationDelay: `${index * DIGIT_STAGGER_MS}ms` }
                : undefined
            }
            onAnimationEnd={
              animation && index === lastIndex
                ? () => setAnimation(null)
                : undefined
            }
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

type RollValueOptions = {
  loading?: boolean;
  className?: string;
};

/** Wrap string amounts in RollingValue; leave other nodes alone. */
function rollValue(value: ReactNode, options?: RollValueOptions): ReactNode {
  if (typeof value !== "string") return value;
  return (
    <RollingValue
      className={options?.className}
      loading={options?.loading}
      value={value}
    />
  );
}

export { RollingValue, rollValue };
