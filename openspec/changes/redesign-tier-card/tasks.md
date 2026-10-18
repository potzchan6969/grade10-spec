## 1. Rename the export (grade10-spec)

- [x] 1.1 Rename `membership-summary.tsx` to `tier-card.tsx` and its story
      likewise; the component becomes `TierCard` with `TierCardCopy` and
      `TierCardProps`, and the `data-slot` attributes become `tier-card*`
      `grade10-site-loyalty-programme-SC-123`, `grade10-site-loyalty-programme-SC-125`
- [x] 1.2 Re-export `TierCard`, `TierCardCopy` and `TierCardProps` from
      `packages/ui/src/index.ts` in place of the `MembershipSummary` names
      `grade10-site-loyalty-programme-SC-123`
- [x] 1.3 Rename the block story to `Loyalty/Profile/Blocks/TierCard` and
      repoint the preview Membership screen and `loyalty-content.ts` to the
      new names

## 2. Rebuild the card (grade10-spec)

- [x] 2.1 Rewrite `tier-card.tsx` to the Figma card: the `variant` skin —
      silver, gold or black — the balance with its formatted checkout worth,
      the retention count and progress only where a threshold is supplied,
      the earn line and the Benefits affordance, the whole card a link where
      `href` is given; `renewalDate`, `tierValidity` and `balanceExpiry` leave
      the props and `TierCardCopy` becomes
      `{ balance, points, worthSuffix, qualifying, benefits }`; export
      `TierCardVariant` from `packages/ui/src/index.ts`
      `grade10-site-loyalty-programme-SC-123`, `grade10-site-loyalty-programme-SC-255`, `grade10-site-loyalty-programme-SC-256`, `grade10-site-loyalty-programme-SC-257`
- [x] 2.2 Rewrite `tier-card.stories.tsx` under
      `Loyalty/Profile/Blocks/TierCard`: `Silver`, `Gold`, `Black`,
      `ThresholdReached`, `NoPoints`, `OpensBenefits` and `Pressed`; the
      expiry-line stories leave
- [x] 2.3 Update the preview: `loyalty-content.ts` carries `worth`,
      `retentionLine` and `earnLine` on the membership view and drops the
      expiry helpers; `membership.stories.tsx` draws `variant="gold"` and a
      placeholder Tier & Benefits `href`
- [x] 2.4 Update `docs/prds/products/grade10-site/loyalty/membership.md`: the
      Membership row names the tier skin, the worth, the keep-or-upgrade run
      and the Benefits link; the expiry-line bullet becomes the no-expiry
      rule with the relocation marked ❓ on the Tier & Benefits page 🚧
- [x] 2.5 Verify: `tsc` on `@grade10/ui` and `apps/preview`,
      `pnpm storybook:check`, biome on the touched files

## 3. The walk - the membership page under the new card (grade10-spec)

- [ ] 3.1 Walk `grade10-site-loyalty-programme-US-04` on the workbench:
      `Loyalty/Profile/Blocks/TierCard` draws each skin — silver and gold
      with the retention run, black with the crown and none; the whole card
      is the Benefits link; and `Loyalty/Profile/Screens/Membership` draws
      the gold member with no expiry line
      (`grade10-site-loyalty-programme-SC-123`, `grade10-site-loyalty-programme-SC-255`, `grade10-site-loyalty-programme-SC-256`, `grade10-site-loyalty-programme-SC-257`)
