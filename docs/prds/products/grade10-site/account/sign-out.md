---
title: Sign-Out
spec: shared/auth/sign-out
order: 3
---

## Pressing Sign Out

- **Running** — pressing sign out shows the request running. A second press is refused until it finishes
- **Refused** — the person is told what happened. Trying again clears the message
- **Why there is feedback** — a button that appears to do nothing leaves someone thinking they are signed out when they are not

## After Signing Out

- **Console** — the console goes back to its sign-in page
- **Site** — the site's profile goes back to marketing
- 🚧 **Ends one session only** — signing out of the console leaves the person signed in on the site, and signing out on the site leaves the console signed in

## Where the Button Is

The control's place, and what a surface clears afterwards, belong to the surface. On the grade10 site, the profile offers sign-out. So does the header account menu, when a collector is signed in — [Page Shell](/p/grade10-site/site/page-shell).
