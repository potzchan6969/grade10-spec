# grade10-site/auction/bid-increments Test Cases

**Status:** reopened · 2/23
**Reviewed:** 2026-09-22, tcs-rules r3, lapsed 2026-10-02
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page on the Grade10 site of the environment under test shows Highest bid and, on its bid panel, Min, the minimum next bid. Every listing is priced and bid in USD.
* The increment comes from the configured schedule in force, the table on the Bidding PRD page: a tier owns its lower bound, the last tier has none, and every bound and increment is whole dollars. In force today: +USD1 from USD0, +USD2 from USD10, +USD5 from USD50, +USD10 from USD100, +USD25 from USD200, +USD50 from USD500, +USD100 from USD1,000, +USD250 from USD2,500, +USD500 from USD5,000, up to +USD100,000 from USD1,500,000.
* The bid ceiling is USD10,000,000.

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=2 covers=g10.auction-bid-increments.SC-vqb -->
### g10.auction-bid-increments.US1-TC1: A priced start opens at the starting price

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

* customer(card linked) is signed in on `<listing_1>`, which is live with no bids and starts at `<starting price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A live USD listing with no bids |
| `<starting price>` | USD120 (range: any whole-dollar amount above 0) |

**Steps:**

1. Read Min.
2. Enter `<starting price>` and select Place Bid.
3. Reload and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min `<starting price>`, with no increment added.
* Step 2 accepts the bid.
* Step 3 reads Highest bid `<starting price>`, bid count 1, and the bid as You.

<!-- trace:case id=g10.auction-bid-increments.TC-ujz rev=1 covers=g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC9: A zero start opens at the lowest configured increment

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer(card linked) is signed in on `<listing_3>`, which is live with no bids and starts at USD0.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A live USD listing with no bids, starting at USD0 (fixed boundary) |
| `<lowest increment>` | The increment of the tier from USD0 in the schedule in force (USD1 today) |

**Steps:**

1. Read Min.
2. Enter `<lowest increment>` and select Place Bid.
3. Reload and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min `<lowest increment>`.
* Step 2 accepts the bid.
* Step 3 reads Highest bid `<lowest increment>` and bid count 1.

<!-- trace:case id=g10.auction-bid-increments.TC-0es rev=1 covers=g10.auction-bid-increments.SC-n5d -->
### g10.auction-bid-increments.US1-TC19: A stored starting price with cents opens at the next whole dollar

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer(card linked) is signed in on `<listing_14>`, which is live with no bids and was stored, before the whole-dollar rule, with a starting price of `<stored price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | A live USD listing with no bids, seeded with a starting price that has cents |
| `<stored price>` | USD120.50 (fixed boundary: between two whole dollars) |
| `<opening minimum>` | USD121 (fixed derived): the next whole dollar at or above `<stored price>` |

**Steps:**

1. Read the starting price and Min.
2. Enter `<opening minimum>` and select Place Bid.
3. Reload and read the starting price, Highest bid and the bid count.

**Expected Results:**

* Step 1 reads the starting price `<stored price>` and Min `<opening minimum>`.
* Step 2 accepts the bid.
* Step 3 reads Highest bid `<opening minimum>`, bid count 1, and the starting price still `<stored price>`.

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=4 covers=g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t -->
### g10.auction-bid-increments.US1-TC6: A first bid at the opening price moves the minimum up one step

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

* customer(card linked) is on an open listing starting at `<starting price>`, with no accepted bid.

**Test data:**

| `<starting price>` | `<first bid>` | `<minimum next>` | `<higher bid>` |
| --- | --- | --- | --- |
| USD0 (fixed boundary) | USD1 | USD2, plus the USD1 step | USD3 |
| USD100 (fixed boundary: the USD100 tier) | USD100 | USD110, plus the USD10 step | USD120 |

**Steps:**

1. Enter `<first bid>` and confirm it.
2. Read Min.
3. Enter `<higher bid>` and confirm it, then read Highest bid.

**Expected Results:**

* Step 1 accepts the bid.
* Step 2 reads `<minimum next>`.
* Step 3 accepts the bid, and Highest bid reads `<higher bid>`.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=5 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC7: A first bid below the opening price cannot be placed

Runs once per row of **Test data**.

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

* customer(card linked) is on an open listing opening at `<opening price>`, with no accepted bid.

**Test data:**

