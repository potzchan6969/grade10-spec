# grade10-site/store/account-identity Specification

## Purpose

A collector verifies their identity from their own account on the Grade10
site, on their own device, and is recognised as verified wherever Grade10
asks: at a bid at or above a bar, at a bid when an admin
requires it, and at a vault visit. An account Grade10 asks to verify its business does so
through the same page. The verification page says where they stand and never
who they are.

A **standing** is the identity store's answer for a person on the day it is
asked — verified, expired, or unverified — as `grade10-site/e-kyc/identity-record`
defines it. A **hosted check** is the provider's check as
`grade10-site/e-kyc/hosted-verification` defines it; here the store raises one
for an account, where the vault raises one for a case. The **bar** is the value
at or above which a bid asks for a verified person. Every bid is in USD, so
there is one bar. A checkout asks for no verified person at any value.
Grade10's is:

| Bar | Value |
| --- | --- |
| A bid | 1,500,000 USD minor units |

A **request** is an admin's requirement that an account verify a subject -
its `person` or its `business` - recorded with a reason, who required it and
when. A request is **met** while the account holds what it asks for, and
**unmet** otherwise. A **business verification** is a hosted check of the business an
account acts for, decided by the provider's reviewer. The **verification
page** is the collector's own page at `/verification`.

## Feature set

- Where the collector stands
  - Standing: verified until when, expired, being reviewed, or not yet, read from the identity store the day it is shown
  - The bar: the bid value at which a verified identity is asked for
  - Requests: what Grade10 asked the account to verify, never why
- Verifying from the account
  - Consent first: nothing reaches the provider until the collector has agreed on the page
  - The provider's page: the check happens on the provider's own page, on the collector's device
  - Reuse: a check passed for a vault visit counts here, and one passed here counts at the visit
- Screening
  - Every hosted check screened: watchlists and politically exposed people, a match decided by a reviewer
- Requests
  - Required by an admin: a person or a business, with a reason; dropped with none
- Business verification
  - On request only: the person first, then the provider's hosted business check
  - People behind the business: screened, linked accounts, or checked by the provider, per template
- What the page never shows
  - No identity field: no name, birth date, document type or number reaches the verification page
- Erasure
  - With the account: erasing the account ends its checks, drops its requests and lets the identity store's bindings go

## Requirements

### Requirement: The verification page shows where the collector stands, and nothing of who they are

The system SHALL show a signed-in collector, on their verification page, these
facts and no other about their identity. The standing SHALL be the identity
store's answer on the day the page is read, whichever product recorded the
check behind it. On a brand that deploys no identity store, or where identity is switched
off, the page SHALL show nothing about identity.

| Field | Meaning |
| --- | --- |
| Standing | `verified`, `expired`, or `unverified` |
| Valid until | The day the document behind a verified standing stops being valid; absent where it never expires or where the collector is not verified |
| The check's progress | Where the latest check the store raised for this account stands, in the states below; absent where none was raised |
| Being reviewed | Whether a reviewer at the provider holds that check |
| The bar | The bid bar |
| Requests | Each unmet request's subject, in the words: We asked you to verify your identity. or We asked you to verify your business.; never its reason |
| Business | The business card, under "The business card reads where the business stands" |

| Progress | What the page offers |
| --- | --- |
| Invited, Started | Continue the check |
| Submitted, Stalled | Wait; the provider is deciding, or a reviewer is |
| Approved | Nothing; the standing says verified |
| Declined | Try again, or bring the document to a visit |
| Expired, Withdrawn | Verify again |

<!-- trace:scenario id=g10.store-account-identity.SC-9f4 rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-01 - A verified collector sees they are verified and until when
**Serves:** grade10-site-store-account-identity-US-02 - Collector verified at a vault visit is recognised on the site

- **GIVEN** a collector whose standing is `verified` on a document that expires
- **WHEN** they open their verification page
- **THEN** it says they are verified and the day their document stops being
  valid, and offers no check to start

<!-- trace:scenario id=g10.store-account-identity.SC-ymn rev=3 -->
#### Scenario: grade10-site-store-account-identity-SC-02 - A collector nobody verified sees the bar and how to verify
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose standing is `unverified`
- **WHEN** they open their verification page
- **THEN** it says they are not verified, names the bid bar, and offers to
  verify

