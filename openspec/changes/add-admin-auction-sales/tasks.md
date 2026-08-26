# Tasks: Admin auction sales

Sale events already exist in the auction worker. This change adds `created`,
tightens listing attach eligibility, and completes the admin sale editor and
listing sale picker. Once group 1 lands, groups 2–4 are parallel unless a
prose line says otherwise. Frontend builds against fixtures, not a running
worker.

## 1. Share sale and listing-sale contracts (grade10)

- [ ] 1.1 Make the admin-sale wire scenarios pass on the shared admin
  contracts: sale statuses `draft` / `created` / `published` / `canceled`,
  title and copy shapes, and the cancellation answer shape
  (`Operator opens a draft sale`, `Operator creates a draft sale`,
  `Operator publishes a created sale`, `Operator cancels a published sale`).
- [ ] 1.2 Make the admin procedure-client and fixture scenarios pass for sale
  `get` / `update` / `cancel` / create-transition (alongside list / open /
  publish) and for listing sale attachment via draft/create `auctionId` and
  `listings.setAuction` (`Operator updates copy on a published sale`,
  `Canceled sale rejects a title edit`, `Operator attaches a listing to a
  created sale`, `Operator clears the sale on a listing`,
  `Published sale cannot receive a listing`).
- [ ] 1.3 Verify with `pnpm run typecheck`, `pnpm run lint`, and the focused
  contracts / admin-frontend fixture tests.

## 2. Migrate sale status and verify authoritative lifecycle (grade10)

Depends on group 1 only where fixture shapes must match; may land beside it
when contracts already pin the shapes.

- [ ] 2.1 Make the schema / status-check scenarios pass: `auctions.status`
  accepts `created`; `OPEN_AUCTION_STATES` is `draft` | `created` only
  (`Operator creates a draft sale`, `Published sale cannot receive a
  listing`). Generate and check the migration with
  `pnpm run db:drizzle:generate` and `pnpm run check:migrations`.
- [ ] 2.2 Make `Operator opens a draft sale`, `Open without a title is
  refused`, and `Unauthorized open is refused` pass on the auction admin
  auctions surface.
- [ ] 2.3 Make `Operator creates a draft sale` and `Create of a created sale
  is refused` pass.
- [ ] 2.4 Make `Operator updates copy on a published sale`, `Clearing the
  title is refused`, and `Canceled sale rejects a title edit` pass.
- [ ] 2.5 Make `Operator publishes a created sale`, `Publish of a draft sale
  is refused`, and `Publish of a published sale is refused` pass.
- [ ] 2.6 Make `Operator cancels a published sale`, `Operator cancels a draft
  sale`, `Operator cancels a created sale`, `Already canceled sale cannot be
  canceled again`, and `Unauthorized cancel is refused` pass (including
  listing fan-out under admin-listing cancel rules).
- [ ] 2.7 Make listing attach eligibility pass: attach allowed for `draft`
  and `created` only; `Published sale cannot receive a listing` and durable
  canceled-sale refusal.
- [ ] 2.8 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend`, and `pnpm run build`.

## 3. Extend the auction admin sales and listings features (grade10)

Depends on group 1.

- [ ] 3.1 Make repository, API service, and hook scenarios for sale create,
  update, publish, and cancel pass through `catalog/sales`
  (`Operator creates a draft sale`, `Operator updates copy on a published
  sale`, `Operator publishes a created sale`, `Operator cancels a published
  sale`), including query invalidation.
- [ ] 3.2 Make listing feature scenarios for setting and clearing `saleId`
  pass on draft save / create / setAuction
  (`Operator attaches a draft listing to a draft sale`, `Operator attaches a
  listing to a created sale`, `Operator clears the sale on a listing`).
- [ ] 3.3 Verify `@grade10/auction-admin-frontend` with its focused module
  tests, `pnpm run typecheck`, and `pnpm run lint`.

## 4. Compose Grade10 admin sale editor and listing sale picker (grade10)

Depends on group 3. Fixtures, not a running backend.

- [ ] 4.1 Make `Operator opens the editor for a new sale`, `Operator opens the
  editor for a draft sale`, `Operator opens the editor for a created sale`,
  and `Canceled sale opens read-only` pass with a SaleEditorPage composed
  like the listing editor (design-system components named in `ui.md`).
- [ ] 4.2 Make Sales section actions pass: open, create, edit save, publish,
  and permission-gated cancel
  (`Operator opens a draft sale`, `Operator creates a draft sale`,
  `Operator publishes a created sale`, `Operator cancels a published sale`,
  `Unauthorized cancel is refused`).
- [ ] 4.3 Make listing editor sale picker scenarios pass:
  `Operator attaches a draft listing to a draft sale`, `Operator attaches a
  listing to a created sale`, `Operator clears the sale on a listing`,
  `Published and canceled sales are not offered in the picker`,
  `Listing without a sale still creates`.
- [ ] 4.4 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  and `pnpm run build`.
