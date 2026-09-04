# Tasks

Group 1 lands in **grade10-spec** and the submodule bump is the boundary:
group 11 cannot start until it has shipped. Group 2 is the shared interface
every other group reads; once it lands, groups 3 to 10 are claimable in
parallel except where a heading says otherwise.

Design decisions, the data model and the service contracts:
[`tech-design.md`](tech-design.md). Screens and component exports:
`ui-design.md`, written by group 1.

The counter path stays open throughout. Nothing here is behind a switch: with
no provider configured, no check is raised, every case reads `None`, and the
counter is what it is today.

## 1. Screens and blocks (grade10-spec)

- [ ] 1.1 Draw the collector's verification page — its state per check state, and what a declined collector is shown — and link the frames from `ui-design.md`
- [ ] 1.2 Draw the case screen's identity panel: the six states, who performed a bound check, and the override beside a decline
- [ ] 1.3 Name the `@grade10/design-system` and `@grade10/ui` exports both surfaces compose, and flag any variant or token that does not exist yet as work in this group
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:stories:ui`, `pnpm run design-sync:check`

## 2. Identity check contracts (grade10)

- [ ] 2.1 Add `hosted` to `KYC_PROVIDER_KINDS`, and declare the closed finding vocabulary — what a provider checks, and what an outcome may be
- [ ] 2.2 Declare the check's eight states and `KycCheckView` in `@grade10/e-kyc-contracts` — state, instants, decline reason and override, and no identity field, no secret, no vendor name
- [ ] 2.3 Declare the new `KycServiceApi` methods and their outcomes: `raiseCheck`, `checkForCase`, `checkByProviderRef`, `dueChecks`, `settleCheck`, `withdrawCheck`, `openInvitation`, `startCheck`
- [ ] 2.4 Add `admin.recordKycOverride` (`vault:approve`) and `admin.caseIdentity` (`kyc:read`) to `ADMIN_PERMISSIONS`, and the two identity routes to `VAULT_PATHS`
- [ ] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The check's tables (grade10)

- [ ] 3.1 Add `ekyc.kyc_checks` to the table factory with its state check constraint, the decided/verification/override constraints, and the `user_id` index
- [ ] 3.2 Add the two partial unique indexes — one live check per case, and one row per provider reference — so *Asking twice does not invite twice* and *A repeated verdict is applied once* have a constraint behind them rather than a read
- [ ] 3.3 Add `ekyc.kyc_provider_redactions` with its backoff column and due index
- [ ] 3.4 Add `provider_findings` to `kyc_verifications`, nullable, so *The provider's findings survive the provider* has somewhere to land
- [ ] 3.5 Generate the migration and commit it
- [ ] 3.6 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run test:backend`

## 4. The provider port and its adapter (grade10)

- [ ] 4.1 Declare the provider port beside `KycStorePort` — raise, read, hosted URL, fetch document, redact — and a fake in `testing/fakes` that every later group tests against
- [ ] 4.2 Write the adapter, and map each finding to Grade10's own closed set so *The provider's findings survive the provider* passes with the provider unreachable
- [ ] 4.3 Read the configured erasure window back at startup and fault on one that is absent or longer than the stated window, so *A provider's window is checked, not assumed* passes
- [ ] 4.4 Declare the provider secret in the worker's `src/secrets.ts` and its non-secret settings in `packages/app-env`
- [ ] 4.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 5. Raising, withdrawing and expiring a check (grade10)

- [ ] 5.1 Raise a check by inserting it live, calling the provider with the row's own id, then recording the reference — and answer a second, concurrent ask with the live check, so *Asking twice does not invite twice* passes
- [ ] 5.2 Complete a raise whose provider call never returned, from the settle work list, so no invitation names a check the provider does not hold
- [ ] 5.3 Withdraw the live check and free the case, so *A withdrawn check frees the case to be invited again* passes
- [ ] 5.4 Leave a decided check where it is and issue a new one when asked again, so *A decided check does not move again* passes
- [ ] 5.5 Expire an unopened invitation and an unfinished check on their own windows, so *An unopened invitation expires* and *An abandoned check expires rather than waiting forever* pass
- [ ] 5.6 Verify: `pnpm run test:backend`

