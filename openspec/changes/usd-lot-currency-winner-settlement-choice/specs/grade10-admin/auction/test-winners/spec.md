# grade10-admin/auction/test-winners Specification

## Purpose

Lets an operator, outside production, make in one step a test account that
has won a closed sandbox lot, and sign in as it with the ordinary sign-in
link, so QA walks a winner's order by hand as a real winner would.

## Feature set

- Making a test winner
  - USD bid: the sandbox lot and winning bid use USD only
  - Normal winner setup: the winner chooses USD or HKD and an offered payment method, with nothing preselected
  - Atomic refusal: a non-USD bid currency refuses the action without creating an account, lot or order

## MODIFIED Requirements

### Requirement: An operator makes a test winner in one step

Outside production, one action makes a winner whose order QA walks as a real
winner would.

**Where** - Grade10 SHALL offer the action under Winners, in the auction
console's Test tab:

| Where | The action |
| --- | --- |
| Local, staging, staging-2, UAT | Offered |
| Production, or any other lane, a preview included | Absent: Grade10 answers it as if it did not exist |

The console built for production SHALL carry neither the Test tab nor its
code.

**Who** - The action SHALL need both `auction:operate` and `user:create`, per
`shared/auth/roles`.

**What the operator gives**

| Field | Rule |
| --- | --- |
| Email | The operator's own sign-in address with a `+` tag, checked by Grade10; `<local>+qa-<code>@<domain>` by default, `<code>` new for each test winner |
| Name | Required; the account's name |
| Winning bid | Whole major units in USD, above zero |
| Currency | USD only, per `grade10-admin/auction/listing` |
| Closed at | Now by default, or a past moment up to 30 days back |

**What it makes** - One action SHALL:

1. Make an account at that email, with that name, that has not signed in. An
   address that already holds a verified account SHALL be refused, so a test
   winner never takes over an account in use.
2. Make a sandbox lot titled `Test lot <code>` with that account's bid at the
   winning amount, and close it at the close time through the close every lot
   takes, so its auction order and its letters are the real ones, per
   `grade10-site/auction/winner-order` and
   `grade10-site/auction/notifications-order`.

**One per address** - The same address SHALL make one test winner: asked
again, Grade10 SHALL return the order that address already has and make
nothing twice.

**Never biddable** - The lot SHALL be closed from the moment it is made, so it
takes no bid. It lists as any closed sandbox lot does.

The successful test winner SHALL use ordinary winner setup. The order SHALL
offer USD or HKD and the payment choices offered for that currency, with
neither currency nor method preselected.

<!-- trace:scenario id=g10adm.auction-test-winners.SC-pxq rev=2 -->
#### Scenario: grade10-admin-auction-test-winners-SC-11 - One action makes a winner waiting on setup
**Serves:** Making a test winner - from nothing to an order that waits on the winner

- **GIVEN** an operator on staging holding `auction:operate` and
  `user:create`, signed in as `qa.lead@grade10.com`
- **WHEN** they make a test winner with the default email, the name
  "QA Winner" and a winning bid of 100000 minor units in USD
- **THEN** an account exists at `qa.lead+qa-<code>@grade10.com` that has not
  signed in
- **AND** it holds an auction order in Awaiting Setup for a closed sandbox lot
  titled `Test lot <code>`, won at 100000 minor units in USD
- **AND** order setup offers USD or HKD and the offered payment choices, with
  neither currency nor payment method selected
- **AND** the auction-won letter reaches that address

<!-- trace:scenario id=g10adm.auction-test-winners.SC-wfn rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-12 - Production answers as if the action did not exist
**Serves:** Making a test winner - never where real collectors bid

- **GIVEN** an operator in production holding `auction:operate` and
  `user:create`
- **WHEN** a test winner is requested
- **THEN** Grade10 answers as if the action did not exist
- **AND** no account, lot or order is made

