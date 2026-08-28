# shared-auth/sign-out Specification

## Purpose
What activating a sign-out control does on any signed-in surface of either
brand: what the person sees while the request runs, what a confirmed sign-out
leaves them looking at, and what a refused one tells them. One contract for
the grade10 site's profile, the zzz storefront's profile, and both admin
panels, so no sign-out tap ends in silence. Where the sign-out button sits and
what a surface cleans up afterwards stay with the surface.

## Feature set

- In-flight control
  - Busy until settled: the control shows the request and refuses a second activation
- Confirmed sign-out
  - Signed-out surface: an admin panel returns to sign-in; the site profile returns to marketing
- Refused sign-out
  - Reported failure: a refusal is shown and a retry clears it

## User journeys

### sign-out-US-01: Collector or operator signs out and lands signed out

**As a** signed-in person,
**I want** the control to show the request in flight and, on success, leave the signed-in surface,
**so that** I know the tap registered and I am not still looking at my account.

**Accepted by:**

- `sign-out-SC-01` — The control is busy while sign-out runs
- `sign-out-SC-02` — An operator signs out of an admin panel
- `sign-out-SC-03` — A collector signs out of the grade10 site

### sign-out-US-02: Collector or operator retries a refused sign-out

**As a** signed-in person,
**I want** a refused sign-out named as a failure I can retry,
**so that** a network miss does not leave me signed in with no explanation.

**Accepted by:**

- `sign-out-SC-04` — A refused sign-out is reported
- `sign-out-SC-05` — A retry clears the failure

## Requirements
### Requirement: A sign-out control shows the request in flight

A signed-in surface's sign-out control SHALL show a busy state while the
sign-out request runs and SHALL NOT accept another activation until the
request settles.

#### Scenario: sign-out-SC-01 - The control is busy while sign-out runs

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

#### Scenario: sign-out-SC-02 - An operator signs out of an admin panel

- **GIVEN** an operator signed in to an admin panel
- **WHEN** they sign out and the auth service confirms
- **THEN** the panel shows its sign-in page

#### Scenario: sign-out-SC-03 - A collector signs out of the grade10 site

- **GIVEN** a collector on the grade10 site's profile
- **WHEN** they sign out and the auth service confirms
- **THEN** the site shows the marketing page

### Requirement: A refused sign-out is reported, never silent

WHEN a sign-out request fails or the auth service refuses it, the surface
SHALL stay in its signed-in presentation and SHALL show failure feedback
beside the sign-out control. The control SHALL remain usable, and a retry
SHALL clear the feedback while the new request runs.

#### Scenario: sign-out-SC-04 - A refused sign-out is reported

- **GIVEN** a signed-in surface whose sign-out request the auth service
  refuses
- **WHEN** the person activates sign-out
- **THEN** the surface stays signed in
- **AND** failure feedback appears beside the control

#### Scenario: sign-out-SC-05 - A retry clears the failure

- **GIVEN** a surface showing sign-out failure feedback
- **WHEN** the person activates sign-out again
- **THEN** the feedback clears for the new attempt
- **AND** a confirmed answer signs the surface out
