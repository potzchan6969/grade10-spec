# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Every bid is a maximum: Grade10 bids for its holder up to it. Of two maxima the price is the lower one plus the step of its tier, capped at the higher; an equal later maximum is accepted and the earlier one keeps the lead. Grade10 never steps through the amounts between.
* Every listing is priced in USD, whole dollars: +USD1 from USD0, +USD25 from USD200, +USD50 from USD500, +USD500 from USD5,000, +USD3,000 from USD30,000. Collectors are signed in with a card linked, on separate sessions.
* An operator reads a listing's committed maximums in its bid history on Listings in the admin console.

## Walk 1: Two collectors trade maxima

Starting state:

- `<listing>` is open at USD100 with no bid; customer A and customer B are on its page.

Shared test data:

| Field | Value |
| --- | --- |
| listing | An open USD listing starting at USD100 |

### Route

1. As customer A, commit a maximum of USD500.
   - customer A leads at USD100, reading Your maximum USD500 apart from Highest bid. `g10.auction-auto-bidding.US1-TC1`
2. As customer B, commit USD450, then USD500.
   - USD475, then USD500 with customer A leading as the earlier maximum, the records side by side. `g10.auction-auto-bidding.US3-TC1`
3. As customer B, read the panel.
   - Your maximum USD500, Highest bid USD500, not leading. `g10.auction-auto-bidding.US2-TC1`
4. As customer A, raise to USD800, then try USD600.
   - The raise keeps the price; the lower one is refused. `g10.auction-auto-bidding.US1-TC3`

## g10.auction-auto-bidding.US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

### g10.auction-auto-bidding.US1-TC1: A first maximum leads at the opening price, its cap hidden

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
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

* customer is on `<listing>`, open with no bid, starting at `<start>`; customer B watches it from another session.

**Test data:**

| `<start>` | `<maximum>` | `<price>` |
| --- | --- | --- |
| USD56 | USD235 | USD56 |
| USD2,350 | USD23,500 | USD2,350 |
| USD0 | USD1 (fixed boundary: the minimum) | USD1 |
| USD0 | USD500 (fixed boundary: a tier's bound) | USD1 |
| USD0 | USD47,000 | USD1, not the step of the maximum's tier |

**Steps:**

1. Commit `<maximum>`.
2. Read Highest bid, the leader, the bid count and Recent bids; as customer B, read the page.

**Expected Results:**

* customer leads at `<price>` with one bid; customer B reads `<price>`, and `<maximum>` shows nowhere to customer B.

<!-- trace:case id=g10.auction-auto-bidding.TC-ic0 rev=3 covers=g10.auction-auto-bidding.SC-qbr -->
### g10.auction-auto-bidding.US1-TC8: A second maximum on a zero start must clear the opening price by a step

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

* `<listing>` starts at USD0; customer A's maximum of USD560 stands alone at USD1; customer B is on its page.

**Test data:**

| `<customer B maximum>` | `<outcome>` | `<price after>` |
| --- | --- | --- |
| USD1 (fixed boundary: the opening price) | refused, naming USD2 | USD1 |
| USD2 (fixed boundary: a step above) | accepted | USD3 (USD2 plus the USD1 step) |

**Steps:**

1. As customer B, commit `<customer B maximum>`.
2. Read Highest bid, the leader and Recent bids.

**Expected Results:**

* Step 1 is `<outcome>`; step 2 reads `<price after>`, customer A leading, USD560 shown nowhere.

<!-- trace:case id=g10.auction-auto-bidding.TC-9qy rev=2 -->
### g10.auction-auto-bidding.US1-TC3: A leader's raise is accepted and leaves the price where it was

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

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer leads `<listing>` at USD280 with a maximum of USD560, and is on its page.

**Steps:**

1. Raise to USD1,120.
2. Read Your maximum, the leader and Highest bid.

**Expected Results:**

* Your maximum reads USD1,120; customer still leads at USD280.

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

* customer holds a maximum of `<held>` on `<listing>`, `<standing>`, and is on its page.

**Test data:**

| `<held>` | `<standing>` | `<attempt>` |
| --- | --- | --- |
| USD560 | leading at USD280 | USD300 |
| USD47,000 | leading at USD23,500 | USD23,500 |

**Steps:**

1. Commit `<attempt>`.
2. Read Your maximum.

**Expected Results:**

* Step 1 is refused; Your maximum still reads `<held>`.

---

## g10.auction-auto-bidding.US2: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

<!-- trace:case id=g10.auction-auto-bidding.TC-mjs rev=3 covers=g10.auction-auto-bidding.SC-nqo -->
### g10.auction-auto-bidding.US2-TC1: A bidder reads their maximum, the price and their standing as three facts

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
* **Trace:** grade10-site-auction-auto-bidding-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/auto-bidding/auto-bidding.spec.ts`

**Pre-conditions:**

* customer holds a maximum of `<maximum>` on `<listing>`, where `<situation>`.

**Test data:**

| `<maximum>` | `<situation>` | `<reads>` |
| --- | --- | --- |
| USD560 | customer leads at USD280 | Your maximum USD560, Highest bid USD280, Leading |
| USD560 | customer B then committed USD800 | Your maximum USD560, Highest bid USD610, Outbid |
| USD600 | customer committed USD600 after customer B's equal USD600 | Your maximum USD600, Highest bid USD600, not leading |

**Steps:**

1. Open `<listing>` and read the bid panel.

**Expected Results:**

* It reads `<reads>`.

---

## g10.auction-auto-bidding.US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

<!-- trace:case id=g10.auction-auto-bidding.TC-1qu rev=3 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-wgx -->
### g10.auction-auto-bidding.US3-TC1: Two maxima set the price once, from the lower plus its step, capped at the higher

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
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

* customer A leads `<listing>` at `<price before>` with a maximum of `<A maximum>`; customer B, holding `<B before>`, is on its page.

**Test data:**

| `<price before>` | `<A maximum>` | `<B before>` | `<B commits>` | `<price>` | `<leader>` |
| --- | --- | --- | --- | --- | --- |
| USD100 | USD500 | nothing | USD450 | USD475 (USD450 plus the USD25 step) | customer A |
| USD100 | USD500 | nothing | USD500 (fixed equality) | USD500; customer B's row, then customer A's automatic answer at the same time | customer A, the earlier maximum |
| USD100 | USD500 | nothing | USD501 (fixed boundary) | USD501 (USD500 plus USD50, capped at customer B's maximum) | customer B |
| USD100 | USD500 | nothing | USD600 | USD550 (USD500 plus the USD50 step) | customer B |
| USD30,000 | USD56,000 | USD28,000 | a raise to USD34,000 | USD37,000 (USD34,000 plus the USD3,000 step) | customer A |
| USD8,400 | USD8,400 | nothing | USD8,600 | USD8,600 (USD8,900 capped at customer B's maximum) | customer B |

**Steps:**

1. As customer B, commit `<B commits>`.
2. Read Highest bid, the leader and Recent bids.

**Expected Results:**

* Highest bid reads `<price>`, `<leader>` leads, and no bid is recorded between `<price before>` and `<price>`.

<!-- trace:case id=g10.auction-auto-bidding.TC-m47 rev=2 -->
### g10.auction-auto-bidding.US3-TC7: A collector's maximum meets the house's like any other, a tie going to the earlier

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing>` is open, starting at USD4,000, with an internal bid of USD6,000 at a set time; customer A is on its page.

**Test data:**

| `<when>` | `<customer A maximum>` | `<leader>` | `<price>` |
| --- | --- | --- | --- |
| after the internal bid's time | USD5,000 | the house | USD5,500 (USD5,000 plus the USD500 step) |
| after the internal bid's time | USD5,950 | the house | USD6,000 (capped at the house's maximum) |
| after the internal bid's time | USD7,000 | customer A | USD6,500 (USD6,000 plus the USD500 step) |
| before the internal bid's time | USD6,000 | customer A, the earlier maximum | USD6,000 |
| after the internal bid's time | USD6,000 | the house, the earlier maximum | USD6,000 |

