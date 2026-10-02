# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** grade10-site-vault-case-lifecycle-SC-53 - the vault's transition tests, which see no due row raised by a corrected advance (task 7.1); grade10-site-vault-case-lifecycle-SC-57 - the prepare-documents tests over a fake register answering absent; the console reaches this only while a word is parked (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-59 - the prepare-documents tests over a fake register, where a case with no item id is registered inline; the console reaches this only on a case valued before the vault's deploy (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-61 - the prepare-release tests over a fake register answering retired and unreachable; the console reaches a retired item at release only through a retire between Prepare documents and vaulting (tasks 9.1, 9.2)

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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-01

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

## grade10-site-vault-case-lifecycle-US3: Operator moves a case through the counter without stepping over a guard

**As a** member of shop staff,
**I want** each move to run only where it belongs and to be refused when the
case has moved under me,
**so that** two of us working the same counter cannot leave one case in a
state neither of us meant.

### grade10-site-vault-case-lifecycle-US3-TC1-1: Starting the valuation registers the item under the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_1>`.
* `<case_1>` is submitted by `<collector A>`, a request for a comic titled `<request title>`, naming no slab; no item is linked to it.

**Steps:**

1. Click Start valuation on the Case tab.
2. Read the item's facts on the Case tab.
3. Click the link to the item.

**Expected Results:**

* `<case_1>` reads under valuation.
* The Case tab reads the registered item's category comic and title `<request title>`, linking it.
* Step 3 opens an item owned by `<collector A>`, not marked.

### grade10-site-vault-case-lifecycle-US3-TC2-1: Confirm vaulted marks the item for the vault

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_2>`.
* `<case_2>`'s packet is signed; its item `<item_2>` is owned by `<collector A>` and not marked.

**Steps:**

1. Confirm `<case_2>` vaulted with a shop.
2. Navigate to <grade10 admin item page url> for `<item_2>`.
3. Navigate to the marked tab of <grade10 admin items url>.

**Expected Results:**

* `<case_2>` reads vaulted.
* Step 2's place row names the vault, `<case_2>`'s reference and its status; Transfer and Retire are not offered.
* Step 3 lists `<item_2>`.

### grade10-site-vault-case-lifecycle-US3-TC3-1: Release and unwind close the mark and keep the owner

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_3>`.
* `<case_3>` is as the row of **Test data** says; its item `<item_3>` is owned by `<collector A>` and marked by the vault on `<case_3>`.

**Test data:**

| `<case_3>` | Act |
| --- | --- |
| Vaulted on the storage lane, release packet signed | Release |
| Vaulted on the financed lane, no payout recorded | Unwind with a reason |

**Steps:**

1. Take the act from **Test data**.
2. Navigate to <grade10 admin item page url> for `<item_3>`.

**Expected Results:**

* `<case_3>` reads released or cancelled as the act gives.
* `<item_3>` reads not marked, still owned by `<collector A>`, with no new move.
* Transfer and Retire are offered.

### grade10-site-vault-case-lifecycle-US3-TC4-1: Forfeit closes the mark and moves the item to the lender

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_4>`.
* `<case_4>` is active, past its due date and past the cure date of a sent forfeiture notice; its item `<item_4>` is owned by `<collector A>` and marked by the vault on `<case_4>`.

**Steps:**

1. Forfeit `<case_4>` with a reason.
2. Navigate to <grade10 admin item page url> for `<item_4>`.
3. Navigate to <grade10 admin collector page url> for `<collector A>`.

**Expected Results:**

* `<case_4>` reads forfeited.
* `<item_4>` reads not marked and owned by the lender's registered name.
* Its newest move reads from `<collector A>` to the lender, made by the vault on `<case_4>`.
* Step 3's Items section no longer lists `<item_4>`.

### grade10-site-vault-case-lifecycle-US3-TC5-1: An item that never reached custody stays registered and unmarked

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_5>`.
* `<case_5>` is under valuation by `<collector A>`; its item `<item_5>` is registered and not marked.

**Test data:**

| Act |
| --- |
| Decline with a reason |
| Cancel |

**Steps:**

1. Take the act from **Test data** on `<case_5>`.
2. Navigate to <grade10 admin item page url> for `<item_5>`.

**Expected Results:**

* `<case_5>` reads declined or cancelled as the act gives.
* `<item_5>` is still owned by `<collector A>` and reads not marked.

