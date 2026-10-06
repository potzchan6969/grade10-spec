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
  - Signed-in mismatch: a link follow while signed in as a different account offers Switch or Stay instead of replacing the session
  - Settled elsewhere: a surface still waiting on its own request stops waiting, without gaining a session of its own, once that address signs in by any method on another device
- Google
  - Brand-offered: a brand that enables Google shows it; an unverified email does not sign in
  - Auto-prompt: Google's own corner prompt offers sign-in to a signed-out
    visitor without opening the dialog first, wherever the brand already
    offers Google sign-in
  - One ask at a time: the prompt does not show while the sign-in dialog is
    open, and opening the dialog dismisses it
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

<!-- trace:scenario id=g10.shared-sign-in.SC-wy5 rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-h56 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-05 - A valid link creates a session
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** they follow the unused, unexpired link from that email
- **THEN** they are signed in as the account for that address

<!-- trace:scenario id=g10.shared-sign-in.SC-q8n rev=1 -->
#### Scenario: shared-auth-sign-in-SC-06 - A used link does not sign in again
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link that has already created a session
- **WHEN** anyone follows that link again
- **THEN** no new session is created

<!-- trace:scenario id=g10.shared-sign-in.SC-7vo rev=1 -->
#### Scenario: shared-auth-sign-in-SC-07 - An expired link does not sign in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created

<!-- trace:scenario id=g10.shared-sign-in.SC-9nt rev=1 -->
#### Scenario: shared-auth-sign-in-SC-08 - A failed send is reported
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **WHEN** a sign-in link cannot be sent
- **THEN** the surface states that the link was not sent
- **AND** the person is not signed in

<!-- trace:scenario id=g10.shared-sign-in.SC-wkc rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-eng rev=1 -->
#### Scenario: shared-auth-sign-in-SC-14 - A brand with Google sign-in offers it
**Serves:** shared-auth-sign-in-US-03 - Collector signs in with Google when the brand offers it

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person opens sign-in
- **THEN** the Google control is present
- **AND** completing Google sign-in with a verified email signs them in as
  the account for that address

<!-- trace:scenario id=g10.shared-sign-in.SC-erl rev=1 -->
#### Scenario: shared-auth-sign-in-SC-15 - An unverified Google email does not sign in
**Serves:** shared-auth-sign-in-US-03 - Collector signs in with Google when the brand offers it

- **GIVEN** a brand that has Google sign-in
- **WHEN** a person completes Google sign-in with an email Google has not
  verified
- **THEN** no account is created from that request
- **AND** they are not signed in

<!-- trace:scenario id=g10.shared-sign-in.SC-ddm rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-kr7 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-17 - A first visit creates the account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an email address that has never signed in
- **WHEN** that address completes any offered sign-in method
- **THEN** an account exists for that address
- **AND** the person is signed in as it

<!-- trace:scenario id=g10.shared-sign-in.SC-nev rev=1 -->
#### Scenario: shared-auth-sign-in-SC-18 - A later visit is the same account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account that signed in with an emailed link
- **WHEN** that same address later signs in with another emailed link, or
  with Google when the brand has it
- **THEN** they enter the same account, not a second one

<!-- trace:scenario id=g10.shared-sign-in.SC-jqy rev=1 -->
#### Scenario: shared-auth-sign-in-SC-19 - Letter case does not create a second account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account that signed in at `Collector@example.com`
- **WHEN** that person later signs in at `collector@example.com`
- **THEN** they enter the same account, not a second one

<!-- trace:scenario id=g10.shared-sign-in.SC-z8l rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-05p rev=1 -->
#### Scenario: shared-auth-sign-in-SC-21 - A new verified email creates the account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an email that has never signed in
- **WHEN** a product of this brand that has verified that email asks to
  create or enter the account
- **THEN** an account exists for that address
- **AND** the product receives that account's user id

