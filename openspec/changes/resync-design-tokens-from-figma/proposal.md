# Resync design tokens from Figma

PRD: Not applicable. This change updates the design-token contract and its sync pipeline. It carries product-visible restyling that originates as a designer decision recorded in Figma, not as a new product requirement; see Open decisions for whether the restyle warrants a PRD.

## Why

The Figma variables file has been restructured and is now ahead of `packages/design-system/tokens.json`. Two defects make the current pipeline unable to observe that:

1. `tokens.config.json` names a different file (`xRzLvpBKtFAr1XrjxjnJNy` / `Sean---DS-POC`) than the live design source (`jlrBVwtKcun1NnJgohmFcn` / `Sean-x-Constance`).
2. The Semantic collection's mode was renamed `AceTrader` to `AceTrader Dark`. `scripts/figma/pull.mjs` only warns on an unmatched mode, so `pnpm tokens:sync` would write `themes: {}` and `tokens:build` would emit an empty `.theme-acetrader` block — a silent theme wipe rather than a visible failure.

The design change itself is a semantic-layer rewrite. Figma replaced the Carbon-style vocabulary (`layer-01`, `text-primary`, `icon-*`, `link-*`, `support-*`, `categorical-*`) with the shadcn contract expressed directly (`Base/*`, `Status/*`, `Chart/*`, `Sidebar/*`), plus a 22-token `Custom/*` extension set. Of 65 code semantic tokens and 64 Figma semantic tokens, only `background`, `overlay`, and `field` survive as shared keys. The `slotMap` projection in `tokens.config.json` therefore references 40 names that no longer exist.

## Scope

- Repoint `tokens.config.json` at the live file and rename the theme's Figma mode key to `AceTrader Dark`.
- Pull the Foundation and Semantic collections into `tokens.json` and regenerate `src/theme.css` and `src/themes/acetrader.css`.
- Collapse `slotMap` to the identity projection now that Figma models the shadcn contract directly.
- Extend `src/theme.preamble.css` with `@theme inline` entries for the 22 new `Custom/*` tokens and for `--chart-6` / `--chart-7`.
- Retire the `--info` / `--info-foreground` neutral stand-in in favour of the real `Status/info` values.
- Record the primitive renames, additions, and removals, and confirm the removals with the designer before landing them.
- Record the new `Sizing` collection, which absorbs the component-sizing primitives, as follow-up work.

## Consumer impact

`@acetrader/design-system` is consumed from source and has no `dist/`, so this ships as a token-value and CSS-variable change with no export signature change. Consuming apps that reference only shadcn slot names see a restyle, not a break.

A repository-wide sweep for references to the 62 retired semantic tokens and the retired primitives found none. Component source consumes only shadcn slot utilities (`bg-primary`, `text-muted-foreground`, `ring-destructive`, …), and there is no arbitrary-value usage of the form `bg-[var(--…)]` anywhere. The Carbon-style names were never exposed as Tailwind utilities — `@theme inline` only ever mapped the shadcn slots — so they existed purely as an intermediate layer inside `acetrader.css` feeding the slot projection. That is why a rewrite this large is contained.

The failure mode was worth checking because it is quiet rather than loud: `themes/default.css` defines its tokens on `:root`, so any slot left undefined by `.theme-acetrader` resolves to a stock light-mode value on a dark surface instead of failing.

`packages/ui-components` does not import this package today, so its `dist/` does not need regenerating for this change.

The restyle is visible. `--primary` and `--destructive` move from translucent tints to solid fills (`meme-400`, `red-400`), `--primary-foreground` inverts to `slate-800`, and `--radius` halves from `16px` to `8px`, which rescales every derived corner in the preamble ladder.

## Non-goals

The Typography (36 variables), Motion (19), and Sizing (6) collections are not wired into the pipeline here. `pull.mjs` reads only the configured primitive and semantic collections. Typography and Motion need two `pull.mjs` fixes plus a resolved font conflict; Sizing needs a multi-mode projection the pipeline does not have today. See design.

The Semantic `Light` mode is not synced. Its `Base/*` and `Chart/*` values are still stock shadcn defaults and all 22 `Custom/*` Light values are `#FFFFFF` placeholders.

The code-only `default` theme (`src/themes/default.css`) stays outside the pipeline. No component source is restyled to consume the new `Custom/*` tokens in this change.

## Open decisions

| Question | Owner | Note |
| --- | --- | --- |
| Are the 21 removed primitives intentional deletions? | Design | Unused alpha ramps only. The seven component-sizing primitives are not deletions — they moved into the new `Sizing` collection. |
| When does `Sizing` get wired up, and do its values supersede the old ones? | Design + Eng | `height` is 48/32/24 against the old `h-sm`/`h-md`/`h-lg` of 28/32/36, so this is a re-scale, not a lift-and-shift. |
| Derived radius ladder or Figma's explicit one? | Design + Eng | The preamble derives `--radius-sm…4xl` by multiplier from `--radius`. Figma now ships an explicit `rounded-xs…4xl` scale that does not agree with the derived values. |
| Does the restyle need a PRD? | Product | `--primary` and `--destructive` changing from tint to solid fill alters button appearance across every consuming app. |
| `family-sans: Inter` or `--font-sans: "Geist Variable"`? | Design | Figma Typography and `theme.preamble.css` currently disagree. Blocks the Typography non-goal above. |
