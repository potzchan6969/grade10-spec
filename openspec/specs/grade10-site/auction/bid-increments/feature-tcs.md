# grade10-site/auction/bid-increments Test Cases

**Status:** reopened · 2/31
**Reviewed:** 2026-09-22, tcs-rules r3.0, lapsed 2026-10-02
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-site-auction-bid-increments-SC-03, grade10-site-auction-bid-increments-SC-14

## Walk 1: Collector places a bid across a price tier

**Starting state:**

**Steps 1–2 setup:**

- An open USD listing, starting price `<starting price>`, with no accepted bid.
- A customer with a linked card is on that listing's page.

**Steps 3–4 setup:**

- An open USD listing has current public price `<current public price>`.
- The collector is enrolled and can bid.

**Steps 5–7 setup:**

- The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Steps 8–10 setup:**

- The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Steps 11–14 setup:**

- An open USD listing has starting price `<starting price>` and no accepted bid, and a customer with a linked card is on its page.

**Steps 15–17 setup:**

- An open USD listing has opening price `<opening price>` and no accepted bid, and a customer with a linked card is on its page.

**Steps 18–22 setup:**

- `<listing_1>` is open in USD, starting price `<ceiling>`, with no accepted bid.
- customer A and customer B are signed in with cards linked, on separate sessions.

**Steps 23–24 setup:**

- An open listing is available.

**Shared test data:**

**Steps 1–2 data:**

| `<starting price>` | `<minimum next amount>` | Fixture notes |
| --- | --- | --- |
| USD0 | USD1 | `<starting price>`: (fixed boundary); `<minimum next amount>`: (fixed minimum increment) |
| USD280 | USD280 | `<starting price>`: (range: 10000-49999 minor units); `<minimum next amount>`: (same as starting price) |
| USD100 | USD100 | `<starting price>`: (fixed tier boundary); `<minimum next amount>`: (same as starting price) |

**Steps 3–4 data:**

| `<current public price>` | `<increment>` | `<minimum next amount>` | Fixture notes |
| --- | ---: | ---: | --- |
| USD100 | USD5 | USD105 | `<current public price>`: (fixed tier boundary); `<increment>`: 500 USD minor units; `<minimum next amount>`: 10500 USD minor units |
| USD99.99 | USD1 | USD100.99 | `<current public price>`: (range: 100–9999 minor units); `<increment>`: 100 USD minor units; `<minimum next amount>`: 10099 USD minor units |
| USD500 | USD10 | USD510 | `<current public price>`: (fixed tier boundary); `<increment>`: 1000 USD minor units; `<minimum next amount>`: 51000 USD minor units |

**Steps 5–7 data:**

| `<minimum>` | `<bid amount>` | Fixture notes |
| --- | ---: | --- |
| USD105 | USD126 | `<minimum>`: (range: 10000–49999 minor units); `<bid amount>`: 12600 USD minor units |

**Steps 8–10 data:**

| `<minimum>` | `<bid amount>` | Fixture notes |
| --- | ---: | --- |
| USD105 | USD104.99 | `<minimum>`: (range: 10000–49999 minor units); `<bid amount>`: 10499 USD minor units |

**Steps 11–14 data:**

