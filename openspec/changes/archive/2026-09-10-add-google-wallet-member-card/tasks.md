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
- [x] 3.2 Make a rotating code one-time by advancing the pass's own period in one guarded update — no second table
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
- [ ] 5.4 End a pass from the operator console under the permission an elevated act requires, recorded in the operator log and refused rather than hidden without it, so *An operator ends a pass under the permission it requires* passes — moved to launch-wallet-passes
- [x] 5.5 Leave the membership untouched when a member deletes the pass from their wallet, so *Removing a pass leaves the membership intact* passes
- [x] 5.6 Declare the secret that encrypts a pass's own secret in the worker's secret list, and read it there
- [x] 5.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run secrets --check`
- [x] 5.8 Carry the words on a pass in every language the brand speaks, from the membership page's own catalog keys, so *A pass speaks the phone's language* passes

## 6. A pass stays current (grade10)

Needs group 5.

- [x] 6.1 Sweep the passes that are due, oldest first, reading each member's name, tier and points to spend from the panel the counter already asks for
- [x] 6.9 Read the lap's members in one call rather than one per row, over a narrow `memberStanding` on the commerce contract under a `membership:standing` grant — the panel is the counter's answer and cost a round trip and some seventeen statements a row to yield three fields. The rolling tier window inside it is read once per distinct floor through the one implementation every tier read runs, so the pass cannot disagree with the till; what bounds `LAP_LIMIT` is the vendor wakes a full lap can cost, not the read
- [x] 6.2 Stamp each row's next due instant from the tier term's end and the balance's expiry, so a change nobody recorded still reaches the pass, and *A change nobody recorded reaches the pass* passes
- [x] 6.3 Send only a difference, hashing what was last rendered, so *A burst costs one update* passes
- [x] 6.4 Mark a member's passes due from the change that moved them, logged and never thrown, so *A recorded change reaches the wallet on the next sweep* passes — the store's databases are separate from the programme's, so there is no shared transaction and no push either: the sweep reads `listStandingChanges` off the ledger and the tier log, which is what makes it total, and holds a cursor of its own. The name is the store's own row and no feed can carry it, so the rename kicks locally
- [x] 6.5 Carry the instant a pass was rendered onto the pass itself, so *A pass says how current it is* passes
- [x] 6.6 Add the sweep to the store worker's cron beside the others, reported whatever the rest did, with its backlog's depth and age counted together
- [x] 6.7 Hold the sweep's wallet calls under a ceiling that leaves room for a member saving a pass
- [x] 6.8 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run cf-typegen` if the wrangler config moved

## 7. Erasure reaches the pass (grade10)

Needs group 5.

- [x] 7.1 Strip every member fact from the pass and put it beyond use when a member is erased, so *An erased member's pass identifies nobody* passes
- [x] 7.2 Retry until the wallet confirms, and report the erasure as still owed until then, so *An erasure the wallet has not confirmed is still owed* passes
- [x] 7.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. The membership surface (grade10)

Needs group 1's submodule bump and group 5. The pin and the store branch now
agree, so nothing blocks the checks.

- [x] 8.1 Add the pass to the member's card feature — the save action, the pass they hold, read from the server so a returning member still finds it, and ending it — behind the feature's own tokens
- [x] 8.2 Compose `WalletPassLinks` beside the member card on the membership page, taking every word from the application's catalog
- [ ] 8.3 Offer the same save address in the message that welcomes a new member — dropped: the page decided the welcome message carries no save action
- [ ] 8.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 9. What the second wallet exposes (grade10)

Every one is latent — `WALLET_ISSUERS` is null in every environment, so
`pos_passes` is empty and no member is affected. All of them become live defects
the day a second platform can be written.

- [x] 9.1 Hash every fact a pass shows in the sweep's digest, not three of them, so a wallet whose barcode the programme advances is not held back by a gate that believes the barcode cannot move
- [x] 9.2 Give `endLivePasses` a required wallet — one or all, never defaulted — so adding a pass in one wallet stops ending the member's pass in the other, and so the next caller must say which it means
- [x] 9.3 Read every live pass a member holds rather than one wallet's, so an Apple-only holder is not told they carry nothing while their pass goes on identifying them
- [x] 9.4 Claim and sweep per wallet, and run a lap for each wallet a brand carries, so an Apple row is never handed to Google's adapter and a brand carrying only one wallet still sweeps
- [x] 9.5 Tag every wallet metric with the wallet it came from, so two vendors do not merge into one number
- [x] 9.6 Leave `erasePasses` alone: erasure is global by definition
- [x] 9.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 10. The pass a member can already scan (grade10)

Needs group 9.

