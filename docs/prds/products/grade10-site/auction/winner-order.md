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
| Order setup | **48 hours** from the lot's actual close, extended bidding included, to confirm a delivery address |
| Payment | **7 calendar days** from when Grade10 sends the invoice, never from lot close; nothing the winner does moves it |
| Buyer's premium | **20%** of the winning bid, rounded half up, or the currency's minimum charge when higher — **0** in USD, HKD and JPY |
| Saved addresses | **5** named addresses per account |
| Payment proof | 🚧 **1 to 5** PDF, JPEG or PNG files of up to **10 MB** each, uploaded once |
| Records | 🚧 Invoice and receipt PDFs kept at least **7 years**, or for the life of the account if longer |

:::flow{title="Settling a won lot"}
## *Grade10* — **Opens the order**
At the close: the bid-time hold, where one exists, is released and never
captured, and the auction-won letter asks for a delivery address.
## *Winner* — **Confirms the address and the payment method**
Within 48 hours; the order reads Preparing Invoice.
## *Operator* — **Sends the invoice**
Shipping and insurance priced for that address; the 7-day payment window
starts — [Post-Sale Queue](/p/grade10-admin/auction/post-sale).
## *Winner* — **Pays**
By card, one new charge for the order total, or by bank transfer, quoting
the reference and uploading proof an operator checks.
## *Grade10* — **Records the payment**
The order reads Processing and the receipt appears.
## *Operator* — **Ships**
Carrier and tracking number; the order reads Shipped.
## *Carrier* — **Delivers**
The proof is recorded and the order reads Delivered.
:::

## Order Setup

- **Address** — a saved address or a new one; the account default is
  pre-filled but still confirmed. The order keeps a snapshot, so editing the
  book later changes nothing here, and an unpaid order's address cannot be
  archived
- **Saved addresses** — at the cap, Add new address still confirms a
  one-time address for this order, offered ahead of the saved ones; Save this
  address for future orders waits until one is removed — [Delivery
  Addresses](/p/grade10-site/account/addresses)
- ❓ **One-time address after a reload** — whether it survives leaving and
  returning to the order; Product and Design confirm
- 🚧 **Form** — name, phone, country or region, town or city, address line 1,
  state or province and postal code are required; an empty one is refused
  beside the field, and the phone's format is not checked
- 🚧 **Payment method** — chosen with the address, nothing preselected, each
  choice showing the fee range Grade10 sets: card in every currency, bank
  transfer in a currency with bank details — HKD at launch
- ❓ **Fee range wording** — what each choice says; the bank transfer wording
  names no amount, because the operator sets that fee — Product confirms
- ❓ **Billing address** — the form offers none, while the order letters
  still name one among the setup steps; Product reconciles
- **Deadline** — `Confirm by …` under Confirm; when it passes, Confirm is
  hidden, the overdue alert reads `Missed address deadline` with Contact Us,
  the status stays Awaiting Address, and nothing cancels or suspends
- 🚧 **After the deadline** — the whole form closes, a confirmed address
  included; only Grade10 reopens it for a fresh 48 hours, or records an
  address the winner gives by phone. The account's address book stays open
- 🚧 **Locked on confirming** — the winner changes neither the address nor
  the method afterwards; an operator edits them on request before send and
  reissues after, and the order shows what changed

## Invoicing

- **Invoice** — one operator-sent invoice per lot, never combined with
  another; no amount is shown or marked an estimate before send
- **Card fee** — grossed up from the Subtotal at send from the provider's
  live fees, so Grade10 keeps the Subtotal whole; fixed once sent
- 🚧 **Bank transfer fee** — the amount the operator enters, Free when zero

| Line | What it is |
| --- | --- |
| Winning Bid | The accepted bid that won the lot |
| Buyer's Premium | 20% of the winning bid or the currency minimum; Grade10 computes it, and no operator enters, waives or changes it |
| Shipping & Handling | Quoted for the confirmed address; zero reads Free, and a difference found after payment is neither charged nor refunded |
| Insurance | Optional and more than zero; the line is absent when none |
| Tax | Reserved for the tax change |
| Subtotal | The lines above; the page summary may leave it out, the invoice and receipt keep it |
| Payment Processing Fee | Priced by payment method, fixed at send |
| Order Total | Subtotal plus the fee — what the winner pays |

- 🚧 **Invoice ID** — `INV-202609-LK7P2Q-01`: the month sent, the listing's
  code and the count; a reissue gets a new ID and bank reference, and the old
  ones still find the order
- **PDFs** — the invoice once sent and the receipt once paid, on one row;
  hidden when Cancelled

## Paying by Card

- **Card** — a fresh charge while the invoice is pending, on a stored card or
  another; a declined attempt leaves the invoice payable until the deadline
- 🚧 **Unfinished payment** — a payment that times out or is abandoned says
  so and leaves Pay Now ready; a completed one reads Confirming payment until
  Grade10 records it
- 🚧 **Started in time** — a payment received before the deadline completes
  even if it confirms after; one received at or after it is refused and the
  card is not charged

