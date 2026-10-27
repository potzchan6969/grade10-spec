# grade10-site/store/cart-drawer Specification

## Purpose

The Grade10 Store cart drawer lets a collector recognise the products in the current reviewed cart without leaving the page. It lets them review and edit that cart, then continue through an existing site address.

## Feature set

- Product pictures
  - Current catalogue: shows each retained line's first product picture from the existing live read
  - Correct line: joins picture facts only to the confirmed matching variant
  - Missing picture: preserves the placeholder, amounts and readiness
  - Restored cart: obtains pictures from review rather than persisted intent
  - Compatible responses: accepts legacy and enriched reviewed-line payloads
- Drawer entry
  - Current-surface overlay: opens one cart over the page the collector is on
  - Preserved place: closing returns the collector to the same site address
- Current cart review
  - Current cart: shows the signed-in member's cart, or the cart this browser
    holds for a signed-out collector
  - Fresh facts: starts the Store cart-validation read on every open
  - Unresolved read: never presents held price or availability as current
- Honest cart summary
  - Reviewed lines: shows only facts returned or confirmed by the live read
  - Quoted totals: the accepted basket quote owns tender credit and estimated total
- Member tender context
  - Held promo codes: shows the member's current codes answered against the reviewed lines
  - Points ceiling: shows the member's balance and the maximum points the reviewed goods can take
  - Interactive points: applies, maximises and removes points while preserving the existing code
  - Accepted choice: persists points for checkout and rejects stale or failed updates
  - Near-expiry promo detail: makes a live picker code's existing expiry detail noticeable without changing its discount title, wording, or choice behavior
- Cart changes
  - Scoped edits: quantity and removal change the same cart the drawer opened
  - Delisted cleanup: lets the shared drawer remove unavailable lines once
- Continuing onward
  - Product: uses the Store's product addresses
- Checkout from the drawer
  - Direct creation: Proceed to Checkout creates the checkout session from the reviewed basket and accepted tender
  - Hosted handoff: redirects to Shopify's hosted invoice once the session is created
  - Named refusal: a changed line or a provider refusal is named in the drawer, never on a separate page
- Pending operations
  - Drawer actions: wait together for current reads, writes and checkout creation
  - Recovery: resume available actions only after every operation ends
  - Dismissal: keep Close, backdrop click and Escape available while waiting
- Session end
  - Member signed out: an open drawer closes when the member it was open for is signed out, in another tab or by expiry
  - Silent close: the drawer closes with no message
  - Drawer kept: a guest's drawer, and a drawer open across a switch from one member to another, stay open

## Requirements

### Requirement: Reviewed product pictures follow the current cart

The drawer SHALL show each retained line's first current product picture,
matching the collection card's picture selection. The existing batched live
review SHALL supply it without a separate product request per line. The
application SHALL join picture facts by variant identity only for the current
cart lines confirmed by that review. Unmatched, removed or unreviewed lines
SHALL NOT receive another line's picture or stale picture facts.

Picture facts SHALL remain reviewed display data. Stored cart intent and
cart-write inputs SHALL contain no picture metadata. Restoring an image-free
member cart SHALL obtain its pictures through a fresh review. Missing pictures
SHALL leave the existing placeholder, quantities, status, money, badge count
and checkout readiness unchanged. Catalogue failure SHALL retain the existing
unresolved-read outcome and Checkout guard.

A picture resource that fails to load after a successful review SHALL NOT
change the accepted line facts, amounts or checkout readiness. The existing
browser image presentation remains in effect.

<!-- trace:scenario id=g10.store-cart-drawer.SC-0d6 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-34 - The first current product picture reaches its line
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** 2 retained cart lines whose products each have several current catalogue pictures
- **WHEN** the existing batched live review succeeds
- **THEN** each line shows its own product's first picture, with the catalogue URL and its query parameters preserved
- **AND** no separate product request is made for either line

<!-- trace:scenario id=g10.store-cart-drawer.SC-vq6 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-35 - Missing pictures preserve the cart's other facts
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a retained product with no catalogue pictures
- **WHEN** its live review succeeds
- **THEN** its existing picture placeholder is shown
- **AND** quantity, status, prices, subtotal, badge count and checkout readiness match the same review without picture enrichment

<!-- trace:scenario id=g10.store-cart-drawer.SC-toh rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-36 - Pictures join only to confirmed current lines
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a review whose lines arrive in a different order from the cart, with one removed variant and one current line the review did not confirm
- **WHEN** the drawer joins the review to the current cart
- **THEN** each confirmed retained line receives only the picture for its own variant identity
- **AND** the removed line is absent and the unreviewed line receives no picture from that review
- **AND** existing quantity and checkout-readiness guards remain in effect

<!-- trace:scenario id=g10.store-cart-drawer.SC-4fw rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-37 - Restoring cart intent obtains pictures through review
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a member cart restored from intent containing no picture metadata
- **WHEN** the collector reloads, opens the drawer and its fresh live review succeeds
- **THEN** current pictures appear on their matching lines

<!-- trace:scenario id=g10.store-cart-drawer.SC-gzj rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-42 - A sold-out line retains its product picture
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a sold-out retained line whose product has a current catalogue picture
- **WHEN** its live review succeeds
- **THEN** the line shows its own first product picture and existing sold-out treatment
- **AND** prices, quantity, status, count, totals and checkout readiness remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-3lt rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-43 - An unavailable variant supplies no picture facts
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a cart line whose variant is unavailable
- **WHEN** its live review completes
- **THEN** the reviewed line omits both picture fields
- **AND** the drawer follows the existing unavailable-line cleanup

