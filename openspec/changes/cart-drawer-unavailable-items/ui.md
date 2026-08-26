## Screens

### Cart drawer

- Overlay: [Product / Cart overlay `4674:3832`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3832)
- Drawer: [Product / Cart / Cart Drawer `4735:6493`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493)

No Figma frame for an unavailable row — those lines are not drawn. Toast
chrome is the existing design-system toaster (no new frame).

## Components

- `CartDrawer`, `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`,
  `CartItem`, `CartItemSlot` (`@grade10/ui`)
- `Toaster`, `toast` (`@grade10/design-system`) — `toast` re-exported from the
  Sonner overlay module in this change

## States

| State | Spec scenario |
| --- | --- |
| Open loading (skeletons) | Existing: *Cart opened in loading state* |
| Post-loading cleanup with delisted lines | *Delisted items clear after loading with one toast* |
| Post-loading with no delisted lines | *No unavailable items means no removal toast* |
| Sold out / adjusted rows (unchanged) | Existing sold-out / adjusted item stories |
