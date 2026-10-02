# grade10-site/vault/case-lifecycle Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** grade10-site-vault-case-lifecycle-SC-53 - the vault's transition tests, which see no due row raised by a corrected advance (task 7.1); grade10-site-vault-case-lifecycle-SC-57 - the prepare-documents tests over a fake register answering absent; the console reaches this only while a word is parked (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-59 - the prepare-documents tests over a fake register, where a case with no item id is registered inline; the console reaches this only on a case valued before the vault's deploy (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-61 - the prepare-release tests over a fake register answering retired and unreachable; the console reaches a retired item at release only through a retire between Prepare documents and vaulting (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-30; grade10-site-vault-case-lifecycle-SC-31; grade10-site-vault-case-lifecycle-SC-32; grade10-site-vault-case-lifecycle-SC-33; grade10-site-vault-case-lifecycle-SC-34; grade10-site-vault-case-lifecycle-SC-35; grade10-site-vault-case-lifecycle-SC-36; grade10-site-vault-case-lifecycle-SC-38 - the contracts' standing fold in `packages/vault/contracts/test/standing.test.ts` (task 2.3); the collector's read carries the status and day, and no surface draws the fold

## grade10-site-vault-case-lifecycle-US1: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

### grade10-site-vault-case-lifecycle-US1-TC2-1: Cancel is withheld once the item is in the vault

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

### grade10-site-vault-case-lifecycle-US1-TC5-1: The collector calls off their own request as an act on the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's request before the item is in the vault, holding a live offer and a booked visit.

**Steps:**

1. Call off `<case_1>` as an act on the collector's own case, naming the instant it was last read at.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted, and its answer names the offer it closed and the visit it cancelled.
* Step 2 reads `<case_1>` cancelled, ended, called off by the collector.
* Step 2 reads the offer closed and the visit cancelled.

---

### grade10-site-vault-case-lifecycle-US1-TC6-1: Calling off is refused once the item is in the vault

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, standing as the row says.

**Test data:**

| `<case_1>` stands | Lane |
| --- | --- |
| The item is in the vault | Storage |
| The item is in the vault and the loan is live | Financed |

**Steps:**

1. Call off `<case_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 still reads `<case_1>` as the row's state.

---

### grade10-site-vault-case-lifecycle-US1-TC7-1: Another collector cannot call off the case

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
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* customer A holds `<case_1>`, a request before the item is in the vault.
* customer B holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. As customer B, call off `<case_1>`.
2. As customer A, ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused, and the response carries none of `<case_1>`'s facts.
* Step 2 reads `<case_1>` as it stood before step 1.

---

### grade10-site-vault-case-lifecycle-US1-TC8-1: Calling off a request with nothing open names nothing closed

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
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's submitted request, with no offer made and no visit booked.

**Steps:**

1. Call off `<case_1>` as an act on the collector's own case.

**Expected Results:**

* Step 1 is accepted, reading `<case_1>` cancelled by the collector.
* Its answer names no closed offer and no cancelled visit.

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
* **Status:** deprecated
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
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* <case_6>: the request was submitted and no visit has ever been booked
  on it.

**Test data:**

| Days since submitted, no visit booked | Case reads |
| --- | --- |
| 29 | Still submitted, open |
| 30 | Expired |

**Steps:**

1. Ask for the collector's own read of <case_6> at the row's day count.

**Expected Results:**

* The case reads the status from the row.
* At 30 days, the read carries the case as ended by its own clock, with no visit ahead of it.

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
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
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

1. Ask for the collector's own read of the row's case at the row's day count.

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
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* <case_8>: a submitted request, one visit was booked, and nobody was
  at the counter for its slot.

**Test data:**

| Hours since the missed slot | Case reads |
| --- | --- |
| under 24 | Still submitted, open, inviting another visit |
| 24 or more | Expired |

**Steps:**

1. Ask for the collector's own read of <case_8> at the row's elapsed time.

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
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* <case_9>: the item is already in the vault, a visit was booked, and
  nobody was at the counter for its slot, 24 or more hours ago.

**Steps:**

1. Ask for the collector's own read of <case_9>.

**Expected Results:**

* The case reads exactly as it did before the missed slot; nothing
  reads ended.
* Only the visit reads missed; <case_9> takes another booking.

---

### grade10-site-vault-case-lifecycle-US2-TC6-1: A case with terms agreed and no visit ahead reads the day its clock calls it off

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
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_5>`'s terms were agreed on `<agreed day>`, with no visit ahead of it.

**Test data:**

| Field | Value |
| --- | --- |
| `<agreed day>` | 2 October, Asia/Hong_Kong |
| `<call-off day>` | 1 November, Asia/Hong_Kong: 30 days after `<agreed day>` |

**Steps:**

1. Ask for the collector's own read of `<case_5>`.

**Expected Results:**

