## Feature set

- Header controls
  - Handler-gated: search, account, and cart render only when a handler is supplied
  - No wishlist: the header does not offer a wishlist control
  - Cart slot: `Nav` may take a `cartSlot` that replaces the built-in cart control
  - Cart count: `SiteHeader` shows a round brand indicator on the cart icon for the supplied active-line count; hidden when empty or omitted

## ADDED Requirements

### Requirement: Nav accepts a cart slot

`Nav` SHALL accept an optional `cartSlot`. When `cartSlot` is supplied, `Nav`
SHALL render that node in place of the built-in cart control and SHALL NOT
use `onCartClick`. When `cartSlot` is omitted, the built-in cart control
SHALL continue to follow the handler-gated cart rule.

#### Scenario: shared-ui-site-chrome-SC-22 - Cart slot replaces the built-in cart
**Serves:** Header controls - cart slot replaces the built-in cart

- **GIVEN** `Nav` with a `cartSlot`
- **WHEN** the header renders
- **THEN** the slot content appears in the cart control position
- **AND** the built-in cart icon button is not rendered from `onCartClick`

### Requirement: SiteHeader owns the cart count badge

When `SiteHeader` is supplied a cart handler and a `cartItemCount` greater
than zero, `SiteHeader` SHALL compose the cart control with a design-system
`StatusIndicator` (`type="count"`, `variant="brand"`) displaying that count.
When `cartItemCount` is omitted, zero, or the cart handler is absent,
`SiteHeader` SHALL NOT show a count indicator.

Design-system `Nav` SHALL NOT accept or interpret a cart count. `SiteHeader`
SHALL pass the badged cart control through `Nav`'s `cartSlot`.

The chrome SHALL NOT derive the count from cart lines. The application SHALL
supply the same active-line count the cart drawer title badge uses (sold-out
and unavailable lines excluded per `shared/ui/store-cart`).

#### Scenario: shared-ui-site-chrome-SC-23 - Empty cart hides the count
**Serves:** Header controls - empty cart hides the count

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `0` (or omitted)
- **WHEN** the header renders
- **THEN** the cart control appears
- **AND** no count indicator appears on it

#### Scenario: shared-ui-site-chrome-SC-24 - One active line shows `1`
**Serves:** Header controls - one active line shows `1`

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `1`
- **WHEN** the header renders
- **THEN** a brand count indicator on the cart control displays `1`

#### Scenario: shared-ui-site-chrome-SC-25 - Multi-item count matches the drawer title
**Serves:** Header controls - multi-item count matches the drawer title

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `3`
- **WHEN** the header renders
- **THEN** a brand count indicator on the cart control displays `3`
- **AND** that value is the same active-line count `CartDrawerHeader` would
  show for the same cart

#### Scenario: shared-ui-site-chrome-SC-26 - Large count is not truncated
**Serves:** Header controls - large count is not truncated

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `12`
- **WHEN** the header renders
- **THEN** the count indicator displays `12` in full
