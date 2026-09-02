# Crawlable public pages

**Author:** @seankcw - 2026-08-18

## Why

Every address on grade10.com answers with the same empty page. The site is a
client-rendered application served as one HTML shell — a single root element,
one static `<title>Grade10</title>`, and a script tag — so a crawler that does
not execute scripts reads nothing at all: no marketing copy, no store, no
auction, no per-page title. A link shared in chat or social unfurls as the
bare word "Grade10" with no description, whichever page it points at.

That makes the public site invisible exactly where collectors would find it.
The marketing page, the store, and the auction are public surfaces meant to
bring people in, and the changes in flight — the Shopify-backed store, the
auction — assume collectors arrive. Search and shared links are how they
arrive, and today both channels see a blank page.

The card-level prize — product and lot detail pages — does not exist yet.
Writing the requirement now, over every public surface rather than a list of
today's three, means those pages inherit it the day their own changes add
them instead of re-litigating it.

**Metric:** public surfaces indexed (Search Console) — from effectively one
bare entry to every public route. **Acceptance signal:** a link to any public
surface unfurls with that page's own title and description.

## What Changes

- **Every public surface serves its own content without scripts.** A fetch of
  a public address answers with that page's title, meta description, headline,
  and static copy already in the HTML. A public surface is one that needs no
  session: today the marketing page, the store, and the auction — and every
  public surface added later.
- **Each public surface names itself.** Distinct title and description per
  surface, and the document title follows client-side navigation.
- **Shared links unfurl.** Each public surface carries Open Graph title,
  description, and URL matching the page.
- **Crawlers are told what to fetch.** The site serves a robots.txt that
  names a sitemap, and the sitemap lists exactly the public surfaces.
- **Unknown addresses answer honestly.** An address the site does not serve
  returns HTTP 404 to crawlers instead of a 200 of the empty shell, while an
  address nested under a public surface keeps answering as that surface —
  the auction's mailed lot links stay live.
- **Nothing changes visually or interactively.** The same pages, the same
  behavior once scripts run; this change is about what the first response
  already contains.

## Non-Goals

- **Indexing catalogue inventory.** The store and auction catalogues serve
  their identity and static copy; the product and lot listings themselves
  still arrive client-side. Card-level indexing belongs to the detail-page
  changes, where each card gets an address of its own.
- **Session-gated surfaces.** The profile and sign-in stay client-rendered.
  They appear in no sitemap; there is nothing on them for a crawler.
- **Structured data.** JSON-LD pays off on product and lot detail pages;
  those changes own it.
- **Share imagery.** No brand image asset exists to put behind `og:image`;
  adding one is a design change first.
- **Locale variants.** One language, no hreflang.
- **Performance targets.** Content in the first response should help first
  paint, but no performance number is a success criterion here.
- **ZZZ.** `zzz` gains nothing here; if that brand wants the same, it
  is its own change against its own surfaces.

## Capabilities

### New Capabilities

- `grade10-site/site/crawlable-pages`: what a public address serves before any
  script runs — page identity, share metadata, the crawler directory, and
  honest statuses.

### Modified Capabilities

None. `grade10-site/site/page-shell` keeps every requirement it has; this change
adds what the response contains, not what the shell renders.

## Impact

- **grade10 SPA (`apps/frontend/grade10`)** — the whole change lands here:
  the navigation route table gains each surface's identity, the build emits
  the public pages' HTML, and the serving configuration learns the route
  table's shape for statuses. All in the grade10 repository.
- **This repository** — nothing. No component, token, or shared package
  changes; no Figma frames exist or are needed.
- **Backend services** — none touched. The catalogues keep loading their
  listings from the same services after scripts run.
- **Deployment** — the web app keeps deploying as one unit; its build gains
  steps but the deploy workflow names no new app.
