## Purpose

Reminds an operator, once a day, which listings closed yesterday and which orders are still waiting on them, in a dialog on first entry, in three columns on Today and in a Slack message each morning.

## Feature set

- What's New list
  - Closed listings: each listing that closed on the previous Hong Kong day has one row
  - Row by outcome: a sold listing opens its winner order, an unsold one opens the listing
- Still Waiting list
  - Waiting orders: each order that has waited 48 hours for an invoice, a proof check or a dispatch has one row
  - Longest first: the oldest wait leads, and it stays listed until the order moves on
  - Not a status: the list marks no status, worklist row or order page
  - Flagged orders: an open payment flag does not remove an order from the list
- Row access
  - By grant: the console shows an operator only the rows whose action their grants allow
  - Empty lists: an empty list is left out of the dialog and said so on Today
- Daily dialog
  - First entry: opens once per Hong Kong day over the page the operator lands on
  - Closed mark: kept in the browser per operator and Hong Kong day, cleared at sign-out, and once per page load where storage is blocked
  - Failed read: a list that fails to load says so and never reads as empty
- Today columns
  - Three columns: What's New, Still Waiting and Needs you side by side
  - Product groups: each list groups its rows by product, Auction first
  - Rest of Today: Approvals leaves the Needs you column and sits below with Recent and All sections
- Slack message
  - Daily post: both lists go to one channel at 08:00 Hong Kong time every day
  - Row links: each row links to its listing or order in the console
  - Shared content: every row, with no winner name, email or phone
  - Quiet and long: nothing posts on an empty day, and each list stops at 10 rows
  - One attempt: the message is sent once; a failure is logged and not retried
  - Message form: whole days waited, a cut title and no link previews
  - Environment setup: the channel and token come from the environment, and a missing one is logged

## ADDED Requirements

### Requirement: What's New lists the listings that closed on the previous Hong Kong day

What's New SHALL list each listing that closed on the previous Hong Kong day, latest close first, one row per listing. The day is the Hong Kong calendar day, whatever zone the operator's browser is in; a listing that closed at 00:00:00 Hong Kong time belongs to the day it began. The row follows the listing's outcome:

| Outcome | The row shows | The row opens |
| --- | --- | --- |
| Sold | The listing code, the lot, the winner and the order's status as it stands now | The listing's winner order |
| Unsold | The listing code and the lot | The listing |

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-t4n rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-01 - A listing closed yesterday has a row
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator starts the day with what closed yesterday

- **GIVEN** it is Monday 12 October in Hong Kong, and listing AU-1038 closed on Sunday 11 October at 14:00 Hong Kong time
- **WHEN** an operator who may open it reads What's New
- **THEN** the list holds one row for AU-1038

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-tp9 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-02 - The day is the Hong Kong day at both edges
**Serves:** grade10-admin-console-daily-reminder-US-01 - two operators in different zones read one list

- **GIVEN** it is 09:00 on Monday 12 October in Hong Kong, and the operator's browser is set to New York
- **AND** one listing closed at 23:59:59 on 11 October Hong Kong time, one at 00:00:00 on 12 October Hong Kong time, and one at 23:59:59 on 10 October Hong Kong time
- **WHEN** the operator reads What's New
- **THEN** only the listing that closed at 23:59:59 on 11 October has a row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-xv5 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-03 - A sold listing is its winner order
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator goes from the row to the order that needs them

- **GIVEN** a listing that closed yesterday with a winner, whose order reads Awaiting Setup
- **WHEN** an operator reads What's New
- **THEN** the listing has one row, showing its code, its lot, the winner and Awaiting Setup
- **AND** the row opens the winner's order
- **AND** no second row names the same listing

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-53i rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-04 - An unsold listing opens the listing
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator sees a lot that found no buyer

- **GIVEN** a listing that closed yesterday with no winner
- **WHEN** an operator reads What's New
- **THEN** the listing has one row, showing its code and its lot with no winner
- **AND** the row opens the listing

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-7xm rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-05 - A cancelled order keeps its row with its status now
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator still learns the lot closed

