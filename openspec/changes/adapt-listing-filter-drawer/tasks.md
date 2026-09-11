## 1. Spec store (grade10-spec)

- [x] 1.1 Extend `FilterPanelCopy` with `openFilter`, `drawerClear`, and `drawerDone`
- [x] 1.2 Present facet groups as Tabs in `ProductFilter` when `facetLayout="tabs"`;
      keep expand inside the active group tab
- [x] 1.3 Add `showSearch` / `showGroups` / `showHeading` / `showGroupExpand` so
      browse can split search and facets
- [x] 1.4 Adapt `ProductBrowse` below `lg`: Filter button left of search, left
      Drawer for facets (no utilities / no expand link), Clear/Done; keep
      sidebar at `lg+`
- [x] 1.5 Make `ProductListHeader` wrap on small viewports (count one line,
      sort left-aligned under count, chips + Clear wrap)
- [x] 1.6 Update fixtures and ProductBrowse / FilterPanel / ProductFilter /
      preview stories for the drawer and tabs
- [x] 1.7 Validate the change with `openspec validate adapt-listing-filter-drawer --strict`
