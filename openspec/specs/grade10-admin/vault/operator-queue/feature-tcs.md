# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-admin-vault-operator-queue-US1: Operator opens the shop and sees what is waiting

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each case is waiting for, with today's visits and a badge saying why a case needs me,
**so that** I can work the counter without being emailed anything.

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

---

## grade10-admin-vault-operator-queue-US4: Operator takes an item in and can say where it is

**As a** member of shop staff,
**I want** to name the shop and locker when I take an item in, and to list everything we hold,
**so that** anybody can be told which vault an item is sitting in.

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

---

## grade10-admin-vault-operator-queue-US5: Operator finds the case by the reference read out

**As a** member of shop staff,
**I want** the six characters a customer reads out to find their case,
**so that** I need not ask for their phone number or email.

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

### grade10-admin-vault-operator-queue-US10-TC1-1: A walk-in for a new address opens a draft under a new account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* No account exists for `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.new+<run id>@example.com` |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |
| Amount | 500000 (HKD, minor units) |
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

### grade10-admin-vault-operator-queue-US10-TC2-1: A walk-in for an address nobody has signed in to opens under that account and renames nothing

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
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

### grade10-admin-vault-operator-queue-US10-TC4-1: Production refuses a walk-in while the collection statement is unwritten

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-admin-vault-operator-queue-US10-TC5-1: Outside production an unwritten statement reads Being prepared and the walk-in opens

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url> in staging, with no collection statement text written.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Read the statement the form shows.
3. Fill in the form for `<walk-in email>` with one photograph and click Open case.

**Expected Results:**

* Step 2 reads "Being prepared".
* Step 3 opens the draft on its own page.

### grade10-admin-vault-operator-queue-US10-TC6-1: A walk-in for an address someone has signed in to is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* `<account_2>`: an account for `<signed-in email>` that its owner has signed in to at least once, carrying the name `<held name>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<signed-in email>` | the address of `<account_2>` |
| `<held name>` | Wong Siu Ming |
| Title | Blastoise Base Set |
| Photos | one JPEG photograph |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<signed-in email>` from **Test data** and attach the photograph.
3. Click Open case.

**Expected Results:**

* A notice says the address has signed in before, and that this customer sends the request from their own phone.
* The notice names nothing else about the account: not `<held name>`, not its cases.
* The form keeps the email, the facts and the photograph typed.
* No draft is opened under `<account_2>`, and nothing is emailed to `<signed-in email>`.

### grade10-admin-vault-operator-queue-US10-TC7-1: A walk-in counts against the account's three unsent drafts

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The account for `<walk-in email>` has nobody signed in to it and holds the unsent drafts in the row.

**Test data:**

| Unsent drafts already held | Outcome |
| --- | --- |
| two drafts staff opened | the draft opens; the account now holds three |
| three drafts staff opened | refused with the draft cap's refusal; no draft opens |
| three drafts, then one of them sent by its collector | the draft opens |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<walk-in email>` with one photograph.
3. Click Open case.

**Expected Results:**

* The outcome matches the row.
* A refusal reads as the cap's own refusal, not a walk-in refusal of its own.

### grade10-admin-vault-operator-queue-US10-TC8-1: Opening a walk-in emails nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* `<walk-in email>` is a mailbox the tester reads, with no account behind it.

**Steps:**

1. Open a walk-in for `<walk-in email>` with one photograph.
2. Wait <mail delivery window>.
3. Read `<walk-in email>`'s inbox.
4. Read the draft's page for a parked or owed message.

**Expected Results:**

* Step 3 finds no message about the case: no case, no reference, no sign-in link.
* Step 4 shows no message owed or parked for the draft.

### grade10-admin-vault-operator-queue-US10-TC9-1: Photos on the walk-in form count to ten and can be removed

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>.

**Test data:**

| Field | Value |
| --- | --- |
| Photos | eleven JPEG photographs, each under 20 MB |

**Steps:**

1. Attach ten photographs.
2. Attach the eleventh.
3. Remove one photograph.

**Expected Results:**

* Step 1 shows the ten in the gallery, reading 10 of 10.
* Step 2 is refused at the limit; the gallery still holds ten.
* Step 3 leaves nine, reading 9 of 10.

### grade10-admin-vault-operator-queue-US10-TC10-1: The worker's refusal of a field reads beside that field

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* Every field but the row's is filled in validly, with one photograph.

**Test data:**

| Field | Value | Refused beside |
| --- | --- | --- |
| Email | `not-an-address` | Email |
| Title | 201 characters | Title |
| Description | 2,001 characters | Description |

