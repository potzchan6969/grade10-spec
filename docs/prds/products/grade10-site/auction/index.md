---
title: Auction
icon: gavel
---

Grade10 Auction sells graded cards one lot at a time. A collector signs in,
finds a lot, bids by naming the most they will pay, and after the close pays
the invoice and receives the card. This page is the map, in the order a
collector meets each part; each line names the page or the section that holds
the rules, the values and the open questions.

## Account

- **Registration and login** — an emailed sign-in link, or Google where a
  brand enables it; no password — [Sign-In](/p/shared/auth/sign-in)
- **Identity** — a bid of HKD 120,000 or more asks for a verified identity,
  checked once from the account — [KYC](/p/grade10-site/account/kyc)
- **Delivery address management** — the addresses a collector keeps and
  confirms onto an order — [Delivery
  Addresses](/p/grade10-site/account/addresses)

## Auction Display

- **Auction listing** — the catalogue, what a card shows, and the order lots
  read in — [Auction Listing](/p/grade10-site/auction/auction-listing)
  - **Listing schema** — which facts a listing carries, from the operator's
    catalogue fields to the card — [Auction Listing · The
    Card](/p/grade10-site/auction/auction-listing#the-card) and [Listing
    Management](/p/grade10-admin/auction/listing)
- **Auction details** — a lot's own page and address, and what it answers
  before scripts run — [Auction Details](/p/grade10-site/auction/listing-page)
  - **Media gallery** — one to eight images and videos, their sizes and alt
    text — [Media Gallery](/p/grade10-site/auction/listing-media)
  - **Lot status** — Upcoming, Active and Ended, and the lots collectors
    never see — [Lot Status](/p/grade10-site/auction/lot-status)
  - **Blocks** — the gallery, bid panel and details blocks both brands
    render — [Listing Page Blocks](/p/shared/ui/auction-listing)
- **Admin panel** — drafting, pricing, scheduling, publishing and calling off
  a lot, and the cover a set sells under — [Listing
  Management](/p/grade10-admin/auction/listing) and
  [Campaigns](/p/grade10-admin/auction/campaign)

## Bidding

- **Auction logic**
  - **Extended bidding** — what a valid bid is, the close, and the timer
    every new bid restarts — [Bidding Rules](/p/grade10-site/auction/auction)
  - **Auto-bidding** — the private maximum and how Grade10 bids for a
    collector — [Auto-Bidding](/p/grade10-site/auction/auto-bidding)
  - **Bid increments** — the price schedule per currency and the bid
    ceiling — [Bid Increments](/p/grade10-site/auction/bid-increments)
- **Auction panel**
  - **Display** — what the panel shows and refuses: the linked card, the
    optional hold, the fee line and the quick bids — [Bid Card and
    Holds](/p/grade10-site/auction/bid-payment-method) and [Auto-Bidding ·
    Bid Panel](/p/grade10-site/auction/auto-bidding#bid-panel)
  - **Enrolment flow** — sign-in and a linked card before the first bid —
    [Bid Panel Enrollment](/p/grade10-site/auction/bid-panel-enrollment)
  - **Bidding history** — the account's record of every maximum, and the
    lot's Your bidding dialog — [Bidding
    History](/p/grade10-site/auction/bidding-history)
- **My Auctions, Watchlist and notifications**
  - **My Auctions** — every watched or bid lot on one table, with the
    collector's standing — [My Auctions](/p/grade10-site/auction/account-record)
  - **Watchlist** — watching a lot without bidding, and who sees a watch —
    [Watchlist](/p/grade10-site/auction/watchlist)
  - **Notifications** — mail before and during bidding — [Bidding
    Notifications](/p/grade10-site/auction/notifications)

## Post-Bidding