### grade10-site-vault-case-lifecycle-US3-TC6-1: Prepare documents is not offered while the register names another owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) holds `inventory:transfer` and is signed in to the Grade10 console.
* `<case_6>` of `<collector A>` is accepted, its identity check recorded; its item `<item_6>` is owned by `<collector B>` and not marked.

**Steps:**

1. Navigate to the Documents tab of <grade10 admin vault case page url> for `<case_6>`.
2. Click the item link on the line that names the owner.
3. Transfer `<item_6>` to `<collector A>`'s exact email with a reason.
4. Return to the Documents tab of `<case_6>` and reload it.

**Expected Results:**

* Step 1 does not offer Prepare documents; a line names `<collector B>` and links `<item_6>`.
* Step 2 opens `<item_6>`.
* Step 4 offers Prepare documents.

### grade10-site-vault-case-lifecycle-US3-TC7-1: An owner moved under an open Documents tab refuses Prepare documents

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) holds `inventory:transfer` and is on the Documents tab of <grade10 admin vault case page url> for `<case_7>`.
* `<case_7>` of `<collector A>` is accepted, its identity check recorded and its key terms recorded where its lane needs them; its item `<item_7>` is owned by `<collector A>` and not marked.

**Steps:**

1. In a second tab, transfer `<item_7>` to `<collector B>`'s exact email with a reason.
2. On the first tab, click Prepare documents.

**Expected Results:**

* Step 2 is refused with an error naming `<collector B>` and linking `<item_7>`.
* `<case_7>` stays accepted and no packet is prepared.

### grade10-site-vault-case-lifecycle-US3-TC8-1: Confirm vaulted lands while the register is down

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_8>`.
* `<case_8>`'s packet is signed; its item `<item_8>` is registered and not marked.
* The register is mocked not to answer the vault.

**Steps:**

1. Confirm `<case_8>` vaulted with a shop.
2. Let the register answer again, and wait for the vault's next delivery.
3. Navigate to <grade10 admin item page url> for `<item_8>`.

**Expected Results:**

* Step 1 is not refused; `<case_8>` reads vaulted at once.
* Step 3 reads `<item_8>` marked by the vault on `<case_8>`, with one place row.

### grade10-site-vault-case-lifecycle-US3-TC9-1: Prepare documents is refused while the register cannot be read

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
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_9>`.
* `<case_9>` is accepted, its identity check recorded; its item is registered under its collector.
* The register is mocked not to answer the vault.

**Steps:**

1. Click Prepare documents.

**Expected Results:**

* Step 1 is refused with an error saying the register cannot be read now.
* `<case_9>` stays accepted and no packet is prepared.

### grade10-site-vault-case-lifecycle-US3-TC10-1: Without the identity read the other owner reads by short id

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(holds `vault:operate`, `inventory:read` and `inventory:transfer`, not `kyc:read`) is on the Documents tab of <grade10 admin vault case page url> for `<case_10>`.
* `<case_10>` of `<collector A>` is accepted, its identity check recorded and its key terms recorded where its lane needs them; its item `<item_10>` is owned by `<collector A>` and not marked.

**Steps:**

1. In a second tab, transfer `<item_10>` to `<collector B>`'s exact email with a reason.
2. On the first tab, click Prepare documents.
3. Reload the Documents tab.

**Expected Results:**

* Step 2 is refused with an error naming `<collector B>`'s short id, not their name, and linking `<item_10>`.
* Step 3 does not offer Prepare documents; its line names `<collector B>`'s short id and links `<item_10>`.

