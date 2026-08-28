# Design

## Cart control

`ProductCardCartControl` owns ephemeral expand/collapse presentation state.
Quantity and in-cart condition remain consumer props; every step reports
`onCartQuantityChange(quantity)` including `0` for removal.

The expanded row reuses Stepper Input (`4623:395`) spacing: `px-[3px]` inset,
`IconButton` `sm` end caps, rolling digit animation on step.

Hover reveal uses `[&:hover_.cart-control]` on the image well rather than
named group utilities, matching the validated prototype harness.

## Callback migration

| Before | After |
| --- | --- |
| `onCartClick()` | `onCartQuantityChange(1)` on first add |
| `onProductAction(id)` | `onProductCartQuantityChange(id, quantity)` |

## Copy

`ProductCardImageCopy` gains `decreaseQuantity`, `increaseQuantity`,
`removeFromCart`, and `adjustQuantity` — all required, supplied once per list.
