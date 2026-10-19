---
title: Sign-In
spec: shared/auth/sign-in
order: 1
reviewed: 2026-09-28
---

People sign in with an emailed link, or with Google where the brand offers it. The session each sign-in makes, sign-out, and the staging test endpoint QA signs in through are on this page too; their specs are `shared/auth/session`, `shared/auth/sign-out` and `shared/auth/test-sign-in`. There is no password and no code. A session covers the site or console it was made on, and no other brand. A return address the brand does not trust is ignored.

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

:::detail{title="Sign-in test cases" for="qa"}
::cases{id="shared/auth/sign-in"}
:::

## Session

A session keeps a person signed in on one site or console. Each has its own session, and the two never share one.

### Two Sessions

- 🚧 **The console is its own sign-in** — signing in to the console does not sign anyone in on the site, and signing in on the site does not open the console. A person can hold one, the other or both, as two different accounts
- 🚧 **Each session ends on its own** — the site session ending says nothing about the console's, and the other way round
- 🚧 **Operator actions need the console's sign-in** — a site sign-in never counts as the second factor, or the recent sign-in, an operator action asks for
- 🚧 **Release asks operators to sign in once more** — the console stops honouring the site's session at release. Customer sessions are untouched

### Open Tabs

A session belongs to the browser, not to one tab. Every tab of the same site or console reads the same session.

- **Signed in somewhere else** — a tab left open shows the person signed in. A collector who followed the emailed link in a new tab does not need to reload the old one
- **Signed out somewhere else** — that tab shows them signed out. A session that ran out on its own counts as one they ended. A tab on a signed-in page asks for sign-in
- **Someone else signed in** — the tab shows whoever is signed in now. Their cart, watchlist and orders are theirs, never the last person's
- **When it catches up** — no later than when the person comes back to the tab, and promptly for a tab on the same site or console
- **When it cannot tell** — a tab that cannot reach us keeps what it last showed and asks again later. Only a clear answer signs anyone out

### Session Lifetime

- ❓ **How long a session lasts** — a site session and a console session each last one week, and a refresh extends them. No change specifies the refresh yet. The sign-in link's five minutes does not bound it, because the link is used up when it creates the session. Owner: Product

### Who Is Signed In

- **Signed in** — a request carries the person's id, email, name and roles
- **Signed out** — a request carries no person at all
- **Account key** — account data is filed under the user id, and nothing else. An email is an attribute, so changing an address changes data, not the key
- **Analytics** — a signed-in event names the person by user id. An anonymous event names the device. Signing in links the device to the person, so one visit does not look like two strangers. Each product decides which events it records

:::detail{title="Session test cases" for="qa"}
::cases{id="shared/auth/session"}
:::

## Sign-Out


### Pressing Sign Out

- **Running** — pressing sign out shows the request running. A second press is refused until it finishes
- **Refused** — the person is told what happened. Trying again clears the message
- **Why there is feedback** — a button that appears to do nothing leaves someone thinking they are signed out when they are not

### After Signing Out

- **Console** — the console goes back to its sign-in page
- **Site** — the site's profile goes back to marketing
- 🚧 **Ends one session only** — signing out of the console leaves the person signed in on the site, and signing out on the site leaves the console signed in

### Where the Button Is

The control's place, and what a surface clears afterwards, belong to the surface. On the grade10 site, the profile offers sign-out. So does the header account menu, when a collector is signed in — [Page Shell](/p/grade10-site/site/page-shell).

:::detail{title="Sign-out test cases" for="qa"}
::cases{id="shared/auth/sign-out"}
:::

## Screens

The dialogs and messages above, as the design system draws them.

::story{id="account-sign-in-blocks-signinemailform--default" title="The email step"}

::story{id="account-sign-in-blocks-signinemailform--link-request-running" title="The send in flight"}

::story{id="account-sign-in-blocks-linkfollowtoasts--expired" title="Expired link toast"}

::story{id="account-sign-in-blocks-linkfollowtoasts--no-longer-works" title="Link no longer works toast"}

::story{id="account-sign-in-blocks-linkfollowtoasts--banned" title="Banned account toast"}

::story{id="account-sign-in-blocks-linkfollowtoasts--different-account" title="Different account toast"}

## Staging Tests

QA walks sign-in on the hosted stacks through a gated endpoint. Collectors never see it.

::changes{spec="shared/auth/test-sign-in"}

### Who May Call

- **The lane's own workflow** — one workflow, from main, opens the test endpoint in an environment a reviewer approves. Proving the repository is not enough. A run a pull request starts is refused
- **A QA agent** — an agent walking a manual pass on staging captures a tester's sign-in link through the test endpoint, so it signs in without a mailbox — [Manual QA Passes](https://github.com/9gag/grade10-spec/blob/main/docs/governance/manual-qa-passes.md)
- **The QA token** — the agent proves itself with one token, committed to the repository so a pass needs no setup. Staging alone accepts it, and only for a tester address
- **What the token may do** — capture, expire and clear on a tester address, and on staging alone. Never ban, grant or set a role. A holder can sign in as any tester on staging
- 🚧 **The admin-only tester** — the token never reaches it, on any environment. Its link is followed by the workflow, which grants its `admin` before the follow
- **Rotating it** — a commit replaces the token, and the old one is refused from that deploy on. Anyone who reads the repository gets the new token too, so rotation cuts off only copies made earlier

