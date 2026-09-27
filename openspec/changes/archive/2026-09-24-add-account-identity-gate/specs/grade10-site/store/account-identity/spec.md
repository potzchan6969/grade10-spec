## Purpose

A collector verifies their identity from their own account on the Grade10
site, on their own device, and is recognised as verified wherever Grade10
asks: at a checkout or a bid at or above the brand's bar, and at a vault
visit. The account page says where they stand and never who they are.

A **standing** is the identity store's answer for a person on the day it is
asked — verified, expired, or unverified — as `grade10-site/e-kyc/identity-record`
defines it. A **hosted check** is the provider's check as
`grade10-site/e-kyc/hosted-verification` defines it; here the store raises one
for an account, where the vault raises one for a case. The **bar** is the value
at or above which an order's goods or a bid asks for a verified person, stated
per brand in the brand's currency's minor units; Grade10's is 12,000,000 HKD
minor units for both.

## Feature set

- Where the collector stands
  - Standing: verified until when, expired, or not yet, read from the identity store the day it is shown
  - The bar: the order value and the bid value at which a verified identity is asked for
- Verifying from the account
  - Consent first: nothing reaches the provider until the collector has agreed on the page
  - The provider's page: the check happens on the provider's own page, on the collector's device
  - Reuse: a check passed for a vault visit counts here, and one passed here counts at the visit
- What the page never shows
  - No identity field: no name, birth date, document type or number reaches the account page
- Erasure
  - With the account: erasing the account ends its check and lets the identity store's binding go

## ADDED Requirements

### Requirement: The account page shows where the collector stands, and nothing of who they are

The system SHALL show a signed-in collector, on their account page, these
facts and no other about their identity. The standing SHALL be the identity
store's answer on the day the page is read, whichever product recorded the
check behind it. On a brand that deploys no identity store the page SHALL show
nothing about identity.

| Field | Meaning |
| --- | --- |
| Standing | `verified`, `expired`, or `unverified` |
| Valid until | The day the document behind a verified standing stops being valid; absent where it never expires or where the collector is not verified |
| The check's progress | Where the latest check the store raised for this account stands, in the states below; absent where none was raised |
| The bar | The order value and the bid value at which a verified identity is asked for, in the brand's currency |

| Progress | What the page offers |
| --- | --- |
| Invited, Started | Continue the check |
| Submitted, Stalled | Wait; the provider is deciding |
| Approved | Nothing; the standing says verified |
| Declined | Try again, or bring the document to a visit |
| Expired, Withdrawn | Verify again |

#### Scenario: grade10-site-store-account-identity-SC-01 - A verified collector sees they are verified and until when
**Serves:** grade10-site-store-account-identity-US-02 - Collector verified at a vault visit is recognised on the site

- **GIVEN** a collector whose standing is `verified` on a document that expires
- **WHEN** they open their account page
- **THEN** it says they are verified and the day their document stops being
  valid, and offers no check to start

#### Scenario: grade10-site-store-account-identity-SC-02 - A collector nobody verified sees the bar and how to verify
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose standing is `unverified`
- **WHEN** they open their account page
- **THEN** it says they are not verified, names the order value and the bid
  value at which a verified identity is asked for, and offers to verify

#### Scenario: grade10-site-store-account-identity-SC-03 - The account page carries no identity field
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector in any standing, with or without a check in progress
- **WHEN** their account page is read
- **THEN** no legal name, date of birth, document type, document number, mask,
  document image or provider finding is shown or answered to the page

#### Scenario: grade10-site-store-account-identity-SC-04 - A brand with no identity store shows nothing
**Serves:** Where the collector stands - a brand with no identity store shows nothing

- **GIVEN** a brand whose store is wired to no identity store
- **WHEN** a collector opens their account page
- **THEN** nothing about identity is shown, and no checkout or bid is held

### Requirement: A collector verifies from their account, on their explicit consent

The system SHALL let a signed-in collector verify from their account page as
follows, and SHALL start no check without the consent in step 2, recorded on
the check at the instant it is given.

1. *Collector* — **Opens their account page** and reads where they stand
2. *Collector* — **Reads what the provider will check** — their document and
   their face — what Grade10 keeps, that it counts across Grade10's services,
   and that they may ask for erasure; and **ticks their agreement**
3. *Collector* — **Presses verify**
4. *Grade10* — **Reuses a check the collector already passed** and says they
   are verified, without a ceremony; otherwise **raises a hosted check** for the
   account and **hands the collector to the provider's page** on the device
   they are on
5. *Provider* — **Decides**, on its own page and in its own time
6. *Grade10* — **Applies the verdict** under the identity store's two refusals,
   and the account page reads `verified`

An account SHALL hold one live check at a time; pressing verify while one is
live SHALL continue it, and while one is submitted SHALL start nothing new. A
collector whose standing is `expired` SHALL be able to verify again, and the
approved check SHALL displace the lapsed record. A declined collector SHALL be
able to try again and SHALL be told the counter is another way.

#### Scenario: grade10-site-store-account-identity-SC-05 - Nothing reaches the provider before the collector agrees
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector on their account page who has not ticked their agreement
- **WHEN** they try to verify
- **THEN** the verify action is not available, and no check is started with the
  provider

#### Scenario: grade10-site-store-account-identity-SC-06 - A collector verifies from their account and is recognised
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose standing is `unverified`
- **WHEN** they tick their agreement, press verify, complete the provider's
  check with a valid document, and the verdict is applied
- **THEN** the check records when they agreed, their account page reads
  `verified`, and a checkout or a bid above the bar proceeds for them

#### Scenario: grade10-site-store-account-identity-SC-07 - A collector verified at a vault visit is recognised without a ceremony
**Serves:** grade10-site-store-account-identity-US-02 - Collector verified at a vault visit is recognised on the site

- **GIVEN** a collector the vault verified, whose document is still valid
- **WHEN** they press verify on their account page
- **THEN** they are told they are verified, and no check is raised with the
  provider

#### Scenario: grade10-site-store-account-identity-SC-08 - A collector whose document lapsed verifies again
**Serves:** grade10-site-store-account-identity-US-02 - Collector verified at a vault visit is recognised on the site

- **GIVEN** a collector whose standing is `expired`
- **WHEN** they tick their agreement, press verify, and pass the provider's
  check on a current document
- **THEN** their standing reads `verified` on the new document

#### Scenario: grade10-site-store-account-identity-SC-09 - A check the provider is deciding is not started twice
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose latest check is Submitted or Stalled
- **WHEN** they open their account page
- **THEN** it says the provider is deciding and offers to check again, and
  pressing verify starts no second check

#### Scenario: grade10-site-store-account-identity-SC-10 - A declined collector may try again
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose latest check is Declined
- **WHEN** they open their account page
- **THEN** it says the check could not be completed online, names the counter
  as another way, shows no reason for the decline, and offers to try again
- **AND** trying again raises a new check

### Requirement: A verification from the account is erased with the account

The system SHALL, when a collector's account is erased, end any check still
live for the account, keep nothing on the check that names the person, release
the store's binding on the record so the identity store purges what nothing
else binds, and command the provider to erase its copies — the same steps
`grade10-site/e-kyc/identity-record` names for a case.

#### Scenario: grade10-site-store-account-identity-SC-11 - Erasing the account takes its check with it
**Serves:** Erasure - erasing the account takes its check with it

- **GIVEN** an account with a check in Started
- **WHEN** the account is erased
- **THEN** the check is ended, holds no invitation and no finding, the store
  binds no record for the account, and the provider is commanded to erase its
  copies
