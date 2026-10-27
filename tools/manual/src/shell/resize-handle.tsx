import { cn } from "@grade10/design-system/lib/utils";
import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";

const STEP = 16;

type ResizeHandleProps = {
  label: string;
  /** The width of what the handle resizes. */
  width: number;
  min: number;
  max: number;
  /** `1` where dragging right widens it, `-1` where dragging left does. */
  grows: 1 | -1;
  /** Every move of a drag, unclamped, so the owner can preview a fold. */
  onMove: (width: number) => void;
  /** Where the drag or the key left it. */
  onCommit: (width: number) => void;
  /** Enter on the handle: what folding means for its owner. */
  onToggle?: () => void;
  className?: string;
};

/**
 * A vertical border that can be dragged. It sits in the flow at zero width and
 * reaches four pixels either side, so it takes nothing from either column.
 * While it is held, the frames on the page stop listening, or a story's
 * iframe would swallow the drag the moment the pointer crossed it.
 */
export function ResizeHandle({
  label,
  width,
  min,
  max,
  grows,
  onMove,
  onCommit,
  onToggle,
  className,
}: ResizeHandleProps) {
  const start = useRef<{ x: number; width: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const at = (event: PointerEvent) =>
    start.current
      ? start.current.width + grows * (event.clientX - start.current.x)
      : width;

  const release = (event: PointerEvent) => {
    if (!start.current) return;
    const next = at(event);
    start.current = null;
    setDragging(false);
    delete document.body.dataset.resizing;
    onCommit(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const step =
      event.key === "ArrowRight" ? STEP : event.key === "ArrowLeft" ? -STEP : 0;
    if (step !== 0) {
      event.preventDefault();
      onCommit(width + grows * step);
    } else if (event.key === "Enter" && onToggle) {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={cn(
        "sticky top-16 z-20 h-[calc(100dvh-4rem)] w-0 shrink-0",
        className,
      )}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: a focusable separator is the ARIA pattern for a splitter; `hr` cannot take focus or a value. */}
      <div
        aria-label={label}
        aria-orientation="vertical"
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={Math.round(width)}
        className={cn(
          "group/handle absolute inset-y-0 -left-1 w-2 cursor-col-resize touch-none outline-none",
          "focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
        data-dragging={dragging || undefined}
        onKeyDown={onKeyDown}
        onLostPointerCapture={release}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          start.current = { x: event.clientX, width };
          setDragging(true);
          document.body.dataset.resizing = "";
        }}
        onPointerMove={(event) => {
          if (start.current) onMove(at(event));
        }}
        onPointerUp={release}
        role="separator"
        tabIndex={0}
      >
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-transparent transition-colors group-hover/handle:bg-border-strong group-focus-visible/handle:bg-primary group-data-dragging/handle:bg-primary" />
      </div>
    </div>
  );
}
