---
name: stateless-ui-components
description: Create or revise a portable, controlled React component that can be consumed from this repository as a Git submodule.
---

# Stateless UI components

Use this skill for changes under `packages/ui-components/` or a Storybook story for a shared component.

1. Read `AGENTS.md`, the related PRD, the package README, and existing public exports.
2. Define the component's public props before writing JSX. Accept consumer-owned display values and product/interaction state through props; name callbacks `on<Event>`. Internal, transient presentation state may stay local when it does not need consumer control or persistence.
3. Keep the component app-neutral: no stores, routing, data access, analytics, feature flags, browser storage, or application imports. Internal React state, context, effects, timers, refs, and browser APIs are allowed for presentation and DOM behavior, but not to acquire, persist, subscribe to, or orchestrate consumer-owned product state.
4. Use semantic HTML and expose styling hooks via stable class names or data attributes. Style through the design-system tokens; do not reintroduce a private palette.
5. Compose from `@acetrader/design-system` rather than adding a primitive here — this package exports composites only. Import by deep path (`@acetrader/design-system/components/display/badge`), not from the barrel, which re-exports `sonner` and `next-themes` into the bundle. A new primitive belongs in `packages/design-system` under the `design-system-components` skill.
6. Export the component and prop type from `src/index.ts`. Treat an incompatible exported-prop change as breaking. Never let a design-system type reach an exported prop type: `dist/` bundles the implementation, but a declaration file emits a bare specifier a consumer cannot resolve, and the build fails on one.
7. Add or update Storybook stories for each meaningful state, including disabled, loading, empty, error, and narrow layout where applicable.
8. Run `pnpm run check:components` and `pnpm run build:components`; commit `dist/` and `theme/` with the source change.

The package is consumed as `@acetrader/pred-spec-ui` via a `file:` dependency in an application repository that includes this repository as a Git submodule.
