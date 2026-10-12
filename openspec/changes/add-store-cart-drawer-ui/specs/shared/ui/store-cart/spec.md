## Feature set

- Drawer export contract
  - Cart drawer components: one cart surface every store application imports rather than builds
  - Cart drawer types: names the props, copy, item, and promo shapes an application supplies
  - Unavailable status: marks a line whose product is no longer in the store catalogue, distinct from sold out and adjusted
  - Toast copy field: carries the removal message on drawer copy the consumer supplies
  - Empty copy fields: carries the empty-cart title and optional description on the drawer copy and body props the consumer supplies
- Cart contents
  - Items only: the drawer lists what the cart holds and nothing standing in for an item
  - Empty state: an empty cart shows the design-system empty state with no action
  - Item count badge: tells the shopper how many active items the cart holds, leaving out sold-out and unavailable lines
  - Scroll-fade on overflow: shows there is more above or below the visible items
- Opening the drawer
  - Fresh status and price read: the drawer opens against current product status and pricing
  - Boneyard skeletons: holds each region's shape while that read is in flight
- Cart refresh cleanup
  - Unavailable line removal: drops delisted catalogue lines after open loading without showing a sold-out row
  - Single removal toast: tells the collector once when any such line left the cart on that open
- Dismissal
  - Three ways out: close button, dimmed backdrop, and Escape all close the drawer
  - Background scroll lock: keeps the page behind the drawer still while it is open
- Checkout handoff
  - Redirecting button state: says the checkout is under way, and returns to its label if it fails
  - Application-owned navigation: the drawer reports the intent; the application creates the session
- Low-stock warning
  - Shown when adjusted: the consumer-supplied warning is visible on an adjusted line
  - Hidden after edit: a quantity change hides it for the rest of that mount
- Stock is a ceiling
  - Supplied maximum: a line's stepper stops where the consumer says the shop's count stops
  - No maximum, no ceiling: a line supplied none keeps a stepper that counts on
- What is left, said
  - Supplied remaining count: the line displays how many are left, in the consumer's own words
  - Consumer decides when: the line shows what it is given and judges nothing about scarcity
- Site sale and promo outcomes
  - On sale: a site sale shows on the lines it cuts as the sale price beside the struck list price, never as a summary row; an order discount shows as its own summary row instead
  - Subtotal: the sum of each line's price times its quantity, leaving out sold-out and unavailable lines
  - Stacked: the lines keep the sale and the summary shows only the code's discount
  - Refused: the lines and totals stay on the sale and the promo sheet says why
  - Replaced: each line the code takes the sale from shows the list price with nothing struck through, and the summary shows only the code's discount
  - Removed: the code's discount leaves, and the sale returns to lines the code had taken it from while it still runs
  - Held, cannot apply: a held code that cannot apply is listed apart from the ones that can, muted with its reason and no Apply

- Pending operations
  - Consumer state: optional pending guard across item, tender and navigation actions
  - Current display: retain accepted figures and entered values while waiting
  - Recovery: restore permitted actions without replaying callbacks
  - Dismissal: leave through Close, backdrop click or Escape

## ADDED Requirements

### Requirement: Consumer pending tender prevents conflicting actions

The consumer's optional tender-only pending input SHALL default to false.
The compound SHALL forward it to its footer and promo sheet. While true,
existing points and promo inputs, points Apply,
Use max, points Remove, promo Apply, held-code selection, promo Remove and
Checkout SHALL be disabled and their callbacks SHALL NOT be invoked.
An already-open promo sheet SHALL obey the same pending state. Accepted figures
and entered values SHALL remain visible. Clearing pending SHALL restore the
existing callback-presence and other availability guards, without invoking any
action automatically. The shared component SHALL NOT quote, persist or decide
when the consumer's operation finishes.

<!-- trace:scenario id=g10.shared-store-cart.SC-9yi rev=1 -->
#### Scenario: shared-ui-store-cart-SC-37 - Pending tender prevents a second action
**Serves:** g10.shared-store-cart.US19 - Shopper waits before another tender action

- **GIVEN** supplied action callbacks and an existing accepted summary
- **WHEN** the consumer sets tenderPending true, including with the promo sheet open
- **THEN** points and promo inputs and all tender actions and Checkout are disabled
- **AND** attempted activation invokes no action callback and preserves shown figures and entered values

<!-- trace:scenario id=g10.shared-store-cart.SC-nty rev=1 -->
#### Scenario: shared-ui-store-cart-SC-38 - Clearing pending restores existing availability
**Serves:** g10.shared-store-cart.US20 - Shopper continues after the consumer answers

- **GIVEN** the drawer was pending with some action callbacks absent
- **WHEN** the consumer clears tenderPending
- **THEN** actions resume only where their existing callbacks and availability guards permit them
- **AND** no callback is invoked automatically

<!-- trace:scenario id=g10.shared-store-cart.SC-x24 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-39 - Existing consumers keep their behavior
**Serves:** g10.shared-store-cart.US20 - Shopper uses the existing tender contract

- **WHEN** a consumer omits tenderPending or supplies false
- **THEN** the existing layout and callback-gated availability remain unchanged

### Requirement: Consumer pending operations disable drawer actions

The existing public prop types SHALL accept these controlled pending inputs:

