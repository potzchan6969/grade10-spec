import type {
  CollectionOption,
  FilterGroup,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "@grade10/ui";
import type { ReactNode } from "react";

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

const M_SERIES_FILTER: FilterGroup = {
  id: "series",
  label: "Series",
  options: [
    { id: "all", label: "All Series" },
    { id: "m4", label: "M4" },
    { id: "m10", label: "M10" },
  ],
};

/** Pokémon and Dragon Ball share the M-prefixed series rung; others have none yet. */
function seriesFiltersForCollection(collectionId: string): FilterGroup[] {
  if (collectionId === "pokemon" || collectionId === "dragon-ball") {
    return [M_SERIES_FILTER];
  }
  return [];
}

function collectionLabel(
  collectionId: string,
  collections: readonly CollectionOption[],
): ReactNode {
  return (
    collections.find((collection) => collection.id === collectionId)?.label ??
    ""
  );
}

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
  soldOut: index === 7,
}));

const INITIAL_SELECTION = {};

const PAGINATION_LABELS = {
  previousLabel: "Prev",
  nextLabel: "Next",
  paginationLabel: "Pagination",
  morePagesLabel: "More pages",
};

export {
  CHIP_FILTERS,
  COLLECTIONS,
  collectionLabel,
  INITIAL_SELECTION,
  PAGINATION_LABELS,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_NAV,
  seriesFiltersForCollection,
  UTILITY_LINKS,
};
