## Context

The site's documents are one set of bytes for every request: prerendered
surfaces are served by the assets ahead of the worker, and a rendered lot is
the same document whoever asks. A per-request region verdict therefore cannot
live in the document without ending that. The services the browser calls see
the request itself, with the edge's `cf.country` and `CF-IPCountry`.

## Goals / Non-Goals

- **Goal** - One list of restricted regions, read by every service that judges
- **Goal** - The services refuse on their own; the page only decides what it shows
- **Non-goal** - A served restriction document, `451` status or edge redirect

## Decisions

- **The list** - `AUCTION_RESTRICTED_REGIONS`, `observedRegion` and
  `auctionsOfferedIn` in `@grade10/app-env`. `observedRegion` reads
  `request.cf.country`, then `CF-IPCountry`, and treats a missing, malformed
  or `XX` value as no signal; no signal is offered auctions.
- **The auction service** - its tRPC context carries `region`; an
  `offeredProcedure` rung refuses the public catalogue, lot, campaign,
  category and featured reads with `FORBIDDEN` and counts
  `auction.region.refused`. The live lot and catalogue sockets refuse a
  restricted upgrade with `403 region`. `public.availability` answers
  `{ offered }` to every region.
- **The store's auction router** - its context carries `region`; an
  `auctionsOffered` middleware refuses lot reads, enrollment, bids, watches,
  standings and the bid record before the auction service is called, and
  counts `store.auction.region_refused`. Winner-order procedures, unwatch and
  alert mutes keep their rungs. ZZZ's store deploys the same router.
- **The site** - the catalogue port gains `readAvailability`;
  `useAuctionAvailability` asks once per page load and reads `offered` until
  answered or on failure. `SiteShell` drops the Auction nav item and the My
  Auctions handler, the marketing page and store hero drop their auction ways
  in, and `AuctionsOffered` answers the catalogue, a lot, My Auctions and the
  bidding history with `AuctionRestrictedPage`.

## Risks / Trade-offs

- **A flash of auction chrome** - a restricted collector sees the Auction
  item until the availability read answers; the services refuse every act
  meanwhile
- **A rendered lot's head** - the lot's document is the same for every
  request, so a restricted visitor's document still names the lot; the page
  body answers the restriction page once scripts run
