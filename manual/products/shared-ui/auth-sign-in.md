---
title: Sign-In Dialog
spec: shared-ui/auth-sign-in
order: 8
---

A collector asked to sign in mid-flow — adding a card to the cart, placing a
bid — is currently taken out of that flow. `SignInCard` is a `Card`, a
page-level surface, so the application navigates to a sign-in route and back,
and whatever the collector was doing is gone when they return.

That is not what design drew. The Figma Auth Sign-In page contains a Login
Dialog, an OTP Dialog, an overlay scrim and a Google icon — no card on a page
anywhere. Sign-in has always been specified as a modal over the page the
collector is on; the code has been a card since it was written, and nothing
caught it because `auth-sign-in` carried no capability spec.

The block becomes the dialog design drew, and the contract that matters is the
return: a sign-in started from a mid-flow action puts the collector back in
that action without a re-navigation, on every surface of either brand.
