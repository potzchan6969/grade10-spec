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
- Row access
  - By grant: the console shows an operator only the rows whose action their grants allow
  - Empty lists: an empty list is left out of the dialog and said so on Today
- Daily dialog
  - First entry: opens once per Hong Kong day over the page the operator lands on
  - Closed mark: kept in the browser, and once per tab session where storage is blocked
  - Failed read: a list that fails to load says so and never reads as empty
- Today columns
  - Three columns: What's New, Still Waiting and Needs you side by side
  - Product groups: each list groups its rows by product, Auction first
  - Rest of Today: Approvals, Recent and All sections stay as they are
- Slack message
  - Daily post: both lists go to one channel at 08:00 Hong Kong time every day
  - Row links: each row links to its listing or order in the console
  - Shared content: every row, with no winner name, email or phone
  - Quiet and long: nothing posts on an empty day, and each list stops at 10 rows
  - Once a day: a failed send is tried again the same day and never posts twice
  - Environment setup: the channel and token come from the environment
