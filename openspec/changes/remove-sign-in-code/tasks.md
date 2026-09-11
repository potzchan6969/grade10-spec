# Tasks — remove-sign-in-code

## 1. Shared UI and catalogs (grade10-spec) (owner: @sean)

- [x] 1.1 Remove `SignInCodeForm`, `SignInCodeFormCopy` and `SignInCodeFormProps` from the `@grade10/ui` public entry with their stories, and drop `copy.codeAction`, `requestingCode` and `onRequestCode` from `SignInEmailForm` — satisfies *An application imports the sign-in surface* (`shared-ui-auth-sign-in-SC-01`) and *The email step has no code control* (`shared-auth-sign-in-SC-33`)
- [x] 1.2 Keep the `link-request-running` story as the one-control in-flight state and remove every story that drew the code action — satisfies *Activating again during flight does nothing* (`shared-auth-sign-in-SC-01`)
- [x] 1.3 Remove `signIn.sendCodeFailed`, `codeLabel`, `codeSentTo`, `verifyLabel`, `verifyFailed` and `email.login.otpHint` from the shared and brand catalogs in every language
- [x] 1.4 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, and `pnpm run test:stories:ui`

## 2. Auth service and login email (grade10) (owner: @sean)

Needs the submodule bump that carries group 1, for the `email.login` catalog shape.

- [ ] 2.1 Bump the `external/grade10-spec` submodule SHA
- [x] 2.2 Add a server-only `mintSession` endpoint on a local better-auth plugin and route `devLogin` and `signInVerifiedEmail` through it — keeps *A new verified email creates the account*, *A known verified email is the same account* and *A trusted product can sign the person in* (`shared-auth-sign-in-SC-21` to `SC-23`) and the dev-login identity cases green before the code plugin goes
- [ ] 2.3 Remove the email-code plugin from `createAuth`, its rate rule and its send-cap hook path, so both code routes answer 404 — satisfies *A code from an earlier email does not sign in* (`shared-auth-sign-in-SC-34`)
- [ ] 2.4 Narrow `invalidateEarlierSignInMail` to magic-link tokens — satisfies *A new link kills the earlier link* (`shared-auth-sign-in-SC-36`)
- [ ] 2.5 Re-point the send-cap case to the link alone — satisfies *A second link send in a minute is told to wait* (`shared-auth-sign-in-SC-35`)
- [ ] 2.6 Drop the code box from `LoginEmail.tsx`, `otp` from `sendLoginEmail`, and `otpHint` from the email package's catalog type and demo
- [ ] 2.7 Retire the code cases in both brands' `sign-in.spec.ts`, `identity.spec.ts` and `secondaryStorage.spec.ts`, re-basing the cold-read single-use case on the magic-link token
- [ ] 2.8 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`

## 3. Sign-in frontends (grade10)

Needs group 2's submodule bump for the `@grade10/ui` export set; nothing else from group 2.

- [ ] 3.1 Remove `SendSignInCode`, `VerifySignInCode`, their tokens, the repository's code methods, the client port's `emailOtp` members and `emailOtpClient()` from the browser client — the DI module test proves the graph without them
- [ ] 3.2 Collapse `SignInFlow` to the email step: no `otp` step, no code copy, `onSignedIn` kept for One Tap — satisfies *The email step has no code control* (`shared-auth-sign-in-SC-33`)
- [ ] 3.3 Drop the code words from the consoles' `consoleCopy`, so both admin panels show one email action
- [ ] 3.4 Update `signInSurface`, the fixture client, and the `useSignIn` and `SignInFlow` tests to the one-step flow
- [ ] 3.5 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and `pnpm run check:admin-bundle`

## 4. Manual and architecture docs (grade10-spec + grade10)

- [ ] 4.1 Rewrite the sign-in page: take the 🚧 lines off, state the link as the one email path, retitle the in-flight story, delete the note about the archived dialog-shell change; then the sign-in dialog page, the Accounts index, and the finance, vault, admin-access and edge-cache pages that list the code — `pnpm check:manual`
- [ ] 4.2 Update `docs/architecture/security.md` and `docs/architecture/edge-cache.md` in grade10 to name magic links alone
