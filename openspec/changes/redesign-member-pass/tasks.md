## 1. Rename the export (grade10-spec)

- [x] 1.1 Rename `member-card.tsx` to `member-pass.tsx` and its story
      likewise; the component becomes `MemberPass` with `MemberPassCopy`,
      `MemberPassProps`, `MemberPassState` and `MemberPassVariant`, and
      the `data-slot` attributes become `member-pass*`
      `grade10-site-loyalty-programme-SC-125`, `grade10-site-loyalty-programme-SC-mp2`
- [x] 1.2 Re-export the `MemberPass*` names from
      `packages/ui/src/index.ts` in place of the `MemberCard` names;
      `ScanPlate` leaves with them — the pass draws its square directly
      `grade10-site-loyalty-programme-SC-125`
- [x] 1.3 Rename the block story to `Loyalty/Membership/Blocks/MemberPass`
      and repoint the preview Membership screen and `loyalty-content.ts`
      to the new names

## 2. Rebuild the pass (grade10-spec)

- [x] 2.1 Rewrite `member-pass.tsx` to the Figma pass: the `variant` skin —
      silver, gold or black — the Grade10 mark, tier badge and account
      `email` in place of `displayName`; the consumer's token in the QR
      verbatim, the square alone — no typed code beside it; the
      countdown, the refresh control's busy state and the refused-refresh
      toast; the square moving out and in on a fresh token, instantly
      under reduced motion; no `expired` rendering — the consumer rotates
      the code out before it lapses
      `grade10-site-loyalty-programme-SC-mp1`, `grade10-site-loyalty-programme-SC-mp2`, `grade10-site-loyalty-programme-SC-mp3`, `grade10-site-loyalty-programme-SC-mp4`, `grade10-site-loyalty-programme-SC-mp5`, `grade10-site-loyalty-programme-SC-mp6`, `grade10-site-loyalty-programme-SC-mp7`, `grade10-site-loyalty-programme-SC-mp8`
- [x] 2.2 Remove `ScanPlate` and its exports — with the short code gone
      it has no consumer left
- [x] 2.3 Rewrite `member-pass.stories.tsx` under
      `Loyalty/Membership/Blocks/MemberPass`: `Default`, `Silver`,
      `Black`, `PassNeverMintsItsCode`, `CodeRotates`, `Refreshing` and
      `RefreshFailed`
- [x] 2.4 Update the preview: `loyalty-content.ts` carries
      `MEMBER_PASS_COPY` and the member's email;
      `membership.stories.tsx` draws the pass with `variant`; a new
      `member-pass.stories.tsx` draws `Loyalty/Membership/Screens/Member Pass`
      — the pass alone, the code counting down and minting afresh, a
      screen wake lock held while the page is up
- [x] 2.5 Rename `membership.card` keys in all four locales —
      `refreshesIn` in place of `fallbackCode`, `shortCode`, `expired`,
      `expiresIn` and `secondsUnit`; `membership.page.card` names the
      member pass
- [x] 2.6 Update `docs/prds/products/grade10-site/loyalty/membership.md`:
      the section row and the `## Member Pass` section name the email,
      the standalone phone page with its wake lock, the code-area swap
      and the refresh rules; the story embeds repoint to
      `loyalty-membership-blocks-memberpass--*`
- [x] 2.7 Record `packages/ui/src/blocks/loyalty-membership/audit.json`
      for the pass's class map and run `pnpm design-sync:audit`
- [x] 2.8 Verify: `tsc` on `@grade10/ui` and `apps/preview`,
      `pnpm storybook:check`, `pnpm test:stories`, biome on the touched
      files, the i18n catalog test

## 3. The walk - the pass held up at a till (grade10-spec)

- [ ] 3.1 Walk `grade10-site-store-membership-US-02` on the workbench:
      `Loyalty/Membership/Screens/Member Pass` draws the pass alone at a
      phone width — the code counting down, Refresh minting a new square
      that swaps in and out of view, and the screen held
      awake while the page is up
      (`grade10-site-loyalty-programme-SC-mp2`, `grade10-site-loyalty-programme-SC-mp3`, `grade10-site-loyalty-programme-SC-mp4`, `grade10-site-loyalty-programme-SC-mp5`)
