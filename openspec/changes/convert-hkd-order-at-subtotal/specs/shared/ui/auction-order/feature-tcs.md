# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail and the address form are walked through `grade10-site/auction/winner-order`, which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

<!-- trace:case id=g10.shared-auction-order.TC-ibm rev=1 covers=g10.shared-auction-order.SC-7su -->
### g10.shared-auction-order.US1-TC34: Subtotal row carries its note and the fee row follows in the same group

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
* The Subtotal row and the fee row sit together as one group between two separators, one above the Subtotal and one above the Order Total.
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
* Both fee rows sit in the same group as the Subtotal row, between two separators.
* `<fee row 2>` prints Free as given.

---

## Settled

- `AuctionWinnerOrder` draws each of `summary.subtotal` and `summary.feeLines` as supplied: an empty fee list draws no row and no separator, the Subtotal's note is optional, and with the older converted total and fee beside them every supplied row draws; the application supplies one set (decisions Q28).
- The Subtotal and the fee rows sit together as one group between two separators, one above the Subtotal and one above the Order Total.

## Reconciliation

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order and left this capability's cases as they were. Its files started from the blind state, without the dispositions below. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the repaired deltas of the five capabilities, `tasks.md`, `tech-design.md`, `proposal.md`, the journeys and `decisions.md` through Q31, and both QA1 passes; the merged block `packages/ui/src/blocks/auction-order/auction-winner-order.tsx` was read in the first pass. It wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition. It is a statement, not proof.

**Blind cases**

| Case | Disposition |
| --- | --- |
| `US1-TC34` (`TC-ibm`) | Kept and unblocked. The author repaired the Feature set bullet to the requirement's wording, so the result that the rows "each sit between their own separators" was a misreading of the old bullet; QA2 reworded it to one group between two separators, which is all it changed. Linked: `g10.shared-auction-order.SC1` |
| `US1-TC35` (`TC-lnf`) | Kept and unblocked on the same repair; the same one result reworded. No link: no scenario states the order of several fee rows |

**Existing durable cases**

- `US1-TC27` (`TC-bu1@3`) renders what the application supplies; its HKD total 103100 and fee 3873 are illustrative strings the application no longer sends. Its results do not move. Left `draft`
- `US1-TC32` (`TC-mvr@1`) is the block with no converted total. Left `draft`

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `shared-ui-auction-order-SC-27`, `SC-28`, `SC-30`, `SC-s7t`, `SC-29` | Unchanged; the durable cases that held them hold them |
| `g10.shared-auction-order.SC1` | `US1-TC34` |

**Out of suite:** g10.shared-auction-order.SC2, g10.shared-auction-order.SC3, g10.shared-auction-order.SC4, g10.shared-auction-order.SC5

All four are contract claims of the block: the footnote shows under the Subtotal only (SC2), a summary without the new props renders as before (SC3), each prop draws on its own (SC4) and both sets draw when both arrive (SC5). The block tests that task 2.1 plans in this store (`packages/ui/src/blocks/auction-order/auction-winner-order.test.ts`) verify them, as the public-exports test does for the other Out of suite scenarios of this suite. `US1-TC34` asserts the note under the Subtotal and not that none shows elsewhere.

**Uncovered**

- None

**Over-claimed**

- None

**Contradictions between the readings**

- None. The disagreement the first pass held over the separators is settled by the repaired Feature set bullet, the requirement and the merged block

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| Root group Order detail | `US1-TC34`, `TC35`, and the durable `TC27`, `TC28`, `TC32` | SC1 covered; SC2 to SC5 out of suite |

**Raised**

Q28 closes the two shared rows: each prop draws on its own as supplied, and with both sets supplied both draw. The merged block already behaves so.
