import type { StorybookConfig } from "@storybook/react-vite";
import base from "../.storybook/main";

/* The combined view (`pnpm storybook:workbench`): the page assemblies from
 * `../.storybook`, plus both packages' colocated stories read in place, so a
 * primitive can be opened next to the page that composes it. Nothing is
 * copied — the packages remain the source, and `pnpm storybook:ui` and
 * `pnpm storybook:design-system` remain the focused single-package views.
 *
 * Everything but the story set is inherited. This directory sits beside
 * `../.storybook`, so the base globs stay correct at this depth, and
 * `preview.tsx` re-exports the base preview rather than restating it.
 */
const config: StorybookConfig = {
  ...base,
  stories: [
    ...(base.stories as string[]),
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../../../packages/design-system/src/**/*.stories.@(ts|tsx)",
  ],
};
export default config;
