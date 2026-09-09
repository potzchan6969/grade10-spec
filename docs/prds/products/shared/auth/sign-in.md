---
title: Sign-In
spec: shared/auth/sign-in
order: 1
---

A person types their email and picks a way in. The link and the code are both
emailed; Google appears only on a brand that has enabled it, and only a verified
Google address signs anyone in. There is no password to get wrong.

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

::story{id="auth-sign-in-signincodeform--default" title="The code step"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}

:::callout{kind="note"}
Figma draws sign-in only as a dialog — a login dialog, an OTP dialog, a scrim
and a Google mark. No card-on-a-page layout is drawn anywhere in the file, while
what ships today is a page-level card. The in-flight change `sign-in-dialog-shell`
is what closes that gap, so a collector asked to sign in mid-flow comes back to
what they were doing.
:::
