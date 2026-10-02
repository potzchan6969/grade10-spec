# Tasks: Edit unit Cert IDs

## 1. Manual page (grade10-spec)

- [ ] 1.1 Add an engineer code map to the Intake section of `docs/prds/products/grade10-admin/inventory/catalog.md`: `services/inventoryMutations.ts` (`correctCertId`, `assignCertId`), `services/unitFacts.ts`, `repositories/changelogs.ts`, `CertIdDetailDialog.tsx`, `ChangeHistoryDialog.tsx`.
- [ ] 1.2 Verify: `pnpm check:manual`, `pnpm run validate:changes edit-unit-cert-ids` and `pnpm run lint` in grade10-spec.

## 2. History action and contracts (grade10) (owner: @mason5991)

- [ ] 2.1 Tests for the widened action check against the committed migration, and for the contract's new action, `certRecord` snapshot, failure codes, `unit` input and `regularStock` answer decoding, in their own commit before the code
- [ ] 2.2 Add the migration that drops `ck_changelogs_action` and adds it again `NOT VALID` with `cert-id-change`, with its `meta/` snapshot carried forward
- [ ] 2.3 Add `cert-id-change` to `CHANGELOG_ACTIONS`, optional `certRecord` to `changelogSnapshotSchema`, `cert-id-taken` and `invalid-grade-issuer` to the failure codes, optional `unit` to the `changelogs.list` input and `regularStock: { available }` to the `products.get` answer
- [ ] 2.4 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 3. Correct a Cert ID (grade10)

Needs group 2's migration and contracts landed.

- [ ] 3.1 Tests for the correction: the kept record, status, copy facts in the entry's snapshot, tagged media and counts, the unmoved test against a held, sold and released record, exact case-sensitive matching, the `No Cert ID` refusal, the taken refusal naming the holding unit and status, the grant, and a reserve racing the correction, in their own commit before the code (`grade10-admin-inventory-catalog-SC-144`, `grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-155`, `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-157`, `grade10-admin-inventory-catalog-SC-164`, `grade10-admin-inventory-catalog-SC-165`, `grade10-admin-inventory-catalog-SC-167`, `grade10-admin-inventory-catalog-SC-168`, `grade10-admin-inventory-catalog-SC-169`)
- [ ] 3.2 Add `correctCertId`: lock the inventory then the Cert row, refuse a record that is missing, on another product, not `available` or named by any reservation ever, a blank or `No Cert ID` Cert ID, and a Cert ID any record of the inventory holds exactly, answering `cert-id-taken` with that record's id, Cert ID and status; update `cert_id` alone and append `cert-id-change` with `certRecord` on both sides; map a unique-index violation to `cert-id-taken` (`grade10-admin-inventory-catalog-SC-144`, `grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-155`, `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-157`, `grade10-admin-inventory-catalog-SC-165`, `grade10-admin-inventory-catalog-SC-167`, `grade10-admin-inventory-catalog-SC-168`, `grade10-admin-inventory-catalog-SC-169`)
- [ ] 3.3 Add `inventory.correctCertId` as an `inventory:write` elevated procedure audited as `inventory-cert-unit` (`grade10-admin-inventory-catalog-SC-164`)
- [ ] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 4. Assign a Cert ID to regular stock (grade10)

Needs group 2's migration and contracts landed.

- [ ] 4.1 Tests for the assignment: the new record and its facts in the entry's snapshot, the regular stock and unchanged totals, the history entry, each refusal including `No Cert ID` and the taken refusal naming the holding unit and status, the grant, a hold on the new record, and two assignments racing for the last unit, in their own commit before the code (`grade10-admin-inventory-catalog-SC-145`, `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-160`, `grade10-admin-inventory-catalog-SC-161`, `grade10-admin-inventory-catalog-SC-162`, `grade10-admin-inventory-catalog-SC-163`, `grade10-admin-inventory-catalog-SC-164`, `grade10-admin-inventory-catalog-SC-166`, `grade10-admin-inventory-catalog-SC-168`)
- [ ] 4.2 Move intake's copy-fact trimming, `-`-as-absent and issuer canonicalisation into `normalizeUnitFacts` in `services/unitFacts.ts`, with `intakeStock` calling it and its tests unchanged
- [ ] 4.3 Add `assignCertId`: normalise the facts, refuse a blank or `No Cert ID` Cert ID and a blank or `RAW` Grade Issuer, lock the inventory, refuse when available regular stock is below 1 or the Cert ID is held exactly by any record, naming it, insert the Available Cert row, decrement `unidentified_stock` and append `cert-id-change` with no `before.certRecord` (`grade10-admin-inventory-catalog-SC-145`, `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-160`, `grade10-admin-inventory-catalog-SC-161`, `grade10-admin-inventory-catalog-SC-162`, `grade10-admin-inventory-catalog-SC-163`, `grade10-admin-inventory-catalog-SC-166`, `grade10-admin-inventory-catalog-SC-168`)
- [ ] 4.4 Add `inventory.assignCertId` as an `inventory:write` elevated procedure audited against the product (`grade10-admin-inventory-catalog-SC-164`)
- [ ] 4.5 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 5. Unit history and available regular stock (grade10)

