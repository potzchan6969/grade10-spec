# UI: Listing search suggestions

Storybook is the layout source of truth for every listing surface here. Figma
owns the `Autocomplete` composition the search field is built from.

## Screens

### Search Field

| Surface | Storybook (SoT) | Figma |
| --- | --- | --- |
| Product and filter groups while typing | [`ProductFilter/Search` → Suggestions](?path=/story/store-product-listing-productfilter-search--suggestions) | [Autocomplete](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-6126&m=dev), [Dropdown Menu Group Label](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-5962&m=dev) |
| Submit with no row highlighted | [`ProductFilter/Search` → Commit](?path=/story/store-product-listing-productfilter-search--commit) | — |
| Row activated | [`ProductFilter/Search` → Select Suggestion](?path=/story/store-product-listing-productfilter-search--select-suggestion) | — |
| Nothing matched | [`ProductFilter/Search` → Empty](?path=/story/store-product-listing-productfilter-search--empty) | [Empty row](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-6128&m=dev) |
| No groups supplied — panel stays closed | [`ProductFilter/Search` → Groups Omitted](?path=/story/store-product-listing-productfilter-search--groups-omitted) | — |
| Searching | none yet — see [Components](#components) | [Loading row](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-6228&m=dev) |

### Listing Browse

| Surface | Storybook (SoT) |
| --- | --- |
| Type, submit, search chip above the grid | [`ProductBrowse/Search` → Suggestions And Commit](?path=/story/store-product-listing-productbrowse-search--suggestions-and-commit) |
| Pick a filter row — facet chip, panel checkbox checked, field cleared, no search chip | [`ProductBrowse/Search` → Select Filter Applies Chip](?path=/story/store-product-listing-productbrowse-search--select-filter-applies-chip) |

### Applied Narrowings

| Surface | Storybook (SoT) |
| --- | --- |
| Search chip among the facet chips | [`ProductListHeader` → Search Chip](?path=/story/store-product-listing-productlistheader--search-chip) |
| Chip dismissed | [`ProductListHeader/Actions` → Applied Filter Is Removed](?path=/story/store-product-listing-productlistheader-actions--applied-filter-is-removed) |

### Whole Page

| Surface | Storybook (SoT) |
| --- | --- |
| Listing, typed through committed | [`Pages/Product List Page` → Default](?path=/story/pages-product-list-page--default) |
| Listing, narrow viewport | [`Pages/Product List Page` → Narrow](?path=/story/pages-product-list-page--narrow) |

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `Autocomplete`, `AutocompleteInput`, `AutocompleteContent`, `AutocompleteList`, `AutocompleteCollection`, `AutocompleteGroup`, `AutocompleteGroupLabel`, `AutocompleteItem`, `AutocompleteEmpty`, `AutocompleteLoading` | `@grade10/design-system` | The field and its panel. Exists — [`Components/Autocomplete`](?path=/story/components-autocomplete--default) (Groups, Empty, Loading). This change alters no primitive contract |
| `ProductFilter` | `@grade10/ui` | Holds the search field, the draft, and the suggestion panel |
| `FilterPanel`, `ProductBrowse` | `@grade10/ui` | Pass the suggestion props and callbacks through |
| `ProductListHeader` | `@grade10/ui` | Renders committed free text as one more `AppliedFilter` chip; nothing about the chip is search-specific |
| `SearchSuggestion`, `SearchSuggestionGroup` | `@grade10/ui` | Public types: `id`, `label`, optional `imageSrc` / `imageAlt` / `trailing`; a group is id, label, rows |

Suggestion rows are consumer-assembled: the surface renders the image and the
trailing chrome it is handed and invents neither, so the filter row's facet
badge (World, Type) is the application's to supply.

### Work in this repo

A compound-component delta in `packages/ui/src/blocks/store-product-listing/`.
No new primitive, no new variant, no new token.

- **Pending** — `ProductFilterProps` takes no pending indication and
  `ProductFilterCopy` carries no searching copy, so `AutocompleteLoading` is
  never reached through the listing. `FilterPanelProps` and
  `ProductBrowseProps` pass it through
  (`shared-ui-store-product-listing-SC-74`)
- **Story** — `ProductFilter/Search` → Pending, for the searching state that
  has no story today

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Groups displayed as supplied | `shared-ui-store-product-listing-SC-67`, `grade10-site-store-product-listing-SC-31` | [Suggestions](?path=/story/store-product-listing-productfilter-search--suggestions) |
| Image and trailing rendered as supplied | `shared-ui-store-product-listing-SC-73` | [Suggestions](?path=/story/store-product-listing-productfilter-search--suggestions) |
| Draft reported; the field shows the supplied query | `shared-ui-store-product-listing-SC-68` | [`FilterPanel` → Search Change Is Reported](?path=/story/store-product-listing-filterpanel--search-change-is-reported) |
| Submit with no row highlighted reports a commit | `shared-ui-store-product-listing-SC-69`, `grade10-site-store-product-listing-SC-32` | [Commit](?path=/story/store-product-listing-productfilter-search--commit), [Suggestions And Commit](?path=/story/store-product-listing-productbrowse-search--suggestions-and-commit), [Product List Page](?path=/story/pages-product-list-page--default) |
| Row activated — reported once, no navigation from the surface | `shared-ui-store-product-listing-SC-70` | [Select Suggestion](?path=/story/store-product-listing-productfilter-search--select-suggestion) |
| Filter row applies the facet; field clears; free text not in force | `grade10-site-store-product-listing-SC-34` | [Select Filter Applies Chip](?path=/story/store-product-listing-productbrowse-search--select-filter-applies-chip) |
| Product row opens the product; field clears | `grade10-site-store-product-listing-SC-33` | Application-side; the preview page stubs the jump |
| Empty — nothing matched, submit still commits | `shared-ui-store-product-listing-SC-71`, `grade10-site-store-product-listing-SC-36` | [Empty](?path=/story/store-product-listing-productfilter-search--empty) |
| No groups supplied — panel closed, submit still commits | ❓ no scenario — the requirement states it, the spec names no scenario | [Groups Omitted](?path=/story/store-product-listing-productfilter-search--groups-omitted) |
| Searching while hits resolve; no row invented | `shared-ui-store-product-listing-SC-74`, `grade10-site-store-product-listing-SC-38` | [`Components/Autocomplete` → Loading](?path=/story/components-autocomplete--loading) only; the listing story waits on the pending prop |
| Keyboard reaches and activates each row, focus visible | `shared-ui-store-product-listing-SC-72` | [Suggestions](?path=/story/store-product-listing-productfilter-search--suggestions), by keyboard |
| Chip dismissed — free text out of the address and the narrowings | `grade10-site-store-product-listing-SC-35` | [Applied Filter Is Removed](?path=/story/store-product-listing-productlistheader-actions--applied-filter-is-removed) |
| Every hit is a store product or a store facet | `grade10-site-store-product-listing-SC-37` | Application-side; the surface renders what it is handed |
