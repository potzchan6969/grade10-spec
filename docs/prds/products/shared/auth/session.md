---
title: Session
spec: shared/auth/session
order: 2
---

Reading the caller on a signed-in request gives four things: id, email, name and
roles. Reading it on a signed-out request gives no person at all — there is no
half-signed-in state for a product to interpret.

The user id is the only identity key. Account data and one person's reference to
another are stored against it; an email is an attribute of the account, never
the thing it is filed under. That is what makes changing an address a change of
data rather than a migration.

A session covers the surface it was made on and no other brand's, as
[Sign-In](/p/shared/auth/sign-in) says.

## Two Sessions

🚧 **The console is its own sign-in** - signing in to the admin console does not sign the person in on the site, and signing in on the site does not open the console. A person holds one, the other, or both, and the two can be different accounts.

🚧 **Each session ends on its own** - the site session lasting, expiring or ending says nothing about the console's, and the other way round.

🚧 **Second factor and recent sign-in count on the console** - a sign-in on the site never counts as the recent sign-in an operator action asks for.

🚧 **Release asks operators to sign in once more** - the console stops honouring the site's session at release. Customer sessions are untouched.

Analytics follows the same key: a signed-in event names the person by user id,
an anonymous one names the device, and signing in links that device to the
person so a visit does not read as two strangers. Which events a product records
is that product's business.

## How Long It Lasts

- ❓ **Session lifetime** — nobody has written how long a session lasts, or
  what ends one besides signing out. The sign-in link's own five minutes do
  not bound it: the link is spent the moment it creates the session.

## Open Tabs

A session belongs to the browser, not to one tab. Every tab of the same
surface, site or console, is reading the same one.

- **Signed in somewhere else** — a tab left open shows the person signed in,
  so a collector who followed the emailed link in a new tab does not have to
  reload the old one.
- **Signed out somewhere else** — that tab shows them signed out. A session
  that ran out on its own counts as one they ended, and a tab sitting on a
  signed-in page then asks for sign-in, exactly as it would had they opened
  that page signed out.
- **Somebody else signed in** — the tab shows whoever is signed in now, and
  what it shows about them is theirs: their cart, their watchlist, their
  orders, never the last person's.
- **When it keeps up** — no later than when the person comes back to the tab,
  and promptly for a tab on the same surface whether they left it or not.
- **When it cannot tell** — a tab that cannot reach us goes on showing what
  it last knew and asks again later. Only a definite answer signs anyone out.
