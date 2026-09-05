# Tasks

Group 1 is the store's side and lands on its own: nothing binds a gate until a
product's first gating feature does, and that feature is its own change. Group
2 is the manual, in **grade10-spec**. Design decisions and the one service
call: [`tech-design.md`](tech-design.md).

## 1. The standing and the gate (grade10)

- [x] 1.1 Add `store` and `auction` to the products the store serves, declare the three standings and the standing's shape, and publish the gate surface with its binding resolver, so *A person nobody verified reads unverified* passes at the contract
- [x] 1.2 Answer a person's standing off the latest record at the store's clock, on the service and on a gate of its own, so *A gating product reads a standing the vault made* and *A lapsed document reads expired* pass
- [x] 1.3 Mint the gate entrypoint per product and export `StoreKycGate` and `AuctionKycGate` beside `VaultKycService`, so *A gate cannot be walked onto the record* passes
- [x] 1.4 Read the hosted template per brand and environment, so *A brand's consumer reaches its own brand's store or none* and *A person verified on one brand is unknown to another* hold at the deployment
- [x] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `pnpm run check:handbook`

## 2. The manual (grade10-spec)

- [x] 2.1 Record the brand and the gate on the verified identity page's decisions, and the two kinds of consumer on the identity store's page
- [x] 2.2 Verify: `pnpm check:manual`

## 3. Archive hand-off (grade10-spec)

Runs after the change is deployed, not when it merges, and after
`add-hosted-identity-verification` archives — this delta adds to the
capability that change creates.

- [ ] 3.1 Copy the delta's `## Feature set` groups into the durable capability's feature set
- [ ] 3.2 Verify: `pnpm check:manual`, `pnpm run archive:preflight`
