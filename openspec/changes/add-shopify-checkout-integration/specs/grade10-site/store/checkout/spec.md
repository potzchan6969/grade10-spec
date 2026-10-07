# grade10-site/store/checkout Specification

## Feature set

- Current basket and tender
  - Live review: review on open and make a current decision at Pay, including reuse
  - Accepted tender: persist coupon and points before handoff
  - Estimate: leave shipping, tax and final payment to Shopify
- Hosted Shopify handoff
  - Member identity: require a fresh signed-in storefront session
  - Hosted invoice: bind order and provider facts before leaving
  - Safe response: preserve refusal/verification feedback and guard stale navigation
- Safe repetition and recovery
  - Purchase identity: preserve one purchase across Pay, reload and terminal replay
  - Invoice reuse: resume the same purchase without duplicate creation
  - Recovery: retain one purchase through concurrency, response loss and worker failure
  - Changed intent: persist basket/tender edits and retire older invoices
- Order settlement and return
  - Order state: poll pending purchases and read authoritative settlement
  - Cart conversion: clear only the unchanged cart bought; preserve later cart/tender
  - Return: use the static Shopify confirmation link to Your Orders
- Carrier rates
  - Stateless callback: preserve token gating and served destinations
  - Preview parity: verify the same rate/currency without cart or order writes

## MODIFIED Requirements

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

**Cart Context** - Pay SHALL wait for acknowledged member-cart and tender writes. The server SHALL verify the submitted active cart id/version, exact lines and accepted tender before new or reused handoff. A saved invoice SHALL never bypass the live payment decision or silently substitute its older tender.

<!-- trace:scenario id=g10.store-checkout.SC-a01 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-01 - A member sees a current basket before Pay
**Serves:** grade10-site-store-checkout-US-01 - The collector reviews the basket before starting hosted payment

- **GIVEN** a signed-in collector has one member-cart line that the shop still sells
- **WHEN** the collector opens checkout and waits for the live read
- **THEN** the line shows the shop's current title, quantity, price and availability
- **AND** Pay is available only after the read is ready

<!-- trace:scenario id=g10.store-checkout.SC-b02 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-02 - A tender choice is shown as an estimate
**Serves:** grade10-site-store-checkout-US-01 - The collector checks the accepted tender before leaving for Shopify

- **GIVEN** a signed-in collector has chosen an accepted promo or points amount
- **WHEN** checkout quotes the reviewed basket
- **THEN** the subtotal and accepted tender choice are shown in the store's currency
- **AND** shipping and tax are described as calculated at Shopify checkout, not as part of the store's final charge

<!-- trace:scenario id=g10.store-checkout.SC-c03 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-03 - A moved line blocks a stale payment
**Serves:** grade10-site-store-checkout-US-02 - The collector repairs a changed line before payment

- **GIVEN** a collector's line is sold out, repriced or reduced while the checkout read is running
- **WHEN** the live read answers
- **THEN** the changed line is named with the shop's current answer
- **AND** Pay is unavailable
- **AND** no Grade10 order or Shopify checkout is created by that read

<!-- trace:scenario id=g10.store-checkout.SC-d04 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-04 - A failed read keeps held facts unchecked
**Serves:** grade10-site-store-checkout-US-02 - The collector retries a checkout whose live read failed

- **GIVEN** a collector is on checkout and the live shop read fails
- **WHEN** the checkout summary renders
- **THEN** the last held price and availability are not presented as current
- **AND** Pay is unavailable
- **AND** a retry is offered without creating an order

<!-- trace:scenario id=g10.store-checkout.SC-4av rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-39 - Pay reviews an existing invoice against current facts
**Serves:** `grade10-site-store-checkout-US-01`, `grade10-site-store-checkout-US-02` - Pay reviews an existing invoice against current facts

- **GIVEN** an open invoice exists and a shop line has changed since it was created
- **WHEN** the collector presses Pay for the same purchase
- **THEN** the server makes a fresh live decision and names the changed line
- **AND** the old payable URL is not handed off as the current basket
- **AND** no replacement order or invoice is created by the failed decision

<!-- trace:scenario id=g10.store-checkout.SC-xy2 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-49 - An empty reviewed basket cannot start hosted payment
**Serves:** `grade10-site-store-checkout-US-01` - An empty reviewed basket cannot start hosted payment

- **GIVEN** the current member cart contains no active lines
- **WHEN** the collector opens the drawer and its current read completes
- **THEN** the existing empty-cart surface is shown
- **AND** Pay does not create an empty order or hosted invoice

