# grade10-site/store/checkout Specification

## Purpose

The signed-in collector sends the drawer's current basket and accepted tender
to the existing Shopify hosted checkout, then returns to the existing Grade10
order surface. The invoice fixes the purchase; backend behavior is unchanged.

## Feature set

- Frontend basket and tender
  - Review: use the drawer's current line review and accepted tender
  - Estimate: leave final shipping and tax to Shopify
  - Verification: use the existing account-verification feedback and action
- Frontend hosted Shopify handoff
  - Member checkout: use the existing authenticated creation procedure
  - Redirect: leave for the hosted URL returned by the backend
  - Refusal: show the existing named-line and failure outcomes
- Frontend payment attempts
  - Pending request: prevent another frontend submission while awaiting a response
  - Fresh submission: a later Pay uses creation again and ignores older invoices
  - Fixed purchase: later cart edits do not alter the invoice
- Frontend order settlement and return
  - Order state: read existing pending and paid outcomes
  - Cart refresh: reflect existing paid-transition cleanup
  - Return: link from Shopify confirmation to Grade10 Your Orders

## REMOVED Feature set

- Current basket and tender
- Hosted Shopify handoff
- Safe repetition and recovery
- Order settlement and return

## MODIFIED Requirements

### Requirement: Checkout reviews the current member basket before payment

Checkout SHALL use the drawer's continuous current line review and accepted
tender quote. The frontend SHALL keep Pay unavailable while review, cart or
tender writes, or its checkout request are pending, or while the current
review or quote is failed or contradictory. A failed tender edit MAY retain
the previous accepted choice and allow Pay once its current quote is ready.
The existing server validation at Pay remains unchanged.

**Review** - Current titles, quantities, prices and availability SHALL come
from the existing review. A changed line SHALL be named so the collector can
repair the basket. Held values SHALL not appear as verified current facts
after a failed read. No separate checkout page or extra frontend read before
Pay SHALL be required.

**Tender** - The drawer SHALL show the accepted promo and points choice with
the estimated subtotal in the store currency. Shipping and tax SHALL remain
Shopify's address-aware calculation. Pay SHALL send the reviewed lines and
accepted tender through existing checkout creation.

<!-- trace:scenario id=g10.store-checkout.SC-a01 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-01 - A member sees a current basket before Pay
**Serves:** grade10-site-store-checkout-US-01 - The collector reviews the basket before hosted payment

- **GIVEN** a signed-in collector has a member-cart line
- **WHEN** the drawer's live review becomes ready
- **THEN** the current title, quantity, price and availability are shown
- **AND** Pay becomes available when review and tender are ready

<!-- trace:scenario id=g10.store-checkout.SC-b02 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-02 - A tender choice is shown as an estimate
**Serves:** grade10-site-store-checkout-US-01 - The collector checks accepted tender before Shopify

- **GIVEN** the collector has an accepted promo and points choice
- **WHEN** the drawer displays the current quote
- **THEN** the accepted choices and estimated subtotal appear in the store currency
- **AND** shipping and tax are described as calculated at Shopify checkout
- **AND** Pay sends those accepted choices with the reviewed lines

<!-- trace:scenario id=g10.store-checkout.SC-c03 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-03 - A moved line blocks a stale payment
**Serves:** grade10-site-store-checkout-US-02 - The collector repairs a changed line

- **GIVEN** a cart line becomes sold out, repriced or reduced
- **WHEN** the existing review or checkout response names the changed line
- **THEN** the drawer shows the current answer and identifies the line
- **AND** a contradictory review prevents Pay until the basket is ready

<!-- trace:scenario id=g10.store-checkout.SC-d04 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-04 - A failed read keeps held facts unchecked
**Serves:** grade10-site-store-checkout-US-02 - The collector retries a failed review

- **GIVEN** the current review fails
- **WHEN** the drawer renders
- **THEN** held price and availability are not presented as current
- **AND** Pay is unavailable and the existing retry is offered

<!-- trace:scenario id=g10.store-checkout.SC-vsd rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-37 - Existing verification feedback keeps the account gate
**Serves:** grade10-site-store-checkout-US-01 - The collector verifies the account before payment

- **GIVEN** the existing gross-goods gate requires account verification
- **WHEN** checkout creation returns the verification outcome
- **THEN** the existing threshold message and account action are shown
- **AND** the checkout request ends without opening hosted payment
- **AND** the account action opens the existing account verification route
- **AND** reducing the estimate with promo or points does not bypass the gross-goods gate

