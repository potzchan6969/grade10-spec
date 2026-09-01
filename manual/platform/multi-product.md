---
title: Multi-Product Assembly
order: 1
---

How several products share one repository so a new product is an assembly job, not a rebuild. Grade10 runs on `grade10.com`; ZZZ is the second brand. A feature is shared code, not a shared obligation: store and auctions run for both brands, the loyalty program for Grade10 alone. App data within each product follows [Account Data](/platform/account-data).

## Boundaries

### One product = one domain = one auth worker = one user base

- The session cookie's scope is the product's registrable domain, never broader
- Sessions never cross products; a person using two products holds two unrelated accounts
- Cross-product account linking is a product decision to record before building — nothing here assumes it
- The one exception is the shared auction service, where users of both products bid on the same unit as anonymous rivals ([Auction Service](/platform/auction-service))

### Code is the only shared thing

Every row exists once per product and is never shared; sharing any of them would leak users, sessions, data, or branding across brands.

| Boundary | Grade10 | ZZZ |
| --- | --- | --- |
| Session cookie domain | `.grade10.dev` / `.grade10.com` | `.zzz.dev` / `.zzz.com` |
| Auth worker + `BETTER_AUTH_SECRET` | `grade10-auth` | `zzz-auth` |
| Trusted origins (credentialed API access) | grade10 apps only | zzz apps only |
| Identity database | `stg-/prd-grade10-auth` | `stg-/prd-zzz-auth` |
| Session KV namespace | grade10-auth's `CACHE` | zzz-auth's `CACHE` |
| App databases | `grade10_store`, `grade10_loyalty` in `stg-/prd-grade10` | `zzz_store` in `stg-/prd-zzz` |
| Loyalty worker + program config | `grade10-loyalty` | none — ZZZ runs no loyalty program |
| Google OAuth client | grade10's (committed ID) | ZZZ's own, once created (empty ID keeps Google off) |
| Email sender + catalog | `no-reply@grade10.*`, `@grade10/i18n` | `no-reply@zzz.*`, `apps/backend/zzz/auth/src/i18n.ts` |
| Storefront theme | `.theme-grade10` | design-system baseline (own theme with `external/zzz-spec`) |
| Admin theme | `grade10AdminTheme` (`@grade10/frontend-admin-theme`) | Astryx's base theme |

### The admin consoles render their own vocabulary

The storefronts render the design system. The admin renders **Astryx**
(`@astryxdesign/core`, pinned at an exact `0.5.0`), composed into the blocks
`@grade10/frontend-console` publishes, and every admin surface composes those
blocks rather than the runtime.

- The two consoles differ by the theme their root applies and by nothing else.
  Grade10 applies `grade10AdminTheme`, which carries `themes/grade10.css`'s
  values in Astryx's token names; ZZZ applies Astryx's base theme, matching the
  fact that it has no brand overlay of its own
- The design system stays in both applications for one reason: the shared
  two-factor block is `@grade10/ui`'s and customer surfaces render it too, so
  it keeps one definition and the applications still compile its classes. That
  is the whole of the design system's reach into the admin, and the two
  `@source` entries in each `index.css` are what it amounts to
- Adding a brand's admin panel means a theme, not a restyle: the blocks carry
  no brand, so a new console is `apps/admin/<brand>` applying a theme of its
  own — or Astryx's base one until that brand has an overlay
- Nothing here is a precedent for the storefronts. They keep the design system,
  the Figma sync, and the audit rail, which deliberately exclude the admin

### Two things are deliberately shared

- The tail worker and Datadog: operator-side observability for the same team, not user data
- The auction service: what crosses brands is the auction event, bid amounts, and per-auction pseudonyms — never identity, sessions, cookies, trusted origins, or money ([Auction Service](/platform/auction-service))

## Assembly

### A product backend is assembly, not code

- Every behavior lives in the product-shaped lib; the app holds only what is product-specific
- `@grade10/auth-backend` owns better-auth configuration, the Postgres schema, `/dev/login`, and the AUTH_SERVICE RPC surface
- `apps/backend/<product>/auth` holds a few-line `index.ts` calling `createAuthWorker`, `src/i18n.ts` naming the product's catalog, a `wrangler.jsonc` with the product's domains, cookie domain, trusted origins, Google client ID and bindings, the migrations regenerated from the shared schema, and generated types
- `@grade10/loyalty-service` ([Loyalty Service](/platform/loyalty-service)) and `@grade10/store-service/worker` are the same shape: the app is an `index.ts` calling the factory plus its own wrangler config, migrations, and generated types
- A feature written once in the lib reaches every product on its next deploy
- `apps/backend/grade10/auth` is the reference instantiation; both products carry the behavior test suite, so each product's config and migrations stay proven

### A brand contributes a function, never a flag

- grade10 passes an `orderEventSink` that spends into loyalty; ZZZ passes none
- The factory never branches on a brand flag

