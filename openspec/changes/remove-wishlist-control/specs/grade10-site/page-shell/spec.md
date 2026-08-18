## MODIFIED Requirements

### Requirement: The header shows only controls this site has surfaces for

The site SHALL supply the header a handler only for a control whose surface it
answers, so a control with nothing behind it does not render. Search and cart
SHALL NOT appear until the site answers them.

#### Scenario: Absent surfaces are absent controls

- **WHEN** the header renders
- **THEN** it shows the locale label and the account control
- **AND** no search or cart control appears
