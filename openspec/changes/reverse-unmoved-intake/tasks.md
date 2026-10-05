# Tasks: Reverse unmoved intake

## 1. Manual page (grade10-spec)

- [ ] 1.1 Add to the Intake code map of `docs/prds/products/grade10-admin/inventory/catalog.md`: `reverseRegularIntake` and `reverseCertIntake` in `services/inventoryMutations.ts`, and the moved tests `selectMovedInventoryCertIds` and `regularStockMoved` in `repositories/`. The 🚧 on Units entered by mistake stays until the walk is verified; taking it off is the archive's step.
- [ ] 1.2 Mark the Cert-scoped media line's removal sentence in the same page 🚧: Remove physical unit removes a Cert record that has moved, and a record that has only been intaken is reversed instead.
- [ ] 1.3 Verify: `pnpm check:manual`, `pnpm run validate:changes reverse-unmoved-intake` and `pnpm run lint` in grade10-spec.

## 2. History action and contracts (grade10)

- [ ] 2.1 Tests for the widened action check and the partial index against the committed migration, and for the contract's new action, the two failure codes, the two input schemas and `regularStock.unmoved` decoding, in their own commit before the code
- [ ] 2.2 Add the migration that drops `ck_changelogs_action` and adds it again `NOT VALID` with `intake-reversal`, then `idx_changelogs_change_product_old_inventory` on `((before -> 'oldInventory' ->> 'id'))` `WHERE action = 'change-product'` with its `-- lock:` line, and its `meta/` snapshot carried forward
- [ ] 2.3 Add `intake-reversal` to `CHANGELOG_ACTIONS`, `UNIT_MOVED` and `INVALID_REASON` to the failure codes and the error map, `adminInventoryReverseRegularIntakeInputSchema` (`productId`, `quantity`, `remarks`) and `adminInventoryReverseCertIntakeInputSchema` (`productId`, `inventoryCertId`, `remarks`) with `remarks` as the required `reason` schema, and `unmoved` to `adminRegularStockSchema`; regenerate `packages/api-docs`
- [ ] 2.4 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 3. One unmoved test (grade10)

Needs group 2's migration and contracts landed.

- [ ] 3.1 Repository, service and router tests for a record and for regular stock read as moved by a reservation of any status, by a hold moved to another product, and, for regular stock only, by a free-pool sale or withdrawal; for intake, Cert ID changes and reversals leaving both unmoved; for a Cert record's moves leaving regular stock unmoved; for the `unmoved` flags on `products.get`; and for `removeCertUnit` refusing an unmoved record, in their own commit before the code (`grade10-admin-inventory-catalog-SC-135`, `grade10-admin-inventory-catalog-SC-175`, `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-180`, `grade10-admin-inventory-catalog-SC-186`)
- [ ] 3.2 Add `selectMovedInventoryCertIds` (any reservation naming the record, or a `change-product` entry whose `before.oldInventory.id` is the inventory and whose `before.reservation.inventoryCertId` is the record) and `regularStockMoved` (a reservation of the product naming no record, a `sell` or `withdraw` of the inventory naming no record, or a `change-product` entry moving such a hold off the inventory); replace `selectEverHeldInventoryCertIds` in `correctCertId` and `products.get` (`grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-180`, `grade10-admin-inventory-catalog-SC-186`)
- [ ] 3.3 Answer `regularStock.unmoved` on `products.get` from `regularStockMoved` (`grade10-admin-inventory-catalog-SC-179`)
- [ ] 3.4 Refuse an unmoved record in `removeCertUnit` with `inventory-cert-id-unavailable`, after both locks (`grade10-admin-inventory-catalog-SC-135`, `grade10-admin-inventory-catalog-SC-175`)
- [ ] 3.5 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 4. Reduce unmoved regular stock (grade10)

Needs group 3's moved tests landed.

- [ ] 4.1 Tests for the reduction: the counts and ledger, withdrawn and every Cert record unchanged, the history entry and its remarks, an assignment leaving regular stock reducible, each refusal including moved stock and a quantity of 0, 1.5 or above available, the grant, the regular stock history holding the entry, a hold racing the reduction and two reductions racing, in their own commit before the code (`grade10-admin-inventory-catalog-SC-172`, `grade10-admin-inventory-catalog-SC-176`, `grade10-admin-inventory-catalog-SC-177`, `grade10-admin-inventory-catalog-SC-178`, `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-180`, `grade10-admin-inventory-catalog-SC-181`, `grade10-admin-inventory-catalog-SC-188`, `grade10-admin-inventory-catalog-SC-190`, `grade10-admin-inventory-catalog-SC-192`, `grade10-admin-inventory-catalog-SC-193`)
- [ ] 4.2 Add `reverseRegularIntake`: refuse blank remarks and a quantity that is not a whole number from 1, lock the inventory, refuse `unit-moved` when `regularStockMoved` and `insufficient-available` above available regular stock, write `stock − n` and `unidentified_stock − n`, and append `intake-reversal` naming no record (`grade10-admin-inventory-catalog-SC-172`, `grade10-admin-inventory-catalog-SC-176`, `grade10-admin-inventory-catalog-SC-177`, `grade10-admin-inventory-catalog-SC-178`, `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-180`, `grade10-admin-inventory-catalog-SC-181`, `grade10-admin-inventory-catalog-SC-188`, `grade10-admin-inventory-catalog-SC-192`, `grade10-admin-inventory-catalog-SC-193`)
- [ ] 4.3 Add `inventory.reverseRegularIntake` as an `inventory:write` elevated procedure audited against the product (`grade10-admin-inventory-catalog-SC-190`)
- [ ] 4.4 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 5. Remove an unmoved Cert record (grade10)

