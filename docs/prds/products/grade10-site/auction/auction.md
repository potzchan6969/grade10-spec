---
title: Bidding Rules
spec: grade10-site/auction/auction
order: 21
---

## Values

| Rule | Value |
| --- | --- |
| Sale | **Absolute** — no reserve, no buy-now price |
| Winner | The highest valid bid when the listing closes |
| Extended bidding | **30 minutes** by default, restarted by every new bid, up to an optional cap the listing sets |
| Verified bidder | A bid of **HKD 120,000** or more — [KYC](/p/grade10-site/account/kyc) |
| Bid-time hold | **Off** by default — [Bid Card and Holds](/p/grade10-site/auction/bid-payment-method) |

## A Valid Bid

- **Meets the listing's rules** — at or above the next minimum from the
  [increment schedule](/p/grade10-site/auction/bid-increments), between the
  scheduled start and the recorded close
- **Accepted once** — a bid advances the highest bid atomically; a delayed
  lower bid can never displace a higher one, however the network reorders
  them, because the last minutes of an auction are nothing but races
- **Verified above the bar** — a bid of HKD 120,000 or more needs a verified
  bidder; the storefront holds it before the auction hears of it and sends the
  bidder to verify from their account
- **No hold to wait for** — Grade10 accepts a valid bid without waiting for or
  creating a card hold; when the optional hold is enabled, a bid stands only
  with an authorization recorded for it
- **Never charged twice** — a missed provider webhook or an incomplete card
  configuration is repaired without a second charge

## The Close

- **Scheduled close** — a listing with no bid closes at its scheduled close
- **Extended bidding** — a listing with at least one bid, a bid at the close
  included, enters extended bidding for its extension duration; every new
  bid, from anyone, restarts the timer at the full duration
- **The end** — the listing closes when its timer runs out with no new bid,
  subject to the listing's optional cap; each listing runs its own timer, so
  sniping buys nothing
- **What a consumer reads** — the scheduled close, the recorded close, the
  extension duration and the cap — [Listing Page
  Blocks](/p/shared/ui/auction-listing)

::cases{id="grade10-site/auction/auction"}

:::detail{title="Product decisions" for="pm"}
Bidders arrive in the last minutes, so a close that cannot move rewards
whoever is last. Extended bidding starts at the announced close and runs
until bidding stops, lot by lot.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Absolute sale | Decided | No reserve and no buy-now price; the highest valid bid at the close wins. | Product |
| Extended bidding | Decided | Starts at the scheduled close for a listing with a bid, runs 30 minutes by default, restarts on every accepted bid, and ends at the listing's optional cap. A listing with no bid closes on schedule. | Product |
| Bid-time hold | Decided | Off by default; a valid bid is accepted without a card hold. When enabled, one hold per bidder per listing covers the maximum. | Product and finance |
| Verified bidder | Decided | A bid of HKD 120,000 or more needs a verified identity, checked by the storefront before the auction hears of the bid. | Product |
:::
