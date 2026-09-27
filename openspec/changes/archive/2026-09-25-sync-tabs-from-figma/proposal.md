**Author:** @tangconst - 2026-09-11

## Why

Tab and Tab List in Figma (`2121:1139`, `6586:6340`) draw a pill track with a
sliding white indicator and a list track with a sliding underline. Code still
shipped the older `default` / `line` names, a non-sliding underline, icon
padding that pinched the label, and a vertical orientation Figma does not
draw. Surfaces that compose Tabs — including the listing filter drawer —
cannot match design until the primitive matches the sets.

Metric: design-sync and Code Connect resolve Tab List `variant` to
`pill` | `list` without inventing a code-only rung; consumers stop passing
`variant="line"`.

## What Changes

- **`TabsList` variants** — `pill` (default) and `list`, matching Figma Tab
  List; retire `default` and `line`
- **Sliding indicators** — pill slides a white surface; list slides a 2px
  foreground underline; both honor `prefers-reduced-motion`
- **`fullWidth`** — optional flush list that shares width evenly across
  triggers (code-owned layout; Figma draws the hug list only)
- **Horizontal only** — drop vertical orientation from the public contract
- **Icon padding** — keep `Gap/gap-4` with leading/trailing icons
- **Code Connect** — map every Tab and Tab List VARIANT axis; migrate in-repo
  call sites (`line` → `list`)

## Non-Goals

- **New durable capability** under `openspec/specs/` — design-system
  primitives stay Figma-specified (`skip_specs: true`)
- **Segmented Control** — separate set; unchanged
- **Publishing Code Connect** — local templates only; publish is a manual step

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- none — this change sets `skip_specs: true` because a design-system
  primitive carries no durable requirement here (same pattern as
  `add-filter-chip`)

## Impact

- **`@grade10/design-system`** — `Tabs`, `TabsList`, `TabsTrigger`,
  `tabsListVariants`; stories; `tab.figma.ts` / `tab-list.figma.ts`
- **Call sites** — `tools/manual` change rail (`list`); listing filter drawer
  uses default `pill` + `fullWidth` under `adapt-listing-filter-drawer`
- **Consuming apps** — replace `variant="line"` with `variant="list"`; drop
  `orientation="vertical"`

## References

- Tab: https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2121-1139
- Tab List: https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6586-6340
