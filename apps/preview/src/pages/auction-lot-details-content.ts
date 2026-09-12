import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import {
  DEFAULT_LISTING_EXTENSION_POLICY,
  extendRecordedCloseAt,
  formatAutoExtendedTooltip,
  type ListingBidHistoryRow,
  type ListingLotMetaBadge,
  shouldExtendCloseAt,
} from "@grade10/ui";
import { createElement } from "react";
import {
  type AuctionTiming,
  BID_FIXTURE_LOT,
  type BiddingState,
  bidHistoryForState,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
  type LiveListingFacts,
  stateMeta,
} from "../auction-listing/listing-auction-bid-fixtures";

export {
  type AuctionTiming,
  auctionHeaderLabel,
  BIDDING_STATE_LABELS,
  type BiddingState,
  type BidMode,
  bidHistoryForState,
  bidModeForState,
  buildListingAuctionBidView,
  type LiveListingFacts,
  remainingSecondsUntil,
  stateMeta,
  userBidHistoryForState,
} from "../auction-listing/listing-auction-bid-fixtures";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

export const AUCTION_LOT_EXTENSION_POLICY = DEFAULT_LISTING_EXTENSION_POLICY;

export const LIVE_INITIAL_REMAINING_MS = (6 * 60 + 9) * 1000;

export function shouldExtendClose(
  closesAtMs: number,
  policy = AUCTION_LOT_EXTENSION_POLICY,
  nowMs = Date.now(),
): boolean {
  return shouldExtendCloseAt(closesAtMs, policy, nowMs);
}

export function extendRecordedClose(
  policy = AUCTION_LOT_EXTENSION_POLICY,
  nowMs = Date.now(),
): number {
  return extendRecordedCloseAt(policy, nowMs);
}

export function createLiveAuctionTiming(nowMs = Date.now()): AuctionTiming {
  return {
    closesAtMs: nowMs + LIVE_INITIAL_REMAINING_MS,
    extended: false,
  };
}

export function applyBidExtension(
  timing: AuctionTiming,
  policy = AUCTION_LOT_EXTENSION_POLICY,
  nowMs = Date.now(),
): AuctionTiming {
  if (!shouldExtendClose(timing.closesAtMs, policy, nowMs)) {
    return timing;
  }

  return {
    closesAtMs: extendRecordedClose(policy, nowMs),
    extended: true,
  };
}

export const AUCTION_LOT = {
  title: "1997 Pocket Monsters Carddass #000 Bandai Starters, PSA 10",
  listingNumber: "12",
  saleName: "September Slabs",
  category: "Pokémon",
  description:
    "Bandai Carddass checklist and starters slab from the Pocket Monsters set. Printed in 1997 for the early Bandai Carddass series, this PSA 10 example covers the starter trio and checklist art collectors look for when building a first-wave Japanese set. Surfaces stay sharp under the slab; corners and edges grade clean. A strong reference piece for Carddass-era Pokémon in top grade.",
  images: [
    {
      src: IMAGE,
      alt: "1997 Pocket Monsters Carddass #000 Bandai Starters, PSA 10, front",
    },
    {
      src: IMAGE,
      alt: "1997 Pocket Monsters Carddass #000 Bandai Starters, PSA 10, back",
    },
  ],
  ...BID_FIXTURE_LOT,
  currency: "HKD",
};

export const AUCTION_LOT_BADGES: readonly ListingLotMetaBadge[] = [
  { label: AUCTION_LOT.category },
  { label: "Bandai Starters" },
];

export const AUCTION_LOT_FACTS = [
  { label: "Year", value: "1997" },
  { label: "Set", value: "Pocket Monsters Carddass" },
  { label: "Grade", value: "PSA 10" },
  { label: "Cert number", value: "95109007" },
] as const;

/** Demo linked card — matches Auction Listing → Bid Panel → Ready. */
export const AUCTION_LOT_LINKED_PAYMENT_METHOD = {
  brand: "visa",
  maskedNumber: "•••• 4242",
} as const;