<!-- trace:scenario id=g10.shared-sign-in.SC-yal rev=1 -->
#### Scenario: shared-auth-sign-in-SC-22 - A known verified email is the same account
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **GIVEN** an account that signed in with an emailed link
- **WHEN** a product of this brand that has verified that same email asks
  to create or enter the account
- **THEN** they receive that same account, not a second one

<!-- trace:scenario id=g10.shared-sign-in.SC-aee rev=1 -->
#### Scenario: shared-auth-sign-in-SC-23 - A trusted product can sign the person in
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **WHEN** a product of this brand that has verified an email asks to sign
  that account in
- **THEN** the person is signed in as that account on this brand

<!-- trace:scenario id=g10.shared-sign-in.SC-py9 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-24 - A client cannot claim an email
**Serves:** shared-auth-sign-in-US-04 - Collector keeps one account for one verified address

- **WHEN** a client names an email and asks to create an account or a
  session
- **THEN** no account is created from that request
- **AND** the person is not signed in

<!-- trace:scenario id=g10.shared-sign-in.SC-jnb rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-fn7 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-31 - An untrusted redirect is ignored
**Serves:** shared-auth-sign-in-US-05 - Collector is not spammed or sent off-brand

- **GIVEN** a sign-in that names a location off this brand
- **WHEN** the person completes sign-in
- **THEN** they are on this brand
- **AND** they are not sent to that location

<!-- trace:scenario id=g10.shared-sign-in.SC-p8n rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-yp2 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-33 - The email step has no code control
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **WHEN** a person opens sign-in and reaches the email step
- **THEN** the step offers sending a sign-in link
- **AND** no control asks for or sends a sign-in code

<!-- trace:scenario id=g10.shared-sign-in.SC-8f8 rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-eax rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-juf rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-y0g rev=1 -->
#### Scenario: shared-auth-sign-in-SC-42 - A successful send shows Check Your Email and the address on its own line
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a person who asked for a sign-in link at an email address
- **WHEN** the send goes out
- **THEN** the dialog title is **Check Your Email**
- **AND** the surface shows a confirmation lead line
- **AND** the address appears on the line below that lead
- **AND** it does not state whether an account already exists

<!-- trace:scenario id=g10.shared-sign-in.SC-66a rev=1 -->
#### Scenario: shared-auth-sign-in-SC-43 - Resend is offered after a successful send
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a sign-in surface showing confirmation after a successful send
- **AND** sixty seconds have passed since that send
- **WHEN** the person activates Resend
- **THEN** the system treats it as another ask for a sign-in link at the same
  address
- **AND** the one-email-a-minute cap still applies

<!-- trace:scenario id=g10.shared-sign-in.SC-l77 rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-i4n rev=1 -->
#### Scenario: shared-auth-sign-in-SC-46 - Resend is disabled with a countdown after a send
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** a sign-in-link email has just been sent
- **WHEN** the link-sent surface is showing
- **THEN** Resend is disabled
- **AND** its label is **Resend (n)** with the whole seconds left in the
  sixty-second wait

<!-- trace:scenario id=g10.shared-sign-in.SC-4xi rev=1 -->
#### Scenario: shared-auth-sign-in-SC-47 - Resend re-enables when the countdown reaches zero
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** Resend is disabled with a countdown after a successful send
- **WHEN** sixty seconds have passed since that send
- **THEN** Resend is enabled
- **AND** its label is **Resend**

<!-- trace:scenario id=g10.shared-sign-in.SC-zss rev=1 -->
#### Scenario: shared-auth-sign-in-SC-48 - A successful resend restarts the countdown
**Serves:** shared-auth-sign-in-US-07 - Collector confirms the send and can resend

- **GIVEN** Resend is enabled on the link-sent surface
- **WHEN** the person activates Resend and the send goes out
- **THEN** Resend is disabled again for sixty seconds
- **AND** its label is **Resend (n)** with the whole seconds left

### Requirement: The email-step action is worded as sign-in with email

The email step's send action SHALL be labelled as signing in with email. The
sign-in surface's user-facing copy SHALL NOT use the term magic link.

