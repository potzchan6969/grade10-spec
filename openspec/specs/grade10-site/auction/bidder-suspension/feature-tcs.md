# grade10-site/auction/bidder-suspension Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector pays after deadline suspension

**Starting state:**

**Steps 1–5 setup:**

- `customer` has `<invoice_1>` pending, unpaid and due shortly.
- `customer` is signed in.
- `<listing_5>` is open and `customer` holds `<maximum_1>` on it.
- `<listing_6>` is open and `customer` has no bid on it.

**Steps 6–12 setup:**

- `customer` is suspended and holds one outstanding invoice.
- The invoice is payable.

**Shared test data:**

**Steps 1–5 data:**

| `<invoice_1>` | `<invoice_2>` | `<listing_5>` | `<maximum_1>` | `<listing_6>` | `<expected_account_record>` |
| --- | --- | --- | --- | --- | --- |
| Pending invoice whose deadline passes unpaid | None | Open listing led by `customer` | Standing maximum held by `customer` | Open listing with no bid from `customer` | The suspension names `<invoice_1>` and its reason |
| Pending invoice whose deadline passes unpaid | Paid invoice | Open listing led by `customer` | Standing maximum held by `customer` | Open listing with no bid from `customer` | The suspension names `<invoice_1>`; `<invoice_2>` remains paid |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps 6–12 data:**

| Field | Value |
| --- | --- |
| invoice_1 | Payable invoice that belongs to the suspended customer |
| listing_7 | Open USD listing where the customer holds a standing maximum |
| maximum_1 | 50000 USD minor units |
| raised maximum | 50500 USD minor units |
| listing_8 | Open USD listing where the customer has no standing maximum |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

### Route

1. Wait for `<invoice_1>`'s payment deadline to pass.
2. Open `<g10 auction url>`.
3. Try to raise `<maximum_1>` on `<listing_5>`.
   - The raise at step 3 is refused. `g10.auction-bidder-suspension.US1-TC1`
4. Try to place a bid on `<listing_6>`.
   - The bid at step 4 is refused. `g10.auction-bidder-suspension.US1-TC1`
5. Open `<g10 auction account record url>`.
   - The collector sees the outstanding amount and how to resolve the suspension. `g10.auction-bidder-suspension.US1-TC1`
   - The account record shows the suspension, its reason and `<invoice_1>`. `g10.auction-bidder-suspension.US1-TC1`
   - The account record shows the following: `<expected_account_record>`. `g10.auction-bidder-suspension.US1-TC1`
6. Sign in as `customer`.
7. Open the auction order for `<invoice_1>`.
8. Pay `<invoice_1>` in full.
9. Open `<g10 auction url>`.
10. Try to raise `<maximum_1>` on `<listing_7>` to `<raised maximum>`.
   - The raise at step 10 is refused, and `<maximum_1>` remains `<maximum_1>`. `g10.auction-bidder-suspension.US1-TC2`
11. Try to commit a maximum on `<listing_8>`.
   - The maximum at step 11 is refused. `g10.auction-bidder-suspension.US1-TC2`
12. Open `<g10 auction account record url>`.
   - The payment is accepted and the invoice becomes `paid`. `g10.auction-bidder-suspension.US1-TC2`
   - The account record still shows the suspension and its reason. `g10.auction-bidder-suspension.US1-TC2`

## Walk 2: Suspended collector keeps payment and account access

**Starting state:**

**Steps 1–6 setup:**

- `customer` is suspended from auctions.
- `<expired_invoice_1>` belongs to `customer` and its payment deadline has passed.
- `admin` holds `auction:moderate` and can reissue the invoice.

**Steps 7–11 setup:**

- `customer` is suspended from auctions and signed out.
- `<store_item_1>` is available to buy.
- `<loyalty_action_1>` is available to the customer.
- `<account_record_1>` belongs to `customer`.

**Steps 12–14 setup:**

- `customer` won `<won_listing_1>` before the suspension.
- `customer` is suspended because another auction invoice expired.

**Shared test data:**

**Steps 1–6 data:**

