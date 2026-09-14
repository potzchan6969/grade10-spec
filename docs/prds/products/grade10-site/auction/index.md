---
title: Auction
icon: gavel
---

Grade10 Auction sells graded cards one lot at a time. A collector browses the
catalogue, opens a lot at its own address, reads its gallery and its standing,
and bids. The highest valid bid when the lot closes wins.

Two people use it. An **operator** drafts a listing, fills in its catalogue
copy, attaches a gallery, sets a starting price and a window, publishes it now
or at a set time, and calls it off if something is wrong. A **collector**
browses, bids, and after the close follows one [Winner Order](/p/grade10-site/auction/winner-order) for each lot they win.

## Catalogue Order

🚧 **What the catalogue leads with** — [Active](/p/grade10-site/auction/lot-status) lots come first,
soonest to close first; then Upcoming lots, soonest to start first; then Ended
lots, most recently ended first. Two lots that would sit together keep one
fixed order, so reading on never shows a lot twice or skips one.

## Holds

A bid is backed by an authorization on the bidder's card. The money is held,
not taken. Every hold is released when the lot closes; the winner pays the
invoice through a fresh charge and every other hold is released. Because a card hold expires after roughly a week, the auction keeps
**at most one live hold per lot at any moment** — the current top bid's. When
someone is outbid, their hold is released the same minute the new one confirms.

A bid only counts once its hold confirms, so an accepted amount always beats
every amount already standing, and no two bids ever tie. A lot with a reserve
that nobody clears closes unsold and nobody is charged at all.

The clock moves. A bid landing close to the end pushes the close out again, and
every late bid pushes it again, so a lot scheduled to end at six can still be
running at eight. That tail is capped: past the cap the extension truncates
rather than refuses the bid.

:::flow{title="From bid to delivery"}
## A collector bids

They register a payment method against the lot, then name an amount. In one
step the auction checks the lot is open, the bidder is allowed to bid, and the
amount clears the standing top plus the next minimum from the [bid increment
schedule](/p/grade10-site/auction/bid-increments).

## Grade10 holds the money

The card is authorized for the bid amount — held, not charged. If the bid
landed inside the snipe window, the closing time moves out.

## The hold confirms, or it does not

When the bank confirms, the previous top bid's hold is released and this bid
becomes the one to beat. If the lot closed or was outbid while the bank was
thinking, the hold is released instead and the bid is lost.

## The lot closes

Every bid still waiting is released. A top bid that clears the reserve wins;
one that does not leaves the lot unsold, and nobody is charged.

## The winner pays the invoice

The winner's hold is released and the invoice becomes payable. A fresh charge
settles the final amount after the delivery address is confirmed; a declined
payment leaves the invoice open for another attempt until its deadline.

## The card ships

An operator works the order forward from paid to shipped to delivered, with
the [Post-Sale Queue](/p/grade10-admin/auction/post-sale) carrying the
operator-only controls and history.
:::

:::callout{kind="note"}
No Figma frame exists for any auction surface — not the listing details page, not the bid
panel, not the admin queue. Every in-flight auction change says so in its own
`ui-design.md` and names the screens still to be produced. The frames are being made;
until they land, the shipped Storybook stories are the reference.
:::

:::callout{kind="warning"}
Two admin panels ship in the codebase but are reachable from nowhere:
`SettlementsPanel.tsx` and `FulfillmentPanel.tsx`. The auction admin page
renders only Queue, Listings, Sales and Bidders. The money ledgers, capture and
release retries, and the manual fulfilment ladder those two files describe are
therefore not operator-reachable today — the queue replaced them.
:::

