# grade10-admin/console/daily-reminder Test Cases

**Status:** pending-review · 0/80
**Drafts styled:** 2026-10-12, tcs-rules r5

**Out of suite:** grade10-admin-console-daily-reminder-SC-07 - the backend list tests of task 2.4; grade10-admin-console-daily-reminder-SC-77 - the What's New read test of task 2.1; grade10-admin-console-daily-reminder-SC-78 - the Slack job test of task 3.1; grade10-admin-console-daily-reminder-SC-79 - the console storage tests of task 4.1; grade10-admin-console-daily-reminder-SC-80 - the Today page tests of task 4.1; grade10-admin-console-daily-reminder-SC-81 - the dialog tests of task 4.1; grade10-admin-console-daily-reminder-SC-82 - the dialog tests of task 4.1; grade10-admin-console-daily-reminder-SC-83 - the Today page tests of task 4.1; grade10-admin-console-daily-reminder-SC-84 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-85 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-86 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-87 - the Slack message tests of task 5.2

## grade10-admin-console-daily-reminder-US1: Operator starts the day with what closed yesterday

**As an** auction operator,
**I want** a list of the listings that closed yesterday when I first open the console, each opening the order or listing it belongs to,
**so that** I begin with the lots that need my attention without searching for them.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ue2 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-ue2 (US1-TC1): First entry of the day opens the dialog with both lists

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_1>` is sold and closed yesterday, Hong Kong time, with its winner order `<order_1>`.
* `<listing_2>` is unsold and closed yesterday, Hong Kong time.
* `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the dialog.

**Expected Results:**

* The console page loads with the dialog open over it.
* What's New lists a row for `<listing_1>` and a row for `<listing_2>`.
* Still Waiting lists a row for `<order_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-rz8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-rz8 (US1-TC2): A sold listing is one row that opens its winner order

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_1>` is sold and closed yesterday, Hong Kong time; its winner order `<order_1>` is Preparing Invoice, won by `<winner_1>`.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the rows for `<listing_1>` in What's New.
3. Click the row for `<listing_1>`.

**Expected Results:**

* What's New holds exactly one row for `<listing_1>`, none as a closed listing beside it.
* The row shows the listing code and lot, `<winner_1>` and the status Preparing Invoice.
* Step 3 opens the page of `<order_1>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-u6q rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-u6q (US1-TC3): An unsold listing is one row that opens the listing

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_2>` is unsold and closed yesterday, Hong Kong time.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<listing_2>` in What's New.
3. Click the row for `<listing_2>`.

**Expected Results:**

* What's New holds exactly one row for `<listing_2>`, showing its listing code and lot and no winner.
* Step 3 opens the page of `<listing_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-jod rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-jod (US1-TC4): What's New lists the latest close first

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_a>` closed unsold yesterday 09:00, `<listing_b>` closed sold yesterday 15:00 and `<listing_c>` closed unsold yesterday 21:00, all Hong Kong time.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the order of rows in What's New.

**Expected Results:**

* The rows read `<listing_c>`, `<listing_b>`, `<listing_a>` from top to bottom.

<!-- trace:case id=g10adm.console-daily-reminder.TC-5cx rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-5cx (US1-TC5): Listings closed at either edge of yesterday are listed

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The entry is made at 10:00 Hong Kong time on `<today>`.
* `<listing_first>` closed on the day before `<today>` at 00:00:00 Hong Kong time; `<listing_last>` closed on that day at 23:59:59 Hong Kong time.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the rows in What's New.

**Expected Results:**

* What's New holds a row for `<listing_first>`.
* What's New holds a row for `<listing_last>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-pk3 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-pk3 (US1-TC6): The previous day follows Hong Kong, not the browser zone

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The browser zone is `<browser_zone>` and the browser clock reads 00:30 Hong Kong time on `<today>`.
* `<listing_1>` closed on the day before `<today>` at 23:30 Hong Kong time; `<listing_2>` closed two days before `<today>` at 23:30 Hong Kong time.

**Test data:**

| Field | Value |
| --- | --- |
| browser_zone (row 1) | America/Los_Angeles (its date at the entry is the day before the Hong Kong date) |
| browser_zone (row 2) | Pacific/Auckland (its date at the entry equals the Hong Kong date) |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the rows in What's New.

**Expected Results:**

* What's New holds a row for `<listing_1>`.
* What's New holds no row for `<listing_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7l8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-7l8 (US1-TC7): Closing the dialog keeps it closed for the rest of the Hong Kong day

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* A list has a row for the operator.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Close the dialog.
3. Reload the page.
4. Navigate to <grade10 admin orders url>.

**Expected Results:**

* Step 1 opens the dialog.
* Step 3 shows the page with no dialog.
* Step 4 shows the page with no dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-zgt rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-zgt (US1-TC8): A new Hong Kong day opens the dialog again whatever the browser zone

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) closed the daily dialog at 23:55 Hong Kong time on `<day_1>` in this browser, whose zone is `<browser_zone>`.
* A list has a row for the operator on the next Hong Kong day.

**Test data:**

| Field | Value |
| --- | --- |
| browser_zone (row 1) | Asia/Hong_Kong |
| browser_zone (row 2) | America/Los_Angeles (the local date is unchanged at 00:05 Hong Kong time) |

**Steps:**

1. Set the browser clock to 00:05 Hong Kong time on the day after `<day_1>`.
2. Navigate to <grade10 admin console url>.

**Expected Results:**

* The dialog opens over the page.

<!-- trace:case id=g10adm.console-daily-reminder.TC-6qf rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-6qf (US1-TC9): The dialog opens over the console page the operator lands on

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_1>` is an order the operator can open; a list has a row for the operator.

**Steps:**

1. Navigate to the page of `<order_1>` by its link.
2. Close the dialog.

**Expected Results:**

* Step 1 loads the page of `<order_1>` with the dialog open over it.
* Step 2 leaves the page of `<order_1>` showing, not another page.

<!-- trace:case id=g10adm.console-daily-reminder.TC-xds rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-xds (US1-TC10): Closing the dialog does not close it for another operator

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin A and admin B both hold auction:read and auction:payment; a list has a row for each.
* admin A closed the daily dialog today in this browser.

**Steps:**

1. Sign out admin A.
2. Sign in as admin B.
3. Navigate to <grade10 admin console url>.

**Expected Results:**

* The dialog opens for admin B.

<!-- trace:case id=g10adm.console-daily-reminder.TC-1g3 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-1g3 (US1-TC11): Closing the dialog does not close it in another browser

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) closed the daily dialog today in browser A; a list has a row for the operator.

**Steps:**

1. Open browser B and sign in as the same operator.
2. Navigate to <grade10 admin console url>.

**Expected Results:**

* The dialog opens in browser B.

<!-- trace:case id=g10adm.console-daily-reminder.TC-twg rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-twg (US1-TC12): A session crossing midnight opens no dialog until the next entry

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) entered the console at 23:50 Hong Kong time and closed the dialog.
* A list has a row for the operator on the next Hong Kong day.

**Steps:**

1. Move the browser clock to 00:10 Hong Kong time on the next day and wait one minute without acting.
2. Reload the page.

**Expected Results:**

* Step 1 shows no dialog.
* Step 2 opens the dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-323 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-323 (US1-TC13): A list with no row for the operator is left out of the dialog

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* No listing closed yesterday, Hong Kong time.
* `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the dialog.

**Expected Results:**

* The dialog opens.
* The dialog shows Still Waiting with the row for `<order_2>`.
* The dialog shows no What's New list and no empty message for it.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ffo rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-ffo (US1-TC14): A browser that keeps nothing opens the dialog once per page load

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today; the browser blocks site storage.
* A list has a row for the operator.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Close the dialog.
3. Follow the console navigation to <grade10 admin orders url> without reloading.
4. Reload the page.

**Expected Results:**

* Step 1 opens the dialog.
* Step 3 shows the page with no dialog.
* Step 4 opens the dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-4no rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-4no (US1-TC15): A sold listing whose order is cancelled keeps its row with the current status

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_1>` is sold and closed yesterday, Hong Kong time; its order `<order_1>` is now Cancelled.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<listing_1>` in What's New.

**Expected Results:**

