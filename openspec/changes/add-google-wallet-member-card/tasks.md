# Tasks

Groups 2 onward need group 1's submodule bump. After that they are parallel,
except where a heading says otherwise.

Before group 4 can be exercised end to end, the Google issuer account and its
publishing access must exist — the operational follow-ups are recorded on
[the membership page](../../../docs/prds/products/grade10-site/loyalty/profile.md).
Every group below is testable without them: the wallet is reached through one
port with a fixture on the production graph.

## 1. The save action (grade10-spec)

- [x] 1.1 Export `WalletPassLinks` from `@grade10/ui` — the save address and the words the consumer gives it, holding no wallet, member or product state, so *The save action is offered beside the card* passes
- [x] 1.2 Write its stories: offered, and absent where a brand carries no pass
- [x] 1.3 Bring `docs/prds/products/grade10-site/loyalty/profile.md` to the shipped pass and drop the wallet line from its warning callout when group 8 lands
- [ ] 1.4 At archive, copy this delta's `## Feature set` group into the durable spec's, and `user-journeys.md` across beside it
- [x] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm check:manual`

## 2. The pass as an identification arm (grade10)

- [x] 2.1 Add `pass` to the identification arms with the same rights as a scanned card, and to the arms that prove the member's own device was present, so *A pass identifies as the card does* passes
- [x] 2.2 Count a pass identification apart from every other arm on the session row, the audit record and the metrics, so *Arriving by pass is countable* passes
- [x] 2.3 Add the scanned payload's shape — prefix, pass reference, period, code — as a codec the till and the gateway both read, refusing anything that is not a member pass before any lookup
- [x] 2.4 Send the scanned payload on the pass arm from the till extension, keeping it inside its byte budget
- [x] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. Where a pass lives (grade10)

- [x] 3.1 Add the pass table — the member, the wallet, the encrypted secret, the state, the digest and the sweep's own instants — with at most one live pass per member per wallet
- [x] 3.2 Add the pass-use table, unique on the pass and the period, append-only
- [x] 3.3 Widen the session's provenance constraint to accept a pass, keeping every value already recorded
- [x] 3.4 Verify: `pnpm run db:drizzle:generate` and commit the output, `pnpm run check:migrations`, `pnpm run test:backend`

## 4. A pass identifies at the counter (grade10)

Needs groups 2 and 3.

- [x] 4.1 Verify a scanned code against the pass's own secret, accepting the period it names and one either side, so *A pass identifies with no signal* passes
- [x] 4.2 Record the use on the pass and the period before the session opens, refusing a second presentation of the same code, so *A photographed code is worth nothing* passes
- [x] 4.3 Open the till session on the pass arm with the capabilities that arm carries, so *A pass identifies as the card does* passes
- [x] 4.4 Answer a pass that is not live exactly as a lookup that found nobody, disclosing nothing about why
- [x] 4.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 5. Adding and ending a pass (grade10)

Needs group 3.

- [x] 5.1 Issue a pass for the signed-in member — secret, row and wallet object — and answer the address that saves it, so *A member adds their card to their wallet* passes
- [x] 5.2 Put the wallet behind one port with a fixture on the production graph, and exercise the sweep, the expiry arm and the counter through it, so every group below is tested with no vendor in the loop
- [x] 5.3 End a pass on the member's own action, at once, so *An ended pass identifies nobody* passes, and let them add another
- [ ] 5.4 End a pass from the operator console under the permission an elevated act requires, recorded in the operator log and refused rather than hidden without it, so *An operator ends a pass under the permission it requires* passes
- [x] 5.5 Leave the membership untouched when a member deletes the pass from their wallet, so *Removing a pass leaves the membership intact* passes
- [x] 5.6 Declare the secret that encrypts a pass's own secret in the worker's secret list, and read it there
- [x] 5.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run secrets --check`

## 6. A pass stays current (grade10)

Needs group 5.

- [x] 6.1 Sweep the passes that are due, oldest first, reading each member's name, tier and points to spend from the panel the counter already asks for
- [ ] 6.9 Read the lap's members in one call rather than one per row — the panel answers a single member, so this needs a narrow `memberStanding` on the commerce contract
- [x] 6.2 Stamp each row's next due instant from the tier term's end and the balance's expiry, so a change nobody recorded still reaches the pass, and *A change nobody recorded reaches the pass* passes
- [x] 6.3 Send only a difference, hashing what was last rendered, so *A burst costs one update* passes
- [ ] 6.4 Mark a member's passes due from the writes that already run in their transaction, logged and never thrown, so *A recorded change reaches the pass* passes inside the interval — `kickWalletRefresh` is written and reaches no caller, so a recorded spend reaches the pass on the daily floor instead. The writes are the loyalty worker's and the row is the store's, so there is no shared transaction to hang it on: it wants a post-commit kick after the loyalty call returns
- [x] 6.5 Carry the instant a pass was rendered onto the pass itself, so *A pass says how current it is* passes
- [x] 6.6 Add the sweep to the store worker's cron beside the others, reported whatever the rest did, with its backlog's depth and age counted together
- [x] 6.7 Hold the sweep's wallet calls under a ceiling that leaves room for a member saving a pass
- [x] 6.8 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run cf-typegen` if the wrangler config moved

## 7. Erasure reaches the pass (grade10)

Needs group 5.

- [x] 7.1 Strip every member fact from the pass and put it beyond use when a member is erased, so *An erased member's pass identifies nobody* passes
- [ ] 7.2 Retry until the wallet confirms, and report the erasure as still owed until then, so *An erasure the wallet has not confirmed is still owed* passes
- [x] 7.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. The membership surface (grade10)

Needs group 1's submodule bump and group 5. `pnpm run build` is the one check
still owed: it cannot pass until the submodule pin and this change's store
branch agree, because the auction's bid-card copy moved between them.

- [x] 8.1 Add the pass to the member's card feature — the save action, the pass they hold, read from the server so a returning member still finds it, and ending it — behind the feature's own tokens
- [x] 8.2 Compose `WalletPassLinks` beside the member card on the membership page, taking every word from the application's catalog
- [ ] 8.3 Offer the same save address in the message that welcomes a new member
- [ ] 8.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`
