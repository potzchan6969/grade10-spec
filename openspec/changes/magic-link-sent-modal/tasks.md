# Tasks — magic-link-sent-modal

## 1. Shared UI + catalogs (grade10-spec)

- [x] 1.1 Add `SignInLinkSent` with `SignInLinkSentCopy` / `SignInLinkSentProps`
  (`onResend`, `email`, `resendCooldownRemaining`, lead + countdown copy; no
  `onBack`), export it from the public entry, and extend the export contract
  test — satisfies *The link-sent step exports confirmation and Resend*
  (`shared-ui-auth-sign-in-SC-10` through SC-15) and the modified export set
  (`shared-ui-auth-sign-in-SC-01`)
- [x] 1.2 Update shared `signIn` catalogs (en, ko, zh-Hans, zh-Hant):
  `sendLinkLabel` → **Sign In with Email**, `linkSentTitle` →
  **Check Your Email**, `linkSentMessage` lead without inline email, plus
  `resendLabel` / `resendCountdown` (**Resend ({seconds})**); drop
  `backLabel` — satisfies SC-42, SC-44–SC-46
- [x] 1.3 Storybook: `Auth Sign In/SignInCard` → **Link sent** (Check Your
  Email, address on next line, secondary hugging Resend countdown, no Back);
  `SignInLinkSent` cooldown / ticks (sped-up); email-step CTA **Sign In with
  Email** — leave story taxonomy renames to the Auth Sign In stories cleanup
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm check:manual`,
  `openspec validate magic-link-sent-modal --strict`, and the
  `auth-sign-in` suites under
  `pnpm --filter @grade10/ui run test:stories`
