# grade10-admin/console/collector-page Specification

## Feature set

- Items section
  - Every live item they own: title, category, grader and cert, and whether
    a place marks it, each opening its item; a retired item is left out
  - Paged: a page at a time on a cursor
  - None: a collector owning no item reads as owning none
  - Own grant: without the inventory read grant the section names it, and
    the page's other sections stand

## ADDED Requirements

### Requirement: The Items section lists every live item the collector owns

The collector page SHALL hold an Items section for holders of
`inventory:read`: every item the collector owns but a retired one, marked by a
place or not, each with its title, category, grader and cert and whether it is
marked, each opening its item, paged on a cursor. The item register is
`grade10-admin/inventory/items`.

- **None** - a collector owning no item SHALL read as owning none.
- **Alone** - without `inventory:read` the section SHALL name the grant, and a
  section that fails SHALL show its own error with a retry; the page's other
  sections SHALL stand either way.

#### Scenario: grade10-admin-console-collector-page-SC-23 - A collector's live items are on their page
**Serves:** grade10-admin-console-collector-page-US-03 - staff see everything a collector has with the house

- **GIVEN** a collector owning one marked item, one item no place marks and one retired item
- **WHEN** staff open their collector page
- **THEN** the Items section lists the first two, each saying whether it is marked and opening its item
- **AND** the retired item is not listed, and its own page keeps its history

#### Scenario: grade10-admin-console-collector-page-SC-24 - A collector who owns nothing reads as owning nothing
**Serves:** grade10-admin-console-collector-page-US-03 - staff are not left wondering whether the section loaded

- **GIVEN** a collector owning no item
- **WHEN** staff open their page
- **THEN** the Items section says they own none

#### Scenario: grade10-admin-console-collector-page-SC-25 - The section refuses or fails on its own
**Serves:** grade10-admin-console-collector-page-US-03 - the rest of the page still answers the collector

- **GIVEN** a treasurer, who holds no inventory grant, opening a collector's page
- **WHEN** the page loads
- **THEN** the Items section names `inventory:read`, and the cases section stands
- **AND** for staff, an Items section that fails shows its own error with a retry while the cases section stands
