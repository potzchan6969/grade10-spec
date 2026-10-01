# Tasks

Landing order is [`tech-design.md`](tech-design.md)'s Migration Plan. Group 1
lands in **grade10-spec** and the submodule bump carries it; groups 2 to 15
land in **grade10**, after `vault-walk-ins-and-owners` has landed. Group 2 is
the contract every other application group reads: once it has landed, the
inventory groups (3 to 6), the vault groups (7 to 10) and the frontend groups
(11 to 13) are parallel, the frontends working against the fixture transports
rather than a running worker. Group 14 is the walk, and group 15, in
grade10-spec, takes the manual's marks off once the walk is green.

## 1. The category words (grade10-spec)

- [ ] 1.1 Name `comic`, `banknote`, `stamp` and `memorabilia` under `vault.category` in the vocabulary type first, so `pnpm --filter @grade10/i18n run test` refuses every language that has not answered them
- [ ] 1.2 Answer the four words in `packages/i18n/messages/shared/<locale>/vault.json` for `en`, `ko`, `zh-Hans` and `zh-Hant`
- [ ] 1.3 Verify: `pnpm --filter @grade10/i18n run test`, `pnpm run typecheck`, `pnpm run lint`

## 2. Contracts and grants (grade10)

- [ ] 2.1 Tests first, in their own commit: the role matrix and vocabulary tests, the `ADMIN_PERMISSIONS` ↔ router pin for `items.*`, and the category list shared by inventory and vault (`shared-auth-roles-SC-23`, `shared-auth-roles-SC-24`, `grade10-admin-inventory-items-SC-68`)
- [ ] 2.2 `packages/grade10-auth/contracts`: `inventory: ["read", "write", "transfer"]`, `staff` holding `inventory:transfer`, its description, and the regenerated `roles-and-permissions.json` (`shared-auth-roles-SC-23`, `shared-auth-roles-SC-24`)
- [ ] 2.3 `packages/inventory/contracts`: `ITEM_CATEGORIES`, `ITEM_GRADERS`, the retire reasons and owner kinds; the `items.*` wire schemas and refusal codes; `VaultItemsServiceApi` with `getVaultItemsService()`; `items.*` in `ADMIN_PERMISSIONS` under read, write and transfer (`grade10-admin-inventory-items-SC-68`)
- [ ] 2.4 `packages/vault/contracts`: `VAULT_ITEM_CATEGORIES` as the ten; `InventoryVaultServiceApi` with `getInventoryVaultService()`; the `slab` input on the valuation start and the walk-in open; `cases.lookupSlab`; the case read's `item` field; `REGISTER_PENDING`, `REGISTER_UNREACHABLE`, `ITEM_OWNER_DIFFERS` and `SLAB_MARKED`
- [ ] 2.5 Fixtures for both transports: an item graded and one not, a marked item, a retired one, a move with a proof and one without
- [ ] 2.6 Bump `external/grade10-spec` to group 1
- [ ] 2.7 Verify: `pnpm --dir packages/grade10-auth/contracts run generate:rbac-docs`, `pnpm run typecheck`, `pnpm run test:backend`

## 3. The register's tables (grade10)

- [ ] 3.1 Tests first, in their own commit: `*.repo.test.ts` over PGlite for the live-slab index, the owner and slab checks, mark uniqueness and the `place_words` dedupe, with `*.drizzle.test.ts` for the list's keyset and search predicates (`grade10-admin-inventory-items-SC-07`, `grade10-admin-inventory-items-SC-08`, `grade10-admin-inventory-items-SC-09`, `grade10-admin-inventory-items-SC-49`)
- [ ] 3.2 The migration for `items`, `item_marks`, `item_moves`, `item_move_proofs`, `item_proof_uploads` and `place_words` in `apps/backend/grade10/inventory`, with its snapshot (`grade10-admin-inventory-items-SC-07`, `grade10-admin-inventory-items-SC-09`)
- [ ] 3.3 Repositories `items`, `itemMarks`, `itemMoves`, `itemProofs` and `placeWords` under `packages/inventory/backend/src/repositories/` (`grade10-admin-inventory-items-SC-08`, `grade10-admin-inventory-items-SC-49`)
- [ ] 3.4 Verify: `pnpm run db:drizzle:generate` (no drift), `pnpm run check:migrations`, `pnpm db:status`, `pnpm run test:backend`

