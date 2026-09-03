# UI: watching a lot

## Screens

**No Figma frame exists for this change yet.** A screen links its frame rather
than describing it, so the frames below are work; `tasks.md` carries producing
them as the first task of each surface group.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Auction lot page — header | *to be produced* | The watch control, filling the lot header's existing slot. |
| Auction catalogue — lot tile | *to be produced* | A watch control on the tile. |
| Watched lots | *to be produced* | The collector's watched lots, most recent first, with the empty state. |

## Components

| Export | Change |
| --- | --- |
| `ListingLotHeader` | **No change.** It already accepts `watched` and `onWatchToggle`. This change fills them. |
| `ListingLotHeaderProps` | **No change.** |

No new `@grade10/ui` export and no new design-system primitive are proposed.
The catalogue tile's control and the watched-lots surface are
application-owned until ZZZ adopts them, per `design.md`.

Copy reaches every control through props; catalog entries live in
`@grade10/i18n`. The watch control's words must not imply the lot is held,
reserved, or claimed — watching confers no standing, and the copy has to
keep that promise.

## States

Each tied to the scenario that defines it.

| State | Scenario |
| --- | --- |
| Not watching | `watchlist-SC-02` — the resting state after unwatching |
| Watching | `watchlist-SC-01` |
| Signed out | `watchlist-SC-04` — the control offers sign-in, and is not hidden |
| Watched list, populated | `watchlist-SC-11` |
| Watched list, entry facts | `watchlist-SC-15` — identity, current bid, close with its time zone |
| Watched list, empty | `watchlist-SC-12` — an explanation, never a bare page or an error |
| Watched entry, lot closed | `watchlist-SC-16` |
| Watched entry, lot called off | `watchlist-SC-17` |

A viewer who is not signed in never sees another collector's watch state, per
`watchlist-SC-08`.
