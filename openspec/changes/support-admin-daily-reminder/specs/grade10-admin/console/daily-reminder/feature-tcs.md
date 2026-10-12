# grade10-admin/console/daily-reminder Test Cases

**Status:** pending-review · 0/60
**Drafts styled:** 2026-10-12, tcs-rules r5

## grade10-admin-console-daily-reminder-US1: Operator starts the day with what closed yesterday

**As an** auction operator,
**I want** a list of the listings that closed yesterday when I first open the console, each opening the order or listing it belongs to,
**so that** I begin with the lots that need my attention without searching for them.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ue2 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-rz8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-u6q rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-jod rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-5cx rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-pk3 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-7l8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-zgt rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-6qf rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-xds rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-1g3 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-twg rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-323 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-ffo rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
### g10adm.console-daily-reminder.TC-ffo (US1-TC14): A browser that blocks storage opens the dialog once per tab session

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
3. Navigate to <grade10 admin orders url> in the same tab.
4. Open a new tab and navigate to <grade10 admin console url>.

**Expected Results:**

* Step 1 opens the dialog.
* Step 3 shows the page with no dialog.
* Step 4 opens the dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-4no rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-ogw rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-9en rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-n3a rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-z6w rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
### g10adm.console-daily-reminder.TC-z6w (US1-TC19): A list that fails to load says so beside the list that loaded

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
* The dialog says `<failing_list>` failed to load.
* The dialog does not show `<failing_list>` as empty.
* The other list shows its rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-nb8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-atu rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-evg,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd -->
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

---

## grade10-admin-console-daily-reminder-US2: Operator is reminded of orders still waiting on them

**As an** operator with payment or shipment processing,
**I want** the orders that have waited 48 hours for me to send an invoice, check a proof or dispatch listed every day until I act, longest wait first,
**so that** an order I could not get to does not stay forgotten behind newer work.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ivd rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-fbu rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-ala rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-eba rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) closed the dialog on `<day_1>`.
* `<order_w>` has waited 49 hours in Preparing Invoice on `<day_1>` and is untouched.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Set the browser clock to the next Hong Kong day.
3. Navigate to <grade10 admin console url>.

**Expected Results:**

* Step 1 lists `<order_w>` in Still Waiting.
* Step 3 opens the dialog again, listing `<order_w>` with a longer wait.

<!-- trace:case id=g10adm.console-daily-reminder.TC-aah rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-5ri rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-t7x rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-to3 rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-xga rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-1iy rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-6zm,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-kp9 rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-xnm rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
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
### g10adm.console-daily-reminder.TC-z2e (US3-TC3): Approvals, Recent and All sections stay below the columns

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

1. Scroll below the three columns.

**Expected Results:**

* The Approvals, Recent and All sections show below the columns, in their own layout.

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
4. Click the Refresh control.

**Expected Results:**

* Step 1 makes no read.
* Step 2 reads the lists.
* Step 3 reads the lists.
* Step 4 reads the lists.

<!-- trace:case id=g10adm.console-daily-reminder.TC-tl6 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
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

---

## grade10-admin-console-daily-reminder-US4: Operator reads the day's lists in Slack

**As an** auction operator who works from Slack,
**I want** the day's new listings and the orders still waiting posted to our channel each morning, every row a link,
**so that** the team sees what is waiting, and opens it, without first opening the console.

<!-- trace:case id=g10adm.console-daily-reminder.TC-gqc rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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
* No message was posted today.

**Steps:**

1. Wait until 08:00 Hong Kong time.
2. Read the channel `<slack channel>`.

**Expected Results:**

* One message arrives at 08:00 Hong Kong time.
* The message holds a What's New list and a Still Waiting list.
* Rows for `<listing_1>`, `<listing_2>` and `<order_2>` show.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ark rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-wlt rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-wlt (US4-TC3): A row names the listing code, lot, outcome or action and days waited

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

* Today's message is posted with rows for sold `<listing_1>`, unsold `<listing_2>` and `<order_2>` waited 49 hours in Preparing Invoice.

**Steps:**

1. Read the row for each of the three.

