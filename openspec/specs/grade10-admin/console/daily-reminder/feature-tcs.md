# grade10-admin/console/daily-reminder Test Cases

**Status:** pending-review · 0/42
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (non-GUI):** grade10-admin-console-daily-reminder-SC-45, grade10-admin-console-daily-reminder-SC-46, grade10-admin-console-daily-reminder-SC-47, grade10-admin-console-daily-reminder-SC-48, grade10-admin-console-daily-reminder-SC-49, grade10-admin-console-daily-reminder-SC-50, grade10-admin-console-daily-reminder-SC-51, grade10-admin-console-daily-reminder-SC-52, grade10-admin-console-daily-reminder-SC-53, grade10-admin-console-daily-reminder-SC-54, grade10-admin-console-daily-reminder-SC-56, grade10-admin-console-daily-reminder-SC-57, grade10-admin-console-daily-reminder-SC-59, grade10-admin-console-daily-reminder-SC-60, grade10-admin-console-daily-reminder-SC-73, grade10-admin-console-daily-reminder-SC-74, grade10-admin-console-daily-reminder-SC-75, grade10-admin-console-daily-reminder-SC-78, grade10-admin-console-daily-reminder-SC-87, grade10-admin-console-daily-reminder-SC-88, grade10-admin-console-daily-reminder-SC-89, grade10-admin-console-daily-reminder-SC-90, grade10-admin-console-daily-reminder-SC-91, grade10-admin-console-daily-reminder-SC-92, grade10-admin-console-daily-reminder-SC-93, grade10-admin-console-daily-reminder-SC-94, grade10-admin-console-daily-reminder-SC-95, grade10-admin-console-daily-reminder-SC-96, grade10-admin-console-daily-reminder-SC-97, grade10-admin-console-daily-reminder-SC-98, grade10-admin-console-daily-reminder-SC-102 - the Slack messages and their sends, which no console screen shows

**Out of suite (api):** grade10-admin-console-daily-reminder-SC-65 - a caller with no auction access asking for either list, which the console never sends

## Background

* The daily dialog opens over the first console page an operator loads on a Hong Kong day, holding What's New (yesterday's closes) and Flagged or still waiting; `<today>` is the console's Today page, holding the same lists in columns beside Needs you. The day is Hong Kong's, whatever the browser's zone; the tester moves the clock to reach one.
* The operator is admin(holds `auction:read`, `auction:write`, `auction:operate`, `auction:payment` and `auction:shipment`) and has not closed the dialog today in this browser, unless a case says otherwise. A wait is counted from its status's own clock: setup confirmed for Send invoice, the latest proof for Check proof, the invoice paid for Dispatch.

## Walk 1: Flagged or still waiting in the dialog and on Today

Starting state:

- The operator has not closed the dialog today.
- A fresh flag: an order with one open payment flag, raised 2 hours ago, reason Overpaid, not past 48 hours in a waiting status.
- An unflagged order has waited 49 hours in Preparing Invoice; another is Setup Overdue; a flagged order has also waited 49 hours in Preparing Invoice, its earliest open flag 3 hours ago.

Shared test data:

| Field | Value |
| --- | --- |
| flag reason | Overpaid |

### Route

1. Open the console, and read Flagged or still waiting in the dialog.
   - Flagged rows lead, then the 48-hour wait. `g10adm.console-daily-reminder.US2-TC17`
   - A flagged-and-waiting order is one flagged row only. `g10adm.console-daily-reminder.US2-TC18`
   - Setup Overdue alone is absent. `g10adm.console-daily-reminder.US2-TC19`
   - The list heading carries a warning mark. `g10adm.console-daily-reminder.US2-TC20`
   - The fresh flag appears with its reason. `g10adm.console-daily-reminder.US5-TC1`
2. Close the dialog, and open `<today>`.
   - The waiting column carries its warning mark and caption. `g10adm.console-daily-reminder.US3-TC15`
3. Clear every flag and the waiting order, and read `<today>` again.
   - The empty column says Nothing flagged or waiting too long. `g10adm.console-daily-reminder.US3-TC5`

## g10adm.console-daily-reminder.US1: Operator starts the day with what closed yesterday

**As an** auction operator,
**I want** a list of the listings that closed yesterday when I first open the console, each opening the order or listing it belongs to,
**so that** I begin with the lots that need my attention without searching for them.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ue2 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC1: The first entry of the day opens the dialog with both lists over the page landed on

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* A sold and an unsold listing closed yesterday; an order has waited 49 hours in Preparing Invoice; the operator `<enters>`.

