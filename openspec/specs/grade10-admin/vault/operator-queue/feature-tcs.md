# grade10-admin/vault/operator-queue Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-admin-vault-operator-queue-US1: Operator opens the shop and sees what is waiting

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each case is waiting for, with today's visits and a badge saying why a case needs me,
**so that** I can work the counter without being emailed anything.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bwg rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### grade10-admin-vault-operator-queue-US1-TC1-1: Queue row names the case's identity and status fields

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
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case sits in the Needs staff cut.

**Steps:**

1. Open the Needs staff view.

**Expected Results:**

* The row names the case's reference, the item's name, the collector's word for the status, the lane, the amount asked, the visit, and when it was last touched.
* The status shown is the collector's word, never the raw status id.

<!-- trace:case id=g10adm.vault-operator-queue.TC-hcu rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### grade10-admin-vault-operator-queue-US1-TC2-1: Each queue cut lists only its own statuses

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case sits at every status named in **Test data**.

**Test data:**

| Cut | Statuses it lists |
| --- | --- |
| Needs staff | submitted, under_valuation, offer_made |
| Agreeing | accepted, signing |
| In custody | vaulted, active, repaid |
| Closed | released, declined, cancelled, expired, forfeited |
| Drafts | draft |

**Steps:**

1. Open the cut named in **Test data**.

**Expected Results:**

* Only cases at the cut's own statuses in **Test data** appear.
* No case at another cut's status appears in this cut.

<!-- trace:case id=g10adm.vault-operator-queue.TC-8ww rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### grade10-admin-vault-operator-queue-US1-TC3-1: Row badge names why a case waits on a person

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
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case exists in the shape named in **Test data**.

**Test data:**

| Case shape | Badge |
| --- | --- |
| A release request unanswered | Release requested |
| A submission nobody started | Awaiting valuation |
| A valuation untouched for 7 days | Valuation stalled |
| An offer that ran out | Offer lapsed |
| A parked message | Message parked |
| A document seen under another account | Document seen before |
| A visit today | Visit today |
| The collector is the one waited on | Collector |

**Steps:**

1. Open the view holding the case named in **Test data**.

**Expected Results:**

* The row's badge reads the value named in **Test data**.

<!-- trace:case id=g10adm.vault-operator-queue.TC-gfo rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### grade10-admin-vault-operator-queue-US1-TC4-1: Valuation-stalled badge appears past 7 days, not at them

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
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case sits under valuation, untouched for the duration named in **Test data**.

**Test data:**

| Case | Untouched for | Valuation stalled badge |
| --- | --- | --- |
| At the limit | 7 days | absent |
| Past the limit | 7 days and 1 hour | present |

**Steps:**

1. Open the view holding the case named in **Test data**.

**Expected Results:**

* The badge matches **Test data**.

<!-- trace:case id=g10adm.vault-operator-queue.TC-h49 rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### grade10-admin-vault-operator-queue-US1-TC5-1: The queue shows it is still loading

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and the view's read has not returned yet.

**Steps:**

1. Open a queue view while its read is still in flight.

**Expected Results:**

* The view shows a pending status and no rows.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ioi rev=1 covers=g10adm.vault-operator-queue.SC-77a,g10adm.vault-operator-queue.SC-90m,g10adm.vault-operator-queue.SC-9ub,g10adm.vault-operator-queue.SC-uo6,g10adm.vault-operator-queue.SC-bd3,g10adm.vault-operator-queue.SC-6lc -->
### grade10-admin-vault-operator-queue-US1-TC6-1: The queue reports a failed read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and the view's read fails.

**Steps:**

1. Open a queue view whose read fails.

**Expected Results:**

* The view shows the failure's message and no rows.

---

## grade10-admin-vault-operator-queue-US2: Operator finds the case of the person at the counter

**As a** member of shop staff,
**I want** to find a case by the customer's number, address or case id,
**so that** somebody standing in front of me is served without my being able to walk the whole customer list.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xod rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC1-1: Exact contact search finds the case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case's collector is reachable at the contact named in **Test data**.

**Test data:**

| Search term | Matches on |
| --- | --- |
| The collector's phone number, typed exactly | phone |
| The collector's email address, typed exactly | email |

**Steps:**

1. Search the term named in **Test data**.

**Expected Results:**

* The collector's case is the only result.

<!-- trace:case id=g10adm.vault-operator-queue.TC-09o rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC2-1: A phone number matches however it is typed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case's collector is reachable at a known phone number.

**Test data:**

| Typed as |
| --- |
| with spaces between the groups |
| with a leading + and the country code |
| with the country code's leading zeros instead of + |
| with the country code and no + before it |
| in full-width digits, as a Chinese keyboard types them |

**Steps:**

1. Search the number typed as named in **Test data**.

**Expected Results:**

* The collector's case is the only result, matched on the canonical E.164 number.

<!-- trace:case id=g10adm.vault-operator-queue.TC-t2e rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC3-1: A case id prefix finds the matching case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.

**Steps:**

1. Search the first characters of a case's id.

**Expected Results:**

* The case whose id starts with the typed characters is a result.

<!-- trace:case id=g10adm.vault-operator-queue.TC-af0 rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC4-1: A contact substring does not match

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case's collector has a known phone number.

**Steps:**

1. Search a substring of the collector's phone number, shorter than the number typed in full.

**Expected Results:**

* The collector's case is not a result.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ax5 rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC5-1: A search with no match shows none

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.

**Steps:**

1. Search a term no case answers to.

**Expected Results:**

* The search shows no matching case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-u6z rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC6-1: A search is recorded on the audit trail without the term

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.

**Steps:**

1. Search a case by its phone number.

**Expected Results:**

* The audit trail records who searched, when, that the term was a phone number, and how many cases matched.
* The audit trail entry does not record the term itself.

<!-- trace:case id=g10adm.vault-operator-queue.TC-c2r rev=1 covers=g10adm.vault-operator-queue.SC-02a,g10adm.vault-operator-queue.SC-bol,g10adm.vault-operator-queue.SC-m6s,g10adm.vault-operator-queue.SC-4px,g10adm.vault-operator-queue.SC-i1e,g10adm.vault-operator-queue.SC-ehn -->
### grade10-admin-vault-operator-queue-US2-TC7-1: Reading the queue leaves no audit entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) is on <grade10 admin vault queue url>, the queue not narrowed to a collector, and no search has been run this session.

**Steps:**

1. Open a queue view and read its rows.
2. Read the case audit trail for the entries written since step 1.

**Expected Results:**

* No audit entry is written for the read.
* Only a search, or a list that names collectors or is narrowed to one, leaves a trail.

---

## grade10-admin-vault-operator-queue-US3: Operator works one case from its own tabs

**As a** member of shop staff,
**I want** each tab to offer exactly the acts this case's status allows,
**so that** I cannot be shown a button that will only be refused.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0mn rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### grade10-admin-vault-operator-queue-US3-TC1-1: Case tabs shown match the operator's grants

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds the grant named in **Test data**) is on a case's page.

**Test data:**

| Grant | Tabs shown |
| --- | --- |
| vault:read only | Case, Documents, Custody |
| vault:payout | Case, Documents, Custody, Payouts |

**Steps:**

1. Open the case's page.

**Expected Results:**

* Only the tabs named in **Test data** are shown.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0uh rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### grade10-admin-vault-operator-queue-US3-TC2-1: Each tab offers only the acts this case's status allows

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(shop staff) is on the page of a financed case at the status named in **Test data**.

**Test data:**

| Status | Offered | Not offered |
| --- | --- | --- |
| submitted | start the valuation, cancel the case | make an offer, decline the case, confirm vaulted |
| offer_made | counter-offer, withdraw the offer, record the acceptance, cancel the case | start the valuation, decline the case, confirm vaulted |
| vaulted | move the item, release the item, unwind | start the valuation, make an offer, record the acceptance, prepare documents, confirm vaulted, send forfeiture notice |

**Steps:**

1. Read the acts each tab offers.

**Expected Results:**

* Every act in the row's Offered column is offered.
* No act in the row's Not offered column is offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-12a rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### grade10-admin-vault-operator-queue-US3-TC3-1: A withheld act names what it is waiting for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case whose status withholds an act.

**Steps:**

1. Read the line beside the withheld act.

**Expected Results:**

* The line names what the act is waiting for, in words.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p8j rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### grade10-admin-vault-operator-queue-US3-TC4-1: The worker refuses an act on its own

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case whose page has not re-read since the case's status changed underneath it.

**Steps:**

1. Send the act the stale page still offers.

**Expected Results:**

* The worker refuses the act.
* The page re-reads and no longer offers it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-9u7 rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### grade10-admin-vault-operator-queue-US3-TC5-1: Production asks for the second factor, staging does not

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(shop staff, unenrolled in a second factor) signs in to the deploy environment named in **Test data**.

**Test data:**

| Deploy environment | Second factor |
| --- | --- |
| production | required |
| staging | optional |

**Steps:**

1. Open a vault surface.

**Expected Results:**

* Whether a second factor is asked for matches **Test data**.

<!-- trace:case id=g10adm.vault-operator-queue.TC-6po rev=1 covers=g10adm.vault-operator-queue.SC-skv,g10adm.vault-operator-queue.SC-jmv,g10adm.vault-operator-queue.SC-4bx,g10adm.vault-operator-queue.SC-ld3,g10adm.vault-operator-queue.SC-tog -->
### grade10-admin-vault-operator-queue-US3-TC6-1: The Case tab's item section follows the case's status

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
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<case_8>` is at the status of the row.

**Test data:**

| `<case_8>` status | Item section reads | Edit offered |
| --- | --- | --- |
| Submitted | registration pending | no |
| Under valuation | the register's facts, linking the item | yes |
| Vaulted | the register's facts, linking the item | yes |

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_8>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section and its Edit read as the row says.

---

## grade10-admin-vault-operator-queue-US4: Operator takes an item in and can say where it is

**As a** member of shop staff,
**I want** to name the shop and locker when I take an item in, and to list
everything we hold,
**so that** anybody can be told which vault an item is sitting in.

<!-- trace:case id=g10adm.vault-operator-queue.TC-3im rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC1-1: Confirm vaulted requires the shop, treats the locker as optional

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Custody tab of a case with an executed packet, ready to vault.

**Test data:**

| Shop | Locker | Outcome |
| --- | --- | --- |
| named | named | Confirm vaulted succeeds |
| named | left blank | Confirm vaulted succeeds |
| left blank | named | Confirm vaulted is refused |

**Steps:**

1. Confirm vaulted with the shop and locker named in **Test data**.

**Expected Results:**

* The result matches the outcome named in **Test data**.
* On success, the item's custody row names the shop, and the locker where one was named.

<!-- trace:case id=g10adm.vault-operator-queue.TC-4pr rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC2-1: Held items list everything in a locker, per shop, oldest first

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the Held items view, and more than one item sits in the vault across more than one shop.

**Steps:**

1. Read the held items list.

**Expected Results:**

* Every item currently in a locker is listed, with the shop it is held at.
* The rows run oldest held first.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ixb rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC3-1: Held-items tiles count the vault's holdings

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the Held items view, and the vault holds items across more than one shop, some with a loan running and some waiting for a pickup.

**Steps:**

1. Read the tiles above the list.

**Expected Results:**

* One tile counts everything in the vault, per shop.
* One tile counts items with a loan running.
* One tile counts items waiting for a pickup.

<!-- trace:case id=g10adm.vault-operator-queue.TC-kir rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC4-1: Filtering held items by shop narrows the list

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
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the Held items view, and items are held across more than one shop.

**Steps:**

1. Filter the list to one shop.

**Expected Results:**

* Only that shop's items remain in the list.

<!-- trace:case id=g10adm.vault-operator-queue.TC-48j rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC5-1: Held items with nothing in a locker shows the empty state

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the Held items view, and no item is currently in a locker.

**Steps:**

1. Read the list.

**Expected Results:**

* The list shows nothing is held.

<!-- trace:case id=g10adm.vault-operator-queue.TC-a8a rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC6-1: A move between lockers is written on the movement log

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Custody tab of an item already in a locker.

**Steps:**

1. Move the item to another locker.
2. Read the movement log.

**Expected Results:**

* Step 1 succeeds.
* The log's newest row names the move, the new locker, when it happened, and who moved it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xgb rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC7-1: The held-items read reports its own loading and failure

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* admin(holds vault:read) is on the Held items view, and the read is in the state named in **Test data**.

**Test data:**

| Read | Shows |
| --- | --- |
| still pending | a pending status, no rows |
| failed | the failure's message, no rows |

**Steps:**

1. Open the view.

**Expected Results:**

* The view shows what **Test data** names.

<!-- trace:case id=g10adm.vault-operator-queue.TC-y6r rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC8-1: A held row names what the item is carrying

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
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* admin(holds vault:read) is on the Held items view, with one item held under a live loan and another whose pickup is booked.

**Steps:**

1. Read each of the two rows.

**Expected Results:**

* Each row names the case reference, the item, the shop, the locker, the day it was taken in, how many days it has been held, the status in the collector's word, what is outstanding on it, and whether a pickup is booked.

<!-- trace:case id=g10adm.vault-operator-queue.TC-9z9 rev=1 covers=g10adm.vault-operator-queue.SC-96r,g10adm.vault-operator-queue.SC-1uj,g10adm.vault-operator-queue.SC-4c4,g10adm.vault-operator-queue.SC-1ij,g10adm.vault-operator-queue.SC-4h9,g10adm.vault-operator-queue.SC-j43,g10adm.vault-operator-queue.SC-0nd -->
### grade10-admin-vault-operator-queue-US4-TC9-1: A case that took a known slab vaults that item, not a second

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
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_9>`.
* `<case_9>` was opened at the walk-in with `<item_1>`, PSA and `AB12345`, owned by its collector; its packet is signed.

