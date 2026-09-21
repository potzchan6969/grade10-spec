## Context

`apps/frontend/grade10/src/surfaces.ts` is the one table every reader of an
address goes through: `Gate` is currently `"store" | "vault" | "booking" |
"profile" | "labs"`, and `gatesFor(deployEnv)` states one line per gate — all
five read `deployEnv !== "production"`. `membership` is not in that union, so
`/membership` and `/join` are carried unconditionally.

`DeployEnv` (`@grade10/app-env`) is `"development" | "staging" |
"production"`; the `preview` deploy *target* maps to `deployEnv:
"production"` at a different `stage`. A gate keyed on
`deployEnv !== "production"` is therefore already "shut on preview and
production, open on development and staging" (decisions.md Q2) — no new gate
shape, only a sixth member of the existing union.

Confirmed by re-reading `apps/frontend/grade10/src/surfaces.ts` and its test
suites directly: the file list the profile change touched for the same kind
of addition is still exactly current —
`src/surfaces.test.ts`, `src/store-shut.test.tsx`,
`src/serving/webManifest.test.ts`, `src/serving/crawlerDirectory.test.ts`,
`src/serving/worker.test.ts`, `src/chrome/siteContent.test.ts`,
`scripts/check-public-pages.mjs` — each holds one or more exhaustive `Gates`
object literals the compiler will flag once `Gate` gains a sixth member.

Also confirmed: `src/surfaces.test.ts`'s own `GATES`/`OPEN`/`SHUT`/`allBut`
fixtures (`const GATES = ["store", "vault", "booking", "labs"] as const`)
were never extended to include `profile` — that generic all-or-none loop
stayed scoped to the original three waiting products, and profile's own
`SC-35`/`SC-36` behaviour was proven by a dedicated new `describe` block
instead. Membership follows the same precedent: no edit to `GATES`.

## Goals / Non-Goals

**Goals:**

- One new line in `gatesFor`, following the exact shape every other waiting
  product already uses
- `gate: "membership"` on both the `membership` and `join` entries in
  `SURFACES`
- Every reader that already derives its answer from `Gates`/`carriedSurfaces`
  needs no separate edit — the type change is what forces every exhaustive
  gate literal in the test suites to add a sixth member, the same mechanical
  consequence the profile change relied on

**Non-Goals:**

- Any `shared/ui/site-chrome` or `grade10-site/site/page-shell` change —
  neither page is wired into the header, footer, account menu or front door
  today, confirmed by direct codebase search; there is no shared contract to
  make optional the way `onProfile` was
- A submodule bump — nothing in `@grade10/ui` or `@grade10/design-system`
  changes, so `external/grade10-spec` does not move for this change alone
- Hiding an in-app link between `/membership` and `/join` — they share one
  gate (decisions.md Q3), so no build can ever carry one without the other
  and no link ever needs to disappear
- A code change to `src/serving/pushNotification.ts` — decisions.md Q4
  already settled that its `ROUTES.membership`-addressed notification needs
  none, since `store` and `membership` read the identical `deployEnv` line

## Decisions

No implementation decision beyond what `decisions.md` already settled: the
gate mechanism, the file list, and the membership/join pairing are all
product-level facts fixed there. The one engineering-only choice is naming
the new `describe` block and its two cases after the profile precedent
(`src/surfaces.test.ts`'s "the profile's own gate" block), rather than
folding membership into the existing `GATES`/`allBut` loop — matching how
profile itself was proven, not the older three-product loop, so a future
reader finds waiting-product tests in one consistent shape rather than two.

## Risks / Trade-offs

- **[Risk] A page renders `ROUTES.membership` or `ROUTES.join`
  unconditionally somewhere a grep missed** → Mitigation:
  `scripts/check-public-pages.mjs` already asserts no withheld surface's page
  code answers a served address; the two call sites this design relies on
  (`JoinPage.tsx` linking to `ROUTES.membership`, `MembershipPage.tsx`
  linking to `ROUTES.join`) were confirmed by grepping `ROUTES.membership`
  and `ROUTES.join` across `apps/frontend/grade10/src` to exhaustion, and
  neither needs a change since both surfaces always carry together.
- **[Trade-off] The generic `GATES`/`allBut` loop in `surfaces.test.ts` stays
  three products wide** → accepted, matching the profile precedent: adding
  every waiting product to that loop indefinitely would grow test count
  without adding coverage the dedicated per-product `describe` blocks do not
  already provide.

## Migration Plan

No data, no schema, no deploy order beyond the ordinary sequence: land this
change's `apps/frontend/grade10` edits in one PR, no submodule bump required.
Rolling back is deploying the previous build. Reopening membership later is
the one-line `gatesFor` edit the proposal's Follow-on changes names.
