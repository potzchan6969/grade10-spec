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
- Emailed link
  - Only email method: the email step sends a link and nothing else
  - Sent confirmation: after a send that went out, title the dialog Check Your Email, name the address on its own line, and offer Resend
  - Resend wait: Resend stays off for sixty seconds after each successful send, counting down on the button
  - Link lifetime: a sign-in link lasts five minutes, and the email carrying it says five minutes
  - One-time session: an unused unexpired link signs in once
  - Failed follow feedback: expired, dead, and banned links land on the brand home with a toast
  - Followed elsewhere: the surface that asked carries on once the session arrives
- Google
  - Brand-offered: a brand that enables Google shows it; an unverified email does not sign in
- Account identity
  - One person per address: first visit creates the account; later visits are the same person
- Rate limits and redirects
  - One email a minute: a second send in a minute is told to wait
  - Trusted return: an untrusted redirect is ignored
- Surface wording
  - Sign in with email: the email-step action and dialog copy never say magic link to the collector

## Requirements

### Requirement: A sign-in command in flight cannot be duplicated

WHILE a sign-in command's request is running, activating the same command
again SHALL NOT start another request: at most one request per command
reaches the auth service, and every activation settles with that one
request's outcome. Input edited during the flight SHALL NOT be sent — the
running request's input stands until it settles.

#### Scenario: shared-auth-sign-in-SC-01 - Activating again during flight does nothing
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in command whose request is in flight
- **WHEN** the person activates the same command again
- **THEN** no second request reaches the auth service
- **AND** both activations settle with the one request's outcome

### Requirement: A person signs in with an emailed link

The system SHALL send a sign-in link to the address the person submits, and
SHALL create a session for the account of that address when they follow a
valid unused, unexpired link. A link SHALL sign in at most once. An expired
or already-used link SHALL NOT create a session.

#### Scenario: shared-auth-sign-in-SC-05 - A valid link creates a session
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** they follow the unused, unexpired link from that email
- **THEN** they are signed in as the account for that address

#### Scenario: shared-auth-sign-in-SC-06 - A used link does not sign in again
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link that has already created a session
- **WHEN** anyone follows that link again
- **THEN** no new session is created

#### Scenario: shared-auth-sign-in-SC-07 - An expired link does not sign in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created

#### Scenario: shared-auth-sign-in-SC-08 - A failed send is reported
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **WHEN** a sign-in link cannot be sent
- **THEN** the surface states that the link was not sent
- **AND** the person is not signed in

#### Scenario: shared-auth-sign-in-SC-09 - A first send does not disclose whether the address is new
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an email that has never signed in
- **WHEN** they ask for a sign-in link and the send goes out
- **THEN** the surface treats it as a sent link
- **AND** it does not state that no account exists

### Requirement: Google sign-in is offered only when the brand has it

WHEN the brand has Google sign-in, the sign-in surface SHALL offer a Google
control, and a successful Google sign-in SHALL create a session for the
account of that Google account's verified email. Google SHALL NOT create an
account or a session when the provider did not verify the email. WHEN the
brand does not have Google sign-in, the surface SHALL NOT show that
control.

#### Scenario: shared-auth-sign-in-SC-14 - A brand with Google sign-in offers it
**Serves:** shared-auth-sign-in-US-03 - Collector signs in with Google when the brand offers it

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person opens sign-in
- **THEN** the Google control is present
- **AND** completing Google sign-in with a verified email signs them in as
  the account for that address

#### Scenario: shared-auth-sign-in-SC-15 - An unverified Google email does not sign in
**Serves:** shared-auth-sign-in-US-03 - Collector signs in with Google when the brand offers it

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person completes Google sign-in with an email Google has not
  verified
- **THEN** no account is created from that request
- **AND** they are not signed in

#### Scenario: shared-auth-sign-in-SC-16 - A brand without Google sign-in hides it
**Serves:** shared-auth-sign-in-US-03 - Collector signs in with Google when the brand offers it

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