### Design systems are product-owned; features are shared as logic, not pixels

- Each product brings its own spec submodule (`external/<product>-spec`) publishing the same package contract: a design system and an i18n catalog
- Shared code in `packages/*` never imports a design system or a catalog
- Where shared code needs one (login emails), the product injects it (`AuthWorkerConfig.emailCatalog`) — there is no default
- Product SPAs own all presentation; the logic they wrap (`@grade10/auth-contracts`, `@grade10/worker`, domain code) is identical across products
- "Identical features" means the same flows and guarantees, not the same pixels

### Names follow the brand

- Backends: `apps/backend/<brand>/<service>` — `grade10/{auth,store,auction,loyalty,api}`, `zzz/{auth,store,api}`
- SPAs: `apps/frontend/<app>` — `grade10` (that brand's whole site at its base domain: marketing, `/login`, `/profile`, `/store`, `/auction`), `zzz` (that brand's whole site, still answering at `store.zzz.*`). An SPA is named for the site it serves, not its directory: `@grade10/web-spa`/`grade10-web` and `@grade10/zzz-web-spa`/`zzz-web`.
- No brand ships a standalone sign-in gate: each app hosts its own page
- Merged admin panel: `apps/admin/<brand>`
- Shared logic groups by product concern at `packages/<domain>`, plus flat brand-neutral infra
- Local dev domains: `*.<brand>.dev`

## Adding a product

Each step's reference implementation exists twice (grade10, zzz):

1. **Spec submodule** — add `external/<product>-spec`, add its packages glob to `pnpm-workspace.yaml`; mint a deploy key for the submodule, add its `SUBMODULES_DEPLOY_KEY_<REPO>` secret, and give `.github/actions/setup-workspace` one more input and `add_key` block (`docs/deployment.md` step 1)
2. **Auth worker** — scaffold `apps/backend/<product>/auth` from `apps/backend/grade10/auth`: product wrangler.jsonc, `src/i18n.ts`, drizzle config pointing at `packages/grade10-auth/backend/src/schema.ts`, `pnpm run db:drizzle:generate`, copy the identity spec suite, register in the deploy workflow
3. **Apps** — product backends bind AUTH_SERVICE to the product's auth worker; session middleware and the tRPC ladder come from `@grade10/worker` unchanged; app data follows `account-data.md`
4. **SPAs** — scaffold the product's site at `apps/frontend/<product>` from `apps/frontend/grade10`, restyled with the product's design system; the imported logic stays the same
5. **Admin** — add the brand's merged panel at `apps/admin/<product>`, derived from `apps/admin/grade10`; it composes every product's admin sections as brand-owned view code
6. **Local dev** — `*.<product>.dev` certificate and vhosts (`nginx/README.md`), service entries including the brand's API gateway in `scripts/dev/services.mjs`, new pinned ports and inspector ports
7. **Databases** — add the brand's projects (shared and auth) to `neondb/registry.sh`, declare each backend's target and database in its `src/db/targets.sh`, regenerate the auth migrations into the new app (`neondb/README.md`)
8. **Deployment** — per-product OAuth client, KV namespace and Hyperdrive config ids, worker secrets — all fresh resources, never reused from another product (`docs/deployment.md`)

## Q & A

- Why is the package scope `@grade10/*` when a second product lives here?
  - It is repository branding, not product branding; renaming is a mechanical workspace-wide find/replace — do it when it hurts, not now.
- Can ZZZ run a loyalty program later?
  - Yes — `@grade10/loyalty-service` takes a program per product, so it is the same assembly `apps/backend/grade10/loyalty` is: config, bindings, migrations. It runs none today because a program is a product decision to make, not a stub to maintain.
- Why does dev boot start every service when two products is fifteen services?
  - `--only=` already narrows (e.g. `--only=zzz-auth,zzz-store-service,zzz-web`); revisit only if boot time actually hurts.

## Open

- ZZZ's site still answers on a subdomain rather than its base domain. The app is no longer named for a storefront it does not have — `apps/frontend/zzz`, `@grade10/zzz-web-spa`, `zzz-web` — but its routes still point at `store.zzz.*`. Moving them is `BRAND_SITES.zzz`/`BRAND_STOREFRONT.zzz` in `packages/app-env/src/sites.ts`, the wrangler routes, the nginx vhost and the `storageNamespace`, and it waits on the zones below
- `external/zzz-spec` does not exist yet — until it lands, ZZZ's email copy lives at `apps/backend/zzz/auth/src/i18n.ts` and zzz SPAs import `@grade10/design-system` with no theme class (baseline theme, no branding either way); both move when the submodule lands
- ZZZ's staging (`*.zzz.9jokes.com`) and production (`*.zzz.com`) hostnames are placeholders until the zones are registered; Google sign-in stays off until ZZZ's own OAuth client exists
- The frontend-preview workflow builds every SPA regardless of which one a PR touches — narrow it per family when previews start being used in anger