| `<expired_invoice_1>` | `<reissued_invoice_1>` | `<open_listing_1>` |
| --- | --- | --- |
| Expired auction invoice belonging to the suspended customer | The same invoice after its payment deadline is reissued | Open listing on which the suspended customer has no standing maximum |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps 7–11 data:**

| `<store_item_1>` | `<loyalty_action_1>` | `<account_record_1>` |
| --- | --- | --- |
| Available store item | Earn or redeem action available to the customer | Customer's auction suspension or invoice record |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |
| g10 loyalty url | The loyalty page URL in the test environment; bind its URL only |
| g10 store url | The store URL in the test environment; bind its URL only |

**Steps 12–14 data:**

| `<won_listing_1>` |
| --- |
| Listing won by `customer` before a different auction invoice caused the suspension |

| Field | Value |
| --- | --- |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

### Route

1. As `admin`, open `<expired_invoice_1>`.
2. Reissue `<expired_invoice_1>` as `<reissued_invoice_1>` with a new payment deadline.
3. As `customer`, open `<reissued_invoice_1>` and pay it in full.
4. Open `<g10 auction url>`.
5. Try to commit a maximum on `<open_listing_1>`.
   - The maximum at step 5 is refused. `g10.auction-bidder-suspension.US1-TC7`
6. Open `<g10 auction account record url>`.
   - The reissued invoice is payable and the payment is accepted. `g10.auction-bidder-suspension.US1-TC7`
   - The account record still shows the suspension and its reason after the invoice is paid. `g10.auction-bidder-suspension.US1-TC7`
7. Sign in as `customer`.
8. Open `<g10 store url>`, browse `<store_item_1>` and complete its purchase.
9. Open `<g10 loyalty url>` and complete `<loyalty_action_1>`.
10. Open `<g10 auction account record url>` and read `<account_record_1>`.
11. Open `<g10 auction url>` and try to commit a maximum on an open listing.
   - Sign-in is accepted. `g10.auction-bidder-suspension.US1-TC8`
   - The store item can be browsed and purchased. `g10.auction-bidder-suspension.US1-TC8`
   - The loyalty action is accepted. `g10.auction-bidder-suspension.US1-TC8`
   - The account record remains readable. `g10.auction-bidder-suspension.US1-TC8`
   - The maximum at step 11 is refused; the suspension does not block non-auction account access. `g10.auction-bidder-suspension.US1-TC8`
12. Open `<g10 auction url>`.
13. Open `<won_listing_1>`.
14. Open its auction order.
   - `<won_listing_1>` is still won by `customer`. `g10.auction-bidder-suspension.US1-TC4`
   - Its invoice remains payable. `g10.auction-bidder-suspension.US1-TC4`

## Walk 3: Bidder competes on a listing whose leader is suspended

**Starting state:**

**Steps 1–4 setup:**

- `<listing_7>` is open and led by `customer A` at `<current_bid>`.
- `customer A` holds a maximum of `<standing_maximum>` on `<listing_7>`.
- `customer A` has an auction invoice whose payment deadline is shortly due.
- `customer B` can bid on `<listing_7>`.

**Steps 5–7 setup:**

- `customer A` is suspended.
- `customer A` holds the highest maximum on `<listing_9>`.
- `<listing_9>` is about to close.

**Shared test data:**

**Steps 1–4 data:**

| `<event_after_suspension>` | `<expected_listing_state>` |
| --- | --- |
| Do not place a new bid | `customer A` still leads at the same price and history |
| As customer B, commit a maximum of `<challenger_maximum>` | Auto-bidding records the valid `customer B` bid; `customer A` still leads at `<answered_bid>`, and suspension adds no history entry |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_7 | An open USD listing led by customer A at `<current_bid>` with standing maximum `<standing_maximum>` | · |
| current_bid | USD300 | (30000 USD minor units, fixed starting fixture) |
| standing_maximum | USD500 | (50000 USD minor units, fixed standing fixture) |
| challenger_maximum | USD400 | (40000 USD minor units, fixed challenger fixture) |
| answered_bid | USD405 | (40500 USD minor units): `<challenger_maximum>` plus the USD5 increment at that price |

**Steps 5–7 data:**

| `<listing_9>` |
| --- |
| Open listing whose highest standing maximum belongs to suspended `customer A` |

