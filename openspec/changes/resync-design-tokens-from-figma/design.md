# Design

## Observed state

The live variables were read from `jlrBVwtKcun1NnJgohmFcn` through the Figma Plugin API, which returns the same data the `tokens:plugin dump` route produces. Five collections exist: `Foundation` (171 variables, mode `Mode 1`), `Semantic` (64, modes `AceTrader Dark` and `Light`), `Typography` (36), `Motion` (19), and `Sizing` (6, modes `default`, `sm`, `xs`). `pull.mjs` reads only the two named in `tokens.config.json`.

## Foundation: 171 in Figma against 177 in `tokens.json`

All 110 colour-ramp values are byte-identical across gray, slate, purple, red, orange, yellow, green, meme, teal, and blue at every step from 50 to 950. The `space-*` scale, the `container-*` scale, and the three existing blur steps also match exactly. The change is confined to the edges of the primitive set.

Six alpha primitives are renamed, not revalued. Figma moved from `<ramp>-opacity-<n>` to `<ramp>/<step>-opacity-<n>`, so `slate-opacity-white-10` becomes `slate-50-opacity-10`, `meme-opacity-meme-{10,20,50}` become `meme-400-opacity-{10,20,50}`, and `red-opacity-red-{10,20}` become `red-500-opacity-{10,20}`. Each keeps its hex value. Because `key()` in `pull.mjs` strips only the first path segment, `Colors/slate/50-opacity-10` normalizes to `slate-50-opacity-10` and the rename lands as a delete-plus-add pair in the `tokens.json` diff.

Two values change, both on the radius scale:

| Token | `tokens.json` | Figma |
| --- | --- | --- |
| `rounded-md` | `8px` | `6` |
| `rounded-lg` | `16px` | `8` |

`rounded-lg` is `--radius`. The preamble derives the full ladder from it (`--radius-sm: calc(var(--radius) * 0.6)` through `--radius-4xl: calc(var(--radius) * 2.6)`), so halving it halves every corner radius in the system.

Twenty-two primitives are added: `opacity-0/5/30/40/60/70/80/90/95/100`; `blur-sm`, `blur`, `blur-2xl`, `blur-3xl` at 4, 8, 40, and 64; `rounded-xs/xl/2xl/3xl/4xl`; and `slate-50-opacity-20`, `slate-50-opacity-30`, `slate-950-opacity-50`.

Twenty-one are removed, all unused alpha ramps: the five `gray-opacity-white-*`, the four `teal-opacity-teal-*`, the four `yellow-opacity-yellow-*`, `slate-opacity-white-{75,50,25,15}`, `red-opacity-red-{30,40,50}`, and `meme-opacity-meme-0`.

Seven more leave `Foundation` but are not deletions. `h-sm`/`h-md`/`h-lg`, `space-sm`/`space-md`/`space-lg`, and `rounded-button-sm` were promoted into the new `Sizing` collection, described below.

The `Opacity/*` variables are `FLOAT` in Figma and `emit()` suffixes non-colour floats with `px`, so the ten new steps land as `"5px"`, `"30px"`, and so on. That mirrors how the existing five are already stored and is left alone here rather than fixed opportunistically.

## Semantic: a rewrite, not a drift

Only `background`, `overlay`, and `field` appear in both sets, and all three keep their resolved value — `overlay` and `field` are now expressed as aliases (`slate-950-opacity-50`, `Base/input`) where the old file held a literal or a different alias path. The remaining 62 code tokens are gone and 61 Figma tokens are new.

The consequence for the pipeline is that `slotMap` becomes an identity map. Every one of its 40 entries points a shadcn slot at a Carbon-style name (`"--card": "Layer/layer-01"`) that no longer exists, while Figma now publishes `Base/card` directly. Keeping a non-identity `slotMap` would mean maintaining a translation layer with nothing left to translate.

Where a shadcn slot resolves differently after the pull:

| Slot | Resolves to today | Figma `AceTrader Dark` |
| --- | --- | --- |
| `--primary` | `meme-400` at 10% (`#3CD48D1A`) | `meme-400` solid |
| `--primary-foreground` | `meme-400` | `slate-800` |
| `--destructive` | red at 10% (`#ED41651A`) | `red-400` solid |
| `--secondary` | `slate-opacity-white-10` | `slate-800` |
| `--secondary-foreground` | `slate-200` | `slate-400` |
| `--muted` | `slate-800` | `slate-50-opacity-10` |
| `--muted-foreground` | `slate-400` | `slate-200` |
| `--popover` | `slate-800` | `slate-900` |
| `--success-foreground` | `meme-400` | `meme-300` |
| `--error-foreground` | `red-400` | `red-300` |

