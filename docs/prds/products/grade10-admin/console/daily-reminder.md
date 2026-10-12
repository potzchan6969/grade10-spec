---
title: Daily Reminder
spec: grade10-admin/console/daily-reminder
order: 5
---

What an operator looks at first each day: what is new since yesterday and what
is waiting on them. Auction is the first source; each product adds its own
rows later.

## Rules

| Rule | Value |
| --- | --- |
| Day | A Hong Kong calendar day, whatever zone the browser is in |
| Lists | **What's New** and **Waiting on You** |
| What's New window | The previous Hong Kong day |
| Waiting threshold | **48 hours** since the order's wait began |
| Opens | The first entry on a Hong Kong day, when a list has a row for the operator |
| Reading | Both lists read from the current listings and orders on each entry |

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

## Waiting on You

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
  [Orders · Needs action](/p/grade10-admin/auction/management#post-sale-queue),
  which stays the live count
- **Other statuses** - Setup Overdue, Payment Overdue and flagged payments
  are not listed
- ❓ **Their waits** - Product confirms which wait, if any, each of those
  carries

## Who Sees a Row

- 🚧 **By grant** - an operator sees a Waiting on You row only if they hold the
  grant its action needs; a What's New row only if they can open the page it
  links to - [Grants](/p/grade10-admin/auction/management#grants)
- 🚧 **No row, no list** - a list with no row for the operator is not shown,
  and the dialog does not open when neither has one

## Opening

- 🚧 **First entry of the day** - a dialog opens over the console with both
  lists. Closing it keeps it closed for the rest of that Hong Kong day, for
  that operator, in that browser
- 🚧 **Blocked storage** - a browser that cannot keep the closed mark opens the
  dialog once per tab session
- 🚧 **Today** - the console's Today page carries the same two lists whenever
  the operator opens it, so a closed dialog is never the only place to read
  them
- 🚧 **A list that fails to load** - says so beside the list that loaded; it
  never reads as empty

:::detail{title="Product decisions" for="pm"}
The owner wanted a reminder, not a second queue: the Orders worklist already
counts what needs action, and the Today page already shows that count. The
reminder adds the day's new listings and the orders that have waited too long
for an operator.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A reminder, not a status | 🚧 In flight | The lists mark no status and add no wording to the worklist or the order page. Chosen over an Overdue mark on the operator's own queue, which [Orders](/p/grade10-admin/auction/management#orders) already decided against. | Product |
| Nothing stored | 🚧 In flight | Both lists are read from current listings and orders, and the only memory is the browser's closed mark. Chosen over a notification table with read and resolved state per operator, which could disagree with the worklist. | Product |
| Hong Kong day | 🚧 In flight | The previous day, and once a day, are Hong Kong days, as every Orders date is. Chosen over each operator's browser zone, which gives two operators different lists on one morning. | Product |
| Previous day only | 🚧 In flight | An operator who was away misses the new rows of earlier days; the waiting list still catches anything that needs action. Chosen over a window since the last visit, which needs a server-side memory. | Product |
| 48 hours, one number | 🚧 In flight | Invoice, proof and dispatch share one threshold. Chosen over a number per status until one proves wrong. | Product |
| By grant | 🚧 In flight | Each operator sees what they can act on. Chosen over showing everyone every row, which leaves finance reminded about dispatch. | Product |
| One row per listing | 🚧 In flight | A sold listing is its order; an unsold one is the listing. Chosen over a closed-listing row and a new-order row for one lot. | Product |
:::
