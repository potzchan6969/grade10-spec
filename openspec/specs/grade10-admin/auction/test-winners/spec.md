# grade10-admin/auction/test-winners Specification

## Purpose

Lets an operator, outside production, make in one step a test account that
has won a closed sandbox lot, and sign in as it with the ordinary sign-in
link, so QA walks a winner's order by hand as a real winner would.

## Feature set

- Making a test winner
  - One step: an account at the operator's own tagged address, a sandbox lot closed through the real close, and its auction order with its letters
  - Outside production: local, staging, staging-2 and UAT; production answers as if the action did not exist, and its console carries none of it
  - Own inbox: the address is the operator's own with a `+` tag, `+qa-<code>` by default, so every letter reaches them
  - Past close: a close up to 30 days back, so an order can start already overdue
  - One per address: the same address makes one test winner, and an address holding a verified account is refused
  - Never biddable: the lot is closed from the moment it is made
- Test winner sign-in
  - Ordinary link: the sign-in email every collector gets, sent after making and again on request, opening the order
  - Private window: the operator opens it apart from their own session
- Test winner panel
  - List: every test winner's order, newest first, with its email, lot, status and when it was made
  - Worked as any order: Open order leads to Orders, where it is cancelled like any other, and the lot stays closed

## Requirements

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
| Winning bid | Above zero |
| Currency | USD, HKD or JPY, per `grade10-admin/auction/listing` |
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

<!-- trace:scenario id=g10adm.auction-test-winners.SC-pxq rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-11 - One action makes a winner waiting on setup
**Serves:** Making a test winner - from nothing to an order that waits on the winner

- **GIVEN** an operator on staging holding `auction:operate` and
  `user:create`, signed in as `qa.lead@grade10.com`
- **WHEN** they make a test winner with the default email, the name
  "QA Winner" and a winning bid of 100000 minor units in HKD
- **THEN** an account exists at `qa.lead+qa-<code>@grade10.com` that has not
  signed in
- **AND** it holds an auction order in Awaiting Setup for a closed sandbox lot
  titled `Test lot <code>`, won at 100000 minor units in HKD
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

### Requirement: A test winner signs in with the ordinary link

QA signs in as a test winner the way every collector signs in.

**The link** - Once a test winner is made, the console SHALL email its address
the sign-in link every collector gets, per `shared/auth/sign-in`, set to open
the test winner's order on the site. Each row under Winners SHALL offer
**Email sign-in link** to send a new one, under the same rules.

**Private window** - Winners SHALL say to open the link in a private window,
so the operator's own session stays signed in. The link and the order's
letters reach the operator's own inbox, since the address is theirs with a
tag.

<!-- trace:scenario id=g10adm.auction-test-winners.SC-90p rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-20 - The emailed link opens the test winner's order
**Serves:** Test winner sign-in - QA signs in as the winner from their own inbox

- **GIVEN** a test winner just made on staging
- **WHEN** the operator opens the sign-in link from their inbox in a private
  window
- **THEN** the window is signed in as the test account
- **AND** it shows the test winner's order in Awaiting Setup

<!-- trace:scenario id=g10adm.auction-test-winners.SC-3rj rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-21 - Email sign-in link sends a new link
**Serves:** Test winner sign-in - a lapsed link is replaced from the panel

- **GIVEN** a test winner whose last sign-in link has lapsed
- **WHEN** the operator chooses Email sign-in link on its row
- **THEN** a new sign-in link reaches the operator's inbox
- **AND** it signs in as the test account and opens its order

### Requirement: The Test tab lists test winners

The test winners made outside production are listed in one place and worked
as any order is.

**The list** - Winners SHALL list the orders of test winners, newest first,
each with its email, its lot, its order status and when it was made, with
**Open order**, which opens it in Orders per
`grade10-admin/auction/post-sale`, and **Email sign-in link**.

**Worked as any order** - A test winner's order SHALL be worked like any
other, cancelling included, per `grade10-admin/auction/post-sale`, and its lot
stays closed. Winners SHALL offer no cancel or delete of its own, and a
cancelled test winner stays listed.

**Access** - The list and its actions SHALL need the same access as making a
test winner. Without it, Winners SHALL name the access it needs and show
nothing else.

<!-- trace:scenario id=g10adm.auction-test-winners.SC-qra rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-22 - Winners lists test winners newest first
**Serves:** Test winner panel - every test winner and where its order stands

- **GIVEN** a test winner made yesterday whose order was cancelled, and one
  made today in Awaiting Setup
- **WHEN** an operator opens Winners in the Test tab
- **THEN** it lists today's first, then yesterday's reading Cancelled
- **AND** each shows its email, its lot, its order status and when it was
  made, with Open order and Email sign-in link
- **AND** Open order opens that order in Orders

<!-- trace:scenario id=g10adm.auction-test-winners.SC-xvn rev=1 -->
#### Scenario: grade10-admin-auction-test-winners-SC-23 - Without both grants Winners names the access it needs
**Serves:** Test winner panel - only an operator who may also create accounts

- **GIVEN** an operator on staging holding `auction:operate` without
  `user:create`
- **WHEN** they open Winners in the Test tab
- **THEN** it names the access it needs and shows no list or control
- **AND** Grade10 refuses a test winner they request