<!-- trace:scenario id=g10.store-account-identity.SC-zww rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-03 - The verification page carries no identity field
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector in any standing, with or without a check in progress
- **WHEN** their verification page is read
- **THEN** no legal name, date of birth, document type, document number, mask,
  document image or provider finding is shown or answered to the page

<!-- trace:scenario id=g10.store-account-identity.SC-vwo rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-04 - A brand with no identity store shows nothing
**Serves:** Where the collector stands - a brand with no identity store shows nothing

- **GIVEN** a brand whose store is wired to no identity store
- **WHEN** a collector opens their verification page
- **THEN** nothing about identity is shown, no bid is held, and
  no request can be made of the account

### Requirement: A collector verifies from their account, on their explicit consent

The system SHALL let a signed-in collector verify from their verification page as
follows, and SHALL start no check without the consent in step 2, recorded on
the check at the instant it is given.

1. *Collector* - **Opens their verification page** and reads where they stand
2. *Collector* - **Reads what the provider will check** - their document,
   their face, and their name against watchlists and lists of politically
   exposed people - what Grade10 keeps, that it counts across Grade10's
   services, and that they may ask for erasure; and **ticks their agreement**
3. *Collector* - **Presses verify**
4. *Grade10* - **Reuses a check the collector already passed** and says they
   are verified, without a ceremony; otherwise **raises a hosted check** for the
   account and **hands the collector to the provider's page** on the device
   they are on
5. *Provider* - **Decides**, on its own page and in its own time; a
   screening match waits for its reviewer
6. *Grade10* - **Applies the verdict** under the identity store's two refusals,
   and the verification page reads `verified`

An account SHALL hold one live check at a time; pressing verify while one is
live SHALL continue it, and while one is submitted SHALL start nothing new. A
collector whose standing is `expired` SHALL be able to verify again, and the
approved check SHALL displace the lapsed record. A declined collector SHALL be
able to try again and SHALL be told the counter is another way.

<!-- trace:scenario id=g10.store-account-identity.SC-ivu rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-05 - Nothing reaches the provider before the collector agrees
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector on their verification page who has not ticked their agreement
- **WHEN** they try to verify
- **THEN** the verify action is not available, and no check is started with the
  provider

<!-- trace:scenario id=g10.store-account-identity.SC-wjz rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-06 - A collector verifies from their account and is recognised
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose standing is `unverified`
- **WHEN** they tick their agreement, press verify, complete the provider's
  check with a valid document, and the verdict is applied
- **THEN** the check records when they agreed, their verification page reads
  `verified`, and a bid above the bar proceeds for them

<!-- trace:scenario id=g10.store-account-identity.SC-f7d rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-07 - A collector verified at a vault visit is recognised without a ceremony
**Serves:** grade10-site-store-account-identity-US-02 - Collector verified at a vault visit is recognised on the site

- **GIVEN** a collector the vault verified, whose document is still valid
- **WHEN** they press verify on their verification page
- **THEN** they are told they are verified, and no check is raised with the
  provider

<!-- trace:scenario id=g10.store-account-identity.SC-wb2 rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-08 - A collector whose document lapsed verifies again
**Serves:** grade10-site-store-account-identity-US-02 - Collector verified at a vault visit is recognised on the site

- **GIVEN** a collector whose standing is `expired`
- **WHEN** they tick their agreement, press verify, and pass the provider's
  check on a current document
- **THEN** their standing reads `verified` on the new document

<!-- trace:scenario id=g10.store-account-identity.SC-btr rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-09 - A check the provider is deciding is not started twice
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose latest check is Submitted or Stalled
- **WHEN** they open their verification page
- **THEN** it says the provider is deciding and offers to check again, and
  pressing verify starts no second check

<!-- trace:scenario id=g10.store-account-identity.SC-hx7 rev=2 -->
#### Scenario: grade10-site-store-account-identity-SC-10 - A declined collector may try again
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose latest check is Declined
- **WHEN** they open their verification page
- **THEN** it says the check could not be completed online, names the counter
  as another way, shows no reason for the decline, and offers to try again
- **AND** trying again raises a new check

### Requirement: Every hosted check is screened, and a match waits for a reviewer