## Paying by Bank Transfer

- 🚧 **Bank transfer** — the invoice shows SWIFT, FPS and Hong Kong local
  transfer details instead of card Pay, and the reference to quote, with Copy
  Reference Code
- ❓ **Bank details** — the account details for each of the three ways —
  Finance confirms
- 🚧 **Bank reference** — `LK7P2Q01`, capital letters and digits only; only a
  bank transfer invoice shows it
- 🚧 **Payment proof** — uploaded once after paying, behind a confirm step
  saying nothing can be added later; the order then reads Payment Verifying,
  the deadline stops, and card Pay and further uploads are hidden
- 🚧 **Proof not accepted** — the operator's reason shows on the order, the
  latest only; the deadline runs again with the time that was left, and the
  winner uploads again
- 🚧 **Proof stays private** — the winner never sees a proof file or its
  name, their own or an operator's; the order shows only that proof was sent

## Receipts

- **Receipt** — the itemised amount and how it was paid: card brand and last
  four, or the method and reference an operator recorded, marked as manually
  settled
- 🚧 **A confirmed transfer** — its receipt reads Bank Transfer, not manually
  settled
- 🚧 **Receipt ID** — `REC-202609-LK7P2Q-01-P1`: the month paid and the paid
  invoice's code and count, with the invoice total, earlier payments, this
  payment and the balance due
- 🚧 **A partial payment's receipt** — one receipt per payment an operator
  records, `-P1`, `-P2` and on, each carrying the invoice total, payments
  before it, this payment and the balance still due; every receipt for the
  invoice lists on the same Receipt PDF row on Winner Order, oldest first

## Logistics

- **Shipment** — carrier, tracking number and a link to the carrier, then the
  delivery proof when the carrier provides one; an operator records both from
  the [Post-Sale Queue](/p/grade10-admin/auction/post-sale)

## Edge Cases

- **After the payment deadline** — the invoice is expired: card Pay is
  hidden, the overdue alert carries Contact Us, the status stays Pending
  Payment, and an operator reissues, settles manually or cancels
- **Suspension** — the auction-only restriction and the amount still owed;
  paying does not restore bidding by itself — [Bidder
  Suspension](/p/grade10-site/auction/bidder-suspension)
- 🚧 **Suspension on a Partially Paid order shows no amount** — Contact Us
  covers it instead, once any payment has been recorded against the invoice
- 🚧 **Partial payment** — an operator records a payment smaller than the
  balance owed, as many times as it takes; the order reads Partially Paid,
  the payment deadline stops for good, and card Pay is not offered again.
  Reissue and Cancel are refused once any payment has been recorded — [Auction
  Order Status](/p/grade10-site/auction/order-status)
- 🚧 **Closing a partial balance** — once payments total 90% or more of the
  original invoice, every further payment the operator records offers a
  close: Paid, or kept Partially Paid at the real balance; an exact match to
  the full amount closes on its own
- ❓ **Overpaying a partial balance** — whether a payment that would push the
  total over the original invoice is refused outright, or offered the same
  close-or-keep-open choice above 100%; Product and Finance confirm

## The Page

- **Progress** — five steps, Address → Invoice → Payment → Shipped →
  Completed, with day-only dates; Cancelled and Refunded show no stepper
- 🚧 **Payment Verifying** — sits under Payment
- 🚧 **Partially Paid** — sits under Payment, the same as Payment Verifying;
  the order status vocabulary grows to ten names
- 🚧 **Sections** — Order Information with Invoice Status (Not issued,
  Pending, Payment Verifying, Partially Paid, Paid, Expired, Cancelled,
  Refunded), Collection Method, Order Status with a time per step, and Lots
