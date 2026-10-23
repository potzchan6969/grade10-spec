# grade10-admin/console/daily-reminder Test Cases

**Status:** pending-review · 0/94
**Drafts styled:** 2026-10-13, tcs-rules r5

**Out of suite:** grade10-admin-console-daily-reminder-SC-07 - the backend list tests of task 2.4; grade10-admin-console-daily-reminder-SC-77 - the What's New read test of task 2.1; grade10-admin-console-daily-reminder-SC-78 - the Slack job test of task 3.1; grade10-admin-console-daily-reminder-SC-79 - the console storage tests of task 4.1; grade10-admin-console-daily-reminder-SC-80 - the Today page tests of task 4.1; grade10-admin-console-daily-reminder-SC-81 - the dialog tests of task 4.1; grade10-admin-console-daily-reminder-SC-82 - the dialog tests of task 4.1; grade10-admin-console-daily-reminder-SC-83 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-84 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-85 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-86 - the Today page tests of task 5.3; grade10-admin-console-daily-reminder-SC-87 - the Slack message tests of task 5.2; grade10-admin-console-daily-reminder-SC-97 - the close-path Slack failure tests of task 2.1; grade10-admin-console-daily-reminder-SC-98 - the lifecycle not-configured tests of task 2.1 (both token and channel required)

## Walk 1: Flagged or still waiting in the dialog and on Today

**Starting state:**

- admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
- `<order_flag_fresh>` has an open payment flag raised 2 hours ago and is not past 48 hours in a waiting status.
- `<order_wait>` has waited 49 hours in Preparing Invoice with no open flag.
- `<order_overdue>` is Setup Overdue with no open flag.
- `<order_flag_and_wait>` has an open payment flag and has also waited 49 hours in Preparing Invoice.

**Shared test data:**

| Field | Value |
| --- | --- |
| order_flag_fresh | Order with one open payment flag, raised 2 hours ago, flag reason `<flag_reason>` |
| order_wait | Unflagged Preparing Invoice order waited 49 hours |
| order_overdue | Setup Overdue order with no open flag |
| order_flag_and_wait | Flagged Preparing Invoice order waited 49 hours; earliest open flag 3 hours ago |
| flag_reason | Overpaid (any open payment flag reason the product shows) |

### Route

1. Navigate to <grade10 admin console url> and read Flagged or still waiting in the dialog.
   - Flagged rows lead, then the 48-hour wait. `g10adm.console-daily-reminder.US2-TC17`
   - A flagged-and-waiting order is one flagged row only. `g10adm.console-daily-reminder.US2-TC18`
   - Setup Overdue alone is absent. `g10adm.console-daily-reminder.US2-TC19`
   - The list heading carries a warning mark. `g10adm.console-daily-reminder.US2-TC20`
   - A fresh flag appears the same day with its reason. `g10adm.console-daily-reminder.US5-TC1`
2. Close the dialog and open <grade10 admin today url>.
   - The waiting column is Flagged or still waiting with a warning mark and the caption Something wrong or waiting a while, needing your action. `g10adm.console-daily-reminder.US3-TC15`
   - Empty waiting copy reads Nothing flagged or waiting too long. when no row remains after clearing fixtures. `g10adm.console-daily-reminder.US3-TC16`

## Walk 2: Auction lifecycle Slack beside the daily morning list

**Starting state:**

- Slack is configured for Auction with the daily reminder channel and token.
- `<listing_live>` is published and reaches its scheduled start with bidding open.
- `<listing_ext>` is live and soft-close extends its end once.
- `<listing_end>` reaches its end time after any extension.
- `<order_od>` becomes Payment Overdue.
- `<order_fg>` receives an open payment flag with reason `<flag_reason>`.
- Morning fixtures include at least one What's New row and one Flagged or still waiting row.

**Shared test data:**

| Field | Value |
| --- | --- |
| listing_live | Published listing whose scheduled start is reached |
| listing_ext | Live listing soft-closed once; extension shown as whole minutes rounded down |
| listing_end | Listing that ends at its (possibly extended) end time |
| order_od | Order that transitions into Payment Overdue |
| order_fg | Order that receives an open payment flag |
| flag_reason | Overpaid |
| slack channel | Auction daily reminder channel for the environment |

### Route

1. At 08:00 Hong Kong time, read `<slack channel>` for the daily message.
   - The waiting list heading is Something wrong or waiting a while, needing your action, with a warning mark, and flagged rows lead. `g10adm.console-daily-reminder.US4-TC22`
2. Drive `<listing_live>` through go-live, then soft-close `<listing_ext>`, then end `<listing_end>`, reading the channel after each move.
   - One go-live message with start time and a console link. `g10adm.console-daily-reminder.US6-TC1`
   - One extension message with how long and the new end time. `g10adm.console-daily-reminder.US6-TC2`
   - One ended message with the end time. `g10adm.console-daily-reminder.US6-TC3`
3. Drive `<order_od>` into Payment Overdue and flag `<order_fg>`, reading the channel after each transition.
   - One overdue warning with the overdue status. `g10adm.console-daily-reminder.US7-TC1`
   - One flagged warning with the flag reason. `g10adm.console-daily-reminder.US7-TC2`
4. Leave `<order_od>` overdue and `<order_fg>` flagged without clearing, and wait past a further read window.
   - No second overdue or flagged message. `g10adm.console-daily-reminder.US7-TC3`

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
* Flagged or still waiting lists a row for `<order_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-rz8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-rz8 (US1-TC2): A sold listing is one row that opens its winner order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
* The dialog shows Flagged or still waiting with the row for `<order_2>`.
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
| failing_list (row 2) | Flagged or still waiting |

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
* Step 5 opens the dialog, listing `<order_2>` in Flagged or still waiting.

<!-- trace:case id=g10adm.console-daily-reminder.TC-r1t rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.TC-r1t (US1-TC28): A deep link while signed out opens the dialog after sign-in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
| failed_lists, other (row 1) | What's New; Flagged or still waiting has no row for the operator |
| failed_lists, other (row 2) | Flagged or still waiting; What's New has no row for the operator |
| failed_lists, other (row 3) | What's New and Flagged or still waiting; no other list |

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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* The read for Flagged or still waiting is made to fail once and then succeed.
* `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Click the Retry beside Flagged or still waiting.

**Expected Results:**

* Step 1 shows Flagged or still waiting as failed to load, with a Retry.
* Step 2 shows the row for `<order_2>` in Flagged or still waiting.
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

---

## grade10-admin-console-daily-reminder-US2: Operator is reminded of flagged orders and orders still waiting on them

