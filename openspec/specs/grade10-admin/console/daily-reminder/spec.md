# grade10-admin/console/daily-reminder Specification

## Purpose

Reminds an operator which listings closed yesterday and which orders are
flagged or still waiting on them, in a dialog until they close it for the day,
in three columns on Today and in a Slack message each morning. Auction also
posts once to the same Slack channel when a listing goes live, ends or is
extended, and when an order becomes overdue or is flagged, without holding the
bid or order path.

## Feature set

- What's New list
  - Closed listings: each listing that closed on the previous Hong Kong day has one row
  - Row by outcome: a sold listing opens its winner order, an unsold one opens the listing
- Still Waiting list
  - Waiting orders: each order that has waited 48 hours for an invoice, a proof check or a dispatch has one row
  - Longest first: the oldest wait leads, and it stays listed until the order moves on
  - Not a status: the list marks no status, worklist row or order page
  - Flagged orders: an open payment flag does not remove an order from the list
- Flagged or still waiting list
  - Flagged orders: each order with an open payment flag has one row at the top, any age, with the flag reason and wait from the earliest open flag
  - Waiting orders: each unflagged order that has waited 48 hours for an invoice, a proof check or a dispatch has one row under the flagged rows
  - Longest first among waits: the oldest wait leads among non-flagged rows, and equal waits by listing code
  - One row: a flagged order is never also a wait row
  - Not a status: the list marks no status, worklist row or order page
  - Overdue alone: Setup Overdue and Payment Overdue are not listed unless also flagged
  - Warning title: the list title carries a warning mark; its caption and daily Slack heading read Something wrong or waiting a while, needing your action
- Row access
  - By grant: the console shows an operator only the rows whose action their grants allow
  - Empty lists: an empty list is left out of the dialog and said so on Today
- Daily dialog
  - Until closed: opens over the page the operator lands on, on each entry with a row or a failed list, until they close it that Hong Kong day
  - Closed mark: kept in the browser per operator and Hong Kong day, cleared at sign-out, and once per page load where storage is blocked
  - Failed read: a list that fails to load says so and never reads as empty
  - Long lists: each product's list scrolls inside itself past about four and a half rows
- Today columns
  - Three columns: What's New, Flagged or still waiting and Needs you side by side
  - Product groups: each list groups its rows by product, Auction first, the first with rows opened and one open at a time; a product with no rows says Nothing yet
  - Rest of Today: Approvals leaves the Needs you column and sits below with Recent and All sections
  - One height: the three columns stand at one height, and an opened group fills its column and scrolls
- Slack message
  - Daily post: each product posts its own lists to its own channel at 08:00 Hong Kong time every day
  - Row links: each row links to its listing or order in the console
  - Shared content: every row, with no winner name, email or phone
  - Quiet and long: nothing posts on an empty day, and each list stops at 10 rows
  - One attempt: the message is sent once; a failure is logged and not retried
  - Message form: whole days waited, a cut title and no link previews
  - Environment setup: the channel and token come from the environment, and a missing one is logged
- Slack daily message
  - Daily post: each product posts its own lists to its own channel at 08:00 Hong Kong time every day
  - Row links: each row links to its listing or order in the console
  - Shared content: every row, with no winner name, email or phone
  - Quiet and long: nothing posts on an empty day, and each list stops at 10 rows
  - One attempt: the message is sent once; a failure is logged and not retried
  - Message form: whole days waited, a cut title and no link previews
  - Environment setup: the channel and bot token come from the environment; both must be non-empty before any send
  - Bypass when unset: if the bot token or the channel is missing or empty, skip the send, log that the reminder is not configured, and leave the 08:00 run and every other usual path untouched
- Slack lifecycle alerts
  - Listing go live: one message with start time when bidding opens, whether the scheduled start was waited for or already due at publish
  - Listing ended: one message with the end time, including any extension
  - Listing extended: one message with how long it was extended in whole minutes rounded down, and the new end time
  - Order overdue: one warning message when an order becomes Setup Overdue or Payment Overdue
  - Order flagged: one warning message with the flag reason when an order is flagged
  - Same channel: Auction's daily reminder channel and token; both must be non-empty before any send
  - Bypass when unset: if the bot token or the channel is missing or empty, skip the send, log not configured, and leave the usual path untouched
  - Best effort, last step: posting runs only after the usual bid, close, extension, overdue or flag step has completed; it must not delay or refuse that step; a miss or failure is logged and not retried
  - Once: each transition posts once; staying overdue or flagged does not post again
  - No customer names: no winner name, email or phone; each message links to the listing or order

## Requirements

### Requirement: What's New lists the listings that closed on the previous Hong Kong day

What's New SHALL list each listing that closed on the previous Hong Kong day, latest close first, one row per listing. The day is the Hong Kong calendar day, whatever zone the operator's browser is in; a listing that closed at 00:00:00 Hong Kong time belongs to the day it began. A listing called off before its close SHALL NOT be listed, and a listing that closed with no bid is Unsold. The row follows the listing's outcome:

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

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-bz8 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-61 - A listing that closed with no bid is Unsold
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator sees a lot that found no buyer

- **GIVEN** a listing that closed yesterday with no bid placed on it
- **WHEN** an operator who may open it reads What's New
- **THEN** the listing has one Unsold row, showing its code and its lot
- **AND** the row opens the listing

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-xxl rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-62 - A listing called off before its close is not listed
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator is not told of a lot that never closed

- **GIVEN** a listing that was called off yesterday before its scheduled close
- **WHEN** an operator who may open listings reads What's New
- **THEN** the listing has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-qq1 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-77 - Equal closes list by listing code
**Serves:** grade10-admin-console-daily-reminder-US-01 - the same listings read in the same order every time

- **GIVEN** three listings that closed at the same instant yesterday, coded AU-1003, AU-1001 and AU-1002
- **WHEN** What's New is read twice
- **THEN** both reads list AU-1001, AU-1002, AU-1003

### Requirement: Still Waiting lists the orders that have waited 48 hours for an operator action

Flagged or still waiting SHALL list every order with an open payment flag,
any status and any age, then each unflagged order that has waited 48 hours
or more in one of three statuses. Flagged rows lead, oldest open flag first,
then listing code; among waits, longest wait first, and equal waits by
listing code, A to Z. A flagged order SHALL have one flagged row and SHALL
NOT also appear as a wait row. Setup Overdue and Payment Overdue SHALL NOT
be listed unless the order is also flagged. The wait for a flagged row
counts from the earliest open flag; the wait for a waiting row counts from
the clock the worklist names under Waited since for that status:

