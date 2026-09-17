**Author:** @tangconst - 2026-09-16

## Why

A winner can save unlimited shipping addresses from Winner Order, so the
Confirm Delivery Address list grows without bound and the address book stops
being a short reusable set. The success measure is winners confirming delivery
with at most five saved addresses, without a full book blocking the address
deadline.

## What Changes

- Cap the account shipping address book at **5** named addresses.
- At the cap, **Add new address** still opens; the winner can confirm a
  one-time address for this order.
- At the cap, **Save this address for future orders** is refused (offered
  disabled or untaken, with a short reason) until the winner removes a saved
  address.
- Keep order snapshots separate from the book: a one-time address still lands
  on the order without adding a sixth saved entry.

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `grade10-site/auction/winner-order`: The reusable shipping address book
  holds at most five named addresses; Winner Order still lets a winner add
  and confirm a new address for the order when the book is full, and refuses
  saving that address until a slot is free.

## Impact

- `openspec/specs/grade10-site/auction/winner-order/spec.md`
- Platform auth address book (account-wide across storefronts)
- Winner Order Confirm Delivery Address / Add Delivery Address flow
  (`apps/preview` until the shared block exists)
- `docs/prds/products/grade10-site/auction/winner-order.md`

## Open questions

- **One-time address persistence** — whether the unsaved one-time address a
  winner enters at the cap is visually distinguished from the five saved
  addresses in the picker, and whether it survives navigating away and back
  or a page reload. The blind test-case reading raised this; nothing in
  `decisions.md` or `ui-design.md` settles it. @tangconst confirms.

## References

- [Winner Order · Invoice and Settlement](../../../docs/prds/products/grade10-site/auction/winner-order.md#invoice-and-settlement)
