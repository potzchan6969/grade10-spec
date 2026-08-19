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
registry edit against no live traffic — the same position grade10 was in when
`grade10-store-web` and `grade10-loyalty-web` were collapsed into
`grade10-web` before either shipped (`docs/deployment.md`, *Retired
workers*). Registering the zones is a precondition of this change, not part
of it.

The app itself is already named for the brand rather than a storefront:
`rename-zzz-app` shipped `apps/frontend/zzz`, `@grade10/zzz-spa`, and the
`zzz-web` worker, and left every route on `store.zzz.*` for this change to
move.

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

### The rename already happened; this is a route edit

`rename-zzz-app` made the directory `apps/frontend/zzz`, the package
`@grade10/zzz-spa`, and the worker `zzz-web`, deliberately leaving every
route on `store.zzz.*`. So the worker this change deploys is already named
for the app rather than the host, and moving the address touches its
`routes` and nothing else — no worker is created, retired, or renamed, and
no deploy history is broken across the move.

*Alternatives:* do both at once, as this change was originally planned —
rejected by the author: ZZZ keeps `store.zzz.com` for now, so the rename
shipped on its own and the address waits for the zones.

### `storageNamespace` moves with the origin, and the eviction is the point

`apps/frontend/zzz/src/config.ts` prefixes every browser-storage key with
`zzz-store`; it becomes `zzz`. Existing keys are orphaned, which on a brand
with no registered zone means nothing, and which — if any local state does
exist — is desirable: the origin it was written under is exactly the one
being left behind. `rename-zzz-app` left this string alone for that reason:
without the origin moving, the eviction would buy nothing.

*Alternatives:* keep the old prefix — rejected: it preserves cached state
across an origin move that should not preserve it, and leaves the one string
in the app still naming a storefront.

### The spec product was renamed while nothing was claimed

`openspec/specs/zzz-store/` held a README and no capabilities, and
`add-zzz-store-navigation` was unclaimed at 0/3 groups, so the product became
`zzz`, its in-flight capability `zzz/navigation`, and that change
`add-zzz-navigation`. Done in this store during planning rather than as a
task here — no application repository reads it, and a change id is only free
to rename while no claim or checkmark addresses it. Recorded because this
change's capability path, `zzz/site-address`, depends on it.

## Risks / Trade-offs

- **A ZZZ host does exist somewhere the repository cannot see** → the
  redirect rule is exactly the mitigation, and it is configured before the
  new route goes live rather than after.
- **The dev vhost rename needs a `/etc/hosts` sync.** `scripts/setup-nginx.sh`
  rewrites its managed block from the vhost filenames on every run and strips
  renamed hostnames from older manual lines, so `pnpm dev` repairs it — but a
  machine that has `store.zzz.dev` pinned by hand outside that block keeps
  resolving it.
- **Traded away: the ability to serve a ZZZ storefront on its own subdomain
  without a code change.** Deliberate, per the first decision.

## Migration Plan

0. **Both ZZZ zones are registered.** They are unregistered placeholders
   today, so nothing below can run until that happens.
1. The registry flips (`BRAND_SITES.zzz`, `BRAND_STOREFRONT.zzz`, the `store`
   id) and the SPA's two vite configs follow it in the same group — after
   this, every derived URL and fixture names `zzz.<base>` and CI is green.
2. The routes, the storage namespace, and the nginx vhost move.
3. The zone Redirect Rules are configured, **before** the deploy in step 4,
   so the old address is answered from the moment the new one is.
4. Staging deploys and is checked at `zzz.9jokes.com`.

**Rollback:** reverting the registry edit and the route edit restores the
previous state completely — no data moves, no database is touched, no worker
is renamed, and no DNS record that existed before is removed.
