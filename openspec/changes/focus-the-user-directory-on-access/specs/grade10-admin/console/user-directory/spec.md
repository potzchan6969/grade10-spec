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
- Addressing an account
  - One address: the account's identifier in the page's address opens its panel
  - A view survives a paste: the search, the narrowing and the page position travel in the address
- Narrowing the directory
  - Operator or customer: the accounts that hold an operator role, a named role, or none
  - Standing and verification: banned or not, email verified or not
- Grants an account holds
  - Resolved, not typed: the grants come from the shipped role mapping, so the page and the grants matrix never disagree
  - Elevated marked: a grant the mapping marks elevated is marked here
- Handing the operator on
  - The loyalty record: where a customer's points, tiers and redemptions are
  - What the account did: the account's own trail

## ADDED Requirements

### Requirement: Users is the console's access desk

The console SHALL offer a production page named Users, opened only by a
session holding `user:list`. It SHALL list the accounts that session may see,
offer the narrowing choices below, and open one account in a panel beside the
list without leaving the page.

The page SHALL offer a move on a row or in the panel only when the signed-in
session holds the grant that move needs: sessions and ending them with
`session:list` and `session:revoke`, ban and unban with `user:ban`, changing
roles with `user:set-role`, and erasure with `user:delete`. A move the session
does not hold the grant for SHALL NOT be offered.

#### Scenario: grade10-admin-console-user-directory-SC-01 - An operator opens an account beside the list

- **GIVEN** a signed-in operator who holds `user:list`
- **WHEN** they open Users and pick an account
- **THEN** that account opens in a panel beside the list
- **AND** the list they picked it from is still there

#### Scenario: grade10-admin-console-user-directory-SC-02 - A move the operator cannot make is not offered

- **GIVEN** a signed-in operator whose roles hold `user:list` and `user:ban` but not `user:set-role` or `user:delete`
- **WHEN** they open Users and an account
- **THEN** neither the row nor the panel offers changing roles or erasure
- **AND** both still offer ban or unban

### Requirement: An account has an address

The page SHALL open the account named by `user` in its address, showing that
account's panel without the operator searching again. The search text, the
narrowing in force, and the page position SHALL be carried in the address too,
so opening that address again shows the same view.

#### Scenario: grade10-admin-console-user-directory-SC-03 - An address opens one account

- **GIVEN** an operator who holds `user:list`
- **WHEN** they open the Users page at an address naming an account
- **THEN** that account's panel is open
- **AND** they did not have to search for it

#### Scenario: grade10-admin-console-user-directory-SC-04 - A view is handed to a colleague

- **GIVEN** an operator who has searched, narrowed the directory, and moved past the first page
- **WHEN** another operator who holds the same grants opens that address
- **THEN** they see the same search, the same narrowing, and the same page

### Requirement: The directory narrows to the accounts an operator means

The page SHALL offer these narrowing choices, and SHALL apply every one an
operator has chosen at the same time.

| Choice   | Options                                                       |
| -------- | ------------------------------------------------------------- |
| Holds    | Any operator role, a named operator role, or no operator role |
| Standing | Banned, or not banned                                         |
| Email    | Verified, or not verified                                     |

#### Scenario: grade10-admin-console-user-directory-SC-05 - An admin asks who holds a role

- **GIVEN** an operator who holds `user:list`
- **WHEN** they narrow the directory to the accounts that hold `admin`
- **THEN** the directory shows those accounts and no others
- **AND** how many there are is stated

#### Scenario: grade10-admin-console-user-directory-SC-06 - An operator narrows by standing and population

- **GIVEN** an operator who holds `user:list`
- **WHEN** they narrow the directory to banned accounts that hold no operator role
- **THEN** every account shown is banned and holds no operator role

### Requirement: The panel shows the grants the account holds

The panel SHALL show the grants an account's roles carry, resolved from the
same role-to-permission mapping `grade10-admin/console/roles-and-permissions`
is derived from, so the two never disagree. A grant that mapping marks
elevated SHALL be marked elevated here. Each grant SHALL open that grant on
the Roles & Permissions page for an operator who may open it.

#### Scenario: grade10-admin-console-user-directory-SC-07 - An account's grants are the mapping's

- **GIVEN** an account whose roles are `support`
- **WHEN** an operator opens its panel
- **THEN** the grants shown are exactly the grants the mapping gives `support`
- **AND** each grant the mapping marks elevated is marked elevated

#### Scenario: grade10-admin-console-user-directory-SC-08 - A grant opens on the grants page

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they open a grant from an account's panel
- **THEN** the Roles & Permissions page opens on that grant

### Requirement: The panel hands the operator on

The panel SHALL offer, for an account that holds no operator role, that
person's loyalty record. It SHALL offer, for every account, what that account
has done. Neither SHALL be restated in the panel.

#### Scenario: grade10-admin-console-user-directory-SC-09 - A customer's loyalty record is one move away

- **GIVEN** an account that holds no operator role
- **WHEN** an operator opens its panel
- **THEN** the panel offers that person's loyalty record
- **AND** an account that holds an operator role is not offered one

#### Scenario: grade10-admin-console-user-directory-SC-10 - What an account has done is one move away

- **GIVEN** any account in the directory
- **WHEN** an operator who may read the trail opens its panel
- **THEN** the panel offers what that account has done
