# FilterChip, the selectable chip primitive

**Author:** @constancetang - 2026-08-18

## Why

This change began as `sync-product-list-header`: a redesign of
`ProductListHeader` around a title row, sort chips, multi-select type chips,
and a series dropdown. `sync-product-list-page` replaced that layout with a
sort dropdown and applied-filter chips, and shipped it. The header this change
described no longer exists in Figma or in code, and the durable
`shared/ui/store-product-listing` requirement already describes the header
that does.

One piece outlived the redesign. The published `Filter Chip` set
([4313:28](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4313-28))
is the selectable chip: a chip that carries a selected state and an optional
trailing glyph. The design system's `Chip` is a different set (`4396:5319`) —
it always draws a dismiss X and has no selected axis, which is what an
applied-filter chip needs and what the header uses. Neither one can play the
other's part, so the selectable chip is its own primitive.

**Metric:** a surface needing a selectable chip composes one from the design
system rather than restyling `Chip` or drawing its own.

## What Changes

- **`FilterChip` in `@grade10/design-system`**, at
  `src/components/forms/filter-chip.tsx`, matching set `4313:28`. Size `md` /
  `sm`; `selected` and `disabled` are boolean gates, not cva axes, because the
  Code Connect template's `getEnum` produces booleans; hover and focus are CSS
  pseudo-states with no prop behind them. A `trailing` slot mirrors the set's
  BOOLEAN + INSTANCE_SWAP.
- **A Code Connect template** against `4313:28` mapping every option of every
  VARIANT property, including the `state` axis that maps to nothing, so the
  axis is accounted for rather than reported unmapped.
- **Exported from the package entry**, so a consuming surface can compose it.

## Capabilities

- **New Capabilities:** none
- **Modified Capabilities:** none

A design-system primitive carries no durable requirement in this repository —
`shared-ui` governs `packages/ui`, and `StatusIndicator` and the `IconButton`
rungs landed the same way, specified by their Figma set and their stories.
The change sets `skip_specs: true` for that reason.

## Impact

- `@grade10/design-system`: `FilterChip`, its stories, and its Code Connect
  template.

## Non-goals

- **The header redesign.** Title, sort chips, chip-filter groups, and the
  series dropdown are dropped, not deferred. `sync-product-list-page` settled
  that surface.
- **A consumer.** `FilterChip` has none yet. The sidebar filters use
  `CheckboxList` and the header's applied filters use `Chip`; both are the
  primitives their Figma sets call for. Giving the chip a home is the job of
  whichever surface next publishes a selectable chip.
- Publishing Code Connect, which writes to the shared Figma file.
