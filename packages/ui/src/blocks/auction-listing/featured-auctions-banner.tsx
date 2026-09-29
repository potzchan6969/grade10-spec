import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { StepIndicator } from "@grade10/design-system/components/display/step-indicator";
import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowRight,
  CalendarBlank,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ListingRollingMoneyDisplay } from "./listing-rolling-money-display";

/** Auto-advance dwell per slide. */
const AUTO_ADVANCE_MS = 5000;

/**
 * Slide motion — `--duration-fast` + `--ease-smooth-out`.
 * Below md the stage pages horizontally (track + swipe). From md it fades the
 * new image in over an opaque underlay (never both translucent — that flashed
 * the empty cell). Copy may soften with `--blur-small`.
 */
const CROSSFADE_MS = 250;
const CROSSFADE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COPY_BLUR_PX = 2;
/** Horizontal page on the small-viewport stage. */
const SLIDE_MS = 250;
const SLIDE_EASE = CROSSFADE_EASE;

const HOUR_MS = 60 * 60 * 1000;

/** Fraction of stage width that commits a swipe to the next slide. */
const SWIPE_THRESHOLD = 0.2;
/** Ignore tiny moves so a vertical scroll does not steal the stage. */
const DRAG_LOCK_PX = 8;
/** Expand the 32px IconButton visual to a 44px touch target. */
const CHEVRON_HIT =
  "pointer-events-auto relative after:absolute after:-inset-1.5 after:content-['']";
/** Tailwind `md` — chevrons and swipe only below this. */
const MD_UP_MQ = "(min-width: 768px)";

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  width: number;
  /** null = undecided, true = horizontal slide, false = vertical scroll. */
  axis: boolean | null;
};

/** The lot's external status, as the public catalogue answers it. */
type FeaturedAuctionsBannerStatus = "active" | "upcoming" | "ended";

/**
 * Which clock the slide runs. `ends` is the served close, `opens` the served
 * open — the banner never derives one from the other.
 */
type FeaturedAuctionsBannerCountdown = {
  kind: "ends" | "opens";
  atMs: number;
};

/** Words every slide says the same way, whatever lot it holds. */
type FeaturedAuctionsBannerCopy = {
  /** Status line, one per external status. */
  active: string;
  upcoming: string;
  ended: string;
  /** Price caption once bids stand, before they do, and after close. */
  currentBid: string;
  startingBid: string;
  finalBid: string;
  /** Active opens with Bid Now; Upcoming (and Ended) with View Auction. */
  bidNow: string;
  viewAuction: string;
  /** Read before the countdown: "Ends in", "Opens in". */
  endsIn: string;
  opensIn: string;
  /** Absolute closed stamp lead for an Ended slide: "Ended". */
  endedAt: string;
  /** Accessible name of the progress control. */
  progress: string;
  /** One slide's control. `{position}` and `{title}` are filled in. */
  slide: string;
  /** Previous slide control (small viewports, on the stage). */
  previous: string;
  /** Next slide control (small viewports, on the stage). */
  next: string;
};

/**
 * Stage `sizes` for the Featured band: full width below md, ~⅔ viewport from
 * md (the right column under `1fr / 2fr`). Consumers with a CDN ladder pass
 * matching `imageSrcSet` widths.
 */
const STAGE_IMAGE_SIZES = "(min-width: 768px) 66vw, 100vw";

type FeaturedAuctionsBannerSlide = {
  id: string;
  title: string;
  status: FeaturedAuctionsBannerStatus;
  /** The slot's front page image — paints the banner stage. */
  imageSrc: string;
  imageAlt?: string;
  /**
   * Responsive ladder for `imageSrc` (CDN widths). Omit it and the browser
   * loads `imageSrc` alone.
   */
  imageSrcSet?: string;
  /**
   * `sizes` for the stage. Defaults to full width below md and ~66vw from md.
   */
  imageSizes?: string;
  /**
   * Lot gallery first image when the front page URL fails to load. Omit it and
   * a failed load falls through to the stage's default background colour.
   */
  fallbackImageSrc?: string;
  /** Current or starting price in minor units — Active rolls on increase. */
  currentBidMinor: number;
  /** ISO 4217 code. */
  currency: string;
  /** Omit it and the slide shows no clock. */
  countdown?: FeaturedAuctionsBannerCountdown;
  /** Absolute close label for Ended slides (`Ended {closeLabel}`). */
  closeLabel?: string;
  /** Lot page address for the stage image, the title, and the CTA. */
  href?: string;
  /** Used where `href` is absent — a router owns the route instead. */
  onOpen?: () => void;
};

