# Post-Sale - delta

## Feature set

- Queue
  - Segments with counts: Needs action, Waiting on winner, In transit, Closed and All, the counts adding up to All
  - Won lots only: a lot before a sale is read in the Listings table, never in the worklist
  - Waited: each row counts from when its status began, and no second mark sits beside the status
  - Search: the start of a listing code, any invoice ID the order held, the winner's email, or a payment's reference
  - Row action: the status's primary action on the row, unless the order is flagged or the operator lacks its access
- Order page
  - Own address: an order opens at its own link, which a reload or a colleague opens again
  - Header: the status, a Test badge on a sandbox lot, the one-sentence rule behind the status, and the one primary action
  - More: only the actions that apply now
  - One timeline: the invoice log, the fulfilment log and comments, oldest first
  - Dialogs: each action restates what will happen, and a refusal reads as a sentence
  - Money in major units: an operator types `50.00` for HK$50
  - Hong Kong time: every date and time on the worklist, the order page, the timeline and the send and reissue dialog reads in Hong Kong time
  - Winner contact: the phone number from the confirmed delivery address, where an operator reaches the winner on WhatsApp about a transfer or a proof
- Quote and send
  - Fee by payment method: a card invoice's fee is computed from the Stripe card rule in Payment Settings; a bank transfer invoice's fee is typed by the operator, zero or more
  - What was seen is sent: a send or reissue carries the total the operator read
- Resolving an unpaid order
  - Record payment: one dialog for money received outside the card checkout, starting at the balance, always with a reason
  - Reissue while unpaid: a reissue only on a pending or expired invoice
- Money that lands
  - Always recorded: a card payment the invoice did not expect is recorded and flagged
  - Counts toward nothing: money on a replaced invoice, a cancelled order, at another amount or on an invoice in any other state pays nothing and blocks nothing, and finance returns it outside Grade10
  - Flags per payment: each flag is cleared on its own, with a reason
- Fulfilment on the order
  - Dispatch: the carrier, the tracking number and, when there is one, the carrier's tracker link, on a Preparing Shipment order
  - What the winner reads: the tracking number as the tracker link when one was given, plain text when none, never a carrier name or a Track shipment control
  - Delivery: the date and the carrier's proof, on a Shipped order
- Audit trail
  - Sent twice: an operator action repeated with the same request happens once and answers what it first did
  - Signed-in operator: every operator entry names the operator signed in and the time on Grade10's clock
- Grants
  - Named access: a control the operator lacks stays listed, disabled, and names the access it needs
  - Proof files: every operator who can open the order reads them; attaching one needs the grant of its action
- Setup
  - Reopen setup: an operator gives a winner in Setup Overdue a fresh 48 hours, with a reason, or records the setup themselves, never after the invoice is sent
- Listings
  - Extended: a lot still taking bids past its scheduled close reads Extended in the Listings table
  - Open order: a won lot's Listings row opens its order

## MODIFIED Requirements

### Requirement: The queue shows one outcome per lot

The post-sale queue is the Orders worklist: every won lot's auction order,
sorted into segments an operator works from.

**Won lots only** - The worklist SHALL list auction orders, one row per order.
A lot before a sale, one that closed unsold and one called off SHALL NOT be
listed.

**One status per order** - Each row SHALL show the order's derived status from
`grade10-site/auction/order-status`, taken unchanged. Grade10 SHALL NOT compute
a second status for the operator.

**Segments** - Each order SHALL sit in exactly one segment:

| Segment | Orders |
| --- | --- |
| Needs action | Setup Overdue, Preparing Invoice, Payment Overdue, Payment Verifying and Preparing Shipment, and every flagged order whatever its status |
| Waiting on winner | Awaiting Setup, Pending Payment and Partially Paid, when not flagged |
| In transit | Shipped, when not flagged |
| Closed | Delivered, Cancelled and Refunded, when not flagged |

All SHALL list every order, so the segments' counts add up to All's. Each
segment SHALL show how many of the orders the search finds it holds. The
worklist SHALL open on Needs action. Needs action, Waiting on winner and In
transit SHALL list the order that has waited longest first; Closed and All
SHALL list the latest first. A flagged order is per "Money that lands is always
recorded"; once every flag on it is cleared, it SHALL sit in its status's
segment.

**Row** - Each row SHALL show the listing code, which opens the order's page;
the lot; the winner; the status, marked when the order is flagged; the order
total once an invoice is sent; and how long the order has waited, per "The
order detail shows how long an order has waited". Statuses in different
segments SHALL NOT share a mark.

**Row action** - A row SHALL offer the primary action its status names, per
"The order detail explains its status", opening the same dialog as the order
page. It SHALL offer none when the order is flagged or the operator lacks the
action's grant.

**Filters** - The worklist SHALL let an operator filter to one status among
those the open segment holds, and, once that status is Cancelled, to one
cancellation category.

**Search** - The worklist SHALL find an order by the start of any of: its
listing code, which is also its payment reference; any invoice ID it has held,
a replaced one included; the winner's account email, in any case; and the
reference on a payment recorded against it. A replaced invoice's ID SHALL find its order, which
shows its current invoice.

**Own address** - The segment, the filters and the search SHALL be kept in the
worklist's address, so a reload or a shared link opens the same list.

Scenario `grade10-admin-auction-post-sale-SC-19` keeps its title with its id.
The title is historical: a lot still taking bids is not in the worklist.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-05a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-19 - A lot inside its last hour is Ending soon
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a published lot whose close is 60 minutes or less away and has not
  passed
- **WHEN** an operator reads the Orders worklist
- **THEN** that lot is not listed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-71a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-20 - A won lot's outcome is its derived order status
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a closed lot whose auction order derives as Preparing Shipment
- **WHEN** an operator reads the worklist
- **THEN** that order's row reads Preparing Shipment
- **AND** it is the same value the winner reads on their own order

Scenario `grade10-admin-auction-post-sale-SC-21` keeps its title with its id.
The title is historical: an expired invoice's order reads Payment Overdue,
Processing now reads Preparing Shipment, and both sit under Needs action.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-9oe rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-21 - Expired and Processing are highlighted as needing action
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a worklist holding a Payment Overdue order, a Pending Payment order,
  a Preparing Shipment order and a Delivered order, none flagged
- **WHEN** an operator opens Needs action
- **THEN** it lists the Payment Overdue order and the Preparing Shipment order
- **AND** it lists neither of the other two

<!-- trace:scenario id=g10adm.auction-post-sale.SC-88b rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-44 - An order ready for a quote needs action
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a worklist holding one order in Preparing Invoice and one in
  Awaiting Setup, neither flagged
- **WHEN** an operator opens Needs action, then Waiting on winner
- **THEN** Needs action lists the Preparing Invoice order
- **AND** Waiting on winner lists the Awaiting Setup order

<!-- trace:scenario id=g10adm.auction-post-sale.SC-cnh rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-116 - Proof waiting for a check needs action
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a worklist holding one order whose invoice is `payment_verifying`
  and one whose invoice is `pending` inside its deadline
- **WHEN** an operator filters All to Payment Verifying
- **THEN** only the first order is listed, reading Payment Verifying
- **AND** it counts under Needs action

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8dq rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-131 - A search finds the order by any of its identifiers
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** an order on listing `LK423` whose first invoice `IN-LK42301` was
  replaced by `IN-LK42302`
- **WHEN** an operator searches the worklist in turn by `LK423`, `IN-LK42301`,
  `IN-LK423` and `IN-LK42302`
- **THEN** each search finds that order
- **AND** the order shows `IN-LK42302` as its current invoice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-w38 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-159 - Each segment shows its count
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a worklist holding two Preparing Shipment orders, one Pending Payment order
  and one Delivered order, none flagged
- **WHEN** an operator opens Orders
- **THEN** Needs action is open, listing the two Preparing Shipment orders
- **AND** Needs action reads 2, Waiting on winner 1, In transit 0, Closed 1 and
  All 4

<!-- trace:scenario id=g10adm.auction-post-sale.SC-whp rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-160 - A search finds the order by the winner's email
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a Preparing Shipment order whose winner's account email is
  `collector@example.com`, among other orders
- **WHEN** an operator searches the worklist for `Collector@Ex`
- **THEN** the search finds that order
- **AND** Needs action and All read 1, and every other segment 0

<!-- trace:scenario id=g10adm.auction-post-sale.SC-iyb rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-161 - A flagged order counts under Needs action
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** an order in Pending Payment carrying a flag for a card payment that
  landed on its replaced invoice
- **WHEN** an operator opens Needs action, then Waiting on winner
- **THEN** Needs action lists the order with its flag, reading Pending Payment
- **AND** Waiting on winner does not list it
- **AND** once an operator clears the flag, it is listed under Waiting on
  winner only

<!-- trace:scenario id=g10adm.auction-post-sale.SC-kqf rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-180 - Work segments list the longest-waiting order first
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** two orders in Preparing Invoice whose winners confirmed setup 10
  and 30 hours ago, and two Delivered orders delivered 1 and 3 days ago
- **WHEN** an operator opens Needs action, then Closed
- **THEN** Needs action lists the order confirmed 30 hours ago first
- **AND** Closed lists the order delivered 1 day ago first

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8wv rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-181 - A row offers its status's primary action
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** an order in Preparing Invoice, an order in Preparing Shipment, and a
  flagged order in Preparing Shipment
- **AND** an operator whose roles are exactly `finance`
- **WHEN** they read Needs action and choose Send invoice on the first row
- **THEN** the send dialog of that order opens
- **AND** neither Preparing Shipment row offers an action

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d6e rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-182 - Filters follow the open segment
**Serves:** post-sale-US-01 - Operator works the orders worklist by segment

