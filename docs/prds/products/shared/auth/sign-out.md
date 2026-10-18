---
title: Sign-Out
spec: shared/auth/sign-out
order: 3
---

## Signing Out

- **Running** — pressing sign out shows the request running, and refuses a second press until it settles
- **Success** — an admin console goes back to its sign-in page, and the site's profile goes back to marketing
- **Refused** — the person is told what happened, and retrying clears the message
- **Why there is feedback** — a tap that appears to do nothing leaves someone believing they are signed out when they are not
- 🚧 **Sign-out ends the surface's own session only** — signing out of the console leaves the person signed in on the site, and signing out on the site leaves the console signed in

## Where the Control Sits

Where the control sits, and what a surface cleans up afterwards, belong to the surface. On the grade10 site the profile offers sign-out, and so does the header account menu when the collector is signed in — [Page Shell](/p/grade10-site/site/page-shell).
