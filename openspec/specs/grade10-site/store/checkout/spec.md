# grade10-site/store/checkout Specification

## Purpose

A member's or a guest's Store checkout is a live decision before a
Shopify-hosted payment. It carries a current basket, and a member's accepted
tender, into one hosted checkout while Grade10 retains the order of record and
repairs its payment lifecycle.

## Feature set

- Current basket and tender
  - Live line review before Pay and again at the payment decision
  - Accepted promo and points choices beside a subtotal estimate
  - Shipping and tax left to Shopify's address-aware checkout
- Hosted Shopify handoff
  - Member and guest storefront checkout through one Shopify draft-order invoice
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
- Guest checkout
  - The basket and at most one public code: no member's code, no reward
    coupon and no points
  - The email address taken on Shopify's page and kept once paid
  - A guest order earns nothing: no account made, no points, no claim
  - A private order link, and Continue back to the order just sent
  - A guest order joins the account that proves its address, and is listed
    in that member's My Orders
- Carrier rates
  - Shopify asks a token-gated stateless carrier rule for served destinations
  - The callback and store preview use the same configured rate

## Requirements

### Requirement: Checkout reviews the current member basket before payment

Checkout SHALL make a current decision from the member's cart at both checkout
open and the Pay action. A result from the cart drawer SHALL never stand in for
the Pay read.

**Review** - The checkout SHALL read every line from the live shop, name a line
whose price, availability or quantity changed, and keep Pay unavailable while
the read is pending, failed or contradictory.

**Tender** - The checkout SHALL show the accepted promo or points choice beside
the reviewed subtotal. It SHALL state that shipping and tax are calculated by
Shopify after the buyer supplies an address.

**No stale handoff** - A failed or contradictory read SHALL create no Grade10
order and no Shopify checkout. The collector SHALL be able to retry or fix the
named line.

<!-- trace:scenario id=g10.store-checkout.SC-a01 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-01 - A member sees a current basket before Pay
**Serves:** grade10-site-store-checkout-US-01 - The collector reviews the basket before starting hosted payment

- **GIVEN** a signed-in collector has one member-cart line that the shop still sells
- **WHEN** the collector opens checkout and waits for the live read
- **THEN** the line shows the shop's current title, quantity, price and availability
- **AND** Pay is available only after the read is ready

<!-- trace:scenario id=g10.store-checkout.SC-b02 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-02 - A tender choice is shown as an estimate
**Serves:** grade10-site-store-checkout-US-01 - The collector checks the accepted tender before leaving for Shopify

- **GIVEN** a signed-in collector has chosen an accepted promo or points amount
- **WHEN** checkout quotes the reviewed basket
- **THEN** the subtotal and accepted tender choice are shown in the store's currency
- **AND** shipping and tax are described as calculated at Shopify checkout, not as part of the store's final charge

<!-- trace:scenario id=g10.store-checkout.SC-c03 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-03 - A moved line blocks a stale payment
**Serves:** grade10-site-store-checkout-US-02 - The collector repairs a changed line before payment

- **GIVEN** a collector's line is repriced or reduced while the checkout read is running
- **WHEN** the live read answers
- **THEN** the changed line is named with the shop's current answer
- **AND** Pay is unavailable
- **AND** no Grade10 order or Shopify checkout is created by that read

<!-- trace:scenario id=g10.store-checkout.SC-d04 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-04 - A failed read keeps held facts unchecked
**Serves:** grade10-site-store-checkout-US-02 - The collector retries a checkout whose live read failed

- **GIVEN** a collector is on checkout and the live shop read fails
- **WHEN** the checkout summary renders
- **THEN** the last held price and availability are not presented as current
- **AND** Pay is unavailable
- **AND** a retry is offered without creating an order

### Requirement: A signed-in member receives one Shopify hosted checkout

The public storefront SHALL require a fresh signed-in member session before it
creates a member's order. The server SHALL own all money facts and SHALL hand
Shopify a reviewed basket without relying on client-supplied amounts.

**Storefront boundary** - A collector with no session SHALL check out as a
guest, under the guest checkout requirement below, and SHALL NOT be asked to
sign in, at any value. Typed-email checkout MAY exist only on the
development and staging operator test surface.

**Order write** - The server SHALL insert the Grade10 order and its lines in
one transaction, call Shopify outside that transaction, and record the
provider references before it returns a hosted URL.