**Steps:**

1. Confirm `<case_9>` vaulted with a shop and a locker.
2. Search Items for PSA and `AB12345`.

**Expected Results:**

* `<case_9>` reads vaulted at the shop and locker named.
* Step 2 lists only `<item_1>`, marked by the vault on `<case_9>`.

---

## grade10-admin-vault-operator-queue-US5: Operator finds the case by the reference read out

**As a** member of shop staff,
**I want** the six characters a customer reads out to find their case,
**so that** I need not ask for their phone number or email.

<!-- trace:case id=g10adm.vault-operator-queue.TC-uzl rev=1 covers=g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### grade10-admin-vault-operator-queue-US5-TC1-1: A reference prefix finds the matching case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case carries a known six-character reference.

**Steps:**

1. Search the first characters of the case's reference.

**Expected Results:**

* The case carrying that reference is a result.

<!-- trace:case id=g10adm.vault-operator-queue.TC-jmh rev=1 covers=g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### grade10-admin-vault-operator-queue-US5-TC2-1: The full six-character reference finds exactly the one case

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
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case carries a known six-character reference.

**Steps:**

1. Search the whole six-character reference.

**Expected Results:**

* Exactly the case carrying that reference is the result.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xgg rev=1 covers=g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### grade10-admin-vault-operator-queue-US5-TC3-1: A reference prefix matching nothing shows no case

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.

**Steps:**

1. Search a reference prefix no case carries.

**Expected Results:**

* The search reads "No case answers to that."

<!-- trace:case id=g10adm.vault-operator-queue.TC-omw rev=1 covers=g10adm.vault-operator-queue.SC-ybs,g10adm.vault-operator-queue.SC-76n,g10adm.vault-operator-queue.SC-qhf -->
### grade10-admin-vault-operator-queue-US5-TC4-1: A reference search is recorded on the same audit trail as any other search

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.

**Steps:**

1. Search a case by its reference.

**Expected Results:**

* The audit trail records who searched, when, that the term was a reference, and how many matched.
* The audit trail entry does not record the reference itself.

---

## grade10-admin-vault-operator-queue-US6: Operator reads the shop's day at a glance

**As a** member of shop staff starting a shift,
**I want** a count on every view and today's visits in slot order,
**so that** I know the day's load before I open a case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-alu rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC1-1: The landing view opens on the Today cut

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) navigates to <grade10 admin vault queue url> for the first time this visit, and more than one visit falls on the shop's day today.

**Steps:**

1. Open <grade10 admin vault queue url>.

**Expected Results:**

* The view opens already on the Today cut.
* Today's visits are listed in slot order.
* The cut's own count is shown.

<!-- trace:case id=g10adm.vault-operator-queue.TC-4i4 rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC2-1: Every cut's selector carries its own count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and every cut holds at least one case.

**Steps:**

1. Read the count beside each cut's selector.

**Expected Results:**

* Every cut shows how many cases it holds, before it is opened.

<!-- trace:case id=g10adm.vault-operator-queue.TC-yfj rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC3-1: A Today row names the visit, the case and its status

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
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the Today cut, and a visit falls on the shop's day today.

**Steps:**

1. Read the visit's row.

**Expected Results:**

* The row shows the visit's time, the collector's name and the case's reference, the lane, and the collector's word for the status.

<!-- trace:case id=g10adm.vault-operator-queue.TC-tf0 rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC4-1: The Today cut with no visits today reads none

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and no visit falls on the shop's day today.

**Steps:**

1. Open the Today cut.

**Expected Results:**

* The block reads no visits today.

<!-- trace:case id=g10adm.vault-operator-queue.TC-jpr rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC5-1: Load more adds the next page and updates the counts shown

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
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Pre-conditions:**

* admin(holds vault:read) is on a cut holding more rows than one page shows.

**Steps:**

1. Read "n in this view · showing m" above the list.
2. Select Load more.

**Expected Results:**

* Step 2 adds the next page's rows to the list.
* "showing m" grows by the page it loaded, and "n in this view" stays the backlog count.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0vr rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC6-1: The load-more control reflects whether more rows remain

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Pre-conditions:**

* admin(holds vault:read) is on a cut whose cursor holds the rows named in **Test data**.

**Test data:**

| Rows left on the cursor | Load more |
| --- | --- |
| more than one page | offered |
| none | absent |

**Steps:**

1. Read the list's paging control.

**Expected Results:**

* The control matches **Test data**.

<!-- trace:case id=g10adm.vault-operator-queue.TC-kh5 rev=1 covers=g10adm.vault-operator-queue.SC-5zv,g10adm.vault-operator-queue.SC-2bi,g10adm.vault-operator-queue.SC-q25 -->
### grade10-admin-vault-operator-queue-US6-TC7-1: Today is the shop's own day, not the day in Coordinated Universal Time

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
* **Trace:** grade10-admin-vault-operator-queue-US-06

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url> early in the shop's morning, while the date in Coordinated Universal Time is still yesterday's, and a visit is booked at the shop for later today.

**Steps:**

1. Open the Today cut.

**Expected Results:**

* The visit's case is in the cut.
* The cut's count and the row's Visit today badge agree.

---

## grade10-admin-vault-operator-queue-US7: Operator walks the visit in order

**As a** member of shop staff with a customer at the counter,
**I want** the case to list the visit's steps in order, tick each as it lands, and say why an act is not offered yet,
**so that** a shop of three runs the flow from the screen rather than from memory.

<!-- trace:case id=g10adm.vault-operator-queue.TC-92x rev=1 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### grade10-admin-vault-operator-queue-US7-TC1-1: The Case tab opens on today's visit as an ordered checklist

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case with a visit today.

**Steps:**

1. Open the Case tab.

**Expected Results:**

* The tab opens on the visit's seven steps, in order.
* Every step already landed is ticked.
* The current step's button is offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-nj3 rev=1 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### grade10-admin-vault-operator-queue-US7-TC2-1: A step not yet reachable says why it is not offered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case with a visit today, at a step earlier than the checklist's last.

**Steps:**

1. Read a step later than the current one.

**Expected Results:**

* The later step says in words why it is not offered yet.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ddz rev=1 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### grade10-admin-vault-operator-queue-US7-TC3-1: The storage lane's checklist skips the loan-only terms step

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
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a storage-lane case with a visit today.

**Steps:**

1. Read the terms step in the checklist.

**Expected Results:**

* The terms step reads custody terms.
* No key-terms or loan-agreement step appears.

<!-- trace:case id=g10adm.vault-operator-queue.TC-lbt rev=1 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### grade10-admin-vault-operator-queue-US7-TC4-1: A case with no visit today shows no checklist

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case with no visit booked today.

**Steps:**

1. Open the Case tab.

**Expected Results:**

* The checklist panel is absent.

<!-- trace:case id=g10adm.vault-operator-queue.TC-hib rev=1 covers=g10adm.vault-operator-queue.SC-i5p,g10adm.vault-operator-queue.SC-on2,g10adm.vault-operator-queue.SC-a0m,g10adm.vault-operator-queue.SC-fzi,g10adm.vault-operator-queue.SC-ffw -->
### grade10-admin-vault-operator-queue-US7-TC5-1: Ticking a step's act makes the next step current

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
* **Trace:** grade10-admin-vault-operator-queue-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case with a visit today, on a step whose act this operator may send.

**Steps:**

1. Send the current step's act.

**Expected Results:**

* The step just sent is ticked.
* The following step becomes current, with its own button offered.

---

## grade10-admin-vault-operator-queue-US8: Operator reads why a late loan cannot be forfeited yet

**As a** member of shop staff,
**I want** the custody tab to say in words why Forfeit is not offered — not before the cure date, the notice sent on which day,
**so that** I never take an item a day early.

<!-- trace:case id=g10adm.vault-operator-queue.TC-v2p rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### grade10-admin-vault-operator-queue-US8-TC1-1: Forfeit is withheld before the due date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of a live loan before its due date.

**Steps:**

1. Read the Custody tab.

**Expected Results:**

* Forfeit is not offered.
* The reason names that the case is not past the due date.

<!-- trace:case id=g10adm.vault-operator-queue.TC-2te rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### grade10-admin-vault-operator-queue-US8-TC2-1: Forfeit is withheld with no notice sent

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
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of a live loan past its due date, with no forfeiture notice sent.

**Steps:**

1. Read the Custody tab.

**Expected Results:**

* Forfeit is not offered.
* The reason names that no written notice has been sent.
* Send notice is offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-tmb rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### grade10-admin-vault-operator-queue-US8-TC3-1: Forfeit is withheld while the notice's cure runs

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of a live loan whose forfeiture notice was sent 13 days ago, one day short of the 14-day cure.

**Steps:**

1. Read the Custody tab.

**Expected Results:**

* Forfeit is not offered.
* The reason names the cure date given to the borrower and the day the notice was sent.

<!-- trace:case id=g10adm.vault-operator-queue.TC-yg6 rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### grade10-admin-vault-operator-queue-US8-TC4-1: Forfeit becomes available once the cure date passes

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
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of a live loan whose forfeiture notice was sent 14 days ago.

**Steps:**

1. Read the Custody tab.

**Expected Results:**

* Forfeit is offered, with its reason field.

<!-- trace:case id=g10adm.vault-operator-queue.TC-pwu rev=1 covers=g10adm.vault-operator-queue.SC-cby,g10adm.vault-operator-queue.SC-ngn,g10adm.vault-operator-queue.SC-xep,g10adm.vault-operator-queue.SC-oxk,g10adm.vault-operator-queue.SC-g9x -->
### grade10-admin-vault-operator-queue-US8-TC5-1: The Custody tab lists what the collector was told

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
* **Trace:** grade10-admin-vault-operator-queue-US-08

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of a live loan with reminders sent.

