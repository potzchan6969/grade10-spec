# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 5/12
**Reviewed:** 2026-09-22, tcs-rules r3.0, lapsed 2026-10-02
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector places a bid across a price tier

**Starting state:**

- An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
- customer is signed in with a card linked and is on that listing's page.
- `<listing_1>` is open in the row's currency, starting price the row's `<ceiling>`, with no accepted bid.
- customer A and customer B are signed in with cards linked, on separate sessions.

**Shared test data:**

| Item | Value |
| --- | --- |
| Item | Currency: USD; Starting price: 0; Why this row: Zero start; Minimum next amount: USD1 (fixed tier increment), the lowest USD increment |
| Item | Currency: HKD; Starting price: 0; Why this row: Zero start; Minimum next amount: HKD10 (fixed tier increment), the lowest HKD increment |
| Item | Currency: JPY; Starting price: 0; Why this row: Zero start; Minimum next amount: JPY100 (fixed tier increment), the lowest JPY increment |
| Item | Currency: HKD; Starting price: HKD280 (range: 1000–79999 minor units); Why this row: Positive start inside the HKD 0 tier; Minimum next amount: HKD280 (range: 1000–79999 minor units), the starting price |
| Item | Currency: HKD; Starting price: HKD7 (range: 1–999 minor units); Why this row: Positive start below the lowest HKD increment; Minimum next amount: HKD7 (range: 1–999 minor units), the starting price |
| Item | Currency: USD; Starting price: USD100 (fixed tier boundary); Why this row: Positive start on the USD 100 tier boundary; Minimum next amount: USD100 (fixed tier boundary), the starting price |
| Item | current public price: ---; increment: ---:; minimum next amount: ---: |
| Item | current public price: USD100 (fixed tier boundary); increment: 500; minimum next amount: 10500 |
| Item | current public price: USD99.99 (range: 100–9999 minor units); increment: 100; minimum next amount: 10099 |
| Item | current public price: USD500 (fixed tier boundary); increment: 1000; minimum next amount: 51000 |
| --- | ---: |
| USD105 (range: 10000–49999 minor units) | 12600 |
| USD105 (fixed tier boundary) | USD104.99 (fixed boundary or equality) |
| Item | listing currency: USD |
| Item | listing currency: HKD |
| Item | listing currency: JPY |
| Item | Currency: USD; Starting price: 0; Opening price, the bid amount: USD1 (range: 100–9999 minor units); Increment at the opening price: 100 (USD 0 tier); Next minimum after: USD2 (fixed derived value) |
| Item | Currency: HKD; Starting price: 0; Opening price, the bid amount: HKD10 (range: 1000–79999 minor units); Increment at the opening price: 1000 (HKD 0 tier); Next minimum after: HKD20 (fixed derived value) |
| Item | Currency: JPY; Starting price: 0; Opening price, the bid amount: JPY100 (range: 100–14999 minor units); Increment at the opening price: 100 (JPY 0 tier); Next minimum after: JPY200 (fixed derived value) |
| Item | Currency: HKD; Starting price: HKD7 (range: 1–999 minor units); Opening price, the bid amount: HKD7 (range: 1–999 minor units); Increment at the opening price: 1000 (HKD 0 tier); Next minimum after: HKD17 (fixed derived value) |
| Item | Currency: USD; Starting price: USD100 (fixed tier boundary); Opening price, the bid amount: USD100 (fixed tier boundary); Increment at the opening price: 500 (USD 100 tier); Next minimum after: USD105 (fixed derived value) |
| Item | Currency: HKD; Starting price: 0; Opening price: HKD10 (range: 1000–79999 minor units); Bid amount: HKD9 (range: 1–999 minor units) |
| Item | Currency: JPY; Starting price: 0; Opening price: JPY100 (range: 100–14999 minor units); Bid amount: JPY99 (range: 1–99 minor units) |
| Item | Currency: HKD; Starting price: HKD7 (range: 1–999 minor units); Opening price: HKD7 (range: 1–999 minor units); Bid amount: HKD6 (range: 1–999 minor units) |
| Item | Currency: USD; Starting price: USD100 (fixed tier boundary); Opening price: USD100 (fixed tier boundary); Bid amount: USD99 (range: 100–9999 minor units) |
| USD | USD10,000,000 (range: 1000000–1000000000 minor units) |
| HKD | HKD80,000,000 (range: 8000000–8000000000 minor units) |
| JPY | JPY5,000,000,000 (range: 1500000–5000000000 minor units) |

