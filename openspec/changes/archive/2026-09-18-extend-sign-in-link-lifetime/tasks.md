## 1. The email's promise (grade10-spec) (owner: @sean)

- [x] 1.1 Say 5 minutes in the shared email catalog's sign-in body, in English, Traditional Chinese, Simplified Chinese and Korean (`shared-auth-sign-in-SC-61`)
- [x] 1.2 Add the engineer code map to the Sign-In page — the lifetime constant, the catalog key, and grade10's `docs/architecture/e2e.md`
- [x] 1.3 Verify: `pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run check:manual`

## 2. The lifetime the worker enforces (grade10) (owner: @sean)

`SIGN_IN_LINK_TTL_SECONDS` already reads 300 on `main`, raised inside
`sign-in-link-follow-feedback`. What is missing is the seam and the tests that
pin it.

- [x] 2.1 Age an unused link by a given number of seconds — `ageSignInLinks(db, email, seconds)` behind `POST /auth/dev/age-sign-in-link`, replacing `expireSignInLinks`, with `docs/architecture/e2e.md` moved to match (`shared-auth-sign-in-SC-58`, `shared-auth-sign-in-SC-59`)
- [x] 2.2 Stamp the recorded expiry at the send plus 5 minutes, and leave it there when the resend wait ends (`shared-auth-sign-in-SC-59`, `shared-auth-sign-in-SC-60`)
- [x] 2.3 Sign in a link followed a second inside the 5 minutes, and create no session at the mark or past it (`shared-auth-sign-in-SC-58`, `shared-auth-sign-in-SC-59`)
- [x] 2.4 Decide the follow on the worker's own clock, whatever time the request carries (`shared-auth-sign-in-SC-62`)
- [x] 2.5 Verify: `pnpm run typecheck && pnpm run test:backend`

## 3. The promise in grade10 (grade10) (owner: @sean)

Needs group 1 on the store's `main`.

- [x] 3.1 Bump `external/grade10-spec`, and move the Grade10 and ZZZ worker specs that assert the 15-minute body (`shared-auth-sign-in-SC-61`)
- [x] 3.2 Assert the English body's number against `SIGN_IN_LINK_TTL_SECONDS`, so the promise cannot drift from the enforced lifetime (`shared-auth-sign-in-SC-61`)
- [x] 3.3 Verify: `pnpm run check:submodules && pnpm run typecheck && pnpm run test:backend && pnpm run test`

## 4. Storefront E2E (grade10) (owner: @sean)

Needs 2.1's seam and group 3's copy.

- [x] 4.1 Walk a follow inside the 5 minutes and one at the mark, aged on the record rather than waited out (`shared-auth-sign-in-SC-58`, `shared-auth-sign-in-SC-59`)
- [x] 4.2 Walk the resend wait running out with the sent link left alive (`shared-auth-sign-in-SC-60`)
- [x] 4.3 Read the 5-minute promise from the email in each language the brand speaks (`shared-auth-sign-in-SC-61`)
- [x] 4.4 Verify: `pnpm run test:e2e`
