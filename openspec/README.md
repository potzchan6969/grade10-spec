# OpenSpec records

`openspec/specs/<product>/<domain>/<capability>/spec.md` is the single source of truth for what each product requires. An engineer in a consuming application builds from it without needing to read anything else first. The product directories are listed in [`specs/README.md`](specs/README.md).

Active implementation deltas live in `openspec/changes/`; completed changes move to `openspec/changes/archive/`. A change carries only the requirements that differ from the durable spec, and its accepted deltas are folded back into `openspec/specs/` before it is archived.

A change proposal links the capability's page in `docs/prds/` when one exists — the page is the PRD: it explains the product and the decision behind it, and never restates a requirement. Describe affected consumer applications and public component exports in the proposal. Use the `openspec-propose`, `openspec-apply-change`, and `openspec-archive-change` agent skills.

Read [`docs/governance/prd-and-openspec.md`](../docs/governance/prd-and-openspec.md) for the boundary between the two records and the agent maintenance lifecycle.
