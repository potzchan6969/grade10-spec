import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { StepIndicator } from "@grade10/design-system/components/display/step-indicator";
import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowRight, CalendarBlank, Gavel } from "@phosphor-icons/react";
import {
  type FocusEvent,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import { ListingRollingMoneyDisplay } from "./listing-rolling-money-display";

/** Figma frame `6945:12258` holds one slide for eight seconds. */
const AUTO_ADVANCE_MS = 8000;

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

type FeaturedAuctionsBannerSlide = {
  id: string;
  title: string;
  status: FeaturedAuctionsBannerStatus;
  /** The slot's front page image: the banner ground and the lot slab. */
  imageSrc: string;
  imageAlt?: string;
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
  /** Display-ready count, such as "14 bids". Omit it and the line is absent. */
  bidCountLabel?: string;
  /** Lot page address for the slab, the title, and the CTA. */
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
 * The slab and the title both open the lot. A slide carries an address or a
 * handler, so one is a link and the other a button; with neither, the mark is
 * inert rather than a control that answers nothing.
 */
function OpenLot({
  slide,
  className,
  children,
}: {
  slide: FeaturedAuctionsBannerSlide;
  className: string;
  children: ReactNode;
}) {
  if (slide.href != null) {
    return (
      <a className={cn(pressable, className)} href={slide.href}>
        {children}
      </a>
    );
  }
  if (slide.onOpen != null) {
    return (
      <button
        className={cn(
          pressable,
          "appearance-none border-0 bg-transparent p-0 text-left",
          className,
        )}
        onClick={slide.onOpen}
        type="button"
      >
        {children}
      </button>
    );
  }
  return <span className={className}>{children}</span>;
}

/**
 * Front page image first; on error, the lot gallery; else the stage background.
 */
function SlideImage({
  slide,
  className,
  decorative,
}: {
  slide: FeaturedAuctionsBannerSlide;
  className: string;
  decorative?: boolean;
}) {
  const [src, setSrc] = useState(slide.imageSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(slide.imageSrc);
    setFailed(false);
  }, [slide.imageSrc]);

  if (failed) return null;

  return (
    <img
      alt={decorative ? "" : (slide.imageAlt ?? "")}
      aria-hidden={decorative ? true : undefined}
      className={className}
      loading="eager"
      onError={() => {
        if (src === slide.imageSrc && slide.fallbackImageSrc) {
          setSrc(slide.fallbackImageSrc);
          return;
        }
        setFailed(true);
      }}
      src={src}
    />
  );
}

/**
 * Full-width Featured carousel for the auction catalogue: the slot's front
 * page image as ground and slab, the lot title, its status, a client
 * countdown from the served close or open, the rolling current bid on Active
 * increase, and Bid Now or View Auction by status, with `CarouselProgress`
 * advancing two or three slides.
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
  const safeIndex =
    slides.length === 0 ? 0 : Math.min(index, slides.length - 1);
  const slide = slides[safeIndex];

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

  const priceLabel =
    slide.status === "upcoming"
      ? copy.startingBid
      : slide.status === "ended"
        ? copy.finalBid
        : copy.currentBid;
  const ctaLabel = slide.status === "active" ? copy.bidNow : copy.viewAuction;
  const multiple = slides.length > 1;
  const ctaContent = (
    <>
      {ctaLabel}
      <ArrowRight aria-hidden size={16} weight="bold" />
    </>
  );

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
      <div className="grid w-full grid-cols-1 md:h-[600px] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:grid-rows-[minmax(0,1fr)_auto]">
        <div className="relative order-1 h-72 overflow-hidden bg-background-subtle sm:h-80 md:order-none md:col-start-2 md:row-span-2 md:h-full">
          <SlideImage
            className="absolute inset-0 size-full object-cover"
            decorative
            key={`ground-${slide.id}`}
            slide={slide}
          />
          <OpenLot
            className="absolute top-1/2 left-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-primary-border bg-background-subtle shadow-lg"
            slide={slide}
          >
            <SlideImage
              className="block h-full w-auto max-w-none object-contain"
              key={`slab-${slide.id}`}
              slide={slide}
            />
          </OpenLot>
        </div>

        {multiple ? (
          <CarouselProgress
            aria-label={copy.progress}
            className="relative z-10 order-2 justify-center border-border border-y bg-background px-6 py-5 sm:px-10 md:order-none md:col-start-1 md:row-start-2 md:justify-start md:border-0 md:bg-muted md:px-16 md:pt-8 md:pb-12"
          >
            {slides.map((item, itemIndex) => (
              <CarouselProgressItem
                active={itemIndex === safeIndex}
                className="after:absolute after:-inset-3 after:content-['']"
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

        <div
          className={cn(
            "order-3 flex min-h-[22rem] flex-col justify-start gap-5 bg-muted px-6 pt-12 pb-10 sm:min-h-[24rem] sm:gap-6 sm:px-10 sm:pb-12 md:order-none md:col-start-1 md:row-start-1 md:h-full md:min-h-0 md:justify-center md:gap-8 md:px-16 md:pb-12",
            multiple ? null : "md:row-span-2",
          )}
        >
          <div className="flex items-center gap-2">
            {slide.status === "active" ? (
              <StepIndicator state="progress" />
            ) : null}
            <p className="font-semibold text-foreground text-sm tracking-wide">
              {statusLabel(slide.status, copy)}
            </p>
          </div>
          <h2
            className="max-w-xl text-balance font-semibold text-2xl text-foreground leading-8 sm:text-3xl sm:leading-10 md:text-4xl"
            id={headingId}
          >
            <OpenLot
              className="line-clamp-3 underline-offset-2 hover:underline"
              slide={slide}
            >
              {slide.title}
            </OpenLot>
          </h2>
          <div className="flex w-full flex-col items-start">
            <p className="font-medium text-secondary-foreground text-sm tracking-wide">
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
          <div className="flex items-center gap-4">
            {slide.href != null ? (
              <a
                className={buttonVariants({ size: "lg", variant: "default" })}
                href={slide.href}
              >
                {ctaContent}
              </a>
            ) : (
              <button
                className={buttonVariants({ size: "lg", variant: "default" })}
                onClick={slide.onOpen}
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
            {slide.bidCountLabel != null ? (
              <>
                <span
                  aria-hidden="true"
                  className="hidden h-5 w-px shrink-0 bg-border sm:block"
                />
                <span className="inline-flex items-center gap-1">
                  <Gavel aria-hidden size={14} weight="bold" />
                  {slide.bidCountLabel}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
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
