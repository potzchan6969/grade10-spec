## Goals

- A ZZZ collector watches and unwatches a listing on ZZZ the same way a
  Grade10 collector does on Grade10
- A ZZZ collector reads and manages their watched list on ZZZ
- ZZZ carries the listing page, catalogue, and watched list that those
  controls need

## Non-Goals

- Redefining what a watch means, who can see it, or how the shared auction
  stores it — that is `add-auction-watchlist` / `grade10-site/auction/watchlist`
- Sending mail or owning mute fanout — notifications
- Full auction parity on ZZZ (bidding UI beyond what watching needs, winner
  order, bidding history, operator console auction sections)
- Watching store products
- Watching while signed out, or migrating a browser-held watch on sign-in
- Sorting, filtering, or searching the watched list beyond most-recent first

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Keep ZZZ watching inside `add-auction-watchlist`? | Split into `add-zzz-auction-watchlist` so Grade10 can finish without waiting on ZZZ surfaces (recommended) | Leaving task group 4 on the Grade10 change |
| Q2 | Same meaning of watch as Grade10? | Yes — shared auction rules; ZZZ only adds its surfaces (recommended) | A ZZZ-only watch table or a softer "favourite" with different semantics |
| Q3 | What surfaces does ZZZ need for watching? | Listing page, catalogue tile, and watched list — the hosts the Grade10 change already fills (recommended) | Watched list alone, or waiting on full auction parity before any watch control |
| Q4 | Does this change rewrite shared contracts? | No — depends on `add-auction-watchlist` for the record and RPCs (recommended) | Duplicating watch writes in the ZZZ store worker |

## Raised

Empty — the interview settled the frontier; the blind pass has not run yet.

| Capability | Raised | Landed |
| --- | --- | --- |
