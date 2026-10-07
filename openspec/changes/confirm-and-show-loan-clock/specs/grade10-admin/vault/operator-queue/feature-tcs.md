# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-vault-operator-queue-US8: Operator reads why a late loan cannot be forfeited yet

**As a** member of shop staff,
**I want** the custody tab to say in words why Forfeit is not offered — not
before the cure date, the notice sent on which day,
**so that** I never take an item a day early.

### grade10-admin-vault-operator-queue-US8-TC6-1: Custody tab cure date matches the confirmed date to pay by

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

* admin(holds vault:approve) is on the Custody tab of <loan_2>.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |
| `<brand time zone>` | The time zone of the brand's calendar |

**Steps:**

1. Click Send notice on the Custody tab.
2. Note the date to pay by the confirmation names.
3. Confirm the send.
4. Read the reason the Custody tab gives for withholding Forfeit.

**Expected Results:**

* Forfeit is not offered.
* The reason's cure date equals the date to pay by noted at step 2.
* The reason names today on the `<brand time zone>` calendar as the day the notice was sent.

---

## grade10-admin-vault-operator-queue-US22: Operator cancels a visit knowing the collector is told

**As a** member of shop staff,
**I want** cancelling a case's visit to ask me first, naming the slot on the
shop's clock and saying the collector is emailed,
**so that** a misplaced press never tells a customer their visit is off.

### grade10-admin-vault-operator-queue-US22-TC1-1: Confirming the cancellation cancels the visit and emails the collector

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* admin(holds vault:approve) is on the case page of <case_1>.
* The tester can read `<collector inbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case with a visit booked at `<booked shop>` for `<visit slot>` |
| `<booked shop>` | The shop the visit is booked at |
| `<visit slot>` | A slot at least one day ahead, on `<booked shop>`'s clock |
| `<collector inbox>` | The mailbox of the collector who owns `<case_1>` |

**Steps:**

1. Click the control that cancels the visit.
2. Read the confirmation.
3. Confirm the cancellation.
4. Reload the case page.
5. Open `<collector inbox>`.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked behind it.
* The confirmation names `<visit slot>` on `<booked shop>`'s clock.
* The confirmation says the collector is emailed.
* After step 4 the case shows no booked visit.
* `<collector inbox>` holds one email saying the visit is cancelled.

### grade10-admin-vault-operator-queue-US22-TC2-1: Cancellation confirmation names the slot on the booked shop's clock, not the device's

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* admin(holds vault:approve) is on the case page of <case_2>.
* The tester's device clock is set to `<device zone>`.

**Test data:**

| `<case_2>` visit booked at | Slot on the booked shop's clock | `<device zone>` | Confirmation names |
| --- | --- | --- | --- |
| A shop in UTC+8 | 23:30 on `<slot date>` | UTC+0 | 23:30 on `<slot date>` |
| A shop in UTC+8 | 00:30 on `<slot date>` | UTC-5 | 00:30 on `<slot date>` |
| A shop other than the one the admin works from, in another zone | 10:00 on `<slot date>` | The zone of the shop the admin works from | 10:00 on `<slot date>` |

**Steps:**

1. Click the control that cancels the visit.
2. Read the slot the confirmation names.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation names the slot in the row's Confirmation names column, date included.
* After step 3 the visit is still booked.

### grade10-admin-vault-operator-queue-US22-TC3-1: Dismissing the cancellation keeps the visit and emails nobody

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* admin(holds vault:approve) is on the case page of <case_1>.
* The tester can read `<collector inbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case with a visit booked at `<booked shop>` for `<visit slot>` |
| `<visit slot>` | A slot at least one day ahead, on `<booked shop>`'s clock |
| `<collector inbox>` | The mailbox of the collector who owns `<case_1>` |

**Steps:**

1. Click the control that cancels the visit.
2. Dismiss the confirmation.
3. Reload the case page.
4. Open `<collector inbox>`.

**Expected Results:**

* After step 3 the case still shows the visit at `<visit slot>`.
* `<collector inbox>` holds no cancellation email.

---

## grade10-admin-vault-operator-queue-US23: Operator checks the forfeiture notice before it goes

**As a** member of shop staff,
**I want** sending the forfeiture notice to ask me first, naming the address it
goes to and the date to pay by it sets,
**so that** a legal deadline never starts on a misplaced press, and I know who
will read it.

