# demo-product/alpha Test Cases

**Status:** approved

## alpha-US-01: Reader follows the thing end to end

### alpha-TC-05: Reader finds the record

**Description:** Proves one record is written for the thing.

**Preconditions:**

- No record exists.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Ask for the thing. | One record names it. |

**Properties:**

- **Severity:** minor
- **Priority:** medium
- **Status:** actual
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** manual
- **Trace:** alpha-SC-06
