# shared/ui/store-order-history Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-order-history-US1: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my active and past orders on one page, with status, lines, and track
when a shipment is underway,
**so that** I can follow a live order or reopen an older one without the
surface inventing which orders belong where.

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

## Reconciliation

**Run:** QA2 on 2026-10-06. Joined the 2 blind cases and the one scenario on journey US-01 and the Feature set's status badge. Kept both ids and versions. Relabelled one row of `US1-TC7-1` from `Delivered` to `All done`: the row proves a second label on one variant, and `Delivered` is the claim Order Status forbids a Store badge to make. Rerun in a fresh context after the accept review: no change. The delta leaves journey US-02 untouched, so this suite holds no US2 section and the durable `US2-TC1-1` stands.

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
