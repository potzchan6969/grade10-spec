# Tasks

Group 1 lands in **grade10-spec** and its submodule bump is the boundary:
group 12 cannot start until it has shipped. Group 2 is the shared interface
every other group reads, and group 3 is the table most of them write. Once
both have landed, groups 4, 5, 6, 10 and 11 are claimable in parallel; 7 needs
4 and 5, 8 needs 6, and 9 needs 7.

Design decisions, the data model and the service contracts:
[`tech-design.md`](tech-design.md). Screens, exports and states:
[`ui-design.md`](ui-design.md).

The counter path stays open throughout. Nothing here is behind a switch: with
no provider configured, no check is raised, every case reads `None`, and the
counter is what it is today.

## 1. Screens, blocks and words (grade10-spec)

- [ ] 1.1 Write `ui-design.md` — the two surfaces, the exports they compose, and each state tied to the scenario behind it
- [ ] 1.2 Draw the collector's verification page in Figma — a frame per check state, including what a declined collector is shown — and link the frames
- [ ] 1.3 Draw the case screen's identity panel: the six states, who performed a bound check, and the override beside a decline
- [ ] 1.4 Inventory the `@grade10/design-system` and `@grade10/ui` exports both surfaces compose; where one does not exist, add the variant, the token, or the block — and a block brings its own `shared/ui/<block>` delta carrying the exports requirement
- [ ] 1.5 Add the collector page's and the invitation's `en` catalogue to `@grade10/i18n`
- [ ] 1.6 Bump the submodule pointer so group 12 can start
- [ ] 1.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm run design-sync:check`, `pnpm run check:submodules`

## 2. Identity check contracts (grade10)

- [x] 2.1 Add `hosted` to `KYC_PROVIDER_KINDS` and rewrite the comment that argues a hosted provider is not a value here, and add `hosted_capture` to `KYC_METHODS` so the settle has a `method` to write
- [x] 2.2 Declare the closed finding vocabulary — what a provider checks, and what an outcome may be — and add `providerFindings` to `KycVerification` and `toKycVerification`
- [x] 2.3 Declare the check's eight states and `KycCheckView` in `@grade10/e-kyc-contracts` — state, instants, decline reason and override, and no identity field, no secret, no vendor name
- [x] 2.4 Declare the new `KycServiceApi` methods and their outcomes: `raiseCheck`, `checkForCase`, `receiveVerdict`, `dueChecks`, `settleCheck`, `finishCheck`, `withdrawCheck`, `openInvitation`, `startCheck` — refusals named as `SCREAMING_SNAKE` failure codes, and both exhaustive maps that translate them grown to match
- [x] 2.5 Add `admin.caseIdentity` (`kyc:read`), `admin.recordKycOverride` (`vault:approve`), `admin.raiseIdentityCheck` and `admin.withdrawIdentityCheck` (`vault:operate`) to `ADMIN_PERMISSIONS`, and the three identity routes to `VAULT_PATHS`
- [x] 2.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:handbook`

## 3. The check's table (grade10)

