# UI: Admin auction sales and listing sale picker

## Screens

**No Figma frame exists for these surfaces.** Layout sources until a designer
adds frames: the live grade10 admin auction **Sales** tab
(`SalesPanel`), the live **listing editor** (`ListingEditorPage`), and the
listing table pattern on `ListingsPanel`. Designing a dedicated sale cover
frame is work in grade10-spec later; this change does not block on it.

### Admin auction Sales list and sale editor

Assembly in `apps/admin/grade10` composing
`@grade10/auction-admin-frontend/sales`. Operators open a draft, edit title
and copy, publish, and cancel from a full-page editor opened from the Sales
tab (same list → editor swap as listings). Canceled sales open read-only.

### Admin listing editor — sale field

Assembly on the existing listing editor. One optional control selects a sale
or “on its own” (no sale). Options are eligible sales only.

## Components

From `@grade10/design-system` (existing exports — same set the listing
editor already uses):

- `Badge`, `Button`, `Text`, `TextInput`, `HStack`, `VStack`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `IconButton`, `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`

**Sale picker:** no `Select` / `Combobox` export exists in the design system
or `@grade10/ui` today. Compose a native `<select>` (or equivalent) with
design-system label/`Text` messaging — same approach other admin forms use
when no Select primitive ships. **Gap flagged:** a shared Select in
grade10-spec is optional future work; **not** required for this change’s
tasks.

From `@grade10/ui`: **none.** No new shared compound export.

## States

Tied to
[`grade10-auction/admin-sale`](specs/grade10-auction/admin-sale/spec.md) and
[`grade10-auction/admin-listing`](specs/grade10-auction/admin-listing/spec.md)
(delta).

### Sale editor

- **New sale** — `Operator opens the editor for a new sale`.
- **Draft** — `Operator opens the editor for a draft sale`; publish offered.
- **Published** — edit title/copy; publish absent; cancel offered when
  authorized (`Operator updates copy on a published sale`,
  `Operator cancels a published sale`).
- **Canceled read-only** — `Canceled sale opens read-only`.
- **Validation** — `Open without a title is refused`,
  `Clearing the title is refused`.
- **Permission** — `Unauthorized open is refused`,
  `Unauthorized cancel is refused`.

### Listing editor sale picker

- **Attach draft sale** — `Operator attaches a draft listing to a draft sale`.
- **Attach published sale** — `Operator attaches a listing to a published sale`.
- **Clear** — `Operator clears the sale on a listing`.
- **Filter** — `Canceled sales are not offered in the picker`.
- **Optional** — `Listing without a sale still creates`.
