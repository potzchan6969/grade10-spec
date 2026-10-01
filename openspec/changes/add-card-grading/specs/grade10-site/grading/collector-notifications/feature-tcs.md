# grade10-site/grading/collector-notifications Test Cases

**Status:** approved
**Reviewed:** 2026-09-29, tcs-rules r4

**Out of suite:**

- `grade10-site-grading-collector-notifications-SC-01` — grade10's type check: the map from every submission event kind to its message or silence is exhaustive, so no event ships unanswered; no screen shows the map
- `grade10-site-grading-collector-notifications-SC-08` — the booked message's anchor is `grade10-site/grading/dropoff-booking`'s journey; that suite walks it, and `grade10-site-grading-collector-notifications-US1-TC1-1` reaches the same send here
- `grade10-site-grading-collector-notifications-SC-10` — `grade10-site/grading/dropoff-booking`'s suite: the collector who missed the visit walks it there
- `grade10-site-grading-collector-notifications-SC-11` — `grade10-site/grading/submission-lifecycle`'s suite: the uncollected ladder is walked there
- `grade10-site-grading-collector-notifications-SC-12` — `grade10-site/grading/submission-lifecycle`'s suite
- `grade10-site-grading-collector-notifications-SC-13` — `grade10-site/grading/submission-lifecycle`'s suite
- `grade10-site-grading-collector-notifications-SC-15` — `grade10-site/grading/submission-lifecycle`'s suite
- `grade10-site-grading-collector-notifications-SC-22` — `grade10-admin/grading/counter`'s suite: the operator handing a list in meets the refusal there

## grade10-site-grading-collector-notifications-US1: Collector hears about everything that happens to the submission

**As a** collector,
**I want** one email for each thing that happens to my submission, the drop-off's booked, moved, cancelled, missed and day-before messages among them, in English, with a link straight to the page that needs no account,
**so that** I never have to ask the shop what stage my cards are at.

### grade10-site-grading-collector-notifications-US1-TC1-1: Drop-off booked email comes from grading, not the diary

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* On staging, customer(collector) holds a plan kept under <collector inbox>, listing cards, with a level picked and no drop-off booked.
* The collector is on <grade10 grading submission page url> for that plan, the drop-off picker open.

**Test data:**

| Field | Value |
| --- | --- |
| <collector inbox> | An email inbox the tester reads, used by no other run |
| <visit> | Any free day and time the picker offers |

**Steps:**

1. Pick the shop, then the day and the time of <visit> in the drop-off picker.
2. Click Book <day, time>.
3. Open <collector inbox>.

**Expected Results:**

* One drop-off booked email arrives, sent by grading.
* No separate booking confirmation arrives from the diary.

### grade10-site-grading-collector-notifications-US1-TC2-1: Every message sends by email only, in English

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* On staging, customer(collector) reads the site in Traditional Chinese (`<lang>` is `/tc`) and planned the submission there, under <collector inbox> and <collector phone>.
* The submission is Drop-off booked, every card checked on the hand-in runbook, the agreement sealed and the fee paid.
* admin(holds grading:operate) is on the submission's hand-in runbook at <grade10 admin grading submission url>.

**Test data:**

| Field | Value |
| --- | --- |
| <collector inbox> | An email inbox the tester reads, used by no other run |
| <collector phone> | A phone the tester holds, receiving SMS and WhatsApp |

**Steps:**

1. Click Print n labels and check in on the runbook.
2. Open <collector inbox>.
3. Open the handed-in email.
4. Check <collector phone> for any SMS or WhatsApp message about the submission.

**Expected Results:**

* Step 2: the handed-in message arrives by email.
* Step 3: the message reads entirely in English.
* Step 4: no SMS or WhatsApp message arrives.

### grade10-site-grading-collector-notifications-US1-TC3-1: The message link opens the submission with no account

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/plan.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission is Drop-off booked, and the drop-off booked email has arrived in <collector inbox>.
* The browser used holds no signed-in session: a private window.