**Steps:**

1. Read the "What the collector was told" list.

**Expected Results:**

* Each message sent is listed with its date and channel.

---

## grade10-admin-vault-operator-queue-US9: Operator reads the identity state the record names

**As a** member of shop staff arranging a visit,
**I want** the identity panel to say Verified, Out, Stalled, Refused, Lapsed or None,
**so that** I know whether to send the check again, wait, or do it at the counter.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xkz rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### grade10-admin-vault-operator-queue-US9-TC1-1: The identity panel names the record's state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* admin(holds vault:operate) is on the Documents tab of a case whose identity stands as named in **Test data**.

**Test data:**

| Identity stands | Panel reads | Acts offered |
| --- | --- | --- |
| nothing asked for | None | Send hosted check, Record at the counter |
| a hosted check invited, started, or submitted and not yet read as stalled | Out | Send again, Record at the counter |
| a submitted check the identity check reads as stalled | Stalled | Record at the counter, Send again |
| the last hosted check declined | Refused | Record at the counter |
| the last hosted check expired or withdrawn | Lapsed | Send hosted check, Record at the counter |

**Steps:**

1. Open the Documents tab.

**Expected Results:**

* The identity panel reads the state named in **Test data**, and offers the acts named.
* Beside the state the panel names the day the record holds for it.
* No state beyond the six the record defines is shown.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ooz rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### grade10-admin-vault-operator-queue-US9-TC2-1: The Verified state names who performed the check and when

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
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the Documents tab of a case whose identity is verified.

**Steps:**

1. Open the Documents tab.

**Expected Results:**

* The panel reads Verified, naming who performed the check and when.

<!-- trace:case id=g10adm.vault-operator-queue.TC-5vm rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### grade10-admin-vault-operator-queue-US9-TC3-1: Viewing the identity photograph needs the identity-read grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate, not kyc:read) is on the Documents tab of a case whose identity is verified.

**Steps:**

1. Read the Documents tab.

**Expected Results:**

* View photograph is not offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-zxo rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### grade10-admin-vault-operator-queue-US9-TC4-1: Recording over a Refused identity records the reason and who gave it

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
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* admin(holds vault:operate) is on the Documents tab of a case whose last hosted check was declined by the provider.

**Steps:**

1. Record the identity at the counter with a reason and who gave it.

**Expected Results:**

* The recording succeeds.
* The case shows the override beside the decline, with the reason and who gave it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-3jw rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### grade10-admin-vault-operator-queue-US9-TC5-1: Recording over a Refused identity without a reason is refused

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
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* admin(holds vault:operate) is on the Documents tab of a case whose last hosted check was declined by the provider.

**Steps:**

1. Record the identity at the counter with no reason.

**Expected Results:**

* The recording is refused.

<!-- trace:case id=g10adm.vault-operator-queue.TC-qti rev=1 covers=g10adm.vault-operator-queue.SC-xz7,g10adm.vault-operator-queue.SC-rz1,g10adm.vault-operator-queue.SC-fw0,g10adm.vault-operator-queue.SC-3z5,g10adm.vault-operator-queue.SC-k4s -->
### grade10-admin-vault-operator-queue-US9-TC6-1: A submitted check reads Out until the identity check reads it stalled

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
* **Trace:** grade10-admin-vault-operator-queue-US-09

**Pre-conditions:**

* admin(holds vault:operate) is on the Documents tab of a case whose hosted check the collector has submitted and the provider has not decided.

**Steps:**

1. Read the identity panel before the identity check reads that check as stalled.
2. Read it again once the identity check reads it as stalled.

**Expected Results:**

* Step 1 reads Out, with the day the check went.
* Step 2 reads Stalled, with the day it was submitted.
* The panel never decides the boundary itself: it reads the state the identity check holds.

---

## grade10-admin-vault-operator-queue-US10: Operator opens a case for a customer at the counter

**As a** member of shop staff with a customer and their item in front of me,
**I want** to open the case myself from their email, the item and my own
photos,
**so that** a customer with no request on their phone is served on the spot,
and the draft waits for them to send it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p4n rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC1-1: A walk-in for a new address opens a draft under a new account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production.
* No account exists for `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.new+<run id>@example.com` |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |
| Amount | HKD 5,000.00 (500000 minor units) |
| Photos | two JPEG photographs, each under 20 MB |

**Steps:**

1. Click Open a walk-in in the queue's header.
2. Read the collection statement the form shows.
3. Fill in the email, category, title, description and amount from **Test data**.
4. Attach the two photographs.
5. Click Open case.
6. Open the Drafts view of the queue.

**Expected Results:**

* Step 5 opens the new draft on its own page, `admin.grade10.com/vault/cases/<case id>`.
* The draft is on the financed lane, in HKD, with the facts and two photographs from **Test data**.
* The draft offers Cancel, and nothing to value and no visit to book.
* The case header carries The collector's cases.
* Step 6 lists the draft as any draft reads there.
* The draft's collector reads as the handle of `<walk-in email>`; no name was asked for on the form.

<!-- trace:case id=g10adm.vault-operator-queue.TC-u0u rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC2-1: A walk-in for an address nobody has signed in to opens under that account and renames nothing

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production.
* `<account_1>`: an account for `<walk-in email>` that nobody has ever signed in to, carrying the name `<held name>`, with no vault case.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | the address of `<account_1>` |
| `<held name>` | Chan Tai Man |
| Category | Trading card |
| Title | Pikachu Illustrator |
| Description | Graded, slab intact. |
| Amount | none (storage lane) |
| Photos | one PNG photograph |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form from **Test data** and attach the photograph.
3. Click Open case.
4. Open `<account_1>`'s collector page from the draft's header.

**Expected Results:**

* Step 3 opens the draft on the storage lane.
* The draft belongs to `<account_1>`; no second account is created for `<walk-in email>`.
* `<account_1>` still carries the name `<held name>`.
* Step 4 lists the draft among `<account_1>`'s vault cases.

<!-- trace:case id=g10adm.vault-operator-queue.TC-vyx rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC3-1: The statement is shown before the address and the open keeps its version

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, with the collection statement written at version `<statement version>`.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Read what the form shows before the email field.
3. Fill in the form for `<walk-in email>` with one photograph and click Open case.
4. Read the new draft's history on its page.

**Expected Results:**

* Step 2 shows the collection statement before the email can be typed.
* The draft records that the statement was shown at the counter, at `<statement version>`.
* The draft records no tick by the collector; the collector's own tick is still owed at the send.

<!-- trace:case id=g10adm.vault-operator-queue.TC-iqc rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC4-1: Production refuses a walk-in while the collection statement is unwritten

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url> in production, with no collection statement text written.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<walk-in email>` with one photograph.
3. Click Open case.

**Expected Results:**

* The open is refused by name, saying the collection statement is not yet written.
* No draft is opened, and no account is created for `<walk-in email>`.
* Nothing is emailed to `<walk-in email>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-3hf rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC5-1: Outside production an unwritten statement reads Being prepared and the walk-in opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url> in staging, with no collection statement text written.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Read the statement the form shows.
3. Fill in the form for `<walk-in email>` with one photograph and click Open case.

**Expected Results:**

* Step 2 says the collection statement is being prepared.
* Step 3 opens the draft on its own page.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ntv rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC6-1: A walk-in for an address someone has signed in to is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production.
* `<account_2>`: an account for `<signed-in email>` that its owner has signed in to at least once, carrying the name `<held name>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<signed-in email>` | the address of `<account_2>` |
| `<held name>` | Wong Siu Ming |
| Typed as | <signed-in email> with its first letter and its domain in capitals, and a space either side |
| Title | Blastoise Base Set |
| Photos | one JPEG photograph |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form from **Test data**, the email as Typed as, and attach the photograph.
3. Click Open case.

**Expected Results:**

* A notice says the address has signed in before, and that this customer sends the request from their own phone.
* The notice names nothing else about the account: not `<held name>`, not its cases.
* The form keeps the email, the facts and the photograph typed.
* No draft is opened, no second account exists for <signed-in email>, and nothing is emailed to it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-qht rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC7-1: A walk-in counts against the account's three unsent drafts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production.
* The account for `<walk-in email>` has nobody signed in to it and holds the unsent drafts in the row.

**Test data:**

| Unsent drafts already held | Outcome |
| --- | --- |
| two drafts staff opened | the draft opens; the account now holds three |
| three drafts staff opened | refused with the draft cap's refusal; no draft opens |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<walk-in email>` with one photograph.
3. Click Open case.

**Expected Results:**

* The outcome matches the row.
* A refusal reads as the cap's own refusal, not a walk-in refusal of its own.

<!-- trace:case id=g10adm.vault-operator-queue.TC-srd rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC8-1: Opening a walk-in emails nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production.
* `<walk-in email>` is a mailbox the tester reads, with no account behind it.

**Test data:**

| Field | Value |
| --- | --- |
| `<mail delivery window>` | 5 minutes (assumed; any wait past the first send attempt) |

**Steps:**

1. Open a walk-in for `<walk-in email>` with one photograph.
2. Wait <mail delivery window>.
3. Read `<walk-in email>`'s inbox.
4. Read the draft's page for a parked or owed message.

**Expected Results:**

* Step 3 finds no message about the case: no case, no reference, no sign-in link.
* Step 4 shows no message owed or parked for the draft.

<!-- trace:case id=g10adm.vault-operator-queue.TC-rae rev=2 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC9-2: Photos on the walk-in form stop at the limit of ten and can be removed

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>.

**Test data:**

| Field | Value |
| --- | --- |
| Photos | ten JPEG photographs, each under 20 MB |

**Steps:**

1. Attach the ten photographs.
2. Look in the gallery for a way to add another photograph.
3. Remove one photograph.

**Expected Results:**

* Step 1 shows the ten in the gallery, reading 10 of 10.
* Step 2 finds no way to add another; the gallery still holds ten.
* Step 3 leaves nine, reading 9 of 10, and a way to add one returns.

<!-- trace:case id=g10adm.vault-operator-queue.TC-csn rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC10-1: The worker's refusal of a field reads beside that field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* Every field but the row's is filled in validly, with one photograph.

**Test data:**

| Field | Value | Refused beside |
| --- | --- | --- |
| Title | 201 characters | Title |
| Description | 2,001 characters | Description |

**Steps:**

1. Enter the row's value.
2. Try to click Open case.

**Expected Results:**

* Open case stays disabled, the refusal in words beside the field in the row.
* The rest of the form keeps what was typed.
* No draft opens.

<!-- trace:case id=g10adm.vault-operator-queue.TC-uzm rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC11-1: Opening holds the form and opens one draft

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form filled in validly for `<walk-in email>`, with no account behind it, and the open is held pending by a slowed response.

**Steps:**

1. Click Open case.
2. Click Open case again while the first is pending.
3. Let the response land.
4. Open the Drafts view.

**Expected Results:**

* Step 1 shows Open case pending and the form held.
* Step 2 sends nothing more.
* Step 4 lists one draft for `<walk-in email>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-vgy rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC12-1: Only an operate holder can open a walk-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* The row's actor is on <grade10 admin vault queue url>, or calls the walk-in open directly where the row says so.

**Test data:**

| Actor | Open a walk-in shown | A direct walk-in call |
| --- | --- | --- |
| admin(staff, holds vault:operate) | yes | opens the draft |
| admin(admin) | yes | opens the draft |
| admin(treasurer, holds vault:read and vault:payout) | no | refused for the missing grant |
| customer(collector), signed in on the site | no console | refused |
| signed out | the console's sign-in | refused |

**Steps:**

1. Read the queue's header.
2. Send a walk-in open for a fresh address with one photograph, by the console where shown, else by a direct call.

**Expected Results:**

* Step 1 matches the row's Open a walk-in shown.
* Step 2 matches the row's direct call; a refusal opens no draft and creates no account.

<!-- trace:case id=g10adm.vault-operator-queue.TC-50a rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC13-1: A walk-in opens with no photograph and the send still needs one

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, and no account answers to `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | a mailbox the tester reads that no account answers to, e.g. walkin.photo+<run id>@example.com |

