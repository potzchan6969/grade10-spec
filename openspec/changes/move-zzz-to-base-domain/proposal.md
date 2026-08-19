**Author:** @seankcw - 2026-08-19

## Why

ZZZ's site is called a storefront and lives at `store.zzz.*`, and neither is
true any more. The app serves home, sign-in, and a profile — an identity
surface with no store in it — so a collector who types `zzz.com` reaches
nothing, and every address the brand issues has to carry a subdomain that
names a product the site does not have. `add-zzz-navigation` is about to
give those three surfaces addresses, and `add-account-profile` is about to
give ZZZ an account page; both would be planned against a name and a host
that are already wrong.

The repository has said so itself for some time.
`docs/architecture/multi-product.md` carries it as an open item — *"ZZZ still
runs one storefront on a subdomain rather than a whole site; it takes the
grade10 shape when it has more than a store to show"* — and grade10 already
went the other way before it shipped: `grade10-store-web` and
`grade10-loyalty-web` never existed, because the storefront and the loyalty
SPA became one site at the brand's base domain first. ZZZ is at exactly that
point, and it is at it cheaply: every ZZZ database in `neondb/registry.sh` is
still `TODO` and both ZZZ zones are unregistered, so nothing has shipped that
a move would disturb.

**Metric:** ZZZ addresses that survive the brand growing a second product —
from zero (every one is under `store.`) to all of them.
**Acceptance signal:** `zzz.com` serves the ZZZ site, a saved
`store.zzz.com` link lands on the same page, and a ZZZ sign-in mail links to
the base domain.

## What Changes

- **BREAKING** **The ZZZ site moves to the brand's base domain.** `zzz.com`,
  `zzz.9jokes.com`, and `zzz.dev` serve the site that `store.zzz.*` served.
  The brand runs one site, as grade10 does.
- **The retired storefront address forwards.** `store.<base>` answers a
  permanent redirect to the same path at `<base>`, so a saved or shared link
  still lands.
- **Every address the platform derives for ZZZ follows.** The sign-in mail
  link, the checkout return, and the push subject all read
  `storefrontUrl` from `packages/app-env`, so they move with the registry
  and not by hand.
- **The browser-storage namespace follows the origin.** The prefix on every
  ZZZ storage key becomes `zzz`; the origin change is what makes evicting
  the old keys correct rather than gratuitous.

## Non-Goals

- **Renaming the app.** `rename-zzz-app` already made the directory
  `apps/frontend/zzz`, the package `@grade10/zzz-spa`, and the worker
  `zzz-web`. This change edits that worker's routes; it renames nothing.
- **A storefront.** Nothing about what the site *shows* changes: home stays
  the signed-out landing, and the day ZZZ has products to sell, that change
  decides what `/` and `/store` answer. This change moves an address and a
  name, not a surface.
- **ZZZ's navigation.** `add-zzz-navigation` owns which address resolves to
  which surface. This change decides only which host those addresses hang
  under.
- **Registering the zones.** `zzz.com` and `zzz.9jokes.com` are still
  unregistered placeholders. This change points the routes at them; standing
  the zones up is the deployment step it unblocks, not a task it performs.
- **A ZZZ design system.** `external/zzz-spec` still does not exist and this
  does not bring it forward.
- **Renaming the ZZZ backends.** `zzz-store-service` keeps its name: it is
  the store *service*, which ZZZ genuinely runs, and its databases
  (`stg-/prd-zzz-store`) keep theirs.

## Capabilities

### New Capabilities

- `zzz/site-address`: where the ZZZ site answers, what becomes of the
  address its storefront used to hold, and which host the platform names
  when it issues a ZZZ link.

### Modified Capabilities

None. `zzz-store/navigation` is renamed to `zzz/navigation` in the
in-flight `add-zzz-navigation` change rather than modified here — it has no
requirements recorded yet.

## Impact

- **`packages/app-env`** — `sites.ts` is the whole behavioral change:
  `BRAND_SITES.zzz`, `BRAND_STOREFRONT.zzz`, and the `store` site id.
  Every consumer derives from it, so nothing else names a host.
- **`apps/frontend/zzz`** — the wrangler `routes` per environment, and the
  browser-storage namespace in `src/config.ts`.
- **Dev environment** — the nginx vhost (`store.zzz.dev` → `zzz.dev`; the
  existing zone certificate already covers the base domain) and `/etc/hosts`
  via `scripts/setup-nginx.sh`.
- **Cloudflare** — a Redirect Rule per ZZZ zone; the zones themselves have
  to be registered first.
- **Docs** — `docs/architecture/multi-product.md` (the open item closes),
  `docs/architecture/handbook.html` (the host each ZZZ node shows), and
  `docs/deployment.md`.
