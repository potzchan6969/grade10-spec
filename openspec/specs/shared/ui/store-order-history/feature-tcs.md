# shared/ui/store-order-history Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<storybook>` is the shared UI Storybook, served by `pnpm storybook:ui`; the stories sit under Store/Order History. A story's Controls panel changes the props it passes; its Actions panel records each callback called.

## shared.ui-store-order-history.US1: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my active and past orders on one page, with status, lines, and track
when a shipment is underway,
**so that** I can follow a live order or reopen an older one without the
surface inventing which orders belong where.

<!-- trace:case id=g10.shared-store-order-history.TC-szj rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared.ui-store-order-history.US1-TC1: Each order list that holds orders shows as its own section

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* `<story>` supplies `<lists>`.

**Test data:**

| `<story>` | `<lists>` | `<sections>` |
| --- | --- | --- |
| OrderHistory Filled | active and past orders | Active Orders and Past Orders |
| OrderHistory Active Only | active orders, no past order | Active Orders alone, no Past Orders heading |

**Steps:**

1. Open the story on `<storybook>`; read the headings and cards.

**Expected Results:**

* It shows `<sections>`, each with its order cards; no empty state.

<!-- trace:case id=g10.shared-store-order-history.TC-tu9 rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared.ui-store-order-history.US1-TC3: Track Order shows on a header told to show it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* The OrderHistoryCardHeader With Track Order story supplies Track copy.

**Steps:**

1. Read the header; click Track Order, and read the Actions panel.

**Expected Results:**

* Track Order shows, recording one track.

<!-- trace:case id=g10.shared-store-order-history.TC-z7g rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared.ui-store-order-history.US1-TC4: A header told not to track shows no Track Order, keeping View Details

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* The OrderHistoryCardHeader Without Track Order story supplies a View Details handler.

**Steps:**

1. Read the header.

**Expected Results:**

* No Track Order shows; View Details does.

<!-- trace:case id=g10.shared-store-order-history.TC-yqj rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared.ui-store-order-history.US1-TC5: A card lists its lines, each with picture, text and total

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
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* `<story>` supplies `<lines>`.

**Test data:**

| `<story>` | `<lines>` |
| --- | --- |
| OrderHistoryCard Shipped With Lines | a header, a status label and lines |
| OrderHistoryCard Overflowing Lines | more lines than fit across the card |
| OrderHistoryLineItem Default, alone | one line |

**Steps:**

1. Open the story; read the header, the status and each line; scroll the card's lines across.

**Expected Results:**

* The header and each line show, each line with its picture, product text and total; the lines scroll across with an edge fade where they overflow.

<!-- trace:case id=g10.shared-store-order-history.TC-ar2 rev=1 covers=g10.shared-store-order-history.SC-gr1,g10.shared-store-order-history.SC-exr,g10.shared-store-order-history.SC-fem,g10.shared-store-order-history.SC-1rp,g10.shared-store-order-history.SC-unu,g10.shared-store-order-history.SC-iv2,g10.shared-store-order-history.SC-6b5,g10.shared-store-order-history.SC-5cs,g10.shared-store-order-history.SC-22a -->
### shared.ui-store-order-history.US1-TC7: The status badge shows the label it is given, in its status's style

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**

* The OrderHistoryStatus Shipped story is open.

**Test data:**

| `<status>` | `<label>` |
| --- | --- |
| processing | Preparing |
| shipped | On its way |
| completed | Done |
| completed | All done |
| canceled | Called off |
| refunded | Money back |
| pickup | Collect in store |

**Steps:**

1. In Controls, set status to `<status>` and the label to `<label>`; read the badge.

**Expected Results:**

* The badge shows `<label>` alone, in `<status>`'s style.

---

## shared.ui-store-order-history.US2: Collector starts shopping when there are no orders

**As a** signed-in collector with no orders,
**I want** an empty state that sends me to the store,
**so that** I know where my first order will appear and can browse.

<!-- trace:case id=g10.shared-store-order-history.TC-47f rev=1 covers=g10.shared-store-order-history.SC-g56 -->
### shared.ui-store-order-history.US2-TC1: No orders shows the empty state, which sends the collector shopping

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-02

**Pre-conditions:**

* The OrderHistory Empty story supplies no orders, empty-state copy and a Shop Now handler.

**Steps:**

1. Read the page; click Shop Now, and read the Actions panel.

**Expected Results:**

* The empty state shows its title, description and Shop Now, with no Active or Past heading; Shop Now records one action.
