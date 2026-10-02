# Tasks: Refuse a walk-in loan of zero beside its field

## 1. The manual (grade10-spec) (owner: @ecchochan)

- [x] 1.1 State on `docs/prds/products/grade10-site/vault/collector-pages.md`'s Request Wizard that a loan asks for more than zero, and add the 🚧 line for the loan refusal to `docs/prds/products/grade10-site/vault/operator-console.md`, in the Queue section after the address refusal
- [x] 1.2 Verify: `pnpm check:manual` and `pnpm run validate:changes refuse-zero-walk-in-loan` in grade10-spec.

## 2. Walk-in form (grade10) (owner: @ecchochan)

- [ ] 2.1 Tests, in their own commit: in `packages/vault/admin-frontend/src/features/custody/cases/presentation/views/WalkInDialog.test.tsx`, a loan of zero refused beside the loan field once it is left, Open case held and nothing sent, the rest of the form kept; no refusal while the amount is typed or when the empty field is left; the refusal cleared as soon as the amount is more than zero or emptied, and kept while the text is one `MoneyField` refuses; Storage only lifting it and a loan bringing back the amount with no refusal until the field is left; the field's own words for `-1` and `0.004` instead of it. In `packages/frontend-console/src/MoneyField.test.tsx`, leaving the field calls `onBlur` (`grade10-admin-vault-operator-queue-SC-96`)
- [ ] 2.2 A test in `packages/vault/backend/test/trpc/collectorRouter.test.ts`, in its own commit: `create` refuses a financing amount of `0` and `-1` by name and opens no case, and opens one minor unit on the financed lane (`grade10-site-vault-case-intake-SC-42`)
- [ ] 2.3 Pass an optional `onBlur` through `MoneyField` and `UnitField` to the field's `TextField` in `packages/frontend-console` (`grade10-admin-vault-operator-queue-SC-96`)
- [ ] 2.4 Check the amount in `WalkInDialog.tsx` with the walk-in contract's own amount rule, refuse it beside the loan field when the field is left holding an amount that fails it, clear the refusal once the amount meets the rule or is emptied and whenever a lane is chosen, hold Open case while it fails, and drop the flag that only mirrored `MoneyField`'s own text refusal (`grade10-admin-vault-operator-queue-SC-96`)
- [ ] 2.5 Verify: the touched test files and `pnpm run typecheck` for `packages/vault/admin-frontend`, `packages/frontend-console` and `packages/vault/backend`; full suites and lint in CI.

## 3. The walk (grade10) (owner: @ecchochan)

Takes the draft `feature-tcs.md` as its input once group 2 has landed; human QA reviews the suites with `/tcs-review refuse-zero-walk-in-loan` after deployment. While the cases are draft, the walk's titles cite scenarios and carry no bracketed case id.

- [ ] 3.1 Walk the walk-in cases in `apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`, titled by `grade10-admin-vault-operator-queue-SC-96`: a loan of zero refused on leaving the field with nothing sent and cleared by an amount more than zero, the draft opened financed; Storage only lifting the refusal and a loan bringing the amount back, refused again once the field is left; `-1` and `0.004` refused in the field's own words. Walk the wizard's loan of zero in `apps/frontend/grade10/e2e/tests/vault/request.spec.ts`, titled by `grade10-site-vault-case-intake-SC-42`: the field takes no zero, Continue refused, storage only moving on (`grade10-admin-vault-operator-queue-US-10`, `grade10-site-vault-case-intake-US-01`)
- [ ] 3.2 In grade10-spec, flip the cases each test decides with `pnpm run tcs:automated <case…> --decided-by <path>` once they land: the walk-in cases by `walk-in.spec.ts`, the wizard's by `request.spec.ts`, the intake's refusal by `collectorRouter.test.ts`; name the cases that stay manual in the walk's `rounds.md` row
- [ ] 3.3 Verify: the walk-in and request walks green in CI.

## 4. The manual (grade10-spec) (owner: @ecchochan)

- [ ] 4.1 Take 🚧 off the loan line in `docs/prds/products/grade10-site/vault/operator-console.md` once implementation is verified, before the change archives
- [ ] 4.2 Verify: `pnpm check:manual` in grade10-spec.
