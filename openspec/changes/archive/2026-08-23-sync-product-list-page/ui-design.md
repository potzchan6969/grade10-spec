# UI: Product List page

## Screens

- [Product List](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868)
- [Product / Product Filter](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4357-527)
- [Product / Product List Header](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117)
- [Product / Product List FIlter Bar](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4396-5424)
- [Product / Product List](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4238-4585)
- [Footer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653)

The Product List frame fills `#ffffff` (`bg-white`). `Base/background` remains `#fafafa` and is not the page canvas.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ProductBrowse` | `@grade10/ui` | Frame `4098:1952`. Padding `px-8` / `pt-6` / `pb-16` (32×24×64). Gap `gap-16` (64px) between sidebar and results. Results column gap `gap-8` (32px). |
| `ProductFilter` | `@grade10/ui` | **New.** Set `4357:527`. Heading, search, stacked `CheckboxList` groups. Header gap 8px; groups gap 24px. |
| `FilterPanel` | `@grade10/ui` | Landmark + `ProductFilter` + utility links. Frame `4288:13952`. Width 256px. |
| `ProductListHeader` | `@grade10/ui` | Set `4288:14117`. Count, optional filter bar, sort dropdown. Header-to-chips gap 8px. Applied chips are `Chip`. |
| `ProductList` | `@grade10/ui` | Gap 32×32, min tile 240px. |
| `ProductCard` | `@grade10/ui` | `cardProps` / `tags` not displayed. Image well `radius-3xl`, `border-subtle`, gray-50→gray-100 gradient. Photo uses `mix-blend-multiply` so a white studio fill reads as transparent over that gradient. Title wraps two lines. SALE uses `Badge` `brand`; SOLD OUT uses default. Cart is `IconButton` `primary` `md` with a 14px bold outline cart glyph; hover reveals it, in-cart keeps it visible with a brand count. |
| `CheckboxList` / `CheckboxListInput` | `@grade10/design-system` | Sidebar rows, `size="sm"` (16px circular control in a 20px hit). Checked fills `primary`. |
| `Chip` | `@grade10/design-system` | **New.** Set `4396:5319`. Primary pill with built-in dismiss. Applied-filter chips. |
| `Badge` | `@grade10/design-system` | `brand` (`accent-foreground`) for SALE; default (primary) for SOLD OUT. Pills (`radius-full`). |
| `Button` | `@grade10/design-system` | Ghost `md` sort trigger. |
| `DropdownMenu` | `@grade10/design-system` | Popover fill, `radius-3xl`, blur. Active sort item is `selected` with a trailing check and no fill. Label is `popover-foreground`; hover/highlight is `muted-hover`. Trigger chevron rotates 180° while open. |
| `SearchInput` | `@grade10/design-system` | Set `2132:2782`. Pill `h-10` / `radius-full` / `px-4`. Phosphor magnifier; trailing X when filled. |
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
| Four 240px tiles | Wide viewport |
| No tags on a tile | No metadata badges on a tile |
| Scroll near list end reports load more | More products are reported on scroll |
| `loadingMore` appends skeleton tiles | Loading more shows skeleton tiles |
| `hasMore` false hides sentinel | The end of the catalog |
