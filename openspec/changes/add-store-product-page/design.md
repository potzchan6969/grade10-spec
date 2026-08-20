# Design: Product pages

Capability deltas:
[`grade10-store/product-page`](specs/grade10-store/product-page/spec.md),
[`grade10-site/crawlable-pages`](specs/grade10-site/crawlable-pages/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

[`add-crawlable-public-pages`](../add-crawlable-public-pages/design.md) left
the site rendering in the browser and the build writing one document per
public address, with a worker resolving an address to one of those documents.
That design's *Request-time rendering, if it is ever wanted* section recorded
the attempt as blocked: `ssr: true` produced a worker that threw
`createRequire ... Received 'undefined'` before its first request, and getting
past it looked like it needed `@cloudflare/vite-plugin`.

**That conclusion is wrong, and this change is the counter-evidence.** The
error is real and it is where it said: `use-sync-external-store` is
CommonJS-only, arrives through `@base-ui/react`, and is in any server bundle
of this application. What the section missed is that the bundle was being
built for Node. A server build made for the worker has no `createRequire` in
it at all. The rest of that section held: the serving layer did have to be
replaced, and the worker went from 8.8 KB to 420 KB gzipped against its
predicted 439 KB.

Three facts from that foundation shape what follows.

- **A surface's address is in one table.** `src/surfaces.ts` names every
  address and derives the pattern each surface matches. A parameterised
  address is a new shape for that table, not a new table.
- **A route module is where a surface says what it is.** Identity, head tags,
  and now the read behind them.
- **The build writes a document per address it is given.** That is exactly
  what a parameterised address cannot be given, which is the whole reason
  anything here changes.

## Goals / Non-Goals

- **Goal:** a card's page is the same page whoever renders it — the worker for
  a request, the build for a document, a browser after a navigation.
- **Goal:** every crawlable-pages requirement holds for a rendered surface
  without being restated. A crawler cannot tell which surfaces were written.
- **Non-goal:** rendering what does not need it. A surface that answers at one
  address stays a file; per-request rendering costs a worker start.
- **Non-goal:** anything about what a product is. The catalogue is
  `shopify-commerce`'s; this reads what it publishes.

## Decisions

### The build writes what it can; the worker renders the rest

`ssr: true`, with `prerender` listing the surfaces that answer at one address.
Those keep their documents and are served as files, so the request path is
unchanged for them. `serveAddress` answers which document an address has, or
none; the worker serves the file, or renders. `PRERENDERED_SURFACES` and
`RENDERED_SURFACES` split the table, and `PUBLIC_SURFACES` is their sum, so a
surface cannot be public without being one or the other.

*Alternatives:* prerendering an enumerated set of slugs — rejected: the build
would have to read the catalogue, and a card added after a build would have no
page until the next one, which is the problem this change exists to remove.
Rendering every surface per request — rejected: it pays a render for three
addresses whose content changes only when a deploy does.

### A parameterised surface reads, names itself, and refuses

The route module exports a `loader` that reads the card, `meta` deriving the
head from what that read answered through `addressHead`, and an
`ErrorBoundary` that renders the not-found surface for the 404 the loader
throws. The three are the same seam: what the read found decides the page, the
head, and the status together, so none of them can describe a different card
than the others.

*Alternatives:* the worker deciding the status from the address — rejected: it
would have to know which slugs are real, which is the catalogue's to know and
only at request time. A redirect to the storefront for an unknown slug —
rejected: it answers 200 for a card that does not exist and tells a crawler
the address is real.

### The server build is built for the worker, and only when building

Three settings, all `command === "build"`:

- `ssr.target: "webworker"` with `ssr.noExternal: true` — nothing is left for
  a runtime to resolve, and the CommonJS interop stops reaching for
  `createRequire`.
- `react-dom/server` aliased to `react-dom/server.browser` — otherwise React's
  Node renderer comes along and wants `util`, `crypto`, `async_hooks`.
- `import.meta.url` defined for the server environment — `@grade10/ui`
  resolves a fixture image against it while it is being imported, and a worker
  has no module URL. Any valid base does: the browser's build rewrites that
  expression itself, and no surface the site serves renders that skeleton.

Scoping them to the build is not a detail. The dev server renders in Node,
where all three are already true and each of them breaks it — the first one
takes React's own CommonJS entry down with `module is not defined`.

*Alternatives:* `@cloudflare/vite-plugin` — rejected for now: it is the
supported path and it would own the worker's build, the dev server and the
wrangler entry, which is a larger change than the three settings it replaces.
Worth revisiting when the platform adds a second server-rendered app.
`nodejs_compat` — rejected: it supplies `createRequire`, and the argument is
still undefined.

### A cache per render

`root.tsx` mounted one module-scope `QueryClient`. Harmless while the only
server render was a build step; in a worker it is one cache shared by every
collector at once. The browser keeps its singleton across navigations, and a
server render takes a new one.

### The read is the storefront's own, published for a loader

`useProduct` already reads one product through `CatalogRepository`, and the
slice's tokens are private to it — deliberately, so nothing outside resolves a
handle it should not. A loader has no component to hold a query in, so the
slice publishes the read itself: `readProduct(handle)`, resolving the same
repository out of the same container an app installs. A fixture binding
therefore covers the loader and the hook at once, and a wire change still
fails at the datasource.

*Alternatives:* exporting `CATALOG_TOKENS` — rejected: it publishes the handle
to make any read rather than the read, and the barrel's rule is that nothing
outside imports deeper than it. A second client in the app — rejected: two
paths to one product, and the page could disagree with the grid it was reached
from. Prefetching into react-query during the render — rejected: it needs the
same access and buys a cache the document does not use.

### A dev service is handed the CAs this repo generates

A server-rendered read leaves Node for `api.<brand>.dev`, whose certificate the
root CA in `nginx/ssl/` signs. A browser trusts it because the developer
installed it; Node ships its own bundle and refuses. `pnpm dev` writes the
CAs it finds into one bundle and hands every service `NODE_EXTRA_CA_CERTS`,
beside the `NODE_OPTIONS` it already sets for the same class of reason.

*Alternatives:* `--use-system-ca` — rejected: it works only where the
developer has trusted the CA in the OS store, and the repo has the CA itself.
An internal plain-HTTP address for server-side reads — rejected: it gives the
server a different view of the platform than the browser has, which is the
thing `packages/app-env` exists to prevent.

## Risks / Trade-offs

- **The worker now runs the application.** 420 KB gzipped, and every rendered
  request runs the composition root. Only addresses with no document reach it;
  the three written surfaces are still files.
- **`@grade10/ui` needs a base for `import.meta.url`.** The workaround is a
  constant in one build config. The fix is a static import of the fixture
  image in `packages/ui`, after which the setting can go.
- **Session-shaped surfaces are now rendered per request too.** `ssr: true`
  writes no shell, so `/profile` and `/login` render in the worker with no
  session — the same state their served document always carried. Covered by
  rendering the whole site in Node in the app's own suite.
- **A refused card and a refused address answer alike.** A collector cannot
  tell a retired card from a typo. Both are honestly 404; distinguishing them
  is copy work.
- **The catalogue is now on the request path.** A card's page cannot answer
  when the store service cannot, and it answers 500 rather than a page. The
  three written surfaces are unaffected — they are files.
- **A card is in no sitemap.** Only a link leads to one, and the grid's tiles
  open a card by navigation rather than by anchor, which a crawler does not
  follow. A sitemap the worker renders is the way out, and it is its own
  change.
- **Archive order.** `grade10-site/crawlable-pages` is modified here and added
  by `add-crawlable-public-pages`, which must archive first. The branch stacks
  the same way, so the order cannot be taken by accident.

## Open Questions

None.
