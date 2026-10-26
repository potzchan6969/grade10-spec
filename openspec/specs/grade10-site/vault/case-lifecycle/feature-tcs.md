# grade10-site/vault/case-lifecycle Test Cases

**Status:** pending-review · 0/30
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* customer(collector) reads their own vault case on `<g10url>`; the console case page, its Case, Documents and Custody tabs, and the item register's item page are read by admin(holds `vault:operate`) unless a case names more. A tester moves the clock and runs the vault's sweeps to reach a moment.
* A walk-in draft is one staff opened at the counter under a collector's account. The register can be made not to answer the vault.
* `<collector A>` is Ana Wong and `<collector B>` Ben Lee, each with an account.

## Walk 1: A case from request to the item going home

Starting state:

- customer(collector) Ana Wong has sent in a storage request for a trading card; admin(holds `vault:operate`) is on its console page.

Shared test data:

| Field | Value |
| --- | --- |
| item | a trading card titled Charizard card |

### Route

1. Start its valuation.
   - The register holds the item, owned by Ana Wong. `g10.vault-case-lifecycle.US3-TC1`
2. As the collector, read the case.
   - Six stages, Valued in progress, and that it waits on the shop. `g10.vault-case-lifecycle.US5-TC2`
3. Agree terms, sign, and confirm it vaulted.
   - The item is marked by the vault for the case. `g10.vault-case-lifecycle.US3-TC2`
4. Release it at a pickup visit; as the collector, read the case.
   - The mark is closed; the case reads collected on the day, and names the visit. `g10.vault-case-lifecycle.US3-TC3`

## g10.vault-case-lifecycle.US1: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-3ve rev=1 -->
### g10.vault-case-lifecycle.US1-TC1: Calling a request off names what it closes, ends the case, and reads back

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
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* customer(collector) owns `<case>`.

**Test data:**

| `<case>` | `<confirmation names>` | `<afterwards>` |
| --- | --- | --- |
| holding a live offer and a booked visit | the offer and the visit it closes | cancelled; the offer closed, the visit cancelled, a letter sent |
| sent in, no offer and no visit | the request alone | cancelled, a letter sent |
| a walk-in draft staff opened for them | the request alone | cancelled, still listed as a cancelled request; nobody told |

**Steps:**

1. Select Cancel this request, read the confirmation, and confirm.
2. Read the case, the vault page and the inbox.

**Expected Results:**

* Step 1 names `<confirmation names>`.
* Step 2 reads `<afterwards>`.

<!-- trace:case id=g10.vault-case-lifecycle.TC-3ak rev=1 -->
### g10.vault-case-lifecycle.US1-TC2: A case whose item is in the vault is not the collector's to cancel

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* customer(collector)'s case holds its item in the vault.

**Steps:**

1. Look for Cancel this request; open the cancel address directly.

**Expected Results:**

* It is not offered, and the cancel is refused, naming the item in the vault; the case is unchanged.

---

## g10.vault-case-lifecycle.US2: Collector who stops answering is not left with an open case

**As a** collector,
**I want** a request I never came back to to end by itself, with a message
saying so,
**so that** I am not waiting on a case nobody is working and my item is not
expected at a counter.

<!-- trace:case id=g10.vault-case-lifecycle.TC-enu rev=1 -->
### g10.vault-case-lifecycle.US2-TC1: Terms agreed 31 days ago with no visit ahead end the case, and the collector is told

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* The collector's case agreed terms 31 days ago and holds no visit.

**Steps:**

1. Run the sweeps; read the case and the inbox.

**Expected Results:**

* The case reads cancelled; a letter says it was called off for want of a visit.

<!-- trace:case id=g10.vault-case-lifecycle.TC-ueu rev=1 -->
### g10.vault-case-lifecycle.US2-TC2: A case with a visit ahead, or a settled loan still holding its item, is left as it is

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* The collector's case is `<case>`.

**Test data:**