* What's New holds a row for `<listing_1>`.
* The row shows the status Cancelled.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ogw rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n,g10adm.console-daily-reminder.SC-e3n -->
### g10adm.console-daily-reminder.TC-ogw (US1-TC16): The dialog lists every row without a cap

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* Twelve listings closed yesterday, Hong Kong time.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Count the rows in What's New.

**Expected Results:**

* What's New holds 12 rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-9en rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-9en (US1-TC17): Listings closed outside the previous day are not listed

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The entry is made at 10:00 Hong Kong time on `<today>`.
* `<listing_old>` closed two days before `<today>` at 23:59:59 Hong Kong time; `<listing_now>` closed on `<today>` at 00:00:00 Hong Kong time; `<listing_later>` closed on `<today>` at 08:30 Hong Kong time.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the rows in What's New.

**Expected Results:**

* What's New holds no row for `<listing_old>`.
* What's New holds no row for `<listing_now>`.
* What's New holds no row for `<listing_later>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-n3a rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-n3a (US1-TC18): An operator with no row in either list gets no dialog

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* No listing closed yesterday, Hong Kong time.
* No order has waited 48 hours in Preparing Invoice, Payment Verifying or Preparing Shipment.

**Steps:**

1. Navigate to <grade10 admin console url>.

**Expected Results:**

* The console page loads with no dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-z6w rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-z6w (US1-TC19): A list that fails to load says so beside the list that loaded, with a Retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The read for `<failing_list>` is made to fail.
* The other list has a row for the operator.

**Test data:**

| Field | Value |
| --- | --- |
| failing_list (row 1) | What's New |
| failing_list (row 2) | Still Waiting |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the dialog.

**Expected Results:**

* The dialog opens.
* The dialog says `<failing_list>` failed to load and shows a Retry for it.
* The dialog does not show `<failing_list>` as empty.
* The other list shows its rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-nb8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-nb8 (US1-TC20): What's New shows a sold row only to an operator who can open the order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* `<listing_1>` is sold and closed yesterday, Hong Kong time; its order is `<order_1>`.
* `<operator>` has not closed the daily dialog today and holds `<grants>`.

**Test data:**

| Field | Value |
| --- | --- |
| operator, grants, shows (row 1) | admin A, auction:read only, shows |
| operator, grants, shows (row 2) | admin B, auction:read and auction:payment, shows |
| operator, grants, shows (row 3) | admin C, no auction grant, does not show |

**Steps:**

1. Sign in as `<operator>`.
2. Navigate to <grade10 admin console url>.

**Expected Results:**

* What's New `<shows>` a row for `<listing_1>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-atu rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-atu (US1-TC21): An operator with no auction grant gets no dialog from auction rows

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds no auction grant) has not closed the daily dialog today.
* `<listing_1>` closed yesterday, Hong Kong time, and `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.

**Expected Results:**

* The console page loads with no dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-b4k rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-b4k (US1-TC22): An unsold row needs only reading access to a listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* `<listing_2>` is unsold and closed yesterday, Hong Kong time.
* `<operator>` has not closed the daily dialog today and holds `<grants>`.

**Test data:**

| Field | Value |
| --- | --- |
| operator, grants, shows (row 1) | admin A, auction:read only, shows |
| operator, grants, shows (row 2) | admin B, auction:read and auction:shipment, shows |
| operator, grants, shows (row 3) | admin C, no auction grant, does not show |

**Steps:**

1. Sign in as `<operator>`.
2. Navigate to <grade10 admin console url>.
3. Click the row for `<listing_2>` in What's New, when it shows.

**Expected Results:**

* What's New `<shows>` a row for `<listing_2>`.
* Step 3 opens the page of `<listing_2>`, for an operator whose row shows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-h9v rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-h9v (US1-TC23): A listing called off before its close is not listed

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_off>` was called off before its close time, which fell yesterday, Hong Kong time.
* `<listing_1>` is sold and closed yesterday, Hong Kong time.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the rows in What's New.

**Expected Results:**

* What's New holds a row for `<listing_1>`.
* What's New holds no row for `<listing_off>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-m2d rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-m2d (US1-TC24): A listing that closed with no bids is an unsold row

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_nb>` reached its close yesterday, Hong Kong time, with no bid placed.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<listing_nb>` in What's New.
3. Click the row.

**Expected Results:**

* What's New holds exactly one row for `<listing_nb>`, showing its listing code and lot and no winner.
* Step 3 opens the page of `<listing_nb>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-q7s rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-q7s (US1-TC25): Each way of closing the dialog keeps it closed for the day

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
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<listing_1>` is sold and closed yesterday, Hong Kong time, with its winner order `<order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| way (row 1) | the close control |
| way (row 2) | the Escape key |
| way (row 3) | a click outside the dialog |
| way (row 4) | a click on the row for `<listing_1>` |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Close the dialog by `<way>`.
3. Navigate to <grade10 admin console url> again.

**Expected Results:**

* Step 1 opens the dialog.
* Step 2 closes the dialog; following the row also opens the page of `<order_1>`.
* Step 3 shows the page with no dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-w3n rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-w3n (US1-TC26): Signing out clears the closed mark so the dialog opens again

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) closed the daily dialog today in this browser.
* A list has a row for the operator.

**Steps:**

1. Sign out.
2. Sign in as the same operator.

**Expected Results:**

* The dialog opens over the first console page shown after sign-in.

<!-- trace:case id=g10adm.console-daily-reminder.TC-c8j rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-c8j (US1-TC27): Tab return and moving between pages open nothing; the next full load with rows does

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* No listing closed yesterday, Hong Kong time, and no order has waited 48 hours at the first entry.
* `<order_2>` reaches 48 hours in Preparing Invoice after the first entry, the same Hong Kong day.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Wait until `<order_2>` has waited 48 hours.
3. Switch to another tab and back.
4. Follow the console navigation to <grade10 admin orders url> and back to <grade10 admin console url>, without reloading.
5. Reload the page.

**Expected Results:**

* Step 1 shows the page with no dialog.
* Step 3 shows no dialog.
* Step 4 shows no dialog.
* Step 5 opens the dialog, listing `<order_2>` in Still Waiting.

<!-- trace:case id=g10adm.console-daily-reminder.TC-r1t rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-r1t (US1-TC28): A deep link while signed out opens the dialog after sign-in

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is signed out and has not closed the daily dialog today in this browser.
* `<order_1>` is an order the operator can open; a list has a row for the operator.

**Steps:**

1. Navigate to the page of `<order_1>` by its link.
2. Read the page shown.
3. Sign in.

**Expected Results:**

* Step 2 shows no dialog.
* Step 3 loads the page of `<order_1>` with the dialog open over it.

<!-- trace:case id=g10adm.console-daily-reminder.TC-f6y rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-f6y (US1-TC29): A failed read opens the dialog even when the other list is empty

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The read for `<failed_lists>` is made to fail.
* `<other>`

**Test data:**

| Field | Value |
| --- | --- |
| failed_lists, other (row 1) | What's New; Still Waiting has no row for the operator |
| failed_lists, other (row 2) | Still Waiting; What's New has no row for the operator |
| failed_lists, other (row 3) | What's New and Still Waiting; no other list |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the dialog.

**Expected Results:**

* The dialog opens.
* The dialog says each of `<failed_lists>` failed to load and shows a Retry for it.
* No list reads as empty or as nothing waiting.

<!-- trace:case id=g10adm.console-daily-reminder.TC-k0e rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-k0e (US1-TC30): Retry on a failed list reads it again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The read for Still Waiting is made to fail once and then succeed.
* `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Click the Retry beside Still Waiting.

**Expected Results:**

* Step 1 shows Still Waiting as failed to load, with a Retry.
* Step 2 shows the row for `<order_2>` in Still Waiting.
* Step 2 removes the failure notice.

