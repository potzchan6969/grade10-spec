# shared/auth/users Specification

## Purpose

How an operator on either brand lists people in the identity directory, creates
a passwordless Auth account for someone who has never signed in, bans and
unbans them, and changes their roles, and how an account holder files and
cancels their own request to be forgotten. Listing and ending their sessions is
`shared/auth/sessions`. Recording those actions is `shared/auth/audit`.
Auction bidder bans belong to auction, not here.

## Feature set

- Directory
  - Grant-gated list: only `user:list` sees accounts; search matches email or name without letter case; open by user id
  - Narrowed list: elevated or user population, a named elevated role, status, and verification combine; caller chooses order (newest first when none)
  - Banned remain: a banned account stays in the directory
- Ban and unban
  - Stops money and sign-in: a ban ends sessions and refuses new sign-ins; unban restores sign-in
  - No ban of admin: no caller bans an account that holds `admin` (peers included); self-ban stays refused
  - Closes within 70 seconds: even a cached browse read stops answering signed in, not only a mutation or an elevated call
- Role changes
  - Set-role edits: clearing operator roles leaves a user; own account included
  - Peer strip refused: an operator cannot remove `admin` from another admin
  - Self-strip: an admin may remove their own `admin` when not last
  - Reflects within 70 seconds: even a cached browse read reflects the new roles, not only an elevated call
- Account create
  - Grant-gated create: only `user:create` creates; a non-`user` role also needs `user:set-role`
  - Passwordless Auth row: name, email, and roles from the closed set; no loyalty enroll, invite mail, or password
  - Duplicate email refused: never a second Auth row for an email that already exists
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
  - Standing waits for the request: while one is open, a ban or an unban of
    that account is refused, and the request closing is what changes standing
  - Asked twice is asked once: a second filing answers the open request, a
    cancel with nothing open changes nothing, and a cancel lifts only a ban the
    filing applied

## Requirements

### Requirement: Only operators who can list users see the directory

The system SHALL let a caller list and search accounts only when they hold
`user:list`. A caller without that grant SHALL be refused and SHALL receive
no account records. Search SHALL match on email or name, case-insensitive.
An operator SHALL be able to open an account by user id. Results SHALL name
each account by user id; email is an attribute. A banned account SHALL
remain in the directory.

A caller SHALL be able to narrow the directory by role population or by a
named elevated role, by status, and by whether the email is verified, and
SHALL be able to ask for more than one at once; an account SHALL be returned
only when it satisfies every narrowing asked for. Role population is the
elevated set (any closed elevated role) or the user set (no elevated role).
A caller SHALL be able to ask for the order results come back in, by when the
account joined or by email, in either direction. Asked for no order, the
system SHALL return the newest account first.

<!-- trace:scenario id=g10.shared-users.SC-cv3 rev=1 -->
#### Scenario: shared-auth-users-SC-01 - An operator with the grant lists accounts
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** a signed-in operator who holds `user:list`
- **WHEN** they open the users directory
- **THEN** they see accounts from this brand's identity system
- **AND** each account is named by user id

<!-- trace:scenario id=g10.shared-users.SC-k1h rev=1 -->
#### Scenario: shared-auth-users-SC-02 - A caller without the grant is refused
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** a signed-in person who does not hold `user:list`
- **WHEN** they try to list accounts
- **THEN** the system refuses the request
- **AND** returns no account records

<!-- trace:scenario id=g10.shared-users.SC-0qd rev=1 -->
#### Scenario: shared-auth-users-SC-03 - Search matches email without letter case
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** an operator who can list users
- **WHEN** they search the directory by an email fragment in a different
  letter case than the account
- **THEN** the results are accounts whose email contains that fragment

<!-- trace:scenario id=g10.shared-users.SC-s50 rev=1 -->
#### Scenario: shared-auth-users-SC-04 - An account opens by user id
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** an operator who can list users
- **WHEN** they open an account by its user id
- **THEN** they receive that account
- **AND** they do not receive a different account that shares an email
  attribute

