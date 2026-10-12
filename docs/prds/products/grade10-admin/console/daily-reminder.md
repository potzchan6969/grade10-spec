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
| Dialog opens | The first entry on a Hong Kong day, when a list has a row for the operator |
| Slack message | **08:00** Hong Kong time, every day, to one channel |
| Slack list length | **10** rows a list, then a link to Today |
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
- **Row** - the listing code and lot, and for a sold listing the winner and
  the order's status

## Still Waiting

🚧 Every order that has waited **48 hours** for an operator action has one row,
longest wait first. It stays on the list every day until the order moves on.

| Row says | Order status | Waited since | Seen with |
| --- | --- | --- | --- |
| Send invoice | Preparing Invoice | The winner's setup confirmation | Payment processing |
| Check proof | Payment Verifying | The winner's latest proof | Payment processing |
| Dispatch | Preparing Shipment | The payment that paid it | Shipment processing |

- **Row** - the listing code, lot and winner, the action, and how long the
  order has waited; it opens the order
- **A reminder, not a status** - no status, worklist row or order page is
  marked by it. Every row is also in
  [Orders · Needs action](/p/grade10-admin/auction/management#post-sale-queue)
- **Other statuses** - Setup Overdue, Payment Overdue and flagged payments are
  not listed; Needs you counts them

## Who Sees a Row

- 🚧 **By grant** - an operator sees a Still Waiting row only if they hold the
  grant its action needs; a What's New row only if they can open the page it
  links to - [Grants](/p/grade10-admin/auction/management#grants)
- 🚧 **No row, no list in the dialog** - a list with no row for the operator is
  left out of the dialog, and the dialog does not open when neither has one

## Opening

- 🚧 **First entry of the day** - a dialog opens over whichever console page
  the operator lands on, with both lists. Closing it keeps it closed for the rest of that Hong Kong day, for
  that operator, in that browser
- 🚧 **Blocked storage** - a browser that cannot keep the closed mark opens the
  dialog once per tab session
- 🚧 **A list that fails to load** - says so beside the list that loaded; it
  never reads as empty

## Today

🚧 Today reads in three columns: What's New, Still Waiting and Needs you. The
lists are the ones in the dialog, so a closed dialog is never the only place to
read them.

- 🚧 **Needs you** - holds the section cards it holds now, one under another,
  with the counts and links unchanged
- 🚧 **Inner groups** - What's New and Still Waiting group their rows by
  product, Auction first, so another product adds a group and no column
- 🚧 **Empty list** - a column with no row for the operator stays and says so
- **Below the columns** - Approvals, Recent and All sections stay as they are
- **Narrow screens** - the columns stack, Needs you last

## Slack

🚧 At **08:00** Hong Kong time every day, both lists post as one message to a
Slack channel.

- 🚧 **Links** - each row links to its listing or order in the console
- 🚧 **Everyone's rows** - the channel is shared, so it carries every row, not
  one operator's grants; a row names the listing code, lot, outcome or action
  and days waited, and never a winner's name, email or phone
- 🚧 **Quiet day** - nothing posts when both lists are empty
- 🚧 **Long lists** - each list shows its first 10 rows, then a link to Today
  that says how many more
- 🚧 **Once a day** - a failed send is tried again through the same Hong Kong
  day and never posts the day's message twice, nor on the next day
- 🚧 **Set per environment** - the channel and the access token come from the
  environment, never from the console; without them nothing posts

:::detail{title="Product decisions" for="pm"}
The owner wanted a reminder, not a second queue: the Orders worklist already
counts what needs action, and Today already shows that count. The reminder adds
the day's new listings and the orders that have waited too long for an
operator, in the console and in the team's Slack.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A reminder, not a status | 🚧 In flight | The lists mark no status and add no wording to the worklist or the order page. Chosen over an Overdue mark on the operator's own queue, which [Orders](/p/grade10-admin/auction/management#orders) already decided against. | Product |
| Still Waiting, not Needs you | 🚧 In flight | Still Waiting lists only the forgotten jobs: send an invoice, check a proof, dispatch. Overdue and flagged orders stay in Needs you, which already counts them. Chosen over listing every Needs action status, which repeats the worklist. | Product |
| No messages stored | 🚧 In flight | Both lists are read from current listings and orders; no per-operator message, read state or bell exists. Chosen over a notification table, which could disagree with the worklist. | Product |
| Hong Kong day | 🚧 In flight | The previous day, and once a day, are Hong Kong days, as every Orders date is. Chosen over each operator's browser zone, which gives two operators different lists on one morning. | Product |
| Previous day only | 🚧 In flight | An operator who was away misses the new rows of earlier days; Still Waiting still catches anything that needs action. Chosen over a window since the last visit, which needs a server-side memory. | Product |
| 48 hours, one number | 🚧 In flight | Invoice, proof and dispatch share one threshold. Chosen over a number per status until one proves wrong. | Product |
| By grant in the console | 🚧 In flight | Each operator sees what they can act on. Chosen over showing everyone every row, which leaves finance reminded about dispatch. | Product |
| One row per listing | 🚧 In flight | A sold listing is its order; an unsold one is the listing. Chosen over a closed-listing row and a new-order row for one lot. | Product |
| Three columns on Today | 🚧 In flight | What's New, Still Waiting and Needs you side by side; Approvals, Recent and All sections stay below, unchanged. Chosen over folding Approvals into the Needs you column, which squeezes its approve and decline controls. | Product |
| Slack, one channel | 🚧 In flight | One message at 08:00 Hong Kong time every day to one channel. Chosen over email or a message to each operator, which needs an address or a Slack account for every operator. | Product |
| Slack carries everyone's rows, no customer names | 🚧 In flight | A shared channel cannot be scoped to one operator's grants, and a customer's name does not belong in it; the link carries the identity. Chosen over per-grant filtering and over naming the winner. | Product |
:::