type FeaturedAuctionsBannerProps = {
  copy: FeaturedAuctionsBannerCopy;
  slides: readonly FeaturedAuctionsBannerSlide[];
  locale?: string;
  className?: string;
};

const pressable =
  "cursor-pointer rounded-md outline-none transition-opacity duration-200 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-80 motion-reduce:transition-none";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** True from the Tailwind `md` breakpoint up — stage chevrons/swipe stay off. */
function useIsMdUp() {
  const [mdUp, setMdUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MD_UP_MQ).matches : true,
  );

  useEffect(() => {
    const media = window.matchMedia(MD_UP_MQ);
    setMdUp(media.matches);
    const onChange = () => setMdUp(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return mdUp;
}

function statusLabel(
  status: FeaturedAuctionsBannerStatus,
  copy: FeaturedAuctionsBannerCopy,
): string {
  switch (status) {
    case "active":
      return copy.active;
    case "upcoming":
      return copy.upcoming;
    case "ended":
      return copy.ended;
  }
}

function unit(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/**
 * List-card short remaining — `7d 0h 7m` down to `12m 05s`, or `now` at zero.
 * Not the lot-page rolling digit countdown.
 */
function remainingParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (total === 0) return { short: "now", long: "now" };
  if (days > 0) {
    return {
      short: `${days}d ${hours}h ${minutes}m`,
      long: `${unit(days, "day")} ${unit(hours, "hour")} ${unit(minutes, "minute")}`,
    };
  }
  if (hours > 0) {
    return {
      short: `${hours}h ${minutes}m`,
      long: `${unit(hours, "hour")} ${unit(minutes, "minute")}`,
    };
  }
  return {
    short: `${minutes}m ${String(seconds).padStart(2, "0")}s`,
    long: `${unit(minutes, "minute")} ${unit(seconds, "second")}`,
  };
}

function useNow(targetMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const next = Date.now();
      setNow(next);
      const left = targetMs - next;
      timer = window.setTimeout(tick, left > HOUR_MS ? 60_000 : 1_000);
    };
    timer = window.setTimeout(
      tick,
      targetMs - Date.now() > HOUR_MS ? 60_000 : 1_000,
    );
    return () => window.clearTimeout(timer);
  }, [targetMs]);
  return now;
}

/** Relative Ends in / Opens in — neutral colour; never invents Ended chrome. */
function BannerCountdown({
  countdown,
  copy,
}: {
  countdown: FeaturedAuctionsBannerCountdown;
  copy: FeaturedAuctionsBannerCopy;
}) {
  const now = useNow(countdown.atMs);
  const left = countdown.atMs - now;
  const parts = remainingParts(left);
  const lead = countdown.kind === "opens" ? copy.opensIn : copy.endsIn;
  const target = new Date(countdown.atMs).toISOString();

  return (
    <time
      className="text-sm tabular-nums text-secondary-foreground"
      dateTime={target}
    >
      <span className="sr-only">
        {lead} {parts.long}
      </span>
      <span aria-hidden="true">
        {lead} {parts.short}
      </span>
    </time>
  );
}

/**
 * The stage image and the title both open the lot. A slide carries an address
 * or a handler, so one is a link and the other a button; with neither, the
 * mark is inert rather than a control that answers nothing.
 */
