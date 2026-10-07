# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-vault-operator-queue-US8: Operator reads why a late loan cannot be forfeited yet

**As a** member of shop staff,
**I want** the custody tab to say in words why Forfeit is not offered — not
before the cure date, the notice sent on which day,
**so that** I never take an item a day early.

<!-- trace:case id=g10adm.vault-operator-queue.TC-fe2 rev=1 covers=g10adm.vault-operator-queue.SC-xep -->
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

1. Click Send forfeiture notice on the Custody tab.
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

<!-- trace:case id=g10adm.vault-operator-queue.TC-h1b rev=1 covers=g10adm.vault-operator-queue.SC-af3,g10adm.vault-operator-queue.SC-ilj -->
### grade10-admin-vault-operator-queue-US22-TC1-1: Confirming the cancellation cancels the visit and emails the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the case page of <case_1>.
* The tester can read `<collector inbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A `vaulted` case with a visit booked at `<booked shop>` for `<visit slot>`, holding `<collector address>` |
| `<booked shop>` | The shop the visit is booked at |
| `<visit slot>` | A slot at least one day ahead, on `<booked shop>`'s clock |
| `<collector address>` | The email address on `<case_1>` |
| `<collector inbox>` | The mailbox of `<collector address>` |

**Steps:**

1. Click the control that cancels the visit.
2. Read the confirmation.
3. Confirm the cancellation.
4. Reload the case page.
5. Open `<collector inbox>`.

**Expected Results:**

* Step 1 opens a confirmation; the visit is still booked behind it.
* The confirmation names `<visit slot>` on `<booked shop>`'s clock, with its zone.
* The confirmation says the collector is emailed at `<collector address>`.
* The confirmation says the case keeps its status.
* Its two choices read `Keep visit` and `Cancel visit`.
* After step 4 the case shows no booked visit, still `vaulted`.
* `<collector inbox>` holds one email saying the visit is cancelled.

<!-- trace:case id=g10adm.vault-operator-queue.TC-yzp rev=1 covers=g10adm.vault-operator-queue.SC-4jw -->
### grade10-admin-vault-operator-queue-US22-TC2-1: Cancellation confirmation names the slot on the booked shop's clock

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

* admin(holds vault:operate) is on the case page of <case_2>.
* The brand's zone is `Asia/Hong_Kong`.
* The tester's device clock is set to `<device zone>`.

**Test data:**

| `<case_2>` visit booked at | Slot on the booked shop's clock | `<device zone>` | Confirmation names |
| --- | --- | --- | --- |
| A shop on `Asia/Hong_Kong` | 23:30 on `<slot date>` | UTC+0 | 23:30 on `<slot date>`, `Asia/Hong_Kong` |
| A shop on `Asia/Hong_Kong` | 00:30 on `<slot date>` | UTC-5 | 00:30 on `<slot date>`, `Asia/Hong_Kong` |
| A shop on `Asia/Tokyo` | 10:00 on `<slot date>` | `Asia/Hong_Kong` | 10:00 on `<slot date>`, `Asia/Tokyo`, never 09:00 |

**Steps:**

1. Click the control that cancels the visit.
2. Read the slot the confirmation names.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation names the slot and zone in the row's Confirmation names column, date included.
* After step 3 the visit is still booked.

<!-- trace:case id=g10adm.vault-operator-queue.TC-nu8 rev=1 covers=g10adm.vault-operator-queue.SC-x20 -->
### grade10-admin-vault-operator-queue-US22-TC3-1: Dismissing the cancellation keeps the visit and emails nobody

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on the case page of <case_1>.
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

<!-- trace:case id=g10adm.vault-operator-queue.TC-fax rev=1 covers=g10adm.vault-operator-queue.SC-u9b -->
### grade10-admin-vault-operator-queue-US22-TC4-1: Cancellation confirmation for a case with no address says nobody is emailed

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

* admin(holds vault:operate) is on the case page of <case_3>.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_3>` | A case with a visit booked and no email address |

**Steps:**

1. Click the control that cancels the visit.
2. Read the confirmation.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation says nobody is emailed.
* The confirmation names no address.
* After step 3 the visit is still booked.

