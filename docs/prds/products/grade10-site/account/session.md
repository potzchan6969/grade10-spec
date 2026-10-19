---
title: Session
spec: shared/auth/session
order: 2
---

A session keeps a person signed in on one site or console. Each has its own session, and the two never share one.

## Two Sessions

- 🚧 **The console is its own sign-in** — signing in to the console does not sign anyone in on the site, and signing in on the site does not open the console. A person can hold one, the other or both, as two different accounts
- 🚧 **Each session ends on its own** — the site session ending says nothing about the console's, and the other way round
- 🚧 **Operator actions need the console's sign-in** — a site sign-in never counts as the second factor, or the recent sign-in, an operator action asks for
- 🚧 **Release asks operators to sign in once more** — the console stops honouring the site's session at release. Customer sessions are untouched

## Open Tabs

A session belongs to the browser, not to one tab. Every tab of the same site or console reads the same session.

- **Signed in somewhere else** — a tab left open shows the person signed in. A collector who followed the emailed link in a new tab does not need to reload the old one
- **Signed out somewhere else** — that tab shows them signed out. A session that ran out on its own counts as one they ended. A tab on a signed-in page asks for sign-in
- **Someone else signed in** — the tab shows whoever is signed in now. Their cart, watchlist and orders are theirs, never the last person's
- **When it catches up** — no later than when the person comes back to the tab, and promptly for a tab on the same site or console
- **When it cannot tell** — a tab that cannot reach us keeps what it last showed and asks again later. Only a clear answer signs anyone out

## Session Lifetime

- ❓ **How long a session lasts** — a site session lasts one week, and a refresh extends it. A console session lasts 8 hours, or ends after 30 minutes idle, as proposed. No change specifies the refresh yet. The sign-in link's five minutes does not bound it, because the link is used up when it creates the session. Owner: Product

## Who Is Signed In

- **Signed in** — a request carries the person's id, email, name and roles
- **Signed out** — a request carries no person at all
- **Account key** — account data is filed under the user id, and nothing else. An email is an attribute, so changing an address changes data, not the key
- **Analytics** — a signed-in event names the person by user id. An anonymous event names the device. Signing in links the device to the person, so one visit does not look like two strangers. Each product decides which events it records
