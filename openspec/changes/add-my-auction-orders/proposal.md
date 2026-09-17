**Author:** @jeffffej0909 - 2026-09-15

Product context: [My Auctions](../../../docs/prds/products/grade10-site/auction/account-record.md),
[My Auction Orders](../../../docs/prds/products/grade10-site/auction/auction-orders.md),
[Winner Order](../../../docs/prds/products/grade10-site/auction/winner-order.md).

## Why

A winner has no list of what they owe. My Auctions mixes won lots with watches
and live bids, and a won row shows an order status but no way into the order.
Nothing in the spec requires a link from a Won row to Winner Order, so a
winner can see "Awaiting Address" and still have no place to confirm one.

My Auctions is also one long table. Lots not yet open, lots closing tonight
and lots closed last month share it, sorted only by close.

**Metric:** winner self-service — won lots that reach paid with no inbound
contact from the winner (existing signal on My Auctions). **Second signal:**
time from lot close to address confirmed.

## What Changes

- **My Auctions gets three tabs.** Active (bidding open, the default),
  Upcoming (bidding not yet open) and Ended (closed). Row rules and ordering
  stay the same inside each tab. The title count stays the total.
- **Ended rows lock Email alerts.** The toggle is shown disabled.
- **New page: My Auction Orders.** One row per won order: key image, title,
  auction, winning bid, order status, **View lot**, and one action by status —
  Confirm address, Pay Invoice, or View detail. Orders needing the winner
  come first. Reached from the account menu and from a Won row on My Auctions.
- **Winner Order page sections.** Order Information (Order No., Auction,
  Currency, Date, Order Status, **Invoice Status** — formerly Paid Status),
  Collection Method, Order Status timeline with a timestamp per step, and
  Lots. Pending Payment adds the full invoice and Pay Now.
- **Address form.** Fields follow the existing account address form, without
  the billing checkbox. Required fields refuse an empty value with an error
  on the field. Phone format is not checked.
- **Invoice expiry and unfinished card payment.** The foundational
  `revise-auction-winner-invoicing` change records expiry as invoice status
  `expired`. The order still reads Pending Payment and Pay Now remains
  available. A timed-out or abandoned payment session says payment was not
  completed and keeps Pay Now available. A completed session reads Confirming
  payment until Grade10 records the invoice paid; then the order reads
  Processing.

## Non-Goals

- Changing how an order status is derived, or the invoice, deadline,
  suspension and receipt rules in `revise-auction-winner-invoicing`.
- Pickup or any collection method other than delivery.
- Filters, search, or per-tab counts on either page.
- Paying from the list; payment happens on the order.
- A tracking-link change. A fulfilled order already shows the carrier, the
  tracking number and a link to the carrier (`winner-order`, "Records the
  winner keeps").
- ZZZ.

## Capabilities

### New Capabilities

- `grade10-site/auction/auction-orders`: the My Auction Orders list, its
  per-status action, ordering, entry points and honest reads.
- `shared/ui/auction-order`: the export contract for the order list and the
  order detail blocks.

### Modified Capabilities

- `grade10-site/auction/account-record`: tabs by bidding window, Ended rows
  lock Email alerts, and the supported Won-row order entry point. Added
  requirements only.
- `grade10-site/auction/winner-order`: page sections, the address form,
  unfinished and confirming payment. Added requirements only.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | My Auctions tabs and locked Ended alerts; a new My Auction Orders route and account-menu entry; Winner Order sections, address form, payment-session handling. |
| Auction service | The order list read for one account; a timestamp for every order-status step. |
| `@grade10/ui` | New exports `AuctionOrderList`, `AuctionOrderRow`, `AuctionOrderEmpty`, `AuctionOrderDetail`, `AuctionAddressForm` and their props and copy types — none exist yet. Existing `AuctionRecord` remains the one-table body; the application composes the three tabs with design-system `Tabs`, `TabsList`, `TabsTrigger` and `TabsContent`. Existing `AuctionRecordRow` props cover disabled Email alerts and the Won-row order link. |
| `@grade10/i18n` | Tab labels, action labels, section labels, Invoice Status labels, form labels and errors, payment-session messages, in English, Traditional Chinese and Simplified Chinese. |
| `grade10-admin` | None proposed. Address changes after invoice send remain the foundational operator re-quote flow. |

## Ordering and dependencies

- **No rule another in-flight change rewrites is touched.** Every delta here
  is ADDED.
- **Composition with `redesign-my-auctions-table`:** its one-table
  `AuctionRecord` contract and its ordering remain the row source. This change
  adds the page-level Active, Upcoming and Ended presentation; it does not
  repurpose the deprecated `AuctionRecordTabs` export.
- **Explicit dependency on `revise-auction-winner-invoicing`:** that change is
  the foundational owner of auction-order lifecycle, invoice status,
  address-confirmation ownership, payment confirmation and the derived status
  vocabulary. This change consumes those contracts and adds list, navigation
  and presentation behavior; it does not rewrite their writes or add a second
  status model. The application applies this change after the revise contract
  is durable in the spec submodule.

No domain impact: `grade10-site/auction/domain-tcs.md` traces no `account-record` or `winner-order` journey this change adds, and `auction-orders` joins no path it composes yet.

## Open Questions

- ❓ **Postal Code in Hong Kong.** The form requires Postal Code, but Hong Kong
  addresses have none. Product to confirm.

## Assumptions

- **Active is the default tab.**
- **An empty tab** says it has no lots and offers the catalogue; it is not a
  failure.
- **The order-status timeline** lists each status the order has reached, in
  order, with the time it was reached.
- **Collection Method** reads Delivery, with the confirmed name, phone,
  account email and address.

## References

- [My Auctions · The table](../../../docs/prds/products/grade10-site/auction/account-record.md#the-table)
- [My Auction Orders · The List](../../../docs/prds/products/grade10-site/auction/auction-orders.md#the-list)
- [Winner Order](../../../docs/prds/products/grade10-site/auction/winner-order.md)

## Follow-on changes

- A preview-app page for My Auction Orders and Winner Order.
