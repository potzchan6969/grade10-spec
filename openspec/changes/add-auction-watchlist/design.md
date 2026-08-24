# Design: watching a lot

Requirements are in
[`specs/grade10-auction/watchlist/spec.md`](specs/grade10-auction/watchlist/spec.md).
Motivation is in [`proposal.md`](proposal.md).

## Context

Auction lots are shared between the Grade10 and ZZZ brands — the one place the
two brands are not separated. Identity is not shared: sign-in is brand-wide,
and the ZZZ store backend is its own identity boundary. Account data is keyed
by user id.

`ListingBidPanel` already ships a `watchAction` slot and a `watching` flag with
nothing behind them.

## Decisions

### The watch record lives with the auction, beside the lot

A watch is `(user id, lot, watched instant)`, stored by the auction service
that owns the lot.

*Alternative rejected — store watches per brand, beside the collector.* Lots
are shared and collectors are not, so a per-brand store means a lot's watchers
are split across two systems. An operator's watch count would then have to be
assembled by querying both, and the count is the one operator-facing fact this
change offers.

The consequence is that the auction service holds a user id from either
brand's identity population. It already holds bidder identity the same way.

### Watching is idempotent, and unwatching is a delete

Watching a lot already watched changes nothing, including the instant. This
keeps the list's ordering stable when a collector taps twice or a request is
retried.

*Alternative rejected — refresh the instant on a repeat watch.* It would
reorder a collector's list for an action they did not perceive as an action.

### A watch survives its lot

Closing, calling off, or losing a lot does not delete the watch. The collector
decides when it leaves their list.

*Alternative rejected — clear watches when a lot closes.* It empties the list
precisely when a collector wants to see what happened, and it deletes the
record the auction mail fired on, making a delivered message unexplainable.

### The catalogue control stays application-owned for now

The lot page's watch control fills `ListingBidPanel`'s existing slot, so the
shared UI package does not change. The catalogue tile's control is built in
each application.

*Alternative rejected — add a watch control to the shared auction tile now.*
The store's wishlist heart was removed for being a shared control with no
surface behind it. A second consumer is what justifies promoting this one, and
ZZZ adopting it is that moment — not before.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| The control repeats the removed wishlist's mistake — a heart that saves nothing | Persistence, the list surface, and the control land in this one change. None ships alone. |
| A collector reads watching as reserving the lot | The spec forbids any standing; copy must not use reserve-like words. Named in `ui.md`. |
| Watch counts spanning brands mislead an operator into reading demand as one market | The count is presented as watchers, never as expected bidders. |
| An unbounded watched list grows slow to read | Ordering is a single index on the watch instant; the list is paged by the surface. Revisit only if a collector's list becomes large. |

## Migration plan

None. No watch exists today, `watchAction` is unfilled everywhere, and no
stored data changes shape.

## Open questions

Answerable later without changing the specs, the approach, or the tasks.

- Whether the watched list is reachable from the header or only from the
  account area. Placement, not behaviour.
- How many entries a page of the watched list holds.
- Whether an operator's watch count appears on the listings table or only on a
  listing's own admin page.
