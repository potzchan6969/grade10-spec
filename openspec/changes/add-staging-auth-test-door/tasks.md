## 1. Sign-In Tests page (grade10-spec)

- [x] 1.1 Fill the page's code map with the test endpoint's module, its environment predicate, and the name of the tester-domain secret, replacing the two placeholder links — the code map names the test endpoint, `testDoorMoves`, the access check, the testers in `@grade10/auth-contracts` and the lane; no tester-domain secret ships (decisions Q40)
- [x] 1.2 Verify: `pnpm check:manual`

## 2. The test endpoint and its lock (grade10)

- [x] 2.1 Add `allowsStagingTestDoor` and mount `/test/*` on the auth worker so it answers on staging and is refused on preview and production, with `/dev` on staging still refused (`shared-auth-test-sign-in-SC-23`, `shared-auth-test-sign-in-SC-24`, `shared-auth-test-sign-in-SC-25`) — shipped as `testDoorMoves` in `@grade10/utils/env`, opening staging and uat, and production for capture and clear (decisions Q41)
- [x] 2.2 Verify a GitHub Actions OIDC token on every `/test/*` call against the whole claim set — this repository by id, this audience, the test endpoint's own `job_workflow_ref`, `ref` on main, and a `workflow_dispatch` in the reviewed environment — refusing every other caller (`shared-auth-test-sign-in-SC-01`, `shared-auth-test-sign-in-SC-02`, `shared-auth-test-sign-in-SC-03`, `shared-auth-test-sign-in-SC-04`, `shared-auth-test-sign-in-SC-05`, `shared-auth-test-sign-in-SC-32`)
- [x] 2.3 Match the named address against `TEST_DOOR_TESTER_DOMAIN`, declared optional in the auth app's secrets: the part after the last `@` equal to it and nothing more, read without regard to case, with a plus tag keeping two addresses apart and an unset domain refusing every address (`shared-auth-test-sign-in-SC-06`, `shared-auth-test-sign-in-SC-07`, `shared-auth-test-sign-in-SC-30`, `shared-auth-test-sign-in-SC-31`, `shared-auth-test-sign-in-SC-34`) — shipped as the named testers and their unique plus-tags (decisions Q40); there is no `TEST_DOOR_TESTER_DOMAIN`
- [x] 2.4 Refuse an action that names no address, on every action including clear (`shared-auth-test-sign-in-SC-08`)
- [x] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`
- [ ] 2.6 Refuse the QA token for the admin-only tester on every action, with the same silent refusal as any wrong caller (`shared-auth-test-sign-in-SC-97`) — not shipped: `qaTokenTestDoorMoves` accepts the token for any tester on staging (decisions Q43)
- [ ] 2.7 Record the test endpoint's bans, grants, scoped roles and created accounts on the identity trail, naming the caller's kind in place of a user id, and no entry for capture, expire or clear (`shared-auth-audit-SC-38`, `shared-auth-audit-SC-39`) — not shipped: `testDoor.ts` writes no audit entry (decisions Q45)
- [ ] 2.8 Verify the QA token is refused off staging on uat, preview and production (`shared-auth-test-sign-in-SC-98`) — shipped as `qaTokenTestDoorMoves` returning no actions outside staging (decisions Q44); confirm with `pnpm run test:backend`

## 3. The five actions (grade10)

Needs group 2 landed: every task here sits behind that gate and cannot be verified without it.

- [x] 3.1 Record the sign-in outbox on staging for an address under the tester domain, leaving every other address and every other environment as they are, with a tester row held fifteen minutes so it outlives the five-minute link, and without skipping or replacing the ordinary send (`shared-auth-test-sign-in-SC-11`, `shared-auth-test-sign-in-SC-29`)
- [x] 3.2 Capture the named address's last sign-in mail, returning the later of two sends, the same row on a second capture, a mail whose link has been followed, none when there is none, and never another address's (`shared-auth-test-sign-in-SC-12`, `shared-auth-test-sign-in-SC-13`, `shared-auth-test-sign-in-SC-14`, `shared-auth-test-sign-in-SC-15`)
- [x] 3.3 Expire the named address's unused link past its five-minute lifetime, leaving a used link unchanged and expiring none when there is none, and leaving the lifetime `shared/auth/sign-in` sets where it is (`shared-auth-test-sign-in-SC-16`, `shared-auth-test-sign-in-SC-17`, `shared-auth-test-sign-in-SC-18`)
- [x] 3.4 Ban the named address, creating its account when it has never signed in, so its follow is refused the way a banned follow is (`shared-auth-test-sign-in-SC-09`, `shared-auth-test-sign-in-SC-19`)
- [x] 3.5 Grant the named address to hold `admin`, creating its account when it has never signed in, so the session a later follow creates holds the role (`shared-auth-test-sign-in-SC-10`, `shared-auth-test-sign-in-SC-20`) — with a sixth action, a scoped role on a generated collector plus-tag (decisions Q42)
- [x] 3.6 Clear the sign-in limits for the named address and for the caller — the wait between two mails and the count a caller may ask for — leaving another address's wait and another caller's count standing (`shared-auth-test-sign-in-SC-21`, `shared-auth-test-sign-in-SC-22`, `shared-auth-test-sign-in-SC-33`)
- [x] 3.7 Hold the test endpoint to those five actions: no unban, no session generate, no store or auction seed, and no route to enable later (`shared-auth-test-sign-in-SC-26`, `shared-auth-test-sign-in-SC-27`, `shared-auth-test-sign-in-SC-28`) — six actions, per decisions Q42
- [x] 3.8 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`