- **GIVEN** a listing that closed yesterday with a winner, whose order has since been cancelled
- **WHEN** an operator reads What's New
- **THEN** the listing keeps its row, and the row shows the order's status as Cancelled

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-zy5 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-06 - The latest close leads
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator reads yesterday's evening closes first

- **GIVEN** listings that closed yesterday at 10:00, 21:30 and 15:00 Hong Kong time
- **WHEN** an operator reads What's New
- **THEN** the rows read in the order 21:30, 15:00, 10:00

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-evg rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-07 - A test lot is listed like any other
**Serves:** grade10-admin-console-daily-reminder-US-01 - a rehearsal sale appears as the real ones do

- **GIVEN** a sandbox listing that closed yesterday
- **WHEN** an operator reads What's New
- **THEN** the listing has a row, shown as any other row

### Requirement: Still Waiting lists the orders that have waited 48 hours for an operator action

Still Waiting SHALL list each order that has waited 48 hours or more in one of three statuses, longest wait first. The status is the one the Orders worklist derives, and the wait counts from the clock the worklist names under Waited since:

| Row says | Order status | Waited since |
| --- | --- | --- |
| Send invoice | Preparing Invoice | The winner's setup confirmation |
| Check proof | Payment Verifying | The winner's latest proof |
| Dispatch | Preparing Shipment | The payment that paid it |

An order SHALL be listed from the instant 48 hours have elapsed and on every day after, until it leaves the status. No other order status SHALL be listed, and an order with a payment flag not yet cleared SHALL NOT be listed. A row shows the listing code, the lot, the winner, the action and how long the order has waited, and opens the order.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-v0i rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-08 - An invoice not sent for 48 hours is listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - an order awaiting an invoice is not forgotten

- **GIVEN** an order in Preparing Invoice whose winner confirmed setup 3 days ago
- **WHEN** an operator with payment processing reads Still Waiting
- **THEN** the list holds a Send invoice row for the order, showing the listing code, the lot, the winner and 3 days

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-q0x rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-09 - A proof not checked for 48 hours is listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - a proof waiting to be checked is not forgotten

- **GIVEN** an order in Payment Verifying whose winner uploaded the proof 50 hours ago
- **WHEN** an operator with payment processing reads Still Waiting
- **THEN** the list holds a Check proof row for the order

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-06a rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-10 - The proof clock is the latest proof
**Serves:** grade10-admin-console-daily-reminder-US-02 - a winner who uploads again restarts the wait

- **GIVEN** an order in Payment Verifying whose winner uploaded a first proof 5 days ago and a second proof 10 hours ago
- **WHEN** an operator with payment processing reads Still Waiting
- **THEN** the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-bs5 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-11 - A card not dispatched for 48 hours is listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - a paid order awaiting dispatch is not forgotten

- **GIVEN** an order in Preparing Shipment whose invoice was paid 5 days ago
- **WHEN** an operator with shipment processing reads Still Waiting
- **THEN** the list holds a Dispatch row for the order, showing 5 days

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-r85 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-12 - Exactly 48 hours is listed and one second less is not
**Serves:** grade10-admin-console-daily-reminder-US-02 - the threshold is elapsed time

- **GIVEN** at 09:00:00 two orders in Preparing Invoice, whose setup was confirmed at 09:00:00 two days earlier and at 09:00:01 two days earlier
- **WHEN** an operator with payment processing reads Still Waiting
- **THEN** the first order has a row and the second has none

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-b1n rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-13 - The longest wait leads across the three actions
**Serves:** grade10-admin-console-daily-reminder-US-02 - the oldest job is read first

