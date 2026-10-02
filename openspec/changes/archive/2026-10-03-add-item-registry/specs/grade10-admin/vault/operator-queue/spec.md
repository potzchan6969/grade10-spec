# grade10-admin/vault/operator-queue Specification

## Feature set

- One case
  - The item's facts: once the item is registered, the Case tab reads and
    edits the register's facts, and the collector's request stays as sent
  - A known slab: a slab named by grader, grade and cert when a case first
    names it takes the item the register knows rather than a second
  - The customer's own slab: the form fills its category and title only when
    the register's owner is the customer at the counter

## ADDED Requirements

### Requirement: The Case tab reads the item's facts from the register

Once the register holds a case's item, the Case tab SHALL show the register's
category, title, description, grader, grade and cert in place of the
request's, linking the item, and the collector's request SHALL stay readable as
they sent it.

- **Pending** - until the register holds the item, the section SHALL say the
  item is registered when the valuation starts.
- **Edit** - Edit SHALL open the register's own edit, with its refusals, for a
  holder of `inventory:write`; a `vault:read` holder without it SHALL read
  the facts with no Edit. The worker SHALL refuse the edit without
  `inventory:write`.
- **Without the register's read** - for a `vault:read` holder without
  `inventory:read`, such as the treasurer, the section SHALL name
  `inventory:read` and show no facts, and the rest of the tab SHALL stand.
- **Unreachable** - where the register cannot be read, the section SHALL show
  its own error with a retry, and the rest of the tab SHALL stand.

#### Scenario: grade10-admin-vault-operator-queue-SC-83 - The section says registration is pending until the valuation starts
**Serves:** grade10-admin-vault-operator-queue-US-21 - staff read a case the register does not hold yet

- **GIVEN** a submitted case nobody has started valuing
- **WHEN** staff open its Case tab
- **THEN** the item's facts section says the item is registered when the valuation starts

#### Scenario: grade10-admin-vault-operator-queue-SC-84 - The register's facts stand in for the request's
**Serves:** grade10-admin-vault-operator-queue-US-21 - staff read one story about the item on the case

- **GIVEN** a case whose collector asked about "Charizard card", now registered as "Charizard 1999 Base Set" with PSA `10` and cert `12345678`
- **WHEN** staff open its Case tab
- **THEN** the section shows the register's category, title, description, PSA, `10` and `12345678`, linking the item
- **AND** the collector's request still reads "Charizard card", as they sent it

#### Scenario: grade10-admin-vault-operator-queue-SC-85 - Editing the facts needs the register's write grant
**Serves:** grade10-admin-vault-operator-queue-US-21 - staff correct the slab's cert from the case

- **GIVEN** a case whose item is registered
- **WHEN** staff holding `inventory:write` choose Edit and correct the cert
- **THEN** the register's edit opens, and the section shows the corrected cert once it lands
- **AND** an operator holding `vault:read` without `inventory:write` reads the facts with no Edit, and an edit sent anyway is refused by name

#### Scenario: grade10-admin-vault-operator-queue-SC-86 - A register that cannot be read leaves the case standing
**Serves:** grade10-admin-vault-operator-queue-US-21 - staff work the case while the register is down

- **GIVEN** a registered case, and the register not answering
- **WHEN** staff open its Case tab
- **THEN** the item's facts section shows its own error with a retry
- **AND** the case's acts and timeline stand

#### Scenario: grade10-admin-vault-operator-queue-SC-94 - A treasurer's Case tab names the register's grant
**Serves:** grade10-admin-vault-operator-queue-US-21 - a treasurer reading a case to pay against it is not shown who owns which item

- **GIVEN** a registered case, and a treasurer, who holds `vault:read` and no inventory grant
- **WHEN** they open its Case tab
- **THEN** the item's facts section names `inventory:read` and shows no facts
- **AND** the rest of the tab stands

### Requirement: A slab the register knows is taken rather than typed again

The first time staff name a case's slab - opening a walk-in's draft, or
starting the valuation of a case that has not named one - staff SHALL be able
to name it by its grader, grade and cert, all three given together or none,
and the vault SHALL look the grader and cert up in the register, the cert
trimmed and in capitals, while the form keeps what was typed. Taking an item
SHALL link the case to it and SHALL leave the collector's request as they
sent it:

