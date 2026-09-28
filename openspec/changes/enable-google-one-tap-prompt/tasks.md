## 1. Shared sign-in feature slice (grade10) (owner: @sean)

- [x] 1.1 Write the tests `shared-auth-sign-in-SC-80` through `SC-86`, `SC-89` and `SC-90` name, in their own commit: `PromptOneTap` use case unit tests, `BetterAuthSignInRepository` tests for `promptOneTap` and `cancelOneTapPrompt`, and `useOneTapPrompt()` hook tests for the brand/session/dialog gating and the visit-suppression flag each call re-checks.
- [x] 1.2 Add a `PromptOneTap` use case beside the existing `MountGoogleSignInButton`, a `SIGN_IN_TOKENS` entry, and the two new `SignInRepository` port methods (`promptOneTap`, `cancelOneTapPrompt`) implemented on `BetterAuthSignInRepository` — `promptOneTap()` takes no argument and reports nothing back; it calls `oneTap({})` with no `button`. `cancelOneTapPrompt` calls `window.google.accounts.id.cancel()` behind an existence guard. Neither decides when to call itself: every gating and suppression decision lives in the hook (1.3), not this layer. Bind both in `domainModule.ts` and `dataModule.ts`. Makes `shared-auth-sign-in-SC-80`, `SC-84`, `SC-85` and `SC-89` pass.
- [x] 1.3 Add the `useOneTapPrompt()` presentation hook: reads `useSession()` and `useSignInOverlay().open`, calling `promptOneTap()` whenever the brand offers Google, the visitor has no session, the dialog is closed and no decline has happened this visit. Opening the dialog while a prompt is active calls `cancelOneTapPrompt()` and flags the prompt as interrupted; closing the dialog afterward while still signed out sets suppression for the rest of the visit — the dialog's own close is the decline signal, not anything Google reports back. Makes `shared-auth-sign-in-SC-81`, `SC-82`, `SC-83`, `SC-86`, `SC-87`, `SC-88` and `SC-90` pass.
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` (packages/grade10-auth)

## 2. grade10-site root wiring (grade10) (owner: @sean)

Needs group 1 landed.

- [x] 2.1 Write the test naming `shared-auth-sign-in-SC-80` through `SC-83`, `SC-86` and `SC-87` for this app's mount, in its own commit.
- [x] 2.2 Mount `useOneTapPrompt()` inside `SignInOverlayProvider` in `apps/frontend/grade10/src/root.tsx`, beside `SignInBeforeNavigating` and `SignInDialog`.
- [x] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build` (apps/frontend/grade10)

## 3. zzz-site root wiring (grade10) (owner: @sean)

Needs group 1 landed. Independent of group 2 — claim and land in parallel.

- [x] 3.1 Write the test naming `shared-auth-sign-in-SC-80` through `SC-83`, `SC-86` and `SC-87` for this app's mount, in its own commit.
- [x] 3.2 Mount `useOneTapPrompt()` inside `SignInOverlayProvider` in `apps/frontend/zzz/src/root.tsx`, beside `SignInDialog`. No behavior is visible here until a separate change sets `GOOGLE_CLIENT_IDS.zzz` — this task only removes the gap so that change is all zzz needs.
- [x] 3.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build` (apps/frontend/zzz)

## 4. PRD (grade10-spec) (owner: @sean)

- [x] 4.1 Confirm `docs/prds/products/shared/auth/sign-in.md`'s `Google One Tap` section and its three `Google One Tap …` `Product decisions` rows (already written landing this change) still match the landed requirement.
- [x] 4.2 Verify: `pnpm check:manual`

## 5. The walk (grade10) (owner: @sean)

Needs `feature-tcs.md` reviewed (`/tcs-review enable-google-one-tap-prompt`) as its input, and groups 1, 2 and 4 landed. zzz is not walked here — nothing is visible on it until its own client id lands.

- [x] 5.1 Walk `shared-auth-sign-in-US-11` end to end on grade10-site through the browser a collector uses: visit signed out on a Google-enabled brand and see the prompt; decline it and confirm it does not return on a later page in the same visit; open the sign-in dialog while the prompt is showing and confirm it yields; complete the prompt and confirm sign-in on the same terms as the Google button.
- [x] 5.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walk's own commit; cases that stay manual (following the existing Google-button suite's own precedent) are named in `feature-tcs.md` and in the walk's `rounds.md` row.
- [x] 5.3 Verify: the walk's suite run