| `<starting price>` | `<first bid>` | `<increment>` | `<minimum next amount>` | `<higher bid>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| USD0 | USD1 | USD1 | USD2 | USD2.50 | `<first bid>`: (range: 100-9999 minor units); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |
| USD100 | USD100 | USD5 | USD105 | USD120 | `<starting price>`: (fixed tier boundary); `<first bid>`: (fixed tier boundary); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |

**Steps 15–17 data:**

| `<opening price>` | `<bid amount>` | Fixture notes |
| --- | --- | --- |
| USD1 | USD0.99 | `<opening price>`: (fixed minimum increment); `<bid amount>`: (fixed boundary) |
| USD100 | USD99 | `<opening price>`: (fixed tier boundary); `<bid amount>`: (fixed boundary) |
| USD105 | USD104.99 | `<opening price>`: (fixed opening price); `<bid amount>`: (one minor unit below minimum) |

**Steps 18–22 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured value) |

| Field | Value |
| --- | --- |
| listing_1 | An open USD listing at starting price `<ceiling>` with no accepted bid; bind its identity only |

### Route

1. Open the bid panel on the listing.
2. Read the minimum next amount.
   - The minimum next amount reads `<minimum next amount>`. `g10.auction-bid-increments.US1-TC1`
   - A positive start is its own minimum; a zero start uses the lowest USD increment. `g10.auction-bid-increments.US1-TC1`
3. Open the listing bid panel.
4. Place a bid of `<current public price>` plus `<increment>`.
   - The new public price is `<minimum next amount>`. `g10.auction-bid-increments.US1-TC2`
5. Open the listing bid panel.
6. Enter `<bid amount>` as the bid amount.
7. Confirm the bid.
   - The bid of `<bid amount>` is accepted. `g10.auction-bid-increments.US1-TC3`
8. Open the listing bid panel.
9. Enter `<bid amount>` as the bid amount.
10. Confirm the bid.
   - The bid of `<bid amount>` is refused. `g10.auction-bid-increments.US1-TC4`
   - The refusal names `<minimum>` as the minimum. `g10.auction-bid-increments.US1-TC4`
11. Enter `<first bid>` in the bid field and confirm it.
   - Step 11: the bid is accepted. `g10.auction-bid-increments.US1-TC6`
12. Read the minimum next amount.
   - Step 12: the next minimum reads `<minimum next amount>`, equal to `<first bid>` plus `<increment>`. `g10.auction-bid-increments.US1-TC6`
13. Enter `<higher bid>` and confirm it.
   - Step 13: the higher bid is accepted. `g10.auction-bid-increments.US1-TC6`
14. Read the highest bid.
   - Step 14: the highest bid is `<higher bid>`. `g10.auction-bid-increments.US1-TC6`
15. Enter `<bid amount>` in the custom maximum field.
16. Read the bid panel.
   - Step 16: the custom field says Min: `<opening price>`, and the bid action stays disabled. `g10.auction-bid-increments.US1-TC7`
17. Reload the listing page and read the bid panel.
   - The listing remains without an accepted bid, and the minimum remains `<opening price>`. `g10.auction-bid-increments.US1-TC7`
18. As customer A, submit a bid of `<ceiling>` on `<listing_1>`.
19. Read the API response.
   - Step 19: customer A's bid is accepted at `<ceiling>`. `g10.auction-bid-increments.US1-TC8`
20. As customer B, submit a bid of `<ceiling>` plus the increment at it.
21. Read the API response.
   - Step 21: customer B's bid is refused, naming the ceiling. `g10.auction-bid-increments.US1-TC8`
22. Read `<listing_1>`'s current bid, leader and bid count.
   - Step 22: current bid `<ceiling>`, customer A leads, bid count 1. `g10.auction-bid-increments.US1-TC8`
23. Open the listing.
24. Read the minimum next amount.
   - The minimum next amount is shown in USD. `g10.auction-bid-increments.US1-TC5`
   - No other currency is shown. `g10.auction-bid-increments.US1-TC5`

## Walk 2: Collector bids up to the ceiling

**Starting state:**

**Steps 1–3 setup:**

- The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.
- The bid amount `<bid amount>` equals `<ceiling>`.

**Steps 4–6 setup:**

- A live USD listing's minimum next bid is at or below `<ceiling>`; a linked-card customer is on the listing.

**Steps 7–8 setup:**

- A live USD listing has an accepted bid; a bid request sets maximum `<over ceiling>`, above `<ceiling>`.

**Steps 9–13 setup:**

- customer A leads the open USD listing at `<ceiling>`.
- customer B(card linked, account in good standing) can bid on the listing.
- The request is sent directly, bypassing the custom maximum field.

**Shared test data:**

**Steps 1–3 data:**

| `<minimum>` | `<ceiling>` | `<bid amount>` | Fixture notes |
| --- | ---: | ---: | --- |
| USD9,999,900 | USD10,000,000 | USD10,000,000 | `<minimum>`: (range: 1000000–1000000000 minor units); `<ceiling>`: 1000000000 USD minor units; `<bid amount>`: 1000000000 USD minor units |

**Steps 4–6 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured ceiling) |
| over ceiling | USD10,000,001 | (fixed boundary, one USD over) |

**Steps 7–8 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured ceiling) |
| over ceiling | USD10,000,001 | (fixed boundary, one USD over) |

**Steps 9–13 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured value) |
| bid amount | USD10,000,000.01 | (fixed boundary or equality) |

### Route

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.
   - The bid of `<bid amount>` is accepted. `g10.auction-bid-increments.US2-TC1`
4. Enter `<over ceiling>` as the custom maximum and confirm.
5. Read the refusal, highest bid, and bid count.
6. Read the customer's My Auctions row.
   - The bid is refused and names `<ceiling>` as the maximum. `g10.auction-bid-increments.US2-TC2`
   - Highest bid and bid count are unchanged. `g10.auction-bid-increments.US2-TC2`
   - No row appears for the listing. `g10.auction-bid-increments.US2-TC2`
7. Read the bid request result.
8. Read the listing's highest bid and the bidder's stored maximum.
   - The request is refused and names `<ceiling>`. `g10.auction-bid-increments.US2-TC3`
   - Neither highest bid nor stored maximum changes. `g10.auction-bid-increments.US2-TC3`
9. Read the listing's bid count and maximums.
10. As customer B, submit `<bid amount>` through the authenticated auction API.
11. Read the API response.
   - Step 11: the service refuses with `AMOUNT_TOO_HIGH`. `g10.auction-bid-increments.US2-TC4`
   - Step 11: `ceilingMinor` equals `<ceiling>`. `g10.auction-bid-increments.US2-TC4`
12. Read the listing's price, leader, bid count and maximums.
   - Step 12: price remains `<ceiling>` and customer A leads. `g10.auction-bid-increments.US2-TC4`
   - Step 12: bid count and maximums remain unchanged. `g10.auction-bid-increments.US2-TC4`
13. Read the operational refusal entry for this attempt.
   - Step 13: one entry names bidder, listing, code, amount and ceiling. `g10.auction-bid-increments.US2-TC4`

## Walk 3: Collector bids in USD on every listing

**Starting state:**

**Steps 1–2 setup:**

- Classification:**
- Severity:** critical
- Priority:** high
- Status:** draft
- Behaviour:** negative
- Type:** functional
- Suites:** regression
- Layer:** api
- Automation status:** manual
- Testability:** automation
- Trace:** grade10-site-auction-bid-increments-US-03

**Steps 3–4 setup:**

- An open USD listing with an accepted bid of `<current public price>` and no other currency.
- customer is signed in with a card linked and is on that listing's page.

**Steps 5–6 setup:**

- Two open listings have prices in different ranges of the same USD schedule.

**Steps 7–7 setup:**

- An open listing has a starting price, accepted bid and next minimum.

**Shared test data:**

**Steps 1–2 data:**

| `<currency>` |
| --- |
| EUR |
| HKD |
| JPY |

**Steps 3–4 data:**

| `<listing_setup>` | Why this row |
| --- | --- |
| A listing created in USD | The schedule as it always read |
| A listing created in HKD and overwritten to USD, amounts unchanged | A listing that existed before this change |

| Field | Value | Fixture notes |
| --- | --- | --- |
| current public price | USD8,000 | (800000 USD minor units, fixed scenario fixture) |
| increment | USD50 | (5000 USD minor units, fixed tier increment) |
| minimum next amount | USD8,050 | `<current public price>` plus `<increment>` |

### Route

1. Submit an auction price using `<currency>`.
2. Read the result and look for a created listing.
   - The price is refused. `g10.auction-bid-increments.US3-TC2`
   - No listing is created or priced in `<currency>`. `g10.auction-bid-increments.US3-TC2`
3. Open the bid panel on the listing prepared as follows: `<listing_setup>`.
4. Read the current bid and the minimum next amount.
   - The current bid reads `<current public price>` on both rows. `g10.auction-bid-increments.US3-TC3`
   - The minimum next amount reads `<minimum next amount>`, equal to `<current public price>` plus `<increment>`. `g10.auction-bid-increments.US3-TC3`
   - No HKD amount shows. `g10.auction-bid-increments.US3-TC3`
5. Open each listing and read its listed amount and minimum next bid.
6. Read the bid currency accepted by each bid panel.
   - Both listings show USD amounts and accept USD bids. `g10.auction-bid-increments.US3-TC1`
   - The minimum next bid follows the same USD schedule on both listings. `g10.auction-bid-increments.US3-TC1`
   - No HKD or JPY bid tier or amount appears. `g10.auction-bid-increments.US3-TC1`
7. Open the listing and read its price, highest bid and minimum next amount.
   - Each amount is shown in USD. `g10.auction-bid-increments.US3-TC4`
   - No other bid currency is shown. `g10.auction-bid-increments.US3-TC4`

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=2 covers=g10.auction-bid-increments.SC-vqb -->
### g10.auction-bid-increments.US1-TC1: Opening minimum on a priced start is the starting price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_1>`.
* `<listing_1>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_1 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | USD120 | (range: above 0 minor units) |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<starting price>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_1>` and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min equal to `<starting price>`, with no increment added.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<starting price>` and bid count 1.
* Step 4 shows the user's own bid in Recent Bids as You.

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=2 covers=g10.auction-bid-increments.SC-mn9 -->
### g10.auction-bid-increments.US1-TC2: Boundary price takes the higher tier

Runs once per row of **Test data**, and once for every configured tier after the first.

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_2>`.
* `<listing_2>` is live, its current bid is `<current bid>` and was placed by another user.
* The user holds no bid on `<listing_2>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_2 | A live listing with bids from other users, in USD; bind its identity only | · |

| Row | `<current bid>` | Tier that sets `<increment>` | `<minimum next bid>` |
| --- | --- | --- | --- |
| 1 | The lower bound of the configured tier under test (fixed boundary) | That tier, which owns its lower bound | `<current bid>` plus `<increment>` |
| 2 | One whole dollar below the lower bound of the tier under test (fixed boundary) | The tier just below it | `<current bid>` plus `<increment>` |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<minimum next bid>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_2>` and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min equal to `<minimum next bid>`, where `<increment>` is the configured increment of the tier named in the row.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<minimum next bid>` and the bid count one higher.

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC3: Amount above the minimum is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| `<minimum>` | `<bid amount>` | Fixture notes |
| --- | ---: | --- |
| USD105 | USD126 | `<minimum>`: (range: 10000–49999 minor units); `<bid amount>`: 12600 USD minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid of `<bid amount>` is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=2 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC4: Amount below the minimum is refused

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| `<minimum>` | `<bid amount>` | Fixture notes |
| --- | ---: | --- |
| USD105 | USD104 | `<minimum>`: (range: 10000–49999 minor units); `<bid amount>`: 10400 USD minor units, one whole dollar below `<minimum>` |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid of `<bid amount>` is refused.
* The refusal names `<minimum>` as the minimum.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=2 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC5: Every listing publishes the next minimum in USD

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open listing is available.

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in USD.
* No other currency is shown.

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=4 covers=g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t -->
### g10.auction-bid-increments.US1-TC6: First bid accepts the opening price then advances one tier

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing has starting price `<starting price>` and no accepted bid, and a customer with a linked card is on its page.

**Test data:**

| `<starting price>` | `<first bid>` | `<increment>` | `<minimum next amount>` | `<higher bid>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| USD0 | USD1 | USD1 | USD2 | USD3 | `<first bid>`: (range: 100-9999 minor units); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |
| USD100 | USD100 | USD5 | USD105 | USD120 | `<starting price>`: (fixed tier boundary); `<first bid>`: (fixed tier boundary); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |

**Steps:**

1. Enter `<first bid>` in the bid field and confirm it.
2. Read the minimum next amount.
3. Enter `<higher bid>` and confirm it.
4. Read the highest bid.

**Expected Results:**

* Step 1: the bid is accepted.
* Step 2: the next minimum reads `<minimum next amount>`, equal to `<first bid>` plus `<increment>`.
* Step 3: the higher bid is accepted.
* Step 4: the highest bid is `<higher bid>`.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=5 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC7: First bid below opening price is refused

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing has opening price `<opening price>` and no accepted bid, and a customer with a linked card is on its page.

**Test data:**

| `<opening price>` | `<bid amount>` | Fixture notes |
| --- | --- | --- |
| USD100 | USD99 | `<opening price>`: (fixed tier boundary); `<bid amount>`: (fixed boundary) |
| USD105 | USD104 | `<opening price>`: (fixed opening price); `<bid amount>`: (one whole dollar below `<opening price>`) |

**Steps:**

1. Enter `<bid amount>` in the custom maximum field.
2. Read the bid panel.
3. Reload the listing page and read the bid panel.

**Expected Results:**

* Step 2: the custom field says Min: `<opening price>`, and the bid action stays disabled.
* The listing remains without an accepted bid, and the minimum remains `<opening price>`.

<!-- trace:case id=g10.auction-bid-increments.TC-4ox rev=3 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US1-TC8: Listing starting at the ceiling takes one first bid there

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_1>` is open in USD, starting price `<ceiling>`, with no accepted bid.
* customer A and customer B are signed in with cards linked, on separate sessions.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured value) |

| Field | Value |
| --- | --- |
| listing_1 | An open USD listing at starting price `<ceiling>` with no accepted bid; bind its identity only |

**Steps:**

1. As customer A, submit a bid of `<ceiling>` on `<listing_1>`.
2. Read the API response.
3. As customer B, submit a bid of `<ceiling>` plus the increment at it.
4. Read the API response.
5. Read `<listing_1>`'s current bid, leader and bid count.

**Expected Results:**

* Step 2: customer A's bid is accepted at `<ceiling>`.
* Step 4: customer B's bid is refused, naming the ceiling.
* Step 5: current bid `<ceiling>`, customer A leads, bid count 1.

<!-- trace:case id=g10.auction-bid-increments.TC-ujz rev=1 covers=g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC9: Opening minimum on a zero start is the lowest configured increment

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_3>`.
* `<listing_3>` is live, holds no bids, and its starting price is `<zero start>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_3 | A live listing with no bids, in USD; bind its identity only | · |
| zero start | USD0 | (fixed boundary), a start of 0 minor units |
| lowest increment | The configured increment of the lowest tier, the tier that holds 0 | (fixed configured value) |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<lowest increment>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_3>` and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min equal to `<lowest increment>`.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<lowest increment>` and bid count 1.

<!-- trace:case id=g10.auction-bid-increments.TC-de8 rev=1 covers=g10.auction-bid-increments.SC-xjw -->
### g10.auction-bid-increments.US1-TC10: Next minimum adds the increment of the tier holding the current bid

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_4>`.
* `<listing_4>` is live, its current bid is `<current bid>` and was placed by another user.
* The user holds no bid on `<listing_4>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_4 | A live listing with bids from other users, in USD; bind its identity only | · |

| Row | Tier of `<current bid>` | `<current bid>` | `<increment>` | `<minimum next bid>` | `<bid below minimum>` |
| --- | --- | --- | --- | --- | --- |
| 1 | The lowest tier, from 0 | A price inside that tier, above 0 (range: within the tier) | The configured increment of that tier | `<current bid>` plus `<increment>` | One whole dollar below `<minimum next bid>` |
| 2 | A configured tier above the lowest and below the last tier | A price inside that tier, away from both bounds (range: within the tier) | The configured increment of that tier | `<current bid>` plus `<increment>` | One whole dollar below `<minimum next bid>` |
| 3 | The unbounded last tier | A price inside the last tier, above its lower bound (range: above the lower bound) | The configured increment of the last tier | `<current bid>` plus `<increment>` | One whole dollar below `<minimum next bid>` |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<bid below minimum>` in the bid field.
3. Read the bid form.
4. Enter `<minimum next bid>` in the bid field.
5. Click **Place Bid**.
6. Reload `<listing_4>` and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min equal to `<minimum next bid>`.
* Step 3 shows the bid cannot be placed, and nothing is recorded.
* Step 5 accepts the bid.
* Step 6 reads Highest bid `<minimum next bid>`, the bid count one higher, and the user's own bid in Recent Bids as You.

