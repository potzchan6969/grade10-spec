# grade10-site/auction/notifications Test Cases

**Status:** pending-review · 0/31
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A collector's mail is read in the inbox of their account's registered email. A tester moves the environment's clock to reach a moment.
* Email alerts are on for a listing a collector watches or bids on unless the case says otherwise, and the account's Auction email alerts master is on.
* Every listing is priced in USD. The step is +USD25 from USD200, +USD250 from USD2,500 and +USD500 from USD5,000.
* `<send log>` is the auction email send log in the admin, filtered by email or listing.

## Walk 1: A watcher hears a lot's life from opening to sold

Starting state:

- customer D(signed out in this browser) watches `<listing>`, whose bidding has not started, and never bids on it.
- customer B(card linked) will bid on `<listing>`.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A published USD listing whose bidding starts in more than 24 hours |

### Route

1. Move the clock to 24 hours before the scheduled start, then to the start; read customer D's inbox.
   - One Bidding opens in 24 hours, then one Bidding has opened, each about `<listing>`. `g10.auction-notifications.US1-TC1`
2. Open the Bidding has opened letter and click the listing action.
   - The letter names `<listing>` and says alerts are on; the listing opens. `g10.auction-notifications.US1-TC2`
3. As customer B, bid; move the clock to 24 hours before the scheduled close; read customer D's inbox.
   - One Bidding closes in 24 hours; no New bid letter. `g10.auction-notifications.US2-TC11`
4. Move the clock to 1 hour before the close; read the inbox.
   - No one-hour reminder. `g10.auction-notifications.US2-TC13`
5. Let `<listing>` close with customer B winning; read the inbox.
   - One Lot watched, sold letter naming Sold for at customer B's winning bid. `g10.auction-notifications.US7-TC1`

## Walk 2: A bidder hears they were outbid, the lot moved, and they lost

Starting state:

- customer A leads `<listing>` with a maximum equal to the current bid.
- customer B and customer C(card linked) bid on separate sessions.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A USD listing taking bids, closing in under an hour |

### Route

1. As customer B, place the next valid bid; read customer A's and customer B's inboxes.
   - customer A gets one You have been outbid and no New bid; customer B gets nothing for their own bid. `g10.auction-notifications.US3-TC1`
2. As customer C, place a bid above customer B's maximum; read customer A's inbox.
   - customer A gets one New bid letter naming customer C's bid. `g10.auction-notifications.US4-TC1`
3. Let `<listing>` close with customer C winning; read customer A's inbox.
   - One You did not win, naming the winning bid and customer A's bid. `g10.auction-notifications.US6-TC1`
4. Open `<send log>` and filter by customer A's email.
   - The rows list each letter's type, the listing and Sent At, and never a body. `g10.auction-notifications.US5-TC1`

## g10.auction-notifications.US1: Collector hears a watched listing is opening

**As a** collector,
**I want** to be emailed as a watched listing opens,
**so that** I can come back and bid without sitting on the page.

<!-- trace:case id=g10.auction-notifications.TC-b0t rev=1 covers=g10.auction-notifications.SC-7kd,g10.auction-notifications.SC-km6,g10.auction-notifications.SC-n5v,g10.auction-notifications.SC-r1s,g10.auction-notifications.SC-io5,g10.auction-notifications.SC-4qb,g10.auction-notifications.SC-4du,g10.auction-notifications.SC-yz5,g10.auction-notifications.SC-5o6,g10.auction-notifications.SC-fxu,g10.auction-notifications.SC-vsw,g10.auction-notifications.SC-aud,g10.auction-notifications.SC-yzf,g10.auction-notifications.SC-wna -->
### g10.auction-notifications.US1-TC1: A watcher is mailed 24 hours before the opening and at it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer watches `<listing_1>`, whose bidding has not started.

**Test data:**

| `<moment>` | `<letter>` |
| --- | --- |
| 24 hours before the scheduled start | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

**Steps:**

1. Move the clock to `<moment>` and read customer's inbox.

**Expected Results:**

* Exactly one `<letter>`, about `<listing_1>`.

<!-- trace:case id=g10.auction-notifications.TC-jca rev=2 -->
### g10.auction-notifications.US1-TC2: The opening letter says alerts are on and Manage alerts leads to My Auctions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed out in this browser) watches `<listing_2>`, whose bidding has just opened.

**Steps:**

1. Open the Bidding has opened letter in customer's inbox.
2. Click the listing action.
3. Back in the letter, click Manage alerts.
4. Sign in from the offer.

**Expected Results:**

