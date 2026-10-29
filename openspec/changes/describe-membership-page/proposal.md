# Describe the Membership page

**Author:** @tangconst - 2026-10-28

Product context: [Membership](../../../docs/prds/products/grade10-site/loyalty/membership.md),
[Top-ups](../../../docs/prds/products/grade10-site/loyalty/top-ups.md).

## Why

The Membership page grew a whole module — a section rail, the member-pass
dialog, an in-place top-up journey, and a ledger that carries top-up
entries and their receipts — through the preview workbench, faster than
the spec recorded it. The durable programme spec holds the component
export contract but nothing about the page those components compose into,
so the screen's own rules (what enters where, what the rail names, what a
top-up does to the page) live only in the PRD and the story file.

## What Changes

- Record the Membership page's surface: a title row holding Member Pass
  and Top-up Points beside it above a separator, a section rail naming
  Overview, Rewards, Coupons and Points History — sticky on a wide
  viewport, a scrollable row on a narrow one — deep-linked through a
  `tab` query parameter.
- Record the hosted top-up journey on the page: the pack picker over the
  page, the confirming wait, and the settled outcome as a toast on the
  page itself — a credited pack raises the shown balance; a held pack's
  toast links into Points History.
- Record that the member's ledger carries top-ups: a credited pack's
  entry links its Stripe receipt, a held pack sits under Pending, a
  chargeback reads as a negative line — and there is no separate top-up
  history surface.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/loyalty/membership-page`: the Membership screen's own
  surface — layout, entrances, hosted top-up journey and ledger reads.

### Modified Capabilities

- None — the `grade10-site/loyalty/programme` export contract is
  untouched; `remove-tiercard-benefits-link` covers the card's own delta.

## Impact

- `apps/preview/src/pages/loyalty/membership/` — the page these
  requirements describe is already drawn; the change is a spec record.
- `apps/preview/src/pages/loyalty/top-up-flow.tsx`, `top-ups/` — the
  picker/confirming/toast surfaces the page hosts.
- PRD `membership.md` and `top-ups.md` — already current.

## Follow-on changes

- Spec the top-up refusal states the picker already draws, and the
  confirming/toast contract, once the Stripe round-trip is real.
