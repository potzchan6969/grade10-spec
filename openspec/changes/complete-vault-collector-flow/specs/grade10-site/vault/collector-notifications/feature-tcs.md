# grade10-site/vault/collector-notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-vault-collector-notifications-US1: Borrower is warned before the due date and while it runs late

**As a** borrower,
**I want** a message a week and a day before my loan is due, and one every
week it stays late,
**so that** I know what I owe and what a late week costs before anything is
taken.

### grade10-site-vault-collector-notifications-US1-TC1-1: Reminder is sent before the due date at both scheduled points

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-01

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose due date is <the due date>.

**Test data:**

| Reminder | Timing |
| --- | --- |
| Due-date warning | 7 days before <the due date> |
| Final warning | 1 day before <the due date> |

**Steps:**

1. The reminder sweep runs at <Timing>.

**Expected Results:**

* The borrower receives a reminder email.
* The email names the amount owed and <the due date>.

### grade10-site-vault-collector-notifications-US1-TC2-1: Reminder is sent every seven days while the loan is overdue

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
* **Trace:** grade10-site-vault-collector-notifications-US-01

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose due date is <the due date> and has passed with nothing repaid.

**Test data:**

| Rung | Days overdue |
| --- | --- |
| First overdue reminder | 7 |
| Second overdue reminder | 14 |

**Steps:**

1. The reminder sweep runs at <Days overdue> days after <the due date>.

**Expected Results:**

* The borrower receives an overdue reminder email.
* The email names the outstanding balance and that interest keeps accruing at the same daily rate.

### grade10-site-vault-collector-notifications-US1-TC3-1: The reminder ladder stops once a forfeiture notice is sent

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
* **Trace:** grade10-site-vault-collector-notifications-US-01

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose forfeiture notice has already been sent.
* The case reaches the day its next overdue reminder would otherwise fire.

**Steps:**

1. The reminder sweep runs on that day.

**Expected Results:**

* No further reminder email is sent.
* The forfeiture notice remains the last message the borrower was sent.

---

## grade10-site-vault-collector-notifications-US2: Collector hears about everything that happens to their case

**As a** collector,
**I want** a message for each thing that happens to my case, with a link
straight to it,
**so that** I never have to ask the shop what stage my item is at.

### grade10-site-vault-collector-notifications-US2-TC1-1: A message's link opens the case at its own address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* customer(collector) has a case that has already sent at least one message.

**Steps:**

1. Open the email the collector received.
2. Click the message's link to the case.

**Expected Results:**

* The browser opens the case's own address.
* The case shown is the one the message was about.

### grade10-site-vault-collector-notifications-US2-TC2-1: An event decided silent sends no message to the collector

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* customer(collector) has a case that reaches an event kind the notification map decides silent.

**Steps:**

1. The event occurs on the case.
2. admin(holds vault:operate) opens the case's Custody tab on <grade10 vault admin case url> and reads what the collector was told.

**Expected Results:**

* No entry appears for the event.
* No email is queued for it.

### grade10-site-vault-collector-notifications-US2-TC3-1: A parked message is handed back to the queue and sent

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* A message on the case is parked, badged for staff, with its reason recorded.
* admin(holds vault:operate) is on <grade10 vault admin case url>.

**Steps:**

1. Click Send again beside the parked message.
2. The retry sweep runs.

**Expected Results:**

* The message no longer shows as parked.
* The collector receives the message.

### grade10-site-vault-collector-notifications-US2-TC4-1: The signed document set is delivered once per packet

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The case's signed packet has already been mailed to its signer.

**Steps:**

1. The notification sweep runs again over the same packet.

**Expected Results:**

* No second copy of the signed set is sent.
* The packet's delivery claim still names its first successful send.

### grade10-site-vault-collector-notifications-US2-TC5-1: A message still sends when its documents cannot attach

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The case's signed-set message is being sent.
* The documents cannot be attached.

**Steps:**

1. The send attempt runs.

**Expected Results:**

* The message still sends.
* The message links to the case's own address instead of carrying the documents.

### grade10-site-vault-collector-notifications-US2-TC6-1: A message reads the case as it stands when sent

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The case's item title changed after a message was queued for it but before it sent.

**Steps:**

1. The send attempt runs after the change.

**Expected Results:**

* The message's address, item title and currency match the case as it now stands, not as it stood when queued.

### grade10-site-vault-collector-notifications-US2-TC7-1: WhatsApp opens only when staff press its link

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The case has a WhatsApp number on file.
* admin(holds vault:operate) is on <grade10 vault admin case url>.

**Steps:**

1. Click the case header's WhatsApp click-to-chat link.
2. Choose one of the six templates.

**Expected Results:**

* The chat app opens pre-filled with the chosen template, addressed to the collector's WhatsApp number.
* No message is queued or sent by the vault's own notification system.

### grade10-site-vault-collector-notifications-US2-TC8-1: A failed send retries on the five-attempt ladder

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* A message the vault owes on the case fails to send on its first attempt.

**Test data:**

| Attempt | Spacing |
| --- | --- |
| 1 | 5 minutes after the failure |
| 5 | up to 6 hours after the failure |

**Steps:**

1. The retry sweep reaches <Attempt> at <Spacing>.

**Expected Results:**

* The message is attempted again.
* The message remains owed rather than closed off.

### grade10-site-vault-collector-notifications-US2-TC9-1: A message exhausting the ladder is parked and badged

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* A message the vault owes on the case has failed on all 5 rungs of the ladder.

**Steps:**