**Steps:**

1. Open the drop-off booked email in <collector inbox>.
2. Click Open your submission, into the private window.

**Expected Results:**

* The submission's own page opens directly, at its own address.
* No sign-in or account creation is asked for.

### grade10-site-grading-collector-notifications-US1-TC4-1: A message with a document attaches it

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/handin.spec.ts`

**Pre-conditions:**

* customer(collector)'s submission at the row's level is Handed in under <collector email>, the agreement sealed and the intake receipt issued.
* On the local stack this is a submission seeded at Handed in at the row's level, whose hand-in sends the handed-in email to the grading outbox for <collector email>.

**Test data:**

| Level | What was paid names |
| --- | --- |
| PSA Regular | the fee alone |
| PSA Express | the cover beside the fee |

**Steps:**

1. Open the latest grading email to <collector email>: the handed-in email.

**Expected Results:**

* The email states what was paid and the cards taken in.
* What was paid names what the row's What was paid names.
* The signed agreement and the intake receipt are attached.

### grade10-site-grading-collector-notifications-US1-TC5-1: A message with no document carries no attachment

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* customer(collector)'s submission is With the grader under <collector email>: its batch has shipped.
* On the local stack this is a submission seeded at With the grader, whose ship sends the on-their-way email to the grading outbox for <collector email>.

**Steps:**

1. Open the latest grading email to <collector email>: the on-their-way email.

**Expected Results:**

* The on-their-way email arrives.
* No document is attached.

### grade10-site-grading-collector-notifications-US1-TC6-1: The footer prints the shop's real facts in production

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* On production, every footer fact is set: <grade10 admin grading settings url> reads no fact as not set.
* customer(collector) has received a grading email about a submission in <collector inbox>.

**Steps:**

1. Open the latest grading email in <collector inbox>.
2. Read the line directly above the footer.
3. Read the footer.

**Expected Results:**

* Step 2: the line names the submission id and its summary: the cards, the grader and the level.
* Step 3: the footer names the custodian's registered name trading as Grade10, the shop and its address, and the complaints contact.
* Every date and time in the message reads Hong Kong time, and the footer says so.

### grade10-site-grading-collector-notifications-US1-TC7-1: The footer marks an unset fact outside production

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `The footer`

**Pre-conditions:**

* On the local stack, the complaints contact reads not set on <grade10 admin grading settings url>, and every other footer fact is set.
* customer(collector)'s submission sends a grading email to <collector email>: on the local stack, a submission seeded at Handed in.

**Steps:**

1. Open the latest grading email to <collector email>.
2. Read its footer.

**Expected Results:**

* The unset fact prints inside brackets, marked.
* Every other footer fact prints unmarked.

### grade10-site-grading-collector-notifications-US1-TC8-1: A cancelled visit reads the same whoever cancelled it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `What is sent`

**Pre-conditions:**

* customer A and customer B each hold a submission booked for a drop-off from its page's drop-off picker, under <collector A email> and <collector B email>.
* customer A is on <grade10 grading submission page url> for their submission.
* admin(holds grading:operate) is on <grade10 admin grading submission url> for customer B's submission.

**Steps:**

1. On customer A's page, click Cancel visit on the visit card.
2. Confirm the cancel.
3. On the console, click Cancel visit on customer B's drop-off block.
4. Confirm the cancel.
5. Open the latest grading email to <collector A email>.
6. Open the latest grading email to <collector B email>.

**Expected Results:**

* Steps 5 and 6: both collectors receive the drop-off cancelled email.
* The two emails carry the same wording.
* Neither names who cancelled the visit.

### grade10-site-grading-collector-notifications-US1-TC9-1: The grades email leaves out what this submission does not owe

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* customer(collector)'s submission is Grades are in under <collector email>, with no card moved up a level and no card returned ungraded.
* On the local stack this is a submission seeded at Grades are in, whose grades send the grades email to the grading outbox for <collector email>.

**Steps:**

1. Open the latest grading email to <collector email>: the grades email.

**Expected Results:**

* Each card's grade is named.
* No paragraph about settling appears.
* No paragraph about an ungraded card appears.

### grade10-site-grading-collector-notifications-US1-TC10-1: The reminder arrives the day before the visit

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
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/dropoff.spec.ts`