**Test data:**

| `<enters>` |
| --- |
| at the console's home |
| by a link to an order's page |
| signed out, by a link to an order's page, then signing in |

**Steps:**

1. Let the page load, and read the dialog.

**Expected Results:**

* The page landed on loads with the dialog open over it, holding What's New, with both listings, then Flagged or still waiting, with the order.

<!-- trace:case id=g10adm.console-daily-reminder.TC-rz8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC2: What's New lists yesterday's closes latest first, each opening its order or listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* Closed yesterday: AU-1038 at 21:30 with a winner whose order reads Awaiting Setup; AU-1040 at 15:00 unsold; AU-1041 at 10:00 with no bid; a sandbox lot; AU-1042 sold, its order since cancelled; AU-1001, AU-1002 and AU-1003 at one instant.

**Steps:**

1. Read What's New in the dialog, twice over two loads.
2. Follow the AU-1038 row, then the AU-1040 row.

**Expected Results:**

* Each listing has one row, latest close first, AU-1001 to AU-1003 by code on both reads; the sandbox lot reads as any other.
* AU-1038 shows its code, lot, winner and Awaiting Setup; AU-1040 and AU-1041 read Unsold with no winner; AU-1042 keeps its row with its order's status now.
* Step 2 opens AU-1038's winner order, then AU-1040's listing.

<!-- trace:case id=g10adm.console-daily-reminder.TC-5cx rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC5: Yesterday is the Hong Kong day at both edges, and a listing called off is not listed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* It is 09:00 on Monday 12 October in Hong Kong, the browser set to New York; listings closed at 23:59:59 on 10 October, 00:00:00 and 23:59:59 on 11 October, and 00:00:00 on 12 October, Hong Kong time; another was called off yesterday before its close.

**Steps:**

1. Read What's New.

**Expected Results:**

* It lists the two that closed on 11 October and neither of the others, nor the one called off.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7l8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC7: Closing the dialog, however it is closed, keeps it closed for the Hong Kong day

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* The dialog is open at 09:00 Hong Kong time, a Send invoice row in it.

**Test data:**

| `<closed by>` |
| --- |
| its close button |
| Escape |
| a click outside it |
| following the Send invoice row, which opens the order with the dialog closed |

**Steps:**

1. Close it by `<closed by>`.
2. At 15:00 the same Hong Kong day, load the console again in the same browser.

**Expected Results:**

* Step 2 opens no dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-zgt rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC8: The next Hong Kong day opens the dialog again, on the next entry and not mid-session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* An operator in a browser set to London closed the dialog at 23:50 Hong Kong time and keeps working; a list holds a row for them the next day.

**Steps:**

1. Work on past 00:00 Hong Kong time.
2. At 00:10, enter the console afresh.

**Expected Results:**

* Step 1 opens no dialog during the session.
* Step 2 opens it.

<!-- trace:case id=g10adm.console-daily-reminder.TC-xds rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC10: The closed mark belongs to the operator and the browser, and signing out clears it

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

* Operator A closed the dialog at 09:00 today in one browser; a list holds a row for each operator.

**Test data:**

| `<then>` |
| --- |
| operator B signs in on the same browser and enters the console |
| operator A enters the console in a second browser |
| operator A signs out and in again in the same browser at 10:00 |

**Steps:**

1. `<then>`.

**Expected Results:**

* The dialog opens.

<!-- trace:case id=g10adm.console-daily-reminder.TC-n3a rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC18: An operator with nothing to read gets no dialog

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* `<operator>`.

**Test data:**

| `<operator>` |
| --- |
| An operator with no row in either list |
| An operator whose roles do not open Auction, while listings closed yesterday and orders wait |

**Steps:**

1. Enter the console.

**Expected Results:**

* No dialog opens.

<!-- trace:case id=g10adm.console-daily-reminder.TC-323 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n,g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US1-TC13: A list with no row for the operator is left out of the dialog

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* The operator has `<rows>`.

**Test data:**

| `<rows>` | `<dialog holds>` |
| --- | --- |
| a What's New row and no waiting row | What's New alone |
| a waiting row and no What's New row | Flagged or still waiting alone |

**Steps:**

1. Enter the console.

**Expected Results:**

* The dialog holds `<dialog holds>`, with no heading or line for the other.