**Steps:**

1. Open a walk-in for `<walk-in email>` with category Trading card, title `Charizard PSA 10` and no photograph.
2. As the customer, signed in at `<walk-in email>`, open the draft and send it.

**Expected Results:**

* Step 1 opens the draft, and the form asked for no contact number.
* Step 2 is refused until the draft holds a photograph.

<!-- trace:case id=g10adm.vault-operator-queue.TC-fh4 rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC14-1: Staff photograph only an unsent draft staff opened

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate) holds a verified console session.
* `<case_1>` is a request its collector sent; `<case_2>` is an unsent draft staff opened.

**Steps:**

1. Attach a photograph to `<case_1>`.
2. Attach a photograph to `<case_2>`.

**Expected Results:**

* Step 1 is refused by name, and `<case_1>` is unchanged.
* Step 2 attaches the photograph to `<case_2>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-l20 rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC15-1: A malformed address is refused beside the email field before anything is sent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* Every field but the email is filled in validly, with one photograph.
* No account exists for `<walk-in email>`.

**Test data:**

| `<malformed address>` | What is wrong | Left by |
| --- | --- | --- |
| `mei.chan@example` | no ending after the domain | pressing Tab to the next field |
| `walkin.example.com` | no @ | pressing Tab to the next field |
| `@example.com` | nothing before the @ | clicking the Title field |
| `walkin@` | nothing after the @ | pressing Tab to the next field |

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.fixed+<run id>@example.com` |

**Steps:**

1. Click in the email field and press Tab, leaving it empty.
2. Click in the email field and type `<malformed address>`, one character at a time.
3. Leave the email field as the row's Left by.
4. Try to click Open case.
5. Select the address in the email field and type `<walk-in email>` over it.
6. Click Open case.

**Expected Results:**

* Step 1 shows no refusal beside the email field; Open case stays disabled.
* Step 2 shows no refusal while the address is typed.
* Step 3 shows a refusal in words beside the email field, saying it is not an email address.
* The form's footer shows no refusal; the rest of the form keeps what was typed.
* Step 4 finds Open case disabled; no draft opens.
* Step 5 clears the refusal once the address is whole, the field not yet left, and Open case becomes available.
* Step 6 opens the draft for `<walk-in email>` on its own page.

<!-- trace:case id=g10adm.vault-operator-queue.TC-i6v rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC16-1: A loan of zero is refused beside the loan field before anything is sent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The form holds `<walk-in email>`, a valid category, title and description, and one photograph.
* A loan is chosen at the lane question, and the loan field is empty.
* No account exists for `<walk-in email>`.

**Test data:**

| `<zero amount>` | Left by |
| --- | --- |
| `0` | pressing Tab to the next field |
| `0.00` | clicking the Title field |

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.zero+<run id>@example.com` |
| `<smallest loan>` | `0.01`, HKD 0.01 (1 minor unit) |

**Steps:**

1. Click in the loan field and press Tab, leaving it empty.
2. Click in the loan field and type `<zero amount>`, one character at a time.
3. Leave the loan field as the row's Left by.
4. Try to click Open case.
5. Select the amount and delete it.
6. Type `<zero amount>` again.
7. Leave the loan field as the row's Left by.
8. Select the amount and type `<smallest loan>` over it, staying in the field.
9. Click Open case.

**Expected Results:**

* Step 1 shows no refusal beside the loan field; Open case stays disabled.
* Step 2 shows no loan-of-zero refusal while typing; Open case stays disabled.
* In the `0.00` row, `0.` shows the field's own `Not an amount in HKD.` until the next digit.
* Step 3 shows `A loan is more than zero. Ask the customer how much, or choose Storage only.` beside the loan field.
* The form's footer shows no refusal; the rest of the form keeps what was typed.
* Step 4 finds Open case disabled; nothing is sent and no draft opens.
* Step 5 clears the refusal; Open case stays disabled.
* Step 6 shows no loan-of-zero refusal until the field is left.
* Step 7 shows the refusal beside the loan field again.
* Step 8 clears it once `<smallest loan>` is whole; Open case becomes available.
* Step 9 opens the draft on its own page, financed, asking `<smallest loan>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-89x rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC17-1: Choosing Storage only sets a refused loan of zero aside

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The form holds `<walk-in email>`, a valid category, title and description, and one photograph.
* A loan is chosen, the loan field holds `0` and has been left, and the loan-of-zero refusal shows beside it.
* No account exists for `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.storage+<run id>@example.com` |

**Steps:**

1. Choose Storage only at the lane question.
2. Choose the loan at the lane question again.
3. Click in the loan field, then click the Title field.
4. Choose Storage only again.
5. Click Open case.

**Expected Results:**

* Step 1 hides the loan field and its refusal; Open case becomes available.
* Step 2 shows the loan field holding zero, `0.00`, with no refusal beside it; Open case is disabled.
* Step 3 shows the refusal beside the loan field again.
* Step 5 opens the draft on its own page, storage only, asking no loan.

<!-- trace:case id=g10adm.vault-operator-queue.TC-oib rev=1 covers=g10adm.vault-operator-queue.SC-vri,g10adm.vault-operator-queue.SC-mvr,g10adm.vault-operator-queue.SC-rkk,g10adm.vault-operator-queue.SC-9is,g10adm.vault-operator-queue.SC-8w3,g10adm.vault-operator-queue.SC-d45,g10adm.vault-operator-queue.SC-or8,g10adm.vault-operator-queue.SC-us4,g10adm.vault-operator-queue.SC-bsk,g10adm.vault-operator-queue.SC-icq,g10adm.vault-operator-queue.SC-03h,g10adm.vault-operator-queue.SC-xu5,g10adm.vault-operator-queue.SC-wqo,g10adm.vault-operator-queue.SC-q6y,g10adm.vault-operator-queue.SC-wjv,g10adm.vault-operator-queue.SC-cgu,g10adm.vault-operator-queue.SC-jcc -->
### grade10-admin-vault-operator-queue-US10-TC18-1: Text that is not an amount keeps the field's own refusal

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
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The form holds a valid email address, category, title and description, and one photograph.
* A loan is chosen at the lane question, and the loan field is empty.

**Test data:**

| `<typed>` | Reading | The field's own words |
| --- | --- | --- |
| `-1` | a minus sign | `An amount, not a debit.` |
| `0.004` | below HKD's smallest unit, 0.4 of 1 minor unit | `At most 2 decimals in HKD.` |

**Steps:**

1. Type `<typed>` into the loan field.
2. Leave the loan field by clicking the Title field.
3. Try to click Open case.

**Expected Results:**

* Step 1 shows the row's own words beside the loan field as it is typed.
* Step 2 keeps the row's words; `A loan is more than zero. Ask the customer how much, or choose Storage only.` never shows.
* Step 3 finds Open case disabled; no draft opens.

---

## grade10-admin-vault-operator-queue-US11: Operator reads whose case it is by name

**As a** member of shop staff,
**I want** the queue and the held items to name each case's collector,
**so that** I can greet the customer and tell two customers' cases apart
without opening each one.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bv9 rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC1-1: Queue and held-item rows name each case's collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds two cases in the row's list; `<collector_B>`, named Lee Ka Yan, holds one.

**Test data:**

| List |
| --- |
| the Needs staff view |
| the Held items tab |

**Steps:**

1. Open the row's list.
2. Read the collector on each of the three rows.

**Expected Results:**

* Both of `<collector_A>`'s rows read Chan Tai Man; `<collector_B>`'s reads Lee Ka Yan.
* A link beside each name opens that collector's page.
* The rest of each row reads as before.

<!-- trace:case id=g10adm.vault-operator-queue.TC-per rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC2-1: An account the walk-in created reads by its email handle until the customer names themselves

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* A walk-in draft sits under an account the walk-in created for `mei.ling.walkin@example.com`, nobody signed in to it yet.

**Steps:**

1. Open the Drafts view and read the draft's collector.
2. The account is renamed to Ho Mei Ling.
3. Reload the Drafts view and read the draft's collector.

**Expected Results:**

* Step 1 reads `mei.ling.walkin`.
* Step 3 reads Ho Mei Ling, with no change made on the case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p86 rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC3-1: A name the account service cannot answer reads as unavailable and the list stands

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, the Needs staff view holding cases of several collectors.
* The account service fails to answer names.

**Steps:**

1. Open the Needs staff view.
2. Click the short id on one row.
3. Click Every collector.
4. Open the Held items tab.

**Expected Results:**

* Every row's collector reads the account's short id and "name unavailable".
* Every other field on every row reads as it does with names answered, and both lists load in full.
* Step 2 narrows the list to that collector; the row's link opens their collector page.

<!-- trace:case id=g10adm.vault-operator-queue.TC-kx8 rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC4-1: A reader without the identity grant sees no collector column

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) is on <grade10 admin vault queue url>, with cases of several collectors in the Needs staff view and the Held items tab.

**Steps:**

1. Open the Needs staff view.
2. Open the Held items tab.
3. Read each list's response in the browser's network panel.

**Expected Results:**

* Neither list carries a collector column, a name or a name link.
* Every other field reads as before this change.
* The read carries no collector name.

<!-- trace:case id=g10adm.vault-operator-queue.TC-f5e rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC5-1: The collector-name read refuses a caller without the identity grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) holds a verified console session.
* `<case_1>` is a case of a collector with a name.

**Steps:**

1. Call the collector-name read for `<case_1>` directly.

**Expected Results:**

* The call is refused for the missing identity grant.
* No name comes back.

<!-- trace:case id=g10adm.vault-operator-queue.TC-2pj rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC6-1: The overdue rows keep the reference and the contact, with no name

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and a live loan of a named collector is past its due date.

**Steps:**

1. Open the Overdue view.

**Expected Results:**

* The row names the case reference, the item and the contact the case holds.
* The row names no collector.

<!-- trace:case id=g10adm.vault-operator-queue.TC-zfg rev=1 covers=g10adm.vault-operator-queue.SC-lnp,g10adm.vault-operator-queue.SC-e22,g10adm.vault-operator-queue.SC-msu,g10adm.vault-operator-queue.SC-00c,g10adm.vault-operator-queue.SC-t8q -->
### grade10-admin-vault-operator-queue-US11-TC7-1: A list that names collectors is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and the Needs staff view holds cases of two named collectors.

**Steps:**

1. Open the Needs staff view.
2. As admin(auditor), read the audit log for the operator's entries since step 1.

**Expected Results:**

* One entry records who read the names, when, and both collectors' ids.
* Neither collector's name nor email appears in any column of it.

---

## grade10-admin-vault-operator-queue-US12: Operator narrows the queue to one collector's cases

**As a** member of shop staff,
**I want** a collector's name to narrow the queue and the held items to that
collector,
**so that** I can see everything one customer has with us without being able
to search the customer list by name.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bpi rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC1-1: A collector's name narrows the list to that collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds two cases in the row's list; two other collectors hold one each.

**Test data:**

| List |
| --- |
| the Needs staff view |
| the Held items tab |

**Steps:**

1. Open the row's list.
2. Click Chan Tai Man on one of `<collector_A>`'s rows.
3. Read the list and the address bar.
4. Click the control that clears the collector.

**Expected Results:**

