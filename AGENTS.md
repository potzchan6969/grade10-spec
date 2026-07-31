# Product specification and design-system repository

This repository is the versioned source of truth for product requirements and the design system beneath AceTrader applications. It is intentionally not an application: do not add product data fetching, authentication, routing, stores, or feature orchestration here.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing PRDs, specs, primitives, and conventions before proposing a new structure.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per pull request where practical.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/acetrader.css` by hand. Edit `tokens.json` or `tokens.config.json` and regenerate with `pnpm run tokens:build`.

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| Product requirement document | `docs/prds/<product-area>/<feature>.md` | A full, durable PM/design artifact. |
| Product vocabulary and durable requirements | `openspec/specs/<capability>/spec.md` | Requirement-level source used by implementation changes. |
| Proposed implementation change | `openspec/changes/<change-name>/` | Delta proposal, design, specs, and tasks; archive after delivery. |
| Design token values | `packages/design-system/tokens.json` | Designer-owned data; the CSS themes are generated projections of it. |
| Design-system primitive | `packages/design-system/src/components/` | shadcn primitives and their colocated stories. |
| Product component implementation | The consuming application repository | This repository specifies the contract; it no longer ships a component package. |

Do not duplicate a PRD verbatim in OpenSpec. Link the PRD from the change proposal and record only implementation-facing requirement deltas in `openspec/changes`.

Read [`docs/governance/prd-and-openspec.md`](docs/governance/prd-and-openspec.md) for the required maintenance lifecycle and a format-selection guide.

## Product specification workflow

For a new product feature, use the `prd-authoring` skill before implementation planning:

1. Inspect related PRDs and active OpenSpec changes.
2. Write or update the PRD from `docs/prds/_template.md`; give it a stable kebab-case path.
3. Capture user outcomes, non-goals, flows, states, acceptance criteria, analytics, accessibility, and consuming-app impact.
4. For implementation work, create an OpenSpec change named in kebab-case. Its proposal must link the PRD and identify affected component exports and consumer apps.
5. Keep task checkboxes accurate as work lands; archive completed changes under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.

Ask only questions that materially affect scope or an irreversible product choice. Otherwise state the assumption in the PRD's Decisions and open questions section.

## Product UI component contracts

This repository specifies product UI components; it does not implement them. A component's source lives in the application that renders it, and the contract recorded here is what the application must satisfy.

Read [`docs/governance/ui-component-contracts.md`](docs/governance/ui-component-contracts.md) before designing a new public UI contract or making a material component-contract change.

- Components receive all consumer-owned content, product state, and behavior through props. Callback props use `on<Event>` names.
- No data fetching, mutations, routing, app stores, analytics, feature flags, browser storage, or application imports inside the component itself.
- Components may use React state, context, effects, refs, timers, and browser APIs for internal presentation and DOM behavior. They must not use those mechanisms to acquire, persist, subscribe to, or orchestrate consumer-owned product state.
- In this repository, “stateless” means app-neutral: it excludes external product-state integration, not ephemeral internal UI state.
- Record a contract change as an OpenSpec change that names the exact exports affected and the consuming applications that must adapt.

## Design system package

`packages/design-system` (`@acetrader/design-system`) holds the theme tokens and the shadcn primitives this repository owns. It is the only package here; do not add a second one without a recorded product decision.

Use the `design-system-components` skill whenever creating or changing a primitive under `packages/design-system/src/components/`.

- The package is consumed from source: `exports` point at `src/`, there is no build step, and no `dist/` is committed.
- Stories are colocated with each primitive. Run them with `pnpm run storybook:design-system`.
- Token flow: `tokens.json` is the source of truth, `tokens.config.json` holds the engineer-owned projection rules, and Figma plus the theme CSS files are both projections. Read `packages/design-system/DESIGN.md` before touching any leg of that pipeline.
- Read [`docs/governance/design-code-sync.md`](docs/governance/design-code-sync.md) before adding a primitive or changing one that has a Figma counterpart. A component may not offer a variant or size the Figma component set does not define; where code and design genuinely disagree, record it as an OpenSpec change rather than absorbing it into the Code Connect template.
- The Figma legs (`tokens:pull`, `tokens:push`, `tokens:plugin`) require a human to run a plugin inside Figma; they have no unattended path.

## Sharing with consuming apps

Consumers add this repository as a Git submodule and read the specifications, the PRDs, and the design tokens from it. They do not install a component package from here: `packages/ui-components` was removed and each application now owns its own component source, so a shared component change is a specification change here plus an implementation change there.

Pin the submodule SHA in the application repository; updates are normal pull requests that move that SHA. Do not use git submodules inside this repository; this repository itself is the reusable submodule.

## Validation

Run the appropriate checks before handoff:

- `pnpm run agent:check-parity` after agent instructions, rules, or skills change.
- `pnpm run check:design-system` after a design-system primitive changes.
- `pnpm run tokens:build` after `tokens.json` or `tokens.config.json` changes; commit the regenerated theme CSS.
- `pnpm run lint` for repository formatting and static checks.
- `pnpm run typecheck` after any TypeScript change.

## Pull Requests and Commits

- PR labels: use one of `feature`, `bug`, `ci`, `agent`, `enhancement`, `maintenance`, or `documentation`, when labels are available.
- Commit subjects use the Conventional Commits format. Do not add issue or PR prefixes; repository tooling adds them.
- Keep commits atomic. Split unrelated implementation, documentation, refactoring, and generated build output into separate commits when practical.

## Agent-platform parity

`AGENTS.md` is canonical. `AGENT.md`, `CLAUDE.md`, and `GEMINI.md` are compatibility aliases. The skills in `.cursor/skills/` and `.codex/skills/` must remain byte-for-byte identical.

When agent-related files change, run:

```bash
pnpm run agent:sync-parity
pnpm run agent:check-parity
```
