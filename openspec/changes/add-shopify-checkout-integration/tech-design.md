## Context

The [proposal](proposal.md) holds the motivation; [Q24-Q29](decisions.md) keep this change to the frontend. Facts below were read on the application branch `codex/feat-shopify-checkout-integration` at `c05700431`.

| Source | Finding |
| --- | --- |
| `packages/grade10-store/backend/src/trpc/routers/checkout.ts` | `checkout.createCheckout` is a `freshAuthedProcedure`. Input: `items`, optional `spendPoints` (`spendPointsSchema`, an integer above 0), `couponCodes`, `couponId`, `deviceId`. It runs the gross-goods gate before `createCheckout`. |
| `packages/grade10-store/contracts/src/schemas.ts` | `checkoutItemSchema` carries `productHandle`, `variantId`, `quantity` and optional `seenUnitPriceMinor`. `checkoutResultSchema` answers `created`, `contradicted`, `rejected`, `failed` or `identityRequired`. |
| App commit `306a68624` | Removed the v2 context read, intent persistence, their schemas and DI wiring. The drawer uses only `createCheckout`. |
| `packages/grade10-store/backend/src/repositories/carts.ts:convertCart` | Converts a cart only while `id`, `editedVersion` and `status = active` match the order. `services/orders/transitions.ts` calls it inside the paid transition. A shop review write-back does not move `editedVersion`. |
| `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx` | Builds the request, holds the Pay guards and maps answers (see Decisions). |
| `apps/frontend/grade10/src/pages/orders/orderSettlement.ts` | `usePaidOrdersCartSync` invalidates the cart and tender queries once per newly paid web order. Both order pages poll every 2,000 ms while an order is open. |
| `integrations/shopify-pos/grade10/extensions/{thank-you,order-status}` | Both call `renderYourOrdersLink`, a static link to the baked Grade10 orders URL, labelled from the extension's own locales. |

## Goals / Non-Goals

- **Goal** - Land the [delta](specs/grade10-site/store/checkout/spec.md) in the drawer, the order pages and the two Shopify extensions, using the current backend as it is.
- **Non-goal** - Any backend, contract, schema, migration or provider change. See Not in This Change.

## Decisions

The spec governs what Pay sends, one Pay at a time, older and lost answers, and the paid refresh. These are the implementation choices.

### Request

- **Procedure** - `useCreateCheckout` calls `checkout.createCheckout` through the existing store procedure client. No second client, no context read and no fallback procedure.
- **Lines** - A copy of each `review.items` entry: `productHandle`, `variantId`, `quantity`, `seenUnitPriceMinor`. Pay stays disabled while any reviewed item lacks `seenUnitPriceMinor`.
- **Tender** - `sendableTender(quoted)` from `BasketQuote.ts`: `couponCodes: [code]` for a store code, `couponId` for a wallet coupon, and `spendPoints` only when the quote applied more than 0 points. No points sends no field (Q25).
- **Device** - `deviceId` only when tracking holds one.
- **Readiness** - Pay is disabled while the mutation is pending, a cart or tender write is unacknowledged, the review or quote is not ready, or the tender read failed. The `@grade10/ui` CartDrawer adds its own Redirecting guard.

| Rejected | Why |
| --- | --- |
| v2 request with cart id, cart version, purchase key and zero-inclusive points | Removed by Q25; the backend owns cart association |
| Sending `spendPoints: 0` | `spendPointsSchema` refuses 0 |

### Pay Guards

| Guard | Holds | Ends the request when |
| --- | --- | --- |
| `checkoutActive` ref | Set synchronously before the call | Cleared in `finally` |
| Member snapshot | `sessionState.snapshot()` taken at Pay; Pay refuses unless it is `signedIn` with the drawer's `userId` | The current snapshot is not the same object |
| Request key and generation | `userId`, each line's variant, quantity, price and handle, the reviewed basket key and the tender choice key; any change bumps a counter | Key or counter differs from the values captured at Pay |
| Mounted ref | The drawer is mounted | It unmounts |

