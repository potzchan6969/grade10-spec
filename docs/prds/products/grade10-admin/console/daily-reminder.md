---
title: Daily Reminder
spec: grade10-admin/console/daily-reminder
order: 5
---

What an operator looks at first each day: what is new since yesterday and what
is flagged or still waiting on them. It opens as a dialog, stays on Today and
posts to Slack. Auction also posts when a listing goes live, ends or is
extended, and when an order becomes overdue or is flagged. Auction is the first
source; each product adds its own rows later.

## Rules

| Rule | Value |
| --- | --- |
| Day | A Hong Kong calendar day, whatever zone the browser is in |
| Lists | **What's New** and **Flagged or still waiting** |
| What's New window | The previous Hong Kong day |
| Flagged or still waiting | Flagged orders first (any age), then waits of **48 hours** or more |
| Dialog opens | Each entry with a row for the operator or a list that failed, until they close it that Hong Kong day |
| Slack daily message | **08:00** Hong Kong time, every day, one per product to its own channel |
| Slack list length | **10** rows a list, then a link to Today |
| Slack wait | Whole days, rounded down |
| Slack lifecycle | Auction posts once when a listing goes live, ends or is extended, and when an order becomes overdue or is flagged; only when both bot token and channel are set |
| Reading | Both lists read from the current listings and orders each time |

## What's New

Every listing that closed on the previous Hong Kong day has one row, latest
close first.

| Outcome | The row opens |
| --- | --- |
| Sold | The listing's winner order |
| Unsold | The listing |

- **One row per listing** - a sold listing appears once, as its order,
  never also as a closed listing
- **Closed** - a listing that reached its close; one called off before it is
  not listed, and one that closed with no bids is Unsold
- **Row** - the listing code and lot, and for a sold listing the winner and
  the order's status; equal closes list by listing code, A to Z

## Flagged or Still Waiting

🚧 Every order with an open payment flag, and every order that has waited
**48 hours** for an operator action, has one row. Flagged rows lead; then the
longest wait. A row stays every day until the flag is cleared or the order
moves on.

| Row says | When | Waited since | Seen with |
| --- | --- | --- | --- |
| Flagged, with the flag reason | Any open payment flag, whatever the status or age | The earliest open flag | Payment processing |
| Send invoice | Preparing Invoice for 48 hours or more, and not flagged | The winner's setup confirmation | Payment processing |
| Check proof | Payment Verifying for 48 hours or more, and not flagged | The winner's latest proof | Payment processing |
| Dispatch | Preparing Shipment for 48 hours or more, and not flagged | The payment that paid it | Shipment processing |

- 🚧 **One row** - a flagged order has one flagged row at the top, never a
  second wait row beside it
- **Row** - the listing code, lot and winner, the action or flag reason, and
  how long it has waited, as days and hours such as `3d 5h`; it opens the
  order
