# Tasks

Group 1 ships code. Groups 2 and 3 are enrolment, run by Operations, Design
and Engineering in the order each lists — each step needs the one above it.
Group 4 needs every secret from groups 2 and 3 set in the real deployment.

## 1. Operator ending (grade10) (owner: @ecchochan)

- [ ] 1.1 End a pass from the operator console under the permission an elevated act requires, recorded in the operator log and refused rather than hidden without it, so *An operator ends a pass under the permission it requires* passes
- [ ] 1.2 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 2. Google issuer enrolment (operations)

- [ ] 2.1 Create the issuer account in the Google Pay & Wallet Console, in Demo Mode
- [ ] 2.2 Complete the Business Profile and the payments profile
- [ ] 2.3 Request publishing access
- [ ] 2.4 Give the class its artwork and words — the programme's logo, the issuer's name, the programme's name, one background colour
- [ ] 2.5 Create the class and carry it from draft through review to approved
- [ ] 2.6 Create the service account, grant it the wallet issuer scope, and take its key as unencrypted PKCS#8
- [ ] 2.7 Set `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` and `WALLET_PASS_KEY` with `pnpm run secrets`
- [ ] 2.8 Record the issuer, the class and the service account in `packages/app-env`

## 3. Apple enrolment (operations)

- [ ] 3.1 Enrol in the Apple Developer Program in the organisation's name
- [ ] 3.2 Name the account's owner by role, not by person
- [ ] 3.3 Register two pass type identifiers, staging and production
- [ ] 3.4 Give the pass its artwork and words — the icon and logo at every scale, the programme's name, the background and label colours
- [ ] 3.5 Draw Apple's own save badge, licensed only while the organisation is an Apple Developer Program member and downloaded from the developer site under the Wallet Marketing Agreement
- [ ] 3.6 Fix the pass web service's hostname before the first pass exists
- [ ] 3.7 Take the certificate and its key, converting the key to unencrypted PKCS#8, and keep both where they can be retrieved
- [ ] 3.8 Create the APNs key for the same team, scoped to the pass type identifier, and record its key id
- [ ] 3.9 Set `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_APPLE_APNS_KEY`, `WALLET_PASS_AUTH_KEY` and `WALLET_PASS_KEY` with `pnpm run secrets`, then record the pass type identifier, the team id, the APNs key id and the organisation name in `packages/app-env`
- [ ] 3.10 Push to the one enrolled iPhone three ways — as shipped, with the push header omitted, and over the certificate — and record which produces a list request, settling the push credential and the push type a pass push takes

## 4. Launch checks (grade10)

- [ ] 4.1 Run `pnpm run secrets --check` against the deployed workers, once every secret above is set
- [ ] 4.2 Verify: a member saves a pass on each wallet in staging, an operator ends one from the console, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm check:manual`
