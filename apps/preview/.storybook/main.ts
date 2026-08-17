import type { StorybookConfig } from "@storybook/react-vite";

/* The preview app. It renders assemblies: whole pages composed from
 * `@grade10/design-system` primitives and `@grade10/ui` compound components,
 * with this workspace supplying the content and owning the state loop, exactly
 * as a store does. This config carries the assemblies alone (`pnpm storybook`);
 * `../.storybook-workbench` extends it with both packages' stories for the
 * combined view (`pnpm storybook:workbench`).
 *
 * Both packages are workspace dependencies, so their `exports` maps resolve
 * without aliasing here. Tailwind comes from `vite.config.ts`, which Storybook
 * picks up; the theme CSS is imported by `preview.tsx`, and its `@source` globs
 * cover both packages so the combined view needs no Tailwind setup of its own.
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