<!-- trace:scenario id=g10.store-checkout.SC-t83 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-50 - A failed tender write keeps the accepted choice
**Serves:** `grade10-site-store-checkout-US-01` - A failed tender write keeps the accepted choice

- **GIVEN** the drawer has accepted points of 10 and changing them to 20 fails
- **WHEN** the member waits for the current quote and presses Pay
- **THEN** failure feedback leaves the persisted accepted points at 10
- **AND** Pay uses the retained accepted tender rather than the failed requested choice

<!-- trace:scenario id=g10.store-checkout.SC-jmi rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-51 - A refused tender choice cannot disappear into an invoice
**Serves:** `grade10-site-store-checkout-US-02` - A refused tender choice cannot disappear into an invoice

- **GIVEN** a drawer shows accepted code or points and the current Pay decision refuses that tender
- **WHEN** the collector presses Pay then corrects the named choice
- **THEN** the refusal identifies the affected tender with no hosted handoff
- **AND** no invoice silently drops the refused tender
- **AND** a later deliberate Pay uses the persisted corrected choice and a current decision

<!-- trace:scenario id=g10.store-checkout.SC-zu1 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-52 - Withdrawn and sold-out lines keep their existing drawer treatment
**Serves:** `grade10-site-store-checkout-US-02` - Withdrawn and sold-out lines keep their existing drawer treatment

- **GIVEN** current cart validation identifies a withdrawn sales-channel line or a sold-out line
- **WHEN** the drawer completes its current review
- **THEN** the existing unavailable-item treatment removes the withdrawn line and shows its notice
- **AND** a sold-out line remains visible for the collector to remove
- **AND** an unresolved changed line does not authorize a stale hosted handoff

<!-- trace:scenario id=g10.store-checkout.SC-5tt rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-53 - Unfinished or contradictory current reads cannot authorize Pay
**Serves:** `grade10-site-store-checkout-US-02` - Unfinished or contradictory current reads cannot authorize Pay

- **GIVEN** the current line review or tender quote is pending, failed or contradictory
- **WHEN** the drawer renders its checkout control
- **THEN** held values do not represent a ready current decision
- **AND** Pay remains unavailable and sends no checkout creation request
- **AND** the existing review feedback and Retry treatment apply

<!-- trace:scenario id=g10.store-checkout.SC-14a rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-58 - Pay waits for acknowledged cart and tender writes
**Serves:** `grade10-site-store-checkout-US-01` - Pay waits for acknowledged cart and tender writes

- **GIVEN** the drawer shows a pending quantity or tender edit
- **WHEN** the member tries Pay before that write and its current quote finish
- **THEN** Pay is unavailable and no creation request uses earlier facts
- **AND** after the write is acknowledged and current review and quote are ready Pay becomes available for the persisted choices

### Requirement: A signed-in member receives one Shopify hosted checkout

The public storefront SHALL require a fresh signed-in member session before it
creates an order. The server SHALL own all money facts and SHALL hand Shopify a
reviewed basket without relying on client-supplied amounts.

**Storefront boundary** - A signed-out collector SHALL be asked to sign in and
no public storefront order or Shopify checkout SHALL be created. Typed-email
checkout MAY exist only on the development and staging operator test surface.

**Order write** - The server SHALL insert the Grade10 order and its lines in
one transaction, call Shopify outside that transaction, and record the
provider references before it returns a hosted URL.

**Shopify handoff** - A new checkout SHALL be a Shopify Draft Order carrying
the reviewed variant ids, quantities, paired member customer where available,
and accepted automatic discounts. Shopify's invoice page SHALL own address,
shipping, tax and payment. The storefront SHALL not receive or store an
embedded payment secret.

<!-- trace:scenario id=g10.store-checkout.SC-e05 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-05 - A member receives one hosted invoice
**Serves:** grade10-site-store-checkout-US-01 - The collector leaves Grade10 only after one local order is bound to Shopify

- **GIVEN** a signed-in member has a ready reviewed basket
- **WHEN** the member presses Pay
- **THEN** one Grade10 pending order and its lines are written
- **AND** one Shopify hosted invoice opens with the reviewed variants and quantities
- **AND** the member is not shown an embedded payment form

<!-- trace:scenario id=g10.store-checkout.SC-f06 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-06 - A signed-out buyer cannot start storefront checkout
**Serves:** grade10-site-store-checkout-US-04 - The public storefront requires a proved member identity

