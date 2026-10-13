---
title: Daily Reminder
spec: grade10-admin/console/daily-reminder
order: 5
---

What an operator looks at first each day: what is new since yesterday and what
is still waiting on them. It opens as a dialog, stays on Today and posts to
Slack. Auction is the first source; each product adds its own rows later.

## Rules

| Rule | Value |
| --- | --- |
| Day | A Hong Kong calendar day, whatever zone the browser is in |
| Lists | **What's New** and **Still Waiting** |
| What's New window | The previous Hong Kong day |
| Still Waiting threshold | **48 hours** since the order's wait began |
| Dialog opens | Each entry with a row for the operator or a list that failed, until they close it that Hong Kong day |
| Slack message | **08:00** Hong Kong time, every day, one per product to its own channel |
| Slack list length | **10** rows a list, then a link to Today |
| Slack wait | Whole days, rounded down |
| Reading | Both lists read from the current listings and orders each time |

## What's New

🚧 Every listing that closed on the previous Hong Kong day has one row, latest
close first.

| Outcome | The row opens |
| --- | --- |
| Sold | The listing's winner order |
| Unsold | The listing |

- 🚧 **One row per listing** - a sold listing appears once, as its order,
  never also as a closed listing
- **Closed** - a listing that reached its close; one called off before it is
  not listed, and one that closed with no bids is Unsold
- **Row** - the listing code and lot, and for a sold listing the winner and
  the order's status; equal closes list by listing code, A to Z

## Still Waiting

🚧 Every order that has waited **48 hours** for an operator action has one row,
longest wait first. It stays on the list every day until the order moves on.

| Row says | Order status | Waited since | Seen with |
| --- | --- | --- | --- |
| Send invoice | Preparing Invoice | The winner's setup confirmation | Payment processing |
| Check proof | Payment Verifying | The winner's latest proof | Payment processing |
| Dispatch | Preparing Shipment | The payment that paid it | Shipment processing |

- **Row** - the listing code, lot and winner, the action, and how long the
  order has waited, as days and hours such as `3d 5h`; it opens the order
