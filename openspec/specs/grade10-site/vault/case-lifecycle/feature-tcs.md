# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

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

### grade10-site-vault-case-lifecycle-US1-TC4-1: The collector cancels a draft staff opened for them

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
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, a mailbox the tester reads, with two of staff's photographs.
* customer(collector) holding `<walk-in email>` is signed in at `grade10.com/vault`.

**Test data:**

| Field | Value |
| --- | --- |
| `<mail delivery window>` | 5 minutes (assumed; any wait past the first send attempt) |

**Steps:**

1. Open `<case_1>` from the case list.
2. Cancel the request and confirm.
3. Read the case list.
4. Wait <mail delivery window> and read `<walk-in email>`'s inbox.

**Expected Results:**

* Step 2 ends `<case_1>` as cancelled.
* Step 3 lists `<case_1>` as a cancelled request.
* Step 4 holds no message about `<case_1>`.

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

## grade10-site-vault-case-lifecycle-US6: Operator opens a walk-in again under the right address

**As a** member of shop staff who typed a customer's address wrong,
**I want** to cancel the unsent draft and open it again under the right
address,
**so that** the customer can send it, and the account at the wrong address
is never emailed and keeps nothing of it.

### grade10-site-vault-case-lifecycle-US6-TC1-1: Staff cancel a mistyped walk-in and open it again under the right address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on the page of walk-in draft `<case_1>`, opened for `<wrong email>` with two of staff's photographs; nobody has signed in to that account.
* Neither `<wrong email>` nor `<right email>` has received any message.
* `<right email>` is a mailbox the tester reads.

**Test data:**

| Field | Value |
| --- | --- |
| `<wrong email>` | `taiman.chn@example.com` |
| `<right email>` | `taiman.chan@example.com` |

**Steps:**

1. Click Cancel on `<case_1>` and confirm.
2. Open a walk-in for `<right email>` with the same facts and photographs.
3. As customer(collector) holding `<right email>`, sign in at `grade10.com/vault` and read the case list.

**Expected Results:**

* Step 1 ends `<case_1>`, and `<case_1>`'s page reads cancelled.
* Step 2 opens a new draft, `<case_2>`, with a reference of its own, under `<right email>`'s account.
* Step 3 lists `<case_2>` as a draft staff opened at the counter, and does not list `<case_1>`.
* Nothing about `<case_1>` or `<case_2>` is emailed to `<wrong email>` or `<right email>`; `<right email>` receives only its sign-in link.

### grade10-site-vault-case-lifecycle-US6-TC2-1: The account at the wrong address keeps nothing of a cancelled walk-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<wrong email>`, with two of staff's photographs whose addresses the tester has noted; for the second row, someone has since signed in to that account without sending it.
* The tester noted `<wrong email>`'s collector page address and one of `<case_1>`'s photograph addresses before the cancel.
* admin(staff, holds vault:operate and kyc:read) has cancelled `<case_1>` from the console.

**Test data:**

| Signed in to `<wrong email>` before the cancel |
| --- |
| nobody |
| someone, who did not send it |

**Steps:**

1. As admin(staff), open the noted collector page address.
2. As customer(collector) holding `<wrong email>`, sign in at `grade10.com/vault` and read the case list.
3. As that customer, open the noted photograph address.
4. Start three new requests, leaving each as a draft.

**Expected Results:**

* Step 1 lists no vault case for the account.
* Step 1's page answers for the account, never that nobody answers to that id.
* Step 2 lists nothing: no draft and no cancelled case.
* Step 3 is refused; the photograph is not served.
* Step 4 opens three drafts; the cancelled walk-in takes none of the account's three.
* `<wrong email>`'s mailbox holds no message about `<case_1>`.
* The queue's Closed view lists `<case_1>` under its reference, its item reading as erased and no collector named.

