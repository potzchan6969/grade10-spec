**Author:** @htonyl - 2026-09-01

## Why

A collector can currently enter a maximum bid but cannot complete the missing
card-registration step in that bid flow. That leaves a card-backed commitment
ambiguous and prevents Grade10 from proving that an accepted bid has funds
behind it. The success measure is the share of first bids that reach an
authorized, accepted bid without a payment-method failure.

## What Changes

- Add a payment-method step to the first bid on each listing. It lets the
  collector choose a saved card or add one in Stripe's hosted payment field.
- Bind that chosen method to the collector and listing, so later bid raises
  reuse it without reopening the payment-method dialog.
- Create and persist one manual-capture authorization for the submitted
  maximum, then update it when the collector raises that maximum.
- Cancel the authorization when the collector is outbid, while retaining its
  provider record for reconciliation and audit.
- Make payment authentication, pending authorization, and refusal explicit in
  the bid dialog; a bid is never shown as accepted before authorization.

## Non-Goals

- Capturing a winner's payment, checkout, delivery, invoicing, orders, or
  fulfilment.
- Changing automatic-bidding rules, bid increments, bid ordering, or the
  auction extension policy.
- Letting a collector replace the card already committed to a listing.
- A general account payment-method manager.

## Capabilities

### New Capabilities

- `grade10-auction/bid-payment-method`: The per-listing payment-method choice
  and authorization lifecycle that makes a bid card-backed.

### Modified Capabilities

None.

## Impact

`@grade10/auction-contracts`, `@grade10/auction-backend`,
`@grade10/auction-frontend`, `@grade10/stripe-contracts`,
`@grade10/stripe-frontend`, the Grade10 store and Auction Workers, the Auction
database, and the Grade10 listing bid dialog gain the new flow. Stripe.js and
its hosted payment field are loaded only in the authenticated bid flow; card
data remains with Stripe.
