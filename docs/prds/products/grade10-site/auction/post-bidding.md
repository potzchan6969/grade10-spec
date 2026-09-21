---
title: Post-Bidding
spec: grade10-site/auction/winner-order
order: 4
---

What happens after a lot stops taking bids: the result, then the winner's
order — set up, invoiced, paid, shipped — and the letters that carry it.

## The Close

Bidding stops, the result is fixed at once, and only the winner gets an order.

- **Every lot reads Ended** — with or without a winner, whatever happens to
  the order afterwards — [Lot
  Status](/p/grade10-site/auction/display#auction-details)
- **Every hold is released** — at the close, for everyone; a winner's hold is
  never captured, and a losing bidder's My Auctions row says whether it is
  being released or released
- **The winner** — gets the auction-won letter asking for setup by `Confirm
  by …`, naming no amount; their My Auctions row reads Won with View order,
  and the lot joins My Auction Orders
- **Everyone else hears once** — a bidder who lost, and a watch-only
  collector, each get one letter about the close and nothing after it —
  [Bidding ·
  Notifications](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications)
- 🚧 **A suspended bidder keeps the result** — suspension stops new bids and
  raises, but it does not retract standing bids or change winner order, invoice,
  payment deadline or payable status

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

- **Sections** — Order Information with Invoice Status and Collection Method,
  Order Status with a time per step, and Lots
- **Progress** — five steps, Address → Invoice → Payment → Shipped →
  Completed, with day-only dates; Cancelled and Refunded show no stepper
- 🚧 **Under Payment** — Payment Verifying and Partially Paid both read
  against the Payment step
- 🚧 **Contact Us** — `support@grade10.com`, subject the invoice or the lot;
  Copy Message first on Winner Order, Open Mail App second; overdue,
  cancelled, delivered and partial-payment letters use the same subject and
  body
- ❓ **Copy Message confirmation** — whether Copy Message shows any success
  chrome beyond the control's own state; Product (@tangconst) confirms

### My Auction Orders

🚧 Every won lot on one list, opened from the account menu beside My
Auctions: the lot with View lot, the auction, the winning bid, the status and
one next action — Complete Order Setup while Awaiting Setup, Pay Invoice
while Pending Payment, an expired invoice included, and View detail
otherwise. Orders waiting on the winner come first, then the rest by newest
close, and an empty list points to My Auctions.

::changes{spec="grade10-site/auction/auction-orders"}

## Order Status

An auction order has one status, derived from its invoice, address,
fulfilment and delivery facts, that the winner, the operator and My Auctions
all read. It shares label names with the store's order status, and no
meaning.

::image{src="assets/diagrams/auction-order-status.svg" alt="An auction order from Awaiting Address through Preparing Invoice, Pending Payment and Processing to Shipped and Delivered, with Payment Verifying and Partially Paid in an operator's hands beneath Pending Payment, Cancelled for an unpaid order, and Refunded reached by a recorded refund from Processing, Partially Paid or Delivered"}

| Status | Invoice reads | Reached when |
| --- | --- | --- |
| **Awaiting Address** | Not issued | The lot closes with a winner and no address is confirmed |
| 🚧 **Setup Overdue** | Not issued | The setup deadline passes with setup incomplete; self-service Confirm is closed |
| **Preparing Invoice** | Not issued | The winner confirms setup, or an operator records an address after the deadline |
| **Pending Payment** | Pending or expired | An operator sends or reissues the invoice |
| 🚧 **Payment Overdue** | Expired | The payment deadline passes with the invoice unpaid; self-service Pay is closed |
| 🚧 **Payment Verifying** | Payment Verifying | The winner uploads bank transfer proof; the deadline stops until an operator confirms or returns it |
| 🚧 **Partially Paid** | Partially Paid | An operator records a payment short of the balance; the deadline stops for good and Pay is not offered again, and the order stays here until a payment closes the balance |
| **Processing** | Paid | A card payment is confirmed, the proof is confirmed, or an operator settles manually |
| **Shipped** | Paid | The warehouse dispatches, with a tracking number |
| **Delivered** | Paid | The carrier confirms delivery |
| **Cancelled** | Cancelled | An operator cancels an unpaid order; the lot goes back to stock |
| **Refunded** | Refunded | 🚧 A refund that closes the sale, on a paid or Partially Paid order, for any amount up to what was paid. An overpayment is not this status. Failing to pay is never Refunded |

- **Read, never written** — one ordered rule chain derives it, so it cannot
  contradict the facts; dispatch before payment, cancelling a dispatched
  order and delivery before dispatch are refused
- 🚧 **Awaiting Setup** — Awaiting Address is renamed, because setup confirms
  a payment method and a billing address as well as an address
- 🚧 **A reissued invoice** — replaces the old one, which keeps no status of
  its own; a proof under check never expires
- **Shipment** — the carrier, the tracking number and a link to the carrier,
  then the delivery proof when the carrier provides one; an operator records
  both — [Auction Management ·
  Fulfilment](/p/grade10-admin/auction/management#fulfilment)
- 🚧 **A cancelled order** — reads `Cancelled on {date}`, keeps the lot and
  the winning bid, and offers Contact Us alone; it gives no reason, and a
  suspension stays until an operator reinstates
- 🚧 **Suspended winner** — the order remains payable and the page gives
  contact guidance without showing the operator's reason
- 🚧 **A refunded order** — reads Refunded as both the order status and the
  invoice status, however much was paid and wherever the card is; no Pay, no
  address form and no letter; the invoice and every receipt already issued
  stay downloadable; Order Summary stays the invoice; an inline alert below
  Order Total shows the amount returned, and opens the reason, note, channel
  and masked card or bank clue the winner can match to their statement
- 🚧 **An overpaid difference** — the order keeps its status on Winner Order
  and on My Auctions; Winning Bid, Shipping & Handling and Order Total stay
  the amount that should have been paid; an inline alert below Order Total
  shows only the difference, with the same detail dialog
- 🚧 **Refund transaction clues** — the dialog shows the channel plus a masked
  destination clue: the card brand and last four digits for a card refund, or
  a masked bank/account clue for a bank transfer; full proof and provider
  reference stay with the operator

## Order Setup

Before any invoice, the winner confirms three things on one form, inside 48
hours of the close.

| The winner confirms | From | Default |
| --- | --- | --- |
| Delivery address | A saved address or a new one; the order keeps a snapshot — [Account · Delivery Address Management](/p/grade10-site/auction/account#delivery-address-management) | The account default, pre-filled and still confirmed |
| 🚧 Billing address | The delivery address, or any saved or one-time address with the same required fields | Same as delivery address, ticked |
| 🚧 Payment method | Card in every currency; bank transfer where the currency has bank details, HKD at launch; each choice shows its fee range | Nothing preselected |

- 🚧 **Form** — name, phone, country or region, town or city, address line 1,
  state or province and postal code are required; an empty one is refused
  beside the field, and the phone's format is not checked; on delivery Add
  Address, country or region lists every country and region A–Z, and any typed
  letter moves the highlight to the next name that starts with it and scrolls
  that name into view
- ❓ **Billing country or region list** — whether billing Add Address uses the
  same full list and typeahead as delivery; Product confirms
- ❓ **Shippable destinations only** — whether the picker later limits to
  destinations Grade10 ships to; until settled the catalogue is complete
- **Deadline** — `Confirm by …` sits under Confirm; a miss closes the whole
  form and only Grade10 reopens it, under Edge Cases
- 🚧 **Locked on confirming** — the winner changes none of the three
  afterwards; an operator edits them on request before send and reissues
  after, and the order shows what changed
- ❓ **Fee range wording** — what each choice says; the bank transfer wording
  names no amount, because the operator sets that fee; Product confirms
- ❓ **One-time address after a reload** — whether it survives leaving and
  returning to the order; Product and Design confirm

## The Invoice

One operator-sent invoice per lot, never combined with another; no amount is
shown before send, and the sent invoice never re-prices. One lot in HKD, paid
by card, reads:

| Line | Example | What it is |
| --- | --- | --- |
| Winning Bid | 100,000 | The accepted bid that won the lot |
| Buyer's Premium | 20,000 | 20% of the winning bid, or the currency minimum; Grade10 computes it, and no operator enters, waives or changes it |
| Shipping & Handling | 800 | Quoted for the confirmed address; zero reads Free, and a difference found after payment is neither charged nor refunded |
| Insurance | 500 | Optional and above zero; absent when none |
| Subtotal | 121,300 | The lines above; the page summary may leave it out, the invoice and receipt keep it |
| Payment Processing Fee | 4,272 | Priced by method and fixed at send; for card, grossed up from the Subtotal at the provider's live fees, so Grade10 keeps the Subtotal whole |
| Order Total | 125,572 | Subtotal plus the fee — what the winner pays |

- 🚧 **Insurance on Order Summary** — before send, Insurance sits with the other
  fee rows as TBD; after send it carries a brief info tooltip (`0.9% of the
  order value during transit`) when the operator added it, and stays absent
  when none
- 🚧 **Bank transfer fee** — the amount the operator enters on each invoice,
  Free when zero
- 🚧 **Invoice ID** — `INV-202609-LK7P2Q-01`: the month sent, the listing's
  code and the count; a reissue gets a new ID and bank reference, and the old
  ones still find the order
- 🚧 **Bill To and Ship To** — both from the order's snapshot, each with
  name, company name, phone and address; they read the same unless the
  winner unticked Same as delivery address
- **PDFs** — the invoice once sent (text link beside the Order summary
  heading) and the receipt once paid (text link under the payment-method
  card); hidden when Cancelled
- **Payment deadline** — an absolute date and time in the winner's zone, with
  no countdown

## Paying

The invoice is paid once and in full; paying it in parts is an operator's
doing, under Edge Cases.

::image{src="assets/diagrams/auction-payment.svg" alt="Paying an auction invoice: the winner pays by card and the provider confirms it, or transfers and uploads proof an operator confirms or returns; an unpaid invoice expires on day 7 and is reissued, settled or cancelled"}

### By Card

- **Card** — a fresh charge for the order total while the invoice is pending,
  on a stored card or another; Grade10 confirms it on its own, and a declined
  attempt leaves the invoice payable until the deadline
- 🚧 **Unfinished payment** — a payment that times out or is abandoned says
  so and leaves Pay Now ready; a completed one reads Confirming payment until
  Grade10 records it
- 🚧 **Started in time** — a payment received before the deadline completes
  even if it confirms after; one received at or after it is refused, and the
  card is not charged

### By Bank Transfer

- 🚧 **Bank details** — the invoice shows SWIFT, FPS and Hong Kong local
  transfer details instead of card Pay, and the reference to quote,
  `LK7P2Q01`, with Copy Reference Code
- 🚧 **Payment proof** — uploaded once after paying, behind a confirm step
  saying nothing can be added later; the order reads Payment Verifying, the
  deadline stops, and Pay and further uploads are hidden
- 🚧 **Payment Verifying alert** — an inline Alert says Grade10 is verifying
  the transfer and will email when payment is confirmed, placed where the
  Preparing Invoice alert sits
- 🚧 **Manual confirmation** — an operator confirms the proof, or returns it
  with a reason the winner reads, the latest only; the deadline runs again
  with the time that was left, and the winner uploads again — [Auction
  Management · Payment](/p/grade10-admin/auction/management#payment)
- 🚧 **Proof stays private** — the winner never sees a proof file or its name;
  the order shows only that proof was sent
- ❓ **The accounts** — the details for each of the three ways; Finance
  confirms
- ❓ **Contact channel** — how an operator reaches a winner about a transfer
  or a proof; WhatsApp is the working assumption, on the number from the
  address form; Operations confirms

### Receipts

- **Receipt** — the itemised amounts and how it was paid: card brand and last
  four, or the method and reference an operator recorded, marked as manually
  settled
- 🚧 **Bill To and Ship To** — the same two addresses as the invoice it
  pays; a later edit or reissue never changes a receipt already issued
- 🚧 **A confirmed transfer** — its receipt reads Bank Transfer, not manually
  settled
- 🚧 **Receipt ID** — `REC-202609-LK7P2Q-01-P1`: the month paid, the paid
  invoice's code and count, and the payment's number
- 🚧 **One receipt per payment** — every receipt for an invoice lists on the
  same Receipt PDF row, oldest first; what each one shows is under Edge Cases
- ❓ **Formal tax receipt** — whether a receipt must carry Grade10's company
  details and tax ID; Finance confirms

## Letters

Every letter identifies the lot, goes to the winner's registered address and
opens that lot's order, sign-in first when signed out; the lot image and
title open it too. The schedule below matches
`grade10-site/auction/notifications-order` and the archived email-kinds
timeline: setup at close / +24h / +48h, payment reminder at send then day 3
and day 6, final notice 24 hours before the payment deadline, payment overdue
at expiry, then shipped, delivered, and order cancelled.

::image{src="assets/diagrams/auction-order-mail.svg" alt="The letters a winner gets, on two clocks. In the 48-hour setup window: auction won at the close, a setup reminder at 24 hours, and setup overdue at 48 hours unless the winner confirms the address, billing and method, which parks them. In the 7-day payment window an operator's invoice opens: the payment reminder at send and again on days 3 and 6, a final notice 24 hours before the deadline, and payment overdue at the deadline unless the winner pays, which cancels every outstanding reminder. Once the money is in: payment received carrying the receipt PDF, then shipped and delivered. Order cancelled reaches the winner whenever an operator cancels an unpaid order, on neither clock"}

| Letter | Sent | What it carries |
| --- | --- | --- |
| Auction won | At the close | The setup steps and `Confirm by …`; no amount yet |
| 🚧 Setup reminder | Close **+ 24 hours**, while setup is incomplete | The steps and `Confirm by …` |
| 🚧 Setup overdue | Close **+ 48 hours**, the setup deadline | Self-service setup is closed; Contact Us for manual review; the order may be cancelled and the lot re-listed after review, never automatically |
| Payment reminder | Invoice send, then send **+ 3** and **+ 6 days** while the invoice is pending | The total and `Pay by …`; View invoice and pay |
| 🚧 Final notice | **24 hours** before the payment deadline, while Pay is still offered | The last payable reminder |
| 🚧 Payment overdue | The payment deadline, unpaid | What remains owed; Pay is closed; Contact Us for manual review; the order may be cancelled and the lot re-listed after review |
| 🚧 Proof not accepted | An operator returns the proof | The operator's reason for the winner, and `Pay by …` on the deadline that runs again |
| Payment received | Card confirmed, proof confirmed, or a manual settlement | Amount, date, the method — card brand and masked number, or Bank Transfer — the Receipt ID and the receipt PDF, the only attachment any letter carries |
| Shipped | Dispatch | The delivery address, then the carrier and tracking number; the primary action is the carrier's tracking |
| Delivered | The carrier confirms delivery | The delivery address and the delivered time; View order first, Contact Us second |
| Order cancelled | An operator cancels | That the order was cancelled and when; no reason and no word on payment; Contact Us first, View order second |

- **Reminders stop at payment** — every outstanding reminder is cancelled the
  moment payment is received
- 🚧 **A reissue restarts the series** — the replaced invoice's reminders
  park and the `payment-reminder` goes again for the new invoice, with its
  total and `Pay by …`; there is no reissued letter of its own
- 🚧 **Reminders on hold** — none go out while proof is checked, and
  uploading it sends no letter at all; if the proof is returned the sequence
  resumes on the moved clock, skipping and repeating nothing
- 🚧 **Partial payments** — no letter kind of their own; reminders stop at
  the first recorded payment, and each receipt is on the order's Receipt PDF
  row

## Edge Cases

| Missed | What the winner sees | What an operator does |
| --- | --- | --- |
| The 48-hour address deadline | Confirm hidden, Missed setup deadline with Contact Us; the order reads Setup Overdue | Reopens the form for a fresh 48 hours, records an address given by phone, or cancels after review |
| The 7-day payment deadline | Pay hidden, the overdue alert with Contact Us; the order reads Payment Overdue | Reissues with a fresh 7 days, settles manually, or cancels; the lot returns to stock with no runner-up offer |

- **Overdue penalties** — a missed payment deadline suspends the bidder,
  below; ❓ what "penalties or extra charges" in the overdue letters means
  beyond that, Product confirms

### Partial Payment

🚧 A winner who cannot pay in one go pays in parts, off the page: an operator
records each payment, the order reads Partially Paid, and the winner's page
locks with Contact Us and a receipt for every payment, never a running
balance. The invoice above, settled in three payments:

| Payment | Amount | Its receipt shows | The operator |
| --- | --- | --- | --- |
| `-P1` | 50,000 | Invoice total 125,572 · previous payments 0 · this payment 50,000 · balance due 75,572 | Records it; the order reads Partially Paid, the deadline stops for good, and card Pay is gone |
| `-P2` | 65,000 | Previous 50,000 · this payment 65,000 · balance due 10,572 | Payments now total 92%: asked to close as Paid or keep it Partially Paid, and keeps it |
| `-P3` | 10,572 | Previous 115,000 · this payment 10,572 · balance due 0 | An exact match closes on its own; the order reads Processing |

- 🚧 **The close prompt** — from the payment that brings the total to 90% of
  the invoice, every payment asks the operator to close as Paid or keep it
  Partially Paid at the real balance; had the third payment been 10,000, the
  operator may close, and the balance reads 0 with no write-off line
- 🚧 **Overpaying** — a payment that would take the total past the invoice is
  accepted after an operator confirmation dialog before the invoice is marked
  Paid; the full payment remains recorded and the excess can be returned
  through the refund flow
- 🚧 **Fixed once paid into** — no reissue and no cancel after the first
  recorded payment; what will not be paid off is settled by hand outside the
  system — [Auction Management ·
  Payment](/p/grade10-admin/auction/management#payment)

## Bidder Suspension

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
- 🚧 **No amount once partly paid** — a Partially Paid order's notice names
  no balance; Contact Us covers it
- 🚧 **By an operator** — an operator suspends or reinstates from the
  account's panel on the admin Users page, with a required reason the
  collector never sees; a new cause while suspended is recorded beside the
  first, and reinstating lifts every cause
- 🚧 **Bid history untouched** — a suspension adds, edits and removes nothing
  in any lot's history, and no lot's price or leader changes because of it
- 🚧 **One auction standing** — the auction admin's Bidders ban is the same auction
  suspension; it does not create a separate standing or a platform ban

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
| Insurance tooltip | 🚧 In flight | On Winner Order's Order Summary, Insurance carries a brief info tooltip — `0.9% of the order value during transit` — beside Buyer’s Premium, Shipping & Handling and Payment Processing Fee. Before send, Insurance shows as TBD with the other fee rows; after send it stays optional and absent when none. Chosen over renaming the line Shipping insurance, and over hiding Payment Processing Fee when Free. | Product (@tangconst) |
| Buyer's premium | Decided | 20% of the winning bid alone, rounded half up, or the currency's minimum when higher; Grade10 computes it; the rate is disclosed on the bid panel only. The minimum is one Grade10-owned amount per currency under Payment Settings, 0 at first, applied to invoices sent or reissued after it takes effect. | Product and finance |
| Payment processing fee | 🚧 In flight | On every invoice, priced by method: card grossed up from the Subtotal at send from the provider's live fees, never from an admin rate; bank transfer entered by the operator, no cap. A fee that costs more than quoted is absorbed; the sent invoice never re-prices. | Product (@jeffffej0909) |
| Bank transfer by the winner | 🚧 In flight | The winner may pay by bank transfer and upload proof, reversing the card-only rule; card fees on high-value lots make a transfer worth offering. Proof waiting for an operator reads Payment Verifying to both, and stops the deadline, which resumes with the time left if the proof is returned. A confirmed transfer's receipt reads Bank Transfer. | Product (@jeffffej0909) |
| Fee disclosure | 🚧 In flight | The winner chooses a method on a fee range Grade10 sets; the amount first shows on the sent invoice, and an operator reissues if the winner then wants the other method. | Product (@jeffffej0909) |
| Winner's choice locks on confirming | 🚧 In flight | Once the winner confirms the address and method, only an operator changes them: an edit with a reason before send, a reissue after. | Product (@jeffffej0909) |
| Address deadline | Decided | 48 hours from lot close. A miss hides Confirm, shows Contact Us, and the order reads Setup Overdue; no invoice is issued, nothing cancels or suspends automatically. The account address book is unaffected. | Product (@tangconst) |
| Reopening the address form | Decided | An operator, with payment processing and a reason, reopens it once the deadline passes before an address was confirmed, for a fresh 48 hours; never on a cancelled order; no letter, the operator tells the winner. Or the operator records an address given by phone without reopening. | Product (@jeffffej0909) |
| Payment deadline | Decided | 7 calendar days from invoice send, not from lot close, as an absolute datetime with no countdown. At expiry Winner Order hides card Pay and shows Contact Us; the invoice is `expired` and the order reads Payment Overdue; a card payment received before the deadline counts even if it confirms after. | Product (@tangconst, @jeffffej0909) |
| Cancelled vs Refunded | Decided | Failing to pay ends as Cancelled when an operator cancels; Refunded is a recorded refund only. A missed setup deadline reads Setup Overdue; a missed payment deadline reads Payment Overdue — neither is Cancelled on its own. | Product |
| A cancelled order | 🚧 In flight | `Cancelled on {date}` with the lot and the winning bid, and Contact Us as the only action; no reason is shown, as the cancellation letter gives none, and a suspension stays. Chosen over showing the winner the operator's reason category. | Product and Operations (@jeffffej0909) |
| A refunded order | 🚧 In flight | Refunded beside the title, paid in full or in part and wherever the card is; no stepper, Pay or address form; the invoice and receipts stay; Order Summary stays the invoice; an inline alert below Order Total shows the amount returned and opens the reason, note, channel and masked card or bank clue. Proof and provider reference stay with the operator. | Product (@jeffffej0909, @tangconst) |
| An overpaid difference | 🚧 In flight | The order keeps its status. Winning Bid, Shipping & Handling and Order Total stay the amount that should have been paid. An inline alert below Order Total shows only the difference, with the same detail dialog. My Auctions does not change. Chosen over ending every refund, including an overpayment, as Refunded. | Product (@tangconst) |
| Refund transaction clues | 🚧 In flight | Refund Method shows the channel plus a masked destination clue: the card brand and last four digits for a card refund, or a masked bank/account clue for a bank transfer. Full proof, provider reference and audit number stay with the operator. | Product (@tangconst) |
| Progress stepper | Decided | Five presentation steps, Address → Invoice → Payment → Shipped → Completed, with day-only dates; Setup Overdue under Address, Payment Overdue and Payment Verifying under Payment, Processing under Shipped, Delivered as Completed. | Product and design (@tangconst) |
| Invoice and receipt PDFs | Decided | After send until Cancelled, Invoice is a text link beside the Order summary heading. After payment, Receipt is a text link under the payment-method card. They are not paired on one row. Only the payment-received letter attaches a PDF, the receipt. | Product and design (@tangconst) |
| Payment Verifying alert | Decided | While proof is checked, Winner Order shows an inline Alert: verifying the transfer, email when payment is confirmed; Hourglass on default Alert. Under Order progress on small viewports; under the lot from `lg` up. No proof-received letter. | Product and design (@tangconst) |
| Identifiers | 🚧 In flight | Each ID names its listing by a code hashed from the listing's internal id, not a running count, so the IDs do not reveal how much Grade10 sells; operators keep a separate gapless audit number the winner never sees — [Grade10 Invoicing Identifiers](/references/grade10-invoicing-identifiers). | Product (@jeffffej0909) |
| Setup mail | 🚧 In flight | One setup reminder at 24 hours after close while setup is incomplete; auction-won and setup-reminder letters name delivery address, payment method and billing address as bullets; setup overdue at 48 hours is generic, names manual review, and never cancels automatically. No second (72h) reminder. | Product (@tangconst) |
| Payment mail | 🚧 In flight | The first payment reminder goes at send, then day 3 and day 6 on the running deadline; the final notice 24 hours before the deadline while Pay is offered; payment overdue replaces invoice-expired. Letters name the total and `Pay by …`, never a method. Durable `notifications-order` holds that schedule; `add-winner-bank-transfer` adds proof holds and the receipt PDF. | Product (@tangconst) |
| Letter CTA | Decided | Default opens the lot's Winner Order, sign-in first; overdue letters lead with Contact Us; the Shipped letter leads with the carrier's tracking. | Product (@tangconst) |
| Contact Us destination | 🚧 In flight | Copy-first sheet on Winner Order: To, Subject, Message, Copy Message first, Open Mail App second. Letters prefill the same mailto and name the address. Chosen over opening a mail client, a contact form, or a toast with the address only. A partial-payment template lists receipts and never the remaining balance. | Product (@tangconst) |
| Reissue letter | Decided | A reissue sends the payment reminder sent at invoice send, for the new invoice; it fires on the same kind of event, so a separate reissued letter is dropped. | Product (@jeffffej0909) |
| Delivered content | Decided | Delivery address and delivered time; View order first, Contact Us second. | Product (@jeffffej0909) |
| Cancelled content | Decided | Cancelled time only; the operator's reason stays internal. Contact Us first, View order second. | Product (@jeffffej0909) |
| Cancelling a paid order | ❓ Open | Whether an operator can cancel an order already paid, and whether the cancelled letter then names a refund; until settled the letter says nothing about payment. | Product (@jeffffej0909) |
| A separate orders page | Decided | Won lots are followed on My Auction Orders — needs action first, then newest close — and each Won row opens the order. | Product |
| Suspension | Decided | Auction-only, forward-looking; a standing maximum keeps bidding and can win; only an operator's reinstatement lifts it, and the operator's reason is never shown to the collector. | Product |
| Billing address on setup | 🚧 In flight | Asked at order setup with the delivery address, not at payment, so the invoice is sent with it and never reissued for it. Same as delivery by default, chosen from the same address book, shown as Bill To beside Ship To on the invoice and receipt. It reverses the rule that the form offers no billing address. | Product (@jeffffej0909) |
| Country or region on delivery setup | 🚧 In flight | On Winner Order delivery Add Address, country or region lists every country and region A–Z; any typed letter moves the highlight to the next matching name and scrolls it into view. Catalogue source is an engineering choice (owned list, package, or admin portal crawl). Chosen over a short designated set. | Product (@tangconst) |
| Billing country or region list | ❓ Open | Whether billing Add Address uses the same full list and typeahead as delivery. | Product (@tangconst) |
| Shippable destinations only | ❓ Open | Whether the picker later limits to destinations Grade10 ships to; until settled the catalogue stays complete. | Product (@tangconst) |
| Overdue penalties | ❓ Open | What "penalties or extra charges" means after a setup miss vs a payment miss. | Product (@tangconst) |
| Partial payment | 🚧 In flight | Operator-only: manual settlement gains the ability to record a payment smaller than the balance owed, any number of times. Self-service card and bank transfer stay full-amount only. | Product and finance |
| Awaiting Setup | 🚧 In flight | Awaiting Address is renamed Awaiting Setup, because setup confirms a payment method and a billing address as well as an address; until it lands the winner and the operator both read Awaiting Address. | Product (@jeffffej0909) |
| Setup Overdue and Payment Overdue | 🚧 In flight | **BREAKING** vs keeping Awaiting Setup / Pending Payment after the deadline: inside the window the order reads Awaiting Setup or Pending Payment; once the deadline passes it reads Setup Overdue or Payment Overdue on Winner Order, My Auctions and the operator queue alike. | Product and design (@tangconst) |
| My Auctions Status column | 🚧 In flight | The table column formerly Your Standing is Status — bid standing while open, the order's status once won. | Product and design (@tangconst) |
| Partially Paid | 🚧 In flight | Its own status, entered the moment an operator records a payment smaller than the balance owed; ends the payment deadline for good rather than pausing it, since self-service Pay is never offered again on that invoice. | Product (@jeffffej0909) |
| Closing a partial balance | 🚧 In flight | Measured against the original invoice total, cumulative across every payment, not the balance left at that moment: once payments reach 90% of the total, every further payment offers the operator a close, Paid with no separate write-off entry, or kept Partially Paid at the real balance. The prompt returns on each payment while still under 100%, so a `keep open` answer never quietly waives later checks. An exact match closes on its own. | Product and finance |
| Overpaying a partial balance | 🚧 In flight | A payment above the original invoice total is accepted after an operator confirmation dialog before the invoice is marked Paid. The full payment remains recorded; the excess can be returned through the refund flow. | Product and finance |
| Partial payment locks Reissue and Cancel | 🚧 In flight | Once any payment is recorded, the invoice's address, method and total stay fixed; an operator resolves the rest by hand outside the system rather than Grade10 reconciling a changed total against money already collected. | Product and finance |
| Balance owed stays operator-only | 🚧 In flight | Winner Order never shows a running balance; a Partially Paid winner sees a locked page and Contact Us. Each payment still reaches the winner as its own receipt PDF. | Product and finance |
| Formal tax receipt | ❓ Open | Whether a receipt must carry Grade10's company details and tax ID. | Finance |
| One-time address persistence | ❓ Open | Whether an unsaved one-time address survives leaving and returning to the order. | Product (@tangconst) |
| Bidders ban and suspension | Decided | The auction admin's Bidders ban is the same auction suspension; it records another cause on the one standing and never becomes a platform ban. | Engineering |
:::
