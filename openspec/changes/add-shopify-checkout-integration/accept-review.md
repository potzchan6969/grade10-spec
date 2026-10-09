reviewed: 217e6d6c1e6ab44820e6ce5eb9ae2cd4ce27d194
verdict: Not ready - 3 blockers

## Review Scope

This is a fresh acceptance review dated 2026-10-09 of the frontend-only re-scope (Q24-Q34). The reviewer did not write the plan. The review read the store branch `claude/checkout-frontend-only` at `217e6d6c1e6a`. That branch is three commits ahead of `origin/main`, which matches the fetched store main and is not pushed, by owner instruction. Application facts were read on `codex/feat-shopify-checkout-integration` at `c05700431` and on the application's `origin/main`. Nothing was accepted, published, committed or pushed, and no planning source was edited.

- **Owner override** - The acceptance preflight refuses on one overlap outside this change. [accept-review](../../../.claude/skills/accept-review/SKILL.md#flow) says such a refusal stops the review. On 2026-10-09, @kinisworking asked for the full content review anyway. The refusal is finding X1, and every check below was run
- **Draft fingerprint** - `6d1e9b8a9cee8018ea203d5de19eef9c7af1f6695c94105167d8ffe66ea82f95`, against baseline `b3fd6c97aa735c9713a1f271c9a0fd84d962a0f1560b7bc06a1bb2163c7e78db`

## Gates

The gates ran on Node `24.14.1` with `PLAN_NO_FETCH=1`.

| Command | Observed result |
| --- | --- |
| `pnpm plan:review-preflight add-shopify-checkout-integration --json` | Exit 0. `status: ready`. Five changed requirements (four MODIFIED, one ADDED), no overlaps, no blockers, `expandToFullSources: false`. Full sources were read anyway because disagreements appeared |
| `pnpm accept:preflight add-shopify-checkout-integration` | Exit 1. One refusal: `[check:manual/overlap]` on `shared/ui/site-chrome` `SiteHeader composes Nav with session-aware account entry`, which is MODIFIED by both `omit-profile-account-menu` and `restrict-auctions-by-region`. No other refusal. It lists three durable files to write: checkout `spec.md`, `user-journeys.md` and `feature-tcs.md` |
| `pnpm check:manual` | Exit 1 with 2 failures and 278 warnings. Both failures are the two sides of the same overlap. Checkout warnings: the durable suite "holds 19 test cases and no page shows them" (F8), and the durable suite has no case for SC-08 or SC-16. This change's fold clears that second warning: US3-TC14-1 traces SC-16, and SC-08 is listed out of suite |

The previous ledger's blockers 1 and 2 (missing story references) no longer reproduce. Both page references were replaced in `39ed50c5a6ca`, and `d34303232c2e` replaced the second again.

## Findings

Blockers first. X1 is outside this change. B1 and B2 are this change's.

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | blocker (external) | `openspec/changes/omit-profile-account-menu/specs/shared/ui/site-chrome/spec.md` and `openspec/changes/restrict-auctions-by-region/specs/shared/ui/site-chrome/spec.md`, both MODIFIED `SiteHeader composes Nav with session-aware account entry` | Two in-flight changes fold the same requirement, so whichever archives second reverts the first. This refuses `spec:accept` for every change, this one included, although checkout content plays no part in it | Owners of `omit-profile-account-menu` and `restrict-auctions-by-region` | Choose one owner delta for the requirement, rebase the other on it (or declare `depends_on`), then rerun `pnpm check:manual` | open |
| B1 | blocker | [checkout.md:68-72](../../../docs/prds/products/grade10-site/store/checkout.md) ("The bar - ... the drawer replaces Proceed to Checkout with the verify message and an account link") vs [delta](specs/grade10-site/store/checkout/spec.md) ADDED `The cart drawer starts one current Pay at a time` **Answers** (line 362), SC-37 (lines 439-447) and SC-57 | The same fact is stated two ways. The page says the gate replaces the button before any press. The delta, [tech-design.md:60](tech-design.md) and the application (`CartDrawerHost.tsx` `resolved.kind === "verify"`, a toast after `identityRequired`) show the gate as Pay's answer. The page's own decision row (line 96) agrees with the delta. The 🚧 sibling at [cart.md:82-86](../../../docs/prds/products/grade10-site/store/cart.md) ("where Proceed to Checkout was") repeats the page's version | @kinisworking (checkout page). The cart.md sibling belongs to the `add-store-cart-drawer-ui` page owner | checkout.md "The bar" line: state that Pay (Proceed to Checkout) answers with the verify message and account link and creates no session. Then fix the cart.md sibling | open |
| B2 | blocker | Unmarked [checkout.md:57](../../../docs/prds/products/grade10-site/store/checkout.md) ("Only the member's own edit retires it") vs delta SC-60 (spec.md:477-484, "Later cart edits leave the open invoice unchanged ... THEN the open invoice keeps the lines and tender that were sent"); [ui-design.md:45](ui-design.md); US6-TC5-1 ([feature-tcs.md:739](specs/grade10-site/store/checkout/feature-tcs.md)) | The same fact is stated two ways. The page says a member's line or tender edit retires the older unpaid invoice. SC-60 says the invoice stays open after exactly that edit. The backend this change ships against retires it best-effort on the member's edit (`routers/cart.ts` `discardMovedPast` → `deferCartDiscard`, present on the application's `origin/main`). So US6-TC5-1 step 3 ("Read the original hosted invoice") would meet a discarded invoice | @kinisworking (checkout planning and QA) | Delta first: reword SC-60 so later edits do not rewrite the invoice's lines and tender, without promising that it stays open. Then update the ui-design "Changed cart during Pay" row and US6-TC5-1's expected results. The reworded scenario text needs a fresh review | open |
| F1 | fix | Delta `## Feature set` (spec.md:3-23) vs durable [spec.md](../../specs/grade10-site/store/checkout/spec.md) `A checkout intent is safe to repeat` (unchanged) and SC-08 (kept) | The fold replaces the durable Feature set. Under "Safe repetition and recovery" only frontend leaves remain (one Pay, stale answers, lost answers). The leaves for one open intent, reuse, recovery and changed intent are gone, as is "bind order and provider facts before leaving", although those requirements and scenarios stay durable. [planning-run.md:81](planning-run.md) says the Feature set is unchanged, but only its five roots are | Checkout planning owner | Keep the durable reuse, recovery and provider-binding leaves beside the new frontend leaves, and correct the planning-run line | open |
| F2 | fix | Post-fold durable `feature-tcs.md`, for durable scenarios SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21; [add-checkout-purchase-safety/proposal.md](../add-checkout-purchase-safety/proposal.md) | Every case tracing these scenarios is deprecated, and none of them is listed `**Out of suite:**`. After the fold, `check:manual` (`qa.mjs` coverage rule; deprecated cases do not count) will report them untraced. The Reconciliation says `add-checkout-purchase-safety` owes their cases, but that change records no such debt | Checkout QA owner, with the `add-checkout-purchase-safety` owner | Record the six owed cases in `add-checkout-purchase-safety` (a Raised row or its proposal). Optionally list them out of suite here with that owner named | open |
| F3 | fix | [decisions.md:49](decisions.md) Q30, Q32 (line 51), [tech-design.md](tech-design.md) Context table, [add-checkout-purchase-safety/proposal.md:9](../add-checkout-purchase-safety/proposal.md) | The record misstates today's backend. On the application's `origin/main` and the planning branch, `attemptCheckout` already returns the standing invoice for an unchanged cart (same cart id and edited version; `findOpenCartCheckout`/`reusedCheckout`). A member's edit already discards the invoice it moved past, best-effort. The purchase-safety proposal says the backend "creates a new order on every Pay". Q30's two-order risk is real only when the first order has not yet recorded its reference and URL. Q32 answers who owns cancellation, not whether the collector can see a canceled order today, which they can. The owner's acceptance in Q30 still stands, but on a narrower premise | @kinisworking | Correct Q30's premise and the purchase-safety Why. Add the reuse and discard facts to tech-design's Context table | open |
| F4 | fix | Delta SC-37 (spec.md:445-446), ADDED **Answers**; [tech-design.md:60](tech-design.md); `CartDrawerHost.tsx` (`config.gates.profile`); `add-store-cart-drawer-ui` **Link** paragraph | The delta shows the account action whenever verification is required. The tech design and the code show it only when the profile gate is on, and the cart-drawer delta says the same. So the design adds a condition the requirement does not state | Checkout planning owner | Add "when the site's profile address is enabled" to SC-37 and the Answers paragraph, or require the gate | open |
| F5 | fix | 🚧 [checkout.md:52](../../../docs/prds/products/grade10-site/store/checkout.md) and the delta ("Pay") vs checkout.md:69, [cart.md](../../../docs/prds/products/grade10-site/store/cart.md) and `@grade10/i18n` `grade10/en/store.json` `checkoutButton: "Proceed to Checkout"`; US5-TC1-1 steps | The control a reader presses has two names. The page and delta say "Pay", while the label, the cart page and the case steps say "Proceed to Checkout". US5-TC1-1 clicks "Proceed to Checkout" but expects "Pay shows loading" | Checkout page owner | Name the control once on the page, for example "Pay (Proceed to Checkout)", and align the case wording | open |
| F6 | fix | Delta MODIFIED `Shopify uses the store's carrier rule` (spec.md:318-350, adds SC-56) vs [checkout.md](../../../docs/prds/products/grade10-site/store/checkout.md) | No page line asks for carrier rates, token gating or preview parity, so the modification serves no 🚧 or unmarked line | Checkout page owner | Add an unmarked page line for the served-destination rate and preview parity, or keep the requirement out of the delta and verify SC-56 through cases and task 11.10 | open |
| F7 | fix | 🚧 [checkout.md:64-66](../../../docs/prds/products/grade10-site/store/checkout.md) ("No separate checkout page") vs delta SC-01, SC-04 and SC-06 ("opens checkout", "is on checkout", "on the public checkout") | No requirement in this delta states the no-page outcome; `add-store-cart-drawer-ui` does ("Checkout SHALL NOT open a separate surface"). The kept scenarios still describe checkout as a place to open and be on | Checkout planning owner | Name the owning change in the proposal's Preserved Dependencies, or reword the kept scenarios to "the drawer's checkout review" | open |
| F8 | fix | [checkout.md](../../../docs/prds/products/grade10-site/store/checkout.md); `check:manual` "holds 19 test cases and no page shows them" | The page embeds no `::cases`, so 45 draft cases will publish with no page showing them | Checkout page owner | Add `::cases` for `grade10-site/store/checkout` | open |
| F9 | fix | [feature-tcs.md:3869-3870](specs/grade10-site/store/checkout/feature-tcs.md) Task Dispositions; [planning-run.md:88](planning-run.md) | Both say tasks 11.6 and 11.7 "do not yet name" SC-64 and SC-65, but `tasks.md` 11.6 and 11.7 now cite both | Checkout QA owner | Update both records | open |
| N1 | note | Delta ADDED **Request** ("SHALL send no purchase key, cart id or cart version") and its preamble ("the drawer holds no purchase identity of its own") vs the unchanged durable "The storefront SHALL identify one checkout intent across the Pay action and a same-session reload" | These do not contradict each other, because the store can identify the intent itself from the member's cart id and edited version, as today's backend does. But they fix today's request shape into the durable contract, so `add-checkout-purchase-safety` must MODIFY this requirement if its design needs a key from the browser | `add-checkout-purchase-safety` owner | Record the dependency in that proposal | open |
| N2 | note | [checkout.md:37](../../../docs/prds/products/grade10-site/store/checkout.md) ("within seconds") | No requirement states a settlement clock. The line predates this change | Checkout page owner | Page | open |
| N3 | note | [checkout.md:76](../../../docs/prds/products/grade10-site/store/checkout.md); [ui-design.md:25-26](ui-design.md) | The unmarked "Order labels" line says "this change adds no new badge"; an unmarked line should state the product, not a change. The Components table has three header columns over a four-column separator | Checkout planning owner | Page; ui-design | open |

## Checks

- **Warnings** - No `spec ... changed meaning` warning names a page in scope. The checkout warnings appear under Gates and in F8.
- **Page to delta** - Four 🚧 lines are served: Checkout integration, One Pay at a time, Later cart and Return path. "No separate checkout page" is not (F7). The ADDED requirement and three MODIFIED requirements serve page lines; the carrier modification does not (F6). The unmarked Another Pay, Changed purchase and Recovery lines are carried by the unchanged durable requirement, except for the member-edit-only retirement clause, which feeds B2.
- **Same facts** - Two blockers: B1 (where the verification gate appears) and B2 (whether the invoice stays open after member edits). One naming fix: F5. HKD 120,000, gross goods, the 2,000 ms poll, points above 0 and the closed answer set all agree.
- **Nothing open** - The page has no ❓ or `TBC` line. Every `## Raised` row in this change has landed (Q20-Q33), and there is no `awaiting:` entry. `add-checkout-purchase-safety` still has one open Raised row; that change is proposal-only and is not under acceptance here.
- **Folded result** - All four MODIFIED requirement names exist on main. "A checkout intent is safe to repeat" stays unmodified, and with server-side identification it does not conflict with the ADDED requirement (N1). `Purpose` is kept. The Feature set loses durable scope (F1), and the folded suite leaves six durable scenarios untraced (F2).
- **Designs** - Every ui-design state ties to an anchor and to scenarios or an out-of-suite disposition. The "Changed cart during Pay" state inherits B2. The tech design delivers every requirement. It adds one unstated condition (F4), and its Context table misses the reuse and discard facts (F3). Its claims about `checkout.ts`, `schemas.ts`, `convertCart`, the answer mapping and the polling were checked against the application.
- **Journeys and cases** - Each of US-01 to US-06 is served by scenarios. Every delta scenario has a draft case except SC-07 and SC-08, which are out of suite with verifier tasks. Every QA2 case, scenario, task and UI disposition is recorded. The 45 draft and 47 deprecated cases stay draft or deprecated. The open tasks cite every delta scenario.
- **Overlap** - No other active change has a delta on `grade10-site/store/checkout`. `add-checkout-purchase-safety` has no delta. `add-store-cart-drawer-ui` (a different capability, not accepted) agrees with this delta on the gate and the absence of a separate surface. It feeds F4 and F7.

Apart from X1, this change is not ready to accept: B1 and B2 are its own blockers. Each has one clear source repair. B2 changes scenario text, so a fresh review follows the repairs.

Not ready - 3 blockers

---

## Historical review - 2026-10-08

This section is the previous ledger, kept as history. It reviewed `d66ee0e34e7e67ce09fe1b8554940d5ed92d643d` with the verdict "Not ready - 2 blockers". Both of its blockers were fixed in `39ed50c5a6ca`, as recorded above.

### Review Scope

Fresh acceptance review dated 2026-10-08. This reviewer did not write the plan. The reviewed SHA identifies local committed `HEAD`; the working amendment remains uncommitted and is identified by the draft fingerprint below. Published store `main` was already fetched by the planning owner at `b0bc23de57201d3cbcdf8a5b671b0869b9ba7ecb`. This run does not accept or publish the amendment.

- **Draft fingerprint** - `05f80d5f44e1cf1d90c1d1beb9948112b406052ddf0d3fd89b3a6c1e1fc714eb`, reported by this run's acceptance preflight
- **Durable baseline fingerprint** - `95d4bdf3f982412b8fcf71949706033025b35f7b742317fcc247a6a232ca15c1`, reported by the same preflight
- **QA2 handoff** - `/tmp/g10-checkout-followup-qa2-handoff.json` reports Ready. This is a planning handoff, not acceptance or implementation evidence
- **Pending content scope** - Includes the SC61 zero bounds and price wire rules, SC62 member counters and stock review, and application provenance `5b434c7` / merge `665aaa9ee`. Their content and implementation provenance remain unreviewed by this acceptance run

### Gates

All commands use Node `24.14.1`, with its bin directory first in `PATH`, and `PLAN_NO_FETCH=1` against the already fetched baseline.

| Command | Observed Result | Evidence |
| --- | --- | --- |
| `pnpm plan:review-preflight add-shopify-checkout-integration --json` | Exit 0; `status: ready`; 6 changed requirements; 0 overlaps; 0 blockers. Run once | `/tmp/g10-checkout-followup-accept-review-preflight.json` |
| `pnpm accept:preflight add-shopify-checkout-integration` | Exit 1; 2 unresolved story references; 0 `fold:retitled-case` failures; 3 durable files to write | `/tmp/g10-checkout-followup-accept-gate.log` |
| `pnpm check:manual` | Exit 1; 2 failures; 272 warnings. Both failures are the story references below | `/tmp/g10-checkout-followup-manual-gate.log` |

**Content review** - Stopped. [accept-review](../../../.claude/skills/accept-review/SKILL.md#flow) states: "A refusal from either stops the review." No page-to-delta, same-facts, folded-contract, design, journey, case-content or overlap content verdict is issued. The preflight's empty overlap list is only its gate result. Manual warnings have not been assessed as content findings while the gates refuse the draft.

### Findings

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | [Auction management](../../../docs/prds/products/grade10-admin/auction/management.md), source line 432; `apps/preview/storybook-static/index.json` | `auction-admin-payment-settings--loaded` remains absent from the generated index. Both fresh gates refuse this reference. This page is outside the amendment's edit scope | Auction management page and workbench owner | Restore its intended story export and regenerate through the supported build, or reconcile the page's reference with the intended story | open |
| 2 | blocker | [Auction listing](../../../docs/prds/products/shared/ui/auction-listing.md), source line 139; `apps/preview/storybook-static/index.json` | `auction-listing-listingdetails--default` remains absent from the generated index. Both fresh gates refuse this reference. This page is outside the amendment's edit scope | Auction listing page and workbench owner | Restore its intended story export and regenerate through the supported build, or reconcile the page's reference with the intended story | open |
| 3 | blocker | [Published suite](../../specs/grade10-site/store/checkout/feature-tcs.md) and [amendment suite](specs/grade10-site/store/checkout/feature-tcs.md) | Prior case-lineage blocker is cleared. Direct source comparison verifies identical permanent trace IDs at all 19 previously conflicting addresses. The fresh acceptance gate reports no retitled-case failure | Checkout planning and QA owner | Published repair `a78cc27c503829c6da952abf9a1675b22cc01cc6`, adopted into the local draft | fixed a78cc27c503829c6da952abf9a1675b22cc01cc6 |

### Case Identity Verification

The verified addresses are `US1-TC1` through `US1-TC10`, `US2-TC1` through `US2-TC3`, `US3-TC1` through `US3-TC5`, and `US4-TC1`, each with the prefix `grade10-site-store-checkout-`. All 19 current amendment markers match their durable permanent IDs. This verifies the identity repair, not the cases' assertions. Direct counting of the amendment suite finds 89 issued case headings: 55 draft and 34 deprecated.

Rerun fresh acceptance review after both refusing gates pass. No planning sources were edited by this reviewer.

Not ready - 2 blockers
