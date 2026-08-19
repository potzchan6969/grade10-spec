## ADDED Requirements

### Requirement: A sign-out control shows the request in flight

A signed-in surface's sign-out control SHALL show a busy state while the
sign-out request runs and SHALL NOT accept another activation until the
request settles.

#### Scenario: The control is busy while sign-out runs

- **GIVEN** a signed-in surface with a sign-out control
- **WHEN** the person activates it
- **THEN** the control shows a busy state until the auth service answers
- **AND** activating it again during that time does nothing

### Requirement: A confirmed sign-out returns the surface to its signed-out presentation

WHEN the auth service confirms a sign-out, the surface SHALL leave the
signed-in presentation: an admin panel returns to its sign-in page, and the
grade10 site's profile returns to the marketing page. Surface-owned cleanup
(such as the storefront emptying this browser's cart) SHALL run only on a
confirmed sign-out.

#### Scenario: An operator signs out of an admin panel

- **GIVEN** an operator signed in to an admin panel
- **WHEN** they sign out and the auth service confirms
- **THEN** the panel shows its sign-in page

#### Scenario: A collector signs out of the grade10 site

- **GIVEN** a collector on the grade10 site's profile
- **WHEN** they sign out and the auth service confirms
- **THEN** the site shows the marketing page

### Requirement: A refused sign-out is reported, never silent

WHEN a sign-out request fails or the auth service refuses it, the surface
SHALL stay in its signed-in presentation and SHALL show failure feedback
beside the sign-out control. The control SHALL remain usable, and a retry
SHALL clear the feedback while the new request runs.

#### Scenario: A refused sign-out is reported

- **GIVEN** a signed-in surface whose sign-out request the auth service
  refuses
- **WHEN** the person activates sign-out
- **THEN** the surface stays signed in
- **AND** failure feedback appears beside the control

#### Scenario: A retry clears the failure

- **GIVEN** a surface showing sign-out failure feedback
- **WHEN** the person activates sign-out again
- **THEN** the feedback clears for the new attempt
- **AND** a confirmed answer signs the surface out
