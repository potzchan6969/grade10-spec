# grade10-site/auction/notifications Test Cases

**Status:** pending-review · 0/31
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector hears a watched lot is opening

**Starting state:**

- customer(signed in) watches `<lot_1>` with email alerts on.
- The account's Auction email alerts master is on.
- The clock is moved to `<moment>`.
- customer(signed out in this browser) watches `<lot_1>` with email alerts on, and the clock is moved to its scheduled start.
- customer(signed in) watches `<lot_1>`, with alerts as the row gives.
- The clock is moved past `<lot_1>`'s scheduled start.
- `<lot_1>` was called off after Bidding opens in 24 hours was sent.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_1>` | A published lot whose bidding has not started |
| `<opening warning>` | 86400s (24 hours) before the scheduled start |

| Moment | Letter |
| --- | --- |
| `<opening warning>` | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

| Item | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, watched by this collector with email alerts on |

| Lot email alerts | Auction email alerts master |
| --- | --- |
| Off | On |
| On | Off |

| Item | Value |
| --- | --- |
| `<lot_1>` | A lot called off before its scheduled start |

### Route

1. Read the mail sent to the collector's registered email.
   - Exactly one copy of the row's letter, about `<lot_1>`. g10.auction-notifications.US1-TC1
   - It goes to the account's registered email. g10.auction-notifications.US1-TC1
2. Open the letter.
   - subject, heading, lot block and footer name `<lot_1>`. g10.auction-notifications.US1-TC2
   - the footer says email alerts are on for this auction. g10.auction-notifications.US1-TC2
3. Click the listing action.
   - `<lot_1 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`. g10.auction-notifications.US1-TC2
4. Back in the letter, click Manage alerts.
   - sign-in is offered first; no alert is changed. g10.auction-notifications.US1-TC2
5. Complete sign-in from the offer.
   - My Auctions opens; `<lot_1>` is still watched, alerts on. g10.auction-notifications.US1-TC2
6. Read the mail sent to the collector's registered email.
   - neither opening letter was sent for `<lot_1>`. g10.auction-notifications.US1-TC3
7. Read the collector's My Auctions.
   - `<lot_1>` is still watched. g10.auction-notifications.US1-TC3
8. Read the mail sent to the collector's registered email.
   - Bidding has opened was not sent for `<lot_1>`. g10.auction-notifications.US1-TC4

## Walk 2: Collector returns before a lot closes

**Starting state:**

- customer A watches `<lot_2>`, email alerts off for `<lot_2>`, master on.
- customer A watches `<lot_2>`, email alerts on for `<lot_2>`, Auction email alerts master off.
- customer A watches or bid on `<lot_3>`, email alerts on.
- `<lot_3>` is in extended bidding, its moved close more than an hour away.
- customer(signed in) relates to `<lot_2>` as the row gives, email alerts on.
- The clock is moved to `<closing warning>`.
- customer A watches `<lot_3>` with email alerts on and has received Bidding closes in 24 hours.
- customer B(enrolled to bid) is ready to bid on `<lot_3>`.
- customer watches `<lot_2>` with email alerts on.
- The clock is moved to 3600s (1 hour) before the scheduled close.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_2>` | A lot taking bids, scheduled to close more than 24 hours away |
| `<lot_3>` | A lot in extended bidding |
| `<lot_2>` | A lot taking bids, not in extended bidding |
| `<closing warning>` | 86400s (24 hours) before the scheduled close |

| Relationship | Letters |
| --- | --- |
| Watch only | One Bidding closes in 24 hours |
| Bid, not watched before | One Bidding closes in 24 hours |
| Watched, then bid | One Bidding closes in 24 hours |
| Bid, then unwatched, alerts still on | One Bidding closes in 24 hours |

| Item | Value |
| --- | --- |
| `<lot_3>` | A lot taking bids, inside its last minutes before the scheduled close |
| `<late bid>` | The next valid bid, placed inside the extension window |

### Route

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Move the clock to 3600s (1 hour) before the scheduled close.
3. Read the mail sent to customer A.
   - No Bidding closes in 24 hours letter for `<lot_2>`. g10.auction-notifications.US2-TC5
   - No closing reminder at the one-hour mark. g10.auction-notifications.US2-TC5
4. Move the clock to 86400s (24 hours) before the scheduled close.
5. Read the mail sent to customer A.
   - No Bidding closes in 24 hours letter for `<lot_2>`. g10.auction-notifications.US2-TC6
6. Move the clock to 3600s (1 hour) before the moved close.
7. Read the mail sent to customer A.
   - No closing reminder at the one-hour mark before the moved close. g10.auction-notifications.US2-TC9
8. Read the mail sent to the collector's registered email.
   - The row's letters, about `<lot_2>`, and no other copy. g10.auction-notifications.US2-TC11
9. As customer B, place `<late bid>`.
10. Move the clock to 86400s (24 hours) before the moved close.
11. Read the mail sent to customer A.
   - One Extended bidding has started letter for `<lot_3>`. g10.auction-notifications.US2-TC12
   - No second Bidding closes in 24 hours letter. g10.auction-notifications.US2-TC12
12. Read the mail sent to the collector's registered email.
   - No closing reminder was sent for `<lot_2>` at the one-hour mark. g10.auction-notifications.US2-TC13

## Walk 3: Collector raises after being outbid

**Starting state:**

