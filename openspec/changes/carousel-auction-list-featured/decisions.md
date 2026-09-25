## Goals

- An operator chooses up to three lots that lead `/auction`, each with one
  hero image they upload for that slot.
- A collector opening `/auction` reads that Featured carousel when slides are
  set: live rolling bid, client countdown, Bid Now to the lot.
- The catalogue below Featured is All auctions only — quiet layout, shared
  watch on cards.

## Non-Goals

- Category tiles, quiet image tiles, and the busy category filter or sidebar.
- Real-time lot-status push on the banner beyond the client countdown and the
  live bid amount.
- Designing Upcoming, Ended, or other lot-card treatments beyond what Active
  already shows.
- Changing the lot details page layout (watch parity only).
- Auto Top-N Featured from live lots alone, or using a campaign cover as the
  Featured image without a per-slot hero.
- More than three Featured slides.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who chooses Featured slides? | An authorized operator curates each slide: pick a lot and upload one hero image for that slot (banner background and slab) | Auto Top-N live lots; campaign cover alone as the Featured image |
| Q2 | How many slides? | At most **3**, in operator order | Current PRD max 4 scrolling cards |
| Q3 | Does the banner show a live current bid? | Yes — served amount, with a rolling number when it changes | Static served bid only |
| Q4 | How does end or open time show on the banner? | Client countdown from the served close or open; no live status websocket | Real-time lot-status push on the banner |
| Q5 | Categories and busy filter? | Out for this change: Featured (when present) then All auctions only; quiet layout always until a later change | Busy tiles and category filter from the old Catalogue rules |
| Q6 | Watch from the list? | Same watch as the lot page and My Auctions (`grade10-site/auction/watchlist`) | List-local watch rules |
| Q7 | Upcoming / Ended card chrome? | Not this change — pending design | Specifying those card variants now |
| Q8 | Which lots may fill a Featured slot? | Published Active or Upcoming only; Ended cannot fill a slot - decided by the round | Ended lots in Featured; any published lot including Closed |
| Q9 | Where do site catalogue rules live? | Delta on `grade10-site/auction/auction`; admin curation is new `grade10-admin/auction/featured` - decided by the round | Overloading `listing-page` (lot address only); extending campaigns as the sole Featured source |
| Q10 | Design reference? | Storybook `Pages/Auction List` → **Carousel banner** (`pages-auction-list--carousel-banner`) - decided by the round | Scrolling featured row and busy/quiet category page stories as canonical |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| — | — | — |
