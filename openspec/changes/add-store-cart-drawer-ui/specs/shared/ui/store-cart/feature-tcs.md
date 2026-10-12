# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-09-22, tcs-rules r3.0

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

## shared-ui-store-cart-US18: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** accepted figures held while tender finishes,
**so that** I cannot submit conflicting changes or continue unresolved.

<!-- trace:case id=g10.shared-store-cart.TC-cxw rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US18-TC1-1: Pending tender blocks every entry point

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
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with draft points 120, accepted total and selected code. Exercise both applied and unapplied points and an already-open promo sheet. Set tenderPending true and attempt click and Enter on every tender action and Checkout.

**Expected Results:**

* Points and promo inputs, Apply, Use max, both Remove actions, held-code selection and Checkout are disabled and invoke no callbacks. Accepted figures and draft 120 persist.

<!-- trace:case id=g10.shared-store-cart.TC-sxg rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US18-TC2-1: Clearing pending restores guarded availability

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
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Clear tenderPending on the same surfaces and attempt actions with supplied or absent callbacks, invalid code and zero input.

**Expected Results:**

* Clearing itself invokes no callbacks. Existing callback-presence and validation constraints still apply. Available actions work; draft and accepted figures stay unchanged.

<!-- trace:case id=g10.shared-store-cart.TC-swe rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
### shared-ui-store-cart-US18-TC3-1: Omitting pending preserves consumer behavior

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
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with tenderPending omitted and false, in interactive, read-only, verifying, redirecting, loading and checkoutDisabled states.

**Expected Results:**

* Existing appearance and availability remain. Explicit false overrides none of the existing disabled reasons.

## Reconciliation

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