- **GIVEN** a worklist holding Cancelled orders of two cancellation categories
- **WHEN** an operator opens Closed, filters to Cancelled, then to one
  category, and reloads the page
- **THEN** the status filter offered Delivered, Cancelled and Refunded only
- **AND** the category filter appeared once Cancelled was chosen, and the list
  holds only that category's orders
- **AND** after the reload Closed and both filters are still applied

### Requirement: An operator resolves an unpaid order

An operator holding payment processing SHALL be able to take these actions on
an auction order that is unpaid.

| Action | Effect | Available |
| --- | --- | --- |
| Reissue | Replaces the current invoice with a new `pending` one, per "An operator reissues a sent invoice". The order reads Pending Payment | On an order whose invoice is `pending` or `expired` |
| Check proof | Confirms the payment or returns the invoice to `pending`, per "An operator checks payment proof" | On an order whose invoice is `payment_verifying` |
| Record payment | Records money received outside the card checkout, per "Manual settlement records the method and its proof" | On an order whose bank transfer invoice is `pending` or `expired`, or that reads Partially Paid |
| Cancel order | The order derives as Cancelled, per `grade10-site/auction/order-status`. The listing stays Closed and its stock hold is released, so the item is back in stock. | On an order in Awaiting Setup, Setup Overdue, Preparing Invoice or Payment Overdue |

While an invoice is `payment_verifying`, Grade10 SHALL offer only Confirm and
Return, and SHALL refuse Reissue, Record payment and Cancel.

Grade10 SHALL make Record payment available before expiry as well as after, so
money that arrived by another route need not wait for the deadline to elapse.

Reissue, returning proof, Record payment and cancellation SHALL each record a
named operator and a mandatory reason.

Reissuing an invoice SHALL NOT lift the winner's account suspension, per
`grade10-site/auction/bidder-suspension`. Reinstatement is a separate,
explicit action.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xod rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-23 - Reissue returns an expired order to Pending Payment
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator holding payment-processing
- **WHEN** they reissue the invoice with a reason
- **THEN** the invoice status is `pending` with a new 7-day deadline
- **AND** the derived order status is Pending Payment

<!-- trace:scenario id=g10adm.auction-post-sale.SC-em2 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-24 - Reissue leaves the suspension standing
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** a suspended winner whose expired order an operator reissues
- **WHEN** the reissue is committed
- **THEN** the account is still suspended
- **AND** the operator is not offered reinstatement as part of the reissue

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5aa rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-25 - An operator without the grant is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an order whose invoice is `expired`
- **THEN** the reissue, record payment and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server if they are attempted

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5qg rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-54 - An overdue order waiting on an address can be cancelled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order in Setup Overdue
- **AND** an operator holding payment processing
- **WHEN** they cancel it with a reason
- **THEN** the order derives as Cancelled, the listing stays Closed and its
  stock hold is released, so the item is back in stock
- **AND** the winner's account is not suspended

<!-- trace:scenario id=g10adm.auction-post-sale.SC-j3h rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-122 - A pending invoice offers reissue and settlement
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose bank transfer invoice is `pending`
- **AND** an operator holding payment processing
- **WHEN** they open it
- **THEN** Reissue and Record payment are offered
- **AND** Confirm and Return are not

<!-- trace:scenario id=g10adm.auction-post-sale.SC-bb5 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-127 - Only Confirm and Return while proof is checked
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Payment Verifying
- **AND** an operator holding payment-processing
- **WHEN** they open it, and attempt to cancel it
- **THEN** only Confirm and Return are offered
- **AND** Grade10 refuses the cancel and the invoice is still `payment_verifying`

### Requirement: Invoice log history

Every change to an auction order's money SHALL be written as an append-only
invoice log entry, never as a field overwrite. The order's detail SHALL show
these log entries in chronological order. It SHALL also show operators each
invoice's invoice ID, bank reference and internal audit number, and each
receipt's receipt ID and internal audit number, per
`grade10-site/auction/winner-order`.

| Field | Notes |
| --- | --- |
| Log type | Address reopened, address recorded, order edited before send, sent, expired, reissued, proof uploaded, proof confirmed, proof returned, paid, payment recorded, cancelled, refunded, payment attempt failed, flagged payment, flag cleared |
| Timestamp | Stored in UTC, displayed in Hong Kong time for every operator, per "Order dates and times read in Hong Kong time" |
| Invoice ID | The invoice the entry concerns |
| Internal audit number | Sent, reissued, paid and payment recorded entries: the number of the invoice or receipt the entry issued |
| Invoice status after the log entry | |
| Order total at the log entry | Captures amount changes across reissues |
| Amount delta | Where the amount changed from the prior log entry |
| Payment deadline at the log entry | The deadline trail across reissues and returned proof |
| Time left | Proof uploaded and proof returned entries |
| Deadline choice | Reissues only: kept or restarted |
| Changed parts | Order edited before send: delivery address, payment method or both. Reissues: each of delivery address, payment method, payment processing fee, Shipping & Handling, Insurance, Tax and deadline that changed. Each with its value before and after, and Tax with no amount where the invoice carried none |
| Reissue sequence number | Where the log entry is a reissue |
| Actor | The buyer, the system, or a named operator |
| Payment method | Paid, payment recorded and flagged payment entries: a card with its brand and last four digits, or bank transfer, cash, or other with its description |
| Flag | Flagged payment and flag cleared entries: the flag's kind and the payment it sits on |
| Proof files | Proof uploaded entries: the winner's files. Proof confirmed and payment recorded entries: every file on the payment record |
| External reference | Payment recorded entries only |
| Reason | Mandatory on an operator-initiated log entry that needs one, per "History is append-only and retained". A proof returned entry carries both the external and the internal reason |
| Payment-provider reference | Where one applies |

Grade10 SHALL record failed payment attempts in the invoice log. A buyer who
tried three times with a declining card is a different case from one who never
engaged, and the difference SHALL be visible to whoever decides on
reinstatement.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ua0 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-34 - Failed payment attempts appear in the invoice log
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** a winner whose card was declined three times before the deadline
  elapsed
- **WHEN** an operator reads the invoice log
- **THEN** it shows three failed payment attempts with their timestamps
- **AND** the buyer is distinguishable from one whose history holds only the
  issued log entry

<!-- trace:scenario id=g10adm.auction-post-sale.SC-j3o rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-35 - An amendment's amount change is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an auction order an operator reissued, changing the order total
  from 312000 to 316000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** it shows the reissued entry at 316000 minor units in HKD
- **AND** the delta from the prior entry and the deadline choice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hgz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-61 - A paid entry names how it was paid
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** one order the winner paid by a Visa card ending 4242 and one an
  operator settled by cash
- **WHEN** an operator reads each invoice log
- **THEN** the first paid entry names a Visa card ending 4242
- **AND** the second names cash, with its proof files

<!-- trace:scenario id=g10adm.auction-post-sale.SC-k8l rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-123 - A reissue names what it changed
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order an operator reissued, switching the method from card to
  bank transfer, which moved the payment processing fee from 11225 to 0, and
  changing Shipping & Handling from 8000 to 12000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names payment method, payment processing fee and
  Shipping & Handling as changed, each with its value before and after
- **AND** names no other part as changed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-tyi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-204 - A reissue that changes tax names it with its value before and after
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order in Pending Payment whose invoice has no Tax
- **AND** an operator reissued it with Tax of 6000 minor units in HKD and a reason, changing nothing else
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names Tax as the changed part, with no amount before and 6000 minor units in HKD after
- **AND** names no other part as changed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-jce rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-124 - A proof check is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose winner uploaded proof, an operator returned it with an external and an internal reason, and the winner uploaded again, which an operator confirmed
- **WHEN** an operator reads the invoice log
- **THEN** it shows proof uploaded, proof returned with both reasons and the time left, proof uploaded, and proof confirmed, in that order
- **AND** each names its actor and timestamp

<!-- trace:scenario id=g10adm.auction-post-sale.SC-dgt rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-132 - Operators read the internal audit numbers
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose first invoice holds internal audit number `#00010482`, whose reissued invoice holds `#00010490`, and whose receipt holds `#00010495`
- **WHEN** an operator opens the order and reads its invoice log
- **THEN** the order shows all three numbers against their invoice or receipt
- **AND** the sent entry shows `#00010482`, the reissued entry `#00010490` and the paid entry `#00010495`

### Requirement: Fulfilment log history

Every change to an auction order's goods SHALL be written as an append-only
fulfilment log entry. The order's detail SHALL show these log entries in
chronological order.

| Field | Notes |
| --- | --- |
| Log type | Created, address confirmed, dispatched, delivery confirmed, delivery exception |
| Timestamp | Stored in UTC |
| Fulfilment status after the log entry | |
| Delivery address at the log entry | A full snapshot, never a pointer — the address at dispatch SHALL remain reconstructable after a later edit |
| Actor | The buyer, the warehouse, the carrier, or a named operator |
| Carrier, tracking number and tracker link | From dispatch onward; the tracker link when the operator gave one |
| Delivery | The date the operator recorded, and the carrier's proof file when there is one |

An operator's change to the address is written to the invoice log, per
"Invoice log history". Because an operator's change to the address can change
the final amount, the address history and the invoice amount history SHALL be
independently reconstructable and cross-referenceable, so an amount change can
be explained afterwards.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-fzv rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-36 - The address at dispatch survives a later edit
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an auction order dispatched to an address the winner keeps in
  their address book
- **WHEN** the winner later edits that address book entry, and an operator
  reads the fulfilment log
- **THEN** the dispatch event still shows the full address as it stood at
  dispatch

