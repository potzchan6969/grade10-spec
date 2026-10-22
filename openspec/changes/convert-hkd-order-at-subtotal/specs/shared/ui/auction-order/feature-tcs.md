# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail and the address form are walked through `grade10-site/auction/winner-order`, which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

<!-- trace:case id=g10.shared-auction-order.TC-ibm rev=1 -->
### g10.shared-auction-order.US1-TC34: Subtotal row carries its note and the fee row follows between its own separators

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered for an HKD order with USD line items, `summary.subtotal` carrying a note, one `summary.feeLines` row and an Order Total.

**Test data:**

| Field | Value |
| --- | --- |
| line items | Five USD line items, supplied as ready-made strings |
| subtotal text | `HK$1,970.35` (fixed: the Subtotal string supplied) |
| note text | `Converted from US$251.00 at 1 USD = 7.85 HKD` (fixed: the note string supplied) |
| fee row | A row labelled `Payment Processing Fee` with value `HK$71.79` (fixed: the fee string supplied) |
| total text | `HK$2,042.14` (fixed: the Order Total string supplied) |

**Steps:**

1. Read the summary from top to bottom.

**Expected Results:**

* The line items remain in USD, in the order supplied.
* The Subtotal row follows the last line item and reads `<subtotal text>`.
* The Subtotal row carries `<note text>`.
* The fee row follows the Subtotal row and reads `<fee row>`.
* The Subtotal row and the fee row each sit between their own separators.
* The Order Total reads `<total text>` below them.
* No amount is derived or converted by the block.

<!-- trace:case id=g10.shared-auction-order.TC-lnf rev=1 -->
### g10.shared-auction-order.US1-TC35: Several fee lines render in the order supplied, each as given

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with `summary.subtotal`, an Order Total and a `summary.feeLines` list of two rows.

**Test data:**

| Field | Value |
| --- | --- |
| fee row 1 | A row labelled `Payment Processing Fee` with value `HK$196.57` (fixed: the first row supplied) |
| fee row 2 | A row labelled `<fee label 2>` with value `Free` (fixed: the second row supplied, a string the block must print as given) |
| fee label 2 | Any label different from the first row's, for example `Second fee` (range: any text) |

**Steps:**

1. Read the rows between the Subtotal row and the Order Total.

**Expected Results:**

* `<fee row 1>` shows first and `<fee row 2>` second, as supplied.
* Each fee row sits between its own separators.
* `<fee row 2>` prints Free as given.
