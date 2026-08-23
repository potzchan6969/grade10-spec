# UI: FilterChip

## Screens

- [Filter Chip](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4313-28)

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `FilterChip` | `@grade10/design-system` | **New.** Set `4313:28`. Size `md` (default) / `sm`. `selected` and `disabled` are boolean gates. Optional `trailing` slot (BOOLEAN + INSTANCE_SWAP). |

## States

| State | Covered by |
| --- | --- |
| Default, both sizes | `Default`, `Small` stories |
| Selected, both sizes | `Selected`, `SelectedSmall` stories |
| Disabled, and disabled while selected | `Disabled`, `DisabledSelected` stories |
| Trailing glyph, with size and selected | `WithTrailing`, `WithTrailingSmall`, `WithTrailingSelected` stories |
| Hover and focus | CSS pseudo-states; no prop, no story rung |
