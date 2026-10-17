## Context

Two repositories hold the workflow. The store owns the pages, the changes, the durable specs, and `pnpm check:manual`, which runs on every pull request and push to `main` through `lint.yml`. The application repository owns the code, the deploys, and `pnpm plan`, which reads the store through the `openspec` CLI's machine registry and writes claims and checkmarks to it as commits.

`check:manual` reads the store through one set of readers in `tools/manual/src/store/`. An in-flight change arrives as a `ChangeEntry` with its `deltas`, the page sections its proposal links (`sections`, from `## References`), and its task groups with their repository tags. The `marks` rule asks, page by page, whether an in-flight change delivers each 🚧 line. The check never reads the archive today.

The store verifies accepted artifacts and implementation attestations. The deployment workflow verifies application and spec Git ancestry against the ref it actually deploys.

## Goals / Non-Goals

**Goals:**

- Every gap closes with a check that runs in CI, or with a record a check in CI can read.
- Every exemption is a line in the change's own record, never a hidden constant.
- No second parser: the new rules read the `ChangeEntry` the readers already build.

**Non-Goals:**

- Writing the 🚧 lines for the changes already in flight.
- Making `openspec archive` itself refuse; the record it moves is what gets checked.

## Decisions

**Exemptions** - `page_waived`, `design_waived`, and `tasks_waived` remain explicit
manifest decisions. Deployment fields and deployment waivers are removed. They
cannot substitute for acceptance, implementation evidence, or an environment
receipt.

**No start date.** The changes in flight that a rule would fail get the matching waiver written into their manifest by this change, in one sweep, each reading `predates the <rule> rule`. That is the store's own idiom for an exemption: on record, never an omission. A date constant would be code that only fits today, and `created` is author-typed, so a rule keyed on it fails open on a missing or backdated date. Archives are the one exception: the archive date prefix is written by the CLI, not typed, and rewriting seventy-four history records to say they predate a rule is worse than one line saying so. Legacy archives remain historical records; new accepted archives carry fingerprinted implementation evidence.

**`unmarked`, a FAIL rule.** An in-flight change with deltas passes when its proposal links at least one section of a page under `docs/prds/products/` and a 🚧 line sits under one of the sections it links, or when `page_waived` is set. The link is the binding: it is what the governance page asks the author to write, and the `marks` rule already accepts a section link as delivery. A rule keyed on the page's `spec:` would let a change pass on a 🚧 line another change put on the same page, which is the common case today on the listing and cart pages. A mark belongs to the `##` heading it sits under, which is the heading a link can name; `OpenMark` gains that section beside `where`, because `where` names a detail or example block, which no link can reach, and fourteen marks today sit above any heading and have no `where` at all. Linking a section for context without marking it is allowed: one marked linked section is enough.

**`design`, a FAIL rule.** An in-flight change whose `tasks.md` holds a group not tagged `(grade10-spec)` passes when `tech-design.md` exists or `design_waived` is set. A group with no tag counts: nine groups in flight carry none. Three changes fail it today. The store's `planning-dev` skill and the schema's `tech-design` entry are rewritten to say the same: a change with an application task group writes its design, and a change that skips it says why in the manifest.

**Accepted Contract And Archive Evidence**

Acceptance publishes the durable fold before implementation. `acceptance.json`
records the content fingerprint and the reviewed artifact manifest. Git history
supplies publication commits and pull requests. `implementation.json` names that
fingerprint, implementing repositories, commits, and required deploy components.

`archive-preflight.mjs` verifies the accepted contract and implementation record,
checks completed tasks and required companion artifacts, and refuses unresolved
planning decisions. Archive moves the change with its evidence and performs no
second fold. It does not wait for deployment or a human QA run that requires a
deployed build.

The application plan command verifies acceptance before a group is claimed or
built. It records implementation evidence after verification. The shared deploy
workflow resolves the actual deployed ref, checks implementation and spec archive
ancestry, and records component availability through GitHub Deployments. The
manual reads those receipts separately from planning stages. No deployment state
is written back into a change manifest.

**Board** - A change with no tasks remains in planning. Acceptance, implementation
completion, and archive are distinct from where a build is running. The board
links the manual for environment availability and the test cases for QA review.

**`lint.yml` gains an `openspec` job**: install the pinned CLI (`OPENSPEC_VERSION` as `manual.yml` pins it), `openspec validate --changes --strict`, `openspec validate --specs`. Both pass on the store today.

**`reality-sweep` reads `docs/prds/products/` on `origin/main`.** Lane (c) becomes *page silent*: a 🚧 line whose delivering change has every task checked, and a capability page with no divergence callout for a finding from (a) or (b).

**`review-changes`** gains one line on its Spec axis: a change with `page_waived` is reviewed on whether the waiver reads true.

**One name.** Where this change touches prose, the thing under `docs/prds/` is "the PRD" — never "the capability's page", which reads as the capability spec under `openspec/specs/`. The application repository's `AGENTS.md` and `archive-change` say so; `development.md` names `pnpm check:manual` there as this repository's engineering manual; `validation.md` gets one row for `pnpm plan validate`.

## Risks / Trade-offs

- Forty-odd manifests gain a `page_waived` line in one commit. Accepted: it is the honest state of those changes, it is grep-able, and each line leaves with its change at archive.
- `page_waived` can become the line every author writes. The board counts them, `review-changes` reads them, and the rule's message names what the line is standing in for.
- Availability requires authenticated access to GitHub deployment evidence. Missing evidence stays unknown.
- Partial deployments and rollback retain per-component provenance. A production target does not itself prove a public frontend is live.
