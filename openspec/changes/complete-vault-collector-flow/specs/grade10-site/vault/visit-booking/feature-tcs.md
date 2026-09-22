# grade10-site/vault/visit-booking Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0
**Out of suite:** `grade10-site-vault-visit-booking-SC-23` — the owner guard on the visit's calendar file, walked in the vault backend's own route test; a case here traces a journey, and nobody walks a stranger's fetch.

## grade10-site-vault-visit-booking-US1: Collector books the visit they hand the item over at

**As a** collector,
**I want** to pick a shop and a free slot for my case whenever I am ready,
**so that** I can agree terms first and carry the item in afterwards.

### grade10-site-vault-visit-booking-US1-TC1-1: Booking picker is offered at every live status but draft

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

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

### grade10-site-vault-visit-booking-US1-TC2-1: Collector books the first free slot for their case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at a live status and no live booking.

**Steps:**

1. Choose <a shop with a free slot>.
2. Choose a free day inside the booking window.
3. Choose a free time and confirm the booking.

**Expected Results:**

* The visit becomes the case's one live booking.

### grade10-site-vault-visit-booking-US1-TC3-1: Staff at the counter book the visit for the collector

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* `admin(holds vault:operate)` is on the case's console page, with the case at a live status and no live booking.

**Steps:**

1. Open the visit section on the Case tab.
2. Choose <a shop with a free slot> and a free time, then confirm.

**Expected Results:**

* The visit becomes the case's one live booking.
* The collector is sent the booking confirmation, the same as if they had booked it themselves.

### grade10-site-vault-visit-booking-US1-TC4-1: Booking the slot the case already holds changes nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with a live booking for <a shop> at <a free slot>.

**Steps:**

1. Reopen the booking picker.
2. Choose the same shop and the same slot the case already holds, then confirm.

**Expected Results:**

* The case's booking is unchanged.
* No second visit or confirmation is created.

### grade10-site-vault-visit-booking-US1-TC5-1: No booking picker is offered on a draft case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at draft.

**Steps:**

1. Open the case page.

**Expected Results:**

* No visit booking picker is offered.

### grade10-site-vault-visit-booking-US1-TC6-1: A slot just past its own start is refused at the limit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at a live status and no live booking.
* A slot the picker lists for <a shop> has just reached its own start time on the shop's clock.

**Steps:**

1. Confirm the booking for that slot.

**Expected Results:**

* The booking is refused as past.
* The times list is offered again.

### grade10-site-vault-visit-booking-US1-TC7-1: No free slots leave the times list empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at a live status and no live booking.
* No shop has a free slot inside the 14-day booking window.

**Steps:**

1. Choose a shop.
2. Open the day and time picker.

**Expected Results:**

* No times are offered for any day in the window.
* The times list reads the nothing-free message.

### grade10-site-vault-visit-booking-US1-TC8-1: A slot taken before confirming is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector has chosen <a shop> and a free slot, and that slot was booked by someone else before they confirmed.

**Steps:**

1. Confirm the booking for that slot.

**Expected Results:**

* The booking is refused as unavailable.
* The times list reads again with that slot removed.

### grade10-site-vault-visit-booking-US1-TC9-1: Cancelling the visit closes it and reopens the picker

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with a live booking for <a shop> at <a free slot>.

**Steps:**

1. Choose Cancel visit.
2. Confirm the cancellation.

**Expected Results:**

* The visit closes.
* The case stays at its current status.
* The booking picker reopens on the page.

### grade10-site-vault-visit-booking-US1-TC10-1: A sibling case shows the lead case's visit and no picker

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector has just confirmed a booking for <a shop> at <a free slot>, on a financed-lane case.

**Steps:**

1. Land on the booked-visit screen after confirming the booking.

**Expected Results:**

* The screen names the shop, its address and the picked slot.
* The before-you-come list shows verify identity, bring the item and sign at the counter.
* On this financed-lane case the list adds that the money follows the signing.

### grade10-site-vault-visit-booking-US4-TC2-1: Add to calendar serves a file naming the visit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector is on the booked-visit screen, with a live booking for <a shop> at <a free slot>.

**Steps:**

1. Choose Add to calendar.
2. Open the served file.

**Expected Results:**

* The file names this visit's shop and slot.
* The phone's calendar opens it.

### grade10-site-vault-visit-booking-US4-TC3-1: A verified identity leaves nothing to bring but the item

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector's identity already reads verified, and their case has a live booking.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The identity item reads verified.
* Nothing else is asked but bringing the item.

### grade10-site-vault-visit-booking-US4-TC4-1: An unverified identity offers verify now before the visit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector's identity has not been verified, and their case has a live booking.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The identity item reads Verify now, linking <grade10 vault verify url>.
* The in-person line stands beside it.