export function auctionLotShowsLinkedPaymentMethod(
  state: BiddingState,
): boolean {
  return state.startsWith("live");
}

const VIEWER_INITIALS = "john@example.com";

const noop = () => {};

const NAV_LOGO = createElement(G10LogoMono, {
  className: "h-5 w-auto @3xl:h-7",
});

/** Auction-first header fixtures for `SiteHeader`. No Store entrance, no cart. */
export const AUCTION_SITE_HEADER = {
  copy: {
    locale: "English",
    account: "Account",
    signIn: "Sign In",
    menu: "Menu",
    menuTitle: "Menu",
    language: "Language",
    accountMenuLabel: "Account",
    profile: "Profile",
    myAuctions: "My Auctions",
    signOut: "Sign out",
  },
  session: "signed-in" as const,
  promo: "PROMO UTILITY BAR",
  logo: NAV_LOGO,
  logoHref: "/",
  locales: [
    { value: "en", label: "English" },
    { value: "zh-Hant", label: "繁體中文" },
    { value: "zh-Hans", label: "简体中文" },
  ],
  locale: "en",
  utilityLinks: [],
  navItems: [
    { label: "Auction", href: "#auction", current: true },
    { label: "Store Locator", href: "#locator" },
  ],
  onLocaleChange: noop,
  onSignIn: noop,
  onProfile: noop,
  onMyAuctions: noop,
  onSignOut: noop,
};

/** @deprecated Prefer `AUCTION_SITE_HEADER` with `SiteHeader`. */
export const AUCTION_NAV = {
  copy: { locale: "English" },
  promo: AUCTION_SITE_HEADER.promo,
  logo: NAV_LOGO,
  logoHref: "/",
  locales: AUCTION_SITE_HEADER.locales,
  locale: "en",
  utilityLinks: [],
  navItems: AUCTION_SITE_HEADER.navItems,
  onLocaleChange: noop,
  onAccountClick: noop,
};

/** Preview stand-in for the Auctions catalogue (Auction Listing) destination. */
export const AUCTION_LISTING_HREF = "#auction";

export const AUCTION_LOT_DETAILS_COPY = {
  header: {
    auctionBreadcrumb: "Auctions",
    lotBreadcrumb: "Lot",
    watch: "Watch",
    watching: "Watching",
    watchAriaLabel: "Watch this lot",
    unwatchAriaLabel: "Unwatch this lot",
    watchedToast: {
      title: "Email alerts on for this lot",
      actionLabel: "View My Auctions",
    },
    unwatchedToast: {
      title: "Unwatched this lot",
      description: "Email alerts for this lot are off too.",
      actionLabel: "Undo",
    },
  },
  sidebar: {
    ...LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
    autoExtendedTooltip: formatAutoExtendedTooltip(
      AUCTION_LOT_EXTENSION_POLICY,
    ),
    aboutThisLot: "About this lot",
    vaultShipping: "Vault shipping",
    showMore: "Show more",
    showLess: "Show less",
  },
  vaultShippingBody:
    "Stored in Grade10 Vault. Ships from our facility within 1 business day of payment.",
  userBidHistory: {
    link: "Your bidding",
    title: "Your bidding",
    description:
      "We bid only as needed up to your maximum. If two people set the same maximum, the earlier one leads.",
    maximumsTab: "Your maximums",
    bidsTab: "Bid placed",
    maximumColumn: "Maximum",
    bidColumn: "Bid",
    time: "Time",
    emptyBids: "No bids placed for you yet.",
  },
};

const SIMULATED_RIVALS = [
  "sara@example.com",
  "nina@example.com",
  "tom@example.com",
] as const;

const MAX_RECENT_BIDS = 5;
/** Demo spacing so rapid simulate-next clicks still read as aged history. */
const DEMO_BID_STAGGER_MS = 2 * 60_000;

function withStaggeredAcceptedAt(
  rows: readonly ListingBidHistoryRow[],
  nowMs = Date.now(),
): ListingBidHistoryRow[] {
  return rows.map((row, index) => ({
    ...row,
    acceptedAtMs: nowMs - index * DEMO_BID_STAGGER_MS,
  }));
}