<!-- trace:case id=g10adm.vault-operator-queue.TC-fe8 rev=1 covers=g10adm.vault-operator-queue.SC-jyk -->
### grade10-admin-vault-operator-queue-US22-TC5-1: A refused cancellation stays in the open confirmation

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* admin(holds vault:operate) is on the case page of <case_1> in `<session A>`.
* admin(holds vault:operate) is on the case page of <case_1> in `<session B>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case with a visit booked, at a status the case may be cancelled from |
| `<session A>` | The tester's first browser session |
| `<session B>` | A second browser session |

**Steps:**

1. In `<session A>`, click the control that cancels the visit.
2. In `<session B>`, cancel `<case_1>` from the Case tab.
3. In `<session A>`, confirm the cancellation.

**Expected Results:**

* After step 3 a refusal shows inside the confirmation.
* The confirmation stays open.

<!-- trace:case id=g10adm.vault-operator-queue.TC-sp3 rev=1 covers=g10adm.vault-operator-queue.SC-91a -->
### grade10-admin-vault-operator-queue-US22-TC6-1: A visit cancelled in another session opens no confirmation

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
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* admin(holds vault:operate) is on the case page of <case_1> in `<session A>`, showing the visit.
* The visit of <case_1> was cancelled in `<session B>` after `<session A>` loaded the page.
* The tester can read `<collector inbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case with a visit booked |
| `<session A>` | The tester's first browser session |
| `<session B>` | A second browser session |
| `<collector inbox>` | The mailbox of the email address on `<case_1>` |

**Steps:**

1. In `<session A>`, click the control that cancels the visit.
2. Open `<collector inbox>`.

**Expected Results:**

* No confirmation opens.
* `<session A>` redraws the case with no booked visit.
* `<collector inbox>` holds only the one cancellation email `<session B>` caused.

<!-- trace:case id=g10adm.vault-operator-queue.TC-p2b rev=1 covers=g10adm.vault-operator-queue.SC-cqt -->
### grade10-admin-vault-operator-queue-US22-TC7-1: A visit moved in another session is named at its new slot

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

* admin(holds vault:operate) is on the case page of <case_1> in `<session A>`, showing `<visit slot>`.
* The visit of <case_1> was moved to `<new slot>` in `<session B>` after `<session A>` loaded the page.

**Test data:**

| Field | Value |
| --- | --- |
| `<case_1>` | A case with a visit booked at a shop on `Asia/Hong_Kong` |
| `<visit slot>` | 10:00 on 15 June 2026, on the shop's clock |
| `<new slot>` | 14:00 on 16 June 2026, on the shop's clock |
| `<session A>` | The tester's first browser session |
| `<session B>` | A second browser session |

**Steps:**

1. In `<session A>`, click the control that cancels the visit.
2. Read the slot the confirmation names.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation names `<new slot>`, `Asia/Hong_Kong`.
* The confirmation does not name `<visit slot>`.
* After step 3 the case shows the visit at `<new slot>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-a54 rev=1 covers=g10adm.vault-operator-queue.SC-aaa,g10adm.vault-operator-queue.SC-ydx -->
### grade10-admin-vault-operator-queue-US22-TC8-1: Cancel visit opens no confirmation when the case or its shop cannot be read

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-22

**Pre-conditions:**

* admin(holds vault:operate) is on the case page of the row's case, showing its visit.
* The row's condition holds.
* The tester can read `<collector inbox>`.

**Test data:**

| Case | Condition |
| --- | --- |
| `<case_1>`, a case with a visit booked | Network conditions are manipulated to fail the case's fresh read |
| `<case_4>`, a case with a visit at a shop the console's list of shops does not hold | none |

`<collector inbox>` is the mailbox of the email address on the row's case.

**Steps:**

1. Click the control that cancels the visit.
2. Open `<collector inbox>`.

**Expected Results:**

* A failure shows beside the cancel control.
* No confirmation opens, and no slot is named on the brand's zone.
* The case still shows its visit.
* `<collector inbox>` holds no cancellation email.

---

## grade10-admin-vault-operator-queue-US23: Operator checks the forfeiture notice before it goes

**As a** member of shop staff,
**I want** sending the forfeiture notice to ask me first, naming the address it
goes to and the date to pay by it sets,
**so that** a legal deadline never starts on a misplaced press, and I know who
will read it.

<!-- trace:case id=g10adm.vault-operator-queue.TC-9xk rev=1 covers=g10adm.vault-operator-queue.SC-5hv,g10adm.vault-operator-queue.SC-1bh -->
### grade10-admin-vault-operator-queue-US23-TC1-1: Confirming the notice sends it to the named address and sets the date to pay by

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The tester can read `<notice address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |
| `<notice address>` | The email address on `<loan_2>`'s case |
| `<send date>` | Today on the `<brand time zone>` calendar |
| `<cure period>` | 14 days, the brand's notice period |
| `<brand time zone>` | The time zone of the brand's calendar |

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Read the confirmation.
3. Confirm the send.
4. Read the case header.
5. Open `<notice address>`.

