# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5

## shared.ui-store-cart.US2: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

<!-- trace:case id=g10.shared-store-cart.TC-rni rev=1 covers=g10.shared-store-cart.SC-3aw -->
### shared.ui-store-cart.US2-TC1: Existing cart surfaces render the supplied picture

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* A controlled story supplies `<picture_url>` and `<picture_alt>` to both items through existing optional props.
* The story’s image asset is served to the browser.
* The story includes a sold-out item and records supplied action callbacks.

**Test data:**

| `<cart_surface>` | `<picture_url>` | `<picture_alt>` |
| --- | --- | --- |
| CartItem | Controlled local product picture | Product picture description |
| CartDrawerBody | Same controlled picture | Same description |
| CartDrawer | Same controlled picture | Same description |

**Steps:**

1. Open the controlled `<cart_surface>` story.
2. Inspect the item’s thumbnail source and alt attribute.
3. Wait for the picture asset to load.
4. Inspect the sold-out item's picture and status.
5. Click the sold-out item's name.
6. Remove the sold-out item using the existing control.

**Expected Results:**

* The thumbnail source equals the supplied `<picture_url>`.
* The image alt attribute equals `<picture_alt>`.
* The image completes loading with naturalWidth greater than zero.
* The picture appears inside the existing thumbnail frame.
* The sold-out picture loads inside the existing dimmed frame.
* The sold-out marker and removal control keep their existing presentation.
* The name and removal actions call the supplied callbacks with their existing arguments.

<!-- trace:case id=g10.shared-store-cart.TC-6if rev=1 covers=g10.shared-store-cart.SC-p71 -->
### shared.ui-store-cart.US2-TC2: Missing picture alt text uses the item name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* A controlled CartItem story supplies a loadable picture URL.
* The item has `<item_name>` and `<image_alt>` from Test data.

**Test data:**

| `<item_name>` | `<image_alt>` |
| --- | --- |
| Gengar VMAX | Optional alt text omitted |
| Demo booster box | Empty string |

**Steps:**

1. Open the controlled CartItem story.
2. Wait for the picture asset to load.
3. Inspect the item’s image alt attribute.
4. Compare its copy and layout with the same item supplying alt text.

**Expected Results:**

* The picture loads with naturalWidth greater than zero.
* The image alt attribute equals `<item_name>`.
* The same copy and layout remain.

<!-- trace:case id=g10.shared-store-cart.TC-t2q rev=1 covers=g10.shared-store-cart.SC-du1 -->
### shared.ui-store-cart.US2-TC3: Missing pictures retain the existing cart placeholder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-02

**Pre-conditions:**

* A controlled story supplies a named item with `<picture_props>`.
* The browser records requests made by `<cart_surface>`.
* The story records storage writes and supplied action callbacks.
* The same item's picture-bearing story supplies the display baseline.

**Test data:**

| `<cart_surface>` | `<picture_props>` |
| --- | --- |
| CartItem | Picture source and alt omitted |
| CartDrawerBody | Picture source and alt omitted |
| CartDrawer | Picture source and alt omitted |
| CartItem | Empty picture source |
| CartDrawerBody | Empty picture source |
| CartDrawer | Empty picture source |

**Steps:**

1. Open the controlled `<cart_surface>` story.
2. Inspect the item’s thumbnail frame.
3. Inspect requests triggered by the missing picture.
4. Compare supplied display facts with the picture-bearing baseline.
5. Click the item's name.
6. Increase the item's quantity.
7. Remove the item using the existing control.
8. Inspect callback arguments and recorded storage writes.

**Expected Results:**

* The existing placeholder remains in the thumbnail frame.
* The shared surface makes no product-data request for a picture.
* Supplied name, quantity, price and status remain unchanged.
* Name, quantity and removal actions call supplied callbacks with their existing arguments.
* The shared surface stores no picture metadata.

