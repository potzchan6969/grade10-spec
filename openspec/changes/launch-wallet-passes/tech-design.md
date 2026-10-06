## Context

The operator ending is built in grade10 and its backend tests pass. The
console drops the ending's answer, the audit entry carries the input alone,
and no walk drives it. The wallet secrets are each declared `optional`, so
`pnpm run secrets --check` passes on a deployment with no wallet secret set.
Every issuer in `packages/app-env` is null, so no deployment offers a pass.

## Decisions

### Operator Ending Rides the Member's Own Ending

The requirement governs who, which wallet, the record and the refusal. The
shipped shape stays:

- **Read** - `storeAdmin.wallet.passes` (`packages/grade10-store/backend/src/trpc/routers/admin.ts:473`)
  answers `{ offered, held }` from `heldWallets`, the body the member's own
  page reads. It moves from `store:read` to `store:write`, so the API and the
  record hold one rule (Q5): the console is its only reader, and reads it only
  under `store:write`. No role holds `store:read` without `store:write`, so
  no role's refusal tells the two grants apart; a test reads the grant each
  wallet procedure declares in its meta, as
  `packages/loyalty/backend/test/trpc/adminGrants.test.ts` does, and fails
  until the move lands
- **Ending** - `storeAdmin.wallet.endPass` (`admin.ts:501`), `store:write`,
  calls `endLivePasses` with one platform; the ending and the held-wallets
  report are one transaction (`services/wallet/passes.ts:446`), and the
  sweep's expiry arm discharges the vendor's copy as it does for the member's
  own ending. Nothing bars an operator's own record (Q17), and nothing writes
  `member_notices`, the store's only outbox to a member (Q15)
- **Audit** - the elevated ladder records the operator and the time. The
  procedure declares two selectors over the decoded input
  (`operatorWalletPassEndingInputSchema`):
  - `auditDetails: (input, answer) => ({ platform, outcome: answer?.outcome })`,
    so an attempt that ended nothing reads as one (Q16)
  - `auditSubject: (input) => ({ type: "user", id: userId })`, the subject
    type the Audit console already links to the member, as auth's erasure
    entries use it
  - No wallet log of its own
- **Record** - `apps/admin/grade10/src/pages/members/MemberRecord.tsx:165-186`
  mounts `MemberWalletCard` only under `store:write`, and `useWalletPasses`
  reads only then, so an operator without it is offered neither the wallets
  nor the ending. The ending runs from the console's confirm, naming the
  wallet (`MemberRecord.tsx:96-108`); a failed read says the wallets could not
  be read rather than none held, and offers no ending (Q22)
- **Rejected** - `platform: "all"` from the console, which ends a pass nobody
  asked about; a new wallet grant, which nobody holds; keeping the read at
  `store:read`, which answers an operator the wallets the record hides from
  them. Today every role holding `store:read` also holds `store:write`
  (`packages/grade10-auth/contracts/src/schemas.ts:123-155` in grade10), so
  the move changes nobody's access and guards a future role that holds only
  the read

### The Console Says When Nothing Was Held

The requirement's nothing-held answer reaches the API and stops there:
`useWalletPasses` invalidates on success and discards `outcome`, so a race -
the member, a second operator or erasure ending it first - reads as an
ending.

- **Hook** - `useWalletPasses` returns `nothingHeld: WalletPlatformName | null`,
  read from the mutation's own last answer and the wallet it named
  (`endPass.data`, `endPass.variables`). React Query clears both when the next
  ending starts, and the record's `key={userId}` mount clears them per member,
  so no state is added
- **View** - `MemberWalletCard` takes `nothingHeld` and draws the line above
  whichever state it shows, the empty one included, since the re-read that
  follows usually empties the list. It is a `Text tone="secondary"`, the tone
  Console Blocks gives an empty result: the answer is a result, not a refusal
- **Words** - `copy.ts` gains `No live ${name} pass was held, so nothing was
  ended.`
- **Rejected** - a toast, which leaves no line to read back to the member; a
  refusal for `nothingHeld`, which the contract already answers as a result;
  state on the record, which duplicates what the mutation holds

### Expected Secrets Follow the Issuer Record

Q9 and the requirement 'A half-configured wallet says which secret is
missing' govern it: a wallet secret is expected where `packages/app-env`
records that wallet's issuer for the brand and environment.

