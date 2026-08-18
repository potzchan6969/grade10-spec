# Sync Product List Header with Figma

**Author:** @constancetang - 2026-08-18

## Why

The published Figma set `Product / Product List Header`
([4288:14117](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117))
is now the header of search and product-list results: a title beside the count,
exclusive sort chips (with a second tap on Price reversing direction),
multi-select type chips, and an optional series dropdown. Code still renders
the earlier toolbar — a formatted count and a sort menu — so a consumer
copying the Dev Mode snippet, or a shopper comparing Storybook to the file,
meets a different control than the one design published.

## What would change

- **`ProductListHeader` matches the published set.** It displays a
  consumer-supplied title and result count, sort options as chips, optional
  multi-select chip filter groups, and optional exclusive dropdown filters.
  **BREAKING:** `title` is required; `sortTriggerLabel` is removed.
- **Sort chips follow the file's interaction notes.** One option is selected at
  a time. A paired option (Price) reports its pair on a second tap, and the
  trailing arrow rotates 180°.
- **Type and series are header filters, not catalog terms.** The header does
  not hardcode Pack, Box, or series names. Empty option lists hide that group,
  which is how a collection without a series filter is expressed. Type chips
  start unselected: that empty selection is unrestricted (Pack and Box
  products). Selecting Pack restricts to Pack; selecting both shows both.
- **`FilterChip` lands in the design system.** Figma set `Filter Chip`
  (`4313:28`) is the primitive the header composes. Size `md` / `sm`; selected
  and disabled are boolean gates; hover and focus are CSS pseudo-states. A
  `trailing` slot mirrors Figma's BOOLEAN + INSTANCE_SWAP; Price uses it for
  the direction icon.

## Capabilities

- **New Capabilities:** none
- **Modified Capabilities:** `shared-ui/store-product-listing`

## Impact

- `@grade10/design-system`: new `FilterChip` primitive, stories, and Code
  Connect template.
- `@grade10/ui`: `ProductListHeader`, `ProductBrowse`, `SortOption`, fixtures,
  and stories.
- `apps/preview` product list page: supplies `title`, drops
  `sortTriggerLabel`, and wires header filter groups.
- Consuming applications must pass `title` and stop passing `sortTriggerLabel`.

## Non-goals

- Changing `FilterPanel`. Type and series in the header are additional
  controls; the sidebar keeps the groups the consumer still supplies to it.
- Baking in "All Products", collection names, or "Search Results". Those
  strings stay consumer-supplied; the annotation describes what the
  application chooses, not a default in the package.
- Publishing Code Connect (writes to the shared Figma file).
- Restyling the rest of the listing surface.
