# grade10-admin/console/user-directory Specification

## Purpose

The Grade10 admin page where an operator finds a person and reads or changes
their access: which accounts the directory offers, how one account is
addressed, the grants it resolves for that account, and where it hands the
operator on for everything access is not.

## Feature set

- The access desk
  - Where it sits: the production console entry named Users, opened with `user:list`
  - One account open: the panel holds the account the operator picked, beside the list they picked it from
  - Granted moves only: a move reaches the row or the panel only when the operator's grants allow it
  - Open erasure: ban and unban are not offered while erasure is filed
- Addressing an account
  - One address: the account's identifier in the page's address opens its panel
  - A view survives a paste: the search, the narrowing and the page position travel in the address
- Narrowing the directory
  - Elevated or users: accounts that hold an elevated role, a named elevated role, or none
  - Status and verification: banned or active, email verified or not
  - Elevated by default: Users opens on elevated accounts when the address names no roles narrowing
  - A search miss: the other Type as a link that keeps the query
- Grants an account holds
  - Resolved, not typed: the grants come from the shipped role mapping, so the page and the grants matrix never disagree
  - Elevated marked once: a grant the mapping marks elevated is marked once for the account
- Handing the operator on
  - Actions on the account: audit and loyalty with ban, unban, and erase — hand-offs first
  - The loyalty record: where a customer's points, tiers and redemptions are
  - What the account did: the account's own trail
- Activity
  - Timeline: when the account joined, and that it is banned when it is
  - Sessions: where it is signed in, when the operator may list them

## Requirements

### Requirement: Users is the console's access desk

The console SHALL offer a production page named Users, opened only by a
session holding `user:list`. It SHALL list the accounts that session may see,
offer the narrowing choices below, and open one account in a panel beside the
list without leaving the page.

The page SHALL offer a move on a row or in the panel only when the signed-in
session holds the grant that move needs: sessions and ending them with
`session:list` and `session:revoke`, ban and unban with `user:ban`, changing
roles with `user:set-role`, and erasure with `user:delete`. A move the session
does not hold the grant for SHALL NOT be offered. Changing roles SHALL be
offered on the signed-in operator's own account when they hold `user:set-role`,
subject to the same refusals as `shared/auth/users`.

#### Scenario: grade10-admin-console-user-directory-SC-01 - An operator opens an account beside the list
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** a signed-in operator who holds `user:list`
- **WHEN** they open Users and pick an account
- **THEN** that account opens in a panel beside the list
- **AND** the list they picked it from is still there

#### Scenario: grade10-admin-console-user-directory-SC-02 - A move the operator cannot make is not offered
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** a signed-in operator whose roles hold `user:list` and `user:ban` but not `user:set-role` or `user:delete`
- **WHEN** they open Users and an account
- **THEN** neither the row nor the panel offers changing roles or erasure
- **AND** both still offer ban or unban

#### Scenario: grade10-admin-console-user-directory-SC-15 - An operator may change their own roles
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** a signed-in operator who holds `user:set-role` and opens their own account
- **WHEN** they read the panel
- **THEN** the panel offers changing roles

### Requirement: An account has an address

The page SHALL open the account named by `user` in its address, showing that
account's panel without the operator searching again. The search text, the
narrowing in force, and the page position SHALL be carried in the address too,
so opening that address again shows the same view. When the address names no
roles narrowing, the page SHALL open on elevated accounts.

#### Scenario: grade10-admin-console-user-directory-SC-03 - An address opens one account
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** an operator who holds `user:list`
- **WHEN** they open the Users page at an address naming an account
- **THEN** that account's panel is open
- **AND** they did not have to search for it

#### Scenario: grade10-admin-console-user-directory-SC-04 - A view is handed to a colleague
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** an operator who has searched, narrowed the directory, and moved past the first page
- **WHEN** another operator who holds the same grants opens that address
- **THEN** they see the same search, the same narrowing, and the same page

#### Scenario: grade10-admin-console-user-directory-SC-12 - Users opens on elevated accounts
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an operator who holds `user:list`
- **WHEN** they open Users at an address that names no roles narrowing
- **THEN** the directory shows elevated accounts
- **AND** an account that holds no elevated role is not listed

