---
name: stateless-ui-components
description: Create or revise a portable, controlled React component that can be consumed from this repository as a Git submodule.
---

# Stateless UI components

Use this skill for changes under `packages/ui-components/` or a Storybook story for a shared component.

1. Read `AGENTS.md`, the related PRD, the package README, and existing public exports.
2. Define the component's public props before writing JSX. Accept consumer-owned display values and product/interaction state through props; name callbacks `on<Event>`. Internal, transient presentation state may stay local when it does not need consumer control or persistence.
3. Keep the component app-neutral: no stores, routing, data access, analytics, feature flags, browser storage, or application imports. Internal React state, context, effects, timers, refs, and browser APIs are allowed for presentation and DOM behavior, but not to acquire, persist, subscribe to, or orchestrate consumer-owned product state.
4. Use semantic HTML and expose styling hooks via stable class names or data attributes. Do not depend on a consuming app's CSS framework.
5. Export the component and prop type from `src/index.ts`. Treat an incompatible exported-prop change as breaking.
6. Add or update Storybook stories for each meaningful state, including disabled, loading, empty, error, and narrow layout where applicable.
7. Run `pnpm run check:components` and `pnpm run build:components`; commit `dist/` with the source change.

The package is consumed as `@acetrader/pred-spec-ui` via a `file:` dependency in an application repository that includes this repository as a Git submodule.