| Row says | When | Waited since |
| --- | --- | --- |
| Flagged, with the flag reason | Any open payment flag | The earliest open flag |
| Send invoice | Preparing Invoice for 48 hours or more, and not flagged | The winner's setup confirmation |
| Check proof | Payment Verifying for 48 hours or more, and not flagged | The winner's latest proof |
| Dispatch | Preparing Shipment for 48 hours or more, and not flagged | The payment that paid it |

An unflagged waiting order SHALL be listed from the instant 48 hours have
elapsed and on every day after, until it leaves the status or is flagged. A
flagged row stays until every flag is cleared. A row shows the listing code,
the lot, the winner (in the console), the action or flag reason, and how long
it has waited in days and hours, as `3d 5h`, and `5d` on a whole day, and
opens the order.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-v0i rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-08 - An invoice not sent for 48 hours is listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - an order awaiting an invoice is not forgotten

- **GIVEN** an unflagged order in Preparing Invoice whose winner confirmed setup 3 days 5 hours ago
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the list holds a Send invoice row for the order, showing the listing code, the lot, the winner and the wait as 3d 5h

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-q0x rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-09 - A proof not checked for 48 hours is listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - a proof waiting to be checked is not forgotten

- **GIVEN** an unflagged order in Payment Verifying whose winner uploaded the proof 50 hours ago
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the list holds a Check proof row for the order

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-06a rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-10 - The proof clock is the latest proof
**Serves:** grade10-admin-console-daily-reminder-US-02 - a winner who uploads again restarts the wait

- **GIVEN** an unflagged order in Payment Verifying whose winner uploaded a first proof 5 days ago and a second proof 10 hours ago
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-bs5 rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-11 - A card not dispatched for 48 hours is listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - a paid order awaiting dispatch is not forgotten

- **GIVEN** an unflagged order in Preparing Shipment whose invoice was paid 5 days 2 hours ago
- **WHEN** an operator with shipment processing reads Flagged or still waiting
- **THEN** the list holds a Dispatch row for the order, showing the wait as 5d 2h

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-r85 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-12 - Exactly 48 hours is listed and one second less is not
**Serves:** grade10-admin-console-daily-reminder-US-02 - the threshold is elapsed time

- **GIVEN** at 09:00:00 two unflagged orders in Preparing Invoice, whose setup was confirmed at 09:00:00 two days earlier and at 09:00:01 two days earlier
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the first order has a row and the second has none

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-b1n rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-13 - The longest wait leads across the three actions
**Serves:** grade10-admin-console-daily-reminder-US-02 - the oldest job is read first

- **GIVEN** an unflagged Dispatch order that has waited 5 days, a Send invoice order that has waited 3 days and a Check proof order that has waited 4 days
- **AND** an operator holding payment processing and shipment processing
- **WHEN** they read Flagged or still waiting
- **THEN** the rows read Dispatch, Check proof, Send invoice

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-89a rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-14 - An order stays listed every day until it moves on
**Serves:** grade10-admin-console-daily-reminder-US-02 - an order nobody got to is listed again tomorrow

- **GIVEN** an unflagged order in Preparing Invoice that has waited 3 days
- **WHEN** an operator with payment processing reads Flagged or still waiting on that day and on the next
- **THEN** the order has a row on both days
- **AND** once the invoice is sent, the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-n5c rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-15 - No other status is listed however long it waits
**Serves:** grade10-admin-console-daily-reminder-US-02 - Needs you keeps counting the overdue and the waiting on winner

- **GIVEN** unflagged orders that have each waited 5 days in Awaiting Setup, Setup Overdue, Pending Payment, Payment Overdue, Partially Paid, Shipped and Delivered
- **WHEN** an operator holding every grant reads Flagged or still waiting
- **THEN** none of those orders has a row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-x5d rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-16 - A flagged order is listed by its own wait
**Serves:** grade10-admin-console-daily-reminder-US-05 - a fresh flag is not hidden behind the 48-hour wait

- **GIVEN** an order in Preparing Shipment that was paid 5 days ago and holds a payment flag nobody has cleared, raised 1 hour ago, with reason Overpaid
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the list holds one Flagged row for the order, showing Overpaid and the wait from the flag as 1h
- **AND** it holds no Dispatch row for the same order

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-juj rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-17 - A row opens its order
**Serves:** grade10-admin-console-daily-reminder-US-02 - the operator goes from the reminder to the work

- **GIVEN** a Send invoice row
- **WHEN** an operator follows it
- **THEN** that order's page opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-hsd rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-63 - A flag does not start a second clock
**Serves:** grade10-admin-console-daily-reminder-US-02 - an unflagged short wait is not listed

- **GIVEN** an unflagged order in Preparing Shipment that was paid 10 hours ago
- **WHEN** an operator with shipment processing reads Flagged or still waiting
- **THEN** the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-tvq rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-64 - Equal waits list by listing code
**Serves:** grade10-admin-console-daily-reminder-US-02 - two orders with one wait read in a fixed order

- **GIVEN** three unflagged Send invoice orders whose setup was confirmed at the same instant 3 days ago, for listings AU-1042, AU-1007 and AU-1019
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the rows read AU-1007, AU-1019, AU-1042


<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a99 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-99 - Flagged rows lead the waits
**Serves:** grade10-admin-console-daily-reminder-US-05 - a flag is read before forgotten jobs

- **GIVEN** a flagged order raised 2 hours ago and an unflagged Send invoice order that has waited 5 days
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the flagged row is first and the Send invoice row follows

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-b00 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-100 - Setup Overdue alone is not listed
**Serves:** grade10-admin-console-daily-reminder-US-02 - overdue stays in Needs you unless flagged

- **GIVEN** an unflagged order in Setup Overdue for 5 days
- **WHEN** an operator holding every grant reads Flagged or still waiting
- **THEN** the order has no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-b01 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-101 - A flagged overdue order is listed as flagged
**Serves:** grade10-admin-console-daily-reminder-US-05 - an overdue order that is also flagged sits under Flagged