## shared-ui-store-cart-US19: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** accepted figures held while tender finishes,
**so that** I cannot submit conflicting changes or continue unresolved.

<!-- trace:case id=g10.shared-store-cart.TC-cxw rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US19-TC1-1: Pending tender blocks every entry point

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with draft points 120, accepted total and selected code. Exercise both applied and unapplied points and an already-open promo sheet. Set tenderPending true and attempt click and Enter on every tender action and Checkout.

**Expected Results:**

* Points and promo inputs, Apply, Use max, both Remove actions, held-code selection and Checkout are disabled and invoke no callbacks. Accepted figures and draft 120 persist.

<!-- trace:case id=g10.shared-store-cart.TC-sxg rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US19-TC2-1: Clearing pending restores guarded availability

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Clear tenderPending on the same surfaces and attempt actions with supplied or absent callbacks, invalid code and zero input.

**Expected Results:**

* Clearing itself invokes no callbacks. Existing callback-presence and validation constraints still apply. Available actions work; draft and accepted figures stay unchanged.

<!-- trace:case id=g10.shared-store-cart.TC-swe rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US19-TC3-1: Omitting pending preserves consumer behavior

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with tenderPending omitted and false, in interactive, read-only, verifying, redirecting, loading and checkoutDisabled states.

**Expected Results:**

* Existing appearance and availability remain. Explicit false overrides none of the existing disabled reasons.

<!-- trace:case id=g10.shared-store-cart.TC-ja3 rev=1 covers=g10.shared-store-cart.SC-pxz -->
### shared.ui-store-cart.US19-TC4: Pending blocks item, tender and navigation controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared.ui-store-cart.US19

**Test data:**

| Field | Value |
| --- | --- |
| drawer | Controlled shared drawer with an active line, editable quantity, accepted figures, points draft and selected promo code; each listed callback supplied and recorded |
| points_state | Applied points with Remove; unapplied points with Apply and Use max, run separately |
| item_actions | Quantity decrease, quantity increase, line removal and product link |
| tender_actions | Existing points input, points disclosure, Apply, Use max, points Remove, promo disclosure and selected-code Remove |
| navigation_actions | Existing account or loyalty link and Checkout |
| surface | Compound drawer; standalone body, item and footer with the same applicable inputs and callbacks, run separately |

**Pre-conditions:**

* The tester is on the shared `<surface>` fixture.
* `<drawer>` is open with the consumer pending input false.
* Each action is otherwise available in its `<points_state>` row.

**Steps:**

1. Record the visible accepted figures and entered points.
2. Set the consumer pending input true.
3. Attempt each listed action with the pointer.
4. Attempt each listed action with Enter and Space, including Enter and value changes in an input.
5. Inspect the displayed values and callback record.

**Expected Results:**

* Item, tender and navigation actions are disabled while pending.
* The points input cannot change its entered value.
* Quantity, selected code and accepted figures remain unchanged.
* No listed action invokes its callback.
* Disclosures remain closed; links and Checkout start no navigation.

<!-- trace:case id=g10.shared-store-cart.TC-cpt rev=1 covers=g10.shared-store-cart.SC-xrx -->
### shared.ui-store-cart.US19-TC5: Pending protects editing in an open promo sheet

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared.ui-store-cart.US19

**Test data:**

| Field | Value |
| --- | --- |
| promo_sheet | Existing open promo sheet with an entered code, eligible held codes and enough content to scroll; supplied callbacks recorded |
| sheet_actions | Promo input, typed-code Apply, held-code selection and loyalty link |
| surface | Nested promo sheet; standalone public promo sheet, run separately |
| dismissal | Existing Back or close control, sheet backdrop click and Escape, run separately |

**Pre-conditions:**

* The tester is on the shared `<surface>` fixture.
* `<promo_sheet>` is open with the consumer pending input false.
* Each `<sheet_actions>` control is otherwise available.

**Steps:**