**Steps:**

1. Enter the row's value.
2. Click Open case.

**Expected Results:**

* Open case is refused, the refusal in words beside the field in the row.
* The rest of the form keeps what was typed.
* No draft opens.

### grade10-admin-vault-operator-queue-US10-TC11-1: Opening holds the form and opens one draft

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

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

### grade10-admin-vault-operator-queue-US10-TC12-1: Only an operate holder can open a walk-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* The row's actor is on <grade10 admin vault queue url>, or calls the walk-in open directly where the row says so.

**Test data:**

| Actor | Open a walk-in shown | A direct walk-in call |
| --- | --- | --- |
| admin(staff, holds vault:operate) | yes | opens the draft |
| admin(admin) | yes | opens the draft |
| admin(treasurer, holds vault:read and vault:payout) | no | refused for the missing grant |
| admin(holds vault:read only) | no | refused for the missing grant |
| customer(collector), signed in on the site | no console | refused |
| signed out | the console's sign-in | refused |

**Steps:**

1. Read the queue's header.
2. Send a walk-in open for a fresh address with one photograph, by the console where shown, else by a direct call.

**Expected Results:**

* Step 1 matches the row's Open a walk-in shown.
* Step 2 matches the row's direct call; a refusal opens no draft and creates no account.

### grade10-admin-vault-operator-queue-US10-TC13-1: A walk-in opens with no photograph and the send still needs one

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, and no account answers to `tai.man@example.com`.

**Steps:**

1. Open a walk-in for `tai.man@example.com` with category Trading card, title `Charizard PSA 10` and no photograph.
2. As the customer, signed in at `tai.man@example.com`, open the draft and send it.

**Expected Results:**

* Step 1 opens the draft, and the form asked for no contact number.
* Step 2 is refused until the draft holds a photograph.

### grade10-admin-vault-operator-queue-US10-TC14-1: Staff photograph only an unsent draft staff opened

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

---

## grade10-admin-vault-operator-queue-US11: Operator reads whose case it is by name

**As a** member of shop staff,
**I want** the queue and the held items to name each case's collector,
**so that** I can greet the customer and tell two customers' cases apart
without opening each one.

### grade10-admin-vault-operator-queue-US11-TC1-1: Queue and held-item rows name each case's collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

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
* Each name narrows the list to its collector, and a link beside it opens that collector's page.
* The rest of each row reads as before.

### grade10-admin-vault-operator-queue-US11-TC2-1: An account the walk-in created reads by its email handle until the customer names themselves

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
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* A walk-in draft sits under an account the walk-in created for `mei.ling.walkin@example.com`, nobody signed in to it yet.

**Steps:**

1. Open the Drafts view and read the draft's collector.
2. As the customer, sign in at `grade10.com/vault` with that address and set the account's name to Ho Mei Ling.
3. Reload the Drafts view and read the draft's collector.

**Expected Results:**

* Step 1 reads `mei.ling.walkin`.
* Step 3 reads Ho Mei Ling, with no change made on the case.

### grade10-admin-vault-operator-queue-US11-TC3-1: A name the account service cannot answer reads as unavailable and the list stands

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
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, the Needs staff view holding cases of several collectors.
* The account service fails to answer names.

**Steps:**

1. Open the Needs staff view.
2. Open the Held items tab.

**Expected Results:**

* Every row's collector reads the account's short id and "name unavailable".
* Every other field on every row reads as it does with names answered, and both lists load in full.
* Following a row's short id narrows the list to that collector and offers the link to their collector page.

### grade10-admin-vault-operator-queue-US11-TC4-1: A reader without the identity grant sees no collector column

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* The row's actor is on <grade10 admin vault queue url>, with cases of several collectors in the Needs staff view and the Held items tab.

**Test data:**

| Actor |
| --- |
| admin(treasurer, holds vault:read and vault:payout) |
| admin(holds vault:read only) |

**Steps:**

1. Open the Needs staff view.
2. Open the Held items tab.
3. Read each list's response in the browser's network panel.

**Expected Results:**

* Neither list carries a collector column, a name or a name link.
* Every other field reads as before this change.
* The read carries no collector name.

### grade10-admin-vault-operator-queue-US11-TC5-1: The collector-name read refuses a caller without the identity grant

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
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) holds a verified console session.
* `<case_1>` is a case of a collector with a name.

**Steps:**

1. Call the collector-name read for `<case_1>` directly.

