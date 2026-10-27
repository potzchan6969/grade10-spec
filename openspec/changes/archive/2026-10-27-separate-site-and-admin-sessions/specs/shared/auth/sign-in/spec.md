# shared/auth/sign-in — delta

## Feature set

- In-flight commands
  - One request: activating a sign-in command again while it runs starts no second request
- Emailed link
  - Only email method: the email step sends a link and nothing else
  - Sent confirmation: after a send that went out, title the dialog Check Your Email, name the address on its own line, and offer Resend
  - Resend wait: Resend stays off for sixty seconds after each successful send, counting down on the button
  - Link lifetime: a sign-in link lasts five minutes, and the email carrying it says five minutes
  - One-time session: an unused unexpired link signs in once
  - Failed follow feedback: expired, dead, and banned links land on the brand home with a toast; a console-asked link lands on the console's own sign-in page with an inline message
  - Followed elsewhere: the surface that asked carries on once the session arrives
  - Signed-in mismatch: a link follow while signed in as a different account offers Switch or Stay instead of replacing the session
  - Settled elsewhere: a surface still waiting on its own request stops waiting, without gaining a session of its own, once that address signs in by any method on another device on the same side, the site or the console
- Link surface
  - Asking surface: a link signs in the surface that asked for it and no other
  - Product sign-in: a sign-in a product makes on a person's behalf signs in the site and never the console
  - Own mismatch: "already signed in as someone else" is judged on the session of the surface the link belongs to
  - Operator site link: the one exception to the asking surface - a site link an operator action sends from the console for a customer account signs in the site and not the console, and only an elevated console session may ask for it
- Google
  - Brand-offered: a brand that enables Google shows it; an unverified email does not sign in
  - Auto-prompt: the site's Google corner prompt offers sign-in to a
    signed-out visitor without opening the dialog first, wherever the brand
    already offers Google sign-in
  - One ask at a time: the prompt does not show while the sign-in dialog is
    open, and opening the dialog dismisses it
- Account identity
  - One person per address: first visit creates the account; later visits are the same person
- Rate limits and redirects
  - One email a minute: a second send in a minute, for the same address and surface, is told to wait
  - Trusted return: an untrusted redirect is ignored
- Surface wording
  - Sign in with email: the email-step action and dialog copy never say magic link to the collector

## RENAMED Requirements

- FROM: `### Requirement: A failed link follow lands on the brand home with a toast`
- TO: `### Requirement: A failed link follow leaves the asking surface with the failure announced`

### Requirement: A failed link follow leaves the asking surface with the failure announced

WHEN anyone follows a sign-in link asked from the site that does not create a
session, the system SHALL leave them on this brand's home and SHALL announce
the failure in a toast. An expired link SHALL use the expired announcement. A used,
superseded, or otherwise invalid link SHALL use one shared announcement that
the link no longer works. WHEN the account for that address is banned, the
follow SHALL create no session, SHALL leave them on this brand's home, and
SHALL use the cannot-sign-in announcement — not the expired or no-longer-works
announcement.

WHEN the link was asked from the console, the system SHALL leave them on the
console's own sign-in page and SHALL announce the failure inline in that page,
with the same wording the site's toast uses for that failure, because the
console has no toasts.

<!-- trace:scenario id=g10.shared-sign-in.SC-4mo rev=1 -->
#### Scenario: shared-auth-sign-in-SC-37 - An expired link toasts on the brand home
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link asked from the site whose time to live has ended
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link has expired

<!-- trace:scenario id=g10.shared-sign-in.SC-66b rev=1 -->
#### Scenario: shared-auth-sign-in-SC-38 - A used link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link asked from the site that has already created a
  session
- **WHEN** anyone follows that link again
- **THEN** no new session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

<!-- trace:scenario id=g10.shared-sign-in.SC-i3d rev=1 -->
#### Scenario: shared-auth-sign-in-SC-39 - A superseded link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** an unused unexpired sign-in link asked from the site that a later
  sign-in-link email asked from the site for the same address replaced
- **WHEN** anyone follows the earlier link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

<!-- trace:scenario id=g10.shared-sign-in.SC-rt4 rev=1 -->
#### Scenario: shared-auth-sign-in-SC-40 - An invalid link toasts that it no longer works
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a sign-in link token asked from the site that is malformed or
  unknown
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that the link no longer works

<!-- trace:scenario id=g10.shared-sign-in.SC-lja rev=1 -->
#### Scenario: shared-auth-sign-in-SC-41 - A banned account's link follow toasts cannot sign in
**Serves:** shared-auth-sign-in-US-06 - Collector follows a link that cannot sign them in

