## Feature set

- Emailed link
  - One-time session: an unused unexpired link signs in once
  - Failed follow feedback: expired, dead, and banned links land on the brand home with a toast

## ADDED Requirements

### Requirement: A failed link follow lands on the brand home with a toast

WHEN anyone follows a sign-in link that does not create a session, the system
SHALL leave them on this brand's home and SHALL announce the failure in a
toast. An expired link SHALL use the expired announcement. A used,
superseded, or otherwise invalid link SHALL use one shared announcement that
the link no longer works. WHEN the account for that address is banned, the
follow SHALL create no session, SHALL leave them on this brand's home, and
SHALL use the cannot-sign-in announcement — not the expired or no-longer-works
announcement.

#### Scenario: shared-auth-sign-in-SC-37 - An expired link toasts on the brand home
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link has expired

#### Scenario: shared-auth-sign-in-SC-38 - A used link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link that has already created a session
- **WHEN** anyone follows that link again
- **THEN** no new session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

#### Scenario: shared-auth-sign-in-SC-39 - A superseded link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** an unused unexpired sign-in link that a later sign-in-link email
  for the same address replaced
- **WHEN** anyone follows the earlier link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

#### Scenario: shared-auth-sign-in-SC-40 - An invalid link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link token that is malformed or unknown
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

#### Scenario: shared-auth-sign-in-SC-41 - A banned account's link follow toasts cannot sign in
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a banned account and a sign-in link for that account's address
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that they cannot sign in
- **AND** the toast does not invite them to request another link
