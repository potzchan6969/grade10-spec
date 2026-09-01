## Screens

### Listing bid — payment method

*Figma frame to be produced.* It is the source of truth for the payment-method
step inserted into the existing listing bid dialog.

## Components

From `@grade10/design-system`, all existing: `Dialog`, `DialogContent`,
`DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`,
`DialogFooter`, `Button`, `Text`, `Card`, and `VStack`.

`PlaceBidDialog` remains an application-owned Auction component. The Stripe
Payment Element is an application integration, not a design-system or
`@grade10/ui` export. No new shared component, variant, or token is needed.

## States

- **First bid, method required** — `bid-payment-method-SC-01`.
- **Authentication or authorization pending** — `bid-payment-method-SC-03`.
- **Authorization refused** — `bid-payment-method-SC-04`.
- **Later bid, retained method** — `bid-payment-method-SC-05`.
