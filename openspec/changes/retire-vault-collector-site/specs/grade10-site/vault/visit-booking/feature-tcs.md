# grade10-site/vault/visit-booking Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-visit-booking-US1: Collector books the visit they hand the item over at

**As a** collector,
**I want** to pick a shop and a free slot for my case whenever I am ready,
**so that** I can agree terms first and carry the item in afterwards.

### grade10-site-vault-visit-booking-US1-TC1-2: A booking is taken at every live status but a draft

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
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, standing as the row says, with no visit.
* `<slot_1>` at `<shop_1>` is free.

**Test data:**

| `<case_1>` stands | Step 1 |
| --- | --- |
| An unsent draft | Refused by name |
| A sent request | Accepted |
| A live loan | Accepted |

**Steps:**

1. Book `<slot_1>` at `<shop_1>` for `<case_1>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is answered as the row says.
* Step 2 reads a visit at `<slot_1>` only where step 1 was accepted.

### grade10-site-vault-visit-booking-US1-TC2-2: The collector books a free slot as an act on their own case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's sent request with no visit.
* `<collector email>` is the collector's mailbox, which the tester reads.

**Steps:**

1. Ask for the shops and free slots `<case_1>` may book.
2. Book `<slot_1>` at `<shop_1>` from that answer.
3. Ask for the collector's own read of `<case_1>`.
4. Read `<collector email>`'s inbox.

**Expected Results:**

* Step 1 offers slots in each shop's own zone, none already past.
* Step 2 is accepted, and its answer names `<shop_1>` and `<slot_1>`.
* Step 3 reads a visit at `<shop_1>`, in `<slot_1>`.
* Step 4 holds a letter naming `<shop_1>` and `<slot_1>`.

### grade10-site-vault-visit-booking-US1-TC4-2: Booking the slot the case already holds changes nothing

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
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` holds a live visit at `<shop_1>` in `<slot_1>`.
* `<collector email>` is the collector's mailbox, which the tester reads.

**Steps:**

1. Book `<slot_1>` at `<shop_1>` for `<case_1>` again.
2. Ask for the collector's own read of `<case_1>`.
3. Read `<collector email>`'s inbox.

**Expected Results:**

* Step 1 answers with the visit `<case_1>` already holds.
* Step 2 reads the same one visit, unchanged.
* Step 3 holds no second booking letter.

### grade10-site-vault-visit-booking-US1-TC5-1: No booking picker is offered on a draft case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at draft.

**Steps:**

1. Open the case page.

**Expected Results:**

* No visit booking picker is offered.

### grade10-site-vault-visit-booking-US1-TC6-2: A slot just past its own start is refused at the limit

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
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is at a live status with no live booking.
* `<slot_1>`, read free at `<shop_1>`, has just reached its own start time on the shop's clock.

**Steps:**

1. Book `<slot_1>` at `<shop_1>` for `<case_1>`.
2. Ask for the shops and free slots `<case_1>` may book.

**Expected Results:**

* Step 1 is refused as past.
* Step 2 answers the free slots again, without `<slot_1>`.

### grade10-site-vault-visit-booking-US1-TC7-2: A window with no free slot is answered with none

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is at a live status with no live booking.
* `<shop_1>`'s window holds no free slot.

**Steps:**

1. Ask for `<shop_1>`'s free slots in that window for `<case_1>`.

**Expected Results:**

* Step 1 answers no slot.

### grade10-site-vault-visit-booking-US1-TC8-2: A slot taken before the booking lands is refused by name

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
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's sent request with no visit.
* `<slot_1>` at `<shop_1>` was free when the collector last read the slots, and another booking has since taken it.

**Steps:**

1. Book `<slot_1>` at `<shop_1>` for `<case_1>`.
2. Ask for the shops and free slots `<case_1>` may book.
3. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name: the slot is taken.
* Step 2 does not offer `<slot_1>`.
* Step 3 reads no visit.

### grade10-site-vault-visit-booking-US1-TC9-2: Calling the visit off leaves the case where it stood and takes a new booking

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is at `offer_made` on the financed lane, with a visit at `<shop_1>` in `<slot_1>`.
* `<slot_2>` at `<shop_1>` is free.

**Steps:**

1. Cancel `<case_1>`'s visit as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.
3. Book `<slot_2>` at `<shop_1>` for `<case_1>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<case_1>` at `offer_made`, with its offer and item as before and no live visit.
* Step 3 is accepted.

