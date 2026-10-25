# grade10-site/grading/collector-notifications Test Cases

**Status:** pending-review · 0/17
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* A submission's page is `<submission page>` on the Grade10 site; it opens from any message's link with no account. Staff work it at `<console submission>` on the admin console, and the grading queue is `<console queue>`.
* `<collector inbox>` is a mailbox the tester reads, used by no other run. Grading's daily sweep and reminder sweep can be run by hand on a local stack; the shop's clock is Hong Kong's.
* Staff is admin(holds `grading:operate`), unless a case says otherwise.

## g10.grading-collector-notifications.US1: Collector hears about everything that happens to the submission

**As a** collector,
**I want** one email for each thing that happens to my submission, the drop-off's booked, moved, cancelled, missed and day-before messages among them, in English, with a link straight to the page that needs no account,
**so that** I never have to ask the shop what stage my cards are at.

<!-- trace:case id=g10.grading-collector-notifications.TC-66y rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC1: The drop-off booked email comes from grading, not the diary

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector holds a plan kept under `<collector inbox>`, a level picked and no drop-off booked, its page's drop-off picker open.

**Steps:**

1. Pick a shop, a day and a time, and click Book.
2. Open `<collector inbox>`.

**Expected Results:**

* One drop-off booked email arrives, sent by grading; no booking confirmation arrives from the diary.

<!-- trace:case id=g10.grading-collector-notifications.TC-hs8 rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC2: The handed-in email arrives in English with its papers, its footer and a link needing no account

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
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector who reads the site in Traditional Chinese planned a submission at `<level>` under `<collector inbox>` and a phone the tester holds; every footer fact is set.
* The submission is drop-off booked, every card checked on the hand-in runbook, the agreement sealed and the fee paid.

**Test data:**

| `<level>` | `<paid names>` |
| --- | --- |
| PSA Regular | the fee alone |
| PSA Express | the cover beside the fee |

**Steps:**

1. As staff, click Print labels and check in.
2. Open the handed-in email, and check the phone for any SMS or WhatsApp message.
3. Click Open your submission in a private window.

**Expected Results:**

* Step 2's email reads entirely in English, states what was paid, naming `<paid names>`, and the cards taken in, with the intake receipt and the signed agreement attached; no SMS or WhatsApp message arrives.
* Directly above its footer it names the submission id, the cards, the grader and the level; the footer names the custodian's registered name trading as Grade10, the shop, its address, its weekly hours, its phone and the complaints contact, and says its times are Hong Kong's, as every time in it is.
* Step 3 opens the submission at its own address, asking for no sign-in or account.

<!-- trace:case id=g10.grading-collector-notifications.TC-ofx rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC5: A message with no document carries no attachment

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission is with the grader, its batch shipped.

**Steps:**

1. Open the on-their-way email.

**Expected Results:**

* No document is attached.

<!-- trace:case id=g10.grading-collector-notifications.TC-cg3 rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC9: The grades email leaves out what this submission does not owe

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A collector's submission has its grades in, no card moved up a level and none returned ungraded.

**Steps:**

1. Open the grades email.

**Expected Results:**

* Each card's grade is named; no paragraph about settling or about an ungraded card appears.

<!-- trace:case id=g10.grading-collector-notifications.TC-o0b rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC15: A collector whose cards travel in two shipments is told both

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A submission of two cards shipped in two shipments, each with its own tracking.

**Steps:**

1. Open the on-their-way email.

**Expected Results:**

* It names both shipments, each with its tracking and its card.

<!-- trace:case id=g10.grading-collector-notifications.TC-ygx rev=1 covers=g10.vault-collector-notifications.SC-r3s,g10.grading-collector-notifications.SC-8jz -->
### g10.grading-collector-notifications.US1-TC8: A cancelled visit reads the same whoever cancelled it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What is sent

**Pre-conditions:**

* Collectors A and B each hold a submission with a drop-off booked; A is on their submission page, and staff on B's.

**Steps:**

1. As A, click Cancel visit and confirm.
2. As staff, click Cancel visit on B's drop-off block and confirm.
3. Open the latest grading email to each.

**Expected Results:**

* Both receive the drop-off cancelled email, in the same words, neither naming who cancelled.

<!-- trace:case id=g10.grading-collector-notifications.TC-fxc rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC12: The daily sweep sends a plan with no visit its link once

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A plan was kept yesterday, `<plan>`.