### Route

1. Open the bid panel on the listing.
2. Read the minimum next amount.
   - The minimum next amount is the row's minimum next amount. g10.auction-bid-increments.US1-TC1
   - On a positive start it is the starting price, not the starting price plus its increment. g10.auction-bid-increments.US1-TC1
   - On a HKD 700 start it is not raised to the lowest increment. g10.auction-bid-increments.US1-TC1
   - On a zero start it is the currency's lowest increment, never 0. g10.auction-bid-increments.US1-TC1
3. Open the listing bid panel.
4. Place a bid of `<current public price>` plus `<increment>`.
   - The new public price is `<minimum next amount>`. g10.auction-bid-increments.US1-TC2
5. Open the listing bid panel.
6. Enter `<bid amount>` as the bid amount.
7. Confirm the bid.
   - The bid is accepted. g10.auction-bid-increments.US1-TC3
8. Open the listing bid panel.
9. Enter `<bid amount>` as the bid amount.
10. Confirm the bid.
   - The bid is refused. g10.auction-bid-increments.US1-TC4
   - The refusal names `<minimum>` as the minimum. g10.auction-bid-increments.US1-TC4
11. Open the listing.
12. Read the minimum next amount.
   - The minimum next amount is shown in `<listing currency>`. **Out of suite:** - `grade10-site-auction-bid-increments-SC-06` — API and operator-form currency refusal is covered by the backend and admin verification lanes. - `grade10-site-auction-bid-increments-SC-07` — Manual-floor calculation is covered by the backend auction test lane. g10.auction-bid-increments.US1-TC5
13. Enter the row's bid amount in the custom maximum on the bid panel.
14. Confirm the bid.
   - the bid is accepted. g10.auction-bid-increments.US1-TC6
15. Read the minimum next amount on the bid panel.
   - the minimum next amount is the opening price plus the increment at the opening price, the row's next minimum after. g10.auction-bid-increments.US1-TC6
   - On the USD 10000 row the USD 100 tier applies, not the USD 0 tier. g10.auction-bid-increments.US1-TC6
16. Enter the row's bid amount in the custom maximum on the bid panel.
17. Confirm the bid.
   - the bid is refused, naming the row's opening price as the minimum. g10.auction-bid-increments.US1-TC7
18. Read the bid panel.
   - the listing still has no accepted bid. g10.auction-bid-increments.US1-TC7
   - the minimum next amount is still the row's opening price. g10.auction-bid-increments.US1-TC7
19. As customer A, submit a bid of `<ceiling>` on `<listing_1>`.
20. Read the API response.
   - customer A's bid is accepted at `<ceiling>`. g10.auction-bid-increments.US1-TC8
21. As customer B, submit a bid of `<ceiling>` plus the increment at it.
22. Read the API response.
   - customer B's bid is refused, naming the ceiling. g10.auction-bid-increments.US1-TC8
23. Read `<listing_1>`'s current bid, leader and bid count.
   - current bid `<ceiling>`, customer A leads, bid count 1. g10.auction-bid-increments.US1-TC8

## Walk 2: Collector bids up to the currency ceiling

**Starting state:**

