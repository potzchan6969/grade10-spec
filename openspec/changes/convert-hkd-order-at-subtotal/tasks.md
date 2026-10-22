## 1. Subtotal label in the language catalogs (grade10-spec)

- [ ] 1.1 Write the catalog test first, in its own commit: `auctionOrders.winner.subtotal` exists in `en`, `zh-Hans`, `zh-Hant` and `ko` and reads `Subtotal`, `小计`, `小計` and `소계` (`g10.auction-winner-order.SC8`)
- [ ] 1.2 Add `winner.subtotal` to `packages/i18n/messages/shared/{en,zh-Hans,zh-Hant,ko}/auctionOrders.json`; `winner.convertedFrom` already exists in all four and keeps the note's wording (`g10.auction-winner-order.SC8`)
- [ ] 1.3 Verify: `pnpm --filter @grade10/i18n run test`, `pnpm --filter @grade10/i18n run typecheck`

## 2. AuctionWinnerOrder rows (grade10-spec)

- [ ] 2.1 Write the block tests first, in their own commit: `summary.subtotal` and `summary.feeLines` render between two separators then the total, the Subtotal's footnote shows under it only, and a summary with neither renders as before; retarget the existing summary tests from `winner-order-SC-290`, `winner-order-SC-304` and `winner-order-SC-291` to the scenarios below (`g10.shared-auction-order.SC1`, `g10.shared-auction-order.SC2`, `g10.shared-auction-order.SC3`)
- [ ] 2.2 Retarget the Order Summary, Payment and Fulfilment stories and their fixtures to the same ids; the block's code needs no change because #1288 merged the props (`g10.shared-auction-order.SC1`, `g10.shared-auction-order.SC2`)
- [ ] 2.3 Verify: `pnpm --filter @grade10/ui exec vitest run src/blocks/auction-order`, `pnpm --filter @grade10/ui run typecheck`, `pnpm run lint`

## 3. Invoice and receipt PDF fixtures (grade10-spec)

The PDF blocks keep their contract; only fixtures, stories and tests change.

- [ ] 3.1 Write the fixture tests first, in their own commit: the HKD invoice and receipt fixtures draw the lot row and Shipping & Handling in `US$`, then Subtotal, Payment Processing Fee and Order Total in `HK$`, with the payment breakdown in HK$ and no rate; the USD fixtures stay in `US$` (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC4`, `g10.auction-winner-order.SC6`, `g10.auction-winner-order.SC7`)
- [ ] 3.2 Rewrite `HKD_INVOICE`, `HKD_RECEIPT` and their charge and item constants in `packages/ui/src/blocks/auction-invoice-and-receipt-pdf/fixtures.ts` (USD item row `US$101.00`, `US$20.20`, `US$121.20`; Shipping & Handling `US$10.01`; Subtotal and Order Total `HK$1,030.00`), and the invoice and receipt stories (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC4`)
- [ ] 3.3 Verify: `pnpm --filter @grade10/ui exec vitest run src/blocks/auction-invoice-and-receipt-pdf`, `pnpm --filter @grade10/ui run typecheck`; `public-exports.test.ts` still passes unchanged

## 4. Preview pages and letter previews (grade10-spec)

