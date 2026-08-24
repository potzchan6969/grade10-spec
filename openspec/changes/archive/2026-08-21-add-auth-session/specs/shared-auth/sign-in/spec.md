## ADDED Requirements

### Requirement: A person signs in with an emailed link

The system SHALL send a sign-in link to the address the person submits, and
SHALL create a session for the account of that address when they follow a
valid unused, unexpired link. A link SHALL sign in at most once. An expired
or already-used link SHALL NOT create a session.

#### Scenario: A valid link creates a session

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** they follow the unused, unexpired link from that email
- **THEN** they are signed in as the account for that address

#### Scenario: A used link does not sign in again

- **GIVEN** a sign-in link that has already created a session
- **WHEN** anyone follows that link again
- **THEN** no new session is created

#### Scenario: An expired link does not sign in

- **GIVEN** a sign-in link whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created

#### Scenario: A failed send is reported

- **WHEN** a sign-in link cannot be sent
- **THEN** the surface states that the link was not sent
- **AND** the person is not signed in

#### Scenario: A first send does not disclose whether the address is new

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

#### Scenario: A correct code creates a session

- **GIVEN** a person who asked for a sign-in code at an email address
- **WHEN** they submit the unused, unexpired code from that email
- **THEN** they are signed in as the account for that address

#### Scenario: An incorrect code is refused

- **WHEN** a person submits a code that is not the unused code for that
  address
- **THEN** the surface states that the code did not work
- **AND** they are not signed in

#### Scenario: An expired code is refused

- **GIVEN** a sign-in code whose time to live has ended
- **WHEN** a person submits that code
- **THEN** the surface states that the code did not work
- **AND** they are not signed in

#### Scenario: Too many wrong codes kill the code

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

#### Scenario: A brand with Google sign-in offers it

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person opens sign-in
- **THEN** the Google control is present
- **AND** completing Google sign-in with a verified email signs them in as
  the account for that address

#### Scenario: An unverified Google email does not sign in

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person completes Google sign-in with an email Google has not
  verified
- **THEN** no account is created from that request
- **AND** they are not signed in

#### Scenario: A brand without Google sign-in hides it

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

#### Scenario: A first visit creates the account

- **GIVEN** an email address that has never signed in
- **WHEN** that address completes any offered sign-in method
- **THEN** an account exists for that address
- **AND** the person is signed in as it

#### Scenario: A later visit is the same account

- **GIVEN** an account that signed in with an emailed link
- **WHEN** that same address later signs in with an emailed code, or with
  Google when the brand has it
- **THEN** they enter the same account, not a second one

#### Scenario: Letter case does not create a second account

- **GIVEN** an account that signed in at `Collector@example.com`
- **WHEN** that person later signs in at `collector@example.com`
- **THEN** they enter the same account, not a second one

#### Scenario: A plus-tag is a different address

- **GIVEN** an account at `collector@example.com`
- **WHEN** `collector+shop@example.com` completes sign-in
- **THEN** a second account exists for that plus-tag address

### Requirement: A trusted product may create or enter an account by a verified email

A product of this brand that has verified an email SHALL create an account
for that address when none exists, and SHALL enter the existing account
when one does. It SHALL be able to sign that person in. The person SHALL
NOT need to complete a link, code, or Google sign-in for that to happen.
The client SHALL NOT create an account or a session by naming an email.

#### Scenario: A new verified email creates the account

- **GIVEN** an email that has never signed in
- **WHEN** a product of this brand that has verified that email asks to
  create or enter the account
- **THEN** an account exists for that address
- **AND** the product receives that account's user id

#### Scenario: A known verified email is the same account

- **GIVEN** an account that signed in with an emailed link
- **WHEN** a product of this brand that has verified that same email asks
  to create or enter the account
- **THEN** they receive that same account, not a second one

#### Scenario: A trusted product can sign the person in

- **WHEN** a product of this brand that has verified an email asks to sign
  that account in
- **THEN** the person is signed in as that account on this brand

#### Scenario: A client cannot claim an email

- **WHEN** a client names an email and asks to create an account or a
  session
- **THEN** no account is created from that request
- **AND** the person is not signed in

#### Scenario: Sign-in after a product-created account is the same person

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

#### Scenario: A second link send in a minute is told to wait

- **GIVEN** a sign-in-link email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for another sign-in link
- **THEN** no second email is sent
- **AND** the surface tells them to wait
- **AND** it does not state that the link was not sent

#### Scenario: A second code send in a minute is told to wait

- **GIVEN** a sign-in-code email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for another sign-in code
- **THEN** no second email is sent
- **AND** the surface tells them to wait
- **AND** it does not state that the code was not sent

#### Scenario: A code send after a link in a minute is told to wait

- **GIVEN** a sign-in-link email already sent to one address in the last
  sixty seconds
- **WHEN** that address asks for a sign-in code
- **THEN** no code email is sent
- **AND** the surface tells them to wait

### Requirement: A new send replaces earlier unused sign-in mail

WHEN a sign-in-link or sign-in-code email is sent to an address, any earlier
unused link or code for that address SHALL NOT create a session.

#### Scenario: A new link kills the earlier link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-link email is sent to that address
- **THEN** following the earlier link creates no session

#### Scenario: A new code kills the earlier link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-code email is sent to that address
- **THEN** following the earlier link creates no session

### Requirement: Sign-in stays on the brand

WHEN sign-in names no location, or would send the person to a location that
is not this brand, the system SHALL ignore that location and SHALL leave
them on this brand.

#### Scenario: An untrusted redirect is ignored

- **GIVEN** a sign-in that names a location off this brand
- **WHEN** the person completes sign-in
- **THEN** they are on this brand
- **AND** they are not sent to that location

#### Scenario: A missing redirect stays on the brand

- **GIVEN** a sign-in that names no location
- **WHEN** the person completes sign-in
- **THEN** they are on this brand
