**Author:** @seankcw - 2026-08-27

## Why

A collector who is asked to sign in mid-flow — adding a card to the cart,
placing a bid — is taken out of that flow. `SignInCard` is a `Card`, a
page-level surface, so the application has to navigate to a sign-in route and
navigate back, and whatever the collector was doing is gone by the time they
return.

That is not what design drew. The Figma Auth Sign-In page contains exactly four
things: `Login Dialog` (448×346), `OTP Dialog` (448×354),
`Login Dialog Overlay` (a 1440×1024 scrim filled `#0A0A0A4D`), and
`Google Icon`. No card-on-a-page layout is drawn anywhere in the file. Sign-in
has always been specified as a modal over the page the collector is already on;
the code has been a card since it was written, and nothing caught it because
`auth-sign-in` carries no audit table and no capability spec.

**Metric:** share of sign-ins started from a mid-flow action that return the
collector to that action without a re-navigation — from none today, because
the surface cannot overlay, to every one.
**Acceptance signal:** triggering sign-in from the cart leaves the cart page
mounted behind a scrim, and dismissing the dialog returns to it with the cart
intact.

## What Changes

- **`SignInCard` renders a dialog, not a card.** It composes `DialogContent`
  over `DialogOverlay` instead of `Card`, picking up the 448px width, 32px
  radius, 24px padding and 24px gap the design draws — every one of which the
  design system's `Dialog` already matches, so no primitive changes.
- **`SignInCard` becomes a controlled overlay.** It gains required `open` and
  `onOpenChange` props. **BREAKING** for every consumer: the export name and
  import path are unchanged, but a card that always rendered is now a dialog
  that must be opened.
- **The provider button moves above the divider.** Figma orders the body
  Google button → divider → email section → legal. The code orders it email
  step → divider → provider. **BREAKING** for consumers relying on the current
  visual order.
- **A close affordance appears.** `DialogHeader` already renders one by
  default, so dismissal arrives with the container. The dialog is dismissible
  by close control, Escape, and scrim click.
- **`SignInCardCopy` gains `legal`.** Figma draws a legal line as the last node
  in the body; the code has no slot for it. Optional, so **not breaking**.
- **`shared-ui/auth-sign-in` is specified for the first time.** The three
  exports have shipped since `add-auth-session` with no capability spec naming
  them.

## Non-Goals

- **The step machine.** Which step renders — magic link, code, OAuth, or any
  mix — stays the consuming application's decision. This change moves the
  shell, not the flow.
- **`auth-two-factor`.** `TwoFactorVerifyForm` has the same 16px-vs-24px body
  gap against the `OTP Dialog`, but its shell is the consumer's today and
  giving it one is its own change.
- **The Google button itself.** Figma publishes `Google Icon` (`4674:4180`)
  and draws a provider button; the widget stays consumer-owned through
  `providerSlot`, as it is now.
- **Retiring `Card` from the package.** `Card` is correct everywhere else it
  is used; only this block was built on the wrong primitive.
- **Code Connect templates for the auth components.** None of the four Figma
  auth components is connected. Worth doing, and not part of moving this
  contract.

## Capabilities

### New Capabilities

- `shared-ui/auth-sign-in`: the sign-in surface's export contract, its dialog
  shell and scrim, its body composition order, and its dismissal behavior.

### Modified Capabilities

None.

## Impact

`packages/ui` `auth-sign-in` block and its stories. Consuming store
applications must own `open` state, render `SignInCard` from wherever the
sign-in is triggered rather than from a route, supply the new `legal` copy if
they want the line design draws, and stop relying on the provider slot
rendering below the divider. No design-system change: `DialogContent`,
`DialogOverlay`, `DialogHeader` and `DialogBody` already carry every value
Figma specifies, and `--overlay` already resolves to the exact `#0A0A0A4D` the
scrim is drawn with.
