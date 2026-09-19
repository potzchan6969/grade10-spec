# demo-product/alpha Test Cases

**Status:** pending-review

## alpha-US-01: Reader follows the thing end to end

### alpha-TC-04: Reader asks twice and the count holds

**Description:** Proves the second ask leaves the count alone.

**Preconditions:**

- The count is zero.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Ask for the thing twice. | The count is one. |

**Properties:**

- **Severity:** minor
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** manual
- **Trace:** alpha-SC-05
