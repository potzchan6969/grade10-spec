# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-vault-operator-queue-US22: Operator cancels a visit knowing the collector is told

**As a** member of shop staff,
**I want** cancelling a case's visit to ask me first, naming the slot on the
shop's clock and saying the collector is emailed,
**so that** a misplaced press never tells a customer their visit is off.

<!-- trace:case id=g10adm.vault-operator-queue.TC-91h rev=1 covers=g10adm.vault-operator-queue.SC-af3,g10adm.vault-operator-queue.SC-ilj -->
### grade10-admin-vault-operator-queue-US22-TC1-1: Cancelling a visit asks first, then emails the collector

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* `<case_1>` has a visit booked at `<visit slot>`.
* admin(shop staff) is on the case page of `<case_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case at `vaulted` whose collector holds `<collector email>`, with a visit booked |
| `<visit slot>` | A date and time on the shop's clock, in `<shop time zone>`, a day or more ahead |
| `<shop time zone>` | The booked shop's own time zone, e.g. Asia/Hong_Kong (UTC+8) |
| `<collector email>` | A mailbox the tester can read |

**Steps:**

1. Click the control that cancels the visit.
2. Read the confirmation.
3. Confirm the cancellation.
4. Open the inbox of `<collector email>`.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked.
* The confirmation names `<visit slot>` and `<shop time zone>`.
* The confirmation names `<collector email>` as the address emailed.
* The confirmation says the case keeps its status.
* Step 3 shows the visit cancelled and the status still `vaulted`.
* Step 4 shows one email telling the collector the visit is cancelled.

<!-- trace:case id=g10adm.vault-operator-queue.TC-oiq rev=1 covers=g10adm.vault-operator-queue.SC-x20 -->
### grade10-admin-vault-operator-queue-US22-TC2-1: Backing out of the confirmation keeps the visit and sends nothing

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* `<case_1>` has a visit booked at `<visit slot>`.
* admin(shop staff) is on the case page of `<case_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case whose collector holds `<collector email>`, with a visit booked |
| `<visit slot>` | A date and time on the shop's clock, in `<shop time zone>`, a day or more ahead |
| `<shop time zone>` | The shop's own time zone, e.g. Asia/Hong_Kong (UTC+8) |
| `<collector email>` | A mailbox the tester can read |

**Steps:**

1. Click the control that cancels the visit.
2. Dismiss the confirmation without confirming.
3. Reload the case page.
4. Open the inbox of `<collector email>`.

**Expected Results:**

* Step 2 closes the confirmation; the visit still reads `<visit slot>`.
* Step 3 still shows the visit booked at `<visit slot>`.
* Step 4 shows no visit cancellation email.

<!-- trace:case id=g10adm.vault-operator-queue.TC-fwy rev=1 covers=g10adm.vault-operator-queue.SC-af3,g10adm.vault-operator-queue.SC-4jw -->
### grade10-admin-vault-operator-queue-US22-TC3-1: The confirmation names the slot on the booked shop's clock

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
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* The brand runs on the row's brand zone.
* `<case_2>` has a visit booked at a shop on the row's shop zone, at `<slot>`.
* The admin's device clock is set to the row's device zone.
* admin(shop staff) is on the case page of `<case_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_2>` | A case with a visit booked early in the shop's day |
| `<slot>` | 2026-11-03 07:00 on the booked shop's clock |

| Row | Brand zone | Shop zone | Device zone | Confirmation names | Never names |
| --- | --- | --- | --- | --- | --- |
| Device a day behind | Asia/Hong_Kong | Asia/Hong_Kong | America/Los_Angeles (UTC-8 in November) | 2026-11-03 07:00, Asia/Hong_Kong | 2026-11-02 15:00 |
| Shop off the brand's zone | Asia/Hong_Kong | Asia/Tokyo | Asia/Hong_Kong | 2026-11-03 07:00, Asia/Tokyo | 2026-11-03 06:00 |

**Steps:**

1. Click the control that cancels the visit.
2. Read the date, time and zone the confirmation names.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked.
* Step 2 reads the row's Confirmation names.
* Step 2 does not read the row's Never names.