### grade10-site-vault-case-lifecycle-US3-TC11-1: A retired item refuses Prepare documents until it is restored

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_11>`.
* `<case_11>` of `<collector A>` is accepted, its identity check recorded and its key terms recorded where its lane needs them; its item `<item_11>` is owned by `<collector A>` and not marked.

**Steps:**

1. In a second tab, retire `<item_11>` as a duplicate.
2. On the first tab, click Prepare documents.
3. Restore `<item_11>` with a reason, then click Prepare documents again.

**Expected Results:**

* Step 2 is refused with an error saying the item is retired, naming and linking `<item_11>`; no packet is prepared.
* Step 3 prepares the packet, and its custody agreement names `<item_11>`.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

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

### grade10-site-vault-case-lifecycle-US6-TC4-2: A walk-in the collector already sent is cancelled like any case

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
* **Trace:** grade10-site-vault-case-lifecycle-US-06

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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* admin(staff, holds vault:operate) has walk-in draft `<case_1>`'s page open, read while it was a draft.
* customer(collector) has since sent `<case_1>` through the vault's API.

**Steps:**

1. Without reloading, click Cancel and confirm.
2. As the collector, ask the vault's API for the collector's own cases.

**Expected Results:**

* Step 1 is refused by name, saying the case moved.
* Step 2 lists `<case_1>` submitted, with its photographs.

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
- **A second ask for the item back** - answered with the case as the first ask left it, and records nothing (Q21)

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

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journey, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Case Lifecycle, Items and Operator Console PRD pages, and the durable case-lifecycle suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md`, `ui-design.md` whole and the items delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-case-lifecycle-US3-TC1-1` into `grade10-site-vault-case-lifecycle-SC-49`; `grade10-site-vault-case-lifecycle-US3-TC2-1` into `grade10-site-vault-case-lifecycle-SC-50`'s vaulting; `grade10-site-vault-case-lifecycle-US3-TC3-1` into `grade10-site-vault-case-lifecycle-SC-50`'s release and unwind; `grade10-site-vault-case-lifecycle-US3-TC4-1` into `grade10-site-vault-case-lifecycle-SC-51`, gaining the vault's move to the lender as Q46; `grade10-site-vault-case-lifecycle-US3-TC6-1` into `grade10-site-vault-case-lifecycle-SC-54`; `grade10-site-vault-case-lifecycle-US3-TC7-1` into `grade10-site-vault-case-lifecycle-SC-55`
- **Folded into the spec** - `grade10-site-vault-case-lifecycle-US3-TC5-1`: a decline or cancel after the valuation started leaves the item registered and not marked, which no scenario stated; the "Nothing else" rule now names it and `grade10-site-vault-case-lifecycle-SC-58` carries it
- **Added by QA2** - `grade10-site-vault-case-lifecycle-US3-TC8-1` for `grade10-site-vault-case-lifecycle-SC-52`; `grade10-site-vault-case-lifecycle-US3-TC9-1` for `grade10-site-vault-case-lifecycle-SC-56`; `grade10-site-vault-case-lifecycle-SC-57`, the third refusal the requirement's table names, was written by QA2 and is out of suite
- **Round 4** - the other owner is named only behind `kyc:read`, else by short id: `grade10-site-vault-case-lifecycle-SC-54` and `grade10-site-vault-case-lifecycle-SC-55` gain that line, walked by `grade10-site-vault-case-lifecycle-US3-TC10-1`; `grade10-site-vault-case-lifecycle-SC-59`, Prepare documents registering an item nothing has registered, is out of suite; the fill it once stood beside is gone (Q52); the register is owed the case's state rather than each word in order, which changes no case
- **Raised, answered by the owner** - Q56, an item retired after its valuation: Prepare documents is refused while the register reads it as retired, `grade10-site-vault-case-lifecycle-SC-60`, walked by `grade10-site-vault-case-lifecycle-US3-TC11-1`
- **Raised, answered by the round** - none other
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-03 has a case for every scenario but `grade10-site-vault-case-lifecycle-SC-53` and `grade10-site-vault-case-lifecycle-SC-57`, which are out of suite with their verifiers

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

### Manual

| Manual | Why |
| --- | --- |
| `US4-TC1-1` | A person reads the staff reason against what staff typed; only the reason's presence automates |
| `US4-TC2-1` | A person reads that the ending names the party who closed it in the collector's words |
| `US4-TC3-1` | A person reads that both clocks give one wording and the timeline names the clock |
| `US4-TC4-1` | A person reads the figure, the notice date and the date to pay by against the notice that was sent |
| `US5-TC4-1`, `US5-TC5-1`, `US5-TC6-1`, `US5-TC7-1` | A person reads that the fact and the one thing to do next are the collector's words, not the status word |
| `US5-TC14-1` | A person reads which of the two facts the page leads with |
| `grade10-site-vault-case-lifecycle-US1-TC4-1` | A person cancels a draft staff opened from the collector's side and reads the mailbox; the worker's test decides it stays listed |
| `grade10-site-vault-case-lifecycle-US6-TC3-1` | Deferred at review: a row the pre-condition contradicts, and the collector's own list is never read |