- **GIVEN** an order in Payment Overdue that holds an open payment flag raised today
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the list holds one Flagged row for the order
- **AND** it does not list the order as overdue

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-x4b rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-103 - Several open flags show the earliest reason and wait
**Serves:** grade10-admin-console-daily-reminder-US-05 - the flag that started the wait is the one the row names

- **GIVEN** an order with two open payment flags, the earlier raised 30 hours ago with reason Underpaid and the later raised 2 hours ago with reason Overpaid
- **WHEN** an operator with payment processing reads Flagged or still waiting
- **THEN** the flagged row shows Underpaid and a wait about 30 hours
- **AND** it does not show Overpaid as the row's reason

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-uoi rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-104 - Clearing every flag leaves a past-48-hour wait row
**Serves:** grade10-admin-console-daily-reminder-US-05 - a cleared flag that still needs work stays on the list

- **GIVEN** a flagged order that has also waited 49 hours in Preparing Invoice, and an operator on Today
- **WHEN** every open payment flag is cleared and the lists are read again
- **THEN** Flagged or still waiting holds one Send invoice wait row for the order
- **AND** it holds no flagged row for that order

### Requirement: The lists agree with Needs you and mark nothing

Every Flagged or still waiting row SHALL be an order the Orders worklist lists under Needs action, and the Needs you counts SHALL be unchanged by the lists. Reading either list, or posting it to Slack, SHALL NOT change any order status, worklist row, order page or listing, and no screen SHALL carry the word overdue because of it.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-no9 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-18 - Still Waiting is inside Needs action
**Serves:** Flagged or still waiting list - the worklist and the reminder derive one status

- **GIVEN** one order in each of Preparing Invoice, Payment Verifying and Preparing Shipment, each waiting 3 days, and no flag
- **WHEN** Flagged or still waiting and the Orders worklist's Needs action are read
- **THEN** all three orders are in Needs action
- **AND** the Needs action count is the same as it is with no reminder read

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-6zm rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-19 - A reminder marks no status
**Serves:** Flagged or still waiting list - the order an operator opens after a reminder

- **GIVEN** an order that is listed in Flagged or still waiting and posted to Slack
- **WHEN** an operator opens the Orders worklist and the order's page
- **THEN** the status, the worklist row and the page read as they do for an order the reminder does not list
- **AND** nothing on them says overdue

### Requirement: The console shows an operator the rows their grants allow

The console SHALL show an operator only the rows whose action their grants
allow. What's New rows follow the page the row opens, and reading access
opens a listing, so an Unsold row needs no more than reading. Flagged or
still waiting rows follow the action:

| Row | Grant | Held by |
| --- | --- | --- |
| What's New, sold or unsold | Reading | `staff`, `finance`, `treasurer`, `admin` |
| Flagged | Payment processing | `finance`, `treasurer`, `admin` |
| Send invoice, Check proof | Payment processing | `finance`, `treasurer`, `admin` |
| Dispatch | Shipment processing | `staff`, `admin` |

A list that has no row for an operator who holds reading SHALL read as empty,
and SHALL NOT be a refusal. A caller who holds no auction access SHALL be
refused, and the console SHALL NOT ask for an operator whose roles do not
open Auction.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-22e rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-20 - Finance sees invoices and proofs and not dispatches
**Serves:** grade10-admin-console-daily-reminder-US-02 - finance is not reminded about dispatch

- **GIVEN** Flagged or still waiting orders in Preparing Invoice, Payment Verifying and Preparing Shipment, each waiting 3 days and unflagged, and one flagged order
- **WHEN** an operator holding reading and payment processing reads Flagged or still waiting
- **THEN** the list holds the Flagged, Send invoice and Check proof rows
- **AND** it holds no Dispatch row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-vpd rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-21 - Shipping staff see dispatches and not invoices
**Serves:** grade10-admin-console-daily-reminder-US-02 - shipping staff are not reminded about invoices

- **GIVEN** the same three waiting orders and the flagged order
- **WHEN** an operator holding reading and shipment processing, and not payment processing, reads Flagged or still waiting
- **THEN** the list holds the Dispatch row only

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-gjm rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-22 - An admin sees every row
**Serves:** grade10-admin-console-daily-reminder-US-02 - the operator who holds every grant reads every wait and flag

- **GIVEN** the same three waiting orders and the flagged order
- **WHEN** an admin reads Flagged or still waiting
- **THEN** the list holds all four rows

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4ql rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-23 - A reader sees what closed and no waits
**Serves:** grade10-admin-console-daily-reminder-US-01 - an operator who can only read still learns what closed

- **GIVEN** a listing that sold and a listing that closed unsold yesterday, the three orders waiting 3 days, and a flagged order
- **WHEN** an operator holding reading only reads both lists
- **THEN** What's New holds both rows, and the unsold row opens the listing
- **AND** Flagged or still waiting is empty, with no refusal

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ml9 rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-24 - An operator who cannot open Auction is not shown auction rows
**Serves:** grade10-admin-console-daily-reminder-US-01 - a vault operator is not shown auction work

- **GIVEN** listings that closed yesterday and orders waiting 3 days
- **AND** an operator whose roles do not open Auction
- **WHEN** they enter the console
- **THEN** the console reads neither list for them
- **AND** the daily dialog does not open

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-b5m rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-65 - A caller with no auction access is refused
**Serves:** Row access - a read that is not the operator's to make

- **GIVEN** a caller who holds no auction access
- **WHEN** they ask for What's New or for Flagged or still waiting
- **THEN** each read is refused and returns no row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-e3n rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-76 - The console lists every row
**Serves:** grade10-admin-console-daily-reminder-US-02 - an operator sees every forgotten job

- **GIVEN** an operator holding payment processing and 14 orders that have waited 48 hours or more to have an invoice sent
- **WHEN** they open Today and the dialog
- **THEN** Flagged or still waiting shows all 14 rows in each place

### Requirement: The daily dialog opens on each entry until the operator closes it that Hong Kong day

An entry is a full page load of the console by a signed-in operator, or a sign-in that finishes on a console page; returning to the tab and moving between pages are not entries. On each entry the console SHALL decide whether to open the daily dialog over whichever page the operator lands on, in this order:

