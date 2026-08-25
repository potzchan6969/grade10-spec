# UI: Admin auction listing and gallery

## Screens

**No Figma frame exists for these surfaces.** Layout sources until a designer
adds frames: the live grade10 admin auction listings and listing editor, the
live grade10 auction catalogue and listing page, and Storybook
`Auction Listing/ListingGallery` for the details gallery. Designing the
catalogue thumbnail and the admin dialog is work in grade10-spec against the
fields this change already publishes.

### Admin auction listings and listing editor

Assembly in `apps/admin/grade10` composing `@grade10/auction-admin-frontend`.
Operators save drafts, create, schedule or publish, call off, and edit
editable fields. Create-draft is an icon control on the listings surface.
Gallery attach, reorder, remove, and video sit on this surface; image
preview/confirm and card/zoom review live in the photo manager below.

### Admin listings photo manager

A Photos action opens a dialog over the ordered gallery (at most eight media
items). File pick for an image shows a local preview with Confirm and Discard
before any upload. Stored images show at card size; a magnify control reveals
zoom size on hover. No Figma; compose primitives below.

### Auction catalogue (grade10 `/auction`)

Assembly in `apps/frontend/grade10`. Each listing row shows the first gallery
item at card size when that item is an image.

### Listing details (grade10 `/auction/listings/<slug>`)

Assembly in `apps/frontend/grade10` composing `ListingGallery` from
`@grade10/ui`. Storybook: `Auction Listing/ListingGallery`. Images use
`paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title`. Video items
play from the original public path.

## Components

From `@grade10/ui` (this change records the contract):

- `ListingGallery`, `ListingGalleryImage`, `ListingGalleryProps` — details
  gallery. `ListingGalleryImage` gains optional `thumbSrc` and `zoomSrc`.
  Labels arrive via `copy: { zoom, previous, next }` (`ListingGalleryCopy`).
- `ListingBidPanel`, `ListingDetails` — already on the details page; export
  contract recorded, not restyled here.

From `@grade10/design-system`, all existing exports:

- Catalogue row: `HStack`, `VStack`, `Text`, `Link`, `Badge`.
- Admin table / dialog / form: `Button`, `Dialog`, `DialogContent`,
  `DialogTitle`, `Input`, `Text`, `HStack`, `VStack`, `Badge`.

Nothing new in the design system. No new `@grade10/ui` listing card.

## States

Tied to
[`grade10-auction/admin-listing`](specs/grade10-auction/admin-listing/spec.md),
[`grade10-auction/listing-images`](specs/grade10-auction/listing-images/spec.md),
and [`shared-ui/auction-listing`](specs/shared-ui/auction-listing/spec.md).

### Admin listing editor

- **Empty draft** — `Operator saves an empty draft`.
- **Partial draft** — `Operator saves a partial draft`.
- **Create blocked** — required fields missing or invalid
  (`Create without a title is refused on the form and the API`, and siblings).
- **Created / scheduled / published** — publish now or publish at
  (`Operator publishes a created listing`, scheduled-publish scenarios).
- **Call off** — permission-gated (`Operator calls off a published listing
  that has bids`, `Unauthorized cancel is refused`).
- **Closed / settled / canceled** — catalogue and media writes refused
  (`Closed listing rejects a title edit`, `Closed listing rejects a media
  upload`).

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
- **Stored image, resting** — card-size image in the photo manager
  (`The admin photo manager shows card size`).
- **Magnify hovered / focused** — zoom-size preview at least three-quarters
  of the viewport height (`Hovering the magnify control shows zoom size`).
- **Magnify left** — zoom preview hidden (`Leaving the magnify control hides zoom`).
- **Closed / settled / canceled** — every control disabled (`Adding after close is refused`).
- **Unsupported type / oversize / over-length alt** — inline error, gallery
  unchanged (`An unsupported type is refused`, `An oversized image is refused`,
  `Over-length alt is refused`).

### Catalogue

- **First gallery image present** — `A listing with a first gallery image shows it on the catalogue`.
- **No catalogue image** — `A listing without a catalogue image still lists`.
- Loading / error stay the sale-list states already on the page; this change
  does not add an image-specific error.

### Listing details gallery

- **Several images** — `Several images appear in gallery order`, `Several photos show a strip`.
- **One image** — `One image has no strip` / `One photo has no strip`.
- **No images** — `No images still shows the listing`, `No photos`.
- **Mixed media / video** — `Mixed images and videos are accepted`.
- **Alt present / absent** — `Supplied alt is shown`, `Missing alt uses the listing title`.
- **Sized sources** — `Distinct sources are used in each slot`, `The details gallery uses thumb, detail, and zoom`.
- **Slug not found / private** — public slug lookup scenarios in admin-listing.
