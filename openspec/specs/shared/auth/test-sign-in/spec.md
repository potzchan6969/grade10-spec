# shared/auth/test-sign-in Specification

## Purpose

How the hosted Actions lanes, and a QA agent walking a manual pass, walk sign-in without the disposable `/dev` endpoint:
which run may call, which addresses it may act on, what it may do to them, and
where the test endpoint stays closed. Collectors still walk `shared/auth/sign-in`.
Operators still walk ban and role on `shared/auth/users`.

## Feature set

- Who may call
  - The test endpoint's own workflow: a run that proves it is this repository's Actions, running that one workflow from the main branch, on a dispatch a reviewer approved
  - The QA token: a staging-only token committed to the repository, held by a QA agent, for capture, expire and clear alone, on a tester address other than the admin-only one
  - Every other caller is refused
- Testers
  - The named testers: each environment's own, written into the code, and on staging and uat a unique plus-tag of one generated per run, its account removed in the next daily cleanup; any other address is refused, and an account is created when an action needs one
- What the workflow may do
  - Capture the link: the last sign-in mail for a tester address, without a mailbox
  - Expire the unused link: so an expired follow can be walked without waiting five minutes
  - Ban the address: so a banned follow can be walked without the Users desk
  - Grant the address: so it holds `admin` before the link is followed
  - Grant a scoped role: so a unique plus-tag of the collector holds one operator role before the link is followed
  - Clear the sign-in limits: the wait between two mails and the count a caller may ask for, so a suite is not throttled as an attacker would be
- Where it opens
  - Staging and uat: every action
  - Production, and preview with it: capture and clear alone, for production's named testers, so a smoke test can sign in there
- Closed
  - Everywhere else: local stacks open no action, and `/dev` stays closed on staging, uat and production; the workflow does not generate a session without following the mail, does not unban, and does not seed store or auction data

## Requirements

### Requirement: Only the test endpoint's own workflow and the QA token may call

Which run the test endpoint acts for, and what a refused call leaves behind.

- **The one caller** — the test endpoint SHALL act only for a call that proves it is
  this repository's Actions, running the test endpoint's own workflow, from the main
  branch, on a dispatch a reviewer approved; proving the repository alone is
  not enough, because every workflow in it proves the same thing
- **Another workflow** — a call from any other workflow in this repository
  SHALL be refused
- **Another branch** — a call from a run on any branch other than main, a run
  a pull request started included, SHALL be refused
- **An unapproved dispatch** — a call from a run whose dispatch no reviewer
  approved SHALL be refused
- **The QA token** — a call carrying the current QA token SHALL be acted on
  for capture, expire and clear on a tester address; the token is committed to
  the repository, and staging alone accepts it
- **The token's limits** — a ban, a grant or a scoped role carrying only the
  QA token SHALL be refused, and a token a later commit replaced SHALL be refused
- **Anyone else** — a call from a laptop, a fork, or another repository that
  carries no current QA token SHALL be refused
- **A refused call** — a call the test endpoint refuses SHALL change nothing: no
  account, no role, no ban, no link, no limit; a ban, grant or scoped role
  refused after the access check `shared/auth/audit` defines — the caller, the
  environment's actions and the QA token's three — is still recorded on the
  identity trail there

<!-- trace:scenario id=g10.shared-test-sign-in.SC-xog rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-01 - The test endpoint acts for its own workflow
**Serves:** Who may call - the run that may reach the test endpoint

- **GIVEN** a staging run of the test endpoint's own workflow, from the main branch, on
  a dispatch a reviewer approved
- **WHEN** it calls an action on a tester address
- **THEN** the test endpoint carries out that action

<!-- trace:scenario id=g10.shared-test-sign-in.SC-gpm rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-02 - Another workflow in this repository is refused
**Serves:** Who may call - proving the repository is not enough

- **GIVEN** a run of a different workflow in this repository's Actions
- **WHEN** it calls the test endpoint
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-sy2 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-03 - A run a pull request started is refused
**Serves:** Who may call - proving the repository is not enough

- **GIVEN** a run of the test endpoint's own workflow that a pull request started, on
  that pull request's branch
- **WHEN** it calls the test endpoint
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-57d rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-32 - The test endpoint's own workflow off the main branch is refused
**Serves:** Who may call - the run that may reach the test endpoint

