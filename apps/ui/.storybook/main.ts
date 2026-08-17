import type { StorybookConfig } from "@storybook/react-vite";

/* The cross-package preview workbench, and the only one that shows every
 * layer at once. It owns the assemblies — whole pages composed from
 * `@grade10/design-system` primitives and `@grade10/ui` compound components,
 * with this workbench supplying the content and owning the state loop, exactly
 * as a store does — and it also loads both packages' colocated stories in
 * place, so a primitive can be opened next to the page that composes it.
 *
 * The two package workbenches remain the focused views (`storybook:ui`,
 * `storybook:design-system`); nothing is duplicated, since the stories are read
 * from the packages rather than copied.
 *
 * Both packages are workspace dependencies, so their `exports` maps resolve
 * without aliasing here. Tailwind comes from `vite.config.ts`, which Storybook
 * picks up; the theme CSS is imported by `preview.tsx`, and its `@source`
 * globs already cover both packages.
 */
const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../../../packages/design-system/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
};
export default config;
