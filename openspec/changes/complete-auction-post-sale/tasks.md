## 1. Fee and Tax (grade10)

- [ ] 1.1 Add `invoicePricing.ts` to `packages/grade10-auction/contracts` with `buyerPremiumMinor`, `priceInvoice`, `suggestProcessingFee` and `maskAccount`, folding `buyerCharges.ts` into it; `packages/grade10-auction/contracts/test/invoicePricing.test.ts`
- [ ] 1.2 The fee migration adds the four fee columns with their pair and range checks to `auction_payment_settings`; `paymentSettings.get` and `save` move from `auction:settle` to `auction:payment`; the settings service and router save and read both rules, zero allowed, half a pair refused; `pnpm run check:migrations`, `apps/backend/grade10/auction/test/db/trpc/paymentSettings.spec.ts`
- [ ] 1.3 `sendInvoice` and `requoteInvoice` (merged into Reissue by 4.6) take `taxMinor`, `processingFeeMinor` and `expectedTotalMinor`, price under the lock and refuse `QUOTE_CHANGED`; delete `paymentProcessingFee.ts` and `readPaymentProcessingFees` from the Stripe ports and the E2E fake; `apps/backend/grade10/auction/test/db/trpc/postSaleCommands.spec.ts`
- [ ] 1.4 The Payment Settings tab takes a card rule and a bank rule per currency with a live example line; the `sendInvoice` and `requoteInvoice` (merged into Reissue by 4.6) dialogs take tax and fee with a `priceInvoice` preview and carry the expected total; `node scripts/test.mjs packages/grade10-auction/admin-frontend`
- [ ] 1.5 Regenerate the API docs; `pnpm --dir packages/api-docs run generate` leaves a clean tree

## 2. Contracts and Schema (grade10)

- [ ] 2.1 Rename `Awaiting Address` to `Awaiting Setup`; `deriveAuctionOrderStatus` reads the fact columns; `orderRules.ts` with `OrderFacts`, `OPERATOR_ACTIONS`, `PRIMARY_ACTION`, `OPERATOR_ACTION_PERMISSIONS`, `operatorRefusal`, `winnerActions`, `operatorNextStep`, `segmentOf`, `paymentOutcome`, `invoiceSearchKey` and `PROOF_LIMITS`; `packages/grade10-auction/contracts/test/orderRules.test.ts`
- [ ] 2.2 `operatorOrder.ts` with `OperatorOrderRow`, `OperatorOrderView`, `TimelineEntry` and the operator inputs; the refusal list loses `PAYMENT_FEES_UNREADABLE`, gains the seven new codes and `WINNER_REFUSAL_CODES`; `packages/grade10-auction/contracts/test/winnerOrder.test.ts`, `packages/grade10-auction/contracts/test/operatorOrder.test.ts`
- [ ] 2.3 Drizzle schema for the new columns, checks and `auction_order_comments`; the order migration with the backfills, the `paid_after_cancel` preflight, the rescoped operator-reason check and its `-- lock:` and `-- contract:` lines; `pnpm run check:migrations`, `packages/grade10-auction/backend/test/repositories/orders.drizzle.test.ts`
- [ ] 2.4 `AuctionOrdersPage` maps all twelve statuses to `status.*`; the site's `Awaiting Address` reads become `Awaiting Setup`; `refusalMessage` answers every code in `WINNER_REFUSAL_CODES` from `auctionOrders.refusal.<code>` and any other code from `auctionOrders.refusal.generic`; `apps/frontend/grade10/src/pages/auctions/AuctionOrdersPage.test.tsx`, and a unit test that every code has a key in `en`, `zh-Hant`, `zh-Hans` and `ko`

## 3. Backend Split (grade10)