<!-- trace:case id=g10adm.console-daily-reminder.TC-u9a rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-u9a (US1-TC31): The dialog reads when it opens and has no control to read again

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_2>` has waited 49 hours in Preparing Invoice; `<order_3>` has waited 47 hours in Preparing Invoice and reaches 48 hours after the dialog opens.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Wait until `<order_3>` has waited 48 hours.
3. Look in the dialog for a control that reads the lists again.

**Expected Results:**

* Step 1 opens the dialog with a row for `<order_2>`.
* Step 2 shows no row for `<order_3>` in the open dialog.
* Step 3 finds no such control.

<!-- trace:case id=g10adm.console-daily-reminder.TC-x5p rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-b5m,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-x5p (US1-TC32): The What's New read refuses a caller with no auction access

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* `<caller>` holds no auction grant.
* `<listing_1>` closed sold yesterday, Hong Kong time.

**Steps:**

1. Read the API response for the What's New list as `<caller>`.

**Expected Results:**

* The response is a refusal.
* The response holds no row.

---

## grade10-admin-console-daily-reminder-US2: Operator is reminded of orders still waiting on them

**As an** operator with payment or shipment processing,
**I want** the orders that have waited 48 hours for me to send an invoice, check a proof or dispatch listed every day until I act, longest wait first,
**so that** an order I could not get to does not stay forgotten behind newer work.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ivd rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-ivd (US2-TC1): An order past 48 hours is a row saying the action it waits for

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_w>` is in `<status>` and has waited 49 hours since the clock the Orders table names for that status.

**Test data:**

| Field | Value |
| --- | --- |
| status, action (row 1) | Preparing Invoice, Send invoice |
| status, action (row 2) | Payment Verifying, Check proof |
| status, action (row 3) | Preparing Shipment, Dispatch |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<order_w>` in Still Waiting.
3. Click the row.

**Expected Results:**

* The row shows the listing code, lot, winner, `<action>` and how long the order has waited.
* Step 3 opens the page of `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-fbu rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-fbu (US2-TC2): An order at exactly 48 hours is listed

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_w>` in Preparing Invoice has waited exactly 48 hours at the moment the dialog reads.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<order_w>` in Still Waiting.

**Expected Results:**

* Still Waiting holds a row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ala rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-ala (US2-TC3): Still Waiting lists the longest wait first

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_a>` has waited 50 hours, `<order_b>` 120 hours and `<order_c>` 75 hours, in the three listed statuses.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the order of rows in Still Waiting.

**Expected Results:**

* The rows read `<order_b>`, `<order_c>`, `<order_a>` from top to bottom.

<!-- trace:case id=g10adm.console-daily-reminder.TC-eba rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-eba (US2-TC4): An order stays listed every day until it moves on

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog on `<day_1>` in this browser.
* `<order_w>` has waited 49 hours in Preparing Invoice on `<day_1>` and is untouched.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Close the dialog.
3. Set the browser clock to the next Hong Kong day.
4. Navigate to <grade10 admin console url>.

**Expected Results:**

* Step 1 lists `<order_w>` in Still Waiting.
* Step 4 opens the dialog again, listing `<order_w>` with a longer wait.

<!-- trace:case id=g10adm.console-daily-reminder.TC-aah rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-aah (US2-TC5): An order that moves on leaves Still Waiting

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_w>` has waited 49 hours in Preparing Invoice and is listed in Still Waiting.

**Steps:**

1. Open the page of `<order_w>` from its row.
2. Send its invoice.
3. Navigate to <grade10 admin today url>.
4. Refresh the lists.

**Expected Results:**

* Step 4 shows Still Waiting with no row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-5ri rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-5ri (US2-TC6): An operator with no Still Waiting row sees no such list in the dialog

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read only) has not closed the daily dialog today.
* `<listing_1>` closed sold yesterday, Hong Kong time; `<order_s>` waited 49 hours in Preparing Shipment.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the dialog.

**Expected Results:**

* The dialog opens with What's New and its row for `<listing_1>`.
* The dialog shows no Still Waiting list.

<!-- trace:case id=g10adm.console-daily-reminder.TC-t7x rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-t7x (US2-TC7): An order short of 48 elapsed hours is not listed

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
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_w>` in Preparing Invoice has waited `<waited>` at the moment the dialog reads.

**Test data:**

| Field | Value |
| --- | --- |
| waited (row 1) | 47 hours 59 minutes |
| waited (row 2) | 25 hours, begun at 23:00 Hong Kong time two midnights before the read |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read Still Waiting.

**Expected Results:**

* Still Waiting holds no row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-to3 rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-to3 (US2-TC8): A wait runs from its status clock, not from the order's age

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_w>` is in `<state>`.

**Test data:**

| Field | Value |
| --- | --- |
| state (row 1) | Preparing Invoice, setup confirmed 10 hours ago, lot closed 100 hours ago |
| state (row 2) | Payment Verifying, latest proof 10 hours ago, first proof 60 hours ago |
| state (row 3) | Preparing Shipment, paying payment 10 hours ago, an earlier part payment 60 hours ago |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read Still Waiting.

**Expected Results:**

* Still Waiting holds no row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-xga rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-xga (US2-TC9): Other statuses are not listed however long they wait

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_w>` has waited 100 hours in `<status>`, with no flag.

**Test data:**

| Field | Value |
| --- | --- |
| status (row 1) | Awaiting Setup |
| status (row 2) | Setup Overdue |
| status (row 3) | Pending Payment |
| status (row 4) | Payment Overdue |
| status (row 5) | Partially Paid |
| status (row 6) | Shipped |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read Still Waiting.

**Expected Results:**

* Still Waiting holds no row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-1iy rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-6zm,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-1iy (US2-TC10): Still Waiting marks no status, worklist row or order page

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_w>` has waited 100 hours in Preparing Invoice and is listed in Still Waiting.
* `<needs_count>` is the Needs action count in Orders with no reminder lists in place.

**Steps:**

1. Open <grade10 admin orders url>.
2. Find the row for `<order_w>` in Needs action.
3. Open the page of `<order_w>`.

**Expected Results:**

* The Needs action count equals `<needs_count>`.
* The row of `<order_w>` is in Needs action with its status Preparing Invoice and no added mark or word.
* The order page header reads Preparing Invoice with no overdue word or mark.

<!-- trace:case id=g10adm.console-daily-reminder.TC-kp9 rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-kp9 (US2-TC11): Rows follow the operator's grants

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* `<operator>` holds `<grants>` and has not closed the daily dialog today.
* `<order_i>` waited 49 hours in Preparing Invoice, `<order_p>` in Payment Verifying and `<order_s>` in Preparing Shipment.

**Test data:**

| Field | Value |
| --- | --- |
| operator, grants, rows (row 1) | admin A, auction:read and auction:payment, rows for `<order_i>` and `<order_p>` only |
| operator, grants, rows (row 2) | admin B, auction:read and auction:shipment, the row for `<order_s>` only |
| operator, grants, rows (row 3) | admin C, auction:read, auction:payment and auction:shipment, all three rows |
| operator, grants, rows (row 4) | admin D, auction:read only, no row |

**Steps:**

1. Sign in as `<operator>`.
2. Navigate to <grade10 admin console url>.
3. Read Still Waiting.

**Expected Results:**

* Still Waiting holds `<rows>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-xnm rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-xnm (US2-TC12): The Still Waiting read leaves out rows the caller's grants do not allow

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* `<caller>` holds auction:read and auction:shipment.
* `<order_i>` waited 49 hours in Preparing Invoice and `<order_s>` in Preparing Shipment.

**Steps:**

1. Read the API response for the Still Waiting list as `<caller>`.

**Expected Results:**

* The response holds `<order_s>`.
* The response holds no row for `<order_i>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-j8o rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-j8o (US2-TC13): A flagged order is listed by its own wait, not by its flag

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_f>` is in `<status>` with an open payment flag, and has waited `<waited>` since the clock the Orders table names for that status.
* The flag was raised `<flagged>` ago.

**Test data:**

| Field | Value |
| --- | --- |
| status, waited, flagged, listed (row 1) | Payment Verifying, 49 hours, 1 hour, lists |
| status, waited, flagged, listed (row 2) | Preparing Shipment, 49 hours, 1 hour, lists |
| status, waited, flagged, listed (row 3) | Preparing Shipment, 10 hours, 60 hours, does not list |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<order_f>` in Still Waiting.

**Expected Results:**

* Still Waiting `<listed>` a row for `<order_f>`.
* A listed row shows the wait from the status clock, not from the flag.

