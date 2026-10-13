## Current Product Picture Delivery

The approved thumbnail extension supersedes the image exclusion and the
backend/wire-change exclusions in Original Delivery Notes. It adds Groups
10-14 without changing the completed or in-flight group addresses. Existing
points, promo, verification, checkout and signed-in-only access decisions stay
in force. The [picture requirements](specs/grade10-site/store/cart-drawer/spec.md)
and [shared picture contract](specs/shared/ui/store-cart/spec.md) own the outcome;
the approved brief owns the selected scope.

- **Read shape** - Extend `GET_VARIANTS` with
  `product.images(first: 1) { nodes { url altText width height } }`. Reuse the
  existing image codec and mapper, require the requested connection on a
  returned product, and normalize `CatalogVariant.product.images` to
  `ProductImage[]` with at most its first image. Preserve null nodes,
  non-variant nodes and existing malformed-identity refusal. This retains the
  single batched variant read rather than loading full products or requesting
  a picture per line.
- **Fact ownership** - Add optional picture fields to the reviewed response
  schema, then enrich `reviewCatalogLines` from `live?.product.images[0]`
  after existing classification. `toReviewedLineWire` strips only internal
  `live`, so picture fields reach the response. No image modifies
  classification, pricing, stock limits or readiness. `CartLine`, cart rows,
  browser intent, add/set/merge inputs and `applyReview` remain image-free.
- **Application join** - Add optional fields to `ReviewedCartLine` and copy
  them explicitly in the confirmed branch of `reviewedLines`, keyed by
  variant ID with its existing quantity guard. Forward them in
  `toCartItemSummary`. The unreviewed branch supplies no picture. Existing
  scope and refetch rules discard earlier review facts; `CartDrawerHost`
  adds neither a query nor an image cache.
- **URL and alt** - Pass the catalogue URL through unchanged, including its
  query parameters. Copy non-empty catalogue alt text; omit null, absent or
  empty alt text and let the existing `imageAlt || item.name` renderer answer
  it. The thumbnail button remains `aria-hidden` and outside the tab order;
  the adjacent name button remains the accessible product action. Browser
  assertions locate the image within its item instead of depending on an
  accessible image role.
- **Fixtures** - `FixtureCatalog.getVariants` supplies
  `product.images.slice(0, 1)`. The frontend transport fixture enriches its
  `reviewLine` result after classification from its matching product. Update
  hand-built variant values and raw query fixtures to carry the requested
  connection. Shared presentation fixtures use deterministic assets served
  by Storybook rather than a Shopify CDN dependency.
- **Ownership** - Shared image, missing-alt and placeholder browser stories
  land in grade10-spec through an upstream PR. Select a published main SHA
  containing that merge before updating the application gitlink. Data-flow
  work and fixture tests in grade10 can proceed independently; application
  integration and final browser evidence consume the selected upstream SHA.
  Existing public exports and thumbnail presentation need no redesign.
- **Alternatives** - Variant-specific pictures disagree with the approved
  first-product-picture choice. Pictures stored in cart intent become stale.
  Full product reads, per-line reads and an image cache add unnecessary
  request or state ownership. All are excluded from this extension.

## Product Picture Service Interfaces

| Boundary | Input | Success | Refusal And Side Effects |
| --- | --- | --- | --- |
| Shopify variant batch | Existing variant IDs | Existing normalized variants with product images, empty array for no images | Existing catalogue faults; no new request, writes, lock or transaction |
| Cart review | Existing cart intents and currency configuration | Existing classified lines plus optional picture fields joined to live variant IDs | Existing catalogue/currency outcomes; no picture persistence or new outcome |
| Wire serialization | Existing internal reviewed line | Reviewed line retaining pictures and excluding internal live variant | Shared by member review, guest review, basket quote and checkout result adapters |
| Frontend join | Current cart lines and current decoded review | Confirmed matching lines with picture props forwarded to shared UI | Existing unreviewed/quantity/scope guards; no write of picture facts |

For variant `gid://shopify/ProductVariant/41`, a catalogue first image
`https://cdn.example.test/card.jpg?v=7` with alt `Card front` becomes optional
review fields `imageSrc` and `imageAlt` with those values, then the same props
on the item whose ID is that variant. Another variant in the batch never
receives this picture. An unavailable variant or an empty image array omits
both fields. The service changes no transaction or mutation ordering.

