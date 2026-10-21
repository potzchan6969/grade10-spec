## 1. The tier info card (grade10-spec)

- [x] 1.1 Add `packages/ui/src/blocks/loyalty-membership/tier-info-card.tsx` —
      the tier name, the ask caption and the benefits behind checks, the
      held rung wearing the primary border and its tinted shadow where
      `currentTier` is passed; export `TierInfoCard` and `TierInfoCardProps`
      from `packages/ui/src/index.ts`
      `grade10-site-loyalty-programme-SC-258`, `grade10-site-loyalty-programme-SC-125`
- [x] 1.2 Add `tier-info-card.stories.tsx` under
      `Loyalty/Membership/Blocks/TierInfoCard` — `Silver`, `Gold`, `Black`,
      the held and unheld emphasis

## 2. The tier ladder (grade10-spec)

- [x] 2.1 Add `tier-ladder.tsx` — a card drawing the rungs through the
      design-system Stepper: earned rungs completed, the held rung in
      progress, unearned rungs upcoming, no connector into an
      `invitationOnly` rung; an invitation-held rung leaves every other rung
      upcoming and no qualifying pill or footnote renders; the qualifying
      pill and footnote render only where both figures arrive. Export
      `TierLadder`, `TierLadderCopy`, `TierLadderProps` and `TierLadderRung`
      `grade10-site-loyalty-programme-SC-259`, `grade10-site-loyalty-programme-SC-260`
- [x] 2.2 Add `tier-ladder.stories.tsx` — `Gold`, `Silver` (Silver-held
      ladder), `Black` (invitation-held, qualifying suppressed) and a
      story asserting the pill waits for both figures

## 3. The mechanics card (grade10-spec)

- [x] 3.1 Add `how-points-work.tsx` — icon rows stacked on a narrow
      viewport and paired across a wide one, icons and words through props;
      export `HowPointsWork`, `HowPointsWorkItem` and `HowPointsWorkProps`
      `grade10-site-loyalty-programme-SC-261`
- [x] 3.2 Add `how-points-work.stories.tsx` asserting the preview's own
      copy states the programme's values — a point redeems a Hong Kong
      dollar, points arrive when an order completes, the balance lapses
      after twelve months with no activity

## 4. The surface (grade10-spec)

- [x] 4.1 Add `apps/preview/src/pages/loyalty/membership/tiers-benefits.stories.tsx` —
      the standalone Tiers & Benefits page: breadcrumbs, the semibold title,
      the ladder, the rung cards and the mechanics card, on small and wide
      viewports
- [x] 4.2 Add `ladderCaption`, the Black `ask` and `HOW_POINTS_WORK` to
      `loyalty-content.ts`, and point the Membership story's `TierCard`
      link at the new screen
- [x] 4.3 Update `docs/prds/products/grade10-site/loyalty/membership.md`:
      the Tiers & Benefits section states the page's parts and its entry
      points; the expiry-line ❓ stands — the surface states the rule, the
      member-dated line has no designed home
- [x] 4.4 Verify: `tsc` on `@grade10/ui` and `apps/preview`,
      `pnpm storybook:check`, biome on the touched files
      (`packages/ui/tsconfig.tsbuildinfo` regenerated, uncommitted)

## 5. The walk - a member reads their standing and the mechanics (grade10-spec)

- [ ] 5.1 Walk `grade10-site-loyalty-programme-US-05` on the workbench:
      `Loyalty/Membership/TiersBenefits` draws the gold member's ladder and
      rung cards on a phone and on a wide viewport, and the Black-held story
      shows every other rung upcoming with no qualifying line
      (`grade10-site-loyalty-programme-SC-258`, `grade10-site-loyalty-programme-SC-259`)