<!-- trace:case id=g10adm.console-daily-reminder.TC-n4g rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-n4g (US2-TC14): The console shows the exact wait, not whole days

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_a>` has waited 49 hours and `<order_b>` has waited 70 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the waits of `<order_a>` and `<order_b>` in Still Waiting.

**Expected Results:**

* The two rows show different waits, `<order_b>` the longer.
* Neither wait is rounded to whole days.

<!-- trace:case id=g10adm.console-daily-reminder.TC-z1c rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-z1c (US2-TC15): Equal waits list by listing code, A to Z

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_x>` and `<order_y>` are in Preparing Invoice with their wait begun at the same moment, 60 hours before the read; `<code_x>` comes before `<code_y>` in A to Z order.
* `<order_z>` has waited 80 hours.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the order of rows in Still Waiting.

**Expected Results:**

* The rows read `<order_z>`, `<order_x>`, `<order_y>` from top to bottom.

<!-- trace:case id=g10adm.console-daily-reminder.TC-e5w rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-b5m,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-e5w (US2-TC16): The Still Waiting read refuses a caller with no auction access

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* `<caller>` holds no auction grant.
* `<order_w>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Read the API response for the Still Waiting list as `<caller>`.

**Expected Results:**

* The response is a refusal.
* The response holds no row.

---

## grade10-admin-console-daily-reminder-US3: Operator finds the reminder again on Today

**As an** operator who closed the daily dialog,
**I want** the same two lists on Today, beside what needs me,
**so that** I can come back to them later in the day without the dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-64m rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-64m (US3-TC1): Today shows What's New, Still Waiting and Needs you side by side

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) closed the daily dialog today.
* `<listing_1>` closed yesterday, Hong Kong time, and `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read the columns from left to right.

**Expected Results:**

* The page shows three columns: What's New, Still Waiting, Needs you.
* What's New holds the row for `<listing_1>`.
* Still Waiting holds the row for `<order_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ja5 rev=1 covers=g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-ja5 (US3-TC2): Needs you keeps its cards in one column with counts and links unchanged

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<order_2>` has waited 49 hours in Preparing Invoice, so Still Waiting has a row.

**Steps:**

1. Read the Needs you column.
2. Open <grade10 admin orders url> and read the Needs action count.

**Expected Results:**

* Step 1 shows the section cards one under another.
* The Orders count in Needs you equals the Needs action count from Step 2.
* Each card link opens the page it opened before the reminder.

<!-- trace:case id=g10adm.console-daily-reminder.TC-z2e rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-1qd,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-z2e (US3-TC3): Approvals sits below the columns with Recent and All sections

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.

**Steps:**

1. Read the cards in the Needs you column.
2. Scroll below the three columns.

**Expected Results:**

* The Needs you column holds no Approvals card.
* The Approvals, Recent and All sections show below the three columns, in their own layout.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ges rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-ges (US3-TC4): Rows group by product with Auction first

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<listing_1>` closed yesterday and `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read the grouping of rows in What's New and in Still Waiting.

**Expected Results:**

* Each list holds its rows under an Auction group.

<!-- trace:case id=g10adm.console-daily-reminder.TC-0rq rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-0rq (US3-TC5): A list with no row stays as a column and says so

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<empty_lists>` have no row for the operator.

**Test data:**

| Field | Value |
| --- | --- |
| empty_lists (row 1) | What's New only |
| empty_lists (row 2) | Still Waiting only |
| empty_lists (row 3) | What's New and Still Waiting |

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read the three columns.

**Expected Results:**

* All three columns show.
* Each empty list says it has no rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-mgn rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-mgn (US3-TC6): The columns stack on a narrow screen with Needs you last

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url> in a narrow window.

**Steps:**

1. Read the order of the three lists from top to bottom.

**Expected Results:**

* The lists stack in one column: What's New, Still Waiting, Needs you.

<!-- trace:case id=g10adm.console-daily-reminder.TC-y84 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-y84 (US3-TC7): Today reads the lists on load, tab return and Refresh, never on a timer

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url> with the lists loaded.

**Steps:**

1. Leave the page untouched for 10 minutes.
2. Switch to another tab and back.
3. Reload the page.
4. Click Refresh.

**Expected Results:**

* Step 1 makes no read.
* Step 2 reads the lists.
* Step 3 reads the lists.
* Step 4 reads all three columns.

<!-- trace:case id=g10adm.console-daily-reminder.TC-tl6 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y,g10adm.console-daily-reminder.SC-e3n -->
### g10adm.console-daily-reminder.TC-tl6 (US3-TC8): Today lists every row without a cap

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* Twelve listings closed yesterday and twelve orders have waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Count the rows in each list.

**Expected Results:**

* What's New holds 12 rows.
* Still Waiting holds 12 rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-c2l rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-c2l (US3-TC9): A row on Today opens its order or listing

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<listing_1>` is sold, `<listing_2>` is unsold, and `<order_2>` waited 49 hours.

**Steps:**

1. Click the What's New row for `<listing_1>`, then go back.
2. Click the What's New row for `<listing_2>`, then go back.
3. Click the Still Waiting row for `<order_2>`.

**Expected Results:**

* Step 1 opens the winner order of `<listing_1>`.
* Step 2 opens the page of `<listing_2>`.
* Step 3 opens the page of `<order_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-554 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-554 (US3-TC10): Today shows an operator only the rows their grants allow

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_i>` waited 49 hours in Preparing Invoice and `<order_s>` in Preparing Shipment.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read Still Waiting.

**Expected Results:**

* Still Waiting holds the row for `<order_i>`.
* Still Waiting holds no row for `<order_s>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-p3h rev=1 covers=g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-p3h (US3-TC11): Refresh reads all three columns again

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url> with the lists loaded.
* `<order_1>` is the winner order of a listing sold yesterday, in Preparing Invoice, with a row in What's New.
* `<order_w>` has waited 49 hours in Preparing Invoice and has a row in Still Waiting.

**Steps:**

1. Read the What's New row of `<order_1>`, the Still Waiting row of `<order_w>` and the Orders count in Needs you.
2. In another browser, send the invoice of `<order_1>` and of `<order_w>`.
3. Click Refresh.

**Expected Results:**

* Step 3 shows the What's New row of `<order_1>` with its new status.
* Step 3 shows no row for `<order_w>` in Still Waiting.
* Step 3 shows the Orders count in Needs you changed to match the Needs action count in Orders.

<!-- trace:case id=g10adm.console-daily-reminder.TC-v6b rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-v6b (US3-TC12): A failed list on Today says so in its column with a Retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* The read for `<failing_list>` is made to fail.
* The other list has no row for the operator.

**Test data:**

| Field | Value |
| --- | --- |
| failing_list (row 1) | What's New |
| failing_list (row 2) | Still Waiting |

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read the three columns.

**Expected Results:**

* The `<failing_list>` column says it failed to load and shows a Retry.
* The `<failing_list>` column does not say it has no rows.
* The other list says it has no rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-a7l rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-a7l (US3-TC13): An operator with no auction access sees empty lists without a failure

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds no auction grant) is on <grade10 admin today url>.
* Listings closed yesterday and orders have waited 49 hours.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read What's New and Still Waiting.

**Expected Results:**

* Each of the two columns says it has no rows.
* Neither column shows a failure notice.

<!-- trace:case id=g10adm.console-daily-reminder.TC-t2r rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-1qd,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-t2r (US3-TC14): The Approvals card keeps its content and controls

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
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<approval_1>` is waiting for the operator.

**Steps:**

1. Scroll below the three columns.
2. Read the Approvals card.

**Expected Results:**

* The Approvals card shows `<approval_1>` with its approve and decline controls.
* The card shows the same content as it showed before the reminder.

---

## grade10-admin-console-daily-reminder-US4: Operator reads the day's lists in Slack

**As an** auction operator who works from Slack,
**I want** the day's new listings and the orders still waiting posted to our channel each morning, every row a link,
**so that** the team sees what is waiting, and opens it, without first opening the console.

