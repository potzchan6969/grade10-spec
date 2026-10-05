# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-case-lifecycle-US1: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

### grade10-site-vault-case-lifecycle-US1-TC1-2: Calling off a request names and closes only what stands open

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's request before the item is in the vault, standing as the row says.

**Test data:**

| `<case_1>` stands | The call-off names |
| --- | --- |
| Submitted, no offer made and no visit booked | Nothing closed and nothing cancelled |
| A live offer waiting for an answer, no visit booked | The offer it closes |
| Terms agreed, a visit booked, the item not yet handed over | The visit it cancels |

**Steps:**

1. Call off `<case_1>` as an act on the collector's own case, naming the instant it was last read at.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted, and its answer names what the row names.
* Step 2 reads `<case_1>` cancelled, ended, called off by the collector.
* Step 2 reads no offer or visit left open.

### grade10-site-vault-case-lifecycle-US1-TC2-2: Calling off is refused once the item is in the vault

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

### grade10-site-vault-case-lifecycle-US1-TC3-2: A call-off read before staff moved the case is refused as moved

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector read `<case_3>` at `<read instant>`: terms agreed, a visit booked, the item not yet handed over.
* Since `<read instant>`, staff confirmed the item vaulted.

**Steps:**

1. Call off `<case_3>`, naming `<read instant>`.
2. Ask for the collector's own read of `<case_3>`.

**Expected Results:**

* Step 1 is refused by name, as a case that moved.
* Step 2 reads `<case_3>` in the vault, as staff left it, not cancelled.

### grade10-site-vault-case-lifecycle-US1-TC4-2: The collector calls off a draft staff opened for them

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
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, a mailbox the tester reads, with two of staff's photographs.
* customer(collector) holding `<walk-in email>` holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Test data:**

| Field | Value |
| --- | --- |
| `<mail delivery window>` | 5 minutes (assumed; any wait past the first send attempt) |

**Steps:**

1. Call off `<case_1>` as an act on the collector's own case.
2. Ask for the collector's own cases.
3. Wait `<mail delivery window>` and read `<walk-in email>`'s inbox.

**Expected Results:**

* Step 1 ends `<case_1>` as cancelled.
* Step 2 lists `<case_1>` as a cancelled request.
* Step 3 holds no message about `<case_1>`.

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

## grade10-site-vault-case-lifecycle-US2: Collector who stops answering is not left with an open case

**As a** collector,
**I want** a request I never came back to to end by itself, with a message
saying so,
**so that** I am not waiting on a case nobody is working and my item is not
expected at a counter.

### grade10-site-vault-case-lifecycle-US2-TC1-2: A case with terms agreed and no visit ahead reads the day its clock calls it off

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

### grade10-site-vault-case-lifecycle-US2-TC2-2: A submitted request nobody books a visit for ends on its own

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

### grade10-site-vault-case-lifecycle-US2-TC3-2: A case waiting to sign with no visit booked ends on its own

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

### grade10-site-vault-case-lifecycle-US2-TC4-2: A missed visit ends a request that never reached custody

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

### grade10-site-vault-case-lifecycle-US2-TC5-2: A missed visit on a case already in the vault does not end it

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

## grade10-site-vault-case-lifecycle-US4: Collector reads how their case ended

**As a** collector whose case ended without a release,
**I want** the page to say why in my own words — the reason staff gave, that
the request was called off and by whom, the clock that ran out, or the
figure the item settled with the dates of the notice,
**so that** I know what happened and what, if anything, is still mine.

### grade10-site-vault-case-lifecycle-US4-TC1-2: A declined case's read carries the reason staff gave

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* Staff declined `<case_10>` while it was being valued, giving `<staff reason>`, with a visit booked.

**Steps:**

1. Ask for the collector's own read of `<case_10>`.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 1 reads `<case_10>` declined, with the day it closed and `<staff reason>` word for word.
* Step 1 reads the booked visit cancelled.
* Step 2 reads the stage the case reached as the one in progress, and the item Closed, naming the day.

