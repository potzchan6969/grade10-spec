# grade10-site/auction/bidder-suspension Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-12, tcs-rules r5



## Walk 1: Collector who misses a deadline loses their auction standing

**Starting state:**

- Reset the fixture to each case's own **Pre-conditions** before running that case.

**Route:**

1. **g10.auction-bidder-suspension.US1-TC1** — Wait for `<invoice_1>`'s payment deadline to pass. → Open <g10 auction url>. → Try to raise `<maximum_1>` on `<lot_1>`. → Try to place a bid on `<lot_2>`. → Open <g10 auction account record url>. **Expected:** * The raise at step 3 is refused. * The bid at step 4 is refused.
2. **g10.auction-bidder-suspension.US1-TC2** — Sign in as `customer`. → Open the auction order for `<invoice_1>`. → Pay `<invoice_1>` in full. → Open <g10 auction url>. → Try to commit a maximum on `<lot_4>`. → Open <g10 auction account record url>. **Expected:** * The payment is accepted and the invoice becomes `paid`. * The maximum at step 5 is refused.
3. **g10.auction-bidder-suspension.US1-TC7** — As `admin`, open `<expired_invoice_1>`. → Reissue `<expired_invoice_1>` as `<reissued_invoice_1>` with a new payment deadline. → As `customer`, open `<reissued_invoice_1>` and pay it in full. → Open <g10 auction url>. → Try to commit a maximum on `<open_lot_1>`. → Open <g10 auction account record url>. **Expected:** * The reissued invoice is payable and the payment is accepted. * The maximum at step 5 is refused.
4. **g10.auction-bidder-suspension.US1-TC8** — Sign in as `customer`. → Open <g10 store url>, browse `<store_item_1>` and complete its purchase. → Open <g10 loyalty url> and complete `<loyalty_action_1>`. → Open <g10 auction account record url> and read `<account_record_1>`. → Open <g10 auction url> and try to commit a maximum on an open lot. **Expected:** * Sign-in is accepted. * The store item can be browsed and purchased.
5. **g10.auction-bidder-suspension.US1-TC4** — Open <g10 auction url>. → Open `<won_lot_1>`. → Open its auction order. **Expected:** * `<won_lot_1>` is still won by `customer`. * Its invoice remains payable.

## Walk 2: Bidder competes on a lot whose leader is suspended

**Starting state:**

- Reset the fixture to each case's own **Pre-conditions** before running that case.

**Route:**

1. **g10.auction-bidder-suspension.US2-TC1** — Open `<lot_3>` and note its bid history. → Wait for `customer A`'s payment deadline to pass. → Perform the row's `Event after suspension`. → Reload `<lot_3>`. **Expected:** * `customer A` still leads `<lot_3>` at 30000 HKD minor units. * The leader, price and bid history match the row's `Expected lot state` value.
2. **g10.auction-bidder-suspension.US2-TC3** — Wait for `<lot_5>` to close. → Sign in as `customer A`. → Open the auction order for `<lot_5>`. **Expected:** * `customer A` wins `<lot_5>`. * The auction order has its own invoice and payment deadline.

## Walk 3: Collector suspended by an operator learns they can no longer bid

**Starting state:**

- Reset the fixture to each case's own **Pre-conditions** before running that case.

**Route:**

1. **g10.auction-bidder-suspension.US3-TC1** — As `admin`, open <g10adm users url>. → Suspend `customer` with `<operator_reason>`. → As `customer`, open the suspension notice. → Open <g10 auction account record url>. → Open <g10 auction url> and try to commit a maximum. **Expected:** * The account record matches the row's `Operator record` value. * The notice and collector account record say `customer` cannot bid and how to contact Grade10.
2. **g10.auction-bidder-suspension.US3-TC2** — Wait for `<invoice_3>`'s payment deadline to pass. → Open <g10 auction account record url>. **Expected:** * The account remains one suspension. * The account record shows both causes.
3. **g10.auction-bidder-suspension.US3-TC3** — As `admin`, open <g10adm users url>. → Reinstate `customer`. → As `customer`, open <g10 auction url>. → Commit a maximum on `<reopen_lot_1>`. → Open <g10 auction account record url>. **Expected:** * The operator can reinstate `customer`. * Grade10 accepts the maximum at step 4.

## g10.auction-bidder-suspension.US1: Collector who misses a deadline loses their auction standing

**As a** collector who let a payment deadline pass,
**I want** to be told plainly that I can no longer bid, what I still owe, and
how to resolve it,
**so that** I understand what I can still do and what it takes to bid again.

