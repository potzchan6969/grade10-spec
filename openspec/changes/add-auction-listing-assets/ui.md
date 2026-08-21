# UI: Auction listing photos

## Screens

**No Figma frame exists for these surfaces.** Layout sources until a designer
adds frames: Storybook `Auction Listing/ListingGallery` for the details
gallery, the live grade10 auction catalogue and listing page for the
storefront assembly, and the live grade10 admin listings table for the photo
manager. Designing the catalogue thumbnail and the admin dialog is work in
grade10-spec against the fields this change already publishes.

### Auction catalogue (grade10 `/auction`)

Assembly in `apps/frontend/grade10`. Each listing row shows the front photo at
card size when `front` is present.

### Listing details (grade10 `/auction/:listingId`)

Assembly in `apps/frontend/grade10` composing `ListingGallery` from
`@grade10/ui`. Storybook: `Auction Listing/ListingGallery`.

### Admin listings photo manager

Assembly in `apps/admin/grade10` on the existing listings table. A Photos
action opens a dialog with six side slots in a grid (one column on narrow
viewports, up to three per row on wide). File pick shows a local preview with
Confirm and Discard before any upload. Stored photos show at card size; a
magnify control reveals zoom size on hover. No Figma; compose primitives
below.

## Components

From `@grade10/ui` (this change records the contract):

- `ListingGallery`, `ListingGalleryImage`, `ListingGalleryProps` — details
  gallery. `ListingGalleryImage` gains optional `thumbSrc` and `zoomSrc`.
  **Those two fields are new**; they do not exist on the component today.
  Flagged so tasks in grade10-spec land them.

From `@grade10/ui`, unchanged and not restyled here:

- `ListingBidPanel`, `ListingDetails` — already on the details page.

From `@grade10/design-system`, all existing exports:

- Catalogue row: `HStack`, `VStack`, `Text`, `Link`, `Badge`.
- Admin table / dialog: `Button`, `Dialog`, `DialogContent`, `DialogTitle`,
  `Input` (alt), `Text`, `HStack`, `VStack`, `Badge`.

Nothing new in the design system. No new `@grade10/ui` listing card.

## States

Tied to [`grade10-auction/listing-images`](specs/grade10-auction/listing-images/spec.md)
and [`shared-ui/auction-listing`](specs/shared-ui/auction-listing/spec.md).

### Catalogue

- **Front photo present** — `A listing with a front photo shows it on the catalogue`.
- **No front photo** — `A listing without a front photo still lists`.
- Loading / error stay the sale-list states already on the page; this change
  does not add a photo-specific error.

### Listing details gallery

- **Several sides** — `Several sides appear in side order`, `Several photos show a strip`.
- **One photo** — `One photo has no strip`.
- **No photos** — `No photos still shows the listing`, `No photos`.
- **Alt present / absent** — `Supplied alt is shown`, `Missing alt uses the listing title`.
- **Sized sources** — `Distinct sources are used in each slot`, `The details gallery uses thumb, detail, and zoom`.

### Admin photo manager

- **Draft, empty slot** — file pick is offered (`An accepted upload becomes that side's photo`).
- **Draft, filled slot** — replace, remove, and alt (`A draft photo can be replaced and removed`).
- **Published, empty slot** — file pick is offered (`A published listing can gain a missing side`).
- **Published, filled slot** — alt only; replace and remove disabled
  (`Replacing a live photo is refused`, `Removing a live photo is refused`,
  `Alt can be edited on a published listing`).
- **Pending confirmation** — after a file is chosen, that side shows a local
  preview plus Confirm and Discard; no upload yet
  (`Choosing a file shows a preview without uploading`,
  `Confirming the preview stores the photo`,
  `Discarding the preview leaves the side unchanged`).
- **Stored photo, resting** — card-size image in the grid
  (`The admin photo manager shows card size`).
- **Magnify hovered / focused** — zoom-size preview at least three-quarters
  of the viewport height (`Hovering the magnify control shows zoom size`).
- **Magnify left** — zoom preview hidden (`Leaving the magnify control hides zoom`).
- **Closed / settled / canceled** — every control disabled (`Adding after close is refused`).
- **Unsupported type / oversize / over-length alt** — inline error, side
  unchanged (`An unsupported type is refused`, `An oversized photo is refused`,
  `Over-length alt is refused`).
