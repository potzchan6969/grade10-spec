# Adopt React Router

**Author:** @seankcw - 2026-08-18

## Why

Every page this site is about to grow needs an address of its own, code of
its own, and a place in the site's navigation. Four changes in flight add
surfaces — the account page, the auction and its lot links, the
Shopify-backed store, and the card-level detail pages two of them defer —
and each would extend navigation machinery the application hand-rolls today:
a route table, an address-bar hook, a document-level click seam, all grown
link by link.

Collectors pay for that machinery's limits now. A collector opening the
marketing page downloads the store's and the auction's code with it, and
every surface added makes that first visit heavier. Back and forward forget
where on a page a collector was. And `add-crawlable-public-pages` plans
build-time rendering, per-surface identity, and one address seam as custom
build scripts — three things a routing framework ships as supported,
documented machinery, with request-time rendering left as a configuration
change for the day card detail pages want it.

Adopting the framework once, while the site is five surfaces, costs one
contained migration. Adopting it after those changes land means migrating
every one of their pages too.

**Metric:** script bytes downloaded on a first visit to the marketing page —
from the whole site's code to that page's share, and no longer growing with
each surface added. **Acceptance signal:** opening any surface downloads
only that surface's page code, and Back returns the collector to where they
were.

## What Changes

- **The site's routing becomes React Router in framework mode.** Each
  surface becomes a route module over its existing page; the hand-rolled
  navigation machinery retires. Nothing changes visually and every
  page-shell behavior keeps.
- **Address behavior becomes a capability.** Which surface an address
  resolves to, how the session corrects an address, and what a client-side
  navigation preserves are today promised only by the application's tests.
  They become requirements, so the migration is checkable and every future
  page inherits them.
- **Two collector-visible wins land with the migration.** A surface loads
  only its own code, and navigation keeps the collector's place — Back and
  forward return to where they left.
- **`add-crawlable-public-pages` derives from this foundation.** Its
  requirements stand word for word; its design and tasks realign to the
  framework's build-time rendering and per-route identity instead of custom
  build scripts.

## Non-Goals

- **Request-time rendering.** Public pages stay rendered at build time. The
  framework makes serving per request a configuration change plus per-route
  loaders; the design records that as the path for card-level detail pages,
  and their changes decide.
- **Data loading through the router.** Loaders, pending states, and route
  errors for live data are each page's own change to adopt.
- **New surfaces.** The five addresses the site answers today, no more.
- **ZZZ and the admin panels.** Neither runs a router; their navigation is
  their own concern, and nothing here binds them.
- **Feature packages touching the router.** `packages/*/frontend` stays
  router-free — pages read the address and pass props, as the application
  repository's conventions already require.

## Capabilities

### New Capabilities

- `grade10-site/navigation`: which surface an address resolves to, how the
  session corrects a session-decided address, what a client-side navigation
  preserves, and what code a surface loads.

### Modified Capabilities

None. `grade10-site/page-shell` keeps every requirement it has, and the
in-flight `grade10-site/crawlable-pages` delta is untouched — only that
change's delivery plan realigns.

## Impact

- **grade10 SPA (`apps/frontend/grade10`)** — the implementation lands here
  whole: the build adopts the framework's Vite plugin, each surface becomes
  a thin route module over its existing page, and the hand-rolled navigation
  module retires. Two dependencies arrive: `react-router` and
  `@react-router/dev`.
- **This repository** — one task group: realign
  `add-crawlable-public-pages`'s design and tasks to this foundation. No
  component, token, or shared package changes.
- **Backend services** — none touched.
- **Deployment** — the web app keeps deploying as one unit of static assets
  from the same worker; the build's output shape is the framework's, the
  workflow names no new app.
