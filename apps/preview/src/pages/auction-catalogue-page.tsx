import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { useEffect, useMemo, useState } from "react";
import { AuctionLotCard, FeaturedAuctions } from "./auction-catalogue-card";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import {
  CATALOGUE_CANONICAL,
  CATALOGUE_DESCRIPTION,
  CATALOGUE_IMAGE,
  CATALOGUE_TITLE,
  type CatalogueLot,
  type CatalogueStatus,
} from "./auction-catalogue-content";
import { STORE_FOOTER } from "./store-content";

const LIVE_CAP = 12;
const FEATURED_CAP = 4;

const pressable =
  "cursor-pointer rounded-md outline-none transition-opacity duration-200 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-80 motion-reduce:transition-none";

function rank(status: CatalogueStatus): number {
  if (status === "Active") return 0;
  if (status === "Upcoming") return 1;
  return 2;
}

function byCatalogueOrder(lots: readonly CatalogueLot[]): CatalogueLot[] {
  return [...lots].sort((a, b) => {
    const status = rank(a.status) - rank(b.status);
    if (status !== 0) return status;
    if (a.status === "Ended") return b.closesAt.localeCompare(a.closesAt);
    if (a.status === "Upcoming") return a.startsAt.localeCompare(b.startsAt);
    return a.closesAt.localeCompare(b.closesAt);
  });
}

function lotAddress(lot: CatalogueLot): string {
  return `https://grade10.com/auction/listings/${lot.slug}`;
}

