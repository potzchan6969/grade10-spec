---
title: Navigation
spec: grade10-site/site/navigation
order: 3
---

## One Address, One Surface

Every address resolves to at most one surface. A surface owns the addresses
beneath it unless a nested surface names one, and the deepest surface naming an
address is the one that renders. An address under no surface renders not-found,
naming the address that failed.

## Following a Link

A link from one surface to another — including one in the header — navigates
without reloading the document. The browser's own clicks are left alone: a
modified click, a link that declares it opens elsewhere, and another origin all
behave exactly as the browser intends.

## Surfaces That Need an Account

A surface with nothing on it for a collector without a session asks for one.
Where it asks decides what the collector is left holding.

- 🚧 **Asked before the address changes** — a collector without a session who
  follows a link to one of these is asked where they are. The address does not
  change, the sign-in dialog opens over what they were reading, and dismissing
  it leaves them on that page
- 🚧 **Signing in finishes the move** — a session that arrives while the dialog
  is open takes the collector to the surface they asked for, with nothing to
  press again
- 🚧 **An address opened from outside is answered where it lands** — a typed
  address, a bookmark, a mailed link or the back button lands on the surface
  itself, and it asks there. Nothing corrects the address, and signing in
  renders what the collector came for
- 🚧 **Leaving the ask there goes to the front door** — a collector who
  arrived has no page behind them to be left on, so dismissing takes them to
  the brand home in place of the surface, and going back leads where they came
  from. One stopped at a link still has what they were reading, and stays on it
- 🚧 **A link carrying its own secret is never asked** — a surface opened by
  the secret in its link, and one that invites sign-in in its own words, opens
  as asked

Nothing else waits for the session: a public surface renders before the session
answers.

## Scroll Position

Back and forward return the collector to the scroll position they left an entry
at, while a navigation to a new entry starts at the top.

## Page Code

A surface costs only itself: opening one downloads no other surface's page code.