- **Declaration** - `SecretDeclaration` (`packages/utils/src/config.ts`) gains
  three keys, each valid only beside `optional`, so the worker still serves
  without the secret:
  - `expectedIn?: readonly DeployedEnv[]` - where `--check` reports it missing
  - `unlessBound?: string` - a binding whose presence in the environment
    stands in for it
  - `withRecord?: { name: string; missingIn: readonly DeployedEnv[] }` - a
    committed value the same credential needs, and the environments that do
    not record it
- **Bindings** - `registry.mjs` `target` already reads the environment's
  wrangler block; it adds the names of its `mtls_certificates` bindings to
  the target as `bound`
- **Two predicates** - `expectedSecretNames(declarations, deployEnv, bound)`
  returns the required names plus those expected there whose `unlessBound` is
  not in `bound`; `missingRecordNames(declarations, deployEnv, bound)` returns
  the `withRecord` name of each of those whose `missingIn` holds the
  environment. Both are pure, and the unused `requiredNames` export in
  `registry.mjs` is deleted
- **Status** - `scripts/secrets/status.mjs` `buildStatus(targets, readings,
  deployEnv)` reads `required` through the first, so `missingRequired` and
  `inconsistent` follow without change. Each row gains `unrecorded` from the
  second: `check` fails on it, naming each, and `renderStatus` prints it under
  its worker. The picker never offers it, since a record is committed, not set
- **Words** - a missing secret whose declaration carries `optional` is printed
  with that reason, in `check`'s lines and the picker's hint, since its worker
  still serves; "refuses to serve" stays for a secret without one
- **Derivation** - `WALLET_PASS_SECRETS` becomes `walletPassSecrets(brand)`
  in `packages/grade10-store/backend/src/secrets.ts`, reading `walletIssuer`
  and `applePassIssuer` over `DEPLOYED_ENVS`. `@grade10/app-env` is data with
  no runtime imports, so the file stays a leaf the secrets tool can import:

  | Secret | Expected where |
  | --- | --- |
  | `WALLET_PASS_KEY` | Either issuer is recorded |
  | `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` | `walletIssuer` is recorded |
  | `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_PASS_AUTH_KEY` | `applePassIssuer` is recorded |
  | `WALLET_APPLE_APNS_KEY` | `applePassIssuer` is recorded and the environment binds no `WALLET_APPLE_APNS`; `withRecord` names `applePassIssuer.apnsKeyId`, missing in each environment whose issuer records no `apnsKeyId` |

- **Brands** - each app's `src/secrets.ts` spreads `walletPassSecrets("grade10")`
  or `walletPassSecrets("zzz")`; ZZZ records no issuer, so nothing is expected.
  `WalletPassSecrets` takes its keys from the function's return type
- **Same rule as the worker** - `apnsCredential`
  (`packages/grade10-store/backend/src/services/wallet/applePush.ts:170-185`)
  takes a bound certificate first, then names the missing key, then the
  missing key id, and `configuredWallets`
  (`packages/grade10-store/backend/src/services/wallet/deps.ts:261-262`)
  offers Apple only where it can push; the table holds the check to that rule
- **Validation** - `readDeclaration` (`registry.mjs`) accepts `expectedIn`,
  `unlessBound` and `withRecord` beside `why` and `optional`. It refuses
  `expectedIn` without `optional` or naming an environment `DEPLOYED_ENVS`
  does not, the other two without `expectedIn`, and a `missingIn` environment
  `expectedIn` does not name
- **Runtime guard unchanged** - `missingSecrets` reads `optional` alone, so a
  missing wallet secret never stops the worker serving checkout; the wallet
  port refuses the add by name, as the page states
- **Rejected** - dropping `optional`, which makes every brand and environment
  require Apple secrets; required in the runtime guard, which takes the whole
  store worker down for a wallet secret; a second list in the secrets tool,
  which drifts from the issuer record; expecting the push key only where a key
  id is recorded, which passes a deployment whose worker names the key
  missing and offers no Apple pass; the key id as a secret row, which the
  picker would offer to set

### A Development Door Seeds a Pass for the Walk

No local issuer is recorded, so a member cannot add a pass on the dev stack,
and the walk needs a live one.

- **Door** - `POST /dev/wallet-pass` in
  `packages/grade10-store/backend/src/routes/dev.ts`, behind `devOnly`:
  `{ userId, platform }` issues one live pass through `issuePass` with the
  worker's own POS deps, and answers `{ reference }`. Without
  `WALLET_PASS_KEY`, `issuePass` refuses by name, as on a deployment
