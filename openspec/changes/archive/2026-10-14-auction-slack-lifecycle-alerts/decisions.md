## Goals

- The team learns in Slack when a listing goes live, ends or is extended, and
  when an order becomes overdue or is flagged, without waiting for 08:00.
- A flagged order appears on Flagged or still waiting the same day, at the top,
  until every flag is cleared.
- Posting never holds a bid, a close, an extension, an order transition or the
  08:00 daily run; lifecycle posts run only after that usual step has
  completed, and every Auction Slack send runs only when both the bot token
  and the channel are non-empty.
- The waiting list's title and daily Slack heading say something is wrong or
  waiting, with a warning mark.

## Non-Goals

- A second Slack channel, token or console setting for lifecycle alerts.
- Retrying or recording lifecycle posts; a durable outbox on the bid path.
- Putting Setup Overdue or Payment Overdue on Today or in the daily Slack list
  when the order is not also flagged.
- Changing Needs you counts, order status derivation, or the worklist.
- Customer names, emails or phones in any Slack message.
- Inventory, vault or other products' lifecycle alerts.
- Redesigning Today beyond the waiting column's title, caption, warning mark
  and row set.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Do Setup Overdue and Payment Overdue join Flagged or still waiting on Today and in the daily Slack list? | No. They stay out unless the order is also flagged. Each gets one Slack message when the status is reached | Listing every overdue order every morning, which repeats Needs you |
| Q2 | Which Slack channel carries lifecycle alerts? | The same Auction channel and token as the daily reminder | A second ops channel, which needs another secret and splits attention |
| Q3 | How many rows when an order is flagged and also past 48 hours in a waiting status? | One flagged row at the top, with the flag reason and wait from the earliest open flag | Two rows, which double-counts one order |
| Q4 | When does "listing goes live" fire? | Once when the listing's scheduled start is reached and bidding is open, with the start time and a console link | At publish time, which can be hours before bids open |
| Q5 | When does "listing is extended" fire? | Once each time soft-close moves the end time, with how long it was extended and the new end time | Only the first extension, which hides later moves in a long duel |
| Q6 | Do overdue and flagged alerts repeat while the order stays that way? | No. Once at the transition. Flagged stays visible on the daily list until cleared; overdue stays in Needs you | Daily repeats for the same overdue or flag, which is noise beside the morning list |
| Q7 | Where does the warning mark appear? | Beside Flagged or still waiting on Today, in the dialog and in the daily Slack list heading, and on overdue and flagged lifecycle messages | Only on lifecycle alerts, which left the morning list looking like ordinary waits |
| Q8 | What is the waiting list called, and what does its caption say? | **Flagged or still waiting**, caption and daily Slack heading **Something wrong or waiting a while, needing your action** | Keeping Still Waiting and Waiting a while, which omit flags |
| Q9 | Which flagged orders are listed? | Every order with an open payment flag, any status and any age, until every flag is cleared | Only flagged orders already past 48 hours in a waiting status |
| Q10 | Must a lifecycle post succeed before the listing or order move completes? | No. Posting is the last step after the usual bid, close, extension, overdue or flag work has already completed; a miss or failure is logged and not retried | Awaiting Slack before answering the bid or committing the close, which risks the sale |
| Q11 | When an order has several open payment flags, which reason does the row and the flagged Slack alert show? | The earliest open flag's reason, matching the wait from that flag (Q3) | The latest reason, which hides the flag that started the wait; every open reason, which crowds a Slack line |
| Q12 | After every flag is cleared, if the order is still past 48 hours in a waiting status, does it appear as a wait row? | Yes, at once, as the ordinary wait row under Flagged or still waiting | Staying off the list until the next morning read, which would hide a cleared flag that still needs work |
| Q13 | If every flag is cleared and a new payment flag opens later on the same order, does Auction post another flagged warning? | Yes. Once at each new flag transition (Q6) | Only the first flag ever on that order, which would miss a fresh flag after finance cleared the last |
| Q14 | When publish opens bidding because the scheduled start is already due, does go-live still fire once? | Yes. Once when bidding opens, whether the start was waited for or already due at publish (Q4) | Only a later scheduled start, which would skip a publish-now live sale |
| Q15 | If the Auction channel or token is missing or empty, how do the morning post and lifecycle alerts behave? | One shared gate for every Auction Slack send: attempt only when both the bot token and the channel are non-empty. If either is missing or empty, skip the send, log not configured, and leave the 08:00 run and every listing or order path untouched; no separate setup (Q2) | Treating a missing or empty env as an error that interrupts the usual step; a second env key; tightening lifecycle only and leaving the morning post vague |
| Q16 | How is "how long it was extended" shown in the listing-extended Slack message? | Whole minutes, rounded down from the seconds the end moved, such as `30 minutes` | Raw seconds, which are hard to read in a channel; a fixed soft-close label that ignores a shorter move to a cap |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/console/daily-reminder | When an order has several open payment flags, which reason does the Flagged or still waiting row and the flagged Slack alert show — the earliest flag's reason, the latest, or every open reason? | Q11 |
| grade10-admin/console/daily-reminder | After every payment flag is cleared, if the order is still past 48 hours in Preparing Invoice, Payment Verifying or Preparing Shipment, does it immediately appear as a wait row under Flagged or still waiting? | Q12 |
| grade10-admin/console/daily-reminder | If an operator clears every flag and later raises a new open payment flag on the same order, does Auction post another flagged lifecycle warning, or only the first flag ever? | Q13 |
| grade10-admin/console/daily-reminder | When a listing's scheduled start is already due at publish and bidding opens at once, does the go-live Slack message still fire once at that open, or is go-live only for a later scheduled start? | Q14 |
| grade10-admin/console/daily-reminder | If Auction's daily reminder channel or token is missing or empty, do the morning post and lifecycle alerts share one not-configured bypass that leaves every usual path untouched, with no separate setup? | Q15 |
| grade10-admin/console/daily-reminder | In the listing-extended Slack message, how is "how long it was extended" shown — whole minutes, seconds, or a fixed human phrase from soft-close? | Q16 |
