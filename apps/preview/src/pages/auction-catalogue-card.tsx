import { StepIndicator } from "@grade10/design-system/components/display/step-indicator";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowRight,
  Bell,
  BellSlash,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Gavel,
} from "@phosphor-icons/react";
import { registerBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FocusEvent, useEffect, useRef, useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  CATALOGUE_IMAGE,
  type CatalogueLot,
  COLLECTION_LOTS,
} from "./auction-catalogue-content";
import auctionLotCardBones from "./auction-catalogue-lot-card.bones.json";
import { AUCTION_LOT_DETAILS_COPY } from "./auction-lot-details-content";

registerBones({
  "auction-catalogue-lot-card": auctionLotCardBones,
});

const FEATURED_BANNER_BG = new URL(
  "./auction-catalogue-featured-banner-bg.fixture.jpg",
  import.meta.url,
).href;

const pressable =
  "cursor-pointer rounded-md outline-none transition-opacity duration-200 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-80 motion-reduce:transition-none";

const WATCH_COPY = {
  watch: AUCTION_LOT_DETAILS_COPY.header.watch,
  watching: AUCTION_LOT_DETAILS_COPY.header.watching,
  watchAriaLabel: AUCTION_LOT_DETAILS_COPY.header.watchAriaLabel,
  unwatchAriaLabel: AUCTION_LOT_DETAILS_COPY.header.unwatchAriaLabel,
  watchedToast: AUCTION_LOT_DETAILS_COPY.header.watchedToast,
  unwatchedToast: AUCTION_LOT_DETAILS_COPY.header.unwatchedToast,
};