### Route

1. Open `<listing_7>` and note its bid history.
2. Wait for `customer A`'s payment deadline to pass.
3. Follow this instruction after suspension: `<event_after_suspension>`.
4. Reload `<listing_7>`.
   - With no new bid, `customer A` still leads `<listing_7>` at `<current_bid>`. `g10.auction-bidder-suspension.US2-TC1`
   - The leader, price and bid history match this expected state: `<expected_listing_state>`. `g10.auction-bidder-suspension.US2-TC1`
5. Wait for `<listing_9>` to close.
6. Sign in as `customer A`.
7. Open the auction order for `<listing_9>`.
   - `customer A` wins `<listing_9>`. `g10.auction-bidder-suspension.US2-TC3`
   - The auction order has its own invoice and payment deadline. `g10.auction-bidder-suspension.US2-TC3`

## Walk 4: Operator suspends and reinstates a collector

**Starting state:**

**Steps 1–5 setup:**

- `admin(holds auction:moderate)` can open `<g10adm users url>`.
- `customer` is not suspended and is signed in.

**Steps 6–7 setup:**

- `customer` is suspended by an operator.
- `customer` has `<invoice_3>` pending and due shortly.

**Steps 8–12 setup:**

- `admin(holds auction:moderate)` has reviewed the suspension.
- `customer` is suspended and its account record shows the suspension.

**Shared test data:**

**Steps 1–5 data:**

| `<operator_reason>` | `<expected_operator_record>` |
| --- | --- |
| `Payment review: overdue invoice` | The account record shows the reason, who suspended the account and when |
| `Manual review: policy exception` | The account record shows the reason, who suspended the account and when |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |
| g10adm users url | The operator user-management URL in the test environment; bind its URL only |

**Steps 6–7 data:**

| `<invoice_3>` |
| --- |
| Pending auction invoice whose payment deadline passes after the operator suspension |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |

**Steps 8–12 data:**

| `<reopened_listing_1>` |
| --- |
| Open listing on which the reinstated customer may commit a maximum |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |
| g10adm users url | The operator user-management URL in the test environment; bind its URL only |

### Route

1. As `admin`, open `<g10adm users url>`.
2. Suspend `customer` with `<operator_reason>`.
3. As `customer`, open the suspension notice.
4. Open `<g10 auction account record url>`.
5. Open `<g10 auction url>` and try to commit a maximum.
   - The account record shows the following: `<expected_operator_record>`. `g10.auction-bidder-suspension.US3-TC1`
   - The notice and collector account record say `customer` cannot bid and how to contact Grade10. `g10.auction-bidder-suspension.US3-TC1`
   - Neither collector-facing surface shows `<operator_reason>`. `g10.auction-bidder-suspension.US3-TC1`
   - The maximum at step 5 is refused. `g10.auction-bidder-suspension.US3-TC1`
6. Wait for `<invoice_3>`'s payment deadline to pass.
7. Open `<g10 auction account record url>`.
   - The account remains one suspension. `g10.auction-bidder-suspension.US3-TC2`
   - The account record shows both causes. `g10.auction-bidder-suspension.US3-TC2`
8. As `admin`, open `<g10adm users url>`.
9. Reinstate `customer`.
10. As `customer`, open `<g10 auction url>`.
11. Commit a maximum on `<reopened_listing_1>`.
   - Grade10 accepts the maximum at step 11. `g10.auction-bidder-suspension.US3-TC3`
12. Open `<g10 auction account record url>`.
   - The operator can reinstate `customer`. `g10.auction-bidder-suspension.US3-TC3`
   - The account record no longer blocks bidding for the reinstated account. `g10.auction-bidder-suspension.US3-TC3`
   - The suspension and its reason remain as history. `g10.auction-bidder-suspension.US3-TC3`

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
* `<listing_5>` is open and `customer` holds `<maximum_1>` on it.
* `<listing_6>` is open and `customer` has no bid on it.

**Test data:**

