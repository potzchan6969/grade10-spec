# grade10-site/store/checkout Specification

## Purpose

An authenticated collector's Store checkout is a live decision before a
Shopify-hosted payment. It carries a current basket and accepted tender into
one hosted checkout while Grade10 retains the order of record and repairs its
payment lifecycle.

## Feature set

- Current basket and tender
  - Live review: current lines in the cart drawer and a server recheck at Pay
  - Tender estimate: accepted promo and points choices beside a subtotal
  - Final charges: Shopify calculates address-aware shipping and tax
- Hosted Shopify handoff
  - Member checkout: a fresh signed-in session starts one hosted invoice
  - Bound handoff: the local order identifies the invoice before redirect
  - Refusal: unavailable lines remain unpaid and named
- Safe repetition and recovery
  - Intent replay: repeated Pay and same-session reload retain one purchase
  - Recovery: uncertain provider state cannot create a second payable invoice
  - Changed purchase: basket or tender edits invalidate the earlier intent
- Order settlement and return
  - Settlement: webhook, reconciliation and owned detail reads converge
  - Paid purchase: Your Orders shows payment and releases paid cart lines
  - Return: Shopify confirmation links to Grade10 Your Orders
- Carrier rates
  - Served destinations: a token-gated stateless callback answers Shopify
  - Shared rate: callback and store preview use the same configuration

## MODIFIED Requirements

### Requirement: Checkout reviews the current member basket before payment

The cart drawer SHALL continuously review the member's current basket and quote
accepted tender while open. Pay SHALL trigger a server recheck; no separate
checkout page or extra client read before Pay is required. A drawer quote SHALL
never stand in for the server decision.

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
- **WHEN** the collector opens the cart drawer and waits for its live quote
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

- **GIVEN** a collector's line is sold out, repriced or reduced while the checkout read is running
- **WHEN** the live read answers
- **THEN** the changed line is named with the shop's current answer
- **AND** Pay is unavailable
- **AND** no Grade10 order or Shopify checkout is created by that read

<!-- trace:scenario id=g10.store-checkout.SC-d04 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-04 - A failed read keeps held facts unchecked
**Serves:** grade10-site-store-checkout-US-02 - The collector retries a checkout whose live read failed

- **GIVEN** a collector's cart drawer is open and the live shop read fails
- **WHEN** the drawer summary renders
- **THEN** the last held price and availability are not presented as current
- **AND** Pay is unavailable
- **AND** a retry is offered without creating an order

### Requirement: A signed-in member receives one Shopify hosted checkout

The public storefront SHALL require a fresh signed-in member session before it
creates an order. The server SHALL own all money facts and SHALL hand Shopify a
reviewed basket without relying on client-supplied amounts.

**Storefront boundary** - A signed-out collector SHALL be asked to sign in and
no public storefront order or Shopify checkout SHALL be created. Typed-email
checkout SHALL exist only on the elevated development and staging operator test
surface, with the same restriction enforced by the server before any write.

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

<!-- trace:scenario id=g10.store-checkout.SC-f06 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-06 - A signed-out buyer cannot start storefront checkout
**Serves:** grade10-site-store-checkout-US-04 - The public storefront requires a proved member identity

- **GIVEN** a collector has no signed-in session on the public checkout
- **WHEN** they try to continue to payment
- **THEN** the collector is asked to sign in
- **AND** no Grade10 order or Shopify checkout is created
- **AND** a typed email is not treated as proof for the public storefront

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

<!-- trace:scenario id=g10.store-checkout.SC-ae31 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-31 - Typed email is restricted to the operator sandbox
**Serves:** grade10-site-store-checkout-US-04 - The collector cannot substitute an email for signed-in checkout

- **GIVEN** a caller lacks elevated operator access or uses production
- **WHEN** the caller invokes typed-email checkout
- **THEN** the server refuses before identity lookup, order creation or provider calls
- **AND** an authorized development or staging operator retains the existing typed-email bench flow

<!-- trace:scenario id=g10.store-checkout.SC-af32 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-32 - Gross goods controls buyer verification
**Serves:** grade10-site-store-checkout-US-01 - The collector follows the account verification gate before a high-value purchase

- **GIVEN** gross goods are at least HKD 120,000 and the buyer is unverified
- **WHEN** the basket is reviewed and Pay is attempted with a discount or points choice
- **THEN** the drawer replaces Pay with an account-verification action
- **AND** the server refuses before creating an order even when tender reduces the estimate below the threshold

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

**Replay order** - Fresh member authentication SHALL precede intent replay.
Unchanged intent replay SHALL precede new live-money or verification checks;
later catalog changes SHALL not turn a settled intent into another purchase.

**Creation paths** - A dispatched intent SHALL not create another hosted invoice
through an automatic customer retry or a gift-retirement fallback. A mismatched
invoice SHALL not be handed to the collector. Uncertain retirement SHALL keep
the order recoverable with its original payable facts until cancellation or
payment is verified. A new changed purchase SHALL wait while an earlier
dispatch remains unresolved.

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

<!-- trace:scenario id=g10.store-checkout.SC-v22 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-22 - Pay refuses facts changed after the drawer quote
**Serves:** grade10-site-store-checkout-US-02 - The collector repairs a line that changed after review

