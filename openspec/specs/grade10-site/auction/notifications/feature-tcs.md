# grade10-site/auction/notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-notifications-US1: Collector hears a watched lot is opening

**As a** collector,
**I want** to be emailed as a watched lot opens,
**so that** I can come back and bid without sitting on the page.

### grade10-site-auction-notifications-US1-TC1-1: Watcher is mailed 24 hours before and at the opening

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

* customer(signed in) watches <lot_1> with email alerts on.
* The account's Auction email alerts master is on.
* The clock is moved to <moment>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A published lot whose bidding has not started |
| <opening warning> | 86400s (24 hours) before the scheduled start |

| Moment | Letter |
| --- | --- |
| <opening warning> | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* Exactly one copy of the row's letter, about <lot_1>.
* It goes to the account's registered email.

### grade10-site-auction-notifications-US1-TC2-1: The opening letter says alerts are on and links to My Auctions

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

* customer(signed out in this browser) has received Bidding has opened for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, watched by this collector with email alerts on |

**Steps:**

1. Open the letter.
2. Click the listing action.
3. Back in the letter, click Manage alerts.
4. Complete sign-in from the offer.

**Expected Results:**

* Step 1: subject, heading, lot block and footer name <lot_1>.
* Step 1: the footer says email alerts are on for this lot.
* Step 2: <lot_1 url> opens; the link carries `utm_source=email` and `utm_medium=auction_notification`.
* Step 3: sign-in is offered first; no alert is changed.
* Step 4: My Auctions opens; <lot_1> is still watched, alerts on.

### grade10-site-auction-notifications-US1-TC3-1: No opening mail when alerts are off for the lot or the account

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

* customer(signed in) watches <lot_1>, with alerts as the row gives.
* The clock is moved past <lot_1>'s scheduled start.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A published lot whose bidding has not started |

| Lot email alerts | Auction email alerts master |
| --- | --- |
| Off | On |
| On | Off |

**Steps:**

1. Read the mail sent to the collector's registered email.
2. Read the collector's My Auctions.

**Expected Results:**

* Step 1: neither opening letter was sent for <lot_1>.
* Step 2: <lot_1> is still watched.

### grade10-site-auction-notifications-US1-TC4-1: A lot called off before it opens sends nothing further

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

* customer(signed in) watches <lot_1> with email alerts on.
* <lot_1> was called off after Bidding opens in 24 hours was sent.
* The clock is moved past <lot_1>'s scheduled start.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot called off before its scheduled start |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* Bidding has opened was not sent for <lot_1>.

---

## grade10-site-auction-notifications-US2: Collector returns before a lot closes

**As a** collector,
**I want** to be emailed when a lot I watch or bid on is a day from its
scheduled close,
**so that** a moving deadline does not pass without me.

### grade10-site-auction-notifications-US2-TC5-1: A muted watcher gets no closing warnings

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

* customer A watches <lot_2>, email alerts off for <lot_2>, master on.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | A lot taking bids, scheduled to close more than 24 hours away |

**Steps:**

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Move the clock to 3600s (1 hour) before the scheduled close.
3. Read the mail sent to customer A.

**Expected Results:**

* No Bidding closes in 24 hours letter for <lot_2>.
* No closing reminder at the one-hour mark.

### grade10-site-auction-notifications-US2-TC6-1: The account master off blocks the closing warning

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

* customer A watches <lot_2>, email alerts on for <lot_2>, Auction email alerts master off.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | A lot taking bids, scheduled to close more than 24 hours away |

**Steps:**

1. Move the clock to 86400s (24 hours) before the scheduled close.
2. Read the mail sent to customer A.

**Expected Results:**

* No Bidding closes in 24 hours letter for <lot_2>.

### grade10-site-auction-notifications-US2-TC9-1: No one-hour reminder before a moved close

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

* customer A watches or bid on <lot_3>, email alerts on.
* <lot_3> is in extended bidding, its moved close more than an hour away.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_3> | A lot in extended bidding |

**Steps:**

1. Move the clock to 3600s (1 hour) before the moved close.
2. Read the mail sent to customer A.

**Expected Results:**

* No closing reminder at the one-hour mark before the moved close.

### grade10-site-auction-notifications-US2-TC11-1: Closes in 24 hours reaches watchers and bidders

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