<!-- trace:case id=g10adm.console-daily-reminder.TC-gqc rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-gqc (US4-TC1): Both lists post as one message at 08:00 Hong Kong time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured for the environment with a channel and token.
* `<listing_1>` closed sold and `<listing_2>` closed unsold yesterday, Hong Kong time; `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Wait until 08:00 Hong Kong time.
2. Read the channel `<slack channel>`.

**Expected Results:**

* One message arrives at 08:00 Hong Kong time.
* The message holds a What's New list and a Still Waiting list.
* Rows for `<listing_1>`, `<listing_2>` and `<order_2>` show.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ark rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-ark (US4-TC2): Every row links to its listing or order in the console

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Today's message is posted with rows for sold `<listing_1>`, unsold `<listing_2>` and waiting `<order_2>`.

**Steps:**

1. Click the link on the `<listing_1>` row.
2. Click the link on the `<listing_2>` row.
3. Click the link on the `<order_2>` row.

**Expected Results:**

* Step 1 opens the winner order of `<listing_1>` in the console.
* Step 2 opens the page of `<listing_2>` in the console.
* Step 3 opens the page of `<order_2>` in the console.

<!-- trace:case id=g10adm.console-daily-reminder.TC-wlt rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-wlt (US4-TC3): A row names the listing code, lot, outcome or action and whole days waited

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Today's message is posted with rows for sold `<listing_1>`, unsold `<listing_2>` and `<order_2>`, which has waited 49 hours in Preparing Invoice.

**Steps:**

1. Read the row for each of the three.

**Expected Results:**

* The `<listing_1>` row shows its listing code, lot and the outcome sold.
* The `<listing_2>` row shows its listing code, lot and the outcome unsold.
* The `<order_2>` row shows its listing code, lot, the action Send invoice and 2 days waited.

<!-- trace:case id=g10adm.console-daily-reminder.TC-x2r rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-x2r (US4-TC4): The message carries everyone's rows whatever an operator's grants

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<order_i>` waited 49 hours in Preparing Invoice and `<order_s>` in Preparing Shipment.
* admin(holds auction:read only) sees neither row in the console.
* Today's message is posted.

**Steps:**

1. Read the Still Waiting list in the message.

**Expected Results:**

* The message holds a row for `<order_i>`.
* The message holds a row for `<order_s>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-kgn rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-kgn (US4-TC5): Each list stops at 10 rows with a link to Today for the rest

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
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<count>` orders have waited past 48 hours in Preparing Invoice.
* Today's message is posted.

**Test data:**

| Field | Value |
| --- | --- |
| count, rows, more (row 1) | 10, 10, no link to Today |
| count, rows, more (row 2) | 11, 10, a link to Today saying 1 more |
| count, rows, more (row 3) | 14, 10, a link to Today saying 4 more |

**Steps:**

1. Count the rows in Still Waiting in the message.
2. Read the end of the list.

**Expected Results:**

* The list holds `<rows>` rows.
* The end of the list shows `<more>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7zn rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-7zn (US4-TC6): The 10 rows are the longest waits and each list is counted alone

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Eleven orders waited past 48 hours, `<order_last>` the shortest wait.
* Three listings closed yesterday.
* Today's message is posted.

**Steps:**

1. Read both lists in the message.

**Expected Results:**

* Still Waiting shows 10 rows without `<order_last>` and a link to Today saying 1 more.
* What's New shows 3 rows and no link to Today.

<!-- trace:case id=g10adm.console-daily-reminder.TC-12f rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-12f (US4-TC7): A lot title over 60 characters is cut to 59 and an ellipsis

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<listing_t>` closed yesterday with a lot title of `<title length>`.
* Today's message is posted.

**Test data:**

| Field | Value |
| --- | --- |
| title length, shown (row 1) | 59 characters, the whole title |
| title length, shown (row 2) | 60 characters, the whole title |
| title length, shown (row 3) | 61 characters, the first 59 characters and an ellipsis |

**Steps:**

1. Read the row for `<listing_t>`.

**Expected Results:**

* The row shows the listing code, then the lot title `<shown>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-31k rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-31k (US4-TC8): The post follows the Hong Kong day on every day of the week

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured; `<listing_y>` closed yesterday at 23:59:59 and `<listing_t>` closed today at 07:59:59, both Hong Kong time.

**Test data:**

| Field | Value |
| --- | --- |
| day (row 1) | A Saturday |
| day (row 2) | A Sunday |
| day (row 3) | A Wednesday |

**Steps:**

1. Run the scheduled post on `<day>` at 08:00 Hong Kong time.
2. Read the message.

**Expected Results:**

* One message posts for `<day>`.
* It holds a row for `<listing_y>` and none for `<listing_t>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-5hn rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-5hn (US4-TC9): A list with no row is left out of a message that has rows

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured.
* `<rows_in>` has a row; `<rows_out>` has none.

**Test data:**

| Field | Value |
| --- | --- |
| rows_in, rows_out (row 1) | What's New, Still Waiting |
| rows_in, rows_out (row 2) | Still Waiting, What's New |

**Steps:**

1. Wait until 08:05 Hong Kong time.
2. Read the channel.

**Expected Results:**

* One message from today shows the rows of `<rows_in>`.
* The message shows no heading and no none line for `<rows_out>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-swg rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-hb6 -->
### g10adm.console-daily-reminder.TC-swg (US4-TC10): Each environment posts to its own channel

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Staging and production hold different Slack channels in their settings.
* Rows exist for the day in staging.

**Steps:**

1. Wait until 08:00 Hong Kong time.
2. Read the staging channel.
3. Read the production channel.

**Expected Results:**

* The staging channel holds the message.
* The production channel holds no message from staging.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ne7 rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-ne7 (US4-TC11): The message carries no winner name, email or phone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<listing_1>` closed sold yesterday to `<winner_1>`, with its own name, email and phone.
* `<order_2>` has waited 49 hours; its winner is `<winner_2>`, with its own name, email and phone.
* Today's message is posted.

**Steps:**

1. Read the whole message, including each link text.
2. Search the message for each winner's name, email and phone.

**Expected Results:**

* No winner's name appears.
* No winner's email appears.
* No winner's phone appears.

<!-- trace:case id=g10adm.console-daily-reminder.TC-g54 rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-4mh,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-g54 (US4-TC12): Nothing posts when both lists are empty

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured.
* No listing closed yesterday, Hong Kong time, and no order has waited 48 hours.

**Steps:**

1. Wait until 08:05 Hong Kong time.
2. Read the channel.

**Expected Results:**

* The channel holds no message from today.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7fe rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-6kr,g10adm.console-daily-reminder.SC-07a -->
### g10adm.console-daily-reminder.TC-7fe (US4-TC16): A message that failed to send is not made up on a later day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured; the Slack send fails on `<day_1>`.
* On the next Hong Kong day `<day_2>` rows exist and sends succeed.

**Steps:**

1. Run the scheduled post on `<day_1>` at 08:00 Hong Kong time.
2. Run the scheduled post on `<day_2>` at 08:00 Hong Kong time.
3. Read the channel.

**Expected Results:**

* The channel holds no message for `<day_1>`.
* The channel holds one message for `<day_2>` with the lists of `<day_2>`.
* The log holds an error for `<day_1>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7e7 rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-f3g -->
### g10adm.console-daily-reminder.TC-7e7 (US4-TC17): Nothing posts without a channel or a token, and the log says it is not configured

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<missing>` is not set for the environment.
* Rows exist for the day.

**Test data:**

| Field | Value |
| --- | --- |
| missing (row 1) | the Slack channel |
| missing (row 2) | the Slack access token |
| missing (row 3) | both |

**Steps:**

1. Run the scheduled post.
2. Read the channel and the log.

**Expected Results:**

* No message posts.
* The run does not post to any other channel.
* The log says Slack is not configured.

<!-- trace:case id=g10adm.console-daily-reminder.TC-g9s rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-6kr -->
### g10adm.console-daily-reminder.TC-g9s (US4-TC18): A failed send is tried once, logged and not sent again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured and a message is due for `<day>`.
* The Slack send is made to fail.

**Steps:**

1. Run the scheduled post.
2. Wait until the end of that Hong Kong day.
3. Read the channel and the log.

**Expected Results:**

* The send is attempted once.
* The log holds an error for the failed send.
* The channel holds no message for `<day>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-y0m rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-y0m (US4-TC19): Days waited are whole days, rounded down

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
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<order_d>` is in Preparing Invoice and has waited `<waited>` at 08:00 Hong Kong time.
* Today's message is posted.

**Test data:**

| Field | Value |
| --- | --- |
| waited, days (row 1) | 48 hours, 2 |
| waited, days (row 2) | 71 hours 59 minutes, 2 |
| waited, days (row 3) | 72 hours, 3 |

