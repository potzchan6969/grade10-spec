import { Badge } from "@grade10/design-system/components/display/badge";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type GalleryCarouselImage = {
  src: string;
  alt: string;
};

type GalleryCarouselCopy = {
  previous: string;
  next: string;
  /** Accessible name for the stage and the slide progress control. */
  images: string;
};

type GalleryCarouselProps = {
  copy: GalleryCarouselCopy;
  images: readonly GalleryCarouselImage[];
  className?: string;
  /** When set, the carousel is controlled; otherwise it keeps its own index. */
  index?: number;
  onIndexChange?: (index: number) => void;
  /** Thumbnail rail or other chrome rendered beside / above the stage. */
  thumbs?: ReactNode;
};

/** Page-slide motion — `--duration-fast` + `--ease-smooth-out`. */
const SLIDE_MS = 250;
const SLIDE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Fraction of stage width that commits a swipe to the next slide. */
const SWIPE_THRESHOLD = 0.2;
/** Ignore tiny moves so a vertical scroll does not steal the gallery. */
const DRAG_LOCK_PX = 8;
/** Dampen overscroll at the first/last slide so the edge feels soft. */
const EDGE_RESISTANCE = 0.28;
/** Expand the 32px IconButton visual to a 44px touch target. */
const CHEVRON_HIT =
  "pointer-events-auto relative after:absolute after:-inset-1.5 after:content-['']";

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  width: number;
  /** null = undecided, true = horizontal slide, false = vertical scroll. */
  axis: boolean | null;
};

/**
 * Swipeable image stage with chevrons, counter badge, and progress dots.
 * Optional `thumbs` slot sits beside the stage from `md` up and above it on
 * narrow viewports — ListingLotGallery is the worked consumer.
 */
