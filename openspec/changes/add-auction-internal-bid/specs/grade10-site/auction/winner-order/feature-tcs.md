# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-08, tcs-rules r4

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC48-1: A close with the house leading opens no order and sends no won letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `<listing_1>` is led as the row states, its recorded close a few minutes away, and no further bid is coming.
* customer A(signed in, holds a default shipping address, email alerts on) bid on `<listing_1>` as the row states.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in no campaign, starting price 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00), the listing's committed internal bid |

| Row | Bidding at the close | Orders for `<listing_1>` after the close | Auction-won letters for `<listing_1>` |
| --- | --- | --- | --- |
| House over a collector | The house leads at 508000 under `<house maximum>`, over customer A's maximum of 500000 | None | None |
| House alone | The house leads at 400000 under `<house maximum>`, with no collector bid | None | None |
| Collector over the house | customer A leads at 608000 with maximum 700000, over `<house maximum>` | One, customer A's, winning bid 608000 | One, to customer A |

**Steps:**

1. Wait until `<listing_1>`'s recorded close passes.
2. Read the orders the API holds for `<listing_1>`.
3. As customer A, read My Auctions' row for `<listing_1>` from the API.
4. Filter the send log by `<listing_1>` and read the rows from the close.

**Expected Results:**

* Step 2 reads the row's orders.
* Step 3: in a House row, no order is linked to customer A; in the Collector row, customer A's row links that one order.
* Step 4 reads the row's auction-won letters, and no row is addressed to the house.