## ADDED Requirements

### Requirement: Frontend hands the current basket to existing Shopify checkout

The public storefront frontend SHALL require a signed-in member and use the
existing authenticated creation flow. Each new Pay submission SHALL invoke
creation with the current reviewed basket and accepted tender. It MAY create
another invoice; earlier invoices SHALL be ignored by this integration.

**Handoff** - The frontend SHALL open the hosted URL returned by the existing
backend. Shopify owns address, shipping, tax and payment. The frontend SHALL
not introduce an embedded payment form, an intent key, invoice replay or old
invoice cancellation.

**Request** - The frontend SHALL prevent another submission while awaiting
the current response. After it resolves, a later Pay is a fresh creation
request. The invoice fixes the purchased lines and tender; subsequent cart
edits SHALL not alter that purchase.

**Outcomes** - The frontend SHALL present the existing named-line refusal,
verification, settling and failure responses. A transport failure SHALL not
be presented as proof that no invoice exists. Backend and operator permissions
remain unchanged; typed email SHALL not substitute for sign-in on this frontend.

<!-- trace:scenario id=g10.store-checkout.SC-e05 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-05 - A member receives one hosted invoice
**Serves:** grade10-site-store-checkout-US-01 - The collector leaves for the returned Shopify invoice

- **GIVEN** a signed-in member has a ready reviewed basket
- **WHEN** Pay receives a hosted URL from existing creation
- **THEN** the frontend opens that URL
- **AND** it shows no embedded payment form and keeps the member cart

<!-- trace:scenario id=g10.store-checkout.SC-f06 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-06 - A signed-out buyer cannot start storefront checkout
**Serves:** grade10-site-store-checkout-US-04 - The frontend asks the collector to sign in

- **GIVEN** the public storefront has no signed-in session
- **WHEN** the collector tries to start checkout
- **THEN** the existing sign-in action is shown
- **AND** this frontend sends no creation request or typed-email fallback

<!-- trace:scenario id=g10.store-checkout.SC-g07 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-07 - Shopify names a line refused at payment
**Serves:** grade10-site-store-checkout-US-02 - The collector repairs a refused line

- **GIVEN** existing checkout returns a named-line refusal
- **WHEN** the frontend handles it
- **THEN** the line is identified and the basket review is refreshed
- **AND** no paid outcome is invented
- **AND** a fresh submission is available after the basket is ready

<!-- trace:scenario id=g10.store-checkout.SC-dwk rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-33 - A later Pay creates a fresh invoice
**Serves:** grade10-site-store-checkout-US-01 - The collector starts another payment attempt

- **GIVEN** an earlier Pay resolved and its invoice remains unpaid
- **WHEN** the collector later presses Pay with a ready basket, including after reload
- **THEN** the frontend calls existing creation again with the current basket and tender
- **AND** it neither reuses nor cancels the earlier invoice
- **AND** it can open a different returned invoice without promising deduplication

<!-- trace:scenario id=g10.store-checkout.SC-5x2 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-34 - A pending request blocks another frontend submission
**Serves:** grade10-site-store-checkout-US-01 - The collector waits for the current response

- **GIVEN** Pay has submitted and the response is delayed
- **WHEN** the collector activates the checkout control again
- **THEN** the control remains unavailable and no second frontend request is sent
- **AND** the request's resolution restores the appropriate ready or outcome state

<!-- trace:scenario id=g10.store-checkout.SC-cc7 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-35 - Later edits leave the invoice purchase fixed
**Serves:** grade10-site-store-checkout-US-01 - The collector pays the invoice's purchase

- **GIVEN** creation accepted a reviewed basket and tender
- **WHEN** the collector edits the cart during hosted payment
- **THEN** this frontend does not update, reprice or reconcile the existing invoice
- **AND** a later Pay submits the then-current cart as a new purchase

<!-- trace:scenario id=g10.store-checkout.SC-8hm rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-38 - A lost response offers the existing failure treatment
**Serves:** grade10-site-store-checkout-US-02 - The collector can act after a request failure

- **GIVEN** the creation response is lost or cannot be decoded
- **WHEN** the request fails in the frontend
- **THEN** the existing failure feedback is shown and pending submission ends
- **AND** a ready-basket retry invokes creation again
- **AND** the frontend does not claim that the earlier invoice was recovered or never created

### Requirement: Frontend reflects existing payment outcomes

The frontend SHALL read existing order outcomes without changing webhook,
reconciliation, order-read or settlement behavior. It SHALL display a pending
order as settling, poll while the existing status can move, and display paid
facts supplied by the existing backend after payment.