### grade10-site-vault-visit-booking-US1-TC10-2: A case holding no visit reads beside its lead's

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
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` holds a live visit at `<shop_1>` in `<slot_1>`; `<case_2>`, the collector's other live case, holds none.

**Steps:**

1. Ask for the collector's own cases.

**Expected Results:**

* Step 1 carries `<case_1>` with its visit at `<shop_1>` in `<slot_1>`.
* Step 1 carries `<case_2>` with no visit of its own.

---

## grade10-site-vault-visit-booking-US3: Collector moves a visit they cannot make

**As a** collector,
**I want** to move or cancel my visit up to the slot, and to hear about it
whether I moved it or the shop did,
**so that** missing one day does not cost me the case.

### grade10-site-vault-visit-booking-US3-TC1-1: A move reads the shops and slots a first booking reads

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-03

**Pre-conditions:**

* customer A holds `<case_1>`, with a visit at `<shop_1>` in `<slot_1>`, and acts through the vault's API under a session, with no site page.
* customer B holds `<case_2>`, a sent request with no visit, and acts the same way.
* `<slot_2>` at `<shop_2>` is free.
* `<collector email>` is customer A's mailbox, which the tester reads.

**Steps:**

1. As customer B, ask for the shops and free slots `<case_2>` may book.
2. As customer A, ask for the shops and free slots `<case_1>` may move to.
3. As customer A, move `<case_1>`'s visit to `<slot_2>` at `<shop_2>`.
4. As customer A, ask for the collector's own read of `<case_1>`.
5. Read `<collector email>`'s inbox.

**Expected Results:**

* Step 2 offers every shop step 1 offers, and the same free slots, but `<slot_1>`.
* Step 3 is accepted.
* Step 4 reads the visit at `<shop_2>`, in `<slot_2>`.
* Step 5 holds a letter naming the moved visit.

---

## grade10-site-vault-visit-booking-US4: Collector puts the visit in their calendar

**As a** collector who has just booked,
**I want** a confirmation naming the shop, the slot and what to bring, and
the visit added to my phone's calendar,
**so that** I turn up on the day, prepared.

### grade10-site-vault-visit-booking-US4-TC1-2: A booked case's read names the shop, its address and the slot

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is on the financed lane, with a visit at `<shop_1>` in `<slot_1>`.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 names `<shop_1>`, its address and `<slot_1>`.
* Step 1 carries the amount asked for.

### grade10-site-vault-visit-booking-US4-TC2-2: The calendar file is served for the collector's own case

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, with a visit at `<shop_1>` in `<slot_1>`.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Ask for the calendar file of `<case_1>`'s visit.
3. Open the file in a phone's calendar.

**Expected Results:**

* Step 1 carries the booking, `<shop_1>` and `<slot_1>`.
* Step 2 serves one calendar file naming `<shop_1>`, its address and `<slot_1>`.
* Step 3 shows one entry at `<shop_1>`, in `<slot_1>`.

### grade10-site-vault-visit-booking-US4-TC3-2: A booked case reads the collector's identity verified

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector's identity reads verified, and `<case_1>` holds a live visit.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 reads the visit, and the identity verified.

### grade10-site-vault-visit-booking-US4-TC4-2: A booked case reads the collector's identity not yet verified

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector's identity has not been verified, and `<case_1>` holds a live visit.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 reads the visit, and the identity not verified.

### grade10-site-vault-visit-booking-US4-TC5-2: A booked case on the storage lane reads no amount asked for

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is on the storage lane, with a live visit.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 reads the visit, on the storage lane, with no amount asked for.

### grade10-site-vault-visit-booking-US4-TC6-2: Moving the visit serves a file that replaces the old entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` holds a live visit at `<shop_1>` in `<slot_1>`, its calendar file already opened in a phone's calendar.
* `<slot_2>` at `<shop_2>` is free.

**Steps:**

1. Move `<case_1>`'s visit to `<slot_2>` at `<shop_2>`.
2. Ask for the calendar file of `<case_1>`'s visit.
3. Open the file in the same phone's calendar.

**Expected Results:**

* Step 2 serves one file naming `<shop_2>` and `<slot_2>`, as the same entry the first file named.
* Step 3 leaves one entry on the phone, at `<shop_2>` in `<slot_2>`.