### grade10-site-vault-case-lifecycle-US6-TC3-1: A walk-in nobody sends ends on the seven-day draft clock and leaves nothing on the account

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
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* Walk-in draft `<case_1>` was opened for `<walk-in email>` and nobody has touched it since, for the time in the row.
* admin(staff, holds vault:read and kyc:read) is signed in to the console.

**Test data:**

| Untouched for | `<case_1>` |
| --- | --- |
| 7 days less one hour | still a draft, in the Drafts view |
| 7 days and one sweep | ended as expired; no longer under the account |
| 8 days, the collector having changed its title on day 5 | still a draft, the edit having restarted its clock |

**Steps:**

1. Let the draft clock's sweep run.
2. Open the queue's Drafts view.
3. Open the collector page of `<walk-in email>`'s account.

**Expected Results:**

* `<case_1>` reads as the row says.
* An expired `<case_1>` is not listed on the collector page, and nothing is emailed to `<walk-in email>`.
* An expired `<case_1>` stays in the queue's Closed view under its reference, its item reading as erased and no collector named.

### grade10-site-vault-case-lifecycle-US6-TC4-1: A walk-in the collector already sent is cancelled like any case

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
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* customer(collector) sent walk-in `<case_1>`, carrying two photographs, from their own phone; it reads submitted.
* admin(staff, holds vault:operate) is on `<case_1>`'s page.

**Steps:**

1. Cancel `<case_1>` and confirm.
2. As the collector, read the case list at `grade10.com/vault`.
3. Open `<case_1>`.

**Expected Results:**

* Step 2 lists `<case_1>` as cancelled.
* Step 3 reads that staff called the request off, with its photographs still shown.

### grade10-site-vault-case-lifecycle-US6-TC5-1: Staff cancelling a walk-in the collector has just sent is refused by name

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
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* admin(staff, holds vault:operate) has walk-in draft `<case_1>`'s page open, read while it was a draft.
* customer(collector) has since sent `<case_1>` from their own phone.

**Steps:**

1. Without reloading, click Cancel and confirm.

**Expected Results:**

* The cancel is refused by name, saying the case moved.
* `<case_1>` stays submitted, on the collector's list, with its photographs.

---

## Settled

- Cancel this request names only what stands open — the live offer, the booked visit, or both; a request holding neither names the request alone.
- Release refused answers Ask for it back, the collector's own release request, and the refusal stays on that confirmation.
- The guarded-move refusal fires on any status change under the caller, not on custody alone; the durable guarded-move rule already states it.
- An expired case reads one wording whichever clock ran out, with the clock that ran out named on the case's timeline.
- An unissued id and another collector's case read the same not-found page, and nothing on it tells the two apart.
- The book-within-30-days line shows from terms agreed onward, in every state with no live booking, and never before.
- A draft staff opened runs out 7 days from its last touch, so a collector's edit restarts the clock; it stays a draft staff opened until it is sent, silent and removed from the account when it runs out.
- Staff's cancel of an unsent draft staff opened removes it and emails nobody, whoever has signed in to the account since it opened.
- A collector who read a draft staff opened and never sent it loses it from their list without a word when the clock ends it.

## Reconciliation

