**Author:** @kinisworking - 2026-09-16

## Why

A shopper can be shown held promo codes and a points ceiling while the
application deliberately supplies no tender-mutation callbacks. The shared
Cart Drawer still renders Apply controls in that mode, so the read-only surface
offers actions that cannot change the cart.

**Metric:** every read-only Cart Drawer state renders zero tender-mutation
controls without a callback, while interactive states keep all supplied
actions available.

## What Changes

- Gate typed promo entry and its Apply control on the promo-apply callback.
- Gate an applicable held promo code's Apply control on the held-code selection
  callback, while keeping the code and its eligibility details visible.
- Gate points amount entry and Apply on the points-apply callback, while
  keeping supplied balance, ceiling, and rate context visible.
- Keep Use max and tender-removal controls available only when their existing
  callbacks are supplied.
- Add read-only and interactive Storybook coverage for the shared Cart Drawer
  contract.

## Non-Goals

- Changing the existing callback types or adding a new prop.
- Applying promo codes or points, calculating a combined quote, changing cart
  totals, or creating checkout sessions.
- Changing `CartDrawerHost`, its selected tender state, or the Grade10
  application wiring; that is the follow-on consumer work.
- Changing backend, persistence, checkout APIs, design tokens, or Figma files.
- Removing display-only held-code, points-balance, points-ceiling, refusal, or
  rate information when the consumer supplies it.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-cart`: tender mutation and disclosure actions render only
  when the consumer supplies the callback that can act on them.

## Impact

- `packages/ui` Cart Drawer footer and promo-sheet rendering.
- Shared Cart Drawer Storybook stories and interaction checks.
- Consumers can pass tender context without exposing a dead Apply action.
- No new dependency, wire contract, or data migration.

## Follow-on changes

- The Grade10 Cart Drawer host can consume the guarded contract for read-only
  tender context while passing no promo or points mutation callbacks and no
  selected held promo.

## References

- [Store Cart Blocks](../../../docs/prds/products/shared/ui/store-cart.md#tender-actions)
- [Shared Store Cart](../../../openspec/specs/shared/ui/store-cart/spec.md)
- [Cart Drawer UI delivery plan](../add-store-cart-drawer-ui/tasks.md)