## Product Picture API Contracts

| Field On Reviewed Lines | Wire Shape | Default |
| --- | --- | --- |
| imageSrc | Optional string | Omitted without a picture or live variant |
| imageAlt | Optional string | Omitted without non-empty catalogue alt text |

These additive fields apply wherever the existing reviewed-line schema is
used: member `cart.review`, existing guest `quote.reviewItems`, basket quote
and checkout outcomes containing lines. Production decoder tests prove
legacy responses decode with the new schema and enriched responses decode
with the previous schema, including its handling of extra fields. Null or
non-string supplied fields fail the current schema. Guest compatibility tests
exercise transport only; Q1 and Q3 still forbid guest drawer journeys.
Regenerate API references through the existing generator when this shape
affects them.

## Product Picture Risks / Trade-offs

- **[Risk] A display join drops the fields or assigns a different variant's picture.** - Explicit copy in the existing ID join and presentation mapper; regression fixtures reverse response order and include removed, unmatched and unreviewed lines.
- **[Risk] Optional enrichment breaks an older consumer.** - Exercise both production schemas against legacy and enriched review, quote and checkout payloads before rollout.
- **[Risk] Fixture behavior hides a missing query or decoding step.** - Assert the query selection and raw-response decoding separately; align normalized backend and frontend fixtures with that shape.
- **[Risk] Picture bytes fail independently of review.** - Preserve the existing browser image rendering and checkout behavior; this extension adds no image-error substitution. Controlled Storybook assets prove rendering, and seeded application browser checks prove complete images with positive natural width.
- **[Risk] Shared work is absent from the consumed pin.** - Record the merged upstream PR and published SHA, inspect the application gitlink and rerun application build/browser checks after consumption.

## Product Picture Migration Plan

1. Land shared controlled-asset stories and verify them upstream before the
   application consumes the published main SHA.
2. Deliver the optional backend response and aligned fixtures, then the
   frontend consumer. Decoder compatibility permits either deployment order
   once tests establish both combinations.
3. Verify a restored image-free member cart through real review and loaded
   thumbnails at narrow and wide viewports. Prove image-free intent and the
   single catalogue batch in runtime tests separately from image-byte loading.
4. Roll back either application side without a database migration or storage
   clearing. An older response or consumer returns to placeholder pictures.

## Current Checkout Delivery

Folded in from `move-checkout-into-cart-drawer` (2026-09-29), because
`grade10-site/store/cart-drawer` has no durable spec yet and this change is
its one owner. Supersedes "Checkout — keep its route and creation owner"
below in Current Points Delivery, and the checkout-creation non-goal and the
"Navigate through existing application addresses" decision in Original
Delivery Notes.

- **Creation** — `CartDrawerHost.handleCheckout` calls `useCreateCheckout`
  with the drawer's current `items`, `quoted` tender (coupon, points) and
  `deviceId`, instead of navigating to `ROUTES.checkout`. On success it
  shows the shared component's `checkoutRedirecting` state and hands off to
  the returned hosted URL; on failure it restores Checkout and shows
  `checkoutFailed`, naming the affected line where the failure names one. A
  store read that cannot complete (`catalog_unavailable`) restores nothing:
  the lines read unchecked with Retry, as `add-store-product-status` task 4.3
  builds for cart-validation.
  No second live re-read is added: the drawer's existing `useBasketQuote`
  (`staleTime: 0`) already gates `checkoutDisabled` on a current quote, and
  `createCheckout`'s own transactional recheck at order-write time remains
  the read that gates Pay.
- **Verification gate** — render the same threshold-and-link presentation
  `CheckoutPage`'s `VerifyPanel` renders today (goods value against the bar,
  a link to `addressOf("profile")` when `config.gates.profile` is set) in
  place of the Checkout action when the resolution's outcome is `verify`.
  The identity check itself is untouched: it still runs only on the account
  page.
- **Removed** — `src/routes/checkout.tsx`, `src/pages/checkout/
  CheckoutPage.tsx`, the `/checkout` route and surface entry, and `e2e/
  tests/store/checkout.spec.ts`, once the drawer covers review, tender,
  verification and handoff.
