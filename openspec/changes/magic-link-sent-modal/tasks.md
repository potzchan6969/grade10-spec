# Tasks — magic-link-sent-modal

## 1. Shared UI + catalogs (grade10-spec)

- [x] 1.1 Add `SignInLinkSent` with `SignInLinkSentCopy` / `SignInLinkSentProps`
  (`onResend`, `onBack`, `resendCooldownRemaining`, consumer confirmation and
  countdown copy), export it from the public entry, and extend the export
  contract test — satisfies *The link-sent step exports confirmation, Resend,
  and Back* (`shared-ui-auth-sign-in-SC-10` through SC-15) and the modified
  export set (`shared-ui-auth-sign-in-SC-01`)
- [x] 1.2 Update shared `signIn` catalogs (en, ko, zh-Hans, zh-Hant):
  `sendLinkLabel` → **Sign In with Email** (locale equivalents),
  `sendLinkFailed` and `linkSentMessage` without "magic link" (message
  interpolates `{email}`), plus `resendLabel`, `resendCountdown`
  (**Resend ({seconds})**), and `backLabel` — satisfies
  *The email-step CTA says Sign In with Email* (`shared-auth-sign-in-SC-45`),
  confirmation (`shared-auth-sign-in-SC-42`), and countdown
  (`shared-auth-sign-in-SC-46`)
- [x] 1.3 Storybook: `Auth Sign In/SignInCard` → **Link sent** (confirmation,
  Resend countdown, Back; no provider), **Link sent back to entry**, and
  `SignInLinkSent` → **Resend countdown** / ticks (sped-up, not a real
  sixty seconds); email-step stories use **Sign In with Email** —
  satisfies SC-42 through SC-49 and SC-11 / SC-12 / SC-14 / SC-15
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm check:manual`,
  `openspec validate magic-link-sent-modal --strict`, and the
  `auth-sign-in` suites under
  `pnpm --filter @grade10/ui run test:stories`
