---
title: Bidding history
summary: A collector's private record of every bid, and the combined story a listing tells alongside it.
spec: grade10-auction/bidding-history
order: 4
---

A signed-in collector reads their own bidding at `/bids`: one index of every
listing they have touched, ordered by the latest activity, filterable into
**Active** and **Completed**. Each summary carries a standing — pending,
leading, outbid, won, lost, canceled, or failed-only when every attempt on
that listing was refused — without one row per action.

Expanding a summary opens the combined history for that listing: every
accepted public price movement merged with the collector's own private
events, in one stable chronological order. The collector's own actions read
as **You**; every rival stays behind that listing's pseudonym, the same rule
the anonymous auction view already follows. An outbid step names the rival
that caused it and the resulting price without exposing either side's private
maximum.

::spec{id="grade10-auction/bidding-history" requirement="A storefront account has one retained bidding index"}

Nothing here changes what wins an auction. `bid_action_logs` and
`bid_bidder_status` are a rebuildable explanation beside the authoritative
`bids` and automatic-bid state, so this read model can be replayed or
rebuilt without touching a bid, a hold, or a close.

:::callout{kind="note"}
No Figma frame exists for this page — it is a Path B application-composition
change. The capability spec owns behavior, the delivered `design.md` owns the
composition seams, and the implemented Grade10 page state stories are the
review source. It composes only existing `@grade10/design-system` exports
(`Tabs`, `Card`, `Badge`, `List`, `Skeleton`, and friends); no token,
primitive, or shared `@grade10/ui` block was added.
:::

:::callout{kind="warning"}
ZZZ shares the same backend contract and identity boundary but has no `/bids`
screen. A ZZZ account's history stays scoped to ZZZ activity even though a
Grade10 account with the same account id may exist.
:::

## What a collector does

::journeys{id="grade10-auction/bidding-history"}

## The contract

::spec{id="grade10-auction/bidding-history"}