1. The console looks for a closed mark kept in the browser for this operator and today's Hong Kong day. When it finds one, nothing opens.
2. Otherwise it reads both lists. The dialog opens when at least one list that loaded has a row for the operator, or when a list failed to load.
3. The dialog shows each list that has a row, What's New first, then Flagged or still waiting with a warning mark beside its heading, and says so beside any list that failed to load, with a Retry. A list that loaded with no row is left out.
4. Closing the dialog by its close control, by Escape, by a click outside it, or by following a row, stores today's Hong Kong day as the operator's closed mark. An entry that opens nothing stores no mark.

The mark SHALL be kept in the browser, per operator and per Hong Kong day, and SHALL be cleared when the operator signs out. Another browser keeps its own. A browser that keeps nothing between page loads SHALL show the dialog once per page load instead. Each product's list in the dialog SHALL show about four and a half rows and scroll the rest inside itself, fading the edge that has more beyond it, so the dialog keeps its size however many rows there are. The dialog reads the lists when it opens and SHALL NOT read them again while it stays open. The console SHALL check the day on entry and not while the operator works.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4zv rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-25 - The dialog opens over the page the operator lands on
**Serves:** grade10-admin-console-daily-reminder-US-01 - a link to one order does not skip the reminder

- **GIVEN** an operator with no closed mark for today, and a list with a row for them
- **WHEN** they enter the console by a link to an order's page
- **THEN** the order's page loads, and the dialog opens over it

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-n4k rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-66 - A deep link while signed out opens the dialog after sign-in
**Serves:** grade10-admin-console-daily-reminder-US-01 - a link followed before signing in does not skip the reminder

- **GIVEN** a signed-out operator with no closed mark for today, and a list with a row for them
- **WHEN** they follow a link to an order's page, sign in, and the page loads
- **THEN** the dialog opens over the order's page once they are signed in
- **AND** it did not open over the sign-in page

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-5n3 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-26 - The dialog carries both lists
**Serves:** grade10-admin-console-daily-reminder-US-02 - the new and the waiting are read together

- **GIVEN** an operator with no closed mark for today, a What's New row and a Flagged or still waiting row
- **WHEN** they enter the console
- **THEN** the dialog holds What's New and Flagged or still waiting, in that order, each with its rows
- **AND** Flagged or still waiting's heading carries a warning mark

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-qy6 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-27 - An empty list is left out of the dialog
**Serves:** grade10-admin-console-daily-reminder-US-01 - the dialog says only what there is

- **GIVEN** an operator with no closed mark for today, a What's New row and no Flagged or still waiting row
- **WHEN** they enter the console
- **THEN** the dialog holds What's New and does not hold Flagged or still waiting

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-81m rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-28 - Nothing for the operator, no dialog
**Serves:** grade10-admin-console-daily-reminder-US-01 - a quiet morning is not interrupted

- **GIVEN** an operator with no closed mark for today and no row in either list
- **WHEN** they enter the console
- **THEN** no dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-2u2 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-67 - An entry with nothing sets no mark, so a later entry with rows opens it
**Serves:** grade10-admin-console-daily-reminder-US-01 - the day's first real row is not held back until tomorrow

- **GIVEN** an operator who entered the console at 08:30 with no row in either list, so no dialog opened
- **AND** an order that reached 48 hours in Preparing Invoice at 11:00 the same Hong Kong day
- **WHEN** they load the console again at 14:00
- **THEN** the dialog opens with that order's Send invoice row

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-0so rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-29 - Closing keeps it closed for the Hong Kong day
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator is not asked twice in a day

- **GIVEN** an operator who closed the dialog at 09:00 Hong Kong time
- **WHEN** they load the console again at 15:00 the same Hong Kong day, in the same browser
- **THEN** no dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-74n rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-68 - Escape and a click outside close it and keep it closed
**Serves:** grade10-admin-console-daily-reminder-US-01 - every ordinary way out of the dialog counts as closing it

- **GIVEN** an operator with a row in a list on two Hong Kong days, who closes the dialog with Escape on the first and with a click outside it on the second
- **WHEN** they load the console again later on each day
- **THEN** no dialog opens on either day

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-pxi rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-69 - Following a row closes it and keeps it closed
**Serves:** grade10-admin-console-daily-reminder-US-01 - a row followed through the dialog does not leave it open over the order

- **GIVEN** the dialog open with a Send invoice row
- **WHEN** the operator follows the row
- **THEN** the order's page opens with the dialog closed
- **AND** loading the console again the same Hong Kong day opens no dialog

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-iu6 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-30 - The next Hong Kong day opens it again
**Serves:** grade10-admin-console-daily-reminder-US-01 - each Hong Kong morning has its own reminder

- **GIVEN** an operator who closed the dialog at 23:50 Hong Kong time, in a browser set to London
- **AND** a list with a row for them the next day
- **WHEN** they enter the console at 00:10 Hong Kong time the next day, which is still the same day in London
- **THEN** the dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-xp0 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-31 - The mark belongs to the operator
**Serves:** grade10-admin-console-daily-reminder-US-01 - a shared counter browser reminds each operator

- **GIVEN** operator A closed the dialog today in this browser
- **WHEN** operator B, with a row in a list, signs in on the same browser and enters the console
- **THEN** the dialog opens for B

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-cer rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-32 - The mark belongs to the browser
**Serves:** grade10-admin-console-daily-reminder-US-01 - no server memory of what was seen

- **GIVEN** an operator who closed the dialog today in one browser
- **WHEN** they enter the console in a second browser the same day
- **THEN** the dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-z0d rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-33 - A session across midnight checks again on the next entry
**Serves:** grade10-admin-console-daily-reminder-US-01 - the dialog never appears under the operator's hands

- **GIVEN** an operator who closed the dialog at 23:50 and keeps working past 00:00 Hong Kong time
- **WHEN** the clock passes midnight
- **THEN** no dialog opens during that session
- **AND** it opens on their next entry, if a list has a row for them

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-wmh rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-70 - Signing out clears the closed mark
**Serves:** grade10-admin-console-daily-reminder-US-01 - signing in again starts the day's reminder again

- **GIVEN** an operator who closed the dialog at 09:00 Hong Kong time, and a list with a row for them
- **WHEN** they sign out and sign in again in the same browser at 10:00 the same day
- **THEN** the dialog opens

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-rzr rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-34 - A browser that keeps nothing opens it once per page load
**Serves:** grade10-admin-console-daily-reminder-US-01 - a locked-down browser is reminded, not nagged

