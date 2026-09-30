# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r4

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

### grade10-admin-auction-listing-US9-TC1-2: Unsold close releases the hold with no operator step

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

* `<listing_1>` is published in no campaign, holding `<held quantity>` units of `<product_1>`, its close a few minutes away.
* The bids on `<listing_1>` are as the row states.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing for `<product_1>`, quantity `<held quantity>`, in no campaign |
| `<product_1>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 3 units (any quantity from 1 to 500; more than 1, so a rise of one unit is told apart) |
| `<available before>` | 2 units (any count) |
| `<available after>` | 5 units: `<available before>` plus `<held quantity>` |
| `<close date>` | The date `<listing_1>`'s close passes |

| Row | Bids at close | Outcome |
| --- | --- | --- |
| No bids | None | Closes Unsold, hold released |
| Top bid demoted | Only `outbid` bids; the top bid's card hold failed before the close | Closes Unsold, hold released |

**Steps:**

1. Note `<product_1>`'s available count on its product page.
2. Wait until `<listing_1>`'s close passes, taking no action.
3. Reload <grade10 auction admin listings url>.
4. Read `<listing_1>`'s row in the Listings table.
5. Open `<listing_1>`.
6. Read the listing's status and stock note.
7. Read `<product_1>`'s available count again.

**Expected Results:**

* Step 1 reads `<available before>`.
* Step 4: the row reads Unsold and offers Relist.
* Step 6: `<listing_1>` reads Unsold, closed.
* Step 6: the listing says its stock was released on `<close date>`.
* Step 7 reads `<available after>`, `<available before>` plus `<held quantity>`.

### grade10-admin-auction-listing-US9-TC2-2: Sold and live listings show no released note or Relist

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_2>` is in no campaign and in the state the row states, holding `<held quantity>` units of `<product_2>`.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<product_2>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 4 units (any count) |

| Row | `<listing_2>` | Stock outcome |
| --- | --- | --- |
| Sold | Closed with a winner, its sale recorded | Hold moves to sold; available stays `<available before>` |
| Live | Published, its close still ahead | Hold stays; available stays `<available before>` |

**Steps:**

1. Read `<listing_2>`'s row in the Listings table.
2. Open `<listing_2>`.
3. Read the listing's stock note.
4. Read `<product_2>`'s available count on its product page.

**Expected Results:**

* Step 1: the row offers no Relist.
* Step 3 shows no released-stock note.
* Step 4 reads the row's stock outcome.

### grade10-admin-auction-listing-US9-TC3-2: Relist from the row opens a new draft holding stock on Save

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

* `<listing_3>` closed Unsold with no bids, in no campaign, and its hold is released.
* `<listing_3>` has never been relisted.
* `<product_3>` shows `<available before>` units available.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Unsold listing for `<product_3>` with `No Cert ID`, quantity `<quantity>`, a title, copy, starting price `<price>`, currency JPY, a gallery of three items, slug `<slug_3>`, listing code `<code_3>`, extension 600 seconds, a taxonomy category, a start and close, and a history |
| `<product_3>` | The product `<listing_3>` sold nothing of, regular stock without Cert IDs |
| `<quantity>` | 2 units (any quantity from 1 to 500) |
| `<price>` | JPY 8000 (any positive whole amount) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after Save>` | 3 units: `<available before>` minus `<quantity>` |

**Steps:**

1. Click Relist on `<listing_3>`'s row in the Listings table.
2. Read the new draft's form.
3. Read `<product_3>`'s available count on its product page.
4. Set a start and a close on the draft.
5. Click Save.
6. Read `<product_3>`'s available count again.
7. Return to <grade10 auction admin listings url>.
8. Read `<listing_3>`'s row.
9. Open `<listing_3>`.

**Expected Results:**

* Step 2 shows a new draft, not `<listing_3>`.
* Step 2: product `<product_3>`, `No Cert ID`, quantity `<quantity>`, and `<listing_3>`'s title and copy.
* Step 2: starting price `<price>`, currency JPY, the same gallery in the same order.
* Step 2: no start or close, no campaign, no bids, no history.
* Step 2: extension, taxonomy and sandbox read as on a new blank draft.
* Step 3 still reads `<available before>`.
* Step 5 saves a draft whose slug is not `<slug_3>` and whose listing code is not `<code_3>`.
* Step 6 reads `<available after Save>`, `<available before>` minus `<quantity>`.
* Step 8: the row still reads Unsold and offers no Relist.
* Step 9: `<listing_3>` still reads Unsold, closed, with its history.

### grade10-admin-auction-listing-US9-TC4-2: Relist is hidden from an admin without the operate grant

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

* `<listing_4>` closed Unsold in no campaign, its hold is released, and it has never been relisted.
* admin(reads listings, without `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An Unsold listing for `<product_4>`, quantity 1 |

