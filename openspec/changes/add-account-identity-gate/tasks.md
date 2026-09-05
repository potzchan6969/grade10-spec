# Tasks

Group 1 lands in **grade10-spec** and its submodule bump is the boundary group
6 waits on. Groups 2 to 5 land together in **grade10**; group 2 is the shared
interface the rest read.

Design decisions, the data model and the service contracts:
[`tech-design.md`](tech-design.md). Screens and states:
[`ui-design.md`](ui-design.md).

## 1. Words (grade10-spec)

- [x] 1.1 Add the `identity` namespace and the `checkout.identity.*` and `auctionListing.identityRequired` keys to `@grade10/i18n`, in every language the shared layer speaks
- [x] 1.2 Write the account-identity page of the manual and name the bar on the checkout and auction pages
- [x] 1.3 Verify: `pnpm --filter @grade10/i18n test`, `pnpm check:manual`

## 2. Contracts (grade10)

- [x] 2.1 Add `CONSENT_REQUIRED`, the start body codec and `consentedAt` to `@grade10/e-kyc-contracts`, and `kycServiceOverBinding` so a second host holds the service the way the vault does
- [x] 2.2 Add the identity status, start and gates codecs to `@grade10/store-contracts`, `identityRequired` to both checkout results, and `IDENTITY_REQUIRED` to the bid outcome
- [x] 2.3 Add `identityGates(brand)` to `@grade10/app-env`, so *A brand with no identity store shows nothing* and *A bid below the bar asks nothing* have a value behind them
- [x] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`

## 3. The check's life, on both hosts (grade10)

- [x] 3.1 Let `openIdentityCheck` and `startIdentityCheck` enter by secret or by case, refuse a start without consent, and stamp `consented_at` on the first, so *Nothing reaches the provider before the collector agrees* passes on the store and on the vault alike
- [x] 3.2 Split the published routes into the callback and the collector's reads, and let a callback context name its `release`
- [x] 3.3 Generate the vault's migration for `consented_at` and both brands' store migrations for `identity_checks`
- [x] 3.4 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run test:backend`

## 4. The store as a host, and the gates (grade10)

- [x] 4.1 Host the check for the account — the account as the case, no invitation, the row moved on landing — and answer `identity.status` and `identity.start`, so *A collector verifies from their account and is recognised*, *A collector verified at a vault visit is recognised without a ceremony*, *A collector whose document lapsed verifies again* and *A check the provider is deciding is not started twice* pass
- [x] 4.2 Gate `checkout.createCheckout` and `createCheckoutWithEmail` on the goods priced live, so *An unverified buyer above the bar is sent to verify*, *A verified buyer above the bar checks out*, *A basket below the bar asks nothing* and *A guest above the bar is asked to sign in* pass
- [x] 4.3 Gate `auction.placeBid` before the auction hears of the bid, so *An unverified bidder above the bar is held at the storefront*, *A verified bidder above the bar bids* and *A bid below the bar asks nothing* pass
- [x] 4.4 Run the published sweeps on the store's cron, mount the callback with its own database handle, and erase the check with the account, so *Erasing the account takes its check with it* passes
- [x] 4.5 Bind `KYC_SERVICE` to `StoreKycService` in the grade10 store's wrangler config, mint that entrypoint in the identity store, and wire the runtime in the grade10 store app alone
- [x] 4.6 Verify: `pnpm run test:backend`, `pnpm run cf-typegen`

## 5. The card, the panel and the refusal (grade10)

- [x] 5.1 Add the `identity` slice to `@grade10/store-frontend` — status, start, the card with consent — and mount it on the account page, so *A verified collector sees they are verified and until when*, *A collector nobody verified sees the bar and how to verify*, *The account page carries no identity field* and *A declined collector may try again* pass
- [x] 5.2 Resolve `identityRequired` on the checkout page as a verify panel that points at the account
- [x] 5.3 Render `IDENTITY_REQUIRED` in the bid dialog as one refusal that points at the account
- [x] 5.4 Add the consent step to the collector's page in `@grade10/e-kyc-frontend`, so the vault's invitation collects the same agreement
- [x] 5.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 6. Words, wired (grade10)

Needs group 1's submodule bump.

- [ ] 6.1 Read the card's, the panel's, the dialog's and the collector's page's copy through `@grade10/i18n` and drop the interim English hooks
- [ ] 6.2 Verify: `pnpm run typecheck`, `pnpm run test`

## 7. Archive hand-off (grade10-spec)

Runs after the change is deployed, not when it merges, and after
`add-hosted-identity-verification` and `add-grade10-shopify-store` archive —
two of these deltas add to capabilities those changes carry.

- [ ] 7.1 Copy each delta's `## Feature set` into its durable capability, and account-identity's `user-journeys.md` into `openspec/specs/`
- [ ] 7.2 Carry the approved `test-cases.md` suites across
- [ ] 7.3 Verify: `pnpm run tcs:validate`, `pnpm check:manual`, `pnpm run archive:preflight`