- **GIVEN** a browser that keeps nothing between page loads, and a list with a row for the operator
- **WHEN** they enter the console, close the dialog and move to another page without reloading
- **THEN** the dialog opened once and does not open again on that page load
- **AND** it opens again when they reload the page

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-5sd rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-35 - A list that fails to load says so
**Serves:** grade10-admin-console-daily-reminder-US-01 - a failure never reads as nothing waiting

- **GIVEN** What's New fails to load and Flagged or still waiting has a row for the operator
- **WHEN** they enter the console
- **THEN** the dialog holds Flagged or still waiting with its row
- **AND** it says What's New failed to load, with a Retry, and does not show it as empty

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-gxz rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-71 - A failed list opens the dialog even when the other list is empty
**Serves:** grade10-admin-console-daily-reminder-US-01 - a failed read never leaves the operator with a quiet morning

- **GIVEN** an operator with no closed mark for today, Flagged or still waiting failing to load and no row in What's New
- **WHEN** they enter the console
- **THEN** the dialog opens, saying Flagged or still waiting failed to load, with a Retry
- **AND** pressing Retry reads Flagged or still waiting again and shows its rows, or says again that it failed

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-k4n rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-72 - The dialog reads when it opens and has no Refresh
**Serves:** grade10-admin-console-daily-reminder-US-01 - the dialog is a snapshot of the morning

- **GIVEN** the dialog open with a Send invoice row
- **WHEN** 10 minutes pass, and the operator leaves the tab and comes back to it
- **THEN** neither list is read again
- **AND** the dialog carries no Refresh

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-3gx rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-79 - A session that ends elsewhere keeps the closed mark
**Serves:** grade10-admin-console-daily-reminder-US-01 - the mark follows the browser, not the session

- **GIVEN** an operator who closed the dialog at 09:00 Hong Kong time, and whose session then expires
- **WHEN** they sign in again in the same browser at 10:00 the same day
- **THEN** the dialog does not open
- **AND** it opens on the next Hong Kong day when a list has a row for them

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-czj rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-81 - A click that opens a row in a new tab leaves the dialog open
**Serves:** grade10-admin-console-daily-reminder-US-01 - the operator can read the order beside the reminder

- **GIVEN** the dialog is open with a Dispatch row
- **WHEN** the operator middle-clicks the row, or clicks it with Ctrl or Cmd held
- **THEN** the order opens in a new tab
- **AND** the dialog stays open and the day's mark is not set

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-fyh rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-82 - A long list scrolls inside the dialog
**Serves:** grade10-admin-console-daily-reminder-US-02 - the dialog stays on the screen however much is waiting

- **GIVEN** nine Flagged or still waiting rows for the operator
- **WHEN** the dialog opens
- **THEN** the Auction list shows about four and a half rows, and the rest scroll inside the list with its bottom edge faded
- **AND** the dialog keeps its size and its close control stays in view

### Requirement: Today reads in three columns

Today SHALL show What's New, Flagged or still waiting and Needs you as three
columns, in that order, with the lists the dialog holds. Flagged or still
waiting's title SHALL carry a warning mark, and its caption SHALL read
Something wrong or waiting a while, needing your action. Needs you SHALL
hold the section cards it holds now, one under another, with the counts and
links unchanged. What's New and Flagged or still waiting SHALL group their
rows by product, Auction first, then Store, Consignment, Inventory and
Appointments for each the operator can open; a product with no row SHALL
show as one line saying Nothing yet. The first group with rows SHALL start
opened and every other group SHALL show as one line with its product and
count; a group's chevron SHALL open it and fold it back, and opening one
group SHALL fold the group open in the same column. The three columns SHALL
stand at one height, set by the taller of Needs you and an opened group, and
an opened group SHALL fill the rest of its column, never under about five
and a half rows, and scroll its rows inside itself, fading the edge that has
more beyond it. A list that fails to load SHALL say so in its own column,
with a Retry. The Approvals card SHALL leave the Needs you column and sit
with the Recent and All sections under the three columns, otherwise
unchanged. Today's Refresh SHALL read all three columns again. The lists
SHALL also be read when Today loads and when the operator comes back to the
tab, and never on a timer.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-v91 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-36 - Three columns side by side
**Serves:** grade10-admin-console-daily-reminder-US-03 - the lists are on Today after the dialog is closed

- **GIVEN** an operator who closed the daily dialog
- **WHEN** they open Today on a wide screen
- **THEN** What's New, Flagged or still waiting and Needs you stand side by side, in that order
- **AND** Flagged or still waiting's title carries a warning mark
- **AND** its caption reads Something wrong or waiting a while, needing your action
- **AND** the first two hold the rows the dialog held

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ojd rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-37 - Needs you keeps its section cards
**Serves:** grade10-admin-console-daily-reminder-US-03 - what needs the operator is where it was

- **GIVEN** an operator whose sections show counts today
- **WHEN** they open Today
- **THEN** the Needs you column holds the same section cards, one under another, with the same counts and links as before
- **AND** the Approvals card is not in that column

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-5yn rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-38 - Rows group by product with Auction first
**Serves:** grade10-admin-console-daily-reminder-US-03 - another product adds a group and no column

- **GIVEN** auction rows in What's New and Flagged or still waiting
- **WHEN** an operator opens Today
- **THEN** each column holds its rows under an Auction group

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-pck rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-39 - An empty list stays and says so
**Serves:** grade10-admin-console-daily-reminder-US-03 - the page does not shift between operators

- **GIVEN** an operator with no row in either list
- **WHEN** they open Today
- **THEN** all three columns show
- **AND** What's New says No listing closed yesterday.
- **AND** Flagged or still waiting says Nothing flagged or waiting too long.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-75f rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-40 - A list that fails to load says so on Today
**Serves:** grade10-admin-console-daily-reminder-US-03 - a failure never reads as nothing waiting

- **GIVEN** Flagged or still waiting fails to load and What's New loads
- **WHEN** an operator opens Today
- **THEN** the Flagged or still waiting column says it failed to load, with a Retry, and What's New shows its rows

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-pbn rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-41 - A row on Today opens its order or listing
**Serves:** grade10-admin-console-daily-reminder-US-03 - the operator goes from the column to the work

