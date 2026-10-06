# grade10-site/vault/collector-notifications Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4
**Out of suite:** `grade10-site-vault-collector-notifications-SC-27` — its only anchor is `grade10-site/vault/loan-and-settlement`'s US-05, and that capability's suite walks the money email it names.

## grade10-site-vault-collector-notifications-US1: Borrower is warned before the due date and while it runs late

**As a** borrower,
**I want** a message a week and a day before my loan is due, and one every
week it stays late,
**so that** I know what I owe and what a late week costs before anything is
taken.

<!-- trace:case id=g10.vault-collector-notifications.TC-ti5 rev=1 covers=g10.vault-collector-notifications.SC-jys,g10.vault-collector-notifications.SC-vqz,g10.vault-collector-notifications.SC-gdg,g10.vault-collector-notifications.SC-3f7,g10.vault-collector-notifications.SC-tgx,g10.vault-collector-notifications.SC-3ke,g10.vault-collector-notifications.SC-0ul,g10.vault-collector-notifications.SC-k1j -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-qos rev=1 covers=g10.vault-collector-notifications.SC-jys,g10.vault-collector-notifications.SC-vqz,g10.vault-collector-notifications.SC-gdg,g10.vault-collector-notifications.SC-3f7,g10.vault-collector-notifications.SC-tgx,g10.vault-collector-notifications.SC-3ke,g10.vault-collector-notifications.SC-0ul,g10.vault-collector-notifications.SC-k1j -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-1kf rev=1 covers=g10.vault-collector-notifications.SC-jys,g10.vault-collector-notifications.SC-vqz,g10.vault-collector-notifications.SC-gdg,g10.vault-collector-notifications.SC-3f7,g10.vault-collector-notifications.SC-tgx,g10.vault-collector-notifications.SC-3ke,g10.vault-collector-notifications.SC-0ul,g10.vault-collector-notifications.SC-k1j -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-v95 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-lky rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-ipr rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-c1h rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-9an rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-syo rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-vxt rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-0cu rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-fys rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-we6 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-8zc rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-vz9 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### grade10-site-vault-collector-notifications-US2-TC12-1: A money record taken back reaches the borrower without naming who took it back

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* customer(borrower with a live loan) has a case carrying a recorded repayment.
* admin(holds vault:operate) is on <grade10 vault admin case url>.

**Steps:**

1. Take the recorded repayment back.

**Expected Results:**

* The borrower receives a message naming the amount taken back and what the case owes after it.
* The message names nobody who recorded or took back the money.

<!-- trace:case id=g10.vault-collector-notifications.TC-1wp rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### grade10-site-vault-collector-notifications-US2-TC13-1: A message with no money in it names the custodian, not the lender

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* customer(collector) has a case whose item has just been put in the vault.

**Steps:**

1. Open the item-vaulted message the collector receives.

**Expected Results:**

* The footer names the custodian under its registered name, with the complaints contact.
* The footer names no lender and no licence line.

---

<!-- trace:case id=g10.vault-collector-notifications.TC-blx rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### grade10-site-vault-collector-notifications-US2-TC14-1: Cancelling a draft staff opened sends nothing, and a sent one is told as any case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* `<case_1>` is a walk-in staff opened for `<walk-in email>`, a mailbox the tester reads, in the row's state.
* admin(staff, holds vault:operate) is on `<case_1>`'s page.
* `<mail delivery window>` is 5 minutes (assumed; any wait past the first send attempt).

**Test data:**

| `<case_1>` state | Message to `<walk-in email>` |
| --- | --- |
| an unsent draft | none |
| sent by its collector, now submitted | the cancelled email, linking `<case_1>` |

**Steps:**

1. Cancel `<case_1>` and confirm.
2. Wait <mail delivery window>.
3. Read `<walk-in email>`'s inbox.

**Expected Results:**

* The message matches the row.

