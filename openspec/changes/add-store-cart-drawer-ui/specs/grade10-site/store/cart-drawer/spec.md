## Purpose

The Grade10 Store cart drawer lets a collector review and edit the current cart
without leaving the page they are on, then continue through an existing site
address.

## Feature set

- Drawer entry
  - Current-surface overlay: opens one cart over the page the collector is on
  - Preserved place: closing returns the collector to the same site address
- Current cart review
  - Member cart: shows the signed-in member cart belonging to the current session
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
- Cart changes
  - Scoped edits: quantity and removal change the same cart the drawer opened
  - Delisted cleanup: lets the shared drawer remove unavailable lines once
- Continuing onward
  - Product: uses the Store's product addresses
- Checkout from the drawer
  - Direct creation: Proceed to Checkout creates the checkout session from the reviewed basket and accepted tender
  - Verification gate: blocks Proceed to Checkout for an unverified member whose basket meets the bar, linking to the account page
  - Hosted handoff: redirects to Shopify's hosted invoice once the session is created
  - Named refusal: a changed line or a provider refusal is named in the drawer, never on a separate page

## ADDED Requirements

### Requirement: The signed-in member cart opens over the current site surface

After Cart access is granted, a signed-in collector activating the Cart control
SHALL open one cart drawer over the current surface without changing the current
address. When the drawer closes, the collector SHALL remain at that address.
A signed-out Cart press follows `require-sign-in-from-nav-cart` and does not
open a guest drawer.

<!-- trace:scenario id=g10.store-cart-drawer.SC-omn rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-01 - Cart opens without leaving its surface
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** a signed-in collector on any surface whose header offers Cart
- **WHEN** they activate Cart
- **THEN** one cart drawer opens over that surface
- **AND** the current address does not change

<!-- trace:scenario id=g10.store-cart-drawer.SC-za5 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-02 - Closing preserves the current address
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** an open cart drawer over any surface
- **WHEN** the drawer closes
- **THEN** the collector remains at the address beneath it

### Requirement: The drawer reviews the current member cart

The drawer SHALL show the current member cart for a signed-in collector. A
signed-out Cart press SHALL be handled by `require-sign-in-from-nav-cart` before
this drawer opens; a signed-out session holds no cart lines. Every drawer open
SHALL start the read defined by `grade10-site/store/cart-validation` for the
member cart.

While that read is pending, the drawer SHALL use the loading behavior defined
by `shared/ui/store-cart` and SHALL NOT present held price or availability as
confirmed. If the read fails, the drawer SHALL present the cart as
`grade10-site/store/cart-validation` requires for a read that cannot complete,
and SHALL tell the collector once during that open. A later open SHALL start
another read.

<!-- trace:scenario id=g10.store-cart-drawer.SC-a52 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-04 - A signed-in collector sees the member cart
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** a signed-in collector whose member cart holds a line
- **WHEN** they open the cart drawer
- **THEN** the drawer reviews that member cart
- **AND** it does not substitute a guest browser cart

<!-- trace:scenario id=g10.store-cart-drawer.SC-tv2 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-05 - Every open starts a current read
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** a cart drawer whose previous open completed
- **WHEN** the collector opens it again
- **THEN** the drawer starts a new status-and-price read for the current member cart

<!-- trace:scenario id=g10.store-cart-drawer.SC-ti9 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-06 - A read in flight remains unresolved
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** an opening cart drawer whose status-and-price read has not answered
- **WHEN** the drawer renders
- **THEN** held price and availability are not presented as confirmed
- **AND** Checkout is unavailable

<!-- trace:scenario id=g10.store-cart-drawer.SC-0og rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-07 - A failed read tells the collector once
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** an open cart drawer whose status-and-price read fails
- **WHEN** the unresolved drawer renders more than once during that open
- **THEN** the drawer tells the collector once that the cart could not be checked
- **AND** held price and availability remain unconfirmed
- **AND** Checkout remains unavailable

<!-- trace:scenario id=g10.store-cart-drawer.SC-lrr rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-08 - Reopening retries a failed read
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

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
| Image | Absent while the reviewed cart supplies no authoritative image |
| Promo code | Visible in its closed display-only state; accepts and applies nothing |
| Points | Existing shared controls supplied from current member quote; accepted credit after applying points |

The drawer SHALL NOT claim a promotion, points credit, shipping amount, tax, or
other discount unless the existing combined basket quote supplies the accepted current amounts.

<!-- trace:scenario id=g10.store-cart-drawer.SC-8ln rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-09 - A successful read fills the reviewed summary
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** a cart with one available line and one sold-out line
- **WHEN** the drawer's status-and-price read succeeds
- **THEN** both retained lines show their current reviewed facts
- **AND** the subtotal includes the available line and excludes the sold-out line

<!-- trace:scenario id=g10.store-cart-drawer.SC-33u rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-10 - Unsupported adjustments remain neutral
**Serves:** grade10-site-store-cart-drawer-US-01 - Signed-in collector opens the current cart over the page