- **Key** - `scripts/e2e/start-isolated.sh` lends the store worker a fresh
  `WALLET_PASS_KEY` with `lend_var`, as it lends the POS app secret
- **Read and ending need no issuer** - `heldWallets` and `endLivePasses`
  read the row alone, so the walk drives the shipped code
- **Rejected** - a database insert from the walk, which skips the one-live-pass
  backstop; a local issuer in `app-env`, which makes the sweep call Google;
  the backend suites' `TEST_WALLET_PASS_KEY` in the door, which puts a testing
  key in the worker bundle

### Enrolment Is the Page's Runbook

Q8 governs it: groups 5 and 6 are the page's Setting Up steps in its order,
each with its role. Two of their steps write code:

- **Issuer record** - 5.8 and 6.8 fill `WALLET_ISSUERS` and `APPLE_PASSES` in
  `packages/app-env/src/wallet.ts` for staging and production only, in the
  commit after the secrets are set
- **Push test** - 6.9 records which credential and push header produce a
  list request; where it is not the shipped default, `applePush.ts` changes
  in a `fix` commit with its regression test

## Service Interfaces

- **`storeAdmin.wallet.passes`** - `store:write`; an operator without it is
  refused as forbidden
- **`storeAdmin.wallet.endPass`** - `store:write`; one transaction in
  `endLivePasses`

  ```text
  admin-2: { userId: "member-1", platform: "apple" } → { outcome: "ended" }
    wallet_passes: member-1/apple state ended, ended_at now
    audit: actor admin-2, subject user/member-1, details { platform: "apple", outcome: "ended" }, at now
  admin-2: { userId: "member-1", platform: "google" } → { outcome: "nothingHeld" }   no pass row moves
    audit: actor admin-2, subject user/member-1, details { platform: "google", outcome: "nothingHeld" }
  support-1: { userId: "member-1", platform: "apple" } → FORBIDDEN                   no row moves
  ```

- **`useWalletPasses(userId, enabled)`** - `{ read, unreachable, held,
  nothingHeld, endPass }`
- **`expectedSecretNames(declarations, deployEnv, bound) → string[]`** and
  **`missingRecordNames(declarations, deployEnv, bound) → string[]`** - pure,
  over `walletPassSecrets("grade10")`

  ```text
  only staging's Google issuer recorded
    staging    → [WALLET_GOOGLE_SERVICE_ACCOUNT_KEY, WALLET_PASS_KEY] · records []
    production → []                                                  · records []
  production's Apple issuer recorded with no apnsKeyId
    bound []                  → [WALLET_APPLE_PASS_CERT, WALLET_APPLE_PASS_KEY, WALLET_PASS_AUTH_KEY,
                                 WALLET_PASS_KEY, WALLET_APPLE_APNS_KEY]
                                · records [applePassIssuer.apnsKeyId]
    bound [WALLET_APPLE_APNS] → [WALLET_APPLE_PASS_CERT, WALLET_APPLE_PASS_KEY, WALLET_PASS_AUTH_KEY,
                                 WALLET_PASS_KEY]
                                · records []
  ```

- **`POST /dev/wallet-pass`** - development only

  ```text
  { userId: "member-1", platform: "apple" } → 200 { reference: "9f…" }
  any deployed environment                 → 403
  ```

## Risks / Trade-offs

- [Risk] The issuer is recorded before its secrets → the runbook sets secrets
  first; no save action is drawn until the key is set, and the deploy
  workflow's `--check` step, which runs after promotion, fails that deploy
  by name
- [Risk] A new `WALLET_PASS_KEY` in 6.8 re-issues every pass, since
  nothing re-seals the rows → 6.8 sets it only where 5.7 has not, and
  `--check` reads names, never values
- [Risk] The development door reaches a deployed worker → `devOnly` answers
  403 outside development, as every `/dev/*` route does, and the door carries
  no key of its own

## Migration Plan

1. **Code** - groups 1 to 3 land before enrolment; with every issuer null,
   nothing is expected and `--check` reports no wallet secret missing, as now
2. **Enrolment** - groups 5 and 6 run in the page's order; each issuer record
   is its own commit after its secrets are set, so the deploy that records it
   is the first one `--check` holds to it
3. **Rollback** - set an issuer back to null: the save action is no longer
   drawn and nothing is expected again; saved passes keep their rows
