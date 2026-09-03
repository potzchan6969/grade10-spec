# Tasks: Rename auction:catalog to auction:write

Groups 1 and 2 are independent once the durable grant name is decided in the
delta. Group 3 updates the operator PRD after the vocabulary is settled.

## 1. Vocabulary and grants (grade10)

- [x] 1.1 Make `Each role grants a fixed set of permissions` and
      `shared-auth-roles-SC-07a - Staff can write the auction catalogue` pass: replace
      `auction:catalog` with `auction:write` in
      `PERMISSION_STATEMENTS.auction` and in staff / admin grant lists.
- [x] 1.2 Point every elevated catalogue procedure at `auction:write`
      (campaigns open/create/update/publish, category taxonomy writes,
      listing media and catalogue-field procedures) and rename the admin
      `mayCatalog` gate to `mayWrite`.
- [x] 1.3 Verify: `pnpm run typecheck` on `@grade10/auth-contracts` and the
      auction admin / worker packages; `pnpm run lint`; auth-contracts and
      auction grant / section tests.

## 2. Operator PRD (grade10-spec)

- [x] 2.1 Update the listing-management PRD grants callout so operators are
      told `auction:write` and `auction:operate`.
- [x] 2.2 Verify: `pnpm check:manual` when the page is under `manual/`, else
      confirm the PRD path under `docs/prds/products/grade10-admin/auction/`.
