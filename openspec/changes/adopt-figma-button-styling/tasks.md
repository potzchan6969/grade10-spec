# Tasks

Done:

- [x] Read the Figma Button set (`jlrBVwtKcun1NnJgohmFcn`, `86:3459`) property-by-property and confirm `button.figma.ts` maps every `Type` and `State` option and every property key correctly — it does; the divergence is entirely on the component side.
- [x] Read `get_variable_defs` per variant node (not the component-set aggregate) to attribute each fill/text/border binding to a specific `Type`/`State` pair, and record the result as a table in the proposal.
- [x] Confirm `Base/primary` and `Base/primary-foreground` are bound nowhere in the set, establishing that the Figma Button never uses a solid primary fill.
- [x] Rebind `default`, `secondary`, `outline`, `ghost` and `destructive` in `buttonVariants` to the tokens Figma binds, including the distinct `Base/accent` versus `Custom/muted-hover` hover treatments.
- [x] Replace `disabled:opacity-50` with `disabled:text-disabled-foreground` in the base string plus `disabled:bg-disabled` on the three filled variants only, matching Figma's split between filled and borderless disabled states.
- [x] Repoint `aria-invalid` at `--destructive-border` / `--destructive-ring` and drop the `dark:` overrides those dedicated tokens make redundant.
- [x] Rebuild the size axis as the three rungs of "Buttons Size Reference" (`96:546`) — `sm` 24/8/4/4, `md` 32/8/8/6, `lg` 48/16/8/8 — named after the `rounded` binding and with each type pair mapped to its exact Tailwind default. Supersedes an earlier pass in this change that read the component set's single drawn size as the default and moved `md` to 48px; 48px is `lg`, and `md` stays 32px, which is what it already was.
- [x] Drop `variant="link"`, the `xs` rung, and all four `icon-*` rungs — none exist in the Figma Button set. Repoint `Dialog`'s close button, the only in-repo consumer, onto `className` sizing.
- [x] Hardcode `size="lg"` in the Code Connect template and document why: the set exposes no Size VARIANT, its instances carry size as a Sizing-collection mode override that no getEnum can reach, and every variant is drawn at 48px while the component default is `md`.
- [x] Backfill the eleven `Custom/*` slots the button binds into `src/themes/default.css`, derived via `color-mix` from stock slots, restated in both `:root` and `.dark`.
- [x] Confirm `scripts/figma/seed-default.mjs` tolerates the new `color-mix()` declarations — `convert()` returns `null` and the values land on the `skipped` warning list rather than failing the seed.
- [x] Fix the Loading label in `button.figma.ts` to read the visible static text layer instead of the hidden `Label#318:0` property, and correct the two stale comments about Loading and about `size` being a fallback.
- [x] Add a `loading` prop implementing Figma's `Type=Loading` — leading `LoaderCircleIcon`, `aria-busy`, `data-loading`, and `disabled` derived internally so the disabled tokens paint it. Export `ButtonProps`; both additions are additive and backward compatible.
- [x] Switch the Code Connect template to emit ` loading` instead of the ` disabled` stand-in, and stop OR-ing `loading` into `disabled` so the snippet does not print a redundant prop.
- [x] Add `Disabled`, `DisabledOutline` and `Loading` stories, since the disabled treatment changed from an opacity filter to a token pair.
- [x] Verify that destructuring `children` to inject the spinner did not break base-ui's `render={<Button />}` composition, which `dialog.tsx` and several overlay stories depend on. Proved with a temporary play-function probe asserting `DialogClose render={<Button />}` still renders its label, and proved non-vacuous by deleting `{children}` and watching the probe fail. Probe removed afterwards — see the note below.
- [x] Run `pnpm run lint` — passes after `lint:fix` reformatted the multi-line `color-mix()` declarations.
- [x] Run `pnpm run typecheck` — 16 errors, byte-identical to the count on a stashed tree, all pre-existing in `apps/ui/src/stories/PaymentDialogs.stories.tsx` and unrelated.

Remaining:

- [ ] **Restructure the Button component set with design.** Two defects, one conversation — both are Figma-side modelling problems rather than code gaps, and together they are the highest-value remaining work. Neither changes `button.tsx`, whose props already have the shape the fix would land on; what changes is that the template loses its workarounds and Dev Mode starts emitting correct snippets.

  The set has **16 variants** today: five Types × three States, plus `Loading` × one. Note that the API's `instanceCount: 18` counts instance usages in the file, not variants — do not read it as the matrix size.

  **1. Size is not a VARIANT axis.** The design defines three sizes in "Buttons Size Reference" (`96:546`), but varies them by switching the Sizing collection's mode per instance. Modes are not component properties, so no `getEnum` can reach them. Consequences: the template hardcodes `size="lg"`, Dev Mode cannot tell a consumer which of the three sizes an instance is, and `check-components.mjs` reports `size` as reaching no Figma variant property — a warning that cannot be resolved while this stands. Fix: add a `Size` VARIANT, then replace the hardcoded value with a `getEnum` and omit the prop when the rung is `md`.

  **2. `Loading` is modelled as a Type.** It is a state, not a type, and the set shows it: `Loading` is the only Type with a single State, making it a ragged row in an otherwise complete cross-product. It is orthogonal to Type — a loading Danger button cannot be drawn today. It contributes no styling of its own, binding exactly the `Custom/disabled` pair that every `State=Disabled` variant binds, so the whole delta is a spinner glyph. It also breaks the component's own TEXT property: the variant hides the layer bound to `Label#318:0` and shows a static "Loading" layer instead, which emitted a stale label until the template was changed to read the visible layer. And it forces `button.figma.ts` to call `getEnum("Type", …)` twice over one axis to produce two unrelated props.

  Fix: make `Loading` a value of `State` (`Default` / `Hover` / `Disabled` / `Loading`). The matrix becomes regular, every Type can be loading, and the mapping collapses to one `getEnum('State', …)` yielding both `disabled` and `loading`. The cheaper alternative — a BOOLEAN that toggles the spinner, used with `State=Disabled` — needs fewer variants but depends on designers setting two things in the right combination and permits undesigned states; prefer the regular matrix.

  Variant cost of the combined change, for the conversation with design:

  | Structure | Variants |
  | --- | --- |
  | Today (ragged) | 16 |
  | `Loading` becomes a `State` value | 20 |
  | plus `Size` × 3 | 60 |
  | minus `Hover`, which has no code counterpart | 45 |
  | `Loading` as a boolean instead, minus `Hover`, with `Size` | 30 |

  `Hover` is the cheapest third of the matrix to drop: it is a CSS pseudo-state with no prop behind it, the template already emits nothing for it deliberately, and Figma can express it through interactive styling. Note that `Disabled` cannot become a BOOLEAN — Figma booleans toggle layer visibility and cannot restyle a fill, and disabled changes the background to `Custom/disabled`.
- [ ] Resolve the remaining open decisions in the proposal with design and product.
- [ ] Review the design-system Storybook visually with the toolbar switched to the AceTrader theme, which is not the default. This inherits the theme-coverage gap recorded in [`sync-typography-motion-sizing`](../sync-typography-motion-sizing/proposal.md): the story suite renders the `default` theme, so it exercises the backfilled slots rather than the designed ones.
- [ ] Run `pnpm run test:stories:design-system` as a regression guard. Note it validates the `default` theme only, so a pass says nothing about the acetrader rendering this change is about.
- [ ] Re-audit contrast for the new pairs. The resync audited token values against the page background; this change puts `primary-muted-foreground` on `primary-muted` and `destructive-muted-foreground` on `destructive-muted`, which are text-on-tint pairs that audit did not cover.
- [ ] Publish the Code Connect mapping. `get_code_connect_map` on `86:3459` returns `{}`, so Dev Mode shows no connected code for the Button even though the template is correct.
- [ ] Decide whether `packages/design-system` stories may carry `play` functions, then add a permanent guard for `render={<Button />}` child composition. The package's suite is smoke-only today — no design-system story has a `play`, and during this change the full 14-file suite passed with `{children}` deleted from Button, so this class of regression is currently invisible. `apps/ui/src/stories` does use `play`, so the convention exists in the repository but not in this package. Deferred rather than imposed because [`define-ui-component-interaction-test-scope`](../define-ui-component-interaction-test-scope/proposal.md) owns that decision.
- [ ] Give Figma's `Link` (`96:341`) a code component and its own `.figma.ts`. It is the file's second published component set and has no counterpart in code — the `check:design-system` warning about it, recorded in the retarget commit as "inherent", is a real gap rather than a naming artefact. Until then `variant="link"` remains a stock leftover that no Figma node maps to.
- [ ] Decide whether `variant="link"` should survive that work. Nothing in the repository uses it but its own story, so removing it is cheap now and a breaking export change later.
- [ ] Confirm with design that Button should keep modelling the leading/trailing icons as `data-icon` children rather than as the two component properties Figma exposes. The children form is the package convention (`badge.tsx`, `tabs.tsx`) and no primitive here takes a `ReactNode` slot prop, so switching Button alone would split the package.