<!-- trace:scenario id=g10.store-cart-drawer.SC-8ty rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-44 - Picture enrichment leaves intent free of picture metadata
**Serves:** Product pictures - retaining only cart intent when reviewing or editing a pictured line

- **GIVEN** an existing member cart or guest transport intent without picture metadata
- **WHEN** the cart is reviewed, its quantity is changed and its intent is saved
- **THEN** persistence and write inputs retain variant and quantity facts without picture URLs or alt text
- **AND** picture facts remain current reviewed display data only

<!-- trace:scenario id=g10.store-cart-drawer.SC-lbo rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-38 - A failed catalogue read keeps the existing unresolved outcome
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a drawer whose current catalogue read fails
- **WHEN** it renders that failure
- **THEN** it keeps the existing unresolved feedback, retry behavior and Checkout guard
- **AND** picture enrichment does not turn the failure into a successful review or an unavailable-product result

<!-- trace:scenario id=g10.store-cart-drawer.SC-h93 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-45 - A picture resource failure keeps accepted cart facts
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a successful live review for an available line with a supplied picture URL
- **WHEN** the picture resource fails to load in the browser
- **THEN** price, quantity, status, totals and checkout readiness remain accepted
- **AND** the cart review is not changed into a failure

### Requirement: Reviewed picture fields are optional and compatible

Reviewed lines SHALL accept these additive display fields. Existing guest and
member review transports, basket quote and checkout outcomes carrying reviewed
lines SHALL preserve their existing outcomes and amounts.

| Field | Type | Absence And Meaning |
| --- | --- | --- |
| imageSrc | Optional string | First current product picture URL; omitted when no picture or live variant exists |
| imageAlt | Optional string | Catalogue alt text when non-empty; omitted when absent, null or empty |

Legacy responses omitting both fields SHALL decode successfully. Enriched
responses SHALL decode successfully with both the current and previous
production response schemas; the previous schema need not retain the added
fields. Invalid supplied field types SHALL fail current decoding rather than
being silently treated as absent. The drawer SHALL pass supplied picture facts
to the existing shared picture contract, including its item-name alt fallback.

<!-- trace:scenario id=g10.store-cart-drawer.SC-ier rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-39 - Legacy and enriched responses remain compatible
**Serves:** Product pictures - carrying review responses across backend and frontend rollout

- **WHEN** guest or member review, basket quote or checkout reviewed-line responses are decoded with legacy fields alone or with valid picture fields added
- **THEN** both current and previous production response decoders accept them
- **AND** the current decoder retains supplied picture facts
- **AND** existing outcomes and amounts remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-2yu rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-40 - Invalid supplied picture fields fail decoding
**Serves:** Product pictures - refusing malformed reviewed display facts at the response boundary

- **WHEN** a response supplies a non-string image source or alt field, including null
- **THEN** the current production response decoder refuses the malformed response

<!-- trace:scenario id=g10.store-cart-drawer.SC-0wy rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-41 - Catalogue alt text reaches the shared fallback
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **WHEN** a reviewed product has a picture with supplied non-empty alt text, including whitespace-only text, or absent, null or empty catalogue alt text
- **THEN** the supplied non-empty text reaches the picture's alt attribute unchanged
- **AND** absent, null or empty catalogue alt text uses the line's current item name through the shared contract

### Requirement: The cart opens over the current site surface

A collector activating the Cart control SHALL open one cart drawer over the
current surface without changing the current address. When the drawer closes,
the collector SHALL remain at that address. A signed-out Cart press opens the
same drawer, as `grade10-site/site/page-shell` states.

<!-- trace:scenario id=g10.store-cart-drawer.SC-omn rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-01 - Cart opens without leaving its surface
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** a signed-in collector on any surface whose header offers Cart
- **WHEN** they activate Cart
- **THEN** one cart drawer opens over that surface
- **AND** the current address does not change

<!-- trace:scenario id=g10.store-cart-drawer.SC-za5 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-02 - Closing preserves the current address
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** an open cart drawer over any surface
- **WHEN** the drawer closes
- **THEN** the collector remains at the address beneath it

### Requirement: The drawer reviews the current cart

The drawer SHALL show the current member cart for a signed-in collector, and
the cart this browser holds for a signed-out one. Every drawer open SHALL start
the read defined by `grade10-site/store/cart-validation` for that cart.

While that read is pending, the drawer SHALL use the loading behavior defined
by `shared/ui/store-cart` and SHALL NOT present held price or availability as
confirmed. If the read fails, the drawer SHALL present the cart as
`grade10-site/store/cart-validation` requires for a read that cannot complete,
and SHALL tell the collector once during that open. A later open SHALL start
another read.

<!-- trace:scenario id=g10.store-cart-drawer.SC-a52 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-04 - A signed-in collector sees the member cart
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** a signed-in collector whose member cart holds a line
- **WHEN** they open the cart drawer
- **THEN** the drawer reviews that member cart
- **AND** it does not substitute a guest browser cart

<!-- trace:scenario id=g10.store-cart-drawer.SC-tv2 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-05 - Every open starts a current read
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** a cart drawer whose previous open completed
- **WHEN** the collector opens it again
- **THEN** the drawer starts a new status-and-price read for the current member cart

