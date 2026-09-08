# UI: watching a listing

**Terminology.** Surfaces may say **lot** in copy — that word labels a
**listing** (`listingLabel` / `lotLabel`). There is no separate lot entity;
frames and states below are listing surfaces.

## Screens

**No Figma frame exists for this change yet.** A screen links its frame rather
than describing it, so the frames below are work; `tasks.md` carries producing
them as the first task of each surface group.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Auction listing page — header | *to be produced* | The watch control, filling `ListingLotHeader`'s existing slot. |
| Auction catalogue — listing tile | *to be produced* | A watch control on the tile. |
| Watched listings | *to be produced* | The collector's watched listings, most recent first, with the empty state; each entry opens the listing and can unwatch without opening it. Placement (header vs account area) is still open on the capability page. |

## Components

| Export | Change |
| --- | --- |
| `ListingLotHeader` | **No change.** It already accepts `watched` and `onWatchToggle`. This change fills them. The export name keeps "Lot" because the block shows the listing's label. |
| `ListingLotHeaderProps` | **No change.** |

No new `@grade10/ui` export and no new design-system primitive are proposed.
The catalogue tile's control and the watched-listings surface are
application-owned until ZZZ adopts them, per `tech-design.md`.

Copy reaches every control through props; catalog entries live in
`@grade10/i18n`. The watch control's words must not imply the listing is held,
reserved, or claimed — watching confers no standing, and the copy has to
keep that promise.

## States

Each tied to the scenario that defines it.

| State | Scenario |
| --- | --- |
| Not watching | `grade10-site-auction-watchlist-SC-02` — the resting state after unwatching |
| Watching | `grade10-site-auction-watchlist-SC-01` |
| Signed out | `grade10-site-auction-watchlist-SC-04` — the control offers sign-in, and is not hidden |
| Watched list, populated | `grade10-site-auction-watchlist-SC-11` |
| Watched list, entry facts | `grade10-site-auction-watchlist-SC-15` — identity, current bid, close with its time zone |
| Watched list, empty | `grade10-site-auction-watchlist-SC-12` — an explanation, never a bare page or an error |
| Watched entry, listing closed | `grade10-site-auction-watchlist-SC-16` |
| Watched entry, listing called off | `grade10-site-auction-watchlist-SC-17` |
| Unwatch from the watched list | `grade10-site-auction-watchlist-SC-18` |

A viewer who is not signed in never sees another collector's watch state, per
`grade10-site-auction-watchlist-SC-08`.