<!-- trace:scenario id=g10.shared-sign-in.SC-fa4 rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-neg rev=1 -->
#### Scenario: shared-auth-sign-in-SC-50 - The dialog on the surface that asked closes
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a surface showing the sign-in dialog after a sign-in link was
  asked for there
- **WHEN** the collector follows that link elsewhere on this device and
  returns to the surface that asked
- **THEN** the sign-in dialog is gone
- **AND** the surface shows them signed in
- **AND** no message on it announces that the session arrived

<!-- trace:scenario id=g10.shared-sign-in.SC-24f rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-wiy rev=1 -->
#### Scenario: shared-auth-sign-in-SC-52 - The refused action is carried out
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart and
  asked for a sign-in link on that surface
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** that item is in their cart
- **AND** they did not activate the add a second time

<!-- trace:scenario id=g10.shared-sign-in.SC-laa rev=1 -->
#### Scenario: shared-auth-sign-in-SC-53 - The refused navigation is carried out
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped before a page that needs a session and
  asked for a sign-in link on that surface
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** that surface is on the page they were stopped before

<!-- trace:scenario id=g10.shared-sign-in.SC-dyk rev=1 -->
#### Scenario: shared-auth-sign-in-SC-54 - A dialog with nothing behind it only closes
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who opened sign-in from a sign-in control, with no
  action refused behind it, and asked for a link there
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** the sign-in dialog is gone
- **AND** the surface shows them signed in
- **AND** no action is carried out on their behalf

<!-- trace:scenario id=g10.shared-sign-in.SC-szm rev=1 -->
#### Scenario: shared-auth-sign-in-SC-55 - A link that creates no session leaves the asking surface as it was
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a surface showing the sign-in dialog after a sign-in link was
  asked for there
- **WHEN** that link is followed elsewhere on this device and creates no
  session
- **THEN** the surface that asked still shows the sign-in dialog
- **AND** the action it refused is not carried out
- **AND** nothing on it announces that the follow failed

<!-- trace:scenario id=g10.shared-sign-in.SC-lws rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-m9z rev=1 -->
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

<!-- trace:scenario id=g10.shared-sign-in.SC-jqc rev=1 -->
#### Scenario: shared-auth-sign-in-SC-58 - A link followed inside five minutes signs in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused sign-in link sent four minutes ago
- **AND** no later sign-in-link email has gone to that address
- **WHEN** the person follows that link
- **THEN** they are signed in as the account for that address

<!-- trace:scenario id=g10.shared-sign-in.SC-lfj rev=1 -->
#### Scenario: shared-auth-sign-in-SC-59 - A link five minutes old does not sign in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link sent five minutes ago
- **WHEN** anyone follows that link
- **THEN** no session is created

<!-- trace:scenario id=g10.shared-sign-in.SC-hs9 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-60 - The resend wait running out leaves the link alive
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused sign-in link sent more than sixty seconds ago
- **AND** the resend wait for that address has run out with no second send
- **WHEN** the person follows that link
- **THEN** they are signed in as the account for that address

<!-- trace:scenario id=g10.shared-sign-in.SC-etq rev=1 -->
#### Scenario: shared-auth-sign-in-SC-62 - A device clock does not revive an expired link
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link whose five minutes have run out
- **WHEN** anyone follows it from a device whose clock reads inside those five
  minutes
- **THEN** no session is created

### Requirement: The sign-in email states how long the link lasts

The sign-in-link email SHALL state that the link lasts five minutes, in every
language it is sent in, and SHALL NOT name another lifetime.

<!-- trace:scenario id=g10.shared-sign-in.SC-dos rev=1 -->
#### Scenario: shared-auth-sign-in-SC-61 - The sign-in email says five minutes
**Serves:** Emailed link - what the email promises about the link it carries

- **WHEN** a sign-in-link email is sent
- **THEN** its body states that the link lasts five minutes
- **AND** it names no other lifetime
- **AND** it says so in the language the email is written in

### Requirement: A failed link follow lands on the brand home with a toast

