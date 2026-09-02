## Screens

### Listing bid — payment method

The Storybook component
`auction-listing-listingbidpanel--default` is the source of truth for the
payment-method step inserted into the existing listing bid dialog. It opens
from Place Bid and keeps the provider-hosted field, pending state, and refusal
in the same dialog. `PaymentAuthorizationPending` and
`PaymentAuthorizationRefused` show those latter two states directly.

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