**Shopify handoff** - A new checkout SHALL be a Shopify Draft Order carrying
the reviewed variant ids, quantities, paired member customer where available,
and accepted automatic discounts. Shopify's invoice page SHALL own address,
shipping, tax and payment. The storefront SHALL not receive or store an
embedded payment secret.

<!-- trace:scenario id=g10.store-checkout.SC-e05 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-05 - A member receives one hosted invoice
**Serves:** grade10-site-store-checkout-US-01 - The collector leaves Grade10 only after one local order is bound to Shopify

- **GIVEN** a signed-in member has a ready reviewed basket
- **WHEN** the member presses Pay
- **THEN** one Grade10 pending order and its lines are written
- **AND** one Shopify hosted invoice opens with the reviewed variants and quantities
- **AND** the member is not shown an embedded payment form

<!-- trace:scenario id=g10.store-checkout.SC-g07 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-07 - Shopify names a line refused at payment
**Serves:** grade10-site-store-checkout-US-02 - The collector gets a named provider refusal instead of a paid stale line

- **GIVEN** a Shopify invoice was created while a line was sellable
- **WHEN** Shopify refuses that line because it sold out before payment
- **THEN** Shopify names the unavailable line
- **AND** the Grade10 order is not marked paid
- **AND** the collector can return to the same basket and retry after fixing it

<!-- trace:scenario id=g10.store-checkout.SC-h08 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-08 - The provider reference is bound before handoff
**Serves:** Hosted Shopify handoff - the recovery path can identify the invoice before the buyer leaves

- **GIVEN** Shopify creates a Draft Order for a Grade10 pending order
- **WHEN** the server prepares the hosted invoice response
- **THEN** the local order stores the provider checkout reference before the URL is returned
- **AND** a database transaction never remains open while Shopify is called

### Requirement: A guest checks out with a public code at most, and the order earns no points

A collector with no session SHALL check out the cart this browser holds as a
guest. A request that carries a session SHALL be refused rather than written
as a guest's.

**Tender** - A guest checkout SHALL carry the reviewed lines and at most one
public code the shop accepted, a code open to everyone and minted to no
member. It SHALL carry no reward coupon and no points. A code minted to a
member SHALL be refused to a guest as a code that does not exist.

**Email** - Shopify's page SHALL take the buyer's email address, and the store
SHALL keep that address on the order once it is paid.

**No points** - Paying a guest order SHALL make no account. A guest order
SHALL earn no points, before or after it joins an account, and an operator's
claim of it SHALL be refused.

**Joining** - A paid guest order SHALL join the account whose sign-in proved
the address it was paid under: on that account's sign-in, or at payment when
the account already proved it. A member's My Orders SHALL list the guest
orders paid under the address their sign-in proved.

**The cart** - This browser's cart SHALL keep the basket while the guest's
hosted invoice is unpaid. It SHALL be emptied once this browser reads the
order paid, unless the guest changed the cart's lines or code after Pay.

<!-- trace:scenario id=g10.store-checkout.SC-f06 rev=5 -->
#### Scenario: grade10-site-store-checkout-SC-06 - A signed-out buyer checks out as a guest
**Serves:** grade10-site-store-checkout-US-04 - A collector with no account pays for the cart

- **GIVEN** a collector has no signed-in session, and a ready basket of any
  value
- **WHEN** they continue to payment
- **THEN** one Grade10 guest order and one Shopify hosted invoice are created
- **AND** they are not asked to sign in

<!-- trace:scenario id=g10.store-checkout.SC-wet rev=4 -->
#### Scenario: grade10-site-store-checkout-SC-66 - A guest pays the basket and a public code
**Serves:** grade10-site-store-checkout-US-04 - A collector with no account pays for the cart

- **GIVEN** a signed-out collector whose browser cart holds a ready basket
  with a public code the shop accepted
- **WHEN** they press Pay
- **THEN** the hosted invoice carries the reviewed lines and that code, with
  no reward coupon or points
- **AND** this browser's cart still holds the basket while the invoice is
  unpaid, and is empty once this browser reads the order paid

<!-- trace:scenario id=g10.store-checkout.SC-p4c rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-74 - A member's code typed by a guest is refused
**Serves:** grade10-site-store-checkout-US-04 - A collector with no account pays for the cart

- **GIVEN** a signed-out collector with a ready basket
- **WHEN** they type a code minted to a member
- **THEN** it is refused as a code that does not exist
- **AND** nothing says whose code it is, or whether it is spent or lapsed

<!-- trace:scenario id=g10.store-checkout.SC-1yf rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-67 - A paid guest order under an address with no account belongs to nobody
**Serves:** grade10-site-store-checkout-US-04 - A collector with no account pays for the cart

