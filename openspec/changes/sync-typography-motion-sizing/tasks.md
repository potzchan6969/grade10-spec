# Tasks

- [ ] Resolve the four open decisions in the proposal; the font question gates all typography work.
- [ ] Fix `key()` in `scripts/figma/pull.mjs` so an ungrouped name keeps no leading dash (`--duration-stagger` currently normalizes to `-duration-stagger`).
- [ ] Add `TIMING` (`0.25s`) and `EASING` (`cubic-bezier(…)`) branches to `emit()`, and stop applying the blanket `FLOAT` → `px` rule to unitless values (`weight-*`, `scale-*`).
- [ ] Move `tokens.config.json` from two hardcoded collection roles to a declared list with a projection kind per collection; keep `Foundation` and `Semantic` expressible in the new form.
- [ ] Report, rather than ignore, any collection present in the dump but absent from the config.
- [ ] Land `Typography` as generated CSS variables plus `@theme inline` entries; apply the font decision, replacing the `@fontsource-variable/geist` dependency if Inter wins.
- [ ] Land `Motion`, after checking overlap with the existing `tw-animate-css` dependency.
- [ ] Design the `Sizing` variant projection and land it; it must follow `Typography`, since `size` and `leading` alias into it and `pull.mjs` dies on a dangling alias.
- [ ] Verify the round-trip property (push → dump → pull reproduces `tokens.json` byte for byte) with the new types in play.
- [ ] Run `pnpm run tokens:build`, `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test:stories:design-system`; commit regenerated CSS.

Related gap, tracked here so it is not lost:

- [ ] `.storybook/preview.tsx` sets `initialGlobals` to `colorTheme: "default"`, `mode: "light"`, so the entire story suite — including every axe check — runs against stock shadcn and never renders `.theme-acetrader`. The AceTrader theme has no automated coverage. Decide whether to switch the default, add a theme dimension to the test run, or accept it explicitly.
