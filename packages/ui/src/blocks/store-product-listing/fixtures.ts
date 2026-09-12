import { Badge } from "@grade10/design-system/components/display/badge";
import { createElement, Fragment, type ReactNode } from "react";
import productImage from "./product.fixture.png";

import type {
  AppliedFilter,
  FilterGroup,
  ProductSummary,
  SearchSuggestionGroup,
  SortOption,
  UtilityLink,
} from "./types";

/* Grade10's own catalog content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const IMAGE = productImage;

const PRODUCT_BADGES: ReactNode = createElement(
  Fragment,
  null,
  createElement(Badge, { size: "sm", variant: "outline" }, "Pokémon"),
  createElement(Badge, { size: "sm", variant: "outline" }, "M4"),
  createElement(Badge, { size: "sm", variant: "outline" }, "JP"),
);

const SORT_OPTIONS: SortOption[] = [
  { id: "new", label: "Latest product", shortLabel: "Latest" },
  { id: "price-asc", label: "Lowest price", shortLabel: "Lowest" },
  { id: "price-desc", label: "Highest price", shortLabel: "Highest" },
];

const ALL_WORLD_OPTIONS = [
  { id: "pokemon", label: "Pokémon", count: "51" },
  { id: "shohei-ohtani", label: "Shohei Ohtani", count: "15" },
  { id: "music", label: "Music", count: "10" },
  { id: "manga-anime", label: "Manga & Anime", count: "9" },
  { id: "formula-1", label: "Formula 1", count: "6" },
  { id: "one-piece", label: "One Piece", count: "4" },
  { id: "disney", label: "Disney", count: "3" },
  { id: "sports", label: "Sports", count: "2" },
] as const;

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "worlds",
    label: "Worlds",
    compactLabel: "World",
    expandLabel: "See all worlds",
    options: ALL_WORLD_OPTIONS.slice(0, 5).map((option) => ({ ...option })),
  },
  {
    id: "types",
    label: "Types",
    compactLabel: "Type",
    options: [
      { id: "booster-box", label: "Booster Box", count: "24" },
      { id: "special-box", label: "Special Box", count: "6" },
      { id: "graded-card", label: "Graded Card", count: "19" },
      { id: "graded-magazine", label: "Graded Magazine", count: "16" },
      { id: "original-art", label: "Original Art", count: "14" },
      { id: "graded-music", label: "Graded Music", count: "10" },
      { id: "collectibles", label: "Collectibles", count: "6" },
      { id: "graded-manga", label: "Graded Manga", count: "5" },
    ],
  },
];

/** Full worlds list after “See all worlds” / filter-drawer open. */
const FILTER_GROUPS_EXPANDED: FilterGroup[] = [
  {
    id: "worlds",
    label: "Worlds",
    compactLabel: "World",
    collapseLabel: "Show less",
    options: ALL_WORLD_OPTIONS.map((option) => ({ ...option })),
  },
  FILTER_GROUPS[1],
];

const UTILITY_LINKS: UtilityLink[] = [
  { label: "Help", href: "#help" },
  { label: "Shipping", href: "#shipping" },
  { label: "Orders & Returns", href: "#orders" },
];

const PRODUCTS: ProductSummary[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  name: `Pokémon TCG Sealed Booster Box – Abyss Eye (M5), item ${index + 1}`,
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$105",
  originalPrice: "HK$123",
  inCart: index === 0,
  cartCount: index === 0 ? "1" : undefined,
  soldOut: index === 7,
}));

/** What every tile says the same way, whichever product it holds. */
const PRODUCT_CARD_CART_COPY = {
  cart: "Add to cart",
  decreaseQuantity: "Decrease quantity",
  increaseQuantity: "Increase quantity",
  removeFromCart: "Remove from cart",
  adjustQuantity: "Adjust cart quantity",
  soldOut: "SOLD OUT",
  sale: "SALE",
} as const;

const LISTING_COPY = {
  card: PRODUCT_CARD_CART_COPY,
};

const SELECTION = {
  worlds: ["pokemon"],
  types: ["booster-box"],
};

const APPLIED_FILTERS: AppliedFilter[] = [
  { groupId: "worlds", optionId: "pokemon", label: "Pokémon" },
  { groupId: "types", optionId: "booster-box", label: "Booster Box" },
];

/** Fixture hits for the listing search suggestion panel. */
const SEARCH_SUGGESTIONS: SearchSuggestionGroup[] = [
  {
    id: "products",
    label: "Products",
    suggestions: [
      {
        id: "1",
        label: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), item 1",
        imageSrc: IMAGE,
        imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      },
      {
        id: "2",
        label: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), item 2",
        imageSrc: IMAGE,
        imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      },
    ],
  },
  {
    id: "filters",
    label: "Filters",
    suggestions: [
      {
        id: "worlds:pokemon",
        label: "Pokémon",
        trailing: createElement(
          Badge,
          { size: "sm", variant: "outline" },
          "World",
        ),
      },
      {
        id: "types:booster-box",
        label: "Booster Box",
        trailing: createElement(
          Badge,
          { size: "sm", variant: "outline" },
          "Type",
        ),
      },
    ],
  },
];

export {
  APPLIED_FILTERS,
  FILTER_GROUPS,
  FILTER_GROUPS_EXPANDED,
  IMAGE,
  LISTING_COPY,
  PRODUCT_BADGES,
  PRODUCT_CARD_CART_COPY,
  PRODUCTS,
  SEARCH_SUGGESTIONS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
};
