import type {
  AppliedFilter,
  FilterGroup,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "@grade10/ui";

/* Content this workbench owns, exactly as a store application owns its own.
 * None of it lives in `@grade10/ui` or `@grade10/design-system`: both packages
 * require it to be supplied, so a second store cannot inherit Grade10's. */

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

/** The workbench has every surface and navigates to none of them. */
const noop = () => {};

const STORE_NAV = {
  promo: "PROMO UTILITY BAR",
  logo: "Grade10",
  localeLabel: "Hong Kong (HKD)",
  locales: [
    { value: "HK", label: "Hong Kong (HKD)" },
    { value: "KR", label: "South Korea (KRW)" },
  ],
  locale: "HK",
  utilityLinks: [],
  navItems: [
    { label: "Store", href: "#shop", current: true },
    { label: "Auction", href: "#auction" },
    { label: "Grade", href: "#grade" },
    { label: "Store Locator", href: "#locator" },
  ],
  /* A control renders only where a handler backs it, and this workbench
   * assembles the storefront the Figma nav draws — locale, account, cart.
   * A store with fewer surfaces passes fewer and shows fewer. */
  onLocaleChange: noop,
  onAccountClick: noop,
  onCartClick: noop,
};

const STORE_FOOTER = {
  logo: "Grade10 Marketplace",
  description:
    "Japanese trading cards selected for collectors, openers, and complete-set builders.",
  attribution: "A division of MemeStrategy (HKEX: 2440)",
  copyright: "© 2026 Grade10. All rights reserved.",
  locale: "HONG KONG / HKD",
  socialLinks: [
    { label: "INSTAGRAM", href: "#instagram" },
    { label: "YOUTUBE", href: "#youtube" },
    { label: "THREADS", href: "#threads" },
  ],
  legalLinks: [
    { label: "PRIVACY", href: "#privacy" },
    { label: "TERMS", href: "#terms" },
    { label: "SHIPPING", href: "#shipping" },
  ],
  columns: [
    {
      heading: "SHOP",
      links: [
        { label: "ALL COLLECTIONS", href: "#collections" },
        { label: "POKÉMON", href: "#pokemon" },
        { label: "DRAGON BALL", href: "#dragon-ball" },
        { label: "ONE PIECE", href: "#one-piece" },
      ],
    },
    {
      heading: "HELP",
      links: [
        { label: "ORDER STATUS", href: "#order-status" },
        { label: "SHIPPING & DELIVERY", href: "#shipping" },
        { label: "RETURNS & REFUNDS", href: "#returns" },
        { label: "CONTACT", href: "#contact" },
      ],
    },
    {
      heading: "LEGAL",
      links: [
        { label: "PRIVACY POLICY", href: "#privacy" },
        { label: "TERMS of SERVICE", href: "#terms" },
        { label: "ABOUT GRADE10", href: "#about" },
      ],
    },
  ],
};

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

function appliedFiltersFromSelection(
  groups: readonly FilterGroup[],
  selection: FilterSelection,
): AppliedFilter[] {
  const chips: AppliedFilter[] = [];
  for (const group of groups) {
    for (const optionId of selection[group.id] ?? []) {
      const option = group.options.find((item) => item.id === optionId);
      if (option) {
        chips.push({
          groupId: group.id,
          optionId: option.id,
          label: option.label,
        });
      }
    }
  }
  return chips;
}

function sortTriggerLabel(sortValue: string): string {
  const option = SORT_OPTIONS.find((item) => item.id === sortValue);
  return option ? `Sort by ${String(option.label).toLowerCase()}` : "Sort by";
}

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
  soldOut: index === 7,
}));

const INITIAL_SELECTION: FilterSelection = {
  worlds: ["pokemon"],
  types: ["booster-box"],
};

const PAGINATION_LABELS = {
  previousLabel: "Prev",
  nextLabel: "Next",
  paginationLabel: "Pagination",
  morePagesLabel: "More pages",
};

export {
  appliedFiltersFromSelection,
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PAGINATION_LABELS,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_NAV,
  sortTriggerLabel,
  UTILITY_LINKS,
};