WHEN anyone follows a sign-in link that does not create a session, the system
SHALL leave them on this brand's home and SHALL announce the failure in a
toast. An expired link SHALL use the expired announcement. A used,
superseded, or otherwise invalid link SHALL use one shared announcement that
the link no longer works. WHEN the account for that address is banned, the
follow SHALL create no session, SHALL leave them on this brand's home, and
SHALL use the cannot-sign-in announcement — not the expired or no-longer-works
announcement.

<!-- trace:scenario id=g10.shared-sign-in.SC-4mo rev=1 -->
#### Scenario: shared-auth-sign-in-SC-37 - An expired link toasts on the brand home
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link has expired

<!-- trace:scenario id=g10.shared-sign-in.SC-66b rev=1 -->
#### Scenario: shared-auth-sign-in-SC-38 - A used link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link that has already created a session
- **WHEN** anyone follows that link again
- **THEN** no new session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

<!-- trace:scenario id=g10.shared-sign-in.SC-i3d rev=1 -->
#### Scenario: shared-auth-sign-in-SC-39 - A superseded link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** an unused unexpired sign-in link that a later sign-in-link email
  for the same address replaced
- **WHEN** anyone follows the earlier link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

<!-- trace:scenario id=g10.shared-sign-in.SC-rt4 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-40 - An invalid link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link token that is malformed or unknown
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

<!-- trace:scenario id=g10.shared-sign-in.SC-lja rev=1 -->
#### Scenario: shared-auth-sign-in-SC-41 - A banned account's link follow toasts cannot sign in
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a banned account and a sign-in link for that account's address
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that they cannot sign in
- **AND** the toast does not invite them to request another link

### Requirement: A signed-in mismatch prompts Switch or Stay instead of replacing the session

A collector who is already signed in and follows a valid sign-in link for a
different account meets a choice instead of an automatic session swap.

- **Trigger** — WHEN a signed-in collector follows a valid sign-in link for a
  different account, the system SHALL NOT replace the current session on its
  own and SHALL show a warning toast offering Switch and Stay.
- **Toast content** — The toast's title SHALL state that they are signed in
  with a different account. Its description SHALL name the link's email and
  SHALL NOT name the current session's email.
- **Switch** — SHALL end the current session and enter the link's account.
- **Stay** — SHALL keep the current session and SHALL NOT enter the link's
  account.
- **Dismiss** — Dismissing the toast SHALL have the same effect as Stay.
- **Persistence** — The toast SHALL remain until Switch, Stay, or dismiss is
  chosen.

<!-- trace:scenario id=g10.shared-sign-in.SC-vu9 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-63 - A signed-in mismatch does not auto-switch
**Serves:** shared-auth-sign-in-US-09 - a collector already signed in follows a link meant for another account

- **GIVEN** a collector is signed in as one account
- **WHEN** they follow a valid sign-in link for a different account
- **THEN** the current session stays in place
- **AND** no session is created for the link's account

<!-- trace:scenario id=g10.shared-sign-in.SC-9y1 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-64 - The different-account toast names the mismatch and the link's email
**Serves:** shared-auth-sign-in-US-09 - a collector reads the choice a mismatched link offers

- **GIVEN** a collector is signed in as one account
- **WHEN** they follow a valid sign-in link for a different account
- **THEN** a warning toast appears
- **AND** its title states they are signed in with a different account
- **AND** its description names the link's email
- **AND** its description does not name the current session's email

<!-- trace:scenario id=g10.shared-sign-in.SC-nnn rev=1 -->
#### Scenario: shared-auth-sign-in-SC-65 - Switch enters the link's account
**Serves:** shared-auth-sign-in-US-09 - a collector chooses to leave their account for the link's

- **GIVEN** the different-account toast is showing
- **WHEN** the collector chooses Switch
- **THEN** the current session ends
- **AND** the link's account is entered

