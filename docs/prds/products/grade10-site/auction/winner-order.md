---
title: Winner Order
spec: grade10-site/auction/winner-order
order: 32
---

Winner Order is the authenticated page where a collector settles one lot after
it closes: the delivery address, the invoice, the payment, the receipt, the
shipment and the delivery evidence for that lot, together.

## Values

| Rule | Value |
| --- | --- |
| Order setup | 🚧 **48 hours** from lot close to confirm a delivery address and a payment method |
| Payment | **7 calendar days** from when Grade10 sends the invoice, not from lot close |
| Buyer's premium | **20%** of the winning bid, or the currency's minimum charge when higher; a minimum of 0 means none |

## Order Setup

- **Address first** — a closed lot opens asking for a delivery address; the
  winner confirms the account's saved or newly entered address before an
  operator prepares an invoice
- 🚧 **Saved addresses** — an account keeps up to 5 named shipping addresses;
  at the cap, Add new address still works for this order only, and Save this
  address for future orders is refused until one is removed — [Delivery
  Addresses](/p/grade10-site/account/addresses)
- ❓ **One-time address persistence** — whether the unsaved one-time address
  the winner enters at the cap is visually distinguished from saved addresses
  in the picker, and whether it survives navigating away and back or a page
  reload
- 🚧 **Address form** — First Name, Last Name, Phone, Country/Region,
  Town/City, Address Line 1, State/Province/Region and Postal Code are
  required; Company Name, Address Line 2 and Apt./Suite/Building are optional;
  the phone number's format is not checked
- 🚧 **Payment method** — the winner chooses card or bank transfer when
  confirming the delivery address; nothing is preselected and a choice is
  required. Each choice shows the fee range Grade10 sets. Bank transfer is
  offered only in a currency with bank details set up — HKD at launch
- ❓ **Billing address** — whether order setup also requires a billing address
  on Winner Order (mail already names it with delivery address and payment
  method); Product and Design confirm soon
- ❓ **Fee range wording** — what the choice says for each method; the bank
  transfer wording names no amount, because the operator sets that fee —
  Product confirms
- 🚧 **Deadline** — 48 hours from lot close to confirm a delivery address;
  `Confirm by …` under the CTA (with time); the overdue alert reads `Missed
  address deadline: {date}` with Contact Us; Confirm is hidden when the window
  passes; status stays Awaiting Address
- 🚧 **After the deadline** — a winner who has not confirmed an address by the
  deadline gets no further chance to on their own; only Grade10 reopens the
  address form, which gives a fresh 48 hours, or records an address the winner
  gives by phone
- 🚧 **Account addresses** — the account address book stays open after the
  deadline; only putting an address on this order is refused
- 🚧 **Locked on confirming** — once the winner confirms the address and
  payment method, the order reads Preparing Invoice and the winner can no
  longer change either; before that, the winner changes them freely
- 🚧 **Changes after confirming** — a new address or payment method is made
  by an operator, on the winner's request: before send, the operator edits the
  order and it stays Preparing Invoice; after send, the operator reissues the
  invoice, and the replaced invoice reads as replaced by the new one. The
  order shows what the operator changed
- ❓ **Asking for a change** — how the winner asks for a new address or
  payment method after confirming — Design confirms

## Invoicing

- **Invoice** — one operator-quoted invoice per lot; shipping and insurance
  are priced for the confirmed address, and the seven-day payment window
  starts at send
- 🚧 **Invoice lines** — Winning Bid, Buyer's Premium, Shipping & Handling,
  Insurance when added, Tax, Subtotal, Payment Processing Fee and Order Total;
  Shipping & Handling of zero reads Free. Insurance is optional and separate
  from Payment Processing Fee. The on-page summary may omit Subtotal and show
  fee lines plus Order Total; invoice and receipt itemisation keep Subtotal
- 🚧 **Payment Processing Fee** — priced for the invoice's payment method and
  fixed once the invoice is sent: for card, the fee added on top of the
  Subtotal so Grade10 keeps the Subtotal in full; for bank transfer, the
  amount the operator enters, which may be zero and then reads Free