### Requirement: The order detail explains its status

Each auction order has its own page, which leads with what to do next.

**Own address** - Each order SHALL open at its own address, which a reload or
a shared link opens again.

**Header** - The page SHALL lead with the derived order status; a Test badge
when the order is on a sandbox lot; one sentence naming the rule that produced
the status; how long the order has waited in it, per "The order detail shows
how long an order has waited"; and the primary action the table names for
that status.

| Status | Primary action |
| --- | --- |
| Awaiting Setup | None |
| Setup Overdue | Reopen setup |
| Preparing Invoice | Send invoice |
| Pending Payment | None |
| Payment Overdue | Reissue |
| Payment Verifying | Check proof |
| Partially Paid | Record payment |
| Preparing Shipment | Dispatch |
| Shipped | Confirm delivery |
| Delivered, Cancelled, Refunded | None |

**More** - Every other action that applies to the order now SHALL sit under
More, and nothing else. With no such action, the page SHALL show no More.

**What else it shows** - The page SHALL also show the order total, what is
paid, and the payment deadline with a countdown or an elapsed indicator; the
payment method; the reissue count for this order and the winner's reissue
history across all of their orders; each invoice the order has held, a
replaced one marked Replaced beside the invoice that replaced it; each
payment with its receipt; each proof file, which opens from the page; the
winner, their account suspension state and its reason; the setup they
confirmed; the shipment; and a link to the source lot and its bid history.

**One timeline** - The invoice log, the fulfilment log and comments SHALL read
as one timeline, oldest first, each entry marked with its kind. An operator
who can open the order SHALL be able to leave a comment of 1 to 2,000
characters. Grade10 SHALL refuse an empty comment, and SHALL NOT let a comment
be edited or deleted once recorded.

**Reading** - An operator who can open the order SHALL read it, open its proof
files and comment on it without payment processing, shipment processing or
refund processing. The page SHALL offer no control that changes who won.

**Actions in dialogs** - Each action SHALL open its own dialog that restates
what will happen before the operator confirms. A refusal SHALL show as a
sentence in that dialog, which stays open with what the operator entered.

**Money in major units** - An operator SHALL type money in the currency's major
units, `50.00` for HK$50.00, and Grade10 SHALL store the matching count of
minor units.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-i7j rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-37 - The detail explains the status it derived
**Serves:** Queue - the detail explains the status it derived

- **GIVEN** an auction order whose invoice is `expired` two days after its
  payment deadline
- **AND** an operator holding payment processing
- **WHEN** they open it
- **THEN** the order status shows as Payment Overdue
- **AND** the page names the rule that produced it - an invoice whose payment
  deadline passed two days ago unpaid - rather than the label alone
- **AND** Reissue is its primary action

<!-- trace:scenario id=g10adm.auction-post-sale.SC-seg rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-38 - A buyer's reissue history spans all their orders
**Serves:** Queue - a buyer's reissue history spans all their orders

- **GIVEN** a buyer with reissues on three different auction orders
- **WHEN** an operator opens any one of those orders
- **THEN** the detail shows that buyer's reissue history across all three
- **AND** the reissue count for the order in front of them

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ydn rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-162 - An order opens at its own address
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an operator on an order's page
- **WHEN** they reload it, and a colleague opens its link
- **THEN** both open the same order

<!-- trace:scenario id=g10adm.auction-post-sale.SC-bcb rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-163 - Comments share the timeline
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an order whose invoice was sent and then paid by card
- **AND** an operator who holds neither payment processing nor shipment
  processing
- **WHEN** they leave a comment, then try to leave an empty one
- **THEN** the timeline shows the sent entry, the paid entry and the comment
  with that operator and its time, oldest first
- **AND** the empty comment is refused

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d8k rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-164 - A refusal keeps the dialog open
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an operator holding payment processing in the send dialog of an
  order in Preparing Invoice, with Insurance of 40.00 entered and Shipping &
  Handling left blank
- **WHEN** they confirm the send
- **THEN** the dialog stays open with Insurance still 40.00
- **AND** it says in a sentence that Shipping & Handling is needed
- **AND** no invoice is sent

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lc8 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-165 - Money is typed in major units
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** an order in HKD in Preparing Invoice
- **WHEN** an operator types Shipping & Handling as `80.00` and sends
- **THEN** the invoice carries Shipping & Handling of 8000 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-f7t rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-184 - More holds only what applies now
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** a Preparing Shipment order and a Cancelled order, neither flagged
- **AND** an operator holding payment, shipment and refund processing
- **WHEN** they open each
- **THEN** the Preparing Shipment order offers Dispatch as its primary action and
  Refund alone under More
- **AND** the Cancelled order offers no primary action and no More

<!-- trace:scenario id=g10adm.auction-post-sale.SC-59i rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-185 - An order on a sandbox lot reads Test
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** one order on a sandbox lot and one on an ordinary lot
- **WHEN** an operator opens each
- **THEN** the first shows a Test badge beside its status
- **AND** the second shows none

### Requirement: Winner contact fields

An order's detail SHALL show the winner with their contact details
emphasised: the name on the account, the registered account email, and the
phone number from the delivery address the winner confirmed. Grade10 SHALL
NOT show a payment-provider customer or payment identifier as the winner's
contact.

**Transfer and proof contact** - An operator reaches the winner about a bank
transfer or a payment proof on WhatsApp, at that phone number.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-gw4 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-22 - The winner's email is the contact
**Serves:** Queue - the winner's email is the contact

- **GIVEN** an auction order with a winner
- **WHEN** an operator opens it
- **THEN** the winner's name and registered account email are shown as the
  contact
- **AND** no payment-provider identifier is shown in their place

<!-- trace:scenario id=g10adm.auction-post-sale.SC-kjb rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-203 - The order page shows the number to reach the winner on
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** a Payment Verifying order whose winner confirmed a delivery
  address with phone `+852 91234567`
- **WHEN** an operator opens the order
- **THEN** the page shows `+852 91234567` with the winner's name and email

### Requirement: Payment and shipment are separate grants

Recording money, recording the goods and recording a refund SHALL be distinct
grants, per `shared/auth/roles`. Catalogue work and bidder moderation SHALL
carry none of them.

| Role | Payment processing, `auction:payment` | Shipment processing, `auction:shipment` | Refund processing, `auction:refund` |
| --- | --- | --- | --- |
| staff | No | Yes | Yes |
| finance | Yes | No | No |
| treasurer | Yes | No | No |
| admin | Yes | Yes | Yes |

**Reading** - Opening the worklist and an order, opening its proof files and
commenting SHALL need auction read access, `auction:read`, and nothing more.

**Payment processing** SHALL allow sending and reissuing an invoice, recording
a payment, checking proof, cancelling an order, reopening or recording setup,
changing setup before send, clearing a flag, and Payment Settings, per
`grade10-admin/auction/payment-settings`.

**Shipment processing** SHALL allow recording dispatch and delivery.

**Refund processing** SHALL allow recording a refund, per "Refunds are
findable and permissioned".

**Proof files** - An operator SHALL attach a proof file only within an action
their grant allows: a payment's proof under payment processing, a refund's
under refund processing, and a delivery's under shipment processing.

**Named access** - A control whose grant the caller lacks SHALL stay listed
and disabled, with text naming the access it needs, such as "Needs payment
processing". A primary action SHALL stay in the header, disabled, with that
text beneath it. Grade10 SHALL refuse the same action on the server.

Recording a delivery address SHALL NOT dispatch the lot.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-3p6 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-39 - Staff cannot record payment
**Serves:** Grants - staff cannot record payment

- **GIVEN** an operator holding the staff role
- **WHEN** they open a Payment Overdue order whose invoice is bank transfer
- **THEN** Reissue stays in the header disabled, and Record payment and Cancel
  are listed under More disabled
- **AND** each names payment processing as the access it needs
- **AND** Grade10 refuses those actions on the server

<!-- trace:scenario id=g10adm.auction-post-sale.SC-34a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-40 - Finance cannot record dispatch
**Serves:** Grants - finance cannot record dispatch

- **GIVEN** an operator holding the finance role
- **WHEN** they open a Preparing Shipment order
- **THEN** Dispatch stays in the header, disabled
- **AND** the text beneath it names shipment processing as the access it needs
- **AND** Grade10 refuses a dispatch from them on the server

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lq4 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-41 - Recording an address does not dispatch the lot
**Serves:** Grants - recording an address does not dispatch the lot

- **GIVEN** an order in Preparing Invoice
- **AND** an operator holding payment processing
- **WHEN** they change its delivery address at the winner's request, with a
  reason
- **THEN** the order shows that address
- **AND** it still derives as Preparing Invoice, with no dispatch recorded

<!-- trace:scenario id=g10adm.auction-post-sale.SC-r1r rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-186 - Finance cancels an unpaid order
**Serves:** Grants - cancelling an order is payment processing

- **GIVEN** an operator whose roles are exactly `finance`
- **AND** an order in Payment Overdue
- **WHEN** they cancel it with a cancellation category and a note
- **THEN** the order derives as Cancelled
- **AND** the timeline names that operator on the cancelled entry

<!-- trace:scenario id=g10adm.auction-post-sale.SC-vg7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-187 - Proof files open for any operator and attach under their grant
**Serves:** Grants - reading every proof file, attaching only under the action's access

- **GIVEN** a Shipped order whose winner's payment proof an operator confirmed
- **AND** an operator whose roles are exactly `finance`
- **WHEN** they open the winner's proof file, then attempt to confirm delivery
  with a proof-of-delivery file
- **THEN** the proof file opens
- **AND** Confirm delivery stays disabled, naming shipment processing
- **AND** Grade10 refuses the delivery and stores no file

