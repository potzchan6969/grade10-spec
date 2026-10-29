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
  - Paid orders appear in My Orders and release the member cart
  - Shopify confirmation returns the collector to the Grade10 order
- Carrier rates
  - Shopify asks a token-gated stateless carrier rule for served destinations
  - The callback and store preview use the same configured rate

## MODIFIED Requirements

### Requirement: A checkout intent is safe to repeat

The store SHALL identify a member's checkout intent by their cart at the
version they reviewed and the tender they chose. Every request naming one
intent SHALL reach one web order row, named by the intent, however many
requests, tabs or retries reach it. A later attempt of the same intent SHALL
start only after the earlier attempt closed unpaid.

**Reuse** - A repeated request for an open intent SHALL review the basket live
again, then return its existing order and hosted invoice, or its settling
state, without creating another order or provider invoice. A review that moved
a line SHALL answer as the review does.

**Changed intent** - Editing the basket or tender SHALL name a new intent. The
edit SHALL bring the old open checkout due in its own transaction, and the
reconcile pass SHALL retire it or leave it to the recovery ladder according to
the provider's answer. A shop review alone SHALL bring nothing due.

**Terminal replay** - A request that repeats a paid or refunded intent,
including from a tab still showing the cart its payment closed, SHALL return
that order's terminal outcome. It SHALL never create another Grade10 order or
Shopify invoice.

**Response loss** - Exactly one request SHALL ask the provider for an order's
invoice. A lost provider response SHALL leave the local order recoverable. A
retry SHALL use recorded references or a provider read by the order's tag and
SHALL never re-mint a second invoice for the same intent. A dispatched order
no read can name SHALL wait for an operator rather than expire.

<!-- trace:scenario id=g10.store-checkout.SC-i09 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-09 - A repeated Pay uses one checkout
**Serves:** grade10-site-store-checkout-US-01 - The collector's repeated Pay action does not duplicate a purchase

- **GIVEN** a member's first Pay request for one unchanged intent is delayed
- **WHEN** the member submits Pay again, from the same tab or another
- **THEN** both requests identify one Grade10 order
- **AND** one Shopify invoice is payable
- **AND** the second request returns the existing invoice or its settling state

<!-- trace:scenario id=g10.store-checkout.SC-j10 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-10 - A lost response does not mint another invoice
**Serves:** grade10-site-store-checkout-US-01 - The collector can retry a provider response loss safely

- **GIVEN** Shopify created an invoice but the response was lost after the Grade10 order was written
- **WHEN** the member retries the same intent
- **THEN** the existing order is recovered through its recorded reference or a read of the draft tagged with the order
- **AND** the retry returns the existing invoice or settling state
- **AND** no second Shopify invoice is created

<!-- trace:scenario id=g10.store-checkout.SC-s19 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-19 - A paid intent is replayed without a new order
**Serves:** grade10-site-store-checkout-US-01 - The collector's completed intent cannot be paid twice

- **GIVEN** a member's intent already has a paid or refunded Grade10 order
- **WHEN** the member retries Pay with the same cart and tender, or from a tab still showing the cart that payment closed
- **THEN** the store returns the existing order's terminal outcome
- **AND** it creates no second Grade10 order or Shopify invoice
- **AND** an intent whose order failed, was canceled or expired starts its next attempt instead

<!-- trace:scenario id=g10.store-checkout.SC-k11 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-11 - A changed tender starts a new intent
**Serves:** grade10-site-store-checkout-US-01 - The collector can deliberately change the purchase after an earlier intent

- **GIVEN** a member has an open checkout intent
- **WHEN** the member changes the basket or tender choice and presses Pay
- **THEN** the changed request uses a new intent fingerprint
- **AND** the old open checkout is not returned as the changed purchase

<!-- trace:scenario id=g10.store-checkout.SC-t20 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-20 - A crash before dispatch can retry safely
**Serves:** grade10-site-store-checkout-US-01 - The collector can recover when the worker stops before Shopify is called

- **GIVEN** the local order is written but its provider-dispatch state is still `ready` past the dispatch lease
- **WHEN** the member retries the same intent
- **THEN** the abandoned order closes without an invoice
- **AND** the retry dispatches the intent's next attempt once
- **AND** one Shopify invoice is payable

<!-- trace:scenario id=g10.store-checkout.SC-u21 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-21 - An ambiguous dispatch requires manual recovery
**Serves:** grade10-site-store-checkout-US-01 - The collector is protected when Shopify's result cannot be identified

- **GIVEN** the provider-dispatch state is `dispatched` but no unique matching draft is found
- **WHEN** the reconcile give-up deadline passes
- **THEN** the order enters `manual_review` instead of expiring, and the member's next Pay returns a recovery-required result
- **AND** no replacement Shopify invoice is created
- **AND** the member cannot start a new purchase until an operator binds or cancels the provider draft