- **GIVEN** a collector has no signed-in session on the public checkout
- **WHEN** they try to continue to payment
- **THEN** the collector is asked to sign in
- **AND** no Grade10 order or Shopify checkout is created
- **AND** a typed email is not treated as proof for the public storefront

<!-- trace:scenario id=g10.store-checkout.SC-g07 rev=3 -->
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

<!-- trace:scenario id=g10.store-checkout.SC-rpf rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-54 - An expired session receives existing sign-in feedback
**Serves:** `grade10-site-store-checkout-US-04` - An expired session receives existing sign-in feedback

- **GIVEN** a member reviewed a ready cart but their session expires before Pay
- **WHEN** the payment request reaches the authentication gate
- **THEN** existing sign-in feedback replaces hosted handoff
- **AND** no public order or provider invoice is created
- **AND** the frontend releases its pending request treatment

<!-- trace:scenario id=g10.store-checkout.SC-i5j rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-55 - Typed email remains inside the existing operator gate
**Serves:** `grade10-site-store-checkout-US-04` - Typed email remains inside the existing operator gate

- **GIVEN** typed-email checkout is requested by a signed-out caller, an ordinary member, an authorized sandbox operator or an authorized production-context operator
- **WHEN** the existing operator gate evaluates the request
- **THEN** only the authorized development or staging operator may use the established typed-email adapter
- **AND** public and production-context requests refuse before purchase creation
- **AND** authorized sandbox checkout reviews the identified buyer through its existing procedure

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

**Concurrent Purchase** - Concurrent first requests for the same member cart/version and fingerprint SHALL converge on one order and payable invoice, including requests with different browser keys. A stale or mismatched cart/tender SHALL return conflict without unassociated creation. An unresolved provider-dispatched purchase SHALL block another purchase until the existing recovery path permits continuation.

**Retirement** - A line or tender edit SHALL record recoverable retirement work with its cart revision. Successful edits SHALL not imply cancellation; older orders SHALL be shown canceled only after authoritative provider-aware order state reports it.

<!-- trace:scenario id=g10.store-checkout.SC-i09 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-09 - A repeated Pay uses one checkout
**Serves:** `grade10-site-store-checkout-US-05` - The collector's repeated Pay action does not duplicate a purchase

- **GIVEN** a member's first Pay request for one unchanged intent is delayed
- **WHEN** the member submits Pay again
- **THEN** both requests identify one Grade10 order
- **AND** one Shopify invoice is payable
- **AND** the second request returns the existing invoice or its settling state

<!-- trace:scenario id=g10.store-checkout.SC-j10 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-10 - A lost response does not mint another invoice
**Serves:** `grade10-site-store-checkout-US-05` - The collector can retry a provider response loss safely

- **GIVEN** Shopify created an invoice but the response was lost after the Grade10 order was written
- **WHEN** the member retries the same intent
- **THEN** the existing order is recovered through its recorded reference or a provider read
- **AND** the retry returns the existing invoice or settling state
- **AND** no second Shopify invoice is created

<!-- trace:scenario id=g10.store-checkout.SC-s19 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-19 - A terminal intent is replayed without a new order
**Serves:** `grade10-site-store-checkout-US-05` - The collector's completed or closed intent cannot be paid twice

- **GIVEN** a member's intent already has a paid, refunded, failed, canceled or expired Grade10 order
- **WHEN** the member retries Pay with the same intent and unchanged fingerprint
- **THEN** the store returns the existing order's terminal outcome
- **AND** it creates no second Grade10 order or Shopify invoice
- **AND** a changed basket must use a new intent before another Pay

<!-- trace:scenario id=g10.store-checkout.SC-k11 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-11 - A changed tender starts a new intent
**Serves:** `grade10-site-store-checkout-US-06` - The collector can deliberately change the purchase after an earlier intent

- **GIVEN** a member has an open checkout intent
- **WHEN** the member changes the basket or tender choice and presses Pay
- **THEN** the changed request uses a new intent fingerprint
- **AND** the old open checkout is not returned as the changed purchase

<!-- trace:scenario id=g10.store-checkout.SC-t20 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-20 - A crash before dispatch can retry safely
**Serves:** `grade10-site-store-checkout-US-05` - The collector can recover when the worker stops before Shopify is called

- **GIVEN** the local order is claimed but its provider-dispatch state is still `ready`
- **WHEN** the worker stops before sending a Shopify request and reconciliation claims the order again
- **THEN** the next worker may dispatch the same intent once
- **AND** it does not create a second order or invoice