| `<case>` |
| --- |
| terms agreed 31 days ago, a visit booked for next week |
| its loan repaid six months ago, the item still held |

**Steps:**

1. Run the sweeps; read the case, its balance and the inbox.

**Expected Results:**

* The case is where it was, nothing is owed for keeping the item, and no letter arrives.

<!-- trace:case id=g10.vault-case-lifecycle.TC-b2f rev=1 -->
### g10.vault-case-lifecycle.US2-TC3: A case with terms and no visit says it waits on the collector, and the day it would be called off

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-02

**Pre-conditions:**

* customer(collector)'s case agreed terms 3 days ago, with no visit ahead.

**Steps:**

1. Read the case.

**Expected Results:**

* It reads that it waits on them, to book a visit, naming the day the 30-day clock would call it off.

---

## g10.vault-case-lifecycle.US3: Operator moves a case through the counter without stepping over a guard

**As a** member of shop staff,
**I want** each move to run only where it belongs and to be refused when the
case has moved under me,
**so that** two of us working the same counter cannot leave one case in a
state neither of us meant.

<!-- trace:case id=g10.vault-case-lifecycle.TC-vip rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC1: Starting the valuation registers the item under its collector

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

* `<case>` is submitted by `<collector A>`, a request for a trading card titled Charizard card, no item linked.

**Steps:**

1. Select Start valuation on the Case tab, and read the item's facts.
2. Select the item's link.

**Expected Results:**

* Step 1 reads under valuation, the item a trading card titled Charizard card, linked.
* Step 2 opens an item owned by `<collector A>`, not marked.

<!-- trace:case id=g10.vault-case-lifecycle.TC-10a rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC2: Confirming an item vaulted marks it for the vault's case

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

* `<case>`'s packet is signed; its item is owned by `<collector A>`, not marked.

**Steps:**

1. Confirm the case vaulted at a shop.
2. Open the item's page, then the register's marked items.

**Expected Results:**

* The case reads vaulted; the item's place names the vault, the case's reference and status, offering no Transfer or Retire; the marked items list it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-tcj rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC3: Release or unwind closes the mark and keeps the owner, and the case keeps its visit

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

* `<case>` is `<state>`; its item is owned by `<collector A>`, marked by the vault on it.

**Test data:**

| `<state>` | `<act>` | `<case reads>` |
| --- | --- | --- |
| vaulted on the storage lane, its release packet signed, at its pickup visit | release | released, naming the pickup visit |
| vaulted on the financed lane, no advance recorded | unwind, with a reason | cancelled |

**Steps:**

1. `<act>`; read the case and the item's page.

**Expected Results:**

* The case reads `<case reads>`; the item reads not marked, still owned by `<collector A>` with no new move, offering Transfer and Retire.

<!-- trace:case id=g10.vault-case-lifecycle.TC-exj rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC4: A forfeit closes the mark and moves the item to the lender

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

* `<case>` is active, past its due date and the cure date of a sent forfeiture notice; its item is owned by `<collector A>`, marked by the vault on it.

**Steps:**

1. Forfeit the case with a reason.
2. Read the item's page and `<collector A>`'s collector page.

**Expected Results:**

* The case reads forfeited; the item reads not marked, owned by the lender's registered name, its newest move from `<collector A>` to the lender by the vault on the case; the collector page no longer lists it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-pbt rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC5: A case that ends before custody leaves its item registered to its collector, unmarked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* `<case>` is under valuation by `<collector A>`; its item is registered and not marked.

**Test data:**

| `<act>` |
| --- |
| decline, with a reason |
| cancel |

**Steps:**

1. `<act>`; read the item's page.

**Expected Results:**

* The case reads declined or cancelled; the item is still owned by `<collector A>`, not marked.

<!-- trace:case id=g10.vault-case-lifecycle.TC-5s5 rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC6: Prepare documents waits while the register names another owner, and returns once the item is moved back

Runs once per row of **Test data**.

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