function GalleryCarousel({
  copy,
  images,
  className,
  index: controlledIndex,
  onIndexChange,
  thumbs,
}: GalleryCarouselProps) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const reduceMotionRef = useRef(false);

  const many = images.length > 1;
  const count = images.length;
  const index = controlledIndex ?? uncontrolledIndex;
  const safeIndex =
    count === 0 ? 0 : Math.min(Math.max(index, 0), count - 1);
  const atStart = safeIndex <= 0;
  const atEnd = count === 0 || safeIndex >= count - 1;
  const canPrev = many && !atStart;
  const canNext = many && !atEnd;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = media.matches;
    function onChange() {
      reduceMotionRef.current = media.matches;
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      const clamped = Math.min(Math.max(next, 0), count - 1);
      if (controlledIndex === undefined) setUncontrolledIndex(clamped);
      onIndexChange?.(clamped);
      setDragPx(0);
    },
    [controlledIndex, count, onIndexChange],
  );

  function step(delta: number) {
    if (delta < 0 && !canPrev) return;
    if (delta > 0 && !canNext) return;
    const next = safeIndex + delta;
    goTo(next);
    // Chevron unmounts at an edge — keep keyboard control on the stage.
    if ((delta > 0 && next >= count - 1) || (delta < 0 && next <= 0)) {
      queueMicrotask(() => {
        stageRef.current?.focus({ preventScroll: true });
      });
    }
  }

  function clampDrag(dx: number) {
    if (dx > 0 && !canPrev) return dx * EDGE_RESISTANCE;
    if (dx < 0 && !canNext) return dx * EDGE_RESISTANCE;
    return dx;
  }

  function endDrag(clientX: number) {
    const drag = dragRef.current;
    if (!drag) return;
    const wasHorizontal = drag.axis === true;
    const rawDx = clientX - drag.startX;
    const dx = wasHorizontal ? clampDrag(rawDx) : 0;
    const threshold = drag.width * SWIPE_THRESHOLD;
    dragRef.current = null;
    setDragging(false);

    if (wasHorizontal && Math.abs(dx) >= threshold) {
      const delta = dx < 0 ? 1 : -1;
      if ((delta < 0 && canPrev) || (delta > 0 && canNext)) {
        step(delta);
        return;
      }
    }
    setDragPx(0);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!many || event.button !== 0) return;
    if (reduceMotionRef.current) return;
    if ((event.target as Element).closest("button")) return;
    const stage = stageRef.current;
    if (!stage) return;
    stage.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: stage.clientWidth,
      axis: null,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (drag.axis === null) {
      if (Math.abs(dx) < DRAG_LOCK_PX && Math.abs(dy) < DRAG_LOCK_PX) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.axis = false;
        const stage = stageRef.current;
        if (stage?.hasPointerCapture(event.pointerId)) {
          stage.releasePointerCapture(event.pointerId);
        }
        dragRef.current = null;
        setDragging(false);
        setDragPx(0);
        return;
      }
      drag.axis = true;
      setDragging(true);
    }

    if (drag.axis !== true) return;
    setDragPx(clampDrag(dx));
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    endDrag(event.clientX);
  }

  function onPointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setDragPx(0);
  }

  function onStageKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!many) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4",
        many && thumbs != null && "md:flex-row md:items-start md:gap-4",
        className,
      )}
      data-slot="gallery-carousel"
    >
      {many && thumbs != null ? thumbs : null}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div
          aria-label={copy.images}
          aria-roledescription={many ? "carousel" : undefined}
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-(--radius-3xl) border border-border bg-background-subtle outline-none",
            many &&
              "touch-pan-y focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
          onKeyDown={many ? onStageKeyDown : undefined}
          onPointerCancel={many ? onPointerCancel : undefined}
          onPointerDown={many ? onPointerDown : undefined}
          onPointerMove={many ? onPointerMove : undefined}
          onPointerUp={many ? onPointerUp : undefined}
          ref={stageRef}
          role={many ? "region" : undefined}
          tabIndex={many ? 0 : undefined}
        >
          <div
            className={cn(
              "flex h-full w-full will-change-transform",
              many && "cursor-grab active:cursor-grabbing",
              !dragging &&
                "transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            )}
            style={{
              transform: `translate3d(calc(${-safeIndex * 100}% + ${dragPx}px), 0, 0)`,
              transitionDuration: dragging ? "0ms" : `${SLIDE_MS}ms`,
              transitionTimingFunction: SLIDE_EASE,
            }}
          >
            {images.map((slide, slideIndex) => (
              <div
                aria-hidden={slideIndex !== safeIndex}
                aria-roledescription={
                  many && slideIndex === safeIndex ? "slide" : undefined
                }
                className="relative h-full w-full shrink-0 grow-0 basis-full"
                key={`${slide.src}:${slide.alt}`}
                role={
                  many && slideIndex === safeIndex ? "group" : undefined
                }
              >
                <img
                  alt={slideIndex === safeIndex ? slide.alt : ""}
                  className="pointer-events-none size-full object-contain"
                  draggable={false}
                  src={slide.src}
                />
              </div>
            ))}
          </div>

          {many ? (
            <>
              <div className="pointer-events-none absolute inset-y-0 z-10 flex w-full items-center justify-between px-4">
                {canPrev ? (
                  <IconButton
                    aria-label={copy.previous}
                    className={CHEVRON_HIT}
                    onClick={() => step(-1)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CaretLeft aria-hidden size={12} weight="bold" />
                  </IconButton>
                ) : (
                  <span aria-hidden className="size-8" />
                )}
                {canNext ? (
                  <IconButton
                    aria-label={copy.next}
                    className={CHEVRON_HIT}
                    onClick={() => step(1)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CaretRight aria-hidden size={12} weight="bold" />
                  </IconButton>
                ) : (
                  <span aria-hidden className="size-8" />
                )}
              </div>
              <Badge
                aria-atomic="true"
                aria-live="polite"
                className="pointer-events-none absolute bottom-4 left-4 z-10"
                size="sm"
                variant="outline"
              >
                <span className="sr-only">
                  Image {safeIndex + 1} of {images.length}
                </span>
                <span aria-hidden>
                  {safeIndex + 1} / {images.length}
                </span>
              </Badge>
            </>
          ) : null}
        </div>

        {many ? (
          <CarouselProgress
            aria-label={copy.images}
            className="h-4 w-full justify-center"
          >
            {images.map((slide, slideIndex) => (
              <CarouselProgressItem
                active={slideIndex === safeIndex}
                className="after:absolute after:-inset-3 after:content-['']"
                key={`${slide.src}:${slide.alt}`}
                label={`Show image ${slideIndex + 1}: ${slide.alt}`}
                onClick={() => goTo(slideIndex)}
              />
            ))}
          </CarouselProgress>
        ) : null}
      </div>
    </div>
  );
}

export type {
  GalleryCarouselCopy,
  GalleryCarouselImage,
  GalleryCarouselProps,
};
export { GalleryCarousel };