- **GIVEN** the drawer quote is ready and a line changes before Pay
- **WHEN** the member presses Pay
- **THEN** the server names the changed line and creates no order or invoice

<!-- trace:scenario id=g10.store-checkout.SC-w23 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-23 - Reload retains the purchase intent
**Serves:** grade10-site-store-checkout-US-01 - The collector resumes a delayed checkout in the same session

- **GIVEN** a member submitted Pay and the response is delayed
- **WHEN** the same-session page reloads and the unchanged basket is submitted
- **THEN** the existing order and invoice or settling result are returned
- **AND** no additional order or invoice is created

<!-- trace:scenario id=g10.store-checkout.SC-x24 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-24 - A reused intent cannot change the purchase
**Serves:** Safe repetition and recovery - callers cannot rewrite the purchase attached to an intent

- **GIVEN** an intent already identifies a reviewed basket and tender
- **WHEN** a request repeats its key with different basket or tender choices
- **THEN** the existing intent-conflict result identifies the original order
- **AND** no new reservation, order or invoice is created

<!-- trace:scenario id=g10.store-checkout.SC-y25 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-25 - Later catalog changes do not block terminal replay
**Serves:** grade10-site-store-checkout-US-01 - The collector recognizes an already completed purchase

- **GIVEN** a member's intent is settled and catalog or verification facts later change
- **WHEN** the freshly authenticated member repeats the unchanged intent
- **THEN** its existing terminal outcome is returned without a new live-money gate
- **AND** no new purchase or provider creation is started

<!-- trace:scenario id=g10.store-checkout.SC-z26 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-26 - Customer refusal cannot create a replacement invoice
**Serves:** Safe repetition and recovery - provider convenience retries retain the purchase guarantee

- **GIVEN** the first dispatched checkout refuses the paired customer
- **WHEN** checkout handles that refusal
- **THEN** the collector receives a refusal or recovery result
- **AND** the same intent does not automatically create another invoice without the customer

<!-- trace:scenario id=g10.store-checkout.SC-aa27 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-27 - Gift cleanup cannot replace an uncertain invoice
**Serves:** grade10-site-store-checkout-US-02 - The collector avoids paying a basket that no longer matches the accepted gift

- **GIVEN** the created invoice charges a gift that the accepted tender no longer supports
- **WHEN** cancellation fails or its result is uncertain
- **THEN** the mismatched invoice is not offered as a valid handoff
- **AND** the order retains the original payable facts for recovery or settlement
- **AND** no replacement invoice is created for that intent

<!-- trace:scenario id=g10.store-checkout.SC-ab28 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-28 - Unresolved dispatch blocks a changed purchase
**Serves:** grade10-site-store-checkout-US-01 - The collector cannot bypass an uncertain purchase by changing its key

- **GIVEN** a member has a dispatched checkout whose provider state is unresolved
- **WHEN** that member submits a new intent after a basket or tender edit
- **THEN** checkout returns a settling or recovery-required result for the unresolved order
- **AND** no new invoice is created until payment or cancellation is verified

### Requirement: Shopify payment settles one Grade10 order

The store SHALL treat a Shopify hosted invoice as pending until Shopify reports
payment. A verified webhook SHALL accelerate the same guarded order transition;
the reconcile pass and the buyer's order read SHALL repair a missed event through
that transition rather than create another order. Owned detail reads SHALL
check the member before repair; order lists SHALL project stored orders without
repairing every row through the provider.

**Settlement** - A paid invoice SHALL move its pending order to `paid` once and
retain the provider's paid total, goods, shipping, tax and order identity when
Shopify supplies them. Duplicate or cross-shop events SHALL not settle another
order.

**Visibility** - Your Orders SHALL show a newly placed pending order as
settling, poll while it can move, and show the paid order and its paid total
after settlement.

**Cart release** - The member cart SHALL remain while the collector is at
Shopify and SHALL release the paid lines only after the order is `paid`.

**Return** - A Shopify Thank You and Order status checkout UI extension SHALL
offer a static link to Grade10 Your Orders, where the matching purchase is
visible after the member returns. The extension SHALL not promise a
purchase-specific deep link. The native Continue shopping button and Shopify
account path SHALL not be the required return destination.

<!-- trace:scenario id=g10.store-checkout.SC-l12 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-12 - A pending order remains visible while payment settles
**Serves:** grade10-site-store-checkout-US-03 - The collector can see that a returned purchase is still settling

- **GIVEN** a member has returned from Shopify with a new pending order
- **WHEN** they open Your Orders before payment settlement
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
- **WHEN** the member activates the Grade10 Your Orders link on the Shopify
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

<!-- trace:scenario id=g10.store-checkout.SC-ac29 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-29 - Another member cannot trigger payment repair
**Serves:** Order settlement and return - order repair is reached only by the member who owns the order

- **GIVEN** an open order belongs to another member
- **WHEN** the signed-in caller requests its detail
- **THEN** no order is disclosed and no provider read or repair is triggered

<!-- trace:scenario id=g10.store-checkout.SC-ad30 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-30 - Order list remains a stored projection
**Serves:** grade10-site-store-checkout-US-03 - The collector opens Your Orders while background settlement continues

- **GIVEN** a member owns several pending orders
- **WHEN** the member opens the orders list
- **THEN** the stored orders are shown without a provider repair for every row
- **AND** owned detail reads and reconciliation retain their repair paths

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