<!-- trace:case id=g10adm.console-daily-reminder.TC-c8j rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC27: An entry with nothing sets no mark, and only a full load opens the dialog later

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* At 08:30 the operator entered with no row, and no dialog opened; at 11:00 an order reaches 48 hours in Preparing Invoice.

**Steps:**

1. Leave the tab and return, and move to another page.
2. Load the console in full.

**Expected Results:**

* Step 1 opens nothing.
* Step 2 opens the dialog with the order.

<!-- trace:case id=g10adm.console-daily-reminder.TC-z6w rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC19: A list that fails to load says so with a Retry, and the dialog opens for it

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
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* `<failing>` fails to load; `<other>`.

**Test data:**

| `<failing>` | `<other>` |
| --- | --- |
| What's New | Flagged or still waiting holds a row |
| Flagged or still waiting | What's New holds no row |

**Steps:**

1. Enter the console.
2. Let the read answer, and click Retry.

**Expected Results:**

* Step 1 opens the dialog, saying `<failing>` failed to load, with a Retry, beside any rows of the other.
* Step 2 reads it again and lists it.

<!-- trace:case id=g10adm.console-daily-reminder.TC-u9a rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC31: The dialog reads when it opens, and has no Refresh

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* The dialog is open with a Send invoice row.

**Steps:**

1. Wait 10 minutes; leave the tab and come back.

**Expected Results:**

* Neither list is read again, and the dialog carries no Refresh.

<!-- trace:case id=g10adm.console-daily-reminder.TC-nb8 rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC20: Each operator reads the rows their grants open

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* A sold and an unsold listing closed yesterday; three orders wait 3 days, and one is flagged; `<operator>` enters.

**Test data:**

| `<operator>` | `<reads>` |
| --- | --- |
| holding `auction:read` alone | What's New with both rows; no waiting row |
| holding the payment and shipment grants | both What's New rows, the sold one opening its order, and every waiting row |

**Steps:**

1. Read the dialog.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ffo rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n -->
### g10adm.console-daily-reminder.US1-TC14: A browser that keeps nothing opens the dialog once per page load

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* The browser keeps nothing between page loads; a list holds a row.

**Steps:**

1. Enter the console, close the dialog, and move to another page without reloading.
2. Reload.

**Expected Results:**

* Step 1 opens nothing more; step 2 opens the dialog again.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ogw rev=1 covers=g10adm.console-daily-reminder.SC-t4n,g10adm.console-daily-reminder.SC-tp9,g10adm.console-daily-reminder.SC-xv5,g10adm.console-daily-reminder.SC-53i,g10adm.console-daily-reminder.SC-7xm,g10adm.console-daily-reminder.SC-zy5,g10adm.console-daily-reminder.SC-bz8,g10adm.console-daily-reminder.SC-xxl,g10adm.console-daily-reminder.SC-4ql,g10adm.console-daily-reminder.SC-ml9,g10adm.console-daily-reminder.SC-4zv,g10adm.console-daily-reminder.SC-n4k,g10adm.console-daily-reminder.SC-qy6,g10adm.console-daily-reminder.SC-81m,g10adm.console-daily-reminder.SC-2u2,g10adm.console-daily-reminder.SC-0so,g10adm.console-daily-reminder.SC-74n,g10adm.console-daily-reminder.SC-pxi,g10adm.console-daily-reminder.SC-iu6,g10adm.console-daily-reminder.SC-xp0,g10adm.console-daily-reminder.SC-cer,g10adm.console-daily-reminder.SC-z0d,g10adm.console-daily-reminder.SC-wmh,g10adm.console-daily-reminder.SC-rzr,g10adm.console-daily-reminder.SC-5sd,g10adm.console-daily-reminder.SC-gxz,g10adm.console-daily-reminder.SC-k4n,g10adm.console-daily-reminder.SC-e3n,g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US1-TC16: The dialog and Today list every row, without a cap

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-01

**Pre-conditions:**

* An operator with payment processing has 14 orders waited 48 hours or more to have an invoice sent.

**Test data:**

| `<surface>` |
| --- |
| the dialog |
| `<today>` |

**Steps:**

1. Read Flagged or still waiting on `<surface>`.

**Expected Results:**

* All 14 rows are listed.

---

## g10adm.console-daily-reminder.US2: Operator is reminded of flagged orders and orders still waiting on them

