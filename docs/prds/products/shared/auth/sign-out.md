---
title: Sign-Out
spec: shared/auth/sign-out
order: 3
---

Pressing sign out shows the request running and refuses a second press until it
settles. When it succeeds, the surface returns to its signed-out presentation:
an admin console goes back to its sign-in page, the site's profile back to
marketing. When it is refused, the person is told what happened, and retrying
clears the message.

That is the whole contract, and it exists because the alternative is worse than
a failure — a tap that appears to do nothing leaves someone believing they are
signed out when they are not.

Where the control sits and what a surface cleans up afterwards belong to the
surface. On the grade10 site the profile offers sign-out, and the site header
account menu offers it too when the collector is signed in —
[Page Shell](/p/grade10-site/site/page-shell).
