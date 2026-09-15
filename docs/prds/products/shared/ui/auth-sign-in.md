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

- 🚧 **After a successful send** — the dialog body shows confirmation that
  names the address, a Resend control with a sixty-second countdown while it
  waits (**Resend (45)**), and a control that returns to the entry step
  (Google Continue when offered, plus email). The email-step action reads
  **Sign In with Email**.

::story{id="auth-sign-in-signincard--link-sent" title="Link sent"}

::story{id="auth-sign-in-signinlinksent--resend-cooldown" title="Resend countdown"}

## Boundaries

The dialog is the surface; what a successful sign-in creates is
[the sign-in capability](/p/shared/auth/sign-in). Every word arrives through
the copy props, and the email step is its own export for a surface that
composes it differently.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488" title="Login Dialog"}