- **GIVEN** a Dispatch order that has waited 5 days, a Send invoice order that has waited 3 days and a Check proof order that has waited 4 days
- **AND** an operator holding payment processing and shipment processing
- **WHEN** they read Still Waiting
- **THEN** the rows read Dispatch, Check proof, Send invoice

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-89a rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-14 - An order stays listed every day until it moves on
**Serves:** grade10-admin-console-daily-reminder-US-02 - an order nobody got to is listed again tomorrow

- **GIVEN** an order in Preparing Invoice that has waited 3 days
- **WHEN** an operator with payment processing reads Still Waiting on that day and on the next
- **THEN** the order has a row on both days
- **AND** once the invoice is sent, the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-n5c rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-15 - No other status is listed however long it waits
**Serves:** grade10-admin-console-daily-reminder-US-02 - Needs you keeps counting the overdue and the waiting on winner

- **GIVEN** orders that have each waited 5 days in Awaiting Setup, Setup Overdue, Pending Payment, Payment Overdue, Partially Paid, Shipped and Delivered
- **WHEN** an operator holding every grant reads Still Waiting
- **THEN** none of those orders has a row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-x5d rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-16 - A flagged order is not listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - a flagged payment is read in Needs you

- **GIVEN** an order in Preparing Shipment that has waited 5 days and holds a payment flag nobody has cleared
- **WHEN** an operator with shipment processing reads Still Waiting
- **THEN** the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-juj rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-17 - A row opens its order
**Serves:** grade10-admin-console-daily-reminder-US-02 - the operator goes from the reminder to the work

- **GIVEN** a Send invoice row
- **WHEN** an operator follows it
- **THEN** that order's page opens

### Requirement: The lists agree with Needs you and mark nothing

Every Still Waiting row SHALL be an order the Orders worklist lists under Needs action, and the Needs you counts SHALL be unchanged by the lists. Reading either list, or posting it to Slack, SHALL NOT change any order status, worklist row, order page or listing, and no screen SHALL carry the word overdue because of it.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-no9 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-18 - Still Waiting is inside Needs action
**Serves:** Still Waiting list - the worklist and the reminder derive one status

- **GIVEN** one order in each of Preparing Invoice, Payment Verifying and Preparing Shipment, each waiting 3 days, and no flag
- **WHEN** Still Waiting and the Orders worklist's Needs action are read
- **THEN** all three orders are in Needs action
- **AND** the Needs action count is the same as it is with no reminder read

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-6zm rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-19 - A reminder marks no status
**Serves:** Still Waiting list - the order an operator opens after a reminder

- **GIVEN** an order that is listed in Still Waiting and posted to Slack
- **WHEN** an operator opens the Orders worklist and the order's page
- **THEN** the status, the worklist row and the page read as they do for an order the reminder does not list
- **AND** nothing on them says overdue

### Requirement: The console shows an operator the rows their grants allow

The console SHALL show an operator only the rows whose action their grants allow. What's New rows follow the page the row opens. Still Waiting rows follow the action:

| Row | Grant | Held by |
| --- | --- | --- |
| What's New, sold or unsold | Reading | `staff`, `finance`, `treasurer`, `admin` |
| Send invoice, Check proof | Payment processing | `finance`, `treasurer`, `admin` |
| Dispatch | Shipment processing | `staff`, `admin` |

A list that has no row for the operator SHALL read as empty, and SHALL NOT be a refusal.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-22e rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-20 - Finance sees invoices and proofs and not dispatches
**Serves:** grade10-admin-console-daily-reminder-US-02 - finance is not reminded about dispatch

- **GIVEN** Still Waiting orders in Preparing Invoice, Payment Verifying and Preparing Shipment, each waiting 3 days
- **WHEN** an operator holding reading and payment processing reads Still Waiting
- **THEN** the list holds the Send invoice and Check proof rows
- **AND** it holds no Dispatch row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-vpd rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-21 - Shipping staff see dispatches and not invoices
**Serves:** grade10-admin-console-daily-reminder-US-02 - shipping staff are not reminded about invoices