<!-- trace:case id=g10.auction-bid-increments.TC-d1v rev=1 -->
### g10.auction-bid-increments.US1-TC11: A maximum is beaten at the beaten maximum plus its own tier's increment

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_5>`.
* `<listing_5>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_5 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | USD120 | (range: above 0 minor units), below every `<user B maximum>` |
| user A maximum | A price in a configured tier above the tier of `<user B maximum>`, with a different increment | (range: within that tier) |

| Row | `<user B maximum>` | Tier that sets `<increment>` | `<resolved price>` |
| --- | --- | --- | --- |
| 1 | A price inside one configured tier, away from both bounds (range: within the tier) | That tier, the tier of `<user B maximum>` | `<user B maximum>` plus `<increment>` |
| 2 | The lower bound of a configured tier above the lowest (fixed boundary) | That tier, which owns its lower bound | `<user B maximum>` plus `<increment>` |

**Steps:**

1. As user A, set a maximum of `<user A maximum>` and confirm.
2. As user B, set a maximum of `<user B maximum>` and confirm.
3. As user A, reload `<listing_5>` and read Highest bid and Recent Bids.

**Expected Results:**

* After step 1 user A leads at `<starting price>`.
* After step 2 user A still leads.
* Step 3 reads Highest bid `<resolved price>`, equal to `<user B maximum>` plus `<increment>`, not plus the increment at `<user A maximum>`.
* Step 3 shows no bid recorded at an amount between `<user B maximum>` and `<resolved price>`.

<!-- trace:case id=g10.auction-bid-increments.TC-fjl rev=1 -->
### g10.auction-bid-increments.US1-TC12: A maximum answers a manual bid at that bid plus its tier's increment

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_6>`.
* `<listing_6>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_6 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | A price inside a configured tier above the lowest tier, away from both bounds | (range: within that tier) |
| user A maximum | A price at least two tiers above `<starting price>` | (range: above the tier of `<starting price>`) |
| increment | The configured increment of the tier holding `<starting price>` | (fixed configured value) |
| resolved price | `<starting price>` plus `<increment>` | (fixed derived value) |

**Steps:**

1. As user A, set a maximum of `<user A maximum>` and confirm.
2. As user B, read Min on the bid panel.
3. As user B, enter `<starting price>` in the bid field and click **Place Bid**.
4. As user A, reload `<listing_6>` and read Highest bid, Your maximum and the bid count.

**Expected Results:**

* Step 2 reads Min equal to `<starting price>`.
* Step 4 reads Highest bid `<resolved price>`, equal to `<starting price>` plus `<increment>`.
* Step 4 shows user A still leads, with Your maximum `<user A maximum>`.

<!-- trace:case id=g10.auction-bid-increments.TC-gxd rev=1 covers=g10.auction-bid-increments.SC-a64,g10.auction-bid-increments.SC-bj0 -->
### g10.auction-bid-increments.US1-TC13: A schedule change moves an open listing's minimum and keeps its standing bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_7>` is open, in USD, and led by user A at `<standing bid>` with a maximum of `<standing maximum>`.
* Two schedules are available to the minimum calculation: `<schedule A>` and `<schedule B>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_7 | An open USD listing led by user A, with recorded bids; bind its identity only | · |
| standing bid | A price inside a configured tier, away from both bounds | (range: within that tier) |
| standing maximum | A price above `<standing bid>` | (range: any amount above `<standing bid>`) |
| schedule A | The configured schedule | (fixed configured value) |
| old increment | The increment `<schedule A>` gives the tier holding `<standing bid>` | (fixed configured value) |
| schedule B | `<schedule A>` with the increment of the tier holding `<standing bid>` changed to `<new increment>` | (fixed, a second schedule, never the deployed file) |
| new increment | A positive whole-dollar amount different from `<old increment>` | (range: any such amount) |

**Steps:**

1. Read `<listing_7>`'s current bid, leader, maximum, bid count and recorded bids.
2. Read `<listing_7>`'s minimum next amount under `<schedule A>`.
3. Read `<listing_7>`'s minimum next amount under `<schedule B>`, with nothing written to `<listing_7>` between the reads.
4. Read `<listing_7>`'s current bid, leader, maximum, bid count and recorded bids again.

**Expected Results:**

* Step 2 reads `<standing bid>` plus `<old increment>`.
* Step 3 reads `<standing bid>` plus `<new increment>`, though `<listing_7>` was already open and holds no change of its own.
* Step 4 reads the same current bid `<standing bid>`, the same leader, the same maximum `<standing maximum>`, the same bid count and the same recorded bids as step 1.

<!-- trace:case id=g10.auction-bid-increments.TC-f10 rev=1 covers=g10.auction-bid-increments.SC-w3o -->
### g10.auction-bid-increments.US1-TC14: A bid at the old minimum is refused after a schedule change

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_8>` is open, in USD, and led by user A at `<standing bid>`.
* User B is signed in with `<card>` saved, and the minimum user B last read on `<listing_8>` is `<old minimum>`.
* `<schedule B>` is in force, and its increment for the tier holding `<standing bid>` is larger than `<schedule A>`'s.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_8 | An open USD listing led by user A; bind its identity only | · |
| standing bid | A price inside a configured tier, away from both bounds | (range: within that tier) |
| schedule A | The configured schedule | (fixed configured value) |
| old minimum | `<standing bid>` plus the increment `<schedule A>` gives that tier | (fixed derived value) |
| schedule B | `<schedule A>` with the increment of that tier raised to `<new increment>` | (fixed, a second schedule, never the deployed file) |
| new increment | A whole-dollar amount larger than the increment in `<schedule A>` | (range: any such amount) |
| new minimum | `<standing bid>` plus `<new increment>` | (fixed derived value) |

**Steps:**

1. As user B, submit a bid of `<old minimum>` on `<listing_8>`.
2. Read the API response.
3. Read `<listing_8>`'s current bid, leader and bid count.

**Expected Results:**

* Step 2 shows the bid is refused and names `<new minimum>` as the minimum.
* Step 3 reads current bid `<standing bid>`, user A leading, and the bid count as before step 1.

<!-- trace:case id=g10.auction-bid-increments.TC-epf rev=1 covers=g10.auction-bid-increments.SC-ywg -->
### g10.auction-bid-increments.US1-TC15: A resolved price reads the schedule in force and a later change leaves it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_9>` is open, in USD, and led by user A with a maximum of `<user A maximum>`.
* User B is signed in with `<card>` saved and holds no bid on `<listing_9>`.
* `<schedule A>` is in force.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_9 | An open USD listing led by user A; bind its identity only | · |
| user A maximum | A price in a configured tier above the tier of `<user B maximum>` | (range: within that tier) |
| user B maximum | A price at least the minimum next amount and below `<user A maximum>`, inside one configured tier | (range: within that tier) |
| schedule A | The configured schedule | (fixed configured value) |
| increment | The increment `<schedule A>` gives the tier holding `<user B maximum>` | (fixed configured value) |
| resolved price | `<user B maximum>` plus `<increment>`, capped at `<user A maximum>` | (fixed derived value) |
| schedule B | `<schedule A>` with the increment of the tier holding `<user B maximum>` changed to another positive whole-dollar amount | (fixed, a second schedule, never the deployed file) |

**Steps:**

1. As user B, commit a maximum of `<user B maximum>` on `<listing_9>`.
2. Read `<listing_9>`'s current bid, leader and the recorded bids.
3. Put `<schedule B>` in force.
4. Read `<listing_9>`'s current bid, leader and the recorded bids again.

**Expected Results:**

* Step 2 reads current bid `<resolved price>`, equal to `<user B maximum>` plus `<increment>`, with user A leading.
* Step 4 reads the same current bid `<resolved price>`, the same leader and the same recorded bids as step 2.