### Requirement: The directory narrows to the accounts an operator means

The page SHALL offer these narrowing choices, and SHALL apply every one an
operator has chosen at the same time. Type is exclusive: Elevated or Users.
Roles is a single choice among elevated roles when Type is Elevated, and is
not choosable when Type is Users.

| Choice | Options |
| --- | --- |
| Type | Elevated, or Users |
| Roles | Any elevated role, or a named elevated role |
| Status | Banned, or active |
| Email | Verified, or not verified |

#### Scenario: grade10-admin-console-user-directory-SC-05 - An admin asks who holds a role
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an operator who holds `user:list`
- **WHEN** they narrow the directory to the accounts that hold `admin`
- **THEN** the directory shows those accounts and no others
- **AND** how many there are is stated

#### Scenario: grade10-admin-console-user-directory-SC-06 - An operator narrows by status and population
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an operator who holds `user:list`
- **WHEN** they narrow the directory to banned accounts under Users
- **THEN** every account shown is banned and holds no elevated role

#### Scenario: grade10-admin-console-user-directory-SC-13 - A search miss offers the other Type
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** an operator who holds `user:list` and a search that matches accounts only in the other Type
- **WHEN** the directory under the current Type is empty
- **THEN** the page offers a link to search that query in the other Type
- **AND** following it keeps the query and lists the matching accounts

#### Scenario: grade10-admin-console-user-directory-SC-14 - An open erasure withholds ban and unban
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an account with an erasure filed, and an operator who holds `user:ban`
- **WHEN** they open that account
- **THEN** neither the row nor the panel offers ban or unban
- **AND** the account still shows that erasure was requested

### Requirement: The panel shows the grants the account holds

The panel SHALL show the grants an account's roles carry, resolved from the
same role-to-permission mapping `grade10-admin/console/roles-and-permissions`
is derived from, so the two never disagree. A grant that mapping marks
elevated SHALL be marked elevated here, once for the account. Grant labels
SHALL NOT open Roles & Permissions. A role name on the account's identity
SHALL open that role on Roles & Permissions when the console supplies an
address for it and the operator may open that page.

#### Scenario: grade10-admin-console-user-directory-SC-07 - An account's grants are the mapping's
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an account whose roles are `support`
- **WHEN** an operator opens its panel
- **THEN** the grants shown are exactly the grants the mapping gives `support`
- **AND** each grant the mapping marks elevated is marked elevated once for the account

#### Scenario: grade10-admin-console-user-directory-SC-08 - A role opens on the grants page
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an operator who holds `user:set-role` and an account that holds `support`
- **WHEN** they open `support` from the account's identity
- **THEN** the Roles & Permissions page opens on that role (`?role=`)

### Requirement: The panel hands the operator on

The panel SHALL offer, for an account that holds no elevated role, that
person's loyalty record. It SHALL offer, for every account, what that account
has done, when the operator may read the trail. Those hand-offs SHALL sit
with ban, unban, and erase as the account's actions, with the hand-offs before
those standing moves. Neither hand-off SHALL be restated as its own record in
the panel.

#### Scenario: grade10-admin-console-user-directory-SC-09 - A customer's loyalty record is one move away
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** an account that holds no elevated role
- **WHEN** an operator opens its panel
- **THEN** the panel offers that person's loyalty record among its actions
- **AND** an account that holds an elevated role is not offered one

#### Scenario: grade10-admin-console-user-directory-SC-10 - What an account has done is one move away
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** any account in the directory
- **WHEN** an operator who may read the trail opens its panel
- **THEN** the panel offers what that account has done among its actions, ahead of ban, unban, or erase

### Requirement: The panel shows the account's timeline

The panel SHALL show when the account joined. When the account is banned, it
SHALL show that it is banned and the reason when one was supplied. It SHALL
NOT invent a ban time the directory did not return.

#### Scenario: grade10-admin-console-user-directory-SC-11 - An operator reads when the account joined
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** an account in the directory
- **WHEN** an operator opens its activity
- **THEN** they see when the account joined
- **AND** a banned account also shows that it is banned, with its reason when one was supplied