- **GIVEN** a banned account and a sign-in link asked from the site for that
  account's address
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on this brand's home
- **AND** a toast states that they cannot sign in
- **AND** the toast does not invite them to request another link

#### Scenario: shared-auth-sign-in-SC-103 - A failed console-asked link lands on the console's sign-in page with an inline message
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** a sign-in link asked from the console that is expired, used,
  superseded or invalid
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on the console's own sign-in page
- **AND** the page states inline that the link has expired or no longer works
- **AND** no toast is shown

#### Scenario: shared-auth-sign-in-SC-104 - A banned account's console-asked link says inline that they cannot sign in
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** a banned account and a sign-in link for that account's address
  asked from the console
- **WHEN** anyone follows that link
- **THEN** no session is created
- **AND** they are on the console's own sign-in page
- **AND** the page states inline that they cannot sign in

## MODIFIED Requirements

### Requirement: Sign-in stays on the brand

WHEN sign-in names no location, or would send the person to a location that is
not this brand, or not the surface that asked for the sign-in, the system SHALL
ignore that location and SHALL leave them on this brand, on the surface that
asked.

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
- **THEN** they are on this brand, on the surface that asked

#### Scenario: shared-auth-sign-in-SC-97 - A location on the other surface is ignored
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** a sign-in link asked from the console that names a location on the
  site
- **WHEN** the person follows it
- **THEN** they are on the console
- **AND** they are not sent to that location

### Requirement: A signed-in mismatch prompts Switch or Stay instead of replacing the session

A collector who is already signed in on the site and follows a valid sign-in
link asked from the site for a different account meets a choice instead of an
automatic session swap. The check reads the session of the surface the link was
asked from and no other. On the console, the choice is shown inline on the
console's own sign-in page, because the console has no toasts, and it offers
the same Switch and Stay.

- **Trigger** — On the site, WHEN a signed-in collector follows a valid sign-in link for a
  different account, the system SHALL NOT replace the current session on its
  own and SHALL show a warning toast offering Switch and Stay.
- **Toast content** — On the site, the toast's title SHALL state that they are signed in
  with a different account. Its description SHALL name the link's email and
  SHALL NOT name the current session's email.
- **Switch** — SHALL end the current session and enter the link's account.
- **Stay** — SHALL keep the current session and SHALL NOT enter the link's
  account.
- **Dismiss** — On the site, dismissing the toast SHALL have the same effect as Stay.
- **Persistence** — On the site, the toast SHALL remain until Switch, Stay, or dismiss is
  chosen.
- **On the console** — The inline choice SHALL state that they are signed in
  with a different account, SHALL name the link's email and not the current
  session's, SHALL offer Switch and Stay with the same effects, and SHALL remain
  until one is chosen.

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

#### Scenario: shared-auth-sign-in-SC-96 - A session on the other surface is not a mismatch
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** a person signed in on the site as one account
- **WHEN** an operator follows a valid sign-in link asked from the console for
  a different account
- **THEN** no different-account choice is offered
- **AND** the console is signed in as the link's account
- **AND** the site is still signed in as the first account

#### Scenario: shared-auth-sign-in-SC-98 - A console session as a different account is a mismatch on the console
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** an operator signed in on the console as one account
- **WHEN** they follow a valid sign-in link asked from the console for a
  different account
- **THEN** the console's current session stays in place
- **AND** no console session is created for the link's account
- **AND** the site's session is as it was before

#### Scenario: shared-auth-sign-in-SC-105 - The console offers Switch and Stay inline
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** an operator signed in on the console as one account
- **WHEN** they follow a valid sign-in link asked from the console for a
  different account
- **THEN** the console's own sign-in page shows inline that they are signed in
  with a different account and names the link's email
- **AND** it offers Switch and Stay
- **AND** no toast is shown

#### Scenario: shared-auth-sign-in-SC-106 - Switch on the console enters the link's account on the console only
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** the console's inline different-account choice is showing, and a
  session on the site
- **WHEN** the operator chooses Switch
- **THEN** the console's current session ends and the link's account is entered
  on the console
- **AND** the site's session is as it was

#### Scenario: shared-auth-sign-in-SC-107 - Stay on the console keeps the console session
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** the console's inline different-account choice is showing
- **WHEN** the operator chooses Stay
- **THEN** the console's current session continues
- **AND** the link's account is not entered

