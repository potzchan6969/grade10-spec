# Tasks

> The grade10-spec group lands first; the grade10 group then supplies the
> toggle and USD amounts where the Winner Order page composes the summary.

## 1. Block and stories (grade10-spec) (owner: @tangconst)

- [x] 1.1 Write the block test first, in its own commit: with `summary.currencyToggle` supplied the control shows `primary` picked and no subtext renders; on `secondary` each row swaps its `subtext` into the value spot, the total swaps, and a subtext-free row keeps its value; on `primary` back the summary reads as supplied (`shared-ui-auction-order-SC-31`)
- [x] 1.2 Add `summary.currencyToggle` (`primary`/`secondary` labels, optional `ariaLabel`) to `AuctionWinnerOrder`, keep the picked view in the block, render a `primary | secondary` link text beside the Order Summary heading only when the prop is supplied and a line or the total carries a `subtext`, and keep a `subtext` rendering under its value where no toggle is supplied (`shared-ui-auction-order-SC-31`, `shared-ui-auction-order-SC-s7t`)
- [x] 1.3 Update the Order Summary stories: the HKD stories supply the toggle with the `setup.currency` labels and each amount's USD `subtext`, assert the HKD view on render, pick USD and assert the swap, and pick back; the card-fee story keeps its fee line HKD in both views; the USD and pre-invoice stories show no control (`winner-order-SC-290`, `winner-order-SC-304`, `winner-order-SC-305`, `winner-order-SC-291`, `winner-order-SC-292`)
- [x] 1.4 Verify: `pnpm --filter @grade10/ui exec vitest run src/blocks/auction-order`, `pnpm --filter @grade10/ui run typecheck`, `pnpm run lint`

## 2. PRD pages (grade10-spec) (owner: @tangconst)

- [x] 2.1 Update the 🚧 lines the proposal links: in `post-bidding.md` move the Order Summary under HKD line and the card-fee line to the currency swap, and revise its `Product decisions` row; in `auction-order.md` mark the winner order bullet
- [x] 2.2 Verify: `pnpm check:manual` names no line of these pages and no unmarked page

## 3. Consumption (grade10) (owner: @htonyl)

- [ ] 3.1 Supply `summary.currencyToggle` with the `setup.currency` labels, each line's USD `subtext` and the USD total through `summary.total.subtext` where the Winner Order page composes an HKD order's summary; leave USD and pre-invoice summaries without it (`winner-order-SC-290`, `winner-order-SC-304`, `winner-order-SC-305`, `winner-order-SC-291`, `winner-order-SC-292`)
- [ ] 3.2 Verify: the page suite covering `winner-order-US27-TC1`

## 4. The walk (grade10)

- [ ] 4.1 Walk `winner-order-US-27`: a winner with an HKD Pending Payment order reads the Order Summary in HKD, picks USD and reads the lot's figures and the USD total, picks back to HKD, and finds the card fee in HKD in both views (`winner-order-SC-290`, `winner-order-SC-304`, `winner-order-SC-305`)