1. Record the entered code and accepted drawer figures.
2. Set the consumer pending input true.
3. Attempt each sheet action with the pointer.
4. Attempt each sheet action with the keyboard.
5. Scroll the sheet content.
6. Use `<dismissal>`.

**Expected Results:**

* The promo input cannot change its entered code.
* Apply, held-code selection and the loyalty link remain disabled.
* No sheet action invokes its callback.
* Entered code and accepted figures remain unchanged.
* The sheet content scrolls while pending.
* Each dismissal route closes the existing sheet.

<!-- trace:case id=g10.shared-store-cart.TC-d72 rev=1 covers=g10.shared-store-cart.SC-mxv -->
### shared.ui-store-cart.US19-TC6: Pending allows reading, scrolling and drawer dismissal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-cart-US-04

**Test data:**

| Field | Value |
| --- | --- |
| drawer | Open shared drawer with accepted cart content exceeding its viewport and recorded action and dismissal callbacks |
| dismissal | Drawer Close, drawer backdrop click and Escape, run separately |
| sheet | Promo sheet closed; promo sheet open with recorded state proposals and a focused opener, run separately |

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` has its consumer pending input true and `<sheet>` state.

**Steps:**

1. Read the visible cart content.
2. Scroll the drawer to its remaining lines.
3. If the sheet is open, scroll it and use Back, backdrop or Escape to dismiss it.
4. Inspect the sheet state proposal and focus after dismissal.
5. Use `<dismissal>` on the drawer.
6. Inspect the dismissal and action callback records.

**Expected Results:**

* Accepted cart content remains readable while pending.
* The drawer content scrolls while pending.
* An open sheet remains readable and scrollable; Back, backdrop and Escape close it first, leave the drawer open and restore focus to its opener.
* Sheet dismissal emits the collapsed-state proposal once; no edit or opening proposal runs.
* Each dismissal route closes the drawer.
* Dismissal invokes its callback once.
* No item, tender or navigation callback runs through dismissal.

<!-- trace:case id=g10.shared-store-cart.TC-wh7 rev=1 covers=g10.shared-store-cart.SC-rb9 -->
### shared.ui-store-cart.US19-TC7: Pending stops a delayed removal before dispatch

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared.ui-store-cart.US19

**Pre-conditions:**

* The shared item fixture holds an active row with a recorded removal callback.
* Removal uses its existing animation; its callback can be delayed.
* interactionPending is false.

**Steps:**

1. Activate item removal.
2. Set interactionPending true before the delayed callback dispatches.
3. Advance beyond the removal delay and inspect the row and callback record.
4. Clear interactionPending and inspect the row and callback record again.

**Expected Results:**

* Pending invokes no removal callback and the retained row leaves its removal animation.
* Clearing pending leaves the item present and invokes no removal callback automatically.

## shared.ui-store-cart.US20: Shopper resumes after the drawer receives an answer

**As a** shopper whose drawer is no longer waiting,
**I want** only currently available actions to return without repeating an earlier action,
**so that** I decide what happens next from the accepted cart or its failure feedback.

<!-- trace:case id=g10.shared-store-cart.TC-wru rev=1 covers=g10.shared-store-cart.SC-fct -->
### shared.ui-store-cart.US20-TC1: Clearing pending restores only currently permitted actions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared.ui-store-cart.US20

**Test data:**

| Field | Value |
| --- | --- |
| drawer | Controlled shared drawer with accepted figures, entered values and recorded callbacks |
| available | Supplied item, tender and navigation callbacks; editable quantity and valid tender inputs |
| quantity_limit | An active line at its consumer-supplied maximum; decrease permitted |
| unavailable_action | Missing action callback, invalid promo code, zero points, or existing loading, verifying, redirecting or checkout-disabled state; run each relevant control separately |
| legacy_pending | Existing tenderPending true when the consumer pending input clears |

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` is open with the consumer pending input true.
* The consumer supplies the current availability in each test-data row.
* Pointer and keyboard attempts on actions while pending have invoked no callbacks.

