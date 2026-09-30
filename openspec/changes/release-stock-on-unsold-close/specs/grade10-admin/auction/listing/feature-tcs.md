# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r1

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

### grade10-admin-auction-listing-US9-TC1-1: Unsold close releases the hold with no operator step

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_1>` is published, holding `<held quantity>` units of `<product_1>`, its close a few minutes away.
* The bids on `<listing_1>` are as the row states.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing for `<product_1>`, quantity `<held quantity>` |
| `<product_1>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 3 units (any quantity from 1 to 500; more than 1, so a rise of one unit is told apart) |
| `<available before>` | 2 units (any count) |
| `<available after>` | 5 units: `<available before>` plus `<held quantity>` |

| Row | Bids at close | Reserve | Outcome |
| --- | --- | --- | --- |
| No bids | None | None set | Closes Unsold, hold released |
| Reserve miss | A top bid of HKD 800.00 | HKD 1,000.00 (any reserve above the top bid) | Closes Unsold, hold released |

**Steps:**

1. Note `<product_1>`'s available count.
2. Wait until `<listing_1>`'s close passes, taking no action.
3. Open `<listing_1>`.
4. Read the listing's status and stock note.
5. Read `<product_1>`'s available count again.

**Expected Results:**

* Step 1 reads `<available before>`.
* Step 4: `<listing_1>` reads Unsold, closed.
* Step 4: the listing says its stock was released, with the release's date.
* Step 4: the listing offers Relist.
* Step 5 reads `<available after>`, `<available before>` plus `<held quantity>`.

### grade10-admin-auction-listing-US9-TC2-1: Sold and live listings show no released note or Relist

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_2>` is in the state the row states, holding `<held quantity>` units of `<product_2>`.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<product_2>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 4 units (any count) |

| Row | `<listing_2>` | Stock outcome |
| --- | --- | --- |
| Sold | Closed with a winner, the top bid over any reserve | Hold moves to sold; available stays `<available before>` |
| Live | Published, its close still ahead | Hold stays; available stays `<available before>` |

**Steps:**

1. Open `<listing_2>`.
2. Read the listing's stock note and actions.
3. Read `<product_2>`'s available count.

**Expected Results:**

* Step 2 shows no released-stock note.
* Step 2 offers no Relist.
* Step 3 reads the row's stock outcome.

### grade10-admin-auction-listing-US9-TC3-1: Relist opens a new draft that holds its own stock on Save

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_3>` closed Unsold with bids under its reserve, and its hold is released.
* `<product_3>` shows `<available before>` units available.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Unsold listing for `<product_3>`, quantity `<quantity>`, title, copy, starting price `<price>`, currency JPY, a gallery of three items, slug `<slug_3>`, listing code `<code_3>`, a start and close, bids and a history |
| `<product_3>` | The product `<listing_3>` sold nothing of |
| `<quantity>` | 2 units (any quantity from 1 to 500) |
| `<price>` | JPY 8000 (any positive whole amount) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after Save>` | 3 units: `<available before>` minus `<quantity>` |

**Steps:**

1. Open `<listing_3>`.
2. Click Relist.
3. Read the new draft's form.
4. Read `<product_3>`'s available count.
5. Set a start and a close on the draft.
6. Save the draft.
7. Read `<product_3>`'s available count.
8. Open `<listing_3>` again.

**Expected Results:**

* Step 3 shows a new draft, not `<listing_3>`.
* Step 3: product `<product_3>`, quantity `<quantity>`, and `<listing_3>`'s title and copy.
* Step 3: starting price `<price>`, currency JPY, the same gallery.
* Step 3: no start or close, no bids, no history.
* Step 4 still reads `<available before>`.
* Step 6 saves a draft whose slug is not `<slug_3>` and whose listing code is not `<code_3>`.
* Step 7 reads `<available after Save>`, `<available before>` minus `<quantity>`.
* Step 8: `<listing_3>` still reads Unsold, closed, with its bids and history.

### grade10-admin-auction-listing-US9-TC4-1: Operator without the operate grant cannot relist

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_4>` closed Unsold and its hold is released.
* `<product_4>` shows `<available before>` units available.
* admin(signed in, without `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An Unsold listing for `<product_4>`, quantity 1 |
| `<available before>` | 1 unit (any count of at least 1) |

**Steps:**

1. Open `<listing_4>`.
2. Click Relist, where offered.
3. Save the draft, where one opened.
4. Read the Listings table.
5. Read `<product_4>`'s available count.

**Expected Results:**

* Step 2 or step 3 is refused.
* Step 4 shows no new draft for `<product_4>`.
* Step 5 still reads `<available before>`.

### grade10-admin-auction-listing-US9-TC5-1: Clean-up frees each earlier Unsold hold once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* Seeded before the release: `<listing_5>` and `<listing_6>` closed Unsold, each still holding its stock.
* `<listing_7>` closed Unsold after the release, its hold already released at the close.
* `<listing_8>` closed with a winner, its hold moved to sold.
* The one-time clean-up has not yet run.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | Closed Unsold with no bids, holding 2 units of `<product_5>` |
| `<listing_6>` | Closed Unsold on a reserve miss, holding 1 unit of `<product_5>` |
| `<listing_7>` | Closed Unsold, 4 units of `<product_5>` already released |
| `<listing_8>` | Closed sold, 1 unit of `<product_5>` sold |
| `<product_5>` | 6 units available before the clean-up (any count) |
| `<available after>` | 9 units: 6 plus 2 plus 1 |

**Steps:**

1. Read the API response for `<product_5>`'s available count.
2. Run the clean-up.
3. Read the API response for `<product_5>`'s available count.
4. Read the API response for each listing's hold.
5. Run the clean-up again.
6. Read the API response for `<product_5>`'s available count.

**Expected Results:**

* Step 1 reads 6.
* Step 3 reads `<available after>`, 6 plus the holds of `<listing_5>` and `<listing_6>`.
* Step 4: the holds of `<listing_5>` and `<listing_6>` are released.
* Step 4: `<listing_7>`'s release is not repeated; `<listing_8>`'s units stay sold.
* Step 6 still reads `<available after>`.

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