- **Alternatives** — a second explicit re-read at the button press was
  rejected: the drawer's continuous live quote already serves that purpose,
  and adding one would duplicate an existing gate. Redirecting to the
  account page instead of an inline gate was rejected as an extra screen.

## Current Points Delivery

The user-approved points integration below supersedes the read-only points and
neutral estimated-total choices in the original delivery notes that follow.
Those notes describe the original Groups 1–4. Group 7 supplies the shared
pending guard before Group 5 integrates points; Group 6 follows delivery.

- **State** — retain `CartDrawerHost`'s existing `useCartTender` choice passed
  to `useBasketQuote`. Preserve existing promo callbacks and the coupon field;
  this points increment neither adds nor removes promo editing.
- **Acceptance** — parse finite positive whole numbers (Remove alone writes zero), ask `useBasketQuote.read` for
  the proposed choice, persist the server-accepted points, then render the
  accepted quote. Use the returned amounts rather than local arithmetic.
- **Persistence** — extend `useCartTender` with observable completion, pending
  and error state while keeping existing checkout callers compatible. A failed
  mutation retains the accepted cached choice. Serialize writes so an older
  completion cannot overwrite a newer choice.
- **Races** — capture member scope, reviewed basket identity and open generation
  for an operation. Check them before publishing a quote or starting persistence.
  Closing cannot cancel a write already sent; scope its cache result to its
  member and re-read on reopen. Invalidate quotes after cart edits and suppress
  Checkout until the current basket is revalidated.
- **Shared guard** — add optional `tenderPending` (default false) to existing
  `CartDrawerProps` and `CartDrawerFooterProps`. Forward it through the compound;
  disable existing points/promo inputs and action callbacks, including the open
  promo sheet and Checkout. Preserve accepted values and callback guards.
  The host keeps this guard true across quoting and persistence for a tender
  change, including the existing promo flow, so points and promo actions cannot
  overlap. Existing review and checkout guards still apply after it clears.
- **UI** — reuse existing shared points callbacks, disclosure, input and applied
  state. Pending tender state disables tender actions and Checkout. Preserve
  last accepted same-basket totals on failures; once no operation is pending, Checkout can use
  that still-current accepted quote. Use localized existing error
  copy where it answers the failure. Any missing shared prop or copy belongs to
  the spec store and needs the smallest compatible addition before integration.
- **Checkout** — keep its route and creation owner; verify it re-quotes persisted
  choice and sends accepted spendPoints. No new endpoint, schema or dependency.
- **Alternatives** — local-only intent would lose reload/handoff; optimistic
  applied totals would display an unaccepted saving; new backend pricing would
  duplicate the existing combined quote. All are rejected.

## Original Delivery Notes

## Context

The proposal's motivation is in `proposal.md`. The
[Cart Drawer](specs/grade10-site/store/cart-drawer/spec.md) and
the active page-shell deltas own the Grade10
behavior. The durable `shared/ui/store-cart` capability and `@grade10/ui`
already own the drawer's visual states, dismissal, empty state, item
statuses, and interaction contract. The Grade10 application mounts one
global cart drawer host and `Nav.onCartClick` handler once the Store cart
drawer answers. That host currently
stops at the reviewed lines and subtotal.

The existing frontend integration already reaches the Store backend boundary:
`useCart` supplies the current cart scope and the signed-in member cart, and
its typed `ReviewCart` port performs the live review. `/checkout` already owns its
own review and checkout handoff. This change consumes those paths; it adds no
Worker, API, provider, database, persistence, or checkout service work.

Two current contracts shape the adapter:

- `useCartReview` currently always runs its query, removes unavailable lines,
  and filters them from its returned lines.
- The shared drawer requires display-ready `CartItemSummary` values, reviewed
  subtotal and estimated total, and `CartDrawerCopy`. The current reviewed
  line contract has no image URL, shipping, tax, discount, or promotion data.

The rebased backend can price a points amount for a named member and can accept
coupon and points inputs when checkout is created. Those are checkout
capabilities, not a drawer quote: they do not return one applied cart view with
promotion, points, shipping, tax, and total, and the current drawer hands off
to `/checkout` instead of creating checkout itself.

