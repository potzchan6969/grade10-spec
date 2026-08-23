# Design: FilterChip

No capability spec: a design-system primitive carries no durable requirement
here. See proposal.md for motivation.

## Context

Figma publishes two chips and they are not interchangeable.

| Set | Axes | What it is |
| --- | --- | --- |
| `Chip` (`4396:5319`) | `state` (hover only) | Always draws a dismiss X, as a nested instance rather than a BOOLEAN. No size, no selected. |
| `Filter Chip` (`4313:28`) | `size`, `isSelected`, `isDisabled`, `state` | The selectable chip. Optional `trailing` slot. |

`ProductListHeader` composes `Chip` for its applied filters — those are
dismissed, never selected. Nothing composes the selectable chip yet.

## Decisions

### Selected and disabled are boolean props, not cva axes

The Code Connect template reads Figma's `isSelected` and `isDisabled` through
`getEnum`, which produces booleans. Modelling them as cva options would make
the template map a boolean onto a string. `selected` writes `data-selected`
and the variants key off that attribute; this matches `isLoading` on `Button`.

- *Rejected — a `selected` cva axis.* It reads well in isolation and then
  fights the template at every rung.

### Size is the only cva axis

`md` and `sm` differ in height, radius, padding, text size, and icon size —
five values that move together, which is what a cva axis is for. Both sizes
use Figma's 4px item spacing.

### Hover and focus are mapped to nothing, deliberately

The set's `state` axis is hover and focus, which CSS pseudo-states already
express. The template maps the axis to nothing rather than omitting it, so
the axis is accounted for instead of surfacing as unmapped.

### The trailing slot is a slot, not copy

`trailing` takes a node and mirrors the set's BOOLEAN + INSTANCE_SWAP. A
caller wanting a direction arrow supplies the icon; the chip never renders a
text arrow and supplies no default glyph.

## Risks / Trade-offs

[Risk] The primitive ships with no consumer, so nothing exercises it beyond
its stories. → Accepted: the set is published and the alternative is a surface
restyling `Chip` when it needs a selectable one. The stories cover both sizes
against selected, disabled, and trailing.

## Migration Plan

None. The export is additive and nothing imported the primitive before.

## Open Questions

None.
