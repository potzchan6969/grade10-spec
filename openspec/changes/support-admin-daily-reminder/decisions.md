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
- Changing what Approvals, Recent or All sections show on Today.
- Rows for Setup Overdue or Payment Overdue: Needs you already counts them.
- A retry, or a stored record of each day's Slack send.
- Inventory or vault rows.
- A window longer than the previous day for an operator who was away.
- Specifying the Today page as a whole; only its three columns.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the console store a message for each operator, with a bell and read state? | No. A daily reminder read from current listings and orders | A notification table with a bell and per-operator read state: it could say an order needs action after the worklist says it does not |
| Q2 | Where does "seen today" live? | In the browser's storage, per operator and Hong Kong day. It is cleared when the operator signs out, and another browser keeps its own. Where the browser keeps nothing between loads, the dialog opens once per page load | A server-side row per operator and day: a second source of truth for a reminder. A mark held only in page memory, which would reopen the dialog on every reload |
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
| Q13 | Do Setup Overdue, Payment Overdue and flagged payments join Still Waiting? | Setup Overdue and Payment Overdue do not: Needs you counts them. A flagged order in a waiting status is listed by its own wait (Q31) | Giving each overdue status a wait of its own: it repeats Needs you |
| Q14 | Does the dialog open when neither list has a row? | No - decided by the round | An all-clear dialog each day, which trains operators to close it unread |
| Q15 | What does a list that fails to load show? | That it failed to load, beside the list that did - decided by the round | Hiding the failed list: it reads as nothing waiting |
| Q16 | Does the Needs you count change? | No. Every Still Waiting row is also under Needs action - decided by the round | A count of its own, which could disagree with Needs you |
| Q17 | How is Today laid out? | Three columns: What's New, Still Waiting, Needs you. Needs you keeps its section cards, one under another. Approvals, Recent and All sections stay below, unchanged (recommended) | Folding Approvals into the Needs you column: it squeezes the approve and decline controls |
| Q18 | Does the reminder reach Slack? | Yes. One message at 08:00 Hong Kong time every day to one channel, with the access token and channel set per environment | Email or a message to each operator, which needs an address or Slack account for each; 09:00 or weekdays only |
| Q19 | What does the Slack message carry? | Every row, not scoped to one operator, and no winner name, email or phone. A link on each row | Per-grant filtering, which a shared channel cannot do; naming the winner, which puts a customer's name in a channel - decided by the round |
| Q20 | Does Slack post on a day with no rows? | No - decided by the round | An all-clear post each day, which is noise |
| Q21 | How long is each list in Slack? | The first 10 rows, then a link to Today saying how many more - decided by the round | Every row: a long message is hard to read and Slack caps its size |
| Q22 | What if the send fails? | The message is sent once and nothing records the send. A failure is logged loudly and that day's message is lost - decided by the owner | Retrying through the day with a record of each day's send, which needs a table and a rule against posting twice |
| Q23 | How many rows does the console show? | All of them, in each list. Only Slack stops at 10 - decided by the round | A cap in the console: a row the operator cannot see is a forgotten job |
| Q24 | Where does the dialog open, and when is the day checked? | Over whichever console page the operator lands on, once, when they enter. A session that crosses midnight checks again on the next entry, not mid-session - decided by the round | Opening only on Today: a link to an order would skip it; checking on a timer: a dialog appearing under the operator's hands |
| Q25 | What does Today show for an operator with no rows? | All three columns stay, and an empty list says so. Only the dialog leaves an empty list out - decided by the round | Hiding a column: the page would shift between operators and between days |
| Q26 | What does a sold listing's row show if its order is already Cancelled? | The row stays, with the order's status as it is now - decided by the round | Dropping the row: the operator would not learn the lot closed |
| Q27 | Are test lots treated differently? | No. They are listed like any other lot; production has none - decided by the round | Hiding them: a second rule for something production never meets |
| Q28 | When is the lists' data read? | When Today loads, when the operator comes back to the tab, and on Refresh; never on a timer. The dialog reads when it opens - decided by the round | Polling: Today already refuses it |
| Q29 | Is a missed 08:00 Slack post made up later? | No. The next message is the next day's 08:00 - decided by the owner | Posting late the same day or the next: it needs the record Q22 dropped, and a next-day post would name the wrong day |
| Q30 | How is a long lot title shown in Slack? | The listing code, then the lot title cut to 60 characters - decided by the round | The full title: a long title pushes a row over several lines |
| Q31 | Is an order with an open payment flag listed in Still Waiting? | Yes, by its own wait, when it is in Preparing Invoice, Payment Verifying or Preparing Shipment past 48 hours. The flag does not start a second clock | Leaving it to Needs you: a forgotten dispatch would hide behind a flag |
| Q32 | What counts as an entry for the dialog? | A full page load of the console, signed in; a deep link while signed out opens it after sign-in, on the first signed-in console page. Returning to the tab or moving between pages does not - decided by the owner | Re-checking on tab focus or on each page: a dialog opening mid-task |
| Q33 | When is the dialog closed for the day, and when does it open again? | The close control, Escape, a click outside and following a row all close it. It opens again in another browser and after signing out and in - decided by the owner | Closing only by the control: a row followed through the dialog would leave it open over the order |
| Q34 | Who sees an unsold row, and what counts as closed? | Reading access opens a listing, so an unsold row needs only that. A listing called off before its close is not listed; one that closed with no bids is Unsold - decided by the owner | A write grant for unsold rows, which the code does not ask |
| Q35 | What if one list fails, or the caller has no auction access? | The dialog opens with the failure and a Retry even when the other list is empty, and Today shows the same in that column. A caller with no auction access is refused, and the console never asks - decided by the owner | Staying closed on a failed empty read, which reads as nothing waiting |
| Q36 | How is the wait shown, and how do rows order? | The console shows days and hours, as `3d 5h`. Slack shows whole days, rounded down, so 48 to 71 hours reads 2 days. Rows order by the exact wait, longest first, and equal waits by listing code, A to Z - decided by the owner | Rounding up, which shows 3 days for 49 hours; ordering Slack by the whole days shown, which can drop a longer wait from the first 10 |
| Q37 | What does Slack show for edge cases? | A list with no row is left out of a message that has rows; a title over 60 characters is cut to 59 and an ellipsis; links show no previews; a missing channel or token posts nothing and logs that it is not configured - decided by the owner | An empty heading with a 'none' line; a bare cut; link previews in a channel |
| Q38 | Do the Slack duplicate window and retry rules stay? | No. With one attempt and no record, a worker that fails after Slack accepts the message can post it again on the next trigger; that is accepted - decided by the owner | Stamping the send before posting, which can lose the message with no sign |
| Q39 | Where does Refresh live? | Today's own Refresh reads all three columns again; the dialog reads when it opens and has none - decided by the owner | A Refresh in the dialog: a second control for the same read |
| Q40 | What if the first entry has nothing, and rows appear later the same day? | Only closing sets the day's mark, so the next entry that has rows opens the dialog - decided by the owner | Setting the mark on any entry: the day's first real row would wait until tomorrow |
| Q41 | Where does Approvals sit on Today? | Below the three columns with Recent and All sections. The card moves out of the Needs you column and is otherwise unchanged - decided by the owner | Keeping it inside the Needs you column, where the code has it today |
| Q42 | How do equal closes order in What's New, and what does Slack's first 10 follow? | What's New lists the latest close first, and equal closes by listing code, A to Z. Slack takes its first 10 by the exact wait or close, not by the days shown - decided by the round | Cutting by whole days, which can drop a longer wait; no tie rule, which reorders rows between reads |
| Q43 | What does the exact wait look like in the console? | Days and hours, as `3d 5h`; under an hour it reads in minutes - decided by the round | Whole days, as Slack does: a 49-hour wait would read the same as a 71-hour one |
| Q44 | What if the session ends without the console's sign-out? | The closed mark stays in that browser until its Hong Kong day ends. Only a sign-out from the console clears it - decided by the round | Keying the mark to the session, which needs the server to remember something about the dialog |
| Q45 | Do Approvals still count in the Needs you total and the summary line? | Yes, both stay as they are. The card sits below the columns, and its count still counts - decided by the round | Dropping approvals from the total: it changes what Today already says |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/console/daily-reminder | At exactly 48 hours, is an order listed? The PRD rule says "48 hours since the order's wait began" and the Still Waiting section says "has waited 48 hours" (listed at 48:00), while the proposal's metric says "more than 48 hours" (listed after). The draft case lists it at exactly 48. | Q12 |
| grade10-admin/console/daily-reminder | What counts as an "entry" that opens the dialog and re-checks the day: a full page load, a return to the tab, a sign-in, or in-app navigation? The drafts use a reload and a fresh navigation; a session that crosses midnight "checks again on the next entry" is otherwise undecidable. | Q32 |
| grade10-admin/console/daily-reminder | Does the dialog open on a sign-in page or before sign-in finishes, for an operator who follows a deep link while signed out? Which pages are "console pages" for the dialog? | Q32 |
| grade10-admin/console/daily-reminder | In a browser that blocks storage, does a reload in the same tab open the dialog again? "Once per tab session" with no storage means the mark can only live in memory, which a reload clears. | Q33 |
| grade10-admin/console/daily-reminder | What counts as "closing" the dialog: the close control, Escape, a click outside, or opening a row through it? Does following a row link out of the dialog keep it closed for the day? | Q33 |
| grade10-admin/console/daily-reminder | Which grant opens an unsold listing's page, so which operators see an unsold What's New row? The Grants table lists listing work under `auction:write` and `auction:operate` and Orders under `auction:read`, but never says who may open a listing page. A reading-only or finance operator's view of an unsold row cannot be decided. | Q34 |
| grade10-admin/console/daily-reminder | What does a flagged payment do to a row that is otherwise in Preparing Invoice, Payment Verifying or Preparing Shipment past 48 hours? The PRD says flagged orders are not listed ("Needs you counts them") but Still Waiting is chosen by status. Is such an order listed or left out? | Q31 |
| grade10-admin/console/daily-reminder | Does a listing called off before its close, or one closed with no bids, count as an unsold closed listing in What's New? "Closed" and "unsold" are not defined beyond sold versus unsold. | Q34 |
| grade10-admin/console/daily-reminder | If one list fails to load and the other has no row, or both fail, does the dialog open? And on Today, how does a failed list show? The PRD states the failure only for the dialog, beside the list that loaded. | Q35 |
| grade10-admin/console/daily-reminder | What does a read from a caller with no auction grant return: no rows or a refusal? The drafts assert no dialog in the console and leave the API answer open. | Q35 |
| grade10-admin/console/daily-reminder | How is "how long the order has waited" shown in the console and as "days waited" in Slack: whole days rounded down, up, or hours and minutes? A 49-hour wait could read 2 days or 49 hours. | Q36 |
| grade10-admin/console/daily-reminder | When one list has rows and the other none, what does the Slack message show for the empty list: the list omitted, or a line saying none? | Q37 |
| grade10-admin/console/daily-reminder | When a lot title is cut to 60 characters in Slack, is an ellipsis added, and does it count toward the 60? | Q37 |
| grade10-admin/console/daily-reminder | Two orders with the same wait, or two listings with the same close time: what is the tie order in the console and in Slack's first 10? | Q36 |
| grade10-admin/console/daily-reminder | For how long, and how many times, is a failed Slack send retried within the Hong Kong day, and what happens once the day ends with no success beyond the loud log line (any alert, any visible state)? | Q38 |
| grade10-admin/console/daily-reminder | When the channel or token is missing from the environment, is that a logged error or silent? "Without them nothing posts" does not say, and the principle is to fail loud. | Q37 |
| grade10-admin/console/daily-reminder | Where is the Refresh the lists are re-read on: which control on Today, and does the dialog have one? The decisions name "Refresh" without saying where it is. | Q39 |
| grade10-admin/console/daily-reminder | If the worker stops after Slack accepts the day's post and before the post is recorded as sent, the retry posts the day's message again, because Slack has no key to refuse a repeat. Is that rare second post accepted, or must the message never post twice even then? A lost reply from Slack is the same case. | Q38 |
| grade10-admin/console/daily-reminder | Should the Slack message show link previews for the console links, or none? No decision row says. | Q37 |
| grade10-admin/console/daily-reminder | An operator enters with no row in either list, so no dialog opens and nothing is closed. If an order reaches 48 hours later the same Hong Kong day, does the next entry open the dialog, or is the day over for that operator? | Q40 |
| grade10-admin/console/daily-reminder | The Approvals card sits inside the Needs you grid on Today now, while the page says Approvals, Recent and All sections "stay as they are" below the columns. Is lifting the Approvals card out of Needs you into its own section under the columns intended? | Q41 |
| grade10-admin/console/daily-reminder | What does "oldest first" add when waits are equal? Q36 says equal waits list the oldest first, then by listing code, A to Z, but equal waits begin at the same moment. Is the first tie-break the order's creation, the listing's close, or nothing, with listing code deciding? And what orders What's New rows that closed at the same moment: listing code A to Z, or something else? | Q42 |
| grade10-admin/console/daily-reminder | In Slack, are rows ordered and cut to the first 10 by exact wait, or by the whole days shown? A 49-hour and a 70-hour order both read 2 days; if the days decide, listing code orders them and the 10-row cut can drop the longer wait. | Q42 |
| grade10-admin/console/daily-reminder | What does the console's exact wait read like: hours and minutes, days and hours, or another form, and to which unit is it exact? Q36 says "the exact time" and the cases can only check that it is not rounded to whole days. | Q43 |