- 🚧 **Fee transparency** — Buyer's Premium, Shipping & Handling, and Payment
  Processing Fee carry brief info tooltips on the order summary
- 🚧 **Invoice ID** — `INV-202609-LK7P2Q-01`: the month sent (Hong Kong time),
  the listing code, and the invoice count, `01` for the first and the next on
  each reissue. The listing code is `L` and 5 letters or digits, fixed for the
  listing, and not shown on the public listing page
- 🚧 **Reissued invoice** — gets a new invoice ID and bank reference; a payment
  quoting the old ones still finds the order
- 🚧 **Invoice PDF** — once an invoice has been sent, the winner can view and
  download it (PDF icon + Invoice); hidden before send and when Cancelled

## Paying by Card

- **Card** — a fresh card payment while the invoice is `pending`, recorded
  paid when the provider confirms it; a declined attempt leaves the invoice
  payable until the deadline
- 🚧 **Unfinished payment** — a card payment that times out or is abandoned
  says it was not completed and leaves Pay Now ready. A completed one reads
  Confirming payment until Grade10 records it paid
- 🚧 **A payment already on its way** — a card payment Grade10 received before
  the deadline still completes if it confirms after; one received at or after
  the deadline is refused and the card is not charged

## Paying by Bank Transfer

- 🚧 **Bank transfer** — an invoice sent for bank transfer shows SWIFT, FPS
  and Hong Kong local bank transfer details instead of card Pay, and asks the
  winner to quote the bank reference, with a **Copy Reference Code** button
- ❓ **Bank details** — the account details for each of the three ways —
  Finance confirms
- 🚧 **Bank reference** — `LK7P2Q01`: 8 capital letters and digits, 9 after
  the 99th invoice, with no spaces or symbols. Only a bank transfer invoice
  shows it
- 🚧 **Payment proof** — after paying, the winner uploads 1 to 5 PDF, JPEG or
  PNG files of up to 10 MB each, once; the order then reads Payment Verifying,
  the payment deadline stops, and card Pay and further uploads are hidden
- 🚧 **Proof not accepted** — an operator returns the invoice to `pending`
  with a reason the winner reads on the order, the latest one only; the
  deadline runs again with the time that was left
- 🚧 **Proof stays private** — the winner never sees a proof file or its name,
  their own or an operator's; the order shows only that proof was sent
- **Operator confirmation** — an operator checks the proof and records the
  payment — [Post-Sale Queue](/p/grade10-admin/auction/post-sale)

## Receipts

- **Receipt** — the itemised amount and how it was paid: card brand and last
  four, or the method Grade10 recorded
- 🚧 **Receipt ID** — `REC-202609-LK7P2Q-01-P1`: the month paid and the paid
  invoice's code and count. The receipt shows Original Invoice Total, Previous
  Payments, Current Payment Received and Remaining Balance Due
- 🚧 **Receipt PDF** — after payment, the winner can view and download an
  itemised receipt (PDF icon + Receipt), on the same row as Invoice
- 🚧 **Record keeping** — every invoice and receipt PDF is kept at least 7
  years, or for the life of the account if longer, even after the account is
  deleted

## Logistics

- **Shipment** — carrier, tracking number, carrier link, fulfilment events,
  and delivery proof when available
- **Recorded by an operator** — from the [Post-Sale
  Queue](/p/grade10-admin/auction/post-sale); the winner reads the same facts

## Edge Cases

- 🚧 **After the payment deadline** — card Pay is hidden; the overdue alert
  carries Contact Us; an operator reissues, settles manually, or cancels
- **Suspension** — the auction-only restriction and the amount still owed
  when the deadline has passed; paying does not restore bidding by itself —
  [Bidder Suspension](/p/grade10-site/auction/bidder-suspension)
- ❓ **Wrong amount received** — what happens when a bank transfer arrives
  short of or over the invoice: several payments against one invoice, a
  shortfall tolerance, overpayment and refunds are a separate change —
  Product and Finance confirm

## The Page

- 🚧 **Progress** — five presentation steps in order: Address → Invoice →
  Payment → Shipped → Completed; Cancelled and Refunded show no stepper. Step
  subtext uses day-only dates (Payment while due reads Pay by …; Address while
  awaiting reads Confirm by …); long copy wraps. Order status keeps its nine
  names
