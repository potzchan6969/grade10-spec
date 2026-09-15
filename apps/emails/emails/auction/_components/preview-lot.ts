/** Shared PreviewProps fixture for auction letter kinds. */
export const previewLot = {
  brandName: "Grade10",
  /** Storefront home — brand mark target. */
  homeUrl: "https://grade10.com",
  lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
  listingUrl: "https://grade10.com/auction/listings/demo-charizard",
  /** Signed-in Winner Order for this lot. */
  orderUrl: "https://grade10.com/account/auction-orders/demo-charizard",
  /** Signed-in My Auctions — per-lot Email alerts mute. */
  muteUrl: "https://grade10.com/account/auctions",
  /** @deprecated Prefer `muteUrl`. */
  unwatchUrl: "https://grade10.com/account/auctions",
  /** Same fixture as the auction lot details page (`product.fixture.png`). */
  primaryImageUrl: "/static/product.fixture.png",
  startsAt: "10 Sep 2026, 10:00 GMT+8",
  scheduledClosesAt: "17 Sep 2026, 21:00 GMT+8",
  effectiveClosesAt: "17 Sep 2026, 21:30 GMT+8",
  closedAt: "17 Sep 2026, 21:30 GMT+8",
  currentBid: "HK$12,800",
  /** Hammer / winning bid at close. */
  winningBid: "HK$12,800",
  /** Final standing bid fixture (bidder close letters). */
  highestBid: "HK$11,200",
  /** Standing amount when the reader lost the lead (outbid / non-winner). */
  yourBid: "HK$12,400",
} as const;
