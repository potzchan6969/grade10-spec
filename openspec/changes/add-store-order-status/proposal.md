**Author:** @jeffffej0909 - 2026-08-28

## Why

A collector who opens their order history today has no reliable answer to "where
is my order". The Store reads Shopify's `displayFinancialStatus` and
`displayFulfillmentStatus` as separate facts, and every surface that wants to
show a single status pill decides for itself how to collapse them. Order history
renders a badge, order detail renders a stepper, and nothing states which
Shopify combination produces which badge. Two surfaces can disagree about the
same order, and no test can catch it because no requirement says what the right
answer is.

The gap is widest exactly where a collector is most anxious. A partially
refunded order, an order held before fulfilment, a voided payment — these are
the states that generate support contact, and they are the states no surface
currently has a defined answer for. An undefined combination today renders
whatever the surface happens to pass.

This change names the mapping once, as a capability, so every surface derives
the same badge from the same facts.

Measurement: order-status support contacts per hundred orders, and their share
of total Store contacts. If a collector can read their own order state, they
write in less. Partial-refund and on-hold orders are the segment to watch, since
they are where the mapping does the most work.

## What Changes

- Introduces `grade10-site/commerce/order-status`: the mapping from an order's Shopify
  facts to one customer-facing badge and an optional secondary note.
- Defines five badges for this phase — Processing, Shipped, Completed, Canceled,
  Refunded — derived by an ordered rule that resolves **every** combination of
  the Shopify vocabularies, not only enumerated ones.
- Defines the secondary note as an optional identifier the mapping emits, which
  the i18n catalogs answer. The mapping never emits display copy.
- Requires every Store surface that shows order status to derive it from this
  mapping rather than deciding for itself.

The mapping replaces the source PRD's fifteen-step priority list. That list
resolved badges only, could not produce the notes its own tables showed, and
contradicted those tables for a held order carrying a partial refund. The
ordered rule specified here reproduces all thirty confirmed PRD rows.

## Non-Goals

- **"Ready for Pickup" is not emitted this phase.** Grade10 does not yet
  distinguish pickup orders from shipped orders in Shopify. The shared badge
  component keeps its `pickup` rung and its Figma counterpart untouched, because
  pickup is a confirmed later phase; removing the rung would only mean adding it
  back.
- **No notification requirements.** A notification centre serving the whole
  Grade10 ecosystem is in progress and will own its own spec. It is named here
  as a future consumer of this mapping, not specified by it.
- **No new component contract.** Rendering the secondary note is left to each
  surface. Adding a note slot to the shared status badge is a component-contract
  change with a Figma dependency, and belongs to whoever plans that delivery.
- **No custom badges** beyond the five, and no merchant-configurable thresholds.
- **Completed does not mean delivered.** It means fulfilled, paid, and archived.
  Carrier-confirmed delivery remains outside what the Store reports.

## Capabilities

### New Capabilities

- `grade10-site/commerce/order-status`: how an order's Shopify payment, fulfilment, and
  order facts resolve to one customer-facing badge and an optional secondary
  note, and the obligation on every surface that shows order status to use it.

### Modified Capabilities

None. The mapping is additive: it defines a derivation no capability currently
owns, and changes no existing requirement.

## Impact

**Consuming surfaces.** Order history and order detail in the grade10
application must derive their badge from this mapping. Neither surface's
component contract changes; what changes is which value the application passes.

**A conflict to resolve before archive.** The durable
`shared/ui/store-order-history` capability defines its `completed` badge as
delivered for an online order. That wording conflicts with this capability,
where Completed means fulfilled, paid, and archived — never carrier-confirmed
delivery. The order-status change needs its own delta against that shared
component contract before it can archive.

**Delivery facts to preserve:**

1. `returned` is not a member of `OrderDisplayFulfillmentStatus`; Shopify tracks
   returns on a separate field. The two PRD rows keyed on `returned` are
   specified here against the order's return status instead.
2. The current typed Store order exposes normalized lifecycle status,
   fulfilment status, and fulfilment display status. Delivery planning decides
   how that projection feeds this mapping without copying rules into each page.

**No design-system or token impact.** No primitive changes, no Figma component
set changes, no `tokens.json` change.
