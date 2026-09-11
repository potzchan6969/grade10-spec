## Context

`ProductBrowse` below `lg` currently mounts a Filter icon, listing search, and
a left facet drawer with Worlds | Types tabs. Spec rewrite replaces that with
count + sort/facet pills and per-group bottom drawers. Wide sidebar and chips
stay. Wide breakpoint remains Tailwind `lg` (`min-width: 1024px`).

## Decisions

- **Local chrome inside `ProductBrowse`** — narrow count + pills + drawers are
  not a new public export; product state stays consumer-controlled
- **Bottom sheet** — `Drawer` with `swipeDirection="down"`; facet sheets cap near
  `80dvh` so long option lists scroll in `DrawerBody`
- **Sort apply on choose** — no draft for sort
- **Facet draft apply** — on Show Results, diff draft vs applied for that group
  via `onFilterChange`; Clear empties draft only
- **Expand on open** — opening a facet drawer calls `onGroupExpand` when the
  group has `expandLabel`
- **`shortLabel` / `compactLabel`** — optional on `SortOption` and `FilterGroup`
- **Copy** — `FilterPanelCopy.showResults` and `drawerClear`; drop left-drawer
  `openFilter` / `drawerDone`
- **Wide header unchanged** — chips + sort dropdown only when wide
- **Drawer padding** — design-system header/body/footer use 16px below `lg`,
  24px from `lg` (shared with other sheets)

## Risks / Trade-offs

- SSR / Storybook first paint still defaults wide-first via `matchMedia`
- Without `compactLabel`, multi-select pills fall back to group label + count
- Drawer padding change also affects other bottom/side sheets on small viewports