**As an** operator with payment or shipment processing,
**I want** flagged orders at the top of Flagged or still waiting, then the orders that have waited 48 hours for me to send an invoice, check a proof or dispatch, listed every day until I act,
**so that** a flag or a forgotten job is not lost behind newer work.

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
2. Find the row for `<order_w>` in Flagged or still waiting.
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
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_w>` in Preparing Invoice has waited exactly 48 hours at the moment the dialog reads.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<order_w>` in Flagged or still waiting.

**Expected Results:**

* Flagged or still waiting holds a row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ala rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-ala (US2-TC3): Flagged or still waiting lists the longest wait first

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_a>` has waited 50 hours, `<order_b>` 120 hours and `<order_c>` 75 hours, in the three listed statuses.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the order of rows in Flagged or still waiting.

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

* Step 1 lists `<order_w>` in Flagged or still waiting.
* Step 4 opens the dialog again, listing `<order_w>` with a longer wait.

<!-- trace:case id=g10adm.console-daily-reminder.TC-aah rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-aah (US2-TC5): An order that moves on leaves Flagged or still waiting

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_w>` has waited 49 hours in Preparing Invoice and is listed in Flagged or still waiting.

**Steps:**

1. Open the page of `<order_w>` from its row.
2. Send its invoice.
3. Navigate to <grade10 admin today url>.
4. Refresh the lists.

**Expected Results:**

* Step 4 shows Flagged or still waiting with no row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-5ri rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-5ri (US2-TC6): An operator with no Flagged or still waiting row sees no such list in the dialog

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
* The dialog shows no Flagged or still waiting list.

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
2. Read Flagged or still waiting.

**Expected Results:**

* Flagged or still waiting holds no row for `<order_w>`.

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
2. Read Flagged or still waiting.

**Expected Results:**

* Flagged or still waiting holds no row for `<order_w>`.

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
2. Read Flagged or still waiting.

**Expected Results:**

* Flagged or still waiting holds no row for `<order_w>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-1iy rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-6zm,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-1iy (US2-TC10): Flagged or still waiting marks no status, worklist row or order page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_w>` has waited 100 hours in Preparing Invoice and is listed in Flagged or still waiting.
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
3. Read Flagged or still waiting.

**Expected Results:**

* Flagged or still waiting holds `<rows>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-n4g rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.TC-n4g (US2-TC14): The console shows the exact wait, not whole days

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_a>` has waited 49 hours and `<order_b>` has waited 70 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the waits of `<order_a>` and `<order_b>` in Flagged or still waiting.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_x>` and `<order_y>` are in Preparing Invoice with their wait begun at the same moment, 60 hours before the read; `<code_x>` comes before `<code_y>` in A to Z order.
* `<order_z>` has waited 80 hours.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the order of rows in Flagged or still waiting.

**Expected Results:**

* The rows read `<order_z>`, `<order_x>`, `<order_y>` from top to bottom.

<!-- trace:case id=g10adm.console-daily-reminder.TC-tbl rev=1 covers=g10adm.console-daily-reminder.SC-a99 -->
### g10adm.console-daily-reminder.US2-TC17: Flagged rows lead above 48-hour waits

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/console/daily-reminder.spec.ts`

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_flag_fresh>` has an open payment flag raised 2 hours ago and is not past 48 hours in a waiting status.
* `<order_wait>` has waited 49 hours in Preparing Invoice with no open flag.

**Test data:**

| Field | Value |
| --- | --- |
| order_flag_fresh | Flagged order, open flag 2 hours old, under 48-hour wait |
| order_wait | Unflagged Preparing Invoice order waited 49 hours |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the order of rows in Flagged or still waiting.

**Expected Results:**

* The first row is `<order_flag_fresh>`.
* `<order_wait>` sits under every flagged row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-rwq rev=1 -->
### g10adm.console-daily-reminder.US2-TC18: A flagged order past 48 hours is one flagged row only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/console/daily-reminder.spec.ts`

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_flag_and_wait>` has an open payment flag and has waited 49 hours in Preparing Invoice.

**Test data:**

| Field | Value |
| --- | --- |
| order_flag_and_wait | Flagged Preparing Invoice order waited 49 hours |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Count the rows for `<order_flag_and_wait>` in Flagged or still waiting.

**Expected Results:**

* Exactly one row names `<order_flag_and_wait>`.
* That row is among the flagged rows at the top, not among the wait rows below.

<!-- trace:case id=g10adm.console-daily-reminder.TC-urs rev=1 covers=g10adm.console-daily-reminder.SC-b00 -->
### g10adm.console-daily-reminder.US2-TC19: Setup Overdue and Payment Overdue alone are not listed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/console/daily-reminder.spec.ts`

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* `<order_overdue>` is in `<status>` with no open payment flag.

**Test data:**

| Field | Value |
| --- | --- |
| status (row 1) | Setup Overdue |
| status (row 2) | Payment Overdue |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read Flagged or still waiting for `<order_overdue>`.

**Expected Results:**

* Flagged or still waiting holds no row for `<order_overdue>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7xu rev=2 covers=g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC20: The dialog waiting list title carries a warning mark

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/console/daily-reminder.spec.ts`

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) has not closed the daily dialog today in this browser.
* A What's New row and a Flagged or still waiting row exist for the operator.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read both lists and the Flagged or still waiting heading in the dialog.

**Expected Results:**

* The dialog holds What's New and Flagged or still waiting, in that order, each with its rows.
* The Flagged or still waiting heading reads Flagged or still waiting.
* A warning mark stands beside that heading.

<!-- trace:case id=g10adm.console-daily-reminder.TC-j8o rev=2 covers=none -->
### g10adm.console-daily-reminder.TC-j8o (US2-TC13): A flagged order is listed by its own wait, not by its flag

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* None.

**Steps:**

1. None. Superseded by flagged-at-top any-age cases under US2 and US5.

**Expected Results:**

* Deprecated. The change lists every open payment flag at the top at any age, with the flag reason and wait from the earliest open flag, and never as a separate wait row.

---

## grade10-admin-console-daily-reminder-US3: Operator finds the reminder again on Today

**As an** operator who closed the daily dialog,
**I want** What's New and Flagged or still waiting on Today, beside what needs me, with a warning mark on the waiting column,
**so that** I can come back to them later in the day without the dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-64m rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-64m (US3-TC1): Today shows What's New, Flagged or still waiting and Needs you side by side

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
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

