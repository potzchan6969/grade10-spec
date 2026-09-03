# Shopify Commerce — delta

## Purpose

The Grade10 Store's boundary to Shopify: shoppers browse Shopify-authoritative
products and availability, hand a signed-in cart to Shopify checkout, and
later read their authenticated Store order projection derived from Shopify
payment and fulfilment facts.

## Feature set

- Catalogue
  - Shopify-authoritative: browse reads live products; a change invalidates cache; an outage is reported
- Checkout identity
  - Signed in: checkout runs on the Grade10 session, Google or magic link; guest checkout by email is built, launching with it `TBC`
- Live checkout
  - No hold: price and inventory are live at handoff and at payment; backorders are refused; a retry returns one handoff
- Orders
  - Payment vs shipping: paid, partial fulfilment, and carrier confirmation are separate facts
- Webhooks
  - Idempotent: invalid and duplicate events change nothing; a miss is repaired

## ADDED Requirements

### Requirement: Shopify is authoritative for catalogue and inventory

The Grade10 Store SHALL read published products, variants, price/currency,
media, and current availability from Shopify APIs. It SHALL expose those facts
through the Store API and SHALL NOT keep a Postgres product or inventory mirror.
Catalogue responses MAY be edge-cached only for display; product-change events
SHALL invalidate cached product/list responses and cache expiry SHALL bound a
missed invalidation.

#### Scenario: shopify-commerce-SC-01 - A shopper browses a current Shopify catalogue

- **GIVEN** Shopify has a published product with a purchasable variant
- **WHEN** a shopper requests the Store catalogue
- **THEN** the Store catalogue response includes that product and its current
  variant price, currency, media, and availability
- **AND** the response contains no Shopify credential or raw Admin API data

#### Scenario: shopify-commerce-SC-02 - A Shopify product change invalidates browsing data

- **GIVEN** a cached Store response contains a product
- **WHEN** the Store receives a verified Shopify product-change event for it
- **THEN** a later Store catalogue response does not serve that product from the
  invalidated cached response

#### Scenario: shopify-commerce-SC-03 - Shopify catalogue data is unavailable

- **GIVEN** a shopper requests a catalogue response with no usable cached copy
- **WHEN** Shopify cannot answer that catalogue request
- **THEN** the Store reports an integration-unavailable outcome that identifies
  the failed read
- **AND** it does not report invented availability or price

### Requirement: Checkout runs on the Grade10 session

Checkout SHALL require a signed-in Grade10 session, reached through Google or
email magic link. The Store SHALL create the order for that account and SHALL
use the account's one-to-one Shopify customer association. It SHALL NOT create
another Grade10 account or Shopify customer association for that shopper.

Guest checkout by a typed email is built: when the email belongs to an existing
Grade10 account the Store SHALL answer that sign-in is required, and otherwise
it SHALL create one Shopify customer before checkout and, after Shopify
confirms payment, create the Grade10 account when needed and link it
one-to-one to that Shopify customer. Whether the storefront offers guest
checkout at launch is `TBC`.

#### Scenario: shopify-commerce-SC-04 - A shopper checks out signed in

- **GIVEN** a shopper requests checkout
- **WHEN** they hold a Grade10 session
- **THEN** the Store creates the pending order for that account before it
  creates a Shopify checkout handoff
- **AND** it creates no additional Grade10 account or Shopify customer link

#### Scenario: shopify-commerce-SC-05 - A guest receives a linked Grade10 account after payment

- **GIVEN** guest checkout is offered and the typed email belongs to no Grade10
  account
- **WHEN** Shopify confirms payment for that checkout
- **THEN** the Store creates or links exactly one Grade10 account to that
  Shopify customer
- **AND** the buyer can access the order through Grade10 email magic-link sign-in

### Requirement: Checkout validates live Shopify price and inventory

The Store SHALL accept only requested Shopify variant identifiers and quantities
from a shopper. Before creating checkout, it SHALL read each requested variant
from Shopify live, reject an unpublished, unavailable, or insufficient-quantity
variant, and create its local order from the returned price/currency. A cached
response or browser-supplied monetary value SHALL NOT determine an order amount.

#### Scenario: shopify-commerce-SC-06 - An unavailable variant cannot enter checkout

- **GIVEN** browsing previously showed a variant available
- **WHEN** Shopify reports it unavailable or insufficient for the requested
  quantity during checkout
