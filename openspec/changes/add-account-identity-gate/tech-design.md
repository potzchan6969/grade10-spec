## Context

What the identity store and its first host leave in place; the requirements
are the three deltas, and `add-identity-standing` states the standing read
this builds on.

- **The vault hosts a hosted check** — `@grade10/e-kyc-backend/checks`
  publishes the check's life over a `CheckHost` the product supplies and
  `/routes` publishes the provider's callback; the vault instantiates the
  check's table beside its cases and mounts both
- **The store is one worker for both brands** — `@grade10/store-service`
  assembles a brand's storefront from a `StoreRuntime`; a binding only one
  brand carries is read inside that brand's own runtime hook, never named on
  the shared env
- **A bid rides the storefront** — the auction worker never sees the account;
  the storefront's `auction.placeBid` forwards a signed-in person's bid over
  the auction's per-storefront entrypoint
- **Checkout prices twice already** — the review reads the catalogue live and
  the order machine prices again inside the checkout

## Goals / Non-Goals

Goals:

- **The account is the case** — the store hosts the published lifecycle with
  the user id as the case reference; no new lifecycle, no second vendor seam
- **No record in the store** — the standing and the binding are the identity
  store's; the store keeps the check's row and nothing about the person
- **No order on a refusal** — the gate runs before the order machine writes
- **Consent on every host** — one column, one refusal code, one body shape

Non-Goals:

- **No collector routes on the store** — the account reaches its check through
  its session; the invitation routes stay the vault's
- **No gate inside the order machine** — the bar is store policy at the
  procedure, not a checkout outcome the machine computes

## Decisions

### The store hosts the published lifecycle with the account as the case

- `createIdentityCheckTables(storeSchema)` instantiates `identity_checks` in the
  store's own schema; `case_ref` is the user id, so one live check per account
  is the same partial unique index the vault has
- `accountHost` supplies what the lifecycle asks: `loadCase` reads the
  identity store's binding for the account (`forCase(userId)`), `holdsIdentity`
  is a bound record whose document is still valid, `refusalOf` is never a
  refusal, the person is always reachable, and `invite` sends nothing — the
  person is on the page that asks
- `land` moves the check row to approved when a verdict lands through it and
  writes nothing else: the binding was made by `settleHosted` in the identity
  store, and the account page reads the standing back from there
- Alternatives rejected:
  - An `account_identities` table — a copy of a binding the store does not own,
    with a second erasure to keep honest
  - Emailing an invitation from the store — a person on their own account page
    needs no link; the vault's link exists for a visit booked ahead

### Entry by case, and consent, are the lifecycle's

- `openIdentityCheck` and `startIdentityCheck` take `{ secret }` or
  `{ caseRef }`: the vault's collector arrives by the secret in a link, the
  store's by the session that owns the account
- `startIdentityCheck` takes the consent the page collected and refuses
  `CONSENT_REQUIRED` before a link is minted; the first consent is stamped on
  `consented_at` and never re-stamped
- The published routes split: `registerVerdictRoute` and
  `registerInvitationRoutes`; the vault mounts both, the store mounts the
  callback alone
- The callback's context may name a `release`: the settle runs in `waitUntil`
  after the 204, so a host whose per-request database closes with the response
  opens its own handle for this route and the route lets it go after the last
  query

### The gate stands at the procedure, on the standing

- `identityGate(deps, { kind, amountMinor, userId })` answers open below the
  bar, and above it only for a standing of `verified` read now; a guest above
  the bar is refused without a read
- `checkout.createCheckout` and `createCheckoutWithEmail` price the goods with
  the same live read the review uses and gate before `createCheckout` runs;
  the refusal is a checkout outcome, `identityRequired`, carrying the bar and
  the goods' value, so the page resolves it as every other outcome
- `auction.placeBid` gates on the bid's amount before `ctx.auction()` is
  reached; the refusal is a `PlaceBidOutcome` with `IDENTITY_REQUIRED`, a code
  the auction worker never emits