* The page shows three columns: What's New, Flagged or still waiting, Needs you.
* What's New holds the row for `<listing_1>`.
* Flagged or still waiting holds the row for `<order_2>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ja5 rev=1 covers=g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-ja5 (US3-TC2): Needs you keeps its cards in one column with counts and links unchanged

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<order_2>` has waited 49 hours in Preparing Invoice, so Flagged or still waiting has a row.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<listing_1>` closed yesterday and `<order_2>` has waited 49 hours in Preparing Invoice.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read the grouping of rows in What's New and in Flagged or still waiting.

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
| empty_lists (row 2) | Flagged or still waiting only |
| empty_lists (row 3) | What's New and Flagged or still waiting |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url> in a narrow window.

**Steps:**

1. Read the order of the three lists from top to bottom.

**Expected Results:**

* The lists stack in one column: What's New, Flagged or still waiting, Needs you.

<!-- trace:case id=g10adm.console-daily-reminder.TC-y84 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-y84 (US3-TC7): Today reads the lists on load, tab return and Refresh, never on a timer

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
* Flagged or still waiting holds 12 rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-c2l rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-c2l (US3-TC9): A row on Today opens its order or listing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* `<listing_1>` is sold, `<listing_2>` is unsold, and `<order_2>` waited 49 hours.

**Steps:**

1. Click the What's New row for `<listing_1>`, then go back.
2. Click the What's New row for `<listing_2>`, then go back.
3. Click the Flagged or still waiting row for `<order_2>`.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_i>` waited 49 hours in Preparing Invoice and `<order_s>` in Preparing Shipment.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read Flagged or still waiting.

**Expected Results:**

* Flagged or still waiting holds the row for `<order_i>`.
* Flagged or still waiting holds no row for `<order_s>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-p3h rev=1 covers=g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.TC-p3h (US3-TC11): Refresh reads all three columns again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url> with the lists loaded.
* `<order_1>` is the winner order of a listing sold yesterday, in Preparing Invoice, with a row in What's New.
* `<order_w>` has waited 49 hours in Preparing Invoice and has a row in Flagged or still waiting.

**Steps:**

1. Read the What's New row of `<order_1>`, the Flagged or still waiting row of `<order_w>` and the Orders count in Needs you.
2. In another browser, send the invoice of `<order_1>` and of `<order_w>`.
3. Click Refresh.

**Expected Results:**

* Step 3 shows the What's New row of `<order_1>` with its new status.
* Step 3 shows no row for `<order_w>` in Flagged or still waiting.
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
| failing_list (row 2) | Flagged or still waiting |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds no auction grant) is on <grade10 admin today url>.
* Listings closed yesterday and orders have waited 49 hours.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read What's New and Flagged or still waiting.

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

<!-- trace:case id=g10adm.console-daily-reminder.TC-orm rev=2 covers=g10adm.console-daily-reminder.SC-v91 -->
### g10adm.console-daily-reminder.US3-TC15: Today names Flagged or still waiting with warning mark and caption

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/console/daily-reminder.spec.ts`

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) closed the daily dialog today.
* At least one What's New row and one Flagged or still waiting row exist for the operator.

**Steps:**

1. Navigate to <grade10 admin today url>.
2. Read the three columns from left to right, and the middle column's title and caption.

**Expected Results:**

* What's New, Flagged or still waiting and Needs you stand side by side, in that order.
* The Flagged or still waiting title carries a warning mark beside it.
* The caption reads Something wrong or waiting a while, needing your action.
* The first two columns hold the rows the dialog held.

<!-- trace:case id=g10adm.console-daily-reminder.TC-oyo rev=2 covers=g10adm.console-daily-reminder.SC-pck -->
### g10adm.console-daily-reminder.US3-TC16: An empty Flagged or still waiting column says Nothing flagged or waiting too long

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* admin(holds auction:read, auction:write, auction:operate, auction:payment and auction:shipment) is on <grade10 admin today url>.
* The operator has no row in What's New and no Flagged or still waiting row.

**Steps:**

1. Read all three columns.

**Expected Results:**

* All three columns show.
* What's New says No listing closed yesterday.
* Flagged or still waiting says Nothing flagged or waiting too long.

---

## grade10-admin-console-daily-reminder-US4: Operator reads the day's lists in Slack

**As an** auction operator who works from Slack,
**I want** the day's new listings and Flagged or still waiting posted to our channel each morning, headed Something wrong or waiting a while, needing your action, with a warning mark, every row a link,
**so that** the team sees what is wrong or waiting, and opens it, without first opening the console.

<!-- trace:case id=g10adm.console-daily-reminder.TC-gqc rev=1 covers=g10adm.console-daily-reminder.SC-kf7,g10adm.console-daily-reminder.SC-99q,g10adm.console-daily-reminder.SC-oce,g10adm.console-daily-reminder.SC-alf,g10adm.console-daily-reminder.SC-4d8,g10adm.console-daily-reminder.SC-oap,g10adm.console-daily-reminder.SC-odp,g10adm.console-daily-reminder.SC-oxw,g10adm.console-daily-reminder.SC-nyt,g10adm.console-daily-reminder.SC-g63,g10adm.console-daily-reminder.SC-9ws,g10adm.console-daily-reminder.SC-s95 -->
### g10adm.console-daily-reminder.TC-gqc (US4-TC1): Both lists post as one message at 08:00 Hong Kong time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
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
* The message holds a What's New list and a Flagged or still waiting list.
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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* `<order_i>` waited 49 hours in Preparing Invoice and `<order_s>` in Preparing Shipment.
* admin(holds auction:read only) sees neither row in the console.
* Today's message is posted.

**Steps:**

1. Read the Flagged or still waiting list in the message.

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

1. Count the rows in Flagged or still waiting in the message.
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

* Flagged or still waiting shows 10 rows without `<order_last>` and a link to Today saying 1 more.
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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured.
* `<rows_in>` has a row; `<rows_out>` has none.

**Test data:**

| Field | Value |
| --- | --- |
| rows_in, rows_out (row 1) | What's New, Flagged or still waiting |
| rows_in, rows_out (row 2) | Flagged or still waiting, What's New |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Eleven orders are in Preparing Invoice with their wait begun at the same moment; their listing codes are `<codes>`.
* Today's message is posted.

**Steps:**

1. Read the codes of the rows in Flagged or still waiting.
2. Read the end of the list.

**Expected Results:**

* The 10 rows hold the first 10 listing codes of `<codes>` in A to Z order.
* The last code in A to Z order is not a row.
* The end of the list shows a link to Today saying 1 more.

<!-- trace:case id=g10adm.console-daily-reminder.TC-kl7 rev=1 covers=g10adm.console-daily-reminder.SC-b02 -->
### g10adm.console-daily-reminder.US4-TC22: Daily Slack waiting list uses the warning heading and leads with flagged rows

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-04

**Pre-conditions:**

* Slack is configured for the environment with a channel and token.
* `<order_flag_fresh>` has an open payment flag raised 2 hours ago.
* `<order_wait>` has waited 49 hours in Preparing Invoice with no open flag.
* At least one What's New row exists so the daily message posts.

