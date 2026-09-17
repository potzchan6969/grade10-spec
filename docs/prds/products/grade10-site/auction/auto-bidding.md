---
title: Auto-Bidding
spec: grade10-site/auction/auto-bidding
order: 23
---

A collector names the most they will pay, and Grade10 bids for them only as
far as needed to lead.

## The Maximum

- **Private** — a leading maximum is never public; another bidder learns it
  only by beating it, so a maximum is never burned by being seen
- **Raise only** — a maximum can go up at any time and never down; lowering
  would withdraw a commitment others have already bid against
- **Validity** — a maximum below the listing's next minimum is refused
- **Own standing** — a bidder sees their own maximum, the current bid and
  whether they lead, as three distinct facts
- **Hold** — none by default; when bid-time holds are enabled, one card
  authorization covers the whole maximum, so a bid Grade10 places never needs
  a fresh card check — [Bid Card and
  Holds](/p/grade10-site/auction/bid-payment-method)

## The Price

The public price is what it takes to beat the field, never the leader's cap.

| Situation | Current bid |
| --- | --- |
| First maximum | The starting price; the cap stays hidden |
| Two maxima | The lesser of the leader's maximum and the second-highest plus one [increment](/p/grade10-site/auction/bid-increments) |
| Equal maxima | The earlier commitment leads; the later one is recorded, then the leader's automatic response at the same amount |
| A raise the card cannot cover | Nothing moves: the maximum, the leader and the price stay as they were |

- **One resolution per commitment** — Grade10 never steps through
  intermediate increments
- **A bid Grade10 places is a bid** — it counts in the bid count and the
  history as placed on that bidder's behalf
- **Extended bidding** — a maximum committed before the close counts toward
  entering it; an auto bid during extended bidding restarts the timer as a
  manual bid would; two standing maxima do not keep extending the close on
  their own — [Bidding Rules](/p/grade10-site/auction/auction)

## Bid Panel

Under Set your private maximum, an always-on line in secondary text says that
Grade10 bids only as needed up to the maximum, and that the maximum can be
raised but not lowered or cancelled; when holds are enabled it also says the
card hold matches the maximum. Place Bid is the commitment, and a moved floor
uses the panel's stale-floor recovery.

- 🚧 **Buyer fee on the panel** — under the bid action, always-on secondary
  copy states that a 20% buyer fee is added on top of the winning bid; the
  rate is not behind a tooltip
- 🚧 **Quick bids** — three chips at 1×, 2× and 4× the listing increment:
  from the current bid when the collector does not lead, from their maximum
  when they do
- 🚧 **A leader's typed raise** — still starts at max + $1; that floor is not
  the first chip
- 🚧 **Custom maximum ceiling** — a custom maximum cannot go above
  9,999,999,999 whole major units; an over-limit paste or keystroke leaves
  the previous draft

::story{id="auction-listing-listingauctionbidcard--custom-maximum-ceiling" title="Custom maximum ceiling"}

## Past Maximums

- 🚧 **Re-read on the lot** — past accepted maximums and the bids Grade10
  placed for the owner are re-read from **Your bidding** on the lot bid card;
  the full audit including refusals stays under [Bidding
  History](/p/grade10-site/auction/bidding-history)

::cases{id="grade10-site/auction/auto-bidding"}

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
| Hold | Decided | When holds are enabled, the card hold is the maximum, not the current bid. One active hold per bidder per listing. | Product |
| Raise only | Decided | A maximum can go up, never down. Lowering would withdraw a commitment others have already bid against. | Product |
| Hidden cap | Decided | A leading maximum is not public. Other bidders learn it only by beating it. | Product |
| Increment | Decided | The Grade10-owned USD, HKD, and JPY schedule selects the increment from the amount being beaten. No listing-level override. | Product |
| Bid action carries a maximum | Decided | A consumer sending a bare bid amount is broken by this contract. Money stays integer minor units plus ISO 4217. | Product |
| Custom maximum entry | Decided | Whole major units only on the bid panel custom field; typed `.` is refused, pasted fractions are discarded. | Product |
| Custom maximum ceiling | Decided | Cap at 9,999,999,999 whole major units; over-limit paste or keystroke restores the previous valid draft (no clamp, no “too large” copy in v1). | Product |
| Mechanism disclosure | Decided | Always-on secondary subtext under Set your private maximum: bid as needed, raise only (no lower or cancel). When holds are enabled, the line also states that the hold matches the maximum. | Product |
| Admin history filter | Decided | No filter. An operator reads platform-placed and hand-placed bids together. | Product |
| Preset amounts | Decided | Three chips at 1×, 2×, and 4× the listing increment. Leader chips add those to the committed max; others add them to the current bid. A leader's typed minimum stays max + $1 and is not chip 1. | Product |

**Risks.** Holding the maximum may discourage high maximums, so the bid
surface says what is held. A failed raise leaves the previous commitment
standing. Listings open before auto-bidding treat each accepted amount as a
maximum equal to that amount; those holds are not re-authorized.
:::
