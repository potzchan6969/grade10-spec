# grade10-site/vault/valuation-and-offer Specification

## Feature set

- The valuation
  - The slab beside the figure: grader, grade and cert read from the item
    register, corrected there and never on the valuation

## ADDED Requirements

### Requirement: A valuation is read beside the item's grader, grade and cert

Recording a valuation SHALL show, above the amount, the item's grader, grade
and cert read from the item register, read-only, where the item has a grader,
and nothing where it has none. A valuation SHALL keep no grader, grade or cert
of its own: a correction SHALL be made on the register, from the Case tab's
Edit, and every later read SHALL show it.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-33 - A slab is valued beside its grader, grade and cert
**Serves:** grade10-site-vault-valuation-and-offer-US-06 - staff value the slab in their hand against what the register says it is

- **GIVEN** a case whose item the register holds as PSA, `10`, cert `12345678`
- **WHEN** staff open Record a valuation
- **THEN** a read-only line reads PSA, `10` and `12345678` above the amount

#### Scenario: grade10-site-vault-valuation-and-offer-SC-34 - An item with no grader shows no line
**Serves:** grade10-site-vault-valuation-and-offer-US-06 - staff value a watch nobody graded

- **GIVEN** a case whose item has no grader
- **WHEN** staff open Record a valuation
- **THEN** no grader, grade or cert line is shown

#### Scenario: grade10-site-vault-valuation-and-offer-SC-35 - A correction is made on the register and read everywhere
**Serves:** grade10-site-vault-valuation-and-offer-US-06 - staff find the slab says 9, not 10

- **GIVEN** a valuation recorded beside PSA `10`
- **WHEN** staff correct the grade to `9` from the Case tab's Edit and open Record a valuation again
- **THEN** the line reads `9`, and the valuation offers no field for a grade