**Expected Results:**

* The `<listing_1>` row shows its listing code, lot and the outcome sold.
* The `<listing_2>` row shows its listing code, lot and the outcome unsold.
* The `<order_2>` row shows its listing code, lot, the action Send invoice and its days waited.

<!-- trace:case id=g10adm.console-daily-reminder.TC-x2r rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-kgn rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-7zn rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-12f rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-12f (US4-TC7): A long lot title is cut to 60 characters after the listing code

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
| title length, shown (row 1) | 60 characters, the whole title |
| title length, shown (row 2) | 61 characters, the first 60 characters |

**Steps:**

1. Read the row for `<listing_t>`.

**Expected Results:**

* The row shows the listing code, then the lot title `<shown>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-31k rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-5hn rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-5hn (US4-TC9): A day with rows in one list only still posts

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
* `<listing_1>` closed yesterday, Hong Kong time; no order has waited 48 hours.

**Steps:**

1. Wait until 08:05 Hong Kong time.
2. Read the channel.

**Expected Results:**

* One message from today shows the row for `<listing_1>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-swg rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm,g10adm.console-daily-reminder.SC-hb6 -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-ne7 rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-g54 rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-4mh,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
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

<!-- trace:case id=g10adm.console-daily-reminder.TC-ymo rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-6kr,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-ymo (US4-TC13): A failed send is tried again and posts once

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
* The Slack send is made to fail twice and then succeed.

**Steps:**

1. Run the scheduled post.
2. Let the retries run through the same Hong Kong day.
3. Read the channel.

**Expected Results:**

* The channel holds one message for `<day>`.
* Each failed attempt is logged as an error.

<!-- trace:case id=g10adm.console-daily-reminder.TC-e7e rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-e7e (US4-TC14): A lost reply does not post the day's message twice

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
* Slack accepts the message but the reply to Grade10 is lost.

**Steps:**

1. Run the scheduled post.
2. Let the retry run.
3. Read the channel.

**Expected Results:**

* The channel holds exactly one message for `<day>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-rvs rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-fbm,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-rvs (US4-TC15): A second trigger the same day posts nothing more

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

* Slack is configured; today's message is already posted.

**Steps:**

1. Run the scheduled post again the same Hong Kong day.
2. Read the channel.

**Expected Results:**

* The channel still holds one message for today.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7fe rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-07a,g10adm.console-daily-reminder.SC-ogm -->
### g10adm.console-daily-reminder.TC-7fe (US4-TC16): A message that never sent is not posted on the next day

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

* Slack is configured; the Slack send fails for all of `<day_1>`.
* On the next Hong Kong day `<day_2>` rows exist and sends succeed.

**Steps:**

1. Let every retry for `<day_1>` fail until 23:59:59 Hong Kong time.
2. Run the scheduled post on `<day_2>` at 08:00 Hong Kong time.
3. Read the channel.

**Expected Results:**

* The channel holds no message for `<day_1>`.
* The channel holds one message for `<day_2>` with the lists of `<day_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7e7 rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-s95,g10adm.console-daily-reminder.SC-ogm,g10adm.console-daily-reminder.SC-f3g -->
### g10adm.console-daily-reminder.TC-7e7 (US4-TC17): Nothing posts without a channel or a token

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
2. Read the channel.

**Expected Results:**

* No message posts.
* The run does not post to any other channel.

## Settled

- **An order at exactly 48 hours** - listed. The wait is 48 hours elapsed from the clock the Orders table names, and an order is listed from the instant the 48th hour has passed, then every day until it moves on

## Reconciliation

**Run:** QA1 blind feature pass, 2026-10-12, tcs-rules r5, in a fresh context. Read `## Purpose` and `## Feature set` of the change's `daily-reminder` `spec.md`, its `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised`, the pages Daily Reminder and Auction Management under `docs/prds/products/grade10-admin/`, and `openspec/config.yaml`'s `context`. Denied every `## Requirements` section and scenario, `tech-design.md`, `tasks.md`, QA2 material and `openspec/changes/archive/`. No `ui-design.md`, earlier suite or `domain-tcs.md` sat above the capability. It raised 17 questions.

