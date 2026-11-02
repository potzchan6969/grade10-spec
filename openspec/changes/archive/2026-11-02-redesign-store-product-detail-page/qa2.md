# QA2 reconciliation — `redesign-store-product-detail-page`

**QA2 status:** Reconciled. The Store PRD suite remains `pending-review · 0/20`; all cases remain draft. This is QA2 evidence, not a human TCS review or an acceptance decision.

## Snapshot and inputs

Reviewed the working tree at `bbc1bd02f7df3700ae59eb9e41813a74053f76f6`, including its uncommitted planning changes. The latest `pnpm plan:review-preflight redesign-store-product-detail-page --json` source identity was SHA-256 `843d4528a6cdd428f56aed27de9b23e0c36e2625dcfba5b292f72d4a498dc021` (`inputCount: 325`, status `ready`). Its change inputs were `decisions.md`, `proposal.md`, the product-page delta spec and journeys, `tasks.md`, `tech-design.md`, and `ui-design.md`.

The Store reconciliation inputs and content digests were:

| Input | SHA-256 |
| --- | --- |
| [Product Details PRD](../../../docs/prds/products/grade10-site/store/product-page.md) | `b9a4fcfe2c461c22ace4b7f7951ba3980d11235924d47bc27f0a1c71656c43a9` |
| [Product Details test suite](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md) | `282d1b6448651e06b771e4ad45338fc3f0bc89c3c4018d5a0889ca63813bc8b2` |
| [Change decisions](decisions.md) | `c0e33a6d00e303472ed7ae96420c5437c41740f0085233913e9c6644c998b722` |
| [Product-page delta spec](specs/grade10-site/store/product-page/spec.md) | `a36655e091544d83cfb4ede0f3dc587d86de261d974c2158706d23bd07a702f4` |
| [Product-page delta journeys](specs/grade10-site/store/product-page/user-journeys.md) | `130dc2e32696d25b7df330688cbf0604608132858f5c662e668cae8d875407c8` |
| [UI design](ui-design.md) | `866418c112eba378d7770290f7f52b8041d8aa13b50d90fd6d8f7d290501ece2` |
| [Analytics event contract](../../specs/grade10-site/analytics/analytics/spec.md) — linked by the device-width decision | `0f1d4efd0f1741ecabea3d2f42ed9c1517c06d6b0656e4203ace91f6819caefa` |
| [Product Detail screen stories](../../../apps/preview/src/pages/store/product-page/product-detail-page.stories.tsx) | `33e2cbb609bf8f49e1681f0cebf281328f3b680ef5cbee58ad9914cf3a6c0192` |
| [StoreProductDetail part stories](../../../apps/preview/src/pages/store/product-page/store-product-detail.stories.tsx) | `22e99578fc46a315c1e64126c789623f1cec730c07b4b8044b647df41e1eb350` |
| [Product Detail story fixtures](../../../apps/preview/src/pages/store/product-page/product-detail-content.ts) | `a4bd09e3c336a092a4ca04137815d518aff9d7be71b26305da43490194204110` |
| [StoreProductDescription stories](../../../packages/ui/src/blocks/store-product/store-product-description.stories.tsx) | `f84e7c8a3b3a9be0a3519225174fba0341ff44085493a621c1c19e4875e970d2` |
| [StoreProductMetadata stories](../../../packages/ui/src/blocks/store-product/store-product-metadata.stories.tsx) | `98911fe63f93359e7356ce4d133456647500437eb6f249396b96ef12895e9c1d` |
| [StoreProductPurchasePanel stories](../../../packages/ui/src/blocks/store-product/store-product-purchase-panel.stories.tsx) | `1bbc5c1429f9d7572e4473ab3a45dfa1061e59a4b1328e5a930f466873893fb2` |
| [StoreProductHeader stories](../../../packages/ui/src/blocks/store-product/store-product-header.stories.tsx) | `92386d856709445f84046586b423100f6991c939f82015b3c53119ae926aad6d` |