### Requirement: Sign-in-link emails are capped per address

The system SHALL send at most one sign-in-link email to one email address
asked from one surface, the site or the console, in any sixty-second window. A
send beyond that cap SHALL NOT send another email. The surface SHALL tell the person to wait. It SHALL NOT use the copy
of a failed send. After a send that went out, the resend control SHALL wait
out the same window. A link sent for the same address on the other surface
SHALL NOT count against the cap.

<!-- trace:scenario id=g10.shared-sign-in.SC-eax rev=1 -->
#### Scenario: shared-auth-sign-in-SC-35 - A second link send in a minute is told to wait
**Serves:** shared-auth-sign-in-US-05 - Collector is not spammed or sent off-brand

- **GIVEN** a sign-in-link email already sent to one address from one surface
  in the last sixty seconds
- **WHEN** that address asks for another sign-in link from the same surface
- **THEN** no second email is sent
- **AND** the surface tells them to wait
- **AND** it does not state that the link was not sent

#### Scenario: shared-auth-sign-in-SC-99 - A console link right after a site link for the same address is sent
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** a sign-in-link email sent to one address from the site in the last
  sixty seconds
- **WHEN** that address asks for a sign-in link from the console
- **THEN** the console link is sent
- **AND** the surface does not tell them to wait

### Requirement: A new link replaces earlier unused links

WHEN a sign-in-link email is sent to an address for a surface, any earlier
unused link for that address asked from the same surface SHALL NOT create a
session. A link for that address asked from the other surface SHALL be left as
it was.

<!-- trace:scenario id=g10.shared-sign-in.SC-juf rev=1 -->
#### Scenario: shared-auth-sign-in-SC-36 - A new link kills the earlier link
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused unexpired sign-in link for an address
- **WHEN** a later sign-in-link email is sent to that address
- **THEN** following the earlier link creates no session

#### Scenario: shared-auth-sign-in-SC-100 - A console link leaves an unused site link alive
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** an unused unexpired sign-in link for an address asked from the site
- **WHEN** a later sign-in-link email is sent to that address from the console
- **THEN** following the site link still signs in the site

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
**Serves:** Emailed link - a session arriving leaves no sign-in dialog open on that side of the brand

- **GIVEN** two surfaces on the same side of one brand, both on the site or
  both on the console, open in a browser, each showing the sign-in dialog, and
  a sign-in link asked for on only one of them
- **WHEN** the person follows that link elsewhere on this device and returns to
  each surface
- **THEN** the sign-in dialog is gone from both
- **AND** both show them signed in

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
- **Scoped to its own side** — WHEN that address completes sign-in on the site,
  only waits that asked from the site SHALL end; WHEN it completes sign-in on
  the console, only waits that asked from the console SHALL end. A wait on the
  other side SHALL keep running.
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
- **WHEN** that address follows the link and signs in on another device, on the
  same side as that surface
- **THEN** the waiting surface stops waiting
- **AND** it shows a message that sign-in completed on another device

<!-- trace:scenario id=g10.shared-sign-in.SC-4ki rev=1 -->
#### Scenario: shared-auth-sign-in-SC-71 - The wait ends when the address signs in by another method elsewhere
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address completes Google sign-in on another device, on the
  same side as that surface, instead of following the link
- **THEN** the waiting surface stops waiting
- **AND** it shows the same settled-elsewhere message

<!-- trace:scenario id=g10.shared-sign-in.SC-5yx rev=1 -->
#### Scenario: shared-auth-sign-in-SC-72 - The surface that stops waiting gains no session of its own
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface that stopped waiting because its address signed in on
  another device on the same side
- **WHEN** the settled-elsewhere message is showing
- **THEN** that surface is not signed in
- **AND** no session was created for it

<!-- trace:scenario id=g10.shared-sign-in.SC-zsr rev=1 -->
#### Scenario: shared-auth-sign-in-SC-73 - A different address settling elsewhere leaves the wait running
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** a different address completes sign-in on another device, on the same
  side as that surface
- **THEN** the waiting surface keeps waiting
- **AND** its resend countdown is unaffected

<!-- trace:scenario id=g10.shared-sign-in.SC-rpa rev=1 -->
#### Scenario: shared-auth-sign-in-SC-74 - A failed attempt elsewhere leaves the wait running
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address's link is followed on another device, on the same side
  as that surface, and creates no session — expired, already used, or the
  account is banned
- **THEN** the waiting surface keeps waiting
- **AND** it shows no settled-elsewhere message