#### Scenario: shared-auth-sign-in-SC-17 - A first visit creates the account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an email address that has never signed in
- **WHEN** that address completes any offered sign-in method
- **THEN** an account exists for that address
- **AND** the person is signed in as it

#### Scenario: shared-auth-sign-in-SC-18 - A later visit is the same account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account that signed in with an emailed link
- **WHEN** that same address later signs in with another emailed link, or
  with Google when the brand has it
- **THEN** they enter the same account, not a second one

#### Scenario: shared-auth-sign-in-SC-19 - Letter case does not create a second account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account that signed in at `Collector@example.com`
- **WHEN** that person later signs in at `collector@example.com`
- **THEN** they enter the same account, not a second one

#### Scenario: shared-auth-sign-in-SC-20 - A plus-tag is a different address
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

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
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an email that has never signed in
- **WHEN** a product of this brand that has verified that email asks to
  create or enter the account
- **THEN** an account exists for that address
- **AND** the product receives that account's user id

#### Scenario: shared-auth-sign-in-SC-22 - A known verified email is the same account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account that signed in with an emailed link
- **WHEN** a product of this brand that has verified that same email asks
  to create or enter the account
- **THEN** they receive that same account, not a second one

#### Scenario: shared-auth-sign-in-SC-23 - A trusted product can sign the person in
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **WHEN** a product of this brand that has verified an email asks to sign
  that account in
- **THEN** the person is signed in as that account on this brand

#### Scenario: shared-auth-sign-in-SC-24 - A client cannot claim an email
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **WHEN** a client names an email and asks to create an account or a
  session
- **THEN** no account is created from that request
- **AND** the person is not signed in

#### Scenario: shared-auth-sign-in-SC-25 - Sign-in after a product-created account is the same person
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account created when a product verified an email
- **WHEN** that address later signs in with an emailed link, or Google when
  the brand has it
- **THEN** they enter the same account

### Requirement: Sign-in stays on the brand

WHEN sign-in names no location, or would send the person to a location that
is not this brand, the system SHALL ignore that location and SHALL leave
them on this brand.

#### Scenario: shared-auth-sign-in-SC-31 - An untrusted redirect is ignored
**Serves:** shared-auth-sign-in-US-05 - Collector is not spammed or sent off-brand

- **GIVEN** a sign-in that names a location off this brand
- **WHEN** the person completes sign-in
- **THEN** they are on this brand
- **AND** they are not sent to that location

#### Scenario: shared-auth-sign-in-SC-32 - A missing redirect stays on the brand
**Serves:** shared-auth-sign-in-US-05 - Collector is not spammed or sent off-brand

- **GIVEN** a sign-in that names no location
- **WHEN** the person completes sign-in
- **THEN** they are on this brand

### Requirement: The email step offers the link alone

The email step SHALL offer one action: sending a sign-in link to the address
the person submits. It SHALL NOT offer a sign-in code. The system SHALL NOT
send a sign-in code, and a code from any earlier sign-in email SHALL NOT
create a session.

#### Scenario: shared-auth-sign-in-SC-33 - The email step has no code control
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **WHEN** a person opens sign-in and reaches the email step
- **THEN** the step offers sending a sign-in link
- **AND** no control asks for or sends a sign-in code

#### Scenario: shared-auth-sign-in-SC-34 - A code from an earlier email does not sign in
**Serves:** Google - a code from an earlier email does not sign in

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
**Serves:** shared-auth-sign-in-US-05 - Collector is not spammed or sent off-brand

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
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-link email is sent to that address
- **THEN** following the earlier link creates no session

### Requirement: After a successful send the surface confirms and offers Resend

WHEN a sign-in-link email has been sent for the address the person submitted,
the sign-in surface SHALL title the dialog **Check Your Email**, SHALL show
confirmation copy whose lead line does not include the address and whose next
line is that address, and SHALL offer a Resend control. The confirmation
SHALL NOT state whether the address was new. The surface SHALL NOT offer a
control that returns to the entry step — leaving is dialog dismissal.

