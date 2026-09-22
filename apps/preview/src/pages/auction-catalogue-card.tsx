import { Badge } from "@grade10/design-system/components/display/badge";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { WatchButton } from "@grade10/ui";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { AUCTION_LOT_DETAILS_COPY } from "./auction-lot-details-content";
import {
  CATALOGUE_IMAGE,
  type CatalogueLot,
  type CatalogueStatus,
} from "./auction-catalogue-content";

const pressable =
  "cursor-pointer rounded-md outline-none transition-opacity duration-200 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-80 motion-reduce:transition-none";

const WATCH_COPY = {
  watch: AUCTION_LOT_DETAILS_COPY.header.watch,
  watching: AUCTION_LOT_DETAILS_COPY.header.watching,
  watchAriaLabel: AUCTION_LOT_DETAILS_COPY.header.watchAriaLabel,
  unwatchAriaLabel: AUCTION_LOT_DETAILS_COPY.header.unwatchAriaLabel,
};

function lotAddress(lot: CatalogueLot): string {
  return `https://grade10.com/auction/listings/${lot.slug}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

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
      short: `${days}d ${hours}h`,
      long: `${unit(days, "day")} ${unit(hours, "hour")}`,
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
      <p className="text-sm text-muted-foreground">
        Ended <time dateTime={lot.closesAt}>{lot.closeLabel}</time>
      </p>
    );
  }

  return (
    <p
      className={cn(
        "text-sm tabular-nums",
        soon ? "font-medium text-destructive" : "text-muted-foreground",
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

function StatusBadge({ status }: { status: CatalogueStatus }) {
  return (
    <Badge size="sm" variant="outline">
      {status}
    </Badge>
  );
}

function CatalogueWatch({
  lot,
  watched,
  onToggle,
}: {
  lot: CatalogueLot;
  watched: boolean;
  onToggle: () => void;
}) {
  if (lot.status === "Ended") return null;
  return (
    <WatchButton
      className="min-h-11"
      copy={{
        ...WATCH_COPY,
        watchAriaLabel: `Watch ${lot.title}`,
        unwatchAriaLabel: `Unwatch ${lot.title}`,
      }}
      onPress={onToggle}
      watched={watched}
    />
  );
}

type AuctionLotCardProps = {
  lot: CatalogueLot;
  watched: boolean;
  onToggle: () => void;
  /** The list heads each title. Featured repeats the lot, so the title stays a link. */
  heading: boolean;
  eager?: boolean;
  /** Featured: the card grows. The picture stays flat. */
  lift?: boolean;
};

function AuctionLotCard({
  lot,
  watched,
  onToggle,
  heading,
  eager,
  lift,
}: AuctionLotCardProps) {
  const title = (
    <a
      className={cn(
        pressable,
        "line-clamp-2 text-base font-medium leading-6 text-card-foreground underline-offset-2 hover:underline",
      )}
      href={lotAddress(lot)}
    >
      {lot.title}
    </a>
  );

  return (
    <article
      className={cn(
        "group/lot-card flex h-full w-full flex-col",
        lift &&
          "origin-center rounded-(--radius-3xl) bg-background p-3 text-card-foreground transition-transform duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:scale-[1.04]",
      )}
    >
      <div className="relative aspect-square w-full">
        <a
          className={cn(
            pressable,
            "absolute inset-0 overflow-hidden rounded-(--radius-3xl)",
          )}
          href={lotAddress(lot)}
        >
          <span className="lot-image-well absolute inset-0 isolate overflow-hidden rounded-(--radius-3xl) border border-border bg-muted">
            <img
              alt={lot.imageAlt}
              className="size-full rounded-(--radius-3xl) object-contain transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/lot-card:scale-105"
              height={640}
              loading={eager ? "eager" : "lazy"}
              src={CATALOGUE_IMAGE}
              width={640}
            />
          </span>
        </a>
        <span className="pointer-events-none absolute top-3 left-3 z-10">
          <StatusBadge status={lot.status} />
        </span>
        <span className="absolute right-2 bottom-2 z-10">
          <CatalogueWatch lot={lot} onToggle={onToggle} watched={watched} />
        </span>
      </div>
      <div className="flex min-w-0 flex-col items-start gap-1 px-1 pt-3 pb-1">
        {heading ? (
          <h3 className="w-full text-card-foreground">{title}</h3>
        ) : (
          title
        )}
        <p className="text-lg font-semibold tabular-nums leading-7 text-card-foreground">
          {lot.bidLabel}
        </p>
        <LotCountdown lot={lot} />
      </div>
    </article>
  );
}

type FeaturedAuctionsProps = {
  lots: readonly CatalogueLot[];
  watched: ReadonlySet<string>;
  onToggle: (id: string) => void;
};

function featuredCardWidth(count: number) {
  if (count <= 1) return "w-[17.5rem] max-w-full";
  if (count === 2) {
    return "w-full @min-[40rem]:w-[calc((100%-1rem)/2)]";
  }
  if (count === 3) {
    return "w-full @min-[40rem]:w-[calc((100%-1rem)/2)] @min-[64rem]:w-[calc((100%-2rem)/3)]";
  }
  return "w-full @min-[40rem]:w-[calc((100%-1rem)/2)] @min-[64rem]:w-[calc((100%-3rem)/4)]";
}

function FeaturedAuctions({ lots, watched, onToggle }: FeaturedAuctionsProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

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
  }, [lots]);

  function scrollByCard(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector("li");
    const distance =
      (card?.getBoundingClientRect().width ?? scroller.clientWidth) + 16;
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
      className="w-full text-foreground [background-image:linear-gradient(165deg,color-mix(in_oklab,var(--orange-50)_75%,var(--background)),color-mix(in_oklab,var(--orange-100)_42%,var(--background))_52%,color-mix(in_oklab,var(--orange-50)_55%,var(--background)))]"
    >
      <div className="@container mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 sm:items-end sm:gap-10">
            <h2
              className="text-3xl font-semibold leading-tight sm:text-4xl"
              id="featured-auctions"
            >
              Featured auctions
            </h2>
            <p className="max-w-xs text-base">Live lots, soonest to close.</p>
          </div>
          {canScroll ? (
            <div className="flex gap-2">
              <IconButton
                aria-label="Previous featured auctions"
                className="bg-background"
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
                className="bg-background"
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
        </div>
        <ul
          className="flex w-full min-w-0 items-stretch gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
          ref={scrollerRef}
        >
          {lots.map((lot) => (
            <li
              className={cn(
                "shrink-0 snap-start p-3",
                featuredCardWidth(lots.length),
              )}
              key={lot.id}
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
    </section>
  );
}

export { AuctionLotCard, FeaturedAuctions };
