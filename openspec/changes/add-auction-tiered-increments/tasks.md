# Tasks: tiered bid increments

## 1. Increment table contracts (grade10)

Lands first: every other group reads these.

- [ ] 1.1 Replace the listing's single increment with an increment table in the public and admin contracts, each tier a start amount and an increment in integer minor units. **BREAKING** for every consumer reading a single increment.
- [ ] 1.2 Add the minimum bid to open-listing facts as integer minor units with the listing's ISO 4217 code, making `bid-increments-SC-17` expressible over the contract.
- [ ] 1.3 Verify the contract fixtures carry a listing on the house default table and a listing on a one-tier table.

## 2. Table storage, validation, and lookup (grade10)

Needs group 1.

- [ ] 2.1 Store an increment table per listing and migrate every existing listing's single increment to a one-tier table starting at zero, per `design.md`'s migration plan, leaving behaviour unchanged.
- [ ] 2.2 Make `bid-increments-SC-01`, `SC-02`, `SC-03`, `SC-04`, and `SC-05` pass by validating a table's structure and naming the tier that fails.
- [ ] 2.3 Make `bid-increments-SC-06`, `SC-07`, `SC-08`, and `SC-09` pass with a tier lookup that takes the greatest start not above the amount, so a boundary amount takes the higher tier.
- [ ] 2.4 Verify the lookup against the full house default table at every boundary, above the last start and at zero.

## 3. Minimum bid on the bid decision (grade10)

Needs group 2.

- [ ] 3.1 Make `bid-increments-SC-10`, `SC-11`, and `SC-12` pass: with no accepted bid the minimum bid is the starting price and the table is not consulted.
- [ ] 3.2 Make `bid-increments-SC-13`, `SC-14`, `SC-15`, and `SC-16` pass by stepping from the current bid's tier and naming the minimum bid on a refusal.
- [ ] 3.3 Make `bid-increments-SC-17` pass by publishing the minimum bid as a listing fact.
- [ ] 3.4 Verify the bid decision against a listing whose minimum bid crosses a tier boundary, and against a one-tier migrated listing.

## 4. Auto-bidding resolution (grade10)

Needs group 2. This group changes shipped behaviour; read `design.md` first.

- [ ] 4.1 Size the two-maximum step from the tier containing the second-highest maximum, making `auto-bidding-SC-09`, `SC-10`, `SC-12`, `SC-13`, and `SC-15` pass unchanged.
- [ ] 4.2 Update `auto-bidding-SC-11`, `SC-14`, and `SC-16` to their new value of 55000 minor units and make them pass; these are deliberate changes to shipped results, not regressions.
- [ ] 4.3 Verify no other shipped auto-bidding scenario changes value, including the tie scenarios `SC-17` and `SC-18`.

## 5. House default table and admin editors (grade10)

Needs group 2. Claimable in parallel with groups 3 and 4.

- [ ] 5.1 Produce the admin prices-and-window and house-default Figma frames named in `ui.md` and link them there.
- [ ] 5.2 Hold a house default table per currency and seed it onto a listing at create, making `bid-increments-SC-18` and `admin-listing-SC-06` pass.
- [ ] 5.3 Make `bid-increments-SC-19`, `SC-20`, and `SC-21` pass: an authorized operator edits the house default, an invalid one is refused, an unauthorized one is refused, and existing listings are untouched.
- [ ] 5.4 Make `admin-listing-SC-29` and `admin-listing-SC-30` pass with a per-listing tier editor that is writable while `draft` or `created` and read-only afterwards.
- [ ] 5.5 Make `admin-listing-SC-01` through `SC-05` still pass with the increment table absent on a draft, per the modified draft requirement.
- [ ] 5.6 Verify the admin auction feature lane, including an invalid table naming its failing tier.

## 6. Lot page minimum next bid (grade10)

Claimable against the contracts and fixtures from group 1; it does not need a running backend.

- [ ] 6.1 Produce the bid-panel Figma frame named in `ui.md` and link it there, confirming whether the minimum next bid fits the existing `priceHint` slot or needs a new one in **grade10-spec**.
- [ ] 6.2 Show the minimum next bid on the lot page, making `bid-increments-SC-13` and `SC-14` visible, with a tier crossing rendered as normal rather than as an error.
- [ ] 6.3 Make `bid-increments-SC-15` pass on the surface: a refused bid names the minimum.
- [ ] 6.4 Add the minimum-next-bid copy to the `@grade10/i18n` catalogs for every locale the sites answer, on both brands.
- [ ] 6.5 Verify the lot-page feature lane against the contract fixtures on both brands.

## 7. Review (grade10-spec, grade10)

- [ ] 7.1 Run the application repository's full check suite once every group above is green.
- [ ] 7.2 Verify every scenario in this change, then run `openspec validate add-auction-tiered-increments --strict` and `openspec validate --specs`.
- [ ] 7.3 Review the migration on a live listing with bids already placed: its one-tier table must reproduce its previous behaviour exactly.
- [ ] 7.4 After rollout is confirmed, fold the accepted deltas into `openspec/specs/grade10-auction/`, and record for `add-grade10-auction`'s archive that its minimum-bid sentence is superseded by `grade10-auction/bid-increments`.