- **GIVEN** a sold row in What's New and an unsold row in What's New
- **WHEN** an operator follows each on Today
- **THEN** the sold row opens the winner order and the unsold row opens the listing

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-1qd rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-42 - Approvals and the rest of Today sit below the columns
**Serves:** Today columns - the page below the three columns is the page the operator knows

- **GIVEN** an operator with asks to approve, recent records and sections their roles open
- **WHEN** they open Today
- **THEN** the Approvals card, Recent and All sections show below the three columns, and the Approvals card shows what it shows without this change

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-vn1 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-43 - Narrow screens stack the columns with Needs you last
**Serves:** grade10-admin-console-daily-reminder-US-03 - the operator on a phone reads the lists first

- **GIVEN** a narrow screen
- **WHEN** an operator opens Today
- **THEN** the columns stack in the order What's New, Flagged or still waiting, Needs you

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-x3y rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-44 - The lists are read on arrival, on return and on Refresh only
**Serves:** grade10-admin-console-daily-reminder-US-03 - Today does not move while the operator reads

- **GIVEN** an operator reading Today
- **WHEN** 10 minutes pass with the tab in view
- **THEN** no list is read again
- **AND** all three columns are read again when they return to the tab after leaving it, and when they press Refresh

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-jr3 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-80 - Approvals still count in the Needs you total
**Serves:** grade10-admin-console-daily-reminder-US-03 - Today's totals say what they said before

- **GIVEN** two Approvals asks and an Auction card with 3 orders
- **WHEN** Today loads
- **THEN** the Needs you total and the summary sentence both count the two asks

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ihf rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-83 - The first product with rows starts opened on Today
**Serves:** grade10-admin-console-daily-reminder-US-03 - the operator reads the rows without a click

- **GIVEN** three What's New rows and nine Flagged or still waiting rows for the operator, all auction's
- **WHEN** Today loads
- **THEN** each column shows Auction opened, with its rows and a chevron up
- **AND** pressing the chevron folds Auction to one line with its count, and pressing it again opens it

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-xl4 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-84 - One group opens at a time in a column
**Serves:** grade10-admin-console-daily-reminder-US-03 - an opened list takes the column

- **GIVEN** Flagged or still waiting holds rows from two products, the first opened
- **WHEN** the operator opens the second with its chevron
- **THEN** the second opens and the first folds to one line with its count

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-yio rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-85 - The columns stand at one height and an opened group fills its column
**Serves:** grade10-admin-console-daily-reminder-US-03 - a long list never stretches Today

- **GIVEN** a wide screen, a Needs you column taller than the folded lists, and forty Flagged or still waiting rows
- **WHEN** Today loads
- **THEN** the three columns stand at one height
- **AND** Flagged or still waiting's opened group fills the rest of its column and scrolls its rows inside itself, showing at least about five and a half rows, with its bottom edge faded

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-ws4 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-86 - A product with no reminder yet says Nothing yet
**Serves:** grade10-admin-console-daily-reminder-US-03 - the operator sees every product the reminder will hold

- **GIVEN** an operator who can open Store, Consignment, Inventory and Appointments, none of which has reminder rows
- **WHEN** Today loads
- **THEN** each list shows, after Auction, a line for each of those products saying Nothing yet, with no chevron

### Requirement: Slack posts the day's lists at 08:00 Hong Kong time

At 08:00 Hong Kong time every day, including weekends, each product SHALL
post its own lists as one message to its own Slack channel, headed with the
product and the Hong Kong day, such as Auction daily reminder. Auction's
trigger posts auction's lists:

1. Both lists are read for the Hong Kong day, with every row and not one operator's grants.
2. When both are empty, nothing posts. A list with no row is left out of a message that has rows.
3. Each list shows its first 10 rows, then a link to Today saying how many more. Flagged or still waiting reads flagged rows first, then longest wait, and equal waits by listing code; What's New reads latest close first.
4. Each row names the listing code, the lot, the outcome or the action or flag reason, and for a waiting or flagged order the whole days waited, rounded down, so 48 to 71 hours reads 2 days. It links to its listing or order in the console of the environment that posts. It never names the winner, and never carries a winner's email or phone.
5. A lot title longer than 60 characters is cut to 59 characters and an ellipsis.
6. The links show no previews.
7. The Flagged or still waiting heading reads Something wrong or waiting a while, needing your action, with a warning mark beside it.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-kf7 rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-45 - The message posts at 08:00 Hong Kong time
**Serves:** grade10-admin-console-daily-reminder-US-04 - the team starts the morning with the lists

- **GIVEN** a Saturday with a row in What's New
- **WHEN** the clock passes 07:59:59 and then 08:00:00 Hong Kong time
- **THEN** nothing has posted at 07:59:59
- **AND** one message with What's New posts when the daily trigger fires at 08:00:00

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-99q rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-46 - Each row links to its order or listing
**Serves:** grade10-admin-console-daily-reminder-US-04 - the team opens the work from the channel

- **GIVEN** a sold row, an unsold row and a Flagged or still waiting row, posted from staging
- **WHEN** the message posts
- **THEN** each row links to its order's page or its listing's page on the staging console
- **AND** no row links to the production console

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-oce rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-47 - The message carries every row
**Serves:** grade10-admin-console-daily-reminder-US-04 - a shared channel cannot be scoped to one operator

- **GIVEN** a Send invoice row, a Check proof row and a Dispatch row
- **WHEN** the message posts
- **THEN** all three rows are in it

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-alf rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-48 - No winner name, email or phone reaches the channel
**Serves:** grade10-admin-console-daily-reminder-US-04 - the link carries the identity

- **GIVEN** a sold row and a Send invoice row whose winners have a name, an email and a phone
- **WHEN** the message posts
- **THEN** none of the three appears anywhere in the post, links and notification text included

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4d8 rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-49 - A row names its outcome or action
**Serves:** grade10-admin-console-daily-reminder-US-04 - the team reads what each row asks

- **GIVEN** a sold lot, an unsold lot, a Dispatch order that has waited 3 days 5 hours, and a flagged order with reason Overpaid that has waited 2 days
- **WHEN** the message posts
- **THEN** the rows read Sold, Unsold, Dispatch with 3 days, and Overpaid with 2 days
- **AND** each row names its listing code and lot

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-oap rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-73 - Days waited are rounded down
**Serves:** grade10-admin-console-daily-reminder-US-04 - 49 hours reads as 2 days and not 3

