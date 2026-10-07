# grade10-site/store/wallet-member-card Specification

## Purpose

A phone-wallet rendering of the loyalty member card `grade10-site/store/membership`
carries on the site: Google Wallet and Apple Wallet each hold a pass that
identifies the member at the counter, stays current one sweep behind the
programme, and is discharged rather than deleted when a member ends it or
asks to be erased. An operator ends it for a member whose phone is gone.

## Feature set

- The wallet pass
  - Ending one: immediate, by the member, or by an operator holding
    `store:write` for a member whose phone is gone
- Configuration
  - Launch check: fails, naming each missing secret, where a wallet's
    issuer is recorded and one of that wallet's secrets is unset; reports no
    wallet secret missing where no issuer is recorded

## ADDED Requirements

### Requirement: An operator ends a member's pass from the console

An operator holding `store:write` SHALL be able to end one wallet's pass for a
member from the member's record in the console, leaving the member's pass in
the other wallet live. The record SHALL ask the operator to confirm, naming
the wallet, and an ending the operator does not confirm SHALL end nothing.
The ending SHALL take effect at once, as the member's own does: every code the
ended pass can make identifies nobody, and the member can add a new pass
afterwards. The ending SHALL end the pass the wallet holds when the operator
confirms, including one the member added after the record opened. The
member SHALL be sent no message. The audit trail SHALL record
each ending with the operator, the member, the wallet, the time and whether a
pass was ended. The record SHALL show an operator holding `store:write` the
wallets the member carries a live pass in, and SHALL offer an operator without
it neither the wallets nor the ending; a request for the member's wallets
without it SHALL be refused as forbidden. A record whose wallets cannot be read
SHALL say so and offer no ending, never that the member holds none. An
operator without `store:write` who attempts the ending SHALL be refused as
forbidden, not answered as though the pass or the act did not exist, and the
pass SHALL stay live. Ending a wallet the member holds no live pass in SHALL
end nothing and say so. An operator SHALL be able to end the pass on their
own member record as on any other.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-a5e rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-38 - An operator ends a member's pass, and the audit trail records it
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member carrying a live pass in one wallet
- **WHEN** an operator holding `store:write` ends that wallet's pass
- **THEN** a code the pass makes identifies nobody, and the member can add a new pass
- **AND** no message reaches the member
- **AND** the audit trail records the operator, the member, the wallet, the time and that a pass was ended

<!-- trace:scenario id=g10.store-wallet-member-card.SC-ts9 rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-62 - An operator without the grant is refused, and the pass stays live
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member carrying a live pass in one wallet
- **WHEN** an operator without `store:write` ends that wallet's pass
- **THEN** the act is refused as forbidden, not answered as though the pass did not exist
- **AND** a code the pass makes still identifies the member

<!-- trace:scenario id=g10.store-wallet-member-card.SC-7ub rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-63 - An operator sees which wallets a member carries a pass in
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member carrying a live pass in one wallet
- **WHEN** an operator holding `store:write` opens the member's record
- **THEN** that wallet is named, with its ending beside it
- **AND** once that pass is ended, the wallet leaves the list
- **AND** a member who never saved a pass shows none
- **AND** an operator without `store:write` is offered neither the wallets nor the ending, and a request for the member's wallets is refused as forbidden

<!-- trace:scenario id=g10.store-wallet-member-card.SC-6nw rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-64 - Ending a wallet with no live pass ends nothing
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member with no live pass in a wallet
- **WHEN** an operator holding `store:write` ends that wallet's pass
- **THEN** nothing is ended, and the operator is told nothing was held
- **AND** the audit trail records the attempt as having ended nothing

<!-- trace:scenario id=g10.store-wallet-member-card.SC-eyg rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-65 - An operator's ending leaves the other wallet's pass live
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member carrying a live pass in each wallet
- **WHEN** an operator holding `store:write` ends one wallet's pass
- **THEN** a code the other wallet's pass makes still identifies the member
- **AND** the record still names the other wallet

<!-- trace:scenario id=g10.store-wallet-member-card.SC-1an rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-66 - An ending the operator does not confirm ends nothing
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member carrying a live pass in one wallet
- **WHEN** an operator holding `store:write` chooses that wallet's ending
- **THEN** the record asks them to confirm, naming the wallet
- **AND** when they decline, a code the pass makes still identifies the member, and the record still names the wallet

<!-- trace:scenario id=g10.store-wallet-member-card.SC-3il rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-67 - A record whose wallets cannot be read says so
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** a member whose wallets cannot be read
- **WHEN** an operator holding `store:write` opens the member's record
- **THEN** the record says the wallets could not be read
- **AND** it never says the member holds no pass, and offers no ending

<!-- trace:scenario id=g10.store-wallet-member-card.SC-6w0 rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-71 - An operator ends the pass on their own record
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** an operator holding `store:write` who carries a live pass in one wallet
- **WHEN** they end that wallet's pass from their own member record
- **THEN** a code the pass makes identifies nobody, as on any other member's record

