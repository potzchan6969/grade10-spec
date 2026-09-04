# Design: Crawlable public pages

Capability delta:
[`grade10-site/site/crawlable-pages`](specs/grade10-site/site/crawlable-pages/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The grade10 site runs React Router in framework mode
([`adopt-react-router`](../adopt-react-router/proposal.md)). Each surface is a
route module over its page, addresses come from one table, and the router
matches them. The application still renders in the browser only: the build
emits one shell document, and the assets worker answers every address with it.

Four facts from that foundation shape everything below.

- **A route module is where a surface says things about itself.** It already
  names its address and which surface the chrome should mark. Identity is one
  more export beside those, and `meta` is the framework's own name for it.
- **The framework renders pages at build time when asked.** `ssr: false` plus
  a `prerender` list runs the real application per address and writes the
  document. Nothing about the deploy changes: still static assets from the
  same worker.
- **A route owns everything beneath it.** A trailing splat gives the auction
  its mailed `/auction/listings/<id>` links and the store its future product
  addresses. Serving must keep that promise — a plain "no file, 404" would
  break them.
- **The chrome does not wait for the session.** The `page-shell` capability
  requires the header and footer before the session resolves and forbids
  layout shift when it arrives. The session-unresolved state is therefore a
  deterministic, already-specified rendering of every public page.

## Goals / Non-Goals

Design-level only; the proposal owns product scope.

- **Goal:** a surface added later inherits the whole capability by being a
  route module — its identity, its emitted document, and its sitemap entry all
  come from the module the surface already needs.
- **Goal:** one rendering path. The served HTML comes from the same components
  the browser runs, not a parallel template that can drift.
- **Non-goal:** request-time rendering. Public content changes when a deploy
  changes it. Turning it on later is a piece of work, not a flag — see
  *Request-time rendering, if it is ever wanted* below.
- **Non-goal:** a `ui-design.md`. No Figma frame exists or is needed — the change
  alters what the first response contains, not how any surface looks.

## Decisions

### A surface's identity is its route module's

Each public route module exports its title and description as a plain record,
and its `meta` derives the head tags — title, description, and the Open Graph
trio — from that record and the module's own address. The record is what the
build reads for the sitemap and the prerender list; `meta` is what the
framework renders, in the served document and after every client-side
navigation alike. The document title following navigation costs nothing: it is
what `meta` does.

*Alternatives:* one identity table in the navigation module, keyed by route id
— rejected: it splits what a surface is across two files and needs its own
compile-time guarantee that every route appears, which the route module gives
for free by being the thing that exists. A per-page head-management component
— rejected: pages stay framework-free, and this is what route modules are for.

### The framework emits the pages

`prerender` lists the public addresses; the build runs the real application at
each one and writes its document. What is rendered is the session-unresolved
state the `page-shell` spec already defines, so the served markup and the first
client render agree by specification, and the browser hydrates rather than
rendering from an empty root.

*Alternatives:* a custom build script rendering the app per route — rejected:
it is the unsupported twin of a supported feature, and the reason
`adopt-react-router` was worth doing first. Inject per-route meta into the
shell at the edge — rejected: it satisfies link unfurls but serves an empty
body, so the headline-and-copy requirement fails and script-less crawlers still
index nothing. A separate static site for marketing — rejected: it splits one
site across two architectures and two deploys.

### Serving resolves addresses the way the router does

The assets worker gains a thin layer in front of it that matches an address
against the application's own route config: an address nested under a public
surface serves that surface's prerendered document with status 200; an address
under no surface serves the shell with status 404, and the application renders
its not-found surface as it already does. It matches through the router's
matcher over the shared route config, not a second table, so serving and the
application cannot disagree.

*Alternatives:* keep the single-page fallback — rejected: every unknown address
answers 200 with the marketing shell's identity, a soft-404 that undermines the
metric, and a nested auction address unfurls as the marketing page. Plain
file-based 404 handling — rejected: it breaks the mailed lot links and every
future detail address the day it ships.

### Browser globals move behind the render

Prerendering runs the application outside a browser, so a `window` read at
module scope or during render crashes the build. Those reads move to where the
framework already supplies the answer — the router for the address, an effect
for anything else — which is also what keeps the served markup and the
hydrating render identical.

*Alternatives:* guard each window read where it stands — rejected: the next
one added reintroduces the crash; moving them makes the category
unrepresentable.

## Risks

- **Hydration drift.** If the served markup and the first client render
  disagree, the browser re-renders from blank and the "scripts only add"
  scenario fails. The discipline is mechanical — render the specified
  session-unresolved state and nothing else — and the scenario's test is the
  guard.
- **A future surface skipping the list.** A route module without an identity
  fails to compile; the prerender list and the sitemap derive from the same
  records, so the remaining gap is a public surface nobody marked public. The
  sitemap's "nothing else" scenario is what catches it.

## Request-time rendering, and what it took

Measured against the delivered change, then done in
[`add-store-product-page`](../add-store-product-page/design.md), which a card's
page needed: its content is not known when the site is built.

`ssr: true` alone builds a worker that does not start:

```
Uncaught TypeError: The argument 'path' must be a file URL object, a file URL
string, or an absolute path string. Received 'undefined'
  at node:module:34:15 in createRequire
```

The bundle carries a CommonJS shim, `createRequire(import.meta.url)`, and
`import.meta.url` is undefined in a Workers bundle. It is there for
`use-sync-external-store`, which is CommonJS-only and arrives through
`@base-ui/react` in the design system, so it is in any server bundle of this
application.

What removes it is building the server bundle for the worker rather than for
Node — `ssr.target: "webworker"` with everything bundled, React's web renderer
named rather than its Node one, and a base for the module URL `@grade10/ui`
resolves a fixture image against. No new dependency;
`@cloudflare/vite-plugin` is the supported path and remains worth taking when
a second application server-renders.

The rest of the bill stands. The serving layer had to be replaced: it resolves
an address to a prerendered document, and `ssr: true` writes no shell, so the
404 answer has no document either. The worker goes from 8.8 KB to 420 KB
gzipped, and every rendered request runs the composition root and the session
read that here run only in a browser.

None of that argues against the non-goal *for these surfaces*. Public content
on the marketing page, the store and the auction changes when a deploy changes
it, so their documents are still written by the build and served as files.