- **GIVEN** Dispatch orders that have waited 48 hours, 49 hours and 71 hours 59 minutes, and one that has waited 72 hours
- **WHEN** the message posts
- **THEN** the first three read 2 days and the last reads 3 days

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-odp rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-50 - A long lot title is cut to 60 characters with an ellipsis
**Serves:** grade10-admin-console-daily-reminder-US-04 - one long title does not fill the channel

- **GIVEN** a lot whose title is 61 characters, and one whose title is 60
- **WHEN** the message posts
- **THEN** the first title shows as its first 59 characters and an ellipsis
- **AND** the second shows whole

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-oxw rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-51 - A list of 10 posts whole
**Serves:** grade10-admin-console-daily-reminder-US-04 - a short list needs no link

- **GIVEN** 10 Flagged or still waiting rows
- **WHEN** the message posts
- **THEN** all 10 rows are in it
- **AND** it carries no link to Today for more

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-nyt rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-52 - A longer list stops at 10 and says how many more
**Serves:** grade10-admin-console-daily-reminder-US-04 - the channel stays readable

- **GIVEN** 25 Flagged or still waiting rows and 11 What's New rows
- **WHEN** the message posts
- **THEN** Flagged or still waiting shows its first 10 rows, flagged rows first then longest wait, then a link to Today saying 15 more
- **AND** What's New shows its first 10 rows, then a link to Today saying 1 more

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-4mh rev=3 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-53 - A quiet day posts nothing
**Serves:** Slack message - the 08:00 trigger that finds both lists empty

- **GIVEN** no row in either list at 08:00 Hong Kong time
- **WHEN** the daily trigger fires
- **THEN** nothing posts

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-g63 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-74 - An empty list is left out of a message that has rows
**Serves:** grade10-admin-console-daily-reminder-US-04 - the message says only what there is

- **GIVEN** a Dispatch row and no What's New row
- **WHEN** the message posts
- **THEN** the message holds Flagged or still waiting with its row
- **AND** it holds no What's New heading and no line saying none

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-9ws rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-75 - The links show no previews
**Serves:** grade10-admin-console-daily-reminder-US-04 - a channel is not filled with link cards

- **GIVEN** a sold row and a Send invoice row
- **WHEN** the message posts
- **THEN** the post asks Slack to unfurl neither links nor media

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-aco rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-78 - Slack's first 10 rows follow the exact wait
**Serves:** grade10-admin-console-daily-reminder-US-04 - the longest waits lead after flags

- **GIVEN** 11 unflagged Flagged or still waiting orders: AU-1000 has waited 49 hours and AU-1001 to AU-1010 have waited 70 hours
- **WHEN** the message posts
- **THEN** the first 10 rows are AU-1001 to AU-1010
- **AND** the link to Today says 1 more

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-1cz rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-87 - Auction's message is headed with its product
**Serves:** grade10-admin-console-daily-reminder-US-04 - the channel reads whose lists these are

- **GIVEN** a Flagged or still waiting row and auction's channel and token set
- **WHEN** auction's daily trigger fires on Monday 12 October
- **THEN** one message headed "Auction daily reminder · Monday 12 Oct 2026" posts to auction's channel
- **AND** it carries auction's rows only


<!-- trace:scenario id=g10adm.console-daily-reminder.SC-b02 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-102 - The waiting list heading warns
**Serves:** grade10-admin-console-daily-reminder-US-04 - the morning list says something is wrong or waiting

- **GIVEN** a Flagged or still waiting row
- **WHEN** the message posts
- **THEN** that list's heading reads Something wrong or waiting a while, needing your action
- **AND** the heading carries a warning mark
- **AND** flagged rows lead that list

### Requirement: The day's message is sent once and a failure is logged

The daily trigger SHALL send the day's message once, and nothing SHALL record that it was sent. When Slack refuses the message or cannot be reached, the failure SHALL be logged as an error naming the Hong Kong day and the reason, the message SHALL NOT be sent again, and that day's message is lost. The next message is the next day's, naming the lists of that day.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-s95 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-54 - A refused send is not tried again
**Serves:** grade10-admin-console-daily-reminder-US-04 - a Slack outage at 08:00 loses that morning's post and nothing more

- **GIVEN** Slack refuses the post at 08:00 and would accept one at 08:05
- **WHEN** the worker runs on from 08:00 to 10:00
- **THEN** no later run posts the day's message

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-6kr rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-56 - A failed send is logged as an error
**Serves:** Slack message - the trigger that cannot reach Slack

- **GIVEN** Slack refuses the post
- **WHEN** the daily trigger fires
- **THEN** one error is logged, naming the Hong Kong day and Slack's reason

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-07a rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-57 - A message that missed its day is not posted the next day
**Serves:** Slack message - the trigger after midnight

- **GIVEN** Slack refused the post on Monday 12 October
- **WHEN** the worker runs on Tuesday 13 October before 08:00 Hong Kong time
- **THEN** nothing posts for Monday
- **AND** Tuesday's message posts at 08:00, naming Tuesday's lists

### Requirement: The channel and token come from the environment

Each product's Slack bot token and channel SHALL be set per environment in
that product's own settings, so staging and production can differ and two
products may share them, and never from the console. Auction SHALL attempt a
daily or lifecycle send only when both values are non-empty. When either is
missing or empty, nothing SHALL post, the log SHALL say the reminder or
lifecycle alerts are not configured, and the 08:00 run and every other usual
path SHALL continue as if Slack were not involved.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-hb6 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-59 - The post goes to the environment's channel
**Serves:** Slack message - staging and production post to their own channels

- **GIVEN** staging configured with one channel and token and production with another
- **WHEN** each posts its message
- **THEN** each uses its own token and channel

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-f3g rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-60 - Without a token or a channel nothing posts and the log says so
**Serves:** Slack message - an environment with no Slack set up

- **GIVEN** an environment where the bot token is missing or empty, or the channel is missing or empty, or both
- **WHEN** the 08:00 Hong Kong time run happens
- **THEN** nothing posts
- **AND** the log says the reminder is not configured
- **AND** no error is raised into the scheduled run or any other usual path