**Expected Results:**

* Step 1 opens a confirmation; no notice is sent behind it.
* The confirmation is in the destructive tone and names `<notice address>`.
* The confirmation names the date to pay by: `<send date>` plus `<cure period>`.
* After step 3, Send forfeiture notice is no longer offered.
* The header names the same date to pay by as the confirmation.
* `<notice address>` holds one forfeiture notice naming that date to pay by.

<!-- trace:case id=g10adm.vault-operator-queue.TC-ku8 rev=1 covers=g10adm.vault-operator-queue.SC-o3p -->
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
| 23:30 on `<day D>`, 00:30 on `<day D>` plus 1 in Tokyo, `<loan_2>` kept at a shop on `Asia/Tokyo` | `<day D>` | `<day D>` plus `<cure period>`, never one day later |

`<loan_2>` is a live loan 5 days past its due date with no forfeiture notice sent; `<cure period>` is 14 days, the brand's notice period; the brand's zone is `Asia/Hong_Kong`.

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Read the date to pay by the confirmation names.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation names the row's date to pay by.
* After step 3, Send forfeiture notice is still offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-92p rev=1 covers=g10adm.vault-operator-queue.SC-wro -->
### grade10-admin-vault-operator-queue-US23-TC3-1: Dismissing the notice confirmation sends nothing and starts no deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The tester can read `<notice address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |
| `<notice address>` | The email address on `<loan_2>`'s case |

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Dismiss the confirmation.
3. Reload the case page.
4. Read the case header.
5. Read the Custody tab.
6. Open `<notice address>`.

**Expected Results:**

* The header still counts 5 days past due, with no date to pay by.
* The Custody tab still offers Send forfeiture notice.
* The Custody tab's reason still names that no notice has been sent.
* `<notice address>` holds no forfeiture notice.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0cq rev=1 covers=g10adm.vault-operator-queue.SC-mu0 -->
### grade10-admin-vault-operator-queue-US23-TC4-1: A day turning before the send names the later date to pay by

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
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The clock is set to 23:59 on `<day D>` on the brand's calendar.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |
| `<cure period>` | 14 days, the brand's notice period |

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Read the date to pay by the confirmation names.
3. Advance the clock to 00:01 on `<day D>` plus 1.
4. Confirm the send.
5. Read the case header.

**Expected Results:**

* The confirmation names `<day D>` plus `<cure period>`.
* After step 4 no second confirmation opens.
* The header reads pay by `<day D>` plus 1 plus `<cure period>`.

<!-- trace:case id=g10adm.vault-operator-queue.TC-8k5 rev=1 covers=g10adm.vault-operator-queue.SC-jnl -->
### grade10-admin-vault-operator-queue-US23-TC5-1: Notice confirmation for a case with no address says nobody is emailed

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
* **Trace:** grade10-admin-vault-operator-queue-US-23

**Pre-conditions:**