**Cart** - The frontend SHALL keep cart data at redirect and merely returning
from Shopify. After observing a paid web order it SHALL refresh existing cart
and tender reads. Existing paid cleanup removes whole matching variant lines
and clears tender; changes made during payment receive no new reconciliation.

**Return** - The existing Shopify Thank You and Order status extensions SHALL
offer a static Grade10 Your Orders link. The existing order surface SHALL show
the matching purchase when returned by the backend. No purchase-specific link,
native Continue shopping action or Shopify account path is required.

<!-- trace:scenario id=g10.store-checkout.SC-l12 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-12 - A pending order remains visible while payment settles
**Serves:** grade10-site-store-checkout-US-03 - The collector finds a returned pending purchase

- **GIVEN** the existing order read returns a new pending purchase
- **WHEN** the collector opens Your Orders
- **THEN** the purchase appears as settling
- **AND** existing polling continues while the status can move
- **AND** merely returning does not clear the cart

<!-- trace:scenario id=g10.store-checkout.SC-m13 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-13 - A paid event settles once and releases the cart
**Serves:** grade10-site-store-checkout-US-03 - The collector sees the paid purchase and current cart

- **GIVEN** the existing order read reports a paid web order
- **WHEN** the frontend displays it
- **THEN** it shows the backend's paid total and refreshes cart and tender reads
- **AND** it reflects existing cleanup rather than deleting local lines itself

<!-- trace:scenario id=g10.store-checkout.SC-o15 rev=2 -->
#### Scenario: grade10-site-store-checkout-SC-15 - Confirmation returns to the Grade10 order
**Serves:** grade10-site-store-checkout-US-03 - The collector returns from Shopify confirmation

- **GIVEN** the collector is on Shopify Thank You or Order status
- **WHEN** they activate the Grade10 Your Orders link
- **THEN** the static Grade10 orders surface opens
- **AND** it shows the matching purchase when answered by the existing backend
- **AND** the link does not depend on Continue shopping or a Shopify account page

<!-- trace:scenario id=g10.store-checkout.SC-2n2 rev=1 -->
#### Scenario: grade10-site-store-checkout-SC-36 - Cart refresh reflects unchanged whole-line cleanup
**Serves:** grade10-site-store-checkout-US-03 - The collector sees existing cleanup after payment

- **GIVEN** the collector increased a matching variant's quantity and changed tender during hosted payment
- **WHEN** existing paid cleanup removes that whole matching line and clears tender
- **THEN** the frontend's refreshed cart shows that result
- **AND** it does not restore the added quantity or tender through new reconciliation

## REMOVED Requirements

### Requirement: A signed-in member receives one Shopify hosted checkout

**Reason** - The earlier requirement included backend transaction, provider
binding and backend permission changes beyond the owner's frontend-only scope.
The new frontend handoff requirement preserves useful collector scenarios and
their identifiers without requiring backend implementation.

**Migration** - Existing backend creation and permissions remain unchanged.
The public frontend calls authenticated creation and consumes its answer.
SC-08 is retired because provider persistence is not frontend delivery work.

### Requirement: Shopify payment settles one Grade10 order

**Reason** - The earlier requirement specified webhook, reconciliation and
event validation implementation. This amendment specifies frontend consumption
of existing order outcomes, cart refresh and confirmation return instead.

**Migration** - Existing settlement and cleanup continue unchanged. Retained
collector scenarios keep their identifiers under the frontend outcome
requirement. Backend-only SC-14 and SC-16 are retired without altering existing
backend behavior.

### Requirement: A checkout intent is safe to repeat

**Reason** - The owner narrowed delivery to frontend consumption of existing
creation. Intent persistence, replay, duplicate-invoice prevention, provider
response recovery and dispatch recovery are withdrawn.

**Migration** - Stop relying on intent reuse for checkout. Each later Pay calls
existing creation; an older invoice may remain payable. No database or API
migration is introduced and historical acceptance records remain intact.
Scenarios SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21 are retired with this
requirement. Their identifiers are not reused.

**Retired scenarios** - The removed requirements retire backend-only
SC-08, SC-14 and SC-16 without
changing their existing implementation. The previous draft's SC-22 through
SC-32 are withdrawn with the backend intent/recovery plan; current review,
verification and compatibility behavior is covered by the retained and new
frontend scenarios. These identifiers are not reused. SC-17 and SC-18 and the
durable carrier requirement are unchanged and are not delta work.
