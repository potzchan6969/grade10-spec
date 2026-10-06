# Tasks

Groups 1 to 3 ship code and need nothing enrolled. Groups 5 and 6 are
enrolment, run by Operations, Design and Engineering in the order the page's
Setting Up lists - each step needs the one above it. Group 4 needs group 6's
push test, group 7 every secret from groups 5 and 6 set in the real
deployment, and group 8 groups 1, 2 and 7.

## 1. Operator ending (grade10) (owner: @ecchochan)

- [x] 1.1 End one wallet's pass from the member's record under `store:write`, recorded in the audit trail with the operator, the member, the wallet and the time `grade10-site-store-wallet-member-card-SC-38`
- [x] 1.2 Verify: `pnpm run typecheck`, `pnpm run test:backend`
- [ ] 1.3 Link the shipped operator-ending tests to their scenarios with the trace CLI: in `posGateway.ts` the refusal, the held wallets, the nothing-held answer and the other wallet left alone; in `MembersPage.test.tsx` the record that offers no ending without `store:write`, asserting it names no wallet either, and the unreadable wallet that is never called empty; then flip the cases they decide with `pnpm run tcs:automated <case…> --decided-by grade10:<test file>` `grade10-site-store-wallet-member-card-SC-40`, `grade10-site-store-wallet-member-card-SC-41`, `grade10-site-store-wallet-member-card-SC-42`, `grade10-site-store-wallet-member-card-SC-43`, `grade10-site-store-wallet-member-card-SC-45`

## 2. Nothing-held answer, audit outcome and read grant (grade10)

- [ ] 2.1 Tests, in their own commit: in `MembersPage.test.tsx`, an ending the server answers `nothingHeld` shows `No live Apple Wallet pass was held, so nothing was ended.` and keeps it once the re-read empties the list, and a declined confirmation calls no ending and keeps the wallet named; in `posGateway.ts`, the audit entry names the member as its `user` subject and carries `outcome: "ended"` for an ending and `outcome: "nothingHeld"` for nothing held, an ending writes no `member_notices` row, an operator ends the pass on their own member record, and a `support` operator reading the member's wallets is refused as forbidden `grade10-site-store-wallet-member-card-SC-38`, `grade10-site-store-wallet-member-card-SC-41`, `grade10-site-store-wallet-member-card-SC-42`, `grade10-site-store-wallet-member-card-SC-44`, `grade10-site-store-wallet-member-card-SC-49`
- [ ] 2.2 Return `nothingHeld` from `useWalletPasses`, read from the ending mutation's last answer and the wallet it named, and draw it in `MemberWalletCard` above whichever state it shows, its words in `copy.ts` `grade10-site-store-wallet-member-card-SC-42`
- [ ] 2.3 Declare `auditDetails` and `auditSubject` on `storeAdmin.wallet.endPass` over the decoded input: the wallet and the answer's `outcome`, and the member as a `user` subject `grade10-site-store-wallet-member-card-SC-38`, `grade10-site-store-wallet-member-card-SC-42`
- [ ] 2.4 Raise `storeAdmin.wallet.passes` from `store:read` to `store:write` `grade10-site-store-wallet-member-card-SC-41`
- [ ] 2.5 Link 2.1's tests to their scenarios with the trace CLI, then flip the cases they decide with `pnpm run tcs:automated <case…> --decided-by grade10:<test file>`: in `posGateway.ts` the nothing-held answer for a wallet never added with its audit outcome, and the `support` operator's refused read `grade10-site-store-wallet-member-card-SC-41`, `grade10-site-store-wallet-member-card-SC-42`
- [ ] 2.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `pnpm --filter @grade10/admin test`, `pnpm --filter @grade10/store-admin-frontend test`

## 3. Launch check (grade10)

- [ ] 3.1 Tests, in their own commit: `expectedSecretNames` in `packages/utils/test/config.test.ts`; `readDeclaration` accepting `expectedIn` beside `optional` and refusing it without `optional` or naming an environment `DEPLOYED_ENVS` does not; `walletPassSecrets` expecting each secret only where its issuer is recorded, `WALLET_APPLE_APNS_KEY` only where the Apple issuer records an APNs key id, and nothing for ZZZ, in the store backend's tests; a new `scripts/secrets/status.test.mjs` where `buildStatus` and `missingRequired` report an expected secret unset as missing, naming it, and leave an unexpected one absent `grade10-site-store-wallet-member-card-SC-46`, `grade10-site-store-wallet-member-card-SC-47`, `grade10-site-store-wallet-member-card-SC-48`
- [ ] 3.2 Add `expectedIn` to `SecretDeclaration` and `expectedSecretNames` beside `requiredSecretNames`; pass the environment to `buildStatus` and read `required` through it; accept and validate the key in `readDeclaration`; delete the unused `requiredNames` from `registry.mjs`; `missingSecrets` keeps reading `optional` `grade10-site-store-wallet-member-card-SC-46`, `grade10-site-store-wallet-member-card-SC-47`
- [ ] 3.3 Replace `WALLET_PASS_SECRETS` with `walletPassSecrets(brand)`, deriving `expectedIn` from `walletIssuer` and `applePassIssuer`, and spread it in each brand's store `src/secrets.ts` `grade10-site-store-wallet-member-card-SC-46`, `grade10-site-store-wallet-member-card-SC-47`, `grade10-site-store-wallet-member-card-SC-48`
- [ ] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `node --test scripts/secrets/*.test.mjs scripts/secrets.test.mjs`, and `pnpm run secrets --check --env=staging` exits 0 with every issuer still null `grade10-site-store-wallet-member-card-SC-47`

