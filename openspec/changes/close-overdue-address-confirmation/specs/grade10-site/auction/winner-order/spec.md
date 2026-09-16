## Purpose
What a winner is handed when a lot closes and what they do with it: two
windows that end — 48 hours to confirm where the lot ships, then 7 days from
send to pay the invoice an operator quotes for that address — a single fresh
card charge, and the receipt, tracker and delivery proof the order keeps
afterwards. A window that has closed is reopened by Grade10, never by the
winner.

## Feature set

- Order at lot close
  - Address first: a closed lot opens an order that waits for the winner's delivery address, with no invoice and nothing yet to pay
  - One order per lot: a winner of three lots confirms three addresses and receives three invoices
- Invoice
  - Operator quote: Shipping & Handling, and Insurance when added, are quoted by an operator for the confirmed address, never estimated
  - Order total: names every component a winner is asked to pay, so a total is explicable line by line
  - Invoice PDF: once sent, the winner can view and download the invoice; hidden before send and when Cancelled
- Delivery address
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it, which is what lets an invoice be prepared
  - Address window: 48 hours from lot close to confirm one, shown as the datetime the entrance closes
  - One entrance, not two: a closed window refuses a first confirmation and a change to a confirmed address alike
  - Reopening: only an operator reopens the entrance, and a reopen starts a fresh 48 hours
  - Locking at send: the address stops moving once the invoice is sent; a change after that goes through Grade10
- Settlement
  - Card only for the winner while `pending`: the order offers one payment method; every other method is an operator's backup
  - Expired ends self-service Pay: when the invoice is `expired`, card Pay is hidden and Contact Us appears in the overdue alert
  - Hold release: the bid-time authorization verified a bidder and is not the instrument that settles
- Payment deadline
  - Seven days from send: the window opens when the winner has an amount to pay, not before
  - Absolute datetime display: the deadline is shown as a datetime in the winner's zone; no countdown
- Progress presentation
  - Five steps: Address → Invoice → Payment → Shipped → Completed; Cancelled and Refunded show no stepper
- Records the winner keeps
  - Payment receipt: what was paid, itemised, with the method that paid it
  - Shipping tracker and delivery proof: unchanged
