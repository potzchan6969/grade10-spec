# grade10-site/vault/case-intake Specification

## Feature set

- Describing the item
  - A loan of more than zero: a financing amount of zero is refused, and
    storage is asked for by leaving the amount out

## MODIFIED Requirements

### Requirement: The financing amount decides the lane

A request carrying a financing amount SHALL open a case on the financed lane;
a request carrying none SHALL open one on the storage lane. The absence of an
amount SHALL be read as the storage lane and never as a missing value, and
nothing later in the case SHALL ask again which lane it is on.

A financing amount SHALL be more than zero. A request asking for a loan of
zero SHALL be refused by name, and no case SHALL be opened with it: storage
is asked for by leaving the amount out.

<!-- trace:scenario id=g10.vault-case-intake.SC-jgo rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-05 - A loan asked for opens the financed lane
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request asking for 5,000,000 HKD minor units
- **THEN** the case is on the financed lane

<!-- trace:scenario id=g10.vault-case-intake.SC-z3o rev=1 -->
#### Scenario: grade10-site-vault-case-intake-SC-06 - No loan asked for opens the storage lane
**Serves:** grade10-site-vault-case-intake-US-02 - Collector sends in a card they only want kept safe

- **WHEN** a collector opens a request asking for no loan
- **THEN** the case is on the storage lane and no offer is ever written for it

#### Scenario: grade10-site-vault-case-intake-SC-42 - A loan of zero is refused
**Serves:** grade10-site-vault-case-intake-US-01 - Collector sends in a card they want cash against

- **WHEN** a collector opens a request asking for a loan of 0
- **THEN** it is refused by name and no case is opened