The checkout feature nevertheless already exposes two read-only member reads:
the held promo codes answered against checkout items and the points quote for
those items. The drawer can consume those reads after its cart review succeeds,
provided it treats them as optional context rather than as a tender selection.

## Goals / Non-Goals

**Goals:**

- Compose one global cart drawer host at the application root (Cart on every
  surface once the Store cart drawer answers).
- Integrate the drawer with the existing scoped cart and typed live review.
- Preserve checkout's current review and unavailable-line behavior.
- Match the supplied populated, loading, failure, unavailable, and empty UI
  states using existing shared components and tokens.
- Show signed-in members' held promo-code answers and points ceiling for the
  reviewed basket without presenting either as applied tender.
- Provide localized Grade10 drawer copy through the existing catalog resolver.
- Keep the new product scenarios traceable to the shared drawer and
  cart-validation contracts they consume.

**Non-Goals:**

- Any backend implementation or wire-contract change.
- A second cart store, local review snapshot, or product-image enrichment read.
- Promotion redemption, shipping calculation, tax calculation, or discount
  calculation. The drawer has no applied quote, and its subtotal and estimated
  total remain the reviewed subtotal.
- Tender selection or checkout creation. The drawer may show the results of
  the existing member-only reads, but it supplies no promo or points mutation
  callbacks and `/checkout` remains the owner of checkout creation.
- A dedicated `/cart` route or changes to the existing checkout page.
- No new `CartDrawer` visual variant, design-token, or Figma work. If the
  current optional-callback behavior exposes a mutation control without a
  callback, the shared component receives only the minimal callback-presence
  guard needed for this read-only path.

## Decisions

### Compose one global cart host at the application root

Once the Store cart drawer answers, the root passes `Nav.onCartClick` on every
surface and mounts one `CartDrawer` host beside `SiteShell`, so navigation does
not duplicate or reset cart state. Leaving a surface does not remove Cart from
the header; closing the drawer preserves the current address.

**Alternative rejected:** mount one drawer per page. That would duplicate cart
wiring and unmount the current drawer during navigation.

**Alternative rejected:** Store-and-checkout-only Cart. Product keeps Cart
global after Store launch to cut checkout friction.

### Reuse the existing scoped cart and backend integration

The host calls `useCart` and uses its scope, lines, item count, currency, and
serialized writes. It never reads browser storage directly or reimplements the
signed-out access gate; `require-sign-in-from-nav-cart` owns that activation
behavior. The host introduces no new backend call. Quantity and removal
callbacks use the existing optimistic scope-keyed writes. Product activation
uses the existing product-address helper. Checkout uses the current checkout
route.

**Alternative rejected:** retain a browser-only adapter. It would diverge from
the member cart after sign-in and bypass the existing backend-backed cart
integration.

### Make live review open-controlled without changing checkout defaults

Extend the frontend hook signature to
`useCartReview(basket, options?)` with these defaults:

| Option | Drawer | Existing checkout |
| --- | --- | --- |
| `enabled` | `open` | `true` |
| `removeUnavailable` | `false` | `true` |

When `removeUnavailable` is `false`, the hook must both skip its removal
effect and preserve `unavailable` lines in its returned `lines`; otherwise the
shared drawer cannot own the cleanup contract. The drawer receives every
reviewed status and invokes the existing scoped removal callback once per
unavailable line. Checkout retains the default removal effect and its existing
returned-line behavior.

Closing disables the review query. Reopening performs a fresh review because
the review query is open-controlled, scope-keyed, and has zero garbage
collection time. Cart writes continue invalidating the scope-keyed review.

**Alternative rejected:** let both the hook and drawer remove unavailable
lines. Two owners could issue duplicate writes and duplicate the one-toast
contract.

### Keep unresolved review visibly unresolved

The host passes the review's fetching state as controlled `CartDrawer.loading`.
While pending, the adapter may provide unreviewed line shape for the shared
skeleton treatment, but it must not present held prices or availability as
confirmed. On review failure, the host emits exactly one localized failure
toast with Retry for that open and leaves Checkout disabled. Over a read
basket, it ends `loading` and shows each line with the unchecked price label
in place of its price, stock and status, as
[Cart Validation](../../../docs/prds/products/grade10-site/store/cart-validation.md)
names unchecked lines (`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx:593-628`).
Over a basket it has not read, it keeps `loading` true, so the drawer never
shows an unread cart as empty (`cart-drawer-empty-state`, Q9). Closing and
reopening starts the next review attempt.

