# grade10-site/grading/collector-notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-grading-collector-notifications-US1: Collector hears about everything that happens to the submission

**As a** collector,
**I want** one email for each thing that happens to my submission, the drop-off's booked, moved, cancelled, missed and day-before messages among them, in English, with a link straight to the page that needs no account,
**so that** I never have to ask the shop what stage my cards are at.

### grade10-site-grading-collector-notifications-US1-TC1-1: Drop-off booked email comes from grading, not the diary

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector has a planned submission listing cards, not yet booked, on <grade10 grading submission url>.

**Steps:**

1. Book the drop-off from the submission page.
2. Check the collector's inbox.

**Expected Results:**

* One drop-off booked email arrives, sent by grading.
* No separate booking confirmation arrives from the diary.

### grade10-site-grading-collector-notifications-US1-TC2-1: Every message sends by email only, in English

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission is at hand-in, every card checked and the agreement sealed.

**Steps:**

1. Finish hand-in for the submission.
2. Open the handed-in message received.

**Expected Results:**

* The message arrives by email; no SMS or WhatsApp message arrives.
* The message reads entirely in English.

### grade10-site-grading-collector-notifications-US1-TC3-1: The message link opens the submission with no account

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission is booked for its drop-off; the booked email has arrived.
* The device used holds no signed-in session.

**Steps:**

1. Open the link from the drop-off booked email.

**Expected Results:**

* The submission's own page opens directly, at its own address.
* No sign-in or account creation is asked for.

### grade10-site-grading-collector-notifications-US1-TC4-1: A message with a document attaches it

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
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission is handed in, the agreement sealed and the intake receipt issued.

**Steps:**

1. Open the handed-in email.

**Expected Results:**

* The email carries the facts the collector would otherwise ask for: paid, cards, estimated back.
* The signed agreement and the intake receipt are attached.

### grade10-site-grading-collector-notifications-US1-TC5-1: A message with no document carries no attachment

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission's batch has shipped to the grader.

**Steps:**

1. Open the "on their way" email.

**Expected Results:**

* The email carries the courier, the grader's order number and the estimate.
* No document is attached.

### grade10-site-grading-collector-notifications-US1-TC6-1: The footer prints the shop's real facts in production

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission triggers a mapped event on a production environment, with every footer fact set.

**Steps:**

1. Open the received email.
2. Read its footer.

**Expected Results:**

* The footer names the submission id and its summary.
* The footer names the custodian's registered name trading as Grade10, the shop and its address, and the complaints contact.
* Every date and time in the message reads Hong Kong time.

### grade10-site-grading-collector-notifications-US1-TC7-1: The footer marks an unset fact outside production

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
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission triggers a mapped event outside production, with one footer fact unset.

**Steps:**

1. Open the received email.
2. Read its footer.

**Expected Results:**

* The unset fact prints inside brackets, marked.
* Every other footer fact prints unmarked.

---

## grade10-site-grading-collector-notifications-US2: Collector is not emailed about what the counter already told them

**As a** collector who was refused a card at the counter or who named someone to collect on the page,
**I want** no email about it, the receipt and History carrying it instead,
**so that** my inbox holds only what I could not already see.

### grade10-site-grading-collector-notifications-US2-TC1-1: A refused card sends no email while hand-in proceeds

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-02

**Pre-conditions:**

* A collector is checking in at the counter; one card the grader would not take is on the list, alongside cards that will be accepted.

**Steps:**

1. Staff refuse the one card with a reason.
2. Finish hand-in for the accepted cards.
3. Open the handed-in email.

**Expected Results:**

* No email names the refusal.
* The handed-in email still arrives, naming only the accepted cards and their estimate.
* The intake receipt and the submission page carry the refused card's badge and reason.

### grade10-site-grading-collector-notifications-US2-TC2-1: Naming, changing or removing a collector sends no email

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
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-02

**Pre-conditions:**

* A collector's submission is ready to collect, on <grade10 grading submission url>.

**Test data:**

| Action | Value |
| --- | --- |
| Name a collector | Names a person on the page for the first time |
| Change the named person | Replaces the person already named |
| Remove the named person | Clears the named person from the page |

**Steps:**

1. Perform <Action> from the submission page.

**Expected Results:**

* No email sends for <Action>.
* History logs <Action> with when it happened.

---

## grade10-site-grading-collector-notifications-US3: Operator picks up a message that never went

**As a** member of shop staff,
**I want** a submission to be flagged when a message to its collector ran out of attempts, and to be able to send it again,
**so that** a provider outage costs a delay rather than a collector who was never told.

### grade10-site-grading-collector-notifications-US3-TC1-1: A submission is flagged when a message runs out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* admin(shop staff) is on <grade10 admin grading queue url>.
* A submission's message to its collector has run out of send attempts.

**Steps:**

1. Open the queue.
2. Open the flagged submission.

**Expected Results:**

* The queue row carries the Message not sent badge.
* The submission names the failed letter and its reason.
* Send again is offered.

### grade10-site-grading-collector-notifications-US3-TC2-1: Staff resend a parked message from the submission

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* admin(shop staff) is on <grade10 admin grading submission url>, on a submission flagged with a message not sent.

**Steps:**

1. Click Send again on the flagged message.

**Expected Results:**

* The message resends to the collector.

### grade10-site-grading-collector-notifications-US3-TC3-1: A failed send never blocks the event it reports

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* admin(shop staff) is on <grade10 admin grading submission url>; the submission's grades-posted message has run out of send attempts.

**Steps:**

1. Open the submission's timeline.

**Expected Results:**

* The grades-posted event is recorded on the timeline as it happened.
* The submission's status still reflects the event, unaffected by the failed send.
* The failed send is recorded as still owed.

### grade10-site-grading-collector-notifications-US3-TC4-1: The queue shows no flag when every message sent

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
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* admin(shop staff) is on <grade10 admin grading queue url>; every submission's messages have sent.

**Steps:**

1. Open the queue.

**Expected Results:**

* No row carries the Message not sent badge.

### grade10-site-grading-collector-notifications-US3-TC5-1: A read-only grant cannot resend a parked message

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* admin(holds a grading read grant) is on <grade10 admin grading submission url>, on a submission flagged with a message not sent.

**Steps:**

1. Open the submission's documents.

**Expected Results:**

* The failed letter and its reason still show.
* No Send again action is offered.