- **A reminder, not a status** - no status, worklist row or order page is
  marked by it. Every row is also in
  [Orders · Needs action](/p/grade10-admin/auction/management#post-sale-queue)
- **Order** - the longest wait first, and equal waits by listing code, A to Z
- **Flagged payments** - an order with an open payment flag is listed like any
  other, by its own wait; the flag does not start a second clock, and the order
  page still holds what finance must clear first
- **Other statuses** - Setup Overdue and Payment Overdue are not listed; Needs
  you counts them

## Who Sees a Row

- 🚧 **By grant** - an operator sees a Still Waiting row only if they hold the
  grant its action needs; a What's New row only if they can open the page it
  links to - [Grants](/p/grade10-admin/auction/management#grants)
- **Reading opens a listing** - an unsold row needs only reading access, as the
  Orders workspace does
- 🚧 **No row, no list in the dialog** - a list with no row for the operator is
  left out of the dialog, and the dialog does not open when neither has one
  and neither failed to load

## Opening

- 🚧 **Until closed for the day** - a dialog opens over each signed-in console
  page the operator loads, with both lists, until they close it. Closing it
  keeps it closed for the rest of that Hong Kong day, for that operator, in
  that browser
- 🚧 **Nothing to show** - an entry with no row and no failed list opens
  nothing and keeps nothing, so a row that turns up later that day opens it on
  the next load
- 🚧 **Closing** - the close control, Escape, a click outside, and following a
  row all close it; a row opened in a new tab leaves it open
- 🚧 **When it opens again** - in another browser, after the operator signs out
  of the console and in, and where the browser keeps nothing between loads. A
  session that ends any other way keeps the mark until the Hong Kong day ends
- 🚧 **Only a full load** - returning to the tab or moving between pages does
  not open it
- 🚧 **Long lists in the dialog** - each product's list shows about four and a
  half rows and scrolls inside itself, faded at the edge with more; the dialog
  keeps its size
- 🚧 **A list that fails to load** - says so beside the list that loaded, with a
  Retry; when the other list is empty the dialog still opens for the failure,
  so it never reads as nothing waiting

## Today

🚧 Today reads in three columns: What's New, Still Waiting and Needs you. The
lists are the ones in the dialog, so a closed dialog is never the only place to
read them.

- 🚧 **Needs you** - holds the section cards it holds now, one under another,
  with the counts and links unchanged; a failed list shows the same notice and
  Retry in its column
- 🚧 **One height** - the three columns stand side by side at one height,
  set by the taller of Needs you and an opened group
- 🚧 **Inner groups** - What's New and Still Waiting group their rows by
  product: Auction, then Store, Consignment, Inventory and Appointments, each
  the operator can open. Each group shows as one line with its count until
  its chevron opens it; opening one closes the other in that column
- 🚧 **An opened group** - fills the rest of its column, never under about
  five and a half rows, and scrolls the rest inside itself, with the edge
  that has more beyond it faded
- 🚧 **Empty list** - a product with no row says Nothing yet, so a column with
  no row for the operator stays and says so
- 🚧 **Below the columns** - Approvals leaves the Needs you column and sits with
  Recent and All sections under the three columns; the card is unchanged
- 🚧 **Refresh** - Today's Refresh reads all three columns again; the dialog
  reads when it opens
- **Counts** - the Needs you total and Today's summary line keep counting
  Approvals
- **Narrow screens** - the columns stack, Needs you last

## Slack

🚧 At **08:00** Hong Kong time every day, each product posts its own message,
such as **Auction daily reminder**, with its own two lists, to its own Slack
channel. Auction posts first; Store, Consignment, Inventory and Appointments
post theirs when they add rows.

- 🚧 **Links** - each row links to its listing or order in the console; the
  message shows no link previews
- 🚧 **Everyone's rows** - the channel is shared, so it carries every row, not
  one operator's grants; a row names the listing code, lot, outcome or action
  and days waited, and never a winner's name, email or phone
- 🚧 **Quiet day** - nothing posts when both lists are empty; a list with no
  row is left out of a message that has rows
- 🚧 **Layout** - the heading names the product and the day; each list's
  rows follow one line a row
- 🚧 **Long lists** - each list shows its first 10 rows by exact wait or close,
  then a link to Today that says how many more
- 🚧 **Titles** - a lot title over 60 characters is cut to 59 and an ellipsis
- 🚧 **One attempt** - the message is sent once; a failure is logged and that
  day's message is not sent later
- 🚧 **Set per environment** - each product's channel and access token come
  from its own environment settings, never from the console; two products may
  share them. Without them that product posts nothing and the log says it is
  not configured

:::detail{title="Product decisions" for="pm"}
The owner wanted a reminder, not a second queue: the Orders worklist already
counts what needs action, and Today already shows that count. The reminder adds
the day's new listings and the orders that have waited too long for an
operator, in the console and in the team's Slack.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A reminder, not a status | 🚧 In flight | The lists mark no status and add no wording to the worklist or the order page. Chosen over an Overdue mark on the operator's own queue, which [Orders](/p/grade10-admin/auction/management#orders) already decided against. | Product |
| Still Waiting, not Needs you | 🚧 In flight | Still Waiting lists only the forgotten jobs: send an invoice, check a proof, dispatch. Overdue orders stay in Needs you, which already counts them. Chosen over listing every Needs action status, which repeats the worklist. | Product |
| No messages stored | 🚧 In flight | Both lists are read from current listings and orders; no per-operator message, read state or bell exists. Chosen over a notification table, which could disagree with the worklist. | Product |
| Hong Kong day | 🚧 In flight | The previous day, and once a day, are Hong Kong days, as every Orders date is. Chosen over each operator's browser zone, which gives two operators different lists on one morning. | Product |
| Previous day only | 🚧 In flight | An operator who was away misses the new rows of earlier days; Still Waiting still catches anything that needs action. Chosen over a window since the last visit, which needs a server-side memory. | Product |
| 48 hours, one number | 🚧 In flight | Invoice, proof and dispatch share one threshold. Chosen over a number per status until one proves wrong. | Product |
| By grant in the console | 🚧 In flight | Each operator sees what they can act on. Chosen over showing everyone every row, which leaves finance reminded about dispatch. | Product |
| One row per listing | 🚧 In flight | A sold listing is its order; an unsold one is the listing. Chosen over a closed-listing row and a new-order row for one lot. | Product |
| Three columns on Today | 🚧 In flight | What's New, Still Waiting and Needs you side by side; Approvals, Recent and All sections stay below, unchanged. Chosen over folding Approvals into the Needs you column, which squeezes its approve and decline controls. | Product |
| One attempt, no record | 🚧 In flight | The message is tried once and nothing records the send; a failure is logged and that day's message is lost. Chosen over retries through the day with a record of each day's send, which needs a table and a rule against posting twice. | Product |
| Flagged orders are listed | 🚧 In flight | An order in a waiting status is listed by its own wait even with an open payment flag. Chosen over leaving it to Needs you, which would hide a forgotten dispatch behind a flag. | Product |
| Folded on Today, scrolled in the dialog | 🚧 In flight | Today shows each product's list as one line until it is opened, so the page stays short; the dialog shows about four and a half rows of each and scrolls the rest inside the list. Chosen over full lists in both, which push Needs you and Approvals down the page and grow the dialog past the screen. | Product |
| Slack, one message per product | 🚧 In flight | Each product posts its own message at 08:00 Hong Kong time to its own channel, with the same token or its own. Chosen over one message for every product, which needs one place that reads every product's lists, and over email or a message to each operator, which needs an address or a Slack account for every operator. | Product |
| Slack carries everyone's rows, no customer names | 🚧 In flight | A shared channel cannot be scoped to one operator's grants, and a customer's name does not belong in it; the link carries the identity. Chosen over per-grant filtering and over naming the winner. | Product |
:::
