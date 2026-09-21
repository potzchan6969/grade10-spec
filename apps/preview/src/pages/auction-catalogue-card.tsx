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
};

function AuctionLotCard({
  lot,
  watched,
  onToggle,
  heading,
  eager,
}: AuctionLotCardProps) {
  const title = (
    <a
      className={cn(
        pressable,
        "line-clamp-2 text-base font-medium text-card-foreground underline-offset-2 hover:underline",
      )}
      href={lotAddress(lot)}
    >
      {lot.title}
    </a>
  );

  return (
    <article className="group/lot-card flex h-full w-full flex-col">
      <div className="relative aspect-square w-full">
        <a
          className={cn(
            pressable,
            "absolute inset-0 overflow-hidden rounded-(--radius-3xl)",
          )}
          href={lotAddress(lot)}
        >
          <span className="absolute inset-0 isolate overflow-hidden rounded-(--radius-3xl) border border-border bg-muted">
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
      <div className="flex min-w-0 flex-col items-start gap-1 py-2">
        {heading ? (
          <h3 className="w-full text-base font-medium leading-6 text-card-foreground">
            {title}
          </h3>
        ) : (
          title
        )}
        <p className="text-base font-medium tabular-nums text-card-foreground">
          {lot.bidLabel}
        </p>
        <p className="text-base text-muted-foreground tabular-nums">
          Closes <time dateTime={lot.closesAt}>{lot.closeLabel}</time>
        </p>
      </div>
    </article>
  );
}

type FeaturedAuctionsProps = {
  lots: readonly CatalogueLot[];
  watched: ReadonlySet<string>;
  onToggle: (id: string) => void;
};

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
    <section aria-labelledby="featured-auctions" className="min-w-0">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2
          className="text-2xl font-semibold text-foreground"
          id="featured-auctions"
        >
          Featured auctions
        </h2>
        {canScroll ? (
          <div className="flex gap-2">
            <IconButton
              aria-label="Previous featured auctions"
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
        className="flex w-full min-w-0 items-stretch gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-1"
        ref={scrollerRef}
      >
        {lots.map((lot) => (
          <li className="w-[17.5rem] shrink-0 snap-start" key={lot.id}>
            <AuctionLotCard
              eager
              heading={false}
              lot={lot}
              onToggle={() => onToggle(lot.id)}
              watched={watched.has(lot.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export { AuctionLotCard, FeaturedAuctions };