## 4. The staging E2E lane (grade10)

Needs groups 2 and 3 landed for a green staging run; the seam and the local lane can be built and verified before them.

- [x] 4.1 Put the five actions behind one endpoint seam in `e2e/helpers/auth.ts`, with the `/dev` implementation behind it, so `tests/auth/**` reads the seam and the specs themselves are unedited
- [x] 4.2 Add the `/test` implementation of that seam, normalising its answers to the `/dev` shape and refusing to run against any base URL that is not the staging gateway
- [x] 4.3 Generate `freshEmail()` under the tester domain when the target is staging, and clear the sign-in limits before each spec so the suite is not held as an attacker (`shared-auth-test-sign-in-SC-06`, `shared-auth-test-sign-in-SC-21`)
- [x] 4.4 Add a `staging-auth` Playwright project running `tests/auth/**` against the staging hosts, carrying the Cloudflare Access service token the gated apex needs, and prove the acceptance signal end to end: capture a tester's link and follow it into a session (`shared-auth-test-sign-in-SC-12`) — `e2e/playwright.staging.config.ts`, beside `uat` and `production` configs; the staging run itself needs a reviewed dispatch
- [x] 4.5 Add the staging auth workflow — `workflow_dispatch` only, in a GitHub Environment a reviewer must approve, requesting an OIDC token for the test endpoint's audience with `id-token: write` in a workflow that checks out no pull-request code (`shared-auth-test-sign-in-SC-01`, `shared-auth-test-sign-in-SC-04`) — `.github/workflows/e2e-hosted.yml`, one workflow for staging, uat and production
- [ ] 4.6 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:e2e` — blocked: `test:e2e` runs on the isolated stack, which needs Docker; the test endpoint's backend, worker and seam tests pass

## 5. The architecture record (grade10)

- [x] 5.1 Qualify `docs/architecture/security.md` — dev endpoints still stop at the laptop, and this is the one staging endpoint, with the access check that earns it
- [x] 5.2 Qualify `docs/architecture/e2e.md` — the local lane is unchanged, and name the staging lane beside it with what it may and may not seed
- [x] 5.3 Verify: `pnpm run lint`