<!-- trace:scenario id=g10.shared-sign-in.SC-yxx rev=1 -->
#### Scenario: shared-auth-sign-in-SC-66 - Stay keeps the current session
**Serves:** shared-auth-sign-in-US-09 - a collector chooses to keep the account they were using

- **GIVEN** the different-account toast is showing
- **WHEN** the collector chooses Stay
- **THEN** the current session continues
- **AND** the link's account is not entered

<!-- trace:scenario id=g10.shared-sign-in.SC-c6r rev=1 -->
#### Scenario: shared-auth-sign-in-SC-67 - Dismissing the toast keeps the current session, same as Stay
**Serves:** shared-auth-sign-in-US-09 - a collector closes the toast without choosing

- **GIVEN** the different-account toast is showing
- **WHEN** the collector dismisses the toast
- **THEN** the current session continues
- **AND** the link's account is not entered

<!-- trace:scenario id=g10.shared-sign-in.SC-hy8 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-68 - The different-account toast waits for a choice rather than auto-dismissing
**Serves:** shared-auth-sign-in-US-09 - a collector takes time to decide between Switch and Stay

- **GIVEN** the different-account toast is showing
- **WHEN** no choice is made
- **THEN** the toast remains visible
- **AND** the current session is unaffected

<!-- trace:scenario id=g10.shared-sign-in.SC-fda rev=1 -->
#### Scenario: shared-auth-sign-in-SC-69 - A link for the signed-in account itself shows no mismatch toast
**Serves:** shared-auth-sign-in-US-09 - a collector's own link is not treated as a mismatch

- **GIVEN** a collector is signed in as one account
- **WHEN** they follow a valid sign-in link for that same account
- **THEN** no different-account toast is shown

### Requirement: A surface still waiting stops waiting once its address settles elsewhere

A surface can be left waiting for its own sign-in request after the person
completes it somewhere else; this is what lets it stop.

- **Ending the wait** — WHILE a surface is showing the sign-in dialog's wait
  after asking for a sign-in link at an address, WHEN that address completes
  sign-in by any offered method on another device, the waiting surface SHALL
  end its wait without a reload and SHALL show a message that sign-in
  completed on another device.
- **No session hand-off** — The waiting surface SHALL NOT gain a session of
  its own; only the device that completed sign-in holds one.
- **Scoped to its own address** — A sign-in completed elsewhere for a
  different address SHALL NOT end this wait.
- **The pending link is unaffected** — A pending, unused, unexpired link for
  that address SHALL still create a session if followed, on the terms this
  capability already sets for that link, whether or not the address has
  settled elsewhere by another method.

<!-- trace:scenario id=g10.shared-sign-in.SC-s9k rev=1 -->
#### Scenario: shared-auth-sign-in-SC-70 - The wait ends when the address follows the link elsewhere
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address follows the link and signs in on another device
- **THEN** the waiting surface stops waiting
- **AND** it shows a message that sign-in completed on another device

<!-- trace:scenario id=g10.shared-sign-in.SC-4ki rev=1 -->
#### Scenario: shared-auth-sign-in-SC-71 - The wait ends when the address signs in by another method elsewhere
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address completes Google sign-in on another device instead
  of following the link
- **THEN** the waiting surface stops waiting
- **AND** it shows the same settled-elsewhere message

<!-- trace:scenario id=g10.shared-sign-in.SC-5yx rev=1 -->
#### Scenario: shared-auth-sign-in-SC-72 - The surface that stops waiting gains no session of its own
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface that stopped waiting because its address settled
  elsewhere
- **WHEN** the settled-elsewhere message is showing
- **THEN** that surface is not signed in
- **AND** no session was created for it

<!-- trace:scenario id=g10.shared-sign-in.SC-zsr rev=1 -->
#### Scenario: shared-auth-sign-in-SC-73 - A different address settling elsewhere leaves the wait running
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** a different address completes sign-in on another device
- **THEN** the waiting surface keeps waiting
- **AND** its resend countdown is unaffected

