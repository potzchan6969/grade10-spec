# shared/auth/test-sign-in Specification

## Purpose

How the staging Actions job walks sign-in without the disposable `/dev` door:
which run may call, which addresses it may act on, what it may do to them, and
where the door stays closed. Collectors still walk `shared/auth/sign-in`.
Operators still walk ban and role on `shared/auth/users`.

## Feature set

- Who may call
  - The door's own workflow: a run that proves it is this repository's Actions, running that one workflow from the main branch, on a dispatch a reviewer approved; every other caller is refused
- Testers
  - The tester domain: any address under the one domain Ops names, minted per run; an address outside it is refused, and an account is created when a move needs one
- What the job may do
  - Capture the link: the last sign-in mail for a tester address, without a mailbox
  - Age the unused link: so an expired follow can be walked without waiting five minutes
  - Ban the address: so a banned follow can be walked without the Users desk
  - Prepare the address: so it holds `admin` before the link is followed
  - Clear the sign-in limits: the wait between two mails and the count a caller may ask for, so a suite is not throttled as an attacker would be
- Closed
  - Everywhere else: preview, production, and `/dev` on staging stay closed; the job does not mint a session without following the mail, does not unban, and does not seed store or auction data

## ADDED Requirements

### Requirement: Only the door's own workflow may call

Which run the door acts for, and what a refused call leaves behind.

- **The one caller** — the door SHALL act only for a call that proves it is
  this repository's Actions, running the door's own workflow, from the main
  branch, on a dispatch a reviewer approved; proving the repository alone is
  not enough, because every job in it proves the same thing
- **Another workflow** — a call from any other workflow in this repository
  SHALL be refused
- **Another branch** — a call from a run on any branch other than main, a run
  a pull request started included, SHALL be refused
- **An unapproved dispatch** — a call from a run whose dispatch no reviewer
  approved SHALL be refused
- **Anyone else** — a call from a laptop, a fork, or another repository SHALL
  be refused
- **A refused call** — a call the door refuses SHALL change nothing: no
  account, no role, no ban, no link, no limit

<!-- trace:scenario id=g10.shared-test-sign-in.SC-xog rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-01 - The door acts for its own workflow
**Serves:** Who may call - the run that may reach the door

- **GIVEN** a staging run of the door's own workflow, from the main branch, on
  a dispatch a reviewer approved
- **WHEN** it calls a move on a tester address
- **THEN** the door carries out that move

<!-- trace:scenario id=g10.shared-test-sign-in.SC-gpm rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-02 - Another workflow in this repository is refused
**Serves:** Who may call - proving the repository is not enough

- **GIVEN** a run of a different workflow in this repository's Actions
- **WHEN** it calls the door
- **THEN** the door refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-sy2 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-03 - A run a pull request started is refused
**Serves:** Who may call - proving the repository is not enough

- **GIVEN** a run of the door's own workflow that a pull request started, on
  that pull request's branch
- **WHEN** it calls the door
- **THEN** the door refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-57d rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-32 - The door's own workflow off the main branch is refused
**Serves:** Who may call - the run that may reach the door

- **GIVEN** a run of the door's own workflow, on a dispatch a reviewer
  approved, from a branch other than main
- **WHEN** it calls the door
- **THEN** the door refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-6c0 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-04 - A dispatch no reviewer approved is refused
**Serves:** Who may call - the run that may reach the door

- **GIVEN** a run of the door's own workflow, from the main branch, on a
  dispatch no reviewer approved
- **WHEN** it calls the door
- **THEN** the door refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-93o rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-05 - A caller that is not this repository's Actions is refused
**Serves:** Who may call - every other caller is refused

- **GIVEN** a caller from a laptop, a fork, or another repository
- **WHEN** it calls the door
- **THEN** the door refuses the call
- **AND** nothing is changed

### Requirement: Every move names an address under the tester domain

Which addresses the door acts on, and what it creates to act on one.

- **The address** — every move SHALL name an address, and the door SHALL carry
  it out only when that address is under the one tester domain Ops names
- **Under the domain** — an address is under the domain when the part after
  its last `@` is that domain and nothing more, read without regard to case; a
  subdomain of it SHALL NOT count as under it
- **A plus tag** — two addresses that differ only by a plus tag SHALL be two
  addresses, each acted on and each holding its own last mail
- **Minted per run** — an address under that domain SHALL be acted on whether
  or not it has been seen before; the door SHALL hold no list of addresses
- **Outside the domain** — a move naming an address outside that domain SHALL
  be refused, and that address SHALL be unchanged
- **No address** — a move naming no address SHALL be refused; the door SHALL
  NOT read a missing address as a default one
- **An account the move needs** — WHEN a move needs an account for a tester
  address that has never signed in, the door SHALL create the account, then
  put it in the state the move names
