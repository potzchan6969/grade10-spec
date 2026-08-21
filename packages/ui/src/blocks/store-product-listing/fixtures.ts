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
      { id: "formula-1", label: "Formula 1", count: "6" },
      { id: "manga-anime", label: "Manga & Anime", count: "9" },
      { id: "music", label: "Music", count: "10" },
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
      { id: "graded-music", label: "Graded Music", count: "0" },
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
  name: "Ninja Spinner",
  badges: PRODUCT_BADGES,
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  price: "HKD 105",
  originalPrice: index === 0 ? "HKD 123" : undefined,
  saleLabel: index === 0 ? "SALE" : undefined,
  ariaLabel: `Ninja Spinner, item ${index + 1}`,
  cartLabel: "Add to cart",
  inCart: index === 0,
  cartCount: index === 0 ? "1" : undefined,
  soldOut: index === 7,
  soldOutLabel: index === 7 ? "SOLD OUT" : undefined,
}));

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
  PRODUCT_BADGES,
  PRODUCTS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
};