<!-- trace:scenario id=g10.store-cart-drawer.SC-ti9 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-06 - A read in flight remains unresolved
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** an opening cart drawer whose status-and-price read has not answered
- **WHEN** the drawer renders
- **THEN** held price and availability are not presented as confirmed
- **AND** Checkout is unavailable

<!-- trace:scenario id=g10.store-cart-drawer.SC-0og rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-07 - A failed read tells the collector once
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** an open cart drawer whose status-and-price read fails
- **WHEN** the unresolved drawer renders more than once during that open
- **THEN** the drawer tells the collector once that the cart could not be checked
- **AND** held price and availability remain unconfirmed
- **AND** Checkout remains unavailable

<!-- trace:scenario id=g10.store-cart-drawer.SC-lrr rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-08 - Reopening retries a failed read
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** a collector who closed the drawer after its read failed
- **WHEN** they open the drawer again
- **THEN** the drawer starts a new status-and-price read

### Requirement: The drawer presents only review-backed facts

After a successful read, the drawer SHALL present each retained line and its
summary from these facts:

| Part | Presented fact |
| --- | --- |
| Line | Current title, confirmed quantity, current unit price and currency, and current status |
| Previous price | The prior unit price and currency, only when the read reports a reprice |
| Subtotal | Current unit price multiplied by confirmed quantity for every line except sold-out and unavailable lines |
| Shipping | Localized `Calculated at checkout`, with no calculated amount |
| Estimated total | The accepted current basket quote; subtotal only when no tender is selected and no applied quote exists |
| Promo code | Visible in its closed display-only state; accepts and applies nothing |
| Points | Existing shared controls supplied from current member quote; accepted credit after applying points |

The drawer SHALL NOT claim a promotion, points credit, shipping amount, tax, or
other discount unless the existing combined basket quote supplies the accepted current amounts.

<!-- trace:scenario id=g10.store-cart-drawer.SC-8ln rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-09 - A successful read fills the reviewed summary
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** a cart with one available line and one sold-out line
- **WHEN** the drawer's status-and-price read succeeds
- **THEN** both retained lines show their current reviewed facts
- **AND** the subtotal includes the available line and excludes the sold-out line

<!-- trace:scenario id=g10.store-cart-drawer.SC-33u rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-10 - Unsupported adjustments remain neutral
**Serves:** g10.store-cart-drawer.US1 - Signed-in collector opens the current cart over the page

- **GIVEN** a successful cart read with no applied quote
- **WHEN** the drawer shows its summary
- **AND** shipping reads `Calculated at checkout`
- **AND** estimated total equals subtotal
- **AND** no promotion or points credit is applied

### Requirement: Drawer changes stay on the current cart

A quantity change or removal in the drawer SHALL update the same member cart
the drawer opened. After loading finishes, the drawer SHALL remove withdrawn
lines as `grade10-site/store/cart-validation` requires, through the removal
and single-notice behavior defined by `shared/ui/store-cart`.

<!-- trace:scenario id=g10.store-cart-drawer.SC-5bv rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-11 - A collector edits the opened cart
**Serves:** g10.store-cart-drawer.US2 - Signed-in collector edits the reviewed cart

- **GIVEN** an available line in an open reviewed cart
- **WHEN** the collector changes its quantity or removes it
- **THEN** the current member cart records that change

<!-- trace:scenario id=g10.store-cart-drawer.SC-7rs rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-12 - Delisted lines leave once
**Serves:** g10.store-cart-drawer.US2 - Signed-in collector edits the reviewed cart

- **GIVEN** a completed cart read with more than one unavailable line
- **WHEN** the drawer applies its post-loading cleanup
- **THEN** each unavailable line is removed once from the current member cart
- **AND** one cleanup notice is shown for that open

### Requirement: Drawer actions continue to a product address or create checkout directly

The drawer SHALL close before opening a product. A product line SHALL open
that product's existing address. Checkout SHALL NOT open a separate surface:
activating Checkout SHALL create the checkout session directly from the
reviewed basket and its accepted tender. The drawer SHALL remain open,
showing the redirecting state, until it hands the collector to the resulting
hosted invoice. `grade10-site/store/checkout`'s existing transactional
recheck at order-write time remains the read that gates this creation; the
drawer adds no re-read of its own before creating the session. When that
recheck or the shop refuses the checkout, the drawer reads the cart again as
`grade10-site/store/cart-validation` requires. When the store's read itself
cannot complete, the drawer SHALL follow `grade10-site/store/cart-validation`
for a read that cannot complete rather than restore Checkout.

<!-- trace:scenario id=g10.store-cart-drawer.SC-oqn rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-13 - A line opens its product
**Serves:** g10.store-cart-drawer.US3 - Signed-in collector continues from the cart drawer

- **GIVEN** an open reviewed cart with a retained line
- **WHEN** the collector activates that line
- **THEN** the drawer closes
- **AND** the line's existing Store product address opens

<!-- trace:scenario id=g10.store-cart-drawer.SC-xbm rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-15 - Checkout creates the session and hands off to the hosted invoice
**Serves:** g10.store-cart-drawer.US6 - a collector who presses Proceed to Checkout and reaches the hosted invoice