## 4. What the vault tells the register (grade10)

- [ ] 4.1 Tests first, in their own commit: service tests for `tell`, `lookupSlab` and `itemOf` over a fake repository, and a repository test applying each word twice (`grade10-admin-inventory-items-SC-20`, `grade10-admin-inventory-items-SC-21`, `grade10-admin-inventory-items-SC-22`, `grade10-admin-inventory-items-SC-23`, `grade10-admin-inventory-items-SC-30`, `grade10-admin-inventory-items-SC-42`, `grade10-admin-inventory-items-SC-43`)
- [ ] 4.2 `services/items/places.ts`: apply `registered`, `marked` and `unmarked` in one transaction behind the `place_words` insert, with the `cert_taken` outcome and the forfeit's move to the lender (`grade10-admin-inventory-items-SC-20`, `grade10-admin-inventory-items-SC-21`, `grade10-admin-inventory-items-SC-22`, `grade10-admin-inventory-items-SC-23`, `grade10-admin-inventory-items-SC-30`, `grade10-admin-inventory-items-SC-42`, `grade10-admin-inventory-items-SC-43`)
- [ ] 4.3 The `VaultItemsService` named entrypoint in `rpc/entrypoints.ts` implementing `VaultItemsServiceApi`, and its auxiliary-worker test
- [ ] 4.4 Verify: `pnpm run test:backend`, `pnpm run typecheck`, `node scripts/checks/check-rpc-stubs.mjs`

## 5. The register's console acts and reads (grade10)

- [ ] 5.1 Tests first, in their own commit: service tests per act and read, route tests for the proof upload, and the `casesOf` client against an auxiliary vault worker (`grade10-admin-inventory-items-SC-01`, `grade10-admin-inventory-items-SC-02`, `grade10-admin-inventory-items-SC-04`, `grade10-admin-inventory-items-SC-05`, `grade10-admin-inventory-items-SC-07`, `grade10-admin-inventory-items-SC-08`, `grade10-admin-inventory-items-SC-11`, `grade10-admin-inventory-items-SC-13`, `grade10-admin-inventory-items-SC-14`, `grade10-admin-inventory-items-SC-16`, `grade10-admin-inventory-items-SC-17`, `grade10-admin-inventory-items-SC-19`, `grade10-admin-inventory-items-SC-26`, `grade10-admin-inventory-items-SC-28`, `grade10-admin-inventory-items-SC-29`, `grade10-admin-inventory-items-SC-33`, `grade10-admin-inventory-items-SC-36`, `grade10-admin-inventory-items-SC-37`, `grade10-admin-inventory-items-SC-39`, `grade10-admin-inventory-items-SC-41`, `grade10-admin-inventory-items-SC-44`, `grade10-admin-inventory-items-SC-45`, `grade10-admin-inventory-items-SC-47`, `grade10-admin-inventory-items-SC-48`, `grade10-admin-inventory-items-SC-49`, `grade10-admin-inventory-items-SC-52`, `grade10-admin-inventory-items-SC-53`, `grade10-admin-inventory-items-SC-54`, `grade10-admin-inventory-items-SC-56`)
- [ ] 5.2 `items.register` and `items.edit`: the fact rules, the trimmed upper-case cert, the live-slab refusal naming the item, the owner by exact email or the custodian, the owner read-only on edit, and `updated_*` (`grade10-admin-inventory-items-SC-01`, `grade10-admin-inventory-items-SC-02`, `grade10-admin-inventory-items-SC-04`, `grade10-admin-inventory-items-SC-05`, `grade10-admin-inventory-items-SC-07`, `grade10-admin-inventory-items-SC-08`, `grade10-admin-inventory-items-SC-11`, `grade10-admin-inventory-items-SC-13`, `grade10-admin-inventory-items-SC-19`)
- [ ] 5.3 The proof upload route over a new private `INVENTORY_ITEM_PROOFS` bucket and its storage area, and `items.transfer` under the item's lock, refusing a marked, retired or same-owner move and sending no message (`grade10-admin-inventory-items-SC-19`, `grade10-admin-inventory-items-SC-33`, `grade10-admin-inventory-items-SC-36`, `grade10-admin-inventory-items-SC-37`, `grade10-admin-inventory-items-SC-39`, `grade10-admin-inventory-items-SC-41`)
- [ ] 5.4 `items.proof` under `inventory:transfer`, writing its audit entry (`grade10-admin-inventory-items-SC-44`, `grade10-admin-inventory-items-SC-45`)
- [ ] 5.5 `items.retire` and `items.restore` (`grade10-admin-inventory-items-SC-47`, `grade10-admin-inventory-items-SC-48`, `grade10-admin-inventory-items-SC-49`)
- [ ] 5.6 `items.closeMark` asking `InventoryVaultService.casesOf` before its transaction; the `VAULT` binding in every environment of `apps/backend/grade10/inventory/wrangler.jsonc`, then `pnpm run cf-typegen` (`grade10-admin-inventory-items-SC-28`, `grade10-admin-inventory-items-SC-29`)
- [ ] 5.7 `items.list`, `items.get` and `items.resolveOwner`: the three tabs and keyset paging, the ordered search, names per page through `accountsByUserIds` behind `kyc:read` with the read's audit entry, the place row's status from `casesOf` as a value (`grade10-admin-inventory-items-SC-14`, `grade10-admin-inventory-items-SC-16`, `grade10-admin-inventory-items-SC-17`, `grade10-admin-inventory-items-SC-26`, `grade10-admin-inventory-items-SC-52`, `grade10-admin-inventory-items-SC-53`, `grade10-admin-inventory-items-SC-54`, `grade10-admin-inventory-items-SC-56`)
- [ ] 5.8 Verify: `pnpm run test:backend`, `pnpm --dir packages/api-docs run generate` (commit), `pnpm run check:libs`, `pnpm run typecheck`

