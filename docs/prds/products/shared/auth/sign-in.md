---
title: Sign-In
spec: shared/auth/sign-in
order: 1
---

A person types their email and picks a way in. The link and the code are both
emailed; Google appears only on a brand that has enabled it, and only a verified
Google address signs anyone in. There is no password to get wrong.

- 🚧 The emailed code is withdrawn: the email step sends a link and nothing
  else, and a code from an earlier email signs nobody in
- 🚧 The code step leaves the dialog, so an address has one email path and
  one screen

The rule that shapes the whole surface is **one intent, one request, one
email**. Pressing the button again while the request is running starts no second
request, and the link and code options refuse each other while either is in
flight. Asking again within a minute is answered with a wait rather than a
second message, and a new send invalidates the mail sent before it, so the
newest email in an inbox is always the one that works.

The first success for an address creates the account and the address becomes
unique to it — letter case does not create a second account, though a plus-tag
is a different address. A trusted product may also create or enter an account
from an email it has already verified; that is the seam checkout uses, and a
later sign-in with the same address is the same person.

Sign-in stays on the brand. A session covers every site of that brand and no
other, and a redirect target the brand does not trust is ignored rather than
followed.

::story{id="auth-sign-in-signinemailform--default" title="The email step"}

::story{id="auth-sign-in-signinemailform--link-request-running" title="The in-flight lock, with the other option refused"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}

:::callout{kind="note"}
Figma draws sign-in only as a dialog — a login dialog, an OTP dialog, a scrim
and a Google mark. No card-on-a-page layout is drawn anywhere in the file, while
what ships today is a page-level card. The in-flight change `sign-in-dialog-shell`
is what closes that gap, so a collector asked to sign in mid-flow comes back to
what they were doing.
:::

:::detail{title="Product decisions" for="pm"}
The email step offers two buttons on one field, and both end in the same
inbox. The link is one tap from there; the code is read, carried back and
typed, and can be wrong, expired or locked. The product keeps one email path,
the link, beside Google.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Email paths | Decided | The link alone; the code is withdrawn. | Product |
| Codes in flight at deploy | Decided | Stop working; the person asks for a link. | Product |
| Operator second factor | Decided | Untouched — a different code, proven after sign-in. | Product |
| Figma `OTP Dialog` frame | ❓ Open | Retire, or keep as reference for the second-factor dialog. | Design |

Measured on the share of email sign-ins that end in a session, from the send
to the session.
:::
