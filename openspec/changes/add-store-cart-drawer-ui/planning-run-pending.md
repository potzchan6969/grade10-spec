# Pending Operations Planning Run

**Date:** 2026-10-13
**Source:** `47b98335ef8fb88c62a81da7f68d452964b07817`, based on store main `7177871bbd59`
**Input digest:** `abeb03776e73168b1195edf6e81a9de02e47599e33de48ebe02bf17cecaa40d0`

## Scope

This run updates pending drawer operations in this change and pending Pay in
`add-shopify-checkout-integration`. Existing unrelated requirements, case
identities, completed tasks and historical acceptance snapshots are retained.
Q20 and Q21 settle the pending-action scope and available dismissal.

## Frozen Inputs

The coordinator assembled `/tmp/cart-pending-qa1`; `input-manifest.json`
records each included file's digest. The snapshot contains the proposals,
decisions, PRDs, journey sets, feature-set outlines, pending design states,
existing cases without scenario links or reconciliation, the Store domain
suite and the case-writing rules and template.

| Capability | Pending anchors | Existing roots |
| --- | --- | --- |
| `grade10-site/store/cart-drawer` | `g10.store-cart-drawer.US7`, `g10.store-cart-drawer.US8`, `g10.store-cart-drawer.US9`, Pending operations | Drawer entry, Current cart review, Honest cart summary, Member tender context, Cart changes, Continuing onward, Checkout from the drawer |
| `shared/ui/store-cart` | `shared.ui-store-cart.US19`, `shared.ui-store-cart.US20`, Pending operations | Existing durable feature-set roots retained whole |
| `grade10-site/store/checkout` | Existing `grade10-site-store-checkout-US-05` and `grade10-site-store-checkout-US-06`; Safe repetition and recovery | Current basket and tender, Hosted Shopify handoff, Order settlement and return, Carrier rates |

QA1 receives no requirement text, scenarios, technical design, reconciliation,
QA2 or archive material. Dev receives the same frozen anchors and decisions
and reads the existing implementation; Dev does not receive QA1 cases.
These are read instructions, not a harness-enforced access boundary. The
recorded digest identifies the supplied snapshot, not proof of isolation.

## Readings

QA1, Dev, QA2 and acceptance-review results are recorded here as they finish.
New cases remain draft. Acceptance and publication require separate recorded
evidence; this planning record grants neither.

## Shared Anchor Restart

The earlier active pending-tender US18 addition collided with durable
order-discount US18 and is removed. The already-issued pending US19 tender
cases from store main remain, while new drawer-wide cases use US19 TC4-TC7
and US20 TC1-TC2. The durable order-discount US18 is untouched. The shared
QA1 and Dev readings restarted independently in fresh contexts against
`8a8d6e59d40ebf9ff1cb4b6de04213976b73a4e0be37cb793296ae70beaaed4e`.
Unchanged cart and checkout readings retain their original input identity.

## Human Clarification

QA1 raised the successful checkout reply after dismissal. On 2026-10-13 the
human chose option B: open Shopify for the still-current reply. Cart Q22 and
checkout Q35 record the answer. The checkout PRD, design, request guards,
scenario and dependent case are patched before QA2. This changes no journey
or feature-set root, so QA2 reconciles the clarification without another
blind anchor restart. Closing invalidates tender-view publication; it does
not make a checkout answer stale by itself.

## Independent Drafts

- **QA1** - 9 new cart cases and 4 new shared cases; six existing cart/checkout
  routes or assertions updated. Cases remain draft. QA1 found the post-close
  reply question and sequential write waits missing from an existing route
- **Dev** - Technical design, scenarios and appended delivery groups precede
  case comparison. Added cart SC34-SC40, shared SC64-SC69 and checkout
  SC66-SC68. Historical task ids, owners, completions and snapshots retained
- **Shared restart** - Fresh Dev verifies all five public prop types, including
  the exported promo sheet, and exempts dismissal's collapsed-state callback
  from edit guards. Fresh QA1 retains legacy case identities under the correct
  anchors; QA2 adds one compatibility case for the interactionPending contract

## Pending QA2