## 6. The register's erasure and retention (grade10)

- [ ] 6.1 Tests first, in their own commit: erasure service and repository tests, and the retention gauge (`grade10-admin-inventory-items-SC-63`, `grade10-admin-inventory-items-SC-64`, `grade10-admin-inventory-items-SC-65`, `grade10-admin-inventory-items-SC-66`, `grade10-admin-inventory-items-SC-67`)
- [ ] 6.2 `packages/inventory/backend/src/erasure/` over `createErasureRouter`: the holds per marked item, and the one-transaction erase of owners, titles, descriptions, move sides and reasons, place owners and word payloads, keeping a proof only while its other side remains (`grade10-admin-inventory-items-SC-63`, `grade10-admin-inventory-items-SC-64`, `grade10-admin-inventory-items-SC-65`, `grade10-admin-inventory-items-SC-67`)
- [ ] 6.3 The proof retention review on the hourly cron, flagging kept proofs past the brand's `agreements` window on `inventory.retention.proofs` and deleting nothing (`grade10-admin-inventory-items-SC-66`)
- [ ] 6.4 Add inventory to the registry of erasure consumers and to the console's checklist list
- [ ] 6.5 Verify: `pnpm run test:backend`, `pnpm run check:libs`

## 7. The vault's words (grade10)

