## User journeys

### grade10-site-auction-auction-US-05: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the lots I can bid on, soonest to close
first, and to keep that order as I read on — below Featured when Featured is
present, with no category section, loading more by infinite scroll with
skeleton cards while the next batch settles, and with no money on Upcoming
cards until those lots open —
**so that** what I can still bid on is in front of me and reading further never
shows me a lot twice or skips one.

### grade10-site-auction-auction-US-01: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### grade10-site-auction-auction-US-02: Collector places a bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

### grade10-site-auction-auction-US-04: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the lot closes.

### grade10-site-auction-auction-US-11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

### grade10-site-auction-auction-US-12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.

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

### grade10-site-auction-auction-US-13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a lot,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the lot keeps a leader and I never pay more than the price stood at before.

### grade10-site-auction-auction-US-14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** a refused bid to say why on the bid form and to leave no trace anywhere else,
**so that** I never read a bid I did not place as one I did.

## Retired

- `grade10-site-auction-auction-US-03` - Retired by refused-bid-is-not-a-bid.