- **GIVEN** a successful cart read with no image or applied quote
- **WHEN** the drawer shows its summary
- **THEN** no product image is shown
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
**Serves:** grade10-site-store-cart-drawer-US-02 - Signed-in collector edits the reviewed cart

- **GIVEN** an available line in an open reviewed cart
- **WHEN** the collector changes its quantity or removes it
- **THEN** the current member cart records that change

<!-- trace:scenario id=g10.store-cart-drawer.SC-7rs rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-12 - Delisted lines leave once
**Serves:** grade10-site-store-cart-drawer-US-02 - Signed-in collector edits the reviewed cart

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
`grade10-site/store/cart-validation` requires.

<!-- trace:scenario id=g10.store-cart-drawer.SC-oqn rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-13 - A line opens its product
**Serves:** grade10-site-store-cart-drawer-US-03 - Signed-in collector continues from the cart drawer

- **GIVEN** an open reviewed cart with a retained line
- **WHEN** the collector activates that line
- **THEN** the drawer closes
- **AND** the line's existing Store product address opens

<!-- trace:scenario id=g10.store-cart-drawer.SC-xbm rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-15 - Checkout creates the session and hands off to the hosted invoice
**Serves:** grade10-site-store-cart-drawer-US-06 - a collector who presses Proceed to Checkout and reaches the hosted invoice

- **GIVEN** an open cart drawer whose status-and-price read is current and whose reviewed basket carries its accepted tender
- **WHEN** the collector activates Checkout and the checkout session is created
- **THEN** the drawer redirects to the resulting hosted invoice
- **AND** the drawer remains open on its redirecting state until that redirect succeeds
- **AND** no separate checkout surface opens

<!-- trace:scenario id=g10.store-cart-drawer.SC-5pn rev=2 -->
#### Scenario: grade10-site-store-cart-drawer-SC-28 - A changed line is named and no order is created
**Serves:** grade10-site-store-cart-drawer-US-06 - a collector whose checkout attempt is refused because a line changed

- **GIVEN** an open cart drawer whose reviewed basket contains a line the shop has since changed
- **WHEN** the collector activates Checkout and the checkout session is refused for that line
- **THEN** the drawer names the affected line
- **AND** no order is created
- **AND** Checkout is offered again once the cart holds only lines the read
  confirmed, as `grade10-site/store/cart-validation` requires

<!-- trace:scenario id=g10.store-cart-drawer.SC-t6r rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-29 - A provider refusal offers retry with no order created
**Serves:** grade10-site-store-cart-drawer-US-06 - a collector whose checkout attempt fails for a reason no line names

- **GIVEN** an open cart drawer whose Checkout action is creating a session
- **WHEN** the checkout provider refuses or fails to create the session for a reason no line names
- **THEN** the drawer restores Checkout and shows a failed state naming that the attempt did not go through
- **AND** no order is created
- **AND** the collector may activate Checkout again

### Requirement: The drawer gates Checkout at the verification bar

The cart drawer gates Checkout at the bar `grade10-site/store/account-identity`
defines, rather than repeating that check itself.

**Gate** - When a signed-in collector's reviewed basket meets or exceeds the
bar and their standing there is not verified, activating Checkout SHALL
create no checkout session.

**Message** - The drawer SHALL show the bar's threshold and the basket's
goods value, in the basket's currency.

**Link** - The drawer SHALL link to the collector's account page when the
site's profile address is enabled.

**No local check** - The identity check itself SHALL run only on the account
page, per `grade10-site/store/account-identity`'s consent requirement; the
drawer SHALL start no check of its own.

<!-- trace:scenario id=g10.store-cart-drawer.SC-f0v rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-30 - An unverified member's basket at the bar blocks Checkout
**Serves:** grade10-site-store-cart-drawer-US-06 - a collector who tries to check out a basket the bar asks a verified buyer for

- **GIVEN** a signed-in collector whose standing is not verified and whose reviewed basket totals 12000000 HKD minor units or more
- **WHEN** they activate Checkout
- **THEN** no checkout session is created
- **AND** the drawer shows the bar's threshold and the basket's goods value in HKD minor units

#### Scenario: grade10-site-store-cart-drawer-SC-31 - The gate links to the account page to verify
**Serves:** grade10-site/store/account-identity#grade10-site-store-account-identity-US-01 - a collector who follows the drawer's gate to verify from their account

- **GIVEN** the site's profile address is enabled and the Checkout gate is shown for an unverified member's basket at the bar
- **WHEN** the collector reads the gate
- **THEN** it shows a link to their account page
- **AND** activating it opens the account page, where they verify on their own consent
- **AND** the drawer starts no identity check itself

<!-- trace:scenario id=g10.store-cart-drawer.SC-7lx rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-32 - A verified member's basket at or above the bar proceeds without the gate
**Serves:** grade10-site-store-cart-drawer-US-06 - a verified collector whose basket meets the bar checks out without an extra step

