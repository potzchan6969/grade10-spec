## Context

The grade10 site already holds one address table that says how each surface is
served, and one sign-in dialog above the routes that any surface can ask to
open. What it has never held is the answer to "who is this surface for" in a
form anything but a route module can read: each session-shaped route wraps
itself in a guard of its own, and nothing above the routes knows a navigation
is about to land somewhere with nothing on it.

Every in-app navigation already goes through the router. The chrome renders
plain anchors — the design system's nav and footer are shared across products —
and a document-level click handler turns each same-origin anchor into a router
navigation, so there is exactly one place every link, every `navigate` call and
every redirect passes through.

## Goals / Non-Goals

**Goals:**

- One place decides whether a navigation is allowed to spend the address, so a
  link added later is covered by having been a link.
- One declaration of which surfaces need an account, read by both the ask
  before the move and the wait on arrival.
- A session arriving in page finishes what the collector was stopped on,
  deterministically rather than by watching two pieces of state settle.

**Non-Goals:**

- Changing the sign-in dialog, its steps or its copy.
- The email path. Following a link unloads the page, so nothing in process
  survives it.
- The ZZZ site, whose session surfaces keep asking after the navigation.

## Decisions

### The address table carries the second answer

The spec requires each session-shaped surface to declare what it does for a
collector without one. The site's address table already classifies every
surface by how it is served; this adds a second field to the session rows and
makes it a union member, so a session surface added without the answer is a
compile error rather than a page that silently strands someone.

- **Rejected: a list of gated addresses beside the guard.** Two lists of the
  same surfaces drift, and the drift is invisible — the wait on arrival and
  the ask before the move would disagree with nobody noticing until a
  collector found the empty page.
- **Rejected: reading the existing served-kind alone.** It conflates "no
  document, not crawled" with "needs an account", which would put the signing
  ceremony, the identity check and a booking's private link behind an ask their
  holders cannot answer.

### One guard above the routes, not a check at each link

The guard sits inside the sign-in overlay's provider and above every route, and
blocks a pending navigation whose destination the table says asks. The router's
own navigation blocking is what holds it, so the address never moves and no
history entry is created; releasing it resumes the same navigation.

- **Rejected: a guarded link component and a guarded navigate helper.** Every
  call site has to remember, the header's shared anchors cannot use it without
  binding the design system to this app's router, and a link added tomorrow
  skips the ask silently.
- **Rejected: a route-level check that redirects back.** The address has
  already moved by then, which is the defect.

### Back and forward are let through

A popped entry has already moved the browser before anything here is consulted,
and releasing a blocked pop leaves the address and the rendered surface
disagreeing. The guard reads the navigation's kind and declines to hold one.

- **Rejected: holding pops too.** The recovery path — pushing the collector
  back to where they were — is a second navigation the spec does not describe,
  and it fights the browser for the history stack.

### The overlay carries what the ask was for, and tells its exits apart

The shared sign-in overlay gains an optional `resume` on the ask, and a distinct
"a session arrived" exit beside the existing dismissal. The dialog runs the
first on success and drops it on dismissal; the guard passes "finish this
navigation" as the resume.

- **Rejected: the guard watching the session and the dialog's open flag.** The
  dialog closing and the session store updating are two state changes that can
  land in different commits, so a success and a dismissal are indistinguishable
  for one render — and the guard would cancel a navigation the collector had
  just earned. The explicit exit removes the ordering question entirely.
- **Rejected: a bare callback parameter on the ask.** Controls pass `openSignIn`
  straight to `onClick`, which would hand it a click event to treat as a
  continuation. An options object makes that a type error at the call site.

### A blocked navigation is answered exactly once

The router's blocker state lands a commit after React's, so the render that
closes the dialog still reads the navigation as blocked. The guard records that
it has answered and refuses a second release or cancel; the router rejects the
duplicate transition outright, so this is not a tidiness measure.

### The per-surface wait stays, as the arrival answer

The existing wrapper on each session route is what answers a typed address, a
bookmark, a mailed link and a pop. It is kept and re-pointed at the same table
the guard reads, so the surfaces that wait and the surfaces that ask are the
same surfaces by construction.

## Risks / Trade-offs

- **[A navigation held while the session is still resolving would read as a
  broken link]** → The guard holds only once the session has answered that
  there is none. Before that the navigation goes through and the surface's own
  wait answers it, which is what already happens today.
- **[An email sign-in loses the held navigation]** → Following the link unloads
  the document, so nothing survives to resume. The collector lands where every
  sign-in lands today; carrying the intended address through the link is the
  named follow-on, not a regression this introduces.
- **[Two blockers registered at once]** → The router holds one blocker per
  router. The site registers exactly one, at the root, above the routes that
  could otherwise add their own.
- **[The declaration is a second thing to remember when adding a surface]** →
  It is a compile error, not a convention: the table's row type requires it.