* Step 1 reads `<case_5>` as waiting on the collector.
* Step 1 carries what `<call-off day>` is worked out from: the case's own 30-day clock from `<agreed day>`.

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
* **Status:** deprecated
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

### grade10-site-vault-case-lifecycle-US4-TC3-1: An expired request reads which clock ran out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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

### grade10-site-vault-case-lifecycle-US4-TC6-1: The collector's own read of an ended case says why it ended

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, ended as the row says.

**Test data:**

| Ending | How it ended | The read carries |
| --- | --- | --- |
| Declined | Staff declined it under valuation, giving `<staff reason>` | `<staff reason>`, word for word |
| Cancelled | Staff called it off before the item was in the vault, while it held a live offer and a booked visit | That staff called it off, the offer that closed and the visit cancelled with it |
| Expired | No visit was booked before its clock ran out | The clock with no visit ahead of it |
| Expired | Its booked visit was missed, before the item was in the vault | The clock of the missed visit |
| Forfeited | Staff forfeited it after a notice's date to pay by passed | The figure the item settled, the day the notice was written and its date to pay by; its signed agreements still readable |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Read the API response.

**Expected Results:**

* Step 2 reads `<case_1>` ended as the row's ending, with the day it closed.
* Step 2 carries what the row's read carries.

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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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
* **Status:** deprecated
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

### grade10-site-vault-case-lifecycle-US5-TC12-1: The list and the case read one answer for a held item

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

### grade10-site-vault-case-lifecycle-US5-TC15-1: The collector asks for the item back as an act on their own case

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case on the storage lane; the item is in the vault and nothing is owed.

**Steps:**

1. Ask for the item back on `<case_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.
3. Ask for the item back on `<case_1>` again.
4. Ask for the collector's own read of `<case_1>` again.
5. Book `<slot_1>` at `<shop_1>`, a free slot, for `<case_1>`'s pickup.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads the ask, with the day it was recorded; the item is still in the vault.
* Step 3 answers with `<case_1>`, and records nothing.
* Step 4 reads one ask, with the same day as step 2.
* Step 5 is accepted.

---

### grade10-site-vault-case-lifecycle-US5-TC16-1: Asking for the item back is refused where it is not the collector's to ask

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer A holds `<case_1>`, standing as the row says.
* The row's asker holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Test data:**

| `<case_1>` stands | Asker | Step 1 |
| --- | --- | --- |
| The item is in the vault | customer B | Refused; the response carries none of `<case_1>`'s facts |
| A request sent, the item not yet in the vault | customer A | Refused by name |

**Steps:**

1. As the row's asker, ask for the item back on `<case_1>`.
2. As customer A, ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is answered as the row says.
* Step 2 reads no ask for the item back.

---

### grade10-site-vault-case-lifecycle-US5-TC17-1: The collector's own read names the fact the case meets and keeps its status

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's case, meeting the row's fact.

**Test data:**

| Fact | How `<case_1>` meets it | The read carries | Status |
| --- | --- | --- | --- |
| The offer ran out | Its live offer passed its own expiry yesterday with no answer, and no sweep has closed it | The offer that closed, its amount and the day it ran out | `offer_made` |
| The offer was declined | The collector declined its live offer, with a visit booked | The figure declined and the day; the booked visit still standing | `under_valuation` |
| The offer was replaced | Staff wrote a counter-offer over its live offer | The offer that closed and its day, beside the live offer | `offer_made` |
| The visit was missed | Its item is in the vault, and its visit was closed as missed | The slot that was missed | `vaulted` |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Read the API response.

**Expected Results:**

* Step 2 names the row's fact and carries what the row's read carries.
* Step 2 reads `<case_1>` at the row's status.
* Step 2 does not read `<case_1>` as ended.

---

### grade10-site-vault-case-lifecycle-US5-TC18-1: A case is read only by the collector who holds it

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer A holds `<case_1>`, a sent request.
* customer B holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<unissued id>` is a case id the vault never issued.

**Steps:**

1. As customer B, ask for a read of `<case_1>` by its id.
2. As customer B, ask for a read of `<unissued id>`.

**Expected Results:**

* Step 1 is refused, and the response carries none of `<case_1>`'s facts.
* Step 1's refusal matches step 2's; nothing tells the two apart.

---

### grade10-site-vault-case-lifecycle-US5-TC9-2: Asking for the item back is refused once the case has already moved on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector read `<case_4>` at `<read instant>`: the item is in the vault, storage lane, no loan.
* Since `<read instant>`, staff moved `<case_4>` on.

**Steps:**

1. Ask for the item back on `<case_4>`, naming `<read instant>`.
2. Ask for the collector's own read of `<case_4>`.

**Expected Results:**

* Step 1 is refused by name, as a case that moved.
* Step 2 reads `<case_4>` where staff moved it, with no ask for the item back.

---

### grade10-site-vault-case-lifecycle-US5-TC11-1: Asking for the item back is recorded once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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

