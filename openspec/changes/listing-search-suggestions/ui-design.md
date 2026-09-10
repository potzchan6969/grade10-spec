# UI: Listing search suggestions

Layout SoT: Figma Autocomplete
([`6554:6126`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-6126))
— Search Input plus Dropdown Menu with group labels
([`6554:5962`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-5962)).
Storybook: `Components/Autocomplete`,
`Store Product Listing/ProductFilter/Search` (`Suggestions`, `Commit`,
`SelectSuggestion`, `Empty`, `GroupsOmitted`),
`Store Product Listing/ProductBrowse/Search` (`SuggestionsAndCommit`),
`ProductListHeader` (`SearchChip`), and the page assembly
`Pages/Product List Page` (`Default`, `Narrow`).

## Screens

- Product listing / filter search with suggestions — Storybook
  `ProductFilter/Search`
- Browse commit → chip — Storybook `ProductBrowse/Search` /
  `SuggestionsAndCommit`
- Applied free-text chip — Storybook `ProductListHeader` / `SearchChip`
- Full page — Storybook `Pages/Product List Page` (`Default`)

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `Autocomplete` | `@grade10/design-system` | Search Input + Dropdown Menu popup; empty and loading states |
| `ProductFilter` | `@grade10/ui` | Listing search via Autocomplete |
| `FilterPanel` | `@grade10/ui` | Passes suggestion props through |
| `ProductBrowse` | `@grade10/ui` | Passes suggestion props through |
| `ProductListHeader` | `@grade10/ui` | Free-text chip as an `AppliedFilter` |
| `SearchSuggestion` | `@grade10/ui` | One row: id, label, optional image, optional trailing |
| `SearchSuggestionGroup` | `@grade10/ui` | Labelled group of rows |

## Presentation

- **Product row** — optional leading thumb; label truncates when long
- **Filter row** — facet value as the label; facet kind (World / Type) as
  trailing outline badge chrome the consumer supplies
- **Groups** — Products and Filters; each capped at five hits by the
  application, not by the shared field
- **Popup** — anchored to the full search field; long labels truncate; panel
  does not exceed the viewport width

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Typing with product and filter hits | `grade10-site-store-product-listing-SC-31`, `shared-ui-store-product-listing-SC-67` | `ProductFilter/Search/Suggestions` |
| Enter commits chip, field clears | `grade10-site-store-product-listing-SC-32` | `ProductBrowse/Search/SuggestionsAndCommit`, `Pages/Product List Page/Default` |
| Product / filter suggestion select | `SC-33`, `SC-34`, `shared-ui-SC-70` | `ProductFilter/Search/SelectSuggestion` |
| Dismiss search chip | `SC-35` | `ProductListHeader/Actions` chip dismiss |
| No hits, empty copy, commit still works | `SC-36`, `shared-ui-SC-71` | `ProductFilter/Search/Empty`, `GroupsOmitted` |
| Searching while pending | `SC-38`, `shared-ui-SC-74` | `Components/Autocomplete` (`Loading`); ProductFilter pending once wired |
| Image + trailing as supplied | `shared-ui-SC-73` | `ProductFilter/Search/Suggestions` |
| Keyboard through suggestions | `shared-ui-SC-72` | Arrow keys on `ProductFilter/Search/Suggestions` (manual / keyboard) |
| Autocomplete groups + empty | — | `Components/Autocomplete` (`Groups`, `Empty`, `Loading`) |
