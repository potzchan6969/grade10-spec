# OpenSpec records

`openspec/specs/<product>/<domain>/<capability>/spec.md` is the single source of truth for what each product requires. An engineer in a consuming application builds from it without needing to read anything else first. The product directories are listed in [`specs/README.md`](specs/README.md).

Active implementation deltas live in `openspec/changes/`; completed changes move to `openspec/changes/archive/`. A change carries only the requirements that differ from the durable spec, and its accepted deltas are folded into the rolling `openspec/specs/` contract before implementation. The first task claim records the durable commit and target scope; archive reconciles that scope with later durable refinements.

A change proposal links the capability's PRD in `docs/prds/` when one exists — one page of the manual: it explains the product and the decision behind it, and never restates a requirement. Describe affected consumer applications and public component exports in the proposal. Plan a change with `planning-pm`, `planning-design` where needed, then `planning-dev` for the integrated planning and acceptance run. Implement and archive app changes in the consuming app repository using its own skills.

Read [`docs/governance/prd-and-openspec.md`](../docs/governance/prd-and-openspec.md) for the boundary between the two records and the agent maintenance lifecycle.
