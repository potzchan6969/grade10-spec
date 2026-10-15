# Tasks

> The grade10-spec group lands first; the grade10 group then supplies the
> note where the Winner Order page composes the summary.

## 1. Block and stories (grade10-spec) (owner: @tangconst)

- [x] 1.1 Write the block test first, in its own commit: a `footnote` on `summary.total` renders under the Order Total row; remove the `currencyToggle` tests added for the retracted change (`winner-order-SC-290`, `winner-order-SC-304`)
- [x] 1.2 Remove `summary.currencyToggle` and the subtext-swap rendering from `AuctionWinnerOrder`; a `subtext` renders under its value as before (`winner-order-SC-290`)
- [x] 1.3 Update the Order Summary, Payment and Fulfilment stories: drop `currencyToggle` and the line `subtext`s, put the conversion note on `INVOICE_TOTAL`'s `footnote`; the card-fee story keeps its fee line HKD with no USD figure; USD and pre-invoice stories show no note (`winner-order-SC-290`, `winner-order-SC-304`, `winner-order-SC-291`, `winner-order-SC-292`)
- [x] 1.4 Verify: `pnpm --filter @grade10/ui exec vitest run src/blocks/auction-order`, `pnpm --filter @grade10/ui run typecheck`, `pnpm run lint`

## 2. Preview and PRD pages (grade10-spec) (owner: @tangconst)

- [x] 2.1 Update the preview's Winner Order: HKD-settled invoice fixtures carry HKD values with no `subtext`, and the Order Total carries the conversion note as `footnote`; the page drops `currencyToggle`, `convertedTotal` and `convertedFee`; story plays read the note (`winner-order-SC-290`, `winner-order-SC-304`)
- [x] 2.2 Update the 🚧 lines the proposal links: in `post-bidding.md` move the Order Summary under HKD line and the card-fee line to the conversion note, and revise its `Product decisions` row; in `auction-order.md` keep the winner order bullet presentation-neutral
- [x] 2.3 Verify: the post-bidding story suite, `tsc --project apps/preview/tsconfig.app.json`, `pnpm check:manual` names no line of these pages and no unmarked page

## 3. Consumption (grade10) (owner: @htonyl)

- [ ] 3.1 Supply HKD line amounts and the conversion note on `summary.total.footnote` where the Winner Order page composes an HKD order's summary — the note names the converted lines' USD total and the fixed rate; leave USD and pre-invoice summaries without it (`winner-order-SC-290`, `winner-order-SC-304`, `winner-order-SC-291`, `winner-order-SC-292`)
- [ ] 3.2 Verify: the page suite covering `winner-order-US27-TC1` and `winner-order-US26-TC7`

## 4. The walk (grade10)

- [ ] 4.1 Walk `winner-order-US-27`: a winner with an HKD Pending Payment order reads the Order Summary in HKD on one clean list, and finds the conversion named once beneath the Order Total (`winner-order-SC-290`, `winner-order-SC-304`)