* admin(holds vault:approve) is on the Custody tab of <loan_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_6>` | A live loan past its due date, no forfeiture notice sent, no email address |
| `<send date>` | Today on the brand's calendar |
| `<cure period>` | 14 days, the brand's notice period |

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Read the confirmation.
3. Dismiss the confirmation.

**Expected Results:**

* The confirmation says nobody is emailed.
* The confirmation names no address.
* The confirmation names the date to pay by: `<send date>` plus `<cure period>`.
* After step 3, Send forfeiture notice is still offered.

<!-- trace:case id=g10adm.vault-operator-queue.TC-0ae rev=1 covers=g10adm.vault-operator-queue.SC-ekb -->
### grade10-admin-vault-operator-queue-US23-TC6-1: With no notice period the confirmation says so and holds the refusal

**Classification:**

* **Severity:** major
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

* The brand has no notice period set.
* admin(holds vault:approve) is on the Custody tab of <loan_2>.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date, no forfeiture notice sent |

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Read the confirmation.
3. Confirm the send.
4. Read the confirmation.
5. Dismiss the confirmation.
6. Read the Custody tab.

**Expected Results:**

* The confirmation says no date to pay by can be named without a notice period.
* After step 3 a refusal shows inside the confirmation, which stays open.
* After step 5 the Custody tab still offers Send forfeiture notice, with no notice listed.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xek rev=1 covers=g10adm.vault-operator-queue.SC-kbm -->
### grade10-admin-vault-operator-queue-US23-TC7-1: A notice sent in another session opens no confirmation

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

* admin(holds vault:approve) is on the Custody tab of <loan_2> in `<session A>`, offering Send forfeiture notice.
* A forfeiture notice naming `<date to pay by>` was sent on <loan_2> in `<session B>` after `<session A>` loaded the page.
* The tester can read `<notice address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_2>` | A live loan 5 days past its due date |
| `<date to pay by>` | The date the notice from `<session B>` named |
| `<notice address>` | The email address on `<loan_2>`'s case |
| `<session A>` | The tester's first browser session |
| `<session B>` | A second browser session |

**Steps:**

1. In `<session A>`, click Send forfeiture notice.
2. Read the Custody tab.
3. Open `<notice address>`.

**Expected Results:**

* No confirmation opens.
* The Custody tab shows the notice sent, naming `<date to pay by>`.
* Send forfeiture notice is no longer offered.
* `<notice address>` holds one forfeiture notice.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xgf rev=1 covers=g10adm.vault-operator-queue.SC-rtl -->
### grade10-admin-vault-operator-queue-US23-TC8-1: A failed read opens no notice confirmation

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
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

* admin(holds vault:approve) is on the Custody tab of <loan_2>.
* The row's condition holds.
* The tester can read `<notice address>`.

**Test data:**

| Condition |
| --- |
| Network conditions are manipulated to fail the case's fresh read |
| Network conditions are manipulated to fail the fresh read of the brand's notice period |

`<loan_2>` is a live loan 5 days past its due date with no forfeiture notice sent; `<notice address>` is the email address on its case.

**Steps:**

1. Click Send forfeiture notice on the Custody tab.
2. Open `<notice address>`.

**Expected Results:**

* A failure shows beside Send forfeiture notice.
* No confirmation opens.
* The Custody tab still offers Send forfeiture notice.
* `<notice address>` holds no forfeiture notice.

---

## grade10-admin-vault-operator-queue-US24: Operator reads how late a loan is from the case header

**As a** member of shop staff,
**I want** the case header to say how many days a live loan is past its due
date, and the date to pay by once a forfeiture notice stands,
**so that** I know where a late loan stands the moment I open its case,
without the money grant.

<!-- trace:case id=g10adm.vault-operator-queue.TC-2m8 rev=1 covers=g10adm.vault-operator-queue.SC-syo,g10adm.vault-operator-queue.SC-jhz -->
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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the vault queue.
* `<loan_1>` has no forfeiture notice sent.

**Test data:**

| `<loan_1>` due date, on the brand's calendar | Header reads |
| --- | --- |
| Tomorrow | No clock |
| Today | No clock |
| Yesterday | 1 day past due |
| 30 days ago | 30 days past due |

**Steps:**

1. Open the case of `<loan_1>`.
2. Read the case header.

**Expected Results:**

* The case opens on its header.
* The header reads as the row's Header reads column.
* The header names no date to pay by.
* No badge says the case waits on staff for being late.

<!-- trace:case id=g10adm.vault-operator-queue.TC-6aw rev=1 covers=g10adm.vault-operator-queue.SC-j1h -->
### grade10-admin-vault-operator-queue-US24-TC2-1: Header names the date to pay by once a notice stands

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on the vault queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_3>` | A live loan 20 days past its due date, a forfeiture notice sent `<notice sent>` |
| `<notice sent>` | 6 days ago on the brand's calendar |
| `<date to pay by>` | `<notice sent>` plus `<cure period>` |
| `<cure period>` | 14 days, the brand's notice period |

**Steps:**

1. Open the case of `<loan_3>`.
2. Read the case header.
3. Open the Custody tab.
4. Read the cure date the reason names.

**Expected Results:**

* The header names `<date to pay by>`.
* The header shows no days-past-due count beside it.
* The Custody tab's cure date equals the header's date to pay by.

<!-- trace:case id=g10adm.vault-operator-queue.TC-vc8 rev=1 covers=g10adm.vault-operator-queue.SC-fgo -->
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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* `<operator>` is signed in to the admin and on the vault queue.

**Test data:**

