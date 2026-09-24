## Requirements

<!-- trace:scenario id=demo/SC/sign-in-001 rev=2 -->
#### Scenario: A visitor signs in
**WHEN** the visitor submits valid details
**THEN** the visitor enters the account

<!-- trace:scenario id=demo/SC/sign-in-002 rev=1 -->
#### Scenario: A visitor sees a rejected sign-in
**WHEN** the visitor submits invalid details
**THEN** the form explains the problem

<!-- trace:scenario id=demo/SC/settings-00z rev=1 -->
#### Scenario: A visitor reads the settings page
**WHEN** the visitor opens the settings page
**THEN** the settings page is visible

<!-- trace:case id=demo/TC/sign-in-003 rev=2 covers=demo/SC/sign-in-001,demo/SC/sign-in-002 -->
### demo-US1-TC1-1: The visitor signs in

<!-- trace:case id=demo/TC/sign-in-004 rev=3 covers=demo/SC/sign-in-002 -->
### demo-US1-TC2-1: The visitor sees a rejected sign-in

### The visitor updates settings

#### Scenario: A visitor checks account preferences
**WHEN** the visitor opens preferences
**THEN** the preference choices are visible