- Alternatives rejected:
  - Gating inside the order machine — an order row would be written and then
    refused, as `paymentFailed` leaves one
  - Gating in the auction worker — it holds no session and would need the
    identity binding both brands' storefronts already own

### Brand wiring

- `StoreRuntime.identity` names the brand's `KYC_SERVICE` binding and its
  gates; grade10's app supplies both, ZZZ supplies neither, and a wired brand
  whose env lacks the binding fails by name rather than open
- `identityGates(brand)` in `@grade10/app-env`: grade10 `{ orderMinorUnits:
  12_000_000, bidMinorUnits: 12_000_000 }`, zzz `null`

## Database Schema

### `store.identity_checks` — new, from the identity store's factory

The vault's table, instantiated into the store's schema: the same columns,
indexes and checks, with `case_ref` holding the user id. Both brands' store
databases carry the migration, since the schema is shared; ZZZ's table stays
empty.

### `identity_checks.consented_at` — new column, both hosts

| Column | Type | Meaning |
| --- | --- | --- |
| `consented_at` | `timestamptz(3)`, null | When the collector agreed, stamped on the first start; null until then |

## Service Interfaces

| Processor | Input | Output | Notes |
| --- | --- | --- | --- |
| `identity.status` | session | `{ available: false }` or `{ available: true, standing, check, gates }` | Two reads: the identity store's standing and the store's latest check row; no write |
| `identity.start` | session, `{ consented }` | `started { hostedUrl }`, `verified`, `waiting`, `consentRequired`, `unavailable` | Raises when no live check; reuse answers `verified`; a live check that ran out on the store's clock is expired and raised again once |
| `identityGate` | `kind`, `amountMinor`, `userId` | `open`, or `thresholdMinor` and `currency` | One standing read at most; none below the bar or for a guest |
| `runStoreIdentityChecks` | cron | settled and expired counts | The published sweeps over the account host, on the store's five-minute cron |
| `forgetIdentity` | erasure | — | Withdraw the live check, scrub the rows, queue the provider's erasure, release the binding |

- **Callback** — `POST /api/identity/verdicts` on the store's worker, the
  published route over the account host, with its own database handle and
  `release`

## Contracts

- `@grade10/e-kyc-contracts`: `CONSENT_REQUIRED` on the invitation refusal
  codes; `startCheckRequestSchema` (`{ consented: true }`); `consentedAt` on the
  check view; `kycServiceOverBinding`
- `@grade10/store-contracts`: `identityStatusSchema`, `identityStartInputSchema`,
  `identityStartResultSchema`, `identityGatesSchema`; `identityRequired` on
  both checkout result unions
- `@grade10/auction-contracts`: `IDENTITY_REQUIRED` on `placeBidErrorCodeSchema`

## Risks / Trade-offs

- **[A second live catalogue read per checkout]** → only on a brand with an
  identity store, and the read the review already makes; the alternative was
  an order row written for a refused checkout
- **[A verdict lands while the account is being erased]** → the erasure
  withdraws the live check first, and a landing on a withdrawn row moves
  nothing; the binding it raced is released by the same erasure
- **[The person reads `expired` while an older record is still valid]** →
  consistent with `bind`, which reuses the latest; the person verifies again
- **[Two webhook URLs at the vendor]** → one per host, recorded in the
  deployment checklist; a delivery naming a check the store does not hold is
  answered 204 and settles nothing

## Migration Plan

1. **Two migrations, additive** — `consented_at` on the vault's table;
   `identity_checks` in both brands' store databases
2. **Deploy the identity store** with `StoreKycService` before the store,
   which binds it
3. **Keep dormant** — optional identity code may be deployed behind feature-
   flag or runtime wiring that is disabled in production. While disabled, the
   account identity flow is unavailable and checkout and bid requests are not
   identity-gated. Do not enable the feature until the threshold, accountable
   Compliance owner, DPIA, DPA, and production rollout are approved.
4. **Configure the vendor's second webhook** for the store's callback
