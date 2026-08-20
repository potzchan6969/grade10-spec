# Tasks: Auction listing assets

Group 1 lands in grade10-spec and is bumped as a submodule in grade10;
groups 5 and 6 are the first grade10 groups that need it. Groups 2, 3, and 4
depend on nothing in group 1 and can run beside it. Group 4 needs the columns
in group 3. Groups 5 and 6 depend on the contracts in group 2 and use
fixtures, not a running backend.

## 1. Gallery sources (grade10-spec)

- [ ] 1.1 Make `An application imports the surface` and `A part is reused alone` pass by recording `ListingGallery`, `ListingBidPanel`, `ListingDetails`, and their listed types as the `shared-ui/auction-listing` exports on the package entry.
- [ ] 1.2 Make `Distinct sources are used in each slot` and `Omitted sources fall back to src` pass on `ListingGalleryImage` via optional `thumbSrc` and `zoomSrc`.
- [ ] 1.3 Make `Several photos show a strip`, `One photo has no strip`, `No photos`, and `Labels come from the consumer` pass in the gallery stories, then run this repository's `pnpm run typecheck`, `pnpm run lint`, and the block's story tests.

## 2. Auction contracts (grade10)

- [ ] 2.1 Make `Each photo is published at named sizes` pass on the public photo shape: `alt` (nullable string), named-size `paths` for `card`, `detail`, `thumb`, and `zoom`, and `imagePath` equal to the `detail` path.
- [ ] 2.2 Make `Operators attach photos from the admin listings table` pass on the admin listing read: `listings.list` carries a nullable front photo; `listings.get` carries every attached side with alt and paths.
- [ ] 2.3 Add the photo upload, delete, and alt-only calls to the admin client port and its fixture so groups 5 and 6 can build against fixtures alone.
- [ ] 2.4 Run `pnpm run typecheck` and the contracts lane.

## 3. Listing photo data (grade10)

Depends on nothing in group 2.

- [ ] 3.1 Add nullable `alt` (text, ≤ 200 after trim) to `auction_listing_images`.
- [ ] 3.2 Run `pnpm run db:drizzle:generate` and `pnpm run check:migrations`, and commit the generated SQL.

## 4. Auction backend (grade10)

Depends on the columns in group 3. The public photo shape in group 2 is the
encode target, not a runtime import from a frontend.

- [ ] 4.1 Rename the wrangler binding and env field to `AUCTION_LISTING_ASSETS` with bucket names `grade10-auction-listing-assets-{dev,staging,production}`, bind `IMAGES`, and run `pnpm run cf-typegen`.
- [ ] 4.2 Make `An accepted upload becomes that side's photo`, `An unsupported type is refused`, and `An oversized photo is refused` pass on the byte route, measuring width and height with the Images port instead of the query string.
- [ ] 4.3 Make `A draft photo can be replaced and removed`, `Replacing a live photo is refused`, `Removing a live photo is refused`, `A published listing can gain a missing side`, and `Adding after close is refused` pass by splitting add from replace from remove.
- [ ] 4.4 Make `Missing alt uses the listing title`, `Supplied alt is shown`, `Alt can be edited on a published listing`, and `Over-length alt is refused` pass on upload and on `listings.updateImageAlt`.
- [ ] 4.5 Make `The catalogue uses card size`, `The details gallery uses thumb, detail, and zoom`, and `An unknown size is not found` pass on `GET /api/public/listing-images/:size/*`, transforming through the Images port when the stored bytes exceed the named ceiling.
- [ ] 4.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 5. Admin photo manager (grade10)

Depends on group 1 through the submodule bump, and on groups 2 and 4's
fixtures / procedure shapes.

- [ ] 5.1 Bump the `external/grade10-spec` submodule to the commit carrying group 1.
- [ ] 5.2 Make `Operators attach photos from the admin listings table` and `An accepted upload becomes that side's photo` pass with a Photos dialog on the listings table, six side slots, and the byte upload on the admin client.
- [ ] 5.3 Make `A draft photo can be replaced and removed`, `A published listing can gain a missing side`, `Replacing a live photo is refused`, `Removing a live photo is refused`, `Alt can be edited on a published listing`, and `Adding after close is refused` pass as enabled and disabled controls plus the matching refusals.
- [ ] 5.4 Make `An unsupported type is refused`, `An oversized photo is refused`, and `Over-length alt is refused` pass as inline errors that leave the side unchanged.
- [ ] 5.5 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 6. Storefront catalogue and details (grade10)

Depends on group 1 through the submodule bump, and on group 2. Fixtures, not
a running backend.

- [ ] 6.1 Make `A listing with a front photo shows it on the catalogue` and `A listing without a front photo still lists` pass on the grade10 `/auction` listing row using `paths.card`.
- [ ] 6.2 Make `Several sides appear in side order`, `One photo has no strip`, `No photos still shows the listing`, `Missing alt uses the listing title`, and `Supplied alt is shown` pass in `ListingView` by mapping `paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title` into `ListingGallery`.
- [ ] 6.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 7. Delivery and review (grade10)

- [ ] 7.1 Create `grade10-auction-listing-assets-{staging,production}` in each Cloudflare account, copy keys from the previous listing-images buckets when any exist, enable the Images binding, and confirm both resolve in staging before the worker that reads them deploys.
- [ ] 7.2 Verify every scenario in both deltas, then run `openspec validate add-auction-listing-assets` and `openspec validate --specs`.
- [ ] 7.3 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build` after the feature lanes pass.
- [ ] 7.4 Review the branch for convention drift and for delta coverage separately: requirements missing, partial, or implemented differently than specified.
- [ ] 7.5 After rollout is confirmed, fold both accepted deltas into `openspec/specs/` (adding `grade10-auction` to `openspec/specs/README.md` if `add-grade10-auction` has not already), update `docs/architecture/auction.md` for the renamed binding and named sizes, and archive this change.