| `<invoice_1>` | `<invoice_2>` | `<listing_5>` | `<maximum_1>` | `<listing_6>` | `<expected_account_record>` |
| --- | --- | --- | --- | --- | --- |
| Pending invoice whose deadline passes unpaid | None | Open listing led by `customer` | Standing maximum held by `customer` | Open listing with no bid from `customer` | The suspension names `<invoice_1>` and its reason |
| Pending invoice whose deadline passes unpaid | Paid invoice | Open listing led by `customer` | Standing maximum held by `customer` | Open listing with no bid from `customer` | The suspension names `<invoice_1>`; `<invoice_2>` remains paid |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps:**

1. Wait for `<invoice_1>`'s payment deadline to pass.
2. Open `<g10 auction url>`.
3. Try to raise `<maximum_1>` on `<listing_5>`.
4. Try to place a bid on `<listing_6>`.
5. Open `<g10 auction account record url>`.

**Expected Results:**

* The raise at step 3 is refused.
* The bid at step 4 is refused.
* The collector sees the outstanding amount and how to resolve the suspension.
* The account record shows the suspension, its reason and `<invoice_1>`.
* The account record shows the following: `<expected_account_record>`.

<!-- trace:case id=g10.auction-bidder-suspension.TC-0fv rev=3 covers=g10.auction-bidder-suspension.SC-o11 -->
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

| Field | Value |
| --- | --- |
| invoice_1 | Payable invoice that belongs to the suspended customer |
| listing_7 | Open USD listing where the customer holds a standing maximum |
| maximum_1 | 50000 USD minor units |
| raised maximum | 50500 USD minor units |
| listing_8 | Open USD listing where the customer has no standing maximum |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps:**

1. Sign in as `customer`.
2. Open the auction order for `<invoice_1>`.
3. Pay `<invoice_1>` in full.
4. Open `<g10 auction url>`.
5. Try to raise `<maximum_1>` on `<listing_7>` to `<raised maximum>`.
6. Try to commit a maximum on `<listing_8>`.
7. Open `<g10 auction account record url>`.

**Expected Results:**

* The payment is accepted and the invoice becomes `paid`.
* The raise at step 5 is refused, and `<maximum_1>` remains `<maximum_1>`.
* The maximum at step 6 is refused.
* The account record still shows the suspension and its reason.

<!-- trace:case id=g10.auction-bidder-suspension.TC-3no rev=2 -->
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

| `<expired_invoice_1>` | `<reissued_invoice_1>` | `<open_listing_1>` |
| --- | --- | --- |
| Expired auction invoice belonging to the suspended customer | The same invoice after its payment deadline is reissued | Open listing on which the suspended customer has no standing maximum |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps:**

1. As `admin`, open `<expired_invoice_1>`.
2. Reissue `<expired_invoice_1>` as `<reissued_invoice_1>` with a new payment deadline.
3. As `customer`, open `<reissued_invoice_1>` and pay it in full.
4. Open `<g10 auction url>`.
5. Try to commit a maximum on `<open_listing_1>`.
6. Open `<g10 auction account record url>`.

**Expected Results:**

* The reissued invoice is payable and the payment is accepted.
* The maximum at step 5 is refused.
* The account record still shows the suspension and its reason after the invoice is paid.

<!-- trace:case id=g10.auction-bidder-suspension.TC-ixs rev=2 -->
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

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |
| g10 loyalty url | The loyalty page URL in the test environment; bind its URL only |
| g10 store url | The store URL in the test environment; bind its URL only |

**Steps:**

1. Sign in as `customer`.
2. Open `<g10 store url>`, browse `<store_item_1>` and complete its purchase.
3. Open `<g10 loyalty url>` and complete `<loyalty_action_1>`.
4. Open `<g10 auction account record url>` and read `<account_record_1>`.
5. Open `<g10 auction url>` and try to commit a maximum on an open listing.

**Expected Results:**

* Sign-in is accepted.
* The store item can be browsed and purchased.
* The loyalty action is accepted.
* The account record remains readable.
* The maximum at step 5 is refused; the suspension does not block non-auction account access.

<!-- trace:case id=g10.auction-bidder-suspension.TC-kz8 rev=2 -->
### g10.auction-bidder-suspension.US1-TC4: A won listing remains payable after suspension

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