**As an** operator with payment or shipment processing,
**I want** flagged orders at the top of Flagged or still waiting, then the orders that have waited 48 hours for me to send an invoice, check a proof or dispatch, listed every day until I act,
**so that** a flag or a forgotten job is not lost behind newer work.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ivd rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC1: An order waiting 48 hours on an action is a row naming the action, timed from its own clock

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
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* An unflagged order is in `<status>`, `<clock>`.

**Test data:**

| `<status>` | `<clock>` | `<row>` |
| --- | --- | --- |
| Preparing Invoice | setup confirmed 3 days 5 hours ago | Send invoice |
| Payment Verifying | a first proof 5 days ago and a second 50 hours ago | Check proof, timed from the second |
| Preparing Shipment | the invoice paid 5 days 2 hours ago | Dispatch |

**Steps:**

1. Read Flagged or still waiting, and follow the row.

**Expected Results:**

* It holds a `<row>` row; following it opens the order's page.

<!-- trace:case id=g10adm.console-daily-reminder.TC-fbu rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC2: An order at exactly 48 hours is listed

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

* At 09:00:00, an unflagged order's setup was confirmed at 09:00:00 two days earlier.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* The order has a Send invoice row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-t7x rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC7: An order short of 48 hours on its own clock is not listed

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

* `<order>`.

**Test data:**

| `<order>` |
| --- |
| at 09:00:00, an unflagged order's setup confirmed at 09:00:01 two days earlier |
| an unflagged order in Preparing Shipment paid 10 hours ago, placed long before |

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* The order has no row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-ala rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC3: The longest wait leads across the three actions, equal waits by listing code

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

* Unflagged: a Dispatch waited 5 days, a Check proof 4, a Send invoice 3; and Send invoice orders for AU-1042, AU-1007 and AU-1019 confirmed at one instant 2 days ago; the operator holds payment and shipment processing.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* It reads Dispatch, Check proof, Send invoice, then AU-1007, AU-1019, AU-1042.

<!-- trace:case id=g10adm.console-daily-reminder.TC-eba rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC4: An order stays listed every day until it moves on

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* An unflagged order has waited 3 days in Preparing Invoice.

**Steps:**

1. Read Flagged or still waiting today, and again tomorrow.

**Expected Results:**

* Both days hold its row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-aah rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC5: An order that moves on leaves the list

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* An unflagged order listed for waiting 3 days in Preparing Invoice.

**Steps:**

1. Send its invoice, and read Flagged or still waiting again.

**Expected Results:**

* The order has no row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-xga rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC9: No other status is listed however long it waits

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* Unflagged orders have each waited 5 days in Awaiting Setup, Pending Payment, Partially Paid, Shipped and Delivered; the operator holds every grant.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* None of them has a row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-1iy rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-no9,g10adm.console-daily-reminder.SC-6zm,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC10: The waiting list sits inside Needs action and marks no status, row or page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Flagged or still waiting list

**Pre-conditions:**

* Orders in Preparing Invoice, Payment Verifying and Preparing Shipment each wait 3 days, unflagged, and are listed.

**Steps:**

1. Read Flagged or still waiting, and the Orders worklist's Needs action.
2. Open one order's worklist row and page.

**Expected Results:**

* Every waiting order is also in Needs action.
* The status, the row and the page read as they would unlisted, carrying no reminder mark.

<!-- trace:case id=g10adm.console-daily-reminder.TC-kp9 rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC11: Rows follow the operator's grants

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* A Send invoice, a Check proof and a Dispatch order each wait 3 days, unflagged, and one order is flagged; `<operator>` reads Flagged or still waiting.

**Test data:**

| `<operator>` | `<rows>` |
| --- | --- |
| holding read and payment processing | Send invoice, Check proof and the flagged row |
| holding read and shipment processing | Dispatch |
| an admin | all four |

**Steps:**

1. Read the list.

**Expected Results:**

* It holds `<rows>` and no other.

<!-- trace:case id=g10adm.console-daily-reminder.TC-n4g rev=1 covers=g10adm.console-daily-reminder.SC-v0i,g10adm.console-daily-reminder.SC-q0x,g10adm.console-daily-reminder.SC-06a,g10adm.console-daily-reminder.SC-bs5,g10adm.console-daily-reminder.SC-r85,g10adm.console-daily-reminder.SC-b1n,g10adm.console-daily-reminder.SC-89a,g10adm.console-daily-reminder.SC-n5c,g10adm.console-daily-reminder.SC-x5d,g10adm.console-daily-reminder.SC-juj,g10adm.console-daily-reminder.SC-hsd,g10adm.console-daily-reminder.SC-tvq,g10adm.console-daily-reminder.SC-22e,g10adm.console-daily-reminder.SC-vpd,g10adm.console-daily-reminder.SC-gjm,g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC14: The console shows the exact wait, not whole days

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* A Dispatch order has waited 3 days 5 hours.

