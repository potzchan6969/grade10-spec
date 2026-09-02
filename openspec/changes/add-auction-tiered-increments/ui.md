# UI: tiered bid increments

## Screens

**No Figma frame exists for these yet.** A screen links its frame rather than
being described in prose; `tasks.md` carries producing them as the first task
of each surface group.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Admin listing — prices and window | *to be produced* | The single increment field becomes a tier editor: rows of start amount and increment, add, remove, reorder by value. Read-only once published. |
| Admin — house default increment table | *to be produced* | The same editor, per currency, with a warning that a change reaches only listings created afterwards. |
| Auction lot page — bid panel | *to be produced* | The minimum next bid, which now moves as the price crosses a tier. |

## Components

| Export | Change |
| --- | --- |
| `ListingBidPanel` | **No change expected.** The minimum next bid is a fact about the price, which is what the existing `priceHint` slot is for. If design wants it as its own row rather than a hint beneath the price, that is a new slot and becomes work in **grade10-spec** — flag it before the frame is signed off. |
| `ListingBidPanelProps` | **No change expected**, on the same condition. |

No new design-system primitive is proposed. The admin tier editor is an admin
surface and is application-owned; it is not a `@grade10/ui` block.

Copy reaches the panel through props; catalog entries live in `@grade10/i18n`.
The minimum-next-bid label must read as the amount that will be accepted, not
as the amount being asked for.

## States

Each tied to the scenario that defines it.

| State | Scenario |
| --- | --- |
| Listing with no bids — minimum is the starting price | `bid-increments-SC-10` |
| Listing with bids — minimum steps by the current bid's tier | `bid-increments-SC-13` |
| Minimum lands in a higher tier than the one that sized it | `bid-increments-SC-14` — normal, must not read as an error |
| Bid refused below the minimum, minimum named | `bid-increments-SC-15` |
| Admin: created listing, table editable | `admin-listing-SC-29` |
| Admin: published listing, table read-only | `admin-listing-SC-30` |
| Admin: table refused as invalid, failing tier named | `bid-increments-SC-02`, `SC-03`, `SC-04` |
| Admin: house default changed, existing listings untouched | `bid-increments-SC-19` — the screen must say so, or an operator will assume otherwise |

The whole table is not shown to a collector. What a bidder needs is the
minimum next bid, per `bid-increments-SC-17`.
