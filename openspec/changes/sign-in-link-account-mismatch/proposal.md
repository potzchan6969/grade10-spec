**Author:** @constancetang - 2026-09-17

## Why

A collector who is already signed in can open a sign-in link meant for a
different account. Today nothing stops that follow from swapping the session.
They lose the account they were using without choosing to, and may not notice
until something they expected is gone.

**Metric:** share of link follows that land while another session is active and
end in an explicit Switch or Stay, versus silent session replacement.

**Acceptance signal:** following a valid link for Account A while signed in as
Account B shows the different-account toast and keeps B until Switch; Stay or
dismiss leaves B signed in and does not enter A.

## What Changes

- **A signed-in mismatch stops auto-switch.** When the person is signed in as
  someone other than the link’s account, the follow does not replace the
  session on its own.
- **A warning toast offers Switch or Stay.** Title says they are signed in with
  a different account; the description names the link’s email; Switch enters
  that account; Stay or dismiss keeps the current session.
- **Storybook under Auth Sign In shows the toast** as the design and product
  reference; the apps wire verify later.

## Non-Goals

Edges are in [decisions.md](decisions.md).

## Capabilities

### New Capabilities

### Modified Capabilities

- `shared/auth/sign-in`: a link follow while signed in as a different account
  prompts Switch or Stay instead of replacing the session.

## Impact

- **Auth verify / magic-link route** — detect an active session that is not the
  link’s account and hand the client enough signal to show the choice toast
  without entering the new session yet.
- **Grade10 site (and any other brand site)** — fire the toast; Switch ends the
  current session and completes the link; Stay or dismiss keeps the current
  session and ignores the link.
- **`@grade10/i18n`** — `signIn` gains the mismatch title, description (with
  email), and action labels in every shared language (engineering pass).
- **`@grade10/ui` Storybook** — Auth Sign In / Link Follow Toasts gains the
  different-account story; no public export change.
- **The manual** — Sign-In · Following the Link.

## References

- [Sign-In · Following the Link](../../../docs/prds/products/shared/auth/sign-in.md#following-the-link)
