# Design: Adopt React Router

Capability delta:
[`grade10-site/site/navigation`](specs/grade10-site/site/navigation/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The grade10 SPA routes by hand today: a typed route table names the five
surfaces, a hook mirrors the address bar into state and listens for
`popstate`, a document-level click listener turns same-origin anchors into
history navigations, and the application maps a resolved surface to a page
with an exhaustiveness check. It works, is tested, and is about to be
extended by every change in flight — and it makes each of them hand-build
address parsing, code loading, and identity.

`add-crawlable-public-pages` raises the stakes: its design decides
build-time rendering through the real application, one route identity
table, and one seam for reading the address. Those are the load-bearing
parts of a routing framework, planned as custom build scripts.

## Goals / Non-Goals

- **Goal:** one migration, then every future page is a route module — the
  next surface costs a module and a table row, not new machinery.
- **Goal:** the behaviors the hand-rolled router established survive by
  specification, not by luck: the `navigation` capability pins them and the
  existing `page-shell` scenarios stay green throughout.
- **Non-goal:** request-time rendering now. The framework keeps it one
  configuration change away; the card-level detail pages decide.
- **Non-goal:** a `ui-design.md`. No layout changes; the two collector-visible
  wins are behaviors the spec carries, not screens to draw.

## Decisions

### React Router v7, framework mode

The application adopts `react-router` through the `@react-router/dev` Vite
plugin: a root module, one route module per surface, generated route types.
Framework mode — not the library alone — because the machinery this site
needs next is exactly what that mode ships: per-route code splitting by
default, per-route `meta` for identity, build-time prerendering
(`ssr: false` + a `prerender` list), and typed hrefs replacing the
hand-rolled table's compile-time guarantee.

*Alternatives:* library mode (`createBrowserRouter` as a dependency) —
rejected: the crawlable change would still hand-build prerendering, head
management, and the address seam, so the site would carry a router and the
custom machinery both. TanStack Router — rejected: strong typing but its
prerendering story arrives through TanStack Start, a heavier commitment
with a younger Workers deployment story than React Router's first-class
one. Keep the hand-rolled router — rejected: every change in flight extends
it by hand, and the crawlable change rebuilds a framework's worth of build
tooling around it.

### Build-time now, request-time later by flag

`ssr: false` with every public surface prerendered keeps the deploy what it
is today — static assets from the same worker — and renders the
session-unresolved state the `page-shell` spec already defines. When
card-level detail pages need per-request answers, `ssr: true` plus loaders
is a recorded configuration path on the same route modules, not a second
migration. This supersedes nothing in the crawlable change's requirements;
it replaces that change's custom emit-HTML build step with the framework's.

*Alternatives:* prerender via a custom build script rendering the app per
route (the crawlable design's original shape) — rejected here for the same
reason framework mode won above: it is the unsupported twin of a supported
feature.

### Route modules stay thin; pages stay where they are

A route module names its address, its identity (title, description — the
crawlable change's table becomes these `meta` exports), and lazily imports
its page from `src/pages/`. Pages, features, and the DI container do not
move; the shell keeps its one return path by living in the root module's
layout. The session correction renders the corrected surface and replaces
the address, exactly as specced — a redirect decided client-side from
session state, not a loader.

*Alternatives:* pages as route modules directly — rejected: it couples page
code to the framework's export conventions and moves files the
`frontend-structure` convention places, for no behavior.

### The chrome's anchors keep one interception seam

`Nav` and `Footer` render plain anchors from hrefs; the framework's `Link`
never appears inside design-system components. The existing document-level
click seam stays, delegating matched same-origin clicks to the router's
navigate and leaving modified clicks, downloads, targets, and foreign
origins to the browser — resolved against the router's own matcher so the
seam and the route table cannot disagree.

*Alternatives:* a `renderLink` injection on the design-system chrome —
rejected: it widens a cross-product component contract (`shared-ui`) for
what one application can do at its own edge. Full page loads for chrome
links — rejected: the `navigation` capability forbids it, and it would
regress what ships today.

### Feature packages stay router-free

`packages/*/frontend` imports no router. Pages read params and location
through the framework and hand features props and callbacks, the seam the
application repository's clean-architecture convention already draws.
The shared feature packages serve both brands and the admin panels — a
router import in one would bind every consumer to one application's
routing choice, and the admin panels run none.

*Alternatives:* letting features read `useParams` directly — rejected: it
binds shared packages to one application's routing choice and breaks their
router-less consumers and tests.

## Risks

- **Build coupling.** The app's build becomes the framework plugin's. The
  framework is the ecosystem default with a stable v7 line; the route
  modules themselves are plain React, so the exposure is the build seam,
  not the pages.
- **Seam drift.** The click interception must match addresses the way the
  router does. Mitigated by resolving through the router's matcher rather
  than a second table; the capability's scenarios are the guard.
- **Prerender drift.** Served markup disagreeing with the first client
  render re-renders from blank. This risk belongs to
  `add-crawlable-public-pages` and is unchanged by who emits the HTML; its
  "scripts only add" scenario stays the guard.