- customer(card linked, account in good standing) can bid on an open listing in the row's currency.
- The listing's minimum is below the ceiling.
- The request is sent directly, bypassing the custom maximum field.
- The collector is enrolled on an open JPY listing whose minimum bid is `<minimum>`.
- The maximum is sent directly to the auction service.
- customer A leads the open listing at the row's ceiling.
- customer B(card linked, account in good standing) can bid on the listing.

**Shared test data:**

| Item | Value |
| --- | --- |
| Item | minimum: ---; ceiling: ---:; bid amount: ---: |
| Item | minimum: USD9,999,900 (fixed configured value); ceiling: 1000000000; bid amount: 1000000000 |
| Item | Currency: USD; Ceiling: USD10,000,000 (fixed configured value); Bid amount: USD10,000,000.01 (fixed boundary or equality) |
| Item | Currency: HKD; Ceiling: HKD80,000,000 (fixed configured value); Bid amount: HKD80,000,000.01 (fixed boundary or equality) |
| Item | Currency: JPY; Ceiling: JPY5,000,000,000 (fixed configured value); Bid amount: JPY5,000,000,001 (fixed boundary or equality) |
| Item | `<minimum>`: ---; `<ceiling>`: ---:; `<maximum>`: ---: |
| Item | `<minimum>`: JPY150,000 (fixed tier boundary); `<ceiling>`: 5000000000; `<maximum>`: 5000000001 |

### Route

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.
   - The bid is accepted. g10.auction-bid-increments.US2-TC1
4. Read the listing's price, leader, bid count and maximums.
5. Submit the row's bid amount through the authenticated auction API.
6. Read the API response.
   - the service refuses with `AMOUNT_TOO_HIGH`. g10.auction-bid-increments.US2-TC2
   - `ceilingMinor` equals the row's ceiling. g10.auction-bid-increments.US2-TC2
7. Read the listing's price, leader, bid count and maximums.
   - price, leader, bid count and maximums remain unchanged. g10.auction-bid-increments.US2-TC2
8. Read the operational refusal entry for this attempt.
   - one entry names bidder, listing, code, amount and ceiling. g10.auction-bid-increments.US2-TC2
9. As the collector, submit `<maximum>` through the authenticated auction API.
   - The maximum is refused and the refusal names `<ceiling>` as the ceiling. g10.auction-bid-increments.US2-TC3
10. Read the response and the collector's maximums on the listing.
   - No maximum is recorded for the collector. g10.auction-bid-increments.US2-TC3
11. Read the listing's bid count and maximums.
12. As customer B, submit the amount through the authenticated auction API.
13. Read the API response.
   - the service refuses with `AMOUNT_TOO_HIGH`. g10.auction-bid-increments.US2-TC4
   - `ceilingMinor` equals the row's ceiling. g10.auction-bid-increments.US2-TC4
14. Read the listing's price, leader, bid count and maximums.
   - price remains the ceiling and customer A leads. g10.auction-bid-increments.US2-TC4
   - bid count and maximums remain unchanged. g10.auction-bid-increments.US2-TC4