**Expected Results:**

* The call is refused for the missing identity grant.
* No name comes back.

### grade10-admin-vault-operator-queue-US11-TC6-1: The overdue rows keep the reference and the contact, with no name

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
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

### grade10-admin-vault-operator-queue-US11-TC7-1: A list that names collectors is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and the Needs staff view holds cases of two named collectors.

**Steps:**

1. Open the Needs staff view.
2. Read the audit chain for entries written since step 1.

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

### grade10-admin-vault-operator-queue-US12-TC1-1: A collector's name narrows the list to that collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

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

### grade10-admin-vault-operator-queue-US12-TC2-1: A narrowed address opened afresh narrows the same way

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) holds `<narrowed url>`, the Needs staff view narrowed to `<collector_A>`, copied from a prior session.
* `<collector_A>` holds two cases in the Needs staff view.

**Steps:**

1. Open `<narrowed url>` in a new tab.

**Expected Results:**

* The view lists only `<collector_A>`'s two rows, with their name above them and a count of 2.

### grade10-admin-vault-operator-queue-US12-TC3-1: A collector with nothing in the narrowed list reads none

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
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_C>` holds one submitted case and no item in the vault.

**Steps:**

1. In the Needs staff view, click `<collector_C>`'s name.
2. Open the Held items tab narrowed to `<collector_C>`.

**Expected Results:**

* Step 2 says the collector holds no case in this list, with their name above and a count of 0.
* The control clearing the collector is still offered.

### grade10-admin-vault-operator-queue-US12-TC4-1: The queue offers no way to find a collector by name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds a case in the Needs staff view.

**Steps:**

1. Look for a field taking a collector or a name on the queue and the Held items tab.
2. Type `Chan Tai Man` into the queue's search and search.

**Expected Results:**

* Step 1 finds no field to type a collector into.
* Step 2 finds no case.

### grade10-admin-vault-operator-queue-US12-TC5-1: Reading one collector's cases is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and `<collector_A>` holds a case in the Needs staff view.

**Steps:**

1. Click `<collector_A>`'s name.
2. Read the audit chain for entries written since step 1.

**Expected Results:**

* One entry records who read `<collector_A>`'s cases, when, and `<collector_A>`'s id.
* No name or email appears in any column of it.

### grade10-admin-vault-operator-queue-US12-TC6-1: An address narrowed to nobody reads as a collector holding no case

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
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.

**Test data:**

| Collector in the address |
| --- |
| a well-formed user id no account holds |
| `not-a-user-id` |

**Steps:**

1. Open the queue at an address narrowed to the row's collector.

**Expected Results:**

* Every cut says the collector holds no case in it, and every count reads none.

### grade10-admin-vault-operator-queue-US12-TC7-1: The Overdue view stays whole while the queue is narrowed

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
| `grade10-admin-vault-operator-queue-US10-TC6-1` | Joined | `grade10-admin-vault-operator-queue-SC-57` |
| `grade10-admin-vault-operator-queue-US10-TC7-1` | Joined | `grade10-admin-vault-operator-queue-SC-61`; the row freeing a place on a send reads the cap requirement's own sentence in `grade10-site/vault/case-intake` |
| `grade10-admin-vault-operator-queue-US10-TC8-1` | Joined | `grade10-admin-vault-operator-queue-SC-55`, nothing emailed to anybody |
| `grade10-admin-vault-operator-queue-US10-TC9-1` | Folded | `grade10-admin-vault-operator-queue-SC-75`: the walk-in requirement holds the photographs to the intake's rules, Q37, and no scenario walked the limit |
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

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-vault-operator-queue-US1-TC3-1` | The walk proves the lapsed-offer row alone; the stalled-valuation row needs the case's own clock moved seven days, and the parked-message and document-seen-before rows need a message the retry ladder has given up on and a document seen under another account — a person drives these |
| `grade10-admin-vault-operator-queue-US9-TC1-1` | Only the provider puts a check into its own stages, so a person drives a sandbox check to stand a case at each of the six states and reads the panel against them |
| `grade10-admin-vault-operator-queue-US9-TC4-1` | Only the provider sandbox puts a check into Refused; a person drives it there and records the override with its reason |
| `grade10-admin-vault-operator-queue-US9-TC5-1` | As above, recorded with no reason |
| `grade10-admin-vault-operator-queue-US9-TC6-1` | The boundary moves when the identity check reads the submitted check as stalled; a person waits that period out in the sandbox, or moves the clock, and reads the panel on both sides of it |