- [ ] 3.1 Move `winnerInvoice.ts`, `invoiceLifecycle.ts`, `winnerPaymentProof.ts`, `bankDetails.ts`, `orderStatus.ts` and the order half of `services/admin/fulfillment.ts` into `services/orders/*` at their exported seams with no behaviour change; `node scripts/test.mjs apps/backend/grade10/auction` stays green
- [ ] 3.2 `repositories/orderQueue.ts` with `orderStatusSql`, `orderSinceSql`, `flagOpenSql` and the keyset worklist; `services/orders/queue.ts` with segments, counts, search and filters; `packages/grade10-auction/backend/test/repositories/orderQueue.repo.test.ts` holds the status and since matrix
- [ ] 3.3 `services/orders/reads.ts` builds `OperatorOrderView` with the timeline merge, keeps `readWinnerOrder`'s shape, and `loadOwnedOrder` answers `NOT_FOUND` to every non-owner; `apps/backend/grade10/auction/test/db/trpc/orders.spec.ts`, `apps/backend/grade10/auction/test/worker/rpc/AuctionService.spec.ts`
- [ ] 3.4 Delete the stored-status paths, the synthetic cancelled invoice, `amendAddress` and the winner amendment log, and `amendWinnerOrderAddress` answers `ADDRESS_LOCKED`; `expiredInvoices` expires the current invoice and suspends in one transaction and skips cancelled orders; `suspendedBidders` removed; `apps/backend/grade10/auction/test/db/sweeps/winnerInvoice.spec.ts`
- [ ] 3.5 `stripeConfig` in mode `test` accepts only test keys; `createCheckoutSession` takes `expiresAt` and `paymentMethodTypes`; `retrieveCheckoutSession` and `expireCheckoutSession` on the port; the E2E fake session completes and expires; `packages/grade10-auction/backend/test/stripe/config.test.ts`, `apps/backend/grade10/auction/test/helpers/fakeStripe.ts`
- [ ] 3.6 `orderProofReferences` feeds the orphan sweep; `repositories/orderComments.ts`; `packages/grade10-auction/backend/test/repositories/orderProofs.repo.test.ts`, `apps/backend/grade10/auction/test/db/sweeps/orphanedObjects.spec.ts`

## 4. Money In and Proofs (grade10)

- [ ] 4.1 `cardPayments.ts`: `prepareCheckout` with a fresh session per click, attempt-keyed idempotency and the compare-and-set; `recordCheckoutPaid` writes money on every invoice state and flags per the table; `recordCheckoutClosed`, all behind `payWinnerInvoice` and the webhook; the webhook handler routes the four session events; `apps/backend/grade10/auction/test/db/webhooks/handleEvent.spec.ts`, `apps/backend/grade10/auction/test/db/webhooks/webhooks.spec.ts`
- [ ] 4.2 `proofs.ts`: behind `uploadWinnerPaymentProof`, each file is sniffed by its bytes, stored under a content-addressed key and the deadline frozen; `reviewProof` returns with both reasons and the Proof not accepted letter, or confirms into `paid`; `readOrderProof`; `apps/backend/grade10/auction/test/db/admin/proofs.spec.ts`
- [ ] 4.3 `PUT /api/admin/orders/:orderId/proofs?kind=` granted by kind and `GET .../proofs/:key` served inline with `nosniff`, `Content-Security-Policy: sandbox` and `no-store`, audited, keys from the order's union only; the listing-level proof routes go; `apps/backend/grade10/auction/test/db/routes/uploads.spec.ts`
- [ ] 4.4 `operatorPayments.recordPayment` with `paymentOutcome`, `received_at`, receipts and flags; `cancelRefund.ts`: `cancelOrder` writes the order facts, expires the open session, releases the hold and leaves the listing closed; `recordRefund` with `destination` and `refunded_at`; `clearPaymentFlag`; `apps/backend/grade10/auction/test/db/trpc/orders.spec.ts`, `apps/backend/grade10/auction/test/db/sweeps/winnerInvoiceRefundPartial.spec.ts`
- [ ] 4.5 `fulfilment.ts` writes `dispatched_at` and `delivered_at` with their log rows and letters; `comments.addComment`; `apps/backend/grade10/auction/test/db/trpc/orders.spec.ts`
- [ ] 4.6 `quote.reissueInvoice`: one Reissue on `pending` or `expired` with no payment that counts toward the balance, a reason and at least one change (`NO_CHANGE`), the deadline kept or restarted, the setup snapshots moved and the open checkout session expired; `setup.ts`: `confirmSetup` behind `confirmWinnerAddress`, once, with `METHOD_UNAVAILABLE`, `reopenSetup`, `recordSetup`; `apps/backend/grade10/auction/test/db/trpc/orders.spec.ts`

## 5. Operator Surface (grade10)

- [ ] 5.1 `trpc/routers/orders.ts` with the grant per procedure, `auditDetails` on each and a cap on the audit row; `router.spec.ts` pins the grants to `OPERATOR_ACTION_PERMISSIONS`; `apps/backend/grade10/auction/test/db/trpc/router.spec.ts`, `apps/backend/grade10/auction/test/db/trpc/auditTrail.spec.ts`, `apps/backend/grade10/auction/test/db/trpc/refusals.spec.ts`; no input carries `actor` or `at`, the service takes them from the session and `ctx.clock()` after the lock (SC-166)
- [ ] 5.2 The winner entrypoint exposes the winner methods under their current names and its prototype equals the allowlist; the store router forwards them unchanged and ignores a client-sent `userId`; `apps/backend/grade10/auction/test/worker/rpc/AuctionService.spec.ts`, `apps/backend/grade10/store/test/db/auctionRouter.spec.ts`
- [ ] 5.3 Delete the `postSale`, `settlements` and `fulfillment` routers, services and repositories, the `payment_settlements` fallback in `accountRecord.ts` and the operator members of `WinnerOrderServiceApi`; `pnpm run typecheck`, `node scripts/test.mjs apps/backend/grade10/auction`

