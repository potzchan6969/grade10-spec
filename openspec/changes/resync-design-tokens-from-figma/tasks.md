# Tasks

Done:

- [x] Repoint `tokens.config.json` at `jlrBVwtKcun1NnJgohmFcn` and rename the theme mode key from `AceTrader` to `AceTrader Dark`.
- [x] Pull with `FIGMA_DUMP=… pnpm tokens:sync`; review `git diff tokens.json` against the diff recorded in design (171 primitives + 64 semantic tokens, theme `acetrader` from mode `AceTrader Dark`).
- [x] Collapse `slotMap` to `--radius` alone and replace the stale `_slotMap_note`, including its guidance about the `--info` neutral stand-in.
- [x] Add `@theme inline` entries in `src/theme.preamble.css` for the 22 `Custom/*` tokens, `--chart-6`, and `--chart-7`.
- [x] Run `pnpm run tokens:build` and commit the regenerated `src/theme.css` and `src/themes/acetrader.css`.
- [x] Verify `.theme-acetrader` has no dangling `var()` references and no `/* unmapped */` slots.
- [x] Sweep the repository for all 96 retired semantic tokens and primitives, in raw `--token`, `var(--token)`, Tailwind utility, and `[var(--token)]` arbitrary-value forms — no hits in source. Verified non-vacuous with a positive control showing component source uses shadcn slot utilities exclusively.
- [x] Make an unmatched Figma mode fail the pull instead of warning and emitting an empty theme (`scripts/figma/pull.mjs`); the error lists the collection's available modes, and `tokens.json` is left untouched because the check precedes the write.
- [x] Make `build-css.mjs` fail rather than warn when a configured theme is absent from `tokens.json`; that warning is what left `acetrader.css` stale and dangling on the first sync attempt.
- [x] Verify both hardened paths by reproducing the original failure (bogus mode name; `themes: {}`), confirming exit code 1 and no partial write, then re-running the full sync clean.
- [x] Audit contrast directly from the generated CSS, against both `main` and this change — the axe route could not answer it, because the story suite never renders `.theme-acetrader`. Result: a net improvement. `--primary` 1.19 → 9.83 and `--destructive` 1.09 → 6.75 against the page, both previously below the 3:1 non-text floor. All text pairs pass AA before and after. The two remaining failures are `--border` (1.30, unchanged and pre-existing) and `--disabled-foreground` (2.33, a new token, exempt under WCAG 1.4.3/1.4.11).
- [x] Update `DESIGN.md`: correct the consumer snippet, which imported only `theme.css` and so left every slot undefined; document that only two of the five collections are pulled; record the hard-fail behaviour; and mark the Pencil flow historical with the evidence that Figma is live.
- [x] Scope a follow-up change for the `Typography`, `Motion`, and `Sizing` collections — see [`sync-typography-motion-sizing`](../sync-typography-motion-sizing/proposal.md), which also carries the Storybook theme-coverage gap.
- [x] Run `pnpm run lint` (passes) and `pnpm run typecheck` (16 errors, all pre-existing at HEAD in `apps/ui/src/stories/PaymentDialogs.stories.tsx`, unrelated to tokens).
- [x] Run `pnpm run test:stories:design-system` — 68 tests across 14 files pass. Note this is a regression guard only, not validation of this change: the suite renders the `default` theme.

Remaining:

- [ ] Resolve the five open decisions in the proposal with design and product.
- [ ] Apply the agreed radius decision: keep the derived `--radius-*` ladder or replace it with Figma's explicit `rounded-xs…4xl` scale.
- [ ] Decide whether an unmapped `slotMap` entry should also fail. `build-css.mjs` currently emits `--slot: /* unmapped: … */;`, a syntactically broken declaration that lints clean — the same soft-failure shape as the two hardened above, but only reachable through a `slotMap` misconfiguration, which is now a one-entry map.
- [ ] Review the design-system Storybook visually for the solid `--primary` / `--destructive` fills and the halved radius; capture component follow-up as a separate change. Requires switching the toolbar to the AceTrader theme, since it is not the default.