**Steps:**

1. Record accepted figures, entered values and callback counts.
2. Set the consumer pending input false.
3. Inspect values, callbacks and action availability.
4. Attempt the row's blocked actions by pointer and keyboard.
5. Activate each currently permitted action separately.
6. Inspect callback counts after each activation.

**Expected Results:**

* Clearing pending invokes no action callback.
* Accepted figures and entered values persist until explicit interaction.
* Each `<unavailable_action>` remains unavailable and invokes no callback.
* At `<quantity_limit>`, increase stays disabled; decrease becomes available.
* With `<legacy_pending>`, tender actions and Checkout remain disabled.
* Each currently permitted action invokes its callback once when activated.

## Reconciliation

### Pending QA2 - 2026-10-13

This fresh reconciliation compares the independent shared QA1 restart with
the shared requirement and technical design. Its input identity is
`8a8d6e59d40ebf9ff1cb4b6de04213976b73a4e0be37cb793296ae70beaaed4e`.
Cases are disposed first; scenario links then name only complete assertions.
This dated scope supersedes earlier pending coverage claims.

| Case | Disposition |
| --- | --- |
| `shared-ui-store-cart-US19-TC1-1` / `TC-cxw` | Retain issued identity and draft lifecycle; canonical US19 Trace; exact tender-only guard |
| `shared-ui-store-cart-US19-TC2-1` / `TC-sxg` | Retain issued identity and draft lifecycle; canonical US20 Trace; exact tender-only recovery |
| `shared-ui-store-cart-US19-TC3-1` / `TC-swe` | Retain compatibility purpose; add all public parts, omitted/false interaction input and legacy tender true rows |
| `shared.ui-store-cart.US19-TC4` / `TC-ja3` | Retain blind draft; sharpen compound/standalone rows and Enter, Space and input attempts |
| `shared.ui-store-cart.US19-TC5` / `TC-cpt` | Retain blind draft; sharpen nested/standalone sheet, loyalty link and existing dismissal callback |
| `shared.ui-store-cart.US19-TC6` / `TC-d72` | Retain blind draft; add sheet-first dismissal, collapsed proposal, focus and blocked edit/opening proposals |
| `shared.ui-store-cart.US20-TC1` / `TC-wru` | Retain blind draft; attempt actions before clearing to observe no replay |
| `shared.ui-store-cart.US19-TC7` / `TC-wh7` | New QA2 draft from uncovered delayed-removal THEN, allocated by trace CLI; no QA1 credit |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `shared-ui-store-cart-SC-37` (`SC-9yi`) | `shared-ui-store-cart-US19-TC1-1` |
| `shared-ui-store-cart-SC-38` (`SC-nty`) | `shared-ui-store-cart-US19-TC2-1` |
| `shared-ui-store-cart-SC-39` (`SC-x24`) | `shared-ui-store-cart-US19-TC3-1` |
| `g10.shared-store-cart.SC64` (`SC-pxz`) | `shared.ui-store-cart.US19-TC4` |
| `g10.shared-store-cart.SC65` (`SC-xrx`) | `shared.ui-store-cart.US19-TC5` |
| `g10.shared-store-cart.SC66` (`SC-mxv`) | `shared.ui-store-cart.US19-TC6` |
| `g10.shared-store-cart.SC67` (`SC-fct`) | `shared.ui-store-cart.US20-TC1` |
| `g10.shared-store-cart.SC68` (`SC-2h3`) | `shared-ui-store-cart-US19-TC3-1` |
| `g10.shared-store-cart.SC69` (`SC-rb9`) | `shared.ui-store-cart.US19-TC7` |