* Step 3 lists only `<collector_A>`'s two rows, with Chan Tai Man above them and a count of 2.
* The address carries `<collector_A>`'s user id.
* Step 4 lists all four rows again and the address no longer carries the collector.

<!-- trace:case id=g10adm.vault-operator-queue.TC-myy rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC2-1: A narrowed address opened afresh narrows the same way

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) holds `<narrowed url>`, the Needs staff view narrowed to `<collector_A>`.
* `<collector_A>` holds two cases in the Needs staff view.

**Test data:**

| Field | Value |
| --- | --- |
| `<narrowed url>` | <grade10 admin vault queue url>?queue=waiting&collector=<collector_A user id> |

**Steps:**

1. Open `<narrowed url>` in a new tab.

**Expected Results:**

* The view lists only `<collector_A>`'s two rows, with their name above them and a count of 2.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ucj rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC3-1: A collector with nothing in the narrowed list reads none

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_C>` holds one submitted case and no item in the vault.

**Steps:**

1. In the Needs staff view, click `<collector_C>`'s name.
2. Open the Held items tab narrowed to `<collector_C>`.

**Expected Results:**

* Step 2 says the collector holds no case in this list, with their name above and a count reading none.
* The control clearing the collector is still offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-c0i rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC4-1: The queue offers no way to find a collector by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds a case in the Needs staff view.

**Steps:**

1. Look for a field taking a collector or a name on the queue and the Held items tab.
2. Type `Chan Tai Man` into the queue's search and search.

**Expected Results:**

* Step 1 finds no field to type a collector into.
* Step 2 finds no case.

<!-- trace:case id=g10adm.vault-operator-queue.TC-mil rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC5-1: Reading one collector's cases is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and `<collector_A>` holds a case in the Needs staff view.

**Steps:**

1. Click `<collector_A>`'s name.
2. As admin(auditor), read the audit log for the operator's entries since step 1.

**Expected Results:**

* One entry records who read `<collector_A>`'s cases, when, and `<collector_A>`'s id.
* No name or email appears in any column of it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-f1e rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC6-1: An address narrowed to nobody reads as a collector holding no case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.

**Test data:**

| Collector in the address |
| --- |
| a well-formed user id no account holds |
| `not-a-user-id` |

**Steps:**

1. Open <grade10 admin vault queue url>?collector=<row's value>.
2. Open each cut in turn.

**Expected Results:**

* Every cut says the collector holds no case in it, and every count reads none.

<!-- trace:case id=g10adm.vault-operator-queue.TC-32a rev=1 covers=g10adm.vault-operator-queue.SC-tjf,g10adm.vault-operator-queue.SC-8mz,g10adm.vault-operator-queue.SC-q78,g10adm.vault-operator-queue.SC-z5x,g10adm.vault-operator-queue.SC-gij,g10adm.vault-operator-queue.SC-xda -->
### grade10-admin-vault-operator-queue-US12-TC7-1: The Overdue view stays whole while the queue is narrowed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url> narrowed to `<collector_A>`.
* Loans of `<collector_A>` and `<collector_B>` are both past due.

**Steps:**

1. Open the Overdue view.
2. Search for `<collector_B>`'s phone number.

**Expected Results:**

* Step 1 lists both overdue loans, and no row names a collector.
* Step 2 finds `<collector_B>`'s case, and its result names no collector.

---

## grade10-admin-vault-operator-queue-US20: Operator takes in a slab the register already knows

**As a** member of shop staff opening a case for a walk-in,
**I want** to type the slab's grader and cert and have the case take the item
the register already knows, its facts filled in,
**so that** one slab never has two records and nobody types its facts twice.

<!-- trace:case id=g10adm.vault-operator-queue.TC-pf9 rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC1-1: A walk-in naming a known slab takes the register's item

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<walk-in account>` is an account nobody has signed in to.
* `<item_1>` is live, owned by `<walk-in account>`, no place marks it: trading card, PSA, grade 10, `AB12345`.

**Test data:**

| Grader | Cert typed |
| --- | --- |
| PSA | `AB12345` |
| PSA | ` ab12345 ` |

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in account>`'s email.
3. Choose the grader and type the cert from **Test data**.
4. Open the draft.
5. Open the new case's Case tab.

**Expected Results:**

* Step 3 shows `<item_1>`'s category, title, grader, grade and cert, read-only, and fills the form's category and title from them.
* The draft opens under `<walk-in account>`.
* The Case tab reads `<item_1>`'s facts and links `<item_1>`.
* The register holds no second item with PSA and `AB12345`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-s3l rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC2-1: A slab the register does not know is registered when the valuation starts

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* No item carries PSA and `AB99999`.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>` and the item's facts, then PSA and `AB99999` with no grade.
3. Type grade 9 and open the draft.
4. Have the customer at `<walk-in email>` send the draft from their phone.
5. Start the valuation on the case.
6. Search Items for PSA and `AB99999`.

**Expected Results:**

* Step 2 fills nothing in from the register, and the draft cannot be opened until a grade is typed.
* Before step 5 the register holds no item with PSA and `AB99999`.
* Step 6 finds one item under the account at `<walk-in email>`, carrying PSA, 9 and `AB99999`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-bcc rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC3-1: A known slab owned by someone else is found naming its owner

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(the grants in **Test data**) is on <grade10 admin vault queue url>.
* `<item_2>` is live, owned by `<collector B>`, no place marks it, carrying PSA and `AB22222`.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Test data:**

| Grants | The owner reads |
| --- | --- |
| staff, holding `kyc:read` | `<collector B>` by name, the read on the audit log |
| `vault:operate` and `inventory:read`, not `kyc:read` | `<collector B>`'s short id |

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`.
3. Choose PSA and type `AB22222`.
4. Open the draft.

**Expected Results:**

* Step 3 shows `<item_2>`'s facts and its owner as **Test data** reads, and fills nothing in the form.
* The draft opens under the account at `<walk-in email>` and takes `<item_2>`.
* `<item_2>` is still owned by `<collector B>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-oac rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC4-1: A known slab another case marks refuses the walk-in

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<item_3>` carries PSA and `AB33333` and is marked by the vault on `<case_3>`.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`.
3. Choose PSA and type `AB33333`.
4. Try to open the draft.
5. Click the link in the refusal.

**Expected Results:**

* The dialog refuses, naming `<case_3>`.
* No draft is opened.
* Step 5 opens `<case_3>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-gvm rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC5-1: A retired slab reads as retired at the walk-in

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<item_4>` carries PSA and `AB44444` and is retired as lost; no live item carries them.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`.
3. Choose PSA and type `AB44444`.
4. Open the draft.
5. Have the customer at `<walk-in email>` send the draft from their phone.
6. Start the valuation on the case.
7. Search Items for PSA and `AB44444`.

**Expected Results:**

* Step 3 shows `<item_4>` reading as retired.
* Step 7 lists `<item_4>` under retired and one new live item carrying PSA and `AB44444`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ba3 rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC6-1: The register unreachable at the walk-in keeps what was typed

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<walk-in email>` belongs to no account anybody has signed in to.
* The register's slab lookup is mocked to fail once, then find `<item_1>`, carrying PSA and `AB12345`.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`, PSA and `AB12345`.
3. Click retry on the error.

**Expected Results:**

* Step 2 shows a pending lookup, then an error with a retry.
* The email, grader and cert typed are still in the form.
* Step 3 shows `<item_1>`'s facts.

<!-- trace:case id=g10adm.vault-operator-queue.TC-fcn rev=1 covers=g10adm.vault-operator-queue.SC-knz,g10adm.vault-operator-queue.SC-s8n,g10adm.vault-operator-queue.SC-z22,g10adm.vault-operator-queue.SC-nyo,g10adm.vault-operator-queue.SC-5z0,g10adm.vault-operator-queue.SC-qjf,g10adm.vault-operator-queue.SC-jor -->
### grade10-admin-vault-operator-queue-US20-TC7-1: Starting a valuation naming a known slab takes the register's item

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_10>`.
* `<case_10>` is a request `<collector A>` sent from their phone, submitted and naming no slab.
* `<item_5>` is live, owned by `<collector A>`, no place marks it, carrying PSA, grade 10 and `AB55555`.

**Steps:**

1. Click Start valuation on the Case tab.
2. Choose PSA, type grade 10 and ` ab55555 `.
3. Start the valuation.
4. Read the item's facts on the Case tab.
5. Search Items for PSA and `AB55555`.

**Expected Results:**

* Step 2 shows `<item_5>`'s facts, read-only.
* `<case_10>` reads under valuation.
* Step 4 reads `<item_5>`'s facts and links `<item_5>`, and the collector's request still reads as they sent it.
* Step 5 lists `<item_5>` alone.

---

## grade10-admin-vault-operator-queue-US21: Operator reads and corrects the item's facts on the case

**As a** member of shop staff working a case,
**I want** the Case tab to show the register's category, title, description,
grader, grade and cert, editable once the register has the item, with the
collector's request kept as they sent it, and to show registration pending
until it does,
**so that** the case and the register never tell two stories about one item.

<!-- trace:case id=g10adm.vault-operator-queue.TC-yfe rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### grade10-admin-vault-operator-queue-US21-TC1-1: The Case tab says registration is pending before the valuation

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
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<case_5>` is submitted, its valuation not started, with no item linked.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_5>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section says the item is registered when the valuation starts.
* The section offers no Edit and links no item.

<!-- trace:case id=g10adm.vault-operator-queue.TC-etq rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### grade10-admin-vault-operator-queue-US21-TC2-1: The Case tab shows and edits the register's facts

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
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_6>`.
* `<case_6>` is under valuation; its item `<item_6>` is registered with the request's facts and no grader.
* `<collector A>` sent `<case_6>`'s request titled `<request title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<request title>` | Pikachu card, think it's a 9 |
| Title after edit | Pikachu Illustrator |
| Grader after edit | PSA |
| Grade after edit | 9 |
| Cert after edit | `AB66666` |

**Steps:**

1. Read the item's facts on the Case tab.
2. Click Edit in that section.
3. Change the title, grader, grade and cert to the values in **Test data**.
4. Save.
5. Click the link to the item.
6. As `<collector A>`, open `<case_6>` on <grade10 vault url>.

**Expected Results:**

* Step 1 reads the register's category, title, description, grader, grade and cert, linking `<item_6>`.
* Step 4 shows the new facts on the Case tab.
* Step 5 opens `<item_6>`, reading the new facts and this staff member as its last editor.
* Step 6 still reads `<request title>` as the collector sent it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-z8m rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### grade10-admin-vault-operator-queue-US21-TC3-1: Without the inventory write the Case tab facts read only

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(holds `vault:read` and `inventory:read`, not `inventory:write`) is signed in to the Grade10 console.
* `<case_6>` is under valuation with `<item_6>` registered.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_6>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section reads the register's facts and offers no Edit.

<!-- trace:case id=g10adm.vault-operator-queue.TC-wo3 rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### grade10-admin-vault-operator-queue-US21-TC4-1: The register unreachable fails the facts section alone

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
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<case_6>` is under valuation with `<item_6>` registered.
* The register's read of `<item_6>` is mocked to fail once, then answer.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_6>`.
2. Click retry in the item's facts section.

**Expected Results:**

* Step 1 shows the section's own error with a retry.
* The rest of the Case tab, its acts and timeline, still loads.
* Step 2 shows `<item_6>`'s facts.

<!-- trace:case id=g10adm.vault-operator-queue.TC-s0y rev=1 covers=g10adm.vault-operator-queue.SC-pfx,g10adm.vault-operator-queue.SC-54k,g10adm.vault-operator-queue.SC-2vm,g10adm.vault-operator-queue.SC-ned,g10adm.vault-operator-queue.SC-0bj -->
### grade10-admin-vault-operator-queue-US21-TC5-1: A treasurer's Case tab names the register's grant

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(only operator role is `treasurer`) is signed in to the Grade10 console.
* `<case_6>` is under valuation with `<item_6>` registered.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_6>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section names `inventory:read` and shows none of `<item_6>`'s facts.
* The rest of the Case tab, its timeline and the request as sent, still loads.

