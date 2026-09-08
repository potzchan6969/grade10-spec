**Author:** @htonyl - 2026-09-01

## Why

A collector can currently enter a maximum bid but cannot complete the missing
card-registration step in that bid flow. That leaves a card-backed commitment
ambiguous and prevents Grade10 from proving that an accepted bid has funds
behind it. The success measure is the share of first bids that reach an
authorized, accepted bid without a payment-method failure.

## What Changes

- Authorize a linked card when the collector commits a maximum, in the
  background with no payment-method confirmation modal (linking lives under
  `add-bid-panel-enrollment`).
- Reuse a linked method across listings by default; bind the committed method
  to the collector and listing after the first accepted bid so raises reuse it.
- Create and persist one manual-capture authorization for the submitted
  maximum, then update it when the collector raises that maximum.
- Cancel the authorization when the collector is outbid, while retaining its
  provider record for reconciliation and audit.
- Surface decline, unusable method, provider failure, raise-hold failure, and
  expired-hold-on-raise as errors on or near the bid CTA; keep SCA and pending
  on the listing bid surface. A bid is never shown as accepted before
  authorization. Exact English: decline-class failures use Your card could not
  be authorized. Try another card. Provider or network failure uses Your bid
  did not go through. The card was not authorized. Shared catalog keys:
  `auctionListing.authorizationDeclined` and
  `auctionListing.authorizationProviderFailure`.

## Non-Goals

- Capturing a winner's payment, checkout, delivery, invoicing, orders, or
  fulfilment.
- Changing automatic-bidding rules, bid increments, bid ordering, or the
  auction extension policy.
- Letting a collector replace the card already committed to a listing after
  the first bid (change before first bid is enrollment).
- A general account payment-method manager.
- The bid panel's link-card setup chrome — `add-bid-panel-enrollment`.

## Capabilities

### New Capabilities

- `grade10-site/auction/bid-payment-method`: The linked-method authorization
  lifecycle that makes a bid card-backed.

### Modified Capabilities

None.

## Impact

`@grade10/auction-contracts`, `@grade10/auction-backend`,
`@grade10/auction-frontend`, `@grade10/stripe-contracts`,
`@grade10/stripe-frontend`, the Grade10 store and Auction Workers, the Auction
database, and the Grade10 listing bid panel gain the new flow. Align with
`add-bid-panel-enrollment` so both change trees keep the same payment-method
requirement text. Stripe.js and its hosted payment field stay with enrollment
link; authorization on commit does not reopen that modal.