* customer(signed in) relates to <lot_2> as the row gives, email alerts on.
* The clock is moved to <closing warning>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | A lot taking bids, not in extended bidding |
| <closing warning> | 86400s (24 hours) before the scheduled close |

| Relationship | Letters |
| --- | --- |
| Watch only | One Bidding closes in 24 hours |
| Bid, not watched before | One Bidding closes in 24 hours |
| Watched, then bid | One Bidding closes in 24 hours |
| Bid, then unwatched, alerts still on | One Bidding closes in 24 hours |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* The row's letters, about <lot_2>, and no other copy.

### grade10-site-auction-notifications-US2-TC12-1: Extension sends its own letter, not a second closing warning

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

* customer A watches <lot_3> with email alerts on and has received Bidding closes in 24 hours.
* customer B(enrolled to bid) is ready to bid on <lot_3>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_3> | A lot taking bids, inside its last minutes before the scheduled close |
| <late bid> | The next valid bid, placed inside the extension window |

**Steps:**

1. As customer B, place <late bid>.
2. Move the clock to 86400s (24 hours) before the moved close.
3. Read the mail sent to customer A.

**Expected Results:**

* One Extended bidding has started letter for <lot_3>.
* No second Bidding closes in 24 hours letter.

### grade10-site-auction-notifications-US2-TC13-1: No one-hour reminder is sent

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

* customer watches <lot_2> with email alerts on.
* The clock is moved to 3600s (1 hour) before the scheduled close.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | A lot taking bids, not in extended bidding |

**Steps:**

1. Read the mail sent to the collector's registered email.

**Expected Results:**

* No closing reminder was sent for <lot_2> at the one-hour mark.

---

## grade10-site-auction-notifications-US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a lot I bid on,
**so that** I can raise my maximum while the lot still takes bids.

### grade10-site-auction-notifications-US3-TC1-1: Displaced leader gets outbid, not also new bid

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

* customer A leads <lot_4> with email alerts on, maximum equal to the current bid.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | A lot taking bids, led by customer A |
| <customer B bid> | The next valid bid on <lot_4> |

**Steps:**

1. As customer B, place <customer B bid>.
2. Read the mail sent to customer A.
3. Read the mail sent to customer B.

**Expected Results:**

* Step 2: one You have been outbid letter for <lot_4>.
* Step 2: no New bid letter for this bid.
* Step 3: no letter about customer B's own bid.

### grade10-site-auction-notifications-US3-TC2-1: A raise absorbed by the leader's maximum sends no outbid

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

* customer A leads <lot_4> with email alerts on and a maximum above <customer B bid>.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | A lot taking bids, led by customer A |
| <customer B bid> | The next valid bid on <lot_4>, below customer A's maximum |

**Steps:**

1. As customer B, place <customer B bid>.
2. Read the mail sent to customer A.

**Expected Results:**

* customer A still leads <lot_4>.
* No You have been outbid letter was sent to customer A.

### grade10-site-auction-notifications-US3-TC3-1: A muted bidder is not told they were outbid

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

