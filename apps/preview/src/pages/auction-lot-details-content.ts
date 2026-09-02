import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { createElement } from "react";
import {
  BID_FIXTURE_LOT,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
  bidHistoryForState,
  stateMeta,
  type AuctionTiming,
  type BiddingState,
  type LiveListingFacts,
} from "@grade10/ui";
import type { ListingBidHistoryRow, ListingLotMetaBadge } from "@grade10/ui";

export {
  BIDDING_STATE_LABELS,
  auctionHeaderLabel,
  bidHistoryForState,
  bidModeForState,
  buildListingAuctionBidView,
  remainingSecondsUntil,
  stateMeta,
  userBidHistoryForState,
  type AuctionTiming,
  type BidMode,
  type BiddingState,
  type LiveListingFacts,
} from "@grade10/ui";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

export const EXTENSION_WINDOW_MS = 30 * 60 * 1000;
export const EXTENSION_DURATION_MS = 30 * 60 * 1000;
export const LIVE_INITIAL_REMAINING_MS = (6 * 60 + 9) * 1000;

export function shouldExtendClose(
  closesAtMs: number,
  nowMs = Date.now(),
): boolean {
  const remainingMs = closesAtMs - nowMs;
  return remainingMs > 0 && remainingMs <= EXTENSION_WINDOW_MS;
}

export function extendRecordedClose(nowMs = Date.now()): number {
  return nowMs + EXTENSION_DURATION_MS;
}

export function createLiveAuctionTiming(nowMs = Date.now()): AuctionTiming {
  return {
    closesAtMs: nowMs + LIVE_INITIAL_REMAINING_MS,
    extended: false,
  };
}

export function applyBidExtension(
  timing: AuctionTiming,
  nowMs = Date.now(),
): AuctionTiming {
  if (!shouldExtendClose(timing.closesAtMs, nowMs)) {
    return timing;
  }

  return {
    closesAtMs: extendRecordedClose(nowMs),
    extended: true,
  };
}

export const AUCTION_LOT = {
  title: "1999 Charizard, PSA 10",
  listingNumber: "12",
  saleName: "September Slabs",
  category: "Pokémon",
  description:
    "Shadowless 1st Ed. Authenticated and vaulted. Stored in Grade10 Vault — ships within one business day of payment.",
  images: [
    { src: IMAGE, alt: "1999 Charizard, PSA 10 — front" },
    { src: IMAGE, alt: "1999 Charizard, PSA 10 — back" },
  ],
  ...BID_FIXTURE_LOT,
  currency: "USD",
};

export const AUCTION_LOT_BADGES: readonly ListingLotMetaBadge[] = [
  { label: `Listing ${AUCTION_LOT.listingNumber}` },
  { label: AUCTION_LOT.category },
  { label: AUCTION_LOT.saleName },
];

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

const NAV_LOGO = createElement(G10LogoMono, { className: "h-7 w-auto" });

export const AUCTION_NAV = {
  copy: { locale: "USD" },
  promo: "PROMO UTILITY BAR",
  logo: NAV_LOGO,
  logoHref: "/",
  locales: [
    { value: "US", label: "USD" },
    { value: "HK", label: "HKD" },
  ],
  locale: "US",
  utilityLinks: [],
  navItems: [
    { label: "Store", href: "#shop" },
    { label: "Auction", href: "#auction", current: true },
    { label: "Grade", href: "#grade" },
    { label: "Store Locator", href: "#locator" },
  ],
  onLocaleChange: noop,
  onAccountClick: noop,
  onCartClick: noop,
};

export const AUCTION_LOT_DETAILS_COPY = {
  header: {
    auctionBreadcrumb: "Auction",
    lotBreadcrumb: `Lot ${AUCTION_LOT.listingNumber}`,
    watch: "Watch",
    watching: "Watching",
    watchAriaLabel: "Watch this lot",
    unwatchAriaLabel: "Unwatch this lot",
  },
  sidebar: {
    ...LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
    aboutThisLot: "About this lot",
    vaultShipping: "Vault shipping",
    authentication: "Authentication",
    result: "Result",
    showMore: "Show more",
  },
  vaultShippingBody:
    "Stored in Grade10 Vault — ships from our facility within 1 business day of payment.",
  authenticationBody: "Authenticated by Grade10 Marketplace",
  userBidHistory: {
    link: "Your bid history",
    title: "Bid History",
    amount: "Your bid",
    type: "Type",
    time: "Time",
  },
};

const SIMULATED_RIVALS = [
  "sara@example.com",
  "nina@example.com",
  "tom@example.com",
] as const;

const MAX_RECENT_BIDS = 5;

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
  return SIMULATED_RIVALS[
    Math.floor(Math.random() * SIMULATED_RIVALS.length)
  ];
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
      history: [newBid],
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
        history: [viewerBid, rivalBid, ...history].slice(0, MAX_RECENT_BIDS),
        facts: {
          currentBidMinor: counterAmount,
          bidCount: facts.bidCount + 2,
          hasBids: true,
        },
      };
    }
  }

  return {
    history: [rivalBid, ...history].slice(0, MAX_RECENT_BIDS),
    facts: {
      currentBidMinor: rivalAmount,
      bidCount: facts.bidCount + 1,
      hasBids: true,
    },
  };
}
