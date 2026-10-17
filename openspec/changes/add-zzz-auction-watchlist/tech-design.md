## Context

ZZZ's site carries home, sign-in and the profile. Its store backend deploys
the shared store router, whose `auction.*` procedures already proxy watch,
unwatch, the watch list and a listing read to the shared auction service
over ZZZ's own entrypoint, which keeps ZZZ's watches apart from Grade10's.
ZZZ's gateway routes no auction catalogue.

## Decisions

- **Surfaces** - two: `/auction/listings/<listing id>` and
  `/auction/watching`. A listing is named by its id because the store's
  listing read takes one; ZZZ publishes no catalogue to resolve a slug.
- **Port** - `zzzAuctionProcedureClient` answers the auction package's
  procedure port from the store's tRPC client: watch, unwatch, the watch,
  the watch list, alert mutes, standing and the record. Bidding, enrollment,
  history and winner orders refuse with an error naming ZZZ. The catalogue
  port refuses every read the same way.
- **Composition** - the container loads the auction core module and the
  watches module only. The listing page composes `ListingLotHeader` and
  `useWatch`; the watched list composes `AuctionRecord` with `useMyWatches`
  and `useUnwatchListing`. Copy comes from the shared Korean
  `auctionListing`, `auctionWatchlist` and `auctionRecord` namespaces.
- **Way in** - the profile links the watched list; there is no catalogue to
  link a listing from yet.

## Risks / Trade-offs

- **No listing image** - images are served by the auction service's public
  media route, which ZZZ's gateway does not route; rows and the listing page
  draw none until ZZZ carries the catalogue
