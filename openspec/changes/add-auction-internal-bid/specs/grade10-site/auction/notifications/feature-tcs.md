# grade10-site/auction/notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-notifications-US3: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a lot I bid on,
**so that** I can raise my maximum while the lot still takes bids.

<!-- trace:case id=g10.auction-notifications.TC-bq3 rev=1 covers=g10.auction-notifications.SC-kl5 -->
### grade10-site-auction-notifications-US3-TC4-1: A collector the house displaces gets the ordinary outbid letter

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
| `<lot_3>` | A published HKD lot taking bids, scheduled close a day away |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<price after>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | Internal bid before | House act | `<leader price>` |
| --- | --- | --- | --- |
| Commit at its time | 600000 minor units, its time 5 minutes ahead | Its time passes | 400000 minor units, the starting price |
| Raise past the leader | 450000 minor units, committed and outbid | Raise to 600000 minor units and click Save | 458000 minor units: 450000 plus its 8000 increment |

**Steps:**

1. Let the row's house act happen.
2. Read the mail sent to customer A for the act.

**Expected Results:**

* Step 1: the house leads at `<price after>`.
* Step 2: one You have been outbid letter, and no New bid letter.
* Step 2: the letter names no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-83j rev=1 covers=g10.auction-notifications.SC-9dh -->
### grade10-site-auction-notifications-US3-TC5-1: The house is never mailed when a collector displaces it

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
| `<lot_4>` | A published HKD lot taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<customer B maximum>` | 700000 minor units, above `<house maximum>` |

**Steps:**

1. As customer B, enter `<customer B maximum>` in the custom maximum on the bid panel and confirm.
2. Filter the send log by `<lot_4>` and read the rows from customer B's bid.

**Expected Results:**

* Step 1: customer B leads.
* Step 2 holds no row addressed to the house.

---

## grade10-site-auction-notifications-US4: Collector hears a new bid on a lot they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a lot I already bid on,
**so that** I know the lot moved without being mailed on every increment.

<!-- trace:case id=g10.auction-notifications.TC-y85 rev=1 covers=g10.auction-notifications.SC-mma -->
### grade10-site-auction-notifications-US4-TC3-1: A house bid that moves the price mails the leader a new bid letter

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
| `<lot_5>` | A published HKD lot taking bids, starting price `<starting price>`, scheduled close a day away |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00), below `<customer A maximum>` |
| `<price after>` | 608000 minor units: `<house maximum>` plus its 8000 increment |

**Steps:**

1. Wait until the internal bid's time passes.
2. Read the lot page for `<lot_5>` as customer A.
3. Read the mail sent to customer A for the commit.

**Expected Results:**

* Step 2: customer A still leads, at `<price after>`.
* Step 3: one New bid on a lot you bid on letter, and no outbid letter.
* Step 3: the letter names no house and no reserve.

<!-- trace:case id=g10.auction-notifications.TC-znb rev=1 covers=g10.auction-notifications.SC-mnu -->
### grade10-site-auction-notifications-US4-TC4-1: A not-placed internal bid mails no bidder

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
| `<lot_6>` | A published HKD lot taking bids, scheduled close a day away |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 600000 minor units |
| `<short amount>` | 550000 minor units, short of the 608000 next minimum |

**Steps:**

1. Wait until the internal bid's time passes.
2. Read the mail sent to customer A and customer B after that time.
3. Filter the send log by `<lot_6>` and read the rows after that time.

**Expected Results:**

* Step 2: neither gets a letter for `<lot_6>`.
* Step 3 holds no row for `<lot_6>` after that time.

<!-- trace:case id=g10.auction-notifications.TC-e8p rev=1 covers=g10.auction-notifications.SC-mnu -->
### grade10-site-auction-notifications-US4-TC5-1: A house lower that moves nothing mails no bidder

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
| `<lot_7>` | A published HKD lot taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00), customer B's below it |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<lowered maximum>` | 550000 minor units (HK$5,500.00), above `<current bid>` |

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

