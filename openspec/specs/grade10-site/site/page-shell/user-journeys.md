## User journeys

### page-shell-US-01: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

**Accepted by:**

- `page-shell-SC-01` — Every address is wrapped
- `page-shell-SC-02` — The shell is not a page
- `page-shell-SC-03` — The page has one of each landmark
- `page-shell-SC-15` — A narrow viewport

### page-shell-US-02: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
and unchanged once it does,
**so that** I can start navigating immediately without the chrome shifting
under me.

**Accepted by:**

- `page-shell-SC-04` — A first paint while the session resolves
- `page-shell-SC-05` — No layout shift when the session arrives

### page-shell-US-03: Collector reaches their account from the header

**As a** collector,
**I want** an account control that leads to my profile when I am signed in and
to sign-in when I am not,
**so that** one control in the header always takes me where I can go, and
signing out has a single home.

**Accepted by:**

- `page-shell-SC-06` — Signed in
- `page-shell-SC-07` — Signed out
- `page-shell-SC-08` — Sign-out has one home

### page-shell-US-04: Collector follows only links the site answers

**As a** collector,
**I want** the chrome to show a control or a link only when the site answers
its destination,
**so that** nothing in the header or the footer leads me to a not-found page.

**Accepted by:**

- `page-shell-SC-09` — Absent surfaces are absent controls
- `page-shell-SC-10` — Navigation lists real surfaces
- `page-shell-SC-11` — The footer drops what it cannot reach
- `page-shell-SC-12` — The promo bar and utility row wait for their pages

### page-shell-US-05: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

**Accepted by:**

- `page-shell-SC-13` — A collector is on a listed surface
- `page-shell-SC-14` — A collector is on an unlisted surface