<!-- trace:scenario id=g10.store-wallet-member-card.SC-p9m rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-75 - An operator's ending ends a pass the member added after the record opened
**Serves:** grade10-site-store-wallet-member-card-US-09 - Operator ends a member's pass from the console

- **GIVEN** an operator holding `store:write` has the record of a member carrying a live pass in one wallet open
- **AND** the member then adds a new pass in that wallet
- **WHEN** the operator ends that wallet's pass
- **THEN** a code the new pass makes identifies nobody
- **AND** the audit trail records that a pass was ended

## MODIFIED Requirements

### Requirement: A half-configured wallet says which secret is missing

Issuing a pass on a wallet whose credentials are not fully configured SHALL
refuse loudly, naming the missing secret, rather than issuing a pass nobody
can read.

The launch check, `pnpm run secrets --check`, SHALL fail, naming each missing
secret, for a brand and environment where `packages/app-env` records a
wallet's issuer and one of that wallet's expected secrets is unset, and SHALL
report no wallet secret missing where no issuer is recorded. Google's
expected secrets SHALL be `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` and
`WALLET_PASS_KEY`; Apple's SHALL be `WALLET_APPLE_PASS_CERT`,
`WALLET_APPLE_PASS_KEY`, `WALLET_PASS_AUTH_KEY` and `WALLET_PASS_KEY`. Where
the Apple issuer is recorded and the environment binds no `WALLET_APPLE_APNS`
client certificate, the check SHALL also expect `WALLET_APPLE_APNS_KEY` and
the issuer's APNs key id, naming each that is missing; where it binds one,
it SHALL expect neither.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-58f rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-12 - A missing credential names itself
**Serves:** grade10-site-store-wallet-member-card-US-01 - Member adds their card to a phone wallet

- **GIVEN** a deployment missing one wallet credential
- **WHEN** a member tries to add that wallet's pass
- **THEN** the refusal names the missing credential

<!-- trace:scenario id=g10.store-wallet-member-card.SC-oga rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-68 - A recorded issuer missing its secrets fails the launch check, naming each
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment whose Google issuer is recorded
- **AND** `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` and `WALLET_PASS_KEY` are unset there
- **WHEN** the launch check runs
- **THEN** it fails, naming `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY` and `WALLET_PASS_KEY`

<!-- trace:scenario id=g10.store-wallet-member-card.SC-j9h rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-74 - A recorded Apple issuer missing its signing secrets fails the launch check, naming each
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment whose Apple issuer is recorded with an APNs key id
- **AND** that environment binds no `WALLET_APPLE_APNS` client certificate
- **AND** `WALLET_APPLE_APNS_KEY` is set there, and `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_PASS_AUTH_KEY` and `WALLET_PASS_KEY` are unset
- **WHEN** the launch check runs
- **THEN** it fails, naming `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_PASS_AUTH_KEY` and `WALLET_PASS_KEY`

<!-- trace:scenario id=g10.store-wallet-member-card.SC-i4n rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-69 - A deployment with no issuer recorded expects no wallet secret
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment that records no wallet issuer, as ZZZ does everywhere and Grade10 does before its enrolment
- **AND** no wallet secret is set there
- **WHEN** the launch check runs
- **THEN** no wallet secret is reported missing

<!-- trace:scenario id=g10.store-wallet-member-card.SC-e1r rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-70 - An Apple issuer pushing by client certificate expects no push key
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment whose Apple issuer is recorded with no APNs key id
- **AND** that environment binds a `WALLET_APPLE_APNS` client certificate
- **AND** every Apple secret but `WALLET_APPLE_APNS_KEY` is set there
- **WHEN** the launch check runs
- **THEN** no Apple secret is reported missing, and neither is the APNs key id

<!-- trace:scenario id=g10.store-wallet-member-card.SC-wlb rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-72 - A brand recording one wallet expects none of the other's secrets
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment whose Google issuer is recorded and whose Apple issuer is not
- **AND** both Google secrets are set there, and no Apple secret
- **WHEN** the launch check runs
- **THEN** no Apple secret is reported missing

<!-- trace:scenario id=g10.store-wallet-member-card.SC-xay rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-73 - An Apple issuer with an APNs key id expects the push key
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment whose Apple issuer is recorded with an APNs key id
- **AND** that environment binds no `WALLET_APPLE_APNS` client certificate
- **AND** every Apple secret but `WALLET_APPLE_APNS_KEY` is set there
- **WHEN** the launch check runs
- **THEN** it fails, naming `WALLET_APPLE_APNS_KEY`

<!-- trace:scenario id=g10.store-wallet-member-card.SC-svn rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-61 - An Apple issuer with neither push credential fails the launch check, naming both
**Serves:** Configuration - Launch check

- **GIVEN** a brand and environment whose Apple issuer is recorded with no APNs key id
- **AND** that environment binds no `WALLET_APPLE_APNS` client certificate
- **AND** every Apple secret but `WALLET_APPLE_APNS_KEY` is set there
- **WHEN** the launch check runs
- **THEN** it fails, naming `WALLET_APPLE_APNS_KEY` and the APNs key id