- customer A leads `<lot_4>` with email alerts on, maximum equal to the current bid.
- customer B(enrolled to bid) uses a separate session.
- customer A leads `<lot_4>` with email alerts on and a maximum above `<customer B bid>`.
- customer A leads `<lot_4>`, with email alerts off for `<lot_4>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_4>` | A lot taking bids, led by customer A |
| `<customer B bid>` | The next valid bid on `<lot_4>` |
| `<customer B bid>` | The next valid bid on `<lot_4>`, below customer A's maximum |

### Route

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.
   - one You have been outbid letter for `<lot_4>`. g10.auction-notifications.US3-TC1
   - no New bid letter for this bid. g10.auction-notifications.US3-TC1
3. Read the mail sent to customer B.
   - no letter about customer B's own bid. g10.auction-notifications.US3-TC1
4. As customer B, place `<customer B bid>`.
   - customer A still leads `<lot_4>`. g10.auction-notifications.US3-TC2
5. Read the mail sent to customer A.
   - No You have been outbid letter was sent to customer A. g10.auction-notifications.US3-TC2
6. As customer B, place `<customer B bid>`.
7. Read the mail sent to customer A.
   - no letter was sent for `<lot_4>`. g10.auction-notifications.US3-TC3
8. Open customer A's My Auctions.
   - `<lot_4>` reads Outbid; the bid stands. g10.auction-notifications.US3-TC3

## Walk 4: Collector hears a new bid on a lot they bid on

**Starting state:**

- customer A bid on `<lot_5>` earlier, was outbid and told so, email alerts on.
- customer B leads `<lot_5>`.
- customer D watches `<lot_5>` without bidding, email alerts on.
- customer C(enrolled to bid) uses a separate session.
- New-bid sending is held until the steps below finish.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_5>` | A lot taking bids, with bids from customer A and customer B |
| `<customer C bid>` | The next valid bid on `<lot_5>`, above customer B's maximum |
| `<lot_5>` | A lot taking bids, with an earlier bid from customer A |
| `<bids>` | Three accepted bids from customers B and C, each the next valid bid |

### Route

1. As customer C, place `<customer C bid>`.
2. Read the mail sent to customers A, B, C and D.
   - customer A: one New bid letter naming `<customer C bid>`. g10.auction-notifications.US4-TC1
   - customer B: You have been outbid only. g10.auction-notifications.US4-TC1
   - customer C: no letter about their own bid. g10.auction-notifications.US4-TC1
   - customer D: no New bid letter. g10.auction-notifications.US4-TC1
3. Place `<bids>` in turn.
4. Release sending.
5. Read the mail sent to customer A.
   - One New bid letter for `<lot_5>`. g10.auction-notifications.US4-TC2
   - It names the leading bid after the last of `<bids>`. g10.auction-notifications.US4-TC2

## Walk 5: Operator looks up what a collector was sent

**Starting state:**

- customer A was sent Bidding has opened and Bidding closes in 24 hours for `<lot_1>`.
- customer B was sent Bidding has opened for `<lot_1>`.
- admin(auction operator) is on `<grade10 auction send log url>`.
- customer C was never sent auction mail.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_1>` | A lot customer A and customer B watch |
| `<customer A email>` | customer A's registered email |
| `<customer C email>` | customer C's registered email |

### Route

1. Filter by `<customer A email>`.
   - two rows, both customer A's; none of customer B's. g10.auction-notifications.US5-TC1
2. Read each row.
   - each row shows message type, recipient email, `<lot_1>` and Sent At. g10.auction-notifications.US5-TC1
   - no row shows or opens the letter body. g10.auction-notifications.US5-TC1
3. Filter by `<customer C email>`.
   - No rows show; the log says nothing was sent. g10.auction-notifications.US5-TC2

## Walk 6: Collector who lost hears the lot closed

**Starting state:**

- customer A bid on `<lot_6>`, email alerts on, and does not lead.
- customer B leads `<lot_6>`.
- Open `<lot_6>`'s listing page and wait for it to close.
- customer A watched `<lot_6>`, then bid on it, email alerts on, and does not lead.
- customer B watches `<lot_6>`, email alerts on, and leads it.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_6>` | A lot taking bids, with bids from customer A and customer B, about to close |
| `<customer A bid>` | customer A's highest bid on `<lot_6>` |
| `<winning bid>` | customer B's winning bid at the close |
| `<lot_6>` | A lot taking bids, watched and bid on by customer A, led by customer B, about to close |
| `<lot_6>` | A lot taking bids, watched and led by customer B, about to close |

### Route

1. Let `<lot_6>` close with customer B winning.
   - One You did not win letter for `<lot_6>`. g10.auction-notifications.US6-TC1
2. Read the mail sent to customer A.
   - It names Winning bid as `<winning bid>` and Their bid as `<customer A bid>`. g10.auction-notifications.US6-TC1
3. Let `<lot_6>` close with customer B winning.
   - Exactly one close letter: You did not win. g10.auction-notifications.US6-TC2
4. Read the mail sent to customer A.
   - No Lot watched, sold letter. g10.auction-notifications.US6-TC2
5. Let `<lot_6>` close with customer B winning.
   - No You did not win, Lot watched, sold or Lot watched, ended letter. g10.auction-notifications.US6-TC3
6. Read the mail sent to customer B.
   - Only the auction-won order letter arrives. g10.auction-notifications.US6-TC3

## Walk 7: Watcher hears a sold lot ended

**Starting state:**

- customer D watches `<lot_7>`, email alerts on, and never bid on it.
- customer B leads `<lot_7>`.
- Open `<lot_7>`'s listing page and wait for it to close.
- customer D watches `<lot_7>`, never bid on it, with alerts as the row gives.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_7>` | A lot taking bids, led by customer B, about to close |
| `<winning bid>` | customer B's winning bid at the close |