<!-- trace:scenario id=g10.shared-sign-in.SC-rpa rev=1 -->
#### Scenario: shared-auth-sign-in-SC-74 - A failed attempt elsewhere leaves the wait running
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address's link is followed elsewhere and creates no session
  — expired, already used, or the account is banned
- **THEN** the waiting surface keeps waiting
- **AND** it shows no settled-elsewhere message

<!-- trace:scenario id=g10.shared-sign-in.SC-45a rev=1 -->
#### Scenario: shared-auth-sign-in-SC-75 - Every surface waiting on the address ends its wait
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** two surfaces each showing Check Your Email after asking for a
  sign-in link at the same address
- **WHEN** that address completes sign-in on another device
- **THEN** both surfaces stop waiting and show the settled-elsewhere message

<!-- trace:scenario id=g10.shared-sign-in.SC-2ky rev=1 -->
#### Scenario: shared-auth-sign-in-SC-76 - A backgrounded waiting surface still learns once foregrounded
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email, backgrounded before its
  address settles elsewhere
- **WHEN** that surface is foregrounded again after the address has settled
- **THEN** it shows the settled-elsewhere message without a reload

<!-- trace:scenario id=g10.shared-sign-in.SC-6ov rev=1 -->
#### Scenario: shared-auth-sign-in-SC-77 - The settle is independent of the resend countdown
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email, whether Resend is still
  counting down or already enabled
- **WHEN** that address completes sign-in on another device
- **THEN** the waiting surface stops waiting the same way regardless of the
  countdown's state

<!-- trace:scenario id=g10.shared-sign-in.SC-j5r rev=1 -->
#### Scenario: shared-auth-sign-in-SC-78 - The pending link survives a settle by another method
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** an unused, unexpired sign-in link for an address
- **WHEN** that address completes sign-in elsewhere by a different method
- **THEN** the link still creates a session if followed before it expires or
  a later send supersedes it

### Requirement: The settled-elsewhere check is scoped to the requesting flow, not a bare address

The check that decides whether a waiting surface's address has settled
elsewhere SHALL be evaluated against that surface's own sign-in request and
the secret its own flow holds. Naming an email address alone, without that
flow's own secret, SHALL NOT reveal whether that address currently holds a
session anywhere.

<!-- trace:scenario id=g10.shared-sign-in.SC-pdz rev=1 -->
#### Scenario: shared-auth-sign-in-SC-79 - A bare address does not disclose a session elsewhere
**Serves:** Emailed link - naming an address alone does not disclose whether it holds a session

- **GIVEN** an email address that currently holds a session
- **WHEN** that address is checked without the secret of a flow that
  requested a sign-in link for it
- **THEN** the check does not reveal that the address holds a session

### Requirement: Google's auto-prompt offers sign-in and yields to the sign-in dialog

Google's own auto-prompt offers sign-in to a signed-out person without them
opening the sign-in dialog first, on any brand that already has Google
sign-in.

- **Brand-offered** - WHEN the brand has Google sign-in, the system SHALL
  show Google's own auto-prompt to a signed-out person before they open the
  sign-in dialog. WHEN the brand does not have Google sign-in, the system
  SHALL NOT show the prompt.
- **Signed-out only** - the system SHALL NOT show the prompt to a person who
  has a session.
- **One ask at a time** - the prompt SHALL NOT show while the sign-in dialog
  is open, and the system SHALL dismiss an already-showing prompt the moment
  the sign-in dialog opens.
- **Suppressed after a decline** - WHEN opening the sign-in dialog has
  dismissed a showing prompt and the person closes that dialog without
  signing in, the system SHALL NOT show the prompt again for the rest of
  that visit.
- **Every page** - the system SHALL show the prompt on any page a
  signed-out person visits.
- **No side effect on decline** - a person who does not act on the prompt
  SHALL remain signed out, with no session created and no dialog opened.
- **Same terms as the Google control** - completing the prompt SHALL sign a
  person in on the same terms the Google control's requirement sets: a
  verified Google email creates a session for that account, and an
  unverified email creates neither an account nor a session.
