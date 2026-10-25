# grade10-site/vault/collector-notifications Test Cases

**Status:** pending-review · 2/23
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (api):** grade10-site-vault-collector-notifications-SC-12 - a mail provider that accepts a send and never answers, which no screen can set up

## Background

* Vault letters reach the collector's account email, read in an inbox the tester reads; nothing is sent to a phone. A tester moves the environment's clock and runs the vault's sweeps to reach a moment; the brand's clock is Hong Kong's.
* What the collector was told, and a parked message, read on the console case page's Custody tab by admin(holds `vault:operate`). The environment's mail provider can be set to refuse sends.
* A borrower's loan is HKD39,000.00 advanced, due on `<due date>`, unless a case says otherwise.

## Walk 1: A borrower hears about the loan from advance to notice

Starting state:

- customer(collector) with an accepted offer; treasurer at the counter.

Shared test data:

| Field | Value |
| --- | --- |
| due date | 30 days from the advance |

### Route

1. Record the advance.
   - The advance letter tables the amount, `<due date>`, the total, a late day's cost, how to pay, and the reminder dates. `g10.vault-collector-notifications.US5-TC8`
2. Move the clock to 7 days before `<due date>`, after 09:00, and sweep.
   - One due-soon reminder tabling what is owed. `g10.vault-collector-notifications.US1-TC1`
3. Move the clock to 14 days past `<due date>` and sweep.
   - One overdue reminder, its late interest apart. `g10.vault-collector-notifications.US1-TC2`
4. Send the forfeiture notice; sweep again a week later.
   - The notice names its clause and date; no reminder follows. `g10.vault-collector-notifications.US5-TC4`

## g10.vault-collector-notifications.US1: Borrower is warned before the due date and while it runs late

**As a** borrower,
**I want** a message a week and a day before my loan is due, and one every
week it stays late,
**so that** I know what I owe and what a late week costs before anything is
taken.

<!-- trace:case id=g10.vault-collector-notifications.TC-ti5 rev=1 covers=g10.vault-collector-notifications.SC-jys,g10.vault-collector-notifications.SC-vqz,g10.vault-collector-notifications.SC-gdg,g10.vault-collector-notifications.SC-3f7,g10.vault-collector-notifications.SC-tgx,g10.vault-collector-notifications.SC-3ke,g10.vault-collector-notifications.SC-0ul,g10.vault-collector-notifications.SC-k1j -->
### g10.vault-collector-notifications.US1-TC1: Reminders come a week and a day before the due date, in the morning, tabling what is owed

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
* **Trace:** grade10-site-vault-collector-notifications-US-01

**Pre-conditions:**

* The borrower's loan is running, due on `<due date>`, nothing repaid.

**Test data:**

| `<sweep at>` | `<inbox>` |
| --- | --- |
| 00:30 on the day 7 days before `<due date>` | nothing yet |
| 09:05 on that day | one due-soon reminder |
| 09:05 on the day before `<due date>` | a second due-soon reminder |

**Steps:**

1. Run the reminder sweep at `<sweep at>`.
2. Read the inbox.

**Expected Results:**

* It holds `<inbox>`; a reminder tables what is owed at that reading, `<due date>`, and what each day from the day after adds, with how to pay.

<!-- trace:case id=g10.vault-collector-notifications.TC-qos rev=1 covers=g10.vault-collector-notifications.SC-jys,g10.vault-collector-notifications.SC-vqz,g10.vault-collector-notifications.SC-gdg,g10.vault-collector-notifications.SC-3f7,g10.vault-collector-notifications.SC-tgx,g10.vault-collector-notifications.SC-3ke,g10.vault-collector-notifications.SC-0ul,g10.vault-collector-notifications.SC-k1j -->
### g10.vault-collector-notifications.US1-TC2: A late loan is reminded once a week, once however long it went untold, with its late interest apart

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
* **Trace:** grade10-site-vault-collector-notifications-US-01

**Pre-conditions:**

* The borrower's loan was due on `<due date>`, nothing repaid, `<history>`.

**Test data:**

| `<history>` | `<sweep at>` | `<inbox>` |
| --- | --- | --- |
| no overdue reminder yet | 7 days past `<due date>` | one overdue reminder |
| a reminder at 7 days | 14 days past `<due date>` | a second overdue reminder |
| no reminder sent, 90 days late | 90 days past `<due date>` | one overdue reminder, not one per week missed |

**Steps:**

1. Run the reminder sweep at `<sweep at>`, and read the inbox.

**Expected Results:**

* It holds `<inbox>`; each tables what is owed, the date it was due, how much of it is late interest, and what each further day adds.

