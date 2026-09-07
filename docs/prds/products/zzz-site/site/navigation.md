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

All three surfaces are session-decided, which is where ZZZ differs from
grade10. On grade10 only the profile and sign-in wait for the session and every
public surface answers without it; ZZZ has no public surface yet, so each of its
three answers with what the session allows. A correction replaces the history
entry it corrects, so going back never returns to the address that bounced.

Everything else matches grade10's navigation contract: moving between surfaces
stays in the page, the browser's own clicks are left untouched, back and forward
restore the scroll position the collector left, a new entry starts at the top,
and opening a surface downloads no other surface's code.

What a response says before scripts run is deliberately not this capability's.
ZZZ is served as one shell for every address; the day it has a public surface,
whatever specs that surface will own it.

## What a collector does