- **The send** — the door SHALL NOT skip or replace a sign-in send to a tester
  address; the mail goes the ordinary way. Whether a catch-all inbox takes it
  is Ops, not this door

<!-- trace:scenario id=g10.shared-test-sign-in.SC-4tc rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-06 - An address a run minted is acted on
**Serves:** Testers - any address under the tester domain

- **GIVEN** an address under the tester domain that the run minted for itself
- **WHEN** the door's own workflow calls a move on it
- **THEN** the door carries out that move
- **AND** it does not require that address to have been named before

<!-- trace:scenario id=g10.shared-test-sign-in.SC-n68 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-07 - An address outside the tester domain is refused
**Serves:** Testers - an address outside the domain is refused

- **GIVEN** an address that is not under the tester domain
- **WHEN** the door's own workflow calls a move on it
- **THEN** the door refuses the call
- **AND** that address is unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-y6k rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-30 - An address under a subdomain of the tester domain is refused
**Serves:** Testers - an address outside the domain is refused

- **GIVEN** an address whose domain is a subdomain of the tester domain
- **WHEN** the door's own workflow calls a move on it
- **THEN** the door refuses the call
- **AND** that address is unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-wse rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-31 - Two addresses differing only by a plus tag are two subjects
**Serves:** Testers - any address under the tester domain

- **GIVEN** two tester addresses that differ only by a plus tag, each of which
  asked for a sign-in link
- **WHEN** the door's own workflow captures the first one's last sign-in mail
- **THEN** it receives that address's link, not the other's

<!-- trace:scenario id=g10.shared-test-sign-in.SC-u90 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-34 - An address whose domain is in mixed case is acted on
**Serves:** Testers - any address under the tester domain

- **GIVEN** an address under the tester domain, written with its domain in
  mixed case
- **WHEN** the door's own workflow calls a move on it
- **THEN** the door carries out that move

<!-- trace:scenario id=g10.shared-test-sign-in.SC-o4r rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-08 - A move naming no address is refused
**Serves:** Testers - every move names an address

- **WHEN** the door's own workflow calls a move that names no address
- **THEN** the door refuses the call
- **AND** it acts on no address

<!-- trace:scenario id=g10.shared-test-sign-in.SC-q44 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-09 - A ban creates the account of an address that never signed in
**Serves:** Testers - an account is created when a move needs one

- **GIVEN** an address under the tester domain that has never signed in
- **WHEN** the door's own workflow bans it
- **THEN** an account exists for that address
- **AND** that account is banned

<!-- trace:scenario id=g10.shared-test-sign-in.SC-1xt rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-10 - A prepare creates the account of an address that never signed in
**Serves:** Testers - an account is created when a move needs one

- **GIVEN** an address under the tester domain that has never signed in
- **WHEN** the door's own workflow prepares it
- **THEN** an account exists for that address
- **AND** that account holds `admin`

<!-- trace:scenario id=g10.shared-test-sign-in.SC-bap rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-11 - A sign-in mail to a tester address is sent the ordinary way
**Serves:** Testers - any address under the tester domain

- **GIVEN** an address under the tester domain
- **WHEN** that address asks for a sign-in link
- **THEN** the mail is sent the ordinary way
- **AND** the door neither skips nor replaces that send

### Requirement: Capture returns the last sign-in mail for the address named

What the door hands back in place of a mailbox.

- **What comes back** — the door SHALL return the sign-in link from the last
  sign-in mail sent to the named tester address, with no mailbox opened
- **That address only** — the door SHALL return the named address's last mail,
  never a later send to another address
- **No send** — WHEN no sign-in mail has been sent to that address, the door
  SHALL return no link; it SHALL NOT refuse the call and SHALL NOT invent one
- **A used mail** — the last mail is the last send, a used one included, and a
  second capture SHALL return that same link until another mail is sent to
  that address
- **How long it stays readable** — a sent mail SHALL stay capturable for
  fifteen minutes, so it outlives the five-minute link; after that a capture
  returns no link, as for an address with no send
- **The link itself** — capture SHALL NOT change the link: its five-minute
  lifetime and its one-time use stay as `shared/auth/sign-in` sets them

<!-- trace:scenario id=g10.shared-test-sign-in.SC-w6r rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-12 - Capture returns the last link for the address
**Serves:** What the job may do - capture the link without a mailbox

- **GIVEN** a tester address that asked for a sign-in link
- **WHEN** the door's own workflow captures that address's last sign-in mail
- **THEN** it receives the sign-in link that mail carries
- **AND** no mailbox is opened
- **AND** following that link signs in on the terms `shared/auth/sign-in` sets

