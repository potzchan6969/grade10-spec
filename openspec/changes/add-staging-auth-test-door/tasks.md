## 1. Sign-In Tests page (grade10-spec)

- [ ] 1.1 Fill the page's code map with the door's module, its environment predicate, and the name of the tester-domain secret, replacing the two placeholder links
- [ ] 1.2 Verify: `pnpm check:manual`

## 2. The door and its lock (grade10)

- [ ] 2.1 Add `allowsStagingTestDoor` and mount `/test/*` on the auth worker so it answers on staging and is refused on preview and production, with `/dev` on staging still refused (`shared-auth-test-sign-in-SC-23`, `shared-auth-test-sign-in-SC-24`, `shared-auth-test-sign-in-SC-25`)
- [ ] 2.2 Verify a GitHub Actions OIDC token on every `/test/*` call against the whole claim set — this repository by id, this audience, the door's own `job_workflow_ref`, `ref` on main, and a `workflow_dispatch` in the reviewed environment — refusing every other caller (`shared-auth-test-sign-in-SC-01`, `shared-auth-test-sign-in-SC-02`, `shared-auth-test-sign-in-SC-03`, `shared-auth-test-sign-in-SC-04`, `shared-auth-test-sign-in-SC-05`, `shared-auth-test-sign-in-SC-32`)
- [ ] 2.3 Match the named address against `TEST_DOOR_TESTER_DOMAIN`, declared optional in the auth app's secrets: the part after the last `@` equal to it and nothing more, read without regard to case, with a plus tag keeping two addresses apart and an unset domain refusing every address (`shared-auth-test-sign-in-SC-06`, `shared-auth-test-sign-in-SC-07`, `shared-auth-test-sign-in-SC-30`, `shared-auth-test-sign-in-SC-31`, `shared-auth-test-sign-in-SC-34`)
- [ ] 2.4 Refuse a move that names no address, on every move including clear (`shared-auth-test-sign-in-SC-08`)
- [ ] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`

## 3. The five moves (grade10)

Needs group 2 landed: every task here sits behind that gate and cannot be verified without it.

- [ ] 3.1 Record the sign-in outbox on staging for an address under the tester domain, leaving every other address and every other environment as they are, with a tester row held fifteen minutes so it outlives the five-minute link, and without skipping or replacing the ordinary send (`shared-auth-test-sign-in-SC-11`, `shared-auth-test-sign-in-SC-29`)
- [ ] 3.2 Capture the named address's last sign-in mail, returning the later of two sends, the same row on a second capture, a mail whose link has been followed, none when there is none, and never another address's (`shared-auth-test-sign-in-SC-12`, `shared-auth-test-sign-in-SC-13`, `shared-auth-test-sign-in-SC-14`, `shared-auth-test-sign-in-SC-15`)
- [ ] 3.3 Age the named address's unused link past its five-minute lifetime, leaving a used link unchanged and ageing none when there is none, and leaving the lifetime `shared/auth/sign-in` sets where it is (`shared-auth-test-sign-in-SC-16`, `shared-auth-test-sign-in-SC-17`, `shared-auth-test-sign-in-SC-18`)
- [ ] 3.4 Ban the named address, creating its account when it has never signed in, so its follow is refused the way a banned follow is (`shared-auth-test-sign-in-SC-09`, `shared-auth-test-sign-in-SC-19`)
- [ ] 3.5 Prepare the named address to hold `admin`, creating its account when it has never signed in, so the session a later follow creates holds the role (`shared-auth-test-sign-in-SC-10`, `shared-auth-test-sign-in-SC-20`)
- [ ] 3.6 Clear the sign-in limits for the named address and for the caller — the wait between two mails and the count a caller may ask for — leaving another address's wait and another caller's count standing (`shared-auth-test-sign-in-SC-21`, `shared-auth-test-sign-in-SC-22`, `shared-auth-test-sign-in-SC-33`)
- [ ] 3.7 Hold the door to those five moves: no unban, no session mint, no store or auction seed, and no route to enable later (`shared-auth-test-sign-in-SC-26`, `shared-auth-test-sign-in-SC-27`, `shared-auth-test-sign-in-SC-28`)
- [ ] 3.8 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`

## 4. The staging E2E lane (grade10)

Needs groups 2 and 3 landed for a green staging run; the seam and the local lane can be built and verified before them.

- [ ] 4.1 Put the five moves behind one door seam in `e2e/helpers/auth.ts`, with the `/dev` implementation behind it, so `tests/auth/**` reads the seam and the specs themselves are unedited
- [ ] 4.2 Add the `/test` implementation of that seam, normalising its answers to the `/dev` shape and refusing to run against any base URL that is not the staging gateway
- [ ] 4.3 Mint `freshEmail()` under the tester domain when the target is staging, and clear the sign-in limits before each spec so the suite is not held as an attacker (`shared-auth-test-sign-in-SC-06`, `shared-auth-test-sign-in-SC-21`)
- [ ] 4.4 Add a `staging-auth` Playwright project running `tests/auth/**` against the staging hosts, carrying the Cloudflare Access service token the gated apex needs, and prove the acceptance signal end to end: capture a tester's link and follow it into a session (`shared-auth-test-sign-in-SC-12`)
- [ ] 4.5 Add the staging auth workflow — `workflow_dispatch` only, in a GitHub Environment a reviewer must approve, requesting an OIDC token for the door's audience with `id-token: write` in a job that checks out no pull-request code (`shared-auth-test-sign-in-SC-01`, `shared-auth-test-sign-in-SC-04`)
- [ ] 4.6 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:e2e`

## 5. The architecture record (grade10)

- [ ] 5.1 Qualify `docs/architecture/security.md` — dev endpoints still stop at the laptop, and this is the one staging door, with the lock that earns it
- [ ] 5.2 Qualify `docs/architecture/e2e.md` — the local lane is unchanged, and name the staging lane beside it with what it may and may not seed
- [ ] 5.3 Verify: `pnpm run lint`
