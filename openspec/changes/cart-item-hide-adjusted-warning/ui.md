## Screens

### Cart drawer

- Overlay: [Product / Cart overlay `4674:3832`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3832)
- Drawer: [Product / Cart / Cart Drawer `4735:6493`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493)
- Adjusted row: [Product / Cart / Cart Item `4765:2301`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4765-2301)

No new Figma frame — copy and layout for the warning are unchanged; only when
it leaves the row changes.

## Components

- `CartItem` (`@grade10/ui`) — owns the dismiss presentation for
  `lowStockWarning`

## States

| State | Spec scenario |
| --- | --- |
| Adjusted warning visible (qty 2 / max 2, increment disabled) | *Adjusted line shows the low-stock warning* |
| Warning hidden after decrease; remove-at-min at qty 1 | *Quantity change hides the warning* |
| Warning after new adjustment | *New adjusted status shows the warning again* (implementation; not a separate story) |
