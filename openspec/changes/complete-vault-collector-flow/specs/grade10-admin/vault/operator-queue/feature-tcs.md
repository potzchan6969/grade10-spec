# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-01

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and a case's collector is reachable at a known phone number.

**Test data:**

| Typed as |
| --- |
| with spaces between the groups |
| with a leading + and the country code |
| with the country code's leading zeros instead of + |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>, and no search has been run this session.

**Steps:**

1. Open a queue view and read its rows.
2. Read the case audit trail for the entries written since step 1.

**Expected Results:**

* No audit entry is written for the read.
* Only a search, never a listing, leaves a trail.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case at the status named in **Test data**.

**Test data:**

| Status | Acts offered |
| --- | --- |
| submitted | start valuation |
| offer_made | accept the offer, decline, withdraw the offer |
| vaulted | move the item, release with notes, unwind, send the forfeiture notice |

**Steps:**

1. Read the acts the Case tab offers.

**Expected Results:**

* Only the acts named in **Test data** are offered.

### grade10-admin-vault-operator-queue-US3-TC3-1: A withheld act names what it is waiting for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on the Case tab of a case whose page has not re-read since the case's status changed underneath it.

**Steps:**

1. Send the act the stale page still offers.

**Expected Results:**

* The worker refuses the act.
* The page re-reads and no longer offers it.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-04

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-05

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-06

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-07

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-08

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-09

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

## Settled

- The boundary between Out and Stalled is `grade10-site/e-kyc/hosted-verification`'s, not the console's: the panel reads the state that capability holds and decides none of its own.
- The held list carries three figures, the first broken down by shop, each counting everything the filter in force holds; there is no fourth figure counting shops.
- The visit checklist walks the seven steps the counter works, six of them on a case that borrows nothing.
- A pending or failed read is the panel's own status rather than a rule, so no scenario is owed for it.
- A reference search leaves the same trail as any other search: the trail rule already names what kind of term it was, and no scenario of its own is owed for the reference.
- A term of two to six characters of the reference's alphabet is searched as a reference and one of seven or more as a case-id prefix, so one term is never both kinds.

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
| `grade10-admin-vault-operator-queue-US2-TC3-1` | Folded | `grade10-admin-vault-operator-queue-SC-47`: the case-id prefix was required and proved by no scenario |
| `grade10-admin-vault-operator-queue-US2-TC4-1` | Folded | `grade10-admin-vault-operator-queue-SC-48`: the refusal to match part of a contact column, likewise |
| `grade10-admin-vault-operator-queue-US2-TC5-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-26` |
| `grade10-admin-vault-operator-queue-US2-TC6-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-08` |
| `grade10-admin-vault-operator-queue-SC-09` | Case added | `grade10-admin-vault-operator-queue-US2-TC7-1`: reading the queue writes no audit entry |
| `grade10-admin-vault-operator-queue-US3-TC1-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-12` |
| `grade10-admin-vault-operator-queue-US3-TC2-1` | Reconciled | `grade10-admin-vault-operator-queue-SC-10` |
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

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-vault-operator-queue-US9-TC1-1` | Only the provider puts a check into its own stages, so a person drives a sandbox check to stand a case at each of the six states and reads the panel against them |
| `grade10-admin-vault-operator-queue-US9-TC6-1` | The boundary moves when the identity check reads the submitted check as stalled; a person waits that period out in the sandbox, or moves the clock, and reads the panel on both sides of it |