<!-- trace:scenario id=g10.shared-users.SC-pik rev=1 -->
#### Scenario: shared-auth-users-SC-05 - A banned account stays in the directory
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** a banned account
- **WHEN** an operator who can list users opens the directory
- **THEN** that account is still listed

<!-- trace:scenario id=g10.shared-users.SC-r7i rev=1 -->
#### Scenario: shared-auth-users-SC-19 - Search matches a name without letter case
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users, and an account whose name is not
  part of its email
- **WHEN** they search the directory by part of that name in a different
  letter case
- **THEN** that account is among the results

<!-- trace:scenario id=g10.shared-users.SC-1kr rev=1 -->
#### Scenario: shared-auth-users-SC-20 - The directory narrows to a role
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to accounts that hold `admin`
- **THEN** every account returned holds `admin`
- **AND** an account that holds no elevated role is not returned

<!-- trace:scenario id=g10.shared-users.SC-kly rev=1 -->
#### Scenario: shared-auth-users-SC-21 - Two narrowings apply together
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to banned accounts that hold `support`
- **THEN** every account returned is banned and holds `support`
- **AND** a banned account that does not hold `support` is not returned

<!-- trace:scenario id=g10.shared-users.SC-u7q rev=1 -->
#### Scenario: shared-auth-users-SC-22 - The caller asks for an order
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they ask for the directory ordered by when the account joined,
  oldest first
- **THEN** the accounts come back in that order
- **AND** asking for no order returns the newest account first

<!-- trace:scenario id=g10.shared-users.SC-aqk rev=1 -->
#### Scenario: shared-auth-users-SC-23 - The directory narrows to elevated accounts
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to elevated accounts
- **THEN** every account returned holds at least one elevated role
- **AND** an account that holds none is not returned

<!-- trace:scenario id=g10.shared-users.SC-a4z rev=1 -->
#### Scenario: shared-auth-users-SC-24 - The directory narrows to users without elevated roles
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to users
- **THEN** every account returned holds no elevated role
- **AND** an account that holds an elevated role is not returned

### Requirement: An operator who can ban can ban and unban

The system SHALL let a caller ban or unban an account only when they hold
`user:ban`. A ban SHALL last until an unban. After a ban, that person SHALL
NOT sign in, SHALL NOT be treated as signed in, and SHALL NOT complete a
money-moving action. That person SHALL NOT be treated as signed in on an
ordinary cached read either, not only on a mutation or an elevated call; this
SHALL hold for every read that starts 70 seconds or more after the ban. A
money-moving
action SHALL re-check identity so a ban cannot be ignored. The operator
SHALL be able to include a reason on a ban. A caller SHALL NOT ban their own
account. A caller SHALL NOT ban an account that holds `admin`, including
when the caller also holds `admin`. The last remaining `admin` SHALL NOT be
banned. A caller without the grant SHALL be refused, and the account SHALL
be unchanged. Banning an already-banned account SHALL leave it banned.

While an erasure request for that account is open, whoever filed it, a ban or
an unban SHALL be refused by name and the account SHALL be unchanged; the
request closing, cancelled or completed, is what changes standing.

<!-- trace:scenario id=g10.shared-users.SC-bc9 rev=1 -->
#### Scenario: shared-auth-users-SC-06 - A ban stops money-moving
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** an operator who holds `user:ban`
- **WHEN** they ban an account
- **THEN** that person cannot complete a money-moving action

<!-- trace:scenario id=g10.shared-users.SC-1m7 rev=1 -->
#### Scenario: shared-auth-users-SC-07 - A banned person cannot sign in
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a banned account
- **WHEN** that person completes a sign-in method
- **THEN** they are not signed in

<!-- trace:scenario id=g10.shared-users.SC-57f rev=1 -->
#### Scenario: shared-auth-users-SC-08 - A banned person is not signed in
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a person who signed in and is then banned
- **WHEN** a product reads who is calling
- **THEN** it reports no person

<!-- trace:scenario id=g10.shared-users.SC-qss rev=1 -->
#### Scenario: shared-auth-users-SC-09 - An unban lets them sign in again
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a banned account
- **WHEN** an operator who can ban unbans it
- **THEN** that person can sign in again