- **GIVEN** an open cart drawer whose status-and-price read is current and whose reviewed basket carries its accepted tender
- **WHEN** the collector activates Checkout and the checkout session is created
- **THEN** the drawer redirects to the resulting hosted invoice
- **AND** the drawer remains open on its redirecting state until that redirect succeeds
- **AND** no separate checkout surface opens

<!-- trace:scenario id=g10.store-cart-drawer.SC-5pn rev=2 -->
#### Scenario: grade10-site-store-cart-drawer-SC-28 - A changed line is named and no order is created
**Serves:** g10.store-cart-drawer.US6 - a collector whose checkout attempt is refused because a line changed

- **GIVEN** an open cart drawer whose reviewed basket contains a line the shop has since changed
- **WHEN** the collector activates Checkout and the checkout session is refused for that line
- **THEN** the drawer names the affected line
- **AND** no order is created
- **AND** Checkout is offered again once the cart holds only lines the read
  confirmed, as `grade10-site/store/cart-validation` requires

<!-- trace:scenario id=g10.store-cart-drawer.SC-t6r rev=2 -->
#### Scenario: grade10-site-store-cart-drawer-SC-29 - A provider refusal offers retry with no order created
**Serves:** g10.store-cart-drawer.US6 - a collector whose checkout attempt fails for a reason no line names

- **GIVEN** an open cart drawer whose Checkout action is creating a session,
  and whose store read for that checkout returned
- **WHEN** the checkout provider refuses or fails to create the session for a reason no line names
- **THEN** the drawer restores Checkout and shows a failed state naming that the attempt did not go through
- **AND** no order is created
- **AND** the collector may activate Checkout again

### Requirement: A signed-in collector sees current tender facts and chooses points

After a successful review for a signed-in collector, the drawer SHALL show held
promo-code answers for the reviewed lines. This points increment SHALL preserve
existing promo editing; it SHALL neither add nor remove promo actions.
It SHALL preserve any existing selected code when changing points.
Points controls SHALL use the current member balance, conversion rate and
server ceiling. Applying points SHALL use the combined basket quote and
persist the accepted choice before presenting it as applied. The drawer SHALL
NOT debit points or create checkout.

<!-- trace:scenario id=g10.store-cart-drawer.SC-bim rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-16 - Held promo codes answer the reviewed basket
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose cart review succeeds
- **AND** the member holds one applicable promo code and one inapplicable code
- **WHEN** the collector opens the promo-code view in the cart drawer
- **THEN** both current codes are shown
- **AND** the applicable code is shown as usable without being selected
- **AND** the inapplicable code shows the answer explaining why it cannot be used
- **AND** merely opening the held-code list does not apply a new code
- **AND** an existing selected code is preserved in the combined quote

<!-- trace:scenario id=g10.store-cart-drawer.SC-xhn rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-17 - Points offer the existing interactive design
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** a successful current member cart review and usable points quote
- **WHEN** the collector opens Use points
- **THEN** the shared input, pt suffix, Apply, balance, rate and Use max match the referenced Default story
- **AND** balance and ceiling come from the live quote rather than story fixtures

<!-- trace:scenario id=g10.store-cart-drawer.SC-44a rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-18 - Unresolved reviews receive no stale tender facts
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose cart review is pending or failed
- **WHEN** the cart drawer renders
- **THEN** member-only promo and points facts are not shown
- **AND** no member-only tender read is required to render the cart review state

<!-- trace:scenario id=g10.store-cart-drawer.SC-3yf rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-19 - Tender facts follow the latest reviewed basket
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose drawer has shown promo and points facts for a reviewed basket
- **WHEN** the cart changes or the drawer closes and opens again
- **THEN** the previous tender facts are not presented as current
- **AND** the drawer shows only the next successful reads for the latest reviewed basket

### Requirement: Points changes retain an accepted quote and choice

The drawer SHALL accept only finite positive whole-number Apply input.
An amount above the ceiling SHALL resolve to the server-accepted amount.
Use max SHALL apply the current quoted maximum; Remove SHALL clear only points.
The selected code SHALL remain unchanged by these actions. The accepted quote
SHALL own points credit and estimated total, and the accepted choice SHALL
persist with the member cart for reload and checkout. Selecting points SHALL
NOT mutate the loyalty ledger.

While a points quote or persistence operation is unresolved, the drawer SHALL
disable drawer actions under the pending-operations requirement below. A quote,
refusal or persistence failure SHALL show a localized error and keep the last
accepted choice and total for the same reviewed basket. Once the failed
operation resolves, Checkout MAY use that still-current accepted quote.
A changed basket SHALL
invalidate the previous displayed quote until revalidated. Results from an
older member, basket or closed drawer SHALL NOT update the current view or
initiate a stale choice write. A write already sent before closing remains a
member-scoped operation; reopening SHALL read the current persisted choice.
Checkout SHALL re-quote the persisted choice before submitting spendPoints.
A successful persistence followed by a failed refresh SHALL NOT be presented
as a rollback; stale totals and Checkout SHALL remain unavailable until an
authoritative reread resolves the accepted choice.

<!-- trace:scenario id=g10.store-cart-drawer.SC-k73 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-20 - Apply persists the accepted points choice
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** a reviewed member basket with an existing selected code
- **WHEN** the collector applies a valid whole-number amount and quote and persistence succeed
- **THEN** the accepted points choice is stored with the cart without replacing the code
- **AND** the Points credit and estimated total use the accepted server quote and no loyalty debit occurs