- [ ] 4.1 Write the tests first, in their own commit: the payment-received preview lists the USD lines, then Subtotal, Payment Processing Fee and Order Total in HKD, and names no rate; the other HKD letters still name only an HKD total; the winner order PDF stories in `apps/preview` read the new fixtures (`order-mail-SC-66`, `g10.auction-notifications-order.SC1`, `g10.auction-notifications-order.SC2`)
- [ ] 4.2 Give `apps/emails/emails/auction/order/payment-received.tsx` a `lines` prop that renders as facts, and update `_components/preview-lot.ts` and `payment-received.test.mjs` (the HKD letter test no longer forbids `US$` on this letter) (`order-mail-SC-66`, `g10.auction-notifications-order.SC1`)
- [ ] 4.3 Update `apps/preview/src/pages/auction/post-bidding/winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx` and `winner-order-content.ts` to the same lines (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC4`)
- [ ] 4.4 Verify: `pnpm --filter @grade10/emails run test`, `tsc --project apps/preview/tsconfig.app.json`, `pnpm run lint`

## 5. PRD pages (grade10-spec)

- [ ] 5.1 Reconcile the pages the change touches with the 🚧 lines of the PRD commit: add the itemised lines to the Payment received row of the Letters table in `post-bidding.md`, record the answer to `decisions.md` Q12 on its `Invoices sent before this layout` row, and follow the Raised rows once Product answers them; run `Cut` from `docs/governance/writing.md` on every line added
- [ ] 5.2 Verify: `pnpm check:manual` names no line of `post-bidding.md`, `management.md`, `auction/index.md` or `money-amounts.md`; the failures that already stand on main are not this change's

## 6. Pricing and the breakdown (grade10)

Needs groups 1 to 5 landed and the `external/grade10-spec` pin bumped, since `hkdFixtures.test.ts` reads the store's fixtures. Groups 7 to 9 need task 6.4 landed.

- [ ] 6.1 Write the tests first, in their own commit: `settleUsdMinor` rounds to the cent (13121 to 103000, 25100 to 197035, 4 to 32, 1 to 8); `priceInvoiceQuote` builds Subtotal, fee and Order Total as the scenarios state, with a card fee on the Subtotal (3869; 7179), a bank fee converted alone (257 to 2018, Order Total 104948 not 104947) and a USD order unchanged; `invoiceBreakdown` returns USD lines, the USD sum without a bank fee, the stored Subtotal, fee and total, never reads a non-fee `settlement_minor` for an HKD invoice, and drops the note when a line has no USD fact; `hkdFixtures.test.ts` derives each fixture's Subtotal from its USD lines; the PGlite specs hold the stored columns and that a sent invoice does not move when the rate constant changes; `USD_TO_HKD_RATE_LABEL` equals the rate (`winner-order-SC-283`, `winner-order-SC-284`, `winner-order-SC-285`, `winner-order-SC-286`, `winner-order-SC-287`, `g10.auction-winner-order.SC1`, `g10.auction-winner-order.SC2`, `winner-order-SC-302`, `winner-order-SC-216`)
- [ ] 6.2 Change `settleUsdMinor` in `packages/grade10-auction/backend/src/services/orders/quotePolicy.ts` to round up to the next HKD cent and update its comment; keep its name and the lint regex (`winner-order-SC-283`, `winner-order-SC-284`)
- [ ] 6.3 Rework `calculateInvoiceQuote`: USD subtotal from the five USD lines, Subtotal converted once, bank fee converted alone, card fee on the Subtotal, Order Total as Subtotal plus fee; keep each line's own cent conversion as the informational per-line value; build `PricedQuote.price` from those numbers (`winner-order-SC-285`, `winner-order-SC-286`, `g10.auction-winner-order.SC2`, `winner-order-SC-302`, `winner-order-SC-216`, `winner-order-SC-214`, `winner-order-SC-04`)
- [ ] 6.4 Add `priceSettledInvoice` and `invoiceBreakdown` to `packages/grade10-auction/contracts/src/invoicePricing.ts` and export them (`g10.auction-winner-order.SC8`)
- [ ] 6.5 Update the fixtures and expectations the rule moves: `settlementQuote.spec.ts`, `quote.spec.ts`, `quote.commands.test.ts`, `operatorOrder.test.ts` (`winner-order-SC-287`, `g10adm.auction-post-sale.SC3`, `grade10-admin-auction-post-sale-SC-48`)
- [ ] 6.6 Verify: `pnpm run test:backend`, `pnpm run typecheck`, `pnpm run check:libs` (the conversion lint), `pnpm run lint`

## 7. Documents and the receipt letter (grade10)

- [ ] 7.1 Write the tests first, in their own commit: the invoice and receipt PDFs draw USD item rows and charges and an HK$ summary for an HKD invoice, Free at zero, no Insurance or Tax line when none, no rate; a USD invoice stays in USD; the payment-received letter lists the same lines as facts for HKD and USD orders and the other letters name only a total (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC4`, `g10.auction-winner-order.SC6`, `g10.auction-winner-order.SC7`, `order-mail-SC-66`, `order-mail-SC-64`, `order-mail-SC-67`, `g10.auction-notifications-order.SC1`, `g10.auction-notifications-order.SC2`)
- [ ] 7.2 Read the settlement lines in `services/auctions/invoicePdf.ts` and `receiptPdf.ts`, and map the breakdown to the block's strings in `orderDocument.ts` (`orderValue`, `itemTable`, `lineItems`, `taxLine`); the payment breakdown keeps its currency (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC4`, `g10.auction-winner-order.SC6`, `g10.auction-winner-order.SC7`)
- [ ] 7.3 Carry the breakdown from `sweeps/orderNotifications.ts` into `OrderEmailPort.send` for `payment_received`, and list it in `email/emailPort.ts` with its labels in `email/messages.ts`; leave the PDF attachment to the change that owns it (`order-mail-SC-66`, `g10.auction-notifications-order.SC1`, `g10.auction-notifications-order.SC2`)
- [ ] 7.4 Verify: `pnpm run test:backend`, `pnpm run typecheck`, `pnpm run lint`

## 8. Winner Order and the invoice page (grade10)