## 6. The collector's invitation, on the vault worker (grade10)

- [ ] 6.1 Mint the invitation as 256 base64url bits carried in a fragment, store only its digest, and return it once, so *An invitation opens the check it names* and *The invitation's secret is left nowhere it can be read* pass
- [ ] 6.2 Bind the check to the first device that opens it and refuse a second, so *A second device cannot continue an invitation* passes
- [ ] 6.3 Answer the state and the next step and nothing else, so *A completed invitation does not open again* and *A declined collector is told what to do next* pass
- [ ] 6.4 Refuse an invitation past its life and say how to be invited again, so *An expired invitation is refused* passes
- [ ] 6.5 Hand a started check back to the provider where the collector left it, so *A collector returning mid-check is shown where they are* passes, and ask for nothing the provider collects, so *Grade10 asks for nothing the provider collects* passes
- [ ] 6.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. The verdict and the settle (grade10)

Needs group 4's port and group 5's raise. Nothing here reads a delivery's body
as fact: the callback marks a check due and the settle asks the provider.

- [ ] 7.1 Prove the callback's signature and its environment, and count an unproven one without writing anything, so *An unproven verdict changes nothing and is not recorded* passes
- [ ] 7.2 Record a proven verdict naming no check Grade10 raised as rejected, so *A verdict for a check nobody raised changes nothing* passes
- [ ] 7.3 Settle by reading the check back from the provider, and apply Grade10's own two refusals on the caller's clock, so *An approved verdict for a minor is Declined*, *An approved verdict on an expired document is Declined* and *A provider's approval of a minor is still refused* pass
- [ ] 7.4 Fetch one document image into the evidence store before the identity exists, fetch no face capture, and decline rather than retry an image the store may not hold — so *A provider verdict whose image cannot be fetched creates nothing*, *An image the evidence store may not hold declines rather than retries* and *No face capture is stored* pass
- [ ] 7.5 Insert the verification, bind it and approve the check in one transaction, so *A repeated verdict is applied once* and *A read never answers before the evidence is stored* pass
- [ ] 7.6 Bind nothing for a check that is no longer the case's live check, so *A verdict for a check that is no longer the case's live check binds nothing* passes
- [ ] 7.7 Record a provider check with its provider, its reference and who asked, so *A provider check names the provider, its reference, and who asked* passes
- [ ] 7.8 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 8. The case's side (grade10)

Needs group 7's settle. Every refusal here runs inside the case lock
`recordCaseKyc` already takes — this group adds a second caller, not a second
write path.

- [ ] 8.1 Reuse the collector's most recent verified identity when a visit is booked, and invite only a case with nothing to reuse, so *A collector already verified is not asked again* and *Booking an intake visit invites the collector* pass
- [ ] 8.2 Report a case holding neither an email address nor a mobile number instead of leaving it looking unanswered, so *A case with no contact details is reported, not left silently unchecked* passes
- [ ] 8.3 Let an operator holding `vault:operate` ask for a check on a pre-custody case, so *An operator asks for a check on a case that needs one* passes
- [ ] 8.4 Add the invitation's notification kind and its copy to the vault's catalogue
- [ ] 8.5 Settle a landed verdict through the existing `bindToCase`, so *Binding a verdict voids an outstanding packet*, *The displaced identity is settled*, *A verdict landing after custody begins is refused*, *A verdict landing on sealed evidence is refused*, *A verdict landing on an erased case is refused*, *A verdict landing on a case verified elsewhere is refused* and *A refused landing leaves no half-finished state* pass
- [ ] 8.6 Carry the check's state and who performed a bound check on the case detail, and answer the record itself only to `kyc:read`, so *A case with a check out is not shown as unverified, and nothing waits on it*, *A verified case names who performed the check* and *A case's identity state is readable, its details are not* pass
- [ ] 8.7 Withdraw a live hosted check when staff record one at the counter, so *Staff record a check while a hosted one is live* passes, and keep the counter reachable with the provider down, so *A provider outage does not stop a visit* passes
- [ ] 8.8 Require `vault:approve` and a reason for a counter check over a decline, and show it beside the declined check, so *A counter check after a decline is recorded as an override* and *An override of a refused check takes `vault:approve`* pass
- [ ] 8.9 Walk the whole path on a seeded case — booked, invited, walked, decided, bound before the visit — so *A collector completes the check before arriving* passes
- [ ] 8.10 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 9. Stalls and erasure (grade10)

