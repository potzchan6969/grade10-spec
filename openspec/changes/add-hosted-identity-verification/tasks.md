# Tasks

Group 1 lands in **grade10-spec** and its submodule bump is the boundary:
group 12 cannot start until it has shipped. Group 2 is the shared interface
every other group reads, and group 3 is the table most of them write. Once
both have landed, groups 4, 5, 6, 10 and 11 are claimable in parallel; 7 needs
4 and 5, 8 needs 6, and 9 needs 7.

Design decisions, the data model and the service contracts:
[`tech-design.md`](tech-design.md). Screens, exports and states:
[`ui-design.md`](ui-design.md). Group 3 lands two migrations — the store's
additive columns and outbox, and the vault's `identity_checks` table from the
store's factory.

The counter path stays open throughout. Nothing here is behind a switch: with
no provider configured, no check is raised, every case reads `None`, and the
counter is what it is today.

## 1. Screens, blocks and words (grade10-spec)

- [x] 1.1 Write `ui-design.md` — the two surfaces, the exports they compose, and each state tied to the scenario behind it
- [ ] 1.2 Draw the collector's verification page in Figma — a frame per check state, including what a declined collector is shown — and link the frames
- [ ] 1.3 Draw the case screen's identity panel: the six states, who performed a bound check, and the override beside a decline
- [x] 1.4 Inventory the `@grade10/design-system` and `@grade10/ui` exports both surfaces compose; where one does not exist, add the variant, the token, or the block — and a block brings its own `shared/ui/<block>` delta carrying the exports requirement
- [ ] 1.5 Add the collector page's and the invitation's `en` catalogue to `@grade10/i18n`
- [x] 1.6 Bump the submodule pointer so group 12 can start
- [ ] 1.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm run design-sync:check`, `pnpm run check:submodules`

## 2. Identity check contracts (grade10)

- [x] 2.1 Add `hosted` to `KYC_PROVIDER_KINDS` and rewrite the comment that argues a hosted provider is not a value here, and add `hosted_capture` to `KYC_METHODS` so the settle has a `method` to write
- [x] 2.2 Declare the closed finding vocabulary — what a provider checks, and what an outcome may be — and add `providerFindings` to `KycVerification` and `toKycVerification`
- [x] 2.3 Declare the check's eight states and `KycCheckView` in `@grade10/e-kyc-contracts` — state, instants, decline reason and override, and no identity field, no secret, no vendor name
- [x] 2.4 Declare the new `KycServiceApi` methods and their outcomes: `raiseCheck`, `checkForCase`, `receiveVerdict`, `dueChecks`, `settleCheck`, `finishCheck`, `withdrawCheck`, `openInvitation`, `startCheck` — refusals named as `SCREAMING_SNAKE` failure codes, and both exhaustive maps that translate them grown to match
- [x] 2.5 Add `admin.caseIdentity` (`kyc:read`), `admin.raiseIdentityCheck` and `admin.withdrawIdentityCheck` (`vault:operate`) to `ADMIN_PERMISSIONS`, an optional override reason on `admin.recordKyc`, and the three identity routes, the invitation header and the refusal codes a collector's page branches on to `@grade10/e-kyc-contracts`, as every host mounts them
- [x] 2.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:handbook`

## 3. The check's table (grade10)