**Steps:**

1. Read its row.

**Expected Results:**

* It reads the wait in days and hours, not 3 days.

<!-- trace:case id=g10adm.console-daily-reminder.TC-tbl rev=1 covers=g10adm.console-daily-reminder.SC-a99 -->
### g10adm.console-daily-reminder.US2-TC17: Flagged rows lead above 48-hour waits

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* A flagged order raised 2 hours ago, and an unflagged Send invoice waited 5 days.

**Steps:**

1. Read Flagged or still waiting in the dialog.

**Expected Results:**

* The flagged row is first, the Send invoice row after it.

<!-- trace:case id=g10adm.console-daily-reminder.TC-rwq rev=1 -->
### g10adm.console-daily-reminder.US2-TC18: A flagged order past 48 hours is one flagged row only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* A flagged order has also waited 49 hours in Preparing Invoice.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* It holds one Flagged row for the order and no Send invoice row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-urs rev=1 covers=g10adm.console-daily-reminder.SC-b00 -->
### g10adm.console-daily-reminder.US2-TC19: Setup Overdue and Payment Overdue alone are not listed

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

**Pre-conditions:**

* Unflagged orders sit in Setup Overdue and Payment Overdue for 5 days; the operator holds every grant.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* Neither has a row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-7xu rev=2 covers=g10adm.console-daily-reminder.SC-5n3 -->
### g10adm.console-daily-reminder.US2-TC20: The dialog's waiting list heading carries a warning mark

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-02

**Pre-conditions:**

* A waiting row stands.

**Steps:**

1. Read the dialog's Flagged or still waiting heading.

**Expected Results:**

* It carries a warning mark.

---

## g10adm.console-daily-reminder.US3: Operator finds the reminder again on Today

**As an** operator who closed the daily dialog,
**I want** What's New and Flagged or still waiting on Today, beside what needs me, with a warning mark on the waiting column,
**so that** I can come back to them later in the day without the dialog.

<!-- trace:case id=g10adm.console-daily-reminder.TC-64m rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y,g10adm.console-daily-reminder.SC-no9 -->
### g10adm.console-daily-reminder.US3-TC1: Today stands What's New, Flagged or still waiting and Needs you side by side, grouped by product

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* An operator who closed the dialog has auction rows in both lists and section counts today, on a wide screen.

**Steps:**

1. Open `<today>`.

**Expected Results:**

* What's New, Flagged or still waiting and Needs you stand side by side, in that order, at one height; each list holds its rows under an Auction group, opened, with a chevron.
* Needs you holds the same section cards, one under another, with the same counts and links as before.

<!-- trace:case id=g10adm.console-daily-reminder.TC-z2e rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-1qd,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC3: Approvals and the rest of Today sit below the columns, unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Today columns

**Pre-conditions:**

* An operator has two asks to approve, recent records and sections their roles open.

**Steps:**

1. Open `<today>`, and read below the columns and the Needs you total.

**Expected Results:**

* The Approvals card, Recent and All sit below the three columns, the card keeping its content and controls; the Needs you total and its summary sentence count the two asks.

<!-- trace:case id=g10adm.console-daily-reminder.TC-0rq rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC5: A list with no row stays as a column and says so

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* An operator has no row in either list.

**Steps:**

1. Open `<today>`.

**Expected Results:**

* All three columns show; What's New says No listing closed yesterday., and Flagged or still waiting Nothing flagged or waiting too long.

<!-- trace:case id=g10adm.console-daily-reminder.TC-mgn rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC6: The columns stack on a narrow screen, Needs you last

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* An operator on a narrow screen.

**Steps:**

1. Open `<today>`.

**Expected Results:**

* The columns stack as What's New, Flagged or still waiting, Needs you.

<!-- trace:case id=g10adm.console-daily-reminder.TC-y84 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y,g10adm.console-daily-reminder.SC-no9 -->
### g10adm.console-daily-reminder.US3-TC7: Today reads its lists on arrival, on return and on Refresh, never on a timer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* An operator is reading `<today>`.

