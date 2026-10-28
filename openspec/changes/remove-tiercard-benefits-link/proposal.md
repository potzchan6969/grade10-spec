# Drop the tier card's Benefits link

**Author:** @tangconst - 2026-10-28

Product context: [Membership](../../../docs/prds/products/grade10-site/loyalty/membership.md).

## Why

The `TierCard` footer's Benefits affordance scrolled to the Tiers & Benefits
section of the same page — a same-page hop the rail already names and one
that duplicated content the member is already looking at. The card reads
better as a statement of standing than as a remote control for the page
beneath it.

## What Changes

- `TierCard` loses the Benefits affordance: its `href` and `onClick` props
  and the `benefits` copy key go, and the card renders nothing interactive.
  The footer keeps the tier's earn line alone.
- The Membership page drops the scroll-to-section handler the affordance
  reported to.

## Affected Component Exports

`TierCard`, `TierCardCopy`, `TierCardProps` — `href`, `onClick` and
`copy.benefits` removed.
Consuming applications: the Grade10 site's loyalty surface.
