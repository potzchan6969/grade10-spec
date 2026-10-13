reviewed: 4c87ac92198e99b4878fe4bda82a08ef5797e6ad
source-identity: 9654d95cb1cc73aaad7409f97d3fa0c29c752549111e8a865f7785614b9461b6
baseline-identity: ee6936709a83cef1f222ad585bc956b7b33f5ef7af4dd6b22de3410904c43e2e
verdict: Not ready - 2 blockers

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `spec.md` Requirement "A slab names its own unit" ("A graded product is a consigned product, or one whose collectible type is a graded one"); `tech-design.md` Product to item, **Graded**; page `shelf-scanning.md:95-96` | Every consigned product is called graded, but the page makes only the collectible type mark a slab, and nothing makes a consigned item a slab. Inventory holds non-slab items (`grade10-admin/inventory/items.md:8`), consignment takes "a card" (`consignment/index.md:88`), and the consigned push lists any item (`services/consigned/sync.ts`). A raw consigned card would be held as `no_item` and keep the `unit_missing` monitor raised for as long as it is listed, so SC49's "clears once none is held" never happens. Define graded as a graded collectible type, or a consigned item that inventory holds with a grader, and state that on the page | PM, Dev | page Slabs, then `spec.md`, then `tech-design.md` | open |
| 2 | blocker | `pnpm accept:preflight add-store-shelf-scan-sync` (`[tcs:validate]`, 10 errors) | `spec:accept` would refuse. The errors belong to other changes on the same main: `align-collector-times-to-local-zone` and `drop-auction-card` suites, plus the durable `shared/dates-and-times` and `shared/ui/auction-listing` suites, which name a missing `auction-card.test.ts` or use the old suite shape. None is in this change | Owners of those changes / planning-dev | those suites on main | open |
| 3 | fix | `decisions.md` Q4 (owner: "within 5 minutes … within 10") vs Q35 (round: 6 and 11) and the page Values | The round changed a number the owner gave. Q4 still says 5 and 10 and is not marked as replaced, while the page shows 6 and 11 under an owner "Freshness" row. Mark Q4 as revised by Q35, as Q7a does, and have the owner confirm 6 and 11 | PM | `decisions.md` | open |
| 4 | fix | page Values "within the hour"; `spec.md` SC20; feature-tcs US1-TC11 (waits 66 min) vs `tech-design.md` Operations | The `photos` job runs hourly at `:17` on a GitHub schedule. A photo that arrives just after a run waits about 59 minutes, plus GitHub's schedule delay, plus install and processing time. "Within the hour" cannot be kept, and US1-TC11 will flake. Say "at the next hourly run", as SC22 does, or give a bound the schedule can keep | PM, Dev | page Values and Photos, then SC20, then US1-TC11 | open |
| 5 | fix | `tech-design.md` Slab facts **One batch** and Store pass step 3 vs `StoreItemSlabs.slabsOf` "at most 500 together" (task 4.1) | The pass reads slab facts in one call, and that call refuses more than 500 item ids and label codes. A shop with more than 500 graded products fails every pass and holds nothing new. Chunk the read in the pass, or state the limit and what happens past it | Dev | `tech-design.md`, task 6.4 | open |
| 6 | fix | `tech-design.md` Product to item, `kind` row vs the example (`shopify-8812` `"kind": "slab"`) | `kind` comes only from the collectible type, but the consigned push sets no collectible type, so a consigned slab maps to `other` while the example shows `slab`. Derive `slab` from a known unit or the graded rule | Dev | `tech-design.md`, task 6.3 | open |
| 7 | fix | `tech-design.md` Context **Close store matches** vs `src/app/hosted/client.ts:117-122,210-230` | Context says today's `ItemIndex.resolve` answers `{ how: "photos", items }`. Today it answers one `{ how: "photo", item }` and has no pick. The pick (SC36-SC42, task 3.4) is new behaviour and belongs under Decisions/Scanner, with how alternatives become items | Dev | `tech-design.md` | open |
| 8 | fix | `tech-design.md` Scanner **No-op upsert** vs `worker/platform/routes.ts:470-474` | `upsertItem` reads only `seq, collection_id`, not the stored row. The comparison needs its SELECT widened. State this so the task 2.4 estimate is honest | Dev | `tech-design.md` | open |
| 9 | fix | `add-store-cart-drawer-ui/reconciliation.md` "Shelf Scan Sync"; `.openspec.yaml` `depends_on` | The cluster entry sits in another change's sheet, which archives with that change. Its order says "accepted after `refresh-listing-within-seconds` and `add-store-product-status`", but neither has an `acceptance.json`. Accept those first, or say the dependency is build-only, since this change reads them and edits none of their requirements | planning-dev | the cluster sheet | open |
| 10 | note | `decisions.md` Q27; `spec.md` "The scanner learns new photos every hour" table; page Photos | The 24-hour retry (Q27) and the model guard (SC24) are requirements with no page line. Q27 names no page line that carries it. Add one Photos line | PM | page Photos | open |
| 11 | note | `spec.md` Requirement "A store product is named before the shared card catalogue" vs page `shelf-scanning.md:107-108` | The requirement adds "a match the scanner accepts on its own". The page says only "match the same art". Sensible, but the page could state it | PM | page Recognition | open |
| 12 | note | `spec.md` Feature set "Open scanner stays current … every few minutes" | The requirement and page say 2 minutes. Use the number | Dev | `spec.md` Feature set | open |
| 13 | note | `tech-design.md` **Discounts move every item** | The `readSiteDiscounts` memo can be up to 60 s stale, so a discount created just before a tick can reach the scan up to about 7 minutes after it starts, beyond SC33's 6. Bypass the memo in the pass | Dev | `tech-design.md` | open |
| 14 | note | `user-journeys.md` | Journey ids run US1-US4, US7, US6, and US5 is absent. Valid, but the order is odd | QA | - | open |

