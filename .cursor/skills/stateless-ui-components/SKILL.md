---
name: stateless-ui-components
description: Create or revise a portable, controlled React component that can be consumed from this repository as a Git submodule.
---

# Stateless UI components

Use this skill for changes under `packages/ui-components/` or a Storybook story for a shared component.

1. Read `AGENTS.md`, the related PRD, the package README, and existing public exports.
2. Define the component's public props before writing JSX. Accept all display values and interaction state through props; name callbacks `on<Event>`.
3. Keep the component pure: no stores, routing, data access, analytics, feature flags, context, effects, local state, or browser APIs.
4. Use semantic HTML and expose styling hooks via stable class names or data attributes. Do not depend on a consuming app's CSS framework.
5. Export the component and prop type from `src/index.ts`. Treat an incompatible exported-prop change as breaking.
6. Add or update Storybook stories for each meaningful state, including disabled, loading, empty, error, and narrow layout where applicable.
7. Run `pnpm run check:components` and `pnpm run build:components`; commit `dist/` with the source change.

The package is consumed as `@acetrader/pred-spec-ui` via a `file:` dependency in an application repository that includes this repository as a Git submodule.