<!-- trace:case id=g10.auction-bidder-suspension.TC-7ui rev=2 -->
### g10.auction-bidder-suspension.US1-TC1: Deadline suspension refuses new auction actions

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US1

Runs once per row of **Test data**.

**Pre-conditions:**

* `customer` has `<invoice_1>` pending, unpaid and due shortly.
* `customer` is signed in.
* `<lot_1>` is open and `customer` holds `<maximum_1>` on it.
* `<lot_2>` is open and `customer` has no bid on it.

**Test data:**

| `<invoice_1>` | `<invoice_2>` | `<lot_1>` | `<maximum_1>` | `<lot_2>` | Account record |
| --- | --- | --- | --- | --- | --- |
| Pending invoice whose deadline passes unpaid | None | Open lot led by `customer` | Standing maximum held by `customer` | Open lot with no bid from `customer` | The suspension names `<invoice_1>` and its reason |
| Pending invoice whose deadline passes unpaid | Paid invoice | Open lot led by `customer` | Standing maximum held by `customer` | Open lot with no bid from `customer` | The suspension names `<invoice_1>`; `<invoice_2>` remains paid |

**Steps:**

1. Wait for `<invoice_1>`'s payment deadline to pass.
2. Open <g10 auction url>.
3. Try to raise `<maximum_1>` on `<lot_1>`.
4. Try to place a bid on `<lot_2>`.
5. Open <g10 auction account record url>.

**Expected Results:**

* The raise at step 3 is refused.
* The bid at step 4 is refused.
* The collector sees the outstanding amount and how to resolve the suspension.
* The account record shows the suspension, its reason and `<invoice_1>`.
* The account record matches the row's `Account record` value.

<!-- trace:case id=g10.auction-bidder-suspension.TC-0fv rev=1 -->
### g10.auction-bidder-suspension.US1-TC2: Settling an invoice does not reinstate bidding

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* `customer` is suspended and holds one outstanding invoice.
* The invoice is payable.

**Test data:**

| `<invoice_1>` | `<lot_4>` |
| --- | --- |
| Payable invoice that belongs to the suspended customer | Open lot where the customer has no standing maximum |

**Steps:**

1. Sign in as `customer`.
2. Open the auction order for `<invoice_1>`.
3. Pay `<invoice_1>` in full.
4. Open <g10 auction url>.
5. Try to commit a maximum on `<lot_4>`.
6. Open <g10 auction account record url>.

**Expected Results:**

* The payment is accepted and the invoice becomes `paid`.
* The maximum at step 5 is refused.
* The account record still shows the suspension and its reason.

<!-- trace:case id=g10.auction-bidder-suspension.TC-3no rev=1 -->
### g10.auction-bidder-suspension.US1-TC7: Reissuing an invoice does not reinstate bidding

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* `customer` is suspended from auctions.
* `<expired_invoice_1>` belongs to `customer` and its payment deadline has passed.
* `admin` holds `auction:moderate` and can reissue the invoice.

**Test data:**

| `<expired_invoice_1>` | `<reissued_invoice_1>` | `<open_lot_1>` |
| --- | --- | --- |
| Expired auction invoice belonging to the suspended customer | The same invoice after its payment deadline is reissued | Open lot on which the suspended customer has no standing maximum |

**Steps:**

1. As `admin`, open `<expired_invoice_1>`.
2. Reissue `<expired_invoice_1>` as `<reissued_invoice_1>` with a new payment deadline.
3. As `customer`, open `<reissued_invoice_1>` and pay it in full.
4. Open <g10 auction url>.
5. Try to commit a maximum on `<open_lot_1>`.
6. Open <g10 auction account record url>.

**Expected Results:**

* The reissued invoice is payable and the payment is accepted.
* The maximum at step 5 is refused.
* The account record still shows the suspension and its reason after the invoice is paid.

<!-- trace:case id=g10.auction-bidder-suspension.TC-ixs rev=1 -->
### g10.auction-bidder-suspension.US1-TC8: Suspension leaves non-auction account access available

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
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* `customer` is suspended from auctions and signed out.
* `<store_item_1>` is available to buy.
* `<loyalty_action_1>` is available to the customer.
* `<account_record_1>` belongs to `customer`.

**Test data:**

| `<store_item_1>` | `<loyalty_action_1>` | `<account_record_1>` |
| --- | --- | --- |
| Available store item | Earn or redeem action available to the customer | Customer's auction suspension or invoice record |

**Steps:**

1. Sign in as `customer`.
2. Open <g10 store url>, browse `<store_item_1>` and complete its purchase.
3. Open <g10 loyalty url> and complete `<loyalty_action_1>`.
4. Open <g10 auction account record url> and read `<account_record_1>`.
5. Open <g10 auction url> and try to commit a maximum on an open lot.

