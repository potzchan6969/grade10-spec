---
title: Post-Sale Queue
spec: grade10-admin/auction/post-sale
audience: operator
order: 13
---

The queue works every winner order from lot close through delivery in one
place: each row wears one outcome, the queue filters to one outcome at a
time, and an order opens into its winner, invoices, payments, addresses,
fulfilment and trail.

## Values

| Rule | Value |
| --- | --- |
| Payment window | **7 calendar days** from send |
| Address window | **48 hours** from close; a reopen gives a fresh **48 hours** |
| Overdue | **72 hours** or more idle in Awaiting Address or Preparing Invoice |
| Proof files | **1 to 5** PDF, JPEG or PNG files of at most **10 MB** each, kept for the life of the account |
| Buyer's premium | **20%** of the winning bid or the currency minimum — [Payment Settings](/p/grade10-admin/auction/payment-settings) |

## Outcomes

A row reads the lot's status until the lot has a winner, then the order's
status, unchanged — [Auction Order
Status](/p/grade10-site/auction/order-status).

| Outcome | When | Needs action |
| --- | --- | --- |
| Draft · Scheduled · Live | Before a sale; time left is read from the close | No |
| Unsold · Called off | Ended without a payable order | No |
| Awaiting Address | The lot closed without a confirmed delivery address | No |
| Preparing Invoice | The winner confirmed an address; no invoice yet | Yes |
| Pending Payment | The invoice is unpaid; an expired one shows Expired beside it | When expired |
| 🚧 Payment Verifying | The winner uploaded payment proof | Yes, until the proof is checked |
| Processing | Paid, not dispatched | Yes |
| Shipped · Delivered | Dispatched; delivery confirmed | No |
| Cancelled · Refunded | A recorded terminal outcome | No |

- **Overdue** — a separate mark, filterable, on an order idle 72 hours or
  more in Awaiting Address or Preparing Invoice; it changes nothing, and the
  operator decides whether to contact the winner, invoice or cancel
- ❓ **Overdue after the address deadline** — whether the mark should follow
  the 48-hour address deadline rather than 72 hours idle; Product confirms
- **Extended bidding: ON** — a lot past its scheduled close and still taking
  bids carries this label; its outcome does not change
- 🚧 **Search** — by listing code, invoice ID or bank reference; a replaced
  invoice's ID or reference still finds the order

## Operator Actions

| Action | On | Grant |
| --- | --- | --- |
| Send invoice | Preparing Invoice | Payment processing |
| Reissue | A sent invoice, pending or expired | Payment processing |
| 🚧 Confirm or return proof | Payment Verifying, where these are the only actions | Payment processing |
| Settle manually | A bank transfer invoice, pending or expired | Payment processing |
| Cancel order | Awaiting Address, Preparing Invoice, or an expired invoice | Payment processing |
| 🚧 Reopen the address form, or record an address | Awaiting Address after the deadline, before send | Payment processing |
| Dispatch | A paid order | Shipment processing |
| Confirm delivery | A dispatched order | Shipment processing |
| Comment | Any order the operator can open | None |

- **Grants** — `staff` ships, `finance` pays, `admin` does both; a control the
  operator lacks the grant for stays visible and disabled, and the server
  refuses it too
- **Reason and name** — reissue, returning proof, manual settlement and
  cancellation each record the operator and a mandatory reason

## Payment

- **The quote** — the operator reads the confirmed address, the payment
  method, the winning bid and the premium, enters Shipping & Handling (zero
  allowed) and optional Insurance (above zero), reads Subtotal and Order
  Total, and sends; the send locks the address and starts the 7 days
- 🚧 **Billing address** — the quote shows it beside the delivery address;
  the send is refused while the order has none, and the operator adds it
  with the edit before send. Recording an address by phone asks for billing
  too, same as delivery by default
- 🚧 **Payment Processing Fee** — for card, priced by Grade10 from the
  provider's live fees, and the send is refused when they cannot be read; for
  bank transfer, entered by the operator on every invoice, zero or more, and
  the send is refused while it is blank
- 🚧 **Edit before send** — at the winner's request the operator changes the
  address, the method or both, with a reason the log keeps beside the old and
  new values; the order stays Preparing Invoice and its waiting time does not
  restart. Bank transfer only in a currency with bank details — HKD at launch
