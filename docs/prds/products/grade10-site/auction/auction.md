---
title: Bidding Rules
spec: grade10-site/auction/auction
order: 21
---

## Values

| Rule | Value |
| --- | --- |
| Sale | **Absolute** — no reserve, no buy-now price; the highest accepted bid at the close wins |
| Bidding window | From the scheduled start to the recorded close |
| Extension duration | **30 minutes** by default, set per listing; **0** turns extended bidding off |
| Extension cap | Optional, per listing; the close never moves past the scheduled close plus the cap |
| Verified bidder | 🚧 A bid of **HKD 120,000** or more, on a brand with an identity store — [KYC](/p/grade10-site/account/kyc) |
| Bid-time hold | **Off** by default — [Bid Card and Holds](/p/grade10-site/auction/bid-payment-method) |
| Listing terms | The fee, currency, region and deadline terms are fixed when bidding opens |

## A Valid Bid

- **Meets the next minimum** — the starting price for a first bid, then the
  current bid plus the increment its price selects — [Bid
  Increments](/p/grade10-site/auction/bid-increments)
- **Inside the window** — placed between the scheduled start and the recorded
  close
- **Accepted once** — a bid advances the highest bid atomically, so a delayed
  lower bid never displaces a higher one however the network reorders them
- **What a bidder reads** — the current bid, the bid count and their own
  highest accepted bid; never another bidder's identity or card facts
- 🚧 **Verified above the bar** — at or above the bar the storefront forwards
  a bid only for a verified bidder, and otherwise holds it and says where to
  verify; no hold is taken and the auction records nothing

## Refusals

| Refused when | What the bidder sees |
| --- | --- |
| Below the next minimum | Refused, naming the minimum |
| Before the start, or after the recorded close | Refused |
| Above the currency's ceiling | Refused, naming the ceiling — [Bid Increments](/p/grade10-site/auction/bid-increments) |
| 🚧 At or above the bar without a verified identity | Held at the storefront, with where to verify |
| The card hold is declined, when holds are on | Refused before the bid stands — [Bid Card and Holds](/p/grade10-site/auction/bid-payment-method) |

## The Close

Until the scheduled close, no bid moves the recorded close. At the scheduled
close a listing with at least one accepted bid and extended bidding on enters
extended bidding: every accepted bid, from anyone, sets the recorded close to
the full extension duration after that bid, and the listing closes when the
timer runs out.

| Listing | Bids by the 20:00 scheduled close | Bids after it | Closes |
| --- | --- | --- | --- |
| A | None | — | 20:00 |
| B | One | None | 20:30 |
| C | Three | 20:10, then 20:35 | 21:05 |
| D | One, extension duration 0 | — | 20:00 |
| E | One, cap 30 minutes | 20:10 | 20:30 |

- **A bid at the scheduled close** — counts as accepted by it, so the listing
  extends
- **The cap** — a bid that would move the close past the cap is accepted
  without moving it
- **Each listing on its own** — every listing runs its own timer, whatever
  campaign it belongs to
- **What a consumer reads** — the scheduled close, the recorded close, the
  extension duration and the cap — [Listing Page
  Blocks](/p/shared/ui/auction-listing)

## Holds

- **None by default** — a valid bid is accepted without waiting for or
  creating a card hold
- **When on** — a bid stands only once an authorization is recorded for it,
  one per bidder per listing, raised only when the bidder raises their
  maximum — [Bid Card and Holds](/p/grade10-site/auction/bid-payment-method)
- **Released** — an outbid bidder's hold is released at once, and every
  unsuccessful bidder's at the close; a delayed authorization for a bid no
  longer high enough is released and never becomes a bid
- **Never charged twice** — a delayed or missed provider webhook is repaired
  by reconciliation without a second charge; an incomplete card configuration
  fails the action explicitly instead

::cases{id="grade10-site/auction/auction"}

:::detail{title="Product decisions" for="pm"}
Bidders arrive in the last minutes, so a close that cannot move rewards
whoever is last. Extended bidding starts at the announced close and runs
until bidding stops, lot by lot.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Absolute sale | Decided | No reserve and no buy-now price; the highest accepted bid at the close wins. | Product |
| Extended bidding | Decided | Starts at the scheduled close for a listing with a bid, runs 30 minutes by default, restarts on every accepted bid, and ends at the listing's optional cap. A listing with no bid, or with the duration set to 0, closes on schedule. | Product |
| Bid-time hold | Decided | Off by default; a valid bid is accepted without a card hold. When enabled, one hold per bidder per listing covers the maximum. | Product and finance |
| Verified bidder | 🚧 In flight | A bid of HKD 120,000 or more needs a verified identity, checked by the storefront before the auction hears of the bid. | Product |
:::
