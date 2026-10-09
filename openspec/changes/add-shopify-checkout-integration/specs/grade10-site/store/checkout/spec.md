# grade10-site/store/checkout Specification

## Feature set

- Current basket and tender
  - Live review: review on open; the checkout request makes the Pay decision
  - Accepted tender: wait for coupon and points writes before Pay
  - Estimate: leave shipping, tax and final payment to Shopify
- Hosted Shopify handoff
  - Member identity: require a fresh signed-in storefront session
  - Hosted invoice: bind order and provider facts before the buyer leaves
  - Current request: send reviewed lines, seen prices and accepted tender
  - Safe response: keep refusal and verification feedback; open only the current answer
- Safe repetition and recovery
  - Purchase intent: one open checkout for repeated Pay, reload and terminal replay
  - Recovery: provider and store recovery without a second payable invoice
  - Changed intent: a changed basket or tender retires the older open checkout
  - One Pay at a time: one pending Pay per drawer
  - Stale answers: an answer for an older cart, tender or member opens nothing
  - Lost answers: existing failure feedback, no automatic retry
- Order settlement and return
  - Order state: poll pending purchases and read authoritative settlement
  - Cart refresh: read the cart and tender again once an order is paid
  - Return: use the static Shopify confirmation link to Your Orders
- Carrier rates
  - Stateless callback: preserve token gating and served destinations
  - Preview parity: the same rate and currency without cart or order writes

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
Release SHALL convert only the still-active cart id whose member-edit counter matches the purchase.
Shop review changes alone SHALL not prevent conversion. A cart with later member line or tender edits, or a rebuilt cart and its tender, SHALL survive payment of an
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

<!-- trace:scenario id=g10.store-checkout.SC-p16 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-16 - An invalid payment event does not settle an order
**Serves:** grade10-site-store-checkout-US-03 - The collector's purchase is not settled by an event the store cannot bind to this shop and order

- **GIVEN** a payment event has an unknown provider reference, wrong shop or invalid signature
- **WHEN** the store receives the event
- **THEN** no Grade10 order moves to `paid`
- **AND** the event is recorded for diagnosis without creating a replacement order

<!-- trace:scenario id=g10.store-checkout.SC-xu2 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-45 - A rebuilt cart survives older settlement
**Serves:** grade10-site-store-checkout-US-06 - A rebuilt cart survives older settlement

- **GIVEN** an older purchase was made from cart c1 and the member has since built active cart c2
- **WHEN** the older order's paid transition is observed again
- **THEN** cart c2 and its tender remain unchanged
- **AND** the frontend reads the cart and tender again without deleting matching variants
- **AND** the older order settles at most once

<!-- trace:scenario id=g10.store-checkout.SC-jab rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-62 - Shop review changes do not retain a paid basket
**Serves:** grade10-site-store-checkout-US-03 - The collector sees the bought cart clear after a shop review

- **GIVEN** the member has not edited the bought cart or tender after Pay, and the shop's stock or price review changed one of its lines
- **WHEN** the purchase settles and the cart and tender are read again
- **THEN** the same cart is converted and shows no bought lines and default tender
- **AND** a later member quantity or tender edit keeps that cart instead
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

### Requirement: The cart drawer starts one current Pay at a time

The cart drawer SHALL send Pay through the store's existing checkout request and act only on the answer to the current request. The store's checkout request decides the purchase; the drawer holds no purchase identity of its own.

**Request** - Pay SHALL wait for acknowledged cart and tender writes and for the current review and quote. It SHALL send each reviewed line with the unit price the collector saw, and the accepted store code or wallet coupon. It SHALL send the accepted points when they are more than 0, and no points field when none are spent.

**Pay** - Pay is the drawer's Proceed to Checkout control.

**One Pay at a time** - The drawer SHALL hold at most one pending Pay. The lines and tender it sent SHALL stay fixed for that request; a later edit applies to the next Pay.

**Answers** - The drawer SHALL use the existing treatment for each answer: a hosted invoice opens Shopify, a settling order opens Your Orders, a named line or refused tender is named in the drawer, verification shows the threshold feedback, with the account action where the profile page is enabled, and anything else shows the existing failure feedback.

**Older answers** - An answer for an older cart, tender, member or request SHALL open nothing, navigate nowhere and change no drawer state. The drawer SHALL keep the current cart and tender.

**Lost answer** - When the answer is lost or cannot be read, the drawer SHALL end the pending Pay, show the existing failure feedback and send no request by itself. It SHALL claim neither that no invoice exists nor that one was canceled. A later Pay SHALL be a new request that the store decides.

**Paid refresh** - Once an order read reports `paid`, the frontend SHALL read the cart and tender again. It SHALL settle no order and delete no cart line itself.

<!-- trace:scenario id=g10.store-checkout.SC-uzw rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-63 - Pay sends the reviewed lines and only the chosen tender
**Serves:** grade10-site-store-checkout-US-01 - The collector sends the reviewed lines and accepted tender to hosted payment

- **GIVEN** a ready reviewed basket with an accepted store code and either no points or 20 accepted points
- **WHEN** the collector presses Pay
- **THEN** the checkout request carries each reviewed line with the unit price the collector saw and the accepted code
- **AND** it carries 20 points when 20 are accepted, and no points field when none are spent

<!-- trace:scenario id=g10.store-checkout.SC-14a rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-58 - Pay waits for acknowledged cart and tender writes
**Serves:** `grade10-site-store-checkout-US-01` - Pay waits for acknowledged cart and tender writes

- **GIVEN** the drawer shows a pending quantity or tender edit
- **WHEN** the member tries Pay before that write and its current quote finish
- **THEN** Pay is unavailable and no creation request uses earlier facts
- **AND** after the write is acknowledged and current review and quote are ready Pay becomes available for the persisted choices