- **GIVEN** the same three orders
- **WHEN** an operator holding reading and shipment processing, and not payment processing, reads Still Waiting
- **THEN** the list holds the Dispatch row only

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-gjm rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-22 - An admin sees every row
**Serves:** grade10-admin-console-daily-reminder-US-02 - the operator who holds every grant reads every wait

- **GIVEN** the same three orders
- **WHEN** an admin reads Still Waiting
- **THEN** the list holds all three rows

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4ql rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-23 - A reader sees what closed and no waits
**Serves:** grade10-admin-console-daily-reminder-US-01 - an operator who can only read still learns what closed

- **GIVEN** a listing that closed yesterday and the three orders waiting 3 days
- **WHEN** an operator holding reading only reads both lists
- **THEN** What's New holds the listing's row
- **AND** Still Waiting is empty, with no refusal

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ml9 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-24 - An operator who cannot open Auction has no auction rows
**Serves:** grade10-admin-console-daily-reminder-US-01 - a vault operator is not shown auction work

- **GIVEN** listings that closed yesterday and orders waiting 3 days
- **AND** an operator whose roles do not open Auction
- **WHEN** they enter the console
- **THEN** neither list holds an auction row for them
- **AND** the daily dialog does not open

### Requirement: The daily dialog opens once on the first entry of each Hong Kong day

The console SHALL open the daily dialog over whichever page the operator lands on, once, when the operator enters, in this order:

1. The console looks for a closed mark kept in the browser for this operator and today's Hong Kong day. When it finds one, nothing opens.
2. Otherwise it reads both lists. The dialog opens when at least one list that loaded has a row for the operator.
3. The dialog shows each list that has a row, What's New first, and says so beside any list that failed to load.
4. Closing the dialog stores today's Hong Kong day as the operator's closed mark.

The mark SHALL be kept in the browser, per operator and per Hong Kong day. A browser that cannot keep it SHALL show the dialog once per tab session instead. The console SHALL check the day on entry and not while the operator works.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4zv rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-25 - The dialog opens over the page the operator lands on
**Serves:** grade10-admin-console-daily-reminder-US-01 - a link to one order does not skip the reminder

- **GIVEN** an operator with no closed mark for today, and a list with a row for them
- **WHEN** they enter the console by a link to an order's page
- **THEN** the order's page loads, and the dialog opens over it

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-5n3 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-26 - The dialog carries both lists
**Serves:** grade10-admin-console-daily-reminder-US-02 - the new and the waiting are read together

- **GIVEN** an operator with no closed mark for today, a What's New row and a Still Waiting row
- **WHEN** they enter the console
- **THEN** the dialog holds What's New and Still Waiting, in that order, each with its rows

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-qy6 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-27 - An empty list is left out of the dialog
**Serves:** grade10-admin-console-daily-reminder-US-01 - the dialog says only what there is

- **GIVEN** an operator with no closed mark for today, a What's New row and no Still Waiting row
- **WHEN** they enter the console
- **THEN** the dialog holds What's New and does not hold Still Waiting

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-81m rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-28 - Nothing for the operator, no dialog
**Serves:** grade10-admin-console-daily-reminder-US-01 - a quiet morning is not interrupted

- **GIVEN** an operator with no closed mark for today and no row in either list
- **WHEN** they enter the console
- **THEN** no dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-0so rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-29 - Closing keeps it closed for the Hong Kong day
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator is not asked twice in a day

- **GIVEN** an operator who closed the dialog at 09:00 Hong Kong time
- **WHEN** they enter the console again at 15:00 the same Hong Kong day, in the same browser
- **THEN** no dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-iu6 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-30 - The next Hong Kong day opens it again
**Serves:** grade10-admin-console-daily-reminder-US-01 - each Hong Kong morning has its own reminder

- **GIVEN** an operator who closed the dialog at 23:50 Hong Kong time, in a browser set to London
- **AND** a list with a row for them the next day
- **WHEN** they enter the console at 00:10 Hong Kong time the next day, which is still the same day in London
- **THEN** the dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-xp0 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-31 - The mark belongs to the operator
**Serves:** grade10-admin-console-daily-reminder-US-01 - a shared counter browser reminds each operator

