# One Figma node per audited element

**Author:** @danaruiz - 2026-08-31

## Why

The Order History / Status chip in Grade10-DS-2026 is claimed twice: its code-connect template points at one node and its audit table points at a different one. Two mappings for the same chip means whichever rail runs decides what correct looks like, and right now the disagreement only exists as a hand-typed warning on this page - no owner, no date, nothing that expires. I want a mapping conflict to fail the run the way a value mismatch does: name the component set, name both node ids, and stop, so a designer has to settle which node the chip is drawn from. The reverse case matters too - an element that names no node at all should read as uncovered, never as agreed. This is about the rail contract, not about the order-history screen behaviour.

**Metric:** the audit run prints a count of elements in each of three states - agreed, deliberately uncovered, accidentally uncovered - every run, starting from at least one live node-identity conflict (Order History / Status) that is invisible to any count today. The number to watch is accidental-uncovered: it should fall as gaps get connected or explicitly declared, not because the rail stopped looking.

## Non-Goals

- Does not say which of the two disagreeing nodes is correct, or add any tooling to resolve a conflict automatically - the rail's job is to stop and name both, not to pick.
- Does not touch the Order History screen's behaviour, its status values, or its copy - that chip is only the example that surfaced the gap.
- Does not change how a blank or malformed node field on an existing audit-table row is handled - that is the tooling's existing broken-row behaviour, untouched here.

## Capabilities

### Modified Capabilities

- `design-sync/audit-coverage`: adds the promise that a Code Connect template and an audit-table entry for the same element must agree on one Figma node - disagreement fails the run and names both node ids, silence on one side reads as uncovered (declared or undeclared) and never as passing, and every run reports a count of each of the three states.

## Impact

- The nightly and on-demand design-sync audit run, and the report it writes for the manual.
- `manual/products/design-sync/audit-coverage.md`: the hand-typed warning describing the Order History / Status conflict is replaced by the run's own dated, structural finding once this ships.
- No application or component code changes are in scope for this change itself; delivery planning (including how an audit-table entry declares "no Code Connect counterpart by design") belongs to the engineer who promotes this change.

## References

- `design-sync/audit-coverage`
- `A value mismatch fails the run`
- `audit-coverage-SC-15`
- `audit-coverage-SC-16`
- Figma: https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026
