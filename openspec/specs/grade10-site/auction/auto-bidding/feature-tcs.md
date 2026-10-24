# grade10-site/auction/auto-bidding Test Cases

**Status:** reopened · 0/24
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page on the Grade10 site of the environment under test carries the bid panel: the custom maximum, Your maximum, Highest bid, the standing and Recent bids. `<admin listings url>` is the Auction listings page of the Grade10 admin console, where a listing's bid history opens.
* Every listing is priced in USD. The step is chosen by the amount being beaten: +USD1 from USD0, +USD10 from USD100, +USD25 from USD200, +USD50 from USD500, +USD100 from USD1,000, +USD500 from USD5,000, +USD2,000 from USD20,000 and +USD3,000 from USD30,000. A price from two maxima is the lower maximum plus its step, capped at the higher maximum.

## Walk 1: Commit, read, raise and lose a maximum on one listing

Starting state:

- customer A(card linked) is signed in on `<listing>`'s page; customer B(card linked) is on it in a separate session.
- `<listing>` is open, starting at `<starting price>`, with no bids.

Shared test data:

| Field | Value |
| --- | --- |
| listing | An open USD listing with no bids |
| starting price | USD56 |
| first maximum | USD235 |
| raised maximum | USD470 |
| customer B maximum | USD600 |

### Route

1. As customer A, enter `<first maximum>` in the custom maximum and confirm.
   - The commitment is accepted, the current bid reads `<starting price>`, and customer A leads. `g10.auction-auto-bidding.US1-TC1`
   - customer A reads Your maximum `<first maximum>`, Highest bid `<starting price>` and Leading, as three facts. `g10.auction-auto-bidding.US2-TC1`
2. As customer A, raise to `<raised maximum>` and confirm.
   - The raise is accepted, customer A still leads, and the current bid is unchanged. `g10.auction-auto-bidding.US1-TC3`
3. As customer A, enter `<first maximum>` as the maximum and confirm.
   - It is refused, and Your maximum stays `<raised maximum>`. `g10.auction-auto-bidding.US1-TC4`
4. As customer B, commit `<customer B maximum>`; as customer A, reload and read the bid panel.
   - customer A reads not leading, with Your maximum still `<raised maximum>`. `g10.auction-auto-bidding.US2-TC2`

## g10.auction-auto-bidding.US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

### g10.auction-auto-bidding.US1-TC1: A first maximum opens bidding at the starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer(card linked) is on `<listing_2>`, open with no bids, starting at `<starting price>`.

**Test data:**

| `<starting price>` | `<maximum>` |
| --- | --- |
| USD56 (range: 1–9999 minor units) | USD235 (range: 10000–49999 minor units) |
| USD28 (range: 1–9999 minor units) | USD280 (range: 10000–49999 minor units) |
| USD2,350 (range: 100000–499999 minor units) | USD23,500 (range: 1000000–999999999 minor units) |

**Steps:**

1. Enter `<maximum>` and confirm.
2. Read the current bid and the leader.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<starting price>`, the customer leading.

<!-- trace:case id=g10.auction-auto-bidding.TC-7gl rev=2 -->
### g10.auction-auto-bidding.US1-TC2: A maximum below the minimum next bid is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer(card linked) is on `<listing_4>`, open at a current bid of `<current bid>` set by another customer.

**Test data:**

| `<current bid>` | `<minimum next>` | `<attempted maximum>` |
| --- | --- | --- |
| USD235 | USD260, plus the USD25 step | USD259 (fixed boundary: one dollar below) |
| USD280 | USD305, plus the USD25 step | USD304 (fixed boundary: one dollar below) |
| USD23,500 | USD25,500, plus the USD2,000 step | USD25,499 (fixed boundary: one dollar below) |

**Steps:**

1. Enter `<attempted maximum>` and confirm.
2. Read the current bid and the leader.

**Expected Results:**

* Step 1 is refused, naming `<minimum next>`.
* Step 2 shows the current bid and the leader unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-9qy rev=2 -->
### g10.auction-auto-bidding.US1-TC3: A leader raises their own maximum and the price stays

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer leads `<listing_6>` with a maximum of `<committed maximum>` and is on its page.

**Test data:**

| `<committed maximum>` | `<raised maximum>` |
| --- | --- |
| USD235 | USD470 |
| USD280 | USD560 |
| USD23,500 | USD47,000 |

**Steps:**

1. Raise to `<raised maximum>` and confirm.
2. Read the leader and the current bid.

**Expected Results:**

* Step 1 is accepted.
* Step 2: customer still leads, and the current bid is unchanged.

<!-- trace:case id=g10.auction-auto-bidding.TC-vq3 rev=2 -->
### g10.auction-auto-bidding.US1-TC4: Lowering a maximum is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* customer holds a maximum of `<committed maximum>` on `<listing_8>` and is on its page.

**Test data:**

| `<committed maximum>` | `<attempted maximum>` |
| --- | --- |
| USD470 | USD235 |
| USD560 | USD280 |
| USD47,000 | USD23,500 |

**Steps:**

1. Enter `<attempted maximum>` and confirm.
2. Read Your maximum.

**Expected Results:**

* Step 1 is refused.
* Step 2 still reads `<committed maximum>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-j8v rev=3 -->
### g10.auction-auto-bidding.US1-TC5: A lone maximum on a zero start stands at the lowest step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auction/opening-price.spec.ts`