**Test data:**

| `<plan>` | `<first sweep sends>` |
| --- | --- |
| with no drop-off booked | the list-saved email with its link |
| booked and then cancelled before the sweep | the list-saved email with its link |
| booked since, the visit standing | nothing |

**Steps:**

1. Run the daily sweep.
2. Run it again the next day.

**Expected Results:**

* Step 1 sends `<first sweep sends>`.
* Step 2 sends nothing further.

<!-- trace:case id=g10.grading-collector-notifications.TC-c3n rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC13: A plan with no visit names the brand's main shop, its hours and its phone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-01

**Pre-conditions:**

* A plan kept with no drop-off booked is sent its list-saved email.

**Steps:**

1. Read the email's footer.

**Expected Results:**

* It names the brand's main shop, its address, its weekly hours from the diary and its phone.

<!-- trace:case id=g10.grading-collector-notifications.TC-twi rev=1 covers=g10.grading-collector-notifications.SC-r9o,g10.grading-collector-notifications.SC-0qd -->
### g10.grading-collector-notifications.US1-TC7: Outside production, a footer fact not set prints marked in brackets

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** The footer

**Pre-conditions:**

* On a stack that is not production, the complaints contact reads not set in the grading settings, every other footer fact set.

**Steps:**

1. Hand in a submission, and read the handed-in email's footer.

**Expected Results:**

* The email is sent; the complaints contact prints as a marked placeholder in brackets, every other fact unmarked.

<!-- trace:case id=g10.grading-collector-notifications.TC-1lh rev=1 covers=g10.grading-collector-notifications.SC-6ja,g10.grading-collector-notifications.SC-1h7,g10.grading-collector-notifications.SC-cti,g10.grading-collector-notifications.SC-c2o,g10.grading-collector-notifications.SC-sgg,g10.grading-collector-notifications.SC-f1b,g10.grading-collector-notifications.SC-v4r,g10.grading-collector-notifications.SC-mi6,g10.grading-collector-notifications.SC-faz,g10.grading-collector-notifications.SC-asi,g10.grading-collector-notifications.SC-6cs,g10.grading-collector-notifications.SC-esj,g10.grading-collector-notifications.SC-ey2 -->
### g10.grading-collector-notifications.US1-TC16: In production, a sweep letter waits for a value not set

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The footer

**Pre-conditions:**

* In production, no complaints contact is set; a ready submission has gone 30 days uncollected.

**Steps:**

1. Run the daily sweep.
2. Set the complaints contact, and run the sweep again.

**Expected Results:**

* Step 1 sends no reminder; the alert `grading.sweep.repair` names the complaints contact.
* Step 2 sends the reminder.

<!-- trace:case id=g10.grading-collector-notifications.TC-i98 rev=1 covers=g10.grading-collector-notifications.SC-1tw -->
### g10.grading-collector-notifications.US1-TC11: A reminder already sent is not sent again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Reminders and the notice

**Pre-conditions:**

* A submission ready to collect for 30 days was sent its 30-day reminder by today's sweep.

**Steps:**

1. Run the reminder sweep again the same day, and read the collector's grading emails.

**Expected Results:**

* No second reminder arrives; the inbox holds the one sent earlier.

---

## g10.grading-collector-notifications.US2: Collector is not emailed about what the counter already told them

**As a** collector who was refused a card at the counter or who named someone to collect on the page,
**I want** no email about it, the receipt and History carrying it instead,
**so that** my inbox holds only what I could not already see.

<!-- trace:case id=g10.grading-collector-notifications.TC-d0s rev=1 covers=g10.grading-collector-notifications.SC-pte,g10.grading-collector-notifications.SC-95a -->
### g10.grading-collector-notifications.US2-TC1: A card refused at the counter sends no email, and the hand-in goes on

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-02

**Pre-conditions:**

* A collector's three-card submission is drop-off booked, the booked email the latest to `<collector inbox>`; staff has the hand-in runbook open, the visit started.

**Steps:**

1. Click Refuse on the first card, pick a reason, type Crease across the front, and click Refuse this card.
2. Open the latest grading email.
3. Tick Present on the other two, seal the agreement, take payment, and click Print 2 labels and check in.
4. Open the handed-in email and the submission page.

**Expected Results:**

