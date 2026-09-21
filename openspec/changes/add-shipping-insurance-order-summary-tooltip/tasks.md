## 1. Shared copy and preview (grade10-spec) (owner: @htonyl)

- [x] 1.1 Add shared `auctionOrders` Insurance tooltip catalog coverage and preview interaction tests for the insured, omitted, and pre-invoice states (`grade10-site-auction-winner-order-SC-169`, `grade10-site-auction-winner-order-SC-170`, `grade10-site-auction-winner-order-SC-171`)
- [x] 1.2 Add the localized Insurance tooltip key to every shared catalog and wire it through the existing Winner Order preview line metadata; update the Post-Bidding PRD's in-flight decision if its exact copy is not aligned (`grade10-site-auction-winner-order-SC-169`, `grade10-site-auction-winner-order-SC-170`, `grade10-site-auction-winner-order-SC-171`)
- [x] 1.3 Verify: `pnpm --dir packages/i18n run typecheck`, `pnpm --dir packages/i18n run test`, `pnpm --dir apps/preview run build-storybook`, `pnpm check:manual`, and `openspec validate add-shipping-insurance-order-summary-tooltip --strict`

## 2. Winner fixture support (grade10) (owner: @htonyl)

- [x] 2.1 Add fixture-route and seed tests for an optional Insurance amount, preserving the omitted default (`grade10-site-auction-winner-order-SC-169`, `grade10-site-auction-winner-order-SC-170`)
- [x] 2.2 Thread optional `insuranceAmountMinor` through the development winner seed route, seed helper and Playwright helper so a sent invoice can contain Insurance without changing production contracts (`grade10-site-auction-winner-order-SC-169`)
- [x] 2.3 Verify: `pnpm --dir packages/grade10-auction/backend run test -- test/routes/dev.test.ts test/devFixtures/seedDevWinnerFixture.test.ts`

## 3. Winner Order summary (grade10) (owner: @htonyl)

- [x] 3.1 Add page tests for the Insurance amount and tooltip, the omitted post-send row, and the pre-invoice TBD row with tooltip (`grade10-site-auction-winner-order-SC-169`, `grade10-site-auction-winner-order-SC-170`, `grade10-site-auction-winner-order-SC-171`)
- [x] 3.2 Render optional Insurance tooltip metadata through the existing design-system Tooltip/Info pattern and add Insurance as TBD only to the no-invoice summary (`grade10-site-auction-winner-order-SC-169`, `grade10-site-auction-winner-order-SC-170`, `grade10-site-auction-winner-order-SC-171`)
- [x] 3.3 Verify: `pnpm --dir apps/frontend/grade10 run test -- src/pages/auctions/AuctionWinnerOrderPage.test.tsx` and `pnpm --dir apps/frontend/grade10 run typecheck`

## 4. The walk (grade10) (owner: @htonyl)

- [x] 4.1 Walk `grade10-site-auction-winner-order-US-01` through the isolated Winner Order browser flow, covering sent Insurance with its tooltip, pre-invoice Insurance as TBD, and sent invoices without Insurance; keep the cases in the change's E2E suite
- [x] 4.2 Capture asserted sent-with-Insurance and pre-invoice states as temporary PR evidence; leave the no-Insurance assertion without a misleading tooltip
- [x] 4.3 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- --grep "winner order Insurance"`
