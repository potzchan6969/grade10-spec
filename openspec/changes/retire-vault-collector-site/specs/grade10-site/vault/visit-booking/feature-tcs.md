# grade10-site/vault/visit-booking Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-visit-booking-US1: Collector books the visit they hand the item over at

**As a** collector,
**I want** to pick a shop and a free slot for my case whenever I am ready,
**so that** I can agree terms first and carry the item in afterwards.

### grade10-site-vault-visit-booking-US1-TC1-1: Booking picker is offered at every live status but draft

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* The collector is signed in with their case on <grade10 vault case url>.

**Test data:**

| Case status | Outcome |
| --- | --- |
| submitted | Picker offered |
| under_valuation | Picker offered |
| offer_made | Picker offered |
| accepted | Picker offered |
| signing | Picker offered |
| vaulted | Picker offered |
| active | Picker offered |
| repaid | Picker offered |

**Steps:**

1. Open <grade10 vault case url> for a case at <case status>.

**Expected Results:**

* The visit booking picker is offered on the case page.

---

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

---

### grade10-site-vault-visit-booking-US1-TC7-1: No free slots leave the times list empty

**Classification:**

* **Severity:** normal
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

* The collector is on <grade10 vault case url>, with their case at a live status and no live booking.
* No shop has a free slot inside the 14-day booking window.

**Steps:**

1. Choose a shop.
2. Open the day and time picker.

**Expected Results:**

* No times are offered for any day in the window.
* The times list reads the nothing-free message.

---

### grade10-site-vault-visit-booking-US1-TC10-1: A sibling case shows the lead case's visit and no picker

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
* **Trace:** grade10-site-vault-visit-booking-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* The collector has two live cases, one of which holds a live booking for <a shop> at <a free slot>.

**Steps:**

1. Open <grade10 vault case url> for the case that holds no booking.

**Expected Results:**

* The visit the other case holds is read, with its shop and its slot.
* No booking picker is offered on this case.

---

### grade10-site-vault-visit-booking-US1-TC11-1: The collector books a free slot as an act on their own case

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

* Step 1 offers slots within 14 days, in each shop's own zone, none already past.
* Step 2 is accepted.
* Step 3 reads a visit at `<shop_1>`, in `<slot_1>`.
* Step 4 holds a letter naming `<shop_1>` and `<slot_1>`.

---

### grade10-site-vault-visit-booking-US1-TC12-1: A slot taken before the booking lands is refused by name

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

---

### grade10-site-vault-visit-booking-US1-TC13-1: A booking is taken at every live status but a draft

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

### grade10-site-vault-visit-booking-US4-TC1-1: Booked visit names the shop the slot and what to bring

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* The collector has just confirmed a booking for <a shop> at <a free slot>, on a financed-lane case.

**Steps:**

1. Land on the booked-visit screen after confirming the booking.

**Expected Results:**

* The screen names the shop, its address and the picked slot.
* The before-you-come list shows verify identity, bring the item and sign at the counter.
* On this financed-lane case the list adds that the money follows the signing.

---

### grade10-site-vault-visit-booking-US4-TC3-1: A verified identity leaves nothing to bring but the item

**Classification:**

* **Severity:** normal
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

* The collector's identity already reads verified, and their case has a live booking.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The identity item reads verified.
* Nothing else is asked but bringing the item.

---

### grade10-site-vault-visit-booking-US4-TC4-1: An unverified identity offers verify now before the visit

**Classification:**

* **Severity:** normal
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

* The collector's identity has not been verified, and their case has a live booking.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The identity item reads Verify now, linking <grade10 vault verify url>.
* The in-person line stands beside it.

---

### grade10-site-vault-visit-booking-US4-TC5-1: A storage lane visit carries no money follows item

**Classification:**

* **Severity:** normal
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

* The collector's case is on the storage lane, with a live booking.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The sign item names the custody agreement only.
* No money-follows item is shown.

---

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

---

### grade10-site-vault-visit-booking-US4-TC14-1: The calendar file is served for the collector's own case

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
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, with a visit at `<shop_1>` in `<slot_1>`.

**Steps:**

1. Ask for the calendar file of `<case_1>`'s visit.
2. Open the file in a phone's calendar.

**Expected Results:**

* Step 1 serves one calendar file.
* Step 2 shows one entry at `<shop_1>`, in `<slot_1>`.

---

### grade10-site-vault-visit-booking-US4-TC15-1: Another collector is not served the calendar file

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* customer A holds `<case_1>`, with a visit at `<shop_1>` in `<slot_1>`.
* customer B holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. As customer B, ask for the calendar file of `<case_1>`'s visit.

**Expected Results:**

* Step 1 is refused; no file is served.
* The response names neither `<shop_1>` nor `<slot_1>`.
