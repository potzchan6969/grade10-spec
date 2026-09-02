# demo-product/alpha Test Cases

**Status:** pending-review

## alpha-US-01: Reader follows the thing end to end

**As a** reader,
**I want** the thing to happen once and leave a record,
**so that** I can tell whether it already happened.

### alpha-TC-01: Reader asks for the thing and it happens

**Description:** Proves the thing happens on a first ask.

**Preconditions:**

- The thing has not happened.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Ask for the thing. | The thing happens. |

**Properties:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** alpha-SC-01

### alpha-TC-02: Reader asks a second time and is refused

**Description:** Proves the second ask changes nothing.

**Preconditions:**

- The thing already happened.

**Test data:** None — the case takes no input.

**Steps:**

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Ask for the thing again. | Nothing happens. |
| 2 | Read the record. | The record is unchanged. |

**Properties:**

- **Severity:** critical
- **Priority:** medium
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** api
- **Automation status:** manual
- **Testability:** manual, automation
- **Trace:** alpha-SC-01, alpha-SC-02