**Run:** 2026-10-13, fresh reader against committed source `3de9ce9fa4bc`
plus the explicit non-anchor Q22/Q35 clarification and coordinator repairs.
This is scoped reconciliation, not regeneration of the historical suites.

| Capability | Cases | Closure |
| --- | --- | --- |
| `grade10-site/store/cart-drawer` | 43 pending-scope drafts; 8 picture-extension drafts are recorded later | Revised SC23 and new SC34-SC40 have full asserting cases; US7-US9 anchors covered |
| `shared/ui/store-cart` | 9 pending-scope drafts; 3 picture-extension drafts are recorded later | Legacy SC37-SC39 markers retained; new US20-TC2 fully asserts SC68; SC64-SC69 have full asserting cases; US19-US20 and context dismissal covered |
| `grade10-site/store/checkout` | 48 active drafts; 3 QA2 additions | Revised SC34/SC35 and SC66-SC68 have full asserting cases; pending, external-edit and recovery anchors covered |

- **Dispositions** - The three owning `feature-tcs.md` files record each blind pending case and affected existing case before their source-linked coverage tables. All cases retain lifecycle, identity and revision. Six genuinely uncovered routes are now represented as QA2 drafts, with no blind-generation credit.
- **New identities** - Cart `g10.store-cart-drawer.TC-n5c`; shared `g10.shared-store-cart.TC-wh7` and `g10.shared-store-cart.TC-r4f`; checkout `g10.store-checkout.TC-iux`, `g10.store-checkout.TC-5c1` and `g10.store-checkout.TC-u6z`. Each is allocated by `pnpm run trace -- init case` with the owning scope.
- **Overclaims** - Scoped repair removes revised SC23 from 12 narrower active legacy cart cases and revised SC35 from the partial member-change case. The three legacy shared markers retain their immutable historical links; US20-TC2 is the complete compatibility case for SC68. Partial blind cart routes claim anchors without overclaiming a complete scenario.
- **Clarification** - Cart US9-TC3 checks a current successful reply while closed. New checkout US5-TC14 checks all three dismissal routes, leaving closed and reopening before the reply, rejecting a second pending Pay and then opening Shopify. Q22/Q35 are settled; closing alone invalidates no checkout request.
- **Source repair** - QA2 reported the obsolete open-Q22 sentence in cart technical design; the coordinator repaired it and separated tender-view opening guards from the checkout current-request guard.
- **Gaps** - No changed scenario, anchor or unresolved product choice remains uncovered. No domain impact: these changes do not alter the Store domain suite's composed paths.
- **Evidence** - The owning ledgers name the future controlled fixtures and actor walks. No implementation, case classification or execution occurred. The coordinator owns committed, quiescent planning gates and acceptance review.
- **Focused validation** - Case identity/lifecycle comparison against the initial committed tree and diff check pass. Checkout suite validation passes with one partial-case warning. Cart/shared suite validation reports no scoped placement errors after the source repair; remaining warnings are unrelated to this increment. This is a structural gate finding, not an unresolved product decision.

Full QA2 evidence is saved at `/tmp/cart-pending-qa2-report.md`.

## Display Correction

The shared display prefix is `shared.ui-store-cart`, as the suite validator
requires for `shared/ui/store-cart`. US19 and US20 keep their numbers and
behavior; scenario and case machine identities are unchanged. Both shared
readings restart against
`b6ef0d9f116c2499c71f488faf676deaecf9c2a535f80c718da2b83358da45ea`.
The fresh QA1 matrix covers controls, open sheet, dismissal, recovery and
compatibility; fresh Dev finds no semantic drift or needed contract repair.
The affected QA2 rerun maps P1-P5 to the existing asserting cases and retains
their exact machine revisions and coverage links. Application-owned scrolling,
request completion and feedback remain with the application cases. No new
behavior gap or product contradiction follows from the display correction;
the case placement blocker was repaired during the rebase. Its evidence is saved at
`/tmp/cart-pending-display-qa2-report.md`.

Checkout SC66-SC68 use the existing capability's legacy display heading form
so the manual's state checker recognizes them. Their machine identities and
behavior remain unchanged. Raised landing cells name Q22 and Q35 exactly.

## Gate Receipts

