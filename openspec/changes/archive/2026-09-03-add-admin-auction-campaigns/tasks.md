# Tasks: Admin auction campaigns

Campaign covers already exist in the auction worker (`auctions` table). This
change **first** renames operator language and code identifiers from Sales to
Campaigns, then adds campaign `created`, tightens listing attach eligibility,
completes the campaign editor, and wires the listing inventory product picker
against
[`add-grade10-inventory`](../add-grade10-inventory/design.md) Contracts
(`AuctionEligibleProduct`, `listEligibleProducts`).

Once group 2 lands, groups 3–5 can proceed in parallel unless a prose line says
otherwise. Frontend builds against fixtures, not a running worker.

## 1. Rename Sales → Campaigns in admin labels and code (grade10)

No dependency on later groups — ship the label and identifier rename on the
live Sales tab and auction packages first. Do not rename `auctions` table,
`auctions.*` tRPC paths, listing `auctionId`, post-sale, or inventory
sell/sold vocabulary.

- [x] 1.1 Make `Auction admin section is labeled Campaigns` pass — tab title,
  section heading, empty states, and list actions on the existing catalogue-
  cover page use **Campaigns**, not **Sales** (today `SalesPanel` →
  `CampaignsPanel`).
- [x] 1.2 Make `Campaign editor chrome says Campaign` and `Listing editor
  campaign field is labeled Campaign` pass wherever those surfaces already
  exist or are stubbed; no Sale / Sales operator copy for this entity.
- [x] 1.3 Make `Admin catalogue-cover code uses campaign identifiers` pass —
  `@grade10/auction-contracts` exports `adminCampaign*` / `AuctionAdminCampaign*`
  (no `adminSale*` aliases); `@grade10/auction-admin-frontend` uses `campaigns`
  feature modules and tokens (not `sales`); `@grade10/auction-service` catalogue-
  cover helpers use campaign names (`publishedCampaignJoin`,
  `publicListingsOfCampaign`, `canceledCampaigns` sweep key, etc.) while
  `auctions` table and `auctions.*` tRPC paths stay unchanged.
- [x] 1.4 Verify with `pnpm run typecheck`, `pnpm run lint`, and the focused
  admin SPA / auction-admin-frontend / contracts tests that assert visible
  labels and renamed exports.

## 2. Share campaign and listing contracts (grade10)

Depends on nothing in group 1. May land beside it.

- [x] 2.1 Make the admin-campaign wire scenarios pass on `@grade10/auction-contracts`:
  rename `adminSale*` → `adminCampaign*`; campaign **`status`** includes `created`
  (`draft` / `created` / `published` / `canceled`), title and copy shapes, and
  cancellation answer shape
  (`Operator opens a draft campaign`, `Operator creates a draft campaign`,
  `Operator publishes a created campaign`, `Operator cancels a published
  campaign`) per `tech-design.md` Contracts.

## 3. Migrate campaign status and verify authoritative lifecycle (grade10)

Depends on group 2 where fixture shapes must match; may land beside group 2
when contracts already pin the shapes.

- [x] 3.1 Make the schema scenarios pass: `auctions.status` accepts
  **`created`**; `auction_listings.quantity` added; `OPEN_AUCTION_STATES` is
  `draft` | `created` only. Generate and check migrations with
  `pnpm run db:drizzle:generate` and `pnpm run check:migrations`.
- [x] 3.2 Make `Operator opens a draft campaign`, `Open without a title is
  refused`, and `Unauthorized open is refused` pass on the auction admin
  campaigns surface.
- [x] 3.4 Make `Operator updates copy on a published campaign`, `Clearing
  the title is refused`, and `Canceled campaign rejects a title edit` pass.
- [x] 3.5 Make `Operator publishes a created campaign`, `Publish of a draft
  campaign is refused`, and `Publish of a published campaign is refused`
  pass.
- [x] 3.6 Make `Operator cancels a published campaign`, `Operator cancels a
  draft campaign`, `Operator cancels a created campaign`, `Already canceled
  campaign cannot be canceled again`, and `Unauthorized cancel is refused`
  pass (including listing fan-out under admin-listing cancel rules).
- [x] 3.8 Make listing explicit Save reservation sync pass: reserve on first
  Save with product + quantity, `adjustReservation` on qty change,
  `changeReservationProduct` on product change, release on clear, effective
  available validation, and listing unchanged on inventory refusal
  (`First explicit save with product and quantity reserves stock`,
  `Clearing quantity on Save releases the hold`, `Save with product but no
  quantity creates no hold`, etc.).
- [x] 3.9 Make `listings.create` hold verification pass — refuse when hold
  missing, product mismatched, or quantity mismatched; no inventory writes
  on create (`Create refused when no hold exists`, `Create refused when hold
  product mismatches`, `Create refused when hold quantity mismatches`).
- [x] 3.10 Make listing cancel release the active inventory hold
  (`Cancel releases remaining stock`).
- [x] 3.11 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend`, and `pnpm run build`.

## 4. Extend the auction admin campaigns and listings features (grade10)

Depends on group 2. Builds on the Campaigns chrome from group 1.

- [x] 4.1 Make repository, API service, and hook scenarios for campaign
  create, update, publish, and cancel pass through the admin campaigns
  feature (`Operator creates a draft campaign`, `Operator updates copy on a
  published campaign`, `Operator publishes a created campaign`, `Operator
  cancels a published campaign`), including query invalidation.
- [x] 4.2 Make listing feature scenarios for setting and clearing the
  campaign id pass on explicit Save and `listings.setAuction` (`Operator
  attaches a draft listing to a draft campaign`, `Operator attaches a listing
  to a created campaign`, `Operator clears the campaign on a listing`).
- [x] 4.4 Verify `@grade10/auction-admin-frontend` with its focused module
  tests, `pnpm run typecheck`, and `pnpm run lint`.
