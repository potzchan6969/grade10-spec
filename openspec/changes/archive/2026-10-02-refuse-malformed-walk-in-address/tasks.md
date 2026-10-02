# Tasks: Refuse a malformed walk-in address beside its field

## 1. Operator Console page (grade10-spec) (owner: @ecchochan)

- [x] 1.1 Add the 🚧 line for the address refusal to `docs/prds/products/grade10-site/vault/operator-console.md`, in the Queue section after the signed-in refusal
- [x] 1.2 Verify: `pnpm check:manual` and `pnpm run validate:changes refuse-malformed-walk-in-address` in grade10-spec.

## 2. Walk-in form (grade10) (owner: @ecchochan)

- [x] 2.1 Tests in `packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.test.tsx`, in their own commit: a malformed address refused beside the field once it is left, Open case held and nothing sent, the rest of the form kept; no refusal while an address is typed, whether the field was left empty or left holding an address; the refusal cleared as soon as the retyped address meets the rule; the ten-photograph test asserts the input is disabled at ten and keeps its batch that runs past ten (`grade10-admin-vault-operator-queue-SC-95`, `grade10-admin-vault-operator-queue-SC-75`)
- [x] 2.2 Check the address in `WalkInDialog.tsx` with the walk-in contract's own address rule, refuse it beside the field when the field is left holding a malformed address, clear the refusal once the address meets the rule, and hold Open case while the address is malformed (`grade10-admin-vault-operator-queue-SC-95`)
- [x] 2.3 Verify: `pnpm run typecheck` and `pnpm run test` for `packages/vault/admin-frontend`, and the root `pnpm run lint` in grade10.

## 3. The walk (grade10) (owner: @ecchochan)

Takes the draft `feature-tcs.md` as its input once group 2 has landed; human QA reviews the suite with `/tcs-review refuse-malformed-walk-in-address` after deployment. While the two cases are draft, the walk's titles cite scenarios and carry no bracketed case id.

- [x] 3.1 Walk `grade10-admin-vault-operator-queue-US10-TC15-1` in `apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`, titled by `grade10-admin-vault-operator-queue-SC-95`: the empty address left with no refusal, the malformed address typed with none, the field left and the refusal read beside it, Open case held and no draft opened, the refusal cleared by the corrected address and the draft opened. Re-title the ten-photograph test for the revised `grade10-admin-vault-operator-queue-US10-TC9-2`, dropping its bracketed `US10-TC9-1` and citing `grade10-admin-vault-operator-queue-SC-75`, attaching ten photographs and reading the add control back at nine (`grade10-admin-vault-operator-queue-US-10`)
- [x] 3.2 In grade10-spec, flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts` once the walk lands; name the cases that stay manual in the walk's `rounds.md` row
- [x] 3.3 Verify: the walk-in walk green in CI.

## 4. The manual (grade10-spec) (owner: @ecchochan)

- [x] 4.1 Take 🚧 off the address line in `docs/prds/products/grade10-site/vault/operator-console.md` once implementation is verified, before the change archives
- [x] 4.2 Verify: `pnpm check:manual` in grade10-spec.
