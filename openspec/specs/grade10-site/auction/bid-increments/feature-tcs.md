# grade10-site/auction/bid-increments Test Cases

**Status:** reopened · 4/16
**Reviewed:** 2026-09-22, tcs-rules r3.0, lapsed 2026-10-02
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-site-auction-bid-increments-SC-03, grade10-site-auction-bid-increments-SC-06

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
16. Confirm the bid.
   - Step 16: the bid is refused and names `<opening price>` as the minimum. `g10.auction-bid-increments.US1-TC7`
17. Read the bid panel.
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
**I want** the minimum next bid to scale with the listing's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC1: Minimum before any bid is the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing, starting price `<starting price>`, with no accepted bid.
* A customer with a linked card is on that listing's page.

**Test data:**

| `<starting price>` | `<minimum next amount>` | Fixture notes |
| --- | --- | --- |
| USD0 | USD1 | `<starting price>`: (fixed boundary); `<minimum next amount>`: (fixed minimum increment) |
| USD280 | USD280 | `<starting price>`: (range: 10000-49999 minor units); `<minimum next amount>`: (same as starting price) |
| USD100 | USD100 | `<starting price>`: (fixed tier boundary); `<minimum next amount>`: (same as starting price) |

**Steps:**

1. Open the bid panel on the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount reads `<minimum next amount>`.
* A positive start is its own minimum; a zero start uses the lowest USD increment.

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC2: Boundary price takes the higher tier

Runs once per row of **Test data**.

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

* An open USD listing has current public price `<current public price>`.
* The collector is enrolled and can bid.

**Test data:**

| `<current public price>` | `<increment>` | `<minimum next amount>` | Fixture notes |
| --- | ---: | ---: | --- |
| USD100 | USD5 | USD105 | `<current public price>`: (fixed tier boundary); `<increment>`: 500 USD minor units; `<minimum next amount>`: 10500 USD minor units |
| USD99.99 | USD1 | USD100.99 | `<current public price>`: (range: 100–9999 minor units); `<increment>`: 100 USD minor units; `<minimum next amount>`: 10099 USD minor units |
| USD500 | USD10 | USD510 | `<current public price>`: (fixed tier boundary); `<increment>`: 1000 USD minor units; `<minimum next amount>`: 51000 USD minor units |

**Steps:**

1. Open the listing bid panel.
2. Place a bid of `<current public price>` plus `<increment>`.

**Expected Results:**

* The new public price is `<minimum next amount>`.

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

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC4: Amount below the minimum is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
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
| USD105 | USD104.99 | `<minimum>`: (range: 10000–49999 minor units); `<bid amount>`: 10499 USD minor units |

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

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=3 covers=g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t -->
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
| USD0 | USD1 | USD1 | USD2 | USD2.50 | `<first bid>`: (range: 100-9999 minor units); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |
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

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=3 covers=g10.auction-bid-increments.SC-b2w -->
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
| USD1 | USD0.99 | `<opening price>`: (fixed minimum increment); `<bid amount>`: (fixed boundary) |
| USD100 | USD99 | `<opening price>`: (fixed tier boundary); `<bid amount>`: (fixed boundary) |
| USD105 | USD104.99 | `<opening price>`: (fixed opening price); `<bid amount>`: (one minor unit below minimum) |

**Steps:**

1. Enter `<bid amount>` in the custom maximum field.
2. Confirm the bid.
3. Read the bid panel.

**Expected Results:**

* Step 2: the bid is refused and names `<opening price>` as the minimum.
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

## g10.auction-bid-increments.US3: Collector bids in USD on every listing

**As a** collector,
**I want** every listing priced and bid in USD with one increment schedule,
**so that** I compare listings and place bids in one unit.

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

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=1 covers=g10.auction-bid-increments.SC-xjw,g10.auction-bid-increments.SC-tke -->
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

* An open USD listing with an accepted bid of `<current public price>` and no other currency.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| `<listing_setup>` | Why this row |
| --- | --- |
| A listing created in USD | The schedule as it always read |
| A listing created in HKD and overwritten to USD, amounts unchanged | A listing that existed before this change |

| Field | Value | Fixture notes |
| --- | --- | --- |
| current public price | USD8,000 | (800000 USD minor units, fixed scenario fixture) |
| increment | USD50 | (5000 USD minor units, fixed tier increment) |
| minimum next amount | USD8,050 | `<current public price>` plus `<increment>` |

**Steps:**

1. Open the bid panel on the listing prepared as follows: `<listing_setup>`.
2. Read the current bid and the minimum next amount.

**Expected Results:**

* The current bid reads `<current public price>` on both rows.
* The minimum next amount reads `<minimum next amount>`, equal to `<current public price>` plus `<increment>`.
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

### Manual

| Manual | Why |
| --- | --- |
| `g10.auction-bid-increments.US1-TC8` | A person drives the auction service's bid procedure for each currency row against the deployed service, in task 5.1's walk; `bidIncrements.test.ts` in the application repository pins the ceiling value only |
| `g10.auction-bid-increments.US2-TC3` | A person sends the JPY maximum to the deployed service's bid procedure and reads the refusal and the collector's maximums, in task 5.1's walk; `placeBid.spec.ts` in the application repository is to refuse it once task 4.1 lands |
