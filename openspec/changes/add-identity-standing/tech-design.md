## Context

What the identity store is as `add-hosted-identity-verification` leaves it;
the requirements are the delta on `grade10-site/e-kyc/identity-record`.

- **One surface, minted per product** — a class factory mints a
  `WorkerEntrypoint` per product whose stub is the whole `KycServiceApi`:
  record, bind, read the record and the image, release, and the five hosted
  calls. The vault binds `VaultKycService` as `KYC_SERVICE`
- **Reads of a person already cross products** — `latestForUser` answers
  whichever product recorded the check
- **The brand axis exists in code and nowhere in the spec** — one worker per
  brand (`grade10-e-kyc-service`), its `BRAND` var, the hosted template read
  per brand and environment from `packages/app-env`; ZZZ deploys no identity
  store, and `BaseStoreEnv` names no binding only one brand carries

## Goals / Non-Goals

Goals:

- **A surface that cannot leak the record** — a gate is a second class, not a
  narrowing of the first: what is not written on it is unreachable over RPC
- **Nothing the vault holds changes** — the service gains the standing read
  and loses nothing
- **No new table, no new column** — a standing is the latest row reduced at
  read time

Non-Goals:

- **No consumer behaviour** — what the store gates on is
  `add-account-identity-gate`
- **No standing on a route** — the store keeps no HTTP surface

## Decisions

### A standing is the latest record, reduced at read time

- `standingForUser` reads the row `latestForUser` reads and answers
  `{ standing, verifiedAt, documentExpiresAt, provider }`, or
  `{ standing: "unverified" }`. Expiry is judged with the predicate `bind`
  refuses on, at the store's clock, so a gate and a bind never disagree about
  an aged record
- Under age is not a standing: nobody is verified under 18, and nobody gets
  younger
- Alternatives rejected:
  - A boolean — it could not tell a product to ask again, so the product would
    bind an aged record and be refused
  - A `verified_until` column — derived, and the document's expiry is already
    on the row

### The gate is its own RpcTarget and its own entrypoint

- `KycGate` carries one method. RPC exposes a class's own methods, so the
  record's reads and every write are not refused on a gate — they do not exist
  on it
- `kycGate({ run, clock, product })` is the node-safe surface; `kycService`
  spreads it, so the service holds the read too and the behavior suite drives
  one implementation for both
- `createKycGateEntrypoint(product)` mints the entrypoint; the deployment
  mints none today, because the store hosts checks and holds the service
  (`StoreKycService` beside `VaultKycService`) and the auction reads nothing.
  The product tags the `ekyc.standing` count and scopes nothing
- A consumer narrows its binding with `getKycGate`, which throws by name when
  the binding is missing — the refusal `getKycService` gives, for the same
  reason: `unverified` read off a missing binding lets through a person nobody
  checked
- Alternatives rejected:
  - A read-only view over the service stub in the consumer — a cast, with the
    record one method away
  - One shared gate taking a `product` argument — the binding is the identity
    everywhere else in the store

### Brand is a deployment, never a column

- One worker, one database, one bucket per brand; the `BRAND` var places the
  worker on the site registry and selects the hosted template. No row carries a
  brand, because no row can be read from another brand's worker
- A brand with no identity store binds nothing: `BaseStoreEnv` names no
  identity binding, so a brand's `KYC_GATE` is read inside that brand's own
  store worker, the way `LOYALTY_SERVICE` is
- Alternative rejected: a `brand` column in one shared store — one leaked
  credential would reach every brand's customers, and auth already decided
  one brand, one wall

## Service Interfaces

| Processor | Input | Output | Notes |
| --- | --- | --- | --- |
| `standingForUser` | `userId`, trimmed and non-empty | `{ standing: "unverified" }`, or `{ standing: "verified" or "expired", verifiedAt, documentExpiresAt, provider }` | One read of `kyc_verifications`, newest `verified_at` first; no transaction, no write; an empty id is refused before a connection opens |

- **Entrypoint → stub → service → repository** —
  `StoreKycService.createKycService()` → `KycService.standingForUser` →
  `kycGate().standingForUser` → `KycStorePort.latestForUser`; a gate
  entrypoint takes the same path through `KycGate`

## Contracts

- `@grade10/e-kyc-contracts`: `KYC_STANDINGS`, `kycStandingSchema` and
  `KycStanding`, `KycGateApi`, `KycGateBinding`, `getKycGate` and
  `kycGateBinding`; `KycServiceApi` extends `KycGateApi`; `KYC_PRODUCTS`
  gains `store` and `auction`
- The vault's port gains the one method; nothing else on its wire moves

## Risks / Trade-offs

- **[A consumer reads `verified`, binds nothing, and the record is released
  while the consumer still relies on it]** → a standing is a moment's answer,
  never a hold; a binding is what keeps a record, so a product that needs one
  kept records or binds through the service
- **[The latest record is expired while an older one is still valid]** → reads
  `expired`, as `bind` on the latest would refuse; the product asks again

## Migration Plan

1. **Deploy the identity store** with `StoreKycService` beside
   `VaultKycService`; the store binds it in `add-account-identity-gate`
2. **A read-only consumer's first gate**, the day one exists, mints its
   entrypoint, adds `KYC_GATE` to its wrangler config, and reads it through
   `getKycGate`
