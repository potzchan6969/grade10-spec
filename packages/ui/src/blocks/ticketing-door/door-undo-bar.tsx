import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

type DoorUndoBarCopy = {
  /** "Undo" */
  undo: string;
};

type DoorUndoBarProps = {
  copy: DoorUndoBarCopy;
  /** Whole seconds left to undo, counted down by the consumer. */
  secondsLeft: number;
  /** The whole window, 10 at the door. */
  totalSeconds: number;
  /** The seconds left, worded: "7 s". */
  remaining: string;
  /** Undo is on its way. */
  pending?: boolean;
  onUndo: () => void;
  /** `lg` on a phone, `md` in the console. */
  size?: "md" | "lg";
  className?: string;
};

/**
 * Undo for the seconds after an admission: a pill whose fill drains as the
 * window closes, naming the seconds left. The consumer counts down and takes
 * the bar away at zero.
 */
function DoorUndoBar({
  copy,
  secondsLeft,
  totalSeconds,
  remaining,
  pending = false,
  onUndo,
  size = "lg",
  className,
}: DoorUndoBarProps) {
  const share =
    totalSeconds > 0 ? Math.min(1, Math.max(0, secondsLeft / totalSeconds)) : 0;
  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      data-slot="door-undo-bar"
      disabled={secondsLeft <= 0}
      loading={pending}
      onClick={onUndo}
      size={size}
      type="button"
      variant="outline"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-muted transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
        style={{ width: `${share * 100}%` }}
      />
      <span className="relative inline-flex items-center gap-2">
        <ArrowCounterClockwise aria-hidden />
        {copy.undo}
        <span className="text-secondary-foreground tabular-nums">
          {remaining}
        </span>
      </span>
    </Button>
  );
}

export { DoorUndoBar, type DoorUndoBarCopy, type DoorUndoBarProps };