<!-- trace:scenario id=g10.shared-sign-in.SC-45a rev=1 -->
#### Scenario: shared-auth-sign-in-SC-75 - Every surface waiting on the address ends its wait
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** two surfaces on the same side, the site or the console, each
  showing Check Your Email after asking for a sign-in link at the same address
- **WHEN** that address completes sign-in on another device, on that side
- **THEN** both surfaces stop waiting and show the settled-elsewhere message

<!-- trace:scenario id=g10.shared-sign-in.SC-2ky rev=1 -->
#### Scenario: shared-auth-sign-in-SC-76 - A backgrounded waiting surface still learns once foregrounded
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email, backgrounded before its
  address signs in on another device on the same side
- **WHEN** that surface is foregrounded again after the address has settled
- **THEN** it shows the settled-elsewhere message without a reload

<!-- trace:scenario id=g10.shared-sign-in.SC-6ov rev=1 -->
#### Scenario: shared-auth-sign-in-SC-77 - The settle is independent of the resend countdown
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email, whether Resend is still
  counting down or already enabled
- **WHEN** that address completes sign-in on another device, on the same side as
  that surface
- **THEN** the waiting surface stops waiting the same way regardless of the
  countdown's state

<!-- trace:scenario id=g10.shared-sign-in.SC-j5r rev=1 -->
#### Scenario: shared-auth-sign-in-SC-78 - The pending link survives a settle by another method
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** an unused, unexpired sign-in link for an address
- **WHEN** that address completes sign-in elsewhere by a different method, on
  the side the link was asked from
- **THEN** the link still creates a session if followed before it expires or
  a later send supersedes it

#### Scenario: shared-auth-sign-in-SC-101 - A site sign-in elsewhere leaves a console wait running
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** a console showing Check Your Email after asking for a sign-in link
  at an address
- **WHEN** that address signs in on the site on another device
- **THEN** the console keeps waiting
- **AND** it shows no settled-elsewhere message

#### Scenario: shared-auth-sign-in-SC-102 - A console sign-in elsewhere leaves a site wait running
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** the site showing Check Your Email after asking for a sign-in link
  at an address
- **WHEN** that address signs in on the console on another device
- **THEN** the site keeps waiting
- **AND** it shows no settled-elsewhere message

### Requirement: A trusted product may create or enter an account by a verified email

A product of this brand that has verified an email SHALL create an account
for that address when none exists, and SHALL enter the existing account
when one does. It SHALL be able to sign that person in on the site. The person
SHALL NOT need to complete a link or Google sign-in for that to happen. The
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
- **THEN** the person is signed in as that account on this brand's site

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

### Requirement: Google's auto-prompt offers sign-in and yields to the sign-in dialog

Google's own auto-prompt offers sign-in to a signed-out person without them
opening the sign-in dialog first, on any brand that already has Google
sign-in. It is the site's prompt, and signed out is read on the surface that
shows it.

- **Brand-offered** - WHEN the brand has Google sign-in, the system SHALL
  show Google's own auto-prompt to a signed-out person before they open the
  sign-in dialog. WHEN the brand does not have Google sign-in, the system
  SHALL NOT show the prompt.
- **Signed-out only** - the system SHALL NOT show the prompt to a person who
  has a session on the surface that shows it, the site. A session on the
  console SHALL NOT withhold it: a person signed in on the console only is
  still offered the prompt on the site.
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
  site session
- **WHEN** that person visits a page of the site
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

#### Scenario: shared-auth-sign-in-SC-114 - A console session does not withhold the prompt on the site
**Serves:** shared-auth-sign-in-US-11 - Collector is offered Google sign-in without opening the dialog

- **GIVEN** a brand that has Google sign-in, and a person signed in on the
  console and not on the site
- **WHEN** that person visits a page of the site without opening the sign-in
  dialog
- **THEN** Google's own auto-prompt appears offering sign-in

## ADDED Requirements

### Requirement: A sign-in signs in the surface that asked for it

A sign-in SHALL sign in the surface it was asked on, the site or the console,
and no other, by every method. A sign-in link SHALL sign in the surface that
asked for it whoever follows it and wherever it is followed, and a Resend SHALL
ask for the same surface. A product of the brand that has verified an email
SHALL sign that person in on the site only.

