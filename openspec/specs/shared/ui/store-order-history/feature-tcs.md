# shared/ui/store-order-history Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-order-history-US1: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my active and past orders on one page, with status, lines, and track
when a shipment is underway,
**so that** I can follow a live order or reopen an older one without the
surface inventing which orders belong where.

<!-- trace:case id=g10.shared-store-order-history.TC-szj rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC1-1: Active and past sections both render when non-empty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
The consumer supplies a non-empty active list and a non-empty past list.

**Steps:**

1. Render `OrderHistory` with those lists.
2. Check the page sections and cards.

**Expected Results:**

* Both section headings and their order cards appear.
* The empty state does not appear.

<!-- trace:case id=g10.shared-store-order-history.TC-zix rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC2-1: Empty section is omitted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
The consumer supplies a non-empty active list and an empty past list.

**Steps:**

1. Render `OrderHistory` with those lists.
2. Check the section headings.

**Expected Results:**

* Only the Active Orders section appears.
* The Past Orders heading does not appear.
* The empty state does not appear.

<!-- trace:case id=g10.shared-store-order-history.TC-tu9 rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC3-1: Track order appears only when enabled

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
A card header is supplied with `trackOrder` true and Track copy.

**Steps:**

1. Render the card header.
2. Activate the Track Order control.

**Expected Results:**

* The Track Order control appears.
* Activating it reports through the Track callback.

<!-- trace:case id=g10.shared-store-order-history.TC-z7g rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC4-1: Track order is hidden when disabled

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
A card header is supplied with `trackOrder` false and a View Details handler.

**Steps:**

1. Render the card header.

**Expected Results:**

* No Track Order control appears.
* View Details still appears.

<!-- trace:case id=g10.shared-store-order-history.TC-yqj rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC5-1: Card lists supplied lines with status labels

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
An order card is supplied with header props, a status label, and one or more line items that include image, product text, and total.

**Steps:**

1. Render `OrderHistoryCard` with those children.
2. Check the header, status, and each line.

**Expected Results:**

* The header and each child line item appear.
* The body uses horizontal overflow with scroll-fade styling.
* Each status displays the supplied label.
* Each line shows image, product text, and total.

<!-- trace:case id=g10.shared-store-order-history.TC-yvg rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC6-1: Application imports the surface and reuses a part alone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
None.

**Steps:**

1. Import each order-history export from the shared UI package's public entry.
2. Render the status, line item, card header, or card without `OrderHistory`.

**Expected Results:**

* Every named import resolves and no other component or type is exported for this surface.
* The part renders as specified, with no missing-context error.

<!-- trace:case id=g10.shared-store-order-history.TC-ar2 rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC7-1: Status badge shows the consumer's variant and label

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* The shared UI Storybook is running (`pnpm run storybook:ui`), on the Store Order History/OrderHistoryStatus Shipped story.

**Test data:**

| Variant | Label supplied |
| --- | --- |
| processing | `Preparing` |
| shipped | `On its way` |
| completed | `Done` |
| canceled | `Called off` |
| refunded | `Money back` |
| pickup | `Collect in store` |
| completed | `All done` |

**Steps:**

1. In the Controls panel, set `status` to the row's Variant.
2. In the Controls panel, set `children` to the row's Label supplied.
3. Read the badge.

**Expected Results:**

* Step 3: the badge shows the row's Label supplied, in the row's Variant style.
* Step 3: the badge shows no words besides the supplied label.

<!-- trace:case id=g10.shared-store-order-history.TC-hyr rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared-ui-store-order-history-US1-TC8-1: A status outside the six is refused at build

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* A consuming file renders the status badge with a status that is not one of the six variants.

**Steps:**

1. Run the consuming application's type check.

**Expected Results:**

* Step 1: the type check fails on the status value.

---

## shared-ui-store-order-history-US2: Collector starts shopping when there are no orders

**As a** signed-in collector with no orders,
**I want** an empty state that sends me to the store,
**so that** I know where my first order will appear and can browse.

<!-- trace:case id=g10.shared-store-order-history.TC-47f rev=1 covers=g10.shared-store-order-history.SC-g56 -->
### shared-ui-store-order-history-US2-TC1-1: Zero orders shows empty state with shop now

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-02

**Pre-conditions:**
The consumer supplies empty active and past lists, empty-state copy, and a Shop Now handler.

**Steps:**

1. Render `OrderHistory` with those lists.
2. Activate Shop Now.

**Expected Results:**

* The empty state appears with the supplied title, description, and Shop Now action.
* Neither Active nor Past section headings appear.
* Activating Shop Now reports through its callback.

## Reconciliation

**Run:** QA2 on 2026-10-06. Joined the 2 blind cases and the one scenario on journey US-01 and the Feature set's status badge. Kept both ids and versions. Relabelled one row of `US1-TC7-1` from `Delivered` to `All done`: the row proves a second label on one variant, and `Delivered` is the claim Order Status forbids a Store badge to make. Rerun in a fresh context after each accept review, and on 2026-10-07 after QA1's second pass on Order Status: no change. The delta leaves journey US-02 untouched, so this suite holds no US2 section and the durable `US2-TC1-1` stands.

| Finding | Disposition |
| --- | --- |
| `shared-ui-store-order-history-SC-08` | Covered by `US1-TC7-1`, and by the durable `US1-TC5-1` |
| The consumer chooses the status and the badge gives it no meaning | Covered by `US1-TC7-1`, which shows every supplied label and no other words |
| `pickup` stays an accepted status | Covered by the `pickup` row of `US1-TC7-1` |
| No status outside the six | Covered by `US1-TC8-1`, decided by the consuming application's type check |
| Raised | none |
| Rejected cases | none |
| Contradicted readings | none |
| Uncovered anchors | none |
