# shared/auth/test-sign-in Specification

## Purpose

How the staging Actions job walks sign-in without the disposable `/dev` door:
who may call, which testers, what the job may do, and where the door stays
closed. Collectors still walk `shared/auth/sign-in`. Operators still walk ban
and role on `shared/auth/users`.

## Feature set

- Who may call
  - Staging job: a run that proves it is this repository's Actions may use the door; any other caller is refused
- Testers
  - Finite list: one collector, one ban-only, one admin-only; Ops names the addresses
- What the job may do
  - Capture the link: the last sign-in mail for an allowlisted tester, without a mailbox
  - Age the unused link: so an expired follow can be walked without waiting five minutes
  - Ban the ban-only tester: so a banned follow can be walked without the Users desk
  - Prepare the admin-only tester: so that address holds `admin` before the link is followed
- Closed
  - Everywhere else: preview, production, and `/dev` on staging stay closed; an address not on the list is refused; the job does not mint a session without following the mail, and it does not seed store or auction data

## ADDED Requirements

### Requirement: Only this repository's Actions job may call the door

This is the lock on who may use the staging sign-in test door.

- **Caller** — a run that proves it is this repository's Actions SHALL be allowed to use the door.
- **Other callers** — a laptop, a fork, and any caller that is not this repository's Actions job SHALL be refused.

#### Scenario: shared-auth-test-sign-in-SC-01 - This repository's Actions may use the door
**Serves:** Who may call - a staging run that proves it is this repository's Actions is let through

- **GIVEN** the door is on staging
- **WHEN** this repository's Actions job calls the door
- **THEN** the call is not refused

#### Scenario: shared-auth-test-sign-in-SC-02 - A laptop, a fork, and any other caller are refused
**Serves:** Who may call - a run that is not this repository's Actions is refused the door

- **GIVEN** the door is on staging
- **WHEN** a laptop, a fork, or any other caller that is not this repository's Actions job calls the door
- **THEN** the call is refused

### Requirement: The door has three testers Ops names

This is the finite list of addresses the door will act on.

- **Slots** — the list SHALL be one collector tester, one ban-only tester, and one admin-only tester.
- **Addresses** — those addresses SHALL be the ones Ops has named.
- **Empty** — until Ops has named them, the list SHALL be empty and the door SHALL have no subjects. WHILE the list is empty, every move that names an address SHALL be refused.
- **Named** — every capture, age, ban, or prepare SHALL name a tester. A call that names no address SHALL be refused.

#### Scenario: shared-auth-test-sign-in-SC-03 - The list is one collector, one ban-only, and one admin-only
**Serves:** Testers - Ops names three addresses and those are the only subjects

- **WHEN** Ops has named the addresses
- **THEN** the door has one collector tester, one ban-only tester, and one admin-only tester
- **AND** those addresses are the ones Ops has named

#### Scenario: shared-auth-test-sign-in-SC-04 - Every named address is refused until Ops names the list
**Serves:** Testers - a capture, age, ban, or prepare has no subject while the list is empty

- **GIVEN** Ops has not named the addresses
- **WHEN** this repository's Actions job names any address on a capture, age, ban, or prepare
- **THEN** the move is refused

#### Scenario: shared-auth-test-sign-in-SC-23 - A capture that names no address is refused
**Serves:** Testers - a move with no subject is not a tester on the list

- **GIVEN** Ops has named the addresses
- **WHEN** this repository's Actions job captures the last sign-in mail and names no address
- **THEN** the capture is refused

### Requirement: The job captures the last sign-in mail for an allowlisted tester

This is how the job reads the last sign-in mail without a mailbox.

- **Capture** — the system SHALL let this repository's Actions job read the last sign-in mail for a named tester whose address Ops has named, without a mailbox.
- **That tester** — the last mail returned SHALL be the last send for the named tester, not another tester's mail.
- **Last** — WHEN several sign-in mails have been sent to that tester, capture SHALL return the later send, not an earlier one.
- **None** — WHILE that tester has no last sign-in mail, capture SHALL return no link.
- **Used** — capture SHALL return the last mail even when that link has already been followed.
- **Again** — a second capture SHALL return the same last mail until another send for that tester.
- **No session** — capturing the last mail SHALL NOT mint a session.

#### Scenario: shared-auth-test-sign-in-SC-05 - The last sign-in mail is captured without a mailbox
**Serves:** What the job may do - the staging auth run reads the mail that was already delivered

- **GIVEN** a sign-in mail has been sent through the ordinary mail path to the collector tester
- **WHEN** this repository's Actions job captures the last sign-in mail for that tester
- **THEN** the job receives that last mail
- **AND** it does so without a mailbox