| Lot email alerts | Auction email alerts master |
| --- | --- |
| Off | On |
| On | Off |

### Route

1. Let `<lot_7>` close with customer B winning.
   - One Lot watched, sold letter for `<lot_7>`. g10.auction-notifications.US7-TC1
2. Read the mail sent to customer D.
   - It names Sold for as `<winning bid>`. g10.auction-notifications.US7-TC1
3. Let `<lot_7>` close with customer B winning.
4. Read the mail sent to customer D.
   - No Lot watched, sold letter was sent. g10.auction-notifications.US7-TC2

## Walk 8: Collector hears a no-bids close as ended only

**Starting state:**

- customer D watches `<lot_8>`, email alerts on, and never bid on it.
- Open `<lot_8>`'s listing page and wait for it to close.
- customer D and customer E watch `<lot_8>`, email alerts on, and never bid on it.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_8>` | A lot taking bids with no bids, about to close |

### Route

1. Let `<lot_8>` close with no bids.
2. Read the mail sent to customer D.
   - One Lot watched, ended letter for `<lot_8>`. g10.auction-notifications.US8-TC1
   - Subject, preheader and body say the lot ended. g10.auction-notifications.US8-TC1
   - None says unsold, did not sell or no sale. g10.auction-notifications.US8-TC1
   - No Sold for, Winning bid or Highest bid shows. g10.auction-notifications.US8-TC1
3. Let `<lot_8>` close with no bids.
4. Read every letter sent for `<lot_8>`.
   - Only Lot watched, ended letters, one each to customer D and customer E. g10.auction-notifications.US8-TC2
   - No You did not win letter. g10.auction-notifications.US8-TC2
   - No Lot watched, sold letter. g10.auction-notifications.US8-TC2

## g10.auction-notifications.US1: Collector hears a watched lot is opening

**As a** collector,
**I want** to be emailed as a watched lot opens,
**so that** I can come back and bid without sitting on the page.

<!-- trace:case id=g10.auction-notifications.TC-b0t rev=1 covers=g10.auction-notifications.SC-7kd,g10.auction-notifications.SC-km6,g10.auction-notifications.SC-n5v,g10.auction-notifications.SC-r1s,g10.auction-notifications.SC-io5,g10.auction-notifications.SC-4qb,g10.auction-notifications.SC-4du,g10.auction-notifications.SC-yz5,g10.auction-notifications.SC-5o6,g10.auction-notifications.SC-fxu,g10.auction-notifications.SC-vsw,g10.auction-notifications.SC-aud,g10.auction-notifications.SC-yzf,g10.auction-notifications.SC-wna -->
### g10.auction-notifications.US1-TC1: Watcher is mailed 24 hours before and at the opening

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<lot_1>` with email alerts on.
* The account's Auction email alerts master is on.
* The clock is moved to `<moment>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A published lot whose bidding has not started |
| `<opening warning>` | 86400s (24 hours) before the scheduled start |

| Moment | Letter |
| --- | --- |
| `<opening warning>` | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* Exactly one copy of the row's letter, about `<lot_1>`.
* It goes to the account's registered email.

<!-- trace:case id=g10.auction-notifications.TC-jca rev=2 -->
### g10.auction-notifications.US1-TC2: The opening letter says alerts are on and links to My Auctions

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed out in this browser) watches `<lot_1>` with email alerts on.
* The clock is moved to the scheduled start of `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, watched by this collector with email alerts on |

**Steps:**

1. Read the mail sent to the collector's registered email and open the Bidding has opened letter.
2. Click the listing action.
3. Back in the letter, click Manage alerts.
4. Complete sign-in from the offer.

**Expected Results:**

* Step 1: subject, heading, lot block and footer name `<lot_1>`.
* Step 1: the footer says email alerts are on for this auction.
* Step 2: `<lot_1 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`.
* Step 3: sign-in is offered first; no alert is changed.
* Step 4: My Auctions opens; `<lot_1>` is still watched, alerts on.

<!-- trace:case id=g10.auction-notifications.TC-pk7 rev=2 -->
### g10.auction-notifications.US1-TC3: No opening mail when alerts are off for the lot or the account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<lot_1>`, with alerts as the row gives.
* The clock is moved past `<lot_1>`'s scheduled start.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A published lot whose bidding has not started |

| Lot email alerts | Auction email alerts master |
| --- | --- |
| Off | On |
| On | Off |

**Steps:**

1. Read the mail sent to the collector's registered email.
2. Read the collector's My Auctions.

**Expected Results:**

* Step 1: neither opening letter was sent for `<lot_1>`.
* Step 2: `<lot_1>` is still watched.

