/** Shared PreviewProps fixture for auction letter kinds. */
export const previewLot = {
  brandName: "Grade10",
  lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
  listingUrl: "https://grade10.com/auction/listings/demo-charizard",
  unwatchUrl: "https://grade10.com/auction/listings/demo-charizard",
  /** Same fixture as the auction lot details page (`product.fixture.png`). */
  primaryImageUrl: "/static/product.fixture.png",
  startsAt: "10 Sep 2026, 10:00 GMT+8",
  scheduledClosesAt: "17 Sep 2026, 21:00 GMT+8",
  effectiveClosesAt: "17 Sep 2026, 21:30 GMT+8",
  currentBid: "HK$12,800",
  /** Standing amount when the reader lost the lead (outbid only). */
  yourBid: "HK$12,400",
} as const;
