reviewed: e220520f30e28ebcaf960d72d6a29a380ab35566
source-identity: sha256:5e6eaeaeda00ff12bb3e6e2f51914ba724c547e15e1e6d14590e8e2d76c6a793
baseline-identity: sha256:07c43fb80818a56da52659a29f6b2ce52be821e6fa878c546da0a4787005dd87
verdict: Ready to accept

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `openspec/changes/add-store-product-status/proposal.md:66-72`; `openspec/changes/add-store-product-status/tasks.md:26,29`; `openspec/changes/add-store-product-status/decisions.md:30`; `docs/prds/products/grade10-site/store/cart-validation.md:26-30`; `openspec/changes/add-store-product-status/specs/grade10-site/store/cart-validation/spec.md:182-189,360-376` | The previous candidate did not distinguish an open-read sold-out line from a new checkout-time contradiction. The current proposal and task 4.2 now state separately that an open-read sold-out line is excluded while live lines may proceed, an all-sold-out cart waits for removal, and a new checkout-time contradiction blocks handoff. Those outcomes match Q13, the PRD, SC-26, and the checkout contradiction requirement and SC-15. | Product / Dev | Distinguish the open-read, all-sold-out and checkout-time contradiction outcomes in the proposal and task 4.2 | fixed e220520f30e28ebcaf960d72d6a29a380ab35566 |
| 2 | blocker | `openspec/specs/shared/ui/store-cart/feature-tcs.md:110`; `openspec/changes/add-store-product-status/specs/shared/ui/store-cart/feature-tcs.md:11,185-195` | The previous candidate duplicated the durable US6/TC6 journey and was refused by accept preflight. The current delta uses the canonical journey heading, removes duplicate TC6, and records the QA2 reconciliation for the four remaining new cases. | QA | Remove duplicate case and reconcile journey | fixed 9aebbd806d86b8780389866525bb7f200312f072 |
| 3 | blocker | `docs/prds/products/grade10-site/store/product-listing.md:19`; `openspec/changes/add-store-product-status/decisions.md:42`; `openspec/changes/add-store-product-status/specs/grade10-site/commerce/product-status/spec.md:297-305` | The prior Product Listing question left draft/unpublished-product treatment for cards, counts and search unsettled. Q25 records the decision to omit them from all three, the question mark is removed, and the delta requires unpublished products to be absent from browsing. | Product | Confirm the product fact in the PRD and decision log, then align the delta | fixed 9aebbd806d86b8780389866525bb7f200312f072 |
| 4 | blocker | `docs/prds/products/grade10-site/store/cart-validation.md:58-67`; `openspec/changes/add-store-product-status/decisions.md:43`; `openspec/changes/add-store-product-status/proposal.md:18-21` | The prior unmeasured marker did not define the proposal's baseline. Q26 now specifies the first 30 full production days and the `contradicted`/all-outcomes ratio; the PRD carries that method and identifies the existing per-checkout outcome metric and Commerce view. | Product | Define the measure in the PRD and decisions, then align the proposal | fixed 9aebbd806d86b8780389866525bb7f200312f072 |

## Closed raised rows

