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
- Account identity
  - One person per address: first visit creates the account; later visits are the same person
- Rate limits and redirects
  - One email a minute: a second send in a minute is told to wait
  - Trusted return: an untrusted redirect is ignored
- Surface wording
  - Sign in with email: the email-step action and dialog copy never say magic link to the collector

## ADDED Requirements

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

#### Scenario: shared-auth-sign-in-SC-70 - The wait ends when the address follows the link elsewhere
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address follows the link and signs in on another device
- **THEN** the waiting surface stops waiting
- **AND** it shows a message that sign-in completed on another device

#### Scenario: shared-auth-sign-in-SC-71 - The wait ends when the address signs in by another method elsewhere
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address completes Google sign-in on another device instead
  of following the link
- **THEN** the waiting surface stops waiting
- **AND** it shows the same settled-elsewhere message

#### Scenario: shared-auth-sign-in-SC-72 - The surface that stops waiting gains no session of its own
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface that stopped waiting because its address settled
  elsewhere
- **WHEN** the settled-elsewhere message is showing
- **THEN** that surface is not signed in
- **AND** no session was created for it

#### Scenario: shared-auth-sign-in-SC-73 - A different address settling elsewhere leaves the wait running
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** a different address completes sign-in on another device
- **THEN** the waiting surface keeps waiting
- **AND** its resend countdown is unaffected

#### Scenario: shared-auth-sign-in-SC-74 - A failed attempt elsewhere leaves the wait running
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email after asking for a sign-in
  link at an address
- **WHEN** that address's link is followed elsewhere and creates no session
  — expired, already used, or the account is banned
- **THEN** the waiting surface keeps waiting
- **AND** it shows no settled-elsewhere message

#### Scenario: shared-auth-sign-in-SC-75 - Every surface waiting on the address ends its wait
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** two surfaces each showing Check Your Email after asking for a
  sign-in link at the same address
- **WHEN** that address completes sign-in on another device
- **THEN** both surfaces stop waiting and show the settled-elsewhere message

#### Scenario: shared-auth-sign-in-SC-76 - A backgrounded waiting surface still learns once foregrounded
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email, backgrounded before its
  address settles elsewhere
- **WHEN** that surface is foregrounded again after the address has settled
- **THEN** it shows the settled-elsewhere message without a reload

#### Scenario: shared-auth-sign-in-SC-77 - The settle is independent of the resend countdown
**Serves:** shared-auth-sign-in-US-10 - Collector sees the wait end when they sign in from another device

- **GIVEN** a surface showing Check Your Email, whether Resend is still
  counting down or already enabled
- **WHEN** that address completes sign-in on another device
- **THEN** the waiting surface stops waiting the same way regardless of the
  countdown's state

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

#### Scenario: shared-auth-sign-in-SC-79 - A bare address does not disclose a session elsewhere
**Serves:** Emailed link - naming an address alone does not disclose whether it holds a session

- **GIVEN** an email address that currently holds a session
- **WHEN** that address is checked without the secret of a flow that
  requested a sign-in link for it
- **THEN** the check does not reveal that the address holds a session