#### Scenario: shared-auth-test-sign-in-SC-18 - Capture for one tester does not return another's mail
**Serves:** What the job may do - each tester's last mail stays that tester's

- **GIVEN** a last sign-in mail for the collector tester and a last sign-in mail for the admin-only tester
- **WHEN** this repository's Actions job captures the last sign-in mail for the admin-only tester
- **THEN** the job receives the admin-only tester's last mail
- **AND** it does not receive the collector tester's last mail

#### Scenario: shared-auth-test-sign-in-SC-19 - Capture returns the later of two sends
**Serves:** What the job may do - the newest send is the one the job follows

- **GIVEN** an earlier sign-in mail and a later sign-in mail for the collector tester
- **WHEN** this repository's Actions job captures the last sign-in mail for that tester
- **THEN** the job receives the later mail
- **AND** it does not receive the earlier mail

#### Scenario: shared-auth-test-sign-in-SC-17 - Capture with no last mail returns none
**Serves:** What the job may do - there is nothing to follow when nothing was sent

- **GIVEN** the collector tester has no last sign-in mail
- **WHEN** this repository's Actions job captures the last sign-in mail for that tester
- **THEN** no sign-in link is returned

#### Scenario: shared-auth-test-sign-in-SC-27 - Capture of a used last mail still returns it
**Serves:** What the job may do - last mail is the last send, not the last unused send

- **GIVEN** the collector tester's last sign-in mail has already been followed
- **WHEN** this repository's Actions job captures the last sign-in mail for that tester
- **THEN** the job receives that last mail

#### Scenario: shared-auth-test-sign-in-SC-24 - A second capture returns the same last mail until another send
**Serves:** What the job may do - the job can read the same send more than once

- **GIVEN** a last sign-in mail for the collector tester
- **WHEN** this repository's Actions job captures that last mail twice before another send
- **THEN** both captures return that same last mail

#### Scenario: shared-auth-test-sign-in-SC-22 - Capture does not mint a session
**Serves:** Closed - the job still follows the mail to sign in

- **GIVEN** the collector tester has no session
- **AND** a last sign-in mail exists for that tester
- **WHEN** this repository's Actions job captures that last mail
- **THEN** the job receives that last mail
- **AND** no session is created

### Requirement: The job ages an unused sign-in link past its lifetime

This is how the job walks an expired follow without waiting five minutes.

- **Age** — the system SHALL let this repository's Actions job age an unused sign-in link for a named tester whose address Ops has named.
- **Past lifetime** — after ageing, that unused link SHALL already be past its five-minute lifetime.
- **Ordinary lifetime** — ageing SHALL NOT change the five-minute lifetime on ordinary sign-in.
- **Used** — a used link SHALL NOT be aged.
- **None** — WHILE there is no unused link for that tester, age SHALL age none.

#### Scenario: shared-auth-test-sign-in-SC-06 - Ageing makes an unused link already past five minutes
**Serves:** What the job may do - an expired follow can be walked without waiting

- **GIVEN** an unused sign-in link for an allowlisted tester that is still inside its five-minute lifetime
- **WHEN** this repository's Actions job ages that unused link
- **THEN** that link is already past its five-minute lifetime

#### Scenario: shared-auth-test-sign-in-SC-20 - A used link is not aged
**Serves:** What the job may do - only an unused link can be made past its lifetime here

- **GIVEN** a used last sign-in link for the collector tester
- **WHEN** this repository's Actions job ages the unused link for that tester
- **THEN** that used link is unchanged

#### Scenario: shared-auth-test-sign-in-SC-21 - A missing link is not aged
**Serves:** What the job may do - there is no unused link to expire when none was sent

- **GIVEN** the collector tester has no last sign-in mail
- **WHEN** this repository's Actions job ages the unused link for that tester
- **THEN** no unused link is aged

### Requirement: The job bans the ban-only tester and does not unban

This is how the job walks a banned follow without the Users desk.

- **Ban** — the system SHALL let this repository's Actions job ban the ban-only tester.
- **Stay banned** — after a successful ban, that address SHALL stay banned.
- **Already banned** — banning a ban-only tester that is already banned SHALL leave it banned.
- **Unban** — the system SHALL NOT unban through this door.
- **Wrong tester** — a ban of the collector tester or the admin-only tester SHALL be refused.

#### Scenario: shared-auth-test-sign-in-SC-07 - The ban-only tester is banned and stays banned
**Serves:** What the job may do - a banned follow can be walked without the Users desk

- **GIVEN** the ban-only tester is not banned
- **WHEN** this repository's Actions job bans the ban-only tester
- **THEN** that address is banned
- **AND** it stays banned