### Where It Opens

- **Staging and uat** — every action, for the named testers. A unique plus-tag of a named tester takes capture, expire and clear; ban, grant and a scoped role take a plus-tag of the collector alone
- **Production and preview** — capture and clear, for production's named testers alone, by the workflow only, so a smoke test can sign in there

### Testers

- **Named testers** — staging and uat each name four: a collector, a plus-tag sibling, a ban-only address and an admin-only address. Production names its own smoke testers, today the collector alone. They are written into the code, so each is easy to identify and a new tester is a commit
- **A generated plus-tag** — on staging and uat, a run generates a unique plus-tag of a named tester, so a test that needs an unused address gets one. Ban, grant and a scoped role take a plus-tag of the collector only. Production takes no plus-tag
- 🚧 **Removing** — accounts for generated plus-tags build up on staging and uat. Each is removed in the next daily cleanup after the run that generated it

### What the Workflow May Do

Only for a tester address:

- **Capture the link** — the last sign-in mail for that address, read without opening the mailbox. The mail stays readable for **fifteen minutes**, so it outlives the five-minute link
- **Expire the unused link** — so an expired follow can be walked without waiting five minutes
- **Ban the address** — so a banned follow can be walked without the Users desk
- **Grant the address** — so it holds `admin` before the link is followed
- **Grant a scoped role** — `staff`, `support`, `finance`, `treasurer` or `auditor` on a unique plus-tag of the collector, never on a named tester
- **Clear the sign-in limits** — the wait between two sign-in mails, and the cap on how many a caller may ask for, so a suite is not throttled as an attacker would be

Ban and grant answer for an address that has never signed in. The account is created, then put in the state the action names. The collector still asks for the link the ordinary way. The workflow only captures, expires, bans, grants, sets a scoped role or clears.

### Closed

- **Production** — capture and clear only, for its named testers. Preview runs the production backends and answers the same
- **Everywhere else** — local stacks open no action, and the disposable `/dev` endpoint stays closed on staging, uat and production. The workflow does not generate a session without following the mail, does not unban, and does not seed store or auction data here

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
| Where the test endpoint is open | Decided | Staging and uat, every action. Production and preview, capture and clear for production's named testers alone, so a smoke test can sign in there. | Product |
| Who may call | Decided | One workflow, from main, on a reviewed dispatch, and a QA agent walking a manual pass on staging. Proving the repository alone is not enough. | Product |
| How a QA agent proves itself | Decided | A staging-only QA token committed to the repository, for capture, expire and clear on a tester address. Anyone who reads the repository can sign in as a tester on staging. That is accepted for an easy setup. | Product |
| The admin-only tester and the QA token | Decided | Refused on every environment. The token never reaches it, so a reader of the repository cannot sign in as `admin`. | Product |
| Test-endpoint writes on the trail | Decided | A ban, a grant, a scoped role and an account the test endpoint creates are on the audit trail, named by the caller's kind. Capture, expire and clear write none. | Product |
| Which addresses | Decided | Each environment's named testers, written into the code, and on staging and uat a unique plus-tag of one. | Product |
| Removing tester accounts | Decided | A generated plus-tag's account is removed in the next cleanup after the run that generated it. | Ops |
| Capture, expire, ban, grant, a scoped role, clear | Decided | Those six, for a tester address only. A scoped role only on a generated plus-tag of the collector. | Product |
| Session generate without mail | Decided | No. Follow the captured link. | Product |
| Unban | Decided | No. A run that needs an unbanned address generates one. | Product |
| Store and auction seeds | Decided | Not this change. | Product |
| Preview and production | Decided | Capture and clear for production's named testers. Preview is production backends. | Product |
:::

:::detail{title="Staging test code map" for="engineer"}
- **Endpoint** — [`packages/grade10-auth/backend/src/routes/testDoor.ts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/backend/src/routes/testDoor.ts)
- **Where it opens** — `testDoorMoves` and `qaTokenTestDoorMoves` in [`packages/utils/src/env.ts`](https://github.com/9gag/grade10/blob/main/packages/utils/src/env.ts)
- **The access check** — [`packages/worker/src/testDoorOidc.ts`](https://github.com/9gag/grade10/blob/main/packages/worker/src/testDoorOidc.ts) and [`packages/worker/src/testDoorQaToken.ts`](https://github.com/9gag/grade10/blob/main/packages/worker/src/testDoorQaToken.ts)
- **Testers** — `grade10TestDoorEmails` in [`packages/grade10-auth/contracts/src/testDoorTesters.ts`](https://github.com/9gag/grade10/blob/main/packages/grade10-auth/contracts/src/testDoorTesters.ts)
- **The lane** — [`.github/workflows/e2e-hosted.yml`](https://github.com/9gag/grade10/blob/main/.github/workflows/e2e-hosted.yml)
- **Design record** — [security](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md) and [e2e](https://github.com/9gag/grade10/blob/main/docs/architecture/e2e.md)
- **Staging host** — `grade10-stg.com`
:::