<!-- trace:scenario id=g10.shared-users.SC-s2t rev=1 -->
#### Scenario: shared-auth-users-SC-10 - A caller who cannot ban is refused
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a signed-in operator who does not hold `user:ban`
- **WHEN** they try to ban an account
- **THEN** the system refuses the request
- **AND** the account remains unbanned

<!-- trace:scenario id=g10.shared-users.SC-dbb rev=1 -->
#### Scenario: shared-auth-users-SC-11 - An operator cannot ban themselves
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** an operator who holds `user:ban`
- **WHEN** they try to ban their own account
- **THEN** the system refuses the request
- **AND** their account remains unbanned

<!-- trace:scenario id=g10.shared-users.SC-v7f rev=1 -->
#### Scenario: shared-auth-users-SC-12 - Support cannot ban an admin
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to ban an account that holds `admin`
- **THEN** the system refuses the request
- **AND** the account remains unbanned

<!-- trace:scenario id=g10.shared-users.SC-uoq rev=1 -->
#### Scenario: shared-auth-users-SC-13 - The last admin cannot be banned
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** the only account that holds `admin`
- **WHEN** an operator who can ban tries to ban it
- **THEN** the system refuses the request
- **AND** the account remains unbanned

<!-- trace:scenario id=g10.shared-users.SC-y5y rev=1 -->
#### Scenario: shared-auth-users-SC-25 - An admin cannot ban another admin
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** an operator who holds `admin` and `user:ban`
- **AND** another account that holds `admin`
- **WHEN** they try to ban that account
- **THEN** the system refuses the request
- **AND** the account remains unbanned

#### Scenario: shared-auth-users-SC-34 - A ban closes a cached read within 70 seconds
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a person who signed in and holds a signed cookie cache that has
  not yet expired
- **WHEN** an operator who can ban bans that account
- **THEN** an ordinary browse read that starts 70 seconds or more after the
  ban reports no person, even though the cookie cache would not have expired

#### Scenario: shared-auth-users-SC-42 - Standing does not change while an erasure request is open
**Serves:** shared-auth-users-US-02 - an operator reaching for Ban or Unban on an account whose erasure is under way

- **GIVEN** a person with an open erasure request
- **WHEN** an operator bans or unbans that account
- **THEN** the system refuses it by name
- **AND** the account's standing is unchanged
- **AND** the request is still open

### Requirement: An operator who can set roles can change them

The system SHALL let a caller change an account's roles only when they hold
`user:set-role`. The new roles SHALL be from the closed set in
`shared/auth/roles`. Clearing every operator role SHALL leave the account as
`user`. A caller MAY change their own roles the same way they change another
account's. A caller SHALL NOT remove `admin` from another account that holds
`admin`. Removing their own `admin` SHALL succeed only when at least one other
account still holds `admin`. The last remaining `admin` SHALL NOT have `admin`
removed, by self or by another caller. A caller without the grant SHALL be
refused, and the roles SHALL be unchanged. A role change SHALL be reflected
in an ordinary cached read as well as in a mutation or an elevated call, in
every read that starts 70 seconds or more after the change.

<!-- trace:scenario id=g10.shared-users.SC-cg2 rev=1 -->
#### Scenario: shared-auth-users-SC-14 - Admin changes another person's roles
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they set another account to `staff`
- **THEN** that account's roles include `staff`

<!-- trace:scenario id=g10.shared-users.SC-3pf rev=1 -->
#### Scenario: shared-auth-users-SC-15 - Clearing operator roles leaves a user
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who can set roles
- **WHEN** they save another account with no operator role selected
- **THEN** that account's roles are `user` only

<!-- trace:scenario id=g10.shared-users.SC-3br rev=1 -->
#### Scenario: shared-auth-users-SC-16 - Support cannot set roles
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who holds `user:ban` but not `user:set-role`
- **WHEN** they try to change another account's roles
- **THEN** the system refuses the request
- **AND** the roles are unchanged