### Requirement: History is append-only and retained

Grade10 SHALL retain every invoice and fulfilment log record for the life
of the account, whatever the order's outcome, including cancelled orders
whose lots have been relisted. No record SHALL be deleted or edited in place.

Every operator-initiated log entry SHALL carry a named operator: the one
signed in, at the time on Grade10's own clock when it receives the action.
Grade10 SHALL ignore any operator name or time the action itself carries.

Reissuing, returning proof, recording a payment, cancelling, reopening or
recording setup, changing setup before send, clearing a flag and recording a
refund SHALL also carry a reason, and Grade10 SHALL refuse each without one. A
system-initiated log entry SHALL record the event that triggered it.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-cbk rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-42 - A relisted lot's cancelled order is retained
**Serves:** Queue - a relisted lot's cancelled order is retained

- **GIVEN** a cancelled auction order whose lot has since been relisted and
  sold again
- **WHEN** an operator opens the cancelled order
- **THEN** its full invoice and fulfilment log is still readable
- **AND** no record has been deleted or edited in place

<!-- trace:scenario id=g10adm.auction-post-sale.SC-yd7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-43 - An operator event without a reason is refused
**Serves:** Queue - an operator event without a reason is refused

- **GIVEN** an operator holding payment-processing
- **WHEN** they attempt to reissue an invoice without giving a reason
- **THEN** Grade10 refuses the action
- **AND** writes no history log entry

<!-- trace:scenario id=g10adm.auction-post-sale.SC-37a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-166 - A log entry names the operator signed in
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an operator signed in as `ops@grade10.com` and holding payment
  processing
- **WHEN** they reissue an invoice with a reason, sending an action that names
  another operator and a time a day earlier
- **THEN** the reissued entry names `ops@grade10.com`
- **AND** its timestamp is when Grade10 received the reissue

### Requirement: The order detail shows how long an order has waited

Every auction order SHALL show, on its worklist row and on its page, how long
it has waited in its current status, counted from the moment that status
began:

| Status | Waiting since |
| --- | --- |
| Awaiting Setup | The lot's close |
| Setup Overdue | The address deadline |
| Preparing Invoice | The winner's setup confirmation |
| Pending Payment | The send of the current invoice |
| Payment Overdue | The payment deadline |
| Payment Verifying | The winner's latest proof |
| Partially Paid | The latest payment |
| Preparing Shipment | The payment that paid the invoice |
| Shipped | The dispatch |
| Delivered | The delivery |
| Cancelled | The cancellation |
| Refunded | The refund |

A flagged order SHALL count from its earliest flag not yet cleared.

**No second mark** - Setup Overdue is the status an order reaches when its
48-hour address deadline passes, per `grade10-site/auction/order-status`.
Grade10 SHALL mark no other wait: Preparing Invoice carries no mark however
long it waits.

**Changes nothing** - How long an order has waited SHALL change nothing else.
Grade10 SHALL NOT expire, cancel, or suspend on it; the operator decides
whether to contact the winner, send the invoice, or cancel the order.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-sjh rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-45 - An order waiting on an address shows time since close
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order in Awaiting Setup whose lot closed 30 hours ago
- **WHEN** an operator opens it
- **THEN** the page shows that it has waited 30 hours since the lot's close
- **AND** it reads Awaiting Setup with no other mark

Scenario `grade10-admin-auction-post-sale-SC-46` keeps its title with its id.
The title is historical: an order past its 48-hour address deadline reads
Setup Overdue, and Preparing Invoice carries no mark however long it waits.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-egc rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-46 - An order idle 72 hours is marked Overdue
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** one auction order whose lot closed 50 hours ago with no setup
  confirmed
- **AND** one in Preparing Invoice whose winner confirmed setup 80 hours ago
- **WHEN** an operator reads the worklist
- **THEN** the first reads Setup Overdue, having waited 2 hours since its
  address deadline
- **AND** the second reads Preparing Invoice, having waited 80 hours, with no
  mark

<!-- trace:scenario id=g10adm.auction-post-sale.SC-i16 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-47 - Overdue changes no status
**Serves:** Queue - overdue changes no status

- **GIVEN** an auction order in Setup Overdue
- **WHEN** another 30 days pass with no operator action
- **THEN** its derived status is still Setup Overdue
- **AND** the winner's account is not suspended

<!-- trace:scenario id=g10adm.auction-post-sale.SC-obc rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-188 - A flagged order counts from its flag
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose current invoice was sent 3 days
  ago, flagged 2 days ago for a card payment that landed on its replaced
  invoice
- **WHEN** an operator reads the worklist
- **THEN** the order's row shows it has waited 2 days, since the flag

### Requirement: Manual settlement records the method and its proof

Record payment is how an operator records money the winner paid outside the
card checkout and outside a proof an operator confirmed. An operator holding
payment processing SHALL record a payment on an order whose bank transfer
invoice is `pending` or `expired`, or on a Partially Paid order:

1. Choose Record payment and read the current invoice's order total, what is
   paid so far, the balance, its payment method, and the locked delivery
   address.
2. Enter the amount received. It starts at the balance.
3. Choose the method: bank transfer, cash, or other. Card SHALL NOT be
   offered.
4. For other, describe the method, in 1 to 200 characters.
5. Enter the external reference. It is required for a bank transfer and
   optional for cash and other.
6. Enter the date the money was received, no later than today.
7. Attach proof: 1 to 5 files, each a PDF, JPEG, or PNG of at most 10 MB
   (10,485,760 bytes). One file that breaks this refuses the commit, and no
   file is stored.
8. Give a reason. It is required.
9. Read the balance before and after the payment, answer the choice it asks
   when it asks one, and commit.

What each payment does to the invoice follows "Operators can record an ordered
partial-payment history" and "Closing tolerance is explicit and preserves
payments". A payment above the balance, once the operator confirms it, SHALL
also carry the Overpaid flag, per "Money that lands is always recorded".

An invoice the payments pay SHALL become `paid` directly, without passing
through `payment_verifying`, and SHALL keep its payment processing fee line
unchanged.
Each payment SHALL be its own record, carrying the amount, the method, any
description, the external reference, the date received, the proof files and
the reason; no payment SHALL be rounded or dropped. Grade10 SHALL refuse an
amount of zero or less.

Record payment SHALL NOT be offered, and SHALL be refused, on a card invoice,
whatever the method; the operator reissues it as bank transfer first. It SHALL
NOT be offered on a `payment_verifying` invoice; the operator confirms or
returns the proof instead.

Proof files SHALL be readable by any operator who can open the order, SHALL be
retained for the life of the account, and SHALL NOT be deleted or replaced.
They SHALL NOT be shown to the winner. Grade10 SHALL log the operator, the
timestamp, the amount, the method, the external reference, the proof files and
the reason.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8xm rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-55 - A bank transfer with a slip settles the order
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals
  312000 minor units in HKD, with a payment processing fee of 0
- **AND** an operator holding payment processing
- **WHEN** they record a bank transfer of the balance received on 2026-09-25,
  with an external reference, one PDF transfer slip and a reason, and commit
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the payment record carries bank transfer, the reference, 2026-09-25
  and the slip
- **AND** the order derives as Preparing Shipment

Scenario `grade10-admin-auction-post-sale-SC-67` keeps its title with its id.
The title is historical: manual settlement keeps the payment processing fee.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-21a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-67 - Manual settlement drops the processing fee
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a
  subtotal of 312000 and a payment processing fee of 5000 minor units in HKD
- **WHEN** an operator records the balance by bank transfer with a reference,
  a proof file and a reason
- **THEN** the invoice is `paid` at 317000 minor units in HKD
- **AND** the invoice still carries the payment processing fee of 5000 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-fbr rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-56 - Settlement without proof is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator records a cash payment with no proof file and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-pvd rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-57 - Another method needs a description
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator chooses other, attaches proof, leaves the description
  empty, and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-xba rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-58 - No settlement before an invoice is sent
**Serves:** post-sale-US-07 - settlement waits for the invoice the quote sends

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator attempts to record a manual settlement
- **THEN** Grade10 refuses it
- **AND** the order is still Preparing Invoice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d5u rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-59 - A settled order refuses a second settlement
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** an operator attempts to record a second settlement against it
- **THEN** Grade10 refuses it
- **AND** the existing payment record is unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-e68 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-60 - Manual settlement is available before expiry
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer, three
  days from its deadline, and whose winner has arranged payment by bank transfer
- **AND** an operator holding payment processing
- **WHEN** they record the payment with its reference, proof and a reason
- **THEN** Grade10 accepts it
- **AND** the order derives as Preparing Shipment without having expired first
- **AND** the order never read Payment Verifying

<!-- trace:scenario id=g10adm.auction-post-sale.SC-wdr rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-62 - A proof file of the wrong kind is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator attaches a valid PDF with a 12 MB JPEG, or with a file
  that is not a PDF, JPEG, or PNG, and commits
- **THEN** Grade10 refuses the commit and stores no file
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-prr rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-120 - No manual settlement while proof is checked
**Serves:** Resolving an unpaid order - operator settlement

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator attempts to record a payment
- **THEN** Grade10 refuses it
- **AND** the invoice is still `payment_verifying`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-bgy rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-121 - A card invoice cannot be settled manually
**Serves:** Resolving an unpaid order - card invoice paid by transfer

- **GIVEN** an order in Pending Payment whose invoice was sent for card
- **WHEN** an operator opens the order
- **THEN** Record payment is not offered
- **AND** Grade10 refuses a bank transfer, cash or other payment recorded on that invoice