| `<opening price>` | `<bid amount>` |
| --- | --- |
| USD100 (fixed boundary: a tier bound) | USD99 (fixed boundary: one dollar below) |
| USD105 | USD104 (fixed boundary: one dollar below) |

**Steps:**

1. Enter `<bid amount>` in the custom maximum and read the bid panel.
2. Reload and read the bid panel.

**Expected Results:**

* Step 1 reads Min `<opening price>`, and the bid action stays disabled.
* Step 2 shows no accepted bid and Min `<opening price>`.

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=2 covers=g10.auction-bid-increments.SC-mn9 -->
### g10.auction-bid-increments.US1-TC2: A price on a tier bound takes that tier's step

Runs once per row of **Test data**, for every configured tier after the first.

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

* customer(card linked) holds no bid on `<listing_2>` and is on it; `<listing_2>` is live, its current bid `<current bid>`, placed by another customer.

**Test data:**

| `<current bid>` | `<step from>` | Example in the schedule in force |
| --- | --- | --- |
| The tier's lower bound (fixed boundary) | That tier | USD1,000, so Min reads USD1,100 |
| One dollar below the tier's lower bound (fixed boundary) | The tier just below | USD999, so Min reads USD1,049 |

| Field | Value |
| --- | --- |
| `<listing_2>` | A live USD listing with bids from other customers |
| `<minimum next>` | `<current bid>` plus `<step from>`'s increment |

**Steps:**

1. Read Min.
2. Enter `<minimum next>` and select Place Bid.
3. Reload and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min `<minimum next>`.
* Step 2 accepts the bid.
* Step 3 reads Highest bid `<minimum next>`, and the bid count rose by one.

<!-- trace:case id=g10.auction-bid-increments.TC-de8 rev=1 covers=g10.auction-bid-increments.SC-xjw -->
### g10.auction-bid-increments.US1-TC10: The minimum adds the step of the tier holding the current bid

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

* customer(card linked) holds no bid on `<listing_4>` and is on it; `<listing_4>` is live, its current bid `<current bid>`, placed by another customer.

**Test data:**

| `<current bid>` | Example in the schedule in force |
| --- | --- |
| Inside the lowest tier, above 0 | USD6, so Min reads USD7 |
| Inside a middle tier, away from both bounds | USD1,200, so Min reads USD1,300 |
| Inside the unbounded last tier | USD2,000,000, so Min reads USD2,100,000 |

| Field | Value |
| --- | --- |
| `<listing_4>` | A live USD listing with bids from other customers |
| `<minimum next>` | `<current bid>` plus its tier's increment |
| `<below minimum>` | One dollar below `<minimum next>` (fixed boundary) |

**Steps:**

1. Read Min, then enter `<below minimum>` and read the bid form.
2. Enter `<minimum next>` and select Place Bid.
3. Reload and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min `<minimum next>`, and the form will not place `<below minimum>`.
* Step 2 accepts the bid.
* Step 3 reads Highest bid `<minimum next>`, the bid count one higher, and the bid as You.

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC3: An amount above the minimum is accepted as entered

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* customer(card linked) is on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<minimum>` | USD105 (range: 10000–49999 minor units) |
| `<bid amount>` | USD126 (range: above `<minimum>`, not on a step) |

**Steps:**

1. Enter `<bid amount>` and confirm the bid.

**Expected Results:**

* The bid is accepted at `<bid amount>`, unrounded.

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=2 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC4: An amount below the minimum is refused, naming it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* customer(card linked) is on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<minimum>` | USD105 (range: 10000–49999 minor units) |
| `<bid amount>` | USD104 (fixed boundary: one dollar below `<minimum>`) |

**Steps:**

1. Enter `<bid amount>` and confirm the bid.

**Expected Results:**

* The bid is refused, naming `<minimum>` as the minimum.

<!-- trace:case id=g10.auction-bid-increments.TC-d1v rev=1 -->
### g10.auction-bid-increments.US1-TC11: A beaten maximum is passed by its own tier's step

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

* customer A and customer B(each card linked) are on `<listing_5>` in separate sessions; it is live with no bids, starting at USD120.

**Test data:**

| `<customer B maximum>` | `<resolved price>` |
| --- | --- |
| USD1,200, inside the USD1,000 tier | USD1,300, plus that tier's USD100 |
| USD2,500, on the USD2,500 tier's bound (fixed boundary) | USD2,750, plus that tier's USD250 |