**Steps:**

1. As customer A, commit `<customer A maximum>` `<when>`, and let the internal bid's time pass.
2. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* `<leader>` leads at `<price>`; customer A reads Leading or Outbid to match; the house's rows read under one listing pseudonym; tied rows list the earlier maximum first.

---

## g10.auction-auto-bidding.US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

<!-- trace:case id=g10.auction-auto-bidding.TC-63a rev=3 covers=g10.auction-auto-bidding.SC-j3t -->
### g10.auction-auto-bidding.US4-TC2: An operator reads every committed maximum, the house's included, with when each was accepted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* On `<listing>`, starting at USD200, the house's maximum was committed at USD250 at 18:00:00 UTC and raised to USD300 at 18:10:00; customer A committed USD400 at 18:20:00 and customer C USD600 at 18:30:00; the house's maximum was lowered to USD210 at 19:00:00.
* admin(holds auction:reserve and auction:operate) is on Listings.

**Steps:**

1. Open `<listing>`'s bid history.

**Expected Results:**

* Each commitment shows its bidder, its maximum and its Accepted At: the house's USD250, USD300 and USD210, customer A's USD400 and customer C's USD600, at those times.

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
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* customer A committed USD5,000 on `<listing>`; its internal bid of USD6,123 is committed and the house leads at USD5,500.
* admin(holds auction:operate, not auction:reserve) is on Listings.

**Steps:**

1. Open `<listing>`'s bid history.
2. As customer B, read `<listing>`'s Recent bids.

**Expected Results:**

* Step 1 lists customer A's commitment and the house's USD5,500 bid as House, each with its own Accepted At, and no house maximum, no USD6,123, no pseudonym for the house and no internal bid.
* Step 2 shows the house's bid under its listing pseudonym, and nothing reads House.

---

## g10.auction-auto-bidding.US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** every bid Grade10 places for me to count as a bid,
**so that** my auto-bids keep a listing open during extended bidding as a manual bid would.

<!-- trace:case id=g10.auction-auto-bidding.TC-y3w rev=2 -->
### g10.auction-auto-bidding.US5-TC8: An auto-bid in extended bidding counts as a bid and restarts the close once

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

* `<listing>` is in extended bidding, no cap, extension 30 minutes; customer A leads with a maximum of USD8,400; customer B is on its page.

**Steps:**

1. As customer B, commit USD5,700 and note the time.
2. Read Highest bid, the bid count and Time left.
3. Let the new close pass with no further commitment.

**Expected Results:**

* Step 2 reads USD6,200 (USD5,700 plus the USD500 step), placed on customer A's behalf and counted, and the close 30 minutes after the noted time.
* Step 3: neither maximum bids again before the close.

---

## Settled

- A first maximum on a 0 start must reach 0 plus the lowest step; a first bid of 0 is a non-goal, and no case asserts it.
- Committing or raising a maximum takes nothing from the card, and neither does a bid Grade10 places; a raise is accepted or refused on the auction's rules alone.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US3-TC2` walks a maximum below the minimum next bid refused; `g10.auction-dmn.US4-TC1` walks a rival who never reads the leader's maximum; `g10.auction-dmn.US13-TC1` walks a collector who learns nothing of the house beyond its pseudonym
