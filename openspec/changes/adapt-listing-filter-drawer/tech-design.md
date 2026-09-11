## Context

`ProductBrowse` used to stack `FilterPanel` full width below `lg`. Facets and
search fought the grid for the first screen. Cart already uses design-system
`Drawer`; listing needs the same from the left. Tabs are synced in
`sync-tabs-from-figma` (default pill).

## Goals / Non-Goals

**Goals:**

- Below `lg`: Filter button left of search; left drawer for facets only;
  Clear / Done; Worlds | Types as pill tabs
- At `lg+`: sidebar with search above stacked groups
- Controlled selection/search; drawer open is local UI state
- Small-viewport list header: count one line; sort left under count; chips wrap

**Non-Goals:**

- Nested drawers, facet-value search, header search, batched Apply
- Changing URL or catalogue facet rules
- Owning the Tabs primitive contract (`sync-tabs-from-figma`)

## Decisions

- **`matchMedia` for wide vs narrow** — only one search Autocomplete mounts,
  so suggestion menus do not double
- **`showSearch` / `showGroups` / `facetLayout` on `ProductFilter`** —
  browse splits chrome without forking the filter
- **Swipe `left`** — drawer from the leading edge, opposite cart
- **Live apply + Done closes** — Clear calls `onClearFilters` when supplied
- **No expand / no utility links in the drawer** — open expands worlds via
  `onGroupExpand`; utilities stay sidebar-only
- **Default pill tabs + `fullWidth`** — drawer Worlds | Types use synced Tabs

## Risks / Trade-offs

- `matchMedia` needs a first paint default; prefer wide-first or narrow-first
  consistently with SSR storybook
