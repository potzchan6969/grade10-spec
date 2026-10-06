---
title: Sign-In
spec: shared/auth/sign-in
order: 1
reviewed: 2026-09-28
---

A person types their email and a sign-in link is emailed to it. Google appears
only on a brand that has enabled it, and only a verified Google address signs
anyone in. There is no password to get wrong, and no code to type.

The rule that shapes the whole surface is **one intent, one request, one
email**. Pressing the button again while the request is running starts no
second request. Asking again within a minute is answered with a wait rather
than a second message, and a new link invalidates the one sent before it, so
the newest email in an inbox is always the one that works. Both hold for one
surface at a time, as the line below says.

The first success for an address creates the account and the address becomes
unique to it — letter case does not create a second account, though a plus-tag
is a different address. A trusted product may also create or enter an account
from an email it has already verified; that is the seam checkout uses, and a
later sign-in with the same address is the same person.

Sign-in stays on the brand. A session covers the surface it was made on and no
other brand, and a redirect target the brand does not trust is ignored rather
than followed.

🚧 **A link signs in the surface that asked for it** - a link requested from the admin console signs in the console only; one requested on the site signs in the site only. The person already signed in as someone else is judged on the surface the link belongs to. A return location on the other surface is ignored, and the person lands on the asking surface. One link is the exception, next.