### grade10-site-vault-visit-booking-US4-TC5-1: A storage lane visit carries no money follows item

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector's case is on the storage lane, with a live booking.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The sign item names the custody agreement only.
* No money-follows item is shown.

### grade10-site-vault-visit-booking-US4-TC6-1: Moving the visit serves a file that replaces the old one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector has a live booking for <a shop> at <a free slot>, its calendar file already added to the phone.

**Steps:**

1. Choose Move.
2. Choose a new shop or slot and confirm.
3. Choose Add to calendar again.

**Expected Results:**

* Move offers the same shops and slots the first booking was picked from, another shop among them.
* The booked-visit screen shows the new slot.
* The new file replaces the earlier one, leaving one entry on the phone.

### grade10-site-vault-visit-booking-US4-TC7-1: Cancelling the visit withdraws its calendar file

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector has a live booking, its calendar file already added to the phone.

**Steps:**

1. Choose Cancel.
2. Confirm the cancellation.

**Expected Results:**

* The visit closes and the booking picker reopens.
* The calendar file is withdrawn, leaving no entry on the phone.

### grade10-site-vault-visit-booking-US4-TC8-1: A stale cached visit is repaired against the diary

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The diary's own record of the visit disagrees with the case's cached copy.

**Steps:**

1. Open the booked-visit screen.

**Expected Results:**

* The screen reads the diary's own slot.
* The case's cached copy is repaired to match it.
* No action is taken on the stale value.

### grade10-site-vault-visit-booking-US4-TC9-1: Visit completion turns on the slot's start at the limit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector has a live booking for <a shop> at <a free slot>.

**Test data:**

| Counter act timing | Outcome |
| --- | --- |
| Before the slot's start time | Visit stays open |
| Exactly at the slot's start time | Visit completes |
| After the slot's start time | Visit completes |

**Steps:**

1. Record a counter act on this case at <counter act timing>.

**Expected Results:**

* The visit's state matches the row's outcome.

### grade10-site-vault-visit-booking-US4-TC10-1: An ended case's visit reads cancelled or a no-show

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector's case has a live booking.

**Test data:**

| Case ending | Visit state before ending | Outcome |
| --- | --- | --- |
| Cancelled | Still ahead | Visit reads cancelled |
| Forfeited | Already past | Visit reads a no-show |

**Steps:**

1. End the case as <case ending>, its visit <visit state before ending>.
2. Open the case page.

**Expected Results:**

* The visit reads as the row's outcome.
* The case keeps the visit's record; nothing is cleared.


### grade10-site-vault-visit-booking-US4-TC11-1: A standing visit reads the same when the case is opened

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector has a live booking for <a shop> at <a free slot>, its slot still ahead.

**Steps:**

1. Leave the booked-visit screen and open <grade10 vault case url> again.

**Expected Results:**

* The shop, its address and the slot are named, the same as on the booked-visit screen.
* Add to calendar, Move and Cancel visit are offered.

### grade10-site-vault-visit-booking-US4-TC12-1: The visit's messages carry its calendar file

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-04

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at a live status.

**Test data:**

| Act | Message |
| --- | --- |
| Book a slot | Visit booked |
| Move the visit | Visit moved |
| Cancel the visit | Visit cancelled |

**Steps:**

1. Carry out <act> on the case.
2. Open the <message> the collector is sent.

**Expected Results:**

* The message carries the visit's calendar file.
* The file names the same visit the case reads.

## Settled

- A case whose collector holds a live booking on another of their cases reads that visit, its shop and its slot, and offers no picker of its own.
- A move opens the picker a first booking is taken from, so another shop is as open to it as another day and time.

## Reconciliation