- [x] 3.1 Publish `createIdentityCheckTables` from `@grade10/e-kyc-backend/checks` with its state, decision and timeline check constraints, and instantiate it into the vault's schema as `identity_checks` beside the signing tables
- [x] 3.2 Add the three unique indexes — one live check per case, one row per provider reference, one secret per check — so *Asking twice does not invite twice* and *A repeated verdict is applied once* have a constraint behind them rather than a read
- [x] 3.3 Add the read-back, expiry and last-check indexes
- [x] 3.4 Add `provider_findings` to `kyc_verifications`, its `(provider, provider_ref)` unique index, and the `kyc_provider_redactions` outbox
- [x] 3.5 Generate both migrations and commit them
- [x] 3.6 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run test:backend`

## 4. The provider port and its adapter (grade10)

- [x] 4.1 Declare the provider port beside `KycStorePort` — raise, resume, read, fetch image, redact — and a fake in `testing` that every later group tests against
- [x] 4.2 Write the adapter against the vendor's documented wire: one create carrying the one-time link and the expiry windows, the inquiry read with its verifications included, the status mirror, the deciding verification's checks and front photo, `DELETE` for erasure, the pinned API version
- [x] 4.3 Keep findings as the vendor names them with the outcome reduced to passed or failed, and map the vendor's document classes onto `KYC_ID_TYPES`, declining a check the vocabulary cannot hold rather than retrying it
- [x] 4.4 Parse the signature header as whitespace-separated sets so a rotation proves under either secret
- [x] 4.5 Pin the adapter against vendor-shaped fixtures for every status, the create, the resume, the image fetch and the erasure, so a field the vendor does not send fails here rather than in production
- [x] 4.6 Declare the provider secrets in `packages/e-kyc/backend/src/secrets.ts`, both `optional` with their reason, and the non-secret settings and windows in `packages/app-env`
- [x] 4.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 5. Raising, starting, withdrawing and expiring a check (grade10)

Needs group 3's table: 5.1 rests on the live-check unique index.

- [x] 5.1 Raise a check by inserting it live with its minted invitation — 256 base64url bits carried in a fragment, only the digest stored, returned once — then raising with the provider off the row's own id and writing the reference and the account back; a raise the provider refuses withdraws the row and is reported, so *Asking twice does not invite twice*, *An invitation opens the check it names* and *A check that cannot be raised invites nobody and is reported* pass
- [x] 5.2 Start a check by resuming the provider's ceremony and marking the row started on the earlier of its own window and the invitation's; a check the provider no longer serves expires, so *A collector returning mid-check is shown where they are* and *An expired invitation is refused* pass
- [x] 5.3 Withdraw a live check on an operator's ask and inside a counter record's lock, leaving a decided one where it is, so *An operator clears a check that is going nowhere*, *A withdrawn check frees the case to be invited again* and *A decided check does not move again* pass
- [x] 5.4 Pass the invitation and started windows to the provider as its own expiry, keep the vault's clocks a grace behind as the lost-callback fallback, and read a started check back once before expiring it, so *An unopened invitation expires* and *An abandoned check expires rather than waiting forever* pass
- [x] 5.5 Verify: `pnpm run test:backend`

## 6. The collector's invitation (grade10)

- [x] 6.1 Answer the state and the next step for every state, stalled read off the check's own instants, and nothing else, so *A completed invitation does not open again* and *A declined collector is told what to do next* pass
- [x] 6.2 Keep the secret out of every path, query string, log and referrer — including `referrer-policy: no-referrer` on the headers the published routes set, wherever a product mounts them — so *The invitation's secret is left nowhere it can be read* passes
- [x] 6.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. The verdict and the settle (grade10)

Nothing here reads a delivery's body as fact: the host's route forwards it
unparsed, the store proves it and answers the reference, and the settle asks
the provider.

- [x] 7.1 Forward the raw delivery and its headers to `receiveVerdict`, prove the signature in the store, and count an unproven one without writing anything, so *An unproven verdict changes nothing and is not recorded* passes
- [x] 7.2 Resolve a proven reference to the vault's own row and answer 204 either way, so *A verdict for a check nobody raised changes nothing* passes
- [x] 7.3 Read the check back and apply Grade10's own two refusals on the caller's clock **before** any byte is fetched, so *An approved verdict for a minor is Declined*, *An approved verdict on an expired document is Declined* and *A provider's approval of a minor is still refused* pass
- [x] 7.4 Fetch the deciding verification's document image into the evidence store, and no face capture, checking type and size before the put and declining rather than retrying, so *A read never answers before the evidence is stored*, *No face capture is stored* and *An image the evidence store may not hold declines rather than retries* pass
- [x] 7.5 Insert the verification and bind it in one transaction, idempotent on the provider's reference, recording provider, reference, method, findings and who asked, so *A repeated verdict is applied once* and *A provider check names the provider, its reference, and who asked* pass
- [x] 7.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. Asking, on the case (grade10)

- [x] 8.1 Reuse the collector's most recent verified identity when an intake visit is booked — by the customer, off the response path, or by an operator — and invite only a case with nothing to reuse, so *A collector already verified is not asked again* and *Booking an intake visit invites the collector* pass
- [x] 8.2 Report a case holding no email address before a check is raised, so *A case nobody can be invited on is reported, not left silently unchecked* passes
- [x] 8.3 Let an operator holding `vault:operate` ask for a check on a pre-custody case and withdraw one, so *An operator asks for a check on a case that needs one* passes
- [x] 8.4 Add the invitation's notification kind and its copy, carry its link through the email channel, and correct the booking mail that tells every collector their document is checked in person
- [x] 8.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 9. Landing, on the case (grade10)

Every refusal here runs inside the case lock `recordCaseKyc` already takes —
this group adds a second caller and one refusal, not a second write path.

- [x] 9.1 Settle a landed verdict through the existing `bindToCase`, moving the check row in the same transaction, so *Binding a verdict voids an outstanding packet*, *The displaced identity is settled*, *A verdict landing after custody begins is refused*, *A verdict landing on sealed evidence is refused* and *A verdict landing on an erased case is refused* pass
- [x] 9.2 Refuse a case that bound an identity after the check was raised, as a third arm of the refusal chain so the discard still runs, and write the case's refusal on the check, so *A verdict landing on a case verified elsewhere is refused* and *A refused landing leaves no half-finished state* pass
- [x] 9.3 Queue what the column named before alongside what the store displaced, so a crash between the store's rebind and the vault's commit orphans nothing
- [x] 9.4 Compute the identity state on the case detail from the case row and its last check, and answer the record, its findings and the decline reason only from `admin.caseIdentity` under `kyc:read`, so *A case with a check out is not shown as unverified, and nothing waits on it*, *A verified case names who performed the check* and *A case's identity state is readable, its details are not* pass
- [x] 9.5 Keep the counter reachable with the provider down and withdraw a live hosted check inside the counter record's lock, so *Staff record a check while a hosted one is live* and *A provider outage does not stop a visit* pass
- [x] 9.6 Require a reason for a counter check over a decline, judged inside the lock, and record it on the case's history, so *A counter check after a decline is recorded as an override* and *An override of a refused check carries a reason* pass
- [x] 9.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 10. Read-backs, expiry and erasure (grade10)

- [x] 10.1 Register the read-back and expiry work lists on the vault's fast lane, leasing a submitted row rather than locking it, and expire a submitted check the provider has left undecided for the abandon window, so *A check the provider never decides is stalled rather than lost* and *A check the provider never settles stops being live* pass
- [x] 10.2 Queue the provider's erasure when a released hosted record is purged, in the same transaction, and drain the outbox from the store's own cron, so *The last release purges the record and commands the provider* and *A provider that cannot be reached does not hold up the erasure* pass
- [x] 10.3 Record a provider that refuses a redaction rather than dropping it, so *A provider that refuses is reported rather than dropped* passes
- [x] 10.4 End a live check, clear what every check holds about the person, and queue the provider's account when a case's data is erased, so *An erased person's live check stops being live* and *Erasing a person commands their whole account away* pass
- [x] 10.5 Emit the read-back backlog, the exhausted checks and the redaction backlog as metrics, so a queue that stops draining is visible
- [x] 10.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 11. The counter path, as the deltas write it down (grade10)

Most of `grade10-site/e-kyc/identity-record` describes the counter path as it
already ships; the change is the first time it is written down. Each task makes
the scenarios it names pass — where the shipped behaviour already holds the
evidence is the test, and where it does not, the code changes here.

- [x] 11.1 Pin a counter record's provenance and its per-type mask, so *A staff check names the staff member who made it*, *A recorded check answers with a mask* and *The same document is recognisable across two records* pass
- [x] 11.2 Pin reuse across consumers and the scoping that survives it, so *A second consumer reads a check the first recorded*, *A consumer cannot reach another consumer's case binding*, *Re-recording a case replaces its identity* and *A repeated bind converges on one binding* pass
- [x] 11.3 Pin the two refusals on the record, the reuse path and the day a document expires, so *A person under 18 is refused*, *A document that expired before today is refused*, *A document valid on its last day is accepted* and *An aged record is refused on reuse* pass
- [x] 11.4 Pin what a release does and does not purge, so *The evidence is reachable only through the case that holds it*, *A record another case still binds survives a release* and *A release repeats without error* pass
- [x] 11.5 Pin the vault's document gate, so *Preparing documents without an identity is refused*, *A packet whose identity moved cannot be sealed* and *A prepared document carries the bound identity's name* pass
- [x] 11.6 Pin the counter at the case across the whole status set, so *Staff verify a collector who arrives unverified* and *A counter check is refused once the item is in custody* pass
- [x] 11.7 Verify: `pnpm run test:backend`

## 12. The collector's page and the case panel (grade10)

Needs group 1's submodule bump and group 6's routes.

- [x] 12.1 Add `/vault/verify` to `SURFACES` with its kind, its route and its pinned address, beside the signing page it is a sibling of
- [x] 12.2 Render each check state and its next step from `ui-design.md`, reading the secret from the fragment and never putting it in a request path, showing no identity field and no refusal reason, so *An invitation opens the check it names* and *A declined collector is told what to do next* pass
- [x] 12.3 Add the identity panel to the admin case screen — the state, who performed a bound check, the findings and decline reason behind `kyc:read`, and the override reason on the counter dialog over a decline
- [x] 12.4 Add the collector's slice to `@grade10/e-kyc-frontend` and the panel's to `@grade10/vault-admin-frontend`, behind DI tokens, and register them in the two containers
- [x] 12.5 Wire the collector page's catalogue through `@grade10/i18n`
- [x] 12.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:frontend-layers`, `pnpm run check:admin-bundle`, `pnpm run build`

## 13. Archive hand-off (grade10-spec)

Runs after the change is deployed, not when it merges.

- [ ] 13.1 Copy each delta's `## Feature set` into its durable capability — the fold carries `## Requirements` and nothing else
- [ ] 13.2 Copy each capability's `user-journeys.md` into `openspec/specs/`, including identity-record's `**Walked by:** nobody`
- [ ] 13.3 Carry the two approved `test-cases.md` across to their durable capabilities
- [ ] 13.4 Bring the six manual pages to the shipped story — the two e-KYC capability pages, the e-KYC index, the vault's identity-check page, the vault index whose callout this change falsifies, and the case-lifecycle page whose signing sequence still records identity only in the shop
- [ ] 13.5 Add the `::journeys` and `::cases` embeds to the three new capability pages, so the suites show where a reader can reach them
- [ ] 13.6 Verify: `pnpm run tcs:validate`, `pnpm run check:manual`, `pnpm run archive:preflight`
