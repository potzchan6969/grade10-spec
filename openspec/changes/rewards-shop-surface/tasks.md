# Tasks

## 1. The blocks (grade10-spec)

- [x] 1.1 Update `types.ts`: `RewardMenuItem` gains `kind`, `description`,
      `image`, `deadline`, `useAt`, `validFor` and loses `maxQuantity`,
      `validity`, `limits`, `collectionWindow`; add `RewardCheckoutReward`
      and `RewardRedemption`
      `grade10-site-loyalty-programme-SC-264`, `grade10-site-loyalty-programme-SC-265`
- [x] 1.2 Rebuild `reward-menu.tsx` as the card list — item art or coupon
      gift tile, name, description, optional deadline, price; whole card
      reports `onSelect`; keep `AsyncState` loading/empty/error
      `grade10-site-loyalty-programme-SC-264`, `grade10-site-loyalty-programme-SC-265`
- [x] 1.3 Add `reward-checkout.tsx`: the confirm phase (hero, deadline
      badge, `Use at`/`Valid for` rows, balance before→after, warning
      deficit readout, disabled redeem), the redeemed phase (check, title,
      points line, `PromoTicket` with code or collection, Done + View
      Coupons), and the responsive shell — `Drawer swipeDirection="down"`
      under 640px, `Dialog` from 640px via `matchMedia`
      `grade10-site-loyalty-programme-SC-266`, `grade10-site-loyalty-programme-SC-267`, `grade10-site-loyalty-programme-SC-268`
- [x] 1.4 Export `RewardCheckout`, `RewardCheckoutCopy`,
      `RewardCheckoutProps`, `RewardCheckoutReward`, `RewardRedemption` from
      `packages/ui/src/index.ts`; `index.test.ts` updated
      `grade10-site-loyalty-programme-SC-125`
- [x] 1.5 Refresh `audit.json` for the changed and new blocks and run
      `pnpm run design-sync:audit`
      `grade10-site-loyalty-programme-SC-264`

## 2. The stories and the preview (grade10-spec)

- [x] 2.1 Rewrite `reward-menu.stories.tsx` under
      `Loyalty/Rewards/Blocks/RewardMenu`: item card, coupon card, deadline,
      press reports, unaffordable affordance, loading/empty/error
      `grade10-site-loyalty-programme-SC-264`, `grade10-site-loyalty-programme-SC-265`
- [x] 2.2 Add `reward-checkout.stories.tsx` under
      `Loyalty/Rewards/Blocks/RewardCheckout`: coupon confirm, item confirm,
      insufficient balance, busy, redeemed coupon (code, no Apply), redeemed
      gift (collection, no code), sheet under 640px vs dialog at 640px
      `grade10-site-loyalty-programme-SC-266`, `grade10-site-loyalty-programme-SC-267`, `grade10-site-loyalty-programme-SC-268`
- [x] 2.3 Add the preview Rewards screen (Figma `7254:500`) under
      `apps/preview/src/pages/loyalty/`, composing `RewardMenu` +
      `RewardCheckout` with fixture state, titled per `docs/governance/storybook.md`
      `grade10-site-loyalty-programme-SC-264`, `grade10-site-loyalty-programme-SC-266`
- [x] 2.4 Repoint `loyalty-content.ts` and `membership.stories.tsx` at the
      new `RewardMenu` contract and the checkout flow
      `grade10-site-loyalty-programme-SC-264`

## 3. The walk - the shop through the redemption (grade10-spec)

- [ ] 3.1 Walk `grade10-site-loyalty-programme-US-12` on the workbench:
      `Loyalty/Rewards` cards open the sheet under 640px and the dialog at
      640px; the balance reads before→after; a short balance refuses in the
      warning tone; the coupon's ticket shows its code and the gift's its
      collection; no Apply anywhere
      (`grade10-site-loyalty-programme-SC-264`, `grade10-site-loyalty-programme-SC-266`, `grade10-site-loyalty-programme-SC-267`, `grade10-site-loyalty-programme-SC-268`)
