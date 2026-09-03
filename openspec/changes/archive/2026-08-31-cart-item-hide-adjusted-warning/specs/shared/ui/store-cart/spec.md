## Purpose

When a cart line was reduced for low stock, the low-stock warning hides after the shopper edits that line's quantity, so it does not keep shouting after they have acted.

## Feature set

- Low-stock warning
  - Shown when adjusted: the consumer-supplied warning is visible on an adjusted line
  - Hidden after edit: a quantity change hides it for the rest of that mount

## ADDED Requirements

### Requirement: Low-stock adjustment warning hides after the shopper edits quantity

When a cart line’s status is `adjusted`, `CartItem` SHALL show the
consumer-supplied low-stock warning copy. After the shopper changes that
line’s quantity through the stepper, `CartItem` SHALL hide the warning for
the remainder of that mount while status remains `adjusted`, and SHALL still
invoke `onQuantityChange` with the new quantity. Removing the line (including
decrement-at-minimum remove) SHALL remove the row and therefore the warning.
When the line’s status leaves `adjusted` and later becomes `adjusted` again,
`CartItem` SHALL show the warning again. When `CartItem` mounts with status
`adjusted`, it SHALL show the warning (a remount with status still `adjusted`
shows the warning again).

#### Scenario: shared-ui-store-cart-SC-14 - Adjusted line shows the low-stock warning

- **GIVEN** a cart line with status `adjusted`
- **WHEN** `CartItem` renders
- **THEN** the low-stock warning copy is visible

#### Scenario: shared-ui-store-cart-SC-15 - Quantity change hides the warning

- **GIVEN** a cart line with status `adjusted` showing the low-stock warning
- **AND** the stepper can change quantity without removing the line
- **WHEN** the shopper changes the line’s quantity
- **THEN** the low-stock warning is no longer visible
- **AND** `onQuantityChange` is invoked with the new quantity

#### Scenario: shared-ui-store-cart-SC-16 - New adjusted status shows the warning again

- **GIVEN** a cart line that was `adjusted` and whose warning was hidden after
  a quantity change
- **WHEN** the line’s status becomes not `adjusted` and then `adjusted` again
- **THEN** the low-stock warning is visible again
