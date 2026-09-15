## User journeys

### grade10-site-site-navigation-US-06: Collector follows a link to a surface that needs an account

**As a** collector without a session,
**I want** to be asked to sign in where I am standing rather than taken to the
surface first,
**so that** dismissing the ask leaves me reading what I was reading, and
signing in puts me on the surface I asked for.

**Accepted by:**

- `grade10-site-site-navigation-SC-17` — A signed-out collector follows a link to a surface that asks
- `grade10-site-site-navigation-SC-18` — Dismissing leaves the collector where they were
- `grade10-site-site-navigation-SC-19` — Signing in finishes the navigation
- `grade10-site-site-navigation-SC-20` — The dropped navigation leaves no entry behind

### grade10-site-site-navigation-US-07: Collector opens a surface that needs an account at its own address

**As a** collector arriving from a bookmark, a mailed link or the back button,
**I want** the address I asked for to stay the address I am at while I sign in,
**so that** what I came for is what renders the moment I have a session, and
leaving without one puts me somewhere I can read instead of on a blank page.

**Accepted by:**

- `grade10-site-site-navigation-SC-21` — A signed-out collector opens the address itself
- `grade10-site-site-navigation-SC-22` — The session arrives and the surface renders
- `grade10-site-site-navigation-SC-23` — Back onto a surface that asks is answered there
- `grade10-site-site-navigation-SC-25` — Leaving the ask at the address goes to the brand home

### grade10-site-site-navigation-US-08: Collector opens a surface that asks nothing of them

**As a** collector with no session, or none yet answered,
**I want** a surface that is public, that invites me to sign in in its own
words, or that my link's own secret opens, to render as asked,
**so that** I am not stopped by a dialog in front of something I could already
read.

**Accepted by:**

- `grade10-site-site-navigation-SC-15` — A surface that answers the signed-out opens as asked
- `grade10-site-site-navigation-SC-16` — A secret in the link opens its surface
- `grade10-site-site-navigation-SC-24` — A public surface does not wait
