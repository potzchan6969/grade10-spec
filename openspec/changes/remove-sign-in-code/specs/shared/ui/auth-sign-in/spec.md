## Feature set

- Sign-in surface contract
  - Sign-in exports: Name exactly what the shared UI package publishes for the sign-in surface, with no code step and no exit action.
  - Dialog shell: Render sign-in as a modal over a scrim, not as a page-level card.
  - Dismissal: Let the collector leave the dialog and land back where they were.
- Sign-in body composition
  - Provider before email: Order the body the way the design draws it.
  - Legal line: Carry the legal text the design draws as the body's last node.

## MODIFIED Requirements

### Requirement: The sign-in surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the sign-in surface: `SignInCard`, `SignInEmailForm` — and
exactly these types: `SignInCardCopy`, `SignInCardProps`,
`SignInEmailFormProps`, `SignInEmailFormCopy`.

The package SHALL NOT export `SignInCodeForm`, `SignInCodeFormProps`,
`SignInCodeFormCopy`, or `SignInCardAction`.

#### Scenario: shared-ui-auth-sign-in-SC-01 - An application imports the sign-in surface

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error
