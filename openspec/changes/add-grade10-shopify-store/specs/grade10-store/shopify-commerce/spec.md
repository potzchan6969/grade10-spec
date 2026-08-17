# Shopify Commerce — delta

## Purpose

The Grade10 Store's boundary to Shopify: shoppers browse Shopify-authoritative
products and availability, receive a fifteen-minute finite-stock reservation
before Shopify checkout, and later read their authenticated Store order
projection derived from Shopify payment and fulfilment facts.

## ADDED Requirements

### Requirement: Shopify is authoritative for catalogue and inventory

The Grade10 Store SHALL read published products, variants, price/currency,
media, and current availability from Shopify APIs. It SHALL expose those facts
through the Store API and SHALL NOT keep a Postgres product or inventory mirror.
Catalogue responses MAY be edge-cached only for display; product-change events
SHALL invalidate cached product/list responses and cache expiry SHALL bound a
missed invalidation.

#### Scenario: A shopper browses a current Shopify catalogue

- **GIVEN** Shopify has a published product with a purchasable variant
- **WHEN** a shopper requests the Store catalogue
- **THEN** the Store catalogue response includes that product and its current
  variant price, currency, media, and availability
- **AND** the response contains no Shopify credential or raw Admin API data

#### Scenario: A Shopify product change invalidates browsing data

- **GIVEN** a cached Store response contains a product
- **WHEN** the Store receives a verified Shopify product-change event for it
- **THEN** a later Store catalogue response does not serve that product from the
  invalidated cached response

#### Scenario: Shopify catalogue data is unavailable

- **GIVEN** a shopper requests a catalogue response with no usable cached copy
- **WHEN** Shopify cannot answer that catalogue request
- **THEN** the Store reports an integration-unavailable outcome that identifies
  the failed read
- **AND** it does not report invented availability or price

### Requirement: Existing customers sign in and guests gain a linked account after payment

Before checkout handoff, the Store SHALL ask for the shopper's email. When the
email belongs to an existing Grade10 account, the Store SHALL require that
customer to sign in through Grade10 email magic link before handoff and SHALL
use that account's one-to-one Shopify customer association. It SHALL NOT create
another Grade10 account or Shopify customer association for that email.

When the email belongs to no Grade10 account, the Store SHALL permit guest
checkout and create one Shopify customer before checkout. After Shopify confirms
payment, the Store SHALL create the Grade10 account when needed, link it
one-to-one to that Shopify customer, and make its orders available through
Grade10 email magic-link sign-in.

#### Scenario: An existing Grade10 customer signs in before checkout

- **GIVEN** a shopper begins checkout
- **WHEN** they supply an email belonging to an existing Grade10 account
- **THEN** the Store prompts Grade10 email magic-link sign-in before it creates
  a Shopify checkout handoff
- **AND** it creates no additional Grade10 account or Shopify customer link

#### Scenario: A guest receives a linked Grade10 account after payment

- **GIVEN** a guest checkout email belongs to no Grade10 account
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

#### Scenario: An unavailable variant cannot enter checkout

- **GIVEN** browsing previously showed a variant available
- **WHEN** Shopify reports it unavailable or insufficient for the requested
  quantity during checkout
- **THEN** the Store refuses checkout naming that item as unavailable
- **AND** it creates no payable local order or Shopify draft order

#### Scenario: Checkout uses live Shopify price and inventory

- **GIVEN** a shopper supplies a cached price for a variant
- **WHEN** Shopify returns a different current price during checkout
- **THEN** the Store's pending order uses Shopify's current price
- **AND** the browser-supplied price has no effect

### Requirement: Checkout hands the shopper to Shopify once

For an accepted checkout, the Store SHALL create one pending local order and a
Shopify draft order containing its live-validated lines. For every line with
finite Shopify inventory, it SHALL reserve the requested quantity for exactly
fifteen minutes. It SHALL record the local order identifier on the draft order
and record the returned Shopify draft-order and checkout reference before
returning the Shopify-hosted checkout URL. Repeating the same checkout request
under its idempotency key SHALL return the original handoff and SHALL NOT create
another order, draft order, or reservation.

Shopify checkout SHALL collect the shipping address, shipping option, tax,
discount, and payment. The Store's pre-check line total SHALL NOT be represented
as the final charged amount.

#### Scenario: A retry returns one checkout handoff

- **GIVEN** the Store has accepted a checkout under an idempotency key
- **WHEN** a shopper retries it with its original idempotency
  key and identical input
- **THEN** the Store returns the same pending order and Shopify checkout URL
- **AND** exactly one local order, Shopify draft order, and reservation exist
  for that request

