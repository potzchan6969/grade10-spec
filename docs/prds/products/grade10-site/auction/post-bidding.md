---
title: Post-Bidding
spec: grade10-site/auction/winner-order
order: 4
---

What happens when a lot closes: the result and its letters, then the winner's
order from a confirmed address to a delivered card.

## Result and Notification

- **Ended** — the lot reads Ended on every page, with or without a winner,
  whatever happens to the order — [Lot
  Status](/p/grade10-site/auction/display#auction-details)
- **The hold is released** — at the close, for everyone; a winner's hold is
  never captured, and a losing bidder's row on My Auctions says whether it is
  being released or released
- **The winner** — gets the auction-won letter asking for a delivery address
  by `Confirm by …`; their My Auctions row reads Won with View order, and the
  lot joins My Auction Orders
- **Everyone else** — a bidder who lost hears once that the lot closed and
  they did not win; a watcher hears once that it ended, Ended only when
  nobody bid — [Bidding ·
  Notifications](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications)

## Winner Order

Winner Order is the page where a collector settles one lot: the address, the
invoice, the payment, the receipt, the shipment and the delivery, together. A
winner of three lots has three orders, each with its own deadlines.

| Rule | Value |
| --- | --- |
| Order setup | **48 hours** from the lot's actual close to confirm a delivery address and a payment method |
| Payment | **7 calendar days** from when Grade10 sends the invoice, never from the close; nothing the winner does moves it |
| Buyer's premium | **20%** of the winning bid, rounded half up, or the currency's minimum charge when higher — **0** in USD, HKD and JPY |
| Payment proof | 🚧 **1 to 5** PDF, JPEG or PNG files of up to **10 MB** each, uploaded once |
| Records | 🚧 Invoice and receipt PDFs kept at least **7 years**, or for the life of the account if longer |

:::flow{title="Settling a won lot"}
## *Grade10* — **Opens the order**
At the close: the auction-won letter asks for a delivery address.
## *Winner* — **Confirms the address and the payment method**
Within 48 hours; the order reads Preparing Invoice.
## *Operator* — **Sends the invoice**
Shipping and insurance priced for that address; the 7-day payment window
starts — [Auction Management · Payment](/p/grade10-admin/auction/management#payment).
## *Winner* — **Pays**
By card, one charge for the order total, or by bank transfer quoting the
reference and uploading proof an operator checks.
## *Grade10* — **Records the payment**
The order reads Processing, and the receipt and its letter go out.
## *Operator* — **Ships**
Carrier and tracking number; the order reads Shipped.
## *Carrier* — **Delivers**
The proof is recorded and the order reads Delivered.
:::

### My Auction Orders

🚧 Every won lot on one list, opened from the account menu beside My
Auctions: the lot with View lot, the auction, the winning bid, the status and
one next action — Confirm address while Awaiting Address, Pay Invoice while
Pending Payment, an expired invoice included, and View detail otherwise.
Orders waiting on the winner come first, then the rest by newest close, and
an empty list points to My Auctions.

::changes{spec="grade10-site/auction/auction-orders"}

### Lifecycle

An auction order has one status, derived from its invoice, address,
fulfilment and delivery facts, that the winner, the operator and My Auctions
all read. It shares label names with the store's order status, and no
meaning.

::image{src="assets/diagrams/auction-order-status.svg" alt="An auction order from Awaiting Address through Preparing Invoice, Pending Payment and Processing to Shipped and Delivered, with Payment Verifying beside Pending Payment, and Cancelled and Refunded as its endings"}

| Status | Invoice reads | Reached when |
| --- | --- | --- |
| **Awaiting Address** | Not issued | The lot closes with a winner |
| **Preparing Invoice** | Not issued | The winner confirms an address, or an operator records one after the deadline |
| **Pending Payment** | Pending, or Expired past the deadline | An operator sends or reissues the invoice; an expired invoice keeps this status |
| 🚧 **Payment Verifying** | Payment Verifying | The winner uploads bank transfer proof; the deadline stops until an operator confirms or returns it |
| **Processing** | Paid | A card payment is confirmed, the proof is confirmed, or an operator settles manually |
| **Shipped** | Paid | The warehouse dispatches, with a tracking number |
| **Delivered** | Paid | The carrier confirms delivery |
| **Cancelled** | Cancelled | An operator cancels an unpaid order; the lot goes back to stock |
| **Refunded** | Refunded | A paid invoice is refunded; failing to pay is never Refunded |

- **Read, never written** — one ordered rule chain derives it, so it cannot
  contradict the facts; dispatch before payment, cancelling a dispatched
  order and delivery before dispatch are refused
- 🚧 **Missed address deadline** — the status stays where it is; the winner
  can no longer confirm an address until an operator reopens the form
- 🚧 **A reissued invoice** — replaces the old one, which keeps no status of
  its own; a proof under check never expires

### Notification

Every letter identifies the lot, goes to the winner's registered address and
opens that lot's order, sign-in first when signed out; the lot image and title
open it too.

| Letter | When | What it carries |
| --- | --- | --- |
| Auction won | The lot closes with a winner | The setup steps and `Confirm by …`; no amount yet |
| 🚧 Setup reminder | **24** and **72 hours** after the close, while setup is incomplete | The steps and `Confirm by …` |
| 🚧 Setup overdue | The setup deadline passes | Self-service setup is closed; Contact Us for manual review; the order may be cancelled and the lot re-listed after review, never automatically |
| Payment reminder | At send, then **day 3** and **day 6** while the invoice is pending | The total and `Pay by …`; View invoice and pay |
| 🚧 Final notice | **24 hours** before the payment deadline, while Pay is still offered | The last payable reminder |
| 🚧 Payment overdue | The invoice expires unpaid | What remains owed; Pay is closed; Contact Us for manual review; the order may be cancelled and the lot re-listed after review |
| Invoice reissued | An operator reissues | The new invoice and its deadline |
| 🚧 Proof not accepted | An operator returns the proof | The operator's reason for the winner and `Pay by …`; none when proof is uploaded |
| Payment received | Card confirmed, proof confirmed, or a manual settlement | Amount, date, the method — card brand and masked number, or Bank Transfer — the Receipt ID and the receipt PDF, the only attachment any letter carries |
| Shipped | Dispatch | The delivery address, then the carrier and tracking number; the primary action is the carrier's tracking |
| Delivered | The carrier confirms delivery | Delivery confirmation naming the lot |
| Order cancelled | An operator cancels | That the order was cancelled |

- **Reminders stop at payment** — every outstanding reminder is cancelled the
  moment payment is received, and a reissue restarts the series for the new
  invoice
- 🚧 **Invoice sent** — the letter at send is the first payment reminder;
  there is no separate invoice-sent letter
- 🚧 **Reminders on hold** — none go out while proof is checked; if it is
  returned the sequence resumes on the moved clock, skipping and repeating
  nothing
- ❓ **Reminder clock across changes** — the bank-transfer change keeps a
  separate invoice-sent letter, a final notice immediately before expiry and
  an invoice-expired letter, while the setup-overdue-mail change folds, moves
  and replaces them; Product reconciles before the deltas land
- ❓ **Billing address** — the order form offers none, while the auction-won
  and setup-reminder letters name one among the setup steps; Product and
  Design reconcile

### Invoicing Confirmation

Before any invoice, the winner confirms where to ship and how they will pay.

- **Address** — a saved address or a new one; the account default is
  pre-filled but still confirmed, and the order keeps a snapshot — [Account ·
  Delivery Address
  Management](/p/grade10-site/auction/account#delivery-address-management)
- 🚧 **Form** — name, phone, country or region, town or city, address line 1,
  state or province and postal code are required; an empty one is refused
  beside the field, and the phone's format is not checked
- 🚧 **Payment method** — chosen with the address, nothing preselected, each
  choice showing the fee range Grade10 sets: card in every currency, bank
  transfer in a currency with bank details — HKD at launch
- ❓ **Fee range wording** — what each choice says; the bank transfer wording
  names no amount, because the operator sets that fee; Product confirms
- **Deadline** — `Confirm by …` under Confirm; when it passes, Confirm is
  hidden, the alert reads Missed address deadline with Contact Us, the status
  stays, and nothing cancels or suspends
- 🚧 **After the deadline** — the whole form closes; only Grade10 reopens it
  for a fresh 48 hours, or records an address the winner gives by phone
- 🚧 **Locked on confirming** — the winner changes neither the address nor
  the method afterwards; an operator edits them on request before send and
  reissues after, and the order shows what changed
- ❓ **One-time address after a reload** — whether it survives leaving and
  returning to the order; Product and Design confirm

### Invoicing

One operator-sent invoice per lot, never combined with another; no amount is
shown before send, and the sent invoice never re-prices.

| Line | What it is |
| --- | --- |
| Winning Bid | The accepted bid that won the lot |
| Buyer's Premium | 20% of the winning bid or the currency minimum; Grade10 computes it, and no operator enters, waives or changes it |
| Shipping & Handling | Quoted for the confirmed address; zero reads Free, and a difference found after payment is neither charged nor refunded |
| Insurance | Optional and more than zero; the line is absent when none |
| Subtotal | The lines above; the page summary may leave it out, the invoice and receipt keep it |
| Payment Processing Fee | Priced by method and fixed at send; for card, grossed up from the Subtotal from the provider's live fees, so Grade10 keeps the Subtotal whole |
| Order Total | Subtotal plus the fee — what the winner pays |

- 🚧 **Bank transfer fee** — the amount the operator enters on each invoice,
  Free when zero
- 🚧 **Invoice ID** — `INV-202609-LK7P2Q-01`: the month sent, the listing's
  code and the count; a reissue gets a new ID and bank reference, and the old
  ones still find the order
- **PDFs** — the invoice once sent and the receipt once paid, on one row;
  hidden when Cancelled
- **Payment deadline** — an absolute date and time in the winner's zone, with
  no countdown

::image{src="assets/diagrams/auction-payment.svg" alt="Paying an auction invoice: the winner pays by card and the provider confirms it, or transfers and uploads proof an operator confirms or returns; an unpaid invoice expires on day 7 and is reissued, settled or cancelled"}

### Payment Flow, Wire

- 🚧 **Bank details** — the invoice shows SWIFT, FPS and Hong Kong local
  transfer details instead of card Pay, and the reference to quote,
  `LK7P2Q01`, with Copy Reference Code
- ❓ **The accounts** — the details for each of the three ways; Finance
  confirms
- 🚧 **Payment proof** — uploaded once after paying, behind a confirm step
  saying nothing can be added later; the order reads Payment Verifying, the
  deadline stops, and Pay and further uploads are hidden
- 🚧 **Manual confirmation** — an operator confirms the proof, or returns it
  with a reason the winner reads, the latest only; the deadline runs again
  with the time that was left, and the winner uploads again — [Auction
  Management · Payment](/p/grade10-admin/auction/management#payment)
- 🚧 **Proof stays private** — the winner never sees a proof file or its name;
  the order shows only that proof was sent
- ❓ **Contact channel** — how an operator reaches a winner about a transfer
  or a proof; WhatsApp is the working assumption, on the number from the
  address form; Operations confirms

### Payment Flow, Online

- **Card** — a fresh charge for the order total while the invoice is pending,
  on a stored card or another; Grade10 confirms it on its own, and a declined
  attempt leaves the invoice payable until the deadline
- 🚧 **Unfinished payment** — a payment that times out or is abandoned says
  so and leaves Pay Now ready; a completed one reads Confirming payment until
  Grade10 records it
- 🚧 **Started in time** — a payment received before the deadline completes
  even if it confirms after; one received at or after it is refused, and the
  card is not charged

### Receipts

- **Receipt** — the itemised amounts and how it was paid: card brand and last
  four, or the method and reference an operator recorded, marked as manually
  settled
- 🚧 **A confirmed transfer** — its receipt reads Bank Transfer, not manually
  settled
- 🚧 **Receipt ID** — `REC-202609-LK7P2Q-01-P1`: the month paid and the paid
  invoice's code and count, with the invoice total, earlier payments, this
  payment and the balance due
- ❓ **Formal tax receipt** — whether a receipt must carry Grade10's company
  details and tax ID; Finance confirms

### Logistics

- **Shipment** — the carrier, the tracking number and a link to the carrier,
  then the delivery proof when the carrier provides one; an operator records
  both — [Auction Management ·
  Fulfilment](/p/grade10-admin/auction/management#fulfilment)
- **Progress** — five steps, Address → Invoice → Payment → Shipped →
  Completed, with day-only dates; Cancelled and Refunded show no stepper
- 🚧 **Sections** — Order Information with Invoice Status, Collection Method,
  Order Status with a time per step, and Lots; Payment Verifying sits under
  Payment

## Edge Cases

| Missed | What the winner sees | What an operator does |
| --- | --- | --- |
| The 48-hour address deadline | Confirm hidden, Missed address deadline with Contact Us; the status stays | Reopens the form for a fresh 48 hours, records an address given by phone, or cancels after review |
| The 7-day payment deadline | Pay hidden, the overdue alert with Contact Us; the status stays Pending Payment | Reissues with a fresh 7 days, settles manually, or cancels; the lot returns to stock with no runner-up offer |

- ❓ **Wrong amount by wire** — a transfer short of or over the invoice:
  several payments against one invoice, a shortfall tolerance, overpayment
  and refunds are a separate change; until then an operator settles at the
  invoice's full total or reissues; Product and Finance confirm
- **Overdue penalties** — a missed payment deadline suspends the bidder,
  below; ❓ what "penalties or extra charges" in the overdue letters means
  beyond that, Product confirms

### Bidder Suspension

A suspension is an auction-only restriction. It starts when any one of the
winner's invoices goes unpaid past its deadline, whatever they have paid on
other lots.

| While suspended | Allowed |
| --- | --- |
| Place a new bid | No |
| Raise a standing maximum | 🚧 No |
| Standing maxima on open lots | 🚧 Keep bidding to their cap, and can win; each lot won gets its own order and deadline |
| Pay what is owed | Yes; paying, and a reissue, lift nothing — only an operator's reinstatement does |
| Store, loyalty, sign-in, reading the account and its orders | Yes |

- **Told at once** — the notice names what is owed and how to resolve it, and
  My Auctions explains the restriction beside the affected order
- 🚧 **By an operator** — an operator suspends or reinstates from the
  account's panel on the admin Users page, with a required reason the
  collector never sees; a new cause while suspended is recorded beside the
  first, and reinstating lifts every cause
- 🚧 **Bid history untouched** — a suspension adds, edits and removes nothing
  in any lot's history, and no lot's price or leader changes because of it
- ❓ **Bidders ban** — whether the auction admin's Bidders ban is this same
  suspension; Engineering confirms

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service): the order, invoice and fulfilment records, and the derived status
- **Blocks** — `AuctionOrderList`, `AuctionOrderRow`, `AuctionOrderDetail` and `AuctionAddressForm`, in `packages/ui` — [Auction Order Blocks](/p/shared/ui/auction-order)
- **Grant** — `auction:moderate`, the one grant that suspends and reinstates, in the auction service and on the admin Users panel
- **Mail** — `apps/emails/emails/auction/`
- **Identifiers** — [Grade10 Invoicing Identifiers](/references/grade10-invoicing-identifiers)
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/auction/winner-order"}

::cases{id="grade10-site/auction/order-status"}

::cases{id="grade10-site/auction/notifications-order"}

::cases{id="grade10-site/auction/bidder-suspension"}
:::

:::detail{title="Product decisions" for="pm"}
The winner needs one place to understand what is owed and what happens next,
so the page is order-native: a collector who wins several lots gets one
independent deadline, address snapshot, payment and shipment for each. One
derived status keeps the winner, the operator and My Auctions aligned without
a second mutable ledger. Post-close mail is its own capability so a reminder
cannot be mistaken for a bidding alert. A suspension looks forward only: a
maximum is a binding bid others have bid against, so withdrawing it would move
prices on lots the missed payment has nothing to do with.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | A lot has just closed | Confirms where to ship within 48 hours, waits for the quote, then sees the invoice and its deadline. |
| Winner | The first payment attempt fails before the deadline | Understands the refusal and retries while the invoice is pending. |
| Winner | The card has been dispatched | Finds the receipt, the tracker and the delivery proof later. |
| Suspended winner | The payment deadline passed | Sees what remains owed, why bidding stopped, and Contact Us — not a Pay control. |
| Finance operator | A winner pays by bank transfer | Checks the proof or records the payment without rewriting who won. |

**Not in scope.** Combined invoices, payment plans, buyer-initiated returns,
a second payment provider, and changes to the bid-time rules.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Line names | Decided | Hammer price reads Winning Bid, Shipping reads Shipping & Handling, Final amount reads Order Total, for the winner and the operator; zero shipping reads Free; Insurance is optional and above zero. | Product |
| Buyer's premium | Decided | 20% of the winning bid alone, rounded half up, or the currency's minimum when higher; Grade10 computes it; the rate is disclosed on the bid panel only. The minimum is one Grade10-owned amount per currency under Payment Settings, 0 at first, applied to invoices sent or reissued after it takes effect. | Product and finance |
| Payment processing fee | 🚧 In flight | On every invoice, priced by method: card grossed up from the Subtotal at send from the provider's live fees, never from an admin rate; bank transfer entered by the operator, no cap. A fee that costs more than quoted is absorbed; the sent invoice never re-prices. | Product (@jeffffej0909) |
| Bank transfer by the winner | 🚧 In flight | The winner may pay by bank transfer and upload proof, reversing the card-only rule; card fees on high-value lots make a transfer worth offering. Proof waiting for an operator reads Payment Verifying to both, and stops the deadline, which resumes with the time left if the proof is returned. A confirmed transfer's receipt reads Bank Transfer. | Product (@jeffffej0909) |
| Fee disclosure | 🚧 In flight | The winner chooses a method on a fee range Grade10 sets; the amount first shows on the sent invoice, and an operator reissues if the winner then wants the other method. | Product (@jeffffej0909) |
| Winner's choice locks on confirming | 🚧 In flight | Once the winner confirms the address and method, only an operator changes them: an edit with a reason before send, a reissue after. | Product (@jeffffej0909) |
| Address deadline | Decided | 48 hours from lot close. A miss hides Confirm and shows Contact Us; the status stays, no invoice is issued, nothing cancels or suspends automatically. The account address book is unaffected. | Product (@tangconst) |
| Reopening the address form | Decided | An operator, with payment processing and a reason, reopens it once the deadline passes before an address was confirmed, for a fresh 48 hours; never on a cancelled order; no letter, the operator tells the winner. Or the operator records an address given by phone without reopening. | Product (@jeffffej0909) |
| Payment deadline | Decided | 7 calendar days from invoice send, not from lot close, as an absolute datetime with no countdown. At expiry Winner Order hides card Pay and shows Contact Us; the invoice does not create an Expired order status; a card payment received before the deadline counts even if it confirms after. | Product (@tangconst, @jeffffej0909) |
| Cancelled vs Refunded | Decided | Failing to pay ends as Cancelled when an operator cancels; Refunded is paid→refund only. A missed address deadline creates no status of its own. | Product |
| Progress stepper | Decided | Five presentation steps, Address → Invoice → Payment → Shipped → Completed, with day-only dates; the status keeps its nine names, Payment Verifying under Payment, Processing under Shipped, Delivered as Completed. | Product and design (@tangconst) |
| Invoice and receipt PDFs | Decided | The winner views and downloads the invoice after send until Cancelled, and the receipt after payment, on one row. Only the payment-received letter attaches a PDF, the receipt. | Product and design (@tangconst) |
| Identifiers | 🚧 In flight | Each ID names its listing by a code hashed from the listing's internal id, not a running count, so the IDs do not reveal how much Grade10 sells; operators keep a separate gapless audit number the winner never sees — [Grade10 Invoicing Identifiers](/references/grade10-invoicing-identifiers). | Product (@jeffffej0909) |
| Setup mail | 🚧 In flight | Setup reminders at 24 and 72 hours after close while setup is incomplete; auction-won and setup-reminder letters name delivery address, payment method and billing address as bullets; setup overdue is generic, names manual review, and never cancels automatically. | Product (@tangconst) |
| Payment mail | 🚧 In flight | The first payment reminder goes at send, then day 3 and day 6 on the running deadline; the final notice 24 hours before the deadline while Pay is offered; payment overdue replaces invoice-expired. Letters name the total and `Pay by …`, never a method. | Product (@tangconst) |
| Letter CTA | Decided | Default opens the lot's Winner Order, sign-in first; overdue letters lead with Contact Us; the Shipped letter leads with the carrier's tracking. | Product (@tangconst) |
| A separate orders page | Decided | Won lots are followed on My Auction Orders — needs action first, then newest close — and each Won row opens the order. | Product |
| Suspension | Decided | Auction-only, forward-looking; a standing maximum keeps bidding and can win; only an operator's reinstatement lifts it, and the operator's reason is never shown to the collector. | Product |
| Billing address on setup | ❓ Open | The order form offers none, while the letters name one among the setup steps. | Product and design (@tangconst) |
| Reminder clock across changes | ❓ Open | `add-winner-bank-transfer` and `add-winner-setup-overdue-mail` disagree on the invoice-sent letter, the final notice's time and the letter at expiry; one delta supersedes the other before either lands. | Product (@tangconst, @jeffffej0909) |
| Overdue penalties | ❓ Open | What "penalties or extra charges" means after a setup miss vs a payment miss. | Product (@tangconst) |
| Partial payment | ❓ Open | A separate change: several payments against one invoice, a shortfall tolerance, overpayment and refunds. | Product and finance |
| Formal tax receipt | ❓ Open | Whether a receipt must carry Grade10's company details and tax ID. | Finance |
| One-time address persistence | ❓ Open | Whether an unsaved one-time address survives leaving and returning to the order. | Product (@tangconst) |
| Bidders ban and suspension | ❓ Open | Whether the auction admin's Bidders ban is this same suspension. | Engineering |
:::