<!-- trace:scenario id=g10.store-cart-drawer.SC-tio rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-21 - Use max and Remove preserve the code
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** a current quote with a usable points ceiling and selected code
- **WHEN** the collector uses Use max, then Remove, with both operations succeeding
- **THEN** Use max applies the current quoted maximum and Remove persists zero points
- **AND** the selected code remains unchanged and each summary uses its accepted quote

<!-- trace:scenario id=g10.store-cart-drawer.SC-qit rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-22 - Invalid input and excessive input have distinct outcomes
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** current member points controls
- **WHEN** the collector submits blank, zero, negative, fractional, non-numeric or non-finite input, or an amount above the ceiling
- **THEN** invalid input does not persist or change the accepted total
- **AND** a valid whole-number request above the ceiling uses the server-accepted capped amount

<!-- trace:scenario id=g10.store-cart-drawer.SC-cui rev=2 -->
#### Scenario: grade10-site-store-cart-drawer-SC-23 - Pending changes prevent duplicate actions and checkout
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** a points change awaiting quote or persistence completion
- **WHEN** the collector tries a cart edit, another tender action, disclosure, product/account navigation or Checkout
- **THEN** no action callback, duplicate tender operation or navigation occurs
- **AND** the last accepted same-basket summary remains until the operation resolves

<!-- trace:scenario id=g10.store-cart-drawer.SC-puc rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-24 - Failures retain the accepted choice
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** a same-basket accepted choice and total
- **WHEN** the next points quote is refused or fails, or persistence fails
- **THEN** a localized error is shown and the prior accepted choice and total remain
- **AND** no rejected choice is presented as saved or applied

<!-- trace:scenario id=g10.store-cart-drawer.SC-pi9 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-25 - Changed context rejects stale results
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** an unresolved points read or change
- **WHEN** the member or basket changes, or the drawer closes before the response arrives
- **THEN** the old response does not change the current view or initiate a stale persistence write
- **AND** reopening or a cart quantity/removal change reads the current choice and revalidates the new basket before enabling Checkout

<!-- trace:scenario id=g10.store-cart-drawer.SC-34h rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-26 - Unavailable points remain unavailable
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** zero available points, a zero ceiling, a non-programme member, or an unanswered points quote
- **WHEN** the drawer renders
- **THEN** no positive points action is enabled without a usable quote
- **AND** no invented balance or saving is shown

<!-- trace:scenario id=g10.store-cart-drawer.SC-fwv rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-27 - Checkout receives the accepted choice
**Serves:** g10.store-cart-drawer.US5 - Collector chooses points before leaving the cart

- **GIVEN** a successfully persisted points choice with its existing code
- **WHEN** the collector reloads or activates Checkout
- **THEN** the choice is read from the member cart and the drawer's live quote re-quotes both points and code
- **AND** only accepted spendPoints and the existing code reach the checkout session the drawer creates

### Requirement: A signed-out drawer leads with guest checkout

A signed-out collector's drawer SHALL offer Check out as guest as its primary
action, with a quiet Sign in link under it for points and rewards, and no
extra step between them and Shopify's page. A guest SHALL see no points
controls and no member's codes or rewards. Signing in from the drawer SHALL
hand this browser's cart to the account and reopen the drawer on the same
page, where points and the wallet then show.

<!-- trace:scenario id=g10.store-cart-drawer.SC-1dq rev=1 -->
#### Scenario: g10.store-cart-drawer.SC55 - A signed-out drawer checks out as a guest
**Serves:** g10.store-cart-drawer.US15 - Signed-out collector finds guest checkout first

- **GIVEN** a signed-out collector with a reviewed browser cart
- **WHEN** the drawer opens
- **THEN** its primary action is Check out as guest, with a Sign in link under it
- **AND** no points controls or member codes show
- **AND** pressing Check out as guest sends a guest checkout for the reviewed lines

<!-- trace:scenario id=g10.store-cart-drawer.SC-ftc rev=1 -->
#### Scenario: g10.store-cart-drawer.SC56 - Signing in from the drawer keeps the cart
**Serves:** g10.store-cart-drawer.US11 - Collector signs in from the drawer and keeps the cart

- **GIVEN** a signed-out collector with lines in the browser cart
- **WHEN** they choose Sign in under the checkout action and complete sign-in
- **THEN** the browser's lines merge into their member cart
- **AND** the drawer reopens on the same page with points and their wallet codes

### Requirement: The promo picker lists public codes to everyone

The drawer's promo picker SHALL list the public codes the quote answers for
the reviewed basket. A guest SHALL see the public codes alone. A member SHALL
see them in one list with their own codes and rewards, the codes that fit
first and the soonest to expire first among them, across both kinds.

<!-- trace:scenario id=g10.store-cart-drawer.SC-f9m rev=1 -->
#### Scenario: g10.store-cart-drawer.SC57 - A guest picks a public code
**Serves:** g10.store-cart-drawer.US12 - Guest applies a public code

- **GIVEN** a signed-out collector and a live public code that fits the basket
- **WHEN** they open the promo picker
- **THEN** the public code is listed with no member section or loyalty call to action
- **AND** picking or typing it applies it to the quote

<!-- trace:scenario id=g10.store-cart-drawer.SC-7rc rev=1 -->
#### Scenario: g10.store-cart-drawer.SC58 - A member sees public codes beside their own
**Serves:** g10.store-cart-drawer.US13 - Member sees public codes beside their own

