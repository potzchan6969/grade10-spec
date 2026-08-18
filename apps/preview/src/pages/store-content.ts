import type { FilterGroup, ProductSummary, SortOption } from "@grade10/ui";

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
   * assembles the storefront the Figma nav draws — locale, account, wishlist,
   * cart. A store with fewer surfaces passes fewer and shows fewer. */
  onLocaleChange: noop,
  onAccountClick: noop,
  onWishlistClick: noop,
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
  soldOut: index === 7,
}));

const INITIAL_SELECTION = {
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
  CHIP_FILTERS,
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECT_FILTERS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_NAV,
};
