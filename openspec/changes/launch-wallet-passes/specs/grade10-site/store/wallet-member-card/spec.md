## Feature set

- Operator ending
  - Console ending: an operator ends a pass for a member who cannot end it
    themselves, under the permission an elevated act requires, recorded like
    any other

## MODIFIED Requirements

### Requirement: A member ends a pass, and ending it ends what it can do

A member SHALL be able to end a pass in one action, and an operator SHALL be
able to end it for a member who asks under the permission an elevated act
requires, recorded in the operator log like any other. An operator holding no
such permission SHALL have the act refused by name rather than answered as
though it did not exist, and the console SHALL offer it only to an operator
who holds the permission. The console SHALL show which wallets the member is
carrying a pass in, so the operator ends one the member holds rather than one
they named from memory. Ending SHALL take effect at once: every code the ended
pass can make identifies nobody, whether or not the pass is still on the
member's phone. A member SHALL be able to add a new pass
afterwards.

#### Scenario: grade10-site-store-wallet-member-card-SC-24 - An ended pass identifies nobody
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **WHEN** a member ends their pass and a code it makes is then presented
- **THEN** it identifies nobody
- **AND** the member can add a new pass that does

#### Scenario: grade10-site-store-wallet-member-card-SC-38 - An operator ends a pass under the permission it requires
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **WHEN** an operator ends a member's pass
- **THEN** the act is recorded in the operator log with who and when
- **AND** an operator without that permission is refused by name, and is never
  offered the act in the console