* `customer` won `<won_listing_1>` before the suspension.
* `customer` is suspended because another auction invoice expired.

**Test data:**

| `<won_listing_1>` |
| --- |
| Listing won by `customer` before a different auction invoice caused the suspension |

| Field | Value |
| --- | --- |
| g10 auction url | The auction base URL in the test environment; bind its URL only |

**Steps:**

1. Open `<g10 auction url>`.
2. Open `<won_listing_1>`.
3. Open its auction order.

**Expected Results:**

* `<won_listing_1>` is still won by `customer`.
* Its invoice remains payable.

<!-- trace:case id=g10.auction-bidder-suspension.TC-m3t rev=2 -->
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

<!-- trace:case id=g10.auction-bidder-suspension.TC-o67 rev=2 -->
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

<!-- trace:case id=g10.auction-bidder-suspension.TC-80a rev=2 -->
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
customer(suspended) holds a maximum of 50000 USD minor units on <listing_1>
and is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | An open lot where the customer holds a maximum of 50000 USD minor units |
| listing_2 | A second open lot where the customer holds no bid |

**Steps:**

1. Navigate to <listing_1>.
2. Try to raise the maximum.
3. Navigate to <listing_2>.
4. Try to place a bid.

**Expected Results:**

* Grade10 refuses the raise at step 2.
* Grade10 refuses the bid at step 4.
* The maximum on <listing_1> is still 50000 USD minor units.

---

## g10.auction-bidder-suspension.US2: Bidder competes on a lot whose leader is suspended

**As a** bidder on a lot led by an account that is then suspended,
**I want** the lot's price, leader and bid history to stay as they were,
**so that** the bids I placed against that account still count as I made them.

<!-- trace:case id=g10.auction-bidder-suspension.TC-stk rev=3 covers=g10.auction-bidder-suspension.SC-tsa,g10.auction-bidder-suspension.SC-yn5 -->
### g10.auction-bidder-suspension.US2-TC1: Suspension preserves the open listing state

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

* `<listing_7>` is open and led by `customer A` at `<current_bid>`.
* `customer A` holds a maximum of `<standing_maximum>` on `<listing_7>`.
* `customer A` has an auction invoice whose payment deadline is shortly due.
* `customer B` can bid on `<listing_7>`.

**Test data:**

| `<event_after_suspension>` | `<expected_listing_state>` |
| --- | --- |
| Do not place a new bid | `customer A` still leads at the same price and history |
| As customer B, commit a maximum of `<challenger_maximum>` | Auto-bidding records the valid `customer B` bid; `customer A` still leads at `<answered_bid>`, and suspension adds no history entry |

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_7 | An open USD listing led by customer A at `<current_bid>` with standing maximum `<standing_maximum>` | · |
| current_bid | USD300 | (30000 USD minor units, fixed starting fixture) |
| standing_maximum | USD500 | (50000 USD minor units, fixed standing fixture) |
| challenger_maximum | USD400 | (40000 USD minor units, fixed challenger fixture) |
| answered_bid | USD405 | (40500 USD minor units): `<challenger_maximum>` plus the USD5 increment at that price |

**Steps:**

1. Open `<listing_7>` and note its bid history.
2. Wait for `customer A`'s payment deadline to pass.
3. Follow this instruction after suspension: `<event_after_suspension>`.
4. Reload `<listing_7>`.

**Expected Results:**

* With no new bid, `customer A` still leads `<listing_7>` at `<current_bid>`.
* The leader, price and bid history match this expected state: `<expected_listing_state>`.

<!-- trace:case id=g10.auction-bidder-suspension.TC-yp6 rev=2 covers=g10.auction-bidder-suspension.SC-1wb -->
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
* `customer A` holds the highest maximum on `<listing_9>`.
* `<listing_9>` is about to close.

**Test data:**

| `<listing_9>` |
| --- |
| Open listing whose highest standing maximum belongs to suspended `customer A` |

**Steps:**

1. Wait for `<listing_9>` to close.
2. Sign in as `customer A`.
3. Open the auction order for `<listing_9>`.

**Expected Results:**

* `customer A` wins `<listing_9>`.
* The auction order has its own invoice and payment deadline.