Run: 2026-09-22, blind pass over the isolated input — the outline (`## Purpose`
and `## Feature set`), `user-journeys.md`, `proposal.md`, `decisions.md` with
its `## Raised` table, `ui-design.md` with its state dispositions stripped, and
the PRD pages the proposal links; denied every `## Requirements` section,
`openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. Nothing
verifies that list; it is the run's word.

Nineteen cases were read against `grade10-site-vault-visit-booking-SC-15`
through `grade10-site-vault-visit-booking-SC-26` and the durable scenarios
`grade10-site-vault-visit-booking-SC-01` through
`grade10-site-vault-visit-booking-SC-14`. No case was dropped as a misreading,
the two readings contradicted each other nowhere, and the pass raised no
question the rulings left open.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-visit-booking-US1-TC1-1` | Covered | `grade10-site-vault-visit-booking-SC-01`, `grade10-site-vault-visit-booking-SC-03`; the table gained `repaid`, which the durable requirement names and the blind pass could not see |
| `grade10-site-vault-visit-booking-US1-TC2-1` | Covered | `grade10-site-vault-visit-booking-SC-01` |
| `grade10-site-vault-visit-booking-US1-TC3-1` | Covered | the durable requirement's counter clause, nearest scenario `grade10-site-vault-visit-booking-SC-06`; this change does not touch it |
| `grade10-site-vault-visit-booking-US1-TC4-1` | Covered | `grade10-site-vault-visit-booking-SC-05` |
| `grade10-site-vault-visit-booking-US1-TC5-1` | Covered | `grade10-site-vault-visit-booking-SC-03` |
| `grade10-site-vault-visit-booking-US1-TC6-1` | Covered | `grade10-site-vault-visit-booking-SC-07` |
| `grade10-site-vault-visit-booking-US1-TC7-1` | Folded | `grade10-site-vault-visit-booking-SC-28` — a window with no free slot reads the no-slot line and offers the next; the design's Nothing free row closes on it |
| `grade10-site-vault-visit-booking-US1-TC8-1` | Folded | `grade10-site-vault-visit-booking-SC-29` — a slot taken between the read and the take is refused by name and the picker reads again; the design's Time taken row closes on it |
| `grade10-site-vault-visit-booking-US1-TC9-1` | Covered | `grade10-site-vault-visit-booking-SC-21` |
| `grade10-site-vault-visit-booking-US1-TC10-1` | Case added | walks `grade10-site-vault-visit-booking-SC-30`, the sibling case's page, which the first raised row settled |
| `grade10-site-vault-visit-booking-US4-TC1-1` | Covered | `grade10-site-vault-visit-booking-SC-15`, `grade10-site-vault-visit-booking-SC-16`; the money-follows line was added to its results, which nothing asserted |
| `grade10-site-vault-visit-booking-US4-TC2-1` | Covered | `grade10-site-vault-visit-booking-SC-22` |
| `grade10-site-vault-visit-booking-US4-TC3-1` | Covered | `grade10-site-vault-visit-booking-SC-19` |
| `grade10-site-vault-visit-booking-US4-TC4-1` | Covered | `grade10-site-vault-visit-booking-SC-18` |
| `grade10-site-vault-visit-booking-US4-TC5-1` | Covered | `grade10-site-vault-visit-booking-SC-17` |
| `grade10-site-vault-visit-booking-US4-TC6-1` | Covered | `grade10-site-vault-visit-booking-SC-24`, and `grade10-site-vault-visit-booking-SC-27` once its results asserted the move's own picker |
| `grade10-site-vault-visit-booking-US4-TC7-1` | Covered | `grade10-site-vault-visit-booking-SC-21`, `grade10-site-vault-visit-booking-SC-25` |
| `grade10-site-vault-visit-booking-US4-TC8-1` | Covered | `grade10-site-vault-visit-booking-SC-08` |
| `grade10-site-vault-visit-booking-US4-TC9-1` | Covered | `grade10-site-vault-visit-booking-SC-12`, `grade10-site-vault-visit-booking-SC-13`; the row at the slot's own start is the durable requirement's after its slot has started |
| `grade10-site-vault-visit-booking-US4-TC10-1` | Covered | `grade10-site-vault-visit-booking-SC-14` and the durable requirement's ended-case clause |
| `grade10-site-vault-visit-booking-US4-TC11-1` | Case added | walks `grade10-site-vault-visit-booking-SC-20`, the standing visit read on the case, which no case reached |
| `grade10-site-vault-visit-booking-US4-TC12-1` | Case added | walks `grade10-site-vault-visit-booking-SC-26`; `grade10-site/vault/collector-notifications`' suite carries no case for the file the visit's messages attach |
| `grade10-site-vault-visit-booking-SC-23` | Out of suite | the `caseOwner` guard on `GET /api/cases/:caseId/visit.ics`, in the vault backend's route test; a case here traces a journey, and nobody walks a stranger's fetch |
| Raised: does a sibling case offer a picker of its own? | Folded | `grade10-site-vault-visit-booking-SC-30`, landed as `Q32` in `decisions.md` |
| Raised: may a move pick a different shop? | Folded | `grade10-site-vault-visit-booking-SC-27`, landed as `Q33` in `decisions.md` |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-visit-booking-US4-TC2-1` | A test reads the served file's own bytes; that the collector's calendar opens it is the device's answer, not the site's |
| `grade10-site-vault-visit-booking-US4-TC6-1` | One entry after a move is the calendar app's own merge on the file's id and revision, which only a device shows |
| `grade10-site-vault-visit-booking-US4-TC7-1` | The same device read: the cancellation taking the day off the phone |
