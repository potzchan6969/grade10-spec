import type {
  CollectionOption,
  FilterGroup,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "./types";

/* Grade10's own catalog content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const SORT_OPTIONS: SortOption[] = [
  { id: "popular", label: "Popular" },
  { id: "new", label: "New" },
  { id: "price-desc", label: "Price", toggleId: "price-asc" },
];

const CHIP_FILTERS: FilterGroup[] = [
  {
    id: "product-type",
    label: "Type",
    options: [
      { id: "pack", label: "Pack" },
      { id: "box", label: "Box" },
    ],
  },
];

const SELECT_FILTERS: FilterGroup[] = [
  {
    id: "series",
    label: "Series",
    options: [
      { id: "all", label: "All Series" },
      { id: "m4", label: "M4" },
      { id: "m10", label: "M10" },
    ],
  },
];

const COLLECTIONS: CollectionOption[] = [
  { id: "all", label: "All Collections" },
  { id: "pokemon", label: "Pokémon" },
  { id: "dragon-ball", label: "Dragon Ball" },
  { id: "one-piece", label: "One Piece" },
  { id: "disney", label: "Disney" },
  { id: "nba", label: "NBA" },
  { id: "mlb", label: "MLB" },
  { id: "formula-1", label: "Formula 1" },
];

const UTILITY_LINKS: UtilityLink[] = [
  { label: "Help", href: "#help" },
  { label: "Shipping", href: "#shipping" },
  { label: "Orders & Returns", href: "#orders" },
];

const PRODUCTS: ProductSummary[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  name: "Ninja Spinner",
  tags: ["Pokémon", "M4", "JP"],
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  price: "HKD 105",
  originalPrice: "HKD 123",
  discountLabel: "SALE",
  ariaLabel: `Ninja Spinner, item ${index + 1}`,
  actionLabel: "Add to cart",
  addedToCart: index === 0,
  quantity: index === 0 ? 3 : 1,
  soldOut: index === 7,
}));

const SELECTION = {
  "product-type": ["box"],
};

const PAGINATION_LABELS = {
  previousLabel: "Prev",
  nextLabel: "Next",
  paginationLabel: "Pagination",
  morePagesLabel: "More pages",
};

export {
  CHIP_FILTERS,
  COLLECTIONS,
  IMAGE,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECT_FILTERS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
};
