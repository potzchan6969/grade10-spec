# grade10-site/auction/bidder-suspension Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A suspended account's bid form reads **Bidding is suspended on this account. Contact Us to resolve it.** and sends nothing.
* My Auctions explains the suspension beside the order that caused it. `<g10adm users url>` is the admin Users page, whose account panel suspends and reinstates.
* Every listing is priced in USD. The step is +USD25 from USD200 and +USD50 from USD500.

## Walk 1: Collector misses a deadline, pays, and stays suspended

Starting state:

- customer(signed in) won `<won listing>`, whose invoice is due shortly and unpaid, and won `<paid listing>`, paid.
- customer holds a maximum of USD500 on open `<listing_5>`, and has not bid on open `<listing_6>`.
- customer has another issued, unpaid invoice for `<other listing>`.

Shared test data:

| Field | Value |
| --- | --- |
| won listing | A closed USD listing customer won, invoice unpaid |
| paid listing | A closed USD listing customer won and paid |
| other listing | A closed USD listing customer won, invoice issued and within its deadline |

### Route

1. Let `<won listing>`'s payment deadline pass, and open the suspension email.
   - It names what is owed and how to resolve it. `g10.auction-bidder-suspension.US1-TC1`
2. Open `<listing_5>` and raise the maximum to USD600; open `<listing_6>` and bid.
   - Both are refused with the suspension line; `<listing_5>` keeps USD500. `g10.auction-bidder-suspension.US1-TC1`
3. Open My Auctions.
   - The suspension shows beside `<won listing>`'s order; `<paid listing>` stays paid. `g10.auction-bidder-suspension.US1-TC1`
4. Open `<other listing>`'s order and pay it in full.
   - The payment is accepted. `g10.auction-bidder-suspension.US1-TC2`
5. Bid on `<listing_6>` again.
   - It is refused; My Auctions still shows the suspension. `g10.auction-bidder-suspension.US1-TC2`
6. Open the store, buy an item, and open the loyalty page.
   - Each works as for any customer. `g10.auction-bidder-suspension.US1-TC8`

## Walk 2: Operator suspends and reinstates a collector

Starting state:

- admin(holds auction:moderate) is on `<g10adm users url>`.
- customer(signed in) is not suspended, and has an invoice due shortly and unpaid.

Shared test data:

| Field | Value |
| --- | --- |
| operator reason | Payment review: overdue invoice |
| listing | An open USD listing customer has not bid on |

### Route

1. As admin, suspend customer with `<operator reason>`.
   - The account panel shows the reason, who suspended and when. `g10.auction-bidder-suspension.US3-TC1`
2. As customer, open the suspension email, then My Auctions, then bid on `<listing>`.
   - The email and My Auctions say customer cannot bid and how to contact Grade10, never `<operator reason>`; the bid is refused. `g10.auction-bidder-suspension.US3-TC1`
3. Let the invoice's payment deadline pass; as admin, reopen the account panel.
   - It shows one suspension with both causes. `g10.auction-bidder-suspension.US3-TC2`
4. Reinstate customer; as customer, bid on `<listing>`.
   - The bid is accepted; the panel keeps the suspension and its reason as history. `g10.auction-bidder-suspension.US3-TC3`

## g10.auction-bidder-suspension.US1: Collector who misses a deadline loses their auction standing

**As a** collector who let a payment deadline pass,
**I want** to be told plainly that I can no longer bid, what I still owe, and
how to resolve it,
**so that** I understand what I can still do and what it takes to bid again.

<!-- trace:case id=g10.auction-bidder-suspension.TC-7ui rev=2 -->
### g10.auction-bidder-suspension.US1-TC1: A missed deadline suspends bidding and says so at once

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* customer(signed in) won `<won listing>`, whose invoice is due shortly and unpaid; `<other order>`.
* customer holds a maximum of USD500 on open `<listing_5>`, and has not bid on open `<listing_6>`.

**Test data:**

| `<other order>` |
| --- |
| customer has no other order |
| customer won and paid `<paid listing>` |

**Steps:**

1. Let `<won listing>`'s payment deadline pass, and open the suspension email.
2. Open `<listing_5>` and raise the maximum to USD600.
3. Open `<listing_6>` and place a bid at the next minimum.
4. Open My Auctions.

**Expected Results:**

* Step 1 names what is owed and how to resolve it.
* Steps 2 and 3 are refused with the suspension line; `<listing_5>` keeps USD500.
* Step 4 shows the suspension beside `<won listing>`'s order; any `<paid listing>` stays paid.