<!-- trace:case id=g10.auction-notifications.TC-10a rev=2 -->
### g10.auction-notifications.US1-TC4: A lot called off before it opens sends nothing further

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<lot_1>` with email alerts on.
* `<lot_1>` was called off after Bidding opens in 24 hours was sent.
* The clock is moved past `<lot_1>`'s scheduled start.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot called off before its scheduled start |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* Bidding has opened was not sent for `<lot_1>`.

---

## g10.auction-notifications.US2: Collector returns before a lot closes

**As a** collector,
**I want** to be emailed when a lot I watch or bid on is a day from its scheduled close,
**so that** a moving deadline does not pass without me.

<!-- trace:case id=g10.auction-notifications.TC-tbm rev=2 -->
### g10.auction-notifications.US2-TC5: A muted watcher gets no closing warnings

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<lot_2>`, email alerts off for `<lot_2>`, master on.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A lot taking bids, scheduled to close more than 24 hours away |

**Steps:**

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Move the clock to 3600s (1 hour) before the scheduled close.
3. Read the mail sent to customer A.

**Expected Results:**

* No Bidding closes in 24 hours letter for `<lot_2>`.
* No closing reminder at the one-hour mark.

<!-- trace:case id=g10.auction-notifications.TC-v00 rev=2 -->
### g10.auction-notifications.US2-TC6: The account master off blocks the closing warning

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<lot_2>`, email alerts on for `<lot_2>`, Auction email alerts master off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A lot taking bids, scheduled to close more than 24 hours away |

**Steps:**

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Read the mail sent to customer A.

**Expected Results:**

* No Bidding closes in 24 hours letter for `<lot_2>`.

<!-- trace:case id=g10.auction-notifications.TC-n1b rev=2 -->
### g10.auction-notifications.US2-TC9: No one-hour reminder before a moved close

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches or bid on `<lot_3>`, email alerts on.
* `<lot_3>` is in extended bidding, its moved close more than an hour away.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_3>` | A lot in extended bidding |

**Steps:**

1. Move the clock to 3600s (1 hour) before the moved close.
2. Read the mail sent to customer A.

**Expected Results:**

* No closing reminder at the one-hour mark before the moved close.

<!-- trace:case id=g10.auction-notifications.TC-lk4 rev=2 -->
### g10.auction-notifications.US2-TC11: Closes in 24 hours reaches watchers and bidders

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer(signed in) relates to `<lot_2>` as the row gives, email alerts on.
* The clock is moved to `<closing warning>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A lot taking bids, not in extended bidding |
| `<closing warning>` | 86400s (24 hours) before the scheduled close |

| Relationship | Letters |
| --- | --- |
| Watch only | One Bidding closes in 24 hours |
| Bid, not watched before | One Bidding closes in 24 hours |
| Watched, then bid | One Bidding closes in 24 hours |
| Bid, then unwatched, alerts still on | One Bidding closes in 24 hours |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* The row's letters, about `<lot_2>`, and no other copy.

<!-- trace:case id=g10.auction-notifications.TC-o3h rev=2 -->
### g10.auction-notifications.US2-TC12: Extension sends its own letter, not a second closing warning

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<lot_3>` with email alerts on and has received Bidding closes in 24 hours.
* customer B(enrolled to bid) is ready to bid on `<lot_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_3>` | A lot taking bids, inside its last minutes before the scheduled close |
| `<late bid>` | The next valid bid, placed inside the extension window |

**Steps:**

1. As customer B, place `<late bid>`.
2. Move the clock to 86400s (24 hours) before the moved close.
3. Read the mail sent to customer A.

**Expected Results:**

* One Extended bidding has started letter for `<lot_3>`.
* No second Bidding closes in 24 hours letter.

<!-- trace:case id=g10.auction-notifications.TC-7q5 rev=2 -->
### g10.auction-notifications.US2-TC13: No one-hour reminder is sent

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer watches `<lot_2>` with email alerts on.
* The clock is moved to 3600s (1 hour) before the scheduled close.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A lot taking bids, not in extended bidding |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* No closing reminder was sent for `<lot_2>` at the one-hour mark.

---

## g10.auction-notifications.US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a lot I bid on,
**so that** I can raise my maximum while the lot still takes bids.

<!-- trace:case id=g10.auction-notifications.TC-sdf rev=1 covers=g10.auction-notifications.SC-ga4,g10.auction-notifications.SC-vsu,g10.auction-notifications.SC-7rk,g10.auction-notifications.SC-yky,g10.auction-notifications.SC-02a -->
### g10.auction-notifications.US3-TC1: Displaced leader gets outbid, not also new bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<lot_4>` with email alerts on, maximum equal to the current bid.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A lot taking bids, led by customer A |
| `<customer B bid>` | The next valid bid on `<lot_4>` |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.
3. Read the mail sent to customer B.

**Expected Results:**

* Step 2: one You have been outbid letter for `<lot_4>`.
* Step 2: no New bid letter for this bid.
* Step 3: no letter about customer B's own bid.

<!-- trace:case id=g10.auction-notifications.TC-0tc rev=2 -->
### g10.auction-notifications.US3-TC2: A raise absorbed by the leader's maximum sends no outbid

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
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<lot_4>` with email alerts on and a maximum above `<customer B bid>`.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A lot taking bids, led by customer A |
| `<customer B bid>` | The next valid bid on `<lot_4>`, below customer A's maximum |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.

**Expected Results:**

* customer A still leads `<lot_4>`.
* No You have been outbid letter was sent to customer A.

<!-- trace:case id=g10.auction-notifications.TC-4q8 rev=2 -->
### g10.auction-notifications.US3-TC3: A muted bidder is not told they were outbid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<lot_4>`, with email alerts off for `<lot_4>`.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A lot taking bids, led by customer A |
| `<customer B bid>` | The next valid bid on `<lot_4>` |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. Read the mail sent to customer A.
3. Open customer A's My Auctions.

