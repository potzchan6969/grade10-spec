## ADDED User journeys

### grade10-site-auction-auction-US-06: Collector reads Featured on the catalogue

**As a** collector opening `/auction`,
**I want** the operator's Featured slides when any are set — front page image
(stage and slab), title, status chrome by lot status, relative Ends in /
Opens in countdown, money on Active only (none on Upcoming until open), and
Bid Now or View Auction —
**so that** the lots the house leads with are what I meet first.

### grade10-site-auction-auction-US-07: Collector advances Featured slides

**As a** collector on `/auction` with more than one Featured slide,
**I want** to move between slides with the progress control, and on a small
viewport also with stage previous/next or a horizontal swipe (hidden when only
one slide), including mixed Active and Upcoming in one set,
**so that** I can reach every curated lot without leaving the band.

### grade10-site-auction-auction-US-08: Collector opens a Featured lot

**As a** collector on a Featured slide,
**I want** Bid Now when the lot is Active, or View Auction when it is Upcoming
(or Ended if still shown), to open that lot's details page,
**so that** I land on the lot the catalogue led with.

### grade10-site-auction-auction-US-09: Collector watches from an All auctions card

**As a** signed-in collector reading All auctions,
**I want** the watch control on a card to watch or unwatch that lot the same
way as on the lot page and My Auctions,
**so that** I do not learn a second watch rule on the catalogue.

**Leans on:** `grade10-site-auction-watchlist-US-01`,
`grade10-site-auction-watchlist-US-02`.

### grade10-site-auction-auction-US-10: Collector sees a live Featured bid and clock

**As a** collector on an Active Featured slide,
**I want** the current bid to roll when it increases after first paint, and
Ends in to follow the recorded close with the same freshness (including when
extended bidding moves that close), without an Extended label on the banner,
**so that** the lead band matches the live sale without lot-page chrome.

## MODIFIED User journeys

### grade10-site-auction-auction-US-05: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the lots I can bid on, soonest to close
first, and to keep that order as I read on — below Featured when Featured is
present, with no category section, loading more by infinite scroll with
skeleton cards while the next batch settles, and with no money on Upcoming
cards until those lots open —
**so that** what I can still bid on is in front of me and reading further never
shows me a lot twice or skips one.