**Steps:**

1. Read `<listing_4>`'s row in the Listings table.
2. Open `<listing_4>`.
3. Read the listing's actions.

**Expected Results:**

* Step 1: the row reads Unsold and shows no Relist, not even disabled.
* Step 3 shows no Relist.

### grade10-admin-auction-listing-US9-TC5-1: Clean-up frees each earlier Unsold hold once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* Seeded before this change shipped: `<listing_5>` and `<listing_6>` closed Unsold in no campaign, each still holding its stock.
* `<listing_7>` closed Unsold after this change shipped, its hold already released at the close.
* `<listing_8>` closed with a winner, its hold moved to sold.
* The one-time clean-up has not yet run.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | Closed Unsold with no bids on `<old close date>`, holding 2 units of `<product_5>` |
| `<listing_6>` | Closed Unsold after its top bid was demoted, holding 1 unit of `<product_5>` |
| `<listing_7>` | Closed Unsold on `<recent close date>`, 4 units of `<product_5>` already released |
| `<listing_8>` | Closed sold, 1 unit of `<product_5>` sold |
| `<product_5>` | 6 units available before the clean-up (any count) |
| `<available after>` | 9 units: 6 plus 2 plus 1 |
| `<old close date>` | A date before this change shipped |
| `<recent close date>` | A date after this change shipped, before the clean-up |
| `<clean-up date>` | The date the clean-up runs |

**Steps:**

1. Read `<listing_5>`'s row in the Listings table.
2. Read `<product_5>`'s available count on its product page.
3. Run the clean-up.
4. Read `<product_5>`'s available count again.
5. Reload <grade10 auction admin listings url>.
6. Read the rows of `<listing_5>` and `<listing_6>`.
7. Open `<listing_5>`.
8. Read the listing's stock note.
9. Open `<listing_7>`.
10. Read the listing's stock note.
11. Run the clean-up again.
12. Read `<product_5>`'s available count.

**Expected Results:**

* Step 1: the row offers no Relist.
* Step 2 reads 6.
* Step 4 reads `<available after>`, 6 plus the holds of `<listing_5>` and `<listing_6>`; `<listing_8>`'s unit stays sold.
* Step 6: both rows offer Relist.
* Step 8: the stock was released on `<clean-up date>`, not `<old close date>`.
* Step 10: the stock was released on `<recent close date>`, not repeated.
* Step 12 still reads `<available after>`.