### grade10-site-vault-case-lifecycle-US5-TC13-1: Reading a derived fact writes nothing on the case

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* <case_18>: the offer's own expiry has passed, unanswered, and no
  sweep has closed it.

**Steps:**

1. Ask for the collector's own read of <case_18>.
2. Ask for it again.
3. Read the case's history in the second answer.

**Expected Results:**

* Both reads say the offer ran out and leave the case open for another
  offer.
* Both reads carry the same status, `offer_made`.
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
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* <case_20>: the offer ran out on Monday and the booked visit was
  closed as missed on Wednesday.

**Steps:**

1. Ask for the collector's own read of <case_20>.
2. Book a free slot for <case_20>.

**Expected Results:**

* Step 1 reads the missed visit, the later of the two, as the fact.
* Step 1's history carries the offer that ran out, not as the fact.
* Step 2 is accepted.

---

### grade10-site-vault-case-lifecycle-US5-TC19-1: A call-off read before the counter moved the case is refused as moved

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector read `<case_1>` at `<read instant>`, holding a live offer.
* Since `<read instant>`, staff accepted the offer at the counter.

**Steps:**

1. Call off `<case_1>`, naming `<read instant>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name, as a case that moved.
* Step 2 reads `<case_1>` accepted, as staff left it, not cancelled.

## Settled

- **A second ask for the item back** - answered with the case as the first ask left it, recording nothing (Q21)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts` (`cancel`, `requestRelease`, `detail`, `mine`), the contracts' standing fold and the ended reasons. It is a statement, not proof.

- **Raised, folded into spec** - none
- **Raised, escalated** - a second ask for the item back, landed as Q21, answered as the first
- **Raised, rejected** - none
- **Revised** - `grade10-site-vault-case-lifecycle-US2-TC2-1`, `grade10-site-vault-case-lifecycle-US2-TC3-1`, `grade10-site-vault-case-lifecycle-US2-TC4-1`, `grade10-site-vault-case-lifecycle-US2-TC5-1`, `grade10-site-vault-case-lifecycle-US5-TC13-1`, `grade10-site-vault-case-lifecycle-US5-TC14-1` read the collector's own case through the API, keeping `<v>`; `grade10-site-vault-case-lifecycle-US5-TC13-1` traces `grade10-site-vault-case-lifecycle-US-05`, since the delta's Feature set carries no `Derived at the read` group; `grade10-site-vault-case-lifecycle-US5-TC9-2` drops the withheld button and is refused by name as moved
- **Deprecated as duplicates** - `grade10-site-vault-case-lifecycle-US5-TC11-1`; `grade10-site-vault-case-lifecycle-US5-TC15-1` holds its purpose
- **Joined** - `grade10-site-vault-case-lifecycle-SC-16`, `-SC-17` into `grade10-site-vault-case-lifecycle-US1-TC5-1`; `grade10-site-vault-case-lifecycle-SC-39` into `grade10-site-vault-case-lifecycle-US1-TC7-1` and `grade10-site-vault-case-lifecycle-US5-TC18-1`; `grade10-site-vault-case-lifecycle-SC-20` to `-SC-26` into `grade10-site-vault-case-lifecycle-US4-TC6-1`; `grade10-site-vault-case-lifecycle-SC-18`, `-SC-27` into `grade10-site-vault-case-lifecycle-US5-TC15-1`; `grade10-site-vault-case-lifecycle-SC-40` into `grade10-site-vault-case-lifecycle-US5-TC17-1`
- **Corrected** - `grade10-site-vault-case-lifecycle-US1-TC5-1` names the read instant and drops the letter; `grade10-site-vault-case-lifecycle-US4-TC6-1` adds a cancel with an offer and a visit, both clocks, a forfeit with its agreements, and the day each closed; `grade10-site-vault-case-lifecycle-US5-TC15-1` replays the ask, recording nothing, and books the pickup; `grade10-site-vault-case-lifecycle-US5-TC17-1` carries each row's status
- **Added by QA2** - `grade10-site-vault-case-lifecycle-US1-TC8-1` for `grade10-site-vault-case-lifecycle-SC-37`; `grade10-site-vault-case-lifecycle-US2-TC6-1` for `grade10-site-vault-case-lifecycle-SC-28`; `grade10-site-vault-case-lifecycle-US5-TC19-1` for `grade10-site-vault-case-lifecycle-SC-19`
- **Out of suite** - `grade10-site-vault-case-lifecycle-SC-30` to `-SC-36` and `-SC-38`, the contracts' standing fold (task 2.3), named in the header
- **Contradicted** - none
- **Uncovered anchors** - none
- **Still walking a removed screen** - automated `grade10-site-vault-case-lifecycle-US1-TC1-1`, `-US1-TC3-1`; actual `-US1-TC4-1`, `-US6-TC1-1`, `-US6-TC2-1`, `-US6-TC4-1`, `-US6-TC5-1`