| Public Props | Input | Type | Default |
| --- | --- | --- | --- |
| `CartDrawerProps`, `CartDrawerBodyProps`, `CartItemProps`, `CartDrawerFooterProps`, `CartPromoSheetProps` | `interactionPending` | Optional boolean | `false` |
| `CartDrawerProps`, `CartDrawerFooterProps`, `CartPromoSheetProps` | `tenderPending` | Optional boolean | `false` |

`CartDrawer` SHALL forward interaction pending to its body, items, footer
and nested promo sheet, and tender pending to its footer and sheet.
Standalone public parts SHALL honor their supplied pending inputs. The
footer and sheet SHALL honor either pending input without weakening their
existing availability guards. Omission of interaction pending SHALL preserve
the legacy tender-only behavior. The existing public export set SHALL remain
unchanged.

While interaction pending is true, quantity changes, item removal, product
activation, promo and points inputs and non-dismissal disclosures, Apply,
Use max, held-code selection, tender removal, account/loyalty navigation and
Checkout SHALL be disabled. Pointer and keyboard activation, including input
Enter, SHALL invoke no corresponding action callback. A delayed user removal
that has not dispatched when pending starts SHALL invoke no removal callback
and SHALL NOT replay when pending clears. Existing read-driven delisted
cleanup is distinct from a user removal and keeps its current read gate.

Pending SHALL retain accepted figures and entered values under the existing
loading presentation. It SHALL NOT make unconfirmed facts current. Scroll,
Close, backdrop, Escape and nested-sheet dismissal SHALL remain available,
with the existing sheet-first dismissal and focus behavior. A promo-state
proposal that collapses the sheet for dismissal SHALL remain available; edit,
opening and action proposals SHALL remain blocked. Clearing pending
SHALL restore only actions permitted by current state and supplied callbacks,
without replaying any user action. The consumer owns the operation lifetime;
the shared component SHALL acquire no product data or persistence.

<!-- trace:scenario id=g10.shared-store-cart.SC-pxz rev=1 -->
#### Scenario: g10.shared-store-cart.SC64 - Pending reaches every drawer action
**Serves:** g10.shared-store-cart.US19 - Shopper waits before editing or leaving for another surface

- **GIVEN** the compound or its standalone public parts with supplied item, tender, disclosure, checkout and account/loyalty callbacks
- **WHEN** the consumer sets interactionPending true with accepted cart values visible
- **THEN** every non-dismissal item, tender, disclosure and navigation control is disabled
- **AND** pointer, Enter, Space and input-change attempts invoke none of those callbacks and keep accepted figures and entered values

<!-- trace:scenario id=g10.shared-store-cart.SC-xrx rev=1 -->
#### Scenario: g10.shared-store-cart.SC65 - An open promo sheet shares pending
**Serves:** g10.shared-store-cart.US19 - Shopper waits with the code sheet already open

- **GIVEN** the nested or standalone public promo sheet is open with entered text and held codes
- **WHEN** the consumer sets interactionPending true and the shopper tries editing, Apply, held-code selection or the loyalty link
- **THEN** the controls are disabled, their callbacks do not run and entered text remains
- **AND** the sheet remains readable and scrollable with Back, backdrop and Escape dismissal available

<!-- trace:scenario id=g10.shared-store-cart.SC-mxv rev=1 -->
#### Scenario: g10.shared-store-cart.SC66 - Pending preserves dismissal and reading
**Serves:** shared-ui-store-cart-US-04 - Shopper leaves the cart or its nested sheet while waiting

- **GIVEN** interactionPending is true in an overflowing cart, with or without the promo sheet open
- **WHEN** the shopper scrolls or uses Close, Back, backdrop or Escape as applicable
- **THEN** scrolling and existing dismissal remain available
- **AND** backdrop and Escape dismiss an open promo sheet first and then the cart, preserving focus behavior
- **AND** dismissal still emits the sheet's collapsed-state proposal or close callback while edit and opening proposals remain blocked

<!-- trace:scenario id=g10.shared-store-cart.SC-fct rev=1 -->
#### Scenario: g10.shared-store-cart.SC67 - Clearing pending restores only allowed actions
**Serves:** g10.shared-store-cart.US20 - Shopper resumes from the current accepted state or failure

- **GIVEN** interactionPending was true with some callbacks absent or current data guards still withholding actions
- **WHEN** the consumer clears interactionPending
- **THEN** only currently permitted actions return, and a remaining tenderPending still blocks tender actions and Checkout
- **AND** accepted values remain and no attempted user action is replayed

<!-- trace:scenario id=g10.shared-store-cart.SC-2h3 rev=1 -->
#### Scenario: g10.shared-store-cart.SC68 - Omitted interaction state preserves consumers
**Serves:** g10.shared-store-cart.US20 - Shopper continues with an existing consumer

- **WHEN** a consumer of the compound or a standalone public part omits interactionPending or supplies false, with tenderPending false or true where supported
- **THEN** existing layout, loading presentation and callback guards remain unchanged
- **AND** tenderPending true retains its existing tender and Checkout guard without newly disabling item controls

<!-- trace:scenario id=g10.shared-store-cart.SC-rb9 rev=1 -->
#### Scenario: g10.shared-store-cart.SC69 - Delayed user removal cannot cross pending
**Serves:** g10.shared-store-cart.US19 - Shopper waits before a removal callback can start

- **GIVEN** the shopper started a removal animation whose callback has not dispatched
- **WHEN** interactionPending becomes true before that callback runs
- **THEN** the callback does not run and the retained row leaves the removal animation
- **AND** clearing pending does not remove the item automatically
