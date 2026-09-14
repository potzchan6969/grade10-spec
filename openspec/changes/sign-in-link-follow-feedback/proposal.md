**Author:** @constancetang - 2026-09-14

## Why

A collector who opens a sign-in link that cannot create a session — expired,
already used, replaced by a newer email, malformed, or barred by a ban —
lands with no session and no explanation. The durable rules already refuse
the session; they do not say what the person sees. Without a clear toast on
the brand home, they retry the dead link or abandon sign-in.

**Metric:** share of failed link follows that are followed by a fresh link
request within the same session, and the share of email sign-ins that end in
a session after a prior failed follow.

**Acceptance signal:** following an expired, dead, or banned link opens the
brand home with the matching toast and no session; a valid unused link still
signs in with no failure toast.

## What Changes

- **A failed link follow lands on the brand home with a toast.** Expired uses
  its own announcement; used, superseded, and otherwise invalid links share
  one “no longer works” announcement; a banned account uses a cannot-sign-in
  announcement that does not invite another link.
- **The message catalog names those three strings** so every brand speaks
  them the same way.
- **Storybook under Auth Sign In shows the three toasts** as the design and
  product reference; the apps fire them after verify.

## Non-Goals

- **Cross-tab session sync** after a successful follow.
- **A success toast** when the link signs the person in.
- **Changing when a link creates a session** — one-time use, expiry, and
  newest-mail-wins stay as specified.
- **Send-path failures** — a link that cannot be sent stays an inline error
  on the email step.
- **A new `@grade10/ui` export** that fires these toasts; verify stays an
  application concern.

## Capabilities

### New Capabilities

### Modified Capabilities

- `shared/auth/sign-in`: a link follow that creates no session leaves the
  person on the brand home with a toast that distinguishes expired, dead, and
  banned.

## Impact

- **Auth verify / magic-link route** — on failure, redirect to the brand home
  with enough signal for the client to show the matching toast.
- **Grade10 site (and any other brand site)** — homepage reads that signal and
  fires the toast.
- **`@grade10/i18n`** — `signIn` gains `linkExpired`, `linkInvalid`, and
  `linkBanned` in every shared language.
- **`@grade10/ui` Storybook** — Auth Sign In stories for the three toasts;
  no public export change.
- **The manual** — Sign-In · Following the Link.
- **Test suites** — feature cases for the new follow-feedback scenarios.

## References

- [Sign-In · Following the Link](../../../docs/prds/products/shared/auth/sign-in.md#following-the-link)