- **GIVEN** a run of the test endpoint's own workflow, on a dispatch a reviewer
  approved, from a branch other than main
- **WHEN** it calls the test endpoint
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-6c0 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-04 - A dispatch no reviewer approved is refused
**Serves:** Who may call - the run that may reach the test endpoint

- **GIVEN** a run of the test endpoint's own workflow, from the main branch, on a
  dispatch no reviewer approved
- **WHEN** it calls the test endpoint
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-93o rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-05 - A caller that is not this repository's Actions is refused
**Serves:** Who may call - every other caller is refused

- **GIVEN** a caller from a laptop, a fork, or another repository, carrying no QA token
- **WHEN** it calls the test endpoint
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-l73 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-94 - The QA token captures a tester's link
**Serves:** Who may call - the QA agent walking a manual pass

- **GIVEN** a call on staging carrying the current QA token, and a tester address holding an unused sign-in mail
- **WHEN** it asks for that address's last sign-in mail
- **THEN** the test endpoint returns the link

<!-- trace:scenario id=g10.shared-test-sign-in.SC-kgh rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-95 - The QA token cannot ban, grant, set a role, or outlive its rotation
**Serves:** Who may call - the QA agent walking a manual pass

- **GIVEN** a call on staging carrying only the QA token
- **WHEN** it asks to ban, grant or set a scoped role on a tester address, or carries a token a later commit replaced
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

### Requirement: The QA token never reaches the admin-only tester and works on staging alone

The QA token SHALL NOT act on the admin-only tester, on any environment. It
SHALL act only on staging, and every other environment SHALL refuse it as it
refuses any wrong caller.

#### Scenario: shared-auth-test-sign-in-SC-97 - The QA token is refused for the admin-only tester
**Serves:** Who may call - the QA agent walking a manual pass

- **GIVEN** a call on staging carrying the current QA token, and the admin-only tester's address holding an unused sign-in mail
- **WHEN** it asks for that address's last sign-in mail, or to expire its link
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed, and the refusal names no rule

#### Scenario: shared-auth-test-sign-in-SC-98 - The QA token is refused off staging
**Serves:** Who may call - the QA agent walking a manual pass

- **GIVEN** a call on uat, on preview, or on production carrying the current QA token, and a tester address holding an unused sign-in mail
- **WHEN** it asks for that address's last sign-in mail
- **THEN** the test endpoint refuses the call
- **AND** nothing is changed

### Requirement: Every action names one of the environment's testers

Which addresses the test endpoint acts on, and what it creates to act on one.

- **The address** — every action SHALL name an address, and the test endpoint SHALL carry
  it out only when that address is one of the environment's testers
- **The named testers** — each environment's testers are written into the
  code, not configured: staging and uat each name four — a collector, a
  plus-tag sibling, a ban-only and an admin-only address — and production
  names its own smoke testers, today its collector alone; any other
  environment names none
- **A generated plus-tag** — on staging and uat, a unique plus-tag of a named
  tester SHALL count as a tester for capture, expire and clear, and a unique
  plus-tag of the collector for ban, grant and a scoped role; production
  counts no plus-tag
- **Case** — an address SHALL be matched without regard to case
- **A plus tag** — two addresses that differ only by a plus tag SHALL be two
  addresses, each acted on and each holding its own last mail
- **Anyone else** — an action naming any other address SHALL be refused, and that
  address SHALL be unchanged
- **No address** — an action naming no address SHALL be refused; the test endpoint SHALL
  NOT read a missing address as a default one
- **An account the action needs** — WHEN an action needs an account for a tester
  address that has never signed in, the test endpoint SHALL create the account, then
  put it in the state the action names
- **The send** — the test endpoint SHALL NOT skip or replace a sign-in send to a tester
  address; the mail goes the ordinary way
- **Removing** — the account of a generated plus-tag SHALL be removed in the
  next daily cleanup after the run that generated it, on the identity trail
  (`shared/auth/audit`); a named tester's account SHALL
  never be removed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-4tc rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-06 - An address a run generated is acted on
**Serves:** Testers - a unique plus-tag of a named tester

- **GIVEN** a unique plus-tag of the staging collector that the run generated for itself
- **WHEN** the test endpoint's own workflow calls an action on it
- **THEN** the test endpoint carries out that action
- **AND** it does not require that address to have been named before

