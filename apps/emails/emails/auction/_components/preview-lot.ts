import {
  cancelledMailto,
  deliveredMailto,
  PREVIEW_INVOICE_ID,
  partialPaymentMailto,
  paymentOverdueMailto,
  setupOverdueMailto,
} from "@/emails/auction/_components/contact-mailto";

/** Shared PreviewProps fixture for auction letter kinds. */
export const previewLot = {
  brandName: "Grade10",
  /** Storefront home — brand mark target. */
  homeUrl: "https://grade10.com",
  lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
  listingUrl: "https://grade10.com/auction/listings/demo-charizard",
  /** Signed-in Winner Order for this lot. */
  orderUrl: "https://grade10.com/account/auction-orders/demo-charizard",
  /** Sent invoice id — omitted from setup-overdue (no invoice yet). */
  invoiceId: PREVIEW_INVOICE_ID,
  /**
   * Customer support — overdue letters' primary CTA (matches Winner Order
   * Contact Us). Prefills subject and body; setup overdue uses the lot.
   */
  setupOverdueContactUrl: setupOverdueMailto(
    "1999 Pokémon Base Set Charizard PSA 9",
  ),
  paymentOverdueContactUrl: paymentOverdueMailto(
    "1999 Pokémon Base Set Charizard PSA 9",
    PREVIEW_INVOICE_ID,
  ),
  cancelledContactUrl: cancelledMailto(
    "1999 Pokémon Base Set Charizard PSA 9",
    PREVIEW_INVOICE_ID,
  ),
  deliveredContactUrl: deliveredMailto(
    "1999 Pokémon Base Set Charizard PSA 9",
    PREVIEW_INVOICE_ID,
  ),
  partialPaymentContactUrl: partialPaymentMailto(
    "1999 Pokémon Base Set Charizard PSA 9",
    PREVIEW_INVOICE_ID,
    ["REC-202609-LK7P2Q-01-P1"],
  ),
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
  /** 48 hours from lot close — order setup window (address, payment method, billing). */
  setupDeadline: "19 Sep 2026, 21:30 GMT+8",
  /** Order setup fields named as bullets in won / reminder / setup-overdue letters. */
  setupFields: [
    "Delivery address",
    "Payment method",
    "Billing address",
  ] as const,
  /** @deprecated Prefer `setupDeadline`. */
  addressDeadline: "19 Sep 2026, 21:30 GMT+8",
  /** 7 calendar days from invoice send — payment window. */
  paymentDeadline: "24 Sep 2026, 21:30 GMT+8",
  currentBid: "HK$12,800",
  /** Hammer / winning bid at close. */
  winningBid: "HK$12,800",
  /** Order Total / Invoice total on a sent invoice (includes fees). */
  orderTotal: "HK$16,896",
  /** When payment was confirmed (winner's zone). */
  paidAt: "20 Sep 2026, 14:22 GMT+8",
  /** Card: brand + masked number. Bank transfer letters use `Bank Transfer` only. */
  paymentMethod: "Visa •••• 4242",
  /** Receipt ID — quiet body line + attached PDF file name. */
  receiptId: "REC-202609-LK7P2Q-01-P1",

  /** Carrier name once the lot is dispatched. */
  carrierName: "SF Express",
  /** Tracking number shown on Winner Order and in the shipped letter. */
  trackingNumber: "SF1234567890",
  /** Carrier track-and-trace URL. */
  trackingUrl:
    "https://www.sf-express.com/us/en/dynamic_function/waybill/#search/bill-number/SF1234567890",
  /** When the lot was marked shipped (winner's zone). */
  shippedAt: "22 Sep 2026, 11:05 GMT+8",
  /** When the carrier confirmed delivery (winner's zone). */
  deliveredAt: "24 Sep 2026, 16:40 GMT+8",
  /** When an operator cancelled the order (winner's zone). */
  cancelledAt: "25 Sep 2026, 10:15 GMT+8",
  /** Confirmed delivery address on the Winner Order. */
  deliveryAddress: "Jane Collector\n12 Example Street\nCentral, Hong Kong",
  /** Standing amount when the reader lost the lead (outbid / non-winner). */
  yourBid: "HK$12,400",
} as const;
