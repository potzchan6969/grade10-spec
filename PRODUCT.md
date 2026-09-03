# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Internal collaborators — product managers, designers, and engineers — who author, review, and ship Grade10 product requirements and the shared design system. They work in this repository to write durable specs, record product decisions, maintain tokens and primitives, implement shared compound components, and preview whole pages before changes reach consuming applications.

Consuming application engineers (building Grade10 Store, Grade10 Auction, ZZZ, and admin consoles) are downstream readers of this repository via Git submodule; they are not the primary audience Impeccable optimizes for on this target.

## Product Purpose

This repository is the versioned source of truth for product requirements and the design system beneath Grade10 applications. It is intentionally not a production application: it holds what every consumer must agree on — testable requirements, component export contracts, design tokens, shared UI implementations, and localization catalogs — so that multiple applications can implement features consistently without duplicating specs or components.

Success means collaborators can author a requirement once, implement a shared component once, verify it against Figma and Storybook, and ship it to every consuming app through a submodule bump.

## Positioning

A single monorepo where durable OpenSpec contracts, PRD rationale, Figma-synced tokens, shadcn primitives, and app-neutral compound components live together and are consumed from source — not as a published package artifact — by every Grade10 application through Git submodule. Neighboring approaches split specs from design system from implementation, or copy components per app; this repository keeps the contract, the tokens, and the shared implementation in one place with explicit governance over what belongs where.

## Operating Context

Collaborators work across several artifact types with distinct authority:

| Need | Canonical location |
| --- | --- |
| Durable requirements and component export contracts | `openspec/specs/<product>/<domain>/<capability>/spec.md` |
| Product record: a capability's manual page and the decision behind its requirements | `docs/prds/products/<product>/<capability>.md` |
| Proposed implementation change | `openspec/changes/<change-name>/` |
| Design token values | `packages/design-system/tokens.json` |
| User-facing copy and translations | `packages/i18n/messages/{shared,<brand>}/<locale>/<namespace>.json` |
| Design-system primitive | `packages/design-system/src/components/` |
| Shared compound component | `packages/ui/src/blocks/` |
| Whole-page preview assemblies | `apps/preview/src/pages/` |

One workflow schema under `openspec/schemas/` governs how changes progress: `grade10-planning`, proposal → specs → user journeys → test cases → ui design → tech design → tasks. Each hand writes its own artifacts and stops — a PM finishes at the journeys, and the engineer who picks the work up adds `tech-design.md` and `tasks.md` to the same change.

Preview and review run through Storybook:

- `pnpm storybook` — page assemblies in `apps/preview`
- `pnpm storybook:workbench` — assemblies plus both packages' stories (published at https://storybook.grade10-stg.com)
- `pnpm storybook:design-system` / `pnpm storybook:ui` — focused single-package views

Consuming applications add this repository as a Git submodule, pin a SHA, and implement their own routing, data, stores, and adapters against the shared contracts.

## Capabilities and Constraints

**Applications specified** (under `openspec/specs/`):

- `grade10-site` — the grade10 site: shell, addressing, and every collector-facing surface inside it (store, auction, loyalty)
- `grade10-admin` — the grade10 admin site: auction listings and campaigns, close-out, and the stock count behind them
- `zzz-site` — the ZZZ site
- `zzz-admin` — the ZZZ admin site (no capability specified yet)
- `shared` — not an application: the contracts binding two or more of the four (`auth/*`, `ui/*`, `console/*`, `design-sync/*`, and the platform-wide formats)

**Repository constraints (non-negotiable):**

- Do not add product data fetching, authentication, routing, stores, or feature orchestration to this repository.
- Shared compound components receive all consumer-owned content, state, and behavior through props; callback props use `on<Event>` names.
- Components may use internal presentation state; they must not acquire, persist, subscribe to, or orchestrate consumer-owned product state.
- Do not modify generated `packages/design-system/src/theme.css` or `src/themes/grade10.css` by hand; edit `tokens.json` or `tokens.config.json` and run `pnpm run tokens:build`.
- Do not add packages beyond `design-system`, `i18n`, and `ui` without a recorded product decision.
- `@grade10/ui` composes design-system primitives and never imports message catalogs; all content reaches components through props.

**Terminology:** "Stateless" in this repository means app-neutral (no external product-state integration), not free of React hooks or ephemeral UI state.

## Brand Commitments

- **Grade10** — trading-card store and auction brand; primary consumer-facing product family.
- **ZZZ** — separate site brand with its own surfaces and localized copy layer.
- **Gibson** (Adobe Fonts / Typekit kit `lnk7gwq`) — brand sans for Grade10 theme; loaded by consuming applications, not embedded in generated theme CSS.
- **Figma** — design source of truth for tokens and primitives; two-way token pipeline (`tokens:import`, `tokens:build`, `tokens:push`, `tokens:plugin`). Code Connect templates map Figma component sets to code.
- **shadcn** — primitive foundation in `packages/design-system`; variants and sizes must match Figma component sets.

## Evidence on Hand

| Asset | Location / notes |
| --- | --- |
| Durable specs | `openspec/specs/` |
| Active change deltas | `openspec/changes/` |
| The manual — one page per capability, the PRD | `docs/prds/` |
| Design system documentation | `packages/design-system/DESIGN.md` |
| Token data | `packages/design-system/tokens.json` |
| Published Storybook (workbench) | https://storybook.grade10-stg.com |
| Governance guides | `docs/governance/` |
| Agent instructions | `AGENTS.md` |

Do not fabricate testimonials, customer logos, pricing, licensing terms, or deployment claims not present in these sources.

## Product Principles

1. **Specs are authoritative.** If a statement is testable, it belongs in `openspec/specs/` and nowhere else. PRDs explain why; specs say what.
2. **Smallest reusable artifact.** Prefer one shared component, one token, one message key over duplicating per application.
3. **Explicit layer assignment.** Primitives live in `design-system`, compound components in `ui`, page assemblies in `apps/preview`, application wiring in consuming repos.
4. **Reviewable increments.** One product decision or component capability per pull request where practical.
5. **Design-code parity.** Primitives and tokens stay aligned with Figma; drift is recorded as OpenSpec change, not silently absorbed.

## Accessibility & Inclusion

Storybook stories run axe checks via `@storybook/addon-a11y` in headless Chromium (`pnpm test:stories`). Current gate is `"todo"` (violations reported, not failing); upgrading to `"error"` is an open engineering decision once outstanding violations are cleared. No additional product-specific accessibility standard was established beyond this tooling.
