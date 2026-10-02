# grade10-site/vault/visit-booking Test Cases

**Status:** pending-review

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
