## Requirements

<!-- trace:scenario id=scn_demo_signin key=visitor-signs-in rev=2 -->
#### Scenario: A visitor signs in
**WHEN** the visitor submits valid details
**THEN** the visitor enters the account

<!-- trace:scenario id=scn_demo_error key=visitor-sees-error rev=1 -->
#### Scenario: A visitor sees a rejected sign-in
**WHEN** the visitor submits invalid details
**THEN** the form explains the problem

<!-- trace:scenario id=scn_demo_unlinked key=visitor-reads-settings rev=1 -->
#### Scenario: A visitor reads the settings page
**WHEN** the visitor opens the settings page
**THEN** the settings page is visible

<!-- trace:case id=tcase_demo_acceptance rev=2 covers=scn_demo_signin,scn_demo_error -->
### demo-US1-TC1-1: The visitor signs in

<!-- trace:case id=tcase_demo_manual rev=3 covers=scn_demo_error -->
### demo-US1-TC2-1: The visitor sees a rejected sign-in

### demo-US1-TC3-1: The visitor updates settings

#### Scenario: A visitor checks account preferences
**WHEN** the visitor opens preferences
**THEN** the preference choices are visible