- [ ] 8.1 Write the tests first, in their own commit: `winnerOrderView` lists USD lines, then `subtotal` with the note, `feeLines` and `total` for an HKD invoice, with the note's USD figure leaving a bank fee out, Free at zero, Insurance and Tax left out when none, one total for a USD order and nothing before send; `AuctionInvoicePage` lists the same rows and no rate; the console customer view draws the same rows (`winner-order-SC-290`, `winner-order-SC-304`, `winner-order-SC-291`, `winner-order-SC-292`, `g10.auction-winner-order.SC8`, `g10.auction-winner-order.SC9`, `g10.auction-winner-order.SC10`, `g10.auction-winner-order.SC5`)
- [ ] 8.2 Add `subtotalAmountMinor` to `SourceInvoice` and `subtotal` to `winnerOrderMessages.ts`; rebuild the HKD branch of `summaryLines` from `invoiceBreakdown` in `packages/grade10-auction/frontend/src/features/orders/winner-order/winnerOrderView.ts` (`winner-order-SC-290`, `winner-order-SC-304`, `g10.auction-winner-order.SC8`, `g10.auction-winner-order.SC9`, `g10.auction-winner-order.SC10`)
- [ ] 8.3 Pass `subtotalAmountMinor` from the quote in `orderCustomerView.tsx`, and rebuild `AuctionInvoicePage.tsx` from the breakdown without `settlementAmountsFor` (`g10.auction-winner-order.SC5`, `g10.auction-winner-order.SC7`)
- [ ] 8.4 Verify: `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`

## 9. Operator quote and order detail (grade10)

- [ ] 9.1 Write the tests first, in their own commit: the quote dialog lists the operator's USD lines, then Subtotal, fee and total with no HKD beside a line and no rate, for bank transfer and card, and sends the total it read; the fixture preview and fixture backend hold the new figures (`g10adm.auction-post-sale.SC1`, `g10adm.auction-post-sale.SC2`, `g10adm.auction-post-sale.SC3`, `grade10-admin-auction-post-sale-SC-251`, `grade10-admin-auction-post-sale-SC-252`)
- [ ] 9.2 Rebuild the summary of `InvoiceQuoteFields.tsx` from `usd_minor` rows and the preview's Subtotal, fee and total; update `SC_251_PREVIEW` and the fixtures in `fixtureOperatorOrders.ts` and the dialog tests (`g10adm.auction-post-sale.SC1`, `g10adm.auction-post-sale.SC2`, `grade10-admin-auction-post-sale-SC-251`, `grade10-admin-auction-post-sale-SC-252`)
- [ ] 9.3 Update the figures in the post-sale send tests: 105190 for a quote of 13400 USD, 111470 with Tax, 103000 for the internal bidder's order (`grade10-admin-auction-post-sale-SC-48`, `post-sale-SC-155`, `grade10-admin-auction-post-sale-SC-253`)
- [ ] 9.4 Per the Raised row recommended option: show USD lines then HKD Subtotal, fee and Total in `InvoiceAndPayments.tsx`, and compare and show a changed line in USD in `invoiceRevisionChanges`; drop this task if Product answers the other option
- [ ] 9.5 Verify: `pnpm run test`, `pnpm run test:backend`, `pnpm run typecheck`, `pnpm run lint`

## 10. E2E helper and specs (grade10)

- [ ] 10.1 Move `apps/frontend/grade10/e2e/helpers/settlement-money.ts` to the Subtotal rule (one conversion of the USD sum, the card fee on it, the Order Total as their sum) and update `payment.spec.ts`, `history.spec.ts`, `refund.spec.ts`, `reissue.spec.ts`, `winner-order.spec.ts`, `keep-records.spec.ts`, `item-table-pdf.spec.ts`, `keep-us1.spec.ts`, `post-sale-journey.spec.ts` and `helpers/order-letters.ts` to read USD lines and HKD Subtotal, fee and total (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC5`, `g10.auction-winner-order.SC8`, `g10adm.auction-post-sale.SC1`)
- [ ] 10.2 Verify: `pnpm --dir apps/frontend/grade10 run e2e` on the specs named, `pnpm run typecheck`

## 11. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and groups 1 to 10 landed.

- [ ] 11.1 Walk `winner-order-US-26` end to end: an HKD winner opens the invoice page, the invoice PDF and the receipt PDF after a sandbox card payment on a cent total, and reads the USD lines, then the HKD Subtotal, fee and Order Total, with no rate, and the same lines in the receipt letter (`g10.auction-winner-order.SC3`, `g10.auction-winner-order.SC4`, `g10.auction-winner-order.SC5`, `g10.auction-notifications-order.SC1`)
- [ ] 11.2 Walk `winner-order-US-27`: an HKD winner with a Pending Payment order reads USD lines, one Subtotal with its note, the fee and the Order Total, and a USD winner reads one total (`g10.auction-winner-order.SC8`, `g10.auction-winner-order.SC9`, `g10.auction-winner-order.SC10`, `winner-order-SC-291`)
- [ ] 11.3 Walk `post-sale-US-21`: an operator quotes an HKD order, reads the USD lines, Subtotal, fee and total, sends, and the winner's page shows the same total (`g10adm.auction-post-sale.SC1`, `g10adm.auction-post-sale.SC2`, `g10adm.auction-post-sale.SC3`)
- [ ] 11.4 Flip the cases the walks decide with `pnpm run tcs:automated <case...> --decided-by grade10:<walk path>` in the walks' own commit; the cases that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 11.5 Verify: the walks pass on staging, and the Migration Plan's step 1 count is recorded in the walk's `rounds.md` row
