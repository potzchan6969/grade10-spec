## 1. Page Body Block (grade10-spec)

- [x] 1.1 `packages/ui/src/blocks/auction-order/` with `AuctionWinnerOrder`, its types and a story per state; public exports test; `pnpm run test:stories:ui`
- [x] 1.2 `apps/preview/src/pages/winner-order-page.tsx` renders the block; `winner-order.story-shared.ts` reads its root; every `winner-order.*.stories.tsx` play function passes; `pnpm run test:stories`
- [x] 1.3 `AuctionOrderDetail`, its types and story removed; `pnpm run lint`, `pnpm run typecheck`, `pnpm check:manual`

## 2. Site Page (grade10)

- [ ] 2.1 Submodule bump; `winnerOrderView` with one test per status pair
- [ ] 2.2 `AuctionWinnerOrderPage` renders `AuctionWinnerOrder`; its progress, lot card, sidebar and the `AuctionOrderDetail` render deleted; `node scripts/checks/check-store-blocks.mjs`
- [ ] 2.3 `AuctionWinnerOrderPage.test.tsx` and the winner-order, refund, partial-payment and post-sale E2E specs pass; the evidence spec captures each state; `pnpm run test:e2e`

## 3. Deltas (grade10-spec)

- [x] 3.1 REMOVE winner-order "The auction order page shows its sections by status" for the ADDED "The auction order page is the Winner Order design"; MODIFY shared-ui "The auction-order surface exports"; with their cases; `pnpm check:manual`
