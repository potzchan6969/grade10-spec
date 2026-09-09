# Store frontend completion plan

## Scope

- **Owner scope** — product details, shopping cart, order history and order details UI plus consumption of existing typed Store reads and mutations
- **Backend dependency** — provider reads, API contracts, database changes, webhooks, reconciliation and deployment remain with their owners
- **Page acceptance** — the owner schedules cart and order verification later; this pass inspects code and plans remaining work, without claiming visual or live-backend acceptance
- **Planning base** — grade10 `a84b99f6981c7d2228019980d58c13d853542f01`; registered grade10-spec main `627fe9ef24e4167a4d3f10d4051c38b92a3a2a6f`, inspected 10 September 2026

## Evidence

| Surface | Current implementation | Remaining work |
| --- | --- | --- |
| Product details | Redesign PR #149 merged as `5e05c9ea5292c5d552f3dc49607429f7514b0b22`; gallery, selected price, badges, quantity and disclosure present on main | Optional shipping/pickup facts, reliable description overflow, stock-ceiling feedback from the existing stock change |
| Shopping cart | PR #286 open at `d16c2cd307a0267633c8e7f22f15e70e4137bad9`; scoped cart, live review and mutations wired in `chrome/CartDrawerHost.tsx` | Adapt to current drawer empty-state contract and omit obsolete promo props; existing group 2 already names this work; product record group 3 remains open |
| Order history | PR #279 open at `024348be1b318295828f24cfe2836d37bbc3ac8d`; `useOrders`, projections, session routes and tracking helpers present | Keep verification deferred; retain the tracked gitlink and product-record work; canonical status dependency below |
| Order details | Same PR; `useOrder`, owner-read refusal, rich totals, partial address and payment projection present | Localize three literal settlement labels in appended group 6; same status dependency |

- **Cart contract evidence** — current `CartDrawer` requires `emptyTitle`; the PR host supplies neither that prop nor `emptyDescription`, and still supplies `promoState`; compare against current store main when advancing the gitlink
- **PDP facts evidence** — `Product` carries images, badges and variants but no shipping guidance or pickup location; `ProductPage` renders the generic checkout shipping label only
- **PDP disclosure evidence** — `descriptionOverflows` estimates lines with a 55-character budget; actual wrapping depends on width and glyphs, so a short character count can leave more than three visible lines uncollapsed
- **Order copy evidence** — `OrderDetailsPage` supplies literal English Discount, Shipping and Tax while the shared catalogs already define their localized keys
- **Status dependency** — both order pages call the local `customerOrderStatus` adapter; `add-store-order-status` has no tasks yet. Its owner must settle and deliver the canonical contract before frontend migration can be planned precisely; retain the adapter and report this acceptance limitation until then

## Delivery order

1. **Planning** — review and land these additions in the registered store, then sync the application planning store before claiming implementation groups
2. **PDP disclosure** — implement [redesign group 5](tasks.md) independently of backend work; use post-layout measurement with deterministic server rendering, never a new backend read
3. **PDP optional facts** — contract owner supplies typed facts or product owner revises the requirement; then implement [redesign group 4](tasks.md) through the existing product repository and DI boundary
4. **Stock feedback** — use [hold-cart-quantity-to-stock](../hold-cart-quantity-to-stock/tasks.md), groups 3 and 5 for PDP model and presentation. Expose chosen quantity from `ProductBuyBox` through a callback or controlled props so the page and buy box read the same selection; keep one scarcity threshold. Group 1 shared cart changes and group 6 cart wiring are separate dependencies; listing group 4 is outside this owner's four surfaces
5. **Cart compatibility** — finish [cart group 2](../add-store-cart-drawer-ui/tasks.md) against the current shared contract, then its group 3 product record. Preserve the subtotal-only estimate and calculated-at-checkout shipping copy; do not add coupon, points or shipping quote calls without a separate requirement
6. **Order copy** — finish [order group 6](../add-grade10-customer-order-pages/tasks.md) and the existing gitlink task 5.1; product-record task 1.4 stays separate from UI implementation
7. **Acceptance later** — owner schedules desktop/mobile, locale, session, loading/error, cart quantity/refusal, owner-only order, tracking, SSR and hydration verification on the chosen integration build; then decides PR merge and deployment separately

## Share-image archive and redesign overlap

- **Code compatibility** — main contains the redesign and `shareImage` together; the route computes metadata through `addressHead`, while `ProductPage` and `ProductBuyBox` own visible detail and purchase UI. No unresolved Git index entries or active rebase found
- **Requirement compatibility** — redesign adds catalogue context, disclosure and purchase scenarios 13–18; share-image adds metadata scenarios `product-page-SC-19` and `product-page-SC-20`. Fold each addition into the same durable capability without replacing the other's Feature set or journeys
- **ID caution** — the stock change uses fully qualified `grade10-site-store-product-page-SC-19` and `SC-20` for quantity limits. These differ from the share-image IDs as full strings; preserve issued IDs and references, and do not normalize the short share IDs into those occupied names
- **Archive scope** — archive only `add-product-share-image`; keep the redesign active with its pending groups. The redesign has no change-local journeys file and needs lifecycle repair before its own archive; that is not permission to archive it now
- **Deployment evidence** — [run 34324062944](https://github.com/9gag/grade10/actions/runs/34324062944) succeeded for Grade10 staging, including `grade10-web-staging` version `309a1ca0-60d6-4880-a939-4fe9e3c330d2`. The actual bundled checkout is `c5847d6d7ce22b84ac18a2dd3fec1afee11ab6d4`, not the dispatch head; it contains share-image commit `c4b45297691610aba51a26fdbde04b5bbb98c63c`
- **Archive preparation** — [archive preparation patch](../add-product-share-image/archive-preparation.patch) carries the durable Feature set and journey; apply immediately before archive so the journey and requirement fold land together; existing Product Details manual already describes the shared-link behavior. No change directory moved and no archive commit or push made
- ❓ **Archive acceptance** — owner must accept staging as sufficient deployment evidence under the archive skill before the archive move and publication; production acceptance is not established by this run

## Validation boundaries

- **Plan checks** — strict validation of the touched changes, durable spec validation, archive preflight against the actual deployed SHA with the preparation patch applied, manual check and whitespace checks
- **Implementation checks** — the commands in each task group run when that group is implemented; backend tests are unnecessary for frontend-only edits
- **Deferred checks** — no frontend runtime, live backend, screenshot or cross-device verification in this planning pass

- **Observed results** — strict validation passed for the redesign, customer-order and share-image changes; all 59 durable specs passed; archive preflight passed with the preparation patch applied, then the patch was saved separately to avoid leaving a journey referencing not-yet-folded scenarios
- **Manual result** — `pnpm check:manual` reports 27 failures and 45 warnings after restoring the unapplied archive preparation; failures include duplicate cart-empty-state scenario IDs and unresolved Storybook references. The archive cannot be reported as having a green manual gate; this pass does not change those files
- **Patch check** — `git apply --check` accepts the archive preparation patch; `git diff --check` passes
