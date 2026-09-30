# Decisions

## Goals

- Align and sync countdown, public status, and extended close across browsers
  and machines on the same auction
- Every open auction page and catalogue card counts down from the same service
  clock and shows the same standing bid and recorded close soon after a write
- Between the recorded close and settle, collectors see Closing, not Ended
  from a local clock alone
- After settle, the winner sees Auction won and losers Did not win; My
  Auctions shows the auction top for every bidder on that auction

## Non-Goals

- Private maxima, identity, or card facts on the live wire
- Replacing Postgres as the store of bids and the recorded close
- Removing the five-minute close cron (it remains the net under a missed alarm)
- Pushing inventory product panels through the live room

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What clock do countdowns run on? | The auction service clock via `GET /api/public/time`, with re-probe after sleep, reconnect, or tab focus (recommended) | Each browser's `Date.now()` alone - tabs drift and disagree |
| Q2 | How do pages learn a bid or close changed? | Durable Object rooms re-read public state after Postgres commits, then broadcast; a missed push falls back to poll (recommended) | Poll-only, or trust a payload the writer invents |
| Q3 | What do pages show past `endsAt` while still published? | Closing until settle extends or closes (recommended) | Ended from the page clock, which drops polling and misses an extension |
| Q4 | Who settles a due close? | Room alarm first; a public read two seconds past the deadline may settle; cron remains the net (recommended) | Cron alone - leaves a gap of minutes with wrong badges |
| Q5 | What money does My Auctions show on a bidding row? | The auction's top (current or winning) amount (recommended) | The viewer's latest bid only - losers misread the hammer |

## Raised

None - this change records settled work; no blind-suite raises remain open.
