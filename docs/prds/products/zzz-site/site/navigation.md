---
title: Navigation
spec: zzz-site/site/navigation
order: 1
---

ZZZ has three surfaces — home, sign-in and the profile — and each answers at an
address of its own, whether it is reached by a link or by a refresh. A surface
owns the addresses beneath it unless a nested surface names one, and an address
under no surface renders a not-found surface naming it. Falling back to home is
the specific mistake this rules out.

Home and sign-in are session-decided: a signed-in collector who opens either is
sent on to the profile, replacing the history entry so going back never returns
to the address that bounced.

## The Profile Without a Session

The profile answers differently. It has nothing to show without a session, but
it is not corrected — the collector keeps the address they asked for while
they sign in.

- 🚧 **The address stays put** — a collector without a session who opens the
  profile, by a typed address, a bookmark, or the back button, lands there. The
  sign-in dialog opens over it, and signing in renders the profile at that same
  address with no navigation in between
- 🚧 **Leaving goes home** — dismissing the dialog without a session takes the
  collector to home instead, replacing the entry the profile holds, so going
  back leads where they came from rather than to the profile asking again

Everything else matches grade10's navigation contract: moving between surfaces
stays in the page, the browser's own clicks are left untouched, back and forward
restore the scroll position the collector left, a new entry starts at the top,
and opening a surface downloads no other surface's code.

What a response says before scripts run is deliberately not this capability's.
ZZZ is served as one shell for every address; the day it has a public surface,
whatever specs that surface will own it.
