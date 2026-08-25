## ADDED Requirements

### Requirement: The store home blocks are exported from the package entry

The shared UI package SHALL export, from its public entry, the store-home
components and types named by `shared-ui/store-home`: `StoreHomeHero`,
`StoreSectionHeader`, `StoreCollectionGrid`, `StoreCollectionTile`, and each
of their prop and copy types.

#### Scenario: An application imports a store-home block

- **WHEN** an application imports any store-home export named above from the package's public entry
- **THEN** the import resolves to the implementation in `packages/ui`