### grade10-site-vault-visit-booking-US4-TC7-2: Calling the visit off serves its file as a cancellation

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` holds a live visit, its calendar file already opened in a phone's calendar.

**Steps:**

1. Cancel `<case_1>`'s visit as an act on the collector's own case.
2. Ask for the calendar file of `<case_1>`'s visit.
3. Open the file in the same phone's calendar.

**Expected Results:**

* Step 2 serves the file as a cancellation of the same entry.
* Step 3 leaves no entry on the phone.

### grade10-site-vault-visit-booking-US4-TC8-2: A stale cached visit is repaired against the diary

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The diary's own record of `<case_1>`'s visit disagrees with the case's cached copy.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 reads the diary's own slot.
* The case's cached copy is repaired to match it.
* No action is taken on the stale value.

### grade10-site-vault-visit-booking-US4-TC10-2: An ended case's visit reads cancelled or a no-show

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` has a live booking.

**Test data:**

| Case ending | Visit state before ending | Outcome |
| --- | --- | --- |
| Cancelled | Still ahead | Visit reads cancelled |
| Forfeited | Already past | Visit reads a no-show |

**Steps:**

1. End `<case_1>` as <case ending>, its visit <visit state before ending>.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* The visit reads as the row's outcome.
* The case keeps the visit's record; nothing is cleared.

### grade10-site-vault-visit-booking-US4-TC11-1: A standing visit reads the same when the case is opened

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* The collector has a live booking for <a shop> at <a free slot>, its slot still ahead.

**Steps:**

1. Leave the booked-visit screen and open <grade10 vault case url> again.

**Expected Results:**

* The shop, its address and the slot are named, the same as on the booked-visit screen.
* Add to calendar, Move and Cancel visit are offered.

### grade10-site-vault-visit-booking-US4-TC12-2: The visit's messages carry its calendar file

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case at a live status, holding the visit the row's act needs.
* `<collector email>` is the collector's mailbox, which the tester reads.

**Test data:**

| Act | Message |
| --- | --- |
| Book a slot | Visit booked |
| Move the visit | Visit moved |
| Cancel the visit | Visit cancelled |

**Steps:**

1. Carry out the row's act on `<case_1>` as an act on the collector's own case.
2. Open the row's message in `<collector email>`.
3. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 2's message carries the visit's calendar file.
* The file names the same visit step 3 reads.

### grade10-site-vault-visit-booking-US4-TC13-2: A move never offers the visit's own slot back

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` holds a live visit at `<shop_1>` in `<slot_1>`.

**Steps:**

1. Ask for the shops and free slots `<case_1>`'s visit may move to.

**Expected Results:**

* Step 1 does not offer `<slot_1>`.
* Step 1 offers every other free slot.

### grade10-site-vault-visit-booking-US4-TC17-1: A case the diary never booked is refused the calendar file

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, and no visit was ever booked on it.

**Steps:**

1. Ask for the calendar file of `<case_1>`'s visit.

**Expected Results:**

* Step 1 is refused by name as not found, and no file is served.

## Settled

- **A case with no visit, or a cancelled one** - the calendar file is refused by name as not found for a case the diary never booked, and served as a cancellation for a called-off visit (Q23)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts` (`book`, `reschedule`, `cancelBooking`, `slots`, `detail`, `mine`) and `routes/visit.ts` with its test. It is a statement, not proof.