<!-- trace:case id=g10.auction-bidder-suspension.TC-bw8 rev=2 -->
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

* customer A is suspended and leads <listing_4> at 30000 USD minor units with a maximum of 50000 USD minor units.
* customer B is signed in.

**Steps:**

1. As customer B, navigate to <listing_4>.
2. Commit a maximum of 40000 USD minor units.
3. Read the lot's leader and current price.

**Expected Results:**

* customer A still leads <listing_4>.
* The current price is what auto-bidding resolves for these two maximums.

---

## g10.auction-bidder-suspension.US3: Collector suspended by an operator learns they can no longer bid

**As a** collector an operator has suspended from auctions,
**I want** to be told plainly that I can no longer bid and how to contact Grade10,
**so that** I know where I stand without being refused on a lot first.

<!-- trace:case id=g10.auction-bidder-suspension.TC-stl rev=3 -->
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

* `admin(holds auction:moderate)` can open `<g10adm users url>`.
* `customer` is not suspended and is signed in.

**Test data:**

| `<operator_reason>` | `<expected_operator_record>` |
| --- | --- |
| `Payment review: overdue invoice` | The account record shows the reason, who suspended the account and when |
| `Manual review: policy exception` | The account record shows the reason, who suspended the account and when |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |
| g10adm users url | The operator user-management URL in the test environment; bind its URL only |

**Steps:**

1. As `admin`, open `<g10adm users url>`.
2. Suspend `customer` with `<operator_reason>`.
3. As `customer`, open the suspension notice.
4. Open `<g10 auction account record url>`.
5. Open `<g10 auction url>` and try to commit a maximum.

**Expected Results:**

* The account record shows the following: `<expected_operator_record>`.
* The notice and collector account record say `customer` cannot bid and how to contact Grade10.
* Neither collector-facing surface shows `<operator_reason>`.
* The maximum at step 5 is refused.

<!-- trace:case id=g10.auction-bidder-suspension.TC-ao5 rev=2 -->
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

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |

**Steps:**

1. Wait for `<invoice_3>`'s payment deadline to pass.
2. Open `<g10 auction account record url>`.

**Expected Results:**

* The account remains one suspension.
* The account record shows both causes.

<!-- trace:case id=g10.auction-bidder-suspension.TC-l1f rev=2 -->
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

| `<reopened_listing_1>` |
| --- |
| Open listing on which the reinstated customer may commit a maximum |

| Field | Value |
| --- | --- |
| g10 auction account record url | The signed-in auction account-record URL in the test environment; bind its URL only |
| g10 auction url | The auction base URL in the test environment; bind its URL only |
| g10adm users url | The operator user-management URL in the test environment; bind its URL only |

**Steps:**

1. As `admin`, open `<g10adm users url>`.
2. Reinstate `customer`.
3. As `customer`, open `<g10 auction url>`.
4. Commit a maximum on `<reopened_listing_1>`.
5. Open `<g10 auction account record url>`.

**Expected Results:**

* The operator can reinstate `customer`.
* Grade10 accepts the maximum at step 4.
* The account record no longer blocks bidding for the reinstated account.
* The suspension and its reason remain as history.

## Reconciliation

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-0fv` rev3 covers SC-o11: payment does not lift suspension; a 50500 USD minor raise against the standing 50000 USD minor maximum is refused, the existing maximum remains, and a new maximum on another lot is refused.
- `TC-stk` rev3 covers SC-tsa and SC-yn5: in the USD bid race, 40000 USD minor against 50000 USD minor resolves at 40500 USD minor using the USD 500 minor increment. The no-bid fixture retains its 30000 USD minor lead. This corrects the prior inconsistent 340 result.
- `TC-yp6` rev2 covers SC-1wb: the existing account-level suspension outcome remains effective for the lot's bid path.
- These cases preserve their existing journeys. The SC12 maximum is 50000 USD minor (USD 500), not USD 50,000. No PRD, journey, feature-root, or durable-baseline contradiction was found. The changed suspension scenarios do not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- All edited cases remain draft. Deprecated `TC-80a` was not changed or reactivated. No implementation execution or human approval is claimed.
