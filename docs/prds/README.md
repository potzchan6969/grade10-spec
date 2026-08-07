# Product requirement documents

A PRD records a product decision: the problem and its evidence, who it is for, what was ruled out, what will be measured, and what the risks are. It is not where requirements live.

`openspec/specs/<capability>/spec.md` is the single source of truth for every checkable requirement and every component export contract. A PRD links its capability spec and does not restate it.

Create documents under a stable product-area directory, for example:

```text
docs/prds/predictions/market-detail.md
docs/prds/onboarding/wallet-connection.md
```

Start from [`_template.md`](_template.md). Write a PRD only when there is a judgment to explain that the requirement text will not preserve — if stripping every testable statement leaves nothing behind, write the capability spec instead and skip the PRD.

For the boundary between the two records and the required maintenance workflow for agents, read [`docs/governance/prd-and-openspec.md`](../governance/prd-and-openspec.md).

`_template.md` is a template, not a PRD; do not move it into an archive.
