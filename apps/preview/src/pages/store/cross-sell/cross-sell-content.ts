import type { ProductSummary } from "@grade10/ui";

const IMAGE = new URL("../../product.fixture.png", import.meta.url).href;

/** Words for the rail under a card, not yet in `@grade10/i18n`. */
const CROSS_SELL_RAIL_COPY = {
  heading: "You may also like",
  card: { soldOut: "SOLD OUT", sale: "SALE" },
};

/** The workbench's note where the page draws no rail at all. */
const CROSS_SELL_NO_RAIL_NOTE = "No rail: nothing to show.";

function card(
  id: string,
  name: string,
  extra: Partial<ProductSummary> = {},
): ProductSummary {
  return {
    id,
    name,
    imageSrc: IMAGE,
    imageAlt: name,
    price: "HK$780",
    ...extra,
  };
}

/** Cards the stock keeper chose to show with the card. */
const CHOSEN_PICKS: ProductSummary[] = [
  card("pick-1", "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)"),
  card("pick-2", "Pokémon TCG Sealed Booster Box – Storm Emeralda (M6)", {
    originalPrice: "HK$820",
  }),
  card("pick-3", "Pokémon TCG Sealed Booster Box – Mega Dream (M3)", {
    price: "HK$690",
  }),
];

/** The same picks with the first one sold out. */
const CHOSEN_SOLD_OUT: ProductSummary[] = [
  { ...CHOSEN_PICKS[0], soldOut: true },
  CHOSEN_PICKS[1],
  CHOSEN_PICKS[2],
];

/** Cards like the one being read, by its world, language and type. */
const SIMILAR_CARDS: ProductSummary[] = [
  card("similar-1", "Pokémon TCG Elite Trainer Box – Abyss Eye (M5)", {
    price: "HK$320",
  }),
  card("similar-2", "Pokémon TCG Booster Pack – Abyss Eye (M5)", {
    price: "HK$28",
  }),
  card("similar-3", "Pokémon TCG Sealed Booster Box – Shadow Lore (M2)", {
    price: "HK$600",
  }),
];

/** The stock keeper changed the picks: the rail shows the new ones. */
const CHANGED_PICKS: ProductSummary[] = [
  card("changed-1", "Pokémon TCG Sealed Booster Box – Dream Ocean (M7)"),
  card("changed-2", "Pokémon TCG Sealed Booster Box – Dark Sky (M8)"),
];

export {
  CHANGED_PICKS,
  CHOSEN_PICKS,
  CHOSEN_SOLD_OUT,
  CROSS_SELL_NO_RAIL_NOTE,
  CROSS_SELL_RAIL_COPY,
  SIMILAR_CARDS,
};
