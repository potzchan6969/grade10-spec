## Feature set

- The access desk
  - Auction standing: an operator holding `auction:moderate` suspends or reinstates an account's bidding from its panel

## ADDED Requirements

### Requirement: An operator suspends or reinstates an account's bidding from its panel

The account panel on Users SHALL offer suspending the account from auctions,
or reinstating it, only to a session holding `auction:moderate`. It SHALL
offer suspend for an account that is not suspended and reinstate for one that
is, and never both. A session without the grant SHALL NOT be offered either,
and Grade10 SHALL refuse either move on the server if it is attempted.

1. The operator opens the account's panel.
2. They choose to suspend from auctions, or to reinstate.
3. The console asks them to confirm. Suspending requires a reason; reinstating
   does not.
4. On confirming, the panel shows the account's new auction standing, and for
   a suspension the reason, who suspended, and when.

What a suspension does, and what reinstating lifts, is
`grade10-site/auction/bidder-suspension`.

The panel SHALL show auction standing apart from the account's platform ban.
Suspending SHALL NOT ban the account, and banning SHALL NOT suspend it.

#### Scenario: grade10-admin-console-user-directory-SC-16 - An operator suspends an account from its panel
**Serves:** grade10-admin-console-user-directory-US-03 - Operator suspends an account from auctions

- **GIVEN** an operator holding `user:list` and `auction:moderate`, and an account that is not suspended
- **WHEN** they open the account's panel, choose to suspend from auctions, give a reason, and confirm
- **THEN** the panel shows the account as suspended from auctions, with the reason, who suspended, and when
- **AND** the panel offers reinstate and not suspend
- **AND** the account's platform standing is unchanged

#### Scenario: grade10-admin-console-user-directory-SC-17 - Suspending cannot be confirmed without a reason
**Serves:** grade10-admin-console-user-directory-US-03 - Operator suspends an account from auctions

- **GIVEN** an operator holding `user:list` and `auction:moderate`
- **WHEN** they choose to suspend an account from auctions and give no reason
- **THEN** the suspension cannot be confirmed
- **AND** the account is not suspended

#### Scenario: grade10-admin-console-user-directory-SC-18 - An operator reinstates an account from its panel
**Serves:** grade10-admin-console-user-directory-US-03 - Operator suspends an account from auctions

- **GIVEN** an operator holding `user:list` and `auction:moderate`, and an account suspended for a missed payment deadline
- **WHEN** they open the account's panel, choose to reinstate, and confirm
- **THEN** the panel shows the account as not suspended from auctions
- **AND** the panel offers suspend and not reinstate

#### Scenario: grade10-admin-console-user-directory-SC-19 - An operator without the grant is not offered either move
**Serves:** grade10-admin-console-user-directory-US-03 - Operator suspends an account from auctions

- **GIVEN** an operator holding `user:list` but not `auction:moderate`
- **WHEN** they open the panel of a suspended account and of one that is not
- **THEN** neither panel offers suspend or reinstate
