## Context

`apps/frontend/grade10/src/surfaces.ts` is the one table every reader of an
address goes through: the route modules, the prerender list, the worker in
front of the built assets, the chrome, the crawler files and the serving lab.
It declares a `kind` per surface, and `dev` already means "only a dev server
answers this" — the same shape this change needs on a second axis, decided per
deploy environment rather than per command.

Three readers sit outside Vite's module graph and cannot read
`import.meta.env`: `vite.config.ts`, `react-router.config.ts`, and the plugin
that writes `robots.txt`. `apps/admin/grade10/src/routes.ts` already solves
that for the console's Dev pages by calling `resolveDeployEnv()` from
`@grade10/app-env/node` and passing the environment in.

`packages/app-env` holds `launched(brand, deployEnv)` — production with the
storefront served at its live address. It reads `false` on every lane today,
because `SERVED_AT` puts grade10's web site on the preview stage in
production, so it answers a different question and cannot be the gate here.

## Goals / Non-Goals

**Goals:**

- One declaration of which surfaces wait on the shop, read by every consumer
  of the surface table
- The gate resolved once per build, so a build that does not carry the store
  has no store route, no store document and no store page code in it
- One line to move when the shop opens

**Non-Goals:**

- A registry entry in `packages/app-env`. No other brand or application asks
  which pages a build of this site holds
- Any change to the store's own behaviour, data layer or components
- Removing the i18n keys the front door's store card uses; the card still
  renders where the store is carried

## Decisions

### The table declares the gate; the environment answers it

`grade10-site/site/carried-surfaces` says a build carries a surface or it does
not, and names the store set. The table is where that set already lives, so
an entry gains an optional gate and the derivations follow it:

```ts
type Gate = "store";
export type Gates = Record<Gate, boolean>;

export const gatesFor = (deployEnv: DeployEnv): Gates => ({
  store: deployEnv !== "production",
});
```

`gatesFor` lives in `surfaces.ts` beside the table — a pure function of the
environment, with a type-only import, so the module still pulls in nothing at
runtime and the Node-side readers can call it. Opening the shop is this one
line.

`SERVED_PATTERNS`, `PRERENDERED_SURFACES`, `RENDERED_SURFACES` and
`PUBLIC_SURFACES` become functions of `Gates` rather than constants.
`DEV_SURFACES` stays as it is: it keys on `kind`, and the labs are a command's
question rather than an environment's.

**Rejected:** a second `kind`. `kind` says how a surface is served —
prerendered, rendered, session — and the store's surfaces keep all three. A
`kind` of `store` would lose that, and the prerender list would stop knowing
which store surfaces have a document to write.

**Rejected:** a runtime check in each page. That ships every store page to the
public and leaves the refusal one mistake from being skipped; it also cannot
keep `/store/index.html` out of `dist/client`, where the assets answer ahead
of the worker.

### Each reader takes the gate from the source it can read

| Reader | Where it runs | Source |
| --- | --- | --- |
| `src/routes.ts` | Build config | `gatesFor(resolveDeployEnv())` |
| `react-router.config.ts` | Build config | `gatesFor(resolveDeployEnv())` |
| `src/serving/serveAddress.ts` | Worker and browser | `config.gates` |
| `src/routes/sitemap.ts` | Worker | `config.gates`, passed into `sitemapUrls` |
| `src/chrome/*`, `src/root.tsx`, pages | Browser | `config.gates` |

`src/config.ts` gains `gates: gatesFor(deployEnv)` beside the stage and the
deploy environment it already parses — the application's own flag, folded by
the bundler because `deployEnv` is a build constant.

`src/serving/crawlerDirectory.ts` is imported by `vite.config.ts`, so it may
not reach `config`. Its `publicAddresses` takes the carried prerendered
surfaces as an argument, the way it already takes the site and the target, and
`routes/sitemap.ts` supplies them.

`src/locale/addresses.ts` and `src/surfaceHead.ts` are left alone. Both are
read by build config, and both answer questions about the whole table — which
public surfaces have a per-language address, and which surface has a title and
a description. A surface the build does not carry is never asked, and keeping
the compile-time completeness check over the whole table is what stops a
surface shipping nameless the day the shop opens.

**Rejected:** threading `Gates` through `addresses.ts`. It would make
`hasVariants` answer differently per lane for no reader, and would force
`react-router.config.ts` and `routes.ts` to agree on a gate twice.

### What the chrome and the front door drop

Each already has a way to render nothing, so none of them grows a branch of
its own beyond the gate:

- `src/chrome/siteContent.ts` — `NAV_LINKS` loses its store entry, and
  `SHOP_COLUMN_LEAD` and the footer's shop column are absent, where the store
  is not carried
- `src/chrome/useShopColumn.ts` — returns no column rather than a heading over
  one link, so the collections read never runs
- `src/root.tsx` — `cartEnabled` is already false off the store and the
  checkout; with neither carried it is false everywhere, so `SiteShell` gets
  no `onCartClick` and `CartDrawerHost` never mounts. `page-shell` already
  requires a control with no surface behind it to be absent
- `src/pages/marketing/MarketingPage.tsx` — the store button and the store
  card are not rendered
- `src/pages/profile/ProfilePage.tsx` — `onViewOrders` is already optional;
  the route stops passing it

## Risks / Trade-offs

- **[Risk] A store page slips into `dist/client` and the assets answer it
  ahead of the worker** → `react-router.config.ts` reads the same `gatesFor`
  the route table does, and a build check asserts no store address has a
  document under `dist/client` when the gate is shut.
- **[Risk] The route table and the worker disagree, so an address renders but
  is refused, or is refused but renders** → both derive from
  `SERVED_PATTERNS(gates)`, and `serveAddress` is tested at both gate
  settings.
- **[Risk] The test suites read the module-scope lists and silently test one
  lane only** → the lists become functions, so every existing call site has to
  name a gate setting, and the suites cover both.
- **[Risk] Search engines hold store addresses for `grade10.com` that start
  answering 404** → that is the intent. `robots.txt` already answers
  `Disallow: /` on the preview lane, so nothing new is being offered; the
  existing entries are dropped on the crawler's own schedule.
- **[Trade-off] The front door loses a third of its cards on the public lane**
  → accepted. The alternative needs copy nobody has written.

## Migration Plan

No data, no schema, no deploy order. The change lands on the next deploy of
the site, and rolling back is deploying the previous build. Opening the shop
is a one-line change to `gatesFor` and a deploy.
