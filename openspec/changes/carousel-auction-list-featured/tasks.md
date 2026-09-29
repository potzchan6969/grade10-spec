## 1. Featured Persistence and Admin API (grade10)

- [x] 1.1 Make `grade10-admin-auction-featured-SC-01`, `SC-02`, `SC-03`, and `SC-06` pass with `auction.featured_slots` positions 1–3, unique listing bind, Ended/unpublished refuse, and incomplete slots excluded from the public Featured answer.
- [x] 1.2 Make `grade10-admin-auction-featured-SC-04`, `SC-05`, `SC-07`, and `SC-08` pass with `featured.list` / `setSlot` / `clearSlot` / `reorder`, front page image upload under a Featured object prefix (never listing gallery keys), and replace-in-place clearing the prior front page image object after commit.
- [x] 1.3 Make `grade10-admin-auction-featured-SC-09` and `SC-10` pass with `auction:write` gating on Featured admin procedures.
- [x] 1.4 Verify: focused auction backend repository/router tests for Featured, `pnpm run typecheck`, and `pnpm run lint` in grade10. Record scenario evidence.

## 2. Manage Featured Sub-Page (grade10) (owner: @mason5991)

Depends on Group 1. Entry is on the Listings tab toolbar beside Create listing.

- [x] 2.1 Make `grade10-admin-auction-featured-SC-11` pass: **Manage Featured** beside Create listing opens the Listings sub-page of ordered slots.
- [x] 2.2 Make `grade10-admin-auction-featured-SC-01`, `SC-04`, `SC-05`, `SC-07`, `SC-08`, and `SC-12` pass on that sub-page: empty slots, listing pick, front page image upload with no gallery picker, reorder, clear, and cap of three.
- [x] 2.3 Make `grade10-admin-auction-featured-SC-03` and `SC-10` pass on the sub-page: Ended listings refused; callers without `auction:write` cannot curate.
- [x] 2.4 Verify: admin-frontend feature tests, `pnpm run typecheck`, `pnpm run lint`. Record UI evidence for Manage Featured entry, fill/reorder/clear, and upload-only front page image.
- [x] 2.5 Make `grade10-admin-auction-featured-SC-12` carry the front page image brief on each slot's upload: **2400 × 1500** (8:5), subject centred, JPEG or WebP at most 400 KB, with the preview framed at 8:5.

## 3. Featured Banner Block (grade10-spec)

- [x] 3.1 Promote `FeaturedAuctionsBanner` (and quiet `AuctionCataloguePage` composition as needed) into `@grade10/ui` per `ui-design.md`, composing `ListingRollingMoneyDisplay`, `ListingCountdownDisplay`, and `CarouselProgress`. Answer shared i18n keys for banner copy in `en`, `ko`, `zh-Hans`, and `zh-Hant`.
- [x] 3.2 Make `grade10-site-auction-auction-SC-31`, `SC-32`, `SC-33`, `SC-34`, `SC-35`, `SC-36`, `SC-58`, `SC-59`, `SC-60`, and `SC-61` pass in Storybook (`auction-list-featured-auctions--carousel-banner`, All auctions, and lot-card stories): front page image/title/status/countdown/rolling bid on increase, Bid Now on Active and View Auction on Upcoming with no money until open, progress for 2–3 slides, single-slide without multi-dot requirement, All auctions infinite scroll with Boneyard load-more skeletons, Upcoming cards without starting bid.
- [x] 3.3 Verify: `pnpm --filter @grade10/ui` storybook vitest for the banner stories, `pnpm run typecheck`, `pnpm run lint`, `pnpm check:manual`. Record story evidence.
- [x] 3.4 Make `grade10-site-auction-auction-SC-35` and `SC-36` pass in Storybook on a small viewport: below `md`, stage previous/next and horizontal swipe page the stage among two or three slides and are absent for one; countdown beside the CTA; progress under the copy stack; band height holds the tallest slide; lot title clamps to four lines below `md` and three from `md`. Answer `auction.featured.previous` and `next` in `en`, `ko`, `zh-Hans`, and `zh-Hant`.

## 4. Quiet Catalogue on `/auction` (grade10) (owner: @mason5991)

Depends on Groups 1 and 3 (public Featured read + banner export).

- [x] 4.1 Make `grade10-site-auction-auction-SC-43`, `SC-57`, `SC-30`, `SC-37`, `SC-40`, `SC-41`, and `SC-42` pass on `/auction`: Featured from `featured.publicList` when complete slides exist, absent otherwise, quiet layout (no category chrome), Featured lots still in All auctions below Featured, empty All auctions with Featured present, address `/auction` with no category query.
- [x] 4.2 Make `grade10-site-auction-auction-SC-31` through `SC-36`, `SC-58` through `SC-61`, and `SC-38` / `SC-39` pass in the live catalogue: slide facts, Bid Now / View Auction by status, progress and small-viewport stage previous/next and swipe, Upcoming money withheld on Featured and All auctions, All auctions infinite scroll with Boneyard load-more skeletons, shared watch on open cards and none on closed.
- [x] 4.3 Verify: auction-frontend and grade10 frontend tests, focused Playwright catalogue flows, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`. Record browser evidence.

## 5. Product Record Close-Out (grade10-spec)

- [ ] 5.1 Keep Catalogue and Featured 🚧 marks until Groups 2–4 acceptance; after deploy, archive removes them. At fold, add `::cases{id="grade10-admin/auction/featured"}` under Featured and in the management page QA cases block — cannot land while the capability is delta-only.
- [ ] 5.2 Verify: `pnpm run validate:changes carousel-auction-list-featured`, `pnpm run tcs:validate`, `pnpm check:manual`.
