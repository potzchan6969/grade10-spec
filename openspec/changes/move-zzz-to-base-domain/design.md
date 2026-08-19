# Design: ZZZ on its base domain

Capability delta: [`zzz/site-address`](specs/zzz/site-address/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

`packages/app-env/src/sites.ts` is the platform's one host table. It holds a
`SiteId` vocabulary (`web` | `store`), the subdomain each id sits under
(`web` is `null` — the base domain itself), the sites each brand runs, and
which of a brand's sites its shoppers are sent to. Everything downstream
derives: wrangler routes, the vite dev host, the CORS rule, the sign-in mail
link, the VAPID subject, the store fixtures' origin. Today grade10 runs
`["web"]` and ZZZ runs `["store"]`, which is the entire reason ZZZ answers
at `store.zzz.*`.

Nothing about ZZZ is provisioned. Every ZZZ target in `neondb/registry.sh`
is `TODO`, and `docs/architecture/multi-product.md` records both ZZZ zones as
placeholders "until the zones are registered". The move is therefore a
registry edit and a rename, not a migration of live traffic — the same
position grade10 was in when `grade10-store-web` and `grade10-loyalty-web`
were collapsed into `grade10-web` before either shipped
(`docs/deployment.md`, *Retired workers*).

The session cookie is already held on `.<base>` for the whole brand
(`cookieDomain` in `packages/app-env/src/domains.ts`), so moving a site
between hosts inside the zone does not touch identity.

## Goals / Non-Goals

**Goals:**

- One edit decides the address. Everything that names a ZZZ host keeps
  deriving from `sites.ts`, so this change is auditable by reading one file.
- The two brands' SPAs become structurally identical — same directory shape,
  same package-name form, same worker-name form, same site id — so the
  `react-clean-architecture` reference applies to both without a caveat.
- The move is reversible by the same one edit, right up until the zones are
  registered.

**Non-Goals:**

- A `ui.md`. Nothing a collector sees changes: the same app, the same three
  surfaces, at a different host. No component, token, or frame moves.
- Renaming the ZZZ *services*. `zzz-store-service` and the
  `stg-/prd-zzz-store` databases keep their names — ZZZ genuinely runs a
  store service; what it does not run is a store *site*.

## Decisions

### The `store` site id is removed, not left unrun

With ZZZ on `["web"]`, no brand runs `store`, so it comes out of `SiteId` and
out of `SITE_SUBDOMAIN`. The multi-site machinery stays exactly as it is —
`BRAND_SITES`, `BrandSite<B>`, `siteUrls`, `BRAND_STOREFRONT`, and the
`null`-means-base-domain encoding in `siteHost` are all untouched — so
giving a brand a second site is again three lines of data: a union member, a
subdomain, and a list entry.

The point of the registry is that `BRAND_SITES` is the fact and `SiteId` is
the vocabulary; a vocabulary word no fact uses is a host the codebase claims
to serve and does not. Leaving it also has a concrete cost: `BrandSite<"zzz">`
would still narrow to `"web"`, so nothing could call `siteHost` with it
except through a cast, and the subdomain branch would be reachable only from
a test that lies about the registry.

*Alternatives:* keep `store` as a declared-but-unrun id, on the argument that
ZZZ may split a storefront out again later — rejected: re-adding it is
cheaper than carrying a false entry, and the change that splits a storefront
out is the change that should decide its subdomain. Collapse the registry
entirely now that both brands run one base-domain site — rejected: that
deletes the mechanism rather than the entry, and a platform with two brands
and a growing product list will need a second site again.

### The retired host redirects at the zone, not in a worker

`store.<base>` answers a 301 to the same path at `<base>` through a
Cloudflare **Redirect Rule** on each ZZZ zone — dashboard configuration
recorded in `docs/deployment.md`, beside the DNS and provider registrations
that repository already owns. No worker is deployed, and no code in this
repository is kept alive for a host that serves no application.

*Alternatives:* keep `zzz-store-web-*` deployed with a redirect handler —
rejected: a whole app, a build, a deploy step, and a name in every registry,
to emit one header. Add a `main` script to the new SPA's assets worker and
route the old hostname to it — rejected: it gives the SPA worker a code path
that exists only to answer a host it is not for, and `apps/frontend/*` are
assets-only by convention. Do nothing, on the evidence that the zones were
never registered — rejected by the change's author: the redirect is cheap
insurance against a link that exists somewhere the repository cannot see, and
a permanent redirect is the honest answer for a moved address regardless.

**Note for whoever executes it:** the evidence says both ZZZ zones are
unregistered and no ZZZ database is provisioned, so this rule is very likely
protecting nothing. It is one rule per zone and it costs nothing to keep, but
if the zones turn out never to have existed, record that in
`docs/deployment.md` rather than leaving a rule nobody can explain.

### The rename follows the address, in one commit per seam

Directory, package name, and worker name all move together with the route,
because the repository's naming rule ties them: an SPA directory names the
site it serves, `@grade10/<app>-spa` names the directory, and the worker
names the app. Splitting them would leave a window where
`apps/frontend/zzz` publishes `@grade10/zzz-store-spa` at `store.zzz.com` —
three names disagreeing, and the exact confusion this change exists to end.

The Cloudflare worker rename is free for the same reason the address move is:
`zzz-store-web-staging` and `zzz-store-web-production` were never deployed.
They join the *Retired workers* list in `docs/deployment.md` alongside
`grade10-store-web`, which that list already describes as having "never
existed".

*Alternatives:* rename the directory only and leave the package and worker —
rejected: it breaks the rule that the three agree, which is the only thing
making the layout navigable. Keep `zzz-store-web` and change only its route
— rejected: a worker named for a storefront serving a brand's whole site is
the same lie one layer down.

### `storageNamespace` moves too, and the eviction is the point

`apps/frontend/zzz/src/config.ts` prefixes every browser-storage key with
`zzz-store`; it becomes `zzz`. Existing keys are orphaned, which on a brand
with no registered zone means nothing, and which — if any local state does
exist — is desirable: it was written by an app at a different origin under a
name for a product this site does not have.

*Alternatives:* keep the old prefix to avoid the eviction — rejected: it
preserves cached state across an origin move that should not preserve it, and
leaves the one string in the app still naming a storefront.

### The spec product is renamed here, while nothing is claimed

`openspec/specs/zzz-store/` holds a README and no capabilities, and
`add-zzz-store-navigation` is unclaimed at 0/3 groups. The product becomes
`zzz`, its in-flight capability becomes `zzz/navigation`, and that change is
renamed `add-zzz-navigation`. This is done as part of planning, in this
store, rather than as a task in `tasks.md` — no application repository reads
it, and a change id is only free to rename while no claim or checkmark
addresses it.

## Risks / Trade-offs

- **A ZZZ host does exist somewhere the repository cannot see** → the
  redirect rule is exactly the mitigation, and it is configured before the
  new route goes live rather than after.
- **The retired-worker names get reused.** Cloudflare will not stop a future
  `zzz-store-web` from being created if a wrangler config drifts back →
  `docs/deployment.md`'s *Retired workers* list is the record, and
  `pnpm run check:libs` fails a `deploy:*` script no workflow step runs.
- **The rename touches the two in-flight ZZZ changes.** `add-zzz-navigation`
  and `add-account-profile` both name `zzz-store` in prose → both are
  unclaimed, and the prose is corrected in this store as part of planning, so
  neither engineer meets a stale name at pickup.
- **The dev vhost rename needs a `/etc/hosts` sync.** `scripts/setup-nginx.sh`
  rewrites its managed block from the vhost filenames on every run and strips
  renamed hostnames from older manual lines, so `pnpm dev` repairs it — but a
  machine that has `store.zzz.dev` pinned by hand outside that block keeps
  resolving it.
- **Traded away: the ability to serve a ZZZ storefront on its own subdomain
  without a code change.** Deliberate, per the first decision.

## Migration Plan

1. The registry flips (`BRAND_SITES.zzz`, `BRAND_STOREFRONT.zzz`, the `store`
   id) and the app follows it in the same group — after this, every derived
   URL, route, and fixture names `zzz.<base>` and CI is green.
2. The rename lands: directory, package, worker, dev registry, nginx vhost,
   deploy workflow.
3. The zone Redirect Rules are configured, **before** the first deploy of
   `zzz-web`, so the old address is answered from the moment the new one is.
4. Staging deploys and is checked at `zzz.9jokes.com`; the old workers are
   deleted from Cloudflare once it serves.

**Rollback:** until step 4, reverting the registry edit and the rename
restores the previous state completely — no data moves, no database is
touched, and no DNS record that existed before is removed. After step 4, the
old worker names are free and would have to be redeployed, which is why they
are deleted last.