**Pre-conditions:**

* customer(card linked) is on `<listing_10>`, open, starting at USD0, with no maximum committed.

**Test data:**

| `<maximum>` |
| --- |
| USD1 (fixed boundary: the minimum) |
| USD10 (range: 1–9999 minor units) |
| USD100 (fixed boundary: a tier bound) |
| USD500 (fixed boundary: a tier bound) |
| USD920 (range: 50000–99999 minor units) |
| USD47,000 (range: above USD30,000) |

**Steps:**

1. Enter `<maximum>` and confirm.
2. Read the current bid, the leader, the bid count and Recent Bids.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads USD1, 0 plus the lowest step, not 0 and not the step of `<maximum>`'s tier; customer leads, with one bid at USD1.

<!-- trace:case id=g10.auction-auto-bidding.TC-ic0 rev=3 covers=g10.auction-auto-bidding.SC-qbr -->
### g10.auction-auto-bidding.US1-TC8: A second maximum on a zero start must clear the opening price by one step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* `<listing_16>` starts at USD0; customer A's maximum of USD560 stands alone at USD1.
* customer B(card linked) is on its page in a separate session.

**Test data:**

| `<customer B maximum>` | `<outcome>` | `<current bid after>` |
| --- | --- | --- |
| USD1 (fixed boundary: the opening price) | Refused, naming USD2 | USD1 |
| USD2 (fixed boundary: one step above) | Accepted | USD3, `<customer B maximum>` plus the USD1 step |

**Steps:**

1. As customer B, enter `<customer B maximum>` and confirm.
2. Read the current bid, the leader and Recent Bids.

**Expected Results:**

* Step 1: `<outcome>`.
* Step 2 reads `<current bid after>`, customer A leading, and USD560 shows nowhere.

---

## g10.auction-auto-bidding.US2: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

<!-- trace:case id=g10.auction-auto-bidding.TC-mjs rev=3 covers=g10.auction-auto-bidding.SC-nqo -->
### g10.auction-auto-bidding.US2-TC1: A bidder reads their maximum apart from the current bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer leads `<listing_18>` with a maximum of `<committed maximum>` at a current bid of `<current bid>`.

**Test data:**

| `<committed maximum>` | `<current bid>` |
| --- | --- |
| USD470 | USD235 |
| USD560 | USD280 |
| USD47,000 | USD23,500 |

**Steps:**

1. Open `<listing_18>` and read the bid panel.

**Expected Results:**

* It reads Your maximum `<committed maximum>`, Highest bid `<current bid>`, and Leading, as three facts.

<!-- trace:case id=g10.auction-auto-bidding.TC-13a rev=3 covers=g10.auction-auto-bidding.SC-dmo -->
### g10.auction-auto-bidding.US2-TC2: An overtaken bidder sees they no longer lead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer holds a maximum of `<maximum>` on `<listing_20>`, and another customer's higher maximum has overtaken it.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | USD470 (range: any accepted maximum) |

**Steps:**

1. Open `<listing_20>` and read the bid panel.

**Expected Results:**

* It reads Outbid, with Your maximum still `<maximum>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-7io rev=3 covers=g10.auction-auto-bidding.SC-x57 -->
### g10.auction-auto-bidding.US2-TC3: A rival never reads the leader's maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_22>` with a maximum of `<customer A maximum>` at `<current bid>`; customer B is signed in.

**Test data:**

| `<customer A maximum>` | `<current bid>` |
| --- | --- |
| USD470 | USD235 |
| USD560 | USD280 |
| USD47,000 | USD23,500 |

**Steps:**

