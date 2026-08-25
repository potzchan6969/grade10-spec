# UI: automatic bidding

## Screens

**No Figma frame exists for this change yet.** The convention in this store is
that a screen links its frame and is never described in prose, because the
frame is the layout's source of truth. That frame has to be produced before
the frontend group can be claimed; `tasks.md` carries it as the first task of
that group rather than leaving it implied.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Auction listing page — bid panel | *to be produced* | The bid control asks for a maximum; the panel shows the viewer's own maximum and whether they lead. |
| Admin listing — bid history | *to be produced* | Each row shows the committed maximum, the resulting current bid, Accepted At, and whether Grade10 placed the bid. |

## Components

All from `@grade10/ui`. Export names are the cross-repo contract.

| Export | Change |
| --- | --- |
| `ListingBidPanel` | Needs a slot for the viewer's own committed maximum, distinct from `price`. Today the panel has `price`, `priceHint`, `bidCount`, `history`, `standing`, and `actions`; a maximum rendered through `priceHint` would read as a hint about the current bid, which it is not. |
| `ListingBidPanelProps` | Gains that slot. It is a `ReactNode` like its neighbours: the panel holds no copy of its own, and the consumer owns the words. |

The panel's `standing` slot already carries the highest-bidder / outbid banner
and needs no change — "you lead" and "you have been outbid" are content the
consumer supplies, which is what *A bidder reads their own commitment* needs.

No new design-system primitive is proposed. No new variant, size, or token.

`ListingBidPanelCopy` gains the label naming the viewer's own maximum. Copy
reaches the panel through props; catalog entries live in `@grade10/i18n` and
are named in the frontend group.

## States

Each tied to the scenario that defines it.

| State | Scenario |
| --- | --- |
| Viewer leads, maximum above current bid | *A bidder reads their own commitment* |
| Viewer has been overtaken, maximum unchanged | *An overtaken bidder sees that they no longer lead* |
| Viewer has committed nothing | No maximum slot is rendered — there is nothing to show. Covered by the panel's existing behaviour for an omitted optional slot. |
| Commitment refused as below the minimum next bid | *A maximum below the minimum next bid is refused* |
| Commitment refused because the card authorization failed | *A raise that cannot be authorized changes nothing* — the previous maximum must still be shown, unchanged. |
| Commitment accepted but not leading (equal maximum) | *A tie is not a refusal* — accepted, not leading. This state is easy to render as an error and must not be. |
| Listing closed | Existing closed-listing behaviour; no maximum entry is offered. |

An unauthenticated viewer sees the current bid and no maximum slot, per
*A leader's maximum is not public*.