<!-- trace:scenario id=g10.shared-test-sign-in.SC-n68 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-07 - An address that is no tester is refused
**Serves:** Testers - any other address is refused

- **GIVEN** an address that is neither a named tester nor a plus-tag of one
- **WHEN** the test endpoint's own workflow calls an action on it
- **THEN** the test endpoint refuses the call
- **AND** that address is unchanged

#### Scenario: shared-auth-test-sign-in-SC-104 - A generated plus-tag's account is removed in the next daily cleanup
**Serves:** Testers - a unique plus-tag of a named tester

- **GIVEN** a staging run that generated a unique plus-tag of the collector and banned it
- **WHEN** the next daily cleanup after that run has finished
- **THEN** no account exists for that plus-tag
- **AND** every named tester's account is still there

<!-- trace:scenario id=g10.shared-test-sign-in.SC-y6k rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-30 - A plus-tag on production is refused
**Serves:** Testers - any other address is refused

- **GIVEN** a plus-tag of the production collector
- **WHEN** the test endpoint's own workflow calls an action on it
- **THEN** the test endpoint refuses the call
- **AND** that address is unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-wse rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-31 - Two addresses differing only by a plus tag are two subjects
**Serves:** Testers - a unique plus-tag of a named tester

- **GIVEN** two tester addresses that differ only by a plus tag, each of which
  asked for a sign-in link
- **WHEN** the test endpoint's own workflow captures the first one's last sign-in mail
- **THEN** it receives that address's link, not the other's

<!-- trace:scenario id=g10.shared-test-sign-in.SC-u90 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-34 - A named tester in mixed case is acted on
**Serves:** Testers - the named testers

- **GIVEN** a named tester's address, written in mixed case
- **WHEN** the test endpoint's own workflow calls an action on it
- **THEN** the test endpoint carries out that action

<!-- trace:scenario id=g10.shared-test-sign-in.SC-o4r rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-08 - An action naming no address is refused
**Serves:** Testers - every action names an address

- **WHEN** the test endpoint's own workflow calls an action that names no address
- **THEN** the test endpoint refuses the call
- **AND** it acts on no address

<!-- trace:scenario id=g10.shared-test-sign-in.SC-q44 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-09 - A ban creates the account of an address that never signed in
**Serves:** Testers - an account is created when an action needs one

- **GIVEN** a unique plus-tag of the collector that has never signed in
- **WHEN** the test endpoint's own workflow bans it
- **THEN** an account exists for that address
- **AND** that account is banned

<!-- trace:scenario id=g10.shared-test-sign-in.SC-1xt rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-10 - A grant creates the account of an address that never signed in
**Serves:** Testers - an account is created when an action needs one

- **GIVEN** a unique plus-tag of the collector that has never signed in
- **WHEN** the test endpoint's own workflow grants it
- **THEN** an account exists for that address
- **AND** that account holds `admin`

<!-- trace:scenario id=g10.shared-test-sign-in.SC-bap rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-11 - A sign-in mail to a tester address is sent the ordinary way
**Serves:** Testers - the named testers

- **GIVEN** a tester address
- **WHEN** that address asks for a sign-in link
- **THEN** the mail is sent the ordinary way
- **AND** the test endpoint neither skips nor replaces that send


#### Scenario: shared-auth-test-sign-in-SC-99 - Staging names four testers and a plus-tag of one
**Serves:** Testers - the named testers

- **GIVEN** a staging run
- **WHEN** it acts on each named tester, and on a plus-tag of the collector
- **THEN** the endpoint carries out each action
- **AND** an address that is neither a named tester nor a generated plus-tag is refused

#### Scenario: shared-auth-test-sign-in-SC-100 - Uat takes every action
**Serves:** Where it opens - staging and uat, every action

- **GIVEN** a uat run of the test endpoint's workflow
- **WHEN** it captures, expires, bans, grants `admin` or clears for a named tester
- **THEN** the endpoint carries out that action

### Requirement: Capture returns the last sign-in mail for the address named

What the test endpoint hands back in place of a mailbox.

- **What comes back** — the test endpoint SHALL return the sign-in link from the last
  sign-in mail sent to the named tester address, with no mailbox opened
- **That address only** — the test endpoint SHALL return the named address's last mail,
  never a later send to another address
