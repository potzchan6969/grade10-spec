# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** grade10-site-vault-case-lifecycle-SC-53 - the vault's transition tests, which see no due row raised by a corrected advance (task 7.1); grade10-site-vault-case-lifecycle-SC-57 - the prepare-documents tests over a fake register answering absent; the console reaches this only while a word is parked (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-59 - the prepare-documents tests over a fake register, where a case with no item id is registered inline; the console reaches this only on a case valued before the vault's deploy (tasks 9.1, 9.2); grade10-site-vault-case-lifecycle-SC-61 - the prepare-release tests over a fake register answering retired and unreachable; the console reaches a retired item at release only through a retire between Prepare documents and vaulting (tasks 9.1, 9.2)

## grade10-site-vault-case-lifecycle-US1: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

---

## grade10-site-vault-case-lifecycle-US2: Collector who stops answering is not left with an open case

**As a** collector,
**I want** a request I never came back to to end by itself, with a message
saying so,
**so that** I am not waiting on a case nobody is working and my item is not
expected at a counter.

---

## grade10-site-vault-case-lifecycle-US3: Operator moves a case through the counter without stepping over a guard

**As a** member of shop staff,
**I want** each move to run only where it belongs and to be refused when the
case has moved under me,
**so that** two of us working the same counter cannot leave one case in a
state neither of us meant.

<!-- trace:case id=g10.vault-case-lifecycle.TC-vip rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC1-1: Starting the valuation registers the item under the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-10a rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC2-1: Confirm vaulted marks the item for the vault

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-tcj rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC3-1: Release and unwind close the mark and keep the owner

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-exj rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC4-1: Forfeit closes the mark and moves the item to the lender

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-pbt rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC5-1: An item that never reached custody stays registered and unmarked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-5s5 rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC6-1: Prepare documents is not offered while the register names another owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-9rk rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC7-1: An owner moved under an open Documents tab refuses Prepare documents

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-owi rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC8-1: Confirm vaulted lands while the register is down

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-5qj rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC9-1: Prepare documents is refused while the register cannot be read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-ify rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC10-1: Without the identity read the other owner reads by short id

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
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

<!-- trace:case id=g10.vault-case-lifecycle.TC-wkt rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### grade10-site-vault-case-lifecycle-US3-TC11-1: A retired item refuses Prepare documents until it is restored

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

---

## grade10-site-vault-case-lifecycle-US5: Collector reads the fact their case meets

**As a** collector whose offer ran out, was declined or was replaced, whose
visit was closed as missed, or who asked for the item back,
**I want** the page to say so in my own words, that the case is still where
it was, and what to do next,
**so that** I do not take a closed offer or a closed visit for a closed
case.

---

## grade10-site-vault-case-lifecycle-US6: Operator opens a walk-in again under the right address

**As a** member of shop staff who typed a customer's address wrong,
**I want** to cancel the unsent draft and open it again under the right
address,
**so that** the customer can send it, and the account at the wrong address
is never emailed and keeps nothing of it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-skm rev=1 covers=g10.vault-case-lifecycle.SC-68t,g10.vault-case-lifecycle.SC-8rr,g10.vault-case-lifecycle.SC-plk,g10.vault-case-lifecycle.SC-6aa,g10.vault-case-lifecycle.SC-hir -->
### grade10-site-vault-case-lifecycle-US6-TC3-1: A walk-in nobody sends ends on the seven-day draft clock and leaves nothing on the account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