- [x] 3.1 Add `ekyc.kyc_checks` to the table factory with its state, decision, verification, override, timeline and redaction check constraints
- [x] 3.2 Add the three unique indexes — one live check per case, one row per provider reference, and one secret per product — so *Asking twice does not invite twice* and *A repeated verdict is applied once* have a constraint behind them rather than a read
- [x] 3.3 Add the four read indexes: the settle work list wide enough to carry a raise that never recorded its reference, the case's last check whatever state it ended in, the expiry sweep, and the redaction drain
- [x] 3.4 Add `provider_findings` to `kyc_verifications`, nullable, so *The provider's findings survive the provider* has somewhere to land
- [x] 3.5 Add the cached check state to `vault_cases`, so reading a case does not reach across the binding
- [x] 3.6 Generate the migration and commit it
- [x] 3.7 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run test:backend`

## 4. The provider port and its adapter (grade10)

- [x] 4.1 Declare the provider port beside `KycStorePort` — raise (answering the reference and the hosted URL together), read, fetch document, redact, retention window — and a fake in `testing/fakes` that every later group tests against
- [x] 4.2 Write the adapter, reusing the platform's existing signed-webhook shape rather than growing its own crypto, and map each finding to Grade10's own closed set so *The provider's findings survive the provider* passes with the provider unreachable
- [x] 4.3 Map the provider's document types onto `KYC_ID_TYPES` and decline a check the vocabulary cannot hold, rather than retrying it forever
- [x] 4.4 Read the configured erasure window back on the first raise in an isolate and from the hourly sweep — never at startup, which a Worker does not have — and fault on one absent or longer than the stated window, so *A provider's window is checked, not assumed* passes
- [x] 4.5 Declare the provider secret in `packages/e-kyc/backend/src/secrets.ts` and the callback signing secret in `packages/vault/backend/src/secrets.ts`, both `optional` with their reason so an unset secret does not 503 the worker, and the non-secret settings in `packages/app-env`
- [x] 4.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 5. Raising, withdrawing and expiring a check (grade10)

Needs group 3's table: 5.1 rests on the live-check unique index.

- [x] 5.1 Raise a check by inserting it live with its minted invitation — 256 base64url bits carried in a fragment, only the digest stored, returned once — then calling the provider with the row's own id and recording the reference; answer a second, concurrent ask with the live check, so *Asking twice does not invite twice* and *An invitation opens the check it names* pass
- [x] 5.2 Report a raise the provider refused instead of inviting nobody quietly, so *A check that cannot be raised invites nobody and is reported* passes
- [x] 5.3 Complete a raise whose provider call never returned, from the settle work list, so no invitation names a check the provider does not hold
- [x] 5.4 Withdraw a live check on an operator's ask and on a counter record, and leave a decided one where it is, so *An operator clears a check that is going nowhere*, *A withdrawn check frees the case to be invited again* and *A decided check does not move again* pass
- [x] 5.5 Expire an unopened invitation, and a started check on the earlier of its own window and the invitation's, so *An unopened invitation expires* and *An abandoned check expires rather than waiting forever* pass
- [x] 5.6 Verify: `pnpm run test:backend`

## 6. The collector's invitation (grade10)

Needs group 3's columns. The routes mount on the vault worker; the state
machine behind them lives in e-kyc.

- [x] 6.1 Answer the state and the next step for every one of the eight states and nothing else, scoping the lookup by the caller's product, so *A completed invitation does not open again* and *A declined collector is told what to do next* pass
- [x] 6.2 Bind the check to the first device that opens it, under a cookie named per check, and refuse a second, so *A second device cannot continue an invitation* passes
- [x] 6.3 Keep the secret out of every path, query string, log and referrer — including `referrer-policy: no-referrer` on the vault's own secure headers — so *The invitation's secret is left nowhere it can be read* passes
- [x] 6.4 Refuse an invitation past its life and say how to be invited again, so *An expired invitation is refused* passes
- [x] 6.5 Hand a started check back to the provider where the collector left it, and bring the collector back to a page that needs no secret, so *A collector returning mid-check is shown where they are* passes; ask for nothing the provider collects, so *Grade10 asks for nothing the provider collects* passes
- [x] 6.6 Settle a due check when the collector reads their own invitation, so the one person waiting for the answer is not waiting on a tick
- [x] 6.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. The verdict and the settle (grade10)

Needs group 4's port and group 5's raise. Nothing here reads a delivery's body
as fact: the vault forwards it unparsed, e-kyc proves it, and the settle asks
the provider.

- [x] 7.1 Forward the raw delivery and its headers from the vault route to `receiveVerdict`, prove the signature and the environment inside e-kyc, and count an unproven one without writing anything, so *An unproven verdict changes nothing and is not recorded* passes
- [x] 7.2 Count a proven verdict naming no check Grade10 raised as rejected, so *A verdict for a check nobody raised changes nothing* passes
- [x] 7.3 Claim a check before settling it and make the terminal write conditional on the state it was claimed in, so two settles cannot both write and *A verdict for a check that is no longer the case's live check binds nothing* passes
- [x] 7.4 Settle by reading the check back from the provider, and apply Grade10's own two refusals on the caller's clock **before** any byte is fetched, so *An approved verdict for a minor is Declined*, *An approved verdict on an expired document is Declined* and *A provider's approval of a minor is still refused* pass
- [x] 7.5 Fetch one document image into the evidence store before the identity exists, and fetch no face capture, so *A read never answers before the evidence is stored* and *No face capture is stored* pass
- [x] 7.6 Check the content type and the size ceiling before the put and decline rather than retry, and report a check whose attempts are spent, so *An image the evidence store may not hold declines rather than retries* and *A provider verdict whose image cannot be fetched creates nothing* pass
- [x] 7.7 Insert the verification and bind it in one transaction, recording its provider, reference, method and who asked, so *A repeated verdict is applied once* and *A provider check names the provider, its reference, and who asked* pass
- [x] 7.8 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. Asking, on the case (grade10)

Needs group 6.

- [x] 8.1 Reuse the collector's most recent verified identity when an intake visit is booked, and invite only a case with nothing to reuse, so *A collector already verified is not asked again* and *Booking an intake visit invites the collector* pass
- [x] 8.2 Report a case naming no person, or holding no email address, before a check is raised, so *A case nobody can be invited on is reported, not left silently unchecked* passes and no invitation is minted that nobody can be sent
- [x] 8.3 Let an operator holding `vault:operate` ask for a check on a pre-custody case and withdraw one, so *An operator asks for a check on a case that needs one* passes
- [x] 8.4 Add the invitation's notification kind and its copy to the vault's catalogue, and correct the booking mail that tells every collector their document is checked in person
- [x] 8.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 9. Landing, on the case (grade10)

Needs group 7. Every refusal here runs inside the case lock `recordCaseKyc`
already takes — this group adds a second caller and one refusal, not a second
write path.

- [x] 9.1 Settle a landed verdict through the existing `bindToCase`, so *Binding a verdict voids an outstanding packet*, *The displaced identity is settled*, *A verdict landing after custody begins is refused*, *A verdict landing on sealed evidence is refused* and *A verdict landing on an erased case is refused* pass
- [x] 9.2 Add the identity guard to `bindToCase` as a third arm of its refusal chain — refusing a case that bound an identity after the check was raised, so the discard still runs — so *A verdict landing on a case verified elsewhere is refused* passes
- [x] 9.3 Write the outcome back to the check after the vault has judged it, outside the drain's own error handling, so *A refused landing leaves no half-finished state* passes and no check is left reading approved for a verdict nothing bound
- [x] 9.4 Carry the cached check state and who performed a bound check on the case detail, and answer the record, its findings and the decline reason only from `admin.caseIdentity` under `kyc:read`, so *A case with a check out is not shown as unverified, and nothing waits on it*, *A verified case names who performed the check* and *A case's identity state is readable, its details are not* pass
- [x] 9.5 Keep the counter reachable with the provider down and withdraw a live hosted check when staff record one, so *Staff record a check while a hosted one is live* and *A provider outage does not stop a visit* pass
- [x] 9.6 Require a reason for a counter check over a decline and show it beside the declined check, so *A counter check after a decline is recorded as an override* and *An override of a refused check carries a reason* pass
- [x] 9.7 Walk the whole path on a seeded case — booked, invited, walked, decided, bound before the visit — so *A collector completes the check before arriving* passes
- [x] 9.8 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 10. Stalls, work lists and erasure (grade10)

- [x] 10.1 Move a check the provider has not decided within the stated time to stalled and settle it from what the provider says, and expire one whose read-back has failed for the stated period, so *A check the provider never decides is stalled rather than lost* and *A check the provider never settles stops being live* pass
- [x] 10.2 Register the settle, expiry and redaction work lists on the vault's fast lane — e-kyc's own cron cannot reach `bindToCase` and is an hour too slow
- [x] 10.3 Mark a check's redaction owed wherever its image reached Grade10 and the check ended, and drain it oldest-first without holding up a local purge, so *The last release purges the record and commands the provider*, *A check that never became an identity is still commanded away* and *A provider that cannot be reached does not hold up the erasure* pass
- [x] 10.4 Report a provider that refuses a redaction rather than dropping it, so *A provider that refuses is reported rather than dropped* passes
- [x] 10.5 End a live check and clear what it holds about the person when a case's data is erased, so *An erased person's live check stops being live* passes and no invitation outlives an erasure
- [x] 10.6 Emit and alert on the work lists' depth and oldest entry, and on a stalled check, so a queue that stops draining is visible
- [x] 10.7 Verify: `pnpm run typecheck`, `pnpm run test:backend`

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
- [x] 12.3 Add the identity panel to the admin case screen — the state, who performed a bound check, the document image behind `kyc:read`, and the override control with its reason
- [x] 12.4 Add both feature slices to `@grade10/vault-frontend` and `@grade10/vault-admin-frontend` behind DI tokens, and register them in the two containers
- [ ] 12.5 Wire the collector page's catalogue through `@grade10/i18n` — blocked on 1.5; the page holds its English copy in one hook meanwhile, exactly as the signing ceremony does, with the keys it wants listed there
- [x] 12.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:frontend-layers`, `pnpm run check:admin-bundle`, `pnpm run build`

## 13. Archive hand-off (grade10-spec)

Runs after the change is deployed, not when it merges.

- [ ] 13.1 Copy each delta's `## Feature set` into its durable capability — the fold carries `## Requirements` and nothing else
- [ ] 13.2 Copy each capability's `user-journeys.md` into `openspec/specs/`, including identity-record's `**Walked by:** nobody`
- [ ] 13.3 Carry the two approved `test-cases.md` across to their durable capabilities
- [ ] 13.4 Bring the six manual pages to the shipped story — the two e-KYC capability pages, the e-KYC index, the vault's identity-check page, the vault index whose callout this change falsifies, and the case-lifecycle page whose signing sequence still records identity only in the shop
- [ ] 13.5 Add the `::journeys` and `::cases` embeds to the three new capability pages, so the suites show where a reader can reach them
- [ ] 13.6 Verify: `pnpm run tcs:validate`, `pnpm run check:manual`, `pnpm run archive:preflight`