* `<operator>` is on the Documents tab of `<collector A>`'s accepted case, its check recorded; its item is owned by `<collector B>`.

**Test data:**

| `<operator>` | `<line names>` |
| --- | --- |
| admin(holds `vault:operate`, `inventory:transfer` and `kyc:read`) | `<collector B>`'s name |
| admin(holds `vault:operate`, `inventory:read` and `inventory:transfer`, not `kyc:read`) | `<collector B>`'s short id |

**Steps:**

1. Read the tab, and select the item link on its line.
2. Transfer the item to `<collector A>`'s exact email with a reason; reload the tab.

**Expected Results:**

* Step 1 offers no Prepare documents; a line names `<line names>` and links the item, which opens.
* Step 2 offers Prepare documents.

<!-- trace:case id=g10.vault-case-lifecycle.TC-9rk rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC7: Preparing papers is refused by name when the register moved, cannot answer, or holds the item retired or not yet

Runs once per row of **Test data**.

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

* admin(holds `vault:operate` and `inventory:transfer`) is on `<case>`'s Documents tab; then `<meanwhile>`.

**Test data:**

| `<case>` | `<meanwhile>` | `<act>` | `<refusal names>` |
| --- | --- | --- | --- |
| accepted, check recorded, item owned by `<collector A>` | in another tab the item is transferred to `<collector B>` | Prepare documents | `<collector B>`, linking the item |
| accepted, check recorded | the register stops answering | Prepare documents | that the register cannot be read now |
| accepted, its item's registration not yet reached the register | nothing | Prepare documents | that the item is still being registered |
| accepted, check recorded | in another tab the item is retired as a duplicate | Prepare documents | the item as retired, linking it |
| vaulted, owing nothing | the register reads the item retired | Prepare release receipt | the item as retired, linking it |
| vaulted, owing nothing | the register stops answering | Prepare release receipt | that the register cannot be read now |

**Steps:**

1. Select `<act>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; nothing is rendered and the case stays where it was.

<!-- trace:case id=g10.vault-case-lifecycle.TC-dy2 rev=1 -->
### g10.vault-case-lifecycle.US3-TC12: Preparing papers registers an item nothing has registered, and works again once a retired item is restored

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) is on `<case>`'s Documents tab.

**Test data:**

| `<case>` | `<before>` |
| --- | --- |
| accepted, valued before the vault's deploy, no item registered | nothing |
| accepted, its item retired and its prepare refused | the item restored with a reason |

**Steps:**

1. Do `<before>`, then select Prepare documents; read the packet and the item.

**Expected Results:**

* The packet is prepared, its custody agreement naming the item; the item is registered under the case's collector.

<!-- trace:case id=g10.vault-case-lifecycle.TC-owi rev=1 covers=g10.vault-case-lifecycle.SC-tro,g10.vault-case-lifecycle.SC-vvb,g10.vault-case-lifecycle.SC-an5,g10.vault-case-lifecycle.SC-am3,g10.vault-case-lifecycle.SC-hpb,g10.vault-case-lifecycle.SC-01y,g10.vault-case-lifecycle.SC-1ku,g10.vault-case-lifecycle.SC-lln,g10.vault-case-lifecycle.SC-17k,g10.vault-case-lifecycle.SC-tqz,g10.vault-case-lifecycle.SC-zb0,g10.vault-case-lifecycle.SC-6yn,g10.vault-case-lifecycle.SC-01t,g10.vault-case-lifecycle.SC-hhb,g10.vault-case-lifecycle.SC-q4b -->
### g10.vault-case-lifecycle.US3-TC8: Confirming an item vaulted never waits on the register

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Moving a case

**Pre-conditions:**

* `<case>`'s packet is signed; its item registered, not marked; the register does not answer.

**Steps:**

1. Confirm the case vaulted at a shop.
2. Let the register answer again, and the vault's next delivery run; read the item's page.

**Expected Results:**

* Step 1 is taken at once; the case reads vaulted.
* Step 2: the item reads marked by the vault on the case, with one place.

<!-- trace:case id=g10.vault-case-lifecycle.TC-nyn rev=1 -->
### g10.vault-case-lifecycle.US3-TC13: A move is refused on an ended case, under a case that moved, or an unwind past the advance

Runs once per row of **Test data**.

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

* admin(holds `vault:operate`) is on `<case>`.

**Test data:**

| `<case>` | `<attempt>` | `<refusal names>` |
| --- | --- | --- |
| released | any move it shows, from a tab opened before release | the case as ended |
| under valuation, open in two operators' tabs | the same move from both | that the case moved, for the second |
| with an advance recorded | unwind from the vault | the advance |

**Steps:**

1. `<attempt>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; the case is as the first move or nothing left it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-idj rev=1 -->
### g10.vault-case-lifecycle.US3-TC14: Every move and record lands on the case's history with its actor, and a refused one leaves none

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case under valuation.

