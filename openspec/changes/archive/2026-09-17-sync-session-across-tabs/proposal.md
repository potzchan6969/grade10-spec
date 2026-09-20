**Author:** @sean - 2026-09-15

## Why

A collector asks for a sign-in link, leaves for their inbox, and follows the
link in a new tab. They are now signed in — everywhere except the tab they
were working in, which still shows **Check Your Email** over the cart they
were filling or the lot they were bidding on. Nothing in that tab is watching
for a session it did not create itself, so it goes on offering sign-in to
somebody who is already signed in. The collector reloads it, presses the
refused thing a second time, or asks for another link.

The same hole runs in reverse and sideways. Signing out in one tab leaves the
others showing a signed-in person who is not signed in. Worse, when a second
person signs in on the same browser, the first tab keeps showing the first
person's cart while every request it makes is already the second person's.

**Metric:** share of email sign-ins where the thing the collector was stopped
from doing is completed, and the share of link follows followed within a
minute by a reload or a second link request.

**Acceptance signal:** with two tabs of the brand open, following the link in
one leaves the other signed in by the time it is looked at, with the dialog
gone and the refused action done; signing out in one leaves the other signed
out; a second person signing in leaves the first tab showing that person and
their own cart.

## What Changes

- **An open tab is never stale to the person reading it.** A surface reflects
  a session that arrived, ended, or became someone else on this device, no
  later than when the person returns to it — and promptly for a surface of the
  same site, whether they left it or not, so a tab kept on a second monitor
  keeps up too.
- **Only a definite answer signs anybody out.** A surface that cannot reach the
  auth service goes on showing what it last knew and asks again later, rather
  than reading a train tunnel as a sign-out.
- **A session that ran out counts as one that ended** — the tab shows them
  signed out either way, rather than offering a signed-in surface every
  request behind it will refuse.
- **What a surface shows about the person follows the person.** When the
  session becomes somebody else, the tab shows that person's own cart,
  watchlist and orders, never the last person's.
- **The surface that asked carries on.** The tab where the link was asked for
  closes its sign-in dialog and completes what the collector was refused — the
  add, the bid, the navigation they were stopped before — the same way an in
  page Google sign-in already does. It is tried once, and a card that sold out
  while they were in their inbox refuses the ordinary way rather than silently
  doing nothing.
- **A signed-in page under a person who left behaves as it does on arrival.** A
  tab sitting on the orders list when the session ends asks for sign-in and
  goes to the front door when that ask is dismissed — what typing that address
  signed out already does.

## Non-Goals

- **Another device** — a link followed on a phone does not sign in a desktop.
  The session lives in one browser, and nothing here reaches outside it.
- **Another brand** — a Grade10 session still leaves a ZZZ tab signed out.
- **Live server push** — the tab reads the session it can already reach; no
  socket, no poll against the auth service.
- **When a link creates a session** — one-time use, the sixty-second lifetime,
  and the resend window stay as specified.
- **A failed link follow** — expired, dead, and banned keep the brand-home
  toast `sign-in-link-follow-feedback` specifies, and nothing announces them
  in another tab.
- **Announcing the sync** — the tab changes what it shows; it raises no toast
  saying it did.
- **The operator consoles' second factor** — a console tab that picks up a
  session still proves the second factor before it shows anything.
- **Ending another browser's sessions** — that is `shared/auth/sessions`.
- **A ban that lands on an open session** — whether moderating an account ends
  the sessions it already has belongs to moderation, not to this change. An
  open tab keeps up with whatever the session does.
- **Who a console lets in** — a console tab picks up the session like any
  other surface; whether that person may use the console stays the console's
  own rule.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/auth/session` — an open surface reflects a session that arrived,
  ended, or became somebody else on this device, no later than when the person
  returns to it, and what it shows about the person follows the person.
- `shared/auth/sign-in` — the surface that asked for the link carries on when
  the session arrives from elsewhere: the dialog closes and the refused action
  completes.

## Impact

- **The four applications' session reads** — the auth client already re-reads
  the session when a tab is returned to, and already tells other tabs of the
  same site about a sign-out. What no surface does is act on a session it did
  not create itself, and a link followed elsewhere tells nobody. Engineering
  starts from what is already there rather than building a second mechanism
  beside it.
- **Surfaces that key on the person** — the cart already re-keys when the
  session changes hands; the auction and account surfaces read only whether
  somebody is signed in, and each needs checking against a person change.
- **`@grade10/ui`** — no export change; the sign-in blocks already take their
  state from the consumer.
- **`@grade10/i18n`** — no new keys; nothing new is said to the collector.
- **The manual** — Session · Open Tabs, Sign-In · Following the Link.
- **Test suites** — feature cases on both capabilities.

## References

- [Session · Open Tabs](../../../docs/prds/products/shared/auth/session.md#open-tabs)
- [Sign-In · Following the Link](../../../docs/prds/products/shared/auth/sign-in.md#following-the-link)