- **GIVEN** operator A closed the dialog today in this browser
- **WHEN** operator B, with a row in a list, signs in on the same browser and enters the console
- **THEN** the dialog opens for B

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-cer rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-32 - The mark belongs to the browser
**Serves:** grade10-admin-console-daily-reminder-US-01 - no server memory of what was seen

- **GIVEN** an operator who closed the dialog today in one browser
- **WHEN** they enter the console in a second browser the same day
- **THEN** the dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-z0d rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-33 - A session across midnight checks again on the next entry
**Serves:** grade10-admin-console-daily-reminder-US-01 - the dialog never appears under the operator's hands

- **GIVEN** an operator who closed the dialog at 23:50 and keeps working past 00:00 Hong Kong time
- **WHEN** the clock passes midnight
- **THEN** no dialog opens during that session
- **AND** it opens on their next entry, if a list has a row for them

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-rzr rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-34 - Blocked storage opens it once per tab session
**Serves:** grade10-admin-console-daily-reminder-US-01 - a locked-down browser is reminded, not nagged

- **GIVEN** a browser that blocks storage, and a list with a row for the operator
- **WHEN** they enter the console, close the dialog and move to another page in the same tab
- **THEN** the dialog opened once and does not open again in that tab
- **AND** it opens in a new tab

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-5sd rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-35 - A list that fails to load says so
**Serves:** grade10-admin-console-daily-reminder-US-01 - a failure never reads as nothing waiting

- **GIVEN** What's New fails to load and Still Waiting has a row for the operator
- **WHEN** they enter the console
- **THEN** the dialog holds Still Waiting with its row
- **AND** it says What's New failed to load, and does not show it as empty

### Requirement: Today reads in three columns

Today SHALL show What's New, Still Waiting and Needs you as three columns, in that order, with the lists the dialog holds. Needs you SHALL hold the section cards it holds now, one under another, with the counts and links unchanged. What's New and Still Waiting SHALL group their rows by product, Auction first. Approvals, Recent and All sections SHALL stay below the columns, as they are. The lists SHALL be read when Today loads, when the operator comes back to the tab and on Refresh, and never on a timer.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-v91 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-36 - Three columns side by side
**Serves:** grade10-admin-console-daily-reminder-US-03 - the lists are on Today after the dialog is closed

- **GIVEN** an operator who closed the daily dialog
- **WHEN** they open Today on a wide screen
- **THEN** What's New, Still Waiting and Needs you stand side by side, in that order
- **AND** the first two hold the rows the dialog held

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ojd rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-37 - Needs you keeps its cards
**Serves:** grade10-admin-console-daily-reminder-US-03 - what needs the operator is where it was

- **GIVEN** an operator whose sections show counts today
- **WHEN** they open Today
- **THEN** the Needs you column holds the same section cards, one under another, with the same counts and links as before

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-5yn rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-38 - Rows group by product with Auction first
**Serves:** grade10-admin-console-daily-reminder-US-03 - another product adds a group and no column

- **GIVEN** auction rows in What's New and Still Waiting
- **WHEN** an operator opens Today
- **THEN** each column holds its rows under an Auction group

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-pck rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-39 - An empty list stays and says so
**Serves:** grade10-admin-console-daily-reminder-US-03 - the page does not shift between operators

- **GIVEN** an operator with no row in either list
- **WHEN** they open Today
- **THEN** all three columns show
- **AND** What's New and Still Waiting each say they have nothing for the operator

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-75f rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-40 - A list that fails to load says so on Today
**Serves:** grade10-admin-console-daily-reminder-US-03 - a failure never reads as nothing waiting

- **GIVEN** Still Waiting fails to load and What's New loads
- **WHEN** an operator opens Today
- **THEN** the Still Waiting column says it failed to load, and What's New shows its rows

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-pbn rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-41 - A row on Today opens its order or listing
**Serves:** grade10-admin-console-daily-reminder-US-03 - the operator goes from the column to the work

