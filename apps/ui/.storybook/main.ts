import type { StorybookConfig } from "@storybook/react-vite";

/* The cross-package preview workbench. Unlike the two package workbenches, it
 * renders assemblies: whole pages composed from `@grade10/design-system`
 * primitives and `@grade10/ui` compound components, with this workbench
 * supplying the content and owning the state loop, exactly as a store does.
 *
 * Both packages are workspace dependencies, so their `exports` maps resolve
 * without aliasing here. Tailwind comes from `vite.config.ts`, which Storybook
 * picks up; the theme CSS is imported by `preview.tsx`.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
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