- **GIVEN** a guest order whose buyer typed an address with no Grade10 account
  on Shopify's page
- **WHEN** Shopify reports it paid
- **THEN** the order keeps that address and names no owner
- **AND** no account is made from the address
- **AND** no points are earned on the order
- **AND** an operator's claim of the order is refused

<!-- trace:scenario id=g10.store-checkout.SC-2g0 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-68 - A signed-in request is never a guest's
**Serves:** grade10-site-store-checkout-US-04 - A collector with no account pays for the cart

- **GIVEN** a signed-in member
- **WHEN** a guest checkout request carries their session
- **THEN** the request is refused
- **AND** no guest order is made

<!-- trace:scenario id=g10.store-checkout.SC-pxw rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-71 - A member's My Orders lists guest orders under their address
**Serves:** grade10-site-store-checkout-US-09 - A buyer finds a guest order again

- **GIVEN** a guest order paid under the address a member signs in with
- **WHEN** that member opens My Orders
- **THEN** the guest order is listed
- **AND** it names that member as its owner and has earned no points

<!-- trace:scenario id=g10.store-checkout.SC-q8v rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-75 - A joined guest order earns nothing when it completes
**Serves:** grade10-site-store-checkout-US-09 - A buyer finds a guest order again

- **GIVEN** a paid guest order joined to a member's account before Shopify
  fulfils it
- **WHEN** every item is fulfilled
- **THEN** the order earns no points
- **AND** the member's points balance is unchanged

### Requirement: A guest order opens from its private link

Every order SHALL carry a link to its Grade10 page, and Shopify's order emails
SHALL print it. A member's link SHALL be their order under
`/profile/orders/<order-id>`. A guest order's link SHALL be
`/orders/<order-id>#<secret>`: the secret rides after `#`, so no server or log
sees it.

The page SHALL open the order for whoever holds the link, ask nobody to sign
in, and show the same order facts as a member's order. An unknown order, a
member's order, a wrong secret and a missing secret SHALL all show not-found.
The page SHALL tell search engines not to index it.

<!-- trace:scenario id=g10.store-checkout.SC-g6e rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-69 - The link opens the guest order
**Serves:** grade10-site-store-checkout-US-09 - A buyer finds a guest order again

- **GIVEN** a paid guest order and its link from Shopify's confirmation email
- **WHEN** anyone opens the link, signed in or not
- **THEN** the order's page shows its items, money and progress
- **AND** nothing asks them to sign in

<!-- trace:scenario id=g10.store-checkout.SC-kl3 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-70 - A wrong link shows not-found
**Serves:** grade10-site-store-checkout-US-09 - A buyer finds a guest order again

- **GIVEN** a link to an unknown order, to a member's order, with a wrong
  secret, or with no secret
- **WHEN** it is opened
- **THEN** the site's not-found page shows
- **AND** nothing about the order is revealed

### Requirement: Continue opens the order this browser last sent to Shopify

Shopify's Thank you Continue SHALL reach `/orders/latest`. That page SHALL open
the order this browser last sent to Shopify, once, and only within a day of
that checkout: a guest's private page, or a member's own order. With no such
order remembered, it SHALL send a signed-in member to My Orders and anyone
else to the store, deciding only once the session has resolved. The page SHALL
tell search engines not to index it.

<!-- trace:scenario id=g10.store-checkout.SC-gxp rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-72 - Continue opens the order just paid
**Serves:** grade10-site-store-checkout-US-09 - A buyer finds a guest order again

- **GIVEN** a guest or a member who paid on Shopify in this browser
- **WHEN** they press Continue on Shopify's Thank you page
- **THEN** that order's Grade10 page opens: a guest's private page, or the
  member's own order

<!-- trace:scenario id=g10.store-checkout.SC-lrv rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-73 - With no order remembered, Continue falls back
**Serves:** grade10-site-store-checkout-US-09 - A buyer finds a guest order again

- **GIVEN** a browser that remembers no checkout, one that already used it, or
  one whose checkout is more than a day old
- **WHEN** `/orders/latest` opens
- **THEN** a signed-in member lands on My Orders
- **AND** anyone else lands on the store

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

### Requirement: Shopify payment settles one Grade10 order

The store SHALL treat a Shopify hosted invoice as pending until Shopify reports
payment. A verified webhook SHALL accelerate the same guarded order transition;
the reconcile pass and the buyer's order read SHALL repair a missed event through
that transition rather than create another order.