1. The fifth attempt fails.

**Expected Results:**

* The message is parked with the reason it failed.
* The case badges for staff.

### grade10-site-vault-collector-notifications-US2-TC10-1: A hanging send gives up at ten seconds

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* A message the vault owes on the case is sent to a provider that never responds.

**Steps:**

1. The send attempt passes 10 seconds with no response.

**Expected Results:**

* The attempt is treated as failed.
* The message re-enters the retry ladder.

### grade10-site-vault-collector-notifications-US2-TC11-1: A case with no address is counted, not mailed

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The case has no email address on file.
* An event that would send a message occurs on the case.

**Steps:**

1. The event occurs.

**Expected Results:**

* No email is attempted.
* The event is counted as one the vault could not tell the collector, rather than as a send.

---

## grade10-site-vault-collector-notifications-US5: Borrower reads the figures in the message itself

**As a** borrower,
**I want** every money message to table the amount, the date, what a late day
costs and how to pay, and the notice to name the clause, the date to pay by
and that a person decides,
**so that** the message is a record I can act on without opening the page.

### grade10-site-vault-collector-notifications-US5-TC1-1: A money message tables its figures instead of prose

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose loan is active.

**Steps:**

1. Open a money message the borrower receives on the case.

**Expected Results:**

* The amount, the due date and what a late day costs appear as a table.
* The figures do not also appear written into a sentence elsewhere in the message.

### grade10-site-vault-collector-notifications-US5-TC2-1: A money message carries the loan's own how-to-pay block

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose loan is active.

**Steps:**

1. Open a money message the borrower receives on the case.
2. Compare its how-to-pay block with the block shown on the case's own address.

**Expected Results:**

* Both blocks name the same FPS id, bank account and the case reference as the transfer reference.

### grade10-site-vault-collector-notifications-US5-TC3-1: A reminder states its own schedule and that it is free

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* customer(borrower with a live loan) has a case that receives a reminder.

**Steps:**

1. Open the reminder email the borrower receives.

**Expected Results:**

* The email states when the borrower will hear from the vault next.
* The email states that a reminder costs nothing.

### grade10-site-vault-collector-notifications-US5-TC4-1: The forfeiture notice names its clause, date and consequence

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose forfeiture notice has been sent.

**Steps:**

1. Open the forfeiture notice email the borrower receives.

**Expected Results:**

* The email names the clause it acts under and the date to pay by.
* The email states what each further day adds and the condition the item lapses on.
* The email states that taking the item is a person's decision, and that no further reminder follows.

### grade10-site-vault-collector-notifications-US5-TC5-1: Every message carries the case line and lender footer

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* customer(borrower with a live loan) has a case that receives a message.

**Steps:**

1. Open a message the borrower receives on the case.

**Expected Results:**

* The message carries the case reference and the item.
* The footer names the sending party under its registered name, the licence line and the complaints contact.

### grade10-site-vault-collector-notifications-US5-TC6-1: An unset value prints as a marked placeholder outside production

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The environment is outside production.
* A value a message would print is unset.

**Steps:**

1. The message renders.

**Expected Results:**

* The unset value prints as a bracketed, marked placeholder.
* The message still sends.

### grade10-site-vault-collector-notifications-US5-TC7-1: Production refuses a message that would print an unset value

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The environment is production.
* A value a money message or the forfeiture notice would print is unset.

**Steps:**

1. The send attempt for the message runs.

**Expected Results:**

* The act is refused before anything is written or sent.
* No message carrying the unset value reaches the borrower.

---

## grade10-site-vault-collector-notifications-US6: Collector is invited to verify before the visit

**As a** collector with a visit booked and no identity on file,
**I want** the invitation to name the visit, the slot and what to bring,
**so that** I can verify at home and turn up prepared.

### grade10-site-vault-collector-notifications-US6-TC1-1: The invitation names the visit's shop, slot and checklist

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-06

**Pre-conditions:**

* customer(collector) has a case with a visit booked and no identity on file.

**Steps:**

1. Open the identity-check invitation email the collector receives.

**Expected Results:**

* The email names the shop, the slot, and what to bring to the visit.

### grade10-site-vault-collector-notifications-US6-TC2-1: The invitation's link opens the hosted identity check

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
* **Trace:** grade10-site-vault-collector-notifications-US-06

**Pre-conditions:**

* customer(collector) has a case with a visit booked and no identity on file.

**Steps:**

1. Open the identity-check invitation email.
2. Click its link.

**Expected Results:**

* The hosted identity check opens.

### grade10-site-vault-collector-notifications-US6-TC3-1: An operator resends the invitation before custody closes it

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
* **Trace:** grade10-site-vault-collector-notifications-US-06

**Pre-conditions:**

* The case has no identity on file and has not yet reached custody.
* admin(holds vault:operate) is on <grade10 vault admin case url>.

**Steps:**

1. Send the identity-check invitation again from the case.

**Expected Results:**

* The collector receives a new invitation email.
* The case's identity state shows Out with the new invitation's date.

### grade10-site-vault-collector-notifications-US6-TC4-1: The invitation is withheld when it is not owed

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
* **Trace:** grade10-site-vault-collector-notifications-US-06

**Pre-conditions:**

* The case has a visit booked.

**Test data:**

| Reason | State |
| --- | --- |
| Identity already on file | The case already has a bound or reusable identity |
| Already in custody | The item is already in the vault |

**Steps:**

1. The visit-booking event that would trigger the invitation occurs.

**Expected Results:**

* No identity-check invitation is sent.