<!-- trace:scenario id=g10.shared-test-sign-in.SC-a82 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-13 - Capture of an address with no send returns no link
**Serves:** What the job may do - capture the link without a mailbox

- **GIVEN** a tester address no sign-in mail has been sent to
- **WHEN** the door's own workflow captures that address's last sign-in mail
- **THEN** the call is not refused
- **AND** no link comes back

<!-- trace:scenario id=g10.shared-test-sign-in.SC-tjs rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-14 - Capture ignores a later send to another address
**Serves:** What the job may do - capture the link without a mailbox

- **GIVEN** two tester addresses, each of which asked for a sign-in link
- **AND** the later mail went to the second address
- **WHEN** the door's own workflow captures the first address's last sign-in
  mail
- **THEN** it receives the first address's link, not the second's

<!-- trace:scenario id=g10.shared-test-sign-in.SC-i3g rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-15 - A second capture returns the same link
**Serves:** What the job may do - capture the link without a mailbox

- **GIVEN** a tester address whose last sign-in link has already been captured
  and followed
- **AND** no later sign-in mail has gone to that address, and the mail was
  sent less than fifteen minutes ago
- **WHEN** the door's own workflow captures that address's last sign-in mail
  again
- **THEN** it receives that same link

<!-- trace:scenario id=g10.shared-test-sign-in.SC-fdk rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-29 - A mail older than fifteen minutes is no longer capturable
**Serves:** What the job may do - capture the link without a mailbox

- **GIVEN** a tester address whose last sign-in mail was sent more than
  fifteen minutes ago
- **WHEN** the door's own workflow captures that address's last sign-in mail
- **THEN** the call is not refused
- **AND** no link comes back

### Requirement: Age ends an unused link's life early

How the job walks an expired follow without the wall clock.

- **An unused link** — WHEN the named tester address holds an unused sign-in
  link, the door SHALL age it past the five-minute lifetime
  `shared/auth/sign-in` sets, so following it creates no session
- **At once** — the aged link SHALL be past its life the moment the move
  settles; the caller SHALL NOT wait out the five minutes
- **A used link** — a link that has already created a session SHALL be
  unchanged
- **No link** — WHEN the address holds no unused link, the door SHALL age none
  and SHALL change nothing
- **The account** — aging SHALL NOT change the account and SHALL NOT create a
  session

<!-- trace:scenario id=g10.shared-test-sign-in.SC-xo7 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-16 - An aged link no longer signs in
**Serves:** What the job may do - age the unused link so an expired follow can be walked

- **GIVEN** a tester address holding an unused sign-in link sent seconds ago
- **WHEN** the door's own workflow ages that link
- **AND** anyone follows it
- **THEN** no session is created
- **AND** the caller waited out no part of the five minutes
- **AND** the account for that address is unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-xe4 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-17 - A used link is unchanged by aging
**Serves:** What the job may do - age the unused link so an expired follow can be walked

- **GIVEN** a tester address whose last sign-in link has already created a
  session
- **WHEN** the door's own workflow ages that address's link
- **THEN** that link is unchanged
- **AND** the session it created stands

<!-- trace:scenario id=g10.shared-test-sign-in.SC-bj0 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-18 - An address with no unused link ages none
**Serves:** What the job may do - age the unused link so an expired follow can be walked

- **GIVEN** a tester address holding no unused sign-in link
- **WHEN** the door's own workflow ages that address's link
- **THEN** no link is aged
- **AND** nothing is changed

### Requirement: Ban puts a tester address in the banned state

How the job walks a banned follow without the Users desk.

- **The state** — the door SHALL put the account for the named tester address
  in the banned state `shared/auth/users` defines, so a follow of that
  address's sign-in link is refused the way a banned follow is
- **No desk** — the ban SHALL need no operator, no session, and no grant on
  the Users desk

<!-- trace:scenario id=g10.shared-test-sign-in.SC-21a rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-19 - A banned tester address cannot sign in
**Serves:** What the job may do - ban the address so a banned follow can be walked

- **GIVEN** a tester address the door's own workflow banned, with no operator
  and no grant on the Users desk
- **WHEN** that address's sign-in link is followed
- **THEN** no session is created
- **AND** the follow is refused the way a banned follow is

### Requirement: Prepare puts `admin` on a tester address

How a console case reaches a signed-in admin.

- **The role** — the door SHALL put `admin` on the account for the named
  tester address, on the terms `shared/auth/roles` sets for holding it
- **Before the follow** — the role SHALL be on the account before the sign-in
  link is followed, so the session that follow creates holds it
- **No session** — prepare SHALL NOT sign that address in

<!-- trace:scenario id=g10.shared-test-sign-in.SC-tfs rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-20 - A prepared address signs in as an admin
**Serves:** What the job may do - prepare the address so it holds `admin`

