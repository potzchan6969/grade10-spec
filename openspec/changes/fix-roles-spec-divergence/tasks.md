# Tasks: Write the shipped role and permission set into the spec

The grade10 work is verification: the code already enforces the delta, so each
group adds or names the tests that prove it, and changes no grant.

## 1. Roles manual page (grade10-spec)

- [ ] 1.1 Rewrite the opening of `docs/prds/products/shared/auth/roles.md` to name the seven roles, `finance` and `treasurer` included, and add a short section on the vocabulary's eleven resources and the vault split by cost, each new line 🚧 until implementation is verified
- [ ] 1.2 Delete the `warning` callout that says the spec does not name `finance` and `treasurer`; keep the ❓ line on staff and treasurer together
- [ ] 1.3 Take 🚧 off the lines 1.1 added once implementation is verified, before the change archives
- [ ] 1.4 Verify: `pnpm check:manual`, `pnpm run validate:changes fix-roles-spec-divergence` and `pnpm run lint` in grade10-spec.

## 2. Role and vocabulary tests (grade10)

- [ ] 2.1 Tests in `packages/grade10-auth/contracts/test/roles.test.ts`, one `it` per scenario with the id in its title, in their own commit; `shared-auth-roles-SC-18` moves out of the mapping `it` into its own titled `it` asserting the exact admin list, and `shared-auth-roles-SC-20` is its own titled `it` over `parseRoles("finance,treasurer")` (`shared-auth-roles-SC-12`, `shared-auth-roles-SC-13`, `shared-auth-roles-SC-16`, `shared-auth-roles-SC-18`, `shared-auth-roles-SC-19`, `shared-auth-roles-SC-20`)
- [ ] 2.2 Name the durable scenarios the delta carries in the titles of the `it`s that already prove them (`shared-auth-roles-SC-01`, `shared-auth-roles-SC-02`, `shared-auth-roles-SC-07`, `shared-auth-roles-SC-08`, `shared-auth-roles-SC-09`, `shared-auth-roles-SC-10`), and add the auction write case (`shared-auth-roles-SC-07a`)
- [ ] 2.3 Assert `PERMISSION_STATEMENTS` equals the delta's table exactly, keys and actions in order, with no `finance` resource and no `kyc:write` (`shared-auth-roles-SC-21`)
- [ ] 2.4 Verify: `pnpm run typecheck` and `pnpm run test` for `packages/grade10-auth/contracts` and the root `pnpm run lint` in grade10; every id in 2.1 to 2.3 found by `grep -r "shared-auth-roles-SC-" packages/grade10-auth/contracts/test`.

## 3. Identity documents and self-approval on the vault and grading routes (grade10)

- [ ] 3.1 Cite the scenarios in the identity capture and signed document cases of `apps/backend/grade10/vault/test/db/permissions.spec.ts`, and add a case where a treasurer reads the case detail and is refused the identity record, in their own commit (`shared-auth-roles-SC-11`, `shared-auth-roles-SC-13`)
- [ ] 3.2 Add a case where staff are refused the money book and a payout, beside the treasurer cases (`shared-auth-roles-SC-12`)
- [ ] 3.3 Cite the scenario in the existing self-approval cases - the offer's maker refused the payout and a recorder refused the reversal in `apps/backend/grade10/vault/test/db/money.spec.ts`, `SAME_APPROVER` in `packages/grading/backend/test/counter/approvals.repo.test.ts` and `packages/grading/backend/test/settings/approvals.repo.test.ts` - and add one where a person holding `staff` and `treasurer` makes an offer and is refused its payout (`shared-auth-roles-SC-22`)
- [ ] 3.4 Verify: `pnpm run test:backend` for the vault and grading workers in grade10.

## 4. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review fix-roles-spec-divergence`)
as its input, and groups 2 and 3 landed; `/tcs-run-sheet` executes the cases
that stay manual.

- [ ] 4.1 Add `finance` and `support` to `OperatorRole` in `apps/frontend/grade10/e2e/helpers/vault-console.ts`
- [ ] 4.2 Walk each journey end to end by calling the procedures the console's buttons call, through `mutateProcedure` and `queryProcedure` in `apps/frontend/grade10/e2e/helpers/vault.ts` with their `service` argument widened to every product the walk reaches, kept as `apps/frontend/grade10/e2e/tests/auth/roles.spec.ts`: a collector holds `user` only; support, staff, finance and auditor are allowed and refused by grant; staff run a vault case to its offer and stop at the money, and a treasurer records the payout and is refused the identity document (`shared-auth-roles-US-01`, `shared-auth-roles-US-02`, `shared-auth-roles-US-03`)
- [ ] 4.3 In grade10-spec, flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by apps/frontend/grade10/e2e/tests/auth/roles.spec.ts` once the walk lands; name the cases that stay manual in the suite and in the walk's `rounds.md` row
- [ ] 4.4 Verify: `pnpm run test:e2e` for the walk and `pnpm run build` in grade10.
