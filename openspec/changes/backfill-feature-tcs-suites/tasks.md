# Tasks: backfill the feature suites the new pairing rule names

Each task is one `/spec-to-tcs feature <capability>` run and its own commit,
`test(<domain>): derive test cases for <capability>`. Derive only - a suite
that disagrees with its spec is regenerated, never argued with, and a spec
that turns out to be wrong is its own change. Human review remains downstream
of delivery.

## 1. Vault (grade10-spec)

- [x] 1.1 Derive `openspec/specs/grade10-site/vault/case-intake/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-case-intake`, every case `draft`.
- [x] 1.2 Derive `openspec/specs/grade10-site/vault/case-lifecycle/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-case-lifecycle`, every case `draft`.
- [x] 1.3 Derive `openspec/specs/grade10-site/vault/valuation-and-offer/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-valuation-and-offer`, every case `draft`.
- [x] 1.4 Derive `openspec/specs/grade10-site/vault/identity-verification/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-identity-verification`, every case `draft`.
- [x] 1.5 Derive `openspec/specs/grade10-site/vault/documents-and-signing/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-documents-and-signing`, every case `draft`.
- [x] 1.6 Derive `openspec/specs/grade10-site/vault/loan-and-settlement/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-loan-and-settlement`, every case `draft`.
- [x] 1.7 Derive `openspec/specs/grade10-site/vault/visit-booking/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-visit-booking`, every case `draft`.
- [x] 1.8 Derive `openspec/specs/grade10-site/vault/collector-notifications/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-collector-notifications`, every case `draft`.
- [x] 1.9 Derive `openspec/specs/grade10-site/vault/retention-and-erasure/feature-tcs.md` with `/spec-to-tcs feature grade10-site-vault-retention-and-erasure`, every case `draft`.

## 2. Auction and store (grade10-spec)

- [x] 2.1 Derive `openspec/specs/grade10-site/auction/account-record/feature-tcs.md` with `/spec-to-tcs feature grade10-site-auction-account-record`, every case `draft`.
- [x] 2.2 Derive `openspec/specs/grade10-site/auction/bid-payment-method/feature-tcs.md` with `/spec-to-tcs feature grade10-site-auction-bid-payment-method`, every case `draft`.
- [x] 2.3 Derive `openspec/specs/grade10-site/store/membership/feature-tcs.md` with `/spec-to-tcs feature grade10-site-store-membership`, every case `draft`.
- [x] 2.4 Derive `openspec/specs/grade10-site/store/wallet-member-card/feature-tcs.md` with `/spec-to-tcs feature grade10-site-store-wallet-member-card`, every case `draft`.

## 3. Admin (grade10-spec)

- [x] 3.1 Derive `openspec/specs/grade10-admin/console/roles-and-permissions/feature-tcs.md` with `/spec-to-tcs feature grade10-admin-console-roles-and-permissions`, every case `draft`.
- [x] 3.2 Derive `openspec/specs/grade10-admin/inventory/catalog/feature-tcs.md` with `/spec-to-tcs feature grade10-admin-inventory-catalog`, every case `draft`.
- [x] 3.3 Derive `openspec/specs/grade10-admin/vault/money-book/feature-tcs.md` with `/spec-to-tcs feature grade10-admin-vault-money-book`, every case `draft`.
- [x] 3.4 Derive `openspec/specs/grade10-admin/vault/operator-queue/feature-tcs.md` with `/spec-to-tcs feature grade10-admin-vault-operator-queue`, every case `draft`.

## 4. Shared (grade10-spec)

- [x] 4.1 Derive `openspec/specs/shared/console/blocks/feature-tcs.md` with `/spec-to-tcs feature shared-console-blocks`, every case `draft`.
- [x] 4.2 Derive `openspec/specs/shared/console/user-directory/feature-tcs.md` with `/spec-to-tcs feature shared-console-user-directory`, every case `draft`.

## 5. Close the rule (grade10-spec)

- [ ] 5.1 Confirm `pnpm check:manual` reports no `derived` warning. — blocked: the nineteen are derived, but `derived` still names eight capabilities this list never held, written since (`grade10-admin/console/api-docs`, `shared/design-sync/{annotation-monitoring,annotation-verification,coverage}`, `shared/frontend-composition`, `shared/money-amounts`, `shared/ui/{auth-sign-in,component-package}`); each owes its own `/spec-to-tcs feature` run
- [ ] 5.2 Raise `derived` from `warn` to `fail` in `tools/manual/check/context.mjs`, so CI gates the pairing from here on. — blocked: waits on 5.1, or raising now fails `main` on those eight
