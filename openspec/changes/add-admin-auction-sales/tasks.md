# Tasks: Admin auction sales

Sale events already exist in the auction worker. Groups focus on contracts /
fixtures the admin client needs, any backend verification, then admin
frontend and brand composition. No grade10-spec package group — no new
design-system or `@grade10/ui` export.

Once group 1 lands, groups 2–4 are parallel unless a prose line says
otherwise. Frontend builds against fixtures, not a running worker.

## 1. Share sale and listing-sale contracts (grade10)

- [ ] 1.1 Make the admin-sale wire scenarios pass on the shared admin
  contracts: sale statuses `draft` / `published` / `canceled`, title and copy
  shapes, and the cancellation answer shape used when a sale is called off
  (`Operator opens a draft sale`, `Operator publishes a draft sale`,
  `Operator cancels a published sale`).
- [ ] 1.2 Make the admin procedure-client and fixture scenarios pass for sale
  `get` / `update` / `cancel` (alongside existing list / create / publish) and
  for listing sale attachment via draft/create `auctionId` and
  `listings.setAuction` (`Operator updates copy on a published sale`,
  `Canceled sale rejects a title edit`, `Operator attaches a listing to a
  published sale`, `Operator clears the sale on a listing`).
- [ ] 1.3 Verify with `pnpm run typecheck`, `pnpm run lint`, and the focused
  contracts / admin-frontend fixture tests.

## 2. Verify authoritative sale lifecycle (grade10)

Depends on group 1 only where fixture shapes must match; may land beside it
when the worker already implements the scenarios.

- [ ] 2.1 Make `Operator opens a draft sale`, `Open without a title is
  refused`, and `Unauthorized open is refused` pass on the auction admin
  auctions surface.
- [ ] 2.2 Make `Operator updates copy on a published sale`, `Clearing the
  title is refused`, and `Canceled sale rejects a title edit` pass.
- [ ] 2.3 Make `Operator publishes a draft sale` and `Publish of a published
  sale is refused` pass.
- [ ] 2.4 Make `Operator cancels a published sale`, `Operator cancels a draft
  sale`, `Already canceled sale cannot be canceled again`, and
  `Unauthorized cancel is refused` pass (including listing fan-out under
  admin-listing cancel rules).
- [ ] 2.5 Make listing attach eligibility pass:
  `Canceled sale cannot receive a listing` (durable admin-listing) plus
  attach allowed for `draft` and `published` sales.
- [ ] 2.6 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend`, and `pnpm run build`.

## 3. Extend the auction admin sales and listings features (grade10)

Depends on group 1.

- [ ] 3.1 Make repository, API service, and hook scenarios for sale update and
  cancel pass through `catalog/sales` (`Operator updates copy on a published
  sale`, `Operator cancels a published sale`), including query invalidation.
- [ ] 3.2 Make listing feature scenarios for setting and clearing `saleId`
  pass on draft save / create / setAuction
  (`Operator attaches a draft listing to a draft sale`, `Operator clears the
  sale on a listing`).
- [ ] 3.3 Verify `@grade10/auction-admin-frontend` with its focused module
  tests, `pnpm run typecheck`, and `pnpm run lint`.

## 4. Compose Grade10 admin sale editor and listing sale picker (grade10)

Depends on group 3. Fixtures, not a running backend.

- [ ] 4.1 Make `Operator opens the editor for a new sale`, `Operator opens the
  editor for a draft sale`, and `Canceled sale opens read-only` pass with a
  SaleEditorPage composed like the listing editor (design-system components
  named in `ui.md`).
- [ ] 4.2 Make Sales section actions pass: open, edit save, publish, and
  permission-gated cancel
  (`Operator opens a draft sale`, `Operator publishes a draft sale`,
  `Operator cancels a published sale`, `Unauthorized cancel is refused`).
- [ ] 4.3 Make listing editor sale picker scenarios pass:
  `Operator attaches a draft listing to a draft sale`, `Operator attaches a
  listing to a published sale`, `Operator clears the sale on a listing`,
  `Canceled sales are not offered in the picker`, `Listing without a sale
  still creates`.
- [ ] 4.4 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  and `pnpm run build`.
