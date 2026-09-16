## Context

The `revise-auction-winner-invoicing` change owns auction-order lifecycle,
invoice status, address confirmation and payment confirmation. Its contract
adds `not_issued` and `expired` invoice statuses; an expired invoice derives
the order as Pending Payment and remains payable. This change consumes that
contract for the collector's list and order route.

The current shared UI evidence has one `AuctionRecord` table body. The
exported `AuctionRecordTabs` is a deprecated two-tab compatibility component,
so it is not a suitable contract for Active, Upcoming and Ended. The page
assembly can already compose the design-system `Tabs` primitives, and
`AuctionRecordRow` already accepts disabled Email alerts and a supplied Won-row
order link.

## Goals / Non-Goals

**Goals:**

- Add an owner-scoped auction-order list read model and authenticated order
  detail route.
- Keep status, invoice and payment facts owned by the revise lifecycle model;
  expose them consistently in list rows, the order detail and the timeline.
- Add the shared, copy-driven auction-order blocks and the page-level My
  Auctions tab composition.
- Preserve the existing address-confirmation and hosted-card action
  boundaries while making their read-after-action states honest.

**Non-Goals:**

- A second auction status enum, invoice expiry derivation, invoice writer,
  payment confirmation writer, or address-lock rule.
- Replacing or broadening `AuctionRecordTabs`.
- A new database table for a UI timeline, a combined invoice, filters, search,
  or a winner-side non-card payment method.
- Resolving the product question about Hong Kong Postal Code.

## Decisions

The capability specs govern the user-visible rows, actions, sections, fields
and refusal outcomes. The implementation choices below keep those outcomes on
the correct side of the application/shared-component boundary.

- **Page composition:** Keep `AuctionRecord` as the table body. The My Auctions
  route partitions its session-owned rows into three arrays by bidding-window
  state and renders them through design-system `Tabs`, `TabsList`,
  `TabsTrigger` and `TabsContent`. `AuctionRecordTabs` remains untouched as a
  transitional two-tab export. This preserves the current Storybook contract;
  a new shared tabs block is rejected because it would duplicate a deprecated
  component and move page policy into `@grade10/ui`.
- **Row state:** The application supplies the current bidding-window state,
  derived winner status and `emailAlertsDisabled` to `AuctionRecordRow`.
  Ended is a presentation partition, not a new auction-order status. The
  application supplies `viewOrder` only for a Won row and keeps the row
  read-only.
- **Order list read:** The auction service resolves the winner from the
  authenticated session, joins each winning lot to its auction order and
  current invoice, and derives status through the revise
  `order-status` chain. It performs the two-band/newest-close ordering on the
  server so pagination or retries cannot produce a client-only ordering.
- **Expired invoices:** The read model returns invoice status `expired` and
  derived order status Pending Payment. The row action is Pay Invoice and the
  detail read includes the invoice and Pay Now. No client maps expiry to a
  terminal or non-payable order state.
- **Status timeline:** `reachedAt` values are projected from the authoritative
  lifecycle event timestamps already owned by the order, address, invoice,
  payment, fulfilment and delivery records. The read model returns ordered
  `{ status, reachedAt }` items. It does not persist a duplicate `status` or
  infer a timestamp from browser load time. If the revise implementation is
  missing a timestamp for an event, the timestamp is added to that existing
  event record in the revise-owned lifecycle work; this change does not create
  a parallel timeline table.
- **Payment confirmation:** Starting a hosted card session returns a provider
  session reference and URL. The browser may render Confirming payment after a
  successful provider return, but Processing is shown only after the
  authenticated order read model returns invoice status `paid` and
  fulfilment status `unfulfilled`. Timed-out, abandoned, cancelled and
  declined sessions do not mutate the invoice and can start a fresh session.
- **Shared UI ownership:** `AuctionOrderList`, `AuctionOrderRow`,
  `AuctionOrderEmpty`, `AuctionOrderDetail` and `AuctionAddressForm` receive
  all copy, status labels, values, links and callbacks through props. They do
  not fetch, choose actions from status, validate phone format, or write
  auction state. The route owns the callbacks and maps service refusals to
  field errors or payment messages.
- **Copy and formatting:** The application supplies English, Traditional
  Chinese and Simplified Chinese copy. Money remains integer minor units plus
  ISO 4217 currency, and timestamps are formatted for the winner's zone at
  the route/read-model boundary according to the existing date-time contract.

## Database Schema

No new persisted status, invoice, payment, address, or timeline table is
introduced by this change. The implementation reuses the revise-owned auction
order, invoice, address snapshot and lifecycle/payment records. The only
additional read-model fields are projections:

| Read-model field | Authoritative source | Stored here |
| --- | --- | --- |
| `orderStatus` | revise `order-status` derivation from invoice, fulfilment and conditions | No |
| `invoiceStatus` and invoice lines | current invoice record | No |
| `statusTimeline[].reachedAt` | timestamp on the event that entered each reached status | No |
| `collectionMethod` | confirmed delivery-address snapshot plus account email | No |

