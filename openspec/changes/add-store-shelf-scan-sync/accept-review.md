reviewed: 513d608f4
source-identity: cc87c3d1efc36bb026c397e8861d916403a88e7aa0a85181afe594e92cb4b55d
baseline-identity: ee6936709a83cef1f222ad585bc956b7b33f5ef7af4dd6b22de3410904c43e2e
verdict: Ready to accept

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `spec.md` "A slab names its own unit"; `tech-design.md` Product to item **Graded**; page Slabs | A consigned product was graded whatever its item. Q38 now makes it graded only when inventory holds its item with a grader. The rule reads the same on the page, the requirement, the feature set, tech design, tasks 6.1 and 6.3, SC51 and US1-TC27 | PM, Dev | - | fixed 143bd14a8 |
| 2 | blocker | `pnpm accept:preflight` `[tcs:validate]` | Other changes' suites failed validation. Fixed on main and merged at b24b3f605; the preflight now passes | other changes' owners | - | fixed b24b3f605 |
| 3 | fix | `decisions.md` Q4, Q35 | Q4 is marked "revised by Q35", and Q35 records that the owner was told 6 and 11 before authorising acceptance | PM | - | fixed 143bd14a8 |
| 4 | fix | page Values; SC20; US1-TC11 | Now "at the next hourly run" on the page, proposal, decisions, SC20 rev 2 and Risks. US1-TC11 rev 2 waits for the first run starting 6 minutes after the publish | PM, Dev | - | fixed e1625c180 |
| 5 | fix | `tech-design.md` Inventory first, One query per call, Store pass step 3; task 6.4 | `slabsOf` reads go in calls of at most 500, and a fault on any call fails the pass. Task 6.1 tests this | Dev | - | fixed 143bd14a8 |
| 6 | fix | `tech-design.md` `kind` row and example | A consigned slab is `slab` through its item; the example says so | Dev | - | fixed 143bd14a8 |
| 7 | fix | `tech-design.md` Context, Scanner **The pick** | Context now describes today's single `{ how: "photo", item }`, and the pick is new behaviour under Scanner. Checked against `client.ts:117-122,210-230` | Dev | - | fixed 143bd14a8 |
| 8 | fix | `tech-design.md` No-op upsert; task 2.4 | States that the `SELECT` widens from `seq, collection_id` (`routes.ts:470-474`, confirmed) | Dev | - | fixed 143bd14a8 |
| 9 | fix | `.openspec.yaml`; cart-drawer `reconciliation.md` | `depends_on` and the cluster entry are gone. Tech design cites built code, all on grade10 `main` (79b92f0b2): `handToKeeper` in `routes/webhooks.ts`, `runCatalogWalk` in `services/catalog/pass.ts` and `sweeps/cron.ts` on `*/5`, `sellableVariant`, `pricedVariant` and `productSummary` in store-frontend, and `readSiteDiscounts` and `readSitePricing`. No other change references this one | planning-dev | - | fixed 143bd14a8 |
| 10 | note | page Photos | Adds "Failures wait, never repeat" for the 24-hour retry and the model guard | PM | - | fixed 143bd14a8 |
| 11 | note | page Recognition | Now says "a match the scanner accepts on its own" | PM | - | fixed 143bd14a8 |
| 12 | note | `spec.md` Feature set | Says 2 minutes | Dev | - | fixed 143bd14a8 |
| 13 | note | `tech-design.md` Discounts move every item; tasks 5.1, 5.3 | The pass reads discounts fresh, skipping the memo (`readSiteDiscounts({ fresh: true })`) | Dev | - | fixed 143bd14a8 |
| 14 | note | `user-journeys.md` | Journey ids run US1-US4, US7, US6, with no US5 | QA | - | open |
| 15 | fix | `spec.md` "A slab names its own unit", "Names no item" row, Feature set; `tech-design.md` **Graded** and `no_item`; page "What makes a slab" | Two SHALLs disagreed for a consigned raw card a merchandiser typed as graded. Now inventory decides a consigned product whatever its type, and house stock is graded by type. The requirement, table row, feature set, page bullet, Decisions row, Q38, tech design, task 6.3, SC51 rev 2 and US1-TC27 rev 2 all say so | PM, Dev | - | fixed 233829674 |
| 16 | note | `decisions.md` Q27; `tech-design.md` Risks | Q27 names the discount read, and Risks states the outage trade-off. The pass monitor (no `outcome:ok` for 30 minutes) carries the alert | Dev | - | fixed 233829674 |
| 17 | note | page Decisions table; `decisions.md` Q38 | The page gains a "What makes a slab" row, decided by the round | PM | - | fixed 233829674 |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Drift: `git log HEAD..FETCH_HEAD` over the change, shelf-scanning, product-listing, product-status and carried-surfaces pages, `openspec/specs/grade10-site/store`, both former dependencies, the cart-drawer sheet | FETCH_HEAD 7f8fd2718, already merged at b24b3f605 | no commits; no `implementation.json` or archive for this change on main | - |
| `plan:review-preflight` | digest cc87c3d1…, status ready, overlaps none | manifest | - |
| `accept:preflight` | fingerprint 7590ba192fb81c19cec1d09b80a131a308fcdc76e8f6296ea875e4b9e6020414, baseline ee693670… | ready to fold and accept; 4 durable files | - |
| `check:manual` | 0 failures, 288 warnings, none on shelf-scanning and no `changed meaning` | Warnings | - |
| Repair diff `4c87ac921..5ca22e4f3` on the change, its pages and the cart-drawer sheet | 5ca22e4f3 | Each prior finding re-read at source; changed requirement text re-read ("A slab names its own unit", Feature set, SC20, SC51) | - |
| Repair diff `5ca22e4f3..513d608f4` | 513d608f4 | Findings 15-17 re-read at source; changed requirement sentence, "Names no item" row, Feature set leaf and SC51 rev 2 re-read; US1-TC27 rev 2 and QA2 rerun at 7230c711e; nothing new found | - |
| Q38 graded rule | 513d608f4 | page, decisions, spec requirement, feature set and table, tech design, tasks 6.1 and 6.3, SC14, SC15, SC51, US1-TC27, US3-TC1, US3-TC5, US4-TC3 | - |
| Unchanged requirements, ui-design, user-journeys, domain-tcs | 4c87ac921 | Page to delta, Same facts, Designs, Journeys | 4c87ac921 review |
| `feature-tcs.md` Reconciliation | 5ca22e4f3 | 51 cases, all draft; 51 scenarios, all covered; rerun disposition at e1625c180 | QA2 rerun receipt |
| grade10 code claims | origin/main 79b92f0b2 | `routes.ts` upsert SELECT, `client.ts` resolve and `bySeq`, `match.ts` `altWindow`/`altRel`, `siteDiscounts.ts` memo, consigned push metafields, inventory `items.grader` and `retired_at`, store cron `*/5` | - |
| Former dependencies | store 5ca22e4f3 | `refresh-listing-within-seconds` and `add-store-product-status` still unaccepted; the product-listing walk lines are still 🚧, but the code is built, and this change states its own 6/11-minute bounds | - |
