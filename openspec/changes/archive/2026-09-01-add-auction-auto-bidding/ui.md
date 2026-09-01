# UI: auto bidding

## Screens

The shared Storybook flows are the review source for this composition. They
cover placing and raising a maximum in the listing bid panel, the overtaken
state, and an accepted commitment that is not leading.

| Screen | Review source | What is new on it |
| --- | --- | --- |
| Auction listing page — bid panel | `Auction Listing/ListingBidPanel/Flows` | The bid control asks for a maximum; the panel shows the viewer's own maximum and whether they lead. |
| Admin listing — bid history | Grade10 admin auction tests | Each row shows the committed maximum, the resulting current bid, Accepted At, and whether Grade10 placed the bid. |

## Components

All from `@grade10/ui`. Export names are the cross-repo contract.

| Export | Change |
| --- | --- |
| `ListingBidPanel` | Needs a slot for the viewer's own committed maximum, distinct from `price`. Today the panel has `price`, `priceHint`, `bidCount`, `history`, `standing`, and `actions`; a maximum rendered through `priceHint` would read as a hint about the current bid, which it is not. |
| `ListingBidPanelProps` | Gains that slot. It is a `ReactNode` like its neighbours: the panel holds no copy of its own, and the consumer owns the words. |

The panel's `standing` slot already carries the highest-bidder / outbid banner
and needs no change — "you lead" and "you have been outbid" are content the
consumer supplies, which is what `auto-bidding-SC-05` needs.

No new design-system primitive is proposed. No new variant, size, or token.

`ListingBidPanelCopy` gains the label naming the viewer's own maximum. Copy
reaches the panel through props; catalog entries live in `@grade10/i18n` and
are named in the frontend group.

## States

Each tied to the scenario that defines it.

| State | Scenario |
| --- | --- |
| Viewer leads, maximum above current bid | `auto-bidding-SC-05` |
| Viewer has been overtaken, maximum unchanged | `auto-bidding-SC-06` |
| Viewer has committed nothing | No maximum slot is rendered — there is nothing to show. Covered by the panel's existing behaviour for an omitted optional slot. |
| Commitment refused as below the minimum next bid | `auto-bidding-SC-02` |
| Commitment refused because the card authorization failed | `auto-bidding-SC-20` — the previous maximum must still be shown, unchanged. |
| Commitment accepted but not leading (equal maximum) | `auto-bidding-SC-18` — accepted, not leading. This state is easy to render as an error and must not be. |
| Listing closed | Existing closed-listing behaviour; no maximum entry is offered. |

An unauthenticated viewer sees the current bid and no maximum slot, per
`auto-bidding-SC-07`.
