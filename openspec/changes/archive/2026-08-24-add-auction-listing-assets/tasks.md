# Tasks: Auction listing assets

Gallery attach, eight-item cap, reorder, and video are owned by
`add-admin-auction-listing`. This change's tasks cover named sizes, alt,
preview/confirm, and storefront wiring on that gallery.

Group 1 lands in grade10-spec and is bumped as a submodule in grade10;
groups 5 and 6 are the first grade10 groups that need it. Groups 2, 3, and 4
depend on nothing in group 1 and can run beside it. Group 4 needs the columns
in group 3.

## 1. Gallery sources (grade10-spec) (owner: @mason5991)

- [x] 1.1 Make `An application imports the surface` and `A part is reused alone` pass by recording `ListingGallery`, `ListingBidPanel`, `ListingDetails`, and their listed types (including `*Copy`) as the `shared/ui/auction-listing` exports on the package entry.
- [x] 1.2 Make `Distinct sources are used in each slot` and `Omitted sources fall back to src` pass on `ListingGalleryImage` via optional `thumbSrc` and `zoomSrc`.
- [x] 1.3 Make `Several photos show a strip`, `One photo has no strip`, `No photos`, and `Labels come from the consumer` pass in the gallery stories (consumer `copy`), then run this repository's `pnpm run typecheck`, `pnpm run lint`, and the block's story tests.

## 2. Auction contracts (grade10) (owner: @mason5991)

- [x] 2.1 Make `Each gallery image is published at named sizes` pass on the public image shape: `alt` (nullable string), named-size `paths` for `card`, `detail`, `thumb`, and `zoom`, and `imagePath` equal to the `detail` path.
- [x] 2.2 Make admin listing reads carry gallery images with alt and paths (list: nullable first-image thumb; get: every gallery image with alt and paths), aligned with admin-listing's ordered media.
- [x] 2.3 Add the image upload, delete, and alt-only calls to the admin client port and its fixture so groups 5 and 6 can build against fixtures alone.
- [x] 2.4 Run `pnpm run typecheck` and the contracts lane.

## 3. Listing photo data (grade10) (owner: @mason5991)

Depends on nothing in group 2.

- [x] 3.1 Add nullable `alt` (text, ≤ 200 after trim) to `auction_listing_images`.
- [x] 3.2 Run `pnpm run db:drizzle:generate` and `pnpm run check:migrations`, and commit the generated SQL.

## 4. Auction backend (grade10) (owner: @mason5991)

Depends on the columns in group 3. The public image shape in group 2 is the
encode target, not a runtime import from a frontend. Gallery position / eight
cap / video types come from admin-listing.

- [x] 4.1 Rename the wrangler binding and env field to `AUCTION_LISTING_ASSETS` with bucket names `grade10-auction-listing-assets-{dev,staging,production}`, bind `IMAGES`, and run `pnpm run cf-typegen`.
- [x] 4.2 Make `An accepted upload becomes a gallery image`, `An unsupported type is refused`, and `An oversized image is refused` pass on the byte route, measuring width and height with the Images port for rasters.
- [x] 4.3 Make replace/remove/add follow admin-listing gallery rules (`Replace and remove follow the admin-listing gallery rules`, `A published listing can gain another image`, `Adding after close is refused`).
- [x] 4.4 Make `Missing alt uses the listing title`, `Supplied alt is shown`, `Alt can be edited on a published listing`, and `Over-length alt is refused` pass on upload and on `listings.updateImageAlt`.
- [x] 4.5 Make `The catalogue uses card size for an image card`, `The details gallery uses thumb, detail, and zoom`, and `An unknown size is not found` pass on `GET /api/public/listing-images/:size/*`, transforming through the Images port when the stored bytes exceed the named ceiling.
- [x] 4.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 5. Admin photo manager (grade10) (owner: @mason5991)

Depends on group 1 through the submodule bump, and on groups 2 and 4's
fixtures / procedure shapes. Preview and confirm stay in the admin client —
no backend change; confirm calls the existing byte upload and discard never
reaches the network. Dialog is an ordered gallery (≤ eight), not six sides.

- [x] 5.1 Bump the `external/grade10-spec` submodule to the commit carrying group 1.
- [x] 5.2 Make `Operators attach gallery images from admin` and `An accepted upload becomes a gallery image` pass with a Photos dialog on the listings surface and the byte upload on the admin client.
- [x] 5.3 Make gallery replace/remove/add/alt controls follow admin-listing status rules plus `Alt can be edited on a published listing` and `Adding after close is refused`.
- [x] 5.4 Make `An unsupported type is refused`, `An oversized image is refused`, and `Over-length alt is refused` pass as inline errors that leave the gallery unchanged.
- [x] 5.5 Make `Choosing a file shows a preview without uploading` and
  `Discarding the preview leaves the gallery unchanged` pass in the admin Photos
  dialog: selecting a file shows a local preview with Confirm and
  Discard, and Discard clears the preview without calling the upload client.
- [x] 5.6 Make `Confirming the preview stores the image` and
  `An accepted upload becomes a gallery image` pass by uploading only when
  Confirm is pressed (add and draft replace), then clearing the preview.
- [x] 5.7 Make `The admin photo manager shows card size`, `Hovering the magnify
  control shows zoom size`, and `Leaving the magnify control hides zoom` pass:
  the dialog is a grid of at most three items per row, stored images use card
  size, and hovering the magnify control reveals a zoom preview at least
  three-quarters of the viewport height.
- [x] 5.8 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 6. Storefront catalogue and details (grade10) (owner: @mason5991)

Depends on group 1 through the submodule bump, and on group 2. Fixtures, not
a running backend.

- [x] 6.1 Make `A listing with a first gallery image shows it on the catalogue` and `A listing without a catalogue image still lists` pass on the grade10 `/auction` listing row using `paths.card` for the first image item.
- [x] 6.2 Make `Several images appear in gallery order`, `One image has no strip`, `No images still shows the listing`, `Missing alt uses the listing title`, and `Supplied alt is shown` pass in `ListingView` by mapping `paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title` into `ListingGallery`.
- [x] 6.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 7. Delivery and review (grade10) (owner: @mason5991)

- [x] 7.1 Create `grade10-auction-listing-assets-{staging,production}` in each Cloudflare account, copy keys from the previous listing-images buckets when any exist, enable the Images binding, and confirm both resolve in staging before the worker that reads them deploys.
- [x] 7.2 Verify every scenario in both deltas, then run `openspec validate add-auction-listing-assets` and `openspec validate --specs`.
- [x] 7.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build` after the feature lanes pass.
- [x] 7.4 Review the branch for convention drift and for delta coverage separately: requirements missing, partial, or implemented differently than specified.
- [ ] 7.5 After rollout is confirmed, fold both accepted deltas into `openspec/specs/` (adding `grade10-auction` to `openspec/specs/README.md` if needed), confirm `docs/architecture/auction.md` names the binding and named sizes, and archive this change.

  Blocked on deploy: archive waits until staging (at least) runs this branch together with admin-listing's gallery. `docs/architecture/auction.md` already names `AUCTION_LISTING_ASSETS` and sized public GETs in grade10.