<!-- trace:case id=g10adm.vault-operator-queue.TC-6nz rev=1 covers=g10adm.vault-operator-queue.SC-u9b -->
### grade10-admin-vault-operator-queue-US22-TC4-1: A case with no address says nobody is emailed

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* `<case_3>` has a visit booked and holds no email address.
* admin(shop staff) is on the case page of `<case_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_3>` | A case with a visit booked and no email address on its contact |

**Steps:**

1. Click the control that cancels the visit.
2. Read the confirmation.
3. Dismiss the confirmation without confirming.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked.
* Step 2 reads that nobody is emailed.
* Step 2 names no email address.

<!-- trace:case id=g10adm.vault-operator-queue.TC-rba rev=1 covers=g10adm.vault-operator-queue.SC-jyk -->
### grade10-admin-vault-operator-queue-US22-TC5-1: A cancel refused after the confirmation opened stays in it

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* `<case_4>` has a visit booked.
* admin(shop staff) has the case page of `<case_4>` open in two browser tabs, A and B.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_4>` | A live case with a visit booked |

**Steps:**

1. In tab A, click the control that cancels the visit.
2. In tab B, cancel the case from the Case tab.
3. In tab A, confirm the cancellation.

**Expected Results:**

* Step 1 opens a confirmation in tab A.
* Step 3 shows the refusal inside the confirmation.
* The confirmation stays open after step 3.

---

## grade10-admin-vault-operator-queue-US23: Operator checks the forfeiture notice before it goes

**As a** member of shop staff,
**I want** sending the forfeiture notice to ask me first, naming the address it
goes to and the date to pay by it sets,
**so that** a legal deadline never starts on a misplaced press, and I know who
will read it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-mvo rev=1 covers=g10adm.vault-operator-queue.SC-5hv,g10adm.vault-operator-queue.SC-1bh -->
### grade10-admin-vault-operator-queue-US23-TC1-1: Sending the notice asks first, naming the address and the date to pay by

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
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* `<loan_1>` is past its due date with no forfeiture notice sent.
* admin(shop staff) is on the case page of `<loan_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_1>` | A live loan past its due date, its collector holding `<collector email>` |
| `<collector email>` | A mailbox the tester can read |
| `<date to pay by>` | The date the confirmation names, on the shop's clock |

**Steps:**

1. Click the control that sends the forfeiture notice.
2. Read the confirmation.
3. Confirm sending the notice.
4. Open the inbox of `<collector email>`.

**Expected Results:**

* Step 1 opens a confirmation; no notice is sent yet.
* The confirmation names `<collector email>` as where the notice goes.
* The confirmation names `<date to pay by>`.
* The confirming button is drawn in the destructive tone.
* Step 3 shows the notice sent; the header names `<date to pay by>`.
* Step 4 shows one forfeiture notice naming `<date to pay by>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-9cu rev=1 covers=g10adm.vault-operator-queue.SC-wro -->
### grade10-admin-vault-operator-queue-US23-TC2-1: Backing out of the notice confirmation sends nothing and sets no date

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
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* `<loan_1>` is past its due date with no forfeiture notice sent.
* admin(shop staff) is on the case page of `<loan_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_1>` | A live loan past its due date, its collector holding `<collector email>` |
| `<collector email>` | A mailbox the tester can read |

**Steps:**

1. Click the control that sends the forfeiture notice.
2. Dismiss the confirmation without confirming.
3. Reload the case page.
4. Open the custody tab.
5. Open the inbox of `<collector email>`.

**Expected Results:**

* Step 2 closes the confirmation; no notice shows as sent.
* Step 3 shows the case header with no date to pay by.
* Step 4 shows no forfeiture notice sent, and still offers sending it.
* Step 5 shows no forfeiture notice.

