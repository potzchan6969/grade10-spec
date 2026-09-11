import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import type {
  AppliedFilter,
  FilterGroup,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "@grade10/ui";
import { createElement, type ReactNode } from "react";

/* Content this workbench owns, exactly as a store application owns its own.
 * None of it lives in `@grade10/ui` or `@grade10/design-system`: both packages
 * require it to be supplied, so a second store cannot inherit Grade10's. */

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

/** The workbench has every surface and navigates to none of them. */
const noop = () => {};

const NAV_LOGO: ReactNode = createElement(G10LogoMono, {
  className: "h-7 w-auto",
});
const FOOTER_LOGO: ReactNode = createElement(G10LogoMono, {
  className: "h-5 w-auto",
});

const STORE_NAV = {
  copy: { locale: "HKD" },
  promo: "PROMO UTILITY BAR",
  logo: NAV_LOGO,
  logoHref: "/",
  locales: [
    { value: "HK", label: "HKD" },
    { value: "KR", label: "KRW" },
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
  copy: {
    description:
      "Japanese trading cards selected for collectors, openers, and complete-set builders.",
    attribution: "A division of MemeStrategy (HKEX: 2440)",
    copyright: "© 2026 Grade10. All rights reserved.",
    locale: "HONG KONG / HKD",
  },
  logo: FOOTER_LOGO,
  logoHref: "/",
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

const FILTER_GROUPS_EXPANDED: FilterGroup[] = [
  {
    id: "worlds",
    label: "Worlds",
    compactLabel: "World",
    options: ALL_WORLD_OPTIONS.map((option) => ({ ...option })),
  },
  FILTER_GROUPS[1],
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
  name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$105",
  originalPrice: index === 0 ? "HK$123" : undefined,
  soldOut: index === 7,
}));

const INITIAL_SELECTION: FilterSelection = {
  worlds: ["pokemon"],
  types: ["booster-box"],
};

const STORE_HOME_HERO = {
  copy: {
    eyebrow: "GRADE10",
    shopLabel: "Shop",
    auctionLabel: "Auction",
  },
  title: "Marketplace",
  description:
    "Et convallis massa risus habitant amet vitae commodo. Est etiam nunc ornare hendrerit felis nulla pulvinar non pellentesque. Quam nibh imperdiet fringilla quam ac rutrum nec mattis justo.",
  imageSrc: new URL("./store-home-hero.fixture.png", import.meta.url).href,
};

const STORE_HOME_COLLECTIONS = [
  {
    id: "pokemon",
    label: "Pokémon",
    icon: "🐭",
    href: "#pokemon",
    featured: true,
  },
  { id: "dragon-ball", label: "Dragon Ball", icon: "🐉", href: "#dragon-ball" },
  { id: "one-piece", label: "One Piece", icon: "🏴‍☠️", href: "#one-piece" },
  { id: "nba", label: "NBA", icon: "🏀", href: "#nba" },
  { id: "disney", label: "Disney", icon: "🏰", href: "#disney" },
  { id: "mlb", label: "MLB", icon: "⚾", href: "#mlb" },
  { id: "formula-1", label: "Formula 1", icon: "🏎️", href: "#formula-1" },
] as const;

const STORE_HOME_SECTION_COPY = {
  collections: { browseAll: "Browse all" },
  products: { browseAll: "Browse all" },
};

const STORE_HOME_PRODUCTS: ProductSummary[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: String(index + 1),
    name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    price: "HK$105",
    originalPrice: index === 0 ? "HK$123" : undefined,
  }),
);

const STORE_HOME_PRODUCT_CARD_COPY = {
  cart: "Add to cart",
  decreaseQuantity: "Decrease quantity",
  increaseQuantity: "Increase quantity",
  removeFromCart: "Remove from cart",
  adjustQuantity: "Adjust cart quantity",
  sale: "SALE",
};

/** Cart drawer copy owned by the workbench the same way nav and footer copy are. */
const STORE_CART_COPY = {
  header: {
    title: "Cart",
    closeCartLabel: "Close cart",
  },
  item: {
    lowStockWarning: "Low stock. Quantity adjusted",
    soldOutLabel: "Sold Out",
    removeItemLabel: "Remove item",
    decreaseQtyLabel: "Decrease quantity",
    increaseQtyLabel: "Increase quantity",
  },
  footer: {
    subtotalLabel: "Subtotal",
    shippingLabel: "Shipping",
    shippingValue: "Calculated at checkout",
    estimatedTotalLabel: "Estimated Total",
    usePromoCode: "Promo code",
    selectOrEnterPromoCode: "Select or enter code",
    promoSheetTitle: "Promo code",
    promoSheetBackLabel: "Back",
    applyPromo: "Apply",
    promoPlaceholder: "Enter promo code",
    removePromo: "Remove",
    yourPromoCodes: "Your promo codes",
    notValidPromoCodes: "Not valid for this order",
    noHeldPromoCodes: "You don’t have any promo codes yet.",
    browseLoyaltyOffers: "Browse loyalty offers",
    applyHeldPromo: "Apply",
    usePoints: "Use points",
    applyPoints: "Apply",
    pointsPlaceholder: "0",
    pointsUnit: "pt",
    useMaxPoints: "Use max",
    pointsRateLabel: "1 pt = HK$1",
    removePoints: "Remove",
    pointsLabel: "Points",
    checkoutButton: "Proceed to Checkout",
    checkoutRedirecting: "Redirecting...",
    checkoutFailed: "Couldn’t open checkout",
  },
  emptyTitle: "Your cart is empty",
  emptyDescription: "Items you add will appear here",
  unavailableItemsRemoved: "Items removed from cart",
  unavailableItemsRemovedDescription: "Some products are no longer available",
};

export {
  appliedFiltersFromSelection,
  FILTER_GROUPS,
  FILTER_GROUPS_EXPANDED,
  INITIAL_SELECTION,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_CART_COPY,
  STORE_FOOTER,
  STORE_HOME_COLLECTIONS,
  STORE_HOME_HERO,
  STORE_HOME_PRODUCT_CARD_COPY,
  STORE_HOME_PRODUCTS,
  STORE_HOME_SECTION_COPY,
  STORE_NAV,
  sortTriggerLabel,
  UTILITY_LINKS,
};