**Steps:**

1. Read the row for `<order_d>`.

**Expected Results:**

* The row shows `<days>` days waited.

<!-- trace:case id=g10adm.console-daily-reminder.TC-i4q rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-i4q (US4-TC20): The message shows no link previews

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Today's message is posted with rows for sold `<listing_1>`, unsold `<listing_2>` and waiting `<order_2>`.

**Steps:**

1. Read the message in the channel.

**Expected Results:**

* Every row shows its link.
* No row shows a link preview.

<!-- trace:case id=g10adm.console-daily-reminder.TC-o8u rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-o8u (US4-TC21): Equal waits fill the first 10 rows by listing code

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
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Eleven orders are in Preparing Invoice with their wait begun at the same moment; their listing codes are `<codes>`.
* Today's message is posted.

**Steps:**

1. Read the codes of the rows in Still Waiting.
2. Read the end of the list.

**Expected Results:**

* The 10 rows hold the first 10 listing codes of `<codes>` in A to Z order.
* The last code in A to Z order is not a row.
* The end of the list shows a link to Today saying 1 more.

## Settled

- **An order at exactly 48 hours** - listed. The wait is 48 hours elapsed from the clock the Orders table names, and an order is listed from the instant the 48th hour has passed, then every day until it moves on
- **Entry for the dialog** - a full signed-in page load of the console; a deep link while signed out opens it after sign-in; returning to the tab or moving between pages does not. Only closing sets the day's mark, so a later entry with rows opens it after an empty one
- **Closing** - the close control, Escape, a click outside and following a row; the mark is kept in the browser per operator and Hong Kong day, cleared at sign-out, and where nothing persists it the dialog opens once per page load
- **A session that ends without the console's sign-out** - the mark stays in that browser until the Hong Kong day ends; only a sign-out from the console clears it
- **Flagged orders** - listed by their own wait; the flag starts no second clock
- **Slack send** - one attempt, no retry, no record; a failure is logged and that day's message is not sent later; a repeat after a worker failure is accepted and not asserted
- **Reading access** - opens an unsold listing; a called-off listing is not listed; a close with no bids is Unsold; a caller with no auction access is refused
- **Wait display** - the console shows days and hours, as `3d 5h`; Slack shows whole days rounded down
- **Order of rows** - longest wait first and equal waits by listing code, A to Z; What's New lists the latest close first and equal closes by listing code, A to Z; Slack takes its first 10 by the exact wait or close, not by the days shown
- **Lists in the console** - every row, with no cap; only Slack stops at 10 a list
- **A failed list** - the dialog opens for it even when the other list is empty, and Today shows the notice and a Retry in its column
- **Refresh** - Today's Refresh reads all three columns again; the dialog reads when it opens and has none
- **Approvals** - the card sits below the three columns with Recent and All sections, and still counts in the Needs you total and the summary line
- **A whole-day wait** - reads `5d`, with no `0h`
- **A row opened in a new tab** - a middle click, or a click with Ctrl or Cmd held, leaves the dialog open and sets no mark
- **Long lists** - Today folds each product's list to one line until its chevron opens it; the dialog shows about four and a half rows of each and scrolls the rest inside the list

## Reconciliation

**Run:** QA1 blind feature pass, 2026-10-12, tcs-rules r5, in a fresh context, over the cases above and the `## Settled` below. Read `## Purpose` and `## Feature set` of the change's `daily-reminder` `spec.md`, its `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` (25 rows, each now landed as Q12 or Q31 to Q45), the pages Daily Reminder and Auction Management under `docs/prds/products/grade10-admin/`, `openspec/config.yaml`'s `context`, and the existing suite with its `## Reconciliation` stripped. No `ui-design.md` or `domain-tcs.md` sat above the capability. Denied every `## Requirements` section and scenario, `tech-design.md`, `tasks.md`, QA2 material and `openspec/changes/archive/`. It left the suite at 80 draft cases.

**Run:** QA2 reconciliation, 2026-10-12, in a fresh context. Joined the 80 blind cases and the delta's 81 scenarios on the four journeys and the six root groups of the Feature set. Read the cases above, `spec.md` whole, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q48 and `## Raised`), `tech-design.md`, `tasks.md`, the two PRD pages and the earlier reconciliation in git (commit 187eded6) for the settled answers. The application repository was not read; what `tech-design.md` says of it is taken as stated. Every case stays `draft`, and no scenario, requirement, design, task or page line moved. The two rows this run raised have landed as Q46 and Q47; the later fold and scroll landed as Q48. Refreshed after the acceptance review: SC-07 left the `covers` markers, as the other out-of-suite scenarios are, and SC-82's walk is task 5.1.