Scenario `grade10-admin-auction-post-sale-SC-130` keeps its title with its id.
The title is historical: an amount below or above the balance is recorded, per
"Operators can record an ordered partial-payment history", and only an amount
of zero or less is refused as a payment. Updating the invoice to Paid while
cumulative payments are below 90% of the original invoice total is refused per
"Closing tolerance is explicit and preserves payments".

<!-- trace:scenario id=g10adm.auction-post-sale.SC-gj2 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-130 - A settlement at another amount is refused
**Serves:** Resolving an unpaid order - operator settlement

- **GIVEN** an order in Pending Payment whose bank transfer invoice has an order total of 312000 minor units in HKD
- **WHEN** an operator attempts to record a payment of 0, or of -100 minor units in HKD, with proof and a reason
- **THEN** Grade10 refuses each
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5ky rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-189 - Record payment starts at the balance
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals
  312000 minor units in HKD
- **AND** an operator holding payment processing
- **WHEN** they open Record payment, then change the amount to `2000.00`
- **THEN** the amount first reads `3120.00`, with a balance of 312000 before
  and 0 after, and the dialog says the invoice will be paid
- **AND** at `2000.00` the balance after reads 112000 minor units in HKD, and
  the dialog says the order will read Partially Paid

<!-- trace:scenario id=g10adm.auction-post-sale.SC-5at rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-190 - A payment without a reason is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator records a bank transfer of the balance with a reference
  and a proof file, leaves the reason empty, and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

### Requirement: An operator edits the address or method before send

Before the invoice is sent, an operator changes the delivery address or the
payment method for the winner, with a reason.

**Edit before send** - Once the winner confirms, only an operator changes the
order's delivery address or payment method before the invoice is sent, per
`grade10-site/auction/winner-order`. An operator holding payment-processing
SHALL be able to do so on an auction order in Preparing Invoice, on the
winner's request:

1. Open the order and read the address and method the winner confirmed.
2. Enter a new delivery address, choose the other payment method, or both.
3. Enter a reason. It is required.
4. Commit.

| Rule | Value |
| --- | --- |
| Order status after the edit | Preparing Invoice |
| Changes allowed | Delivery address, payment method, or both. At least one SHALL differ from what the order holds |
| Bank transfer | Refused where Grade10 holds no bank details for the order's currency, per `grade10-site/auction/winner-order` |
| Invoice log entry | Order edited before send: the named operator, the reason, each part that changed, and its value before and after |
| Preparing Invoice waiting time | Unchanged. It counts from the winner's confirmation, per "The order detail shows how long an order has waited" |

**After the edit** - The order SHALL hold the new address as its snapshot and
the new method, and Winner Order SHALL show them.

**Refused** - Grade10 SHALL refuse an edit with no reason, and an edit that
changes nothing.

**After send** - The edit SHALL NOT be offered once the invoice is sent; a
change after send is a reissue, per "An operator reissues a sent invoice".

**Without payment-processing** - An operator without payment-processing SHALL
see the edit control visible and disabled, and Grade10 SHALL refuse the same
action on the server.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ys6 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-135 - An edit before send is recorded with its reason
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in HKD in Preparing Invoice whose winner confirmed the home address and card
- **AND** an operator holding payment-processing
- **WHEN** they change the address to the work address and the method to bank transfer, with the reason "Winner asked by email"
- **THEN** the order holds the work address and bank transfer
- **AND** the order is still Preparing Invoice
- **AND** the invoice log shows an order edited before send entry naming the operator, the reason, and the address and method before and after

<!-- trace:scenario id=g10adm.auction-post-sale.SC-13r rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-136 - An edit without a reason is refused
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator holding payment-processing commits a new address with the reason empty
- **THEN** Grade10 refuses it
- **AND** the order keeps the address the winner confirmed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7b2 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-137 - Staff cannot edit before send
**Serves:** Quote and send - edit before send

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the edit control is visible and disabled
- **AND** Grade10 refuses an edit from them on the server

<!-- trace:scenario id=g10adm.auction-post-sale.SC-j60 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-138 - A USD order cannot be edited to bank transfer
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in USD in Preparing Invoice whose winner confirmed card
- **WHEN** an operator holding payment-processing changes the method to bank transfer with a reason
- **THEN** Grade10 refuses it
- **AND** the order still holds card

<!-- trace:scenario id=g10adm.auction-post-sale.SC-htz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-139 - An edit does not reset the waiting time
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order whose winner confirmed an address at 2026-09-12T09:00:00Z
- **WHEN** an operator edits its address with a reason at 2026-09-14T09:00:00Z
- **AND** an operator opens the order at 2026-09-15T09:00:00Z
- **THEN** the page shows it has waited 72 hours since the winner's confirmation
- **AND** it reads Preparing Invoice with no Overdue mark

### Requirement: Operators can record one bounded refund and its stock outcome

An operator with refund processing, `auction:refund`, SHALL be able to record
exactly one refund on an auction order in Preparing Shipment, Shipped, Delivered or
Partially Paid:

1. Enter the amount: greater than zero and no greater than what is paid on the
   order, leaving out money that counts toward nothing, per "Money that lands is
   always recorded". It starts at that sum.
2. Choose the reason: Damaged, Not as described, Not received, Duplicate or
   overpayment, or Other. A note is optional.
3. Choose how the money went back: to the card, named by its brand and last
   four digits, or by bank through FPS, Hong Kong local bank transfer or
   SWIFT. Enter the provider or bank reference.
4. For a bank refund, enter the bank name and where the money went: an account
   number or IBAN, or for FPS a phone number, an email or an FPS ID. Grade10
   SHALL keep only its masked form, which the winner reads per
   `grade10-site/auction/winner-order`: an account number, IBAN, phone number
   or FPS ID to its last four digits, and an email to its first letter and its
   domain. Grade10 SHALL NOT keep the full account.
5. Enter the date the money left, no later than today.
6. Choose whether the lot returns to stock.
7. Attach proof: 1 to 5 files, each a PDF, JPEG or PNG of at most 10 MB.
8. Read the restatement of the amount, the method, where the money went and
   the lot's outcome, which says this is the order's only refund and cannot be
   undone, and commit.

The record SHALL carry all of the above, the operator and the time. Recording
it SHALL make the order Refunded, except a refund of exactly what was paid
above the order total, which keeps the order's status, per
`grade10-site/auction/order-status`. It SHALL preserve the shipment record,
fix the stock choice, and refuse a second refund.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7fc rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-145 - A refund closes a partially paid order
**Serves:** post-sale-US-16 - recording the external refund on the order

- **GIVEN** a Partially Paid order with 40000 minor units paid
- **WHEN** an operator records a 40000 minor unit bank refund with its reason, reference and proof
- **THEN** the order reads Refunded
- **AND** the refund stores the amount, method, audit number and stock choice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-dzs rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-146 - An over-refund is refused
**Serves:** post-sale-US-16 - refusing an amount the winner did not pay

- **GIVEN** an order with 40000 minor units paid
- **WHEN** an operator enters a refund above 40000 minor units
- **THEN** Grade10 refuses the record
- **AND** the order remains in its previous outcome

<!-- trace:scenario id=g10adm.auction-post-sale.SC-dwy rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-191 - A refund of the overpaid difference keeps the status
**Serves:** post-sale-US-16 - returning only what was paid above the order total

- **GIVEN** a Preparing Shipment order whose invoice of 312000 minor units in HKD was
  paid 320000
- **WHEN** an operator with refund processing records a refund of 8000 minor
  units in HKD with its reason, reference and proof
- **THEN** the order still reads Preparing Shipment
- **AND** a second refund on it is refused

<!-- trace:scenario id=g10adm.auction-post-sale.SC-brr rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-192 - A bank refund names where it went and is restated first
**Serves:** post-sale-US-16 - recording the external refund on the order

- **GIVEN** a Delivered order paid 312000 minor units in HKD
- **AND** an operator with refund processing
- **WHEN** they record 312000 returned by FPS to `HSBC`, FPS ID `12345678`,
  on 2026-09-25, for Not as described, with the lot back to stock and one
  proof file
- **THEN** before the commit the dialog restates the amount, FPS, `HSBC`, the
  FPS ID masked to its last four digits `5678`, and the lot back to stock, and
  says this is the order's only refund and cannot be undone
- **AND** after the commit the refund record carries FPS, `HSBC`, the masked
  FPS ID, 2026-09-25 and the reason, and the order reads Refunded
- **AND** neither the refund record nor the invoice log holds `12345678`

<!-- trace:scenario id=g10adm.auction-post-sale.SC-qno rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-200 - An FPS email is kept to its first letter and domain
**Serves:** post-sale-US-16 - recording the external refund on the order

- **GIVEN** a Delivered order paid 312000 minor units in HKD
- **AND** an operator with refund processing
- **WHEN** they record 312000 returned by FPS to `HSBC`, email
  `collector@example.com`, with its reason, reference and proof
- **THEN** the refund record keeps the email as its first letter `c` and its
  domain `example.com`
- **AND** neither the refund record nor the invoice log holds
  `collector@example.com`

## ADDED Requirements

### Requirement: The payment processing fee follows the invoice's payment method

The invoice's payment method decides where its payment processing fee comes
from.

**Card is computed** - A card invoice's fee SHALL be Grade10's own: the card
rule for the order's currency, per `grade10-admin/auction/payment-settings`,
grossed up so Grade10 keeps the subtotal whole. The operator SHALL NOT enter
or edit it. Grade10 SHALL compute it from the current subtotal each time the
quote or a reissue is opened, and fix it at send or reissue. The quote SHALL
show it read-only, with the rule it came from.

