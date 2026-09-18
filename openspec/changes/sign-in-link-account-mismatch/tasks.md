## 1. Catalog (grade10-spec)

- [ ] 1.1 Add `differentAccountTitle`, `differentAccountDescription`, `differentAccountSwitch`, and `differentAccountStay` to the shared `signIn` catalog in every shared locale (`shared-auth-sign-in-SC-64`)
- [ ] 1.2 Confirm the Sign-In PRD's 🚧 Different account line still matches the landed requirement; update it if it has drifted
- [ ] 1.3 Verify: `pnpm check:manual && pnpm run tcs:validate && pnpm run typecheck`

## 2. Sign-in link contracts (grade10)

Needs group 1's `grade10-spec` submodule bump for the catalog keys.

- [ ] 2.1 Add the mismatch redirect's query params (link email, token, callbackURL) and their encode/parse helpers to `packages/grade10-auth/contracts/src/signIn.ts`, mirroring `SignInLinkFailure`
- [ ] 2.2 Verify: `pnpm run typecheck && pnpm run test`

## 3. Detect the mismatch and offer the choice (grade10)

Needs group 2's contracts landed.

- [ ] 3.1 In the magic-link verify `before` hook, after the existing failure check passes, resolve the link's account by the same lookup `signInLinkFailure`'s banned check uses, and redirect to the brand home with the mismatch params when the current session names a different account, before better-auth's magic-link plugin runs (`shared-auth-sign-in-SC-63`, `shared-auth-sign-in-SC-69`)
- [ ] 3.2 On the brand home, read the mismatch params once, fire the warning toast — title, description naming the link's email, Switch, Stay, no auto-dismiss — and clear the params from the URL (`shared-auth-sign-in-SC-64`, `shared-auth-sign-in-SC-68`)
- [ ] 3.3 Wire Switch to sign out and then navigate to the preserved `/magic-link/verify` retry URL; wire Stay and dismiss to do nothing further (`shared-auth-sign-in-SC-65`, `shared-auth-sign-in-SC-66`, `shared-auth-sign-in-SC-67`)
- [ ] 3.4 Verify: `pnpm run typecheck && pnpm run test && pnpm run test:backend`
