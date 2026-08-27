# Tasks: Admin auction campaigns

Campaign covers already exist in the auction worker (`auctions` table). This
change **first** renames operator language from Sales to Campaigns on the
existing admin tab, then adds `created`, tightens listing attach eligibility,
and completes the campaign editor and listing campaign picker. Once group 2
lands, groups 3–5 are parallel unless a prose line says otherwise. Frontend
builds against fixtures, not a running worker.

## 1. Rename Sales → Campaigns in the Grade10 auction admin (grade10)

No dependency on later groups — ship the label change on the live Sales tab
and listing-editor wording first.

- [ ] 1.1 Make `Auction admin section is labeled Campaigns` pass — tab title,
  section heading, empty states, and list actions on the existing catalogue-
  cover page use **Campaigns**, not **Sales** (today `SalesPanel`).
- [ ] 1.2 Make `Campaign editor chrome says Campaign` and `Listing editor
  campaign field is labeled Campaign` pass wherever those surfaces already
  exist or are stubbed; no Sale / Sales operator copy for this entity.
- [ ] 1.3 Verify with `pnpm run typecheck`, `pnpm run lint`, and the focused
  admin SPA / auction-admin-frontend tests that assert visible labels.

## 2. Share campaign and listing-campaign contracts (grade10)

- [ ] 2.1 Make the admin-campaign wire scenarios pass on the shared admin
  contracts: campaign statuses `draft` / `created` / `published` /
  `canceled`, title and copy shapes, and the cancellation answer shape
  (`Operator opens a draft campaign`, `Operator creates a draft campaign`,
  `Operator publishes a created campaign`, `Operator cancels a published
  campaign`).
- [ ] 2.2 Make the admin procedure-client and fixture scenarios pass for
  campaign `get` / `update` / `cancel` / create-transition (alongside list /
  open / publish) and for listing campaign attachment via draft/create
  `auctionId` and `listings.setAuction` (`Operator updates copy on a
  published campaign`, `Canceled campaign rejects a title edit`, `Operator
  attaches a listing to a created campaign`, `Operator clears the campaign
  on a listing`, `Published campaign cannot receive a listing`).
- [ ] 2.3 Make listing inventory product eligibility scenarios pass on
  contracts/fixtures: picker options and save/create refusals for draft and
  out-of-stock products (`Product picker omits draft inventory products`,
  `Product picker omits out-of-stock inventory products`, `Draft product id
  is refused on listing save`, `Out-of-stock product id is refused on listing
  create`), stubbing inventory’s Auction eligibility list until that change
  ships.
- [ ] 2.4 Verify with `pnpm run typecheck`, `pnpm run lint`, and the focused
  contracts / admin-frontend fixture tests.

## 3. Migrate campaign status and verify authoritative lifecycle (grade10)

Depends on group 2 only where fixture shapes must match; may land beside it
when contracts already pin the shapes.

- [ ] 3.1 Make the schema / status-check scenarios pass: `auctions.status`
  accepts `created`; `OPEN_AUCTION_STATES` is `draft` | `created` only
  (`Operator creates a draft campaign`, `Published campaign cannot receive a
  listing`). Generate and check the migration with
  `pnpm run db:drizzle:generate` and `pnpm run check:migrations`.
- [ ] 3.2 Make `Operator opens a draft campaign`, `Open without a title is
  refused`, and `Unauthorized open is refused` pass on the auction admin
  campaigns surface.
- [ ] 3.3 Make `Operator creates a draft campaign` and `Create of a created
  campaign is refused` pass.
- [ ] 3.4 Make `Operator updates copy on a published campaign`, `Clearing
  the title is refused`, and `Canceled campaign rejects a title edit` pass.
- [ ] 3.5 Make `Operator publishes a created campaign`, `Publish of a draft
  campaign is refused`, and `Publish of a published campaign is refused`
  pass.
- [ ] 3.6 Make `Operator cancels a published campaign`, `Operator cancels a
  draft campaign`, `Operator cancels a created campaign`, `Already canceled
  campaign cannot be canceled again`, and `Unauthorized cancel is refused`
  pass (including listing fan-out under admin-listing cancel rules).
- [ ] 3.7 Make listing attach eligibility pass: attach allowed for `draft`
  and `created` only; `Published campaign cannot receive a listing` and
  durable canceled-campaign refusal.
- [ ] 3.8 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend`, and `pnpm run build`.

## 4. Extend the auction admin campaigns and listings features (grade10)

Depends on group 2. Builds on the Campaigns chrome from group 1.

- [ ] 4.1 Make repository, API service, and hook scenarios for campaign
  create, update, publish, and cancel pass through the admin campaigns
  feature (`Operator creates a draft campaign`, `Operator updates copy on a
  published campaign`, `Operator publishes a created campaign`, `Operator
  cancels a published campaign`), including query invalidation.
- [ ] 4.2 Make listing feature scenarios for setting and clearing the
  campaign id pass on draft save / create / setAuction (`Operator attaches
  a draft listing to a draft campaign`, `Operator attaches a listing to a
  created campaign`, `Operator clears the campaign on a listing`).
- [ ] 4.3 Make listing productId eligibility pass against inventory’s
  Auction-facing list (created + ready available > 0), including refusals
  for draft and out-of-stock products.
- [ ] 4.4 Verify `@grade10/auction-admin-frontend` with its focused module
  tests, `pnpm run typecheck`, and `pnpm run lint`.

## 5. Compose Grade10 admin campaign editor and listing picker (grade10)

Depends on groups 1 and 4. Fixtures, not a running backend.

- [ ] 5.1 Make `Operator opens the editor for a new campaign`, `Operator
  opens the editor for a draft campaign`, `Operator opens the editor for a
  created campaign`, and `Canceled campaign opens read-only` pass with a
  CampaignEditorPage composed like the listing editor (design-system
  components named in `ui.md`).
- [ ] 5.2 Make Campaigns section actions pass: open, create, edit save,
  publish, and permission-gated cancel (`Operator opens a draft campaign`,
  `Operator creates a draft campaign`, `Operator publishes a created
  campaign`, `Operator cancels a published campaign`, `Unauthorized cancel
  is refused`).
- [ ] 5.3 Make listing editor campaign picker scenarios pass: `Operator
  attaches a draft listing to a draft campaign`, `Operator attaches a
  listing to a created campaign`, `Operator clears the campaign on a
  listing`, `Published and canceled campaigns are not offered in the
  picker`, `Listing without a campaign still creates`.
- [ ] 5.4 Make listing editor inventory product picker scenarios pass:
  `Product picker omits draft inventory products`, `Product picker omits
  out-of-stock inventory products`, `Draft product id is refused on listing
  save`, `Out-of-stock product id is refused on listing create`.
- [ ] 5.5 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  and `pnpm run build`.
