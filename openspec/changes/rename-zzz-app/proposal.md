**Author:** @seankcw - 2026-08-19

## Why

`apps/frontend/zzz-store` is named for a storefront it does not contain. The
app serves home, sign-in, and a profile; the store surfaces `store-frontend`
publishes are not assembled into it. Every engineer who opens the directory
has to learn that its name describes a plan rather than the code, and the
in-flight `add-zzz-navigation` and `add-account-profile` changes both add
surfaces to it that make the name less true again.

The name also disagrees with itself downstream: the directory says
`zzz-store`, the package says `@grade10/zzz-store-spa`, and the worker says
`zzz-store-web`, while `apps/frontend/grade10` — the same assembly for the
other brand — is simply `grade10`, `@grade10/grade10-spa`'s counterpart, and
`grade10-web`. One brand's SPA reads as a site and the other's reads as a
storefront, for no difference in what they are.

**Metric:** ZZZ SPA identities that name the app rather than a product it
does not ship — from zero of four to four of four.
**Acceptance signal:** `apps/frontend/zzz`, `@grade10/zzz-web-spa`, the
`zzz-web` worker and the `zzz-web` dev service agree with grade10's shape,
and `pnpm dev --only=zzz-web` still serves the app.

## What Changes

- **The app is renamed to what it is.** `apps/frontend/zzz-store` becomes
  `apps/frontend/zzz`, `@grade10/zzz-store-spa` becomes
  `@grade10/zzz-web-spa`, and the Cloudflare worker `zzz-store-web` becomes
  `zzz-web` — exactly the shape grade10 already has, where the directory
  names the brand (`apps/frontend/grade10`) and the package, worker and dev
  service name the site role (`@grade10/web-spa`, `grade10-web`, `web`).
- **The dev service is renamed with it.** `pnpm dev --only=zzz-store`
  becomes `--only=zzz-web`.
- **The documentation follows.** `AGENTS.md`, the handbook, the
  multi-product architecture note, and the `react-clean-architecture` skill
  all name the app.
- **Nothing moves.** The app keeps answering at `store.zzz.*` in every
  environment: the site registry, the wrangler routes, the nginx vhost, and
  the browser-storage namespace are untouched.

## Non-Goals

- **The address.** ZZZ stays on `store.zzz.com`, `store.zzz.9jokes.com`, and
  `store.zzz.dev`. Moving the site to the brand's base domain is
  `move-zzz-to-base-domain`, planned and parked; this change deliberately
  leaves the site registry alone so that one stays a registry edit.
- **The `storageNamespace`.** It stays `zzz-store` — it keys a browser's
  storage against an origin that is not moving, so renaming it would evict
  state for no gain. `move-zzz-to-base-domain` renames it when the origin
  does change.
- **The ZZZ backends.** `zzz-store-service` and the `stg-/prd-zzz-store`
  databases keep their names: ZZZ genuinely runs a store service.
- **What the app shows.** No surface, component, or route changes.

## Capabilities

None. This is a rename: no requirement changes, so no spec does either.
`.openspec.yaml` sets `skip_specs: true`.

## Impact

- **`apps/frontend/zzz-store` → `apps/frontend/zzz`** — directory, package
  name, worker name; `pnpm-lock.yaml` regenerates.
- **Root `package.json`** — the `build` script names the directory.
- **`.github/workflows/deploy.yml`** — the ZZZ SPA deploy step names the
  directory; `scripts/deploy/components.mjs` derives from the dev registry
  and needs no edit, but `pnpm run check:libs` guards the seam.
- **`scripts/dev/services.mjs`, `scripts/dev/preflight.mjs`** — the service
  entry and the moved-app map that reports leftover state at the old path.
- **Docs** — `AGENTS.md`, `docs/architecture/multi-product.md`,
  `docs/architecture/handbook.html`,
  `.claude/skills/react-clean-architecture/SKILL.md`.
- **Untouched** — `packages/app-env`, the nginx vhost, the wrangler routes.