* Step 2's latest email is still the booked one; none names the refusal.
* Step 4's email names only the two accepted cards; the intake receipt and the page carry the refused card's badge and Crease across the front.

<!-- trace:case id=g10.grading-collector-notifications.TC-1to rev=1 covers=g10.grading-collector-notifications.SC-pte,g10.grading-collector-notifications.SC-95a -->
### g10.grading-collector-notifications.US2-TC2: Naming, changing or removing who collects sends no email, and History logs it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-02

**Pre-conditions:**

* A collector's submission is ready to collect, the ready email the latest to `<collector inbox>`; `<before>` is named to collect.

**Test data:**

| `<act>` | `<before>` | `<on the naming card>` |
| --- | --- | --- |
| naming a collector | nobody | type Chan Tai Man, and click Save |
| changing the named person | Chan Tai Man | click Change, type Wong Siu Ming, and click Save |
| removing the named person | Chan Tai Man | click Remove |

**Steps:**

1. On the submission page, `<on the naming card>`.
2. Open the latest grading email, and read History.

**Expected Results:**

* The latest email is still the ready email; History logs `<act>` with when it happened.

---

## g10.grading-collector-notifications.US3: Operator picks up a message that never went

**As a** member of shop staff,
**I want** a submission to be flagged when a message to its collector ran out of attempts, and to be able to send it again,
**so that** a provider outage costs a delay rather than a collector who was never told.

<!-- trace:case id=g10.grading-collector-notifications.TC-doy rev=1 covers=g10.grading-collector-notifications.SC-fse,g10.grading-collector-notifications.SC-5mn,g10.grading-collector-notifications.SC-57m,g10.grading-collector-notifications.SC-pgt -->
### g10.grading-collector-notifications.US3-TC3: A failed send never blocks the event it reports

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* The mail provider refuses every send; staff is on a submission with the grader.

**Steps:**

1. Record the stage that puts the grades in on its batch, and open the Timeline tab.

**Expected Results:**

* The grades are posted on the timeline as they happened, the status follows them, and the message stands owed.

<!-- trace:case id=g10.grading-collector-notifications.TC-msu rev=1 covers=g10.grading-collector-notifications.SC-fse,g10.grading-collector-notifications.SC-5mn,g10.grading-collector-notifications.SC-57m,g10.grading-collector-notifications.SC-pgt -->
### g10.grading-collector-notifications.US3-TC1: A message the retries run out on flags its submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* The mail provider refused a submission's message until its retries ran out.

**Steps:**

1. Find the submission's row on `<console queue>`, and open it.

**Expected Results:**

* The row carries Message not sent; the submission names the failed letter and its reason and offers Send again; no further attempt is made.

<!-- trace:case id=g10.grading-collector-notifications.TC-iy5 rev=1 covers=g10.grading-collector-notifications.SC-fse,g10.grading-collector-notifications.SC-5mn,g10.grading-collector-notifications.SC-57m,g10.grading-collector-notifications.SC-pgt -->
### g10.grading-collector-notifications.US3-TC4: The queue flags nothing while every message has gone

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* The mail provider has refused no send.

**Steps:**

1. Read every row of every view on `<console queue>`.

**Expected Results:**

* No row carries Message not sent.

<!-- trace:case id=g10.grading-collector-notifications.TC-g6j rev=1 covers=g10.grading-collector-notifications.SC-fse,g10.grading-collector-notifications.SC-5mn,g10.grading-collector-notifications.SC-57m,g10.grading-collector-notifications.SC-pgt -->
### g10.grading-collector-notifications.US3-TC6: Sending a parked message again clears the flag once the channel takes it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-grading-collector-notifications-US-03

**Pre-conditions:**

* A submission carries a parked message; the mail provider now accepts sends.

**Steps:**

1. Click Send again beside the failed letter.
2. Find the submission's row on `<console queue>`, and open it.

**Expected Results:**

* Step 1's letter reaches the collector once the channel accepts it.
* Step 2's row carries no Message not sent, and the page names no failed letter.

## Settled

- A read-grant holder offered no Send again is `grade10-admin/grading/counter`'s grant rule, walked in the counter suite; this spec states only that the operate grant sends a parked message again.
- The on-their-way letter's courier, order number and estimate are `grade10-admin/grading/batches`' facts; this spec states only that a letter with no document attaches nothing.