The system SHALL have every hosted check the store raises screen the person
against watchlists and lists of politically exposed people. A check whose
screening matches SHALL wait for the provider's reviewer, who approves or
declines it, and SHALL NOT be stalled or expired while a reviewer holds it.
While a reviewer holds it the verification page SHALL say the check is being
reviewed and ask nothing of the collector. The screening finding, `matched`
or `clear`, SHALL be kept with the provider's findings and SHALL reach only
an operator holding `kyc:read`.

<!-- trace:scenario id=g10.store-account-identity.SC-v33 rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-12 - A screening match is reviewed before it is decided
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** a collector whose submitted check matched a watchlist
- **WHEN** they open their verification page while the provider's reviewer
  holds the check
- **THEN** it says the check is being reviewed, offers nothing to start, and
  shows no finding
- **AND** the check is neither stalled nor expired while the reviewer holds it

<!-- trace:scenario id=g10.store-account-identity.SC-ful rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-13 - The finding reaches an operator and never the collector
**Serves:** grade10-site-store-account-identity-US-01 - Collector verifies their identity from their account

- **GIVEN** an approved check whose screening is `clear`
- **WHEN** an operator holding `kyc:read` opens the account's Identity card,
  and the collector opens their verification page
- **THEN** the operator reads `clear` and the collector reads only that they
  are verified

### Requirement: An admin requires an account to verify, with a reason

The system SHALL let an operator holding `kyc:request` require an account to
verify its `person` or its `business`, with a reason, and SHALL record the
subject, the reason, who required it and when. An account SHALL hold at most
one request per subject; requiring it again SHALL answer the request already
there. A `business` request SHALL also require the `person`. A request SHALL
be judged met or unmet on the day it is read, from what the account holds,
and SHALL hold a bid and show on the verification page only while unmet; it
SHALL stand, met or unmet, until an operator holding `kyc:request` drops it.
A drop SHALL take no reason. A request SHALL NOT hold a checkout. Every
requirement and every drop SHALL be on the audit trail, naming the operator,
the account and the subject, and never the reason: the reason lives on the
request and goes with the account's erasure. The collector SHALL read that Grade10
asked them to verify their identity or their business, and never the reason.
Where identity is switched off, a request SHALL be refused and no request
SHALL be offered.

<!-- trace:scenario id=g10.store-account-identity.SC-kvf rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-14 - An admin requires a business and the person is asked too
**Serves:** grade10-site-store-account-identity-US-03 - Collector verifies when Grade10 asks

- **GIVEN** an unverified account and an operator holding `kyc:request`
- **WHEN** the operator requires the account's business with a reason
- **THEN** the account's verification page says: We asked you to verify
  your business.
- **AND** the business card asks the person to verify their identity first
- **AND** it shows no reason
- **AND** the audit trail names the operator, the account and the subject,
  and not the reason

<!-- trace:scenario id=g10.store-account-identity.SC-blc rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-15 - An operator without the grant cannot require a verification
**Serves:** grade10-site-store-account-identity-US-03 - Collector verifies when Grade10 asks

- **GIVEN** an operator holding `kyc:read` and not `kyc:request`
- **WHEN** they open an account's Identity card and try to require a
  verification
- **THEN** no move is offered and the request is refused

<!-- trace:scenario id=g10.store-account-identity.SC-lgf rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-16 - A dropped request asks nothing more
**Serves:** grade10-site-store-account-identity-US-03 - Collector verifies when Grade10 asks

- **GIVEN** an account with an unmet `person` request
- **WHEN** an operator holding `kyc:request` drops it, giving no reason
- **THEN** the verification page shows no request, and the drop is on the
  audit trail, naming the operator, the account and the subject

<!-- trace:scenario id=g10.store-account-identity.SC-ig1 rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-17 - A request is refused where identity is off
**Serves:** Requests - required by an admin

- **GIVEN** an environment where identity is switched off
- **WHEN** an operator holding `kyc:request` requires an account's person
- **THEN** the request is refused, nothing is recorded, and no move is
  offered on the Identity card

### Requirement: A business is verified on request, after its person

