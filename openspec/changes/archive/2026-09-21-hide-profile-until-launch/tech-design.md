## Context

`apps/frontend/grade10/src/surfaces.ts` is the one table every reader of an
address goes through: `Gate` is currently `"store" | "vault" | "booking" |
"labs"`, and `gatesFor(deployEnv)` states one line per gate — today all four
read `deployEnv !== "production"`. `profile` is not in that union, so
`/profile` is carried unconditionally, and `SiteShell.tsx` supplies
`onProfile` to `SiteHeader` unconditionally too.

`packages/ui`'s `SiteHeader` (`shared/ui/site-chrome`) already handler-gates
Cart, search and My Orders — an absent handler means an absent control, no
branch in the consuming app. `onProfile` is the one account-menu prop that is
not yet optional in that contract.

`DeployEnv` (`@grade10/app-env`) is `"development" | "staging" |
"production"`; the `preview` deploy *target* maps to `deployEnv:
"production"` at a different `stage` (`packages/app-env/src/targets.ts`). A
gate keyed on `deployEnv !== "production"` is therefore already "shut on
preview and production, open on development and staging" — no new gate shape
is needed, only a new member of the existing union.

## Goals / Non-Goals

**Goals:**

- One new line in `gatesFor`, following the exact shape `store`/`vault`/
  `booking` already use
- `onProfile` optional in `SiteHeader`'s contract, mirroring `onMyOrders`
- Every reader that already derives its answer from `Gates`/`carriedSurfaces`
  needs no separate edit — the type change is what forces every exhaustive
  gate literal in the test suites to add a fifth member

**Non-Goals:**

- Any change to `add-account-profile`'s own scope, or to when it ships
- Gating `/profile/orders` or `/profile/orders/:orderId` — they keep the
  `store` gate alone (decisions.md Q3)
- A submodule bump beyond what this change itself needs — `@grade10/ui`'s
  `onProfile` change ships in the same submodule bump that carries this
  change's `apps/frontend/grade10` edits

## Decisions

### The gate is a fifth union member, not a new mechanism

`grade10-site/site/carried-surfaces`'s spec already states the shape:
`Gate` gains `"profile"`, the `profile` surface in `SURFACES` gains
`gate: "profile"`, and `gatesFor` gains `profile: deployEnv !== "production"`.
`Gates = Record<Gate, boolean>` is what forces every exhaustive literal in the
test suites (`surfaces.test.ts`, `store-shut.test.tsx`,
`serving/webManifest.test.ts`, `serving/crawlerDirectory.test.ts`,
`serving/worker.test.ts`, `chrome/siteContent.test.ts`,
`scripts/check-public-pages.mjs`) to add a `profile:` entry — the compiler
finds every site, so no separate audit task is needed to enumerate them.

**Rejected:** a gate keyed on something other than `deployEnv`. The store's
own gate already rejected keying on site stage for exactly this reason
(`carried-surfaces` PRD, "The deploy environment turns it off"), and nothing
about the profile's readiness differs from the store's.

### `onMyOrders` is the template for `onProfile`

`SiteShell.tsx`'s existing line —
`onMyOrders={config.gates.store ? () => onNavigate(ROUTES.orderHistory) :
undefined}` — is copied for Profile:
`onProfile={config.gates.profile ? () => onNavigate(ROUTES.profile) :
undefined}`. `SiteHeader`'s `Signed in` clause and its account-menu ordering
logic change to treat `onProfile` as optional the same way `onMyOrders`
already is, per `shared/ui/site-chrome`'s reconciled spec.

**Rejected:** gating only in the consuming app while keeping `onProfile`
required in the shared contract (e.g. a no-op handler). Rejected already in
decisions.md Q5: it leaves the shared component's published contract
claiming a control that is not always there.

### In-app links to `/profile` reuse the existing `carries()` idiom

`routes/profile.tsx` already has a local
`carries = (surface: "orderHistory") => surface in
carriedSurfaces(config.gates).served` helper for `onViewOrders`. Each of the
four other pages that link to `ROUTES.profile` —
`CheckoutPage.tsx`, `AuctionWinnerOrderPage.tsx`,
`AccountAuctionRecordPage.tsx`, `OrderDetailsPage.tsx`, `OrderHistoryPage.tsx`
— gets the equivalent check for `"profile"` before rendering its link/button,
mirroring the prop-optionality pattern already used for `onViewOrders` and
`onMyOrders`: the link is omitted, not redirected (decisions.md Q4).

**Rejected:** a single shared `<ProfileLink>` component. Five call sites
each render their own link/button markup today; wrapping them in a new
shared component is a refactor this change does not need, and
`react-clean-architecture`'s per-feature slice convention does not ask for
one just to share a boolean check.

## Risks / Trade-offs

- **[Risk] A page renders `onProfile`/`ROUTES.profile` unconditionally
  somewhere `grep` missed** → Mitigation: `scripts/check-public-pages.mjs`
  already asserts no withheld surface's page code answers a served address,
  and the five call sites this design names were found by grepping
  `ROUTES.profile` and `carriedSurfaces` across `apps/frontend/grade10/src`
  to exhaustion, not sampled.
- **[Risk] `SiteHeader`'s `onProfile` going optional is a breaking prop-type
  change for any other consumer** → Mitigation: `grade10` is `@grade10/ui`'s
  only consumer of `SiteHeader` (`shared/ui/site-chrome`'s PRD: "ZZZ has no
  account surface"), and an optional prop is source-compatible with every
  existing call site that already supplies a handler.
- **[Trade-off] Order history keeps answering when the account page does
  not** → accepted per decisions.md Q3; a mailed order-confirmation link
  must not depend on an unrelated page's readiness.

## Migration Plan

No data, no schema, no deploy order beyond the ordinary submodule-bump
sequence: land the `@grade10/ui` contract change and the `grade10-spec`
capability deltas first (this change, in this store), then bump
`external/grade10-spec` in `grade10` and land the `apps/frontend/grade10`
edits in the same PR as the bump. Rolling back is deploying the previous
build. Reopening the profile later is the one-line `gatesFor` edit the
proposal's Follow-on changes names.
