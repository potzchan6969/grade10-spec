# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-vault-case-lifecycle-US1: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

### grade10-site-vault-case-lifecycle-US1-TC1-1: Cancel closes what stands open on the request

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for the case
  in the row.

**Test data:**

| Case | State | Confirmation names |
| --- | --- | --- |
| <case_1> | A submitted request, no offer and no visit booked | Nothing beyond the request itself |
| <case_2> | A live offer waiting for an answer, no visit booked | The offer it closes |
| <case_3> | Terms agreed, a visit booked, the item not yet handed over | The visit it closes |

**Steps:**

1. Click Cancel this request.
2. Read the confirmation.
3. Click Yes, cancel.

**Expected Results:**

* The confirmation reads what it closes, from the row.
* The case reads again as cancelled.
* No offer or visit is left open on the case.

---

### grade10-site-vault-case-lifecycle-US1-TC2-1: Cancel is withheld once the item is in the vault

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for
  <case_4>: the item is already in the vault.

**Steps:**

1. Open the case page.

**Expected Results:**

* Cancel this request is not offered anywhere on the page.

---

### grade10-site-vault-case-lifecycle-US1-TC3-1: Cancel is refused once the case has already moved on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for
  <case_3>: terms agreed, a visit booked, the item not yet handed over.
* Staff confirm the item vaulted while the confirmation below is open.

**Steps:**

1. Click Cancel this request.
2. Read the confirmation.
3. Click Yes, cancel.

**Expected Results:**

* The confirmation stays open, naming the refusal: the case has moved on.
* The page reads the case again, now in the vault, with Cancel this
  request withheld.

---

## grade10-site-vault-case-lifecycle-US2: Collector who stops answering is not left with an open case

**As a** collector,
**I want** a request I never came back to to end by itself, with a message
saying so,
**so that** I am not waiting on a case nobody is working and my item is not
expected at a counter.

### grade10-site-vault-case-lifecycle-US2-TC1-1: The case names its own deadline while a visit is unbooked

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for
  <case_5>: terms are agreed and no visit is booked yet.

**Steps:**

1. Open the case page.

**Expected Results:**

* The page prompts booking a visit.
* The page names the 30-day window before the case ends.

---

### grade10-site-vault-case-lifecycle-US2-TC2-1: A submitted request nobody books a visit for ends on its own

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* <case_6>: the request was submitted and no visit has ever been booked
  on it.

**Test data:**

| Days since submitted, no visit booked | Case reads |
| --- | --- |
| 29 | Still submitted, open |
| 30 | Expired |

**Steps:**

1. Open the case page at the row's day count.

**Expected Results:**

* The case reads the status from the row.
* At 30 days, the collector is told the case ended by itself.

---

### grade10-site-vault-case-lifecycle-US2-TC3-1: A case waiting to sign with no visit booked ends on its own

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
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* The case in the row has no visit booked since it moved into that
  state.

**Test data:**

| Case | Days since the move | Case reads |
| --- | --- | --- |
| <case_5> terms agreed, no visit | 29 | Still open |
| <case_5> terms agreed, no visit | 30 | Cancelled |
| <case_7> ready to sign, nothing executed, no visit | 29 | Still open |
| <case_7> ready to sign, nothing executed, no visit | 30 | Cancelled |

**Steps:**

1. Open the case page at the row's day count.

**Expected Results:**

* The case reads the status from the row.

---

### grade10-site-vault-case-lifecycle-US2-TC4-1: A missed visit ends a request that never reached custody

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
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* <case_8>: a submitted request, one visit was booked, and nobody was
  at the counter for its slot.

**Test data:**

| Hours since the missed slot | Case reads |
| --- | --- |
| under 24 | Still submitted, open, inviting another visit |
| 24 or more | Expired |

**Steps:**

1. Open the case page at the row's elapsed time.

**Expected Results:**

* The case reads the status from the row.

---

### grade10-site-vault-case-lifecycle-US2-TC5-1: A missed visit on a case already in the vault does not end it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* <case_9>: the item is already in the vault, a visit was booked, and
  nobody was at the counter for its slot, 24 or more hours ago.

**Steps:**

