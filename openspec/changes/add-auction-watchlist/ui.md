# UI: watching a lot

## Screens

**No Figma frame exists for this change yet.** A screen links its frame rather
than describing it, so the frames below are work; `tasks.md` carries producing
them as the first task of each surface group.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Auction lot page — bid panel | *to be produced* | The watch control, filling the panel's existing action slot. |
| Auction catalogue — lot tile | *to be produced* | A watch control on the tile. |
| Watched lots | *to be produced* | The collector's watched lots, most recent first, with the empty state. |

## Components

| Export | Change |
| --- | --- |
| `ListingBidPanel` | **No change.** It already accepts `watchAction` (the control) and `watching` (whether the viewer watches). This change fills them. |
| `ListingBidPanelProps` | **No change.** |

No new `@grade10/ui` export and no new design-system primitive are proposed.
The catalogue tile's control and the watched-lots surface are
application-owned until ZZZ adopts them, per `design.md`.

Copy reaches every control through props; catalog entries live in
`@grade10/i18n`. The watch control's words must not imply the lot is held,
reserved, or claimed — the requirement *A watch is private and confers
nothing* is a promise the copy has to keep.

## States

Each tied to the scenario that defines it.

| State | Scenario |
| --- | --- |
| Not watching | *A collector unwatches a lot* — the resting state after unwatching |
| Watching | *A collector watches a lot* |
| Signed out | *A signed-out viewer is offered sign-in* — the control offers sign-in, and is not hidden |
| Watched list, populated | *The list is ordered by when each watch was made* |
| Watched list, entry facts | *An entry carries the facts needed to act* — identity, current bid, close with its time zone |
| Watched list, empty | *A collector watching nothing* — an explanation, never a bare page or an error |
| Watched entry, lot closed | *A closed lot stays in the list* |
| Watched entry, lot called off | *A called-off lot is shown as called off* |

A viewer who is not signed in never sees another collector's watch state, per
*One collector cannot see another's watch*.
