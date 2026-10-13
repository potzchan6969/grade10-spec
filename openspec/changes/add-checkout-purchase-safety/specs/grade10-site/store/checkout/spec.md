# grade10-site/store/checkout Specification

## Purpose

An authenticated collector's Store checkout is a live decision before a
Shopify-hosted payment. It carries a current basket and accepted tender into
one hosted checkout while Grade10 retains the order of record and repairs its
payment lifecycle.

## Feature set

- Current basket and tender
  - Live line review before Pay and again at the payment decision
  - Accepted promo and points choices beside a subtotal estimate
  - Shipping and tax left to Shopify's address-aware checkout
- Hosted Shopify handoff
  - Signed-in storefront checkout through one Shopify draft-order invoice
  - Local order and provider references bound before the buyer leaves
  - Provider refusal kept distinct from a paid order
- Safe repetition and recovery
  - One open checkout intent for repeated Pay actions and lost responses
  - Provider and store recovery without a second payable invoice
  - Changed lines named before a stale basket can be paid
- Order settlement and return
  - Pending orders settle through webhook, reconcile and order reads
  - Paid orders appear in Your Orders and release the member cart
  - Shopify confirmation returns the collector to the Grade10 order
- Carrier rates
  - Shopify asks a token-gated stateless carrier rule for served destinations
  - The callback and store preview use the same configured rate

## MODIFIED Requirements

### Requirement: A checkout intent is safe to repeat

The storefront SHALL identify one checkout intent across the Pay action and a
same-session reload. The server SHALL keep one web order row for the intent and
its canonical reviewed basket and tender fingerprint across the order
lifecycle, with one open checkout until the order is terminal.

**Reuse** - A repeated request for the same open intent SHALL return its existing
order and hosted invoice, or its settling state, without creating another
order or provider invoice.

**Changed intent** - Editing the basket or tender SHALL invalidate the old
fingerprint and create a new intent. The old open checkout SHALL be retired or
left for the existing recovery ladder according to the provider's answer.

**Terminal replay** - A request that repeats a settled or closed intent SHALL
return the existing order's terminal outcome. It SHALL never create another
Grade10 order or Shopify invoice, and a changed request SHALL use a new intent.

**Response loss** - A lost provider response SHALL leave the local order
recoverable. A retry SHALL use recorded references or a provider read and
SHALL never re-mint a second invoice for the same intent. A request marked as
provider-dispatched SHALL remain recovery-only even when no provider reference
has been recorded.

<!-- trace:scenario id=g10.store-checkout.SC-i09 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-09 - A repeated Pay uses one checkout
**Serves:** grade10-site-store-checkout-US-01 - The collector's repeated Pay action does not duplicate a purchase

- **GIVEN** a member's first Pay request for one unchanged intent is delayed
- **WHEN** the member submits Pay again
- **THEN** both requests identify one Grade10 order
- **AND** one Shopify invoice is payable
- **AND** the second request returns the existing invoice or its settling state

<!-- trace:scenario id=g10.store-checkout.SC-j10 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-10 - A lost response does not mint another invoice
**Serves:** grade10-site-store-checkout-US-01 - The collector can retry a provider response loss safely

- **GIVEN** Shopify created an invoice but the response was lost after the Grade10 order was written
- **WHEN** the member retries the same intent
- **THEN** the existing order is recovered through its recorded reference or a provider read
- **AND** the retry returns the existing invoice or settling state
- **AND** no second Shopify invoice is created

<!-- trace:scenario id=g10.store-checkout.SC-s19 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-19 - A terminal intent is replayed without a new order
**Serves:** grade10-site-store-checkout-US-01 - The collector's completed or closed intent cannot be paid twice

- **GIVEN** a member's intent already has a paid, refunded, failed, canceled or expired Grade10 order
- **WHEN** the member retries Pay with the same intent and unchanged fingerprint
- **THEN** the store returns the existing order's terminal outcome
- **AND** it creates no second Grade10 order or Shopify invoice
- **AND** a changed basket must use a new intent before another Pay

<!-- trace:scenario id=g10.store-checkout.SC-k11 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-11 - A changed tender starts a new intent
**Serves:** grade10-site-store-checkout-US-01 - The collector can deliberately change the purchase after an earlier intent

- **GIVEN** a member has an open checkout intent
- **WHEN** the member changes the basket or tender choice and presses Pay
- **THEN** the changed request uses a new intent fingerprint
- **AND** the old open checkout is not returned as the changed purchase

<!-- trace:scenario id=g10.store-checkout.SC-t20 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-20 - A crash before dispatch can retry safely
**Serves:** grade10-site-store-checkout-US-01 - The collector can recover when the worker stops before Shopify is called

- **GIVEN** the local order is claimed but its provider-dispatch state is still `ready`
- **WHEN** the worker stops before sending a Shopify request and reconciliation claims the order again
- **THEN** the next worker may dispatch the same intent once
- **AND** it does not create a second order or invoice

<!-- trace:scenario id=g10.store-checkout.SC-u21 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-21 - An ambiguous dispatch requires manual recovery
**Serves:** grade10-site-store-checkout-US-01 - The collector is protected when Shopify's result cannot be identified

- **GIVEN** the provider-dispatch state is `dispatched` but no unique matching draft is found
- **WHEN** the recovery deadline passes
- **THEN** the order enters `manual_review` and the checkout returns a recovery-required result
- **AND** no replacement Shopify invoice is created
- **AND** the member cannot start a new purchase until an operator binds or cancels the provider draft