**Expected Results:**

* Sign-in is accepted.
* The store item can be browsed and purchased.
* The loyalty action is accepted.
* The account record remains readable.
* The maximum at step 5 is refused; the suspension does not block non-auction account access.

<!-- trace:case id=g10.auction-bidder-suspension.TC-kz8 rev=1 -->
### g10.auction-bidder-suspension.US1-TC4: A won lot remains payable after suspension

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
* **Testability:** automation
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**

* `customer` won `<won_lot_1>` before the suspension.
* `customer` is suspended because another auction invoice expired.

**Test data:**

| `<won_lot_1>` |
| --- |
| Lot won by `customer` before a different auction invoice caused the suspension |

**Steps:**

1. Open <g10 auction url>.
2. Open `<won_lot_1>`.
3. Open its auction order.

**Expected Results:**

* `<won_lot_1>` is still won by `customer`.
* Its invoice remains payable.

<!-- trace:case id=g10.auction-bidder-suspension.TC-m3t rev=1 covers=none -->
### g10.auction-bidder-suspension.US1-TC3: Standing maxima on open lots are retracted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**
A collector leading two open lots and holding a standing maximum on a third, with an auction order whose payment deadline is one second away.

**Steps:**

1. Wait for the payment deadline to pass.
2. Read each of the three lots' bid histories.
3. Read the leader on each of the two lots the collector led.

**Expected Results:**

* All three maxima are retracted.
* Each retraction is logged as a `bid_retracted_suspension` event.
* Each lot the collector led has re-resolved to the next bidder at their own price.

<!-- trace:case id=g10.auction-bidder-suspension.TC-o67 rev=1 covers=none -->
### g10.auction-bidder-suspension.US1-TC5: Paying does not lift the suspension

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**
A suspended account holding one outstanding invoice.

**Steps:**

1. Sign in as the suspended collector and pay the outstanding invoice in full.
2. Open <an open listing url> and attempt to commit a maximum.
3. Open <the winner's account record url>.

**Expected Results:**

* The invoice status becomes `paid`.
* Grade10 refuses the maximum at step 2.
* The account record still shows the suspension and its reason.

<!-- trace:case id=g10.auction-bidder-suspension.TC-80a rev=1 -->
### g10.auction-bidder-suspension.US1-TC6: Suspended account cannot bid or raise its maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.auction-bidder-suspension.US1

**Pre-conditions:**
customer(suspended) holds a maximum of 50000 HKD minor units on <listing_1>
and is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | An open lot where the customer holds a maximum of 50000 HKD minor units |
| listing_2 | A second open lot where the customer holds no bid |

**Steps:**

1. Navigate to <listing_1>.
2. Try to raise the maximum.
3. Navigate to <listing_2>.
4. Try to place a bid.

**Expected Results:**

* Grade10 refuses the raise at step 2.
* Grade10 refuses the bid at step 4.
* The maximum on <listing_1> is still 50000 HKD minor units.

---

## g10.auction-bidder-suspension.US2: Bidder competes on a lot whose leader is suspended

**As a** bidder on a lot led by an account that is then suspended,
**I want** the lot's price, leader and bid history to stay as they were,
**so that** the bids I placed against that account still count as I made them.

<!-- trace:case id=g10.auction-bidder-suspension.TC-stk rev=1 -->
### g10.auction-bidder-suspension.US2-TC1: Suspension preserves the open lot state

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
* **Trace:** g10.auction-bidder-suspension.US2

Runs once per row of **Test data**.

**Pre-conditions:**

* `<lot_3>` is open and led by `customer A` at 30000 HKD minor units.
* `customer A` holds a maximum of 50000 HKD minor units on `<lot_3>`.
* `customer A` has an auction invoice whose payment deadline is shortly due.
* `customer B` can bid on `<lot_3>`.

**Test data:**

| `<lot_3>` | Event after suspension | Expected lot state |
| --- | --- | --- |
| Open lot led by `customer A` at 30000 HKD minor units | No new bid | `customer A` still leads at the same price and history |
| Open lot led by `customer A` at 30000 HKD minor units | `customer B` commits a maximum of 40000 HKD minor units | Auto-bidding records the valid `customer B` bid; `customer A` still leads and suspension adds no history entry |

**Steps:**

1. Open `<lot_3>` and note its bid history.
2. Wait for `customer A`'s payment deadline to pass.
3. Perform the row's `Event after suspension`.
4. Reload `<lot_3>`.

**Expected Results:**

* `customer A` still leads `<lot_3>` at 30000 HKD minor units.
* The leader, price and bid history match the row's `Expected lot state` value.

