## 1. The block (grade10-spec) (owner: @tangconst)

- [x] 1.1 Create `packages/ui/src/blocks/loyalty-top-ups/top-up-pack-card.tsx`
      composing `RadioCard`, `Badge` and the tooltip: points count, price,
      struck list price and save badge where supplied, disabled reason in
      the accessible name and a tooltip
      `grade10-site-loyalty-programme-SC-363`, `grade10-site-loyalty-programme-SC-364`
- [x] 1.2 Re-export `TopUpPackCard`, `TopUpPackCardCopy` and
      `TopUpPackCardProps` from `packages/ui/src/index.ts` under
      `// shared-ui/loyalty-top-ups`
      `grade10-site-loyalty-programme-SC-363`
- [x] 1.3 Add `top-up-pack-card.stories.tsx` as
      `Loyalty/Top Ups/Blocks/TopUpPackCard` with Pack and Over Limit

## 2. The picker consumes it (grade10-spec) (owner: @tangconst)

- [x] 2.1 Replace the local pack tile in `top-up-dialog-prototype.tsx` with
      `TopUpPackCard` from `@grade10/ui`