| `<operator>` | Case opened | Header reads | Payouts tab |
| --- | --- | --- | --- |
| admin(staff, holds vault:read, not vault:payout) | `<loan_1>`, a live loan 5 days past due, no notice | 5 days past due | Not offered |
| admin(staff, holds vault:read, not vault:payout) | `<loan_3>`, a live loan with a notice sent 6 days ago | `<loan_3>`'s date to pay by | Not offered |
| admin(treasurer, holds vault:read and vault:payout) | `<loan_1>` | 5 days past due | Offered |

**Steps:**

1. Open the row's case.
2. Read the case header.

**Expected Results:**

* The case opens for every row.
* The header reads as the row's Header reads column.
* The Payouts tab is as the row's Payouts tab column.

<!-- trace:case id=g10adm.vault-operator-queue.TC-xjx rev=1 covers=g10adm.vault-operator-queue.SC-9xn,g10adm.vault-operator-queue.SC-4es -->
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

* admin(holds vault:read) is on the vault queue.
* The brand's zone is `Asia/Hong_Kong`.
* The clock is set to `<now>` and the tester's device clock to `<device zone>`.
* `<loan_4>` is a live loan due on `<due day>`, no forfeiture notice sent, kept at `<shop>`.

**Test data:**

| `<now>` on the brand's calendar | `<shop>` | `<device zone>` date at `<now>` | Header reads |
| --- | --- | --- | --- |
| 00:30 on `<due day>` plus 1 | A shop on `Asia/Hong_Kong` | `<due day>` | 1 day past due |
| 23:30 on `<due day>` | A shop on `Asia/Hong_Kong` | `<due day>` plus 1 | No clock |
| 23:30 on `<due day>` plus 3 | A shop on `Asia/Hong_Kong` | `<due day>` plus 4 | 3 days past due |
| 23:30 on `<due day>`, 00:30 on `<due day>` plus 1 in Tokyo | A shop on `Asia/Tokyo` | `<due day>` plus 1 | No clock |

**Steps:**

1. Open the case of `<loan_4>`.
2. Read the case header.

**Expected Results:**

* The header reads as the row's Header reads column.

<!-- trace:case id=g10adm.vault-operator-queue.TC-5r8 rev=1 covers=g10adm.vault-operator-queue.SC-6jj -->
### grade10-admin-vault-operator-queue-US24-TC5-1: Header carries no clock on a case with no running loan

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

* admin(holds vault:read) is on the vault queue.

**Test data:**

| `<case_5>` |
| --- |
| A storage case in the vault |
| A loan repaid in full 10 days after its due date |
| A forfeited case whose notice named a date to pay by |

**Steps:**

1. Open the case of `<case_5>`.
2. Read the case header.

**Expected Results:**

* The header shows no days-past-due count.
* The header names no date to pay by.

<!-- trace:case id=g10adm.vault-operator-queue.TC-x4b rev=1 covers=g10adm.vault-operator-queue.SC-b6w -->
### grade10-admin-vault-operator-queue-US24-TC6-1: Header keeps the date to pay by after it has passed

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
* **Trace:** grade10-admin-vault-operator-queue-US-24

**Pre-conditions:**

* admin(holds vault:read) is on the vault queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_7>` | A live loan whose forfeiture notice named `<date to pay by>` |
| `<date to pay by>` | Yesterday on the brand's calendar |

**Steps:**

1. Open the case of `<loan_7>`.
2. Read the case header.

**Expected Results:**

* The header reads pay by `<date to pay by>`.
* The header shows no days-past-due count.

<!-- trace:case id=g10adm.vault-operator-queue.TC-4sx rev=1 covers=g10adm.vault-operator-queue.SC-g7w -->
### grade10-admin-vault-operator-queue-US24-TC7-1: Header count takes no grace days off

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

* The brand's grace is set to 3 days.
* admin(holds vault:read) is on the vault queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_8>` | A live loan due 2 days ago on the brand's calendar, no forfeiture notice sent |

**Steps:**

1. Open the case of `<loan_8>`.
2. Read the case header.

**Expected Results:**

* The header reads 2 days past due.

<!-- trace:case id=g10adm.vault-operator-queue.TC-6bs rev=1 covers=g10adm.vault-operator-queue.SC-sn7 -->
### grade10-admin-vault-operator-queue-US24-TC8-1: Date to pay by reads the brand's day at a shop on another zone

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

