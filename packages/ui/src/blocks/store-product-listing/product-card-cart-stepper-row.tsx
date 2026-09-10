import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { Minus, Plus, Trash } from "@phosphor-icons/react";
import { useState } from "react";

type ProductCardCartStepperRowProps = {
  qty: number;
  /** Ceiling the consumer supplies. Omit it and the row counts on unbounded. */
  max?: number;
  /** Accessible names, as the consumer's copy supplies them — none is invented. */
  decrementLabel?: string;
  incrementLabel?: string;
  removeLabel?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
};

/**
 * Stepper Input (`4623:395`) control row on the primary cart pill — same inset,
 * `sm` icon buttons, and rolling digit on step.
 */
function ProductCardCartStepperRow({
  qty,
  max,
  decrementLabel,
  incrementLabel,
  removeLabel,
  onIncrement,
  onDecrement,
  className,
}: ProductCardCartStepperRowProps) {
  const [roll, setRoll] = useState<"up" | "down" | null>(null);
  const atMin = qty <= 1;
  const atMax = max != null && qty >= max;

  const playRoll = (direction: "up" | "down") => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRoll(direction);
  };

  const stepBy = (direction: 1 | -1) => {
    if (direction > 0) {
      if (atMax) return;
      onIncrement();
      playRoll("up");
    } else {
      onDecrement();
      playRoll("down");
    }
  };

  const capClassName =
    "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20";

  return (
    <div className={cn("flex h-10 w-full items-center px-[3px]", className)}>
      <IconButton
        aria-label={atMin ? removeLabel : decrementLabel}
        className={capClassName}
        data-slot="stepper-decrement"
        onClick={(event) => {
          event.stopPropagation();
          stepBy(-1);
        }}
        onPointerDown={(event) => event.preventDefault()}
        size="sm"
        type="button"
        variant="ghost"
      >
        {atMin ? (
          <Trash aria-hidden size={12} weight="bold" />
        ) : (
          <Minus aria-hidden size={12} weight="bold" />
        )}
      </IconButton>
      <span
        aria-live="polite"
        aria-valuenow={qty}
        className={cn(
          "min-w-[1.25rem] flex-1 text-center text-sm font-normal tabular-nums text-primary-foreground",
          roll === "up" &&
            "animate-in fade-in slide-in-from-bottom-2 duration-150 motion-reduce:animate-none",
          roll === "down" &&
            "animate-in fade-in slide-in-from-top-2 duration-150 motion-reduce:animate-none",
        )}
        onAnimationEnd={() => setRoll(null)}
        role="spinbutton"
      >
        {qty}
      </span>
      <IconButton
        aria-label={incrementLabel}
        className={capClassName}
        data-slot="stepper-increment"
        disabled={atMax}
        onClick={(event) => {
          event.stopPropagation();
          stepBy(1);
        }}
        onPointerDown={(event) => event.preventDefault()}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Plus aria-hidden size={12} weight="bold" />
      </IconButton>
    </div>
  );
}

export type { ProductCardCartStepperRowProps };
export { ProductCardCartStepperRow };