<!-- trace:scenario id=g10.store-checkout.SC-u21 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-21 - An ambiguous dispatch requires manual recovery
**Serves:** `grade10-site-store-checkout-US-05` - The collector is protected when Shopify's result cannot be identified

- **GIVEN** the provider-dispatch state is `dispatched` but no unique matching draft is found
- **WHEN** the recovery deadline passes
- **THEN** the order enters `manual_review` and the checkout returns a recovery-required result
- **AND** no replacement Shopify invoice is created
- **AND** the member cannot start a new purchase until an operator binds or cancels the provider draft

<!-- trace:scenario id=g10.store-checkout.SC-g88 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-40 - Concurrent first requests share one purchase
**Serves:** grade10-site-store-checkout-US-05 - Concurrent first requests share one purchase

- **GIVEN** two tabs submit different keys for the same member cart version and tender before provider references exist
- **WHEN** both requests reach the server together
- **THEN** they converge on one Grade10 order and canonical intent
- **AND** at most one Shopify invoice is created
- **AND** the second request receives the saved invoice or settling state

<!-- trace:scenario id=g10.store-checkout.SC-5ie rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-41 - Stale cart or tender cannot become an unrelated checkout
**Serves:** `grade10-site-store-checkout-US-06`, `grade10-site-store-checkout-US-05` - Stale cart or tender cannot become an unrelated checkout

- **GIVEN** another device changed the active cart version or tender after a tab's review
- **WHEN** the tab submits its earlier cart and purchase context
- **THEN** the server returns conflict without order or provider creation
- **AND** the drawer refreshes current cart/tender and requires deliberate Pay after review

<!-- trace:scenario id=g10.store-checkout.SC-o8s rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-42 - Cart edits record retirement without claiming cancellation
**Serves:** grade10-site-store-checkout-US-06 - Cart edits record retirement without claiming cancellation

- **GIVEN** an older unpaid invoice exists for the current cart
- **WHEN** the collector persists a line or tender change
- **THEN** the revision and recoverable retirement work commit together
- **AND** the edit succeeds without reporting provider cancellation as a fact
- **AND** order reads reflect cancellation only after provider-aware retirement succeeds

<!-- trace:scenario id=g10.store-checkout.SC-2jt rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-43 - Changed tender cannot reuse an older invoice
**Serves:** `grade10-site-store-checkout-US-06`, `grade10-site-store-checkout-US-02` - Changed tender cannot reuse an older invoice

- **GIVEN** an open invoice carries one accepted coupon/points choice
- **WHEN** the member persists a different tender and submits Pay
- **THEN** the changed purchase uses a new intent with current accepted tender
- **AND** the older invoice is retired or recovery blocks replacement according to provider facts
- **AND** the old invoice is never returned as the changed purchase

<!-- trace:scenario id=g10.store-checkout.SC-ln3 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-44 - Older clients share the safety boundary
**Serves:** Safe repetition and recovery - Older clients share the safety boundary

- **GIVEN** an older storefront bundle calls the legacy procedure for a member cart with an existing or ambiguous purchase
- **WHEN** its request is handled after the new safety engine is enabled
- **THEN** it reuses or reports the existing purchase through its decodable vocabulary
- **AND** it creates no second payable invoice
- **AND** a mismatched cart or tender refuses before dispatch

### Requirement: Shopify payment settles one Grade10 order

The store SHALL treat a Shopify hosted invoice as pending until Shopify reports
payment. A verified webhook SHALL accelerate the same guarded order transition;
the reconcile pass and the buyer's order read SHALL repair a missed event through
that transition rather than create another order.

**Settlement** - A paid invoice SHALL move its pending order to `paid` once and
retain the provider's paid total, goods, shipping, tax and order identity when
Shopify supplies them. Duplicate or cross-shop events SHALL not settle another
order.

**Visibility** - Your Orders SHALL show a newly placed pending order as
settling, poll while it can move, and show the paid order and its paid total
after settlement.

**Cart release** - The member cart SHALL remain while the collector is at
Shopify and SHALL release the paid lines only after the order is `paid`.
Release SHALL convert only the still-active cart id and version bought by the
order. An edited or rebuilt cart and its tender SHALL survive payment of an
older order. Unchanged conversion SHALL leave no active purchased lines or
tender; the next cart starts with default tender.