<!-- trace:case id=g10.vault-collector-notifications.TC-1kf rev=1 covers=g10.vault-collector-notifications.SC-jys,g10.vault-collector-notifications.SC-vqz,g10.vault-collector-notifications.SC-gdg,g10.vault-collector-notifications.SC-3f7,g10.vault-collector-notifications.SC-tgx,g10.vault-collector-notifications.SC-3ke,g10.vault-collector-notifications.SC-0ul,g10.vault-collector-notifications.SC-k1j -->
### g10.vault-collector-notifications.US1-TC3: A forfeiture notice stops the reminders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-01

**Pre-conditions:**

* The borrower's late loan carries a forfeiture notice; its next weekly reminder falls today.

**Steps:**

1. Run the reminder sweep, and read the inbox.

**Expected Results:**

* No reminder arrives; the notice is still the last letter.

<!-- trace:case id=g10.vault-collector-notifications.TC-kba rev=1 -->
### g10.vault-collector-notifications.US1-TC4: A reminder sweep run twice in a day sends once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reminders

**Pre-conditions:**

* The borrower's 7-day reminder was sent this morning.

**Steps:**

1. Run the reminder sweep again the same day, and read the inbox.

**Expected Results:**

* Nothing further arrives.

---

## g10.vault-collector-notifications.US2: Collector hears about everything that happens to their case

**As a** collector,
**I want** a message for each thing that happens to my case, with a link
straight to it,
**so that** I never have to ask the shop what stage my item is at.

<!-- trace:case id=g10.vault-collector-notifications.TC-v95 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US2-TC1: Every letter names its case and item above the footer, links to the case, and is signed by the right party

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The collector's case has just sent `<letter>`.

**Test data:**

| `<letter>` | `<footer names>` |
| --- | --- |
| the item-vaulted letter | the custodian, under its registered name, with the complaints contact; no lender or licence line |
| the offer letter | the lender, under its registered name, with the complaints contact and the licence line |

**Steps:**

1. Read the letter above its footer, and the footer.
2. Select its action link.

**Expected Results:**

* Step 1: the case reference and the item's title sit directly above a footer naming `<footer names>`.
* Step 2 opens that case at its own address.

<!-- trace:case id=g10.vault-collector-notifications.TC-4a2 rev=1 -->
### g10.vault-collector-notifications.US2-TC2: Each way a request runs out is told in its own words

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
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The collector opened a request themselves, which then `<ending>`.

**Test data:**

| `<ending>` | `<letter says>` |
| --- | --- |
| was left an untouched draft for 8 days | the request was never sent in |
| was sent in, and nobody booked a visit in time | no visit was booked |
| was sent in, and its drop-off visit was missed | the visit was missed |

**Steps:**

1. Let the sweeps run past the ending, and read the inbox.

**Expected Results:**

* One letter says `<letter says>`, and not the others' words.

<!-- trace:case id=g10.vault-collector-notifications.TC-blx rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US2-TC14: Cancelling a draft staff opened sends nothing, and a sent one is told as any case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* `<case>` is a walk-in staff opened for an address the tester reads, `<state>`; admin(holds `vault:operate`) is on its page.

**Test data:**

| `<state>` | `<letter>` |
| --- | --- |
| an unsent draft | none |
| sent by its collector, now submitted | the cancelled letter, linking the case |

**Steps:**

1. Cancel the case and confirm; wait 5 minutes and read the inbox.

**Expected Results:**

* The inbox holds `<letter>`.

<!-- trace:case id=g10.vault-collector-notifications.TC-qm8 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US2-TC15: A draft staff opened expires with no untouched letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What is sent

**Pre-conditions:**

* `<draft>` has gone untouched for 8 days; its address is one the tester reads.

**Test data:**

| `<draft>` | `<letter>` |
| --- | --- |
| a draft staff opened at the counter | none |
| a draft the collector opened themselves | the untouched letter |

**Steps:**

1. Let the draft sweep run; wait 5 minutes and read the inbox.

**Expected Results:**

* The draft ends as expired; the inbox holds `<letter>`.

<!-- trace:case id=g10.vault-collector-notifications.TC-vz9 rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US2-TC12: A money record taken back reaches the borrower without naming who took it back

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The borrower's case carries a recorded repayment; admin(holds `vault:operate`) is on its console page.

**Steps:**

1. Take the repayment back, and read the borrower's inbox.

**Expected Results:**

* A letter names the amount taken back and what the case owes now, and names nobody who recorded it or took it back.

<!-- trace:case id=g10.vault-collector-notifications.TC-syo rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US2-TC6: A letter reads the case as it stands when it goes, not when it was queued

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* A letter was queued for the case while the mail provider refused sends; staff then changed the item's title.

**Steps:**

1. Let the provider accept again and the retry go; read the letter.