### grade10-site-vault-case-lifecycle-US4-TC2-2: A cancelled case's read names who called it off

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
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_11>` was called off before the item reached custody, while it held a live offer and a booked visit, by the row's party.

**Test data:**

| Called off by |
| --- |
| The collector, as an act on their own case |
| Staff, from the console |
| The abandonment sweep |

**Steps:**

1. Ask for the collector's own read of `<case_11>`.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 1 reads `<case_11>` cancelled by the row's party, with the day it closed.
* Step 1 reads the offer closed and the visit cancelled.
* Step 2 reads the stage the case reached as the one in progress, and the item Closed, naming the day.

### grade10-site-vault-case-lifecycle-US4-TC3-2: An expired case's read names the clock that ran out

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
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The row's case ended as expired.

**Test data:**

| Case | Which clock |
| --- | --- |
| `<case_6>` submitted, no visit ever booked, 30 days passed | No visit was booked before the clock ran out |
| `<case_8>` submitted, its one booked visit missed, 24 hours passed | The booked visit was missed |

**Steps:**

1. Ask for the collector's own read of the row's case.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 1 reads the case expired, with the day it closed, its history naming the row's clock.
* Step 1 reads nothing signed and no item handed over.
* Step 2 reads the stage the case reached as the one in progress, and the item Closed, naming the day.

### grade10-site-vault-case-lifecycle-US4-TC4-2: A forfeited case's read carries the figure and the notice's dates

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
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_12>` held a loan past its due date; a notice was written, its date to pay by passed, and staff forfeited the item.

**Steps:**

1. Ask for the collector's own read of `<case_12>`.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 1 reads `<case_12>` forfeited, with the day it closed.
* Step 1 carries the figure the item settled, in minor units with its ISO 4217 code, the day the notice was written and its date to pay by.
* Step 1 still lists the signed agreements.
* Step 2 reads the item Closed, naming the day.

### grade10-site-vault-case-lifecycle-US4-TC5-2: A released case reads collected, naming the day

**Classification:**

* **Severity:** minor
* **Priority:** low
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
* The item of `<case_13>` was released to the collector at the counter on `<release day>`.

**Steps:**

1. Ask for the collector's own read of `<case_13>`.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 2 reads Home in progress, and the item Collected on `<release day>`.

---

## grade10-site-vault-case-lifecycle-US5: Collector reads the fact their case meets

**As a** collector whose offer ran out, was declined or was replaced, whose
visit was closed as missed, or who asked for the item back,
**I want** the page to say so in my own words, that the case is still where
it was, and what to do next,
**so that** I do not take a closed offer or a closed visit for a closed
case.

### grade10-site-vault-case-lifecycle-US5-TC1-2: The stages a case walks follow its own lane

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The row's case is the collector's.

**Test data:**

| Case | Lane | Stands at | Stages | In progress |
| --- | --- | --- | --- | --- |
| `<case_14>` | Financed | In the vault, no advance paid out | Request, Valued, Offer, Agreed, Signed, Vault, Loan, Home | Vault |
| `<case_15>` | Storage | Being valued | Request, Valued, Agreed, Signed, Vault, Home | Valued |

**Steps:**

1. Ask for the collector's own read of the row's case.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 2 reads the row's stages, in that order.
* The row's stage reads in progress, every earlier one done and every later one still to come.

### grade10-site-vault-case-lifecycle-US5-TC2-2: A case waiting on the collector reads Waiting on you

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
* The row's case is the collector's.

**Test data:**

| Case | Why |
| --- | --- |
| `<case_2>` | A live offer is waiting for an answer |
| `<case_8>`, under 24 hours since the missed slot | Its booked visit was missed |
| `<case_16>` | The collector asked for the item back, no pickup visit booked yet |

**Steps:**

1. Ask for the collector's own read of the row's case.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 2 reads the item Waiting on you.

### grade10-site-vault-case-lifecycle-US5-TC3-2: A case the shop holds the next move on reads With us

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The row's case is the collector's.

**Test data:**

| Case | Why |
| --- | --- |
| `<case_1>` | Just submitted, not yet valued |
| `<case_17>` | The collector declined an offer; being valued again |
| `<case_18>` | The last offer ran out unanswered |
| `<case_4>` | In the vault on the storage lane |
| `<case_19>` | In the vault on the financed lane, the advance not yet paid out |

**Steps:**

1. Ask for the collector's own read of the row's case.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 2 reads the item With us.
* For `<case_4>` and `<case_19>`, step 2 names the day the item has been held since.