<!-- trace:case id=g10.auction-bid-increments.TC-ht2 rev=1 covers=g10.auction-bid-increments.SC-cx4 -->
### g10.auction-bid-increments.US1-TC16: A bid with cents is refused

The bid panel's amount field keeps whole dollars and cannot type cents, so the route is a direct call to the bid API.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_14>` is open, in USD, and led by user A at `<standing bid>`, with a maximum of `<standing maximum>`.
* User B is signed in with `<card>` saved and holds no bid on `<listing_14>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_14 | An open USD listing led by user A; bind its identity only | · |
| standing bid | A whole-dollar price inside a configured tier | (range: within that tier) |
| standing maximum | A whole-dollar amount above `<standing bid>` | (range: any such amount) |
| minimum next bid | `<standing bid>` plus the configured increment of its tier | (fixed derived value), a whole-dollar amount |
| bid with cents | `<minimum next bid>` plus one minor unit | (fixed boundary), the smallest amount above the minimum that is not whole dollars |

**Steps:**

1. As user B, submit a bid of `<bid with cents>` on `<listing_14>` through the bid API.
2. Read the API response.
3. Read `<listing_14>`'s current bid, leader, maximum, bid count and recorded bids.
4. As user B, submit a bid of `<minimum next bid>` on `<listing_14>`.

**Expected Results:**

* Step 2 shows the bid is refused and names the whole-dollar rule.
* Step 3 reads current bid `<standing bid>`, user A leading with maximum `<standing maximum>`, the bid count as before step 1, and no recorded bid at `<bid with cents>`.
* Step 4 accepts the bid, so the refusal was for the cents and not for user B's standing.

<!-- trace:case id=g10.auction-bid-increments.TC-jbt rev=1 covers=g10.auction-bid-increments.SC-kc7 -->
### g10.auction-bid-increments.US1-TC17: A starting price with cents is refused

The listing editor's money field takes cents, so the route is the editor itself.

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An operator is signed in to the console and is on the editor of `<listing_15>`.
* `<listing_15>` is a draft in USD with a starting price of `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_15 | A draft listing in USD; bind its identity only | · |
| starting price | USD120 | (range: any whole-dollar amount) |
| starting price with cents | USD120.50 | (fixed boundary), a starting price that is not whole dollars |

**Steps:**

1. Enter `<starting price with cents>` in the starting price field and save the draft.
2. Read the starting price field and the message beside it.
3. Reload the editor and read the starting price.
4. Enter `<starting price>` and save the draft.

**Expected Results:**

* Step 2 shows the save is refused and the message names the whole-dollar rule.
* Step 3 reads `<starting price>`, the value before step 1.
* Step 4 saves the draft, so the refusal was for the cents.

<!-- trace:case id=g10.auction-bid-increments.TC-t8w rev=1 covers=g10.auction-bid-increments.SC-y9s -->
### g10.auction-bid-increments.US1-TC18: A consignment ask with cents makes no listing

The route is the consignment sync, reached through the API, because no screen of this capability makes a listing from an ask.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<ask_1>` is a consignment ask for the auction with a price of `<price with cents>` and no listing.
* `<ask_2>` is a consignment ask for the auction with a price of `<whole price>` and no listing.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ask_1 | A consignment ask for the auction; bind its identity only | · |
| ask_2 | A consignment ask for the auction; bind its identity only | · |
| whole price | USD120 | (range: any whole-dollar amount) |
| price with cents | USD120.01 | (fixed boundary), one minor unit above a whole dollar |

**Steps:**

1. Run the sync that makes a listing from `<ask_1>`.
2. Read the sync's result and the listing of `<ask_1>`.
3. Run the sync that makes a listing from `<ask_2>`.
4. Read the listing of `<ask_2>`.

**Expected Results:**

* Step 1 is refused and names the whole-dollar rule.
* Step 2 reads no listing for `<ask_1>`, and `<ask_1>` is unchanged.
* Step 4 reads a draft listing with a starting price of `<whole price>`, so the refusal was for the cents.

<!-- trace:case id=g10.auction-bid-increments.TC-0es rev=1 covers=g10.auction-bid-increments.SC-n5d -->
### g10.auction-bid-increments.US1-TC19: A stored starting price with cents opens at the next whole dollar

The row is seeded in the database, because no screen saves a starting price with cents.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_14>`.
* `<listing_14>` is live, holds no bids, and was stored with a starting price of `<stored price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_14 | A live listing with no bids, in USD, seeded with a starting price that has cents; bind its identity only | · |
| stored price | USD120.50 | (fixed boundary), between two whole dollars |
| opening minimum | USD121 | (fixed derived value), the next whole dollar at or above `<stored price>` |

**Steps:**

1. Read the starting price and Min on the bid panel.
2. Enter `<opening minimum>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_14>` and read the starting price, Highest bid and the bid count.

**Expected Results:**

* Step 1 reads the starting price `<stored price>` and Min `<opening minimum>`.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<opening minimum>`, bid count 1, and the starting price still `<stored price>`.

<!-- trace:case id=g10.auction-bid-increments.TC-hx9 rev=1 covers=g10.auction-bid-increments.SC-r3d -->
### g10.auction-bid-increments.US1-TC20: A house maximum in extended bidding steps on the same schedule

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_11>` is open, in USD, in extended bidding, and led by user A with a maximum of `<user A maximum>`.
* A house maximum of `<house maximum>` is saved on `<listing_11>` and its commit time has come.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_11 | An open USD listing in extended bidding, led by user A; bind its identity only | · |
| user A maximum | A price in a configured tier above the tier of `<house maximum>` | (range: within that tier) |
| house maximum | A price at least the minimum next amount and below `<user A maximum>`, inside one configured tier | (range: within that tier) |
| increment | The configured increment of the tier holding `<house maximum>` | (fixed configured value) |
| resolved price | `<house maximum>` plus `<increment>`, capped at `<user A maximum>` | (fixed derived value) |
| next increment | The configured increment of the tier holding `<resolved price>` | (fixed configured value) |

**Steps:**

1. Read `<listing_11>`'s minimum next amount.
2. Let the house maximum commit on `<listing_11>`.
3. Read `<listing_11>`'s current bid and leader.
4. Read `<listing_11>`'s minimum next amount again.

**Expected Results:**

* Step 1 reads a minimum at or below `<house maximum>`.
* Step 2 accepts the house maximum.
* Step 3 reads current bid `<resolved price>`, equal to `<house maximum>` plus `<increment>`, with user A leading.
* Step 4 reads `<resolved price>` plus `<next increment>`, the same lookup a collector's bid reads outside extended bidding.

---

## g10.auction-bid-increments.US2: Collector bids up to the ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-xdy rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC1: Bid equal to the ceiling is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

* The bid amount `<bid amount>` equals `<ceiling>`.

**Test data:**

| `<minimum>` | `<ceiling>` | `<bid amount>` | Fixture notes |
| --- | ---: | ---: | --- |
| USD9,999,900 | USD10,000,000 | USD10,000,000 | `<minimum>`: (range: 1000000–1000000000 minor units); `<ceiling>`: 1000000000 USD minor units; `<bid amount>`: 1000000000 USD minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid of `<bid amount>` is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=3 covers=g10.auction-bid-increments.SC-hm3 -->
### g10.auction-bid-increments.US2-TC2: Direct bid above USD ceiling is refused without effects

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
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* A live USD listing's minimum next bid is at or below `<ceiling>`; a linked-card customer is on the listing.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured ceiling) |
| over ceiling | USD10,000,001 | (fixed boundary, one USD over) |

**Steps:**

1. Enter `<over ceiling>` as the custom maximum and confirm.
2. Read the refusal, highest bid, and bid count.
3. Read the customer's My Auctions row.

**Expected Results:**

* The bid is refused and names `<ceiling>` as the maximum.
* Highest bid and bid count are unchanged.
* No row appears for the listing.

<!-- trace:case id=g10.auction-bid-increments.TC-dfw rev=3 covers=g10.auction-bid-increments.SC-xnb -->
### g10.auction-bid-increments.US2-TC3: Auto-bid maximum above USD ceiling is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* A live USD listing has an accepted bid; a bid request sets maximum `<over ceiling>`, above `<ceiling>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured ceiling) |
| over ceiling | USD10,000,001 | (fixed boundary, one USD over) |

**Steps:**

1. Read the bid request result.
2. Read the listing's highest bid and the bidder's stored maximum.

**Expected Results:**

* The request is refused and names `<ceiling>`.
* Neither highest bid nor stored maximum changes.

<!-- trace:case id=g10.auction-bid-increments.TC-dlk rev=3 covers=g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC4: Listing at the ceiling refuses a further direct bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer A leads the open USD listing at `<ceiling>`.
* customer B(card linked, account in good standing) can bid on the listing.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| ceiling | USD10,000,000 | (fixed configured value) |
| bid amount | USD10,000,000.01 | (fixed boundary or equality) |

**Steps:**

1. Read the listing's bid count and maximums.
2. As customer B, submit `<bid amount>` through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals `<ceiling>`.
* Step 4: price remains `<ceiling>` and customer A leads.
* Step 4: bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

---

## g10.auction-bid-increments.US3: Collector bids in USD on every lot

**As a** collector,
**I want** every lot priced and bid in USD with one increment schedule,
**so that** I compare lots and place bids in one unit.

