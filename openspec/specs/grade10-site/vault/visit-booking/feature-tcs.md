# grade10-site/vault/visit-booking Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (api):** grade10-site-vault-visit-booking-SC-09, grade10-site-vault-visit-booking-SC-23 - a read of the diary with none reachable, and a calendar file asked for by someone else, which no screen sends

## Background

* `<case page>` is the collector's own vault case page on `<g10url>`; its visit section holds the picker, which offers a shop, then its free slots by day. The console's case page is the operator's, read by admin(holds `vault:operate`).
* customer(collector) is signed in and owns the case a step names. A tester moves the environment's clock to reach a moment; a visit's slot is "missed" once it passed over 24 hours ago with no visit recorded.
* Visit letters arrive in the collector's inbox; the calendar file is the .ics a step opens in a calendar app.

## Walk 1: Book, move and keep a visit

Starting state:

- customer(collector) on `<case page>`, its case holding a live offer and no visit.

Shared test data:

| Field | Value |
| --- | --- |
| shop | a shop with free slots this week and next |

### Route

1. Pick `<shop>` and a free slot, and confirm.
   - The confirmation names the shop and the slot; a booked letter arrives. `g10.vault-visit-booking.US1-TC1`
2. Add the visit to the calendar.
   - A day at the shop's address and the slot. `g10.vault-visit-booking.US4-TC2`
3. Move the visit to another shop's free slot.
   - The case names the new shop and slot; the calendar's day moves with it. `g10.vault-visit-booking.US3-TC1`
4. Leave and reopen `<case page>`.
   - The visit reads the same, with Add to calendar, Move and Cancel visit. `g10.vault-visit-booking.US4-TC1`

## g10.vault-visit-booking.US1: Collector books the visit they hand the item over at

**As a** collector,
**I want** to pick a shop and a free slot for my case whenever I am ready,
**so that** I can agree terms first and carry the item in afterwards.

<!-- trace:case id=g10.vault-visit-booking.TC-lla rev=1 -->
### g10.vault-visit-booking.US1-TC1: A collector books a free slot at a shop once the case holds an offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) is on `<case page>`, its case holding a live offer and no visit.

**Steps:**

1. Open the picker, choose a shop, then a free slot, and confirm.
2. Read the inbox and the case page.

**Expected Results:**

* Step 1: the picker gives way to a confirmation naming the shop and the slot taken.
* Step 2: a booked letter names the shop and the slot; the case names its visit.

<!-- trace:case id=g10.vault-visit-booking.TC-lid rev=1 covers=g10.vault-visit-booking.SC-arc,g10.vault-visit-booking.SC-uos,g10.vault-visit-booking.SC-79y,g10.vault-visit-booking.SC-ui2,g10.vault-visit-booking.SC-jiy,g10.vault-visit-booking.SC-16x,g10.vault-visit-booking.SC-fdv -->
### g10.vault-visit-booking.US1-TC5: A booking is refused for a draft, a passed slot, a slot taken meanwhile, or a window with nothing free

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) is on `<case page>`, `<case>`.

**Test data:**

| `<case>` | `<attempt>` | `<shown>` |
| --- | --- | --- |
| its request still a draft, not sent in | open the case page | no picker |
| holding a live offer | choose a slot that passed while the picker was open, and confirm | refused, naming the slot as passed; no visit |
| holding a live offer | read a free slot, have another collector take it, then confirm it | refused, naming the slot as taken; read again, it is gone |
| holding a live offer | choose a shop's window that holds no free slot | that nothing is free, and the next window with a free slot |

**Steps:**

1. Do `<attempt>`.

**Expected Results:**

* It shows `<shown>`, and the case holds no visit.

<!-- trace:case id=g10.vault-visit-booking.TC-ssx rev=1 -->
### g10.vault-visit-booking.US1-TC2: One visit serves a collector's other case too

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds case A, with a booked visit, and case B, with a live offer and no visit; admin(holds `vault:operate`) is at the counter at that visit.

**Steps:**

1. As the collector, read both cases.
2. At the visit, as admin, take both items into the vault; read case B.

**Expected Results:**

* Step 1: case A carries its visit, shop and slot; case B carries none and offers no picker of its own.
* Step 2: both cases reach the vault; case B needed no booking.

---

## g10.vault-visit-booking.US2: Borrower books the visit they repay and collect on

**As a** borrower,
**I want** to book a visit while my loan is running,
**so that** I can pay the balance and take the item home in one appointment.

<!-- trace:case id=g10.vault-visit-booking.TC-k7q rev=1 -->
### g10.vault-visit-booking.US2-TC1: A borrower books a visit to repay and collect, and a missed one leaves the loan running

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-02

**Pre-conditions:**

* customer(collector) is on `<case page>`, its loan running.

**Steps:**

1. Book a free slot to repay and collect.
2. Let the slot pass by 25 hours, with no visit recorded; read the case.
3. Book another free slot.

**Expected Results:**

* Step 1 holds the visit; the case names it.
* Step 2: the visit reads closed; the loan is still running.
* Step 3 holds the new visit.

<!-- trace:case id=g10.vault-visit-booking.TC-tlb rev=1 covers=g10.vault-visit-booking.SC-hzh,g10.vault-visit-booking.SC-6qa,g10.vault-visit-booking.SC-4lt,g10.vault-visit-booking.SC-plm,g10.vault-visit-booking.SC-fnz,g10.vault-visit-booking.SC-02u,g10.vault-visit-booking.SC-ju4,g10.vault-visit-booking.SC-zqo,g10.vault-visit-booking.SC-qpx,g10.vault-visit-booking.SC-t70,g10.vault-visit-booking.SC-my4 -->
### g10.vault-visit-booking.US2-TC3: A visit completes when the item is taken in from its start, and only then

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Missed and finished visits

