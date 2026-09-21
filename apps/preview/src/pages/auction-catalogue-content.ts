/** Stand-in lots for the Auction list page stories. The cards are a fixed
 * draw from the collection list, so a story does not change between loads.
 * The list has no prices, so the bids are starting prices for the preview
 * only.
 */

export const CATALOGUE_IMAGE = new URL("./product.fixture.png", import.meta.url)
  .href;

export const CATALOGUE_TITLE = "Auctions | Grade10";

export const CATALOGUE_DESCRIPTION =
  "Live and upcoming auctions, soonest to close first, and lots that have ended.";

export const CATALOGUE_CANONICAL = "https://grade10.com/auction";

export type CatalogueStatus = "Active" | "Upcoming" | "Ended";

export type CatalogueLot = {
  id: string;
  slug: string;
  title: string;
  status: CatalogueStatus;
  categoryId: string;
  category: string;
  /** ISO 8601. Upcoming lots order by this. */
  startsAt: string;
  /** ISO 8601. Active lots order by this; Ended lots by the latest first. */
  closesAt: string;
  closeLabel: string;
  bidLabel: string;
  imageAlt: string;
};

function lot(
  partial: Pick<CatalogueLot, "id" | "title" | "status" | "closesAt"> &
    Partial<CatalogueLot> &
    Pick<CatalogueLot, "categoryId" | "category">,
): CatalogueLot {
  return {
    slug: partial.slug ?? partial.id,
    startsAt: partial.startsAt ?? partial.closesAt,
    closeLabel: partial.closeLabel ?? partial.closesAt.slice(0, 16).replace("T", " "),
    bidLabel: partial.bidLabel ?? "HK$1,200.00",
    imageAlt: partial.imageAlt ?? partial.title,
    ...partial,
  };
}

/**
 * Fifteen lots drawn once from the collection list, spread across the
 * categories that list actually names.
 */
const COLLECTION: readonly {
  cert: string;
  title: string;
  imageAlt: string;
  categoryId: string;
  category: string;
}[] = [
  {
    cert: "116339449",
    title: "Zombie Hamburglar · PSA 9",
    imageAlt: "2025 McDonald's A Minecraft Movie collectible card, Zombie Hamburglar, PSA 9",
    categoryId: "minecraft",
    category: "Minecraft",
  },
  {
    cert: "82397796",
    title: "Belle — Strange but Special, Enchanted · PSA 10",
    imageAlt: "2023 Disney Lorcana The First Chapter #214 Belle — Strange but Special, Enchanted, PSA 10",
    categoryId: "lorcana",
    category: "Lorcana",
  },
  {
    cert: "114001914",
    title: "Full Art Reshiram · PSA 10",
    imageAlt: "2021 Pokémon Japanese Promo 25th Anniversary #020 Full Art Reshiram, PSA 10",
    categoryId: "pokemon",
    category: "Pokémon",
  },
  {
    cert: "124585253",
    title: "Heung-min Son · PSA 10",
    imageAlt: "2024-25 Panini Prizm Premier League Manga #2 Heung-min Son, PSA 10",
    categoryId: "sports",
    category: "Sports",
  },
  {
    cert: "92181213",
    title: "Trafalgar Law, Manga Alternate Art · PSA 10",
    imageAlt: "2023 One Piece Japanese OP05 #069 Trafalgar Law, Manga Alternate Art, PSA 10",
    categoryId: "one-piece",
    category: "One Piece",
  },
  {
    cert: "122774187",
    title: "Aya — Childhood · PSA 10",
    imageAlt: "2025 Louis Vuitton x Murakami #036 Aya — Childhood, PSA 10",
    categoryId: "louis-vuitton",
    category: "Louis Vuitton",
  },
  {
    cert: "90774695",
    title: "Mai Shiranui, Gold Signature · PSA 10",
    imageAlt: "2023 Weiss Schwarz King of Fighters #34 Mai Shiranui, Gold Signature, PSA 10",
    categoryId: "weiss",
    category: "Weiss Schwarz",
  },
  {
    cert: "116858030",
    title: "Birdie Wings · PSA 8",
    imageAlt: "2025 McDonald's A Minecraft Movie collectible card, Birdie Wings, PSA 8",
    categoryId: "minecraft",
    category: "Minecraft",
  },
  {
    cert: "84409084",
    title: "Kronk — Right-Hand Man · PSA 10",
    imageAlt: "2023 Disney Lorcana The First Chapter #183 Kronk — Right-Hand Man, PSA 10",
    categoryId: "lorcana",
    category: "Lorcana",
  },
  {
    cert: "74635921",
    title: "Pidgey · PSA 10",
    imageAlt: "1997 Pocket Monsters Carddass #016 Pidgey, PSA 10",
    categoryId: "pokemon",
    category: "Pokémon",
  },
  {
    cert: "127813497",
    title: "Daniel · PSA 9",
    imageAlt: "2012 Topps Allen & Ginter People of the Bible #PB-6 Daniel, PSA 9",
    categoryId: "sports",
    category: "Sports",
  },
  {
    cert: "116074010",
    title: "Sanji · PSA 10",
    imageAlt: "2024 One Piece English 1st Anniversary Set #013 Sanji, PSA 10",
    categoryId: "one-piece",
    category: "One Piece",
  },
  {
    cert: "119777886",
    title: "Zoom on the Colorful Monogram · PSA 10",
    imageAlt: "2025 Louis Vuitton x Murakami #019 Zoom on the Colorful Monogram, PSA 10",
    categoryId: "louis-vuitton",
    category: "Louis Vuitton",
  },
  {
    cert: "101445655",
    title: '"Mage" Frieren, Gold Signature · PSA 10',
    imageAlt: '2023 Weiss Schwarz Frieren trial deck #T11 "Mage" Frieren, Gold Signature, PSA 10',
    categoryId: "weiss",
    category: "Weiss Schwarz",
  },
  {
    cert: "116339448",
    title: "Fry Helmet · PSA 9",
    imageAlt: "2025 McDonald's A Minecraft Movie collectible card, Fry Helmet, PSA 9",
    categoryId: "minecraft",
    category: "Minecraft",
  },
];