**Test data:**

| Field | Value |
| --- | --- |
| order_flag_fresh | Flagged order, open flag 2 hours old |
| order_wait | Unflagged Preparing Invoice order waited 49 hours |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Wait until 08:00 Hong Kong time.
2. Read the channel `<slack channel>`.
3. Read the Flagged or still waiting section of the daily message.

**Expected Results:**

* The section heading reads Something wrong or waiting a while, needing your action.
* A warning mark stands beside that heading.
* The flagged row for `<order_flag_fresh>` sits above the wait row for `<order_wait>`.

---

## grade10-admin-console-daily-reminder-US5: Operator sees a flagged order on the waiting list the same day

**As an** operator with payment processing,
**I want** every order with an open payment flag listed at the top of Flagged or still waiting, with the flag reason, until the flag is cleared,
**so that** a fresh flag is not hidden behind the 48-hour wait.

<!-- trace:case id=g10adm.console-daily-reminder.TC-jt5 rev=1 covers=g10adm.console-daily-reminder.SC-x5d -->
### g10adm.console-daily-reminder.US5-TC1: A fresh flag appears at the top with its reason the same day

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/console/daily-reminder.spec.ts`

**Pre-conditions:**

* admin(holds auction:read and auction:payment) has not closed the daily dialog today in this browser.
* `<order_flag_fresh>` received an open payment flag with reason `<flag_reason>` 2 hours ago and is under 48 hours in every waiting status.

**Test data:**

| Field | Value |
| --- | --- |
| order_flag_fresh | Order flagged 2 hours ago, any status, under 48-hour wait |
| flag_reason | Overpaid |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<order_flag_fresh>` in Flagged or still waiting.
3. Click the row.

**Expected Results:**

* The row sits among the flagged rows at the top.
* The row shows `<flag_reason>` and a wait from the earliest open flag.
* Step 3 opens the page of `<order_flag_fresh>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-lp9 rev=1 -->
### g10adm.console-daily-reminder.US5-TC2: Clearing every flag removes the flagged row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_flag_fresh>` has one open payment flag and is listed at the top of Flagged or still waiting.
* `<order_flag_fresh>` is not past 48 hours in a waiting status.

**Test data:**

| Field | Value |
| --- | --- |
| order_flag_fresh | Flagged order under 48-hour wait |

**Steps:**

1. Open the page of `<order_flag_fresh>` from its row.
2. Clear every open payment flag.
3. Navigate to <grade10 admin today url>.
4. Refresh the lists.

**Expected Results:**

* Step 4 shows Flagged or still waiting with no flagged row for `<order_flag_fresh>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-qof rev=2 covers=g10adm.console-daily-reminder.SC-x4b -->
### g10adm.console-daily-reminder.US5-TC3: Flagged wait and reason read from the earliest open flag

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* admin(holds auction:read and auction:payment) has not closed the daily dialog today in this browser.
* `<order_multi_flag>` has two open payment flags: the earlier raised 30 hours ago with reason `<earliest_reason>` and the later raised 2 hours ago with reason `<later_reason>`.

**Test data:**

| Field | Value |
| --- | --- |
| order_multi_flag | Order with two open flags, earliest 30 hours ago |
| earliest_reason | Underpaid |
| later_reason | Overpaid |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Read the flagged row for `<order_multi_flag>`.

**Expected Results:**

* The row shows `<earliest_reason>`, not `<later_reason>`.
* The wait matches the earlier flag, about 30 hours, not the later 2-hour flag.

<!-- trace:case id=g10adm.console-daily-reminder.TC-sa7 rev=1 covers=g10adm.console-daily-reminder.SC-b01 -->
### g10adm.console-daily-reminder.US5-TC4: An overdue order that is also flagged sits under Flagged

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* admin(holds auction:read and auction:payment) has not closed the daily dialog today in this browser.
* `<order_od_flag>` is Payment Overdue and has an open payment flag with reason `<flag_reason>`.

**Test data:**

| Field | Value |
| --- | --- |
| order_od_flag | Payment Overdue order with an open payment flag |
| flag_reason | Overpaid |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Find the row for `<order_od_flag>` in Flagged or still waiting.

**Expected Results:**

* One flagged row names `<order_od_flag>` with `<flag_reason>`.
* The row sits among the flagged rows at the top.

<!-- trace:case id=g10adm.console-daily-reminder.TC-31b rev=1 covers=g10adm.console-daily-reminder.SC-uoi -->
### g10adm.console-daily-reminder.US5-TC5: Clearing every flag leaves a past-48-hour wait row at once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* admin(holds auction:read and auction:payment) is on <grade10 admin today url>.
* `<order_flag_and_wait>` has an open payment flag and has waited 49 hours in Preparing Invoice, listed as one flagged row.

**Test data:**

| Field | Value |
| --- | --- |
| order_flag_and_wait | Flagged Preparing Invoice order waited 49 hours |

**Steps:**

1. Open the page of `<order_flag_and_wait>` from its row.
2. Clear every open payment flag.
3. Navigate to <grade10 admin today url>.
4. Refresh the lists.

**Expected Results:**

* Step 4 shows one Send invoice wait row for `<order_flag_and_wait>` under Flagged or still waiting.
* It shows no flagged row for `<order_flag_and_wait>`.

---

## grade10-admin-console-daily-reminder-US6: Operator learns in Slack when a listing goes live, ends or is extended

**As an** auction operator who works from Slack,
**I want** one message in our Auction channel when a listing goes live, when it ends, and when it is extended, each with the times that matter,
**so that** the team can follow a live sale without watching the console.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7nw rev=2 covers=g10adm.console-daily-reminder.SC-a88 -->
### g10adm.console-daily-reminder.US6-TC1: A listing going live posts once with its start time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<listing_live>` opens bidding by `<open_path>`.

**Test data:**

| Field | Value |
| --- | --- |
| open_path (row 1) | Published listing reaches its scheduled start with bidding open |
| open_path (row 2) | Publish opens bidding because the scheduled start is already due |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Drive `<listing_live>` through `<open_path>` so bidding is open.
2. Read the channel `<slack channel>`.
3. Click the listing link in the go-live message.

**Expected Results:**

* One message names `<listing_live>` with its start time.
* Step 3 opens the listing in the console.
* The message shows no winner name, email or phone.