- **No send** — WHEN no sign-in mail has been sent to that address, the test endpoint
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
**Serves:** What the workflow may do - capture the link without a mailbox

- **GIVEN** a tester address that asked for a sign-in link
- **WHEN** the test endpoint's own workflow captures that address's last sign-in mail
- **THEN** it receives the sign-in link that mail carries
- **AND** no mailbox is opened
- **AND** following that link signs in on the terms `shared/auth/sign-in` sets

<!-- trace:scenario id=g10.shared-test-sign-in.SC-a82 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-13 - Capture of an address with no send returns no link
**Serves:** What the workflow may do - capture the link without a mailbox

- **GIVEN** a tester address no sign-in mail has been sent to
- **WHEN** the test endpoint's own workflow captures that address's last sign-in mail
- **THEN** the call is not refused
- **AND** no link comes back

<!-- trace:scenario id=g10.shared-test-sign-in.SC-tjs rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-14 - Capture ignores a later send to another address
**Serves:** What the workflow may do - capture the link without a mailbox

- **GIVEN** two tester addresses, each of which asked for a sign-in link
- **AND** the later mail went to the second address
- **WHEN** the test endpoint's own workflow captures the first address's last sign-in
  mail
- **THEN** it receives the first address's link, not the second's

<!-- trace:scenario id=g10.shared-test-sign-in.SC-i3g rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-15 - A second capture returns the same link
**Serves:** What the workflow may do - capture the link without a mailbox

- **GIVEN** a tester address whose last sign-in link has already been captured
  and followed
- **AND** no later sign-in mail has gone to that address, and the mail was
  sent less than fifteen minutes ago
- **WHEN** the test endpoint's own workflow captures that address's last sign-in mail
  again
- **THEN** it receives that same link

<!-- trace:scenario id=g10.shared-test-sign-in.SC-fdk rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-29 - A mail older than fifteen minutes is no longer capturable
**Serves:** What the workflow may do - capture the link without a mailbox

- **GIVEN** a tester address whose last sign-in mail was sent more than
  fifteen minutes ago
- **WHEN** the test endpoint's own workflow captures that address's last sign-in mail
- **THEN** the call is not refused
- **AND** no link comes back

### Requirement: Expire ends an unused link's life early

How the workflow walks an expired follow without the wall clock.

- **An unused link** — WHEN the named tester address holds an unused sign-in
  link, the test endpoint SHALL expire it past the five-minute lifetime
  `shared/auth/sign-in` sets, so following it creates no session
- **At once** — the expired link SHALL be past its life the moment the action
  settles; the caller SHALL NOT wait out the five minutes
- **A used link** — a link that has already created a session SHALL be
  unchanged
- **No link** — WHEN the address holds no unused link, the test endpoint SHALL expire none
  and SHALL change nothing
- **The account** — aging SHALL NOT change the account and SHALL NOT create a
  session

<!-- trace:scenario id=g10.shared-test-sign-in.SC-xo7 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-16 - An expired link no longer signs in
**Serves:** What the workflow may do - expire the unused link so an expired follow can be walked

- **GIVEN** a tester address holding an unused sign-in link sent seconds ago
- **WHEN** the test endpoint's own workflow expires that link
- **AND** anyone follows it
- **THEN** no session is created
- **AND** the caller waited out no part of the five minutes
- **AND** the account for that address is unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-xe4 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-17 - A used link is unchanged by aging
**Serves:** What the workflow may do - expire the unused link so an expired follow can be walked

- **GIVEN** a tester address whose last sign-in link has already created a
  session
- **WHEN** the test endpoint's own workflow expires that address's link
- **THEN** that link is unchanged
- **AND** the session it created stands

<!-- trace:scenario id=g10.shared-test-sign-in.SC-bj0 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-18 - An address with no unused link expires none
**Serves:** What the workflow may do - expire the unused link so an expired follow can be walked

- **GIVEN** a tester address holding no unused sign-in link
- **WHEN** the test endpoint's own workflow expires that address's link
- **THEN** no link is expired
- **AND** nothing is changed

### Requirement: Ban puts a tester address in the banned state

How the workflow walks a banned follow without the Users desk.

- **The state** — the test endpoint SHALL put the account for the named tester address
  in the banned state `shared/auth/users` defines, so a follow of that
  address's sign-in link is refused the way a banned follow is
