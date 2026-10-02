# shared/ui/vault-case Specification

## Purpose

The vault collector's own blocks, which the store no longer carries: the
collector's screens leave the site until @tangconst designs them again from
the backend, and this capability holds the store to exporting none of the
blocks they used. The loading cards and case cards other site pages share
are `shared/ui/page-blocks`.

## Feature set

- The export contract
  - Named components: none - the package exports no vault collector block,
    and none of the types the removed blocks carried
  - The booking set is not redrawn: retired with the blocks; a booked visit
    is the booking blocks' own
  - Words through props: retired with the blocks
- Accepting an offer
  - The terms before the answer: retired with the accept confirmation
  - Accept and Go back, each reported to the consumer
  - While the answer is in flight: retired with the accept confirmation
  - A refusal read beside the terms, the dialog still open
  - The caller holds it open, and the block forwards that
- An empty vault home
  - The intro and the start action, the How it works steps, the empty panel
    and the draft cap, in that order
  - The empty home: retired with the vault home; the item above stays in the
    feature set only because a fold cannot remove an unlabelled item
- The vault home's cases
  - The way in and the count: retired with the vault home
  - A card per case: retired with the vault home
  - A case at a glance: retired with the vault home
  - Only what the case has: retired with the vault home

## Requirements

### Requirement: The vault case exports

The store carries no block for the vault collector's own screens until they
are designed again.

**Components** - the shared UI package's public entry SHALL export none of
`VaultAcceptOfferDialog`, `VaultCases` and `VaultCasesEmpty`.

**Types** - the public entry SHALL export none of the types those blocks
carried: `VaultAcceptOfferDialogProps`, `VaultAcceptOfferDialogCopy`,
`VaultCasesProps`, `VaultCasesCopy`, `VaultCasesCard`, `VaultCasesChip`,
`VaultCasesTone`, `VaultCasesIcon`, `VaultCasesEmptyProps`,
`VaultCasesEmptyCopy` and `VaultCasesEmptyStep`.

#### Scenario: shared-ui-vault-case-SC-01 - An application imports the vault blocks
**Serves:** The export contract - the store carries no vault collector block until the screens are designed again

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports none of the components and types named above

#### Scenario: shared-ui-vault-case-SC-02 - A booked visit composes the booking cards
**Serves:** The export contract - the booking set stays the booking blocks' own

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports no vault-named confirmation or visit card

#### Scenario: shared-ui-vault-case-SC-03 - No block reaches past its props
**Serves:** The export contract - no vault collector block is left to reach past its props

- **WHEN** the shared UI package's blocks are listed
- **THEN** none of them is a vault collector block
