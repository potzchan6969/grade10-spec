## Context

Cart reveal was hover-only for products not yet in the cart. Coarse / no-hover
media queries landed in `ProductCardImage`; a narrow desktop iframe still
reports fine pointer + hover, so the control stays hidden. Match the listing
wide breakpoint (`lg`) so small-viewport chrome and cart visibility agree.

## Goals / Non-Goals

**Goals:**

- Keep cart visible below `lg` without hover
- Keep coarse / `hover:none` behaviour
- Leave wide + fine pointer on hover / focus-within

**Non-Goals:**

- Changing stepper expand/collapse
- Drawing a cart without `onCartQuantityChange`

## Decisions

- **`max-lg:` alongside coarse / no-hover** — same breakpoint as the filter
  drawer, so Storybook narrow and phones both show the control
- **CSS only** — no JS breakpoint on the image; media queries stay on the
  image root that already owns hover reveal

## Risks / Trade-offs

- A wide tablet in landscape above `lg` with a coarse pointer still relies on
  the coarse query — intentional