<!-- trace:scenario id=g10adm.auction-test-winners.SC-kfc rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-13 - The production console carries no Test tab
**Serves:** Making a test winner - the console shipped to production leaves it out

- **GIVEN** the admin console built for production
- **WHEN** an operator holding `auction:operate` and `user:create` opens
  Auction
- **THEN** no Test tab is offered
- **AND** the console's code carries none of the Test tab's code

<!-- trace:scenario id=g10adm.auction-test-winners.SC-ibc rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-14 - An address other than the operator's own tagged one is refused
**Serves:** Making a test winner - letters only ever reach the operator

- **GIVEN** an operator on staging signed in as `qa.lead@grade10.com`
- **WHEN** they make a test winner at `someone@example.com`, or at
  `qa.lead@grade10.com` with no tag
- **THEN** Grade10 refuses each
- **AND** no account, lot or order is made

<!-- trace:scenario id=g10adm.auction-test-winners.SC-0fh rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-15 - An address holding a verified account is refused
**Serves:** Making a test winner - a test winner never takes over an account in use

- **GIVEN** an account at `qa.lead+qa-7kq2@grade10.com` that has signed in
- **WHEN** the operator makes a test winner at that address
- **THEN** Grade10 refuses it, saying the address already holds an account
- **AND** no lot or order is made

<!-- trace:scenario id=g10adm.auction-test-winners.SC-qka rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-16 - The same address makes one test winner
**Serves:** Making a test winner - a repeated request returns the first

- **GIVEN** a test winner made at `qa.lead+qa-7kq2@grade10.com` whose account
  has not signed in
- **WHEN** the operator makes a test winner at that address again
- **THEN** Grade10 returns the same order
- **AND** one account, one lot and one order exist for that address

<!-- trace:scenario id=g10adm.auction-test-winners.SC-9cm rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-17 - A close in the past opens an order already overdue
**Serves:** Making a test winner - QA reaches a missed deadline without waiting

- **GIVEN** an operator on staging at 2026-09-29T10:00:00Z
- **WHEN** they make a test winner closed at 2026-09-26T10:00:00Z
- **THEN** its order reads Setup Overdue

<!-- trace:scenario id=g10adm.auction-test-winners.SC-fb4 rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-18 - A close beyond 30 days back or in the future is refused
**Serves:** Making a test winner - a close QA can reach, and no further

- **GIVEN** an operator on staging at 2026-09-29T10:00:00Z
- **WHEN** they make a test winner closed at 2026-08-30T09:59:00Z, or at
  2026-09-29T11:00:00Z
- **THEN** Grade10 refuses each
- **AND** no account, lot or order is made

<!-- trace:scenario id=g10adm.auction-test-winners.SC-y07 rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-19 - The test lot takes no bid, its order cancelled or not
**Serves:** Making a test winner - the sandbox lot is never open to bids

- **GIVEN** two test winners' sandbox lots, one whose order was cancelled
- **WHEN** a collector places a bid on each
- **THEN** Grade10 refuses both bids
- **AND** each lot is still closed with its winning bid unchanged

<!-- trace:scenario id=g10adm.auction-test-winners.SC-bf3 rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-25 - The test-winner form offers USD only
**Serves:** Making a test winner - the form supplies the only supported bid currency

- **GIVEN** an operator on staging opens the test-winner action
- **WHEN** they enter the winning bid
- **THEN** the currency is fixed to USD
- **AND** the form offers no HKD or JPY choice

<!-- trace:scenario id=g10adm.auction-test-winners.SC-yx8 rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-24 - A non-USD test-winner request is refused atomically
**Serves:** Making a test winner - the action accepts only a USD bid

- **GIVEN** an operator on staging holding `auction:operate` and
  `user:create`
- **WHEN** they request a test winner with an HKD, JPY or other non-USD
  winning-bid currency
- **THEN** Grade10 refuses the action
- **AND** no account, lot or order is created