The [Store rules](../../../docs/governance/specs-to-test-cases.md#store) make the PRD and Storybook the source of truth and prohibit scenario `covers` links on Store cases. Accordingly, this file supplies the manual SC-13…SC-18 map; no such links were added to the suite.

## Case dispositions

| Case | Disposition and source basis |
| --- | --- |
| [TC1, rev 2](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L39) | Retain as the live card case and keep draft. Its two rows cover the two-image catalogue order/alt text, the no-image placeholder, full and absent optional facts, supplied SKU display and absent SKU omission, current price, one sellable item, and no scarcity cue. The absent-SKU expectation follows the [PRD's conditional SKU rule](../../../docs/prds/products/grade10-site/store/product-page.md#L17). Its trace includes Media Gallery, Badges, SKU, One Item to Buy, Card, and Stock. Default is scoped to the pictured row; NoMedia is scoped to the no-image row. |
| TC21 | Folded into TC1's two-image row; do not retain a separate case. Same product-page route and card observation. TC1 owns gallery order/alt text and current price; existing TC10 remains the dedicated comparison/discount case, avoiding a duplicate compare-at expectation. |
| TC22 | Folded into TC1's no-image row; do not retain a separate case. This is the empty-image edge of the same gallery route, not a distinct route. |
| TC23 | Folded into TC1's full/absent optional-facts rows; do not retain a separate case. TC1 already owns badge display, and now also checks SKU placement/omission. TC9 remains focused on fulfilment copy and Store Locator behavior. |
| [TC2, rev 2](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L77) | Retain and keep draft. The prior one-line question is resolved to “fits within three lines” by the PRD Description rule. The revised case checks short/no-button and long collapsed → expanded → collapsed behavior, `aria-expanded`, `aria-controls`, and unchanged address. |
| [TC6, rev 3](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L190) | Retain and keep draft. It covers the chosen quantity, pending disabled controls and Adding label, drawer/reset, no inline confirmation, signed-out add, and one cart line after adding again. |
| [TC9](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L147) | Retain unchanged and draft. It covers both supported language prefixes, static shipping/pick-up copy, plain-text Shipping fee, and Store Locator in the same tab and language. |
| [TC3](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L297) | Retain unchanged and draft for the sold-out path; its screen story shows the disabled Sold out action and the case verifies price and no cart line. |
| [TC10](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L476) | Retain unchanged and draft. It remains responsible for compare-at/struck-price and discount behavior; TC1 does not duplicate those assertions. |

TC21–TC23 are absent from the final suite after grouping. The header remains `pending-review · 0/20`; no case was approved or executed.

## Scenario coverage against PRD and Storybook

| Scenario | PRD anchors and case coverage | Storybook evidence and QA2 disposition |
| --- | --- | --- |
| [SC-13](specs/grade10-site/store/product-page/spec.md#L24) | [Media Gallery, Sale Price, and Stock](../../../docs/prds/products/grade10-site/store/product-page.md#L13): TC1 asserts all supplied images in order with descriptive alt text, current price, and no scarcity cue. TC10 covers compare-at/struck-price behavior under the Sale Price anchor. | `store-product-page-screens-product-detail--default` is backed by two images and a compare-at value; its play checks the first image, current price, and no remaining count, but does not itself assert the second image/order or compare-at. Those details are explicit in TC1/TC10. Coverage is split by the PRD's card-summary versus comparison/discount claims to avoid duplicating TC10. |
| [SC-14](specs/grade10-site/store/product-page/spec.md#L34) | [Media Gallery](../../../docs/prds/products/grade10-site/store/product-page.md#L13): TC1's no-image row asserts one accessible placeholder, no empty image, and no page-invented URL. | `store-product-page-screens-product-detail--no-media` checks the named accessible placeholder. The case carries the additional no-empty/fabricated-URL assertions. Covered. |
| [SC-15](specs/grade10-site/store/product-page/spec.md#L43) | [Badges](../../../docs/prds/products/grade10-site/store/product-page.md#L16), [SKU](../../../docs/prds/products/grade10-site/store/product-page.md#L17), and [Free Pick-up](../../../docs/prds/products/grade10-site/store/product-page.md#L39): TC1 covers supplied/absent facts, non-interactive badges, supplied SKU placement, and omission when no SKU is supplied; TC9 covers fulfilment copy and link behavior. | `store-product-page-blocks-storeproductmetadata--default` shows a supplied badge and SKU; the exact `store-product-page-blocks-storeproductmetadata--without-sku` story asserts no SKU is rendered when none is supplied. `store-product-page-parts-storeproductdetail--default` checks Store Locator and Shipping fee link behavior. Storybook has no dedicated partial-badge story; TC1's absent-world/language row covers that edge. Covered. |
| [SC-16](specs/grade10-site/store/product-page/spec.md#L70) | [Description](../../../docs/prds/products/grade10-site/store/product-page.md#L18): TC2 now asserts the short no-button state and the long collapsed/expanded/collapsed states, ARIA state/control, and same address. | `store-product-page-blocks-storeproductdescription--short` checks no disclosure button; the block Default story checks `aria-expanded` false/true; `store-product-page-screens-product-detail--description-expanded` exercises expand and collapse. Covered. |
| [SC-17](specs/grade10-site/store/product-page/spec.md#L92) | [Quantity, Pending, Added, and Adding Again](../../../docs/prds/products/grade10-site/store/product-page.md#L24): TC6 checks quantity 2, disabled controls and Adding label while pending, drawer with quantity 2, reset, no inline confirmation, then one line at 3. | `store-product-page-blocks-storeproductpurchasepanel--default` checks pending disablement, reset, and no “Added to cart” message; `store-product-page-screens-product-detail--add-quantity-pending-then-drawer-opens` checks drawer opening/reset. Covered. |
| [SC-18](specs/grade10-site/store/product-page/spec.md#L105) | [Sold Out](../../../docs/prds/products/grade10-site/store/product-page.md#L31): TC3 checks the sold-out card/price and no cart line. | `store-product-page-screens-product-detail--sold-out` checks the disabled Sold out button; the StoreProductHeader SoldOut story keeps the price visible. Covered. |

## Uncovered, overclaimed, and deferred items

- **Uncovered PRD rules:** none in this product-page scope. The full TCS validation no longer reports `product-page#product-card/media-gallery` as uncovered after TC1's trace was updated.
- **Over-claimed stories:** none remain in the final rows. TC1 now pairs the pictured row with `--default` and the no-image row with `--no-media`. Storybook does not assert every manual expectation (notably all-image ordering/alt text and compare-at), so those assertions remain explicit in the draft cases rather than being attributed to the stories.
- **Scenario co-location note:** SC-13's catalogue/gallery checks are in TC1 and its compare-at/discount assertion is in TC10. TC10 uses its established price rows rather than duplicating them in TC1; both cases exercise the product page and cover their respective PRD anchors.
- **Deferred/out of suite:** the unresolved [CDN image-transformation fallback](../../../docs/prds/products/grade10-site/store/product-page.md#L72) and [unmeasured shared-link opens](../../../docs/prds/products/grade10-site/store/product-page.md#L74) remain outside SC-13…SC-18. Existing [TC4](../../../docs/prds/products/grade10-site/store/tests/productDetails-tcs.md#L325) covers normal shared-link preview behavior, but not those open questions. Product-detail add rate by product is the recorded outcome; current events carry no device width and the change adds no instrumentation, per the [Analytics contract](../../specs/grade10-site/analytics/analytics/spec.md#L507), [Product decisions](../../../docs/prds/products/grade10-site/store/product-page.md#L69), and [decision row](decisions.md#L19). No new analytics case is claimed.

## Validation and final QA2 status

- `pnpm plan:review-preflight redesign-store-product-detail-page --json` — ready; no blockers; scope digest above.
- `pnpm run tcs:validate` — exit 0, no errors; 735 repository-wide non-blocking warnings. No product-page uncovered-rule warning remains.
- `pnpm check:manual` — exit 0, 0 failures and 92 existing warnings.
- `pnpm storybook:check` — exit 1 with 21 repository-wide story problems in Account/Vault; filtered output contains no Store Product Page diagnostic.
- Store case status remains `pending-review · 0/20`; cases remain draft for later human review.

**Final QA2 status: Complete — reconciled against the Store PRD and Storybook.** The product-page case dispositions and SC-13…SC-18 coverage are recorded above. The repository-wide Storybook check failure is outside this Store scope; no acceptance, archive, commit, or push was performed.
