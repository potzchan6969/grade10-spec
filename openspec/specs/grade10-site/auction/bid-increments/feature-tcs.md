# grade10-site/auction/bid-increments Test Cases

**Status:** reopened · 2/12
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page shows Highest bid and, on its bid panel, Min, the minimum next bid. Every listing is priced and bid in USD, whole dollars.
* The step comes from the configured schedule in force, the table on the Bidding PRD page: a tier owns its lower bound and the last tier has none. In force today: +USD1 from USD0, +USD2 from USD10, +USD5 from USD50, +USD10 from USD100, +USD25 from USD200, +USD50 from USD500, +USD100 from USD1,000, +USD250 from USD2,500, +USD500 from USD5,000, up to +USD100,000 from USD1,500,000. The ceiling is USD10,000,000.
* customer, customer A and customer B are signed in with a card linked, on separate sessions.

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=2 covers=g10.auction-bid-increments.SC-vqb -->
### g10.auction-bid-increments.US1-TC1: Before any bid the minimum is the opening price, and a bid at it moves the minimum up one step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer is on `<listing>`, live with no bid, its starting price `<start>`.

**Test data:**

| `<start>` | `<opening>` | `<next>` |
| --- | --- | --- |
| USD280 | USD280 | USD305 (USD280 plus the USD25 step) |
| USD0 | USD1, the lowest step | USD2 |
| USD7 (fixed boundary: under USD10) | USD7 | USD8 |
| USD120.50, stored before the whole-dollar rule | USD121, the next whole dollar | USD131 (USD121 plus the USD10 step) |

**Steps:**

1. Read the starting price and Min.
2. Place `<opening>`, reload, and read Highest bid, the bid count, the starting price and Min.

**Expected Results:**

* Step 1 reads the starting price `<start>` and Min `<opening>`.
* Step 2 reads Highest bid `<opening>`, one bid, the starting price still `<start>`, and Min `<next>`.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=5 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC7: A first bid below the opening price cannot be placed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer is on `<listing>`, live with no bid, starting at USD280.

**Steps:**

1. Enter USD279 and confirm.
2. Reload and read Highest bid and the bid count.

**Expected Results:**

* Step 1 is refused, naming Minimum bid USD280.
* Step 2 reads no bid.

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=2 covers=g10.auction-bid-increments.SC-mn9 -->
### g10.auction-bid-increments.US1-TC2: The minimum adds the step of the tier holding the current bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer holds no bid on `<listing>`, live at a current bid of `<current>` placed by another customer.

**Test data:**

