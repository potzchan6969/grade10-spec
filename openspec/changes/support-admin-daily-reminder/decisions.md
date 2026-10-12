## Goals

- An operator starts each day knowing which listings closed the day before and
  which orders are still waiting on them.
- An order that has waited 48 hours for an invoice, a proof check or a
  dispatch is listed every day until someone acts on it.
- The lists can be read again on Today after the dialog is closed.
- The team sees the same lists in Slack each morning, with a link on each row.
- Auction is the first source; other products add rows without a new mechanism.

## Non-Goals

- A bell, a message history, or read state for each operator.
- Email, a message to each operator, or any channel but one Slack channel, and
  any setting in the console to turn rows on or off.
- Customer names, emails or phones in Slack.
- An Overdue status, mark or word on a status, a worklist row or an order page.
- Any change to the Orders worklist or the counts and links in Needs you.
- Changing Approvals, Recent or All sections on Today.
- Rows for Setup Overdue, Payment Overdue or flagged payments: Needs you
  already counts them.
- Inventory or vault rows.
- A window longer than the previous day for an operator who was away.
- Specifying the Today page as a whole; only its three columns.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the console store a message for each operator, with a bell and read state? | No. A daily reminder read from current listings and orders | A notification table with a bell and per-operator read state: it could say an order needs action after the worklist says it does not |
| Q2 | Where does "seen today" live? | In the browser, per operator and Hong Kong day. A browser that blocks storage shows the dialog once per tab session | A server-side row per operator and day: a second source of truth for a reminder |
| Q3 | Where does the operator read the lists again? | On Today, in the same two lists | A notification page behind a bell |
| Q4 | What lists does the dialog carry? | Two: What's New and Still Waiting | One mixed list, which hides how long an order has waited behind what arrived |
| Q5 | What is the second list called, and does it mark anything? | Still Waiting. It marks nothing: no status, row or order page changes, and no word says overdue | Action Overdue: reads as the second Overdue mark that [Orders](../../../docs/prds/products/grade10-admin/auction/management.md#orders) decided against. Waiting on You: reads as a twin of Needs you |
| Q6 | Which clock is "the previous day" and "once a day"? | Hong Kong time (recommended) | The operator's browser zone: two operators get different lists on one morning |
| Q7 | How far back does What's New reach? | The previous Hong Kong day only | A window since the last visit, which needs a server-side memory; a window of three days, which repeats rows the operator saw |
| Q8 | Who sees each row in the console? | An operator sees the rows whose action their grants allow, and a What's New row only if they can open its page (recommended) | Every operator who can read Orders: finance is reminded about dispatch |
| Q9 | How does a listing that closed yesterday appear? | One row by outcome: sold opens its winner order, unsold opens the listing (recommended) | A closed-listing row and a new-order row for one sold listing |
| Q10 | Which waits are listed, and after how long? | Preparing Invoice, Payment Verifying and Preparing Shipment, each at 48 hours | One number per status; also listing every Needs action status, which repeats the worklist |
| Q11 | When does each wait begin? | At the clock the Orders table already names under Waited since: the setup confirmation, the latest proof, the payment | The invoice log's last entry for the status: a second clock beside the one the order page shows |
| Q12 | Is 48 hours two calendar days? | 48 hours elapsed - decided by the round | Two Hong Kong calendar days: an order that began at 23:00 would be listed after 25 hours |
| Q13 | Do Setup Overdue, Payment Overdue and flagged payments join Still Waiting? | No. They stay in Needs you, which counts them; Still Waiting is the forgotten jobs | Giving each a wait of its own: it repeats Needs you |
| Q14 | Does the dialog open when neither list has a row? | No - decided by the round | An all-clear dialog each day, which trains operators to close it unread |
| Q15 | What does a list that fails to load show? | That it failed to load, beside the list that did - decided by the round | Hiding the failed list: it reads as nothing waiting |
| Q16 | Does the Needs you count change? | No. Every Still Waiting row is also under Needs action - decided by the round | A count of its own, which could disagree with Needs you |
| Q17 | How is Today laid out? | Three columns: What's New, Still Waiting, Needs you. Needs you keeps its section cards, one under another. Approvals, Recent and All sections stay below, unchanged (recommended) | Folding Approvals into the Needs you column: it squeezes the approve and decline controls |
| Q18 | Does the reminder reach Slack? | Yes. One message at 08:00 Hong Kong time every day to one channel, with the access token and channel set per environment | Email or a message to each operator, which needs an address or Slack account for each; 09:00 or weekdays only |
| Q19 | What does the Slack message carry? | Every row, not scoped to one operator, and no winner name, email or phone. A link on each row | Per-grant filtering, which a shared channel cannot do; naming the winner, which puts a customer's name in a channel - decided by the round |
| Q20 | Does Slack post on a day with no rows? | No - decided by the round | An all-clear post each day, which is noise |
| Q21 | How long is each list in Slack? | The first 10 rows, then a link to Today saying how many more - decided by the round | Every row: a long message is hard to read and Slack caps its size |
| Q22 | What if the send fails? | It is tried again and the day's message never posts twice - decided by the round | Posting on every attempt: the channel would see duplicates |
| Q23 | How many rows does the console show? | All of them, in each list. Only Slack stops at 10 - decided by the round | A cap in the console: a row the operator cannot see is a forgotten job |
| Q24 | Where does the dialog open, and when is the day checked? | Over whichever console page the operator lands on, once, when they enter. A session that crosses midnight checks again on the next entry, not mid-session - decided by the round | Opening only on Today: a link to an order would skip it; checking on a timer: a dialog appearing under the operator's hands |
| Q25 | What does Today show for an operator with no rows? | All three columns stay, and an empty list says so. Only the dialog leaves an empty list out - decided by the round | Hiding a column: the page would shift between operators and between days |
| Q26 | What does a sold listing's row show if its order is already Cancelled? | The row stays, with the order's status as it is now - decided by the round | Dropping the row: the operator would not learn the lot closed |
| Q27 | Are test lots treated differently? | No. They are listed like any other lot; production has none - decided by the round | Hiding them: a second rule for something production never meets |
| Q28 | When is the lists' data read? | When Today loads, when the operator comes back to the tab, and on Refresh; never on a timer. The dialog reads when it opens - decided by the round | Polling: Today already refuses it |
| Q29 | What if the 08:00 Slack post fails? | It is tried again through the same Hong Kong day and logged loudly each time, and it is never posted on the next day, when "yesterday" has moved - decided by the round | Posting late the next day: its What's New list would name the wrong day; giving up silently |
| Q30 | How is a long lot title shown in Slack? | The listing code, then the lot title cut to 60 characters - decided by the round | The full title: a long title pushes a row over several lines |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/console/daily-reminder | At exactly 48 hours, is an order listed? The PRD rule says "48 hours since the order's wait began" and the Still Waiting section says "has waited 48 hours" (listed at 48:00), while the proposal's metric says "more than 48 hours" (listed after). The draft case lists it at exactly 48. | |
| grade10-admin/console/daily-reminder | What counts as an "entry" that opens the dialog and re-checks the day: a full page load, a return to the tab, a sign-in, or in-app navigation? The drafts use a reload and a fresh navigation; a session that crosses midnight "checks again on the next entry" is otherwise undecidable. | |
| grade10-admin/console/daily-reminder | Does the dialog open on a sign-in page or before sign-in finishes, for an operator who follows a deep link while signed out? Which pages are "console pages" for the dialog? | |
| grade10-admin/console/daily-reminder | In a browser that blocks storage, does a reload in the same tab open the dialog again? "Once per tab session" with no storage means the mark can only live in memory, which a reload clears. | |
| grade10-admin/console/daily-reminder | What counts as "closing" the dialog: the close control, Escape, a click outside, or opening a row through it? Does following a row link out of the dialog keep it closed for the day? | |
| grade10-admin/console/daily-reminder | Which grant opens an unsold listing's page, so which operators see an unsold What's New row? The Grants table lists listing work under `auction:write` and `auction:operate` and Orders under `auction:read`, but never says who may open a listing page. A reading-only or finance operator's view of an unsold row cannot be decided. | |
| grade10-admin/console/daily-reminder | What does a flagged payment do to a row that is otherwise in Preparing Invoice, Payment Verifying or Preparing Shipment past 48 hours? The PRD says flagged orders are not listed ("Needs you counts them") but Still Waiting is chosen by status. Is such an order listed or left out? | |
| grade10-admin/console/daily-reminder | Does a listing called off before its close, or one closed with no bids, count as an unsold closed listing in What's New? "Closed" and "unsold" are not defined beyond sold versus unsold. | |
| grade10-admin/console/daily-reminder | If one list fails to load and the other has no row, or both fail, does the dialog open? And on Today, how does a failed list show? The PRD states the failure only for the dialog, beside the list that loaded. | |
| grade10-admin/console/daily-reminder | What does a read from a caller with no auction grant return: no rows or a refusal? The drafts assert no dialog in the console and leave the API answer open. | |
| grade10-admin/console/daily-reminder | How is "how long the order has waited" shown in the console and as "days waited" in Slack: whole days rounded down, up, or hours and minutes? A 49-hour wait could read 2 days or 49 hours. | |
| grade10-admin/console/daily-reminder | When one list has rows and the other none, what does the Slack message show for the empty list: the list omitted, or a line saying none? | |
| grade10-admin/console/daily-reminder | When a lot title is cut to 60 characters in Slack, is an ellipsis added, and does it count toward the 60? | |
| grade10-admin/console/daily-reminder | Two orders with the same wait, or two listings with the same close time: what is the tie order in the console and in Slack's first 10? | |
| grade10-admin/console/daily-reminder | For how long, and how many times, is a failed Slack send retried within the Hong Kong day, and what happens once the day ends with no success beyond the loud log line (any alert, any visible state)? | |
| grade10-admin/console/daily-reminder | When the channel or token is missing from the environment, is that a logged error or silent? "Without them nothing posts" does not say, and the principle is to fail loud. | |
| grade10-admin/console/daily-reminder | Where is the Refresh the lists are re-read on: which control on Today, and does the dialog have one? The decisions name "Refresh" without saying where it is. | |
| grade10-admin/console/daily-reminder | If the worker stops after Slack accepts the day's post and before the post is recorded as sent, the retry posts the day's message again, because Slack has no key to refuse a repeat. Is that rare second post accepted, or must the message never post twice even then? A lost reply from Slack is the same case. | |
| grade10-admin/console/daily-reminder | Should the Slack message show link previews for the console links, or none? No decision row says. | |
| grade10-admin/console/daily-reminder | An operator enters with no row in either list, so no dialog opens and nothing is closed. If an order reaches 48 hours later the same Hong Kong day, does the next entry open the dialog, or is the day over for that operator? | |
| grade10-admin/console/daily-reminder | The Approvals card sits inside the Needs you grid on Today now, while the page says Approvals, Recent and All sections "stay as they are" below the columns. Is lifting the Approvals card out of Needs you into its own section under the columns intended? | |
