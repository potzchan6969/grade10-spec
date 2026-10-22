# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-14, tcs-rules r5

## grade10-admin-auction-listing-US1: Operator saves an unfinished listing and comes back to it

**As a** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

<!-- trace:case id=g10adm.auction-listing.TC-p7c rev=1 covers=grade10-admin-auction-listing-SC-221 -->
### g10adm.auction-listing.US1-TC7: A draft save refuses a starting price with cents

The editor's money field takes cents, so the route is the editor itself, then a direct API write.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* An operator holding the grant to set prices and the window is signed in and is on the editor of `<listing_1>`.
* `<listing_1>` is a draft in USD with a starting price of `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | A draft listing in USD; bind its identity only | · |
| starting price | USD120 | (range: any whole-dollar amount) |
| starting price with cents | USD120.50 | (fixed boundary), a starting price that is not whole dollars |

**Steps:**

1. Enter `<starting price with cents>` in the starting price field and save the draft.
2. Read the starting price field and the message beside it.
3. Send the same starting price straight to the API for `<listing_1>`.
4. Reload the editor and read the starting price.
5. Enter `<starting price>` and save the draft.

**Expected Results:**

* Step 2 shows the save is refused and the message names the whole-dollar rule.
* Step 3 is refused and names the whole-dollar rule.
* Step 4 reads `<starting price>`, the value before step 1, and the listing is still a draft.
* Step 5 saves the draft, so the refusal was for the cents.

---

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As a** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-v2n rev=1 covers=grade10-admin-auction-listing-SC-222 -->
### g10adm.auction-listing.US3-TC31: A create or an update refuses a starting price with cents

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* An operator holding the grant to set prices and the window holds an API session.
* `<listing_2>` is a complete draft in USD, and `<listing_3>` is a created listing in USD with a starting price of `<starting price>`.

**Test data:**

| Write | Starting price sent | Fixture notes |
| --- | --- | --- |
| create `<listing_2>` | USD120.01 | (fixed boundary), one minor unit above a whole dollar |
| update `<listing_3>` | `<starting price>` plus one minor unit | (fixed boundary) |

`<starting price>` is USD120, a whole-dollar amount.

**Steps:**

1. Send the row's write with the row's starting price.
2. Read the API response and the listing named in the row.

**Expected Results:**

* Step 1 is refused and the message names the whole-dollar rule.
* Step 2 reads `<listing_2>` as a draft, not created, for the create row.
* Step 2 reads `<listing_3>` with starting price `<starting price>`, the value before the write, for the update row.

---

## Settled

- A starting price an operator saves, creates or updates is a whole-dollar amount; one with cents is refused on the form and the API, naming the rule, and the listing is unchanged (Q16, the product manager's answer, carried here by Q17). A price already stored with cents is left as it is (Q18).

## Reconciliation

**Run:** QA2 reconciliation 2026-10-23 for change `configure-auction-bid-increments`, joining two draft cases with the delta scenarios `SC-221` and `SC-222` on `grade10-admin-auction-listing-US-01` and `grade10-admin-auction-listing-US-03`. The cases were written in the same pass as the delta, not blind: neither QA1 nor Dev ran again for this capability, because the rule was settled by the product manager's answers. This line is a statement, not proof.

- **Retained** - every durable case of this capability stays as it is; this delta adds two and revises none. The durable cases that refuse a non-whole starting price (`US1-TC3` and `US3-TC22`) read a count of minor units and are unaffected.
- **Covered** - `SC-221` by `US1-TC7` and `SC-222` by `US3-TC31`.
- **Overlap** - `usd-lot-currency-winner-settlement-choice` also carries this requirement; this change `depends_on` it and states against its text.
- **Anchors** - `grade10-admin-auction-listing-US-01` and `grade10-admin-auction-listing-US-03` hold the two cases.
