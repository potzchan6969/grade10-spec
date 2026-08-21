# Product pages

**Author:** @seankcw - 2026-08-20

## Why

The store lists cards and no card has an address. A collector who finds the
slab they have been hunting can send nobody a link to it: the storefront is
one address, and what they were looking at is a position in a grid that moves
as inventory does. Search sees the same thing —
[`add-crawlable-public-pages`](../add-crawlable-public-pages/proposal.md) made
the storefront's own identity readable without scripts and left the cards
themselves out, naming this change as where they belong: "card-level indexing
belongs to the detail-page changes, where each card gets an address of its
own."

It was left out for a second reason. A card's page cannot be written when the
site is built, because which cards exist is not known then — and that change
measured request-time rendering as blocked: `ssr: true` produced a worker that
would not start, and the way out looked like a dependency this platform does
not have. That finding is wrong, and this change carries the evidence: the
worker starts, and the way out is three build settings.

**Metric:** public addresses that answer as themselves — from the site's three
surfaces to one per card the catalogue holds. **Acceptance signal:** a link to
a card unfurls with that card's own name and price rather than the
storefront's.

## What Changes

- **A card answers at its own address.** `/store/products/<slug>` serves that
  card's name, grade, certificate, price and description in the response,
  before any script runs. Every requirement of
  `grade10-site/crawlable-pages` binds it by being a public surface — its own
  title, its own description, its own `og:url`, its entry in the sitemap.
- **A surface may be rendered when it is asked for.** A surface whose address
  carries a parameter has no one document to write, so the worker runs the
  application per request. The surfaces that answer at one address are still
  written by the build and served as files; nothing about them changes.
- **An address that names no card is refused.** The catalogue is what says
  which slugs are real, and it is asked when the address is asked for — so a
  slug it has nothing for answers 404 with the site's not-found surface,
  rather than an empty product page under a 200.
- **The card comes from the storefront's own catalogue.** The read is the one
  `useProduct` makes — same repository, same container an app installs —
  published for a caller that is not a component, because a loader answering a
  request has no React to hold a query in. A product the shop adds answers at
  its address with no deploy.

## Non-Goals

- **What a product is.** `grade10-store/shopify-commerce` owns the catalogue
  and its fields; this change reads what that capability already publishes and
  adds nothing to it.
- **A sitemap that names the cards.** Which addresses the catalogue answers is
  not known when the site is built, so the sitemap keeps to the surfaces that
  are. Listing products wants a sitemap the worker renders, which is its own
  change — until then a crawler reaches a card by a link, not a listing.
- **Buying from the page.** No cart write, no checkout: the page prices every
  variant and says which are for sale, and that is all.
- **Structured data.** JSON-LD is what a product page eventually owes a search
  result, and it wants the live catalogue's fields behind it.
- **Share imagery.** Unchanged from `add-crawlable-public-pages`: no brand or
  card image asset exists to put behind `og:image`.
- **Lot detail pages.** The auction's cards get the same treatment in the
  auction's own change; this one touches no auction surface.
- **ZZZ.** That brand's store gains nothing here.

## Capabilities

### New Capabilities

- `grade10-store/product-page`: what one card's address serves — the card's
  own page, and the refusal when the catalogue has no such card.

### Modified Capabilities

- `grade10-site/crawlable-pages`: an address nested under a public surface
  answers 200 with that surface's identity *unless the surface itself refuses
  it*. Written before any surface could refuse one, the requirement now reads
  as forbidding the 404 a missing card must answer with.

## Impact

- **grade10 SPA (`apps/frontend/grade10`)** — the surface table splits into
  what is written and what is rendered, the worker gains the application built
  for the server, and the store gains a page. Its tiles open a card.
- **`@grade10/store-frontend`** — the catalog slice publishes its product read
  for a caller that is not a component. Nothing existing changes shape.
- **`pnpm dev`** — a server-rendered read leaves Node for the local proxy,
  whose certificate this repo's own root CA signs. Every dev service is handed
  those CAs, or the one fetch that fails locally is the server's.
- **This repository** — one bug to fix, not a blocker: `@grade10/ui`'s
  product card resolves its skeleton fixture image against `import.meta.url`
  while it is being imported, and a worker has no module URL. The application
  works around it with a base for the server build; a static import of the
  image removes the workaround.
- **Backend services** — none touched.
- **Deployment** — the same app deploys the same way. Its worker goes from
  8.8 KB to 420 KB gzipped, and every request it renders runs the composition
  root that used to run only in a browser.