**Pre-conditions:**

* On the local stack, after 09:00 on the shop's clock, customer(collector) holds a plan kept under <collector email> with a level picked and no drop-off booked.
* The collector is on <grade10 grading submission page url> for that plan, the drop-off picker open.

**Test data:**

| Field | Value |
| --- | --- |
| <visit> | Tomorrow, any free time the picker offers |

**Steps:**

1. Book <visit> from the drop-off picker.
2. Run grading's reminder sweep once, standing in for the day before the visit.
3. Open the latest grading email to <collector email>.

**Expected Results:**

* One reminder email arrives.
* It names the visit's day, time and shop, and what to bring.

### grade10-site-grading-collector-notifications-US1-TC11-1: A rung already told is not told again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `Reminders and the notice`

**Pre-conditions:**

* On the local stack, after 09:00 on the shop's clock, customer(collector)'s submission is Ready to collect under <collector email>, its ready day 30 days back.
* Grading's reminder sweep has run once today and sent the 30-day reminder.

**Steps:**

1. Run grading's reminder sweep again the same day.
2. Open the collector's grading emails for <collector email>.

**Expected Results:**

* No second reminder arrives.
* The inbox holds the one reminder sent earlier.

---

### grade10-site-grading-collector-notifications-US1-TC12-1: The daily sweep sends a plan left unbooked its link once

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
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* <unbooked plan> and <booked plan> were kept yesterday.

**Test data:**

| Field | Value |
| --- | --- |
| <unbooked plan> | a plan kept with no drop-off booked |
| <booked plan> | a plan kept and booked since |

**Steps:**

1. Let the daily sweep run.
2. Let it run again the next day.

**Expected Results:**

* Step 1: <unbooked plan>'s collector receives the list-saved message with its link; <booked plan>'s receives none.
* Step 2: nothing further is sent to either.

---

### grade10-site-grading-collector-notifications-US1-TC13-1: A plan with no visit names the brand's main shop, its hours and its phone

**Classification:**

* **Severity:** minor
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

* <unbooked plan> is due its list-saved message.

**Test data:**

| Field | Value |
| --- | --- |
| <unbooked plan> | a plan kept with no drop-off booked |

**Steps:**

1. Read the list-saved message's footer.

**Expected Results:**

* Step 1: it names the brand's main shop, its address, its weekly hours from the diary and its phone.

---

## grade10-site-grading-collector-notifications-US2: Collector is not emailed about what the counter already told them

**As a** collector who was refused a card at the counter or who named someone to collect on the page,
**I want** no email about it, the receipt and History carrying it instead,
**so that** my inbox holds only what I could not already see.

### grade10-site-grading-collector-notifications-US2-TC1-1: A refused card sends no email while hand-in proceeds

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-02

**Pre-conditions:**

* customer(collector)'s submission of three cards is Drop-off booked under <collector email>, booked from its page's drop-off picker; the booked email is the latest grading email to that address.
* admin(holds grading:operate) is on the submission's hand-in runbook at <grade10 admin grading submission url>, the visit started at the desk, no card checked yet.

**Test data:**

| Field | Value |
| --- | --- |
| <refused card> | The first card on the list: one the grader would not take |
| <reason> | Any of the three reasons the Refuse dialog offers |
| <collector's words> | Crease across the front |

**Steps:**

1. Click Refuse on <refused card>'s row.
2. Pick <reason>, type <collector's words>, and click Refuse this card.
3. Open the latest grading email to <collector email>.
4. Tick Present on each of the other two cards.
5. Seal the agreement on the iPad and take payment, as the runbook's steps offer.
6. Click Print 2 labels and check in.
7. Open the latest grading email to <collector email>: the handed-in email.
8. Open <grade10 grading submission page url> for the submission.

