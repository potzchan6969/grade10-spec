---
title: Sign-In
spec: shared/auth/sign-in
order: 1
---

A person types their email and a sign-in link is emailed to it. Google appears
only on a brand that has enabled it, and only a verified Google address signs
anyone in. There is no password to get wrong, and no code to type.

The rule that shapes the whole surface is **one intent, one request, one
email**. Pressing the button again while the request is running starts no
second request. Asking again within a minute is answered with a wait rather
than a second message, and a new link invalidates the one sent before it, so
the newest email in an inbox is always the one that works.

The first success for an address creates the account and the address becomes
unique to it — letter case does not create a second account, though a plus-tag
is a different address. A trusted product may also create or enter an account
from an email it has already verified; that is the seam checkout uses, and a
later sign-in with the same address is the same person.

Sign-in stays on the brand. A session covers every site of that brand and no
other, and a redirect target the brand does not trust is ignored rather than
followed.

## After the Send

- 🚧 **Confirmation** — once the sign-in email goes out, the dialog is titled
  **Check Your Email**, the lead line sits above the address on its own line,
  and Resend is offered. There is no Back control — leave by dismissing the
  dialog.
- 🚧 **Resend wait** — Resend stays off for sixty seconds after each
  successful send, and the button counts down as **Resend (45)** (seconds
  left in parentheses). It turns on again at zero.
- 🚧 **Link lifetime** — a sign-in link lasts sixty seconds; after that it
  is expired.
- 🚧 **Email-step wording** — the send action reads **Sign In with Email**;
  collectors never see the term magic link on the dialog.

## Following the Link

A working unused link signs the person in. A link that cannot creates no
session, and the person lands on the brand home with a toast:

- 🚧 **Expired** — the toast says the link has expired.
- 🚧 **No longer works** — a used, replaced, or otherwise invalid link shares
  one toast that the link no longer works.
- 🚧 **Banned** — a banned account's link follow shows they cannot sign in,
  and does not invite them to ask for another link.

::story{id="auth-sign-in-signinemailform--default" title="The email step"}

::story{id="auth-sign-in-signinemailform--link-request-running" title="The send in flight"}

::story{id="auth-sign-in-link-follow-toasts--expired" title="Expired link toast"}

::story{id="auth-sign-in-link-follow-toasts--no-longer-works" title="Link no longer works toast"}

::story{id="auth-sign-in-link-follow-toasts--banned" title="Banned account toast"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}

:::detail{title="Product decisions" for="pm"}
The email step offered two buttons on one field, and both ended in the same
inbox. The link is one tap from there; the code was read, carried back and
typed, and could be wrong, expired or locked. The product keeps one email
path, the link, beside Google.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Email paths | Decided | The link alone; the code is withdrawn. | Product |
| Codes in flight at deploy | Decided | Stop working; the person asks for a link. | Product |
| Operator second factor | Decided | Untouched — a different code, proven after sign-in. | Product |
| Figma `OTP Dialog` frame | ❓ Open | Retire, or keep as reference for the second-factor dialog. | Design |
| Failed link follow copy | Decided | Expired is its own toast; used, replaced, and invalid share one; banned is its own and does not nudge a resend. | Product |

Measured on the share of email sign-ins that end in a session, from the send
to the session.
:::