## grade10-site-auction-notifications-US6: Collector who lost hears the lot closed

**As a** collector who bid on a lot,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the lot.

<!-- trace:case id=g10.auction-notifications.TC-2lb rev=1 covers=g10.auction-notifications.SC-xy1,g10.auction-notifications.SC-9dh -->
### grade10-site-auction-notifications-US6-TC4-1: A house win mails every losing bidder and nobody as the winner

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

* customer A and customer B bid on `<lot_1>`, email alerts on, and the house leads it at `<winning bid>` under its internal bid.
* `<lot_1>`'s close is a few minutes away, and no further bid is coming.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A published HKD lot protected by a committed internal bid of 700000 minor units |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<customer B maximum>` | 600000 minor units (HK$6,000.00) |
| `<winning bid>` | 608000 minor units: `<customer B maximum>` plus its 8000 increment |

**Steps:**

1. Let `<lot_1>` close with the house leading.
2. Read the mail sent to customer A and customer B for the close.
3. Filter the send log by `<lot_1>` and read the rows from the close.

**Expected Results:**

* Step 2: each gets one You did not win letter, Winning bid `<winning bid>` and their own bid.
* Step 2: neither letter names the house or a reserve.
* Step 3 holds no auction-won letter and no row addressed to the house.

---

## grade10-site-auction-notifications-US7: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

<!-- trace:case id=g10.auction-notifications.TC-7f9 rev=1 covers=g10.auction-notifications.SC-14x -->
### grade10-site-auction-notifications-US7-TC3-1: A lot only the house bid on mails watchers sold

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
| `<lot_2>` | A published HKD lot, starting price `<starting price>`, extension duration 1800s (30mins), internal bid 600000 minor units |
| `<starting price>` | 400000 minor units (HK$4,000.00) |

**Steps:**

1. Let `<lot_2>` close.
2. Read the mail sent to customer D for the close.

**Expected Results:**

* Step 2: one Lot watched, sold letter, Sold for `<starting price>`, and no Lot watched, ended letter.
* Step 2: no letter names the house or a reserve.

## Reconciliation

**Run:** QA2, 2026-10-08. QA1's round-3 blind pass, rerun after a discarded attempt broke isolation, read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` table as it stood through Q25, the linked pages `bidding.md` and `management.md` under `docs/prds/`, and the change's domain draft above the capability with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. Dev's round-3 reading wrote the scenarios, `tech-design.md` and `tasks.md` without QA1's suites. Q26 to Q29 landed after both readings, and where a case contradicted them the decision won. QA2 read QA1's suites, the delta specs, `decisions.md` through Q29, `tech-design.md`, `tasks.md`, the durable specs and suites, and both PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-notifications-US3-TC4-1` by `grade10-site-auction-notifications-SC-49`; `grade10-site-auction-notifications-US3-TC5-1` by `grade10-site-auction-notifications-SC-52`; `grade10-site-auction-notifications-US4-TC3-1` by `grade10-site-auction-notifications-SC-53`, the leader hearing the house's bid as the durable rule mails every enrolled bidder but the one who bid; `grade10-site-auction-notifications-US4-TC4-1` by `grade10-site-auction-notifications-SC-54`'s not-placed half; `grade10-site-auction-notifications-US6-TC4-1` by `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-52`; `grade10-site-auction-notifications-US7-TC3-1` by `grade10-site-auction-notifications-SC-51`
- **Added by QA2** - `grade10-site-auction-notifications-US4-TC5-1`: a house lower that moves nothing mails nobody, for `grade10-site-auction-notifications-SC-54`'s lower half, which no blind case reached
- **Covered at domain** - `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-notifications-SC-50` and `grade10-site-auction-notifications-SC-51` are also walked by `grade10-site-auction-e2e-US13-TC01-1`
- **Anchors** - `grade10-site-auction-notifications-SC-52` and `grade10-site-auction-notifications-SC-54` serve the Feature set group `House participation`; their cases trace the journeys whose letters they read
- **Out of suite** - none
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
