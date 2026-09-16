## 1. Product records and plan boundary (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Update the auction, auction index, auto-bidding, and post-sale PRD pages to state the scheduled-close trigger, duration-only policy, and queue label without duplicating the capability requirements (`grade10-site-auction-auction-SC-19`, `grade10-site-auction-auto-bidding-SC-25`, `grade10-admin-auction-post-sale-SC-64`)
- [ ] 1.2 Verify the manual and change artifacts with `pnpm check:manual` and `openspec validate revise-auction-extended-bidding --strict`

## 2. Shared auction contracts (grade10) (owner: @htonyl)

- [ ] 2.1 Update REST and procedure public listing schemas and admin queue/listing payload types to remove `extensionWindowSeconds`, add `scheduledEndsAt`, and add `extendedBidding` to queue rows (`grade10-site-auction-auction-SC-13`, `grade10-admin-auction-post-sale-SC-64`, `grade10-admin-auction-post-sale-SC-65`, `grade10-admin-auction-post-sale-SC-66`)
- [ ] 2.2 Update contract fixtures and compile-time contract tests for the breaking public and admin shapes (`grade10-site-auction-auction-SC-13`, `grade10-admin-auction-listing-SC-27a`)
- [ ] 2.3 Verify the affected contracts with `pnpm --dir packages/grade10-auction/contracts run typecheck && pnpm --dir packages/grade10-auction/contracts run test`

## 3. Auction data migration (grade10) (owner: @htonyl)

- [ ] 3.1 Remove `extension_window_seconds` and its constraint references from the auction listing schema, preserve the duration default and cap constraint, and generate the migration without rewriting effective closes (`grade10-admin-auction-listing-SC-27`, `grade10-admin-auction-listing-SC-27a`, `grade10-admin-auction-listing-SC-70`)
- [ ] 3.2 Verify the schema and migration with `pnpm run db:drizzle:generate && pnpm run check:migrations`

## 4. Auction services and API projections (grade10) (owner: @htonyl)

- [ ] 4.1 Implement scheduled-close entry, no-bid close, per-lot timer restart, exact-close acceptance, late-bid eligibility, cap handling, and automatic-bid timer refresh under the existing listing transaction lock (`grade10-site-auction-auction-SC-05`, `grade10-site-auction-auction-SC-06`, `grade10-site-auction-auction-SC-07`, `grade10-site-auction-auction-SC-07a`, `grade10-site-auction-auction-SC-07b`, `grade10-site-auction-auction-SC-19`, `grade10-site-auction-auction-SC-20`, `grade10-site-auction-auction-SC-21`, `grade10-site-auction-auction-SC-22`, `grade10-site-auction-auction-SC-23`, `grade10-site-auction-auction-SC-24`, `grade10-site-auction-auto-bidding-SC-22`, `grade10-site-auction-auto-bidding-SC-23`, `grade10-site-auction-auto-bidding-SC-24`, `grade10-site-auction-auto-bidding-SC-25`)
- [ ] 4.2 Update create/draft timing validation, listing repositories, public state projections, admin listing procedures, post-sale queue derivation, and fixture clients for duration-only settings, scheduled close, and the derived queue label (`grade10-site-auction-auction-SC-13`, `grade10-admin-auction-listing-SC-24`, `grade10-admin-auction-listing-SC-25`, `grade10-admin-auction-listing-SC-26`, `grade10-admin-auction-listing-SC-27a`, `grade10-admin-auction-listing-SC-28`, `grade10-admin-auction-listing-SC-70`, `grade10-admin-auction-post-sale-SC-64`, `grade10-admin-auction-post-sale-SC-65`, `grade10-admin-auction-post-sale-SC-66`)
- [ ] 4.3 Verify the backend with `pnpm --dir packages/grade10-auction/backend run typecheck && pnpm --dir packages/grade10-auction/backend run test && pnpm run test:backend`

## 5. Grade10 site auction surfaces (grade10) (owner: @htonyl)

- [ ] 5.1 Consume the duration-only public extension policy and scheduled close in listing types, mappers, timing hooks, listing views, and catalogue-facing copy without adding an unapproved label surface (`grade10-site-auction-auction-SC-08`, `grade10-site-auction-auction-SC-13`)
- [ ] 5.2 Update the site auction fixtures, helpers, and domain flow for a bid during extended bidding, including automatic bidding restarting the timer (`grade10-site-auction-e2e-US07-TC01-2`)
- [ ] 5.3 Verify the site packages with `pnpm --dir packages/grade10-auction/frontend run typecheck && pnpm --dir packages/grade10-auction/frontend run test && pnpm --dir apps/frontend/grade10 run typecheck && pnpm --dir apps/frontend/grade10 run test`

## 6. Grade10 admin auction surfaces (grade10) (owner: @htonyl)

- [ ] 6.1 Replace the listing editor's window-and-duration controls with the duration-and-cap payload, preserving draft, create, publish, and validation behavior (`grade10-admin-auction-listing-SC-24`, `grade10-admin-auction-listing-SC-25`, `grade10-admin-auction-listing-SC-26`, `grade10-admin-auction-listing-SC-27a`, `grade10-admin-auction-listing-SC-28`, `grade10-admin-auction-listing-SC-70`)
- [ ] 6.2 Render literal `Extended bidding: ON` beside the existing outcome badge only when the queue contract's derived boolean is true, with no new outcome filter (`grade10-admin-auction-post-sale-SC-64`, `grade10-admin-auction-post-sale-SC-65`, `grade10-admin-auction-post-sale-SC-66`)
- [ ] 6.3 Verify the admin packages with `pnpm --dir apps/admin/grade10 run typecheck && pnpm --dir apps/admin/grade10 run test && pnpm --dir apps/admin/grade10 run build && pnpm run check:admin-bundle`

## 7. Integrated auction verification (grade10) (owner: @htonyl)

- [ ] 7.1 Run the changed auction domain and API flows against the migrated schema, then reconcile any fixture or contract drift before marking the change complete (`grade10-site-auction-e2e-US07-TC01-2`)
- [ ] 7.2 Verify the repository gates with `pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run test:backend && pnpm run build && pnpm run check:libs`