- [ ] 7.1 Tests first, in their own commit: transition tests that each act writes its one word in its own transaction, a corrected advance writing none, and the delivery list's ordering, retry and park against a fake register, and `casesOf` answering held or not (`grade10-admin-inventory-items-SC-28`, `grade10-site-vault-case-lifecycle-SC-41`, `grade10-site-vault-case-lifecycle-SC-42`, `grade10-site-vault-case-lifecycle-SC-43`, `grade10-site-vault-case-lifecycle-SC-44`, `grade10-site-vault-case-lifecycle-SC-45`, `grade10-admin-inventory-items-SC-24`)
- [ ] 7.2 The migration: `case_items.register_item_id`, `slab_grader`, `slab_cert`, the category check widened to the ten `NOT VALID` then validated, and `register_words`; with its snapshot
- [ ] 7.3 Write `registered` at Start valuation (minting the item id), `marked` at vaulting, and `unmarked` at release, unwind and forfeit, naming the lender on the forfeit (`grade10-site-vault-case-lifecycle-SC-41`, `grade10-site-vault-case-lifecycle-SC-42`, `grade10-site-vault-case-lifecycle-SC-43`, `grade10-site-vault-case-lifecycle-SC-45`, `grade10-admin-inventory-items-SC-24`)
- [ ] 7.4 `deliverRegisterWords`: the after-commit best-effort attempt and the fast lane's `registerWords` list on the ladder, parking at the cap on `vault.register.parked`; the `INVENTORY_ITEMS` binding to `VaultItemsService` in every environment, then `pnpm run cf-typegen` (`grade10-site-vault-case-lifecycle-SC-44`)
- [ ] 7.5 The `InventoryVaultService` named entrypoint answering `casesOf` (`grade10-admin-inventory-items-SC-28`)
- [ ] 7.6 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run test:backend`, `pnpm run check:libs`

## 8. Naming a known slab (grade10)

- [ ] 8.1 Tests first, in their own commit: service tests for the lookup at the walk-in open and at Start valuation, and the linked draft's edit refusal (`grade10-admin-vault-operator-queue-SC-59`, `grade10-admin-vault-operator-queue-SC-60`, `grade10-admin-vault-operator-queue-SC-61`, `grade10-admin-vault-operator-queue-SC-62`, `grade10-admin-vault-operator-queue-SC-63`, `grade10-admin-vault-operator-queue-SC-64`, `grade10-admin-vault-operator-queue-SC-65`, `grade10-site-vault-case-intake-SC-32`, `grade10-site-vault-case-intake-SC-34`)
- [ ] 8.2 `cases.lookupSlab`, and the optional slab on the walk-in open and on Start valuation: link a live item, refuse `SLAB_MARKED`, keep an unknown or retired pair for the registration (`grade10-admin-vault-operator-queue-SC-59`, `grade10-admin-vault-operator-queue-SC-60`, `grade10-admin-vault-operator-queue-SC-61`, `grade10-admin-vault-operator-queue-SC-62`, `grade10-admin-vault-operator-queue-SC-63`, `grade10-admin-vault-operator-queue-SC-64`, `grade10-admin-vault-operator-queue-SC-65`)
- [ ] 8.3 The collector's draft edit refusing category and title on a draft holding a known slab, and the request taking the ten categories (`grade10-site-vault-case-intake-SC-32`, `grade10-site-vault-case-intake-SC-34`)
- [ ] 8.4 Verify: `pnpm run test:backend`, `pnpm run typecheck`

## 9. The register on the paper (grade10)

- [ ] 9.1 Tests first, in their own commit: prepare-documents tests over a fake register, and the custody agreement's render test (`grade10-site-vault-case-lifecycle-SC-46`, `grade10-site-vault-case-lifecycle-SC-47`, `grade10-site-vault-case-lifecycle-SC-48`, `grade10-site-vault-documents-and-signing-SC-32`, `grade10-site-vault-documents-and-signing-SC-33`, `grade10-site-vault-documents-and-signing-SC-34`, `grade10-site-vault-documents-and-signing-SC-35`)
- [ ] 9.2 `prepareCaseDocuments`' render phase delivers the case's words, reads `itemOf`, and refuses `REGISTER_PENDING`, `REGISTER_UNREACHABLE` and `ITEM_OWNER_DIFFERS` (`grade10-site-vault-case-lifecycle-SC-47`, `grade10-site-vault-case-lifecycle-SC-48`)
- [ ] 9.3 `custodyAgreement.ts` prints the register's category, title and description with the grader, grade and certificate number where there is a grader (`grade10-site-vault-documents-and-signing-SC-32`, `grade10-site-vault-documents-and-signing-SC-33`, `grade10-site-vault-documents-and-signing-SC-34`, `grade10-site-vault-documents-and-signing-SC-35`)
- [ ] 9.4 `cases.detail`'s `item` field, the register's state and owner as a value, and Prepare documents withheld under another owner (`grade10-site-vault-case-lifecycle-SC-46`)
- [ ] 9.5 Verify: `pnpm run test:backend`, `pnpm run typecheck`

## 10. Filling the register from the vault (grade10)

- [ ] 10.1 Tests first, in their own commit: repository tests over PGlite seeding a held, a released, a forfeited, a valued and an erased case, run twice (`grade10-admin-inventory-items-SC-31`, `grade10-admin-inventory-items-SC-32`)
- [ ] 10.2 `registerBackfill` on the slow lane, its place in `WORK_LISTS` pinned by the order test, and `vault.register.backfill_remaining` (`grade10-admin-inventory-items-SC-31`, `grade10-admin-inventory-items-SC-32`)
- [ ] 10.3 Verify: `pnpm run test:backend`

## 11. Items on the console (grade10)

- [ ] 11.1 Tests first, in their own commit: feature-module and component tests against the fixture transport, and one story per view under `Inventory/Admin/Items/<View>` (`grade10-admin-inventory-items-SC-03`, `grade10-admin-inventory-items-SC-06`, `grade10-admin-inventory-items-SC-10`, `grade10-admin-inventory-items-SC-12`, `grade10-admin-inventory-items-SC-15`, `grade10-admin-inventory-items-SC-18`, `grade10-admin-inventory-items-SC-25`, `grade10-admin-inventory-items-SC-27`, `grade10-admin-inventory-items-SC-28`, `grade10-admin-inventory-items-SC-34`, `grade10-admin-inventory-items-SC-35`, `grade10-admin-inventory-items-SC-38`, `grade10-admin-inventory-items-SC-40`, `grade10-admin-inventory-items-SC-46`, `grade10-admin-inventory-items-SC-50`, `grade10-admin-inventory-items-SC-51`, `grade10-admin-inventory-items-SC-55`, `grade10-admin-inventory-items-SC-57`, `grade10-admin-inventory-items-SC-58`, `grade10-admin-inventory-items-SC-59`, `grade10-admin-inventory-items-SC-69`)
- [ ] 11.2 `ItemsPanel`: the three tabs, the search, paging and the empty states, reached from Inventory's header; `inventoryItems` and `inventoryItem` as detail surfaces in `apps/admin/grade10`, and none in the ZZZ panel (`grade10-admin-inventory-items-SC-06`, `grade10-admin-inventory-items-SC-50`, `grade10-admin-inventory-items-SC-51`, `grade10-admin-inventory-items-SC-55`, `grade10-admin-inventory-items-SC-57`, `grade10-admin-inventory-items-SC-58`)
- [ ] 11.3 `ItemPanel`: facts and last edit, the owner cell, the place row, owners disagreeing, the slab the vault named, moves and proofs, each section standing alone (`grade10-admin-inventory-items-SC-12`, `grade10-admin-inventory-items-SC-18`, `grade10-admin-inventory-items-SC-25`, `grade10-admin-inventory-items-SC-27`, `grade10-admin-inventory-items-SC-34`, `grade10-admin-inventory-items-SC-38`, `grade10-admin-inventory-items-SC-40`, `grade10-admin-inventory-items-SC-59`)
- [ ] 11.4 `ItemFactsDialog` and `OwnerField` (`grade10-admin-inventory-items-SC-03`, `grade10-admin-inventory-items-SC-10`, `grade10-admin-inventory-items-SC-15`, `grade10-admin-inventory-items-SC-69`)
- [ ] 11.5 `TransferItemDialog` with the proof field drawn as the auction's, `RetireItemDialog`, Restore and Close mark on `PromptDialog` (`grade10-admin-inventory-items-SC-28`, `grade10-admin-inventory-items-SC-35`, `grade10-admin-inventory-items-SC-46`)
- [ ] 11.6 Verify: `pnpm run test:frontend`, `pnpm run typecheck`, `pnpm run lint`, the Storybook build

## 12. The register on the vault's pages (grade10)

- [ ] 12.1 Tests first, in their own commit: component tests with stories for the Case tab's slots, the valuation's slab line, the walk-in's slab fields, Prepare documents withheld, the collector page's Items section and the erasure checklist's lines (`grade10-admin-vault-operator-queue-SC-55`, `grade10-admin-vault-operator-queue-SC-56`, `grade10-admin-vault-operator-queue-SC-57`, `grade10-admin-vault-operator-queue-SC-58`, `grade10-site-vault-valuation-and-offer-SC-33`, `grade10-site-vault-valuation-and-offer-SC-34`, `grade10-site-vault-valuation-and-offer-SC-35`, `grade10-admin-inventory-items-SC-60`, `grade10-admin-inventory-items-SC-61`, `grade10-admin-inventory-items-SC-62`)
- [ ] 12.2 `ItemFactsSection` and `SlabLine` in `packages/inventory/admin-frontend`, filled into `CaseDetailPanel`'s two slots by the app's case page (`grade10-admin-vault-operator-queue-SC-55`, `grade10-admin-vault-operator-queue-SC-56`, `grade10-admin-vault-operator-queue-SC-57`, `grade10-admin-vault-operator-queue-SC-58`, `grade10-site-vault-valuation-and-offer-SC-33`, `grade10-site-vault-valuation-and-offer-SC-34`, `grade10-site-vault-valuation-and-offer-SC-35`)
- [ ] 12.3 The walk-in form's grader and cert with the lookup's states, and the Start valuation dialog's slab, in `packages/vault/admin-frontend`
- [ ] 12.4 Prepare documents withheld under another owner on the Documents tab, linking the item
- [ ] 12.5 `CollectorItemsSection` on the collector page, and inventory's `holds` lines on the erasure checklist (`grade10-admin-inventory-items-SC-60`, `grade10-admin-inventory-items-SC-61`, `grade10-admin-inventory-items-SC-62`)
- [ ] 12.6 Verify: `pnpm run test:frontend`, `pnpm run typecheck`, `pnpm run lint`

## 13. The collector's wizard (grade10)

- [ ] 13.1 Tests first, in their own commit: the wizard's first step and the linked draft's read-only facts (`grade10-site-vault-case-intake-SC-33`)
- [ ] 13.2 The ten categories on the wizard's first step, read from `vault.category`, and the category and title read-only on a draft holding a known slab (`grade10-site-vault-case-intake-SC-33`)
- [ ] 13.3 Verify: `pnpm run test:frontend`, `pnpm run typecheck`

## 14. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review add-item-registry`) as its input; `/tcs-run-sheet` executes manual cases when needed. Runs once groups 2 to 13 have landed.

