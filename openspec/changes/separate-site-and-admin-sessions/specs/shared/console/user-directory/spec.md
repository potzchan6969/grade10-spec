# shared/console/user-directory — delta

## Feature set

- What an account can do
  - Session detail: where a session was raised, when it ends, and which surface it belongs to, never what authenticates it

## MODIFIED Requirements

### Requirement: A session is named without its secret

Wherever this surface renders an account's sessions — `UserSessionsDialog` and
`UserAccountPanel` alike — each session SHALL be identified by an identifier
the consumer supplies, and the secret that authenticates a session SHALL NOT
be accepted or rendered. A revocation SHALL be reported by that same
identifier. When the account holds no sessions, ending every session SHALL NOT
be offered.

A session SHALL be able to carry, beside its identifier, when it began, when
it ends without a revocation, where it was raised, and which surface it
belongs to, the site or the console — each supplied by the consumer already in
words, each rendered when supplied and omitted when not.

<!-- trace:scenario id=g10.shared-user-directory.SC-uz8 rev=1 -->
#### Scenario: shared-console-user-directory-SC-07 - An operator reads where an account is signed in
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **WHEN** the dialog or the account panel renders an account's sessions
- **THEN** each is named by its identifier
- **AND THEN** no authenticating secret is rendered

<!-- trace:scenario id=g10.shared-user-directory.SC-6bz rev=1 -->
#### Scenario: shared-console-user-directory-SC-08 - An account holds no sessions
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **WHEN** the dialog or the account panel renders an account with no sessions
- **THEN** it says so
- **AND THEN** the control that ends every session is unavailable

<!-- trace:scenario id=g10.shared-user-directory.SC-4vh rev=1 -->
#### Scenario: shared-console-user-directory-SC-16 - A session says where it was raised
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** a session the consumer supplied with where it was raised and when it ends
- **WHEN** that session renders
- **THEN** both are shown as the consumer supplied them
- **AND THEN** a session supplied with neither shows no place and no end time,
  only its identifier and whatever else it was supplied, such as its surface

#### Scenario: shared-console-user-directory-SC-40 - A session says which surface it belongs to
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **GIVEN** two sessions of one account, the consumer supplying the site as one's surface and the console as the other's
- **WHEN** the dialog and the account panel each render them
- **THEN** each view shows the surface the consumer supplied beside each session
- **AND THEN** the two sessions read as different surfaces in both views

#### Scenario: shared-console-user-directory-SC-41 - Ending one session leaves the other's surface standing
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **GIVEN** two sessions of one account, the consumer supplying the site as one's surface and the console as the other's
- **WHEN** the operator ends one of them from the dialog or from the account panel's sessions area
- **THEN** that view reports the ended session by its own identifier
- **AND THEN** the session the consumer still supplies shows its own surface, in the dialog and in the panel

#### Scenario: shared-console-user-directory-SC-42 - A session supplied no surface shows none
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **GIVEN** two sessions of one account, the consumer supplying the console as one's surface and none for the other
- **WHEN** the dialog and the account panel each render them
- **THEN** the first shows the console as its surface
- **AND THEN** the other shows no surface, neither the site's nor the console's, beside whatever else it was supplied
