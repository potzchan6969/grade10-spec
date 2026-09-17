## Context

`apps/frontend/grade10/src/surfaces.ts` already carries the mechanism
`hide-store-until-launch` built: a `Gate` union (`store`, `auction`, `vault`,
`booking`), `gatesFor(deployEnv)` deciding which lanes open each, and
`carriedSurfaces(gates)` narrowing the route table, the prerender list, the
worker's matcher and the sitemap through one function. `resolveDeployEnv()`
reads `CLOUDFLARE_ENV`; with none set — every local run — it resolves
`"development"`, and `preview`'s own deploy target resolves `deployEnv:
"production"` (`packages/app-env/src/targets.ts`), which is what makes
`deployEnv !== "production"` already the right formula for "carried except
where the public reaches it".

The labs (`refunds`, `shipping`, `demo`, `demoStripe`, `demoServing`,
`demoDialog`) are wired on a second, older mechanism: `kind: "dev"`, filtered
out of `SERVED_PATTERNS` unconditionally, and registered as routes in
`routes.ts` only under `import.meta.env?.DEV` — Vite's own build-mode flag,
true for `react-router dev` and false for every `react-router build`
regardless of which lane the artifact is deployed to. No Cloudflare
environment named `development` exists in `wrangler.jsonc`; the labs today
answer on a contributor's own machine and nowhere a `pnpm build` output is
deployed, staging included. Carrying them on staging is a mechanism change,
not a config flip.

The current branch also carries `hide-site-until-launch`'s first pass: the
auction tagged `gate: "auction"` throughout, and the account menu's auctions
item gated on it. Both reverse under Q26 — the auction is not part of this
change.

## Decisions

**The auction stops being a gate, not a gate that is always open.** Remove
`"auction"` from the `Gate` union and drop `gate: "auction"` from `auction`,
`auctionWatchlist`, `auctionListing`, `auctionWinnerOrder`, `auctionInvoice`
and `bids`; `gatesFor` drops the `auction` key. Rejected: keeping the gate and
hard-coding it `true`. A gate that is always open is a landmine — the next
`gatesFor` edit that touches the object literal is one keystroke from hiding
a live product — and every other always-carried surface in the table
(`terms`, `profile`, `membership`, …) already signals that by carrying no
`gate` field at all; the auction should read the same way.

**The labs move onto the same `Gate` mechanism as everything else, keyed off
the same `deployEnv !== "production"` formula.** Add `labs` to `Gate` and to
`gatesFor`'s return; tag the six labs entries `gate: "labs"` alongside their
existing `kind: "dev"`. In `routes.ts`, fold `DEV_SURFACES` into the ordinary
`carried`/`holds()` narrowing `at()` already runs every other surface
through, rather than the separate `import.meta.env?.DEV` block — a
contributor's own machine keeps working unchanged, because
`resolveDeployEnv()` already resolves `"development"` there with nothing set,
and `"development" !== "production"` is `true` under the new formula exactly
as it is under the old `import.meta.env?.DEV` check. `SERVED_PATTERNS`, which
today filters out every `kind: "dev"` entry unconditionally, gains the same
gate-aware treatment so the worker's matcher, `carriedSurfaces` and
`routesFor` read one narrowing instead of two. `PRERENDERED_SURFACES`,
`RENDERED_SURFACES` and `PUBLIC_SURFACES` stay derived from `kind` alone: a
lab is never a document the build writes ahead of a request, carried or not,
so it never joins the prerender list or the sitemap.

Rejected: leaving `import.meta.env?.DEV` in place and adding a second,
parallel `deployEnv !== "production"` check beside it for the staging case.
Two conditions guarding the same six routes is exactly the "second rule"
this change's proposal already says the labs stop being — one condition,
read off the same gate the rest of the table uses, is the version an
engineer can trust without re-deriving which of the two currently applies.

**No change to `check-public-pages.mjs`.** It reads `carriedSurfaces` and
`routesFor` already; neither's signature changes, and the script never
inspects a lab document today (labs are never prerendered), so it has
nothing new to check.

## Risks / Trade-offs

**[Risk]** Folding `DEV_SURFACES` into `carried`/`holds()` widens `at()`'s
type from `Exclude<RouteId, DevRouteId>` to `RouteId`, which could silently
let a lab's route module get treated as a `Public`/`prerendered` surface
elsewhere in the file. → **Mitigation**: `PrerenderedRouteId`, `PublicRouteId`
and the prerender/sitemap derivations stay keyed off `OfKind<"prerendered">`
and `OfKind<"rendered">`, never off "carried", so widening `at()`'s type
cannot pull a `dev`-kind surface into either list — the compiler still
refuses one that tries.

**[Risk]** A staging build now writing route modules for `/refunds` and
`/shipping` could be mistaken, from a build-size or a crawler-directory diff,
for the drafts having been approved. → **Mitigation**: `SERVED_PATTERNS`
inclusion is gate-driven, not `kind`-driven, so `PUBLIC_SURFACES` and the
sitemap — both still keyed off `kind` — never name them; staging carrying the
labs changes what an operator can click, not what a crawler is ever offered,
on any lane.

## Migration Plan

No data migration. Deploy order does not matter between the frontend and any
other service: `carriedSurfaces` is read entirely from the build's own
`resolveDeployEnv()`, so a staging deploy on the new code starts carrying the
labs the moment it ships, and a rollback stops carrying them the moment the
previous build is restored.

## Open Questions

None. The mechanism choice above settles how the labs reach staging; the
route modules themselves (`routes/demo.tsx` and the rest) are unchanged
files, already present in every build's source tree.
