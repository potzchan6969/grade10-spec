## 1. The block (grade10-spec) (owner: @tangconst)

- [x] 1.1 Remove `href`, `onClick` and `copy.benefits` from `TierCard`; the
      footer keeps the earn line alone and nothing on the card is interactive
      `grade10-site-loyalty-programme-SC-255`, `grade10-site-loyalty-programme-SC-256`
- [x] 1.2 Update `tier-card.stories.tsx`: drop the Pressed story and the
      Benefits copy; Gold asserts no link or button

## 2. The page consumes it (grade10-spec) (owner: @tangconst)

- [x] 2.1 Drop `href`/`onClick` and the scroll-to-section handler on
      `apps/preview`'s Membership overview
- [x] 2.2 Drop `benefits` from `TIER_CARD_COPY` in `loyalty-content.ts`

## 3. Manual (grade10-spec) (owner: @tangconst)

- [x] 3.1 Restate the card's row and the Tiers & Benefits "Reaches" note on
      `docs/prds/products/grade10-site/loyalty/membership.md`