- **A reminder, not a status** - no status, worklist row or order page is
  marked by it. Every row is also in
  [Orders · Needs action](/p/grade10-admin/auction/management#post-sale-queue)
- **Order** - flagged rows first, then longest wait, and equal waits by
  listing code, A to Z
- 🚧 **Setup Overdue and Payment Overdue** - not listed on their own; Needs
  you counts them. An overdue order that is also flagged sits under Flagged
- 🚧 **Warning** - Today, the dialog and the daily Slack list show a warning
  mark beside the list title
- 🚧 **Empty** - Today says Nothing flagged or waiting too long. when the
  operator has no row

## Who Sees a Row

- **By grant** - an operator sees a Flagged or still waiting row only if they
  hold the grant its action needs; a What's New row only if they can open the
  page it links to - [Grants](/p/grade10-admin/auction/management#grants)
- **Reading opens a listing** - an unsold row needs only reading access, as the
  Orders workspace does
- **No row, no list in the dialog** - a list with no row for the operator is
  left out of the dialog, and the dialog does not open when neither has one
  and neither failed to load

## Opening

- **Until closed for the day** - a dialog opens over each signed-in console
  page the operator loads, with both lists, until they close it. Closing it
  keeps it closed for the rest of that Hong Kong day, for that operator, in
  that browser
- **Nothing to show** - an entry with no row and no failed list opens
  nothing and keeps nothing, so a row that turns up later that day opens it on
  the next load
- **Closing** - the close control, Escape, a click outside, and following a
  row all close it; a row opened in a new tab leaves it open
- **When it opens again** - in another browser, after the operator signs out
  of the console and in, and where the browser keeps nothing between loads. A
  session that ends any other way keeps the mark until the Hong Kong day ends
- **Only a full load** - returning to the tab or moving between pages does
  not open it
- **Long lists in the dialog** - each product's list shows about four and a
  half rows and scrolls inside itself, faded at the edge with more; the dialog
  keeps its size
- **A list that fails to load** - says so beside the list that loaded, with a
  Retry; when the other list is empty the dialog still opens for the failure,
  so it never reads as nothing waiting

## Today

Today reads in three columns: What's New, Flagged or still waiting and Needs
you. The lists are the ones in the dialog, so a closed dialog is never the only
place to read them.

- 🚧 **Flagged or still waiting** - title carries a warning mark; its caption
  reads **Something wrong or waiting a while, needing your action**
- **Needs you** - holds the section cards it holds now, one under another,
  with the counts and links unchanged; a failed list shows the same notice and
  Retry in its column
- **One height** - the three columns stand side by side at one height,
  set by the taller of Needs you and an opened group
- **Inner groups** - What's New and Flagged or still waiting group their rows
  by product: Auction, then Store, Consignment, Inventory and Appointments,
  each the operator can open. The first with rows, Auction first, starts
  opened; the others show as one line with their count until their chevron
  opens them, and opening one closes the other in that column
- **An opened group** - fills the rest of its column, never under about
  five and a half rows, and scrolls the rest inside itself, with the edge
  that has more beyond it faded
- **Empty list** - a product with no row says Nothing yet, so a column with
  no row for the operator stays and says so
- **Below the columns** - Approvals leaves the Needs you column and sits with
  Recent and All sections under the three columns; the card is unchanged
- **Refresh** - Today's Refresh reads all three columns again; the dialog
  reads when it opens
- **Counts** - the Needs you total and Today's summary line keep counting
  Approvals
- **Narrow screens** - the columns stack, Needs you last

## Slack

At **08:00** Hong Kong time every day, each product posts its own message,
such as **Auction daily reminder**, with its own two lists, to its own Slack
channel. Auction posts first; Store, Consignment, Inventory and Appointments
post theirs when they add rows.

- **Links** - each row links to its listing or order in the console; the
  message shows no link previews
- **Everyone's rows** - the channel is shared, so it carries every row, not
  one operator's grants; a row names the listing code, lot, outcome or action
  or flag reason and days waited, and never a winner's name, email or phone
- **Quiet day** - nothing posts when both lists are empty; a list with no
  row is left out of a message that has rows
- **Layout** - the heading names the product and the day; each list's
  rows follow one line a row
- 🚧 **Flagged or still waiting title** - the daily list heading reads
  **Something wrong or waiting a while, needing your action**, with a warning
  mark beside it; flagged rows lead that list
- **Long lists** - each list shows its first 10 rows by exact wait or close,
  then a link to Today that says how many more
- **Titles** - a lot title over 60 characters is cut to 59 and an ellipsis
- **One attempt** - the message is sent once; a failure is logged and that
  day's message is not sent later
- 🚧 **Set per environment** - each product's channel and bot token come
  from its own environment settings, never from the console; two products may
  share them. Both must be non-empty before any daily or lifecycle send. If
  either is missing or empty, that product skips the send, logs that it is
  not configured, and leaves the 08:00 run and every other usual path
  untouched

### Lifecycle Alerts

🚧 Auction posts one Slack message to the same channel when a listing or order
moves, without blocking the bid or order path. A missed post is accepted.

| When | The message carries |
| --- | --- |
| A listing goes live | The listing code, lot, and start time |
| A listing ends | The listing code, lot, and end time, including any extension |
| A listing is extended | The listing code, lot, how long it was extended in whole minutes rounded down, and the new end time |
| An order becomes Setup Overdue or Payment Overdue | A warning mark, the listing code, lot, and the overdue status |
| An order is flagged | A warning mark, the listing code, lot, and the flag reason |

- 🚧 **Once** - each transition posts once; staying overdue or flagged does not
  post again
- 🚧 **Same channel** - Auction's daily reminder channel and token; both must
  be set before any message is sent
- 🚧 **Bypass when unset** - if the bot token or the channel is missing or
  empty, Auction skips the send, logs that lifecycle alerts are not
  configured, and the listing or order path continues as if Slack were not
  involved
- 🚧 **No customer names** - no winner name, email or phone; each row links to
  the listing or order in the console
- 🚧 **Best effort, last step** - the send runs only after the usual bid,
  close, extension, overdue or flag step has already completed; it must not
  delay or refuse that step; a failure is logged and the event is not retried

:::detail{title="Product decisions" for="pm"}
The owner wanted a reminder, not a second queue: the Orders worklist already
counts what needs action, and Today already shows that count. The reminder adds
the day's new listings and the orders that have waited too long for an
operator, in the console and in the team's Slack.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A reminder, not a status | Decided | The lists mark no status and add no wording to the worklist or the order page. Chosen over an Overdue mark on the operator's own queue, which [Orders](/p/grade10-admin/auction/management#orders) already decided against. | Product |
| Flagged or still waiting, not Needs you | 🚧 In flight | The list holds flagged orders and the forgotten jobs: send an invoice, check a proof, dispatch. Setup Overdue and Payment Overdue stay in Needs you unless also flagged. Chosen over listing every Needs action status, which repeats the worklist. | Product |
| No messages stored | Decided | Both lists are read from current listings and orders; no per-operator message, read state or bell exists. Chosen over a notification table, which could disagree with the worklist. | Product |
| Hong Kong day | Decided | The previous day, and once a day, are Hong Kong days, as every Orders date is. Chosen over each operator's browser zone, which gives two operators different lists on one morning. | Product |
| Previous day only | Decided | An operator who was away misses the new rows of earlier days; Flagged or still waiting still catches anything that needs action. Chosen over a window since the last visit, which needs a server-side memory. | Product |
| 48 hours, one number | Decided | Invoice, proof and dispatch share one threshold. Chosen over a number per status until one proves wrong. | Product |
| By grant in the console | Decided | Each operator sees what they can act on. Chosen over showing everyone every row, which leaves finance reminded about dispatch. | Product |
| One row per listing | Decided | A sold listing is its order; an unsold one is the listing. Chosen over a closed-listing row and a new-order row for one lot. | Product |
| Three columns on Today | 🚧 In flight | What's New, Flagged or still waiting and Needs you side by side; Approvals, Recent and All sections stay below, unchanged. Chosen over folding Approvals into the Needs you column, which squeezes its approve and decline controls. | Product |
| One attempt, no record | Decided | The message is tried once and nothing records the send; a failure is logged and that day's message is lost. Chosen over retries through the day with a record of each day's send, which needs a table and a rule against posting twice. | Product |
| Flagged orders lead the list | 🚧 In flight | An order with any open payment flag has one flagged row at the top, any age, with the flag reason and wait from the earliest open flag; it is never also a wait row. Chosen over listing it only after 48 hours in a waiting status, which hid a fresh flag. | Product |
| One group open on Today, scrolled in the dialog | Decided | Today opens the first product with rows and folds the others to one line, one open at a time, so the page stays short; the dialog shows about four and a half rows of each and scrolls the rest inside the list, fading the edge with more. Chosen over every group folded, so the operator opens Auction on every visit, and over full lists in both, which push Needs you and Approvals down the page and grow the dialog past the screen. | Product |
| Slack, one message per product | Decided | Each product posts its own message at 08:00 Hong Kong time to its own channel, with the same token or its own. Chosen over one message for every product, which needs one place that reads every product's lists, and over email or a message to each operator, which needs an address or a Slack account for every operator. | Product |
| Slack carries everyone's rows, no customer names | Decided | A shared channel cannot be scoped to one operator's grants, and a customer's name does not belong in it; the link carries the identity. Chosen over per-grant filtering and over naming the winner. | Product |
| Lifecycle Slack alerts | 🚧 In flight | Auction posts once when a listing goes live, ends or is extended, and when an order becomes overdue or is flagged, on the same channel as the daily reminder. Chosen over waiting for the morning list, which is late for a live sale or a flag. | Product |
| Best effort, missable | 🚧 In flight | A lifecycle post runs only after the usual step has completed. Every Auction Slack send - morning post and lifecycle - attempts only when both the bot token and the channel are non-empty; otherwise it is skipped with a not-configured log and leaves the usual path untouched. A missed or failed post is logged and not retried. Chosen over awaiting Slack on the bid path or treating a missing env as an error that blocks work. | Product |
| Overdue is an alert, not a list row | 🚧 In flight | Setup Overdue and Payment Overdue each get one Slack message when the status is reached; they stay out of Flagged or still waiting unless also flagged. Chosen over listing every overdue order every morning, which repeats Needs you. | Product |
| Warning mark on the waiting list | 🚧 In flight | Today, the dialog and the daily Slack list show a warning mark beside Flagged or still waiting, and overdue and flagged alerts carry one too. Chosen over a quiet title beside What's New, which understated money and flags waiting. | Product |
:::
