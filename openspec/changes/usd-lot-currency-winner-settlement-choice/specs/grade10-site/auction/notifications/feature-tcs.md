# grade10-site/auction/notifications Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector hears a watched lot is opening

**Starting state:**

- customer(signed in) watches `<lot_1>` with email alerts on.
- The account's Auction email alerts master is on.
- The clock is moved to `<moment>`.
- customer(signed out in this browser) has received Bidding has opened for `<lot_1>`.
- customer(signed in) watches `<lot_1>`, with alerts as the row gives.
- The clock is moved past `<lot_1>`'s scheduled start.
- `<lot_1>` was called off after Bidding opens in 24 hours was sent.

**Shared test data:**

| Item | Value |
| --- | --- |
| `<lot_1>` | A published lot whose bidding has not started |
| `<opening warning>` | 86400s (24 hours) before the scheduled start |
| Moment | Letter |
| `<opening warning>` | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |
| `<lot_1>` | A lot taking bids, watched by this collector with email alerts on |
| Lot email alerts | Auction email alerts master |
| Off | On |
| On | Off |
| `<lot_1>` | A lot called off before its scheduled start |

### Route

1. Read the mail sent to the collector's registered email.
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
7. Read the collector's My Auctions.
8. Read the mail sent to the collector's registered email.

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

## g10.auction-notifications.US1: Collector hears a watched lot is opening

**As a** collector,
**I want** to be emailed as a watched lot opens,
**so that** I can come back and bid without sitting on the page.

<!-- trace:case id=g10.auction-notifications.TC-jca rev=2 -->
### g10.auction-notifications.US1-TC2: The opening letter says alerts are on and links to My Auctions

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-01

**Pre-conditions:**

* customer(signed out in this browser) has received Bidding has opened for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, watched by this collector with email alerts on |

**Steps:**

1. Open the letter.
2. Click the listing action.
3. Back in the letter, click Manage alerts.
4. Complete sign-in from the offer.

**Expected Results:**

* Step 1: subject, heading, lot block and footer name `<lot_1>`.
* Step 1: the footer says email alerts are on for this auction.
* Step 2: `<lot_1 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`.
* Step 3: sign-in is offered first; no alert is changed.
* Step 4: My Auctions opens; `<lot_1>` is still watched, alerts on.

---

## g10.auction-notifications.US2: Collector returns before a lot closes

**As a** collector,
**I want** to be emailed when a lot I watch or bid on is a day from its scheduled close,
**so that** a moving deadline does not pass without me.

---

## g10.auction-notifications.US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a lot I bid on,
**so that** I can raise my maximum while the lot still takes bids.

<!-- trace:case id=g10.auction-notifications.TC-0tc rev=2 -->

<!-- trace:case id=g10.auction-notifications.TC-4q8 rev=2 -->

---

## g10.auction-notifications.US4: Collector hears a new bid on a lot they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a lot I already bid on,
**so that** I know the lot moved without being mailed on every increment.

<!-- trace:case id=g10.auction-notifications.TC-ozl rev=2 -->

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications.spec.ts`

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

<!-- trace:case id=g10.auction-notifications.TC-ris rev=2 -->

<!-- trace:case id=g10.auction-notifications.TC-ua3 rev=2 -->

---

## g10.auction-notifications.US7: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

<!-- trace:case id=g10.auction-notifications.TC-icj rev=2 -->

---

## g10.auction-notifications.US8: Collector hears a no-bids close as ended only

**As a** collector watching a lot,
**I want** to be emailed that the lot ended when nobody bid,
**so that** I learn the close without being told the lot did not sell.

## Settled

- **Archived fold records — 2026-10-12 suite rewrite** —
  - **2026-09-17-add-auction-close-outcome-emails** — `grade10-site-auction-notifications-US6-TC1-1` → `g10.auction-notifications.US6-TC1`; `grade10-site-auction-notifications-US6-TC2-1` → `g10.auction-notifications.US6-TC2`; `grade10-site-auction-notifications-US6-TC3-1` → `g10.auction-notifications.US6-TC3`; `grade10-site-auction-notifications-US7-TC1-1` → `g10.auction-notifications.US7-TC1`; `grade10-site-auction-notifications-US7-TC2-1` → `g10.auction-notifications.US7-TC2`; `grade10-site-auction-notifications-US8-TC1-1` → `g10.auction-notifications.US8-TC1`; `grade10-site-auction-notifications-US8-TC2-1` → `g10.auction-notifications.US8-TC2`.
  - **2026-09-18-email-trigger-revision** — `grade10-site-auction-notifications-US2-TC1-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC2-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC3-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC4-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC5-1` → `g10.auction-notifications.US2-TC5`; `grade10-site-auction-notifications-US2-TC6-1` → `g10.auction-notifications.US2-TC6`; `grade10-site-auction-notifications-US2-TC7-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC8-1` → current journey cases are the replacement record; `grade10-site-auction-notifications-US2-TC9-1` → `g10.auction-notifications.US2-TC9`; `grade10-site-auction-notifications-US2-TC10-1` → current journey cases are the replacement record.

## Reconciliation

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-2lb` rev3 covers SC-xy1: customer A's 30000 USD minor bid defeats the house's 30000 USD reserve while its 50000 USD minor internal maximum wins at 30500 USD minor. Close letters identify winning and own bids; no house recipient or house-winner letter is sent.
- `TC-7f9` rev3 covers SC-14x: the watcher sold letter reports 30500 USD minor and no ended letter is sent.
- The changed cases preserve the existing notification journeys and house-recipient rules. No PRD, journey, feature-root, or durable-baseline contradiction was found. These notification scenarios do not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- All edited cases remain draft. No implementation execution or human approval is claimed.
