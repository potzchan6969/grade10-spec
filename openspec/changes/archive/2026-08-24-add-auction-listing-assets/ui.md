# UI: Auction listing photos

## Screens

**No Figma frame exists for these surfaces.** Layout sources until a designer
adds frames: Storybook `Auction Listing/ListingGallery` for the details
gallery, the live grade10 auction catalogue and listing page for the
storefront assembly, and the live grade10 admin listings photo manager.
Designing the catalogue thumbnail and the admin dialog is work in
grade10-spec against the fields this change already publishes.

### Auction catalogue (grade10 `/auction`)

Assembly in `apps/frontend/grade10`. Each listing row shows the first gallery
item at card size when that item is an image (gallery order from
admin-listing).

### Listing details (grade10 `/auction/:listingId`)

Assembly in `apps/frontend/grade10` composing `ListingGallery` from
`@grade10/ui`. Storybook: `Auction Listing/ListingGallery`. Images use
`paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title`.

### Admin listings photo manager

Assembly in `apps/admin/grade10` on the listings surface. A Photos action
opens a dialog over the ordered gallery (at most eight media items). File
pick for an image shows a local preview with Confirm and Discard before any
upload. Stored images show at card size; a magnify control reveals zoom size
on hover. No Figma; compose primitives below. Gallery attach/reorder/video
controls that admin-listing already owns stay on that surface.

## Components

From `@grade10/ui` (this change records the contract):

- `ListingGallery`, `ListingGalleryImage`, `ListingGalleryProps` — details
  gallery. `ListingGalleryImage` gains optional `thumbSrc` and `zoomSrc`.
  Labels arrive via `copy: { zoom, previous, next }` (`ListingGalleryCopy`).

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

- **First gallery image present** — `A listing with a first gallery image shows it on the catalogue`.
- **No catalogue image** — `A listing without a catalogue image still lists`.
- Loading / error stay the sale-list states already on the page; this change
  does not add an image-specific error.

### Listing details gallery

- **Several images** — `Several images appear in gallery order`, `Several photos show a strip`.
- **One image** — `One image has no strip` / `One photo has no strip`.
- **No images** — `No images still shows the listing`, `No photos`.
- **Alt present / absent** — `Supplied alt is shown`, `Missing alt uses the listing title`.
- **Sized sources** — `Distinct sources are used in each slot`, `The details gallery uses thumb, detail, and zoom`.

### Admin photo manager

- **Draft, empty slot** — file pick is offered (`An accepted upload becomes a gallery image`).
- **Draft, filled slot** — replace, remove, and alt (`A draft gallery image can be replaced and removed`).
- **Published, room under eight** — add allowed (`A published listing can gain another image`).
- **Published, filled** — replace/remove follow admin-listing; alt editable
  (`Alt can be edited on a published listing`).
- **Pending confirmation** — after a file is chosen, that slot shows a local
  preview plus Confirm and Discard; no upload yet
  (`Choosing a file shows a preview without uploading`,
  `Confirming the preview stores the image`,
  `Discarding the preview leaves the gallery unchanged`).
- **Stored image, resting** — card-size image in the grid
  (`The admin photo manager shows card size`).
- **Magnify hovered / focused** — zoom-size preview at least three-quarters
  of the viewport height (`Hovering the magnify control shows zoom size`).
- **Magnify left** — zoom preview hidden (`Leaving the magnify control hides zoom`).
- **Closed / settled / canceled** — every control disabled (`Adding after close is refused`).
- **Unsupported type / oversize / over-length alt** — inline error, gallery
  unchanged (`An unsupported type is refused`, `An oversized image is refused`,
  `Over-length alt is refused`).
