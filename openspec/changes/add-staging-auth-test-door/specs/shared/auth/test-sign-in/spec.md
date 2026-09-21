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
