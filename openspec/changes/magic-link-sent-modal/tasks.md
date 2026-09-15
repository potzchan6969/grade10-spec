# Tasks — magic-link-sent-modal

## 1. Shared UI + catalogs (grade10-spec)

- [x] 1.1 Add `SignInLinkSent` with `SignInLinkSentCopy` / `SignInLinkSentProps`
  (`onResend`, `onBack`, consumer confirmation copy), export it from the
  public entry, and extend the export contract test — satisfies
  *The link-sent step exports confirmation, Resend, and Back*
  (`shared-ui-auth-sign-in-SC-10` through SC-13) and the modified export set
  (`shared-ui-auth-sign-in-SC-01`)
- [x] 1.2 Update shared `signIn` catalogs (en, ko, zh-Hans, zh-Hant):
  `sendLinkLabel` → **Sign In with Email** (locale equivalents),
  `sendLinkFailed` and `linkSentMessage` without "magic link" (message
  interpolates `{email}`), plus `resendLabel` and `backLabel` — satisfies
  *The email-step CTA says Sign In with Email* (`shared-auth-sign-in-SC-45`)
  and confirmation copy (`shared-auth-sign-in-SC-42`)
- [x] 1.3 Storybook: `Auth Sign In/SignInCard` → **Link sent** (confirmation,
  Resend, Back; no provider) and an interactive story that returns to Google
  Continue + email entry; email-step stories use **Sign In with Email** —
  satisfies SC-42 through SC-45 and SC-11 / SC-12
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm check:manual`, `openspec validate magic-link-sent-modal --strict`,
  and the `auth-sign-in` suites under
  `pnpm --filter @grade10/ui run test:stories`
