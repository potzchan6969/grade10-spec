# Tasks: Align collector times to local zone

## 1. Dates, tiles, fixtures, and PDF labels (grade10-spec) (owner: @tangconst)

- [x] 1.1 Make `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-15`, `shared-dates-and-times-SC-23`, `shared-dates-and-times-SC-29` pass: collector clocks follow the viewer; documents name GMT+8.
- [x] 1.2 Make `shared-ui-invoice-and-receipt-pdf-SC-43` pass: PDF dates end in GMT+8 and not HKT.
- [x] 1.3 Make `shared-ui-auction-listing-SC-55` pass: AuctionCard close lines differ by viewer zone; Hong Kong names HKT and New York names EDT.
- [x] 1.4 Update Storybook fixtures and play asserts; add a New York viewer story on the bid card.
- [x] 1.5 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm check:manual` and `pnpm run validate:changes align-collector-times-to-local-zone`.
