import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";
import { registerBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import { Bell, BellSlash, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AUCTION_LOT_DETAILS_COPY } from "./auction-lot-details-content";
import {
  CATALOGUE_IMAGE,
  COLLECTION_LOTS,
  type CatalogueLot,
} from "./auction-catalogue-content";
import auctionLotCardBones from "./auction-catalogue-lot-card.bones.json";

registerBones({
  "auction-catalogue-lot-card": auctionLotCardBones,
});


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
    timer = window.setTimeout(tick, targetMs - Date.now() > HOUR_MS ? 60_000 : 1_000);
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
      description:
        "description" in message ? message.description : undefined,
    });
  }, [lot.status, watched]);

  if (lot.status === "Ended") return null;

  const label = watched
    ? `Unwatch ${lot.title}`
    : `Watch ${lot.title}`;

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
            !lift && "border border-border",
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
              className={cn(
                "size-full object-contain",
                !lift &&
                  "transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/lot-card:scale-105",
                imageRadius,
              )}
              height={640}
              loading={eager ? "eager" : "lazy"}
              src={CATALOGUE_IMAGE}
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
            {lot.status !== "Ended" ? (
              <p
                className={cn(
                  "shrink-0 whitespace-nowrap text-secondary-foreground",
                  lift ? "text-xs leading-4" : "text-sm leading-5",
                )}
              >
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
const PAIR_EASE = [0.23, 1, 0.32, 1] as const;

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
  const safeIndex = lots.length === 0 ? 0 : Math.min(index, lots.length - 1);
  const lot = lots[safeIndex];
  const directionRef = useRef(1);

  useEffect(() => {
    if (index >= lots.length) setIndex(0);
  }, [index, lots.length]);

  // Reduced motion: advance on an interval with no progress tween.
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
    directionRef.current = nextIndex > safeIndex ? 1 : -1;
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
  const direction = directionRef.current;
  const slideMs = reduceMotion ? 0.01 : 0.32;

  return (
    <section
      aria-labelledby="featured-auctions-pair"
      aria-roledescription="carousel"
      className="w-full bg-gradient-to-b from-[var(--orange-100)] to-background text-foreground"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-4 pt-28 pb-20 sm:gap-20 sm:px-8">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <h2
            className="w-full text-4xl font-bold leading-tight sm:text-5xl sm:leading-[48px]"
            id="featured-auctions-pair"
          >
            Grade10 Auctions
          </h2>
          <p className="w-full text-xl leading-7 text-secondary-foreground">
            New auctions every week
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-10">
          <div
            aria-live="polite"
            className="relative mx-auto w-full max-w-3xl sm:min-h-[28rem]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={lot.id}
                animate={{ opacity: 1 }}
                className="flex w-full flex-col items-center justify-center gap-6 sm:absolute sm:inset-0 sm:flex-row sm:items-center sm:gap-0"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: slideMs, ease: PAIR_EASE }}
              >
                <motion.a
                  animate={{
                    opacity: 1,
                    transform: reduceMotion
                      ? "none"
                      : "translateX(0px) rotate(-3deg)",
                  }}
                  className={cn(
                    pressable,
                    "relative z-0 w-[min(100%,14.5rem)] shrink-0 overflow-hidden rounded-[16px] bg-background-subtle sm:w-[15.5rem] sm:-mr-3",
                    softShadow,
                    "motion-reduce:sm:rotate-0",
                  )}
                  exit={{
                    opacity: 0,
                    transform: reduceMotion
                      ? "none"
                      : `translateX(${direction * -28}px) rotate(-5deg)`,
                  }}
                  href={lotAddress(lot)}
                  initial={{
                    opacity: 0,
                    transform: reduceMotion
                      ? "none"
                      : `translateX(${direction * -28}px) rotate(-5deg)`,
                  }}
                  transition={{ duration: slideMs, ease: PAIR_EASE }}
                >
                  <img
                    alt={lot.imageAlt}
                    className="block h-auto w-full object-contain"
                    height={800}
                    loading="eager"
                    src={CATALOGUE_IMAGE}
                    width={600}
                  />
                </motion.a>

                <motion.div
                  animate={{
                    opacity: 1,
                    transform: reduceMotion
                      ? "none"
                      : "translateX(0px) rotate(2deg)",
                  }}
                  className={cn(
                    "relative z-10 flex w-[min(100%,20rem)] shrink-0 flex-col items-center justify-center gap-5 rounded-[32px] border border-border bg-background px-8 py-10 text-center sm:w-[22rem] sm:px-10 sm:py-12",
                    softShadow,
                    "motion-reduce:sm:rotate-0",
                  )}
                  exit={{
                    opacity: 0,
                    transform: reduceMotion
                      ? "none"
                      : `translateX(${direction * 28}px) rotate(4deg)`,
                  }}
                  initial={{
                    opacity: 0,
                    transform: reduceMotion
                      ? "none"
                      : `translateX(${direction * 28}px) rotate(4deg)`,
                  }}
                  transition={{ duration: slideMs, ease: PAIR_EASE }}
                >
                  <span className="absolute top-3 right-3 z-10">
                    <CatalogueWatch
                      lot={lot}
                      onToggle={() => onToggle(lot.id)}
                      size="sm"
                      watched={watched.has(lot.id)}
                    />
                  </span>
                  <a
                    className={cn(
                      pressable,
                      "line-clamp-3 pr-10 text-xl font-semibold leading-7 text-foreground underline-offset-2 hover:underline sm:text-2xl sm:leading-8",
                    )}
                    href={lotAddress(lot)}
                  >
                    {lot.title}
                  </a>
                  <div className="flex w-full flex-col items-center gap-1">
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
                  </div>
                  <LotCountdown lot={lot} />
                  <Button
                    nativeButton={false}
                    render={<a href={lotAddress(lot)} />}
                    size="lg"
                    variant="default"
                  >
                    Bid Now
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {lots.length > 1 ? (
            <nav
              aria-label="Featured lots"
              className="flex items-center justify-center gap-2"
            >
              {lots.map((item, itemIndex) => {
                const active = itemIndex === safeIndex;
                return (
                  <button
                    aria-current={active ? "true" : undefined}
                    aria-label={`Show featured lot ${itemIndex + 1}: ${item.title}`}
                    className={cn(
                      "relative overflow-hidden rounded-full outline-none transition-[width,height] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                      active
                        ? "h-1.5 w-8 bg-border"
                        : "size-1.5 bg-border opacity-80 hover:opacity-100",
                    )}
                    key={item.id}
                    onClick={() => goTo(itemIndex)}
                    type="button"
                  >
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 rounded-full bg-[var(--orange-500)]"
                        key={playKey}
                        onAnimationEnd={(event) => {
                          if (event.animationName !== "featured-pair-progress") {
                            return;
                          }
                          advanceFromTimer();
                        }}
                        style={
                          reduceMotion
                            ? { width: "100%" }
                            : {
                                animation: `featured-pair-progress ${PAIR_AUTO_MS}ms linear forwards`,
                                animationPlayState: paused
                                  ? "paused"
                                  : "running",
                                width: "0%",
                              }
                        }
                      />
                    ) : null}
                  </button>
                );
              })}
            </nav>
          ) : null}
        </div>
      </div>
      <style>{`
        @keyframes featured-pair-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
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
  FeaturedAuctionsPair,
};
