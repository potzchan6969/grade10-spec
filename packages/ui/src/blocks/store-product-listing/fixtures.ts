import { Badge } from "@grade10/design-system/components/display/badge";
import { createElement, Fragment, type ReactNode } from "react";
import productImage from "./product.fixture.png";

import type {
  AppliedFilter,
  FilterGroup,
  ProductSummary,
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
  { id: "popular", label: "Popularity" },
  { id: "new", label: "Latest product" },
  { id: "price-asc", label: "Lowest price" },
  { id: "price-desc", label: "Highest price" },
];

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "worlds",
    label: "Worlds",
    expandLabel: "See all worlds",
    options: [
      { id: "pokemon", label: "Pokémon", count: "51" },
      { id: "shohei-ohtani", label: "Shohei Ohtani", count: "15" },
      { id: "music", label: "Music", count: "10" },
      { id: "manga-anime", label: "Manga & Anime", count: "9" },
      { id: "formula-1", label: "Formula 1", count: "6" },
    ],
  },
  {
    id: "types",
    label: "Types",
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

export {
  APPLIED_FILTERS,
  FILTER_GROUPS,
  IMAGE,
  LISTING_COPY,
  PRODUCT_BADGES,
  PRODUCT_CARD_CART_COPY,
  PRODUCTS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
};
