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

### grade10-admin-vault-operator-queue-US1-TC4-1: Valuation-stalled badge appears at the 7-day boundary, not before

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
| Just under the limit | 6 days 23 hours | absent |
| At the limit | 7 days | present |

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
| a hosted check invited, started or submitted | Out | Send again, Record at the counter |
| a hosted check submitted and undecided | Stalled | Record at the counter, Send again |
| the last hosted check declined | Refused | Record at the counter |
| the last hosted check expired or withdrawn | Lapsed | Send hosted check, Record at the counter |

**Steps:**

1. Open the Documents tab.

**Expected Results:**

* The identity panel reads the state named in **Test data**, and offers the acts named.
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
