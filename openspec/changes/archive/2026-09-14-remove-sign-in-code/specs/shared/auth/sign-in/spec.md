## Feature set

- In-flight commands
  - One request: activating a sign-in command again while it runs starts no second request
- Emailed link
  - Only email method: the email step sends a link and nothing else
  - One-time session: an unused unexpired link signs in once
- Google
  - Brand-offered: a brand that enables Google shows it; an unverified email does not sign in
- Account identity
  - One person per address: first visit creates the account; later visits are the same person
- Rate limits and redirects
  - One email a minute: a second send in a minute is told to wait
  - Trusted return: an untrusted redirect is ignored

## ADDED Requirements

### Requirement: The email step offers the link alone

The email step SHALL offer one action: sending a sign-in link to the address
the person submits. It SHALL NOT offer a sign-in code. The system SHALL NOT
send a sign-in code, and a code from any earlier sign-in email SHALL NOT
create a session.

#### Scenario: shared-auth-sign-in-SC-33 - The email step has no code control

- **WHEN** a person opens sign-in and reaches the email step
- **THEN** the step offers sending a sign-in link
- **AND** no control asks for or sends a sign-in code

#### Scenario: shared-auth-sign-in-SC-34 - A code from an earlier email does not sign in

- **GIVEN** a sign-in code that an earlier sign-in email carried
- **WHEN** anyone submits that code
- **THEN** no session is created

### Requirement: Sign-in-link emails are capped per address

The system SHALL send at most one sign-in-link email to one email address
in any sixty-second window. A send beyond that cap SHALL NOT send another
email. The surface SHALL tell the person to wait. It SHALL NOT use the copy
of a failed send. After a send that went out, the resend control SHALL wait
out the same window.

#### Scenario: shared-auth-sign-in-SC-35 - A second link send in a minute is told to wait

- **GIVEN** a sign-in-link email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for another sign-in link
- **THEN** no second email is sent
- **AND** the surface tells them to wait
- **AND** it does not state that the link was not sent

### Requirement: A new link replaces earlier unused links

WHEN a sign-in-link email is sent to an address, any earlier unused link for
that address SHALL NOT create a session.

#### Scenario: shared-auth-sign-in-SC-36 - A new link kills the earlier link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-link email is sent to that address
- **THEN** following the earlier link creates no session

## MODIFIED Requirements

### Requirement: The first success creates the account, and the email is unique

A successful sign-in at an email address that has never signed in SHALL
create the account for that address. A later successful sign-in at the same
address, by any offered method, SHALL enter the same account. Two accounts
SHALL NOT share an email address. Addresses that differ only by letter case
SHALL be the same address. A plus-tag or a provider-specific alias SHALL NOT
be folded into another address.

#### Scenario: shared-auth-sign-in-SC-17 - A first visit creates the account

- **GIVEN** an email address that has never signed in
- **WHEN** that address completes any offered sign-in method
- **THEN** an account exists for that address
- **AND** the person is signed in as it

#### Scenario: shared-auth-sign-in-SC-18 - A later visit is the same account

- **GIVEN** an account that signed in with an emailed link
- **WHEN** that same address later signs in with another emailed link, or
  with Google when the brand has it
- **THEN** they enter the same account, not a second one

#### Scenario: shared-auth-sign-in-SC-19 - Letter case does not create a second account

- **GIVEN** an account that signed in at `Collector@example.com`
- **WHEN** that person later signs in at `collector@example.com`
- **THEN** they enter the same account, not a second one

#### Scenario: shared-auth-sign-in-SC-20 - A plus-tag is a different address

- **GIVEN** an account at `collector@example.com`
- **WHEN** `collector+shop@example.com` completes sign-in
- **THEN** a second account exists for that plus-tag address

### Requirement: A trusted product may create or enter an account by a verified email

A product of this brand that has verified an email SHALL create an account
for that address when none exists, and SHALL enter the existing account
when one does. It SHALL be able to sign that person in. The person SHALL
NOT need to complete a link or Google sign-in for that to happen. The
client SHALL NOT create an account or a session by naming an email.

#### Scenario: shared-auth-sign-in-SC-21 - A new verified email creates the account

- **GIVEN** an email that has never signed in
- **WHEN** a product of this brand that has verified that email asks to
  create or enter the account
- **THEN** an account exists for that address
- **AND** the product receives that account's user id

#### Scenario: shared-auth-sign-in-SC-22 - A known verified email is the same account

- **GIVEN** an account that signed in with an emailed link
- **WHEN** a product of this brand that has verified that same email asks
  to create or enter the account
- **THEN** they receive that same account, not a second one

#### Scenario: shared-auth-sign-in-SC-23 - A trusted product can sign the person in

- **WHEN** a product of this brand that has verified an email asks to sign
  that account in
- **THEN** the person is signed in as that account on this brand

#### Scenario: shared-auth-sign-in-SC-24 - A client cannot claim an email

- **WHEN** a client names an email and asks to create an account or a
  session
- **THEN** no account is created from that request
- **AND** the person is not signed in

#### Scenario: shared-auth-sign-in-SC-25 - Sign-in after a product-created account is the same person

- **GIVEN** an account created when a product verified an email
- **WHEN** that address later signs in with an emailed link, or Google when
  the brand has it
- **THEN** they enter the same account

## REMOVED Requirements

### Requirement: The email step runs one command at a time

**Reason**: The email step offers one command once the code is withdrawn, so
there is no second command for it to refuse. A command in flight is still
not duplicated — "A sign-in command in flight cannot be duplicated" stands
and covers the send-link control. Scenarios SC-02, SC-03 and SC-04 retire
with the requirement; their ids are not reissued.

**Migration**: None. A surface that held the two controls locked against each
other renders one control, governed by the in-flight rule alone.

### Requirement: A person signs in with an emailed code

**Reason**: The code is the second of two paths to the same inbox, and the
one that can be mistyped, expired or locked. The link and Google are the
ways in. Scenarios SC-10 to SC-13 retire with the requirement; their ids are
not reissued. SC-27, SC-28 and SC-30 retire from the cap and newest-mail
requirements for the same reason.

**Migration**: The auth service stops sending codes and refuses a code
request. A code sent before deploy creates no session — "The email step
offers the link alone" states that outcome. A collector holding one asks for
a link instead. Verification rows that held codes are dropped on their own
expiry.

### Requirement: Sign-in emails are capped per address

**Reason**: The cap counted link and code sends together. With the code
withdrawn it counts links alone, so the requirement is restated as
"Sign-in-link emails are capped per address". SC-26 retires and SC-35 states
the same outcome for the link; SC-27 and SC-28 retire with the code. No
retired id is reissued.

**Migration**: None. The sixty-second window and the wait message do not
change.

### Requirement: A new send replaces earlier unused sign-in mail

**Reason**: Only links are sent, so "A new link replaces earlier unused
links" states the rule for the link alone. SC-29 retires and SC-36 states
the same outcome; SC-30 retires with the code. No retired id is reissued.

**Migration**: None. A new link still kills the earlier one.
