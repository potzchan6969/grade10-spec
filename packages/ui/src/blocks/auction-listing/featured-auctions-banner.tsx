import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { StepIndicator } from "@grade10/design-system/components/display/step-indicator";
import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react";
import {
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import { ListingRollingMoneyDisplay } from "./listing-rolling-money-display";

/** Auto-advance dwell per slide. */
const AUTO_ADVANCE_MS = 5000;

/**
 * Slide crossfade — `--duration-fast` + `--ease-smooth-out`.
 * Stage uses fade-in over an opaque underlay (never both translucent — that
 * flashed the empty cell). Copy may soften with `--blur-small`.
 */
const CROSSFADE_MS = 250;
const CROSSFADE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COPY_BLUR_PX = 2;

const HOUR_MS = 60 * 60 * 1000;

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
        aria-hidden={ariaHidden}
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
      className={className}
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
  const reduceMotion = usePrefersReducedMotion();
  const headingId = useId();
  /** After first paint, enable crossfade so the initial slide does not animate in. */
  const [crossfadeReady, setCrossfadeReady] = useState(false);
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
    setPlayKey((key) => key + 1);
  }

  function advanceFromTimer() {
    if (paused || slides.length <= 1) return;
    setIndex((current) => (current + 1) % slides.length);
    setPlayKey((key) => key + 1);
  }

  if (!slide) return null;

  const multiple = slides.length > 1;
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
        left band. Progress pins to the foot and does not own a second row.
      */}
      <div className="grid w-full grid-cols-1 md:h-[600px] md:grid-cols-[minmax(28rem,1fr)_minmax(0,2fr)] md:grid-rows-1">
        <div className="relative order-1 h-72 overflow-hidden bg-background-subtle sm:h-80 md:order-none md:col-start-2 md:row-start-1 md:h-full">
          <StageFade
            activeIndex={safeIndex}
            ready={crossfadeReady}
            reduceMotion={reduceMotion}
            slides={slides}
          />
        </div>

        <div className="relative order-2 flex min-h-[22rem] min-w-0 flex-col bg-muted sm:min-h-[24rem] md:order-none md:col-start-1 md:row-start-1 md:h-full md:min-h-0 md:min-w-[28rem]">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {slides.map((item, itemIndex) => {
              const active = itemIndex === safeIndex;
              return (
                <div
                  aria-hidden={!active}
                  className={cn(
                    "absolute inset-0 flex flex-col justify-center gap-5 px-6 py-12 will-change-[opacity,filter] sm:gap-6 sm:px-10 md:gap-8 md:px-16",
                    active
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0",
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
                    slide={item}
                  />
                </div>
              );
            })}
          </div>

          {multiple ? (
            <CarouselProgress
              aria-label={copy.progress}
              className="relative z-10 justify-center border-border border-t bg-background px-6 py-5 sm:px-10 md:absolute md:inset-x-0 md:bottom-0 md:justify-start md:border-0 md:bg-transparent md:px-16 md:pt-5 md:pb-10"
            >
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
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Opaque underlay + fade-in overlay. Simultaneous opacity on both layers let
 * the empty stage show through; same `imageSrc` skips motion entirely.
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

function SlideCopy({
  slide,
  copy,
  locale,
  headingId,
}: {
  slide: FeaturedAuctionsBannerSlide;
  copy: FeaturedAuctionsBannerCopy;
  locale?: string;
  headingId?: string;
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

  return (
    <>
      <div className="flex items-center gap-2">
        {slide.status === "active" ? (
          <StepIndicator state="progress" />
        ) : null}
        <p className="font-semibold text-foreground text-sm tracking-wide uppercase">
          {statusLabel(slide.status, copy)}
        </p>
      </div>
      <h2
        className="max-w-xl font-semibold text-2xl text-foreground leading-8 sm:text-3xl sm:leading-10 md:text-4xl"
        id={headingId}
      >
        <OpenLot className="line-clamp-3" slide={slide}>
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
      <div className="flex items-center gap-4">
        {slide.href != null ? (
          <a
            className={buttonVariants({ size: "lg", variant: "default" })}
            href={slide.href}
            tabIndex={headingId ? undefined : -1}
          >
            {ctaContent}
          </a>
        ) : (
          <button
            className={buttonVariants({ size: "lg", variant: "default" })}
            onClick={slide.onOpen}
            tabIndex={headingId ? undefined : -1}
            type="button"
          >
            {ctaContent}
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary-foreground text-sm">
        {slide.status === "ended" && slide.closeLabel != null ? (
          <span className="inline-flex items-center gap-1">
            <CalendarBlank aria-hidden size={14} weight="bold" />
            {copy.endedAt} {slide.closeLabel}
          </span>
        ) : slide.countdown != null ? (
          <span className="inline-flex items-center gap-1">
            <CalendarBlank aria-hidden size={14} weight="bold" />
            <BannerCountdown copy={copy} countdown={slide.countdown} />
          </span>
        ) : null}
      </div>
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
