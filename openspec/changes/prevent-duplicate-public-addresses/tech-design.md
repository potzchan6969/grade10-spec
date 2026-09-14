## Context

The grade10 site serves its documents from `apps/frontend/grade10/src/serving/`,
with every address it answers declared once in `src/surfaces.ts` and the router
built from that table. Narrowing already rides the query: the listing is one
surface read with `?collection=`, `?worlds=`, `?types=`, `?q=` and `?sort=`,
and the head builder takes its canonical address from the path alone. The
shop's own `/products/:handle` and `/collections/:handle` already answer with a
301 into the site's addresses. The rules this change writes therefore mostly
hold today; what is missing is anything that keeps them holding.

The auction catalogue is the exception. Its public read orders published,
closed and settled lots together by `endsAt` ascending, so an ended lot — whose
close is in the past — sorts ahead of a live one. The catalogue page hides this
by fetching every page and re-sorting the lot of them in the browser, which
leaves the order right on screen, wrong through the API, and wrong for anything
that reads one page.

## Goals / Non-Goals

**Goals:**

- The addressing rules are held by tests, not by construction
- The auction catalogue answers in its resting order, one page at a time, with
  a total order that holds across reads
- The order the collector sees is the order the catalogue answered with

**Non-Goals:**

- A seller surface or a marketplace channel — neither exists to bind
- Store listing order — `default-listing-sort-to-latest` owns it
- Reworking the catalogue page's client-side sort control

## Decisions

**One sortable key, not three ordered columns.** The order is expressed as the
external lot status ranked `1` for Active, `2` for Upcoming and `3` for Ended,
plus one signed key: the close for Active, the start for Upcoming, and the
negated close for Ended, so every status ascends. `ORDER BY rank, key, id` is
then one direction over three values, and the keyset cursor is a row comparison
over that same triple — the shape the browse already uses for `(endsAt, id)`.
Ordering by three columns with mixed directions would need a cursor predicate
per status and a different one at each boundary between them.

**The rank is derived in the query, never stored.** `grade10-site/auction/lot-status`
defines the external lot status as worked out from the lot and never saved, so
the rank is a `CASE` over status, `startsAt` and `endsAt` against the read's
own clock. A stored rank would have to be swept as lots open and close, and
would be wrong between the sweep and the read.

**The page keeps its own sort, and its ties settle on the lot record.** The
catalogue page offers All lots and Ending soon and sorts what it fetched. The
alternative — deleting the client sort and rendering the server's order —
is rejected while the page still fetches every page to count and filter
in the browser: the control would then have nothing to act on. Making both
client orders settle ties on the lot id is what the spec's total order needs,
and it is what stops two lots swapping places between renders.

**Tests hold the addressing rules where the rules live.** The serving tests
already cover the sitemap, the canonical link and the 404 answers; the rules
this change writes are added to them rather than to a new suite, because the
table in `surfaces.ts` is the only place an address can be added, and a test
beside it is the one a new channel's author will see.

## Risks / Trade-offs

- **This order needs its own index.** `(status, endsAt)` and `(endsAt, id)`
  cannot start an ordered scan over a derived rank. At today's catalogue size
  the planner sorts a few hundred rows and nobody notices; the trigger for an
  expression index on the sort key is the catalogue passing a few thousand
  published lots, and it is recorded here rather than added now
- **A lot's status moves under a reader.** A lot that opens or closes between
  two page reads changes status, so a keyset walk can show it twice or not at
  all.
  This is true of every time-ordered keyset and is why the spec's paging
  scenario is written against a catalogue read inside one clock
- **Nothing yet refuses a second channel.** No item can be published twice
  today because the store and the auction hold their own stock, so the rule is
  covered by a test that no second address answers rather than by a guard at
  publication. The guard belongs with whatever first lets one item reach two
  channels