function OpenLot({
  slide,
  className,
  children,
  style,
  tabIndex,
  "aria-hidden": ariaHidden,
  inert: inertProp,
}: {
  slide: FeaturedAuctionsBannerSlide;
  className: string;
  children: ReactNode;
  style?: CSSProperties;
  tabIndex?: number;
  "aria-hidden"?: boolean;
  inert?: boolean;
}) {
  if (slide.href != null) {
    return (
      <a
        className={cn(pressable, className)}
        href={slide.href}
        inert={inertProp}
        style={style}
        tabIndex={tabIndex}
      >
        {children}
      </a>
    );
  }
  if (slide.onOpen != null) {
    return (
      <button
        aria-hidden={ariaHidden}
        className={cn(
          pressable,
          "appearance-none border-0 bg-transparent p-0 text-left",
          className,
        )}
        inert={inertProp}
        onClick={slide.onOpen}
        style={style}
        tabIndex={tabIndex}
        type="button"
      >
        {children}
      </button>
    );
  }
  return (
    <span
      aria-hidden={ariaHidden}
      className={className}
      inert={inertProp}
      style={style}
    >
      {children}
    </span>
  );
}

/**
 * Front page image first; on error, the lot gallery; else the stage background.
 * The stage cell changes aspect by viewport — cover + center crop; keep the
 * subject in the centre of the upload (see admin Featured canvas).
 */
function SlideImage({
  slide,
  className,
  decorative,
  priority,
}: {
  slide: FeaturedAuctionsBannerSlide;
  className: string;
  decorative?: boolean;
  /** First paint / LCP — high; later slides stay auto. */
  priority?: boolean;
}) {
  const [src, setSrc] = useState(slide.imageSrc);
  const [usingFallback, setUsingFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(slide.imageSrc);
    setUsingFallback(false);
    setFailed(false);
  }, [slide.imageSrc]);

  if (failed) return null;

  return (
    <img
      alt={decorative ? "" : (slide.imageAlt ?? "")}
      aria-hidden={decorative ? true : undefined}
      className={cn(className, "pointer-events-none [-webkit-user-drag:none]")}
      draggable={false}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      onError={() => {
        if (!usingFallback && slide.fallbackImageSrc) {
          setSrc(slide.fallbackImageSrc);
          setUsingFallback(true);
          return;
        }
        setFailed(true);
      }}
      sizes={slide.imageSizes ?? STAGE_IMAGE_SIZES}
      src={src}
      srcSet={usingFallback ? undefined : slide.imageSrcSet}
    />
  );
}

/**
 * Full-width Featured carousel for the auction catalogue: the slot's front
 * page image as the stage, the lot title, its status, a client countdown from
 * the served close or open, the rolling current bid on Active increase, and
 * Bid Now or View Auction by status, with `CarouselProgress` advancing two or
 * three slides.
 *
 * A single slide shows no progress control: there is nothing to advance to.
 */