- **Notifications** — the post-close letters for this lot — [Order
  Notifications](/p/grade10-site/auction/notifications-order)

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
| Winner | The first payment attempt fails before the deadline | Understands the refusal and can retry while the invoice remains pending. |
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
| Address deadline | Decided | 48 hours from lot close to confirm a delivery address. Missed deadline hides Confirm and shows Contact Us; status stays Awaiting Address; no invoice is issued. No automatic cancel or suspension. | Product (@tangconst) |
| Reopening the address form | Decided | An operator reopens the winner's address form, with a reason, once the 48-hour deadline passes before the winner ever confirms an address. It gives a fresh 48 hours. Only Grade10 reopens it, and never on a cancelled order. | Product (@jeffffej0909) |
| Telling the winner the form reopened | Decided | No letter. The winner asked for the reopen, so the operator tells them directly. | Product (@jeffffej0909) |
| Operator records the address | Decided | Grade10 can type in an address the winner gives by phone, without reopening the form, so the quote follows in one step. The deadline governs the winner's own form, not Grade10's record. | Product (@jeffffej0909) |
| The account address book | Decided | Unaffected by a missed address deadline. It is account-wide and shared across storefronts; only confirming an address onto this order is refused. | Product (@jeffffej0909) |
| A payment started in time | Decided | A card payment Grade10 received before the payment deadline counts even if it confirms after. The invoice stays pending until the outcome, and only a failure then marks it expired. | Product (@jeffffej0909) |
| Saved address cap | Decided | Five named shipping addresses per account. At the cap, Add new address still confirms a one-time address for the order; Save this address for future orders is refused until the winner removes one. | Product (@tangconst) |
| One-time address persistence | ❓ Open | The picker keeps the unsaved one-time address visible and selectable ahead of the saved ones for this order; whether it survives leaving and returning, or a reload, is open. | Product (@tangconst) |
| Payment deadline | Decided | 7 calendar days from invoice send, not from lot close. Absolute datetime in the winner’s zone; no countdown. | Product |
| Deadline ends self-service Pay | Decided | When the invoice is expired, Winner Order hides card Pay and shows Contact Us in the overdue alert. A deadline that still allowed card pay would not be a deadline. Operator reissue, manual settlement, or cancel remain. | Product (@tangconst) |
| Progress stepper | Decided | Five presentation steps: Address → Invoice → Payment → Shipped → Completed. Status vocabulary stays nine values, with Payment Verifying under Payment; Processing maps under Shipped; Delivered maps to Completed. Step subtext carries day-only milestone dates. | Product and design (@tangconst) |
| Invoice PDF | Decided | After send, the winner may view and download the invoice PDF on Winner Order until Cancelled. | Product (@tangconst) |
| Receipt PDF | Decided | After payment, the winner may view and download a receipt PDF on Winner Order on the same row as Invoice. | Product and design (@tangconst) |
| Buyer's premium | Decided | 20% of the winning bid alone, rounded half up, or the lot currency's minimum charge when higher. Grade10 computes it; no operator enters, waives or changes it. The rate is disclosed on the bid panel only. | Product and finance |
| Premium minimum | Decided | One Grade10-owned amount per currency, editable by a settlement-authorized operator under Payment Settings; 0 means no minimum, and the initial values are 0 in USD, HKD and JPY. A new value applies to invoices sent or reissued after it takes effect. | Product and finance |
| Bank transfer by the winner | 🚧 In flight | The winner may pay by bank transfer and upload proof, reversing the card-only rule. Card fees on high-value lots make a transfer worth offering. | Product (@jeffffej0909) |
| One fee line | 🚧 In flight | Payment Processing Fee stays on every invoice and is priced by method, so a bank transfer can carry an administrative fee. The operator enters that fee each time, with no cap. | Product (@jeffffej0909) |
| Fee disclosure | 🚧 In flight | The winner chooses a method on a fee range Grade10 sets; the amount is first shown on the sent invoice, and an operator reissues if the winner then wants the other method. | Product (@jeffffej0909) |
| Winner's choice locks on confirming | 🚧 In flight | Once the winner confirms the address and payment method, only an operator changes them: an edit with a reason before send, a reissue after. This reverses the rule that let the winner change the address, and then the method, until the invoice was sent. | Product (@jeffffej0909) |
| Billing address on setup | ❓ Open | The order form offers no billing address, while the auction-won and setup-reminder letters name one among the setup steps. Product and Design reconcile the two changes. | Product and design (@tangconst) |
| Payment deadline while proof is checked | 🚧 In flight | The deadline stops on upload and resumes with the time left if the proof is not accepted, so a winner never loses time to the check. | Product (@jeffffej0909) |
| Invoice and receipt identifiers | 🚧 In flight | Each ID names its listing by a code hashed from the listing's internal id, not by a running count, so the IDs do not reveal how much Grade10 sells. Operators keep a separate gapless audit number the winner never sees. Source: [Grade10 Invoicing Identifiers](/references/grade10-invoicing-identifiers). | Product (@jeffffej0909) |
| Partial payment | 🚧 In flight | Operator-only: manual settlement gains the ability to record a payment smaller than the balance owed, any number of times. Self-service card and bank transfer stay full-amount only. | Product and finance |
| Closing a partial balance | 🚧 In flight | Measured against the original invoice total, cumulative across every payment, not the balance left at that moment: once payments reach 90% of the total, every further payment offers the operator a close, Paid with no separate write-off entry, or kept Partially Paid at the real balance. The prompt returns on each payment while still under 100%, so a `keep open` answer never quietly waives later checks. An exact match closes on its own. | Product and finance |
| Overpaying a partial balance | ❓ Open | Whether a payment pushing the total past the original invoice is refused outright or offered the same close prompt above 100%. This change's proposal assumes refused outright pending confirmation; scoped out of the interview so far — the author deliberately settled the underpayment side first. | Product and finance |
| Partial payment locks Reissue and Cancel | 🚧 In flight | Once any payment is recorded, the invoice's address, method and total stay fixed; an operator resolves the rest by hand outside the system rather than Grade10 reconciling a changed total against money already collected. | Product and finance |
| Balance owed stays operator-only | 🚧 In flight | Winner Order never shows a running balance; a Partially Paid winner sees a locked page and Contact Us. Each payment still reaches the winner as its own receipt PDF. | Product and finance |
:::
