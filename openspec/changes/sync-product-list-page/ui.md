# UI: Product List page

## Screens

- [Product List](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868)
- [Product / Product Filter](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4357-527)
- [Product / Product List Header](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117)
- [Product / Product List FIlter Bar](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4396-5424)
- [Product / Product List](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4238-4585)
- [Footer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653)

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductBrowse` | `@grade10/ui` | Frame `4098:1952`. Padding `px-8` / `py-6` (32×24). Gap `gap-12` (48px) between sidebar and results. Results column gap `gap-8` (32px). |
| `ProductFilter` | `@grade10/ui` | **New.** Set `4357:527`. Heading, search, stacked `CheckboxList` groups. |
| `FilterPanel` | `@grade10/ui` | Landmark + `ProductFilter` + utility links. Frame `4288:13952`. Width 256px. |
| `ProductListHeader` | `@grade10/ui` | Set `4288:14117`. Count, optional filter bar, sort dropdown. |
| `ProductList` | `@grade10/ui` | Gap 24×32, min tile 250px. |
| `ProductCard` | `@grade10/ui` | `cardProps` / `tags` not displayed. |
| `CheckboxList` / `CheckboxListInput` | `@grade10/design-system` | Sidebar rows, `size="sm"` (16px control in a 20px hit). |
| `FilterChip` | `@grade10/design-system` | Applied-filter chips, `size="sm"`, trailing dismiss. |
| `Button` | `@grade10/design-system` | Ghost `md` sort trigger. |
| `DropdownMenu` | `@grade10/design-system` | Sort options; active item uses `selected`. |
| `Link` | `@grade10/design-system` | Expand group, clear filters, utility links. |
| `Footer` | `@grade10/design-system` | Background `bg-background`. |

`Product / Product List FIlter Bar` is nested in the header; it is not a
separate public export.

## States

| State | Spec scenario |
| --- | --- |
| No checkbox checked, results still shown | No filter selected is unrestricted |
| Checkbox reports, stays unchecked until consumer updates | A sidebar filter is reported |
| Two options in one group selected | Two filter options selected |
| Expand link reports the group | A group expand is reported |
| Filter groups loading, results ready | Filter groups load while results are ready |
| Results fail, sidebar stands | Results fail while filter groups stand |
| Count as supplied | The count is not derived |
| Sort dropdown reports a new option | Sorting is reported |
| Empty sort options | No sort options supplied |
| Applied chips hidden | No applied filters |
| Chip dismiss reports the option | An applied filter is removed |
| Clear-all reports once | Applied filters are cleared |
| Sort + applied chips together | Sort and applied filters combine |
| Narrow viewport, one column | Narrow viewport |
| Four 250px tiles | Wide viewport |
| No tags on a tile | No metadata badges on a tile |