1. As customer B, open `<listing_22>` and read the bid panel and Recent Bids.

**Expected Results:**

* Highest bid reads `<current bid>`.
* `<customer A maximum>` shows nowhere and cannot be worked out from what shows.

<!-- trace:case id=g10.auction-auto-bidding.TC-nmi rev=3 covers=g10.auction-auto-bidding.SC-eiw -->
### g10.auction-auto-bidding.US2-TC4: An equal maximum is accepted and reads as not leading

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer B leads `<listing_24>` with a maximum of USD600; customer C(card linked) is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<customer C maximum>` | USD600 (fixed equality: customer B's maximum) |

**Steps:**

1. As customer C, commit `<customer C maximum>`.
2. Read customer C's standing and Recent Bids.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads customer C not leading; Recent Bids shows customer C's bid, then customer B's automatic answer, both at USD600.

---

## g10.auction-auto-bidding.US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

<!-- trace:case id=g10.auction-auto-bidding.TC-1qu rev=3 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-wgx -->
### g10.auction-auto-bidding.US3-TC1: The price comes from the leader's and the challenger's maxima

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_26>` at USD100 with a maximum of USD500; customer B(card linked) is on its page.

**Test data:**

| `<customer B maximum>` | `<price>` | `<leader>` |
| --- | --- | --- |
| USD450 | USD475, the USD450 plus its USD25 step | customer A |
| USD500 (fixed equality) | USD500 | customer A, the earlier maximum |
| USD501 (fixed boundary) | USD501, customer A's USD500 plus USD50, capped at customer B's maximum | customer B |
| USD600 | USD550, customer A's USD500 plus its USD50 step | customer B |

**Steps:**

1. As customer B, commit `<customer B maximum>`.
2. Read the current bid, the leader and Recent Bids.

**Expected Results:**

* Step 2 reads `<price>` and `<leader>`, with no bid recorded between USD100 and `<price>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-hpg rev=3 covers=g10.auction-auto-bidding.SC-edj -->
### g10.auction-auto-bidding.US3-TC2: A challenger's raise still below the leader moves the price, not the lead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_28>` at USD30,000 with a maximum of USD56,000; customer B holds USD28,000.

**Test data:**

| Field | Value |
| --- | --- |
| `<raised maximum>` | USD34,000 (range: above USD30,000, below USD53,000) |
| `<price>` | USD37,000 (fixed derived): `<raised maximum>` plus the USD3,000 step |

**Steps:**

1. As customer B, raise to `<raised maximum>`.
2. Read the leader and the current bid.

**Expected Results:**

* customer A still leads, at `<price>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-29q rev=3 covers=g10.auction-auto-bidding.SC-xwb -->
### g10.auction-auto-bidding.US3-TC3: An overtaken bidder's raise to a tie leaves the earlier leader

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer B leads `<listing_30>` at USD33,000 with a maximum of USD34,000, having overtaken customer A's USD30,000.

**Test data:**

| Field | Value |
| --- | --- |
| `<raised maximum>` | USD34,000 (fixed equality: customer B's maximum) |

**Steps:**

1. As customer A, raise to `<raised maximum>`.
2. Read the leader and the current bid.

**Expected Results:**

* customer B still leads, at USD34,000.

<!-- trace:case id=g10.auction-auto-bidding.TC-s1n rev=3 covers=g10.auction-auto-bidding.SC-n5u -->
### g10.auction-auto-bidding.US3-TC4: An overtaken bidder's raise past the leader takes the lead

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer B leads `<listing_32>` at USD33,000 with a maximum of USD34,000, having overtaken customer A's USD30,000.

**Test data:**

| Field | Value |
| --- | --- |
| `<raised maximum>` | USD60,000 (range: above USD37,000) |
| `<price>` | USD37,000 (fixed derived): customer B's USD34,000 plus the USD3,000 step |

**Steps:**

1. As customer A, raise to `<raised maximum>`.
2. Read the leader and the current bid.

**Expected Results:**

* customer A leads, at `<price>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-wr4 rev=2 -->
### g10.auction-auto-bidding.US3-TC5: The price never passes the new leader's own maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_34>` with a maximum of USD8,400; customer B(card linked) is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<customer B maximum>` | USD8,600 (range: above USD8,400, below USD8,900) |
| `<price>` | USD8,600 (fixed derived): USD8,400 plus USD500 is USD8,900, capped at `<customer B maximum>` |

**Steps:**

1. As customer B, commit `<customer B maximum>`.
2. Read the leader and the current bid.