The system SHALL offer a business verification only to an account with a
`business` request, and SHALL start one only for an account whose person
holds a verified identity. The provider SHALL host the form, check the
business registry, screen the business and the people it names, and decide
through its reviewer. The account SHALL hold one live business check at a
time. On approval the store SHALL keep, through the identity store, the
business's legal name, registration number, country and registered address,
what the business template's way keeps of each named person, one
registration document as an image or a PDF, and the provider's findings. The
account SHALL hold its business while that record is bound, its review date
is ahead, its way's condition holds, and its person holds a verified
identity.

The business card SHALL read:

| The account | The card reads |
| --- | --- |
| No verified person | Verify your identity first, and nothing else |
| No business on file | Not verified, and offers to verify the business |
| A business check a reviewer holds | Being reviewed |
| A record bound and a named person not yet linked to a verified account | Waiting for the people named, each marked verified or waiting, with an invite link for each one waiting |
| A business held | Verified, until its review date |
| A record whose review date has passed | Due for review, and offers to verify the business again |
| The latest business check declined | Declined, and offers to try again; no reason |

<!-- trace:scenario id=g10.store-account-identity.SC-c0q rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-18 - The business waits for the person
**Serves:** grade10-site-store-account-identity-US-04 - Collector verifies the business they act for

- **GIVEN** an account with a `business` request and no verified person
- **WHEN** the collector tries to start the business check
- **THEN** no business check is raised, and the card asks them to verify
  their identity first

<!-- trace:scenario id=g10.store-account-identity.SC-avx rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-19 - An approved business meets the request
**Serves:** grade10-site-store-account-identity-US-04 - Collector verifies the business they act for

- **GIVEN** a verified person with an unmet `business` request
- **WHEN** they complete the provider's business form and its reviewer
  approves it
- **THEN** the business card reads verified until its review date, the
  request is met, and the verification page no longer says we asked

### Requirement: The people behind a business are judged one of three ways, per template

The system SHALL judge the people a business names in the way its business
template is configured to, from this closed set:

| Way | Each named person | The store keeps of each | The business holds when |
| --- | --- | --- | --- |
| `screen` | Screened by the provider; the reviewer judges who may act | Name, role, share of ownership, screening outcome | The record is bound |
| `accounts` | Invited by a link from the business card to sign in to their own Grade10 account and verify it as a person | Name as the provider lists it, and the link to their account once they accept | The record is bound and every named person is linked to an account holding a verified identity |
| `provider` | Checked by the provider's own identity check | Name, role, share of ownership, and their check's outcome, inside the business record | The record is bound, with each person's outcome inside it |

Under `accounts` the store SHALL keep nothing else about a named person: what
proves them is their own account's identity. Under `provider` a named person
who holds no account SHALL be erased by an operator redacting the business
record.

<!-- trace:scenario id=g10.store-account-identity.SC-v8b rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-20 - A business waits for every named person to verify
**Serves:** grade10-site-store-account-identity-US-04 - Collector verifies the business they act for

- **GIVEN** a business template set to `accounts`, an approved business naming
  two people, and one of them linked to a verified account
- **WHEN** the account's business is read
- **THEN** it is not held, and the business card offers the invite link for
  the person still missing
- **AND** once that person links a verified account, the business is held

### Requirement: A verification from the account is erased with the account

The system SHALL, when a collector's account is erased, end every check still
live for the account, person and business alike, keep nothing on a check that
names the person, delete the account's requests, release the store's bindings
on both records so the identity store purges what nothing else binds, and
command the provider to erase its copies - the same steps
`grade10-site/e-kyc/identity-record` names for a case.

<!-- trace:scenario id=g10.store-account-identity.SC-y9w rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-11 - Erasing the account takes its check with it
**Serves:** Erasure - erasing the account takes its check with it

- **GIVEN** an account with a check in Started
- **WHEN** the account is erased
- **THEN** the check is ended, holds no invitation and no finding, the store
  binds no record for the account, and the provider is commanded to erase its
  copies

<!-- trace:scenario id=g10.store-account-identity.SC-nnd rev=1 -->
#### Scenario: grade10-site-store-account-identity-SC-21 - Erasing the account takes its business and its requests
**Serves:** Erasure - erasing the account takes its check with it

- **GIVEN** an account with a bound business, a business check in Started and
  an unmet `person` request
- **WHEN** the account is erased
- **THEN** both bindings are released, the business check is ended, the
  request is gone, and the provider is commanded to erase its copies
