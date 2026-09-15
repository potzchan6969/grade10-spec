## Feature set

- Emailed link
  - Only email method: the email step sends a link and nothing else
  - Sent confirmation: after a send that went out, name the address and offer Resend and a return to entry
  - One-time session: an unused unexpired link signs in once
- Surface wording
  - Sign in with email: the email-step action and dialog copy never say magic link to the collector

## ADDED Requirements

### Requirement: After a successful send the surface confirms and offers Resend and return

WHEN a sign-in-link email has been sent for the address the person submitted,
the sign-in surface SHALL show confirmation copy that names that address,
SHALL offer a Resend control, and SHALL offer a control that returns them to
the entry step — the Google control when the brand has Google sign-in, and the
email step. The confirmation SHALL NOT state whether the address was new.

#### Scenario: shared-auth-sign-in-SC-42 - A successful send shows confirmation with the address

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** the send goes out
- **THEN** the surface shows confirmation copy that names that address
- **AND** it does not state whether an account already exists

#### Scenario: shared-auth-sign-in-SC-43 - Resend is offered after a successful send

- **GIVEN** a sign-in surface showing confirmation after a successful send
- **WHEN** the person activates Resend
- **THEN** the system treats it as another ask for a sign-in link at the same
  address
- **AND** the one-email-a-minute cap still applies

#### Scenario: shared-auth-sign-in-SC-44 - Back returns to the entry step

- **GIVEN** a sign-in surface showing confirmation after a successful send
- **AND** a brand that has Google sign-in
- **WHEN** the person activates the control that returns to entry
- **THEN** the Google control and the email step are shown again
- **AND** the confirmation step is no longer shown

### Requirement: The email-step action is worded as sign-in with email

The email step's send action SHALL be labelled as signing in with email. The
sign-in surface's user-facing copy SHALL NOT use the term magic link.

#### Scenario: shared-auth-sign-in-SC-45 - The email-step CTA says Sign In with Email

- **WHEN** a person opens sign-in and reaches the email step
- **THEN** the send action is labelled **Sign In with Email**
- **AND** no control on the surface uses the words magic link