* Step 1: subject, heading, listing block and footer name `<listing_2>`; the footer says email alerts are on for this auction.
* Step 2 opens `<listing_2>`, its address carrying `utm_source=email` and `utm_medium=auction_notification`.
* Step 3 offers sign-in first and changes no alert.
* Step 4 opens My Auctions with `<listing_2>` still watched, alerts on.

<!-- trace:case id=g10.auction-notifications.TC-pk7 rev=2 -->
### g10.auction-notifications.US1-TC3: No opening mail when alerts are off for the listing or the account

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
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed in) watches `<listing_1>`, whose bidding has not started, with listing alerts `<listing alerts>` and the Auction email alerts master `<master>`.

**Test data:**

| `<listing alerts>` | `<master>` |
| --- | --- |
| Off | On |
| On | Off |

**Steps:**

1. Move the clock past `<listing_1>`'s scheduled start and read customer's inbox.
2. Open My Auctions.

**Expected Results:**

* Step 1 holds neither opening letter for `<listing_1>`.
* Step 2 still lists `<listing_1>` as watched.

<!-- trace:case id=g10.auction-notifications.TC-10a rev=2 -->
### g10.auction-notifications.US1-TC4: A listing called off before it opens sends nothing further

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer watches `<listing_3>`; an operator called it off before its scheduled start.

**Steps:**

1. Move the clock past `<listing_3>`'s scheduled start and read customer's inbox.

**Expected Results:**

* No Bidding has opened letter for `<listing_3>`.

---

## g10.auction-notifications.US2: Collector returns before a listing closes

**As a** collector,
**I want** to be emailed when a listing I watch or bid on is a day from its scheduled close,
**so that** a moving deadline does not pass without me.

<!-- trace:case id=g10.auction-notifications.TC-lk4 rev=2 -->
### g10.auction-notifications.US2-TC11: Closes in 24 hours reaches watchers and bidders, once each

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer relates to `<listing_6>`, taking bids and not extended, as `<relationship>`.

**Test data:**

| `<relationship>` |
| --- |
| Watches only |
| Bid, never watched |
| Watched, then bid |
| Bid, then unwatched, alerts still on |

**Steps:**

1. Move the clock to 24 hours before the scheduled close and read customer's inbox.

**Expected Results:**

* Exactly one Bidding closes in 24 hours, about `<listing_6>`.

<!-- trace:case id=g10.auction-notifications.TC-tbm rev=2 -->
### g10.auction-notifications.US2-TC5: A muted watcher gets no closing warning

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_4>`, closing more than 24 hours away, with alerts off for it.

**Steps:**

1. Move the clock to 24 hours, then 1 hour, before the scheduled close and read customer A's inbox.

**Expected Results:**

* No closing letter for `<listing_4>`.

<!-- trace:case id=g10.auction-notifications.TC-v00 rev=2 -->
### g10.auction-notifications.US2-TC6: The account master off blocks the closing warning

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_4>`, closing more than 24 hours away, alerts on for it, with the Auction email alerts master off.

**Steps:**

1. Move the clock to 24 hours before the scheduled close and read customer A's inbox.

**Expected Results:**

* No Bidding closes in 24 hours for `<listing_4>`.

<!-- trace:case id=g10.auction-notifications.TC-o3h rev=2 -->
### g10.auction-notifications.US2-TC12: An extension sends its own letter, not a second closing warning

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_7>` and has received its Bidding closes in 24 hours; `<listing_7>` is in its last minutes.
* customer B(card linked) is on `<listing_7>`'s page.

**Steps:**

1. As customer B, place the next valid bid inside the extension window.
2. Read customer A's inbox until the moved close.

**Expected Results:**

* One Extended bidding has started for `<listing_7>`, and no second Bidding closes in 24 hours.

<!-- trace:case id=g10.auction-notifications.TC-7q5 rev=2 -->
### g10.auction-notifications.US2-TC13: No one-hour reminder before the scheduled close

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer watches `<listing_6>`, taking bids and not extended.

**Steps:**

1. Move the clock to 1 hour before the scheduled close and read customer's inbox.

**Expected Results:**

* No closing reminder for `<listing_6>` at the one-hour mark.

<!-- trace:case id=g10.auction-notifications.TC-n1b rev=2 -->
### g10.auction-notifications.US2-TC9: No one-hour reminder before a moved close

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-02

**Pre-conditions:**

* customer A watches `<listing_5>`, in extended bidding with its moved close more than an hour away.

**Steps:**

1. Move the clock to 1 hour before the moved close and read customer A's inbox.

**Expected Results:**

* No closing reminder for `<listing_5>` at the one-hour mark.

---

## g10.auction-notifications.US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a listing I bid on,
**so that** I can raise my maximum while the listing still takes bids.

<!-- trace:case id=g10.auction-notifications.TC-sdf rev=1 covers=g10.auction-notifications.SC-ga4,g10.auction-notifications.SC-vsu,g10.auction-notifications.SC-7rk,g10.auction-notifications.SC-yky,g10.auction-notifications.SC-02a -->
### g10.auction-notifications.US3-TC1: The displaced leader gets You have been outbid, not also New bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_8>` with a maximum equal to the current bid.
* customer B(card linked) is on `<listing_8>`'s page.