Checked commit: `c5b6b058a9ef051c410be5175f9558ff644a1ff1`, based on
published store main `57696f4648f5b4ae947f37dab219cd9512737c4f`.
The preceding main changes affect a separate session plan, with no changed
cart inputs. Commands run on a committed tree with no source writer using
the configured Node and pnpm runtime.

| Gate | Exit | Result |
| --- | --- | --- |
| `git diff --check` | 0 | Passed |
| `pnpm plan:review-preflight add-store-cart-drawer-ui --json` | 0 | Ready; source identity `6226a09ca4606efe1d6740fcb4c1e96aecd5f3854b70fade1a887a1378f570a0` |
| `pnpm plan:review-preflight add-shopify-checkout-integration --json` | 0 | Ready; source identity `10fa4089a34a64e0296d1dd892f8312df0ec3ea947bd0bd3ba94c7dd398fcbfd` |
| `pnpm check:manual --quiet` | 0 | 0 failures, 291 warnings |
| `pnpm run tcs:validate add-shopify-checkout-integration` | 0 | 48 draft cases; 1 anchor-only warning |
| `pnpm run tcs:validate add-store-cart-drawer-ui` | 1 | Pre-repair snapshot: 4 legacy shared case placement errors; cart has 43 drafts and shared has 8 drafts |
| `pnpm accept:preflight add-store-cart-drawer-ui add-shopify-checkout-integration` | 1 | Both changes refused by the folded-tree suite gate |

### Post-rebase validation

The spec branch was rebased onto `origin/main` at
`d664650c4ab3bb4295ce64ef83eb42cdbca6bf9e`. The source repair then restored
both the product-picture scope and the pending-operation scope, removed the
malformed shared `US18` headings, and kept the issued `US19` tender cases.

| Gate | Exit | Result |
| --- | --- | --- |
| `git diff --check` | 0 | Passed |
| `node scripts/openspec/validate-test-cases.mjs openspec/changes/add-store-cart-drawer-ui` | 0 | Pre-repair snapshot: cart 0/51 and shared 0/11 draft cases; no errors, four nonblocking QA2 warnings |
| `pnpm check:manual --quiet` | 0 | Passed |
| `pnpm plan:review-preflight add-store-cart-drawer-ui --json` | 0 | Passed |
| `pnpm accept:preflight add-store-cart-drawer-ui` | 1 | Folded-tree validation still reports unrelated missing suites; no cart/shared placement error remains |

The commands emitted the repository's Node engine warning because this
workspace currently runs Node 23.10.0 while the store declares Node 24.14.1.

Output receipts are saved under `/tmp/cart-pending-*-current.*` and
`/tmp/cart-pending-*-repaired.txt`. The manual and acceptance gates inspect
different trees; the successful manual check does not replace the refused
acceptance gate.

### Review repair validation (2026-10-13)

After the review repairs, the scoped suites report 0/51 cart drafts and 0/12
shared drafts, with no validation errors. The checkout suite reports 0/48
drafts with its existing one anchor-only warning. The manual checker reports
0 failures and 297 warnings. `validate:changes` validates 77 changes and
leaves 10 waiting on human input. Both review preflights return `ready`.
The full-store trace validator remains outside this scoped repair and still
reports unrelated legacy marker and scenario-id issues.

## Remaining Gate Blockers

The rebase merge removed the malformed `shared-ui-store-cart-US18-*`
headings that sat under the pending US19 and US20 journeys. The issued
`shared-ui-store-cart-US19-TC1-1` through `TC3-1` tender cases remain, and
the new drawer-wide cases use `shared.ui-store-cart.US19-TC4` through `TC7`
and `shared.ui-store-cart.US20-TC1` and `TC2`. The durable order-discount US18 remains
unchanged.

The folded-tree gate also reports missing suites in console permissions,
vault identity verification, shared console blocks, order settlement and
two currency-change capabilities. Those unrelated omissions remain outside
this pending increment.

**Acceptance status** - Blocked. No independent acceptance verdict, new
accepted fingerprint or published revision is claimed. The acceptance-review
skill says a blocked preflight stops review, so acceptance review, acceptance
and publication are not run. Application implementation is not part of this
planning update.
