---
title: Auction
icon: gavel
---

Grade10 Auction sells graded cards one lot at a time. A collector signs in,
finds a lot, bids by naming the most they will pay, and after the close pays
the invoice and receives the card. The four chapters follow that order: each
states what runs, marks what is confirmed and being built and what is still
open, and names the capability that holds the rules.

## Where It Is Open

🚧 **Not open to the public yet** — the auction's pages are carried in
development and staging, on no lane the public reaches. It is the first of the
four products to open — [Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Chapters

| Chapter | What it holds |
| --- | --- |
| [Account](/p/grade10-site/auction/account) | Registration and login, the verified identity a high bid needs, and the delivery addresses a winner confirms |
| [Auction Display](/p/grade10-site/auction/display) | The catalogue and what a listing carries, the lot page with its gallery and status, and the admin panel that makes the lot |
| [Bidding](/p/grade10-site/auction/bidding) | The auction logic — extended bidding, auto-bidding, increments — the bid panel from sign-in to a standing bid, and My Auctions, the watchlist and the letters |
| [Post-Bidding](/p/grade10-site/auction/post-bidding) | The result and its letters, then the winner's order from address to delivery: lifecycle, invoicing, paying by card or bank transfer, receipts, logistics and the edge cases |

The operator's half is [Auction Management](/p/grade10-admin/auction/management).
The blocks both brands render are [Listing Page
Blocks](/p/shared/ui/auction-listing), [Auction Record
Blocks](/p/shared/ui/auction-record) and [Auction Order
Blocks](/p/shared/ui/auction-order).

## One Sale

:::flow{title="From bid to delivery"}
## *Collector* — **Bids**
Names a private maximum on a live lot, and Grade10 bids for them only as far
as needed to lead — [Bidding · Auction Logic](/p/grade10-site/auction/bidding#auction-logic).
## *Auction* — **Closes**
At the scheduled close a lot with a bid enters extended bidding, and it closes
when its timer runs out with no new bid.
## *Winner* — **Sets up the order**
Confirms a delivery address and chooses card or bank transfer within 48 hours
— [Post-Bidding · Winner Order](/p/grade10-site/auction/post-bidding#winner-order).
## *Operator* — **Sends the invoice**
Prices shipping and insurance for that address and sends the invoice; the
7-day payment window starts — [Auction Management · Payment](/p/grade10-admin/auction/management#payment).
## *Winner* — **Pays**
By card, which Grade10 confirms on its own, or by bank transfer quoting the
reference and uploading proof an operator checks.
## *Operator* — **Ships**
Records dispatch with the carrier and tracking number, then delivery; the
winner reads both on the order.
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
The checkable rules are the capability specs each chapter names, and each
chapter keeps the decisions it turns on; the rows here are the ones the whole
auction turns on.

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
| Chapters, not capability pages | Decided | The manual cuts the auction into four chapters a reader meets in order; each capability is a section of one chapter, names its spec there, and is what a proposal links. | Product |
| Design frames | ❓ Open | No Figma frame exists for any auction surface; the shipped Storybook stories are the reference until Design names the screens drawn first. | Design |
:::