**Run:** QA2 reconciliation, 2026-10-12, in a fresh context. Joined the 60 blind cases and the delta's 60 scenarios on the four journeys and the six root groups of the Feature set. Read the cases above, `spec.md` whole, `user-journeys.md`, `proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md` and the two PRD pages. The application repository was not read; what `tech-design.md` says of it is taken as stated. `R<n>` below is the nth row of `decisions.md`'s `## Raised` in table order; R18 to R21 were added by this run from the technical design's own questions. Every case stays `draft`, and no scenario, requirement or page line moved.

| Case | Anchor | Disposition |
| --- | --- | --- |
| `g10adm.console-daily-reminder.TC-ue2` (US1-TC1) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-01`, `grade10-admin-console-daily-reminder-SC-03`, `grade10-admin-console-daily-reminder-SC-04`, `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-25`, `grade10-admin-console-daily-reminder-SC-26`. Rows, the dialog over the landing page, both lists |
| `g10adm.console-daily-reminder.TC-rz8` (US1-TC2) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-03` |
| `g10adm.console-daily-reminder.TC-u6q` (US1-TC3) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-04` |
| `g10adm.console-daily-reminder.TC-jod` (US1-TC4) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-06`. Equal close times are R14 |
| `g10adm.console-daily-reminder.TC-5cx` (US1-TC5) | US-01 | Folded in part: `grade10-admin-console-daily-reminder-SC-02`. The scenario states the upper edge, 23:59:59; the lower edge, a close at 00:00:00 yesterday, is listed by the requirement sentence and no scenario names it |
| `g10adm.console-daily-reminder.TC-pk3` (US1-TC6) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-02`. Both zone rows reach the rule that the day is the Hong Kong day |
| `g10adm.console-daily-reminder.TC-7l8` (US1-TC7) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-29`. The reload and the address in steps 3 and 4 count as entries, which R2 leaves open |
| `g10adm.console-daily-reminder.TC-zgt` (US1-TC8) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-30`. The London row is the scenario; the Hong Kong row is the plain next day |
| `g10adm.console-daily-reminder.TC-6qf` (US1-TC9) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-25`. Closing leaves the same page showing: implied by "over it", stated nowhere |
| `g10adm.console-daily-reminder.TC-xds` (US1-TC10) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-31` |
| `g10adm.console-daily-reminder.TC-1g3` (US1-TC11) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-32` |
| `g10adm.console-daily-reminder.TC-twg` (US1-TC12) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-33`. Step 2 treats a reload as the next entry, which R2 leaves open |
| `g10adm.console-daily-reminder.TC-323` (US1-TC13) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-27`. The scenario is the mirror, What's New shown and Still Waiting left out; requirement step 3 states the rule both ways |
| `g10adm.console-daily-reminder.TC-ffo` (US1-TC14) | US-01 | Raised: `grade10-admin-console-daily-reminder-SC-34`. R4: the scenario states the dialog opening once and again in a new tab, and says "move to another page in the same tab"; step 3 loads an address, and tech-design.md:95 keeps the mark in memory when both stores throw, which a full load clears |
| `g10adm.console-daily-reminder.TC-4no` (US1-TC15) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-05` |
| `g10adm.console-daily-reminder.TC-ogw` (US1-TC16) | US-01 | Uncovered. No scenario states that the console lists every row; decisions.md:52 (Q23) decides it, so a scenario is owed |
| `g10adm.console-daily-reminder.TC-9en` (US1-TC17) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-02`. The two-days-earlier and 00:00:00-today edges are the scenario's; a close at 08:30 today is outside the window by the requirement sentence |
| `g10adm.console-daily-reminder.TC-n3a` (US1-TC18) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-28` |
| `g10adm.console-daily-reminder.TC-z6w` (US1-TC19) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-35`. The scenario fails What's New; the Still Waiting row follows the requirement's step 3; the other list always has a row, so R9 stays untouched |
| `g10adm.console-daily-reminder.TC-nb8` (US1-TC20) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-24`. The sold row only; R6 asks who sees an unsold row |
| `g10adm.console-daily-reminder.TC-atu` (US1-TC21) | US-01 | Folded: `grade10-admin-console-daily-reminder-SC-24`. R10 asks what the read answers a caller with no auction grant |
| `g10adm.console-daily-reminder.TC-ivd` (US2-TC1) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-09`, `grade10-admin-console-daily-reminder-SC-11`, `grade10-admin-console-daily-reminder-SC-17` |
| `g10adm.console-daily-reminder.TC-fbu` (US2-TC2) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-12`. R1 settled: listed at 48:00 |
| `g10adm.console-daily-reminder.TC-ala` (US2-TC3) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-13`. Equal waits are R14 |
| `g10adm.console-daily-reminder.TC-eba` (US2-TC4) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-14`, `grade10-admin-console-daily-reminder-SC-30` |
| `g10adm.console-daily-reminder.TC-aah` (US2-TC5) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-14`, `grade10-admin-console-daily-reminder-SC-44`. The Refresh control is R17 |
| `g10adm.console-daily-reminder.TC-5ri` (US2-TC6) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-27` |
| `g10adm.console-daily-reminder.TC-t7x` (US2-TC7) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-12`. The 25-hour row is decisions.md:41 (Q12); no scenario names it |
| `g10adm.console-daily-reminder.TC-to3` (US2-TC8) | US-02 | Folded in part: `grade10-admin-console-daily-reminder-SC-10`. Row 2 is the scenario; rows 1 and 3, a recent setup under an old close and a paying payment after a part payment, follow the requirement's Waited since column and no scenario states them |
| `g10adm.console-daily-reminder.TC-xga` (US2-TC9) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-15` |
| `g10adm.console-daily-reminder.TC-1iy` (US2-TC10) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-18`, `grade10-admin-console-daily-reminder-SC-19`. The case does not post to Slack, which the scenario also names |
| `g10adm.console-daily-reminder.TC-kp9` (US2-TC11) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-20`, `grade10-admin-console-daily-reminder-SC-21`, `grade10-admin-console-daily-reminder-SC-22`, `grade10-admin-console-daily-reminder-SC-23` |
| `g10adm.console-daily-reminder.TC-xnm` (US2-TC12) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-21`. The same rule read at the API; R10 asks the no-grant answer |
| `g10adm.console-daily-reminder.TC-64m` (US3-TC1) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-36` |
| `g10adm.console-daily-reminder.TC-ja5` (US3-TC2) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-37`, `grade10-admin-console-daily-reminder-SC-18` |
| `g10adm.console-daily-reminder.TC-z2e` (US3-TC3) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-42`. The Approvals card sits in the Needs you grid today: R21 |
| `g10adm.console-daily-reminder.TC-ges` (US3-TC4) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-38` |
| `g10adm.console-daily-reminder.TC-0rq` (US3-TC5) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-39`. The scenario empties both lists; rows 1 and 2 empty one |
| `g10adm.console-daily-reminder.TC-mgn` (US3-TC6) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-43` |
| `g10adm.console-daily-reminder.TC-y84` (US3-TC7) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-44`. The Refresh control is R17 |
| `g10adm.console-daily-reminder.TC-tl6` (US3-TC8) | US-03 | Uncovered. No scenario states that Today lists every row; decisions.md:52 (Q23) decides it, so a scenario is owed |
| `g10adm.console-daily-reminder.TC-c2l` (US3-TC9) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-41`, `grade10-admin-console-daily-reminder-SC-17` |
| `g10adm.console-daily-reminder.TC-554` (US3-TC10) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-20`. The scenario reads Still Waiting for finance without naming the surface |
| `g10adm.console-daily-reminder.TC-gqc` (US4-TC1) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-45`. The case does not read the channel at 07:59:59 |
| `g10adm.console-daily-reminder.TC-ark` (US4-TC2) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-46`. The case opens each link; the staging-not-production half is not asserted |
| `g10adm.console-daily-reminder.TC-wlt` (US4-TC3) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-49`. The case does not pin the days: R11 |
| `g10adm.console-daily-reminder.TC-x2r` (US4-TC4) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-47` |
| `g10adm.console-daily-reminder.TC-kgn` (US4-TC5) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-51`, `grade10-admin-console-daily-reminder-SC-52` |
| `g10adm.console-daily-reminder.TC-7zn` (US4-TC6) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-52` |
| `g10adm.console-daily-reminder.TC-12f` (US4-TC7) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-50`. The case expects the first 60 characters, which decisions.md:59 (Q30) says; the scenario says "no more than 60", so R13 stays open |
| `g10adm.console-daily-reminder.TC-31k` (US4-TC8) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-45` |
| `g10adm.console-daily-reminder.TC-5hn` (US4-TC9) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-45`. What the message shows for the empty list is R12 |
| `g10adm.console-daily-reminder.TC-swg` (US4-TC10) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-59` |
| `g10adm.console-daily-reminder.TC-ne7` (US4-TC11) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-48` |
| `g10adm.console-daily-reminder.TC-g54` (US4-TC12) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-53` |
| `g10adm.console-daily-reminder.TC-ymo` (US4-TC13) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-54`, `grade10-admin-console-daily-reminder-SC-56`. How long and how many retries is R15 |
| `g10adm.console-daily-reminder.TC-e7e` (US4-TC14) | US-04 | Raised. R18: a lost reply is the window tech-design.md:127 says no design closes; no scenario states the case and the design says the opposite |
| `g10adm.console-daily-reminder.TC-rvs` (US4-TC15) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-55` |
| `g10adm.console-daily-reminder.TC-7fe` (US4-TC16) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-57` |
| `g10adm.console-daily-reminder.TC-7e7` (US4-TC17) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-60`. The case does not read the log, which the scenario does; R16 |

- **Counts** - 54 folded, 2 folded in part, 2 raised, 2 uncovered, 0 rejected. No blind case was a misreading of the anchors. A QA1 question was: R1 quoted the proposal as "more than 48 hours", and it says "48 hours or more" (`proposal.md:13`), so R1 is settled above
- **Scenarios no case reaches** - `grade10-admin-console-daily-reminder-SC-07` (a test lot listed like any other), `grade10-admin-console-daily-reminder-SC-16` (a flagged order is not listed; R7 is open on the same rule), `grade10-admin-console-daily-reminder-SC-40` (a list that fails to load says so on Today) and `grade10-admin-console-daily-reminder-SC-58` (a retry reads the lists as they stand). Each needs a case from a blind pass, or a verifier named as Out of suite; none is added here, because a case written from a scenario is not a blind reading. Their `covers` still carry them through the journey they serve
- **Scenarios reached in part** - `grade10-admin-console-daily-reminder-SC-45` (no case reads the channel at 07:59:59), `grade10-admin-console-daily-reminder-SC-46` (no case checks that a staging post links nowhere to production), `grade10-admin-console-daily-reminder-SC-19` (no case posts the order to Slack and reads it back unmarked) and `grade10-admin-console-daily-reminder-SC-02` (no case lists a close at 00:00:00 yesterday)
- **Cases no scenario states** - `g10adm.console-daily-reminder.TC-ogw` and `g10adm.console-daily-reminder.TC-tl6` (the console lists every row, decided as Q23, `decisions.md:52`), the lower edge of `g10adm.console-daily-reminder.TC-5cx`, rows 1 and 3 of `g10adm.console-daily-reminder.TC-to3`, and the 25-hour row of `g10adm.console-daily-reminder.TC-t7x` (Q12). Each is a real behaviour with a decision behind it, so the fold is a scenario for each, not a rejection
- **Contradicted** - no case and scenario state opposite things. Three pairs come closest and go to the author. First, `g10adm.console-daily-reminder.TC-ffo` step 3 expects no dialog after loading an address in the same tab with storage blocked, `grade10-admin-console-daily-reminder-SC-34` says the same of a move to another page, and `tech-design.md:95` keeps the mark in a variable that a full load clears, so a load opens it again (R4). Second, `g10adm.console-daily-reminder.TC-e7e` expects one message after a lost reply, `grade10-admin-console-daily-reminder-SC-55` is silent on that case, and `tech-design.md:127` says a second post cannot be ruled out there while `decisions.md:51` (Q22) and the page say it never posts twice (R18). Third, `g10adm.console-daily-reminder.TC-12f` expects the first 60 characters of a 61-character title, `grade10-admin-console-daily-reminder-SC-50` says no more than 60, and the design's open question is whether an ellipsis counts toward the 60 (R13)
- **Where the artifacts disagree** - the dialog's blocked-storage reload (`tech-design.md:95` against `daily-reminder.md:71` and `decisions.md:31`, Q2); the duplicate post (`tech-design.md:127` against `daily-reminder.md:102` and `decisions.md:51`); the Approvals card (`tech-design.md:96` and `tasks.md` 4.5 lift it out of the Needs you grid, `daily-reminder.md:87` and `:123` and `decisions.md:46`, Q17, say it stays below unchanged; R21); a failed list beside an empty one, which the requirement leaves closed while `daily-reminder.md:73` and `decisions.md:44` (Q15) say a failure never reads as empty (R9); the log line of `grade10-admin-console-daily-reminder-SC-60`, which `daily-reminder.md:104` and the requirement do not state (R16); and who may open an unsold listing, where the Requirements table says Reading while `auction/management.md:453` lists listing work under `auction:write` and `auction:operate` (R6). The technical design and scenarios were written after both pages and the decisions
- **Raised** - R2, R4, R6, R9, R10, R11, R12, R13, R14, R15, R16 and R17 each touch cases above and stay open in `decisions.md`; R3, R5, R7 and R8 touch no case, so their answers owe cases, `grade10-admin-console-daily-reminder-SC-16` among them for R7. The design and scenarios answer R7 (a flagged order is not listed) and R8 (a called-off listing has no close time and is not listed) with no decision row behind either. R18 to R21 are new: R18 touches `g10adm.console-daily-reminder.TC-e7e`, R21 `g10adm.console-daily-reminder.TC-z2e`, and R19 and R20 touch no case
- **Dev's questions** - 11 came with the design, and 4 are new rows. The flagged order is R7, whole days R11, a failed list beside an empty one R9 (the Retry control it asks for is in no anchor, so it waits on that answer), the empty Slack list R12, the cut title R13, whether following a row closes the dialog R5, and the not-configured log R16. The duplicate-post window is R18, link previews R19, an empty first entry then rows later R20, and the Approvals card R21
- **Uncovered anchors** - none. US-01 to US-04 each have cases (21, 12, 10 and 17), and every root group of the Feature set is walked: What's New list by US-01, Still Waiting list by US-02, Row access by `g10adm.console-daily-reminder.TC-nb8`, `g10adm.console-daily-reminder.TC-kp9` and `g10adm.console-daily-reminder.TC-554`, Daily dialog by US-01, Today columns by US-03, Slack message by US-04
- **Markers** - `covers` lists every scenario serving the case's `Trace` journey, in spec order, as `docs/governance/test-traceability.md` requires, plus the scenarios that serve a Feature set group and are reached by the case: `grade10-admin-console-daily-reminder-SC-18` and `grade10-admin-console-daily-reminder-SC-19` by `g10adm.console-daily-reminder.TC-1iy`, `grade10-admin-console-daily-reminder-SC-18` by `g10adm.console-daily-reminder.TC-ja5`, `grade10-admin-console-daily-reminder-SC-42` by `g10adm.console-daily-reminder.TC-z2e`, and `grade10-admin-console-daily-reminder-SC-53`, `grade10-admin-console-daily-reminder-SC-55`, `grade10-admin-console-daily-reminder-SC-56`, `grade10-admin-console-daily-reminder-SC-57`, `grade10-admin-console-daily-reminder-SC-59`, `grade10-admin-console-daily-reminder-SC-60` by the US-04 cases that walk each. Because `covers` follows the journey, the four scenarios above that no case reaches are still named by the markers of the journey they serve. The scenario markers were added to `spec.md` by `pnpm run trace -- init batch`, and the case markers keep the ids their headings already carried
