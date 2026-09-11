## ADDED Requirements

### Requirement: A role chip may link to that role's grants page

When the console supplies a per-role address for an account's roles, `UserTable`
SHALL render each role name in the Roles cell as a link to that role's address.
Row CTAs — sessions, roles edit, ban or unban, and delete — SHALL behave as they
already do and SHALL NOT be replaced by those links. When the console supplies
no per-role address, the Roles cell SHALL show the role names without links.

#### Scenario: shared-console-user-directory-SC-11 - A role chip links to the supplied address

- **GIVEN** a console that supplies an address for `staff` and for `support` on a row that holds both
- **WHEN** the operator activates the `staff` chip
- **THEN** navigation uses the address supplied for `staff`
- **AND** activating the `support` chip uses the address supplied for `support`

#### Scenario: shared-console-user-directory-SC-12 - CTAs stay beside linked role chips

- **GIVEN** a console that supplies per-role addresses and a roles handler
- **WHEN** the table renders a row
- **THEN** the roles CTA still appears and still opens the roles dialog
- **AND** the sessions action still appears

#### Scenario: shared-console-user-directory-SC-13 - Roles without addresses stay plain text

- **GIVEN** a console that supplies no per-role addresses
- **WHEN** the table renders a row with roles
- **THEN** each role name is shown
- **AND** none of those names is a link