On success, the drawer receives reviewed title, quantity, current unit price,
currency, available quantity, previous price, and status. Adjusted and sold-out
rows remain visible according to the shared component contract; unavailable
rows are removed by `CartDrawer` after loading and produce its one cleanup
toast.

**Alternative rejected:** paint a local intent snapshot while review is
pending or failed. That would make stale values look confirmed at the moment
the drawer exists to recheck them.

### Map only data the existing contract provides

The adapter maps the reviewed line contract into `CartItemSummary` without
adding a backend enrichment read:

| Drawer value | Source | Rule |
| --- | --- | --- |
| id, name, quantity, status | reviewed line | Use the reviewed variant, title, quantity, and status. |
| price, original price | reviewed minor-unit amounts | Format with the reviewed ISO currency; omit original price when absent. |
| max quantity | reviewed available quantity | Pass it when present; the shared item owns the warning/stepper treatment. |
| subtotal | reviewed lines | Sum current minor-unit price × quantity, excluding sold-out and unavailable lines. |
| shipping | copy only | Omit `shippingEstimate` so the localized `Calculated at checkout` copy renders. |
| estimated total | reviewed subtotal | Use the same formatted amount as subtotal; no shipping/tax/discount calculation. |
| image | current review enrichment | Populate existing `imageSrc` / `imageAlt` from the first current product picture; use the shared fallback when absent. |

The host keeps `PromoState` as local disclosure state, not applied tender. It
passes held codes only after a successful member review, leaves
`selectedHeldPromoId` null, and supplies no promo-application or points-apply
callbacks. The points state is likewise only the drawer's collapsed/expanded
disclosure state; it never becomes `applied`. The shared UI must hide or make
inert any action control whose mutation callback is absent, so the read-only
surface cannot present a no-op Apply action.

**Alternative rejected:** infer pictures, shipping, or totals from product-page
or held-cart data. Those values are not part of the existing reviewed backend
contract and would reintroduce stale or invented facts.

### Read the existing member context only after the cart review

Call `useSpendableCoupons(review.items)` and `usePointsTender(review.items)`
only when the drawer is open, the scoped cart is a member cart, the review is
successful and ready, and it has at least one reviewed item. Add an `enabled`
option to both hooks with the current `true` default so Checkout keeps its
existing behavior while the drawer can avoid empty, pending, failed, and
non-member reads. The query keys remain the reviewed item list, so a quantity
or review change asks again for the basket in front of the member.

Map a successful coupon read to `HeldPromoCode`: the coupon code is both the
stable id and label, the definition title remains the ticket title, the cut
and expiry use the existing checkout promo vocabulary, and a refusal is shown
as the inapplicable reason. A pending, failed, or unavailable read maps to
`null`, not to an empty successful list, so the drawer never turns an
unanswered wallet into “no promo codes”.

Map a successful quoted points read to `pointsState={{ status: "collapsed" }}`
and a localized `pointsBalanceLabel` containing the balance and basket
ceiling. The existing `CartDrawerCopy.footer.pointsRateLabel` supplies the
conversion-rate copy. A points `unavailable` answer maps to `null`. Format the
ceiling from its integer minor-unit amount and ISO currency with the existing
money utility; do not derive it from the cart subtotal in the host.

The drawer still uses the reviewed subtotal for both subtotal and estimated
total. Applying a code, choosing a held code, applying points, recalculating a
total, or creating checkout remains outside this decision.

A later combined-quote contract must define invalidation after cart edits,
signed-out access and member behavior, refusal copy, applied line and footer
amounts, and the exact handoff to checkout before interactive promo or points
callbacks are supplied.

**Alternative rejected:** wire the merged endpoints one control at a time.
That would expose selectable tender without an authoritative combined total or
a drawer-owned checkout handoff.

### Keep copy in a Grade10 `store` catalog overlay

Add a new brand-owned `store` namespace for `en`, `zh-Hant`, and `zh-Hans`,
register it in `packages/i18n/src/catalogs.ts`, and add only the keys needed to
construct `CartDrawerCopy` (for example, `cartDrawer.header`, `cartDrawer.item`,
`cartDrawer.footer`, and `cartDrawer.unavailableItemsRemoved`). The existing
shared `chrome.cartLabel` supplies the navigation label and is not duplicated.

