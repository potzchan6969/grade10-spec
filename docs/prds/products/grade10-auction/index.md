---
title: Auction
---

Grade10 Auction sells graded cards one lot at a time. A collector browses the
catalogue, opens a lot at its own address, reads its gallery and its standing,
and bids. The highest valid bid when the lot closes wins.

Two people use it. An **operator** drafts a listing, fills in its catalogue
copy, attaches a gallery, sets a starting price and a window, publishes it now
or at a set time, and calls it off if something is wrong. A **collector**
browses, bids, and after the close either pays for the card or gets their money
back.

## Bids are holds, not payments

A bid is backed by an authorization on the bidder's card. The money is held,
not taken. Only the winner's hold is ever captured; every other hold is
released. Because a card hold expires after roughly a week, the auction keeps
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
amount clears the standing top plus the minimum increment.

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

## The winner is captured

The winner's hold is captured — this is the moment money actually moves. A
declined capture returns the hold and retries; after five attempts it parks for
an operator to retry by hand.

## The card ships

An operator works the sale forward only, from created to paid to shipped to
received, and can cancel it.
:::

:::callout{kind="note"}
No Figma frame exists for any auction surface — not the listing details page, not the bid
panel, not the admin queue. Every in-flight auction change says so in its own
`ui.md` and names the screens still to be produced. The frames are being made;
until they land, the shipped Storybook stories are the reference.
:::

:::callout{kind="warning"}
Two admin panels ship in the codebase but are reachable from nowhere:
`SettlementsPanel.tsx` and `FulfillmentPanel.tsx`. The auction admin page
renders only Queue, Listings, Sales and Bidders. The money ledgers, capture and
release retries, and the manual fulfilment ladder those two files describe are
therefore not operator-reachable today — the queue replaced them.
:::

:::detail{title="Where the lifecycle is written down" for="engineer"}
The three capabilities here cover the operator's listing, its media, and the
public lot page. What a bid must clear, how a hold moves, and when a close
extends are not yet a durable spec — they live in the in-flight change
`add-grade10-auction` and, in more detail, in
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