- [ ] 14.1 One walk per journey, end to end through the console or the collector's phone on the e2e stack with both workers bound: `grade10-admin-inventory-items-US-01` to `US-08`; `grade10-admin-vault-operator-queue-US-20` and `US-21`; `grade10-site-vault-valuation-and-offer-US-06`; `grade10-site-vault-documents-and-signing-US-06`; and a case from walk-in to forfeit walking `grade10-site-vault-case-lifecycle-US-03`, `grade10-site-vault-case-intake-US-01` and `shared-auth-roles-US-02`, kept as the change's end-to-end suite
- [ ] 14.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walks' own commit; the ones that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 14.3 Verify: `pnpm run test:e2e` for the walks, `pnpm --dir external/grade10-spec run trace -- validate --app-root "$PWD"`

## 15. The manual (grade10-spec)

Lands once group 14 is green.

- [ ] 15.1 Take the 🚧 off each line this change delivers on `inventory/items.md`, `inventory/index.md`, `vault/operator-console.md`, `vault/documents-and-signing.md`, `vault/case-lifecycle.md`, `vault/collector-pages.md`, `console/collector-page.md`, `shared/auth/roles.md` and `platform/account-data.md`, and the line `grading/submission.md` names for the register
- [ ] 15.2 Verify: `pnpm check:manual`
