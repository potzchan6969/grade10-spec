---
title: Navigation
spec: grade10-site/site/navigation
order: 3
---

Once the site is running in the browser, every address resolves to at most one
surface. A surface owns the addresses beneath it unless a nested surface names
one, and the deepest surface naming an address is the one that renders. An
address under no surface renders not-found, naming the address that failed.

A link from one surface to another — including one in the header — navigates
without reloading the document. The browser's own clicks are left alone: a
modified click, a link that declares it opens elsewhere, and another origin all
behave exactly as the browser intends.

Two addresses are decided by the session, and only two: the profile and
sign-in. Each answers with what the session allows, and a correction *replaces*
the entry it corrects, so pressing back never returns a collector to the
address that just bounced them. Nothing else waits for the session.

Back and forward return the collector to the scroll position they left an entry
at, while a navigation to a new entry starts at the top. And a surface costs
only itself: opening one downloads no other surface's page code.

## What a collector does

::journeys{id="grade10-site/site/navigation"}
