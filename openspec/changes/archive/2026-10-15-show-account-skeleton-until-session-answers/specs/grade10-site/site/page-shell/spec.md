# grade10-site/site/page-shell Specification

## Feature set

- Session-independent chrome
  - Account placeholder: until the session first answers, the account entry
    is a placeholder the size of the account icon, with nothing to press; a
    first read that fails shows Sign In, and a later read keeps the entry
    shown unless it finds a different session
  - Stable layout: no chrome control appears or disappears when the session
    arrives; only the account entry's own change in width moves the language
    and search controls on the wide header

## ADDED Requirements

### Requirement: The account entry holds its place until the session first answers

Until the session first answers, the header SHALL hold the account entry's
place with a placeholder, so a signed-in collector is never offered Sign In.
The account entry SHALL be in one of these states:

| State | When | Shows |
| --- | --- | --- |
| Placeholder | From the first paint until the session first answers, including in a page the site writes before anybody's session is read | A round placeholder 40 CSS pixels across, the account icon's footprint, in the account entry's place; nothing to focus or press, and nothing read aloud |
| Account icon | The latest read that did not fail returned a signed-in session | The account icon that opens the account menu |
| Sign In | The latest read that did not fail returned no session, or every read so far has failed | The primary Sign In button |

**First answer** - The session first answers when its first read since the
page loaded returns a signed-in session, returns no session, or fails. A read
that answers that the collector has no session, including a refusal saying
they are not signed in, returns no session; a read fails only when it returns
neither a session nor that answer. Every read of the session SHALL end within
two minutes of its start, so a read the network neither answers nor fails ends as
a failed read. Moving between surfaces SHALL NOT bring the
placeholder back; a reload SHALL start over at it, with no session remembered
from before.

**Both widths** - The placeholder SHALL be the same size on a wide viewport
and in the compact bar, where it SHALL sit beside Cart when the header offers
Cart.

**Once** - After the first answer the account entry SHALL NOT return to the
placeholder. While the session is read again, the header SHALL keep the entry
already shown until that read returns a session other than the one shown. A
later read that fails SHALL keep the entry already shown; a later read that
returns no session SHALL show Sign In.

<!-- trace:scenario id=g10.site-page-shell.SC-3s6 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-68 - The account entry is a placeholder until the session answers
**Serves:** grade10-site-site-page-shell-US-09 - a collector opening the site before their session has answered

- **GIVEN** a viewport at the wide breakpoint, or 375 CSS pixels wide
- **WHEN** a collector opens any surface the shell wraps and the session has
  not yet answered
- **THEN** the account entry's place in the header bar holds a round
  placeholder 40 CSS pixels across, beside Cart in the compact bar when the
  header offers Cart
- **AND** neither Sign In nor the account icon appears

<!-- trace:scenario id=g10.site-page-shell.SC-gua rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-75 - The placeholder cannot be focused or pressed
**Serves:** grade10-site-site-page-shell-US-09 - a collector who reaches the placeholder by pointer or keyboard

- **GIVEN** a header showing the placeholder
- **WHEN** the collector clicks it, or moves focus through the header with the
  keyboard
- **THEN** nothing opens and the address does not change
- **AND** focus never lands on the placeholder

<!-- trace:scenario id=g10.site-page-shell.SC-0lr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-76 - Assistive technology reads nothing for the placeholder
**Serves:** grade10-site-site-page-shell-US-09 - a collector using a screen reader before their session has answered

- **GIVEN** a header showing the placeholder
- **WHEN** assistive technology reads the header
- **THEN** it reads nothing for the placeholder, and announces no loading

<!-- trace:scenario id=g10.site-page-shell.SC-tah rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-69 - A page written before any session is read shows the placeholder
**Serves:** grade10-site-site-page-shell-US-09 - a collector whose browser shows the written page before the site's scripts run

- **GIVEN** a page the site writes before anybody's session is read
- **WHEN** a browser shows that page before the site's scripts have taken it
  over
- **THEN** the account entry is the placeholder
- **AND** Sign In does not appear

<!-- trace:scenario id=g10.site-page-shell.SC-i26 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-77 - The placeholder stays when the scripts take a written page over
**Serves:** grade10-site-site-page-shell-US-09 - a collector whose browser shows the written page before the site's scripts run

- **GIVEN** a written page showing the placeholder
- **WHEN** the site's scripts take the page over before the session answers
- **THEN** the placeholder stays in the account entry's place
- **AND** Sign In does not appear before the session answers

