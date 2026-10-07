# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner, or that the house bought in, to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

### grade10-admin-auction-listing-US9-TC10-1: Bought in reads apart from Unsold and from a sale

Runs once per row of **Test data**.

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

* `<listing_1>` is published in no campaign, holding `<held quantity>` units of `<product_1>`, and is bid on as the row states.
* `<listing_1>`'s close is a few minutes away, and no further bid is coming.
* admin(holds auction:reserve and auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing for `<product_1>`, quantity `<held quantity>`, in no campaign |
| `<product_1>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |

| Row | Bidding at the close | Listings table | Relist | Available after the close |
| --- | --- | --- | --- | --- |
| House wins | The house leads under a committed internal bid, over customer A | Bought in | Offered | `<available before>` plus `<held quantity>` |
| Collector beats the house | customer A leads over the house's committed internal bid | Not Bought in, not Unsold | Not offered | `<available before>` |
| Nobody bids | No bid and no internal bid | Unsold | Offered | `<available before>` plus `<held quantity>` |

**Steps:**

1. Wait until `<listing_1>`'s close passes, taking no action.
2. Reload <grade10 auction admin listings url> and read `<listing_1>`'s row.
3. Read `<product_1>`'s available count on its product page.

**Expected Results:**

* Step 2 reads the row's Listings table status and Relist.
* Step 3 reads the row's available count.

### grade10-admin-auction-listing-US9-TC11-1: The Bought in filter lists bought-in lots only

**Classification:**

* **Severity:** major
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

* `<listing_2>` closed with the house leading under its internal bid.
* `<listing_3>` closed with no bid and no internal bid.
* `<listing_4>` closed with customer A leading over the house's internal bid.
* admin(staff, holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A closed HKD listing the house bought in |
| `<listing_3>` | A closed HKD listing that closed Unsold |
| `<listing_4>` | A closed HKD listing customer A won |

**Steps:**

1. Select the Bought in filter.
2. Select the Unsold filter.
3. Select the Won filter.

**Expected Results:**

* Step 1 lists `<listing_2>`, and neither `<listing_3>` nor `<listing_4>`.
* Step 2 lists `<listing_3>`, not `<listing_2>`.
* Step 3 lists `<listing_4>`, not `<listing_2>`.

### grade10-admin-auction-listing-US9-TC12-1: A bought-in lot follows Unsold's Relist exclusions

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

* `<listing_5>` closed Bought in, its stock released, and is as the row states.
* admin(staff, holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A closed HKD listing the house bought in |

| Row | `<listing_5>` |
| --- | --- |
| In a campaign | Listed under a campaign |
| Already relisted | In no campaign; Relist was already used and its new draft saved |

**Steps:**

1. Read `<listing_5>`'s row in the Listings table.

**Expected Results:**

* Step 1: the row reads Bought in and offers no Relist.
