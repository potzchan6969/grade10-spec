## Goals

- When a listing tile can open a product, the name reports the same
  activation as the photo.
- A sold-out name stays inert where the tile sells. A sold-out tile that
  still opens is `add-store-cross-sell` Q17 / Q29.

## Non-Goals

- Navigation inside the package — the consumer still decides route or modal.
- Always-visible link chrome — hover and focus underline; Figma stays the
  photo plus plain name.
- Adaptive Filter chrome — `adapt-listing-filter-drawer`.
- Cart or price behaviour.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the name open the product? | Yes, when the consumer supplies tile activation and the product is not sold out. Same report as the photo - decided by the round | Photo-only activation |
| Q2 | Does a sold-out name stay inert? | Where the tile sells — a cart handler is supplied. Where it does not sell, a sold-out tile still opens, as `add-store-cross-sell` Q17 / Q29. SC-88's GIVEN is a cart handler - decided by the round | Every sold-out name inert, which reverses Q29 |
| Q3 | Is the name an always-underlined link? | No. Hover and focus underline. A `href` link is `add-store-cross-sell` - decided by the round | Always-visible link chrome on the Figma name |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