- **THEN** the Store refuses checkout naming that item as unavailable
- **AND** it creates no payable local order or Shopify draft order

#### Scenario: shopify-commerce-SC-07 - Checkout uses live Shopify price and inventory

- **GIVEN** a shopper supplies a cached price for a variant
- **WHEN** Shopify returns a different current price during checkout
- **THEN** the Store's pending order uses Shopify's current price
- **AND** the browser-supplied price has no effect

### Requirement: Checkout hands the shopper to Shopify once

For an accepted checkout, the Store SHALL create one pending local order and
one Shopify draft order containing its live-validated lines as variant and
quantity only, naming the buyer's paired Shopify customer and carrying every
discount the order earns. It SHALL record the draft order reference before
returning the draft's Shopify-hosted invoice URL. Repeating the same checkout
request under its idempotency key SHALL return the original handoff and SHALL
NOT create another order or draft order.

The Store SHALL NOT hold or reserve inventory for a checkout. Stock is
Shopify's to sell until payment, and an item that sold out in between is
refused at Shopify's page, named.

Shopify checkout SHALL collect the shipping address, shipping option, tax,
discount, and payment. The Store's pre-check line total SHALL NOT be represented
as the final charged amount.

#### Scenario: shopify-commerce-SC-08 - A retry returns one checkout handoff

- **GIVEN** the Store has accepted a checkout under an idempotency key
- **WHEN** a shopper retries it with its original idempotency
  key and identical input
- **THEN** the Store returns the same pending order and Shopify checkout URL
- **AND** exactly one local order and one Shopify draft order exist for that
  request

#### Scenario: shopify-commerce-SC-10 - An item that sold out before payment is named

- **GIVEN** the Store has accepted a checkout
- **WHEN** Shopify cannot sell the requested quantity of a line by the time
  the buyer pays
- **THEN** the buyer is told to begin checkout again and the unavailable item
  is identified
- **AND** the Store holds nothing back for them and creates no replacement
  checkout on its own

#### Scenario: shopify-commerce-SC-11 - Backorders are refused

- **GIVEN** a shopper requests checkout with one or more items
- **WHEN** Shopify reports a quantity it cannot sell on any checkout line
- **THEN** the Store refuses checkout naming that item as unavailable
- **AND** it does not offer a backorder or create a payable draft order

#### Scenario: shopify-commerce-SC-12 - A checkout URL is safe to follow

- **GIVEN** the Store has accepted a checkout
- **WHEN** it returns the checkout handoff
- **THEN** the URL is Shopify-hosted
- **AND** no Storefront or Admin credential, payment secret, or unvalidated
  external return URL is present in the response

### Requirement: Store orders project Shopify payment and shipping facts

The Store SHALL retain its own order identity and an auditable projection of
Shopify facts. Its customer and authorized-admin order reads SHALL report
payment independently from shipping. Payment state SHALL distinguish pending,
paid, failed, cancelled, and refunded when Shopify reports each fact. Shipping
state SHALL distinguish not-ready, unfulfilled, partially fulfilled, fulfilled,
shipped, and delivered when Shopify reports each fact.

Each reported Shopify fulfilment SHALL retain its own state and any
Shopify-reported carrier, tracking number, tracking URL, and delivered state.
The Store SHALL NOT invent a shipment, tracking value, delivery estimate, or
delivery confirmation.

#### Scenario: shopify-commerce-SC-13 - A paid order reports payment separately from shipping

- **GIVEN** a customer or authorized administrator reads an order
- **WHEN** Shopify reports it paid but with no fulfilment
- **THEN** the Store reports payment as paid and shipping as unfulfilled or
  not-ready
- **AND** it does not report the order shipped or delivered

#### Scenario: shopify-commerce-SC-14 - A partially fulfilled order shows every shipment

- **GIVEN** a customer or authorized administrator reads an order
- **WHEN** Shopify reports two fulfilments, one shipped with tracking and one
  unfulfilled
- **THEN** the Store reports shipping as partially fulfilled
- **AND** it exposes both fulfilments and the tracking facts only for the
  shipped fulfilment

#### Scenario: shopify-commerce-SC-15 - Only carrier confirmation reports delivery

- **GIVEN** a customer or authorized administrator reads a tracked shipment
- **WHEN** Shopify reports it without carrier delivery
  confirmation
- **THEN** the Store displays the shipment's last reported state
- **AND** it does not display the order or shipment as delivered

