# grade10-site/vault/case-lifecycle Specification

## Feature set

- Moving a case
  - The register told: starting the valuation registers the item, vaulting
    marks it, and release, unwind and forfeit close the mark, a forfeit
    naming the lender
  - The owner on the register: preparing documents is refused while the
    register names an owner other than the case's collector

## ADDED Requirements

### Requirement: The item register is told what the case does with the item

The vault SHALL tell the item register about the case's item as part of the
move that does it, and SHALL never wait on the register to commit a move:

| Move | The register is told |
| --- | --- |
| Starting the valuation | the item is registered under the case's collector, with the case's category, title, description and any slab staff named |
| Confirming the item vaulted | the vault marks the item |
| Release, and unwinding from the vault | the vault's mark ends |
| Forfeiture | the vault's mark ends, and the item belongs to the lender |

- **Owed with the move** - what the register is told SHALL be recorded in the
  move's own transaction and delivered until the register has it, each word
  once and in the order the moves happened.
- **Nothing else** - a corrected advance, a corrected repayment, a move
  between lockers and every move before the valuation SHALL tell the register
  nothing.

#### Scenario: grade10-site-vault-case-lifecycle-SC-41 - Starting the valuation registers the item
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff start valuing a request and the register gains the item

- **GIVEN** a submitted case from collector Ana Wong for a trading card titled "Charizard card"
- **WHEN** staff start its valuation
- **THEN** the register holds a trading card titled "Charizard card" owned by Ana Wong, not marked

#### Scenario: grade10-site-vault-case-lifecycle-SC-42 - Vaulting marks the item, and release ends the mark
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff put the item in a locker and later hand it back

- **GIVEN** a case whose item is registered
- **WHEN** staff confirm it vaulted
- **THEN** the register reads the item as marked by the vault for that case
- **WHEN** the item is later released, or the case unwound from the vault
- **THEN** the vault's mark is closed and the owner is unchanged

#### Scenario: grade10-site-vault-case-lifecycle-SC-43 - A forfeit hands the item to the lender
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff forfeit a late loan's collateral

- **GIVEN** an active case whose item the vault marks, owned by the collector
- **WHEN** staff forfeit the case
- **THEN** the vault's mark is closed and the register reads the lender as the item's owner, moved by the vault on that case

#### Scenario: grade10-site-vault-case-lifecycle-SC-44 - A move never waits on the register
**Serves:** Moving a case - the counter keeps working while the register is down

- **GIVEN** the register not answering
- **WHEN** staff confirm an item vaulted
- **THEN** the case is `vaulted` at once
- **AND** the register reads the item as marked once it answers again, and no word is told twice

#### Scenario: grade10-site-vault-case-lifecycle-SC-45 - A corrected advance tells the register nothing
**Serves:** Moving a case - a money correction is not a custody fact

- **GIVEN** an active case whose item the vault marks
- **WHEN** its advance is taken back and the case returns to `vaulted`
- **THEN** the register still holds one open mark for the case and nothing else is told

### Requirement: Preparing documents waits on the register's owner

Preparing a case's documents SHALL read the case's item from the register
first, and SHALL be refused by name:

| While | The refusal |
| --- | --- |
| The register names an owner other than the case's collector | names the owner the register shows, linking the item, where staff can transfer it |
| The register does not yet hold the item | says the item is still being registered |
| The register cannot be asked | says the register cannot be read now |

The Documents tab SHALL NOT offer Prepare documents while the register names
another owner, and SHALL say so in a line naming that owner and linking the
item.

#### Scenario: grade10-site-vault-case-lifecycle-SC-46 - Another owner withholds Prepare documents
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff learn before the paper is printed that the slab is registered to someone else

- **GIVEN** an accepted case whose collector is Ana Wong, linked to an item the register shows as Ben Lee's
- **WHEN** staff read its Documents tab
- **THEN** Prepare documents is not offered, and a line names Ben Lee and links the item

#### Scenario: grade10-site-vault-case-lifecycle-SC-47 - A prepare under another owner is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - the register's owner changed after the tab was opened

- **GIVEN** a Documents tab offering Prepare documents, and the item then moved to Ben Lee
- **WHEN** staff prepare the documents
- **THEN** it is refused, naming Ben Lee and linking the item, and the case stays where it was

#### Scenario: grade10-site-vault-case-lifecycle-SC-48 - A prepare the register cannot answer is refused by name
**Serves:** grade10-site-vault-case-lifecycle-US-03 - staff are told why the paper could not be printed

- **GIVEN** an accepted case, and the register not answering
- **WHEN** staff prepare the documents
- **THEN** it is refused, saying the register cannot be read now, and nothing is rendered
