## Feature set

- One account open
  - Auction standing: suspend from auctions and reinstate appear only with a handler, and confirm in the moderation dialog

## ADDED Requirements

### Requirement: The panel offers auction suspension only with a handler

`UserAccountPanel` SHALL offer suspending the account from auctions only when
the consumer supplies a handler for it, and reinstating only when the consumer
supplies a handler for that. It SHALL offer suspend or reinstate according to
the auction standing the consumer supplies, and never both.

The panel SHALL render auction standing, and the reason the consumer supplied
with it, apart from the account's platform standing. It SHALL NOT confirm
either move itself: it reports the move to the console, which confirms it in
`UserModerationDialog`. No export is added or renamed.

#### Scenario: shared-console-user-directory-SC-27 - Auction suspension appears only with a handler

- **WHEN** a console renders the panel without a suspend handler or a reinstate handler
- **THEN** the panel offers neither move
- **AND THEN** a console that supplies both sees suspend for an account not suspended and reinstate for one that is, never both

#### Scenario: shared-console-user-directory-SC-28 - Auction standing shows apart from a ban

- **GIVEN** an account the console supplies as suspended from auctions with a reason, and not banned
- **WHEN** the panel renders
- **THEN** it shows the auction suspension and its reason
- **AND THEN** it shows the account as not banned

#### Scenario: shared-console-user-directory-SC-29 - A suspension started in the panel is confirmed outside it

- **WHEN** an operator starts suspending an account from auctions in the panel
- **THEN** the panel reports the move and collects no confirmation of its own
- **AND THEN** nothing is reported as confirmed until the moderation dialog reports it
