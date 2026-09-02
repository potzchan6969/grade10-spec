## MODIFIED Requirements

### Requirement: A control renders only when it can act

`Nav` SHALL render its search, account, and cart controls only when the
application supplies a handler for that control. A control with no handler
SHALL be absent from the rendered header — not present and inert, and not
visually disabled.

`Nav` SHALL NOT render a wishlist control.

The locale control SHALL always display the supplied locale label, and SHALL
be interactive only when a handler is supplied.

#### Scenario: A storefront with no cart

- **GIVEN** an application that supplies no cart handler
- **WHEN** the header renders
- **THEN** no cart control appears in it, and no space is reserved for one

#### Scenario: Only the supplied controls appear

- **GIVEN** an application that supplies a handler for the account control alone
- **WHEN** the header renders
- **THEN** the account control appears
- **AND** the search and cart controls do not

#### Scenario: Wishlist is not a header control

- **WHEN** the header renders
- **THEN** no wishlist control appears, and no space is reserved for one

#### Scenario: The locale label without a handler

- **GIVEN** an application that supplies a locale label and no locale handler
- **WHEN** the header renders
- **THEN** the label is displayed
- **AND** nothing about it invites a click
