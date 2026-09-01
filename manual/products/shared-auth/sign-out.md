---
title: Sign-Out
spec: shared-auth/sign-out
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
surface. On the grade10 site there is exactly one place: the profile. The header
deliberately offers no second one.

## What a collector or operator does

::journeys{id="shared-auth/sign-out"}