## Questions

1. **Is a consigned item always a slab?** - Decide what makes a consigned store product graded.
   - **A - Graded collectible type, or a consigned item inventory holds with a grader - Recommended** - A raw consigned card is held as a raw card, and Operations is alerted only for real slabs. Costs a page line and a reworded requirement.
   - **B - Every consigned product is a slab** - Keeps the current text. Every raw or non-card consignment raises the Operations alert for as long as it is listed.
   - **Why it matters** - It decides whether the `unit_missing` alert means anything.
   - **Blocks** - Finding 1.
   - **Reasons** - `grade10-admin/inventory/items.md:8` holds non-slab items; `consignment/index.md:88` lists "each item" as a store product.
2. **Freshness 6 and 11 minutes** - Confirm the round's 6 and 11 minutes from the shop's save (Q35) in place of your 5 and 10 (Q4).
   - **A - Confirm 6 and 11 - Recommended** - The 5-minute schedule can keep these. Q4 is marked revised.
   - **B - Keep 5 and 10 from the save** - Needs a pass triggered by each change report, one more moving part (Q35 "Instead of").
   - **Why it matters** - It is the number shopkeepers are promised.
   - **Blocks** - None: optional confirmation.
   - **Reasons** - `decisions.md` Q4, Q35.

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Drift: `git log HEAD..FETCH_HEAD` over the change, store PRD and spec dirs, the two dependencies, commerce PRDs, cart-drawer reconciliation | FETCH_HEAD 7f8fd2718 | no commits; no `implementation.json` on main | - |
| `plan:review-preflight` | digest 9654d95c…, status ready, overlaps none | manifest | - |
| `accept:preflight` | fingerprint aba6b787…, baseline ee693670… | refused (finding 2); durable files to write: 4 | - |
| `check:manual` | 0 failures; no shelf-scanning or `changed meaning` warning | Warnings | - |
| `docs/prds/products/grade10-site/store/shelf-scanning.md` | 4c87ac921 | Page to delta, Same facts, Nothing open | - |
| `product-listing.md#product-data`, `product-status.md#availability`, `carried-surfaces.md` | 4c87ac921 | Same facts, Folded result | - |
| proposal, decisions (Q1-Q37, Raised 18/18 landed), user-journeys | 4c87ac921 | owner faithfulness, Nothing open | - |
| `spec.md` (6 requirements, 50 scenarios, Feature set) | 4c87ac921 | Page to delta, Journeys | - |
| `ui-design.md`, `tech-design.md`, `tasks.md` | 4c87ac921 | Designs; claims checked against grade10 worktree 2785385369 (tcg-ar routes, auth, rpc, client, HostedApp, recog worker, ops workflow; store cron, keeper, deps, consigned sync, siteDiscounts; inventory items schema; surfaces.ts; reference alphabet) | - |
| `feature-tcs.md` Reconciliation, `domain-tcs.md` | 4c87ac921 | QA2 dispositions (45/50 covers, 50/50 scenarios, partials explained), drafts only | QA2 final receipts at 4c87ac921 |
| Cluster sheet `add-store-cart-drawer-ui/reconciliation.md` | 4c87ac921 | Ownership, Order (finding 9) | - |