<!-- trace:scenario id=g10.shared-users.SC-a8m rev=1 -->
#### Scenario: shared-auth-users-SC-17 - An operator may change their own roles
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who holds `user:set-role` and `admin`
- **WHEN** they save their own account with `staff` and still with `admin`
- **THEN** their account's roles include `staff` and `admin`

<!-- trace:scenario id=g10.shared-users.SC-xhl rev=1 -->
#### Scenario: shared-auth-users-SC-18 - The last admin keeps admin
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** the only account that holds `admin`
- **WHEN** that admin or another operator who can set roles saves it without `admin`
- **THEN** that account still holds `admin`

<!-- trace:scenario id=g10.shared-users.SC-m57 rev=1 -->
#### Scenario: shared-auth-users-SC-26 - An admin cannot remove admin from another admin
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** two or more accounts that hold `admin`
- **AND** an operator who holds `user:set-role`
- **WHEN** they save another admin without `admin`
- **THEN** the system refuses the request
- **AND** that account still holds `admin`

<!-- trace:scenario id=g10.shared-users.SC-jw6 rev=1 -->
#### Scenario: shared-auth-users-SC-27 - An admin may strip their own admin
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** two or more accounts that hold `admin`
- **AND** an operator who holds `admin` and `user:set-role`
- **WHEN** they save their own account without `admin`
- **THEN** their account no longer holds `admin`

#### Scenario: shared-auth-users-SC-35 - A role change reaches a cached read within 70 seconds
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** a signed-in account whose signed cookie cache has not yet
  expired
- **WHEN** an operator who can set roles changes that account's roles
- **THEN** an ordinary browse read that starts 70 seconds or more after the
  change reflects the new roles, even though the cookie cache would not have
  expired

### Requirement: An operator who can create may create a passwordless Auth account

An operator holding the create grant stands up an Auth account before the
person signs in.

**Who** - The system SHALL let a caller create an Auth account only when they
hold `user:create`. A caller without that grant SHALL be refused, and no
account SHALL be created.

**What** - Create SHALL accept a name, an email, and roles from the closed set
in `shared/auth/roles`. Name and email SHALL be required. Create SHALL NOT
accept a password. Create SHALL NOT enroll the account in loyalty, SHALL NOT
set opening points, and SHALL NOT send an invite or magic-link email.

**Roles** - Creating with only `user` SHALL require `user:create` alone.
Creating with any non-`user` role SHALL also require `user:set-role`; without
it the system SHALL refuse and create no account. An empty role selection
SHALL leave the account as `user` only.

**Duplicate email** - When an Auth account already holds that email, the
system SHALL refuse create and SHALL NOT create a second Auth row.

#### Scenario: shared-auth-users-SC-28 - An operator creates a passwordless Auth account
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create` and `user:set-role`
- **AND** no Auth account holds the email
- **WHEN** they create an account with a name, that email, and role `admin`
- **THEN** one Auth account exists for that email with that name and `admin`
- **AND** create collected no password
- **AND** the account is not enrolled in loyalty from create
- **AND** no invite or magic-link email is sent from create

#### Scenario: shared-auth-users-SC-29 - Create as plain user needs only user:create
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create` but not `user:set-role`
- **AND** no Auth account holds the email
- **WHEN** they create an account with a name, that email, and role `user`
- **THEN** one Auth account exists for that email with roles `user` only

#### Scenario: shared-auth-users-SC-30 - Create without user:create is refused
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:set-role` but not `user:create`
- **WHEN** they try to create an account with a name, an unused email, and role `user`
- **THEN** the system refuses the request
- **AND** no Auth account holds that email

#### Scenario: shared-auth-users-SC-31 - Elevated create without user:set-role is refused
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create` but not `user:set-role`
- **WHEN** they try to create an account with a name, an unused email, and role `admin`
- **THEN** the system refuses the request
- **AND** no Auth account holds that email

#### Scenario: shared-auth-users-SC-32 - Duplicate email is refused
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create`
- **AND** an Auth account already holds the email
- **WHEN** they try to create an account with a name, that email, and role `user`
- **THEN** the system refuses the request
- **AND** exactly one Auth account holds that email

#### Scenario: shared-auth-users-SC-33 - Empty roles at create leave a user
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create`
- **AND** no Auth account holds the email
- **WHEN** they create an account with a name, that email, and no role selected
- **THEN** one Auth account exists for that email with roles `user` only

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