**No card rule refuses** - Where Payment Settings holds no card rule for the
order's currency, a card invoice is neither sent nor reissued, per "An operator
quotes and sends the invoice". Grade10 SHALL NOT guess a fee.

**Bank transfer is typed** - A bank transfer invoice's fee SHALL be the
operator's own: an integer count of minor units of zero or more in the lot's
currency, with no upper limit. An empty field SHALL be zero, and a fee of zero
reads Free to the winner.

**On a reissue** - The fee SHALL be editable only where the reissued invoice
is bank transfer, starting from the current invoice while the method stays
bank transfer. A switch to card SHALL price the fee from the card rule; a
switch to bank transfer SHALL start it empty, which reads zero.

**Never priced again** - A sent invoice SHALL keep its fee. A later change to
the card rule or to the premium minimum SHALL change no sent invoice; only a
reissue re-prices a card fee or lets the operator retype a bank transfer fee.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-qvj rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-167 - No card rule refuses the send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in USD in Preparing Invoice for card
- **AND** Payment Settings holds no USD card rule
- **WHEN** an operator holding payment processing opens the quote and attempts
  to send
- **THEN** Grade10 refuses with `CARD_FEE_UNSET`
- **AND** the dialog says the USD card fee is not set and points to Payment
  Settings

<!-- trace:scenario id=g10adm.auction-post-sale.SC-omk rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-168 - Grade10 computes the card fee
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for card with a
  subtotal of 312000 minor units
- **AND** the HKD card rule is 3.4 per cent and 235 minor units
- **WHEN** an operator holding payment processing opens the quote and sends
- **THEN** the invoice is `pending` with a payment processing fee of 11225 and
  an order total of 323225 minor units in HKD
- **AND** the quote showed the fee read-only with the HKD card rule it came
  from

<!-- trace:scenario id=g10adm.auction-post-sale.SC-t9u rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-169 - The card fee tracks the subtotal until send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for card with a
  subtotal of 312000 minor units, whose fee reads the computed 11225
- **AND** the HKD card rule is 3.4 per cent and 235 minor units
- **WHEN** an operator raises Shipping & Handling so the subtotal is 316000
  minor units
- **THEN** the fee reads 11366 and the order total 327366 minor units in HKD

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hto rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-171 - A switch to bank transfer starts the fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose card invoice has a subtotal of
  312000 and a fee of 11225 minor units in HKD
- **WHEN** an operator reissues it and switches the method to bank transfer
- **THEN** the payment processing fee reads empty, which is zero
- **AND** the operator reads 323225 as the previous and 312000 minor units in
  HKD as the new order total

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ltc rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-172 - A reissue that keeps bank transfer keeps its typed fee
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a
  subtotal of 312000 and a fee of 5000 minor units in HKD
- **WHEN** an operator reissues it, raising Shipping & Handling so the subtotal
  is 316000 minor units, and keeps bank transfer
- **THEN** the payment processing fee still reads 5000, editable by the
  operator

<!-- trace:scenario id=g10adm.auction-post-sale.SC-tj1 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-193 - A sent invoice keeps its fee when the card rule changes
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment whose card invoice carries a payment
  processing fee of 11225 minor units in HKD, computed from the HKD card rule
  of 3.4 per cent and 235 minor units
- **WHEN** an operator changes the HKD card rule to 3.9 per cent and 235 minor
  units
- **THEN** the invoice still carries the fee of 11225 minor units in HKD
- **AND** its order total is unchanged

### Requirement: A send or reissue carries the total the operator read

What the operator read is what the winner is sent.

**The total read** - A send and a reissue SHALL carry the order total the
operator read. Grade10 SHALL price the invoice again from the same inputs when
it receives it, and SHALL refuse it when its order total differs from the one
carried.

**After a refusal** - The dialog SHALL show the order total the operator read
and the new one, and keep every amount the operator entered, so they read the
new total before they send again.

**The deadline** - Before the operator sends, the dialog SHALL show, to the
minute and in Hong Kong time, the payment deadline the send will set: 7
calendar days from the moment of send, or the current deadline on a reissue
that keeps it.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-hgh rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-170 - A total that changed since it was read refuses the send
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in HKD in Preparing Invoice for bank transfer with
  a winning bid of 250000, a buyer's premium of 50000, Shipping & Handling of
  8000, Insurance of 4000 and a payment processing fee of 0 minor units, which
  an operator reads as an order total of 312000 minor units
- **AND** the HKD premium minimum is then raised to 60000 minor units
- **WHEN** the operator sends the invoice
- **THEN** Grade10 refuses the send, and the dialog shows 312000 as the total
  read and 322000 minor units in HKD as the new one
- **AND** Shipping & Handling and Insurance still read 8000 and 4000
- **AND** no invoice is issued

<!-- trace:scenario id=g10adm.auction-post-sale.SC-gks rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-194 - The dialog shows the deadline the send sets
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator reads its send dialog at 2026-09-12T09:00:00Z and sends
  it then
- **THEN** the dialog showed a payment deadline of 2026-09-19T09:00:00Z, to the
  minute, in Hong Kong time
- **AND** the invoice carries that deadline

### Requirement: Order dates and times read in Hong Kong time

Every date and time the Orders workspace shows an operator SHALL read in Hong
Kong time (Asia/Hong_Kong), labelled `GMT+8`, whatever zone the operator's
browser is in.
Grade10 stores each in UTC. This is the exception to UTC on admin surfaces that
`shared/dates-and-times` carries for Orders, per `align-collector-times-to-local-zone`.

| Surface | What reads in Hong Kong time |
| --- | --- |
| Orders worklist | Every date or time a row shows |
| Order page | The address deadline, the payment deadline and every other date or time the page states |
| Timeline and invoice log | Each entry's timestamp |
| Send and reissue dialog | The payment deadline the send sets, to the minute |

A date an operator types stays the calendar date they typed. It carries no time
and no zone.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-3j8 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-239 - Operators in different zones read the same Hong Kong time
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** a Pending Payment order whose payment deadline is 2026-09-19T09:00:00Z
  and whose invoice was sent at 2026-09-12T09:00:00Z
- **WHEN** one operator whose browser is set to London and another whose
  browser is set to Tokyo read the order page and its timeline
- **THEN** both read the payment deadline as 2026-09-19 17:00, labelled `GMT+8`
- **AND** both read the sent entry's timestamp as 2026-09-12 17:00, labelled
  `GMT+8`

### Requirement: An operator action sent twice happens once

Each operator action on an order carries one request, made when its dialog
opens. Grade10 SHALL carry out a request once. A repeat of it, such as a double
click or a retry after a reply was lost, SHALL answer what the first one did,
write no second log entry, send no second letter and move no second amount.
Grade10 SHALL refuse a request already used for another action or with other
values, change nothing, and tell the operator to open the dialog again.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lfk rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-240 - A repeated send happens once
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator sends the invoice and the same request reaches Grade10
  a second time
- **THEN** the second answers the outcome of the first
- **AND** the order holds one invoice, one sent entry on its log and one invoice
  letter

<!-- trace:scenario id=g10adm.auction-post-sale.SC-98a rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-241 - A request used for another action is refused
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an operator who sent the invoice on an order with one request
- **WHEN** the same request is made to record a payment on that order
- **THEN** Grade10 refuses it and the dialog tells the operator to open it again
- **AND** no payment is recorded and the log gains no entry

### Requirement: Dispatch and delivery are recorded on the order

An operator holding shipment processing records the goods leaving and arriving
from the order's page.

**Dispatch** - On a Preparing Shipment order, the operator SHALL record dispatch with
the carrier, the tracking number and, when there is one, a link to the
carrier's tracker, reading the delivery address the lot goes to. The order
SHALL then derive as Shipped. The winner's carrier link, per
`grade10-site/auction/winner-order` "Winner Order makes the tracking number the
carrier link", SHALL be that tracker link, the operator's only source for it.
With none given, the winner reads the tracking number as plain text, still with
no carrier name and no Track shipment control.

**Delivery** - On a Shipped order, the operator SHALL record the date it was
delivered, no later than today, with the carrier's proof when there is one:
one PDF, JPEG or PNG of at most 10 MB, which the winner keeps too. The order
SHALL then derive as Delivered.

**In order only** - Grade10 SHALL refuse dispatch on an order that is not
Preparing Shipment, delivery on one that is not Shipped, and a dispatch without a
carrier or a tracking number.

**On the record** - Each SHALL write a fulfilment log entry, per "Fulfilment
log history", and send the winner the shipped or delivered letter, per
`grade10-site/auction/notifications-order`.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-82s rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-173 - Dispatch with a carrier and tracking number ships the order
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** a Preparing Shipment order
- **AND** an operator holding shipment processing
- **WHEN** they record dispatch with carrier `SF Express` and tracking number
  `SF1234567890`
- **THEN** the order derives as Shipped
- **AND** the fulfilment log shows a dispatched entry with that carrier, that
  tracking number, the operator and the delivery address as it stood

<!-- trace:scenario id=g10adm.auction-post-sale.SC-9wm rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-237 - A dispatch with a tracker link gives the winner a link
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** a Preparing Shipment order
- **WHEN** an operator holding shipment processing records dispatch with
  carrier `SF Express`, tracking number `SF1234567890` and the tracker link
  `https://www.sf-express.com/track/SF1234567890`
- **THEN** the winner reads the tracking number `SF1234567890` as a link to
  that tracker link
- **AND** the winner reads no carrier name
- **AND** the winner sees no Track shipment control

<!-- trace:scenario id=g10adm.auction-post-sale.SC-pvi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-238 - A dispatch with no tracker link gives the winner plain text
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** a Preparing Shipment order
- **WHEN** an operator holding shipment processing records dispatch with
  carrier `SF Express`, tracking number `SF1234567890` and no tracker link
