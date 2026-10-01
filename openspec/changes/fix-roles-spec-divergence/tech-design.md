## Context

The code already enforces the shape the [roles delta](specs/shared/auth/roles/spec.md)
writes down. Each rule lives in one place in grade10:

| Rule | Where |
| --- | --- |
| Closed role set and the vocabulary | `packages/grade10-auth/contracts/src/schemas.ts` `ROLE_PERMISSIONS`, `PERMISSION_STATEMENTS`, `ALL_PERMISSIONS` |
| Unknown role names dropped | `packages/grade10-auth/contracts/src/rbac.ts` `parseRoles`, called at the session read in `packages/grade10-auth/backend/src/readSession.ts`, among other call sites |
| Grant check, union across roles | `rbac.ts` `hasPermission` |
| Grants frozen at load | `schemas.ts`, `Object.freeze` over `ROLE_PERMISSIONS` |
| Vault split: `operate`, `approve`, `payout` | `packages/vault/contracts/src/permissions.ts` `ADMIN_PERMISSIONS`, `ROUTE_PERMISSIONS`; `packages/vault/backend/src/trpc/routers/admin/money.ts` |
| Identity documents behind `kyc:read` | `packages/vault/backend/src/routes/documents.ts` (`kycCapture`, `caseDocument`); `packages/vault/backend/src/trpc/routers/admin/identity.ts` `caseIdentity` |
| Auction payment, refund, shipment | `packages/grade10-auction/contracts/src/orderRules.ts`; `packages/grade10-auction/backend/src/trpc/routers/paymentSettings.ts` |
| Operator-facing prose and the generated matrix | `packages/grade10-auth/contracts/src/descriptions.ts`; `packages/grade10-auth/contracts/generated/roles-and-permissions.json` |

Tests today:

- `packages/grade10-auth/contracts/test/roles.test.ts` - one `it` per durable
  scenario, named by title, and an exact, ordered assertion of every role's
  grants inside a single mapping `it`, which holds the admin list
  (`shared-auth-roles-SC-18`) too. It cites no scenario id.
- `packages/grade10-auth/contracts/test/rbac.test.ts` - helper behaviour, the
  vault split, the finance and treasurer auction grants.
- `apps/backend/grade10/vault/test/db/permissions.spec.ts` - real routes: a
  treasurer refused the identity capture and the signed document, staff
  served them.

Approvals already refuse their own recorder (Q9, `shared-auth-roles-SC-22`):

| Act | Where |
| --- | --- |
| Vault payout refused to the offer's maker | `packages/vault/backend/src/money/payout.ts` `recordPayout`, `offer.madeBy === args.staffId` |
| Vault money reversal refused to its recorder | `packages/vault/backend/src/money/reverse.ts`, `reversed.recordedBy === args.staffId` |
| Grading waiver, payout and reversal approvals; setting and fee-sheet approvals | `packages/grading/backend/src/counter/approvers.ts` `requireSecondApprover` (`SAME_APPROVER`), called from `counter/approvals.ts` and `settings/approvals.ts`; the `fourEyes` check constraint in `db/schema/fourEyes.ts` on every table with a recorder and an approver |

Tests that exercise them: `apps/backend/grade10/vault/test/db/money.spec.ts`,
`packages/grading/backend/test/counter/approvals.repo.test.ts` and
`packages/grading/backend/test/settings/approvals.repo.test.ts`.

## Goals / Non-Goals

**Goals:**

- **Every scenario has a test that cites it** - the delta's new ids and the
  durable ids the delta carries.
- **The spec cannot drift silently again** - a grant added in code fails a
  test that names the scenario stating the set.

**Non-Goals:**

- **No grant, role or route changes** - `schemas.ts` is the reference.
- **No merge of `rbac.test.ts` into `roles.test.ts`** - they overlap, and
  folding them is a refactor this change does not need.

## Decisions

The roles delta governs the mapping, the vocabulary and the split. This change
lands as tests only.

- **Ids in `roles.test.ts`** - the scenario-shaped suite takes each id in its
  `it` title, `shared-auth-roles-SC-16 - Finance collects auction payment and
  nothing else`, so `pnpm plan done` finds it. Existing `it`s gain their
  durable id the same way.
  - Rejected: ids in `rbac.test.ts`. `rbac.test.ts` tests the helpers, not
    the scenarios.
- **Exact equality for the sets** - `shared-auth-roles-SC-21` asserts
  `PERMISSION_STATEMENTS` equals the delta's table, keys and actions in
  order; `shared-auth-roles-SC-18` asserts `admin` by explicit list, today
  inside the single mapping `it`, and task 2.1 gives it its own titled `it`.
  Exact order is the control: a reorder or an addition fails and names the
  scenario to update.
  - Rejected: a subset check. It passes when the code grows past the spec,
    which is the drift this change repairs.
- **Grant-level proof for the role scenarios** - `shared-auth-roles-SC-12`,
  `shared-auth-roles-SC-13`, `shared-auth-roles-SC-16`,
  `shared-auth-roles-SC-19` and
  `shared-auth-roles-SC-20` are decided by `parseRoles` and `hasPermission`
  against the named grant of each action: starting a valuation
  `vault:operate`, offer `vault:approve`, payout and repayment and money book
  `vault:payout`, auction payment `auction:payment`, identity `kyc:read`,
  grading approval `grading:approve`, booking `appointment:manage`, stock
  `inventory:write`. The action-to-grant maps (`ADMIN_PERMISSIONS` in vault
  and grading, `orderRules.ts`) are pinned to their routers by those
  products' own specs.
- **Route-level proof for identity documents** - `shared-auth-roles-SC-11`
  is cited in `permissions.spec.ts`, whose treasurer cases already exercise
  the routes. `shared-auth-roles-SC-13` is proved in two halves: its grants
  in `roles.test.ts`, its routes in `permissions.spec.ts`.
- **The walk calls the console's procedures** - the walk calls the
  procedures the console's buttons call (the `adminAct` convention) through
  `mutateProcedure` and `queryProcedure` in
  `apps/frontend/grade10/e2e/helpers/vault.ts`, which take the product as
  their `service` argument; task 4.2 widens it from `vault` and
  `appointment` to every product the walk reaches. It signs in operators
  through `apps/frontend/grade10/e2e/helpers/vault-console.ts`, whose
  `OperatorRole` gains `finance` and `support`.

## Risks / Trade-offs

- [A product adds a grant without a spec change] → the exact-equality tests
  for `shared-auth-roles-SC-18` and `shared-auth-roles-SC-21` and the mapping
  test fail, and `roles-and-permissions.json` drift fails beside them.
- [A grant changes in code between claim and archive] → archive preflight
  compares the claimed baseline with the durable contract and asks for an
  acknowledgement.
- [A person is provisioned with `staff` and `treasurer`] → allowed (Q9); the
  approval checks below keep each two-person step at two people.
