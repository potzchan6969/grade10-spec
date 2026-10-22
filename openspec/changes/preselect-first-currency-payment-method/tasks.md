# Tasks

> The preview dialog already draws the preselected step; the grade10 group
> applies the same defaults where the real Winner Order opens setup.

## 1. Preview dialog and stories (grade10-spec) (owner: @tangconst)

- [x] 1.1 Preselect the first offered currency; a single offered currency reads `Pay in {currency}` with no picker (`winner-order-SC-278`, `winner-order-SC-306`)
- [x] 1.2 Preselect the first method the settlement currency offers — card where a card fee rule applies, else the first bank rail (`winner-order-SC-305`, `winner-order-SC-91`)
- [x] 1.3 Update the Complete Order Setup payment stories for the preselected open and the `Pay in {currency}` single-currency read
- [x] 1.4 Verify: `pnpm --dir apps/preview exec tsc --noEmit`, the post-bidding story suite

## 2. Consumption (grade10) (owner: @htonyl)

- [ ] 2.1 Apply the same defaults where Winner Order opens setup: the first offered currency selected, `Pay in {currency}` with no picker where one is, and the first offered method selected — the winner still confirms (`winner-order-SC-278`, `winner-order-SC-305`, `winner-order-SC-306`)
- [ ] 2.2 Bank rails read no fee line at the choice: drop `fee.bankTransfer` (`Bank fee set on your invoice`) from `@grade10/i18n` `auctionOrders.json` and from the setup dialog (`winner-order-SC-91`)
- [ ] 2.3 A test winner's order opens setup through the same Winner Order defaults; no separate admin surface (`grade10-admin-auction-test-winners-SC-11`)
- [ ] 2.4 Verify: the page suite covering `winner-order-US24-TC1`, `winner-order-US25-TC6`, `winner-order-US25-TC9`, `winner-order-US9-TC22`, `winner-order-US9-TC23` and `winner-order-US1-TC51`

## 3. The walk (grade10)

- [ ] 3.1 Walk `winner-order-US-25`: a winner opening order setup reads the first offered currency selected under Pay in, the offered methods listed, and the first one checked; a single-currency order reads `Pay in HKD` with no picker (`winner-order-SC-305`, `winner-order-SC-306`)
- [ ] 3.2 Walk `g10adm.auction-test-winners.US1-TC7`: a test winner's order opens setup with the first offered currency and method selected (`grade10-admin-auction-test-winners-SC-11`)
