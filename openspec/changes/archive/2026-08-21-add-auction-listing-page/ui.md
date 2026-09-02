# UI: A lot's page

## Screens

**No new screen.** The lot's page was delivered by `add-grade10-auction` and
its layout does not change here — this change moves which address serves it
and what the document carries, not what is on it. No Figma frame is linked for
it in this store; if one is drawn later it replaces nothing planned here.

The not-found surface a refused lot shows is the site's existing one, owned by
`grade10-site/site/page-shell`.

## Components

Every export the page composes already exists. **Nothing new is needed from
grade10-spec, so no task below carries design work.**

From `@grade10/ui`:

- `ListingBidPanel` — the lot's name (rendered `as="h2"`, so it is the page's
  headline), its standing, and the bidding controls.
- `ListingGallery` — the lot's images.
- `ListingDetails` — the lot's facts and copy.

From `@grade10/design-system`:

- `VStack` — the page's stacking.
- `Text` — the copy, the labels, and the refusal lines.
- `Link` — back to the auction, and home.
- `List`, `ListItem` — the bid history.

Money is formatted through `@grade10/utils/money` from minor units and a
currency code, never from a float.

## States

- **A lot** — `A lot answers whole`. The lot's name, its copy, the sale it
  runs under and where its bidding stands, all rendered from the read that ran
  before the page did.
- **A lot, once scripts run** — `The served lot stays on screen`. The same
  content, still on screen, now live. Nothing served is replaced by
  `ListingPageSkeleton`.
- **Time remaining** — `A value that follows the clock carries on`. Rendered
  from the instant the page was rendered at, then ticking. It does not change
  shape when scripts take over.
- **No such lot** — `An id the catalogue publishes no lot for`. The site's
  not-found surface, inside the site chrome, under a 404 — not the auction
  catalogue.
- **A lot the catalogue will not show** — the view's existing unpublished
  line, with a link back to the auction.
- **No loading state on a lot's own address.** The read finishes before the
  page renders, whether the address was fetched or navigated to, so there is
  no moment where the page is on screen without its lot.
  `ListingPageSkeleton` stays for callers that render the view with no lot in
  hand — the package's own demo — and is not reached from the site.