#### Scenario: shared-auth-users-SC-43 - A closed request stays closed
**Serves:** Erasure requests - a console or a product sending the same cancel twice leaves the person's record as it was

- **GIVEN** a person whose erasure request is already cancelled
- **WHEN** that request is closed a second time
- **THEN** the request stays cancelled
- **AND** nothing about the person changes

#### Scenario: shared-auth-users-SC-44 - A person asks again after cancelling
**Serves:** shared-auth-users-US-06 - somebody who changed their mind once and asks to be forgotten again later

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

#### Scenario: shared-auth-users-SC-45 - The account holder files their own request
**Serves:** shared-auth-users-US-06 - somebody asking to be forgotten from their own account rather than at an operator's desk

- **GIVEN** a signed-in person with no request open
- **WHEN** they ask to be forgotten from their own data page
- **THEN** one open request stands for their own account
- **AND** they are answered with the day it was filed and the day an erasure
  may run, seven days later

#### Scenario: shared-auth-users-SC-46 - A request the person filed themselves bans nothing
**Serves:** shared-auth-users-US-06 - somebody who filed the ask and comes back to read it before the window runs out

- **GIVEN** a person whose own erasure request is open
- **WHEN** they sign in, and a product reads who is calling
- **THEN** they are signed in
- **AND** the product reports that person

#### Scenario: shared-auth-users-SC-47 - The account holder cancels inside the window
**Serves:** shared-auth-users-US-06 - somebody changing their mind before anything of theirs is erased

- **GIVEN** a person whose own request is open, on the sixth day after the day
  it was filed
- **WHEN** they cancel it
- **THEN** the request closes as cancelled
- **AND** no request is open for them

#### Scenario: shared-auth-users-SC-48 - A cancel on the day an erasure may run is refused
**Serves:** shared-auth-users-US-06 - somebody coming back to the ask on the day the days they could have taken it back in run out

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

#### Scenario: shared-auth-users-SC-49 - An operator's filing shuts the account
**Serves:** shared-auth-users-US-02 - an operator taking a person who must leave off the brand from the directory

- **GIVEN** an operator who holds `user:delete`
- **WHEN** they file another person's erasure
- **THEN** one open request stands for that person
- **AND** that person cannot sign in

#### Scenario: shared-auth-users-SC-50 - Cancelling an operator's request lets the person back in
**Serves:** shared-auth-users-US-02 - an operator undoing a filing made in error before anything is erased

- **GIVEN** a person whose account is banned by an operator's open erasure
  request, filed less than seven days ago
- **WHEN** an operator cancels that request
- **THEN** the request closes as cancelled
- **AND** that person can sign in again

#### Scenario: shared-auth-users-SC-36 - An operator filing over the person's own request takes it over
**Serves:** `shared-auth-users-US-02`, `shared-auth-users-US-06` - an operator filing for somebody who had already asked for themselves

- **GIVEN** a person whose own erasure request is open and who can still sign in
- **WHEN** an operator who holds `user:delete` files that person's erasure
- **THEN** the one open request stands as the operator's
- **AND** that person cannot sign in
- **AND** the day an erasure may run is unchanged

#### Scenario: shared-auth-users-SC-40 - The take-over leaves the person no cancel of their own
**Serves:** shared-auth-users-US-06 - somebody who asked for themselves and tries to take the ask back once the shop has taken it over

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
**Serves:** shared-auth-users-US-06 - somebody who asks again because the first ask looked as though it had not landed

- **GIVEN** a person whose own request is open
- **WHEN** they ask to be forgotten again
- **THEN** they are answered with that request and the day an erasure may run
- **AND** only that one request stands

#### Scenario: shared-auth-users-SC-38 - A cancel with nothing open changes nothing
**Serves:** shared-auth-users-US-06 - somebody cancelling from a page that was open before their request closed

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
