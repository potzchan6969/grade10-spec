# Tasks

> The preview dialog already draws the preselected step; the grade10 group
> applies the same defaults where the real Winner Order opens setup.

## 1. Preview dialog and stories (grade10-spec) (owner: @tangconst)

- [x] 1.1 Preselect HKD where both currencies are offered; a single offered currency reads `Pay in {currency}` with no picker (`winner-order-SC-278`, `winner-order-SC-306`)
- [x] 1.2 Preselect the first method the settlement currency offers — card where a card fee rule applies, else the first bank rail (`winner-order-SC-305`, `winner-order-SC-91`)
- [x] 1.3 Update the Complete Order Setup payment stories for the preselected open and the `Pay in {currency}` single-currency read
- [x] 1.4 Verify: `pnpm --dir apps/preview exec tsc --noEmit`, the post-bidding story suite

## 2. Consumption (grade10)

- [ ] 2.1 Apply the same defaults where Winner Order opens setup: HKD selected where both currencies are offered, `Pay in {currency}` with no picker where one is, and the first offered method selected — the winner still confirms (`winner-order-SC-278`, `winner-order-SC-305`, `winner-order-SC-306`)
- [ ] 2.2 Verify: the page suite covering `winner-order-US24-TC1` and `winner-order-US25-TC9`

## 3. The walk (grade10)

- [ ] 3.1 Walk `winner-order-US-25`: a winner opening order setup reads HKD selected under Pay in, the offered methods listed, and the first one checked; a single-currency order reads `Pay in HKD` with no picker (`winner-order-SC-305`, `winner-order-SC-306`)
