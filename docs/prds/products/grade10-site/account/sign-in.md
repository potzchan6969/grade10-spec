---
title: Sign-In
spec: shared/auth/sign-in
order: 1
reviewed: 2026-09-28
---

People sign in with an emailed link, or with Google where the brand offers it. There is no password and no code. A session covers the site or console it was made on, and no other brand. A return address the brand does not trust is ignored.

## Google Sign-In

### Button

Google shows only on brands that turn it on. Only a verified Google address can sign someone in.

- 🚧 **Site or console** — Google on the console signs in the console only. Google on the site signs in the site only, never the console. A product's sign-in from a verified email signs in the site, never the console

### One Tap

Signed-out people on a brand with Google sign-in see Google's prompt in the corner of the page. They do not open the sign-in dialog first. Tapping the prompt signs them in, the same as the Google button. Leaving it alone changes nothing.

- **Any page** — the prompt can appear on any page a signed-out person opens
- **One at a time** — the prompt stays hidden while the sign-in dialog is open. Opening the dialog hides it
- **After a decline** — if the prompt is showing, and the person opens the dialog and closes it with no sign-in, that counts as a decline. The prompt stays away for the rest of that visit
- 🚧 **Console sign-in does not hide it** — the prompt belongs to the site. A person signed in only on the console is still offered it on the site

## Email Sign-In

A person types their email, and a sign-in link is sent to it. Following the link signs them in.

### Requesting a Link

- **One request at a time** — pressing the button again while a request runs does not send a second one
- **One account per address** — capital letters do not make a second account. A plus-tag is a different address
- **Trusted products** — a trusted product can create or enter an account from an email it has already checked. Checkout does this. Signing in later with the same address is the same person
- **Wording** — the button reads **Sign In with Email**. Collectors never see the term magic link
- 🚧 **Site or console** — a console link signs in the console only, and a site link signs in the site only. If someone is already signed in as another person, the link is checked against the site or console it was sent for. A return address on the other one is ignored, and the person lands where they asked
- 🚧 **An operator can send a site link** — from a console action, such as Email sign-in link beside a [test winner](/p/grade10-admin/auction/management#test-winners), an operator can send a customer a link for the site. It never signs the customer in to the console. Only an elevated console session with `user:create` and a proven second factor can send it. Otherwise nothing is sent, and the request is refused

### Resend

After a send, the dialog reads **Check Your Email**, with the address on its own line. There is no Back button. Dismiss the dialog to leave. Signing in again starts at the email step, so a wrong address can be fixed.

- **Wait** — Resend stays off for sixty seconds after each successful send. It counts down as **Resend (45)**, then turns on
- **Asking early** — asking again during the wait gets a message, not a second email
- **Newest link works** — a new link stops the one before it from working, so the newest email is the one to use
- 🚧 **Waits are per site or console** — a console link asked for just after a site link for the same address is sent, and neither cancels the other
- 🚧 **Waits end on the same site or console only** — a console sign-in leaves a site wait running, and the other way round
- **Another device** — a dialog still waiting learns when that address signs in on another device for the same site or console. It then ends its wait with a message. It gets no session. Only the device that signed in has one

### Link Expiry

A link lasts five minutes, and the email says so. An expired link does not sign anyone in.

### One-Time Use

A link works once. A link that does not work creates no session.

| Link | Result |
| --- | --- |
| Working and unused | Signs in. The tab that asked shows the person signed in without a reload, and the action they started carries on. The link is used once |
| Expired | A toast says the link has expired |
| Used, replaced or invalid | A toast says the link no longer works |
| Banned | Says the account cannot sign in, and does not offer another link |
| Signed in as someone else, on the site | No switch. A toast names the link's email and offers **Switch** or **Stay**. Dismissing keeps the current session |

- 🚧 **Console failures show on the sign-in page** — an expired, used, banned or different-account link lands on the console's sign-in page, and the message shows there, since the console has no toasts. Switch and Stay sit on the page too

## Screens

The dialogs and messages above, as the design system draws them.

::story{id="account-sign-in-blocks-signinemailform--default" title="The email step"}

::story{id="account-sign-in-blocks-signinemailform--link-request-running" title="The send in flight"}

::story{id="account-sign-in-blocks-linkfollowtoasts--expired" title="Expired link toast"}

::story{id="account-sign-in-blocks-linkfollowtoasts--no-longer-works" title="Link no longer works toast"}

::story{id="account-sign-in-blocks-linkfollowtoasts--banned" title="Banned account toast"}

::story{id="account-sign-in-blocks-linkfollowtoasts--different-account" title="Different account toast"}

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
| Failed link follow copy | Decided | Expired is its own toast. Used, replaced and invalid share one. Banned is its own and does not nudge a resend. | Product |
| Link while signed in as someone else | Decided | No automatic switch. Switch enters that account. Stay or dismiss keeps the current session, and the link stays unused. | Product |
| Mismatch against an invalid link | Decided | The invalid-link check runs first, so the mismatch toast never reaches an invalid link. | Product |
| A second mismatched link | Decided | It replaces the toast. Each follow is a full-page redirect, so no earlier state survives. | Product |
| Console failed-follow landing | Decided | Failed, expired, banned and different-account console links land on the console's sign-in page, with the message in the page. | Product |
| Send cap and newest link | Decided | Counted per address and surface, so a console link does not cancel a site link. | Product |
| Waits across surfaces | Decided | Only a wait on the same surface stops when the address signs in. | Product |
| An operator action's link for a customer | Decided | The site. A link that signed in the console would sign the test account in to the console and break the test-winner flow. It is the one exception to the surface that asked. | Product |
| Link lifetime | Decided | Five minutes. Sixty seconds was shorter than delivery, so a collector reading mail on another device met a dead link. | Product |
| How a locale writes the number | Decided | A digit in every language. | Product |
| A device still waiting | Decided | It ends its own wait with a message and gains no session. Whether an address has a session is never revealed. | Product |
| Trusted product entry | Decided | A trusted product creates or enters an account only from an address its own email check has verified. A ban still refuses the sign-in, and entry never changes the account's roles. Staging QA can walk it with a plus-tag address. | Product |
| Google One Tap | Decided | It yields to the sign-in dialog, is offered wherever Google sign-in is brand-offered, ships to all eligible traffic at merge with no flag, and stays suppressed for the rest of a visit after a decline. | Product |
:::