<!-- trace:scenario id=g10.site-page-shell.SC-31a rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-70 - A signed-in collector goes straight to the account icon
**Serves:** grade10-site-site-page-shell-US-09 - a returning collector who is already signed in

- **GIVEN** a collector who is signed in
- **WHEN** they open the site and their session answers
- **THEN** the account icon takes the placeholder's place
- **AND** Sign In does not appear at any point from the first paint to the
  account icon

<!-- trace:scenario id=g10.site-page-shell.SC-qnl rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-71 - A failed session read shows Sign In
**Serves:** grade10-site-site-page-shell-US-09 - a visitor whose session cannot be read

- **GIVEN** a header showing the placeholder
- **WHEN** the session's first read fails
- **THEN** Sign In takes the placeholder's place
- **AND** activating Sign In leads to sign-in

<!-- trace:scenario id=g10.site-page-shell.SC-gmi rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-72 - A re-read keeps the entry already shown
**Serves:** grade10-site-site-page-shell-US-09 - a collector coming back to the tab after the session has answered

- **GIVEN** a header showing Sign In, or the account icon, after the session
  first answered
- **WHEN** the collector moves to another surface, or the session is read
  again, as when they come back to the tab
- **THEN** the header keeps showing that entry while the read is under way
- **AND** the placeholder does not return
- **AND** the entry changes only when that read returns a session other than
  the one shown

<!-- trace:scenario id=g10.site-page-shell.SC-uqh rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-73 - A slow session read keeps the placeholder
**Serves:** grade10-site-site-page-shell-US-09 - a signed-in collector on a slow connection

- **GIVEN** a signed-in collector whose header shows the placeholder
- **WHEN** a minute passes and the session read has neither answered nor
  failed
- **THEN** the header still shows the placeholder, and Sign In has not
  appeared
- **AND** moving to another surface while the read is under way keeps the
  placeholder
- **AND** when the read then answers, the account icon takes the
  placeholder's place

<!-- trace:scenario id=g10.site-page-shell.SC-ra1 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-74 - A later read that fails keeps the entry already shown
**Serves:** grade10-site-site-page-shell-US-09 - a signed-in collector whose connection drops after the session has answered

- **GIVEN** a header showing the account icon after the session first answered
- **WHEN** a later read of the session fails without returning a session
- **THEN** the account icon stays, and neither Sign In nor the placeholder
  appears
- **AND** when a later read returns no session, as after signing out
  elsewhere, Sign In takes the account icon's place

<!-- trace:scenario id=g10.site-page-shell.SC-nuz rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-78 - Signing in or out after the first answer does not bring the placeholder back
**Serves:** grade10-site-site-page-shell-US-09 - a collector who signs in or out after the session has answered

- **GIVEN** a header showing Sign In, or the account icon, after the session
  first answered
- **WHEN** the collector signs in from Sign In, or signs out from the account
  menu, on that page
- **THEN** the account entry changes straight to the account icon, or to Sign
  In
- **AND** the placeholder does not show at any point

## MODIFIED Requirements

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. The account entry's presentation and destination SHALL depend on the
session: before it first answers the account entry is the placeholder; signed
out shows a primary Sign In button; signed in shows the account icon that opens
the account menu. Whose cart the Cart control opens and counts SHALL depend on
the session too, and nothing else in the chrome SHALL.

When the session arrives, no other chrome control SHALL appear or disappear.
The only controls that SHALL move are those to the account entry's left - the
language control, and search where the site answers it, on the wide header -
and only by the account entry's own change in width. The Cart control SHALL
NOT move. The cart count badge SHALL NOT change the presence or position of
the Cart control.

<!-- trace:scenario id=g10.site-page-shell.SC-9ud rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-04 - A first paint while the session resolves
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

<!-- trace:scenario id=g10.site-page-shell.SC-yxt rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-05 - No layout shift when the session arrives
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** the account entry matches the session (Sign In when signed out,
  account icon when signed in), in the placeholder's place
- **AND** no other chrome control appears or disappears
- **AND** the Cart control stays where it was
- **AND** on a wide viewport the language control, and search where the site
  answers it, move left by the account entry's change in width: not at all
  for the account icon, and by Sign In's width less 40 CSS pixels for Sign In
- **AND** every other control, the primary navigation and the compact bar's
  controls included, stays where it was
- **AND** a cart count badge that later appears for a signed-in member leaves
  the Cart control where it was
