# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-admin-inventory-catalog-US9: Inventory admin sees unsold auction stock come back

**As an** inventory admin,
**I want** the stock of an auction that closed with no winner to show as available, with the hold closed and the listing named,
**so that** I can trust the count and see why it moved.

### grade10-admin-inventory-catalog-US9-TC1-1: Unsold close returns the whole hold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A product has stored stock ten and no other holds.
* An Auction listing of that product holds four units and has just closed with no winner.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold listing>` | Quantity four, no bids, closed at its close time |
| `<expected available>` | 10 - 0 = 10 available after the close; 6 before it |

**Steps:**

1. Navigate to <inventory product url>.
2. Read stock, reserved and available.
3. Open the Auction hold of `<unsold listing>`.
4. Open the product history.

**Expected Results:**

* Available reads `<expected available>`, up by four; reserved reads zero.
* The hold reads closed and released, with remaining zero.
* The hold names `<unsold listing>`.
* One history entry records a release of four units, naming the listing and the Unsold close as the reason.
* The entry shows before and after quantities that differ by four.
* No admin step was taken between the close and this read.

### grade10-admin-inventory-catalog-US9-TC2-1: Sold close moves the hold to sold, not to available

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A product has stored stock ten and an Auction hold of three for a listing that closed with a winner.

**Test data:**

| Field | Value |
| --- | --- |
| `<expected available>` | 10 - 3 = 7, unchanged by the close |

**Steps:**

1. Navigate to <inventory product url>.
2. Read stock, sold and available.
3. Open the Auction hold of the sold listing.
4. Open the product history.

**Expected Results:**

* Available reads `<expected available>`, not raised by the close.
* Sold rises by three.
* The hold reads sold, not released.
* History holds no release entry with the Unsold reason for this listing.

### grade10-admin-inventory-catalog-US9-TC3-1: Called-off listing keeps its own release reason

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A product has an Auction hold of two for a listing an operator called off before its close.

**Steps:**

1. Navigate to <inventory product url>.
2. Open the product history.
3. Open the hold of the called-off listing.

**Expected Results:**

* The hold reads released once, by the call-off.
* The history entry does not name the Unsold close or the clean-up.
* Available rose by two once, not twice.

### grade10-admin-inventory-catalog-US9-TC4-1: One clean-up frees holds left by earlier Unsold closes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Three products each hold stock for a listing that closed Unsold before the release shipped: one hold of five, one of one, one of two.
* A fourth product's Auction hold belongs to a live listing.

**Test data:**

| Field | Value |
| --- | --- |
| `<expected available gain>` | 5 + 1 + 2 = 8 units across the three products |

**Steps:**

1. Run the one-off clean-up of held Unsold stock.
2. Navigate to <first inventory product url>.
3. Read available and the hold.
4. Open the product history.
5. Repeat for the other two products.
6. Navigate to the fourth product page.

**Expected Results:**

* Each of the three holds reads closed and released and names its listing.
* Available rises by each hold's units, `<expected available gain>` in all.
* Each history entry says the clean-up released it, not the Unsold close at its moment.
* The live listing's hold on the fourth product is unchanged.

## Settled

None yet.

## Reconciliation

**Run:** the blind pass read the Feature set, the journeys, `decisions.md`, the proposal, the linked PRD sections, the durable suite and the domain suite with their Reconciliation stripped, and the two rulebooks. It was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. It is a statement, not proof.

- **Raised, folded into spec** - which listings offer Relist and to whom, as `grade10-admin-auction-listing-SC-137` and `grade10-admin-auction-listing-SC-138`; that Relist stores nothing until Save, as `grade10-admin-auction-listing-SC-136`; the failed release retried without delaying the close, as `grade10-admin-auction-listing-SC-133`; the release date on the note, as `grade10-admin-auction-listing-SC-134`; the history reason, as `grade10-admin-inventory-catalog-SC-136` and `grade10-admin-inventory-catalog-SC-137`
- **Raised, escalated** - the fields Relist carries beyond the PRD's list, answered by the product manager: the Cert ID choice carries and the rest start as on any new draft, recorded in Q6
- **Raised, rejected** - a Relist on a called-off listing, because a call-off is a choice nobody asked to undo (Q10 in `decisions.md`)
- **Trimmed by the simpler reading** - the short-stock refusal on Relist Save (the durable draft-save rule proves it), the table sentence on the note, the closed-listing-unchanged clause, and catalog cases that repeat another case or a durable rule
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-auction-listing-US-09` and `grade10-admin-inventory-catalog-US-09` each have cases; the group anchors `Unsold close` and `Unsold auction stock` are walked by the same cases
