# Design: sync Product List Header

Capability spec:
[`shared-ui/store-product-listing`](../../specs/shared-ui/store-product-listing/spec.md).
See proposal.md for motivation.

## Context

`ProductListHeader` is a count plus a sort dropdown. Figma set
`Product / Product List Header` (`4288:14117`) is a title row and a sort-and-filter
bar composed of `Filter Chip` (`4313:28`) and `Button` + `Dropdown Menu` for
series. Annotations on that set are the interaction contract.

## Decisions

### Title is a required prop, not inferred

The file's content annotation lists three application choices — "All Products",
the collection name, "Search Results". Those stay in the consuming app. The
header displays `title` as supplied and has no default, matching
`CollectionBanner.collection`.

- *Rejected — inferring the title from filter selection.* That puts catalog
  judgment in the package.

### Three header control families, not one filter list

| Family | Selection | Presentation |
| --- | --- | --- |
| Sort options | exclusive, one id; optional pair for a second tap | chips |
| Chip-filter groups | multi, `FilterSelection` + `onFilterChange` | chips |
| Exclusive-filter groups | one id per group | dropdown |

Sort is not a filter group: a second tap on Price reports a paired id rather
than deselecting. Chip filters reuse the listing's existing selection callback
so a type chip and a sidebar checkbox for the same group stay in lockstep when
the consumer points both at the same ids. Exclusive filters cannot share that
callback without a second "deselect the previous" event, so they report
`(groupId, optionId)` only.

- *Rejected — one `FilterGroup[]` with an `exclusive` flag.* The sidebar would
  then have to learn radio semantics it does not have, and Price's second-tap
  pair still would not fit.
- *Rejected — hardcoding Popular / New / Price / Pack / Box.* Every label and
  id is consumer-supplied, as the copy requirement already requires.

Empty chip-filter selection is the default Type state in the file: Pack and Box
are drawn unselected, and the result set is unrestricted (both types). Selecting
Pack restricts to Pack; selecting Pack and Box is both types again, with both
chips selected. The header does not infer “all selected” from an empty
selection — it only paints what the consumer put in `selection`. The application
treats empty as unrestricted when it fetches.

- *Rejected — defaulting both type chips to selected to mean “all”.* The file
  draws them unselected, and selected-all vs selected-none would be
  indistinguishable in the result set but not on the control.

### `FilterChip` is a design-system primitive

The published set has size `md` | `sm`, boolean gates `isSelected` /
`isDisabled`, and a `state` axis that is hover/focus only. It cannot combine
with Button (no loading, no danger, selected fill is inverted
foreground/background). Basename `filter-chip` matches the set.

Selected is a boolean prop with `data-selected`, not a cva axis, matching
`isLoading` on Button: the template's `getEnum` produces booleans.

### Price's arrow is FilterChip trailing, not copy

When a sort option names `toggleId`, the header fills FilterChip's `trailing`
slot with an icon arrow (Phosphor `ArrowDown` unless the consumer supplies
`trailing`) and rotates that slot 180° while `sortValue === toggleId`. The
label stays "Price"; the glyph is never a text arrow. Popular, New, Pack, and
Box omit `trailing`, matching the header instances.

## Risks / Trade-offs

[Risk] Type chips in the header and Product Type in `FilterPanel` can duplicate
if a consumer supplies both. → Mitigation: they share `FilterSelection` when
the group ids match; omitting a group from either side is a consumer choice.
This change does not restyle `FilterPanel`.

[Risk] `title` and dropping `sortTriggerLabel` break existing callers. →
Migration: pass `title`; delete `sortTriggerLabel`; map Price to one option
with `toggleId` if the second-tap behavior is wanted.

## Migration Plan

1. Land `FilterChip` and the header in this repository.
2. Update `apps/preview` in the same change.
3. Consuming applications bump the submodule and pass `title`.

## Open Questions

None. The Figma annotations resolve title copy, combination of sort/type/series,
Price's second tap, and the optional series dropdown.