**Expected Results:**

* Step 3: no email names the refusal; the latest email is still the booked one.
* Step 7: the handed-in email still arrives, naming only the accepted cards.
* Steps 7 and 8: the intake receipt and the submission page carry the refused card's badge and reason.

### grade10-site-grading-collector-notifications-US2-TC2-1: Naming, changing or removing a collector sends no email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-02

**Pre-conditions:**

* customer(collector)'s submission is Ready to collect under <collector email>, and the latest grading email to that address is the ready email.
* The collector is on <grade10 grading submission page url> for the submission, with the person the row's Before names.

**Test data:**

| Action | Before | On the naming card |
| --- | --- | --- |
| Name a collector | Nobody named | Type Chan Tai Man in Their name, click Save |
| Change the named person | Chan Tai Man named | Click Change, type Wong Siu Ming in Their name, click Save |
| Remove the named person | Chan Tai Man named | Click Remove |

**Steps:**

1. Do the row's On the naming card.
2. Open the latest grading email to <collector email>.
3. Read History on the submission page.

**Expected Results:**

* Step 2: no email sends for <Action>; the latest email is still the ready email.
* Step 3: History logs <Action> with when it happened.

---

## grade10-site-grading-collector-notifications-US3: Operator picks up a message that never went

**As a** member of shop staff,
**I want** a submission to be flagged when a message to its collector ran out of attempts, and to be able to send it again,
**so that** a provider outage costs a delay rather than a collector who was never told.

### grade10-site-grading-collector-notifications-US3-TC1-1: A submission is flagged when a message runs out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* A submission's message to its collector has run out of send attempts: the mail provider refused every send until the retry ladder was spent.
* admin(holds grading:operate) is signed in to the console.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Find the submission's row.
3. Click Open on the row.

**Expected Results:**

* Step 2: the queue row carries the Message not sent badge.
* Step 3: the submission names the failed letter and its reason.
* Step 3: Send again is offered.
* No further attempt is made to send the letter.

### grade10-site-grading-collector-notifications-US3-TC2-1: Staff resend a parked message from the submission

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* A submission's message to its collector has run out of send attempts, and the mail provider now accepts sends.
* admin(holds grading:operate) is on <grade10 admin grading submission url> for that submission, the failed letter named in its header.

**Steps:**

1. Click Send again beside the failed letter.

**Expected Results:**

* The message resends to the collector.

### grade10-site-grading-collector-notifications-US3-TC3-1: A failed send never blocks the event it reports

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
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* The mail provider refuses every send.
* admin(holds grading:operate) is on <grade10 admin grading submission url> for a submission With the grader.

**Steps:**

1. Record the stage that puts the grades in on the batch.
2. Open the submission's Timeline tab.

**Expected Results:**

* The grades-posted event is recorded on the timeline as it happened.
* The submission's status still reflects the event, unaffected by the failed send.
* The failed send is recorded as still owed.

