---
title: Account Profile
spec: grade10-store/account-profile
order: 7
---

A collector who signs in has no identity in the product today. The account
page asks them to create a profile before it shows them anything — the profile
row only materializes when someone writes to it, so a first visit reads null
and renders "You have no profile yet." Almost nobody fills a blank form for a
page only they can see.

The profile exists from the first sign-in instead. Display name, avatar and
bio are there to be edited, not created; the empty states say what a field
does rather than that nothing exists. An absent profile and one deliberately
left sparse stop looking identical in the data, which is what makes any of
this measurable.

The behavior that already ships — the field limits, the create and edit
states, the `store-profile` block's exports — gets written down as the
contract at the same time, because none of it is specified anywhere today.
