# Tasks: Cert-scoped Inventory media in Auction listings

## 1. Inventory Cert-scoped source media (grade10) (owner: @htonyl)

- [ ] 1.1 Add failing Inventory service and admin API coverage for Cert media
  tagging, Cert-only eligibility, same-product validation, authorization,
  retagging, untagging, and Cert removal (`grade10-admin-inventory-catalog-SC-128`,
  `grade10-admin-inventory-catalog-SC-129`,
  `grade10-admin-inventory-catalog-SC-130`,
  `grade10-admin-inventory-catalog-SC-131`,
  `grade10-admin-inventory-catalog-SC-132`,
  `grade10-admin-inventory-catalog-SC-133`,
  `grade10-admin-inventory-catalog-SC-134`,
  `grade10-admin-inventory-catalog-SC-135`)
- [ ] 1.2 Add the nullable Cert-record media tag, migration, same-product and
  Cert-record validation, guarded physical-unit withdrawal, cascading
  tagged-media deletion, and reference-checked product-object cleanup
  (`grade10-admin-inventory-catalog-SC-128`,
  `grade10-admin-inventory-catalog-SC-129`,
  `grade10-admin-inventory-catalog-SC-130`,
  `grade10-admin-inventory-catalog-SC-134`,
  `grade10-admin-inventory-catalog-SC-135`)
- [ ] 1.3 Add Inventory media-manager tag, untag, and retag controls using
  existing Inventory authority (`grade10-admin-inventory-catalog-SC-131`,
  `grade10-admin-inventory-catalog-SC-132`,
  `grade10-admin-inventory-catalog-SC-133`)
- [ ] 1.4 Verify: run Inventory migration, service, API, and admin-editor
  coverage plus `pnpm run typecheck` and `pnpm run lint` in `grade10`.

## 2. Auction Cert-aware source selection (grade10)

- [ ] 2.1 Add failing Auction service and editor coverage for Cert-aware
  default sources, No Cert ID, Other Cert drawer grouping, authorization, and
  cross-product refusal (`grade10-admin-auction-listing-SC-101`,
  `grade10-admin-auction-listing-SC-103`,
  `grade10-admin-auction-listing-SC-104`,
  `grade10-admin-auction-listing-SC-105`,
  `grade10-admin-auction-listing-SC-114`,
  `grade10-admin-auction-listing-SC-115`)
- [ ] 2.2 Extend the Inventory-to-Auction source-media contract and Auction
  editor so the main selector and Other Cert drawer enforce the selected
  product and Cert-record rules (`grade10-admin-auction-listing-SC-101`,
  `grade10-admin-auction-listing-SC-103`,
  `grade10-admin-auction-listing-SC-104`,
  `grade10-admin-auction-listing-SC-105`)
- [ ] 2.3 Preserve the existing direct-upload gallery, shared cap and order,
  and source snapshot behavior (`grade10-admin-auction-listing-SC-106`,
  `grade10-admin-auction-listing-SC-107`,
  `grade10-admin-auction-listing-SC-108`,
  `grade10-admin-auction-listing-SC-109`,
  `grade10-admin-auction-listing-SC-110`,
  `grade10-admin-auction-listing-SC-111`,
  `grade10-admin-auction-listing-SC-112`,
  `grade10-admin-auction-listing-SC-113`,
  `grade10-admin-auction-listing-SC-116`,
  `grade10-admin-auction-listing-SC-117`)
- [ ] 2.4 Verify: run Auction backend, editor, and listing-media regression
  coverage plus `pnpm run typecheck` and `pnpm run lint` in `grade10`.

## 3. Cross-domain operator path (grade10)

- [ ] 3.1 Add an end-to-end test that classifies source media in Inventory and
  uses it in a matching Cert listing (`grade10-admin-e2e-US1-TC1-1`,
  `grade10-admin-inventory-catalog-US-12`,
  `grade10-admin-auction-listing-US-11`,
  `grade10-admin-auction-listing-US-14`)
- [ ] 3.2 Add an end-to-end test that deliberately selects other-Cert media,
  saves its listing snapshot, then physically removes the source Cert and its
  tagged source media (`grade10-admin-e2e-US2-TC1-1`,
  `grade10-admin-inventory-catalog-US-13`,
  `grade10-admin-auction-listing-US-12`,
  `grade10-admin-auction-listing-US-14`)
- [ ] 3.3 Verify: run the Grade10 Admin cross-domain media E2E suite and the
  application build.

## 4. Planning review (grade10-spec)

Needs `feature-tcs.md` reviewed (`/tcs-review cert-scoped-inventory-auction-media`) as its input.

- [ ] 4.1 Review the Inventory and Auction feature suites and the Grade10
  Admin cross-domain smoke suite before implementation begins.
- [ ] 4.2 Verify: run `pnpm run tcs:validate`, `pnpm run validate:changes
  cert-scoped-inventory-auction-media`, and `pnpm check:manual`.