<!-- trace:case id=g10adm.vault-operator-queue.TC-gqy rev=1 covers=g10adm.vault-operator-queue.SC-5hv -->
### grade10-admin-vault-operator-queue-US23-TC3-1: The date to pay by follows the shop's clock, whatever the device's zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* `<loan_1>` is past its due date with no forfeiture notice sent.
* The shop's clock reads `<send moment>`.
* The admin's device clock is set to the row's device time zone.
* admin(shop staff) is on the case page of `<loan_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_1>` | A live loan past its due date, its collector holding `<collector email>` |
| `<shop time zone>` | The shop's own time zone, e.g. Asia/Hong_Kong (UTC+8) |
| `<send moment>` | 2026-11-03 23:30 in `<shop time zone>`, the shop's last half hour of the day |
| `<notice period>` | The brand's notice period, e.g. 14 days |
| `<date to pay by>` | 2026-11-03 plus `<notice period>`, 2026-11-17 for 14 days |

| Row | Device time zone | Device's own date at `<send moment>` | Confirmation names |
| --- | --- | --- | --- |
| Same zone | `<shop time zone>` | 2026-11-03 | `<date to pay by>` |
| Behind the shop | America/Los_Angeles (UTC-8 in November) | 2026-11-03, 07:30 | `<date to pay by>` |
| Ahead of the shop | Pacific/Auckland (UTC+13) | 2026-11-04, 04:30 | `<date to pay by>` |

**Steps:**

1. Click the control that sends the forfeiture notice.
2. Read the date to pay by the confirmation names.
3. Dismiss the confirmation without confirming.

**Expected Results:**

* Step 1 opens a confirmation; no notice is sent yet.
* Step 2 reads the row's date in Confirmation names.

<!-- trace:case id=g10adm.vault-operator-queue.TC-s90 rev=1 covers=g10adm.vault-operator-queue.SC-mu0 -->
### grade10-admin-vault-operator-queue-US23-TC4-1: A shop day that turns before the send names the later date

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* The brand's notice period is `<notice period>`.
* `<loan_1>` is past its due date with no forfeiture notice sent.
* The shop's clock reads `<open moment>`.
* admin(shop staff) is on the case page of `<loan_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_1>` | A live loan past its due date, its collector holding `<collector email>` |
| `<notice period>` | 14 days |
| `<open moment>` | 2026-12-01 23:59 on the shop's clock |
| `<send moment>` | 2026-12-02 00:01 on the shop's clock |

**Steps:**

1. Click the control that sends the forfeiture notice.
2. Read the date to pay by the confirmation names.
3. Wait until the shop's clock reads `<send moment>`.
4. Confirm sending the notice.
5. Open the custody tab.

**Expected Results:**

* Step 2 names 2026-12-15, `<open moment>`'s day plus `<notice period>`.
* Step 4 closes the confirmation; no second confirmation opens.
* Step 5 shows the notice naming 2026-12-16 as the date to pay by.

<!-- trace:case id=g10adm.vault-operator-queue.TC-swa rev=1 covers=g10adm.vault-operator-queue.SC-jnl -->
### grade10-admin-vault-operator-queue-US23-TC5-1: A case with no address says nobody is emailed

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
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* `<loan_9>` is past its due date with no forfeiture notice sent.
* admin(shop staff) is on the case page of `<loan_9>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_9>` | A live loan past its due date, no email address on its contact |

**Steps:**

1. Click the control that sends the forfeiture notice.
2. Read the confirmation.
3. Dismiss the confirmation without confirming.

**Expected Results:**

* Step 1 opens a confirmation; no notice is sent yet.
* Step 2 reads that nobody is emailed, and names no address.
* Step 2 names a date to pay by.

<!-- trace:case id=g10adm.vault-operator-queue.TC-z5n rev=1 covers=g10adm.vault-operator-queue.SC-ekb -->
### grade10-admin-vault-operator-queue-US23-TC6-1: With no notice period the confirmation says so and keeps the refusal

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* The brand has set no notice period.
* `<loan_1>` is past its due date with no forfeiture notice sent.
* admin(shop staff) is on the case page of `<loan_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_1>` | A live loan past its due date, its collector holding `<collector email>` |

**Steps:**

1. Click the control that sends the forfeiture notice.
2. Read the confirmation.
3. Confirm sending the notice.
4. Dismiss the confirmation.
5. Open the custody tab.

**Expected Results:**

* Step 2 reads that no date to pay by can be named without a notice period.
* Step 3 shows the refusal inside the confirmation, which stays open.
* Step 5 shows no forfeiture notice sent.

---

## grade10-admin-vault-operator-queue-US24: Operator reads how late a loan is from the case header

