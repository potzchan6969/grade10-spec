# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** shared-ui-auction-order-SC-15, shared-ui-auction-order-SC-16, shared-ui-auction-order-SC-17, shared-ui-auction-order-SC-19, shared-ui-auction-order-SC-20

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail
and the address form are walked through `grade10-site/auction/winner-order`,
which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

No new manual cases this change. `shared-ui-auction-order-SC-31` and the
revised `SC-s7t` are exercised by the `AuctionWinnerOrder` component tests
in `packages/ui`, which render the block with and without
`summary.currencyToggle` and assert both views.

## Settled

- None this run. The contract shape was the change's own decision, landed at
  `decisions.md` Q4.

## Reconciliation

**Cases** - All 11 cases remain drafts and unchanged; none names the subtext
or the toggle. The winner-order product cases that read the two views live
under `grade10-site/auction/winner-order` US27.

**Scenario coverage** - `SC-s7t@2` stays covered by the block's inline-
subtext test. `SC-p2v@1` is covered by the block's toggle test
(`shared-ui-auction-order-SC-31` in `auction-winner-order.test.ts`), which
asserts the primary view on mount, the secondary view swapping each row's
subtext into the value spot, a subtext-free row keeping its value, and the
swap back.