**Steps:**

1. Record a valuation; try a move the case refuses; agree terms.
2. Read the case's history.

**Expected Results:**

* It shows the valuation and the terms, each naming the operator, and no entry for the refused move.

<!-- trace:case id=g10.vault-case-lifecycle.TC-buj rev=1 -->
### g10.vault-case-lifecycle.US3-TC15: A storage case owes nothing, and a repayment against it is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The statuses

**Pre-conditions:**

* treasurer is on a storage case whose item is in the vault, its terms agreed with no offer.

**Steps:**

1. Look for Record a repayment; record one through its address.

**Expected Results:**

* None is offered, and the repayment is refused as a case that owes nothing.

<!-- trace:case id=g10.vault-case-lifecycle.TC-z39 rev=1 -->
### g10.vault-case-lifecycle.US3-TC16: A correction taken back returns the case to where the record found it

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
* **Trace:** The exits

**Pre-conditions:**

* treasurer is on `<case>`.

**Test data:**

| `<case>` | `<taken back>` | `<afterwards>` |
| --- | --- | --- |
| active, advanced in full | the advance | vaulted, and may be advanced against again; the item still marked once |
| repaid by its last repayment | that repayment | active, owing what it would have owed had the record never been written |

**Steps:**

1. Take `<taken back>` back with a reason; read the case and the item.

**Expected Results:**

* It reads `<afterwards>`.

---

## g10.vault-case-lifecycle.US4: Collector reads how their case ended

**As a** collector whose case ended without a release,
**I want** the page to say why in my own words — the reason staff gave, that
the request was called off and by whom, the clock that ran out, or the figure
the item settled with the dates of the notice,
**so that** I know what happened and what, if anything, is still mine.

<!-- trace:case id=g10.vault-case-lifecycle.TC-dhk rev=1 -->
### g10.vault-case-lifecycle.US4-TC2: An ended case says why in the collector's words, and stops at the stage it ended on

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
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer(collector)'s case `<ended>`.

**Test data:**

| `<ended>` | `<reads>` |
| --- | --- |
| was declined by staff with the reason Not a genuine card | declined, the day, and Not a genuine card verbatim |
| was cancelled by staff while holding a live offer and a visit, terms agreed | called off by staff, the day, the offer that closed; Agreed the stage it stopped at |
| expired, never booking a visit | closed as expired, the day, the timeline naming the visit clock |
| expired, its booked visit missed | closed as expired in the same words, the timeline naming the missed visit |
| was forfeited after a notice | the figure the item settled, the day the notice was written and the date it gave to pay by |
| was released | collected, on the day |

**Steps:**

1. Read the case and the vault page.

**Expected Results:**

* Both read `<reads>`.

<!-- trace:case id=g10.vault-case-lifecycle.TC-7ic rev=1 -->
### g10.vault-case-lifecycle.US4-TC1: A case's timeline stamps read UTC, whatever the viewer's zone

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-04

**Pre-conditions:**

