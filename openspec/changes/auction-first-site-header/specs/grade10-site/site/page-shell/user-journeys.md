## User journeys

### grade10-site-site-page-shell-US-01: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

**Accepted by:**

- `grade10-site-site-page-shell-SC-01` — Every address is wrapped
- `grade10-site-site-page-shell-SC-02` — The shell is not a page
- `grade10-site-site-page-shell-SC-03` — The page has one of each landmark
- `grade10-site-site-page-shell-SC-15` — A narrow viewport
- `grade10-site-site-page-shell-SC-20` — Compact menu reaches nav and language

### grade10-site-site-page-shell-US-02: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
with only the account entry updating once it does,
**so that** I can start navigating immediately without unrelated chrome
shifting under me.

**Accepted by:**

- `grade10-site-site-page-shell-SC-04` — A first paint while the session resolves
- `grade10-site-site-page-shell-SC-05` — No layout shift when the session arrives

### grade10-site-site-page-shell-US-03: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and an account menu of Profile, My
Auctions, and Sign out when I am signed in,
**so that** one place in the header takes me where I can go for this launch.

**Accepted by:**

- `grade10-site-site-page-shell-SC-06` — Signed in
- `grade10-site-site-page-shell-SC-07` — Signed out
- `grade10-site-site-page-shell-SC-08` — Sign-out has one home
- `grade10-site-site-page-shell-SC-17` — Account menu lists auction-first destinations
- `grade10-site-site-page-shell-SC-18` — Sign out from the menu

### grade10-site-site-page-shell-US-04: Collector follows only links the site answers

**As a** collector,
**I want** the chrome to show a control or a link only when the site answers
its destination, with language options rather than currencies,
**so that** nothing in the header or the footer leads me to a not-found page or
implies a currency I cannot switch.

**Accepted by:**

- `grade10-site-site-page-shell-SC-09` — Absent surfaces are absent controls
- `grade10-site-site-page-shell-SC-10` — Navigation lists real surfaces
- `grade10-site-site-page-shell-SC-11` — The footer drops what it cannot reach
- `grade10-site-site-page-shell-SC-12` — The promo bar and utility row wait for their pages
- `grade10-site-site-page-shell-SC-16` — Store surfaces offer Cart
- `grade10-site-site-page-shell-SC-19` — Language switch, not currency

### grade10-site-site-page-shell-US-05: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

**Accepted by:**

- `grade10-site-site-page-shell-SC-13` — A collector is on a listed surface
- `grade10-site-site-page-shell-SC-14` — A collector is on an unlisted surface