The one exception is a site link an operator action on the console asks for, to
be sent to a customer account's address. That link SHALL sign in the site and
SHALL NOT sign in the console, and every rule of this capability that names the
surface that asked SHALL read its surface as the site. The system SHALL accept
that request only with an elevated console session whose role holds
`user:create`, the grant that makes an account. WHEN the request carries no
console session, the system SHALL refuse it as not signed in. WHEN the console
session's role does not hold the grant, the system SHALL refuse it as not
allowed. WHEN the console session has not proven its second factor, the system
SHALL refuse it and ask for the second factor. A refused request SHALL send
nothing.

#### Scenario: shared-auth-sign-in-SC-91 - A link asked from the console signs in the console only
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** an operator who asked for a sign-in link from the console
- **WHEN** they follow the link
- **THEN** the console is signed in as the account for that address
- **AND** the site's session is as it was before

#### Scenario: shared-auth-sign-in-SC-92 - A link asked from the site signs in the site only
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** an operator who asked for a sign-in link from the site
- **WHEN** they follow the link
- **THEN** the site is signed in as the account for that address
- **AND** the console's session is as it was before

#### Scenario: shared-auth-sign-in-SC-93 - A resend keeps the surface that asked
**Serves:** shared-auth-sign-in-US-12 - Operator follows a sign-in link and only the console is signed in

- **GIVEN** an operator who asked for a sign-in link from the console and
  activates Resend
- **WHEN** they follow the link the resend sent
- **THEN** the console is signed in as the account for that address
- **AND** the site's session is as it was before

#### Scenario: shared-auth-sign-in-SC-94 - Google sign-in on the console signs in the console only
**Serves:** shared-auth-sign-in-US-03 - Collector signs in with Google when the brand offers it

- **GIVEN** a brand that has Google sign-in, and an operator who is not signed
  in to the console
- **WHEN** they complete Google sign-in on the console with a verified email
- **THEN** the console is signed in as the account for that address
- **AND** the site's session is as it was before

#### Scenario: shared-auth-sign-in-SC-95 - A product's sign-in is the site's and never the console's
**Serves:** Link surface - a sign-in a product makes on a person's behalf signs in the site and never the console

- **WHEN** a product of the brand that has verified an email signs that
  account in
- **THEN** the site is signed in as that account
- **AND** the console is not signed in

#### Scenario: shared-auth-sign-in-SC-108 - A site link an operator action sends signs in the site, not the console
**Serves:** Link surface - a site link an operator action sends from the console signs in the site and not the console

- **GIVEN** an operator signed in to the console with an elevated session, and
  a customer account
- **AND** an operator action on the console sent that account's address a
  sign-in link for the site, naming a page of the site
- **WHEN** the customer follows the link in a browser signed in nowhere
- **THEN** the site is signed in as the customer account
- **AND** they are on that page of the site, not on the console
- **AND** the console is not signed in in that browser

#### Scenario: shared-auth-sign-in-SC-109 - Following that link leaves the sender's console session as it was
**Serves:** Link surface - the operator who sent a site link keeps their console session when it is followed

- **GIVEN** an operator signed in to the console as one account, and a site
  sign-in link their action sent to a customer account's address
- **WHEN** the operator follows that link in the same browser
- **THEN** the site is signed in as the customer account
- **AND** the console is still signed in as the operator

#### Scenario: shared-auth-sign-in-SC-110 - A console request for a site link with no console session is refused
**Serves:** Link surface - only an elevated console session may ask for a site link

- **GIVEN** a person signed in on the site whose account holds an operator
  role that holds `user:create`, and not signed in to the console
- **WHEN** a console request asks for a sign-in link for the site, to be sent
  to a customer account's address
- **THEN** the system refuses it as not signed in
- **AND** no email is sent

#### Scenario: shared-auth-sign-in-SC-111 - A console role without user:create is refused a site link
**Serves:** Link surface - a console role without the grant that makes an account may not ask for a site link

- **GIVEN** an operator signed in to the console, with the second factor proved,
  whose role does not hold `user:create`
- **WHEN** a console request asks for a sign-in link for the site, to be sent
  to a customer account's address
- **THEN** the system refuses it as not allowed
- **AND** no email is sent

#### Scenario: shared-auth-sign-in-SC-112 - A console session with an unproved second factor is refused a site link
**Serves:** Link surface - a console session that has not proven its second factor may not ask for a site link

- **GIVEN** an operator with a second factor, whose role holds `user:create`,
  signed in to the console and who has not proven the second factor on that
  console session
- **WHEN** a console request asks for a sign-in link for the site, to be sent
  to a customer account's address
- **THEN** the system refuses it and asks for the second factor
- **AND** no email is sent
