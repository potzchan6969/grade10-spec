# Tasks

## 1. Block and stories (grade10-spec) (owner: @tangconst)

- [x] 1.1 Preview fixtures carry `id`, `issuedOn` and `fileName` on `WinnerOrderReceipt`; the page derives `Receipt #<id> (<issuedOn>)`, and reads `Receipt` for an ID-less record — `AuctionWinnerOrder`'s contract is unchanged (`winner-order-SC-307`, `winner-order-SC-308`)
- [x] 1.2 The Payment stories' `Partially Paid` play asserts both links' names in oldest-first order; the single-receipt assertions read the new label (`winner-order-SC-307`)
- [x] 1.3 Verify: `pnpm --dir apps/preview exec tsc -b`, the post-bidding story suite, `pnpm run lint`

## 2. Consumption (grade10) (owner: @htonyl)

- [ ] 2.1 Supply each receipt's `label` and `ariaLabel` — `Receipt #<id> (<issued>)` / `… PDF` — oldest issued first, `Receipt` for a record with no ID (`winner-order-SC-307`, `winner-order-SC-308`)
- [ ] 2.2 Retire `receiptNumbered` and `receiptNumberedPdf` (`Receipt · P{n}`) from `@grade10/i18n` `auctionOrders.json`
- [ ] 2.3 Verify: the page suite covering `winner-order-US2-TC57` and `winner-order-US2-TC58`

## 3. The walk — Winner Order (grade10)

- [ ] 3.1 Walk `winner-order-US-02`: a paid order's receipt link reads `Receipt #RC-LK7P2Q01P1 (22 Sep 2026)`; a partially paid order's links run oldest issued first (`winner-order-SC-307`, `winner-order-SC-308`)
