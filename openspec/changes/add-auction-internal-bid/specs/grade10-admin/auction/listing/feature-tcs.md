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
| Nobody bids | No bid; the internal bid was not placed at its time | Unsold | Offered | `<available before>` plus `<held quantity>` |

**Steps:**

1. Wait until `<listing_1>`'s close passes, taking no action.
2. Reload <grade10 auction admin listings url> and read `<listing_1>`'s row.
3. Read `<product_1>`'s available count on its product page.

**Expected Results:**

* Step 2 reads the row's Listings table status and Relist.
* Step 3 reads the row's available count.