<!-- trace:case id=g10.auction-bid-increments.TC-y0l rev=1 -->
### g10.auction-bid-increments.US3-TC1: Every open listing prices and bids in USD on one schedule

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* Two open listings have prices in different ranges of the same USD schedule.

**Steps:**

1. Open each listing and read its listed amount and minimum next bid.
2. Read the bid currency accepted by each bid panel.

**Expected Results:**

* Both listings show USD amounts and accept USD bids.
* The minimum next bid follows the same USD schedule on both listings.
* No HKD or JPY bid tier or amount appears.

<!-- trace:case id=g10.auction-bid-increments.TC-fdc rev=1 covers=g10.auction-bid-increments.SC-60d,g10.auction-bid-increments.SC-5ea,g10.auction-bid-increments.SC-gq8 -->
### g10.auction-bid-increments.US3-TC2: Non-USD currency cannot price an auction

Runs once per row of **Test data**.

**Pre-conditions:**

None.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-03

**Test data:**

| `<currency>` |
| --- |
| EUR |
| HKD |
| JPY |

**Steps:**

1. Submit an auction price using `<currency>`.
2. Read the result and look for a created listing.

**Expected Results:**

* The price is refused.
* No listing is created or priced in `<currency>`.

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=2 covers=g10.auction-bid-increments.SC-tke -->
### g10.auction-bid-increments.US3-TC3: A listing that was priced in HKD before the overwrite bids on the USD schedule

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_10>`.
* `<listing_10>` is open in USD, has an accepted bid of `<current bid>` and carries no other currency.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| current bid | USD8,000 | (range: above 0 minor units) |
| increment | The configured increment of the tier holding `<current bid>` | (fixed configured value) |

| Row | `<listing_10>` | Why this row |
| --- | --- | --- |
| 1 | A listing created in USD | The schedule as it always read |
| 2 | A listing created in HKD and overwritten to USD, amounts unchanged | A listing that existed before this change |

**Steps:**

1. Open the bid panel on `<listing_10>`.
2. Read Highest bid and Min.

**Expected Results:**

* Step 2 reads Highest bid `<current bid>` in USD on both rows.
* Step 2 reads Min equal to `<current bid>` plus `<increment>`, in USD.
* No HKD amount shows.

<!-- trace:case id=g10.auction-bid-increments.TC-pn8 rev=2 covers=g10.auction-bid-increments.SC-ws7 -->
### g10.auction-bid-increments.US3-TC4: Open listing publishes amounts as USD

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* An open listing has a starting price, accepted bid and next minimum.

**Steps:**

1. Open the listing and read its price, highest bid and minimum next amount.

**Expected Results:**

* Each amount is shown in USD.
* No other bid currency is shown.

<!-- trace:case id=g10.auction-bid-increments.TC-hod rev=1 covers=g10.auction-bid-increments.SC-p50 -->
### g10.auction-bid-increments.US3-TC5: Two listings at one price share one increment

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved.
* `<listing_11>` and `<listing_12>` are live, in different categories, with different starting prices.
* Each of them has the current bid `<current bid>`, placed by another user.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_11 | A live listing in USD, in its own category, with bids from other users; bind its identity only | · |
| listing_12 | A live listing in USD, in another category, with bids from other users; bind its identity only | · |
| current bid | A price inside a configured tier above the lowest tier, away from both bounds | (range: within that tier) |
| increment | The configured increment of the tier holding `<current bid>` | (fixed configured value) |
| minimum next bid | `<current bid>` plus `<increment>` | (fixed derived value) |

**Steps:**

1. Navigate to `<listing_11>` and read Highest bid and Min.
2. Navigate to `<listing_12>` and read Highest bid and Min.

**Expected Results:**

* Step 1 reads Highest bid `<current bid>` and Min `<minimum next bid>`.
* Step 2 reads Highest bid `<current bid>` and Min `<minimum next bid>`.
* Both listings use the same increment, though their starting prices and categories differ.

<!-- trace:case id=g10.auction-bid-increments.TC-zdo rev=1 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US3-TC6: Bid surfaces read in USD from the field to the record

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_13>`.
* `<listing_13>` is live, in USD, and its current bid is `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_13 | A live listing in USD with bids from other users; bind its identity only | · |
| current bid | A price inside a configured tier above the lowest tier | (range: within that tier) |
| minimum next bid | `<current bid>` plus the configured increment of its tier | (fixed derived value) |

**Steps:**

1. Read Highest bid, Min and the currency of the bid field.
2. Enter `<minimum next bid>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_13>` and read Highest bid and Recent Bids.

**Expected Results:**

* Step 1 reads Highest bid and Min in USD, and the bid field takes USD.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<minimum next bid>` in USD, and the user's own bid in Recent Bids in USD.

<!-- trace:case id=g10.auction-bid-increments.TC-c9i rev=1 covers=g10.auction-bid-increments.SC-bs0 -->
### g10.auction-bid-increments.US3-TC7: The configured schedule starts at 0 and its last tier is unbounded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* The USD schedule in force for every auction is configured.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| zero amount | USD0 | (fixed boundary), 0 minor units |
| large amount | USD10,000,000 | (fixed boundary), the ceiling, above the lower bound of every tier |

**Steps:**

1. Read the configured USD schedule.
2. Select the tier for `<zero amount>`.
3. Select the tier for `<large amount>`.
4. Compare each tier's lower bound with the one before it.
5. Select the tier for each tier's lower bound, and for the amount one whole dollar below it.

**Expected Results:**

* Step 1 reads one schedule for USD, with no per-listing schedule beside it.
* Step 2 selects the first tier, whose lower bound is 0, so no amount lies below it.
* Step 3 selects the last tier, which has no upper bound.
* Step 4 reads lower bounds in strictly rising order.
* Step 5 selects the tier that owns the lower bound, and the tier before it for the amount one whole dollar below, so every amount from 0 upward falls in exactly one tier.

## Settled

- Before any accepted bid the minimum is the opening price: the starting price, or the currency's lowest increment on a 0 start. From the first accepted bid, the current bid plus its tier increment applies.
- A first bid of 0, or of one minor unit, is a non-goal; no case asserts either.
- Where a lone maximum above the opening price stands is the auto-bidding suite's; this suite asserts only the minimum.
- The custom field stops or corrects oversized entry at the currency ceiling. Service refusal cases send amounts directly; the service ceiling and refusal remain unchanged (Q1, Q4).

### Archived fold records