---

## Settled

- The boundary between Out and Stalled is `grade10-site/e-kyc/hosted-verification`'s, not the console's: the panel reads the state that capability holds and decides none of its own.
- The held list carries three figures, the first broken down by shop, each counting everything the filter in force holds; there is no fourth figure counting shops.
- The visit checklist walks the seven steps the counter works, six of them on a case that borrows nothing.
- A pending or failed read is the panel's own status rather than a rule, so no scenario is owed for it.
- A reference search leaves the same trail as any other search: the trail rule already names what kind of term it was, and no scenario of its own is owed for the reference.
- A term of two to six characters of the reference's alphabet is searched as a reference and one of seven or more as a case-id prefix, so one term is never both kinds.
- A typed address is matched to its account whatever its capitals and the spaces around it, so retyping a signed-in address never opens a second account beside it.
- An address someone has signed in to is one a sign-in has verified; a sign-in link asked for and never opened is not one.
- Opening a walk-in sends nothing to anybody, the account's creation included.
- A walk-in's photographs are held to the intake's photograph rules: at most ten JPEG, PNG or WebP photographs, each within 20 MB, their location stripped.
- The overdue rows keep the case reference and the contact and name nobody; the money book owns them and this change leaves them as they stand.
- The rows a treasurer reads with no collector column are the queue's, walked under the queue's own journey for the names.
- An empty address is not refused as not an email address: Open case stays unavailable until one is typed, and nothing shows beside the field.
- A malformed address is refused once staff leave the field, never while they type, and the refusal clears as soon as the address meets the worker's rule or is emptied, while they retype it, and shows again only when they next leave the field.
- While the address is refused, Open case stays unavailable, as it does for a title past its limit.
- At ten photographs the walk-in form offers no way to add another, rather than refusing an eleventh by name.
- A walk-in amount that is not more than zero is refused by the worker's own rule for the amount, read by the form, so the form and the worker never disagree on one.
- The refusal shows when staff leave the loan field, never while they type; it clears as soon as the amount meets the rule or is emptied, and shows again only when they next leave the field.
- While the amount fails the rule, Open case stays unavailable.
- An empty loan field is not refused: with a loan chosen, Open case stays unavailable until an amount is typed, and nothing shows beside the field.
- The refusal's words are the console's own, in English: `A loan is more than zero. Ask the customer how much, or choose Storage only.`
- When staff choose Storage only while the refusal shows, the loan field goes and Open case becomes available, since a storage case carries no amount; the amount is kept and the refusal is cleared, so choosing a loan again shows the amount with Open case disabled, and the refusal shows when staff next leave the field.
- A negative amount is not refused in the loan-of-zero words: the console's money field refuses a minus sign as it is typed, in its own words, and hands no amount on.
- An amount finer than the currency's smallest unit, such as `0.004` in HKD, is not read as zero: the money field refuses it as it is typed, in its own words, and never rounds it.

## Reconciliation

