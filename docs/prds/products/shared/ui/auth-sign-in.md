---
title: Sign-In Dialog
spec: shared/ui/auth-sign-in
order: 8
---

Sign-in is a modal dialog over the page that asked for it, not a page of its
own. The page beneath stays mounted while the dialog is open, so a collector
asked to sign in mid-flow — adding a card to the cart, placing a bid — comes
back to exactly what they were doing, on every surface of either brand.
Leaving the dialog is always possible and lands them where they were.

## Shell

The dialog holds no open state of its own: the application controls
visibility through a required `open` prop and `onOpenChange` callback, which
is what lets any surface summon sign-in and decide what happens after. The
body renders in the order design draws it — the provider slot above the
divider, the email step below it — and closes on a legal line the
application supplies as the last node.

## Boundaries

The dialog is the surface; what a successful sign-in creates is
[the sign-in capability](/p/shared/auth/sign-in). Every word arrives through
the copy props, and the email and code steps are their own exports for a
surface that composes them differently.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}