**Expected Results:**

* Step 2: no letter was sent for `<lot_4>`.
* Step 3: `<lot_4>` reads Outbid; the bid stands.

<!-- trace:case id=g10.auction-notifications.TC-bq3 rev=2 -->
### g10.auction-notifications.US3-TC4: A collector the house displaces gets the ordinary outbid letter

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<lot_3>` at `<leader price>` with maximum `<customer A maximum>`, email alerts on.
* `<lot_3>`'s internal bid is as the row states.
* admin(holds auction:reserve) is on `<lot_3>`'s editor in the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_3>` | A published USD lot taking bids, scheduled close a day away |
| `<customer A maximum>` | US$5000 (fixed, 500000 minor units) |
| `<price after>` | US$5080 (fixed, 508000 minor units: `<customer A maximum>` plus its 8000 increment) |

| Row | Internal bid before | House act | `<leader price>` |
| --- | --- | --- | --- |
| Commit at its time | US$6000 (fixed, 600000 minor units), its time 5 minutes ahead | Its time passes | US$4000 (fixed, 400000 minor units), the starting price |
| Raise past the leader | US$4500 (fixed, 450000 minor units), committed and outbid | Raise to US$6000 (fixed, 600000 minor units) and click Save | US$4580 (fixed, 458000 minor units: 450000 plus its 8000 increment) |

**Steps:**

1. Let the row's house act happen.
2. Read the mail sent to customer A for the act.

**Expected Results:**

* Step 1: the house leads at `<price after>`.
* Step 2: one You have been outbid letter, and no New bid letter.
* Step 2: the letter names no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-83j rev=2 -->
### g10.auction-notifications.US3-TC5: The house is never mailed when a collector displaces it

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
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* `<lot_4>`'s internal bid of `<house maximum>` is committed, and the house leads it over customer A's maximum `<customer A maximum>`.
* customer B(card linked) is signed in on the lot page for `<lot_4>`.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A published USD lot taking bids, scheduled close a day away |
| `<house maximum>` | US$6000 (fixed, 600000 minor units) |
| `<customer A maximum>` | US$5000 (fixed, 500000 minor units) |
| `<customer B maximum>` | US$7000 (fixed, 700000 minor units), above `<house maximum>` |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm.
2. Filter the send log by `<lot_4>` and read the rows from customer B's bid.

**Expected Results:**

* Step 1: customer B leads.
* Step 2 holds no row addressed to the house.

---

## g10.auction-notifications.US4: Collector hears a new bid on a lot they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a lot I already bid on,
**so that** I know the lot moved without being mailed on every increment.

