# Grade10 Auction auto bidding

## Summary

A collector who wants a lot cannot be asked to sit on the page until it
closes. They name the most they will pay; Grade10 bids for them only as far
as needed to lead, at the second-highest maximum plus the listing increment.

## Context

- Problem: bidding is manual and the extension rule moves the close for every
  late bid, so a collector who cannot stay on the page either overpays early
  or misses the lot.
- Evidence: the extension rule exists because bidders arrive at the last
  minute; every collector who cannot be there for that moving close is a bid
  the lot never receives. eBay and Goldin resolve the same way: hidden
  maximum, public price is second-highest plus increment.
- Related: [Grade10 Auction](./auction.md), OpenSpec change
  `add-auction-auto-bidding`. `add-grade10-auction` listed auto-bidding as a
  non-goal of that MVP.

## Goals

- Let a collector compete after they close the tab.
- Keep the public price honest: it is what it takes to beat the field, not
  the leader's cap.
- Keep one card hold per bidder per listing, covering the commitment, so a
  bid Grade10 places never needs a fresh card check mid-auction.

## Non-goals

- A price-banded increment table. Increments stay per-listing.
- Reserve prices. They remain removed.
- Lowering or withdrawing a maximum.
- Telling a bidder they are about to be outbid, or nudging them to raise.
- Invoicing, capture, or fulfilment — the hold model from the auction MVP
  stands.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Bidder | Wants the lot, cannot sit on the page | Sets a maximum once and still competes. |
| Bidder | Has been overtaken | Raises the maximum, never lowers it. |
| Bidder | Reading the lot | Sees their own cap and whether they lead, without seeing anyone else's. |
| Auction operator | A dispute about who led | Reads each commitment's cap and when it was accepted. |

## Experience

### Primary flow

1. A bidder opens an open listing and enters the most they will pay.
2. Grade10 accepts the commitment after a card authorization for that
   maximum, and bids for them only as far as needed to lead.
3. The bidder leaves. When someone else commits, Grade10 resolves once and
   the price moves; it does not keep bidding on a timer.

## Requirements

Checkable requirements: `openspec/specs/grade10-auction/auto-bidding/spec.md`.

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| Grade10 auction service | Resolves commitments under the existing listing lock. | No second place a bid is accepted. |
| Stripe backend | Authorizes the committed maximum, not the current bid. | Release behaviour is unchanged. |
| Grade10 storefront | Bid control asks for a maximum and shows the viewer's own standing. | Public listing facts never carry a leading maximum. |
| Grade10 admin | Bid history shows maximum, resulting price, and whether Grade10 placed the bid. | Operator money shape. |
| Auction contracts | Bid action carries a maximum. **BREAKING** for any consumer sending a bare bid amount. | Integer minor units plus ISO 4217. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Auto-bid share | Share of accepted bids placed by the platform on a bidder's behalf. | Product |
| Absent winners | Share of lots whose winner was not on the page when the lot closed. | Product |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Resolve | Decided | Second-highest maximum plus the listing increment, capped at the leader's maximum. Equal maxima: earlier commitment leads. | Product |
| Hold | Decided | The card hold is the maximum, not the current bid. One active hold per bidder per listing. | Product |
| Raise only | Decided | A maximum can go up, never down. Lowering would withdraw a commitment others have already bid against. | Product |
| Hidden cap | Decided | A leading maximum is not public. Other bidders learn it only by beating it. | Product |
| Increment | Decided | The listing's own configured increment. No price-banded schedule. | Product |
| Admin history filter | Open | Whether history can hide platform-placed bids. An operator can already see both. | Product |
| Preset amounts | Open | Whether the bid surface offers presets alongside free entry. Presentation only. | Design |

## Rollout and risks

- Holding the maximum may discourage high maximums; the bid surface must say
  what is held.
- A failed raise must leave the previous commitment standing.
- Existing open listings treat each accepted amount as a maximum equal to
  that amount; do not re-authorize those holds.
- Independent of watching and of auction mail, though outbid mail becomes
  more useful once a collector has a maximum to raise.
