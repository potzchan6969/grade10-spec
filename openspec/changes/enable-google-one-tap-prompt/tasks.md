## 1. Shared sign-in feature slice (grade10)

- [ ] 1.1 Write the tests `shared-auth-sign-in-SC-80` through `SC-86`, `SC-89` and `SC-90` name, in their own commit: `PromptOneTap` use case unit tests and `BetterAuthSignInRepository` tests for `promptOneTap`, `cancelOneTapPrompt`, the visit-suppression flag, and the brand/session gating each call re-checks.
- [ ] 1.2 Add a `PromptOneTap` use case beside the existing `MountGoogleSignInButton`, a `SIGN_IN_TOKENS` entry, and the two new `SignInRepository` port methods (`promptOneTap`, `cancelOneTapPrompt`) implemented on `BetterAuthSignInRepository` — `promptOneTap` calls `oneTap({})` with no `button`, wires `promptOptions.onPromptNotification` to flip the suppression flag on a dismissed or skipped moment, and re-checks brand-offered, signed-out and not-suppressed before every call; `cancelOneTapPrompt` calls `window.google.accounts.id.cancel()` behind an existence guard. Bind both in `domainModule.ts` and `dataModule.ts`. Makes `shared-auth-sign-in-SC-80` through `SC-86`, `SC-89` and `SC-90` pass.
- [ ] 1.3 Add the `useOneTapPrompt()` presentation hook: reads `useSession()` and `useSignInOverlay().open`, calls `promptOneTap()` when eligible, calls `cancelOneTapPrompt()` the render `open` turns `true`. Makes `shared-auth-sign-in-SC-87` and `SC-88` pass.
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` (packages/grade10-auth)

## 2. grade10-site root wiring (grade10)

Needs group 1 landed.

- [ ] 2.1 Write the test naming `shared-auth-sign-in-SC-80` through `SC-83`, `SC-86` and `SC-87` for this app's mount, in its own commit.
- [ ] 2.2 Mount `useOneTapPrompt()` inside `SignInOverlayProvider` in `apps/frontend/grade10/src/root.tsx`, beside `SignInBeforeNavigating` and `SignInDialog`.
- [ ] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build` (apps/frontend/grade10)

## 3. zzz-site root wiring (grade10)

Needs group 1 landed. Independent of group 2 — claim and land in parallel.

- [ ] 3.1 Write the test naming `shared-auth-sign-in-SC-80` through `SC-83`, `SC-86` and `SC-87` for this app's mount, in its own commit.
- [ ] 3.2 Mount `useOneTapPrompt()` inside `SignInOverlayProvider` in `apps/frontend/zzz/src/root.tsx`, beside `SignInDialog`. No behavior is visible here until a separate change sets `GOOGLE_CLIENT_IDS.zzz` — this task only removes the gap so that change is all zzz needs.
- [ ] 3.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build` (apps/frontend/zzz)

## 4. PRD (grade10-spec)

- [ ] 4.1 Confirm `docs/prds/products/shared/auth/sign-in.md`'s `Google One Tap` section and its three `Google One Tap …` `Product decisions` rows (already written landing this change) still match the landed requirement.
- [ ] 4.2 Verify: `pnpm check:manual`

## 5. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review enable-google-one-tap-prompt`) as its input, and groups 1, 2 and 4 landed. zzz is not walked here — nothing is visible on it until its own client id lands.

- [ ] 5.1 Walk `shared-auth-sign-in-US-11` end to end on grade10-site through the browser a collector uses: visit signed out on a Google-enabled brand and see the prompt; decline it and confirm it does not return on a later page in the same visit; open the sign-in dialog while the prompt is showing and confirm it yields; complete the prompt and confirm sign-in on the same terms as the Google button.
- [ ] 5.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walk's own commit; cases that stay manual (following the existing Google-button suite's own precedent) are named in `feature-tcs.md` and in the walk's `rounds.md` row.
- [ ] 5.3 Verify: the walk's suite run