* customer A leads <lot_4>, with email alerts off for <lot_4>.
* customer B(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | A lot taking bids, led by customer A |
| <customer B bid> | The next valid bid on <lot_4> |

**Steps:**

1. As customer B, place <customer B bid>.
2. Read the mail sent to customer A.
3. Open customer A's My Auctions.

**Expected Results:**

* Step 2: no letter was sent for <lot_4>.
* Step 3: <lot_4> reads Outbid; the bid stands.

---

## grade10-site-auction-notifications-US4: Collector hears a new bid on a lot they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a lot I already bid on,
**so that** I know the lot moved without being mailed on every increment.

### grade10-site-auction-notifications-US4-TC1-1: Other bidders hear of a new bid, watchers do not

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

* customer A bid on <lot_5> earlier, was outbid and told so, email alerts on.
* customer B leads <lot_5>.
* customer D watches <lot_5> without bidding, email alerts on.
* customer C(enrolled to bid) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_5> | A lot taking bids, with bids from customer A and customer B |
| <customer C bid> | The next valid bid on <lot_5>, above customer B's maximum |

**Steps:**

1. As customer C, place <customer C bid>.
2. Read the mail sent to customers A, B, C and D.

**Expected Results:**

* customer A: one New bid letter naming <customer C bid>.
* customer B: You have been outbid only.
* customer C: no letter about their own bid.
* customer D: no New bid letter.

### grade10-site-auction-notifications-US4-TC2-1: Several bids before a send make one letter at the leading bid

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

* customer A bid on <lot_5> earlier, was outbid and told so, email alerts on.
* New-bid sending is held until the steps below finish.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_5> | A lot taking bids, with an earlier bid from customer A |
| <bids> | Three accepted bids from customers B and C, each the next valid bid |

**Steps:**

1. Place <bids> in turn.
2. Release sending.
3. Read the mail sent to customer A.

**Expected Results:**

* One New bid letter for <lot_5>.
* It names the leading bid after the last of <bids>.

---

## grade10-site-auction-notifications-US5: Operator looks up what a collector was sent

**As an** auction operator,
**I want** to filter sent auction mail by a collector's email,
**so that** I can answer a collector who says they were never told.

### grade10-site-auction-notifications-US5-TC1-1: Send log filtered by email lists type, lot and time, never body

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

* customer A was sent Bidding has opened and Bidding closes in 24 hours for <lot_1>.
* customer B was sent Bidding has opened for <lot_1>.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot customer A and customer B watch |
| <customer A email> | customer A's registered email |

**Steps:**

1. Filter by <customer A email>.
2. Read each row.

**Expected Results:**

* Step 1: two rows, both customer A's; none of customer B's.
* Step 2: each row shows message type, recipient email, <lot_1> and Sent At.
* Step 2: no row shows or opens the letter body.

### grade10-site-auction-notifications-US5-TC2-1: An email with no mail shows an empty log

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
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| <customer C email> | customer C's registered email |

**Steps:**

1. Filter by <customer C email>.

**Expected Results:**

* No rows show; the log says nothing was sent.

---


## grade10-site-auction-notifications-US6: Collector who lost hears the lot closed

**As a** collector who bid on a lot,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the lot.

<!-- trace:case id=g10.auction-notifications.TC-gqc rev=1 covers=g10.auction-notifications.SC-70x,g10.auction-notifications.SC-tlj,g10.auction-notifications.SC-nzk -->
### grade10-site-auction-notifications-US6-TC1-1: A losing bidder gets one You did not win letter

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

* customer A bid on <lot_6>, email alerts on, and does not lead.
* customer B leads <lot_6>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_6> | A lot taking bids, with bids from customer A and customer B, about to close |
| <customer A bid> | customer A's highest bid on <lot_6> |
| <winning bid> | customer B's winning bid at the close |

**Steps:**

1. Let <lot_6> close with customer B winning.
2. Read the mail sent to customer A.

**Expected Results:**

* One You did not win letter for <lot_6>.
* It names Winning bid as <winning bid> and Their bid as <customer A bid>.

<!-- trace:case id=g10.auction-notifications.TC-ris rev=1 covers=g10.auction-notifications.SC-70x,g10.auction-notifications.SC-tlj,g10.auction-notifications.SC-nzk -->
### grade10-site-auction-notifications-US6-TC2-1: A losing bidder who also watched gets only the bidder letter

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

* customer A watched <lot_6>, then bid on it, email alerts on, and does not lead.
* customer B leads <lot_6>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_6> | A lot taking bids, watched and bid on by customer A, led by customer B, about to close |

**Steps:**

1. Let <lot_6> close with customer B winning.
2. Read the mail sent to customer A.

**Expected Results:**

* Exactly one close letter: You did not win.
* No Lot watched, sold letter.

<!-- trace:case id=g10.auction-notifications.TC-ua3 rev=1 covers=g10.auction-notifications.SC-70x,g10.auction-notifications.SC-tlj,g10.auction-notifications.SC-nzk -->
### grade10-site-auction-notifications-US6-TC3-1: The winner gets no close-outcome letter from this capability

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

* customer B watches <lot_6>, email alerts on, and leads it.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_6> | A lot taking bids, watched and led by customer B, about to close |

**Steps:**

1. Let <lot_6> close with customer B winning.
2. Read the mail sent to customer B.

**Expected Results:**

* No You did not win, Lot watched, sold or Lot watched, ended letter.
* Only the auction-won order letter arrives.

---

## grade10-site-auction-notifications-US7: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

<!-- trace:case id=g10.auction-notifications.TC-gz5 rev=1 covers=g10.auction-notifications.SC-9ie,g10.auction-notifications.SC-kce -->
### grade10-site-auction-notifications-US7-TC1-1: A watch-only collector hears Sold for at the close

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

* customer D watches <lot_7>, email alerts on, and never bid on it.
* customer B leads <lot_7>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_7> | A lot taking bids, led by customer B, about to close |
| <winning bid> | customer B's winning bid at the close |

**Steps:**

1. Let <lot_7> close with customer B winning.
2. Read the mail sent to customer D.

**Expected Results:**

* One Lot watched, sold letter for <lot_7>.
* It names Sold for as <winning bid>.

<!-- trace:case id=g10.auction-notifications.TC-icj rev=1 covers=g10.auction-notifications.SC-9ie,g10.auction-notifications.SC-kce -->
### grade10-site-auction-notifications-US7-TC2-1: A watcher with alerts off hears nothing at the close

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

* customer D watches <lot_7>, never bid on it, with alerts as the row gives.
* customer B leads <lot_7>.

**Test data:**

| Lot email alerts | Auction email alerts master |
| --- | --- |
| Off | On |
| On | Off |

| Field | Value |
| --- | --- |
| <lot_7> | A lot taking bids, led by customer B, about to close |

**Steps:**

1. Let <lot_7> close with customer B winning.
2. Read the mail sent to customer D.

**Expected Results:**

* No Lot watched, sold letter was sent.

---

## grade10-site-auction-notifications-US8: Collector hears a no-bids close as ended only

**As a** collector watching a lot,
**I want** to be emailed that the lot ended when nobody bid,
**so that** I learn the close without being told the lot did not sell.

<!-- trace:case id=g10.auction-notifications.TC-uzv rev=1 covers=g10.auction-notifications.SC-hf1,g10.auction-notifications.SC-lbn -->
### grade10-site-auction-notifications-US8-TC1-1: A no-bids close tells the watcher it ended, and nothing more

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

* customer D watches <lot_8>, email alerts on, and never bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_8> | A lot taking bids with no bids, about to close |

**Steps:**

1. Let <lot_8> close with no bids.
2. Read the mail sent to customer D.

**Expected Results:**

* One Lot watched, ended letter for <lot_8>.
* Subject, preheader and body say the lot ended.
* None says unsold, did not sell or no sale.
* No Sold for, Winning bid or Highest bid shows.

<!-- trace:case id=g10.auction-notifications.TC-7zp rev=1 covers=g10.auction-notifications.SC-hf1,g10.auction-notifications.SC-lbn -->
### grade10-site-auction-notifications-US8-TC2-1: A no-bids close sends no bidder letter to anyone

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

* customer D and customer E watch <lot_8>, email alerts on, and never bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_8> | A lot taking bids with no bids, about to close |

**Steps:**

1. Let <lot_8> close with no bids.
2. Read every letter sent for <lot_8>.

**Expected Results:**

* Only Lot watched, ended letters, one each to customer D and customer E.
* No You did not win letter.
* No Lot watched, sold letter.

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.

## Settled

- `grade10-site-auction-notifications-US2-TC1` is held by `grade10-site-auction-notifications-US2-TC11`.
- `grade10-site-auction-notifications-US2-TC2` is held by `grade10-site-auction-notifications-US2-TC13`.
- `grade10-site-auction-notifications-US2-TC3` is held by `grade10-site-auction-notifications-US2-TC11`.
- `grade10-site-auction-notifications-US2-TC4` is held by `grade10-site-auction-notifications-US2-TC11`.
- `grade10-site-auction-notifications-US2-TC7` is held by `grade10-site-auction-notifications-US2-TC12`.
- `grade10-site-auction-notifications-US2-TC8` is held by `grade10-site-auction-notifications-US2-TC12`.
- `grade10-site-auction-notifications-US2-TC10` is held by `grade10-site-auction-notifications-US2-TC11`.

- Late enrolment after the scheduled-close − 24h point still receives Bidding closes in 24 hours while enrolled — enrolment requirement, same pattern as opens-in-24h
- Extended bidding has started sends once per listing per collector on first entry into the window
- One-hour closing reminder stops for watchers and bidders alike