function FeaturedAuctionsBanner({
  copy,
  slides,
  locale,
  className,
}: FeaturedAuctionsBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const mdUp = useIsMdUp();
  const headingId = useId();
  /** After first paint, enable crossfade so the initial slide does not animate in. */
  const [crossfadeReady, setCrossfadeReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const suppressClickRef = useRef(false);
  const safeIndex =
    slides.length === 0 ? 0 : Math.min(index, slides.length - 1);
  const slide = slides[safeIndex];

  useEffect(() => {
    setCrossfadeReady(true);
  }, []);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  /* The fill animation reports each turn, so the timer is only needed where
     motion is off and no animation ever ends. playKey re-arms after each move. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: playKey re-arms the timer after each advance.
  useEffect(() => {
    if (!reduceMotion || slides.length <= 1 || paused) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
      setPlayKey((key) => key + 1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [paused, playKey, reduceMotion, slides.length]);

  function goTo(nextIndex: number) {
    if (nextIndex !== safeIndex) setIndex(nextIndex);
    setDragPx(0);
    setDragging(false);
    setPlayKey((key) => key + 1);
  }

  function step(delta: number) {
    if (slides.length <= 1) return;
    const next = (safeIndex + delta + slides.length) % slides.length;
    goTo(next);
  }

  function advanceFromTimer() {
    if (paused || slides.length <= 1) return;
    setIndex((current) => (current + 1) % slides.length);
    setDragPx(0);
    setDragging(false);
    setPlayKey((key) => key + 1);
  }

  function endDrag(clientX: number) {
    const drag = dragRef.current;
    if (!drag) return;
    const wasHorizontal = drag.axis === true;
    const dx = wasHorizontal ? clientX - drag.startX : 0;
    const threshold = drag.width * SWIPE_THRESHOLD;
    dragRef.current = null;
    setPaused(false);
    setDragging(false);

    if (wasHorizontal && Math.abs(dx) >= threshold) {
      suppressClickRef.current = true;
      setDragPx(0);
      step(dx < 0 ? 1 : -1);
      return;
    }
    if (wasHorizontal) suppressClickRef.current = true;
    setDragPx(0);
  }

  function onStagePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (mdUp || slides.length <= 1 || event.button !== 0) return;
    if (reduceMotion) return;
    if ((event.target as Element).closest("button")) return;
    const stage = stageRef.current;
    if (!stage) return;
    stage.setPointerCapture(event.pointerId);
    setPaused(true);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: stage.clientWidth,
      axis: null,
    };
  }

  function onStagePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
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
        setPaused(false);
        setDragging(false);
        setDragPx(0);
        return;
      }
      drag.axis = true;
      setDragging(true);
      suppressClickRef.current = true;
    }

    if (drag.axis !== true) return;
    setDragPx(dx);
  }

  function onStagePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    endDrag(event.clientX);
  }

  function onStagePointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setPaused(false);
    setDragging(false);
    setDragPx(0);
  }

  function onStageClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  if (!slide) return null;

  const multiple = slides.length > 1;
  const stageSwipe = multiple && !mdUp;
  const copyAnimate =
    crossfadeReady && !reduceMotion && multiple
      ? ({
          transitionProperty: "opacity, filter",
          transitionDuration: `${CROSSFADE_MS}ms`,
          transitionTimingFunction: CROSSFADE_EASE,
        } as const)
      : ({
          transitionProperty: "none",
          transitionDuration: "0ms",
        } as const);

  function progressControls(className: string) {
    return (
      <CarouselProgress aria-label={copy.progress} className={className}>
        {slides.map((item, itemIndex) => (
          <CarouselProgressItem
            active={itemIndex === safeIndex}
            durationMs={AUTO_ADVANCE_MS}
            key={item.id}
            label={copy.slide
              .replace("{position}", String(itemIndex + 1))
              .replace("{title}", item.title)}
            onClick={() => goTo(itemIndex)}
            onComplete={advanceFromTimer}
            paused={paused}
            playKey={playKey}
            reduceMotion={reduceMotion}
          />
        ))}
      </CarouselProgress>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      aria-roledescription="carousel"
      className={cn("w-full text-foreground", className)}
      data-slot="featured-auctions-banner"
      onBlurCapture={(event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        Both cells share one md row at 600px so copy can centre in the full
        left band. Progress pins to the foot from md. Below md the stage keeps
        the 8:5 front-page ratio full-bleed and pages horizontally; slides
        stack in one grid cell so the copy band holds the tallest slide's
        height, the end clock sits beside the CTA, and progress sits under
        the stack, left-aligned. Chevrons and swipe live on the stage below
        md only.
      */}
      <div className="grid w-full grid-cols-1 md:h-[600px] md:grid-cols-[minmax(28rem,1fr)_minmax(0,2fr)] md:grid-rows-1">
        <div
          className={cn(
            "relative order-1 aspect-[8/5] w-full overflow-hidden bg-background-subtle select-none md:order-none md:col-start-2 md:row-start-1 md:aspect-auto md:h-full",
            stageSwipe && "touch-pan-y",
          )}
          onClickCapture={stageSwipe ? onStageClickCapture : undefined}
          onPointerCancel={stageSwipe ? onStagePointerCancel : undefined}
          onPointerDown={stageSwipe ? onStagePointerDown : undefined}
          onPointerMove={stageSwipe ? onStagePointerMove : undefined}
          onPointerUp={stageSwipe ? onStagePointerUp : undefined}
          ref={stageRef}
        >
          {mdUp ? (
            <StageFade
              activeIndex={safeIndex}
              ready={crossfadeReady}
              reduceMotion={reduceMotion}
              slides={slides}
            />
          ) : (
            <StageTrack
              activeIndex={safeIndex}
              dragPx={dragPx}
              dragging={dragging}
              reduceMotion={reduceMotion}
              slides={slides}
            />
          )}
          {multiple ? (
            <div className="pointer-events-none absolute inset-y-0 z-20 flex w-full items-center justify-between px-3 md:hidden">
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
            </div>
          ) : null}
        </div>

        <div className="relative order-2 flex min-w-0 flex-col bg-muted md:order-none md:col-start-1 md:row-start-1 md:h-full md:min-h-0 md:min-w-[28rem]">
          {/*
            Below md every slide stays in flow in the same grid cell so the
            band height is the tallest copy (no jump when the title length
            changes). Progress sits under that stack with its own top pad.
            From md the band is a fixed 600px row and slides go absolute.
          */}
          <div className="relative grid min-h-0 flex-1">
            {slides.map((item, itemIndex) => {
              const active = itemIndex === safeIndex;
              return (
                <div
                  aria-hidden={!active}
                  className={cn(
                    "col-start-1 row-start-1 relative flex flex-col justify-center gap-5 px-6 py-6 will-change-[opacity,filter] sm:gap-6 sm:px-10 sm:py-8 md:gap-8 md:px-16 md:py-12",
                    active
                      ? "z-10 opacity-100 md:absolute md:inset-0"
                      : "pointer-events-none z-0 opacity-0 md:absolute md:inset-0",
                  )}
                  inert={!active ? true : undefined}
                  key={item.id}
                  style={{
                    ...copyAnimate,
                    filter: active
                      ? "blur(0)"
                      : `blur(${reduceMotion ? 0 : COPY_BLUR_PX}px)`,
                  }}
                >
                  <SlideCopy
                    copy={copy}
                    headingId={active ? headingId : undefined}
                    locale={locale}
                    mdUp={mdUp}
                    slide={item}
                  />
                </div>
              );
            })}
          </div>

          {multiple && !mdUp
            ? progressControls("justify-start px-6 pt-2 pb-6 sm:px-10 sm:pb-8")
            : null}
          {multiple && mdUp
            ? progressControls(
                "absolute inset-x-0 bottom-0 z-10 justify-start px-16 pt-5 pb-10",
              )
            : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Opaque underlay + fade-in overlay. Simultaneous opacity on both layers let
 * the empty stage show through; same `imageSrc` skips motion entirely. Used
 * from md up — below md the stage pages on `StageTrack`.
 */
function StageFade({
  slides,
  activeIndex,
  reduceMotion,
  ready,
}: {
  slides: readonly FeaturedAuctionsBannerSlide[];
  activeIndex: number;
  reduceMotion: boolean;
  ready: boolean;
}) {
  const active = slides[activeIndex];
  const [base, setBase] = useState(active);
  const [overlay, setOverlay] = useState<FeaturedAuctionsBannerSlide | null>(
    null,
  );
  const [overlayOn, setOverlayOn] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (active.id === base?.id) return;

    if (active.imageSrc === base?.imageSrc) {
      setBase(active);
      setOverlay(null);
      setOverlayOn(false);
      return;
    }

    if (reduceMotion || !ready) {
      setBase(active);
      setOverlay(null);
      setOverlayOn(false);
      return;
    }

    setOverlay(active);
    setOverlayOn(false);
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setOverlayOn(true));
    });
    const timer = window.setTimeout(() => {
      setBase(active);
      setOverlay(null);
      setOverlayOn(false);
    }, CROSSFADE_MS);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [active, base?.id, base?.imageSrc, ready, reduceMotion]);

  if (!base) return null;

  return (
    <>
      <OpenLot
        className="absolute inset-0 z-0 block size-full"
        slide={base}
        tabIndex={overlay ? -1 : undefined}
      >
        <SlideImage
          className="size-full object-cover object-center"
          priority
          slide={base}
        />
      </OpenLot>
      {overlay ? (
        <OpenLot
          aria-hidden
          className={cn(
            "absolute inset-0 z-10 block size-full will-change-[opacity]",
            overlayOn ? "opacity-100" : "opacity-0",
          )}
          inert
          slide={overlay}
          style={{
            transitionProperty: "opacity",
            transitionDuration: `${CROSSFADE_MS}ms`,
            transitionTimingFunction: CROSSFADE_EASE,
          }}
          tabIndex={-1}
        >
          <SlideImage
            className="size-full object-cover object-center"
            priority
            slide={overlay}
          />
        </OpenLot>
      ) : null}
      {/* Preload other stage URLs so the overlay never paints empty. */}
      <div aria-hidden className="hidden">
        {slides.map((item) =>
          item.imageSrc === base.imageSrc ||
          item.imageSrc === overlay?.imageSrc ? null : (
            <img alt="" key={`preload-${item.id}`} src={item.imageSrc} />
          ),
        )}
      </div>
    </>
  );
}