### Requirement: Shopify events are verified, deduplicated, and repaired

The Store SHALL verify a Shopify webhook signature over the unmodified raw body
before parsing or processing it. It SHALL process each provider event at most
once and apply payment, cancellation, refund, and fulfilment events only through
valid Store order transitions. Webhook delivery SHALL accelerate a projection,
not be required for correctness: an order read and scheduled reconciliation
SHALL query Shopify by the recorded reference to repair a delayed or missed
event.

#### Scenario: shopify-commerce-SC-16 - An invalid webhook changes nothing

- **GIVEN** the Store receives a Shopify webhook request
- **WHEN** its signature is missing or invalid
  signature
- **THEN** it rejects the request before parsing its payload
- **AND** no order, payment, or shipping state changes

#### Scenario: shopify-commerce-SC-17 - A duplicate webhook is harmless

- **GIVEN** the Store has already processed a verified Shopify event
- **WHEN** Shopify delivers that same event again
- **THEN** the Store records and applies it once
- **AND** every later delivery returns without repeating a transition

#### Scenario: shopify-commerce-SC-18 - A missed webhook is repaired

- **GIVEN** a pending Store order whose Shopify order is paid and fulfilled
- **AND** its corresponding webhook was not processed
- **WHEN** a customer reads the order or reconciliation reaches it
- **THEN** the Store updates the order from Shopify's payment and fulfilment
  facts

### Requirement: Order reads are authorized and integration failures are explicit

A signed-in customer SHALL be able to read only their own Store orders. A
Grade10 staff or administrator with the existing Store-admin authorization MAY
read Store orders for support. Neither audience SHALL use a Store endpoint to
edit Shopify catalogue, inventory, payment, fulfilment, or shipping data.

An absent required Shopify configuration, unsupported Shopify API response, or
Shopify integration failure SHALL return an explicit failure that identifies the
operation without exposing credentials or customer payment/address data.

#### Scenario: shopify-commerce-SC-19 - A paid buyer returns to the store

- **GIVEN** a shopper completes a Shopify checkout with a Grade10 order
- **WHEN** Shopify confirms payment for it
- **THEN** Shopify's confirmation page offers Continue shopping, which returns
  the buyer to the store
- **AND** the order is readable in Your Orders, only through the matching
  Grade10 account

#### Scenario: shopify-commerce-SC-20 - A customer cannot read another customer's order

- **GIVEN** a customer is signed in to Grade10
- **WHEN** they request an order belonging to another customer
- **THEN** the Store refuses the request
- **AND** it returns no payment, shipping, tracking, or address information

#### Scenario: shopify-commerce-SC-21 - A permanent order URL requires its account

- **GIVEN** a customer copies a permanent Grade10 order URL
- **WHEN** anyone opens it without an authenticated session for that order's
  Grade10 account
- **THEN** the Store prompts Grade10 email magic-link sign-in
- **AND** it returns no order, payment, shipping, tracking, or address information

#### Scenario: shopify-commerce-SC-22 - An account lists its orders

- **GIVEN** an authenticated customer has ongoing or past Grade10 orders
- **WHEN** they open their Grade10 order history
- **THEN** the Store lists that account's ongoing and past orders
- **AND** it excludes every order belonging to another account

#### Scenario: shopify-commerce-SC-23 - Integration configuration is incomplete

- **GIVEN** the Store attempts an operation requiring Shopify configuration
- **WHEN** it lacks a required credential or API-version setting
- **THEN** the affected Store operation fails loudly naming the missing setting
- **AND** it does not silently use fixture data or another payment/shipping
  source outside an explicitly configured development environment

### Requirement: Staff refunds are observed

The Store SHALL NOT offer a customer dispute or refund-request action in this
release. When staff initiate a refund through Shopify, the Store SHALL observe
the Shopify-confirmed refund and update the order's payment status.

#### Scenario: shopify-commerce-SC-24 - A staff refund is reflected in payment status

- **GIVEN** Shopify confirms a refund initiated by staff for a paid order
- **WHEN** the Store receives its event or reconciliation reads the order
- **THEN** the Store reports the refund in that order's payment status

#### Scenario: shopify-commerce-SC-25 - A customer cannot start a dispute or refund request

- **GIVEN** a customer views an order in this release
- **WHEN** they look for post-purchase actions
- **THEN** the Store provides no action to submit a dispute or request a refund