- **Result and notification** — a closed lot reads Ended, the winner gets the
  auction-won letter, and watchers and non-winners hear once that it closed —
  [Lot Status](/p/grade10-site/auction/lot-status), [Order
  Notifications](/p/grade10-site/auction/notifications-order) and [Bidding
  Notifications · Close
  Outcome](/p/grade10-site/auction/notifications#close-outcome)
- **My Auctions › Winner Order** — every won lot with what the order needs
  next, and the page where one lot is settled — [My Auction
  Orders](/p/grade10-site/auction/auction-orders) and [Winner
  Order](/p/grade10-site/auction/winner-order)
  - **Lifecycle** — the one status the winner, the operator and the account
    record all read — [Auction Order
    Status](/p/grade10-site/auction/order-status)
  - **Notification** — the winning letter, the setup and payment reminders,
    the overdue letters and the receipt — [Order
    Notifications](/p/grade10-site/auction/notifications-order)
  - **Invoicing confirmation** — a delivery address and a payment method
    within 48 hours, before an invoice is quoted — [Winner Order · Order
    Setup](/p/grade10-site/auction/winner-order#order-setup)
  - **Invoicing** — the operator's quote, the invoice lines and IDs, and the
    7-day payment window — [Winner Order ·
    Invoicing](/p/grade10-site/auction/winner-order#invoicing) and [Post-Sale
    Queue · Payment](/p/grade10-admin/auction/post-sale#payment)
  - **Payment flow, wire** — bank transfer details and reference, proof
    upload, and the operator's confirmation — [Winner Order · Paying by Bank
    Transfer](/p/grade10-site/auction/winner-order#paying-by-bank-transfer)
  - **Payment flow, online** — a card payment Grade10 confirms on its own —
    [Winner Order · Paying by
    Card](/p/grade10-site/auction/winner-order#paying-by-card)
  - **Receipts** — the receipt, its ID and PDF, and how long records are
    kept — [Winner Order ·
    Receipts](/p/grade10-site/auction/winner-order#receipts)
  - **Logistics** — dispatch, tracking and delivery proof — [Winner Order ·
    Logistics](/p/grade10-site/auction/winner-order#logistics) and [Post-Sale
    Queue · Fulfilment](/p/grade10-admin/auction/post-sale#fulfilment)
  - **Edge cases** — a wrong amount by wire, and a missed deadline — [Winner
    Order · Edge Cases](/p/grade10-site/auction/winner-order#edge-cases) and
    [Bidder Suspension](/p/grade10-site/auction/bidder-suspension)
- **Operations** — the queue every order is worked from, and the premium
  minimum per currency — [Post-Sale Queue](/p/grade10-admin/auction/post-sale)
  and [Payment Settings](/p/grade10-admin/auction/payment-settings)

:::flow{title="From bid to delivery"}
## *Collector* — **Bids**
Names a private maximum on a live lot, and Grade10 bids for them only as far
as needed to lead — [Auto-Bidding](/p/grade10-site/auction/auto-bidding).
## *Auction* — **Closes**
At the scheduled close a lot with a bid enters extended bidding, and it closes
when its timer runs out with no new bid — [Bidding Rules](/p/grade10-site/auction/auction).
## *Winner* — **Sets up the order**
Confirms a delivery address and chooses card or bank transfer within 48 hours
— [Winner Order](/p/grade10-site/auction/winner-order).
## *Operator* — **Sends the invoice**
Prices shipping and insurance for that address and sends the invoice; the
7-day payment window starts — [Post-Sale Queue](/p/grade10-admin/auction/post-sale).
## *Winner* — **Pays**
By card, which Grade10 confirms on its own, or by bank transfer quoting the
reference and uploading proof an operator checks — [Winner Order](/p/grade10-site/auction/winner-order).
## *Operator* — **Ships**
Records dispatch with the carrier and tracking number, then delivery —
[Post-Sale Queue](/p/grade10-admin/auction/post-sale).
:::

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service): one backend for both brands, the money invariants and the sweeps
- **Architecture** — [docs/architecture/auction.md](https://github.com/9gag/grade10/blob/main/docs/architecture/auction.md), with what is not built in [auction-gaps.md](https://github.com/9gag/grade10/blob/main/docs/architecture/auction-gaps.md)
- **Brand boundary** — [docs/architecture/multi-product.md](https://github.com/9gag/grade10/blob/main/docs/architecture/multi-product.md)
- **Blocks** — [Listing Page Blocks](/p/shared/ui/auction-listing), [Auction Record Blocks](/p/shared/ui/auction-record) and [Auction Order Blocks](/p/shared/ui/auction-order), in `packages/ui`
- **Mail** — `apps/emails/emails/auction/`
:::

:::detail{title="Product decisions" for="pm"}
Grade10 owns the catalogue and the bid outcome; Stripe supplies card payment.
The checkable rules are the capability specs each page names, and each page
keeps the decisions it turns on; the rows here are the ones the whole auction
turns on.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Considering or following a card auction | See reliable listing facts, bid safely, and know whether they won. |
| Winner | A lot has closed | Confirm where to ship, read the invoice, pay in time and follow the card to the door. |
| Finance operator | A winner pays by bank transfer, or outside the site | Check the proof or record the payment, without rewriting who won. |
| Shipment operator | An order is paid | Record dispatch and delivery, without being able to record payment. |

**Not in scope.** Auction Buy Now, carts, stock counts, fixed-price checkout,
search, saved searches, filters, related lots and recent-sales data. Vault
storage. Combined invoices, payment plans, buyer-initiated returns and a
second payment provider. Store favourites — the term is retired; watching a
lot is its own capability.

**Measurement.** On [Analytics](/p/grade10-site/analytics#auction).

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Auction unit | Decided | A **listing** is one lot and the sole term in every spec and the operator queue; collectors read **lot**. | Product |
| Buy Now | Decided | Excluded, including browse-only Buy Now listings. | Product |
| One auction, two brands | Decided | A card is auctioned once, and Grade10 and ZZZ collectors bid on the same lot. Identities, sessions and money never cross; a display says Bidder 4, never a name. | Product |
| Currencies | Decided | USD, HKD and JPY, one per lot, each with a Grade10-owned increment schedule. | Product |
| Operator grants | Decided | Payment processing and shipment processing are different grants and different roles (`finance` vs `staff`); `admin` holds both. Publishing a lot is neither. | Product |
| Design frames | ❓ Open | No Figma frame exists for any auction surface; the shipped Storybook stories are the reference until Design names the screens drawn first. | Design |
:::