### grade10-admin-auction-listing-US9-TC6-1: No note or Relist while the release is retried

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_9>` is published in no campaign with no bids, holding `<held quantity>` units of `<product_9>`, its close a few minutes away.
* The inventory release is made to fail until the tester lets it through.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published listing for `<product_9>`, quantity `<held quantity>`, no bids |
| `<product_9>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<available after>` | 5 units: `<available before>` plus `<held quantity>` |
| `<close time>` | `<listing_9>`'s scheduled close |

**Steps:**

1. Wait until `<close time>` passes.
2. Reload <grade10 auction admin listings url>.
3. Read `<listing_9>`'s row.
4. Open `<listing_9>`.
5. Read the listing's status and stock note.
6. Read `<product_9>`'s available count on its product page.
7. Let the inventory release through.
8. Wait for the next retry.
9. Reload `<listing_9>`.
10. Read the listing's stock note.
11. Return to <grade10 auction admin listings url>.
12. Read `<listing_9>`'s row.

**Expected Results:**

* Step 3: the row reads Unsold and offers no Relist.
* Step 5: `<listing_9>` reads Unsold, closed at `<close time>`, with no released-stock note.
* Step 6 reads `<available before>`.
* Step 10: the listing says its stock was released, dated the successful release.
* Step 12: the row offers Relist.

### grade10-admin-auction-listing-US9-TC7-1: Relist is not offered in a campaign or after call-off

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_10>` is in the state the row states, and its hold is released.
* `<listing_10>` has never been relisted.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_1>` | A campaign `<listing_10>` sits in |

| Row | `<listing_10>` | Row status |
| --- | --- | --- |
| In a campaign | Closed Unsold with no bids, in `<campaign_1>` | Unsold |
| Called off | Called off before its close, in no campaign | Canceled |

**Steps:**

1. Read `<listing_10>`'s row in the Listings table.
2. Open `<listing_10>`.
3. Read the listing's actions.

**Expected Results:**

* Step 1: the row reads the row's status and offers no Relist.
* Step 3 shows no Relist.

### grade10-admin-auction-listing-US9-TC8-1: Relist left unsaved stores nothing and stays offered

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_11>` closed Unsold in no campaign, its hold is released, and it has never been relisted.
* `<product_11>` shows `<available before>` units available.
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | An Unsold listing for `<product_11>`, quantity 1 |
| `<available before>` | 2 units (any count of at least 1) |

**Steps:**

1. Note the number of draft rows in the Listings table.
2. Click Relist on `<listing_11>`'s row.
3. Leave the draft editor without saving.
4. Read `<listing_11>`'s row.
5. Click Relist on `<listing_11>`'s row again.
6. Leave the draft editor without saving.
7. Read the Listings table.
8. Read `<product_11>`'s available count on its product page.

**Expected Results:**

* Step 2 opens the draft editor filled from `<listing_11>`.
* Step 4: the row still offers Relist.
* Step 5 opens another filled draft editor.
* Step 7 shows the same number of draft rows as step 1.
* Step 8 still reads `<available before>`.

### grade10-admin-auction-listing-US9-TC9-1: A second Relist editor saved after the first is refused

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_12>` closed Unsold in no campaign, its hold is released, and it has never been relisted.
* `<product_12>` shows `<available before>` units available.
* admin(holds `auction:operate`) has <grade10 auction admin listings url> open in two browser tabs.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An Unsold listing for `<product_12>`, quantity `<quantity>` |
| `<quantity>` | 3 units (any quantity from 1 to 500) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after>` | 2 units: `<available before>` minus `<quantity>` |

**Steps:**

1. In the first tab, click Relist on `<listing_12>`'s row.
2. In the second tab, click Relist on `<listing_12>`'s row.
3. In the first tab, set a start and a close, and click Save.
4. In the second tab, set a start and a close, and click Save.
5. Read the Listings table.
6. Read `<product_12>`'s available count on its product page.

**Expected Results:**

* Step 3 saves a new draft.
* Step 4 is refused as already relisted, and the editor stays open unsaved.
* Step 5 shows one new draft relisted from `<listing_12>`, and `<listing_12>`'s row offers no Relist.
* Step 6 reads `<available after>`.

## Settled

- **Refused relist Save** - the editor shows the refusal's name inline, such as Already relisted (Q15)
- **Relisted for good** - once a draft is saved from its Relist, the listing offers no second Relist, even if that draft is called off (Q18)

## Reconciliation

**Run:** QA2, 2026-09-30, after the anchors moved on Q10, Q13 and Q14. QA1's blind pass read the Feature set, the journeys, `decisions.md`, the proposal, the linked PRD sections, the durable suite and the domain suite with their Reconciliation stripped, and the two rulebooks; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both suites, both deltas, `tech-design.md` and `tasks.md`. It is a statement, not proof.