Needs group 2's contracts landed.

- [ ] 5.1 Repository and router tests for the `unit` filter on each membership row, its paging past 150 entries, `regularStock.available` with and without holds on regular stock, `regularStock.hasHistory`, and each record's `unmoved` flag, in their own commit before the code (`grade10-admin-inventory-catalog-SC-147`, `grade10-admin-inventory-catalog-SC-148`, `grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-151`, `grade10-admin-inventory-catalog-SC-152`, `grade10-admin-inventory-catalog-SC-153`, `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-167`, `grade10-admin-inventory-catalog-SC-170`)
- [ ] 5.2 Add the `unit` predicate to `listChangelogsByInventoryId` for a Cert record and for regular stock, inside the existing keyset query, and accept it on `changelogs.list` (`grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-151`, `grade10-admin-inventory-catalog-SC-152`, `grade10-admin-inventory-catalog-SC-153`)
- [ ] 5.3 Answer `regularStock.available` on `products.get` as `unidentified_stock` minus the active remaining of holds naming no Cert record, `regularStock.hasHistory` as one `EXISTS` over the regular-stock predicate, and `unmoved` on each Cert record as the correction's own test (`grade10-admin-inventory-catalog-SC-147`, `grade10-admin-inventory-catalog-SC-148`, `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-167`, `grade10-admin-inventory-catalog-SC-170`)
- [ ] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 6. Cert ID details and the product history (grade10)

Built against the contract's fixtures, not a running backend.

- [ ] 6.1 Tests for the rows, the empty line, each unit's history, the Change Cert ID and Assign Cert ID forms with their refusals and reasons, the read-only view, and the product history's Cert ID change Action, in their own commit before the code (`grade10-admin-inventory-catalog-SC-146`, `grade10-admin-inventory-catalog-SC-147`, `grade10-admin-inventory-catalog-SC-148`, `grade10-admin-inventory-catalog-SC-149`, `grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-151`, `grade10-admin-inventory-catalog-SC-152`, `grade10-admin-inventory-catalog-SC-153`, `grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-155`, `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-157`, `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-160`, `grade10-admin-inventory-catalog-SC-161`, `grade10-admin-inventory-catalog-SC-162`, `grade10-admin-inventory-catalog-SC-164`, `grade10-admin-inventory-catalog-SC-165`, `grade10-admin-inventory-catalog-SC-167`, `grade10-admin-inventory-catalog-SC-168`, `grade10-admin-inventory-catalog-SC-170`)
- [ ] 6.2 List the Cert records, the available `No Cert ID` row whenever `regularStock.hasHistory` holds, reading 0 when none is free, and one `No Cert ID` row per active hold naming no record, with Cert ID, Status, Holder and Quantity and no copy facts; show one line saying no unit is on hand when there is no row (`grade10-admin-inventory-catalog-SC-147`, `grade10-admin-inventory-catalog-SC-148`, `grade10-admin-inventory-catalog-SC-149`, `grade10-admin-inventory-catalog-SC-170`)
- [ ] 6.3 Show the selected unit's history from `changelogs.list` with its `unit`, paged by its cursor, in the product history's columns; delete `certHistory` and its made-up intake row (`grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-151`, `grade10-admin-inventory-catalog-SC-152`, `grade10-admin-inventory-catalog-SC-153`)
- [ ] 6.4 Offer Change Cert ID on a record with `unmoved` and Assign Cert ID on the available `No Cert ID` row reading at least 1 to a writer, each a `FormDialog` showing its refusal inline, naming the holding unit and its status on `cert-id-taken`, and invalidating the product, its changelogs and its media on success; show the reason on every other row, and no action to a reader (`grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-155`, `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-157`, `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-160`, `grade10-admin-inventory-catalog-SC-161`, `grade10-admin-inventory-catalog-SC-162`, `grade10-admin-inventory-catalog-SC-164`, `grade10-admin-inventory-catalog-SC-165`, `grade10-admin-inventory-catalog-SC-167`, `grade10-admin-inventory-catalog-SC-168`)
- [ ] 6.5 Render a `cert-id-change` Action in `ChangeHistoryDialog.tsx` as `Cert ID change · <before> → <after>`, with `No Cert ID` for an assignment (`grade10-admin-inventory-catalog-SC-146`)
- [ ] 6.6 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test` in grade10.

## 7. The walk (grade10)

Uses draft `feature-tcs.md` as its input, with groups 2 to 6 landed; human QA reviews the cases after deployment (`/tcs-review edit-unit-cert-ids`), and `/tcs-run-sheet` executes the manual ones when needed.

- [ ] 7.1 Walk each journey end to end through the admin, kept as the change's end-to-end suite: Cert ID details accounting for every unit, a correction and an assignment, and their history (`grade10-admin-inventory-catalog-US-14`, `grade10-admin-inventory-catalog-US-15`, `grade10-admin-inventory-catalog-US-04`)
- [ ] 7.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by grade10:<walk path>` in the walks' own commit; name the cases that stay manual in the suite and in the walk's `rounds.md` row
- [ ] 7.3 Verify: `pnpm run test:e2e` for the walks and `pnpm run build` in grade10.
