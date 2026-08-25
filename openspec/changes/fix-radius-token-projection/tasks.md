# Tasks: fix radius token projection

One group. The preamble edit and the regenerated `theme.css` are one commit —
the second is a projection of the first, and splitting them leaves a commit
whose generated file contradicts its source.

No application-repo group: no export contract moves, so consumers pick the
corrected scale up on the next submodule bump without a source change.

## 1. Radius projection

- [x] 1.1 Make `A token-named utility resolves to that token's value` possible
      by deleting the seven derived `--radius-*` rungs from the `@theme inline`
      block in `packages/design-system/src/theme.preamble.css`, keeping
      `--radius-pill`, and leaving a comment recording why a rung must not be
      declared there.
- [x] 1.2 Regenerate with `pnpm run tokens:build` and commit the resulting
      `src/theme.css` alongside the preamble edit.
- [x] 1.3 Verify each rung compiles to a `var()` reference rather than a
      substituted expression, by compiling the design-system Storybook entry:
      `rounded-sm` … `rounded-4xl` all emit `border-radius: var(--radius-*)`,
      where before `sm`/`md`/`lg`/`xl`/`2xl`/`3xl`/`4xl` emitted
      `calc(var(--radius) * n)`.
- [x] 1.4 Verify the cascade resolves those references to the token values:
      Tailwind's defaults sit in `@layer theme`, the token build's `:root` is
      unlayered, and unlayered wins regardless of import order. Confirmed in
      compiled output — `--radius-xl: 0.75rem` layered, `--radius-xl: 12px`
      unlayered.
- [x] 1.5 Run `pnpm run typecheck` (pass) and `pnpm run lint` (0 errors, 4
      pre-existing warnings, none in the touched files).
- [x] 1.6 Run `pnpm run test:stories` — 526 tests pass, unchanged from before.
      Recorded in design.md as a coverage gap, not as evidence: no story
      asserts a border-radius, so nothing here would have caught the drift.

## 2. Verification left to a human

- [x] 2.1 Run `FIGMA_TOKEN=… pnpm run check:design-system` to zero errors and
      zero unexplained warnings. Run 2026-08-25: 0 errors, 27 warnings, all
      hygiene — Figma components with no code counterpart, missing JSDoc
      descriptions, one unmapped axis option. None in the radius pipeline.
- [x] 2.2 Run `FIGMA_TOKEN=… pnpm run figma:audit -- --all-blocks` from a
      checkout that also has `feat/add-store-home-blocks`, and confirm the
      `rounded-4xl` (hero) and `rounded-xl` (collection tile) rows that fail
      today now pass. Verified 2026-08-25 without that checkout, by auditing
      the three rows' nodes directly with the classes that branch's
      `audit.json` records: hero (`4171:9051`) `rounded-4xl` → 32, and both
      collection tiles (`4195:1056`, `4195:1051`) `rounded-xl` → 12. All pass.
- [ ] 2.3 Review the store-home hero against its Figma frame — an 11px corner
      move, the only change large enough to see.