- 🚧 **Page sections** — Order Information (with **Invoice Status**, formerly
  Paid Status), Collection Method, Order Status with a timestamp per step, and
  Lots
- **Notifications** — the post-close letters for this lot, reminders ending
  when the order is no longer self-service payable — [Order
  Notifications](/p/grade10-site/auction/notifications-order)
- **URL** — an authenticated auction-order address that identifies one order
  and never another collector's order

::cases{id="grade10-site/auction/winner-order"}

:::detail{title="Product decisions" for="pm"}
The winner needs one place to understand what is owed and what happens next.
The page is order-native rather than listing-native, so a collector who wins
several lots receives one independent deadline, address snapshot, payment, and
shipment for each.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | A lot has just closed | Confirms where to ship within 48 hours, waits for Grade10 to quote the delivery cost, and then sees the invoice and its payment deadline. |
| Winner | The address deadline passed | Sees Contact Us, and gets the address form back only when Grade10 reopens it. |
| Winner | The first payment attempt fails before the deadline | Understands the refusal and can retry while the invoice remains `pending`. |
| Winner | The card has been dispatched | Finds the receipt PDF, tracker, fulfilment trail, and delivery proof later. |
| Suspended winner | The payment deadline passed | Sees what remains owed, why bidding stopped, and Contact Us — not a card Pay control. |