- **GIVEN** a sold row in What's New and an unsold row in What's New
- **WHEN** an operator follows each on Today
- **THEN** the sold row opens the winner order and the unsold row opens the listing

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-1qd rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-42 - The rest of Today stays below the columns
**Serves:** Today columns - the page below the three columns is the page the operator knows

- **GIVEN** an operator with asks to approve, recent records and sections their roles open
- **WHEN** they open Today
- **THEN** Approvals, Recent and All sections show below the three columns, with the content they show without this change

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-vn1 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-43 - Narrow screens stack the columns with Needs you last
**Serves:** grade10-admin-console-daily-reminder-US-03 - the operator on a phone reads the lists first

- **GIVEN** a narrow screen
- **WHEN** an operator opens Today
- **THEN** the columns stack in the order What's New, Still Waiting, Needs you

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-x3y rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-44 - The lists are read on arrival, on return and on Refresh only
**Serves:** grade10-admin-console-daily-reminder-US-03 - Today does not move while the operator reads

- **GIVEN** an operator reading Today
- **WHEN** 10 minutes pass with the tab in view
- **THEN** neither list is read again
- **AND** each is read again when they return to the tab after leaving it, and when they press Refresh

### Requirement: Slack posts the day's lists at 08:00 Hong Kong time

At 08:00 Hong Kong time every day, including weekends, the lists SHALL post as one message to one Slack channel:

1. Both lists are read for the Hong Kong day, with every row and not one operator's grants.
2. When both are empty, nothing posts.
3. Each list shows its first 10 rows, then a link to Today saying how many more.
4. Each row names the listing code, the lot, the outcome or the action, and whole days waited, and links to its listing or order in the console of the environment that posts. It never names the winner, and never carries a winner's email or phone.
5. A lot title longer than 60 characters is cut to no more than 60.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-kf7 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-45 - The message posts at 08:00 Hong Kong time
**Serves:** grade10-admin-console-daily-reminder-US-04 - the team starts the morning with the lists

- **GIVEN** a Saturday with a row in What's New
- **WHEN** the clock reads 07:59:59 and then 08:00:00 Hong Kong time
- **THEN** nothing has posted at 07:59:59
- **AND** one message with both lists has posted by the run that begins at 08:00:00

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-99q rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-46 - Each row links to its order or listing
**Serves:** grade10-admin-console-daily-reminder-US-04 - the team opens the work from the channel

- **GIVEN** a sold row, an unsold row and a Still Waiting row, posted from staging
- **WHEN** the message posts
- **THEN** each row links to its order's page or its listing's page on the staging console
- **AND** no row links to the production console

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-oce rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-47 - The message carries every row
**Serves:** grade10-admin-console-daily-reminder-US-04 - a shared channel cannot be scoped to one operator

- **GIVEN** a Send invoice row, a Check proof row and a Dispatch row
- **WHEN** the message posts
- **THEN** all three rows are in it

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-alf rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-48 - No winner name, email or phone reaches the channel
**Serves:** grade10-admin-console-daily-reminder-US-04 - the link carries the identity

- **GIVEN** a sold row and a Send invoice row whose winners have a name, an email and a phone
- **WHEN** the message posts
- **THEN** none of the three appears anywhere in the post, links and notification text included

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4d8 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-49 - A row names its outcome or action and whole days
**Serves:** grade10-admin-console-daily-reminder-US-04 - the team reads what each row asks

- **GIVEN** a sold lot, an unsold lot, and a Dispatch order that has waited 3 days 5 hours
- **WHEN** the message posts
- **THEN** the rows read Sold, Unsold and Dispatch with 3 days
- **AND** each row names its listing code and lot

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-odp rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-50 - A long lot title is cut to 60 characters
**Serves:** grade10-admin-console-daily-reminder-US-04 - one long title does not fill the channel

