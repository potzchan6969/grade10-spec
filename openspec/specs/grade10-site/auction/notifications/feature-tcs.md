# grade10-site/auction/notifications Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector hears a watched listing is opening

**Starting state:**

**Steps 1–1 setup:**

- customer(signed in) watches `<listing_1>` with email alerts on.
- The account's Auction email alerts master is on.
- The clock is moved to `<moment>`.

**Steps 2–5 setup:**

- customer(signed out in this browser) watches `<listing_2>` with email alerts on.
- The clock is moved to the scheduled start of `<listing_2>`.

**Steps 6–7 setup:**

- customer(signed in) watches `<listing_1>`, with listing email alerts `<listing_email_alerts>` and Auction email alerts master `<auction_email_alerts>`.
- The clock is moved past `<listing_1>`'s scheduled start.

**Steps 8–8 setup:**

- customer(signed in) watches `<listing_3>` with email alerts on.
- `<listing_3>` is called off before its scheduled start.
- The clock is moved past `<listing_3>`'s scheduled start.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_1 | A published listing whose bidding has not started | · |
| opening warning | 86400s | (24 hours) before the scheduled start |

| `<moment>` | `<letter_kind>` |
| --- | --- |
| `<opening warning>` | Bidding opens in 24 hours |
| The scheduled start | Bidding has opened |

**Steps 2–5 data:**

| Field | Value |
| --- | --- |
| listing_2 | A listing taking bids, watched by this collector with email alerts on |

| Field | Value |
| --- | --- |
| listing_2 url | The canonical URL of `<listing_2>`; bind the URL only |

**Steps 6–7 data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing whose bidding has not started |

| `<listing_email_alerts>` | `<auction_email_alerts>` |
| --- | --- |
| Off | On |
| On | Off |

**Steps 8–8 data:**

| Field | Value |
| --- | --- |
| listing_3 | A listing called off before its scheduled start |

### Route

1. Read the mail sent to the collector's registered email.
2. Read the mail sent to the collector's registered email and open the Bidding has opened letter.
   - Step 2: subject, heading, listing block and footer name `<listing_2>`. `g10.auction-notifications.US1-TC2`
   - Step 2: the footer says email alerts are on for this auction. `g10.auction-notifications.US1-TC2`
3. Click the listing action.
   - Step 3: `<listing_2 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`. `g10.auction-notifications.US1-TC2`
4. Back in the letter, click Manage alerts.
   - Step 4: sign-in is offered first; no alert is changed. `g10.auction-notifications.US1-TC2`
5. Complete sign-in from the offer.
   - Step 5: My Auctions opens; `<listing_2>` is still watched, alerts on. `g10.auction-notifications.US1-TC2`
6. Read the mail sent to the collector's registered email.
7. Read the collector's My Auctions.
8. Read the mail sent to the collector's registered email.

## Walk 5: Operator looks up what a collector was sent

**Starting state:**

**Steps 1–2 setup:**

- customer A was sent Bidding has opened and Bidding closes in 24 hours for `<listing_13>`.
- customer B was sent Bidding has opened for `<listing_13>`.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Steps 3–3 setup:**

- customer C was never sent auction mail.
- admin(auction operator) is on `<grade10 auction send log url>`.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_13 | A listing customer A and customer B watch |
| customer A email | customer A's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps 3–3 data:**

| Field | Value |
| --- | --- |
| customer C email | customer C's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

### Route

1. Filter by `<customer A email>`.
   - Step 1: two rows, both customer A's; none of customer B's. `g10.auction-notifications.US5-TC1`
2. Read each row.
   - Step 2: each row shows message type, recipient email, `<listing_13>` and Sent At. `g10.auction-notifications.US5-TC1`
   - Step 2: no row shows or opens the letter body. `g10.auction-notifications.US5-TC1`
3. Filter by `<customer C email>`.
   - No rows show; the log says nothing was sent. `g10.auction-notifications.US5-TC2`

## g10.auction-notifications.US1: Collector hears a watched listing is opening

**As a** collector,
**I want** to be emailed as a watched listing opens,
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

* customer(signed out in this browser) watches `<listing_2>` with email alerts on.
* The clock is moved to the scheduled start of `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | A listing taking bids, watched by this collector with email alerts on |

| Field | Value |
| --- | --- |
| listing_2 url | The canonical URL of `<listing_2>`; bind the URL only |

**Steps:**

1. Read the mail sent to the collector's registered email and open the Bidding has opened letter.
2. Click the listing action.
3. Back in the letter, click Manage alerts.
4. Complete sign-in from the offer.

**Expected Results:**

* Step 1: subject, heading, listing block and footer name `<listing_2>`.
* Step 1: the footer says email alerts are on for this auction.
* Step 2: `<listing_2 url>` opens; the link carries `utm_source=email` and `utm_medium=auction_notification`.
* Step 3: sign-in is offered first; no alert is changed.
* Step 4: My Auctions opens; `<listing_2>` is still watched, alerts on.

---

## g10.auction-notifications.US2: Collector returns before a listing closes

**As a** collector,
**I want** to be emailed when a listing I watch or bid on is a day from its scheduled close,
**so that** a moving deadline does not pass without me.

---

## g10.auction-notifications.US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a listing I bid on,
**so that** I can raise my maximum while the listing still takes bids.

---

## g10.auction-notifications.US4: Collector hears a new bid on a listing they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a listing I already bid on,
**so that** I know the listing moved without being mailed on every increment.

---

## g10.auction-notifications.US5: Operator looks up what a collector was sent

**As a** auction operator,
**I want** to filter sent auction mail by a collector's email,
**so that** I can answer a collector who says they were never told.

<!-- trace:case id=g10.auction-notifications.TC-x00 rev=2 -->
### g10.auction-notifications.US5-TC1: Send log filtered by email lists type, listing and time, never body

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

* customer A was sent Bidding has opened and Bidding closes in 24 hours for `<listing_13>`.
* customer B was sent Bidding has opened for `<listing_13>`.
* admin(auction operator) is on `<grade10 auction send log url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | A listing customer A and customer B watch |
| customer A email | customer A's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. Filter by `<customer A email>`.
2. Read each row.

**Expected Results:**

* Step 1: two rows, both customer A's; none of customer B's.
* Step 2: each row shows message type, recipient email, `<listing_13>` and Sent At.
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
| customer C email | customer C's registered email |

| Field | Value |
| --- | --- |
| grade10 auction send log url | The operator auction email send-log URL in the test environment; bind its URL only |

**Steps:**

1. Filter by `<customer C email>`.

**Expected Results:**

* No rows show; the log says nothing was sent.

---

## g10.auction-notifications.US6: Collector who lost hears the listing closed

**As a** collector who bid on a listing,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the listing.

---

## g10.auction-notifications.US7: Watcher hears a sold listing ended

**As a** collector watching a listing without bidding,
**I want** to be emailed when that listing ends with a winner,
**so that** I know bidding is over on a listing I followed.

---

## g10.auction-notifications.US8: Collector hears a no-bids close as ended only

**As a** collector watching a listing,
**I want** to be emailed that the listing ended when nobody bid,
**so that** I learn the close without being told the listing did not sell.

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