| `<current>` | `<min>` |
| --- | --- |
| USD6, inside the lowest tier | USD7 |
| USD999 (fixed boundary: one dollar below a tier's bound) | USD1,049 (the USD50 step) |
| USD1,000 (fixed boundary: a tier's bound) | USD1,100 (the USD100 step) |
| USD1,200, inside a middle tier | USD1,300 |
| USD2,000,000, inside the unbounded last tier | USD2,100,000 |

**Steps:**

1. Read Min.
2. Place `<min>`, reload, and read Highest bid, the bid count and Recent bids.

**Expected Results:**

* Step 1 reads Min `<min>`.
* Step 2 reads Highest bid `<min>`, the count one higher, and the bid as You.

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC3: An amount above the minimum is accepted as entered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* customer holds no bid on `<listing>`, live at USD1,200 with Min USD1,300, and no other maximum.

**Steps:**

1. Place USD1,457.
2. Reload and read Highest bid.

**Expected Results:**

* Step 1 is accepted; step 2 reads Highest bid USD1,457.

<!-- trace:case id=g10.auction-bid-increments.TC-d1v rev=1 -->
### g10.auction-bid-increments.US1-TC11: A maximum answers by the step of the tier of the amount it beats

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer A holds a maximum of `<leader maximum>` on `<listing>`, which is `<state>`; customer C is on its page.

**Test data:**

| `<leader maximum>` | `<state>` | `<challenge>` | `<price>` |
| --- | --- | --- | --- |
| USD6,000 | open, starting at USD120 | customer B sets a maximum of USD1,200 | USD1,300, customer A leading |
| USD6,000 | open, starting at USD120 | customer B sets a maximum of USD2,500 (fixed boundary: a tier's bound) | USD2,750, customer A leading |
| USD6,000 | open, at USD1,200 with no other bidder | customer B places USD1,200 | USD1,300, customer A leading |
| USD1,250, leading at USD1,200 | open | an admin commits an internal bid of USD3,000 | USD1,350, the house leading |
| USD1,250, leading at USD1,200 | in extended bidding | customer B places a maximum of USD3,000 | USD1,350, customer B leading |

**Steps:**

1. Make `<challenge>`.
2. As customer C, read Highest bid, the leader and Recent bids.

**Expected Results:**

* Highest bid reads `<price>`, never the challenge plus the leader's own tier step, with no bid recorded in between.

<!-- trace:case id=g10.auction-bid-increments.TC-jbt rev=1 covers=g10.auction-bid-increments.SC-kc7 -->
### g10.auction-bid-increments.US1-TC17: A starting price with cents is refused in the editor

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* admin(holds auction:operate) is on draft `<listing>`'s editor, starting price USD120.

**Steps:**

1. Enter USD120.50 and save.
2. Reload, then enter USD121 and save.

**Expected Results:**

* Step 1 is refused, naming the whole-dollar rule.
* Step 2 reads USD120 after the reload, and USD121 saves.

---

## g10.auction-bid-increments.US2: Collector bids up to the ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-xdy rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC1: A bid equal to the ceiling is accepted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* customer(card linked) is on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<minimum>` | USD9,999,900 (range: at or below the ceiling) |
| `<bid amount>` | USD10,000,000 (fixed boundary: the ceiling) |

**Steps:**

1. Enter `<bid amount>` and confirm the bid.

**Expected Results:**

* The bid is accepted at `<bid amount>`.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=4 covers=g10.auction-bid-increments.SC-hm3 -->
### g10.auction-bid-increments.US2-TC2: An amount past the ceiling becomes the ceiling in the field, with no message

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer(card linked) is on an open USD listing's page in `<mode>`, whose minimum next bid is at or below USD60,500, with `<draft>` typed in the custom maximum.

**Test data:**

| `<mode>` | `<draft>` | `<entry>` |
| --- | --- | --- |
| Set maximum | 500 | Select the draft and paste 10000001 |
| Set maximum | 500 | Select the draft and drop the dragged text 10000001 on it |
| Raise | 500 | Select the draft and paste 10000001 |
| Raise | 500 | Put the caret at the end and paste 10000001 without selecting |
| Set maximum | 500 | Select the draft and paste 10000001.99 |
| Set maximum | 500 | Select the draft and paste 999999999999999999999999999999.99 |
| Raise | 500 | Select the draft and paste 10000000.99 |
| Set maximum | 10000000 | Type 1 at the end |
| Raise | 10000000 | Paste 1 at the end |

**Steps:**

1. Make `<entry>`, and read the field, the reviewed amount and the messages around it.
2. Confirm, then read Your maximum, Highest bid and the bid count.

**Expected Results:**

* Step 1: the field and the reviewed amount read 10000000, cents dropped without rounding; no maximum-bid, invalid-amount or below-minimum message shows.
* Step 2: Your maximum reads USD10,000,000, and no amount above it is recorded.

<!-- trace:case id=g10.auction-bid-increments.TC-gti rev=1 -->
### g10.auction-bid-increments.US2-TC3: Quick bids past the ceiling are offered once, at the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer(card linked) leads an open USD listing with a maximum of `<maximum>` and is on its page with Raise.

**Test data:**

| `<maximum>` | `<chips>` |
| --- | --- |
| USD9,750,000 | USD9,850,000; USD9,950,000; USD10,000,000 |
| USD9,850,000 | USD9,950,000; USD10,000,000 (the 2× and 4× chips merged) |
| USD9,950,000 | USD10,000,000 only (every step passes the ceiling) |

**Steps:**

1. Read each quick-bid chip's amount and caption.
2. Select the chip at USD10,000,000, confirm, and read Your maximum.

**Expected Results:**

* Step 1 shows `<chips>`, none above USD10,000,000; the ceiling chip is captioned as the auction's limit, and every other chip keeps its step and caption.
* Step 2 reads USD10,000,000.

<!-- trace:case id=g10.auction-bid-increments.TC-dlw rev=1 -->
### g10.auction-bid-increments.US2-TC4: With no amount left below the ceiling, the bid entry collapses

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer is on an open USD listing's page, in `<standing>`.

**Test data:**

| `<standing>` | `<status row>` |
| --- | --- |
| Leading with a maximum of USD10,000,000 at a current bid of USD1,200, card linked | Max USD10,000,000 with its Info tip, and that the auction accepts no higher amount |
| Leading with a maximum of USD9,999,950 at a current bid of USD9,999,950 (the next minimum, USD10,099,950, is past the ceiling), card linked | Max USD9,999,950 with its Info tip, and that the auction accepts no higher amount |
| Holding no maximum, at a current bid of USD9,950,000, card linked | USD10,000,000, and that bidding has reached the highest amount the auction accepts |
| Leading with a maximum of USD10,000,000, card on file since removed | Max USD10,000,000 with its Info tip, and that the auction accepts no higher amount |

**Steps:**

1. Read the bid panel's entry area.

**Expected Results:**

* No quick-bid chip, custom maximum field, bid action or link-card action shows; a status row reads `<status row>`, with no line on how to raise; the buyer-fee line still shows.

---

## g10.auction-bid-increments.US3: Collector bids in USD on every lot

**As a** collector,
**I want** every lot priced and bid in USD with one increment schedule,
**so that** I compare lots and place bids in one unit.

<!-- trace:case id=g10.auction-bid-increments.TC-y0l rev=1 -->
### g10.auction-bid-increments.US3-TC1: Every listing bids in USD on one schedule, whatever it was created in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* `<listing X>` and `<listing Y>` are open at a current bid of USD8,000; `<listing X>` was `<created in>`.

**Test data:**

| `<created in>` |
| --- |
| USD |
| HKD, and overwritten to USD with its amounts unchanged |

**Steps:**

1. Read Highest bid and Min on both listings.

**Expected Results:**

* Both read Highest bid USD8,000 and Min USD8,500 (the USD500 step), in USD, with no HKD amount.

<!-- trace:case id=g10.auction-bid-increments.TC-pn8 rev=2 covers=g10.auction-bid-increments.SC-ws7 -->
### g10.auction-bid-increments.US3-TC4: A bid reads in USD from the field to the record

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* customer is on `<listing>`, live at USD1,200.

**Steps:**

1. Read Highest bid, Min, the quick bids and the bid field's currency.
2. Place USD1,300, reload, and read Highest bid and Recent bids.

**Expected Results:**

* Every amount and the field read USD, Min USD1,300; step 2 reads USD1,300 in USD everywhere.

---

## Settled

- Before any accepted bid the minimum is the opening price: the starting price, or the lowest configured increment on a 0 start; a stored starting price with cents opens at the next whole dollar while the page still shows the stored price.
- A first bid of 0, or of one cent, is a non-goal; no case asserts either.
- Where a lone maximum above the opening price stands is the auto-bidding suite's; this suite asserts only the minimum.
- An open page's Min refreshes on its next read or bid attempt, not live; a bid below the minimum the server now holds is refused, names that minimum, and records nothing.
- A standing maximum reads the schedule in force each time it answers a bid; it keeps its amount, and earlier resolutions stand.
- A bid, a maximum, every tier bound and every increment are whole dollars; one dollar below a bound is in the lower tier.
- A starting price an operator or a consignment ask sets is whole dollars; a price already stored with cents is left as it is.
- Every bid surface reads USD only; a USD fact becomes HKD only at settlement.
- The custom field stops or corrects oversized entry at the ceiling; a typed digit past the ceiling is dropped, and an oversized paste becomes the ceiling after whole-dollar cleaning, with no message.
- Quick bids step 1×, 2× and 4× the increment, from the committed maximum for a leader and from the current bid otherwise.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US3-TC2` walks an amount below the minimum refused, naming it, and recording nothing