- **GIVEN** a member holding a wallet code and a live public code
- **WHEN** they open the promo picker
- **THEN** both are listed under one heading, those that fit first and the soonest to expire first

### Requirement: Pending drawer operations hold actions until work ends

The drawer SHALL disable quantity and removal, promo and points inputs and
non-dismissal disclosures, Apply, Use max, held-code selection, tender
removal, product and account/loyalty navigation and Checkout while any current
drawer operation is active. This includes current cart reads and writes,
price/stock review, saved tender and eligibility/points reads, tender quoting
and persistence, confirming reads and checkout creation. Unrelated page
requests SHALL NOT hold this guard.

Every active operation SHALL keep the guard until it succeeds, is refused or
fails. Completing one operation SHALL NOT release the guard while another is
active. A failed read or missing current facts alone SHALL NOT count as active
work. After all work ends, existing error, Retry, callback and current-data
guards SHALL decide which actions return. The drawer SHALL replay no action
automatically. An accepted choice retained after a failed change SHALL remain
usable only where the existing same-basket guard permits it.

Pointer and keyboard action attempts while pending SHALL start no cart/tender
write, read proposal or navigation. Accepted same-basket figures and entered
values SHALL remain under the existing skeleton and unchecked-fact treatments.
Pending SHALL NOT make held facts current. Scrolling and Close, backdrop and
Escape SHALL remain available, including existing nested-sheet dismissal.
Closing SHALL NOT cancel or roll back a sent operation. An older tender answer
SHALL NOT update a reopened drawer; the current member's outstanding work and fresh
reads SHALL continue to decide interaction availability there.

<!-- trace:scenario id=g10.store-cart-drawer.SC-tmf rev=1 -->
#### Scenario: g10.store-cart-drawer.SC34 - Current reads hold drawer actions
**Serves:** g10.store-cart-drawer.US7 - Collector waits for current cart and tender facts

- **GIVEN** an open member drawer reading cart, review, saved tender, promo eligibility, points or a current quote, including a background refresh with cached values
- **WHEN** the collector tries any non-dismissal drawer action by pointer or keyboard
- **THEN** its control is disabled and no action starts a write, tender proposal or navigation
- **AND** existing loaders or unchecked facts remain without presenting held facts as current

<!-- trace:scenario id=g10.store-cart-drawer.SC-8et rev=1 -->
#### Scenario: g10.store-cart-drawer.SC35 - Cart writes hold item and tender actions together
**Serves:** g10.store-cart-drawer.US7 - Collector waits for the saved quantity or removal

- **GIVEN** a quantity or removal write is active
- **WHEN** another item edit, tender input/action, disclosure, product/account link or Checkout is attempted, including a second activation in the same turn
- **THEN** no second user action is dispatched and all those controls remain disabled
- **AND** the guard continues through the current review and quote needed after the write

<!-- trace:scenario id=g10.store-cart-drawer.SC-7zb rev=1 -->
#### Scenario: g10.store-cart-drawer.SC36 - Tender work holds every drawer action
**Serves:** g10.store-cart-drawer.US7 - Collector waits through the accepted tender change

- **GIVEN** a points or promo change is quoting, persisting or confirming, with entered values and an accepted same-basket summary
- **WHEN** the collector tries another item, tender, disclosure, product/account or Checkout action, including inside an open promo sheet
- **THEN** no action callback starts another operation or navigation
- **AND** entered values and the accepted summary remain through each active step

<!-- trace:scenario id=g10.store-cart-drawer.SC-25v rev=1 -->
#### Scenario: g10.store-cart-drawer.SC37 - Checkout creation holds all drawer actions
**Serves:** g10.store-cart-drawer.US7 - Collector waits for the checkout answer

- **GIVEN** checkout creation is active for the reviewed basket and tender
- **WHEN** the collector tries an item, tender, disclosure, product/account or Checkout action
- **THEN** the action is disabled and no edit, proposal, navigation or second checkout request starts
- **AND** the existing checkout pending presentation remains with its submitted facts fixed

<!-- trace:scenario id=g10.store-cart-drawer.SC-d60 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC38 - Overlaps release only after the last operation
**Serves:** g10.store-cart-drawer.US8 - Collector resumes after every active answer ends

- **GIVEN** two current drawer operations are active
- **WHEN** one succeeds, is refused or fails while the other remains active
- **THEN** drawer actions stay disabled until the remaining operation ends
- **AND** permitted actions then return under the current data guards without replaying an earlier attempt
- **AND** an unrelated page request does not keep the drawer pending

<!-- trace:scenario id=g10.store-cart-drawer.SC-kqq rev=1 -->
#### Scenario: g10.store-cart-drawer.SC39 - Terminal failures leave recovery available
**Serves:** g10.store-cart-drawer.US8 - Collector chooses recovery after an operation fails

- **GIVEN** a cart/tender read or confirming read fails, or a tender write is refused or fails, with no other drawer operation active
- **WHEN** the failure is delivered
- **THEN** the failed operation is no longer pending and existing error and Retry remain available
- **AND** current-data guards withhold unsupported actions; same-basket accepted choice recovery is preserved where already permitted
- **AND** no read, write or checkout is replayed automatically

