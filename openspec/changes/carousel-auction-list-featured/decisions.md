## Goals

- An operator chooses up to three lots that lead `/auction`, each with one
  front page image they upload for that slot.
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
  Featured image without a per-slot front page image.
- More than three Featured slides.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who chooses Featured slides? | An authorized operator curates each slide from **Manage Featured** on the Listings tab: pick a listing and upload one **front page image** for that slot (banner background and slab), never a gallery pick | Auto Top-N live lots; campaign cover or listing gallery image as the carousel image |
| Q2 | How many slides? | At most **3**, in operator order | Current PRD max 4 scrolling cards |
| Q3 | Does the banner show a live current bid? | Yes — served amount, with a rolling number when it changes | Static served bid only |
| Q4 | How does end or open time show on the banner? | Client countdown from the served close or open; no live status websocket | Real-time lot-status push on the banner |
| Q5 | Categories and busy filter? | Out for this change: Featured (when present) then All auctions only; quiet layout always until a later change | Busy tiles and category filter from the old Catalogue rules |
| Q6 | Watch from the list? | Same watch as the lot page and My Auctions (`grade10-site/auction/watchlist`) | List-local watch rules |
| Q7 | Upcoming / Ended card chrome? | Not this change — pending design | Specifying those card variants now |
| Q8 | Which lots may fill a Featured slot? | Published Active or Upcoming only; Ended cannot fill a slot - decided by the round | Ended lots in Featured; any published lot including Closed |
| Q9 | Where do site catalogue rules live? | Delta on `grade10-site/auction/auction`; admin curation is new `grade10-admin/auction/featured` - decided by the round | Overloading `listing-page` (lot address only); extending campaigns as the sole Featured source |
| Q10 | Design reference? | Storybook `Pages/Auction List` → **Carousel banner** (`pages-auction-list--carousel-banner`) - decided by the round | Scrolling featured row and busy/quiet category page stories as canonical |
| Q11 | Does Featured progress auto-advance? | Progress control advances slides; CarouselProgress auto-play is allowed presentation only | Requiring auto-advance as a product rule |
| Q12 | One Featured slide progress chrome? | Multi-dot advance not required; progress may be absent or a single item | Forcing one chrome shape |
| Q13 | Featured lot Ends while slotted? | Public Featured drops it at read time; admin slot stays until clear or replace | Auto-clearing the admin slot |
| Q14 | Same lot in two Featured slots? | No | Allowing duplicates |
| Q15 | Signed-out watch on All auctions? | Watchlist owns it: offer sign-in | Catalogue-local watch rules |
| Q16 | Replace a filled slot? | Replace in place | Requiring clear-then-fill |
| Q17 | Incomplete slot (lot or front page image missing)? | Saveable in admin; not shown on `/auction` | Forbidding incomplete saves |
| Q18 | Admin Featured curator placement? | **Manage Featured** control beside Create listing on the Listings tab; opens a Listings sub-page of ordered slots | Campaigns sibling tab; curation only inside a listing detail dialog |
| Q19 | How does `/auction` load Featured? | Dedicated public `featured.publicList` endpoint returning slide facts and the front page image URL | Nesting Featured inside the All auctions catalogue page payload |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/auction | Does Featured progress auto-advance on a timer, or only when the collector activates a progress control? | Q11 |
| grade10-site/auction/auction | With one Featured slide, is progress absent entirely, or shown as a single non-advancing item? | Q12 |
| grade10-site/auction/auction | If a Featured lot becomes Ended while still in a complete slot, does that slide leave `/auction` immediately? | Q13 |
| grade10-site/auction/auction | May the same published lot fill more than one Featured slot? | Q14 |
| grade10-site/auction/auction | For a signed-out collector, how does All auctions watch behave? | Q15 |
| grade10-admin/auction/featured | When replacing a filled slot, clear first or replace in place? | Q16 |
| grade10-admin/auction/featured | Front page image without lot (and lot without front page image) — incomplete and saveable? | Q17 |
| grade10-admin/auction/featured | Admin Featured curator nav placement (Campaigns sibling vs Listings)? | Q18 |
| grade10-site/auction/auction | How does `/auction` load Featured slide data? | Q19 |