1. Open the case page.

**Expected Results:**

* The case reads exactly as it did before the missed slot; nothing
  reads ended.
* Only the visit reads missed; a new one can be booked.

---

## grade10-site-vault-case-lifecycle-US4: Collector reads how their case ended

**As a** collector whose case ended without a release,
**I want** the page to say why in my own words — the reason staff gave, that
the request was called off and by whom, the clock that ran out, or the
figure the item settled with the dates of the notice,
**so that** I know what happened and what, if anything, is still mine.

### grade10-site-vault-case-lifecycle-US4-TC1-1: A declined request reads the reason staff gave

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* <case_10>: staff declined the request while it was being valued, with
  a written reason.

**Steps:**

1. Open the case page.

**Expected Results:**

* The badge reads Declined, with the date.
* The staff's reason reads verbatim.
* The item reads as staying with the collector; a booked visit reads
  cancelled.
* The stepper stays at the stage the case reached, in progress; the
  badge names the ending.
* The ownership chip reads Closed, with the date.
* Start another request is offered.

---

### grade10-site-vault-case-lifecycle-US4-TC2-1: A cancelled request reads who closed it and when

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* <case_11>: the case was cancelled before the item reached custody,
  closed by the row's party.

**Test data:**

| Closed by |
| --- |
| The collector, from their own case page |
| Staff, from the console |
| The abandonment sweep |

**Steps:**

1. Open the case page.

**Expected Results:**

* The ending reads who closed it, matching the row, and when.
* An offer standing at the time reads closed; a booked visit reads
  cancelled.
* The stepper stays at the stage the case reached, in progress; the
  badge names the ending.
* The ownership chip reads Closed, with the date.

---

### grade10-site-vault-case-lifecycle-US4-TC3-1: An expired request reads which clock ran out

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
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* The case in the row ended as expired.

**Test data:**

| Case | Which clock |
| --- | --- |
| <case_6> submitted, no visit ever booked, 30 days passed | No visit was ever booked |
| <case_8> submitted, the one booked visit was missed, 24+ hours passed | A booked visit was missed |

**Steps:**

1. Open the case page.

**Expected Results:**

* The ending reads the same wording for both rows.
* The timeline names the clock from the row.
* Nothing was signed and the item never left the collector.
* The stepper stays at the stage the case reached, in progress; the
  badge names the ending.
* The ownership chip reads Closed, with the date.

---

### grade10-site-vault-case-lifecycle-US4-TC4-1: A forfeited case reads the settlement figure and the notice dates

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* <case_12>: an active loan, well past its due date, a written notice
  sent and its cure date passed; staff forfeited the item.

**Steps:**

1. Open the case page.

**Expected Results:**

* The page reads the settlement figure in its minor units with the
  ISO 4217 currency code, the notice's send date, and the date to pay
  by.
* The signed agreements stay on the page.
* The stepper stays at the stage the case reached, in progress; the
  badge names the ending.
* The ownership chip reads Closed, with the date.

---

### grade10-site-vault-case-lifecycle-US4-TC5-1: A released case's chip reads Collected

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* <case_13>: the item was released to the collector at the counter.

**Steps:**

1. Open the case page.

**Expected Results:**

* The ownership chip reads Collected, with the release date.

---

## grade10-site-vault-case-lifecycle-US5: Collector reads the fact their case meets

**As a** collector whose offer ran out, was declined or was replaced, whose
visit was closed as missed, or who asked for the item back,
**I want** the page to say so in my own words, that the case is still where
it was, and what to do next,
**so that** I do not take a closed offer or a closed visit for a closed
case.

### grade10-site-vault-case-lifecycle-US5-TC1-1: The stepper reads the case's own lane and stage

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for the
  case in the row.

**Test data:**

| Case | Lane | Currently at |
| --- | --- | --- |
| <case_14> | Financed | Ready to sign, documents not yet executed |
| <case_15> | Storage | In the vault, no loan |

**Steps:**

1. Open the case page.

**Expected Results:**

* The stepper shows eight stages for the financed lane and six for the
  storage lane.
* The storage lane's stages read Request, Valued, Agreed, Signed,
  Vault, Home, in that order.