15. Read the operational refusal entry for this attempt.
   - one entry names bidder, listing, code, amount and ceiling. g10.auction-bid-increments.US2-TC4

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/opening-price.spec.ts`

**Pre-conditions:**

* An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Starting price | Why this row | Minimum next amount |
| --- | --- | --- | --- |
| USD | 0 | Zero start | USD1 (fixed boundary or equality), the lowest USD increment |
| HKD | 0 | Zero start | HKD10 (fixed boundary or equality), the lowest HKD increment |
| JPY | 0 | Zero start | JPY100 (fixed boundary or equality), the lowest JPY increment |
| HKD | HKD280 (range: 1000–79999 minor units) | Positive start inside the HKD 0 tier | HKD280 (range: 1000–79999 minor units), the starting price |
| HKD | HKD7 (range: 1–999 minor units) | Positive start below the lowest HKD increment | HKD7 (fixed tier increment), the starting price |
| USD | USD100 (fixed tier boundary) | Positive start on the USD 100 tier boundary | USD100 (fixed tier boundary), the starting price |

**Steps:**

1. Open the bid panel on the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is the row's minimum next amount.
* On a positive start it is the starting price, not the starting price plus its increment.
* On a HKD 700 start it is not raised to the lowest increment.
* On a zero start it is the currency's lowest increment, never 0.

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
An open USD listing has current public price `<current public price>`.
The collector is enrolled and can bid.

**Test data:**

| current public price | increment | minimum next amount |
| --- | ---: | ---: |
| USD100 (fixed tier boundary) | 500 | 10500 |
| USD99.99 (range: 100–9999 minor units) | 100 | 10099 |
| USD500 (fixed tier boundary) | 1000 | 51000 |

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
The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| minimum | bid amount |
| --- | ---: |
| USD105 (range: 10000–49999 minor units) | 12600 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

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
The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| minimum | bid amount |
| --- | ---: |
| USD105 (range: 10000–49999 minor units) | 10499 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused.
* The refusal names `<minimum>` as the minimum.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC5: Listing publishes the next minimum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
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
An open listing is available in `<listing currency>`.

**Test data:**

| listing currency |
| --- |
| USD |
| HKD |
| JPY |

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in `<listing currency>`.

**Out of suite:**

- `grade10-site-auction-bid-increments-SC-06` — API and operator-form currency refusal is covered by the backend and admin verification lanes.
- `grade10-site-auction-bid-increments-SC-07` — Manual-floor calculation is covered by the backend auction test lane.

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk,g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC6: First bid at the opening price is accepted, then one increment applies

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

* An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Starting price | Opening price, the bid amount | Increment at the opening price | Next minimum after |
| --- | --- | --- | --- | --- |
| USD | 0 | USD1 (range: 100–9999 minor units) | 100 (USD 0 tier) | USD2 (fixed derived value) |
| HKD | 0 | HKD10 (range: 1000–79999 minor units) | 1000 (HKD 0 tier) | HKD20 (fixed derived value) |
| JPY | 0 | JPY100 (range: 100–14999 minor units) | 100 (JPY 0 tier) | JPY200 (fixed derived value) |
| HKD | HKD7 (range: 1–999 minor units) | HKD7 (range: 1–999 minor units) | 1000 (HKD 0 tier) | HKD17 (fixed derived value) |
| USD | USD100 (fixed tier boundary) | USD100 (fixed tier boundary) | 500 (USD 100 tier) | USD105 (fixed derived value) |

**Steps:**

1. Enter the row's bid amount in the custom maximum on the bid panel.
2. Confirm the bid.
3. Read the minimum next amount on the bid panel.

**Expected Results:**

* Step 2: the bid is accepted.
* Step 3: the minimum next amount is the opening price plus the increment at the opening price, the row's next minimum after.
* On the USD 10000 row the USD 100 tier applies, not the USD 0 tier.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk,g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC7: First bid below the opening price is refused

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

* An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Starting price | Opening price | Bid amount |
| --- | --- | --- | --- |
| HKD | 0 | HKD10 (range: 1000–79999 minor units) | HKD9 (range: 1–999 minor units) |
| JPY | 0 | JPY100 (range: 100–14999 minor units) | JPY99 (range: 1–99 minor units) |
| HKD | HKD7 (range: 1–999 minor units) | HKD7 (range: 1–999 minor units) | HKD6 (range: 1–999 minor units) |
| USD | USD100 (fixed tier boundary) | USD100 (fixed tier boundary) | USD99 (fixed boundary or equality) |

**Steps:**

1. Enter the row's bid amount in the custom maximum on the bid panel.
2. Confirm the bid.
3. Read the bid panel.

**Expected Results:**

* Step 2: the bid is refused, naming the row's opening price as the minimum.
* Step 3: the listing still has no accepted bid.
* Step 3: the minimum next amount is still the row's opening price.

<!-- trace:case id=g10.auction-bid-increments.TC-4ox rev=2 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk,g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC8: Lot starting at the ceiling takes one first bid there

Runs once per row of **Test data**.

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

* `<listing_1>` is open in the row's currency, starting price the row's `<ceiling>`, with no accepted bid.
* customer A and customer B are signed in with cards linked, on separate sessions.

**Test data:**

| Currency | `<ceiling>` |
| --- | --- |
| USD | USD10,000,000 (range: 1000000–1000000000 minor units) |
| HKD | HKD80,000,000 (range: 8000000–8000000000 minor units) |
| JPY | JPY5,000,000,000 (range: 1500000–5000000000 minor units) |

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

## g10.auction-bid-increments.US2: Collector bids up to the currency ceiling

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
The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| minimum | ceiling | bid amount |
| --- | ---: | ---: |
| USD9,999,900 (range: 1000000–1000000000 minor units) | 1000000000 | 1000000000 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=2 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC2: Direct bid above the ceiling is refused without effects

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* customer(card linked, account in good standing) can bid on an open listing in the row's currency.
* The listing's minimum is below the ceiling.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Currency | Ceiling | Bid amount |
| --- | --- | --- |
| USD | USD10,000,000 (fixed configured value) | USD10,000,000.01 (fixed boundary or equality) |
| HKD | HKD80,000,000 (fixed configured value) | HKD80,000,000.01 (fixed boundary or equality) |
| JPY | JPY5,000,000,000 (fixed configured value) | JPY5,000,000,001 (fixed boundary or equality) |

**Steps:**

1. Read the listing's price, leader, bid count and maximums.
2. Submit the row's bid amount through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals the row's ceiling.
* Step 4: price, leader, bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

<!-- trace:case id=g10.auction-bid-increments.TC-dfw rev=2 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC3: Auto-bid maximum above the ceiling is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* The collector is enrolled on an open JPY listing whose minimum bid is `<minimum>`.
* The maximum is sent directly to the auction service.

**Test data:**

| `<minimum>` | `<ceiling>` | `<maximum>` |
| --- | ---: | ---: |
| JPY150,000 (fixed tier boundary) | 5000000000 | 5000000001 |

**Steps:**

1. As the collector, submit `<maximum>` through the authenticated auction API.
2. Read the response and the collector's maximums on the listing.

**Expected Results:**

* The maximum is refused and the refusal names `<ceiling>` as the ceiling.
* No maximum is recorded for the collector.

<!-- trace:case id=g10.auction-bid-increments.TC-dlk rev=2 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC4: Listing at the ceiling refuses a further direct bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* customer A leads the open listing at the row's ceiling.
* customer B(card linked, account in good standing) can bid on the listing.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Currency | Ceiling | Bid amount |
| --- | --- | --- |
| USD | USD10,000,000 (fixed configured value) | USD10,000,000.01 (fixed boundary or equality) |
| HKD | HKD80,000,000 (fixed configured value) | HKD80,000,000.01 (fixed boundary or equality) |
| JPY | JPY5,000,000,000 (fixed configured value) | JPY5,000,000,001 (fixed boundary or equality) |

**Steps:**

1. Read the listing's bid count and maximums.
2. As customer B, submit the amount through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals the row's ceiling.
* Step 4: price remains the ceiling and customer A leads.
* Step 4: bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

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

### Manual

| Manual | Why |
| --- | --- |
| `g10.auction-bid-increments.US1-TC8` | A person drives the auction service's bid procedure for each currency row against the deployed service, in task 5.1's walk; `bidIncrements.test.ts` in the application repository pins the ceiling value only |
| `g10.auction-bid-increments.US2-TC3` | A person sends the JPY maximum to the deployed service's bid procedure and reads the refusal and the collector's maximums, in task 5.1's walk; `placeBid.spec.ts` in the application repository is to refuse it once task 4.1 lands |