**Return** - A Shopify Thank You and Order status checkout UI extension SHALL
offer a static link to Grade10 Your Orders, where the matching purchase is
visible after the member returns. The extension SHALL not promise a
purchase-specific deep link. The native Continue shopping button and Shopify
account path SHALL not be the required return destination.

<!-- trace:scenario id=g10.store-checkout.SC-l12 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-12 - A pending order remains visible while payment settles
**Serves:** grade10-site-store-checkout-US-03 - The collector can see that a returned purchase is still settling

- **GIVEN** a member has returned from Shopify with a new pending order
- **WHEN** they open Your Orders before payment settlement
- **THEN** the order appears in the active orders section
- **AND** pending is shown as a settling state, not an empty result or an error
- **AND** the page polls while the order can still move

<!-- trace:scenario id=g10.store-checkout.SC-m13 rev=3 -->
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

<!-- trace:scenario id=g10.store-checkout.SC-o15 rev=3 -->
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

<!-- trace:scenario id=g10.store-checkout.SC-xu2 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-45 - A rebuilt cart survives older settlement
**Serves:** grade10-site-store-checkout-US-06 - A rebuilt cart survives older settlement

- **GIVEN** a paid or retired old purchase refers to cart c1 and the member has built active cart c2
- **WHEN** the older order's paid transition is observed again
- **THEN** cart c2 and its tender remain unchanged
- **AND** the frontend refreshes authoritative state without deleting matching variants
- **AND** the older order settles at most once

<!-- trace:scenario id=g10.store-checkout.SC-vor rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-59 - Return consumes existing order surfaces and owned access
**Serves:** grade10-site-store-checkout-US-03 - Return consumes existing order surfaces and owned access

- **GIVEN** a collector follows the static Shopify return link and matching order facts are loading, unavailable, empty or outside their member ownership
- **WHEN** Grade10 reads and renders its existing order history or detail surface
- **THEN** existing loading, error with Retry, empty with Shop now and returned-order-list treatments remain governed by the existing order surface
- **AND** a different member receives no details for the owned purchase through the existing authenticated detail boundary
- **AND** no matching purchase, order facts or settlement is invented by return recovery
- **AND** the owned purchase and its cart remain unchanged by the other member's detail request

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

<!-- trace:scenario id=g10.store-checkout.SC-cbs rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-56 - The carrier token gate has no purchase side effects
**Serves:** `grade10-site-store-checkout-US-01` - The carrier token gate has no purchase side effects

- **GIVEN** a served carrier destination is requested with a missing or wrong configured token
- **WHEN** the callback evaluates the request
- **THEN** no usable carrier rate is returned
- **AND** no order is created and the member cart remains unchanged

## ADDED Requirements

### Requirement: The frontend preserves submitted purchase context

The frontend SHALL preserve an opaque member/brand-scoped purchase identity across Pay, same-session reload and response loss. It SHALL use the server's canonical identity and lifecycle answer, retain existing verification/refusal feedback, and ignore navigation or state writes from an answer for an older member, cart version, tender or request generation. It SHALL not invent invoice authority, settle orders locally, delete cart lines locally or fall back to unsafe creation when the required protocol is unavailable.

<!-- trace:scenario id=g10.store-checkout.SC-dwk rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-33 - A later Pay resumes the existing purchase
**Serves:** grade10-site-store-checkout-US-05 - A later Pay resumes the existing purchase

- **GIVEN** an earlier Pay has an unpaid invoice for an unchanged cart/tender
- **WHEN** the collector presses Pay again, including after same-session reload
- **THEN** the persisted purchase context is used for a current server payment decision
- **AND** the existing invoice or lifecycle outcome is returned without another purchase

<!-- trace:scenario id=g10.store-checkout.SC-5x2 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-34 - A pending request blocks another frontend submission
**Serves:** grade10-site-store-checkout-US-05 - A pending request blocks another frontend submission

- **GIVEN** Pay has submitted an immutable context and its response is delayed
- **WHEN** the collector activates checkout again
- **THEN** the control and synchronous guard prevent another request from that surface
- **AND** server safety still protects independent tabs and retries

<!-- trace:scenario id=g10.store-checkout.SC-cc7 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-35 - Later edits preserve the submitted purchase and guard its response
**Serves:** `grade10-site-store-checkout-US-06`, `grade10-site-store-checkout-US-04` - Later edits preserve the submitted purchase and guard its response