**Run:** the blind pass read the bundle — this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the pages under `docs/prds/` the proposal links. It was denied every `## Requirements` section, `openspec/specs/` beyond the two included sections, `openspec/changes/archive/` and `tech-design.md`. It wrote 48 cases over nine journeys and raised two questions; the scenario pass issued `grade10-admin-vault-operator-queue-SC-21` to `grade10-admin-vault-operator-queue-SC-46` and carried `grade10-admin-vault-operator-queue-SC-01`, `grade10-admin-vault-operator-queue-SC-02`, `grade10-admin-vault-operator-queue-SC-07`, `grade10-admin-vault-operator-queue-SC-08` and `grade10-admin-vault-operator-queue-SC-09` in its MODIFIED blocks. Four cases and six scenarios were added here.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-vault-operator-queue-US1-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-27` and `grade10-admin-vault-operator-queue-SC-28`: the row reads the collector's word and carries the reference |
| `grade10-admin-vault-operator-queue-US1-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-02` |
| `grade10-admin-vault-operator-queue-US1-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-03` for the stalled valuation and `grade10-admin-vault-operator-queue-SC-29` for the collector badge; the rest of the badge table is the durable requirement's |
| `grade10-admin-vault-operator-queue-US1-TC4-1` | Corrected | the durable rule badges a valuation untouched for *more* than 7 days, which `grade10-admin-vault-operator-queue-SC-03` walks at 8; the row expecting the badge at exactly 7 days moved past it |
| `grade10-admin-vault-operator-queue-US1-TC5-1`, `grade10-admin-vault-operator-queue-US1-TC6-1`, `grade10-admin-vault-operator-queue-US4-TC7-1` | Kept, no scenario | presentation only: a pending or failed read is decided by the panel's colocated test, and the ui-design Loading and Error rows carry that same disposition |
| `grade10-admin-vault-operator-queue-US2-TC1-1`, `grade10-admin-vault-operator-queue-US2-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-07` |
| `grade10-admin-vault-operator-queue-SC-07a` | Scenario added | `grade10-admin-vault-operator-queue-US2-TC2-1`'s full-width and bare-dial-code rows: decided at landing, one codec for every way a number is typed |
| `grade10-admin-vault-operator-queue-US2-TC3-1` | Folded | `grade10-admin-vault-operator-queue-SC-47`: the case-id prefix was required and proved by no scenario |
| `grade10-admin-vault-operator-queue-US2-TC4-1` | Folded | `grade10-admin-vault-operator-queue-SC-48`: the refusal to match part of a contact column, likewise |
| `grade10-admin-vault-operator-queue-US2-TC5-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-26` |
| `grade10-admin-vault-operator-queue-US2-TC6-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-08` |
| `grade10-admin-vault-operator-queue-SC-09` | Case added | `grade10-admin-vault-operator-queue-US2-TC7-1`: reading the queue writes no audit entry |
| `grade10-admin-vault-operator-queue-US3-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-12` |
| `grade10-admin-vault-operator-queue-US3-TC2-1` | Reconciled, data corrected | `grade10-admin-vault-operator-queue-SC-10`. The draft offered a decline at `offer_made` and a forfeiture notice at `vaulted`; the case machine allows a decline only from `under_valuation` and a notice only on a loan past due, so both now sit in the Not offered column, and each row names the acts the machine allows at its status |
| `grade10-admin-vault-operator-queue-US3-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-37` |
| `grade10-admin-vault-operator-queue-US3-TC4-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-11` |
| `grade10-admin-vault-operator-queue-US4-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-18`; the locker's optionality is the durable requirement's, which this change does not reopen |
| `grade10-admin-vault-operator-queue-US4-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-19` |
| `grade10-admin-vault-operator-queue-US4-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-43`, with the tiles at three and the first broken down per shop — Q54 |
| `grade10-admin-vault-operator-queue-US4-TC4-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-44` |
| `grade10-admin-vault-operator-queue-US4-TC5-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-46` |
| `grade10-admin-vault-operator-queue-US4-TC6-1` | Folded | `grade10-admin-vault-operator-queue-SC-49`, under the new requirement *The custody tab reads back where the item has been*: the movement log is drawn on the design, required by the durable movement rule, and was proved by no scenario |
| `grade10-admin-vault-operator-queue-SC-45` | Case added | `grade10-admin-vault-operator-queue-US4-TC8-1`: the held row's nine fields |
| `grade10-admin-vault-operator-queue-SC-39` | Reconciled | `grade10-admin-vault-operator-queue-US9-TC1-1`'s Out row: a check invited and not yet read as stalled reads Out, with the day it went and the two acts beside it |
| `grade10-admin-vault-operator-queue-US5-TC1-1`, `grade10-admin-vault-operator-queue-US5-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-24` |
| `grade10-admin-vault-operator-queue-US5-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-26` |
| `grade10-admin-vault-operator-queue-US5-TC4-1` | Covered | the requirement's own trail sentence names what kind of term it was, and the durable `grade10-admin-vault-operator-queue-SC-08` walks the entry a search writes |
| `grade10-admin-vault-operator-queue-US6-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-22` |
| `grade10-admin-vault-operator-queue-US6-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-21` |
| `grade10-admin-vault-operator-queue-US6-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-22` for the cut and its order, `grade10-admin-vault-operator-queue-SC-27` and `grade10-admin-vault-operator-queue-SC-28` for the row's word and reference |
| `grade10-admin-vault-operator-queue-US6-TC4-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-23` |
| `grade10-admin-vault-operator-queue-US6-TC5-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-21`, and the durable paging requirement's `grade10-admin-vault-operator-queue-SC-05` |
| `grade10-admin-vault-operator-queue-US6-TC6-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-06` |
| `grade10-admin-vault-operator-queue-SC-01` | Case added | `grade10-admin-vault-operator-queue-US6-TC7-1`: the Today cut on the shop's day while the date in Coordinated Universal Time is still yesterday's |
| `grade10-admin-vault-operator-queue-US7-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-30`; the seven steps are the ones board A03 names — Q55 |
| `grade10-admin-vault-operator-queue-US7-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-31` |
| `grade10-admin-vault-operator-queue-US7-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-32`; the storage lane walks six of the seven |
| `grade10-admin-vault-operator-queue-US7-TC4-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-33` |
| `grade10-admin-vault-operator-queue-US7-TC5-1` | Folded | `grade10-admin-vault-operator-queue-SC-50`: a step ticking on its act and handing the next one on was in the requirement's bullets and proved by no scenario |
| `grade10-admin-vault-operator-queue-US8-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-34` |
| `grade10-admin-vault-operator-queue-US8-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-35` |
| `grade10-admin-vault-operator-queue-US8-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-36` |
| `grade10-admin-vault-operator-queue-US8-TC4-1` | Folded | `grade10-admin-vault-operator-queue-SC-51`: forfeiture offered once no reason holds it — the requirement said so and no scenario walked it |
| `grade10-admin-vault-operator-queue-US8-TC5-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-38` |
| `grade10-admin-vault-operator-queue-US9-TC1-1` | Reconciled, corrected | `grade10-admin-vault-operator-queue-SC-41` and `grade10-admin-vault-operator-queue-SC-42`; its Out and Stalled rows both read a submitted check, and now read the identity check's own boundary — Q53 |
| `grade10-admin-vault-operator-queue-US9-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-41` |
| `grade10-admin-vault-operator-queue-US9-TC3-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-12`; the photograph's own read is `grade10-site/vault/identity-verification`'s `grade10-site-vault-identity-verification-SC-14` |
| `grade10-admin-vault-operator-queue-US9-TC4-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-40` |
| `grade10-admin-vault-operator-queue-US9-TC5-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-40`: the recording names the reason and who records over the refusal, so one carrying neither is not that act |
| `grade10-admin-vault-operator-queue-SC-52` | Case added | `grade10-admin-vault-operator-queue-US9-TC6-1`: Out until the identity check reads the submitted check as stalled |
| Raised: the Out → Stalled boundary | Answered | Q53: the boundary belongs to `grade10-site/e-kyc/hosted-verification`, which states it at its `grade10-site-e-kyc-hosted-verification-SC-22`; the panel's table, its new bullet and `grade10-admin-vault-operator-queue-SC-52` read that state rather than deciding one |
| Raised: three tiles or four | Answered | Q54: three, the first broken down per shop, each counting what the filter in force holds; the ui-design Tiles row and `grade10-admin-vault-operator-queue-SC-43` now agree |
| The visit checklist's steps | Answered | Q55: the seven board A03 names — identity, inspect and value, terms, explain key terms, prepare documents, hand over the link, vault the item; `grade10-admin-vault-operator-queue-SC-30` and `grade10-admin-vault-operator-queue-SC-32` take them |
| `grade10-admin-vault-operator-queue-SC-53` | Case added, added after the run | `grade10-admin-vault-operator-queue-US3-TC5-1`: the platform-wide second-factor rule corrected outside the blind pass — production required, staging optional for every brand, ZZZ included; `SC-14` retires with the requirement it named, and the twelve-hour scenario carries forward as `SC-54` |

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote 24 cases over three journeys and raised eleven questions for this capability; the scenario pass issued `grade10-admin-vault-operator-queue-SC-55` to `grade10-admin-vault-operator-queue-SC-73`, retired grade10-admin-vault-operator-queue-SC-20, and carried `grade10-admin-vault-operator-queue-SC-12` and `grade10-admin-vault-operator-queue-SC-13` in its MODIFIED block. Three scenarios were folded here, `grade10-admin-vault-operator-queue-SC-74` to `grade10-admin-vault-operator-queue-SC-76`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-vault-operator-queue-US10-TC1-1` | Joined | `grade10-admin-vault-operator-queue-SC-55`, with the handle `grade10-admin-vault-operator-queue-SC-64` states; the header's link is `grade10-admin/console/collector-page`'s |
| `grade10-admin-vault-operator-queue-US10-TC2-1` | Joined | `grade10-admin-vault-operator-queue-SC-56` and `grade10-admin-vault-operator-queue-SC-65` |
| `grade10-admin-vault-operator-queue-US10-TC3-1` | Joined | `grade10-admin-vault-operator-queue-SC-58`; the collector's own tick is still owed at the send, `grade10-site-vault-case-intake-SC-34` |
| `grade10-admin-vault-operator-queue-US10-TC4-1` | Joined | `grade10-admin-vault-operator-queue-SC-59` |
| `grade10-admin-vault-operator-queue-US10-TC5-1` | Joined | `grade10-admin-vault-operator-queue-SC-60` |
| `grade10-admin-vault-operator-queue-US10-TC6-1` | Joined | `grade10-admin-vault-operator-queue-SC-57`; the address is retyped in capitals with spaces, as `grade10-admin-vault-operator-queue-SC-74` walks |
| `grade10-admin-vault-operator-queue-US10-TC7-1` | Joined | `grade10-admin-vault-operator-queue-SC-61`; a row freeing a place on a send was dropped at review: the collector who sends has signed in, so the next walk-in at that address is refused as a signed-in address |
| `grade10-admin-vault-operator-queue-US10-TC8-1` | Joined | `grade10-admin-vault-operator-queue-SC-55`, nothing emailed to anybody |
| `grade10-admin-vault-operator-queue-US10-TC9-1` | Folded | `grade10-admin-vault-operator-queue-SC-75`: the walk-in requirement holds the photographs to the intake's rules, Q37, and no scenario walked the limit; the console takes the add control away at ten rather than refusing an eleventh by name, raised at review (owner-questions 14) |
| `grade10-admin-vault-operator-queue-US10-TC10-1` | Folded | `grade10-admin-vault-operator-queue-SC-76`: the requirement's refusal table refuses any fact the intake refuses and keeps the form, and no scenario walked it |
| `grade10-admin-vault-operator-queue-US10-TC11-1` | Joined | `grade10-admin-vault-operator-queue-SC-62` for the one draft; the pending form is the ui-design Opening row's, out of suite on the `WalkInDialog` story |
| `grade10-admin-vault-operator-queue-US10-TC12-1` | Joined | `grade10-admin-vault-operator-queue-SC-63`; the customer and signed-out rows read the console's own sign-in, unchanged |
| `grade10-admin-vault-operator-queue-US11-TC1-1` | Joined | `grade10-admin-vault-operator-queue-SC-66` and `grade10-admin-vault-operator-queue-SC-67`; the link beside the name is `grade10-admin-console-collector-page-SC-03` |
| `grade10-admin-vault-operator-queue-US11-TC2-1` | Joined | `grade10-admin-vault-operator-queue-SC-64` and `grade10-admin-vault-operator-queue-SC-68` |
| `grade10-admin-vault-operator-queue-US11-TC3-1` | Joined | `grade10-admin-vault-operator-queue-SC-69`, the short id narrowing and linking, Q41 |
| `grade10-admin-vault-operator-queue-US11-TC4-1` | Joined | `grade10-admin-vault-operator-queue-SC-70`; which journey owns it was settled as Q48 |
| `grade10-admin-vault-operator-queue-US11-TC5-1` | Joined | `grade10-admin-vault-operator-queue-SC-70`, the names refused by name |
| `grade10-admin-vault-operator-queue-US11-TC6-1` | Joined | the money book's durable requirement *The arrears list every live loan past its due date*, which names no collector and which this change leaves as it stands under Q3 |
| `grade10-admin-vault-operator-queue-US11-TC7-1` | Joined | `grade10-admin-vault-operator-queue-SC-81`; Q38 and Q55 record a page of names by ids, never names |
| `grade10-admin-vault-operator-queue-US12-TC1-1` | Joined | `grade10-admin-vault-operator-queue-SC-71` and `grade10-admin-vault-operator-queue-SC-72` |
| `grade10-admin-vault-operator-queue-US12-TC2-1` | Joined | `grade10-admin-vault-operator-queue-SC-72` |
| `grade10-admin-vault-operator-queue-US12-TC3-1` | Joined | `grade10-admin-vault-operator-queue-SC-73`: the held items narrowed to a collector holding none read as a cut holding none |
| `grade10-admin-vault-operator-queue-US12-TC4-1` | Joined | `grade10-admin-vault-operator-queue-SC-72` for no field to type a collector; a name finds no case by the durable search rule, exact on a contact and prefix on an id, Q5 |
| `grade10-admin-vault-operator-queue-US12-TC5-1` | Joined | `grade10-admin-vault-operator-queue-SC-82`, Q38 and Q55 |
| `grade10-admin-vault-operator-queue-SC-77` | Case added | `grade10-admin-vault-operator-queue-US12-TC6-1`, Q40 |
| `grade10-admin-vault-operator-queue-SC-78` | Case added | `grade10-admin-vault-operator-queue-US12-TC7-1`, Q39 |
| `grade10-admin-vault-operator-queue-SC-79` | Case added | `grade10-admin-vault-operator-queue-US10-TC13-1`, Q32 and Q54 |
| `grade10-admin-vault-operator-queue-SC-80` | Case added | `grade10-admin-vault-operator-queue-US10-TC14-1`: staff edit only an unsent draft staff opened, the rule the removed requirement held |
| `grade10-admin-vault-operator-queue-SC-09` | Modified | a list that names nobody records nothing; the durable `grade10-admin-vault-operator-queue-US2-TC7-1` still holds, its reader holding the vault read grant alone |
| `grade10-admin-vault-operator-queue-US2-TC7-1` | Modified at the acceptance review | its reader is now a treasurer on an unnarrowed queue, as `grade10-admin-vault-operator-queue-SC-09` reads, which shows no name, and its last line names the lists that do leave a trail |
| grade10-admin-vault-operator-queue-SC-20 | Retired | its requirement is removed for the walk-in, Q10; no case in the durable suite walked it, so none is deprecated |
| Raised: the fields and the photograph a walk-in needs to open | Settled | Q32; `grade10-admin-vault-operator-queue-SC-79` |
| Raised: an address in other capitals or with spaces | Settled, folded | Q33; `grade10-admin-vault-operator-queue-SC-74` walks a signed-in address retyped in capitals |
| Raised: what counts as signed in | Settled | Q34; no scenario beyond `grade10-admin-vault-operator-queue-SC-57` and `grade10-admin-vault-operator-queue-SC-56` |
| Raised: an email from the account's creation | Settled | Q35; `grade10-admin-vault-operator-queue-SC-55` already reads nothing emailed to anybody |
| Raised: how the statement shows it came first | Settled | Q36; `grade10-admin-vault-operator-queue-SC-58` |
| Raised: the walk-in's photograph limits | Settled, folded | Q37; `grade10-admin-vault-operator-queue-SC-75` |
| Raised: the audit entry for a named list | Settled | Q38 and Q55; `grade10-admin-vault-operator-queue-SC-81` and `grade10-admin-vault-operator-queue-SC-82` |
| Raised: how far the narrowing reaches | Settled | Q39; `grade10-admin-vault-operator-queue-SC-78` |
| Raised: a treasurer's or an unknown narrowed address | Settled | Q40; `grade10-admin-vault-operator-queue-SC-77` |
| Raised: the short id when a name is unavailable | Settled | Q41; `grade10-admin-vault-operator-queue-SC-69` |
| Raised: the collector page's control narrowing the queue | Settled | Q42; `grade10-admin-console-collector-page-SC-19` |
| Dev: no photograph needed to open a walk-in | Settled | Q32 |
| Dev: an audit entry for narrowing to one collector | Settled | Q38 |
| Dev: narrowing the Overdue view or search | Settled | Q39 |
| Dev: the short id's shape | Settled | Q50 |
| Design: Closed, Statement first, Empty, Opened, Signed-in address, Named, Name unavailable, Treasurer, Narrowed, Narrowed none | Closed on the row | `ui-design.md` names `grade10-admin-vault-operator-queue-SC-63`, `grade10-admin-vault-operator-queue-SC-58`, `grade10-admin-vault-operator-queue-SC-55`, `grade10-admin-vault-operator-queue-SC-57`, `grade10-admin-vault-operator-queue-SC-66`, `grade10-admin-vault-operator-queue-SC-69`, `grade10-admin-vault-operator-queue-SC-70`, `grade10-admin-vault-operator-queue-SC-71` and `grade10-admin-vault-operator-queue-SC-73` |
| Design: Photos added, Refused otherwise | Closed on the row | now `grade10-admin-vault-operator-queue-SC-75` and `grade10-admin-vault-operator-queue-SC-76`, the scenarios folded here |

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Operator Console and Items PRD pages, and the durable operator-queue suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md`, `ui-design.md` whole and the items delta. It is a statement, not proof.

- **Folded** - `grade10-admin-vault-operator-queue-US3-TC6-1` into `grade10-admin-vault-operator-queue-SC-83`, `grade10-admin-vault-operator-queue-SC-84` and `grade10-admin-vault-operator-queue-SC-85`, Edit offered on a vaulted case as Q22 allows; `grade10-admin-vault-operator-queue-US4-TC9-1` into `grade10-admin-vault-operator-queue-SC-87`, the linked item vaulted with no second record, beside `grade10-site-vault-case-lifecycle-SC-50`; `grade10-admin-vault-operator-queue-US20-TC1-1` into `grade10-admin-vault-operator-queue-SC-87`, its spaced lower-case row as Q48; `grade10-admin-vault-operator-queue-US20-TC2-1` into `grade10-admin-vault-operator-queue-SC-88`; `grade10-admin-vault-operator-queue-US20-TC3-1` into `grade10-admin-vault-operator-queue-SC-90`, whose Prepare documents half `grade10-site-vault-case-lifecycle-US3-TC6-1` walks; `grade10-admin-vault-operator-queue-US20-TC4-1` into `grade10-admin-vault-operator-queue-SC-91`; `grade10-admin-vault-operator-queue-US20-TC5-1` into `grade10-admin-vault-operator-queue-SC-89`; `grade10-admin-vault-operator-queue-US20-TC6-1` into `grade10-admin-vault-operator-queue-SC-92`; `grade10-admin-vault-operator-queue-US21-TC1-1` into `grade10-admin-vault-operator-queue-SC-83`; `grade10-admin-vault-operator-queue-US21-TC2-1` into `grade10-admin-vault-operator-queue-SC-84` and `grade10-admin-vault-operator-queue-SC-85`; `grade10-admin-vault-operator-queue-US21-TC3-1` into `grade10-admin-vault-operator-queue-SC-85`, its refused edit walked by `grade10-admin-inventory-items-US2-TC9-1`; `grade10-admin-vault-operator-queue-US21-TC4-1` into `grade10-admin-vault-operator-queue-SC-86`
- **Patched, not re-run** - `grade10-admin-vault-operator-queue-US20-TC5-1` goes on to the valuation and reads the new item, the second half of `grade10-admin-vault-operator-queue-SC-89`, as Q20 lets a retired cert name a new item
- **Added by QA2** - `grade10-admin-vault-operator-queue-US20-TC7-1` for `grade10-admin-vault-operator-queue-SC-93`, the slab named at Start valuation, which no blind case reached; `grade10-admin-vault-operator-queue-US21-TC5-1` for `grade10-admin-vault-operator-queue-SC-94`, the treasurer's Case tab, landed as Q44
- **Raised, answered by the round** - the treasurer's Case tab (Q44, `grade10-admin-vault-operator-queue-SC-94`); a retired cert at the walk-in (Q20: read as retired, a new item at the valuation, `grade10-admin-vault-operator-queue-SC-89`); where staff name the slab at Start valuation (Q21: the act's own dialog, now a design state anchored on `grade10-admin-vault-operator-queue-SC-93`); a cert in lower case or with spaces (Q48, `grade10-admin-vault-operator-queue-SC-87`)
- **Raised, escalated** - none
- **Round 4** - a slab is named by grader, grade and cert together: `grade10-admin-vault-operator-queue-SC-88` and `grade10-admin-vault-operator-queue-SC-93` now carry the grade, walked by `grade10-admin-vault-operator-queue-US20-TC2-1` and `grade10-admin-vault-operator-queue-US20-TC7-1`; the form fills the category and title only for the customer's own slab, `grade10-admin-vault-operator-queue-SC-87` in `grade10-admin-vault-operator-queue-US20-TC1-1`; another owner is named only behind `kyc:read`, else by short id, and fills nothing, `grade10-admin-vault-operator-queue-SC-90` in `grade10-admin-vault-operator-queue-US20-TC3-1`'s two rows
- **Rejected** - none
- **Contradicted** - none: every QA1 outcome agrees with the delta and `tech-design.md`'s lookup table
- **Uncovered anchors** - none: US-20 and US-21 have cases for every scenario, and the context journeys US-03 and US-04 each gain one

**Run:** QA2, 2026-10-02. QA1's blind pass read only the capability's `## Purpose` and `## Feature set` with the change's leaves, the US-10 journey, `proposal.md`, `decisions.md` as it stood before Q3 was clarified and Q6 and Q7 were added, the Operator Console page's walk-in lines, the durable suite's US10 section and `## Settled`, and the two rulebooks; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, the code and `openspec/changes/archive/`. It revised `grade10-admin-vault-operator-queue-US10-TC9-1` into `grade10-admin-vault-operator-queue-US10-TC9-2`, wrote `grade10-admin-vault-operator-queue-US10-TC15-1`, and raised three questions. After it ran, Q3 was clarified to hold Open case while the refusal stands, and Q6 and Q7 were added from its questions; these are non-anchor clarifications. QA2 read QA1's suite, the delta spec, `decisions.md`, `tech-design.md`, `tasks.md`, the durable spec and suite, and grade10's `WalkInDialog.tsx` and its test, `FormDialog.tsx`, `vocabulary.tsx`, `EMAIL_PATTERN` in `packages/utils/src/schema.ts` and `walk-in.spec.ts`. It is a statement, not proof.