<!-- trace:case id=g10.auction-notifications.TC-qvy rev=1 covers=g10.auction-notifications.SC-rk1,g10.auction-notifications.SC-ktw,g10.auction-notifications.SC-xzz,g10.auction-notifications.SC-gn8 -->
### g10.auction-notifications.US4-TC1: Other bidders hear of a new bid, watchers do not

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A bid on `<lot_5>` earlier, was outbid and told so, email alerts on.
* customer B leads `<lot_5>`.
* customer D watches `<lot_5>` without bidding, email alerts on.
* customer C(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_5>` | A lot taking bids, with bids from customer A and customer B |
| `<customer C bid>` | The next valid bid on `<lot_5>`, above customer B's maximum |

**Steps:**

1. As customer C, place `<customer C bid>`.
2. Read the mail sent to customers A, B, C and D.

**Expected Results:**

* customer A: one New bid letter naming `<customer C bid>`.
* customer B: You have been outbid only.
* customer C: no letter about their own bid.
* customer D: no New bid letter.

<!-- trace:case id=g10.auction-notifications.TC-ozl rev=2 -->
### g10.auction-notifications.US4-TC2: Several bids before a send make one letter at the leading bid

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A bid on `<lot_5>` earlier, was outbid and told so, email alerts on.
* New-bid sending is held until the steps below finish.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_5>` | A lot taking bids, with an earlier bid from customer A |
| `<bids>` | Three accepted bids from customers B and C, each the next valid bid |

**Steps:**

1. Place `<bids>` in turn.
2. Release sending.
3. Read the mail sent to customer A.

**Expected Results:**

* One New bid letter for `<lot_5>`.
* It names the leading bid after the last of `<bids>`.

<!-- trace:case id=g10.auction-notifications.TC-y85 rev=2 -->
### g10.auction-notifications.US4-TC3: A house bid that moves the price mails the leader a new bid letter

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
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A leads `<lot_5>` at `<starting price>` with maximum `<customer A maximum>`, email alerts on.
* `<lot_5>` has an internal bid of `<house maximum>`, its time a few minutes ahead.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_5>` | A published USD lot taking bids, starting price `<starting price>`, scheduled close a day away |
| `<starting price>` | US$4000 (fixed, 400000 minor units) |
| `<customer A maximum>` | US$7000 (fixed, 700000 minor units) |
| `<house maximum>` | US$6000 (fixed, 600000 minor units), below `<customer A maximum>` |
| `<price after>` | US$6080 (fixed, 608000 minor units: `<house maximum>` plus its 8000 increment) |

**Steps:**

1. Wait until the internal bid's time passes.
2. Read the lot page for `<lot_5>` as customer A.
3. Read the mail sent to customer A for the commit.

**Expected Results:**

* Step 2: customer A still leads, at `<price after>`.
* Step 3: one New bid on a lot you bid on letter, and no outbid letter.
* Step 3: the letter names no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-znb rev=2 -->
### g10.auction-notifications.US4-TC4: A not-placed internal bid mails no bidder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A leads `<lot_6>` at `<current bid>` with maximum `<customer A maximum>`, over customer B, both email alerts on.
* `<lot_6>` has an internal bid of `<short amount>`, its time a few minutes ahead.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_6>` | A published USD lot taking bids, scheduled close a day away |
| `<customer A maximum>` | US$7000 (fixed, 700000 minor units) |
| `<current bid>` | US$6000 (fixed, 600000 minor units) |
| `<short amount>` | US$5500 (fixed, 550000 minor units), short of US$6080 (fixed, 608000 minor units), the next minimum |

**Steps:**

1. Wait until the internal bid's time passes.
2. Read the mail sent to customer A and customer B after that time.
3. Filter the send log by `<lot_6>` and read the rows after that time.

**Expected Results:**

* Step 2: neither gets a letter for `<lot_6>`.
* Step 3 holds no row for `<lot_6>` after that time.

<!-- trace:case id=g10.auction-notifications.TC-e8p rev=2 -->
### g10.auction-notifications.US4-TC5: A house lower that moves nothing mails no bidder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* `<lot_7>`'s internal bid of `<house maximum>` is committed, and the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* customer A and customer B bid on `<lot_7>`, and customer D watches it without bidding, all with email alerts on.
* admin(holds auction:reserve) is on `<lot_7>`'s editor in the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_7>` | A published USD lot taking bids, scheduled close a day away |
| `<house maximum>` | US$6000 (fixed, 600000 minor units) |
| `<customer A maximum>` | US$5000 (fixed, 500000 minor units), customer B's below it |
| `<current bid>` | US$5080 (fixed, 508000 minor units: `<customer A maximum>` plus its 8000 increment) |
| `<lowered maximum>` | US$5500 (fixed, 550000 minor units), above `<current bid>` |

**Steps:**

1. In the Internal bid section, change the amount to `<lowered maximum>`.
2. Click Save.
3. Read the mail sent to customer A, customer B and customer D after the save.
4. Filter the send log by `<lot_7>` and read the rows after the save.

**Expected Results:**

* Step 2 is accepted; the house still leads at `<current bid>`.
* Step 3: none of them gets a letter for `<lot_7>`.
* Step 4 holds no row for `<lot_7>` after the save.

---

## g10.auction-notifications.US5: Operator looks up what a collector was sent

**As a** auction operator,
**I want** to filter sent auction mail by a collector's email,
**so that** I can answer a collector who says they were never told.

<!-- trace:case id=g10.auction-notifications.TC-x00 rev=2 -->
### g10.auction-notifications.US5-TC1: Send log filtered by email lists type, lot and time, never body

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-05

**Pre-conditions:**

* customer A was sent Bidding has opened and Bidding closes in 24 hours for `<lot_1>`.
* customer B was sent Bidding has opened for `<lot_1>`.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot customer A and customer B watch |
| `<customer A email>` | customer A's registered email |

**Steps:**

1. Filter by `<customer A email>`.
2. Read each row.

**Expected Results:**

* Step 1: two rows, both customer A's; none of customer B's.
* Step 2: each row shows message type, recipient email, `<lot_1>` and Sent At.
* Step 2: no row shows or opens the letter body.

<!-- trace:case id=g10.auction-notifications.TC-axs rev=2 -->
### g10.auction-notifications.US5-TC2: An email with no mail shows an empty log

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-05

**Pre-conditions:**

* customer C was never sent auction mail.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<customer C email>` | customer C's registered email |

**Steps:**

1. Filter by `<customer C email>`.

**Expected Results:**

* No rows show; the log says nothing was sent.

---

## g10.auction-notifications.US6: Collector who lost hears the lot closed

**As a** collector who bid on a lot,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the lot.

<!-- trace:case id=g10.auction-notifications.TC-gqc rev=1 covers=g10.auction-notifications.SC-70x,g10.auction-notifications.SC-tlj,g10.auction-notifications.SC-nzk -->
### g10.auction-notifications.US6-TC1: A losing bidder gets one You did not win letter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid on `<lot_6>`, email alerts on, and does not lead.
* customer B leads `<lot_6>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_6>` | A lot taking bids, with bids from customer A and customer B, about to close |
| `<customer A bid>` | customer A's highest bid on `<lot_6>` |
| `<winning bid>` | customer B's winning bid at the close |

**Steps:**

1. Let `<lot_6>` close with customer B winning.
2. Read the mail sent to customer A.

**Expected Results:**

* One You did not win letter for `<lot_6>`.
* It names Winning bid as `<winning bid>` and Their bid as `<customer A bid>`.

<!-- trace:case id=g10.auction-notifications.TC-ris rev=2 -->
### g10.auction-notifications.US6-TC2: A losing bidder who also watched gets only the bidder letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A watched `<lot_6>`, then bid on it, email alerts on, and does not lead.
* customer B leads `<lot_6>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_6>` | A lot taking bids, watched and bid on by customer A, led by customer B, about to close |

**Steps:**

1. Let `<lot_6>` close with customer B winning.
2. Read the mail sent to customer A.

**Expected Results:**

* Exactly one close letter: You did not win.
* No Lot watched, sold letter.

<!-- trace:case id=g10.auction-notifications.TC-ua3 rev=2 -->
### g10.auction-notifications.US6-TC3: The winner gets no close-outcome letter from this capability

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
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer B watches `<lot_6>`, email alerts on, and leads it.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_6>` | A lot taking bids, watched and led by customer B, about to close |

**Steps:**

1. Let `<lot_6>` close with customer B winning.
2. Read the mail sent to customer B.

**Expected Results:**

* No You did not win, Lot watched, sold or Lot watched, ended letter.
* Only the auction-won order letter arrives.

<!-- trace:case id=g10.auction-notifications.TC-2lb rev=3 covers=g10.auction-notifications.SC-xy1 -->
### g10.auction-notifications.US6-TC4: A house win mails every losing bidder and nobody as the winner

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
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid US$300 (fixed, 30000 minor units) and customer B bid US$250 (fixed, 25000 minor units) on `<lot_1>`, both with email alerts on; the house leads at US$305 (fixed, 30500 minor units) under its internal bid.
* `<lot_1>`'s close is a few minutes away, and no further bid is coming.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A published USD lot protected by a committed internal bid of US$500 (fixed, 50000 minor units) |
| `<house maximum>` | US$500 (fixed, 50000 minor units) |
| `<customer A bid>` | US$300 (fixed, 30000 minor units) |
| `<customer B bid>` | US$250 (fixed, 25000 minor units) |
| `<winning bid>` | US$305 (fixed, 30500 minor units) |

**Steps:**

1. Let `<lot_1>` close with the house leading.
2. Read the mail sent to customer A and customer B for the close.
3. Filter the send log by `<lot_1>` and read the rows from the close.

**Expected Results:**

* Step 2: each gets one You did not win letter naming Winning bid `<winning bid>` and their own bid.
* Step 2: neither letter names the house or a reserve.
* Step 3 holds no auction-won letter and no row addressed to the house.

---

## g10.auction-notifications.US7: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

<!-- trace:case id=g10.auction-notifications.TC-gz5 rev=1 covers=g10.auction-notifications.SC-9ie,g10.auction-notifications.SC-kce -->
### g10.auction-notifications.US7-TC1: A watch-only collector hears Sold for at the close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<lot_7>`, email alerts on, and never bid on it.
* customer B leads `<lot_7>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_7>` | A lot taking bids, led by customer B, about to close |
| `<winning bid>` | customer B's winning bid at the close |

**Steps:**

1. Let `<lot_7>` close with customer B winning.
2. Read the mail sent to customer D.

**Expected Results:**

* One Lot watched, sold letter for `<lot_7>`.
* It names Sold for as `<winning bid>`.

<!-- trace:case id=g10.auction-notifications.TC-icj rev=2 -->
### g10.auction-notifications.US7-TC2: A watcher with alerts off hears nothing at the close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<lot_7>`, never bid on it, with alerts as the row gives.
* customer B leads `<lot_7>`.

**Test data:**

| Lot email alerts | Auction email alerts master |
| --- | --- |
| Off | On |
| On | Off |

| Field | Value |
| --- | --- |
| `<lot_7>` | A lot taking bids, led by customer B, about to close |

**Steps:**

1. Let `<lot_7>` close with customer B winning.
2. Read the mail sent to customer D.

**Expected Results:**

* No Lot watched, sold letter was sent.

<!-- trace:case id=g10.auction-notifications.TC-7f9 rev=3 covers=g10.auction-notifications.SC-14x -->
### g10.auction-notifications.US7-TC3: A lot only the house bid on mails watchers sold

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
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<lot_2>`, email alerts on, and never bid on it.
* No collector bid on `<lot_2>`; its internal bid was committed, the house leading at `<starting price>`.
* `<lot_2>`'s close is a few minutes away.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A published USD lot, starting price `<starting price>`, extension duration 1800s (30mins), internal bid US$6000 (fixed, 600000 minor units) |
| `<starting price>` | US$305 (fixed, 30500 minor units) |

**Steps:**

1. Let `<lot_2>` close.
2. Read the mail sent to customer D for the close.

**Expected Results:**

* Step 2: one Lot watched, sold letter, Sold for US$305 (fixed, 30500 minor units), and no Lot watched, ended letter.
* Step 2: no letter names the house or a reserve.

---

## g10.auction-notifications.US8: Collector hears a no-bids close as ended only

**As a** collector watching a lot,
**I want** to be emailed that the lot ended when nobody bid,
**so that** I learn the close without being told the lot did not sell.

<!-- trace:case id=g10.auction-notifications.TC-uzv rev=2 -->
### g10.auction-notifications.US8-TC1: A no-bids close tells the watcher it ended, and nothing more

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* customer D watches `<lot_8>`, email alerts on, and never bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_8>` | A lot taking bids with no bids, about to close |

**Steps:**

1. Let `<lot_8>` close with no bids.
2. Read the mail sent to customer D.

**Expected Results:**

* One Lot watched, ended letter for `<lot_8>`.
* Subject, preheader and body say the lot ended.
* None says unsold, did not sell or no sale.
* No Sold for, Winning bid or Highest bid shows.

<!-- trace:case id=g10.auction-notifications.TC-7zp rev=2 -->
### g10.auction-notifications.US8-TC2: A no-bids close sends no bidder letter to anyone

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
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* customer D and customer E watch `<lot_8>`, email alerts on, and never bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_8>` | A lot taking bids with no bids, about to close |

**Steps:**

1. Let `<lot_8>` close with no bids.
2. Read every letter sent for `<lot_8>`.

**Expected Results:**

* Only Lot watched, ended letters, one each to customer D and customer E.
* No You did not win letter.
* No Lot watched, sold letter.

## Settled

- **Archived fold records — 2026-10-12 suite rewrite** —
  - **2026-09-17-add-auction-close-outcome-emails** — `grade10-site-auction-notifications-US6-TC1-1` → `g10.auction-notifications.US6-TC1`; `grade10-site-auction-notifications-US6-TC2-1` → `g10.auction-notifications.US6-TC2`; `grade10-site-auction-notifications-US6-TC3-1` → `g10.auction-notifications.US6-TC3`; `grade10-site-auction-notifications-US7-TC1-1` → `g10.auction-notifications.US7-TC1`; `grade10-site-auction-notifications-US7-TC2-1` → `g10.auction-notifications.US7-TC2`; `grade10-site-auction-notifications-US8-TC1-1` → `g10.auction-notifications.US8-TC1`; `grade10-site-auction-notifications-US8-TC2-1` → `g10.auction-notifications.US8-TC2`.
  - **2026-09-18-email-trigger-revision** — `grade10-site-auction-notifications-US2-TC1-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC2-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC3-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC4-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC5-1` → `g10.auction-notifications.US2-TC5`; `grade10-site-auction-notifications-US2-TC6-1` → `g10.auction-notifications.US2-TC6`; `grade10-site-auction-notifications-US2-TC7-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC8-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC9-1` → `g10.auction-notifications.US2-TC9`; `grade10-site-auction-notifications-US2-TC10-1` → current journey cases are the replacement record.

## Reconciliation

**Run:** QA2 round 6, 2026-10-12, over the run below. Dev's round-6 reading rewrote the requirement's house bullet: the order a house win opens for its internal bidder sends no letter, and `grade10-site-auction-notifications-SC-52` now reads that win opening the internal bidder's order, with no auction-won or setup letter; no scenario id or revision changed. QA1's round-6 blind pass wrote no case here. QA2 read the delta specs, `decisions.md` through Q58 and this suite; not the archive. It is a statement, not proof.

- **Round 6, unchanged** - every case keeps its version: `g10.auction-notifications.US6-TC4` already reads no auction-won letter and no row addressed to the house after a house win, and `g10.auction-notifications.US3-TC5` no letter to the house
- **Round 6, covered elsewhere** - the no-setup-letter result of `grade10-site-auction-notifications-SC-52` is read by `grade10-admin-auction-internal-bid-US6-TC4-1` across the setup window, and every later order letter by `grade10-admin-auction-internal-bid-US6-TC5-1` to `grade10-admin-auction-internal-bid-US6-TC7-1` (Q51)
- **Round 6, rejected** - none
- **Round 6, raised** - none

**Run, round 3:** QA2, 2026-10-08. QA1's round-3 blind pass, rerun after a discarded attempt broke isolation, read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` table as it stood through Q25, the linked pages `bidding.md` and `management.md` under `docs/prds/`, and the change's domain draft above the capability with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. Dev's round-3 reading wrote the scenarios, `tech-design.md` and `tasks.md` without QA1's suites. Q26 to Q29 landed after both readings, and where a case contradicted them the decision won. QA2 read QA1's suites, the delta specs, `decisions.md` through Q29, `tech-design.md`, `tasks.md`, the durable specs and suites, and both PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `g10.auction-notifications.US3-TC4` by `grade10-site-auction-notifications-SC-49`; `g10.auction-notifications.US3-TC5` by `grade10-site-auction-notifications-SC-52`; `g10.auction-notifications.US4-TC3` by `grade10-site-auction-notifications-SC-53`, the leader hearing the house's bid as the durable rule mails every enrolled bidder but the one who bid; `g10.auction-notifications.US4-TC4` by `grade10-site-auction-notifications-SC-54`'s not-placed half; `g10.auction-notifications.US6-TC4` by `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-52`; `g10.auction-notifications.US7-TC3` by `grade10-site-auction-notifications-SC-51`
- **Added by QA2** - `g10.auction-notifications.US4-TC5`: a house lower that moves nothing mails nobody, for `grade10-site-auction-notifications-SC-54`'s lower half, which no blind case reached
- **Covered at domain** - `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-51` are also walked by `g10.auction-dmn.US13-TC1`
- **Anchors** - `grade10-site-auction-notifications-SC-52` and `grade10-site-auction-notifications-SC-54` serve the Feature set group `House participation`; their cases trace the journeys whose letters they read
- **Out of suite** - none
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-2lb` rev3 covers SC-xy1: customer A's 30000 USD minor bid defeats the house's 30000 USD reserve while its 50000 USD minor internal maximum wins at 30500 USD minor. Close letters identify winning and own bids; no house recipient or house-winner letter is sent.
- `TC-7f9` rev3 covers SC-14x: the watcher sold letter reports 30500 USD minor and no ended letter is sent.
- The changed cases preserve the existing notification journeys and house-recipient rules. No PRD, journey, feature-root, or durable-baseline contradiction was found. These notification scenarios do not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- All edited cases remain draft. No implementation execution or human approval is claimed.
