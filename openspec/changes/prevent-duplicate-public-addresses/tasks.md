## 1. Auction catalogue order (grade10)

- [x] 1.1 Band the public listing read: Active, then Upcoming, then Ended, each
      band ordered by close, start and close descending, ties on the lot record
- [x] 1.2 Page the banded order with a keyset cursor over band, key and record,
      so a page at a time reads in the same order as the whole catalogue
- [x] 1.3 Settle the catalogue page's own All lots and Ending soon orders on the
      lot record, so no two lots swap places between renders
- [x] 1.4 Verify: open lots lead the catalogue, each band holds its own order, a
      tie reads the same way twice, and paging to the end lists every lot once
      (`grade10-site-auction-auction-SC-19` to `SC-22`)

## 2. Addressing rules (grade10)

- [x] 2.1 Hold one item to one address: the sitemap names a card and a lot once
      per language, and no address of the other channel answers with it
- [x] 2.2 Hold narrowing to the query: an address nesting a facet, a seller or
      an order under a channel carries no narrowed reading, and two narrowings
      of one channel name the same canonical address and `og:url`
- [x] 2.3 Hold the sitemap to addresses without a query
- [x] 2.4 Hold an identity address nested under a channel to the channel's own
      identity, so no channel answers a seller of its own
- [x] 2.5 Hold a replaced address to one permanent hop, named in no rendered
      link, no canonical or `og:url` tag and no sitemap entry
- [x] 2.6 Verify: the serving suite covers
      `grade10-site-site-crawlable-pages-SC-16` to `SC-24`

## 3. Manual (grade10-spec)

- [ ] 3.1 Take the 🚧 marks off Crawlable Pages · One Address Per Thing and
      Auction · Catalogue Order once the change is deployed
- [ ] 3.2 Verify: `pnpm check:manual` names no mark this change still owes