#### Scenario: shared-auth-test-sign-in-SC-26 - Banning an already-banned ban-only tester leaves it banned
**Serves:** What the job may do - the banned follow can be walked again on the same address

- **GIVEN** the ban-only tester is already banned
- **WHEN** this repository's Actions job bans the ban-only tester
- **THEN** that address stays banned

#### Scenario: shared-auth-test-sign-in-SC-08 - Ban of the collector or admin-only tester is refused
**Serves:** What the job may do - only the ban-only address can be banned here

- **WHEN** this repository's Actions job bans the collector tester or the admin-only tester
- **THEN** the ban is refused
- **AND** neither address is banned by that ask

#### Scenario: shared-auth-test-sign-in-SC-09 - An unban through this door is refused
**Serves:** What the job may do - the ban-only address is not cleared here

- **GIVEN** the ban-only tester is banned
- **WHEN** this repository's Actions job asks this door to unban that tester
- **THEN** the unban is refused
- **AND** that address stays banned

### Requirement: The job prepares the admin-only tester to hold admin

This is how the job has `admin` on the admin-only tester before the link is followed.

- **Prepare** — the system SHALL let this repository's Actions job prepare the admin-only tester. AFTER that prepare, that address SHALL hold `admin`.
- **Already admin** — preparing an admin-only tester that already holds `admin` SHALL leave it holding `admin`.
- **Wrong tester** — a prepare of the collector tester or the ban-only tester SHALL be refused.

#### Scenario: shared-auth-test-sign-in-SC-10 - The admin-only tester holds admin after prepare
**Serves:** What the job may do - console cases that need admin have that address ready before the link is followed

- **GIVEN** the admin-only tester does not hold `admin`
- **WHEN** this repository's Actions job prepares the admin-only tester
- **THEN** that address holds `admin`

#### Scenario: shared-auth-test-sign-in-SC-25 - Preparing an admin-only tester that already holds admin leaves it holding admin
**Serves:** What the job may do - the console case can run again on the same address

- **GIVEN** the admin-only tester already holds `admin`
- **WHEN** this repository's Actions job prepares the admin-only tester
- **THEN** that address holds `admin`

#### Scenario: shared-auth-test-sign-in-SC-11 - Prepare of the collector or ban-only tester is refused
**Serves:** What the job may do - only the admin-only address is granted admin here

- **WHEN** this repository's Actions job prepares the collector tester or the ban-only tester
- **THEN** the prepare is refused
- **AND** neither address holds `admin` from that ask

### Requirement: The door stays closed everywhere else

This is where the door stays shut and what the job must not do here.

- **Preview** — this door SHALL NOT be open on preview.
- **Production** — this door SHALL NOT be open on production.
- **Disposable door** — `/dev` on staging SHALL stay closed. A call to it SHALL be refused.
- **Off-list** — a move that names an address that is not one Ops has named SHALL be refused.
- **Session** — the job SHALL NOT mint a session through this door without following the mail. This door SHALL NOT offer a session-mint move.
- **Seeds** — the job SHALL NOT seed store or auction data through this door.

#### Scenario: shared-auth-test-sign-in-SC-12 - The door is refused on preview and production
**Serves:** Closed - a call on those environments is turned away

- **GIVEN** this repository's Actions job
- **WHEN** it calls this door on preview or on production
- **THEN** the call is refused

#### Scenario: shared-auth-test-sign-in-SC-13 - /dev on staging is refused
**Serves:** Closed - the disposable door stays shut on the public staging worker

- **WHEN** `/dev` is called on staging
- **THEN** the call is refused

#### Scenario: shared-auth-test-sign-in-SC-14 - An address Ops has not named is refused
**Serves:** Closed - a fourth address cannot be captured, aged, banned, or prepared

- **GIVEN** Ops has named the three testers
- **WHEN** this repository's Actions job names an address that is not one of those on a capture, age, ban, or prepare
- **THEN** the move is refused

#### Scenario: shared-auth-test-sign-in-SC-15 - The job cannot mint a session without following the mail
**Serves:** Closed - sign-in still happens by following the mail, never by a mint on this door

- **WHEN** this repository's Actions job asks this door to mint a session without following the mail
- **THEN** the ask is refused
- **AND** no session is created

#### Scenario: shared-auth-test-sign-in-SC-16 - The job cannot seed store or auction data
**Serves:** Closed - store and auction fixtures are not this door's work

- **WHEN** this repository's Actions job asks this door to seed store or auction data
- **THEN** the ask is refused
- **AND** no store or auction data is seeded
