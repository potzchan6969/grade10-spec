**Author:** @tangconst - 2026-09-15

## Why

After a collector asks for a sign-in email, the dialog still looks like the
entry step — providers, the address field, and a send control — with only a
thin status line underneath. Nothing names the address the email went to, and
there is no clear way to ask again or go back and change it. Separately, the
send control still says **Send Magic Link**, a product term collectors do not
use.

**Metric:** share of email sign-in starts that end in a session, from the
first send through the session, versus the same rate when the dialog only
showed a status line under the entry step.

**Acceptance signal:** after a successful send, the Login Dialog shows a
confirmation that names the address, a **Resend** control that stays off for
sixty seconds with a **Resend (n)** countdown, and a control that returns to
Google Continue (when offered) plus email entry; the email-step CTA reads
**Sign In with Email**; a sign-in link lasts sixty seconds.

## What Changes

- **Link-sent step** — after a successful send, the dialog shows confirmation
  copy that names the address (for example *We've just sent a sign-in link to
  {email}*), a **Resend** control, and a control that returns to the entry
  step
- **Resend countdown** — for sixty seconds after the initial send and after
  each successful resend, Resend is disabled and labelled **Resend (n)** with
  the whole seconds left; at zero it is enabled again as **Resend**
- **Link TTL** — a sign-in link lasts sixty seconds
- **Entry step CTA copy** — the email-step action is **Sign In with Email**
  (Title Case). User-facing copy drops "Magic Link" / "magic link"; keys and
  code identifiers may keep the term
- **New export `SignInLinkSent`** — shared UI step for the link-sent body,
  with consumer-owned copy and `onResend` / `onBack` (names locked in the
  delta). Does not exist yet
- **Catalog keys** — shared `signIn` gains resend, resend countdown, and back
  labels; updates `sendLinkLabel`, `sendLinkFailed`, and `linkSentMessage`
  (email interpolation)

## Non-Goals

- **Sending or verifying mail in Storybook** — stories call through props;
  no real email
- **Changing the one-email-a-minute server cap** — the sixty-second send
  window stays; this change surfaces it as a Resend countdown and sets the
  link TTL to the same sixty seconds
- **Redrawing the Login Dialog chrome** — title, dismissal, legal line, and
  provider slot stay as they are; the consumer omits the provider while the
  sent step shows
- **Rewriting the magic-link email letter** — subject and body of the mailed
  letter are out of scope unless a later change needs them
- **Failed-send and wait treatments** — field error and wait copy stay on the
  email step

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/auth/sign-in` — after a successful send, the surface shows the
  confirmation, Resend with a sixty-second countdown, and return to entry;
  email-step wording is sign-in with email, not "magic link"; link TTL is
  sixty seconds
- `shared/ui/auth-sign-in` — export set gains `SignInLinkSent` and its copy /
  props types; the step renders confirmation, Resend (with cooldown), and Back

## Impact

- **`@grade10/ui`** — new `SignInLinkSent` export; Storybook
  `Auth Sign In/SignInCard` → **Link sent** (and related stories)
- **`@grade10/i18n`** — shared `signIn` catalogs (en, ko, zh-Hans, zh-Hant)
- **Consuming apps** — swap children to `SignInLinkSent` after send; hide
  `providerSlot` on that step; wire `onResend` / `onBack`; pass
  **Sign In with Email** from `signIn.sendLinkLabel`
- **No domain or platform impact** beyond shared auth / UI

## Open questions

- none — confirmation wording leads with the collector's words; CTA locked to
  **Sign In with Email**; Back returns to the entry step with Google when the
  brand offers it; Resend countdown copy is **Resend (n)**; link TTL and
  Resend wait are both sixty seconds

## References

- [Sign-In Dialog · Shell](../../../docs/prds/products/shared/ui/auth-sign-in.md#shell)
- [Sign-In · After the Send](../../../docs/prds/products/shared/auth/sign-in.md#after-the-send)
