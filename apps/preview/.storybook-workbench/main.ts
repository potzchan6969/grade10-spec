import type { StorybookConfig } from "@storybook/react-vite";
import base from "../.storybook/main";

/* The workbench (`pnpm storybook`): Start Here, the page assemblies from
 * `../.storybook`, and both packages' colocated stories read in place, so a
 * feature's screens sit beside the blocks they compose. Nothing is
 * copied — the packages remain the source, and `pnpm storybook:ui` and
 * `pnpm storybook:design-system` remain the focused single-package views.
 *
 * Everything but the story set is inherited. This directory sits beside
 * `../.storybook`, so the base globs stay correct at this depth, and
 * `preview.tsx` spreads the base preview, adding the manual's order and links.
 */
const config: StorybookConfig = {
  ...base,
  stories: [
    "../src/start-here.mdx",
    ...(base.stories as string[]),
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../../../packages/design-system/src/**/*.stories.@(ts|tsx)",
  ],
};
export default config;