- **Raised, answered** - all three rows, landed as Q6, Q7 and Q3: an empty address is not refused and Open case waits for one, now `grade10-admin-vault-operator-queue-US10-TC15-1` step 1; the refusal clears while staff retype, now step 5, which read the clearing only after Tab; Open case stays unavailable while the refusal stands, now step 4
- **Raised, escalated** - none
- **Raised, rejected** - none
- **Revised** - `grade10-admin-vault-operator-queue-US10-TC9-2` replaces `grade10-admin-vault-operator-queue-US10-TC9-1` for the revised `grade10-admin-vault-operator-queue-SC-75`: ten photographs and no way to add an eleventh, where the old case attached an eleventh and read a refusal (Q5). It keeps its walk; tasks 3.1 re-keys the walk's test to it
- **Joined** - `grade10-admin-vault-operator-queue-SC-95` and the refusal table's Not an email address row into `grade10-admin-vault-operator-queue-US10-TC15-1`
- **Corrected** - `grade10-admin-vault-operator-queue-US10-TC15-1`'s `@example.com` row left the field by clicking Open case, and a step clicked it to send nothing. Under Q3 Open case is disabled while the address is refused, and whether a click on a disabled button leaves the field differs by browser. The row now leaves by clicking the Title field, and step 4 tries the click and reads the button disabled. The pre-condition and result about no account for the malformed address are dropped: nothing can be sent
- **Added by QA2** - the row `mei.chan@example`, the address `grade10-admin-vault-operator-queue-SC-95` names, which the three QA1 rows did not reach; step 1, the empty address left by Tab, for Q6
- **Contradicted** - none: every QA1 outcome agrees with the delta, `tech-design.md` and the worker's address rule
- **Uncovered anchors** - none: `grade10-admin-vault-operator-queue-SC-75` by `grade10-admin-vault-operator-queue-US10-TC9-2`, `grade10-admin-vault-operator-queue-SC-95` by `grade10-admin-vault-operator-queue-US10-TC15-1`, and the Feature set's two new leaves by the same two cases

**Run:** QA2, 2026-10-02. QA1's blind pass read only the capability's `## Purpose` and `## Feature set` with the change's leaf, the US-10 journey, `proposal.md`, `decisions.md` with Q1 to Q7, the Operator Console and Collector Pages manual pages, and the durable suite's US10 section and `## Settled`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, the code and `openspec/changes/archive/`. It wrote `grade10-admin-vault-operator-queue-US10-TC16-1` and raised three questions, landed as Q8, Q9 and Q10. After it ran, Q11 moved case intake's rule to the lane requirement; these are non-anchor clarifications. QA2 read QA1's suites, both delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites of both capabilities, and grade10's `WalkInDialog.tsx` and its test, `MoneyField.tsx`, `parseMinorUnits` in `packages/utils/src/money.ts`, `positiveMinorAmount` and `intakeInputSchema` in `packages/vault/contracts/src/schemas.ts`, and `walk-in.spec.ts`. It is a statement, not proof.

- **Raised, answered** - all three rows: Q8, storage only chosen while the refusal shows, now `grade10-admin-vault-operator-queue-US10-TC17-1`; Q9, a minus sign, and Q10, an amount finer than HKD's minor unit, now the two rows of `grade10-admin-vault-operator-queue-US10-TC18-1`, the money field's own words and never the loan-of-zero refusal. The answers are in `## Settled`. Q10 was raised from case intake as well, and its suite records it there
- **Raised, escalated** - none
- **Raised, rejected** - none
- **Revised** - none
- **Joined** - `grade10-admin-vault-operator-queue-SC-96`, the refusal table's A loan of zero row and the Feature set's A loan of zero leaf into `grade10-admin-vault-operator-queue-US10-TC16-1`, with `grade10-admin-vault-operator-queue-US10-TC17-1` and `grade10-admin-vault-operator-queue-US10-TC18-1` beside it
- **Corrected** - `grade10-admin-vault-operator-queue-US10-TC16-1` read no refusal while `0.50` was typed, `0.` included. `MoneyField` refuses `0.` as it is typed, in its own words, until the next digit, so that step could not pass. The partial amount is dropped: the zero itself, typed one character at a time, shows no loan-of-zero refusal before the field is left, which is Q4's claim, and the `0.00` row names the field's own words at `0.`. Open case reads disabled rather than unavailable, as `grade10-admin-vault-operator-queue-US10-TC15-1` reads it
- **Added by QA2** - in `grade10-admin-vault-operator-queue-US10-TC16-1`, steps 6 to 8: a second zero shows nothing until the field is left again, and an amount more than zero clears the refusal with the field not left, both of which the refusal table's row states and the case read only by emptying the field; `grade10-admin-vault-operator-queue-US10-TC17-1` for Q8; `grade10-admin-vault-operator-queue-US10-TC18-1` for Q9 and Q10
- **Contradicted** - `grade10-admin-vault-operator-queue-US10-TC17-1`, QA2's own addition, read the refusal back at once when a loan is chosen again; a loan field built again is untouched, so the console draws no refusal until it is typed in or left, and a refusal drawn on the first keystroke would break Q4. Q8 now clears the refusal on a lane change and keeps the amount, and the case leaves the field to read it again. Otherwise every QA1 outcome agrees with the delta, `tech-design.md` and the worker's amount rule, but for the `0.` keystroke corrected above, which is the money field's standing behaviour and no scenario's
- **Uncovered anchors** - none: `grade10-admin-vault-operator-queue-SC-96` by `grade10-admin-vault-operator-queue-US10-TC16-1`, and the Feature set's new leaf by `grade10-admin-vault-operator-queue-US10-TC16-1`, `grade10-admin-vault-operator-queue-US10-TC17-1` and `grade10-admin-vault-operator-queue-US10-TC18-1`

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-vault-operator-queue-US1-TC3-1` | The walk proves the lapsed-offer row alone; the stalled-valuation row needs the case's own clock moved seven days, and the parked-message and document-seen-before rows need a message the retry ladder has given up on and a document seen under another account — a person drives these |
| `grade10-admin-vault-operator-queue-US9-TC1-1` | Only the provider puts a check into its own stages, so a person drives a sandbox check to stand a case at each of the six states and reads the panel against them |
| `grade10-admin-vault-operator-queue-US9-TC4-1` | Only the provider sandbox puts a check into Refused; a person drives it there and records the override with its reason |
| `grade10-admin-vault-operator-queue-US9-TC5-1` | As above, recorded with no reason |
| `grade10-admin-vault-operator-queue-US9-TC6-1` | The boundary moves when the identity check reads the submitted check as stalled; a person waits that period out in the sandbox, or moves the clock, and reads the panel on both sides of it |
| `grade10-admin-vault-operator-queue-US10-TC3-1` | Deferred at review: the open keeps the statement's version where the page does not show it; a person reads the draft's history once the case says where |
| `grade10-admin-vault-operator-queue-US10-TC4-1` | A person reads that the form asks for no name and no contact number; the walk-in walk opens a draft without them, it does not read the form's fields |
| `grade10-admin-vault-operator-queue-US10-TC10-1` | A person types a title and a description past their limits; no walk takes them |
| `grade10-admin-vault-operator-queue-US10-TC12-1` | Layer api: the worker's own test refuses the open without vault:operate; the treasurer's console offers no walk-in to press |
| `grade10-admin-vault-operator-queue-US10-TC14-1` | A person edits a sent walk-in and a draft the collector opened to see both refused; the walk-in walk edits only an unsent draft staff opened |
| `grade10-admin-vault-operator-queue-US11-TC5-1` | Layer api: the vault worker's test refuses the names read without kyc:read |
| `grade10-admin-vault-operator-queue-US11-TC6-1` | No walk reaches an overdue row; a person reads the Overdue view with a loan past due and finds no name |
| `grade10-admin-vault-operator-queue-US12-TC7-1` | A person reads Overdue and a search with a collector in the address; the collectors walk narrows the cuts and Held items, never Overdue or a search |
| `grade10-admin-vault-operator-queue-US10-TC6-1` | The walk proves the refusal for an address retyped in capitals and spaces, and nothing mailed; a person checks no second account was made for the address |