function lotAddress(lot: CatalogueLot): string {
  return `https://grade10.com/auction/listings/${lot.slug}`;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function unit(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

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

function LotCountdown({ lot }: { lot: CatalogueLot }) {
  const opens = lot.status === "Upcoming";
  const target = opens ? lot.startsAt : lot.closesAt;
  const targetMs = Date.parse(target);
  const now = useNow(targetMs);
  const left = targetMs - now;
  const parts = remainingParts(left);
  const lead = opens ? "Opens in" : "Ends in";
  const soon = !opens && left < DAY_MS;

  if (lot.status === "Ended") {
    return (
      <p className="text-sm text-secondary-foreground">
        Ended <time dateTime={lot.closesAt}>{lot.closeLabel}</time>
      </p>
    );
  }

  return (
    <p
      className={cn(
        "text-sm tabular-nums",
        soon ? "font-medium text-destructive" : "text-secondary-foreground",
      )}
    >
      <time dateTime={target}>
        <span className="sr-only">
          {lead} {parts.long}
        </span>
        <span aria-hidden="true">
          {lead} {parts.short}
        </span>
      </time>
    </p>
  );
}

function bidsLabel(count: number) {
  return `${count} ${count === 1 ? "bid" : "bids"}`;
}

/** Figma carousel banner clock: `Ends 07:20:55:59`. */
function paddedClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function BannerCountdown({ lot }: { lot: CatalogueLot }) {
  const opens = lot.status === "Upcoming";
  const target = opens ? lot.startsAt : lot.closesAt;
  const targetMs = Date.parse(target);
  const now = useNow(targetMs);
  const left = targetMs - now;
  const clock = paddedClock(left);
  const lead = opens ? "Opens" : "Ends";

  if (lot.status === "Ended") {
    return (
      <span className="text-sm text-secondary-foreground">
        Ended {lot.closeLabel}
      </span>
    );
  }

  return (
    <time className="text-sm tabular-nums text-secondary-foreground" dateTime={target}>
      <span className="sr-only">
        {lead} in {remainingParts(left).long}
      </span>
      <span aria-hidden="true">
        {lead} {clock}
      </span>
    </time>
  );
}

function CatalogueWatch({
  lot,
  watched,
  onToggle,
  size = "sm",
  className,
}: {
  lot: CatalogueLot;
  watched: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const previous = useRef(watched);

  useEffect(() => {
    if (previous.current === watched) return;
    previous.current = watched;
    if (lot.status === "Ended") return;
    const message = watched
      ? WATCH_COPY.watchedToast
      : WATCH_COPY.unwatchedToast;
    if (!message) return;
    toast(message.title, {
      description: "description" in message ? message.description : undefined,
    });
  }, [lot.status, watched]);

  if (lot.status === "Ended") return null;

  const label = watched ? `Unwatch ${lot.title}` : `Watch ${lot.title}`;

  return (
    <IconButton
      aria-label={label}
      aria-pressed={watched}
      className={cn("bg-background", className)}
      onClick={onToggle}
      size={size}
      type="button"
      variant="outline"
    >
      {watched ? <BellSlash aria-hidden /> : <Bell aria-hidden />}
    </IconButton>
  );
}

type AuctionLotCardProps = {
  lot: CatalogueLot;
  watched: boolean;
  onToggle: () => void;
  /** The list heads each title. Featured repeats the lot, so the title stays a link. */
  heading: boolean;
  eager?: boolean;
  /** Featured: white shell, subtle border, watch on the image. */
  lift?: boolean;
  /** Boneyard skeleton overlay while the filtered list settles. */
  loading?: boolean;
};

const SKELETON_LOT: CatalogueLot = {
  ...COLLECTION_LOTS[0],
  title: " ",
  bidLabel: " ",
  bidCount: 0,
  imageAlt: "",
};

function AuctionLotCardContent({
  lot,
  watched,
  onToggle,
  heading,
  eager,
  lift,
}: Omit<AuctionLotCardProps, "loading">) {
  const imageRadius = "rounded-(--radius-3xl)";
  const title = (
    <a
      className={cn(
        pressable,
        "line-clamp-2 text-base font-medium leading-6 text-foreground underline-offset-2 hover:underline",
        lift && "min-h-12",
      )}
      href={lotAddress(lot)}
    >
      {lot.title}
    </a>
  );

  return (
    <article
      className={cn(
        "group/lot-card relative flex h-full w-full flex-col",
        lift &&
          cn(
            "origin-center rounded-[28px]",
            "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none",
            "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:z-10 [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:scale-[1.02]",
          ),
      )}
    >
      {lift ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
            "bg-transparent shadow-[0_14px_28px_-10px_rgb(0_0_0_/_10%),0_4px_10px_-6px_rgb(0_0_0_/_6%)]",
            "opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "[@media(hover:hover)_and_(pointer:fine)]:group-hover/lot-card:opacity-100",
            "motion-reduce:transition-none",
          )}
        />
      ) : null}
      <div
        className={cn(
          "relative flex h-full w-full flex-col gap-2",
          lift &&
            "overflow-hidden rounded-[inherit] border border-border bg-background p-2 text-card-foreground",
        )}
      >
        <div className="relative aspect-square w-full">
          <a
            className={cn(
              pressable,
              "absolute inset-0 overflow-hidden",
              imageRadius,
            )}
            href={lotAddress(lot)}
          >
            <span
              className={cn(
                "lot-image-well absolute inset-0 isolate overflow-hidden bg-background-subtle",
                imageRadius,
              )}
            >
              <img
                alt={lot.imageAlt}
                className={cn("size-full object-contain", imageRadius)}
                height={640}
                loading={eager ? "eager" : "lazy"}
                src={lot.imageSrc}
                width={640}
              />
              {lift ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 overflow-hidden",
                    imageRadius,
                    "after:absolute after:inset-0 after:content-['']",
                    "after:bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255_/_55%)_50%,transparent_65%)]",
                    "after:opacity-0 after:transition-[transform,opacity] after:duration-500 after:ease-out",
                    "after:[transform:translateX(-120%)]",
                    "[@media(hover:hover)_and_(pointer:fine)]:group-hover/lot-card:after:opacity-100",
                    "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/lot-card:after:[transform:translateX(120%)]",
                    "motion-reduce:after:transition-none",
                  )}
                />
              ) : null}
            </span>
          </a>
          <span className="absolute top-2 left-2 z-10">
            <CatalogueWatch
              lot={lot}
              onToggle={onToggle}
              size="sm"
              watched={watched}
            />
          </span>
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-col items-start gap-2",
            lift ? "p-2" : null,
          )}
        >
          {heading ? (
            <h3 className="w-full text-foreground">{title}</h3>
          ) : (
            title
          )}
          <div className="flex w-full flex-col items-start">
            <p className="w-full text-sm text-secondary-foreground">
              {lot.status === "Upcoming" ? "Starting bid" : "Current Bid"}
            </p>
            <div className="flex w-full items-baseline gap-2">
              <p
                className={cn(
                  "min-w-0 flex-1 font-semibold tabular-nums text-card-foreground",
                  lift ? "text-xl leading-7" : "text-lg leading-7",
                )}
              >
                {lot.bidLabel}
              </p>
              {lift && lot.status !== "Ended" ? (
                <p className="shrink-0 whitespace-nowrap text-sm leading-5 text-secondary-foreground">
                  {bidsLabel(lot.bidCount)}
                </p>
              ) : null}
            </div>
          </div>
          <LotCountdown lot={lot} />
        </div>
        {lift ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/lot-card:opacity-100 motion-reduce:hidden"
          >
            <BorderBeam
              borderRadius={28}
              borderWidth={1.5}
              colorFrom="var(--primary)"
              colorTo="var(--primary)"
              duration={4}
              size={80}
            />
          </span>
        ) : null}
      </div>
    </article>
  );
}

function AuctionLotCard({
  loading = false,
  className,
  ...props
}: AuctionLotCardProps & { className?: string }) {
  if (!loading) {
    return <AuctionLotCardContent {...props} />;
  }

  return (
    <Skeleton
      animate="pulse"
      className={cn("w-full", className)}
      color="#E6E6E6"
      darkColor="rgba(249, 250, 250, 0.05)"
      loading
      name="auction-catalogue-lot-card"
      transition={300}
    >
      <AuctionLotCardContent
        {...props}
        lot={SKELETON_LOT}
        onToggle={() => {}}
        watched={false}
      />
    </Skeleton>
  );
}