| The register answers | The case |
| --- | --- |
| A live item the customer at the counter owns, no other case marks | takes that item, its facts read-only and corrected on the Case tab; on a walk-in the form fills the category and title from the register, and the collector's edits to the draft touch only its photos and description |
| A live item under another owner | takes that item and fills nothing, naming its owner by name for a holder of `kyc:read`, the read on the audit log, and by its short id otherwise; Prepare documents is refused until the owners match |
| A live item another case marks | is refused, naming and linking that case; that mark is closed first |
| A retired item | reads it as retired, and registers a new item with the pair when the valuation starts |
| Nothing | fills nothing, and registers a new item with the grader, grade and cert when the valuation starts |

While the lookup runs the form SHALL say so; where the register cannot be
asked, the form SHALL show an error with a retry and keep what was typed.

#### Scenario: grade10-admin-vault-operator-queue-SC-87 - A walk-in's slab the register knows is taken
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff take in a slab a collector brought before

- **GIVEN** a live item with PSA `12345678` owned by the customer at the counter, which no case marks
- **WHEN** staff type PSA and ` 12345678 ` on the walk-in form
- **THEN** the form says it is looking the slab up, then shows the register's facts read-only and fills the category and title from them
- **WHEN** staff open the draft
- **THEN** the case takes that item, and its Case tab reads the item's facts

#### Scenario: grade10-admin-vault-operator-queue-SC-88 - An unknown slab is registered when the valuation starts
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff take in a slab the register has never seen

- **GIVEN** no item with PSA `87654321`
- **WHEN** staff open a walk-in's draft naming PSA, grade `9` and `87654321`, and later start its valuation
- **THEN** the form fills nothing, and the item registered at the start carries PSA, `9` and `87654321`
- **AND** a slab given with a grader and cert and no grade is refused by name

#### Scenario: grade10-admin-vault-operator-queue-SC-89 - A retired slab reads as retired
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff type a slab whose old record was retired

- **GIVEN** a retired item with PSA `12345678` and no live one
- **WHEN** staff type PSA and `12345678` on the walk-in form
- **THEN** the form reads the slab as retired, and a new item is registered when the valuation starts

#### Scenario: grade10-admin-vault-operator-queue-SC-90 - A slab under another owner is taken and named
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff learn at the counter that the slab is registered to someone else

- **GIVEN** a live item with PSA `12345678` owned by another account, which no case marks
- **WHEN** staff holding `kyc:read` type PSA and `12345678` on the walk-in form
- **THEN** the form shows the item, naming its owner, fills nothing, and the audit log records the read
- **AND** for staff without `kyc:read` it names the owner by short id
- **AND** the case takes the item, and Prepare documents is refused until the owners match

#### Scenario: grade10-admin-vault-operator-queue-SC-91 - A slab another case marks is refused
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff cannot take in a slab the vault already keeps

- **GIVEN** a live item with PSA `12345678` the vault marks for case `K7P2QX`
- **WHEN** staff open a walk-in's draft naming PSA and `12345678`
- **THEN** it is refused, naming and linking `K7P2QX`, and no case is opened

#### Scenario: grade10-admin-vault-operator-queue-SC-92 - A lookup that cannot reach the register keeps the form
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff retry the lookup without typing the customer again

- **GIVEN** the register not answering
- **WHEN** staff type a grader and cert on the walk-in form
- **THEN** the form shows an error with a retry and keeps everything typed

#### Scenario: grade10-admin-vault-operator-queue-SC-93 - Starting a valuation names the slab the same way
**Serves:** grade10-admin-vault-operator-queue-US-20 - staff name the slab of a request sent from a phone when they start valuing it

- **GIVEN** a submitted case that has named no slab, and a live item with PSA, `10` and `12345678` no case marks
- **WHEN** staff start its valuation naming PSA, `10` and `12345678`
- **THEN** the case takes that item rather than registering a second, and the collector's request stays as they sent it
