import type {
  AppliedFilter,
  FilterGroup,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "./types";

/* Grade10's own catalog content, for the examples only. A consumer supplies
 * its own; nothing here is a default. */

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

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
  worlds: ["pokemon"],
  types: ["booster-box"],
};

const APPLIED_FILTERS: AppliedFilter[] = [
  { groupId: "worlds", optionId: "pokemon", label: "Pokémon" },
  { groupId: "types", optionId: "booster-box", label: "Booster Box" },
];

const PAGINATION_LABELS = {
  previousLabel: "Prev",
  nextLabel: "Next",
  paginationLabel: "Pagination",
  morePagesLabel: "More pages",
};

export {
  APPLIED_FILTERS,
  FILTER_GROUPS,
  IMAGE,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
};
