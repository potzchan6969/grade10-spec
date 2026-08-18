# UI: Product List Header

## Screens

- [Product / Product List Header](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117)
- [Filter Chip](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4313-28)

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `FilterChip` | `@grade10/design-system` | **New.** Set `4313:28`. Size `md` (default) / `sm`. Optional `trailing` slot (BOOLEAN + INSTANCE_SWAP); Price uses it for the direction arrow. |
| `ProductListHeader` | `@grade10/ui` | Set `4288:14117`. |
| `Button` | `@grade10/design-system` | Outline `md` trigger for exclusive filters. |
| `DropdownMenu` | `@grade10/design-system` | Series list; selected item uses `selected` + check trailing. |
| `HStack` / `VStack` | `@grade10/design-system` | Header column (`gap-md`, `pt-4`); sort bar `gap-md`; chip rows `gap-xs`. Title row uses `gap-1.5` (6px), which is not a Stack rung. |

## States

| State | Spec scenario |
| --- | --- |
| Title and count as supplied | The title is displayed as supplied; The count is not derived |
| Active sort chip | Sorting is reported |
| Price selected, then reversed | A paired sort option reverses on a second activation |
| No sort options | No sort options supplied |
| Type chips unselected, results still shown | No chip filter selected |
| Chip filter unselected until the consumer updates | A chip filter is reported |
| Pack and Box both selected | Two chip filter options selected |
| Exclusive dropdown dismissed, trigger unchanged | An exclusive filter is reported |
| Empty exclusive-filter options | An exclusive filter with no options |
| Sort + type + series all selected | Sort and filters combine |