<!-- trace:case id=g10.auction-bidder-suspension.TC-0fv rev=3 covers=g10.auction-bidder-suspension.SC-o11 -->
### g10.auction-bidder-suspension.US1-TC2: Paying what is owed does not lift the suspension

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* customer(signed in) is suspended, holds a maximum of USD500 on open `<listing_7>`, has not bid on open `<listing_8>`, and has an issued, unpaid invoice within its deadline.

**Steps:**

1. Open that order and pay the invoice in full.
2. Raise the maximum on `<listing_7>` to USD505.
3. Place a bid on `<listing_8>`.
4. Open My Auctions.

**Expected Results:**

* Step 1: the order reads Paid.
* Steps 2 and 3 are refused with the suspension line; `<listing_7>` keeps USD500.
* Step 4 still shows the suspension.

<!-- trace:case id=g10.auction-bidder-suspension.TC-3no rev=2 -->
### g10.auction-bidder-suspension.US1-TC7: Reissuing the expired invoice does not lift the suspension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* customer is suspended by `<expired order>`'s missed deadline; admin(holds auction:moderate) can reissue its invoice; customer has not bid on open `<listing>`.

**Steps:**

1. As admin, reissue `<expired order>`'s invoice with a new deadline.
2. As customer, open the order and pay it in full.
3. Place a bid on `<listing>`.
4. Open My Auctions.

**Expected Results:**

* Step 2: the order reads Paid.
* Step 3 is refused with the suspension line.
* Step 4 still shows the suspension.

<!-- trace:case id=g10.auction-bidder-suspension.TC-ixs rev=2 -->
### g10.auction-bidder-suspension.US1-TC8: A suspended account still signs in, shops and uses loyalty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* customer is suspended and signed out.

**Steps:**

1. Sign in.
2. Buy a store item.
3. Earn or redeem on the loyalty page.
4. Open My Auctions and an order.

**Expected Results:**

* Each step works as for an account that is not suspended.

<!-- trace:case id=g10.auction-bidder-suspension.TC-kz8 rev=2 -->
### g10.auction-bidder-suspension.US1-TC4: A lot won before the suspension stays won and payable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* customer(signed in) won `<won listing>` and its invoice is issued and within its deadline; customer is then suspended by another order's missed deadline.

**Steps:**

1. Open My Auctions, then `<won listing>`'s order.

**Expected Results:**

* `<won listing>` reads Won, and its order offers Pay.

<!-- trace:case id=g10.auction-bidder-suspension.TC-m3t rev=2 -->
### g10.auction-bidder-suspension.US1-TC3: Standing maxima on open lots are retracted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US1

**Retirement:** A suspension looks forward only; a standing maximum keeps bidding (`g10.auction-bidder-suspension.US2-TC1`).

**Pre-conditions:**

* A collector leads two open lots and holds a maximum on a third; an order's deadline is about to pass.

**Steps:**

1. Let the deadline pass and read each lot.

**Expected Results:**

* Each lot's leader and price are unchanged.

<!-- trace:case id=g10.auction-bidder-suspension.TC-o67 rev=2 -->
### g10.auction-bidder-suspension.US1-TC5: Paying does not lift the suspension

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US1

**Retirement:** Joined into `g10.auction-bidder-suspension.US1-TC2`.

**Pre-conditions:**

* customer is suspended with one outstanding invoice.

**Steps:**

1. Pay the invoice, then bid on an open lot.

**Expected Results:**

* The bid is refused.

<!-- trace:case id=g10.auction-bidder-suspension.TC-80a rev=2 -->
### g10.auction-bidder-suspension.US1-TC6: Suspended account cannot bid or raise its maximum

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US1

**Retirement:** Joined into `g10.auction-bidder-suspension.US1-TC1`.

**Pre-conditions:**

* customer is suspended and holds a maximum on an open lot.

**Steps:**

1. Raise the maximum, then bid on another lot.

**Expected Results:**

* Both are refused.

---

## g10.auction-bidder-suspension.US2: Bidder competes on a lot whose leader is suspended

**As a** bidder on a lot led by an account that is then suspended,
**I want** the lot's price, leader and bid history to stay as they were,
**so that** the bids I placed against that account still count as I made them.