type FeaturedAuctionsProps = {
  lots: readonly CatalogueLot[];
  watched: ReadonlySet<string>;
  onToggle: (id: string) => void;
  /** Boneyard skeletons while the page enter beat is in flight. */
  loading?: boolean;
  /** Staggered blur-fade after loading settles — Product List recipe. */
  revealed?: boolean;
};

const REVEAL_ITEM_CLASS =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";

const REVEAL_ITEM_SHOWN_CLASS = "translate-y-0 opacity-100 filter-none";

function featuredCardWidth(count: number) {
  if (count <= 1) return "w-72 max-w-full";
  if (count === 2) {
    return "w-full @min-[40rem]:w-[calc((100%-2rem)/2)]";
  }
  if (count === 3) {
    return "w-full @min-[40rem]:w-[calc((100%-2rem)/2)] @min-[64rem]:w-[calc((100%-4rem)/3)]";
  }
  return "w-full @min-[40rem]:w-[calc((100%-2rem)/2)] @min-[64rem]:w-[calc((100%-6rem)/4)]";
}

function FeaturedAuctions({
  lots,
  watched,
  onToggle,
  loading = false,
  revealed = true,
}: FeaturedAuctionsProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const cardCount = loading ? Math.max(lots.length, 4) : lots.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: the scroller is re-measured whenever the lots or the loading state change.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const sync = () => {
      setCanScroll(scroller.scrollWidth > scroller.clientWidth + 1);
      setAtStart(scroller.scrollLeft <= 1);
      setAtEnd(
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1,
      );
    };

    sync();
    scroller.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [lots, loading]);

  function scrollByCard(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector("li");
    const distance =
      (card?.getBoundingClientRect().width ?? scroller.clientWidth) + 32;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.scrollBy({
      left: direction * distance,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <section
      aria-labelledby="featured-auctions"
      className="w-full bg-gradient-to-b from-[var(--orange-100)] to-background text-foreground"
      data-revealed={revealed || undefined}
    >
      <div className="@container mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pt-28 pb-20 sm:px-8">
        <div
          className={cn(
            "flex flex-col items-center gap-3 text-center",
            REVEAL_ITEM_CLASS,
            revealed && REVEAL_ITEM_SHOWN_CLASS,
          )}
          style={{
            transitionDelay: revealed ? "0ms" : "0ms",
          }}
        >
          <h2
            className="w-full text-4xl font-bold leading-tight sm:text-5xl sm:leading-[48px]"
            id="featured-auctions"
          >
            Grade10 Auctions
          </h2>
          <p className="w-full text-xl leading-7 text-secondary-foreground">
            New auctions every week
          </p>
        </div>
        <div className="relative min-w-0">
          {canScroll && !loading ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10 flex items-center justify-between">
              <IconButton
                aria-label="Previous featured auctions"
                className="pointer-events-auto bg-background"
                disabled={atStart}
                onClick={() => scrollByCard(-1)}
                size="lg"
                type="button"
                variant="outline"
              >
                <CaretLeft aria-hidden="true" weight="bold" />
              </IconButton>
              <IconButton
                aria-label="Next featured auctions"
                className="pointer-events-auto bg-background"
                disabled={atEnd}
                onClick={() => scrollByCard(1)}
                size="lg"
                type="button"
                variant="outline"
              >
                <CaretRight aria-hidden="true" weight="bold" />
              </IconButton>
            </div>
          ) : null}
          <ul
            aria-busy={loading || undefined}
            className="flex w-full min-w-0 items-stretch gap-8 overflow-x-auto overscroll-x-contain py-2 snap-x snap-mandatory"
            ref={scrollerRef}
          >
            {loading
              ? Array.from({ length: cardCount }, (_, index) => (
                  <li
                    className={cn(
                      "shrink-0 snap-start px-2 py-8",
                      featuredCardWidth(cardCount),
                    )}
                    // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity beyond position.
                    key={`featured-skeleton-${index}`}
                  >
                    <AuctionLotCard
                      eager
                      heading={false}
                      lift
                      loading
                      lot={SKELETON_LOT}
                      onToggle={() => {}}
                      watched={false}
                    />
                  </li>
                ))
              : lots.map((lot, index) => (
                  <li
                    className={cn(
                      "shrink-0 snap-start px-2 py-8",
                      featuredCardWidth(lots.length),
                      REVEAL_ITEM_CLASS,
                      revealed && REVEAL_ITEM_SHOWN_CLASS,
                    )}
                    key={lot.id}
                    style={{
                      transitionDelay: revealed
                        ? `${Math.min(index, 8) * 40}ms`
                        : "0ms",
                    }}
                  >
                    <AuctionLotCard
                      eager
                      heading={false}
                      lift
                      lot={lot}
                      onToggle={() => onToggle(lot.id)}
                      watched={watched.has(lot.id)}
                    />
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type FeaturedAuctionsPairProps = {
  lots: readonly CatalogueLot[];
  watched: ReadonlySet<string>;
  onToggle: (id: string) => void;
};

const PAIR_AUTO_MS = 5000;
/** Full-width banner dwell — slower than the overlapping pair. */
const BANNER_AUTO_MS = 8000;
const BANNER_CROSSFADE_S = 0.65;
const BANNER_EASE = [0.4, 0, 0.2, 1] as const;
const PAIR_EASE_ENTER = [0.16, 1, 0.3, 1] as const;
const PAIR_EASE_EXIT = [0.4, 0, 1, 1] as const;
const PAIR_EASE = PAIR_EASE_ENTER;
const PAIR_ENTER_S = 0.7;
const PAIR_EXIT_S = 0.42;
const PAIR_FIRST_ENTER_MS = 720;
const LETTER_STAGGER_S = 0.035;
const LETTER_DURATION_S = 0.45;

type PairPhase = "enter" | "rest" | "exit";

function pairImageTransform(kind: PairPhase, dir: number) {
  if (kind === "rest") {
    return "translateX(0px) translateY(0px) scale(1) rotate(-3deg)";
  }
  if (kind === "enter") {
    return `translateX(${dir * 72}px) translateY(40px) scale(0.86) rotate(${-3 + dir * -10}deg)`;
  }
  return `translateX(${dir * -56}px) translateY(-24px) scale(0.92) rotate(${-3 + dir * -6}deg)`;
}

function pairInfoTransform(kind: PairPhase, dir: number) {
  if (kind === "rest") {
    return "translateX(0px) translateY(0px) scale(1) rotate(2deg)";
  }
  if (kind === "enter") {
    return `translateX(${dir * 80}px) translateY(44px) scale(0.88) rotate(${2 + dir * 10}deg)`;
  }
  return `translateX(${dir * -60}px) translateY(-20px) scale(0.93) rotate(${2 + dir * 6}deg)`;
}

const pairImageVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    filter: "blur(14px)",
    transform: pairImageTransform("enter", dir),
  }),
  rest: {
    opacity: 1,
    filter: "blur(0px)",
    transform: pairImageTransform("rest", 1),
  },
  exit: (dir: number) => ({
    opacity: 0,
    filter: "blur(10px)",
    transform: pairImageTransform("exit", dir),
  }),
};

const pairInfoVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    filter: "blur(14px)",
    transform: pairInfoTransform("enter", dir),
  }),
  rest: {
    opacity: 1,
    filter: "blur(0px)",
    transform: pairInfoTransform("rest", 1),
  },
  exit: (dir: number) => ({
    opacity: 0,
    filter: "blur(10px)",
    transform: pairInfoTransform("exit", dir),
  }),
};