**Steps:**

1. Wait 10 minutes with the tab in view.
2. Leave the tab and return; then click Refresh.

**Expected Results:**

* Step 1 reads nothing again.
* Step 2 reads all three columns again, each time.

<!-- trace:case id=g10adm.console-daily-reminder.TC-c2l rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC9: A row on Today opens its order or listing

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

* What's New holds a sold and an unsold row.

**Steps:**

1. Follow each on `<today>`.

**Expected Results:**

* The sold row opens the winner order, the unsold row the listing.

<!-- trace:case id=g10adm.console-daily-reminder.TC-554 rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC10: Today shows an operator only the rows their grants allow

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* A Send invoice, a Check proof and a Dispatch order each wait 3 days; an operator holds read and shipment processing.

**Steps:**

1. Open `<today>`.

**Expected Results:**

* Flagged or still waiting holds the Dispatch row alone.

<!-- trace:case id=g10adm.console-daily-reminder.TC-a7l rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC13: An operator with no auction access sees empty lists, not a failure

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* An operator whose roles do not open Auction.

**Steps:**

1. Open `<today>`.

**Expected Results:**

* Both lists read empty, with no failure and no Retry.

<!-- trace:case id=g10adm.console-daily-reminder.TC-v6b rev=1 covers=g10adm.console-daily-reminder.SC-v91,g10adm.console-daily-reminder.SC-ojd,g10adm.console-daily-reminder.SC-5yn,g10adm.console-daily-reminder.SC-pck,g10adm.console-daily-reminder.SC-75f,g10adm.console-daily-reminder.SC-pbn,g10adm.console-daily-reminder.SC-vn1,g10adm.console-daily-reminder.SC-x3y -->
### g10adm.console-daily-reminder.US3-TC12: A list that fails on Today says so in its column with a Retry

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* Flagged or still waiting fails to load; What's New loads.

**Steps:**

1. Open `<today>`.

**Expected Results:**

* Its column says it failed to load, with a Retry; What's New shows its rows.

<!-- trace:case id=g10adm.console-daily-reminder.TC-orm rev=2 covers=g10adm.console-daily-reminder.SC-v91 -->
### g10adm.console-daily-reminder.US3-TC15: Today names Flagged or still waiting with its warning mark and caption

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-03

**Pre-conditions:**

* A waiting row stands.

**Steps:**

1. Open `<today>`, and read the waiting column's title.

**Expected Results:**

* It reads Flagged or still waiting, with a warning mark and the caption Something wrong or waiting a while, needing your action.

---

## g10adm.console-daily-reminder.US5: Operator sees a flagged order on the waiting list the same day

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
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* An order in Preparing Shipment, paid 5 days ago, holds a payment flag raised 1 hour ago, reason Overpaid.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* It leads with the order's Flagged row, reading Overpaid and its wait since the flag.

<!-- trace:case id=g10adm.console-daily-reminder.TC-lp9 rev=1 covers=g10adm.console-daily-reminder.SC-uoi -->
### g10adm.console-daily-reminder.US5-TC2: Clearing every flag removes the flagged row, leaving a 48-hour wait row at once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* On `<today>`: one flagged order has also waited 49 hours in Preparing Invoice; another is flagged and not waiting.

**Steps:**

1. Clear every open payment flag on both, and read the lists again.

**Expected Results:**

* The first now has a Send invoice row; the second has no row.

<!-- trace:case id=g10adm.console-daily-reminder.TC-qof rev=2 covers=g10adm.console-daily-reminder.SC-x4b -->
### g10adm.console-daily-reminder.US5-TC3: Several open flags show the earliest reason and wait

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* An order holds two open flags: Underpaid raised 30 hours ago, Overpaid 2 hours ago.

**Steps:**

1. Read its row.

**Expected Results:**

* It reads Underpaid and a wait of 30 hours.

<!-- trace:case id=g10adm.console-daily-reminder.TC-sa7 rev=1 covers=g10adm.console-daily-reminder.SC-b01 -->
### g10adm.console-daily-reminder.US5-TC4: An overdue order that is also flagged is listed as flagged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-daily-reminder-US-05

**Pre-conditions:**

* An order in Payment Overdue holds a payment flag raised today.

**Steps:**

1. Read Flagged or still waiting.

**Expected Results:**

* It holds one Flagged row for the order.
