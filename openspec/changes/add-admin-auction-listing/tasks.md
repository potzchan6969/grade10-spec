# Tasks: Admin auction listing and gallery assets

Absorbs the former `add-auction-listing-assets` scope. Group 1 lands in
grade10-spec and is bumped as a submodule in grade10; groups that need it say
so. Once contracts land, backend and frontend groups are parallel unless a
prose line says otherwise.

Checkmarks are reset: claim and mark done against the combined Grade10 PR
that merges #71 and #85.

## 1. Gallery sources (grade10-spec)

- [ ] 1.1 Make `An application imports the surface` and `A part is reused alone` pass by recording `ListingGallery`, `ListingBidPanel`, `ListingDetails`, and their listed types (including `*Copy`) as the `shared-ui/auction-listing` exports on the package entry.
- [ ] 1.2 Make `Distinct sources are used in each slot` and `Omitted sources fall back to src` pass on `ListingGalleryImage` via optional `thumbSrc` and `zoomSrc`.
- [ ] 1.3 Make `Several photos show a strip`, `One photo has no strip`, `No photos`, and `Labels come from the consumer` pass in the gallery stories (consumer `copy`), then run this repository's `pnpm run typecheck`, `pnpm run lint`, and the block's story tests.

## 2. Share listing lifecycle and media contracts (grade10)

- [ ] 2.1 Make the admin/public contract scenarios for draft, created, and published listings pass: publish the nullable authoring shape, `created` status, slug/public address, publish-at value, and ordered image-or-video media codecs.
- [ ] 2.2 Make the admin procedure-client and fixture scenarios for draft save, create, editable updates, publication, cancellation, and gallery mutation pass, decoding every expanded procedure through the contract.
- [ ] 2.3 Verify the contracts and admin frontend packages with `pnpm run typecheck`, `pnpm run lint`, and their focused test scripts.

## 3. Auction image contracts (grade10)

Depends on nothing in group 2 beyond the ordered gallery vocabulary both
share; may land beside it.

- [ ] 3.1 Make `Each gallery image is published at named sizes` pass on the public image shape: `alt` (nullable string), named-size `paths` for `card`, `detail`, `thumb`, and `zoom`, and `imagePath` equal to the `detail` path.
- [ ] 3.2 Make admin listing reads carry gallery images with alt and paths (list: nullable first-image thumb; get: every gallery image with alt and paths), aligned with admin-listing's ordered media.
- [ ] 3.3 Add the image upload, delete, and alt-only calls to the admin client port and its fixture so groups 7 and 8 can build against fixtures alone.
- [ ] 3.4 Run `pnpm run typecheck` and the contracts lane.

## 4. Migrate the auction listing and gallery model (grade10)

- [ ] 4.1 Make the existing-listing migration scenario pass: expand the listing row for the draft/created lifecycle, slug, scheduled publication, and nullable draft fields while backfilling complete live rows without breaking their auction identities.
- [ ] 4.2 Make the gallery migration scenario pass: replace physical-side image rows with ordered media rows, preserve each existing image in deterministic order, and enforce one-to-eight items, positions, and supported stored metadata structurally.
- [ ] 4.3 Generate the auction migration artifacts and verify the migration/schema suites with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, and `pnpm run test:backend`.

## 5. Listing photo data (grade10)

Depends on nothing in group 3. Lands with or after group 4's ordered-media
columns.

- [ ] 5.1 Add nullable `alt` (text, ≤ 200 after trim) to `auction_listing_images`.
- [ ] 5.2 Run `pnpm run db:drizzle:generate` and `pnpm run check:migrations`, and commit the generated SQL.

## 6. Implement the authoritative listing lifecycle and public surface (grade10)

Depends on groups 2 and 4.

- [ ] 6.1 Make the draft-save scenarios pass: authorized operators can save empty and partial drafts, while malformed field values and unauthorized price/window writes are refused without changing the row or public catalogue.
- [ ] 6.2 Make the create and editable-update scenarios pass: create validates every required field and defaults optional fields, created/published edits preserve the lifecycle invariants, and closed/settled/canceled listings reject rewrites.
- [ ] 6.3 Make the slug lookup and cancellation scenarios pass: protect held slugs transactionally, expose only public states at `/auction/listings/<slug>`, and rewrite a canceled slug atomically while preserving existing authorization-release behaviour.
- [ ] 6.4 Make the immediate and scheduled publication scenarios pass: validate a future publish time, publish a created listing now, and add an idempotent bounded due-publish sweep that locks and rechecks each candidate before it becomes public.
- [ ] 6.5 Make the ordered media scenarios pass: accept supported image and video originals up to 100 MiB, enforce gallery cardinality and ordering, reject unsupported or closed-listing writes, and serve the first item as the catalogue card; originals remain unprocessed (named sizes are group 7).
- [ ] 6.6 Verify the worker and API surface with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and `pnpm run build`.

## 7. Auction backend sized delivery and alt (grade10)

Depends on the columns in groups 4 and 5. The public image shape in group 3
is the encode target. Gallery position / eight cap / video types come from
admin-listing (group 6).

