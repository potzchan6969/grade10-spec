## 1. Sign-In Tests page (grade10-spec)

- [ ] 1.1 Fill the page's code map with the door's module, its environment predicate, and the name of the tester secret, replacing the two placeholder links
- [ ] 1.2 Take the ❓ off Exact addresses once Ops has named them, recording that the list lives in the staging secret and not on the page
- [ ] 1.3 Verify: `pnpm check:manual`

## 2. The door and its lock (grade10)

- [ ] 2.1 Add `allowsStagingTestDoor` and mount `/test/*` on the auth worker so it answers on staging and is refused on preview and production, with `/dev` on staging still refused (`shared-auth-test-sign-in-SC-12`, `shared-auth-test-sign-in-SC-13`)
- [ ] 2.2 Verify a GitHub Actions OIDC token on every `/test/*` call, requiring this repository and this audience, and refuse every other caller (`shared-auth-test-sign-in-SC-01`, `shared-auth-test-sign-in-SC-02`)
- [ ] 2.3 Parse `TEST_DOOR_TESTERS` into the collector, ban-only and admin-only testers, declared optional in the auth app's secrets (`shared-auth-test-sign-in-SC-03`)
- [ ] 2.4 Refuse a move that names no address, an address the list does not hold, or any address while the list is unset (`shared-auth-test-sign-in-SC-04`, `shared-auth-test-sign-in-SC-14`, `shared-auth-test-sign-in-SC-23`)
- [ ] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`

## 3. The four moves (grade10)

Needs group 2 landed: every task here sits behind that gate and cannot be verified without it.

- [ ] 3.1 Record the sign-in outbox on staging for an address on the tester list, leaving every other address and every other environment as they are, with a tester row that outlives the five-minute link (`shared-auth-test-sign-in-SC-05`)
- [ ] 3.2 Capture the named tester's last sign-in mail, returning the later of two sends, the same row on a second capture, a mail whose link has been followed, none when there is none, and never another tester's (`shared-auth-test-sign-in-SC-17`, `shared-auth-test-sign-in-SC-18`, `shared-auth-test-sign-in-SC-19`, `shared-auth-test-sign-in-SC-24`, `shared-auth-test-sign-in-SC-27`)
- [ ] 3.3 Age an allowlisted tester's unused link past its five-minute lifetime, leaving a used link unchanged and ageing none when there is none, without moving the lifetime on ordinary sign-in (`shared-auth-test-sign-in-SC-06`, `shared-auth-test-sign-in-SC-20`, `shared-auth-test-sign-in-SC-21`)
- [ ] 3.4 Ban the ban-only tester so it stays banned and a second ban leaves it banned, refusing a ban of either other tester (`shared-auth-test-sign-in-SC-07`, `shared-auth-test-sign-in-SC-08`, `shared-auth-test-sign-in-SC-26`)
- [ ] 3.5 Prepare the admin-only tester to hold `admin`, creating the row when it does not exist and leaving it holding `admin` when it already does, refusing a prepare of either other tester (`shared-auth-test-sign-in-SC-10`, `shared-auth-test-sign-in-SC-11`, `shared-auth-test-sign-in-SC-25`)
- [ ] 3.6 Hold the door to the four moves — no unban, no session mint, no store or auction seed — and prove no capture returns a session (`shared-auth-test-sign-in-SC-09`, `shared-auth-test-sign-in-SC-15`, `shared-auth-test-sign-in-SC-16`, `shared-auth-test-sign-in-SC-22`)
- [ ] 3.7 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:backend`

## 4. The staging E2E lane (grade10)

Needs groups 2 and 3 landed for a green staging run; the adapter and the local lane can be built and verified before them.

- [ ] 4.1 Put capture, age, ban and prepare behind one door seam in `e2e/helpers/auth.ts`, with the `/dev` implementation behind it and the auth specs unedited
- [ ] 4.2 Add the `/test` implementation, refusing to run against any base URL that is not the staging gateway
- [ ] 4.3 Add a `staging-auth` Playwright project running `tests/auth/**` against the staging hosts, carrying the Cloudflare Access service token the gated apex needs
- [ ] 4.4 Add the staging auth workflow on an `e2e-staging` label and `workflow_dispatch`, requesting an OIDC token for the door's audience with `id-token: write`, under a concurrency group that keeps the three testers to one run
- [ ] 4.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test:e2e`

## 5. The architecture record (grade10)

- [ ] 5.1 Qualify `docs/architecture/security.md` — dev endpoints still stop at the laptop, and this is the one staging door, with the lock that earns it
- [ ] 5.2 Qualify `docs/architecture/e2e.md` — the local lane is unchanged, and name the staging lane beside it with what it may and may not seed
- [ ] 5.3 Verify: `pnpm run lint`