- **THEN** the order derives as Shipped
- **AND** the winner reads the tracking number `SF1234567890` as plain text,
  not a link
- **AND** the winner reads no carrier name and sees no Track shipment control

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7rg rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-174 - Delivery with proof completes the order
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** a Shipped order
- **AND** an operator holding shipment processing
- **WHEN** they record delivery on 2026-09-25 with the carrier's
  proof-of-delivery image
- **THEN** the order derives as Delivered
- **AND** the fulfilment log shows a delivery confirmed entry with that date
  and that image

<!-- trace:scenario id=g10adm.auction-post-sale.SC-b2b rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-175 - Dispatch and delivery cannot skip ahead
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** an order in Pending Payment and an order in Preparing Shipment
- **WHEN** an operator holding shipment processing records dispatch on the
  first and delivery on the second
- **THEN** Grade10 refuses both
- **AND** neither order's status moves

<!-- trace:scenario id=g10adm.auction-post-sale.SC-0ln rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-176 - A dispatch without a tracking number is refused
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** a Preparing Shipment order
- **WHEN** an operator holding shipment processing records dispatch with a
  carrier and no tracking number
- **THEN** Grade10 refuses it
- **AND** the order still derives as Preparing Shipment

### Requirement: Money that lands is always recorded

A card payment that reaches an order is never dropped.

**Recorded** - When a card payment completes, Grade10 SHALL record it against
the invoice it was made for, whatever that invoice's state, and SHALL do what
the first row that fits says:

| The card payment | What it does | Flag |
| --- | --- | --- |
| On a cancelled order, per "A late payment after cancellation is recorded without revival" | Counts toward nothing | Paid after cancel |
| On a replaced invoice | Counts toward nothing | Paid on a replaced invoice |
| At an amount or in a currency other than the invoice's order total | Counts toward nothing | Amount mismatch |
| On the current invoice while `pending` | Pays it | None |
| On the current invoice once `expired` | Pays it | Paid late |
| On the current invoice once `paid` | Counts above the order total | Overpaid |
| On the current invoice in any other state | Counts toward nothing | Unexpected status |

Only a card invoice opens a card payment, so the last row is a backstop. A
flagged payment SHALL write a flagged payment entry to the invoice log.
Grade10 starts no card payment on an expired invoice. The Paid late row covers
only money the provider captured anyway.

**Counts toward nothing** - Such a payment SHALL count toward no balance, SHALL
move no status, and SHALL NOT block a reissue or a cancel. Finance returns it
outside Grade10, and an operator then clears its flag. A payment counts toward
the balance when it carries no flag, or is flagged Paid late or Overpaid.

**A flagged order** - An order SHALL be flagged while any of its payments
carries a flag not yet cleared. The flag itself SHALL change no status. The
order page SHALL show one notice for each flag not yet cleared, saying in a
sentence what landed and where, with its own Clear flag.

**Clearing a flag** - An operator SHALL clear one payment's flag as "A late
payment after cancellation is recorded without revival" states. The invoice log
SHALL keep it as a flag cleared entry. Clearing SHALL change no status.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-en4 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-201 - A card payment that lands on an expired invoice pays it late
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** an order in Payment Overdue whose card invoice totals 323225 minor
  units in HKD
- **WHEN** a card payment of 323225 minor units in HKD completes against that
  invoice
- **THEN** Grade10 records it and flags it Paid late
- **AND** the invoice is `paid`, so the order derives as Preparing Shipment

<!-- trace:scenario id=g10adm.auction-post-sale.SC-c66 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-202 - A card payment on an invoice in any other state counts toward nothing
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** an order in Payment Verifying whose bank transfer invoice totals
  312000 minor units in HKD
- **WHEN** a card payment of 312000 minor units in HKD completes against that
  invoice
- **THEN** Grade10 records it and flags it Unexpected status
- **AND** the invoice is still `payment_verifying`, with nothing counted as
  paid

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ccp rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-178 - A card payment on a replaced invoice is recorded and flagged
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** an order whose card invoice of 323225 minor units in HKD was
  replaced by a reissue after the winner had started paying it
- **WHEN** that card payment of 323225 minor units in HKD completes
- **THEN** Grade10 records it against the replaced invoice and flags it Paid on
  a replaced invoice
- **AND** the order still derives as Pending Payment on the new invoice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-btq rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-179 - Clearing a flag changes no status
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** an order in Preparing Shipment, flagged Paid late for a card payment that
  paid its expired invoice
- **WHEN** an operator holding payment processing clears the flag with a reason
- **THEN** the order is no longer flagged and still derives as Preparing Shipment
- **AND** the invoice log shows a flag cleared entry with that operator and
  that reason

<!-- trace:scenario id=g10adm.auction-post-sale.SC-gmi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-195 - A payment at another amount counts nothing toward what is paid
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** an order in Pending Payment whose card invoice totals 323225 minor
  units in HKD
- **WHEN** a card payment of 300000 minor units in HKD completes against it
- **THEN** Grade10 records it and flags it Amount mismatch
- **AND** the invoice is still `pending`, with nothing counted as paid

<!-- trace:scenario id=g10adm.auction-post-sale.SC-amp rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-196 - An order stays flagged until each flag is cleared
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** an order in Pending Payment whose payments carry two flags
- **WHEN** an operator holding payment processing clears one with a reason
- **THEN** the order is still flagged and listed under Needs action, with one
  notice left on its page
- **AND** once the second is cleared, it is listed under Waiting on winner

<!-- trace:scenario id=g10adm.auction-post-sale.SC-3fi rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-199 - Money that counts toward nothing blocks neither a reissue nor a cancel
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** two orders in Payment Overdue, each with a card invoice of 323225
  minor units in HKD holding a card payment of 300000 flagged Amount mismatch
- **AND** an operator holding payment processing
- **WHEN** they reissue the first and cancel the second, each with a reason
- **THEN** the first reads Pending Payment on a new invoice, and the second
  reads Cancelled
- **AND** each flagged payment is still recorded and still flagged

### Requirement: The Listings table shows extended bidding and a won lot's order

The Listings table tells a lot still taking bids from one that closed, and
leads from a won lot to its order.

**Extended** - A published lot past its scheduled close and still taking bids,
as `grade10-site/auction/auction` defines extended bidding, SHALL read
Extended beside its status in the Listings table. Its status SHALL NOT
change. A lot not in extended bidding SHALL NOT read Extended.

**Open order** - The Listings row of a closed lot that has a winner SHALL offer
Open order, which opens that lot's order page.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-d3j rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-197 - A lot still taking bids reads Extended in the Listings table
**Serves:** post-sale-US-06 - Operator sees which lots are still in extended bidding

- **GIVEN** one published lot past its scheduled close and still taking bids,
  and one whose scheduled close has not arrived
- **WHEN** an operator reads the Listings table
- **THEN** the first reads Extended beside its status, which is unchanged
- **AND** the second does not read Extended

<!-- trace:scenario id=g10adm.auction-post-sale.SC-r4l rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-198 - A won lot's Listings row opens its order
**Serves:** post-sale-US-02 - Operator works one order from its own page

- **GIVEN** a closed lot with a winner
- **WHEN** an operator chooses Open order on its Listings row
- **THEN** that lot's order page opens

### Requirement: An operator reopens the address form

An operator holding payment-processing SHALL be able to reopen setup, the
address form, on an auction order in Setup Overdue whose address deadline has
passed. Reopen setup is that status's primary action, per "The order detail
explains its status":

1. Open the order and read when its address deadline passed and how many times
   the address form has already been reopened.
2. Give a reason. The reason is mandatory.
3. Commit.

On commit Grade10 SHALL set the order's address deadline to 48
hours from the moment of the reopen, per
`grade10-site/auction/winner-order`, and SHALL write a reopened entry to the
invoice log carrying the named operator, the timestamp and the reason.

A reopen SHALL write no status directly. Its reopened facts SHALL derive
Awaiting Setup. Its invoice status SHALL stay `not_issued`, and no order SHALL
be suspended or cancelled by it. Grade10 SHALL place no limit on how many times
one order's address form is reopened.

Grade10 SHALL refuse a reopen when the reason is missing, when the order's
address deadline has not passed, when the order already has a confirmed address,
when the order's invoice has been sent, since setup was already confirmed
before the send, and when the order's invoice status is `cancelled`, since cancellation has
already returned the lot to available stock. An operator without
payment-processing SHALL see the reopen control visible and disabled, and
Grade10 SHALL refuse the same action on the server.

An operator holding payment-processing SHALL also be able to record setup,
the delivery address, billing address and payment method the winner would
confirm, without reopening the address form, only for an unconfirmed Setup
Overdue order whose invoice status is `not_issued`, so a winner who gives their
setup by telephone is quoted in one step. The reason is mandatory. Recording
setup SHALL NOT reopen the window and SHALL NOT let the winner write again.
Grade10 SHALL refuse it without a reason, after address confirmation, after
invoice send and on a cancelled order. Grade10
SHALL write an address-recorded invoice-log entry carrying the named operator,
timestamp and reason. An operator without payment-processing SHALL see the
record control visible and disabled, and Grade10 SHALL refuse the same action
on the server.

**A method the currency offers** - Grade10 SHALL refuse to record a payment
method the order's currency does not offer, per
`grade10-site/auction/winner-order`: card where Payment Settings holds no card
fee rule for the currency, and bank transfer where Grade10 holds no bank
details for it. A reopen in a currency that offers neither method SHALL still
be allowed, and the winner then reads that payment is not yet available, with
Contact Us, per `grade10-site/auction/winner-order`.