/**
 * Horizontal page track for small viewports. Clones the ends so a wrap
 * (last→first / first→last) still slides in the travel direction, then snaps
 * the track without a visible jump.
 */
function StageTrack({
  slides,
  activeIndex,
  dragPx,
  dragging,
  reduceMotion,
}: {
  slides: readonly FeaturedAuctionsBannerSlide[];
  activeIndex: number;
  dragPx: number;
  dragging: boolean;
  reduceMotion: boolean;
}) {
  const count = slides.length;
  const loop = count > 1;
  const cells = loop
    ? [slides[count - 1], ...slides, slides[0]]
    : [...slides];
  const [pos, setPos] = useState(loop ? activeIndex + 1 : activeIndex);
  const [instant, setInstant] = useState(false);
  const prevActiveRef = useRef(activeIndex);

  useEffect(() => {
    if (!loop) {
      setPos(activeIndex);
      prevActiveRef.current = activeIndex;
      return;
    }

    const prev = prevActiveRef.current;
    if (prev === activeIndex) return;
    prevActiveRef.current = activeIndex;

    if (reduceMotion) {
      setInstant(true);
      setPos(activeIndex + 1);
      return;
    }

    if (prev === count - 1 && activeIndex === 0) {
      setPos(count + 1);
      return;
    }
    if (prev === 0 && activeIndex === count - 1) {
      setPos(0);
      return;
    }
    setPos(activeIndex + 1);
  }, [activeIndex, count, loop, reduceMotion]);

  function onTransitionEnd() {
    if (!loop || instant) return;
    if (pos === count + 1) {
      setInstant(true);
      setPos(1);
      return;
    }
    if (pos === 0) {
      setInstant(true);
      setPos(count);
    }
  }

  useEffect(() => {
    if (!instant) return;
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setInstant(false));
    });
    return () => window.cancelAnimationFrame(raf);
  }, [instant, pos]);

  return (
    <div
      className={cn(
        "flex h-full w-full will-change-transform",
        loop && "cursor-grab active:cursor-grabbing",
      )}
      onTransitionEnd={onTransitionEnd}
      style={{
        transform: `translate3d(calc(${-pos * 100}% + ${dragPx}px), 0, 0)`,
        transitionProperty: instant || dragging || reduceMotion ? "none" : "transform",
        transitionDuration: `${SLIDE_MS}ms`,
        transitionTimingFunction: SLIDE_EASE,
      }}
    >
      {cells.map((item, cellIndex) => {
        const realIndex = loop
          ? cellIndex === 0
            ? count - 1
            : cellIndex === count + 1
              ? 0
              : cellIndex - 1
          : cellIndex;
        return (
          <div
            aria-hidden={realIndex !== activeIndex}
            className="relative h-full w-full shrink-0 grow-0 basis-full"
            key={`${item.id}:${cellIndex}`}
          >
            <OpenLot
              className="absolute inset-0 block size-full"
              slide={item}
              tabIndex={realIndex === activeIndex ? undefined : -1}
            >
              <SlideImage
                className="size-full object-cover object-center"
                priority={realIndex === activeIndex}
                slide={item}
              />
            </OpenLot>
          </div>
        );
      })}
    </div>
  );
}