- **GIVEN** Pay submitted cart/tender context and the response is delayed
- **WHEN** the member edits cart/tender or changes authenticated member
- **THEN** the earlier submitted order/invoice is not rewritten
- **AND** the stale response cannot redirect or overwrite newer cart/tender state
- **AND** a later Pay uses the persisted new context after current review

<!-- trace:scenario id=g10.store-checkout.SC-2n2 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-36 - Paid refresh preserves later choices
**Serves:** grade10-site-store-checkout-US-06 - Paid refresh preserves later choices

- **GIVEN** a member increases a line quantity or changes tender during hosted payment
- **WHEN** the older order becomes paid
- **THEN** backend cart-version guards preserve later lines and tender
- **AND** the frontend re-reads current cart/tender and makes no variant-based deletion

<!-- trace:scenario id=g10.store-checkout.SC-vsd rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-37 - Existing verification feedback keeps the account gate
**Serves:** grade10-site-store-checkout-US-01 - Existing verification feedback keeps the account gate

- **GIVEN** the gross-goods gate requires account verification
- **WHEN** Pay receives the verification outcome
- **THEN** existing threshold feedback and account action appear with no hosted handoff
- **AND** the action opens the existing account verification route
- **AND** promo or points cannot bypass the gross-goods gate

<!-- trace:scenario id=g10.store-checkout.SC-8hm rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-38 - Lost responses retain the recoverable purchase
**Serves:** `grade10-site-store-checkout-US-05`, `grade10-site-store-checkout-US-02` - Lost responses retain the recoverable purchase

- **GIVEN** the submitted purchase response is lost or cannot be decoded
- **WHEN** the frontend ends its pending request and offers existing failure feedback
- **THEN** it retains the same purchase identity for retry or known-order recovery
- **AND** retry cannot mint another invoice
- **AND** it claims neither cancellation nor proof that no invoice exists

<!-- trace:scenario id=g10.store-checkout.SC-0al rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-46 - Missing compatible protocol prevents unsafe fallback
**Serves:** grade10-site-store-checkout-US-05 - Missing compatible protocol prevents unsafe fallback

- **GIVEN** the backend lacks the required protocol or returns malformed context
- **WHEN** the collector attempts Pay
- **THEN** existing localized failure/support feedback is shown
- **AND** no fallback legacy creation request is sent

<!-- trace:scenario id=g10.store-checkout.SC-5sl rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-47 - Unchanged paid conversion refreshes an empty cart
**Serves:** grade10-site-store-checkout-US-03 - Unchanged paid conversion refreshes an empty cart

- **GIVEN** the active cart id/version and tender still match the paid purchase
- **WHEN** payment settles and the frontend refreshes cart/tender
- **THEN** the authoritative cart has no active purchased lines and default tender
- **AND** the frontend observes conversion without local cleanup

<!-- trace:scenario id=g10.store-checkout.SC-v95 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-48 - Recovery and terminal answers use existing order surfaces
**Serves:** grade10-site-store-checkout-US-05 - Recovery and terminal answers use existing order surfaces

- **GIVEN** the server returns settling, terminal or recovery-required with a known order
- **WHEN** the drawer resolves that outcome
- **THEN** the existing order surface shows authoritative facts and polls only while the purchase can move
- **AND** recovery-required prevents replacement until backend resolution
- **AND** existing shared labels remain and no new unpaid badge appears

<!-- trace:scenario id=g10.store-checkout.SC-ecp rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-57 - Gross goods preserve the existing verification boundary
**Serves:** `grade10-site-store-checkout-US-01` - Gross goods preserve the existing verification boundary

- **GIVEN** gross goods are below, at or above HKD 120,000, with a verified or unverified member and accepted discounts or points
- **WHEN** the storefront or direct Pay evaluates the account gate
- **THEN** an unverified member below the limit and a verified member at or above it may proceed with a ready reviewed basket
- **AND** an unverified member at or above the gross-goods limit receives existing verification feedback and account action without order or invoice creation
- **AND** discounts and points cannot move the gross-goods boundary

<!-- trace:scenario id=g10.store-checkout.SC-15p rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-60 - Later persisted edits leave the hosted purchase fixed
**Serves:** grade10-site-store-checkout-US-06 - Later persisted edits leave the hosted purchase fixed

- **GIVEN** a collector has opened an unpaid hosted invoice for submitted lines and tender
- **WHEN** a separate Grade10 tab persists later line and tender edits and reloads
- **THEN** the original invoice retains its submitted purchase facts
- **AND** current cart and tender reads restore the later persisted choices