🚧 **An operator action can send a site link** - an elevated console action, such as Email sign-in link beside a [test winner](/p/grade10-admin/auction/management#test-winners), may send a customer account a sign-in link for the site. That link signs in the site and never the console, and it lands on the site page it names. Opening it leaves the console session of whoever opens it as it was. Only an elevated console session whose role holds `user:create`, the grant that makes an account, can send it. With no console sign-in, a role without that grant, or a second factor not yet proved, the request is refused and nothing is sent.

🚧 **The wait and the newest link count per surface** - a console link asked for right after a site link for the same address is sent, and neither cancels the other. Within each surface the minute's wait and the newest-link rule hold as above.

🚧 **Google and a product's sign-in follow their surface** - Google on the console signs in the console only. A product's sign-in from an email it has verified signs in the site and never the console.

## After the Send

- **Confirmation** — once the sign-in email goes out, the dialog is titled
  **Check Your Email**, the lead line sits above the address on its own line,
  and Resend is offered. There is no Back control — leave by dismissing the
  dialog.
- **Resend wait** — Resend stays off for sixty seconds after each
  successful send, and the button counts down as **Resend (45)** (seconds
  left in parentheses). It turns on again at zero.
- **Link lifetime** — a sign-in link lasts five minutes, and the email
  carrying it says five minutes; after that it is expired.
- **Email-step wording** — the send action reads **Sign In with Email**;
  collectors never see the term magic link on the dialog.
- **Leaving the confirmation** — dismissing the dialog is the way out.
  Opening sign-in again starts at the email step, so a mistyped address can be
  corrected.

## Following the Link

A working unused link signs the person in. A link that cannot creates no
session, and a site link lands the person on the brand home with a toast.

🚧 **A console link that cannot lands on the console's sign-in page** - the failure, the ban and the different-account choice show as a message in the page, since the console has no toasts. Switch and Stay sit in the page too.

- **Signed in** — the tab where the link was asked for shows the collector
  signed in without being reloaded, and whatever they were stopped from doing
  carries on. It is tried once, and a card that sold out while they were in
  their inbox refuses the ordinary way — [Session](/p/shared/auth/session).
- **Settled on another device** — a surface still showing Check Your Email
  learns when that address signs in on another device to the same surface, by
  any method that surface offers, and ends its own wait with a message instead
  of counting toward a resend nobody needs. It gains no session of its own;
  only the device that actually signed in has one.
- **Expired** — the toast says the link has expired.
- **No longer works** — a used, replaced, or otherwise invalid link shares
  one toast that the link no longer works.
- **Banned** — a banned account's link follow shows they cannot sign in,
  and does not invite them to ask for another link.
- **Different account** — on the site, when the person is already signed in as someone
  else, the link does not switch them. A toast says they are signed in with a
  different account, names the link’s email in the description, and offers
  **Switch** or **Stay**; dismissing keeps the current session.

🚧 **Waits end on the same surface only** - a console sign-in leaves a site wait running, and the other way round.

## Google One Tap

A signed-out collector on a brand that offers Google sign-in sees Google's
own prompt in the browser corner, without opening sign-in first. Tapping it
signs them in the same way the Google control does; leaving it alone leaves
the page exactly as it was.

- **Brand-offered** - the prompt follows the Google control's own rule: a
  brand without Google sign-in never shows it.
- **One ask at a time** - the prompt does not appear while the sign-in
  dialog is already open, and opening the dialog dismisses it.
- **Every page** - the prompt can appear on any page a signed-out
  collector visits, not only a sign-in step.
- **Suppressed after a decline** - opening the sign-in dialog while the
  prompt is showing counts as a decline once the dialog is closed with no
  session; the prompt does not appear again for the rest of that visit.

🚧 **A console session does not withhold it** - the prompt is the site's and reads the site's session, so a person signed in on the console only is still offered it on the site.

::story{id="auth-sign-in-signinemailform--default" title="The email step"}

::story{id="auth-sign-in-signinemailform--link-request-running" title="The send in flight"}

::story{id="auth-sign-in-link-follow-toasts--expired" title="Expired link toast"}

::story{id="auth-sign-in-link-follow-toasts--no-longer-works" title="Link no longer works toast"}

::story{id="auth-sign-in-link-follow-toasts--banned" title="Banned account toast"}

::story{id="auth-sign-in-link-follow-toasts--different-account" title="Different account toast"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}

:::detail{title="Code map" for="engineer"}
- **Link lifetime** — `SIGN_IN_LINK_TTL_SECONDS`, beside `SIGN_IN_SEND_WINDOW_SECONDS`, in [`packages/grade10-auth/contracts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/contracts/src/signIn.ts)
- **Email copy** — `email.login.body`, in `packages/i18n/messages/shared/<locale>/email.json`
- **E2E seams** — [docs/architecture/e2e.md](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md)
:::

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
| Link while signed in as someone else | Decided | No automatic switch. Warning toast: title names the mismatch; description names the link’s email. Switch enters that account; Stay or dismiss keeps the current session. | Product |
| Mismatch toast against an invalid link | Decided | The failed-follow toast wins. The invalid-link check (expired, used, banned) runs first and unchanged, so the mismatch check never reaches an invalid link. | Product |
| Console failed-follow landing | Decided | Failed, expired, banned and different-account console links land on the console's sign-in page with a message in the page; Switch and Stay sit there inline. The brand home and its toast are the site's. | Product |
| Send cap and newest link | Decided | Counted per address and surface: a console link right after a site link is allowed and does not cancel it. Per address alone would let a site link block or kill the console's. | Product |
| Waits across surfaces | Decided | Only a wait on the same surface stops when an address signs in; a console tab keeps waiting for a link that is still valid. | Product |
| Location on the other surface | Decided | Ignored; the person lands on the surface that asked. | Product |
| An operator action's link for a customer | Decided | The site. An elevated console action may send a customer account a link that signs in the site, as the test-winner flow does. A link that signed in the console would sign the test account in to the console and break that flow. It is the one exception to the surface that asked. | Product |
| Mismatch toast and the link’s token | Decided | Stay or dismiss leaves the link exactly as unused as before the follow — not invalidated. It expires on its own five minutes after the send. | Product |
| A second mismatched link while the toast is showing | Decided | Replaces it. Every follow is a full-page redirect to the brand home, so the earlier toast’s state cannot survive to conflict with the new one. | Product |
| Link lifetime | Decided | Five minutes, and the email says five minutes. Sixty seconds was shorter than delivery, so a collector reading mail on another device met a dead link. | Product |
| How a locale writes the number | ❓ Open | A digit in every language, or each language's own word for five. | Product |
| A device still waiting when the address signs in on another | Decided | The waiting surface ends its own wait with a message; it gains no session of its own — only the device that actually signed in has one. Checked without exposing whether an arbitrary address has a session: gated behind the waiting device's own flow, never a bare email. | Product |
| Google One Tap and the sign-in dialog | Decided | The prompt yields to the dialog — suppressed while it is open, dismissed when it opens. | Product |
| Google One Tap scope | Decided | Wherever Google sign-in is already brand-offered; a brand with no Google client id is unaffected until a separate change gives it one. | Product |
| Google One Tap rollout | Decided | Ships to all eligible traffic at merge — no staged rollout, since the repository has no flag platform and the behavior reverts cleanly. | Product |
| Google One Tap reappearance after a decline | Decided | Stays suppressed for the rest of the visit — re-popping it after an active decline reads as nagging. | Product |

Measured on the share of email sign-ins that end in a session, from the send
to the session.
:::