- [x] 10.1 Cover the code path that has none — the clock gate, the ten-guess cap and the monotonic single use — before touching it, so today's behaviour is pinned first
- [x] 10.2 Add the counter-free payload as a second scheme the reader names, refusing a payload whose scheme is not the one its own pass uses, so a photographed rotating code cannot be retyped into a durable one
- [x] 10.3 Build the `.pkpass` — the store-only archive, the SHA-1 manifest, and the detached signature carrying Apple's intermediate — with the bytes checked against a real verifier rather than against our own reader
- [x] 10.4 Issue an Apple pass and answer where the member saves it, under their own session, so *A member adds their card to Apple Wallet* passes
- [x] 10.5 Identify from a durable code with no counter and no clock, so *An Apple pass identifies every time* passes
- [x] 10.6 Let an Apple session read the panel and refuse to spend or collect, behind a switch that is off, so *An Apple pass cannot move value* passes
- [x] 10.7 Record which wallet identified, on the `wallet:` tag every identify metric carries, without adding a seventh arm to the till's vocabulary
- [x] 10.8 Widen the wallet the pass table accepts, and carry the migration into both brands byte for byte
- [x] 10.9 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run check:migrations`

## 11. Keeping an Apple pass current (grade10)

Needs group 10. Nothing here is safety-critical: the code is durable, so a
service that is down is a stale card rather than an exposure.

- [x] 11.1 Serve the five endpoints Apple's devices drive, authenticating only the three that carry a token, so a device that cannot list its passes is never left silently un-updatable
- [x] 11.2 Hold the devices a pass reaches and the passes a device holds as the many-to-many they are, refreshing the push token every time a device registers
- [x] 11.3 Draw what a device has already seen from one sequence, so a pass a device has only just registered is never filtered out of its own first update
- [x] 11.4 Push through a wallet-neutral sender, behind a swappable transport, retrying per device and forgetting the ones the vendor says are gone
- [x] 11.5 Hold the push credential outside the isolate, so a cron tick does not mint one every five minutes against a vendor that refuses more than one per twenty
- [x] 11.6 Void the pass and forget its devices when it ends or a member is erased, discharging the debt with no acknowledgement to wait for, so *An erasure with no wallet to confirm it is still discharged* passes
- [x] 11.7 Report the certificate's remaining life on every lap and refuse to sign past it, so a yearly expiry is a monitor rather than a memory
- [ ] 11.8 Verify: `pnpm run typecheck`, `pnpm run test:backend` — both pass; `pnpm run secrets --check` reads the deployed workers and needs Cloudflare credentials, so it runs at deploy rather than here — moved to launch-wallet-passes

## 12. Two wallets on the membership surface (grade10-spec, grade10)

Needs group 10.

- [x] 12.1 Let the block carry one row per wallet, so a member holding one is still offered the other and an address already answered is not taken away before they use it
- [x] 12.2 Offer each wallet the deployment carries and the action that ends each, so *A member who returns still finds the passes they hold* and *A deployment offers only the wallets it carries* pass
- [x] 12.3 End one wallet's pass from the surface, leaving the other identifying, so *Ending one wallet's pass leaves the other alive* passes
- [ ] 12.4 Draw Apple's own save artwork, which its guidelines require and a generic button does not satisfy — the badge is licensed only while the organisation is an Apple Developer Program member, and downloaded from the developer site under the Wallet Marketing Agreement, so it waits on the enrolment named in the [Apple runbook](../../../docs/prds/products/grade10-site/loyalty/profile.md) — moved to launch-wallet-passes
- [x] 12.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:stories:ui`
- [ ] 12.6 Draw the pass's own artwork — the icon and logo at every scale that `appleAssets.ts` ships as flat squares, and the class artwork the Google console takes — before the first pass is offered to anybody. Design's, and needs no enrolment — moved to launch-wallet-passes

## 13. What the second audit left standing (grade10)

Needs nothing. Each was found by an auditor, argued against by a reviewer, and
deliberately not fixed in that round — recorded here so the reasoning is not
re-derived and the cost is not paid twice.

- [x] 13.1 Give `pos_pass_registrations` its two foreign keys — the device with `ON DELETE CASCADE`, the pass with no action. Row hygiene rather than a fix: scoping the orphan sweep to the device it just touched already closed the reachable defect. Landed while the tables are empty, which is when a key is free; the three tables are now built by one factory, as the coupon tables already were, because a key needs both sides in scope
- [x] 13.2 Drop `pos_pass_push_tokens.token`, superseded by the sealed pair beside it. The contract half of 0031: safe without waiting on a deploy, because the only writer is the APNs provider-token path and no environment has the key that reaches it
- [ ] 13.3 Settle the push credential and the push type against one enrolled device, which no documentation can answer: Apple documents the pass certificate while the shipped default is a team key, and pins `apns-push-type: background` to a bundle id while a pass topic is not one. Record which of the three attempts makes the device come back and ask, never which returns 200 — a silent drop returns 200 too. The [Apple runbook](../../../docs/prds/products/grade10-site/loyalty/profile.md) carries the method — moved to launch-wallet-passes
- [x] 13.4 Move focus to the save link when a mint replaces the add button with it, so a keyboard member is not dropped to the page body by the button unmounting under them. Waits while the mint is in flight, and moves nothing when it fails — the button is still there, still focused, and the failure is announced
