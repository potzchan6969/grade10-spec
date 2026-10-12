## Feature set

- Lot address
  - Server-rendered lot page: the lot's name, description, sale and bidding
    standing are in the response HTML before any script runs
  - One lot per address: two lot addresses answer with their own lot, their own
    title, meta description and `og:url`
- Shared link preview
  - Open Graph per lot: `og:title`, `og:description` and `og:url` name that lot
    and its own canonical address rather than the auction catalogue
- Unknown lot refusal
  - Catalogue decides: whether an id names a published lot is asked of the
    catalogue at the moment the address is asked for
  - Not-found answer: an address naming no published lot answers 404 with the
    site's not-found surface, never an empty lot page
- Live lot handover
  - Served content persists: once scripts run the same lot is on screen and
    nothing it showed is replaced by a loading placeholder
  - Clock values carry on: a value that follows the clock continues from what
    was served rather than contradicting it
- Watching a lot
  - Watch from the page: a collector marks the lot they are reading, and nothing else on the page moves
  - Watching a lot - the control acts on the addressed lot
  - Watching a lot - watching changes nothing else on the page
  - After bidding, Watching stays locked
  - Closed lot has no watch control
- Catalogue and sitemap
  - Opened from the catalogue: the catalogue reaches a lot's own address
    without a page load
  - Lots in the sitemap: every lot the catalogue holds is listed when the
    sitemap is fetched, and none is an unfilled parameter
- Live lot updates
  - Without a reload: another page's accepted bid, an extension or a close
    shows with the new price, bid count and close
  - Own standing follows: when the lot's version rises, the page reads the
    viewer's own standing again, so Outbid shows without a reload while live
    updates stay anonymous
  - Polling fallback: a page that cannot hold a live line still catches up
- One service clock
  - Service time: the countdown runs on the auction service's clock, whatever
    the device's clock says
  - Probed again: after sleep, a reconnect or a return to the tab, and a
    correction under a second never makes the countdown jump up
  - Rounds up: the last second never reads 0 while the lot takes bids
- Close and result
  - Closed until recorded: past the close, the page shows the existing Closed
    state with no result until the close is recorded
  - Result from the record: Won, Did not win or Unsold comes from the recorded
    result, never from the page's own clock
  - Existing words only: Extended bidding for an extension, and a bid refused
    past the close in the bid form's own words
- Recent bids outcome
  - Winner after close: a closed sold lot crowns its winning public row; a live lot crowns none
  - Equal-max tip: a public row tied on amount with a row above it carries the earlier-leads tip
  - Avatar letter: each public Recent Bids avatar uses the email-derived letter from the public listing and live payloads; the readable label stays Bidder N
- Public identifier
  - Code-backed address: the canonical address ends in the lower-case listing
    code, without exposing a separate listing-code field or a code-only route
  - Title stays the reference: a collector and support continue to identify
    and quote a lot by its title and its address, exactly as before the
    listing code existed
  - Called-off address: the original slug becomes available for reuse; an
    eligible new holder answers there, otherwise the address is not found

