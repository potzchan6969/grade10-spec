# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-vault-operator-queue-US22: Operator cancels a visit knowing the collector is told

**As a** member of shop staff,
**I want** cancelling a case's visit to ask me first, naming the slot on the
shop's clock and saying the collector is emailed,
**so that** a misplaced press never tells a customer their visit is off.

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
| `<case_1>` | A case whose collector holds `<collector email>`, with a visit booked |
| `<visit slot>` | A date and time on the shop's clock, in `<shop time zone>`, a day or more ahead |
| `<shop time zone>` | The shop's own time zone, e.g. Asia/Hong_Kong (UTC+8) |
| `<collector email>` | A mailbox the tester can read |

**Steps:**

1. Click the control that cancels the visit.
2. Read the confirmation.
3. Confirm the cancellation.
4. Open the inbox of `<collector email>`.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked.
* The confirmation names `<visit slot>` on the shop's clock.
* The confirmation says the collector is emailed.
* Step 3 shows the case's visit cancelled.
* Step 4 shows one email telling the collector the visit is cancelled.

### grade10-admin-vault-operator-queue-US22-TC2-1: Backing out of the confirmation keeps the visit and sends nothing

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

### grade10-admin-vault-operator-queue-US22-TC3-1: The confirmation names the slot on the shop's clock, not the device's

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

* `<case_2>` has a visit booked at `<slot>`.
* The admin's device clock is set to `<device time zone>`.
* admin(shop staff) is on the case page of `<case_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_2>` | A case with a visit booked early in the shop's day |
| `<shop time zone>` | The shop's own time zone, e.g. Asia/Hong_Kong (UTC+8) |
| `<device time zone>` | A zone where `<slot>` falls on another calendar date, e.g. America/Los_Angeles (UTC-8 in November) |
| `<slot>` | 2026-11-03 07:00 in `<shop time zone>` |
| `<slot on the device>` | `<slot>` read in `<device time zone>`, 2026-11-02 15:00 |

**Steps:**

1. Click the control that cancels the visit.
2. Read the date and time the confirmation names.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked.
* The confirmation names `<slot>`, 2026-11-03 07:00.
* The confirmation does not name `<slot on the device>`.

---

## grade10-admin-vault-operator-queue-US23: Operator checks the forfeiture notice before it goes

**As a** member of shop staff,
**I want** sending the forfeiture notice to ask me first, naming the address it
goes to and the date to pay by it sets,
**so that** a legal deadline never starts on a misplaced press, and I know who
will read it.

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
* Step 3 shows the notice sent on the case.
* Step 4 shows one forfeiture notice naming `<date to pay by>`.

### grade10-admin-vault-operator-queue-US23-TC2-1: Backing out of the notice confirmation sends nothing and sets no date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
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
* Step 4 shows no forfeiture notice sent.
* Step 5 shows no forfeiture notice.

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
| `<date to pay by>` | The date a device in `<shop time zone>` is shown at `<send moment>` |

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

---

## grade10-admin-vault-operator-queue-US24: Operator reads how late a loan is from the case header

**As a** member of shop staff,
**I want** the case header to say how many days a live loan is past its due
date, and the date to pay by once a forfeiture notice stands,
**so that** I know where a late loan stands the moment I open its case,
without the money grant.

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

* Step 1 opens the case page, header on top.
* Step 2 reads as the row's Header reads.

### grade10-admin-vault-operator-queue-US24-TC2-1: Once a notice stands, the header names the date to pay by instead

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
* The notice set `<date to pay by>`, still ahead on the shop's clock.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_3>` | A live loan 20 days past due, a forfeiture notice sent |
| `<date to pay by>` | The date the sent notice names, on the shop's clock |

**Steps:**

1. Navigate to the case page of `<loan_3>`.
2. Read the case header.

**Expected Results:**

* Step 2 names `<date to pay by>` as the date to pay by.
* Step 2 shows no count of days past due.

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

### grade10-admin-vault-operator-queue-US24-TC4-1: A loan no longer live shows no lateness in the header

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

* The row's case holds a loan that ended after its due date.
* admin(shop staff, without the money grant) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_6>` | A loan repaid 5 days after its due date, no forfeiture notice sent |
| `<loan_7>` | A loan repaid after a forfeiture notice was sent, before its date to pay by |
| `<loan_8>` | A loan whose item was forfeited |

| Row | Case | Header reads |
| --- | --- | --- |
| Repaid late | `<loan_6>` | No days past due, no date to pay by |
| Repaid under notice | `<loan_7>` | No days past due, no date to pay by |
| Forfeited | `<loan_8>` | No days past due, no date to pay by |

**Steps:**

1. Navigate to the case page of the row's case.
2. Read the case header.

**Expected Results:**

* Step 2 reads as the row's Header reads.