- **GIVEN** a lot whose title is 61 characters, and one whose title is 60
- **WHEN** the message posts
- **THEN** the first title shows in no more than 60 characters
- **AND** the second shows whole

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-oxw rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-51 - A list of 10 posts whole
**Serves:** grade10-admin-console-daily-reminder-US-04 - a short list needs no link

- **GIVEN** 10 Still Waiting rows
- **WHEN** the message posts
- **THEN** all 10 rows are in it
- **AND** it carries no link to Today for more

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-nyt rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-52 - A longer list stops at 10 and says how many more
**Serves:** grade10-admin-console-daily-reminder-US-04 - the channel stays readable

- **GIVEN** 25 Still Waiting rows and 11 What's New rows
- **WHEN** the message posts
- **THEN** Still Waiting shows its first 10 rows, longest wait first, then a link to Today saying 15 more
- **AND** What's New shows its first 10 rows, then a link to Today saying 1 more

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4mh rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-53 - A quiet day posts nothing
**Serves:** Slack message - the 08:00 run that finds both lists empty

- **GIVEN** no row in either list at 08:00 Hong Kong time
- **WHEN** the runs go on through that Hong Kong day
- **THEN** nothing posts

### Requirement: A failed send is tried again the same day and never posts twice

When the post fails, it SHALL be tried again through the same Hong Kong day, and each failed attempt SHALL be logged as an error naming the day and the reason. The day's message SHALL post once at most. A message that did not post by midnight Hong Kong time SHALL NOT post on the next day. Each attempt SHALL read the lists as they stand.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-s95 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-54 - A failed send is tried again and posts once
**Serves:** grade10-admin-console-daily-reminder-US-04 - a Slack outage at 08:00 does not lose the morning

- **GIVEN** Slack refuses the post at 08:00 and accepts it at 08:05
- **WHEN** the runs go on from 08:00 to 08:10
- **THEN** one message has posted, at 08:05

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-fbm rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-55 - A day's message never posts twice
**Serves:** Slack message - runs that overlap or repeat

- **GIVEN** the day's message has posted
- **WHEN** further runs follow, or two run at once, through the rest of that Hong Kong day
- **THEN** no second message posts

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-6kr rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-56 - Each failed attempt is logged as an error
**Serves:** Slack message - the run that cannot reach Slack

- **GIVEN** Slack refuses three attempts in a row
- **WHEN** the runs go on
- **THEN** an error is logged for each attempt, naming the Hong Kong day and Slack's reason

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-07a rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-57 - A message that missed its day is not posted the next day
**Serves:** Slack message - the run after midnight

- **GIVEN** Slack refused every attempt on Monday 12 October
- **WHEN** the runs go on Tuesday 13 October before 08:00 Hong Kong time
- **THEN** nothing posts for Monday
- **AND** Tuesday's message posts at 08:00, naming Tuesday's lists

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ogm rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-58 - A retry reads the lists as they stand
**Serves:** grade10-admin-console-daily-reminder-US-04 - the channel is not told of work already done

- **GIVEN** Slack refused the 08:00 post, and the Dispatch order in it was dispatched at 09:00
- **WHEN** Slack accepts the retry at 10:00
- **THEN** the message does not list that order

### Requirement: The channel and token come from the environment

The Slack access token and the channel SHALL be set per environment, so staging and production can differ, and never from the console. When either is not set, nothing SHALL post.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-hb6 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-59 - The post goes to the environment's channel
**Serves:** Slack message - staging and production post to their own channels

- **GIVEN** staging configured with one channel and token and production with another
- **WHEN** each posts its message
- **THEN** each uses its own token and channel

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-f3g rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-60 - Without a token or a channel nothing posts and the log says so
**Serves:** Slack message - an environment with no Slack set up

- **GIVEN** an environment with no token, or no channel, or neither
- **WHEN** the 08:00 Hong Kong time run happens
- **THEN** nothing posts
- **AND** the log says the reminder is not configured