- **No desk** — the ban SHALL need no operator, no session, and no grant on
  the Users desk

<!-- trace:scenario id=g10.shared-test-sign-in.SC-21a rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-19 - A banned tester address cannot sign in
**Serves:** What the workflow may do - ban the address so a banned follow can be walked

- **GIVEN** a tester address the test endpoint's own workflow banned, with no operator
  and no grant on the Users desk
- **WHEN** that address's sign-in link is followed
- **THEN** no session is created
- **AND** the follow is refused the way a banned follow is

### Requirement: Grant puts `admin` on a tester address

How a console case reaches a signed-in admin.

- **The role** — the test endpoint SHALL put `admin` on the account for the named
  tester address, on the terms `shared/auth/roles` sets for holding it
- **Before the follow** — the role SHALL be on the account before the sign-in
  link is followed, so the session that follow creates holds it
- **No session** — grant SHALL NOT sign that address in

<!-- trace:scenario id=g10.shared-test-sign-in.SC-tfs rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-20 - A granted address signs in as an admin
**Serves:** What the workflow may do - grant the address so it holds `admin`

- **GIVEN** a tester address the test endpoint's own workflow granted
- **AND** that account holds `admin` and is not signed in
- **WHEN** that address's sign-in link is followed
- **THEN** the session holds `admin`

### Requirement: Grant a scoped role on a generated collector address

How an operator walk gets an account that holds one scoped role.

- **The role** — on staging and uat the test endpoint SHALL put one of `staff`,
  `support`, `finance`, `treasurer` or `auditor` on the account for a unique
  plus-tag of that environment's collector, creating the account when absent
- **Never a named tester** — the test endpoint SHALL refuse a scoped role for a named
  tester, so the testers the lanes rely on keep the roles they document
- **Not `admin`** — `admin` SHALL stay on grant; the test endpoint SHALL refuse it, or
  any role outside the five, here

#### Scenario: shared-auth-test-sign-in-SC-96 - A generated collector address holds a scoped role
**Serves:** What the workflow may do - grant a scoped role

- **GIVEN** a unique plus-tag of the staging collector
- **WHEN** the test endpoint's own workflow grants it as `finance`
- **THEN** the account for that address holds `finance`
- **AND** a named tester asked for the same role is refused and unchanged

### Requirement: Clearing the sign-in limits frees a tester from the throttle

How a suite asks for mail after mail without being held as an attacker.

- **What clears** — the test endpoint SHALL clear, for the named tester address and for
  the caller, the wait between two sign-in mails and the cap on how many a
  caller may ask for that `shared/auth/sign-in` sets, so the next ask sends a
  mail at once
- **Everyone else** — the limits themselves SHALL stand: another address's
  wait and another caller's cap SHALL be unchanged

<!-- trace:scenario id=g10.shared-test-sign-in.SC-cy4 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-21 - A cleared address is sent a second mail at once
**Serves:** What the workflow may do - clear the sign-in limits so a suite is not throttled

- **GIVEN** a tester address sent a sign-in mail seconds ago
- **WHEN** the test endpoint's own workflow clears the sign-in limits for that address
  and for itself
- **AND** that address asks for another sign-in link
- **THEN** a second mail is sent
- **AND** the caller waited out no part of the wait between two mails

<!-- trace:scenario id=g10.shared-test-sign-in.SC-to0 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-33 - A cleared caller may ask past the count
**Serves:** What the workflow may do - clear the sign-in limits so a suite is not throttled

- **GIVEN** a caller that has asked for as many sign-in mails as the cap
  `shared/auth/sign-in` sets allows, naming a tester address
- **WHEN** the test endpoint's own workflow clears the sign-in limits for that address
  and for itself
- **AND** it asks for another sign-in link for that address
- **THEN** that mail is sent

<!-- trace:scenario id=g10.shared-test-sign-in.SC-dcz rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-22 - Clearing leaves another address's wait standing
**Serves:** What the workflow may do - clear the sign-in limits so a suite is not throttled

- **GIVEN** two tester addresses, each sent a sign-in mail seconds ago
- **WHEN** the test endpoint's own workflow clears the sign-in limits for the first
  address
- **AND** the second address asks for another sign-in link
- **THEN** no second mail is sent to the second address
- **AND** it is told to wait

### Requirement: The test endpoint opens where a hosted lane runs