**Expected Results:**

* customer B leads, at `<price>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-7oh rev=3 covers=g10.auction-auto-bidding.SC-52s -->
### g10.auction-auto-bidding.US3-TC6: An equal maximum keeps the earlier leader, both records side by side

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer B leads `<listing_36>` with a maximum of USD600; customer C(card linked) is on its page.

**Steps:**

1. As customer C, commit USD600.
2. Read the leader, the current bid and Recent Bids.

**Expected Results:**

* customer B still leads at USD600.
* Recent Bids shows customer C's bid at USD600, then customer B's automatic answer at USD600, at the same time.

<!-- trace:case id=g10.auction-auto-bidding.TC-m47 rev=2 -->
### g10.auction-auto-bidding.US3-TC7: A collector's maximum meets the house's like any other

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_38>`'s internal bid of USD6,000 is committed, and the house leads at USD4,000 with no other bid.
* customer A(card linked) is on its page.

**Test data:**

| `<customer A maximum>` | `<leader>` | `<highest bid>` |
| --- | --- | --- |
| USD5,000 | The house | USD5,500, plus the USD500 step |
| USD5,950 | The house | USD6,000, capped at the house's maximum |
| USD7,000 | customer A | USD6,500, the house's USD6,000 plus USD500 |

**Steps:**

1. As customer A, commit `<customer A maximum>`.
2. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<leader>` and `<highest bid>`, customer A Outbid or Leading to match, and Recent bids lists customer A's bid and the house's answer under its listing pseudonym.

<!-- trace:case id=g10.auction-auto-bidding.TC-6gi rev=3 covers=g10.auction-auto-bidding.SC-gct -->
### g10.auction-auto-bidding.US3-TC8: A tie with the house stays with whoever committed first

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_40>` is open, starting at USD4,000, with an internal bid of USD6,000 set for a time ahead; customer A(card linked) is on its page.

**Test data:**

| `<order>` | `<leader>` |
| --- | --- |
| customer A commits USD6,000 before the internal bid's time | customer A |
| customer A commits USD6,000 after the internal bid's time | The house |

**Steps:**

1. Let the commitments happen in `<order>`.
2. As customer A, read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 2 reads `<leader>` at USD6,000, with both bids at USD6,000 in Recent bids, the earlier maximum's row first.

<!-- trace:case id=g10.auction-auto-bidding.TC-19o rev=3 covers=g10.auction-auto-bidding.SC-7m7 -->
### g10.auction-auto-bidding.US3-TC9: A collector learns nothing of the house beyond a pseudonym

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_42>`'s internal bid of USD6,000 is committed, and the house leads at USD5,500 over customer A's USD5,000.
* `<listing_43>` has no internal bid; customer B leads it at USD5,500 with a maximum of USD6,000 over customer A's USD5,000.
* customer C has never bid on either and is signed in.

**Steps:**

1. As customer C, read the bid panel, Highest bid and Recent bids on `<listing_42>`.
2. Read the same on `<listing_43>`.

**Expected Results:**

* Both read alike, save the pseudonyms and times: the leader's row carries a listing pseudonym, with no house, reserve or floor wording.
* Neither shows the leader's maximum, and the house's pseudonym differs on each listing.

<!-- trace:case id=g10.auction-auto-bidding.TC-9jg rev=3 covers=g10.auction-auto-bidding.SC-rh7,g10.auction-auto-bidding.SC-jd3 -->
### g10.auction-auto-bidding.US3-TC10: A bid just after the house's time meets the house first

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_44>` is open, starting at USD200, with no bids; its internal bid of USD500 is set for `<commit time>`.
* customer A and customer B(each card linked) have separate sessions.

**Test data:**

| Field | Value |
| --- | --- |
| `<commit time>` | 18:00:00 UTC (any time ahead) |
| `<customer A maximum>` | USD300 |
| `<house first bid>` | USD325 (fixed derived): `<customer A maximum>` plus the USD25 step |
| `<customer B maximum>` | USD400 |
| `<price after>` | USD425 (fixed derived): `<customer B maximum>` plus the USD25 step |

**Steps:**

1. Before `<commit time>`, as customer A, commit `<customer A maximum>` and read the bid panel.
2. Wait until `<commit time>` passes, opening no page on the listing.
3. Within a minute, as customer B, open the listing, commit `<customer B maximum>`, and read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 1 shows customer A leading at USD200, with one bid.
* Step 3: customer B reads Outbid at `<price after>`, the house leading under one pseudonym, and Recent bids lists the house's bid at `<house first bid>` timed at `<commit time>` before customer B's bid and the house's answer.

