# Tasks

Done:

- [x] Inventory what the seven portable primitives offer against what `packages/design-system` already ships, and identify the three with no counterpart — `Skeleton`, `Text`, `Stack`.
- [x] Add `skeleton.tsx`, `text.tsx`, and `stack.tsx` to `packages/design-system` with colocated stories, exported from `src/index.ts`. Axes are a port of the portable contract, not a new design; the missing Figma sets are recorded as an open decision in the proposal.
- [x] Type `Text` on `HTMLAttributes<HTMLElement>` rather than `ComponentProps<"span">` — a span-specific ref type does not spread onto the `h2`/`h3` tags the `as` prop allows.
- [x] Confirm `pnpm run test:stories:design-system` covers every new cva option: 138 tests pass, including one per non-default option of all three new components.
- [x] Recompose `FeaturedMarketStatus`, `FeaturedMarketContent`, `FeaturedMarketNavigation`, `FeaturedMarkets`, and `PaymentDialogs` on the design-system primitives via deep import paths, so the barrel's `sonner` and `next-themes` re-exports stay out of the bundle.
- [x] Pass `FeaturedMarketStat.tone` and `FeaturedMarketOutcomeValue.tone` straight to `Text`'s `tone` axis — the unions already match — and delete the `[data-tone=…]` rules that did the same job from `styles.css`.
- [x] Use the design-system Button's `loading` prop for `PaymentAction.loading` instead of substituting the label with "Loading…".
- [x] Delete the seven primitives and their fourteen exports from `src/index.ts`.
- [x] Rewrite `styles.css`: drop every primitive rule, drop the `--at-*` palette, repoint the remaining composite chrome at the design-system tokens, and add `.at-featured-panel` / `.at-featured-mobile__crypto` / `.at-featured-nav-item` for the three `Surface` uses with no `Card` equivalent.
- [x] Replace the `tsc` build with `scripts/build.mjs`: declarations from `tsc --emitDeclarationOnly`, JavaScript from an esbuild bundle whose externals are derived from `package.json`, and the design-system theme CSS copied to `theme/`.
- [x] Add a build-time check that fails if any emitted `.d.ts` references `@acetrader/design-system`, since tsc leaves the bare specifier and a consumer cannot resolve it.
- [x] Verify the bundle's remaining imports are exactly the declared dependencies — `react`, `react/jsx-runtime`, `echarts/*`, `@base-ui/react/*`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge` — and that no `@acetrader/design-system` specifier survives.
- [x] Add `theme` to the package `files` and `exports`, and add `packages/ui-components/theme` to the biome ignore list alongside `dist`; both are generated.
- [x] Add `@tailwindcss/vite` to `apps/ui`. It was absent, which no story had previously detected because every portable component was styled by hand-written CSS.
- [x] Rewrite `PortableInteractions` onto composites and repoint its motion assertions from `.at-skeleton` / `.at-badge` at `[data-slot="skeleton"]` / `[data-slot="badge"]`.
- [x] Delete `SharedButton.stories.tsx` and the `FoundationPrimitives` story — both demonstrate primitives this package no longer owns.
- [x] Opt the disabled-promo assertion out of user-event's pointer-events check; the design-system Button sets `pointer-events: none` when disabled, which turns a no-op click into a thrown error.
- [x] Run `pnpm run lint` — clean.
- [x] Run `pnpm run test:stories` — 35 + 138 tests pass.
- [x] Run `pnpm run typecheck` — the only failures are the 16 pre-existing errors in `apps/ui/src/stories/PaymentDialogs.stories.tsx` already recorded in [`adopt-figma-button-styling`](../adopt-figma-button-styling/tasks.md); verified identical against a stashed tree.
- [x] Run `pnpm run build:components` and commit the regenerated `dist/` and `theme/`.
- [x] Run `pnpm run check:components` — passes, but note it passes vacuously here: `rg` is not installed and the missing binary's exit status is swallowed, so no pattern was actually searched.

Remaining:

- [ ] Draw and publish Figma component sets for `Skeleton`, `Text`, and `Stack`, then add a `.figma.ts` template for each. Until then `pnpm run check:design-system` reports them as code with no design, and the three are unverifiable against any drawn source.
- [ ] Run `pnpm run check:design-system`. Not run in this change: it needs `FIGMA_TOKEN` or a `FIGMA_DUMP`, neither of which was available, and it exits 1 rather than skipping when both are absent.
- [ ] Decide whether Badge needs a success rung and whether Button needs an icon-only rung. Both are currently applied through `className` at the call site — Badge once, Button three times counting `dialog.tsx`.
- [ ] Validate the bundled artifact from an actual submodule consumer: `pnpm add file:…/packages/ui-components` into a clean Tailwind v4 app, import a composite, and confirm no unresolved import and no missing utility.
- [ ] `packages/ui-components/scripts/check-stateless-components.sh` reports success when `rg` is not installed, because the missing binary's exit status is swallowed by the `if`. Unrelated to this change and left alone, but it means the app-neutrality check is currently vacuous on a machine without ripgrep.