Needs group 3's moved tests landed.

- [ ] 5.1 Tests for the removal: the counts and ledger, withdrawn and regular stock unchanged, the record and its tagged media deleted with untagged and other records' media kept, the history entry with the record before it and out of the regular stock history, the Cert ID taken again by intake, an assigned record removed, each refusal including a released, sold and moved-product record and blank remarks, the grant, and a reserve racing the removal, in their own commit before the code (`grade10-admin-inventory-catalog-SC-173`, `grade10-admin-inventory-catalog-SC-176`, `grade10-admin-inventory-catalog-SC-182`, `grade10-admin-inventory-catalog-SC-183`, `grade10-admin-inventory-catalog-SC-184`, `grade10-admin-inventory-catalog-SC-185`, `grade10-admin-inventory-catalog-SC-186`, `grade10-admin-inventory-catalog-SC-189`, `grade10-admin-inventory-catalog-SC-190`, `grade10-admin-inventory-catalog-SC-191`)
- [ ] 5.2 Add `reverseCertIntake`: refuse blank remarks, lock the inventory then the Cert row, refuse a record that is missing, on another product, not `available` or moved, write `stock − 1`, append `intake-reversal` with `certRecord` and `inventoryCertIds` before it, then delete the row and its tagged media through the cascade (`grade10-admin-inventory-catalog-SC-173`, `grade10-admin-inventory-catalog-SC-176`, `grade10-admin-inventory-catalog-SC-182`, `grade10-admin-inventory-catalog-SC-183`, `grade10-admin-inventory-catalog-SC-184`, `grade10-admin-inventory-catalog-SC-185`, `grade10-admin-inventory-catalog-SC-186`, `grade10-admin-inventory-catalog-SC-189`, `grade10-admin-inventory-catalog-SC-191`)
- [ ] 5.3 Add `inventory.reverseCertIntake` as an `inventory:write` elevated procedure audited as `inventory-cert-unit` (`grade10-admin-inventory-catalog-SC-190`)
- [ ] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 6. Cert ID details and the product history (grade10)

Built against the contract's fixtures, not a running backend.

- [ ] 6.1 Tests for Reverse intake offered and withheld on each row, the moved line on the `No Cert ID` row, Remove physical unit only on a moved record, the two confirmations with their names, counts, media line, prefilled remarks, disabled Confirm and cancel, the refusals shown inline, the read-only view, and the product history's and the `No Cert ID` history's Intake reversal Action, in their own commit before the code (`grade10-admin-inventory-catalog-SC-174`, `grade10-admin-inventory-catalog-SC-175`, `grade10-admin-inventory-catalog-SC-176`, `grade10-admin-inventory-catalog-SC-177`, `grade10-admin-inventory-catalog-SC-178`, `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-182`, `grade10-admin-inventory-catalog-SC-185`, `grade10-admin-inventory-catalog-SC-186`, `grade10-admin-inventory-catalog-SC-187`, `grade10-admin-inventory-catalog-SC-188`, `grade10-admin-inventory-catalog-SC-189`, `grade10-admin-inventory-catalog-SC-190`)
- [ ] 6.2 Offer Reverse intake to a writer on a Cert record with `unmoved` and on the available `No Cert ID` row while `regularStock.unmoved` holds and it reads at least 1; show on that row, when moved, that its units have been held or have moved; offer Remove physical unit only on an Available record that is not `unmoved` and no active hold names (`grade10-admin-inventory-catalog-SC-175`, `grade10-admin-inventory-catalog-SC-177`, `grade10-admin-inventory-catalog-SC-178`, `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-185`, `grade10-admin-inventory-catalog-SC-186`, `grade10-admin-inventory-catalog-SC-190`)
- [ ] 6.3 Add the Reverse intake confirmation, a destructive `FormDialog` naming the Cert ID or holding the number of units, saying what falls and, for a record, that its tagged media are deleted, with remarks prefilled `Entered by mistake`; disable Confirm on blank remarks or a number outside 1 to the row's count; send the procedure, show a refusal inline and invalidate the product, its changelogs and its media on success; move Remove physical unit's reason into its own confirmation (`grade10-admin-inventory-catalog-SC-182`, `grade10-admin-inventory-catalog-SC-187`, `grade10-admin-inventory-catalog-SC-188`, `grade10-admin-inventory-catalog-SC-189`)
- [ ] 6.4 Render `intake-reversal` in `changelogActionLabel` as `Intake reversal`, and `Intake reversal · <Cert ID>` when the entry's before carries a Cert record (`grade10-admin-inventory-catalog-SC-174`, `grade10-admin-inventory-catalog-SC-176`)
- [ ] 6.5 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test` in grade10.

## 7. The walk (grade10)

Uses draft `feature-tcs.md` as its input, with groups 2 to 6 landed; human QA reviews the cases after deployment (`/tcs-review reverse-unmoved-intake`), and `/tcs-run-sheet` executes the manual ones when needed.

- [ ] 7.1 Walk each journey end to end through the admin, kept as the change's end-to-end suite: reducing regular stock and removing a Cert record intaken by mistake through their confirmations, Remove physical unit on a record that has moved, Cert ID details accounting for every unit after each, and the history of each (`grade10-admin-inventory-catalog-US-16`, `grade10-admin-inventory-catalog-US-13`, `grade10-admin-inventory-catalog-US-14`, `grade10-admin-inventory-catalog-US-04`)
- [ ] 7.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by grade10:<walk path>` in the walks' own commit; name the cases that stay manual in the suite and in the walk's `rounds.md` row
- [ ] 7.3 Verify: `pnpm run test:e2e` for the walks and `pnpm run build` in grade10.