<!-- trace:case id=g10.auction-bidder-suspension.TC-yp6 rev=1 -->
### g10.auction-bidder-suspension.US2-TC3: Standing maximum wins after suspension

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
* **Testability:** automation
* **Trace:** g10.auction-bidder-suspension.US2

**Pre-conditions:**

* `customer A` is suspended.
* `customer A` holds the highest maximum on `<lot_5>`.
* `<lot_5>` is about to close.

**Test data:**

| `<lot_5>` |
| --- |
| Open lot whose highest standing maximum belongs to suspended `customer A` |

**Steps:**

1. Wait for `<lot_5>` to close.
2. Sign in as `customer A`.
3. Open the auction order for `<lot_5>`.

**Expected Results:**

* `customer A` wins `<lot_5>`.
* The auction order has its own invoice and payment deadline.

<!-- trace:case id=g10.auction-bidder-suspension.TC-bw8 rev=1 covers=none -->
### g10.auction-bidder-suspension.US2-TC2: Standing maximum keeps bidding after suspension

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.auction-bidder-suspension.US2

**Pre-conditions:**

* customer A is suspended and leads <listing_4> at 30000 HKD minor units with a maximum of 50000 HKD minor units.
* customer B is signed in.

**Steps:**

1. As customer B, navigate to <listing_4>.
2. Commit a maximum of 40000 HKD minor units.
3. Read the lot's leader and current price.

**Expected Results:**

* customer A still leads <listing_4>.
* The current price is what auto-bidding resolves for these two maximums.

---

## g10.auction-bidder-suspension.US3: Collector suspended by an operator learns they can no longer bid

**As a** collector an operator has suspended from auctions,
**I want** to be told plainly that I can no longer bid and how to contact Grade10,
**so that** I know where I stand without being refused on a lot first.

<!-- trace:case id=g10.auction-bidder-suspension.TC-stl rev=2 -->
### g10.auction-bidder-suspension.US3-TC1: Operator suspension keeps its reason private

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.auction-bidder-suspension.US3

Runs once per row of **Test data**.

**Pre-conditions:**

* `admin(holds auction:moderate)` can open <g10adm users url>.
* `customer` is not suspended and is signed in.

**Test data:**

| `<operator_reason>` | Operator record |
| --- | --- |
| `Payment review: overdue invoice` | The account record shows the reason, who suspended the account and when |
| `Manual review: policy exception` | The account record shows the reason, who suspended the account and when |

**Steps:**

1. As `admin`, open <g10adm users url>.
2. Suspend `customer` with `<operator_reason>`.
3. As `customer`, open the suspension notice.
4. Open <g10 auction account record url>.
5. Open <g10 auction url> and try to commit a maximum.

**Expected Results:**

* The account record matches the row's `Operator record` value.
* The notice and collector account record say `customer` cannot bid and how to contact Grade10.
* Neither collector-facing surface shows `<operator_reason>`.
* The maximum at step 5 is refused.

<!-- trace:case id=g10.auction-bidder-suspension.TC-ao5 rev=1 -->
### g10.auction-bidder-suspension.US3-TC2: A missed deadline records a second cause

Runs once per row of **Test data**.

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
* **Trace:** g10.auction-bidder-suspension.US3

**Pre-conditions:**

* `customer` is suspended by an operator.
* `customer` has `<invoice_3>` pending and due shortly.

**Test data:**

| `<invoice_3>` |
| --- |
| Pending auction invoice whose payment deadline passes after the operator suspension |

**Steps:**

1. Wait for `<invoice_3>`'s payment deadline to pass.
2. Open <g10 auction account record url>.

**Expected Results:**

* The account remains one suspension.
* The account record shows both causes.

<!-- trace:case id=g10.auction-bidder-suspension.TC-l1f rev=1 -->
### g10.auction-bidder-suspension.US3-TC3: Operator reinstatement restores bidding

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
* **Trace:** g10.auction-bidder-suspension.US3

**Pre-conditions:**

* `admin(holds auction:moderate)` has reviewed the suspension.
* `customer` is suspended and its account record shows the suspension.

**Test data:**

| `<reopen_lot_1>` |
| --- |
| Open lot on which the reinstated customer may commit a maximum |

**Steps:**

1. As `admin`, open <g10adm users url>.
2. Reinstate `customer`.
3. As `customer`, open <g10 auction url>.
4. Commit a maximum on `<reopen_lot_1>`.
5. Open <g10 auction account record url>.

**Expected Results:**

* The operator can reinstate `customer`.
* Grade10 accepts the maximum at step 4.
* The account record no longer blocks bidding for the reinstated account.
* The suspension and its reason remain as history.