**Settlement** - A paid invoice SHALL move its pending order to `paid` once and
retain the provider's paid total, goods, shipping, tax and order identity when
Shopify supplies them. Duplicate or cross-shop events SHALL not settle another
order.

**Visibility** - My Orders SHALL show a newly placed pending order as
settling, poll while it can move, and show the paid order and its paid total
after settlement.

**Cart release** - The member cart SHALL remain while the collector is at
Shopify and SHALL release the paid lines only after the order is `paid`.

**Return** - A Shopify Thank You and Order status checkout UI extension SHALL
offer a static link to Grade10 My Orders, where the matching purchase is
visible after the member returns. The extension SHALL not promise a
purchase-specific deep link. The native Continue shopping button and Shopify
account path SHALL not be the required return destination.

<!-- trace:scenario id=g10.store-checkout.SC-l12 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-12 - A pending order remains visible while payment settles
**Serves:** grade10-site-store-checkout-US-03 - The collector can see that a returned purchase is still settling

- **GIVEN** a member has returned from Shopify with a new pending order
- **WHEN** they open My Orders before payment settlement
- **THEN** the order appears in the active orders section
- **AND** pending is shown as a settling state, not an empty result or an error
- **AND** the page polls while the order can still move

<!-- trace:scenario id=g10.store-checkout.SC-m13 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-13 - A paid event settles once and releases the cart
**Serves:** grade10-site-store-checkout-US-03 - The collector finds the paid order and an empty member cart

- **GIVEN** a member has a pending Shopify invoice and its paid event arrives
- **WHEN** the event is delivered again
- **THEN** the Grade10 order moves to `paid` once
- **AND** the provider's paid total is shown in the order
- **AND** the member cart releases the paid lines only after the paid transition

<!-- trace:scenario id=g10.store-checkout.SC-n14 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-14 - Reconcile repairs a missed paid event
**Serves:** grade10-site-store-checkout-US-03 - The collector's paid order is repaired even when the webhook is missing

- **GIVEN** a Shopify invoice was paid but its webhook did not arrive
- **WHEN** the payment reconciliation pass runs
- **THEN** it finds the existing provider checkout
- **AND** the order moves to `paid` once without creating another invoice
- **AND** the order retains the paid total and any shipping or tax facts Shopify provided

<!-- trace:scenario id=g10.store-checkout.SC-o15 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-15 - Confirmation returns to the Grade10 order
**Serves:** grade10-site-store-checkout-US-03 - The collector continues from Shopify to the purchase in Grade10

- **GIVEN** a member has completed payment on a Shopify invoice
- **WHEN** the member activates the Grade10 My Orders link on the Shopify
  confirmation page
- **THEN** the Grade10 orders surface opens and shows the matching purchase
- **AND** it does not require the native Continue shopping button or send the
  member to a Shopify account page

<!-- trace:scenario id=g10.store-checkout.SC-p16 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-16 - An invalid payment event does not settle an order
**Serves:** Order settlement and return - the settlement guard rejects an event it cannot bind to this shop and order

- **GIVEN** a payment event has an unknown provider reference, wrong shop or invalid signature
- **WHEN** the store receives the event
- **THEN** no Grade10 order moves to `paid`
- **AND** the event is recorded for diagnosis without creating a replacement order

### Requirement: Shopify uses the store's carrier rule

The carrier callback SHALL be stateless and token-gated. For a destination and
cart that the configured carrier rule serves, it SHALL return the same rate
that the store preview shows. For an unsupported destination it SHALL return no
rate. The callback SHALL not create an order or change the cart.

<!-- trace:scenario id=g10.store-checkout.SC-q17 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-17 - A served destination receives the configured rate
**Serves:** grade10-site-store-checkout-US-01 - The collector sees the same served shipping choice in the preview and hosted checkout

- **GIVEN** a reviewed member basket and a destination covered by the configured carrier rule
- **WHEN** the store preview and Shopify carrier callback calculate shipping
- **THEN** both return the same configured rate and currency
- **AND** the callback does not create an order or mutate the cart

<!-- trace:scenario id=g10.store-checkout.SC-r18 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-18 - An unsupported destination receives no rate
**Serves:** grade10-site-store-checkout-US-01 - The collector cannot select a carrier rate outside the served destination rule

- **GIVEN** a reviewed member basket and a destination outside the configured carrier rule
- **WHEN** Shopify calls the carrier callback
- **THEN** the callback returns no carrier rate
- **AND** it does not create an order or mutate the cart