**Pre-conditions:**

* The collector's case holds a visit at `<shop>` this Friday at 10:00; admin(holds `vault:operate`) is on its console case page.

**Test data:**

| `<at>` | `<act>` | `<visit reads>` |
| --- | --- | --- |
| Monday | start valuing from its photographs | open, for Friday |
| Friday 09:59 | take the item into the vault | open |
| Friday 10:00 | take the item into the vault | completed |
| Friday 11:30 | take the item into the vault | completed |
| the next week, the slot passed and the loan running late | forfeit the item | a no-show, not completed |

**Steps:**

1. At `<at>`, `<act>`.
2. Read the visit on the console case page.

**Expected Results:**

* It reads `<visit reads>`.

---

## g10.vault-visit-booking.US3: Collector moves a visit they cannot make

**As a** collector,
**I want** to move or cancel my visit up to the slot, and to hear about it
whether I moved it or the shop did,
**so that** missing one day does not cost me the case.

<!-- trace:case id=g10.vault-visit-booking.TC-5u2 rev=1 -->
### g10.vault-visit-booking.US3-TC1: A visit moves to another day or shop, never offered its own slot, and the collector hears either way

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
* **Trace:** grade10-site-vault-visit-booking-US-03

**Pre-conditions:**

* The collector's case holds a booked visit at shop A.

**Test data:**

| `<mover>` | `<to>` |
| --- | --- |
| the collector, on `<case page>` | another free slot at shop A |
| the collector, on `<case page>` | a free slot at shop B |
| admin(holds `vault:operate`), in the console's appointments | another free slot at shop A |

**Steps:**

1. As `<mover>`, open Move and read the slots offered.
2. Choose `<to>`, and confirm; book the same slot again from the page.
3. Read the case and the collector's inbox.

**Expected Results:**

* Step 1 offers every free slot but the visit's own.
* Step 3: the case holds one visit, at `<to>`; one moved letter arrives, carrying the calendar file.

<!-- trace:case id=g10.vault-visit-booking.TC-k1q rev=1 -->
### g10.vault-visit-booking.US3-TC2: Calling a visit off leaves the case standing, and it takes another booking

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-03

**Pre-conditions:**

* customer(collector) is on `<case page>`, its loan running and a visit booked.

**Steps:**

1. Select Cancel visit, and confirm.
2. Read the case, the inbox, then book another free slot.

**Expected Results:**

* Step 2: the case keeps its status, item and loan, and holds no visit; a called-off letter arrives; the new booking is held.

<!-- trace:case id=g10.vault-visit-booking.TC-8bc rev=1 -->
### g10.vault-visit-booking.US3-TC3: A missed drop-off ends the request, and the collector is told

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-03

**Pre-conditions:**

* The collector's sent-in case holds a drop-off visit, no item taken in.

**Steps:**

1. Let the slot pass by 25 hours with no visit recorded.
2. Read `<case page>` and the inbox.

**Expected Results:**

* The case reads expired; a letter says the visit was missed.

---

## g10.vault-visit-booking.US4: Collector puts the visit in their calendar

**As a** collector who has just booked,
**I want** a confirmation naming the shop, the slot and what to bring, and
the visit added to my phone's calendar,
**so that** I turn up on the day, prepared.

<!-- trace:case id=g10.vault-visit-booking.TC-l10 rev=1 covers=g10.vault-visit-booking.SC-hzh,g10.vault-visit-booking.SC-6qa,g10.vault-visit-booking.SC-4lt,g10.vault-visit-booking.SC-plm,g10.vault-visit-booking.SC-fnz,g10.vault-visit-booking.SC-02u,g10.vault-visit-booking.SC-ju4,g10.vault-visit-booking.SC-zqo,g10.vault-visit-booking.SC-qpx,g10.vault-visit-booking.SC-t70,g10.vault-visit-booking.SC-my4 -->
### g10.vault-visit-booking.US4-TC1: A booked visit reads its shop, slot and what comes next for the case's lane and identity

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector), `<identity>`, has just booked a visit on a `<lane>` case.

**Test data:**

| `<lane>` | `<identity>` | `<case reads>` |
| --- | --- | --- |
| financed | verified | the visit, the amount asked for, and the identity verified |
| storage | verified | the visit and no amount, the custody agreement named instead |
| financed | not verified | the visit, the amount asked for, and the identity not verified with the check offered |

**Steps:**

1. Read the confirmation.
2. Leave, and reopen `<case page>`.

**Expected Results:**

* Step 1 names the shop, its address and the slot, and reads `<case reads>`.
* Step 2 reads the same, offering Add to calendar, Move and Cancel visit.

<!-- trace:case id=g10.vault-visit-booking.TC-nje rev=1 -->
### g10.vault-visit-booking.US4-TC2: The calendar file holds the visit, follows a move or a call-off, and rides on every visit letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) is on `<case page>`, `<case>`.

**Test data:**

| `<case>` | `<then>` | `<calendar reads>` |
| --- | --- | --- |
| a booked visit | select Add to calendar | one day at the shop's address and the slot |
| a booked visit already on the calendar | move it, then open the file again | the same day moved to the new slot, no second day |
| a booked visit already on the calendar | call it off, then open the file again | the day taken off the calendar |
| never booked | open the visit's calendar address | refused as not found; no file |

**Steps:**

1. `<then>`.
2. Read the booked, moved and called-off letters that arrived.

**Expected Results:**

* Step 1: the calendar reads `<calendar reads>`.
* Step 2: each letter carries the visit's calendar file.
