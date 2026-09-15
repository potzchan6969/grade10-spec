## Feature set

- Members-only cart
  - Sign-in before the cart: the Cart control opens sign-in while no session
    is signed in, and the drawer stays closed
  - The cart the ask was for: the drawer opens by itself once the session
    arrives, and nothing is left waiting when the ask is dismissed

## ADDED Requirements

### Requirement: The Cart control asks for sign-in before it opens the cart

While no session is signed in, activating the Cart control SHALL open the
site's sign-in dialog and SHALL NOT open the cart drawer. A session that is
still resolving counts as none, so the control asks.

When sign-in succeeds and the collector remains on the surface they asked
from, the site SHALL open the cart drawer they pressed for. When they dismiss
the dialog without signing in, they SHALL remain signed out with no drawer
open, and the site SHALL NOT open one later.

While a session is signed in, activating the Cart control SHALL open the cart
drawer.

#### Scenario: grade10-site-site-page-shell-SC-21 - A signed-out collector presses Cart

- **GIVEN** a signed-out collector on a surface whose header offers Cart
- **WHEN** they activate the Cart control
- **THEN** the sign-in dialog opens over the surface
- **AND** the cart drawer does not open

#### Scenario: grade10-site-site-page-shell-SC-22 - Sign-in opens the cart they asked for

- **GIVEN** a signed-out collector who opened sign-in from the Cart control
- **WHEN** they sign in successfully and remain on that surface
- **THEN** the cart drawer opens
- **AND** the sign-in dialog is closed

#### Scenario: grade10-site-site-page-shell-SC-23 - Dismissing sign-in opens nothing

- **GIVEN** a signed-out collector who opened sign-in from the Cart control
- **WHEN** they dismiss the dialog without signing in
- **THEN** they remain signed out on that surface
- **AND** no cart drawer is open

#### Scenario: grade10-site-site-page-shell-SC-24 - A member presses Cart

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **WHEN** they activate the Cart control
- **THEN** the cart drawer opens
- **AND** no sign-in dialog opens