<!-- trace:scenario id=g10.store-cart-drawer.SC-p7g rev=1 -->
#### Scenario: g10.store-cart-drawer.SC40 - Dismissal does not cancel sent work
**Serves:** g10.store-cart-drawer.US9 - Collector returns to the page while the drawer waits

- **GIVEN** a drawer operation is active, with or without an open promo sheet
- **WHEN** the collector scrolls, uses Close, backdrop or Escape, and later reopens the drawer
- **THEN** scrolling and existing sheet-first dismissal work and the page address stays unchanged
- **AND** closing cancels no sent operation or accepted write, and an older tender answer changes no reopened view
- **AND** a same-member reopen waits for outstanding work and current reads before restoring permitted actions

### Requirement: An open drawer closes when its member's session ends

An open cart drawer SHALL close by itself, with no toast, notice or prompt to
sign in, when the member it was open for is signed out in another tab of this site
in this browser or their session expires. The drawer SHALL follow the session its tab
shows, as `shared/auth/session` states, and SHALL close only when that session
goes from a signed-in member to nobody. The drawer of a collector with no
session SHALL stay open, because there is no session to end. A session the tab
is still reading, or cannot read, SHALL NOT close the drawer, and neither SHALL a
switch the tab reads directly from one member to another, which leaves the
drawer open on the new member's cart. A tab that reads nobody between the two
members SHALL close the drawer, as it does for any sign-out.

When Proceed to Checkout meets an expired session, that session has ended like
any other, and the drawer SHALL close. A close for a session end SHALL take precedence over the
drawer staying open on its redirecting state until the hosted invoice, and
over the failed state that restores Checkout. What checkout then asks of the collector
is `grade10-site/store/checkout`'s. The drawer SHALL NOT reopen when the
collector signs in again without having opened the cart since.

<!-- trace:scenario id=g10.store-cart-drawer.SC-jq7 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC46 - Signing out in another tab closes the open drawer
**Serves:** g10.store-cart-drawer.US14 - the collector who signs out in one tab and comes back to another with the cart open

- **GIVEN** a signed-in member with the cart drawer open on a Store surface, and the site open in another tab of this browser
- **WHEN** the member signs out in the other tab
- **THEN** the drawer closes without the collector acting on this tab
- **AND** the header shows Sign In with no drawer open beside it

<!-- trace:scenario id=g10.store-cart-drawer.SC-7ep rev=1 -->
#### Scenario: g10.store-cart-drawer.SC47 - An expired session closes the open drawer
**Serves:** g10.store-cart-drawer.US14 - the collector who returns after the session ran out with the cart left open

- **GIVEN** a signed-in member whose cart drawer is open and whose tab was left unattended
- **WHEN** the session expires and the collector returns to the tab
- **THEN** the drawer closes without the collector pressing Close

<!-- trace:scenario id=g10.store-cart-drawer.SC-53j rev=1 -->
#### Scenario: g10.store-cart-drawer.SC48 - The close says nothing
**Serves:** g10.store-cart-drawer.US14 - the collector who finds the cart gone with nothing said about it

- **GIVEN** a signed-in member with the cart drawer open on a surface that needs no session
- **WHEN** the member's session ends and the drawer closes
- **THEN** no toast, notice or prompt to sign in appears because of it

<!-- trace:scenario id=g10.store-cart-drawer.SC-l85 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC49 - A drawer open for a collector with no session stays open
**Serves:** g10.store-cart-drawer.US14 - a collector who never had a session is not one whose session ended

- **GIVEN** a collector with no session who pressed Cart before the tab's first read of the session answered, so the drawer is open on the cart this browser holds
- **WHEN** that read answers that nobody is signed in
- **THEN** the drawer stays open
- **AND** it still shows the cart this browser holds

<!-- trace:scenario id=g10.store-cart-drawer.SC-dd4 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC50 - A session still being read leaves the drawer open
**Serves:** g10.store-cart-drawer.US14 - a member whose session is still good finds the cart as they left it

- **GIVEN** a signed-in member with the cart drawer open
- **WHEN** the tab reads the session again, and the read has not yet answered, and then answers that the same member is signed in
- **THEN** the drawer stays open at both moments

<!-- trace:scenario id=g10.store-cart-drawer.SC-fg7 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC51 - A switch to another member leaves the drawer open on their cart
**Serves:** g10.store-cart-drawer.US14 - a member who returns to a tab now signed in as somebody else

- **GIVEN** a signed-in member with the cart drawer open
- **WHEN** this tab's next reading of the session is a different member, with no reading of nobody between
- **THEN** the drawer stays open
- **AND** it shows the new member's cart and nothing of the first member's

<!-- trace:scenario id=g10.store-cart-drawer.SC-w1i rev=1 -->
#### Scenario: g10.store-cart-drawer.SC52 - Checkout meeting an expired session closes the drawer
**Serves:** g10.store-cart-drawer.US14 - a member whose session ran out while the cart was open and who presses Proceed to Checkout

- **GIVEN** a signed-in member with the cart drawer open on a reviewed cart, whose session has expired
- **WHEN** the member activates Proceed to Checkout and checkout answers that nobody is signed in
- **THEN** the drawer closes

<!-- trace:scenario id=g10.store-cart-drawer.SC-gey rev=1 -->
#### Scenario: g10.store-cart-drawer.SC53 - Signing in again does not reopen the drawer
**Serves:** g10.store-cart-drawer.US14 - a collector who signs in again after the cart closed

