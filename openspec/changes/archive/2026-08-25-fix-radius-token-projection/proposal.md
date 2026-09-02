**Author:** @seankcw - 2026-08-24

## Why

`rounded-xl` renders an 11.2px corner. The token it is named after,
`Radius/radius-xl` in `tokens.json`, is 12px, and Figma draws 12. Every named
radius rung except `lg` is wrong the same way, and the error grows up the
scale:

| utility | renders | `tokens.json` |
| --- | --- | --- |
| `rounded-sm` | 4.8 | 4 |
| `rounded-md` | 6.4 | 6 |
| `rounded-lg` | 8 | 8 |
| `rounded-xl` | 11.2 | 12 |
| `rounded-2xl` | 14.4 | 16 |
| `rounded-3xl` | 17.6 | 24 |
| `rounded-4xl` | 20.8 | 32 |

`src/theme.preamble.css` declares a second radius scale inside `@theme inline`,
derived by multiplier from a single `--radius` knob — `--radius-xl:
calc(var(--radius) * 1.4)`. Because the block is `inline`, Tailwind substitutes
that expression into the utility instead of emitting `var(--radius-xl)`, so
`rounded-xl` compiles to `calc(var(--radius) * 1.4)` and never reads the
`:root` value the token build emits. In `.theme-grade10`, `--radius` is
`var(--radius-lg)` = 8px, and 8 × 1.4 = 11.2.

This is not cosmetic drift. `shared/ui/component-package` already requires that
"re-theming the token values re-brands the component without a source change" —
and for radius it does not: a designer changing `radius-xl` in Figma, pulling,
and rebuilding sees no change in anything using `rounded-xl`. The token is
decorative. `lg` agrees only because `--radius` happens to alias it.

The scale is also split against itself in the source. Both `rounded-md` (13
sites) and `rounded-(--radius-md)` (4 sites) are in use, and they render
different values — 6.4 and 6 — because the arbitrary form reads the variable
and the named form does not.

**Metric:** radius rungs whose rendered value equals their `tokens.json` value —
from one of seven to seven of seven, checked by `figma:audit` on every block
that binds a radius.

## What Changes

- **Delete the seven derived radius rungs** from the `@theme inline` block in
  `packages/design-system/src/theme.preamble.css`. With no override present,
  Tailwind's own non-inline registration emits `border-radius:
  var(--radius-xl)`, and the unlayered `:root` block the token build writes
  wins the cascade over Tailwind's layered defaults. Every rung then resolves
  to its `tokens.json` value.
- **A new requirement** on `shared/ui/component-package`: a utility named after
  a token resolves to that token's value, so the projection itself is testable
  rather than assumed.
- **Rendered geometry changes** on every component using a named radius rung —
  `sm` 4.8→4, `md` 6.4→6, `xl` 11.2→12, `4xl` 20.8→32. `lg` is unchanged.

## Non-Goals

- **`rounded-full`.** It compiles to Tailwind's `calc(infinity * 1px)` and
  ignores `--radius-full: 999px`. Visually identical at any real element size;
  reconciling it is a separate, lower-value change.
- **Removing `--radius`.** It is the shadcn contract slot, mapped in
  `tokens.config.json`, and a consumer may bind it. After this change nothing
  in the radius utilities consumes it, which is worth recording but not worth
  breaking.
- **`--radius-pill`.** Kept as-is; it names a value no Tailwind rung claims.
- **Migrating `rounded-(--radius-*)` call sites to the named form.** Both
  resolve correctly once this lands. Converging on one spelling is a cleanup.
- **The other `@theme inline` blocks.** The colour rungs reference their tokens
  correctly (`--color-destructive: var(--destructive)`); only radius derives.
- **A PRD.** Making a token mean what it says is not a product judgment.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/component-package`: add a requirement that a token-named utility
  resolves to that token's value.

## Impact

- **Design system (`@grade10/design-system`)** — this repository.
  `theme.preamble.css` loses seven declarations; `theme.css` is regenerated.
  Primitives using `rounded-sm` / `rounded-md` / `rounded-xl` render a corner
  0.8–1.2px different.
- **Shared UI (`@grade10/ui`)** — this repository. The store-home hero's
  `rounded-4xl` moves 20.8→32, the largest single change and the one the
  design was drawn for.
- **grade10 SPA / zzz-store** — pick up the corrected scale on the next
  submodule bump. No source change; no export contract moves.
- **`figma:audit`** — the radius rows that fail today pass without the audit
  changing.