**Steps:**

1. As customer B, place the next valid bid.
2. Read customer A's and customer B's inboxes.

**Expected Results:**

* customer A has one You have been outbid for `<listing_8>`, and no New bid for this bid.
* customer B has no letter about their own bid.

<!-- trace:case id=g10.auction-notifications.TC-0tc rev=2 -->
### g10.auction-notifications.US3-TC2: A bid absorbed by the leader's maximum sends no outbid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_8>` with a maximum above the next valid bid.
* customer B(card linked) is on `<listing_8>`'s page.

**Steps:**

1. As customer B, place the next valid bid.
2. Read customer A's inbox.

**Expected Results:**

* customer A still leads, and has no You have been outbid.

<!-- trace:case id=g10.auction-notifications.TC-4q8 rev=2 -->
### g10.auction-notifications.US3-TC3: A muted bidder is not told they were outbid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_8>` with alerts off for it.
* customer B(card linked) is on `<listing_8>`'s page.

**Steps:**

1. As customer B, place the next valid bid.
2. Read customer A's inbox.
3. As customer A, open My Auctions.

**Expected Results:**

* Step 2 holds no letter for `<listing_8>`.
* Step 3 shows `<listing_8>` Outbid.

<!-- trace:case id=g10.auction-notifications.TC-bq3 rev=2 -->
### g10.auction-notifications.US3-TC4: A collector the house displaces gets the ordinary outbid letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* customer A leads `<listing_9>` at `<leader price>` with a maximum of USD5,000; `<listing_9>`'s internal bid is `<internal bid before>`.
* admin(holds auction:reserve) is on `<listing_9>`'s editor.

**Test data:**

| `<internal bid before>` | `<leader price>` | `<house act>` |
| --- | --- | --- |
| USD6,000, its time 5 minutes ahead | USD4,000 | Wait until its time passes |
| USD4,500, committed and outbid | USD4,750 (fixed derived: USD4,500 plus the USD250 step) | Raise it to USD6,000 and Save |

**Steps:**

1. `<house act>`.
2. Read customer A's inbox.

**Expected Results:**

* Step 1: the house leads at USD5,500 (USD5,000 plus the USD500 step).
* Step 2 holds one You have been outbid and no New bid, naming no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-83j rev=2 -->
### g10.auction-notifications.US3-TC5: The house is never mailed when a collector displaces it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-03

**Pre-conditions:**

* The house leads `<listing_9>` under a committed internal bid of USD6,000, over customer A's maximum of USD5,000.
* customer B(card linked) is on `<listing_9>`'s page.

**Steps:**

1. As customer B, place a maximum of USD7,000.
2. Open `<send log>`, filter by `<listing_9>`, and read the rows from customer B's bid.

**Expected Results:**

* Step 1: customer B leads.
* Step 2 holds no row addressed to the house.

---

## g10.auction-notifications.US4: Collector hears a new bid on a listing they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a listing I already bid on,
**so that** I know the listing moved without being mailed on every increment.

<!-- trace:case id=g10.auction-notifications.TC-qvy rev=1 covers=g10.auction-notifications.SC-rk1,g10.auction-notifications.SC-ktw,g10.auction-notifications.SC-xzz,g10.auction-notifications.SC-gn8 -->
### g10.auction-notifications.US4-TC1: Other bidders hear of a new bid; watchers and the bidder do not

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A bid on `<listing_10>` and was outbid; customer B leads it; customer D watches it without bidding.
* customer C(card linked) is on `<listing_10>`'s page.

**Steps:**

1. As customer C, place a bid above customer B's maximum.
2. Read the inboxes of customers A, B, C and D.

**Expected Results:**

* customer A has one New bid naming customer C's bid.
* customer B has You have been outbid only.
* customer C has no letter about their own bid; customer D has no New bid.

<!-- trace:case id=g10.auction-notifications.TC-ozl rev=2 -->
### g10.auction-notifications.US4-TC2: Several bids before a send make one letter at the leading bid

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A bid on `<listing_11>` and was outbid; New bid sending is held until the steps finish.