- 🚧 **Reissue** — one action for any change after send: address, method,
  bank transfer fee, shipping, insurance, and the deadline kept or restarted,
  with a reason and at least one change; no limit on reissues, each logged
  with its count, and the buyer's reissue history across all their orders
  shown before another is granted
- 🚧 **Checking proof** — the operator confirms, with the winner's files as
  proof and their own if they wish, or returns the invoice to pending with a
  reason the winner reads and one kept internal; the prompt shows the time
  left, and returning is not offered once the invoice has expired
- 🚧 **Expired invoice** — the winner can no longer pay it: a card payment
  received at or after the deadline is refused and the card not charged,
  while one started in time still counts. The operator reissues so the
  winner can pay again with a fresh 7 days, settles manually, or cancels
- 🚧 **Manual settlement** — records bank transfer, cash or another described
  method, a reference where required, and 1 to 5 private proof files; settled
  at the invoice's full order total with its fee line kept, and never on a
  card invoice, which is reissued as bank transfer first. The winner sees the
  method and reference on the receipt, never the files
- 🚧 **Reopening the address form** — after the 48-hour deadline and before
  send, on request and with a reason, giving a fresh 48 hours; repeatable,
  changes no status, never on a cancelled order. Or the operator records an
  address the winner gives by phone, leaving the form closed
- **Cancel** — the lot returns to stock with no runner-up offer; the hammer
  price and bid history stay for audit and are not carried into a new listing
- 🚧 **Internal audit number** — every invoice and receipt carries one gapless
  number, such as `#00010482`, shown on the order and in the invoice log and
  never to the winner; a replaced invoice keeps its number
- **The hold** — released at the close, never captured; every failed payment
  attempt stays in the invoice log
- ❓ **Contact channel** — how an operator reaches a winner about a wire or a
  proof; WhatsApp is the working assumption, and the number comes from the
  address form — Operations confirms

## The Order Detail

- **The winner** — the name on the account, the registered email and any
  phone number Grade10 holds; never a payment-provider identifier
- **Why this status** — the invoice status, the fulfilment status and the
  derived status with the rule that produced it, the payment deadline with
  its countdown or elapsed time, the reissue count, the winner's suspension
  state and reason, and a link to the lot and its bid history
- **How long it has waited** — Awaiting Address counts from the lot's close,
  Preparing Invoice from the latest address confirmation
- **The trail** — status changes and comments in one time order; anyone who
  can open the order may comment, an empty comment is refused, and nothing is
  edited or deleted, for the life of the account

## Fulfilment

Shipment is its own grant, deliberately apart from payment: the person who
may settle money is not necessarily the person who dispatches cards.

- **Dispatch** — requires a paid invoice and records the immutable address
  snapshot, the carrier and the tracking number; recording an address never
  dispatches
- **Delivery** — records the carrier's proof
- **The winner's view** — the same facts, read from [Winner
  Order](/p/grade10-site/auction/winner-order)

::cases{id="grade10-admin/auction/post-sale"}

:::detail{title="Product decisions" for="pm"}
The queue is the operator's close-out surface: payment and shipment are
separate jobs, while one listing detail keeps the winner contact, money,
delivery state, and operational trail together.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Payment source | Decided | The queue distinguishes a fresh Stripe charge from manual settlement, and both release the bid-time hold rather than capturing it. | Product and Finance |
| Shipment authority | Decided | Payment and shipment use separate grants; staff may ship, finance may collect, and publishing remains catalogue work. | Operations |
| Shipping model | Decided | Grade10 records the confirmed dispatch snapshot, carrier tracking, fulfilment milestones, and delivery proof. | Operations |
| Who reopens the address form | Decided | The operator, with payment processing and a mandatory reason. A reopen gives a fresh 48 hours and changes no status. | Product and Operations |
| Reopening a cancelled order | Decided | Refused. The lot is back in stock and may already be attracting bids, so an address on it would promise a lot Grade10 no longer holds for that winner. | Product and Operations |
| Operational history | Decided | Invoice and fulfilment logs remain append-only and separate from the compliance audit chain. | Product and Engineering |
| Overdue and the address deadline | ❓ Open | Whether the Overdue mark should follow the 48-hour address deadline instead of 72 hours idle, so a winner is not blocked for a day before an operator is told. | Product |
:::

## Pending Spec

::next{spec="grade10-admin/auction/post-sale"}