function CategoryTiles({
  categories,
  onSelect,
  layout,
}: {
  categories: readonly { id: string; name: string; cover: CatalogueLot }[];
  onSelect: (id: string) => void;
  layout: "bella" | "tiles";
}) {
  if (layout === "tiles") {
    return (
      <nav aria-label="Categories" className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <button
            className={cn(
              pressable,
              "flex min-h-11 flex-col gap-2 bg-background p-2 text-left",
            )}
            key={category.id}
            onClick={() => onSelect(category.id)}
            type="button"
          >
            <img
              alt=""
              className="aspect-square w-full object-cover"
              height={160}
              loading="lazy"
              src={CATALOGUE_IMAGE}
              width={160}
            />
            <span className="text-base font-medium text-foreground">
              {category.name}
            </span>
          </button>
        ))}
      </nav>
    );
  }

  const [lead, ...rest] = categories;
  if (!lead) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <CategoryFeature category={lead} large onSelect={onSelect} />
      <div className="grid gap-4">
        {rest.map((category) => (
          <CategoryFeature
            category={category}
            key={category.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryFeature({
  category,
  large,
  onSelect,
}: {
  category: { id: string; name: string; cover: CatalogueLot };
  large?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <article className="relative min-h-44 overflow-hidden rounded-lg bg-muted">
      <img
        alt={category.cover.imageAlt}
        className={cn("w-full object-cover", large ? "aspect-[4/3]" : "aspect-[2/1]")}
        height={large ? 480 : 240}
        loading="lazy"
        src={CATALOGUE_IMAGE}
        width={640}
      />
      <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-foreground">
        <button
          className={cn(pressable, "min-h-11 bg-background px-3")}
          onClick={() => onSelect(category.id)}
          type="button"
        >
          {category.name}
        </button>
      </h3>
    </article>
  );
}

function ShopRows({
  rows,
  onSelect,
}: {
  rows: readonly {
    id: string;
    name: string;
    lots: readonly CatalogueLot[];
  }[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {rows.map((row) => (
        <div className="flex flex-col gap-3" key={row.id}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-foreground">{row.name}</h3>
            <Button
              className="min-h-11"
              onClick={() => onSelect(row.id)}
              size="md"
              type="button"
              variant="outline"
            >
              View {row.name}
            </Button>
          </div>
          <ul className="flex max-w-full gap-3 overflow-x-auto">
            {row.lots.slice(0, 4).map((lot) => (
              <li className="w-36 shrink-0" key={lot.id}>
                <img
                  alt={lot.imageAlt}
                  className="aspect-square w-full rounded-md object-cover"
                  height={144}
                  loading="lazy"
                  src={CATALOGUE_IMAGE}
                  width={144}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FilterChoices({
  categories,
  selectedId,
  onSelect,
}: {
  categories: readonly { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {categories.map((category) => {
        const selected = selectedId === category.id;
        return (
          <li className="shrink-0" key={category.id}>
            <Button
              aria-pressed={selected}
              className="min-h-11"
              onClick={() => onSelect(selected ? null : category.id)}
              size="md"
              type="button"
              variant={selected ? "default" : "outline"}
            >
              {category.name}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function ListCard({
  lot,
  watched,
  onToggle,
}: {
  lot: CatalogueLot;
  watched: boolean;
  onToggle: () => void;
}) {
  return (
    <AuctionLotCard
      heading
      lot={lot}
      onToggle={onToggle}
      watched={watched}
    />
  );
}

type AuctionCataloguePageProps = {
  lots: readonly CatalogueLot[];
};

function AuctionCataloguePage({ lots }: AuctionCataloguePageProps) {
  const ordered = useMemo(() => byCatalogueOrder(lots), [lots]);
  const live = ordered.filter((lot) => lot.status !== "Ended");
  const featured = live.slice(0, FEATURED_CAP);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());

  const categories = useMemo(() => {
    const seen = new Map<string, { id: string; name: string; cover: CatalogueLot; lots: CatalogueLot[] }>();
    for (const lot of ordered) {
      if (lot.status === "Ended") continue;
      const current = seen.get(lot.categoryId);
      if (current) {
        current.lots.push(lot);
      } else {
        seen.set(lot.categoryId, {
          id: lot.categoryId,
          name: lot.category,
          cover: lot,
          lots: [lot],
        });
      }
    }
    return [...seen.values()];
  }, [ordered]);

  const busy = live.length >= LIVE_CAP && categories.length >= 2;
  const quietTiles = !busy && categories.length >= 2 && categories.length <= 4;
  const listed = selectedId
    ? ordered.filter((lot) => lot.categoryId === selectedId)
    : ordered;
  const selected = categories.find((category) => category.id === selectedId);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = CATALOGUE_TITLE;

    const description = document.createElement("meta");
    description.name = "description";
    description.content = CATALOGUE_DESCRIPTION;
    description.dataset.auctionCatalogue = "";
    document.head.append(description);

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = CATALOGUE_CANONICAL;
    canonical.dataset.auctionCatalogue = "";
    document.head.append(canonical);

    return () => {
      document.title = previousTitle;
      description.remove();
      canonical.remove();
    };
  }, []);

  const jsonLd =
    selectedId === null && ordered.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: ordered.map((lot, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Thing",
              name: lot.title,
              url: lotAddress(lot),
              image: CATALOGUE_IMAGE,
              description: `${lot.status}. Closes ${lot.closeLabel}. Current bid ${lot.bidLabel}.`,
            },
          })),
        }
      : null;

  function toggleWatch(id: string) {
    setWatched((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <Toast position="bottom-right" />
      {jsonLd ? (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
      ) : null}
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <h1 className="text-3xl font-semibold leading-9 text-foreground sm:text-4xl">
          Auctions
        </h1>

        {featured.length > 0 ? (
          <div className="mt-8">
            <FeaturedAuctions
              lots={featured}
              onToggle={toggleWatch}
              watched={watched}
            />
          </div>
        ) : null}

        {busy ? (
          <section
            aria-labelledby="auction-categories"
            className="mt-12 min-w-0"
          >
            <h2
              className="mb-4 text-2xl font-semibold text-foreground"
              id="auction-categories"
            >
              Categories
            </h2>
            {categories.length <= 3 ? (
              <CategoryTiles
                categories={categories}
                layout="bella"
                onSelect={setSelectedId}
              />
            ) : (
              <ShopRows onSelect={setSelectedId} rows={categories} />
            )}
          </section>
        ) : null}

        <div
          className={cn(
            "mt-12",
            busy && "grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]",
          )}
        >
          {busy ? (
            <aside aria-labelledby="auction-filter" className="min-w-0">
              <h2
                className="mb-4 text-2xl font-semibold text-foreground"
                id="auction-filter"
              >
                Filter
              </h2>
              <FilterChoices
                categories={categories}
                onSelect={setSelectedId}
                selectedId={selectedId}
              />
            </aside>
          ) : null}
          <section aria-labelledby="all-auctions" className="min-w-0">
            <h2
              className="text-2xl font-semibold text-foreground"
              id="all-auctions"
            >
              All auctions
            </h2>
            {selected ? (
              <p className="mt-2 text-base text-foreground">
                {selected.name}
                <Button
                  className="ml-2 min-h-11"
                  onClick={() => setSelectedId(null)}
                  size="md"
                  type="button"
                  variant="ghost"
                >
                  Clear {selected.name}
                </Button>
              </p>
            ) : null}
            {listed.length === 0 ? (
              <p className="mt-4 max-w-prose text-base text-foreground">
                There are no auctions.
              </p>
            ) : (
              <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {quietTiles ? (
                  <li className="sm:col-span-2 lg:col-span-1">
                    <CategoryTiles
                      categories={categories}
                      layout="tiles"
                      onSelect={setSelectedId}
                    />
                  </li>
                ) : null}
                {listed.map((lot) => (
                  <li key={lot.id}>
                    <ListCard
                      lot={lot}
                      onToggle={() => toggleWatch(lot.id)}
                      watched={watched.has(lot.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

export { AuctionCataloguePage };
