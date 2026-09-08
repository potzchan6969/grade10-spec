import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  approach,
  beyond,
  clampOffset,
  DRAG_SLOP,
  dragOffset,
  hoverOffset,
  revealOffset,
  type Still,
} from "./pan";

type Motion = { position: number; target: number; frame: number };

type Touch = { id: number; x: number; offset: number; dragging: boolean };

/** A strip wider than the room it has. It opens at its left edge and never
 * shows a scrollbar: a mouse moving across it pans it, a finger drags it, and
 * the side that still holds more fades. `reveal` names elements the strip
 * should pan to show — a lit part of a diagram, say — and `holds` the ones
 * the mouse can rest on at either end without the strip sliding away. Content
 * marked `data-pan-still` holds the strip wherever it is while the mouse is
 * on it: a card to read, a control to press. */
export function PanStrip({
  children,
  reveal = null,
  holds = [],
  className = "",
}: {
  children: ReactNode;
  reveal?: Element[] | null;
  holds?: Element[];
  className?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({ position: 0, target: 0, frame: 0 });
  const touch = useRef<Touch | null>(null);
  const swallowClick = useRef(false);
  const [edges, setEdges] = useState({ before: false, after: false });

  /** The strip sits where `position` says, never where the browser rounded
   * `scrollLeft` to — reading that back would stall a settle short of its
   * target. */
  const place = useCallback((element: HTMLDivElement, at: number) => {
    motion.current.position = at;
    element.scrollLeft = at;
    const next = beyond(at, overflowOf(element));
    setEdges((edge) =>
      edge.before === next.before && edge.after === next.after ? edge : next,
    );
  }, []);

  const settle = useCallback(() => {
    const m = motion.current;
    const element = viewport.current;
    if (!element) {
      m.frame = 0;
      return;
    }
    place(element, approach(m.position, m.target));
    m.frame =
      m.position === m.target ? 0 : window.requestAnimationFrame(settle);
  }, [place]);

  const panTo = useCallback(
    (offset: number, immediate = false) => {
      const element = viewport.current;
      if (!element) return;
      const m = motion.current;
      m.target = clampOffset(offset, overflowOf(element));
      if (immediate || reducedMotion()) {
        halt(m);
        place(element, m.target);
        return;
      }
      if (m.frame === 0) m.frame = window.requestAnimationFrame(settle);
    },
    [place, settle],
  );

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      panTo(motion.current.target, true),
    );
    observer.observe(element);
    for (const child of Array.from(element.children)) observer.observe(child);
    return () => {
      observer.disconnect();
      halt(motion.current);
    };
  }, [panTo]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || !reveal || reveal.length === 0) return;
    const span = spanOf(reveal, element);
    if (!span) return;
    panTo(
      revealOffset(
        motion.current.position,
        element.clientWidth,
        overflowOf(element),
        span,
      ),
    );
  }, [reveal, panTo]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    touch.current = {
      id: event.pointerId,
      x: event.clientX,
      offset: motion.current.position,
      dragging: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = viewport.current;
    if (!element) return;
    const held = touch.current;
    if (held) {
      const travelled = event.clientX - held.x;
      if (!held.dragging) {
        if (Math.abs(travelled) < DRAG_SLOP) return;
        held.dragging = true;
        element.setPointerCapture(held.id);
      }
      panTo(dragOffset(held.offset, travelled, overflowOf(element)), true);
      return;
    }
    if (event.pointerType !== "mouse" || restingOn(event.target)) return;
    const box = element.getBoundingClientRect();
    panTo(
      hoverOffset(
        event.clientX - box.left,
        box.width,
        overflowOf(element),
        stillOf(holds, element),
      ),
    );
  };

  const release = () => {
    if (touch.current?.dragging) swallowClick.current = true;
    touch.current = null;
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!swallowClick.current) return;
    swallowClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={`manual-pan ${className}`}
      data-after={edges.after ? "" : undefined}
      data-before={edges.before ? "" : undefined}
      onClickCapture={onClickCapture}
      onPointerCancel={release}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      ref={viewport}
    >
      {children}
    </div>
  );
}

const restingOn = (target: EventTarget | null) =>
  (target as Element | null)?.closest?.("[data-pan-still]") != null;

const halt = (m: Motion) => {
  window.cancelAnimationFrame(m.frame);
  m.frame = 0;
};

const overflowOf = (element: HTMLDivElement) =>
  element.scrollWidth - element.clientWidth;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Room for a mouse to cover the first and last of the elements while the
 * strip sits at that end, plus a little past them. */
function stillOf(
  elements: Element[],
  viewport: HTMLDivElement,
): Still | undefined {
  const span = spanOf(elements, viewport);
  if (!span) return undefined;
  const origin = viewport.getBoundingClientRect().left - viewport.scrollLeft;
  let firstEnd = Number.POSITIVE_INFINITY;
  let lastStart = Number.NEGATIVE_INFINITY;
  for (const element of elements) {
    const box = element.getBoundingClientRect();
    if (box.width === 0) continue;
    firstEnd = Math.min(firstEnd, box.right - origin);
    lastStart = Math.max(lastStart, box.left - origin);
  }
  const width = viewport.clientWidth;
  return {
    start: firstEnd + STILL_PAST,
    end: width - (lastStart - overflowOf(viewport)) + STILL_PAST,
  };
}

const STILL_PAST = 12;

/** The span the elements cover, in the strip's own pixels. */
function spanOf(
  elements: Element[],
  viewport: HTMLDivElement,
): { start: number; end: number } | null {
  const origin = viewport.getBoundingClientRect().left - viewport.scrollLeft;
  let start = Number.POSITIVE_INFINITY;
  let end = Number.NEGATIVE_INFINITY;
  for (const element of elements) {
    const box = element.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) continue;
    start = Math.min(start, box.left - origin);
    end = Math.max(end, box.right - origin);
  }
  return start <= end ? { start, end } : null;
}