This follows the resolver's two-layer model: generic store listing words remain
in shared `store`, while this Grade10 surface's supplied drawer vocabulary is
owned by the Grade10 overlay. Existing locale fallback remains in force.

**Alternative rejected:** add Grade10 drawer words to shared `store` without
deciding ownership. That would make a brand-specific surface part of every
brand's shared vocabulary and leave the current catalog boundary ambiguous.

### Navigate through existing application addresses

The drawer's item callback uses the current product-address helper. Checkout
closes the drawer and navigates to `ROUTES.checkout`; the checkout page remains
responsible for session gating, its own live review, and checkout handoff.

**Alternative rejected:** create checkout or a new cart route from the drawer.
That would duplicate existing application behavior and expand the surface
beyond the supplied design.

### Verify at the frontend integration boundary

Tests use typed cart/review fixtures and existing DI harnesses. They do not
require a running backend because no backend code changes. Coverage must prove:

- `grade10-site-store-cart-drawer-SC-04` through `SC-08`: review defaults
  preserve checkout behavior while the drawer follows `open`, keeps the right
  scope, preserves unavailable rows for its cleanup owner, and withholds stale
  facts.
- Cart availability scenarios `grade10-site-site-page-shell-SC-09` and `SC-16`
  are owned by the durable `grade10-site/site/page-shell` spec; this change
  consumes the global handler once the Store cart drawer answers.
- `grade10-site-store-cart-drawer-SC-09` through `SC-12`: reviewed facts,
  neutral totals, scoped writes, and one unavailable cleanup remain honest.
- `grade10-site-store-cart-drawer-SC-13` and `SC-15`: product and Checkout use
  existing addresses and close the drawer first.
- `grade10-site-store-cart-drawer-SC-16` through `SC-19`: member-only tender
  reads follow the latest reviewed basket, show current eligibility and the
  points ceiling, and never become applied tender or stale prior data.
- The shared empty, loading, dismissal, overflow, cleanup, and redirecting
  behaviors remain covered by `shared/ui/store-cart`.

## Risks / Trade-offs

- **[Risk] A cart write lands while review is in flight.** → Keep both queries
  scope-keyed, use serialized cart writes, and invalidate review after each
  settled write.
- **[Risk] A member session scope changes while the drawer is open.** → Derive
  review from the same `useCart` scope and let the query key move with it.
- **[Risk] Review failure leaves old values visible.** → Replace each read
  line's price, stock and status with the unchecked label, keep `loading` over
  an unread basket, emit one failure toast per open, and recheck on reopen.
- **[Risk] Picture facts drift from the current cart.** - Enrich the existing live review, join by variant identity and retain image-free stored intent; Current Product Picture Delivery owns this extension.
- **[Risk] An optional read fails after the cart review succeeds.** → Treat
  promo and points context as non-blocking; pass `null`, keep the reviewed
  subtotal, and let Checkout perform its own reads.
- **[Risk] A query result from an earlier basket remains visible after an edit
  or scope change.** → Gate props on the current successful review and query
  item key; reset disclosure state on close and never carry a selected promo
  id across a review.
- **[Risk] The shared drawer renders a mutation affordance without its
  callback.** → Add or verify callback-presence guards in the shared drawer so
  read-only mode exposes facts but no no-op action.
- **[Risk] The read-only context is mistaken for an applied quote.** → Keep
  `PromoState` un-applied, keep points out of applied state, and derive both
  displayed totals only from the reviewed cart.
- **[Risk] The spec-store pointer overlaps unrelated nested work.** → Advance
  only the parent gitlink after the catalog commit lands, preserve nested work,
  and run the submodule check.

## Migration Plan

1. Add and validate the Grade10 catalog overlay in `grade10-spec`.
2. Advance `external/grade10-spec` to that landed catalog commit while
   preserving unrelated nested work.
3. Add the backwards-compatible review options and root UI integration in
   `grade10`.
4. Roll back by removing the host and reverting the parent gitlink; existing
   scoped cart, backend integration, and `/checkout` behavior remain unchanged.
   No data or backend migration is involved.
