---
title: Auto-Bidding
spec: grade10-site/auction/auto-bidding
order: 23
---

A collector names the most they will pay, and Grade10 bids for them only as
far as needed to lead.

## Values

| Rule | Value |
| --- | --- |
| The price | The lesser of the leader's maximum and the second-highest maximum plus one [increment](/p/grade10-site/auction/bid-increments) |
| Resolution | Once per accepted maximum; never through intermediate bids, never on a timer |
| Hold | None by default; when holds are on, one authorization covers the whole maximum — [Bid Card and Holds](/p/grade10-site/auction/bid-payment-method) |

## The Maximum

- **Private** — a leading maximum is never public; another bidder learns it
  only by beating it, when the new price is that maximum plus one increment
- **Raise only** — a maximum can go up at any time and never down; lowering
  would withdraw a commitment others have already bid against
- **Validity** — a maximum below the listing's next minimum is refused
- **Own standing** — a bidder sees their maximum, the current bid and their
  standing as three distinct facts; operators read every maximum with the
  moment it was accepted
- **Your bidding** — past maximums and the bids Grade10 placed re-read from
  the lot's bid card; refusals stay in the account's history — [Bidding
  History](/p/grade10-site/auction/bidding-history)

| Standing | Meaning |
| --- | --- |
| Leading | This maximum is the highest, or ties the highest and was accepted first |
| Not leading | A higher maximum exists, or an equal earlier one |

## The Price

The public price is the least that beats the field, and never more than the
leader's maximum.

| Situation | Current bid |
| --- | --- |
| First maximum | The starting price; the maximum stays hidden |
| A challenger below the leader's maximum | The challenger's maximum plus one increment, capped at the leader's maximum; the leader keeps leading |
| A challenger above the leader's maximum | The old leader's maximum plus one increment, capped at the challenger's maximum; the challenger leads |
| Equal maxima | The earlier maximum leads; two bids are recorded at that amount, the challenger's and then the leader's automatic response |
| A raise the card cannot cover | Nothing moves: the maximum, the leader and the price stay as they were |

A lot starts at 20,000 with a 2,500 increment:

| Step | Who | Maximum | Price | Leader |
| --- | --- | ---: | ---: | --- |
| 1 | You commit | 50,000 | 20,000 | You |
| 2 | They commit | 80,000 | 52,500 | Them |
| 3 | Nobody | — | 52,500 | Them; Grade10 places no bid on a timer |
| 4 | You raise | 90,000 | 82,500 | You |

Where A leads with a maximum of 1,000, the current bid is 400 and the
increment is 100, B's maximum resolves as follows:

| B's maximum | Price | Leader | Public records |
| ---: | ---: | --- | --- |
| 450 | 400 | A | None; refused below the next minimum |
| 500 | 600 | A | B at 500, then A's automatic response at 600 |
| 950 | 1,000 | A | B at 950, then A at 1,000 |
| 1,000 | 1,000 | A | B at 1,000, then A at 1,000 |
| 1,001 | 1,001 | B | B at 1,001 |
| 1,120 | 1,100 | B | B at 1,100 |

- **A bid Grade10 places is a bid** — it counts in the bid count and the
  history as placed on that bidder's behalf, and needs no fresh card check
- **Extended bidding** — a maximum committed before the close counts toward
  entering it; an auto bid during extended bidding restarts the timer as a
  manual bid would; two standing maxima never keep extending the close on
  their own — [Bidding Rules](/p/grade10-site/auction/auction)

## The Panel

- **Setting a maximum** — the quick bids, the custom field's whole units and
  ceiling, and the fee line under the bid action — [Listing Page Blocks ·
  Custom Maximum](/p/shared/ui/auction-listing#custom-maximum) and [Listing
  Page Blocks · Bid Panel Fee](/p/shared/ui/auction-listing#bid-panel-fee)
- **Before a maximum** — sign-in and a linked card — [Bid Panel
  Enrollment](/p/grade10-site/auction/bid-panel-enrollment)

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

**Not in scope.** Reserve prices; they remain removed. Lowering or
withdrawing a maximum. Telling a bidder they are about to be outbid, or
nudging them to raise. Invoicing, capture, or fulfilment — the hold model from
the auction stands.

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
| Preset amounts | Decided | Three chips at 1×, 2×, and 4× the listing increment. Leader chips add those to the committed max; others add them to the current bid. A leader's typed minimum stays the maximum plus 100 minor units and is not chip 1. | Product |

**Risks.** Holding the maximum may discourage high maximums, so the bid
surface says what is held. A failed raise leaves the previous commitment
standing.
:::
