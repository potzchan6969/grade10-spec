---
title: Auto-Bidding
spec: grade10-auction/auto-bidding
order: 6
---

The extension rule means the one thing a collector cannot do is plan to be
there at the end. Auto-bidding is the answer: they name the most they will
pay, and Grade10 bids for them only as far as needed to lead.

The maximum is private. The public price is what it takes to beat the field —
the second-highest maximum plus the listing increment — never the leader's
cap, so the price stays honest and a maximum is never burned by being seen. A
bidder sees their own maximum, distinct from the current bid, and whether they
lead; they can raise it at any time or leave it standing.

One card authorization covers the whole commitment. The hold is taken for the
maximum when it is set, so a bid Grade10 places on the collector's behalf
never needs a fresh card check mid-auction.

## Journeys

::journeys{id="grade10-auction/auto-bidding"}

:::detail{title="Product decisions" for="pm"}
The extension rule exists because bidders arrive at the last minute, so every
collector who cannot be there for a moving close is a bid the lot never
receives. eBay and Goldin resolve the same way: a hidden maximum, a public
price of second-highest plus increment.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Bidder | Wants the lot, cannot sit on the page | Sets a maximum once and still competes. |
| Bidder | Has been overtaken | Raises the maximum, never lowers it. |
| Bidder | Reading the lot | Sees their own cap and whether they lead, without seeing anyone else's. |
| Auction operator | A dispute about who led | Reads each commitment's cap and when it was accepted. |

**Not in scope.** A price-banded increment table — increments stay
per-listing. Reserve prices; they remain removed. Lowering or withdrawing a
maximum. Telling a bidder they are about to be outbid, or nudging them to
raise. Invoicing, capture, or fulfilment — the hold model from the auction
stands.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Auto-bid share | Share of accepted bids placed by the platform on a bidder's behalf. | Product |
| Absent winners | Share of lots whose winner was not on the page when the lot closed. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Resolve | Decided | Second-highest maximum plus the listing increment, capped at the leader's maximum. Equal maxima: earlier commitment leads. | Product |
| Hold | Decided | The card hold is the maximum, not the current bid. One active hold per bidder per listing. | Product |
| Raise only | Decided | A maximum can go up, never down. Lowering would withdraw a commitment others have already bid against. | Product |
| Hidden cap | Decided | A leading maximum is not public. Other bidders learn it only by beating it. | Product |
| Increment | Decided | The listing's own configured increment. No price-banded schedule. | Product |
| Bid action carries a maximum | Decided | A consumer sending a bare bid amount is broken by this contract. Money stays integer minor units plus ISO 4217. | Product |
| Admin history filter | ❓ Open | Whether history can hide platform-placed bids. An operator can already see both. | Product |
| Preset amounts | ❓ Open | Whether the bid surface offers presets alongside free entry. Presentation only. | Design |

**Risks.** Holding the maximum may discourage high maximums, so the bid
surface says what is held. A failed raise leaves the previous commitment
standing. Listings open before auto-bidding treat each accepted amount as a
maximum equal to that amount; those holds are not re-authorized.
:::
