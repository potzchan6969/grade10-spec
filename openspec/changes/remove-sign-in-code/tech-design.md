# Design — remove-sign-in-code

## Context

One better-auth instance composes every sign-in method: the magic-link
plugin, the email-code plugin, Google's redirect flow, and One Tap. The code
plugin owns two public routes, `/email-otp/send-verification-otp` and
`/sign-in/email-otp`, its own rate rule, and one key shape in `auth_kv`,
`verification:sign-in-otp-<email>`. No table or column is the code's own.

What the code shares with the link, and what depends on it:

| Piece | Shared with the link | Depends on the code |
| --- | --- | --- |
| `signInMail.ts` | the sixty-second send cap, `invalidateEarlierSignInMail` | the OTP key match inside `verificationBelongsToEmail` |
| `securityHooks.ts` | the send-cap check on `/sign-in/magic-link` | the same check on the code route |
| `sendLoginEmail` and `LoginEmail.tsx` | one template for both mails | the code box, rendered even for a link with `otp: ""` |
| `devLogin.ts`, `verifiedAccount.ts` | — | mint a session with `createVerificationOTP` then `signInEmailOTP` |
| `SignInFlow.tsx` | the email step, Google | the `otp` step, `SendSignInCode`, `VerifySignInCode` |
| `AdminSignInFlow.tsx` | the whole flow, English copy | the code words |
| `@grade10/ui` `auth-sign-in` | `SignInCard`, `SignInEmailForm` | `SignInCodeForm`, the email form's code action |
| `@grade10/i18n` | `signIn`, `email.login` | five `signIn` keys, `email.login.otpHint` |

The two session mints without an inbox are the only production-path way a
dev login or a trusted product's verified sign-in gets a cookie. Removing
the plugin removes them, so the change has to replace that before anything
else lands.

## Decisions

### The plugin goes, not just the button

The spec requires that no code is sent and no code creates a session
([The email step offers the link alone](specs/shared/auth/sign-in/spec.md)).
Remove `emailOTP()` from `createAuth`, its rate rule, and its entry in the
send-cap hook. The two routes answer 404 from better-auth's router the
moment the plugin is gone.

The alternative is hiding the control and leaving the plugin: cheaper, and
source-compatible for dev login. Rejected because an endpoint nobody draws
still sends mail on request, still holds an attempt counter, and still
answers a code. The spec's "no session from any code" is a service rule,
and a hidden button does not make one.

### Sessions without an inbox come from a server-only mint

`devLogin` and `signInVerifiedEmail` trade a self-issued code for a session
today. Replace that with one endpoint on a local better-auth plugin,
`mintSession`, marked server-only the way `createVerificationOTP` is: it
never reaches the HTTP router and is reached through `auth.api` alone. It
takes a user id, calls the internal adapter's `createSession`, and sets the
cookie with better-auth's own `setSessionCookie`, so the cookie, its
signature, the cookie cache and the KV copy of the session are what a
completed link sign-in writes.

Alternatives rejected:

- **Keep the code plugin with a no-op sender and a blocked route.** The
  plugin, its routes and its counter stay in the bundle to serve a path
  nobody can reach, and the wildcard rate rule still sees the route.
- **Mint through the magic link.** Create a verification value, then call
  `magicLinkVerify`. Rejected: verify is a redirecting GET whose cookies
  ride a redirect response, and it couples the mint to callback-URL
  handling that dev login has no use for.
- **Write the session row with drizzle.** Rejected: it bypasses the session
  copy that `secondaryStorage` keeps in KV and the cookie signing the edge
  relies on ([Edge Cache](../../../docs/prds/platform/edge-cache.md)), so
  the cookie would differ from production's.

### Invalidation and the cap are restated for links alone

`invalidateEarlierSignInMail` keeps the magic-link match on the token's
inner `email` and drops the OTP key branches. The cap key, window and
message do not change; only the second route that consulted it goes. The
existing backend cases for the cap and for a new link killing the earlier
one re-point to
[SC-35](specs/shared/auth/sign-in/spec.md) and
[SC-36](specs/shared/auth/sign-in/spec.md).

### The login email loses its code box

`LoginEmail.tsx` renders the button alone, `sendLoginEmail` loses `otp`, and
`email.login.otpHint` leaves the catalog in every language. The alternative
— an optional `otp` nobody passes — is a parameter with no caller.

### The frontend slice keeps one step

`SignInFlow` drops the `Step` union, the `otp` state, `handleSendOtp` and
`handleVerifyOtp`. `SendSignInCode`, `VerifySignInCode`, their two tokens,
the repository's `sendSignInCode` and `verifySignInCode`, the client port's
`emailOtp` members and the browser client's `emailOtpClient()` all go.
`SignInFlowCopy` loses `code`, `sendCodeFailed`, `verifyFailed` and
`codeSentTo`; `onSignedIn` stays, because One Tap completes in page.

The admin consoles wrap the same flow, so operators lose the code too and
keep the link and Google. That follows from one flow serving every surface,
and is stated here rather than worked around.

### `@grade10/ui` drops the code step, and the email form its second action

`SignInCodeForm` and its stories go. `SignInEmailForm` loses
`copy.codeAction`, `requestingCode` and `onRequestCode`; the
`link-request-running` story stays as the one-control in-flight state. The
block's `audit.json` is untouched — the code form audited nothing.

## Contracts

| Surface | Before | After |
| --- | --- | --- |
| `POST /api/auth/email-otp/send-verification-otp` | sends a code | 404 |
| `POST /api/auth/sign-in/email-otp` | verifies a code | 404 |
| Browser auth client | `emailOtp.*`, `signIn.emailOtp` | absent |
| `sendLoginEmail` | `{ otp, url, … }` | `{ url, … }` |
| `email.login` catalog | `otpHint` | absent |
| `signIn` catalog | `sendCodeFailed`, `codeLabel`, `codeSentTo`, `verifyLabel`, `verifyFailed` | absent |
| `@grade10/ui` | `SignInCodeForm` and its two types | absent |

## Risks / Trade-offs

- [Dev login or checkout's verified sign-in mints a cookie the edge does
  not accept] → the mint lands first, in its own task, with the existing
  "dev login" identity cases and the trusted-product cases
  (`US4-TC5-1`, `US4-TC7-1`) run before the plugin is removed.
- [The store removes exports before the app stops importing them] → the
  app's submodule bump and its adaptation land in one pull request;
  `typecheck` fails loudly in between, which is the intended signal.
- [A collector on the code step when the workers deploy] → the loaded page
  still shows the step; verify answers 404 and the step reports that the
  code did not work; a reload shows one control. A window of minutes,
  accepted.
- [Stale `verification:sign-in-otp-*` rows] → nothing reads them; they
  expire by TTL and are swept on the next write.

## Migration Plan

No data migration. Landing order:

1. The store: `@grade10/ui`, the catalogs, the manual.
2. The app: the mint, then the plugin removal, then the frontends, in one
   pull request with the submodule bump.
3. Deploy both brands' auth workers, then the sites and consoles.
4. Archive after deploy.

## Open Questions

- **The Figma `OTP Dialog` frame** — design's, and it changes nothing here.
