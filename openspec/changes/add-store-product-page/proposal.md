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

**Metric:** public addresses a crawler is offered — from the site's three
surfaces to one per card the catalogue holds. **Acceptance signal:** a link to
a card unfurls with that card's name and grade rather than the storefront's.

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
- **The catalogue behind it is a stand-in.** Three fixture cards, in one
  module the page reads through. Everything above that module — the address,
  the head, the refusal, the sitemap — is the real thing.

## Non-Goals

- **The live catalogue.** Reading cards from the store service belongs to
  `grade10-store/shopify-commerce`, which owns what a product is. This change
  ends at the module that answers "which card is this slug".
- **Linking cards from the storefront.** The grid's tiles still go nowhere; a
  collector reaches a card by its address or the sitemap. The link arrives
  with the live catalogue, where a tile knows its slug.
- **Buying from the page.** No cart write, no checkout. The action on the page
  is inert.
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

- **grade10 SPA (`apps/frontend/grade10`)** — the whole change lands here: the
  surface table splits into what is written and what is rendered, the worker
  gains the application built for the server, and the store gains a page and
  the module standing in for its catalogue.
- **This repository** — one bug to fix, not a blocker: `@grade10/ui`'s
  product card resolves its skeleton fixture image against `import.meta.url`
  while it is being imported, and a worker has no module URL. The application
  works around it with a base for the server build; a static import of the
  image removes the workaround.
- **Backend services** — none touched.
- **Deployment** — the same app deploys the same way. Its worker goes from
  8.8 KB to 420 KB gzipped, and every request it renders runs the composition
  root that used to run only in a browser.