* Every stage before the case's current one reads completed, the
  current stage reads in progress, and every stage after reads
  upcoming.

---

### grade10-site-vault-case-lifecycle-US5-TC2-1: The ownership chip reads Waiting on you

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for the
  case in the row.

**Test data:**

| Case | Reason |
| --- | --- |
| <case_2> | A live offer is waiting for an answer |
| <case_8> under 24 hours since the missed slot | The booked visit was missed |
| <case_16> | The collector asked for the item back, no pickup visit booked yet |

**Steps:**

1. Open the case page.

**Expected Results:**

* The ownership chip reads Waiting on you.

---

### grade10-site-vault-case-lifecycle-US5-TC3-1: The ownership chip reads With us

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for the
  case in the row.

**Test data:**

| Case | Reason |
| --- | --- |
| <case_1> | Just submitted, not yet valued |
| <case_17> | The collector declined an offer, being valued again |
| <case_18> | The last offer ran out unanswered |
| <case_4> | In the vault on the storage lane |
| <case_19> | In the vault on the financed lane, the advance not yet paid out |

**Steps:**

1. Open the case page.

**Expected Results:**

* The ownership chip reads With us.

---

### grade10-site-vault-case-lifecycle-US5-TC4-1: The case reads a lapsed offer as still open, not closed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* <case_18>: the offer's own expiry has passed, unanswered; a visit is
  already booked for later.

**Steps:**

1. Open the case page.

**Expected Results:**

* The page reads the offer as run out — the closed offer's amount and
  expiry — not a live one.
* Accept this offer and Decline this offer are not offered.
* The booked visit still stands.
* The page names the one thing to do next.

---

### grade10-site-vault-case-lifecycle-US5-TC5-1: The case reads a declined offer as still open, not closed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* <case_17>: the collector declined the only offer made so far; being
  valued again.

**Steps:**

1. Open the case page.

**Expected Results:**

* The badge reads Being valued.
* The declined figure and when it was declined both read.
* A booked visit still stands.
* Cancel this request stays available lower on the page.

---

### grade10-site-vault-case-lifecycle-US5-TC6-1: The case reads a missed visit as still open, not closed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* <case_8> under 24 hours since the missed slot: a submitted request,
  one visit was booked, nobody was at the counter for its slot.

**Steps:**

1. Open the case page.

**Expected Results:**

* The badge reads the case's status word, the chip reads Waiting on
  you.
* The missed slot reads on the page.
* Book another visit is offered.

---

### grade10-site-vault-case-lifecycle-US5-TC7-1: The case reads an ask for the item back, and hides the ask that raised it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* <case_16>: the item is in the vault, the collector has asked for it
  back, no pickup visit booked yet.

**Steps:**

1. Open the case page.

**Expected Results:**

* The badge reads In the vault, the chip reads Waiting on you.
* When the ask was recorded reads on the page.
* Book a pickup visit is offered.
* Ask for it back is no longer offered.

---

### grade10-site-vault-case-lifecycle-US5-TC8-1: A vaulted case on the storage lane reads what is owed as nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* <case_4>: the item is in the vault, storage lane, no loan.

**Steps:**

1. Open the case page.

**Expected Results:**

* The hero names the shop holding the item.
* Book a pickup visit and Ask for it back are both offered.
* The custody card reads outstanding: Nothing.
* The documents section reads with their fingerprints.

---

### grade10-site-vault-case-lifecycle-US5-TC9-1: Asking for the item back is refused once the case has already moved on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for
  <case_4>: the item is in the vault, storage lane, no loan.
* Staff move the case on while the confirmation below is open.

**Steps:**

1. Click Ask for it back.
2. Read the confirmation.
3. Click the confirming action.

**Expected Results:**

* The confirmation stays open, naming the refusal: the case has moved
  on.
* The page reads the case again, reflecting its current state; Ask for
  it back is no longer offered where it no longer applies.

---

### grade10-site-vault-case-lifecycle-US5-TC10-1: The case page reads its loading state and its not-found state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and navigates to <grade10 vault case
  page> for the row's condition.

**Test data:**