- Archived suites are reconciliation evidence only; they are not regeneration input.
- **2026-09-16-cap-auction-bid-amount** — `grade10-site-auction-bid-increments-US1-TC1-1` → `g10.auction-bid-increments.US1-TC1`; `grade10-site-auction-bid-increments-US1-TC2-1` → `g10.auction-bid-increments.US1-TC2`; `grade10-site-auction-bid-increments-US1-TC3-1` → `g10.auction-bid-increments.US1-TC3`; `grade10-site-auction-bid-increments-US1-TC4-1` → `g10.auction-bid-increments.US1-TC4`; `grade10-site-auction-bid-increments-US1-TC5-1` → `g10.auction-bid-increments.US1-TC5`; `grade10-site-auction-bid-increments-US2-TC1-1` → `g10.auction-bid-increments.US2-TC1`; `grade10-site-auction-bid-increments-US2-TC2-1` → `g10.auction-bid-increments.US2-TC2`; `grade10-site-auction-bid-increments-US2-TC3-1` → `g10.auction-bid-increments.US2-TC3`; `grade10-site-auction-bid-increments-US2-TC4-1` → `g10.auction-bid-increments.US2-TC4`
- **2026-10-02-relay-auction-live-state** — `grade10-site-auction-bid-increments-US1-TC1-2` → `g10.auction-bid-increments.US1-TC1`; `grade10-site-auction-bid-increments-US1-TC6-1` → `g10.auction-bid-increments.US1-TC6`; `grade10-site-auction-bid-increments-US1-TC7-1` → `g10.auction-bid-increments.US1-TC7`; `grade10-site-auction-bid-increments-US1-TC8-1` → `g10.auction-bid-increments.US1-TC8`
- **2026-10-07-cap-custom-maximum-entry** — `grade10-site-auction-bid-increments-US1-TC8-2` → `g10.auction-bid-increments.US1-TC8`; `grade10-site-auction-bid-increments-US2-TC3-2` → `g10.auction-bid-increments.US2-TC3`
- None this run. Every blind reading either folded into a scenario or went to `decisions.md` `## Raised`.
- A first bid is accepted at the opening price: the starting price, or the lowest configured increment on a 0 start. From the first accepted bid, the current bid plus the increment of its tier applies.
- An open page's Min refreshes on its next read or bid attempt, not live; a bid or a maximum below the minimum the server now holds is refused, names that minimum, and records nothing (Q7).
- A standing maximum reads the schedule in force each time it answers a bid; it keeps its amount and the earlier resolutions stand (Q8).
- A bid, a maximum, every tier bound and every increment are whole-dollar amounts; a bid with cents is refused, naming the rule, and nothing moves. One whole dollar below a bound is in the lower tier, and one whole dollar below the minimum is below it (Q9, the product manager's answer).
- A starting price an operator sets, or a consignment ask sets, is a whole-dollar amount; one with cents is refused, naming the rule, and the listing is unchanged or not made (Q16 and Q19, the product manager's answers). A starting price already stored with cents is left as it is (Q18) and opens at the next whole dollar at or above it, while the page still shows the stored price (Q20); `US1-TC19` drives it. A consignment screen refuses a floor with cents on entry (Q21); `add-consignment` owns that screen, so no case here drives it.
- Every bid surface reads USD only; a USD fact becomes HKD only at settlement (Q10).
- A house maximum and an extended-bidding bid read the same schedule as any bid (Q11); `SC-27` states it and `US1-TC20` drives it.
- A configured schedule is held valid by a test that runs in CI: a tier from 0, ascending tiers with no shared lower bound, whole-dollar tier bounds, positive whole-dollar increments (Q9), a non-empty list and an unbounded last tier. No runtime check refuses a bad file, and no scenario or case drives one (Q12, the product manager's answer).
- The lowest tier is configured like any other: the opening minimum on a 0 start is the lowest configured increment, and no case or scenario fixes it at one value (Q13, the product manager's answer).
- The neighbouring capabilities' worked amounts are examples under another set of configuration values; their suites are not rewritten here (Q14, the product manager's answer).

## Reconciliation

**Run:** QA2 reconciliation 2026-10-01, rerun after Q28 and Q35, for change `relay-auction-live-state`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-01`. Read the change's `proposal.md`, `decisions.md` (Q16 to Q30), `tech-design.md`, `tasks.md`, this delta `spec.md`, `user-journeys.md` and `domain-tcs.md`. QA1 had read the frozen anchors only.

| Finding | Disposition |
| --- | --- |
| Before any bid the minimum is the opening price: the starting price on a positive start, below the lowest increment included, and the lowest increment on a 0 start | **Folded in:** `grade10-site-auction-bid-increments-SC-01`, `grade10-site-auction-bid-increments-SC-12` (Q19, Q27) |
| TC1-2: chip 1x before any bid reads the opening price plus one increment | **Rejected:** Q28 - chip 1x before any bid is the opening price itself; the chips are `shared/ui/auction-listing`'s, written by this change as `shared-ui-auction-listing-SC-52` (Q35) and asserted by `shared-ui-auction-listing-US1-TC5-2`. QA2 dropped the chip column and step; the case stays draft |
| A first bid at the opening price is accepted, then the opening price plus its tier increment is the minimum | **Folded in:** `grade10-site-auction-auction-SC-62`, `grade10-site-auction-bid-increments-SC-02` and the requirement's after-an-accepted-bid rule |
| A first bid below the opening price is refused, naming it | **Folded in:** `grade10-site-auction-auction-SC-63`, `grade10-site-auction-auction-SC-64`, `grade10-site-auction-bid-increments-SC-04` |
| A lot starting at the ceiling takes one first bid there and refuses the next | **Folded in:** durable `grade10-site-auction-bid-increments-SC-08` and `grade10-site-auction-bid-increments-SC-11`, unchanged by this change (Q30) |
| Unchanged scenarios restated by the modified blocks - `SC-03`, `SC-05`, `SC-07` | **Out of suite:** the durable suite's existing cases; this change does not alter what they verify |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01`.

**Run:** QA2 reconciliation 2026-10-05 for change `cap-custom-maximum-entry`, rereading the two cases the accept-review fix round restated after Q6 lowered the JPY bid ceiling. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the bidding page's Ceiling, Refusals and Bid ceiling lines. No blind pass ran on this capability: the fix round wrote both cases with the scenarios in view, and this run checks them against those scenarios.

| Finding | Disposition |
| --- | --- |
| The JPY ceiling moves down from 150000000000 minor units | **Folded in:** the requirement's table and `grade10-site-auction-bid-increments-SC-10` / the JPY row of `g10.auction-bid-increments.US1-TC8` and `g10.auction-bid-increments.US2-TC3`. The interim 10000000000 gave way to 5000000000 (Q6); the rerun after it reread both cases at 5000000000 |
| The bid panel's custom maximum field refuses any draft above 9,999,999,999, so a JPY maximum above the ceiling cannot be entered there | **Folded in:** `g10.auction-bid-increments.US2-TC3` sends the maximum to the auction service directly. With the ceiling at 5000000000 (Q6) the field takes 5000000001 too, so the case keeps the direct send to read the service's own refusal, as task 5.1 walks it |
| Accept-review fix round: the earlier row credited `grade10-site-auction-bid-increments-SC-08` to this change | **Rejected:** `grade10-site-auction-bid-increments-SC-08` is the USD at-ceiling bid, unchanged here; only the table and `grade10-site-auction-bid-increments-SC-10` move |
| Unchanged scenarios restated by the modified block - `SC-08`, `SC-09`, `SC-11` | **Out of suite:** the durable suite's `g10.auction-bid-increments.US2-TC1`, `g10.auction-bid-increments.US2-TC2` and `g10.auction-bid-increments.US2-TC4`; their USD and HKD values do not move |
| Q6: the JPY ceiling itself is still reachable from a quick bid chip | **Rejected:** no scenario states it, and `tech-design.md` no longer claims it - the lot page's chips come from `@grade10/ui` and carry no ceiling, and grade10's `quickBidAmounts.ts` runs only in its own test, whose amounts task 4.1 moves under the new ceiling |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`.

**Run:** QA2 reconciliation 2026-10-05, rerun after the accept-review fixes, for change `cap-custom-maximum-entry`. Reread both cases against the delta's ceiling requirement and `grade10-site-auction-bid-increments-SC-08` to `-SC-11`, after the decisions rows named their carriers - Q4 and Q6 on this capability's ceiling requirement - and task groups 4 and 5 lost their owner. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 with their carriers, and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the bidding page's Ceiling, Custom maximum and Bid ceiling lines. No other active change touches this capability. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `g10.auction-bid-increments.US2-TC3` against `grade10-site-auction-bid-increments-SC-10` | **Joined:** JPY listing, minimum 150000 minor units, and no maximum recorded, match the scenario; the maximum and ceiling, first read as 10000000001 and 10000000000, are 5000000001 and 5000000000 since Q6 |
| `g10.auction-bid-increments.US1-TC8` against the requirement's table and its refusal once the next minimum passes the ceiling | **Joined:** the USD, HKD and JPY rows read 1000000000, 8000000000 and 5000000000 minor units since Q6, as the table does; the second bidder's refusal names the ceiling |
| Q4 and Q6 name this capability's ceiling requirement as their carrier | **Joined:** both cases sit on it, and `g10.auction-bid-increments.US2-TC3` sends the maximum to the service directly to read the service's own refusal |
| Task groups 4 and 5 carry no owner | **Joined:** suite-neutral; task 5.1 still walks both cases by id |
| Case ids against the durable suite - `TC8-2` and `TC3-2` bump `TC8-1` and `TC3-1` | **Joined:** a version bump on the same case number, so the fold replaces the earlier version; no other active change issues ids here |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`; `SC-08`, `SC-09` and `SC-11` stay out of suite with the durable cases named above as their verifiers.

**Run:** QA2 reconciliation 2026-10-05, rerun after the 5,000,000,000 JPY ceiling, for change `cap-custom-maximum-entry`. Reread both cases against the delta's ceiling requirement and `grade10-site-auction-bid-increments-SC-08` to `-SC-11`, after Q6 moved the JPY ceiling to 5000000000 minor units and `tech-design.md` dropped the quick-chip claim. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, the bidding page's Ceiling, Custom maximum and Bid ceiling lines, and the bid card's custom maximum handler in `listing-quick-maximum-bid-actions.tsx`. No other active change touches this capability. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `g10.auction-bid-increments.US2-TC3` against `grade10-site-auction-bid-increments-SC-10` | **Joined:** JPY listing, minimum 150000 minor units, maximum 5000000001 refused naming 5000000000, and no maximum recorded, match the scenario |
| `g10.auction-bid-increments.US1-TC8` against the requirement's table | **Joined:** the JPY row reads JPY5,000,000,000, as the table and the bidding page's Ceiling row do; USD and HKD do not move |
| `TC3-2`'s pre-condition said the field cannot carry the maximum, but 5000000001 sits under the field's 9,999,999,999 | **Folded in:** `g10.auction-bid-increments.US2-TC3` keeps the direct send to read the service's own refusal, and now says the field would carry the maximum too |
| Earlier rows that stated 10000000000, the field keeping the maximum out of the panel, or the quick-chip claim as current | **Folded in:** each row now states its outcome - 5000000000 (Q6), the field takes the maximum, and the chip claim is gone from `tech-design.md` |
| Unchanged scenarios restated by the modified block - `SC-08`, `SC-09`, `SC-11` | **Out of suite:** walked by the durable suite's `g10.auction-bid-increments.US2-TC1`, `g10.auction-bid-increments.US2-TC2` and `g10.auction-bid-increments.US2-TC4`, whose USD and HKD values match those scenarios |
| Case ids against the durable suite - `TC8-2` and `TC3-2` bump `TC8-1` and `TC3-1` | **Joined:** a version bump on the same case number; no other active change issues ids here |
| Questions for the PM | None - Q4 and Q6 settle the service's refusal and the JPY ceiling |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`; `SC-08`, `SC-09` and `SC-11` stay out of suite with the durable cases named above as their verifiers, and both cases stay draft.

**Run:** QA2 reconciliation 2026-10-05, rerun after the final accept-review fixes, for change `cap-custom-maximum-entry`. Reread both cases against the delta's ceiling requirement and `grade10-site-auction-bid-increments-SC-08` to `-SC-11`, after task 4.1's e2e note named only the shared-UI cases it drives. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the bidding page's Ceiling, Custom maximum and Bid ceiling lines. No other active change touches this capability. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `g10.auction-bid-increments.US2-TC3` against `grade10-site-auction-bid-increments-SC-10`, and `g10.auction-bid-increments.US1-TC8` against the requirement's table | **Joined:** JPY minimum 150000, maximum 5000000001 refused naming 5000000000, no maximum recorded; the table's USD, HKD and JPY rows match `TC8-2`'s |
| `TC3-2`'s pre-conditions ran as a paragraph and its placeholders were bare | **Folded in:** restyled to one bullet per condition with placeholders in backticks; values and outcomes unchanged |
| Both cases are manual | **Joined:** no automated case here, so no Decided-by line is owed; task 5.1 walks both |
| Case ids against the durable suite - `TC8-2` and `TC3-2` bump `TC8-1` and `TC3-1` | **Joined:** no other active change issues ids here |
| Questions for the PM | None - Q4 and Q6 settle the service's refusal and the JPY ceiling |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`; `SC-08`, `SC-09` and `SC-11` stay out of suite with the durable `g10.auction-bid-increments.US2-TC1`, `g10.auction-bid-increments.US2-TC2` and `g10.auction-bid-increments.US2-TC4` as their verifiers, and both cases stay draft.

**Run:** QA1 read only `/private/tmp/issue-1008-01a11f70-1791528937777/qa1-input`: frozen outline and context journey, proposal, decisions, linked PRD and UI states, configuration, continuity cases and the auction domain suite. Requirements, scenario markers and coverage, technical design, tasks, reconciliation and archives were excluded. QA2 reconciled it with independent Dev output and durable continuity markers at checkpoint `7e827ba031b8083adb5d16105a7bae40e689d3e2`, against fetched main `68548f870`.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| US2-TC1-1 | **Retained** - eligible exact-ceiling bid remains accepted through UI | SC-08 |
| US2-TC2-2 | **Folded in** - authenticated API request for each currency replaces blocked oversized UI entry; code, ceiling, unchanged facts and operator log remain asserted | SC-09 |
| US2-TC3-2 | **Retained** - existing API maximum refusal loses only its stale universal-field-cap pre-condition; issued ID and revision remain unchanged | SC-10 |
| US2-TC4-2 | **Folded in** - authenticated API request reaches a listing already at ceiling; price, leader, bid count and maxima remain unchanged | SC-11 |

- **Backend contract** - The ceiling requirement remains byte-for-byte unchanged. Refusal answers still name minor-unit ceilings; removing collector copy does not remove the API answer or operational entry.
- **Execution boundary** - The custom field corrects oversized drafts before submission, so oversized service cases use authenticated API. Exact-ceiling acceptance stays on UI.
- **Task finding resolved** - Task 3.1 originally demanded a failing regression for unchanged backend behavior. The coordinator repaired its wording to retain passing backend evidence and migrate the superseded UI route to authenticated API without artificial backend red. Changed input and presentation keep red-before-green in tasks 1.1 and 2.1. No behavioral anchor changed and no restart is required.
- **Continuity** - Unchanged cases remain in the durable suite with their issued IDs, revisions, covers, classifications and behavior; the acceptance fold retains them without copying them into this narrow active suite. US2-TC2 and US2-TC4 remain draft at revision 2; US2-TC3 keeps its issued revision 2. Current US2 covers follow SC-08 to SC-11 in source order.
- **Tasks** - Group 3 verifies backend evidence and migrates execution; tasks 4.2 to 4.4 run and record API/UI walks. These are planned checks, not execution results.
- **Questions** - None. Q1/Q4 and the unchanged contract settle backend scope; the task repair is mechanical.

**Cases** - All 12 cases remain draft. `TC-2ed@1` covers SC-vqb and SC-w8f; `TC-kyx@2` SC-ijk; `TC-n6d@3` SC-mn9 and SC-u6t; `TC-9do@3` SC-b2w; `TC-4ox@3` SC-c1v and SC-pd0; `TC-d9d@3` SC-hm3; `TC-dfw@3` SC-xnb; `TC-dlk@3` SC-pd0; `TC-y0l@1` remains unlinked; `TC-fdc@1` covers SC-60d, SC-5ea and SC-gq8; `TC-sze@1` SC-xjw and SC-tke; and `TC-pn8@2` SC-ws7. `TC-9do` was repaired in place at rev3 with a USD 104.99 bid against a USD 105.00 opening price and an explicit minimum-price refusal. `TC-fdc` includes an unsupported EUR create attempt as well as HKD and JPY. USD schedule fixtures follow the current tier arithmetic.

**Scenario coverage** - All 16 scenarios are covered by the linked cases. `TC-y0l` remains unlinked because its broader exploratory route has no complete matching scenario; narrower changed requirements are covered elsewhere. Unsupported EUR schedule writes also have admin listing coverage. The durable suite's old JPY maximum row remains an archive reconciliation item, not a current delta gap.

**Feature set** - The change removes the retired USD/HKD/JPY fixed schedules and per-currency ceiling. It retains one USD schedule and a USD 10,000,000 ceiling. No requirement, scenario, journey, case ID or case text changed in this fold.

**Run:** QA2 reconciliation 2026-10-22, rerun after the product manager answered Q12 to Q14 and Q15 was raised, for change `configure-auction-bid-increments`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-01` and `grade10-site-auction-bid-increments-US-03`. The rerun repaired ids, layers and coverage; it did not regenerate cases from scenarios. QA1's own bundle is its statement and cannot be checked here. The wording patch that took the fixed 100 minor units from the requirement, the scenarios and the feature-set line is a clarification of an anchor, not a new one, so QA1 and Dev did not run again (Q13). The product manager then reversed Q9 to whole dollars only: the patch reworded the boundary text, added `SC-23` and `US1-TC16`, and did not rerun QA1 or Dev. The product manager then answered Q16, a whole-dollar starting price: the patch added `SC-24` and `US1-TC17`, and did not rerun QA1 or Dev. The product manager then answered Q17 to Q19 (an admin delta, stored rows left as they are, a consigned create refused like any other): the patch scoped the rule to a price being set, added `SC-25`, `SC-26` and `US1-TC18`, withdrew the claim that the opening minimum is always biddable, and did not rerun QA1 or Dev. The product manager then answered Q20 and Q21 (a stored price with cents opens at the next whole dollar; the consignment screen refuses a floor with cents): the patch rewrote `SC-26` at rev 2 to assert the opening minimum, added `US1-TC19`, and did not rerun QA1 or Dev. The product manager then asked for the durable cases that carry cents to be restyled to whole dollars in this suite, and for Q11 to be stated: the patch restyled `US1-TC4`, `US1-TC6` and `US1-TC7` added `SC-27` and `US1-TC20`, and did not rerun QA1 or Dev. This line is a statement, not proof.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| `US1-TC1` | **Retained, revises the durable case of the same id** (`TC-2ed`, rev 2): the priced start only; the zero-start row moved to `US1-TC9` | `grade10-site-auction-bid-increments-SC-01` |
| `US1-TC2` | **Retained, revises the durable case of the same id** (`TC-0lh`, rev 2, back to draft): a price on a bound takes the higher tier, for every tier after the first and one whole dollar below each bound (Q9) | `grade10-site-auction-bid-increments-SC-02` |
| `US1-TC9` | **Retained, renumbered** (QA1's zero-start case; its id and number collided with the durable `TC-0lh`): a 0 start opens at the lowest configured increment | `grade10-site-auction-bid-increments-SC-12` |
| `US1-TC10` | **Retained, renumbered** (QA1's next-minimum case, which collided with the durable `TC-qui`): the lowest, a middle and the last tier | `grade10-site-auction-bid-increments-SC-07` |
| `US1-TC11` | **Retained, renumbered** (collided with the durable `TC-kyx`): a maximum is beaten at the beaten maximum plus its own tier's increment | none: `grade10-site-auction-bid-increments-SC-20` also states that a later change leaves the current bid, which no step here changes; `US1-TC15` asserts it |
| `US1-TC12` | **Retained, renumbered** (collided with the durable `TC-n6d`): a typed amount answered by a standing maximum | none: `grade10-site-auction-bid-increments-SC-20` states a maximum answered by a maximum and a later change, and no scenario states the manual-bid input beyond the requirement's prose (see A manual bid answered by a maximum below) |
| `US1-TC13` | **Reshaped from QA1's `US1-TC7`, renumbered, moved to the `api` layer** (the id collided with the durable `TC-9do`): `tech-design.md` says e2e cannot swap the schedule at run time, so a second schedule is passed to the minimum calculation | `grade10-site-auction-bid-increments-SC-17`, `grade10-site-auction-bid-increments-SC-18` |
| `US1-TC14` | **New, api layer:** a bid at the old minimum is refused after a change, naming the new minimum | `grade10-site-auction-bid-increments-SC-19` |
| `US1-TC15` | **New, api layer:** a resolved price reads the schedule in force and a later change leaves it | `grade10-site-auction-bid-increments-SC-20` |
| `US1-TC16` | **New, api layer, added for Q9:** a bid with cents is refused naming the whole-dollar rule, and nothing moves; api because the bid panel's field cannot type cents | `grade10-site-auction-bid-increments-SC-23` |
| `US1-TC17` | **New, e2e layer, added for Q16:** a starting price with cents is refused in the listing editor, naming the whole-dollar rule, and the saved price stays | `grade10-site-auction-bid-increments-SC-24` |
| `US1-TC18` | **New, api layer, added for Q19:** a consignment ask with cents makes no listing and names the whole-dollar rule; a whole-dollar ask makes a draft | `grade10-site-auction-bid-increments-SC-25` |
| `US1-TC19` | **New, e2e layer, added for Q20:** a stored starting price with cents opens at the next whole dollar, the page still shows the stored price, and a first bid at that minimum is accepted | `grade10-site-auction-bid-increments-SC-26` |
| `US1-TC20` | **New, api layer, added for Q11:** a house maximum on a listing in extended bidding steps on the configured schedule, and the next minimum reads it | `grade10-site-auction-bid-increments-SC-27` |
| `US1-TC4` | **Retained, revises the durable case of the same id** (`TC-5ez`, rev 2, back to draft and `manual`): the cents amount `USD104.99` becomes `USD104`, one whole dollar below the minimum; the case now covers only `SC-04`, which it asserts in full | `grade10-site-auction-bid-increments-SC-04` |
| `US1-TC6` | **Retained, revises the durable case of the same id** (`TC-n6d`, rev 4, above the durable 3): the higher bid `USD2.50` becomes `USD3`; the other row keeps its old-tier amounts | none: unchanged from the durable claim |
| `US1-TC7` | **Retained, revises the durable case of the same id** (`TC-9do`, rev 5, above the durable 4): the `USD1` and `USD0.99` row is dropped, because no whole-dollar amount above 0 lies below the lowest increment, and `USD104.99` becomes `USD104` | `grade10-site-auction-bid-increments-SC-04`, as the durable case claims it, for the page's own Min line |
| `US3-TC3` | **Revises the durable case of the same id** (`TC-sze`, rev 2): the minimum reads the current bid plus the configured increment, not a quoted amount; `usd-lot-currency-winner-settlement-choice` carries it at rev 1 with a quoted `USD8,050.00` | `grade10-site-auction-bid-increments-SC-13` |
| `US3-TC5` | **Retained, renumbered** (QA1's `US3-TC1`, which collided with the durable `TC-y0l`): two listings at one price share one increment | `grade10-site-auction-bid-increments-SC-21` |
| `US3-TC6` | **Retained, renumbered** (QA1's `US3-TC2`, which collided with the durable `TC-fdc`): Min and the bid read in USD | `grade10-site-auction-bid-increments-SC-05` |
| `US3-TC7` | **Retained, renumbered, `unit` layer** (QA1's `US3-TC3`, which collided with the durable `TC-sze`): the schedule starts at 0 and its last tier is unbounded | `grade10-site-auction-bid-increments-SC-22` |

- **Covers links** - `TC-2ed` to `SC-vqb`, `TC-0lh` to `SC-mn9`, `TC-5ez` to `SC-b2w`, `TC-sze` to `SC-tke`, and each new case to the scenario named in the table, by the scenario's trace id. A scenario is linked only when the case's route asserts every THEN and AND line of it
- **Uncovered scenarios** - none without a case or a named verifier:
  - The operator-side refusal of `SC-24` is also stated by `grade10-admin-auction-listing-SC-221` and `SC-222` in that capability's delta suite (Q17); `US1-TC17` stays here for the rule's own capability
  - `grade10-site-auction-bid-increments-SC-03` is **Out of suite**: the durable `g10.auction-bid-increments.US1-TC3` (a bid above the minimum is accepted) asserts it, and this change does not alter what that case verifies; the amounts it quotes are examples of a given minimum
  - `grade10-site-auction-bid-increments-SC-04` is in this suite: `g10.auction-bid-increments.US1-TC4`, restyled below at rev 2, asserts it
  - `grade10-site-auction-bid-increments-SC-14` is **Out of suite**: the case that asserts it is `usd-lot-currency-winner-settlement-choice`'s `g10.auction-bid-increments.US3-TC4`, which that change folds first (Q15); this change restates the scenario unchanged
- **Over-claimed cases** - none: no case carries a `covers` link its route does not assert
- **Contradictions** - none open. QA1's `US1-TC2` read the opening minimum on a 0 start as the lowest configured increment while Dev's `SC-12` fixed it at 100 minor units; Q13 settled it for QA1's reading, and the requirement, `SC-12` and the feature-set line no longer state 100
- **Routes that differ, not contradictions** - `US1-TC10` and `US1-TC7` stop at the bid form, below the minimum by one whole dollar, while `SC-04` and `US1-TC4` reach the server; the PRD's Refusals table gives each route its own line. `US1-TC14` reaches the server through a page that still shows the old minimum
- **Id collisions, resolved** - QA2's first report found that nine of QA1's case ids and heading numbers were the durable suite's for other cases, and that `usd-lot-currency-winner-settlement-choice` carries `TC-2ed`, `TC-kyx`, `TC-n6d`, `TC-9do`, `TC-y0l`, `TC-fdc`, `TC-sze` and `TC-pn8` under the durable text. Cases that revise a durable case keep its id and number and bump `rev`: `TC-2ed`, `TC-0lh` and `TC-sze` to 2, each above the sibling's rev 1. Every other case takes a fresh number from `pnpm run spec:issue` (`US1-TC9` to `US1-TC20`, `US3-TC5` to `US3-TC7`) and a fresh trace id. The durable `TC-qui`, `TC-kyx`, `TC-4ox`, `TC-y0l`, `TC-fdc` and `TC-pn8` stay as the durable suite and the sibling hold them. `TC-5ez`, `TC-n6d` and `TC-9do` are revised here at `rev` 2, 4 and 5, above the durable 1, 3 and 4, and the sibling carries no later revision of them
- **Durable cases left to keep their amounts** - `g10.auction-bid-increments.US1-TC3`, the second row of `US1-TC6` and the whole-dollar rows of the walks quote amounts from the old six tiers (USD105, USD126, USD5, USD10), and the domain suite quotes tier amounts too. They state a given minimum or an increment as an example, as Q14 reads the neighbouring specs. A reviewer may restyle them against the configured values after deploy
- **Durable cases that carried cents, restyled** - after Q9, `US1-TC4` (`USD104.99`, the verifier of `SC-04`), `US1-TC6` (a `USD2.50` higher bid) and `US1-TC7` (`USD0.99` and `USD104.99` bids) quoted amounts the product no longer accepts, as did the walk rows. This suite carries them at `rev` 2, 4 and 5, each above the durable revision, back to `draft`, with whole-dollar amounts. `US1-TC4` was `actual` and automated: it is `manual` again and its Decided-by line is dropped until its e2e test is rewritten (task 5.1) and flipped (task 6.2). The durable suite's `## Walk 1` data rows copy the cents amounts of those cases. A delta cannot carry a walk without every case the walk references (`tcs:validate` refuses it), and its walks replace the durable ones whole in the fold, so the rows are restyled in the durable suite after the fold, by task 1.2a. `US2-TC4` and Walk 2 quote `USD10,000,000.01`, the ceiling plus one minor unit. The PM chose to restyle them to `USD10,000,001` in the durable suite after the fold, by task 1.2a, with no new `rev` and no US-02 anchor in this delta; the repair table in `accept-review.md` records it
- **Domain suites** - `No domain impact`: the journeys of `grade10-site-auction-bid-increments` appear on no `**Trace:**` line of `grade10-site/auction/domain-tcs.md`, and the one admin journey a domain case traces, `grade10-admin-auction-listing-US-03` (`g10adm.auction-domain.US2-TC1-4`, a campaign cancellation), does not touch a starting price with cents. The domain suite's tier amounts are examples (Q14)
- **A manual bid answered by a maximum** - `US1-TC12` stays without a `covers` link and `tcs:validate` warns: `SC-20` states that a maximum committed answers at the beaten maximum plus its own tier's increment and that a later change leaves the price, and `US1-TC12` asserts the first part only. A new scenario for a manual bid would restate the requirement's proxy sentence for a second input and state no rule the requirement does not already give, so none is added
- **Layer** - `US1-TC13` to `US1-TC15` and `US1-TC20` are `api` and `US3-TC7` is `unit`, Testability `automation`: a second schedule is a test seam no tester can reach by hand, and the application's DB lane and contracts tests are where `tech-design.md` puts them
- **Case duplication, checked** - `US1-TC15` repeats `US1-TC11`'s route at the `api` layer and adds the later change; it is kept because `US1-TC11` cannot change the schedule. `US3-TC5` and the durable `TC-y0l` both assert one schedule: `TC-y0l` across two price ranges, `US3-TC5` at one price
- **Config validity** - held by a contracts test, not by a scenario or a case (Q12); `US3-TC7` asserts only the shape the requirement states as a rule
- **Blindness** - unchanged from the first reconciliation: QA1 does not look contaminated and Dev looks anchored but shaped; neither reading asserts the other way

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-03`.

### Manual

| Manual | Why |
| --- | --- |
| `g10.auction-bid-increments.US1-TC8` | A person drives the auction service's bid procedure for each currency row against the deployed service, in task 5.1's walk; `bidIncrements.test.ts` in the application repository pins the ceiling value only |
| `g10.auction-bid-increments.US2-TC3` | A person sends the JPY maximum to the deployed service's bid procedure and reads the refusal and the collector's maximums, in task 5.1's walk; `placeBid.spec.ts` in the application repository is to refuse it once task 4.1 lands |
