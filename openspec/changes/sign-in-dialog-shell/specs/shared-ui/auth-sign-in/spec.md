## Feature set

- Sign-in surface contract
  - Sign-in exports: Name exactly what the shared UI package publishes for the sign-in surface.
  - Dialog shell: Render sign-in as a modal over a scrim, not as a page-level card.
  - Dismissal: Let the collector leave the dialog and land back where they were.
- Sign-in body composition
  - Provider before email: Order the body the way the design draws it.
  - Legal line: Carry the legal text the design draws as the body's last node.

## ADDED Requirements

### Sign-in surface contract

---

### Requirement: The sign-in surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the sign-in surface: `SignInCard`, `SignInEmailForm`,
`SignInCodeForm` — and exactly these types: `SignInCardAction`,
`SignInCardCopy`, `SignInCardProps`, `SignInEmailFormProps`,
`SignInEmailFormCopy`, `SignInCodeFormProps`, `SignInCodeFormCopy`.

#### Scenario: An application imports the sign-in surface

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

---

### Requirement: Sign-in renders as a modal dialog over a scrim

`SignInCard` SHALL render as a modal dialog layered over the page that
triggered it, and SHALL NOT render as a page-level card. The page beneath
SHALL remain mounted while the dialog is open.

Its visibility SHALL be controlled by the consumer through a required `open`
prop and a required `onOpenChange` callback. `SignInCard` SHALL NOT hold open
state of its own.

#### Scenario: The triggering page stays mounted

- **GIVEN** a collector on a page that triggers sign-in
- **WHEN** the consumer sets `open` to `true`
- **THEN** the sign-in dialog renders over that page behind a scrim
- **AND** the page beneath remains mounted with its state intact

#### Scenario: Visibility is the consumer's

- **GIVEN** `SignInCard` rendered with `open` set to `false`
- **WHEN** nothing else changes
- **THEN** no dialog and no scrim are shown

---

### Requirement: The collector can leave the sign-in dialog

`SignInCard` SHALL be dismissible by a close control in its header, by the
Escape key, and by activating the scrim. Each SHALL call `onOpenChange` with
`false` and SHALL NOT navigate away from the page beneath.

#### Scenario: Dismissing returns the collector to what they were doing

- **GIVEN** an open sign-in dialog over a page
- **WHEN** the collector activates the close control, presses Escape, or activates the scrim
- **THEN** `onOpenChange` is called with `false`
- **AND** the collector is left on the page beneath with its state intact

### Sign-in body composition

---

### Requirement: The provider slot renders above the divider

When `providerSlot` is supplied, `SignInCard` SHALL render it before the
divider, and SHALL render the active step after the divider. When
`providerSlot` is not supplied, `SignInCard` SHALL render neither the provider
slot nor the divider.

#### Scenario: A provider widget is supplied

- **GIVEN** `SignInCard` with a `providerSlot` and a step as its children
- **WHEN** the dialog renders
- **THEN** the provider slot appears above the divider
- **AND** the step appears below the divider

#### Scenario: No provider widget

- **GIVEN** `SignInCard` with no `providerSlot`
- **WHEN** the dialog renders
- **THEN** the step renders with no divider above it

---

### Requirement: The dialog carries a legal line the consumer supplies

`SignInCardCopy` SHALL accept an optional `legal` field. When it is supplied,
`SignInCard` SHALL render it as the last node of the dialog body, after the
step and after any status message. When it is absent, no legal node SHALL
render.

`SignInCard` SHALL NOT supply legal wording of its own — the block carries no
English.

#### Scenario: Legal copy is supplied

- **GIVEN** `SignInCard` whose `copy.legal` is set
- **WHEN** the dialog renders
- **THEN** that text renders as the last node in the dialog body

#### Scenario: Legal copy is omitted

- **GIVEN** `SignInCard` whose `copy.legal` is not set
- **WHEN** the dialog renders
- **THEN** no legal node renders
