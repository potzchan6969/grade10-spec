## ADDED Requirements

### Requirement: The thing is counted once

The system SHALL count the thing once however often it is asked for.

#### Scenario: alpha-SC-05 - The count holds
**Serves:** alpha-US-01 - Reader follows the thing end to end

- **WHEN** the thing is asked for twice
- **THEN** the count goes up by one