<!-- trace:scenario id=g10.store-checkout.SC-5x2 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-34 - A pending Pay blocks another submission from the drawer
**Serves:** grade10-site-store-checkout-US-05 - A pending Pay blocks another submission from the drawer

- **GIVEN** Pay has been sent and its answer is delayed
- **WHEN** the collector activates Pay again
- **THEN** the drawer sends no second checkout request
- **AND** Pay keeps its pending treatment until the answer arrives or fails

<!-- trace:scenario id=g10.store-checkout.SC-cc7 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-35 - An older answer cannot redirect later edits
**Serves:** `grade10-site-store-checkout-US-06`, `grade10-site-store-checkout-US-04` - An older answer cannot redirect later edits

- **GIVEN** Pay has been sent and its answer is delayed
- **WHEN** the collector edits the cart or tender, or the signed-in member changes, before the answer arrives
- **THEN** the delayed answer opens no Shopify page, navigates nowhere and changes no drawer state
- **AND** the drawer keeps the current cart and tender
- **AND** a later Pay sends the current reviewed lines and tender as a new request

<!-- trace:scenario id=g10.store-checkout.SC-8hm rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-38 - A lost answer ends the pending Pay without a retry
**Serves:** grade10-site-store-checkout-US-05 - A lost answer ends the pending Pay without a retry

- **GIVEN** Pay has been sent
- **WHEN** its answer is lost or cannot be read
- **THEN** the drawer ends the pending Pay and shows the existing failure feedback
- **AND** it sends no further checkout request by itself
- **AND** it says neither that no invoice exists nor that one was canceled
- **AND** a later Pay is a new request that the store decides

<!-- trace:scenario id=g10.store-checkout.SC-cbb rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-64 - A settling answer opens Your Orders
**Serves:** grade10-site-store-checkout-US-05 - The collector whose Pay answers with a settling order goes to Your Orders, not Shopify

- **GIVEN** Pay has been sent for the current cart and tender
- **WHEN** its answer is a settling order with no hosted invoice
- **THEN** the drawer opens Your Orders and no Shopify page
- **AND** Your Orders shows the matching order with its existing status label
- **AND** Your Orders reads the order again while it can still move

<!-- trace:scenario id=g10.store-checkout.SC-f6v rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-65 - A failed answer ends the pending Pay for a deliberate retry
**Serves:** `grade10-site-store-checkout-US-02` - The collector retries a Pay whose answer failed

- **GIVEN** Pay has been sent for a ready reviewed basket
- **WHEN** its answer is a failure other than a named line, a refused tender or verification
- **THEN** the drawer shows the existing failure feedback and opens no Shopify page
- **AND** the pending Pay ends and the drawer sends no further checkout request by itself
- **AND** Pay is available again once the basket is ready, and a later Pay is a new request

<!-- trace:scenario id=g10.store-checkout.SC-vsd rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-37 - Existing verification feedback keeps the account gate
**Serves:** grade10-site-store-checkout-US-01 - Existing verification feedback keeps the account gate

- **GIVEN** the gross-goods gate requires account verification
- **WHEN** Pay receives the verification outcome
- **THEN** existing threshold feedback appears with no hosted handoff
- **AND** where the profile page is enabled, an account action opens the existing account verification route
- **AND** promo or points cannot bypass the gross-goods gate

<!-- trace:scenario id=g10.store-checkout.SC-ecp rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-57 - Gross goods preserve the existing verification boundary
**Serves:** `grade10-site-store-checkout-US-01` - Gross goods preserve the existing verification boundary

- **GIVEN** gross goods are below, at or above HKD 120,000, with a verified or unverified member and accepted discounts or points
- **WHEN** the storefront or direct Pay evaluates the account gate
- **THEN** an unverified member below the limit and a verified member at or above it may proceed with a ready reviewed basket
- **AND** an unverified member at or above the gross-goods limit receives existing verification feedback, with the account action where the profile page is enabled, without order or invoice creation
- **AND** discounts and points cannot move the gross-goods boundary

<!-- trace:scenario id=g10.store-checkout.SC-2n2 rev=3 -->
#### Scenario: grade10-site-store-checkout-SC-36 - Paid refresh preserves later choices
**Serves:** grade10-site-store-checkout-US-06 - Paid refresh preserves later choices

- **GIVEN** a member increases a line quantity or changes tender during hosted payment
- **WHEN** the older order becomes paid
- **THEN** the backend's member-edit guard preserves later lines and tender
- **AND** the frontend re-reads current cart/tender and makes no variant-based deletion

<!-- trace:scenario id=g10.store-checkout.SC-5sl rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-47 - Unchanged paid conversion refreshes an empty cart
**Serves:** grade10-site-store-checkout-US-03 - Unchanged paid conversion refreshes an empty cart

- **GIVEN** the active cart id and member-edit counter still match the paid purchase
- **WHEN** payment settles and the frontend refreshes cart/tender
- **THEN** the authoritative cart has no active purchased lines and default tender
- **AND** the frontend observes conversion without local cleanup

<!-- trace:scenario id=g10.store-checkout.SC-15p rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-60 - Later cart edits never rewrite the sent invoice
**Serves:** grade10-site-store-checkout-US-06 - Later cart edits never rewrite the sent invoice

- **GIVEN** a collector has opened an unpaid hosted invoice for the lines and tender they sent
- **WHEN** a separate Grade10 tab saves later line and tender edits and reloads
- **THEN** the hosted invoice is never changed to the later lines or tender
- **AND** the cart and tender reads show the later saved choices
- **AND** whether that invoice stays payable is the store's answer, not the drawer's
