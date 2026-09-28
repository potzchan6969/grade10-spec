## Goals

- An operator chooses up to three lots that lead `/auction`, each with one
  front page image they upload for that slot.
- A collector opening `/auction` reads that Featured carousel when slides are
  set: live rolling bid on Active, client countdown, Bid Now or View Auction
  by lot status.
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
| Q1 | Who chooses Featured slides? | An authorized operator curates each slide from **Manage Featured** on the Listings tab: pick a listing and upload one **front page image** for that slot (banner background and slab as that single asset), never a gallery pick for the upload | Auto Top-N live lots; campaign cover or listing gallery image as the uploaded carousel image; separate background and slab uploads |
| Q2 | How many slides? | At most **3**, in operator order | Current PRD max 4 scrolling cards |
| Q3 | Does the banner show a live current bid? | Yes on Active — served amount, rolling digits when it **increases** after first paint. Upcoming shows **no money** until the lot opens (Q39) | Static served bid only; Upcoming starting bid on the banner |
| Q4 | How does end or open time show on the banner? | Client countdown from the served close or open; no live status websocket. Relative **Ends in** / **Opens in** with the list-card short remaining form; neutral colour; extended bidding keeps Ends in to the recorded close (Q24–Q28) | Real-time lot-status push; absolute date on the banner; rolling digit countdown; Extended label |
| Q5 | Categories and busy filter? | Out for this change: Featured (when present) then All auctions only; quiet layout always until a later change | Busy tiles and category filter from the old Catalogue rules |
| Q6 | Watch from the list? | Same watch as the lot page and My Auctions (`grade10-site/auction/watchlist`) | List-local watch rules |
| Q7 | Upcoming / Ended card chrome? | Not this change — pending design | Specifying those card variants now |
| Q8 | Which lots may fill a Featured slot? | Published Active or Upcoming only; Ended cannot fill a slot - decided by the round. If a curated lot closes before the operator clears it, the slot drops from the served Featured set — no Ended slide on the banner | Ended lots in Featured; any published lot including Closed |
| Q9 | Where do site catalogue rules live? | Delta on `grade10-site/auction/auction`; admin curation is new `grade10-admin/auction/featured` - decided by the round | Overloading `listing-page` (lot address only); extending campaigns as the sole Featured source |
| Q10 | Design reference? | Storybook `Auction List/Featured Auctions` → **Carousel banner** (`auction-list-featured-auctions--carousel-banner`) - decided by the round | Scrolling featured row and busy/quiet category page stories as canonical |
| Q11 | Does Featured progress auto-advance? | Collector advance is the product rule (progress; on small viewports also stage previous/next or swipe). CarouselProgress auto-play is allowed presentation only | Requiring auto-advance as a product rule |
| Q12 | One Featured slide progress chrome? | Multi-dot advance not required; progress may be absent or a single item | Forcing one chrome shape |
| Q13 | Featured lot Ends while slotted? | Public Featured drops it at read time; admin slot stays until clear or replace | Auto-clearing the admin slot |
| Q14 | Same lot in two Featured slots? | No | Allowing duplicates |
| Q15 | Signed-out watch on All auctions? | Watchlist owns it: offer sign-in | Catalogue-local watch rules |
| Q16 | Replace a filled slot? | Replace in place | Requiring clear-then-fill |
| Q17 | Incomplete slot (lot or front page image missing)? | Saveable in admin; not shown on `/auction` | Forbidding incomplete saves |
| Q18 | Admin Featured curator placement? | **Manage Featured** control beside Create listing on the Listings tab; opens a Listings sub-page of ordered slots | Campaigns sibling tab; curation only inside a listing detail dialog |
| Q19 | How does `/auction` load Featured? | Dedicated public `featured.publicList` endpoint returning slide facts and the front page image URL | Nesting Featured inside the All auctions catalogue page payload |
| Q20 | Banner CTA by lot status? | Active: **Bid Now**. Upcoming and any Ended-that-still-shows: **View Auction**. Upcoming status is **UPCOMING** with no live status dot - grill 2026-09-25 | Bid Now for Upcoming; hide CTA on Ended |
| Q21 | When does the current bid roll? | Only on Active when the served amount **increases** after first paint; Upcoming has no money to roll - grill 2026-09-25 | Roll on any amount change including first paint and decreases; Upcoming starting bid on the banner |
| Q22 | Banner Storybook coverage? | Live Active carousel (default), one-slide, Upcoming-only, empty Featured on the page story - grill 2026-09-25 | Separate stories for urgency colour, broken hero, reduced motion |
| Q23 | Ended money caption on a stale slide? | **FINAL BID** - grill 2026-09-25 | CURRENT BID; invent another label |
| Q24 | Mixed Active + Upcoming in one Featured set? | Allowed; chrome follows each slide - grill 2026-09-25 | Force a single status across all slots |
| Q25 | Live bid while carousel hover/focus pause? | Bid still rolls; pause only stops auto-advance - grill 2026-09-25 | Freeze the amount until unpause |
| Q26 | Curated lot ends while collector is on `/auction`? | Slide leaves Featured on the next catalogue refresh/poll — no mid-dwell client surgery - grill 2026-09-25 | Drop and renumber progress live under them |
| Q27 | Featured front page image missing or fails to load? | Admin upload is **mandatory** for a complete slide (one image is stage and slab). A missing or failed load falls back to the lot’s first gallery image, else the container’s default background colour — no broken-image chrome - grill 2026-09-25 | Optional upload; invent a third asset type or broken-image icon |
| Q28 | Do All auctions cards live-roll the bid? | No — banner only in this change - grill 2026-09-25 | Roll on list cards too |
| Q29 | Featured loading treatment? | One page enter with the rest of `/auction` — no separate Featured skeleton - grill 2026-09-25 | Skeleton band for Featured alone |
| Q30 | Banner time: relative or absolute? | Relative only — **Ends in** / **Opens in** + remaining; absolute end lives on the lot page - grill 2026-09-25 | Absolute alone; both remaining and absolute on the banner |
| Q31 | Banner remaining precision? | Same short stepped form as All auctions cards (`7d 0h 7m` → … → `12m 05s`) — not the lot-page rolling digit countdown - grill 2026-09-25 | Lot-details rolling countdown on the banner too |
| Q32 | Under-an-hour urgency colour on the banner? | Neutral secondary — no destructive tint on the hero band - grill 2026-09-25 | Match soon-styling from list cards on the banner |
| Q33 | Extended bidding copy on the banner? | Still **Ends in …** to the live recorded close; status stays LIVE BIDDING — no Extended label - grill 2026-09-25 | Separate Extended / Ends soon line |
| Q34 | Client countdown reaches zero before refresh? | Show **Ends in now** (or under-an-hour zero form) until the next catalogue refresh updates or drops the slide — no client-invented Ended chrome - grill 2026-09-25 | Flip the slide to Ended locally |
| Q35 | Ended slide time row? | **Ended {closeLabel}** — keep the absolute closed stamp - grill 2026-09-25 | Hide the time row once ENDED |
| Q36 | Extended-bidding cue on the banner? | None — LIVE BIDDING + **Ends in** only; no Extended label or secondary line - grill 2026-09-25 | Quiet “Extended bidding” line or tooltip on the banner |
| Q37 | Close jump when an extension bid lands? | Recorded close (and Ends in) moves with the **same freshness as the live current bid** on the banner - grill 2026-09-25 | Countdown only on the next catalogue poll |
| Q38 | Front page image canvas and crop? | Operator canvas **2400 × 1500** (8:5), subject centred; JPEG/WebP ≤ ~400 KB. Site stage uses `object-cover` from centre; optional CDN `srcSet` — no separate mobile crop in v1 | Exact pixel match per breakpoint; forced gallery aspect; dual art-direction uploads |
| Q39 | Upcoming money on Featured and All auctions? | No starting bid (and no other money) until the lot is Active — Featured slide and All auctions card alike | Show starting bid while Upcoming |
| Q40 | How does All auctions load a long catalogue? | Infinite scroll: next batch near the end of the list; Boneyard skeleton cards while that batch settles; no pagination controls | Numbered pages; load-more button only |

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
