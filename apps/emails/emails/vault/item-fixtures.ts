/**
 * The fixture every vault item letter preview is written over: item
 * `G10-VLT-004821`, a graded 1997 Pocket Monsters Checklist Carddass held for
 * its collector, not a case.
 *
 * Instants are ISO, so the letters print them on the shop's clock through
 * `format.ts` rather than carrying a formatted string each.
 *
 * The pickup window, opening hours and approval timing are stand-ins — the
 * PRD still lists retrieval timing and the pickup path as unconfirmed, so
 * the letters take them as props and these values need confirming before a
 * backend renders them.
 */
const itemUrl = "https://grade10.com/vault/items/va-004821";

export const previewItem = {
  id: "va-004821",
  vaultId: "G10-VLT-004821",
  itemTitle: "1997 Pocket Monsters Checklist Carddass",
  grade: "PSA 10 Gem Mint",
  cert: "63261276",
  url: itemUrl,
  /** Stand-in for the item's scan — the same image the auction previews use. */
  imageUrl: "/static/product.fixture.png",

  email: "wing.chu@example.com",

  shopName: "Hong Kong Grade10 Store",
  shopAddress: "13 Pak Sha Road, Causeway Bay, Hong Kong",
  openingHours: "Mon–Sat 11:00–19:00",

  vaultedAt: "2026-10-12T06:15:00Z",
  requestedAt: "2026-10-24T02:00:00Z",
  approvedAt: "2026-10-24T04:00:00Z",
  declinedAt: "2026-10-24T04:00:00Z",

  pickupFrom: "2026-10-24T06:00:00Z",
  pickupUntil: "2026-10-24T10:00:00Z",

  declineReason: "the item is undergoing a condition re-check",
} as const;

export type PreviewItem = typeof previewItem;

/** The item line, directly above the footer of every letter. */
export const previewItemLine = {
  vaultId: previewItem.vaultId,
  itemTitle: previewItem.itemTitle,
} as const;
