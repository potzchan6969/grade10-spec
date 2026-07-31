# Sync the Typography, Motion, and Sizing collections

PRD: Not applicable. This extends the token pipeline to cover collections it currently ignores. It becomes product-visible only if the font decision below changes the typeface.

Follows [`resync-design-tokens-from-figma`](../resync-design-tokens-from-figma/proposal.md), which brought `Foundation` and `Semantic` up to date and recorded these three as out of scope.

## Why

`scripts/figma/pull.mjs` reads exactly the two collections named in `tokens.config.json` — `primitiveCollection` and `semanticCollection`. The Figma file carries three more, and they are dropped without a warning:

| Collection | Variables | Modes |
| --- | --- | --- |
| `Typography` | 36 | `AceTrader Dark` |
| `Motion` | 19 | `Mode 1` |
| `Sizing` | 6 | `default`, `sm`, `xs` |

A green `tokens:sync` therefore does not mean the file landed. That is the same class of quiet failure as the renamed-mode defect fixed in the previous change, and it is worth closing for the same reason.

The three are not equivalent in difficulty. `Typography` and `Motion` are flat single-mode sets blocked on two `pull.mjs` bugs and one design decision. `Sizing` needs a projection shape the pipeline does not have.

## Scope

- Let `tokens.config.json` declare more than two collections, and give each a projection kind rather than assuming primitive-or-semantic.
- Fix `key()` so an ungrouped name keeps no leading dash, and teach `emit()` the `TIMING` and `FLOAT`-as-unitless cases plus `EASING` as a cubic-bezier.
- Land `Typography` and `Motion` as generated CSS variables and `@theme inline` entries.
- Design and land a variant projection for `Sizing`.
- Resolve the `family-sans` conflict before any typography value ships.

## Consumer impact

No export signature changes; the package is consumed from source. Consumers gain typography, motion, and sizing tokens they can reference, and lose nothing.

The exception is the font. Figma's `family-sans` is `Inter`; `src/theme.preamble.css` hardcodes `--font-sans: "Geist Variable"` and imports `@fontsource-variable/geist`. Adopting Figma's value changes the typeface of every consuming app and swaps a bundled font dependency. That is a visible product change, not a token refresh, and it is why the decision gates this change rather than riding along inside it.

## Non-goals

No component is rewired to consume the new tokens. No Storybook story is restyled. The Semantic `Light` mode stays unsynced — its `Custom/*` values are still `#FFFFFF` placeholders. The `default` theme remains code-only.

## Open decisions

| Question | Owner | Note |
| --- | --- | --- |
| `Inter` or `Geist Variable`? | Design | Blocks all of `Typography`. If Inter wins, the `@fontsource-variable/geist` dependency is replaced, not just the CSS value. |
| How should `Sizing` variants be selected in markup? | Eng + Design | Data attribute (`[data-size="sm"]`), utility class, or component prop mapped in code. Determines whether the tokens are CSS at all. |
| Should `Motion` become Tailwind theme entries or raw variables? | Eng | `tw-animate-css` is already a dependency; overlap needs checking before adding a parallel vocabulary. |
| Do the `Sizing` heights supersede the retired `h-*` scale? | Design | `height` is 48/32/24 against the old 28/32/36 — adopting it re-scales controls rather than renaming them. |