**Run** — the blind pass read this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. It wrote 23 cases over four journeys and six raised questions; the scenario pass issued `grade10-site-vault-case-lifecycle-SC-16` to `grade10-site-vault-case-lifecycle-SC-36`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1` row 1 — a request with no offer and no visit | Folded | The confirmation names only what stands open; `grade10-site-vault-case-lifecycle-SC-37`, and the move table's cell. Raised row 1, landed as Q38 |
| `US1-TC2-1` — Cancel withheld once the item is in the vault | Covered | Durable `grade10-site-vault-case-lifecycle-SC-10`, and the move table's Offered while |
| `US1-TC3-1` — Cancel refused once the case moved | Covered | `grade10-site-vault-case-lifecycle-SC-19`, guarded by durable `grade10-site-vault-case-lifecycle-SC-04`, which refuses any status change under the caller. Raised row 3, landed as Q40 |
| `US2-TC1-1` — the deadline while a visit is unbooked | Covered | `grade10-site-vault-case-lifecycle-SC-28`; the rule reads from terms agreed onward, never before. Raised row 6, landed as Q43 |
| `US2-TC2-1`, `US2-TC3-1`, `US2-TC4-1` — the clock boundaries | Covered | The durable clock table and durable `grade10-site-vault-case-lifecycle-SC-06`; this change adds no clock |
| `US2-TC5-1` — a missed visit on a vaulted case | Covered | The durable clock table and `grade10-site-vault-case-lifecycle-SC-26` |
| `US4-TC1-1` | Covered | `grade10-site-vault-case-lifecycle-SC-20`, `grade10-site-vault-case-lifecycle-SC-32`, `grade10-site-vault-case-lifecycle-SC-36` |
| `US4-TC2-1` | Covered | `grade10-site-vault-case-lifecycle-SC-21`, `grade10-site-vault-case-lifecycle-SC-17` for the collector's own row |
| `US4-TC3-1` — a wording per clock | Amended | One wording whichever clock ran out, the clock named on the timeline: `grade10-site-vault-case-lifecycle-SC-22` and the case's expected results. Raised row 4, landed as Q41 |
| `US4-TC4-1` | Covered | `grade10-site-vault-case-lifecycle-SC-23`; the money's rendering is `grade10-site/vault/loan-and-settlement`'s |
| `US4-TC5-1` | Covered | `grade10-site-vault-case-lifecycle-SC-35` |
| `US5-TC1-1` | Covered | `grade10-site-vault-case-lifecycle-SC-30`, `grade10-site-vault-case-lifecycle-SC-31` |
| `US5-TC2-1` | Covered | `grade10-site-vault-case-lifecycle-SC-33` |
| `US5-TC3-1` — the With us rows | Amended | A fourth row for a vaulted financed case; `grade10-site-vault-case-lifecycle-SC-38` and the chip table now read either lane. Landed as Q45 |
| `US5-TC4-1`, `US5-TC5-1`, `US5-TC6-1`, `US5-TC7-1` | Covered | `grade10-site-vault-case-lifecycle-SC-24`, `grade10-site-vault-case-lifecycle-SC-25`, `grade10-site-vault-case-lifecycle-SC-26`, `grade10-site-vault-case-lifecycle-SC-27` and `grade10-site-vault-case-lifecycle-SC-18` |
| `US5-TC8-1` — the vaulted storage page | Covered | The move table's Offered while and `grade10-site-vault-case-lifecycle-SC-18`; the documents and their fingerprints are `grade10-site/vault/documents-and-signing`'s |
| `US5-TC9-1` | Covered | `grade10-site-vault-case-lifecycle-SC-19` |
| `US5-TC10-1` — one not-found page | Amended | Two not-found rows, an unissued id and another collector's case, reading one page: `grade10-site-vault-case-lifecycle-SC-39`. Raised row 5, landed as Q42 |
| `grade10-site-vault-case-lifecycle-SC-18` — the act of asking | Case added | `US5-TC11-1`: no case confirmed the ask; the suite only read the state after it |
| `grade10-site-vault-case-lifecycle-SC-34` — the list and the case | Case added | `US5-TC12-1`: the suite read the chip on the case and never against the list |
| `grade10-site-vault-case-lifecycle-SC-29` — nothing derived is written | Case added | `US5-TC13-1`: two reads, the same fact, no history entry. It traces `Derived at the read`, the group the scenario serves, so the group anchor is walked |
| `grade10-site-vault-case-lifecycle-SC-40` — two facts at once | Case added | `US5-TC14-1`, from the ruling that the later event's fact is the one read, landed as Q44 |
| `grade10-site-vault-case-lifecycle-SC-19` — Release refused | Covered | The design's Release refused state is the ask's own refusal. Raised row 2, landed as Q39 |

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote five cases over one journey and raised five questions for this capability, writing no case for the collector's own cancel; the scenario pass issued `grade10-site-vault-case-lifecycle-SC-41` to `grade10-site-vault-case-lifecycle-SC-44` and carried `grade10-site-vault-case-lifecycle-SC-09` and `grade10-site-vault-case-lifecycle-SC-10` in its MODIFIED block. Two scenarios were folded here, `grade10-site-vault-case-lifecycle-SC-45` and `grade10-site-vault-case-lifecycle-SC-46`, and one case added.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-case-lifecycle-US6-TC1-1` | Joined | `grade10-site-vault-case-lifecycle-SC-41` and `grade10-site-vault-case-lifecycle-SC-42` |
| `grade10-site-vault-case-lifecycle-US6-TC2-1` | Joined | `grade10-site-vault-case-lifecycle-SC-41`; the empty collector page is `grade10-admin/console/collector-page`'s rule that a removed case is not listed, and the freed places are the intake cap's |
| `grade10-site-vault-case-lifecycle-US6-TC3-1` | Joined | `grade10-site-vault-case-lifecycle-SC-43` and `grade10-site-vault-case-lifecycle-SC-47`; the expired case stays in the Closed view reading as erased, Q29 |
| `grade10-site-vault-case-lifecycle-US6-TC2-1` | Joined | `grade10-site-vault-case-lifecycle-SC-48` for the row someone signed in to, Q31 |
| `grade10-site-vault-case-lifecycle-US6-TC4-1` | Folded | `grade10-site-vault-case-lifecycle-SC-45`: the requirement ends a draft staff opened only while it is unsent, and no scenario walked the sent one cancelled, told and kept |
| `grade10-site-vault-case-lifecycle-US6-TC5-1` | Folded | `grade10-site-vault-case-lifecycle-SC-46`: the durable guarded-move rule refuses a move on any status change under its caller, and no scenario walked staff's cancel racing the collector's send. The tech design's `admin.cancel` now carries the status the page read |
| `grade10-site-vault-case-lifecycle-SC-44` | Case added | `grade10-site-vault-case-lifecycle-US1-TC4-1`, under the collector's own journey the scenario serves; Q28 keeps it on their list |
| Raised: the collector's own cancel of a draft staff opened | Settled | Q28; `grade10-site-vault-case-lifecycle-SC-44` |
| Raised: a walk-in that runs out at the right address | Settled | Q20, Q23 and Q29; `grade10-site-vault-case-lifecycle-SC-43` and `grade10-site-vault-case-lifecycle-SC-41` |
| Raised: the clock on a draft staff opened, and a collector's edit | Settled | Q30 |
| Raised: a sign-in to the wrong account before staff cancel | Settled | Q31; `grade10-site-vault-case-lifecycle-SC-41` removes it whoever has signed in |
| Raised: staff's queue after an unsent walk-in is cancelled | Settled | Q29; `grade10-site-vault-case-lifecycle-SC-41` |
| Dev: the collector's own photographs on a removed draft | Settled | Q49; every photograph on it is removed |
| Dev: a removed walk-in reading as erased on staff's Closed view | Settled | Q29 |
| Design: Cancelled for a typo, Cancelled before sending | Closed on the row | `ui-design.md` names `grade10-site-vault-case-lifecycle-SC-41` and `grade10-site-vault-case-lifecycle-SC-44`; the second row is Q28's |

### Manual

| Manual | Why |
| --- | --- |
| `US4-TC1-1` | A person reads the staff reason against what staff typed; only the reason's presence automates |
| `US4-TC2-1` | A person reads that the ending names the party who closed it in the collector's words |
| `US4-TC3-1` | A person reads that both clocks give one wording and the timeline names the clock |
| `US4-TC4-1` | A person reads the figure, the notice date and the date to pay by against the notice that was sent |
| `US5-TC4-1`, `US5-TC5-1`, `US5-TC6-1`, `US5-TC7-1` | A person reads that the fact and the one thing to do next are the collector's words, not the status word |
| `US5-TC14-1` | A person reads which of the two facts the page leads with |
