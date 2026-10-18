---
title: Sign-In
spec: shared/auth/sign-in
order: 1
reviewed: 2026-09-28
---

## Values

| Rule | Value |
| --- | --- |
| Methods | An emailed link, and Google where the brand enables it |
| Link lifetime | Five minutes, and the email says five minutes |
| Resend wait | Sixty seconds after each successful send |
| Account per address | One, created by the first successful sign-in |

## Sending a Link

A person types their email, and a sign-in link is emailed to it. There is no password and no code. Google appears only on a brand that has enabled it, and only a verified Google address signs anyone in.

- **One intent, one request** — pressing the button again while the request runs starts no second request
- **One email a minute** — asking again within a minute is answered with a wait, not a second message
- **The newest link works** — a new link invalidates the one sent before it, so the newest email in an inbox is always the one that works
- **One account per address** — letter case does not create a second account. A plus-tag is a different address
- **Trusted products** — a trusted product may create or enter an account from an email it has already verified. Checkout uses this, and a later sign-in with the same address is the same person

## Surfaces

Sign-in stays on the brand. A session covers the surface it was made on and no other brand, and a redirect target the brand does not trust is ignored rather than followed.

- 🚧 **A link signs in the surface that asked for it** — a console link signs in the console only, and a site link signs in the site only. A person already signed in as someone else is judged on the surface the link belongs to. A return location on the other surface is ignored, and the person lands on the asking surface
- 🚧 **An operator action can send a site link** — an elevated console action, such as Email sign-in link beside a [test winner](/p/grade10-admin/auction/management#test-winners), may send a customer account a link for the site. It signs in the site and never the console. Only a console session holding `user:create` can send it. Otherwise the request is refused and nothing is sent
- 🚧 **The wait and the newest link count per surface** — a console link asked for right after a site link for the same address is sent, and neither cancels the other
- 🚧 **Google and a product's sign-in follow their surface** — Google on the console signs in the console only. A product's sign-in from a verified email signs in the site and never the console

## After the Send

- **Confirmation** — the dialog is titled **Check Your Email**, the address sits on its own line, and Resend is offered. There is no Back control. Dismiss the dialog to leave
- **Resend wait** — Resend stays off for sixty seconds after each successful send, and counts down as **Resend (45)**. It turns on again at zero
- **Email-step wording** — the send action reads **Sign In with Email**. Collectors never see the term magic link
- **Leaving** — dismissing the dialog is the way out. Signing in again starts at the email step, so a mistyped address can be corrected

## Following the Link

A working, unused link signs the person in. A link that cannot creates no session. A site link that cannot lands the person on the brand home, with a toast.

| Link | Result |
| --- | --- |
| Working and unused | Signs in. The tab that asked shows the collector signed in without a reload, and the stopped action carries on. It is tried once |
| Expired | A toast says the link has expired |
| Used, replaced or invalid | One toast says the link no longer works |
| Banned | Says they cannot sign in, and does not invite another link |
| Signed in as someone else, on the site | No switch. A toast says so, names the link's email, and offers **Switch** or **Stay**. Dismissing keeps the current session |

- 🚧 **A console link that cannot lands on the console's sign-in page** — the failure, the ban and the different-account choice show as a message in the page, since the console has no toasts. Switch and Stay sit in the page too
- **Settled on another device** — a surface still showing Check Your Email learns when that address signs in on another device to the same surface, and ends its own wait with a message. It gains no session. Only the device that signed in has one
- 🚧 **Waits end on the same surface only** — a console sign-in leaves a site wait running, and the other way round

## Google One Tap

A signed-out collector on a brand that offers Google sign-in sees Google's own prompt in the browser corner, without opening sign-in first. Tapping it signs them in as the Google control does. Leaving it alone leaves the page as it was.

- **Brand-offered** — a brand without Google sign-in never shows it
- **One ask at a time** — the prompt does not appear while the sign-in dialog is open, and opening the dialog dismisses it
- **Every page** — it can appear on any page a signed-out collector visits
- **Suppressed after a decline** — opening the dialog while the prompt shows counts as a decline once the dialog closes with no session. The prompt stays away for the rest of that visit
- 🚧 **A console session does not withhold it** — the prompt is the site's and reads the site's session, so a person signed in on the console only is still offered it on the site

::story{id="auth-sign-in-blocks-signinemailform--default" title="The email step"}

::story{id="auth-sign-in-blocks-signinemailform--link-request-running" title="The send in flight"}

::story{id="auth-sign-in-blocks-linkfollowtoasts--expired" title="Expired link toast"}

::story{id="auth-sign-in-blocks-linkfollowtoasts--no-longer-works" title="Link no longer works toast"}

::story{id="auth-sign-in-blocks-linkfollowtoasts--banned" title="Banned account toast"}

::story{id="auth-sign-in-blocks-linkfollowtoasts--different-account" title="Different account toast"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}

:::detail{title="Code map" for="engineer"}
- **Link lifetime** — `SIGN_IN_LINK_TTL_SECONDS`, beside `SIGN_IN_SEND_WINDOW_SECONDS`, in [`packages/grade10-auth/contracts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/contracts/src/signIn.ts)
- **Email copy** — `email.login.body`, in `packages/i18n/messages/shared/<locale>/email.json`
- **E2E seams** — [docs/architecture/e2e.md](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md)
:::

:::detail{title="Product decisions" for="pm"}
Measured on the share of email sign-ins that end in a session, from the send to the session.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Email paths | Decided | The link alone. The code is withdrawn, and codes in flight at deploy stop working. | Product |
| Operator second factor | Decided | Untouched: a different code, proven after sign-in. | Product |
| Figma `OTP Dialog` frame | ❓ Open | Retire, or keep as reference for the second-factor dialog. | Design |
| Failed link follow copy | Decided | Expired is its own toast. Used, replaced and invalid share one. Banned is its own and does not nudge a resend. | Product |
| Link while signed in as someone else | Decided | No automatic switch. Switch enters that account. Stay or dismiss keeps the current session, and the link stays unused. | Product |
| Mismatch against an invalid link | Decided | The invalid-link check runs first, so the mismatch toast never reaches an invalid link. | Product |
| A second mismatched link | Decided | It replaces the toast. Each follow is a full-page redirect, so no earlier state survives. | Product |
| Console failed-follow landing | Decided | Failed, expired, banned and different-account console links land on the console's sign-in page, with the message in the page. | Product |
| Send cap and newest link | Decided | Counted per address and surface, so a console link does not cancel a site link. | Product |
| Waits across surfaces | Decided | Only a wait on the same surface stops when the address signs in. | Product |
| An operator action's link for a customer | Decided | The site. A link that signed in the console would sign the test account in to the console and break the test-winner flow. It is the one exception to the surface that asked. | Product |
| Link lifetime | Decided | Five minutes. Sixty seconds was shorter than delivery, so a collector reading mail on another device met a dead link. | Product |
| How a locale writes the number | ❓ Open | A digit in every language, or each language's own word for five. | Product |
| A device still waiting | Decided | It ends its own wait with a message and gains no session. Whether an address has a session is never revealed. | Product |
| Google One Tap | Decided | It yields to the sign-in dialog, is offered wherever Google sign-in is brand-offered, ships to all eligible traffic at merge with no flag, and stays suppressed for the rest of a visit after a decline. | Product |
:::