#### Scenario: shared-auth-sign-in-SC-42 - A successful send shows Check Your Email and the address on its own line
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** the send goes out
- **THEN** the dialog title is **Check Your Email**
- **AND** the surface shows a confirmation lead line
- **AND** the address appears on the line below that lead
- **AND** it does not state whether an account already exists

#### Scenario: shared-auth-sign-in-SC-43 - Resend is offered after a successful send
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a sign-in surface showing confirmation after a successful send
- **AND** sixty seconds have passed since that send
- **WHEN** the person activates Resend
- **THEN** the system treats it as another ask for a sign-in link at the same
  address
- **AND** the one-email-a-minute cap still applies

#### Scenario: shared-auth-sign-in-SC-44 - The link-sent surface has no Back control
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a sign-in surface showing confirmation after a successful send
- **WHEN** the dialog renders
- **THEN** no control returns to the Google or email entry step
- **AND** dismissal of the dialog is the way out

### Requirement: Resend waits sixty seconds with a countdown on the button

AFTER a successful sign-in-link send — the first send or a successful resend —
the Resend control SHALL be disabled for sixty seconds. WHILE it is disabled,
its label SHALL show the whole seconds left in the form **Resend (n)** (for
example **Resend (45)**). WHEN the count reaches zero, Resend SHALL be enabled
again and labelled **Resend**. The countdown is a change of the label, not an
animation — `prefers-reduced-motion` does not remove it.

#### Scenario: shared-auth-sign-in-SC-46 - Resend is disabled with a countdown after a send
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a sign-in-link email has just been sent
- **WHEN** the link-sent surface is showing
- **THEN** Resend is disabled
- **AND** its label is **Resend (n)** with the whole seconds left in the
  sixty-second wait

#### Scenario: shared-auth-sign-in-SC-47 - Resend re-enables when the countdown reaches zero
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** Resend is disabled with a countdown after a successful send
- **WHEN** sixty seconds have passed since that send
- **THEN** Resend is enabled
- **AND** its label is **Resend**

#### Scenario: shared-auth-sign-in-SC-48 - A successful resend restarts the countdown
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** Resend is enabled on the link-sent surface
- **WHEN** the person activates Resend and the send goes out
- **THEN** Resend is disabled again for sixty seconds
- **AND** its label is **Resend (n)** with the whole seconds left

### Requirement: The email-step action is worded as sign-in with email

The email step's send action SHALL be labelled as signing in with email. The
sign-in surface's user-facing copy SHALL NOT use the term magic link.

#### Scenario: shared-auth-sign-in-SC-45 - The email-step CTA says Sign In with Email
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **WHEN** a person opens sign-in and reaches the email step
- **THEN** the send action is labelled **Sign In with Email**
- **AND** no control on the surface uses the words magic link

### Requirement: A sign-in dialog closes when the session arrives

WHEN a session arrives for a surface that is showing the sign-in dialog, that
surface SHALL close the dialog and SHALL show the person signed in, on the
terms `shared/auth/session` sets for keeping up. The person SHALL NOT have to
dismiss the dialog or reload the surface. Nothing SHALL announce the close.

#### Scenario: shared-auth-sign-in-SC-50 - The dialog on the surface that asked closes
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a surface showing the sign-in dialog after a sign-in link was
  asked for there
- **WHEN** the collector follows that link elsewhere on this device and
  returns to the surface that asked
- **THEN** the sign-in dialog is gone
- **AND** the surface shows them signed in
- **AND** no message on it announces that the session arrived

#### Scenario: shared-auth-sign-in-SC-51 - A dialog on a surface that did not ask closes too
**Serves:** Emailed link - a session arriving leaves no sign-in dialog open on the brand

- **GIVEN** two surfaces of one brand open in a browser, each showing the
  sign-in dialog, and a sign-in link asked for on only one of them
- **WHEN** the collector follows that link elsewhere on this device and
  returns to each surface
- **THEN** the sign-in dialog is gone from both
- **AND** both show them signed in

### Requirement: The surface that asked completes the action it refused