* customer owns a case kept at a Hong Kong shop with a timeline entry at 2026-10-07T01:30:00Z, and reads it on a machine set to America/New_York.

**Steps:**

1. Read that entry's stamp.

**Expected Results:**

* It reads 01:30 on 7 Oct, UTC, never 09:30 or 21:30 on 6 Oct.

---

## g10.vault-case-lifecycle.US5: Collector reads the fact their case meets

**As a** collector whose offer ran out, was declined or was replaced, whose
visit was closed as missed, or who asked for the item back,
**I want** the page to say so in my own words, that the case is still where it
was, and what to do next,
**so that** I do not take a closed offer or a closed visit for a closed case.

<!-- trace:case id=g10.vault-case-lifecycle.TC-9ud rev=1 -->
### g10.vault-case-lifecycle.US5-TC1: A case says the fact it meets, the case still where it was, and the later fact when two meet

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
* **Trace:** Derived at the read

**Pre-conditions:**

* customer(collector)'s case is `<case>`.

**Test data:**

| `<case>` | `<reads>` |
| --- | --- |
| its offer expired yesterday, no sweep run since | that the offer ran out, its amount and the day; still offer made |
| its offer declined by them | that they declined it, the figure and the day; being valued, the visit standing |
| in the vault, its booked visit closed as missed | that the visit was missed, its slot; another may be booked |
| held, the collector having asked for the item back | the ask and its day; a pickup may be booked |
| its offer ran out on Monday, its visit missed on Wednesday | the missed visit, the later one |

**Steps:**

1. Read the case; as admin(holds `vault:operate`), read its console status.

**Expected Results:**

* The case reads `<reads>`; the console status is as it was before the read.

<!-- trace:case id=g10.vault-case-lifecycle.TC-lf1 rev=1 -->
### g10.vault-case-lifecycle.US5-TC2: The case walks its lane's stages, says whose turn it is, and reads the same held state on the list

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector)'s case is `<case>`.

**Test data:**

| `<case>` | `<reads>` |
| --- | --- |
| financed, its item in the vault | eight stages, Request to Home, Vault in progress, earlier ones done |
| storage, being valued | six stages, no Offer or Loan, Valued in progress |
| holding a live offer | waiting on them |
| storage, its item held since 2 Oct | with us since 2 Oct, on the vault page and the case alike |
| financed, its item in the vault, no advance yet | with us since the day it was held |

**Steps:**

1. Read the case and the vault page.

**Expected Results:**

* They read `<reads>`.

<!-- trace:case id=g10.vault-case-lifecycle.TC-xpy rev=1 -->
### g10.vault-case-lifecycle.US5-TC3: Asking for the item back twice records one ask

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector)'s case holds the item with nothing outstanding, open in two tabs.

**Steps:**

1. Ask for the item back in each tab; read the case and its history.

**Expected Results:**

* One ask is recorded; the second tab's answer reads the case as the first left it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-7wj rev=1 -->
### g10.vault-case-lifecycle.US5-TC4: A call-off sent after the counter moved the case is refused, and the confirmation stays open

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) has their case open; the counter then moves it.

**Steps:**

1. Select Cancel this request, and confirm.

**Expected Results:**

* It is refused as a case that moved; the confirmation stays open, and a reload shows the case as it now stands.

<!-- trace:case id=g10.vault-case-lifecycle.TC-w7j rev=1 -->
### g10.vault-case-lifecycle.US5-TC5: Another collector's case reads the same not-found page as an id nobody was issued

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-05

**Pre-conditions:**

* customer(collector) is signed in.

**Test data:**

| `<address>` |
| --- |
| another collector's case |
| a case id never issued |
| another collector's case's offer answer |

**Steps:**

1. Open `<address>`.

**Expected Results:**

* It reads not found, the same for every row, with nothing telling them apart.

---

## g10.vault-case-lifecycle.US6: Operator opens a walk-in again under the right address

