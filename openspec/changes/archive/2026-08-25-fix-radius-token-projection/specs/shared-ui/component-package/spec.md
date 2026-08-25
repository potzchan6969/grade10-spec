## ADDED Requirements

### Requirement: A token-named utility resolves to that token's value

Where the design system exposes a design token as a named utility class, that
utility SHALL resolve to the value the token carries in `tokens.json`. The
generated theme CSS SHALL NOT declare a second value for a token the token
build already emits, whether literal or derived from another token, and SHALL
NOT define a scale by multiplying one token to produce the rest.

A utility that reads a token by name SHALL be interchangeable with the
arbitrary-property form naming the same token: `rounded-md` and
`rounded-(--radius-md)` SHALL render the same value.

#### Scenario: A designer changes a token value

- **WHEN** a token's value changes in `tokens.json` and the theme CSS is rebuilt
- **THEN** every utility named after that token renders the new value
- **AND** no component source changes

#### Scenario: A utility is named after a token

- **WHEN** a component applies a utility named after a design token
- **THEN** the rendered value equals that token's value in `tokens.json`
- **AND** it equals what the arbitrary-property form of the same token renders

#### Scenario: A scale is projected

- **WHEN** the design system exposes a token scale as utilities
- **THEN** each rung reads its own token
- **AND** no rung is computed from another rung's value
