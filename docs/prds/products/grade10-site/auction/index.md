---
title: Auction
icon: gavel
---

Grade10 Auction sells graded cards one lot at a time. A collector signs in,
finds a lot in the catalogue, bids by naming the most they will pay, and after
the close pays the invoice and receives the card. This page is the map, in the
order a collector meets each part; the values, the rules and the open
questions sit on the page that owns them.

## Account

A collector needs an account to watch or bid, and a verified identity above
the bar. [Accounts](/p/shared/auth) and [Account](/p/grade10-site/account) own
these; the auction adds no sign-in of its own.

| Page | What it holds |
| --- | --- |
| [Sign-In](/p/shared/auth/sign-in) | An emailed sign-in link, or Google where a brand enables it; no password |
| [KYC](/p/grade10-site/account/kyc) | The one-time identity check a bid of HKD 120,000 or more asks for |
| [Addresses](/p/grade10-site/account/addresses) | The delivery addresses a collector keeps and confirms onto an order |

## Catalogue and Lot

The catalogue lists every published lot, and a lot opens at its own address
with its gallery, its standing and the bid panel. Operators draft, publish and
call off lots from the admin site.

| Page | What it holds |
| --- | --- |
| [Auction Listing](/p/grade10-site/auction/auction-listing) | The catalogue: what a card shows, and the order lots read in |
| [Listing Details Page](/p/grade10-site/auction/listing-page) | A lot's own address, what it answers before scripts run, and sharing it |
| [Media Gallery](/p/grade10-site/auction/listing-media) | One to eight images and videos, the sizes they answer at, and alt text |
| [Lot Status](/p/grade10-site/auction/lot-status) | Upcoming, Active and Ended, and the lots collectors never see |
| [Listing Page Blocks](/p/shared/ui/auction-listing) | The gallery, bid panel and details blocks both brands render |
| [Listing Management](/p/grade10-admin/auction/listing) | Drafting, pricing, scheduling, publishing and calling off a lot |
| [Campaigns](/p/grade10-admin/auction/campaign) | The cover a set of lots sells under |

## Bidding

Every lot is absolute: the highest valid bid at the close wins, and a bid at
the scheduled close starts extended bidding. A collector bids by naming a
private maximum on a bid panel that first settles sign-in and a linked card.

| Page | What it holds |
| --- | --- |
| [Bidding](/p/grade10-site/auction/auction) | What a valid bid is, the close, and extended bidding |
| [Bid Increments](/p/grade10-site/auction/bid-increments) | The price schedule per currency and the bid ceiling |
| [Auto-Bidding](/p/grade10-site/auction/auto-bidding) | The private maximum, how Grade10 bids for a collector, and the panel's quick bids |
| [Bid panel enrollment](/p/grade10-site/auction/bid-panel-enrollment) | Sign-in and a linked card before the first bid |
| [Payment Method](/p/grade10-site/auction/bid-payment-method) | The card behind a bid, and the optional bid-time hold |
| [Bidding History](/p/grade10-site/auction/bidding-history) | The account's record of every maximum, and the lot's Your bidding dialog |
| [Watchlist](/p/grade10-site/auction/watchlist) | Watching a lot without bidding, and who sees a watch |
| [Notifications](/p/grade10-site/auction/notifications) | Mail before and during bidding, and the letters at the close |
| [My Auctions](/p/grade10-site/auction/account-record) | Every watched or bid lot on one table, with the collector's standing |

## After the Close

A winner has 48 hours to confirm a delivery address and a payment method, an
operator quotes the invoice, and the winner pays within 7 days by card or by
bank transfer; then the card ships. Operators work every order from one queue.

| Page | What it holds |
| --- | --- |
| [My Auction Orders](/p/grade10-site/auction/auction-orders) | Every won lot, with what the order needs next |
| [Winner Order](/p/grade10-site/auction/winner-order) | One lot's address, invoice, card or bank transfer payment, proof, receipt and shipment |
| [Auction Order Status](/p/grade10-site/auction/order-status) | The one status the winner, the operator and the account record all read |
| [Order Notifications](/p/grade10-site/auction/notifications-order) | The winning letter, the setup and payment reminders, the overdue letters and the receipt |
| [Bidder Suspension](/p/grade10-site/auction/bidder-suspension) | What an unpaid invoice or an operator stops, and what it leaves alone |
| [Post-Sale Queue](/p/grade10-admin/auction/post-sale) | Working an order from close to delivery: the quote, proof checks, manual settlement, dispatch |
| [Payment settings](/p/grade10-admin/auction/payment-settings) | The buyer-premium minimum per currency |

:::flow{title="From bid to delivery"}
## *Collector* — **Bids**
Names a private maximum on a live lot, and Grade10 bids for them only as far
as needed to lead — [Auto-Bidding](/p/grade10-site/auction/auto-bidding).
## *Auction* — **Closes**
At the scheduled close a lot with a bid enters extended bidding, and it closes
when its timer runs out with no new bid — [Bidding](/p/grade10-site/auction/auction).
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
- **Blocks** — [Listing Page Blocks](/p/shared/ui/auction-listing) and [Auction Record Blocks](/p/shared/ui/auction-record), in `packages/ui`
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
| Absolute sale | Decided | No reserve and no buy-now price; the highest valid bid at the close wins. | Product |
| Buy Now | Decided | Excluded, including browse-only Buy Now listings. | Product |
| One auction, two brands | Decided | A card is auctioned once, and Grade10 and ZZZ collectors bid on the same lot. Identities, sessions and money never cross; a display says Bidder 4, never a name. | Product |
| Currencies | Decided | USD, HKD and JPY, one per lot, each with a Grade10-owned increment schedule. | Product |
| Bid-time holds | Decided | Off by default: a valid bid is accepted without a card hold. When enabled, one hold per bidder per lot covers the maximum. | Product and finance |
| Buyer's premium | Decided | 20% of the winning bid, or the currency's minimum charge when higher; the rate is disclosed on the bid panel and the amount first appears on the invoice. | Product and finance |
| Operator grants | Decided | Payment processing and shipment processing are different grants and different roles (`finance` vs `staff`); `admin` holds both. Publishing a lot is neither. | Product |
| Design frames | ❓ Open | No Figma frame exists for any auction surface; the shipped Storybook stories are the reference until Design names the screens drawn first. | Design |
:::
