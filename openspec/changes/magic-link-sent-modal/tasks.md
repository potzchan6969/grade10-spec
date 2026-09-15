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
  `SignInLinkSent` → **Resend countdown** / **Countdown ticks** (sped-up);
  email-step CTA **Sign In with Email**; gallery hierarchy Default → From
  add to cart → Link sent — satisfies SC-42 through SC-49 and SC-11 / SC-14 /
  SC-15
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm check:manual`,
  `openspec validate magic-link-sent-modal --strict`, and the
  `auth-sign-in` suites under
  `pnpm --filter @grade10/ui run test:stories`

## 2. Link lifetime and the send window (grade10) (owner: @sean)

- [ ] 2.1 Move `SIGN_IN_SEND_WINDOW_SECONDS` into `@grade10/auth-contracts`
  beside a new `SIGN_IN_LINK_TTL_SECONDS`, both sixty, so the dialog's
  countdown and the server's cap read one number
- [ ] 2.2 Pass `expiresIn: SIGN_IN_LINK_TTL_SECONDS` to better-auth's
  `magicLink` plugin, so a link followed more than sixty seconds after it was
  sent creates no session — satisfies `shared-auth-sign-in-SC-49`
- [ ] 2.3 Verify: `pnpm run typecheck` and `pnpm run test:backend`

## 3. Link-sent step in the sign-in dialog (grade10) (owner: @sean)

- [ ] 3.1 After a send that went out, title the dialog from `linkSentTitle`,
  draw no provider slot, and render `SignInLinkSent` with the address the link
  went to — satisfies `shared-auth-sign-in-SC-42`
- [ ] 3.2 Count the wait down from the send timestamp, holding Resend off and
  labelled **Resend (n)** until it reaches zero — satisfies
  `shared-auth-sign-in-SC-46` and `shared-auth-sign-in-SC-47`
- [ ] 3.3 Send again for the same address from Resend, restarting the
  countdown on a send that went out and reporting a refusal in the card's
  message slot — satisfies `shared-auth-sign-in-SC-43` and
  `shared-auth-sign-in-SC-48`
- [ ] 3.4 Clear the sent step when the dialog closes, so reopening offers
  Google and the email field again — the step draws no Back, so dismissal is
  the way out: satisfies `shared-auth-sign-in-SC-44`
- [ ] 3.5 Answer the link-sent copy in the consoles' own English and drop the
  term magic link from it — satisfies `shared-auth-sign-in-SC-45`
- [ ] 3.6 Verify: `pnpm run typecheck`, `pnpm run lint`, and the sign-in
  feature cases for `shared-auth-sign-in-US-07`