---

## g10.auction-auto-bidding.US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

<!-- trace:case id=g10.auction-auto-bidding.TC-de4 rev=3 covers=g10.auction-auto-bidding.SC-aqd -->
### g10.auction-auto-bidding.US4-TC1: An operator reads every committed maximum to answer a dispute

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on `<admin listings url>`; `<listing_46>` holds several committed maximums.

**Steps:**

1. Open `<listing_46>`'s bid history.

**Expected Results:**

* Each commitment shows its bidder, its maximum and its Accepted At.

<!-- trace:case id=g10.auction-auto-bidding.TC-63a rev=3 covers=g10.auction-auto-bidding.SC-j3t -->
### g10.auction-auto-bidding.US4-TC2: The house's commitment, raise and lower are traced with when each was accepted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* On `<listing_48>`, starting at USD200, the house maximum was committed at USD250 at 18:00:00 UTC and raised to USD300 at 18:10:00 UTC; customer A committed USD400 at 18:20:00 UTC and customer C USD600 at 18:30:00 UTC; the house maximum was lowered to USD210 at 19:00:00 UTC.
* admin(holds auction:reserve and auction:operate) is on `<admin listings url>`.

**Steps:**

1. Open `<listing_48>`'s bid history and read each committed maximum.

**Expected Results:**

* The house's USD250 at 18:00:00, USD300 at 18:10:00 and USD210 at 19:00:00 show.
* customer A's USD400 at 18:20:00 and customer C's USD600 at 18:30:00 show.

<!-- trace:case id=g10.auction-auto-bidding.TC-vzk rev=2 -->
### g10.auction-auto-bidding.US4-TC3: Staff without the reserve grant read House in the trace, never its maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* customer A committed USD5,000 on `<listing_50>`; its internal bid of `<house maximum>` is committed, and the house leads at USD5,500.
* admin(holds auction:operate, not auction:reserve) is on `<admin listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<house maximum>` | USD6,123 (an amount no bid reaches) |

**Steps:**

1. Open `<listing_50>`'s bid history and read each committed maximum and bid.
2. As customer B, open `<listing_50>`'s page and read Recent bids.

**Expected Results:**

* Step 1 lists customer A's commitment with its Accepted At, and the house's USD5,500 bid as House, with no account and its own Accepted At.
* Step 1 shows no house maximum, no `<house maximum>`, no listing pseudonym for the house, and no internal bid.
* Step 2 shows the house's bid under its listing pseudonym, with nothing reading House.

---

## g10.auction-auto-bidding.US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** every bid Grade10 places for me to count as a bid,
**so that** my auto-bids keep a listing open during extended bidding as a manual bid would.

<!-- trace:case id=g10.auction-auto-bidding.TC-y3w rev=2 -->
### g10.auction-auto-bidding.US5-TC8: An auto-bid in extended bidding restarts the close once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* `<listing_58>` is in extended bidding; customer A leads with a maximum of USD8,400; customer B(card linked) is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_58>` | A listing in extended bidding, no cap |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |
| `<customer B maximum>` | USD5,700 (range: below USD8,400) |
| `<price>` | USD6,200 (fixed derived): `<customer B maximum>` plus USD500 |

**Steps:**

1. As customer B, commit `<customer B maximum>` and note the time.
2. Read the current bid and Time left.
3. Wait until the new close passes with no further commitment.

**Expected Results:**

* Step 2 reads `<price>`, raised on customer A's behalf, and the close moved to the noted time plus `<extension duration>`.
* No further bid is placed by either maximum before the close.

## Settled

- A first maximum on a 0 start must reach 0 plus the lowest step; a first bid of 0 or of one minor unit is a non-goal, and no case asserts either.
- Committing or raising a maximum takes nothing from the card, and neither does a bid Grade10 places for a collector; a raise is accepted or refused on the auction's rules alone.
- An auto-bid step's price is US3's to assert.
- Operators read the house as House; only auction:reserve reads its maximum, and every commitment, raise and lower of it with its Accepted At, and the internal bidder it was committed as.
- A House bid shows any operator its own Accepted At, as the public history does, even where it equals the commit time.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US4-TC3` reads the refusal and the bid form's words of `grade10-site-auction-auto-bidding-SC-32`'s second half, a maximum not raised
- **Covered at domain** - `grade10-site-auction-auto-bidding-SC-33` is also walked by `g10.auction-dmn.US13-TC1`