* The brand's zone is `Asia/Hong_Kong`.
* admin(holds vault:read) is on the vault queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<loan_9>` | A live loan kept at a shop on `Asia/Tokyo`, whose forfeiture notice named 15 December 2026 |

**Steps:**

1. Open the case of `<loan_9>`.
2. Read the case header.

**Expected Results:**

* The header reads pay by 15 Dec 2026.
* The header does not read 16 Dec.

---

## Reconciliation

**Run:** QA2, 2026-10-07, a rerun after the feature set named the brand's calendar for a loan's dates. QA1 wrote 12 blind cases from the frozen outline, journeys US-08 and US-22 to US-24, the proposal, decisions Q1 to Q23 with the `## Raised` table, and the Operator Console page; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. QA2 joined them with Dev's SC-97 to SC-121 and SC-142 to SC-145, the tech design and the tasks. No domain suite sits above the capability, and the product suite traces none of the four journeys.

| Blind case or scenario | Disposition |
| --- | --- |
| `US8-TC6-1` | **Folded:** the durable SC-36 for the reason's cure date and the day the notice went; the same date as the confirm is SC-112's, walked under US-23 |
| `US22-TC1-1` | **Folded:** SC-105 and SC-107; joined the address, the zone, the status kept and the `Keep visit` and `Cancel visit` choices; grant set to `vault:operate` |
| `US22-TC2-1` | **Folded:** SC-142; the row for a shop "the admin works from" read a zone the console does not hold, and now reads a shop on `Asia/Tokyo` under a brand on `Asia/Hong_Kong` |
| `US22-TC3-1` | **Folded:** SC-106 |
| `US23-TC1-1` | **Folded:** SC-110 and SC-112; joined the destructive tone; the control's label corrected to Send forfeiture notice and the address to the case's own (Q12) |
| `US23-TC2-1` | **Folded:** SC-145; a row added for a case kept at a shop on `Asia/Tokyo` |
| `US23-TC3-1` | **Folded:** SC-111 |
| `US24-TC1-1` | **Folded:** SC-97 and SC-99; joined no waits-on-staff badge; grant set to `vault:read` |
| `US24-TC2-1` | **Folded:** SC-100 |
| `US24-TC3-1` | **Folded:** SC-104; the rows name the staff and treasurer roles and joined the Payouts tab |
| `US24-TC4-1` | **Folded:** SC-98 and SC-143; a row added for a case kept at a shop on `Asia/Tokyo` |
| `US24-TC5-1` | **Folded:** SC-102; rows added for a storage case and a forfeited case (Q10) |
| SC-108, SC-109, SC-116, SC-117 | **Uncovered by QA1:** `US22-TC4-1`, `US22-TC5-1`, `US22-TC6-1` and `US22-TC7-1` added |
| SC-118, SC-119 | **Uncovered by QA1:** `US22-TC8-1` added, a row each |
| SC-113, SC-114, SC-115, SC-120, SC-121 | **Uncovered by QA1:** `US23-TC4-1` to `US23-TC8-1` added |
| SC-101, SC-103, SC-144 | **Uncovered by QA1:** `US24-TC6-1`, `US24-TC7-1` and `US24-TC8-1` added |
| Rejected cases | none |
| Contradicted readings | none |
| Uncovered scenarios | none |

- **Address, and none on file** - settled by Q12 and Q23: the case's own address, and a case with none says nobody is emailed while the notice still runs; SC-108 and SC-114
- **After the date to pay by** - settled by Q11: the header still reads `pay by <date>`, and the Custody tab offers Forfeit as the durable SC-51 walks; SC-101
- **On the due date** - settled by Q9 and the requirement's table: no clock on or before the due date, `1 day past due` the day after; `US24-TC1-1`'s Today row
- **Forfeited or repaid** - settled by Q10: no clock; SC-102
- **A visit gone or moved, and a second press** - settled by Q19 and Q20: the press reads the case afresh, a visit gone or a notice standing opens no confirm; SC-116, SC-117 and SC-120. A visit whose slot has passed is cancelled or refused by `grade10-site/vault/visit-booking`, and a refusal shows in the open confirm, SC-109
- **Resend** - settled by the non-goal and Q16: Send again asks nothing; a second notice from a stale page is Q20's
- **A failure after confirming** - settled by the requirements' fifth step: the refusal shows in the open confirm, which stays open; SC-109 and SC-115. A failed fresh read is Q21's, SC-118 and SC-121
- **The booked shop's zone** - settled by Q17; SC-142
- **The grant** - settled by the page's Permissions table: Cancel visit is `vault:operate`, the notice `vault:approve`, and the clock `vault:read` with no `vault:payout`