**As a** member of shop staff,
**I want** the case header to say how many days a live loan is past its due
date, and the date to pay by once a forfeiture notice stands,
**so that** I know where a late loan stands the moment I open its case,
without the money grant.

<!-- trace:case id=g10adm.vault-operator-queue.TC-jzz rev=1 covers=g10adm.vault-operator-queue.SC-syo,g10adm.vault-operator-queue.SC-jhz,g10adm.vault-operator-queue.SC-fgo -->
### grade10-admin-vault-operator-queue-US24-TC1-1: The header counts the days a live loan is past due

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* `<loan_2>` is live, with no forfeiture notice sent.
* `<loan_2>`'s due date is the row's due date.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan, no forfeiture notice sent |
| `<shop today>` | Today's date on the shop's clock |

| Row | Due date | Header reads |
| --- | --- | --- |
| Not yet due | `<shop today>` plus 3 days | No days past due |
| Due today, at the limit | `<shop today>` | No days past due |
| One day past due | `<shop today>` minus 1 day | 1 day past due |
| Many days past due | `<shop today>` minus 12 days | 12 days past due |

**Steps:**

1. Navigate to the case page of `<loan_2>`.
2. Read the case header.

**Expected Results:**

* Step 1 opens the case page, header on top, with no Payouts tab.
* Step 2 reads as the row's Header reads.
* Step 2 shows no badge saying the case waits on staff for being late.

<!-- trace:case id=g10adm.vault-operator-queue.TC-tac rev=1 covers=g10adm.vault-operator-queue.SC-j1h,g10adm.vault-operator-queue.SC-b6w -->
### grade10-admin-vault-operator-queue-US24-TC2-1: Once a notice stands, the header names the date to pay by instead

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* `<loan_3>` is live, past its due date, with a forfeiture notice sent.
* The notice set the row's date to pay by.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_3>` | A live loan 20 days past due, a forfeiture notice sent |
| `<shop today>` | Today's date on the shop's clock |

| Row | Date to pay by |
| --- | --- |
| Still ahead | `<shop today>` plus 5 days |
| Passed | `<shop today>` minus 1 day |

**Steps:**

1. Navigate to the case page of `<loan_3>`.
2. Read the case header.

**Expected Results:**

* Step 2 names the row's date to pay by.
* Step 2 shows no count of days past due.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xw0 rev=1 covers=g10adm.vault-operator-queue.SC-9xn,g10adm.vault-operator-queue.SC-j1h -->
### grade10-admin-vault-operator-queue-US24-TC3-1: The header counts days and dates on the shop's clock

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
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* The shop's clock reads `<open moment>`.
* The admin's device clock is set to `<device time zone>`.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop time zone>` | The shop's own time zone, e.g. Asia/Hong_Kong (UTC+8) |
| `<device time zone>` | America/Los_Angeles (UTC-8 in November), a calendar day behind the shop at `<open moment>` |
| `<open moment>` | 2026-11-04 00:30 in `<shop time zone>`, 2026-11-03 08:30 on the device |
| `<loan_4>` | A live loan due 2026-11-03, no forfeiture notice sent |
| `<loan_5>` | A live loan with a forfeiture notice standing, its date to pay by 2026-11-20 on the shop's clock |

| Row | Case | Header reads |
| --- | --- | --- |
| Count | `<loan_4>` | 1 day past due |
| Date to pay by | `<loan_5>` | 2026-11-20 as the date to pay by |

**Steps:**

1. Navigate to the case page of the row's case.
2. Read the case header.

**Expected Results:**

* Step 2 reads as the row's Header reads.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ymw rev=1 covers=g10adm.vault-operator-queue.SC-6jj -->
### grade10-admin-vault-operator-queue-US24-TC4-1: A case running no loan shows no lateness in the header

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* The row's case runs no loan: storage only, repaid or forfeited.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_6>` | A loan repaid 5 days after its due date, no forfeiture notice sent |
| `<loan_7>` | A loan repaid after a forfeiture notice was sent, before its date to pay by |
| `<loan_8>` | A loan whose item was forfeited |
| `<case_9>` | A storage case at `vaulted`, no loan |

