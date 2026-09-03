# shared/auth/sign-in Specification

## Purpose
How a person on either brand signs in: which methods exist, what a success
creates, how often emails may be sent, and what a sign-in command does when
it is activated more than once. One intent, one request, one email.
Checkout itself belongs to the store. `shared/auth/sign-out` carries the matching
contract for leaving a session.

## Feature set

- In-flight commands
  - One request: activating a sign-in command again while it runs starts no second request
  - Email step lock: link and code refuse each other while either is in flight
- Emailed link
  - One-time session: an unused unexpired link signs in once
- Emailed code
  - Correct code signs in: wrong, expired, or over-tried codes do not
- Google
  - Brand-offered: a brand that enables Google shows it; an unverified email does not sign in
- Account identity
  - One person per address: first visit creates the account; later visits are the same person
- Rate limits and redirects
  - One email a minute: a second send in a minute is told to wait
  - Trusted return: an untrusted redirect is ignored

## Requirements

### Requirement: A sign-in command in flight cannot be duplicated

WHILE a sign-in command's request is running, activating the same command
again SHALL NOT start another request: at most one request per command
reaches the auth service, and every activation settles with that one
request's outcome. Input edited during the flight SHALL NOT be sent — the
running request's input stands until it settles.

#### Scenario: sign-in-SC-01 - Activating again during flight does nothing

- **GIVEN** a sign-in command whose request is in flight
- **WHEN** the person activates the same command again
- **THEN** no second request reaches the auth service
- **AND** both activations settle with the one request's outcome

### Requirement: The email step runs one command at a time

The email step offers two ways to sign in — an emailed link and an emailed
code. WHILE either request is in flight, the step SHALL refuse activation of
both, and only the command that is running SHALL show its busy state.

#### Scenario: sign-in-SC-02 - One sign-in email per intent

- **GIVEN** a collector on the email step whose send-link request is in
  flight
- **WHEN** they activate the send-code control
- **THEN** no code request starts and no second email is sent

#### Scenario: sign-in-SC-03 - Only the running command looks busy

- **GIVEN** a collector on the email step whose send-code request is in
  flight
- **THEN** the send-code control shows its busy state
- **AND** the send-link control is refusing activation without looking busy

#### Scenario: sign-in-SC-04 - A settled request frees the step

- **GIVEN** an email step whose in-flight request has settled
- **WHEN** the collector activates either control
- **THEN** that command starts normally

### Requirement: A person signs in with an emailed link

The system SHALL send a sign-in link to the address the person submits, and
SHALL create a session for the account of that address when they follow a
valid unused, unexpired link. A link SHALL sign in at most once. An expired
or already-used link SHALL NOT create a session.

#### Scenario: sign-in-SC-05 - A valid link creates a session

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** they follow the unused, unexpired link from that email
- **THEN** they are signed in as the account for that address

#### Scenario: sign-in-SC-06 - A used link does not sign in again

- **GIVEN** a sign-in link that has already created a session
- **WHEN** anyone follows that link again
- **THEN** no new session is created

#### Scenario: sign-in-SC-07 - An expired link does not sign in

- **GIVEN** a sign-in link whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created

#### Scenario: sign-in-SC-08 - A failed send is reported

- **WHEN** a sign-in link cannot be sent
- **THEN** the surface states that the link was not sent
- **AND** the person is not signed in

#### Scenario: sign-in-SC-09 - A first send does not disclose whether the address is new

- **GIVEN** an email that has never signed in
- **WHEN** they ask for a sign-in link and the send goes out
- **THEN** the surface treats it as a sent link
- **AND** it does not state that no account exists

### Requirement: A person signs in with an emailed code

The system SHALL send a sign-in code to the address the person submits, and
SHALL create a session when they submit the correct unused, unexpired code
for that address. An incorrect, already-used, or expired code SHALL NOT
create a session, and SHALL be reported. Three incorrect submits for the
same unused code SHALL invalidate that code.

#### Scenario: sign-in-SC-10 - A correct code creates a session

- **GIVEN** a person who asked for a sign-in code at an email address
- **WHEN** they submit the unused, unexpired code from that email
- **THEN** they are signed in as the account for that address

#### Scenario: sign-in-SC-11 - An incorrect code is refused

- **WHEN** a person submits a code that is not the unused code for that
  address
- **THEN** the surface states that the code did not work
- **AND** they are not signed in

#### Scenario: sign-in-SC-12 - An expired code is refused

- **GIVEN** a sign-in code whose time to live has ended
- **WHEN** a person submits that code
- **THEN** the surface states that the code did not work
- **AND** they are not signed in

#### Scenario: sign-in-SC-13 - Too many wrong codes kill the code

- **GIVEN** a person who has submitted three incorrect codes for the unused
  code sent to an address
- **WHEN** they then submit that unused code
- **THEN** they are not signed in

### Requirement: Google sign-in is offered only when the brand has it

WHEN the brand has Google sign-in, the sign-in surface SHALL offer a Google
control, and a successful Google sign-in SHALL create a session for the
account of that Google account's verified email. Google SHALL NOT create an
account or a session when the provider did not verify the email. WHEN the
brand does not have Google sign-in, the surface SHALL NOT show that
control.

#### Scenario: sign-in-SC-14 - A brand with Google sign-in offers it

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person opens sign-in
- **THEN** the Google control is present
- **AND** completing Google sign-in with a verified email signs them in as
  the account for that address