## 4. Manual page (grade10-spec)

- [ ] 4.1 After 6.10, replace Apple step 9's two open points in `docs/prds/products/grade10-site/loyalty/wallet-member-card.md` with the push credential and push header the device test settled, and the counter that tells a wrong one
- [ ] 4.2 Verify: `pnpm check:manual`

## 5. Google issuer enrolment (grade10)

- [ ] 5.1 Operations - Create the issuer account in the Google Pay & Wallet Console, in Demo Mode
- [ ] 5.2 Operations - Complete the Business Profile and the payments profile
- [ ] 5.3 Operations - Request publishing access
- [ ] 5.4 Design - Give the class its artwork and words - the programme's logo, the issuer's name, the programme's name, one background colour
- [ ] 5.5 Operations - Create the class and carry it from draft through review to approved
- [ ] 5.6 Engineering - Create the service account, grant it the wallet issuer scope, and take its key as unencrypted PKCS#8
- [ ] 5.7 Engineering - Set `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` and `WALLET_PASS_KEY` with `pnpm run secrets`
- [ ] 5.8 Engineering - Record the issuer, the class and the service account in `packages/app-env` for staging and production, in a commit after 5.7
- [ ] 5.9 Verify: `pnpm run secrets --check` on staging and production exits 0, and the staging membership page offers Google Wallet

## 6. Apple enrolment (grade10)

- [ ] 6.1 Operations - Enrol in the Apple Developer Program in the organisation's name
- [ ] 6.2 Operations - Name the account's owner by role, not by person
- [ ] 6.3 Operations - Register two pass type identifiers, staging and production
- [ ] 6.4 Design - Give the pass its artwork and words - the icon and logo at every scale, the programme's name, the background and label colours
- [ ] 6.5 Design - Download Apple's "Add to Apple Wallet" badge from the developer site under the Wallet Marketing Agreement, licensed only while the organisation is an Apple Developer Program member; whether the save action draws it waits on `decisions.md` Q12
- [ ] 6.6 Engineering - Fix the pass web service's hostname before the first pass exists
- [ ] 6.7 Engineering - Take the certificate and its key, converting the key to unencrypted PKCS#8, and keep both where they can be retrieved
- [ ] 6.8 Engineering - Create the APNs key for the same team, scoped to the pass type identifier, and record its key id
- [ ] 6.9 Engineering - Set `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_APPLE_APNS_KEY` and `WALLET_PASS_AUTH_KEY` with `pnpm run secrets`, and `WALLET_PASS_KEY` only where 5.7 has not already set it, never a new value once a pass exists; then, in a commit after them, record the pass type identifier, the team id, the APNs key id and the organisation name in `packages/app-env`
- [ ] 6.10 Engineering - Name the enrolled iPhone's holder by role and where it lives, then push to it three ways - as shipped, with the push header omitted, and over the certificate - and record which produces a list request; where it is not the shipped default, change `applePush.ts` in a `fix` commit with its regression test
- [ ] 6.11 Verify: `pnpm run secrets --check` on staging and production exits 0, and the staging membership page offers Apple Wallet

## 7. Launch (grade10)

- [ ] 7.1 Run `pnpm run secrets --check` against every deployed store worker, once groups 5 and 6 are done
- [ ] 7.2 Verify: a member saves a pass on each wallet in staging and is identified by it at the counter, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm check:manual`

## 8. The walk (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review launch-wallet-passes`), and `/tcs-run-sheet` executes manual cases when needed.

- [ ] 8.1 Add `POST /dev/wallet-pass` behind `devOnly`, issuing one live pass for `{ userId, platform }` through `issuePass` with the worker's own POS deps, with its route test; lend the store worker a fresh `WALLET_PASS_KEY` in `scripts/e2e/start-isolated.sh` with `lend_var`
- [ ] 8.2 Walk US-09 in `apps/frontend/grade10/e2e/tests/admin/wallet-pass-ending.spec.ts` on the local stack: a member with a pass in each wallet, an admin declines one ending and the wallet stays, then ends it and confirms, that wallet leaves the list and the other stays, the store's audit chain the Audit console reads names the operator, the member, the wallet, the time and that a pass was ended, and a support operator's record offers neither the wallets nor the ending (`grade10-site-store-wallet-member-card-US-09`)
- [ ] 8.3 Walk US-09 and `grade10-site-store-wallet-member-card-US6-TC1-1` in staging by hand, once group 7 is done: save a pass on each wallet on a real phone, end one from the member's record, and see the counter no longer identify the member by it; record the walk in the change's `rounds.md` row
- [ ] 8.4 Flip the cases 8.2 decides with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/admin/wallet-pass-ending.spec.ts`, in the walk's own commit; name the cases left manual in the walk's `rounds.md` row
- [ ] 8.5 Verify: `pnpm run test:e2e -- e2e/tests/admin/wallet-pass-ending.spec.ts`, `pnpm run trace -- validate --app-root <grade10>`
