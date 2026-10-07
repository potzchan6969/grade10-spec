import { Badge } from "@grade10/design-system/components/display/badge";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LISTING_LOT_GALLERY_CLASS } from "./listing-lot-layout";
import type { ListingLotGalleryImage } from "./types";

type ListingLotGalleryCopy = {
  /** Accessible name for the selected image's zoom control and dialog. */
  zoom: string;
  previous: string;
  next: string;
  /** Accessible name for the slide progress control. */
  images: string;
};

type ListingLotGalleryProps = {
  copy: ListingLotGalleryCopy;
  images: readonly ListingLotGalleryImage[];
  className?: string;
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

function ListingLotGallery({
  copy,
  images,
  className,
}: ListingLotGalleryProps) {
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [railVisible, setRailVisible] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const reduceMotionRef = useRef(false);

  const many = images.length > 1;
  const count = images.length;
  const safeIndex = count === 0 ? 0 : Math.min(Math.max(index, 0), count - 1);
  const selectedImage = images[safeIndex];
  const selectedImageKey = selectedImage
    ? `${selectedImage.src}:${selectedImage.alt}`
    : null;
  const atStart = safeIndex <= 0;
  const atEnd = count === 0 || safeIndex >= count - 1;
  const canPrev = many && !atStart;
  const canNext = many && !atEnd;

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!many || !gallery) {
      setRailVisible(false);
      return;
    }
    const thumbnailRail = gallery.querySelector<HTMLElement>("div.hidden");
    if (!thumbnailRail) return;

    const updateRailVisibility = () => {
      const visible = getComputedStyle(thumbnailRail).display !== "none";
      setRailVisible((current) => (current === visible ? current : visible));
    };

    updateRailVisibility();
    const observer = new ResizeObserver(updateRailVisibility);
    observer.observe(gallery);
    return () => observer.disconnect();
  }, [many]);

  const previousSelectedImageKeyRef = useRef(selectedImageKey);
  useLayoutEffect(() => {
    if (previousSelectedImageKeyRef.current !== selectedImageKey) {
      setZoomOpen(false);
      previousSelectedImageKeyRef.current = selectedImageKey;
    }
  }, [selectedImageKey]);

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
      setZoomOpen(false);
      setIndex(Math.min(Math.max(next, 0), count - 1));
      setDragPx(0);
    },
    [count],
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

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
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

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
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

  function onPointerUp(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    endDrag(event.clientX);
  }

  function onPointerCancel(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setDragPx(0);
  }

  function onStageKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
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
      className={cn(LISTING_LOT_GALLERY_CLASS, "@container", className)}
      data-slot="listing-lot-gallery"
      ref={galleryRef}
    >
      {/* Stage first. Thumb rail only when there is room for it on the left
          (~24rem); stacked layouts rely on chevrons and carousel progress. */}
      <div
        className={cn(
          "flex w-full flex-col gap-4",
          many &&
            "@min-[24rem]:flex-row @min-[24rem]:items-start @min-[24rem]:gap-4",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <section
            aria-label={copy.images}
            aria-roledescription={many ? "carousel" : undefined}
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-(--radius-3xl) border border-border bg-background-subtle outline-none select-none",
              many &&
                "touch-pan-y focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
            onKeyDown={many ? onStageKeyDown : undefined}
            onPointerCancel={many ? onPointerCancel : undefined}
            onPointerDown={many ? onPointerDown : undefined}
            onPointerMove={many ? onPointerMove : undefined}
            onPointerUp={many ? onPointerUp : undefined}
            ref={stageRef}
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
                // Keep inline duration so a mid-drag release still settles on-token.
                transitionDuration: dragging ? "0ms" : `${SLIDE_MS}ms`,
                transitionTimingFunction: SLIDE_EASE,
              }}
            >
              {images.map((slide, slideIndex) => (
                <section
                  aria-hidden={slideIndex !== safeIndex}
                  className="relative h-full w-full shrink-0 grow-0 basis-full"
                  key={`${slide.src}:${slide.alt}`}
                >
                  <img
                    alt={slideIndex === safeIndex ? slide.alt : ""}
                    className="pointer-events-none size-full object-contain [-webkit-user-drag:none]"
                    draggable={false}
                    src={slide.src}
                  />
                </section>
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
            {selectedImage ? (
              <IconButton
                aria-label={copy.zoom}
                className="pointer-events-auto absolute top-4 right-4 z-20"
                onClick={() => setZoomOpen(true)}
                type="button"
              >
                <MagnifyingGlass aria-hidden size={12} weight="bold" />
              </IconButton>
            ) : null}
          </section>

          {many ? (
            <CarouselProgress
              aria-label={copy.images}
              className="h-4 w-full justify-center"
            >
              {images.map((slide, slideIndex) => (
                <CarouselProgressItem
                  active={slideIndex === safeIndex}
                  key={`${slide.src}:${slide.alt}`}
                  label={`Show image ${slideIndex + 1}: ${slide.alt}`}
                  onClick={() => goTo(slideIndex)}
                />
              ))}
            </CarouselProgress>
          ) : null}
        </div>

        {many ? (
          <div className="hidden shrink-0 gap-2 overflow-x-auto overscroll-x-contain @min-[24rem]:order-first @min-[24rem]:flex @min-[24rem]:flex-col @min-[24rem]:overflow-visible">
            {images.map((thumb, thumbIndex) => {
              const selected = thumbIndex === safeIndex;
              return (
                <button
                  aria-current={selected ? "true" : undefined}
                  aria-label={`Thumbnail: ${thumb.alt}`}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-(--radius-xl) bg-background-subtle outline-none transition-[border-color] focus-visible:ring-3 focus-visible:ring-ring/50 @min-[24rem]:size-20",
                    selected
                      ? "border-2 border-primary-border"
                      : "border border-border",
                  )}
                  key={`${thumb.src}:${thumb.alt}`}
                  onClick={() => goTo(thumbIndex)}
                  type="button"
                >
                  <img
                    alt=""
                    className="size-full object-contain"
                    src={
                      railVisible ? (thumb.thumbSrc ?? thumb.src) : undefined
                    }
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      {selectedImage && zoomOpen ? (
        <Dialog onOpenChange={setZoomOpen} open>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{copy.zoom}</DialogTitle>
            </DialogHeader>
            <DialogBody tabIndex={0}>
              <img
                alt={selectedImage.alt}
                className="w-full"
                src={selectedImage.zoomSrc ?? selectedImage.src}
              />
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

export type { ListingLotGalleryCopy, ListingLotGalleryProps };
export { ListingLotGallery };
