## Feature set

- Sign-in surface contract
  - Sign-in exports: Name exactly what the shared UI package publishes for the sign-in surface.
  - Dialog shell: Render sign-in as a modal over a scrim, not as a page-level card.
  - Dismissal: Let the collector leave the dialog and land back where they were.
- Sign-in body composition
  - Provider before email: Order the body the way the design draws it.
  - Legal line: Carry the legal text the design draws as the body's last node.

## MODIFIED Requirements

### Requirement: The collector can leave the sign-in dialog

`SignInCard` SHALL be dismissible by a close control in its header, by the
Escape key, and by activating the scrim. Each SHALL call `onOpenChange` with
`false` and SHALL NOT navigate away from the page beneath.

Dismissal SHALL be the only way out of the dialog the block offers.
`SignInCard` SHALL NOT accept an exit action, and SHALL draw no control that
leaves the flow by any other route.

#### Scenario: shared-ui-auth-sign-in-SC-04 - Dismissing returns the collector to what they were doing

- **GIVEN** an open sign-in dialog over a page
- **WHEN** the collector activates the close control, presses Escape, or activates the scrim
- **THEN** `onOpenChange` is called with `false`
- **AND** the collector is left on the page beneath with its state intact

#### Scenario: shared-ui-auth-sign-in-SC-09 - The dialog offers no exit beside dismissal

- **GIVEN** `SignInCard` rendered with a step, a status message, and legal copy
- **WHEN** the dialog renders
- **THEN** no control that leaves the flow renders beside the header's close control
