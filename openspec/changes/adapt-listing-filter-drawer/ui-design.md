# UI: Listing narrow pill chrome

Storybook is the layout source of truth for the narrow listing chrome for this
change. Wide filter panel layout stays on the existing Filter Panel frame.

## Screens

### Narrow listing chrome

| Surface | Storybook (SoT) |
| --- | --- |
| Count + sort / Worlds / Types pills (secondary, one scrolling row to page edge) | [`ProductBrowse` → Narrow](?path=/story/store-product-listing-productbrowse--narrow) |
| Sort bottom drawer — apply on choose | [`ProductBrowse` → Narrow Sort Applies On Choose](?path=/story/store-product-listing-productbrowse--narrow-sort-applies-on-choose) |
| Facet bottom drawer — draft, Clear, Show Results (stacked primary above secondary); list scrolls; sheet max ~80dvh; 16px padding on small viewports | [`ProductBrowse` → Narrow Facet Clear Draft](?path=/story/store-product-listing-productbrowse--narrow-facet-clear-draft) |
| Whole page, narrow viewport | [`Pages/Product List Page` → Default](?path=/story/pages-product-list-page--default) at mobile viewport |

### Wide listing (unchanged)

| Surface | Storybook (SoT) | Figma |
| --- | --- | --- |
| Sidebar search + stacked groups | [`ProductBrowse` → Default](?path=/story/store-product-listing-productbrowse--default) | [Filter panel](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-13952&m=dev) |
| Count, sort dropdown, chips | [`ProductListHeader`](?path=/story/store-product-listing-productlistheader--default) | [Product List Header](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117&m=dev) |

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductBrowse` | `@grade10/ui` | Owns wide vs narrow chrome; does not export a separate narrow root |
| `FilterPanel`, `ProductFilter`, `ProductListHeader` | `@grade10/ui` | Wide path only for search, stacked groups, chips |
| `Drawer`, `DrawerHeader`, `DrawerBody`, `DrawerFooter`, `DrawerTitle` | `@grade10/design-system` | Bottom sheets (`swipeDirection="down"`); small-viewport padding 16px, `lg` 24px |
| `Button` (`secondary` pills; primary / outline footer) | `@grade10/design-system` | Pill row uses `secondary` + caret |
| `CheckboxList`, `CheckboxListInput` | `@grade10/design-system` | Facet options in the group drawer |
| `SortOption.shortLabel`, `FilterGroup.compactLabel` | `@grade10/ui` types | Optional; narrow pill labels |
| `FilterPanelCopy.showResults`, `FilterPanelCopy.drawerClear` | `@grade10/ui` | Facet drawer actions (Clear empties draft only) |

### Work in this repo

- Compound chrome lives under `packages/ui` inside `ProductBrowse` (internal
  narrow chrome — not a new public export)
- Drawer small-viewport padding adjustment in `packages/design-system` overlays
- No new Button / Drawer variant or token

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Narrow pills; no search; no Filter icon | `shared-ui-store-product-listing-SC-80` | [Narrow](?path=/story/store-product-listing-productbrowse--narrow) |
| Sort applies on choose and closes | `shared-ui-store-product-listing-SC-81` | [Narrow Sort Applies On Choose](?path=/story/store-product-listing-productbrowse--narrow-sort-applies-on-choose) |
| Pill labels: group / one option / compact count | `shared-ui-store-product-listing-SC-82` | [Narrow](?path=/story/store-product-listing-productbrowse--narrow), [Narrow Facet Clear Draft](?path=/story/store-product-listing-productbrowse--narrow-facet-clear-draft) |
| Facet draft applies on Show Results | `shared-ui-store-product-listing-SC-83` | [Narrow](?path=/story/store-product-listing-productbrowse--narrow) |
| Facet Clear empties draft only | `shared-ui-store-product-listing-SC-84` | [Narrow Facet Clear Draft](?path=/story/store-product-listing-productbrowse--narrow-facet-clear-draft) |
| Wide sidebar + search; no pill row | `shared-ui-store-product-listing-SC-85` | [Default](?path=/story/store-product-listing-productbrowse--default) |
| Filters / groups still usable when results empty or error | `shared-ui-store-product-listing-SC-12`, `SC-27`, `SC-28` | [`ProductBrowse/States`](?path=/story/store-product-listing-productbrowse-states--no-match) |