function SlideCopy({
  slide,
  copy,
  locale,
  headingId,
  mdUp,
}: {
  slide: FeaturedAuctionsBannerSlide;
  copy: FeaturedAuctionsBannerCopy;
  locale?: string;
  headingId?: string;
  mdUp: boolean;
}) {
  const priceLabel =
    slide.status === "ended"
      ? copy.finalBid
      : slide.status === "active"
        ? copy.currentBid
        : null;
  const ctaLabel = slide.status === "active" ? copy.bidNow : copy.viewAuction;
  const ctaContent = (
    <>
      {ctaLabel}
      <ArrowRight aria-hidden size={16} weight="bold" />
    </>
  );

  const endClock =
    slide.status === "ended" && slide.closeLabel != null ? (
      <span className="inline-flex items-center gap-1">
        <CalendarBlank aria-hidden size={14} weight="bold" />
        {copy.endedAt} {slide.closeLabel}
      </span>
    ) : slide.countdown != null ? (
      <span className="inline-flex items-center gap-1">
        <CalendarBlank aria-hidden size={14} weight="bold" />
        <BannerCountdown copy={copy} countdown={slide.countdown} />
      </span>
    ) : null;

  return (
    <>
      <div className="flex items-center gap-2">
        {slide.status === "active" ? <StepIndicator state="progress" /> : null}
        <p className="font-semibold text-foreground text-sm tracking-wide uppercase">
          {statusLabel(slide.status, copy)}
        </p>
      </div>
      <h2
        className="max-w-xl font-semibold text-2xl text-foreground leading-8 sm:text-3xl sm:leading-10 md:text-4xl"
        id={headingId}
      >
        <OpenLot className="line-clamp-4 md:line-clamp-3" slide={slide}>
          {slide.title}
        </OpenLot>
      </h2>
      {priceLabel != null ? (
        <div className="flex w-full flex-col items-start">
          <p className="font-medium text-secondary-foreground text-sm tracking-wide uppercase">
            {priceLabel}
          </p>
          <p className="font-semibold text-foreground text-xl leading-7 tabular-nums sm:text-2xl sm:leading-8">
            <ListingRollingMoneyDisplay
              amountMinor={slide.currentBidMinor}
              currency={slide.currency}
              locale={locale}
            />
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        {slide.href != null ? (
          <a
            className={buttonVariants({
              size: "md",
              variant: "default",
              className: "md:h-12 md:px-4 md:text-base",
            })}
            href={slide.href}
            tabIndex={headingId ? undefined : -1}
          >
            {ctaContent}
          </a>
        ) : (
          <button
            className={buttonVariants({
              size: "md",
              variant: "default",
              className: "md:h-12 md:px-4 md:text-base",
            })}
            onClick={slide.onOpen}
            tabIndex={headingId ? undefined : -1}
            type="button"
          >
            {ctaContent}
          </button>
        )}
        {!mdUp && endClock != null ? (
          <div className="text-secondary-foreground text-sm">{endClock}</div>
        ) : null}
      </div>
      {mdUp && endClock != null ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary-foreground text-sm">
          {endClock}
        </div>
      ) : null}
    </>
  );
}

export type {
  FeaturedAuctionsBannerCopy,
  FeaturedAuctionsBannerCountdown,
  FeaturedAuctionsBannerProps,
  FeaturedAuctionsBannerSlide,
  FeaturedAuctionsBannerStatus,
};
export { FeaturedAuctionsBanner };