:::detail{title="Design record" for="engineer"}
The three capabilities here cover the operator's listing, its media, and the
public lot page. What a bid must clear, how a hold moves, and when a close extends live in
`grade10-site/auction/auction` and, in more detail, in
[docs/architecture/auction.md](https://github.com/9gag/grade10/blob/main/docs/architecture/auction.md),
which carries the full state tables, the money invariants and the sweeps.
[docs/architecture/auction-gaps.md](https://github.com/9gag/grade10/blob/main/docs/architecture/auction-gaps.md)
lists what is not built, verified against the code.

The auction backend is the one service deliberately shared between brands: a
card is auctioned once, and grade10 and ZZZ collectors bid against each other
on the same lot. Identities, sessions and money never cross; only the lot, the
amounts and per-auction pseudonyms do, so a display says Bidder 4 and never a
name. See
[docs/architecture/multi-product.md](https://github.com/9gag/grade10/blob/main/docs/architecture/multi-product.md).
:::

:::detail{title="Product decisions" for="pm"}
Grade10 owns the catalogue and the bid outcome; Stripe supplies card
authorization. What the auction is for, who it serves, what it leaves out and
what it is measured on are recorded here; the checkable rules are the
capability specs. Auto-bidding, watching and mail are decided on their own
pages: [Auto-Bidding](/p/grade10-site/auction/auto-bidding),
[Watchlist](/p/grade10-site/auction/watchlist),
[Notifications](/p/grade10-site/auction/notifications), and the collector's own
record in [My Auctions](/p/grade10-site/auction/account-record).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Considering or following a card auction | See reliable listing facts, bid safely, and know whether they won. |
| Finance operator | A listing has a winner whose card capture stalled, who will pay by wire, or who paid outside Stripe | Contact the winner when a wire is coming, record the listing paid without being able to mark it shipped, and without rewriting who won. |
| Shipment operator | A listing is paid and the card will leave in-house | Reach the winner, record shipment started then completed, without being able to record payment. |

**Not in scope.** Auction Buy Now, carts, stock counts, fixed-price checkout,
search, saved searches, filters, related lots and recent-sales data. Vault
storage, global shipping rate shopping, carrier accounts, tracking numbers and
a customer shipment-notification programme. Customer-facing checkout,
invoices, refunds, disputes, or a second payment provider. Collecting a phone
number Grade10 does not already hold. Store favourites — the term is retired;
watching an auction lot is its own capability.

**Measurement.** On [Analytics](/p/grade10-site/analytics#auction).

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Auction unit | Decided | A **listing** is one unit of auction lot and is the sole term used by this capability, including the operator queue. | Product |
| Buy Now | Decided | Excluded, including browse-only Buy Now listings. | Product |
| Hold model | Decided | One Stripe authorization hold exists per bidder per active listing; an outbid hold enters asynchronous release immediately and is later reconciled to completion. | Product |
| Extended close | Decided | Each listing has an extension window and extension duration (default 30 minutes each). A valid bid inside the window moves the close to the extension duration after that bid; this repeats until the extension duration passes without a valid bid, subject to an optional listing extension cap. | Product |
| Buyer-premium rate | ❓ Deferred | The applicable policy-derived buyer fee is displayed; a fixed rate is not defined. | Product and finance |
| Operator outcome labels | Decided | Queue labels are Draft, Scheduled, Live, Ending soon, Unsold, Canceled, Awaiting payment, Payment failed, Awaiting wire, Paid via Stripe, Paid via Manual, Shipped, Delivered. There is no single "Paid" label. "Ending soon" is the last 60 minutes of the recorded close. Payment failed, Awaiting wire, both paid outcomes, and Shipped are highlighted as waiting on an operator. | Product |
| Payment source | Decided | Card capture becomes Paid via Stripe. Operator-recorded collection (including a completed wire) becomes Paid via Manual. The first successful paid wins; neither path changes who won. Manual paid and Awaiting wire release an open authorization rather than capturing it. | Product and finance |
| Wire transfer | Decided | A winner paying by wire sits in Awaiting wire so the operator contacts them. An operator records that request; a winner-initiated request on the storefront is follow-on. Collection of the wire is Paid via Manual. | Product and finance |
| Shipment | Decided | In-house and offline: operators record started then completed. No carrier, no tracking. | Operations |
| Operator grants | Decided | Payment-processing and shipment-processing are different grants and different scoped roles (`finance` vs `staff`). `admin` holds both. Catalogue publishing is not shipment-processing. | Product |
| Watching, formerly favourites | Decided | Watching a listing from the collector's own account is in scope, and the term **favourites** is retired across copy, specs, and analytics. | Product |
| Winner phone | Decided | Not collected. Email is the primary contact; a delivery address is shown when held and can be recorded offline by shipment operators. | Product |

**Risks.** Stripe authorization windows, increment behaviour and capture
eligibility are proved in the chosen Stripe configuration before card-backed
bidding is enabled in production. Auction acceptance is a concurrency
boundary: durable, serialized bid evaluation and idempotent provider-event
handling come before the customer surface. Shipping is manual, so
customer-facing copy never claims carrier tracking or delivery confirmation
Grade10 does not hold. Manual paid or Awaiting wire while a card
authorization is still open is a double-charge risk if capture is not
suppressed; release-not-capture is the decision that closes it. Winner email
and delivery address on the operator detail are operational contact, not a
reason to put those values on the platform-wide audit hashes.
:::