const pairContentVariants = {
  enter: { opacity: 0, transform: "translateY(12px)" },
  rest: { opacity: 1, transform: "translateY(0px)" },
  exit: { opacity: 0, transform: "translateY(-6px)" },
};

/**
 * Thanks.co-style masked character rise for a short marketing heading.
 * Accessible name stays on the heading; visual letters are decorative.
 */
function StaggeredHeading({
  id,
  children,
  className,
}: {
  id: string;
  children: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const chars = Array.from(children);

  if (reduceMotion) {
    return (
      <h2 className={className} id={id}>
        {children}
      </h2>
    );
  }

  return (
    <h2
      aria-label={children}
      className={cn("flex flex-wrap justify-start", className)}
      id={id}
    >
      {chars.map((char, index) =>
        char === " " ? (
          <span
            aria-hidden="true"
            className="inline-block w-[0.3em]"
            // biome-ignore lint/suspicious/noArrayIndexKey: a heading's letters have no identity beyond position.
            key={`space-${index}`}
          />
        ) : (
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.08em] leading-[1.05]"
            // biome-ignore lint/suspicious/noArrayIndexKey: a heading's letters have no identity beyond position.
            key={`${char}-${index}`}
          >
            <motion.span
              animate={{ opacity: 1, transform: "translateY(0%)" }}
              className="inline-block will-change-transform"
              initial={{ opacity: 0, transform: "translateY(100%)" }}
              transition={{
                duration: LETTER_DURATION_S,
                ease: PAIR_EASE,
                delay: index * LETTER_STAGGER_S,
              }}
            >
              {char}
            </motion.span>
          </span>
        ),
      )}
    </h2>
  );
}

/**
 * Thanks.co-style featured band: one lot at a time as an overlapping
 * image + info pair, with pill/dot pagination and auto-play progress.
 */