<!-- trace:case id=g10.vault-collector-notifications.TC-qm8 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### grade10-site-vault-collector-notifications-US2-TC15-1: A draft staff opened expires with no untouched email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The row's draft has gone untouched for 8 days, and its address is a mailbox the tester reads.
* `<mail delivery window>` is 5 minutes (assumed; any wait past the first send attempt).

**Test data:**

| Draft | Message on expiry |
| --- | --- |
| a draft staff opened at the counter | none |
| a draft the collector opened themselves | the untouched email |

**Steps:**

1. Let the draft clock's sweep run.
2. Wait <mail delivery window>.
3. Read the address's inbox.

**Expected Results:**

* The draft ends as expired.
* The message matches the row.

---

## grade10-site-vault-collector-notifications-US3: Signer leaves with the documents they signed

**As a** person who has just signed at the counter,
**I want** the sealed set mailed to me once, with the documents attached,
**so that** I hold my own copy without asking for one.

<!-- trace:case id=g10.vault-collector-notifications.TC-1xt rev=1 covers=g10.vault-collector-notifications.SC-r2t,g10.vault-collector-notifications.SC-lmz,g10.vault-collector-notifications.SC-4ig -->
### grade10-site-vault-collector-notifications-US3-TC1-1: A retried delivery reads the documents from the packet again

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
* **Trace:** grade10-site-vault-collector-notifications-US-03

**Pre-conditions:**

* A sealed packet's first delivery to its signer has failed and is owed.

**Steps:**

1. The retry runs hours later.

**Expected Results:**

* The documents attached are read again from the packet rather than from the queue.
* The signer receives the set with the packet's current sealed documents attached.

---

## grade10-site-vault-collector-notifications-US4: Operator picks up a message that never went

**As a** member of shop staff,
**I want** a case to be flagged when a message to its collector ran out of
attempts, and to be able to send it again,
**so that** a provider outage costs a delay rather than a customer who was
never told.

<!-- trace:case id=g10.vault-collector-notifications.TC-fvw rev=1 covers=g10.vault-collector-notifications.SC-6iy,g10.vault-collector-notifications.SC-qld,g10.vault-collector-notifications.SC-lzl,g10.vault-collector-notifications.SC-xyv -->
### grade10-site-vault-collector-notifications-US4-TC1-1: The vaulting act stands even though the message failed

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
* **Trace:** grade10-site-vault-collector-notifications-US-04

**Pre-conditions:**

* A mail provider refuses every send attempted against the case.

**Steps:**

1. An item is taken into the vault on the case.

**Expected Results:**

* The case's custody record shows the item as vaulted.
* The notification for the event is owed rather than lost.

---

## grade10-site-vault-collector-notifications-US5: Borrower reads the figures in the message itself

**As a** borrower,
**I want** every money message to table the amount, the date, what a late day
costs and how to pay, and the notice to name the clause, the date to pay by
and that a person decides,
**so that** the message is a record I can act on without opening the page.

<!-- trace:case id=g10.vault-collector-notifications.TC-p0d rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### grade10-site-vault-collector-notifications-US5-TC1-1: A money message tables its figures instead of prose

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose loan is active.

**Steps:**

1. Open a money message the borrower receives on the case.

**Expected Results:**

* The amount, the due date and what a late day costs appear as a table.
* The figures do not also appear written into a sentence elsewhere in the message.

<!-- trace:case id=g10.vault-collector-notifications.TC-zt1 rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### grade10-site-vault-collector-notifications-US5-TC2-1: A money message carries the loan's own how-to-pay block

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* customer(borrower with a live loan) has a case whose loan is active.

**Steps:**

1. Open a money message the borrower receives on the case.
2. Compare its how-to-pay block with the block shown on the case's own address.

**Expected Results:**

* Both blocks name the same FPS id, bank account and the case reference as the transfer reference.

<!-- trace:case id=g10.vault-collector-notifications.TC-meg rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-w3y rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-pfx rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### grade10-site-vault-collector-notifications-US5-TC5-1: Every message carries the case line and lender footer

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* customer(borrower with a live loan) has a case that receives a message.

**Steps:**

