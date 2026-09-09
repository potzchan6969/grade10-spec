## 1. Contract and UI source (grade10-spec)

- [x] 1.1 Expand `auction-listing-bid-panel--payment-authorization` with the Listing bid — payment method dialog referenced by `ui-design.md`, using the existing dialog primitives for `grade10-site-auction-bid-payment-method-SC-01`, `grade10-site-auction-bid-payment-method-SC-03`, and `grade10-site-auction-bid-payment-method-SC-04`.
- [ ] 1.2 Make every `bid-payment-method` scenario pass as a reviewed capability contract and keep its UI state map aligned with the Storybook source.
- [x] 1.3 Verify: `openspec validate add-auction-bid-card-authorization --strict`.

## 2. Shared interfaces (grade10) (owner: @htonyl)

- [x] 2.1 Make `First bid requires a payment method`, `A selected payment method authorizes the maximum`, and `A later bid retains the listing's payment method` pass by extending the Auction and Stripe contracts with first-bid setup/confirmation and retained-method outcomes.
- [x] 2.2 Make `Payment authentication stays in the dialog` and `A refused authorization does not place a bid` pass in contract fixtures without serializing card data or client secrets outside the intended browser response.
- [x] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, and the Auction and Stripe contract tests.

## 3. Data migration (grade10) (owner: @htonyl)

- [x] 3.1 Make `A later bid retains the listing's payment method` pass with the bidder/listing opaque payment-method binding and its uniqueness constraint.
- [x] 3.2 Preserve the existing payment-hold provider reference so `A selected payment method authorizes the maximum`, `Raising a maximum raises the authorization`, and `An outbid cancels the authorization` remain traceable and idempotent.
- [x] 3.3 Verify: `pnpm run db:drizzle:generate` and `pnpm run check:migrations`.

## 4. Auction and Store backend (grade10) (owner: @htonyl)

- [x] 4.1 Make `A selected payment method authorizes the maximum`, `Payment authentication stays in the dialog`, and `A refused authorization does not place a bid` pass through manual-capture PaymentIntent confirmation and the serialized listing decision.
- [x] 4.2 Make `Raising a maximum raises the authorization` and `Provider outcomes remain idempotent` pass by updating the listing's existing PaymentIntent before accepting the raised bid, with webhook and reconciliation recovery.
- [x] 4.3 Make `An outbid cancels the authorization` pass through the existing release worker without invoking capture or a post-sale transition.
- [x] 4.4 Verify: `pnpm run test:backend` and targeted Auction bid, Stripe webhook, release, and reconciliation tests.

## 5. Listing bid frontend (grade10) (owner: @htonyl)

- [x] 5.1 Make `First bid requires a payment method` pass in `PlaceBidDialog`, showing the provider-hosted payment field after a collector selects a valid maximum.
- [ ] 5.2 Make `Payment authentication stays in the dialog` and `A refused authorization does not place a bid` pass with accessible pending and refusal states, retaining the collector's bid draft.
- [ ] 5.3 Make `A later bid retains the listing's payment method` pass by skipping the payment-method step for an existing listing authorization and refreshing the visible bid standing after success.
- [ ] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the affected Listing bid dialog stories/tests.
