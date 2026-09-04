# Design: rename the ZZZ app

No capability delta — this is a rename (`skip_specs: true`).
Motivation: [proposal.md](proposal.md) — Why.

## Context

Four names identify one SPA, and grade10 shows the shape they take: the
directory names the brand (`apps/frontend/grade10`) and the package, worker
and dev service name the *site role* it serves, with the brand dropping out
of the default brand's names — `@grade10/web-spa`, `grade10-web`, and the
`web` dev service. A second brand keeps its prefix.

ZZZ carries `zzz-store` in all four instead, naming a product it does not
have: `apps/frontend/zzz-store/src/pages/` holds `home`, `sign-in`, and
`profile`, and nothing assembles the surfaces `@grade10/store-frontend`
publishes.

The site the app answers at is a separate registry
(`packages/app-env/src/sites.ts`), which is why the two can be decided
apart: `BRAND_SITES.zzz` is `["store"]` and stays that way here.

## Goals / Non-Goals

**Goals:**

- The four names agree, and they say brand + site role, as grade10's do.
- The later address move is a registry edit and a route edit, with no
  rename tangled into it.
- No behavior changes at all — the same bytes serve at the same host.

**Non-Goals:**

- A `ui-design.md`. Nothing a collector sees changes.
- Touching `packages/app-env`. The one seam that would make this change
  behavioral is the one it must not cross.

## Decisions

### The worker is renamed even though its route is not

`zzz-store-web` becomes `zzz-web` while it keeps answering at
`store.zzz.com`. A worker names the app that deploys it — `grade10-web` is
`apps/frontend/grade10`, not a claim about its hostname — and the route is
wrangler config sitting beside it. Renaming now means the address move later
edits a route and nothing else, and the worker carries its deploy history
across that move instead of being replaced by a differently-named one.

The rename is free because neither `zzz-store-web-staging` nor
`zzz-store-web-production` has ever been deployed: every ZZZ database in
`neondb/registry.sh` is `TODO` and both ZZZ zones are unregistered
placeholders (`docs/architecture/multi-product.md`, *Open*). Nothing has to
be deleted from Cloudflare, and no deploy history is lost because none
exists.

*Alternatives:* keep `zzz-store-web` until the address moves, so the name
matches the host — rejected: it names the worker after a hostname rather
than an app, which is not how any other worker here is named, and it buys a
second rename later. Rename the worker *and* its route now — rejected: that
is the address move, which is not planned.

### `storageNamespace` stays `zzz-store`

The prefix on every browser-storage key keeps its value. It is scoped to an
origin, and the origin is not moving; renaming it would orphan whatever
local state exists and buy nothing, since no collector reads it. It moves in
whichever change moves the origin, where the eviction becomes correct
rather than gratuitous.

*Alternatives:* rename it here for consistency with the other three names —
rejected: it is not an identity, it is a storage key, and changing a storage
key is a behavior change in a change that promises none.

### The dev service is `zzz-web`, not `zzz`

`scripts/dev/services.mjs` renames its entry to `zzz-web`, matching
grade10's `web`. Naming it plain `zzz` would collide with the `zzz` brand
*preset* in the same file, which selects every ZZZ service; `--only=zzz`
resolves the preset first, so the frontend would become unselectable on its
own.

### The dev service and the nginx vhost part company

The vhost file stays
`store.zzz.dev`, because `scripts/setup-nginx.sh` reads the *hostname* off
the filename to sync `/etc/hosts`, and the hostname is not changing.

The two disagreeing is the honest state: the app is `zzz-web` and it answers
at `store.zzz.dev`. The vhost is renamed when that stops being true.

*Alternatives:* rename both — rejected: it would point `/etc/hosts` and the
proxy at a host the app is not served at, breaking local dev outright.

## Risks / Trade-offs

- **A reader meets `apps/frontend/zzz` serving `store.zzz.com` and assumes
  the rename is half-done** → `docs/architecture/multi-product.md`'s *Open*
  item already records ZZZ as a storefront on a subdomain awaiting the
  grade10 shape; task 2.2 keeps it open and says which half is done, so the
  gap reads as known rather than forgotten.
- **A stale `.dev.vars` or `.wrangler` left at the old path** → task 2.3
  adds the entry to `preflight.mjs`'s `OLD_APP_HOMES`, which is the existing
  mechanism for exactly this and already carries
  `apps/frontend/grade10-store`.
- **The deploy workflow and the app registry drift** → `pnpm run check:libs`
  fails when a `deploy:*` script no workflow step runs, and
  `scripts/deploy/components.mjs` asserts workflow parity on every dispatch.

## Migration Plan

One group, one commit, no sequencing: the rename lands whole or not at all,
because a directory moved without its package name is a broken workspace.
Rollback is `git revert` — nothing is deployed, no data moves, no
registry changes.
