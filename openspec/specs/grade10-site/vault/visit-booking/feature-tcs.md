# grade10-site/vault/visit-booking Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** `grade10-site-vault-visit-booking-SC-23` — the owner guard on the visit's calendar file, walked in the vault backend's own route test; a case here traces a journey, and nobody walks a stranger's fetch.

## grade10-site-vault-visit-booking-US1: Collector books the visit they hand the item over at

**As a** collector,
**I want** to pick a shop and a free slot for my case whenever I am ready,
**so that** I can agree terms first and carry the item in afterwards.

<!-- trace:case id=g10.vault-visit-booking.TC-xsa rev=1 covers=g10.vault-visit-booking.SC-arc,g10.vault-visit-booking.SC-uos,g10.vault-visit-booking.SC-79y,g10.vault-visit-booking.SC-ui2,g10.vault-visit-booking.SC-jiy,g10.vault-visit-booking.SC-16x,g10.vault-visit-booking.SC-fdv -->
### grade10-site-vault-visit-booking-US1-TC3-1: Staff at the counter book the visit for the collector

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-visit-booking.TC-lid rev=1 covers=g10.vault-visit-booking.SC-arc,g10.vault-visit-booking.SC-uos,g10.vault-visit-booking.SC-79y,g10.vault-visit-booking.SC-ui2,g10.vault-visit-booking.SC-jiy,g10.vault-visit-booking.SC-16x,g10.vault-visit-booking.SC-fdv -->
### grade10-site-vault-visit-booking-US1-TC5-1: No booking picker is offered on a draft case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-visit-booking-US-01

**Pre-conditions:**

* The collector is on <grade10 vault case url>, with their case at draft.

**Steps:**

1. Open the case page.

**Expected Results:**

* No visit booking picker is offered.

---

## grade10-site-vault-visit-booking-US3: Collector moves a visit they cannot make

**As a** collector,
**I want** to move or cancel my visit up to the slot, and to hear about it
whether I moved it or the shop did,
**so that** missing one day does not cost me the case.

---

## grade10-site-vault-visit-booking-US4: Collector puts the visit in their calendar

**As a** collector who has just booked,
**I want** a confirmation naming the shop, the slot and what to bring, and
the visit added to my phone's calendar,
**so that** I turn up on the day, prepared.

<!-- trace:case id=g10.vault-visit-booking.TC-tlb rev=1 covers=g10.vault-visit-booking.SC-hzh,g10.vault-visit-booking.SC-6qa,g10.vault-visit-booking.SC-4lt,g10.vault-visit-booking.SC-plm,g10.vault-visit-booking.SC-fnz,g10.vault-visit-booking.SC-02u,g10.vault-visit-booking.SC-ju4,g10.vault-visit-booking.SC-zqo,g10.vault-visit-booking.SC-qpx,g10.vault-visit-booking.SC-t70,g10.vault-visit-booking.SC-my4 -->
### grade10-site-vault-visit-booking-US4-TC9-1: Visit completion turns on the slot's start at the limit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-visit-booking.TC-l10 rev=1 covers=g10.vault-visit-booking.SC-hzh,g10.vault-visit-booking.SC-6qa,g10.vault-visit-booking.SC-4lt,g10.vault-visit-booking.SC-plm,g10.vault-visit-booking.SC-fnz,g10.vault-visit-booking.SC-02u,g10.vault-visit-booking.SC-ju4,g10.vault-visit-booking.SC-zqo,g10.vault-visit-booking.SC-qpx,g10.vault-visit-booking.SC-t70,g10.vault-visit-booking.SC-my4 -->
### grade10-site-vault-visit-booking-US4-TC11-1: A standing visit reads the same when the case is opened

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

## Settled

- The console no longer books a visit for the collector: the booking is owned by the standalone appointments change (`add-multi-store-appointments`) and the product no longer books its own visits, so `grade10-site-vault-visit-booking-US1-TC3-1` is `deprecated` and its walk, `vault/visit.spec.ts`, is gone.
- A case whose collector holds a live booking on another of their cases reads that visit, its shop and its slot, and offers no picker of its own.
- A move opens the picker a first booking is taken from, so another shop is as open to it as another day and time.
- **A case with no visit, or a cancelled one** - the calendar file is refused by name as not found for a case the diary never booked, and served as a cancellation for a called-off visit (Q23)

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
| Raised: does a sibling case offer a picker of its own? | Folded | `grade10-site-vault-visit-booking-SC-30`, landed as Q32 in `decisions.md` |
| Raised: may a move pick a different shop? | Folded | `grade10-site-vault-visit-booking-SC-27`, landed as Q33 in `decisions.md` |
| `grade10-site-vault-visit-booking-SC-31` | Case added, added after the run | `grade10-site-vault-visit-booking-US4-TC13-1`: a move never offers the visit's own current slot back, since the diary already counts it taken |

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

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-visit-booking-US4-TC2-1` | A test reads the served file's own bytes; that the collector's calendar opens it is the device's answer, not the site's |
| `grade10-site-vault-visit-booking-US4-TC6-1` | One entry after a move is the calendar app's own merge on the file's id and revision, which only a device shows |
| `grade10-site-vault-visit-booking-US4-TC7-1` | The same device read: the cancellation taking the day off the phone |
