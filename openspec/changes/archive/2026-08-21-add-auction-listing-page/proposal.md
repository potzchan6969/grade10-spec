**Author:** @seankcw - 2026-08-21

## Why

A collector who shares a lot — into a group chat, a forum thread, a DM — is
sharing the catalogue. The link unfurls as "Auctions", with the catalogue's
own title, description and preview image, so whoever receives it cannot tell
which lot was meant, what it stands at, or whether it is still open. The
share reads as an advert for the sale rather than an invitation to a lot, and
the person who sent it has to type the lot's name in alongside the link for it
to mean anything.

The same address answers a crawler the same way, so no lot can be found as
itself: a search for a card by name reaches the catalogue at best, and the
catalogue does not say the card is in it. Lots are the inventory collectors
search for by name, and none of them is reachable that way today.

Worse, a lot link the auction no longer holds still answers 200 with the
catalogue. A collector following a link to a lot that was pulled is told the
address is fine and left to work out for themselves that the lot is gone.

The serving lab is where this reads plainly: fetch a lot address and it
reports the auction's document, with the auction's identity, whatever id the
address carries.

**Metric:** the share of opens of a shared lot link that arrive on that lot's
own page, and the count of lot addresses entered from search — both zero
today by construction.

## What Changes

A lot's address becomes a public surface of its own, the way a card's address
already is.

- A lot address answers with that lot: its name, its copy, the sale it runs
  under and where its bidding stands, in the response before any script runs.
- A shared lot link unfurls as that lot — its own title, description and
  canonical address — rather than as the catalogue.
- An address under the auction's lots naming no published lot is refused with
  status 404 and the site's not-found surface, instead of answering 200 as the
  catalogue.
- `crawlable-pages` gains the precedence that makes this true: a surface owns
  every address beneath it *unless* a nested surface names that address, in
  which case the nested one answers. Its nested-address scenario is currently
  written on the lot link as its example, and that example now belongs to the
  lot.
- `navigation` gains the same precedence for what renders in the browser.
- The sitemap requirement is restated as what it already is in practice: it
  lists the surfaces the build writes a document for. A lot, like a card, is
  not one of them — which addresses the auction answers is the catalogue's to
  say, not the build's.

## Non-Goals

- **Listing lots in the sitemap.** Doing so needs a sitemap the worker renders
  from the catalogue; that is separate work, and cards are waiting on the same
  thing.
- **Per-locale lot addresses.** `add-site-localization` already rules that a
  surface rendered when its address is asked for carries no address of its own
  per locale.
- **Anything about bidding.** What a bid must clear, when it extends a close,
  and how an authorization is held are `grade10-auction/auction`'s and do not
  move.
- **The catalogue page itself.** How the auction lists its sales and lots is
  unchanged; only what a lot's own address answers with changes.
- **Refusing an unpublished lot differently per reason.** A lot the catalogue
  will not show is refused; saying *why* it is gone is not in scope.

## Capabilities

### New Capabilities

- `grade10-auction/listing-page`: what one lot's address serves — the lot's own
  page before scripts run, what a shared link unfurls as, the refusal when the
  auction holds no such lot, and how a lot is reached from the catalogue.

### Modified Capabilities

- `grade10-site/crawlable-pages`: a nested surface takes precedence over the
  surface above it, so the nested-address requirement no longer resolves a lot
  link to the auction; and the sitemap lists the surfaces the build writes a
  document for rather than every public surface.
- `grade10-site/navigation`: the same precedence for address resolution in the
  browser — a deeper address answers as the nested surface that names it, not
  the surface above.

## Impact

The grade10 site's table of addresses, the worker that serves its documents,
and the route module behind a lot; the auction frontend's listing slice, which
gains a read a route can make before rendering. No backend, contract, schema
or wrangler change.

Implementation already exists, unmerged, in draft PR #67 on
`feat/auction-listing-surface` — this change is the requirements it should
have been written against, and reviewing the two together is the point.
