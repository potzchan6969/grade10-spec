# shared/auth/users Specification

## Purpose

How an operator on either brand lists people in the identity directory, bans
and unbans them, and changes their roles, and how an account holder files and
cancels their own request to be forgotten. Listing and ending their sessions
is `shared/auth/sessions`. Recording those actions is `shared/auth/audit`.
Auction bidder bans belong to auction, not here.

## Feature set

- Directory
  - Grant-gated list: only `user:list` sees accounts; search matches email or name without letter case; open by user id
  - Narrowed list: elevated or user population, a named elevated role, status, and verification combine; caller chooses order (newest first when none)
  - Banned remain: a banned account stays in the directory
- Ban and unban
  - Stops money and sign-in: a ban ends sessions and refuses new ones; unban restores sign-in
  - No ban of admin: no caller bans an account that holds `admin` (peers included); self-ban stays refused
- Role changes
  - Set-role edits: clearing operator roles leaves a user; own account included
  - Peer strip refused: an operator cannot remove `admin` from another admin
  - Self-strip: an admin may remove their own `admin` when not last
- Erasure requests
  - One open request: a person holds one at a time, and it closes once
  - Filed by the account holder: from a product's own data page, and cancelled
    there until the day an erasure may run opens
  - A self-filed request bans nothing: the person can still sign in, because
    cancelling is what they would sign in for
  - An operator's filing bans: filed from the directory, and a filing over a
    self-filed request becomes the operator's with the ban applied; from then
    on only the run or an operator's cancel ends it
  - No filing over an admin: no caller files the erasure of an account that
    holds `admin`, as no caller bans one
  - Asked twice is asked once: a second filing answers the open request, a
    cancel with nothing open changes nothing, and a cancel lifts only a ban the
    filing applied

## ADDED Requirements

### Requirement: A person holds one open erasure request at a time

An erasure request is the record that somebody asked to be forgotten.

**One open** - the system SHALL hold at most one open erasure request for a
person, whoever filed it.

**What it records** - a request SHALL record the person it is for, whether the
account holder or an operator filed it, the day it was filed, and the day an
erasure may run.

**The day an erasure may run** - SHALL be seven days after the day the request
was filed.

**Closed once** - an open request SHALL close exactly once, as cancelled or as
completed. A closed request SHALL NOT be reopened, closed a second time, or
removed.

**Asking again** - with no request open, a person MAY have a new one filed, and
it SHALL carry its own day an erasure may run.

| State | What it means | What it allows |
| --- | --- | --- |
| Open | filed, and not yet closed | cancelling inside the window; completing once the window has passed |
| Cancelled | closed before any product erased anything | nothing; a new request may be filed |
| Completed | closed after every product erased what it held | nothing; a new request may be filed |

#### Scenario: shared-auth-users-SC-28 - A closed request stays closed
**Serves:** Erasure requests - a console or a product sending the same cancel twice leaves the person's record as it was

- **GIVEN** a person whose erasure request is already cancelled
- **WHEN** that request is closed a second time
- **THEN** the system refuses the second close
- **AND** the request stays cancelled

#### Scenario: shared-auth-users-SC-29 - A person asks again after cancelling
**Serves:** shared-auth-users-US-05 - somebody who changed their mind once and asks to be forgotten again later

- **GIVEN** a person whose earlier request was cancelled
- **WHEN** they ask to be forgotten again
- **THEN** one open request stands for them
- **AND** the day an erasure may run is seven days after the day this request
  was filed

### Requirement: The account holder files their own erasure request and cancels it inside the window

A person asks to be forgotten from their own account, without an operator
filing it for them.

**Filing** - the person signs in and asks to be forgotten from a product's own
data page. The request SHALL be filed for the account that asked and for no
other.

**The answer** - the request is filed, and the system SHALL answer with the day
it was filed and the day an erasure may run.

**No ban** - a request the account holder filed SHALL apply no ban. That person
SHALL still sign in, SHALL still be treated as signed in, and SHALL keep the
sessions they hold, so that they can reach the page they would cancel from.

**Cancelling inside the window** - inside the window the person SHALL be able to
cancel their own request. The cancel SHALL close it as cancelled and SHALL leave
them free to ask again.

**After the window** - a cancel SHALL be refused from the first instant of the
day an erasure may run, read on the brand's own zone, which
`shared/dates-and-times` states, and the request stands until every product has
erased what it holds.

#### Scenario: shared-auth-users-SC-30 - The account holder files their own request
**Serves:** shared-auth-users-US-05 - somebody asking to be forgotten from their own account rather than at an operator's desk

- **GIVEN** a signed-in person with no request open
- **WHEN** they ask to be forgotten from their own data page
- **THEN** one open request stands for their own account
- **AND** they are answered with the day it was filed and the day an erasure
  may run, seven days later

#### Scenario: shared-auth-users-SC-31 - A request the person filed themselves bans nothing
**Serves:** shared-auth-users-US-05 - somebody who filed the ask and comes back to read it before the window runs out

- **GIVEN** a person whose own erasure request is open
- **WHEN** they sign in, and a product reads who is calling
- **THEN** they are signed in
- **AND** the product reports that person

#### Scenario: shared-auth-users-SC-32 - The account holder cancels inside the window
**Serves:** shared-auth-users-US-05 - somebody changing their mind before anything of theirs is erased

- **GIVEN** a person whose own request is open, on the sixth day after the day
  it was filed
