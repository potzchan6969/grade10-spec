# Export the pack card a top-up is picked with

**Author:** @tangconst - 2026-10-28

Product context: [Top-ups](../../../docs/prds/products/grade10-site/loyalty/top-ups.md).

## Why

The points top-up wireframe is settling as a dialog over Membership: the
member picks a pack, pays on Stripe's checkout and lands on a result. The
one piece worth sharing already is the pack card — the radio row a pack is
picked with — so it leaves the preview and becomes an export of the shared
UI package, the way the membership surface's components did.

## What Changes

- `@grade10/ui` gains `TopUpPackCard`, `TopUpPackCardCopy` and
  `TopUpPackCardProps` under a `shared-ui/loyalty-top-ups` group.
- The card renders one pack inside a `RadioList`: its points, its price,
  the paid-plus-bonus line where a discount exists, and the
  reason it cannot be picked where it cannot.
- The pack picker's wireframe composes it in place of its local tile.

## Affected Component Exports

`TopUpPackCard`, `TopUpPackCardCopy`, `TopUpPackCardProps` — new.
Consuming applications: the Grade10 site's loyalty surface.