- **Raised, folded into spec** - a case the diary never booked is refused the file, as `grade10-site-vault-visit-booking-SC-32` under the calendar requirement, cited in task 2.6
- **Raised, escalated** - the file's answer with no visit, landed as Q23
- **Rejected** - `US4-TC15-1`, a stranger's fetch of the file: `grade10-site-vault-visit-booking-SC-23` is out of suite in the durable header, decided by the route test, and stays so
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run walked the case page or the booked-visit screen: `grade10-site-vault-visit-booking-US1-TC1-2`, `grade10-site-vault-visit-booking-US1-TC2-2`, `grade10-site-vault-visit-booking-US1-TC4-2`, `grade10-site-vault-visit-booking-US1-TC6-2`, `grade10-site-vault-visit-booking-US1-TC7-2`, `grade10-site-vault-visit-booking-US1-TC8-2`, `grade10-site-vault-visit-booking-US1-TC9-2`, `grade10-site-vault-visit-booking-US1-TC10-2`, `grade10-site-vault-visit-booking-US4-TC1-2`, `grade10-site-vault-visit-booking-US4-TC2-2`, `grade10-site-vault-visit-booking-US4-TC3-2`, `grade10-site-vault-visit-booking-US4-TC4-2`, `grade10-site-vault-visit-booking-US4-TC5-2`, `grade10-site-vault-visit-booking-US4-TC6-2`, `grade10-site-vault-visit-booking-US4-TC7-2`, `grade10-site-vault-visit-booking-US4-TC8-2`, `grade10-site-vault-visit-booking-US4-TC10-2`, `grade10-site-vault-visit-booking-US4-TC12-2`, `grade10-site-vault-visit-booking-US4-TC13-2`; `grade10-site-vault-visit-booking-US1-TC3-1` books at the console and stays as it is
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-visit-booking-US1-TC5-1`, a picker withheld on a draft, whose refusal `grade10-site-vault-visit-booking-US1-TC1-2` holds; `grade10-site-vault-visit-booking-US4-TC11-1`, the case page agreeing with the booked-visit screen
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US1-TC11-1` into `grade10-site-vault-visit-booking-US1-TC2-2`; `US1-TC12-1` into `grade10-site-vault-visit-booking-US1-TC8-2`; `US1-TC13-1` into `grade10-site-vault-visit-booking-US1-TC1-2`; `US1-TC14-1` into `grade10-site-vault-visit-booking-US1-TC7-2`; `US1-TC15-1` into `grade10-site-vault-visit-booking-US1-TC10-2`; `US3-TC2-1` into `grade10-site-vault-visit-booking-US1-TC9-2`; `US4-TC14-1` into `grade10-site-vault-visit-booking-US4-TC2-2`; `US4-TC16-1` into `grade10-site-vault-visit-booking-US4-TC1-2`, `grade10-site-vault-visit-booking-US4-TC3-2`, `grade10-site-vault-visit-booking-US4-TC4-2` and `grade10-site-vault-visit-booking-US4-TC5-2`
- **New ids kept** - `grade10-site-vault-visit-booking-US3-TC1-1`, the move journey's only case; `grade10-site-vault-visit-booking-US4-TC17-1`, a case the diary never booked
- **Joined** - `grade10-site-vault-visit-booking-SC-15` into `grade10-site-vault-visit-booking-US1-TC2-2`; `-SC-29` into `grade10-site-vault-visit-booking-US1-TC8-2`; `-SC-28` into `grade10-site-vault-visit-booking-US1-TC7-2`; `-SC-30` into `grade10-site-vault-visit-booking-US1-TC10-2`; `-SC-21` into `grade10-site-vault-visit-booking-US1-TC9-2`; `-SC-27`, `-SC-31` into `grade10-site-vault-visit-booking-US3-TC1-1`; `-SC-16` to `-SC-19` into `grade10-site-vault-visit-booking-US4-TC1-2` to `grade10-site-vault-visit-booking-US4-TC5-2`; `-SC-20`, `-SC-22` into `grade10-site-vault-visit-booking-US4-TC2-2`; `-SC-32` into `grade10-site-vault-visit-booking-US4-TC17-1`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Automated cases re-versioned** - `grade10-site-vault-visit-booking-US1-TC1-2`, `grade10-site-vault-visit-booking-US1-TC2-2`, `grade10-site-vault-visit-booking-US1-TC4-2`, `grade10-site-vault-visit-booking-US1-TC7-2`, `grade10-site-vault-visit-booking-US1-TC8-2`, `grade10-site-vault-visit-booking-US1-TC9-2`, `grade10-site-vault-visit-booking-US1-TC10-2`, `grade10-site-vault-visit-booking-US4-TC1-2`, `grade10-site-vault-visit-booking-US4-TC2-2`, `grade10-site-vault-visit-booking-US4-TC3-2`, `grade10-site-vault-visit-booking-US4-TC4-2`, `grade10-site-vault-visit-booking-US4-TC5-2`, `grade10-site-vault-visit-booking-US4-TC6-2`, `grade10-site-vault-visit-booking-US4-TC7-2`, `grade10-site-vault-visit-booking-US4-TC12-2`, `grade10-site-vault-visit-booking-US4-TC13-2` were decided by `visit.spec.ts` at `-1`; each is `manual` until task 4.4 retitles its API walk and flips it