| Condition | Shows |
| --- | --- |
| The case is still loading | `case.loading`, nothing else |
| The id answers to no case anybody was issued | the site's not-found copy |
| The id answers to another collector's case | the same not-found copy |

**Steps:**

1. Open the case page.

**Expected Results:**

* The page shows only what the row names.
* The two not-found rows read the same page, with nothing on it telling
  them apart.

---

### grade10-site-vault-case-lifecycle-US5-TC11-1: Asking for the item back is recorded once

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* The collector is signed in and on <grade10 vault case page> for
  <case_4>: the item is in the vault, storage lane, no loan, no ask
  standing.

**Steps:**

1. Click Ask for it back.
2. Read the confirmation.
3. Click the confirming action.

**Expected Results:**

* The confirmation reads that the item leaves on a pickup visit against
  a signed release.
* The ask reads on the case with the day it was recorded.
* Ask for it back is no longer offered; Book a pickup visit is.

---

### grade10-site-vault-case-lifecycle-US5-TC12-1: The list and the case read one answer for a held item

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* <case_4>: the item is in the vault, storage lane, held since a known
  day.

**Steps:**

1. Open the vault home and read the case's card.
2. Open the case.

**Expected Results:**

* Both read the ownership chip With us.
* Both name the same day the item has been held since.

---

### grade10-site-vault-case-lifecycle-US5-TC13-1: Reading a derived fact writes nothing on the case

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
* **Trace:** `Derived at the read`

**Pre-conditions:**

* <case_18>: the offer's own expiry has passed, unanswered, and no
  sweep has closed it.

**Steps:**

1. Open the case page.
2. Reload it.
3. Read the case's history.

**Expected Results:**

* Both reads say the offer ran out and leave the case open for another
  offer.
* The status word is the same on both reads.
* The history carries no entry for either read.

---

### grade10-site-vault-case-lifecycle-US5-TC14-1: A case meeting two facts reads the later one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* <case_20>: the offer ran out on Monday and the booked visit was
  closed as missed on Wednesday.

**Steps:**

1. Open the case page.

**Expected Results:**

* The page reads the missed visit, the later of the two, and offers
  another visit.
* The offer that ran out reads on the timeline and not as the fact.

---

## Settled

- Cancel this request names only what stands open — the live offer, the booked visit, or both; a request holding neither names the request alone.
- Release refused answers Ask for it back, the collector's own release request, and the refusal stays on that confirmation.
- The guarded-move refusal fires on any status change under the caller, not on custody alone; the durable guarded-move rule already states it.
- An expired case reads one wording whichever clock ran out, with the clock that ran out named on the case's timeline.
- An unissued id and another collector's case read the same not-found page, and nothing on it tells the two apart.
- The book-within-30-days line shows from terms agreed onward, in every state with no live booking, and never before.

## Reconciliation