- [ ] 7.1 Rename the wrangler binding and env field to `AUCTION_LISTING_ASSETS` with bucket names `grade10-auction-listing-assets-{dev,staging,production}`, bind `IMAGES`, and run `pnpm run cf-typegen`.
- [ ] 7.2 Make `An accepted upload becomes a gallery image`, `An unsupported type is refused`, and `An oversized image is refused` pass on the byte route, measuring width and height with the Images port for rasters.
- [ ] 7.3 Make replace/remove/add follow admin-listing gallery rules (`Replace and remove follow the admin-listing gallery rules`, `A published listing can gain another image`, `Adding after close is refused`).
- [ ] 7.4 Make `Missing alt uses the listing title`, `Supplied alt is shown`, `Alt can be edited on a published listing`, and `Over-length alt is refused` pass on upload and on `listings.updateImageAlt`.
- [ ] 7.5 Make `The catalogue uses card size for an image card`, `The details gallery uses thumb, detail, and zoom`, and `An unknown size is not found` pass on `GET /api/public/listing-images/:size/*`, transforming through the Images port when the stored bytes exceed the named ceiling.
- [ ] 7.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 8. Extend the auction admin feature slice (grade10)

Depends on group 2.

- [ ] 8.1 Make the admin repository and fixture scenarios for saving a draft, creating it, editing it, publishing it, and calling it off pass through the existing DI-backed `catalog/listings` feature.
- [ ] 8.2 Make the admin repository and fixture scenarios for upload, reorder, and removal of ordered image/video media pass, including query invalidation after every successful listing mutation.
- [ ] 8.3 Verify the auction admin frontend package with its focused module/hook tests, `pnpm run typecheck`, and `pnpm run lint`.

## 9. Admin photo manager (grade10)

Depends on group 1 through the submodule bump, and on groups 3 and 7's
fixtures / procedure shapes. Preview and confirm stay in the admin client —
no backend change; confirm calls the existing byte upload and discard never
reaches the network. Dialog is an ordered gallery (≤ eight), not six sides.

- [ ] 9.1 Bump the `external/grade10-spec` submodule to the commit carrying group 1.
- [ ] 9.2 Make `Operators attach gallery images from admin` and `An accepted upload becomes a gallery image` pass with a Photos dialog on the listings surface and the byte upload on the admin client.
- [ ] 9.3 Make gallery replace/remove/add/alt controls follow admin-listing status rules plus `Alt can be edited on a published listing` and `Adding after close is refused`.
- [ ] 9.4 Make `An unsupported type is refused`, `An oversized image is refused`, and `Over-length alt is refused` pass as inline errors that leave the gallery unchanged.
- [ ] 9.5 Make `Choosing a file shows a preview without uploading` and
  `Discarding the preview leaves the gallery unchanged` pass in the admin Photos
  dialog: selecting a file shows a local preview with Confirm and
  Discard, and Discard clears the preview without calling the upload client.
- [ ] 9.6 Make `Confirming the preview stores the image` and
  `An accepted upload becomes a gallery image` pass by uploading only when
  Confirm is pressed (add and draft replace), then clearing the preview.
- [ ] 9.7 Make `The admin photo manager shows card size`, `Hovering the magnify
  control shows zoom size`, and `Leaving the magnify control hides zoom` pass:
  stored images use card size, and hovering the magnify control reveals a zoom
  preview at least three-quarters of the viewport height. Layout of the photo
  manager is not prescribed.
- [ ] 9.8 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 10. Compose the Grade10 admin listing screens (grade10)

Depends on groups 2 and 8. Fixtures, not a running backend.

- [ ] 10.1 Make the admin form scenarios for empty-draft save, required-field create feedback, editable-field updates, publish-now/schedule, and permission-gated call-off pass using the contract-backed listing feature and the UI source recorded in `ui.md`.
- [ ] 10.2 Make the gallery form scenarios for mixed ordered image/video uploads, eighth-item acceptance, ninth-item refusal, reorder/removal, and closed-listing refusal pass without reaching the worker transport from the app.
- [ ] 10.3 Make the collector listing-page scenarios for slug routing, not-found private states, and ordered image/video gallery rendering pass using the public listing contract.
- [ ] 10.4 Verify the admin and storefront lifecycle integration with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 11. Storefront catalogue and details (grade10)

Depends on group 1 through the submodule bump, and on group 3. Fixtures, not
a running backend.

- [ ] 11.1 Make `A listing with a first gallery image shows it on the catalogue` and `A listing without a catalogue image still lists` pass on the grade10 `/auction` listing row using `paths.card` for the first image item.
- [ ] 11.2 Make `Several images appear in gallery order`, `One image has no strip`, `No images still shows the listing`, `Missing alt uses the listing title`, and `Supplied alt is shown` pass in `ListingView` by mapping `paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title` into `ListingGallery`.
- [ ] 11.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 12. Delivery and review (grade10)

- [ ] 12.1 Create `grade10-auction-listing-assets-{staging,production}` in each Cloudflare account, copy keys from the previous listing-images buckets when any exist, enable the Images binding, and confirm both resolve in staging before the worker that reads them deploys.
- [ ] 12.2 Verify every scenario in the three deltas, then run `openspec validate add-admin-auction-listing` and `openspec validate --specs`.
- [ ] 12.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build` after the feature lanes pass.
- [ ] 12.4 Review the branch for convention drift and for delta coverage separately: requirements missing, partial, or implemented differently than specified.
- [ ] 12.5 After rollout is confirmed, fold the accepted deltas into `openspec/specs/` (adding `grade10-auction` to `openspec/specs/README.md` if needed), confirm `docs/architecture/auction.md` names the binding and named sizes, and archive this change.

  Blocked on deploy: archive waits until staging (at least) runs the combined
  admin-listing + assets PRs. `docs/architecture/auction.md` already names
  `AUCTION_LISTING_ASSETS` and sized public GETs in grade10.