- **GIVEN** a signed-in collector whose standing is verified and whose reviewed basket totals 12000000 HKD minor units or more
- **WHEN** they activate Checkout
- **THEN** no verification message or account-page link is shown
- **AND** the checkout session is created

<!-- trace:scenario id=g10.store-cart-drawer.SC-pqf rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-33 - A basket under the bar proceeds regardless of standing
**Serves:** grade10-site-store-cart-drawer-US-06 - a collector whose basket does not meet the bar checks out without regard to their standing

- **GIVEN** a signed-in collector's reviewed basket totals less than 12000000 HKD minor units
- **WHEN** they activate Checkout
- **THEN** no verification message or account-page link is shown, whether or not the collector's standing is verified
- **AND** the checkout session is created

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
**Serves:** grade10-site-store-cart-drawer-US-04 - Signed-in collector reads tender choices for the reviewed basket

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
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** a successful current member cart review and usable points quote
- **WHEN** the collector opens Use points
- **THEN** the shared input, pt suffix, Apply, balance, rate and Use max match the referenced Default story
- **AND** balance and ceiling come from the live quote rather than story fixtures

<!-- trace:scenario id=g10.store-cart-drawer.SC-44a rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-18 - Unresolved reviews receive no stale tender facts
**Serves:** grade10-site-store-cart-drawer-US-04 - Signed-in collector reads tender choices for the reviewed basket

- **GIVEN** a signed-in collector whose cart review is pending or failed
- **WHEN** the cart drawer renders
- **THEN** member-only promo and points facts are not shown
- **AND** no member-only tender read is required to render the cart review state

<!-- trace:scenario id=g10.store-cart-drawer.SC-3yf rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-19 - Tender facts follow the latest reviewed basket
**Serves:** grade10-site-store-cart-drawer-US-04 - Signed-in collector reads tender choices for the reviewed basket

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
prevent duplicate tender submissions and activating Checkout. A quote,
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
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** a reviewed member basket with an existing selected code
- **WHEN** the collector applies a valid whole-number amount and quote and persistence succeed
- **THEN** the accepted points choice is stored with the cart without replacing the code
- **AND** the Points credit and estimated total use the accepted server quote and no loyalty debit occurs

<!-- trace:scenario id=g10.store-cart-drawer.SC-tio rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-21 - Use max and Remove preserve the code
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** a current quote with a usable points ceiling and selected code
- **WHEN** the collector uses Use max, then Remove, with both operations succeeding
- **THEN** Use max applies the current quoted maximum and Remove persists zero points
- **AND** the selected code remains unchanged and each summary uses its accepted quote

<!-- trace:scenario id=g10.store-cart-drawer.SC-qit rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-22 - Invalid input and excessive input have distinct outcomes
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** current member points controls
- **WHEN** the collector submits blank, zero, negative, fractional, non-numeric or non-finite input, or an amount above the ceiling
- **THEN** invalid input does not persist or change the accepted total
- **AND** a valid whole-number request above the ceiling uses the server-accepted capped amount

<!-- trace:scenario id=g10.store-cart-drawer.SC-cui rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-23 - Pending changes prevent duplicate actions and checkout
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** a points change awaiting quote or persistence completion
- **WHEN** the collector tries another tender action or Checkout
- **THEN** no duplicate tender operation or checkout navigation occurs
- **AND** the last accepted same-basket summary remains until the operation resolves

<!-- trace:scenario id=g10.store-cart-drawer.SC-puc rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-24 - Failures retain the accepted choice
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** a same-basket accepted choice and total
- **WHEN** the next points quote is refused or fails, or persistence fails
- **THEN** a localized error is shown and the prior accepted choice and total remain
- **AND** no rejected choice is presented as saved or applied

<!-- trace:scenario id=g10.store-cart-drawer.SC-pi9 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-25 - Changed context rejects stale results
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** an unresolved points read or change
- **WHEN** the member or basket changes, or the drawer closes before the response arrives
- **THEN** the old response does not change the current view or initiate a stale persistence write
- **AND** reopening or a cart quantity/removal change reads the current choice and revalidates the new basket before enabling Checkout

<!-- trace:scenario id=g10.store-cart-drawer.SC-34h rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-26 - Unavailable points remain unavailable
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** zero available points, a zero ceiling, a non-programme member, or an unanswered points quote
- **WHEN** the drawer renders
- **THEN** no positive points action is enabled without a usable quote
- **AND** no invented balance or saving is shown

<!-- trace:scenario id=g10.store-cart-drawer.SC-fwv rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-27 - Checkout receives the accepted choice
**Serves:** grade10-site-store-cart-drawer-US-05 - Collector chooses points before leaving the cart

- **GIVEN** a successfully persisted points choice with its existing code
- **WHEN** the collector reloads or activates Checkout
- **THEN** the choice is read from the member cart and the drawer's live quote re-quotes both points and code
- **AND** only accepted spendPoints and the existing code reach the checkout session the drawer creates