1. Open a message the borrower receives on the case.

**Expected Results:**

* The message carries the case reference and the item.
* The footer names the sending party under its registered name and the complaints contact, with the lender's licence line on a money message.

<!-- trace:case id=g10.vault-collector-notifications.TC-bh4 rev=1 covers=g10.vault-collector-notifications.SC-tz5 -->
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
* **Trace:** `What a message carries`

**Pre-conditions:**

* The environment is outside production.
* A value a message would print is unset.

**Steps:**

1. The message renders.

**Expected Results:**

* The unset value prints as a bracketed, marked placeholder.
* The message still sends.

<!-- trace:case id=g10.vault-collector-notifications.TC-qu7 rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-ht8 rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### grade10-site-vault-collector-notifications-US5-TC8-1: The offer's message tables the term, the interest and the day it is open until

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* customer(collector) has a case carrying an offer of 4,000,000 HKD minor units over 90 days.

**Steps:**

1. Open the offer message the collector receives.

**Expected Results:**

* The message tables the loan, the term, the interest for the term, the total to repay, what a late day costs and the day the offer is open until.
* None of those six figures is readable only inside a sentence.

---

## grade10-site-vault-collector-notifications-US6: Collector is invited to verify before the visit

**As a** collector with a visit booked and no identity on file,
**I want** the invitation to name the visit, the slot and what to bring,
**so that** I can verify at home and turn up prepared.

<!-- trace:case id=g10.vault-collector-notifications.TC-wk8 rev=1 covers=g10.vault-collector-notifications.SC-kz4,g10.vault-collector-notifications.SC-fcf -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-dxp rev=1 covers=g10.vault-collector-notifications.SC-kz4,g10.vault-collector-notifications.SC-fcf -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-x7v rev=1 covers=g10.vault-collector-notifications.SC-kz4,g10.vault-collector-notifications.SC-fcf -->
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

<!-- trace:case id=g10.vault-collector-notifications.TC-w6w rev=1 covers=g10.vault-collector-notifications.SC-kz4,g10.vault-collector-notifications.SC-fcf -->
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

---

## Settled

- What a tester observes on a retried send is that the attachment equals the packet's sealed copy at send time: the documents are read from the packet at each attempt, never from the queue.
- The invitation's own condition is a visit booked with no identity to reuse; that a reused check or a case in custody takes no new one is `grade10-site/vault/identity-verification`'s rule, so this suite keeps the case and writes no scenario against it.
- The panel's Send again on a check still out is `grade10-admin/vault/operator-queue`'s, read from this suite rather than restated in it.
- The repayment message this capability carries is walked by `grade10-site/vault/loan-and-settlement`'s suite, which reads every money email on the case; it is listed out of suite here.
- The unset-value rule is whole here — bracketed outside production, the act refused in production, and the message rendered before the record commits — and `grade10-site/vault/loan-and-settlement` names it rather than restating it.

## Reconciliation