**Steps:**

1. As customers B and C in turn, place three next valid bids.
2. Release sending and read customer A's inbox.

**Expected Results:**

* One New bid for `<listing_11>`, naming the leading bid after the last of the three.

<!-- trace:case id=g10.auction-notifications.TC-y85 rev=2 -->
### g10.auction-notifications.US4-TC3: A house bid that moves the price mails the leader a New bid letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A leads `<listing_12>` at USD4,000 with a maximum of USD7,000; its internal bid of USD6,000 commits in a few minutes.

**Steps:**

1. Wait until the internal bid's time passes; as customer A, read `<listing_12>`'s page.
2. Read customer A's inbox.

**Expected Results:**

* Step 1: customer A still leads, at USD6,500 (USD6,000 plus the USD500 step).
* Step 2 holds one New bid and no outbid letter, naming no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-znb rev=2 -->
### g10.auction-notifications.US4-TC4: A not-placed internal bid mails no bidder

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* customer A leads `<listing_9>` at USD6,000 with a maximum of USD7,000, over customer B; its internal bid of USD5,500, short of the USD6,500 next minimum, commits in a few minutes.

**Steps:**

1. Wait until the internal bid's time passes; read customer A's and customer B's inboxes.
2. Open `<send log>`, filter by `<listing_9>`, and read the rows after that time.

**Expected Results:**

* Neither inbox nor the send log holds anything for `<listing_9>` after that time.

<!-- trace:case id=g10.auction-notifications.TC-e8p rev=2 -->
### g10.auction-notifications.US4-TC5: A house lower that moves nothing mails no one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-04

**Pre-conditions:**

* The house leads `<listing_9>` at USD5,500 under a committed internal bid of USD6,000, over customer A's maximum of USD5,000; customer B bid lower, and customer D watches without bidding.
* admin(holds auction:reserve) is on `<listing_9>`'s editor.

**Steps:**

1. Lower the internal bid to USD5,750 and Save.
2. Read the inboxes of customers A, B and D, and `<send log>` for `<listing_9>`, after the save.

**Expected Results:**

* Step 1 is accepted; the house still leads at USD5,500.
* Step 2 holds nothing for `<listing_9>`.

---

## g10.auction-notifications.US5: Operator looks up what a collector was sent

**As a** auction operator,
**I want** to filter sent auction mail by a collector's email,
**so that** I can answer a collector who says they were never told.

<!-- trace:case id=g10.auction-notifications.TC-x00 rev=2 -->
### g10.auction-notifications.US5-TC1: The send log filtered by email lists type, listing and time, never a body

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications.spec.ts`

**Pre-conditions:**

* customer A was sent Bidding has opened and Bidding closes in 24 hours for `<listing_13>`; customer B was sent Bidding has opened for it.
* admin(auction operator) is on `<send log>`.

**Steps:**

1. Filter by customer A's email and read each row.

**Expected Results:**

* Two rows, both customer A's, none of customer B's; each shows the type, customer A's email, `<listing_13>` and Sent At, and none shows or opens a body.

<!-- trace:case id=g10.auction-notifications.TC-axs rev=2 -->
### g10.auction-notifications.US5-TC2: An email with no mail shows an empty log

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications.spec.ts`

**Pre-conditions:**

* customer C was never sent auction mail; admin(auction operator) is on `<send log>`.

**Steps:**

1. Filter by customer C's email.

**Expected Results:**

* No rows show, and the log says nothing was sent.

---

## g10.auction-notifications.US6: Collector who lost hears the listing closed

**As a** collector who bid on a listing,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the listing.

<!-- trace:case id=g10.auction-notifications.TC-gqc rev=1 covers=g10.auction-notifications.SC-70x,g10.auction-notifications.SC-tlj,g10.auction-notifications.SC-nzk -->
### g10.auction-notifications.US6-TC1: A losing bidder gets one You did not win letter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid on `<listing_14>` and does not lead; customer B leads; it closes in a few minutes.

**Steps:**

1. Let `<listing_14>` close with customer B winning.
2. Read customer A's inbox.

**Expected Results:**

* One You did not win for `<listing_14>`, naming the winning bid and customer A's own bid.

<!-- trace:case id=g10.auction-notifications.TC-ris rev=2 -->
### g10.auction-notifications.US6-TC2: A losing bidder who also watched gets only the bidder letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A watched `<listing_15>`, then bid, and does not lead; customer B leads; it closes in a few minutes.

**Steps:**

1. Let `<listing_15>` close with customer B winning.
2. Read customer A's inbox.

**Expected Results:**

* Exactly one close letter, You did not win, and no Lot watched, sold.

