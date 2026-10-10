---
name: clarification-request
description: The Clarification Request format for asking a human a question, a decision, or for a required action (a blocker), and for listing optional feedback and the decisions an agent made without asking. Use whenever human input is needed before or while work continues.
---

# Clarification request

Use this format whenever human input is needed.

- **Labels** - Put requests for an answer or decision under **Questions**, and required human actions under **Blockers**. Mark optional feedback as optional.
- **Items** - Use a numbered list, one question or blocker per item, ordered by impact. Open with `**Short title** -` and the exact answer, decision, or action needed, in the reader's words.
- **Options** - Where alternatives exist, give lettered options with the recommended option first and marked `Recommended`. State the outcome and cost of each; do not invent alternatives for a required action.
- **Context** - Explain why the answer or action matters and what waits on it. Name the affected journeys, requirements, contracts, or tests; optional feedback must not appear to block work.
- **Reasons** - Give the supporting evidence, errors, past decisions, or requirements. Quote and link relevant sources, naming decision rows or requirement anchors; use published manual or change pages when available.
- **Decisions made by Agents** - After the list, state any decisions made without asking and the option taken. Omit this when there are none.

```markdown
### Questions

1. **<Short title>** - <Exact question or decision needed.>
   - **A - <Option> - Recommended** - <Outcome and cost.>
   - **B - <Option>** - <Outcome and cost.>
   - **Why it matters** - <User or operator consequence.>
   - **Blocks** - <Work waiting on the answer, or None - optional feedback.>
   - **Reasons** - <Supporting evidence or quoted decision or requirement, with a source link>.

### Blockers

1. **<Short title>** - <Exact human action needed.>
   - **Why it matters** - <Why the action is required.>
   - **Blocks** - <Work that cannot proceed.>
   - **Reasons** - <Relevant error, evidence, or quoted decision or requirement, with a source link.>

### Decisions made by Agents

- **<Decision>** - <Option taken without asking.>
```
