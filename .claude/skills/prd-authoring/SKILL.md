---
name: prd-authoring
description: Create or revise the product record behind a capability — its manual page under docs/prds/ and the Product decisions block on it.
---

# PRD authoring

Use this skill when the request is to create, revise, review, or turn an idea into a PRD.

A PRD is the capability's page in the manual: `docs/prds/products/<product>/<capability>.md`, or the product's `index.md` for a decision that spans its capabilities. It is not where requirements live. `openspec/specs/<product>/<capability>/spec.md` is the single source of truth for every checkable requirement and component export contract; the page states the shape in prose and records the product decision behind it in one `:::detail{title="Product decisions" for="pm"}` block.

1. Read `AGENTS.md`, `docs/governance/prd-and-openspec.md`, the manual's own guide `docs/prds/guides/writing-the-manual.md`, the relevant capability in `openspec/specs/`, and active `openspec/changes/` records.
2. Decide whether a decisions block is warranted. If stripping every testable statement from the intended record leaves nothing behind, write the capability spec instead and leave the page's prose to state the shape.
3. Create the page, or open the existing one, and put the record in its `Product decisions` block — the page grammar and canonical form are the guide's; `pnpm check:manual` refuses a page that breaks them.
4. Open the block with the user problem, stated flatly in the present tense, and the intended outcome. Name the non-goals so engineering knows the edges. The page's prose and the block both take the house shape from `docs/governance/writing.md`: an outline whose items lead with the key term in bold, never an essay.
5. Never restate a requirement, a state behavior, an accessibility obligation, or an export contract — the page's `spec:` frontmatter already embeds the spec; cite an id with `[[...]]` where one matters.
6. Record users and their jobs, measurement, and explicit decisions as tables; assumptions and unresolved questions as rows marked ❓. Do not bury uncertainty in prose.
7. Cite source material by linking it — a reference under `docs/references/` renders in the manual at `/references/<slug>`.
8. Write the requirements themselves as an OpenSpec change carrying deltas against the capability spec.

Before handoff, check that the block has a stated problem, non-goals, measurement, a decisions table with open items marked, and a risk statement where one exists; that the page's frontmatter names its spec; that it contains nothing a test could decide; and that `pnpm check:manual` passes.
