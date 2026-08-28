# UI: Admin auction Campaigns and listing pickers

## Screens

**No Figma frame exists for these surfaces.** Layout sources until a designer
adds frames: the live grade10 admin auction catalogue-cover tab (today
`SalesPanel`, renamed to Campaigns), the live **listing editor**
(`ListingEditorPage`), and the listing table pattern on `ListingsPanel`.
Designing a dedicated campaign cover frame is work in grade10-spec later;
this change does not block on it.

Assembly in `apps/admin/grade10` composing `@grade10/auction-admin-frontend`.
Behavior:
[`grade10-auction/admin-campaign`](specs/grade10-auction/admin-campaign/spec.md),
[`grade10-auction/admin-listing`](specs/grade10-auction/admin-listing/spec.md)
(delta).

### Rename first — existing Sales tab becomes Campaigns

Before new editor behaviour, the live Sales tab/page is relabeled
**Campaigns** (tab title, section heading, empty states, list actions). The
listing editor’s optional cover field is labeled **Campaign**.

### Admin auction Campaigns list and campaign editor

Operators open a draft, create it, edit title and copy, publish, and cancel
from a full-page editor opened from the Campaigns tab (same list → editor
swap as listings). A campaign is a catalogue cover for multiple listings.
Canceled campaigns open read-only. Chrome says **Campaign** / **Campaigns**,
never Sale / Sales.

### Admin listing editor — Campaign field

One optional control selects a campaign or “on its own” (no campaign). Options
are eligible campaigns only (`draft` or `created`). The control is labeled
**Campaign**.

### Admin listing editor — inventory product field

Same listing editor. Product selection is a picker (not free text) fed by
inventory eligibility: products whose **`status` is `created`** and
**`available > 0`** (`AuctionEligibleProduct` from inventory Contracts).
Draft-status and out-of-stock products are omitted. Campaign editors have no
product field.

## Components

From `@grade10/design-system` (existing exports — same set the listing
editor already uses):

- `Badge`, `Button`, `Text`, `TextInput`, `HStack`, `VStack`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `IconButton`, `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`

**Campaign / product pickers:** no `Select` / `Combobox` export exists in the
design system or `@grade10/ui` today. Compose a native `<select>` (or
equivalent) with design-system label/`Text` messaging — same approach other
admin forms use when no Select primitive ships. **Gap flagged:** a shared
Select in grade10-spec is optional future work; **not** required for this
change's tasks.

From `@grade10/ui`: **none.** No new shared compound export.

From `@grade10/inventory-contracts`: **consumed type only**
(`AuctionEligibleProduct`) — no UI export.

## States

Tied to spec scenarios in admin-campaign and admin-listing (delta).

### Campaigns chrome

- **Section label** — `Auction admin section is labeled Campaigns`.
- **Editor chrome** — `Campaign editor chrome says Campaign`.

### Campaign editor

- **New campaign** — `Operator opens the editor for a new campaign`.
- **Draft** — `Operator opens the editor for a draft campaign`; create
  offered; publish absent.
- **Created** — `Operator opens the editor for a created campaign`; publish
  offered; create absent.
- **Published** — edit title/copy; create/publish absent; cancel offered when
  authorized.
- **Canceled read-only** — `Canceled campaign opens read-only`.
- **Validation** — `Open without a title is refused`,
  `Clearing the title is refused`.
- **Permission** — `Unauthorized open is refused`,
  `Unauthorized cancel is refused`.

### Listing editor campaign picker

- **Attach draft campaign** — `Operator attaches a draft listing to a draft
  campaign`.
- **Attach created campaign** — `Operator attaches a listing to a created
  campaign`.
- **Clear** — `Operator clears the campaign on a listing`.
- **Filter** — `Published and canceled campaigns are not offered in the
  picker`.
- **Optional** — `Listing without a campaign still creates`.
- **Label** — `Listing editor campaign field is labeled Campaign`.

### Listing editor inventory product picker

- **Omit draft** — `Product picker omits draft inventory products`.
- **Omit out of stock** — `Product picker omits out-of-stock inventory
  products`.
- **Refuse draft on save** — `Draft product id is refused on listing save`.
- **Refuse OOS on create** — `Out-of-stock product id is refused on listing
  create`.