## 6. Test Winners (grade10)

- [ ] 6.2 `services/orders/testWinners.ts`: `createTestWinner` (plus-tag rule, `createUnverifiedAccount`, `ACCOUNT_EXISTS`, `ensureTestBidder`, `insertClosedSandboxLot`, `closeOne`, replay by account) and `listTestWinners`; `trpc/routers/testWinners.ts` on the `testBids` middleware; `apps/backend/grade10/auction/test/db/trpc/testWinners.spec.ts`
- [ ] 6.3 `seedDevWinnerFixture` builds its lot with `insertClosedSandboxLot` and the real close and reaches each status through the order services; `packages/grade10-auction/backend/test/devFixtures/seedDevWinnerFixture.test.ts`

## 7. Admin Workspace (grade10)

- [ ] 7.1 Console: `ActionMenu` with keyboard-reachable disabled items, `FormDialog.dismissLabel`, `CursorPager.labels`, `Notice.actions`, `PromptDialog` moved in from the vault slice; `node scripts/test.mjs packages/frontend-console`
- [ ] 7.2 `features/operations/orders` slice: models, repository, API service with the proof urls, `refusalCopy` over every operator code, the three hooks; `TrpcAuctionAdminProcedureClient` gains `orders` and `testWinners`; `node scripts/test.mjs packages/grade10-auction/admin-frontend`
- [ ] 7.3 Worklist: segmented counts, search, status and category filters, the row's primary action, URL state, `CursorPager`; `packages/grade10-auction/admin-frontend/src/features/operations/orders/presentation/views/OrdersWorklist.test.tsx`
- [ ] 7.4 Order page: header with More and the primary action by grant, the status sentence, flag notices, summary strip, the two columns, shipment, timeline with the comment box; `packages/grade10-auction/admin-frontend/src/features/operations/orders/presentation/views/OrderDetail.test.tsx`
- [ ] 7.5 The ten dialogs with `keepRefusal`, the quote preview equal to `priceInvoice`, the `paymentOutcome` choices inline and the restated consequences; `packages/grade10-auction/admin-frontend/src/features/operations/orders/presentation/dialogs/*.test.tsx`
- [ ] 7.6 Routes: the `auctionOrder` surface, `routes/auction-order.tsx`, the Orders tab, `queue` removed; the Test tab lazy-loaded behind the build constant with its files in `TEST_ONLY`; `pnpm run check:admin-bundle`, `apps/admin/grade10/src/pages/auction/AuctionPage.test.tsx`
- [ ] 7.7 Test winners panel with create, list, Email sign-in link and Open order; the winner fixtures panel and `WINNER_FIXTURE_STATUSES` go; `packages/grade10-auction/admin-frontend/src/features/test/winners/presentation/views/TestWinnersPanel.test.tsx`
- [ ] 7.8 Delete the `post-sale`, `winner-orders`, `settlements` and `fulfillment` slices with their exports, DI modules and the fixture client's emulation; Payment Settings gated on `auction:payment`; Listings offer Open order; `pnpm run typecheck`, `node scripts/test.mjs packages/grade10-auction/admin-frontend`; `isExtended` holds only for a published lot still taking bids and reads Extended; `packages/grade10-auction/admin-frontend/src/features/catalog/listings/domain/models/AdminListing.test.ts`

## 9. Letter Template (grade10-spec)

- [ ] 9.2 The Proof not accepted letter under `apps/emails/emails/auction/order/`; `pnpm --dir apps/emails run typecheck`

## 10. E2E and Docs (grade10)

- [ ] 10.1 `post-sale-journey.spec.ts` with the card, bank and operator journeys, seeded through `testWinners.create` and signed in from `AuthDoor.readOutbox`; `pnpm run test:e2e`
- [ ] 10.2 The winner-order, partial-payment, refund, account-record and suspension specs and their helpers read `Awaiting Setup`; `pnpm run test:e2e`
- [ ] 10.3 `docs/architecture/auction.md` takes the derived status, money in, proofs and test winners; `docs/conventions/development.md` takes the QA walk; `pnpm run lint`

## 11. Archive Gate (grade10-spec)

- [ ] 11.1 Archive gate: after `add-winner-order-tax-line` archives, MODIFY "An operator quotes and sends the invoice", "An operator reissues a sent invoice" and winner-order "Invoice fields" to the fee from the schedule; REMOVE post-sale SC-69 and SC-70, the "needs no provider fees" clause of SC-119 and winner-order SC-62; drop the "in place of" clause from "The payment processing fee starts from the fee schedule"; ours does not archive before this lands; `pnpm check:manual`
