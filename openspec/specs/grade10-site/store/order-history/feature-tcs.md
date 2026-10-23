# grade10-site/store/order-history Test Cases

**Status:** pending-review · 0/14
**Drafts styled:** 2026-09-08, tcs-rules r2

## Walk 1: Read current pictures and accessible item names

**Starting state:**

* customer(signed in as the orders' owner) is on `/profile/orders`.
* An earlier past order contains the shared-product variants, another product and the blank-alt and meaningful-alt items below.
* A recent active order has a reachable current first picture.
* The current catalogue titles and prices differ from the recorded purchase facts.
* A previous order read showed the former first picture before the current catalogue change.

**Shared test data:**

| Field | Value |
| --- | --- |
| picture order | The earlier order; two lines name different variants of one product, another names a different product, and three more name the blank-alt products |
| first picture | The shared product's reachable current first picture, changed after purchase and different from its former, second and variant pictures |
| other picture | The other product's reachable current first picture, different from the shared product's |
| supplied alt | The shared product's nonblank catalogue description, different from the recorded title |
| recorded facts | Saved titles, quantities, currencies, prices, totals, status and supplied tracking details |
| blank-alt products | Three products with distinct recorded titles and reachable first pictures; alt text is absent, empty, or spaces and tabs only |
| meaningful-alt product | A further pictured item whose meaningful description differs from its recorded title |

### Route

1. Read the earlier and recent orders' items and loaded pictures.
   - Record matching current first pictures in the existing frames. `g10.store-order-history.US5-TC1`
2. Inspect the shared product's picture name and recorded purchase facts.
   - Record the supplied description and unchanged purchase facts. `g10.store-order-history.US5-TC1`
3. Inspect blank-alt and meaningful-alt items and their picture names.
   - Record loaded pictures named by recorded titles or the supplied meaningful description. `g10.store-order-history.US5-TC2`

## g10.store-order-history.US5: Collector recognises products in earlier purchases

**As a** signed-in collector reviewing my Store purchases,
**I want** available current product pictures beside my order items,
**so that** I can recognise a purchase before opening its details.

<!-- trace:case id=g10.store-order-history.TC-92a rev=1 covers=g10.store-order-history.SC-qrm,g10.store-order-history.SC-2qr -->
### g10.store-order-history.US5-TC1: Current product pictures preserve the recorded purchase

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-history.US5

**Pre-conditions:**

* customer(signed in as the orders' owner) is on `/profile/orders`.
* The customer owns an earlier past order and a recent active order, including `<picture order>` and the picture fixtures below.
* The current catalogue title and price differ from the recorded purchase facts.
* A previous read of the earlier order showed the former first picture; the catalogue now supplies `<first picture>`.

**Test data:**

| Field | Value |
| --- | --- |
| picture order | An earlier purchase whose products' first pictures changed after purchase and since its previous order read; two recorded lines name different variants of one product, and another line names a different product |
| first picture | The shared product's current first picture, reachable and visibly different from its former first picture, second picture and variant pictures |
| other picture | The other product's current first picture, visibly different from the shared product's picture |
| supplied alt | The shared product's nonblank catalogue alt text, different from the recorded item title |
| recorded facts | The saved titles, quantities, currencies, prices, totals, status and supplied tracking details before picture enrichment |

**Steps:**

1. Read the order items in the existing picture frames.
2. Inspect each loaded picture and its accessible name.
3. Compare the displayed purchase facts with `<recorded facts>`.

**Expected Results:**

* Both variant lines show `<first picture>`, fully loaded.
* The other product shows `<other picture>`, fully loaded.
* No line shows the former, second or variant picture.
* The shared product's picture uses `<supplied alt>` as its accessible name.
* The displayed facts match `<recorded facts>`.
* The recent active order also shows its current first picture.

<!-- trace:case id=g10.store-order-history.TC-o1c rev=1 covers=g10.store-order-history.SC-r6e -->
### g10.store-order-history.US5-TC2: Picture names preserve descriptions or use recorded item titles

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-history.US5

**Pre-conditions:**

* customer(signed in as the orders' owner) is on `/profile/orders`.
* One owned order contains every `<item>` below.
* Each `<item>` has a different recorded title and a reachable first current picture.
* Each `<item>` supplies `<catalogue alt>` from its row.
* A further pictured item supplies a meaningful description different from its recorded title.

**Test data:**

| `<item>` | `<catalogue alt>` | Partition |
| --- | --- | --- |
| A recorded item with an available picture | Absent | Optional alt field missing |
| A different recorded item with an available picture | Empty string | Present but empty |
| Another recorded item with an available picture | Spaces and tabs only | Present but blank |
| A further recorded item with an available picture | A meaningful description different from its recorded title | Supplied accessible description |

**Steps:**

1. Read each `<item>` in the order.
2. Inspect each picture's accessible name.

**Expected Results:**

* Each picture loads in its existing frame.
* Each blank-alt picture uses that `<item>`'s recorded title.
* The further picture keeps its meaningful supplied description.
* The accessible names contain no blank-only descriptions.

## Ungrouped

### grade10-site-store-order-history-US1: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my newest active and past Store orders in one place,
**so that** I can understand an order and decide whether to open it.

<!-- trace:case id=g10.store-order-history.TC-1mb rev=2 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-71g -->
#### grade10-site-store-order-history-US1-TC1-2: Owned orders group and open newest first

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns active and past Store orders with different creation times; one order has different quoted and paid totals.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check both order groups and their order.
3. Check the order with different quoted and paid totals.
4. Click View Details for that order.

**Expected Results:**

* Only the signed-in user's orders appear, with Active above Past and each group newest first.
* The selected summary shows the paid total, not the quoted subtotal.
* Step 4 opens `/profile/orders/<order-id>` for the selected order.

<!-- trace:case id=g10.store-order-history.TC-lty rev=1 covers=g10.store-order-history.SC-fun -->
#### grade10-site-store-order-history-US1-TC2-1: Unknown total stays pending

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns a Store order with no paid amount and no quoted subtotal.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check that order's total.

**Expected Results:**

* The order says its total is pending.
* No zero amount is shown for that order.

<!-- trace:case id=g10.store-order-history.TC-k8f rev=1 covers=g10.store-order-history.SC-raj -->
#### grade10-site-store-order-history-US1-TC3-1: Safe carrier link opens in isolation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns a Store order with <safe carrier tracking url>, an absolute `https` URL carrying no credentials.

**Steps:**

1. Navigate to `/profile/orders`.
2. Click Track Order for that order.

**Expected Results:**

* Track Order is present for that order.
* <safe carrier tracking url> opens in a new browser context.
* The carrier page has no access to the Grade10 page.

<!-- trace:case id=g10.store-order-history.TC-hve rev=1 covers=g10.store-order-history.SC-ab2 -->
#### grade10-site-store-order-history-US1-TC4-1: Tracking number alone creates no action

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns a Store order with a carrier and tracking number but no safe carrier URL.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check that order's actions.

**Expected Results:**

* Track Order is absent for that order.

<!-- trace:case id=g10.store-order-history.TC-7ws rev=1 covers=g10.store-order-history.SC-dta -->
#### grade10-site-store-order-history-US1-TC5-1: First order read remains loading

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The order read is delayed by network manipulation.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check the page before the order read settles.

**Expected Results:**

* A loading state appears.
* The page does not claim the account has no orders.

<!-- trace:case id=g10.store-order-history.TC-uom rev=1 covers=g10.store-order-history.SC-g9j -->
#### grade10-site-store-order-history-US1-TC6-1: Failed order read retries in place

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user's first order read is made to fail and the next read is allowed to complete.

**Steps:**

1. Navigate to `/profile/orders`.
2. Click Retry after the failure appears.

**Expected Results:**

* A localized error and Retry action appear after the first read.
* Step 2 reads the orders again at `/profile/orders`.

<!-- trace:case id=g10.store-order-history.TC-h4e rev=1 covers=g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo -->
#### grade10-site-store-order-history-US1-TC7-1: Customer label keeps the Store action id

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns an order with Store id <store order id> and the shop order number state named by **Test data**.

**Test data:**

| Run | Shop order number | Expected customer label |
| --- | --- | --- |
| 1 | `#G10-10482` | `#G10-10482` |
| 2 | null | <store order id> |
| 3 | empty | <store order id> |

**Steps:**

1. Navigate to `/profile/orders`.
2. Check the selected order's customer label.
3. Click View Details for that order.

**Expected Results:**

* Step 2 shows <expected customer label> and invents no other order number.
* Step 3 opens `/profile/orders/<store order id>` in every run.

---

### grade10-site-store-order-history-US2: Collector signs in to the intended order page

**As a** signed-out collector,
**I want** sign-in to keep the Your Orders address,
**so that** I arrive at the orders I asked to see after proving my account.

<!-- trace:case id=g10.store-order-history.TC-xb7 rev=1 covers=g10.store-order-history.SC-si2 -->
#### grade10-site-store-order-history-US2-TC1-1: Sign-in preserves Your Orders address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-02

**Pre-conditions:**
The user has no signed-in session and has an account with Store orders.

**Steps:**

1. Navigate to `/profile/orders`.
2. Complete sign-in.

**Expected Results:**

* The sign-in surface opens without replacing `/profile/orders`.
* Step 2 reveals that user's orders at `/profile/orders`.

---

### grade10-site-store-order-history-US3: Collector starts shopping from an empty account

**As a** signed-in collector with no Store orders,
**I want** an empty state that returns me to the Store,
**so that** I can begin a purchase instead of reaching a dead end.

<!-- trace:case id=g10.store-order-history.TC-2ez rev=1 covers=g10.store-order-history.SC-li6 -->
#### grade10-site-store-order-history-US3-TC1-1: Empty account returns to the Store

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-03

**Pre-conditions:**
The signed-in user owns no Store orders.

**Steps:**

1. Navigate to `/profile/orders`.
2. Click Shop Now in the empty state.

**Expected Results:**

* The designed empty state appears after the order read succeeds.
* Step 2 opens `/store`.

### g10.store-order-history.US5: Collector recognises products in earlier purchases

**As a** signed-in collector reviewing my Store purchases,
**I want** available current product pictures beside my order items,
**so that** I can recognise a purchase before opening its details.

<!-- trace:case id=g10.store-order-history.TC-u6q rev=1 covers=g10.store-order-history.SC-1ry,g10.store-order-history.SC-ds5 -->
#### g10.store-order-history.US5-TC3: Absent pictures keep placeholders beside readable purchases

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-history.US5

**Pre-conditions:**

* customer(signed in as the orders' owner) is at the Store.
* An owned order is available in each `<picture state>` below.
* The recorded titles, quantities, money, status and supplied tracking facts are known before the read.

**Test data:**

| `<picture state>` | Partition |
| --- | --- |
| A current product supplies no picture | Product has no picture |
| A product bought earlier has since been removed and supplies no picture | Product cannot supply a current picture |
| A product bought earlier is no longer published and supplies no picture | Historical product is unavailable to the catalogue read |
| The order response omits optional picture fields entirely | Compatible response predating picture fields |

**Steps:**

1. Navigate to `/profile/orders` for each `<picture state>`.
2. Read the affected item and its order facts.
3. Click the order's detail action.

**Expected Results:**

* The order opens with the existing absent-picture placeholder.
* Recorded titles, quantities, money, status and supplied tracking facts remain readable.
* Absent picture fields do not turn the successful read into an error.
* The available order actions remain visible.
* The unavailable picture neither removes nor invents a purchase.
* The detail action opens the selected order.

<!-- trace:case id=g10.store-order-history.TC-kmk rev=1 covers=g10.store-order-history.SC-cb4 -->
#### g10.store-order-history.US5-TC4: Picture lookup failure leaves the order usable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-history.US5

**Pre-conditions:**

* customer(signed in as the orders' owner) is at the Store.
* The owned order read succeeds with known recorded facts and a safe supplied tracking action.
* The picture lookup is mocked to fail for the order's products.

**Steps:**

1. Navigate to `/profile/orders`.
2. Read the affected items and order facts.
3. Inspect captured application logs for the failed lookup.
4. Click the order's tracking action.
5. Click the order's detail action.

**Expected Results:**

* The page shows the order rather than an order-read error.
* Affected items retain the existing absent-picture placeholder.
* Recorded item and order facts remain readable.
* The failed picture lookup has a logged failure.
* Tracking still opens its supplied carrier address.
* The detail action opens the selected order.

<!-- trace:case id=g10.store-order-history.TC-33e rev=1 covers=g10.store-order-history.SC-a5w -->
#### g10.store-order-history.US5-TC5: Failed picture resources leave other order facts usable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-history.US5

**Pre-conditions:**

* customer(signed in as the orders' owner) is at the Store.
* The order supplies two product pictures and a safe tracking action.
* One picture resource is blocked; the other remains reachable.

**Steps:**

1. Navigate to `/profile/orders`.
2. Read the affected order after the picture resource fails.
3. Click its tracking action.
4. Click the order's detail action.

**Expected Results:**

* The reachable picture loads in its existing frame.
* Recorded items, money and order progress remain readable.
* The tracking action still opens its supplied carrier address.
* The detail action still opens the selected order.
* No order-read error replaces the order.

## Settled

- **Picture metadata** - [Decisions Q8](../../../../decisions.md#decisions) keeps malformed upstream catalogue metadata within optional enrichment. Supplied order picture fields remain optional strings; null or non-string values remain invalid typed responses.
- **Partial lookup failure** - [Decisions Q9](../../../../decisions.md#decisions) keeps completed successful batches and leaves only unresolved items pictureless. Both answers are decided by the round from existing sources, not new human decisions.
- **Existing image frame** - A missing picture keeps the existing frame or placeholder. It does not invent a known product image. Resource failure adds no new shared error treatment.

## Reconciliation

**Run:** 2026-10-23. QA1 independently read the frozen anchors, journeys, linked PRDs, proposal, decisions, stripped UI design, existing suites and the domain suite from `/tmp/grade10-order-thumbnail-planning/qa1-input`. Requirements, technical design, scenario covers, QA2 and archives were excluded. QA2 then read both independent drafts and saved every case disposition before adding post-hoc links. Input identities and the complete ledger are in `/tmp/grade10-order-thumbnail-planning/qa2-report.md` and `freeze.json`. Isolation was prompt-enforced; no filesystem isolation is claimed.

### Anchor Coverage

| Journey | Cases | Feature-Set Root Groups |
| --- | --- | --- |
| `grade10-site-store-order-history-US-01` | Seven existing US1 cases | Customer access; Order review; Page states |
| `grade10-site-store-order-history-US-02` | Existing US2 case | Customer access |
| `grade10-site-store-order-history-US-03` | Existing US3 case | Page states |
| `g10.store-order-history.US5` | Five QA1 cases, reconciled | Product pictures |

All journeys and feature-set root groups have cases. Optional picture data introduces no composed route. The existing history-to-detail handoff stays with the domain suite. There is no new admin journey.

### Case Dispositions Before Post-Hoc Links

The scratch ledger was saved before covers edits. The following records the final comparison against the entire scenario, then each THEN and AND assertion. A case earns multiple links only when its same route and checking assert all linked outcomes. All case identities, revisions and draft/manual status remain unchanged. No case was merged, deprecated, approved or executed. QA2 amendments sharpen unverified draft checking within the same product purpose; none is labeled a blind addition.

| Case | Disposition | Post-Hoc Whole-Scenario Evidence |
| --- | --- | --- |
| `g10.store-order-history.US5-TC1` | QA2 clarifies the previous-read fixture; same current-picture purpose. | `g10.store-order-history.SC-qrm`, `g10.store-order-history.SC-2qr` |
| `g10.store-order-history.US5-TC2` | QA2 adds meaningful-alt checking beside the blank-alt rows. | `g10.store-order-history.SC-r6e` |
| `grade10-site-store-order-history-US1-TC1-2` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-u2y`, `g10.store-order-history.SC-zre`, `g10.store-order-history.SC-4i0`, `g10.store-order-history.SC-71g` |
| `grade10-site-store-order-history-US1-TC2-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-fun` |
| `grade10-site-store-order-history-US1-TC3-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-raj` |
| `grade10-site-store-order-history-US1-TC4-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-ab2` |
| `grade10-site-store-order-history-US1-TC5-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-dta` |
| `grade10-site-store-order-history-US1-TC6-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-g9j` |
| `grade10-site-store-order-history-US1-TC7-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-yhz`, `g10.store-order-history.SC-3eo` |
| `grade10-site-store-order-history-US2-TC1-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-si2` |
| `grade10-site-store-order-history-US3-TC1-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-history.SC-li6` |
| `g10.store-order-history.US5-TC3` | QA2 makes preserved status/tracking, actions and legacy decoding explicit. | `g10.store-order-history.SC-1ry`, `g10.store-order-history.SC-ds5` |
| `g10.store-order-history.US5-TC4` | QA2 exercises both tracking and detail actions after lookup failure. | `g10.store-order-history.SC-cb4` |
| `g10.store-order-history.US5-TC5` | QA2 also exercises the detail action after resource failure. | `g10.store-order-history.SC-a5w` |

Every history scenario has a whole-asserting case. No contradicted reading or uncovered scenario remains. The source repair removed an empty-order clause from the new unavailable-picture scenario: its GIVEN names existing items. Empty-input/no-invention stays a technical regression in tasks 9.1/10.1.

### Technical Verifiers

**Verified outside this suite:** Deduplicated lookup batches, the 250-variant boundary, deadline, upstream metadata failures, completed-batch retention, access-before-enrichment and safe diagnostics are planned in tasks 9.1-9.4. Extend `grade10:packages/grade10-store/backend/test/services/orders/index.test.ts` and `grade10:packages/grade10-store/backend/test/trpc/routers/orders.test.ts`; a focused enrichment test beside the existing order-service tests may own the batch checks. Typed response, legacy and old-client decoding remain with tasks 8.1-8.3. No planned verifier is credited as a current pass.

**Verified outside this suite:** The existing admin customer preview is technical parity. Tasks 9.3/10.3/11.2 verify detail/card images through `grade10:apps/admin/grade10/src/pages/store/StoreOrderPage.test.tsx` and the existing customer components. Backend router tests retain grants, Audit and card personal-data omissions. No staff workflow or collector journey is invented.

### Classification

Legacy Type acceptance is reread as functional because those cases verify order facts. Existing smoke/regression membership stays independent. The empty-account return path is Severity minor because it supports shopping while the rest of the Store remains usable. The r2 stamp remains: this is reconciliation and classification-only normalization, not whole-file draft regeneration. Current-value property edits preserve identity, revision, review status and automation evidence under Step 5. New cases remain draft/manual; no execution or human classification approval is claimed.

### Manual

Every row awaits the controlled customer-order browser walk in task 11.1. Fault-controlled rows need scripted fixtures. No existing test path or completed old task is credited as current automation evidence.

| Manual | Why |
| --- | --- |
| `g10.store-order-history.US5-TC1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-history.US5-TC2` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC1-2` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC2-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC3-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC4-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC5-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC6-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US1-TC7-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US2-TC1-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-history-US3-TC1-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-history.US5-TC3` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-history.US5-TC4` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-history.US5-TC5` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