**Not in scope.** Combined invoices, payment plans, buyer-initiated returns,
or changes to the bid-time auction rules.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Line names | Decided | Hammer price reads Winning Bid, Shipping reads Shipping & Handling, and Final amount reads Order Total, for the winner and the operator. | Product |
| Insurance | Decided | Optional per invoice; when added it is more than zero. An invoice without it shows no Insurance line. Separate from Payment Processing Fee. | Product |
| Postal Code in Hong Kong | ❓ Open | Postal Code is required, but Hong Kong addresses have none. Product to confirm whether it stays required everywhere. | Product |
| Payment processing fee | 🚧 In flight | Charged to the winner on every invoice. For card, grossed up from the Subtotal at send from the payment provider's live fees, never from a rate set in the admin portal. For bank transfer, the amount the operator enters. | Product (@jeffffej0909) |
| Fee on a manual settlement | 🚧 In flight | Kept: every settlement is at the invoice's Order Total. A card invoice paid another way is first reissued as bank transfer, with the fee the operator sets. | Product (@jeffffej0909) |
| A fee that costs more than quoted | Decided | Grade10 absorbs the difference; the sent invoice never re-prices. | Product |
| Fee tooltips | Decided | Buyer’s Premium (20% rule), Shipping & Handling (operator quote for the address), and Payment Processing Fee (brief card-fee copy) carry info tooltips. | Product and design (@tangconst) |
| Summary Subtotal row | Decided | On-page Winner Order summary may omit Subtotal and show fee lines plus Order Total; invoice and receipt itemisation keep Subtotal for the fee gross-up. | Product and design (@tangconst) |
| Free shipping | Decided | Shipping & Handling of zero reads Free rather than hiding the line. | Product |
| Address deadline | Decided | 48 hours from lot close to confirm a delivery address. Missed deadline hides Confirm and shows Contact Us; status stays Awaiting Address; invoice stays `not_issued`. No automatic cancel or suspension. | Product (@tangconst) |
| Reopening the address form | Decided | An operator reopens the winner's address form, with a reason, once the 48-hour deadline passes before the winner ever confirms an address. It gives a fresh 48 hours. Only Grade10 reopens it, and never on a cancelled order. | Product (@jeffffej0909) |
| Telling the winner the form reopened | Decided | No letter. The winner asked for the reopen, so the operator tells them directly. | Product (@jeffffej0909) |
| Operator records the address | Decided | Grade10 can type in an address the winner gives by phone, without reopening the form, so the quote follows in one step. The deadline governs the winner's own form, not Grade10's record. | Product (@jeffffej0909) |
| The account address book | Decided | Unaffected by a missed address deadline. It is account-wide and shared across storefronts; only confirming an address onto this order is refused. | Product (@jeffffej0909) |
| A payment started in time | Decided | A card payment Grade10 received before the payment deadline counts even if it confirms after. The invoice stays pending until the outcome, and only a failure then marks it expired. | Product (@jeffffej0909) |
| Saved address cap | Decided | Five named shipping addresses per account. At the cap, Add new address still confirms a one-time address for the order; Save this address for future orders is refused until the winner removes one. | Product (@tangconst) |
| One-time address persistence | ❓ Open | Whether the picker visually distinguishes the unsaved one-time address from saved ones, and whether it survives leaving and returning to the order or a page reload. | Product (@tangconst) |
| Payment deadline | Decided | 7 calendar days from invoice send, not from lot close. Absolute datetime in the winner’s zone; no countdown. | Product |
| Deadline ends self-service Pay | Decided | When the invoice is `expired`, Winner Order hides card Pay and shows Contact Us in the overdue alert. A deadline that still allowed card pay would not be a deadline. Operator reissue, manual settlement, or cancel remain. | Product (@tangconst) |
| Progress stepper | Decided | Five presentation steps: Address → Invoice → Payment → Shipped → Completed. Status vocabulary stays nine values, with Payment Verifying under Payment; Processing maps under Shipped; Delivered maps to Completed. Step subtext carries day-only milestone dates. | Product and design (@tangconst) |
| Invoice PDF | Decided | After send, the winner may view and download the invoice PDF on Winner Order until Cancelled. | Product (@tangconst) |
| Receipt PDF | Decided | After payment, the winner may view and download a receipt PDF on Winner Order on the same row as Invoice. | Product and design (@tangconst) |
| Buyer’s Premium rate | Decided | The invoice carries a buyer's premium calculated as 20% of the winning bid; the rate is disclosed on the bid panel only. | Product / finance |
| Buyer's premium | Decided | 20% of the winning bid alone, rounded half up, or the lot currency's minimum charge when higher. Grade10 computes it; no operator enters, waives or changes it. | Product and finance |
| Premium minimum | Decided | One Grade10-owned amount per currency is editable by a settlement-authorized operator under `/auction`. 0 means no minimum. A new value applies to invoices sent or reissued after it takes effect. | Product and finance |
| Bank transfer by the winner | 🚧 In flight | The winner may pay by bank transfer and upload proof, reversing the card-only rule. Card fees on high-value lots make a transfer worth offering. | Product (@jeffffej0909) |
| One fee line | 🚧 In flight | Payment Processing Fee stays on every invoice and is priced by method, so a bank transfer can carry an administrative fee. The operator enters that fee each time, with no cap. | Product (@jeffffej0909) |
| Fee disclosure | 🚧 In flight | The winner chooses a method on a fee range Grade10 sets; the amount is first shown on the sent invoice, and an operator reissues if the winner then wants the other method. | Product (@jeffffej0909) |
| Winner's choice locks on confirming | 🚧 In flight | Once the winner confirms the address and payment method, only an operator changes them: an edit with a reason before send, a reissue after. This reverses the rule that let the winner change the address, and then the method, until the invoice was sent. | Product (@jeffffej0909) |
| Billing address on setup | ❓ Open | Whether Winner Order requires a billing address with delivery address and payment method; order mail already names all three. | Product and design (@tangconst) |
| Payment deadline while proof is checked | 🚧 In flight | The deadline stops on upload and resumes with the time left if the proof is not accepted, so a winner never loses time to the check. | Product (@jeffffej0909) |
| Invoice and receipt identifiers | 🚧 In flight | Each ID names its listing by a code hashed from the listing's internal id, not by a running count, so the IDs do not reveal how much Grade10 sells. Operators keep a separate gapless audit number the winner never sees. Source: [Grade10 Invoicing Identifiers](/references/grade10-invoicing-identifiers). | Product (@jeffffej0909) |
| Partial payment | ❓ Open | A separate change: several payments against one invoice, a shortfall tolerance, overpayment, and refunds. | Product and finance |
| Minimum values | Decided | The initial values are 0 in USD, HKD, and JPY; the mapping is editable under `/auction`. | Product and finance |
:::