<!-- trace:case id=g10adm.console-daily-reminder.TC-5pk rev=2 covers=g10adm.console-daily-reminder.SC-a90 -->
### g10adm.console-daily-reminder.US6-TC2: Each soft-close extension posts once with length and new end time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-06

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<listing_ext>` is live.
* Soft-close will move its end by `<extension_seconds>` seconds to `<new_end_time>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_ext | Live listing about to soft-close |
| extension_seconds | 1800 |
| extension_minutes_copy | 30 minutes |
| new_end_time | The end time after this extension |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Drive the soft-close that extends `<listing_ext>` by `<extension_seconds>` seconds.
2. Read the channel `<slack channel>`.

**Expected Results:**

* One message names `<listing_ext>`, `<extension_minutes_copy>` (whole minutes rounded down from `<extension_seconds>`) and `<new_end_time>`.
* A second read before another extension shows no further extension message for that move.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7cj rev=1 covers=g10adm.console-daily-reminder.SC-a89 -->
### g10adm.console-daily-reminder.US6-TC3: A listing ending posts once with its end time including extensions

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<listing_end>` reaches its end time `<end_time>`, including any prior extension.

**Test data:**

| Field | Value |
| --- | --- |
| listing_end | Listing ending at its final end time |
| end_time | Final end time including any extension |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Wait until `<listing_end>` ends.
2. Read the channel `<slack channel>`.

**Expected Results:**

* One message names `<listing_end>` with `<end_time>`.
* Staying ended produces no further ended message.

<!-- trace:case id=g10adm.console-daily-reminder.TC-fka rev=1 covers=g10adm.console-daily-reminder.SC-a91 -->
### g10adm.console-daily-reminder.US6-TC4: Lifecycle listing posts use the daily reminder channel and never name a customer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Slack is configured for Auction with one daily reminder channel and token.
* A go-live, extension or ended lifecycle message for `<listing_any>` has just posted.

**Test data:**

| Field | Value |
| --- | --- |
| listing_any | Any listing that just posted a lifecycle message |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Read the channel `<slack channel>` for the lifecycle message.
2. Compare it with the channel that received today's daily reminder.

**Expected Results:**

* The lifecycle message is in the same channel as the daily reminder.
* The message shows no winner name, email or phone.

<!-- trace:case id=g10adm.console-daily-reminder.TC-mhl rev=2 covers=g10adm.console-daily-reminder.SC-a96 -->
### g10adm.console-daily-reminder.US6-TC5: A failed extension alert is logged once and does not refuse the bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-06

**Pre-conditions:**

* Auction Slack posting is forced to fail for the next lifecycle send.
* `<listing_ext>` is live and a bid will earn soft-close.

**Test data:**

| Field | Value |
| --- | --- |
| listing_ext | Live listing about to soft-close |

**Steps:**

1. Place the bid that extends `<listing_ext>`.
2. Confirm the bid stands and the end time has moved in the console.
3. Read the operator logs for the failed Slack send.

**Expected Results:**

* The bid stands and the end time has moved before any Slack send starts.
* The failure is logged naming the extension kind.
* No retry posts the missed extension message later.

---

## grade10-admin-console-daily-reminder-US7: Operator is warned in Slack when an order becomes overdue or is flagged

**As an** auction operator who works from Slack,
**I want** one warning message when an order becomes Setup Overdue or Payment Overdue, and when it is flagged with its reason,
**so that** money waiting on someone is noticed as soon as it happens.

<!-- trace:case id=g10adm.console-daily-reminder.TC-kf5 rev=1 covers=g10adm.console-daily-reminder.SC-a92,g10adm.console-daily-reminder.SC-a93,g10adm.console-daily-reminder.SC-a95 -->
### g10adm.console-daily-reminder.US7-TC1: Becoming Setup Overdue or Payment Overdue posts one warning

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<order_od>` is about to become `<status>`.

**Test data:**

| Field | Value |
| --- | --- |
| status (row 1) | Setup Overdue |
| status (row 2) | Payment Overdue |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Drive `<order_od>` into `<status>`.
2. Read the channel `<slack channel>`.
3. Click the order link in the warning message.

**Expected Results:**

* One warning message names `<order_od>` and `<status>`.
* A warning mark stands on the message.
* Step 3 opens the order in the console.
* The message shows no winner name, email or phone.

<!-- trace:case id=g10adm.console-daily-reminder.TC-swi rev=1 covers=g10adm.console-daily-reminder.SC-a94 -->
### g10adm.console-daily-reminder.US7-TC2: Flagging an order posts one warning with the flag reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<order_fg>` is about to receive an open payment flag with reason `<flag_reason>`.

**Test data:**

| Field | Value |
| --- | --- |
| order_fg | Order receiving an open payment flag |
| flag_reason | Overpaid |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Raise the open payment flag on `<order_fg>` with `<flag_reason>`.
2. Read the channel `<slack channel>`.

**Expected Results:**

* One warning message names `<order_fg>` and `<flag_reason>`.
* A warning mark stands on the message.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7k4 rev=1 -->
### g10adm.console-daily-reminder.US7-TC3: Staying overdue or flagged does not post again

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
* **Trace:** grade10-admin-console-daily-reminder-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<order_stay>` has already produced its one `<kind>` lifecycle warning and remains in that state.

**Test data:**

| Field | Value |
| --- | --- |
| kind (row 1) | Payment Overdue |
| kind (row 2) | open payment flag |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Note the lifecycle warning already in `<slack channel>` for `<order_stay>`.
2. Wait through a further interval while `<order_stay>` stays in that state.
3. Read the channel `<slack channel>` again.

**Expected Results:**

* No second `<kind>` warning posts for `<order_stay>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-9a8 rev=1 -->
### g10adm.console-daily-reminder.US7-TC4: A failed overdue or flag post is logged once and does not refuse the order move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lifecycle-alerts.spec.ts`

**Pre-conditions:**

* Auction Slack posting is forced to fail for the next lifecycle send.
* `<order_od>` is about to become Payment Overdue.

**Test data:**

| Field | Value |
| --- | --- |
| order_od | Order about to become Payment Overdue |

**Steps:**

1. Drive `<order_od>` into Payment Overdue.
2. Confirm the order shows Payment Overdue in the console.
3. Read the operator logs for the failed Slack send.

**Expected Results:**

* The order is Payment Overdue.
* The failure is logged.
* No retry posts the missed overdue warning later.

<!-- trace:case id=g10adm.console-daily-reminder.TC-8w7 rev=1 covers=g10adm.console-daily-reminder.SC-a94 -->
### g10adm.console-daily-reminder.US7-TC5: Clearing every flag then raising a new one posts again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-daily-reminder-US-07

**Pre-conditions:**

* Slack is configured for Auction with the daily reminder channel and token.
* `<order_fg>` already produced one flagged lifecycle warning for an open payment flag that has since been cleared.

**Test data:**