| Field | Value |
| --- | --- |
| `<listing_5>` | A live USD listing with no bids |
| `<customer A maximum>` | USD6,000, in a tier with another step (USD500) |

**Steps:**

1. As customer A, set a maximum of `<customer A maximum>` and confirm.
2. As customer B, set a maximum of `<customer B maximum>` and confirm.
3. As customer A, reload and read Highest bid and Recent Bids.

**Expected Results:**

* After step 1 customer A leads at USD120; after step 2 customer A still leads.
* Step 3 reads Highest bid `<resolved price>`, not `<customer B maximum>` plus USD500, with no bid recorded in between.

<!-- trace:case id=g10.auction-bid-increments.TC-fjl rev=1 -->
### g10.auction-bid-increments.US1-TC12: A maximum answers a manual bid at that bid plus its tier's step

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

* customer A and customer B(each card linked) are on `<listing_6>` in separate sessions; it is live with no bids, starting at `<starting price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live USD listing with no bids |
| `<starting price>` | USD1,200 (range: inside a tier above the lowest, away from its bounds) |
| `<customer A maximum>` | USD6,000 (range: two tiers or more above `<starting price>`) |
| `<resolved price>` | USD1,300 (fixed derived): `<starting price>` plus its tier's USD100 |

**Steps:**

1. As customer A, set a maximum of `<customer A maximum>` and confirm.
2. As customer B, read Min, then enter `<starting price>` and select Place Bid.
3. As customer A, reload and read Highest bid and Your maximum.

**Expected Results:**

* Step 2 reads Min `<starting price>`.
* Step 3 reads Highest bid `<resolved price>`, customer A still leading with Your maximum `<customer A maximum>`.

<!-- trace:case id=g10.auction-bid-increments.TC-25k rev=1 -->
### g10.auction-bid-increments.US1-TC20: The house's maximum and a bid in extended bidding read the same schedule

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

* customer A leads `<listing_7>` at USD1,200 with a maximum of USD1,250, and `<listing_7>` is `<state>`.
* customer C is on `<listing_7>`'s page.

**Test data:**

| `<state>` | `<bidder>` | `<move>` |
| --- | --- | --- |
| Open | admin(holds auction:reserve) | Set an internal bid of USD3,000, committing now |
| In extended bidding | customer B(card linked) | Place a maximum of USD3,000 |

| Field | Value |
| --- | --- |
| `<listing_7>` | A USD listing |
| `<resolved price>` | USD1,350 (fixed derived): customer A's USD1,250 plus the USD100 step of its tier |

**Steps:**

1. As `<bidder>`, `<move>`.
2. As customer C, read Highest bid and the leader.

**Expected Results:**

* Step 2 reads Highest bid `<resolved price>`, the new maximum leading.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=2 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC5: A listing shows its minimum in USD

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open listing is published.

**Steps:**

1. Open the listing and read Min.

**Expected Results:**

* Min reads in USD, and no other currency shows.

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

* admin(holds auction:operate) is on `<listing_15>`'s editor; it is a draft with starting price `<starting price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_15>` | A draft listing |
| `<starting price>` | USD120 (range: any whole-dollar amount) |
| `<price with cents>` | USD120.50 (fixed boundary) |

**Steps:**

1. Enter `<price with cents>` and save the draft, then read the field and its message.
2. Reload the editor and read the starting price.
3. Enter `<starting price>` and save.

**Expected Results:**

* Step 1 refuses the save, the message naming the whole-dollar rule.
* Step 2 reads `<starting price>`.
* Step 3 saves, so the refusal was for the cents.

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
### g10.auction-bid-increments.US3-TC1: Every open listing prices and bids in USD on one schedule

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* Two open listings stand at prices in different tiers of the schedule.

**Steps:**

1. Open each listing and read its amounts, Min and the bid field's currency.

**Expected Results:**

* Both show USD amounts and take USD bids, each Min following the one schedule.
* No HKD or JPY amount or tier shows.

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=2 covers=g10.auction-bid-increments.SC-tke -->
### g10.auction-bid-increments.US3-TC3: A listing once priced in HKD bids on the USD schedule

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* customer(card linked) is on `<listing_10>`, open in USD with an accepted bid of `<current bid>`.

**Test data:**

| `<listing_10>` |
| --- |
| A listing created in USD |
| A listing created in HKD and overwritten to USD, its amounts unchanged |

| Field | Value |
| --- | --- |
| `<current bid>` | USD8,000 (range: above 0) |
| `<minimum next>` | USD8,500 (fixed derived): `<current bid>` plus the USD500 step |

**Steps:**

1. Read Highest bid and Min.

**Expected Results:**

* Highest bid reads `<current bid>` and Min `<minimum next>`, both in USD, with no HKD amount.

<!-- trace:case id=g10.auction-bid-increments.TC-pn8 rev=2 covers=g10.auction-bid-increments.SC-ws7 -->
### g10.auction-bid-increments.US3-TC4: An open listing's amounts all read in USD

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* An open listing has a starting price, an accepted bid and a minimum next bid.

**Steps:**

1. Open the listing and read its starting price, Highest bid and Min.

**Expected Results:**

* Each reads in USD, and no other bid currency shows.

<!-- trace:case id=g10.auction-bid-increments.TC-hod rev=1 covers=g10.auction-bid-increments.SC-p50 -->
### g10.auction-bid-increments.US3-TC5: Two listings at one price share one step

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

* `<listing_11>` and `<listing_12>` are live in different categories, with different starting prices, each at a current bid of `<current bid>` placed by another customer.

**Test data:**

| Field | Value |
| --- | --- |
| `<current bid>` | USD1,200 (range: inside a tier above the lowest, away from its bounds) |
| `<minimum next>` | USD1,300 (fixed derived): plus the tier's USD100 |

**Steps:**

1. Open `<listing_11>`, then `<listing_12>`, and read Highest bid and Min on each.

**Expected Results:**

* Both read Highest bid `<current bid>` and Min `<minimum next>`.

<!-- trace:case id=g10.auction-bid-increments.TC-zdo rev=1 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US3-TC6: A bid reads in USD from the field to the record

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* customer(card linked) is on `<listing_13>`, live in USD at a current bid of `<current bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<current bid>` | USD1,200 (range: inside a tier above the lowest) |
| `<minimum next>` | USD1,300 (fixed derived): plus the tier's USD100 |

**Steps:**

1. Read Highest bid, Min and the bid field's currency.
2. Enter `<minimum next>` and select Place Bid.
3. Reload and read Highest bid and Recent Bids.

**Expected Results:**

* Step 1 reads USD throughout, and the field takes USD.
* Step 2 accepts the bid.
* Step 3 reads Highest bid `<minimum next>` in USD, and the bid in Recent Bids in USD.

## Settled

- Before any accepted bid the minimum is the opening price: the starting price, or the lowest configured increment on a 0 start; a stored starting price with cents opens at the next whole dollar while the page still shows the stored price. From the first accepted bid, the current bid plus its tier's increment applies.
- A first bid of 0, or of one minor unit, is a non-goal; no case asserts either.
- Where a lone maximum above the opening price stands is the auto-bidding suite's; this suite asserts only the minimum.
- An open page's Min refreshes on its next read or bid attempt, not live; a bid or a maximum below the minimum the server now holds is refused, names that minimum, and records nothing.
- A standing maximum reads the schedule in force each time it answers a bid; it keeps its amount, and earlier resolutions stand.
- A bid, a maximum, every tier bound and every increment are whole dollars; a bid with cents is refused, naming the rule, and nothing moves. One dollar below a bound is in the lower tier.
- A starting price an operator or a consignment ask sets is whole dollars; one with cents is refused, naming the rule. A price already stored with cents is left as it is.
- Every bid surface reads USD only; a USD fact becomes HKD only at settlement.
- A house maximum and an extended-bidding bid read the same schedule as any bid.
- The schedule's shape is held valid by a test in CI; no runtime check refuses a bad file, and no case drives one.
- The custom field stops or corrects oversized entry at the ceiling; the service's ceiling refusal is unchanged.
- A typed digit that passes the ceiling is dropped and keeps the draft; an oversized paste or replacement becomes the ceiling after whole-dollar cleaning; neither shows a maximum-bid or invalid-amount message, in Set maximum or Raise.
- Quick bids step 1×, 2× and 4× the increment, from the committed maximum for a leader and from the current bid otherwise; a leader's typed floor is the maximum plus USD1 and is not chip 1.