- **GIVEN** a tester address the door's own workflow prepared
- **AND** that account holds `admin` and is not signed in
- **WHEN** that address's sign-in link is followed
- **THEN** the session holds `admin`

### Requirement: Clearing the sign-in limits frees a tester from the throttle

How a suite asks for mail after mail without being held as an attacker.

- **What clears** — the door SHALL clear, for the named tester address and for
  the caller, the wait between two sign-in mails and the cap on how many a
  caller may ask for that `shared/auth/sign-in` sets, so the next ask sends a
  mail at once
- **Everyone else** — the limits themselves SHALL stand: another address's
  wait and another caller's cap SHALL be unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-cy4 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-21 - A cleared address is sent a second mail at once
**Serves:** What the job may do - clear the sign-in limits so a suite is not throttled

- **GIVEN** a tester address sent a sign-in mail seconds ago
- **WHEN** the door's own workflow clears the sign-in limits for that address
  and for itself
- **AND** that address asks for another sign-in link
- **THEN** a second mail is sent
- **AND** the caller waited out no part of the wait between two mails

<!-- trace:scenario id=g10.shared-test-sign-in.SC-to0 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-33 - A cleared caller may ask past the count
**Serves:** What the job may do - clear the sign-in limits so a suite is not throttled

- **GIVEN** a caller that has asked for as many sign-in mails as the cap
  `shared/auth/sign-in` sets allows, naming a tester address
- **WHEN** the door's own workflow clears the sign-in limits for that address
  and for itself
- **AND** it asks for another sign-in link for that address
- **THEN** that mail is sent

<!-- trace:scenario id=g10.shared-test-sign-in.SC-dcz rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-22 - Clearing leaves another address's wait standing
**Serves:** What the job may do - clear the sign-in limits so a suite is not throttled

- **GIVEN** two tester addresses, each sent a sign-in mail seconds ago
- **WHEN** the door's own workflow clears the sign-in limits for the first
  address
- **AND** the second address asks for another sign-in link
- **THEN** no second mail is sent to the second address
- **AND** it is told to wait

### Requirement: The door is open on staging only

Where the door answers, and which door stays shut beside it.

- **Staging** — the door SHALL answer on staging and nowhere else
- **Preview and production** — a call to the door on preview or on production
  SHALL be refused and SHALL change nothing; preview runs the production
  backends
- **The disposable door** — the disposable `/dev` door SHALL stay closed on
  staging: a call to it SHALL be refused

<!-- trace:scenario id=g10.shared-test-sign-in.SC-tx7 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-23 - The door on preview is refused
**Serves:** Closed - preview stays closed

- **GIVEN** the door's own workflow, from the main branch, on a dispatch a
  reviewer approved
- **WHEN** it calls a move against preview
- **THEN** the call is refused
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-56z rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-24 - The door on production is refused
**Serves:** Closed - production stays closed

- **GIVEN** the door's own workflow, from the main branch, on a dispatch a
  reviewer approved
- **WHEN** it calls a move against production
- **THEN** the call is refused
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-u3l rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-25 - The disposable door on staging is refused
**Serves:** Closed - `/dev` on staging stays closed

- **WHEN** anyone calls the disposable `/dev` door on staging
- **THEN** the call is refused
- **AND** no session is created

### Requirement: The door makes no move beyond those five

What the door will not do for the caller it accepts.

- **The set** — capture, age, ban, prepare, and clear are the whole set, and
  the door SHALL refuse any other move
- **No session** — the door SHALL NOT create a session, or anything that
  stands for one, for any address; a session comes from following the mail, on
  `shared/auth/sign-in`'s terms
- **No unban** — the door SHALL refuse an unban; a run that needs an unbanned
  address mints one
- **No seed** — the door SHALL refuse a store or an auction seed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-i2h rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-26 - A session mint is refused
**Serves:** Closed - the job does not mint a session without following the mail

- **GIVEN** the door's own workflow and a tester address
- **WHEN** it asks the door for a session for that address without following a
  sign-in mail
- **THEN** the call is refused
- **AND** no session is created

<!-- trace:scenario id=g10.shared-test-sign-in.SC-d7r rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-27 - An unban is refused
**Serves:** Closed - the job does not unban

- **GIVEN** a tester address the door's own workflow banned
- **WHEN** it asks the door to unban that address
- **THEN** the call is refused
- **AND** the account is still banned

<!-- trace:scenario id=g10.shared-test-sign-in.SC-9gy rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-28 - A store or auction seed is refused
**Serves:** Closed - the job does not seed store or auction data

- **GIVEN** the door's own workflow
- **WHEN** it asks the door to seed store or auction data
- **THEN** the call is refused
- **AND** no store or auction data is created