Where the test endpoint answers, which actions it answers there, and which endpoint stays
shut beside it.

- **Staging and uat** — the test endpoint SHALL answer every action on staging and on uat
- **Production** — on production the test endpoint SHALL answer capture and clear
  alone, for production's named testers; expire, ban, grant and a scoped role
  SHALL be refused and SHALL change nothing. Preview runs the production
  backends, so it answers as production does
- **Anywhere else** — a local or disposable stack SHALL open no action
- **The disposable endpoint** — the disposable `/dev` endpoint SHALL stay closed on
  staging, uat and production: a call to it SHALL be refused

<!-- trace:scenario id=g10.shared-test-sign-in.SC-tx7 rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-23 - Preview answers as production does
**Serves:** Where it opens - production, and preview with it

- **GIVEN** the test endpoint's own workflow, from the main branch, on a dispatch a
  reviewer approved
- **WHEN** it asks preview to expire, ban or grant an address
- **THEN** the call is refused
- **AND** nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-56z rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-24 - Production captures and clears for its named testers alone
**Serves:** Where it opens - production, and preview with it

- **GIVEN** the test endpoint's own workflow, from the main branch, on a dispatch a
  reviewer approved
- **WHEN** it captures the production collector's last sign-in mail, and asks
  production to ban that collector
- **THEN** it receives the link
- **AND** the ban is refused and nothing is changed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-u3l rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-25 - The disposable endpoint on staging is refused
**Serves:** Closed - `/dev` stays closed on every hosted environment

- **WHEN** anyone calls the disposable `/dev` endpoint on staging
- **THEN** the call is refused
- **AND** no session is created


#### Scenario: shared-auth-test-sign-in-SC-101 - Production refuses expire, grant and a scoped role
**Serves:** Where it opens - production, and preview with it

- **GIVEN** a production run of the test endpoint's workflow
- **WHEN** it expires a link, grants `admin` or sets a scoped role
- **THEN** the endpoint refuses the call
- **AND** nothing is changed

#### Scenario: shared-auth-test-sign-in-SC-102 - Preview captures the collector's link
**Serves:** Where it opens - preview runs the production backends

- **GIVEN** a preview run of the test endpoint's workflow
- **WHEN** it captures the collector's last sign-in mail
- **THEN** the endpoint returns that mail's link

#### Scenario: shared-auth-test-sign-in-SC-103 - Local stacks open no action
**Serves:** Closed - local stacks open no action

- **GIVEN** a local stack
- **WHEN** any caller calls the test endpoint
- **THEN** the endpoint refuses the call
- **AND** nothing is changed

### Requirement: The test endpoint makes no action beyond those six

What the test endpoint will not do for the caller it accepts.

- **The set** — capture, expire, ban, grant, a scoped role, and clear are the
  whole set, and the test endpoint SHALL refuse any other action
- **No session** — the test endpoint SHALL NOT create a session, or anything that
  stands for one, for any address; a session comes from following the mail, on
  `shared/auth/sign-in`'s terms
- **No unban** — the test endpoint SHALL refuse an unban; a run that needs an unbanned
  address generates one
- **No seed** — the test endpoint SHALL refuse a store or an auction seed

<!-- trace:scenario id=g10.shared-test-sign-in.SC-i2h rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-26 - A session generate is refused
**Serves:** Closed - the workflow does not generate a session without following the mail

- **GIVEN** the test endpoint's own workflow and a tester address
- **WHEN** it asks the test endpoint for a session for that address without following a
  sign-in mail
- **THEN** the call is refused
- **AND** no session is created

<!-- trace:scenario id=g10.shared-test-sign-in.SC-d7r rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-27 - An unban is refused
**Serves:** Closed - the workflow does not unban

- **GIVEN** a tester address the test endpoint's own workflow banned
- **WHEN** it asks the test endpoint to unban that address
- **THEN** the call is refused
- **AND** the account is still banned

<!-- trace:scenario id=g10.shared-test-sign-in.SC-9gy rev=1 -->
#### Scenario: shared-auth-test-sign-in-SC-28 - A store or auction seed is refused
**Serves:** Closed - the workflow does not seed store or auction data

- **GIVEN** the test endpoint's own workflow
- **WHEN** it asks the test endpoint to seed store or auction data
- **THEN** the call is refused
- **AND** no store or auction data is created