**As a** member of shop staff who typed a customer's address wrong,
**I want** to cancel the unsent draft and open it again under the right
address,
**so that** the customer can send it, and the account at the wrong address
is never emailed and keeps nothing of it.

<!-- trace:case id=g10.vault-case-lifecycle.TC-ulp rev=1 -->
### g10.vault-case-lifecycle.US6-TC1: A walk-in typed under the wrong address is cancelled leaving nothing, and opened again under the right one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* Staff opened a walk-in draft with two photographs under a mistyped address.

**Steps:**

1. Cancel it.
2. Read the account at the mistyped address, and its inbox.
3. Open a walk-in for the right address.

**Expected Results:**

* Step 1: the case reads cancelled.
* Step 2: the account lists nothing of it, and nothing was sent.
* Step 3 opens a new draft under the right account, with a reference of its own.

<!-- trace:case id=g10.vault-case-lifecycle.TC-2sn rev=1 -->
### g10.vault-case-lifecycle.US6-TC2: A walk-in the collector sent is cancelled like any case

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* The collector sent a walk-in draft; admin(holds `vault:operate`) is on it.

**Steps:**

1. Cancel it; as the collector, read the vault page and the inbox.

**Expected Results:**

* It reads cancelled and stays listed with its photographs; the cancelled letter arrives.

<!-- trace:case id=g10.vault-case-lifecycle.TC-j8i rev=1 -->
### g10.vault-case-lifecycle.US6-TC3: A cancel from a page read before the collector sent the draft is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* admin(holds `vault:operate`) read a walk-in draft while it was unsent; the collector then sent it.

**Steps:**

1. From that page, without reloading, cancel it.

**Expected Results:**

* It is refused as a case that moved; the case stays submitted.

<!-- trace:case id=g10.vault-case-lifecycle.TC-zaj rev=1 -->
### g10.vault-case-lifecycle.US6-TC4: Staff's cancel removes an unsent walk-in even after someone signed in to the account

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* Someone signed in to the account a walk-in draft was opened under, without sending it.

**Steps:**

1. As admin(holds `vault:operate`), cancel it; read the account's vault page and inbox.

**Expected Results:**

* The draft is gone from the account; nobody is told.

<!-- trace:case id=g10.vault-case-lifecycle.TC-skm rev=1 covers=g10.vault-case-lifecycle.SC-68t,g10.vault-case-lifecycle.SC-8rr,g10.vault-case-lifecycle.SC-plk,g10.vault-case-lifecycle.SC-6aa,g10.vault-case-lifecycle.SC-hir -->
### g10.vault-case-lifecycle.US6-TC5: An unsent walk-in runs out seven days after its last touch, silently, and a collector's edit restarts the clock

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Clocks

**Pre-conditions:**

* A walk-in draft was opened for an address the tester reads; `<touched>`.

**Test data:**

| `<touched>` | `<after the sweep>` |
| --- | --- |
| untouched for 7 days less an hour | still a draft, in the console's Drafts view |
| untouched for 7 days | expired, no longer under the account, no letter |
| untouched since the collector changed its title on day 5, now day 8 | still a draft |
| untouched since the collector changed its title on day 5, now day 13 | expired, gone from their list without a word |

**Steps:**

1. Run the draft sweep; read the console's queue and the account's vault page.

**Expected Results:**

* It reads `<after the sweep>`; an expired draft stays in the queue's Closed view under its reference, its item erased and no collector named.

## Settled

- Cancel this request names only what stands open — the live offer, the booked visit, or both; a request holding neither names the request alone.
- A second ask for the item back is answered with the case as the first left it, and records nothing (Q21).
- The guarded-move refusal fires on any status change under the caller.
- An expired case reads one wording whichever clock ran out; the clock is named on its timeline.
- An unissued id and another collector's case read the same not-found page.
- The book-within-30-days line shows from terms agreed onward, in every state with no live booking.
- A walk-in draft runs out 7 days from its last touch; it stays a walk-in until sent, and is removed silently when it runs out or staff cancel it.
