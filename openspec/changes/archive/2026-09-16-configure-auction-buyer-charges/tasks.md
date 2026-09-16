## 1. Shared types and interfaces (grade10-spec)

- [x] 1.1 Fold the buyer-premium disclosure, invoice premium, premium-minimum, and Payment settings deltas into the planning record and keep the three affected PRDs marked 🚧 (grade10-admin-auction-payment-settings-SC-01, grade10-site-auction-bid-payment-method-SC-16, grade10-site-auction-winner-order-SC-46)
- [x] 1.2 Verify: `openspec validate configure-auction-buyer-charges --strict`, `pnpm check:manual`, and `pnpm run tcs:validate`

## 2. Shared types and pricing policy (grade10)

- [x] 2.1 Add the shared 20% buyer-premium policy, supported currency set, default minimum mapping, and deterministic minor-unit calculation contract (grade10-site-auction-bid-payment-method-SC-16, grade10-site-auction-winner-order-SC-46, grade10-site-auction-winner-order-SC-47)
- [x] 2.2 Verify: focused policy and contract tests plus the affected package typecheck

## 3. Data migration (grade10)

- [x] 3.1 Add the auction payment-settings table, supported-currency and non-negative-minimum constraints, audit columns, and USD 0/HKD 0/JPY 0 seed rows (grade10-admin-auction-payment-settings-SC-01)
- [x] 3.2 Verify: generated migration/schema checks and focused repository migration tests

## 4. Backend and API (grade10)

- [x] 4.1 Calculate the 20% premium in the shared winner invoice projection for invoice creation and reissue, preserving integer rounding and invoice receipt totals (grade10-site-auction-winner-order-SC-46, grade10-site-auction-winner-order-SC-47)
- [x] 4.2 Add settlement-authorized Payment settings read/save procedures with complete-map validation, atomic persistence, operator identity, and timestamp (grade10-admin-auction-payment-settings-SC-01, grade10-admin-auction-payment-settings-SC-02, grade10-admin-auction-payment-settings-SC-03, grade10-admin-auction-payment-settings-SC-04)
- [x] 4.3 Apply the current currency minimum when calculating a new invoice or reissue, while preserving the stored premium on sent invoices (grade10-site-auction-winner-order-SC-46, grade10-site-auction-winner-order-SC-47)
- [x] 4.4 Verify: focused backend/API tests, `pnpm run test:backend`, and affected package typechecks

## 5. Frontend (grade10)

- [x] 5.1 Add the settlement-permission-filtered Payment settings tab under `/auction`, with USD/HKD/JPY minor-unit fields, atomic save feedback, reload behavior, and refusal states (grade10-admin-auction-payment-settings-SC-01, grade10-admin-auction-payment-settings-SC-02, grade10-admin-auction-payment-settings-SC-03, grade10-admin-auction-payment-settings-SC-04)
- [x] 5.2 Update the bidder bid panel to disclose the 20% premium rate in every supported currency while keeping calculated premium and invoice totals absent until invoicing (grade10-site-auction-bid-payment-method-SC-16, grade10-site-auction-bid-payment-method-SC-17)
- [x] 5.3 Render the calculated premium on the winner invoice surface without adding the calculated amount to the bid panel (grade10-site-auction-winner-order-SC-46, grade10-site-auction-winner-order-SC-47)
- [x] 5.4 Verify: focused admin/site component tests, affected package typechecks, lint, and the repository validation lane
