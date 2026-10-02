# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review

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