**Run** — the blind pass read this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. It wrote 23 cases over four journeys and six raised questions; the scenario pass issued `grade10-site-vault-case-lifecycle-SC-16` to `grade10-site-vault-case-lifecycle-SC-36`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1` row 1 — a request with no offer and no visit | Folded | The confirmation names only what stands open; `grade10-site-vault-case-lifecycle-SC-37`, and the move table's cell. Raised row 1, landed as `Q38` |
| `US1-TC2-1` — Cancel withheld once the item is in the vault | Covered | Durable `grade10-site-vault-case-lifecycle-SC-10`, and the move table's Offered while |
| `US1-TC3-1` — Cancel refused once the case moved | Covered | `grade10-site-vault-case-lifecycle-SC-19`, guarded by durable `grade10-site-vault-case-lifecycle-SC-04`, which refuses any status change under the caller. Raised row 3, landed as `Q40` |
| `US2-TC1-1` — the deadline while a visit is unbooked | Covered | `grade10-site-vault-case-lifecycle-SC-28`; the rule reads from terms agreed onward, never before. Raised row 6, landed as `Q43` |
| `US2-TC2-1`, `US2-TC3-1`, `US2-TC4-1` — the clock boundaries | Covered | The durable clock table and durable `grade10-site-vault-case-lifecycle-SC-06`; this change adds no clock |
| `US2-TC5-1` — a missed visit on a vaulted case | Covered | The durable clock table and `grade10-site-vault-case-lifecycle-SC-26` |
| `US4-TC1-1` | Covered | `grade10-site-vault-case-lifecycle-SC-20`, `grade10-site-vault-case-lifecycle-SC-32`, `grade10-site-vault-case-lifecycle-SC-36` |
| `US4-TC2-1` | Covered | `grade10-site-vault-case-lifecycle-SC-21`, `grade10-site-vault-case-lifecycle-SC-17` for the collector's own row |
| `US4-TC3-1` — a wording per clock | Amended | One wording whichever clock ran out, the clock named on the timeline: `grade10-site-vault-case-lifecycle-SC-22` and the case's expected results. Raised row 4, landed as `Q41` |
| `US4-TC4-1` | Covered | `grade10-site-vault-case-lifecycle-SC-23`; the money's rendering is `grade10-site/vault/loan-and-settlement`'s |
| `US4-TC5-1` | Covered | `grade10-site-vault-case-lifecycle-SC-35` |
| `US5-TC1-1` | Covered | `grade10-site-vault-case-lifecycle-SC-30`, `grade10-site-vault-case-lifecycle-SC-31` |
| `US5-TC2-1` | Covered | `grade10-site-vault-case-lifecycle-SC-33` |
| `US5-TC3-1` — the With us rows | Amended | A fourth row for a vaulted financed case; `grade10-site-vault-case-lifecycle-SC-38` and the chip table now read either lane. Landed as `Q45` |
| `US5-TC4-1`, `US5-TC5-1`, `US5-TC6-1`, `US5-TC7-1` | Covered | `grade10-site-vault-case-lifecycle-SC-24`, `grade10-site-vault-case-lifecycle-SC-25`, `grade10-site-vault-case-lifecycle-SC-26`, `grade10-site-vault-case-lifecycle-SC-27` and `grade10-site-vault-case-lifecycle-SC-18` |
| `US5-TC8-1` — the vaulted storage page | Covered | The move table's Offered while and `grade10-site-vault-case-lifecycle-SC-18`; the documents and their fingerprints are `grade10-site/vault/documents-and-signing`'s |
| `US5-TC9-1` | Covered | `grade10-site-vault-case-lifecycle-SC-19` |
| `US5-TC10-1` — one not-found page | Amended | Two not-found rows, an unissued id and another collector's case, reading one page: `grade10-site-vault-case-lifecycle-SC-39`. Raised row 5, landed as `Q42` |
| `grade10-site-vault-case-lifecycle-SC-18` — the act of asking | Case added | `US5-TC11-1`: no case confirmed the ask; the suite only read the state after it |
| `grade10-site-vault-case-lifecycle-SC-34` — the list and the case | Case added | `US5-TC12-1`: the suite read the chip on the case and never against the list |
| `grade10-site-vault-case-lifecycle-SC-29` — nothing derived is written | Case added | `US5-TC13-1`: two reads, the same fact, no history entry. It traces `Derived at the read`, the group the scenario serves, so the group anchor is walked |
| `grade10-site-vault-case-lifecycle-SC-40` — two facts at once | Case added | `US5-TC14-1`, from the ruling that the later event's fact is the one read, landed as `Q44` |
| `grade10-site-vault-case-lifecycle-SC-19` — Release refused | Covered | The design's Release refused state is the ask's own refusal. Raised row 2, landed as `Q39` |

### Manual

| Manual | Why |
| --- | --- |
| `US4-TC1-1` | A person reads the staff reason against what staff typed; only the reason's presence automates |
| `US4-TC2-1` | A person reads that the ending names the party who closed it in the collector's words |
| `US4-TC3-1` | A person reads that both clocks give one wording and the timeline names the clock |
| `US4-TC4-1` | A person reads the figure, the notice date and the date to pay by against the notice that was sent |
| `US5-TC4-1`, `US5-TC5-1`, `US5-TC6-1`, `US5-TC7-1` | A person reads that the fact and the one thing to do next are the collector's words, not the status word |
| `US5-TC14-1` | A person reads which of the two facts the page leads with |