### grade10-site-grading-collector-notifications-US3-TC4-1: The queue shows no flag when every message sent

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
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/grading/uncollected.spec.ts`

**Pre-conditions:**

* On the local stack, every submission's messages have sent: the mail provider has refused none.
* admin(holds grading:operate) is signed in to the console.

**Steps:**

1. Navigate to <grade10 admin grading queue url>.
2. Read the badges on every row of every view.

**Expected Results:**

* No row carries the Message not sent badge.

### grade10-site-grading-collector-notifications-US3-TC5-1: A read-only grant cannot resend a parked message

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* A submission's message to its collector has run out of send attempts.
* admin(holds grading:read and no other grading grant) is on <grade10 admin grading submission url> for that submission.

**Steps:**

1. Read the submission's header, where the failed letter is named.

**Expected Results:**

* The failed letter and its reason still show.
* No Send again action is offered.

### grade10-site-grading-collector-notifications-US3-TC6-1: The flag clears when the channel accepts the resend

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* A submission's message to its collector has run out of send attempts, and the mail provider now accepts sends.
* admin(holds grading:operate) is on <grade10 admin grading submission url> for that submission, the failed letter named in its header.

**Steps:**

1. Click Send again beside the failed letter.
2. Navigate to <grade10 admin grading queue url>.
3. Find the submission's row.
4. Click Open on the row.

**Expected Results:**

* Step 1: the message leaves the parked list once the channel accepts it.
* Step 1: the letter reaches the collector.
* Step 3: the submission's row carries no Message not sent badge.
* Step 4: the submission's page shows no failed letter.

## Settled

- A read-grant holder offered no Send again is not this capability's rule: it is `grade10-admin/grading/counter`'s grant rule (the console shows only what the operator may do), walked in the counter suite; this spec states only that the operate grant sends a parked message again
- The on-their-way letter's courier, order number and estimate are not this capability's to state: they are `grade10-admin/grading/batches`' facts; this spec states only that a letter with no document attaches nothing

## Reconciliation

**Run:** Blind suite reading 2026-09-22 for change `add-card-grading`, capability `grade10-site/grading/collector-notifications`. Read the isolated bundle under `bundles/add-card-grading/`: `_change/proposal.md`, `_change/decisions.md` with its `## Raised` table, `_change/ui-design.md` with the state dispositions stripped, the linked manual pages under `_change/pages/`, and this capability's `spec-outline.md` (`## Purpose` and `## Feature set`) and `user-journeys.md`. Denied: every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/`, `tech-design.md`, and the scenario pass's draft. Scenario ids stripped at review, 2026-09-29.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-grading-collector-notifications-US1-TC1-1` booked email comes from grading, not the diary | Covered | The booked message sent once, from the submission; its anchor is `grade10-site/grading/dropoff-booking`'s journey, so it is listed out of suite here, and the case still walks the send |
| `grade10-site-grading-collector-notifications-US1-TC2-1` email only, English, whatever the pages read in | Folded | Decided in `decisions.md` Q13 and stated as a rule, with no scenario reaching it; folded as a scenario, one channel and one language |
| `grade10-site-grading-collector-notifications-US1-TC3-1` the link opens the submission with no account | Covered | The link opening the submission with no account |
| `grade10-site-grading-collector-notifications-US1-TC4-1` a message with a document attaches it | Covered | The handed-in message carrying the papers, and the cover beside the fee; its `estimated back` dropped from the case at review |
| `grade10-site-grading-collector-notifications-US1-TC5-1` a message with no document carries no attachment | Folded | The closed list of three attaching messages had no scenario proving the negative; folded as a scenario. The letter's own facts — courier, order number, estimate — are `grade10-admin/grading/batches`' to state, dropped from the case at review |
| `grade10-site-grading-collector-notifications-US1-TC6-1` the footer prints the shop's real facts in production | Covered | The footer naming the submission and who is writing, and every date on the shop's clock |
| `grade10-site-grading-collector-notifications-US1-TC7-1` the footer marks an unset fact outside production | Covered | A value Legal has not set printing in brackets outside production. Retraced to `The footer`, the group that rule serves; the footer's other two rules stay with `grade10-site-grading-collector-notifications-US1-TC6-1` |
| `grade10-site-grading-collector-notifications-US2-TC1-1` a refused card sends no email while hand-in proceeds | Covered | A refused card told at the counter and not by email, and the handed-in message for the rest |
| `grade10-site-grading-collector-notifications-US2-TC2-1` naming, changing or removing a collector sends no email | Covered | Naming somebody to collect sends nothing. The removal row is a change of the named person under the requirement's "naming the person who may collect, or changing them"; no third event is claimed |
| `grade10-site-grading-collector-notifications-US3-TC1-1` a submission is flagged when a message runs out | Covered | The retries spent, the message parked and the submission flagged |
| `grade10-site-grading-collector-notifications-US3-TC2-1` staff resend a parked message from the submission | Retired at review, `deprecated` | A duplicate: `grade10-site-grading-collector-notifications-US3-TC6-1` walks the same resend from the same state, and took its result |
| `grade10-site-grading-collector-notifications-US3-TC3-1` a failed send never blocks the event it reports | Covered | The act standing though the mail failed, read on the grades-posted message rather than the hand-in |
| `grade10-site-grading-collector-notifications-US3-TC4-1` the queue shows no flag when every message sent | Covered | The flag's condition is the parked message; a submission with none is the other half of it |
| `grade10-site-grading-collector-notifications-US3-TC5-1` a read grant cannot resend a parked message | Retired at review, `deprecated` | The read grant is `grade10-admin/grading/counter`'s grant rule, walked in the counter suite; this spec states only that the operate grant sends a parked message again (`decisions.md` Q61) |
| Blind pass raised: does the flag clear on the resend, or on a later delivery check? | Answered, folded | Landed as `decisions.md` Q60: the flag clears when the channel accepts the resend and the parked row closes; folded as a scenario, and walked by `grade10-site-grading-collector-notifications-US3-TC6-1` |
| Blind pass raised: which grant may Send again? | Answered: `decisions.md` Q61 | The operate grant, as the scenario for an operator sending a parked message again already stated; no new scenario |
| Blind pass raised: does production refuse a send whose footer fact is unset? | Answered: `decisions.md` Q62 | It refuses the act by name and commits nothing, as the requirement and its production scenario state; no new scenario |
| Every event decided | Out of suite: grade10's type check — `NOTIFY_FOR_EVENT` is exhaustive over every submission event kind, `null` written for each silence (`tech-design.md`) | Listed in the header's out of suite at review |
| The same event telling the same message | Case added | `grade10-site-grading-collector-notifications-US1-TC8-1`, tracing `What is sent`, the group the rule serves |
| A message saying only what is true of this submission | Case added | `grade10-site-grading-collector-notifications-US1-TC9-1` |
| The reminder the day before | Case added | `grade10-site-grading-collector-notifications-US1-TC10-1` |
| A rung told twice told once | Case added | `grade10-site-grading-collector-notifications-US1-TC11-1`, tracing `Reminders and the notice`; automation-only, since the local outbox keeps only the last letter |
| The booked message and the missed message | Out of suite: `grade10-site/grading/dropoff-booking`'s suite | Their only anchor is that capability's journey |
| The reminders, the storage message, the notice and nothing after it | Out of suite: `grade10-site/grading/submission-lifecycle`'s suite | The uncollected ladder is walked there, by that suite's `US8` cases |
| Production refusing the act rather than send a blank | Out of suite: `grade10-admin/grading/counter`'s suite | The operator handing a list in meets the refusal there |
| The plan's link sent by the sweep | Case added, added after the run | `grade10-site-grading-collector-notifications-US1-TC12-1`: decided by the product owner after the run (Q134), stated by `grade10-site-grading-collector-notifications-SC-26` |
| The footer's shop, hours and phone | Case added, added after the run | `grade10-site-grading-collector-notifications-US1-TC13-1`: decided by the product owner after the run (Q135, Q136), stated by `grade10-site-grading-collector-notifications-SC-27` |

**Uncovered anchors:** none. Every journey of this capability — `grade10-site-grading-collector-notifications-US-01`, `grade10-site-grading-collector-notifications-US-02`, `grade10-site-grading-collector-notifications-US-03` — and every feature set group a scenario serves is walked by a living case.

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-grading-collector-notifications-US1-TC6-1` | Production only: the custodian's registered name, the shop address and the complaints contact are set in production, and no other environment prints them |
| `grade10-site-grading-collector-notifications-US1-TC2-1` | A person reads the collector's phone for the channels nothing was sent on; the worker's tests prove only what it does send |