<!-- trace:case id=g10.auction-notifications.TC-ua3 rev=2 -->
### g10.auction-notifications.US6-TC3: The winner gets no close-outcome letter from the alerts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer B watches and leads `<listing_16>`, which closes in a few minutes.

**Steps:**

1. Let `<listing_16>` close with customer B winning.
2. Read customer B's inbox.

**Expected Results:**

* No You did not win, Lot watched, sold or Lot watched, ended; only the auction-won order letter.

<!-- trace:case id=g10.auction-notifications.TC-2lb rev=3 covers=g10.auction-notifications.SC-xy1 -->
### g10.auction-notifications.US6-TC4: A house win mails every losing bidder and nobody as the winner

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A bid USD300 and customer B USD250 on `<listing_17>`; the house leads under a committed internal bid of USD500; it closes in a few minutes with no further bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | USD325 (fixed derived: USD300 plus the USD25 step) |

**Steps:**

1. Let `<listing_17>` close.
2. Read customer A's and customer B's inboxes.
3. Open `<send log>`, filter by `<listing_17>`, and read the rows from the close.

**Expected Results:**

* Step 2: each has one You did not win naming `<winning bid>` and their own bid, and neither names the house or a reserve.
* Step 3 holds no auction-won letter and no row addressed to the house.

---

## g10.auction-notifications.US7: Watcher hears a sold listing ended

**As a** collector watching a listing without bidding,
**I want** to be emailed when that listing ends with a winner,
**so that** I know bidding is over on a listing I followed.

<!-- trace:case id=g10.auction-notifications.TC-gz5 rev=1 covers=g10.auction-notifications.SC-9ie,g10.auction-notifications.SC-kce -->
### g10.auction-notifications.US7-TC1: A watch-only collector hears Sold for at the close

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<listing_18>` and never bid; customer B leads it; it closes in a few minutes.

**Steps:**

1. Let `<listing_18>` close with customer B winning.
2. Read customer D's inbox.

**Expected Results:**

* One Lot watched, sold for `<listing_18>`, naming Sold for at customer B's winning bid.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<listing_18>` and never bid, with listing alerts `<listing alerts>` and the master `<master>`; customer B leads it; it closes in a few minutes.

**Test data:**

| `<listing alerts>` | `<master>` |
| --- | --- |
| Off | On |
| On | Off |

**Steps:**

1. Let `<listing_18>` close with customer B winning.
2. Read customer D's inbox.

**Expected Results:**

* No Lot watched, sold.

<!-- trace:case id=g10.auction-notifications.TC-7f9 rev=3 covers=g10.auction-notifications.SC-14x -->
### g10.auction-notifications.US7-TC3: A listing only the house bid on mails watchers sold

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<listing_19>`, starting price USD300, and never bid; no collector bid, and the house leads at USD300 under a committed internal bid of USD6,000; it closes in a few minutes.

**Steps:**

1. Let `<listing_19>` close.
2. Read customer D's inbox.

**Expected Results:**

* One Lot watched, sold, Sold for USD300, and no Lot watched, ended; no letter names the house or a reserve.

---

## g10.auction-notifications.US8: Collector hears a no-bids close as ended only

**As a** collector watching a listing,
**I want** to be emailed that the listing ended when nobody bid,
**so that** I learn the close without being told the listing did not sell.

<!-- trace:case id=g10.auction-notifications.TC-uzv rev=2 -->
### g10.auction-notifications.US8-TC1: A no-bids close tells the watcher it ended, and nothing more

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* customer D watches `<listing_20>`, which has no bids and closes in a few minutes.

**Steps:**

1. Let `<listing_20>` close with no bids.
2. Read customer D's inbox.

**Expected Results:**

* One Lot watched, ended for `<listing_20>`; its subject, preheader and body say the listing ended, and none says unsold, did not sell or no sale, or shows Sold for, Winning bid or Highest bid.

<!-- trace:case id=g10.auction-notifications.TC-7zp rev=2 -->
### g10.auction-notifications.US8-TC2: A no-bids close sends no bidder or sold letter to anyone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-08

**Pre-conditions:**

* customer D and customer E watch `<listing_20>`, which has no bids and closes in a few minutes; admin(auction operator) is on `<send log>`.

**Steps:**

1. Let `<listing_20>` close with no bids.
2. Filter `<send log>` by `<listing_20>`.

**Expected Results:**

* Only Lot watched, ended rows, one each to customer D and customer E; no You did not win and no Lot watched, sold.

---

## Reconciliation

- **Covered at domain** - `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-51` are also walked by `g10.auction-dmn.US13-TC1`
