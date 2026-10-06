# shared/auth/sign-out — delta

## Feature set

- In-flight control
  - Busy until settled: the control shows the request and refuses a second activation
- Confirmed sign-out
  - Signed-out surface: an admin panel returns to sign-in; the site profile returns to marketing
- Refused sign-out
  - Reported failure: a refusal is shown and a retry clears it
- Own session only
  - One surface: signing out ends that surface's session and leaves the other surface signed in

## MODIFIED Requirements

### Requirement: A confirmed sign-out returns the surface to its signed-out presentation

WHEN the auth service confirms a sign-out, the surface SHALL leave the
signed-in presentation: an admin panel returns to its sign-in page, and the
grade10 site's profile returns to the marketing page. The confirmed sign-out
SHALL end the session of the surface it was made on and SHALL leave the
other surface's session as it was. Surface-owned cleanup (such as the
storefront emptying this browser's cart) SHALL run only on a confirmed
sign-out.

<!-- trace:scenario id=g10.shared-sign-out.SC-vrp rev=1 -->
#### Scenario: shared-auth-sign-out-SC-02 - An operator signs out of an admin panel
**Serves:** shared-auth-sign-out-US-01 - Collector or operator signs out and lands signed out

- **GIVEN** an operator signed in to an admin panel
- **WHEN** they sign out and the auth service confirms
- **THEN** the panel shows its sign-in page

<!-- trace:scenario id=g10.shared-sign-out.SC-x67 rev=1 -->
#### Scenario: shared-auth-sign-out-SC-03 - A collector signs out of the grade10 site
**Serves:** shared-auth-sign-out-US-01 - Collector or operator signs out and lands signed out

- **GIVEN** a collector on the grade10 site's profile
- **WHEN** they sign out and the auth service confirms
- **THEN** the site shows the marketing page

#### Scenario: shared-auth-sign-out-SC-06 - Signing out of the console leaves the site signed in
**Serves:** shared-auth-sign-out-US-03 - Operator signs out of the console and stays signed in on the site

- **GIVEN** an operator signed in on the site and on the console
- **WHEN** they sign out of the console and the auth service confirms
- **THEN** the console shows its sign-in page
- **AND** the site still shows them signed in

#### Scenario: shared-auth-sign-out-SC-07 - Signing out of the site leaves the console signed in
**Serves:** shared-auth-sign-out-US-03 - Operator signs out of the console and stays signed in on the site

- **GIVEN** an operator signed in on the site and on the console
- **WHEN** they sign out of the site and the auth service confirms
- **THEN** the site shows the marketing page
- **AND** the console still shows them signed in
