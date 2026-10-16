**Author:** @seankcw - 2026-10-16

## Why

A collector who signs out in one tab and comes back to another finds the cart drawer still open and empty, beside a header that says Sign In ([9gag/grade10#625](https://github.com/9gag/grade10/issues/625)). No requirement says what an open drawer does when the session ends: the session contract only says the tab stops showing the person's cart. The product owner decided on 2026-10-09 that the drawer closes by itself, with no message.

**Metric:** an Engineering signal: the walk of the new scenario passes, and no tab keeps an open drawer after its member's session has ended.

## What Changes

- **The drawer closes with the member's session** - an open cart drawer closes by itself, with no message, when the member it was open for signs out in another tab or the session expires
- **A guest's drawer stays open** - only the end of a member's session closes it; a guest never had one to end, and a switch from one member to another leaves the drawer open on the new member's cart

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/store/cart-drawer` - an open drawer closes when its member's session ends

## Impact

- **`apps/frontend/grade10`** - the site's cart drawer host. Built ahead of this record in [9gag/grade10#1233](https://github.com/9gag/grade10/pull/1233), so delivery is verifying that pull request against the accepted scenario
- **Manual** - [Cart Drawer · Reviewing the Cart](../../../docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart) marks the outcome, and its decisions block records the choice

## Open Questions

None.

## References

- [Cart Drawer · Reviewing the Cart](../../../docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart)