| Case | Anchor | Disposition |
| --- | --- | --- |
| `g10adm.console-daily-reminder.TC-ue2` (US1-TC1) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-25`, `grade10-admin-console-daily-reminder-SC-26`, `grade10-admin-console-daily-reminder-SC-01`, `grade10-admin-console-daily-reminder-SC-03`, `grade10-admin-console-daily-reminder-SC-04`, `grade10-admin-console-daily-reminder-SC-08`. Rows, the dialog over the landing page, both lists |
| `g10adm.console-daily-reminder.TC-rz8` (US1-TC2) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-03` |
| `g10adm.console-daily-reminder.TC-u6q` (US1-TC3) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-04` |
| `g10adm.console-daily-reminder.TC-jod` (US1-TC4) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-06`. The case sets no equal closes |
| `g10adm.console-daily-reminder.TC-5cx` (US1-TC5) | US-01 | Folded in part: `grade10-admin-console-daily-reminder-SC-02`. The scenario states the upper edge; a close at 00:00:00 yesterday is listed by the requirement sentence (a close belongs to the day it began) and no scenario names it |
| `g10adm.console-daily-reminder.TC-pk3` (US1-TC6) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-02` |
| `g10adm.console-daily-reminder.TC-7l8` (US1-TC7) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-29`, `grade10-admin-console-daily-reminder-SC-25`. Steps 3 and 4 are full loads, entries under Q32 |
| `g10adm.console-daily-reminder.TC-zgt` (US1-TC8) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-30`. The London row is the scenario; the Hong Kong row is the plain next day |
| `g10adm.console-daily-reminder.TC-6qf` (US1-TC9) | US-01 | Folded in part: `grade10-admin-console-daily-reminder-SC-25`. Closing leaves the same page showing: implied by "over it", stated nowhere |
| `g10adm.console-daily-reminder.TC-xds` (US1-TC10) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-31` |
| `g10adm.console-daily-reminder.TC-1g3` (US1-TC11) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-32` |
| `g10adm.console-daily-reminder.TC-twg` (US1-TC12) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-33` |
| `g10adm.console-daily-reminder.TC-323` (US1-TC13) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-27` |
| `g10adm.console-daily-reminder.TC-ffo` (US1-TC14) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-34`. The scenario now moves between pages without a reload and reloads after, as the case does |
| `g10adm.console-daily-reminder.TC-4no` (US1-TC15) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-05` |
| `g10adm.console-daily-reminder.TC-ogw` (US1-TC16) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-76`. The console and Today list every row, and Slack alone stops at 10 (Q23) |
| `g10adm.console-daily-reminder.TC-9en` (US1-TC17) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-02`. The two-days-earlier and 00:00:00-today edges are the scenario's; a close at 08:30 today is outside the window by the requirement sentence |
| `g10adm.console-daily-reminder.TC-n3a` (US1-TC18) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-28` |
| `g10adm.console-daily-reminder.TC-z6w` (US1-TC19) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-35`. The scenario fails What's New; the Still Waiting row follows requirement step 3 |
| `g10adm.console-daily-reminder.TC-nb8` (US1-TC20) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-24`. Row 2 follows the Reading row of the grants table |
| `g10adm.console-daily-reminder.TC-atu` (US1-TC21) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-24` |
| `g10adm.console-daily-reminder.TC-b4k` (US1-TC22) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-24`. Q34: reading opens an unsold listing; row 2 follows the grants table |
| `g10adm.console-daily-reminder.TC-h9v` (US1-TC23) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-62` |
| `g10adm.console-daily-reminder.TC-m2d` (US1-TC24) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-61` |
| `g10adm.console-daily-reminder.TC-q7s` (US1-TC25) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-29`, `grade10-admin-console-daily-reminder-SC-68`, `grade10-admin-console-daily-reminder-SC-69`. The control row is the plain close of the first; Escape and a click outside are the second; the row click is the third. Q47 settles a modified click |
| `g10adm.console-daily-reminder.TC-w3n` (US1-TC26) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-70` |
| `g10adm.console-daily-reminder.TC-c8j` (US1-TC27) | US-01 | Folded in part: `grade10-admin-console-daily-reminder-SC-67`. Steps 3 and 4, tab return and moving between pages open nothing, are the requirement's definition of an entry (Q32); no scenario names them with the dialog not open |
| `g10adm.console-daily-reminder.TC-r1t` (US1-TC28) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-66` |
| `g10adm.console-daily-reminder.TC-f6y` (US1-TC29) | US-01 | Folded in part: `grade10-admin-console-daily-reminder-SC-71`. Row 2 is the scenario; rows 1 and 3, What's New failed and both failed, follow requirement step 2 |
| `g10adm.console-daily-reminder.TC-k0e` (US1-TC30) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-71` |
| `g10adm.console-daily-reminder.TC-u9a` (US1-TC31) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-72` |
| `g10adm.console-daily-reminder.TC-x5p` (US1-TC32) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-65` |
| `g10adm.console-daily-reminder.TC-ivd` (US2-TC1) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-09`, `grade10-admin-console-daily-reminder-SC-11`, `grade10-admin-console-daily-reminder-SC-17` |
| `g10adm.console-daily-reminder.TC-fbu` (US2-TC2) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-12`. Q12: listed at 48:00 |
| `g10adm.console-daily-reminder.TC-ala` (US2-TC3) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-13` |
| `g10adm.console-daily-reminder.TC-eba` (US2-TC4) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-14`, `grade10-admin-console-daily-reminder-SC-30` |
| `g10adm.console-daily-reminder.TC-aah` (US2-TC5) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-14`, `grade10-admin-console-daily-reminder-SC-44` |
| `g10adm.console-daily-reminder.TC-5ri` (US2-TC6) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-27` |
| `g10adm.console-daily-reminder.TC-t7x` (US2-TC7) | US-02 | Folded in part: `grade10-admin-console-daily-reminder-SC-12`. Row 1 is the boundary; the 25-hour row (Q12, decisions.md:41) rides on the same elapsed-time rule and no scenario names a calendar-day reading |
| `g10adm.console-daily-reminder.TC-to3` (US2-TC8) | US-02 | Folded in part: `grade10-admin-console-daily-reminder-SC-10`. Row 2 is the scenario; rows 1 and 3, a recent setup under an old close and a paying payment after a part payment, follow the requirement's Waited since column and no scenario states them |
| `g10adm.console-daily-reminder.TC-xga` (US2-TC9) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-15` |
| `g10adm.console-daily-reminder.TC-1iy` (US2-TC10) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-18`, `grade10-admin-console-daily-reminder-SC-19`. The case does not post to Slack, which the second scenario also names |
| `g10adm.console-daily-reminder.TC-kp9` (US2-TC11) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-20`, `grade10-admin-console-daily-reminder-SC-21`, `grade10-admin-console-daily-reminder-SC-22`, `grade10-admin-console-daily-reminder-SC-23` |
| `g10adm.console-daily-reminder.TC-xnm` (US2-TC12) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-21`. The same rule read at the API |
| `g10adm.console-daily-reminder.TC-j8o` (US2-TC13) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-16`, `grade10-admin-console-daily-reminder-SC-63`. Row 1, Payment Verifying, follows the requirement; Q31 |
| `g10adm.console-daily-reminder.TC-n4g` (US2-TC14) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-11`. The case checks only that the wait is not whole days; the form is Q43 and Q46 |
| `g10adm.console-daily-reminder.TC-z1c` (US2-TC15) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-64` |
| `g10adm.console-daily-reminder.TC-e5w` (US2-TC16) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-65` |
| `g10adm.console-daily-reminder.TC-64m` (US3-TC1) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-36` |
| `g10adm.console-daily-reminder.TC-ja5` (US3-TC2) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-37`, `grade10-admin-console-daily-reminder-SC-18` |
| `g10adm.console-daily-reminder.TC-z2e` (US3-TC3) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-42`, `grade10-admin-console-daily-reminder-SC-37` |
| `g10adm.console-daily-reminder.TC-ges` (US3-TC4) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-38` |
| `g10adm.console-daily-reminder.TC-0rq` (US3-TC5) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-39`. The scenario empties both lists; rows 1 and 2 empty one |
| `g10adm.console-daily-reminder.TC-mgn` (US3-TC6) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-43` |
| `g10adm.console-daily-reminder.TC-y84` (US3-TC7) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-44` |
| `g10adm.console-daily-reminder.TC-tl6` (US3-TC8) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-76`. The console and Today list every row, and Slack alone stops at 10 (Q23) |
| `g10adm.console-daily-reminder.TC-c2l` (US3-TC9) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-41`, `grade10-admin-console-daily-reminder-SC-17` |
| `g10adm.console-daily-reminder.TC-554` (US3-TC10) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-20`, `grade10-admin-console-daily-reminder-SC-36`. The grant scenario reads Still Waiting without naming Today |
| `g10adm.console-daily-reminder.TC-p3h` (US3-TC11) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-44`, `grade10-admin-console-daily-reminder-SC-18` |
| `g10adm.console-daily-reminder.TC-v6b` (US3-TC12) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-40`. The scenario fails Still Waiting beside a What's New with rows; the case leaves the other list empty |
| `g10adm.console-daily-reminder.TC-a7l` (US3-TC13) | US-03 | Folded in part: `grade10-admin-console-daily-reminder-SC-24`, `grade10-admin-console-daily-reminder-SC-39`. Together they give an operator who cannot open Auction three columns, empty and unfailed (Q25, Q35); no scenario names Today for that operator |
| `g10adm.console-daily-reminder.TC-t2r` (US3-TC14) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-42` |
| `g10adm.console-daily-reminder.TC-gqc` (US4-TC1) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-45`, `grade10-admin-console-daily-reminder-SC-47`. The case does not read the channel at 07:59:59 |
| `g10adm.console-daily-reminder.TC-ark` (US4-TC2) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-46`. The case opens each link; the staging-not-production half is not asserted |
| `g10adm.console-daily-reminder.TC-wlt` (US4-TC3) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-49`, `grade10-admin-console-daily-reminder-SC-73` |
| `g10adm.console-daily-reminder.TC-x2r` (US4-TC4) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-47` |
| `g10adm.console-daily-reminder.TC-kgn` (US4-TC5) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-51`, `grade10-admin-console-daily-reminder-SC-52` |
| `g10adm.console-daily-reminder.TC-7zn` (US4-TC6) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-52` |
| `g10adm.console-daily-reminder.TC-12f` (US4-TC7) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-50`. The 59-character row follows the scenario's 60-character whole |
| `g10adm.console-daily-reminder.TC-31k` (US4-TC8) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-45`, `grade10-admin-console-daily-reminder-SC-02`. The Saturday row is the scenario; the Sunday and Wednesday rows and the window edges follow the daily rule |
| `g10adm.console-daily-reminder.TC-5hn` (US4-TC9) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-74` |
| `g10adm.console-daily-reminder.TC-swg` (US4-TC10) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-59` |
| `g10adm.console-daily-reminder.TC-ne7` (US4-TC11) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-48` |
| `g10adm.console-daily-reminder.TC-g54` (US4-TC12) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-53` |
| `g10adm.console-daily-reminder.TC-7fe` (US4-TC16) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-57`, `grade10-admin-console-daily-reminder-SC-56` |
| `g10adm.console-daily-reminder.TC-7e7` (US4-TC17) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-60`. The case does not read the log, which the scenario does |
| `g10adm.console-daily-reminder.TC-g9s` (US4-TC18) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-54`, `grade10-admin-console-daily-reminder-SC-56` |
| `g10adm.console-daily-reminder.TC-y0m` (US4-TC19) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-73` |
| `g10adm.console-daily-reminder.TC-i4q` (US4-TC20) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-75` |
| `g10adm.console-daily-reminder.TC-o8u` (US4-TC21) | US-04 | Folded in part: `grade10-admin-console-daily-reminder-SC-52`, `grade10-admin-console-daily-reminder-SC-64`. Equal waits by listing code is requirement step 3 and the console scenario; no Slack scenario cuts a list on equal waits (Q42) |

