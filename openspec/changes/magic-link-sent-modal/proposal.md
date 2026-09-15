**Author:** @tangconst - 2026-09-15

## Why

After a collector asks for a sign-in email, the dialog still looks like the
entry step — providers, the address field, and a send control — with only a
thin status line underneath. Nothing names the address the email went to, and
there is no clear way to ask again. Separately, the send control still says
**Send Magic Link**, a product term collectors do not use.

**Metric:** share of email sign-in starts that end in a session, from the
first send through the session, versus the same rate when the dialog only
showed a status line under the entry step.

**Acceptance signal:** after a successful send, the Login Dialog is titled
**Check Your Email**, shows a confirmation lead line with the address on the
next line, and a hugging secondary **Resend** that stays off for sixty seconds
with a **Resend (n)** countdown; there is no Back control; the email-step CTA
reads **Sign In with Email**; a sign-in link lasts sixty seconds.

## What Changes

- **Link-sent step** — after a successful send, the dialog title is
  **Check Your Email**; confirmation lead (for example *We've just sent a
  sign-in link to*) then the address on the next line; hugging secondary
  **Resend**; no Back control (leave by dismissing the dialog)
- **Resend countdown** — for sixty seconds after the initial send and after
  each successful resend, Resend is disabled and labelled **Resend (n)** with
  the whole seconds left; at zero it is enabled again as **Resend**
- **Link TTL** — a sign-in link lasts sixty seconds
- **Entry step CTA copy** — the email-step action is **Sign In with Email**
  (Title Case). User-facing copy drops "Magic Link" / "magic link"; keys and
  code identifiers may keep the term
- **New export `SignInLinkSent`** — shared UI step for the link-sent body,
  with consumer-owned copy, `email`, and `onResend` (no `onBack`). Does not
  exist yet
- **Catalog keys** — shared `signIn` gains `linkSentTitle`, resend, and resend
  countdown; updates `sendLinkLabel`, `sendLinkFailed`, and `linkSentMessage`
  (lead only — email is a separate line)

## Non-Goals

- **Sending or verifying mail in Storybook** — stories call through props;
  no real email
- **Changing the one-email-a-minute server cap** — the sixty-second send
  window stays; this change surfaces it as a Resend countdown and sets the
  link TTL to the same sixty seconds
- **Redrawing the Login Dialog chrome** — dismissal, legal line, and provider
  slot stay as they are; the consumer sets the title and omits the provider
  while the sent step shows
- **Rewriting the magic-link email letter** — subject and body of the mailed
  letter are out of scope unless a later change needs them
- **Failed-send and wait treatments** — field error and wait copy stay on the
  email step
- **A Back control on the link-sent step** — deliberately omitted

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/auth/sign-in` — after a successful send, the surface shows Check
  Your Email, address on its own line, Resend with a sixty-second countdown,
  and no Back; email-step wording is sign-in with email; link TTL is sixty
  seconds
- `shared/ui/auth-sign-in` — export set gains `SignInLinkSent` and its copy /
  props types; the step renders confirmation + email line + hugging secondary
  Resend (with cooldown), no Back

## Impact

- **`@grade10/ui`** — new `SignInLinkSent` export; Storybook
  `Auth Sign In/SignInCard` → **Link sent**
- **`@grade10/i18n`** — shared `signIn` catalogs (en, ko, zh-Hans, zh-Hant)
- **Consuming apps** — swap children to `SignInLinkSent` after send; set
  title to **Check Your Email**; hide `providerSlot`; wire `onResend` and
  cooldown; pass **Sign In with Email** from `signIn.sendLinkLabel`
- **No domain or platform impact** beyond shared auth / UI

## Open questions

- none — title locked to **Check Your Email**; CTA to **Sign In with Email**;
  Resend countdown **Resend (n)**; no Back; link TTL and Resend wait both
  sixty seconds

## References

- [Sign-In Dialog · Shell](../../../docs/prds/products/shared/ui/auth-sign-in.md#shell)
- [Sign-In · After the Send](../../../docs/prds/products/shared/auth/sign-in.md#after-the-send)