### grade10-site-vault-case-lifecycle-US5-TC4-2: An offer that ran out or was replaced reads closed, the case still open

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
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_18>` is the collector's case, meeting the row's fact, with a visit booked for later.

**Test data:**

| Fact | How `<case_18>` meets it | The read carries |
| --- | --- | --- |
| The offer ran out | Its live offer passed its own expiry yesterday with no answer, and no sweep has closed it | The offer that closed, its amount and the day it ran out |
| The offer was replaced | Staff wrote a counter-offer over its live offer | The offer that closed and its day, beside the live offer |

**Steps:**

1. Ask for the collector's own read of `<case_18>`.

**Expected Results:**

* Step 1 names the row's fact and carries what the row's read carries.
* Step 1 reads `<case_18>` at `offer_made`, not ended.
* Step 1 still reads the booked visit.

### grade10-site-vault-case-lifecycle-US5-TC5-2: A declined offer reads closed, the request still open

**Classification:**

* **Severity:** normal
* **Priority:** medium
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
* The collector declined the only offer made on `<case_17>`, with a visit booked; it is being valued again.

**Steps:**

1. Ask for the collector's own read of `<case_17>`.

**Expected Results:**

* Step 1 reads `<case_17>` at `under_valuation`, not ended.
* Step 1 carries the figure declined and the day.
* Step 1 still reads the booked visit.

### grade10-site-vault-case-lifecycle-US5-TC6-2: A missed visit reads on the case, the case still open

**Classification:**

* **Severity:** normal
* **Priority:** medium
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
* `<case_8>` is a submitted request whose one booked visit was missed, under 24 hours ago.

**Steps:**

1. Ask for the collector's own read of `<case_8>`.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 1 reads `<case_8>` submitted, not ended, carrying the slot that was missed.
* Step 2 reads the item Waiting on you.

### grade10-site-vault-case-lifecycle-US5-TC7-2: An ask for the item back reads on the case with its day

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
* The item of `<case_16>` is in the vault; the collector asked for it back on `<ask day>`, and no pickup visit is booked.

**Steps:**

1. Ask for the collector's own read of `<case_16>`.
2. Work out the stage and whose the item is from the read, with the vault's case standing.

**Expected Results:**

* Step 1 reads `<case_16>` at `vaulted`, carrying the ask and `<ask day>`.
* Step 2 reads the item Waiting on you.

### grade10-site-vault-case-lifecycle-US5-TC8-2: A vaulted case on the storage lane reads nothing owed

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The item of `<case_4>` is in the vault, storage lane, no loan.

**Steps:**

1. Ask for the collector's own read of `<case_4>`.

**Expected Results:**

* Step 1 names the shop holding the item.
* Step 1 reads nothing outstanding.
* Step 1 lists the signed documents with their fingerprints.

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

### grade10-site-vault-case-lifecycle-US5-TC10-2: A case is read only by the collector who holds it

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

### grade10-site-vault-case-lifecycle-US5-TC11-2: The collector asks for the item back as an act on their own case

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

### grade10-site-vault-case-lifecycle-US5-TC12-2: The collector's cases and the case read one answer for a held item

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
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The item of `<case_4>` is in the vault, storage lane, held since `<held day>`.

**Steps:**

1. Ask for the collector's own cases.
2. Ask for the collector's own read of `<case_4>`.
3. Work out whose the item is from each, with the vault's case standing.

**Expected Results:**

* Step 3 reads the item With us from both reads.
* Both name `<held day>` as the day the item has been held since.

### grade10-site-vault-case-lifecycle-US5-TC13-2: Reading a derived fact writes nothing on the case

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

### grade10-site-vault-case-lifecycle-US5-TC14-2: A case meeting two facts reads the later one

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

## grade10-site-vault-case-lifecycle-US6: Operator opens a walk-in again under the right address

**As a** member of shop staff who typed a customer's address wrong,
**I want** to cancel the unsent draft and open it again under the right
address,
**so that** the customer can send it, and the account at the wrong address
is never emailed and keeps nothing of it.

### grade10-site-vault-case-lifecycle-US6-TC1-2: Staff cancel a mistyped walk-in and open it again under the right address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

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
3. As customer(collector) holding `<right email>`, take a session on <grade10 site url> and ask the vault's API for the collector's own cases.

**Expected Results:**

* Step 1 ends `<case_1>` as cancelled.
* Step 2 opens a new draft, `<case_2>`, with a reference of its own, under `<right email>`'s account.
* Step 3 lists `<case_2>` as a draft opened at the counter, and not `<case_1>`.
* Nothing about `<case_1>` or `<case_2>` is emailed to `<wrong email>` or `<right email>`; `<right email>` receives only its sign-in link.

### grade10-site-vault-case-lifecycle-US6-TC2-2: The account at the wrong address keeps nothing of a cancelled walk-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<wrong email>`, with two of staff's photographs; for the second row, someone has since taken a session on that account without sending it.
* The tester noted `<wrong email>`'s collector page address and one of `<case_1>`'s photograph addresses before the cancel.
* admin(staff, holds vault:operate and kyc:read) has cancelled `<case_1>` from the console.