### grade10-admin-vault-operator-queue-US23-TC1-1: Confirming the notice sends it to the named address and sets the date to pay by

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

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The tester can read `<notice address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |
| `<notice address>` | The collector's address on file for `<loan_2>` |
| `<send date>` | Today on the `<brand time zone>` calendar |
| `<cure period>` | 14 days, the cure the Custody tab enforces |
| `<brand time zone>` | The time zone of the brand's calendar |

**Steps:**

1. Click Send notice on the Custody tab.
2. Read the confirmation.
3. Confirm the send.
4. Read the case header.
5. Open `<notice address>`.

**Expected Results:**

* Step 1 opens a confirmation; no notice is sent behind it.
* The confirmation names `<notice address>`.
* The confirmation names the date to pay by: `<send date>` plus `<cure period>`.
* After step 3, Send notice is no longer offered.
* The header names the same date to pay by as the confirmation.
* `<notice address>` holds one forfeiture notice naming that date to pay by.

### grade10-admin-vault-operator-queue-US23-TC2-1: Notice date to pay by is counted on the brand's calendar at the day boundary

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
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The clock is set to `<now>` and the tester's device clock to `<device zone>`.

**Test data:**

| `<now>` on the brand's calendar | `<device zone>` date at `<now>` | Confirmation's date to pay by |
| --- | --- | --- |
| 00:30 on `<day D>` | `<day D>` minus 1 | `<day D>` plus `<cure period>` |
| 23:30 on `<day D>` | `<day D>` plus 1 | `<day D>` plus `<cure period>` |

`<loan_2>` is a live loan 5 days past its due date with no forfeiture notice sent; `<cure period>` is 14 days.

**Steps:**

1. Click Send notice on the Custody tab.
2. Read the date to pay by the confirmation names.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation names the row's date to pay by.
* After step 3, Send notice is still offered.

### grade10-admin-vault-operator-queue-US23-TC3-1: Dismissing the notice confirmation sends nothing and starts no deadline

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
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The tester can read `<notice address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |
| `<notice address>` | The collector's address on file for `<loan_2>` |

**Steps:**

1. Click Send notice on the Custody tab.
2. Dismiss the confirmation.
3. Reload the case page.
4. Read the case header.
5. Read the Custody tab.
6. Open `<notice address>`.

**Expected Results:**

* The header still counts 5 days past due, with no date to pay by.
* The Custody tab still offers Send notice.
* The Custody tab's reason still names that no notice has been sent.
* `<notice address>` holds no forfeiture notice.

---

## grade10-admin-vault-operator-queue-US24: Operator reads how late a loan is from the case header

**As a** member of shop staff,
**I want** the case header to say how many days a live loan is past its due
date, and the date to pay by once a forfeiture notice stands,
**so that** I know where a late loan stands the moment I open its case,
without the money grant.

### grade10-admin-vault-operator-queue-US24-TC1-1: Header counts the days a live loan is past due, at the limit

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
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* admin(holds vault:approve) is on the vault queue.
* `<loan_1>` has no forfeiture notice sent.

**Test data:**

| `<loan_1>` due date, on the brand's calendar | Header reads |
| --- | --- |
| Tomorrow | No days-past-due count |
| Today | No days-past-due count |
| Yesterday | 1 day past due |
| 30 days ago | 30 days past due |

**Steps:**

1. Open the case of `<loan_1>`.
2. Read the case header.

**Expected Results:**

* The case opens on its header.
* The header reads as the row's Header reads column.
* The header names no date to pay by.

### grade10-admin-vault-operator-queue-US24-TC2-1: Header names the date to pay by once a notice stands

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

* admin(holds vault:approve) is on the vault queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_3>` | A live loan 20 days past its due date, a forfeiture notice sent `<notice sent>` |
| `<notice sent>` | 6 days ago on the brand's calendar |
| `<date to pay by>` | `<notice sent>` plus `<cure period>` |
| `<cure period>` | 14 days, the cure the Custody tab enforces |

**Steps:**

1. Open the case of `<loan_3>`.
2. Read the case header.
3. Open the Custody tab.
4. Read the cure date the reason names.

**Expected Results:**

* The header names `<date to pay by>`.
* The header shows no days-past-due count beside it.
* The Custody tab's cure date equals the header's date to pay by.

### grade10-admin-vault-operator-queue-US24-TC3-1: Header clock shows without the money grant

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* `<operator>` is signed in to the admin and on the vault queue.

**Test data:**

| `<operator>` | Case opened | Header reads |
| --- | --- | --- |
| admin(without the money grant) | `<loan_1>`, a live loan 5 days past due, no notice | 5 days past due |
| admin(without the money grant) | `<loan_3>`, a live loan with a notice sent 6 days ago | `<loan_3>`'s date to pay by |
| admin(holds the money grant) | `<loan_1>` | 5 days past due |

**Steps:**

1. Open the row's case.
2. Read the case header.

**Expected Results:**

* The case opens for every row.
* The header reads as the row's Header reads column.

### grade10-admin-vault-operator-queue-US24-TC4-1: Days past due are counted on the brand's calendar at the day boundary

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

* admin(holds vault:approve) is on the vault queue.
* The clock is set to `<now>` and the tester's device clock to `<device zone>`.
* `<loan_4>` is a live loan due on `<due day>`, no forfeiture notice sent.

**Test data:**

| `<now>` on the brand's calendar | `<device zone>` date at `<now>` | Header reads |
| --- | --- | --- |
| 00:30 on `<due day>` plus 1 | `<due day>` | 1 day past due |
| 23:30 on `<due day>` | `<due day>` plus 1 | No days-past-due count |
| 23:30 on `<due day>` plus 3 | `<due day>` plus 4 | 3 days past due |

**Steps:**

1. Open the case of `<loan_4>`.
2. Read the case header.

**Expected Results:**

* The header reads as the row's Header reads column.

### grade10-admin-vault-operator-queue-US24-TC5-1: Header carries no clock for a loan no longer live

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

* admin(holds vault:approve) is on the vault queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_5>` | A loan repaid in full 10 days after its due date |

**Steps:**

1. Open the case of `<loan_5>`.
2. Read the case header.

**Expected Results:**

* The header shows no days-past-due count.
* The header names no date to pay by.