| Field | Value |
| --- | --- |
| order_fg | Order whose prior flag was cleared |
| flag_reason | Overpaid |
| slack channel | Auction daily reminder channel for the environment |

**Steps:**

1. Raise a new open payment flag on `<order_fg>` with `<flag_reason>`.
2. Read the channel `<slack channel>`.

**Expected Results:**

* One new warning message names `<order_fg>` and `<flag_reason>`.
* A warning mark stands on the message.

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
- **Long lists** - Today opens the first product with rows and folds the others to one line, one open at a time, the opened one filling its column; the dialog shows about four and a half rows of each and scrolls the rest inside the list, fading the edge with more (Q49, Q50)
- **Flagged orders** - superseded by this change: every open payment flag, any age, one flagged row at the top with the flag reason and wait from the earliest open flag; never also a wait row; Setup Overdue and Payment Overdue alone stay off the list (Q1, Q3, Q9); after every flag is cleared a past-48-hour wait returns at once as a wait row (Q12); several open flags show the earliest reason (Q11)
- **Auction Slack env gate** - morning post and lifecycle alerts share one gate: send only when both bot token and channel are non-empty; missing or empty either skips the send, logs not configured, and leaves the 08:00 run and every other usual path untouched (Q15)
- **Lifecycle Slack** - go-live once when bidding opens, including publish with start already due (Q14); extension length in whole minutes rounded down (Q16); re-flag after a clear posts again (Q13); posts only as a last best-effort step after the usual work (Q10)

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

**Run:** QA2 reconciliation, 2026-10-12, in a fresh context. Joined the 80 blind cases and the delta's 81 scenarios (85 after the amendment for Q49 to Q51) on the four journeys and the six root groups of the Feature set. Read the cases above, `spec.md` whole, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q48 and `## Raised`), `tech-design.md`, `tasks.md`, the two PRD pages and the earlier reconciliation in git (commit 187eded6) for the settled answers. The application repository was not read; what `tech-design.md` says of it is taken as stated. Every case stays `draft`, and no scenario, requirement, design, task or page line moved. The two rows this run raised have landed as Q46 and Q47; the later fold and scroll landed as Q48. Refreshed after the acceptance review: SC-07 left the `covers` markers, as the other out-of-suite scenarios are, and SC-82's walk is task 6.1.

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
- **Scenarios no case reaches** - `grade10-admin-console-daily-reminder-SC-07` (a test lot is listed like any other, Q27) and the scenarios added after the blind pass for Q42, Q44, Q45 and Q47: SC-77, SC-78, SC-79, SC-80 and SC-81, and SC-82 and SC-83 for Q48, and SC-84, SC-85 and SC-86 for Q49 and Q50 and SC-87 for Q51, added with the amendment after the first look. No case was written from them: a case written from a scenario is not a blind reading. Each is listed under Out of suite with the automated test that verifies it; `/tcs-review` is asked whether to write a case for each
- **Scenarios reached in part** - `grade10-admin-console-daily-reminder-SC-19` (no case posts the order to Slack and reads it back unmarked), `grade10-admin-console-daily-reminder-SC-45` (no case reads the channel at 07:59:59), `grade10-admin-console-daily-reminder-SC-46` (no case checks that a staging post links nowhere to production) and `grade10-admin-console-daily-reminder-SC-72` (no case leaves the tab and comes back with the dialog open)
- **Cases no scenario states** - `g10adm.console-daily-reminder.TC-ogw` and `g10adm.console-daily-reminder.TC-tl6` (the console lists every row, Q23, `decisions.md:52`), the lower edge of `g10adm.console-daily-reminder.TC-5cx`, the tab return and page move of `g10adm.console-daily-reminder.TC-c8j` with no dialog open, rows 1 and 3 of `g10adm.console-daily-reminder.TC-to3`, the 25-hour row of `g10adm.console-daily-reminder.TC-t7x` (Q12), rows 1 and 3 of `g10adm.console-daily-reminder.TC-f6y`, the Today columns of an operator who cannot open Auction in `g10adm.console-daily-reminder.TC-a7l`, and the Slack cut on equal waits of `g10adm.console-daily-reminder.TC-o8u`. Each is a real behaviour with a decision or a requirement sentence behind it, so the fold is a scenario for each, not a rejection
- **Decisions and page lines no scenario states** - none. Q23, Q42, Q44, Q45 and Q47 are stated by SC-76 to SC-81 and Q46 by SC-16; Q38 has no scenario by design: it accepts a repeat post and asserts nothing
- **Q31 to Q48 against the scenarios** - Q31 `grade10-admin-console-daily-reminder-SC-16`, `grade10-admin-console-daily-reminder-SC-63`; Q32 `grade10-admin-console-daily-reminder-SC-25`, `grade10-admin-console-daily-reminder-SC-66`, `grade10-admin-console-daily-reminder-SC-67` and, for tab return and page moves, `grade10-admin-console-daily-reminder-SC-34`, `grade10-admin-console-daily-reminder-SC-72` in part; Q33 `grade10-admin-console-daily-reminder-SC-29`, `grade10-admin-console-daily-reminder-SC-32`, `grade10-admin-console-daily-reminder-SC-68`, `grade10-admin-console-daily-reminder-SC-69`, `grade10-admin-console-daily-reminder-SC-70`; Q34 `grade10-admin-console-daily-reminder-SC-61`, `grade10-admin-console-daily-reminder-SC-62`, `grade10-admin-console-daily-reminder-SC-23`, `grade10-admin-console-daily-reminder-SC-04`; Q35 `grade10-admin-console-daily-reminder-SC-35`, `grade10-admin-console-daily-reminder-SC-40`, `grade10-admin-console-daily-reminder-SC-65`, `grade10-admin-console-daily-reminder-SC-71`, `grade10-admin-console-daily-reminder-SC-24`; Q36 `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-11`, `grade10-admin-console-daily-reminder-SC-13`, `grade10-admin-console-daily-reminder-SC-49`, `grade10-admin-console-daily-reminder-SC-64`, `grade10-admin-console-daily-reminder-SC-73`; Q37 `grade10-admin-console-daily-reminder-SC-50`, `grade10-admin-console-daily-reminder-SC-60`, `grade10-admin-console-daily-reminder-SC-74`, `grade10-admin-console-daily-reminder-SC-75`; Q38 none; Q39 `grade10-admin-console-daily-reminder-SC-44`, `grade10-admin-console-daily-reminder-SC-72`; Q40 `grade10-admin-console-daily-reminder-SC-67`; Q41 `grade10-admin-console-daily-reminder-SC-37`, `grade10-admin-console-daily-reminder-SC-42`; Q42 `grade10-admin-console-daily-reminder-SC-77`, `grade10-admin-console-daily-reminder-SC-78`; Q43 `grade10-admin-console-daily-reminder-SC-08`, `grade10-admin-console-daily-reminder-SC-11`; Q44 `grade10-admin-console-daily-reminder-SC-79`; Q45 `grade10-admin-console-daily-reminder-SC-80`, `grade10-admin-console-daily-reminder-SC-37` in part; Q46 `grade10-admin-console-daily-reminder-SC-16`; Q47 `grade10-admin-console-daily-reminder-SC-81`; Q48 `grade10-admin-console-daily-reminder-SC-82`, `grade10-admin-console-daily-reminder-SC-83`
- **Contradicted** - no case and scenario state opposite things, and no two scenarios do. The Saturday scenario's message carries only the list that has rows, as the requirement's step 2 says, and a whole-day wait reads `5d` (Q46)
- **Raised** - nothing open. The two rows this run raised landed as Q46 (a whole-day wait reads `5d`; `g10adm.console-daily-reminder.TC-n4g`) and Q47 (a modified click leaves the dialog open; `g10adm.console-daily-reminder.TC-q7s`), and the 25 earlier rows are landed
- **Tasks and requirements** - every scenario id `tasks.md` names exists, and each of the 85, with the amendment's, is named by at least one task. Each requirement has a tests-first task: the two reads and grants in 2.1, Slack and its failure in 3.1, the dialog and Today in 4.1; the page group 1 is store-only. Every group ends with a verify task, and the walk group walks US-01 and US-02 in 6.1, US-03 in 6.2 and US-04 in 6.3
- **Markers** - `covers` lists every scenario serving the case's `Trace` journey, in spec order, as `docs/governance/test-traceability.md` requires, plus the scenarios that serve a Feature set group and are reached by the case: `grade10-admin-console-daily-reminder-SC-18` and `grade10-admin-console-daily-reminder-SC-19` by `g10adm.console-daily-reminder.TC-1iy`, `grade10-admin-console-daily-reminder-SC-18` by `g10adm.console-daily-reminder.TC-ja5` and `g10adm.console-daily-reminder.TC-p3h`, `grade10-admin-console-daily-reminder-SC-42` by `g10adm.console-daily-reminder.TC-z2e` and `g10adm.console-daily-reminder.TC-t2r`, `grade10-admin-console-daily-reminder-SC-65` by `g10adm.console-daily-reminder.TC-x5p` and `g10adm.console-daily-reminder.TC-e5w`, and `grade10-admin-console-daily-reminder-SC-53`, `grade10-admin-console-daily-reminder-SC-56`, `grade10-admin-console-daily-reminder-SC-57`, `grade10-admin-console-daily-reminder-SC-59` and `grade10-admin-console-daily-reminder-SC-60` by the US-04 cases that walk each. The case markers keep the ids their headings carry; the scenario markers were added to `spec.md` by Dev. The two scenarios removed since the earlier run (a day's message never posts twice, and a retry reads the lists as they stand) leave no marker and no `covers` entry; no case names either