**Test data:**

| Session on `<wrong email>` before the cancel |
| --- |
| nobody |
| someone, who did not send it |

**Steps:**

1. As admin(staff), open the noted collector page address.
2. As customer(collector) holding `<wrong email>`, take a session on <grade10 site url> and ask the vault's API for the collector's own cases.
3. Under that session, open the noted photograph address.
4. Open three new requests, sending none.

**Expected Results:**

* Step 1 lists no vault case for the account, and answers for the account, never that nobody answers to that id.
* Step 2 lists nothing: no draft and no cancelled case.
* Step 3 is refused; the photograph is not served.
* Step 4 opens three drafts; the cancelled walk-in takes none of the account's three.
* `<wrong email>`'s mailbox holds no message about `<case_1>`.
* The queue's Closed view lists `<case_1>` under its reference, its item reading as erased and no collector named.

### grade10-site-vault-case-lifecycle-US6-TC4-2: A walk-in the collector already sent is cancelled like any case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* customer(collector) sent walk-in `<case_1>` through the vault's API; it reads submitted.
* admin(staff, holds vault:operate) is on `<case_1>`'s page.

**Steps:**

1. Cancel `<case_1>` and confirm.
2. As the collector, ask the vault's API for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 2 reads `<case_1>` cancelled, called off by staff, still carrying its photographs.

### grade10-site-vault-case-lifecycle-US6-TC5-2: Staff cancelling a walk-in the collector has just sent is refused by name

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate) has walk-in draft `<case_1>`'s page open, read while it was a draft.
* customer(collector) has since sent `<case_1>` through the vault's API.

**Steps:**

1. Without reloading, click Cancel and confirm.
2. As the collector, ask the vault's API for the collector's own cases.

**Expected Results:**

* Step 1 is refused by name, saying the case moved.
* Step 2 lists `<case_1>` submitted, with its photographs.

## Settled