- **GIVEN** a drawer closed because its member's session ended, in another tab or at checkout
- **AND** the collector has not opened the cart since
- **WHEN** the collector signs in again
- **THEN** the drawer stays closed

<!-- trace:scenario id=g10.store-cart-drawer.SC-tpw rev=1 -->
#### Scenario: g10.store-cart-drawer.SC54 - A session read that fails leaves the drawer open
**Serves:** g10.store-cart-drawer.US14 - a member whose session is still good finds the cart as they left it

- **GIVEN** a signed-in member with the cart drawer open
- **WHEN** the tab cannot read the session, because the service cannot be reached or fails to answer
- **THEN** the drawer stays open

### Requirement: The cart picker emphasizes live near-expiry promo details

For every live held or public promo code that the cart picker displays, the
Grade10 consumer SHALL keep the existing discount in the title slot and the
existing expiry and conditions text in the detail slot. It SHALL derive the
ticket's consumer-owned `detailEmphasis` boolean from the live quote's existing
`expiresAt` value and the consumer clock: the value SHALL be true when the
code expires within the last 14 days, including exactly 14 days, and false
when the live code is more than 14 days from expiry or has no expiry.

The same rule SHALL apply to held and public codes and to a live code the
quote lists as unable to apply. Existing muted refusal treatment, refusal
reason, Apply availability, selection behavior and list ordering SHALL remain
unchanged. The consumer SHALL NOT change the title, detail text, code,
translation key or date format, and SHALL NOT replace either existing ticket
slot with expiry text.

For an applicable code, the title SHALL continue to carry the discount and
the `detailLabel` supplied to the shared ticket SHALL carry the existing
expiry/conditions detail, such as the existing `Use by` string; the mapper
SHALL NOT put a repeated discount-worth value in that detail slot. This is a
slot-assignment correction using existing copy, not a new or changed message.

<!-- trace:scenario id=g10.store-cart-drawer.SC-dsp rev=1 -->
#### Scenario: g10.store-cart-drawer.SC59 - A near-expiry held promo keeps its ticket slots
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector with a reviewed basket and a live held promo whose quote expiry is exactly 14 days from the current consumer clock
- **WHEN** the collector opens the cart promo picker
- **THEN** the ticket title continues to show the discount
- **AND** the existing expiry and conditions text remains in the detail slot with the near-expiry emphasis
- **AND** the code, Apply control and picker ordering remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-x5k rev=1 -->
#### Scenario: g10.store-cart-drawer.SC60 - Distant and undated promos stay plain
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector with a reviewed basket, one live held promo expiring more than 14 days from the current consumer clock and one live held promo with no quote expiry
- **WHEN** the collector opens the cart promo picker
- **THEN** both tickets keep their discount titles and existing expiry or conditions details in their original slots
- **AND** neither detail slot receives the near-expiry emphasis
- **AND** codes, Apply controls and list ordering remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-h3r rev=1 -->
#### Scenario: g10.store-cart-drawer.SC61 - A guest sees emphasis on a public promo detail
**Serves:** g10.store-cart-drawer.US12 - Guest applies a public code

- **GIVEN** a signed-out collector with a reviewed browser cart and a live public promo expiring within the last 14 days
- **WHEN** the collector opens the cart promo picker
- **THEN** the public code remains in the existing guest list with its discount title and expiry or conditions detail in separate slots
- **AND** the existing detail slot uses the near-expiry emphasis without new wording
- **AND** the guest can use the existing Apply behavior

<!-- trace:scenario id=g10.store-cart-drawer.SC-y5o rev=1 -->
#### Scenario: g10.store-cart-drawer.SC62 - A member keeps public promo emphasis in the merged list
**Serves:** g10.store-cart-drawer.US13 - Member sees public codes beside their own

- **GIVEN** a signed-in collector with one live held promo and one live public promo, both expiring within the last 14 days
- **WHEN** the collector opens the merged cart promo picker
- **THEN** both codes remain under the existing picker heading in the existing order
- **AND** each ticket keeps its discount title and expiry or conditions detail in separate slots with the near-expiry emphasis on the detail slot
- **AND** both existing Apply controls remain available

<!-- trace:scenario id=g10.store-cart-drawer.SC-0pz rev=1 -->
#### Scenario: g10.store-cart-drawer.SC63 - An inapplicable near-expiry held promo stays muted
**Serves:** g10.store-cart-drawer.US4 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector with a reviewed basket and a live held promo expiring within the last 14 days that the quote marks unable to apply
- **WHEN** the collector opens the cart promo picker
- **THEN** the ticket remains in the existing inapplicable section with its muted treatment, refusal reason and no Apply control
- **AND** its discount title and expiry or conditions detail remain in separate slots, with only the detail slot emphasized
- **AND** the code and list ordering remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-cke rev=1 -->
#### Scenario: g10.store-cart-drawer.SC64 - A public near-expiry refusal stays muted
**Serves:** g10.store-cart-drawer.US12 - Guest applies a public code

- **GIVEN** a signed-out collector with a reviewed browser cart and a live public promo expiring within the last 14 days that the quote marks unable to apply
- **WHEN** the collector opens the cart promo picker
- **THEN** the public code remains in the existing guest list with its muted treatment, refusal reason and no Apply control
- **AND** its discount title and existing expiry or conditions detail remain in separate slots, with only the detail slot emphasized
- **AND** the code and list ordering remain unchanged
