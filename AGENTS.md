# Product specification and component repository

This repository is the versioned source of truth for product requirements and portable UI components. It is intentionally not an application: do not add product data fetching, authentication, routing, stores, or feature orchestration here.

## Operating principles

- Treat product managers, designers, and engineers as collaborators. Check existing PRDs, specs, components, and conventions before proposing a new structure.
- Prefer the smallest reusable artifact. Call out a preference or design-system choice as a choice, not as an objective improvement.
- Keep changes reviewable: one product decision or component capability per pull request where practical.
- Do not modify generated `packages/ui-components/dist/` by hand. Regenerate it with `pnpm run build:components`.

## Sources of truth

| Need | Canonical location | Notes |
| --- | --- | --- |
| Product requirement document | `docs/prds/<product-area>/<feature>.md` | A full, durable PM/design artifact. |
| Product vocabulary and durable requirements | `openspec/specs/<capability>/spec.md` | Requirement-level source used by implementation changes. |
| Proposed implementation change | `openspec/changes/<change-name>/` | Delta proposal, design, specs, and tasks; archive after delivery. |
| Portable UI component | `packages/ui-components/src/` | Framework-level, stateless React component. |
| Component examples | `apps/ui/src/stories/` | Storybook only; never the component source of truth. |

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

## Stateless component rules

Use the `stateless-ui-components` skill whenever creating or changing `packages/ui-components`.

- Components receive all content, state, and behavior through props. Callback props use `on<Event>` names.
- No data fetching, mutations, routing, app stores, analytics, feature flags, browser storage, or application imports.
- Do not use React context, `useState`, or `useReducer` in shared components. Controlled props make every visual state renderable in Storybook and consumer applications.
- A component may use refs, effects, and `ResizeObserver` only inside a documented DOM-backed visual runtime (for example, an ECharts adapter) to mount, update from props, resize, and dispose that runtime. This exception never permits data fetching, stores, routing, analytics, feature flags, browser storage, timers that derive product state, or application imports.
- Keep React a peer dependency; do not bundle React or a product design system.
- Export each public component and its prop type from `src/index.ts`; changing an exported prop is a consumer-facing breaking change unless optional and backward compatible.
- Storybook stories must cover default, interactive/disabled, loading, empty, error, and narrow-width states when those states exist.

## Sharing components with consuming apps

Consumers add this repository as a Git submodule and install the prebuilt `@acetrader/pred-spec-ui` package from that submodule. The component package commits `dist/` deliberately so a submodule consumer can install it without needing this monorepo's dev toolchain.

See `packages/ui-components/README.md` for exact commands and update workflow. Do not use git submodules inside this repository for components; this repository itself is the reusable submodule.

## Validation

Run the appropriate checks before handoff:

- `pnpm run agent:check-parity` after agent instructions, rules, or skills change.
- `pnpm run check:components` after a shared component changes.
- `pnpm run build:components` after a component source or public export changes; commit the regenerated `dist/` output.
- `pnpm run lint` for repository formatting and static checks.

## Agent-platform parity

`AGENTS.md` is canonical. `AGENT.md`, `CLAUDE.md`, and `GEMINI.md` are compatibility aliases. The skills in `.cursor/skills/` and `.codex/skills/` must remain byte-for-byte identical.

When agent-related files change, run:

```bash
pnpm run agent:sync-parity
pnpm run agent:check-parity
```
