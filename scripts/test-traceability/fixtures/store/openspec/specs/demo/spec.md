## Requirements

<!-- trace:scenario id=g10.demo-sign-in.SC-001 rev=2 -->
#### Scenario: A visitor signs in
**WHEN** the visitor submits valid details
**THEN** the visitor enters the account

<!-- trace:scenario id=g10.demo-sign-in.SC-002 rev=1 -->
#### Scenario: A visitor sees a rejected sign-in
**WHEN** the visitor submits invalid details
**THEN** the form explains the problem

<!-- trace:case id=g10.demo-sign-in.TC-003 rev=2 covers=g10.demo-sign-in.SC-001,g10.demo-settings.SC-00z -->
### demo-US1-TC1-1: The visitor signs in

<!-- trace:case id=g10.demo-sign-in.TC-004 rev=3 covers=g10.demo-sign-in.SC-002 -->
### demo-US1-TC2-1: The visitor sees a rejected sign-in

### The visitor updates settings

#### Scenario: A visitor checks account preferences
**WHEN** the visitor opens preferences
**THEN** the preference choices are visible