WHEN a session arrives for a surface where the person was refused an action
and sign-in was asked of them, that surface SHALL carry out that action — the
add, the bid, the navigation they were stopped before — without the person
activating it again, and SHALL carry it out at most once. The action SHALL be
attempted against the world as it stands: one that can no longer be done SHALL
be refused the way that action is ordinarily refused, and SHALL NOT be passed
over in silence. WHEN nothing was refused on that surface, it SHALL carry out
nothing beyond closing the dialog.

#### Scenario: shared-auth-sign-in-SC-52 - The refused action is carried out
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart and
  asked for a sign-in link on that surface
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** that item is in their cart
- **AND** they did not activate the add a second time

#### Scenario: shared-auth-sign-in-SC-53 - The refused navigation is carried out
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped before a page that needs a session and
  asked for a sign-in link on that surface
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** that surface is on the page they were stopped before

#### Scenario: shared-auth-sign-in-SC-54 - A dialog with nothing behind it only closes
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who opened sign-in from a sign-in control, with no
  action refused behind it, and asked for a link there
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** the sign-in dialog is gone
- **AND** the surface shows them signed in
- **AND** no action is carried out on their behalf

#### Scenario: shared-auth-sign-in-SC-55 - A link that creates no session leaves the asking surface as it was
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a surface showing the sign-in dialog after a sign-in link was
  asked for there
- **WHEN** that link is followed elsewhere on this device and creates no
  session
- **THEN** the surface that asked still shows the sign-in dialog
- **AND** the action it refused is not carried out
- **AND** nothing on it announces that the follow failed

#### Scenario: shared-auth-sign-in-SC-56 - An action that can no longer be done is refused, not skipped
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart and
  asked for a sign-in link on that surface
- **AND** that item can no longer be added by the time they return
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** the surface reports the refusal that action is ordinarily refused
  with
- **AND** it does not pass the action over in silence

#### Scenario: shared-auth-sign-in-SC-57 - The refused action is carried out once, not once per return
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart,
  asked for a sign-in link on that surface, and had the add carried out when
  the session arrived
- **WHEN** they leave that surface and return to it again
- **THEN** the add is not carried out a second time
- **AND** their cart holds that item once

### Requirement: A sign-in link lasts five minutes

A sign-in link's time to live SHALL be five minutes from the send. A link
followed five minutes or more after its send SHALL NOT create a session, and
the lifetime SHALL be measured on our own clock. The lifetime SHALL be
independent of the resend wait: the wait running out SHALL NOT end the life of
the link already sent.

#### Scenario: shared-auth-sign-in-SC-58 - A link followed inside five minutes signs in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused sign-in link sent four minutes ago
- **AND** no later sign-in-link email has gone to that address
- **WHEN** the person follows that link
- **THEN** they are signed in as the account for that address

#### Scenario: shared-auth-sign-in-SC-59 - A link five minutes old does not sign in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link sent five minutes ago
- **WHEN** anyone follows that link
- **THEN** no session is created

#### Scenario: shared-auth-sign-in-SC-60 - The resend wait running out leaves the link alive
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused sign-in link sent more than sixty seconds ago
- **AND** the resend wait for that address has run out with no second send
- **WHEN** the person follows that link
- **THEN** they are signed in as the account for that address

#### Scenario: shared-auth-sign-in-SC-62 - A device clock does not revive an expired link
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link whose five minutes have run out
- **WHEN** anyone follows it from a device whose clock reads inside those five
  minutes
- **THEN** no session is created

### Requirement: The sign-in email states how long the link lasts

The sign-in-link email SHALL state that the link lasts five minutes, in every
language it is sent in, and SHALL NOT name another lifetime.

#### Scenario: shared-auth-sign-in-SC-61 - The sign-in email says five minutes
**Serves:** Emailed link - what the email promises about the link it carries

- **WHEN** a sign-in-link email is sent
- **THEN** its body states that the link lasts five minutes
- **AND** it names no other lifetime
- **AND** it says so in the language the email is written in