#### Scenario: A finite-stock checkout holds inventory for fifteen minutes

- **GIVEN** a shopper requests a purchasable finite-stock Shopify variant
- **WHEN** the Store accepts that checkout
- **THEN** Shopify reserves the requested quantity for fifteen minutes
- **AND** that quantity is unavailable to another checkout for the reservation's
  lifetime

#### Scenario: An expired reservation cannot be paid as held stock

- **GIVEN** a checkout reservation whose fifteen-minute window has elapsed
- **WHEN** the buyer follows its Shopify checkout URL
- **THEN** the Store does not extend or recreate the reservation automatically
- **AND** if Shopify cannot sell the requested quantity, the buyer is told to
  begin checkout again and the unavailable item is identified

#### Scenario: Backorders are refused

- **GIVEN** a shopper requests checkout with one or more items
- **WHEN** Shopify cannot reserve the requested quantity of any checkout line
- **THEN** the Store refuses checkout naming that item as unavailable
- **AND** it does not offer a backorder, create a payable draft order, or create
  a replacement reservation

#### Scenario: A checkout URL is safe to follow

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

#### Scenario: A paid order reports payment separately from shipping

- **GIVEN** a customer or authorized administrator reads an order
- **WHEN** Shopify reports it paid but with no fulfilment
- **THEN** the Store reports payment as paid and shipping as unfulfilled or
  not-ready
- **AND** it does not report the order shipped or delivered

#### Scenario: A partially fulfilled order shows every shipment

- **GIVEN** a customer or authorized administrator reads an order
- **WHEN** Shopify reports two fulfilments, one shipped with tracking and one
  unfulfilled
- **THEN** the Store reports shipping as partially fulfilled
- **AND** it exposes both fulfilments and the tracking facts only for the
  shipped fulfilment

#### Scenario: Only carrier confirmation reports delivery

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

#### Scenario: An invalid webhook changes nothing

- **GIVEN** the Store receives a Shopify webhook request
- **WHEN** its signature is missing or invalid
  signature
- **THEN** it rejects the request before parsing its payload
- **AND** no order, payment, or shipping state changes

#### Scenario: A duplicate webhook is harmless

- **GIVEN** the Store has already processed a verified Shopify event
- **WHEN** Shopify delivers that same event again
- **THEN** the Store records and applies it once
- **AND** every later delivery returns without repeating a transition

#### Scenario: A missed webhook is repaired

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

#### Scenario: A paid buyer lands on their Grade10 order

- **GIVEN** a shopper completes a Shopify checkout with a Grade10 order
- **WHEN** Shopify confirms payment for it
- **THEN** the buyer is returned to that order's permanent Grade10 URL
- **AND** the order page is available only through the matching Grade10 account

#### Scenario: A customer cannot read another customer's order

- **GIVEN** a customer is signed in to Grade10
- **WHEN** they request an order belonging to another customer
- **THEN** the Store refuses the request
- **AND** it returns no payment, shipping, tracking, or address information

#### Scenario: A permanent order URL requires its account

- **GIVEN** a customer copies a permanent Grade10 order URL
- **WHEN** anyone opens it without an authenticated session for that order's
  Grade10 account
- **THEN** the Store prompts Grade10 email magic-link sign-in
- **AND** it returns no order, payment, shipping, tracking, or address information

#### Scenario: An account lists its orders

- **GIVEN** an authenticated customer has ongoing or past Grade10 orders
- **WHEN** they open their Grade10 order history
- **THEN** the Store lists that account's ongoing and past orders
- **AND** it excludes every order belonging to another account

#### Scenario: Integration configuration is incomplete

- **GIVEN** the Store attempts an operation requiring Shopify configuration
- **WHEN** it lacks a required credential or API-version setting
- **THEN** the affected Store operation fails loudly naming the missing setting
- **AND** it does not silently use fixture data or another payment/shipping
  source outside an explicitly configured development environment

### Requirement: Staff refunds are observed

The Store SHALL NOT offer a customer dispute or refund-request action in this
release. When staff initiate a refund through Shopify, the Store SHALL observe
the Shopify-confirmed refund and update the order's payment status.

#### Scenario: A staff refund is reflected in payment status

- **GIVEN** Shopify confirms a refund initiated by staff for a paid order
- **WHEN** the Store receives its event or reconciliation reads the order
- **THEN** the Store reports the refund in that order's payment status

#### Scenario: A customer cannot start a dispute or refund request

- **GIVEN** a customer views an order in this release
- **WHEN** they look for post-purchase actions
- **THEN** the Store provides no action to submit a dispute or request a refund
