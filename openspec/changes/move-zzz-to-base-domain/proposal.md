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
- **The app is renamed to what it is.** `apps/frontend/zzz-store` becomes
  `apps/frontend/zzz`, `@grade10/zzz-store-spa` becomes `@grade10/zzz-spa`,
  and the Cloudflare worker `zzz-store-web` becomes `zzz-web` — the same
  shape `apps/frontend/grade10` and `grade10-web` already have.
- **The `zzz-store` spec product becomes `zzz`.** It holds no capabilities
  yet, so the rename costs a directory and the in-flight
  `add-zzz-navigation` change that was about to write its first.

## Non-Goals

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
- **`apps/frontend/zzz-store` → `apps/frontend/zzz`** — directory, package
  name, worker name, wrangler routes, browser-storage namespace.
- **`apps/admin/zzz`, `apps/backend/zzz/*`** — the workspace dependency
  name only; no behavior.
- **Dev environment** — `scripts/dev/services.mjs`, the nginx vhost
  (`store.zzz.dev` → `zzz.dev`; the existing certificate already covers the
  base domain), `/etc/hosts` via `scripts/setup-nginx.sh`.
- **Deployment** — `.github/workflows/deploy.yml` and the root `build`
  script name the app directory; `scripts/deploy/components.mjs` derives
  from the dev registry and needs no edit. Two Cloudflare workers
  (`zzz-store-web-staging`, `zzz-store-web-production`) are retired.
- **Docs** — `AGENTS.md`, `docs/architecture/multi-product.md` (the open item
  closes), `docs/architecture/handbook.html`, `docs/deployment.md`,
  `.claude/skills/react-clean-architecture/SKILL.md`.
- **This store** — `openspec/specs/zzz-store/` → `openspec/specs/zzz/`,
  the product list in `openspec/config.yaml`, and the in-flight
  `add-zzz-store-navigation` change, renamed `add-zzz-navigation`.
