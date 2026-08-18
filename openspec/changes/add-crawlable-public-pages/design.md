# Design: Crawlable public pages

Capability delta:
[`grade10-site/crawlable-pages`](specs/grade10-site/crawlable-pages/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The grade10 site ships today as a client-rendered application: one HTML shell
with an empty root element, served for every address by an assets-only worker
whose not-found handling falls back to that same shell. The application
renders entirely in the browser — the root is created client-side, the
address is read from the browser's location, and the dependency container is
built at module load.

Three existing facts shape everything below.

- **The route table is already the one place addresses are named.** The SPA's
  navigation module holds every route as a typed table; links, pages, and the
  session redirect all compile against it, and the surface-to-page map is
  exhaustiveness-checked against the same ids.
- **A route owns everything beneath it.** The auction's mail links at
  `/auction/lots/<id>` and the store will grow product addresses; the routing
  spec and tests already promise a nested address answers as its section.
  Serving must keep that promise — a plain "no file, 404" would break mailed
  links.
- **The chrome does not wait for the session.** The `page-shell` capability
  requires the header and footer before the session resolves and forbids
  layout shift when it arrives. The session-unresolved state is therefore a
  deterministic, already-specified rendering of every public page.

## Goals / Non-Goals

Design-level only; the proposal owns product scope.

- **Goal:** one table drives everything — titles, descriptions, the emitted
  pages, the sitemap, and the serving statuses all derive from the existing
  route table, so a surface added later inherits the whole capability by
  extending one typed record.
- **Goal:** one rendering path. The served HTML comes from the same
  components the browser runs, not a parallel template that can drift.
- **Non-goal:** request-time rendering. Public content changes when a deploy
  changes it; nothing here renders per request.
- **Non-goal:** a `ui.md`. No Figma frame exists or is needed — the change
  alters what the first response contains, not how any surface looks.

## Decisions

### Public pages are rendered at build time, and the browser takes over

The build renders each public surface through the real application — shell,
page, head tags — and emits one HTML document per route. The browser hydrates
that document instead of rendering from an empty root. What is rendered is
the session-unresolved state the `page-shell` spec already defines, so the
served markup and the first client render agree by specification.

*Alternatives:* inject per-route meta into the shell at the edge — rejected,
it satisfies link unfurls but serves an empty body, so the headline-and-copy
requirement fails and script-less crawlers still index nothing. Render at
request time at the edge — rejected, it forces a per-request story onto code
that is browser-shaped (location reads, a module-scope container) for content
that only changes at deploy; the cost buys nothing until per-card detail
pages exist, and that change can revisit it. A separate static site for
marketing only — rejected, it splits one site across two architectures and
two deploys.

### One route identity table

The route table gains a title and description per surface, typed so a route
without an identity fails to compile — the same guarantee the table already
gives links and pages. The document title follows navigation by reading this
table; the build emits head tags, the sitemap, and robots.txt from it. The
copy lives in the application beside the rest of the site's copy.

*Alternatives:* a per-page head-management component — rejected, it scatters
the identity across pages and adds a runtime dependency for values that are
static per route; the compile-checked table already exists.

### Serving learns the route table's shape

A thin serving layer in front of the static assets resolves an address the
same way the application does: an address nested under a public surface
serves that surface's document with status 200; an address under no surface
serves the shell with status 404, and the application renders its not-found
surface as it already does. It shares the application's route table rather
than restating it, so the two cannot disagree.

*Alternatives:* keep the single-page fallback — rejected, every unknown
address answers 200 with the marketing shell's identity, a soft-404 that
undermines the metric, and a nested auction address unfurls as the marketing
page. Plain file-based 404 handling — rejected, it breaks the mailed lot
links and every future detail address the day it ships.

### The address is read through one seam

Build-time rendering supplies the address being rendered; in the browser the
same seam reads the real location. Window reads that today happen at module
scope or during render move behind that seam, which is also what keeps the
served markup and the hydrating render identical.

*Alternatives:* guard each window read where it stands — rejected, the next
window read added reintroduces the crash; one seam makes the category
unrepresentable.

## Risks

- **Hydration drift.** If the served markup and the first client render
  disagree, the browser re-renders from blank and the "scripts only add"
  scenario fails. The discipline is mechanical — render the specified
  session-unresolved state and nothing else — and the scenario's test is the
  guard.
- **A future surface skipping the table.** Mitigated by construction: a
  route cannot be added without an identity, and the emitted pages and
  sitemap derive from the same table.