- [ ] 9.1 Move a check the provider has not decided within the usual time to stalled, show it as stalled rather than as arriving, and settle it from what the provider says, so *A check the provider never decides is stalled rather than lost* passes
- [ ] 9.2 Queue a provider redaction in the same transaction that purges a verification, on release and on discard alike, so *The last release purges the record and commands the provider* and *A check that never became an identity is still commanded away* pass
- [ ] 9.3 Drain the outbox on its own backoff and never let it hold up a local purge, so *A provider that cannot be reached does not hold up the erasure* passes
- [ ] 9.4 Report a provider that refuses a redaction rather than dropping it, so *A provider that refuses is reported rather than dropped* passes
- [ ] 9.5 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 10. Pin the behaviour the deltas write down for the first time (grade10)

Most of `grade10-site/e-kyc/identity-record` describes the counter path as it
already ships; the change is the first time it is written down. Each task adds
the test that turns an assertion into evidence, and touches product code only
where one of them turns out not to hold.

- [ ] 10.1 Pin a counter record's provenance and its mask, so *A staff check names the staff member who made it*, *A recorded check answers with a mask* and *The same document is recognisable across two records* pass
- [ ] 10.2 Pin reuse across consumers and the scoping that survives it, so *A second consumer reads a check the first recorded*, *A consumer cannot reach another consumer's case binding*, *Re-recording a case replaces its identity* and *A repeated bind converges on one binding* pass
- [ ] 10.3 Pin the two refusals on both the record and the reuse path, so *A person under 18 is refused*, *A document that expired before today is refused*, *A document valid on its last day is accepted* and *An aged record is refused on reuse* pass
- [ ] 10.4 Pin what a release does and does not purge, so *The evidence is reachable only through the case that holds it*, *A record another case still binds survives a release* and *A release repeats without error* pass
- [ ] 10.5 Pin the vault's document gate, so *Preparing documents without an identity is refused*, *A packet whose identity moved cannot be sealed* and *A prepared document carries the bound identity's name* pass
- [ ] 10.6 Pin the counter at the case, so *Staff verify a collector who arrives unverified* and *A counter check is refused once the item is in custody* pass
- [ ] 10.7 Verify: `pnpm run test:backend`

## 11. The collector's page and the case panel (grade10)

Needs group 1's submodule bump and group 6's routes.

- [ ] 11.1 Add the SPA route the invitation opens, reading the secret from the fragment and never putting it in a request path
- [ ] 11.2 Render each check state and its next step from `ui-design.md`, showing no identity field and no refusal reason
- [ ] 11.3 Add the identity panel to the admin case screen — the state, who performed a bound check, the document image behind `kyc:read`, and the override control for whoever holds `vault:approve`
- [ ] 11.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:admin-bundle`, `pnpm run build`

## 12. Archive hand-off (grade10-spec)

Runs after the change is deployed, not when it merges.

- [ ] 12.1 Copy each delta's `## Feature set` into its durable capability — the fold carries `## Requirements` and nothing else
- [ ] 12.2 Copy each capability's `user-journeys.md` into `openspec/specs/`, including identity-record's `**Walked by:** nobody`
- [ ] 12.3 Carry the two approved `test-cases.md` across to their durable capabilities
- [ ] 12.4 Bring the four manual pages to the shipped story — the two e-KYC capability pages, the vault's identity-check page, and the e-KYC index
- [ ] 12.5 Verify: `pnpm run tcs:validate`, `pnpm run check:manual`, `pnpm run archive:preflight`