<!-- trace:case id=g10.auction-bidder-suspension.TC-stk rev=3 covers=g10.auction-bidder-suspension.SC-tsa,g10.auction-bidder-suspension.SC-yn5 -->
### g10.auction-bidder-suspension.US2-TC1: A suspended leader's maximum keeps competing and the history is untouched

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
* **Trace:** g10.auction-bidder-suspension.US2

**Pre-conditions:**

* customer A leads open `<listing_7>` at USD300 with a maximum of USD500, and has an invoice due shortly and unpaid.
* customer B(signed in, card linked) has not bid on `<listing_7>`; its Recent bids are noted.
* customer A's deadline has passed, so customer A is suspended.

**Test data:**

| `<customer B action>` | `<result>` |
| --- | --- |
| None | customer A leads at USD300; Recent bids match the note |
| Place a maximum of USD400 | customer B's USD400, then customer A's automatic USD425 (fixed derived: USD400 plus the USD25 step); customer A leads |

**Steps:**

1. As customer B, `<customer B action>`.
2. Reload `<listing_7>` and read Recent bids.

**Expected Results:**

* `<result>`, and no entry for the suspension.

<!-- trace:case id=g10.auction-bidder-suspension.TC-yp6 rev=2 covers=g10.auction-bidder-suspension.SC-1wb -->
### g10.auction-bidder-suspension.US2-TC3: A suspended account wins through a standing maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US2

**Pre-conditions:**

* customer A is suspended and holds the highest maximum on `<listing_9>`, which is about to close.

**Steps:**

1. Let `<listing_9>` close.
2. As customer A, open My Auctions and `<listing_9>`'s order.

**Expected Results:**

* `<listing_9>` reads Won, and its order has its own deadline.

<!-- trace:case id=g10.auction-bidder-suspension.TC-bw8 rev=2 -->
### g10.auction-bidder-suspension.US2-TC2: Standing maximum keeps bidding after suspension

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US2

**Retirement:** Joined into `g10.auction-bidder-suspension.US2-TC1`.

**Pre-conditions:**

* customer A is suspended and leads a lot with a higher maximum.

**Steps:**

1. As customer B, place a lower maximum.

**Expected Results:**

* customer A still leads.

---

## g10.auction-bidder-suspension.US3: Collector suspended by an operator learns they can no longer bid

**As a** collector an operator has suspended from auctions,
**I want** to be told plainly that I can no longer bid and how to contact Grade10,
**so that** I know where I stand without being refused on a lot first.

<!-- trace:case id=g10.auction-bidder-suspension.TC-stl rev=3 -->
### g10.auction-bidder-suspension.US3-TC1: An operator's suspension stops bidding and keeps its reason private

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US3

**Pre-conditions:**

* admin(holds auction:moderate) is on `<g10adm users url>`; customer(signed in) is not suspended.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator reason>` | Manual review: policy exception |

**Steps:**

1. As admin, suspend customer with `<operator reason>`.
2. As customer, open the suspension email, then My Auctions.
3. Bid on an open lot.

**Expected Results:**

* Step 1: the account panel shows `<operator reason>`, who suspended and when.
* Step 2 says customer cannot bid and how to contact Grade10, and never shows `<operator reason>`.
* Step 3 is refused with the suspension line.

<!-- trace:case id=g10.auction-bidder-suspension.TC-ao5 rev=2 -->
### g10.auction-bidder-suspension.US3-TC2: A missed deadline while suspended adds a second cause to the one suspension

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.auction-bidder-suspension.US3

**Pre-conditions:**

* An operator suspended customer; customer has an invoice due shortly and unpaid.

**Steps:**

1. Let the invoice's deadline pass.
2. As admin, open customer's account panel on `<g10adm users url>`.

**Expected Results:**

* The panel shows one suspension with both causes.

<!-- trace:case id=g10.auction-bidder-suspension.TC-l1f rev=2 -->
### g10.auction-bidder-suspension.US3-TC3: Reinstating restores bidding and keeps the history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US3

**Pre-conditions:**

* customer is suspended; admin(holds auction:moderate) is on customer's account panel; customer has not bid on open `<listing>`.

**Steps:**

1. As admin, reinstate customer.
2. As customer, place a bid on `<listing>`.
3. As admin, reopen the account panel.

**Expected Results:**

* Step 2 is accepted.
* Step 3 keeps the suspension and its reason as history.

---

## Settled

- A suspension looks forward only: a standing maximum keeps bidding and can win, and only an operator's reinstatement lifts it.