**Run:** QA2 reconciliation, 2026-10-13, in a fresh context. Read: this suite (including Walk 1 and Walk 2), the delta `spec.md` Purpose, Feature set and all scenarios, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1–Q16 and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, the Daily Reminder and Auction Management PRD pages linked from the proposal, and `docs/governance/specs-to-test-cases.md` Reconciliation. Carried cases keep the prior change's journey-wide `covers` markers. Denied regenerating cases from scenarios. Q11–Q16 were already landed; they were not re-asked. Patched scenarios and cases only where those answers required a clear correction. New cases remain `draft`. The change was not accepted.

### Case dispositions (this change's new and patched cases)

| Case | Anchor | Disposition |
| --- | --- | --- |
| `g10adm.console-daily-reminder.TC-tbl` (US2-TC17) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-99` |
| `g10adm.console-daily-reminder.TC-rwq` (US2-TC18) | US-02 | Folded in part: `grade10-admin-console-daily-reminder-SC-16` one-row AND when also past 48 hours; no full THEN alone |
| `g10adm.console-daily-reminder.TC-urs` (US2-TC19) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-100`; Payment Overdue row follows `grade10-admin-console-daily-reminder-SC-15` |
| `g10adm.console-daily-reminder.TC-7xu` (US2-TC20) | US-02 | Folded: `grade10-admin-console-daily-reminder-SC-26`; rev 2 |
| `g10adm.console-daily-reminder.TC-j8o` (US2-TC13) | US-02 | Deprecated; superseded by US2-TC17–20 and US5 cases |
| `g10adm.console-daily-reminder.TC-orm` (US3-TC15) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-36`; rev 2 |
| `g10adm.console-daily-reminder.TC-oyo` (US3-TC16) | US-03 | Folded: `grade10-admin-console-daily-reminder-SC-39`; rev 2 |
| `g10adm.console-daily-reminder.TC-kl7` (US4-TC22) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-102` |
| `g10adm.console-daily-reminder.TC-7e7` (US4-TC17) | US-04 | Folded: `grade10-admin-console-daily-reminder-SC-60`; empty-string rows and no-raise AND (Q15); rev 2; covers narrowed to SC-f3g |
| `g10adm.console-daily-reminder.TC-jt5` (US5-TC1) | US-05 | Folded: `grade10-admin-console-daily-reminder-SC-16` |
| `g10adm.console-daily-reminder.TC-lp9` (US5-TC2) | US-05 | Folded: clearing removes the flagged row when under 48 hours; requirement leaf, no separate scenario |
| `g10adm.console-daily-reminder.TC-qof` (US5-TC3) | US-05 | Folded: `grade10-admin-console-daily-reminder-SC-103` (Q11); rev 2 |
| `g10adm.console-daily-reminder.TC-sa7` (US5-TC4) | US-05 | Folded: `grade10-admin-console-daily-reminder-SC-101` |
| `g10adm.console-daily-reminder.TC-31b` (US5-TC5) | US-05 | Folded: `grade10-admin-console-daily-reminder-SC-104` (Q12); added draft |
| `g10adm.console-daily-reminder.TC-7nw` (US6-TC1) | US-06 | Folded: `grade10-admin-console-daily-reminder-SC-88` including publish-now (Q14); rev 2 |
| `g10adm.console-daily-reminder.TC-5pk` (US6-TC2) | US-06 | Folded: `grade10-admin-console-daily-reminder-SC-90` whole minutes (Q16); rev 2 |
| `g10adm.console-daily-reminder.TC-7cj` (US6-TC3) | US-06 | Folded: `grade10-admin-console-daily-reminder-SC-89` |
| `g10adm.console-daily-reminder.TC-fka` (US6-TC4) | US-06 | Folded: `grade10-admin-console-daily-reminder-SC-91` |
| `g10adm.console-daily-reminder.TC-mhl` (US6-TC5) | US-06 | Folded: `grade10-admin-console-daily-reminder-SC-96`; patched to extension failure and last-step wording; rev 2 |
| `g10adm.console-daily-reminder.TC-kf5` (US7-TC1) | US-07 | Folded: `grade10-admin-console-daily-reminder-SC-92`, `grade10-admin-console-daily-reminder-SC-93`, `grade10-admin-console-daily-reminder-SC-95` |
| `g10adm.console-daily-reminder.TC-swi` (US7-TC2) | US-07 | Folded: `grade10-admin-console-daily-reminder-SC-94` main THEN |
| `g10adm.console-daily-reminder.TC-7k4` (US7-TC3) | US-07 | Folded in part: stay-no-repeat AND of `grade10-admin-console-daily-reminder-SC-92`, `grade10-admin-console-daily-reminder-SC-93`, `grade10-admin-console-daily-reminder-SC-94` |
| `g10adm.console-daily-reminder.TC-9a8` (US7-TC4) | US-07 | Folded into best-effort requirement; overdue failure has no dedicated scenario beside `grade10-admin-console-daily-reminder-SC-96` / `grade10-admin-console-daily-reminder-SC-97` |
| `g10adm.console-daily-reminder.TC-8w7` (US7-TC5) | US-07 | Folded: re-flag AND of `grade10-admin-console-daily-reminder-SC-94` (Q13); added draft |