| Row | Case | Header reads |
| --- | --- | --- |
| Storage | `<case_9>` | No days past due, no date to pay by |
| Repaid late | `<loan_6>` | No days past due, no date to pay by |
| Repaid under notice | `<loan_7>` | No days past due, no date to pay by |
| Forfeited | `<loan_8>` | No days past due, no date to pay by |

**Steps:**

1. Navigate to the case page of the row's case.
2. Read the case header.

**Expected Results:**

* Step 2 reads as the row's Header reads.

<!-- trace:case id=g10adm.vault-operator-queue.TC-nz9 rev=1 covers=g10adm.vault-operator-queue.SC-g7w -->
### grade10-admin-vault-operator-queue-US24-TC5-1: The count takes no grace days off

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* The brand's grace is `<grace days>`.
* `<loan_10>` is live, with no forfeiture notice sent.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<grace days>` | 3 days |
| `<loan_10>` | A live loan due `<shop today>` minus 2 days, no forfeiture notice sent |
| `<shop today>` | Today's date on the shop's clock |

**Steps:**

1. Navigate to the case page of `<loan_10>`.
2. Read the case header.

**Expected Results:**

* Step 2 reads 2 days past due, with no grace taken off.

## Reconciliation

**Run:** 2026-10-07. QA1 wrote ten blind cases from the frozen outline,
journeys US-22 to US-24, the proposal, decisions Q1 to Q16 and the Operator
Console page, denied every `## Requirements` section and the archive. QA2
joined them on those anchors with Dev's SC-97 to SC-115, the tech design and
the tasks, then applied Q17 and Q18. No domain suite sits above the
capability, and the product suite traces none of the three new journeys.

| Blind case or scenario | Disposition |
| --- | --- |
| `US22-TC1-1` | **Folded:** SC-105 and SC-107; joined the address, the status kept, the shop's zone and the status after the cancel |
| `US22-TC2-1` | **Folded:** SC-106; Behaviour set to `positive`, since backing out unwinds nothing |
| `US22-TC3-1` | **Folded:** SC-105 and SC-105a; a row added for a shop off the brand's zone, after Q17 corrected the scenario from the brand's zone |
| `US23-TC1-1` | **Folded:** SC-110 and SC-112; joined the destructive tone and the header's date after the send |
| `US23-TC2-1` | **Folded:** SC-111; joined the notice still offered; Behaviour set to `positive` |
| `US23-TC3-1` | **Folded:** SC-110; the date to pay by derived from the notice period rather than from the device |
| `US24-TC1-1` | **Folded:** SC-97, SC-99 and SC-104; joined no waits-on-staff badge and no Payouts tab |
| `US24-TC2-1` | **Folded:** SC-100 and SC-101; a row added for a date already passed |
| `US24-TC3-1` | **Folded:** SC-98 and SC-100 |
| `US24-TC4-1` | **Folded:** SC-102; a row added for a storage case |
| SC-108, SC-109 | **Uncovered by QA1:** `US22-TC4-1` and `US22-TC5-1` added |
| SC-113, SC-114, SC-115 | **Uncovered by QA1:** `US23-TC4-1`, `US23-TC5-1` and `US23-TC6-1` added |
| SC-103 | **Uncovered by QA1:** `US24-TC5-1` added |
| Rejected cases | none |
| Contradicted readings | The Cancel visit confirm's clock: QA1 read the shop's clock, Dev the brand's zone. Raised, landed as Q17, and SC-105, SC-105a and the tech design follow it |
| Raised for the human | A visit cancelled or moved in another tab before the press: no case and no scenario until it lands in `decisions.md` |
| Uncovered scenarios | none |

QA1's open points closed from the record: pay-by in place of the count (Q7),
the header after the pay-by date (Q11), the pay-by date as the cure date
counted from the brand's notice period (Q11, Q13), the address (Q12), a second
notice (the non-goal on when a notice may be sent; the act is offered only
while no notice stands), the grant for each act (the page's Permissions:
`vault:operate` for the visit, `vault:approve` for the notice), a case with no
loan (Q10), and whether the confirm names the zone (Q17). The grace question
is the PRD's ❓ on two late counts; Q18 holds the count until it lands.
