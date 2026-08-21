# Design: sync Product List page

Capability spec:
[`shared-ui/store-product-listing`](../../specs/shared-ui/store-product-listing/spec.md).
See proposal.md for motivation.

## Context

`FilterPanel` still owns the sidebar landmark and utility links.
`ProductListHeader` still owns the results heading. Figma replaced the
collection menu with `Product / Product Filter` (`4357:527`) and redesigned
the header (`4288:14117`) around applied-filter chips and a sort dropdown.
Annotations on those sets are the interaction contract.

## Decisions

### `ProductFilter` is a listing export; checkboxes are the design-system primitive

The published set is a heading, search, and stacked checkbox groups. Each row
is `CheckboxList` / `CheckboxListInput` (`sm`, 16px control, optional count).
The listing package composes them; it does not re-export a menu item.

- *Rejected — keep `CollectionMenu` and restyle it as checkboxes.* Single-select
  `aria-current` rows are not the multi-select contract the file draws.
- *Rejected — put checkbox groups only inside `FilterPanel` and skip a
  `ProductFilter` export.* The set is published under that name, and a later
  surface may want the filter without utility links.

### Empty selection is unrestricted; the component does not check every box

The file's annotation: by default no checkbox is checked, and that means every
world and type. The component paints `selection` as supplied. The application
treats empty as "no restriction" when it fetches.

- *Rejected — checking every option to mean "all".* The file draws them
  unchecked, and selected-all vs selected-none would be indistinguishable in
  the result set but not on the control.

### Group order and "See all worlds" stay with the consumer

Worlds ordered by product count, types ordered Booster Box → Special Box →
Graded Card then by count, and which worlds sit behind the expand link are
catalog rules. Each group is displayed in the order supplied. An optional
`expandLabel` on a group reports `onGroupExpand(groupId)`; the consumer then
supplies a longer option list. The component does not hide or sort options.

- *Rejected — truncating a long group inside the package.* The visible set is
  a catalog choice, and a default of "first five" would be a store's rule.

### Applied filters are a supplied list, not inferred from sidebar groups

The header does not receive the sidebar's groups. The consumer maps the
current selection to `appliedFilters` (`groupId`, `optionId`, `label`) so a
chip can name "Pokémon" without the header knowing that label lives in the
worlds group. Dismissing a chip reports the same `(groupId, optionId, false)`
shape as unchecking the sidebar. Clear-all is a separate callback.

- *Rejected — deriving chips from `selection` plus `groups`.* That would force
  every header caller to pass the full sidebar catalog, including a search
  results page that has no sidebar.

### Sort is a dropdown; `sortTriggerLabel` is the whole trigger

Figma's trigger reads "Sort by popularity". "Sort by" is copy, so the consumer
supplies the full string. The menu lists `sortOptions` and marks the active
id. Choosing an already-active option reports nothing. Paired Price reversal
and sort chips leave with the previous header.

- *Rejected — prefixing "Sort by" inside the package.* That bakes English into
  a surface that must not read a catalog.
- *Rejected — keeping `toggleId` on `SortOption`.* Lowest / highest price are
  separate options in the new menu.

### Tile badges (`cardProps` / `tags`) stay on the type and stop rendering

The page hides the card's metadata slot. SALE / SOLD OUT on the image remain.
`tags` stays optional so existing callers typecheck; the tile ignores it until
design turns the slot back on.

- *Rejected — removing `tags` from `ProductCardProps` in the same change.* The
  hide is temporary per the page note; a removed prop is a second break for a
  slot that may return.

### Applied-filter chips are `Chip`, not selected `FilterChip`

The header instances `Chip` (`4396:5319`): a primary pill, `text-sm`,
`radius-full`, always drawing a dismiss X. `FilterChip` (`4313:28`) is a
separate selectable set (`md` / `sm`, selected inverts to foreground). Restyling
`FilterChip` `sm` selected to look like `Chip` would disagree with its own set.

- *Rejected — reuse `FilterChip` `sm` selected with className overrides.* The
  page instances `Chip`, and the two sets do not share axes.

### SALE is `Badge` `brand`; SOLD OUT is default

The Badge set now includes `brand` (`Base/accent-foreground`) and `outline`,
and every rung is a pill (`Radius/radius-full`). Default fill is
`Base/primary`. SALE on the card is `brand` `sm`; SOLD OUT is default `sm`.

- *Rejected — keeping SALE on `success`.* Code Connect emitted `variant=""`
  because `brand` was unmapped; the fill on the page is the tan brand token,
  not success.

### Sort menu chrome matches `Dropdown Menu`

The menu surface binds `Base/popover`, `Radius/radius-3xl`, `Effects/blur-xl`,
and `border-subtle`. Items bind `Radius/radius-full`. The active option is
`isSelected` with a trailing check and no fill; the label is
`Base/popover-foreground`. Hover and keyboard highlight share
`Custom/muted-hover`. The trigger chevron rotates 180° while the menu is
open. Keyboard: Enter / Space / ↓ open; ↑ / ↓ move the highlight; Enter
selects; Escape closes; typeahead jumps; disabled items are skipped. The
popup stays in the viewport and aligns to the trigger.

### Footer fill is a value reconciliation

`Footer` binds `Base/background` (`#090c0a`). Code currently uses `bg-card`.
Swap the class; no new prop, no site-chrome delta.

## Risks / Trade-offs

[Risk] `sync-product-list-header` is still an open change describing the
previous header. → Do not implement it; this change is the current header
contract.

[Risk] Breaking export and prop names. → Typecheck at the submodule bump;
migration is listed in the proposal.

[Risk] Applied-filter chips and sidebar checkboxes can drift if a consumer
maps them from different sources. → They share `groupId` / `optionId`; preview
derives chips from the same `selection` the sidebar paints.
