## Goals

- An operator starts each day knowing which listings closed the day before and
  which orders are waiting on them.
- An order that has waited 48 hours for an invoice, a proof check or a
  dispatch is listed every day until someone acts on it.
- The lists can be read again on Today after the dialog is closed.
- Auction is the first source; other products add rows without a new mechanism.

## Non-Goals

- A bell, a message history, or read state for each operator.
- Email, push or any other channel to operators, and any setting to turn rows
  on or off.
- An Overdue status, mark or word on a status, a worklist row or an order page.
- Any change to the Orders worklist or the Needs you count.
- Rows for Setup Overdue, Payment Overdue or flagged payments.
- Inventory or vault rows.
- A window longer than the previous day for an operator who was away.
- Specifying the Today page as a whole; only the reminder's section on it.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the console store a message for each operator, with a bell and read state? | No. A daily reminder read from current listings and orders | A notification table with a bell and per-operator read state: it could say an order needs action after the worklist says it does not |
| Q2 | Where does "seen today" live? | In the browser, per operator and Hong Kong day. A browser that blocks storage shows the dialog once per tab session | A server-side row per operator and day: a second source of truth for a reminder |
| Q3 | Where does the operator read the lists again? | On Today, the same two lists | A notification page behind a bell |
| Q4 | What lists does the dialog carry? | Two: What's New and Waiting on You | One mixed list, which hides how long an order has waited behind what arrived |
| Q5 | What is the second list called, and does it mark anything? | Waiting on You. It marks nothing: no status, row or order page changes, and no word says overdue | Action Overdue: reads as the second Overdue mark that [Orders](../../../docs/prds/products/grade10-admin/auction/management.md#orders) decided against |
| Q6 | Which clock is "the previous day" and "once a day"? | Hong Kong time (recommended) | The operator's browser zone: two operators get different lists on one morning |
| Q7 | How far back does What's New reach? | The previous Hong Kong day only | A window since the last visit, which needs a server-side memory; a window of three days, which repeats rows the operator saw |
| Q8 | Who sees each row? | An operator sees the rows whose action their grants allow, and a What's New row only if they can open its page (recommended) | Every operator who can read Orders: finance is reminded about dispatch |
| Q9 | How does a listing that closed yesterday appear? | One row by outcome: sold opens its winner order, unsold opens the listing (recommended) | A closed-listing row and a new-order row for one sold listing |
| Q10 | Which waits are listed, and after how long? | Preparing Invoice, Payment Verifying and Preparing Shipment, each at 48 hours | One number per status; also listing every Needs action status, which repeats the worklist |
| Q11 | When does each wait begin? | At the clock the Orders table already names under Waited since: the setup confirmation, the latest proof, the payment | The invoice log's last entry for the status: a second clock beside the one the order page shows |
| Q12 | Is 48 hours two calendar days? | 48 hours elapsed - decided by the round | Two Hong Kong calendar days: an order that began at 23:00 would be listed after 25 hours |
| Q13 | Do Setup Overdue, Payment Overdue and flagged payments join? | ❓ Product - recommended: leave them out until Product sets their waits | Choosing a number for each now |
| Q14 | Does the dialog open when neither list has a row? | No - decided by the round | An all-clear dialog each day, which trains operators to close it unread |
| Q15 | What does a list that fails to load show? | That it failed to load, beside the list that did - decided by the round | Hiding the failed list: it reads as nothing waiting |
| Q16 | Does the Needs you count change? | No. Every Waiting on You row is also under Needs action - decided by the round | A count of its own, which could disagree with Needs you |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