**One order at a time** - Grade10 SHALL serialize the winner's address write,
the reopen, the record of setup and the invoice send under the order's
boundary, so each reads the state the one before it left.

Reopening and recording setup each need payment-processing, per "Payment and
shipment are separate grants", and each carries a reason, per "History is
append-only and retained".

<!-- trace:scenario id=g10adm.auction-post-sale.SC-ehu rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-75 - A reopen gives a fresh 48 hours
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  at 2026-09-14T09:00:00Z
- **AND** an operator holding payment-processing
- **WHEN** they reopen the address form with a reason at 2026-09-16T14:00:00Z
- **THEN** the order's address deadline is 2026-09-18T14:00:00Z
- **AND** the order derives as Awaiting Setup from its reopened window
- **AND** the winner can confirm a delivery address again

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8of rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-76 - A reopen without a reason is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose address deadline was 2026-09-14T09:00:00Z
- **WHEN** an operator attempts to reopen the address form without a reason
- **THEN** Grade10 refuses it
- **AND** the address deadline has still passed

<!-- trace:scenario id=g10adm.auction-post-sale.SC-u12 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-77 - An operator without the grant cannot reopen
**Serves:** Setup - reopen setup or record it

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an auction order whose address deadline has passed
- **THEN** the reopen control is visible and disabled
- **AND** Grade10 refuses the reopen on the server if it is attempted

<!-- trace:scenario id=g10adm.auction-post-sale.SC-lh7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-78 - A third reopen is allowed
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose address form has been reopened twice and whose
  address deadline has passed again
- **WHEN** an operator holding payment-processing reopens it a third time with
  a reason
- **THEN** Grade10 accepts the reopen
- **AND** the address deadline is 48 hours from that reopen

<!-- trace:scenario id=g10adm.auction-post-sale.SC-blu rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-79 - The reopen is on the invoice log
**Serves:** Audit trail - the reopen names who did it and why

- **GIVEN** an auction order an operator reopened with a reason
- **WHEN** an operator reads the invoice log
- **THEN** it holds a reopened entry with the named operator, its timestamp
  and that reason

<!-- trace:scenario id=g10adm.auction-post-sale.SC-pqn rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-80 - Reopening before the deadline is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Awaiting Setup whose address deadline is
  at 2026-09-18T14:00:00Z
- **WHEN** an operator attempts to reopen the address form at 2026-09-17T10:00:00Z
- **THEN** Grade10 refuses it
- **AND** the address deadline is still 2026-09-18T14:00:00Z

<!-- trace:scenario id=g10adm.auction-post-sale.SC-w78 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-81 - No reopen once the invoice is sent
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose invoice an operator has sent
- **WHEN** an operator attempts to reopen its address form
- **THEN** Grade10 refuses it
- **AND** the delivery address stays locked, changeable only by a re-quote

<!-- trace:scenario id=g10adm.auction-post-sale.SC-egm rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-82 - A confirmed address cannot reopen
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Preparing Invoice with a confirmed address,
  no sent invoice, and an address deadline that has passed
- **WHEN** an operator attempts to reopen its address form with a reason
- **THEN** Grade10 refuses it
- **AND** the order remains Preparing Invoice

<!-- trace:scenario id=g10adm.auction-post-sale.SC-jy7 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-83 - A cancelled order refuses a reopen
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order an operator cancelled before any invoice was sent,
  whose lot has returned to available stock
- **WHEN** an operator attempts to reopen its address form
- **THEN** Grade10 refuses it
- **AND** the order still derives as Cancelled
- **AND** the lot stays in available stock

<!-- trace:scenario id=g10adm.auction-post-sale.SC-2g4 rev=2 -->
#### Scenario: grade10-admin-auction-post-sale-SC-84 - An operator records setup without reopening
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  at 2026-09-14T09:00:00Z
- **WHEN** an operator holding payment-processing records the delivery address,
  billing address and payment method the winner gave them by telephone
- **THEN** Grade10 accepts it
- **AND** the order derives as Preparing Invoice
- **AND** the address deadline has still passed, so the winner cannot change it

<!-- trace:scenario id=g10adm.auction-post-sale.SC-t9v rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-90 - Address write, reopen, record and send serialize
**Serves:** Setup - reopen setup or record it

- **GIVEN** an expired order with no confirmed address
- **WHEN** a winner address write, an operator reopen, an operator record of
  setup and an operator invoice send are submitted concurrently
- **THEN** Grade10 serializes the operations under the order boundary
- **AND** the final address snapshot and persisted deadline match the last
  committed transition
- **AND** no partial address overwrite is possible
- **AND** a send that commits carries the setup the transition before it left,
  and one refused for lack of setup changes nothing

<!-- trace:scenario id=g10adm.auction-post-sale.SC-su0 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-91 - Address recording is logged
**Serves:** Setup - the reopen and phone-recorded setup name who did them and why

- **GIVEN** an operator records setup supplied by phone without reopening
- **WHEN** another operator reads the invoice log
- **THEN** it contains an address-recorded entry with the named operator,
  timestamp and reason

<!-- trace:scenario id=g10adm.auction-post-sale.SC-sxy rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-211 - A record without a reason is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  at 2026-09-14T09:00:00Z
- **WHEN** an operator holding payment-processing attempts to record setup
  without a reason
- **THEN** Grade10 refuses it
- **AND** the order is still in Setup Overdue, holding no recorded address

<!-- trace:scenario id=g10adm.auction-post-sale.SC-z4g rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-212 - Recording setup after the address is confirmed is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in Preparing Invoice with a confirmed address
  and no sent invoice
- **WHEN** an operator holding payment-processing attempts to record setup
  with a reason
- **THEN** Grade10 refuses it
- **AND** the confirmed address is unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-7jb rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-213 - Recording setup after the invoice is sent is refused
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order whose invoice an operator has sent
- **WHEN** an operator holding payment-processing attempts to record setup
  with a reason
- **THEN** Grade10 refuses it
- **AND** the delivery address stays locked, changeable only by a reissue

<!-- trace:scenario id=g10adm.auction-post-sale.SC-8fx rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-214 - A cancelled order refuses recorded setup
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order an operator cancelled before any invoice was sent
- **WHEN** an operator holding payment-processing attempts to record setup
  with a reason
- **THEN** Grade10 refuses it
- **AND** the order still derives as Cancelled

<!-- trace:scenario id=g10adm.auction-post-sale.SC-zuz rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-215 - Recording setup refuses a payment method the currency does not offer
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in USD Setup Overdue, where Payment Settings holds
  no USD card fee rule
- **WHEN** an operator holding payment-processing records a delivery
  address, a billing address and card as the method, with a reason
- **THEN** Grade10 refuses it
- **AND** the order holds no recorded address and no method, and is still in
  Setup Overdue

<!-- trace:scenario id=g10adm.auction-post-sale.SC-l05 rev=1 -->
#### Scenario: grade10-admin-auction-post-sale-SC-216 - A reopen is allowed in a currency that offers no method
**Serves:** Setup - reopen setup or record it

- **GIVEN** an auction order in USD Setup Overdue, where Payment Settings holds
  no USD card fee rule and Grade10 holds no USD bank details
- **WHEN** an operator holding payment-processing reopens the address form with a
  reason
- **THEN** Grade10 accepts the reopen and the order derives as Awaiting Setup
- **AND** the winner reads that payment is not yet available in USD, with
  Contact Us, and cannot confirm

## REMOVED Requirements

### Requirement: Listing outcomes

**Reason:** The listing-level queue is replaced by the Orders worklist, which
lists auction orders by their derived status. Its outcomes Awaiting wire, Paid
via Stripe and Paid via Manual describe a card-capture flow that no longer
runs.

**Migration:** Orders are listed per "The queue shows one outcome per lot". A
listing's own status is read in the Listings table, per
`grade10-admin/auction/listing`.

### Requirement: Operators work each listing from the queue through delivered

**Reason:** An operator works an auction order from its own page, not a
listing.

**Migration:** The order page, reading it without a payment or shipment
grant, and the rule that no control changes who won are in "The order detail
explains its status". Dispatch and delivery are in "Dispatch and delivery are
recorded on the order".

### Requirement: Trail fields

**Reason:** The listing trail is replaced by the order's timeline.

**Migration:** Comments and the invoice and fulfilment logs read as one
timeline, per "The order detail explains its status".

### Requirement: Winner fields

**Reason:** The order's winner is shown per "Winner contact fields"; the
listing block duplicated it.

**Migration:** "Winner contact fields".

### Requirement: Payment states

**Reason:** Wire requests, card capture and the Paid via Stripe and Paid via
Manual outcomes belong to the listing-level flow that invoices replaced. Money
is collected against the invoice.

**Migration:** Invoice statuses are per `grade10-site/auction/order-status`;
Record payment and proof checks stay in this capability; who holds payment
processing is in "Payment and shipment are separate grants".

### Requirement: Shipment states

**Reason:** Shipment started and completed on a listing are replaced by
dispatch and delivery on the order.

**Migration:** "Dispatch and delivery are recorded on the order", and who holds
shipment processing in "Payment and shipment are separate grants".

### Requirement: Delivery address

**Reason:** Recording an address on a paid listing is replaced by the order's
own address rules.

**Migration:** The winner confirms the address per
`grade10-site/auction/winner-order`; an operator changes it before send or
reissues after; recording an address never dispatches, per "Payment and
shipment are separate grants".

### Requirement: A queue row shows when its lot is in extended bidding

**Reason:** The worklist lists won lots only, so a lot still taking bids is
never on it.

**Migration:** The Listings table reads Extended, per "The Listings table shows
extended bidding and a won lot's order".