- **Counts** - 72 folded, 8 folded in part, 0 raised, 0 uncovered, 0 rejected. No blind case was a misreading of the anchors.
- **Anchor coverage** - US-01 to US-04 each have cases (32, 16, 14 and 18). Every root group of the Feature set is walked: What's New list by the US-01 cases on rows, order, edges and outcome, Still Waiting list by US-02, Row access by `g10adm.console-daily-reminder.TC-nb8`, `g10adm.console-daily-reminder.TC-atu`, `g10adm.console-daily-reminder.TC-b4k`, `g10adm.console-daily-reminder.TC-x5p`, `g10adm.console-daily-reminder.TC-kp9`, `g10adm.console-daily-reminder.TC-xnm`, `g10adm.console-daily-reminder.TC-e5w` and `g10adm.console-daily-reminder.TC-554`, Daily dialog by US-01, Today columns by US-03, Slack message by US-04. No anchor is uncovered
- **Scenarios no case reaches** - `grade10-admin-console-daily-reminder-SC-07` (a test lot is listed like any other, Q27) and the scenarios added after the blind pass for Q42, Q44, Q45 and Q47: SC-77, SC-78, SC-79, SC-80 and SC-81, and SC-82 and SC-83 for Q48. No case was written from them: a case written from a scenario is not a blind reading. Each is listed under Out of suite with the automated test that verifies it; `/tcs-review` is asked whether to write a case for each
- **Scenarios reached in part** - `grade10-admin-console-daily-reminder-SC-19` (no case posts the order to Slack and reads it back unmarked), `grade10-admin-console-daily-reminder-SC-45` (no case reads the channel at 07:59:59), `grade10-admin-console-daily-reminder-SC-46` (no case checks that a staging post links nowhere to production) and `grade10-admin-console-daily-reminder-SC-72` (no case leaves the tab and comes back with the dialog open)
- **Cases no scenario states** - `g10adm.console-daily-reminder.TC-ogw` and `g10adm.console-daily-reminder.TC-tl6` (the console lists every row, Q23, `decisions.md:52`), the lower edge of `g10adm.console-daily-reminder.TC-5cx`, the tab return and page move of `g10adm.console-daily-reminder.TC-c8j` with no dialog open, rows 1 and 3 of `g10adm.console-daily-reminder.TC-to3`, the 25-hour row of `g10adm.console-daily-reminder.TC-t7x` (Q12), rows 1 and 3 of `g10adm.console-daily-reminder.TC-f6y`, the Today columns of an operator who cannot open Auction in `g10adm.console-daily-reminder.TC-a7l`, and the Slack cut on equal waits of `g10adm.console-daily-reminder.TC-o8u`. Each is a real behaviour with a decision or a requirement sentence behind it, so the fold is a scenario for each, not a rejection
- **Decisions and page lines no scenario states** - none. Q23, Q42, Q44, Q45 and Q47 are stated by SC-76 to SC-81 and Q46 by SC-16; Q38 has no scenario by design: it accepts a repeat post and asserts nothing
- **Q31 to Q48 against the scenarios** - Q31 `grade10-admin-console-daily-reminder-SC-16`, `grade10-admin-console-daily-reminder-SC-63`; Q32 `grade10-admin-console-daily-reminder-SC-25`, `grade10-admin-console-daily-reminder-SC-66`, `grade10-admin-console-daily-reminder-SC-67` and, for tab return and page moves, `grade10-admin-console-daily-reminder-SC-34`, `grade10-admin-console-daily-reminder-SC-72` in part; Q33 `grade10-admin-console-daily-reminder-SC-29`, `grade10-admin-console-daily-reminder-SC-32`, `grade10-admin-console-daily-reminder-SC-68`, `grade10-admin-console-daily-reminder-SC-69`, `grade10-admin-console-daily-reminder-SC-70`; Q34 `grade10-admin-console-daily-reminder-SC-61`, `grade10-admin-console-daily-reminder-SC-62`, `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-04`; Q35 `grade10-admin-console-daily-reminder-SC-35`, `grade10-admin-console-daily-reminder-SC-40`, `grade10-admin-console-daily-reminder-SC-65`, `grade10-admin-console-daily-reminder-SC-71`, `grade10-admin-console-daily-reminder-SC-24`; Q36 `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-11`, `grade10-admin-console-daily-reminder-SC-13`, `grade10-admin-console-daily-reminder-SC-49`, `grade10-admin-console-daily-reminder-SC-64`, `grade10-admin-console-daily-reminder-SC-73`; Q37 `grade10-admin-console-daily-reminder-SC-50`, `grade10-admin-console-daily-reminder-SC-60`, `grade10-admin-console-daily-reminder-SC-74`, `grade10-admin-console-daily-reminder-SC-75`; Q38 none; Q39 `grade10-admin-console-daily-reminder-SC-44`, `grade10-admin-console-daily-reminder-SC-72`; Q40 `grade10-admin-console-daily-reminder-SC-67`; Q41 `grade10-admin-console-daily-reminder-SC-37`, `grade10-admin-console-daily-reminder-SC-42`; Q42 `grade10-admin-console-daily-reminder-SC-77`, `grade10-admin-console-daily-reminder-SC-78`; Q43 `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-11`; Q44 `grade10-admin-console-daily-reminder-SC-79`; Q45 `grade10-admin-console-daily-reminder-SC-80`, `grade10-admin-console-daily-reminder-SC-37` in part; Q46 `grade10-admin-console-daily-reminder-SC-16`; Q47 `grade10-admin-console-daily-reminder-SC-81`; Q48 `grade10-admin-console-daily-reminder-SC-82`, `grade10-admin-console-daily-reminder-SC-83`
- **Contradicted** - no case and scenario state opposite things, and no two scenarios do. The Saturday scenario's message carries only the list that has rows, as the requirement's step 2 says, and a whole-day wait reads `5d` (Q46)
- **Raised** - nothing open. The two rows this run raised landed as Q46 (a whole-day wait reads `5d`; `g10adm.console-daily-reminder.TC-n4g`) and Q47 (a modified click leaves the dialog open; `g10adm.console-daily-reminder.TC-q7s`), and the 25 earlier rows are landed
- **Tasks and requirements** - every scenario id `tasks.md` names exists, and each of the 81 is named by at least one task. Each requirement has a tests-first task: the two reads and grants in 2.1, Slack and its failure in 3.1, the dialog and Today in 4.1; the page group 1 is store-only. Every group ends with a verify task, and the walk group walks US-01 and US-02 in 5.1, US-03 in 5.2 and US-04 in 5.3
- **Markers** - `covers` lists every scenario serving the case's `Trace` journey, in spec order, as `docs/governance/test-traceability.md` requires, plus the scenarios that serve a Feature set group and are reached by the case: `grade10-admin-console-daily-reminder-SC-18` and `grade10-admin-console-daily-reminder-SC-19` by `g10adm.console-daily-reminder.TC-1iy`, `grade10-admin-console-daily-reminder-SC-18` by `g10adm.console-daily-reminder.TC-ja5` and `g10adm.console-daily-reminder.TC-p3h`, `grade10-admin-console-daily-reminder-SC-42` by `g10adm.console-daily-reminder.TC-z2e` and `g10adm.console-daily-reminder.TC-t2r`, `grade10-admin-console-daily-reminder-SC-65` by `g10adm.console-daily-reminder.TC-x5p` and `g10adm.console-daily-reminder.TC-e5w`, and `grade10-admin-console-daily-reminder-SC-53`, `grade10-admin-console-daily-reminder-SC-56`, `grade10-admin-console-daily-reminder-SC-57`, `grade10-admin-console-daily-reminder-SC-59` and `grade10-admin-console-daily-reminder-SC-60` by the US-04 cases that walk each. The case markers keep the ids their headings carry; the scenario markers were added to `spec.md` by Dev. The two scenarios removed since the earlier run (a day's message never posts twice, and a retry reads the lists as they stand) leave no marker and no `covers` entry; no case names either