#### Scenario: sign-in-SC-15 - An unverified Google email does not sign in

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person completes Google sign-in with an email Google has not
  verified
- **THEN** no account is created from that request
- **AND** they are not signed in

#### Scenario: sign-in-SC-16 - A brand without Google sign-in hides it

- **GIVEN** a brand that does not have Google sign-in
- **WHEN** a person opens sign-in
- **THEN** no Google sign-in control is shown

### Requirement: The first success creates the account, and the email is unique

A successful sign-in at an email address that has never signed in SHALL
create the account for that address. A later successful sign-in at the same
address, by any offered method, SHALL enter the same account. Two accounts
SHALL NOT share an email address. Addresses that differ only by letter case
SHALL be the same address. A plus-tag or a provider-specific alias SHALL NOT
be folded into another address.

#### Scenario: sign-in-SC-17 - A first visit creates the account

- **GIVEN** an email address that has never signed in
- **WHEN** that address completes any offered sign-in method
- **THEN** an account exists for that address
- **AND** the person is signed in as it

#### Scenario: sign-in-SC-18 - A later visit is the same account

- **GIVEN** an account that signed in with an emailed link
- **WHEN** that same address later signs in with an emailed code, or with
  Google when the brand has it
- **THEN** they enter the same account, not a second one

#### Scenario: sign-in-SC-19 - Letter case does not create a second account

- **GIVEN** an account that signed in at `Collector@example.com`
- **WHEN** that person later signs in at `collector@example.com`
- **THEN** they enter the same account, not a second one

#### Scenario: sign-in-SC-20 - A plus-tag is a different address

- **GIVEN** an account at `collector@example.com`
- **WHEN** `collector+shop@example.com` completes sign-in
- **THEN** a second account exists for that plus-tag address

### Requirement: A trusted product may create or enter an account by a verified email

A product of this brand that has verified an email SHALL create an account
for that address when none exists, and SHALL enter the existing account
when one does. It SHALL be able to sign that person in. The person SHALL
NOT need to complete a link, code, or Google sign-in for that to happen.
The client SHALL NOT create an account or a session by naming an email.

#### Scenario: sign-in-SC-21 - A new verified email creates the account

- **GIVEN** an email that has never signed in
- **WHEN** a product of this brand that has verified that email asks to
  create or enter the account
- **THEN** an account exists for that address
- **AND** the product receives that account's user id

#### Scenario: sign-in-SC-22 - A known verified email is the same account

- **GIVEN** an account that signed in with an emailed link
- **WHEN** a product of this brand that has verified that same email asks
  to create or enter the account
- **THEN** they receive that same account, not a second one

#### Scenario: sign-in-SC-23 - A trusted product can sign the person in

- **WHEN** a product of this brand that has verified an email asks to sign
  that account in
- **THEN** the person is signed in as that account on this brand

#### Scenario: sign-in-SC-24 - A client cannot claim an email

- **WHEN** a client names an email and asks to create an account or a
  session
- **THEN** no account is created from that request
- **AND** the person is not signed in

#### Scenario: sign-in-SC-25 - Sign-in after a product-created account is the same person

- **GIVEN** an account created when a product verified an email
- **WHEN** that address later signs in with an emailed link, an emailed
  code, or Google when the brand has it
- **THEN** they enter the same account

### Requirement: Sign-in emails are capped per address

The system SHALL send at most one sign-in email — link or code — to one
email address in any sixty-second window. A send beyond that cap SHALL NOT
send another email. The surface SHALL tell the person to wait. It SHALL NOT
use the copy of a failed send. After a send that went out, the resend
control SHALL wait out the same window.

#### Scenario: sign-in-SC-26 - A second link send in a minute is told to wait

- **GIVEN** a sign-in-link email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for another sign-in link
- **THEN** no second email is sent
- **AND** the surface tells them to wait
- **AND** it does not state that the link was not sent

#### Scenario: sign-in-SC-27 - A second code send in a minute is told to wait

- **GIVEN** a sign-in-code email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for another sign-in code
- **THEN** no second email is sent
- **AND** the surface tells them to wait
- **AND** it does not state that the code was not sent

#### Scenario: sign-in-SC-28 - A code send after a link in a minute is told to wait

- **GIVEN** a sign-in-link email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for a sign-in code
- **THEN** no code email is sent
- **AND** the surface tells them to wait

### Requirement: A new send replaces earlier unused sign-in mail

WHEN a sign-in-link or sign-in-code email is sent to an address, any earlier
unused link or code for that address SHALL NOT create a session.

#### Scenario: sign-in-SC-29 - A new link kills the earlier link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-link email is sent to that address
- **THEN** following the earlier link creates no session

#### Scenario: sign-in-SC-30 - A new code kills the earlier link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-code email is sent to that address
- **THEN** following the earlier link creates no session

### Requirement: Sign-in stays on the brand

WHEN sign-in names no location, or would send the person to a location that
is not this brand, the system SHALL ignore that location and SHALL leave
them on this brand.

#### Scenario: sign-in-SC-31 - An untrusted redirect is ignored

- **GIVEN** a sign-in that names a location off this brand
- **WHEN** the person completes sign-in
- **THEN** they are on this brand
- **AND** they are not sent to that location

#### Scenario: sign-in-SC-32 - A missing redirect stays on the brand

- **GIVEN** a sign-in that names no location
- **WHEN** the person completes sign-in
- **THEN** they are on this brand
