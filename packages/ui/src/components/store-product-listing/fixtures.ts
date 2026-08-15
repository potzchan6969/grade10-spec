import type { FilterGroup, ProductSummary, SortOption } from "./types";

/* Grade10's own catalog content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const SORT_OPTIONS: SortOption[] = [
  { id: "popularity", label: "Popularity" },
  { id: "latest", label: "Latest deal" },
  { id: "price-drop", label: "Price drop" },
  { id: "price-asc", label: "Lowest price" },
  { id: "price-desc", label: "Highest price" },
];

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "product-type",
    label: "Product Type",
    options: [
      { id: "box", label: "Box", count: "19" },
      { id: "pack", label: "Pack", count: "19" },
    ],
  },
  {
    id: "collection",
    label: "Collection",
    options: [
      { id: "pokemon", label: "Pokémon", count: "38" },
      { id: "dragon-ball", label: "Dragon Ball", count: "38" },
      { id: "one-piece", label: "One Piece", count: "38" },
      { id: "disney", label: "Disney", count: "38" },
      { id: "nba", label: "NBA", count: "38" },
      { id: "mlb", label: "MLB", count: "38" },
      { id: "formula-1", label: "Formula 1", count: "38" },
    ],
  },
  {
    id: "sets",
    label: "Sets",
    options: [
      { id: "m4", label: "M4", count: "19" },
      { id: "m10", label: "M10", count: "19" },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    options: [
      { id: "in-stock", label: "In stock", count: "38" },
      { id: "low-stock", label: "Low stock", count: "10" },
      { id: "pre-order", label: "Pre-order", count: "10" },
    ],
  },
];

const PRODUCTS: ProductSummary[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  name: "Ninja Spinner",
  category: "POKÉMON",
  description: "M4, Japanese",
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  price: "HKD 105",
  originalPrice: "HKD 123",
  discountLabel: "−15%",
  ariaLabel: `Ninja Spinner, item ${index + 1}`,
  wishlistLabel: "Add to wishlist",
  actionLabel: "Add",
  addedToCart: index === 0,
  quantity: index === 0 ? 3 : 1,
  soldOut: index === 7,
}));

const SELECTION = {
  "product-type": ["box"],
  collection: ["pokemon"],
  sets: ["m4"],
  availability: ["in-stock"],
};

const PAGINATION_LABELS = {
  previousLabel: "Prev",
  nextLabel: "Next",
  paginationLabel: "Pagination",
  morePagesLabel: "More pages",
};

export {
  FILTER_GROUPS,
  IMAGE,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECTION,
  SORT_OPTIONS,
};