/** Every drawn lot, live. Fifteen lots across seven categories: shop rows and the filter. */
export const COLLECTION_LOTS: CatalogueLot[] = COLLECTION.map((item, index) => {
  const day = index + 1;
  return lot({
    id: item.cert,
    title: item.title,
    imageAlt: item.imageAlt,
    status: "Active",
    categoryId: item.categoryId,
    category: item.category,
    closesAt: `2026-10-${String(day).padStart(2, "0")}T18:00:00+08:00`,
    closeLabel: `${day} Oct 2026, 6:00 pm`,
    bidLabel: `HK$${(1200 + index * 350).toLocaleString("en-HK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  });
});

function withStatus(
  source: CatalogueLot,
  status: CatalogueStatus,
  schedule?: Pick<CatalogueLot, "startsAt" | "closesAt" | "closeLabel">,
): CatalogueLot {
  return { ...source, status, ...schedule };
}

/** One live lot, then two closed lots from the same draw. */
export const ONE_FEATURED_LOTS: CatalogueLot[] = [
  COLLECTION_LOTS[0],
  withStatus(COLLECTION_LOTS[1], "Ended"),
  withStatus(COLLECTION_LOTS[2], "Ended"),
];

/** The Minecraft lots only: a short featured row, and no category chrome. */
export const FEW_FEATURED_LOTS: CatalogueLot[] = [
  COLLECTION_LOTS[0],
  COLLECTION_LOTS[7],
  withStatus(COLLECTION_LOTS[14], "Upcoming", {
    startsAt: "2026-10-20T10:00:00+08:00",
    closesAt: "2026-10-24T18:00:00+08:00",
    closeLabel: "24 Oct 2026, 6:00 pm",
  }),
];

/** The whole draw. Seven live categories, so the page is busy. */
export const BUSY_MANY_LOTS: CatalogueLot[] = COLLECTION_LOTS;

/** Six live lots across Lorcana, Pokémon, and One Piece: tiles, no filter. */
export const QUIET_TILE_LOTS: CatalogueLot[] = [
  COLLECTION_LOTS[1],
  COLLECTION_LOTS[8],
  COLLECTION_LOTS[2],
  COLLECTION_LOTS[9],
  COLLECTION_LOTS[4],
  COLLECTION_LOTS[11],
];

/** Closed lots only. Featured stays off, and so does watch. */
export const ENDED_ONLY_LOTS: CatalogueLot[] = [
  withStatus(COLLECTION_LOTS[1], "Ended"),
  withStatus(COLLECTION_LOTS[2], "Ended"),
];