export function initialLiveListingFacts(state: BiddingState): LiveListingFacts {
  const meta = stateMeta(state);
  const history = bidHistoryForState(state);

  if (history.length > 0) {
    return {
      currentBidMinor: history[0].amountMinor,
      bidCount: meta.bidCount,
      hasBids: true,
    };
  }

  return {
    currentBidMinor: AUCTION_LOT.startingBidMinor,
    bidCount: meta.bidCount,
    hasBids: meta.hasBids,
  };
}

export type LiveBidSimulationOptions = {
  /** When set, a rival bid within this cap triggers an automatic viewer counter-bid. */
  viewerMaximumMinor?: number;
  viewerInitials?: string;
};

export function liveBidSimulationOptions(
  state: BiddingState,
): LiveBidSimulationOptions {
  if (state === "live-auto-leading") {
    return {
      viewerMaximumMinor: AUCTION_LOT.viewerMaximumMinor,
      viewerInitials: VIEWER_INITIALS,
    };
  }
  return {};
}

function randomRivalInitials(): string {
  return SIMULATED_RIVALS[Math.floor(Math.random() * SIMULATED_RIVALS.length)];
}

function viewerAutoCounterAmount(
  rivalAmountMinor: number,
  viewerMaximumMinor: number,
): number | null {
  const counterAmount = Math.min(
    rivalAmountMinor + AUCTION_LOT.incrementMinor,
    viewerMaximumMinor,
  );
  if (counterAmount <= rivalAmountMinor) return null;
  return counterAmount;
}

export function simulateNextLiveBid(
  history: readonly ListingBidHistoryRow[],
  facts: LiveListingFacts,
  options: LiveBidSimulationOptions = {},
): { history: ListingBidHistoryRow[]; facts: LiveListingFacts } {
  const viewerInitials = options.viewerInitials ?? VIEWER_INITIALS;
  const viewerMaximumMinor = options.viewerMaximumMinor;

  if (history.length === 0) {
    const rivalInitials = randomRivalInitials();
    const newBid: ListingBidHistoryRow = {
      id: `bid-sim-${Date.now()}`,
      initials: rivalInitials,
      amountMinor: AUCTION_LOT.startingBidMinor,
      acceptedAtMs: Date.now(),
    };

    return {
      history: withStaggeredAcceptedAt([newBid]),
      facts: {
        currentBidMinor: AUCTION_LOT.startingBidMinor,
        bidCount: 1,
        hasBids: true,
      },
    };
  }

  const top = history[0];
  const rivalAmount = top.amountMinor + AUCTION_LOT.incrementMinor;
  const rivalBid: ListingBidHistoryRow = {
    id: `bid-rival-${Date.now()}`,
    initials: randomRivalInitials(),
    amountMinor: rivalAmount,
    acceptedAtMs: Date.now(),
  };

  if (viewerMaximumMinor != null) {
    const counterAmount = viewerAutoCounterAmount(
      rivalAmount,
      viewerMaximumMinor,
    );
    if (counterAmount != null) {
      const viewerBid: ListingBidHistoryRow = {
        id: `bid-viewer-${Date.now()}`,
        initials: viewerInitials,
        amountMinor: counterAmount,
        acceptedAtMs: Date.now(),
        isViewer: true,
      };

      return {
        history: withStaggeredAcceptedAt(
          [viewerBid, rivalBid, ...history].slice(0, MAX_RECENT_BIDS),
        ),
        facts: {
          currentBidMinor: counterAmount,
          bidCount: facts.bidCount + 2,
          hasBids: true,
        },
      };
    }
  }

  return {
    history: withStaggeredAcceptedAt(
      [rivalBid, ...history].slice(0, MAX_RECENT_BIDS),
    ),
    facts: {
      currentBidMinor: rivalAmount,
      bidCount: facts.bidCount + 1,
      hasBids: true,
    },
  };
}