### Carried cases (US1–US4 prior suite)

- **Kept** - 79 draft cases under US-01 to US-04 keep prior dispositions from the support-admin-daily-reminder reconciliation; their `covers` markers stay as journey-wide lists from that fold
- **Over-claimed (inherited)** - those markers list every scenario serving the case's Trace journey, not only scenarios whose THEN the case fully asserts. Recorded here; markers left unchanged (immutable ids). This change's new markers use THEN-full links only

### Scenario coverage (change-added and change-touched)

| Spec scenario | Disposition |
| --- | --- |
| `grade10-admin-console-daily-reminder-SC-88` | Covered by US6-TC1; GIVEN widened for publish-now (Q14) |
| `grade10-admin-console-daily-reminder-SC-89` | Covered by US6-TC3 |
| `grade10-admin-console-daily-reminder-SC-90` | Covered by US6-TC2; THEN names whole minutes (Q16) |
| `grade10-admin-console-daily-reminder-SC-91` | Covered by US6-TC4 |
| `grade10-admin-console-daily-reminder-SC-92` | Covered by US7-TC1; stay-no-repeat in part by US7-TC3 |
| `grade10-admin-console-daily-reminder-SC-93` | Covered by US7-TC1; stay-no-repeat in part by US7-TC3 |
| `grade10-admin-console-daily-reminder-SC-94` | Covered by US7-TC2; re-flag by US7-TC5 (Q13); stay-no-repeat in part by US7-TC3 |
| `grade10-admin-console-daily-reminder-SC-95` | Covered by US7-TC1 |
| `grade10-admin-console-daily-reminder-SC-96` | Covered by US6-TC5; THEN requires bid move before Slack starts (Q10) |
| `grade10-admin-console-daily-reminder-SC-97` | Out of suite - task 2.1 close-path Slack failure tests |
| `grade10-admin-console-daily-reminder-SC-60` | Covered by US4-TC17; GIVEN/THEN widened for empty and no-raise (Q15) |
| `grade10-admin-console-daily-reminder-SC-98` | Out of suite - task 2.1 lifecycle not-configured tests; shares `reminderDeps` gate with SC-60 (Q15) |
| `grade10-admin-console-daily-reminder-SC-16` | Covered by US5-TC1; one-row AND in part by US2-TC18 |
| `grade10-admin-console-daily-reminder-SC-99` | Covered by US2-TC17 |
| `grade10-admin-console-daily-reminder-SC-100` | Covered by US2-TC19 |
| `grade10-admin-console-daily-reminder-SC-101` | Covered by US5-TC4 |
| `grade10-admin-console-daily-reminder-SC-102` | Covered by US4-TC22 |
| `grade10-admin-console-daily-reminder-SC-103` | Added for Q11; covered by US5-TC3 |
| `grade10-admin-console-daily-reminder-SC-104` | Added for Q12; covered by US5-TC5 |

### Anchor coverage

- **US-01** - carried cases; unchanged by this change's journeys
- **US-02** - wait rows carried; flagged lead, one-row, overdue alone, dialog warning mark added
- **US-03** - Today warning title/caption and empty copy added
- **US-04** - Slack warning heading and flagged-first order added; morning not-configured bypass tightened for empty env (Q15)
- **US-05** - fresh flag, clear, earliest reason/wait, flagged overdue, clear-to-wait
- **US-06** - go-live (including publish-now), extension minutes, end, channel, extension failure
- **US-07** - overdue and flag warnings, no repeat, re-flag, overdue failure
- **Feature-set roots** - Flagged or still waiting, Slack lifecycle alerts, warning title, best effort, shared env bypass: each has at least one asserting case or an Out of suite verifier

### Uncovered / over-claimed / contradictions

- **Uncovered scenarios** - none among ADDED lifecycle and flagged scenarios after Out of suite for SC-97 and SC-98
- **Over-claimed** - inherited journey-wide `covers` on carried US1–US4 cases (see above); new markers do not over-claim
- **Contradictions** - none between cases and scenarios after Q11–Q16 patches
- **Pending `covers` (intentional)** - US2-TC18, US5-TC2, US7-TC3 and US7-TC4 assert only part of a scenario's THEN (one-row AND, clear-under-48h requirement leaf, stay-no-repeat AND, overdue failure beside SC-96/SC-97). Dispositions above; validator warnings until a full-THEN case exists or approval accepts the partial folds
- **Raised** - nothing new; Q11–Q16 already landed

### Counts

- Cases: 101 draft, 1 deprecated
- New/patched this run: 22 dispositions in the table above (20 QA1 drafts + US5-TC5 + US7-TC5; US2-TC13 deprecated)
- Scenarios added: SC-103, SC-104
- Scenarios patched: SC-60 (Q15 morning empty/no-raise), SC-88 (Q14), SC-90 (Q16), SC-96/SC-98 and best-effort requirement (Q10/Q15 both-env and last step); Feature set daily Bypass when unset and lifecycle Best effort, last step matched
- Cases patched: US4-TC17 (Q15), US5-TC3 (Q11), US6-TC1 (Q14), US6-TC2 (Q16), US6-TC5 (align to SC-96 last-step)
- Cases added: US5-TC5 (Q12), US7-TC5 (Q13)