**Expected Results:**

* It carries the new title, and the case's address and currency as they stand now.

<!-- trace:case id=g10.vault-collector-notifications.TC-vxt rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US2-TC7: WhatsApp opens only when staff select its link, and the vault sends nothing itself

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The case has a WhatsApp number; admin(holds `vault:operate`) is on its console page.

**Steps:**

1. Select the header's WhatsApp link, and choose one of the six templates.
2. Read the Custody tab and the collector's inbox.

**Expected Results:**

* Step 1 opens the chat app with that template, addressed to the number.
* Step 2: the vault queued and sent nothing.

---

## g10.vault-collector-notifications.US3: Signer leaves with the documents they signed

**As a** person who has just signed at the counter,
**I want** the sealed set mailed to me once, with the documents attached,
**so that** I hold my own copy without asking for one.

<!-- trace:case id=g10.vault-collector-notifications.TC-1xt rev=1 covers=g10.vault-collector-notifications.SC-r2t,g10.vault-collector-notifications.SC-lmz,g10.vault-collector-notifications.SC-4ig -->
### g10.vault-collector-notifications.US3-TC1: The signer is mailed the sealed set once, its documents read from the packet each time it goes

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
* **Trace:** grade10-site-vault-collector-notifications-US-03

**Pre-conditions:**

* A packet has just been sealed at the counter; `<delivery>`.

**Test data:**

| `<delivery>` | `<signer receives>` |
| --- | --- |
| the delivery sweep runs twice at once | one letter, the sealed documents attached |
| the first send failed; the retry runs hours later | one letter, the documents as the packet holds them sealed |
| the sealed set is over the mail's size cap | one letter, no attachments, linking to the case |

**Steps:**

1. Let the delivery go as `<delivery>` says, and read the signer's inbox.

**Expected Results:**

* It holds `<signer receives>`.

---

## g10.vault-collector-notifications.US4: Operator picks up a message that never went

**As a** member of shop staff,
**I want** a case to be flagged when a message to its collector ran out of
attempts, and to be able to send it again,
**so that** a provider outage costs a delay rather than a customer who was
never told.

<!-- trace:case id=g10.vault-collector-notifications.TC-fvw rev=1 covers=g10.vault-collector-notifications.SC-6iy,g10.vault-collector-notifications.SC-qld,g10.vault-collector-notifications.SC-lzl,g10.vault-collector-notifications.SC-xyv -->
### g10.vault-collector-notifications.US4-TC1: The item is vaulted though its letter could not go, and the letter is owed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-04

**Pre-conditions:**

* The mail provider refuses every send; admin(holds `vault:operate`) takes an item into the vault.

**Steps:**

1. Read the case and its Custody tab.

**Expected Results:**

* The item reads vaulted; the item-vaulted letter shows as owed.

<!-- trace:case id=g10.vault-collector-notifications.TC-fys rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US4-TC2: An owed letter is tried five times, then parked with its reason and the case flagged

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-04

**Pre-conditions:**

* A letter on the case is owed, the provider refusing every send.

**Steps:**

1. Run the retry sweep from 5 minutes after the failure to 6 hours after it, reading the Custody tab after each attempt.
2. Run it once more after the fifth attempt fails.

**Expected Results:**

* Step 1 shows each of five attempts, the letter still owed until the fifth fails; then it is parked with the provider's reason, and the case is flagged for staff.
* Step 2 makes no further attempt.

<!-- trace:case id=g10.vault-collector-notifications.TC-ipr rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US4-TC3: Send again puts a parked letter back on the queue, to the address as it now stands

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
* **Trace:** grade10-site-vault-collector-notifications-US-04

**Pre-conditions:**

* A letter on the case is parked and the case flagged; the provider accepts sends again; `<address>`.

**Test data:**

| `<address>` | `<goes to>` |
| --- | --- |
| unchanged | the collector's address |
| corrected by the collector since | the corrected address |

**Steps:**

1. As admin(holds `vault:operate`), select Send again beside it; run the retry sweep.
2. Read the Custody tab and the inbox.

**Expected Results:**

* The letter arrives at `<goes to>`; it no longer reads parked, and the flag clears.

<!-- trace:case id=g10.vault-collector-notifications.TC-8zc rev=1 covers=g10.vault-collector-notifications.SC-fp2,g10.vault-collector-notifications.SC-03a,g10.vault-collector-notifications.SC-nte,g10.vault-collector-notifications.SC-2ff,g10.vault-collector-notifications.SC-ayk,g10.vault-collector-notifications.SC-3bq -->
### g10.vault-collector-notifications.US4-TC4: A case with no address left is never mailed, and its letter is counted unreachable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The reader

**Pre-conditions:**