**Run:** the blind pass read the bundle — `spec.md`'s `## Purpose` and
`## Feature set`, this capability's `user-journeys.md`, the change's
`proposal.md` and `decisions.md` (`## Raised` included), `ui-design.md` with its
state dispositions stripped, and the linked sections of
`docs/prds/products/grade10-site/vault/collector-pages.md`. It was denied every
`## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and
`tech-design.md`. It wrote 25 cases over US1, US2, US5 and US6 and raised one
question. The scenario pass issued
`grade10-site-vault-collector-notifications-SC-20` to
`grade10-site-vault-collector-notifications-SC-33`, carrying the durable
`grade10-site-vault-collector-notifications-SC-03` and
`grade10-site-vault-collector-notifications-SC-04` in its MODIFIED block; this
reconciliation folded one more,
`grade10-site-vault-collector-notifications-SC-34`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1` | Covered | `grade10-site-vault-collector-notifications-SC-05` for the two offsets, `grade10-site-vault-collector-notifications-SC-25` for what the due-soon message tables |
| `US1-TC2-1` | Covered | `grade10-site-vault-collector-notifications-SC-07` for one message however many offsets have passed, `grade10-site-vault-collector-notifications-SC-26` for the overdue figures |
| `US1-TC3-1` | Covered | `grade10-site-vault-collector-notifications-SC-08` |
| `US2-TC1-1` | Folded | `grade10-site-vault-collector-notifications-SC-34` — the requirement states the action link and no scenario reached it; the change opens that requirement, so the scenario lands in its MODIFIED block |
| `US2-TC2-1` | Covered | `grade10-site-vault-collector-notifications-SC-01` |
| `US2-TC3-1` | Covered | `grade10-site-vault-collector-notifications-SC-11` |
| `US2-TC4-1` | Covered | `grade10-site-vault-collector-notifications-SC-13` |
| `US2-TC5-1` | Covered | `grade10-site-vault-collector-notifications-SC-15` |
| `US2-TC6-1` | Covered | `grade10-site-vault-collector-notifications-SC-16` for the address; the item's title and the currency are the durable *The reader is read at the attempt* requirement's own sentence, which this change does not open |
| `US2-TC7-1` | Covered | `grade10-site-vault-collector-notifications-SC-18` |
| `US2-TC8-1` | Covered | `grade10-site-vault-collector-notifications-SC-09`, `grade10-site-vault-collector-notifications-SC-10` |
| `US2-TC9-1` | Covered | `grade10-site-vault-collector-notifications-SC-10` |
| `US2-TC10-1` | Covered | `grade10-site-vault-collector-notifications-SC-12` |
| `US2-TC11-1` | Covered | `grade10-site-vault-collector-notifications-SC-17` |
| `US5-TC1-1` | Covered | `grade10-site-vault-collector-notifications-SC-23`, `grade10-site-vault-collector-notifications-SC-24`, `grade10-site-vault-collector-notifications-SC-25`, `grade10-site-vault-collector-notifications-SC-26` — the case reads one money message, the four scenarios read one kind each |
| `US5-TC2-1` | Covered | `grade10-site-vault-collector-notifications-SC-24` for the block on the advance, `grade10-site-vault-collector-notifications-SC-25` for it under the due-soon figures |
| `US5-TC3-1` | Covered | `grade10-site-vault-collector-notifications-SC-28` |
| `US5-TC4-1` | Covered | `grade10-site-vault-collector-notifications-SC-29`, `grade10-site-vault-collector-notifications-SC-30` |
| `US5-TC5-1` | Covered | `grade10-site-vault-collector-notifications-SC-21` for the case line; the case reads the footer without saying which party it names, which `US2-TC13-1` now does |
| `US5-TC6-1` | Covered | `grade10-site-vault-collector-notifications-SC-32` |
| `US5-TC7-1` | Covered | `grade10-site-vault-collector-notifications-SC-33` |
| `US6-TC1-1` | Covered | `grade10-site-vault-collector-notifications-SC-31`, `grade10-site-vault-collector-notifications-SC-20` |
| `US6-TC2-1` | Covered | `grade10-site-vault-collector-notifications-SC-31` |
| `US6-TC3-1` | Covered elsewhere | `grade10-admin-vault-operator-queue-SC-39` states the panel's Send again on a check still out, and the durable `grade10-site-vault-identity-verification-SC-03` states that a case in custody takes no new check; nothing about the invitation is unstated, so no scenario is folded here |
| `US6-TC4-1` | Covered elsewhere | The invitation's condition is `grade10-site-vault-collector-notifications-SC-20`'s GIVEN — a visit booked and no identity to reuse — and what makes it unmet is `grade10-site-vault-identity-verification-SC-09` (the last check is reused) and `grade10-site-vault-identity-verification-SC-03` (a case in custody takes no new check). The negative restates another capability's rule, so it stays a case and no scenario is written |
| `US3-TC1-1` | Covered | `grade10-site-vault-collector-notifications-SC-14` — no case traced `US-03` on its own until this pass; the requirement was denied to the blind reading, so this case answers the Raised row below rather than being re-derived blind |
| `US4-TC1-1` | Covered | `grade10-site-vault-collector-notifications-SC-09` — no case traced `US-04` on its own; `US2-TC8-1` traces `US-02` and asserts the retry cadence on a message already failed once, never that the act itself stands despite the failed send |
| `grade10-site-vault-collector-notifications-SC-04` | Case added | `US2-TC12-1` — no blind case took a money record back, and nothing reached "never with who recorded it" |
| `grade10-site-vault-collector-notifications-SC-22` | Case added | `US2-TC13-1` — `US5-TC5-1` reads the footer without deciding which party it names, which is the rule this change adds |
| `grade10-site-vault-collector-notifications-SC-23` | Case added | `US5-TC8-1` — `US5-TC1-1` reads a money message with a due date, which the offer does not have; its six rows were reached by nothing |
| `grade10-site-vault-collector-notifications-SC-27` | Out of suite | Its only anchor is `grade10-site/vault/loan-and-settlement`'s US-05, and that suite's `grade10-site-vault-loan-and-settlement-US5-TC2-1` walks every money email on the case, `repayment_recorded` among them; listed under the header |
| Raised — what a tester observes when a retried send reads the documents from the packet rather than the queue | Raised, settled | Landed in the change's `decisions.md` `## Raised`. The rule stands as the durable *The signed set is delivered once, and its documents are read at the attempt* requirement states it, and `grade10-site-vault-collector-notifications-SC-14` is the scenario: what differs between attempts is a packet re-sealed or an attachment regenerated, so the assertion is that the attachment equals the packet's sealed copy at send time. The blind pass was denied that requirement; `US3-TC1-1`, written once the two readings were reconciled, is the case |

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote two cases under one journey and raised no question for this capability; the scenario pass issued `grade10-site-vault-collector-notifications-SC-35` and `grade10-site-vault-collector-notifications-SC-36` and carried `grade10-site-vault-collector-notifications-SC-01` and `grade10-site-vault-collector-notifications-SC-02` in its MODIFIED block.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-collector-notifications-US2-TC14-1` | Joined | `grade10-site-vault-collector-notifications-SC-36` for the unsent draft; the sent one is `grade10-site-vault-case-lifecycle-SC-45`, told as any cancelled case. The collector's own cancel of an unsent one is walked, silent, by `grade10-site-vault-case-lifecycle-US1-TC4-1` |
| `grade10-site-vault-collector-notifications-US2-TC15-1` | Joined | `grade10-site-vault-collector-notifications-SC-35`; the collector's own draft keeps the untouched email `grade10-site-vault-collector-notifications-SC-02` names |

### Manual

| Manual | Why |
| --- | --- |
| `US2-TC7-1` | The chat app opens outside the product; a person reads the pre-filled template and confirms the vault queued nothing of its own |
| `US2-TC13-1` | A person reads the custodian's registered name off the message and sees no licence line; no assertion restates the name without keeping a second copy of it |
| `US3-TC1-1` | Needs a first delivery already failed and retried hours later; a person drives the retry in the provider sandbox |
| `US5-TC1-1` | The automated walk proves the table's rows; a person reads the whole message to confirm no figure is also written into a sentence |
| `US5-TC5-1` | A person reads the footer against the party the message is from, which is the one thing the walk cannot decide for every kind of message at once |
| `US5-TC8-1` | The walk proves the offer's six rows; a person confirms the prose around them repeats none of them |
| `US6-TC1-1` | The isolated stack configures no hosted verification provider, so e-kyc raises no check and the invitation is never sent |
| `US6-TC2-1` | As above |
| `grade10-site-vault-collector-notifications-US2-TC14-1` | A person cancels both rows and reads the mailbox; the vault worker's walk-ins test decides nothing is owed for the unsent one |
| `grade10-site-vault-collector-notifications-US2-TC15-1` | The draft runs out seven days from its last touch; a person moves the clock or waits, and reads the mailbox |