- **Raised, folded into spec** - a close whose only bids are `outbid`, its top bid demoted, releasing like one with no bids (`grade10-admin-auction-listing-US9-TC1-2`'s second row), as `grade10-admin-auction-listing-SC-146`, cited in tasks 3.1, 3.2 and 7.1; Relist on the row once released, outside a campaign, once per listing, as `grade10-admin-auction-listing-SC-137`, `grade10-admin-auction-listing-SC-141`, `grade10-admin-auction-listing-SC-142` and `grade10-admin-auction-listing-SC-143`; the note dated by the successful release, as `grade10-admin-auction-listing-SC-134`
- **Raised, escalated** - the words an operator reads when a relist Save is refused, landed as Q15, the refusal's name shown inline
- **Raised, rejected** - none this run; a Relist on a called-off listing stays refused by Q10
- **Joined** - `grade10-admin-auction-listing-SC-135` into `grade10-admin-auction-listing-US9-TC3-2`; `grade10-admin-auction-listing-SC-136` into `grade10-admin-auction-listing-US9-TC3-2` and `grade10-admin-auction-listing-US9-TC8-1`; `grade10-admin-auction-listing-SC-132` into `grade10-admin-auction-listing-US9-TC2-2`; `grade10-admin-auction-listing-SC-133` and `grade10-admin-auction-listing-SC-141` into `grade10-admin-auction-listing-US9-TC6-1`; `grade10-admin-auction-listing-SC-137` into `grade10-admin-auction-listing-US9-TC2-2` and `grade10-admin-auction-listing-US9-TC7-1`; `grade10-admin-auction-listing-SC-138` into `grade10-admin-auction-listing-US9-TC4-2`; `grade10-admin-auction-listing-SC-142` into `grade10-admin-auction-listing-US9-TC7-1`; `grade10-admin-auction-listing-SC-139` and `grade10-admin-auction-listing-SC-140` into `grade10-admin-auction-listing-US9-TC5-1`, the live listing's hold walked by `grade10-admin-inventory-catalog-US9-TC4-2`
- **Added by QA2** - `grade10-admin-auction-listing-US9-TC9-1` for `grade10-admin-auction-listing-SC-144`, two Relist editors on one listing, which no blind case reached
- **Out of suite** - `grade10-admin-auction-listing-SC-145`, a relist Save naming a sold, in-campaign or unreleased source: the row never offers Relist on one, so the refusals are decided by the relist save's service tests in grade10 (task 4.1)
- **Patched, not re-run** - `grade10-admin-auction-listing-US9-TC2-2`'s Sold row now records the sale, since a hold stays active after a winning close until the sale moves it to sold; `grade10-admin-auction-listing-US9-TC5-1` says "before this change shipped" where it said "before the release", which read as the stock release. Both keep `<v>`
- **Settled by the artifacts, not raised** - the listing attributes Relist carries (none: every field outside the Relist list starts as on a new draft, per the Relist requirement and the tech design); the listing's own page offering Relist (no: Q10 puts it on the row); a called-off relist draft freeing its source (no: the Relisted condition counts a saved listing, and a canceled draft stays saved); a called-off listing's note (none: the note belongs to a listing that closed with no winner)
- **Trimmed by the simpler reading** - the short-stock refusal on Relist Save, proved by the durable draft-save rule; the closed-listing-unchanged clause, held by `grade10-admin-auction-listing-US9-TC3-2`'s last step
- **Retired** - SC-131, a top bid under the reserve: no listing carries a reserve price, so the case cannot arise; its id is not reused
- **Restored** - the Purpose's gallery clause, to the wording `main` carries; no anchor or case moved
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-auction-listing-US-09` has nine cases; the group anchor `Unsold close` is walked by `grade10-admin-auction-listing-US9-TC1-2`, `grade10-admin-auction-listing-US9-TC2-2`, `grade10-admin-auction-listing-US9-TC5-1` and `grade10-admin-auction-listing-US9-TC6-1`