* The collector's contact has been erased; an event on the case would send a letter.

**Steps:**

1. Let the event happen, and read the Custody tab.

**Expected Results:**

* Nothing is sent, by mail or any other way; the letter reads unreachable, not owed.

---

## g10.vault-collector-notifications.US5: Borrower reads the figures in the message itself

**As a** borrower,
**I want** every money message to table the amount, the date, what a late day
costs and how to pay, and the notice to name the clause, the date to pay by
and that a person decides,
**so that** the message is a record I can act on without opening the page.

<!-- trace:case id=g10.vault-collector-notifications.TC-p0d rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### g10.vault-collector-notifications.US5-TC1: A money letter tables its figures and carries the case page's own how-to-pay

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The borrower's loan is running; a money letter has arrived.

**Steps:**

1. Read the letter's figures and how-to-pay block.
2. Compare the block with the case page's.

**Expected Results:**

* The amount, the due date and a late day's cost are a table, not repeated in a sentence.
* Both blocks name the same FPS id, bank account, and the case reference as the transfer reference.

<!-- trace:case id=g10.vault-collector-notifications.TC-ht8 rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### g10.vault-collector-notifications.US5-TC8: The offer and advance letters table their terms, and the advance names the reminder dates

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
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The collector's case has just `<act>`.

**Test data:**

| `<act>` | `<letter tables>` |
| --- | --- |
| been made an offer of HKD40,000.00 over 90 days | the loan, the term, the interest for it, the total to repay, a late day's cost and the day the offer is open until |
| had HKD39,000.00 advanced | the amount sent, the due date, the total to repay and what each day after the due date adds, with how to pay; then the dates of the next reminders, saying a reminder adds nothing to what is owed |

**Steps:**

1. Read the letter.

**Expected Results:**

* It tables `<letter tables>`; no figure is readable only in a sentence.

<!-- trace:case id=g10.vault-collector-notifications.TC-w3y rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### g10.vault-collector-notifications.US5-TC4: The forfeiture notice names its clause, the date to pay by, and that a person decides

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The borrower's late loan has just been sent its forfeiture notice.

**Steps:**

1. Read the notice.

**Expected Results:**

* It opens on the loan agreement's clause it acts under, tables the date to pay in full by, what is owed and what each further day adds, and names when the item lapses.
* It says taking the item is a person's decision, and that no further reminder follows.

<!-- trace:case id=g10.vault-collector-notifications.TC-pfx rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### g10.vault-collector-notifications.US5-TC5: A money letter carries the case line and the lender's footer with its licence line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The borrower's loan is running; a money letter has arrived.

**Steps:**

1. Read the letter.

**Expected Results:**

* It carries the case reference and the item; the footer names the lender under its registered name, the complaints contact and the licence line.

<!-- trace:case id=g10.vault-collector-notifications.TC-zxh rev=1 -->
### g10.vault-collector-notifications.US5-TC9: A recorded repayment's letter tables what was paid and what is left

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* The borrower owes HKD39,800.00; treasurer records a repayment of HKD20,000.00.

**Steps:**

1. Read the repayment letter.

**Expected Results:**

* It tables HKD20,000.00 recorded and HKD19,800.00 left, with how to pay while anything is outstanding.

<!-- trace:case id=g10.vault-collector-notifications.TC-bh4 rev=1 covers=g10.vault-collector-notifications.SC-tz5 -->
### g10.vault-collector-notifications.US5-TC6: Outside production an unset value prints as a marked placeholder, and the letter still goes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What a message carries

**Pre-conditions:**

* Outside production, the lender has no bank account set.

**Steps:**

1. Record an advance, and read its letter.

**Expected Results:**

* The letter arrives, printing a bracketed placeholder naming the unset value where the bank account belongs.

<!-- trace:case id=g10.vault-collector-notifications.TC-qu7 rev=1 covers=g10.vault-collector-notifications.SC-o0k,g10.vault-collector-notifications.SC-a2c,g10.vault-collector-notifications.SC-sar -->
### g10.vault-collector-notifications.US5-TC7: In production an act whose letter would print an unset value is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-05

**Pre-conditions:**

* In production, the lender has no FPS id set; treasurer is on an accepted financed case.

**Steps:**

1. Record the advance; read the case and the borrower's inbox.

**Expected Results:**

* The advance is refused, naming the FPS id; nothing is recorded or sent.

## Settled

- A retried send's attachments are the packet's sealed copy at that moment, read from the packet each attempt.
- The panel's Send again on a check still out is `grade10-admin/vault/operator-queue`'s.
- The unset-value rule is whole here — bracketed outside production, refused in production, the letter rendered before the record commits — and `grade10-site/vault/loan-and-settlement` names it rather than restating it.