- **A second ask for the item back** - answered with the case as the first ask left it, and records nothing (Q21)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts`, `cases/releaseRequest.ts`, the contracts' `standing.ts` and `ended.ts`. It is a statement, not proof.

- **Raised, escalated** - a second ask for the item back, landed as Q21, answered as the first ask left it
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker or the contracts' case standing keeps and whose run walked the case list or the case page: `grade10-site-vault-case-lifecycle-US1-TC1-2`, `grade10-site-vault-case-lifecycle-US1-TC2-2`, `grade10-site-vault-case-lifecycle-US1-TC3-2`, `grade10-site-vault-case-lifecycle-US1-TC4-2`, `grade10-site-vault-case-lifecycle-US2-TC1-2`, `grade10-site-vault-case-lifecycle-US2-TC2-2`, `grade10-site-vault-case-lifecycle-US2-TC3-2`, `grade10-site-vault-case-lifecycle-US2-TC4-2`, `grade10-site-vault-case-lifecycle-US2-TC5-2`, `grade10-site-vault-case-lifecycle-US4-TC1-2`, `grade10-site-vault-case-lifecycle-US4-TC2-2`, `grade10-site-vault-case-lifecycle-US4-TC3-2`, `grade10-site-vault-case-lifecycle-US4-TC4-2`, `grade10-site-vault-case-lifecycle-US4-TC5-2`, `grade10-site-vault-case-lifecycle-US5-TC1-2`, `grade10-site-vault-case-lifecycle-US5-TC2-2`, `grade10-site-vault-case-lifecycle-US5-TC3-2`, `grade10-site-vault-case-lifecycle-US5-TC4-2`, `grade10-site-vault-case-lifecycle-US5-TC5-2`, `grade10-site-vault-case-lifecycle-US5-TC6-2`, `grade10-site-vault-case-lifecycle-US5-TC7-2`, `grade10-site-vault-case-lifecycle-US5-TC8-2`, `grade10-site-vault-case-lifecycle-US5-TC9-2`, `grade10-site-vault-case-lifecycle-US5-TC10-2`, `grade10-site-vault-case-lifecycle-US5-TC11-2`, `grade10-site-vault-case-lifecycle-US5-TC12-2`, `grade10-site-vault-case-lifecycle-US5-TC13-2`, `grade10-site-vault-case-lifecycle-US5-TC14-2`, `grade10-site-vault-case-lifecycle-US6-TC1-2`, `grade10-site-vault-case-lifecycle-US6-TC2-2`, `grade10-site-vault-case-lifecycle-US6-TC4-2`, `grade10-site-vault-case-lifecycle-US6-TC5-2`; the stage and whose the item is are worked out from the read with the contracts' case standing (task 2.3)
- **Deprecated** - none: no case's subject is a removed screen alone
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US1-TC5-1` and `US1-TC8-1` into `grade10-site-vault-case-lifecycle-US1-TC1-2`; `US1-TC6-1` into `grade10-site-vault-case-lifecycle-US1-TC2-2`; `US5-TC19-1` into `grade10-site-vault-case-lifecycle-US1-TC3-2`; `US2-TC6-1` into `grade10-site-vault-case-lifecycle-US2-TC1-2`; `US4-TC6-1` into `grade10-site-vault-case-lifecycle-US4-TC1-2` to `grade10-site-vault-case-lifecycle-US4-TC4-2`; `US5-TC15-1` into `grade10-site-vault-case-lifecycle-US5-TC11-2`; `US5-TC17-1` into `grade10-site-vault-case-lifecycle-US5-TC4-2`, `grade10-site-vault-case-lifecycle-US5-TC5-2` and `grade10-site-vault-case-lifecycle-US5-TC6-2`; `US5-TC18-1` into `grade10-site-vault-case-lifecycle-US5-TC10-2`
- **New ids kept** - `grade10-site-vault-case-lifecycle-US1-TC7-1`, another collector's call-off; `grade10-site-vault-case-lifecycle-US5-TC16-1`, an ask for the item back that is not the collector's to make
- **Contradicted** - none
- **Uncovered anchors** - none: every journey this delta serves has a case
- **Automated cases re-versioned** - `grade10-site-vault-case-lifecycle-US1-TC1-2`, `grade10-site-vault-case-lifecycle-US1-TC2-2`, `grade10-site-vault-case-lifecycle-US1-TC3-2`, `grade10-site-vault-case-lifecycle-US2-TC1-2`, `grade10-site-vault-case-lifecycle-US4-TC1-2`, `grade10-site-vault-case-lifecycle-US4-TC2-2`, `grade10-site-vault-case-lifecycle-US4-TC5-2`, `grade10-site-vault-case-lifecycle-US5-TC1-2`, `grade10-site-vault-case-lifecycle-US5-TC2-2`, `grade10-site-vault-case-lifecycle-US5-TC3-2`, `grade10-site-vault-case-lifecycle-US5-TC4-2`, `grade10-site-vault-case-lifecycle-US5-TC5-2`, `grade10-site-vault-case-lifecycle-US5-TC8-2`, `grade10-site-vault-case-lifecycle-US5-TC10-2`, `grade10-site-vault-case-lifecycle-US5-TC12-2`, `grade10-site-vault-case-lifecycle-US6-TC1-2`, `grade10-site-vault-case-lifecycle-US6-TC2-2`, `grade10-site-vault-case-lifecycle-US6-TC4-2`, `grade10-site-vault-case-lifecycle-US6-TC5-2` were decided by `request.spec.ts`, `offer.spec.ts`, `loan.spec.ts` or `walk-in.spec.ts` at `-1`; each is `manual` until task 4.4 retitles its API walk and flips it