- **Older answer** - When any guard fails, the answer is dropped: no `leaveFor`, no navigation, no toast. `checkoutHandled` pulses `summaryLoading` for one render so the CartDrawer leaves Redirecting and the current cart stays (Q28).
- **Lost answer** - A transport or decode error rejects `mutateAsync`. For the current request the host rethrows and the CartDrawer shows `checkoutFailed`. TanStack mutations default to no retry, and the app's `QueryClient` sets none. A later Pay is a new request (Q27, Q29).
- **Rejected** - A request key kept in `sessionStorage` across reload: Q29 leaves repeated Pay to the backend.

### Answers

`resolveCheckout` maps each `checkoutResultSchema` answer to one kind; the host gives each kind its existing treatment. Every path that throws ends in the CartDrawer's `checkoutFailed` toast.

| Answer | Kind | Drawer |
| --- | --- | --- |
| `created` with a URL | `redirect` | Close, then `leaveFor(url)` |
| `created` without a URL | `settling` | Close, then open Your Orders |
| `contradicted`, or `rejected` other than `currencyMismatch` | `amendCart` | Toast naming the moved lines when any are named, `retryReview()`, then throw |
| `failed` with `points_refused` or `coupon_refused` | `retry` | Toast naming the refused tender; no throw |
| `identityRequired` | `verify` | Threshold toast with the profile action when `config.gates.profile` is on, then throw |
| Other `failed`, or `currencyMismatch` | `retry` or `support` | Throw |

- **Unreachable kinds** - `CheckoutResolution.ts` still accepts a `CompatibleCheckoutOutcome` and returns `settled`, `terminal`, `intentConflict` and `recoveryRequired`. The current contract emits none of them, and Q25 removed the request that could. Task 11.8 removes them, so a new answer kind becomes a compile error in `resolveCheckout` rather than a silent fall-through.

### Paid Refresh

- **Order pages** - `OrderHistoryPage` and `OrderDetailsPage` poll at `ORDER_SETTLEMENT_POLL_MS` (2,000 ms) only while `isOrderOpen(status)`.
- **Cart refresh** - `usePaidOrdersCartSync` remembers each web order it saw paid and invalidates the `["cart", "intent"]` and `["cart", "tender"]` prefixes once per newly paid order. The reads return what `convertCart` left: an empty cart with default tender, or a later or rebuilt cart unchanged.
- **Rejected** - Deleting matching variants or subtracting quantities in the browser (Q8).

### Shopify Return

- **Targets** - `purchase.thank-you.block.render` and `customer-account.order-status.block.render`.
- **Link** - `GRADE10_ORDERS_URL` from the baked origin; label key `yourOrders` in `en.default`, `zh-Hans` and `zh-Hant`. No order-specific link and no reliance on Continue shopping (Q10).

## Not in This Change

[`add-checkout-purchase-safety`](../add-checkout-purchase-safety/proposal.md) owns these. The durable requirement "A checkout intent is safe to repeat" stays published and unmodified (Q24).

- **Purchase identity** - One purchase across Pay, reload and lost answers; terminal replay
- **Concurrent Pay** - Tabs converging on one order and invoice
- **Dispatch** - Persisted dispatch claim, response-loss recovery and the manual-recovery block
- **Retirement** - Durable retirement after member edits; canceled shown only from provider facts
- **Old clients** - Legacy-procedure safety and the migration 0050 cart-reset drain

## Risks / Trade-offs

- **[Risk] Two tabs or a reload send two Pays** → No frontend control by design (Q29). The drawer blocks only its own second Pay.
- **[Risk] A lost answer leaves an invoice the collector cannot see in the drawer** → The order pages list the pending order once the backend wrote it; the drawer claims nothing about it.
- **[Risk] A guard misses a state change** → The request key covers every value the request carries, and the generation counter catches a key that returns to an earlier value.
- **[Risk] The unreachable kinds hide a contract change** → Task 11.8 removes them.

## Migration Plan

1. Ship the frontend and both extensions; the backend is unchanged and needs no migration.
2. Roll back by redeploying the previous frontend. The frontend writes no data of its own.

## Open Questions

None. What the drawer shows when the session expires between review and Pay (SC-54) is verified by task 11.6, not designed here.