The list query indexes and orders by the existing lot-close and owner/order
relationships. If the existing lifecycle record for an event has no
timestamp, the foundational revise implementation owns that additive column
and migration; this change must consume it rather than introduce a second
status-history store.

## Service Interfaces

The application boundary uses fixed authenticated processors. Refusals are
returned as tagged results, not as empty successful reads.

| Processor | Input | Success | Refusal |
| --- | --- | --- | --- |
| `readMyAuctionOrders` | `{ accountId }` from the session only | `{ orders: AuctionOrderListItem[] }` | `{ code: "UNAUTHENTICATED" }` or `{ code: "READ_FAILED" }` |
| `readWinnerAuctionOrder` | `{ accountId, orderId }` | `{ order: AuctionOrderDetailRead }` | `{ code: "UNAUTHENTICATED" }`, `{ code: "NOT_FOUND" }`, `{ code: "FORBIDDEN" }` or `{ code: "READ_FAILED" }` |
| `confirmWinnerDeliveryAddress` | `{ accountId, orderId, address: AuctionAddressFormValues }` | `{ orderId, orderStatus: "preparing_invoice", addressSnapshot }` | `{ code: "VALIDATION_FAILED", fields: Record<string, string> }`, `{ code: "FORBIDDEN" }` or `{ code: "CONFLICT" }` |
| `startWinnerCardPayment` | `{ accountId, orderId }` | `{ sessionId, checkoutUrl, invoiceId, amount: { minorUnits, currency } }` | `{ code: "NOT_PAYABLE" }`, `{ code: "FORBIDDEN" }`, `{ code: "READ_FAILED" }` or `{ code: "PAYMENT_PROVIDER_FAILED" }` |

`readMyAuctionOrders` enriches each row with the lot key image/title,
auction name, winning bid, invoice status, derived order status, lot close
time, and the action destination. It must use the session account identity;
no route parameter or request body can select another collector.

`readWinnerAuctionOrder` returns the four-section read model, the current
derived status, invoice status and lines, confirmed address, ordered status
timeline, payment-session presentation state, lot data and records retained by
the winner. It reads the same order-status derivation as the list. A
successful payment-provider return is only a presentation hint until this
read model observes invoice `paid`.

Address confirmation reuses the revise-owned transaction and mutation order:
validate required fields, write the confirmed address snapshot, then return
the new read status. The UI's phone rule is deliberately not a server-side
format check. Payment session creation reads and locks the current payable
invoice amount for the provider request, then returns the hosted session; the
provider webhook remains the sole path that records payment, and the next
order read observes the resulting invoice status.

## API Contracts

The implementing application adds authenticated routes for the new reads and
actions. The exact framework route names may follow the application router,
but the wire shapes remain these:

- `GET /account/auction-orders` returns `{ orders }` for the session owner;
  it never accepts `accountId` as a selector.
- `GET /account/auction-orders/:orderId` returns `{ order }` with the detail
  read model, including `statusTimeline: [{ status, reachedAt }]` and the
  invoice/payment presentation fields.
- `POST /account/auction-orders/:orderId/address` accepts the address form
  values and returns the updated order read or the tagged field-error refusal.
- `POST /account/auction-orders/:orderId/payment-session` returns the hosted
  session for the current invoice or a tagged non-payable/provider refusal.

The account menu and Won-row links are navigation into these authenticated
routes; they do not carry payment or address mutations in query parameters.

## Risks / Trade-offs

- **[Risk]** The list and detail could disagree if they carry separate status
  logic. → **Mitigation:** both call the revise-owned derivation and contract
  tests use the same invoice/fulfilment fixtures.
- **[Risk]** A successful provider return could be shown as paid before the
  webhook is durable. → **Mitigation:** keep a separate Confirming state and
  gate Processing and receipt status on the authoritative invoice read.
- **[Risk]** Timeline timestamps could become synthetic UI metadata. →
  **Mitigation:** require `reachedAt` in the read model and map each item to
  an existing lifecycle event timestamp.
- **[Risk]** Filtering rows in the browser could leak or reorder another
  collector's data. → **Mitigation:** resolve ownership and ordering in the
  authenticated service before rendering.
- **[Risk]** Reusing the old `AuctionRecordTabs` could expose its two-tab
  semantics under three new labels. → **Mitigation:** compose the existing
  `AuctionRecord` with design-system tabs and leave the deprecated export
  unchanged.

## Migration Plan

- Land the reconciled spec, PRD, UI design and delivery plan in
  `grade10-spec`, with `revise-auction-winner-invoicing` identified as the
  foundational dependency.
- Land the shared auction-order exports and their stories before the
  application frontend consumes them.
- Deploy the read models and authenticated routes behind the application
  route rollout, then enable the account-menu, Won-row and tab links.
- Roll back by disabling the new routes and navigation entry points. No data
  rollback is required because this change adds no persisted schema or
  lifecycle writer; payment and address records remain owned by the revise
  flow.