function FeaturedAuctionsPair({
  lots,
  watched,
  onToggle,
}: FeaturedAuctionsPairProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const [pairReady, setPairReady] = useState(() => Boolean(reduceMotion));
  const directionRef = useRef(1);
  const safeIndex = lots.length === 0 ? 0 : Math.min(index, lots.length - 1);
  const lot = lots[safeIndex];
  const direction = directionRef.current;

  useEffect(() => {
    if (index >= lots.length) setIndex(0);
  }, [index, lots.length]);

  useEffect(() => {
    if (reduceMotion) {
      setPairReady(true);
      return;
    }
    const timer = window.setTimeout(
      () => setPairReady(true),
      PAIR_FIRST_ENTER_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  // Reduced motion: advance on an interval with no progress tween.
  // biome-ignore lint/correctness/useExhaustiveDependencies: playKey and safeIndex re-arm the timer after each move.
  useEffect(() => {
    if (!reduceMotion || lots.length <= 1 || paused) return;
    const timer = window.setTimeout(() => {
      directionRef.current = 1;
      setIndex((current) => (current + 1) % lots.length);
      setPlayKey((key) => key + 1);
    }, PAIR_AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [lots.length, paused, playKey, reduceMotion, safeIndex]);

  function goTo(nextIndex: number) {
    if (nextIndex === safeIndex) {
      setPlayKey((key) => key + 1);
      return;
    }
    const last = lots.length - 1;
    if (safeIndex === last && nextIndex === 0) directionRef.current = 1;
    else if (safeIndex === 0 && nextIndex === last) directionRef.current = -1;
    else directionRef.current = nextIndex > safeIndex ? 1 : -1;
    setIndex(nextIndex);
    setPlayKey((key) => key + 1);
  }

  function advanceFromTimer() {
    if (paused || lots.length <= 1) return;
    directionRef.current = 1;
    setIndex((current) => (current + 1) % lots.length);
    setPlayKey((key) => key + 1);
  }

  if (!lot) return null;

  const softShadow =
    "shadow-[0_12px_32px_-12px_rgb(0_0_0_/_12%),0_4px_12px_-6px_rgb(0_0_0_/_6%)]";
  const enterMs = reduceMotion ? 0.01 : PAIR_ENTER_S;
  const exitMs = reduceMotion ? 0.01 : PAIR_EXIT_S;
  const imageTransition = {
    opacity: { duration: enterMs, ease: PAIR_EASE_ENTER },
    filter: { duration: enterMs, ease: PAIR_EASE_ENTER },
    transform: { duration: enterMs, ease: PAIR_EASE_ENTER },
  } as const;
  const imageExitTransition = {
    opacity: { duration: exitMs, ease: PAIR_EASE_EXIT },
    filter: { duration: exitMs * 0.85, ease: PAIR_EASE_EXIT },
    transform: { duration: exitMs, ease: PAIR_EASE_EXIT },
  } as const;
  const infoTransition = {
    opacity: {
      duration: enterMs,
      ease: PAIR_EASE_ENTER,
      delay: reduceMotion ? 0 : 0.1,
    },
    filter: {
      duration: enterMs,
      ease: PAIR_EASE_ENTER,
      delay: reduceMotion ? 0 : 0.1,
    },
    transform: {
      duration: enterMs,
      ease: PAIR_EASE_ENTER,
      delay: reduceMotion ? 0 : 0.1,
    },
  } as const;
  const infoExitTransition = {
    opacity: { duration: exitMs, ease: PAIR_EASE_EXIT },
    filter: { duration: exitMs * 0.85, ease: PAIR_EASE_EXIT },
    transform: { duration: exitMs, ease: PAIR_EASE_EXIT },
  } as const;
  const contentTransition = (delay: number) =>
    ({
      duration: reduceMotion ? 0.01 : 0.45,
      ease: PAIR_EASE_ENTER,
      delay: reduceMotion ? 0 : delay,
    }) as const;
  const imageHover = reduceMotion
    ? undefined
    : {
        transform: "translateX(0px) translateY(-6px) scale(1.04) rotate(-3deg)",
        transition: { duration: 0.35, ease: PAIR_EASE_ENTER },
      };

  return (
    <section
      aria-labelledby="featured-auctions-pair"
      aria-roledescription="carousel"
      className="w-full bg-gradient-to-b from-[var(--orange-100)] to-background text-foreground"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pt-28 pb-20 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-8 lg:pt-32 lg:pb-24">
        <div className="flex w-full max-w-md shrink-0 flex-col items-start gap-3 text-left lg:max-w-sm xl:max-w-md">
          <StaggeredHeading
            className="w-full text-4xl font-bold leading-tight sm:text-5xl sm:leading-[48px]"
            id="featured-auctions-pair"
          >
            Grade10 Auctions
          </StaggeredHeading>
          <motion.p
            animate={{
              opacity: 1,
              transform: reduceMotion ? "none" : "translateY(0px)",
            }}
            className="w-full text-xl font-medium leading-7 text-foreground"
            initial={{
              opacity: reduceMotion ? 1 : 0,
              transform: reduceMotion ? "none" : "translateY(8px)",
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              ease: PAIR_EASE,
              delay: reduceMotion ? 0 : 0.18,
            }}
          >
            New auctions every week
          </motion.p>
        </div>

        <div className="flex min-w-0 w-full flex-1 justify-center lg:justify-end">
          <div className="flex w-full max-w-3xl flex-col items-center gap-10">
            <div
              aria-live="polite"
              className="relative w-full overflow-visible sm:min-h-[28rem]"
            >
              {pairReady ? (
                <AnimatePresence custom={direction} mode="sync">
                  <motion.div
                    key={lot.id}
                    animate={{ opacity: 1 }}
                    className="flex w-full flex-col items-center justify-center gap-6 sm:absolute sm:inset-0 sm:flex-row sm:items-center sm:justify-center sm:gap-0"
                    exit={{
                      opacity: 1,
                      transition: { duration: exitMs + 0.05 },
                    }}
                    initial={{ opacity: 1 }}
                  >
                    <motion.a
                      animate="rest"
                      className={cn(
                        pressable,
                        "relative z-0 w-[min(100%,14.5rem)] shrink-0 overflow-hidden rounded-[16px] bg-background-subtle sm:w-[15.5rem] sm:-mr-3",
                        softShadow,
                        "motion-reduce:sm:rotate-0",
                      )}
                      custom={direction}
                      exit="exit"
                      href={lotAddress(lot)}
                      initial={reduceMotion ? false : "enter"}
                      onBlur={(event: FocusEvent<HTMLAnchorElement>) => {
                        if (
                          !event.currentTarget.contains(
                            event.relatedTarget as Node | null,
                          )
                        ) {
                          setPaused(false);
                        }
                      }}
                      onFocus={() => setPaused(true)}
                      onMouseEnter={() => setPaused(true)}
                      onMouseLeave={() => setPaused(false)}
                      transition={{
                        ...imageTransition,
                        exit: imageExitTransition,
                      }}
                      variants={
                        reduceMotion
                          ? {
                              enter: { opacity: 1 },
                              rest: { opacity: 1 },
                              exit: { opacity: 0 },
                            }
                          : pairImageVariants
                      }
                      whileHover={imageHover}
                    >
                      <img
                        alt={lot.imageAlt}
                        className="block h-auto w-full object-contain"
                        height={800}
                        loading="eager"
                        src={lot.imageSrc}
                        width={600}
                      />
                    </motion.a>

                    <motion.div
                      animate="rest"
                      className={cn(
                        "relative z-10 flex w-[min(100%,20rem)] shrink-0 flex-col items-center justify-center gap-5 rounded-[32px] border border-border bg-background px-8 py-10 text-center sm:w-[22rem] sm:px-10 sm:py-12",
                        softShadow,
                        "motion-reduce:sm:rotate-0",
                      )}
                      custom={direction}
                      exit="exit"
                      initial={reduceMotion ? false : "enter"}
                      onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
                        if (
                          !event.currentTarget.contains(
                            event.relatedTarget as Node | null,
                          )
                        ) {
                          setPaused(false);
                        }
                      }}
                      onFocusCapture={() => setPaused(true)}
                      onMouseEnter={() => setPaused(true)}
                      onMouseLeave={() => setPaused(false)}
                      transition={{
                        ...infoTransition,
                        exit: infoExitTransition,
                      }}
                      variants={
                        reduceMotion
                          ? {
                              enter: { opacity: 1 },
                              rest: { opacity: 1 },
                              exit: { opacity: 0 },
                            }
                          : pairInfoVariants
                      }
                    >
                      <span className="absolute top-3 right-3 z-10">
                        <CatalogueWatch
                          lot={lot}
                          onToggle={() => onToggle(lot.id)}
                          size="sm"
                          watched={watched.has(lot.id)}
                        />
                      </span>
                      <motion.a
                        animate="rest"
                        className={cn(
                          pressable,
                          "line-clamp-3 w-full text-balance text-xl font-semibold leading-7 text-foreground underline-offset-2 hover:underline sm:text-2xl sm:leading-8",
                        )}
                        href={lotAddress(lot)}
                        initial={reduceMotion ? false : "enter"}
                        transition={contentTransition(0.22)}
                        variants={
                          reduceMotion ? undefined : pairContentVariants
                        }
                      >
                        {lot.title}
                      </motion.a>
                      <motion.div
                        animate="rest"
                        className="flex w-full flex-col items-center gap-1"
                        initial={reduceMotion ? false : "enter"}
                        transition={contentTransition(0.3)}
                        variants={
                          reduceMotion ? undefined : pairContentVariants
                        }
                      >
                        <p className="text-sm text-secondary-foreground">
                          {lot.status === "Upcoming"
                            ? "Starting bid"
                            : "Current Bid"}
                        </p>
                        <p className="text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
                          {lot.bidLabel}
                        </p>
                        {lot.status !== "Ended" ? (
                          <p className="text-sm text-secondary-foreground">
                            {bidsLabel(lot.bidCount)}
                          </p>
                        ) : null}
                      </motion.div>
                      <motion.div
                        animate="rest"
                        initial={reduceMotion ? false : "enter"}
                        transition={contentTransition(0.36)}
                        variants={
                          reduceMotion ? undefined : pairContentVariants
                        }
                      >
                        <LotCountdown lot={lot} />
                      </motion.div>
                      <motion.div
                        animate="rest"
                        initial={reduceMotion ? false : "enter"}
                        transition={contentTransition(0.42)}
                        variants={
                          reduceMotion ? undefined : pairContentVariants
                        }
                      >
                        <a
                          className={buttonVariants({
                            size: "lg",
                            variant: "default",
                          })}
                          href={lotAddress(lot)}
                        >
                          Bid Now
                        </a>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </div>

            {lots.length > 1 ? (
              <CarouselProgress
                aria-label="Featured lots"
                className="justify-center"
                onBlurCapture={(event: FocusEvent<HTMLElement>) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget as Node | null,
                    )
                  ) {
                    setPaused(false);
                  }
                }}
                onFocusCapture={() => setPaused(true)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {lots.map((item, itemIndex) => (
                  <CarouselProgressItem
                    active={itemIndex === safeIndex}
                    durationMs={PAIR_AUTO_MS}
                    key={item.id}
                    label={`Show featured lot ${itemIndex + 1}: ${item.title}`}
                    onClick={() => goTo(itemIndex)}
                    onComplete={advanceFromTimer}
                    paused={paused}
                    playKey={playKey}
                    reduceMotion={Boolean(reduceMotion)}
                  />
                ))}
              </CarouselProgress>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

type FeaturedAuctionsBannerProps = {
  lots: readonly CatalogueLot[];
};

/**
 * Full-width Figma carousel banner (`6945:12258`): copy on muted left,
 * staged lot image on the bronze right, with CarouselProgress under the copy
 * on desktop. Mobile stacks image → progress band → copy so the dots stay
 * clear of Ends and sit above LIVE BIDDING with room to breathe.
 */
function FeaturedAuctionsBanner({ lots }: FeaturedAuctionsBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const safeIndex = lots.length === 0 ? 0 : Math.min(index, lots.length - 1);
  const lot = lots[safeIndex];
  const fadeMs = reduceMotion ? 0.01 : BANNER_CROSSFADE_S;
  const fadeTransition = {
    duration: fadeMs,
    ease: BANNER_EASE,
  } as const;

  useEffect(() => {
    if (index >= lots.length) setIndex(0);
  }, [index, lots.length]);

  useEffect(() => {
    if (!reduceMotion || lots.length <= 1 || paused) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % lots.length);
      setPlayKey((key) => key + 1);
    }, BANNER_AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [lots.length, paused, playKey, reduceMotion, safeIndex]);

  function goTo(nextIndex: number) {
    if (nextIndex === safeIndex) {
      setPlayKey((key) => key + 1);
      return;
    }
    setIndex(nextIndex);
    setPlayKey((key) => key + 1);
  }

  function advanceFromTimer() {
    if (paused || lots.length <= 1) return;
    setIndex((current) => (current + 1) % lots.length);
    setPlayKey((key) => key + 1);
  }

  if (!lot) return null;

  const statusLabel =
    lot.status === "Upcoming"
      ? "UPCOMING"
      : lot.status === "Ended"
        ? "ENDED"
        : "LIVE BIDDING";
  const bidCaption =
    lot.status === "Upcoming" ? "STARTING BID" : "CURRENT BID";

  return (
    <section
      aria-labelledby="featured-auctions-banner"
      aria-roledescription="carousel"
      className="w-full text-foreground"
      onBlurCapture={(event: FocusEvent<HTMLElement>) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setPaused(false);
        }
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid w-full grid-cols-1 md:h-[600px] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:grid-rows-[minmax(0,1fr)_auto]">
        {/* Image first on small screens; right column from md. */}
        <div className="relative order-1 h-72 overflow-hidden sm:h-80 md:col-start-2 md:row-span-2 md:h-full md:order-none">
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
            height={805}
            src={FEATURED_BANNER_BG}
            width={1305}
          />
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={lot.id}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <a
                className={cn(
                  pressable,
                  "absolute top-1/2 left-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[16px] border border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-background-subtle shadow-[0_24px_56px_-16px_rgb(0_0_0_/_45%)]",
                )}
                href={lotAddress(lot)}
              >
                <img
                  alt={lot.imageAlt}
                  className="block h-full w-auto max-w-none object-contain"
                  height={800}
                  loading="eager"
                  src={lot.imageSrc}
                  width={600}
                />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/*
          Mobile: own band between image and copy — easy to spot, cannot
          overlap Ends. md+: foot of the copy column (Figma).
        */}
        {lots.length > 1 ? (
          <CarouselProgress
            aria-label="Featured lots"
            className="relative z-10 order-2 justify-center border-y border-border bg-background px-6 py-5 sm:px-10 md:order-none md:col-start-1 md:row-start-2 md:justify-start md:border-0 md:bg-muted md:px-16 md:pt-8 md:pb-12"
          >
            {lots.map((item, itemIndex) => (
              <CarouselProgressItem
                active={itemIndex === safeIndex}
                className="after:absolute after:-inset-3 after:content-['']"
                durationMs={BANNER_AUTO_MS}
                key={item.id}
                label={`Show featured lot ${itemIndex + 1}: ${item.title}`}
                onClick={() => goTo(itemIndex)}
                onComplete={advanceFromTimer}
                paused={paused}
                playKey={playKey}
                reduceMotion={Boolean(reduceMotion)}
              />
            ))}
          </CarouselProgress>
        ) : null}

        <div
          className={cn(
            "relative order-3 min-h-[22rem] overflow-hidden bg-muted sm:min-h-[24rem] md:order-none md:col-start-1 md:row-start-1 md:h-full md:min-h-0",
            lots.length > 1 ? null : "md:row-span-2",
          )}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={lot.id}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col justify-start gap-5 overflow-y-auto px-6 pt-12 pb-10 sm:gap-6 sm:px-10 sm:pt-12 sm:pb-12 md:justify-center md:gap-8 md:overflow-hidden md:px-16 md:pt-12 md:pb-12"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <div className="flex items-center gap-2">
                {lot.status === "Active" ? (
                  <StepIndicator state="progress" />
                ) : null}
                <p className="text-sm font-semibold tracking-wide text-foreground uppercase">
                  {statusLabel}
                </p>
              </div>
              <h2
                className="max-w-xl text-balance text-2xl font-semibold leading-8 text-foreground sm:text-3xl sm:leading-10 md:text-4xl"
                id="featured-auctions-banner"
              >
                <a
                  className={cn(
                    pressable,
                    "line-clamp-3 underline-offset-2 hover:underline",
                  )}
                  href={lotAddress(lot)}
                >
                  {lot.title}
                </a>
              </h2>
              <div className="flex w-full flex-col items-start">
                <p className="text-sm font-medium tracking-wide text-secondary-foreground uppercase">
                  {bidCaption}
                </p>
                <p className="text-xl font-semibold tabular-nums leading-7 text-foreground sm:text-2xl sm:leading-8">
                  {lot.bidLabel}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  className={buttonVariants({
                    size: "lg",
                    variant: "default",
                  })}
                  href={lotAddress(lot)}
                >
                  Bid Now
                  <ArrowRight aria-hidden size={16} weight="bold" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarBlank aria-hidden size={14} weight="bold" />
                  <BannerCountdown lot={lot} />
                </span>
                {lot.status !== "Ended" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="hidden h-5 w-px shrink-0 bg-border sm:block"
                    />
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Gavel aria-hidden size={14} weight="bold" />
                      {bidsLabel(lot.bidCount)}
                    </span>
                  </>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

type AuctionCategoryButtonProps = {
  name: string;
  selected?: boolean;
  onSelect: () => void;
};

function AuctionCategoryButton({
  name,
  selected = false,
  onSelect,
}: AuctionCategoryButtonProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "group/category relative aspect-square w-full overflow-hidden rounded-(--radius-2xl) border bg-background-subtle text-center outline-none transition-[border-color,opacity] duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary-border"
          : "border-border opacity-80 hover:opacity-100",
      )}
      onClick={onSelect}
      type="button"
    >
      <span className="absolute inset-x-[7px] top-[15px] z-10 text-sm font-medium leading-5 text-foreground">
        {name}
      </span>
      <span className="pointer-events-none absolute top-[38%] left-1/2 z-0 h-[93%] w-[54%] -translate-x-1/2 [perspective:640px]">
        <span
          className={cn(
            "relative block size-full origin-center shadow-[4px_4px_4px_0_rgb(0_0_0_/_10%)]",
            "[transform:rotateY(-16deg)_rotateZ(8deg)]",
            "transition-transform duration-200 ease-out will-change-transform",
            "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/category:[transform:rotateY(-22deg)_rotateZ(10deg)]",
            "motion-reduce:transition-none",
          )}
        >
          <img
            alt=""
            className="size-full object-cover"
            height={132}
            loading="lazy"
            src={CATALOGUE_IMAGE}
            width={77}
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 overflow-hidden",
              "after:absolute after:inset-0 after:content-['']",
              "after:bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255_/_55%)_50%,transparent_65%)]",
              "after:opacity-0 after:transition-[transform,opacity] after:duration-500 after:ease-out",
              "after:[transform:translateX(-120%)]",
              "[@media(hover:hover)_and_(pointer:fine)]:group-hover/category:after:opacity-100",
              "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/category:after:[transform:translateX(120%)]",
              "motion-reduce:after:transition-none",
            )}
          />
        </span>
      </span>
    </button>
  );
}

export {
  AuctionCategoryButton,
  AuctionLotCard,
  FeaturedAuctions,
  FeaturedAuctionsBanner,
  FeaturedAuctionsPair,
};
