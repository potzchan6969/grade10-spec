---
title: Post-Bidding
spec: grade10-site/auction/winner-order
order: 4
reviewed: 2026-10-06
---

What happens after a lot stops taking bids: the result, then the winner's
order — set up, invoiced, paid, shipped — and the letters that carry it.

## The Close

Bidding stops, the result is fixed at once, and only the winner gets an order.

- **Every lot reads Ended** — with or without a winner, whatever happens to
  the order afterwards — [Lot
  Status](/p/grade10-site/auction/display#auction-details)
- **No card was charged** — nothing was held on any card while bidding; a
  losing bidder's My Auctions row says their card was not charged
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
| Order setup | **48 hours** from the lot's actual close to confirm a delivery address, a payment method and a billing address; an operator reopen starts a fresh **48 hours** |
| Payment | **7 calendar days** from when Grade10 sends the invoice, never from the close; nothing the winner does moves it |
| Buyer's premium | **20%** of the winning bid, rounded half up, or the currency's minimum charge when higher — **0** in USD, HKD and JPY |
| Payment proof | 🚧 **1 to 3** PDF, PNG, JPG, HEIC or HEIF files of up to **5 MB** each, **15 MB** total, uploaded once |
| Records | 🚧 Invoice and receipt PDFs kept at least **7 years**, or for the life of the account if longer |

- **Layout** — the Winner Order design's page body, the one its stories
  render: the lot once, in its card; alerts under it; a sidebar with the
  summary, payment method, receipts and addresses. No Order Information,
  Collection Method, Order Status list or Lots
- **Progress** — five steps, Address → Invoice → Payment → Shipping →
  Completed, with day-only dates; Cancelled and Refunded show no stepper

### Partially Paid

- 🚧 **Under Payment** — Payment Verifying and Partially Paid both read
  against the Payment step

### Order Progress

- 🚧 **Under Shipping** — Preparing Shipment and Shipped both read against
  the Shipping step as its current (progress) step; while Preparing Shipment,
  Shipping subtext reads Preparing to ship; Shipped and Preparing Shipment
  badges use the muted default Badge tone on Winner Order and My Auctions
- **Contact Us** — `support@grade10.com`, subject the invoice or the lot;
  Copy Message first on Winner Order, Open Mail App second; overdue,
  cancelled, delivered and partial-payment letters use the same subject and
  body; Copy Message shows no confirmation beyond the control's own state

### My Auction Orders

Every won lot on one list, opened from the account menu beside My
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

::image{src="assets/diagrams/auction-order-status.svg" alt="An auction order from Awaiting Setup through Preparing Invoice, Pending Payment and Preparing Shipment to Shipped and Delivered, with Payment Verifying and Partially Paid in an operator's hands beneath Pending Payment, Cancelled for an unpaid order, and Refunded reached by a recorded refund from Preparing Shipment, Partially Paid or Delivered"}

| Status | Invoice reads | Reached when |
| --- | --- | --- |
| **Awaiting Setup** | Not issued | The lot closes with a winner and setup is incomplete — delivery address, payment method or billing address |
| 🚧 **Setup Overdue** | Not issued | The setup deadline passes with setup incomplete; self-service Confirm is closed |
| **Preparing Invoice** | Not issued | The winner confirms setup, or an operator records an address after the deadline |
| **Pending Payment** | Pending or expired | An operator sends or reissues the invoice |
| 🚧 **Payment Overdue** | Expired | The payment deadline passes with the invoice unpaid; self-service Pay is closed |
| 🚧 **Payment Verifying** | Payment Verifying | The winner uploads bank transfer proof; the deadline stops until an operator confirms or returns it |
| 🚧 **Partially Paid** | Partially Paid | An operator records a payment short of the balance; the deadline stops for good and Pay is not offered again, and the order stays here until a payment closes the balance |
| 🚧 **Preparing Shipment** | Paid | A card payment is confirmed, the proof is confirmed, or an operator settles manually |
| **Shipped** | Paid | The warehouse dispatches, with a tracking number |
| **Delivered** | Paid | The carrier confirms delivery |
| **Cancelled** | Cancelled | An operator cancels an unpaid order; the lot goes back to stock |
| **Refunded** | Refunded | A refund that closes the sale, on a paid or Partially Paid order, for any amount up to what was paid. An overpayment is not this status. Failing to pay is never Refunded |

- **Read, never written** — one ordered rule chain derives it, so it cannot
  contradict the facts; dispatch before payment, cancelling a dispatched
  order and delivery before dispatch are refused
- 🚧 **A reissued invoice** — replaces the old one, which keeps no status of
  its own; a proof under check never expires
- 🚧 **Shipment** — while the lot is dispatched (`fulfilled`), Order Progress
  shows the tracking number as a link to the carrier's tracking page (opens
  externally); the link stays after Delivered; no separate Track shipment
  control and no carrier name in that chrome; delivery proof follows when
  the carrier provides one — an operator records both —
  [Auction Management ·
  Fulfilment](/p/grade10-admin/auction/management#fulfilment)
- 🚧 **The shipping tracker the winner keeps** — the tracking number and
  its carrier link; no carrier name anywhere on Winner Order
- 🚧 **A cancelled order** — reads `Cancelled on {date}`, keeps the lot and
  the winning bid, and offers Contact Us alone; it gives no reason, and a
  suspension stays until an operator reinstates

### Cancelled Order

- **Cancellation display** — Winner Order keeps the lot, the winning bid and
  `Cancelled on {date}`, with Contact Us alone. It never shows the operator's
  reason, category or payment controls

### Refunds

- 🚧 **Suspended winner** — the order remains payable and the page gives
  contact guidance without showing the operator's reason
- **A refunded order** — reads Refunded as both the order status and the
  invoice status, however much was paid and wherever the card is; no Pay, no
  address form and no letter; the invoice and every receipt already issued
  stay downloadable; Order Summary stays the invoice; an inline alert below
  Order Total shows the amount returned, and opens a dialog that stacks
  Amount, Transfer to, Reference (bank only), Reason, and Note when the
  operator recorded one
- **The bank reference** — a refund sent by bank transfer shows the
  operator's reference in the same details, between Transfer to and Reason,
  so the winner can find the credit on their statement; a card refund shows
  none, because a statement lists a card refund against the charge it
  reverses
- **An overpaid difference** — the order keeps its status on Winner Order
  and on My Auctions; Winning Bid, Shipping & Handling and Order Total stay
  the amount that should have been paid; an inline alert below Order Total
  shows only the difference, with the same detail dialog
- **Refund transaction clues** — Transfer to uses the shared payment card.
  A card shows the brand logo and the last four digits. A bank transfer shows
  a bank icon with the masked destination on the primary line and the
  free-text bank name as secondary text under it. A paid order's payment
  method uses that same layout. Full proof, Stripe reference and audit number
  stay with the operator; a bank refund shows its provider reference as above

## Order Setup

Before any invoice, the winner confirms three things on one form, inside 48
hours of the close.

| The winner confirms | From | Default |
| --- | --- | --- |
| Delivery address | A saved address or a new one; the order keeps a snapshot — [Account · Delivery Address Management](/p/grade10-site/auction/account#delivery-address-management) | The account default, pre-filled and still confirmed |
| 🚧 Payment method | Card in a currency with a card fee rule; bank transfer where Grade10 holds bank details for the order's currency; each choice shows its fee range | Nothing preselected |
| 🚧 Billing address | The delivery address, or any saved or one-time address with the same required fields | Same as delivery address, ticked |

- **Form** — Personal or Company; first and last name, phone (country and
  digits), country or region, town or city, address line 1 and postal code are
  required; address line 2 and state or province are optional; Company Name is
  required only for Company and hidden for Personal; an empty required field is
  refused beside the field; phone stores E.164 when parseable and does not
  refuse unusual formats; phone country and Country/Region start empty — nothing
  preselected; phone placeholder shows an example with calling code
  (`+852 12345678`)
- **Country or region list** — on delivery Add Address, country or region
  lists every country and region A–Z in a searchable field — typing filters the
  list to matching names
- **Company on the picker** — a company address shows the company name as
  the card title; a personal address shows the recipient name; the card body
  shows street, city or region, and country only — no postal code and no phone
- **Order summary addresses** — after setup, Delivery and Billing on the
  order show the confirmed snapshot: company name when the address is
  company, recipient name, phone, and the full address including postal code
  (not the lean picker card body)
- 🚧 **Billing country or region list** — billing Add Address uses the same
  full A–Z list and searchable field as delivery
- **Every destination listed** — the picker lists every country and region,
  including ones Grade10 does not ship to; limiting it to shippable
  destinations is later work, not this page's
- 🚧 **Catalogue display locale** — Country/Region names follow the
  account's language, as the rest of the site does

- 🚧 **Fee range wording** — card reads `Card fee about 3.4% + a fixed
  amount`; bank transfer reads `Bank fee set on your invoice` and names no
  amount, because the operator sets that fee
- 🚧 **One-time address after a reload** — an unsaved one-time address stays
  on the order after leaving and returning, until the winner confirms or the
  setup deadline passes
- 🚧 **Card where Finance set a rule** — card is offered only in a currency
  with a card fee rule; in USD and JPY until Finance sets one, the choice
  reads that card is not yet available, per [Auction Management · Payment
  Settings](/p/grade10-admin/auction/management#payment-settings)
- 🚧 **No method in the currency** - with no card fee rule and no bank details
  for the order's currency, the winner reads that payment is not yet
  available in that currency, with Contact Us, and cannot confirm; the
  48-hour setup deadline keeps running, and an operator reopens or records
  setup by hand

### Address Deadline

- **Deadline** — `Confirm by …` sits under Confirm; a miss closes the whole
  form and only Grade10 reopens it, under Edge Cases
- 🚧 **Locked on confirming** — the winner changes none of the three
  afterwards; an operator edits them on request before send and reissues
  after, and the order shows what changed

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
| 🚧 Tax | — | Optional and above zero, entered by the operator; absent when none, as on this example order |
| Subtotal | 121,300 | The lines above; the page summary may leave it out, the invoice and receipt keep it |
| 🚧 Payment Processing Fee | 4,271.80 | Grade10's own for a card invoice, computed from the Stripe card rule in Payment Settings — here 3.4% + HK$2.35, grossed up so Grade10 keeps the Subtotal whole |
| Order Total | 125,571.80 | Subtotal plus the fee — what the winner pays |

- 🚧 **Insurance on Order Summary** — before send, Insurance sits with the other
  fee rows as TBD; after send it carries a brief info tooltip (`0.9% of the
  order value during transit.`) when the operator added it, and stays absent
  when none
- 🚧 **Tax on Order Summary** — before send, Tax sits with the other fee rows
  as TBD, whether or not the winner will owe any. Whenever the line shows it
  carries a brief info tooltip — `Set by Grade10 for where your order ships.
  Some orders have none.`
- **Amount marks** — Order Summary lines use `$` with two decimals
  (`$12,800.00`), except bare `$0` when the amount is zero; Order Total keeps
  `HK$` with two decimals (`HK$16,460.00`)
- 🚧 **Payment Processing Fee** — Grade10's own on a card invoice, computed
  from the Stripe card rule; the operator's own on a bank transfer invoice,
  zero or more, empty read as Free
- 🚧 **Payment method** — Card or Bank Transfer, printed on the invoice so
  the document names it rather than leaving it to the fee amount alone
- 🚧 **Payment reference code** — `LK423`: the listing's own code, carried
  forward unchanged as the order's one public reference once a winner
  exists; shown on the winner's invoice and operator support surfaces, and
  safe to copy into FPS, local bank transfer or SWIFT notes. The public
  listing never shows or routes by this code. Grade10 writes it to Stripe
  transaction metadata under `payment_reference_code`, then keeps Stripe's
  returned provider reference internal. There is no separate order ID —
  [Auction Management · Listings](/p/grade10-admin/auction/management#listings)
- 🚧 **Bank details** — every enabled SWIFT, FPS and HK local-transfer rail in
  the invoice's Finance snapshot, printed below Order Total when paid by Bank
  Transfer; the payment reference follows the enabled rails, with a reminder
  to quote it in the bank app's memo or remarks field
- 🚧 **Invoice ID** — `IN-LK42301`: the payment reference plus an issuance
  sequence with at least 2 digits; it continues as `100` after `99`. A reissue
  increments the sequence, keeps the payment reference and lets the old ID
  find the order
- 🚧 **Bill To and Ship To** — both from the order's snapshot, each with
  name, company name, phone and address; they read the same unless the
  winner unticked Same as delivery address
- **PDFs** — the invoice once sent (text link beside the Order summary
  heading) and the receipt once paid (text link under the payment-method
  card); hidden when Cancelled
- **Payment deadline** — an absolute date and time in the viewer's local zone
  on Winner Order, with no countdown; the invoice PDF uses Hong Kong time
  labelled `GMT+8`

## Paying

The invoice is paid once and in full; paying it in parts is an operator's
doing, under Edge Cases.

🚧 Bank-transfer proof submit confirms the handoff, leaves the dialog open on
failure, and locks the form while work is in progress.

::image{src="assets/diagrams/auction-payment.svg" alt="Paying an auction invoice: the winner pays by card and the provider confirms it, or transfers and uploads proof an operator confirms or returns; an unpaid invoice expires on day 7 and is reissued, settled or cancelled"}

### By Card

- **Card** — a fresh charge for the order total while the invoice is pending,
  on a stored card or another; Grade10 confirms it on its own, and a declined
  attempt leaves the invoice payable until the deadline
- **Unfinished payment** — a payment that times out or is abandoned says
  so and leaves Pay with Card ready; a completed one reads Confirming payment until
  Grade10 records it
- 🚧 **Started in time** — one tried at or after the deadline cannot start, so
  the card is not charged; one started in time still counts

### By Bank Transfer

#### Bank Transfer Instructions

- 🚧 **Two entry points** — while the invoice is pending, Order summary keeps
  **Submit Payment Proof** as the primary control and places **View Bank
  Details** under it; View Bank Details opens bank rails, Submit Payment
  Proof opens the proof dialog
- 🚧 **View Bank Details** — opens with the FPS tab selected. It shows amount
  due and rail fields as detail rows (no
  Copy); each rail tab ends with payment reference and a warning to enter it
  in the bank memo, after the rail fields: FPS ID, account name and QR; HK
  local bank name, bank code, branch code and full account number (bank and
  branch code included); SWIFT beneficiary name, beneficiary address, bank
  name, bank address, SWIFT/BIC, full account or IBAN, then payment
  reference, then a note to choose OUR for transfer fees so Grade10
  receives the full order total

#### Bank Transfer Proof

- 🚧 **Submit Payment Proof** — proof fields and upload only (no amount due
  or transfer reference); **1 to 3** PDF, PNG, JPG, HEIC or HEIF files, **5 MB**
  each and **15 MB** total, uploaded once after paying, with inline
  irreversible microcopy saying nothing can be added or changed after submit;
  on success, a toast reads **Proof submitted** / **We'll verify your payment
  shortly.**, the order reads
  Payment Verifying, the deadline stops, and Submit Payment Proof, View Bank
  Details and further uploads are hidden; on a failed upload the dialog stays
  open with the draft and a toast reads **Proof not submitted** / **Nothing
  was saved. Try again.**; while submitting or converting HEIC the form locks
  and leave is blocked
- 🚧 **Payment Verifying alert** — an inline Alert says Grade10 is verifying
  the transfer and will email when payment is confirmed, under Order progress
  on small viewports and under the lot from `lg` up
- 🚧 **Manual confirmation** — an operator confirms the proof, or returns it
  with a reason the winner reads, the latest only; the deadline runs again
  with the time that was left, and the winner uploads again — [Auction
  Management · Payment](/p/grade10-admin/auction/management#payment)
- 🚧 **Proof stays private** — the winner never sees a payment proof file or
  its name; the order shows only that proof was sent

#### Bank Instruction Configuration

- 🚧 **Bank details by lane** — Finance-owned configuration supplies approved
  live instructions and the FPS QR outside source control. Grade10 snapshots
  them on each issued bank-transfer invoice; preview uses Grade10 Finance
  Limited and HSBC Hong Kong samples

- **Contact channel** — an operator reaches a winner about a transfer or a
  proof on WhatsApp, at the phone number from the address form; Operations
  confirmed it

### Receipts

#### Receipt Documents

- **Receipt** — the itemised amounts and how it was paid: card brand and last
  four, or the method and reference an operator recorded
- 🚧 **Tax on the receipt** — the receipt lists Tax when the operator added it,
  between Insurance and the Subtotal
- 🚧 **Bill To and Ship To** — the same two addresses as the invoice it
  pays; a later edit or reissue never changes a receipt already issued
- 🚧 **A confirmed transfer** — its receipt reads Bank Transfer
- 🚧 **Receipt ID** — new receipts use `RC-LK42301P1`: the listing code,
  invoice sequence and the finalized payment's unpadded sequence within that
  invoice. Historical receipt IDs stay unchanged
- 🚧 **When it is issued** — a finalized full or partial payment receives one;
  a refund, reversal or void receives none
- 🚧 **One receipt per payment** — every receipt for an invoice lists on the
  same Receipt PDF row, oldest first
- **What every receipt shows** — Original Invoice Total, Previous Payments,
  Current Payment Received and Remaining Balance Due, whether the invoice took
  one payment or several. A single full payment reads 0 previous and 0
  remaining
- **Original Invoice Total** — the total of the invoice the payment was made
  against, fixed for the life of the collection; no invoice is reissued once
  money has been recorded against it
- **Remaining Balance Due** — what is still owed, reading 0 the moment the
  invoice is Paid or an overpayment is confirmed; neither shows a credit
- **A receipt is never reissued** — a refund or a reversal leaves every
  receipt already issued exactly as it was, and moves no later receipt's
  Previous Payments

::changes{spec="shared/ui/invoice-and-receipt-pdf"}

#### Receipt Policy Pending

- ❓ **Formal tax receipt** — whether a receipt must carry Grade10's company
  details and tax ID; Finance confirms

## Letters

Every letter identifies the lot, goes to the winner's registered address and
opens that lot's order, sign-in first when signed out; the lot image and
title open it too. The schedule below matches
`grade10-site/auction/notifications-order` and the archived email-kinds
timeline: setup at close / +24h / +48h, payment reminder at send then day 3
and day 6, final notice 24 hours before the payment deadline, payment overdue
at expiry, one partial-payment receipt letter for each recorded partial payment,
then shipped, delivered, and order cancelled.

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
| 🚧 Partial payment received | An operator records a partial payment | The current invoice ID, Receipt ID and receipt PDF, with Contact Us; no remaining balance |
| Shipped | Dispatch | The delivery address, then the carrier and tracking number; the primary action is the carrier's tracking |
| Delivered | The carrier confirms delivery | The delivery address and the delivered time; View order first, Contact Us second |
| Order cancelled | An operator cancels | That the order was cancelled and when; no reason and no word on payment; Contact Us first, View order second |

- **Letter times** - deadlines in email use Hong Kong time labelled `GMT+8`
- **Reminders stop at payment** — every outstanding reminder is cancelled the
  moment payment is received
- 🚧 **A reissue restarts the series** — the replaced invoice's reminders
  park and the `payment-reminder` goes again for the new invoice, with its
  total and `Pay by …`; there is no reissued letter of its own
- 🚧 **Reminders on hold** — none go out while proof is checked, and
  uploading it sends no letter at all; if the proof is returned the sequence
  resumes on the moved clock, skipping and repeating nothing
- 🚧 **Partial payments** — reminders stop at the first recorded payment; each
  partial payment sends `payment_received_partial` with its invoice and receipt
  IDs, its receipt PDF and the same ready Contact Us mailto rules

## Edge Cases

### Missed Address Deadline

- **Winner** — Confirm hides, Missed address deadline gives Contact Us, and the
  order reads Setup Overdue
- **Operator** — reopens the form for a fresh 48 hours; records an address by
  phone while the order is unconfirmed Setup Overdue and its invoice is
  `not_issued`; or cancels after review

### Missed Payment Deadline

- **Winner** — Pay hides, the overdue alert gives Contact Us, and the order
  reads Payment Overdue
- **Operator** — reissues with a fresh 7 days, settles manually, or cancels;
  the lot returns to stock with no runner-up offer

- **Overdue penalties** — a missed payment deadline suspends the bidder, below

### Overdue Penalty Policy

- ❓ **Other penalties** — what else "penalties or extra charges" in the
  overdue letters means; Product confirms

### Partial Payment

🚧 A winner who cannot pay in one go pays in parts, off the page: an operator
records each payment, the order reads Partially Paid, and the winner's page
locks with Contact Us and a receipt for every payment, never a running
balance. The invoice above, settled in three payments:

| Payment | Amount | Its receipt shows | The operator |
| --- | --- | --- | --- |
| `-P1` | 50,000 | Invoice total 125,571.80 · previous payments 0 · this payment 50,000 · balance due 75,571.80 | Records it; the order reads Partially Paid, the deadline stops for good, and card Pay is gone |
| `-P2` | 65,000 | Previous 50,000 · this payment 65,000 · balance due 10,571.80 | Records it; the order remains Partially Paid |
| `-P3` | 10,571.80 | Previous 115,000 · this payment 10,571.80 · balance due 0 | An exact match closes on its own; the order reads Preparing Shipment |

- 🚧 **Completing the balance** — updating the invoice to Paid is refused
  until payments reach 90% of the original invoice total, so a 1,000 invoice
  needs at least 900 first. From 90% each further payment asks the operator to
  close as Paid or keep it Partially Paid at the real balance, and asks again
  on every payment while the total is under 100%. An exact cumulative match
  closes on its own; an amount above the total asks the operator to confirm the
  overpayment before the invoice is marked Paid
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
| Raise a standing maximum | No |
| Standing maxima on open lots | Keep bidding to their cap, and can win; each lot won gets its own order and deadline |
| Pay what is owed | Yes; paying, and a reissue, lift nothing — only an operator's reinstatement does |
| Store, loyalty, sign-in, reading the account and its orders | Yes |

- **Told at once** — the notice names what is owed and how to resolve it, and
  My Auctions explains the restriction beside the affected order
- 🚧 **No amount once partly paid** — a Partially Paid order's notice names
  no balance; Contact Us covers it
- **By an operator** — an operator suspends or reinstates from the
  account's panel on the admin Users page, with a required reason the
  collector never sees; a new cause while suspended is recorded beside the
  first, and reinstating lifts every cause
- **Bid history untouched** — a suspension adds, edits and removes nothing
  in any lot's history, and no lot's price or leader changes because of it
- **One auction standing** — the auction admin's Bidders ban is the same auction
  suspension; it does not create a separate standing or a platform ban

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service): the order, invoice and fulfilment records, and the derived status
- **Blocks** — `AuctionOrderList`, `AuctionOrderRow`, 🚧 `AuctionWinnerOrder` and `AuctionAddressForm`, in `packages/ui` — [Auction Order Blocks](/p/shared/ui/auction-order)
- **Grant** — `auction:moderate`, the one grant that suspends and reinstates, in the auction service and on the admin Users panel
- **Mail** — `apps/emails/emails/auction/`
- **Identifiers** — [Grade10 Invoicing Identifiers](/references/grade10-invoicing-identifiers)
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/auction/winner-order"}

::cases{id="grade10-site/auction/auction-orders"}

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
| Tax line | 🚧 In flight | Tax is an amount the operator enters, shaped like Insurance. Chosen over a rate Grade10 computes, which needs a jurisdiction rule and a rate per regime nobody has written, and over a tax provider, which adds a vendor to price a number the operator already knows. Zero is refused, so "no tax" and "tax of nothing" stay distinct. Order Summary tip: `Set by Grade10 for where your order ships. Some orders have none.` What a receipt must carry beyond the amount is still the open Formal tax receipt row below. | Product (@jeffffej0909) |
| Line names | Decided | Hammer price reads Winning Bid, Shipping reads Shipping & Handling, Final amount reads Order Total, for the winner and the operator; zero shipping reads Free; Insurance is optional and above zero. | Product |
| Insurance tooltip | Decided | On Winner Order's Order Summary, Insurance carries a brief info tooltip — `0.9% of the order value during transit.` — beside Buyer’s Premium, Shipping & Handling and Payment Processing Fee. Before send, Insurance shows as TBD with the other fee rows; after send it stays optional and absent when none. Chosen over renaming the line Shipping insurance, and over hiding Payment Processing Fee when Free. | Product (@tangconst) |
| Buyer's premium | Decided | 20% of the winning bid alone, rounded half up, or the currency's minimum when higher; Grade10 computes it; the rate is disclosed on the bid panel only. The minimum is one Grade10-owned amount per currency under Payment Settings, 0 at first, applied to invoices sent or reissued after it takes effect. | Product and finance |
| Payment processing fee | 🚧 In flight | A card invoice's fee is Grade10's own: the Stripe card rule per currency in Payment Settings, a percentage and a fixed amount grossed up from the Subtotal; with no rule for the currency, the invoice cannot be sent. A bank transfer invoice's fee is the operator's own, no cap, empty read as Free. The sent invoice never re-prices. Chosen over reading the provider's live fees at send: Stripe has no pricing API, and the real fee depends on the card — domestic 3.4% + HK$2.35, more for an international card or a currency conversion — so it is known only after the charge. | Product |
| Bank transfer by the winner | 🚧 In flight | The winner may pay by bank transfer and upload proof, reversing the card-only rule; card fees on high-value lots make a transfer worth offering. Proof waiting for an operator reads Payment Verifying to both, and stops the deadline, which resumes with the time left if the proof is returned. A confirmed transfer's receipt reads Bank Transfer. | Product (@jeffffej0909) |
| Bank details | 🚧 In flight | Grade10 holds bank details per currency on each lane: the sample account outside production, and none in production until Finance confirms Grade10's account, so production offers card only until then. Chosen over a sample account in the site's code, which showed on every lane and on every invoice PDF, production included. | Product and Finance |
| Fee disclosure | 🚧 In flight | The winner chooses a method on a fee range Grade10 sets; the amount first shows on the sent invoice, and an operator reissues if the winner then wants the other method. | Product (@jeffffej0909) |
| Winner's choice locks on confirming | 🚧 In flight | Once the winner confirms the address and method, only an operator changes them: an edit with a reason before send, a reissue after. | Product (@jeffffej0909) |
| Address deadline | Decided | 48 hours from lot close. A miss hides Confirm, shows Contact Us, and the order reads Setup Overdue; no invoice is issued, nothing cancels or suspends automatically. The account address book is unaffected. | Product (@tangconst) |
| Reopening the address form | Decided | An operator, with payment processing and a reason, reopens it once the deadline passes before an address was confirmed, for a fresh 48 hours; never on a cancelled order; no letter, the operator tells the winner. Or the operator records an address given by phone without reopening. | Product (@jeffffej0909) |
| Payment deadline | Decided | 7 calendar days from invoice send, not from lot close, as an absolute datetime with no countdown. At expiry Winner Order hides card Pay and shows Contact Us; the invoice is `expired` and the order reads Payment Overdue; a card payment received before the deadline counts even if it confirms after. | Product (@tangconst, @jeffffej0909) |
| Cancelled vs Refunded | Decided | Failing to pay ends as Cancelled when an operator cancels; Refunded is a recorded refund only. A missed setup deadline reads Setup Overdue; a missed payment deadline reads Payment Overdue — neither is Cancelled on its own. | Product |
| A cancelled order | 🚧 In flight | `Cancelled on {date}` with the lot and the winning bid, and Contact Us as the only action; no reason is shown, as the cancellation letter gives none, and a suspension stays. Chosen over showing the winner the operator's reason category. | Product and Operations (@jeffffej0909) |
| A refunded order | Decided | Refunded beside the title, paid in full or in part and wherever the card is; no stepper, Pay or address form; the invoice and receipts stay; Order Summary stays the invoice; an inline alert below Order Total shows the amount returned and opens a dialog that stacks Amount, Transfer to, Reference (bank only), Reason, and Note when the operator recorded one. Proof, Stripe reference and audit number stay with the operator. | Product (@jeffffej0909, @tangconst) |
| An overpaid difference | Decided | The order keeps its status. Winning Bid, Shipping & Handling and Order Total stay the amount that should have been paid. An inline alert below Order Total shows only the difference, with the same detail dialog. My Auctions does not change. Chosen over ending every refund, including an overpayment, as Refunded. | Product (@tangconst) |
| Refund transaction clues | Decided | Transfer to uses the shared payment card. A card shows the brand logo and the last four digits. A bank transfer shows a bank icon with the masked destination on the primary line and the free-text bank name as secondary text under it. A paid order's payment method uses that same layout. A bank refund shows its provider reference in the details; a card refund shows none. Full proof, Stripe reference and audit number stay with the operator. | Product (@tangconst) |
| Winner Order layout | Decided | The site renders the Winner Order design's page body from `@grade10/ui`, so a design change reaches the site on the next submodule bump. States the design never drew sit as alerts under the lot, in the order the site supplies. Chosen over fixing the site's own copy of the page, which drifts again on the next design change, and over an open content slot, which lets the page rebuild the design beside it. | Product and design |
| Winner Order dialogs | Decided | Setup, how to pay, payment proof, contact and refund stay the site's, each moving into the design in a change of its own. Chosen over moving all five at once, when three hold their own address book, bank details or files. | Product and design |
| Progress stepper | 🚧 In flight | Five presentation steps, Address → Invoice → Payment → **Shipping** → Completed, with day-only dates; Setup Overdue under Address, Payment Overdue and Payment Verifying under Payment, Preparing Shipment and Shipped under Shipping as the **current** (progress) step (Preparing Shipment subtext: Preparing to ship — not an incomplete Shipping step), Delivered as Completed. Shipped and Preparing Shipment badges use the muted `default` Badge tone on Winner Order and My Auctions. **BREAKING** vs past-tense Shipped as the phase label and badge Processing for a paid undispatched order — those read as already shipped when the Shipping step pings. | Product and design (@tangconst) |
| Invoice and receipt PDFs | Decided | After send until Cancelled, Invoice is a text link beside the Order summary heading. After payment, Receipt is a text link under the payment-method card. They are not paired on one row. Only the payment-received letter attaches a PDF, the receipt. | Product and design (@tangconst) |
| Payment Verifying alert | Decided | While proof is checked, Winner Order shows an inline Alert: verifying the transfer, email when payment is confirmed; Hourglass on default Alert. Under Order progress on small viewports; under the lot from `lg` up. No proof-received letter. | Product and design (@tangconst) |
| Proof submit feedback | 🚧 In flight | Successful proof upload shows toast **Proof submitted** / **We'll verify your payment shortly.** and Payment Verifying. A failed upload keeps the dialog open with the draft and toast **Proof not submitted** / **Nothing was saved. Try again.** While submitting or converting HEIC the form locks and leave is blocked. Confirm stays inline microcopy. Chosen over page-only toast and over a second confirm screen. | Product and design (@tangconst) |
| Tracking link on Winner Order | 🚧 In flight | While fulfilment is `fulfilled` (Shipped and Delivered), Order Progress shows the tracking number as the external carrier link with an arrow. No separate Track shipment button and no carrier name in that chrome. Chosen over carrier name plus a Track shipment CTA. | Product and design (@tangconst) |
| Identifiers | 🚧 In flight | Listing/payment references are opaque 5-character Crockford codes with no fixed prefix, two leading alphabetic characters, allocation on the first saved draft, and permanent nonreuse including deletion. A UUID/listing-ID-derived 5-character projection may collide; the allocator must retry against active codes and retained reservations. Invoice IDs use the payment reference and an issuance sequence starting at `01`, with at least two digits and continuation as `100` after `99`; old invoice IDs remain searchable. New receipt IDs use the listing code, invoice sequence and an unpadded per-invoice payment sequence. Historical receipt IDs remain unchanged. | Product and Finance |
| Listing-code read permission | Decided | Existing listing-admin read access controls the code; knowing it cannot grant admin access or private data. | Product |
| Listing-code placement | Decided | The code appears in both the Listings table and listing detail screen. | Product and Design |
| Cached listing preview | Decided | Previously cached preview content may persist; no purge or regeneration is guaranteed. The current page and fresh metadata omit the code and private data. | Product |
| Setup mail | 🚧 In flight | One setup reminder at 24 hours after close while setup is incomplete; auction-won and setup-reminder letters name delivery address, payment method and billing address as bullets; setup overdue at 48 hours is generic, names manual review, and never cancels automatically. No second (72h) reminder. | Product (@tangconst) |
| Payment mail | 🚧 In flight | The first payment reminder goes at send, then day 3 and day 6 on the running deadline; the final notice 24 hours before the deadline while Pay is offered; payment overdue replaces invoice-expired. Letters name the total and `Pay by …`, never a method. Durable `notifications-order` holds that schedule; `add-winner-bank-transfer` adds proof holds and the receipt PDF. | Product (@tangconst) |
| Letter CTA | Decided | Default opens the lot's Winner Order, sign-in first; overdue letters lead with Contact Us; the Shipped letter leads with the carrier's tracking. | Product (@tangconst) |
| Contact Us destination | Decided | Copy-first sheet on Winner Order: To, Subject, Message, Copy Message first, Open Mail App second. Copy Message shows no confirmation beyond the control's own state. Letters prefill the same mailto and name the address. Chosen over opening a mail client, a contact form, or a toast with the address only. A partial-payment template lists receipts and never the remaining balance. Subject uses the current invoice id after a reissue; Message is an editable Textarea with Copy Message footer-only. | Product (@tangconst) |
| Reissue letter | Decided | A reissue sends the payment reminder sent at invoice send, for the new invoice; it fires on the same kind of event, so a separate reissued letter is dropped. | Product (@jeffffej0909) |
| Delivered content | Decided | Delivery address and delivered time; View order first, Contact Us second. | Product (@jeffffej0909) |
| Cancelled content | Decided | Cancelled time only; the operator's reason stays internal. Contact Us first, View order second. | Product (@jeffffej0909) |
| Cancelling a paid order | 🚧 In flight | An order with money counting toward its balance cannot be cancelled; it is refunded instead. Only unpaid orders are cancelled, so the cancelled letter names no payment. Chosen over cancelling a paid order, which would leave money with no order to return it against. Owned by `refine-auction-order-cancellation` Q13. | Product (@jeffffej0909) |
| A separate orders page | Decided | Won lots are followed on My Auction Orders — needs action first, then newest close — and each Won row opens the order. | Product |
| Suspension | Decided | Auction-only, forward-looking; a standing maximum keeps bidding and can win; only an operator's reinstatement lifts it, and the operator's reason is never shown to the collector. | Product |
| Billing address on setup | 🚧 In flight | Asked at order setup with the delivery address, not at payment, so the invoice is sent with it and never reissued for it. Same as delivery by default, chosen from the same address book, shown as Bill To beside Ship To on the invoice and receipt. It reverses the rule that the form offers no billing address. | Product (@jeffffej0909) |
| Country or region on delivery setup | Decided | On Winner Order delivery Add Address, country or region lists every country and region A–Z in a searchable field; typing filters matching names. **BREAKING** vs letter typeahead on Select (`full-winner-order-country-region-list` non-goal reversed). Catalogue source is an engineering choice (owned list, package, or admin portal crawl). Chosen over a short designated set and over letter-jump Select. | Product (@tangconst) |
| Phone on Add Address | Decided | Country-aware phone: country and digits required; E.164 when parseable; unusual formats accepted. Phone country starts empty — nothing preselected. Placeholder shows an example with calling code (`+852 12345678`). Chosen over hard validity refuse and over free-text with no country selector. | Product (@tangconst) |
| Personal or company address | Decided | Personal / Company toggle on Add Address; Company Name required only for company, hidden on personal. No tax ID or VAT. A company address shows the company name as the picker card title; a personal address shows the recipient name. Card body shows street, city or region, and country only — no postal code and no phone. Order summary Delivery and Billing show the full snapshot (company when company, recipient name, phone, full address including postal). First and last name stay required on both. | Product (@tangconst) |
| Add Address optional locality | Decided | Address line 2 and state or province are optional; address line 1 and postal code stay required. Apt./Suite/Building is not collected on this form. | Product (@tangconst) |
| Billing country or region list | 🚧 In flight | Billing Add Address uses the same full A–Z list and searchable field as delivery: one control, and a winner billed abroad finds their country the same way. | Product (@tangconst) |
| Shippable destinations only | Decided | The picker keeps every destination for now; limiting it to where Grade10 ships is later work. Chosen over limiting it now, which needs Operations' destination list first. | Product (@tangconst) |
| Catalogue display locale | 🚧 In flight | Country/Region names follow the account's language, as the rest of the site does. Chosen over the browser's locale and over fixed English. | Product (@tangconst) |
| Overdue penalties | ❓ Open | What "penalties or extra charges" means after a setup miss vs a payment miss. | Product (@tangconst) |
| Partial payment | 🚧 In flight | Operator-only: manual settlement gains the ability to record a payment smaller than the balance owed, any number of times. Self-service card and bank transfer stay full-amount only. | Product and finance |
| Awaiting Setup | Decided | Incomplete setup reads Awaiting Setup while its address window is open or reopened. After the 48-hour address deadline with no confirmed address it reads Setup Overdue; a confirmed address reads Preparing Invoice. | Product (@jeffffej0909) |
| Setup Overdue and Payment Overdue | Decided | **BREAKING** vs keeping Awaiting Setup / Pending Payment after the deadline: an incomplete setup reads Setup Overdue after 48 hours from the lot's actual close; Payment Overdue starts only after Grade10 sends the invoice and its 7-day payment deadline passes. Preparing Invoice has no setup-overdue queue mark. | Product and design (@tangconst) |
| Address window | 🚧 In flight | The stored 48-hour deadline is based on the actual lot close and does not move with configuration changes. Confirm and address changes close at expiry. An operator can reopen with a reason for another 48 hours, or record a phone-supplied address with an audit entry. Invoice send ends the address window. | Product and finance |
| My Auctions Status column | Decided | The table column formerly Your Standing is Status — bid standing while open, the order's status once won. | Product and design (@tangconst) |
| Partially Paid | 🚧 In flight | Its own status, entered the moment an operator records a payment smaller than the balance owed; ends the payment deadline for good rather than pausing it, since self-service Pay is never offered again on that invoice. | Product (@jeffffej0909) |
| Closing a partial balance | 🚧 In flight | Measured against the original invoice total, cumulative across every payment, not the balance left at that moment: updating the invoice to Paid is refused below 90% of the total, and once payments reach 90%, every further payment offers the operator a close, Paid with no separate write-off entry, or kept Partially Paid at the real balance. The prompt returns on each payment while still under 100%, so a `keep open` answer never quietly waives later checks. An exact match closes on its own. | Product and finance |
| Overpaying a partial balance | 🚧 In flight | A payment above the original invoice total is accepted after an operator confirmation dialog before the invoice is marked Paid. The full payment remains recorded; the excess can be returned through the refund flow. | Product and finance |
| Partial payment locks Reissue and Cancel | 🚧 In flight | Once any payment is recorded, the invoice's address, method and total stay fixed; an operator resolves the rest by hand outside the system rather than Grade10 reconciling a changed total against money already collected. | Product and finance |
| Balance owed stays operator-only | 🚧 In flight | Winner Order never shows a running balance; a Partially Paid winner sees a locked page and Contact Us. Each payment still reaches the winner as its own receipt PDF. | Product and finance |
| Receipt ID format | 🚧 In flight | New receipts issued for finalized full or partial payments use `RC-{listing code}{invoice sequence}P{receipt sequence}`, such as `RC-LK42301P1`. The receipt sequence starts at 1 for each invoice and is unpadded. Historical `REC-...` receipts remain unchanged; refunds, reversals and voids issue no receipt. Formal tax-receipt content stays open. | Product (@jeffffej0909) |
| Receipt breakdown | Decided | Each receipt freezes and shows, in order, Original Invoice Total, Previous Payments, Current Payment Received and Remaining Balance Due. The remaining balance is zero when payment closes the invoice, including a tolerance close or confirmed overpayment. Refunds and reversals do not change an issued receipt or a later receipt's Previous Payments. | Product and finance |
| A balance belongs on a receipt, not on a page | Decided | A receipt freezes what was owed at one payment and is the winner's proof; a page shows a live figure and invites a self-service payment that is no longer offered. So Remaining Balance Due is on every receipt PDF while Winner Order shows none. | Product and finance |
| Receipts are append-only | Decided | A refund or reversal issues no new receipt and rewrites none: every receipt already issued stands, and no later receipt's Previous Payments moves. Chosen over a revision suffix on the receipt id, which would rewrite every receipt after the one refunded to keep the chain honest. | Product and finance |
| Formal tax receipt | ❓ Open | Whether a receipt must carry Grade10's company details and tax ID. | Finance |
| One-time address persistence | 🚧 In flight | An unsaved one-time address stays on the order until the winner confirms or the setup deadline passes, so leaving to check something never loses it. Chosen over clearing it on leaving. | Product (@tangconst) |
| Payment fee wording | 🚧 In flight | Card reads `Card fee about 3.4% + a fixed amount`; bank transfer reads `Bank fee set on your invoice`, with no amount since the operator sets it. Chosen over showing no figure for either. | Product (@tangconst) |
| Card in USD and JPY | 🚧 In flight | Card launches without a rule in USD and JPY: until Finance saves one, a winner in that currency is not offered card and reads why. Chosen over holding launch for Finance's rates and over charging no card fee. | Finance |
| Transfer contact channel | Decided | An operator reaches a winner about a transfer or a proof on WhatsApp, at the address form's phone number. Chosen over email alone and over both. | Operations |
| Copy Message confirmation | Decided | Copy Message shows no confirmation beyond the control's own state, and no toast, so the dialog stays the only thing on screen. Chosen over keeping the toast and over no feedback. | Product (@tangconst) |
| No payment method in a currency | 🚧 In flight | A winner whose currency offers neither card nor bank transfer reads that payment is not yet available there, with Contact Us; the setup deadline keeps running, so the order can go Setup Overdue, and an operator reopens or records setup by hand. Chosen over pausing the deadline, which is more to build, and over holding launch for Finance's USD and JPY rules. | Product (@tangconst) |
| Bidders ban and suspension | Decided | The auction admin's Bidders ban is the same auction suspension; it records another cause on the one standing and never becomes a platform ban. | Engineering |
:::