### Requirement: Auction posts lifecycle Slack when a listing goes live, ends or is extended

Auction SHALL post one message to its daily reminder Slack channel when a
listing goes live with bidding open (when the scheduled start is reached, or
when publish opens bidding because that start is already due), when a listing
ends (with the end time, including any extension), and once each time soft-
close extends a listing (with how long it was extended in whole minutes
rounded down from the seconds the end moved, and the new end time). Each
message SHALL name the listing code and lot, carry a console link, and SHALL
NOT name a winner, email or phone.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a88 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-88 - A listing that reaches its start posts once
**Serves:** grade10-admin-console-daily-reminder-US-06 - the team learns a sale is open

- **GIVEN** a published listing whose bidding has just opened, either because its scheduled start was reached or because publish opened bidding with that start already due
- **WHEN** Auction's lifecycle alert for go-live runs
- **THEN** one Slack message posts to Auction's daily reminder channel naming the listing code, the lot and the start time
- **AND** the message links to the listing in the console
- **AND** staying live does not post again

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a89 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-89 - A listing that ends posts with its end time
**Serves:** grade10-admin-console-daily-reminder-US-06 - the team learns a sale has closed

- **GIVEN** a listing that has just reached its close, including after an extension
- **WHEN** the close is committed
- **THEN** one Slack message posts naming the listing code, the lot and the end time
- **AND** the end time is the effective close, including any extension

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a90 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-90 - Each soft-close extension posts once
**Serves:** grade10-admin-console-daily-reminder-US-06 - later extensions are not hidden

- **GIVEN** a live listing whose end time moves because a bid earns soft-close
- **WHEN** that bid is accepted
- **THEN** one Slack message posts naming how long the listing was extended as whole minutes rounded down from the seconds the end moved, such as 30 minutes, and the new end time
- **AND** a later extension on the same listing posts again
- **AND** a bid that does not move the end time posts nothing

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a91 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-91 - Lifecycle listing messages use the daily reminder channel
**Serves:** Slack lifecycle alerts - the same channel as the morning list

- **GIVEN** Auction's daily reminder token and channel are set
- **WHEN** a go-live, end or extension alert posts
- **THEN** each message uses that token and channel
- **AND** no second channel or token is read

### Requirement: Auction posts a warning Slack when an order becomes overdue or is flagged

Auction SHALL post one warning message to its daily reminder Slack channel
when an order becomes Setup Overdue, when it becomes Payment Overdue, and
when it is flagged, each once at the transition. An overdue or flagged
message SHALL carry a warning mark, the listing code, the lot, and for a
flag the flag reason. It SHALL link to the order and SHALL NOT name a
winner, email or phone. Staying overdue or flagged SHALL NOT post again.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a92 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-92 - Setup Overdue posts once with a warning
**Serves:** grade10-admin-console-daily-reminder-US-07 - money waiting on setup is noticed at once

- **GIVEN** an order whose address deadline has just passed so its status is Setup Overdue
- **WHEN** Auction's lifecycle alert for Setup Overdue runs
- **THEN** one Slack message posts with a warning mark, naming Setup Overdue, the listing code and the lot
- **AND** the message links to the order
- **AND** staying Setup Overdue does not post again

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a93 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-93 - Payment Overdue posts once with a warning
**Serves:** grade10-admin-console-daily-reminder-US-07 - money waiting on payment is noticed at once

- **GIVEN** an order whose invoice has just expired so its status is Payment Overdue
- **WHEN** that transition is committed
- **THEN** one Slack message posts with a warning mark, naming Payment Overdue, the listing code and the lot
- **AND** staying Payment Overdue does not post again

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a94 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-94 - A new payment flag posts once with its reason
**Serves:** grade10-admin-console-daily-reminder-US-07 - a fresh flag is noticed at once

- **GIVEN** a payment on an order is recorded with an uncleared flag whose reason is Overpaid
- **WHEN** that write commits
- **THEN** one Slack message posts with a warning mark, naming the listing code, the lot and Overpaid
- **AND** clearing the flag and raising another posts again for the new flag
- **AND** leaving the same flag open does not post again

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a95 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-95 - Overdue and flagged alerts share the daily channel
**Serves:** Slack lifecycle alerts - one Auction channel

- **GIVEN** Auction's daily reminder token and channel are set
- **WHEN** an overdue or flagged alert posts
- **THEN** it uses that token and channel

### Requirement: Lifecycle Slack posts are best effort and never hold the bid or order path

Posting a lifecycle alert SHALL run only after the usual bid, close,
extension, overdue transition or flag step has already completed, and SHALL
NOT delay or refuse that step. A missed or failed post SHALL be logged as an
error naming the kind and the reason, SHALL NOT be retried, and SHALL leave
the listing or order move completed. Auction SHALL attempt a send only when
both the bot token and the channel environment values are non-empty. When
either is missing or empty, nothing SHALL post, the log SHALL say lifecycle
alerts are not configured, and the usual path SHALL continue as if Slack were
not involved.

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a96 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-96 - An extension alert failure does not refuse the bid
**Serves:** Slack lifecycle alerts - posting must not hold the sale

- **GIVEN** a bid that earns an extension, and Slack that will refuse the post
- **WHEN** the bid is accepted
- **THEN** the bid stands and the end time has moved before any Slack send starts
- **AND** one error is logged naming the extension kind and Slack's reason
- **AND** the post is not tried again

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a97 rev=1 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-97 - A close completes when Slack is down
**Serves:** Slack lifecycle alerts - a missed end alert is accepted

- **GIVEN** a listing due to close, and Slack unreachable
- **WHEN** the close commits
- **THEN** the listing is closed and its order, if any, is issued
- **AND** the failed end alert is logged and not retried

<!-- trace:scenario id=g10adm.console-daily-reminder.SC-a98 rev=2 -->
#### Scenario: grade10-admin-console-daily-reminder-SC-98 - Without Slack configured lifecycle posts nothing
**Serves:** Slack lifecycle alerts - an environment with no workspace

- **GIVEN** an environment where the bot token is missing or empty, or the channel is missing or empty, or both
- **WHEN** a go-live, end, extension, overdue or flag transition happens
- **THEN** the listing or order move completes as usual
- **AND** nothing posts
- **AND** the log says lifecycle alerts are not configured
- **AND** no error is raised into the bid, close or order path