- **WHEN** they cancel it
- **THEN** the request closes as cancelled
- **AND** no request is open for them

#### Scenario: shared-auth-users-SC-33 - A cancel on the day an erasure may run is refused
**Serves:** shared-auth-users-US-05 - somebody coming back to the ask on the day the days they could have taken it back in run out

- **GIVEN** a person whose own request was filed seven days ago, so that today
  is the day an erasure may run
- **WHEN** they try to cancel it
- **THEN** the system refuses the cancel
- **AND** the request is still open

### Requirement: An operator's erasure request bans the account

An operator files a person's erasure from the users directory, and that filing
is also a ban.

**Who may file for somebody else** - a caller SHALL file another person's
erasure only when they hold `user:delete`. A caller without that grant SHALL be
refused, and no request SHALL be filed.

**The ban** - while a request an operator filed stands open, that person SHALL
NOT sign in and SHALL NOT be treated as signed in.

**Cancelling** - cancelling an operator's request inside the window SHALL close
it as cancelled and SHALL lift the ban that filing applied.

**Over a request the person filed** - an operator filing where the account
holder's own request is already open SHALL make that one request the
operator's and SHALL apply the ban. No second request SHALL open, and the day
an erasure may run SHALL stay the day the account holder's filing set.

**No filing over an admin** - a caller SHALL NOT file the erasure of an account
that holds `admin`, peers included, as no caller bans one. The filing SHALL be
refused and no request SHALL open.

**A taken-over request is the shop's** - once an operator's filing has taken a
request over, a cancel sent through the account holder's own request SHALL be
refused, and the request SHALL stay open as the operator's. A taken-over request
SHALL end only by running or by an operator's cancel.

#### Scenario: shared-auth-users-SC-34 - An operator's filing shuts the account
**Serves:** shared-auth-users-US-02 - an operator taking a person who must leave off the brand from the directory

- **GIVEN** an operator who holds `user:delete`
- **WHEN** they file another person's erasure
- **THEN** one open request stands for that person
- **AND** that person cannot sign in

#### Scenario: shared-auth-users-SC-35 - Cancelling an operator's request lets the person back in
**Serves:** shared-auth-users-US-02 - an operator undoing a filing made in error before anything is erased

- **GIVEN** a person whose account is banned by an operator's open erasure
  request, filed less than seven days ago
- **WHEN** an operator cancels that request
- **THEN** the request closes as cancelled
- **AND** that person can sign in again

#### Scenario: shared-auth-users-SC-36 - An operator filing over the person's own request takes it over
**Serves:** `shared-auth-users-US-02`, `shared-auth-users-US-05` - an operator filing for somebody who had already asked for themselves

- **GIVEN** a person whose own erasure request is open and who can still sign in
- **WHEN** an operator who holds `user:delete` files that person's erasure
- **THEN** the one open request stands as the operator's
- **AND** that person cannot sign in
- **AND** the day an erasure may run is unchanged

#### Scenario: shared-auth-users-SC-40 - The take-over leaves the person no cancel of their own
**Serves:** shared-auth-users-US-05 - somebody who asked for themselves and tries to take the ask back once the shop has taken it over

- **GIVEN** a person whose own request an operator's filing took over
- **WHEN** they, or anything acting as them, ask to cancel it through their own
  request
- **THEN** the system refuses the cancel
- **AND** the request stays open as the one the shop filed

#### Scenario: shared-auth-users-SC-41 - An erasure over an admin is refused
**Serves:** shared-auth-users-US-02 - an operator reaching for the erasure of an account that no ban may touch

- **GIVEN** an operator who holds `user:delete`
- **AND** an account that holds `admin`
- **WHEN** they file that account's erasure
- **THEN** the system refuses the filing
- **AND** no request is open for that person
- **AND** that person can still sign in

### Requirement: A filing or a cancel sent again answers the request already there

Asking twice is asking once: both acts answer from the request the person
holds.

**Asked twice** - a filing while a request is open SHALL answer with that
request and the day an erasure may run, and SHALL NOT open a second one.

**Cancelled with nothing open** - a cancel where no request is open SHALL
change nothing: no request SHALL open or close, and no account SHALL be
unbanned.

**Only the ban the filing applied** - a cancel SHALL lift a ban only where the
erasure filing applied it. An account banned before the request was filed SHALL
stay banned when the request is cancelled.

#### Scenario: shared-auth-users-SC-37 - A second ask answers the open request
**Serves:** shared-auth-users-US-05 - somebody who asks again because the first ask looked as though it had not landed

- **GIVEN** a person whose own request is open
- **WHEN** they ask to be forgotten again
- **THEN** they are answered with that request and the day an erasure may run
- **AND** only that one request stands

#### Scenario: shared-auth-users-SC-38 - A cancel with nothing open changes nothing
**Serves:** shared-auth-users-US-05 - somebody cancelling from a page that was open before their request closed

- **GIVEN** a person with no open erasure request
- **WHEN** a cancel is sent for them
- **THEN** no request opens or closes
- **AND** the account is unchanged

#### Scenario: shared-auth-users-SC-39 - A cancel leaves a ban the filing did not apply
**Serves:** shared-auth-users-US-02 - an operator who banned somebody for conduct and later files and takes back their erasure

- **GIVEN** an account already banned by an operator
- **AND** an operator's erasure request open over it
- **WHEN** that request is cancelled
- **THEN** the account is still banned
- **AND** that person cannot sign in