- **Anchor coverage** - US19 covers pending controls, retained values, delayed removal and dismissal; US20 covers recovery and compatibility. Context US04 covers dismissal. Durable order-discount US18 is unchanged.
- **Overclaims** - The three legacy cases now link SC37, SC38 and SC39 individually; they do not each claim all three. Standalone, dismissal and delayed-removal gaps are closed above.
- **Uncovered scenarios** - None in this increment. No new product choice or contradiction remains.
- **Lifecycle** - All 8 cases remain draft/manual; the run grants no execution or classification credit. Existing revisions and marker identities are preserved.

#### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-store-cart-US19-TC1-1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared-ui-store-cart-US19-TC2-1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared-ui-store-cart-US19-TC3-1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC4` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC5` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC6` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US20-TC1` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |
| `shared.ui-store-cart.US19-TC7` | To be walked in Cart Drawer Group 15.1 controlled compound and public-part fixtures, then Group 17.1 pending drawer actor walk; delayed answers and callback records are required. No test or walk has executed in this planning run. |



**Run:** 2026-09-22. The coordinator independently derived the three acceptance
cases from the approved pending-state brief, without reading this shared delta.
The spec worker independently wrote the requirement and scenarios. Earlier
independent points QA supplies the consumer pending-operation coverage.

- **Aligned** — disabled entry points, restored availability and omitted-state
  compatibility map to `shared-ui-store-cart-SC-37`,
  `shared-ui-store-cart-SC-38` and `shared-ui-store-cart-SC-39` respectively.
- **Strengthened** — the coordinator explicitly covered Enter, both points
  states, open promo sheet, standalone footer, and existing disabled reasons.
  These test existing guard semantics under the optional prop, adding no new
  product behavior.
- **Raised** — no unanswered product decision; this is a missing presentation
  prop for the approved pending behavior, with default-false compatibility.

### Thumbnail Reconciliation (2026-10-13)

**Run:** Bounded QA2 for existing optional picture props only. QA1 read the
allowlisted snapshot at `/tmp/store-cart-thumbnails-planning/qa1`, including
the shared product-picture PRD, journeys, Purpose, Feature set, decisions,
UI states, approved reference and prior suite without Reconciliation.
Requirements, scenarios and technical design were excluded. Input identities
are recorded in `/tmp/store-cart-thumbnails-planning/input-identities.json`;
the prompt allowlist was not enforced filesystem isolation. Dev wrote the
shared scenarios without reading QA1 cases. This fresh QA2 reader authored
neither reading. All 3 new cases remain draft.

| Case | Disposition | Fully Asserted Scenario |
| --- | --- | --- |
| shared.ui-store-cart.US2-TC1 | Corrected; standalone item, body and drawer load controlled bytes, retaining sold-out treatment and callbacks | shared-ui-store-cart-SC-64 |
| shared.ui-store-cart.US2-TC2 | Corrected; omitted and empty alt text use the item name with unchanged copy and layout | shared-ui-store-cart-SC-65 |
| shared.ui-store-cart.US2-TC3 | Corrected; omitted and empty source retain the placeholder, supplied facts and callbacks, without product reads or picture storage | shared-ui-store-cart-SC-66 |

- **Coverage** - Each new scenario's full outcome has one asserting case. No
  new outcome remains uncovered, and no product contradiction or question
  remains in this bounded reading. Coverage links are planning evidence;
  Group 10's controlled-asset browser regressions still need implementation
  and execution.
- **Preserved** - Earlier cases and reconciliation are unchanged. The inherited
  pending-state journey collision lies outside this picture extension.

## Settled

- **Existing props** - Q19 uses `CartItemSummary` as the existing item type;
  `CartItem`, `CartDrawerBody` and `CartDrawer` are the rendered story surfaces.
- **Pictures** - The application supplies source and alt text. Shared blocks
  acquire and persist no product picture data, retaining their existing frame,
  placeholder, status treatment and callbacks.
- **Loaded bytes** - Controlled Storybook assets prove browser image loading;
  positive natural width is checked inside the matching item, including the
  existing hidden thumbnail container.