`--primary` and `--destructive` inverting from translucent tint to solid fill is the substantive design decision in this set. The current `tokens.json` documents the tint deliberately ("a fill, not a text colour; use Text/text-brand for label text"), and the new `primary-foreground: slate-800` confirms the intent is now a solid button with a dark label. `--background`, `--foreground`, `--card`, `--card-foreground`, `--accent`, `--border`, `--input`, `--ring`, `--warning`, `--error`, `--success`, and `--chart-1` through `--chart-5` resolve unchanged.

Two gaps close. `Status/info` and `Status/info-foreground` now carry real values (`blue-950`, `blue-300`), retiring the `layer-02` stand-in that `tokens.config.json` explicitly flags as neutral filler. `Chart/chart-6` and `Chart/chart-7` now exist as `yellow-400` and `teal-400`, matching the `categorical-6`/`categorical-7` the code already carried but never exposed as chart slots.

The 22 `Custom/*` tokens are all new to code: `control`, `control-hover`, `field-border`, `field-disabled`, `switch-track`, `muted-hover`, `primary-muted`, `primary-muted-hover`, `primary-muted-foreground`, `primary-border`, `destructive-muted`, `destructive-muted-hover`, `destructive-muted-foreground`, `destructive-border`, `destructive-ring`, `focus-ring`, `menu-border`, `menu-glass`, `warning-border`, `disabled`, and `disabled-foreground`. Their Figma descriptions read as captured component values ("Ghost button hover", "Subtle primary tint (selected rows, kbd)", "Frosted menu background"), so they most likely name colours currently hardcoded inside the primitives. This change adds them to the token contract and the `@theme inline` block; rewiring components to consume them is separate work.

## Migration risk

`themes/default.css` defines its tokens on `:root` and `.dark`, not on `.theme-default`, and it is imported ahead of `acetrader.css` (in `.storybook/tailwind.css` here, and in each consuming app's own entry CSS). `.theme-acetrader` therefore overrides a base layer that is always present, so a variable it leaves undefined resolves to a stock light-mode value rather than to nothing — wrong on a dark surface, but not broken at build time.

The sweep for retired references came back clean. Component source consumes only shadcn slot utilities and never references the Carbon-style names, because `@theme inline` never exposed them as Tailwind utilities; they lived only inside `acetrader.css` as input to the slot projection. Re-run the sweep if a future change starts emitting Tailwind utilities for the raw semantic set.

## Sizing: a new axis the pipeline cannot express

`Sizing` holds six variables across three modes, and it is where the component-sizing primitives went:

| Variable | `default` | `sm` | `xs` |
| --- | --- | --- | --- |
| `height` | 48 | 32 | 24 |
| `gap` | `{space-2}` | `{space-2}` | `{space-1}` |
| `rounded` | `{rounded-lg}` | `{rounded-md}` | `{rounded-sm}` |
| `padding-x` | 16 | 8 | 8 |
| `size` | `{size-base}` | `{size-sm}` | `{size-xs}` |
| `leading` | `{leading-base}` | `{leading-sm}` | `{leading-xs}` |

This is a better model than the flat `h-sm`/`h-md`/`h-lg` set it replaces: one named size selects a coherent bundle of height, padding, gap, radius, and type. It is also not a like-for-like migration — `height` runs 48/32/24 where the old scale ran 28/32/36, so adopting it re-scales controls rather than renaming them.

The pipeline cannot express it today. `tokens.config.json` models modes as *themes* — one selector per mode, `.theme-acetrader` — whereas `Sizing`'s modes are variants that must coexist on one page, which is a data-attribute or utility-class projection rather than a theme selector. `size` and `leading` also alias into `Typography`, so `Sizing` cannot land before that collection does. Wiring it is its own change.

## Deferred collections

`Typography` and `Motion` stay out of the pipeline in this change. Wiring them needs three things first. `key()` in `pull.mjs` leaves a leading dash on ungrouped names, because `.replace(/^-|-$/g, "")` strips a single anchored match — `--duration-stagger` normalizes to `-duration-stagger`. `emit()` has no branch for the `TIMING` or `EASING` resolved types, so a cubic-bezier easing would serialize as `[object Object]`. And Figma's `family-sans: Inter` contradicts the preamble's hardcoded `--font-sans: "Geist Variable"`, which is a design decision rather than a code fix.

## Validation

`tokens:build` regenerates both CSS outputs from `tokens.json`, so the check is that the generated files are committed and that no hand edit has drifted. Storybook for this package runs every story as a headless Chromium test with axe checks, which is the practical way to see the restyle across all primitives at once; `a11y.test` remains `"todo"`, so contrast regressions from the new foreground pairs are reported but not blocking, and must be read rather than assumed clean. `pnpm run typecheck` and `pnpm run lint` cover the rest. `check:components` and `build:components` are not required here, since `packages/ui-components` does not import this package.
