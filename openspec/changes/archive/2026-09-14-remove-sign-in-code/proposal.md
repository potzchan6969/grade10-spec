**Author:** @seankcw - 2026-09-11

## Why

The email step gives a collector two buttons on one field: send a link, or
send a code. Both end in the same inbox. The link is one tap from there; the
code has to be read, carried back to the dialog and typed, and can be wrong,
expired, or locked after three tries. Ten of the sign-in capability's
thirty-two scenarios exist to describe the code and the lock between the two
buttons, and a second dialog exists to hold it. The choice costs the
collector a decision before they know the difference, and costs the product a
second path to test and keep.

**Metric:** share of email sign-ins that end in a session, from the send to
the session. It holds or rises once the only email path is the link, and the
code step's abandonment goes to zero because the step is gone.

**Acceptance signal:** the sign-in dialog shows the email field, one send
action, and Google where the brand has it; no code control, no code step,
and a request for a code is refused by the auth service.

## What Changes

- **The email step sends a link and nothing else.** The send-code control
  leaves the email step, and the code step leaves the dialog.
- **The auth service stops sending and verifying codes.** A request for a
  code is refused, and no code — including one sent before this change
  deploys — creates a session. **BREAKING** for a collector holding an unused
  code at the moment of deploy: they ask for a link instead.
- **The in-flight lock between link and code goes with the code.** One
  command on the email step needs no lock against a second; the one-request
  rule for a command in flight stands.
- **The one-email-a-minute cap and the newest-mail-wins rule are stated for
  the link alone.** Their behaviour does not change.
- **`shared/ui/auth-sign-in` stops exporting the code step.**
  `SignInCodeForm`, `SignInCodeFormCopy` and `SignInCodeFormProps` leave the
  public entry, and the email step loses its code action. **BREAKING** for
  any consumer importing them.
- **The message catalog drops the code strings.** Google, the link, the
  wait message and the legal line stay.

## Non-Goals

- **The operator second factor.** TOTP and backup codes on the admin
  consoles are a different code, proven after sign-in, and are untouched.
- **Google sign-in.** Which brand offers it, and what it creates, does not
  change.
- **The link's rules.** One-time use, expiry, the sixty-second cap, and
  newest-mail-wins stay exactly as specified.
- **A new method.** No passkeys, no phone, no password.
- **The Figma `OTP Dialog` frame.** Whether design retires the frame or keeps
  it as reference is design's call, recorded as an open question.

## Capabilities

### Modified Capabilities

- `shared/auth/sign-in`: the emailed code and the email-step lock are
  removed; the email step offers the link alone; the account, cap, and
  newest-mail rules are restated without the code.
- `shared/ui/auth-sign-in`: the export set loses the code step.

## Impact

- **Auth service** — the code send and verify routes, the code's attempt
  counter, and the verification rows that hold codes.
- **Grade10 site sign-in** — the code step, its request and verify use
  cases, and the step state that switches between email and code.
- **`@grade10/ui`** — the `auth-sign-in` block: the code form and its
  stories go, the email form loses its code action.
- **`@grade10/i18n`** — the `signIn` catalog loses `sendCodeFailed`,
  `codeLabel`, `codeSentTo`, `verifyLabel`, and `verifyFailed` in every
  language.
- **The manual** — the sign-in and sign-in dialog pages, the accounts index,
  and the finance, vault, admin-access and edge-cache pages that list the
  code among the ways in.
- **Test suites** — the sign-in feature suite's code cases retire, and any
  end-to-end spec that walks the code step.

Archive belongs to the engineer who deploys the last group, after it is
deployed. At archive, `shared-auth-sign-in-US-02` retires from the durable
journeys, and the retired scenario ids SC-02, SC-03, SC-04, SC-10 to SC-13,
SC-26 to SC-30 are never reissued; SC-35 and SC-36 carry the cap and the
newest-link rule.

## Open Questions

- **The Figma `OTP Dialog` frame (`4666:1488` sibling).** Retire it, or keep
  it as the reference for the operator second-factor dialog it also
  resembles. Design settles this; it does not hold the change.
