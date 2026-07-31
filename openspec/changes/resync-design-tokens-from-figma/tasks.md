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
- [x] Run `pnpm run lint` (passes) and `pnpm run typecheck` (16 errors, all pre-existing at HEAD in `apps/ui/src/stories/PaymentDialogs.stories.tsx`, unrelated to tokens).
- [x] Run `pnpm run test:stories:design-system` — 68 tests across 14 files pass.

Remaining:

- [ ] Resolve the five open decisions in the proposal with design and product.
- [ ] Apply the agreed radius decision: keep the derived `--radius-*` ladder or replace it with Figma's explicit `rounded-xs…4xl` scale.
- [ ] Decide whether an unmapped `slotMap` entry should also fail. `build-css.mjs` currently emits `--slot: /* unmapped: … */;`, a syntactically broken declaration that lints clean — the same soft-failure shape as the two hardened above, but only reachable through a `slotMap` misconfiguration, which is now a one-entry map.
- [ ] Read the axe output for contrast regressions from the new foreground pairs; `a11y.test` is `"todo"`, so violations are reported but not blocking.
- [ ] Review the design-system Storybook visually for the solid `--primary` / `--destructive` fills and the halved radius; capture component follow-up as a separate change.
- [ ] Update `DESIGN.md` where it describes the token flow, and resolve its open note asking which of the `.pen` file or Figma is the live design source. Its consumer snippet imports only `theme.css`, so an app following it literally never loads `.theme-acetrader` — confirm whether that is a doc gap.
- [ ] Scope a follow-up change for the `Typography`, `Motion`, and `Sizing` collections.