- **Keeps the page usable** - WHEN the prompt does not load, the system
  SHALL leave the page and the sign-in dialog fully usable.

<!-- trace:scenario id=g10.shared-sign-in.SC-ph5 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-80 - The prompt appears for a signed-out visitor without opening the dialog
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in
- **WHEN** a signed-out collector visits a page without opening the sign-in
  dialog
- **THEN** Google's own auto-prompt appears offering sign-in

<!-- trace:scenario id=g10.shared-sign-in.SC-iaq rev=1 -->
#### Scenario: shared-auth-sign-in-SC-81 - A brand without Google sign-in never shows the prompt
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that does not have Google sign-in
- **WHEN** a signed-out collector visits a page
- **THEN** no Google auto-prompt appears

<!-- trace:scenario id=g10.shared-sign-in.SC-5lg rev=1 -->
#### Scenario: shared-auth-sign-in-SC-82 - The prompt does not show while the sign-in dialog is open
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in
- **WHEN** a signed-out collector opens the sign-in dialog
- **THEN** the Google auto-prompt does not appear while the dialog is open

<!-- trace:scenario id=g10.shared-sign-in.SC-emf rev=1 -->
#### Scenario: shared-auth-sign-in-SC-83 - Opening the dialog dismisses an already-showing prompt
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt already
  showing to a signed-out collector
- **WHEN** that collector opens the sign-in dialog
- **THEN** the auto-prompt is dismissed
- **AND** only the sign-in dialog remains visible

<!-- trace:scenario id=g10.shared-sign-in.SC-bp4 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-84 - Completing the prompt with a verified email signs in
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt showing
- **WHEN** the collector completes the prompt with a Google account whose
  email is verified
- **THEN** they are signed in as the account for that address, on the same
  terms the Google control's requirement sets

<!-- trace:scenario id=g10.shared-sign-in.SC-75s rev=1 -->
#### Scenario: shared-auth-sign-in-SC-85 - Completing the prompt with an unverified email does not sign in
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt showing
- **WHEN** the collector completes the prompt with a Google account whose
  email Google has not verified
- **THEN** no account is created from that request
- **AND** they are not signed in

<!-- trace:scenario id=g10.shared-sign-in.SC-psv rev=1 -->
#### Scenario: shared-auth-sign-in-SC-86 - A signed-in visitor never sees the prompt
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, and a person who already has a
  session
- **WHEN** that person visits a page
- **THEN** no Google auto-prompt appears

<!-- trace:scenario id=g10.shared-sign-in.SC-l6p rev=1 -->
#### Scenario: shared-auth-sign-in-SC-87 - The prompt is offered on any page, including checkout
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in
- **WHEN** a signed-out collector visits any page of that brand, including
  checkout
- **THEN** the auto-prompt appears the same way it does on any other page

<!-- trace:scenario id=g10.shared-sign-in.SC-qqs rev=1 -->
#### Scenario: shared-auth-sign-in-SC-88 - Ignoring the prompt leaves the page unaffected
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, with the auto-prompt showing to
  a signed-out collector
- **WHEN** that collector continues using the page without completing the
  prompt or opening the sign-in dialog
- **THEN** they remain signed out
- **AND** the page behaves exactly as it would with no prompt showing

<!-- trace:scenario id=g10.shared-sign-in.SC-fsu rev=1 -->
#### Scenario: shared-auth-sign-in-SC-89 - A prompt that fails to load leaves the page usable
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, in an environment that prevents
  Google's prompt from loading
- **WHEN** a signed-out collector visits a page
- **THEN** the page loads normally with no auto-prompt shown
- **AND** the sign-in dialog remains reachable and works as it always does

<!-- trace:scenario id=g10.shared-sign-in.SC-dl3 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-90 - Declining the dialog suppresses the prompt for the rest of the visit
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, where opening the sign-in
  dialog has already dismissed a showing prompt
- **WHEN** the collector closes that dialog without signing in and visits
  another page in the same visit
- **THEN** the auto-prompt does not appear again for the rest of that visit