- Q3 — Cart Validation `A check that cannot finish` and the cart-validation `In flight` requirement.
- Q5 — Product Details `Buy` and `Availability without stock pressure`; the redesign rebase plan.
- Q6 — Product Listing `Price order`; `list-cards-for-sale-first`.
- Q7 — Product Details `Low-stock annotation`; `ui-design.md` Product details.
- Q8 — Product Details shared-block counts; tech-design Non-Goals.
- Q9 — Cart Validation `A cart that never loaded`; `cart-drawer-empty-state` task 2.2 and Store Cart `Not read yet`.
- Q10 — Store Home `Merchandised row`; Store domain US2-TC2 and US3-TC1.
- Q11 — Product Details `One item per card`; product-status requirement and scenario.
- Q12 — Cart Validation `Fewer than asked` and `A new price`; cart-validation scenario `A line both shrank and was repriced`.
- Q13 — Cart Validation `Sold-Out Line` > `Checkout`; cart-validation SC-26. The proposal and task wording now align with SC-26: an open-read sold-out line stays out of totals and checkout, live lines may proceed, and checkout waits when no line still sells.
- Q14 — Cart Validation `A product that left the shop` and `Every moved line at once`; cart-validation unavailable-at-checkout and back-to-cart scenarios.
- Q15 — cart-validation handoff requirement; `add-shopify-checkout-integration` amendment and Store domain US7-TC1.
- Q16 — Product Status `Priced either way`; product-status `Priced but unbuyable`; product-page sold-out requirement.
- Q17 (Product Listing) — Product Listing `Within seconds`; `refresh-listing-within-seconds` rebase.
- Q17 (Product Page) — Store domain US8/US9 and the next product-page scenario for `add-store-locator` and `add-account-profile`.
- Q18 — Product Listing signed-out add; product-status `No browse ceiling`; product-page signed-out add.
- Q19 — Product Status `A line keeps its item`; product-status `One item per card` and its cart-line scenario.
- Q20 — Product Status `Selling past a count`; product-status `Count as bound` and its quantity scenario.
- Q22 — Store Cart stepper/remaining-count rules; cart-validation `In flight` and the edit-read behavior.
- Q23 — Cart Validation `A new price`; cart-validation `Repriced`.
- Q24 — Crawlable Pages `A card is a product with an offer`; tech-design `Structured data`.

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Change sources and 348 indexed review inputs | Candidate `e220520f30e28ebcaf960d72d6a29a380ab35566`; scope SHA-256 `5e6eaeaeda00ff12bb3e6e2f51914ba724c547e15e1e6d14590e8e2d76c6a793` | Re-reviewed changed proposal/tasks against Q13, the Cart Validation PRD, the open-read SC-26 and the checkout-time contradiction requirement/SC-15. The distinction is explicit and consistent. Carried forward the repaired TCS, unpublished-product and metric findings from candidate 9aebbd806. | Review at `9aebbd806d86b8780389866525bb7f200312f072` for unchanged scope; changed sources rechecked here |
| Durable baseline and fold targets | `origin/main` `877943c1d80d234d094d3d89ec1f05b82b937379`; baseline SHA-256 `07c43fb80818a56da52659a29f6b2ce52be821e6fa878c546da0a4787005dd87` | Checked the affected Product Status, Cart Validation, Product Listing, Product Page and shared Store Cart contracts, the Cart Validation purpose against its PRD/proposal, and the planned durable write set. No same-capability active overlap. | Prior ledger for unchanged contracts; affected fold dependencies rechecked here |
| `pnpm run plan:review-preflight add-store-product-status --json` | Candidate scope SHA-256 `5e6eaeaeda00ff12bb3e6e2f51914ba724c547e15e1e6d14590e8e2d76c6a793` | Exit 0; status ready; no blockers, overlaps or source expansions; 348 inputs. | Rerun for candidate |
| `pnpm run accept:preflight add-store-product-status` | Candidate `e220520f30e28ebcaf960d72d6a29a380ab35566`; fingerprint `923a990ed6330b277aa6ca5ad1230fa9821f69074dc4618c2cd27a917428e33e`; baseline SHA-256 above | Exit 0; fold ready; 12 durable files. The historical Purpose-drift note was checked against the current delta Purpose, linked Cart Validation PRD and proposal; no purpose-scope mismatch found. | Rerun for candidate |
| `pnpm run check:manual` | Candidate `e220520f30e28ebcaf960d72d6a29a380ab35566` | 0 failures; 92 warnings. | Rerun for candidate |
| Existing checkout metric evidence | App `origin/main` `6897dc37891d453b30594bdb9789ff2afb8d847f` | `checkout.ts:280-283` emits `store.checkout.outcome` with the outcome tag; the Commerce board at `scripts/datadog/boards/commerce.mjs:194-197` groups that metric by outcome and reason. Supports Q26's existing-metric basis. | Rechecked on unchanged app baseline |

Ready to accept

